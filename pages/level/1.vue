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
        <p class="eyebrow">Warmup Challenge</p>
        <h1 class="level-page__title font-title">
          Level 01 — Restore the Golden Record Signal
        </h1>
        <p class="level-page__narrative">
          The Golden Record aboard Voyager 1 was damaged before your crew recovered it. One of the corrupted systems is responsible for displaying the strength of the incoming transmission. Implement the v-signal directive so the application can correctly visualize the transmission signal.
        </p>
      </div>

      <!-- Control panel with live preview -->
      <div v-if="!isCorrect" class="level-page__control-display">
        <div class="control-display-label font-mono text-muted" style="font-size:0.7rem; letter-spacing:0.1em; margin-bottom:16px;">
          CONTROL PANEL — YELLOW (AWAITING SIGNAL)
        </div>
        <div class="control-display-panel">
          <!-- Left joystick -->
          <div class="control-display-section">
            <div class="joystick-base-display">
              <div class="joystick-stick-display"></div>
            </div>
          </div>

          <!-- Center display bar -->
          <div class="control-display-section control-display-bar">
            <div class="display-info-row">
              <span class="display-label">Signal:</span>
              <span class="display-value">{{ previewSignalStrength }}%</span>
            </div>
            <div class="progress-display">
              <div
                class="bar-display"
                :style="{
                  width: previewSignalStrength + '%',
                  backgroundColor: previewBarColor,
                  animation: previewBarBlink ? 'blink 0.5s infinite' : ''
                }"
              />
            </div>
            <SignalBar :percent="previewSignalStrength" :correct="isCorrect" />
          </div>

          <!-- Right controls -->
          <div class="control-display-section">
            <div style="display:flex; gap:8px;">
              <button class="btn btn--sm btn--ghost" @click="boostPreview" title="Boost Signal">+</button>
              <button class="btn btn--sm btn--ghost" @click="reducePreview" title="Reduce Signal">−</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Editor sidebar toggle -->
      <button class="editor-toggle btn btn--ghost" @click="editorOpen = !editorOpen">
        {{ editorOpen ? '◀ Hide' : '▶ Show' }} Code Editor
      </button>

      <!-- Documentation -->
      <div class="alert alert--info">
        <span>
          Learn about custom directives:
          <a href="https://vuejs.org/guide/reusability/custom-directives.html" target="_blank" rel="noopener noreferrer" class="doc-link">
            Vue 3 Custom Directives Guide ↗
          </a>
        </span>
      </div>

      <!-- Hint -->
      <div v-if="showHint" class="alert alert--hint">
        <span>Hint: Implement updateSignal to set el.style.backgroundColor based on value: red if < 40, orange if < 80, green otherwise. Set el.style.animation to 'blink 0.5s infinite' when value < 20, empty string otherwise. In mounted and updated hooks, call updateSignal with the binding.value.</span>
      </div>

      <!-- Error feedback -->
      <div v-if="showError && !isCorrect" class="alert alert--error">
        <span>Directive error — the signal bar is still not responding correctly. Check that the updateSignal function handles all cases and both hooks call it properly.</span>
      </div>

      <!-- Success banner -->
      <div v-if="isCorrect" class="alert alert--success">
        <span>✧ SIGNAL LOCKED — GOLDEN RECORD RESTORED ✧</span>
      </div>

      <!-- Success celebration -->
      <div v-if="isCorrect" class="success-celebration">
        <div class="celebration-content">
          <h3 class="celebration-title">Transmission Status: ACTIVE</h3>
          <p class="celebration-text">The Golden Record signal is now being tracked across the cosmos. Watch as it responds to signal strength changes.</p>

          <!-- Live signal visualization -->
          <div class="celebration-signal-demo">
            <div class="signal-demo-header">Live Signal Feed</div>
            <div class="signal-demo-container">
              <div class="signal-demo-controls">
                <button class="btn btn--sm btn--ghost" @click="celebrationSignalStrength -= 10" :disabled="celebrationSignalStrength <= 0">
                  − Weaken
                </button>
                <div class="signal-demo-value">{{ celebrationSignalStrength }}%</div>
                <button class="btn btn--sm btn--ghost" @click="celebrationSignalStrength += 10" :disabled="celebrationSignalStrength >= 100">
                  Strengthen +
                </button>
              </div>

              <div class="signal-demo-bar-wrapper">
                <div class="progress-demo">
                  <div
                    class="signal-bar-demo"
                    :style="{
                      width: `${celebrationSignalStrength}%`,
                      backgroundColor: getSignalColor(celebrationSignalStrength),
                      animation: celebrationSignalStrength < 20 ? 'blink 0.5s infinite' : ''
                    }"
                  />
                </div>
              </div>

              <div class="signal-status-text">
                <span v-if="celebrationSignalStrength < 40" class="status-critical">🔴 CRITICAL</span>
                <span v-else-if="celebrationSignalStrength < 80" class="status-weak">🟠 WEAK</span>
                <span v-else class="status-strong">🟢 STRONG</span>
                <span v-if="celebrationSignalStrength < 20" class="status-blinking">BLINKING</span>
              </div>
            </div>
          </div>
        </div>
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

  <!-- Editor sidebar -->
  <div class="editor-sidebar" :class="{ 'editor-sidebar--open': editorOpen }">
    <div class="editor-sidebar__header">
      <span class="text-orange font-mono">signal-readout.vue</span>
      <button class="btn btn--ghost btn--sm" @click="editorOpen = false">✕</button>
    </div>
    <textarea
      v-model="userCode"
      class="editor-sidebar__textarea"
      :class="{
        'editor-sidebar__textarea--correct': isCorrect,
        'editor-sidebar__textarea--error': showError,
      }"
      spellcheck="false"
      autocorrect="off"
      autocapitalize="off"
      :disabled="isCorrect"
      :rows="codeRows"
      @input="updateRows"
    />
    <div class="editor-sidebar__footer">
      <button
        v-if="!isCorrect"
        class="btn btn--primary btn--sm"
        @click="checkAnswer"
      >
        ▶ Transmit
      </button>
    </div>
  </div>

  <!-- Editor sidebar backdrop -->
  <div
    v-if="editorOpen"
    class="editor-sidebar__backdrop"
    @click="editorOpen = false"
  ></div>
