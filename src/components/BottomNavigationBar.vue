<template>
  <div id="ground">
    <div class="bottom-nav">
      <div
        class="nav-item"
        v-for="item in navItems"
        :key="item.label"
        :class="{ active: selectedItem === item.label }"
        @click="selectItem(item)"
      >
        <img :src="item.icon" :alt="item.label" class="nav-icon" />
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import { useRouter } from "vue-router";
import chatIcon from "@/assets/images/Chat.png"; // 채팅 아이콘
import mapIcon from "@/assets/images/Explore.png"; // 지도 아이콘
import settingsIcon from "@/assets/images/Settings.png"; // 설정 아이콘

const router = useRouter();

const navItems = [
  { label: "Chats", icon: chatIcon, path: "/chatroom" },
  { label: "Map", icon: mapIcon, path: "/map" },
  { label: "Settings", icon: settingsIcon },
];

const selectedItem = ref("Chats");

function selectItem(item) {
  selectedItem.value = item.label;
  router.push(item.path);
}
</script>

<style scoped>

/* 전체 네비게이션 바 스타일 */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  background-color: #f9fafc;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  width: 600px;
}

/* 각 네비게이션 아이템 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #b0b0b0;
  transition: color 0.3s;
}

/* 아이콘 스타일 */
.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

/* 텍스트 라벨 스타일 */
.nav-label {
  font-size: 12px;
  font-family: BMHA;
}

/* 활성화된 아이템 스타일 */
.nav-item.active {
  color: #007bff; /* 활성화된 아이템의 색상 */
}

.nav-item.active .nav-icon {
  filter: brightness(1.2); /* 활성화된 아이템의 아이콘 강조 효과 */
}
</style>
