<template>
  <div class="login">
    <img
      src="../assets/icon-left-font.png"
      alt="logo groupomania"
      class="logo"
    />
    <div class="centrer">
      <div class="card">
        <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
        <h1 class="card__title" v-else>Inscription</h1>
        <p class="card__subtitle" v-if="mode == 'login'">
          Tu n'as pas encore de compte ?
          <span class="card__action" @click="switchToCreateAccount()"
            >Créer un compte</span
          >
        </p>
        <p class="card__subtitle" v-else>
          Tu as déjà un compte ?
          <span class="card__action" @click="switchToLogin()"
            >Se connecter</span
          >
        </p>

        <div class="form-row">
          <input
            v-model="email"
            class="form-row__input"
            type="text"
            placeholder="Adresse mail"
          />
        </div>
        <div class="form-row" v-if="mode == 'create'">
          <input
            v-model="prenom"
            class="form-row__input"
            type="text"
            placeholder="Prénom"
          />
          <input
            v-model="nom"
            class="form-row__input"
            type="text"
            placeholder="Nom"
          />
        </div>
        <div class="form-row">
          <input
            v-model="password"
            class="form-row__input"
            type="password"
            placeholder="Mot de passe"
          />
        </div>
        <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
          Adresse mail et/ou mot de passe invalide
        </div>
        <div
          class="form-row"
          v-if="mode == 'create' && status == 'error_create'"
        >
          Adresse mail déjà utilisée
        </div>
        <div class="form-row">
          <button
            @click="login()"
            class="button"
            :class="{ 'button--disabled': !validatedFields }"
            v-if="mode == 'login'"
          >
            <span v-if="status == 'loading'">Connexion en cours...</span>
            <span v-else>Connexion</span>
          </button>
          <button
            @click="createAccount()"
            class="button"
            :class="{ 'button--disabled': !validatedFields }"
            v-else
          >
            <span v-if="status == 'loading'">Création en cours...</span>
            <span v-else>Créer mon compte</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "loginPage",
  data: function () {
    return {
      mode: "login",
      email: "",
      prenom: "",
      nom: "",
      password: "",
    };
  },

  mounted: function () {},

  computed: {
    validatedFields: function () {
      if (this.mode == "create") {
        const prenomValid = /^[A-Za-zèéàêë]{2,20}$/.test(this.prenom);
        const nomValid = /^[A-Za-zèéàêë]{2,20}$/.test(this.nom);
        const emailValid =
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
            this.email
          );

        if (prenomValid && nomValid && emailValid && this.password != "") {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"]),
  },

  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
    login: function () {
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(
          function () {
            self.$router.push("/home");
          },
          function (error) {
            console.log(error);
          }
        );
    },
    createAccount: function () {
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          lastname: this.nom,
          firstname: this.prenom,
          password: this.password,
        })
        .then(
          function () {},
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>

<style scoped>
.login {
  min-height: 100vh;
}

.centrer {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background-color: #ffffff;
  border-radius: 26px;
  padding: 32px;
  width: 35%;
  box-shadow: 5px 6px 10px 3px rgba(55, 55, 55, 0.3);
}

.card__title {
  text-align: center;
}

.card__subtitle {
  text-align: center;
  color: #666;
}

.card__action {
  color: #2196f3;
  text-decoration: underline;
}
.card__action:hover {
  cursor: pointer;
}

.form-row {
  display: flex;
  margin: 25px 0px;
  gap: 25px;
  flex-wrap: wrap;
}

.form-row__input {
  padding: 15px;
  border: none;
  border-radius: 26px;
  background: #dcdcdc;
  font-weight: 500;
  font-size: 20px;
  flex: 1;
  min-width: 100px;
  height: 6vh;
  color: black;
}

.form-row__input::placeholder {
  color: #616161;
}
</style>
