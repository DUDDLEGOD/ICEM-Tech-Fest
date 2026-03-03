/**
 * ICEM Tech Fest 2026 registration endpoint.
 * Deploy this as a Web App:
 * - Execute as: Me
 * - Who has access: Anyone
 */

const SHEET_NAMES = {
  registrations: 'registrations',
  members: 'members',
  emailLog: 'email_log'
};

const STATUS = {
  confirmed: 'confirmed',
  duplicate: 'duplicate',
  failed: 'failed'
};

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const validationError = validatePayload_(payload);
    if (validationError) {
      return jsonResponse_({
        status: STATUS.failed,
        message: validationError
      });
    }

    const normalizedLeaderEmail = String(payload.leaderEmail).trim().toLowerCase();
    const normalizedEventId = String(payload.eventId).trim().toUpperCase();

    const registrationsSheet = getOrCreateSheet_(SHEET_NAMES.registrations, registrationHeaders_());
    const membersSheet = getOrCreateSheet_(SHEET_NAMES.members, memberHeaders_());
    const emailLogSheet = getOrCreateSheet_(SHEET_NAMES.emailLog, emailLogHeaders_());

    const duplicate = findDuplicateRegistration_(registrationsSheet, normalizedEventId, normalizedLeaderEmail);
    if (duplicate) {
      return jsonResponse_({
        status: STATUS.duplicate,
        registrationId: duplicate.registrationId,
        message: 'A registration already exists for this event with the same leader email.'
      });
    }

    const serverRegistrationId = createServerRegistrationId_(normalizedEventId);
    const submittedAtIso = payload.submittedAtIso || new Date().toISOString();

    registrationsSheet.appendRow([
      serverRegistrationId,
      normalizedEventId,
      payload.eventName || '',
      payload.teamName,
      payload.leaderName,
      normalizedLeaderEmail,
      payload.leaderPhone,
      payload.college || '',
      Number(payload.feePaid || 0),
      Number(payload.members ? payload.members.length + 1 : 1),
      payload.eventDateLabel || '',
      payload.eventTimeLabel || '',
      payload.venueLabel || '',
      payload.abstractText || '',
      submittedAtIso
    ]);

    if (Array.isArray(payload.members)) {
      payload.members.forEach(function(member, index) {
        membersSheet.appendRow([
          serverRegistrationId,
          index + 2,
          member.name || '',
          String(member.email || '').trim().toLowerCase(),
          submittedAtIso
        ]);
      });
    }

    const emailResult = sendConfirmationEmail_(payload, serverRegistrationId);
    emailLogSheet.appendRow([
      serverRegistrationId,
      submittedAtIso,
      normalizedLeaderEmail,
      emailResult.status,
      emailResult.message
    ]);

    return jsonResponse_({
      status: STATUS.confirmed,
      registrationId: serverRegistrationId,
      message: 'Registration confirmed. Confirmation email sent successfully.'
    });
  } catch (error) {
    return jsonResponse_({
      status: STATUS.failed,
      message: 'Server error: ' + String(error && error.message ? error.message : error)
    });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing request body.');
  }
  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  if (!payload) return 'Request payload is missing.';

  const requiredFields = [
    'eventId',
    'teamName',
    'leaderName',
    'leaderEmail',
    'leaderPhone'
  ];

  for (var i = 0; i < requiredFields.length; i += 1) {
    var field = requiredFields[i];
    if (!payload[field] || String(payload[field]).trim() === '') {
      return 'Missing required field: ' + field;
    }
  }

  if (!isValidEmail_(payload.leaderEmail)) {
    return 'Invalid leader email address.';
  }

  if (Array.isArray(payload.members)) {
    for (var j = 0; j < payload.members.length; j += 1) {
      var member = payload.members[j];
      if (!member.name || !member.email || !isValidEmail_(member.email)) {
        return 'Member data is invalid at position ' + (j + 2);
      }
    }
  }

  return '';
}

function findDuplicateRegistration_(sheet, eventId, leaderEmail) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return null;

  for (var i = 1; i < values.length; i += 1) {
    const row = values[i];
    const rowRegistrationId = row[0];
    const rowEventId = String(row[1] || '').trim().toUpperCase();
    const rowLeaderEmail = String(row[5] || '').trim().toLowerCase();

    if (rowEventId === eventId && rowLeaderEmail === leaderEmail) {
      return { registrationId: rowRegistrationId };
    }
  }

  return null;
}

function sendConfirmationEmail_(payload, registrationId) {
  try {
    const to = String(payload.leaderEmail).trim();
    const subject = 'TechnoFest 2026 Registration Confirmed | ' + (payload.eventName || payload.eventId) + ' | ' + registrationId;
    const htmlBody = buildEmailHtml_(payload, registrationId);

    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: htmlBody
    });

    return { status: 'sent', message: 'Confirmation email sent.' };
  } catch (error) {
    return {
      status: 'failed',
      message: 'Email send failed: ' + String(error && error.message ? error.message : error)
    };
  }
}

