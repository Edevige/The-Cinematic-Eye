<template>
    <nav class="navbar">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <img src="@/assets/logo.png" alt="Logo" height="24" class="d-inline-block align-text-top invertColor">
                The Cinematic Eye
            </router-link>
            
            <div class="d-flex">
                <div class="d-flex">
                    <input v-if="!(search || $route.meta.nav)" class="form-control me-2" @keyup.enter="searchCall(searchPar)" v-model="searchPar" type="search" placeholder="Search" aria-label="Search">
                    <button v-if="!$route.meta.nav" class="btn btn-outline-success" @click="searchForm(searchPar)"><i class="bi bi-search"></i></button>
                </div>
                
                <div class="dropdown">
                    <button class="btn btn-usr" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-list"></i>
                    </button>
                    <ul  class="dropdown-menu dropdown-menu-end">
                        <li><router-link class="dropdown-item" to="/">Home</router-link> </li>
                        <li class="dropdown-submenu" @click="sottomenu($event)">
                            <a class="dropdown-item" href="#">Categorie</a>
                            <ul class="dropdown-menu1" v-show=isSubmenuVisible>
                                <li><router-link class="dropdown-item" to="/genre/28">Action</router-link> </li>
                                <li><router-link class="dropdown-item" to="/genre/16">Animation</router-link> </li>
                                <li><router-link class="dropdown-item" to="/genre/10749">Romance</router-link> </li>
                                <li><router-link class="dropdown-item" to="/genre/27">Horror</router-link> </li>
                                <li><router-link class="dropdown-item" to="/genre/35">Comedy</router-link> </li>
                                <li><router-link class="dropdown-item" to="/genre/18">Drama</router-link> </li>
                            </ul>
                        </li>
                        <li><a class="dropdown-item" href="#">I più visti</a></li>
                        <li><a class="dropdown-item" href="#">I più amati</a></li>
                        <li><a class="dropdown-item" href="#">Liste più seguite</a></li>
                        <li><a class="dropdown-item" href="#">Top User</a></li>
                    </ul>
                </div>
                <div class="dropdown">
                    <button class="btn btn-usr" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-fill"></i>
                    </button>
                    <ul  class="dropdown-menu dropdown-menu-end">
                        <div v-if="logged">
                            <li>
                                <div class="d-flex flex-row align-items-center usr-menu">
                                    <div class=""> <i class="bi bi-person-fill"></i></div>
                                    <div class="flex-grow-1 p-2 d-flex flex-column">
                                        <div class="flex-grow-1 p-2 justify-content-evenly d-flex flex-row">
                                            <div>123</div> 
                                            <div>777</div>
                                        </div> 
                                        <div class="text-center">{{this.$store.state.user.username}}</div>
                                    </div>
                                </div>
                            </li>
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                            <li><button type="button" @click="logout" class="btn btn-outline-light ms-5 me-auto">LogOut</button></li>
                        </div>
                        <div v-if="!logged">
                            <form>
                                
                                <div class="bt-3 mb-3 me-2 ms-2">
                                    <input type="email"  v-model="logMail" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Email/Username">
                                </div>
                                <div class="mb-3 me-2 ms-2">
                                    <input type="password" v-model="logPass" class="form-control" id="InputPassword" placeholder="Password">
                                </div>
                                
                                <div class="d-flex justify-content-around">
   
                                        <div id="googleButton"></div>
                                    
                                    <button type="button" @click="login" class="btn btn-outline-light ms-2">Login</button>
                                    
                                </div>
                                <hr/>
                                <p class="mb-1 text-center" style="font-size: smaller;">If you're not registered</p>
                                <div class="d-flex justify-content-around">
                                    <button type="button" @click="$router.push('/register')" class="btn flex-fill me-2 ms-2 mt-2 pt-1 pb-1 register-btn">Sign Up</button>
                                    <div></div>
                                    <button type="button" @click="$router.push('/register')" class="btn flex-fill me-2 ms-2 mt-2 pt-1 pb-1 register-btn">FB</button>
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
import AuthenticationService from '@/services/AuthenticationService';
import { GoogleSignInButton } from 'vue3-google-signin';

export default {
    name: 'GoogleLoginComponent',
    mounted(){
        this.initializeGoogle();
        document.addEventListener('click', (e)=>{
            if(!this.$el.contains(e.target) && !e.target.closest('.dropdown-submenu')){
                this.isSubmenuVisible =false;
            }
        });
    },
    components:{
        GoogleSignInButton
    },
    setup () {
        

        return {}
    },
    data(){
        return{
            search: false,
            searchPar: '',
            logMail: '',
            logPass: '',
            error: null, 
            isSubmenuVisible: false,    
        }
    },
    methods:{
        sottomenu(event){
            event.preventDefault();
            event.stopPropagation();
            this.isSubmenuVisible=!this.isSubmenuVisible;
            console.log("Stato isSubmenuVisible: ",this.isSubmenuVisible);
        },
        initializeGoogle(){
            google.accounts.id.initialize({
            client_id: "599203859511-5f3c2e9dkgg7qjplu44f4qa1i57t1kf9.apps.googleusercontent.com",
            callback: this.loginWithGoogle
        });
            
            const parent= document.getElementById("googleButton");
            google.accounts.id.renderButton(
                parent,
                {type: 'icon', size: 'medium', shape: 'circle'}
        );
    
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
        async login() {
            try {
                const response = await AuthenticationService.login({
                    email: this.logMail,
                    password: this.logPass
                });
                this.$store.dispatch('setToken',response.data.token)
                this.$store.dispatch('setUser',response.data.user)
                this.$store.commit('login')

                this.logMail = '';
                this.logPass = '';
                
            } catch (error) {
                this.error = error.response.data.error
            }
        },
        logout(){
            this.user = {};
            this.jwt = "";
            this.$store.commit('logout')
        },

    //Login con Google
    async loginWithGoogle(CredentialResponse){ 
    const token_id = CredentialResponse.credential;
    try {
        const Gregister =await AuthenticationService.loginWithGoogleToken({"token_id":token_id});
        this.$store.dispatch('setToken', Gregister.data.token);
        this.$store.dispatch('setUser', Gregister.data.user);
        this.$store.commit('login');
    } catch (error) {
        this.error = error.Gregister.data.error;
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
        margin: 0 15px;
        
    }
    .bi-list{
        font-size: xx-large;
        margin-left: 15px;
        
    }
    .bi-google{
        font-size: x-large;
        color: black !important;
        &:hover{
            color: whitesmoke !important;
        }
    }
    .btn-usr{padding: 0;}
    .dropdown-menu{
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
    }
    .register-btn{
        font-size: small;
        background-color: whitesmoke;
        font-weight: bolder;
    }

    .dropdown-menu1{
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
        position: relative;
    }

    .dropdown-submenu .dropdown-menu1{
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
    }

</style>