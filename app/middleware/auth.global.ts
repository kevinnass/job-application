export default defineNuxtRouteMiddleware(async (to) => {
  // En SSR/SPA initial, on ne fait pas de redirection côté serveur
  if (import.meta.server) return

  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  let isLogged = !!user.value

  // En mode SPA, si la REF réactive user.value n'est pas encore remplie, on vérifie
  // la session directement pour ne pas dépendre du cycle de réactivité de Vue.
  if (!isLogged) {
    const { data } = await supabase.auth.getSession()
    isLogged = !!data.session
  }

  if (!isLogged && to.path !== '/login' && to.path !== '/confirm') {
    return navigateTo('/login')
  }

  if (isLogged && to.path === '/login') {
    return navigateTo('/')
  }
})
