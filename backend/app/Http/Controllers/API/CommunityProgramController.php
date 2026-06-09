<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CommunityProgram;
use App\Models\Village;
use Illuminate\Http\Request;
use App\Services\AuditLogger;

class CommunityProgramController extends Controller
{
    public function index(Request $request)
    {
        $programs = CommunityProgram::with('village')->orderBy('program_date', 'desc')->get();
        return response()->json(['success' => true, 'data' => $programs]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'village_id' => 'required|string',
            'topic' => 'required|string',
            'program_date' => 'required|date',
            'participants_count' => 'nullable|integer',
            'outcome_summary' => 'nullable|string',
        ]);

        $program = CommunityProgram::create([
            'village_id' => $request->village_id,
            'topic' => $request->topic,
            'program_date' => $request->program_date,
            'participants_count' => $request->participants_count ?? 0,
            'outcome_summary' => $request->outcome_summary ?? 'Upcoming',
        ]);

        AuditLogger::logAction('CREATE_COMMUNITY_PROGRAM', "Created program for village: {$request->village_id}");

        return response()->json(['success' => true, 'data' => $program->load('village')], 201);
    }
}
