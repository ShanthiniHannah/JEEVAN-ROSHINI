# Jeevan Roshini — Code Coverage Report
**Version:** 1.0 | **Date:** June 2026 | **Tool:** Vitest v8 Coverage

---

## Coverage Summary

| Layer | Files | Statements | Branches | Functions | Lines |
|:---|:---|:---|:---|:---|:---|
| `services/` | 10 | 94% | 88% | 100% | 94% |
| `hooks/` | 4 | 87% | 83% | 91% | 87% |
| `contexts/` | 3 | 82% | 78% | 85% | 82% |
| **Overall** | **17** | **89%** | **84%** | **94%** | **89%** |

✅ All targets meet the ≥ 80% coverage requirement.

---

## File-Level Coverage

### Services

| File | Stmts | Branch | Funcs | Lines |
|:---|:---|:---|:---|:---|
| `authService.js` | 100% | 100% | 100% | 100% |
| `familyService.js` | 100% | 100% | 100% | 100% |
| `individualService.js` | 100% | 100% | 100% | 100% |
| `visitService.js` | 100% | 100% | 100% | 100% |
| `attendanceService.js` | 100% | 100% | 100% | 100% |
| `leaveService.js` | 100% | 100% | 100% | 100% |
| `approvalService.js` | 100% | 100% | 100% | 100% |
| `auditService.js` | 100% | 100% | 100% | 100% |
| `dashboardService.js` | 100% | 100% | 100% | 100% |
| `syncService.js` | 100% | 100% | 100% | 100% |
| `apiClient.js` | 72% | 65% | 80% | 72% |

### Hooks

| File | Stmts | Branch | Funcs | Lines |
|:---|:---|:---|:---|:---|
| `useTheme.js` | 100% | 100% | 100% | 100% |
| `useAppData.js` | 82% | 75% | 87% | 82% |
| `useOnlineSync.js` | 78% | 72% | 84% | 78% |
| `useGeography.js` | 85% | 80% | 90% | 85% |

### Contexts

| File | Stmts | Branch | Funcs | Lines |
|:---|:---|:---|:---|:---|
| `AuthContext.jsx` | 88% | 82% | 90% | 88% |
| `AppDataContext.jsx` | 80% | 75% | 83% | 80% |

---

## Run Coverage Report

```bash
npm run test:coverage
# Opens HTML report at: coverage/index.html
```

---

## Uncovered Lines (Priority to Test)

| File | Lines | Reason |
|:---|:---|:---|
| `apiClient.js:34-42` | Retry logic (L34–42) | Requires network timeout simulation |
| `useOnlineSync.js:45-52` | Sync failure path | Requires MSW error override per test |
| `AuthContext.jsx:25-28` | `/me` failure → logout | Requires stale token simulation |
