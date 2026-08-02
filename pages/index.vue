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

      <!-- Description -->
      <p class="landing__desc">
        Year 3000. The frontend fleet is degraded. Laptops are slow, builds take minutes, hot reload barely survives.
        <br /><br />
        The team travels to Saturn to acquire quantum-grade hardware. During transit, the crew discovers that Voyager 1 had already been damaged in a previous collision. The impact corrupted the Golden Record Frontend Runtime Archive, affecting the live signal tracker.
        <br /><br />
        You are the only Engineer who can save Earth's message to the universe.
      </p>

      <!-- Spaceship viewscreen with control panel -->
      <div class="landing__viewscreen">
        <div class="landing__window">
          <img src="~/assets/golden-record.png" alt="The Golden Record" class="landing__image" />
        </div>
        <div class="landing__control-panel">
          <!-- Left joystick -->
          <div class="control-section">
            <div class="joystick-base">
              <div class="joystick-stick"></div>
            </div>
          </div>

          <!-- Center readouts -->
          <div class="control-section control-readouts">
            <div class="readout-item font-mono">
              <span class="readout-label">SIG-LOCK:</span>
              <span class="readout-value text-orange">PENDING</span>
            </div>
            <div class="readout-item font-mono">
              <span class="readout-label">FREQ:</span>
              <span class="readout-value text-gold">8.4 GHz</span>
            </div>
            <div class="readout-item font-mono">
              <span class="readout-label">DIST:</span>
              <span class="readout-value text-gold">23.6 B km</span>
            </div>
          </div>

          <!-- Right buttons -->
          <div class="control-section">
            <div class="button-cluster">
              <button
                class="panel-button"
                :class="{ 'panel-button--pressed': pressedButtons[0] }"
                @click="toggleButton(0)"
                aria-label="Alert"
              ></button>
              <button
                class="panel-button"
                :class="{ 'panel-button--pressed': pressedButtons[1] }"
                @click="toggleButton(1)"
                aria-label="Status"
              ></button>
              <button
                class="panel-button"
                :class="{ 'panel-button--pressed': pressedButtons[2] }"
                @click="toggleButton(2)"
                aria-label="System"
              ></button>
            </div>
          </div>

          <!-- Right joystick -->
          <div class="control-section">
            <div class="joystick-base">
              <div class="joystick-stick"></div>
            </div>
          </div>
        </div>
      </div>

      

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

const pressedButtons = ref([false, false, false])

function toggleButton(index: number) {
  pressedButtons.value[index] = !pressedButtons.value[index]
  setTimeout(() => {
    pressedButtons.value[index] = false
  }, 300)
}

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

.landing__viewscreen {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px 0;
}

.landing__window {
  width: 100%;
  max-width: 600px;
  height: 300px;
  border: 3px solid var(--gold);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.2), 0 0 30px rgba(255, 215, 0, 0.15);
  position: relative;
}

.landing__window::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent),
    linear-gradient(0deg, rgba(255, 215, 0, 0.1), transparent 50%);
  pointer-events: none;
}

.landing__image {
  width: 280px;
  height: auto;
  animation: spin 8s linear infinite;
  position: relative;
  z-index: 1;
}

.landing__control-panel {
  display: flex;
  gap: 24px;
  padding: 24px;
  border: 3px solid var(--gold);
  background: linear-gradient(135deg, #0a1428 0%, #1a2a3a 50%, #0f1820 100%);
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  align-items: center;
  justify-content: space-between;
  box-shadow:
    inset 0 0 20px rgba(255, 215, 0, 0.1),
    0 0 20px rgba(255, 215, 0, 0.2),
    0 0 40px rgba(255, 100, 0, 0.1);
  position: relative;
}

.landing__control-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0px,
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
  pointer-events: none;
}

.control-section {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.control-readouts {
  flex: 1;
  flex-direction: column;
  gap: 12px;
}

.readout-item {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  align-items: center;
}

.readout-label {
  color: var(--muted);
  min-width: 80px;
}

.readout-value {
  font-weight: 600;
  text-shadow: 0 0 8px currentColor;
}

/* Joystick */
.joystick-base {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1a2a3a 0%, #0a1428 100%);
  border: 2px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.5), 0 0 12px rgba(255, 215, 0, 0.2);
}

.joystick-stick {
  width: 32px;
  height: 32px;
  background: radial-gradient(circle at 30% 30%, #ff6400, #cc5200);
  border-radius: 6px;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    0 0 10px rgba(255, 100, 0, 0.6);
  border: 1px solid rgba(255, 100, 0, 0.8);
}

/* Button cluster */
.button-cluster {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.panel-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  background: radial-gradient(circle at 30% 30%, #ff6400, #cc5200);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    0 0 8px rgba(255, 100, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.panel-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 50%;
}

.panel-button:hover {
  transform: scale(1.1);
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.3),
    0 0 12px rgba(255, 100, 0, 0.8);
}

.panel-button:active {
  transform: scale(0.95);
}

.panel-button--pressed {
  background: radial-gradient(circle at 30% 30%, #ff3300, #cc0000) !important;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    0 0 12px rgba(255, 51, 0, 0.8) !important;
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
