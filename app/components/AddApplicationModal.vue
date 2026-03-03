<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" @click.self="$emit('close')">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" @click="$emit('close')" />

      <!-- Modal -->
      <div class="relative card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <!-- Header -->
        <div class="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
          <div>
            <h2 class="text-lg font-semibold tracking-tight">Nouvelle candidature</h2>
            <p class="text-xs text-muted-foreground">Saisissez les détails de l'opportunité.</p>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form Scroll Area -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="store.error" class="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div class="space-y-1">
              <p class="text-xs font-bold text-red-500 uppercase tracking-wider">Erreur de synchronisation</p>
              <p class="text-xs text-red-500/80 leading-relaxed">{{ store.error }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" id="add-app-form" class="space-y-6">
            <!-- URL -->
            <div class="space-y-2">
              <label class="input-label">Lien de l'offre</label>
              <div class="flex gap-2">
                <input v-model="form.url" type="url" placeholder="https://linkedin.com/jobs/..." class="input-field bg-muted/20 flex-1" />
                <button 
                  type="button" 
                  @click="analyzeWithAI" 
                  :disabled="!form.url || aiLoading"
                  class="h-9 px-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-indigo-500 text-white transition-all flex items-center gap-2 group shrink-0"
                  title="Analyser avec l'IA"
                >
                  <svg v-if="!aiLoading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/>
                    <path d="m14 7 3 3"/>
                    <path d="M5 6v1"/><path d="M5 10v1"/><path d="M10 5h1"/><path d="M6 5h1"/><path d="M9 10h1"/><path d="M10 9v1"/><path d="m2 2 1 1"/><path d="m22 22 1 1"/>
                  </svg>
                  <div v-else class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span class="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">{{ aiLoading ? 'Analyse...' : 'IA Parse' }}</span>
                </button>
              </div>
              <p class="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">L'IA essayera d'extraire les informations pour vous aider à remplir le formulaire</p>
            </div>

            <!-- AI Status Message -->
            <div v-if="aiStatus" class="p-2 rounded-lg text-[11px] font-medium animate-in fade-in" :class="aiStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'">
              {{ aiStatus.message }}
            </div>

            <!-- Company row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="input-label">Entreprise *</label>
                <input v-model="form.company_name" type="text" placeholder="Ex: Stripe" class="input-field" required />
              </div>
              <div class="space-y-2">
                <label class="input-label">Salaire proposé</label>
                <input v-model="form.proposed_salary" type="text" placeholder="Ex: 50k - 65k€" class="input-field" />
              </div>
            </div>

            <!-- Profile -->
            <div class="space-y-2">
              <label class="input-label">Poste / Profil recherché</label>
              <input v-model="form.job_profile" type="text" placeholder="Ex: Product Engineer" class="input-field" />
            </div>

            <!-- Detailed info Grid -->
            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-2">
                <label class="input-label">À propos de l'entreprise</label>
                <textarea v-model="form.company_info" rows="2" placeholder="Secteur, culture, localisation..." class="input-field min-h-[80px]" />
              </div>
              
              <div class="space-y-2">
                <label class="input-label">Missions principales</label>
                <textarea v-model="form.main_missions" rows="3" placeholder="Quels sont les enjeux ?" class="input-field min-h-[100px]" />
              </div>
            </div>

            <!-- Skills -->
            <div class="space-y-2">
              <label class="input-label">Compétences clés</label>
              <input v-model="form.primary_skills" type="text" placeholder="React, Node.js, SQL..." class="input-field" />
              <p class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Sépaer par des virgules</p>
            </div>

            <!-- Status & Date -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="input-label">Statut actuel</label>
                <select v-model="form.status" class="input-field appearance-none bg-muted/20">
                  <option value="draft">Brouillon</option>
                  <option value="applied">Postulé</option>
                  <option value="interview">Entretien</option>
                  <option value="rejected">Refusé</option>
                  <option value="accepted">Accepté</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="input-label">Date de candidature</label>
                <input v-model="form.applied_at" type="date" class="input-field" />
              </div>
            </div>

            <!-- Feedback -->
            <div class="space-y-2 pb-6">
              <label class="input-label">Notes / Retours</label>
              <textarea v-model="form.company_feedback" rows="2" placeholder="Réponse reçue, ressenti..." class="input-field min-h-[80px]" />
            </div>

            <!-- Action Button inside form for reliability -->
            <div class="flex items-center justify-end gap-3 pt-6 border-t sticky bottom-0 bg-background/80 backdrop-blur-md">
              <button type="button" @click="$emit('close')" class="btn-ghost text-xs font-bold uppercase tracking-widest">
                Annuler
              </button>
              <button type="submit" :disabled="loading || aiLoading" class="btn-primary min-w-[140px]">
                <span v-if="loading" class="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {{ loading ? 'Synchronisation...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = useApplicationsStore()
const supabase = useSupabaseClient()
const loading = ref(false)
const aiLoading = ref(false)
const aiStatus = ref<{ type: 'success' | 'error', message: string } | null>(null)

const form = reactive({
  url: '',
  company_name: '',
  company_info: '',
  job_profile: '',
  main_missions: '',
  primary_skills: '',
  proposed_salary: '',
  applied_at: '',
  company_feedback: '',
  status: 'draft' as const,
})

async function analyzeWithAI() {
  if (!form.url) return
  
  aiLoading.value = true
  aiStatus.value = null
  store.error = null

  try {
    const { data, error } = await supabase.functions.invoke('analyze-job', {
      body: { url: form.url }
    })

    if (error) throw error
    if (!data) throw new Error("L'IA n'a retourné aucune donnée")

    // Fill form with AI data
    if (data.company_name) form.company_name = data.company_name
    if (data.job_profile) form.job_profile = data.job_profile
    if (data.proposed_salary) form.proposed_salary = data.proposed_salary
    if (data.company_info) form.company_info = data.company_info
    if (data.main_missions) form.main_missions = Array.isArray(data.main_missions) ? data.main_missions.join('\n') : data.main_missions
    if (data.primary_skills) form.primary_skills = Array.isArray(data.primary_skills) ? data.primary_skills.join(', ') : data.primary_skills

    aiStatus.value = { type: 'success', message: 'Analyse terminée avec succès !' }
    setTimeout(() => aiStatus.value = null, 3000)
  } catch (e: any) {
    console.error('AI Analysis failed:', e)
    aiStatus.value = { type: 'error', message: `Échec de l'IA: ${e.message || 'Erreur inconnue'}` }
  } finally {
    aiLoading.value = false
  }
}

async function handleSubmit() {
  if (!form.company_name) {
    store.error = "Le nom de l'entreprise est obligatoire."
    return
  }
  loading.value = true
  try {
    await store.addApplication({
      ...form,
      applied_at: form.applied_at ? new Date(form.applied_at).toISOString() : null,
    })
    emit('saved')
  } catch (e) {
    console.error('Failed to save application:', e)
  } finally {
    loading.value = false
  }
}

// Close on escape
onMounted(() => {
  store.error = null
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') emit('close')
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})
</script>
