// Track system restoration state globally — used by finale puzzle and starfield

const systemRestored = ref(false)

export function useSystemRestoration() {
  function triggerRestoration() {
    systemRestored.value = true
  }

  function reset() {
    systemRestored.value = false
  }

  return {
    systemRestored: readonly(systemRestored),
    triggerRestoration,
    reset,
  }
}
