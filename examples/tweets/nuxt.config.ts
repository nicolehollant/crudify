import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-headlessui"],
  vite: {
    plugins: [
      Components({
        resolvers: [IconsResolver()],
      }),
      Icons(),
    ],
  },
  srcDir: "src/",
});
