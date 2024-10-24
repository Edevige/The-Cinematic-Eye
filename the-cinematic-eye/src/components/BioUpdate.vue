<template>
    <div>
        <form>
            <div style="width: 40em;" class="form-group">
                <label for="Bio">Inserisci Bio</label>
                    <textarea v-model="newBio" class="form-control" id="Bio" rows="3"></textarea>
                </div>
                <button type="button" class=" align-self-center mb-2" @click="confermaModifica(newBio, 5, '')">Carica Bio</button>
        </form>
    </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
export default {
    
    setup () {
        

        return {} 
    },
    data(){
        return{
          newBio: "",  
        }
        
    },

    methods:{
        async confermaModifica(nuovoUpdate, index, passwordCorrente) {
      try {
        let data = {
          nuovoUpdate: nuovoUpdate,
          index: index
        };
        if (passwordCorrente !== '') {
          data.passwordCorrente = passwordCorrente;
        }
        const response = await AuthenticationService.updatePersonalData(data, {
          headers: { Authorization: `Bearer ${this.$store.state.token}` }
        });

        if (response.data.status) {
          this.$store.dispatch('setToken', response.data.token);
          this.$store.dispatch('setUser', response.data.user);
          switch (index) {
            case 0:
              alert('Nome aggiornato con successo!');
              this.user.name = nuovoUpdate;
              this.selezioneNuovoNome = false;
              this.newName = '';
              break;
            case 1:
              alert('Username aggiornato con successo!');
              this.user.username = nuovoUpdate;
              this.selezioneNuovoUsername = false;
              this.newUsername = '';
              break;
            case 2:
              alert('Email aggiornata con successo!');
              this.user.email = nuovoUpdate;
              this.selezioneNuovaEmail = false;
              this.newEmail = '';
              break;
            case 3:
              alert('Password aggiornata con successo!');
              this.user.password = nuovoUpdate;
              this.selezioneNuovaPassword = false;
              this.newPassword = '';
              break;
            case 4:
              alert('Compleanno aggiornato con successo!');
              this.user.birthdate = nuovoUpdate;
              this.selezioneNuovoCompleanno = false;
              this.newBirthday = null;
              break;
            case 5:
              alert('Bio aggiornata con successo!');
              this.user.bio= nuovoUpdate;
              this.selezioneNuovaBio=false;
              this.newBio='';
              break;
            default:
              console.log('Ciao');
              break;
          }
        }
      } catch (error) {
        console.error('Errore con aggiornamentoDati: ', error);
      }
    },
    }
}
</script>

<style lang="scss" scoped>

</style>