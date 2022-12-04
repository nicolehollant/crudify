export default defineNuxtRouteMiddleware(async () => {
  try {
    const { $auth } = useNuxtApp();
    if (
      !$auth.profile.value?.avatar ||
      !$auth.profile.value?.displayName ||
      !$auth.profile.value?.userName
    ) {
      return navigateTo("/account/setup");
    }
    return;
  } catch (error) {
    return navigateTo("/account/setup");
  }
});
