<template lang="html">
  <div class="">
    <div class="" id="four">
      <p>this is page 4(sub)</p>
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
#four p {
  background-color: lightcoral
}
</style>
