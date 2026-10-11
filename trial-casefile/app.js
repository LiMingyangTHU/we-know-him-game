import story from '../src/data/story.js?v=18'
import * as engine from '../src/core/engine.js?v=16'
import * as storage from './storage.js?v=1'
import { takes, musicTracks, musicKeyForNode, enabledByDefault } from '../src/data/audio-manifest.js?v=24'
import { unlockedCharacters, characterUpdatesAt } from '../src/data/characters.js?v=18'
import { notesForNode, unlockedGlossary } from '../src/data/glossary.js?v=16'
import { presentNode } from '../src/data/player-copy.js?v=21'

const $ = id => document.getElementById(id)
const ui = {
  home: $('homeView'), game: $('gameView'), continue: $('continueButton'), newGame: $('newButton'), homeButton: $('homeButton'),
  chapter: $('chapterLabel'), progressLabel: $('progressLabel'), progressFill: $('progressFill'), meta: $('meta'),
  video: $('sceneVideo'), image: $('sceneImage'), chat: $('chatScene'), badge: $('mediaBadge'), heading: $('heading'), speaker: $('speaker'), dialogue: $('dialogue'), pageMarker: $('pageMarker'),
  orientation: $('orientationCard'), orientationKicker: $('orientationKicker'), orientationRoute: $('orientationRoute'), orientationGoal: $('orientationGoal'),
  modeStrip: $('modeStrip'), modeIcon: $('modeIcon'), modeLabel: $('modeLabel'), modeNote: $('modeNote'),
  contextNotes: $('contextNotes'), contextNotesBody: $('contextNotesBody'),
  sceneTransition: $('sceneTransition'), transitionIcon: $('transitionIcon'), transitionTitle: $('transitionTitle'), transitionSubtitle: $('transitionSubtitle'),
  narrative: $('narrativePanel'),
  choices: $('choices'), next: $('nextButton'), stepBack: $('stepBackButton'), skipIntro: $('skipIntroButton'), chapterEnd: $('chapterEnd'), replay: $('replayButton'),
  endingCode: $('endingCode'), endingTitle: $('endingTitle'), endingText: $('endingText'), endingDetails: $('endingDetails'), endingEducation: $('endingEducation'),
  evidenceButton: $('evidenceButton'), charactersButton: $('charactersButton'), statusButton: $('statusButton'), glossaryButton: $('glossaryButton'), restartButton: $('restartButton'),
  evidenceCount: $('evidenceCount'), charactersCount: $('charactersCount'), statusCount: $('statusCount'), glossaryCount: $('glossaryCount'), drawer: $('drawer'), drawerMask: $('drawerMask'),
  drawerTitle: $('drawerTitle'), drawerBody: $('drawerBody'), drawerClose: $('drawerClose'), audioButton: $('audioButton'),
  archiveReveal: $('archiveReveal'), archiveRevealList: $('archiveRevealList'), archiveRevealContinue: $('archiveRevealContinue'), archiveRevealOpen: $('archiveRevealOpen'),
  confirm: $('confirmDialog'), toast: $('toast')
}

let state = null
let audioEnabled = localStorage.getItem('audioEnabled') === 'true' || enabledByDefault
const voiceAudio = new Audio()
const musicAudio = new Audio()
musicAudio.loop = true
musicAudio.preload = 'auto'
let currentMusicKey = ''
let musicFadeTimer = null
let toastTimer = null
let transitionTimer = null
let lastPresentation = null
let currentViewNode = null
let textPages = []
let textPageIndex = 0
let archiveVoicePaused = false

const flagLabels = {
  PREWARN: value => value ? '我先发出了付款风险提醒' : '我先留证，公开提醒晚了一步',
  EARLY: value => value ? '我尽早核验并咨询了止付' : '我等过补充材料，处置晚了几小时',
  JOB: value => value ? '我及时找到了第1期实习授权期限' : '我等企业回信时，截图仍在传播',
  TRUST: value => value ? '我只留下姜宁授权的打码片段' : '我只记匿名时间线，没有保留私聊',
  RESEARCH: value => value ? '我和宋老师停下交接，封存样品' : '我多留了一段通话，正规安排晚了',
  HIDDEN: value => value ? '我只标连接线索，把责任留待核查' : '我曾过早点名，删帖也收不回截图',
  CLEAR: value => value ? '我把退款与报道分开处理' : '退款截图后来又成了项目背书',
  FAKE: value => value ? '我保住了原片与伪片的来源链' : '我先发警报，来源记录随后补交',
  VERIFY: value => value ? '我等三方答复齐后具名发布' : '我中午先预警，傍晚再补答复',
  SAFE: value => value ? '我按授权公开，当事人继续合作' : '原件被公开后，我转入补救'
}

