import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Clipboard from 'v-clipboard';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Clipboard);
Vue.use(Vuetify);

Vue.config.productionTip = process.env.NODE_ENV !== 'production';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
