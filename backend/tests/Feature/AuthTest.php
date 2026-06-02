<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRolesAndPermissions();
        $this->createTestUsers();
    }

    private function seedRolesAndPermissions(): void
    {
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\RolesAndPermissionsSeeder']);
    }

    private function createTestUsers(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password123'),
                'status' => 'Active',
            ]
        )->assignRole('vhw');
    }

    #[Test]
    public function login_with_valid_credentials_returns_token_and_user(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'admin@ayathanatrust.org',
            'password' => 'admin123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'email', 'role'],
            ]);

        $this->assertNotNull($response['token']);
        $this->assertEquals('admin@ayathanatrust.org', $response['user']['email']);
    }

    #[Test]
    public function login_with_invalid_password_returns_401(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'admin@ayathanatrust.org',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid email or password']);
    }

    #[Test]
    public function login_with_invalid_email_returns_401(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'nonexistent@test.com',
            'password' => 'somepassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid email or password']);
    }

    #[Test]
    public function login_with_suspended_account_returns_403(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        $user->update(['status' => 'Inactive']);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'This account has been suspended.']);
    }

    #[Test]
    public function login_requires_email_and_password(): void
    {
        $response = $this->postJson('/api/v1/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    #[Test]
    public function login_requires_valid_email_format(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'not-an-email',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function director_can_login_successfully(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'director@ayathanatrust.org',
            'password' => 'director123',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('project-director', $response['user']['role']);
    }

    #[Test]
    public function vhw_can_login_successfully(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'preema@ayathanatrust.org',
            'password' => 'vhw123',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('vhw', $response['user']['role']);
    }

    #[Test]
    public function authenticated_user_can_fetch_profile(): void
    {
        $user = User::where('email', 'admin@ayathanatrust.org')->first();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name', 'email', 'role']);
    }

    #[Test]
    public function unauthenticated_user_cannot_fetch_profile(): void
    {
        $response = $this->getJson('/api/v1/me');
        $response->assertStatus(401);
    }

    #[Test]
    public function authenticated_user_can_logout(): void
    {
        $user = User::where('email', 'admin@ayathanatrust.org')->first();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logged out successfully.']);
    }

    #[Test]
    public function unauthenticated_user_cannot_logout(): void
    {
        $response = $this->postJson('/api/v1/logout');
        $response->assertStatus(401);
    }

    #[Test]
    public function login_token_can_be_used_for_subsequent_requests(): void
    {
        $loginResponse = $this->postJson('/api/v1/login', [
            'email' => 'admin@ayathanatrust.org',
            'password' => 'admin123',
        ]);

        $token = $loginResponse['token'];

        $profileResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');

        $profileResponse->assertStatus(200);
        $this->assertEquals('admin@ayathanatrust.org', $profileResponse['email']);
    }

    #[Test]
    public function full_auth_cycle_login_profile_logout(): void
    {
        $login = $this->postJson('/api/v1/login', [
            'email' => 'admin@ayathanatrust.org',
            'password' => 'admin123',
        ]);
        $login->assertStatus(200);
        $token = $login['token'];

        $this->app['auth']->forgetUser();
        \Illuminate\Support\Facades\Auth::forgetUser();

        $profile = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');
        $profile->assertStatus(200);
        $this->assertEquals('admin@ayathanatrust.org', $profile['email']);

        $this->app['auth']->forgetUser();
        \Illuminate\Support\Facades\Auth::forgetUser();

        $logout = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/logout');
        $logout->assertStatus(200);

        $this->app['auth']->forgetUser();
        \Illuminate\Support\Facades\Auth::forgetUser();

        $staleProfile = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');

        $this->assertTrue(
            $staleProfile->status() === 401 || $staleProfile->status() === 302,
            'Expected 401/302 after logout, got ' . $staleProfile->status()
        );
    }
}
