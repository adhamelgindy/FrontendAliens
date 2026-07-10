<template>
  <div class="level-page">
    <div class="container level-page__inner">

      <!-- Back nav -->
      <div class="level-page__back">
        <NuxtLink to="/level/1" class="btn btn--ghost btn--sm">
          ← Level 01
        </NuxtLink>

        <span class="level-page__progress font-mono">
          Level 02 / 03
        </span>
      </div>

      <!-- Locked -->
      <div
        v-if="locked"
        class="alert alert--error"
      >
        <span>
          Access denied — complete Level 01 first.
        </span>

        <NuxtLink
          to="/level/1"
          class="btn btn--ghost btn--sm"
          style="margin-left:auto"
        >
          Go to Level 01
        </NuxtLink>
      </div>

      <template v-else>

        <!-- Header -->
        <div class="level-page__header">
          <p class="eyebrow">
            Build-Time Meltdown
          </p>

          <h1 class="level-page__title font-title">
            Level 02 — Identify the Right Layer
          </h1>

          <p class="level-page__narrative">
            The directive works, but the build is stalling. The ship's compiler
            reports that code is running in the wrong layers — modules, plugins,
            and scripts are all mixed up. Classify each fragment so the system
            knows when each piece runs. Then restore the project file structure.
          </p>
        </div>

        <!-- Signal -->
        <SignalBar
          :percent="signalPercent"
          :correct="isCorrect"
        />

        <!-- ========================================================= -->
        <!-- PART 1 -->
        <!-- ========================================================= -->

        <section class="repo-repair">

          <div class="waveform-preview__label font-mono">
            STEP 1 — STABILIZE THE SIGNAL FRAGMENTS
          </div>

          <div class="snippets-grid">

            <div
              v-for="snippet in SNIPPETS"
              :key="snippet.id"
              class="snippet-card"
              :class="{
                'snippet-card--correct': hasSubmitted && userSelections[snippet.id] === snippet.answer,
                'snippet-card--error':
                  hasSubmitted &&
                  userSelections[snippet.id] &&
                  userSelections[snippet.id] !== snippet.answer,
              }"
            >
              <div class="snippet-card__header font-mono">
                Fragment {{ snippet.id + 1 }}
              </div>

              <template v-if="snippet.code">
                <pre class="snippet-card__code"><code>{{ snippet.code }}</code></pre>
                <p v-if="snippet.caption" class="snippet-card__caption">{{ snippet.caption }}</p>
              </template>

              <p v-else class="snippet-card__prose">{{ snippet.description }}</p>

              <div class="category-btns">

                <button
                  v-for="category in ['Plugin', 'Module', 'Script']"
                  :key="category"
                  class="category-btn"
                  :class="{
                    'category-btn--selected':
                      userSelections[snippet.id] === category,

                    'category-btn--correct':
                      hasSubmitted &&
                      category === snippet.answer,

                    'category-btn--wrong':
                      hasSubmitted &&
                      userSelections[snippet.id] === category &&
                      category !== snippet.answer,
                  }"
                  @click="userSelections[snippet.id] = category as Category"
                >
                  {{ category }}
                </button>

              </div>
            </div>

          </div>

        </section>

        <!-- ========================================================= -->
        <!-- PART 2 -->
        <!-- ========================================================= -->

        <section class="repo-repair">

          <div class="waveform-preview__label font-mono">
            STEP 2 — REPAIR THE PROJECT STRUCTURE
          </div>

          <p class="level-page__narrative">
            The runtime layers are identified, but the project structure is
            still corrupted. Drag each file back into its proper location.
          </p>

          <!-- File tray -->

          <div class="file-tray">

            <div
              v-for="file in unplacedFiles"
              :key="file.id"
              class="file-chip"
              draggable="true"
              @dragstart="onDragStart(file.id)"
            >
              📄 {{ file.name }}
            </div>

          </div>

          <!-- Project tree -->

          <div class="project-tree">

            <!-- Components -->

            <div class="folder-row">

              <span>📁 components/</span>

              <div
                class="drop-zone"
                :class="{
                  'drop-zone--over': dragOverFolder === 'components',
                  'drop-zone--filled': getFileInFolder('components'),
                }"
                @dragover.prevent="dragOverFolder = 'components'"
                @dragleave="dragOverFolder = null"
                @drop="onDrop('components')"
              >
                <div
                  v-if="getFileInFolder('components')"
                  class="file-chip"
                  draggable="true"
                  @dragstart="onDragStart(getFileInFolder('components')!.id)"
                >
                  📄 {{ getFileInFolder('components')!.name }}
                </div>
              </div>

            </div>

            <!-- Composables -->

            <div class="folder-row folder-row--locked">
              <span>📁 composables/</span>
            </div>

            <!-- Modules -->

            <div class="folder-row">

              <span>📁 modules/</span>

              <div
                class="drop-zone"
                :class="{
                  'drop-zone--over': dragOverFolder === 'modules',
                  'drop-zone--filled': getFileInFolder('modules'),
                }"
                @dragover.prevent="dragOverFolder = 'modules'"
                @dragleave="dragOverFolder = null"
                @drop="onDrop('modules')"
              >
                <div
                  v-if="getFileInFolder('modules')"
                  class="file-chip"
                  draggable="true"
                  @dragstart="onDragStart(getFileInFolder('modules')!.id)"
                >
                  📄 {{ getFileInFolder('modules')!.name }}
                </div>
              </div>

            </div>

            <!-- Pages -->

            <div class="folder-row folder-row--locked">
              <span>📁 pages/</span>
            </div>

            <!-- Plugins -->

            <div class="folder-row">

              <span>📁 plugins/</span>

              <div
                class="drop-zone"
                :class="{
                  'drop-zone--over': dragOverFolder === 'plugins',
                  'drop-zone--filled': getFileInFolder('plugins'),
                }"
                @dragover.prevent="dragOverFolder = 'plugins'"
                @dragleave="dragOverFolder = null"
                @drop="onDrop('plugins')"
              >
                <div
                  v-if="getFileInFolder('plugins')"
                  class="file-chip"
                  draggable="true"
                  @dragstart="onDragStart(getFileInFolder('plugins')!.id)"
                >
                  📄 {{ getFileInFolder('plugins')!.name }}
                </div>
              </div>

            </div>

          </div>

        </section>

        <!-- Hint -->

        <div
          v-if="showHint"
          class="alert alert--hint"
        >
          <span>
            <strong>Module</strong> — runs once at build time to configure Nuxt before the app exists.
            <strong>Plugin</strong> — runs at app-boot to inject things every component can use.
            <strong>Script</strong> — loaded in the browser via <code>useScript()</code>, not a dedicated folder.
            Files: plugins go in <code>plugins/</code>, modules in <code>modules/</code>, components in <code>components/</code>.
          </span>
        </div>

        <!-- Error -->

        <div
          v-if="hasSubmitted && !isCorrect"
          class="alert alert--error"
        >
          <span>
            Layer mismatch detected — some fragments are in the wrong category or files are in the wrong folder.
          </span>
        </div>

        <!-- Success -->

        <div
          v-if="isCorrect"
          class="alert alert--success"
        >
          <span>
            ✧ LAYERS CLASSIFIED — BUILD STABILIZED ✧ The compiler can see which
            code runs when. Continue to Level 03 to wire it all together.
          </span>
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
            @click="resetLevel"
          >
            Reset
          </button>

          <button
            v-if="!isCorrect"
            class="btn btn--primary"
            :disabled="selectedCount !== 6 || placedCount !== 3"
            @click="checkAnswer"
          >
            ▶ Transmit Fix
          </button>

          <NuxtLink
            v-if="isCorrect"
            to="/level/3"
            class="btn btn--success"
          >
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

