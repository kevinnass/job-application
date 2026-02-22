<template>
  <div class="card p-5 space-y-3 hover:border-foreground/10 transition-colors">
    <div class="flex items-center justify-between">
      <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{{ label }}</span>
      <div class="text-muted-foreground">
        <slot name="icon">
          <span class="text-lg opacity-70">{{ icon }}</span>
        </slot>
      </div>
    </div>
    <div class="text-2xl font-semibold tracking-tight">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number
  icon?: string
  color?: string
}>()
</script>
