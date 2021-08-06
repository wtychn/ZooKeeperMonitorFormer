import Vue from "vue";
import VueRouter from "vue-router";
import home from "@/components/home";
import NodesView from "@/components/NodesView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: home
  },
  {
    path: "/nodesView",
    name: "NodesView",
    component: NodesView
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
