<template>
    <nav class="navbar">
        <div class="container-fluid">
            <!--logo e nome del sito-->
            <router-link class="navbar-brand" to="/">
                <img src="@/assets/logo.png" alt="Logo" height="24" class="d-inline-block align-text-top invertColor">
                The Cinematic Eye
            </router-link>
            <!--pulsanti lato destro-->
            <div class="d-flex">
                <!--ricerca-->
                <div class="d-flex">
                    <div  class="d-flex dropdown" @click="srcDrop()" @click.self="closeSrc">
                        <input v-if="!(search || $route.meta.nav)" class="form-control me-2" @Focus="srcDrop()"  @keyup.enter="searchCall(searchPar)" v-model="searchPar" type="search" placeholder="Search" aria-label="Search">
                        <ul id="search" v-if="!(search || $route.meta.nav)" style="display: block; top: 70px; width: 250px;" class="dropdown-menu dropdown-menu-end">
                            <li><router-link class="dropdown-item" to="/advancedSearch">Ricerca avanzata</router-link> </li>
                        </ul>
                    </div>
                    <button class="btn btn-outline-success" @click="searchForm(searchPar)" ><i class="bi bi-search"></i></button>

                </div>

                <!--menu a tenddina-->
                <div class="dropdown">
                    <button class="btn btn-outline-success" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <i class="bi bi-list" ></i>
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end" >
                        <li><router-link class="dropdown-item" to="/">Home</router-link></li>

                        <!-- Sottomenu per "Categorie" -->
                        <li class="dropdown-submenu" @click.stop="toggleSubmenu">
                            <a class="dropdown-item" href="#">Categorie<span class="arrow">&#8250;</span> <!-- Freccia verso il basso --></a>                        
                            <ul class="dropdown-menu1" v-show="isSubmenuVisible">
                                <li><router-link class="dropdown-item" to="/genre/28" >Action</router-link></li>
                                <li><router-link class="dropdown-item" to="/genre/16" >Animation</router-link></li>
                                <li><router-link class="dropdown-item" to="/genre/10749" >Romance</router-link></li>
                                <li><router-link class="dropdown-item" to="/genre/27" >Horror</router-link></li>
                                <li><router-link class="dropdown-item" to="/genre/35" >Comedy</router-link></li>
                                <li><router-link class="dropdown-item" to="/genre/18" >Drama</router-link></li>
                            </ul>
                        </li>

                        <li><RouterLink class="dropdown-item" to="/mostViewed">I più visti</RouterLink></li>
                        <li><RouterLink class="dropdown-item" to="/Loved">I più amati</RouterLink></li>
                        <li><RouterLink class="dropdown-item" to="/topList">Liste più seguite</RouterLink></li>
                        <li><RouterLink class="dropdown-item" to="/discoverFilm">Trova Film</RouterLink></li>
                        <li><RouterLink class="dropdown-item" to="/topUsers">Top User</RouterLink></li>
                    </ul>
                </div>

                <!--menu log in/out, sign in-->
                <div class="dropdown" data-bs-auto-close="outside">
                    <button class="btn btn-outline-success" type="button" data-bs-toggle="dropdown" aria-expanded="false" ref="loginDropdown">
                        <i class="bi bi-person-fill"></i>
                    </button>
                    <!--menu loggato-->
                    <ul  class="dropdown-menu dropdown-menu-end" style="padding: 0.5rem;">
                        <div v-if="logged">
                            <li>
                                <router-link to="/personalArea" class="d-flex flex-row align-items-center usr-menu">
                                    <div class="">
                                        <div v-if="this.$store.state.user.profileImage" class="profileImage">
                                            <img :src="'/profileImg/'+this.$store.state.user.profileImage"/>
                                        </div>
                                        <i v-else class="bi bi-person-fill"></i>
                                    </div>
                                    <div class="flex-grow-1 p-2 d-flex flex-column">
                                        <div class="text-center">{{this.$store.state.user.username}}</div>
                                        <div class="flex-grow-1 p-2 justify-content-evenly d-flex flex-row">
                                            <div>{{this.$store.state.user.name}}</div> 
                                        </div> 
                                    </div>
                                </router-link>
                            </li>
                            
                            <li><router-link class="dropdown-item" :to="{ name: 'preferiti', params: { id: this.$store.state.user.id }}">Preferiti</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'letueliste', params: { id: this.$store.state.user.id }}">Le Tue Liste</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'letuerecensioni', params: { id: this.$store.state.user.id }}">Le Tue Recensioni</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'filmgiavisti', params: { id: this.$store.state.user.id }}">Film Già Visti</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'userforum', params: { id: this.$store.state.user.id }}">Forum Utenti</router-link></li>
                            <li><router-link class="dropdown-item" :to="{ name: 'polls', params: { id: this.$store.state.user.id }}">Sondaggi</router-link></li>

                            <div v-if="isAdmin">
                                <li><router-link class="dropdown-item" :to="{ name: 'admin', params: { id: this.$store.state.user.id }}">Pagina Admin</router-link></li>
                            </div>

                            <li><button type="button" @click="logout" class="btn btn-outline-light me-auto" style="width: 170px;">Logout</button></li>
                        </div>
                        <!--menu non loggato-->
                        <div v-if="!logged">
                            <form style="display: block; top: 70px; width: 250px; padding: 0.5rem;">

                                

                                
                                <div class="bt-3 mb-3 me-2 ms-2">
                                    <input type="email"  v-model="logMail" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Email">
                                </div>
                                <div class="mb-3 me-2 ms-2">
                                    <input type="password" v-model="logPass" class="form-control" id="InputPassword" placeholder="Password">
                                </div>
                                <div v-if="error" class="alert alert-danger">{{ error }}</div>

                                <div class="d-flex justify-content-around">
   
                                    <div v-if="!logged" id="googleButton"></div>
                                    
                                    <button type="button" @click.prevent="login($event)" class="btn btn-outline-light ms-2">Login</button>
                                    
                                </div>
                                <div style="padding: 0.5rem;"></div>
                                <!-- Altre parti del template -->
                                <router-link to="/forgot-password">Password dimenticata?</router-link>

                                <hr/>
                                <p class="mb-1 text-center" style="font-size: smaller;">If you're not registered</p>
                                <div class="d-flex justify-content-around">
                                    <button type="button" @click="$router.push('/register')" class="btn flex-fill me-2 ms-2 mt-2 pt-1 pb-1 register-btn">Sign Up</button>
                                    <div></div>
                                </div>
                                 
                            </form>
                        </div>
                    </ul>
                    
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import apiUtils from '@/services/apiUtils';  // Assicurati che il percorso sia corretto
import AuthenticationService from '@/services/AuthenticationService';
import { RouterLink } from 'vue-router';
import { GoogleSignInButton } from 'vue3-google-signin';
import { mapState } from 'vuex';

