<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Explore Others</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="usersLoading">
      <div class="center">
        <ion-spinner color="primary"></ion-spinner>
      </div>
    </ion-content>
    <ion-content v-else>
      <div v-if="users.length > 0">
        <ion-card v-for="(user, index) in users" :key="index">
          <ion-row>
            <ion-button
              style="flex:9; text-transform: none;"
              size="large"
              expand="block"
              @click="goToPhotosPage(user)"
            >
              <ion-col>
                <iot-card-header>{{ user.name }}</iot-card-header>

                <br />
                <iot-card-label>{{ user.email }}</iot-card-label>
              </ion-col>
            </ion-button>
            <ion-col
              style="display:flex ; flex:1, padding:0; justify-content:center; align-items:center"
            >
              <ion-icon
                :icon="chevronForwardCircleOutline"
                size="large"
              ></ion-icon>
            </ion-col>
          </ion-row>
        </ion-card>
      </div>

      <div class="center" v-else>
        <ion-label>There are no users to display</ion-label>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// @ts-nocheck
/* eslint-disable */

import { reactive, toRefs, onMounted } from "vue";
import { db, auth } from "../main";
import { chevronForwardCircleOutline } from "ionicons/icons";
import { useRouter } from "vue-router";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonLabel,
  IonCard,
  IonIcon,
  IonImg,
} from "@ionic/vue";

export default {
  name: "Tab3",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonSpinner,
    IonLabel,
    IonCard,
    IonIcon,
    IonImg,
  },
  setup() {
    const router = useRouter();

    const state = reactive({
      users: [] as string[],
      loadingUsers: false,
    });

    console.log(auth.currentUser);
    const fetchUsers = async () => {
      state.loadingUsers = true;
      const snap = await db.collection("users").get();

      if (!snap.empty) {
        snap.docs.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          if (auth.currentUser?.email !== doc.data().email) {
            state.users.push({ id: id, ...data });
          }
        });
      }

      state.loadingUsers = false;
    };

    const goToPhotosPage = async (data) => {
      console.log(data);
      router.push(`/tabs/viewPublicPhotos/${data.id}:${data.name}`);
    };

    fetchUsers();

    return {
      fetchUsers,
      goToPhotosPage,
      chevronForwardCircleOutline,
      ...toRefs(state),
      router,
    };
  },
};
</script>
