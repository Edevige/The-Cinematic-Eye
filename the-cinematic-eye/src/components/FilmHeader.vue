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
                        <i class="bi bi-person-fill"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <div class="d-flex flex-row align-items-center \ usr-menu">
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
                        <li><router-link class="dropdown-item" to="/">Home</router-link> </li>
                        <li><router-link class="dropdown-item" to="/about">About</router-link></li>
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
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
            searchPar: ''
        }
    },
    methods:{
        searchForm(par){
            if (par == '') {
                this.search = !this.search;
            } else {
                
            }
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
    .btn-usr{padding: 0;}
    .dropdown-menu{
        --bs-dropdown-bg: #{$menu-color};
        --bs-dropdown-color: whitesmoke;
    }
</style>