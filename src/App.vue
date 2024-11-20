<!-- src/App.vue -->
<template>
  <div id="app">
  <router-view></router-view>
  </div>
</template>

<script>
import KakaoMap from '@/views/map/KaKaoMap.vue';
import OnBoarding from "@/views/member/OnBoarding.vue";
import SearchPage from "@/views/map/SearchPage.vue";

export default {
  name: 'App',
  components: {
    OnBoarding,
    KakaoMap,
    SearchPage
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  overflow: hidden;
}
</style>
