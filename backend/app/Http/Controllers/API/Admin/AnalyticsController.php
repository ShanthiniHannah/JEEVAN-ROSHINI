<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiseaseRecord;
use App\Models\Individual;
use App\Models\Family;
use App\Models\Village;
use App\Models\Visit;
use App\Models\RiskAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function diseaseTrends()
    {
        $trends = DiseaseRecord::join('disease_types', 'disease_records.disease_type_id', '=', 'disease_types.id')
            ->select('disease_types.disease_name as disease_type', DB::raw('count(*) as count'))
            ->groupBy('disease_types.disease_name')
            ->orderBy('count', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $trends,
        ]);
    }

    public function maternalHealth()
    {
        $totalPregnant = Individual::where('gender', 'Female')
            ->whereHas('healthProfile', function ($q) {
                $q->where('pregnancy_status', 'Yes');
            })
            ->count();

        $highRisk = RiskAlert::where('type', 'High-Risk Pregnancy')
            ->where('status', 'Active')
            ->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'total_pregnant' => $totalPregnant,
                'high_risk'      => $highRisk,
                'normal'         => max(0, $totalPregnant - $highRisk),
            ],
        ]);
    }

    public function childNutrition()
    {
        $nutrition = Individual::select('malnutrition_status', DB::raw('count(*) as count'))
            ->where('age', '<', 5)
            ->groupBy('malnutrition_status')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $nutrition,
        ]);
    }

    public function highRiskCases()
    {
        $cases = RiskAlert::with('individual')
            ->where('status', 'Active')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $cases,
        ]);
    }

    public function villageComparison()
    {
        $villages = Village::withCount(['families', 'individuals'])->get();

        return response()->json([
            'success' => true,
            'data'    => $villages,
        ]);
    }

    public function visitAudits()
    {
        $visits = Visit::select(DB::raw("DATE_FORMAT(visit_date, '%Y-%m') as month"), DB::raw('count(*) as count'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $visits,
        ]);
    }
}
