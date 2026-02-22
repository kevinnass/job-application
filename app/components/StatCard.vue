<template>
  <div class="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/[0.07] transition-all duration-200">
    <span class="text-2xl">{{ icon }}</span>
    <div>
      <p class="text-2xl font-bold text-white">{{ value }}</p>
      <p class="text-xs text-gray-400">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number
  icon: string
  color: string
}>()
</script>
