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
    </div>
  </template>
  
  <script>
  import TMdbApi from '@/services/TMdbApi';
  export default {
    data() {
      return {
        personeTotali: [],
        nuovePersone:[],
        imgUrl: "https://image.tmdb.org/t/p/original",
        totalPages: null,
        loadingAll: false,
        currentPage:1,
        loadingNumberPages:false
      };
    },
    methods: {
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
          while (this.currentPage <= this.totalPages) {
          const response = await TMdbApi().get('person/popular', {
            params: { page: this.currentPage }
          });
          const people = response.data.results.map(persona => ({
            id: persona.id,
            name: persona.name,
            role: persona.known_for_department,
            image: persona.profile_path
          }));
          this.personeTotali.sort((a, b) => a.name.localeCompare(b.name));
          this.personeTotali.push(...people);
          this.currentPage++;
        }
      } catch (error) {
        console.error('Errore con fetchPeople: ',error);
      } finally{

        this.loadingAll=false;
      }
    },
    },
    async created() {
      await this.fetchTotalPages();
    },
  };
  </script>

<style lang="scss" scoped></style>