export default {
    name: 'GoogleLoginComponent',

    computed: {
        ...mapState({
        userId: state => state.user.id // Recupera l'ID dell'utente dallo store
        })
    },
    mounted(){
        this.initializeGoogle();
        this.checkUserRole();
        // Aggiunge un event listener per chiudere il sottomenu se il menu generale viene chiuso (opzionale)
        document.addEventListener('hide.bs.dropdown', () => {
        this.isSubmenuVisible = false;
        });
        // Verifica lo stato di ban quando il componente è montato
        if (this.logged) {
            this.checkBanStatus();
        }
    },
    beforeDestroy() {
        // Rimuove l'event listener quando il componente viene distrutto
        document.removeEventListener('hide.bs.dropdown', () => {
        this.isSubmenuVisible = false;
        });
    },
    
    data() {
        return {
            isMenuVisible: false,
            isSubmenuVisible: false,  // Stato del sottomenu (di default chiuso)
            search: true,
            searchPar: '',
            logMail: '',
            logPass: '',
            error: null, 
            test: false,
            isAdmin: false,
            isPro: false,
            isBaseUser: false, 
        };
    },

    components:{
        GoogleSignInButton
    },
    setup () {
        

        return {}
    },
    
    methods:{
        // Funzione per verificare se l'utente loggato è un amministratore, pro o base
        async checkUserRole() {
            try {
                const token = this.$store.state.token;
                if (!token) {
                //console.error('Token non trovato.');
                return;
                }
                const response = await apiUtils.getUserRole({
                headers: { Authorization: `Bearer ${token}` }
                });
                if (response && response.data) {
                this.isAdmin = response.data.role === 1;
                this.isPro = response.data.role === 2;
                this.isBaseUser = response.data.role === 0;
                }
            } catch (error) {
                console.error('Errore nel recuperare il ruolo dell\'utente loggato:', error);
            }
        },
        // Metodo per aprire/chiudere il sottomenu
        toggleSubmenu(event) {
            this.isSubmenuVisible = !this.isSubmenuVisible;
        },

        // Metodo per chiudere il sottomenu quando il menu generale si chiude o clicchi fuori
        closeSubmenu(event) {
        if (!this.$el.contains(event.target)) {
            this.isSubmenuVisible = false; // Chiude il sottomenu se clicchi fuori
        }
        },

        // Metodo per chiudere sia il sottomenu che il menu principale
        srcDrop(){
            this.test = !this.test;
            //const srcDropMenu = document.getElementById("Search");
            //srcDropMenu.dropdown("toggle");
            
        },
        searchForm(par){
            if (par == '') {
                this.search = !this.search;
            } 
            else {
                this.searchCall(par);
            }
        } ,
        searchCall(par){
            this.$router.push('/s/'+ par);
        },

        initializeGoogle() {
            const parent = document.getElementById("googleButton");

            if (parent) {
            google.accounts.id.initialize({
                client_id: "599203859511-5f3c2e9dkgg7qjplu44f4qa1i57t1kf9.apps.googleusercontent.com",
                callback: this.loginWithGoogle
            });
            
            google.accounts.id.renderButton(
                parent,
                { type: 'icon', size: 'medium', shape: 'circle' }
            );
            } else {
            console.error("Elemento googleButton non trovato nel DOM.");
            }
        },
        async login(event) {
            event.stopPropagation();

            if (!this.logMail || !this.logPass) {
                this.error = 'Per favore, inserisci l\'email e la password.';
                return;
            }

            try {
                const fetchSuspension=await apiUtils.isUserSuspended(this.logMail);
                const response = await AuthenticationService.login({
                    email: this.logMail,
                    password: this.logPass
                });

                if (response && response.data) {
                    this.$store.dispatch('setToken', response.data.token);
                    this.$store.dispatch('setUser', response.data.user);
                    this.$store.commit('login');

                    this.logMail = '';
                    this.logPass = '';
                    this.error = null;
                    this.$router.go(0);
                    await this.checkUserRole();
                } else {
                    this.error = 'Errore di autenticazione. Riprova più tardi.';
                }
            } catch (error) {
                if (error.response && error.response.data.error === "Il tuo account è stato bannato.") {
                    this.error = "Il tuo account è stato bannato.";
                } else if (error.response && error.response.data.error) {
                    this.error = error.response.data.error;
                } else {
                    this.error = 'Errore di rete. Riprova più tardi.';
                }
            }
        },
        logout(){
            this.user = {};
            this.jwt = "";
            this.error = null;
            this.isAdmin = false;
            this.isPro = false;
            this.isBaseUser = false;
            this.$store.commit('logout');

            // Se l'utente è già sulla homepage, ricarica la pagina
            if (this.$route.path === '/') {
                // Forza il refresh della pagina
                this.$router.go(0); 
            } else {
                // Reindirizza alla homepage
                this.$router.push('/');
            };
            // Reinizializza il pulsante di Google Sign-In dopo il logout
            // Usa nextTick per aspettare che l'elemento sia nel DOM
            this.$nextTick(() => {
                this.initializeGoogle();
            });
        },

        //Login con Google
        async loginWithGoogle(CredentialResponse) { 
            const token_id = CredentialResponse.credential;
            try {
                const fetchSuspension= await apiUtils.isUserSuspendedGoogle({"token_id": token_id});
                const Gregister = await AuthenticationService.loginWithGoogleToken({ "token_id": token_id });
                if (Gregister && Gregister.data) {
                    this.$store.dispatch('setToken', Gregister.data.token);
                    this.$store.dispatch('setUser', Gregister.data.user);
                    this.$store.commit('login');

                    await this.checkUserRole();
                }
            } catch (error) {
                if (error.response && error.response.data.error === "Il tuo account è stato bannato.") {
                    this.error = "Il tuo account è stato bannato.";
                    alert(this.error);  // Mostra un messaggio di errore all'utente
                } else {
                    this.error = error.response ? error.response.data.error : "Errore di rete. Riprova più tardi.";
                }
            }
        },

        async checkBanStatus() {
            try {
                const response = await apiUtils.isUserBanned(this.$store.state.user.id);
                if (response.data.ban === 1) {
                    this.logout();  // Esegui il logout se l'utente è bannato
                    alert("Il tuo account è stato bannato.");
                }
            } catch (error) {
                console.error("Errore nel controllo del ban:", error);
            }
        },

        async checkSuspendedStatus() {
            try {
                const response = await apiUtils.isUserSuspended(this.$store.state.user.id);
                if (response.data.ban === 1) {
                    this.logout();  // Esegui il logout se l'utente è bannato
                    alert("Il tuo account è stato bannato.");
                }
            } catch (error) {
                console.error("Errore nel controllo del ban:", error);
            }
        },
        
        
    },
    computed:{
        logged(){return this.$store.state.logged} 
    }

}
</script>


