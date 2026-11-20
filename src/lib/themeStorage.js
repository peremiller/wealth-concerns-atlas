// Theme persistence is optional: storage access can be denied in private or embedded contexts.
const THEME_KEY = 'wc-theme'

export function loadTheme(storageProvider = () => globalThis.localStorage) {
  try {
    return storageProvider()?.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveTheme(theme, storageProvider = () => globalThis.localStorage) {
  try {
    const storage = storageProvider()
    if (!storage || typeof storage.setItem !== 'function') return false
    storage.setItem(THEME_KEY, theme === 'dark' ? 'dark' : 'light')
    return true
  } catch {
    // Preserve the active in-memory theme when persistence is unavailable.
    return false
  }
}
