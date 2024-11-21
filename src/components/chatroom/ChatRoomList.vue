<template>
    <div class="chat-room-list">
        <ChatRoom
                v-for="chatRoom in chatRooms"
                :key="chatRoom.chatRoomId"
                :chatRoomId="chatRoom.chatRoomId"
                :location="chatRoom.location"
                :participants="chatRoom.participants"
        />
    </div>
    <div class="button-container">
        <button class="circle-button" @click="goToPreviousPage" :disabled="page === 0">
            <img src="../../assets/images/ArrowLeft.png" class="before-icon" />
        </button>
        <button class="circle-button" @click="goToNextPage" :disabled="page >= maxPage - 1">
            <img src="../../assets/images/ArrowRight.png" class="next-icon" />
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatRoom from "@/components/chatroom/ChatRoom.vue";
import axios from 'axios';

const chatRooms = ref([]); // 현재 페이지에 표시할 ChatRoom 배열
const allChatRooms = ref([]); // 모든 ChatRoom 데이터를 저장
const page = ref(0); // 현재 페이지 번호
const itemsPerPage = 4; // 페이지당 아이템 수
const maxPage = ref(0); // 전체 페이지 수

// 데이터를 가져오는 함수
async function fetchAllChatRooms() {
    try {
        const response = await axios.get('http://localhost:8080/chatroom');
        allChatRooms.value = response.data.result;
        maxPage.value = Math.ceil(allChatRooms.value.length / itemsPerPage);
        updateChatRooms(); // 초기 페이지 데이터 설정
    } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
    }
}

// 현재 페이지 데이터를 업데이트하는 함수
function updateChatRooms() {
    const start = page.value * itemsPerPage;
    const end = start + itemsPerPage;
    chatRooms.value = allChatRooms.value.slice(start, end);
}

// 이전 페이지로 이동하는 함수
function goToPreviousPage() {
    if (page.value > 0) {
        page.value -= 1;
        updateChatRooms();
    }
}

// 다음 페이지로 이동하는 함수
function goToNextPage() {
    if (page.value < maxPage.value - 1) {
        page.value += 1;
        updateChatRooms();
    }
}

// 초기 데이터를 가져옴
fetchAllChatRooms();
</script>

<style scoped>
.chat-room-list {
    display: flex;
    flex-direction: column;
    gap: 16px; /* 카드 사이 간격 */
    width: 80%; /* 부모의 전체 너비를 채우도록 설정 */
    align-items: center;
    padding-right: 20px;
}

.button-container {
    display: flex;
    justify-content: center; /* 버튼들을 가운데 정렬 */
    align-items: center;
    gap: 16px; /* 버튼 간격 */
    padding: 16px;
    background-color: #f9fafc; /* 배경색 (선택사항) */
}

.circle-button {
    width: 60px;
    height: 60px;
    border-radius: 50%; /* 원형 버튼 */
    border: none;
    background-color: #eef1f6; /* 버튼 배경색 */
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.circle-button:hover {
    transform: scale(1.1); /* 마우스 오버 시 크기 증가 */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* 그림자 강조 */
}

.circle-button:disabled {
    cursor: not-allowed;
    opacity: 0.5; /* 비활성화 시 투명도 조절 */
}

.before-icon,
.next-icon {
    width: 24px;
    height: 24px;
}
</style>
