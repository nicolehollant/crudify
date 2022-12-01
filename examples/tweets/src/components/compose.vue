<template>
  <div>
    <div class="grid grid-cols-[auto,minmax(0,1fr)] gap-4 px-6 py-4">
      <img
        :src="randomAvatar"
        class="h-14 w-14 rounded-full bg-gradient-to-br from-black to-blue-900"
        alt="My Avatar"
        onerror="this.src = ''"
      />
      <div class="flex flex-col gap-4">
        <label for="username" class="grid gap-1">
          <p class="text-sm">Content</p>
          <textarea
            v-model="state.content"
            name="whatsHappening"
            placeholder="What's happening?"
            class="min-h-40 h-full w-full resize-none rounded-lg border-neutral-900 bg-transparent text-xl text-white"
          ></textarea>
        </label>
        <div class="flex items-center justify-between">
          <label for="username" class="grid gap-1">
            <p class="text-sm">Username</p>
            <input
              v-model="state.username"
              type="text"
              name="username"
              placeholder="test@example.com"
              class="w-full rounded-lg border-neutral-900 bg-transparent text-white"
            />
          </label>
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
const randomAvatar = `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${
  Math.floor(Math.random() * 1200) + 1
}.jpg`;

const state = reactive({
  username: "",
  content: "",
});

const mutation = useMutation({
  mutationKey: ["createTweet"],
  mutationFn: () => {
    if (!state.username || !state.content) {
      throw new Error("invalid");
    }
    return api.create({
      display_name: state.username,
      likes: [],
      retweets: [],
      media: [],
      text: state.content,
      tweetID: v4(),
      username: state.username,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.getAll,
    });
  },
});
</script>
