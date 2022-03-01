<template>
  <div class="postComp">
    <h1 v-if="posts.length == 0">PAS DE PUBLICATION</h1>
    <div v-for="(post, idx) in posts" :key="idx" class="post">
      <div class="headerPost">
        <div
          class="profilPost"
          :style="{ 'background-image': `url(${post.photoProfil})` }"
        ></div>
        <h3>{{ post.prenom }} {{ post.nom }}:</h3>
        <img
          src="../assets/delete.svg"
          alt="icon poubelle"
          class="trash"
          @click="sendpostId(post.id), deletePost(post.image)"
          v-if="
            post.id_user == userId ||
            this.$store.getters.getUserInfos.admin == 1
          "
        />
      </div>
      <img v-if="post.image != null" :src="post.image" class="postImage" />

      <p class="post__texte">{{ post.texte }}</p>
      <div class="postinteraction">
        <div class="likes" @click="sendpostId(post.id), addLike()">
          <span>{{ post.nbLikes }}</span>
          <img
            src="../assets/like.svg"
            alt="like"
            class="like"
            v-if="!like(post.id)"
          />
          <img
            src="../assets/liked.svg"
            alt="like"
            class="like"
            v-if="like(post.id)"
          />
        </div>
        <div class="commentButton" @click="switchOpenComment(post.id)">
          <span>{{ post.nbComment }}</span>
          <img
            src="../assets/comment.svg"
            alt="comment"
            class="commentButton"
          />
        </div>
      </div>
      <div class="commentOpen" v-if="commentOpen && postId == post.id">
        <div class="newComment">
          <textarea
            type="textarea"
            rows="1"
            cols="50"
            placeholder="Ajouter commentaire..."
            :id="'comment' + post.id"
            v-model="newComment"
          />
          <img
            src="../assets/send.png"
            alt="boutton envoi commentaire"
            class="sendDisabled"
            v-if="newComment == ''"
          />
          <img
            src="../assets/send.png"
            alt="boutton envoi commentaire"
            class="send"
            @click="
              sendNewComment(post.id),
                sendpostId(post.id),
                newCommentaire(),
                clearComment()
            "
            v-if="newComment != ''"
          />
        </div>
        <div class="comments" v-for="(comment, idx) in comments" :key="idx">
          <div class="commentInfo" v-if="post.id == comment.id_post">
            <div
              class="profilComment"
              :style="{ 'background-image': `url(${comment.photoProfil})` }"
            ></div>
            <div class="comment">
              <h4 class="comment__title">
                {{ comment.prenom }} {{ comment.nom }}
              </h4>
              <p class="comment__texte">{{ comment.texte }}</p>
            </div>
            <img
              src="../assets/delete.svg"
              alt="icon poubelle"
              class="trash"
              @click="
                sendpostId(post.id), sendCommentId(comment.id), deleteComment()
              "
              v-if="
                comment.id_user == userId ||
                this.$store.getters.getUserInfos.admin == 1
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "postComponent",

  data: function () {
    return {
      newComment: "",
      postId: "",
      commentOpen: false,
      userId: this.$store.state.user.userId,
    };
  },

  methods: {
    sendpostId: function (id) {
      this.$store.commit("postId", id);
    },

    sendCommentId: function (id) {
      this.$store.commit("commentId", id);
    },

    sendNewComment: function (id) {
      this.newComment = document.getElementById("comment" + id).value;
      this.$store.commit("newComment", this.newComment);
    },

    clearComment: function () {
      this.newComment = "";
    },

    addLike: function () {
      this.$store.dispatch("addLike", {
        postId: "",
        userId: "",
      });
    },

    like: function (postId) {
      var allLike = this.$store.getters.getAllLike;

      for (const i in allLike) {
        var like = allLike[i];
        if (like.id_post == postId) {
          return true;
        }
      }
      return false;
    },

    newCommentaire: function () {
      this.$store.dispatch("newComment", {
        postId: "",
        text: "",
        userId: "",
      });
    },

    deletePost: function (imagePost) {
      this.$store.dispatch("deletePost", { postId: "", imagePost: imagePost });
    },

    switchOpenComment: function (postId) {
      if (this.commentOpen) {
        if (this.commentOpen && this.postId != postId) {
          this.commentOpen = false;
          this.postId = postId;
          this.commentOpen = true;
          return this.postId;
        }
        this.commentOpen = false;
        return (this.postId = postId);
      } else {
        this.commentOpen = true;
        return (this.postId = postId);
      }
    },

    deleteComment: function () {
      this.$store.dispatch("deleteComment", { commentId: "", postId: "" });
    },
  },

  computed: {
    posts() {
      return this.$store.getters.getPosts;
    },
    comments() {
      return this.$store.getters.getComments;
    },
  },
};
</script>

<style scoped>
.postComp {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.post {
  background-color: #e0dcdc;
  margin-bottom: 3vh;
  height: auto;
  width: 95%;
  border-radius: 26px;
}

.headerPost {
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: solid 1px #707070;
}

.profilPost {
  margin-left: 2%;
  width: 45px;
  height: 45px;
  border: solid 2px #2196f3;
  border-radius: 50%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.headerPost h3 {
  width: 80%;
  color: #616161;
  font-size: 1.5rem;
  padding-left: 5%;
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.trash {
  width: 3%;
  cursor: pointer;
}

.postImage {
  width: auto;
  max-height: 300px;
  display: block;
  margin: 2% auto 2%;
}

.post__texte {
  padding-left: 5%;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-right: 5%;
  font-size: 1.5rem;
  overflow-wrap: break-word;
}

.postinteraction {
  border-top: solid 1px #707070;
  display: flex;
}

.postinteraction div {
  display: flex;
  width: 50%;
  font-size: 25px;
  justify-content: center;
  align-items: center;
}

.likes {
  border-right: solid 1px #707070;
  cursor: pointer;
}

.like {
  width: 25px;
  margin-left: 20px;
}
.commentButton {
  width: 25px;
  margin-left: 20px;
  cursor: pointer;
}

.commentOpen {
  border-top: solid 1px #707070;
}
.newComment {
  border-radius: 32px;
  background-color: #c9c9c9;
  width: 80%;
  margin: 2% auto 1% auto;
  display: flex;
}
.newComment textarea {
  border: none;
  resize: none;
  border-radius: 32px 0 0 32px;
  background-color: #c9c9c9;
  font-size: 1.1rem;
  width: 93%;
  padding: 1% 0% 1% 2%;
}

.send {
  width: 4%;
  height: auto;
  cursor: pointer;
}

.sendDisabled {
  width: 4%;
  height: auto;
  cursor: not-allowed;
}

.commentInfo {
  display: flex;
  align-items: center;
}
.profilComment {
  margin-left: 2%;
  width: 45px;
  height: 45px;
  border: solid 2px #2196f3;
  border-radius: 50%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.comment {
  background-color: #c9c9c9;
  display: inline-block;
  margin: 1% 4% 1%;
  border-radius: 32px;
  padding: 1% 2% 1% 2%;
}

@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .post {
    width: 98%;
    padding: 5px;
  }
  .trash {
    width: 6%;
    cursor: pointer;
  }

  .postImage {
    width: auto;
    max-height: 200px;
    display: block;
    margin: 2% auto 2%;
  }
  .newComment {
    width: 90%;
  }
  .newComment textarea {
    width: 85%;
  }

  .send {
    width: 10%;
    height: auto;
  }

  .sendDisabled {
    width: 10%;
    height: auto;
  }
}
</style>
