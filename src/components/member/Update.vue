<template>
  <div id="ground">
    <h1 class="title">회원 정보 수정</h1>
    <form class="form" @submit.prevent="handleUpdate">
      <div class="input-group">
        <label for="name">이름</label>
        <input v-model="name" type="text" id="name" placeholder="이름"/>
      </div>
      <div class="input-group">
        <label for="password">기존 비밀번호</label>
        <input v-model="originalPassword" type="password" id="password" placeholder="기존 비밀번호" />
      </div>
      <div class="input-group">
        <label for="confirm-password">새로운 비밀번호 </label>
        <input v-model="newPassword" type="password" id="confirm-password" placeholder="새로운 비밀번호" />
      </div>
      <div class="input-group">
        <label for="age">나이</label>
        <input v-model="age" type="number" id="age" placeholder="나이" />
      </div>
      <div class="input-group">
        <label for="phone">전화번호</label>
        <input v-model="phone" type="tel" id="phone" placeholder="전화번호" />
      </div>
      <button type="submit" class="submit-btn">정보 수정</button>
    </form>

    <!-- 모달 컴포넌트 사용 -->
    <Modal :visible="isModalVisible" :content="modalMessage" @update:visible="isModalVisible = $event" />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import Modal from "@/layouts/Modal.vue";
import { useRouter } from 'vue-router'; // Vue Router 가져오기
import { useUserStore } from "@/store/user.js"; // Pinia store import

const userStore = useUserStore(); // Pinia store 사용
const userInfo = ref(userStore.userInfo); // 사용자 정보 참조
const name = ref('');
const originalPassword = ref('');
const newPassword = ref('');
const age = ref('');
const phone = ref('');
const isModalVisible = ref(false);  // 모달의 가시성 상태
const modalMessage = ref('');
const router = useRouter()

onMounted(async () => {
  name.value = userInfo.value.name;
  age.value = userInfo.value.age;
  phone.value = userInfo.value.phone;
})
// 회원가입 처리 함수
const handleUpdate = async () => {
  // JSON 데이터 생성
  const requestData = {
    name: name.value,
    originalPassword: originalPassword.value,
    newPassword: newPassword.value,
    age: age.value,
    phone: phone.value,
  };

  // localStorage에서 accessToken 가져오기
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    modalMessage.value = '로그인이 필요합니다.';
    isModalVisible.value = true;
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/member/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // JSON 형식으로 요청
        'Authorization': `Bearer ${accessToken}`, // Bearer 토큰 추가
      },
      body: JSON.stringify(requestData), // 객체를 JSON 문자열로 변환
    });

    const data = await response.json();

    if (response.ok && data.isSuccess) {
      console.log('회원 정보 수정 성공:', data);
      // 회원 정보 수정 성공 처리 (예: 리다이렉트)
      router.push('/setting'); // '/setting' 라우트로 이동
    } else {
      console.error('회원 정보 수정 실패:', data);
      // 실패 시 처리 (모달 등으로 메시지 표시)
      modalMessage.value = data.message || '회원 정보 수정에 실패했습니다.';
      isModalVisible.value = true;
    }
  } catch (error) {
    console.error('회원 정보 수정 요청 중 오류 발생:', error);
    modalMessage.value = '회원 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.';
    isModalVisible.value = true;
  }
};

</script>

<style scoped>
/* 기본 설정 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* 전체 페이지 중앙 정렬 */
#ground {
  width: 600px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

/* 타이틀 스타일 */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
  font-family: BMHP;
}

/* 설명 텍스트 */
.description {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
  font-family: BMHA;
}

/* 입력 폼 */
.form {
  width: 100%;
}

/* 입력 그룹 */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-group label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
  font-family: BMHP;
}

.input-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: BMHA;
}

/* 성별 버튼 그룹 */
.gender-group {
  display: flex;
  gap: 10px;
}

.gender-btn {
  flex: 1;
  padding: 10px 0;
  background-color: white;
  border: 2px solid #006ffd;
  border-radius: 8px;
  color: #006ffd;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  font-family: BMHP;
}

.gender-btn.selected,
.gender-btn:hover {
  background-color: #006ffd;
  color: white;
}

/* 회원가입 버튼 */
.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #006ffd;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: BMHP;
}

.submit-btn:hover {
  background-color: #0056cc;
}
</style>
