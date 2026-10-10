import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import * as engine from '../src/core/engine.js'
import story from '../src/data/story.js'
import { glossary, notesForNode } from '../src/data/glossary.js'
import { presentNode } from '../src/data/player-copy.js'
import { characters } from '../src/data/characters.js'

assert.deepEqual(engine.validateStory(story), [])
assert.equal(story.questionCount, 12)
assert.equal(story.implementedQuestionCount, 12)
assert.equal(story.nodes.q05intro.media.type, 'chat')
assert.ok(story.nodes.q05intro.media.messages.some(message => message.text?.includes('临时周转一下嘛～')))
assert.ok(story.nodes.q05.media.messages.some(message => message.text?.includes('误差来源需要逐项排除。')))
assert.ok(story.nodes.q05.media.messages.some(message => message.text?.includes('现在转一下嘛～')))
assert.equal(story.nodes.c01.media.src, './assets/images/transition-lab-v6.webp')
assert.equal(story.nodes.q03intro.media.src, './assets/images/roundtable-player-v6.webp')
for (const id of ['a01', 'c01', 'q03intro', 'q04intro', 'q05intro', 'q06intro', 'q07intro', 'q08intro', 'q09intro', 'q10intro', 'm01', 'q11intro', 'q12intro']) {
  assert.ok(story.nodes[id].orientation?.route, `${id} missing transition route`)
  assert.ok(story.nodes[id].orientation?.goal, `${id} missing transition goal`)
}
assert.equal(story.nodes.c04.presentation.type, 'flashback')
assert.match(story.nodes.c04.presentation.note, /并非.*同期录像/)
assert.equal(story.nodes.c05.presentation.type, 'record')
assert.match(story.nodes.c05.heading, /回到现在/)
assert.equal(story.nodes.c07.presentation.type, 'playback')
assert.match(story.nodes.c07.presentation.note, /退出回忆/)
assert.equal(new Set(glossary.map(item => item.id)).size, glossary.length)
assert.ok(glossary.length >= 30)
glossary.forEach(item => assert.ok(story.nodes[item.unlock], `glossary ${item.id} has missing unlock node ${item.unlock}`))
assert.deepEqual(notesForNode('a03').map(item => item.id), ['phase-one', 'phase-two', 'zhou-xingqiao'])
for (const required of ['old-film', 'liang', 'shen', 'song', 'xu', 'jiang', 'lu', 'tang', 'digital-double', 'publication-consent']) {
  assert.ok(glossary.some(item => item.id === required), `missing first-appearance explanation: ${required}`)
}
const outOfGamePhrases = /玩家当前|本幕需要|需要继续核对|不能单独证明|无剧透说明/
glossary.forEach(item => assert.doesNotMatch(item.text, outOfGamePhrases, `out-of-game wording in ${item.id}`))

