import { createRouter, createWebHashHistory } from 'vue-router';

import MainApp from '@/views/MainApp.vue';
import Home from '@/views/Home.vue';
import Voting from '@/components/Voting.vue';
import NotFound from '@/views/NotFound.vue';
import Loading from '@/views/Loading.vue';

// Hash history: the app is served as a static bundle (GitHub Pages) and the
// "save your votes" feature produces shareable #/wczytaj/<base64> links.
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/wczytaj/:dane?',
    name: 'loading',
    component: Loading,
    props: true
  },
  {
    // Old short links: /9/61/57 -> /glosowania/9/61/57
    path: '/:kadencja(\\d+)?/:posiedzenie(\\d+)?/:glosowanie(\\d+)?',
    redirect: (to) => ({ name: 'voting', params: to.params })
  },
  {
    path: '/glosowania',
    component: MainApp,
    children: [
      {
        path: ':kadencja(\\d+)?/:posiedzenie(\\d+)?/:glosowanie(\\d+)?',
        name: 'voting',
        component: Voting,
        props: true
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});