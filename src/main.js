import Vue from 'vue'
import App from './App.vue'
import VueNativeNotification from 'vue-native-notification'

Vue.config.productionTip = false
Vue.use(VueNativeNotification, {
  requestOnNotify: true
})

new Vue({
  render: h => h(App),
}).$mount('#app')
