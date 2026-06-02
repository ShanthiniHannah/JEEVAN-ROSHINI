<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\AuditLogger;

class AuthController extends Controller
{
    /**
     * Authenticate user and return a Sanctum API token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        if ($user->status !== 'Active') {
            return response()->json(['message' => 'This account has been suspended.'], 403);
        }

        // Generate Sanctum plain text token
        $token = $user->createToken('jeevan-roshini-api-token')->plainTextToken;

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
            ]
        ]);
    }

    /**
     * Fetch the authenticated user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
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
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Log the logout action before token deletion
        AuditLogger::logLogout();

        // Delete active tokens (TransientToken has no delete method)
        $token = $request->user()->currentAccessToken();
        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
