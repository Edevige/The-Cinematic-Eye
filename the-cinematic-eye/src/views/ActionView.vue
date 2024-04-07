<script setup>

import FilmCarousel from '@/components/FilmCarousel.vue';
</script>

<template>
  <main>
    <div class="wrapper">
      <FilmCarousel :prop-url="'discover/movie'" title="Azione"/>
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