type Category = 'Plugin' | 'Module' | 'Script' | ''

type Folder = 'components' | 'modules' | 'plugins'

interface Snippet {
  id: number
  code?: string
  description?: string
  caption?: string
  answer: Exclude<Category, ''>
}

interface RepoFile {
  id: string
  name: string
  answer: Folder
}

const SNIPPETS: Snippet[] = [
  {
    id: 0,
    code: `export default defineNuxtModule((options, nuxt) => {
  nuxt.hook('modules:done', () => {
    addPlugin('./runtime/analytics.plugin')
  })
})`,
    caption: 'Recovered from the build archive. Logged as "pre-boot instruction" — timestamp predates first app render.',
    answer: 'Module',
  },
  {
    id: 1,
    description: `[SIGNAL LOG — SECTOR: BOOTSTRAP]
"Fragment executes exactly once, during system compilation, before the Golden Record's runtime even exists. It can rewrite the assembly instructions, hook into the compiler, and register other fragments — but it has no presence once the record is playing."`,
    answer: 'Module',
  },
  {
    id: 2,
    description: `[SIGNAL LOG — SECTOR: TRANSMISSION]
"A directive for pulling in an external broadcast without stalling the record's playback. Comes with its own timing protocol — load on idle, load on contact, or load manually — and is safe to run even while the record is being assembled remotely."`,
    answer: 'Script',
  },
  {
    id: 3,
    code: `export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const api = createApiClient(config.apiBase)
  return { provide: { api } }
})`,
    caption: 'Recovered from the live runtime buffer. Injects a shared resource into every active instance of the record.',
    answer: 'Plugin',
  },
  {
    id: 4,
    description: `[SIGNAL LOG — SECTOR: RUNTIME]
"Every playback instance of the Golden Record needs access to a shared relay, initialized the moment that instance boots — whether it's playing locally or being rendered remotely."`,
    answer: 'Plugin',
  },
  {
    id: 5,
    description: `[SIGNAL LOG — SECTOR: TRANSMISSION]
"An old fragment manually spliced an external broadcast directly into the runtime buffer. It worked, but it degraded playback quality and had no safe protocol for remote assembly. What should have handled it instead?"`,
    answer: 'Script',
  },
]

