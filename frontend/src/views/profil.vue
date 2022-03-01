<template>
  <div>
    <img
      src="../assets/icon-left-font.png"
      alt="logo"
      class="logo"
      @click="home()"
    />
    <img
      src="../assets/deconnexion.png"
      alt="icon de deconnexion"
      class="deconnexion"
      @click="deconnexion()"
    />
    <div class="posts">
      <div class="profil">
        <div class="photoChange">
          <input
            type="file"
            ref="photo"
            id=""
            v-if="mode == 'updateUserInfo'"
          />
          <div
            class="photoProfil"
            :style="{ 'background-image': `url(${user.photoProfil})` }"
          ></div>
          <button
            v-if="mode == 'updateUserInfo'"
            @click="updatePhotoProfil()"
            class="boutton"
          >
            Changer la photo de profil
          </button>
        </div>
        <div class="profilInfo">
          <p v-if="mode == 'userInfo'">{{ user.prenom }}</p>
          <input
            type="text"
            v-if="mode == 'updateUserInfo'"
            v-model="prenom"
            placeholder="Prenom"
            class="userUpdateInfo"
          />
          <p v-if="mode == 'userInfo'">{{ user.nom }}</p>
          <input
            type="text"
            v-if="mode == 'updateUserInfo'"
            v-model="nom"
            placeholder="Nom"
            class="userUpdateInfo"
          />
          <p v-if="mode == 'userInfo'">{{ user.email }}</p>
          <input
            type="text"
            v-model="email"
            v-if="mode == 'updateUserInfo'"
            placeholder="Email"
            class="userUpdateInfo"
          />
          <p v-if="this.$store.getters.getUserInfos.admin == 1">(admin)</p>
        </div>
        <div class="bouttonProfil">
          <button
            @click="switchToUpdateUserInfo()"
            v-if="mode == 'userInfo'"
            class="boutton"
          >
            modifier compte
          </button>
          <button
            v-if="mode == 'userInfo'"
            class="suppr"
            @click="supprProfil()"
          >
            Supprimer compte
          </button>
          <button
            v-if="mode == 'updateUserInfo'"
            @click="updateProfil()"
            class="boutton"
          >
            Modifier les infos du compte
          </button>
          <button
            @click="switchToUserInfo()"
            v-if="mode == 'updateUserInfo'"
            class="boutton"
          >
            Annuler
          </button>
        </div>
      </div>
      <ul class="bouttonPosts">
        <li class="active" @click="getUserPost()" v-if="post == 'userPost'">
          Vos publication
        </li>
        <li @click="getUserPost()" v-if="post != 'userPost'">
          Vos publication
        </li>
        <li
          class="active"
          @click="getPostUserLike()"
          v-if="post == 'userPostLike'"
        >
          Publication liké
        </li>
        <li @click="getPostUserLike()" v-if="post != 'userPostLike'">
          Publication liké
        </li>
      </ul>
      <post-component />
    </div>
  </div>
</template>
<script>
import postComponent from "../components/post.vue";
export default {
  name: "profilPage",
  components: {
    postComponent,
  },

  data: function () {
    return {
      mode: "userInfo",
      post: "userPost",
      photoProfil: null,
      nom: "",
      prenom: "",
      email: "",
    };
  },

  mounted: function () {
    this.$store.dispatch("getUserInfos");
    this.$store.commit("changeEtat", "getUserPost");
    this.$store.getters.getUserInfos;
    this.$store.dispatch("getUserPost");
    this.$store.dispatch("getAllComment");
  },

  computed: {
    user() {
      return this.$store.getters.getUserInfos;
    },
  },

  methods: {
    switchToUpdateUserInfo: function () {
      this.mode = "updateUserInfo";
    },

    switchToUserInfo: function () {
      this.mode = "userInfo";
    },

    updateProfil: function () {
      this.$store.dispatch("updateProfil", {
        userId: "",
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
      });
      this.mode = "userInfo";
    },

    updatePhotoProfil: function () {
      let input = this.$refs.photo;
      let file = input.files;
      this.photoProfil = file[0];
      this.$store.commit("setFormData", this.photoProfil);
      this.$store.dispatch("updatePhotoProfil");
    },

    getUserPost: function () {
      this.$store.dispatch("getUserPost");
      this.$store.commit("changeEtat", "getUserPost");
      this.post = "userPost";
    },

    getPostUserLike: function () {
      this.$store.dispatch("getPostUserLike");
      this.$store.commit("changeEtat", "getPostUserLike");
      this.post = "userPostLike";
    },

    deconnexion: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },

    supprProfil: function () {
      let confirmAction = confirm("Voulez-vous vraiment supprimer ce profil ?");
      if (confirmAction) {
        this.$store.dispatch("supprProfil");
        this.$router.push("/");
      }
    },

    home: function () {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.logo {
  cursor: pointer;
}
.deconnexion {
  width: 70px;
  height: 70px;
  float: right;
  margin-right: 5%;
  margin-top: 3vh;
  cursor: pointer;
}
.deconnexion:hover {
  width: 75px;
  height: 75px;
  transition: 0.2s;
}
.profil {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-around;
}
.photoProfil {
  width: 120px;
  height: 120px;
  margin-top: 3vh;
  border-radius: 50%;
  border: solid 3px #2196f3;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.profilInfo {
  display: flex;
  flex-direction: column;
  margin-left: 5%;
}

.userUpdateInfo {
  border: none;
  background-color: #dcdcdc;
  margin-bottom: 1vh;
  font-size: 20px;
  border-radius: 22px;
  padding: 2%;
}

.bouttonProfil {
  display: flex;
  flex-direction: column;
}

.boutton {
  border: none;
  color: #ffffff;
  font-size: 20px;
  background-color: #2196f3;
  border-radius: 22px;
  padding: 2%;
  margin-bottom: 1vh;
  cursor: pointer;
}

.suppr {
  border: none;
  color: #ffffff;
  font-size: 20px;
  border-radius: 22px;
  padding: 2%;
  margin-bottom: 1vh;
  cursor: pointer;
  background-color: #f33a21;
}

.suppr:hover {
  padding: 4%;
  transition: 0.2s;
}

.bouttonPosts {
  width: 100%;
  margin-top: 2%;
  display: flex;
  list-style: none;
}

.bouttonPosts li {
  text-align: center;
  padding: 1%;
  width: 50%;
  cursor: pointer;
}

.active {
  background-color: #ebebeb;
  border-radius: 32px 32px 0 0;
}

.postComp {
  background-color: #ebebeb;
  border-radius: 0 0 32px 32px;
  padding-top: 3%;
}

.userPost {
  border-right: solid 1px #707070;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .logo {
    width: 200px;
  }

  .deconnexion {
    width: 35px;
    height: 35px;
  }

  .posts {
    width: 100%;
    margin-top: 5vh;
  }

  .postComp {
    width: 100%;
  }
  .photoProfil {
    width: 80px;
    height: 80px;
  }

  .photoChange {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .photoChange input {
    font-size: 10px;
  }

  .boutton {
    font-size: 15px;
    padding: 2%;
  }

  .profilInfo p {
    font-size: 12px;
  }

  .userUpdateInfo {
    border: none;
    background-color: #dcdcdc;
    margin-bottom: 1vh;
    font-size: 12px;
    border-radius: 22px;
    padding: 1%;
  }

  .suppr {
    font-size: 15px;
    padding: 1%;
  }
}
</style>
