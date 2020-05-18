import Vue from 'vue'
import App from './App.vue'
import VueNativeNotification from 'vue-native-notification'
import vueHeadful from 'vue-headful';

Vue.config.productionTip = false
Vue.use(VueNativeNotification, {
  requestOnNotify: true
})

Vue.component('vue-headful', vueHeadful);

new Vue({
  render: h => h(App),
}).$mount('#app')
