import { createRouter, createWebHistory } from "vue-router";

import login from "@/views/login.vue";
import home from "@/views/home.vue";
import NotFound from "@/views/NotFound.vue";
import profil from "@/views/profil.vue";
const routes = [
  {
    path: "/",
    name: "Login",
    component: login,
    meta: {
      title: "login",
    },
  },
  {
    path: "/home",
    name: "home",
    component: home,
    meta: {
      title: "home",
    },
  },

  {
    path: "/profil",
    name: "profil",
    component: profil,
    meta: {
      title: "profil",
    },
  },

  {
    path: "/:pathMatch(.*)",
    component: NotFound,
    meta: {
      title: "404 Not Found",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to, from) => {
  console.log(from, to);
  document.title = to.meta.title;
});

export default router;
