<template>
  <div class="level-page">
    <div class="container level-page__inner">
      <div class="level-page__back">
        <NuxtLink to="/level/2" class="btn btn--ghost btn--sm">← Level 02</NuxtLink>
        <span class="level-page__progress font-mono">Level 03 / 03</span>
      </div>

      <div v-if="locked" class="alert alert--error">
        <span>Access denied — complete Level 02 first.</span>
        <NuxtLink to="/level/2" class="btn btn--ghost btn--sm" style="margin-left:auto">Go to Level 02</NuxtLink>
      </div>

      <template v-else>
        <div class="level-page__header">
          <p class="eyebrow">Mission Control Architecture</p>
          <h1 class="level-page__title font-title">Level 03 — Plugin Lifecycle & Order</h1>
          <p class="level-page__narrative">
            Multiple plugins work together, but some execute before the data they need. Fix execution order, expose helpers, and activate directives.
          </p>
        </div>

        <!-- <SignalBar :percent="signalPercent" :correct="isCorrect" /> -->

        <!-- Challenge 1 -->
        <div class="challenge-section">
          <div class="challenge-title">Challenge 1: Parallel Execution</div>
          <div class="test-panel card">
            <div class="test-panel__cases">
              <div :class="['test-case', ch1.parallel ? 'test-case--pass' : 'test-case--fail']">
                <span class="test-case__icon">{{ ch1.parallel ? '✓' : '✗' }}</span>
                <span class="test-case__label">Parallel Plugins</span>
              </div>
            </div>
          </div>
          <div class="challenge-description">
            Nuxt won't wait until the end of the plugin's execution before loading the next plugin
          </div>
          <div class="level-page__editor-wrap">
            <div class="level-page__editor-label font-mono">plugins/signal-config.ts</div>
            <textarea v-model="code1" class="code-editor" :class="{ 'code-editor--correct': isCorrect }" spellcheck="false" rows="8" :disabled="isCorrect" />
          </div>
        </div>

        <!-- Challenge 2 -->
        <div class="challenge-section">
          <div class="challenge-title">Challenge 2: Plugin Dependencies</div>
          <div class="test-panel card">
            <div class="test-panel__cases">
              <div :class="['test-case', ch2.dependsOn ? 'test-case--pass' : 'test-case--fail']">
                <span class="test-case__icon">{{ ch2.dependsOn ? '✓' : '✗' }}</span>
                <span class="test-case__label">Plugins With Dependencies</span>
              </div>
            </div>
          </div>
          <div class="challenge-description">
            Declare that signal-tracker depends on signal-config
          </div>
          <div class="level-page__editor-wrap">
            <div class="level-page__editor-label font-mono">plugins/signal-tracker.ts</div>
            <textarea v-model="code2" class="code-editor" :class="{ 'code-editor--correct': isCorrect }" spellcheck="false" rows="10" :disabled="isCorrect" />
          </div>
        </div>

        <!-- Challenge 3 -->
        <div class="challenge-section">
          <div class="challenge-title">Challenge 3: Provide Helper</div>
          <div class="test-panel card">
            <div class="test-panel__cases">
              <div :class="['test-case', ch3.provide ? 'test-case--pass' : 'test-case--fail']">
                <span class="test-case__icon">{{ ch3.provide ? '✓' : '✗' }}</span>
                <span class="test-case__label">Providing Helpers</span>
              </div>
            </div>
          </div>
          <div class="challenge-description">
            To provide a helper on the NuxtApp instance, return it from the plugin under a provide key.
          </div>

          <div class="level-page__editor-wrap">
            <div class="level-page__editor-label font-mono">plugins/mission-helper.ts</div>
            <textarea v-model="code3" class="code-editor" :class="{ 'code-editor--correct': isCorrect }" spellcheck="false" rows="10" :disabled="isCorrect" />
          </div>

          <!-- Usage example -->
          <div class="reference-block">
            <div class="reference-label">Usage in Component</div>
            <pre class="reference-code"><code>&lt;script setup lang="ts"&gt;
