<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Authenticate user and return a Sanctum API token.
     *
     * @return JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        if ($user->status !== 'Active') {
            return response()->json(['message' => 'This account has been suspended.'], 403);
        }

        if ($user->must_change_password) {
            return response()->json([
                'requires_password_change' => true,
                'message' => 'You must change your temporary password before proceeding.'
            ], 403);
        }

        // Generate Sanctum plain text token
        $token = $user->createToken('jeevan-roshini-api-token')->plainTextToken;

        // Automatically create daily attendance session for VHW on login
        if ($user->hasRole('vhw')) {
            $todaySession = \App\Models\DailySession::where('vhw_id', $user->id)
                ->whereDate('session_date', \Carbon\Carbon::today()->toDateString())
                ->first();
            if (!$todaySession) {
                \App\Models\DailySession::create([
                    'vhw_id' => $user->id,
                    'session_date' => \Carbon\Carbon::today()->toDateString(),
                    'login_time' => \Carbon\Carbon::now()->toTimeString(),
                    'attendance_status' => 'Present',
                ]);
            }
        }

        // Perform audit log
        auth()->setUser($user);
        AuditLogger::logLogin();

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first() ?? 'vhw',
            ],
        ]);
    }

    /**
     * Fetch the authenticated user profile.
     *
     * @return JsonResponse
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleNames()->first() ?? 'vhw',
        ]);
    }

    /**
     * Revoke the user's active API tokens.
     *
     * @return JsonResponse
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        // Update daily session logout_time if VHW
        if ($user && $user->hasRole('vhw')) {
            $todaySession = \App\Models\DailySession::where('vhw_id', $user->id)
                ->whereDate('session_date', \Carbon\Carbon::today()->toDateString())
                ->first();
            if ($todaySession) {
                $todaySession->update([
                    'logout_time' => \Carbon\Carbon::now()->toTimeString(),
                ]);
            }
        }

        // Log the logout action before token deletion
        AuditLogger::logLogout();

        // Delete active tokens (TransientToken has no delete method)
        $token = $request->user()->currentAccessToken();
        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * Change password for users forced to reset (using their current temp password).
     *
     * @return JsonResponse
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Invalid email or current password'], 401);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
            'must_change_password' => false,
        ]);

        // Automatically log them in after changing password
        $token = $user->createToken('jeevan-roshini-api-token')->plainTextToken;

        // Automatically create daily attendance session for VHW
        if ($user->hasRole('vhw')) {
            $todaySession = \App\Models\DailySession::where('vhw_id', $user->id)
                ->whereDate('session_date', \Carbon\Carbon::today()->toDateString())
                ->first();
            if (!$todaySession) {
                \App\Models\DailySession::create([
                    'vhw_id' => $user->id,
                    'session_date' => \Carbon\Carbon::today()->toDateString(),
                    'login_time' => \Carbon\Carbon::now()->toTimeString(),
                    'attendance_status' => 'Present',
                ]);
            }
        }

        auth()->setUser($user);
        AuditLogger::logAction('PASSWORD_CHANGED', 'User successfully changed their temporary password.');
        AuditLogger::logLogin();

        return response()->json([
            'message' => 'Password changed successfully',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first() ?? 'vhw',
            ],
        ]);
    }
}
