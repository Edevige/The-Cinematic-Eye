<template>
  <div class="personal-area">
    <h1>Area Personale</h1>
    <div class="inside-personal-area">

      <label for="Username">Username: {{ this.$store.state.user.username }}</label>
      <button type="button" @click="updateUsername()">Aggiorna Username</button>

      <div></div>

      <label for="Email">Email: {{ this.$store.state.user.email }}</label>
      <button type="button" @click="updateEmail()">Aggiorna Email</button>

      <div></div>

      <div v-if="this.$store.state.user.google_id">
      <label for="Password">Password: Accesso Tramite Google</label>
      </div>
      <div v-if="!this.$store.state.user.google_id">
      <label for="Password">Password: Accesso NON Tramite Google</label>
      </div>

      <label for="Name">Nome: {{ this.$store.state.user.name }}</label>
      <button type="button" @click="updateNome()">Aggiorna Nome</button>
      <div v-if="nome">
      <input v-model="newName" placeholder="Inserisci Nuovo Nome" >
      <button type="button" @click="confermaNome(newName)">Conferma nuovo Nome</button>
      </div>

      <div></div>

      <div v-if="this.$store.state.user.birthdate">
      <label for="Birthday">Compleanno: {{ this.$store.state.user.birthday }}</label>
      </div>
      <div v-if="!this.$store.state.user.birthdate">
      <label for="Birthday">Non hai inserito il tuo Compleanno</label>
      </div>
      <button type="button" @click="updateBirthday()">Aggiorna Data</button>

      <div></div>

      <div v-if="this.$store.state.user.subscribed">
      <label for="Newsletter">Sei iscritto alla newsletter</label>
      <button type="button" @click="cancelNewsletter()">Cancella l'iscrizione</button>
      </div>
      <div v-if="!this.$store.state.user.subscribed">
      <label for="Newsletter">Non sei iscritto alla newsletter</label>
      <button type="button" @click="subscribeNewsletter()">Iscriviti</button>
      </div>
  </div>
      <div></div>
      <button type="button" @click="logout()">Logout</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
export default {

  data(){
    return{
    nome:false,
    newName:'',
    newSurname:''
    }
  },
  methods:{
    logout(){
            this.user = {};
            this.jwt = "";
            this.$store.commit('logout');
            this.$router.push("/")
        },
    updateBirthday(){

    },
    cancelNewsletter(){

    },
    subscribeNewsletter(){

    },
    updateNome(){
      if(this.nome){
        console.log(this.nome);
        this.nome=false;
      }
      else{
        console.log(this.nome);
        this.nome=true;
      }
    },
    async confermaNome(newName){
      try {
        console.log('Nuovo Nome selezionato: ', newName);
        AuthenticationService.updatePersonalData({'newName': newName, 'index': 0, 'oldName': this.$store.state.user.name, 'token':this.$store.state.token});
      } catch (error) {
        console.error('Errore con confermaNome: ', error);
      }
      this.nome=false;
    },
   }
}

</script>