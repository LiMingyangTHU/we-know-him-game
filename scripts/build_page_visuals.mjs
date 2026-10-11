import fs from 'node:fs'
import path from 'node:path'
import story from '../src/data/story.js'

// One story-matched still per illustrated page. Chat and video scenes keep
// their native presentation; no photo insets or slideshow frames are added.
const root = path.resolve(import.meta.dirname, '..')
const photo = name => `./assets/images/${name}`
const selected = {
  intro01: 'lin-phone-natural-v4.webp', intro02: 'lin-final-edit-v3.webp',
  intro03: 'lin-day.jpg', intro04: 'scene-payment-hover-v7.webp',
  a01b: 'lin-phone-natural-v4.webp', a05: 'lin-message-v2.webp',
  a06: 'lin-old-new-compare-v1.webp', q01: 'scene-payment-hover-v7.webp',
  b1a: 'lin-day.jpg', b1a2: 'lin-message-v2.webp',
  b1a3: 'liang-deadline-v2.webp', b1b: 'liang-dorm.jpg',
  c05: 'song-receipts-v2.webp', c06: 'shen-call.jpg',
  c08: 'song-lab.jpg', c09: 'song-receipts-v2.webp', c10: 'sample-confirm.webp',
  c11: 'song-receipts-v2.webp', q02: 'song-receipts-v2.webp',
  b2a3: 'song-stop-handover-v1.webp', b2b: 'song-receipts-v2.webp',
  b2b2: 'verify-official-v2.webp',
  q03: 'roundtable-player-v6.webp', q03c: 'song-lab.jpg', q04intro: 'xu-salary-v5.webp',
  q04: 'archive-motion-02-v1.webp', q04a: 'archive-motion-01-v1.webp',
  q04b: 'lin-message-v2.webp', q05b: 'jiang-consent-v3.webp',
  q06a: 'song-stop-handover-v1.webp', q06b: 'song-delay-handover-v1.webp', q07intro: 'evidence-wall-v5.webp',
  q07name: 'lu-archive-v3.webp', q07: 'delivery-clue-02-v1.webp', q07a: 'delivery-clue-01-v1.webp',
  q08ledger: 'refund-ledger-02-v1.webp', q08: 'zhou-refund-v3.webp',
  q08a: 'refund-ledger-01-v1.webp',
  q09compare: 'fake-video-compare-v1.webp',
  q09a: 'fake-video-compare-v1.webp', q09b: 'lin-report-platform-v1.webp',
  q10intro: 'two-replies-pending-v1.webp', q10: 'two-replies-pending-v1.webp',
  q10a: 'official-replies-01-v1.webp', q10b: 'lin-final-edit-v3.webp',
  m01: 'shen-call.jpg', m01b: 'ai-identity-check-v5.webp',
  m01c: 'shen-call.jpg', m01d: 'liang-deadline-v2.webp',
  q11consent: 'song-consent-close-v1.webp', q11a: 'jiang-consent-v3.webp',
  q11a_anon: 'song-consent-close-v1.webp', q12intro: 'song-night-call-v1.webp',
  q12cut: 'lin-edit-timeline-v1.webp',
  e2: 'official-replies-02-v1.webp', e3: 'lin-final-edit-v3.webp',
  e6: 'lin-fake-video-v3.webp'
}

