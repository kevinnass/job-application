<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <div class="h-6 w-6 rounded bg-primary flex items-center justify-center">
          <span class="text-[10px] font-bold text-primary-foreground">JT</span>
        </div>
        <span class="text-sm font-bold tracking-tight text-foreground uppercase">JobTracker</span>
      </div>
      
      <div v-if="user" class="flex items-center gap-4">
        <ThemeToggle />
        <div class="flex items-center gap-2 pr-4 border-r border-border">
          <img v-if="user.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" alt="Avatar" class="h-6 w-6 rounded-full grayscale hover:grayscale-0 transition-all border border-border" />
          <span class="text-xs font-medium text-muted-foreground hidden sm:block">{{ user.user_metadata?.full_name || user.email }}</span>
        </div>
        <button @click="logout" class="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
