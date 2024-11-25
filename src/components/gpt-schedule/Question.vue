<template>
  <div class="question-container">
    <h1>{{ question.title }}</h1>
    <p>{{ question.description }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  onSelect: {
    type: Function,
    required: true
  },
  selectedAnswers: {
    type: Array,
    required: true
  }
});

</script>

<style scoped>
.question-container {
  text-align: center;
}

.option-container {
  display: flex;
  flex-wrap: wrap; /* 여러 줄로 감싸기 */
  justify-content: center; /* 중앙 정렬 */
  gap: 15px; /* 버튼 간의 간격 */
}

.option-button {
  flex: 1 1 30%; /* 버튼을 한 줄에 3개씩 배치 (너비 조정) */
  padding: 15px; /* 패딩을 늘려서 버튼 크기 통일 */
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.option-button.selected {
  background-color: #C9E6F0; /* 선택된 버튼 색상 */
}

.option-button:hover {
  background-color: #78B3CE; /* 호버 시 색상 변경 */
}
</style>