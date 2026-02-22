<template>
  <button
    @click="toggleMode"
    class="relative inline-flex border h-8 w-14 items-center rounded-full bg-muted transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    aria-label="Toggle theme"
  >
    <span
      class="inline-block h-6 w-6 transform rounded-full bg-background shadow-sm transition-transform duration-200 ease-in-out"
      :class="colorMode.value === 'dark' ? 'translate-x-7' : 'translate-x-1'"
    >
      <span class="flex h-full w-full items-center justify-center">
        <svg
          v-if="colorMode.value === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5 text-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5 text-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
