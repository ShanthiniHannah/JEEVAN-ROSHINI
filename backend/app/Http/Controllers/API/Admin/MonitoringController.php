<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Family;
use App\Models\HealthRecord;
use App\Models\Individual;
use App\Models\Visit;
use Illuminate\Http\Request;

/**
 * MonitoringController — Super Admin read-only access to all field data.
 * All data is read-only by default. Edit only when explicitly authorized.
 */
class MonitoringController extends Controller
{
    public function families(Request $request)
    {
        $families = Family::query()
            ->with(['village.block.district.state', 'vhw'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('house_no', 'like', "%{$request->search}%")
                  ->orWhere('family_code', 'like', "%{$request->search}%");
            })
            ->when($request->village_id, fn($q) => $q->where('village_id', $request->village_id))
            ->when($request->state_id, fn($q) => $q->where('state_id', $request->state_id))
            ->orderBy('created_at', 'desc')
            ->paginate(25);

        return response()->json($families);
    }

    public function individuals(Request $request)
    {
        $individuals = Individual::query()
            ->with(['family.village'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('individual_code', 'like', "%{$request->search}%");
            })
            ->when($request->family_id, fn($q) => $q->where('family_id', $request->family_id))
            ->when($request->gender, fn($q) => $q->where('gender', $request->gender))
            ->orderBy('name')
            ->paginate(25);

        return response()->json($individuals);
    }

    public function healthRecords(Request $request)
    {
        $records = HealthRecord::query()
            ->with(['individual', 'recordedBy'])
            ->when($request->individual_id, fn($q) => $q->where('individual_id', $request->individual_id))
            ->orderBy('recorded_on', 'desc')
            ->paginate(25);

        return response()->json($records);
    }

    public function visitLogs(Request $request)
    {
        $visits = Visit::query()
            ->with(['family.village', 'user'])
            ->when($request->vhw_id, fn($q) => $q->where('user_id', $request->vhw_id))
            ->when($request->family_id, fn($q) => $q->where('family_id', $request->family_id))
            ->when($request->date_from, fn($q) => $q->whereDate('visit_date', '>=', $request->date_from))
            ->when($request->date_to, fn($q) => $q->whereDate('visit_date', '<=', $request->date_to))
            ->orderBy('visit_date', 'desc')
            ->paginate(25);

        return response()->json($visits);
    }
}
