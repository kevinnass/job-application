<template>
  <div class="card overflow-hidden !p-0">
    <!-- Desktop Table -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/10">
            <th
              v-for="col in columns"
              :key="col.key"
              @click="toggleSort(col.key)"
              class="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer 
                     hover:text-white transition-colors select-none"
            >
              <span class="flex items-center gap-1">
                {{ col.label }}
                <svg v-if="sortBy === col.key" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-violet-400 transition-transform"
                     :class="{ 'rotate-180': sortOrder === 'asc' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </th>
            <th class="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="app in sortedApplications"
            :key="app.id"
            class="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="font-medium text-white">{{ app.company_name || '—' }}</span>
                <a v-if="app.url" :href="app.url" target="_blank"
                   class="text-violet-400 hover:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-400 max-w-[200px] truncate">{{ app.company_info || '—' }}</td>
            <td class="px-4 py-3 text-sm text-gray-300">{{ app.job_profile || '—' }}</td>
            <td class="px-4 py-3 text-sm text-gray-400 max-w-[200px] truncate">{{ app.main_missions || '—' }}</td>
            <td class="px-4 py-3">
              <div v-if="app.primary_skills" class="flex flex-wrap gap-1">
                <span
                  v-for="skill in app.primary_skills.split(',').slice(0, 3)"
                  :key="skill"
                  class="px-2 py-0.5 text-xs bg-violet-500/15 text-violet-300 rounded-md"
                >
                  {{ skill.trim() }}
                </span>
                <span
                  v-if="app.primary_skills.split(',').length > 3"
                  class="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded-md"
                >
                  +{{ app.primary_skills.split(',').length - 3 }}
                </span>
              </div>
              <span v-else class="text-gray-500">—</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-300">{{ app.proposed_salary || '—' }}</td>
            <td class="px-4 py-3 text-sm text-gray-400">
              {{ app.applied_at ? formatDate(app.applied_at) : '—' }}
            </td>
            <td class="px-4 py-3">
              <StatusBadge :status="app.status" />
            </td>
            <td class="px-4 py-3 text-sm text-gray-400 max-w-[150px] truncate">{{ app.company_feedback || '—' }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="$emit('edit', app)" class="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Modifier">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                  </svg>
                </button>
                <button @click="$emit('delete', app.id)" class="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 hover:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden divide-y divide-white/5">
      <div
        v-for="app in sortedApplications"
        :key="app.id"
        class="p-4 hover:bg-white/[0.03] transition-colors"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-medium text-white">{{ app.company_name || 'Sans nom' }}</h3>
            <p class="text-sm text-gray-400">{{ app.job_profile || 'Profil non renseigné' }}</p>
          </div>
          <StatusBadge :status="app.status" />
        </div>

        <div v-if="app.primary_skills" class="flex flex-wrap gap-1 mb-2">
          <span
            v-for="skill in app.primary_skills.split(',').slice(0, 3)"
            :key="skill"
            class="px-2 py-0.5 text-xs bg-violet-500/15 text-violet-300 rounded-md"
          >
            {{ skill.trim() }}
          </span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">
            {{ app.applied_at ? formatDate(app.applied_at) : 'Non postulé' }}
          </span>
          <div class="flex items-center gap-2">
            <a v-if="app.url" :href="app.url" target="_blank" class="text-violet-400 hover:text-violet-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button @click="$emit('edit', app)" class="p-1 hover:bg-white/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
              </svg>
            </button>
            <button @click="$emit('delete', app.id)" class="p-1 hover:bg-red-500/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobApplication } from '~/stores/applications'

const props = defineProps<{
  applications: JobApplication[]
}>()

defineEmits<{
  edit: [app: JobApplication]
  delete: [id: string]
}>()

const sortBy = ref<string>('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'company_name', label: 'Entreprise' },
  { key: 'company_info', label: 'Infos entreprise' },
  { key: 'job_profile', label: 'Profil recherché' },
  { key: 'main_missions', label: 'Missions' },
  { key: 'primary_skills', label: 'Compétences' },
  { key: 'proposed_salary', label: 'Salaire' },
  { key: 'applied_at', label: 'Postulé le' },
  { key: 'status', label: 'Statut' },
  { key: 'company_feedback', label: 'Retour' },
]

const sortedApplications = computed(() => {
  const sorted = [...props.applications]
  sorted.sort((a: any, b: any) => {
    const valA = a[sortBy.value] || ''
    const valB = b[sortBy.value] || ''
    if (sortOrder.value === 'asc') return valA > valB ? 1 : -1
    return valA < valB ? 1 : -1
  })
  return sorted
})

function toggleSort(key: string) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'desc'
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>
