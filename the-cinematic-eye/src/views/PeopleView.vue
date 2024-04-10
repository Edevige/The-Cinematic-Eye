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
        imgUrl: "https://image.tmdb.org/t/p/original"
      };
    },
    methods: {
      selezionaEritorna(persona) {
        this.$router.push( {name:'advancedSearch', query:persona});
      },
      async fetchPeople(){
      try {
        const response= await TMdbApi().get('person/popular');
        const peopleResponse=response.data.results.map(async persona => {
                return {
                    id: persona.id,
                    name: persona.name,
                    role: persona.known_for_department,
                    image: persona.profile_path
                };
        });
        let people=await Promise.all(peopleResponse);
        people.sort((a,b)=>a.name.localeCompare(b.name));
        this.personeTotali=people;
      } catch (error) {
        console.error('Errore con fetchPeople: ',error);
      }
    },
    },
    created() {
      this.fetchPeople();
    }
  };
  </script>

<style lang="scss" scoped></style>