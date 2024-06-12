import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faTwitterSquare,
  faFacebook,
  faLinkedin,
  faInstagram,
  faGithubSquare,
} from "@fortawesome/free-brands-svg-icons";

import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(
  fas,
  faTwitterSquare,
  faInstagram,
  faFacebook,
  faLinkedin,
  faGithubSquare,
);
// import { far } from "@fortawesome/free-regular-svg-icons";
// import { fab } from "@fortawesome/free-brands-svg-icons";

// Add all icons to the library so you can use it in your page
// library.add(fas, far, fab);

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon, {});
});
