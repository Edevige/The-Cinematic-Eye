<script>

import List from '@/components/List.vue';

export default{
    components: {
        List
    },
    data(){

    },
    computed:{
        url(){
            return "watchlist?user="+this.$route.params.id
        }
    }
}
</script>

<template>

    <div class="wrapper container">
      <List :prop-url="url" title="Watchlist"/>
      
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