import assert from 'node:assert/strict'
import * as engine from '../src/core/engine.js'
import story from '../src/data/story.js'

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
