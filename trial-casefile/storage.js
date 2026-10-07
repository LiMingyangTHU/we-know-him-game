export const KEY = 'weKnowHim.casefileTrial.save.v1'

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('读取试行版存档失败', error)
    return null
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
    return true
  } catch (error) {
    console.warn('保存试行版存档失败', error)
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
