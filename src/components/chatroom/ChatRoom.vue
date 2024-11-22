<template>
  <div class="chat-room-card">
    <div class="chat-room-info">
      <div class="chat-icon">
        <img src="../../assets/images/chatIcon.png" alt="chat icon" />
      </div>
      <div>
        <p class="location">{{ location }}</p>
        <p class="participants">
          {{ participants }}명 참여 중
        </p>
      </div>
    </div>
    <button
      class="enter-btn"
      @click="enterChatRoom"
    >
      입장
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
import axios from "axios"; // Vue Router import
import { useUserStore } from "@/store/user"; // Pinia store import

const userStore = useUserStore(); // Pinia store 사용
const router = useRouter();


async function fetchUserInfo() {
  try {
    // localStorage에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing!");
      return;
    }

    // Axios 요청 보내기
    const response = await axios.get("http://localhost:8080/member", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 응답 데이터 저장
    // Pinia에 사용자 정보 저장
    userStore.setUserInfo(response.data.result);
  } catch (error) {
    console.error("회원 정보를 가져오는 데 실패했습니다:", error);
  }
}

onMounted(async () => {
  await fetchUserInfo();
})


// Props 정의
const props = defineProps({
  chatRoomId: Number,
  location: String,
  participants: Number,
});

// 채팅방 입장 함수
function enterChatRoom() {
  if (!props.chatRoomId) { // props.chatRoomId로 접근
    console.error("Chat Room ID is missing");
    return;
  }
  router.push({
    path: `/chatroom/chat/${props.chatRoomId}}`,
    query: {
      location: props.location, // location을 query로 전달
    },
  });
}
</script>


<style scoped>
/* 기존 스타일 그대로 */
.chat-room-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  width: 100%; /* 부모의 전체 너비를 채우도록 설정 */
  height: 80px; /* 카드의 높이를 약간 줄임 */
  background-color: #ffffff;
  border-radius: 16px; /* 둥근 모서리 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto 20px; /* 아래 간격 추가 */
}

.chat-room-info {
  display: flex;
  align-items: center;
  gap: 30px; /* 아이콘과 텍스트 사이 간격 */
}

.chat-icon img {
  width: 30px; /* 아이콘 크기를 줄임 */
  height: 30px;
  margin-left: 30px;
}

.location {
  font-size: 14px;
  font-weight: bold;
}

.participants {
  font-size: 12px;
  color: #555;
}

.enter-btn {
  padding: 12px 28px; /* 버튼 패딩 조정 */
  border: 2px solid #006ffd;
  border-radius: 12px;
  background-color: #ffffff;
  color: #006ffd;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 30px;
}

.enter-btn:hover {
  background-color: #006ffd;
  color: #ffffff;
}

.enter-btn.disabled {
  border-color: #ccc;
  background-color: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
}
</style>