const endingVerdicts = {
  E1: { label: '好结局 · 及时止损', review: '评价：你赶在下一批付款前发出了清楚的提醒，也保住了关键材料和当事人的选择权。' },
  E2: { label: '较好结局 · 留有缺口', review: '评价：主要风险得到了控制，但前面的迟疑或取证缺口，使部分损失已经无法完全挽回。' },
  E3: { label: '遗憾结局 · 真相来迟', review: '评价：你完成了更完整的调查，却错过了最需要提醒的几天。完整不总能补回时效。' },
  E4: { label: '坏结局 · 证人退出', review: '评价：公开原件造成了二次伤害，调查失去当事人的信任，也失去了继续公开推进的条件。' },
  E5: { label: '坏结局 · 更正被利用', review: '评价：含糊的说法留下了被截取和改写的空间，骗子借你的沉默继续为项目背书。' },
  E6: { label: '隐藏坏结局 · 被借用的脸', review: '评价：止传和证据对照没有同时完成，林知夏自己的形象也进入了诈骗链条。' }
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
  hideArchiveReveal()
  stopAllAudio()
  ui.game.classList.add('hidden')
  ui.home.classList.remove('hidden')
  const saved = storage.load()
  const valid = saved && story.nodes[saved.currentId]
  ui.continue.classList.toggle('hidden', !valid)
  if (valid) ui.continue.textContent = `继续调查 · ${saved.progress || 0}%`
  ui.newGame.textContent = valid ? '从头再查一次' : '开始调查'
  history.replaceState({ view: 'home' }, '', './trial-casefile/')
}

function showGame(nextState) {
  state = nextState
  lastPresentation = null
  ui.home.classList.add('hidden')
  ui.game.classList.remove('hidden')
  history.replaceState({ view: 'game' }, '', './trial-casefile/#game')
  commit(state)
}

function commit(nextState) {
  const enteredNode = Boolean(state?.currentId && state.currentId !== nextState.currentId)
  const announced = new Set(nextState.archiveAnnounced || [])
  const freshUpdates = enteredNode ? characterUpdatesAt(nextState.currentId, nextState.visited).filter(update => !announced.has(update.id)) : []
  freshUpdates.forEach(update => announced.add(update.id))
  state = { ...nextState, archiveAnnounced: [...announced] }
  hideArchiveReveal()
  storage.save(state)
  stopVoice()
  render(story.nodes[state.currentId])
  if (freshUpdates.length) showArchiveReveal(freshUpdates)
}

function showArchiveReveal(updates) {
  stopVoice()
  archiveVoicePaused = true
  clearTimeout(transitionTimer)
  ui.sceneTransition.classList.add('hidden')
  ui.sceneTransition.classList.remove('active', 'leaving')
  ui.sceneTransition.setAttribute('aria-hidden', 'true')
  ui.archiveRevealList.replaceChildren()
  updates.forEach(update => {
    const row = document.createElement('div')
    row.className = 'archive-reveal-person'
    const portrait = document.createElement('img')
    portrait.src = update.portrait
    portrait.alt = `${update.name}人物照片`
    const info = document.createElement('div')
    const name = document.createElement('strong')
    name.textContent = update.name
    const summary = document.createElement('p')
    summary.textContent = update.summary
    info.append(name, summary)
    row.append(portrait, info)
    ui.archiveRevealList.append(row)
  })
  ui.archiveReveal.classList.remove('hidden')
  ui.archiveReveal.setAttribute('aria-hidden', 'false')
  requestAnimationFrame(() => ui.archiveReveal.classList.add('active'))
  ui.archiveRevealContinue.focus()
}

function hideArchiveReveal({ resume = false, openArchive = false } = {}) {
  if (ui.archiveReveal.classList.contains('hidden')) {
    if (!resume) archiveVoicePaused = false
    return
  }
  ui.archiveReveal.classList.remove('active')
  ui.archiveReveal.classList.add('hidden')
  ui.archiveReveal.setAttribute('aria-hidden', 'true')
  if (openArchive) openDrawer('characters')
  else if (resume) {
    if (archiveVoicePaused && state && audioEnabled) playVoiceForNode(story.nodes[state.currentId])
    archiveVoicePaused = false
    ;(ui.choices.querySelector('button') || ui.next).focus()
  } else archiveVoicePaused = false
}

