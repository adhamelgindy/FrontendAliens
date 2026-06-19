<template>
  <div class="signal-bar">
    <div class="signal-bar__header">
      <span class="signal-bar__label">Signal Strength</span>
      <span class="signal-bar__pct font-mono">{{ displayPct }}%</span>
    </div>
    <div class="signal-track">
      <div class="signal-fill" :style="{ width: displayPct + '%' }" />
    </div>
    <div class="signal-bar__status">
      <span :class="statusClass">{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  percent?: number
  correct?: boolean
}>(), {
  percent: 0,
  correct: false,
})

// Animate the displayed percentage toward props.percent
const displayPct = ref(0)

onMounted(() => {
  watch(
    () => props.percent,
    (target) => {
      const start = displayPct.value
      const delta = target - start
      const steps = 40
      let   step  = 0
      const interval = setInterval(() => {
        step++
        displayPct.value = Math.round(start + delta * (step / steps))
        if (step >= steps) {
          displayPct.value = target
          clearInterval(interval)
        }
      }, 15)
    },
    { immediate: true },
  )
})

const statusText = computed(() => {
  if (props.correct)       return 'SIGNAL LOCK ACQUIRED'
  if (props.percent >= 80) return 'STRONG SIGNAL'
  if (props.percent >= 40) return 'WEAK SIGNAL'
  return 'NO SIGNAL'
})

const statusClass = computed(() => ({
  'signal-bar__status-text': true,
  'text-green':  props.correct || props.percent >= 80,
  'text-gold':   !props.correct && props.percent >= 40 && props.percent < 80,
  'text-muted':  !props.correct && props.percent < 40,
}))
</script>

<style scoped>
.signal-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.signal-bar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.signal-bar__label {
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.signal-bar__pct {
  font-size: 0.8rem;
  color: var(--text);
}

.signal-bar__status {
  min-height: 18px;
}

.signal-bar__status-text {
  font-family: var(--mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.4s;
}
</style>
