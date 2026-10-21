# SMM Lead Management CRM — staged build

## 1. Schema audit and implementation plan

### Reference feature inventory

The supplied Instabiz HTML has 11 fixed statuses; status counts; search by name/phone; status, webinar-date and date-range filters; notes; follow-up date; revenue; a call list; manual lead creation/edit/delete; duplicate rows for webinar cycles; CSV import/export and a template download. It saves data in browser `localStorage`, so it is single-browser storage and does not provide multi-user access control.

The original file is preserved at [`backups/Instabiz_Lead_Tracker_original.html`](backups/Instabiz_Lead_Tracker_original.html). This preview keeps the status names and webinar-cycle concept, and adds the requested admin/caller page layouts.

### Audit result and gaps in the existing project

The current project is a static mock-data preview. It has no Supabase client, schema export, database connection, project URL, dashboard access, or RLS policy output. The schema audit is therefore **pending**. No migration or RLS policy has been written or run. The read-only inventory query is [`supabase/schema-audit.sql`](supabase/schema-audit.sql).

The latest request's distribution, upload-history, role/account and upload-date flows have been added to the preview UI. The data is still synthetic and in-memory. Database-generated upload timestamps, Auth users, persistent assignments and tested RLS remain unimplemented until the actual schema and project settings are audited.

### Sequence and current state

1. **Inspect the reference HTML:** complete; feature inventory above.
2. **Inspect existing Supabase tables, constraints, indexes, Auth settings and RLS:** pending the audit result and Auth settings from the project owner.
3. **Back up the original and build pages with mock data:** complete; all requested pages are present. The preview is labeled and uses synthetic records only.
4. **Write safe migrations after comparing the actual schema:** pending Step 2; intentionally no write SQL is supplied.
5. **Implement Supabase Auth, role routing and sessions:** not connected.
6. **Implement Supabase data access and tested RLS:** not connected.
7. **Implement privileged Edge Functions and audit logging:** not connected; details in `supabase/functions/README.md`.
8. **Connect import, assignment, updates, reports and exports:** CSV/XLSX preview and sample assignment flows exist; database writes are not connected.
9. **Run admin/two-caller security tests:** pending live Auth users, schema, policies and deployed data layer.
10. **Deployment and final security report:** preview deployment instructions are below; production CRM deployment is pending Steps 2–9.

## 2. Project tree

```text
smm-crm/
├── index.html
├── admin.html
├── caller.html
├── pages/
│   ├── all-leads.html
│   ├── upload-leads.html
│   ├── lead-distribution.html
│   ├── caller-management.html
│   ├── reports.html
│   ├── activity-logs.html
│   ├── my-leads.html
│   ├── my-follow-ups.html
│   └── my-performance.html
├── css/style.css
├── js/app.js
├── js/supabase-config.js
├── js/vendor/xlsx.full.min.js
├── backups/Instabiz_Lead_Tracker_original.html
├── THIRD-PARTY-NOTICES.md
├── licenses/Apache-2.0.txt
├── tests/
│   ├── preview-smoke.js
│   └── preview-interactions.js
└── supabase/
    ├── schema-audit.sql
    ├── migrations/README.md
    └── functions/README.md
```

## Files changed for this update

- `js/app.js` — caller count distribution, assignment filters/summary, bulk reassignment, upload timestamps in lead rows, upload history, CSV/XLSX preview, and preview user-ID/role form.
- `pages/upload-leads.html` — loads the local Excel parser on the upload page.
- `css/style.css` — responsive allocation cards, reassignment controls, and result messages.
- `js/vendor/xlsx.full.min.js` — vendored SheetJS Community Edition parser for `.xlsx` preview.
- `THIRD-PARTY-NOTICES.md` and `licenses/Apache-2.0.txt` — notices and license for the bundled parser.
- `tests/preview-smoke.js` and `tests/preview-interactions.js` — repeatable checks for rendered pages and sample interactions.
- `README.md`, `supabase/migrations/README.md`, `supabase/functions/README.md` — setup, audit gaps, and secure backend sequence.

No database schema, Auth, or RLS file was changed because the existing Supabase schema was not available for audit.

## 3. Preview behavior

This is a layout and interaction preview, not a secure CRM. Sign-in is a role selector that navigates to sample admin or caller screens; it does not authenticate. Sample records contain invalid placeholder phone numbers. Changes are held in JavaScript memory and reset on reload. CSV/XLSX preview and CSV export work locally; import does not write records. SheetJS CE 0.20.3 is vendored locally for `.xlsx` preview; see the third-party notices and Apache license file.

