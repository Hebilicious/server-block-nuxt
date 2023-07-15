<server lang="ts" path="/not-api/this/is/cool">
export const GET = defineEventHandler((event) => {
  return "We're here now."
})
</server>

<script setup lang="ts">
const { data } = useFetch("/not-api/this/is/cool")
</script>

<template>
  <h1>Hello</h1>
  <code> {{ data }} </code>
</template>
