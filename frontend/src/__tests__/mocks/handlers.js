import { http, HttpResponse } from 'msw';

// Match any origin — works with both Vite proxy (relative URLs)
// and direct backend calls (absolute URLs)
const match = (path) => `*/api/v1${path}`;

export const handlers = [
  // ── Auth ─────────────────────────────────────
  http.post(match('/login'), async ({ request }) => {
    const body = await request.json();
    const { email } = body;

    // Return role-appropriate responses based on email
    const users = {
      'admin@ayathanatrust.org': {
        id: 1, name: 'Ayathana Trust Administrator', email, role: 'Super Admin (Trust)',
      },
      'director@ayathanatrust.org': {
        id: 2, name: 'Dr. Ramesh Kumar', email, role: 'Project Director',
      },
      'preema@ayathanatrust.org': {
        id: 3, name: "Preema D'Souza", email, role: 'Village Health Worker',
      },
      'shobha@ayathanatrust.org': {
        id: 4, name: 'Shobha Nayak', email, role: 'Village Health Worker',
      },
    };

    const user = users[email];
    if (!user) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    return HttpResponse.json({
      token: 'test-sanctum-token-' + email.split('@')[0],
      user,
    });
  }),
  http.post(match('/logout'), () =>
    HttpResponse.json({ message: 'Logged out successfully.' })
  ),
  http.get(match('/me'), () => {
    return HttpResponse.json({
      id: 1,
      name: 'Ayathana Trust Administrator',
      email: 'admin@ayathanatrust.org',
      role: 'Super Admin (Trust)',
    });
  }),

  // ── Dashboard ────────────────────────────────
  http.get(match('/dashboard'), () => {
    return HttpResponse.json({
      totals: { villages: 5, families: 8, individuals: 15, risk_alerts: 3 },
      disease_prevalence: { diabetes: 2, hypertension: 1, tb: 0 },
    });
  }),

  // ── Families ─────────────────────────────────
  http.get(match('/families'), () => {
    return HttpResponse.json({
      data: [
        { id: 'FAM-001', headName: 'Test Family', villageName: 'Test Village', members: 4, riskLevel: 'Low' },
      ],
    });
  }),
  http.post(match('/families'), () => {
    return HttpResponse.json(
      { success: true, data: { id: 'FAM-NEW-001', village_id: 'VLG-4829', house_no: 'H-TEST' } },
      { status: 201 }
    );
  }),

  // ── Individuals ──────────────────────────────
  http.get(match('/individuals'), () => {
    return HttpResponse.json({ data: [{ id: 'JR-001', name: 'Test Patient', age: 30, gender: 'Female' }] });
  }),
  http.post(match('/individuals'), () => {
    return HttpResponse.json(
      { success: true, data: { id: 'JR-NEW-001', name: 'New Patient' } },
      { status: 201 }
    );
  }),

  // ── Villages ─────────────────────────────────
  http.get(match('/villages'), () => {
    return HttpResponse.json({ data: [{ id: 'VLG-001', name: 'Test Village', population: '500' }] });
  }),

  // ── Visits ───────────────────────────────────
  http.get(match('/visits'), () => HttpResponse.json({ data: [] })),
  http.post(match('/visits'), () =>
    HttpResponse.json({ success: true, data: { id: 'VST-001' } }, { status: 201 })
  ),

  // ── Attendance ───────────────────────────────
  http.get(match('/attendances'), () => HttpResponse.json({ data: [] })),
  http.post(match('/attendance/check-in'), () =>
    HttpResponse.json({ success: true, data: { id: 1, status: 'Present' } }, { status: 201 })
  ),
  http.post(match('/attendance/check-out'), () =>
    HttpResponse.json({ success: true, data: { id: 1, check_out: '17:00' } })
  ),

  // ── Leaves ───────────────────────────────────
  http.get(match('/leaves'), () => HttpResponse.json({ data: [] })),
  http.post(match('/leaves'), () =>
    HttpResponse.json({ success: true, data: { id: 1 } }, { status: 201 })
  ),

  // ── Audits ───────────────────────────────────
  http.get(match('/audits'), () => HttpResponse.json({ data: [] })),

  // ── Sync ─────────────────────────────────────
  http.post(match('/sync'), () =>
    HttpResponse.json({ success: true, synced_records: 1, triggered_risk_alerts: [] })
  ),

  // ── Generic PUT/DELETE for CRUD wrapper tests ─
  http.put(match('/families'), () =>
    HttpResponse.json({ success: true, data: { id: 'FAM-001', updated: true } })
  ),
  http.delete(match('/logout'), () =>
    HttpResponse.json({ message: 'Logged out successfully.' })
  ),
  http.delete(match('/families/:id'), () =>
    HttpResponse.json({ success: true, message: 'Deleted' })
  ),

  // ── Admin ────────────────────────────────────
  http.post(match('/admin/backups'), () =>
    HttpResponse.json({ success: true, message: 'Database backup created successfully.' })
  ),

  // ── Approvals ────────────────────────────────
  http.post(match('/approvals/action'), () =>
    HttpResponse.json({ success: true, message: 'Leave request processed.' })
  ),
];
