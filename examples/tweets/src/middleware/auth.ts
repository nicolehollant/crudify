export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const { $auth } = useNuxtApp();
    if (!$auth.tokens.accessToken) {
      navigateTo("/auth/login");
      return;
    }
    const tokens = await authApi.refresh(
      { refreshToken: $auth.tokens.refreshToken ?? undefined },
      $auth.tokens.accessToken
    );
    $auth.tokens.accessToken = tokens.accessToken;
    $auth.tokens.refreshToken = tokens.refreshToken;
    const account = await authApi.getAccount($auth.tokens.accessToken);
    if (!account?.checks?.isAuthorized) {
      navigateTo("/auth/login");
      return;
    }
    $auth.account.value = account;
    const profile = await accountApi
      .match({ accountID: account.id })
      .catch(() => {
        console.log("Auth Middleware: Caught error getting profile");
        if (to.path === "/account/setup") {
          return;
        } else {
          navigateTo("/account/setup");
        }
      });
    if (!profile?.length) {
      console.log(
        "Auth Middleware: Does not have profile, redirecting to account setup"
      );
      if (to.path === "/account/setup") {
        return;
      } else {
        navigateTo("/account/setup");
      }
      return;
    }
    $auth.profile.value = profile[0];
    return;
  } catch (error) {
    if (to.path === "/account/setup") {
      return;
    } else {
      navigateTo("/account/setup");
    }
  }
});
