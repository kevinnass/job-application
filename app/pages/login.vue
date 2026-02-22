<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <!-- Background effects -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s" />
    </div>

    <div class="glass-strong rounded-3xl p-10 max-w-md w-full text-center animate-scale-in">
      <!-- Logo -->
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gradient">JobTracker</h1>
        <p class="text-gray-400 mt-2">Gérez vos candidatures en un seul endroit</p>
      </div>

      <!-- Google Button -->
      <button
        @click="signInWithGoogle"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-3 px-6 py-3.5 
               bg-white text-gray-800 font-medium rounded-xl
               hover:bg-gray-100 active:scale-[0.97] transition-all duration-200
               shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>{{ loading ? 'Connexion...' : 'Se connecter avec Google' }}</span>
      </button>

      <!-- Footer note -->
      <p class="text-xs text-gray-500 mt-6">
        En vous connectant, vous acceptez de stocker vos données de candidature de manière sécurisée.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const loading = ref(false)

async function signInWithGoogle() {
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    })
    if (error) throw error
  } catch (e: any) {
    console.error('Login error:', e.message)
    loading.value = false
  }
}
</script>
