// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  ssr: false,

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/login', '/confirm'],
      cookieRedirect: false,
    },
    // Required for SPA mode to work correctly on reload
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    }
  },

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  app: {
    head: {
      title: 'JobTracker — Suivi de Candidatures',
      meta: [
        { name: 'description', content: 'Gérez et suivez vos candidatures — l\'outil indispensable pour vos recherches d\'emploi.' },
      ],
      htmlAttrs: {
        lang: 'fr',
      },
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
