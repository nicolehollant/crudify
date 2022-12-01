<template>
  <div class="m-auto min-h-screen max-w-[600px] border-x border-neutral-900">
    <div class="sticky top-0 z-20 bg-black/50 p-4 backdrop-blur">
      <div class="flex items-center justify-between">
        <p class="text-xl font-bold">Twittify</p>
        <button
          class="rounded-full bg-blue-600 px-2 py-1 transition duration-300 hover:bg-blue-800"
          @click="$auth.signOut"
        >
          Sign Out
        </button>
      </div>
    </div>
    <Compose></Compose>
    <div class="grid" v-if="query.data.value?.length">
      <Tweet v-for="tweet in reversed" :tweet="tweet"></Tweet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
definePageMeta({
  middleware: ["auth", "valid-account"],
});
const query = useQuery(vueQueryParams.getAll());
const reversed = computed(() => {
  const tweets = [...(query.data?.value ?? [])];
  tweets?.reverse();
  return tweets;
});
</script>
