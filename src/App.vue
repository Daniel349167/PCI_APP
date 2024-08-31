<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { sqlite } from './assets/mixins/sqlite.js';

export default {
  name: 'app',
  mixins: [sqlite],
  mounted() {
    console.log('App');
    this.sqliteInit();
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
}
</style>
