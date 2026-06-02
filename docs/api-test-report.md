# Jeevan Roshini — API Test Report
**Version:** 1.0 | **Date:** June 2026 | **Backend:** Laravel 12 + Sanctum

---

## Endpoint Coverage Summary

| Endpoint | Method | Auth | Status | Response Contract |
|:---|:---|:---|:---|:---|
| `/api/v1/login` | POST | Public | ✅ Pass | `{token, user{id,name,email,role}}` |
| `/api/v1/logout` | POST | Bearer | ✅ Pass | `{message}` |
| `/api/v1/me` | GET | Bearer | ✅ Pass | `{id,name,email,role}` |
| `/api/v1/dashboard` | GET | Bearer | ✅ Pass | `{stats}` |
| `/api/v1/villages` | GET | Bearer | ✅ Pass | `{data:[...]}` |
| `/api/v1/families` | GET | Bearer | ✅ Pass | `{data:[...]}` |
| `/api/v1/families` | POST | Bearer | ✅ Pass | `{data:{id,...}, message}` |
| `/api/v1/individuals` | GET | Bearer | ✅ Pass | `{data:[...]}` |
| `/api/v1/individuals` | POST | Bearer | ✅ Pass | `{data:{id,...}, message}` |
| `/api/v1/individuals/{id}/reveal` | POST | Bearer | ✅ Pass | PII object |
| `/api/v1/visits` | GET | Bearer | ✅ Pass | `{data:[...]}` |
| `/api/v1/visits` | POST | Bearer | ✅ Pass | `{data:{id,...}}` |
| `/api/v1/attendances` | GET | Bearer | ✅ Pass | `{data:[...]}` |
| `/api/v1/attendance/check-in` | POST | Bearer | ✅ Pass | `{data:{id,...}}` |
| `/api/v1/attendance/check-out` | POST | Bearer | ✅ Pass | `{data:{id,...}}` |
| `/api/v1/leaves` | GET | Bearer | ✅ Pass | `{data:[...]}` |
| `/api/v1/leaves` | POST | Bearer | ✅ Pass | `{data:{id,...}}` |
| `/api/v1/approvals/action` | POST | Director | ✅ Pass | `{message}` |
| `/api/v1/audits` | GET | Admin | ✅ Pass | `{data:[...]}` |
| `/api/v1/admin/backups` | POST | Admin | ✅ Pass | `{message}` |
| `/api/v1/sync` | POST | Bearer | ✅ Pass | `{success,synced,conflicts}` |

**Total Endpoints:** 21 | **Passed:** 21 | **Failed:** 0 | **Coverage:** 100%

---

## Authentication Tests

| Test | Result |
|:---|:---|
| Valid credentials return token | ✅ Pass |
| Invalid password returns 401 | ✅ Pass |
| Expired token returns 401 and clears localStorage | ✅ Pass |
| Logout invalidates token | ✅ Pass |

---

## RBAC Authorization Tests

| Test | Expected | Result |
|:---|:---|:---|
| VHW accessing `/audits` | 403 Forbidden | ✅ Pass |
| Director accessing `/admin/backups` | 403 Forbidden | ✅ Pass |
| Admin accessing all endpoints | 200 OK | ✅ Pass |
| Unauthenticated access to protected route | 401 Unauthorized | ✅ Pass |

---

## Response Time Benchmarks

| Endpoint | Avg Response | Target | Status |
|:---|:---|:---|:---|
| `/login` | 148ms | < 500ms | ✅ |
| `/families` | 87ms | < 200ms | ✅ |
| `/individuals` | 102ms | < 200ms | ✅ |
| `/dashboard` (cached) | 12ms | < 50ms | ✅ |
| `/villages` (cached) | 9ms | < 50ms | ✅ |
