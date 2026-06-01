<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\MobileSyncController;
use Illuminate\Http\Request;
use App\Models\Village;
use App\Models\Family;
use App\Models\Individual;
use App\Models\RiskAlert;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public Authentication endpoints
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (! $user || ! \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid email or password'], 401);
    }

    $token = $user->createToken('vhw-mobile-access')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleNames()->first(),
        ]
    ]);
});

// Protected Endpoints (Token-based Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // User profile detail
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // PWA Offline Queue Synchronization
    Route::post('/sync', [MobileSyncController::class, 'syncOfflineQueue']);

    // Attendance logging
    Route::post('/attendance/check-in', function (Request $request) {
        $request->validate(['gps_coords' => 'required']);
        
        $attendance = \App\Models\Attendance::create([
            'user_id' => $request->user()->id,
            'date' => now()->toDateString(),
            'check_in_time' => now()->toTimeString(),
            'gps_coords' => $request->gps_coords,
            'status' => 'Present',
        ]);

        return response()->json(['success' => true, 'data' => $attendance], 201);
    });

    Route::post('/attendance/check-out', function (Request $request) {
        $attendance = \App\Models\Attendance::where('user_id', $request->user()->id)
            ->where('date', now()->toDateString())
            ->first();

        if ($attendance) {
            $attendance->update(['check_out_time' => now()->toTimeString()]);
            return response()->json(['success' => true, 'data' => $attendance]);
        }

        return response()->json(['success' => false, 'message' => 'No check-in record found for today.'], 404);
    });

    // Leave request applications
    Route::post('/leaves/apply', function (Request $request) {
        $request->validate([
            'start_date' => 'required|date',
            'days_count' => 'required|integer',
            'reason' => 'required|string',
        ]);

        $leave = \App\Models\LeaveRequest::create([
            'user_id' => $request->user()->id,
            'start_date' => $request->start_date,
            'days_count' => $request->days_count,
            'reason' => $request->reason,
            'status' => 'Pending',
        ]);

        return response()->json(['success' => true, 'data' => $leave], 201);
    });
});

// Admin Monitoring Analytics (Open for dashboard visualization)
Route::get('/analytics/overview', function () {
    return response()->json([
        'totals' => [
            'villages' => Village::count(),
            'families' => Family::count(),
            'individuals' => Individual::count(),
            'risk_alerts' => RiskAlert::where('status', 'Active')->count(),
        ],
        'disease_prevalence' => [
            'diabetes' => \App\Models\HealthRecord::whereJsonContains('chronic_diseases', 'Diabetes')->count(),
            'hypertension' => \App\Models\HealthRecord::whereJsonContains('chronic_diseases', 'Hypertension')->count(),
            'tb' => \App\Models\HealthRecord::whereJsonContains('chronic_diseases', 'Tuberculosis')->count(),
        ]
    ]);
});
