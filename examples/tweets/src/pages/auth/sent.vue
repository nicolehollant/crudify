<template>
  <div class="p-8 sm:p-[16vmin]">
    <div class="m-auto grid max-w-xs gap-2">
      <h2 class="py-2 text-2xl">Twittify Sign In</h2>
      <p>Check your email</p>
      <p>
        Didn't receive a code? Return to
        <NuxtLink class="text-blue-300" to="/auth/login">Sign In</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const email = ref("");
const submit = () =>
  authApi.signIn({ email: email.value }).then((v) => {
    if (v?.message === "Success") {
      router.push("/auth/sent");
    }
  });
</script>
