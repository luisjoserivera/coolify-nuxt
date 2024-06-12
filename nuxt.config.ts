// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,

  routeRules: {
    "/api/**": { cors: true },
    "/_ipx/**": { prerender: true },
  },

  runtimeConfig: {
    public: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      //
      firebaseAuthCookie: {
        /**
         * Only `__session` is permitted if you need to read cookies from GET requests
         * https://firebase.google.com/docs/hosting/manage-cache
         *
         * It reads as follows:
         * When using Firebase Hosting together with Cloud Functions or
         * Cloud Run, cookies are generally stripped from incoming requests.
         * This is necessary to allow for efficient CDN cache behavior.
         * Only the specially-named __session cookie is permitted to pass
         * through to the execution of your app.
         */
        name: "__session",
        lifetime: 60 * 60 * 8, // 8 hours
        // lifetime: 10,
        domain: "",
        path: "/",
        sameSite: "lax",
      },
    },
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
