<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  ionViewDidEnter() {
    console.log("Home page did enter");
  },
  ionViewDidLeave() {
    console.log("Home page did leave");
  },
  ionViewWillEnter() {
    console.log("Home page will enter");
  },
  ionViewWillLeave() {
    console.log("Home page will leave");
  },
  components: {
    IonApp,
    IonRouterOutlet,
  },
});
</script>
