<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use App\Models\Notification;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use App\Services\AuditLogger;

class ApprovalController extends Controller
{
    /**
     * Get pending approvals for the current user's role/jurisdiction.
     * Or if VHW, get their requested approvals.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->hasRole('project-director') || $user->hasRole('super-admin')) {
            // For now, load all pending approvals
            $approvals = Approval::with('requestedBy')->where('status', 'Pending')->orderBy('created_at', 'desc')->get();
        } else {
            // VHW sees their own requests
            $approvals = Approval::with('requestedBy')->where('requested_by', $user->id)->orderBy('created_at', 'desc')->get();
        }

        return response()->json(['success' => true, 'data' => $approvals]);
    }

    /**
     * Process an approval (Approve or Reject)
     */
    public function process(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Rejected',
            'notes' => 'nullable|string'
        ]);

        $user = $request->user();
        $approval = Approval::findOrFail($id);

        if ($approval->status !== 'Pending') {
            return response()->json(['success' => false, 'message' => 'Already processed'], 400);
        }

        // Update Approval Record
        $approval->update([
            'status' => $request->status,
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'reviewer_notes' => $request->notes
        ]);

        // If it's a LeaveRequest, update the LeaveRequest model too
        if ($approval->approvable_type === LeaveRequest::class) {
            $leave = LeaveRequest::find($approval->approvable_id);
            if ($leave) {
                $leave->update([
                    'status' => $request->status,
                    'reviewed_by' => $user->id,
                    'reviewed_at' => now(),
                    'reviewer_notes' => $request->notes
                ]);
            }
        }

        // Dispatch Notification back to requester
        Notification::create([
            'user_id' => $approval->requested_by,
            'type' => 'System Push',
            'recipient_address' => 'System',
            'title' => "Request {$request->status}",
            'message_body' => "Your request was {$request->status} by {$user->name}. Notes: {$request->notes}",
            'status' => 'Pending',
            'sent_at' => now()
        ]);

        AuditLogger::logAction("APPROVAL_{$request->status}", "Approval {$id} processed by {$user->name}");

        return response()->json(['success' => true, 'data' => $approval]);
    }
}
