import { createApp } from 'vue'
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

// Initialize and use Vue Router
app.use(router)

// Initialize and use Vuetify
app.use(vuetify)

// Mount the app
app.mount('#app')