import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NewsComments from "../pages/header-nav/news-comments.vue";
import NewsRender from "../pages/header-nav/hacker-news.vue";
import HackerUser from "../pages/header-nav/hacker-user.vue";
import NewsUser from "../pages/header-nav/user-news.vue";
const routes: RouteRecordRaw[] = [];
routes.push(
  {
    path: "/item?id=:itemId",
    name: "NewsComments",
    component: NewsComments,
    props: true,
  },
  {
    path: "/user?id=:userId",
    name: "HackerUser",
    component: HackerUser,
    props: true,
  },
  {
    path: "/:fetchType",
    name: "NewsRender",
    component: NewsRender,
    props: true,
  },
  {
    path: "/:ids+",
    name: "NewsUser",
    component: NewsUser,
    props: true,
  }
);

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: routes,
});
export default router;
