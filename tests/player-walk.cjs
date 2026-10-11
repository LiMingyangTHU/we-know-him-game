// Player-path browser audit: real UI controls, all endings, each visible page.
const assert = require('node:assert/strict')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('C:/Users/35504/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')

const root = path.resolve(__dirname, '..')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.json': 'application/json' }
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  const file = path.resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`)
  if (!file.startsWith(root + path.sep)) return response.writeHead(403).end()
  fs.readFile(file, (error, data) => error ? response.writeHead(404).end() : response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(data))
})

const routes = [
  { name: 'E1', choices: { Q01: 'A', Q02: 'A', Q06: 'A', Q07: 'B', Q08: 'A', Q11: 'A', Q12: 'A' } },
  { name: 'E2', choices: { Q01: 'B', Q02: 'B', Q06: 'B', Q11: 'A', Q12: 'A' } },
  { name: 'E3', choices: { Q05: 'B', Q11: 'A', Q12: 'B' } },
  { name: 'E4', choices: { Q11: 'B' } },
  { name: 'E5', choices: { Q08: 'A', Q11: 'A', Q12: 'C' } },
  { name: 'E6', choices: { Q08: 'B', Q09: 'B', Q11: 'A', Q12: 'C' } },
]

async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const url = `http://127.0.0.1:${server.address().port}/trial-casefile/`
  const seen = new Set()
  for (const route of routes) {
    await page.goto(url)
    await page.evaluate(() => { localStorage.clear() })
    await page.reload()
    await page.locator('#newButton').click()
    let steps = 0
    while (steps++ < 180) {
      const snapshot = await page.evaluate(() => {
        const state = JSON.parse(localStorage.getItem('weKnowHim.casefileTrial.save.v1'))
        const dialogue = document.querySelector('#dialogue')
        const img = document.querySelector('#sceneImage')
        return { id: state.currentId, ending: state.ending, text: dialogue?.innerText.trim() || '', page: document.querySelector('#pageMarker')?.innerText || '', imageVisible: img && !img.classList.contains('hidden'), imageBroken: img && !img.classList.contains('hidden') && img.complete && !img.naturalWidth, chat: !document.querySelector('#chatScene')?.classList.contains('hidden'), archive: !document.querySelector('#archiveReveal')?.classList.contains('hidden'), choices: state.choices }
      })
      seen.add(snapshot.id)
      assert.ok(!snapshot.imageBroken, `${route.name}/${snapshot.id}: broken image`)
      assert.ok(snapshot.text || snapshot.ending, `${route.name}/${snapshot.id}: empty story text`)
      if (snapshot.archive) {
        await page.locator('#archiveRevealContinue').evaluate(button => button.click())
        continue
      }
      if (snapshot.ending) {
        assert.equal(snapshot.ending, route.name)
        break
      }
      const choiceButtons = await page.locator('#choices button').count()
      if (choiceButtons) {
        const questionId = snapshot.id.toUpperCase()
        const letter = route.choices[questionId] || 'A'
        const chosen = page.locator('#choices button').filter({ has: page.locator(`.choice-letter:text-is("${letter}")`) })
        const button = choiceButtons ? page.locator('#choices button').nth(letter.charCodeAt(0) - 65) : chosen
        assert.ok(await button.count(), `${route.name}/${snapshot.id}: missing option ${letter}`)
        await button.evaluate(element => element.click())
        await page.waitForFunction(id => JSON.parse(localStorage.getItem('weKnowHim.casefileTrial.save.v1')).currentId !== id, snapshot.id)
      } else {
        const before = snapshot.id
        const beforePage = snapshot.page
        await page.locator('#nextButton').evaluate(button => button.click())
        await page.waitForFunction(({ id, marker }) => {
          const state = JSON.parse(localStorage.getItem('weKnowHim.casefileTrial.save.v1'))
          return state.currentId !== id || document.querySelector('#pageMarker')?.innerText !== marker
        }, { id: before, marker: beforePage })
      }
    }
    assert.ok(steps < 180, `${route.name}: playthrough never ended`)
    console.log(`${route.name}: ${steps} screens`)
  }
  assert.deepEqual(errors, [])
  console.log(`Player walkthrough: ${routes.length} endings, ${seen.size} distinct story nodes, no broken visible images or page errors`)
  await browser.close()
}

main().catch(error => { console.error(error); process.exitCode = 1 }).finally(() => server.close())
