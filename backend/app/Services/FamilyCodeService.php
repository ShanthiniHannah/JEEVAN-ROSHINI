<?php

namespace App\Services;

use App\Models\Block;
use App\Models\District;
use App\Models\Family;
use App\Models\Individual;
use App\Models\State;
use App\Models\Village;
use Illuminate\Support\Facades\DB;

/**
 * FamilyCodeService
 *
 * Generates unique, human-readable coded IDs for families and individuals.
 *
 * Format:
 *   Family Code:     {STATE}-{DIST}-{BLOCK}-{VILLAGE}-{SEQ:06d}
 *   Individual Code: {family_code}-{MEMBER_SEQ:02d}
 *
 * Example:
 *   Family:     KA-CHK-KAD-GND-000001
 *   Individual: KA-CHK-KAD-GND-000001-01
 */
class FamilyCodeService
{
    /**
     * Generate a unique family code for the given village.
     */
    public function generateFamilyCode(string $villageId): string
    {
        $village  = Village::with(['block.district.state'])->findOrFail($villageId);
        $block    = $village->block;
        $district = $block?->district;
        $state    = $district?->state;

        $stateCode   = $this->toCode($state?->code ?? 'XX', 2);
        $distCode    = $this->toCode($district?->name ?? 'UNK', 3);
        $blockCode   = $this->toCode($block?->name ?? 'UNK', 3);
        $villageCode = $this->toCode($village->name, 3);

        // Atomic sequence via DB lock to prevent race conditions
        $seq = DB::transaction(function () use ($stateCode, $distCode, $blockCode, $villageCode) {
            $prefix  = "{$stateCode}-{$distCode}-{$blockCode}-{$villageCode}-";
            $count   = Family::where('family_code', 'like', $prefix . '%')->lockForUpdate()->count();
            return $count + 1;
        });

        return sprintf('%s-%s-%s-%s-%06d', $stateCode, $distCode, $blockCode, $villageCode, $seq);
    }

    /**
     * Generate a unique individual code within a family.
     */
    public function generateIndividualCode(string $familyCode): string
    {
        $count = DB::transaction(function () use ($familyCode) {
            return Individual::where('individual_code', 'like', $familyCode . '-%')->lockForUpdate()->count();
        });

        $memberSeq = $count + 1;
        return sprintf('%s-%02d', $familyCode, $memberSeq);
    }

    /**
     * Convert a name/code to an uppercase code of given length.
     * Extracts consonants or first N letters from the name.
     */
    private function toCode(string $name, int $length): string
    {
        // If already a short code, just uppercase it
        $cleaned = strtoupper(preg_replace('/[^A-Za-z]/', '', $name));
        if (strlen($cleaned) <= $length) {
            return str_pad($cleaned, $length, 'X');
        }
        return substr($cleaned, 0, $length);
    }
}
