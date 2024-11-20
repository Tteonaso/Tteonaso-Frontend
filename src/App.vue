<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import KakaoMap from './components/map/KaKaoMap.vue';
import OnBoarding from "@/components/member/OnBoarding.vue";

export default {
  name: 'App',
  components: {
    OnBoarding,
    KakaoMap
  }
}
</script>

<style>

</style>
