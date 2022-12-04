<template>
  <div class="m-auto min-h-screen max-w-[600px] border-x border-neutral-900">
    <div class="sticky top-0 z-20 bg-black/50 p-4 backdrop-blur">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-xl md:gap-8">
          <NuxtLink to="/">
            <i-ant-design-arrow-left-outlined />
          </NuxtLink>
          <div class="grid gap-1">
            <p>{{ account.data.value?.displayName }}</p>
            <p class="text-sm text-gray-500">
              {{ query.data.value?.length }} Posts
            </p>
          </div>
        </div>
        <button
          class="rounded-full bg-blue-600 px-2 py-1 transition duration-300 hover:bg-blue-800"
          @click="$auth.signOut"
        >
          Sign Out
        </button>
      </div>
    </div>
    <section class="relative">
      <div
        class="pt-24 sm:pt-32"
        :style="{ background: account.data.value?.banner ?? '#1e3a8a' }"
      ></div>
      <div
        class="absolute flex w-full -translate-y-1/2 transform items-end justify-between px-6"
      >
        <img
          :src="account.data.value?.avatar"
          class="h-28 w-28 rounded-full border-4 border-black bg-gradient-to-br from-black to-blue-900 object-cover"
          alt="My Avatar"
          onerror="this.src = ''"
        />
        <button>Follow</button>
      </div>
      <div class="px-6 pt-20 pb-4">
        <div>
          <p>{{ account.data.value?.displayName }}</p>
          <p class="text-neutral-500">
            @{{ account.data.value?.userName.split("@")[0] }}
          </p>
        </div>
        <p>
          {{ account.data.value?.bio }}
        </p>
        <div
          v-if="account.data.value?.createdAt"
          class="flex items-center gap-2 text-sm text-neutral-500"
        >
          <i-ant-design-calendar-outlined />
          <p>
            Joined
            {{ new Date(account.data.value.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </section>
    <div class="flex flex-col-reverse" v-if="query.data.value?.length">
      <Tweet
        v-for="tweet in query.data?.value"
        :tweet="tweet"
        :key="tweet.id"
      ></Tweet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
definePageMeta({
  middleware: ["auth", "valid-account"],
});
const route = useRoute();
const account = useQuery({
  queryFn: async () => {
    const [account] = await accountApi.match({
      userName: route.params.username,
    });
    return account;
  },
  queryKey: ["getUserProfileAccount", route.params.username],
});
const enabled = computed(() => !!account.data.value?.accountID);
const query = useQuery({
  queryFn: async () => {
    const usersRetweets = await api
      .match({
        "retweets.accountID": account.data.value?.accountID,
      })
      .catch(() => []);
    const usersTweets = await api
      .match({
        accountID: account.data.value?.accountID,
      })
      .catch(() => []);
    return [...usersTweets, ...usersRetweets].sort(
      (a, b) =>
        new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
    );
  },
  queryKey: ["getUserProfile", route.params.username],
  enabled,
});
</script>
