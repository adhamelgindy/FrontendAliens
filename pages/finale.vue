<template>
  <div class="finale">
    <div class="container finale__inner">

      <!-- Eyebrow -->
      <p class="eyebrow finale__eyebrow">Plugin Registration Order</p>

      <!-- Intro -->
      <div class="finale__intro">
        <h1 class="finale__title font-title">
          Order the Plugins<br />
          <span class="finale__title--accent">By Boot Sequence</span>
        </h1>
        <p class="finale__subtitle-pre font-mono">
          Filenames sort as strings — not numbers
        </p>
      </div>

      <!-- Explanation -->
      <div class="puzzle-explainer card">
        <p class="puzzle-explainer__text">
          You can control the order in which plugins are registered by prefixing with 'alphabetical' numbering to the file names. This is useful in situations where you have a plugin that depends on another plugin.
        </p>
      </div>

      <!-- ── Drag puzzle ── -->
      <div class="puzzle" :class="{ 'puzzle--solved': puzzleSolved }">

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
          <div class="puzzle__tree-label font-mono">BOOT SEQUENCE</div>
          <div class="puzzle__tree">
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
              <span class="tree-folder__icon">{{ SLOT_ICONS[folder.id] }}</span>
              <span class="tree-folder__name">{{ SLOT_LABELS[folder.id] }}</span>
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
        <span>Wrong order — remember: filenames sort as strings. "2" comes after "10" alphabetically.</span>
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

      <!-- Live Signal Tracker -->
      <div v-if="puzzleSolved" class="signal-tracker card">
        <div class="signal-tracker__header font-mono">Live Signal Tracker</div>
        <div class="signal-tracker__container">
          <div class="signal-tracker__bar-wrapper">
            <div class="signal-tracker__bar">
              <div
                class="signal-tracker__fill"
                :style="{
                  width: liveSignal + '%',
                  backgroundColor: getSignalColor(liveSignal),
                }"
              />
            </div>
          </div>
          <div class="signal-tracker__status">
            <span class="signal-tracker__value font-mono">{{ Math.round(liveSignal) }}%</span>
            <span v-if="liveSignal < 40" class="status-critical">🔴 CRITICAL</span>
            <span v-else-if="liveSignal < 100" class="status-weak">🟠 WEAK</span>
            <span v-else class="status-strong">🟢 SIGNAL LOCKED</span>
          </div>
        </div>
      </div>

      <!-- Entity CTA -->
      <div v-if="liveSignal >= 100" class="finale__run">
        <NuxtLink to="/outro" class="btn btn--success btn--large">
          ▶ Run the golden record 
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const game   = useGame()
const { triggerRestoration } = useSystemRestoration()

const liveSignal = ref(0)

function getSignalColor(value: number): string {
  if (value < 40) return 'red'
  if (value < 80) return 'orange'
  return 'green'
}


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
  { id: 'config',  name: '01.signal-config.ts',  answer: 'slot1' },
  { id: 'tracker', name: '10.signal-tracker.ts', answer: 'slot2' },
  { id: 'helper',  name: '2.mission-helper.ts',  answer: 'slot3' },
]

const FOLDERS: PuzzleFolder[] = [
  { id: 'slot1', name: 'slot1' },
  { id: 'slot2', name: 'slot2' },
  { id: 'slot3', name: 'slot3' },
]

const SLOT_LABELS: Record<string, string> = {
  slot1: 'Boots 1st',
  slot2: 'Boots 2nd',
  slot3: 'Boots 3rd',
}

const SLOT_ICONS: Record<string, string> = {
  slot1: '①',
  slot2: '②',
  slot3: '③',
}

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
    triggerRestoration()
  } else {
    showPuzzleError.value = true
  }
}

function resetPuzzle() {
  placements.value = {}
  showPuzzleError.value = false
}

watch(puzzleSolved, (solved) => {
  if (!solved) return
  const startTime = Date.now()
  const duration = 2500
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    liveSignal.value = Math.round(progress * 100)
    if (progress >= 1) clearInterval(interval)
  }, 30)
})

// ─────────────────────────────────────────────────────────────────────────

const logEntries = [
  {
    time:        'T+00:00:01',
    status:      'BOOTED',
    statusClass: 'text-green',
    msg:         '01.signal-config.ts — boots first, $signalConfig available',
  },
  {
    time:        'T+00:00:02',
    status:      'BOOTED',
    statusClass: 'text-green',
    msg:         '10.signal-tracker.ts — boots second ("10" < "2" as strings), safely reads $signalConfig',
  },
  {
    time:        'T+00:00:03',
    status:      'BOOTED',
    statusClass: 'text-green',
    msg:         '2.mission-helper.ts — boots last ("2" > "10" alphabetically — the string-sort trap)',
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

.puzzle--solved {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s ease-out;
  pointer-events: none;
}

/* Reveal section */
.finale__reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: reveal-pop 1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes reveal-pop {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.finale__reveal-title {
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--white);
  text-align: center;
}

@keyframes typewriter-fade {
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

/* Puzzle explainer */
.puzzle-explainer {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.puzzle-explainer__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.7;
}

.puzzle-explainer__text code {
  font-family: var(--mono);
  color: var(--orange);
  font-size: 0.85em;
}

.puzzle-explainer__text strong {
  color: var(--text);
}

.puzzle-explainer__text em {
  color: var(--gold);
  font-style: normal;
  font-weight: 600;
}

/* Signal tracker */
.signal-tracker {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-tracker__header {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.signal-tracker__container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signal-tracker__bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signal-tracker__bar {
  width: 100%;
  height: 40px;
  border: 2px solid rgba(52, 211, 153, 0.5);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.signal-tracker__fill {
  height: 100%;
  transition: width 0.05s linear, background-color 0.3s;
}

.signal-tracker__status {
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.signal-tracker__value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gold);
  min-width: 60px;
  text-align: center;
}

.status-critical { color: #ef4444; }
.status-weak     { color: #f97316; }
.status-strong   { color: #22c55e; }

.finale__run {
  display: flex;
  justify-content: center;
  animation: reveal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
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
