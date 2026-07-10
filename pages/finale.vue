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

        <!-- File tray (left) -->
        <div class="puzzle__left">
          <div class="puzzle__tray-label font-mono">YOUR FILES</div>
          <div class="puzzle__tray">
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

        <!-- Project tree (right) -->
        <div class="puzzle__right">
          <div class="puzzle__tree-label font-mono">PROJECT STRUCTURE</div>
          <div class="puzzle__tree">
            <div class="tree-node">
              <span class="tree-node__icon">📁</span>
              <span class="tree-node__name">project-root/</span>
            </div>
            <div
              v-for="folder in FOLDERS"
              :key="folder.id"
              class="tree-folder"
              :class="[
                dragOver === folder.id ? 'tree-folder--over' : '',
                folderFilled(folder.id) ? 'tree-folder--filled' : '',
              ]"
              @dragover.prevent="dragOver = folder.id"
              @dragleave="dragOver = null"
              @drop="onDrop(folder.id)"
            >
              <span class="tree-folder__icon">📁</span>
              <span class="tree-folder__name">{{ folder.name }}/</span>
              <div v-if="getFilesInFolder(folder.id).length" class="tree-folder__contents">
                <div
                  v-for="file in getFilesInFolder(folder.id)"
                  :key="file.id"
                  class="tree-file"
                  :class="{ 'tree-file--correct': folderCorrect(folder.id, file.id) }"
                >
                  <span class="tree-file__icon">📄</span>
                  <span class="tree-file__name">{{ file.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Puzzle error -->
      <div v-if="showPuzzleError" class="alert alert--error">
        <span>Wrong folder — a file is in the wrong directory. Check which folder each file belongs to.</span>
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
      <div class="mission-log card" ref="logRef">
        <div class="mission-log__header font-mono">
          {{ typedHeader }}<span v-if="typingHeader" class="cursor">▌</span>
        </div>
        <div class="mission-log__entries">
          <div
            v-for="(entry, i) in logEntries"
            :key="entry.time"
            class="log-entry"
            :class="{ 'log-entry--visible': i < visibleEntries }"
          >
            <span class="log-entry__time font-mono text-muted">{{ typed[i]?.time ?? '' }}<span v-if="typingEntry === i && typingField === 'time'" class="cursor">▌</span></span>
            <span :class="['log-entry__status', 'font-mono', entry.statusClass]">
              {{ typed[i]?.status ?? '' }}<span v-if="typingEntry === i && typingField === 'status'" class="cursor">▌</span>
            </span>
            <span class="log-entry__msg">{{ typed[i]?.msg ?? '' }}<span v-if="typingEntry === i && typingField === 'msg'" class="cursor">▌</span></span>
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
  answer: string   // folder id it belongs to
}

interface PuzzleFolder {
  id: string
  name: string
}

const FILES: PuzzleFile[] = [
  { id: 'directive', name: 'signal-readout.vue',      answer: 'components' },
  { id: 'module',    name: 'signal.ts',               answer: 'modules'    },
  { id: 'plugin',    name: 'signalTracker.ts',        answer: 'plugins'    },
]

const FOLDERS: PuzzleFolder[] = [
  { id: 'components', name: 'components' },
  { id: 'modules',    name: 'modules'    },
  { id: 'plugins',    name: 'plugins'    },
]

const placements   = ref<Record<string, string>>({})  // folderId → fileId (can be multiple)
const draggedId    = ref<string | null>(null)
const dragOver     = ref<string | null>(null)
const puzzleSolved = ref(false)
const showPuzzleError = ref(false)

const placedCount = computed(() => Object.values(placements.value).filter(Boolean).length)

function isPlaced(fileId: string) {
  return Object.values(placements.value).includes(fileId)
}

function folderFilled(folderId: string) {
  return puzzleSolved.value && folderId in placements.value
}

function folderCorrect(folderId: string, fileId: string) {
  const file = FILES.find(f => f.id === fileId)
  return file?.answer === folderId
}

function getFilesInFolder(folderId: string) {
  return FILES.filter(f => placements.value[f.id] === folderId)
}

function onDragStart(fileId: string) {
  draggedId.value = fileId
}

function onDrop(folderId: string) {
  dragOver.value = null
  if (!draggedId.value) return

  // Remove file from any existing folder
  for (const fileId of Object.keys(placements.value)) {
    if (placements.value[fileId] === folderId) {
      delete placements.value[fileId]
    }
  }
  placements.value[draggedId.value] = folderId
  draggedId.value = null
  showPuzzleError.value = false
}

function checkPuzzle() {
  const allCorrect = FILES.every(f => placements.value[f.id] === f.answer)
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

// ── Mission log typewriter ────────────────────────────────────────────────

const HEADER_TEXT = 'Mission Log — Transmission Record'
const CHAR_DELAY  = 28   // ms per character
const ENTRY_GAP   = 120  // ms pause between entries

const logRef       = ref<HTMLElement | null>(null)
const typedHeader  = ref('')
const typingHeader = ref(false)
const visibleEntries = ref(0)
const typingEntry  = ref<number | null>(null)
const typingField  = ref<'time' | 'status' | 'msg' | null>(null)

const typed = ref<{ time: string; status: string; msg: string }[]>(
  logEntries.map(() => ({ time: '', status: '', msg: '' }))
)

function typeString(setter: (v: string) => void, full: string): Promise<void> {
  return new Promise(resolve => {
    let i = 0
    function step() {
      setter(full.slice(0, i))
      if (i++ <= full.length) setTimeout(step, CHAR_DELAY)
      else resolve()
    }
    step()
  })
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function startTypewriter() {
  typingHeader.value = true
  await typeString(v => { typedHeader.value = v }, HEADER_TEXT)
  typingHeader.value = false
  await wait(ENTRY_GAP)

  for (let i = 0; i < logEntries.length; i++) {
    const entry = logEntries[i]
    const row   = typed.value[i]
    visibleEntries.value = i + 1
    typingEntry.value    = i

    typingField.value = 'time'
    await typeString(v => { row.time = v }, entry.time)
    typingField.value = 'status'
    await typeString(v => { row.status = v }, entry.status)
    typingField.value = 'msg'
    await typeString(v => { row.msg = v }, entry.msg)

    typingEntry.value = null
    typingField.value = null
    await wait(ENTRY_GAP)
  }
}

onMounted(() => {
  if (!logRef.value) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        startTypewriter()
      }
    },
    { threshold: 0.2 },
  )
  observer.observe(logRef.value)
})
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
  max-width: 700px;
  display: flex;
  gap: 40px;
  justify-content: space-between;
}

