<script>
import FilmReviews from '@/components/FilmReviews.vue';
import TMdbApi from '@/services/TMdbApi';
//import  Film  from "@/components/Film.vue";
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    Film: defineAsyncComponent(() => import('@/components/Film.vue')),
    FilmReviews
  },
  data() {
    return {
      fetchParam: 'movie/',
      films: [],
      filmId: Number
    }
  },
  methods: {
    async getfilm(filmID) {
      this.fetchParam = this.fetchParam + filmID;

      const f = await TMdbApi().get(this.fetchParam);
      //console.log(f);
      this.films[0] = f.data
    }
  },
  created() {
    const ID = Number(this.$route.params.id);
    this.filmId = ID;

  },
  beforeMount() {

  },
  mounted() {
    this.getfilm(this.filmId);
  }
}
</script>

<template>
  <main>
    <div v-if="films.length > 0" class="wrapper">
      <div  v-for="item in films">
        <Film :filmObj=item />
        <FilmReviews :filmID="filmId" />
      </div></div>
      <div v-else class="container">
        <div class="position-relative ">
          <div class=" row w-100 mx-auto">
            <div>
              <div class="mt-4 spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    

  </main>
</template>

<style scoped>
@media (min-width: 1024px) {

  main {
    display: flex;
    place-items: center;
  }

  main .wrapper {
    display: flex;
    place-items: center;
    flex-wrap: wrap;
  }
  .spinner-border{
    color: whitesmoke;
    --bs-spinner-width: 5rem;
    --bs-spinner-height: 5rem;
    --bs-spinner-border-width: 1em;
  }
}</style>