import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { apolloProvider } from './graphql/apollo'

new Vue({
  el: '#app',
  apolloProvider,
  render: h => h(App)
})

Vue.use(BootstrapVue)
