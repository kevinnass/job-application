<template>
  <div class="fixed inset-0 mt-96 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="relative w-full max-w-lg bg-card border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div class="p-6 border-b bg-muted/30">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold tracking-tight">Installer l'extension</h2>
              <p class="text-sm text-muted-foreground mt-0.5">Suivez ces étapes pour ajouter l'extension JobTracker à votre navigateur et pouvoir ajouter instantanément des offres d'emploi à votre dashboard.</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6 space-y-8">
        <div class="space-y-6">
          <!-- Step 1 -->
          <div class="flex gap-4">
            <div class="flex-none w-6 h-6 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold">1</div>
            <div class="space-y-1.5">
              <h3 class="text-sm font-semibold leading-none">Récupérer le dossier de l'extension</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">
                Téléchargez le dossier ou clonez le dépôt github <code class="px-1 py-0.5 bg-muted rounded border text-[10px]">job-tracker-extension</code>.
              </p>
              <div class="flex items-center gap-3">
                <a href="https://github.com/kevinnass/job-tracker-extension/archive/refs/heads/main.zip" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Télécharger
                </a>
                <a href="https://github.com/kevinnass/job-tracker-extension" target="_blank" class="text-[12px] font-semibold hover:font-bold underline">
                  Voir sur GitHub
                </a>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex gap-4">
            <div class="flex-none w-6 h-6 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold">2</div>
            <div class="space-y-1.5">
              <h3 class="text-sm font-semibold leading-none">Ouvrir le menu des Extensions</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Ouvrez un nouvel onglet et tapez <code class="px-1 py-0.5 bg-muted rounded border text-[10px]">chrome://extensions/</code> dans votre barre d'adresse.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex gap-4">
            <div class="flex-none w-6 h-6 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold">3</div>
            <div class="space-y-1.5">
              <h3 class="text-sm font-semibold leading-none">Mode Développeur</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Dans le menu extensions, activez le <strong>Mode Développeur</strong> en haut à droite de la page des extensions.
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex gap-4">
            <div class="flex-none w-6 h-6 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold">4</div>
            <div class="space-y-1.5">
              <h3 class="text-sm font-semibold leading-none">Charger l'extension</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                Dans le cas ou vous avez téléchargé le dossier, décompressez-le, ensuite cliquez sur <strong>Charger l'extension non paquetée</strong> et sélectionnez le dossier <code class="px-1 py-0.5 bg-muted rounded border text-[10px]">extension/</code> du dépôt téléchargé.
              </p>
            </div>
          </div>
        </div>

        <div class="p-3 bg-primary/5 border border-primary/10 rounded-lg flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary mt-0.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <p class="text-[12px] text-primary/80 leading-relaxed font-medium">
            Vous pourrez ainsi ajouter des offres d'emploi automatiquement.
            Si l'extension n'est plus presente, il suffit de recommencer les étapes, ou de réactiver/reactualiser l'extension dans le menu extensions.
          </p>
        </div>
      </div>

      <div class="p-4 border-t bg-muted/30 flex justify-end">
        <button @click="$emit('close')" class="btn-secondary h-9 px-6 text-xs font-bold uppercase tracking-wide">
          J'ai compris
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
