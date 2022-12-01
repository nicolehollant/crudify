<template>
  <div class="p-8 sm:p-[16vmin]">
    <form
      @submit.prevent="submit"
      class="m-auto grid max-w-sm gap-4 rounded-xl bg-slate-900 py-6 px-8"
    >
      <h2 class="pb-2 text-2xl">Twittify Sign In</h2>
      <label for="email" class="grid gap-1">
        <p class="text-sm">Email</p>
        <input
          type="text"
          name="email"
          v-model="email"
          class="rounded bg-transparent"
        />
      </label>
      <button
        class="rounded bg-blue-600 p-2"
        @click="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "loading..." : "Sign In" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const email = ref("");
const isSubmitting = ref(false);
const submit = () => {
  if (!isSubmitting.value) {
    isSubmitting.value = true;
    authApi
      .signIn({ email: email.value })
      .then((v) => {
        console.log({ v });
        if (
          v?.message === "Success" ||
          (v as any) === "Successfully sent email"
        ) {
          router.push("/auth/sent");
        }
        isSubmitting.value = false;
      })
      .catch((e) => {
        alert(e);
        isSubmitting.value = false;
      });
  }
};
</script>
