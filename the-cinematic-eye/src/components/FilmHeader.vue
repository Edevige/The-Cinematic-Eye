<template>
    <nav class="navbar">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <img src="@/assets/logo.png" alt="Logo" height="24" class="d-inline-block align-text-top invertColor">
                The Cinematic Eye
            </router-link>
            
            <div class="d-flex">
                <div class="d-flex">
                    <input v-if="search" class="form-control me-2" v-model="searchPar" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" @click="searchForm(searchPar)"><i class="bi bi-search"></i></button>
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
                                        <div class="text-center">Username</div>
                                    </div>
                                </div>
                            </li>
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </div>
                        <div v-if="!logged">
                            <form>
                                <div class="bt-3 mb-3 me-2 ms-2">
                                    <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Email/Username">
                                </div>
                                <div class="mb-3 me-2 ms-2">
                                    <input type="password" class="form-control" id="InputPassword" placeholder="Password">
                                </div>
                                <div class="d-flex justify-content-around">
                                    <i class="bi bi-google"></i>
                                    <button type="submit" class="btn btn-outline-light ms-2">Log</button>
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
export default {
    setup () {
        

        return {}
    },
    data(){
        return{
            search: false,
            searchPar: '',
            logged: true
        }
    },
    methods:{
        searchForm(par){
            if (par == '') {
                this.search = !this.search;
            } 
            //else {}
        }
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
    }
    .btn-usr{padding: 0;}
    .dropdown-menu{
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
    }
</style>