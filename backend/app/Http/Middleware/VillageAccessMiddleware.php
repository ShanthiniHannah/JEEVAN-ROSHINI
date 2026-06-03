<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VillageAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Super Admin and Project Director have global access
        if ($user->hasRole('super-admin') || $user->hasRole('project-director')) {
            return $next($request);
        }

        // Get the village ID from route or request
        $villageId = $request->route('village') ?? $request->input('village_id');

        if ($villageId) {
            $profile = $user->staffProfile;
            $assignedVillages = $profile ? ($profile->assigned_villages ?? []) : [];

            if (! in_array($villageId, $assignedVillages)) {
                return response()->json([
                    'message' => 'Forbidden. You are not authorized to access or submit data for village: '.$villageId,
                ], 403);
            }
        }

        return $next($request);
    }
}
