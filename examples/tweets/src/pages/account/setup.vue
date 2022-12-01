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
      <label class="grid gap-1">
        <p class="text-sm">Avatar</p>
        <FileToBase64
          v-model="twittifyAvatar"
          :resized-width="160"
        ></FileToBase64>
      </label>
      <button
        class="rounded bg-blue-600 p-2"
        @click="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "loading..." : "Set Up" }}
      </button>
      <NuxtLink class="rounded p-2 text-blue-300" to="/" v-if="hasValidAccount">
        Cancel
      </NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
const { $auth } = useNuxtApp();
const router = useRouter();
const isSubmitting = ref(false);
const twittifyHandle = ref($auth.account?.value?.data?.twittifyHandle ?? "");
const twittifyDisplayName = ref(
  $auth.account?.value?.data?.twittifyDisplayName ?? ""
);
const twittifyAvatar = ref($auth.account?.value?.data?.twittifyAvatar ?? "");
const hasValidAccount = computed(() => {
  return (
    $auth.account?.value?.data?.twittifyHandle &&
    $auth.account?.value?.data?.twittifyDisplayName &&
    $auth.account?.value?.data?.twittifyAvatar
  );
});
const submit = () => {
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;
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
      isSubmitting.value = false;
      router.push("/");
    })
    .catch((e) => {
      alert(e);
      isSubmitting.value = false;
    });
};
</script>
