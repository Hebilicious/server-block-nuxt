<server lang="ts" path="/this/is/another/api">
  const message = "Hello World!!!"
  export const GET = defineEventHandler(() => ({ message }))
  </server>

<script setup lang="ts">
const { data } = await useFetch("/this/is/another/api")
</script>

<template>
  <code>
    {{ data }}
  </code>
  <hr>
  <NuxtLink to="/todos">
    Todos
  </NuxtLink>
  <NuxtLink to="/nested/hello">
    Nested Hello
  </NuxtLink>
  <NuxtLink to="/message">
    Message
  </NuxtLink>
</template>
