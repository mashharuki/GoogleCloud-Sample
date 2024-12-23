import { Hono } from 'hono'
import { countTokens, functionCallingChat, functionCallingGenerateContentStream, generateContent, multiPartContent, multiPartContentImageString, multiPartContentVideo, sendChat, streamChat, streamGenerateContent } from './lib/vertex'

const app = new Hono()

// デフォルトのメソッド
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// ヘルスチェックメソッド
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

//streamGenerateContentメソッド
app.post('/streamGenerateContent', async(c) => {
  // メソッドを呼び出し
  const result = await streamGenerateContent();
  return c.json({
    result: result
  });
})

// generateContentメソッド
app.post('/generateContent', async(c)=> {
  const result = await generateContent();
  return c.json({
    result: result
  });
})

// streamChatメソッド
app.post('/streamChat', async(c)=> {
  const result = await streamChat();
  return c.json({
    result: result
  });
})

// sendChatメソッド
app.post('/sendChat', async(c)=> {
  const result = await sendChat();
  return c.json({
    result: result
  });
})

// multiPartContentメソッド
app.post('/multiPartContent', async(c)=> {
  const result = await multiPartContent();
  return c.json({
    result: result
  });
})

// multiPartContentImageStringメソッド
app.post('/multiPartContentImageString', async(c)=> {
  const result = await multiPartContentImageString();
  return c.json({
    result: result
  });
})

// multiPartContentVideoメソッド
app.post('/multiPartContentVideo', async(c)=> {
  const result = await multiPartContentVideo();
  return c.json({
    result: result
  });
})

// functionCallingChatメソッド
app.post('/functionCallingChat', async(c)=> {
  const result = await functionCallingChat();
  return c.json({
    result: result
  });
})

// functionCallingGenerateContentStreamメソッド
app.post('/functionCallingGenerateContentStream', async(c)=> {
  const result = await functionCallingGenerateContentStream();
  return c.json({
    result: result
  });
})

// countTokensメソッド
app.post('/countTokens', async(c)=> {
  const result = await countTokens();
  return c.json({
    result: result
  });
})

export default app
