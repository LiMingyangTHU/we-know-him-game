import fs from 'node:fs'
import path from 'node:path'
import story from '../src/data/story.js'

// Each illustrated page is a separate composition. The photos are existing
// commissioned AI stills; the overlay is code-native so clues stay legible.
const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'assets', 'page-visuals')
fs.mkdirSync(outDir, { recursive: true })

const photo = name => `./assets/images/${name}`
const base = {
  intro01: photo('lin-phone-natural-v4.webp'), intro02: photo('cast-reference.webp'),
  intro03: photo('lin-phone-natural-v4.webp'), intro04: photo('scene-payment-hover-v7.webp'),
  q04intro: photo('scene-letter-compare-v7.webp'),
  a05: photo('liang-deadline-v2.webp'), a06: photo('lin-phone-natural-v4.webp'),
  q01: photo('scene-payment-hover-v7.webp'), b1a: photo('lin-final-edit-v3.webp'),
  b1a2: photo('liang-deadline-v2.webp'), b1a3: photo('liang-deadline-v2.webp'),
  b1b: photo('scene-payment-hover-v7.webp'),
  c05: photo('song-receipts-v2.webp'), c06: photo('sample-confirm.webp'),
  c08: photo('song-receipts-v2.webp'), c09: photo('song-receipts-v2.webp'),
  c10: photo('sample-confirm.webp'), c11: photo('song-receipts-v2.webp'),
  q02: photo('song-receipts-v2.webp'), b2a3: photo('song-lab.jpg'),
  b2b: photo('sample-confirm.webp'), b2b2: photo('song-receipts-v2.webp'),
  q03c: photo('song-lab.jpg'),
  q04: photo('scene-letter-compare-v7.webp'), q04a: photo('scene-letter-compare-v7.webp'),
  q04b: photo('official-replies-01-v1.webp'), q05b: photo('jiang-consent-v3.webp'),
  q06b: photo('shen-call.jpg'), q07a: photo('lin-final-edit-v3.webp'),
  q08ledger: photo('zhou-refund-v3.webp'), q08: photo('refund-ledger-01-v1.webp'),
  q08a: photo('zhou-refund-v3.webp'), q08b: photo('liang-deadline-v2.webp'),
  q09compare: photo('fake-video-compare-v1.webp'), q09a: photo('lin-final-edit-v3.webp'),
  q09b: photo('lin-final-edit-v3.webp'), q10a: photo('official-replies-02-v1.webp'),
  q10b: photo('lin-final-edit-v3.webp'), m01: photo('shen-call.jpg'),
  m01b: photo('ai-identity-check-v5.webp'), m01c: photo('shen-call.jpg'),
  m01d: photo('verify-official-v2.webp'), q11consent: photo('consent-interview-v5.webp'),
  q12intro: photo('lin-final-edit-v3.webp'),
  e2: photo('lin-final-edit-v3.webp'), e3: photo('lin-final-edit-v3.webp'),
  e6: photo('fake-video-compare-v1.webp')
}