</template>

<script setup lang="ts">
const game = useGame()

const BROKEN_CODE = '<script setup lang="ts">\nimport { ref } from \'vue\'\n\nconst signalStrength = ref(50)\n\nfunction strengthenSignal() {\n  if (signalStrength.value < 100) {\n    signalStrength.value += 10\n  }\n}\n\nfunction weakenSignal() {\n  if (signalStrength.value > 0) {\n    signalStrength.value -= 10\n  }\n}\n\nfunction updateSignal(el: HTMLElement, value: number) {\n  // TODO:\n  // - Set the signal color.\n  // - Enable blinking when the signal is below 20.\n  // - Disable blinking otherwise.\n}\n\nconst vSignal = {\n  mounted(el: HTMLElement, binding: { value: number }) {\n    // TODO:\n    // Apply the initial signal state.\n  },\n\n  updated(el: HTMLElement, binding: { value: number }) {\n    // TODO:\n    // Update the signal when the value changes.\n  },\n}\n</' + 'script>\n\n<template>\n  <div>\n    <h2>Golden Record Transmission</' + 'h2>\n\n    <div class="progress">\n      <div\n        class="signal-bar"\n        v-signal="signalStrength"\n        :style="{ width: `${signalStrength}%` }"\n      />\n    </' + 'div>\n\n    <p>Signal Strength: {{ signalStrength }}%</' + 'p>\n\n    <button @click="strengthenSignal">\n      Strengthen Signal\n    </' + 'button>\n\n    <button @click="weakenSignal">\n      Weaken Signal\n    </' + 'button>\n  </' + 'div>\n</' + 'template>\n\n<style scoped>\n.progress {\n  width: 300px;\n  border: 1px solid #ccc;\n}\n\n.signal-bar {\n  height: 20px;\n  transition:\n    width 0.3s,\n    background-color 0.3s;\n}\n\n@keyframes blink {\n  50% {\n    opacity: 0;\n  }\n}\n</' + 'style>'

