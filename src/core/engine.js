export const DEFAULT_FLAGS = {
  PREWARN: null, EARLY: null, JOB: null, TRUST: null, RESEARCH: null,
  HIDDEN: null, CLEAR: null, FAKE: null, VERIFY: null, SAFE: null
}

export function createState(startId, story) {
  return {
    currentId: startId,
    flags: { ...DEFAULT_FLAGS },
    choices: {},
    evidence: [],
    visited: [startId],
    history: [],
    progress: story?.nodes?.[startId]?.progress || 0,
    completed: false,
    ending: null,
    archiveAnnounced: [],
    undoSnapshot: null,
    undoLocked: false
  }
}

function addUnique(list, values) {
  const output = list.slice()
  ;(values || []).forEach(item => {
    if (!output.some(existing => existing.id === item.id)) output.push(item)
  })
  return output
}

function applyEffects(state, effects) {
  const next = { ...state, flags: { ...state.flags } }
  if (!effects) return next
  Object.keys(effects.flags || {}).forEach(key => { next.flags[key] = effects.flags[key] })
  next.evidence = addUnique(state.evidence, effects.evidence)
  return next
}

function snapshot(state) {
  return {
    currentId: state.currentId,
    flags: { ...state.flags },
    choices: { ...state.choices },
    evidence: state.evidence.slice(),
    visited: state.visited.slice(),
    history: state.history.slice(),
    progress: state.progress,
    completed: state.completed,
    ending: state.ending,
    archiveAnnounced: (state.archiveAnnounced || []).slice(),
    undoSnapshot: null,
    undoLocked: true
  }
}

function moveTo(story, state, targetId, undoSource = state) {
  if (!story.nodes[targetId]) throw new Error(`Missing target node: ${targetId}`)
  const next = { ...state }
  next.history = state.history.concat(state.currentId)
  next.currentId = targetId
  next.visited = state.visited.concat(targetId)
  next.progress = Math.max(state.progress || 0, story.nodes[targetId].progress || 0)
  next.undoSnapshot = snapshot(undoSource)
  next.undoLocked = false
  const entered = applyEffects(next, story.nodes[targetId].onEnter)
  if (story.nodes[targetId].kind === 'ending') {
    entered.completed = true
    entered.ending = story.nodes[targetId].endingId || targetId.toUpperCase()
    entered.progress = 100
  }
  return entered
}

export function advance(story, state) {
  const node = story.nodes[state.currentId]
  if (!node) throw new Error(`Missing current node: ${state.currentId}`)
  if (node.kind === 'choice') throw new Error('Choice node requires choose()')
  if (!node.next) return { ...state, completed: true }
  return moveTo(story, state, node.next)
}

export function choose(story, state, letter) {
  const node = story.nodes[state.currentId]
  if (!node || node.kind !== 'choice') throw new Error('Current node is not a choice')
  const option = node.options.find(item => item.letter === letter)
  if (!option) throw new Error(`Unknown choice ${letter} for ${node.id}`)
  let next = applyEffects(state, option.effects)
  next.choices = { ...state.choices, [node.questionId]: letter }
  const target = option.next === '$ENDING' ? resolveEnding(next.choices)?.toLowerCase() : option.next
  if (!target) throw new Error(`No ending resolved after ${node.id}.${letter}`)
  return moveTo(story, next, target, state)
}

export function jump(story, state, targetId) {
  return moveTo(story, state, targetId)
}

export function back(story, state) {
  if (!state.undoSnapshot || state.undoLocked) return state
  return {
    ...state.undoSnapshot,
    archiveAnnounced: (state.archiveAnnounced || []).slice(),
    undoSnapshot: null,
    undoLocked: true
  }
}

export function resolveEnding(choices) {
  if (choices.Q11 === 'B') return 'E4'
  if (choices.Q11 === 'A' && choices.Q12 === 'B') return 'E3'
  if (choices.Q11 === 'A' && choices.Q12 === 'C' && choices.Q08 === 'B' && choices.Q09 === 'B') return 'E6'
  if (choices.Q11 === 'A' && choices.Q12 === 'C') return 'E5'
  if (choices.Q11 === 'A' && choices.Q12 === 'A' && choices.Q01 === 'A' && choices.Q02 === 'A' && choices.Q07 === 'B' && choices.Q08 === 'A') return 'E1'
  if (choices.Q11 === 'A' && choices.Q12 === 'A') return 'E2'
  return null
}

export function validateStory(story) {
  const errors = []
  const ids = Object.keys(story.nodes)
  if (!story.nodes[story.startId]) errors.push(`startId不存在: ${story.startId}`)
  ids.forEach(id => {
    const node = story.nodes[id]
    if (node.id !== id) errors.push(`节点键与id不一致: ${id}`)
    if (node.next && !story.nodes[node.next]) errors.push(`${id}.next不存在: ${node.next}`)
    ;(node.options || []).forEach(option => {
      if (option.next !== '$ENDING' && !story.nodes[option.next]) errors.push(`${id}.${option.letter}目标不存在: ${option.next}`)
    })
  })
  return errors
}