const detail = {
  intro01: 'xu-salary-v5.webp', intro02: 'shen-lecture.jpg', intro03: 'lin-day.jpg',
  intro04: 'liang-deadline-v2.webp', a01b: 'lin-message-v2.webp',
  a05: 'lin-message-v2.webp', a06: 'xu-salary-v5.webp', q01: 'liang-deadline-v2.webp',
  b1a: 'lin-message-v2.webp', b1a2: 'lin-phone-natural-v4.webp',
  b1a3: 'liang-deadline-v2.webp', b1b: 'liang-deadline-v2.webp',
  c01: 'song-lab.jpg', c02b: 'song-receipts-v2.webp',
  c05: 'song-receipts-v2.webp', c06: 'shen-call.jpg', c07b: 'scene-courier-cctv-v7.webp',
  c08: 'sample-confirm.webp', c09: 'shen-lecture.jpg', c10: 'scene-courier-cctv-v7.webp',
  c11: 'song-receipts-v2.webp', q02: 'sample-confirm.webp',
  b2a: 'song-lab.jpg', b2a3: 'sample-confirm.webp', b2b: 'song-receipts-v2.webp',
  b2b2: 'verify-official-v2.webp',
  q03intro: 'xu-salary-v5.webp', q03voices: 'jiang-consent-v3.webp',
  q03: 'song-lab.jpg', q03a: 'scene-payment-hover-v7.webp',
  q03b: 'shen-call.jpg', q03c: 'song-receipts-v2.webp',
  q03all: 'shen-lecture.jpg', q04intro: 'scene-letter-compare-v7.webp',
  q04archive: 'archive-motion-02-v1.webp', q04: 'lu-archive-v3.webp',
  q04a: 'archive-motion-02-v1.webp', q04b: 'scene-letter-compare-v7.webp',
  q05b: 'shen-call.jpg', q06intro: 'scene-courier-cctv-v7.webp',
  q06registry: 'song-receipts-v2.webp', q06: 'sample-confirm.webp',
  q06a: 'song-lab.jpg', q06b: 'sample-confirm.webp',
  q07intro: 'scene-courier-cctv-v7.webp', q07name: 'scene-courier-cctv-v7.webp',
  q07: 'delivery-box-ref.webp', q07a: 'scene-courier-cctv-v7.webp',
  q07b: 'delivery-box-ref.webp', q08intro: 'refund-ledger-02-v1.webp',
  q08ledger: 'song-receipts-v2.webp', q08: 'zhou-refund-v3.webp',
  q08a: 'refund-ledger-01-v1.webp', q08b: 'zhou-refund-v3.webp',
  q09intro: 'lin-final-edit-v3.webp', q09compare: 'lin-fake-video-v3.webp',
  q09: 'lin-final-edit-v3.webp', q09a: 'fake-video-compare-v1.webp',
  q09b: 'lin-fake-video-v3.webp', q10intro: 'lu-replies-v3.webp',
  q10: 'lin-final-edit-v3.webp', q10a: 'lin-final-edit-v3.webp',
  q10b: 'official-replies-01-v1.webp', m01: 'ai-identity-check-v5.webp',
  m01b: 'shen-call.jpg', m01c: 'verify-official-v2.webp', m01d: 'shen-lecture.jpg',
  q11intro: 'jiang-consent-v3.webp', q11consent: 'song-receipts-v2.webp',
  q11: 'jiang-consent-v3.webp', q11a: 'victim-meeting.webp',
  q12intro: 'official-replies-02-v1.webp', q12cut: 'fake-video-compare-v1.webp',
  q12: 'lin-fake-video-v3.webp', e1: 'delivery-clue-02-v1.webp',
  e2: 'official-replies-02-v1.webp', e3: 'victim-meeting.webp',
  e4: 'jiang-consent-v3.webp', e5: 'lin-fake-video-v3.webp',
  e6: 'ai-identity-check-v5.webp'
}

