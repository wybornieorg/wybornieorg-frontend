import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import moment from 'moment';

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faLightbulb,
  faBookmark,
  faCheckCircle,
  faChartBar,
  faArrowCircleLeft,
  faArrowCircleRight,
  faBars,
  faSave,
  faWrench,
  faHeart,
  faWindowClose,
  faSyncAlt,
  faCalendar,
  faUsers,
  faSortUp,
  faSortDown,
  faFilter,
  faExternalLinkAlt,
  faSearch,
  faCheckSquare,
  faThumbsUp,
  faQuestion,
  faThumbsDown,
  faBolt,
  faFileAlt,
  faFilePdf,
  faFile,
  faComments,
  faTv
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faGithub,
  faTrello,
  faKeybase,
  faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router';

// Only the icons the templates actually reference are registered, instead of
// pulling in the whole ~2600-icon set.
library.add(
  faLightbulb,
  faBookmark,
  faCheckCircle,
  faChartBar,
  faArrowCircleLeft,
  faArrowCircleRight,
  faBars,
  faSave,
  faWrench,
  faHeart,
  faWindowClose,
  faSyncAlt,
  faCalendar,
  faUsers,
  faSortUp,
  faSortDown,
  faFilter,
  faExternalLinkAlt,
  faSearch,
  faCheckSquare,
  faThumbsUp,
  faQuestion,
  faThumbsDown,
  faBolt,
  faFileAlt,
  faFilePdf,
  faFile,
  faComments,
  faTv,
  faFacebook,
  faGithub,
  faTrello,
  faKeybase,
  faDiscord
);

moment.locale('pl');

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  // eslint-disable-next-line no-console
  console.error('[app error]', info, err && err.stack ? err.stack : err);
};

app.component('font-awesome-icon', FontAwesomeIcon);

// Kept as global properties so existing templates (`this.moment`) keep working.
app.config.globalProperties.moment = moment;
app.config.globalProperties.$http = axios;

app.use(createPinia());
app.use(router);
// `popover` is our own theme name; it extends the built-in `dropdown` theme so
// that it inherits the click trigger behaviour and placement defaults.
app.use(FloatingVue, {
  themes: {
    popover: {
      $extend: 'dropdown'
    }
  }
});

app.mount('#app');