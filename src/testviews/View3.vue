<template lang="html">
  <div class="">
    <div class="" id="three">
      <p>this is page 3 (main)</p>
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
#three p {
  background-color: lightgreen
}
</style>
