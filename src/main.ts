import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { router } from './router/index'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
  },
})
app.use(Toast)

app.mount('#root')
