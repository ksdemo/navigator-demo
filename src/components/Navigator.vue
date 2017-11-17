<script>

/*
The navigator accept a 'main' prop, which receives an array containing route
paths that should not be 'stacked' while navigating.

A stacked page will be shown in sub stage, which will slide in from right when initialized,
and the page will be initialized every time.

An un-stacked page will be shown in main stage, which will have no animation when initialized,
and the page will be cached

basic rules:

- from main
  - to main
    - replace the page on main view
  - to sub
    - push a new page to stack
- form sub
  - to main
    - replace the page on main view, then pop every pages in stack and move to main
  - to sub
    - if the sub page to navigate is visited, pop every pages between current and the sub page and move to the sub page
    - else, push a new page to stack

 */
export default {
  name: 'navigator',
  props: {
    main: {
      type: Array
    },
    onBeforeEnter: {
      type: Function
    },
    onBeforeLeave: {
      type: Function
    },
    onEnter: {
      type: Function
    },
    onLeave: {
      type: Function
    }
  },
  created() {
    this.fromRoute = ''
    this.toRoute = ''
    this.cache = {}
    this.history = []
  },
  data() {
    return {
      clear: false
    }
  },
  methods: {
    // util functions
    partition(arr, iteratee) {
      const part = {
        'true': [],
        'false': []
      }

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (iteratee(item)) {
          part['true'].push(item)
        } else {
          part['false'].push(item)
        }
      }
      return part
    },
    interleavedSort(arr, filterIteratee, sortIteratee) {
      const part = this.partition(arr, filterIteratee)

      part['true'].sort(sortIteratee)

      for (let i = 0; i < arr.length; i++) {
        const value = arr[i]
        if (filterIteratee(value)) {
          arr[i] = part['true'].shift()
        }
      }
    },
    // truncate sub paths and parameters, and replace slashes with hyphen, as is not a valid dom selector
    getNavigatorPageId(key) {
      return 'navigator-page-' + key.replace(/\/.*/, '').replace(/\//g, '-')
    },
    // a router view is a main stage, when the path name starts with the keyword
    isMain(path) {
      for (var i = 0; i < this.main.length; i++) {
        const _path = this.main[i]
        const regExp = new RegExp('^' + _path)
        if (regExp.test(path)) {
          return true
        }
      }
      return false
    },
    randomStr() {
      const possible = '0123456789abcdef'
      let str = ''
      for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * possible.length)
        str += possible[index]
      }
      return str
    },
    transitionEndCallback() {
      this.clear = true
    },
    clearSubCaches(toRoute) {
      for (let routeName in this.cache) {
        if (this.cache.hasOwnProperty(routeName)) {
          if (!this.isMain(routeName) && toRoute !== routeName) {
            delete this.cache[routeName]
          }
        }
      }
    },

    // functions that returns vNode
    renderMatchedRouteComponent() {
      const component = this.$route.matched[0].components.default
      return this.$createElement(component)
    },
    wrap(vNode, routeName, key) {
      return this.$createElement('div', {
        class: 'navigator-page',
        key: key, // essential! a specified key will enable vue patcher to find the exact cached patcher
        attrs: {
          id: this.getNavigatorPageId(routeName),
          route: routeName.replace(/\/.*/, '').replace(/\//g, '-')
        }
      }, [vNode])
    },

    // class toggle functions
    addClass(key, className) {
      const dom = document.querySelector('#' + this.getNavigatorPageId(key))
      if (dom.className) {
        if (dom.className.indexOf('navigator-' + className) < 0) {
          dom.className += ' navigator-' + className
        }
      } else {
        dom.className = 'navigator-' + className
      }
    },
    removeClass(key, className) {
      const dom = document.querySelector('#' + this.getNavigatorPageId(key))
      dom.className = dom.className.replace('navigator-' + className, '').replace(/ {2,}/, '').replace(/ +$/, '')
    },

    // handler functions
    mainToMain(vNodes, toRoute) {
      // reorder main stage vNodes in param vNodes, remain sub stage untouched
      this.interleavedSort(vNodes, (vNode) => {
        return this.isMain(vNode.data.attrs.route)
      }, (aNode, bNode) => {
        return aNode.data.attrs.route === toRoute.replace(/\/.*/, '').replace(/\//g, '-')
      })
      setTimeout(() => {
        const toDom = document.querySelector('#' + this.getNavigatorPageId(toRoute))

        this.onBeforeLeave(toDom)
      }, 0);
    },
    mainToSub(vNodes, fromRoute, toRoute) {
      // ensure that main stage is next to end of vNodes, and sub stage is the end of vNodes
      for (let i = 0; i < vNodes.length; i++) {
        const vNode = vNodes[i]
        // move matched vNode to the end of the vNode array
        if (vNode.data.attrs.route === fromRoute) {
          vNodes.splice(i, 1)
          vNodes.push(vNode)
          break
        }
      }

      for (let i = 0; i < vNodes.length; i++) {
        const vNode = vNodes[i]
        // move matched vNode to the end of the vNode array
        if (vNode.data.attrs.route === toRoute) {
          // make toDom invisible before mounting
          if (!vNode.data.style) {
            vNode.data.style = {}
          }
          vNode.data.style.display = 'none'
          vNodes.splice(i, 1)
          vNodes.push(vNode)
          break
        }
      }

      setTimeout(() => {
        const fromDom = document.querySelector('#' + this.getNavigatorPageId(fromRoute))
        const toDom = document.querySelector('#' + this.getNavigatorPageId(toRoute))

        this.onBeforeLeave(fromDom, this.transitionEndCallback)
        setTimeout(() => {
          this.onLeave(fromDom, this.transitionEndCallback)
        }, 50);

        toDom.style.display = 'block'
        this.onBeforeEnter(toDom, this.transitionEndCallback)
        setTimeout(() => {
          this.onEnter(toDom, this.transitionEndCallback)
        }, 50);
      }, 0);
    },
    subToMain(vNodes, fromRoute, toRoute) {
      // ensure that main stage is next to end of vNodes, and sub stage is the end of vNodes
      for (let i = 0; i < vNodes.length; i++) {
        const vNode = vNodes[i]
        // move matched vNode to the end of the vNode array
        if (vNode.data.attrs.route === toRoute) {
          vNodes.splice(i, 1)
          vNodes.push(vNode)
          break
        }
      }
      for (let i = 0; i < vNodes.length; i++) {
        const vNode = vNodes[i]
        // move matched vNode to the end of the vNode array
        if (vNode.data.attrs.route === fromRoute) {
          vNodes.splice(i, 1)
          vNodes.push(vNode)
          break
        }
      }
      // then, call transition handler in reverse
      setTimeout(() => {
        const fromDom = document.querySelector('#' + this.getNavigatorPageId(fromRoute))
        const toDom = document.querySelector('#' + this.getNavigatorPageId(toRoute))

        this.onLeave(toDom, this.transitionEndCallback)
        setTimeout(() => {
          this.onBeforeLeave(toDom, this.transitionEndCallback)
        }, 50);

        this.onEnter(fromDom, this.transitionEndCallback)
        setTimeout(() => {
          this.onBeforeEnter(fromDom, this.transitionEndCallback)
        }, 50);
      }, 0);
    },
    subToSub(vNodes, fromRoute, toRoute) {
      this.mainToSub(vNodes, fromRoute, toRoute)
    },
    // from sub page to a visited sub page
    subToVisited(vNode, fromRoute, toRoute) {
      setTimeout(() => {
        const fromDom = document.querySelector('#' + this.getNavigatorPageId(fromRoute))
        const toDom = document.querySelector('#' + this.getNavigatorPageId(toRoute))

        this.onLeave(toDom, this.transitionEndCallback)
        setTimeout(() => {
          this.onBeforeLeave(toDom, this.transitionEndCallback)
        }, 50);

        this.onEnter(fromDom, this.transitionEndCallback)
        setTimeout(() => {
          this.onBeforeEnter(fromDom, this.transitionEndCallback)
        }, 50);
      }, 0);
    }
  },
  render(h) {
    if (!this.$route) {
      this.clear = false
      return this._vnode
    }

    this.toRoute = this.$route.path.replace(/\//, '')
    // when render function is called by transitionEndCallback (this.clear === true)
    // because this.cache is updated at this time
    // we only need to return a composed vnode based on cache
    if (this.clear) {
      this.clear = false

      let childVNodes = []
      for (let route in this.cache) {
        if (this.cache.hasOwnProperty(route)) {
          childVNodes.push(this.cache[route])
        }
      }

      // in this case, the order of main stage vNodes might not match our navigation history
      childVNodes.sort((a, b) => {
        return this.history.indexOf(a.data.attrs.route) - this.history.indexOf(b.data.attrs.route)
      })

      return h('div', {
        class: 'navigator'
      }, childVNodes)
    }

    // when the render is triggered by custom vuex store mutation
    // (when 'this.toRoute' will remain unchanged), ignore it
    if (this.toRoute === this.fromRoute) {
      this.clear = false
      return this._vnode
    }

    // when current route changed, but navigated to the same domain
    // ex. rewards/point-commodity => rewards/campaign, ignore it
    if (this.toRoute.split('/')[0] === this.fromRoute.split('/')[0]) {
      this.clear = false
      return this._vnode
    }

    const routeName = this.$route.matched[0].path.replace(/\//, '')
    const component = this.$route.matched[0].components.default
    // if the vNode is not cached, render the new vNode and cache it
    if (!this.cache[routeName]) {
      const routeVNode = this.renderMatchedRouteComponent(component)
      // wrap cached vNode with a div
      this.cache[routeName] = this.wrap(routeVNode, routeName, this.randomStr())
    }

    let childVNodes = []
    for (let route in this.cache) {
      if (this.cache.hasOwnProperty(route)) {
        childVNodes.push(this.cache[route])
      }
    }

    // handle different navigation cases.

    // if no from route (initial render)
    if (!this.fromRoute) {
      // to main stage
      if (this.isMain(this.toRoute)) {
        this.history = [this.toRoute]
      // to sub stage
      }
    } else {
      // from main stage
      if (this.isMain(this.fromRoute)) {
        // to main stage
        if (this.isMain(this.toRoute)) {
          this.mainToMain(childVNodes, this.toRoute)
          this.history = [this.toRoute] // truncate history to only main stage item
          this.clearSubCaches() // truncate cached vnodes for sub stage
        // to sub stage
        } else {
          this.mainToSub(childVNodes, this.fromRoute, this.toRoute)
          this.history.push(this.toRoute)
        }
      // from sub stage
      } else {
        // to main stage
        if (this.isMain(this.toRoute)) {
          this.subToMain(childVNodes, this.fromRoute, this.toRoute)
          this.history = [this.toRoute] // truncate history to only main stage item
          this.clearSubCaches() // truncate cached vnode fors sub stage
        // to sub stage
        } else {
          // if the sub to navigate is already visited
          if (this.history.indexOf(this.toRoute) > -1) {
            this.subToVisited(childVNodes, this.fromRoute, this.toRoute)
            const i = this.history.indexOf(this.toRoute)
            this.history.splice(i + 1) // truncate history to current page
            // truncate cached vnodes, leaving nodes for main stage and current page
            this.clearSubCaches(this.toRoute)
          } else {
            this.subToSub(childVNodes, this.fromRoute, this.toRoute)
            this.history.push(this.toRoute)
          }
        }
      }
    }

    // update route record
    this.fromRoute = this.toRoute
    // return composed vNodes to render
    const composedVNode = h('div', {
      class: 'navigator'
    }, childVNodes)
    this.clear = false
    return composedVNode
  }

}
</script>

<style>

  .navigator-page {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 400px;
  }

  .navigator {
    position: relative;
    top: 100px;
    width: 100%;
    height: 1000px;
    overflow: hidden;
  }

</style>
