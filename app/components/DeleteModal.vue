<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="w-full max-w-sm overflow-hidden bg-card border shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
      <div class="p-6 space-y-4">
        <div class="flex items-center gap-4">
          <div class="p-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold tracking-tight">Supprimer la candidature</h3>
            <p class="text-sm text-muted-foreground">Cette action est irréversible.</p>
          </div>
        </div>
        
        <p class="text-sm text-muted-foreground px-1">
          Êtes-vous sûr de vouloir supprimer la candidature pour <strong>{{ companyName }}</strong> ? Toutes les données associées seront perdues.
        </p>

        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <button 
            @click="$emit('cancel')" 
            class="h-9 px-4 rounded-lg bg-muted/50 hover:bg-muted font-medium text-xs transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="$emit('confirm')" 
            class="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  companyName: string
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>
