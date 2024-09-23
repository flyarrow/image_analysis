export const CONFIG = {
  API_KEY: '560ef510af6920a52ae620f5c32210c1.zfZKzmQen3oSuTCg',
  API_URL: 'https://open.bigmodel.cn'
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "getConfig") {
      sendResponse(CONFIG);
    }
  }
);