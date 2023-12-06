import { createStore } from 'vuex';

export default createStore({
    state:{
        logged: false,
        test: 'The store works'
    },
    mutations:{
        mutTest(state){
            state.test='Mutation too';
        },
        login(state){
            state.logged = true;
        },
        logout(state){
            state.logged = true;
        }
    }
})
