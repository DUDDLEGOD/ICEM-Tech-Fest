/**
 * Supabase → Google Sheets Export Script
 * =======================================
 *
 * Fetches all registration data from Supabase and writes it to a Google Sheet
 * with separate sheets per department, colour-coded headers, and clean formatting.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  SETUP
 * ────────────────────────────────────────────────────────────────────────────
 *
 *  1. Create a Google Cloud project & enable the Google Sheets API.
 *  2. Create a Service Account, download its JSON key, and store it at the
 *     path you set in GOOGLE_SERVICE_ACCOUNT_KEY_FILE (or put the JSON inline
 *     in the GOOGLE_SERVICE_ACCOUNT_KEY env var).
 *  3. Share your Google Sheet with the service account email (Editor access).
 *  4. Create a `.env` file (or set env vars) with:
 *
 *       SUPABASE_URL=https://xxx.supabase.co
 *       SUPABASE_ANON_KEY=eyJ...
 *       GOOGLE_SPREADSHEET_ID=1AbC...(from the sheet URL)
 *       GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account.json
 *
 *  5. Run:  bun run scripts/export-to-sheets.ts
 * ────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ─── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '';
const SERVICE_ACCOUNT_KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}
if (!SPREADSHEET_ID) {
  console.error('❌ Missing GOOGLE_SPREADSHEET_ID');
  process.exit(1);
}

// ─── Supabase client ─────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Google Sheets auth ──────────────────────────────────────────────────────
async function getGoogleSheetsClient() {
  let credentials: any;

  if (SERVICE_ACCOUNT_KEY_FILE && fs.existsSync(SERVICE_ACCOUNT_KEY_FILE)) {
    credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_FILE, 'utf-8'));
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } else {
    console.error('❌ No Google service account key found. Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE or GOOGLE_SERVICE_ACCOUNT_KEY');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// ─── Colour palette per department ───────────────────────────────────────────
// RGB components 0‒1 (Google Sheets API requirement)
interface RGB { red: number; green: number; blue: number }
const DEPT_COLOURS: Record<string, RGB> = {
  'First-Year':           { red: 0.94, green: 0.56, blue: 0.22 }, // orange
  'Computer Dept.':       { red: 0.24, green: 0.65, blue: 0.83 }, // blue
  'AIDS Dept.':           { red: 0.40, green: 0.73, blue: 0.42 }, // green
  'IT Dept':              { red: 0.66, green: 0.33, blue: 0.83 }, // purple
  'Civil Dept.':          { red: 0.83, green: 0.72, blue: 0.35 }, // gold
  'Mech Dept.':           { red: 0.83, green: 0.33, blue: 0.33 }, // red
  'ENTC Dept.':           { red: 0.33, green: 0.83, blue: 0.73 }, // teal
  'MCA/BCA Dept.':        { red: 0.83, green: 0.45, blue: 0.63 }, // pink
  'MBA Dept. (IGSB+ICEM)':{ red: 0.55, green: 0.55, blue: 0.83 }, // lavender
};
const DEFAULT_COLOUR: RGB = { red: 0.5, green: 0.5, blue: 0.5 };

// ─── Event ID → Dept mapping (mirrors site-config.md) ────────────────────────
const EVENT_DEPARTMENT: Record<string, string> = {
  CHAKRAVYUH:       'First-Year',
  NEUROAVATAR:      'Computer Dept.',
  DATA_DASH:        'AIDS Dept.',
  CYBER_SHIELD:     'IT Dept',
  BRIDGE:           'Civil Dept.',
  FAST_FURIOUS:     'Mech Dept.',
  CIRCUIT_CRAFTERS: 'ENTC Dept.',
  WEB_WIZARDS:      'MCA/BCA Dept.',
  LAUNCHPAD:        'MBA Dept. (IGSB+ICEM)',
};

const EVENT_NAME: Record<string, string> = {
  CHAKRAVYUH:       'Chakravyuh',
  NEUROAVATAR:      'NeuroAvatar Arena',
  DATA_DASH:        'Data Dash',
  CYBER_SHIELD:     'Cyber Shield Challenge',
  BRIDGE:           'The Gravity Game – Bridge Making',
  FAST_FURIOUS:     'Fast & Furious',
  CIRCUIT_CRAFTERS: 'Circuit Crafters',
  WEB_WIZARDS:      'Web Wizards Challenge',
  LAUNCHPAD:        'LaunchPad Business Plan Challenge',
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface RegistrationRow {
  id: string;
  registration_ref: string;
  team_name: string;
  event_id: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_college: string;
  abstract_text: string;
  status: string;
  fee_paid: number;
  has_paid: boolean;
  payment_screenshot_url: string | null;
  created_at: string;
}

interface MemberRow {
  id: string;
  registration_id: string;
  name: string;
  email: string;
  college: string;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('📊 Fetching registrations from Supabase...');

  const { data: registrations, error: regErr } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: true });

  if (regErr) {
    console.error('❌ Failed to fetch registrations:', regErr.message);
    process.exit(1);
  }

  const { data: members, error: memErr } = await supabase
    .from('team_members')
    .select('*');

  if (memErr) {
    console.error('❌ Failed to fetch team members:', memErr.message);
    process.exit(1);
  }

  const regs = (registrations || []) as RegistrationRow[];
  const mems = (members || []) as MemberRow[];

  console.log(`   → ${regs.length} registrations, ${mems.length} team members`);

  // Group members by their registration_id
  const membersByReg = new Map<string, MemberRow[]>();
  for (const m of mems) {
    const arr = membersByReg.get(m.registration_id) || [];
    arr.push(m);
    membersByReg.set(m.registration_id, arr);
  }

  // Group registrations by department
  const byDept = new Map<string, RegistrationRow[]>();
  // Also collect an "All Registrations" master list
  for (const reg of regs) {
    const dept = EVENT_DEPARTMENT[reg.event_id] || 'Other';
    const arr = byDept.get(dept) || [];
    arr.push(reg);
    byDept.set(dept, arr);
  }

  // Build per-sheet data
  const sheets = getGoogleSheetsClient();
  const sheetsClient = await sheets;

  // ── Clear existing sheets & create new ones ──────────────────────────────
  console.log('📝 Preparing Google Sheet...');

  const spreadsheet = await sheetsClient.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const existingSheets = spreadsheet.data.sheets || [];
  const existingTitles = existingSheets.map(s => s.properties?.title || '');

  // We plan these sheets: "All Registrations" + one per department
  const sheetNames = ['All Registrations', ...Array.from(byDept.keys()).sort()];

  // Delete old sheets that we manage (re-create fresh)
  const deleteRequests: any[] = [];
  for (const sheet of existingSheets) {
    const title = sheet.properties?.title || '';
    if (sheetNames.includes(title)) {
      deleteRequests.push({
        deleteSheet: { sheetId: sheet.properties?.sheetId },
      });
    }
  }

  // Add new sheets
  const addRequests: any[] = sheetNames.map((title, idx) => ({
    addSheet: {
      properties: { title, index: idx },
    },
  }));

  // If all existing sheets would be deleted, keep at least a temp one
  const willDeleteAll = deleteRequests.length === existingSheets.length;
  if (willDeleteAll) {
    addRequests.unshift({
      addSheet: {
        properties: { title: '__temp__' },
      },
    });
  }

  // Execute batch: add first, then delete
  const batchRequests = [...addRequests, ...deleteRequests];
  if (batchRequests.length > 0) {
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: batchRequests },
    });
  }

  // If we added a temp sheet, delete it
  if (willDeleteAll) {
    const refreshed = await sheetsClient.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const tempSheet = refreshed.data.sheets?.find(s => s.properties?.title === '__temp__');
    if (tempSheet) {
      await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{ deleteSheet: { sheetId: tempSheet.properties?.sheetId } }],
        },
      });
    }
  }

  // Refresh sheet metadata to get new sheetIds
  const finalMeta = await sheetsClient.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetIdByName = new Map<string, number>();
  for (const s of finalMeta.data.sheets || []) {
    sheetIdByName.set(s.properties?.title || '', s.properties?.sheetId || 0);
  }

  // ── Write data + format ──────────────────────────────────────────────────
  const HEADER = [
    '#', 'Reference ID', 'Team Name', 'Event', 'Department',
    'Leader Name', 'Leader Email', 'Leader Phone', 'College',
    'Team Members', 'Abstract', 'Status', 'Payment', 'Fee', 'Screenshot URL', 'Timestamp',
  ];

  function buildRows(regList: RegistrationRow[]): string[][] {
    return regList.map((reg, idx) => {
      const teamMembers = membersByReg.get(reg.id) || [];
      const memberStr = teamMembers.map(m => `• ${m.name} (${m.email} / ${m.college})`).join('\n');
      const dept = EVENT_DEPARTMENT[reg.event_id] || 'Other';
      const eventName = EVENT_NAME[reg.event_id] || reg.event_id;
      const date = new Date(reg.created_at).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true, timeZone: 'Asia/Kolkata'
      });

      return [
        String(idx + 1),
        reg.registration_ref,
        reg.team_name,
        eventName,
        dept,
        reg.leader_name,
        reg.leader_email,
        reg.leader_phone,
        reg.leader_college,
        memberStr || 'Standalone',
        reg.abstract_text || 'None',
        reg.status,
        reg.has_paid ? '✅ PAID' : '❌ UNPAID',
        `₹${reg.fee_paid}`,
        reg.payment_screenshot_url || 'N/A',
        date,
      ];
    });
  }

  // Write each sheet
  for (const sheetName of sheetNames) {
    const sheetId = sheetIdByName.get(sheetName);
    if (sheetId === undefined) continue;

    const isAll = sheetName === 'All Registrations';
    const regList = isAll ? regs : (byDept.get(sheetName) || []);
    const rows = buildRows(regList);
    const dept = isAll ? 'All' : sheetName;
    const colour = DEPT_COLOURS[dept] || DEFAULT_COLOUR;
    const headerColour = isAll
      ? { red: 0.12, green: 0.12, blue: 0.18 }
      : colour;

    console.log(`   ✍️  "${sheetName}" — ${regList.length} registrations`);

    // Write header + data
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [HEADER, ...rows] },
    });

    // ── Formatting requests ──────────────────────────────────────────────
    const formatRequests: any[] = [];

    // 1. Header row: bold, white text, coloured background
    formatRequests.push({
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADER.length },
        cell: {
          userEnteredFormat: {
            backgroundColor: headerColour,
            textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            wrapStrategy: 'WRAP',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
      },
    });

    // 2. Freeze header row
    formatRequests.push({
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
        fields: 'gridProperties.frozenRowCount',
      },
    });

    // 3. Set column widths
    const COLUMN_WIDTHS = [
      40,  // #
      120, // Reference ID
      180, // Team Name
      180, // Event
      150, // Department
      150, // Leader Name
      180, // Leader Email
      120, // Leader Phone
      200, // College
      350, // Team Members
      350, // Abstract
      100, // Status
      80,  // Payment
      80,  // Fee
      300, // Screenshot URL
      200, // Timestamp
    ];

    formatRequests.push({
      updateDimensionProperties: {
        range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: HEADER.length },
        properties: { pixelSize: 100 }, // default fallback
        fields: 'pixelSize',
      },
    });

    COLUMN_WIDTHS.forEach((width, i) => {
      formatRequests.push({
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: i, endIndex: i + 1 },
          properties: { pixelSize: width },
          fields: 'pixelSize',
        },
      });
    });

    // Also auto-resize for any overflow
    formatRequests.push({
      autoResizeDimensions: {
        dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: HEADER.length },
      },
    });

    // 4. Zebra striping for data rows
    if (rows.length > 0) {
      formatRequests.push({
        addBanding: {
          bandedRange: {
            range: { sheetId, startRowIndex: 0, endRowIndex: rows.length + 1, startColumnIndex: 0, endColumnIndex: HEADER.length },
            rowProperties: {
              headerColor: headerColour,
              firstBandColor: { red: 0.97, green: 0.97, blue: 0.97 },
              secondBandColor: { red: 1, green: 1, blue: 1 },
            },
          },
        },
      });
    }

    // 5. Status column conditional formatting (column L = index 11)
    formatRequests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rows.length + 1, startColumnIndex: 11, endColumnIndex: 12 }],
          booleanRule: {
            condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Confirmed' }] },
            format: {
              backgroundColor: { red: 0.85, green: 0.96, blue: 0.85 },
              textFormat: { foregroundColor: { red: 0.1, green: 0.5, blue: 0.1 }, bold: true },
            },
          },
        },
        index: 0,
      },
    });

    formatRequests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rows.length + 1, startColumnIndex: 11, endColumnIndex: 12 }],
          booleanRule: {
            condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Pending' }] },
            format: {
              backgroundColor: { red: 1, green: 0.95, blue: 0.8 },
              textFormat: { foregroundColor: { red: 0.7, green: 0.5, blue: 0.0 }, bold: true },
            },
          },
        },
        index: 1,
      },
    });

    // 6. Paid column (column M = index 12) conditional formatting
    formatRequests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rows.length + 1, startColumnIndex: 12, endColumnIndex: 13 }],
          booleanRule: {
            condition: { type: 'TEXT_CONTAINS', values: [{ userEnteredValue: '✅' }] },
            format: {
              backgroundColor: { red: 0.85, green: 0.96, blue: 0.85 },
            },
          },
        },
        index: 2,
      },
    });

    formatRequests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rows.length + 1, startColumnIndex: 12, endColumnIndex: 13 }],
          booleanRule: {
            condition: { type: 'TEXT_CONTAINS', values: [{ userEnteredValue: '❌' }] },
            format: {
              backgroundColor: { red: 1, green: 0.88, blue: 0.88 },
            },
          },
        },
        index: 3,
      },
    });

    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: formatRequests },
    });
  }

  console.log('\n✅ Export complete! Open your Google Sheet:');
  console.log(`   https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}\n`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
