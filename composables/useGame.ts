/**
 * useGame — shared game state stored in localStorage.
 * Safe for SSR: localStorage is only accessed inside onMounted / client-side guards.
 */

const STORAGE_KEY = 'frontend-aliens-progress'

interface GameState {
  completedLevels: number[]
  currentLevel: number
}

function loadState(): GameState {
  if (typeof window === 'undefined') {
    return { completedLevels: [], currentLevel: 1 }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as GameState
  } catch {
    // ignore parse errors
  }
  return { completedLevels: [], currentLevel: 1 }
}

function saveState(state: GameState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

// Module-level reactive state so all components share the same instance.
const completedLevels = ref<number[]>([])
const currentLevel    = ref<number>(1)
let   hydrated        = false

export function useGame() {
  // Hydrate once from localStorage when first called on the client.
  onMounted(() => {
    if (!hydrated) {
      const stored = loadState()
      completedLevels.value = stored.completedLevels
      currentLevel.value    = stored.currentLevel
      hydrated = true
    }
  })

  function isLevelComplete(n: number): boolean {
    return completedLevels.value.includes(n)
  }

  function completeLevel(n: number): void {
    if (!completedLevels.value.includes(n)) {
      completedLevels.value.push(n)
    }
    // Advance currentLevel pointer
    currentLevel.value = Math.max(currentLevel.value, n + 1)
    saveState({ completedLevels: completedLevels.value, currentLevel: currentLevel.value })
  }

  function resetGame(): void {
    completedLevels.value = []
    currentLevel.value    = 1
    hydrated = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function canAccessLevel(n: number): boolean {
    if (n === 1) return true
    return completedLevels.value.includes(n - 1)
  }

  return {
    completedLevels: readonly(completedLevels),
    currentLevel:    readonly(currentLevel),
    isLevelComplete,
    completeLevel,
    resetGame,
    canAccessLevel,
  }
}