function render(node) {
  const viewNode = presentNode(node)
  currentViewNode = viewNode
  textPages = buildTextPages(viewNode, node)
  textPageIndex = 0
  const presentation = resolvePresentation(node)
  const progress = state.progress || 0
  ui.chapter.textContent = node.chapter ? `第${node.chapter}幕` : (node.kind === 'intro' ? '我手里的线索' : (node.kind === 'ending' ? '事后手记' : '正在核对'))
  ui.progressLabel.textContent = `${progress}%`
  ui.progressFill.style.width = `${progress}%`
  ui.progressFill.parentElement.setAttribute('aria-valuenow', String(progress))
  ui.meta.textContent = [viewNode.time, viewNode.place, viewNode.source].filter(Boolean).join(' · ')
  ui.heading.textContent = viewNode.heading || ''
  renderPresentation(node, presentation)
  renderOrientation(viewNode)
  renderContextNotes(node)
  ui.speaker.textContent = viewNode.speaker || ''
  renderTextPage(node)
  ui.evidenceCount.textContent = state.evidence.length
  ui.charactersCount.textContent = unlockedCharacters(state.visited).length
  ui.statusCount.textContent = statusCards().length
  ui.glossaryCount.textContent = unlockedGlossary(state.visited).length
  const canStepBack = Boolean(state.undoSnapshot) && !state.undoLocked
  ui.stepBack.disabled = !canStepBack
  ui.stepBack.title = canStepBack ? '退回前一个界面；退回后必须先继续推进' : '继续推进后可再次使用'

  renderMedia(viewNode.media, node.id, presentation)
  renderChoices(node)
  const isEnd = node.kind === 'ending'
  ui.narrative.classList.toggle('hidden', isEnd)
  ui.chapterEnd.classList.toggle('hidden', !isEnd)
  ui.next.classList.toggle('hidden', isEnd || node.kind === 'choice')
  updateNextLabel(node)
  ui.skipIntro.classList.toggle('hidden', node.kind !== 'intro')
  if (isEnd) renderEnding(viewNode)

  const canSpeak = Boolean(takes[node.audioId]?.src)
  ui.audioButton.classList.toggle('disabled', !canSpeak && !musicTracks[musicKeyForNode(node)])
  ui.audioButton.textContent = audioEnabled ? '声' : '静'
  ui.audioButton.title = audioEnabled ? '关闭声音' : '开启声音'
  syncAudioForNode(node, viewNode)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function buildTextPages(viewNode, node) {
  if (Array.isArray(viewNode.pages) && viewNode.pages.length) return viewNode.pages
  const text = viewNode.text || ''
  if (node.kind === 'choice' || node.kind === 'ending' || (node.progress || 0) < 20 || text.length < 68) return [text]
  const sentences = text.match(/[^。！？；]+[。！？；]?/g) || [text]
  const pages = []
  let page = ''
  sentences.forEach(sentence => {
    if (page && `${page}${sentence}`.length > 62) {
      pages.push(page)
      page = sentence
    } else page += sentence
  })
  if (page) pages.push(page)
  return pages.length ? pages : [text]
}

const cluePattern = /(13\.8万元|9\.42万元|7\.56万元|4\.38万元|1\.86万元|1\.2万元|2800元|9月25日|9月22日21点17分|9月22日21:17|2024年|第1期实习|第2期实习|第1期|第2期|合作期至5月|研究院订单号|正式订单|取样单|对公账户|个人账户|缺角配送箱|橙色反光条|缺了同一角|备用机位|共享盘|未授权|没有材料检测|没有得到授权)/g

function renderHighlightedText(element, text = '') {
  element.replaceChildren()
  let cursor = 0
  for (const match of text.matchAll(cluePattern)) {
    if (match.index > cursor) element.append(document.createTextNode(text.slice(cursor, match.index)))
    const mark = document.createElement('strong')
    mark.className = /万元|元/.test(match[0]) ? 'clue-highlight clue-money' : 'clue-highlight'
    mark.textContent = match[0]
    element.append(mark)
    cursor = match.index + match[0].length
  }
  if (cursor < text.length) element.append(document.createTextNode(text.slice(cursor)))
}

function renderTextPage(node) {
  renderHighlightedText(ui.dialogue, textPages[textPageIndex] || '')
  const multiple = textPages.length > 1
  ui.pageMarker.classList.toggle('hidden', !multiple)
  ui.pageMarker.textContent = multiple ? `本段 ${textPageIndex + 1} / ${textPages.length}` : ''
  ui.dialogue.classList.remove('page-enter')
  void ui.dialogue.offsetWidth
  ui.dialogue.classList.add('page-enter')
  updateNextLabel(node)
}

function updateNextLabel(node) {
  if (textPageIndex < textPages.length - 1) {
    ui.next.textContent = `继续看 · ${textPageIndex + 1}/${textPages.length}`
    return
  }
  ui.next.textContent = node.nextLabel || (node.kind === 'intro' ? '继续整理线索' : '继续核对')
}

function renderContextNotes(node) {
  const notes = node.kind === 'intro' ? [] : notesForNode(node.id)
  ui.contextNotes.classList.toggle('hidden', !notes.length)
  ui.contextNotesBody.replaceChildren()
  notes.forEach(note => {
    const article = document.createElement('article')
    const meta = document.createElement('span')
    meta.textContent = note.category
    const title = document.createElement('strong')
    title.textContent = note.title
    const text = document.createElement('p')
    text.textContent = note.text
    article.append(meta, title, text)
    ui.contextNotesBody.append(article)
  })
}

const presentationTypes = {
  intro: { icon: '◎', label: '开场', note: '' },
  dialogue: { icon: '●', label: '现场', note: '' },
  thought: { icon: '◌', label: '知夏心声', note: '' },
  narration: { icon: '◇', label: '当时', note: '' },
  record: { icon: '▤', label: '已保存材料', note: '' },
  chat: { icon: '▣', label: '聊天记录', note: '' },
  playback: { icon: '▶', label: '视频回放', note: '' },
  flashback: { icon: '↶', label: '当事人回忆', note: '' },
  decision: { icon: '?', label: '我怎么做', note: '' },
  ending: { icon: '◆', label: '结果', note: '' }
}

function resolvePresentation(node) {
  if (node.presentation) return { ...presentationTypes[node.presentation.type], ...node.presentation, type: node.presentation.type }
  if (node.kind === 'intro') return { ...presentationTypes.intro, type: 'intro' }
  if (node.kind === 'choice') return { ...presentationTypes.decision, type: 'decision' }
  if (node.kind === 'ending') return { ...presentationTypes.ending, type: 'ending' }
  if (node.media?.type === 'chat') return { ...presentationTypes.chat, type: 'chat' }
  if (/回忆/.test(node.heading || '')) return { ...presentationTypes.flashback, type: 'flashback' }
  if (/回放|原始视频|监控|冒名视频|游戏内演示/.test(`${node.heading || ''}${node.source || ''}`)) return { ...presentationTypes.playback, type: 'playback' }
  if (/内心/.test(node.speaker || '')) return { ...presentationTypes.thought, type: 'thought' }
  if (/记录|结果|回执|界面|清单|对照|答复|证言|摘录|调查板|页面/.test(node.speaker || '')) return { ...presentationTypes.record, type: 'record' }
  if (/林知夏|梁一舟|宋岚|沈舟|许橙|姜宁|陆鸣|周衡|唐遇/.test(node.speaker || '')) return { ...presentationTypes.dialogue, type: 'dialogue' }
  return { ...presentationTypes.narration, type: 'narration' }
}

function renderPresentation(node, presentation) {
  document.body.dataset.presentation = presentation.type
  ui.modeIcon.textContent = presentation.icon || '◇'
  ui.modeLabel.textContent = presentation.label || '场景叙述'
  ui.modeNote.textContent = ''
  const shouldCue = Boolean(node.presentation?.cue || node.orientation || presentation.type === 'flashback' || (lastPresentation === 'flashback' && presentation.type !== 'flashback'))
  if (shouldCue && lastPresentation !== null) playSceneTransition(node, presentation, lastPresentation)
  lastPresentation = presentation.type
}

function playSceneTransition(node, presentation, previousType) {
  clearTimeout(transitionTimer)
  const returning = previousType === 'flashback' && presentation.type !== 'flashback'
  const title = returning ? '回到现在' : (node.presentation?.cueTitle || (presentation.type === 'flashback' ? '进入回忆' : node.heading || presentation.label))
  const subtitle = returning
    ? [node.time, node.place].filter(Boolean).join(' · ') || '继续核对现实中的材料'
    : (node.presentation?.cueSubtitle || [node.time, node.place].filter(Boolean).join(' · '))
  ui.transitionIcon.textContent = returning ? '→' : (presentation.icon || '◇')
  ui.transitionTitle.textContent = title
  ui.transitionSubtitle.textContent = subtitle
  ui.sceneTransition.dataset.mode = returning ? 'return' : presentation.type
  ui.sceneTransition.classList.remove('hidden', 'leaving')
  ui.sceneTransition.setAttribute('aria-hidden', 'false')
  requestAnimationFrame(() => ui.sceneTransition.classList.add('active'))
  transitionTimer = setTimeout(() => {
    ui.sceneTransition.classList.add('leaving')
    ui.sceneTransition.classList.remove('active')
    setTimeout(() => {
      ui.sceneTransition.classList.add('hidden')
      ui.sceneTransition.classList.remove('leaving')
      ui.sceneTransition.setAttribute('aria-hidden', 'true')
    }, 360)
  }, presentation.type === 'flashback' || returning ? 1250 : 850)
}

function renderOrientation(node) {
  const guide = node.orientation
  ui.orientation.classList.toggle('hidden', !guide)
  if (!guide) return
  ui.orientationKicker.textContent = guide.kicker || '调查路标'
  ui.orientationRoute.textContent = guide.route || ''
  ui.orientationGoal.textContent = guide.goal ? `我得弄清：${guide.goal}` : ''
}

function renderEnding(node) {
  const verdict = endingVerdicts[node.endingId] || { label: '结局', review: '评价：这次调查已经结束。' }
  ui.endingCode.textContent = verdict.label
  ui.endingTitle.textContent = node.heading || '事情落在这里'
  ui.endingText.textContent = node.text || ''
  ui.endingEducation.textContent = `${verdict.review}${node.education ? ` ${node.education}` : ''}`
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
    '我在梁一舟付款前给出了明确提醒。',
    '我陪宋老师较早启动止付、延期和样品保全。',
    '我只把跑腿员写成连接线索，没有越过证据给他定责。',
    '我把退款与报道分开，没有用沉默交换损失。'
  ]
  if (endingId === 'E2') {
    const notes = []
    if (!f.PREWARN) notes.push('我没有在最早时公开预警；梁一舟当晚交了费，看到最终提醒后才开始退款和报案登记。')
    if (!f.JOB) notes.push('我没有及时拼回完整合作函；盖章截图先传开，又有一名学生付款。')
    if (!f.TRUST) notes.push('我只留下姜宁的匿名时间线；她暴露得更少，公开视频也少了文字对照。')
    if (!f.RESEARCH) notes.push('我陪宋老师多录了一段承诺；证据多了，正规检测和止损也晚了几个小时。')
    if (!f.HIDDEN) notes.push('我发出过对唐遇的指认，后来虽然删除，截图仍在传播。')
    if (!f.CLEAR) notes.push('我先接受了小额退款；周衡把截图变成“正规项目”的新背书。')
    if (!f.FAKE) notes.push('我更早发出冒名警报，却没有及时补上原片对照，片段仍在小群流转。')
    if (!f.VERIFY) notes.push('我中午先预警，傍晚才补三方答复；同一批人需要再看见一次。')
    return notes.length ? notes : ['我已经发出最终预警，钱和账号的处置还要等银行、平台和警方。']
  }
  if (endingId === 'E3') return [c.Q01 === 'A' ? '我此前的临时提醒让梁一舟停下了付款。' : '我没能在第一晚拦住梁一舟；他正在办理退款和报案登记。', '我让宋老师在三方答复到齐当晚停了尾款；真正迟到的是面向更多人的预警。']
  if (endingId === 'E4') return [f.TRUST ? '即使我此前拿到过部分授权，未打码原件仍超出了约定。' : '姜宁没有交出聊天截图，我的可识别叙述仍把她推到了人前。', '我可以下架页面，却无法收回已经下载和转发的副本。']
  if (endingId === 'E5') return [c.Q01 === 'A' ? '我最早的提醒保住了梁一舟本人。' : '我没有拦住梁一舟参加当晚批次。', c.Q10 === 'A' ? '我傍晚发过具名更正，午夜那句模糊补充却被单独截走。' : '我中午发过具体提醒，午夜仍没能留下清晰的最终对照。']
  if (endingId === 'E6') return ['我用模糊口径换来了部分退款。', '我发出的冒名警报没及时带上原片对照。', '最后，别人用我的脸和真实素材拼出了一份新的“官方背书”。']
  return []
}

