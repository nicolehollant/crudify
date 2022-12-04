<template>
  <div
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
            new Date(reply.createdAt).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })
          }}
        </p>
      </div>
      <p class="pt-1.5 leading-tight">{{ reply.content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
const props = defineProps<{
  reply: {
    accountID: string;
    content: string;
    createdAt: string;
  };
}>();

const { $auth } = useNuxtApp();

const getAccount = useQuery({
  queryFn: async () => {
    const [account] = await accountApi.match({
      accountID: props.reply.accountID,
    });
    return account;
  },
  queryKey: [`getTweet-${props.reply.accountID}`],
});
</script>
