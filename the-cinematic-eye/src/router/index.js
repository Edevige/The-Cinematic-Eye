import { createRouter, createWebHistory, useRoute } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FilmView from '../views/FilmView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import store from '@/services/store'
import GenreView from '@/views/GenreView.vue'
import AdvancedSearchView from '@/views/AdvancedSearchView.vue'
import AdvancedSearchReturnView from '@/views/AdvancedSearchReturnView.vue'
import PersonalAreaView from '@/views/PersonalAreaView.vue'
import PreferitiView from '@/views/PreferitiView.vue'
import LeTueListeView from '@/views/LeTueListeView.vue'
import LeTueRecensioniView from '@/views/LeTueRecensioniView.vue'
import FilmGiaVistiView from '@/views/FilmGiaVistiView.vue'
import TopUsersView from '@/views/TopUsersView.vue'
import UserView from '@/views/UserView.vue'
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue'
import ListaFilm from '@/components/ListaFilm.vue'
import DiscoverFilmView from '@/views/DiscoverFilmView.vue'
import OtherUserView from '@/views/OtherUserView.vue'
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
    path: '/forgot-password',
    name: 'forgotPassword',
    component: ForgotPassword,
    meta: { guest: true }
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: ResetPassword,
    meta: { guest: true }
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
  {
    path: '/OtherUser/:username',
    name: 'OtherUser',
    component: OtherUserView,
    props: true 
  },
  {
    path:'/preferiti/:id',
    name: 'preferiti',
    component: PreferitiView
  },
  {
    path:'/letueliste/:id',
    name: 'letueliste',
    component: LeTueListeView
  },
  {
    path: '/lista/:id',
    name: 'ListaFilm',
    component: ListaFilm,
  },
  {
    path:'/letuerecensioni/:id',
    name: 'letuerecensioni',
    component: LeTueRecensioniView
  },
  {
    path:'/filemgiavisti/:id',
    name: 'filmgiavisti',
    component: FilmGiaVistiView
  },
  {
    path:'/topUsers',
    name:'topUsers',
    component: TopUsersView,
  },
  {
    path:'/user/:id',
    name:'user',
    component: UserView,
    props: true,
  },
  {
    path:'/discoverFilm',
    name:'discoverFilm',
    component: DiscoverFilmView
  },
  {
    path: '/forum/:filmId',
    name: 'forum',
    component: () => import('@/views/ForumView.vue'),
    props: (route) => ({ filmId: route.params.filmId, filmTitle: route.query.filmTitle }) // Usa query per passare il titolo
  },
  {
    path:'/debug',
    name: 'debug',
    component: () => import('../views/DebugStoreView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // Torna alla posizione precedente se c'è
      return savedPosition;
    } else {
      // Scorri fino all'inizio della nuova pagina
      return { left: 0, top: 0 };
    }
  }
})

router.beforeEach((to, from) => {
  if(to.meta.guest && store.state.logged){
     return false
  } 


});

export default router