.puzzle__left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 0 0 auto;
}

.puzzle__tray-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.puzzle__tray {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  min-width: 200px;
}

.file-chip:hover {
  border-color: var(--gold);
}

.file-chip--placed {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}

.puzzle__right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.puzzle__tree-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.puzzle__tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tree-node {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text);
  font-family: var(--mono);
  padding: 6px 0;
}

.tree-node__icon {
  font-size: 0.9rem;
}

.tree-node__name {
  font-weight: 500;
}

.tree-folder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px;
  margin-left: 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  transition: border-color 0.2s, background 0.2s;
  min-height: 40px;
}

.tree-folder--over {
  border-color: var(--gold);
  background: rgba(245, 200, 66, 0.08);
}

.tree-folder--filled {
  border-color: var(--success);
  border-style: solid;
  background: rgba(34, 197, 94, 0.08);
}

.tree-folder > :first-child {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.82rem;
  font-family: var(--mono);
  color: var(--text);
}

.tree-folder__icon {
  font-size: 0.9rem;
}

.tree-folder__name {
  font-weight: 500;
}

.tree-folder__contents {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.tree-file {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.75rem;
  font-family: var(--mono);
  color: var(--muted);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.tree-file--correct {
  color: var(--green);
  background: rgba(34, 197, 94, 0.12);
}

.tree-file__icon {
  font-size: 0.75rem;
}

.tree-file__name {
  word-break: break-all;
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
  display: none;
  gap: 14px;
  align-items: baseline;
  flex-wrap: wrap;
  font-size: 0.83rem;
}

.log-entry--visible {
  display: flex;
}

.cursor {
  display: inline-block;
  animation: blink-cursor 0.7s step-end infinite;
  color: var(--green);
  font-weight: 400;
  margin-left: 1px;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
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