function renderMedia(media = {}, nodeId = '', presentation = {}) {
  const isVideo = media.type === 'video'
  const isChat = media.type === 'chat'
  ui.video.classList.toggle('hidden', !isVideo)
  ui.image.classList.toggle('hidden', isVideo || isChat)
  ui.chat.classList.toggle('hidden', !isChat)
  ui.badge.classList.toggle('hidden', !isVideo)
  document.querySelector('.media-frame').dataset.presentation = presentation.type || 'narration'
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
    if (message.time) {
      const time = document.createElement('div')
      time.className = 'chat-time'
      time.textContent = message.time
      body.append(time)
    }
    if (message.system) {
      const system = document.createElement('div')
      system.className = 'chat-system'
      const label = document.createElement('span')
      label.textContent = message.system
      system.append(label)
      body.append(system)
      return
    }
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
    renderHighlightedText(button.querySelector('.choice-text'), option.text)
    button.addEventListener('click', () => {
      ui.choices.querySelectorAll('button').forEach(item => { item.disabled = true })
      setTimeout(() => commit(engine.choose(story, state, option.letter)), 160)
    }, { once: true })
    ui.choices.append(button)
  })
}

function next() {
  const node = story.nodes[state.currentId]
  if (textPageIndex < textPages.length - 1) {
    textPageIndex += 1
    renderTextPage(node)
    return
  }
  if (node.kind !== 'choice' && node.kind !== 'ending') commit(engine.advance(story, state))
}

