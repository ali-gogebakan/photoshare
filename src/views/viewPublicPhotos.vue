<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-row>
          <ion-button>
            <ion-button @click="goBack">
              <ion-icon slot="icon-only" :icon="caretBack"></ion-icon>
            </ion-button>
          </ion-button>
          <ion-title>{{ name }}'s Images</ion-title>
        </ion-row>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="loading">
      <div class="center">
        <ion-spinner color="primary"></ion-spinner>
      </div>
    </ion-content>
    <ion-content v-else>
      <div v-if="photos.length > 0">
        <ion-card v-for="(photo, index) in photos" :key="index">
          <ion-img :src="photo" />
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
import { caretBack } from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";

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

export default {
  name: "viewPublicPhotos",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonIcon,
    IonSpinner,
    IonLabel,
    IonCard,
    IonImg,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const params = route.params;
    const incomingId = params.id as string;

    const id = incomingId.split(":")[0] as string;
    const name = incomingId.split(":")[1] as string;

    const state = reactive({
      photos: [] as string[],
      loading: false,
    });

    const fetchPhotos = async (id: string) => {
      state.loading = true;

      const user = auth.currentUser;

      const snap = await db
        .collection("users")
        .doc(id)
        .collection("images")
        .get();

      if (!snap.empty) {
        snap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.image) {
            state.photos.push(data.image);
          }
        });
      }

      state.loading = false;
    };

    const goBack = () => {
      router.go(-1);
    };

    fetchPhotos(id);

    return {
      name,
      id,
      route,
      router,
      caretBack,
      ...toRefs(state),
      goBack,
      fetchPhotos,
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
