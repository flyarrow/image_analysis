import { API_KEY } from './api_key.js';

export const CONFIG = {
  API_KEY: API_KEY,
  API_URL: 'https://open.bigmodel.cn'
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "getConfig") {
      sendResponse(CONFIG);
    }
  }
);
