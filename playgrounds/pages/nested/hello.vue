<server lang="ts">
export const GET = defineEventHandler((event) => {
        return "Hello World"
})
</server>

<script setup lang="ts">
const { data } = useFetch("/api/nested/hello")
</script>

<template>
  <h1>Hello</h1>
  <div> {{ data }} </div>
</template>
