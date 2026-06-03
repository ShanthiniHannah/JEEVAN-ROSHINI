<?php

namespace App\Services;

use App\Models\Attendance;
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
    public function checkIn(int $userId, string $gpsCoords): Attendance
    {
        // Prevent multiple check-ins today
        $existing = $this->attendanceRepo->findTodayCheckIn($userId);
        if ($existing) {
            throw new Exception('You are already checked in for today.');
        }

        $attendance = $this->attendanceRepo->create([
            'user_id' => $userId,
            'date' => now()->toDateString(),
            'check_in_time' => now()->toTimeString(),
            'gps_coords' => $gpsCoords,
            'status' => 'Present',
        ]);

        // Audit log
        AuditLogger::logAction('CHECK_IN', "Health Worker User {$userId} checked in shifts at GPS [{$gpsCoords}]");

        return $attendance;
    }

    /**
     * Check out shift today.
     *
     * @throws Exception
     */
    public function checkOut(int $userId): Attendance
    {
        $attendance = $this->attendanceRepo->findTodayCheckIn($userId);

        if (! $attendance) {
            throw new Exception('No active check-in record found for today.');
        }

        if ($attendance->check_out_time !== null) {
            throw new Exception('You are already checked out for today.');
        }

        $updatedAttendance = $this->attendanceRepo->update($attendance->id, [
            'check_out_time' => now()->toTimeString(),
        ]);

        // Audit log
        AuditLogger::logAction('CHECK_OUT', "Health Worker User {$userId} checked out shift successfully.");

        return $updatedAttendance;
    }
}