const productionCodes = /(?:Q\d{2}|E\d+)/
const productionWording = /玩家|本轮结局|游戏内演示|选择结果|待导入/
const obsoletePhaseShorthand = /一期|二期/
const colloquialMoney = /十三万八|九万四千二|七万五千六|四万三千八|一万八千六|一万二/
const allowedVoice = /^(林知夏|梁一舟|宋岚|沈舟|许橙|姜宁|陆鸣|周衡|唐遇|视频里的沈舟)/
for (const node of Object.values(story.nodes)) {
  const view = presentNode(node)
  for (const [field, value] of Object.entries({ heading: view.heading, speaker: view.speaker, source: view.source, text: view.text, education: view.education })) {
    if (!value) continue
    assert.doesNotMatch(value, productionCodes, `${node.id}.${field} leaks an internal route code`)
    assert.doesNotMatch(value, productionWording, `${node.id}.${field} uses production-facing wording`)
    assert.doesNotMatch(value, obsoletePhaseShorthand, `${node.id}.${field} uses ambiguous phase shorthand`)
    assert.doesNotMatch(value, colloquialMoney, `${node.id}.${field} uses a colloquial money amount`)
  }
  for (const option of node.options || []) {
    assert.doesNotMatch(option.text, obsoletePhaseShorthand, `${node.id} option uses ambiguous phase shorthand`)
    assert.doesNotMatch(option.text, colloquialMoney, `${node.id} option uses a colloquial money amount`)
  }
  for (const message of view.media?.messages || []) {
    const value = `${message.text || ''}${message.attachment?.title || ''}${message.attachment?.note || ''}`
    assert.doesNotMatch(value, obsoletePhaseShorthand, `${node.id} chat uses ambiguous phase shorthand`)
    assert.doesNotMatch(value, colloquialMoney, `${node.id} chat uses a colloquial money amount`)
  }
  for (const [field, value] of Object.entries({ orientationKicker: view.orientation?.kicker, orientationRoute: view.orientation?.route, orientationGoal: view.orientation?.goal, mediaAlt: view.media?.alt })) {
    if (!value) continue
    assert.doesNotMatch(value, productionCodes, `${node.id}.${field} leaks an internal route code`)
    assert.doesNotMatch(value, productionWording, `${node.id}.${field} uses production-facing wording`)
  }
  assert.match(view.speaker || '', allowedVoice, `${node.id} has no in-world voice: ${view.speaker}`)
  if (node.kind === 'choice') {
    assert.doesNotMatch(view.heading, /你/, `${node.id} heading is not in Lin Zhixia's perspective`)
    assert.doesNotMatch(view.text, /你/, `${node.id} question is not in Lin Zhixia's perspective`)
  }
  if (node.kind === 'ending') {
    assert.match(view.text, /我/, `${node.id} ending is not Lin Zhixia's recollection`)
    assert.match(view.education, /我/, `${node.id} ending reflection is not Lin Zhixia's voice`)
  }
}
assert.match(story.nodes.c02b.text, /7\.56万元.*1\.86万元.*9\.42万元/)
assert.match(story.nodes.c11.text, /13\.8万元.*7\.56万元.*1\.86万元.*9\.42万元.*4\.38万元/)
assert.equal(presentNode(story.nodes.q01).heading, '旧片的新名字')
assert.equal(presentNode(story.nodes.b1a3).heading, '梁一舟暂停付款')
assert.equal(presentNode(story.nodes.e1).heading, '看见隐形人')
assert.equal(presentNode(story.nodes.q04intro).media.frames.length, 2)
assert.equal(presentNode(story.nodes.q07intro).media.frames.length, 2)
assert.equal(presentNode(story.nodes.q08intro).media.frames.length, 2)
assert.equal(presentNode(story.nodes.q10intro).media.frames.length, 2)
const stills = Object.values(story.nodes).map(presentNode).filter(node => node.media?.type === 'image')
assert.equal(new Set(stills.map(node => node.media.src)).size, stills.length, 'illustrated pages must have distinct compositions')
for (const node of stills) {
  assert.match(node.media.src, /^\.\/assets\/page-visuals\/[\w-]+\.svg$/, `${node.id} has no page-specific visual`)
  assert.ok(fs.existsSync(path.resolve(node.media.src)), `${node.id} visual is missing`)
}
const mechanicalSummary = /把昨天有资格和今天有权限拆分开|过去是真的.*今天仍有权|交换速度|信息代价|核验路径|留在边界外/
for (const node of Object.values(story.nodes)) {
  const view = presentNode(node)
  assert.doesNotMatch(`${view.heading}${view.text}${view.education || ''}`, mechanicalSummary, `${node.id} retains mechanical summary wording`)
}
characters.forEach(person => {
  assert.doesNotMatch(`${person.role}${person.known}`, productionWording, `${person.id} profile uses production-facing wording`)
  assert.doesNotMatch(`${person.role}${person.known}`, obsoletePhaseShorthand, `${person.id} profile uses ambiguous phase shorthand`)
  assert.doesNotMatch(`${person.role}${person.known}`, colloquialMoney, `${person.id} profile uses a colloquial money amount`)
  assert.match(person.known, /我/, `${person.id} profile is not written from Lin Zhixia's perspective`)
})
glossary.forEach(item => {
  assert.doesNotMatch(`${item.category}${item.title}${item.text}`, obsoletePhaseShorthand, `${item.id} glossary entry uses ambiguous phase shorthand`)
  assert.doesNotMatch(`${item.category}${item.title}${item.text}`, colloquialMoney, `${item.id} glossary entry uses a colloquial money amount`)
})

let undoState = engine.createState(story.startId, story)
while (undoState.currentId !== 'q01') undoState = engine.advance(story, undoState)
const beforeChoice = structuredClone(undoState)
const afterChoice = engine.choose(story, undoState, 'A')
assert.equal(afterChoice.flags.PREWARN, 1)
assert.ok(afterChoice.undoSnapshot)
const rolledBack = engine.back(story, afterChoice)
assert.equal(rolledBack.currentId, beforeChoice.currentId)
assert.deepEqual(rolledBack.flags, beforeChoice.flags)
assert.deepEqual(rolledBack.choices, beforeChoice.choices)
assert.deepEqual(rolledBack.evidence, beforeChoice.evidence)
assert.equal(rolledBack.undoLocked, true)
assert.deepEqual(engine.back(story, rolledBack), rolledBack, 'cannot step back twice consecutively')
const replayed = engine.choose(story, rolledBack, 'B')
assert.equal(replayed.flags.PREWARN, 0)
assert.ok(replayed.undoSnapshot, 'moving forward unlocks one new step back')

const counts = { E1: 0, E2: 0, E3: 0, E4: 0, E5: 0, E6: 0 }
const reachedNodes = new Set()
let routeCount = 0

function walk(state, depth = 0) {
  assert.ok(depth < 180, `route exceeded depth at ${state.currentId}`)
  reachedNodes.add(state.currentId)
  const node = story.nodes[state.currentId]
  assert.ok(node, `missing node ${state.currentId}`)
  if (node.kind === 'ending') {
    routeCount += 1
    assert.equal(state.completed, true)
    assert.equal(state.ending, node.endingId)
    assert.equal(engine.resolveEnding(state.choices), node.endingId)
    assert.equal(new Set(state.evidence.map(item => item.id)).size, state.evidence.length)
    counts[node.endingId] += 1
    return
  }
  if (node.kind === 'choice') {
    node.options.forEach(option => walk(engine.choose(story, state, option.letter), depth + 1))
    return
  }
  walk(engine.advance(story, state), depth + 1)
}

walk(engine.createState(story.startId, story))

assert.equal(routeCount, 6144)
assert.deepEqual(counts, { E1: 96, E2: 1440, E3: 1536, E4: 1536, E5: 1152, E6: 384 })

const unreachable = Object.keys(story.nodes).filter(id => !reachedNodes.has(id))
assert.deepEqual(unreachable, [], `unreachable nodes: ${unreachable.join(', ')}`)

console.log(`web engine: ${routeCount} routes passed; endings ${JSON.stringify(counts)}; ${reachedNodes.size} nodes reachable`)
