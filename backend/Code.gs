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
    message: "CRC Student Affairs GAS Backend is online! Send POST requests to write data."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Add CORS headers support
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

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
        error: "Invalid action. Supported actions: 'addData'"
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
  var output = ContentService.createTextOutput("");
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}

/**
 * Appends a row of data to the specified sheet.
 * Auto-creates the sheet tab and headers if they do not exist.
 */
function addDataToSheet(sheetName, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  // Define default headers based on the sheet name
  var defaultHeaders = [];
  if (sheetName === "game_scores") {
    defaultHeaders = ["Timestamp", "PlayerName", "StudentID", "CRC_Score", "Order_Score", "Professional_Score", "Persona", "ChoicePath"];
  } else if (sheetName === "slides_feedback") {
    defaultHeaders = ["Timestamp", "SlideNumber", "SlideTitle", "ResponseText"];
  } else {
    defaultHeaders = ["Timestamp", "DataDump"];
  }

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(defaultHeaders);
    // Format header row
    sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#e0f2fe");
  }

  // Double-check headers are matching and build values array
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
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
