<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BmiRecord;
use App\Models\Training;
use App\Models\TrainingEvidence;
use App\Models\TrainingMaterial;
use App\Models\TrainingReport;
use App\Models\TrainingSession;
use App\Models\TrainingVenue;
use App\Models\User;
use App\Services\AuditLogger;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * TrainingController — Training & Capacity Building Module
 *
 * Manages the full training workflow:
 *   Create → Assign VHWs → Upload Materials → Conduct → Mark Attendance
 *   → Upload Evidence → Submit Report → Generate PDF Certificate
 */
class TrainingController extends Controller
{
    // ── Training CRUD ──────────────────────────────────────────────────────

    public function listVhwUsers()
    {
        $vhws = User::role('vhw')->where('status', 'Active')->orderBy('name')->get();
        return response()->json($vhws);
    }

    public function index(Request $request)
    {
        $trainings = Training::query()
            ->with(['venue', 'conductedBy', 'trainingReport'])
            ->withCount('sessions')
            ->when($request->user()->hasRole('project-director'), fn($q) => $q->where('conducted_by', $request->user()->id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->orderBy('scheduled_date', 'desc')
            ->paginate(20);

        return response()->json($trainings);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'                => 'required|string|max:200',
            'category'             => 'required|string',
            'scheduled_date'       => 'required|date',
            'start_time'           => 'nullable|date_format:H:i',
            'end_time'             => 'nullable|date_format:H:i',
            'venue'                => 'nullable|string|max:200',
            'venue_id'             => 'nullable|exists:training_venues,id',
            'instructor'           => 'nullable|string|max:100',
            'expected_participants' => 'nullable|integer|min:1',
            'description'          => 'nullable|string',
        ]);

        $training = Training::create($request->only(
            'title', 'category', 'scheduled_date', 'start_time', 'end_time',
            'venue', 'venue_id', 'instructor', 'expected_participants', 'description'
        ) + ['conducted_by' => $request->user()->id, 'status' => 'Scheduled']);

        AuditLogger::logAction('CREATE_TRAINING', "Created training: {$training->title}");

        return response()->json(['success' => true, 'data' => $training->load('venue', 'conductedBy')], 201);
    }

    public function show(int $id)
    {
        $training = Training::with([
            'venue', 'conductedBy', 'sessions.user',
            'materials', 'evidence', 'trainingReport.submittedBy',
        ])->findOrFail($id);

        return response()->json($training);
    }

    public function update(Request $request, int $id)
    {
        $training = Training::findOrFail($id);
        $training->update($request->only(
            'title', 'category', 'scheduled_date', 'start_time', 'end_time',
            'venue', 'venue_id', 'instructor', 'expected_participants', 'description',
            'status', 'training_notes', 'outcome_summary'
        ));

        return response()->json(['success' => true, 'data' => $training]);
    }

    // ── Attendance ─────────────────────────────────────────────────────────

    public function sessions(int $id)
    {
        $sessions = TrainingSession::where('training_id', $id)
            ->with('user')
            ->get();

        $total    = $sessions->count();
        $present  = $sessions->where('attendance_status', 'Present')->count();
        $percentage = $total > 0 ? round(($present / $total) * 100, 1) : 0;

        return response()->json([
            'sessions'           => $sessions,
            'total'              => $total,
            'present'            => $present,
            'attendance_percent' => $percentage,
        ]);
    }

    public function markAttendance(Request $request, int $id)
    {
        $request->validate([
            'attendance' => 'required|array',
            'attendance.*.user_id'           => 'required|exists:users,id',
            'attendance.*.attendance_status' => 'required|in:Present,Absent,Late',
        ]);

        foreach ($request->attendance as $record) {
            TrainingSession::updateOrCreate(
                ['training_id' => $id, 'user_id' => $record['user_id']],
                [
                    'attended'           => $record['attendance_status'] === 'Present',
                    'attendance_status'  => $record['attendance_status'],
                    'completed_at'       => $record['attendance_status'] === 'Present' ? now() : null,
                ]
            );
        }

        return response()->json(['success' => true, 'message' => 'Attendance saved successfully.']);
    }

    // ── Materials ──────────────────────────────────────────────────────────

    public function materials(int $id)
    {
        return response()->json(
            TrainingMaterial::where('training_id', $id)->with('uploadedBy')->get()
        );
    }

