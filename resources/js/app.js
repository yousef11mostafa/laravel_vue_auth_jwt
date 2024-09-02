import './bootstrap';
import { createApp } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';


import App from './components/app.vue';
import router from './router/index'
import store from './store'


const app = createApp(App)



app.use(router)
app.use(store)
app.mount("#app")

// createApp(App)
// .use(router)
// .use(store)
// .mount("#app")
