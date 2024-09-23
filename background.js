const CONFIG = {
  API_KEY: '560ef510af6920a52ae620f5c32210c1.zfZKzmQen3oSuTCg',
  API_URL: 'https://open.bigmodel.cn'
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extractImage",
    title: "提取图片",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "extractImage") {
    chrome.storage.local.set({ extractedImageUrl: info.srcUrl }, () => {
      console.log('Image URL saved:', info.srcUrl);
      chrome.runtime.sendMessage({ action: 'imageExtracted', imageUrl: info.srcUrl });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeImage") {
    analyzeImage(request.imageUrl)
      .then(analysis => {
        console.log('Analysis result:', analysis);
        sendResponse({ success: true, analysis: analysis });
      })
      .catch(error => {
        console.error('Error in analyzeImage:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (request.action === "generateImage") {
    generateImage(request.prompt)
      .then(imageUrl => {
        console.log('Generated image URL:', imageUrl);
        sendResponse({ success: true, imageUrl: imageUrl });
      })
      .catch(error => {
        console.error('Error in generateImage:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

async function analyzeImage(imageUrl) {
  const apiUrl = `${CONFIG.API_URL}/api/paas/v4/chat/completions`;
  
  const requestBody = {
    model: "glm-4v",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          },
          {
            type: "text",
            text: "请分析这张图片，并提供以下信息：1. 图片风格 2. 具体内容 3. 拍摄距离 4. 摄影镜头"
          }
        ]
      }
    ]
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateImage(prompt) {
  const apiUrl = `${CONFIG.API_URL}/api/paas/v4/images/generations`;
  
  const requestBody = {
    model: "cogview-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024"
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].url;
}