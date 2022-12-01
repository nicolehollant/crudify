<template>
  <div
    class="grid grid-cols-[auto,minmax(0,1fr)] gap-4 border-t-2 border-neutral-900 px-6 py-4"
  >
    <img
      :src="randomAvatar"
      class="h-14 w-14 rounded-full bg-gradient-to-br from-black to-blue-900"
      alt="My Avatar"
      onerror="this.src = ''"
    />
    <div class="flex flex-col pt-1 text-lg">
      <div class="flex gap-2 overflow-hidden leading-none text-neutral-50">
        <p class="line-clamp-1 font-bold">
          {{ tweet.display_name }}
        </p>
        <p class="line-clamp-1 w-min text-neutral-500">
          @{{ tweet.username.split("@")[0] }}
        </p>
        <p class="text-neutral-500">&middot;</p>
        <p class="shrink-0 text-neutral-500">
          {{ randomTime.toLocaleString(undefined, { dateStyle: "short" }) }}
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
            {{ Math.floor(Math.random() * tweet.retweets.length) }}
          </p>
        </div>
        <div class="flex items-end gap-2">
          <i-ant-design-retweet-outlined />
          <p class="text-sm">{{ tweet.retweets.length }}</p>
        </div>
        <div class="flex items-end gap-2">
          <i-ant-design-heart-outlined />
          <p class="text-sm">{{ tweet.likes.length }}</p>
        </div>
        <i-ant-design-upload-outlined />
        <div class=""></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetOneResponse } from "@/composables/api";
defineProps<{
  tweet: GetOneResponse;
}>();
const randomAvatar = `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${
  Math.floor(Math.random() * 1200) + 1
}.jpg`;
const randomTime = new Date();
randomTime.setHours(Math.floor(Math.random() * 24));
randomTime.setMinutes(Math.floor(Math.random() * 60));
randomTime.setDate(Math.floor(Math.random() * 28));
randomTime.setMonth(Math.floor(Math.random() * 12));
</script>
