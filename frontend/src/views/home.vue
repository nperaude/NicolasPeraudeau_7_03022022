<template>
  <div class="home">
    <header>
      <img
        src="../assets/icon-left-font.png"
        alt="logo groupomania"
        class="logo"
      />
      <div class="profilDeco">
        <div
          class="profil"
          @click="goToProfil()"
          :style="{ 'background-image': `url(${user.photoProfil})` }"
        ></div>
        <img
          src="../assets/deconnexion.png"
          alt="icon de deconnexion"
          class="deconnexion"
          @click="deconnexion()"
        />
      </div>
    </header>
    <div class="posts">
      <postnew />
      <post-component />
    </div>
  </div>
</template>

<script>
import postComponent from "../components/post.vue";

import postnew from "../components/postnew.vue";

export default {
  name: "homePage",

  components: {
    postComponent,
    postnew,
  },

  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
    this.$store.getters.getUserInfos;
    this.$store.dispatch("getAllPost");
    this.$store.dispatch("getLike");
    this.$store.dispatch("getAllComment");
    this.$store.commit("changeEtat", "getAllPost");
  },

  computed: {
    user() {
      return this.$store.getters.getUserInfos;
    },
  },

  methods: {
    deconnexion: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },

    goToProfil: function () {
      this.$router.push("/profil");
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.profilDeco {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.profil {
  width: 120px;
  height: 120px;
  margin-top: 3vh;
  margin-right: 5%;
  border-radius: 50%;
  border: solid 3px #2196f3;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
}

.deconnexion {
  width: 70px;
  height: 70px;
}
.deconnexion:hover {
  width: 75px;
  height: 75px;
  transition: 0.2s;
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .logo {
    width: 200px;
    margin-top: 3vh;
  }
  header {
    display: flex;
    align-items: center;
  }
  .profilDeco {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .profil {
    width: 80px;
    height: 80px;
    margin-top: 3vh;
    margin-right: 3%;
    border-radius: 50%;
    border: solid 3px #2196f3;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  .deconnexion {
    width: 35px;
    height: 35px;
  }
  .posts {
    width: 100%;
    margin-top: 5vh;
  }
}
</style>
