<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground font-sans">
    <AppHeader />
    <main class="flex-1 w-full w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
