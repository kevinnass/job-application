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
    url: process.env.SUPABASE_URL || 'https://erhalnpgzttnhiilopcp.supabase.co',
    key: process.env.SUPABASE_KEY || 'sb_publishable_-Gi3ASdyuqDCisD_jCweqQ_oFP4qIQG',
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/login', '/confirm'],
      cookieRedirect: false,
    },
    // For SPA (ssr: false): use localStorage for PKCE code_verifier, not cookies
    useSsrCookies: false,
    clientOptions: {
      auth: {
        flowType: 'pkce',
      }
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours
      secure: !process.dev,
      sameSite: 'lax'
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
