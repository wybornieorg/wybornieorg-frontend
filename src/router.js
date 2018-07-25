import Vue from "vue";
import Router from "vue-router";
import MainApp from "./views/MainApp";
import Home from "./views/Home";
import Voting from "./views/Voting";
import NotFound from "./views/NotFound";
import Loading from "./views/Loading";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/wczytaj/:dane?",
      name: "loading",
      component: Loading,
      props: true
    },
    {
      path: "/:kadencja(\\d+)?/:posiedzenie(\\d+)?/:glosowanie(\\d+)?",
      props: true,
      redirect:
        "/glosowania/:kadencja(\\d+)?/:posiedzenie(\\d+)?/:glosowanie(\\d+)?"
    },
    {
      path: "/glosowania/",
      children: [
        {
          path: ":kadencja(\\d+)?/:posiedzenie(\\d+)?/:glosowanie(\\d+)?",
          name: "voting",
          component: Voting,
          props: true
        }
      ],
      name: "main-app",
      component: MainApp
    },
    {
      path: "*",
      redirect: "/",
      name: "404",
      component: NotFound
    }
  ]
});
