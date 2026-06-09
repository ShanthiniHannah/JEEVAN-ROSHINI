<?php

use App\Http\Controllers\API\Admin\AnalyticsController;
use App\Http\Controllers\API\Admin\ApprovalController;
use App\Http\Controllers\API\Admin\GovernanceController;
use App\Http\Controllers\API\Admin\MonitoringController;
use App\Http\Controllers\API\Admin\ReportsController;
use App\Http\Controllers\API\Admin\UserManagementController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardDataController;
use App\Http\Controllers\API\MobileSyncController;
use App\Http\Controllers\API\FamilyRegisterController;
use App\Http\Controllers\API\TrainingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Jeevan Roshini v2
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Public ──────────────────────────────────────────────────────────
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // ── Authenticated ────────────────────────────────────────────────────
    Route::middleware(['auth:sanctum'])->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Dashboard & Analytics
        Route::get('/dashboard', [DashboardDataController::class, 'dashboard']);

        // Geography
        Route::get('/villages', [DashboardDataController::class, 'getVillages']);

        // Family Registries
        Route::get('/families', [DashboardDataController::class, 'getFamilies']);
        Route::post('/families', [DashboardDataController::class, 'storeFamily']);
        Route::post('/families/register', [FamilyRegisterController::class, 'register']);

        // Individuals
        Route::get('/individuals', [DashboardDataController::class, 'getIndividuals']);
        Route::post('/individuals', [DashboardDataController::class, 'storeIndividual']);
        Route::post('/individuals/{id}/reveal', [DashboardDataController::class, 'revealPii']);

        // VHW Visits
        Route::get('/visits', [DashboardDataController::class, 'getVisits']);
        Route::post('/visits', [DashboardDataController::class, 'storeVisit']);

        // Attendance
        Route::get('/attendances', [DashboardDataController::class, 'getAttendances']);
        Route::post('/attendance/check-in', [DashboardDataController::class, 'checkIn']);
        Route::post('/attendance/check-out', [DashboardDataController::class, 'checkOut']);

        // Leaves
        Route::get('/leaves', [DashboardDataController::class, 'getLeaves']);
        Route::post('/leaves', [DashboardDataController::class, 'storeLeave']);

        // Approvals (Unified Workflow)
        Route::get('/approvals', [\App\Http\Controllers\API\ApprovalController::class, 'index']);
        Route::post('/approvals/{id}/process', [\App\Http\Controllers\API\ApprovalController::class, 'process']);
        Route::get('/notifications', [\App\Http\Controllers\API\NotificationController::class, 'index']);
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\API\NotificationController::class, 'markAsRead']);

        // Community Programs
        Route::get('/community-programs', [\App\Http\Controllers\API\CommunityProgramController::class, 'index']);
        Route::post('/community-programs', [\App\Http\Controllers\API\CommunityProgramController::class, 'store'])->middleware('role:project-director|super-admin');

        // Approvals (Project Director)
        Route::post('/approvals/action', [DashboardDataController::class, 'approvalAction'])
            ->middleware('role:project-director');

        // Director VHW Management (Director can manage VHWs in their own district)
        Route::get('/director/vhws', [UserManagementController::class, 'listVhwsDirector'])
            ->middleware('role:project-director');
        Route::post('/director/vhws', [UserManagementController::class, 'createVhwDirector'])
            ->middleware('role:project-director');

        // Audit Logs (Super Admin only)
        Route::get('/audits', [DashboardDataController::class, 'getAudits'])
            ->middleware('role:super-admin');

        // Database Backups (Super Admin only)
        Route::post('/admin/backups', [DashboardDataController::class, 'runBackup'])
            ->middleware('role:super-admin');

        // Offline Sync
        Route::post('/sync', [MobileSyncController::class, 'syncOfflineQueue']);

        // ── Training Module (Project Director + Super Admin) ──────────────
        Route::prefix('trainings')->group(function () {
            Route::get('/vhws',          [TrainingController::class, 'listVhwUsers'])->middleware('role:project-director|super-admin');
            Route::get('/',              [TrainingController::class, 'index']);
            Route::post('/',             [TrainingController::class, 'store'])->middleware('role:project-director|super-admin');
            Route::get('/{id}',          [TrainingController::class, 'show']);
            Route::patch('/{id}',        [TrainingController::class, 'update'])->middleware('role:project-director|super-admin');
            Route::get('/{id}/sessions', [TrainingController::class, 'sessions']);
            Route::post('/{id}/sessions',[TrainingController::class, 'markAttendance'])->middleware('role:project-director');
            Route::get('/{id}/materials',[TrainingController::class, 'materials']);
            Route::post('/{id}/materials',[TrainingController::class, 'uploadMaterial'])->middleware('role:project-director');
            Route::post('/{id}/evidence', [TrainingController::class, 'uploadEvidence'])->middleware('role:project-director');
            Route::post('/{id}/report',   [TrainingController::class, 'submitReport'])->middleware('role:project-director');
            Route::get('/{id}/report/pdf',[TrainingController::class, 'downloadReportPdf']);
        });

        Route::prefix('training-venues')->group(function () {
            Route::get('/',     [TrainingController::class, 'indexVenues']);
            Route::post('/',    [TrainingController::class, 'storeVenue'])->middleware('role:project-director|super-admin');
            Route::patch('/{id}',[TrainingController::class, 'updateVenue'])->middleware('role:project-director|super-admin');
        });

        // ── Super Admin Governance ─────────────────────────────────────────
        Route::middleware('role:super-admin')->prefix('admin')->group(function () {

            // Dashboard Summary
            Route::get('/summary', [GovernanceController::class, 'summary']);

            // Analytics
            Route::get('/analytics/disease-trends', [AnalyticsController::class, 'diseaseTrends']);
            Route::get('/analytics/maternal-health', [AnalyticsController::class, 'maternalHealth']);
            Route::get('/analytics/child-nutrition', [AnalyticsController::class, 'childNutrition']);
            Route::get('/analytics/high-risk', [AnalyticsController::class, 'highRiskCases']);
            Route::get('/analytics/village-comparison', [AnalyticsController::class, 'villageComparison']);
            Route::get('/analytics/visit-audits', [AnalyticsController::class, 'visitAudits']);

            // Governance — States
            Route::get('/states',        [GovernanceController::class, 'indexStates']);
            Route::post('/states',       [GovernanceController::class, 'storeState']);
            Route::patch('/states/{id}', [GovernanceController::class, 'updateState']);

            // Governance — Districts
            Route::get('/districts',        [GovernanceController::class, 'indexDistricts']);
            Route::post('/districts',       [GovernanceController::class, 'storeDistrict']);

            // Governance — Villages
            Route::get('/villages',         [GovernanceController::class, 'indexVillages']);
            Route::post('/villages',        [GovernanceController::class, 'storeVillage']);

            // Governance — Projects
            Route::get('/projects',             [GovernanceController::class, 'indexProjects']);
            Route::post('/projects',            [GovernanceController::class, 'storeProject']);
            Route::post('/projects/{id}/approve',[GovernanceController::class, 'approveProject']);

            // User Management
            Route::get('/users',                     [UserManagementController::class, 'index']);
            Route::post('/users/project-director',   [UserManagementController::class, 'createProjectDirector']);
            Route::post('/users/vhw',                [UserManagementController::class, 'createVhw']);
            Route::patch('/users/{id}/status',       [UserManagementController::class, 'toggleStatus']);
            Route::post('/users/{id}/reset-password',[UserManagementController::class, 'resetPassword']);
            Route::post('/users/{id}/assign-area',   [UserManagementController::class, 'assignArea']);
            Route::get('/roles',                     [UserManagementController::class, 'listRoles']);

            // Monitoring (read-only)
            Route::get('/monitoring/families',      [MonitoringController::class, 'families']);
            Route::get('/monitoring/individuals',   [MonitoringController::class, 'individuals']);
            Route::get('/monitoring/health-records',[MonitoringController::class, 'healthRecords']);
            Route::get('/monitoring/visit-logs',    [MonitoringController::class, 'visitLogs']);

            // Approvals
            Route::get('/approvals',            [ApprovalController::class, 'index']);
            Route::get('/approvals/pending-count',[ApprovalController::class, 'pendingCount']);
            Route::post('/approvals/{id}/approve',[ApprovalController::class, 'approve']);
            Route::post('/approvals/{id}/reject', [ApprovalController::class, 'reject']);

            // Reports & Export
            Route::get('/reports/village',   [ReportsController::class, 'villageReport']);
            Route::get('/reports/family',    [ReportsController::class, 'familyReport']);
            Route::get('/reports/health',    [ReportsController::class, 'healthReport']);
            Route::get('/reports/vhw',       [ReportsController::class, 'vhwReport']);
            Route::get('/reports/training',  [ReportsController::class, 'trainingReport']);
            Route::get('/reports/export',    [ReportsController::class, 'export']);
        });
    });
});
