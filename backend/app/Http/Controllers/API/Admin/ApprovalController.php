<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use App\Models\Project;
use App\Models\BeneficiarySupport;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

/**
 * ApprovalController — Super Admin
 *
 * Manages approval queue for:
 *   - New Projects
 *   - District Setup
 *   - Village Setup
 *   - Project Director Creation
 *   - Major Beneficiary Support Requests
 */
class ApprovalController extends Controller
{
    public function index(Request $request)
    {
        $approvals = Approval::query()
            ->with(['requestedBy', 'reviewedBy'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('approvable_type', 'like', "%{$request->type}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($approvals);
    }

    public function approve(Request $request, int $id)
    {
        $request->validate(['notes' => 'nullable|string']);

        $approval = Approval::findOrFail($id);
        $approval->update([
            'status'        => 'Approved',
            'reviewed_by'   => $request->user()->id,
            'reviewer_notes' => $request->notes,
            'reviewed_at'   => now(),
        ]);

        // Activate the related project if applicable
        if ($approval->approvable_type === Project::class) {
            Project::find($approval->approvable_id)?->update([
                'status'      => 'Active',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);
        }

        AuditLogger::logAction('APPROVE_REQUEST', "Approved approval ID: {$id}");

        return response()->json(['success' => true, 'data' => $approval]);
    }

    public function reject(Request $request, int $id)
    {
        $request->validate(['notes' => 'required|string']);

        $approval = Approval::findOrFail($id);
        $approval->update([
            'status'        => 'Rejected',
            'reviewed_by'   => $request->user()->id,
            'reviewer_notes' => $request->notes,
            'reviewed_at'   => now(),
        ]);

        AuditLogger::logAction('REJECT_REQUEST', "Rejected approval ID: {$id} — {$request->notes}");

        return response()->json(['success' => true, 'data' => $approval]);
    }

    public function pendingCount()
    {
        return response()->json([
            'pending' => Approval::where('status', 'Pending')->count(),
        ]);
    }
}
