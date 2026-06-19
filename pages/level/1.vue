<template>
  <div class="level-page">
    <div class="container level-page__inner">

      <!-- Back nav -->
      <div class="level-page__back">
        <NuxtLink to="/" class="btn btn--ghost btn--sm">
          ← Mission Control
        </NuxtLink>
        <span class="level-page__progress font-mono">Level 01 / 03</span>
      </div>

      <!-- Header -->
      <div class="level-page__header">
        <p class="eyebrow">Component Boot Failure</p>
        <h1 class="level-page__title font-title">
          Level 01 — Component Layer
        </h1>
        <p class="level-page__narrative">
          Voyager's onboard display is dark. The component controlling the
          signal readout is broken. Fix the vue script setup block. Remember:
          this is per-component reactivity, not a plugin. 
          Adjust the code in order to fix Reactivity.
          PS: Format variables as one-liner
        </p>
      </div>

      <!-- Signal bar -->
      <SignalBar :percent="signalPercent" :correct="isCorrect" />

      <!-- Editor -->
      <div class="level-page__editor-wrap">
        <div class="level-page__editor-label font-mono">
          <span class="text-orange">signal-readout.vue</span>
          <span class="text-muted" style="margin-left:auto; font-size:0.7rem;">
            Fix the script setup block
          </span>
        </div>
        <textarea
          v-model="userCode"
          class="code-editor"
          :class="{
            'code-editor--correct': isCorrect,
            'code-editor--error': showError,
          }"
          spellcheck="false"
          autocorrect="off"
          autocapitalize="off"
          :disabled="isCorrect"
          rows="12"
        />
      </div>

      <!-- Hint -->
      <div v-if="showHint" class="alert alert--hint">
        <span>Hint: ref() wraps a value so Vue can track changes. Without it, signalStrength++ updates the number but Vue never re-renders. computed() is like a formula — it re-runs automatically whenever its dependencies change. A plain ternary evaluates once at startup and never updates.</span>
      </div>

      <!-- Error feedback -->
      <div v-if="showError && !isCorrect" class="alert alert--error">
        <span>Reactivity error — the component display is still broken. Check that both ref() and computed() are used correctly.</span>
      </div>

      <!-- Success banner -->
      <div v-if="isCorrect" class="alert alert--success">
        <span>SIGNAL LOCKED — COMPONENT LAYER RESTORED. Proceeding to Plugin Bay…</span>
      </div>

      <!-- Actions -->
      <div class="level-page__actions">
        <button
          v-if="!isCorrect"
          class="btn btn--ghost"
          @click="showHint = !showHint"
        >
          {{ showHint ? 'Hide Hint' : 'Request Hint' }}
        </button>
        <button
          v-if="!isCorrect"
          class="btn btn--ghost"
          @click="resetCode"
        >
          Reset
        </button>
        <button
          v-if="!isCorrect"
          class="btn btn--primary"
          @click="checkAnswer"
        >
          ▶ Transmit Fix
        </button>
        <NuxtLink v-if="isCorrect" to="/level/2" class="btn btn--success">
          Continue to Level 02 →
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const game   = useGame()

const BROKEN_CODE = '<script setup>\nconst signalStrength = 0\nconst statusMessage = signalStrength >= 80 ? \'STRONG\' : \'WEAK\'\n</' + 'script>\n\n<template>\n  <div>\n    <p>Signal: {{ signalStrength }}%</' + 'p>\n    <p>Status: {{ statusMessage }}</' + 'p>\n    <button @click="signalStrength++">Boost Signal</' + 'button>\n  </' + 'div>\n</' + 'template>'

const CORRECT_CODE = '<script setup>\nconst signalStrength = ref(0)\nconst statusMessage = computed(() => signalStrength.value >= 80 ? \'STRONG\' : \'WEAK\')\n</' + 'script>\n\n<template>\n  <div>\n    <p>Signal: {{ signalStrength }}%</' + 'p>\n    <p>Status: {{ statusMessage }}</' + 'p>\n    <button @click="signalStrength++">Boost Signal</' + 'button>\n  </' + 'div>\n</' + 'template>'

const userCode     = ref(BROKEN_CODE)
const isCorrect    = ref(false)
const showError    = ref(false)
const showHint     = ref(false)

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

const signalPercent = computed(() => {
  if (isCorrect.value) return 100
  // rough partial credit: count how many correct lines the user has
  const userLines    = userCode.value.split('\n').map(l => l.trim())
  const correctLines = CORRECT_CODE.split('\n').map(l => l.trim())
  const matches = userLines.filter((l, i) => correctLines[i] === l).length
  return Math.round((matches / correctLines.length) * 80) // max 80 until fully correct
})

function checkAnswer() {
  if (normalize(userCode.value) === normalize(CORRECT_CODE)) {
    isCorrect.value = true
    showError.value = false
    game.completeLevel(1)
    setTimeout(() => router.push('/level/2'), 2000)
  } else {
    showError.value = true
  }
}

function resetCode() {
  userCode.value  = BROKEN_CODE
  showError.value = false
  showHint.value  = false
}

// Route guard: level 1 is always accessible
onMounted(() => {
  if (game.isLevelComplete(1)) {
    isCorrect.value = true
  }
})
</script>

<style scoped>
.level-page {
  flex: 1;
  padding: 48px 0 80px;
}

.level-page__inner {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.level-page__back {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.level-page__progress {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--muted);
  text-transform: uppercase;
}

.level-page__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-page__title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.01em;
}

.level-page__narrative {
  color: var(--muted);
  max-width: 580px;
  line-height: 1.7;
}

.level-page__editor-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.level-page__editor-label {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--navy-mid);
  border-bottom: 1px solid var(--border);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
}

.level-page__editor-wrap .code-editor {
  border: none;
  border-radius: 0;
}
.level-page__editor-wrap .code-editor:focus {
  border: none;
  outline: none;
}

.level-page__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn--sm {
  padding: 8px 16px;
  font-size: 0.75rem;
}
</style>
