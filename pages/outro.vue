<template>
  <div class="outro">
    <div class="container outro__inner">

      
      <!-- Entity hex -->
      <div class="entity-header">
        <div class="entity-hex-wrap">
          <div class="entity-hex-glow" />
          <div class="entity-hex">⬡</div>
        </div>
        <p class="eyebrow entity-eyebrow">CONGRATS</p>
        <h1 class="entity-headline font-title">
          <span class="entity-typed">{{ entityTyped }}</span><span v-if="typingHeadline" class="cursor">█</span>
        </h1>
      </div>
      
       <!-- Alien message -->
      <div v-if="showAlienMsg" class="alien-box card">
        <div class="alien-box__eyebrow eyebrow" style="margin-bottom:12px;">
          Decoded Alien Response
        </div>
        <p class="alien-box__msg font-mono">
          "WE RECEIVED YOUR GOLDEN RECORD. YOUR MUSIC IS BEAUTIFUL.
          WE ESPECIALLY LIKED 'The double cheese Burger'.
          WE HAVE SENT OUR OWN RECORD IN RESPONSE.
          IT ARRIVES IN APPROXIMATELY 40,000 light YEARS.
          In the mean time, feel free to give me a call, I have something I need to tell you..."
        </p>
        <p class="alien-box__sig font-mono" style="font-size:0.72rem; margin-top:12px; letter-spacing:0.1em; color:var(--muted);">
          — TRANSMISSION ORIGIN: Nuxios / DISTANCE: 40,000 light YEARS
        </p>
      </div>

      <!-- Holy Grail card -->
      <div v-if="showGrail" class="holy-grail card">
        <!-- <p class="holy-grail__eyebrow font-mono">THE HOLY GRAIL OF NUXT</p> -->
        <p class="holy-grail__sub">Know the difference</p>

        <div class="layers">
  <div class="layer-row layer-row--vue" :class="{ 'layer-row--visible': layersVisible >= 1 }">
    <div class="layer-row__accent" />
    <div class="layer-row__body">
      <span class="layer-row__name font-mono">Script</span>
      <span class="layer-row__desc">
        The actual runtime logic. For example, initializing a service, registering an event listener, or exposing a function.
      </span>
    </div>
  </div>

  <div class="layer-row layer-row--plugin" :class="{ 'layer-row--visible': layersVisible >= 2 }">
    <div class="layer-row__accent" />
    <div class="layer-row__body">
      <span class="layer-row__name font-mono">Nuxt Plugin</span>
      <span class="layer-row__desc">
        Runs at runtime when the Nuxt app is created. Used to initialize runtime functionality and make it available to the app.
      </span>
    </div>
  </div>

  <div class="layer-row layer-row--module" :class="{ 'layer-row--visible': layersVisible >= 3 }">
    <div class="layer-row__accent" />
    <div class="layer-row__body">
      <span class="layer-row__name font-mono">Nuxt Module</span>
      <span class="layer-row__desc">
        Runs at build time, before the Nuxt app exists. Used to configure Nuxt and register things such as plugins, components, or hooks.
      </span>
    </div>
  </div>
</div>
      </div>

      

      <!-- inject revelation -->
      <!-- <div v-if="showCode" class="inject-card card">
        <p class="inject-card__label font-mono">The inject Function — Context-Aware</p>
        <pre class="code-block"><span class="code-comment">// SSR  → adds to context + Vue + store</span>
<span class="code-comment">// Client → adds to Vue only</span>
<span class="code-keyword">export default</span> <span class="code-fn">defineNuxtPlugin</span>((nuxtApp) => {
  nuxtApp.<span class="code-fn">provide</span>(<span class="code-str">'signal'</span>, <span class="code-fn">useSignalTracker</span>())
})</pre>
      </div> -->

      <!-- Entity sign-off -->
      <!-- <div v-if="showSignoff" class="alien-box card">
        <p class="alien-box__msg">
          <em>"You now understand what took the galaxy a millennium to discover.<br />
          Every great Nuxt application is built on this stack.<br />
          Go build yours."</em>
        </p>
      </div> -->

     

      <!-- YouTube embed -->
      <div v-if="showCta" class="video-wrap card">
        <!-- <div class="video-wrap__label font-mono" style="font-size:0.72rem; letter-spacing:0.1em; color:var(--muted); text-transform:uppercase; margin-bottom:14px;">
        Here is what we understood about the golden record
        </div> -->
        <div class="video-wrap__player">
          <template v-if="!videoPlaying">
            <button type="button" class="video-thumb" @click="videoPlaying = true" aria-label="Play Golden Record video">
              <div class="video-thumb__bg" />
              <div class="video-thumb__overlay">
                <div class="video-thumb__play">▶</div>
                <p class="video-thumb__title font-mono">
                  Voyager Golden Record
                </p>
              </div>
            </button>
          </template>
          <template v-else>
            <iframe
              class="video-iframe"
              src="https://www.youtube.com/embed/v6oC2tPKdec?autoplay=1&rel=0"
              title="Voyager Golden Record — Sounds of Earth"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </template>
        </div>
      </div>

      <!-- CTA -->
      <div v-if="showCta" class="outro__actions">
        <button class="btn btn--ghost" @click="handlePlayAgain">↺ Play Again</button>
      </div>

    </div>

    <!-- ElevenLabs Nuxios voice agent -->
    <elevenlabs-convai agent-id="agent_6601kze39y7rer8b4yryjqr6db3d" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const game   = useGame()

