import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { vAutoFocus } from './plugin/auto-focus/auto-focus.directive';
import { vTippy } from './plugin/tippy/tippy.directive';
import './style.css';

createApp(App)
	.use(createPinia())
	.directive('tippy', vTippy)
	.directive('auto-focus', vAutoFocus)
	.mount('#app')