The page layouts include responsive navigation, status badges, lead search/status/webinar/upload-date filters, notes, follow-up fields, sample reports, caller-count distribution, bulk reassignment, upload history, and confirmation for sample changes. The distribution preview prevents duplicate ownership by keeping one current caller per lead and preserves each sample upload timestamp when the owner changes. Admin/caller pages are not protected by Supabase yet; do not upload real lead/customer data or deploy this preview for a calling team.

## 4. Supabase audit and safe SQL order

1. Create or select the intended Supabase project.
2. Open **SQL Editor** and run `supabase/schema-audit.sql`. It is read-only and returns inventory for public objects, columns, constraints, indexes and RLS policies. Save all result sets.
3. In Supabase Dashboard, inspect **Authentication → Providers**, **URL Configuration**, email confirmation and session settings. Record the project ref and project URL; do not send passwords or service-role keys.
4. Review the schema and audit output before designing migrations. Then add only incremental `ALTER`/new-object SQL after checking table names, columns, constraints, grants, triggers and RLS. Apply migrations in a staging project first and verify existing rows remain intact.
5. Enable and test RLS on each private table. The policy design must derive the role from the authenticated profile row linked to `auth.users.id`; callers must only read and edit their assigned leads, and only the allowed fields. Server-side functions must gate privileged Auth Admin operations and create audit events.

**There is no safe schema-changing SQL to run from this package yet.** Do not run a guessed schema or policy. Provide the audit query results and Auth settings to continue Steps 2–7.

## 5. Supabase URL/key placeholders

`js/supabase-config.js` contains:

- `url`: replace `https://YOUR_PROJECT_REF.supabase.co` with the Supabase project URL.
- `publishableKey`: replace the placeholder with the project publishable key (or legacy anon key).

These are public client settings; access is safe only after correctly designed and tested RLS. Never place the service-role key, database password, or other secret in browser code or source control. The current preview does not load a Supabase client or use these placeholders.

### Secure initial Admin and caller account setup

Do not add public Admin signup. After the schema audit, implement a one-time server-side Admin bootstrap that can run only for the first Admin, links the Auth user ID to the audited profile/role structure, and is disabled after setup. Then invite additional Admin/Caller users through an Edge Function that validates the signed-in Admin role and writes an audit event. Use Supabase Auth email invitations/password recovery so passwords are set and managed by Auth; do not store password text in a CRM table. These operations are described in the preview only and are not connected yet.

## 6. Local preview and free hosting

### Local

Open this folder in VS Code and serve it as static files. For example, from the project folder run `python -m http.server 5500`, then open `http://localhost:5500/`. You can also use the free VS Code Live Server extension. The Excel parser is bundled locally. Do not enter production credentials or actual lead data in preview mode.

### Free static preview hosting

Commit the project to a GitHub repository, import it in Vercel, choose the static/Other preset, set the root directory to this project, leave the build command blank, and deploy. This publishes only the mock preview. A live CRM deployment should wait until Auth, RLS, Edge Functions, and the security test cases below are implemented and pass.

## 7. Test report and security checklist

### Implemented preview checks

- All 12 requested HTML routes and the original-file backup are present.
- The exact 11 required status strings are defined in the shared preview script.
- The login preview, navigation, sample lead filters, CSV/XLSX preview, CSV export, sample count distribution, bulk reassignment, caller status/remark/follow-up editing, sample webinar-cycle creation and confirmation-gated sample deletion are front-end interactions only.
- Repeat the Node-based render and interaction checks from this folder with `node tests/preview-smoke.js` and `node tests/preview-interactions.js`. These checks use a small deterministic DOM adapter; they are not live-browser or Supabase tests.
- Database-generated upload timestamps, live upload/history, persisted assignments, Auth login/account provisioning and access-control tests have **not** been run because no Supabase schema/project was supplied.

### Required before production

- [ ] Admin can sign in and manage all leads after authorization is checked on the server/database.
- [ ] Caller A cannot read or edit Caller B's leads, including direct Supabase API requests.
- [ ] Caller cannot upload, delete, assign, transfer, manage accounts or change roles, including direct API requests.
- [ ] Logged-out visitors cannot read protected pages or private data.
- [ ] Admin upload, assignment, transfer, edit, export and confirmed deletion work as intended.
- [ ] Statuses, webinar cycles, remarks, follow-ups and revenue survive import and migration correctly.
- [ ] Every private table has RLS enabled and policies are tested with admin and at least two caller accounts.
- [ ] Privileged Auth Admin operations run only through a server-side function; service-role secret is stored only in Supabase Function Secrets.
- [ ] Activity logs are written server-side and cannot be forged by callers.

## Remaining implementation input

To proceed with database/Auth steps, share the five result sets from `supabase/schema-audit.sql` and the non-secret Auth configuration (enabled providers, email-confirmation setting, redirect URLs, and session settings). Do not share the service-role key or database password.
