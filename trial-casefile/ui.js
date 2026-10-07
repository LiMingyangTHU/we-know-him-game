import story from '../src/data/story.js?v=18'
import { presentNode } from '../src/data/player-copy.js?v=18'

const SAVE_KEY = 'weKnowHim.casefileTrial.save.v1'
const stageNames = ['陌生私信', '实验室来电', '活动室座谈', '屏幕里的脸', '咖啡馆之后', '最后剪辑']

function loadState() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') } catch { return null }
}

function stageFor(id = '') {
  if (/^(q10|m01|q11|q12|e\d)/.test(id)) return 6
  if (/^(q07|q08|q09)/.test(id)) return 5
  if (/^(q05|q06)/.test(id)) return 4
  if (/^(q03|q04)/.test(id)) return 3
  if (/^(c|q02|b2)/.test(id)) return 2
  return 1
}

function cleanHeading(text = '') {
  return text.replace(/^Q\d+｜/, '').replace(/^第\d+幕｜/, '') || '整理手中的线索'
}

function refreshCaseChrome() {
  const state = loadState()
  if (!state) return
  const node = story.nodes[state.currentId]
  if (!node) return
  const stage = stageFor(node.id)
  document.querySelector('#caseTask').textContent = cleanHeading(presentNode(node).heading)
  document.querySelector('#caseStage').textContent = stageNames[stage - 1]
  document.querySelectorAll('#caseTimeline li').forEach(item => {
    const itemStage = Number(item.dataset.stage)
    item.classList.toggle('active', itemStage === stage)
    item.classList.toggle('done', itemStage < stage)
  })
  renderQuickEvidence(state.evidence || [])
}

function renderQuickEvidence(evidence) {
  const root = document.querySelector('#quickEvidence')
  if (!root) return
  root.replaceChildren()
  if (!evidence.length) {
    const empty = document.createElement('p')
    empty.className = 'empty-quick'
    empty.textContent = '继续调查后，关键材料会出现在这里。'
    root.append(empty)
    return
  }
  evidence.slice(-2).reverse().forEach((item, index) => {
    const card = document.createElement('article')
    const badge = document.createElement('span')
    badge.textContent = index === 0 ? '新' : '档'
    const content = document.createElement('div')
    const title = document.createElement('strong')
    title.textContent = item.title
    const detail = document.createElement('small')
    detail.textContent = item.boundary
    content.append(title, detail)
    card.append(badge, content)
    root.append(card)
  })
}

document.querySelector('#quickEvidenceOpen')?.addEventListener('click', () => document.querySelector('#evidenceButton')?.click())

const heading = document.querySelector('#heading')
if (heading) new MutationObserver(refreshCaseChrome).observe(heading, { childList: true, subtree: true, characterData: true })
window.addEventListener('storage', refreshCaseChrome)
document.addEventListener('click', () => setTimeout(refreshCaseChrome, 30))
refreshCaseChrome()