const entityTyped    = ref('')
const typingHeadline = ref(false)
const showAlienMsg   = ref(false)
const showGrail      = ref(false)
const layersVisible  = ref(0)
const showCode       = ref(false)
const showSignoff    = ref(false)
const showCta        = ref(false)
const videoPlaying   = ref(false)

const HEADLINE = 'You have restored the signal.\nNow receive what you have earned.'
const CHAR_DELAY = 32

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

async function runSequence() {
  await wait(400)
  typingHeadline.value = true
  await typeString(v => { entityTyped.value = v }, HEADLINE)
  typingHeadline.value = false

  await wait(600)
  showAlienMsg.value = true

  await wait(2200)
  showGrail.value = true
  await wait(200)
  layersVisible.value = 1
  await wait(300)
  layersVisible.value = 2
  await wait(300)
  layersVisible.value = 3

  await wait(700)
  showCode.value = true

  await wait(700)
  showSignoff.value = true

  await wait(500)
  showCta.value = true
}

onMounted(runSequence)

function handlePlayAgain() {
  game.resetGame()
  router.push('/')
}
</script>

<style scoped>
.outro {
  flex: 1;
  padding: 64px 0 100px;
}

.outro__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
  max-width: 700px;
}

/* ── Entity header ── */
.entity-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.entity-hex-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.entity-hex-glow {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(95,201,148,0.22) 0%, rgba(245,200,66,0.1) 50%, transparent 70%);
  animation: pulse-glow 2.8s ease-in-out infinite;
  pointer-events: none;
}

.entity-hex {
  font-size: 5rem;
  line-height: 1;
  background: linear-gradient(135deg, var(--gold) 0%, var(--green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 18px rgba(95,201,148,0.45));
  animation: pulse-glow 2.8s ease-in-out infinite;
}

.entity-eyebrow {
  align-self: center;
}

.entity-headline {
  font-size: clamp(1.6rem, 5vw, 2.6rem);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: var(--white);
  white-space: pre-line;
  min-height: 4rem;
}

.cursor {
  display: inline-block;
  animation: blink-cursor 0.7s step-end infinite;
  color: var(--green);
  font-weight: 400;
  margin-left: 2px;
}

/* ── Holy Grail ── */
.holy-grail {
  width: 100%;
  text-align: left;
  border-color: var(--gold);
  background: var(--gold-dim);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: reveal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.holy-grail__eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
}

.holy-grail__sub {
  font-size: 0.9rem;
  color: var(--muted);
  margin: -12px 0 0;
}

.layers {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.layer-row {
  display: flex;
  gap: 0;
  border-radius: var(--radius);
  overflow: hidden;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.layer-row--visible {
  opacity: 1;
  transform: translateY(0);
}

.layer-row__accent {
  width: 4px;
  flex-shrink: 0;
  border-radius: 2px 0 0 2px;
}

.layer-row--vue .layer-row__accent    { background: var(--orange); }
.layer-row--plugin .layer-row__accent { background: var(--gold); }
.layer-row--module .layer-row__accent { background: var(--green); }

.layer-row__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: rgba(0,0,0,0.2);
  flex: 1;
}

.layer-row__name {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.layer-row--vue .layer-row__name    { color: var(--orange); }
.layer-row--plugin .layer-row__name { color: var(--gold); }
.layer-row--module .layer-row__name { color: var(--green); }

.layer-row__desc {
  font-size: 0.83rem;
  color: var(--muted);
  line-height: 1.55;
}

.layer-row__desc code {
  font-family: var(--mono);
  color: var(--text);
  font-size: 0.85em;
}

/* ── inject code block ── */
.inject-card {
  width: 100%;
  text-align: left;
  animation: reveal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.inject-card__label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 12px;
}

.code-block {
  background: #080f1a;
  border-radius: var(--radius);
  padding: 20px;
  font-family: var(--mono);
  font-size: 0.8rem;
  line-height: 1.7;
  color: var(--green);
  white-space: pre;
  overflow-x: auto;
  margin: 0;
}

.code-comment  { color: #4a6a50; }
.code-keyword  { color: var(--orange); }
.code-fn       { color: var(--gold); }
.code-str      { color: var(--green); }

/* ── sign-off ── */
.alien-box {
  width: 100%;
  text-align: left;
  border-color: var(--orange);
  background: var(--orange-dim);
  animation: reveal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.alien-box__msg {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text);
  letter-spacing: 0.02em;
  margin: 0;
}

.alien-box__msg em {
  font-style: italic;
  color: var(--gold);
}

/* ── CTA ── */
.outro__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  animation: reveal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* ── Video ── */
.video-wrap {
  width: 100%;
  text-align: left;
  animation: reveal-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
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

/* ── Shared keyframes ── */
@keyframes pulse-glow {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%       { transform: scale(1.1); opacity: 0.7; }
}

@keyframes reveal-pop {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
</style>