const replacementVideos = new Set(['a05', 'c06', 'c08', 'c09', 'c10', 'm01', 'q12intro'])
const oldTextCards = new Set(['compare.jpg', 'end.jpg', 'fee.jpg', 'group.jpg', 'money.jpg', 'money2.jpg', 'preserve.jpg', 'q1.jpg', 'q2.jpg', 'safe1.jpg', 'safe2.jpg', 'wait1.jpg', 'wait2.jpg', 'warn.jpg'])
const safe = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c])
const imageData = file => {
  const absolute = path.join(root, file.replace(/^\.\//, ''))
  if (!fs.existsSync(absolute)) throw new Error(`Missing image: ${absolute}`)
  const ext = path.extname(file).slice(1).replace('jpg', 'jpeg')
  return `data:image/${ext};base64,${fs.readFileSync(absolute).toString('base64')}`
}

const plan = {}
let index = 0
for (const node of Object.values(story.nodes)) {
  const media = node.media || {}
  if (media.type === 'chat' || (media.type === 'video' && !replacementVideos.has(node.id))) continue
  const primary = base[node.id] || media.src
  if (!primary || oldTextCards.has(path.basename(primary))) throw new Error(`Unreviewed visual: ${node.id} -> ${primary}`)
  let inset = photo(detail[node.id] || (node.chapter === 1 ? 'lin-phone-natural-v4.webp' : node.chapter === 2 ? 'song-receipts-v2.webp' : node.chapter <= 5 ? 'lu-archive-v3.webp' : node.chapter <= 8 ? 'delivery-box-ref.webp' : 'lin-final-edit-v3.webp'))
  if (inset === primary) inset = photo(node.id.startsWith('c') || node.id.startsWith('b2') || node.id === 'q02' ? 'sample-confirm.webp' : node.id.startsWith('b1') ? 'lin-message-v2.webp' : 'scene-letter-compare-v7.webp')
  if (oldTextCards.has(path.basename(inset))) throw new Error(`Text-only inset: ${node.id}`)
  const title = safe(node.heading.replace(/^(?:Q\d{2}(?:\s*[A-C])?|E\d+)\s*[｜|]\s*/, '').replace(/^选择结果\s*[｜|]\s*/, ''))
  const label = node.kind === 'choice' ? '我该怎么做' : node.kind === 'ending' ? '事后记录' : node.kind === 'intro' ? '前情' : (node.source || '现场材料').replace(/林知夏.*/, '现场')
  const stage = String(index + 1).padStart(2, '0')
  const flip = index % 2 === 0
  const accent = ['#bd7d49', '#4f7982', '#748675', '#8e6c80'][index % 4]
  const mainData = imageData(primary)
  const insetData = imageData(inset)
  const insetX = flip ? 835 : 42
  const titleX = flip ? 46 : 632
  const gradientX = flip ? 0 : 1
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="${title}">
<defs><linearGradient id="shade" x1="${gradientX}" x2="${1-gradientX}"><stop stop-color="#081a20" stop-opacity=".78"/><stop offset=".43" stop-color="#081a20" stop-opacity=".1"/><stop offset="1" stop-color="#081a20" stop-opacity=".06"/></linearGradient><clipPath id="inset"><rect x="${insetX}" y="403" width="400" height="248" rx="4"/></clipPath></defs>
<image href="${mainData}" width="1280" height="720" preserveAspectRatio="xMidYMid slice"/><rect width="1280" height="720" fill="url(#shade)"/>
<rect x="${insetX-8}" y="395" width="416" height="264" rx="6" fill="#f4efe6" opacity=".94"/>
<image href="${insetData}" x="${insetX}" y="403" width="400" height="248" preserveAspectRatio="xMidYMid slice" clip-path="url(#inset)"/>
<rect x="${titleX}" y="51" width="6" height="30" rx="3" fill="${accent}"/>
<text x="${titleX+22}" y="73" fill="#f5ede2" font-family="Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="22" letter-spacing="2">${safe(label)}</text>
<text x="${titleX}" y="617" fill="#fff8ed" font-family="Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="34" font-weight="700" paint-order="stroke" stroke="#132127" stroke-opacity=".45" stroke-width="5">${title.length > 19 ? title.slice(0,19)+'…' : title}</text>
<text x="${titleX}" y="657" fill="#f3e9db" font-family="Georgia,serif" font-size="16" letter-spacing="4">CASE FILE / ${stage}</text>
</svg>`
  const name = `${node.id}.svg`
  fs.writeFileSync(path.join(outDir, name), svg)
  plan[node.id] = { type: 'image', src: `./assets/page-visuals/${name}`, alt: `${node.heading}的现场与线索画面` }
  index++
}
fs.writeFileSync(path.join(root, 'src', 'data', 'page-visuals.js'), `// Generated by scripts/build_page_visuals.mjs. Every illustrated node has its own composition.\nexport const pageVisuals = ${JSON.stringify(plan, null, 2)}\n`)
console.log(`Built ${index} distinct page visuals.`)

