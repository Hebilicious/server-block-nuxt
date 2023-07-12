<server lang="ts">
const message = "Hello World!!!"
const bye = "bye!"
export const GET = defineEventHandler(() =>({ message }))
export const POST = defineEventHandler(() =>({ message: bye }))
</server>

<script setup lang="ts">
const { data } = useFetch("/api/message")
</script>

<template>
  <div> Hello Message, {{ data }} </div>
</template>
