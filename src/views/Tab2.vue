<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-row style="justify-content: space-between; display:flex;">
          <ion-button style="text-transform: none;" @click="onClickLogOut">
            LogOut
          </ion-button>

          <ion-title>Your Images</ion-title>

          <ion-button style="text-transform: none;" @click="onClickRefresh">
            <ion-icon :icon="reload" size="large"></ion-icon>
          </ion-button>
        </ion-row>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="loading">
      <div class="center">
        <ion-spinner color="primary" style="transform: scale(2);"></ion-spinner>
      </div>
    </ion-content>
    <ion-content v-else>
      <div v-if="photos.length > 0">
        <ion-card
          v-for="(imageData, index) in photos"
          :key="index"
          @click="onClickDelete(imageData)"
        >
          <ion-img :src="imageData.image" />
        </ion-card>
      </div>
      <div class="center" v-else>
        <ion-label>There are no photos to display</ion-label>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import { db, auth } from "../main";
import { reload, backspace } from "ionicons/icons";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonLabel,
  IonIcon,
  IonCard,
  IonImg,
} from "@ionic/vue";

export default defineComponent({
  name: "Tab2",

  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonContent,
    IonPage,
    IonSpinner,
    IonLabel,
    IonCard,
    IonImg,
  },
  setup() {
    const router = useRouter();

    const state = reactive({
      photos: [] as any[],
      loading: false,
    });

    const fetchPhotos = async () => {
      state.photos = [];
      state.loading = true;

      const user = auth.currentUser;

      const snap = await db
        .collection("users")
        .doc(user?.uid)
        .collection("images")
        .get();

      if (!snap.empty) {
        snap.docs.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          if (data.image) {
            state.photos.push(data);
          }
        });
      }

      state.loading = false;
    };

    const onClickRefresh = async () => {
      state.loading = true;
      state.photos = [];

      const user = auth.currentUser;

      const snap = await db
        .collection("users")
        .doc(user?.uid)
        .collection("images")
        .get();

      if (!snap.empty) {
        snap.docs.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          if (data.image) {
            state.photos.push(data);
          }
        });
      }

      state.loading = false;
    };

    const onClickDelete = async (imageData: any) => {
      await db
        .collection("users")
        .doc(auth?.currentUser?.uid)
        .collection("images")
        .doc(imageData.id)
        .delete();

      await fetchPhotos();
    };

    const onClickLogOut = async () => {
      state.photos = [];
      await auth.signOut();
      router.replace("/");
    };

    fetchPhotos();

    return {
      onClickLogOut,
      onClickDelete,
      onClickRefresh,
      reload,
      backspace,
      router,
      ...toRefs(state),
    };
  },
});
</script>

<style>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
</style>
