<template>
    <div>
      <div v-for="persona in personeTotali" :key="persona.id">
        <div class="col-1">
                <img v-if="persona.image != null" class="img img-fluid w-auto mt-4" :src="imgUrl + persona.image" />
                <img v-if="persona.image == null" class="img img-fluid w-auto mt-4"
                    src="https://placehold.co/200x300?text=No\nposter " />

            </div>
            <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ persona.name }}</div></div>
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
        imgUrl: "https://image.tmdb.org/t/p/original"
      };
    },
    methods: {
      selezionaEritorna(persona) {
        this.$router.push({ name: 'RicercaAvanzata', params: { personaSelezionata: persona } });
      },
      async fetchPeople(){
      try {
        const response= await TMdbApi().get('person/popular');
        const peopleData=response.data.results.map(async persona => {
            try {
                const imagesResponse= await TMdbApi().get(`person/${persona.id}/images`);
                const immagine=imagesResponse.data.profiles[0].file_path;
                return {
                    id: persona.id,
                    name: persona.name,
                    image: immagine
                };
            } catch (error) {
                
            }
          
        });
        this.personeTotali=await Promise.all(peopleData);
        console.log('Personeee:', this.personeTotali);
      } catch (error) {
        console.log('Errore con fetchPeople:', error);
      }
    },
    },
    created() {
      // Carica le persone quando entri nella pagina
      this.fetchPeople();
    }
  };
  </script>

<style lang="scss" scoped></style>