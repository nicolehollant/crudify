<template>
  <div class="m-auto max-w-[600px] border-x border-neutral-900">
    <div class="sticky top-0 bg-black/50 p-4 text-xl font-bold backdrop-blur">
      Twittify
    </div>
    <Compose></Compose>
    <div class="grid" v-if="query.data.value?.length">
      <Tweet v-for="tweet in reversed" :tweet="tweet"></Tweet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
const query = useQuery(vueQueryParams.getAll());
const reversed = computed(() => {
  const tweets = [...(query.data?.value ?? [])];
  tweets?.reverse();
  return tweets;
});
</script>
