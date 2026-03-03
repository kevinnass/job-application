<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
        <!-- Backdrop with blur -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-md" @click="$emit('close')" />

        <!-- Modal Card -->
        <div class="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-card rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.35)] border border-border/50 flex flex-col">

          <!-- Colored accent stripe at top -->
          <div class="h-1 w-full" :class="statusGradient" />

          <!-- ═══════ HERO HEADER ═══════ -->
          <div class="relative px-7 pt-6 pb-5">
            <!-- Close button -->
            <button @click="$emit('close')" class="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <!-- Company + Profile -->
            <div class="flex items-start gap-4">
              <!-- Monogram -->
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" :class="monogramClasses">
                <span class="text-lg font-black text-white leading-none">{{ monogram }}</span>
              </div>
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center gap-2.5">
                  <h2 class="text-lg font-bold tracking-tight text-foreground truncate">{{ application.company_name || 'Entreprise' }}</h2>
                  <StatusBadge :status="application.status" />
                </div>
                <p class="text-[13px] text-muted-foreground font-medium">{{ application.job_profile || 'Poste non spécifié' }}</p>
              </div>
            </div>

            <!-- Action bar -->
            <div class="flex items-center gap-2 mt-5">
              <a
                v-if="application.url"
                :href="application.url"
                target="_blank"
                class="h-8 px-3.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-[11px] font-semibold transition-all flex items-center gap-1.5 border border-border/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Voir l'offre
              </a>
              <button @click="$emit('edit')" class="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                Modifier
              </button>
              <div class="flex-1" />
              <span class="text-[10px] text-muted-foreground/60 font-mono tracking-tight">
                {{ application.applied_at ? formatDate(application.applied_at) : 'Non postulé' }}
              </span>
            </div>

            <!-- Subtle separator -->
            <div class="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <!-- ═══════ SCROLLABLE CONTENT ═══════ -->
          <div class="flex-1 overflow-y-auto px-7 py-6 space-y-7 scroll-smooth">

            <!-- ── Key metrics row ── -->
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-xl bg-emerald-500/8 border border-emerald-500/15 p-3.5 text-center space-y-1">
                <span class="text-[10px] font-semibold uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70">Salaire</span>
                <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ formatProposedSalary(application.proposed_salary) }}</p>
              </div>
              <div class="rounded-xl bg-sky-500/8 border border-sky-500/15 p-3.5 text-center space-y-1">
                <span class="text-[10px] font-semibold uppercase tracking-widest text-sky-600/70 dark:text-sky-400/70">Candidature</span>
                <p class="text-sm font-semibold text-sky-600 dark:text-sky-400">{{ application.applied_at ? formatDateShort(application.applied_at) : '—' }}</p>
              </div>
              <div class="rounded-xl bg-amber-500/8 border border-amber-500/15 p-3.5 text-center space-y-1">
                <span class="text-[10px] font-semibold uppercase tracking-widest text-amber-600/70 dark:text-amber-400/70">Ajouté</span>
                <p class="text-sm font-semibold text-amber-600 dark:text-amber-400">{{ formatDateShort(application.created_at) }}</p>
              </div>
            </div>

            <!-- ── Compétences ── -->
            <div v-if="skillsList.length > 0" class="space-y-2.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-600/80 dark:text-violet-400/80 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                Compétences
              </label>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="skill in skillsList"
                  :key="skill"
                  class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- ── Entreprise ── -->
            <div v-if="application.company_info" class="space-y-2.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600/80 dark:text-orange-400/80 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>
                À propos de l'entreprise
              </label>
              <!-- Structured JSON display -->
              <div v-if="parsedCompanyInfo" class="grid grid-cols-2 gap-2">
                <div
                  v-for="(value, key) in parsedCompanyInfo"
                  :key="key"
                  class="rounded-lg bg-muted/30 border border-border/30 px-3 py-2.5 space-y-0.5"
                >
                  <span class="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">{{ formatKey(String(key)) }}</span>
                  <p class="text-[12px] font-medium text-foreground leading-snug">
                    {{ Array.isArray(value) ? value.join(', ') : value }}
                  </p>
                </div>
              </div>
              <!-- Plain text fallback -->
              <p v-else class="text-[13px] text-muted-foreground leading-relaxed">
                {{ formatCompanyInfo(application.company_info) }}
              </p>
            </div>

            <!-- ── Missions ── -->
            <div class="space-y-2.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600/80 dark:text-teal-400/80 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                Missions & Enjeux
              </label>
              <div class="text-[13px] text-foreground/90 leading-relaxed bg-teal-500/5 border border-teal-500/10 rounded-xl p-4 whitespace-pre-wrap">
                {{ formatMissions(application.main_missions) }}
              </div>
            </div>

            <!-- ── Retour entreprise ── -->
            <div v-if="application.company_feedback" class="space-y-2.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-500/70 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Retour de l'entreprise
              </label>
              <div class="text-[13px] text-foreground/90 leading-relaxed bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 whitespace-pre-wrap">
                {{ application.company_feedback }}
              </div>
            </div>

          </div>

          <!-- ═══════ FOOTER ═══════ -->
          <div class="px-7 py-3 border-t border-border/30 bg-muted/10 flex justify-between items-center">
            <div class="h-0.5 w-8 rounded-full bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500 opacity-40" />
            <span class="text-[10px] text-muted-foreground/50 font-mono">{{ application.id?.split('-')[0] }}</span>
            <span v-if="application.updated_at" class="text-[10px] text-muted-foreground/50">
              Modifié {{ formatRelative(application.updated_at) }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { JobApplication } from '~/stores/applications'
import {
  parseJsonSafely,
  formatProposedSalary,
  formatSkills,
  formatCompanyInfo,
  formatMissions
} from '~/utils/formatters'

const props = defineProps<{
  application: JobApplication
}>()

defineEmits<{
  close: []
  edit: []
}>()

// ─── Computed ───
const monogram = computed(() => {
  const name = props.application.company_name || '?'
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return ((words[0]?.[0] || '') + (words[1]?.[0] || '')).toUpperCase()
  return name.substring(0, 2).toUpperCase()
})

const statusGradient = computed(() => {
  const gradients: Record<string, string> = {
    draft: 'bg-gradient-to-r from-zinc-400 to-zinc-500',
    applied: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    interview: 'bg-gradient-to-r from-amber-400 to-orange-500',
    rejected: 'bg-gradient-to-r from-red-400 to-rose-500',
    accepted: 'bg-gradient-to-r from-emerald-400 to-teal-500',
  }
  return gradients[props.application.status] || gradients.draft
})

const monogramClasses = computed(() => {
  const colors: Record<string, string> = {
    draft: 'bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-zinc-500/25',
    applied: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25',
    interview: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/25',
    rejected: 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-500/25',
    accepted: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/25',
  }
  return colors[props.application.status] || colors.draft
})

const skillsList = computed(() => formatSkills(props.application.primary_skills))

const parsedCompanyInfo = computed(() => {
  if (!props.application.company_info) return null
  const parsed = parseJsonSafely(props.application.company_info)
  return typeof parsed === 'object' && parsed !== null ? parsed : null
})

// ─── Helpers ───
function formatDate(date: string) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateShort(date: string) {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function formatRelative(date: string) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return "à l'instant"
  if (diffMins < 60) return `il y a ${diffMins}min`
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays < 7) return `il y a ${diffDays}j`
  return formatDateShort(date)
}

function formatKey(key: string) {
  const map: Record<string, string> = {
    sectors: 'Secteurs', location: 'Localisation', size: 'Taille', type: 'Type',
    description: 'Description', name: 'Nom', industry: 'Industrie', founded: 'Fondée en',
    website: 'Site web', employees: 'Employés',
  }
  return map[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-active > div:last-child {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-leave-active > div:last-child {
  transition: all 0.15s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

.modal-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.98) translateY(4px);
}
</style>
