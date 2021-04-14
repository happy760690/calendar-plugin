import { createApp } from 'vue'
import App from './App.vue'
import calendar from './plugins/calendar/index.js'

let app = createApp(App);
app.use(calendar)
app.mount('#app')
// createApp(App).use(calendar).mount('#app')
