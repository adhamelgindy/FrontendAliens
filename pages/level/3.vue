<template>
  <div class="level-page">
    <div class="container level-page__inner">

      <!-- Back nav -->
      <div class="level-page__back">
        <NuxtLink to="/level/2" class="btn btn--ghost btn--sm">
          ← Level 02
        </NuxtLink>
        <span class="level-page__progress font-mono">Level 03 / 03</span>
      </div>

      <!-- Locked state -->
      <div v-if="locked" class="alert alert--error">
        <span>Access denied — complete Level 02 first.</span>
        <NuxtLink to="/level/2" class="btn btn--ghost btn--sm" style="margin-left:auto">
          Go to Level 02
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="level-page__header">
          <p class="eyebrow">Runtime Gap</p>
          <h1 class="level-page__title font-title">
            Level 03 — Inject as a Plugin
          </h1>
          <p class="level-page__narrative">
            The module registered the beacon at build time — but components
            still can't reach it. Modules configure Nuxt; they don't inject
            anything into the running app. Rewrite it as a Nuxt plugin so the
            beacon is initialized when the app boots and available to every
            component via <code>nuxtApp.provide</code>.
          </p>
        </div>

        <!-- Signal bar -->
        <SignalBar :percent="signalPercent" :correct="isCorrect" />

        <!-- Build Validator panel -->
        <div class="test-panel card">
          <div class="test-panel__header font-mono">
            <span class="text-muted" style="font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase;">
              Plugin Validator
            </span>
          </div>
          <div class="test-panel__cases">
            <div
              :class="['test-case', buildChecks.exported ? 'test-case--pass' : 'test-case--fail']"
            >
              <span class="test-case__icon">{{ buildChecks.exported ? '✓' : '✗' }}</span>
              <span class="test-case__label">export default defineNuxtPlugin(...)</span>
              <span class="test-case__expect text-muted">— plugin not exported</span>
            </div>
            <div
              :class="['test-case', buildChecks.nuxtApp ? 'test-case--pass' : 'test-case--fail']"
            >
              <span class="test-case__icon">{{ buildChecks.nuxtApp ? '✓' : '✗' }}</span>
              <span class="test-case__label">defineNuxtPlugin((nuxtApp) => ...)</span>
              <span class="test-case__expect text-muted">— nuxtApp argument missing</span>
            </div>
            <div
              :class="['test-case', buildChecks.provide ? 'test-case--pass' : 'test-case--fail']"
            >
              <span class="test-case__icon">{{ buildChecks.provide ? '✓' : '✗' }}</span>
              <span class="test-case__label">nuxtApp.provide('beacon', ...)</span>
              <span class="test-case__expect text-muted">— beacon not injected</span>
            </div>
          </div>
        </div>

        <!-- Editor -->
        <div class="level-page__editor-wrap">
          <div class="level-page__editor-label font-mono">
            <span class="text-orange">plugins/beacon.ts</span>
            <span class="text-muted" style="margin-left:auto; font-size:0.7rem;">
              Implement the plugin
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
          <span>Hint: A Nuxt plugin must be exported with <code>export default defineNuxtPlugin((nuxtApp) =&gt; {})</code>. The <code>nuxtApp</code> argument gives you access to <code>nuxtApp.provide('key', value)</code>, which injects the value into every component as <code>$key</code>. Use <code>useScript(url)</code> to load the beacon script.</span>
        </div>

        <!-- Error feedback -->
        <div v-if="showError && !isCorrect" class="alert alert--error">
          <span>Plugin validation failed — check the export, the nuxtApp parameter, and the provide call.</span>
        </div>

        <!-- Success banner -->
        <div v-if="isCorrect" class="alert alert--success">
          <span>✧ PLUGIN INJECTED — GOLDEN RECORD FULLY RESTORED ✧ The beacon is live. Initiating finale sequence…</span>
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
          <NuxtLink v-if="isCorrect" to="/finale" class="btn btn--success">
            View Finale →
          </NuxtLink>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const game   = useGame()

const locked = computed(() => !game.canAccessLevel(3))

const BROKEN_CODE = `// plugins/beacon.ts
export default defineNuxtPlugin(() => {
  // TODO: initialize the beacon using useScript
  // TODO: provide it to the app as 'beacon'
})`

const CORRECT_CODE = `// plugins/beacon.ts
export default defineNuxtPlugin((nuxtApp) => {
  const beacon = useScript('https://beacon.voyager.space/signal.js')
  nuxtApp.provide('beacon', beacon)
})`

const userCode  = ref(BROKEN_CODE)
const isCorrect = ref(false)
const showError = ref(false)
const showHint  = ref(false)

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

// Check plugin structure on every keystroke
const buildChecks = computed(() => {
  const c = userCode.value
  return {
    exported: /export\s+default\s+defineNuxtPlugin/.test(c),
    nuxtApp: /defineNuxtPlugin\s*\(\s*\(nuxtApp\)/.test(c),
    provide: /nuxtApp\.provide\s*\(/.test(c),
  }
})

const checkCount = computed(() => Object.values(buildChecks.value).filter(Boolean).length)

const signalPercent = computed(() => {
  if (isCorrect.value) return 100
  return Math.round((checkCount.value / 3) * 80)
})

function checkAnswer() {
  if (normalize(userCode.value) === normalize(CORRECT_CODE)) {
    isCorrect.value = true
    showError.value = false
    game.completeLevel(3)
    setTimeout(() => router.push('/finale'), 2000)
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
  if (game.isLevelComplete(3)) {
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
</style>
