<template>
  <div class="finale">
    <div class="container finale__inner">

      <!-- Eyebrow -->
      <p class="eyebrow finale__eyebrow">Mission Complete</p>

      <!-- Spinning record -->
      <div class="finale__record-wrap">
        <div class="record" />
        <div class="finale__record-glow" />
      </div>

      <!-- Headline -->
      <h1 class="finale__title font-title">
        Golden Record<br />
        <span class="finale__title--accent">Restored</span>
      </h1>

      <p class="finale__subtitle">
        Voyager 1 — Back Online Forever
      </p>

      <!-- Stats row -->
      <div class="stat-row finale__stats">
        <div class="stat-tile">
          <div class="stat-tile__value text-green">3</div>
          <div class="stat-tile__label">Levels</div>
        </div>
        <div class="stat-tile">
          <div class="stat-tile__value text-green">✓</div>
          <div class="stat-tile__label">Mission</div>
        </div>
        <div class="stat-tile">
          <div class="stat-tile__value" style="font-size:1.4rem;">🍔</div>
          <div class="stat-tile__label">Reward</div>
        </div>
      </div>

      <!-- Mission log -->
      <div class="mission-log card">
        <div class="mission-log__header font-mono">
          Mission Log — Transmission Record
        </div>
        <div class="mission-log__entries">
          <div class="log-entry" v-for="entry in logEntries" :key="entry.time">
            <span class="log-entry__time font-mono text-muted">{{ entry.time }}</span>
            <span :class="['log-entry__status', 'font-mono', entry.statusClass]">
              {{ entry.status }}
            </span>
            <span class="log-entry__msg">{{ entry.msg }}</span>
          </div>
        </div>
      </div>

      <!-- Comparison table — What you learned -->
      <div class="comparison card">
        <div class="comparison__title font-mono" style="font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; color:var(--muted);">
          Three Layers of Nuxt
        </div>
        <table class="comparison__table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Where</th>
              <th>When</th>
              <th>What it's for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="comparison__layer">&lt;script setup&gt;</td>
              <td class="font-mono">.vue component</td>
              <td>Per component mount</td>
              <td>Reactive state, computed values, local logic</td>
            </tr>
            <tr>
              <td class="comparison__layer">defineNuxtPlugin</td>
              <td class="font-mono">plugins/*.ts</td>
              <td>Once at app boot (runtime)</td>
              <td>Global helpers, $inject, third-party init</td>
            </tr>
            <tr>
              <td class="comparison__layer">nuxt.config.ts</td>
              <td class="font-mono">Project root</td>
              <td>Build time (never in browser)</td>
              <td>Modules, runtimeConfig, HTML head, routes</td>
            </tr>
          </tbody>
        </table>
        <p class="comparison__caption text-muted" style="font-size:0.75rem; margin-top:14px;">
          Three layers. One mission. Now you know where each piece lives.
        </p>
      </div>

      <!-- Alien message -->
      <div class="alien-box card">
        <div class="alien-box__eyebrow eyebrow" style="margin-bottom:12px;">
          Decoded Alien Response
        </div>
        <p class="alien-box__msg font-mono">
          "WE RECEIVED YOUR GOLDEN RECORD. YOUR MUSIC IS BEAUTIFUL.
          WE ESPECIALLY LIKED 'JOHNNY B. GOODE'.
          WE HAVE SENT OUR OWN RECORD IN RESPONSE.
          IT ARRIVES IN APPROXIMATELY 40,000 YEARS.
          PLEASE KEEP THE LIGHTS ON."
        </p>
        <p class="alien-box__sig text-muted font-mono" style="font-size:0.72rem; margin-top:12px; letter-spacing:0.1em;">
          — TRANSMISSION ORIGIN: UNKNOWN / DISTANCE: ∞
        </p>
      </div>

      <!-- YouTube embed -->
      <div class="video-wrap card">
        <div class="video-wrap__label font-mono" style="font-size:0.72rem; letter-spacing:0.1em; color:var(--muted); text-transform:uppercase; margin-bottom:14px;">
          Golden Record — Original Audio
        </div>
        <div class="video-wrap__player">
          <template v-if="!videoPlaying">
            <button class="video-thumb" @click="videoPlaying = true" aria-label="Play Golden Record video">
              <div class="video-thumb__bg" />
              <div class="video-thumb__overlay">
                <div class="video-thumb__play">▶</div>
                <p class="video-thumb__title font-mono">
                  Voyager Golden Record — Sounds of Earth
                </p>
              </div>
            </button>
          </template>
          <template v-else>
            <iframe
              class="video-iframe"
              src="https://www.youtube.com/embed/v6oC2tPKdec?autoplay=1&rel=0"
              title="Voyager Golden Record — Sounds of Earth"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </template>
        </div>
      </div>

      <!-- Play again -->
      <div class="finale__actions">
        <button class="btn btn--primary btn--large" @click="handlePlayAgain">
          ↺ Play Again
        </button>
        <a
          href="https://youtu.be/v6oC2tPKdec"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--ghost"
        >
          Listen on YouTube ↗
        </a>
      </div>

      <!-- Footer -->
      <footer class="finale__footer font-mono">
        <p>
          Voyager 1 — Launched September 5, 1977 &nbsp;·&nbsp;
          Still transmitting &nbsp;·&nbsp;
          23.6 billion km from Earth
        </p>
        <p class="text-muted" style="font-size:0.7rem; margin-top:6px;">
          Built with Nuxt 3 — component, plugin, and build layers fully restored.
        </p>
      </footer>

    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const game   = useGame()

const videoPlaying = ref(false)

const logEntries = [
  {
    time:        'T+00:00:01',
    status:      'REPAIRED',
    statusClass: 'text-green',
    msg:         'Component boot layer — reactive state initialised via ref() and computed()',
  },
  {
    time:        'T+00:00:02',
    status:      'REPAIRED',
    statusClass: 'text-green',
    msg:         'Plugin bay — signal formatter injected via defineNuxtPlugin and nuxtApp.provide()',
  },
  {
    time:        'T+00:00:03',
    status:      'REPAIRED',
    statusClass: 'text-green',
    msg:         'Build config — modules, runtimeConfig.public, and app.head.meta corrected',
  },
  {
    time:        'T+00:00:04',
    status:      'ONLINE',
    statusClass: 'text-gold',
    msg:         'Voyager 1 Golden Record — full playback confirmed at 8.4 GHz',
  },
  {
    time:        'T+00:00:05',
    status:      'RECEIVED',
    statusClass: 'text-orange',
    msg:         'Alien response signal detected — decoding in progress',
  },
]

function handlePlayAgain() {
  game.resetGame()
  router.push('/')
}
</script>

<style scoped>
.finale {
  flex: 1;
  padding: 64px 0 100px;
}

.finale__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  text-align: center;
  max-width: 700px;
}

.finale__eyebrow {
  align-self: center;
}

/* Record */
.finale__record-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
}

