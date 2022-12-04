<template>
  <div
    class="grid grid-cols-[auto,minmax(0,1fr)] gap-4 border-t-2 border-neutral-900 px-6 py-4"
  >
    <img
      :src="getAccount.data.value?.avatar"
      class="h-14 w-14 rounded-full bg-gradient-to-br from-black to-blue-900 object-cover"
      alt="My Avatar"
      onerror="this.src = ''"
    />
    <div class="flex flex-col pt-1 text-lg">
      <div class="flex gap-2 overflow-hidden leading-none text-neutral-50">
        <p class="line-clamp-1 font-bold">
          {{ getAccount.data.value?.displayName }}
        </p>
        <p class="line-clamp-1 w-min text-neutral-500">
          @{{ getAccount.data.value?.userName.split("@")[0] }}
        </p>
        <p class="text-neutral-500">&middot;</p>
        <p class="shrink-0 text-neutral-500">
          {{
            new Date(tweet.createdAt).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })
          }}
        </p>
      </div>
      <p class="pt-1.5 leading-tight">{{ tweet.text }}</p>
      <div
        class="grid gap-1 pt-2"
        :class="{
          'grid-rows-2': tweet.media.length > 2,
          'grid-cols-2': tweet.media.length > 1,
        }"
        v-if="tweet.media.length"
      >
        <div
          v-for="(pic, i) in tweet.media"
          :class="{
            'row-span-2': tweet.media.length === 3 && i === 0,
            ' aspect-h-8 aspect-w-7':
              tweet.media.length === 2 || (tweet.media.length === 3 && i === 0),
            ' aspect-h-4 aspect-w-7': tweet.media.length === 3 && i > 0,
            ' aspect-h-2 aspect-w-1': tweet.media.length === 4,
          }"
        >
          <img
            :src="pic.url"
            alt=""
            class="rounded-lg border-2 border-neutral-800/50 object-cover"
          />
        </div>
      </div>
      <div class="flex justify-between pt-4 text-neutral-500">
        <div class="flex items-end gap-2">
          <i-ant-design-comment-outlined />
          <p class="text-sm">
            {{ tweet.replies.length }}
          </p>
        </div>
        <button
          class="group flex items-end gap-2"
          @click="likeTweet.mutate()"
          :class="{
            'text-red-500': tweet.likes.some(
              (a) => a.accountID === $auth.profile.value?.accountID
            ),
          }"
        >
          <i-ant-design-heart-outlined
            class="rounded-full group-hover:bg-red-500/30 group-hover:ring-4 group-hover:ring-red-500/30"
          />
          <p class="text-sm">{{ tweet.likes.length }}</p>
        </button>
        <i-ant-design-upload-outlined />
        <div class=""></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { TweetsApi } from "@/composables/api";
import { v4 } from "uuid";
const queryClient = useQueryClient();
const props = defineProps<{
  tweet: TweetsApi["GetOneResponse"];
}>();

const { $auth } = useNuxtApp();

const getAccount = useQuery({
  queryFn: () => accountApi.match({ accountID: props.tweet.accountID }),
  queryKey: [`getTweet-${props.tweet.accountID}`],
});

const likeTweet = useMutation({
  mutationKey: ["likeTweet"],
  mutationFn: () => {
    if (
      !$auth.profile.value?.accountID ||
      props.tweet.likes.some(
        (a) => a.accountID === $auth.profile.value?.accountID
      )
    ) {
      throw new Error("invalid");
    }
    return api.updateOne(props.tweet.id, {
      ...props.tweet,
      likes: [
        ...props.tweet.likes,
        { accountID: $auth.profile.value?.accountID },
      ],
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.getAll,
    });
  },
});
</script>
