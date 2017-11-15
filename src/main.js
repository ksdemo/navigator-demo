// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Navigator from './components/Navigator.vue'
import View1 from './testviews/View1.vue'
import View2 from './testviews/View2.vue'
import View3 from './testviews/View3.vue'
import View4 from './testviews/View4.vue'

Vue.component(Navigator.name, Navigator)
Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  { path: '/view1', component: View1 },
  { path: '/view2', component: View2 },
  { path: '/view3', component: View3 },
  { path: '/view4', component: View4 },
]

var router = new VueRouter({
  routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})
