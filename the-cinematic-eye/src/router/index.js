import { createRouter, createWebHistory, useRoute } from 'vue-router'
import { watch } from 'vue'
import HomeView from '../views/HomeView.vue'
import FilmView from '../views/FilmView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import store from '@/services/store'
import GenreView from '@/views/GenreView.vue'
import AdvancedSearchView from '@/views/AdvancedSearchView.vue'
import AdvancedSearchReturnView from '@/views/AdvancedSearchReturnView.vue'
import PeopleView from '@/views/PeopleView.vue'
import PersonalAreaView from '@/views/PersonalAreaView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../views/TermsView.vue')
  },
  {
    path: '/film/:id',
    name: 'film',
    component: FilmView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true }
  },
  {
    path: '/s/:sPar',
    name: 'search',
    component: SearchView,
    meta:{
      nav: true
    }
  },
  {
    path:'/advancedSearch',
    name: 'advancedSearch',
    props:true,
    component: AdvancedSearchView,
    meta:{
      advSrc: true
    }
  },
  {
    path:'/advancedSearchReturn',
    name: 'advancedSearchReturn',
    component:AdvancedSearchReturnView
  },
  {
    path:'/PeopleView/:page',
    name:'PeopleView',
    component: PeopleView
  },
  {
    path: "/:pathMatch(.*)*",
    name: 'ErrorView',
    component: () => import('../components/Error.vue'),
  },
  {
    path: '/genre/:id',
    name: 'genres',
    component: GenreView
  },
  {
    path:'/personalArea',
    name: 'personalArea',
    component: PersonalAreaView
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  if(to.meta.guest && store.state.logged){
     return false
  } 
});

export default router
