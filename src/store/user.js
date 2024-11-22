import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null, // 사용자 정보 저장
  }),
  actions: {
    setUserInfo(data) {
      this.userInfo = data;
    },
    clearUserInfo() {
      this.userInfo = null;
    },
  },
});
