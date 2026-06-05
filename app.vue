<template>
  <div class="app-shell">
    <StarField />
    <NavBar />
    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
// Global layout shell — StarField renders the animated background,
// NavBar sits above content, NuxtPage renders the active route.
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}
</style>
