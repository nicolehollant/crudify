export default defineNuxtPlugin((nuxtApp) => {
  const tokens = reactive({
    accessToken: useCookie("accessToken"),
    refreshToken: useCookie("refreshToken"),
  });
  const account = ref<any>({});

  const signOut = () => {
    tokens.accessToken = null;
    tokens.refreshToken = null;
    account.value = {};
    window.location.reload();
  };

  return {
    provide: {
      auth: {
        tokens,
        account,
        signOut,
      },
    },
  };
});