const CORRECT_CODE = '<script setup lang="ts">\nimport { ref } from \'vue\'\n\nconst signalStrength = ref(50)\n\nfunction strengthenSignal() {\n  if (signalStrength.value < 100) {\n    signalStrength.value += 10\n  }\n}\n\nfunction weakenSignal() {\n  if (signalStrength.value > 0) {\n    signalStrength.value -= 10\n  }\n}\n\nfunction updateSignal(el: HTMLElement, value: number) {\n  if (value < 40) {\n    el.style.backgroundColor = \'red\'\n  } else if (value < 80) {\n    el.style.backgroundColor = \'orange\'\n  } else {\n    el.style.backgroundColor = \'green\'\n  }\n\n  if (value < 20) {\n    el.style.animation = \'blink 0.5s infinite\'\n  } else {\n    el.style.animation = \'\'\n  }\n}\n\nconst vSignal = {\n  mounted(el: HTMLElement, binding: { value: number }) {\n    updateSignal(el, binding.value)\n  },\n\n  updated(el: HTMLElement, binding: { value: number }) {\n    updateSignal(el, binding.value)\n  },\n}\n</' + 'script>\n\n<template>\n  <div>\n    <h2>Golden Record Transmission</' + 'h2>\n\n    <div class="progress">\n      <div\n        class="signal-bar"\n        v-signal="signalStrength"\n        :style="{ width: `${signalStrength}%` }"\n      />\n    </' + 'div>\n\n    <p>Signal Strength: {{ signalStrength }}%</' + 'p>\n\n    <button @click="strengthenSignal">\n      Strengthen Signal\n    </' + 'button>\n\n    <button @click="weakenSignal">\n      Weaken Signal\n    </' + 'button>\n  </' + 'div>\n</' + 'template>\n\n<style scoped>\n.progress {\n  width: 300px;\n  border: 1px solid #ccc;\n}\n\n.signal-bar {\n  height: 20px;\n  transition:\n    width 0.3s,\n    background-color 0.3s;\n}\n\n@keyframes blink {\n  50% {\n    opacity: 0;\n  }\n}\n</' + 'style>'

const userCode     = ref(BROKEN_CODE)
const isCorrect    = ref(false)
const showError    = ref(false)
const showHint     = ref(false)
const codeRows     = ref(BROKEN_CODE.split('\n').length)
const previewSignalStrength = ref(50)
const celebrationSignalStrength = ref(50)
const editorOpen   = ref(false)

function updateRows() {
  codeRows.value = userCode.value.split('\n').length
}

function boostPreview() {
  if (previewSignalStrength.value < 100) {
    previewSignalStrength.value += 10
  }
}

function reducePreview() {
  if (previewSignalStrength.value > 0) {
    previewSignalStrength.value -= 10
  }
}

function getSignalColor(value: number): string {
  if (value < 40) return 'red'
  if (value < 80) return 'orange'
  return 'green'
}

// Detect whether the user has implemented the color logic
const hasColorLogic = computed(() =>
  userCode.value.includes('backgroundColor') &&
  userCode.value.includes('binding.value')
)

const hasBlinkLogic = computed(() =>
  userCode.value.includes('animation') &&
  userCode.value.includes('binding.value')
)

// Drive the bar color from the user's implementation intent
const previewBarColor = computed(() => {
  if (!hasColorLogic.value) return 'orange'
  const v = previewSignalStrength.value
  if (v < 40) return 'red'
  if (v < 80) return 'orange'
  return 'green'
})

const previewBarBlink = computed(() =>
  hasBlinkLogic.value && previewSignalStrength.value < 20
)

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}


function checkAnswer() {
  if (normalize(userCode.value) === normalize(CORRECT_CODE)) {
    isCorrect.value = true
    showError.value = false
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
</style>
