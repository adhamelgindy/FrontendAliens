<template>
  <div class="finale">
    <div class="container finale__inner">

      <!-- Eyebrow -->
      <p class="eyebrow finale__eyebrow">Final Assembly</p>

      <!-- Intro -->
      <div class="finale__intro">
        <h1 class="finale__title font-title">
          Slot the Files<br />
          <span class="finale__title--accent">Into the Record</span>
        </h1>
        <p class="finale__subtitle-pre font-mono">
          Three layers. Three files. One record.
        </p>
      </div>

      <!-- ── Drag puzzle ── -->
      <div class="puzzle">

        <!-- File tray -->
        <div class="puzzle__tray">
          <div class="puzzle__tray-label font-mono">YOUR FILES</div>
          <div class="puzzle__chips">
            <div
              v-for="file in FILES"
              :key="file.id"
              class="file-chip"
              :class="{ 'file-chip--placed': isPlaced(file.id) }"
              draggable="true"
              @dragstart="onDragStart(file.id)"
            >
              📄 {{ file.name }}
            </div>
          </div>
        </div>

        <!-- Record with drop zones -->
        <div class="puzzle__record-area">
          <div
            class="puzzle__record"
            :class="{ 'puzzle__record--solved': puzzleSolved }"
          >
            <div class="record" />
            <div
              class="puzzle__record-glow"
              :class="{ 'puzzle__record-glow--solved': puzzleSolved }"
            />
          </div>

          <!-- Three drop zones orbiting the record -->
          <div
            v-for="slot in SLOTS"
            :key="slot.id"
            class="drop-slot"
            :class="[
              `drop-slot--${slot.position}`,
              dragOver === slot.id ? 'drop-slot--over' : '',
              slotFilled(slot.id) ? 'drop-slot--correct' : '',
              slotWrong(slot.id) ? 'drop-slot--wrong' : '',
            ]"
            @dragover.prevent="dragOver = slot.id"
            @dragleave="dragOver = null"
            @drop="onDrop(slot.id)"
          >
            <span class="drop-slot__layer font-mono">{{ slot.label }}</span>
            <span v-if="slotFilled(slot.id)" class="drop-slot__file font-mono">
              📄 {{ getPlacedFile(slot.id)?.name }}
            </span>
            <span v-else class="drop-slot__empty text-muted">drop here</span>
          </div>
        </div>

      </div>

      <!-- Puzzle error -->
      <div v-if="showPuzzleError" class="alert alert--error">
        <span>Wrong layer — a file is in the wrong slot. Check which layer each file belongs to.</span>
      </div>

      <!-- Puzzle submit -->
      <div v-if="!puzzleSolved" class="puzzle__actions">
        <button class="btn btn--ghost" @click="resetPuzzle">Reset</button>
        <button
          class="btn btn--primary"
          :disabled="placedCount !== 3"
          @click="checkPuzzle"
        >
          ▶ Transmit Assembly
        </button>
      </div>

      <!-- ── Reveal ── -->
      <template v-if="puzzleSolved">

      <!-- Record restored headline -->
      <div class="finale__reveal">
        <div class="finale__record-wrap">
          <div class="record" />
          <div class="finale__record-glow" />
        </div>
        <h2 class="finale__reveal-title font-title">
          Golden Record<br />
          <span class="finale__title--accent">Restored</span>
        </h2>
        <p class="finale__subtitle">
          Voyager 1 — Back Online Forever
        </p>
      </div>

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

      </template><!-- end puzzleSolved reveal -->

    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const game   = useGame()

const videoPlaying = ref(false)

// ── Drag-and-drop puzzle ──────────────────────────────────────────────────

interface PuzzleFile {
  id: string
  name: string
  answer: string   // slot id it belongs to
}

interface PuzzleSlot {
  id: string
  label: string
  position: 'top' | 'left' | 'right'
}

const FILES: PuzzleFile[] = [
  { id: 'directive', name: 'signal-readout.vue',      answer: 'component' },
  { id: 'module',    name: 'modules/signal.ts',        answer: 'module'    },
  { id: 'plugin',    name: 'plugins/signalTracker.ts', answer: 'plugin'    },
]

const SLOTS: PuzzleSlot[] = [
  { id: 'component', label: 'Component',     position: 'top'   },
  { id: 'module',    label: 'Nuxt Module',   position: 'left'  },
  { id: 'plugin',    label: 'Nuxt Plugin',   position: 'right' },
]

