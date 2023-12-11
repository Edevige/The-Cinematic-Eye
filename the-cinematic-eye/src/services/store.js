import { createStore } from 'vuex';

export default createStore({
    state:{
        logged: false,
        token: null,
        user: null
    },
    mutations:{
        setToken(state, token){
            state.token = token;
        },
        setUser(state, user){
            state.user = user;
        },
        login(state){
            state.logged = true;
        },
        logout(state){
            state.logged = false;
        }
    },
    actions: {
        setToken({commit}, token){
            commit('setToken', token)
        },
        setUser({commit}, user){
            commit('setUser', user)
        }
    }
})
