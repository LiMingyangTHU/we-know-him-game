import assert from 'node:assert/strict'
import * as engine from '../src/core/engine.js'
import story from '../src/data/story.js'

assert.deepEqual(engine.validateStory(story), [])
assert.equal(story.questionCount, 12)
assert.equal(story.implementedQuestionCount, 12)

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
