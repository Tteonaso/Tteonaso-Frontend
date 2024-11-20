<template>
  <div class="chat-room-list">
    <ChatRoom
      v-for="chatRoom in chatRooms"
      :key="chatRoom.chatRoomId"
      :location="chatRoom.location"
      :participants="chatRoom.participants"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatRoom from "@/components/chatroom/ChatRoom.vue";
import axios from 'axios';

const chatRooms = ref([]); // chatRooms 배열 초기화

async function fetchChatRooms() {
    try {
        const response = await axios.get('http://localhost:8080/chatroom');
        chatRooms.value = response.data.result; // 응답 데이터를 chatRooms에 저장
        console.log(chatRooms.value); // 데이터를 확인하려면 콘솔 출력
    } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
    }
}

// 데이터를 가져오는 함수 호출
fetchChatRooms();



</script>

<style scoped>

.chat-room-list {
  display: flex;
  flex-direction: column;
  gap: 16px; /* 카드 사이 간격 */
  width: 80%; /* 부모의 전체 너비를 채우도록 설정 */
  align-items: center;
  padding-right: 40px;
}

</style>
