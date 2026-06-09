<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\User;
use App\Models\Village;
use App\Services\AuditLogger;
use App\Mail\UserCredentialsMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

/**
 * UserManagementController — Super Admin
 *
 * Create, manage, activate/deactivate Project Directors and VHWs.
 * System auto-generates temporary passwords on creation.
 */
class UserManagementController extends Controller
{
    // ── List Users ────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $users = User::query()
            ->with(['roles', 'district', 'staffProfile'])
            ->when($request->role, fn($q) => $q->role($request->role))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($inner) use ($request) {
                    $inner->where('name', 'like', "%{$request->search}%")
                          ->orWhere('email', 'like', "%{$request->search}%")
                          ->orWhere('mobile', 'like', "%{$request->search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(25);

        return response()->json($users);
    }

    // ── Create Project Director ───────────────────────────────────────────

    public function createProjectDirector(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'email'       => 'required|email|unique:users,email',
            'mobile'      => 'required|string|max:15',
            'district_id' => 'required|exists:districts,id',
        ]);

        $tempPassword   = 'JR@' . strtoupper(Str::random(6));
        $employeeId     = 'JR-DIR-' . str_pad(User::role('project-director')->count() + 1, 4, '0', STR_PAD_LEFT);

        $user = User::create([
            'name'                => $request->name,
            'email'               => $request->email,
            'mobile'              => $request->mobile,
            'password'            => Hash::make($tempPassword),
            'employee_id'         => $employeeId,
            'district_id'         => $request->district_id,
            'status'              => 'Active',
            'must_change_password' => true,
            'created_by'          => $request->user()->id,
        ]);

        $user->assignRole('project-director');

        AuditLogger::logAction('CREATE_PROJECT_DIRECTOR', "Created Project Director: {$user->name} ({$employeeId})");

        $user->load('district');
        $assignedArea = "No district assigned";
        if ($user->district) {
            $assignedArea = "District: " . $user->district->name . ", State: " . $user->district->state;
        }

