<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard label="Total" :value="store.stats.total" icon="📋" color="violet" />
      <StatCard label="Postulées" :value="store.stats.applied" icon="📤" color="blue" />
      <StatCard label="Entretiens" :value="store.stats.interviews" icon="💬" color="amber" />
      <StatCard label="Acceptées" :value="store.stats.accepted" icon="✅" color="green" />
      <StatCard label="Refusées" :value="store.stats.rejected" icon="❌" color="red" />
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une candidature..."
          class="input-field pl-10"
        />
      </div>

      <button @click="showAddModal = true" class="btn-primary flex items-center gap-2 whitespace-nowrap">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14" /><path d="M5 12h14" />
        </svg>
        Ajouter une candidature
      </button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading && !store.applications.length" class="flex justify-center py-16">
      <svg class="w-8 h-8 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Empty state -->
    <div v-else-if="!store.applications.length" class="card text-center py-16">
      <div class="text-5xl mb-4">📭</div>
      <h2 class="text-xl font-semibold text-white mb-2">Aucune candidature</h2>
      <p class="text-gray-400 mb-6">Commencez par ajouter votre première candidature !</p>
      <button @click="showAddModal = true" class="btn-primary">
        Ajouter une candidature
      </button>
    </div>

    <!-- Applications Table -->
    <ApplicationTable
      v-else
      :applications="filteredApplications"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <!-- Modals -->
    <AddApplicationModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @saved="onApplicationSaved"
    />

    <EditApplicationModal
      v-if="editingApplication"
      :application="editingApplication"
      @close="editingApplication = null"
      @saved="onApplicationUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import type { JobApplication } from '~/stores/applications'

const store = useApplicationsStore()
const searchQuery = ref('')
const showAddModal = ref(false)
const editingApplication = ref<JobApplication | null>(null)

const filteredApplications = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return store.sortedApplications

  return store.sortedApplications.filter(app =>
    app.company_name.toLowerCase().includes(query) ||
    app.job_profile.toLowerCase().includes(query) ||
    app.primary_skills.toLowerCase().includes(query) ||
    app.status.toLowerCase().includes(query)
  )
})

onMounted(() => {
  store.fetchApplications()
})

function openEditModal(app: JobApplication) {
  editingApplication.value = { ...app }
}

async function handleDelete(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
    await store.deleteApplication(id)
  }
}

function onApplicationSaved() {
  showAddModal.value = false
}

function onApplicationUpdated() {
  editingApplication.value = null
}
</script>