const replacementVideos = new Set(['a05', 'c06', 'c08', 'c09', 'c10', 'm01', 'q12intro'])
const uiChatScenes = new Set(['q08b'])
const oldTextCards = new Set(['compare.jpg', 'end.jpg', 'fee.jpg', 'group.jpg', 'money.jpg', 'money2.jpg', 'preserve.jpg', 'q1.jpg', 'q2.jpg', 'safe1.jpg', 'safe2.jpg', 'wait1.jpg', 'wait2.jpg', 'warn.jpg'])
// Alt text describes what is visible. Reused stills keep the same description.
const visualAlts = {
  'lin-phone-natural-v4.webp': '林知夏在校园媒体办公室查看手机',
  'lin-message-v2.webp': '林知夏在剪辑桌旁看手机消息',
  'lin-old-new-compare-v1.webp': '林知夏对比旧片的两张宣传截图',
  'scene-payment-hover-v7.webp': '报名付款页停在确认前',
  'lin-day.jpg': '林知夏坐在校园媒体办公室查看消息',
  'liang-deadline-v2.webp': '梁一舟在宿舍看着手机犹豫',
  'liang-dorm.jpg': '梁一舟坐在宿舍查看报名信息',
  'transition-lab-v6.webp': '校园材料实验室的走廊与门口',
  'song-receipts-v2.webp': '宋岚的检测合同和付款回执铺在桌上',
  'shen-call.jpg': '手机屏幕上的沈舟视频通话',
  'runner-box-v2.webp': '跑腿员带着样品盒出现在实验室门口',
  'song-lab.jpg': '宋岚在实验室核对材料',
  'sample-confirm.webp': '样品盒与尚未确认的交接文件',
  'verify-official-v2.webp': '实验台旁的官网核验页面和电话',
  'lin-final-edit-v3.webp': '林知夏在媒体办公室的剪辑台前工作',
  'roundtable-player-v6.webp': '林知夏在活动室听取当事人的讲述',
  'victim-meeting.webp': '3位当事人在活动室围桌交谈',
  'xu-salary-v5.webp': '许橙展示第1期实习的工资记录',
  'jiang-consent-v3.webp': '姜宁把打码聊天记录交给林知夏查看',
  'lu-archive-v3.webp': '陆鸣在档案室整理活动资料',
  'archive-motion-02-v1.webp': '双手拼合一份被裁切的合作函',
  'archive-motion-01-v1.webp': '档案室里有人翻看原始函件',
  'ai-identity-check-v5.webp': '视频通话与线下交接画面并排核对',
  'song-stop-handover-v1.webp': '宋岚在实验室封存样品并停止交接',
  'song-delay-handover-v1.webp': '宋岚继续核对承诺，样品盒仍未封存',
  'evidence-wall-v5.webp': '多处现场照片铺在调查资料墙上',
  'delivery-clue-02-v1.webp': '照片里几只配送箱的反光条细节',
  'delivery-clue-01-v1.webp': '资料墙上标出不同地点的同一只配送箱',
  'zhou-refund-v3.webp': '周衡在咖啡馆拿出一份退款清单',
  'refund-ledger-02-v1.webp': '退款清单上标出的两条资金路径',
  'refund-ledger-01-v1.webp': '咖啡馆里一份退款清单被推到桌前',
  'lin-fake-video-v3.webp': '林知夏查看一段借用她面孔的假视频',
  'fake-video-compare-v1.webp': '林知夏在剪辑台比对两段视频素材',
  'official-replies-02-v1.webp': '电脑上显示来自3个机构的回复',
  'official-replies-01-v1.webp': '傍晚的剪辑桌上打开3封正式回复',
  'two-replies-pending-v1.webp': '桌上只有企业和学校两封书面回复，第三封仍待到达',
  'song-consent-close-v1.webp': '宋岚在授权清单上指出可公开的材料',
  'song-night-call-v1.webp': '深夜实验室里宋岚按住催缴电话，样品盒还在桌上',
  'lin-report-platform-v1.webp': '林知夏在平台举报页面提交冒名视频',
  'lin-edit-timeline-v1.webp': '林知夏在23点重新整理旧片与收费项目的剪辑时间线',
  'consent-interview-v5.webp': '林知夏向当事人确认公开材料的范围',
  'ending-clear-v5.webp': '调查结束后桌上留着整理好的材料',
  'ending-witness-exit-v5.webp': '当事人离开后空下的采访座位'
}
const plan = {}
for (const node of Object.values(story.nodes)) {
  const media = node.media || {}
  if (media.type === 'chat' || uiChatScenes.has(node.id) || (media.type === 'video' && !replacementVideos.has(node.id))) continue
  const src = selected[node.id] ? photo(selected[node.id]) : media.src
  if (!src || oldTextCards.has(path.basename(src))) throw new Error(`Unreviewed visual: ${node.id} -> ${src}`)
  if (!fs.existsSync(path.join(root, src.replace(/^\.\//, '')))) throw new Error(`Missing visual: ${node.id} -> ${src}`)
  const alt = visualAlts[path.basename(src)]
  if (!alt) throw new Error(`Missing descriptive alt: ${node.id} -> ${src}`)
  plan[node.id] = { type: 'image', src, alt }
}
fs.writeFileSync(path.join(root, 'src', 'data', 'page-visuals.js'), `// Generated by scripts/build_page_visuals.mjs. One story-matched still per illustrated page.\nexport const pageVisuals = ${JSON.stringify(plan, null, 2)}\n`)
console.log(`Mapped ${Object.keys(plan).length} illustrated pages to single stills.`)
