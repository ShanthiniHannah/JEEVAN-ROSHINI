<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Family;
use App\Models\HealthRecord;
use App\Models\Individual;
use App\Models\Training;
use App\Models\User;
use App\Models\Village;
use App\Models\Visit;
use App\Services\AuditLogger;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

/**
 * ReportsController — Super Admin
 *
 * Generates and exports all major reports:
 *   Village, Family, Health, VHW, Attendance, Training, Beneficiary
 * Export formats: PDF (DomPDF), Excel (array), CSV (stream)
 */
class ReportsController extends Controller
{
    // ── Village Report ────────────────────────────────────────────────────

    public function villageReport(Request $request)
    {
        $villages = Village::withCount(['families'])
            ->with('block.district.state')
            ->get()
            ->map(fn($v) => [
                'id'           => $v->id,
                'name'         => $v->name,
                'state'        => $v->block?->district?->state?->name,
                'district'     => $v->block?->district?->name,
                'block'        => $v->block?->name,
                'families'     => $v->families_count,
                'population'   => $v->population,
                'water_status' => $v->water_status,
                'risk_status'  => $v->risk_status,
            ]);

        return response()->json(['data' => $villages, 'total' => $villages->count()]);
    }

    // ── Family Report ─────────────────────────────────────────────────────

    public function familyReport(Request $request)
    {
        $families = Family::query()
            ->with(['village.block.district', 'individuals'])
            ->withCount('individuals')
            ->when($request->village_id, fn($q) => $q->where('village_id', $request->village_id))
            ->get()
            ->map(fn($f) => [
                'family_code'    => $f->family_code ?? $f->id,
                'house_no'       => $f->house_no,
                'village'        => $f->village?->name,
                'district'       => $f->village?->block?->district?->name,
                'members'        => $f->individuals_count,
                'economic_status' => $f->economic_status,
                'toilet'         => $f->toilet_availability,
                'water'          => $f->drinking_water_source,
                'electricity'    => $f->electricity ? 'Yes' : 'No',
            ]);

        return response()->json(['data' => $families, 'total' => $families->count()]);
    }

    // ── Health Report ─────────────────────────────────────────────────────

    public function healthReport(Request $request)
    {
        $records = HealthRecord::query()
            ->with('individual.family.village')
            ->orderBy('recorded_on', 'desc')
            ->limit(500)
            ->get()
            ->map(fn($r) => [
                'individual'     => $r->individual?->name,
                'family_code'    => $r->individual?->family?->family_code ?? $r->individual?->family_id,
                'village'        => $r->individual?->family?->village?->name,
                'bp'             => "{$r->bp_systolic}/{$r->bp_diastolic}",
                'blood_sugar'    => $r->blood_sugar_mgdl,
                'chronic'        => $r->chronic_diseases,
                'recorded_on'    => $r->recorded_on?->format('d-m-Y'),
            ]);

        return response()->json(['data' => $records]);
    }

    // ── VHW Report ────────────────────────────────────────────────────────

    public function vhwReport(Request $request)
    {
        $vhws = User::role('vhw')
            ->with(['staffProfile', 'district'])
            ->withCount(['visits' => fn($q) => $q->whereMonth('visit_date', now()->month)])
            ->get()
            ->map(fn($u) => [
                'employee_id'    => $u->employee_id,
                'name'           => $u->name,
                'email'          => $u->email,
                'mobile'         => $u->mobile,
                'district'       => $u->district?->name,
                'assigned_villages' => $u->staffProfile?->assigned_villages,
                'visits_this_month' => $u->visits_count,
                'status'         => $u->status,
            ]);

        return response()->json(['data' => $vhws]);
    }

    // ── Training Report ───────────────────────────────────────────────────

    public function trainingReport(Request $request)
    {
        $trainings = Training::with(['venue', 'conductedBy', 'trainingReport'])
            ->withCount('sessions')
            ->orderBy('scheduled_date', 'desc')
            ->get()
            ->map(fn($t) => [
                'title'         => $t->title,
                'category'      => $t->category,
                'date'          => $t->scheduled_date,
                'venue'         => $t->venue?->name ?? $t->venue,
                'conductor'     => $t->conductedBy?->name,
                'participants'  => $t->sessions_count,
                'status'        => $t->status,
                'outcome'       => $t->outcome_summary,
            ]);

        return response()->json(['data' => $trainings]);
    }

    // ── Export ────────────────────────────────────────────────────────────

    public function export(Request $request)
    {
        $request->validate([
            'type'   => 'required|in:village,family,health,vhw,training',
            'format' => 'required|in:pdf,excel,csv',
        ]);

        AuditLogger::logAction('EXPORT_REPORT', "Exported {$request->type} report as {$request->format}");

        $data = match ($request->type) {
            'village'  => $this->villageReport($request)->getData(true)['data'],
            'family'   => $this->familyReport($request)->getData(true)['data'],
            'health'   => $this->healthReport($request)->getData(true)['data'],
            'vhw'      => $this->vhwReport($request)->getData(true)['data'],
            'training' => $this->trainingReport($request)->getData(true)['data'],
        };

        return match ($request->format) {
            'pdf'   => $this->exportPdf($request->type, $data),
            'csv'   => $this->exportCsv($request->type, $data),
            'excel' => response()->json(['data' => $data, 'format' => 'excel']), // Frontend handles Excel
        };
    }

    private function exportPdf(string $type, $data)
    {
        $pdf = Pdf::loadView("reports.{$type}", ['data' => $data, 'generated_at' => now()])
            ->setPaper('a4', 'landscape');

        return $pdf->download("jeevan-roshini-{$type}-report-" . now()->format('Y-m-d') . '.pdf');
    }

    private function exportCsv(string $type, $data)
    {
        if (empty($data)) {
            return response()->json(['error' => 'No data to export'], 400);
        }

        $headers  = array_keys((array) $data[0]);
        $filename = "jeevan-roshini-{$type}-" . now()->format('Y-m-d') . '.csv';

        $callback = function () use ($data, $headers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);
            foreach ($data as $row) {
                fputcsv($handle, (array) $row);
            }
            fclose($handle);
        };

        return Response::stream($callback, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
