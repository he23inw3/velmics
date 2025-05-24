import { createApp } from 'vue'
import { createGtag } from "vue-gtag";
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vuetify } from './plugins/vuetify'
import './style.css'

// Initialize the app
const app = createApp(App)

// Set up Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Initialize and use Gtag
const gtag = createGtag({
  tagId: import.meta.env.VUE_APP_GTAG_ID
})
app.use(gtag)

// Initialize and use Vue Router
app.use(router)

// Initialize and use Vuetify
app.use(vuetify)

// Mount the app
app.mount('#app')