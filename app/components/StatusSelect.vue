<template>
  <div class="relative inline-block group/select">
    <select
      :value="modelValue"
      @change="handleChange"
      class="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
    >
      <option value="draft">Brouillon</option>
      <option value="applied">Postulé</option>
      <option value="interview">Entretien</option>
      <option value="rejected">Refusé</option>
      <option value="accepted">Accepté</option>
    </select>
    
    <div 
      class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 group-hover/select:border-foreground/30"
      :class="styles.bg"
    >
      <span class="h-1 w-1 rounded-full" :class="styles.dot" />
      {{ styles.label }}
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 opacity-50 group-hover/select:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
  'change': [val: string]
}>()

const statusConfig: Record<string, { bg: string, dot: string, label: string }> = {
  draft: { bg: 'bg-muted/50 text-muted-foreground border-border', dot: 'bg-muted-foreground', label: 'Brouillon' },
  applied: { bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500', label: 'Postulé' },
  interview: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dot: 'bg-amber-500', label: 'Entretien' },
  rejected: { bg: 'bg-red-500/10 text-red-500 border-red-500/20', dot: 'bg-red-500', label: 'Refusé' },
  accepted: { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500', label: 'Accepté' },
}

const styles = computed(() => {
  const config = statusConfig[props.modelValue] || statusConfig.draft
  return config!
})

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}
</script>
