<template>
  <header class="sticky top-0 z-50 glass border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center
                      group-hover:shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
          </div>
          <span class="text-lg font-bold text-gradient hidden sm:block">JobTracker</span>
        </NuxtLink>

        <!-- User Menu -->
        <div class="flex items-center gap-4">
          <div v-if="user" class="flex items-center gap-3">
            <img
              v-if="user.user_metadata?.avatar_url"
              :src="user.user_metadata.avatar_url"
              :alt="user.user_metadata?.full_name || 'Avatar'"
              class="w-8 h-8 rounded-full ring-2 ring-white/10"
            />
            <span class="text-sm text-gray-300 hidden sm:block">
              {{ user.user_metadata?.full_name || user.email }}
            </span>
            <button @click="signOut" class="btn-ghost text-sm flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span class="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

async function signOut() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
