<template>
  <div>
    <div class="grid grid-cols-[auto,minmax(0,1fr)] gap-4 px-6 py-4">
      <NuxtLink to="/account/setup" class="h-max w-max rounded-full">
        <img
          :src="$auth.account.value.data.twittifyAvatar"
          class="h-14 w-14 rounded-full bg-gradient-to-br from-black to-blue-900 object-cover"
          alt="My Avatar"
          onerror="this.src = ''"
        />
      </NuxtLink>
      <div class="flex flex-col gap-4">
        <label for="username" class="grid gap-1">
          <p class="text-sm">@{{ $auth.account.value.data.twittifyHandle }}</p>
          <textarea
            v-model="state.content"
            name="whatsHappening"
            placeholder="What's happening?"
            class="min-h-40 h-full w-full resize-none rounded-lg border-neutral-900 bg-transparent text-xl text-white"
          ></textarea>
        </label>
        <div class="flex items-center justify-between">
          <button
            @click="mutation.mutate()"
            class="ml-auto w-max rounded-full bg-blue-600 px-4 py-2 font-bold"
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { v4 } from "uuid";
const queryClient = useQueryClient();

const { $auth } = useNuxtApp();
const state = reactive({
  username: "",
  content: "",
});

const mutation = useMutation({
  mutationKey: ["createTweet"],
  mutationFn: () => {
    if (!state.content) {
      throw new Error("invalid");
    }
    return api.create({
      displayName: $auth.account.value.data.twittifyDisplayName,
      likes: [],
      retweets: [],
      replies: [],
      media: [],
      createdAt: new Date().toISOString(),
      text: state.content,
      tweetID: v4(),
      username: $auth.account.value.data.twittifyHandle,
      avatar: $auth.account.value.data.twittifyAvatar,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.getAll,
    });
  },
});
</script>
