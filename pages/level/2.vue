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
          <p class="eyebrow">Build-Time Meltdown</p>
          <h1 class="level-page__title font-title">
            Level 02 — Rewrite as a Module
          </h1>
          <p class="level-page__narrative">
            The directive worked, but it's running inside a component — nothing
            is configured at the Nuxt layer. Rewrite the signal tracker as a Nuxt
            module so Nuxt itself registers it during startup, before any
            component exists.
          </p>
        </div>

        <!-- Signal bar -->
        <SignalBar :percent="signalPercent" :correct="isCorrect" />

        <!-- Module Validator panel -->
        <div class="test-panel card">
          <div class="test-panel__header font-mono">
            <span class="text-muted" style="font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase;">
              Module Validator
            </span>
          </div>
          <div class="test-panel__cases">
            <div :class="['test-case', moduleChecks.exported ? 'test-case--pass' : 'test-case--fail']">
              <span class="test-case__icon">{{ moduleChecks.exported ? '✓' : '✗' }}</span>
              <span class="test-case__label">export default defineNuxtModule(...)</span>
              <span class="test-case__expect text-muted">— module not exported</span>
            </div>
            <div :class="['test-case', moduleChecks.hook ? 'test-case--pass' : 'test-case--fail']">
              <span class="test-case__icon">{{ moduleChecks.hook ? '✓' : '✗' }}</span>
              <span class="test-case__label">nuxt.hook('modules:done', ...)</span>
              <span class="test-case__expect text-muted">— hook not registered</span>
            </div>
            <div :class="['test-case', moduleChecks.addPlugin ? 'test-case--pass' : 'test-case--fail']">
              <span class="test-case__icon">{{ moduleChecks.addPlugin ? '✓' : '✗' }}</span>
              <span class="test-case__label">addPlugin('./runtime/signalTracker.plugin')</span>
              <span class="test-case__expect text-muted">— plugin not registered</span>
            </div>
          </div>
        </div>

        <!-- Editor -->
        <div class="level-page__editor-wrap">
          <div class="level-page__editor-label font-mono">
            <span class="text-orange">modules/signal.ts</span>
            <span class="text-muted" style="margin-left:auto; font-size:0.7rem;">
              Implement the module
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
          <span>Hint: A Nuxt module exports <code>defineNuxtModule({ meta, setup(options, nuxt) })</code>. Inside <code>setup</code>, use <code>nuxt.hook('modules:done', () => { ... })</code> to register logic that runs after all modules load. Use <code>addPlugin(path)</code> to tell Nuxt to include a plugin file.</span>
        </div>

        <!-- Error feedback -->
        <div v-if="showError && !isCorrect" class="alert alert--error">
          <span>Module validation failed — check the export, the hook call, and addPlugin.</span>
        </div>

        <!-- Success -->
        <div v-if="isCorrect" class="alert alert--success">
          <span>✧ MODULE REGISTERED — BUILD CONFIGURED ✧ Nuxt knows about the signal tracker now. Continue to Level 03 to make it available at runtime.</span>
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

const BROKEN_CODE = `// modules/signal.ts
export default defineNuxtModule({
  meta: {
    name: 'signal-tracker',
  },
  setup(options, nuxt) {
    // TODO: hook into 'modules:done'
    // TODO: inside the hook, call addPlugin with the signalTracker path
  },
})`

const CORRECT_CODE = `// modules/signal.ts
export default defineNuxtModule({
  meta: {
    name: 'signal-tracker',
  },
  setup(options, nuxt) {
    nuxt.hook('modules:done', () => {
      addPlugin('./runtime/signalTracker.plugin')
    })
  },
})`

const userCode  = ref(BROKEN_CODE)
const isCorrect = ref(false)
const showError = ref(false)
const showHint  = ref(false)

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

const moduleChecks = computed(() => {
  const c = userCode.value
  return {
    exported:  /export\s+default\s+defineNuxtModule/.test(c),
    hook:      /nuxt\.hook\s*\(\s*['"]modules:done['"]/.test(c),
    addPlugin: /addPlugin\s*\(\s*['"]\.\/runtime\/signalTracker\.plugin['"]/.test(c),
  }
})

const checkCount = computed(() => Object.values(moduleChecks.value).filter(Boolean).length)

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
</style>
