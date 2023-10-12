<script setup>

import FilmCarousel from './components/FilmCarousel.vue';
</script>

<template>

  <main>
    <div class="wrapper">
      <FilmCarousel :prop-url="'https://api.themoviedb.org/3/movie/popular'"/>
      <FilmCarousel :prop-url="'https://api.themoviedb.org/3/movie/top_rated'"/>
    </div>

  </main>
</template>

<style scoped>




@media (min-width: 1024px) {
  
  main{
    display: flex;
    place-items: center;
  }
  main .wrapper {
    display: flex;
    place-items: center;
    flex-wrap: wrap;
  }
}
</style>
