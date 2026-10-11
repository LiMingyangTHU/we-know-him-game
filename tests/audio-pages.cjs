// Check that narrated second pages become visible while their voice is playing.
const assert = require('node:assert/strict')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { chromium } = require('C:/Users/35504/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const root = path.resolve(__dirname, '..')
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  const file = path.resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`)
  if (!file.startsWith(root + path.sep)) return response.writeHead(403).end()
  fs.readFile(file, (error, data) => error ? response.writeHead(404).end() : response.writeHead(200, { 'Content-Type': ({ '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.mp3': 'audio/mpeg', '.webp': 'image/webp', '.jpg': 'image/jpeg' })[path.extname(file)] || 'application/octet-stream' }).end(data))
})

async function main() {
  const [{ default: story }, engine] = await Promise.all([
    import(pathToFileURL(path.join(root, 'src/data/story.js'))),
    import(pathToFileURL(path.join(root, 'src/core/engine.js')))
  ])
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] })
  const page = await browser.newPage({ serviceWorkers: 'block' })
  const url = `http://127.0.0.1:${server.address().port}/trial-casefile/`
  await page.goto(url)
  const state = { ...engine.createState(story.startId, story), currentId: 'q10intro', visited: [story.startId, 'q10intro'], progress: 73 }
  await page.evaluate(saved => { localStorage.setItem('audioEnabled', 'true'); localStorage.setItem('weKnowHim.casefileTrial.save.v1', JSON.stringify(saved)) }, state)
  await page.reload()
  await page.locator('#continueButton').click()
  assert.match(await page.locator('#pageMarker').innerText(), /1 \/ 2/)
  await page.waitForFunction(() => document.querySelector('#pageMarker').innerText.includes('2 / 2'), null, { timeout: 30000 })
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('weKnowHim.casefileTrial.save.v1'))).currentId, 'q10intro')
  console.log('Narrated q10intro: second text page appeared during the same node voice take')
  await browser.close()
}

main().catch(error => { console.error(error); process.exitCode = 1 }).finally(() => server.close())
