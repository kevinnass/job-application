<template>
  <div class="w-full overflow-hidden">
    <!-- Desktop Table -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b bg-muted/30">
            <th
              v-for="col in columns"
              :key="col.key"
              @click="toggleSort(col.key)"
              class="h-10 px-4 text-left align-middle font-medium text-muted-foreground uppercase tracking-tight text-[10px] cursor-pointer hover:text-foreground transition-colors select-none"
            >
              <span class="flex items-center gap-1">
                {{ col.label }}
                <svg v-if="sortBy === col.key" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary transition-transform"
                     :class="{ 'rotate-180': sortOrder === 'asc' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </th>
            <th class="h-10 px-4 w-20"></th>
          </tr>
        </thead>
        <tbody class="divide-y border-b">
          <tr
            v-for="app in sortedApplications"
            :key="app.id"
            @click="$emit('view', app)"
            class="hover:bg-muted/30 transition-colors group cursor-pointer"
          >
            <td class="px-4 py-3 align-middle">
              <div class="flex items-center gap-2">
                <span class="font-semibold tracking-tight text-foreground truncate max-w-[120px]">{{ app.company_name || '—' }}</span>
                <a v-if="app.url" :href="app.url" target="_blank" @click.stop
                   class="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </td>
            <td class="px-4 py-3 text-[11px] text-muted-foreground max-w-[150px] truncate">
              {{ formatCompanyInfo(app.company_info) }}
            </td>
            <td class="px-4 py-3 text-[11px] font-medium max-w-[140px] truncate">{{ app.job_profile || '—' }}</td>
            <td class="px-4 py-3 text-[11px] text-muted-foreground max-w-[150px] truncate">
              {{ formatMissions(app.main_missions) }}
            </td>
            <td class="px-4 py-3">
              <div v-if="app.primary_skills" class="flex flex-wrap gap-1">
                <span
                  v-for="skill in formatSkills(app.primary_skills).slice(0, 2)"
                  :key="skill"
                  class="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground rounded border whitespace-nowrap"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="formatSkills(app.primary_skills).length > 2"
                  class="px-1 py-0.5 text-[9px] font-bold text-muted-foreground"
                >
                  +{{ formatSkills(app.primary_skills).length - 2 }}
                </span>
              </div>
              <span v-else class="text-muted-foreground text-[10px]">—</span>
            </td>
            <td class="px-4 py-3 text-[11px] font-semibold text-muted-foreground">
              {{ formatProposedSalary(app.proposed_salary) }}
            </td>
            <td @click.stop class="px-4 py-3 text-[10px] text-muted-foreground whitespace-nowrap uppercase tracking-tighter">
              {{ app.applied_at ? formatDate(app.applied_at) : '—' }}
            </td>
            <td @click.stop class="px-4 py-3">
              <StatusSelect 
                :model-value="app.status" 
                @change="(newStatus) => $emit('changeStatus', app.id, newStatus)" 
              />
            </td>
            <td class="px-4 py-3 text-[11px] text-muted-foreground max-w-[140px] truncate italic">{{ app.company_feedback || '—' }}</td>
            <td class="px-4 py-3 align-middle">
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="$emit('edit', app)" class="p-1.5 hover:bg-muted rounded-md transition-colors" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                  </svg>
                </button>
                <button @click.stop="$emit('delete', app)" class="p-1.5 hover:bg-destructive/10 rounded-md transition-colors" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
    <div class="lg:hidden space-y-3">
      <div
        v-for="app in sortedApplications"
        :key="app.id"
        @click="$emit('view', app)"
        class="card p-4 space-y-4 cursor-pointer"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <h3 class="font-semibold text-foreground leading-none">{{ app.company_name || 'Entreprise inconnue' }}</h3>
            <p class="text-xs text-muted-foreground">{{ app.job_profile || 'Profil non spécifié' }}</p>
          </div>
          <StatusSelect 
            :model-value="app.status" 
            @click.stop
            @change="(newStatus) => $emit('changeStatus', app.id, newStatus)" 
          />
        </div>

        <div v-if="app.primary_skills" class="flex flex-wrap gap-1">
          <span
            v-for="skill in formatSkills(app.primary_skills).slice(0, 3)"
            :key="skill"
            class="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground rounded border"
          >
            {{ skill }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-2 border-t">
          <div class="flex flex-col gap-0.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {{ app.applied_at ? formatDate(app.applied_at) : 'Non postulé' }}
            </span>
            <span v-if="app.proposed_salary" class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              {{ formatProposedSalary(app.proposed_salary) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <a v-if="app.url" :href="app.url" target="_blank" @click.stop class="text-muted-foreground hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button @click.stop="$emit('edit', app)" class="p-1 hover:bg-muted rounded border">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
              </svg>
            </button>
            <button @click.stop="$emit('delete', app)" class="p-1 hover:bg-destructive/10 rounded border">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
import { 
  formatProposedSalary, 
  formatSkills, 
  formatCompanyInfo, 
  formatMissions 
} from '~/utils/formatters'

const props = defineProps<{
  applications: JobApplication[]
}>()

defineEmits<{
  edit: [app: JobApplication]
  delete: [app: JobApplication]
  changeStatus: [id: string, status: string]
  view: [app: JobApplication]
}>()

const sortBy = ref<string>('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'company_name', label: 'Entreprise' },
  { key: 'company_info', label: 'Info' },
  { key: 'job_profile', label: 'Profil' },
  { key: 'main_missions', label: 'Missions' },
  { key: 'primary_skills', label: 'Compétences' },
  { key: 'proposed_salary', label: 'Salaire' },
  { key: 'applied_at', label: 'Date' },
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
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>
