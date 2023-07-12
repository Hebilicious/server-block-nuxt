<server lang="ts">
export const GET = defineEventHandler((event) => {
      return [{ id: 1, content: "Hello World"  }]
})
</server>

<script setup lang="ts">
const { data } = useFetch("/api/todos")
</script>

<template>
  <h1>Hello Todos</h1>
  <div> {{ data }} </div>
</template>
