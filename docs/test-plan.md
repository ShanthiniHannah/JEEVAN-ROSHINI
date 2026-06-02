# Jeevan Roshini — Test Plan
**Version:** 1.0 | **Project:** Jeevan Roshini Full-Stack Health Governance Platform
**Date:** June 2026 | **Author:** Shanthini Hannah | **Architecture:** Laravel 12 + React 19 + Vite + MySQL

---

## 1. Scope

This test plan covers all testing tiers for the Jeevan Roshini enterprise platform — from individual service unit tests to full production E2E and security validation.

---

## 2. Testing Tiers

| Tier | Tool | Target | Coverage Goal |
|:---|:---|:---|:---|
| Unit | Vitest + React Testing Library | Services, Hooks, Contexts | ≥ 80% |
| Integration | Vitest + MSW | Frontend ↔ API contract | ≥ 80% |
| API | Newman + Postman Collection | 100% of backend endpoints | 100% |
| System | Manual + Playwright | Full user workflows | 100% critical paths |
| E2E | Playwright | Login, VHW, Director, Admin flows | All critical flows |
| Security | OWASP ZAP + manual | Auth, CSRF, XSS, RBAC | All endpoints |
| Performance | Lighthouse + k6 | Dashboard, Login page | LCP < 2.5s, API < 200ms |

---

## 3. Test Environment

| Component | Spec |
|:---|:---|
| OS | Windows 11 / Ubuntu 22.04 LTS |
| Node | 22.x LTS |
| PHP | 8.3+ |
| Database | MySQL 8.0 (test schema) |
| Frontend URL | http://localhost:5173 |
| Backend URL | http://localhost:8000/api/v1 |

---

## 4. Critical Workflows (Must Pass 100%)

1. **Login Flow**: All 4 roles → correct portal redirect
2. **VHW Family Registration**: Form → API POST → success response
3. **VHW Individual Registration**: Form → API POST → success response
4. **VHW Visit Log**: GPS + vitals → POST /visits → success
5. **VHW Attendance**: Check-in → check-out → record visible
6. **Director Approval**: Pending leave → approve/reject → status update
7. **Director Leave Review**: List pending requests → take action
8. **Admin Audit Log**: View complete audit trail
9. **Admin Backup**: Trigger encrypted S3 backup → success toast
10. **Offline Sync**: Queue operations offline → reconnect → flush queue

---

## 5. Test Data

| Role | Email | Password |
|:---|:---|:---|
| Super Admin | admin@ayathanatrust.org | admin123 |
| Project Director | director@ayathanatrust.org | director123 |
| VHW Preema | preema@ayathanatrust.org | vhw123 |
| VHW Shobha | shobha@ayathanatrust.org | vhw123 |

---

## 6. Test Commands

```bash
# Unit + Integration Tests
npm run test

# With coverage report
npm run test:coverage

# Integration only
npm run test:integration

# E2E (requires dev server running)
npm run test:e2e

# E2E with UI explorer
npm run test:e2e:ui
```

---

## 7. Pass Criteria

- All unit tests pass with ≥ 80% coverage on services and hooks
- All integration tests verify API contract shapes
- All E2E login flow tests pass in Chromium
- No critical or high security vulnerabilities in OWASP scan
- Lighthouse Performance score ≥ 80 on login page
