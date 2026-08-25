# NTSuite Automated Tests

Generated test suite for NTSuite web application.

## Target

```
http://qa.evosphere.nt.core/
```

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npx playwright install
```

## Authentication

The tests use Playwright's `storageState` for session management.  
Auth files are stored in `playwright/.auth/*.json` per role.

### First run — generate auth files:

```bash
npx playwright test tests/auth.setup.ts
```

This logs in once per role and saves the session state.

### Credentials

Default credentials are in `utils/authHelper.ts`.  
Override via environment variables in `.env`:

```
ADMIN_USER=NT-5175
ADMIN_PASS=yourpassword
USER_USER=NT-6041
USER_PASS=yourpassword
```

## Running Tests

### All tests:
```bash
npx playwright test
```

### Single module:
```bash
npx playwright test --grep "Login Module"
npx playwright test --grep "Timesheets Module"
```

### Single test case:
```bash
npx playwright test --grep "L-001"
npx playwright test --grep "T-010"
```

### Headed mode (see the browser):
```bash
npx playwright test --headed
```

### UI mode:
```bash
npx playwright test --ui
```

## Reports

### Playwright HTML report:
```bash
npx playwright show-report
```

### Allure report:
```bash
npm run allure:generate
npm run allure:open
```

## Project Structure

```
├── playwright.config.ts       # Test configuration
├── .env                       # Environment variables
├── pages/                     # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── ClientsPage.ts
│   └── ...
├── tests/                     # Test specs
│   ├── auth.setup.ts          # Auth setup per role
│   ├── login.spec.ts
│   ├── home.spec.ts
│   ├── clients.spec.ts
│   ├── teams.spec.ts
│   ├── roster.spec.ts
│   └── ...
├── utils/                     # Shared utilities
│   ├── config.ts
│   ├── Login.ts
│   └── authHelper.ts
├── playwright/
│   └── .auth/                 # Session storage files
└── allure-results/            # Allure test results
```

## Test Case Coverage

| Module | Test Cases |
|--------|-----------|
| Login | L-001 to L-011 |
| Home / Dashboard | H-001 to H-029 |
| Notifications | N-001 to N-013 |
| Clients | C-001 to C-013 |
| Point of Contact | P-001 to P-015 |
| Teams | T-001 to T-030 |
| Roster | R-001 to R-050 |
| Skills | S-001 to S-008 |
| Team Activities | M-001 to M-013 |
| Benched Employees | B-001 to B-012 |
| Timesheets | T-001 to T-057 |
| Holidays | HO-001 to HO-012 |
| Timesheet Builder | TB-001 to TB-006 |
| Evaluations | ME-001 to RH-007 |
