<template>
  <NuxtLink
    v-if="size === 'base'"
    :to="`/${getAccount.data.value?.userName.split('@')[0]}/post/${tweet.id}`"
    class="grid grid-cols-[auto,minmax(0,1fr)] gap-4 border-t-2 border-neutral-900 px-6 py-4"
  >
    <NuxtLink :to="`/${getAccount.data.value?.userName.split('@')[0]}`">
      <img
        :src="getAccount.data.value?.avatar"
        class="h-14 w-14 rounded-full bg-gradient-to-br from-black to-blue-900 object-cover"
        alt="My Avatar"
        onerror="this.src = ''"
      />
    </NuxtLink>
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
          @click.prevent.stop="retweetTweet.mutate()"
          :class="{
            'text-green-500': tweet.retweets.some(
              (a) => a.accountID === $auth.profile.value?.accountID
            ),
          }"
        >
          <i-ant-design-retweet-outlined
            class="rounded-full group-hover:bg-green-500/30 group-hover:ring-4 group-hover:ring-green-500/30"
          />
          <p class="text-sm">{{ tweet.retweets.length }}</p>
        </button>
        <button
          class="group flex items-end gap-2"
          @click.prevent.stop="likeTweet.mutate()"
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
        <button class="group" @click.prevent.stop="share">
          <i-ant-design-share-alt-outlined
            class="rounded-full group-hover:bg-blue-500/30 group-hover:ring-4 group-hover:ring-blue-500/30"
          />
        </button>
      </div>
    </div>
    <textarea
      name="template"
      id=""
      class="sr-only whitespace-pre-wrap"
      aria-hidden
      ref="clipboardEl"
      :value="tweetHref"
    />
  </NuxtLink>
  <div v-else class="grid gap-4 border-t-2 border-neutral-900 px-6 py-4">
    <div class="flex items-center gap-4">
      <NuxtLink :to="`/${getAccount.data.value?.userName.split('@')[0]}`">
        <img
          :src="getAccount.data.value?.avatar"
          class="h-14 w-14 rounded-full bg-gradient-to-br from-black to-blue-900 object-cover"
          alt="My Avatar"
          onerror="this.src = ''"
        />
      </NuxtLink>
      <div>
        <p class="font-bold">
          {{ getAccount.data.value?.displayName }}
        </p>
        <p class="text-neutral-500">
          @{{ getAccount.data.value?.userName.split("@")[0] }}
        </p>
      </div>
    </div>
    <p class="pt-1.5 text-2xl leading-tight">{{ tweet.text }}</p>
    <div class="flex items-center gap-2 text-lg text-neutral-500">
      <p>
        {{
          new Date(tweet.createdAt).toLocaleTimeString(undefined, {
            timeStyle: "short",
          })
        }}
      </p>
      <p>&middot;</p>
      <p>
        {{
          new Date(tweet.createdAt).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })
        }}
      </p>
    </div>
    <hr class="border-neutral-800" />
    <section class="flex gap-6">
      <div class="flex items-baseline justify-between gap-2">
        <p class="font-bold">{{ tweet.retweets.length }}</p>
        <p class="text-sm text-neutral-500">Retweets</p>
      </div>
      <div class="flex items-baseline justify-between gap-2">
        <p class="font-bold">{{ tweet.likes.length }}</p>
        <p class="text-sm text-neutral-500">Likes</p>
      </div>
    </section>
    <hr class="border-neutral-800" />
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
    <div class="flex justify-around text-lg text-neutral-500">
      <i-ant-design-comment-outlined />
      <button
        class="group flex items-end gap-2"
        @click.prevent.stop="retweetTweet.mutate()"
        :class="{
          'text-green-500': tweet.retweets.some(
            (a) => a.accountID === $auth.profile.value?.accountID
          ),
        }"
      >
        <i-ant-design-retweet-outlined
          class="rounded-full group-hover:bg-green-500/30 group-hover:ring-4 group-hover:ring-green-500/30"
        />
      </button>
      <button
        class="group flex items-end gap-2"
        @click.prevent.stop="likeTweet.mutate()"
        :class="{
          'text-red-500': tweet.likes.some(
            (a) => a.accountID === $auth.profile.value?.accountID
          ),
        }"
      >
        <i-ant-design-heart-outlined
          class="rounded-full group-hover:bg-red-500/30 group-hover:ring-4 group-hover:ring-red-500/30"
        />
      </button>
      <button class="group" @click.prevent.stop="share">
        <i-ant-design-share-alt-outlined
          class="rounded-full group-hover:bg-blue-500/30 group-hover:ring-4 group-hover:ring-blue-500/30"
        />
      </button>
    </div>
    <hr class="border-neutral-800" />
    <section v-if="$auth.profile.value">
      <div class="flex items-center gap-4">
        <NuxtLink to="/account/setup" class="h-max w-max rounded-full">
          <img
            :src="$auth.profile.value.avatar"
            class="h-14 w-14 rounded-full bg-gradient-to-br from-black to-blue-900 object-cover"
            alt="My Avatar"
            onerror="this.src = ''"
          />
        </NuxtLink>
        <label for="username" class="grid flex-1 gap-1">
          <textarea
            v-model="reply.content"
            name="replyBox"
            placeholder="Reply to post"
            class="min-h-40 h-full w-full resize-none rounded-lg border-neutral-900 bg-transparent text-xl text-white"
          ></textarea>
        </label>
        <button
          @click="replyToTweet.mutate()"
          class="ml-auto w-max rounded-full bg-blue-600 px-4 py-2 font-bold"
        >
          Reply
        </button>
      </div>
    </section>
    <section class="-mx-6 grid">
      <Reply
        v-for="reply in tweet.replies"
        :key="reply.id"
        :reply="reply"
      ></Reply>
    </section>
    <textarea
      name="template"
      id=""
      class="sr-only whitespace-pre-wrap"
      aria-hidden
      ref="clipboardEl"
      :value="tweetHref"
    />
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { TweetsApi } from "@/composables/api";
import { v4 } from "uuid";
const queryClient = useQueryClient();
const props = withDefaults(
  defineProps<{
    tweet: TweetsApi["GetOneResponse"];
    size?: "base" | "lg";
  }>(),
  {
    size: "base",
  }
);

