import Vue from 'vue'
import App from './App.vue'
import AppLogin from './components/AppLogin/AppLogin'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const NotFound = { template: '<p>Page not found</p>' }
const AppPage = { App }
const AppLoginPage = { AppLogin }

const routes = {
  '/': AppPage,
  '/login': AppLoginPage
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
})

Vue.use(BootstrapVue)