        try {
            Mail::to($user->email)->send(new UserCredentialsMail($user, $tempPassword, $assignedArea));
        } catch (\Exception $e) {
            \Log::error("Failed to send welcome email to {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success'      => true,
            'data'         => $user->load('roles', 'district'),
            'temp_password' => $tempPassword, // Return once — display to admin to share securely
        ], 201);
    }

    // ── Create VHW ────────────────────────────────────────────────────────

    public function createVhw(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'email'       => 'required|email|unique:users,email',
            'mobile'      => 'required|string|max:15',
            'district_id' => 'nullable|exists:districts,id',
        ]);

        $tempPassword = 'JR@' . strtoupper(Str::random(6));
        $employeeId   = 'JR-VHW-' . str_pad(User::role('vhw')->count() + 1, 5, '0', STR_PAD_LEFT);

        $user = User::create([
            'name'                => $request->name,
            'email'               => $request->email,
            'mobile'              => $request->mobile,
            'password'            => Hash::make($tempPassword),
            'employee_id'         => $employeeId,
            'district_id'         => $request->district_id,
            'status'              => 'Active',
            'must_change_password' => true,
            'created_by'          => $request->user()->id,
        ]);

        $user->assignRole('vhw');

        // Assign villages if provided
        if ($request->assigned_villages) {
            $user->staffProfile()->updateOrCreate(
                ['user_id' => $user->id],
                ['designation' => 'Village Health Worker']
            );
            $villageIds = Village::whereIn('village_code', $request->assigned_villages)->pluck('id')->toArray();
            $user->assignedVillages()->sync($villageIds);
        }

        AuditLogger::logAction('CREATE_VHW', "Created VHW: {$user->name} ({$employeeId})");

        $user->load('district');
        $assignedArea = "No district assigned";
        if ($user->district) {
            $assignedArea = "District: " . $user->district->name . ", State: " . $user->district->state;
        }
        if ($request->assigned_villages && count($request->assigned_villages) > 0) {
            $assignedArea .= " | Villages: " . implode(', ', $request->assigned_villages);
        }

        try {
            Mail::to($user->email)->send(new UserCredentialsMail($user, $tempPassword, $assignedArea));
        } catch (\Exception $e) {
            \Log::error("Failed to send welcome email to {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success'       => true,
            'data'          => $user->load('roles', 'staffProfile'),
            'temp_password' => $tempPassword,
        ], 201);
    }

    // ── Toggle User Status ────────────────────────────────────────────────

    public function toggleStatus(Request $request, int $id)
    {
        $user       = User::findOrFail($id);
        $newStatus  = $user->status === 'Active' ? 'Suspended' : 'Active';

        $user->update(['status' => $newStatus]);
        AuditLogger::logAction('TOGGLE_USER_STATUS', "Changed {$user->name} status to {$newStatus}");

        return response()->json(['success' => true, 'data' => $user, 'new_status' => $newStatus]);
    }

    // ── Reset Password ────────────────────────────────────────────────────

    public function resetPassword(Request $request, int $id)
    {
        $user         = User::findOrFail($id);
        $tempPassword = 'JR@' . strtoupper(Str::random(6));

        $user->update([
            'password'            => Hash::make($tempPassword),
            'must_change_password' => true,
        ]);

        AuditLogger::logAction('RESET_PASSWORD', "Reset password for {$user->name} ({$user->employee_id})");

        return response()->json([
            'success'       => true,
            'message'       => 'Password reset successfully.',
            'temp_password' => $tempPassword,
        ]);
    }

    // ── Assign Area ───────────────────────────────────────────────────────

    public function assignArea(Request $request, int $id)
    {
        $request->validate([
            'district_id'      => 'nullable|exists:districts,id',
            'assigned_villages' => 'nullable|array',
        ]);

        $user = User::findOrFail($id);
        $user->update(['district_id' => $request->district_id]);

        if ($request->assigned_villages !== null) {
            $user->staffProfile()->updateOrCreate(
                ['user_id' => $user->id],
                ['designation' => 'Village Health Worker']
            );
            $villageIds = Village::whereIn('village_code', $request->assigned_villages)->pluck('id')->toArray();
            $user->assignedVillages()->sync($villageIds);
        }

        AuditLogger::logAction('ASSIGN_AREA', "Assigned area to {$user->name}");

        return response()->json(['success' => true, 'data' => $user->load('staffProfile', 'district')]);
    }

    // ── Roles & Permissions ───────────────────────────────────────────────

    public function listRoles()
    {
        $roles = Role::with('permissions')->get()->map(fn($r) => [
            'id'          => $r->id,
            'name'        => $r->name,
            'permissions' => $r->permissions->pluck('name'),
            'users_count' => User::role($r->name)->count(),
        ]);

        return response()->json($roles);
    }

    // ── Project Director VHW management methods ───────────────────────────

    public function listVhwsDirector(Request $request)
    {
        $user = $request->user();
        $vhws = User::role('vhw')
            ->where('district_id', $user->district_id)
            ->with(['roles', 'staffProfile'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($vhws);
    }

    public function createVhwDirector(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:100',
            'email'  => 'required|email|unique:users,email',
            'mobile' => 'required|string|max:15',
        ]);

        $director = $request->user();

        if (!$director->district_id) {
            return response()->json(['success' => false, 'message' => 'Director does not have an assigned district.'], 400);
        }

        $tempPassword = 'JR@' . strtoupper(Str::random(6));
        $employeeId   = 'JR-VHW-' . str_pad(User::role('vhw')->count() + 1, 5, '0', STR_PAD_LEFT);

        $user = User::create([
            'name'                 => $request->name,
            'email'                => $request->email,
            'mobile'               => $request->mobile,
            'password'             => Hash::make($tempPassword),
            'employee_id'          => $employeeId,
            'district_id'          => $director->district_id,
            'status'               => 'Active',
            'must_change_password' => true,
            'created_by'           => $director->id,
        ]);

        $user->assignRole('vhw');

        // Assign villages if provided
        $user->staffProfile()->updateOrCreate(
            ['user_id' => $user->id],
            ['designation' => 'Village Health Worker']
        );
        if ($request->assigned_villages) {
            $villageIds = Village::whereIn('village_code', $request->assigned_villages)->pluck('id')->toArray();
            $user->assignedVillages()->sync($villageIds);
        }

        AuditLogger::logAction('CREATE_VHW_DIRECTOR', "Project Director {$director->name} created VHW: {$user->name} ({$employeeId})");

        $user->load('district');
        $assignedArea = "No district assigned";
        if ($user->district) {
            $assignedArea = "District: " . $user->district->name . ", State: " . $user->district->state;
        }
        if ($request->assigned_villages && count($request->assigned_villages) > 0) {
            $assignedArea .= " | Villages: " . implode(', ', $request->assigned_villages);
        }

        try {
            Mail::to($user->email)->send(new UserCredentialsMail($user, $tempPassword, $assignedArea));
        } catch (\Exception $e) {
            \Log::error("Failed to send welcome email to {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success'       => true,
            'data'          => $user->load('roles', 'staffProfile'),
            'temp_password' => $tempPassword,
        ], 201);
    }
}
