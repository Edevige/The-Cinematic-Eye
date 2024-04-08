<script setup>

import FilmCarouselGenres from '@/components/FilmCarouselGenres.vue';

</script>

<template>
  <main>
    <div class="wrapper">
      <FilmCarouselGenres propUrl="discover/movie" :genres_id="$route.params.id"></FilmCarouselGenres>
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