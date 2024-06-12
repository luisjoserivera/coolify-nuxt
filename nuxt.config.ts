// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,

  routeRules: {
    "/api/**": { cors: true },
    "/_ipx/**": { prerender: true },
  },

  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "@/assets/scss/global.scss",
  ],

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "@/assets/scss/variables.scss" as *;',
          // additionalData: '@import "@/assets/scss/variables.scss";',
          // additionalData: '@import "~/assets/scss/variables.scss";',
        },
        scss: {
          additionalData: '@use "@/assets/scss/variables.scss" as *;',
          // additionalData: '@import "@/assets/scss/variables.scss";',
          // additionalData: '@import "~/assets/scss/variables.scss";',
        },
      },
    },
  },

  build: {
    transpile: [
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-solid-svg-icons",
    ],
  },

  nitro: {
    // preset: "firebase",
    // firebase: {
    //   nodeVersion: "18",
    //   gen: 1,
    //   region: "us-central1",
    // },
  },

  devServer: {
    // https: {
    //   // key: "certs/localhost-key.pem",
    //   // cert: "certs/localhost.pem",
    //   key: "certs/192.168.50.10-key.pem",
    //   cert: "certs/192.168.50.10.pem",
    // },
    host: "0.0.0.0", // default: localhost,
    // port: 5000, // default: 3000
  },
});
