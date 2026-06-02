<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardDataController;
use App\Http\Controllers\API\MobileSyncController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Exposes the Jeevan Roshini RESTful API endpoints securely versioned 
| under the /api/v1/ prefix.
|
*/

Route::prefix('v1')->group(function () {
    // Public Authentication
    Route::post('/login', [AuthController::class, 'login']);

    // Protected Route Block
    Route::middleware(['auth:sanctum'])->group(function () {
        // Authenticated Session info
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        
        // Aggregate Dashboard & Analytics (Cached in Redis)
        Route::get('/dashboard', [DashboardDataController::class, 'dashboard']);

        // Geography Boundaries (Cached in Redis)
        Route::get('/villages', [DashboardDataController::class, 'getVillages']);

        // Family Registries
        Route::get('/families', [DashboardDataController::class, 'getFamilies']);
        Route::post('/families', [DashboardDataController::class, 'storeFamily']);

        // Patient Demographics & PII
        Route::get('/individuals', [DashboardDataController::class, 'getIndividuals']);
        Route::post('/individuals', [DashboardDataController::class, 'storeIndividual']);
        Route::post('/individuals/{id}/reveal', [DashboardDataController::class, 'revealPii']);

        // VHW Daily Household Visits
        Route::get('/visits', [DashboardDataController::class, 'getVisits']);
        Route::post('/visits', [DashboardDataController::class, 'storeVisit']);

        // VHW Shift Attendance
        Route::get('/attendances', [DashboardDataController::class, 'getAttendances']);
        Route::post('/attendance/check-in', [DashboardDataController::class, 'checkIn']);
        Route::post('/attendance/check-out', [DashboardDataController::class, 'checkOut']);

        // Leaves System
        Route::get('/leaves', [DashboardDataController::class, 'getLeaves']);
        Route::post('/leaves', [DashboardDataController::class, 'storeLeave']);

        // Approvals (Project Director only)
        Route::post('/approvals/action', [DashboardDataController::class, 'approvalAction'])->middleware('role:project-director');

        // Audit Trail Logs (Super Admin only)
        Route::get('/audits', [DashboardDataController::class, 'getAudits'])->middleware('role:super-admin');

        // Database backups (Super Admin only, rate limited)
        Route::post('/admin/backups', [DashboardDataController::class, 'runBackup'])->middleware('role:super-admin');

        // Offline PWA Sync Outbox
        Route::post('/sync', [MobileSyncController::class, 'syncOfflineQueue']);
    });
});
