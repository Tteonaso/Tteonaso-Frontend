import { createRouter, createWebHistory } from 'vue-router';

import KaKaoMap from '@/views/map/KaKaoMap.vue';
import MapFilter from '@/views/map/MapFilter.vue';
import SearchPage from '@/views/map/SearchPage.vue';
import SignUp from '@/components/member/SignUp.vue'; // SignUp.vue 경로를 가져옵니다
import SignIn from "@/components/member/SignIn.vue";
import OnBoarding from "@/components/member/OnBoarding.vue";

const routes = [
  {
    path: '/',
    name: 'OnBoarding',
    component: OnBoarding, // 온보딩 컴포넌트를 등록
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp, // 회원가입 컴포넌트를 등록
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn, // 로그인 컴포넌트를 등록
  },
  {
    path: '/map',
    name: 'MapPage',
    component: KaKaoMap
  },
  {
    path: '/map/filter',
    name: 'FilterMapPage',
    component: MapFilter
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
