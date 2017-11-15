<template lang="html">
  <div class="">
    <div class="" id="two">
      <p>this is page 2(sub)</p>
      <p>{{count}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.count++
    }, 500);
  }
}
</script>

<style lang="css">
#two p {
  background-color: lightblue
}
</style>
