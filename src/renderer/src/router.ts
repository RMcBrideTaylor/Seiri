import { createMemoryHistory, createRouter } from 'vue-router'

import LoadView from './screens/Load.vue'
import HomeView from './screens/Home.vue'

const routes = [
  { path: '/', component: LoadView },
  { path: '/home', component: HomeView }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes
})
