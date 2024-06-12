// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,

  routeRules: {
    "/api/**": { cors: true },
    "/_ipx/**": { prerender: true },
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
