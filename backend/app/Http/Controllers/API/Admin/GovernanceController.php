<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\District;
use App\Models\Family;
use App\Models\Individual;
use App\Models\Project;
use App\Models\State;
use App\Models\User;
use App\Models\Village;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

/**
 * GovernanceController — Super Admin
 *
 * Manages the core geographic and project hierarchy:
 *   States → Districts → Blocks → Villages → Projects
 */
class GovernanceController extends Controller
{
    // ── States ────────────────────────────────────────────────────────────

    public function indexStates(Request $request)
    {
        $states = State::query()
            ->withCount(['districts'])
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->orderBy('name')
            ->get();

        return response()->json($states);
    }

    public function storeState(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:100',
            'code'   => 'required|string|max:5|unique:states,code',
            'region' => 'nullable|string|max:50',
            'type'   => 'nullable|in:State,Union Territory',
        ]);

        $state = State::create($request->only('name', 'code', 'region', 'type') + ['status' => 'Active']);
        AuditLogger::logAction('CREATE_STATE', "Created state: {$state->name} ({$state->code})");

        return response()->json(['success' => true, 'data' => $state], 201);
    }

    public function updateState(Request $request, int $id)
    {
        $state = State::findOrFail($id);
        $request->validate(['name' => 'required|string', 'status' => 'in:Active,Inactive']);
        $state->update($request->only('name', 'region', 'status'));

        return response()->json(['success' => true, 'data' => $state]);
    }

    // ── Districts ─────────────────────────────────────────────────────────

    public function indexDistricts(Request $request)
    {
        $districts = District::query()
            ->with('state')
            ->withCount(['blocks', 'villages'])
            ->when($request->state_id, fn($q) => $q->where('state_id', $request->state_id))
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy('name')
            ->get();

        return response()->json($districts);
    }

    public function storeDistrict(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:100',
            'state_id' => 'required|exists:states,id',
        ]);

        $district = District::create([
            'organization_id' => 1, // Default org
            'state_id'        => $request->state_id,
            'name'            => $request->name,
        ]);

        AuditLogger::logAction('CREATE_DISTRICT', "Created district: {$district->name}");

        return response()->json(['success' => true, 'data' => $district->load('state')], 201);
    }

    // ── Villages ──────────────────────────────────────────────────────────

    public function indexVillages(Request $request)
    {
        $villages = Village::query()
            ->with('block.district.state')
            ->withCount(['families'])
            ->when($request->district_id, function ($q) use ($request) {
                $q->whereHas('block', fn($b) => $b->where('district_id', $request->district_id));
            })
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy('name')
            ->get();

        return response()->json($villages);
    }

    public function storeVillage(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'district_id' => 'required|exists:districts,id',
        ]);

        // Auto-create a default block for the district if none exists
        $block = Block::firstOrCreate(
            ['district_id' => $request->district_id, 'name' => 'Default Block'],
            ['organization_id' => 1]
        );

        $villageCode = 'VLG-' . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $request->name), 0, 3))
            . '-' . str_pad(Village::count() + 1, 4, '0', STR_PAD_LEFT);

        $village = Village::create([
            'village_code'      => $villageCode,
            'block_id'          => $block->id,
            'name'              => $request->name,
            'population'        => $request->population ?? 0,
            'water_status'      => $request->water_status ?? 'Adequate',
            'sanitation_status' => $request->sanitation_status ?? 'Good',
            'risk_status'       => $request->risk_status ?? 'Low',
            'geo_lat'           => $request->geo_lat,
            'geo_lng'           => $request->geo_lng,
        ]);

        AuditLogger::logAction('CREATE_VILLAGE', "Created village: {$village->name} in district_id {$request->district_id}");

        return response()->json(['success' => true, 'data' => $village->load('block.district.state')], 201);
    }

    // ── Projects ──────────────────────────────────────────────────────────

    public function indexProjects(Request $request)
    {
        $projects = Project::query()
            ->with(['state', 'district', 'director'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->state_id, fn($q) => $q->where('state_id', $request->state_id))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($projects);
    }

    public function storeProject(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:200',
            'state_id'    => 'required|exists:states,id',
            'district_id' => 'nullable|exists:districts,id',
            'director_id' => 'nullable|exists:users,id',
            'start_date'  => 'nullable|date',
        ]);

        $state = State::find($request->state_id);
        $code  = 'JR-' . $state->code . '-' . strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $request->name), 0, 3))
            . '-' . str_pad(Project::count() + 1, 2, '0', STR_PAD_LEFT);

        $project = Project::create($request->only(
            'name', 'state_id', 'district_id', 'director_id', 'start_date', 'end_date', 'description'
        ) + ['code' => $code, 'status' => 'Pending']);

        AuditLogger::logAction('CREATE_PROJECT', "Created project: {$project->name} ({$project->code})");

        return response()->json(['success' => true, 'data' => $project->load('state', 'district', 'director')], 201);
    }

    public function approveProject(Request $request, int $id)
    {
        $project = Project::findOrFail($id);
        $project->update([
            'status'      => 'Active',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        AuditLogger::logAction('APPROVE_PROJECT', "Approved project: {$project->name}");

        return response()->json(['success' => true, 'data' => $project]);
    }

    // ── Summary for Dashboard ─────────────────────────────────────────────

    public function summary()
    {
        return response()->json([
            'total_states'    => State::count(),
            'total_districts' => District::count(),
            'total_villages'  => Village::count(),
            'total_families'  => Family::count(),
            'total_individuals' => Individual::count(),
            'total_vhws'      => User::role('vhw')->count(),
            'total_directors' => User::role('project-director')->count(),
        ]);
    }
}
