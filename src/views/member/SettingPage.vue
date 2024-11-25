<template>

  <div class="settings-page">
    <!-- 헤더 -->
    <div class="header">
      <h1 style="font-family: BMHP">설정</h1>
    </div>

    <!-- 프로필 섹션 -->
    <div class="profile-section">
      <div class="profile-image">
        <img src="../../assets/images/Person.png" alt="Profile" />
      </div>
      <p class="user-name">{{ userInfo.name }}</p>
      <p class="user-id">{{ userInfo.email }}</p>
    </div>

    <!-- 메뉴 목록 -->
    <div class="menu-list">
      <div
        v-for="menu in menus"
        :key="menu.id"
        class="menu-item"
        @click="navigateTo(menu.path)"
      >
        <p>{{ menu.title }}</p>
        <span class="arrow">></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from "@/store/user"; // Pinia store import

const router = useRouter();
const userStore = useUserStore(); // Pinia store 사용
const userInfo = ref(userStore.userInfo); // 사용자 정보 참조

// 메뉴 목록
const menus = ref([
  { id: 1, title: '장소 기록하기', path: '/record-location' },
  { id: 2, title: '나만의 장소', path: '/my-places' },
  { id: 3, title: '원하는 여행 설계받기', path: '/survey' },
  { id: 4, title: '회원 정보 관리', path: '/manage-account' },
]);

// 페이지 이동 함수
function navigateTo(path) {
  router.push(path);
}
</script>

<style scoped>
/* 전체 페이지 중앙 정렬 */
#ground {
  width: 600px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9fafc;
}
/* 전체 페이지 스타일 */
.settings-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  width: 600px;
  justify-content: center;
  margin: 0 auto;
  height: 100vh;
  background-color: #f9fafc;
}

/* 헤더 */
.header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* 프로필 섹션 */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image {
  position: relative;
  width: 80px;
  height: 80px;
}

.profile-image img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f0f0f0;
}

.edit-button img {
  width: 19.5px;
  height: 19.5px;
}

/* 사용자 이름 및 ID */
.user-name {
  margin: 10px 0 5px;
  font-size: 16px;
  font-weight: bold;
  font-family: BMHA;
}

.user-id {
  font-size: 14px;
  color: #777;
  font-family: BMHA;
}

/* 메뉴 목록 */
.menu-list {
  width: 100%;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.menu-item p {
  font-size: 16px;
  color: #333;
  font-family: BMHP;
}

.menu-item .arrow {
  font-size: 18px;
  color: #bbb;
}
</style>
