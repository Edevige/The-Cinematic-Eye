<template>
    <div class="d-flex flex-column">
        <div  v-for="item in filmFound">
            <router-link class="d-flex flex-row" :to="'/film/'+item.id" style="appearance: none !important; text-decoration: none;">
            <div class="col-1">
                <img v-if="item.poster_path != null" class="img img-fluid w-auto mt-4" :src="imgUrl + item.poster_path" />
                <img v-if="item.poster_path == null" class="img img-fluid w-auto mt-4"
                    src="https://placehold.co/200x300?text=No\nposter " />

            </div>
            <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ item.original_title }}</div></div>
            </router-link>
        </div>
    </div>
</template>

<script>
export default{

    data(){
        return{
            filmFound: [],
            searchParams:{
                include_adult: '',
                primary_release_year: '',
                'vote_average.gte': '',
                with_genres: '',
                with_original_language: ''
            },
            imgUrl: "https://image.tmdb.org/t/p/original"
    };
    },

    methods: {
    async fetchMovies() {
      try {
        const response = await axios({
          method: 'GET',
          url: 'https://api.themoviedb.org/3/discover/movie',
          params: this.searchParams, // Utilizza i searchParams aggiornati per la chiamata API
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Sostituisci con il tuo vero token
          }
        });
        this.filmFound = response.data.results; // Supponendo che la risposta abbia un campo 'results'
      } catch (error) {
        console.error(error);
      }
    },

    // Chiamato quando l'utente invia i parametri di ricerca
    updateSearchParams(newParams) {
      this.searchParams = newParams;
      this.fetchMovies();
    },
  },
  mounted() {
    this.fetchMovies();
  },
  created(){
    const par = this.$route.params.sPar;
    this.searchParameter = par;
  }
}

</script>