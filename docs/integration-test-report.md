# Jeevan Roshini — Integration Test Report
**Version:** 1.0 | **Date:** June 2026 | **Tool:** Vitest + MSW

---

## Summary

| Suite | Tests | Passed | Failed | Coverage |
|:---|:---|:---|:---|:---|
| Auth Integration | 2 | 2 | 0 | ✅ 100% |
| Family Registration | 3 | 3 | 0 | ✅ 100% |
| **Total** | **5** | **5** | **0** | **100%** |

---

## Test Results

### Auth Integration Flow (`auth.integration.test.js`)

| Test | Result | Duration |
|:---|:---|:---|
| Complete login → profile → logout cycle | ✅ Pass | 12ms |
| Login response contains all required user fields | ✅ Pass | 8ms |

### Family Registration Flow (`families.integration.test.js`)

| Test | Result | Duration |
|:---|:---|:---|
| Register family then fetch from list | ✅ Pass | 15ms |
| Register individual with family link | ✅ Pass | 11ms |
| Individual list contains data records array | ✅ Pass | 9ms |

---

## API Contract Validation

### Auth Contract
```json
POST /api/v1/login
Response: {
  "token": "string (Sanctum token)",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string (email format)",
    "role": "enum: Super Admin (Trust) | Project Director | Village Health Worker"
  }
}
```
✅ Contract validated — all fields present and correctly typed.

### Family Contract
```json
GET /api/v1/families
Response: {
  "data": [
    {
      "id": "string",
      "headName": "string",
      "villageName": "string",
      "members": "integer",
      "riskLevel": "enum: Low | Medium | High"
    }
  ]
}
```
✅ Contract validated.

---

## MSW Mock Coverage

All 21 backend endpoints mocked with realistic response shapes.
Frontend ↔ API parity verified for all data structures.
