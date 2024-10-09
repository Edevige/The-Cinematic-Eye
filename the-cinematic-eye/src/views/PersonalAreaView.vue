<template>
  <div class="personal-area">
    <h1>Area Personale</h1>
    <div class="inside-personal-area">

      <div v-if="user">
        <label for="Username">Username: {{ user.username }}</label>
        <button type="button" @click="update(1)">Aggiorna Username</button>
        <div v-if="selezioneNuovoUsername">
        <input v-model="newUsername" placeholder="Inserisci Nuovo Username" >
        <button type="button" @click="confermaModifica(newUsername, 1)">Conferma nuovo Username</button>
        </div>

        <div></div>

        <label for="Email">Email: {{ user.email }}</label>
        <button type="button" @click="update(2)">Aggiorna Email</button>
        <div v-if="selezioneNuovaEmail">
        <input v-model="newEmail" placeholder="Inserisci Nuova Email" type="email" >
        <button type="button" @click="confermaModifica(newEmail, 2)">Conferma nuova Email</button>
        </div>

        <div></div>

        <label for="Password">Password: {{user.password}}</label>
        <button type="button" @click="update(3)">Aggiorna Password</button>
        <div v-if="selezioneNuovaPassword">
        <input v-model="newPassword" placeholder="Inserisci Nuova Password" type="password" >
        <button type="button" @click="confermaModifica(newPassword, 3)">Conferma nuova Password</button>
        </div>

        <label for="Name">Nome: {{ user.name }}</label>
        <button type="button" @click="update(0)">Aggiorna Nome</button>
        <div v-if="selezioneNuovoNome">
        <input v-model="newName" placeholder="Inserisci Nuovo Nome" >
        <button type="button" @click="confermaModifica(newName, 0)">Conferma nuovo Nome</button>
        </div>

        <div></div>

        <div v-if="user.birthdate">
        <label for="Birthday">Compleanno: {{ formatDate(user.birthdate) }}</label>
        <button type="button" @click="update(4)">Aggiorna Data</button>
        </div>
        <div v-else="!user.birthdate">
        <label for="Birthday">Non hai inserito il tuo Compleanno</label>
        <button type="button" @click="update(4)">Aggiorna Data</button>
      </div>
        <div v-if="selezioneNuovoCompleanno">
        <input v-model="newBirthday" placeholder="Inserisci Nuova Data" type="date" >
        <button type="button" @click="confermaModifica(newBirthday, 4)">Conferma Data</button>
        </div>

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
    <div v-else>
      Caricamento Pagina o Errore
    </div>
        <div></div>
        <button type="button" @click="logout()">Logout</button>
    </div>

    <button type="button" @click="handleDeleteAccount()">
        Elimina Account
    </button>

    
</div>
      
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Utils from '@/services/apiUtils';
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
    newBirthday: null,
    user: null,
    id: this.$store.state.user.id
    }
  },
  methods:{
    async fetchUser() {
        try {
          // Chiamata API per ottenere le informazioni utente
          const response = await Utils.getUserById(this.id);  // Assicurati che questa funzione esista nel tuo servizio
          this.user = response.data;  // Salva le informazioni utente
          this.user=this.user[0];        
        } catch (error) {
          console.error('Errore nel recupero delle informazioni utente:', error);
          this.error = 'Impossibile caricare i dati dell\'utente';
        } finally {
          this.loading = false;  // Fine del caricamento
        }
      },
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
          if(this.selezioneNuovoNome){
          this.selezioneNuovoNome=false;
          }
          else{
            this.selezioneNuovoNome=true;
          }
          break;
        case 1: //caso username
        if(this.selezioneNuovoUsername){
        this.selezioneNuovoUsername=false;
         }
         else{
            this.selezioneNuovoUsername=true;
         }
          break;
        case 2: //caso email
        if(this.selezioneNuovaEmail){
          this.selezioneNuovaEmail=false;
        }
        else{
          this.selezioneNuovaEmail=true;
        }
          break;
        case 3: //caso password
        if(this.selezioneNuovaPassword){
          this.selezioneNuovaPassword=false;
        }
        else{
          this.selezioneNuovaPassword=true;
        }
          break;
        case 4: //caso birthday
        if(this.selezioneNuovoCompleanno){
          this.selezioneNuovoCompleanno=false;
        }
        else{
          this.selezioneNuovoCompleanno=true;
        }
          break;      
        default:
          break;
      }
    },
    async handleDeleteAccount(){
        // Richiesta al backend per eliminare l'account
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile!");
        if (confirmDelete) {
            try {
                console.log(this.id)
                const response = await AuthenticationService.deleteAccount({"userId":this.id});
                
                if (response.ok) {
                    alert('Il tuo account è stato eliminato con successo.');
                    navigate('/logout');  // Reindirizza alla pagina di logout o home
                } else {
                    alert('Si è verificato un problema nell’eliminazione dell’account.');
                }
            } catch (error) {
                console.error('Errore durante l’eliminazione dell’account:', error);
                alert('Errore di connessione. Riprova più tardi.');
            }
        }
    },
    async confermaModifica(nuovoUpdate, index){
      try {
        const response= await AuthenticationService.updatePersonalData({'nuovoUpdate': nuovoUpdate, 'index': index, 'id':this.id})
        
        if(response.status){
      switch (index) {
        case 0:
          this.user.name=nuovoUpdate
          this.selezioneNuovoNome=false;
          this.newName='';
          break;
        case 1:
          this.user.username=nuovoUpdate
          this.selezioneNuovoUsername=false;
          this.newUsername='';
          break;
        case 2:
          this.user.email=nuovoUpdate
          this.selezioneNuovaEmail=false;
          this.newEmail='';
          break;
        case 3:
          this.user.password=nuovoUpdate
          this.selezioneNuovaPassword=false;
          this.newPassword='';
          break;
        case 4:
          this.user.birthdate=nuovoUpdate;
          this.selezioneNuovoCompleanno=false;
          this.newBirthday=null;
          break;
        default:
          console.log('Ciao');
          break;
      }
    }
      } catch (error) {
        console.error('Errore con confermaNome: ', error);
      }
      

    },

    formatDate(date) {
        // Funzione per formattare la data in modo leggibile
        return new Date(date).toLocaleDateString();
      },

   },
   mounted(){
    this.fetchUser();
   }
}

</script>