function stepBack() {
  if (!state.undoSnapshot || state.undoLocked) return showToast('我刚退过一步，先继续查，再回来。')
  commit(engine.back(story, state))
  showToast('我退回了上一步；继续之后才能再退一次。')
}

function restart() {
  storage.clear()
  closeDrawer()
  showGame(engine.createState(story.startId, story))
}

function askRestart() {
  if (typeof ui.confirm.showModal === 'function') ui.confirm.showModal()
  else if (window.confirm('从头再查一次？我现在记下的选择、证据和进度都会被清空。')) restart()
}

function openDrawer(type) {
  const isCharacters = type === 'characters'
  const isGlossary = type === 'glossary'
  const items = type === 'evidence' ? state.evidence : (isCharacters ? unlockedCharacters(state.visited) : (isGlossary ? unlockedGlossary(state.visited) : statusCards()))
  ui.drawerTitle.textContent = type === 'evidence' ? '证据册' : (isCharacters ? '人物档案' : (isGlossary ? '知夏的调查手记' : '调查状态'))
  ui.drawerBody.replaceChildren()
  if (!items.length) {
    const empty = document.createElement('p')
    empty.className = 'empty'
    empty.textContent = type === 'evidence' ? '还没有能放进证据册的材料。' : (isCharacters ? '等我真正见到或听说一个人，再把他写进来。' : (isGlossary ? '现在还是空白。遇到陌生名字时，我会记在这里。' : '做出选择后，我会把造成的变化记在这里。'))
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
      if (person.updated) {
        const badge = document.createElement('span')
        badge.className = 'character-updated-badge'
        badge.textContent = '新增记录'
        name.append(badge)
      }
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
  } else if (isGlossary) {
    items.forEach(item => {
      const section = document.createElement('section')
      section.className = 'drawer-item glossary-item'
      const category = document.createElement('span')
      category.className = 'glossary-category'
      category.textContent = item.category
      const title = document.createElement('strong')
      title.textContent = item.title
      const text = document.createElement('p')
      text.textContent = item.text
      section.append(category, title, text)
      ui.drawerBody.append(section)
    })
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
  if (archiveVoicePaused && state && audioEnabled) playVoiceForNode(story.nodes[state.currentId])
  archiveVoicePaused = false
}

function fadeMusicTo(target, duration = 260) {
  clearInterval(musicFadeTimer)
  const start = musicAudio.volume
  const began = performance.now()
  musicFadeTimer = setInterval(() => {
    const ratio = Math.min(1, (performance.now() - began) / duration)
    musicAudio.volume = start + (target - start) * ratio
    if (ratio >= 1) clearInterval(musicFadeTimer)
  }, 25)
}

function restoreMusic() {
  const track = musicTracks[currentMusicKey]
  if (audioEnabled && track) fadeMusicTo(track.volume, 320)
}

function playMusicForNode(node) {
  const key = musicKeyForNode(node)
  const track = musicTracks[key]
  if (!track || !audioEnabled) return
  if (currentMusicKey === key && musicAudio.src) {
    musicAudio.play().catch(() => {})
    return
  }
  currentMusicKey = key
  clearInterval(musicFadeTimer)
  musicAudio.pause()
  musicAudio.src = track.src
  musicAudio.volume = 0
  musicAudio.play().then(() => fadeMusicTo(track.volume, 700)).catch(() => {
    showToast('浏览器拦住了声音，再点一次“静”即可开启。')
  })
}

function playRecordedVoice(src) {
  voiceAudio.src = src
  voiceAudio.onplay = () => fadeMusicTo(0.07, 180)
  voiceAudio.onended = restoreMusic
  voiceAudio.onerror = restoreMusic
  voiceAudio.play().catch(() => showToast('浏览器拦住了配音，再点一次“静”即可开启。'))
}

function playVoiceForNode(node) {
  if (!audioEnabled) return
  const take = takes[node.audioId] || {}
  if (take.src) return playRecordedVoice(take.src)
}

function syncAudioForNode(node, viewNode) {
  if (!audioEnabled) return
  playMusicForNode(node)
  playVoiceForNode(node)
}

function stopVoice() {
  voiceAudio.pause()
  voiceAudio.currentTime = 0
  restoreMusic()
}

function stopAllAudio() {
  stopVoice()
  clearInterval(musicFadeTimer)
  musicAudio.pause()
  musicAudio.currentTime = 0
  currentMusicKey = ''
}

ui.continue.addEventListener('click', () => showGame(storage.load()))
ui.newGame.addEventListener('click', () => storage.load() ? askRestart() : restart())
ui.homeButton.addEventListener('click', showHome)
ui.next.addEventListener('click', next)
ui.stepBack.addEventListener('click', stepBack)
ui.skipIntro.addEventListener('click', () => commit(engine.jump(story, state, 'a01')))
ui.replay.addEventListener('click', askRestart)
ui.restartButton.addEventListener('click', askRestart)
ui.evidenceButton.addEventListener('click', () => openDrawer('evidence'))
ui.charactersButton.addEventListener('click', () => openDrawer('characters'))
ui.statusButton.addEventListener('click', () => openDrawer('status'))
ui.glossaryButton.addEventListener('click', () => openDrawer('glossary'))
ui.drawerClose.addEventListener('click', closeDrawer)
ui.drawerMask.addEventListener('click', closeDrawer)
ui.archiveRevealContinue.addEventListener('click', () => hideArchiveReveal({ resume: true }))
ui.archiveRevealOpen.addEventListener('click', () => hideArchiveReveal({ openArchive: true }))
ui.confirm.addEventListener('close', () => { if (ui.confirm.returnValue === 'confirm') restart() })
ui.audioButton.addEventListener('click', () => {
  audioEnabled = !audioEnabled
  localStorage.setItem('audioEnabled', String(audioEnabled))
  ui.audioButton.textContent = audioEnabled ? '声' : '静'
  ui.audioButton.title = audioEnabled ? '关闭声音' : '开启声音'
  if (audioEnabled) {
    const node = story.nodes[state.currentId]
    syncAudioForNode(node, presentNode(node))
    showToast('声音已开启。')
  } else {
    stopAllAudio()
    showToast('声音已关闭。')
  }
})
window.addEventListener('keydown', event => {
  if (!ui.archiveReveal.classList.contains('hidden')) {
    if (event.key === 'Escape') hideArchiveReveal({ resume: true })
    return
  }
  if (event.key === 'Escape') closeDrawer()
  if ((event.key === 'Enter' || event.key === ' ') && event.target === document.body && !ui.game.classList.contains('hidden') && !ui.next.classList.contains('hidden')) next()
})

const errors = engine.validateStory(story)
if (errors.length) throw new Error(errors.join('\n'))
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(console.warn)
showHome()

