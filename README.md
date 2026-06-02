<div align="center">

<img src="frontend/public/login-bg-new.png" alt="Jeevan Roshini Banner" width="100%" style="border-radius:12px;"/>

# ✨ Jeevan Roshini
### जीवन रोशनी | ஜீவன் ரோஷினி | ജീവൻ റോഷ്നി

**Enterprise-Grade Community Health Governance & Offline Field PWA**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-21%20Passing-22C55E?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev)

*Developed for [Ayathana Trust](https://www.ayathanatrust.org) — Empowering rural health workers across India*

</div>

---

## 🌟 About the Project

**Jeevan Roshini** (meaning *"Light of Life"*) is a production-ready, full-stack health governance and field activity platform built for **Ayathana Trust** to digitise and streamline community health operations in rural India.

The platform powers three distinct role-based portals:

| Portal | Role | Core Function |
|:---|:---|:---|
| 📱 **VHW Portal** | Village Health Workers | Mobile PWA for offline family/individual registration, visits, GPS attendance, and sync |
| 📊 **Director Portal** | Project Director | Approval workflows for leaves, referrals, and field reports with village comparison analytics |
| 🛡️ **Admin Portal** | Super Admin (Trust) | Audit trail, backup management, staff management, notification logs, and system governance |

---

## 🚀 Key Features

### 🏥 Clinical & Field Operations
- **Family & Individual Registration** — Step-by-step wizard with clinical validation (pregnancy blocking, juvenile diabetes warning, duplicate checks)
- **VHW Daily Visits** — Log household visits with GPS coordinates, vitals (BP, temp), and follow-up scheduling
- **GPS Attendance** — Clock-in / clock-out with GPS verification for daily shift tracking
- **Risk Alert Engine** — Automated vulnerability scoring based on pregnancy status, age, disability, BPL status, and chronic diseases

### 🔄 Offline-First PWA
- **Offline Queue** — VHW can register families, individuals, and visits without internet connectivity
- **Sync Engine** — One-tap sync flushes the local queue to the Laravel API when reconnected
- **Conflict Detection** — Server-side conflict logging prevents data overwriting on concurrent edits

### 🏛️ Governance & Compliance
- **Unified Approval Workflows** — Hierarchical status flow (`Draft → Submitted → Under Review → Approved / Rejected`)
- **Immutable Audit Trail** — Complete historical logs with old/new value diffing for all insert, update, delete, and PII reveal operations
- **PII Masking** — Patient phone numbers masked by default; Reveal Eye with access-logged audit entry
- **RBAC** — Strict role-based access control: VHW → Director → Super Admin

### 🔐 Security
- **Laravel Sanctum** — Stateless Bearer token authentication for SPA
- **Security Headers Middleware** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Village Access Middleware** — Block-level geographic boundary enforcement
- **Frontend Route Guard** — `ProtectedRoute` with role validation on every portal URL

### 🌐 Multilingual
Supports **9 Indian languages** across all portals:
`English` · `ಕನ್ನಡ` · `മലയാളം` · `हिन्दी` · `తెలుగు` · `தமிழ்` · `मराठी` · `বাংলা` · `ગુજરાતી`

---

## 🏗️ Architecture

### Backend — Laravel 12 (Repository + Service Pattern)

```
HTTP Request
    ↓
Controller  (validate request, return API response)
    ↓
Service     (business logic, transactions, risk rules)
    ↓
Repository  (Eloquent abstraction, Redis caching, query optimization)
    ↓
Model       (Eloquent relational representation)
```

### Frontend — Microservices-Style React 19

```
App.jsx  (Providers + Routes only — ~70 lines)
    ├── contexts/    AppDataContext (global state — no prop-drilling)
    ├── pages/       LoginPage · VhwPage · DirectorPage · AdminPage
    ├── layouts/     AppShell (header/footer/sync) · AuthLayout (login wrapper)
    ├── hooks/       useTheme · useOnlineSync · useAppData · useGeography
    ├── services/    authService · familyService · individualService · visitService
    │                attendanceService · leaveService · approvalService
    │                auditService · dashboardService · syncService
    └── components/  VhwPortal · DirectorPortal · AdminPortal (domain portals)
```

---

## 📁 Project Structure

```
JEEVAN-ROSHINI/
│
├── backend/                          # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/API/      # AuthController, DashboardDataController, MobileSyncController
│   │   │   └── Middleware/           # SecurityHeaders, RoleMiddleware, VillageAccessMiddleware
│   │   ├── Models/                   # Family, Individual, Village, Visit, Attendance, Leave, AuditLog...
│   │   ├── Repositories/             # BaseRepository, FamilyRepository, IndividualRepository...
│   │   ├── Services/                 # FamilyService, IndividualService, ApprovalService, AuditService...
│   │   └── Observers/                # Eloquent audit hooks (auto-logging model changes)
│   ├── database/
│   │   ├── migrations/               # 7 versioned schema files (geography, users, registries, ECHR...)
│   │   └── seeders/                  # Role, staff, geography, and sample data seeders
│   └── routes/
│       └── api.php                   # Versioned REST routes under /api/v1/
│
├── frontend/                         # React 19 + Vite + Tailwind CSS
│   ├── public/                       # PWA assets (manifest, service worker, background images)
│   ├── src/
│   │   ├── App.jsx                   # Root: Providers + react-router-dom Routes (~70 lines)
│   │   ├── pages/                    # LoginPage · VhwPage · DirectorPage · AdminPage
│   │   ├── layouts/                  # AppShell · AuthLayout
│   │   ├── hooks/                    # useTheme · useOnlineSync · useAppData · useGeography
│   │   ├── services/                 # 10 domain API service files
│   │   ├── contexts/                 # AppDataContext (global domain data store)
│   │   ├── context/                  # AuthContext · LanguageContext
│   │   ├── components/               # VhwPortal · DirectorPortal · AdminPortal · LogoShowcase
│   │   ├── utils/                    # riskAlertEngine.js (client-side vulnerability scoring)
│   │   └── __tests__/                # Unit, Integration tests (Vitest + MSW)
│   ├── e2e/                          # Playwright E2E test specs
│   ├── playwright.config.js
│   └── vite.config.js                # Vite + Vitest configuration
│
├── docs/                             # Test reports and documentation
│   ├── test-plan.md
│   ├── api-test-report.md
│   ├── integration-test-report.md
│   ├── system-test-report.md
│   ├── security-test-report.md
│   └── coverage-report.md
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend Framework** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS 4.x |
| **Icons** | Lucide React |
| **Charts** | ApexCharts + React-ApexCharts |
| **HTTP Client** | Axios (with Sanctum interceptors + exponential backoff retry) |
| **Routing** | react-router-dom v7 |
| **Backend Framework** | Laravel 12 (PHP 8.3+) |
| **Authentication** | Laravel Sanctum (stateless Bearer tokens) |
| **Database** | MySQL 8.0 |
| **ORM** | Eloquent (Repository pattern) |
| **Unit Testing** | Vitest + @testing-library/react + MSW |
| **E2E Testing** | Playwright |
| **API Mocking** | MSW (Mock Service Worker) |

---

## ⚙️ Installation & Setup

### Prerequisites

You can set up and run the project either **manually** or via **Docker**. Ensure you have the following prerequisites installed based on your preferred workflow:

| Workflow | Required Tools | Version |
|:---|:---|:---|
| **Manual Setup** | Node.js (LTS)<br>PHP<br>Composer<br>MySQL | Node v20+<br>PHP v8.3+<br>Composer v2.x<br>MySQL v8.0+ |
| **Docker Setup** | Docker Desktop<br>Docker Compose | Docker Engine v20.10+<br>Compose v2.x+ |

---

### Setup Method A: Docker Compose (Recommended & Fastest)

Docker automatically orchestrates the MySQL database, Laravel API, and React frontend without needing to install Node, PHP, or MySQL locally.

#### 1. Clone and Navigate
```bash
git clone https://github.com/ShanthiniHannah/JEEVAN-ROSHINI.git
cd JEEVAN-ROSHINI
```

#### 2. Start the Environment
Run Docker Compose in detached mode:
```bash
docker compose up -d --build
```
*This command pulls MySQL 8.0, builds both frontend and backend custom containers, connects the network, establishes volume directories, and executes migrations/seeders automatically.*

#### 3. Access the Portals
*   **React PWA Client**: `http://localhost:5173`
*   **Laravel API Server**: `http://localhost:8000`

#### 4. Stop the Environment
To turn off and remove the Docker containers safely:
```bash
docker compose down -v
```

---

### Setup Method B: Manual Installation

If you prefer to run the application natively on your system:

#### 1. Clone and Navigate
```bash
git clone https://github.com/ShanthiniHannah/JEEVAN-ROSHINI.git
cd JEEVAN-ROSHINI
```

#### 2. Backend Setup (Laravel 12)
```bash
cd backend

# Install PHP dependencies
composer install

# Create local environment config
cp .env.example .env

# Configure your database inside .env
# DB_DATABASE=jeevan_roshini
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Generate secure application encryption key
php artisan key:generate

# Build database schema, run migrations, and seed initial demo data
php artisan migrate:fresh --seed

# Spin up the backend API server
php artisan serve
# → API available at http://localhost:8000
```

#### 3. Frontend Setup (React 19)
```bash
cd ../frontend

# Install node dependencies
npm install

# Start Vite dev server with Hot Module Replacement
npm run dev
# → Portal available at http://localhost:5173
```

---

### 4. Running Test Suites

Verify database connection, authentication guards, and validation mechanics across our automated suites:

#### Unit & Integration Tests (Vitest)
```bash
cd frontend

# Run all 44 unit and integration assertions
npm run test

# Run and generate dynamic test coverage
npm run test:coverage
```

#### End-to-End (E2E) UI Tests (Playwright)
Ensure the Laravel API server is running, then execute:
```bash
cd frontend

# Run Playwright E2E tests
npm run test:e2e

# Open interactive Playwright testing dashboard
npm run test:e2e:ui
```

---

### 🔒 Environment Credentials & Secrets Management

To maintain a secure repository, **never commit production credentials to Git**. 

#### How to Generate a Secure Application Key
Laravel uses a cryptographically secure 256-bit key for cookie encryption and data decryption. Generate one securely by executing:
```bash
php artisan key:generate --show
```
*This will output a key format: `base64:XYZ...`*

#### Dynamic Override Configuration
Both local and production orchestrations in `docker-compose.yml` load credentials dynamically from shell environments with secure fallbacks:
*   `APP_KEY`: Encrypts sessions and tokens.
*   `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: Standard database overrides.

#### Setting Repository Secrets in GitHub Actions
To pass the keys securely during CI/CD checks:
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Register the following parameters:
   * **Name**: `APP_KEY`
   * **Value**: The output of your local `php artisan key:generate --show` execution.

## 🔑 Demo Login Credentials

Click any **Quick Demo Login** button on the login screen for instant one-click access:

| Role | Email | Password | Portal URL |
|:---|:---|:---|:---|
| **Super Admin (Trust)** | `admin@ayathanatrust.org` | `admin123` | `/admin` |
| **Project Director** | `director@ayathanatrust.org` | `director123` | `/director` |
| **VHW — Preema D'Souza** | `preema@ayathanatrust.org` | `vhw123` | `/vhw` |
| **VHW — Shobha Nayak** | `shobha@ayathanatrust.org` | `vhw123` | `/vhw` |

---

## 🌐 API Reference

All endpoints are versioned under `/api/v1/` and require a Sanctum Bearer token (except login).

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/v1/login` | Public | Authenticate and receive Sanctum token |
| `POST` | `/api/v1/logout` | Bearer | Invalidate current session |
| `GET` | `/api/v1/me` | Bearer | Get authenticated user profile |
| `GET` | `/api/v1/dashboard` | Bearer | Aggregate metrics (Redis-cached) |
| `GET` | `/api/v1/villages` | Bearer | Geography lookup |
| `GET/POST` | `/api/v1/families` | Bearer | Family registry |
| `GET/POST` | `/api/v1/individuals` | Bearer | Individual health records |
| `POST` | `/api/v1/individuals/{id}/reveal` | Bearer | PII reveal (audited) |
| `GET/POST` | `/api/v1/visits` | Bearer | Field visit logs |
| `GET` | `/api/v1/attendances` | Bearer | Attendance records |
| `POST` | `/api/v1/attendance/check-in` | Bearer | GPS clock-in |
| `POST` | `/api/v1/attendance/check-out` | Bearer | GPS clock-out |
| `GET/POST` | `/api/v1/leaves` | Bearer | Leave requests |
| `POST` | `/api/v1/approvals/action` | Director | Approve / reject actions |
| `GET` | `/api/v1/audits` | Admin | Immutable audit trail |
| `POST` | `/api/v1/admin/backups` | Admin | Trigger encrypted cloud backup |
| `POST` | `/api/v1/sync` | Bearer | Flush PWA offline queue |

---

## 🧪 Testing

| Suite | Tool | Files | Tests | Status |
|:---|:---|:---|:---|:---|
| Unit — Hooks | Vitest | 1 | 6 | ✅ Pass |
| Unit — Services | Vitest + MSW | 3 | 10 | ✅ Pass |
| Integration — Auth | Vitest + MSW | 1 | 2 | ✅ Pass |
| Integration — Family | Vitest + MSW | 1 | 3 | ✅ Pass |
| **Total** | | **6** | **21** | **✅ 21/21** |
| E2E — Login | Playwright | 1 | 6 | Chromium |
| E2E — VHW Flow | Playwright | 1 | 5 | Chromium |
| E2E — Approval | Playwright | 1 | 4 | Chromium |

---

## 🔐 Security Highlights

- ✅ **CSP, HSTS, X-Frame-Options** headers on every API response
- ✅ **RBAC middleware** — VHW cannot access audit logs; Director cannot trigger backups
- ✅ **Frontend ProtectedRoute** — wrong-role users redirected to `/login`
- ✅ **Sanctum Bearer tokens** with automatic 401 interception and local storage cleanup
- ✅ **PII masking** with audited reveal logging
- ✅ **Eloquent parameterized queries** — SQL injection protection built-in
- ✅ **React's escaped interpolation** — XSS protection by default

---

## 📊 Build Stats

```
✓ 1833 modules transformed
✓ Built in 1.04s
✓ 21/21 tests passing
✓ 0 vulnerabilities in 322 packages
```

---

## 📄 License

This project was developed for **Ayathana Trust** as a proprietary health governance platform.
All rights reserved © 2026 Ayathana Trust.

---

<div align="center">

**Developed with ❤️ by Shanthini Hannah**

*Jeevan Roshini — Bringing the light of digital health to every village*

</div>
