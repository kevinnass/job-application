<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card border shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div class="space-y-1">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-semibold tracking-tight">{{ application.company_name }}</h2>
            <StatusBadge :status="application.status" />
          </div>
          <p class="text-sm text-muted-foreground">{{ application.job_profile }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="$emit('edit')" 
            class="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            Modifier
          </button>
          <button 
            @click="$emit('close')" 
            class="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8">
        <!-- Key Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Salaire Proposé</span>
            <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {{ formatProposedSalary(application.proposed_salary) }}
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date de candidature</span>
            <p class="text-sm font-medium">{{ application.applied_at ? formatDate(application.applied_at) : 'En attente' }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lien de l'offre</span>
            <div class="flex items-center gap-2">
              <a v-if="application.url" :href="application.url" target="_blank" class="text-sm font-medium text-primary hover:underline truncate max-w-full">
                Voir l'offre originale
              </a>
              <span v-else class="text-sm text-muted-foreground">Aucun lien</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Missions -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Missions & Enjeux
            </h3>
            <div class="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-dashed whitespace-pre-wrap min-h-[100px]">
              {{ formatMissions(application.main_missions) }}
            </div>
          </div>

          <!-- Skills -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Compétences Clés
            </h3>
            <div class="flex flex-wrap gap-2">
              <template v-if="application.primary_skills && formatSkills(application.primary_skills).length > 0">
                <span 
                  v-for="skill in formatSkills(application.primary_skills)" 
                  :key="skill"
                  class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground rounded-lg border"
                >
                  {{ skill }}
                </span>
              </template>
              <span v-else class="text-sm text-muted-foreground">Aucune compétence listée.</span>
            </div>
          </div>
        </div>

        <!-- Feedback Section -->
        <div v-if="application.company_feedback" class="space-y-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <h3 class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Retour de l'entreprise
          </h3>
          <p class="text-sm text-foreground leading-relaxed">
            {{ application.company_feedback }}
          </p>
        </div>

        <!-- Info Enterprise -->
        <div v-if="application.company_info" class="space-y-3 pt-4 border-t">
          <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground">À propos de l'entreprise</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            {{ formatCompanyInfo(application.company_info) }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t bg-muted/20 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest px-6">
        <span>Créé le {{ formatDate(application.created_at) }}</span>
        <span>ID: {{ application.id.split('-')[0] }}</span>
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

defineProps<{
  application: JobApplication
}>()

defineEmits<{
  close: []
  edit: []
}>()

function formatDate(date: string) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}
</script>
