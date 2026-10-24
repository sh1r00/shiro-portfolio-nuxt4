<script setup lang="ts">
const store = useToastStore()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
    <MToast v-for="t in store.toasts" :key="t.id" :toast="t" @dismiss="store.remove(t.id)" />
  </div>
</template>
