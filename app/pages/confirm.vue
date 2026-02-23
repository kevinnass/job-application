<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const user = useSupabaseUser()
const router = useRouter()

watch(user, (newUser) => {
  if (newUser) {
    router.push('/')
  }
}, { immediate: true })
</script>
