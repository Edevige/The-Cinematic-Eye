<script>
import FilmCarouselList from '@/components/FilmCarouselList.vue';
import FilmCarousel from '@/components/FilmCarousel.vue';
import Utils from '@/services/apiUtils';
import apiUtils from '@/services/apiUtils';
export default {
    setup () {


        return {}
    },
    components:{
        FilmCarousel,
        FilmCarouselList,
    },
    data() {
      return {
        isLoggedIn: this.$store.state.logged,
        user: {},
        filmPreferiti: [],
        listaSeguita:[],
      };
    },
    methods: {
      async fetchUser() {
        try {
          const response = await Utils.getUserByUsername(this.$store.state.user.username);
          this.user = response.data;
          this.filmPreferiti=response.data.favorites;

          // Recupera i film per ogni lista seguita
          if (this.user.followingList && this.user.followingList.length > 0) {
          this.listaSeguita = await Promise.all(
            this.user.followingList.map(async (listId) => {
              const listData = await this.getList(listId); // Carica i film per ogni lista seguita
              return { listId, title:listData.title, films:listData.films, owner: listData.owner };  // Ritorna l'ID della lista e i film
            })
          );
          }
        } catch (error) {
          console.error('Errore nel recupero delle informazioni utente:', error);
          this.error = 'Impossibile caricare i dati dell\'utente';
        } finally {
          this.loading = false;
        }
      },
      async getList(listaId) {
        try {
          const response = await apiUtils.getListWithOwner(listaId);
          console.log('Lista caricata per l\'ID:', listaId, response.data.film);
          return {
            title:response.data.list.title,
            films:response.data.list.film,
            owner:response.data.owner
          };
        } catch (error) {
          console.error('Errore nel caricare la lista', error);
          return [];  // Assicurati di ritornare un array vuoto in caso di errore
        }
      },
    },
    
    mounted() {
      if(this.isLoggedIn){this.fetchUser();};
  },
}
</script>

<template>
  <main>
    <div class="wrapper">
      <FilmCarousel :prop-url="'movie/popular'" title="Popolari"/>
      <FilmCarousel :prop-url="'movie/top_rated'" title="I Migliori"/>
      <div v-if="isLoggedIn">
        <!-- Film Favoriti -->
        <label for="Favorites" style="color: whitesmoke; font-size: xx-large;">Film Preferiti</label>
        <div v-if="user.favorites && user.favorites.length > 0">
          <FilmCarouselList :filmIds="filmPreferiti" />
        </div>
        <p v-else style="color: whitesmoke; font-size: x-large;">Non hai ancora aggiunto film favoriti.</p>

        <!-- Liste Seguite -->
        <label for="Following" style="color: whitesmoke; font-size: xx-large;">Liste Seguite</label>
        <ul v-if="listaSeguita && listaSeguita.length > 0">
          <li v-for="list in listaSeguita" :key="list.listId">
            <h3>{{ list.title }} di {{ list.owner }}</h3>
            <FilmCarouselList :filmIds="list.films" />
          </li>
        </ul>
        <p v-else style="color: whitesmoke; font-size: x-large;">Non stai seguendo ancora nessuna lista.</p>
      </div>
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
    color: whitesmoke;
  }
}
</style>
