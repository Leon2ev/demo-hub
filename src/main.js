import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { router } from './router'

// Components
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'

// Styles for PrimeVue
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue)
app.use(router)
app.use(pinia)

app.component('Button', Button)
app.component('Breadcrumb', Breadcrumb)
app.component('Password', Password)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Dropdown', Dropdown)

app.mount('#app')
