<template>
  <div class="personal-area">
    <h1>Area Personale</h1>
    <div class="inside-personal-area">

      <label for="Username">Username: {{ this.$store.state.user.username }}</label>
      <button type="button" @click="update(1)">Aggiorna Username</button>
      <div v-if="selezioneNuovoUsername">
      <input v-model="newUsername" placeholder="Inserisci Nuovo Username" >
      <button type="button" @click="confermaModifica(newUsername, 1)">Conferma nuovo Username</button>
      </div>

      <div></div>

      <label for="Email">Email: {{ this.$store.state.user.email }}</label>
      <button type="button" @click="update(2)">Aggiorna Email</button>
      <div v-if="selezioneNuovaEmail">
      <input v-model="newEmail" placeholder="Inserisci Nuova Email" type="email" >
      <button type="button" @click="confermaModifica(newEmail, 2)">Conferma nuova Email</button>
      </div>

      <div></div>

      <label for="Password">Password: {{this.$store.state.user.password}}</label>
      <button type="button" @click="update(3)">Aggiorna Password</button>
      <div v-if="selezioneNuovaPassword">
      <input v-model="newPassword" placeholder="Inserisci Nuova Password" type="password" >
      <button type="button" @click="confermaModifica(newPassword, 3)">Conferma nuova Password</button>
      </div>

      <label for="Name">Nome: {{ this.$store.state.user.name }}</label>
      <button type="button" @click="update(0)">Aggiorna Nome</button>
      <div v-if="selezioneNuovoNome">
      <input v-model="newName" placeholder="Inserisci Nuovo Nome" >
      <button type="button" @click="confermaModifica(newName, 0)">Conferma nuovo Nome</button>
      </div>

      <div></div>

      <div v-if="this.$store.state.user.birthdate">
      <label for="Birthday">Compleanno: {{ this.$store.state.user.birthday }}</label>
      </div>
      <div v-if="!this.$store.state.user.birthdate">
      <label for="Birthday">Non hai inserito il tuo Compleanno</label>
      <button type="button" @click="update(4)">Aggiorna Data</button>
      <div v-if="selezioneNuovoCompleanno">
      <input v-model="newBirthday" placeholder="Inserisci Nuova Data" type="date" >
      <button type="button" @click="confermaModifica(newBirthday, 4)">Conferma Data</button>
      </div></div>

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
    selezioneNuovoNome:false,
    selezioneNuovoUsername:false,
    selezioneNuovaEmail: false,
    selezioneNuovaPassword: false,
    selezioneNuovoCompleanno: false,
    newName:'',
    newSurname:'',
    newUsername:'',
    newEmail:'',
    newPassword:'',
    newBirthday: null
    }
  },
  methods:{
    logout(){
            this.user = {};
            this.jwt = "";
            this.$store.commit('logout');
            this.$router.push("/")
        },
    cancelNewsletter(){

    },
    subscribeNewsletter(){

    },
    update(index){
      switch (index) {
        case 0: //caso nome
        console.log('NOME');
          if(this.selezioneNuovoNome){
          this.selezioneNuovoNome=false;
          }
          else{
            this.selezioneNuovoNome=true;
          }
          break;
        case 1: //caso username
        console.log('USERNAME');
        if(this.selezioneNuovoUsername){
        this.selezioneNuovoUsername=false;
         }
         else{
            this.selezioneNuovoUsername=true;
         }
          break;
        case 2: //caso email
        console.log('EMAIL');
        if(this.selezioneNuovaEmail){
          this.selezioneNuovaEmail=false;
        }
        else{
          this.selezioneNuovaEmail=true;
        }
          break;
        case 3: //caso password
        console.log('PASSWORD');
        if(this.selezioneNuovaPassword){
          this.selezioneNuovaPassword=false;
        }
        else{
          this.selezioneNuovaPassword=true;
        }
          break;
        case 4: //caso birthday
        console.log('COMPLEANNO');
        if(this.selezioneNuovoCompleanno){
          this.selezioneNuovoCompleanno=false;
        }
        else{
          this.selezioneNuovoCompleanno=true;
        }
          break;      
        default:
          console.log('Ciao');
          break;
      }
    },
    async confermaModifica(nuovoUpdate, index){
      try {
        AuthenticationService.updatePersonalData({'nuovoUpdate': nuovoUpdate, 'index': index, 'id':this.$store.state.user.id})
      } catch (error) {
        console.error('Errore con confermaNome: ', error);
      }
      switch (index) {
        case 0:
          this.selezioneNuovoNome=false;
          break;
        case 1:
          this.selezioneNuovoUsername=false;
          break;
        case 2:
          this.selezioneNuovaEmail=false;
          break;
        case 3:
          this.selezioneNuovaPassword=false;
          break;
        case 4:
          this.selezioneNuovoCompleanno=false;
          break;
        default:
          console.log('Ciao');
          break;
      }

    },
   }
}

</script>