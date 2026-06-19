<template>
  <canvas ref="canvasEl" class="star-field" aria-hidden="true" />
</template>

<script setup lang="ts">
const canvasEl = ref<HTMLCanvasElement | null>(null)

interface Star {
  x: number
  y: number
  r: number
  speed: number
  opacity: number
  opacityDir: number
}

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let animId: number
  let stars: Star[] = []

  function resize() {
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    initStars()
  }

  function initStars() {
    if (!canvas) return
    const count = Math.floor((canvas.width * canvas.height) / 5000)
    stars = Array.from({ length: count }, () => ({
      x:          Math.random() * canvas!.width,
      y:          Math.random() * canvas!.height,
      r:          Math.random() * 1.4 + 0.2,
      speed:      Math.random() * 0.25 + 0.05,
      opacity:    Math.random(),
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    }))
  }

  function draw() {
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const s of stars) {
      // Twinkle
      s.opacity += s.opacityDir * 0.004
      if (s.opacity >= 1)   { s.opacity = 1;   s.opacityDir = -1 }
      if (s.opacity <= 0.1) { s.opacity = 0.1; s.opacityDir = 1  }

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200,218,240,${s.opacity})`
      ctx.fill()
    }

    animId = requestAnimationFrame(draw)
  }

  resize()
  draw()

  window.addEventListener('resize', resize)

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })
})
</script>
