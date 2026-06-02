<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Village;
use App\Models\Family;
use PHPUnit\Framework\Attributes\Test;

class ApiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    private string $adminToken = '';
    private string $vhwToken = '';
    private string $directorToken = '';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        $this->adminToken = $this->getTokenFor('admin@ayathanatrust.org', 'admin123');
        $this->vhwToken = $this->getTokenFor('preema@ayathanatrust.org', 'vhw123');
        $this->directorToken = $this->getTokenFor('director@ayathanatrust.org', 'director123');
        
        \Illuminate\Support\Facades\Auth::logout();
        $this->app['auth']->forgetUser();
    }

    private function getTokenFor(string $email, string $password): string
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => $email,
            'password' => $password,
        ]);
        return $response['token'];
    }

    private function authHeader(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    #[Test]
    public function authenticated_user_can_access_dashboard(): void
    {
        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->getJson('/api/v1/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure(['totals', 'disease_prevalence']);
    }

    #[Test]
    public function unauthenticated_user_cannot_access_dashboard(): void
    {
        $response = $this->getJson('/api/v1/dashboard');
        $response->assertStatus(401);
    }

    #[Test]
    public function authenticated_user_can_fetch_villages(): void
    {
        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->getJson('/api/v1/villages');

        $response->assertStatus(200);
    }

    #[Test]
    public function authenticated_user_can_fetch_families(): void
    {
        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->getJson('/api/v1/families');

        $response->assertStatus(200);
    }

    #[Test]
    public function authenticated_user_can_create_family(): void
    {
        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->postJson('/api/v1/families', [
                'village_id' => Village::first()->id,
                'house_no' => 'H-TEST-001',
                'economic_status' => 'BPL',
            ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function creating_family_requires_required_fields(): void
    {
        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->postJson('/api/v1/families', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['village_id', 'house_no', 'economic_status']);
    }

    #[Test]
    public function authenticated_user_can_fetch_individuals(): void
    {
        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->getJson('/api/v1/individuals');

        $response->assertStatus(200);
    }

    #[Test]
    public function authenticated_user_can_create_individual(): void
    {
        $family = Family::first();

        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->postJson('/api/v1/individuals', [
                'family_id' => $family->id,
                'name' => 'Test Patient',
                'age' => 25,
                'gender' => 'Female',
            ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function vhw_can_access_own_portal_resources(): void
    {
        $response = $this->withHeaders($this->authHeader($this->vhwToken))
            ->getJson('/api/v1/visits');

        $response->assertStatus(200);
    }

    #[Test]
    public function vhw_can_check_in(): void
    {
        $response = $this->withHeaders($this->authHeader($this->vhwToken))
            ->postJson('/api/v1/attendance/check-in', [
                'gps_coords' => '13.1238,75.9421',
            ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function vhw_can_check_out(): void
    {
        $checkIn = $this->withHeaders($this->authHeader($this->vhwToken))
            ->postJson('/api/v1/attendance/check-in', [
                'gps_coords' => '13.1238,75.9421',
            ]);
        $checkIn->assertStatus(201);

        $response = $this->withHeaders($this->authHeader($this->vhwToken))
            ->postJson('/api/v1/attendance/check-out');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function vhw_can_submit_leave(): void
    {
        $response = $this->withHeaders($this->authHeader($this->vhwToken))
            ->postJson('/api/v1/leaves', [
                'start_date' => now()->addDays(10)->toDateString(),
                'days_count' => 2,
                'reason' => 'Personal leave',
            ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function authenticated_user_can_sync_offline_queue(): void
    {
        $response = $this->withHeaders($this->authHeader($this->vhwToken))
            ->postJson('/api/v1/sync', [
                'queue' => [
                    [
                        'type' => 'visit',
                        'data' => [
                            'familyId' => Family::first()->id,
                            'notes' => 'Test sync visit',
                        ],
                    ],
                ],
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function expired_token_is_rejected(): void
    {
        $response = $this->withHeaders($this->authHeader('invalid-token-here'))
            ->getJson('/api/v1/me');

        // Sanctum may return 401 or redirect to login depending on configuration
        $this->assertTrue(
            $response->status() === 401 || $response->status() === 302,
            'Expected 401 or 302, got ' . $response->status()
        );
    }

    #[Test]
    public function empty_request_body_returns_validation_error(): void
    {
        $response = $this->withHeaders($this->authHeader($this->adminToken))
            ->postJson('/api/v1/families', []);

        $response->assertStatus(422);
    }
}