function buildEmailHtml_(payload, registrationId) {
  const members = Array.isArray(payload.members) ? payload.members : [];
  const membersRows = members.map(function(member, index) {
    return (
      '<tr>' +
      '<td style="padding:8px;border:1px solid #e5e7eb;">' + (index + 2) + '</td>' +
      '<td style="padding:8px;border:1px solid #e5e7eb;">' + sanitizeHtml_(member.name || '') + '</td>' +
      '<td style="padding:8px;border:1px solid #e5e7eb;">' + sanitizeHtml_(member.email || '') + '</td>' +
      '</tr>'
    );
  }).join('');

  return (
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.5;">' +
    '<h2 style="margin:0 0 12px;">ICEM TechnoFest 2026 - Registration Confirmation</h2>' +
    '<p>Dear ' + sanitizeHtml_(payload.leaderName || 'Participant') + ',</p>' +
    '<p>Thank you for registering for <strong>' + sanitizeHtml_(payload.eventName || payload.eventId) + '</strong>. Your registration has been successfully confirmed.</p>' +
    '<h3 style="margin:20px 0 10px;">Registration Details</h3>' +
    '<table style="border-collapse:collapse;width:100%;max-width:700px;font-size:14px;">' +
    tableRow_('Registration ID', registrationId) +
    tableRow_('Event', sanitizeHtml_(payload.eventName || payload.eventId)) +
    tableRow_('Team Name', sanitizeHtml_(payload.teamName || '')) +
    tableRow_('Leader Name', sanitizeHtml_(payload.leaderName || '')) +
    tableRow_('Leader Email', sanitizeHtml_(payload.leaderEmail || '')) +
    tableRow_('Leader Phone', sanitizeHtml_(payload.leaderPhone || '')) +
    tableRow_('Event Date', sanitizeHtml_(payload.eventDateLabel || 'TBA')) +
    tableRow_('Event Time', sanitizeHtml_(payload.eventTimeLabel || 'TBA')) +
    tableRow_('Venue', sanitizeHtml_(payload.venueLabel || 'TBA')) +
    '</table>' +
    '<h3 style="margin:20px 0 10px;">Team Members</h3>' +
    '<table style="border-collapse:collapse;width:100%;max-width:700px;font-size:14px;">' +
    '<tr><th style="text-align:left;padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">#</th><th style="text-align:left;padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Name</th><th style="text-align:left;padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Email</th></tr>' +
    '<tr><td style="padding:8px;border:1px solid #e5e7eb;">1</td><td style="padding:8px;border:1px solid #e5e7eb;">' + sanitizeHtml_(payload.leaderName || '') + ' (Leader)</td><td style="padding:8px;border:1px solid #e5e7eb;">' + sanitizeHtml_(payload.leaderEmail || '') + '</td></tr>' +
    membersRows +
    '</table>' +
    '<p style="margin-top:20px;">If you need assistance, please contact the event help desk at <a href="mailto:icem@indiraicem.ac.in">icem@indiraicem.ac.in</a>.</p>' +
    '<p>Regards,<br/>ICEM TechnoFest 2026 Organizing Committee</p>' +
    '</div>'
  );
}

function tableRow_(label, value) {
  return (
    '<tr>' +
    '<td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;width:200px;"><strong>' + label + '</strong></td>' +
    '<td style="padding:8px;border:1px solid #e5e7eb;">' + value + '</td>' +
    '</tr>'
  );
}

function sanitizeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail_(value) {
  const email = String(value || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createServerRegistrationId_(eventId) {
  const timestampPart = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  return eventId + '-' + timestampPart;
}

function getOrCreateSheet_(sheetName, headers) {
  const spreadsheet = resolveSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function resolveSpreadsheet_() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) {
    return activeSpreadsheet;
  }

  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error(
      'No active spreadsheet found. Set Script Property SPREADSHEET_ID to your target Google Sheet ID.'
    );
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function registrationHeaders_() {
  return [
    'registrationId',
    'eventId',
    'eventName',
    'teamName',
    'leaderName',
    'leaderEmail',
    'leaderPhone',
    'college',
    'feePaid',
    'teamSize',
    'eventDate',
    'eventTime',
    'venue',
    'abstractText',
    'submittedAtIso'
  ];
}

function memberHeaders_() {
  return [
    'registrationId',
    'memberIndex',
    'memberName',
    'memberEmail',
    'submittedAtIso'
  ];
}

function emailLogHeaders_() {
  return [
    'registrationId',
    'attemptedAtIso',
    'recipientEmail',
    'status',
    'message'
  ];
}
