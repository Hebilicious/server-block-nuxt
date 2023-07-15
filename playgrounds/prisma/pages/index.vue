<server lang="ts">
import { prisma } from '~/lib/prisma'

export const GET = defineEventHandler(() => prisma.todo.findMany())
</server>

<script setup lang="ts">
const { data, error } = useFetch("/api/index")
</script>

<template>
  <div> asd {{ data }} </div>
  <div> error {{ error }} </div>
</template>
