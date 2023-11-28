<script setup>
import FilmHeader from '@/components/FilmHeader.vue';
import FilmFooter from './components/FilmFooter.vue';
</script>

<template>
  <div id="mainApp">
    <FilmHeader/>
  
    <router-view/>
  </div>
  <FilmFooter/>
  
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
