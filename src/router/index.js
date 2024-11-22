import { createRouter, createWebHistory } from 'vue-router';

import MapPage from "@/views/map/KaKaoMap.vue";
import FilterMapPage from "@/views/map/MapFilter.vue";
import SearchPage from "@/views/map/SearchPage.vue";
import SignUp from '@/components/member/SignUp.vue'; // SignUp.vue 경로를 가져옵니다
import SignIn from "@/components/member/SignIn.vue";
import OnBoarding from "@/components/member/OnBoarding.vue";
import ChatRoomListPage from "@/views/ChatRoomListPage.vue";
import ChatPage from "@/views/ChatPage.vue";
import Survey from "@/components/gpt-schedule/Survey.vue";

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
    path: '/search', // SearchPage 경로 추가
    name: 'SearchPage',
    component: SearchPage
  },
  {
    path: '/chatroom',
    name: 'ChatRoomListPage',
    component: ChatRoomListPage
  },
  {
    path: '/map/filter',
    name: 'FilterMapPage',
    component: FilterMapPage
  },
  {
    path: '/chatroom/chat/:chatRoomId', // Path Parameter 정의
    name: 'ChatPage',
    component: ChatPage, // 채팅방 상세 페이지
    props: true, // props로 전달
  },
  {
    path: '/survey', // 새로운 경로 추가
    name: 'Survey',
    component: Survey, // Survey.vue 컴포넌트 등록
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
