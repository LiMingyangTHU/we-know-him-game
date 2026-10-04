import story from './data/story.js?v=8'
import * as engine from './core/engine.js?v=8'
import * as storage from './core/storage.js?v=8'
import { takes, enabledByDefault } from './data/audio-manifest.js?v=8'
import { unlockedCharacters } from './data/characters.js?v=8'

const $ = id => document.getElementById(id)
const ui = {
  home: $('homeView'), game: $('gameView'), continue: $('continueButton'), newGame: $('newButton'), homeButton: $('homeButton'),
  chapter: $('chapterLabel'), progressLabel: $('progressLabel'), progressFill: $('progressFill'), meta: $('meta'),
  video: $('sceneVideo'), image: $('sceneImage'), chat: $('chatScene'), badge: $('mediaBadge'), heading: $('heading'), speaker: $('speaker'), dialogue: $('dialogue'),
  narrative: $('narrativePanel'),
  choices: $('choices'), next: $('nextButton'), skipIntro: $('skipIntroButton'), chapterEnd: $('chapterEnd'), replay: $('replayButton'),
  endingCode: $('endingCode'), endingTitle: $('endingTitle'), endingText: $('endingText'), endingDetails: $('endingDetails'), endingEducation: $('endingEducation'),
  evidenceButton: $('evidenceButton'), charactersButton: $('charactersButton'), statusButton: $('statusButton'), restartButton: $('restartButton'),
  evidenceCount: $('evidenceCount'), charactersCount: $('charactersCount'), statusCount: $('statusCount'), drawer: $('drawer'), drawerMask: $('drawerMask'),
  drawerTitle: $('drawerTitle'), drawerBody: $('drawerBody'), drawerClose: $('drawerClose'), audioButton: $('audioButton'),
  confirm: $('confirmDialog'), toast: $('toast')
}

let state = null
let audioEnabled = enabledByDefault
let audio = new Audio()
let toastTimer = null

const flagLabels = {
  PREWARN: value => value ? '已提前提醒付款风险' : '先保存证据，预警较晚',
  EARLY: value => value ? '已尽早核验并咨询止付' : '补材料后再核验，处置较晚',
  JOB: value => value ? '已提前发现一期授权期限' : '等待企业书面回复，发现较晚',
  TRUST: value => value ? '经授权保留打码文风样本' : '仅保留匿名时间线，隐私暴露更少',
  RESEARCH: value => value ? '已停止交接并封存样品' : '增加通话证据，正规安排较晚',
  HIDDEN: value => value ? '只标记连接线索，责任待核' : '曾过早指认，截图已经传播',
  CLEAR: value => value ? '退款与报道分开，双账户留档' : '部分退款被用作项目背书',
  FAKE: value => value ? '原片与伪片来源链完整' : '冒名警报更早，来源链后补',
  VERIFY: value => value ? '三方答复齐后具名发布' : '中午先预警，傍晚补答复',
  SAFE: value => value ? '按授权公开，证人继续合作' : '原件泄露，进入补救'
}

function statusCards() {
  return Object.entries(state.flags).filter(([, value]) => value !== null).map(([key, value]) => ({ key, label: flagLabels[key]?.(value) || String(value) }))
}

function showToast(text) {
  ui.toast.textContent = text
  ui.toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => ui.toast.classList.remove('show'), 1800)
}

function showHome() {
  stopAudio()
  ui.game.classList.add('hidden')
  ui.home.classList.remove('hidden')
  const saved = storage.load()
  const valid = saved && story.nodes[saved.currentId]
  ui.continue.classList.toggle('hidden', !valid)
  if (valid) ui.continue.textContent = `继续调查 · ${saved.progress || 0}%`
  ui.newGame.textContent = valid ? '重新开始完整调查' : '开始调查'
  history.replaceState({ view: 'home' }, '', './')
}

function showGame(nextState) {
  state = nextState
  ui.home.classList.add('hidden')
  ui.game.classList.remove('hidden')
  history.replaceState({ view: 'game' }, '', '#game')
  commit(state)
}

function commit(nextState) {
  state = nextState
  storage.save(state)
  stopAudio()
  render(story.nodes[state.currentId])
}

