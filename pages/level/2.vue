<template>
  <div class="level-page">
    <div class="container level-page__inner">

      <!-- Back nav -->
      <div class="level-page__back">
        <NuxtLink to="/level/1" class="btn btn--ghost btn--sm">
          ← Level 01
        </NuxtLink>
        <span class="level-page__progress font-mono">Level 02 / 03</span>
      </div>

      <!-- Locked -->
      <div v-if="locked" class="alert alert--error">
        <span>Access denied — complete Level 01 first.</span>
        <NuxtLink to="/level/1" class="btn btn--ghost btn--sm" style="margin-left:auto">
          Go to Level 01
        </NuxtLink>
      </div>

      <template v-else>

        <!-- Header -->
        <div class="level-page__header">
          <p class="eyebrow">Runtime Integration</p>
          <h1 class="level-page__title font-title">
            Level 02 — Write the Plugin
          </h1>
          <p class="level-page__narrative">
            The composable works but calling it directly from components means re-initializing the tracker on every page. Wrap it in a Nuxt plugin so it boots once at app startup and is available everywhere via $signalTracker.
          </p>
        </div>

        <!-- Signal bar -->
        <!-- <SignalBar :percent="signalPercent" :correct="isCorrect" /> -->

        <!-- Plugin Validator panel -->
        <div class="test-panel card">
          <div class="test-panel__header font-mono">
            Plugin Validator
          </div>
          <div class="test-panel__cases">
            <div :class="['test-case', pluginChecks.composable ? 'test-case--pass' : 'test-case--fail']">
              <span class="test-case__icon">{{ pluginChecks.composable ? '✓' : '✗' }}</span>
              <span class="test-case__label">useSignalTracker() called</span>
              <span class="test-case__expect">— composable not called</span>
            </div>
            <div :class="['test-case', pluginChecks.setup ? 'test-case--pass' : 'test-case--fail']">
              <span class="test-case__icon">{{ pluginChecks.setup ? '✓' : '✗' }}</span>
              <span class="test-case__label">setup() function defined</span>
              <span class="test-case__expect">— setup missing</span>
            </div>
            <div :class="['test-case', pluginChecks.provide ? 'test-case--pass' : 'test-case--fail']">
              <span class="test-case__icon">{{ pluginChecks.provide ? '✓' : '✗' }}</span>
              <span class="test-case__label">provide: { signalTracker: ... }</span>
              <span class="test-case__expect">— tracker not provided</span>
            </div>
          </div>
        </div>

        <!-- Editor -->
        <div class="level-page__editor-wrap">
          <div class="level-page__editor-label font-mono">
            plugins/signal-tracker.ts
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

        <!-- Live Signal Tracker -->
        <div class="signal-tracker card">
          <div class="signal-tracker__header font-mono">Live Signal Tracker</div>
          <div class="signal-tracker__container">
            <div class="signal-tracker__bar-wrapper">
              <div class="signal-tracker__bar">
                <div
                  class="signal-tracker__fill"
                  :style="{
                    width: liveSignal + '%',
                    backgroundColor: getSignalColor(liveSignal),
                  }"
                />
              </div>
            </div>
            <div class="signal-tracker__status">
              <span class="signal-tracker__value">{{ Math.round(liveSignal) }}%</span>
              <span v-if="liveSignal < 40" class="status-critical">🔴 CRITICAL</span>
              <span v-else-if="liveSignal < 80" class="status-weak">🟠 WEAK</span>
              <span v-else class="status-strong">🟢 STRONG</span>
            </div>
          </div>
        </div>

        <!-- Hint -->
        <div v-if="showHint" class="alert alert--hint">
          <span>
            <strong>Hint:</strong> Call <code>useSignalTracker()</code> to get the tracker instance. Then use <code>useRouter()</code> to get the router. Chain <code>router.afterEach((to) => { ... })</code> to capture route changes. Finally, return an object with <code>provide: { signalTracker: tracker }</code> to make it available app-wide.
          </span>
        </div>

        <!-- Error feedback -->
        <div v-if="showError && !isCorrect" class="alert alert--error">
          <span>Plugin validation failed — check that you're calling the composable, wiring the router hook, and providing the tracker.</span>
        </div>

        <!-- Success -->
        <div v-if="isCorrect" class="alert alert--success">
          <span>✧ PLUGIN INITIALIZED — RUNTIME LAYER RESTORED ✧</span>
        </div>

        <!-- Success bridge -->
        <div v-if="isCorrect" class="bridge-box card">
          <p class="bridge-text">
            The plugin runs — but it's crashing on first load. useRouter() is being called before the router is ready. Another plugin owns the router, and signal-tracker is loading before it. Level 03 fixes this by declaring plugin dependencies.
          </p>
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
          <NuxtLink v-if="isCorrect" to="/level/3" class="btn btn--success">
            Continue to Level 03 →
          </NuxtLink>
        </div>

      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
