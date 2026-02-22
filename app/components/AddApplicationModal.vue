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
              <input v-model="form.url" type="url" placeholder="https://linkedin.com/jobs/..." class="input-field bg-muted/20" />
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
              <button type="submit" :disabled="loading" class="btn-primary min-w-[140px]">
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
const loading = ref(false)

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
