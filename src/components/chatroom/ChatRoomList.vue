<template>
  <div class="chat-room-list">
    <ChatRoom
      v-for="chatRoom in chatRooms"
      :key="chatRoom.id"
      :location="chatRoom.location"
      :participants="chatRoom.participants"
    />
  </div>
</template>

<script setup>
import ChatRoom from "@/components/chatroom/ChatRoom.vue";
import axios from 'axios';

// 예시 데이터
const chatRooms = [
  { location: "서울시 마포구", participants: 72, isFull: false },
  { location: "서울시 동작구", participants: 100, isFull: true },
  { location: "서울시 광진구", participants: 74, isFull: false },
  { location: "수원시 권선구", participants: 50, isFull: false },
  { location: "수원시 팔달구", participants: 120, isFull: true },
  { location: "수원시 영통구", participants: 80, isFull: false },
  { location: "대전시 유성구", participants: 78, isFull: false },
];
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
