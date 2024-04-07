import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FilmView from '../views/FilmView.vue'
import RegisterView from '../views/RegisterView.vue'
import SearchView from '../views/SearchView.vue'
import store from '@/services/store'
import ActionView from '@/views/ActionView.vue'
import AnimationView from '@/views/AnimationView.vue'
import RomanceView from '@/views/RomanceView.vue'
import HorrorView from '@/views/HorrorView.vue'
import ComedyView from '@/views/ComedyView.vue'
import DramaView from '@/views/DramaView.vue'
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
    path: "/:pathMatch(.*)*",
    name: 'ErrorView',
    component: () => import('../components/Error.vue'),
  },
  {
    path: '/ActionFilm',
    name: 'Action',
    component: ActionView
  },
  {
    path: '/AnimationFilm',
    name: 'Animation',
    component: AnimationView
  },
  {
    path: '/RomanceFilm',
    name: 'Romance',
    component: RomanceView
  },
  {
    path: '/HorrorFilm',
    name: 'Horror',
    component: HorrorView
  },
  {
    path: '/ComedyFilm',
    name: 'Comedy',
    component: ComedyView
  },
  {
    path: '/DramaFilm',
    name: 'Drama',
    component: DramaView
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
