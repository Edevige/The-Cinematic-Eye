<script>
import List from '@/components/List.vue';

export default {
    components: {
        List
    },
    data() {
        return {
            preferiti: [],  // Variabile di stato iniziale per i preferiti
            loading: true   // Variabile di stato per gestire il caricamento
        };
    },
    computed: {
        url() {
            return "preferiti?user=" + this.$route.params.id;
        }
    }
};
</script>


<template>

    <div class="wrapper container" style="padding: 2rem;">
      <List :prop-url="url" title="Preferiti" :id="parseInt(this.$route.params.id)" />
      
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