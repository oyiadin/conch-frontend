<template>
  <div id="outer-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
#outer-container {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}
</style>
