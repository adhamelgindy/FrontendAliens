<template>
  <header class="navbar">
    <div class="container--wide navbar__inner">
      <!-- Logo / home link -->
      <NuxtLink to="/" class="navbar__logo">
        <span class="navbar__logo-icon">◈</span>
        <span class="navbar__logo-text">Frontend Aliens</span>
      </NuxtLink>

      <!-- Level progress dots (shown only during levels) -->
      <div v-if="onLevelPage" class="navbar__center">
        <div class="level-dots">
          <div
            v-for="n in 3"
            :key="n"
            :class="[
              'level-dot',
              game.isLevelComplete(n) ? 'level-dot--done' : '',
              activeLevelNum === n && !game.isLevelComplete(n) ? 'level-dot--active' : '',
            ]"
            :title="`Level ${n}`"
          />
        </div>
        <span class="navbar__level-label font-mono">
          {{ activeLevelNum }}&thinsp;/&thinsp;3
        </span>
      </div>

      <!-- Right: mission status badge -->
      <div class="navbar__right">
        <span v-if="allComplete" class="badge badge--success">
          Mission Complete
        </span>
        <span v-else class="badge badge--active">
          Voyager 1 — Active
        </span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const game  = useGame()

const levelMatch = computed(() => route.path.match(/\/level\/(\d+)/))
const onLevelPage = computed(() => !!levelMatch.value)
const activeLevelNum = computed(() => levelMatch.value ? Number(levelMatch.value[1]) : 0)
const allComplete = computed(() => game.completedLevels.value.length >= 3)
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(13,27,46,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.navbar__logo:hover { opacity: 0.75; }

.navbar__logo-icon {
  font-size: 1.2rem;
  color: var(--orange);
}

.navbar__logo-text {
  font-family: var(--title);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--white);
}

.navbar__center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.navbar__level-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--muted);
  text-transform: uppercase;
}

.navbar__right {
  display: flex;
  align-items: center;
}

.badge {
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1px solid;
}

.badge--active {
  color: var(--green);
  border-color: var(--green);
  background: var(--green-dim);
}

.badge--success {
  color: var(--gold);
  border-color: var(--gold);
  background: var(--gold-dim);
}
</style>
