import { createApp } from 'vue'
import { createGtag } from "vue-gtag";
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vuetify } from './plugins/vuetify'
import './style.css'

const script = document.createElement('script')
script.async = true
script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GTAG_ID}`
document.head.appendChild(script)

window.dataLayer = window.dataLayer || []
function gtag(...args: any[]) {
  window.dataLayer.push(args)
}
gtag('js', new Date())
gtag('config', import.meta.env.VITE_GTAG_ID)

// Initialize the app
const app = createApp(App)

// Set up Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Initialize and use Gtag
const vueGtag = createGtag({
  tagId: import.meta.env.VITE_GTAG_ID,
  pageTracker: {
    router,
    useRouteFullPath: true
  }
})
app.use(vueGtag)

// Initialize and use Vue Router
app.use(router)

// Initialize and use Vuetify
app.use(vuetify)

// Mount the app
app.mount('#app')