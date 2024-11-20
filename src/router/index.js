import { createRouter, createWebHistory } from 'vue-router';

import MapPage from '@/components/map/KaKaoMap.vue';
import FilterMapPage from '@/components/map/MapFilter.vue';
import SignUp from '@/components/member/SignUp.vue'; // SignUp.vue 경로를 가져옵니다
import SignIn from "@/components/member/SignIn.vue";
import OnBoarding from "@/components/member/OnBoarding.vue";
import ChatRoomListPage from "@/views/ChatRoomListPage.vue";

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
    path: '/signin',
    name: 'SignIn',
    component: SignIn, // 로그인 컴포넌트를 등록
  },
  {
    path: '/map',
    name: 'MapPage',
    component: MapPage
  },
  {
    path: '/map/filter',
    name: 'FilterMapPage',
    component: FilterMapPage
  },
  {
    path: '/chatroom',
    name: 'ChatRoomListPage',
    component: ChatRoomListPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
