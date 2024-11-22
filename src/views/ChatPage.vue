<template>
  <div class="chat-room">
    <!-- 채팅 헤더 -->
    <div class="chat-header">
      <button class="back-button" @click="goBack">
        <img src="../assets/images/ArrowLeft.png" alt="Back" />
      </button>
      <h1 class="chat-title">{{ location }}</h1>
    </div>

    <!-- 채팅 메시지 리스트 -->
    <div class="chat-messages">
      <!-- 상대방 메시지 -->
      <div v-for="(message, index) in messages" :key="index"
           :class="message.sender === userInfo?.value?.name ? 'user-message' : 'other-message'">
        <p class="user-name">{{ message.sender }}</p>
        <p class="message-content">{{ message.message }}</p>
      </div>
    </div>

    <!-- 채팅 입력 영역 -->
    <div class="chat-footer">
      <div class="input-container">
        <input
          v-model="newMessage"
          class="message-input"
          type="text"
          placeholder="메시지를 입력하세요"
        />
        <button class="send-button" @click="sendMessage">
          <img src="../assets/images/Send.png" alt="Send" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "axios";
import { useUserStore } from "@/store/user"; // Pinia store import

const userStore = useUserStore(); // Pinia store 사용
const userInfo = ref(userStore.userInfo); // 사용자 정보 참조
const router = useRouter();
const route = useRoute();
const chatRoomId = route.params.chatRoomId;
const location = route.query.location || 'Unknown Location'; // 채팅방 위치
const chatRoomIdNumber = Number(chatRoomId.slice(0, 1));
let socket = null;
const messages = ref([]); // 메시지를 관리하는 배열
const newMessage = ref(''); // 입력된 메시지


// 웹소켓 연결 및 메시지 처리
onMounted( () => {
  console.log(userInfo.value)
  // 웹소켓 연결
  socket = new WebSocket('ws://localhost:8080/ws/conn');

  // 웹소켓 연결이 열렸을 때
  socket.onopen = () => {
    console.log('WebSocket 연결 완료');
    const joinMessage = JSON.stringify({
      messageType: 'JOIN',
      chatRoomId: chatRoomIdNumber,
      message: '채팅방에 입장하였습니다.',
      sender: userInfo.value.name // 보내는 사람 이름
    });

    // 서버에 입장 메시지 전송
    socket.send(joinMessage);
  };

  // 서버에서 메시지를 받을 때
  socket.onmessage = (event) => {
    try {
      const receivedMessage = JSON.parse(event.data);
      console.log('Received message:', receivedMessage);

      // 수신한 메시지를 messages 배열에 추가
      messages.value.push(receivedMessage);
    } catch (error) {
      console.log('Non-JSON message received:', event.data);
    }
  };

  // 연결 종료 시
  socket.onclose = (event) => {
    console.log('WebSocket 연결 종료', event);
    const joinMessage = JSON.stringify({
      messageType: 'LEAVE',
      chatRoomId: chatRoomIdNumber,
      message: '채팅방을 나갔습니다.',
      sender: userInfo.value.name // 보내는 사람 이름
    });

    // 서버에 입장 메시지 전송
    socket.send(joinMessage);
  };

  // 오류 발생 시
  socket.onerror = (error) => {
    console.error('WebSocket 오류 발생:', error);
  };
});

// 메시지 전송 함수
function sendMessage() {
  if (newMessage.value.trim() === '') return; // 메시지가 비어 있으면 전송하지 않음

  const messageData = {
    messageType: 'TALK',
    chatRoomId: chatRoomIdNumber,
    message: newMessage.value,
    sender: userInfo.value.name, // 보내는 사람 이름
  };

  // 서버로 메시지 전송
  socket.send(JSON.stringify(messageData));
  newMessage.value = ''; // 입력 필드 초기화
}

// 뒤로 가기 함수
function goBack() {
  router.push('/chatroom'); // ChatRoomList.vue에 연결된 경로
}
</script>

<style scoped>
/* 전체 채팅 방 스타일 */
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px; /* 가로 길이 고정 */
  margin: 0 auto; /* 가로 가운데 정렬 */
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 선택: 그림자 효과 */
  border-radius: 8px; /* 선택: 테두리 둥글게 */
}

/* 헤더 스타일 */
.chat-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f4f6fa;
  border-bottom: 1px solid #d1d5db;
}

.chat-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
}

.back-button img {
  width: 24px;
  height: 24px;
}

/* 메시지 리스트 스타일 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f4f6fa;
  display: flex;
  flex-direction: column;
  gap: 12px; /* 메시지 간격 */
}

/* 상대방 메시지 (왼쪽 정렬) */
.other-message {
  align-self: flex-start; /* 왼쪽 정렬 */
  max-width: 70%; /* 메시지 최대 너비 */
  background-color: #eef1f6; /* 배경색 */
  color: #000; /* 텍스트 색상 */
  padding: 12px;
  border-radius: 8px;
  word-wrap: break-word; /* 텍스트 줄바꿈 */
  position: relative;
}

/* 사용자명 스타일 */
.user-name {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #4a4a4a; /* 사용자명 색상 */
}

/* 내가 보낸 메시지 (오른쪽 정렬) */
.user-message {
  align-self: flex-end; /* 오른쪽 정렬 */
  max-width: 70%; /* 메시지 최대 너비 */
  background-color: #4a90e2; /* 배경색 */
  color: white; /* 텍스트 색상 */
  padding: 12px;
  border-radius: 8px;
  word-wrap: break-word; /* 텍스트 줄바꿈 */
}

/* 메시지 내용 */
.message-content {
  font-size: 14px;
  line-height: 1.5;
}

/* 입력 영역 스타일 */
.chat-footer {
  padding: 16px;
  background-color: #f9fafc;
  border-top: 1px solid #d1d5db;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.add-button,
.send-button {
  background: none;
  border: none;
  cursor: pointer;
}

.add-button img,
.send-button img {
  width: 24px;
  height: 24px;
}
</style>
