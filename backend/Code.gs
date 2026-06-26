/**
 * backend/Code.gs
 * 
 * Google Apps Script (GAS) Backend Connector for CRC Student Affairs Project.
 * Deploy this script as a "Web App" with the following settings:
 * - Execute as: Me (your Google account)
 * - Who has access: Anyone (required for public static sites to send API calls)
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "CRC 後端服務已啟動！請使用 POST 請求傳送數據。"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var requestData = JSON.parse(rawData);
    var action = requestData.action;
    var sheetName = requestData.sheetName;
    var payload = requestData.data;

    if (action === "addData") {
      var result = addDataToSheet(sheetName, payload);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "不支援的 Action 指令"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle preflight OPTIONS requests for CORS (if browsers make them)
function doOptions(e) {
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Appends a row of data to the specified sheet.
 * Auto-creates the sheet tab and headers if they do not exist or are empty.
 */
function addDataToSheet(sheetName, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  // Define default headers based on the sheet name
  var defaultHeaders = [];
  if (sheetName === "game_scores") {
    defaultHeaders = [
      "Timestamp", "PlayerName", "Department", "StudentID", "CRC_Score", "Order_Score", 
      "Professional_Score", "Persona", "ChoicePath", 
      "ShortAnswer1", "ShortAnswer2", "CovenantStatement"
    ];
  } else if (sheetName === "slides_feedback") {
    defaultHeaders = ["Timestamp", "PlayerName", "Department", "StudentID", "SlideNumber", "SlideTitle", "ResponseText"];
  } else {
    defaultHeaders = ["Timestamp", "DataDump"];
  }

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(defaultHeaders);
    sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#e0f2fe");
  } 
  // CRITICAL BUG FIX: If sheet exists but is empty, getLastColumn() returns 0.
  // We must initialize the headers to prevent Range Error.
  else if (sheet.getLastColumn() === 0) {
    sheet.appendRow(defaultHeaders);
    sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#e0f2fe");
  }

  // Double-check headers mapping
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Migrate headers for game_scores if needed
  if (sheetName === "game_scores") {
    if (headers.indexOf("Department") === -1) {
      sheet.insertColumnBefore(3); // Insert Department column after PlayerName (column 2)
      sheet.getRange(1, 3).setValue("Department").setFontWeight("bold").setBackground("#e0f2fe");
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
    if (headers.indexOf("ShortAnswer1") === -1) {
      var missingHeaders = ["ShortAnswer1", "ShortAnswer2", "CovenantStatement"];
      var currentLastCol = sheet.getLastColumn();
      sheet.getRange(1, currentLastCol + 1, 1, missingHeaders.length).setValues([missingHeaders]);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
  }

  // Migrate headers for slides_feedback if needed
  if (sheetName === "slides_feedback") {
    if (headers.indexOf("StudentID") === -1) {
      sheet.insertColumnBefore(4); // Insert StudentID column after Department (column 3)
      sheet.getRange(1, 4).setValue("StudentID").setFontWeight("bold").setBackground("#e0f2fe");
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
    if (headers.indexOf("PlayerName") === -1) {
      var missingFeedbackHeaders = ["PlayerName", "Department"];
      var currentLastCol = sheet.getLastColumn();
      sheet.getRange(1, currentLastCol + 1, 1, missingFeedbackHeaders.length).setValues([missingFeedbackHeaders]);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
  }

  var rowValues = [];
  
  // Set Timestamp first
  rowValues.push(new Date());

  // Fill in the rest of the columns based on headers
  for (var i = 1; i < headers.length; i++) {
    var key = headers[i];
    var val = data[key] !== undefined ? data[key] : "";
    
    // If val is an object/array, stringify it
    if (typeof val === "object") {
      val = JSON.stringify(val);
    }
    rowValues.push(val);
  }

  // Append row
  sheet.appendRow(rowValues);
  
  return {
    success: true,
    message: "Data successfully written to sheet: " + sheetName,
    insertedData: data
  };
}
