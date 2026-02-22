import { defineStore } from 'pinia'

export interface JobApplication {
  id: string
  user_id: string
  url: string
  company_name: string
  company_info: string
  job_profile: string
  main_missions: string
  primary_skills: string
  proposed_salary: string
  applied_at: string | null
  company_feedback: string
  status: 'draft' | 'applied' | 'interview' | 'rejected' | 'accepted'
  created_at: string
  updated_at: string
}

export type NewJobApplication = Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export const useApplicationsStore = defineStore('applications', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const applications = ref<JobApplication[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const sortedApplications = computed(() => {
    return [...applications.value].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })

  const stats = computed(() => {
    const total = applications.value.length
    const applied = applications.value.filter(a => a.status === 'applied').length
    const interviews = applications.value.filter(a => a.status === 'interview').length
    const accepted = applications.value.filter(a => a.status === 'accepted').length
    const rejected = applications.value.filter(a => a.status === 'rejected').length
    return { total, applied, interviews, accepted, rejected }
  })

  async function fetchApplications() {
    if (!user.value?.id) return
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      applications.value = data as JobApplication[]
    } catch (e: any) {
      error.value = e.message
      console.error('Error fetching applications:', e)
    } finally {
      loading.value = false
    }
  }

  async function addApplication(app: NewJobApplication) {
    if (!user.value?.id) return
    loading.value = true
    error.value = null
    try {
      // Nettoyage de l'objet pour ne pas envoyer d'undefined ou de strings vides
      // pour les champs qui attendent des types spécifiques (ex: dates)
      const payload: any = { ...app }
      if (!payload.applied_at) payload.applied_at = null

      const { data, error: err } = await supabase
        .from('job_applications')
        .insert(payload)
        .select()
        .single()

      if (err) throw err
      applications.value.unshift(data as JobApplication)
      return data
    } catch (e: any) {
      error.value = e.message
      console.error('Error adding application:', e)
    } finally {
      loading.value = false
    }
  }

  async function updateApplication(id: string, updates: Partial<JobApplication>) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('job_applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value[index] = data as JobApplication
      }
      return data
    } catch (e: any) {
      error.value = e.message
      console.error('Error updating application:', e)
    } finally {
      loading.value = false
    }
  }

  async function deleteApplication(id: string) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id)

      if (err) throw err
      applications.value = applications.value.filter(a => a.id !== id)
    } catch (e: any) {
      error.value = e.message
      console.error('Error deleting application:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    applications,
    sortedApplications,
    stats,
    loading,
    error,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
  }
})
