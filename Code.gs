/**
 * Thriver Hub demo feedback — Google Apps Script backend
 *
 * SETUP (once, ~3 minutes):
 * 1. Create a new Google Sheet. Name the first tab "feedback".
 * 2. Extensions → Apps Script. Delete the sample code, paste this file, save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, authorise, and copy the Web app URL (ends in /exec).
 * 4. Paste that URL into SHEET_API_URL at the top of index.html.
 *
 * To update the script later: Deploy → Manage deployments → edit → New version → Deploy.
 */

const SHEET_NAME = 'feedback';
const HEADERS = ['id','created_at','screen','label','role','kind','text','name','device','key'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// GET  → all notes, newest first
function doGet(e) {
  const sh = sheet_();
  const rows = sh.getDataRange().getValues();
  const head = rows.shift();
  const notes = rows.filter(r => r[0]).map(r => {
    const o = {}; head.forEach((h, i) => o[h] = r[i]); return o;
  }).reverse();
  return out_({ ok: true, notes });
}

// POST {action:'add', ...note}  → append a row
// POST {action:'delete', id, device} → remove the row if the device matches
function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch (err) { return out_({ ok: false, error: 'bad json' }); }
  const sh = sheet_();
  if (body.action === 'delete') {
    const rows = sh.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if (rows[i][0] === body.id && rows[i][8] === body.device) { sh.deleteRow(i + 1); return out_({ ok: true }); }
    }
    return out_({ ok: false, error: 'not yours' });
  }
  const text = String(body.text || '').slice(0, 2000).trim();
  if (!text) return out_({ ok: false, error: 'empty' });
  const id = Utilities.getUuid();
  sh.appendRow([id, new Date().toISOString(), String(body.screen||''), String(body.label||'').slice(0,120), String(body.role||''), ['love','change','q'].includes(body.kind)?body.kind:'change', text, String(body.name||'Anonymous').slice(0,60), String(body.device||''), String(body.key||'')]);
  return out_({ ok: true, id });
}
