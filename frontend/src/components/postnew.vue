<template>
  <div class="newpost">
    <button v-if="previewImage != null" class="supprImage" @click="supprImage">
      <img src="../assets/delete.svg" alt="" />
    </button>
    <div
      v-if="previewImage != null"
      class="imagePreviewWrapper"
      :style="{ 'background-image': `url(${previewImage})` }"
      @click="selectImage"
    ></div>
    <textarea
      v-model="newPost"
      type="textarea"
      rows="10"
      cols="50"
      placeholder="Nouveau post..."
    />

    <div class="newpost__boutton">
      <label for="input" class="addimage">
        <input
          id="input"
          class="form-control"
          ref="fileInput"
          type="file"
          @input="pickFile"
        />

        <img
          src="../assets/Picture_icon.svg"
          alt="icon pour rajouter une image"
          class="image_icon"
        />
      </label>
      <button
        class="publier"
        :class="{ 'publier--disabled': newPost == '' && previewImage == null }"
        @click="createNewPost(), clearPost()"
      >
        Publier
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "testComponent",

  methods: {
    selectImage() {
      this.$refs.fileInput.click();
    },
    pickFile() {
      let input = this.$refs.fileInput;
      let file = input.files;
      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        this.imageFile = file[0];
        reader.readAsDataURL(file[0]);
      }
    },

    supprImage: function () {
      this.previewImage = null;
      this.imageFile = null;
    },

    createNewPost: function () {
      this.$store.commit("setFormData", this.imageFile);
      this.$store.dispatch("createNewPost", {
        text: this.newPost,
      });
    },

    clearPost: function () {
      this.newPost = "";
      this.previewImage = null;
    },
  },
  data: function () {
    return {
      newPost: "",
      previewImage: null,
      imageFile: null,
    };
  },
};
</script>

<style scoped>
.imagePreviewWrapper {
  background-repeat: no-repeat;
  width: auto;
  min-height: 300px;
  display: block;
  cursor: pointer;
  margin: 2% auto 2%;
  background-size: contain;
  background-position: center center;
}

.supprImage {
  position: relative;
  border: none;
  float: right;
  margin-right: 15%;
  margin-top: 2%;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.supprImage:hover {
  width: 27px;
  height: 27px;
  transition: 0.2s;
}
.newpost {
  background-color: #e0dcdc;
  margin-top: 3vh;
  margin-bottom: 3vh;
  width: 95%;
  height: auto;
  border-radius: 26px;
}

.newpost textarea {
  padding: 5px;
  resize: none;
  border: none;
  margin-left: 2.5%;
  margin-right: 2.5%;
  background-color: #e0dcdc;
  height: 13vh;
  width: 95%;
  font-size: 1.5rem;
}

.newpost textarea::placeholder {
  color: #616161;
  font-size: 30px;
}

.newpost__boutton {
  height: 6vh;
  border-top: solid 1px #707070;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.addimage {
  cursor: pointer;
  width: 4%;
}
.addimage input {
  display: none;
}
.addimage img {
  width: 100%;
}

.publier {
  cursor: pointer;
  margin-right: 5%;
  margin-left: 2%;
  border: none;
  color: #ffffff;
  background-color: #2196f3;
  border-radius: 26px;
  font-size: 1.5rem;
  padding-left: 20px;
  padding-right: 20px;
}

.publier--disabled {
  cursor: not-allowed;
  margin-right: 5%;
  margin-left: 2%;
  border: none;
  color: #e0dcdc;
  background-color: #929292;
  border-radius: 26px;
  font-size: 1.5rem;
  padding-left: 20px;
  padding-right: 20px;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .addimage {
    width: 8%;
  }
  .newpost {
    background-color: #e0dcdc;
    margin-top: 3vh;
    margin-bottom: 3vh;
    padding: 10px;
    width: 98%;
    height: auto;
    border-radius: 26px;
  }
}
</style>
