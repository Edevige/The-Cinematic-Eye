<template>
    <div class="d-flex flex-column">
        <div class="h1 pt-3 m-auto">Register</div>
        <RegisterForm/>
    </div>
</template>

<script>
import RegisterForm from '@/components/RegisterForm.vue';


export default {
    setup() {
        return {};
    },
    components: { RegisterForm },
    methods:{
        logCheck(){
            if(this.$store.state.logged){router.push("/")}
        }
    }
}
</script>

<style lang="scss" scoped>
    .h1{
    text-align: center;
    color: whitesmoke;
    padding-bottom: 0.5rem;
}
</style>