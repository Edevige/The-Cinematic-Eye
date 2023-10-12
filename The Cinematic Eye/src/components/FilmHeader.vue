<template>
    <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand">The Cinematic Eye</a>
            
            <div class="d-flex">
                <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit"><i class="bi bi-search"></i></button>
            </form>
            <i class="bi bi-person-fill"></i>
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

        }
    },
    methods:{

    }

}
</script>

<style lang="scss" scoped>
    .navbar{
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
        border-radius: 0.5rem;
        
    }
    .bi-person-fill{
        font-size: xx-large;
        margin: 0 15px;
    }
</style>