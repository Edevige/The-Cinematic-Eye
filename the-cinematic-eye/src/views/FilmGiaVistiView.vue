<script>
import List from '@/components/ListFilmVisti.vue';

export default {
    components: {
        List
    },
    data() {
        return {
            filmgiavisti: [],  // Variabile di stato iniziale per film già visti
            loading: true   // Variabile di stato per gestire il caricamento
        };
    },
    computed: {
        url() {
            return "filmgiavisti?user=" + this.$route.params.id;
        }
    }
};
</script>


<template>

    <div class="wrapper container" style="padding: 2rem;">
      <List :prop-url="url" title="Filmgiavisti" :id="parseInt(this.$route.params.id)" />
      
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