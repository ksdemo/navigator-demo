# navigator-demo

A navigator component written in Vue

- Use it with vue-router...
- When navigating, any new view is pushed into view stack.
- You can specify 'main' routes, whose view will not be stacked.
- Transition is not implemented. Please use transition hook methods.
- Navigate back by swiping supported.

Usage example:
```html
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

```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
