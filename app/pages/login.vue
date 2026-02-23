<template>
  <div class="flex min-h-[calc(100vh-140px)] items-center justify-center">
    <div class="w-full max-w-sm space-y-8 animate-fade-in">
      <div class="text-center">
        <div class="mx-auto h-10 w-10 rounded-lg bg-primary flex items-center justify-center mb-6">
          <span class="text-sm font-bold text-primary-foreground">JT</span>
        </div>
        <h1 class="text-2xl font-semibold tracking-tight">Bienvenue</h1>
        <p class="text-sm text-muted-foreground mt-2">Connectez-vous pour gérer vos candidatures</p>
      </div>
      
      <div class="grid gap-6">
        <button 
          @click="signInWithGoogle" 
          :disabled="loading"
          class="btn-secondary w-full group transition-all duration-200 hover:border-foreground/20"
        >
          <div v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <svg v-else class="mr-2 h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>
      </div>
 
      <p class="px-8 text-center text-xs text-muted-foreground leading-relaxed">
        En continuant, vous acceptez nos 
        <a href="#" class="underline underline-offset-4 hover:text-primary">Conditions d'Utilisation</a> 
        et notre 
        <a href="#" class="underline underline-offset-4 hover:text-primary">Politique de Confidentialité</a>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const loading = ref(false)

async function signInWithGoogle() {
  loading.value = true
  try {
    const redirectTo = `${window.location.origin}/confirm`
    console.log('Initiating login with redirect to:', redirectTo)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
    if (error) throw error
  } catch (e: any) {
    console.error('Login error:', e.message)
    loading.value = false
  }
}
</script>
