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
        <p class="eyebrow">Architecture Layer One</p>
        <h1 class="level-page__title font-title">
          Level 01 — Write the Composable
        </h1>
        <p class="level-page__narrative">
          The signal tracker logic exists but isn't wired up. Write the useSignalTracker composable that reads the config and initializes the tracker. This is pure business logic — no Nuxt awareness yet.
        </p>
      </div>

      <!-- Signal bar -->
      <!-- <SignalBar :percent="signalPercent" :correct="isCorrect" /> -->

      <!-- Signal tracker demo (visual feedback) -->
      <div class="signal-demo card">
        <div class="signal-demo__header font-mono">Live Signal Tracker</div>
        <div class="signal-demo__container">
          <div class="signal-demo__controls">
            <button class="btn btn--sm btn--ghost" @click="demoSignal = Math.max(0, demoSignal - 10)">
              − Weaken
            </button>
            <div class="signal-demo__value">{{ demoSignal }}%</div>
            <button class="btn btn--sm btn--ghost" @click="demoSignal = Math.min(100, demoSignal + 10)">
              Strengthen +
            </button>
          </div>
          <div class="signal-demo__bar-wrapper">
            <div class="signal-demo__bar">
              <div
                class="signal-demo__fill"
                :style="{
                  width: demoSignal + '%',
                  backgroundColor: getDemoColor(demoSignal),
                  animation: demoSignal < 20 ? 'blink 0.5s infinite' : ''
                }"
              />
            </div>
          </div>
          <div class="signal-demo__status">
            <span v-if="demoSignal < 40" class="status-critical">🔴 CRITICAL</span>
            <span v-else-if="demoSignal < 80" class="status-weak">🟠 WEAK</span>
            <span v-else class="status-strong">🟢 STRONG</span>
            <span v-if="demoSignal < 20" class="status-blinking">BLINKING</span>
          </div>
        </div>
      </div>

      <!-- Validator panel -->
      <div class="test-panel card">
        <div class="test-panel__header font-mono">
          Composable Validator
        </div>
        <div class="test-panel__cases">
          <div
            v-for="(check, key) in composableChecks"
            :key="key"
            class="test-case"
            :class="check ? 'test-case--pass' : 'test-case--fail'"
          >
            <span class="test-case__icon">{{ check ? '✓' : '✗' }}</span>
            <span class="test-case__label">
              <span v-if="key === 'endpoint'">config.public.signalEndpoint</span>
              <span v-else-if="key === 'init'">signalTracker.init({ ... })</span>
              <span v-else-if="key === 'returned'">return { tracker }</span>
            </span>
            <span class="test-case__expect">
              <span v-if="key === 'endpoint'">— endpoint not read</span>
              <span v-else-if="key === 'init'">— tracker not initialized</span>
              <span v-else-if="key === 'returned'">— tracker not returned</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div class="level-page__editor-wrap">
        <div class="level-page__editor-label font-mono">
          composables/useSignalTracker.ts
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
        <span>
          <strong>Hint:</strong> The composable receives no parameters. First, use <code>useRuntimeConfig()</code> to access the runtime config. Then read the <code>config.public.signalEndpoint</code> property. Next, call <code>signalTracker.init({ endpoint, source: 'voyager-1' })</code> to initialize the tracker. Finally, return an object with the tracker.
        </span>
      </div>

      <!-- Error feedback -->
      <div v-if="showError && !isCorrect" class="alert alert--error">
        <span>The composable is incomplete. Check that you're reading the config, initializing the tracker with the correct parameters, and returning it.</span>
      </div>

      <!-- Success banner -->
      <div v-if="isCorrect" class="alert alert--success">
        <span>✧ COMPOSABLE READY — LOGIC LAYER RESTORED ✧</span>
      </div>

      <!-- Success bridge -->
      <div v-if="isCorrect" class="bridge-box card">
        <p class="bridge-text">
          The composable is working — it holds the pure business logic. But calling it directly from a component means re-initializing the tracker on every page load. That's inefficient and breaks singleton state. Level 02 wraps this in a Nuxt plugin so it boots once and is available everywhere.
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
        <NuxtLink v-if="isCorrect" to="/level/2" class="btn btn--success">
          Continue to Level 02 →
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const game = useGame()

const BROKEN_CODE = `export function useSignalTracker() {
  const config = useRuntimeConfig()
  // TODO: read the 'signalEndpoint' from the public config
  // TODO: initialize the tracker with the endpoint and a 'voyager-1' source
  // TODO: return { tracker }
}`

const CORRECT_CODE = `export function useSignalTracker() {
  const config = useRuntimeConfig()
  const endpoint = config.public.signalEndpoint
  const tracker = signalTracker.init({
    endpoint,
    source: 'voyager-1',
  })
  return { tracker }
}`

const userCode  = ref(BROKEN_CODE)
const isCorrect = ref(false)
const showError = ref(false)
const showHint  = ref(false)
const demoSignal = ref(50)

