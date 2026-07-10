<template>
  <div class="status-bar">
    <div class="status-indicator" :style="indicatorStyle" />
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

const indicatorStyle = computed(() => {
  let backgroundColor: string
  if (props.correct) {
    backgroundColor = 'var(--green)'
  } else if (props.percent >= 80) {
    backgroundColor = 'var(--green)'
  } else if (props.percent >= 40) {
    backgroundColor = 'var(--gold)'
  } else {
    backgroundColor = 'var(--orange)'
  }

  const animation = props.percent < 20 && !props.correct ? 'blink 0.5s infinite' : 'none'

  return {
    backgroundColor,
    animation,
  }
})

</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.status-bar__content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.status-text {
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