const { $auth } = useNuxtApp();
const reply = reactive({
  content: "",
});
const clipboardEl = ref(null);
const tweetHref = computed(() => {
  return (
    window.location.origin +
    `/${getAccount.data.value?.userName.split("@")[0]}/post/${props.tweet.id}`
  );
});

const share = () => {
  if (navigator && navigator.share) {
    navigator
      .share({
        text: tweetHref.value,
      })
      .then(() => {
        console.log("Thanks for sharing!");
      })
      .catch(console.error);
  } else {
    (clipboardEl.value as any).select();
    document.execCommand("copy");
  }
};

const getAccount = useQuery({
  queryFn: async () => {
    const [account] = await accountApi.match({
      accountID: props.tweet.accountID,
    });
    return account;
  },
  queryKey: ["getTweet", props.tweet.accountID],
});

const likeTweet = useMutation({
  mutationKey: ["likeTweet"],
  mutationFn: () => {
    if (!$auth.profile.value?.accountID) {
      throw new Error("invalid");
    }
    if (
      props.tweet.likes.some(
        (a) => a.accountID === $auth.profile.value?.accountID
      )
    ) {
      return api.updateOne(props.tweet.id, {
        ...props.tweet,
        likes: props.tweet.likes.filter(
          (account) => account.accountID !== $auth.profile.value?.accountID
        ),
      });
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
    (queryClient as any).invalidateQueries({
      queryKey: queryKeys.getAll,
    });
  },
});

const retweetTweet = useMutation({
  mutationKey: ["retweetTweet"],
  mutationFn: () => {
    if (!$auth.profile.value?.accountID) {
      throw new Error("invalid");
    }
    if (
      props.tweet.retweets.some(
        (a) => a.accountID === $auth.profile.value?.accountID
      )
    ) {
      return api.updateOne(props.tweet.id, {
        ...props.tweet,
        retweets: props.tweet.retweets.filter(
          (account) => account.accountID !== $auth.profile.value?.accountID
        ),
      });
    }
    return api.updateOne(props.tweet.id, {
      ...props.tweet,
      retweets: [
        ...props.tweet.retweets,
        { accountID: $auth.profile.value?.accountID },
      ],
    });
  },
  onSuccess: () => {
    (queryClient as any).invalidateQueries({
      queryKey: queryKeys.getAll,
    });
    (queryClient as any).invalidateQueries({
      queryKey: ["getUserProfileAccount"],
    });
    (queryClient as any).invalidateQueries({
      queryKey: ["getUserProfile"],
    });
    (queryClient as any).invalidateQueries({
      queryKey: ["getTweet"],
    });
  },
});

const replyToTweet = useMutation({
  mutationKey: ["replyToTweet"],
  mutationFn: () => {
    if (!$auth.profile.value?.accountID || !reply.content) {
      throw new Error("invalid");
    }
    return api.updateOne(props.tweet.id, {
      ...props.tweet,
      replies: [
        ...props.tweet.replies,
        {
          accountID: $auth.profile.value.accountID,
          content: reply.content,
          createdAt: new Date().toISOString(),
          id: v4(),
        },
      ],
    });
  },
  onSuccess: () => {
    (queryClient as any).invalidateQueries({
      queryKey: queryKeys.getAll,
    });
    (queryClient as any).invalidateQueries({
      queryKey: ["getUserProfileAccount"],
    });
    (queryClient as any).invalidateQueries({
      queryKey: ["getUserProfile"],
    });
    (queryClient as any).invalidateQueries({
      queryKey: ["getTweet"],
    });
  },
});
</script>
