import { CONFIG } from './config.js';

async function testAPI() {
  console.log('开始API测试');

  // 测试图片分析API (BigModel-4v)
  await testImageAnalysis();

  // 测试图片生成API (CogView)
  await testImageGeneration();

  console.log('API测试完成');
}

async function testImageAnalysis() {
  console.log('测试图片分析API (BigModel-4v)');
  const apiUrl = `${CONFIG.API_URL}/api/paas/v4/chat/completions`;
  const imageUrl = 'https://example.com/test-image.jpg'; // 替换为实际的测试图片URL

  const requestBody = {
    model: "glm-4v",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",  // 修改这里
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

  try {
    console.log('发送请求到:', apiUrl);
    console.log('请求头:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.API_KEY}`
    });
    console.log('请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('响应体:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('图片分析API测试成功');
  } catch (error) {
    console.error('图片分析API测试失败:', error);
  }
}

async function testImageGeneration() {
  console.log('测试图片生成API (CogView)');
  const apiUrl = `${CONFIG.API_URL}/api/paas/v4/images/generations`;
  const prompt = "一只可爱的小猫坐在阳光下的窗台上";

  const requestBody = {
    model: "cogview-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024"
  };

  try {
    console.log('发送请求到:', apiUrl);
    console.log('请求头:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.API_KEY}`
    });
    console.log('请求体:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('响应体:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('图片生成API测试成功');
  } catch (error) {
    console.error('图片生成API测试失败:', error);
  }
}

// 导出 testAPI 函数
export { testAPI };