    public function uploadMaterial(Request $request, int $id)
    {
        $request->validate([
            'file'  => 'required|file|max:51200', // 50MB max
            'title' => 'required|string|max:200',
        ]);

        $file = $request->file('file');
        $path = Storage::disk('local')->putFile("training_materials/{$id}", $file);

        $material = TrainingMaterial::create([
            'training_id'   => $id,
            'title'         => $request->title,
            'file_path'     => $path,
            'file_name'     => $file->getClientOriginalName(),
            'mime_type'     => $file->getMimeType(),
            'file_size_kb'  => (int) ($file->getSize() / 1024),
            'material_type' => str_starts_with($file->getMimeType(), 'video/') ? 'Video'
                : (str_starts_with($file->getMimeType(), 'audio/') ? 'Audio'
                    : (str_starts_with($file->getMimeType(), 'image/') ? 'Image' : 'Document')),
            'uploaded_by'   => $request->user()->id,
        ]);

        return response()->json(['success' => true, 'data' => $material], 201);
    }

    // ── Evidence (Photos/Videos for donor reporting) ──────────────────────

    public function uploadEvidence(Request $request, int $id)
    {
        $request->validate([
            'type'         => 'required|in:Photo,Video,Note',
            'caption'      => 'nullable|string|max:300',
            'note_content' => 'required_if:type,Note|nullable|string',
            'file'         => 'required_unless:type,Note|nullable|file|max:102400', // 100MB for video
        ]);

        $path = null;
        if ($request->hasFile('file')) {
            $path = Storage::disk('local')->putFile("training_evidence/{$id}", $request->file('file'));
        }

        $evidence = TrainingEvidence::create([
            'training_id'  => $id,
            'type'         => $request->type,
            'file_path'    => $path,
            'caption'      => $request->caption,
            'note_content' => $request->note_content,
            'uploaded_by'  => $request->user()->id,
        ]);

        return response()->json(['success' => true, 'data' => $evidence], 201);
    }

    // ── Training Report & PDF ─────────────────────────────────────────────

    public function submitReport(Request $request, int $id)
    {
        $request->validate([
            'topics_covered'    => 'required|string',
            'participants_count' => 'required|integer|min:0',
            'outcome'           => 'required|string',
            'remarks'           => 'nullable|string',
        ]);

        $training        = Training::findOrFail($id);
        $photosCount     = TrainingEvidence::where('training_id', $id)->where('type', 'Photo')->count();
        $videosCount     = TrainingEvidence::where('training_id', $id)->where('type', 'Video')->count();

        $report = TrainingReport::updateOrCreate(
            ['training_id' => $id],
            [
                'topics_covered'    => $request->topics_covered,
                'participants_count' => $request->participants_count,
                'photos_count'      => $photosCount,
                'videos_count'      => $videosCount,
                'outcome'           => $request->outcome,
                'remarks'           => $request->remarks,
                'submitted_by'      => $request->user()->id,
                'submitted_at'      => now(),
            ]
        );

        $training->update(['status' => 'Completed']);

        AuditLogger::logAction('SUBMIT_TRAINING_REPORT', "Submitted report for training: {$training->title}");

        return response()->json(['success' => true, 'data' => $report], 201);
    }

    public function downloadReportPdf(int $id)
    {
        $training = Training::with([
            'venue', 'conductedBy', 'sessions.user',
            'materials', 'evidence', 'trainingReport.submittedBy',
        ])->findOrFail($id);

        $sessions      = TrainingSession::where('training_id', $id)->with('user')->get();
        $present       = $sessions->where('attendance_status', 'Present')->count();
        $attendancePct = $sessions->count() > 0 ? round(($present / $sessions->count()) * 100, 1) : 0;

        $pdf = Pdf::loadView('reports.training', [
            'training'       => $training,
            'sessions'       => $sessions,
            'attendance_pct' => $attendancePct,
            'generated_at'   => now()->format('d-m-Y H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->download("training-report-{$training->id}-" . now()->format('Y-m-d') . '.pdf');
    }

    // ── Venues ─────────────────────────────────────────────────────────────

    public function indexVenues(Request $request)
    {
        $venues = TrainingVenue::query()
            ->with('district')
            ->when($request->district_id, fn($q) => $q->where('district_id', $request->district_id))
            ->where('status', 'Active')
            ->orderBy('name')
            ->get();

        return response()->json($venues);
    }

    public function storeVenue(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:200',
            'district_id'    => 'nullable|exists:districts,id',
            'capacity'       => 'nullable|integer|min:1',
            'contact_person' => 'nullable|string|max:100',
            'contact_number' => 'nullable|string|max:15',
        ]);

        $venue = TrainingVenue::create($request->only(
            'name', 'address', 'village_id', 'district_id',
            'maps_link', 'capacity', 'contact_person', 'contact_number'
        ) + ['status' => 'Active']);

        return response()->json(['success' => true, 'data' => $venue], 201);
    }

    public function updateVenue(Request $request, int $id)
    {
        $venue = TrainingVenue::findOrFail($id);
        $venue->update($request->only('name', 'address', 'capacity', 'contact_person', 'contact_number', 'status'));

        return response()->json(['success' => true, 'data' => $venue]);
    }
}
