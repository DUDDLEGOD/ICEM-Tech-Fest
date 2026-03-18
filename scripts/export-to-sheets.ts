/**
 * Supabase -> Google Sheets Export Script
 * ======================================
 *
 * Fetches registration data from Supabase and writes it to a Google Sheet
 * with an overview dashboard, one master sheet, and department-wise sheets.
 *
 * Setup:
 * 1. Enable the Google Sheets API in your Google Cloud project.
 * 2. Create a service account and save its JSON key.
 * 3. Share the target Google Sheet with the service account email.
 * 4. Create a `.env` file (or set env vars) with:
 *
 *      SUPABASE_URL=https://xxx.supabase.co
 *      SUPABASE_ANON_KEY=eyJ...
 *      GOOGLE_SPREADSHEET_ID=1AbC...(from the sheet URL)
 *      GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account.json
 *
 * 5. Run: bun run scripts/export-to-sheets.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';
import { buildSiteConfigFromMarkdown } from '../siteConfig';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

type CellValue = string | number;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '';
const SERVICE_ACCOUNT_KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || '';
const SITE_CONFIG_MARKDOWN_FILE = path.resolve(process.cwd(), 'content', 'site-config.md');

const OVERVIEW_SHEET_NAME = 'Overview';
const ALL_REGISTRATIONS_SHEET_NAME = 'All Registrations';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

if (!SPREADSHEET_ID) {
  console.error('Missing GOOGLE_SPREADSHEET_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface RGB {
  red: number;
  green: number;
  blue: number;
}

const DEPT_COLOURS: Record<string, RGB> = {
  'First-Year Dept.': { red: 0.94, green: 0.56, blue: 0.22 },
  'First-Year': { red: 0.94, green: 0.56, blue: 0.22 },
  'Computer Dept.': { red: 0.24, green: 0.65, blue: 0.83 },
  'AIDS Dept.': { red: 0.4, green: 0.73, blue: 0.42 },
  'IT Dept.': { red: 0.66, green: 0.33, blue: 0.83 },
  'IT Dept': { red: 0.66, green: 0.33, blue: 0.83 },
  'Civil Dept.': { red: 0.83, green: 0.72, blue: 0.35 },
  'Mech Dept.': { red: 0.83, green: 0.33, blue: 0.33 },
  'ENTC Dept.': { red: 0.33, green: 0.83, blue: 0.73 },
  'MCA/BCA Dept.': { red: 0.83, green: 0.45, blue: 0.63 },
  'MBA Dept. (IGSB+ICEM)': { red: 0.55, green: 0.55, blue: 0.83 },
};

const DEFAULT_COLOUR: RGB = { red: 0.5, green: 0.5, blue: 0.5 };
const ALL_HEADER_COLOUR: RGB = { red: 0.12, green: 0.12, blue: 0.18 };
const SECTION_HEADER_COLOUR: RGB = { red: 0.2, green: 0.24, blue: 0.31 };
const TABLE_HEADER_COLOUR: RGB = { red: 0.89, green: 0.91, blue: 0.94 };

const DATA_HEADER = [
  '#',
  'Reference ID',
  'Team Name',
  'Event',
  'Department',
  'Team Size',
  'Leader Name',
  'Leader Email',
  'Leader Phone',
  'Leader College',
  'Team Members',
  'Coordinator',
  'Event Date',
  'Event Time',
  'Venue',
  'Abstract',
  'Status',
  'Payment',
  'Fee Paid',
  'Screenshot',
  'Submitted At',
] as const;

const DATA_COLUMN_WIDTHS = [
  45, 130, 190, 220, 170, 85, 160, 220, 130, 200, 340, 200, 115, 120, 210, 340, 105, 95, 95, 110, 180,
];

const OVERVIEW_COLUMN_WIDTHS = [
  230, 170, 95, 105, 85, 85, 95, 95, 95, 120, 220, 220, 230,
];

const STATUS_COLUMN_INDEX = DATA_HEADER.indexOf('Status');
const PAYMENT_COLUMN_INDEX = DATA_HEADER.indexOf('Payment');
const FEE_COLUMN_INDEX = DATA_HEADER.indexOf('Fee Paid');
const TEAM_SIZE_COLUMN_INDEX = DATA_HEADER.indexOf('Team Size');
const EVENT_DATE_COLUMN_INDEX = DATA_HEADER.indexOf('Event Date');
const EVENT_TIME_COLUMN_INDEX = DATA_HEADER.indexOf('Event Time');

const STATUS_PRIORITY: Record<string, number> = {
  Pending: 0,
  Confirmed: 1,
  Rejected: 2,
};

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

interface EventExportDetails {
  name: string;
  department: string;
  coordinatorName: string;
  coordinatorPhone: string;
  eventDateLabel: string;
  eventTimeLabel: string;
  venueLabel: string;
}

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

interface EnrichedRegistration {
  reg: RegistrationRow;
  members: MemberRow[];
  eventName: string;
  department: string;
  coordinatorName: string;
  coordinatorPhone: string;
  eventDateLabel: string;
  eventTimeLabel: string;
  venueLabel: string;
  teamSize: number;
  hasKnownEvent: boolean;
  submittedAtLabel: string;
}

interface SummaryCounter {
  teams: number;
  participants: number;
  paid: number;
  unpaid: number;
  confirmed: number;
  pending: number;
  rejected: number;
  revenue: number;
}

interface BaseSheetPlan {
  title: string;
  rows: CellValue[][];
  columnWidths: number[];
}

interface OverviewSheetPlan extends BaseSheetPlan {
  kind: 'overview';
  titleRowIndexes: number[];
  headerRowIndexes: number[];
}

interface RegistrationSheetPlan extends BaseSheetPlan {
  kind: 'registrations';
  headerColour: RGB;
}

type SheetPlan = OverviewSheetPlan | RegistrationSheetPlan;

async function getGoogleSheetsClient() {
  let credentials: any;

  if (SERVICE_ACCOUNT_KEY_FILE && fs.existsSync(SERVICE_ACCOUNT_KEY_FILE)) {
    credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_FILE, 'utf-8'));
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } else {
    console.error('No Google service account key found. Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE or GOOGLE_SERVICE_ACCOUNT_KEY');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

function getDisplayText(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : fallback;
}

function sanitizeCellText(value: unknown, fallback = ''): string {
  const text = getDisplayText(value, fallback);
  return text && /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function escapeFormulaText(value: string): string {
  return value.replace(/"/g, '""');
}

function buildHyperlinkFormula(url: string | null | undefined, label: string): string {
  const trimmedUrl = getDisplayText(url, '');
  if (!trimmedUrl) {
    return 'N/A';
  }

  return `=HYPERLINK("${escapeFormulaText(trimmedUrl)}","${escapeFormulaText(label)}")`;
}

function buildMailtoFormula(email: string): string {
  const trimmedEmail = getDisplayText(email, '');
  if (!trimmedEmail) {
    return 'N/A';
  }

  return `=HYPERLINK("mailto:${escapeFormulaText(trimmedEmail)}","${escapeFormulaText(trimmedEmail)}")`;
}

function formatTimestamp(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

function formatCurrency(amount: number): string {
  return INR_FORMATTER.format(amount || 0);
}

function formatMemberDetails(members: MemberRow[]): string {
  if (members.length === 0) {
    return 'Standalone';
  }

  return members
    .map((member, index) => {
      const name = getDisplayText(member.name, `Member ${index + 1}`);
      const email = getDisplayText(member.email, 'No email');
      const college = getDisplayText(member.college, 'No college');
      return `${index + 1}. ${name} | ${email} | ${college}`;
    })
    .join('\n');
}

function formatCoordinatorLabel(name: string, phone: string): string {
  const safeName = getDisplayText(name, 'TBA');
  const safePhone = getDisplayText(phone, 'No phone');
  return `${safeName} (${safePhone})`;
}

function formatScheduleLabel(dateLabel: string, timeLabel: string): string {
  const parts = [getDisplayText(dateLabel, ''), getDisplayText(timeLabel, '')].filter(Boolean);
  return parts.length > 0 ? parts.join(' | ') : 'TBA';
}

function getStatusPriority(status: string): number {
  return STATUS_PRIORITY[status] ?? 99;
}

function createSummaryCounter(): SummaryCounter {
  return {
    teams: 0,
    participants: 0,
    paid: 0,
    unpaid: 0,
    confirmed: 0,
    pending: 0,
    rejected: 0,
    revenue: 0,
  };
}

function updateSummaryCounter(counter: SummaryCounter, item: EnrichedRegistration) {
  counter.teams += 1;
  counter.participants += item.teamSize;
  counter.revenue += Number(item.reg.fee_paid || 0);

  if (item.reg.has_paid) {
    counter.paid += 1;
  } else {
    counter.unpaid += 1;
  }

  switch (item.reg.status) {
    case 'Confirmed':
      counter.confirmed += 1;
      break;
    case 'Pending':
      counter.pending += 1;
      break;
    case 'Rejected':
      counter.rejected += 1;
      break;
    default:
      break;
  }
}

function loadEventDetails(): Map<string, EventExportDetails> {
  if (!fs.existsSync(SITE_CONFIG_MARKDOWN_FILE)) {
    console.error(`Site config not found at ${SITE_CONFIG_MARKDOWN_FILE}`);
    process.exit(1);
  }

  const siteConfigMarkdown = fs.readFileSync(SITE_CONFIG_MARKDOWN_FILE, 'utf-8');
  const siteConfig = buildSiteConfigFromMarkdown(siteConfigMarkdown);

  return new Map(
    siteConfig.events.map((event) => [
      event.id,
      {
        name: event.name,
        department: event.department,
        coordinatorName: event.coordinatorName,
        coordinatorPhone: event.coordinatorPhone,
        eventDateLabel: event.eventDateLabel,
        eventTimeLabel: event.eventTimeLabel,
        venueLabel: event.venueLabel,
      },
    ]),
  );
}

const EVENT_DETAILS = loadEventDetails();

function enrichRegistrations(
  registrations: RegistrationRow[],
  membersByReg: Map<string, MemberRow[]>,
): EnrichedRegistration[] {
  return registrations
    .map((reg) => {
      const members = membersByReg.get(reg.id) || [];
      const eventDetails = EVENT_DETAILS.get(reg.event_id);

      return {
        reg,
        members,
        eventName: eventDetails?.name || reg.event_id,
        department: eventDetails?.department || 'Other',
        coordinatorName: eventDetails?.coordinatorName || 'TBA',
        coordinatorPhone: eventDetails?.coordinatorPhone || '',
        eventDateLabel: eventDetails?.eventDateLabel || 'TBA',
        eventTimeLabel: eventDetails?.eventTimeLabel || 'TBA',
        venueLabel: eventDetails?.venueLabel || 'TBA',
        teamSize: members.length + 1,
        hasKnownEvent: Boolean(eventDetails),
        submittedAtLabel: formatTimestamp(reg.created_at),
      };
    })
    .sort((a, b) => {
      const statusSort = getStatusPriority(a.reg.status) - getStatusPriority(b.reg.status);
      if (statusSort !== 0) {
        return statusSort;
      }

      const paymentSort = Number(a.reg.has_paid) - Number(b.reg.has_paid);
      if (paymentSort !== 0) {
        return paymentSort;
      }

      return new Date(b.reg.created_at).getTime() - new Date(a.reg.created_at).getTime();
    });
}

function buildRegistrationRows(regList: EnrichedRegistration[]): CellValue[][] {
  return regList.map((item, index) => [
    index + 1,
    sanitizeCellText(item.reg.registration_ref),
    sanitizeCellText(item.reg.team_name),
    sanitizeCellText(item.eventName),
    sanitizeCellText(item.department),
    item.teamSize,
    sanitizeCellText(item.reg.leader_name),
    buildMailtoFormula(item.reg.leader_email),
    sanitizeCellText(item.reg.leader_phone),
    sanitizeCellText(item.reg.leader_college),
    sanitizeCellText(formatMemberDetails(item.members)),
    sanitizeCellText(formatCoordinatorLabel(item.coordinatorName, item.coordinatorPhone)),
    sanitizeCellText(item.eventDateLabel, 'TBA'),
    sanitizeCellText(item.eventTimeLabel, 'TBA'),
    sanitizeCellText(item.venueLabel, 'TBA'),
    sanitizeCellText(item.reg.abstract_text, 'None'),
    sanitizeCellText(item.reg.status),
    item.reg.has_paid ? 'PAID' : 'UNPAID',
    Number(item.reg.fee_paid || 0),
    buildHyperlinkFormula(item.reg.payment_screenshot_url, 'Open'),
    sanitizeCellText(item.submittedAtLabel),
  ]);
}

function buildOverviewSheetPlan(regList: EnrichedRegistration[]): OverviewSheetPlan {
  const rows: CellValue[][] = [];
  const titleRowIndexes: number[] = [];
  const headerRowIndexes: number[] = [];
  const departmentSummary = new Map<string, SummaryCounter>();
  const eventSummary = new Map<
    string,
    SummaryCounter & {
      eventName: string;
      department: string;
      coordinator: string;
      schedule: string;
      venue: string;
    }
  >();
  const unknownEventCounts = new Map<string, number>();
  const totals = createSummaryCounter();

  const pushRow = (...cells: CellValue[]) => {
    rows.push(cells);
    return rows.length - 1;
  };

  regList.forEach((item) => {
    updateSummaryCounter(totals, item);

    const deptCounter = departmentSummary.get(item.department) || createSummaryCounter();
    updateSummaryCounter(deptCounter, item);
    departmentSummary.set(item.department, deptCounter);

    const eventKey = `${item.reg.event_id}::${item.department}`;
    const currentEventSummary =
      eventSummary.get(eventKey) || {
        ...createSummaryCounter(),
        eventName: item.eventName,
        department: item.department,
        coordinator: formatCoordinatorLabel(item.coordinatorName, item.coordinatorPhone),
        schedule: formatScheduleLabel(item.eventDateLabel, item.eventTimeLabel),
        venue: getDisplayText(item.venueLabel, 'TBA'),
      };
    updateSummaryCounter(currentEventSummary, item);
    eventSummary.set(eventKey, currentEventSummary);

    if (!item.hasKnownEvent) {
      unknownEventCounts.set(item.reg.event_id, (unknownEventCounts.get(item.reg.event_id) || 0) + 1);
    }
  });

  titleRowIndexes.push(pushRow('TechnoFest Export Overview'));
  pushRow('Generated At', formatTimestamp(new Date()));
  pushRow();

  headerRowIndexes.push(pushRow('Metric', 'Value'));
  pushRow('Total Registrations', regList.length);
  pushRow('Total Participants', totals.participants);
  pushRow('Paid Teams', totals.paid);
  pushRow('Unpaid Teams', totals.unpaid);
  pushRow('Confirmed', totals.confirmed);
  pushRow('Pending', totals.pending);
  pushRow('Rejected', totals.rejected);
  pushRow('Revenue Collected', formatCurrency(totals.revenue));
  pushRow('Unknown Event IDs', unknownEventCounts.size);
  pushRow();

  titleRowIndexes.push(pushRow('Department Summary'));
  headerRowIndexes.push(pushRow('Department', 'Teams', 'Participants', 'Paid', 'Unpaid', 'Confirmed', 'Pending', 'Rejected', 'Revenue'));

  Array.from(departmentSummary.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([department, counter]) => {
      pushRow(
        sanitizeCellText(department),
        counter.teams,
        counter.participants,
        counter.paid,
        counter.unpaid,
        counter.confirmed,
        counter.pending,
        counter.rejected,
        formatCurrency(counter.revenue),
      );
    });

  pushRow();
  titleRowIndexes.push(pushRow('Event Summary'));
  headerRowIndexes.push(
    pushRow(
      'Event',
      'Department',
      'Teams',
      'Participants',
      'Paid',
      'Unpaid',
      'Confirmed',
      'Pending',
      'Rejected',
      'Revenue',
      'Coordinator',
      'Schedule',
      'Venue',
    ),
  );

  Array.from(eventSummary.values())
    .sort((left, right) => {
      const departmentSort = left.department.localeCompare(right.department);
      return departmentSort !== 0 ? departmentSort : left.eventName.localeCompare(right.eventName);
    })
    .forEach((summary) => {
      pushRow(
        sanitizeCellText(summary.eventName),
        sanitizeCellText(summary.department),
        summary.teams,
        summary.participants,
        summary.paid,
        summary.unpaid,
        summary.confirmed,
        summary.pending,
        summary.rejected,
        formatCurrency(summary.revenue),
        sanitizeCellText(summary.coordinator),
        sanitizeCellText(summary.schedule),
        sanitizeCellText(summary.venue),
      );
    });

  if (unknownEventCounts.size > 0) {
    pushRow();
    titleRowIndexes.push(pushRow('Unknown Event IDs'));
    headerRowIndexes.push(pushRow('Event ID', 'Registrations'));

    Array.from(unknownEventCounts.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .forEach(([eventId, count]) => {
        pushRow(sanitizeCellText(eventId), count);
      });
  }

  return {
    kind: 'overview',
    title: OVERVIEW_SHEET_NAME,
    rows,
    columnWidths: OVERVIEW_COLUMN_WIDTHS,
    titleRowIndexes,
    headerRowIndexes,
  };
}

function buildRegistrationSheetPlan(
  title: string,
  rows: EnrichedRegistration[],
  headerColour: RGB,
): RegistrationSheetPlan {
  return {
    kind: 'registrations',
    title,
    rows: [Array.from(DATA_HEADER), ...buildRegistrationRows(rows)],
    columnWidths: DATA_COLUMN_WIDTHS,
    headerColour,
  };
}

function getColumnWidthRequests(sheetId: number, widths: number[]) {
  return widths.map((width, index) => ({
    updateDimensionProperties: {
      range: {
        sheetId,
        dimension: 'COLUMNS',
        startIndex: index,
        endIndex: index + 1,
      },
      properties: { pixelSize: width },
      fields: 'pixelSize',
    },
  }));
}

function buildOverviewFormatRequests(sheetId: number, plan: OverviewSheetPlan) {
  const requests: any[] = [
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: { frozenRowCount: 2 },
        },
        fields: 'gridProperties.frozenRowCount',
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: plan.rows.length,
          startColumnIndex: 0,
          endColumnIndex: plan.columnWidths.length,
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: 'WRAP',
            verticalAlignment: 'TOP',
          },
        },
        fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)',
      },
    },
    ...getColumnWidthRequests(sheetId, plan.columnWidths),
  ];

  plan.titleRowIndexes.forEach((rowIndex) => {
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: rowIndex,
          endRowIndex: rowIndex + 1,
          startColumnIndex: 0,
          endColumnIndex: plan.columnWidths.length,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: SECTION_HEADER_COLOUR,
            textFormat: {
              bold: true,
              fontSize: 12,
              foregroundColor: { red: 1, green: 1, blue: 1 },
            },
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    });
  });

  plan.headerRowIndexes.forEach((rowIndex) => {
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: rowIndex,
          endRowIndex: rowIndex + 1,
          startColumnIndex: 0,
          endColumnIndex: plan.columnWidths.length,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: TABLE_HEADER_COLOUR,
            textFormat: {
              bold: true,
            },
            horizontalAlignment: 'CENTER',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
      },
    });
  });

  return requests;
}

function buildRegistrationFormatRequests(sheetId: number, plan: RegistrationSheetPlan) {
  const rowCount = plan.rows.length;
  const dataRowCount = Math.max(rowCount - 1, 0);
  const requests: any[] = [
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: DATA_HEADER.length,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: plan.headerColour,
            textFormat: {
              bold: true,
              fontSize: 11,
              foregroundColor: { red: 1, green: 1, blue: 1 },
            },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            wrapStrategy: 'WRAP',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
      },
    },
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: {
            frozenRowCount: 1,
            frozenColumnCount: 2,
          },
        },
        fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount',
      },
    },
    {
      setBasicFilter: {
        filter: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: rowCount,
            startColumnIndex: 0,
            endColumnIndex: DATA_HEADER.length,
          },
        },
      },
    },
    ...getColumnWidthRequests(sheetId, plan.columnWidths),
  ];

  if (dataRowCount > 0) {
    requests.push(
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: rowCount,
            startColumnIndex: 0,
            endColumnIndex: DATA_HEADER.length,
          },
          cell: {
            userEnteredFormat: {
              wrapStrategy: 'WRAP',
              verticalAlignment: 'TOP',
            },
          },
          fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)',
        },
      },
      {
        addBanding: {
          bandedRange: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: rowCount,
              startColumnIndex: 0,
              endColumnIndex: DATA_HEADER.length,
            },
            rowProperties: {
              headerColor: plan.headerColour,
              firstBandColor: { red: 0.97, green: 0.97, blue: 0.97 },
              secondBandColor: { red: 1, green: 1, blue: 1 },
            },
          },
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: rowCount,
            startColumnIndex: TEAM_SIZE_COLUMN_INDEX,
            endColumnIndex: TEAM_SIZE_COLUMN_INDEX + 1,
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
            },
          },
          fields: 'userEnteredFormat.horizontalAlignment',
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: rowCount,
            startColumnIndex: EVENT_DATE_COLUMN_INDEX,
            endColumnIndex: EVENT_TIME_COLUMN_INDEX + 1,
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
            },
          },
          fields: 'userEnteredFormat.horizontalAlignment',
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: rowCount,
            startColumnIndex: STATUS_COLUMN_INDEX,
            endColumnIndex: PAYMENT_COLUMN_INDEX + 1,
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
            },
          },
          fields: 'userEnteredFormat.horizontalAlignment',
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: rowCount,
            startColumnIndex: FEE_COLUMN_INDEX,
            endColumnIndex: FEE_COLUMN_INDEX + 1,
          },
          cell: {
            userEnteredFormat: {
              numberFormat: {
                type: 'CURRENCY',
                pattern: '"Rs"#,##0',
              },
              horizontalAlignment: 'RIGHT',
            },
          },
          fields: 'userEnteredFormat(numberFormat,horizontalAlignment)',
        },
      },
      {
        addConditionalFormatRule: {
          rule: {
            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: STATUS_COLUMN_INDEX, endColumnIndex: STATUS_COLUMN_INDEX + 1 }],
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
      },
      {
        addConditionalFormatRule: {
          rule: {
            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: STATUS_COLUMN_INDEX, endColumnIndex: STATUS_COLUMN_INDEX + 1 }],
            booleanRule: {
              condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Pending' }] },
              format: {
                backgroundColor: { red: 1, green: 0.95, blue: 0.8 },
                textFormat: { foregroundColor: { red: 0.7, green: 0.5, blue: 0 }, bold: true },
              },
            },
          },
          index: 1,
        },
      },
      {
        addConditionalFormatRule: {
          rule: {
            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: STATUS_COLUMN_INDEX, endColumnIndex: STATUS_COLUMN_INDEX + 1 }],
            booleanRule: {
              condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Rejected' }] },
              format: {
                backgroundColor: { red: 1, green: 0.88, blue: 0.88 },
                textFormat: { foregroundColor: { red: 0.65, green: 0.12, blue: 0.12 }, bold: true },
              },
            },
          },
          index: 2,
        },
      },
      {
        addConditionalFormatRule: {
          rule: {
            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: PAYMENT_COLUMN_INDEX, endColumnIndex: PAYMENT_COLUMN_INDEX + 1 }],
            booleanRule: {
              condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'PAID' }] },
              format: {
                backgroundColor: { red: 0.85, green: 0.96, blue: 0.85 },
                textFormat: { bold: true },
              },
            },
          },
          index: 3,
        },
      },
      {
        addConditionalFormatRule: {
          rule: {
            ranges: [{ sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: PAYMENT_COLUMN_INDEX, endColumnIndex: PAYMENT_COLUMN_INDEX + 1 }],
            booleanRule: {
              condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'UNPAID' }] },
              format: {
                backgroundColor: { red: 1, green: 0.93, blue: 0.82 },
                textFormat: { bold: true },
              },
            },
          },
          index: 4,
        },
      },
    );
  }

  return requests;
}

async function main() {
  console.log('Fetching registrations from Supabase...');

  const { data: registrations, error: registrationError } = await supabase
    .from('registrations')
    .select('*');

  if (registrationError) {
    console.error('Failed to fetch registrations:', registrationError.message);
    process.exit(1);
  }

  const { data: members, error: memberError } = await supabase
    .from('team_members')
    .select('*');

  if (memberError) {
    console.error('Failed to fetch team members:', memberError.message);
    process.exit(1);
  }

  const regs = (registrations || []) as RegistrationRow[];
  const mems = (members || []) as MemberRow[];

  console.log(`  -> ${regs.length} registrations, ${mems.length} team members`);

  const membersByReg = new Map<string, MemberRow[]>();
  mems.forEach((member) => {
    const existing = membersByReg.get(member.registration_id) || [];
    existing.push(member);
    membersByReg.set(member.registration_id, existing);
  });

  const enrichedRegistrations = enrichRegistrations(regs, membersByReg);
  const registrationsByDept = new Map<string, EnrichedRegistration[]>();

  enrichedRegistrations.forEach((item) => {
    const current = registrationsByDept.get(item.department) || [];
    current.push(item);
    registrationsByDept.set(item.department, current);
  });

  const sheetPlans: SheetPlan[] = [
    buildOverviewSheetPlan(enrichedRegistrations),
    buildRegistrationSheetPlan(ALL_REGISTRATIONS_SHEET_NAME, enrichedRegistrations, ALL_HEADER_COLOUR),
    ...Array.from(registrationsByDept.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([department, items]) =>
        buildRegistrationSheetPlan(
          department,
          items,
          DEPT_COLOURS[department] || DEFAULT_COLOUR,
        ),
      ),
  ];

  const sheetsClient = await getGoogleSheetsClient();

  console.log('Preparing Google Sheet...');

  const spreadsheet = await sheetsClient.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const existingSheets = spreadsheet.data.sheets || [];
  const managedSheetNames = new Set(sheetPlans.map((plan) => plan.title));
  const deleteRequests: any[] = [];

  existingSheets.forEach((sheet) => {
    const title = sheet.properties?.title || '';
    if (managedSheetNames.has(title)) {
      deleteRequests.push({
        deleteSheet: { sheetId: sheet.properties?.sheetId },
      });
    }
  });

  const addRequests: any[] = sheetPlans.map((plan, index) => ({
    addSheet: {
      properties: {
        title: plan.title,
        index,
      },
    },
  }));

  const willDeleteAll = deleteRequests.length === existingSheets.length;
  const preAddRequests: any[] = [];
  if (willDeleteAll) {
    preAddRequests.push({
      addSheet: {
        properties: { title: '__temp__' },
      },
    });
  }

  const batchRequests = [...preAddRequests, ...deleteRequests, ...addRequests];
  if (batchRequests.length > 0) {
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: batchRequests },
    });
  }

  if (willDeleteAll) {
    const refreshedSpreadsheet = await sheetsClient.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const tempSheet = refreshedSpreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === '__temp__');
    if (tempSheet) {
      await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{ deleteSheet: { sheetId: tempSheet.properties?.sheetId } }],
        },
      });
    }
  }

  const finalSpreadsheet = await sheetsClient.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetIdByName = new Map<string, number>();

  (finalSpreadsheet.data.sheets || []).forEach((sheet) => {
    sheetIdByName.set(sheet.properties?.title || '', sheet.properties?.sheetId || 0);
  });

  for (const plan of sheetPlans) {
    const sheetId = sheetIdByName.get(plan.title);
    if (sheetId === undefined) {
      continue;
    }

    const dataRowCount = plan.kind === 'registrations' ? Math.max(plan.rows.length - 1, 0) : plan.rows.length;
    console.log(`  -> Writing "${plan.title}" (${dataRowCount} rows)`);

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${plan.title}'!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: plan.rows },
    });

    const formatRequests =
      plan.kind === 'overview'
        ? buildOverviewFormatRequests(sheetId, plan)
        : buildRegistrationFormatRequests(sheetId, plan);

    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: formatRequests },
    });
  }

  console.log('\nExport complete. Open your Google Sheet:');
  console.log(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}\n`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
