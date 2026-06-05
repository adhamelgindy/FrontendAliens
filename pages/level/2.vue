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

      <!-- Locked state -->
      <div v-if="locked" class="alert alert--error">
        <span>Access denied — complete Level 01 first.</span>
        <NuxtLink to="/level/1" class="btn btn--ghost btn--sm" style="margin-left:auto">
          Go to Level 01
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="level-page__header">
          <p class="eyebrow">Plugin Bay Offline</p>
          <h1 class="level-page__title font-title">
            Level 02 — Plugin Layer
          </h1>
          <p class="level-page__narrative">
            The signal formatter plugin failed to initialise. Components across
            the ship expect $formatSignal() to exist — but the plugin has three
            faults: it's missing its export, the app context isn't named
            correctly, and the wrong method is used to inject. Fix
            plugins/signal-formatter.ts. Remember: a plugin runs once at app
            startup — before any component mounts. It is NOT a module: it
            executes at runtime in the browser (or server), not at build time.
          </p>
        </div>

        <!-- Signal bar -->
        <SignalBar :percent="signalPercent" :correct="isCorrect" />

        <!-- Plugin console -->
        <div class="waveform-preview">
          <div class="waveform-preview__label font-mono">Plugin Console</div>
          <div class="waveform-preview__box">
            <div class="console-rows">
              <div class="console-row" :class="{ 'console-row--pass': pluginChecks.exported }">
                <span class="console-status">{{ pluginChecks.exported ? '✓' : '✗' }}</span>
                <span>export default defineNuxtPlugin(...)</span>
                <span class="console-hint">— plugin not exported</span>
              </div>
              <div class="console-row" :class="{ 'console-row--pass': pluginChecks.nuxtApp }">
                <span class="console-status">{{ pluginChecks.nuxtApp ? '✓' : '✗' }}</span>
                <span>nuxtApp parameter</span>
                <span class="console-hint">— wrong context name</span>
              </div>
              <div class="console-row" :class="{ 'console-row--pass': pluginChecks.provide }">
                <span class="console-status">{{ pluginChecks.provide ? '✓' : '✗' }}</span>
                <span>nuxtApp.provide(...)</span>
                <span class="console-hint">— wrong injection method</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Editor -->
        <div class="level-page__editor-wrap">
          <div class="level-page__editor-label font-mono">
            <span class="text-orange">plugins/signal-formatter.ts</span>
            <span class="text-muted" style="margin-left:auto; font-size:0.7rem;">
              Fix the plugin definition
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
            rows="10"
          />
        </div>

        <!-- Hint -->
        <div v-if="showHint" class="alert alert--hint">
          <span>Hint: Nuxt plugins must be default-exported and wrapped in `defineNuxtPlugin()` — that's how Nuxt discovers and registers them. The argument is the Nuxt app instance, conventionally named `nuxtApp`. Use `nuxtApp.provide('name', fn)` to inject — this makes `$name` available in every component via `useNuxtApp()`.</span>
        </div>

        <!-- Error feedback -->
        <div v-if="showError && !isCorrect" class="alert alert--error">
          <span>Plugin registration failed — check export, parameter name, and injection method.</span>
        </div>

        <!-- Success banner -->
        <div v-if="isCorrect" class="alert alert--success">
          <span>PLUGIN INITIALISED — PLUGIN LAYER RESTORED. Loading final system…</span>
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
const router = useRouter()
const game   = useGame()

const locked = computed(() => !game.canAccessLevel(2))

const BROKEN_CODE = '// plugins/signal-formatter.ts\nfunction signalFormatterPlugin(app) {\n  app.inject(\'formatSignal\', (value: number) => {\n    return `${value.toFixed(1)} GHz`\n  })\n}'

const CORRECT_CODE = '// plugins/signal-formatter.ts\nexport default defineNuxtPlugin((nuxtApp) => {\n  nuxtApp.provide(\'formatSignal\', (value: number) => {\n    return `${value.toFixed(1)} GHz`\n  })\n})'

const userCode  = ref(BROKEN_CODE)
const isCorrect = ref(false)
const showError = ref(false)
const showHint  = ref(false)

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

// Parse current code to check plugin structure on every keystroke
const pluginChecks = computed(() => {
  const c = userCode.value
  return {
    exported: /export\s+default\s+defineNuxtPlugin/.test(c),
    nuxtApp: /defineNuxtPlugin\s*\(\s*\(?nuxtApp/.test(c),
    provide: /nuxtApp\.provide\s*\(/.test(c),
  }
})

const checkCount = computed(() => Object.values(pluginChecks.value).filter(Boolean).length)

const signalPercent = computed(() => {
  if (isCorrect.value) return 100
  const checksPassed = checkCount.value
  return Math.round((checksPassed / 3) * 80)
})

function checkAnswer() {
  if (normalize(userCode.value) === normalize(CORRECT_CODE)) {
    isCorrect.value = true
    showError.value = false
    game.completeLevel(2)
    setTimeout(() => router.push('/level/3'), 2000)
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

.waveform-preview {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.waveform-preview__label {
  padding: 8px 16px;
  background: var(--navy-mid);
  border-bottom: 1px solid var(--border);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  text-transform: uppercase;
}

.waveform-preview__box {
  padding: 20px 24px;
  font-family: var(--mono);
  font-size: 0.85rem;
  min-height: 64px;
  display: flex;
  align-items: center;
  transition: background 0.3s, color 0.3s, border 0.3s, opacity 0.3s;
}

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

.console-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.console-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(139, 0, 139, 0.1);
  border-left: 3px solid var(--muted);
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.console-row--pass {
  background: rgba(34, 197, 94, 0.1);
  border-left-color: var(--success);
}

.console-status {
  font-weight: bold;
  width: 16px;
  text-align: center;
  color: var(--muted);
}

.console-row--pass .console-status {
  color: var(--success);
}

.console-hint {
  color: var(--muted);
  font-size: 0.75rem;
  margin-left: auto;
}
</style>
