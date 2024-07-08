import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import { vTippy } from './tippy/tippy.directive';

createApp(App)
	.use(createPinia())
	.directive('tippy', vTippy)
	.mount('#app')
