import { createWebHashHistory, createRouter } from 'vue-router'

import LoadView from './screens/Load.vue'
import HomeView from './screens/Home.vue'
import Preview from './screens/Preview.vue'

const routes = [
  { path: '/', component: LoadView },
  { path: '/home', component: HomeView },
  { path: '/preview/:id', component: Preview }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
