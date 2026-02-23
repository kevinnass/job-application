<template>
  <button 
    class="card p-5 space-y-3 transition-all text-left w-full relative"
    :class="[
      active 
        ? 'ring-2 ring-primary border-primary bg-secondary/80 shadow-md' 
        : 'hover:border-foreground/20 hover:bg-secondary/40 border-gray-500'
    ]"
  >
    <div class="flex items-center justify-between">
      <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{{ label }}</span>
      <div class="text-muted-foreground">
        <slot name="icon">
          <span class="text-lg opacity-70">{{ icon }}</span>
        </slot>
      </div>
    </div>
    <div class="text-2xl font-semibold tracking-tight">{{ value }}</div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number
  icon?: string
  color?: string
  active?: boolean
}>()
</script>
