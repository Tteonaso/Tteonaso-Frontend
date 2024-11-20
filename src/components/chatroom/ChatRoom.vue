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
    >
      입장
    </button>
  </div>
</template>

<script setup>
defineProps({
  location: String,
  participants: Number,       // 채팅방 정원 초과 여부
});

</script>

<style scoped>
.chat-room-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
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
}

.location {
  font-size: 18px;
  font-weight: bold;
}

.participants {
  font-size: 14px;
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
