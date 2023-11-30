import { createStore } from 'vuex';

export default createStore({
    state:{
        test: 'The store works'
    },
    mutations:{
        mutTest(state){
            state.test='Mutation too';
        }
    }
})
