import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import { IonicVue } from "@ionic/vue";
/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPoZHVcD9U9ZR7gDsaBRONt3u1bPrCUEs",
  authDomain: "mobileproject-cd8ab.firebaseapp.com",
  projectId: "mobileproject-cd8ab",
  storageBucket: "mobileproject-cd8ab.appspot.com",
  messagingSenderId: "1029009664550",
  appId: "1:1029009664550:web:f7d6e30c470c9aa47054e7",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

let app: any;

auth.onAuthStateChanged(async (user) => {
  if (!app) {
    app = createApp(App)
      .use(IonicVue)
      .use(router);

    router.isReady().then(() => {
      app.mount("#app");
    });
  }
});
