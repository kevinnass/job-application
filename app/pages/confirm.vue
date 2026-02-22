<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center animate-fade-in">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20 mb-4">
        <svg class="w-6 h-6 text-violet-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p class="text-gray-400">Finalisation de la connexion...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const router = useRouter()

onMounted(() => {
  // Supabase handles the OAuth callback automatically
  // We just need to wait and redirect
  setTimeout(() => {
    router.push('/')
  }, 1000)
})
</script>
