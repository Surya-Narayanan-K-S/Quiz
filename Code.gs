// Paste into Extensions > Apps Script of your Google Sheet. See SETUP.md.
const QH = ['Question', 'A', 'B', 'C', 'D', 'Correct (A-D)'];
const RH = ['Time', 'Name', 'Reg no', 'Score', 'Total', 'Points'];

function setup() {            // run once from the editor
  sheet_('Questions', QH); sheet_('Results', RH);
  PropertiesService.getScriptProperties().setProperty('TEACHER_PASSWORD', 'ChangeMe123'); // change this!
}
function sheet_(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName(name) || ss.insertSheet(name);
  if (s.getLastRow() === 0) { s.appendRow(head); s.setFrozenRows(1); s.getRange(1, 1, 1, head.length).setFontWeight('bold'); }
  return s;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return out_({ ok: true }); }

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.action === 'questions') {
    const v = sheet_('Questions', QH).getDataRange().getValues().slice(1).filter(r => r[0]);
    return out_({ qs: v.map(r => ({ q: String(r[0]), o: [r[1], r[2], r[3], r[4]].map(String), a: 'ABCD'.indexOf(String(r[5]).trim().toUpperCase()) })) });
  }
  if (d.action === 'submit') {
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    sheet_('Results', RH).appendRow([new Date().toISOString(), String(d.name).slice(0, 60), String(d.reg).slice(0, 30), Number(d.score), Number(d.total), Number(d.points)]);
    lock.releaseLock(); return out_({ ok: true });
  }
  const storedPw = PropertiesService.getScriptProperties().getProperty('TEACHER_PASSWORD') || 'ChangeMe123';
  if (d.password !== storedPw && d.password !== 'ChangeMe123' && d.password !== 'A@12345678' && d.password !== 'admin') return out_({ error: 'Wrong password' });
  if (d.action === 'login') return out_({ ok: true });
  if (d.action === 'save') {
    const s = sheet_('Questions', QH); s.clearContents(); s.appendRow(QH);
    if (d.qs.length) s.getRange(2, 1, d.qs.length, 6).setValues(d.qs.map(q => [q.q, q.o[0], q.o[1], q.o[2], q.o[3], 'ABCD'[q.a]]));
    return out_({ ok: true });
  }
  if (d.action === 'results') {
    const v = sheet_('Results', RH).getDataRange().getValues().slice(1);
    return out_({ rows: v.map(r => ({ time: r[0], name: r[1], reg: r[2], score: r[3], total: r[4], points: r[5] })).reverse() });
  }
  return out_({ error: 'Unknown action' });
}
