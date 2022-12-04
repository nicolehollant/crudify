<template>
  <div class="m-auto min-h-screen max-w-[600px] border-x border-neutral-900">
    <div class="sticky top-0 z-20 bg-black/50 p-4 backdrop-blur">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-xl md:gap-8">
          <NuxtLink to="/">
            <i-ant-design-arrow-left-outlined />
          </NuxtLink>
          <p>Post</p>
        </div>
        <button
          class="rounded-full bg-blue-600 px-2 py-1 transition duration-300 hover:bg-blue-800"
          @click="$auth.signOut"
        >
          Sign Out
        </button>
      </div>
    </div>
    <Tweet :tweet="query.data.value" v-if="query.data.value" size="lg"></Tweet>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
definePageMeta({
  middleware: ["auth", "valid-account"],
});
const route = useRoute();
const query = useQuery({
  queryFn: () => api.getOneByID(route.params.tweetID + ""),
  queryKey: ["getUserProfile", route.params.username, route.params.tweetID],
});
</script>