.finale__record-glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,200,66,0.18) 0%, transparent 70%);
  pointer-events: none;
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%       { transform: scale(1.1); opacity: 0.6; }
}

/* Headline */
.finale__title {
  font-size: clamp(2.4rem, 8vw, 4rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--white);
}

.finale__title--accent {
  color: var(--gold);
}

.finale__subtitle {
  font-family: var(--mono);
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green);
  margin-top: -20px;
}

/* Stats */
.finale__stats {
  width: 100%;
  max-width: 460px;
}

/* Mission log */
.mission-log {
  width: 100%;
  text-align: left;
}

.mission-log__header {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 16px;
}

.mission-log__entries {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-entry {
  display: flex;
  gap: 14px;
  align-items: baseline;
  flex-wrap: wrap;
  font-size: 0.83rem;
}

.log-entry__time {
  font-size: 0.72rem;
  flex-shrink: 0;
}

.log-entry__status {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  min-width: 72px;
}

.log-entry__msg {
  color: var(--text);
  line-height: 1.5;
}

/* Alien box */
.alien-box {
  width: 100%;
  text-align: left;
  border-color: var(--orange);
  background: var(--orange-dim);
}

.alien-box__msg {
  font-size: 0.85rem;
  line-height: 1.8;
  color: var(--text);
  letter-spacing: 0.02em;
}

/* Video */
.video-wrap {
  width: 100%;
  text-align: left;
}

.video-wrap__player {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: calc(var(--radius) - 2px);
  overflow: hidden;
  background: #080f1a;
}

.video-thumb {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  display: block;
}

.video-thumb__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #080f1a 0%, var(--navy-mid) 100%);
}

.video-thumb__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.video-thumb__play {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: var(--white);
  transition: transform 0.2s, background 0.2s;
  padding-left: 4px;
}

.video-thumb:hover .video-thumb__play {
  transform: scale(1.1);
  background: var(--orange-l);
}

.video-thumb__title {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-transform: uppercase;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* Actions */
.finale__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Comparison table */
.comparison {
  width: 100%;
  text-align: left;
}

.comparison__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.comparison__table thead {
  border-bottom: 2px solid var(--border);
}

.comparison__table th {
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: var(--green);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.comparison__table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--border);
  line-height: 1.4;
}

.comparison__layer {
  font-family: var(--mono);
  color: var(--orange);
  font-size: 0.85rem;
}

.comparison__caption {
  font-style: italic;
}

/* Footer */
.finale__footer {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-align: center;
  border-top: 1px solid var(--border);
  padding-top: 32px;
  width: 100%;
}
</style>
