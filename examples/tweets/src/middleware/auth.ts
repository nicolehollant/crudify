export default defineNuxtRouteMiddleware(async () => {
  const { $auth } = useNuxtApp();
  if (!$auth.tokens.accessToken) {
    return navigateTo("/auth/login");
  }
  const tokens = await authApi.refresh(
    { refreshToken: $auth.tokens.refreshToken ?? undefined },
    $auth.tokens.accessToken
  );
  $auth.tokens.accessToken = tokens.accessToken;
  $auth.tokens.refreshToken = tokens.refreshToken;
  const account = await authApi.getAccount($auth.tokens.accessToken);
  if (!account?.checks?.isAuthorized) {
    return navigateTo("/auth/login");
  }
  $auth.account.value = account;
  return;
});
