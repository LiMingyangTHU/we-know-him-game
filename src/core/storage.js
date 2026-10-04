export const KEY = 'weKnowHim.web.save.v5'

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('读取存档失败', error)
    return null
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
    return true
  } catch (error) {
    console.warn('保存存档失败', error)
    return false
  }
}

export function clear() {
  try {
    localStorage.removeItem(KEY)
    return true
  } catch (error) {
    return false
  }
}
