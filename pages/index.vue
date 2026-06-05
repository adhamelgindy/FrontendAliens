<template>
  <div class="landing">
    <div class="container landing__inner">
      <!-- Eyebrow -->
      <p class="eyebrow landing__eyebrow">Incoming Transmission</p>

      <!-- Headline -->
      <h1 class="landing__title font-title">
        FRONTEND<br />
        <span class="landing__title--accent">ALIENS</span>
      </h1>

      <!-- Subtitle -->
      <p class="landing__subtitle">
        Save Voyager 1. Restore the Golden Record.
      </p>

      <!-- Golden Record Image -->
      <img src="~/assets/golden-record.png" alt="The Golden Record" class="landing__image" />

      <!-- Description -->
      <p class="landing__desc">
        Year 3000. The frontend fleet is degraded. Laptops are slow, builds take minutes, hot reload barely survives.
        <br /><br />
        Your team travels to Saturn to acquire quantum-grade hardware. During transit, a collision with Voyager 1 occurs. Impact damage corrupts the Golden Frontend Runtime Archive—the Golden Record—containing critical app infrastructure logic.
        <br /><br />
        Three systems are broken. You are the only engineer who understands all three layers.
      </p>

      <!-- Stats row -->
      <!-- <div class="stat-row landing__stats">
        <div class="stat-tile">
          <div class="stat-tile__value text-orange">3</div>
          <div class="stat-tile__label">Levels</div>
        </div>
        <div class="stat-tile">
          <div class="stat-tile__value text-gold">Code</div>
          <div class="stat-tile__label">Challenges</div>
        </div>
        <div class="stat-tile">
          <div class="stat-tile__value text-green">Save</div>
          <div class="stat-tile__label">Voyager</div>
        </div>
      </div> -->

      <!-- Existing progress notice -->
      <div v-if="hasProgress" class="landing__resume card">
        <span class="text-gold font-mono" style="font-size:0.8rem; letter-spacing:0.1em;">
          MISSION IN PROGRESS — Level {{ nextLevel }} of 3
        </span>
        <div class="landing__resume-btns">
          <NuxtLink :to="`/level/${nextLevel}`" class="btn btn--primary">
            Resume Mission
          </NuxtLink>
          <button class="btn btn--ghost" @click="handleReset">
            Start Over
          </button>
        </div>
      </div>

      <!-- CTA -->
      <NuxtLink v-else to="/level/1" class="btn btn--primary btn--large landing__cta">
        ▶ BEGIN MISSION
      </NuxtLink>

      <!-- Decorative transmission lines -->
      <div class="landing__noise font-mono">
        <span>SIG-LOCK: PENDING</span>
        <span>FREQ: 8.4 GHz</span>
        <span>DIST: 23.6 B km</span>
      </div>
    </div>

    <!-- Bottom horizon line -->
    <div class="landing__horizon" />
  </div>
</template>

<script setup lang="ts">
const game = useGame()

const hasProgress = computed(() => game.completedLevels.value.length > 0)
const nextLevel   = computed(() => {
  for (let n = 1; n <= 3; n++) {
    if (!game.isLevelComplete(n)) return n
  }
  return 3
})

function handleReset() {
  game.resetGame()
}
</script>

<style scoped>
.landing {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 0 60px;
  position: relative;
}

.landing__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  max-width: 640px;
}

.landing__eyebrow {
  margin-bottom: -10px;
}

.landing__title {
  font-size: clamp(3rem, 10vw, 5.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--white);
}

.landing__title--accent {
  color: var(--orange);
  display: block;
}

.landing__subtitle {
  font-family: var(--title);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.02em;
  margin-top: -12px;
}

.landing__image {
  width: 400px;
  height: auto;
  margin: 12px 0;
  border-radius: 8px;
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.landing__desc {
  font-size: 1rem;
  color: var(--muted);
  max-width: 520px;
  line-height: 1.7;
}

.landing__stats {
  width: 100%;
  max-width: 420px;
}

.landing__cta {
  margin-top: 8px;
}

.landing__resume {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 420px;
}

.landing__resume-btns {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.landing__noise {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--border);
  margin-top: 12px;
  text-transform: uppercase;
}

.landing__horizon {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}
</style>
