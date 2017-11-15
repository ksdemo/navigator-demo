<template>
  <div id="app">
    <img src="./assets/logo.png">
    <p>This is a navigator</p>
    <p class="small">In this example:</p>
    <p class="small">view1 and view3 is in main stage</p>
    <p class="small">view2 and view4 is in sub stage</p>
    <router-link :to="{ path: '/view1' }">view1</router-link>
    <router-link :to="{ path: '/view2' }">view2</router-link>
    <router-link :to="{ path: '/view3' }">view3</router-link>
    <router-link :to="{ path: '/view4' }">view4</router-link>
    <navigator
      :main="['view1', 'view3']"
      :on-before-enter="onBeforeEnter"
      :onEnter="onEnter"
      :on-before-leave="onBeforeLeave"
      :on-leave="onLeave"
      ></navigator>
  </div>
</template>

<script>
import Navigator from './components/Navigator'

export default {
  name: 'app',
  methods: {
    onBeforeEnter(el) {
      el.style.transform = 'translateX(100%)'
      el.style.transition = 'all 0.3s'
    },
    onEnter(el) {
      el.style.transform = 'translateX(0%)'
      el.style.transition = 'all 0.3s'
    },
    onBeforeLeave(el) {
      el.style.transform = 'translateX(0%)'
      el.style.transition = 'all 0.3s'
    },
    onLeave(el) {
      el.style.transform = 'translateX(-100%)'
      el.style.transition = 'all 0.3s'
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 60px;
}

.small {
  font-size: 35px;
  line-height: 15px;
}
</style>
