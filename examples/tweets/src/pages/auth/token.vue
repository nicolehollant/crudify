<template>
  <div>loading...</div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { $auth } = useNuxtApp();
onMounted(() => {
  if (!route.query.token) {
    router.push("/auth/login");
  }
  $auth.tokens.accessToken = "" + route.query.token;
  authApi.getAccount($auth.tokens.accessToken).then((v) => {
    $auth.account.value = v;
    router.push("/");
  });
});
</script>
