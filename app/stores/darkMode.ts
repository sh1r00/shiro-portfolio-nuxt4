export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = ref(false)

  function initialize() {
    if (typeof document === 'undefined') return
    const darkMode = useCookie('darkMode', { maxAge: 60 * 60 * 24 * 365 })
    isDark.value = darkMode.value === 'true'
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function toggle() {
    isDark.value = !isDark.value
    if (typeof document === 'undefined') return
    const darkMode = useCookie('darkMode', { maxAge: 60 * 60 * 24 * 365 })
    darkMode.value = String(isDark.value)
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, initialize, toggle }
})
