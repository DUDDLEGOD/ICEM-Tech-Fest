# Registration Backend Setup (Google Apps Script)

This project supports a structured registration API using Google Apps Script + Google Sheets + Google Workspace email sending.

## 1) Required Spreadsheet tabs

Create a Google Sheet with these tabs:

- `registrations`
- `members`
- `email_log`

Headers are auto-created by the provided script if a tab is empty.

## 2) Apps Script deployment

1. Open the target Google Sheet.
2. Go to `Extensions -> Apps Script`.
3. Paste [`apps-script/Code.gs`](/C:/Users/Ashish/my code/ICEM_TECT_FEST/apps-script/Code.gs) content.
4. Save and deploy:
   - `Deploy -> New deployment -> Web app`
   - Execute as: `Me`
   - Who has access: `Anyone`
5. Copy the Web App URL.
6. In this repo, create `.env.local` from [.env.example](/C:/Users/Ashish/my code/ICEM_TECT_FEST/.env.example):
   - `VITE_REGISTRATION_API_URL=<your-web-app-url>`
7. Restart the Vite dev server.

## 3) Sender account requirements

- The Apps Script owner account is the email sender.
- Use an institutional Google Workspace account if possible for better trust/deliverability.
- In Apps Script, grant permissions for:
  - `MailApp`
  - `SpreadsheetApp`

## 4) API behavior

The endpoint returns JSON:

- `confirmed`: registration persisted + email sent
- `duplicate`: registration blocked (same `eventId` + leader email)
- `failed`: validation/server failure

Frontend compatibility fallback:

- If strict CORS JSON is unavailable, frontend falls back to `no-cors` submit and treats result as `queued`.

## 5) Validation and duplicate policy

- Required: `eventId`, `teamName`, `leaderName`, `leaderEmail`, `leaderPhone`
- Member rows must contain valid name and email.
- Duplicate criteria:
  - same event id
  - same normalized leader email (lowercase, trimmed)

## 6) Professional confirmation email format

Subject:

- `TechnoFest 2026 Registration Confirmed | <Event Name> | <Registration ID>`

Body includes:

- Greeting with leader name
- Registration details (ID/event/team/leader/date/time/venue)
- Team table (leader + members)
- Help contact block
- Formal ICEM TechnoFest sign-off

## 7) Test checklist

1. Submit new registration:
   - row created in `registrations`
   - member rows created in `members`
   - email log entry in `email_log`
   - email received by leader
2. Submit duplicate (same event + leader email):
   - API returns `duplicate`
   - no new registration row
   - no new email sent
3. Simulate compatibility mode (legacy endpoint without readable CORS response):
   - frontend handles as `queued`
   - UI does not crash
4. Verify event content update:
   - edit [constants.tsx](/C:/Users/Ashish/my code/ICEM_TECT_FEST/constants.tsx)
   - modal and registration dropdown reflect updates
