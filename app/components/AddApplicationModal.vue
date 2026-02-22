<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')" />

      <!-- Modal -->
      <div class="relative glass-strong rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <!-- Header -->
        <div class="sticky top-0 glass-strong rounded-t-2xl px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">Nouvelle candidature</h2>
          <button @click="$emit('close')" class="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- URL -->
          <div>
            <label class="input-label">Lien de l'offre</label>
            <input v-model="form.url" type="url" placeholder="https://..." class="input-field" />
          </div>

          <!-- Company row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="input-label">Nom de l'entreprise *</label>
              <input v-model="form.company_name" type="text" placeholder="Ex: Google" class="input-field" required />
            </div>
            <div>
              <label class="input-label">Salaire proposé</label>
              <input v-model="form.proposed_salary" type="text" placeholder="Ex: 45-55k€" class="input-field" />
            </div>
          </div>

          <!-- Company Info -->
          <div>
            <label class="input-label">Informations sur l'entreprise</label>
            <textarea v-model="form.company_info" rows="2" placeholder="Secteur, taille, localisation..." class="input-field resize-none" />
          </div>

          <!-- Profile -->
          <div>
            <label class="input-label">Profil recherché</label>
            <input v-model="form.job_profile" type="text" placeholder="Ex: Développeur Full Stack Senior" class="input-field" />
          </div>

          <!-- Missions -->
          <div>
            <label class="input-label">Missions principales</label>
            <textarea v-model="form.main_missions" rows="3" placeholder="Décrivez les missions principales du poste..." class="input-field resize-none" />
          </div>

          <!-- Skills -->
          <div>
            <label class="input-label">Compétences primaires recherchées</label>
            <input v-model="form.primary_skills" type="text" placeholder="Vue.js, TypeScript, Node.js (séparées par des virgules)" class="input-field" />
          </div>

          <!-- Status & Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="input-label">Statut</label>
              <select v-model="form.status" class="input-field">
                <option value="draft">Brouillon</option>
                <option value="applied">Postulé</option>
                <option value="interview">Entretien</option>
                <option value="rejected">Refusé</option>
                <option value="accepted">Accepté</option>
              </select>
            </div>
            <div>
              <label class="input-label">Postulé le</label>
              <input v-model="form.applied_at" type="date" class="input-field" />
            </div>
          </div>

          <!-- Feedback -->
          <div>
            <label class="input-label">Retour de l'entreprise</label>
            <textarea v-model="form.company_feedback" rows="2" placeholder="Retour reçu..." class="input-field resize-none" />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" @click="$emit('close')" class="btn-ghost">Annuler</button>
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
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
  loading.value = true
  try {
    await store.addApplication({
      ...form,
      applied_at: form.applied_at ? new Date(form.applied_at).toISOString() : null,
    })
    emit('saved')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Close on escape
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') emit('close')
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})
</script>
