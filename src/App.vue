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
      :is-main="isMain"
      :on-before-enter="onBeforeEnter"
      :onEnter="onEnter"
      :on-before-leave="onBeforeLeave"
      :on-leave="onLeave"
      :on-touch="onTouch"
      :swipe-back-edge-threshold="0.05"
      :swipe-back-release-threshold="0.5"
    ></navigator>
  </div>
</template>

<script>
import Navigator from './components/Navigator'

export default {
  name: 'app',
  methods: {
    isMain(route) {
      return route.path === '/view1' || route.path === '/view3'
    },
    onTouch(enterEl, leaveEl, x, y) {
      const screenWidth = window.document.documentElement.clientWidth
      const touchXRatio = x / screenWidth
      enterEl.style.transition = 'none'
      leaveEl.style.transition = 'none'
      enterEl.style.transform = `translate(${touchXRatio * 100}%)`
      leaveEl.style.transform = `translate(${touchXRatio * 50 - 50}%)`
    },
    onBeforeEnter(el, done) {
      const h = () => {
        done()
        el.removeEventListener('transitionend', h)
      }
      el.addEventListener('transitionend', h)
      el.style.transform = 'translateX(100%)'
      el.style.transition = 'all 0.3s'
    },
    onEnter(el, done) {
      const h = () => {
        done()
        el.removeEventListener('transitionend', h)
      }
      el.addEventListener('transitionend', h)
      el.style.transform = 'translateX(0%)'
      el.style.transition = 'all 0.3s'
    },
    onBeforeLeave(el, done) {
      const h = () => {
        done()
        el.removeEventListener('transitionend', h)
      }
      el.addEventListener('transitionend', h)
      el.style.transform = 'translateX(0%)'
      el.style.transition = 'all 0.3s'
    },
    onLeave(el, done) {
      const h = () => {
        done()
        el.removeEventListener('transitionend', h)
      }
      el.addEventListener('transitionend', h)
      el.style.transform = 'translateX(-50%)'
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
