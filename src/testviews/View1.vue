<template lang="html">
  <div class="">
    <div id="one">
      <p>this is page 1 (main)</p>
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
#one p {
  background-color: lightyellow
}
</style>
