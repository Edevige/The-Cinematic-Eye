import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FilmView from '../views/FilmView.vue'
import RegisterView from '../views/RegisterVieww.vue'
import SearchView from '../views/SearchView.vue'
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
    path: '/film/:id',
    name: 'film',
    component: FilmView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