const composableChecks = computed(() => {
  const c = userCode.value
  return {
    endpoint:  /config\.public\.signalEndpoint/.test(c),
    init:      /signalTracker\.init\s*\(\s*\{/.test(c),
    returned:  /return\s*\{\s*tracker\s*\}/.test(c),
  }
})

const checkCount    = computed(() => Object.values(composableChecks.value).filter(Boolean).length)
const signalPercent = computed(() => isCorrect.value ? 100 : Math.round((checkCount.value / 3) * 80))

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

function getDemoColor(value: number): string {
  if (value < 40) return 'red'
  if (value < 80) return 'orange'
  return 'green'
}

function checkAnswer() {
  if (normalize(userCode.value) === normalize(CORRECT_CODE)) {
    isCorrect.value = true
    showError.value = false
    userCode.value = CORRECT_CODE
    game.completeLevel(1)
  } else {
    showError.value = true
  }
}

function resetCode() {
  userCode.value  = BROKEN_CODE
  showError.value = false
  showHint.value  = false
}

onMounted(() => {
  if (game.isLevelComplete(1)) {
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

.doc-link {
  color: var(--gold);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.doc-link:hover {
  color: var(--orange);
  text-decoration: underline;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.level-page__control-display {
  padding: 20px;
  border: 2px solid var(--gold);
  border-radius: 8px;
  background: linear-gradient(135deg, #0a1428 0%, #1a2a3a 50%, #0f1820 100%);
  box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.1), 0 0 20px rgba(255, 215, 0, 0.15);
}

.control-display-panel {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.control-display-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-display-bar {
  flex: 1;
  flex-direction: column;
  gap: 12px;
}

.display-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-family: var(--mono);
}

.display-label {
  color: var(--muted);
}

.display-value {
  color: var(--gold);
  font-weight: 600;
}

.progress-display {
  width: 100%;
  height: 28px;
  border: 1px solid var(--gold);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.bar-display {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
  background-color: orange;
}

@keyframes blink {
  50% { opacity: 0; }
}

.joystick-base-display {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  background: linear-gradient(135deg, #1a2a3a 0%, #0a1428 100%);
  border: 2px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.5), 0 0 12px rgba(255, 215, 0, 0.2);
}

.joystick-stick-display {
  width: 28px;
  height: 28px;
  background: radial-gradient(circle at 30% 30%, #ff6400, #cc5200);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), 0 0 8px rgba(255, 100, 0, 0.5);
}

.editor-toggle {
  font-size: 0.9rem;
  padding: 10px 16px;
}

.editor-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  background: var(--navy);
  border-left: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
}

.editor-sidebar--open {
  transform: translateX(0);
}

.editor-sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}

.editor-sidebar__textarea {
  flex: 1;
  border: none;
  background: var(--navy-dark);
  color: var(--text);
  padding: 16px;
  font-family: var(--mono);
  font-size: 0.85rem;
  line-height: 1.5;
  resize: none;
  overflow-y: auto;
}

.editor-sidebar__textarea:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.3);
}

.editor-sidebar__textarea--correct {
  background: rgba(52, 211, 153, 0.1);
  color: var(--text);
}

.editor-sidebar__textarea--error {
  background: rgba(239, 68, 68, 0.1);
}

.editor-sidebar__footer {
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12px;
}

.editor-sidebar__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.success-celebration {
  padding: 24px;
  border: 2px solid var(--green);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  box-shadow: 0 0 20px rgba(52, 211, 153, 0.2), inset 0 0 20px rgba(52, 211, 153, 0.05);
}

.celebration-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.celebration-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--green);
  margin: 0;
  letter-spacing: 0.02em;
}

.celebration-text {
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

.celebration-signal-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.signal-demo-header {
  font-size: 0.8rem;
  font-family: var(--mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 600;
}

.signal-demo-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signal-demo-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.signal-demo-value {
  font-family: var(--mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gold);
  min-width: 60px;
  text-align: center;
}

.signal-demo-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-demo {
  width: 100%;
  height: 40px;
  border: 2px solid rgba(52, 211, 153, 0.5);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.signal-bar-demo {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
  background-color: orange;
}

.signal-status-text {
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  justify-content: center;
  flex-wrap: wrap;
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

.status-blinking {
  color: var(--gold);
  animation: pulse 0.8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Signal demo */
.signal-demo {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-demo__header {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.signal-demo__container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signal-demo__controls {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.signal-demo__value {
  font-family: var(--mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gold);
  min-width: 60px;
  text-align: center;
}

.signal-demo__bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-demo__bar {
  width: 100%;
  height: 40px;
  border: 2px solid rgba(52, 211, 153, 0.5);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.signal-demo__fill {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
}

.signal-demo__status {
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  justify-content: center;
  flex-wrap: wrap;
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

.status-blinking {
  color: var(--gold);
  animation: pulse 0.8s ease-in-out infinite;
}

.bridge-box {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.bridge-text {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}
</style>
