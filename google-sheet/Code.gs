// Coach view backend. Paste into Extensions > Apps Script of the coach's Google Sheet,
// set Script Property SECRET (same as GOOGLE_SHEET_SECRET), then Deploy > Web app
// (Execute as: Me, Access: Anyone). Put the /exec URL in GOOGLE_SHEET_WEBHOOK_URL.
var HEADERS = ["Date", "Athlete", "Status", "Light", "Readiness score", "Reasons", "Athlete note",
  "Effort", "Feel after", "Recovery done", "Recovery note", "Win", "Lesson", "Next action", "UPP stage",
  "Coach decision", "Coach notes", "Updated"];

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (secret && body.secret !== secret) return out({ ok: false });
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    var tz = Session.getScriptTimeZone();
    var date = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
    var row = findRow(sheet, date, body.athleteId);
    var d = body.data || {};
    var set = function (col, value) { sheet.getRange(row, HEADERS.indexOf(col) + 1).setValue(value); };
    if (body.event === "readiness") {
      set("Status", d.status); set("Light", d.light); set("Readiness score", d.score);
      set("Reasons", (d.reasons || []).join("; ")); set("Athlete note", d.note || "");
    } else if (body.event === "recovery") {
      set("Effort", d.effort); set("Feel after", d.postSessionFeeling);
      set("Recovery done", (d.completed || []).join(", ")); set("Recovery note", d.note || "");
    } else if (body.event === "reflection") {
      set("Win", d.win); set("Lesson", d.lesson); set("Next action", d.nextAction); set("UPP stage", d.uppStage);
    }
    set("Updated", new Date());
    colorLight(sheet, row);
  } finally {
    lock.releaseLock();
  }
  return out({ ok: true });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Coach View") || ss.insertSheet("Coach View");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#6b1f2a").setFontColor("#ffffff");
    sheet.getRange(2, 16, 500, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(["Full", "Modified", "Hold", "Refer"], true).build());
  }
  return sheet;
}

function findRow(sheet, date, athleteId) {
  var last = sheet.getLastRow();
  if (last > 1) {
    var values = sheet.getRange(2, 1, last - 1, 2).getDisplayValues();
    for (var i = 0; i < values.length; i++) {
      if (values[i][0] === date && values[i][1] === athleteId) return i + 2;
    }
  }
  sheet.appendRow([date, athleteId]);
  return sheet.getLastRow();
}

function colorLight(sheet, row) {
  var light = sheet.getRange(row, HEADERS.indexOf("Light") + 1).getValue();
  var colors = { green: "#d1fae5", yellow: "#fef3c7", red: "#fee2e2" };
  sheet.getRange(row, 3, 1, 2).setBackground(colors[light] || null);
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
