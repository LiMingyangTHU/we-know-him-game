import { generatedTakes } from './generated-voice-takes.js?v=22'

// 只播放已经过后期处理的静态成品，不再调用设备自带朗读。
export const takes = generatedTakes

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

export const enabledByDefault = false
