<template>
    <div>
      <div v-for="persona in personeTotali" :key="persona.id">
        <div class="col-1">
                <img v-if="persona.image != null" class="img img-fluid w-auto mt-4" :src="imgUrl + persona.image" />
                <img v-if="persona.image == null" class="img img-fluid w-auto mt-4"
                    src="https://placehold.co/200x300?text=No\nposter " />

            </div>
            <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ persona.name + ' Ruolo: ' + persona.role }}</div></div>
        <button @click="selezionaEritorna(persona)">Seleziona</button>
      </div>
      <nav aria-label="Page navigation example" class="mt-4">
    <ul class="pagination justify-content-center">
      <!-- Previous Page Link -->
      <li class="page-item" :class="{disabled: currentPage === 1}">
        <a class="page-link" href="#" @click="cambiaPagina(currentPage - 1)" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      
      <!-- First Page Link -->
      <li class="page-item" :class="{active: 1 === currentPage}" v-if="currentPage > 3">
        <a class="page-link" href="#" @click="vaiAPagina(1)">1</a>
      </li>
      <!-- Indicator for previous pages -->
      <li class="page-item" v-if="currentPage > 4">
        <a class="page-link" href="#">...</a>
      </li>

      <!-- Numbers Around Current Page -->
      <li class="page-item" :class="{active: n === currentPage}" v-for="n in paginationRange(currentPage, totalPages)" :key="n">
        <a class="page-link" href="#" @click="vaiAPagina(n)">{{ n }}</a>
      </li>

      <!-- Indicator for next pages -->
      <li class="page-item" v-if="currentPage < totalPages - 3">
        <a class="page-link" href="#">...</a>
      </li>
      <!-- Last Page Link -->
      <li class="page-item" :class="{active: totalPages === currentPage}" v-if="currentPage < totalPages - 2">
        <a class="page-link" href="#" @click="vaiAPagina(totalPages)">{{ totalPages }}</a>
      </li>

      <!-- Next Page Link -->
      <li class="page-item" :class="{disabled: currentPage === totalPages}">
        <a class="page-link" href="#" @click="cambiaPagina(currentPage + 1)" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
    </div>
  </template>
  
  <script>
  import TMdbApi from '@/services/TMdbApi';
  export default {
    data() {
      return {
        personeTotali: [],
        personeScelte: [],
        imgUrl: "https://image.tmdb.org/t/p/original",
        totalPages: null,
        loadingAll: false,
        currentPage: 1,
      };
    },
    methods: {
      vaiAPagina(n){
        this.$router.push(''+n);
      },
      cambiaPagina(n){
        this.$router.push(''+n);
      },
      paginationRange(current, total){
      const sidePages = 2; // Numero di pagine da mostrare intorno alla pagina corrente
      const range = [];

      for (let i = Math.max(2, current - sidePages); i <= Math.min(total - 1, current + sidePages); i++) {
        range.push(i);
      }

      return range;
      },
      selezionaEritorna(persona) {
        this.$router.push( {name:'advancedSearch', query:persona});
      },
      async fetchTotalPages(){
        try {
          const response = await TMdbApi().get('person/popular');
          this.totalPages = response.data.total_pages;
          this.fetchPeople();
        } catch (error) {
          console.error('Errore durante il recupero del numero totale di pagine:', error);
        }
      },
      async fetchPeople(){
        if(this.loadingAll) return;
        this.loadingAll=true;
        try {
          const response = await TMdbApi().get('person/popular', {
            params: { page: this.currentPage }
          });
          const people = response.data.results.map(persona => ({
            id: persona.id,
            name: persona.name,
            role: persona.known_for_department,
            image: persona.profile_path
          }));
          
          this.personeTotali=[...this.personeTotali,...people];
          this.personeTotali.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error('Errore con fetchPeople: ',error);
      } finally{
        this.loadingAll=false;
      }
    },
    },
    created() {
      this.currentPage=parseInt(this.$route.params.page,10)||1;
      this.fetchTotalPages();
    },
    watch: {
      '$route.params.page': function(newPage){
        this.currentPage=parseInt(newPage,10) || 1;
        this.fetchPeople();
      }
    }
  };
  </script>

<style lang="scss" scoped></style>