// 音频层与剧情层解耦。生成自然配音后，只需填写src和durationMs。
// 播放器在src为空时继续显示文字，不会阻断游戏。
const takes = {
  a01: { speaker: '林知夏', src: '', durationMs: 0 },
  a02: { speaker: '梁一舟', src: '', durationMs: 0 },
  c02: { speaker: '宋岚', src: '', durationMs: 0 },
  c04: { speaker: '沈舟', src: '', durationMs: 0 },
  c06: { speaker: '沈舟', src: '', durationMs: 0 },
  c09: { speaker: '宋岚', src: '', durationMs: 0 }
}

export { takes }
export const ambient = ''
export const enabledByDefault = false