const FILES: RepoFile[] = [
  {
    id: 'analytics-plugin',
    name: 'analytics.client.ts',
    answer: 'plugins',
  },
  {
    id: 'analytics-module',
    name: 'signal.module.ts',
    answer: 'modules',
  },
  {
    id: 'analytics-banner',
    name: 'AnalyticsBanner.vue',
    answer: 'components',
  },
]

const userSelections = ref<Record<number, Category>>({
  0: '',
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
})

const fileLocations = ref<Record<string, string>>({
  'analytics-plugin': '',
  'analytics-module': '',
  'analytics-banner': '',
})

const hasSubmitted = ref(false)
const isCorrect = ref(false)
const showHint = ref(false)

const draggedFileId = ref<string | null>(null)
const dragOverFolder = ref<Folder | null>(null)

const correctSnippets = computed(() =>
  SNIPPETS.filter(
    snippet => userSelections.value[snippet.id] === snippet.answer,
  ).length,
)

const correctFiles = computed(() =>
  FILES.filter(
    file => fileLocations.value[file.id] === file.answer,
  ).length,
)

const correctCount = computed(() =>
  correctSnippets.value + correctFiles.value,
)

const signalPercent = computed(() => {
  if (isCorrect.value) {
    return 100
  }

  return Math.round((correctCount.value / 9) * 80)
})

const selectedCount = computed(() =>
  Object.values(userSelections.value).filter(Boolean).length,
)

const placedCount = computed(() =>
  Object.values(fileLocations.value).filter(Boolean).length,
)

const unplacedFiles = computed(() =>
  FILES.filter(file => !fileLocations.value[file.id]),
)

function getFileInFolder(folder: Folder) {
  const fileId = Object.entries(fileLocations.value).find(
    ([, value]) => value === folder,
  )?.[0]

  if (!fileId) {
    return null
  }

  return FILES.find(file => file.id === fileId) ?? null
}

function onDragStart(fileId: string) {
  draggedFileId.value = fileId
}

function onDrop(folder: Folder) {
  if (!draggedFileId.value) {
    return
  }

  const draggedId = draggedFileId.value

  const existingEntry = Object.entries(fileLocations.value).find(
    ([, value]) => value === folder,
  )

  if (existingEntry) {
    const [existingFileId] = existingEntry
    fileLocations.value[existingFileId] = ''
  }

  fileLocations.value[draggedId] = folder

  draggedFileId.value = null
  dragOverFolder.value = null
}

function checkAnswer() {
  hasSubmitted.value = true

  const snippetsOk = SNIPPETS.every(
    snippet => userSelections.value[snippet.id] === snippet.answer,
  )

  const filesOk = FILES.every(
    file => fileLocations.value[file.id] === file.answer,
  )

  if (snippetsOk && filesOk) {
    isCorrect.value = true
    game.completeLevel(2)
  }
}

function resetLevel() {
  hasSubmitted.value = false
  isCorrect.value = false
  showHint.value = false

  draggedFileId.value = null
  dragOverFolder.value = null

  for (const snippet of SNIPPETS) {
    userSelections.value[snippet.id] = ''
  }

  for (const file of FILES) {
    fileLocations.value[file.id] = ''
  }
}

