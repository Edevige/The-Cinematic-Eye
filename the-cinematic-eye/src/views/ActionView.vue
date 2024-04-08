<script setup>

import FilmCarouselGenres from '@/components/FilmCarouselGenres.vue';
</script>

<template>
  <main>
    <div class="wrapper">
      <FilmCarouselGenres :prop-url="'discover/movie'" title="Azione" :genres_id="28"/>
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