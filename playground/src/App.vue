<script setup lang="ts">
const url = location
let current = $ref(0)
function jump(e) {
  current = +e.target.attributes.active.value
}
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-200" w-full h-full>
    <router-view />
  </main>
</template>