<style lang="scss" scoped>
    $menu-color: rgb(26, 68, 67);
    .navbar{
        background-color: #{$menu-color} !important;
        position: relative;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
        border-radius: 0.5rem;
        a, i{
            color: whitesmoke;
        }
       
    }
    .bi-person-fill{
        font-size: xx-large;
        margin: 0 5px;
        
    }
    .bi-list{
        font-size: xx-large;
        margin: 0 5px;
        
    }
    .bi-google{
        font-size: x-large;
        color: black !important;
        &:hover{
            color: whitesmoke !important;
        }
    }
    .btn-usr{padding: 0;}
    .usr-menu{
        text-decoration: none;
        &:hover {
            background-color: #{$menu-color}; // Mantiene il colore di sfondo durante hover
            color: whitesmoke; // Mantiene il colore del testo bianco
            text-decoration: underline;
        }
    }
    .dropdown-menu{
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
        text-align: center;
        padding: 0;
        &:hover {
            background-color: #{$menu-color}; // Mantiene il colore di sfondo durante hover
            color: whitesmoke; // Mantiene il colore del testo bianco
        }
        
    }
    .dropdown-menu1{
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
        position: relative;
        text-align: justify;
        padding: 0;
        &:hover {
            background-color: #{$menu-color}; // Mantiene il colore di sfondo durante hover
            color: whitesmoke; // Mantiene il colore del testo bianco
        }
        
    }
    .dropdown-submenu {
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
        text-align: center;
        position: relative;
        &:hover {
            background-color: #{$menu-color}; // Mantiene il colore di sfondo durante hover
            color: whitesmoke; // Mantiene il colore del testo bianco
        }
        
    }
    .dropdown-item {
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
        position: relative;
        display: block;
        width: 100%;
        padding: 1rem 2rem;
        margin: 10;
        border: 1;
        
        &:hover {
            background-color: #{$menu-color}; // Mantiene il colore di sfondo durante hover
            color: whitesmoke; // Mantiene il colore del testo bianco
            text-decoration: underline;
        }

        &:focus, &:active {
            background-color: #{$menu-color} ; // Mantiene il colore di sfondo quando è selezionato o attivo
            color: whitesmoke ; // Mantiene il colore del testo bianco quando è selezionato o attivo
            outline: none; // Rimuove il contorno standard che alcuni browser mostrano sul focus
            box-shadow: none; // Rimuove eventuali effetti ombra di focus
            text-decoration: none;
        }
    }

    li {
        padding: 0;
        &:hover {
            background-color: #{$menu-color}; // Mantiene il colore di sfondo durante hover
            color: whitesmoke; // Mantiene il colore del testo bianco
        }
    }
    .arrow {
        margin-left: 8px; /* Distanza tra la scritta e la freccia */
        font-size: 25px; /* Dimensione della freccia */
        display: inline-block;
        text-align: center;
        rotate: 90deg;
        line-height: 1; /* Assicura che la freccia non cambi l'altezza della riga */
        transform: translateY(1px); /* Leggermente allineata verticalmente */
        transform: translateX(3px);
    }

    .btn-outline-success {
        border: none; 
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .register-btn{
        font-size: small;
        background-color: whitesmoke;
        font-weight: bolder;
    }
    .profileImage{
        width: 65px;
        height: 65px;
        overflow: hidden;
        img{
            object-fit: cover;
            width:100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    
</style>