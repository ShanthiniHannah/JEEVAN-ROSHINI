<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seeds all 28 States and 8 Union Territories of India.
 * Data source: Ministry of Home Affairs, Government of India.
 */
class StatesSeeder extends Seeder
{
    public function run(): void
    {
        $states = [
            // ── 28 States ──────────────────────────────────────────────────
            ['name' => 'Andhra Pradesh',       'code' => 'AP',  'region' => 'South',     'type' => 'State'],
            ['name' => 'Arunachal Pradesh',    'code' => 'AR',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Assam',                'code' => 'AS',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Bihar',                'code' => 'BR',  'region' => 'East',       'type' => 'State'],
            ['name' => 'Chhattisgarh',         'code' => 'CG',  'region' => 'Central',    'type' => 'State'],
            ['name' => 'Goa',                  'code' => 'GA',  'region' => 'West',       'type' => 'State'],
            ['name' => 'Gujarat',              'code' => 'GJ',  'region' => 'West',       'type' => 'State'],
            ['name' => 'Haryana',              'code' => 'HR',  'region' => 'North',      'type' => 'State'],
            ['name' => 'Himachal Pradesh',     'code' => 'HP',  'region' => 'North',      'type' => 'State'],
            ['name' => 'Jharkhand',            'code' => 'JH',  'region' => 'East',       'type' => 'State'],
            ['name' => 'Karnataka',            'code' => 'KA',  'region' => 'South',      'type' => 'State'],
            ['name' => 'Kerala',               'code' => 'KL',  'region' => 'South',      'type' => 'State'],
            ['name' => 'Madhya Pradesh',       'code' => 'MP',  'region' => 'Central',    'type' => 'State'],
            ['name' => 'Maharashtra',          'code' => 'MH',  'region' => 'West',       'type' => 'State'],
            ['name' => 'Manipur',              'code' => 'MN',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Meghalaya',            'code' => 'ML',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Mizoram',              'code' => 'MZ',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Nagaland',             'code' => 'NL',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Odisha',               'code' => 'OD',  'region' => 'East',       'type' => 'State'],
            ['name' => 'Punjab',               'code' => 'PB',  'region' => 'North',      'type' => 'State'],
            ['name' => 'Rajasthan',            'code' => 'RJ',  'region' => 'North',      'type' => 'State'],
            ['name' => 'Sikkim',               'code' => 'SK',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Tamil Nadu',           'code' => 'TN',  'region' => 'South',      'type' => 'State'],
            ['name' => 'Telangana',            'code' => 'TS',  'region' => 'South',      'type' => 'State'],
            ['name' => 'Tripura',              'code' => 'TR',  'region' => 'Northeast',  'type' => 'State'],
            ['name' => 'Uttar Pradesh',        'code' => 'UP',  'region' => 'North',      'type' => 'State'],
            ['name' => 'Uttarakhand',          'code' => 'UK',  'region' => 'North',      'type' => 'State'],
            ['name' => 'West Bengal',          'code' => 'WB',  'region' => 'East',       'type' => 'State'],

            // ── 8 Union Territories ────────────────────────────────────────
            ['name' => 'Andaman and Nicobar Islands',              'code' => 'AN',  'region' => 'UT',  'type' => 'Union Territory'],
            ['name' => 'Chandigarh',                               'code' => 'CH',  'region' => 'UT',  'type' => 'Union Territory'],
            ['name' => 'Dadra and Nagar Haveli and Daman and Diu', 'code' => 'DN',  'region' => 'UT',  'type' => 'Union Territory'],
            ['name' => 'Delhi',                                    'code' => 'DL',  'region' => 'UT',  'type' => 'Union Territory'],
            ['name' => 'Jammu and Kashmir',                        'code' => 'JK',  'region' => 'UT',  'type' => 'Union Territory'],
            ['name' => 'Ladakh',                                   'code' => 'LA',  'region' => 'UT',  'type' => 'Union Territory'],
            ['name' => 'Lakshadweep',                              'code' => 'LD',  'region' => 'UT',  'type' => 'Union Territory'],
            ['name' => 'Puducherry',                               'code' => 'PY',  'region' => 'UT',  'type' => 'Union Territory'],
        ];

        $now = now()->toDateTimeString();

        foreach ($states as &$row) {
            $row['status']     = 'Active';
            $row['created_at'] = $now;
            $row['updated_at'] = $now;
        }
        unset($row);

        // Use upsert so re-running the seeder is idempotent
        DB::table('states')->upsert(
            $states,
            ['code'],                             // Unique key
            ['name', 'region', 'type', 'status']  // Columns to update on duplicate
        );

        $this->command->info('✅ States seeder complete: 28 States + 8 Union Territories inserted.');
    }
}
