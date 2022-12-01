export default defineNuxtRouteMiddleware(async () => {
  const { $auth } = useNuxtApp();
  if (
    !$auth.account.value?.data?.twittifyHandle ||
    !$auth.account.value?.data?.twittifyDisplayName ||
    !$auth.account.value?.data?.twittifyAvatar
  ) {
    return navigateTo("/account/setup");
  }
  return;
});
