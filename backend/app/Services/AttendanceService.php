<?php

namespace App\Services;

use App\Models\DailySession;
use App\Repositories\AttendanceRepository;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;

class AttendanceService
{
    /**
     * The attendance repository.
     */
    protected AttendanceRepository $attendanceRepo;

    /**
     * AttendanceService constructor.
     */
    public function __construct(AttendanceRepository $attendanceRepo)
    {
        $this->attendanceRepo = $attendanceRepo;
    }

    /**
     * Fetch logs.
     */
    public function listLogs(?int $userId): LengthAwarePaginator
    {
        return $this->attendanceRepo->getLogsByScope($userId);
    }

    /**
     * Check in shift today.
     *
     * @throws Exception
     */
    public function checkIn(int $userId, string $gpsCoords): DailySession
    {
        // Prevent multiple check-ins today
        $existing = $this->attendanceRepo->findTodayCheckIn($userId);
        if ($existing) {
            throw new Exception('You are already checked in for today.');
        }

        $session = $this->attendanceRepo->create([
            'vhw_id' => $userId,
            'session_date' => now()->toDateString(),
            'login_time' => now()->toTimeString(),
            'attendance_status' => 'Present',
        ]);

        // Audit log
        AuditLogger::logAction('CHECK_IN', "Health Worker User {$userId} automatically checked in via login.");

        return $session;
    }

    /**
     * Check out shift today.
     *
     * @throws Exception
     */
    public function checkOut(int $userId): DailySession
    {
        $session = $this->attendanceRepo->findTodayCheckIn($userId);

        if (! $session) {
            throw new Exception('No active check-in record found for today.');
        }

        if ($session->logout_time !== null) {
            throw new Exception('You are already checked out for today.');
        }

        $updatedSession = $this->attendanceRepo->update($session->id, [
            'logout_time' => now()->toTimeString(),
        ]);

        // Audit log
        AuditLogger::logAction('CHECK_OUT', "Health Worker User {$userId} checked out shift successfully.");

        return $updatedSession;
    }
}
