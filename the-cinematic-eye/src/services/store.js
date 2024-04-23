import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
  })

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
            state.token = null;
            state.user = null;
        }
    },
    actions: {
        setToken({commit}, token){
            commit('setToken', token)
        },
        setUser({commit}, user){
            commit('setUser', user)
        }
    },
    plugins: [vuexLocal.plugin]
})
