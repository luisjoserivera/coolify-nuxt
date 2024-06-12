import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(ScrollToPlugin);

// export { gsap };

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide("gsap", gsap);
  nuxtApp.provide("gsap", gsap);

  nuxtApp.vueApp.provide("scrollTrigger", ScrollTrigger);
  nuxtApp.provide("scrollTrigger", ScrollTrigger);
});
