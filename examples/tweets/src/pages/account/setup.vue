<template>
  <div class="p-8 sm:p-[16vmin]">
    <form
      @submit.prevent="submit"
      class="m-auto grid max-w-sm gap-4 rounded-xl bg-slate-900 py-6 px-8"
    >
      <h2 class="pb-2 text-2xl">Twittify Account Setup</h2>
      <label for="email" class="grid gap-1">
        <p class="text-sm">Handle</p>
        <input
          type="text"
          name="email"
          v-model="twittifyHandle"
          class="rounded bg-transparent"
        />
      </label>
      <label for="email" class="grid gap-1">
        <p class="text-sm">Display Name</p>
        <input
          type="text"
          name="email"
          v-model="twittifyDisplayName"
          class="rounded bg-transparent"
        />
      </label>
      <button class="rounded bg-blue-600 p-2" @click="submit">Set Up</button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
const { $auth } = useNuxtApp();
const router = useRouter();
const twittifyHandle = ref("");
const twittifyDisplayName = ref("");
const twittifyAvatar = ref(
  `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${
    Math.floor(Math.random() * 1200) + 1
  }.jpg`
);
const submit = () =>
  authApi
    .updateAccount(
      {
        data: {
          ...($auth.account.value?.data ?? {}),
          twittifyHandle: twittifyHandle.value,
          twittifyDisplayName: twittifyDisplayName.value,
          twittifyAvatar: twittifyAvatar.value,
        },
      },
      $auth.tokens.accessToken ?? ""
    )
    .then((v) => {
      console.log({ v });
      router.push("/");
    });
</script>
