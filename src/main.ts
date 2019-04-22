import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Clipboard from 'v-clipboard';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader
import 'vue-calendar-heatmap/dist/vue-calendar-heatmap.css';
const HeatMap = require('vue-calendar-heatmap');

Vue.use(Clipboard);
Vue.use(Vuetify);
Vue.use(HeatMap);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
