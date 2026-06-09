<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create permissions
        $permissions = [
            // Master Admin / Organizations
            'manage organization', 'manage districts', 'manage villages',
            // User Management
            'onboard staff', 'edit staff permissions', 'deactivate staff',
            // Family & Individuals Registries
            'register family', 'edit family records', 'delete family records',
            'register individual', 'edit ECHR records', 'view ECHR records',
            // Operational logs
            'log household visits', 'log community activities', 'submit GPS attendance',
            // Leave approvals
            'submit leave requests', 'approve leave requests',
            // Evaluations & Training
            'grade training assessments', 'evaluate staff performance', 'manage training modules',
            // Social support
            'manage vulnerable registry', 'disburse social support',
            // Reporting
            'export reports',
            // Finance
            'manage finance', 'approve expenses',
            // Inventory
            'manage inventory', 'approve medicine requests',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // 2. Create Roles and Assign Permissions

        // VHW: Village Health Worker
        $vhwRole = Role::create(['name' => 'vhw']);
        $vhwRole->givePermissionTo([
            'register family', 'edit family records',
            'register individual', 'edit ECHR records', 'view ECHR records',
            'log household visits', 'log community activities', 'submit GPS attendance',
            'submit leave requests',
        ]);

        // Project Director
        $directorRole = Role::create(['name' => 'project-director']);
        $directorRole->givePermissionTo([
            'view ECHR records',
            'approve leave requests',
            'grade training assessments', 'evaluate staff performance', 'manage training modules',
            'export reports', 'approve medicine requests',
        ]);

        // Analytics Head
        $analyticsRole = Role::create(['name' => 'analytics-head']);
        $analyticsRole->givePermissionTo([
            'view ECHR records',
            'export reports',
        ]);

        // Finance Head
        $financeRole = Role::create(['name' => 'finance-head']);
        $financeRole->givePermissionTo([
            'manage finance',
            'approve expenses',
            'export reports',
        ]);

        // Super Admin (Ayathana Trust)
        $superAdminRole = Role::create(['name' => 'super-admin']);
        $superAdminRole->givePermissionTo(Permission::all());

        // 3. Create Default Accounts for the Prototype

        // Super Admin User
        $adminUser = User::create([
            'name' => 'Ayathana Trust Administrator',
            'email' => 'admin@ayathanatrust.org',
            'password' => Hash::make('admin123'),
            'status' => 'Active',
            'must_change_password' => false,
        ]);
        $adminUser->assignRole($superAdminRole);

        // Project Director User
        $directorUser = User::create([
            'name' => 'Dr. Ramesh Kumar',
            'email' => 'director@ayathanatrust.org',
            'password' => Hash::make('director123'),
            'status' => 'Active',
            'must_change_password' => false,
        ]);
        $directorUser->assignRole($directorRole);

        // Village Health Worker User
        $vhwUser = User::create([
            'name' => 'Preema D\'Souza',
            'email' => 'preema@ayathanatrust.org',
            'password' => Hash::make('vhw123'),
            'status' => 'Active',
            'must_change_password' => false,
        ]);
        $vhwUser->assignRole($vhwRole);

        // Analytics Head User
        $analyticsUser = User::create([
            'name' => 'Dr. Shridhar Bhat',
            'email' => 'analytics@ayathanatrust.org',
            'password' => Hash::make('analytics123'),
            'status' => 'Active',
            'must_change_password' => false,
        ]);
        $analyticsUser->assignRole($analyticsRole);

        // Finance Head User
        $financeUser = User::create([
            'name' => 'Suresh Prabhu',
            'email' => 'finance@ayathanatrust.org',
            'password' => Hash::make('finance123'),
            'status' => 'Active',
            'must_change_password' => false,
        ]);
        $financeUser->assignRole($financeRole);
    }
}
