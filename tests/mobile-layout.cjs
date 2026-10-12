const assert = require('node:assert/strict')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { chromium } = require('C:/Users/35504/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')

const root = path.resolve(__dirname, '..')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg' }
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  const file = path.resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`)
  if (!file.startsWith(root + path.sep)) return response.writeHead(403).end()
  fs.readFile(file, (error, data) => error ? response.writeHead(404).end() : response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(data))
})

async function main() {
  const [{ default: story }, engine] = await Promise.all([
    import(pathToFileURL(path.join(root, 'src/data/story.js'))),
    import(pathToFileURL(path.join(root, 'src/core/engine.js')))
  ])
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
  const screens = [
    { width: 320, height: 568 },
    { width: 360, height: 640 },
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 667, height: 375 },
    { width: 768, height: 1024 },
  ]
  const nodes = ['a01', 'a02', 'q01', 'q06a', 'q10intro', 'e1']
  const failures = []
  const url = `http://127.0.0.1:${server.address().port}/trial-casefile/`
  try {
    for (const screen of screens) {
      const context = await browser.newContext({ viewport: screen, serviceWorkers: 'block', isMobile: true, hasTouch: true, deviceScaleFactor: 1 })
      const page = await context.newPage()
      await page.goto(url)
      const home = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth, actions: document.querySelector('.home-actions').getBoundingClientRect().toJSON() }))
      if (home.scroll > home.viewport + 1) failures.push(`${screen.width}x${screen.height} home overflow ${home.scroll}`)
      for (const id of nodes) {
        const state = { ...engine.createState(story.startId, story), currentId: id, visited: [story.startId, id], progress: story.nodes[id].progress || 0 }
        await page.evaluate(saved => localStorage.setItem('weKnowHim.casefileTrial.save.v1', JSON.stringify(saved)), state)
        await page.reload()
        await page.locator('#continueButton').click()
        await page.locator('#gameView:not(.hidden)').waitFor()
        if (process.env.MOBILE_SCREENSHOTS && id === 'a01' && (screen.width === 320 || screen.width === 390)) {
          await page.evaluate(() => window.scrollTo(0, 0))
          await page.waitForTimeout(500)
          await page.screenshot({ path: path.join(process.env.TEMP || root, `mobile-${screen.width}-a01.png`) })
        }
        const result = await page.evaluate(() => {
          const rect = s => document.querySelector(s).getBoundingClientRect().toJSON()
          const choice = document.querySelector('#choices button')
          const actions = document.querySelector('.story-actions')
          const tools = document.querySelector('.case-tools')
          const header = document.querySelector('.case-topbar')
          const image = document.querySelector('.case-visual .media-frame')
          const story = document.querySelector('.case-story')
          return { scroll: document.documentElement.scrollWidth, viewport: innerWidth, header: header.getBoundingClientRect().toJSON(), home: rect('#homeButton'), audio: rect('#audioButton'), progress: rect('.progress-wrap'), image: image.getBoundingClientRect().toJSON(), story: story.getBoundingClientRect().toJSON(), choice: choice?.getBoundingClientRect().toJSON(), actions: actions.getBoundingClientRect().toJSON(), next: rect('#nextButton'), tools: tools.getBoundingClientRect().toJSON(), nextDisplay: getComputedStyle(document.querySelector('#nextButton')).display, actionsPosition: getComputedStyle(actions).position }
        })
        if (result.scroll > result.viewport + 1) failures.push(`${screen.width}x${screen.height} ${id} overflow ${result.scroll}`)
        if (result.home.right > result.audio.left - 8) failures.push(`${screen.width}x${screen.height} ${id} header collision`)
        if (screen.width <= 700 && result.actionsPosition !== 'static') failures.push(`${screen.width}x${screen.height} ${id} actions overlay text`)
        if (result.actions.width > result.viewport + 1) failures.push(`${screen.width}x${screen.height} ${id} actions too wide`)
        const target = result.nextDisplay === 'none' && result.choice ? page.locator('#choices button').first() : page.locator('#nextButton')
        if (result.nextDisplay !== 'none' || result.choice) {
          await target.scrollIntoViewIfNeeded()
          await page.evaluate(() => window.scrollBy(0, document.querySelector('.case-tools').getBoundingClientRect().height + 16))
          await page.waitForTimeout(100)
          const reachable = await page.evaluate(selector => {
            const element = document.querySelector(selector)
            const box = element.getBoundingClientRect()
            const tools = document.querySelector('.case-tools').getBoundingClientRect()
            return { top: box.top, bottom: box.bottom, toolsTop: tools.top }
          }, result.nextDisplay === 'none' && result.choice ? '#choices button' : '#nextButton')
          if (reachable.top < result.header.bottom - 2 || reachable.bottom > reachable.toolsTop - 2) failures.push(`${screen.width}x${screen.height} ${id} primary action unreachable ${JSON.stringify(reachable)}`)
        }
      }
      await page.locator('#charactersButton').click()
      const drawer = await page.evaluate(() => ({ width: document.querySelector('#drawer').getBoundingClientRect().width, body: document.querySelector('#drawerBody').getBoundingClientRect().toJSON(), viewport: innerHeight }))
      if (drawer.body.bottom > drawer.viewport + 1) failures.push(`${screen.width}x${screen.height} drawer bottom clipped`)
      await page.locator('#drawerClose').click()
      if (screen.width <= 700) {
        await page.evaluate(() => {
          const overlay = document.querySelector('#archiveReveal')
          const list = document.querySelector('#archiveRevealList')
          list.innerHTML = Array.from({ length: 4 }, (_, index) => `<div class="archive-reveal-person"><img src="/assets/images/lin-final-edit-v3.webp" alt=""><div><strong>人物档案 ${index + 1}</strong><p>${'这是一段需要在手机上完整显示的档案内容。'.repeat(4)}</p></div></div>`).join('')
          overlay.classList.remove('hidden')
          overlay.classList.add('active')
        })
        await page.locator('#archiveRevealContinue').scrollIntoViewIfNeeded()
        const reveal = await page.evaluate(() => ({ button: document.querySelector('#archiveRevealContinue').getBoundingClientRect().toJSON(), overlay: document.querySelector('#archiveReveal').getBoundingClientRect().toJSON() }))
        if (reveal.button.bottom > reveal.overlay.bottom || reveal.button.top < reveal.overlay.top) failures.push(`${screen.width}x${screen.height} archive action unreachable`)
      }
      await context.close()
    }
    assert.deepEqual(failures, [])
    console.log(`Mobile layout: ${screens.length} viewports × ${nodes.length} story screens; home, actions, drawers and archive reveal passed`)
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; server.close() })
