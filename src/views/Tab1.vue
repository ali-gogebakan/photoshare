<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Upload Image</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" v-if="loading">
      <div class="center">
        <ion-spinner color="primary" style="transform: scale(2);"></ion-spinner>
      </div>
    </ion-content>

    <ion-content :fullscreen="true" v-else>
      <div class="center">
        <ion-button
          size="large"
          style="text-transform: none;"
          @click="takePicture"
        >
          <ion-icon :icon="camera"></ion-icon> &nbsp; Camera
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from "@ionic/vue";

import { camera } from "ionicons/icons";

import { storage, auth, db } from "../main";
import { Plugins, CameraResultType } from "@capacitor/core";
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

const { Camera } = Plugins;

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default {
  name: "Tab1",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
  },

  setup() {
    const router = useRouter();

    const state = reactive({
      loading: false,
    });

    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      state.loading = true;

      if (image?.base64String) {
        const user = auth.currentUser;

        const guid = uuidv4();

        const filePath = `${user?.uid}/images/${guid}.${image.format}`;

        const storageRef = storage.ref();

        await storageRef
          .child(filePath)
          .putString(image.base64String, "base64");
        const url = await storageRef.child(filePath).getDownloadURL();

        const result = await db
          .collection("users")
          .doc(user?.uid)
          .collection("images")
          .add({
            image: url,
          });
        state.loading = false;
      }
    };

    return {
      router,
      camera,
      takePicture,
      ...toRefs(state),
    };
  },
};
</script>

<style>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
</style>
