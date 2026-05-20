import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import TaskDetails from '../pages/TaskDetails.vue'
import NotFound from '../pages/NotFound.vue'

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/tasks/:id', component: TaskDetails, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]
export const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach(async (to, from) => {
  const { user, fetchUser } = useAuth()
  if (!user.value && localStorage.getItem('token')) {
    await fetchUser()
  }
  if (to.meta.requiresAuth && !user.value) {
    return { path: '/login' }
  }
})
