import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import axios from "axios";
import VueAxios from "vue-axios";
import moment from "moment";
import Vtooltip from "v-tooltip";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);
library.add(fab);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.prototype.moment = moment;
moment.locale("pl");

Vue.use(VueAxios, axios);
Vue.use(router);
Vue.use(Vtooltip);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
