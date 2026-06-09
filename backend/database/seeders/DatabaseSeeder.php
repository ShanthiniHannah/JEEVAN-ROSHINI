<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            StatesSeeder::class,             // All 28 states + 8 UTs (must run first)
            RolesAndPermissionsSeeder::class,
            DemoDataSeeder::class,
        ]);
    }
}
