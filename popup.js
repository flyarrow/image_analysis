document.addEventListener('DOMContentLoaded', () => {
  const extractedImage = document.getElementById('extractedImage');
  const imageUrlDisplay = document.getElementById('imageUrlDisplay');
  const promptList = document.getElementById('promptList');
  const analyzeButton = document.getElementById('analyzeButton');
  const generateButton = document.getElementById('generateButton');
  const downloadOriginal = document.getElementById('downloadOriginal');
  const downloadGenerated = document.getElementById('downloadGenerated');
  const generatedImage = document.getElementById('generatedImage');

  let currentImageUrl = '';
  let generatedImageUrl = '';

  chrome.storage.local.get(['extractedImageUrl'], (result) => {
    if (result.extractedImageUrl) {
      currentImageUrl = result.extractedImageUrl;
      extractedImage.src = currentImageUrl;
      imageUrlDisplay.textContent = `图片URL: ${currentImageUrl}`;
    }
  });

  analyzeButton.addEventListener('click', () => {
    if (currentImageUrl) {
      chrome.runtime.sendMessage({ action: 'analyzeImage', imageUrl: currentImageUrl }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          alert('图片分析失败：' + chrome.runtime.lastError.message);
        } else if (response.success) {
          displayPrompts(response.analysis);
        } else {
          console.error(response.error);
          alert('图片分析失败：' + response.error);
        }
      });
    } else {
      alert('请先提取图片');
    }
  });

  generateButton.addEventListener('click', () => {
    const prompts = Array.from(promptList.children).map(li => li.textContent);
    const prompt = prompts.join(', ');
    chrome.runtime.sendMessage({ action: 'generateImage', prompt: prompt }, (response) => {
      if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          alert('图片生成失败：' + chrome.runtime.lastError.message);
        } else if (response.success) {
        generatedImageUrl = response.imageUrl;
        generatedImage.src = generatedImageUrl;
      } else {
        console.error(response.error);
        alert('图片生成失败：' + response.error);
      }
    });
  });

  downloadOriginal.addEventListener('click', () => {
    if (currentImageUrl) {
      chrome.downloads.download({ url: currentImageUrl }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('下载失败：', chrome.runtime.lastError);
          alert('下载失败：' + chrome.runtime.lastError.message);
        } else {
          console.log('下载成功，ID：', downloadId);
        }
      });
    } else {
      alert('没有可下载的原图');
    }
  });

  downloadGenerated.addEventListener('click', () => {
    if (generatedImageUrl) {
      chrome.downloads.download({ url: generatedImageUrl }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('下载失败：', chrome.runtime.lastError);
          alert('下载失败：' + chrome.runtime.lastError.message);
        } else {
          console.log('下载成功，ID：', downloadId);
        }
      });
    } else {
      alert('没有可下载的生成图');
    }
  });

  function displayPrompts(analysis) {
    promptList.innerHTML = '';
    const analysisPoints = analysis.split('\n').filter(point => point.trim() !== '');
    analysisPoints.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      promptList.appendChild(li);
    });
  }

  // 监听来自background.js的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'imageExtracted') {
      currentImageUrl = request.imageUrl;
      extractedImage.src = currentImageUrl;
      imageUrlDisplay.textContent = `图片URL: ${currentImageUrl}`;
    }
  });
});