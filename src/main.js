import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 라우터 가져오기
import '@/assets/css/global.css';

const app = createApp(App);
app.use(router); // Vue 애플리케이션에 라우터 등록
app.mount('#app');

