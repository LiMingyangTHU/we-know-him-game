const assert = require('node:assert/strict')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

const root = path.resolve(__dirname, '..')
const playwrightPath = process.env.PLAYWRIGHT_PATH || 'C:/Users/35504/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
const { chromium } = require(playwrightPath)
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json' }
const server = http.createServer((request, response) => {
  const decoded = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  const file = path.resolve(root, `.${decoded.endsWith('/') ? `${decoded}index.html` : decoded}`)
  if (!file.startsWith(root + path.sep)) return response.writeHead(403).end()
  fs.readFile(file, (error, data) => {
    if (error) return response.writeHead(404).end()
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(data)
  })
})

async function main() {
  const [{ default: story }, engine] = await Promise.all([
    import(pathToFileURL(path.join(root, 'src/data/story.js'))),
    import(pathToFileURL(path.join(root, 'src/core/engine.js')))
  ])
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const url = `http://127.0.0.1:${server.address().port}/trial-casefile/`
  async function openNode(id, updates = {}) {
    const state = { ...engine.createState(story.startId, story), currentId: id, visited: [story.startId, id], progress: story.nodes[id].progress || 0, ...updates }
    await page.goto(url)
    await page.evaluate(saved => localStorage.setItem('weKnowHim.casefileTrial.save.v1', JSON.stringify(saved)), state)
    await page.reload()
    await page.locator('#continueButton').click()
    await page.locator('#gameView:not(.hidden)').waitFor()
  }
  for (const id of ['c01', 'q10intro', 'm01d', 'q11intro']) {
    await openNode(id)
    const layout = await page.evaluate(() => {
      window.scrollTo(0, 0)
      const button = document.querySelector('#nextButton').getBoundingClientRect()
      const toolbar = document.querySelector('.case-tools').getBoundingClientRect()
      return { buttonBottom: button.bottom, toolbarTop: toolbar.top, buttonTop: button.top }
    })
    assert.ok(layout.buttonTop >= 0 && layout.buttonBottom < layout.toolbarTop, `${id} next button covered at 1440x900: ${JSON.stringify(layout)}`)
  }

  await openNode('a02')
  assert.equal(await page.locator('.chat-title small').textContent(), '聊天记录·回放')
  assert.equal(await page.locator('.chat-compose').textContent(), '聊天记录已归档 · 仅供查看')
  assert.equal(await page.locator('.chat-compose span, .chat-compose i').count(), 0)

  for (const [id, filename] of [['a06', 'lin-old-new-compare-v1.webp'], ['q06a', 'song-stop-handover-v1.webp'], ['q06b', 'song-delay-handover-v1.webp']]) {
    await openNode(id)
    const src = await page.locator('#sceneImage').getAttribute('src')
    assert.ok(src.endsWith(filename), `${id} shows ${src}`)
    assert.equal(await page.locator('#sceneImage').evaluate(image => image.complete && image.naturalWidth > 0), true)
  }

  await openNode('q10intro')
  assert.match(await page.locator('#pageMarker').innerText(), /1 \/ 2/)
  await page.locator('#nextButton').click()
  assert.match(await page.locator('#pageMarker').innerText(), /2 \/ 2/)
  assert.equal(await page.locator('#stepBackButton').innerText(), '返回本段上一页')
  await page.locator('#stepBackButton').click()
  assert.match(await page.locator('#pageMarker').innerText(), /1 \/ 2/)
  assert.equal(await page.locator('#stepBackButton').isDisabled(), true)
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('weKnowHim.casefileTrial.save.v1'))).currentId, 'q10intro')
  await page.locator('#nextButton').click()
  assert.match(await page.locator('#pageMarker').innerText(), /2 \/ 2/)

  await openNode('q06a', { choices: { Q01: 'B', Q06: 'A' } })
  assert.equal(await page.locator('#statusCount').textContent(), '2')
  await page.locator('#statusButton').click()
  const statusText = await page.locator('#drawerBody').innerText()
  assert.match(statusText, /第1次选择/)
  assert.match(statusText, /第6次选择/)
  assert.match(statusText, /订单核验和样品保全/)

  await openNode('e2', { choices: { Q01: 'B', Q11: 'A', Q12: 'A' }, flags: { ...engine.DEFAULT_FLAGS, PREWARN: 0 }, completed: true, ending: 'E2' })
  const ending = await page.locator('#chapterEnd').innerText()
  assert.match(ending, /当晚没有付款/)
  assert.doesNotMatch(ending, /当晚交了费|没保存下来的材料/)
  assert.match(await page.locator('#chapterLabel').textContent(), /文字/)
  for (const id of ['e3', 'e5']) {
    await openNode(id, { choices: { Q01: 'B', Q11: 'A', Q12: id === 'e3' ? 'B' : 'C' }, flags: { ...engine.DEFAULT_FLAGS, PREWARN: 0 }, completed: true, ending: id.toUpperCase() })
    const text = await page.locator('#chapterEnd').innerText()
    assert.match(text, /当晚没交费|第一晚.*没有付款/)
    assert.doesNotMatch(text, /办理退款|参加当晚批次/)
  }
  await page.setViewportSize({ width: 375, height: 812 })
  await openNode('q06a')
  const mobile = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth, button: document.querySelector('#nextButton').getBoundingClientRect().toJSON(), tools: document.querySelector('.case-tools').getBoundingClientRect().toJSON() }))
  assert.ok(mobile.content <= mobile.viewport + 1, `mobile horizontal overflow: ${JSON.stringify(mobile)}`)
  assert.ok(mobile.button.bottom < mobile.tools.top, `mobile next button covered: ${JSON.stringify(mobile)}`)
  assert.deepEqual(errors, [])
  console.log('UI review: 4 desktop layouts, mobile layout, chat replay, 3 visual branches, choice history, E2/E3/E5 narratives and console passed')
  await browser.close()
}

main().catch(error => { console.error(error); process.exitCode = 1 }).finally(() => server.close())
