<script>
import axios from 'axios';
import  Film  from "@/components/Film.vue";
import { defineAsyncComponent } from 'vue'

export default{
  components: {
    Film:
    defineAsyncComponent(() =>import('@/components/Film.vue')),
    },
  data(){
    return{
    fetchParam:{
                    method: 'GET',
                    url: 'https://api.themoviedb.org/3/movie/',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOWVmNjBkZmQ4NjJmOGIxMzI0ZGY0OTQyZDMxNDA3MiIsInN1YiI6IjY1MjY5MDYyZmQ2MzAwNWQ3YTJjYWI5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NSW-bH3GyddzVOjp2igXra96BL6YYuS_6htBga53SRA'
      }
    },         
    films: [],
    filmId: Number
    }
  },
  methods:{
    async getfilm(filmID){
      this.fetchParam.url = this.fetchParam.url + filmID;
      const f = await axios
        .request(this.fetchParam);
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
      <div v-for="item in films"> <Film  :filmObj=item /></div>
     
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