const game = useGame()

const locked = computed(() => !game.canAccessLevel(2))

const BROKEN_CODE = `export default defineNuxtPlugin({
  name: 'signal-tracker',
  setup() {
    // TODO: call useSignalTracker to get the tracker instance
    // TODO: wire router.afterEach to call tracker.capture on each route change
    // TODO: provide it as 'signalTracker'
  },
})`

const CORRECT_CODE = `export default defineNuxtPlugin({
  name: "signal-tracker",
  setup() {
    const { tracker } = useSignalTracker();
    return {
      provide: { signalTracker: tracker },
    };
  },
});`

const userCode  = ref(BROKEN_CODE)
const isCorrect = ref(false)
const showError = ref(false)
const showHint  = ref(false)
const liveSignal = ref(75)

function normalize(s: string): string {
  return s
    .split('\n')
    .map(line => line.trim().replace(/;$/, ''))
    .filter(line => line.length > 0)
    .join('\n')
    .trim()
}

function getSignalColor(value: number): string {
  if (value < 40) return 'red'
  if (value < 80) return 'orange'
  return 'green'
}

const pluginChecks = computed(() => {
  const c = userCode.value
  return {
    composable: /useSignalTracker\s*\(\s*\)/.test(c),
    setup:      /setup\s*\(\s*\)/.test(c),
    provide:    /provide\s*:\s*\{\s*signalTracker\s*:/.test(c),
  }
})

const checkCount = computed(() => Object.values(pluginChecks.value).filter(Boolean).length)

const signalPercent = computed(() => {
  if (isCorrect.value) return 100
  return Math.round((checkCount.value / 3) * 80)
})

function checkAnswer() {
  if (normalize(userCode.value) === normalize(CORRECT_CODE)) {
    isCorrect.value = true
    showError.value = false
    game.completeLevel(2)
  } else {
    showError.value = true
  }
}

function resetCode() {
  userCode.value  = BROKEN_CODE
  showError.value = false
  showHint.value  = false
}

watch(isCorrect, (correct) => {
  if (correct) {
    liveSignal.value = 75
    const startTime = Date.now()
    const duration = 3000
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      liveSignal.value = 75 + (20 * progress)
      if (progress >= 1) {
        liveSignal.value = 95
        clearInterval(interval)
      }
    }, 30)
  }
}, { flush: 'post' })

onMounted(() => {
  if (game.isLevelComplete(2)) {
    isCorrect.value = true
    liveSignal.value = 95
  }
})

onMounted(() => {
  if (game.isLevelComplete(2)) {
    isCorrect.value = true
    userCode.value  = CORRECT_CODE
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

/* Test panel */
.test-panel__header {
  margin-bottom: 14px;
}

.test-panel__cases {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-case {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid transparent;
  font-size: 0.82rem;
}

.test-case--pass {
  background: var(--green-dim);
  border-color: rgba(95,201,148,0.25);
  color: var(--green);
}

.test-case--fail {
  background: rgba(232,90,74,0.08);
  border-color: rgba(232,90,74,0.2);
  color: #e85a4a;
}

.test-case__icon {
  font-size: 0.9rem;
  width: 16px;
  flex-shrink: 0;
}

.test-case__label {
  flex: 1;
}

.test-case__expect {
  font-size: 0.75rem;
}

/* Editor */
.level-page__editor-wrap {
  display: flex;
  flex-direction: column;
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

/* Signal tracker (live animation) */
.signal-tracker {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-tracker__header {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.signal-tracker__container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signal-tracker__bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-tracker__bar {
  width: 100%;
  height: 40px;
  border: 2px solid rgba(52, 211, 153, 0.5);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.signal-tracker__fill {
  height: 100%;
  transition: width 0.05s linear;
}

.signal-tracker__fill[style*="width: 100%"] {
  animation: none;
}

.signal-tracker__fill:not([style*="width: 100%"]) {
  animation: blink 0.5s infinite;
}

.signal-tracker__status {
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.signal-tracker__value {
  font-family: var(--mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gold);
  min-width: 60px;
  text-align: center;
}

.status-critical {
  color: #ef4444;
}

.status-weak {
  color: #f97316;
}

.status-strong {
  color: #22c55e;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
