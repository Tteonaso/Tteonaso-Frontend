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

export default {
  components: {
    ChatRoom,
  },
  data() {
    return {
      chatRooms: [], // chatRooms 데이터를 담을 배열
    };
  },
  methods: {
    async fetchChatRooms() {
      try {
        const response = await axios.get('http://localhost:8080/chatroom');
        console.log(response);
        this.chatRooms = response.data; // 응답 데이터를 chatRooms에 저장
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
      }
    },
  },
  mounted() {
    this.fetchChatRooms(); // 컴포넌트가 마운트되면 데이터 요청
  },
};
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
