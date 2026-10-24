import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import router from './router'
import en from './locales/en.js'
import km from './locales/km.js'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: 'km',
  fallbackLocale: 'km',
  messages: {
    km,
    en
  }
})

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast, {
  position: 'top-right',
 timeout: 3000,
})

app.mount('#app')