onMounted(() => {
  if (!game.isLevelComplete(2)) {
    return
  }

  isCorrect.value = true
  hasSubmitted.value = true

  for (const snippet of SNIPPETS) {
    userSelections.value[snippet.id] = snippet.answer
  }

  for (const file of FILES) {
    fileLocations.value[file.id] = file.answer
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
}

.level-page__narrative {
  max-width: 700px;
  color: var(--muted);
  line-height: 1.7;
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

/* =======================================================
   Sections
======================================================= */

.repo-repair {
  display: flex;
  flex-direction: column;
  gap: 20px;

  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.waveform-preview__label {
  padding: 10px 16px;

  background: var(--navy-mid);

  border-bottom: 1px solid var(--border);

  font-size: .75rem;
  letter-spacing: .12em;
  text-transform: uppercase;

  color: var(--muted);
}

/* =======================================================
   Snippets
======================================================= */

.snippets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
  padding: 20px;
}

.snippet-card {
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 18px;

  border: 1px solid var(--border);
  border-radius: var(--radius);

  transition:
    border-color .25s,
    background .25s,
    transform .15s;
}

.snippet-card:hover {
  transform: translateY(-2px);
}

.snippet-card--correct {
  border-color: var(--success);
  background: rgba(34,197,94,.08);
}

.snippet-card--error {
  border-color: #e85a4a;
  background: rgba(232,90,74,.08);
}

.snippet-card__header {
  font-size: .75rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--muted);
}

.snippet-card__code {
  margin: 0;

  padding: 16px;

  border-radius: 10px;

  background: #0f172a;

  overflow-x: auto;

  font-family: var(--mono);
  font-size: .82rem;
  line-height: 1.5;

  color: #f8fafc;
}

.snippet-card__caption {
  font-size: 0.72rem;
  color: var(--muted);
  font-style: italic;
  margin: 0;
}

.snippet-card__prose {
  margin: 0;

  padding: 16px;

  border-radius: 10px;

  background: rgba(15, 23, 42, 0.5);

  font-family: var(--mono);
  font-size: 0.8rem;
  color: #f8fafc;
  white-space: pre-wrap;
  line-height: 1.6;
}

/* =======================================================
   Category buttons
======================================================= */

.category-btns {
  display: flex;
  gap: 10px;
}

.category-btn {
  flex: 1;

  padding: 10px;

  background: transparent;

  border: 1px solid var(--border);
  border-radius: 999px;

  cursor: pointer;

  color: var(--text);

  transition: .2s;
}

.category-btn:hover:not(:disabled) {
  border-color: var(--gold);
}

.category-btn--selected {
  border-color: var(--gold);
  background: rgba(245,158,11,.12);
}

.category-btn--correct {
  border-color: var(--success);
  background: rgba(34,197,94,.12);
}

.category-btn--wrong {
  border-color: #e85a4a;
  background: rgba(232,90,74,.12);
}

/* =======================================================
   Repository repair
======================================================= */

.file-tray {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  padding: 0 20px;
}

.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 14px;

  border: 1px solid var(--border);
  border-radius: 999px;

  background: var(--navy-mid);

  font-family: var(--mono);
  font-size: .82rem;

  cursor: grab;
  user-select: none;

  transition:
    transform .15s,
    border-color .2s;
}

.file-chip:hover {
  transform: translateY(-2px);
  border-color: var(--gold);
}

.file-chip:active {
  cursor: grabbing;
}

.project-tree {
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 0 20px 20px;
}

.folder-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.folder-row > span {
  width: 180px;

  font-family: var(--mono);

  color: var(--white);
}

.folder-row--locked {
  opacity: .45;
}

.drop-zone {
  flex: 1;

  min-height: 58px;

  display: flex;
  align-items: center;

  padding: 8px 10px;

  border: 2px dashed var(--border);
  border-radius: var(--radius);

  transition:
    border-color .2s,
    background .2s;
}

.drop-zone--over {
  border-color: var(--gold);
  background: rgba(245,158,11,.08);
}

.drop-zone--filled {
  border-style: solid;
}

/* =======================================================
   Responsive
======================================================= */

@media (max-width: 768px) {

  .snippets-grid {
    grid-template-columns: 1fr;
  }

  .category-btns {
    flex-direction: column;
  }

  .folder-row {
    flex-direction: column;
    align-items: stretch;
  }

  .folder-row > span {
    width: auto;
  }

  .file-tray {
    flex-direction: column;
  }
}
</style>