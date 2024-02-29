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
                        <li><router-link class="dropdown-item" to="/about">About</router-link></li>
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
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
   
                                    <GoogleLogin :callback="loginWithGoogle">
                                        <button class="btn btn-outline-light ms-2">G</button>
                                    </GoogleLogin>
                                    
                                    <button type="button" @click="login" class="btn btn-outline-light ms-2">Login</button>
                                    
                                </div>
                                <hr/>
                                <p class="mb-1 text-center" style="font-size: smaller;">If you're not registered</p>
                                <div class="d-flex justify-content-around">
                                    <button type="button" @click="$router.push('/register')" class="btn flex-fill me-2 ms-2 mt-2 pt-1 pb-1 register-btn">Sign Up</button>
                                    <div></div>
                                    <button type="button" @click="registerWithGoggle" class="g-signin2 btn flex-fill me-2 ms-2 mt-2 pt-1 pb-1 register-btn" data-width="300" data-height="200" data-longtitle="true"><i class="bi bi-google"></i></button>
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
export default {
    name: 'GoogleLoginComponent',
    mounted(){
        
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
        }
    },
    methods:{
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
    
    async loginWithGoogle(response){
        try {
            const result = await AuthenticationService.loginWithGoogleToken(response);
        } catch (error) {
            this.error = error.response.data.error
        }
        
    },
    
    async registerWithGoggle(){

        }
        
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
</style>