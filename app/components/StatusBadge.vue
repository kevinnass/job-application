<template>
  <span 
    class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
    :class="styles.bg"
  >
    <span class="h-1 w-1 rounded-full" :class="styles.dot" />
    {{ styles.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'draft' | 'applied' | 'interview' | 'rejected' | 'accepted' | string
}>()

const statusConfig: Record<string, { bg: string, dot: string, label: string }> = {
  draft: { bg: 'bg-muted/50 text-muted-foreground border-border', dot: 'bg-muted-foreground', label: 'Brouillon' },
  applied: { bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500', label: 'Postulé' },
  interview: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', dot: 'bg-amber-500', label: 'Entretien' },
  rejected: { bg: 'bg-red-500/10 text-red-500 border-red-500/20', dot: 'bg-red-500', label: 'Refusé' },
  accepted: { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500', label: 'Accepté' },
}

const styles = computed(() => {
  const config = statusConfig[props.status] || statusConfig.draft
  return config!
})
</script>
