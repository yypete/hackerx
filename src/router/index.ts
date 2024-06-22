import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import NewsComments from "../components/news-comments.vue";
import NewsRender from "../components/news-render.vue";
const routes: RouteRecordRaw[] = [];
routes.push(
  {
    path: "/item?id=:itemId",
    name: "NewsComments",
    component: NewsComments,
    props: true,
  },
  {
    path: "/:fetchType",
    name: "NewsRender",
    component: NewsRender,
    props: true,
  }
);

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: routes,
});
export default router;