function render(node) {
  const progress = state.progress || 0
  ui.chapter.textContent = node.chapter ? `第${node.chapter}幕` : (node.kind === 'intro' ? '背景简报' : (node.kind === 'ending' ? '调查结束' : '调查中'))
  ui.progressLabel.textContent = `${progress}%`
  ui.progressFill.style.width = `${progress}%`
  ui.progressFill.parentElement.setAttribute('aria-valuenow', String(progress))
  ui.meta.textContent = [node.time, node.place, node.source].filter(Boolean).join(' · ')
  ui.heading.textContent = node.heading || ''
  ui.speaker.textContent = node.speaker || ''
  ui.dialogue.textContent = node.text || ''
  ui.evidenceCount.textContent = state.evidence.length
  ui.charactersCount.textContent = unlockedCharacters(state.visited).length
  ui.statusCount.textContent = statusCards().length

  renderMedia(node.media, node.id)
  renderChoices(node)
  const isEnd = node.kind === 'ending'
  ui.narrative.classList.toggle('hidden', isEnd)
  ui.chapterEnd.classList.toggle('hidden', !isEnd)
  ui.next.classList.toggle('hidden', isEnd || node.kind === 'choice')
  ui.skipIntro.classList.toggle('hidden', node.kind !== 'intro')
  if (isEnd) renderEnding(node)

  const take = takes[node.audioId] || {}
  ui.audioButton.classList.toggle('disabled', !take.src)
  ui.audioButton.textContent = audioEnabled && take.src ? '声' : '静'
  if (audioEnabled && take.src) playAudio(take.src)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function renderEnding(node) {
  ui.endingCode.textContent = node.endingId || ''
  ui.endingTitle.textContent = node.heading || '本轮结局'
  ui.endingText.textContent = node.text || ''
  ui.endingEducation.textContent = node.education || ''
  ui.endingDetails.replaceChildren()
  endingNotes(node.endingId).forEach(note => {
    const item = document.createElement('p')
    item.textContent = note
    ui.endingDetails.append(item)
  })
}

function endingNotes(endingId) {
  const c = state.choices
  const f = state.flags
  if (endingId === 'E1') return [
    '梁一舟在付款前得到明确提醒。',
    '宋岚较早启动止付、延期和样品保全。',
    '跑腿员只被标记为连接线索，责任交由有权限机构核查。',
    '退款与报道分开，具体风险没有被沉默交换覆盖。'
  ]
  if (endingId === 'E2') {
    const notes = []
    if (!f.PREWARN) notes.push('早期没有公开预警：梁一舟在当晚批次交费，最终提醒后开始退款和报案登记。')
    if (!f.JOB) notes.push('完整合作函未被及时拼回：盖章截图先传播，一名学生已经付款。')
    if (!f.TRUST) notes.push('姜宁选择匿名时间线：隐私暴露更少，公开视频缺少文字对照。')
    if (!f.RESEARCH) notes.push('宋岚多录了一段承诺：证据增加，正规检测和止损晚了数小时。')
    if (!f.HIDDEN) notes.push('对唐遇的指认发出后删除：截图仍在传播，形成二次伤害。')
    if (!f.CLEAR) notes.push('小额退款成为“正规项目”的新背书，部分观望者继续相信。')
    if (!f.FAKE) notes.push('冒名警报发布更早，但缺少原片对照的版本仍在小群流转。')
    if (!f.VERIFY) notes.push('中午预警更早但没有具名背书，傍晚补答复需要再次传播。')
    return notes.length ? notes : ['最终预警已发布，处置结果仍需等待银行、平台和警方核查。']
  }
  if (endingId === 'E3') return [c.Q01 === 'A' ? '梁一舟此前已因临时提醒停付。' : '梁一舟在9月23日批次交费，正在办理退款和报案登记。', '宋岚的尾款在三方答复到齐当晚停付；延迟的是面向更多人的传播。']
  if (endingId === 'E4') return [f.TRUST ? '即使此前取得过部分授权，未打码原件仍超出公开范围。' : '姜宁没有交出聊天截图，但可识别叙述仍把她推到公众面前。', '下架无法保证已经下载和转发的副本消失。']
  if (endingId === 'E5') return [c.Q01 === 'A' ? '梁一舟本人被早期提醒保护。' : '梁一舟随当晚批次交费。', c.Q10 === 'A' ? '傍晚具名更正曾发布，但午夜模糊补充被单独截取。' : '中午具体提醒仍在，但午夜没有形成清晰的最终对照。']
  if (endingId === 'E6') return ['部分退款换来了模糊口径。', '冒名警报缺少及时的原片对照。', '真实的脸和真实素材最终被重新包装成“官方背书”。']
  return []
}

function renderMedia(media = {}, nodeId = '') {
  const isVideo = media.type === 'video'
  const isChat = media.type === 'chat'
  ui.video.classList.toggle('hidden', !isVideo)
  ui.image.classList.toggle('hidden', isVideo || isChat)
  ui.chat.classList.toggle('hidden', !isChat)
  ui.badge.classList.toggle('hidden', !isVideo)
  if (isVideo) {
    ui.video.poster = media.poster || ''
    if (ui.video.getAttribute('src') !== media.src) ui.video.src = media.src || ''
    ui.video.setAttribute('aria-label', media.alt || '')
    ui.video.play().catch(() => {})
  } else if (isChat) {
    ui.video.pause()
    renderChat(media)
  } else {
    ui.video.pause()
    ui.image.src = media.src || ''
    ui.image.alt = media.alt || ''
    ui.image.classList.remove('motion-left', 'motion-right', 'motion-push')
    const modes = ['motion-left', 'motion-right', 'motion-push']
    const score = [...nodeId].reduce((total, char) => total + char.charCodeAt(0), 0)
    ui.image.classList.add(modes[score % modes.length])
    ui.image.classList.remove('media-enter')
    void ui.image.offsetWidth
    ui.image.classList.add('media-enter')
  }
}

function renderChat(media) {
  ui.chat.replaceChildren()
  const header = document.createElement('header')
  header.className = 'chat-header'
  const back = document.createElement('span')
  back.className = 'chat-back'
  back.textContent = '‹'
  const title = document.createElement('div')
  title.className = 'chat-title'
  const strong = document.createElement('strong')
  strong.textContent = media.title || '聊天记录'
  const small = document.createElement('small')
  small.textContent = media.subtitle || '聊天记录'
  title.append(strong, small)
  const menu = document.createElement('span')
  menu.className = 'chat-menu'
  menu.textContent = '•••'
  header.append(back, title, menu)

  const body = document.createElement('div')
  body.className = 'chat-body'
  if (media.time) {
    const time = document.createElement('div')
    time.className = 'chat-time'
    time.textContent = media.time
    body.append(time)
  }
  if (media.system) {
    const system = document.createElement('div')
    system.className = 'chat-system'
    const label = document.createElement('span')
    label.textContent = media.system
    system.append(label)
    body.append(system)
  }
  ;(media.messages || []).forEach(message => {
    const row = document.createElement('div')
    row.className = `chat-row ${message.side === 'sent' ? 'sent' : 'received'}`
    const avatar = document.createElement('span')
    avatar.className = 'chat-avatar'
    avatar.textContent = message.avatar || (message.name || '?').slice(0, 1)
    const content = document.createElement('div')
    content.className = 'chat-content'
    const name = document.createElement('p')
    name.className = 'chat-name'
    name.textContent = message.name || ''
    const bubble = document.createElement('div')
    bubble.className = 'chat-bubble'
    if (message.attachment) {
      const attachment = document.createElement('div')
      attachment.className = 'chat-attachment'
      const attachmentTitle = document.createElement('strong')
      attachmentTitle.textContent = message.attachment.title
      const note = document.createElement('p')
      note.textContent = message.attachment.note || ''
      attachment.append(attachmentTitle, note)
      bubble.append(attachment)
    } else {
      bubble.textContent = message.text || ''
    }
    content.append(name, bubble)
    row.append(avatar, content)
    body.append(row)
  })
  const compose = document.createElement('div')
  compose.className = 'chat-compose'
  const voice = document.createElement('span')
  voice.textContent = '声'
  const field = document.createElement('i')
  const plus = document.createElement('span')
  plus.textContent = '+'
  compose.append(voice, field, plus)
  ui.chat.append(header, body, compose)
}

function renderChoices(node) {
  ui.choices.replaceChildren()
  if (node.kind !== 'choice') return
  node.options.forEach(option => {
    const button = document.createElement('button')
    button.className = 'choice'
    button.innerHTML = `<span class="choice-letter">${option.letter}</span><span class="choice-text"></span>`
    button.querySelector('.choice-text').textContent = option.text
    button.addEventListener('click', () => {
      ui.choices.querySelectorAll('button').forEach(item => { item.disabled = true })
      setTimeout(() => commit(engine.choose(story, state, option.letter)), 160)
    }, { once: true })
    ui.choices.append(button)
  })
}

function next() {
  const node = story.nodes[state.currentId]
  if (node.kind !== 'choice' && node.kind !== 'ending') commit(engine.advance(story, state))
}

function restart() {
  storage.clear()
  closeDrawer()
  showGame(engine.createState(story.startId, story))
}

function askRestart() {
  if (typeof ui.confirm.showModal === 'function') ui.confirm.showModal()
  else if (window.confirm('重新开始完整调查？当前进度会被清空。')) restart()
}

function openDrawer(type) {
  const isCharacters = type === 'characters'
  const items = type === 'evidence' ? state.evidence : (isCharacters ? unlockedCharacters(state.visited) : statusCards())
  ui.drawerTitle.textContent = type === 'evidence' ? '证据册' : (isCharacters ? '人物档案' : '调查状态')
  ui.drawerBody.replaceChildren()
  if (!items.length) {
    const empty = document.createElement('p')
    empty.className = 'empty'
    empty.textContent = type === 'evidence' ? '推进剧情后，证据会出现在这里。' : (isCharacters ? '人物会在首次登场后加入档案。' : '作出选择后，处置状态会在这里更新。')
    ui.drawerBody.append(empty)
  } else if (isCharacters) {
    const list = document.createElement('div')
    list.className = 'character-list'
    items.forEach(person => {
      const section = document.createElement('section')
      section.className = 'character-card'
      const portrait = document.createElement('img')
      portrait.className = 'character-portrait'
      portrait.src = person.portrait
      portrait.alt = `${person.name}人物头像`
      const info = document.createElement('div')
      info.className = 'character-info'
      const name = document.createElement('h3')
      name.textContent = person.name
      const role = document.createElement('p')
      role.className = 'character-role'
      role.textContent = person.role
      const known = document.createElement('p')
      known.className = 'character-known'
      known.textContent = person.known
      info.append(name, role, known)
      section.append(portrait, info)
      list.append(section)
    })
    ui.drawerBody.append(list)
  } else {
    items.forEach(item => {
      const section = document.createElement('section')
      section.className = 'drawer-item'
      const title = document.createElement('strong')
      title.textContent = item.title || item.key
      const text = document.createElement('p')
      text.textContent = item.boundary || item.label
      section.append(title, text)
      ui.drawerBody.append(section)
    })
  }
  ui.drawerMask.classList.remove('hidden')
  ui.drawer.classList.add('open')
  ui.drawer.setAttribute('aria-hidden', 'false')
}

function closeDrawer() {
  ui.drawerMask.classList.add('hidden')
  ui.drawer.classList.remove('open')
  ui.drawer.setAttribute('aria-hidden', 'true')
}

function playAudio(src) {
  audio.src = src
  audio.play().catch(() => showToast('浏览器阻止了自动播放，请再点一次声音按钮'))
}

function stopAudio() {
  audio.pause()
  audio.currentTime = 0
}

ui.continue.addEventListener('click', () => showGame(storage.load()))
ui.newGame.addEventListener('click', () => storage.load() ? askRestart() : restart())
ui.homeButton.addEventListener('click', showHome)
ui.next.addEventListener('click', next)
ui.skipIntro.addEventListener('click', () => commit(engine.jump(story, state, 'a01')))
ui.replay.addEventListener('click', askRestart)
ui.restartButton.addEventListener('click', askRestart)
ui.evidenceButton.addEventListener('click', () => openDrawer('evidence'))
ui.charactersButton.addEventListener('click', () => openDrawer('characters'))
ui.statusButton.addEventListener('click', () => openDrawer('status'))
ui.drawerClose.addEventListener('click', closeDrawer)
ui.drawerMask.addEventListener('click', closeDrawer)
ui.confirm.addEventListener('close', () => { if (ui.confirm.returnValue === 'confirm') restart() })
ui.audioButton.addEventListener('click', () => {
  const take = takes[story.nodes[state.currentId]?.audioId] || {}
  if (!take.src) return showToast('本段自然配音待导入，文字阅读不受影响')
  audioEnabled = !audioEnabled
  ui.audioButton.textContent = audioEnabled ? '声' : '静'
  audioEnabled ? playAudio(take.src) : stopAudio()
})
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeDrawer()
  if ((event.key === 'Enter' || event.key === ' ') && !ui.game.classList.contains('hidden') && !ui.next.classList.contains('hidden')) next()
})

const errors = engine.validateStory(story)
if (errors.length) throw new Error(errors.join('\n'))
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(console.warn)
showHome()
