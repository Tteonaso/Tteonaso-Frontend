<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <p style="font-family: BMHA">{{ message }}</p>
      <button @click="closeModal" class="close-btn">확인</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// 모달 메시지와 표시 여부를 관리
const isVisible = ref(false);
const message = ref('');

// 부모 컴포넌트로부터 메시지와 표시 여부를 전달받음
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: Boolean,
  content: String,
});

// 모달 열기
watch(() => props.visible, (newValue) => {
  isVisible.value = newValue;
  message.value = props.content;
});

// 모달 닫기
const closeModal = () => {
  isVisible.value = false;
  emit('update:visible', false);  // 부모에게 모달이 닫혔음을 알림
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.close-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #006ffd;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  font-family: BMHP;
}

.close-btn:hover {
  background-color: #0056cc;
}
</style>
