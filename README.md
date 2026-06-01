# Jeevan Roshini (ਜੀਵਨ ਰੋਸ਼ਨੀ / જીવન રોશની) 🩺
### NGO Health Governance & Offline Field PWA Platform

Jeevan Roshini is a 100% production-grade community health governance and field activities platform designed for **Ayathana Trust** to manage rural maternal health, elderly palliative care, and disease surveillance. 

The platform supports offline-first synchronization for field Village Health Workers (VHW) via a Progressive Web App (PWA) simulation sandbox, a role-based approval center for Project Directors, and security governance, system audit logs, disaster recovery backups, and notification logs for Trust Administrators.

---

## 🚀 Key Features

1. **Unified Approval Workflows**: Hierarchical review statuses (`Draft`, `Submitted`, `Under Review`, `Approved`, `Rejected`, `Returned`, `Completed`) applied across attendance, leave requests, social support, and clinical referrals.
2. **Comprehensive Audit Trail**: Complete historical logs mapping old-to-new values during insertions, edits, deletions, and PII reveal tracking.
3. **District-Level Visibility Boundaries**: Secure role-based filtering restricting VHWs and Directors to their assigned geographies (e.g., specific villages or blocks).
4. **VHW Wizard Forms & Validation**: Simplified step-by-step mobile wizards with duplicate registration checks and clinical data validation (e.g., warning on juvenile diabetes, male pregnancy blocks).
5. **Offline Sync Sandbox**: Diagnostic hub simulation for checking connectivity ping, uploading queued offline registrations, and validating parity.
6. **NGO Vulnerability Scoring**: Automated algorithm calculating risk indexes based on pregnancy, age, disability, and BPL status.
7. **Privacy & Security Control (PII Masking)**: Masked patient phone numbers with audited "Reveal Eye" tracking logs.
8. **Disaster Recovery & Scheduled Backups**: Admin dashboard panel for triggering database dumps and running recovery validation scripts.
9. **Twilio/SMTP Delivery Logs**: Trace outgoing SMS, email, and WhatsApp notification payload delivery codes.

---

## 📁 Project Directory Structure

```text
JEEVAN ROSHINI/
├── backend/                    # Laravel RESTful Backend API
│   ├── app/
│   │   ├── Http/Controllers/   # API Request handlers (MobileSync, Geography, etc.)
│   │   ├── Models/             # Eloquent Models (Individual, Family, AuditLog, etc.)
│   │   ├── Observers/          # Audit log triggers for Eloquent hooks
│   │   └── Services/           # Business logic engines (AuditLogger, RiskEngine)
│   ├── database/
│   │   ├── migrations/         # DB Schemas (users, registries, operations, ECHR)
│   │   └── seeders/            # Pre-populated demographic and role data seeders
│   └── routes/
│       └── api.php             # API Route registrations
│
├── frontend/                   # React + Vite + Tailwind CSS Frontend PWA
│   ├── public/                 # Static assets, branding, and PWA Service Worker
│   │   ├── login-bg-new.png    # Watercolor branding background
│   │   ├── sw.js               # Service Worker caching rules
│   │   └── manifest.json       # PWA installer manifest
│   ├── src/
│   │   ├── assets/             # Brand logos (logo_light, logo_dark, logo_brand)
│   │   ├── components/
│   │   │   ├── AdminPortal.jsx # Backup runner, audit trail, environment configs
│   │   │   ├── DirectorPortal.jsx # Approvals center, village A/B comparison gauges
│   │   │   ├── VhwPortal.jsx   # Mobile VHW offline wizard, sync sandbox, timeline
│   │   │   ├── CommunityHealthIllustration.jsx # Center ECG layout animation
│   │   │   └── LogoShowcase.jsx # Brand Identity guidelines inspector
│   │   ├── context/
│   │   │   └── LanguageContext.jsx # Multi-lingual state engine (8 languages)
│   │   ├── utils/
│   │   │   └── riskAlertEngine.js  # Client-side validation & risk assessor
│   │   ├── App.jsx             # Root layout, 2FA guard, global state seed
│   │   └── main.jsx            # Entry point
│   ├── index.html              # HTML shell
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Node dependencies
│
└── README.md                   # Project documentation
```

---

## 🛠️ Technical Stack

- **Frontend**:
  - React 18
  - Vite (HMR and optimized production bundling)
  - Lucide React (Icons)
  - Tailwind CSS (Fluid responsive utility design down to `360px` screens)
  - Service Workers (Local database and offline caching assets)
  - ApexCharts (Visual comparison comparison center)
- **Backend**:
  - Laravel Framework (PHP 8.1+)
  - Eloquent ORM
  - MySQL Relational Engine

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have the following installed locally:
- Node.js (v18+)
- PHP (v8.1+)
- Composer (PHP Dependency Manager)
- MySQL Database server

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Composer dependencies:
   ```bash
   composer install
   ```
3. Set up the environment variables:
   ```bash
   cp .env.example .env
   ```
   *Configure your `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` inside the `.env` file.*
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations to build the schemas and seed the initial database:
   ```bash
   php artisan migrate --seed
   ```
6. Start the Laravel local API dev server:
   ```bash
   php artisan serve
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading dev server:
   ```bash
   npm run dev
   ```
4. Build the static production distribution:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Access Credentials

The portal is preloaded with roles for testing. If accessing via the **Quick Demo Login** section on the login screen, clicking any role will autofill and trigger the 2-Factor Authentication (2FA) screen:

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@ayathanatrust.org` | `admin123` | Backups, SMTP logs, global audits, config switcher |
| **Project Director** | `director@ayathanatrust.org` | `director123` | Unified approvals, village side-by-side charts |
| **VHW Worker 1** | `preema@ayathanatrust.org` | `vhw123` | VHW mobile wizard forms, sync logs, clinical database |
| **VHW Worker 2** | `shobha@ayathanatrust.org` | `vhw123` | VHW mobile wizard forms, sync logs, clinical database |

> [!TIP]
> **2-Factor Authentication (2FA) Bypass**: When signing in to administrative roles (Super Admin or Project Director), you can check the code displayed in the mock notification box or enter the system override code **`123456`** or **`582910`**.

---
*Developed by Shanthini Hannah.*
