// 声音与剧情分离：src 有值时优先播放录音；否则使用浏览器自然语音。
export const voiceProfiles = {
  '林知夏': { preferredVoices: ['Xiaoxiao Online', '晓晓', 'Xiaoxiao', 'Tingting', '婷婷'], rate: 1.02, pitch: 1.04, volume: 0.94 },
  '梁一舟': { preferredVoices: ['Yunxi Online', '云希', 'Yunxi', 'Sinji', 'Kangkang'], rate: 1.01, pitch: 1.02, volume: 0.96 },
  '宋岚': { preferredVoices: ['Xiaorui Online', '晓睿', 'Xiaoyi Online', '晓伊', 'Huihui'], rate: 0.94, pitch: 0.9, volume: 0.97 },
  '沈舟': { preferredVoices: ['Yunyang Online', '云扬', 'Yunjian Online', '云健', 'Yunxi'], rate: 0.96, pitch: 0.91, volume: 0.96 },
  '姜宁': { preferredVoices: ['Xiaoyi Online', '晓伊', 'Xiaoxiao Online', '晓晓', 'Tingting'], rate: 1.03, pitch: 1.08, volume: 0.94 },
  '许橙': { preferredVoices: ['Xiaoshuang Online', '晓双', 'Xiaoxiao Online', '晓晓', 'Tingting'], rate: 1.06, pitch: 1.13, volume: 0.94 },
  '陆鸣': { preferredVoices: ['Yunjian Online', '云健', 'Yunyang Online', '云扬', 'Kangkang'], rate: 1.05, pitch: 0.96, volume: 0.96 },
  '周衡': { preferredVoices: ['Yunze Online', '云泽', 'Yunyang Online', '云扬', 'Kangkang'], rate: 0.93, pitch: 0.84, volume: 0.97 },
  '唐遇': { preferredVoices: ['Yunxia Online', '云夏', 'Yunxi Online', '云希', 'Kangkang'], rate: 1.07, pitch: 1.0, volume: 0.95 }
}

// 后续录制完成可逐条填写 src，浏览器语音会自动让位。
export const takes = {
  a01: { speaker: '林知夏', src: '', durationMs: 0 },
  a02: { speaker: '梁一舟', src: '', durationMs: 0 },
  c02: { speaker: '宋岚', src: '', durationMs: 0 },
  c04: { speaker: '沈舟', src: '', durationMs: 0 },
  c06: { speaker: '沈舟', src: '', durationMs: 0 },
  c09: { speaker: '宋岚', src: '', durationMs: 0 }
}

export const musicTracks = {
  inquiry: { src: './assets/audio/bgm-inquiry.mp3', volume: 0.22 },
  pressure: { src: './assets/audio/bgm-pressure.mp3', volume: 0.2 },
  truth: { src: './assets/audio/bgm-truth.mp3', volume: 0.21 },
  aftermath: { src: './assets/audio/bgm-aftermath.mp3', volume: 0.19 }
}

export function musicKeyForNode(node) {
  if (!node) return 'inquiry'
  if (node.kind === 'ending') return 'aftermath'
  const questionNumber = Number(node.id?.match(/^q(\d{2})/)?.[1] || 0)
  if ((node.chapter || 0) >= 9 || questionNumber >= 9) return 'truth'
  if ((node.chapter || 0) >= 6 || questionNumber >= 6) return 'pressure'
  return 'inquiry'
}

export function voiceProfileForSpeaker(speaker = '') {
  return Object.entries(voiceProfiles).find(([name]) => speaker.includes(name))?.[1] || null
}

export const enabledByDefault = false
