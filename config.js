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

// 添加错误处理
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "downloadImage") {
      fetch(`${CONFIG.API_URL}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONFIG.API_KEY}`
        }
      })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'image.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error downloading image:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true; // 表示异步响应
    }
  }
);