const placements   = ref<Record<string, string>>({})  // slotId → fileId
const draggedId    = ref<string | null>(null)
const dragOver     = ref<string | null>(null)
const puzzleSolved = ref(false)
const showPuzzleError = ref(false)

const placedCount = computed(() => Object.keys(placements.value).length)

function isPlaced(fileId: string) {
  return Object.values(placements.value).includes(fileId)
}

function slotFilled(slotId: string) {
  return puzzleSolved.value && slotId in placements.value
}

function slotWrong(slotId: string) {
  return showPuzzleError.value && slotId in placements.value &&
    FILES.find(f => f.id === placements.value[slotId])?.answer !== slotId
}

function getPlacedFile(slotId: string) {
  const fileId = placements.value[slotId]
  return fileId ? FILES.find(f => f.id === fileId) : null
}

function onDragStart(fileId: string) {
  draggedId.value = fileId
}

function onDrop(slotId: string) {
  dragOver.value = null
  if (!draggedId.value) return

  // Remove file from any existing slot
  for (const s in placements.value) {
    if (placements.value[s] === draggedId.value) delete placements.value[s]
  }
  placements.value[slotId] = draggedId.value
  draggedId.value = null
  showPuzzleError.value = false
}

function checkPuzzle() {
  const allCorrect = FILES.every(f => placements.value[f.answer] === f.id)
  if (allCorrect) {
    puzzleSolved.value = true
    showPuzzleError.value = false
  } else {
    showPuzzleError.value = true
  }
}

function resetPuzzle() {
  placements.value = {}
  showPuzzleError.value = false
}

// ─────────────────────────────────────────────────────────────────────────

const logEntries = [
  {
    time:        'T+00:00:01',
    status:      'REPAIRED',
    statusClass: 'text-green',
    msg:         'signal-readout.vue — v-signal directive implemented, signal bar responding',
  },
  {
    time:        'T+00:00:02',
    status:      'REPAIRED',
    statusClass: 'text-green',
    msg:         'modules/signal.ts — defineNuxtModule registered signalTracker at build time',
  },
  {
    time:        'T+00:00:03',
    status:      'REPAIRED',
    statusClass: 'text-green',
    msg:         'plugins/signalTracker.ts — defineNuxtPlugin injected tracker into every component',
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
/* ── Puzzle ─────────────────────────────────────────────────────────────── */

.finale__intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.finale__subtitle-pre {
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.puzzle {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.puzzle__tray {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.puzzle__tray-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.puzzle__chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.file-chip {
  padding: 8px 14px;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text);
  cursor: grab;
  transition: opacity 0.2s, border-color 0.2s;
  user-select: none;
}

.file-chip:hover {
  border-color: var(--gold);
}

.file-chip--placed {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}

/* Record area */
.puzzle__record-area {
  position: relative;
  width: 340px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle__record {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle__record-glow {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%);
  pointer-events: none;
  transition: background 0.6s;
}

.puzzle__record-glow--solved {
  background: radial-gradient(circle, rgba(245,200,66,0.35) 0%, transparent 70%);
  animation: pulse-glow 3s ease-in-out infinite;
}

/* Drop slots positioned around the record */
.drop-slot {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  min-width: 140px;
  background: rgba(15,23,42,0.8);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  font-size: 0.75rem;
  text-align: center;
  transition: border-color 0.2s, background 0.2s;
}

.drop-slot--top    { top: 0;    left: 50%; transform: translateX(-50%); }
.drop-slot--left   { left: 0;   top: 50%;  transform: translateY(-50%); }
.drop-slot--right  { right: 0;  top: 50%;  transform: translateY(-50%); }

.drop-slot--over {
  border-color: var(--gold);
  background: rgba(245,200,66,0.08);
}

.drop-slot--correct {
  border-color: var(--success);
  border-style: solid;
  background: rgba(34,197,94,0.08);
}

.drop-slot--wrong {
  border-color: #e85a4a;
  border-style: solid;
  background: rgba(232,90,74,0.08);
}

.drop-slot__layer {
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.drop-slot__file {
  font-size: 0.72rem;
  color: var(--green);
}

.drop-slot__empty {
  font-size: 0.72rem;
  font-style: italic;
}

.puzzle__actions {
  display: flex;
  gap: 12px;
}

/* Reveal section */
.finale__reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: fade-in 0.8s ease both;
}

.finale__reveal-title {
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--white);
  text-align: center;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Original finale styles ─────────────────────────────────────────────── */

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