const { $missionStatus } = useNuxtApp()
&lt;/script&gt;

&lt;template&gt;
  &lt;div&gt;
    &#123;&#123; $missionStatus('ready') &#125;&#125;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
          </div>
        </div>

        <!-- Challenge 4 -->
        <div class="challenge-section">
          <div class="challenge-title">Challenge 4: Write the Directive Plugin</div>

          <div class="test-panel card">
            <div class="test-panel__cases">
              <div :class="['test-case', ch4.directive ? 'test-case--pass' : 'test-case--fail']">
                <span class="test-case__icon">{{ ch4.directive ? '✓' : '✗' }}</span>
                <span class="test-case__label">defineNuxtPlugin with directive</span>
              </div>
            </div>
          </div>

          <div class="level-page__editor-wrap">
            <div class="level-page__editor-label font-mono">plugins/signal-focus.ts</div>
            <textarea v-model="code4" class="code-editor" :class="{ 'code-editor--correct': isCorrect }" spellcheck="false" rows="10" :disabled="isCorrect" />
          </div>

          <!-- Reference: usage in component -->
          <div class="reference-block">
            <div class="reference-label">Usage in Component</div>
            <pre class="reference-code"><code>&lt;script setup lang="ts"&gt;
// The directive is globally registered by the plugin
&lt;/script&gt;

&lt;template&gt;
  &lt;input v-signal-focus /&gt;
&lt;/template&gt;</code></pre>
          </div>
        </div>

        <div v-if="showHint" class="alert alert--hint">
          <span><strong>Hint:</strong> Ch1: <code>parallel: true</code>. Ch2: <code>dependsOn: ['signal-config']</code>. Ch3: Return provide with missionStatus. Ch4: Add <code>v-signal-lock</code> to input.</span>
        </div>

        <div v-if="showError && !isCorrect" class="alert alert--error">
          <span>Validation failed — check all four challenges.</span>
        </div>

        <div v-if="isCorrect" class="alert alert--success">
          <span>✧ MISSION CONTROL STABLE ✧</span>
        </div>

        <div class="level-page__actions">
          <button v-if="!isCorrect" class="btn btn--ghost" @click="showHint = !showHint">
            {{ showHint ? 'Hide Hint' : 'Request Hint' }}
          </button>
          <button v-if="!isCorrect" class="btn btn--ghost" @click="resetCode">Reset</button>
          <button v-if="!isCorrect" class="btn btn--primary" @click="checkAnswer">▶ Transmit</button>
          <NuxtLink v-if="isCorrect && liveSignal >= 99" to="/finale" class="btn btn--success">View Finale →</NuxtLink>
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const game = useGame()
const locked = computed(() => !game.canAccessLevel(3))

const code1 = ref(`export default defineNuxtPlugin({
  name: 'signal-config',
  // TODO
  async setup() {
    await loadRemoteConfig()
    return {
      provide: {
        signalConfig: { endpoint: 'https://signal.space/api' }
      }
    }
  }
})`)

const code2 = ref(`export default defineNuxtPlugin({
  name: 'signal-tracker',
  // TODO
  setup(nuxtApp) {
    const config = nuxtApp.$signalConfig
    const tracker = createTracker(config.endpoint)
    return { provide: { signalTracker: tracker } }
  }
})`)

const code3 = ref(`export default defineNuxtPlugin({
  name: 'mission-helper',
  setup() {
    // TODO: provide missionStatus function
  }
})`)

const code4 = ref(`export default defineNuxtPlugin((nuxtApp) => {
  // TODO
})`)

const CORRECT_CODE_4 = `export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('signal-focus', {
    mounted(el: HTMLElement) {
      el.focus()
    },
  })
})`

const isCorrect = ref(false)
const showError = ref(false)
const showHint = ref(false)
const liveSignal = ref(95)

const ch1 = computed(() => ({
  parallel: /parallel\s*:\s*true/.test(code1.value)
}))

