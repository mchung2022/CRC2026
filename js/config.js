/* js/config.js - Configuration and Google Apps Script Connection Manager */

const ConfigManager = {
  // Key for local storage
  LS_KEY_API_URL: 'crc_project_gas_api_url',

  // Default API URL (can be overridden by user in UI)
  defaultApiUrl: 'https://script.google.com/macros/s/AKfycbyUkeklacJjgwRjw38kkEKRCzxDArbFvixQAv2IWLglTxL6Bhr7o7ZV0ujmcTrt6Rsj/exec',

  /**
   * Get the active Google Apps Script API URL
   * Priority: LocalStorage > Default constant
   */
  getApiUrl() {
    return localStorage.getItem(this.LS_KEY_API_URL) || this.defaultApiUrl || '';
  },

  /**
   * Set and save the Google Apps Script API URL
   * @param {string} url 
   */
  setApiUrl(url) {
    if (url) {
      url = url.trim();
    }
    localStorage.setItem(this.LS_KEY_API_URL, url);
    return true;
  },

  /**
   * Clear the saved API URL
   */
  clearApiUrl() {
    localStorage.removeItem(this.LS_KEY_API_URL);
  },

  /**
   * Send data to Google Sheet via GAS Web App
   * @param {string} sheetName - Target sheet tab name ('game_scores' or 'slides_feedback')
   * @param {object} payload - Key-value pair data to send
   * @returns {Promise<object>} response status
   */
  async sendData(sheetName, payload) {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      console.warn("GAS API URL is not set. Data will not be sent to Google Sheets. Current payload:", payload);
      return { success: false, reason: 'api_url_not_configured', data: payload };
    }

    try {
      const postData = {
        action: 'addData',
        sheetName: sheetName,
        data: payload
      };

      // Since GAS Web App requires POST (or GET with parameters), we use POST with JSON body.
      // Note: GAS CORS might require 'no-cors' or handle redirects.
      // We will perform a standard fetch. To support redirecting on GAS, we should ensure the GAS returns JSON.
      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain' // Using text/plain avoids pre-flight OPTIONS request which GAS sometimes struggles with
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Failed to upload data to Google Sheets:", error);
      return { success: false, reason: 'network_error', error: error.message };
    }
  }
};
window.ConfigManager = ConfigManager;
