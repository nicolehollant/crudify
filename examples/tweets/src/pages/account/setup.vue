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
          v-model="state.userName"
          class="rounded bg-transparent"
        />
      </label>
      <label for="email" class="grid gap-1">
        <p class="text-sm">Display Name</p>
        <input
          type="text"
          name="email"
          v-model="state.displayName"
          class="rounded bg-transparent"
        />
      </label>
      <label for="email" class="grid gap-1">
        <p class="text-sm">Bio</p>
        <input
          type="text"
          name="email"
          v-model="state.bio"
          class="rounded bg-transparent"
        />
      </label>
      <label class="grid gap-1">
        <p class="text-sm">Avatar</p>
        <FileToBase64
          v-model="state.avatar"
          :resized-width="160"
        ></FileToBase64>
      </label>
      <label class="grid gap-1">
        <p class="text-sm">Banner Color</p>
        <div
          class="h-8 w-16 cursor-pointer rounded border-2 border-gray-700"
          :style="{ background: state.banner }"
        ></div>
        <input type="color" v-model="state.banner" class="sr-only" />
      </label>
      <button class="rounded bg-blue-600 p-2" :disabled="isSubmitting">
        {{ isSubmitting ? "loading..." : "Set Up" }}
      </button>
    </form>
  </div>
  <pre><code>{{$auth.account.value}}</code></pre>
</template>

<script setup lang="ts">
import type { AccountApiTypes } from "@/composables/accountApi";
definePageMeta({
  middleware: ["auth"],
});
const { $auth } = useNuxtApp();
const router = useRouter();
const isSubmitting = ref(false);
const state = reactive<AccountApiTypes["PostRequest"]>({
  avatar: $auth.profile.value?.avatar ?? "",
  banner: $auth.profile.value?.banner ?? "#a21caf",
  bio: $auth.profile.value?.bio ?? "",
  createdAt: $auth.profile.value?.createdAt ?? new Date().toISOString(),
  displayName: $auth.profile.value?.displayName ?? "",
  userName: $auth.profile.value?.userName ?? "",
  accountID: $auth.profile.value?.accountID ?? $auth.account.value?.id,
  following: $auth.profile.value?.following ?? [],
  tweets: $auth.profile.value?.tweets ?? [],
  followers: $auth.profile.value?.followers ?? [],
});
const hasAccount = async () => {
  try {
    const data = await accountApi.match({ accountID: $auth.account.value?.id });
    if (data?.length) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
const submit = async () => {
  try {
    if (isSubmitting.value) {
      return;
    }
    if (!state.accountID || !state.displayName || !state.userName) {
      console.log({
        accountID: state.accountID,
        displayName: state.displayName,
        userName: state.userName,
      });
      throw new Error("Invalid");
    }
    const existing = await hasAccount();
    isSubmitting.value = true;
    if (existing && $auth.profile.value?.id) {
      await accountApi.updateOne($auth.profile.value?.id, {
        ...$auth.profile.value,
        ...state,
      });
    } else if (!existing) {
      await accountApi.create(state);
    }
    isSubmitting.value = false;
    router.push("/");
  } catch (error) {
    alert(error);
    isSubmitting.value = false;
  }
};
</script>
