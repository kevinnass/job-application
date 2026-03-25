<template>
  <footer class="border-t border-border/50 bg-background/50 backdrop-blur-sm py-5 px-4 sm:px-6 lg:px-8 mt-auto">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-sm">
      <!-- Left side -->
      <div class="flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3">
        <span class="font-bold text-foreground uppercase leading-none">JobTracker</span>
        <span class="text-muted-foreground/60 font-medium whitespace-nowrap">© {{ new Date().getFullYear() }} — Tous droits réservés</span>
      </div>
      
      <!-- Middle side -->
      <div class="flex justify-center order-first md:order-none">
        <NuxtLink to="/privacy" class="font-bold uppercase tracking-widest text-[10px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
          Privacy
        </NuxtLink>
      </div>
      
      <!-- Right side -->
      <div class="flex justify-center md:justify-end items-center gap-3">
        <span class="text-muted-foreground/60 font-medium whitespace-nowrap">Développé par</span>
        <div class="relative">
          <button 
            @click="showIcons = !showIcons" 
            class="font-bold text-foreground hover:text-primary transition-all flex items-center gap-2 group/name"
          >
            <span class="uppercase tracking-tight border-b-2 border-primary/20 group-hover/name:border-primary transition-all">Kevin Nassara</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="w-3 h-3 transition-transform duration-300"
              :class="{ 'rotate-180': showIcons }"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          <!-- Social Icons Popover -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-y-2 opacity-0 scale-95"
            enter-to-class="translate-y-0 opacity-100 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100 scale-100"
            leave-to-class="translate-y-2 opacity-0 scale-95"
          >
            <div 
              v-if="showIcons" 
              class="absolute bottom-full mb-4 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 flex items-center gap-1 bg-card border border-border p-1.5 rounded-2xl shadow-2xl shadow-primary/20 z-50 min-w-max"
            >
              <a 
                v-for="link in socialLinks" 
                :key="link.name" 
                :href="link.href" 
                target="_blank" 
                class="p-2.5 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all group/icon flex items-center justify-center"
                :title="link.name"
              >
                <div v-html="link.icon" class="w-4 h-4"></div>
              </a>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const showIcons = ref(false)

const socialLinks = [
  {
    name: 'Website',
    href: 'https://kevin-nassara.vercel.app',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 1 0 20"/></svg>`
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/kevin-nassara',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`
  },
  {
    name: 'GitHub',
    href: 'https://github.com/kevinnass',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`
  }
]

// Close popover when clicking outside
if (process.client) {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showIcons.value = false
    }
  })
}
</script>
