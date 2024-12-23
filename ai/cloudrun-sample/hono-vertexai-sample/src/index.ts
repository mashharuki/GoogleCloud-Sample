import { Hono } from 'hono'
import { streamGenerateContent } from './lib/vertex'

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

export default app
