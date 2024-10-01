<script>
import List from '@/components/List.vue';

export default {
    components: {
        List
    },
    data() {
        return {
            filmVisti: [],  // Variabile di stato iniziale per film già visti
            loading: true   // Variabile di stato per gestire il caricamento
        };
    },
    computed: {
        url() {
            return "filmVisti?user=" + this.$route.params.id;
        }
    }
};
</script>


<template>

    <div class="wrapper container">
      <List :prop-url="url" title="FilmGiaVisti" :id="parseInt(this.$route.params.id)" />
      
    </div>


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