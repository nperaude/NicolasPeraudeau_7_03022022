import { createStore } from "vuex";

const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

let itemstr = localStorage.getItem("item");
let user;
let hour = 24;
if (!itemstr) {
  user = {
    userId: -1,
    token: "",
    expiry: "",
  };
} else {
  const item = JSON.parse(itemstr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem("item");
  } else {
    try {
      user = JSON.parse(itemstr);
      instance.defaults.headers.common["Authorization"] = user.token;
    } catch (ex) {
      user = {
        userId: -1,
        token: "",
        expiry: "",
      };
    }
  }
}

const store = createStore({
  state: {
    status: "",
    user: user,

    userInfos: { nom: "", prenom: "", email: "", photoProfil: "", admin: "" },

    posts: [],

    allLike: [],

    postId: "",

    commentId: "",

    comments: [],

    newComment: "",

    etat: "",

    formData: "",
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getPosts(state) {
      return state.posts;
    },

    getAllLike(state) {
      return state.allLike;
    },

    getFormData(state) {
      return state.formData;
    },

    getComments(state) {
      return state.comments;
    },

    getPostsId(state) {
      return state.postId;
    },

    getCommentId(state) {
      return state.commentId;
    },

    getNewComment(state) {
      return state.newComment;
    },

    getUserInfos(state) {
      return state.userInfos;
    },

    getEtat(state) {
      return state.etat;
    },
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },

    logUser: function (state, user) {
      //instance.default.headers.common["Authorization"] = user.token;
      const now = new Date();

      const item = {
        userId: user.userId,
        token: user.token,
        expiry: now.getTime() + hour * 60 * 60 * 1000,
      };
      localStorage.setItem("item", JSON.stringify(item));
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },

    logout: function (state) {
      state.user = {
        userId: -1,
        token: "",
        expiry: "",
      };
      localStorage.removeItem("item");
    },

    allPost: function (state, posts) {
      state.posts = posts;
    },

    allLike: function (state, likes) {
      state.allLike = likes;
    },

    postId: function (state, id) {
      state.postId = id;
    },

    commentId: function (state, id) {
      state.commentId = id;
    },

    allComment: function (state, comments) {
      state.comments = comments;
    },

    newComment: function (state, newComment) {
      state.newComment = newComment;
    },

    changeEtat: function (state, etat) {
      state.etat = etat;
    },

    setFormData: function (state, formData) {
      state.formData = formData;
    },
  },
  actions: {
    createAccount: ({ commit }, userInfos) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        commit;
        instance
          .post("/user/signup", userInfos)
          .then(function (response) {
            commit("setStatus", "created");
            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_create");
            reject(error);
          });
      });
    },

    login: ({ commit }, userinfos) => {
      commit("setStatus", "loading");
      return new Promise((resolve, reject) => {
        instance
          .post("/user/login", userinfos)
          .then(function (response) {
            commit("setStatus", "");
            commit("logUser", response.data);
            resolve(response);
          })
          .catch(function (error) {
            commit("setStatus", "error_login");
            reject(error);
          });
      });
    },
    getUserInfos: ({ commit, getters }) => {
      instance
        .post("/user/infos", { userId: getters.getUser.userId })
        .then(function (response) {
          commit("userInfos", response.data[0]);
        })
        .catch(function () {});
    },

    createNewPost: ({ dispatch, getters }, newPost) => {
      var formData = new FormData();
      formData.append("file", getters.getFormData);
      formData.append("text", newPost.text);
      formData.append("userId", getters.getUser.userId);
      return new Promise((resolve, reject) => {
        instance
          .post("/post/", formData)
          .then((response) => {
            dispatch("getAllPost");
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    getAllPost: ({ commit }) => {
      instance
        .get("/post/")
        .then(function (response) {
          commit("allPost", response.data);
        })
        .catch(function () {});
    },

    getUserPost: ({ commit, getters }) => {
      instance
        .post("/post/userPost", { userId: getters.getUser.userId })
        .then(function (response) {
          commit("allPost", response.data);
        })
        .catch(function () {});
    },

    getPostUserLike: ({ commit, getters }) => {
      instance
        .post("/post/postUserLike", { userId: getters.getUser.userId })
        .then(function (response) {
          commit("allPost", response.data);
        })
        .catch(function () {});
    },

    deletePost: ({ dispatch, getters }, postInfo) => {
      postInfo.postId = getters.getPostsId;
      instance
        .post("/post/deletePost", postInfo)
        .then(function () {
          switch (getters.getEtat) {
            case "getAllPost":
              dispatch("getAllPost");
              break;
            case "getUserPost":
              dispatch("getUserPost");
              break;
            case "getPostUserLike":
              dispatch("getPostUserLike");
              break;
          }
        })
        .catch(function () {});
    },

    getAllComment: ({ commit }) => {
      instance
        .get("/comment/")
        .then(function (response) {
          commit("allComment", response.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    },

    deleteComment: ({ getters, dispatch }, commentInfo) => {
      commentInfo.commentId = getters.getCommentId;
      commentInfo.postId = getters.getPostsId;

      instance.post("/comment/deleteComment", commentInfo).then(function () {
        dispatch("getAllComment");
        switch (getters.getEtat) {
          case "getAllPost":
            dispatch("getAllPost");
            break;
          case "getUserPost":
            dispatch("getUserPost");
            break;
          case "getPostUserLike":
            dispatch("getPostUserLike");
            break;
        }
      });
    },

    addLike: ({ getters, dispatch }, likeInfo) => {
      likeInfo.postId = getters.getPostsId;
      likeInfo.userId = getters.getUser.userId;
      instance
        .patch("/post/", likeInfo)
        .then(function () {
          switch (getters.getEtat) {
            case "getAllPost":
              dispatch("getAllPost");
              break;
            case "getUserPost":
              dispatch("getUserPost");
              break;
            case "getPostUserLike":
              dispatch("getPostUserLike");
              break;
          }
          dispatch("getLike");
        })
        .catch(function () {});
    },

    getLike: ({ commit, getters }) => {
      instance
        .post("/post/getLike", { userId: getters.getUser.userId })
        .then(function (response) {
          commit("allLike", response.data);
        })
        .catch(function () {});
    },

    newComment: ({ getters, dispatch }, newCommentInfo) => {
      newCommentInfo.text = getters.getNewComment;
      newCommentInfo.postId = getters.getPostsId;
      newCommentInfo.userId = getters.getUser.userId;
      instance
        .post("/comment/", newCommentInfo)
        .then(function () {
          dispatch("getAllComment");
          switch (getters.getEtat) {
            case "getAllPost":
              dispatch("getAllPost");
              break;
            case "getUserPost":
              dispatch("getUserPost");
              break;
            case "getPostUserLike":
              dispatch("getPostUserLike");
              break;
          }
        })
        .catch(function () {});
    },

    updateProfil: ({ dispatch, getters }, updatedUser) => {
      updatedUser.userId = getters.getUser.userId;
      instance
        .post("user/updateUser", updatedUser)
        .then(function () {
          dispatch("getUserInfos");
          dispatch("getAllComment");
          switch (getters.getEtat) {
            case "getAllPost":
              dispatch("getAllPost");
              break;
            case "getUserPost":
              dispatch("getUserPost");
              break;
            case "getPostUserLike":
              dispatch("getPostUserLike");
              break;
          }
        })
        .catch(function () {});
    },

    updatePhotoProfil: ({ getters, dispatch }) => {
      var formData = new FormData();
      formData.append("file", getters.getFormData);
      formData.append("userId", getters.getUser.userId);
      formData.append("oldPhotoProfil", getters.getUserInfos.photoProfil);
      return new Promise((resolve, reject) => {
        instance
          .post("/user/updatePhotoProfil", formData)
          .then((response) => {
            dispatch("getUserInfos");
            dispatch("getAllComment");
            switch (getters.getEtat) {
              case "getAllPost":
                dispatch("getAllPost");
                break;
              case "getUserPost":
                dispatch("getUserPost");
                break;
              case "getPostUserLike":
                dispatch("getPostUserLike");
                break;
            }
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    supprProfil: ({ commit, getters }) => {
      instance
        .post("/user/delete", { userId: getters.getUser.userId })
        .then(() => {
          commit("logout");
        })
        .catch(() => {});
    },
  },
  modules: {},
});
export default store;
