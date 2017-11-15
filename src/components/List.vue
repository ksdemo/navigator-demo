<template>
  <div>
    <!-- <transition-group name="slide"> -->
      <span>{{todo.content}}</span>
      <button @click="deleteItem">X</button>
    <!-- </transition-group> -->
  </div>
</template>

<script>
  export default {
    name: 'list',
    props: ['todo'],
    data () {
      return {
        index: 0
      }
    },
    methods: {
      deleteItem(e) {
        this.$emit('del', e)
      }
    }
  }
</script>
