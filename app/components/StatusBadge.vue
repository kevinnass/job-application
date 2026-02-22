<template>
  <span :class="badgeClasses" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors">
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: 'Brouillon', bg: 'bg-gray-500/20', text: 'text-gray-300', dot: 'bg-gray-400' },
  applied: { label: 'Postulé', bg: 'bg-blue-500/20', text: 'text-blue-300', dot: 'bg-blue-400' },
  interview: { label: 'Entretien', bg: 'bg-amber-500/20', text: 'text-amber-300', dot: 'bg-amber-400' },
  rejected: { label: 'Refusé', bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
  accepted: { label: 'Accepté', bg: 'bg-emerald-500/20', text: 'text-emerald-300', dot: 'bg-emerald-400' },
}

const config = computed(() => statusConfig[props.status] || statusConfig.draft)
const label = computed(() => config.value.label)
const badgeClasses = computed(() => `${config.value.bg} ${config.value.text}`)
const dotClass = computed(() => config.value.dot)
</script>
