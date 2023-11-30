<script>
import FilmReviews from '@/components/FilmReviews.vue';
import axios from 'axios';
import TMdbApi from '@/services/TMdbApi';
//import  Film  from "@/components/Film.vue";
import { defineAsyncComponent } from 'vue'

export default{
  components: {
    Film: defineAsyncComponent(() => import('@/components/Film.vue')),
    FilmReviews
},
  data(){
    return{
    fetchParam:'movie/',      
    films: [],
    filmId: Number
    }
  },
  methods:{
    async getfilm(filmID){
      this.fetchParam = this.fetchParam + filmID;
      
      const f = await TMdbApi().get(this.fetchParam);
      console.log(f);
      this.films[0]=f.data
    }
  },
  created() {
  const ID = Number(this.$route.params.id);
  this.filmId = ID;

},
beforeMount(){
  
},
mounted(){
  this.getfilm(this.filmId);
}
}
</script>

<template>
  <main>
    <div class="wrapper">
      <div v-for="item in films"> <Film  :filmObj=item /><FilmReviews/></div>
      
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