import { useQueryClient } from "@tanstack/vue-query";
import { AccountApiResponse } from "../composables/accountApi";

export default defineNuxtPlugin((nuxtApp) => {
  const tokens = reactive({
    accessToken: useCookie("accessToken"),
    refreshToken: useCookie("refreshToken"),
  });
  const account = ref<any>({});
  const profile = ref<AccountApiResponse>();

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  const signOut = async () => {
    tokens.accessToken = null;
    tokens.refreshToken = null;
    account.value = {};
    profile.value = undefined;
    deleteAllCookies();
    window.location.reload();
  };

  return {
    provide: {
      auth: {
        tokens,
        account,
        signOut,
        profile,
      },
    },
  };
});