const ch2 = computed(() => ({
  dependsOn: /dependsOn\s*:\s*\[\s*['"]signal-config['"]/.test(code2.value)
}))

const ch3 = computed(() => ({
  provide: /provide\s*:\s*\{\s*missionStatus/.test(code3.value)
}))

const ch4 = computed(() => ({
  directive: /nuxtApp\.vueApp\.directive\s*\(\s*['"]signal-focus['"]/.test(code4.value) &&
             /mounted\s*\(\s*el\s*:\s*HTMLElement\s*\)/.test(code4.value) &&
             /el\.focus\s*\(\s*\)/.test(code4.value)
}))

const allPass = computed(() =>
  ch1.value.parallel &&
  ch2.value.dependsOn &&
  ch3.value.provide &&
  ch4.value.directive
)

const signalPercent = computed(() => {
  if (isCorrect.value) return 100
  const count = [ch1.value.parallel, ch2.value.dependsOn, ch3.value.provide, ch4.value.directive].filter(Boolean).length
  return Math.round((count / 4) * 80)
})

function getSignalColor(value: number): string {
  if (value < 40) return 'red'
  if (value < 80) return 'orange'
  return 'green'
}

function checkAnswer() {
  if (allPass.value) {
    isCorrect.value = true
    showError.value = false
    game.completeLevel(3)
  } else {
    showError.value = true
  }
}

function resetCode() {
  code1.value = `export default defineNuxtPlugin({
  name: 'signal-config',
  // TODO: add parallel: true
  async setup() {
    await loadRemoteConfig()
    return {
      provide: {
        signalConfig: { endpoint: 'https://signal.space/api' }
      }
    }
  }
})`
  code2.value = `export default defineNuxtPlugin({
  name: 'signal-tracker',
  // TODO: add dependsOn: ['signal-config']
  setup(nuxtApp) {
    const config = nuxtApp.$signalConfig
    const tracker = createTracker(config.endpoint)
    return { provide: { signalTracker: tracker } }
  }
})`
  code3.value = `export default defineNuxtPlugin({
  name: 'mission-helper',
  setup() {
    // TODO: provide missionStatus function
  }
})`
  code4.value = `export default defineNuxtPlugin((nuxtApp) => {
  // TODO
})`
  showError.value = false
  showHint.value = false
}

watch(isCorrect, (correct) => {
  if (correct) {
    liveSignal.value = 95
    const startTime = Date.now()
    const duration = 8000
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      liveSignal.value = 95 + (4 * progress)
      if (progress >= 1) {
        liveSignal.value = 99
        clearInterval(interval)
      }
    }, 30)
  }
}, { flush: 'post' })

onMounted(() => {
  if (game.isLevelComplete(3)) {
    isCorrect.value = true
    code4.value = CORRECT_CODE_4
    liveSignal.value = 99
  }
})
</script>

<style scoped>
.challenge-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gold);
  font-family: var(--mono);
  letter-spacing: 0.05em;
}

.challenge-description {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.5;
  padding: 0 0 8px 0;
}

.reference-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--navy-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.reference-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  font-family: var(--mono);
}

.reference-code {
  margin: 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 12px;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.4;
}

.reference-code code {
  font-family: var(--mono);
  color: var(--text);
}

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

.code-editor {
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

.code-editor:focus {
  outline: none;
}

.code-editor--correct {
  background: rgba(52, 211, 153, 0.1);
}

.level-page__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.test-panel {
  padding: 16px;
}

.test-panel__cases {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-case {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.85rem;
}

.test-case--pass {
  background: rgba(34, 197, 94, 0.1);
  border-color: var(--green);
}

.test-case--fail {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--orange);
}

.test-case__icon {
  font-size: 1rem;
  font-weight: 700;
  min-width: 20px;
}

.test-case--pass .test-case__icon {
  color: var(--green);
}

.test-case--fail .test-case__icon {
  color: var(--orange);
}

.test-case__label {
  font-family: var(--mono);
  flex: 1;
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
