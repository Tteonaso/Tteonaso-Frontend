<template>
  <div id="ground">
    <h1 class="title" style="font-family: BMHP">로그인</h1>
    <p class="description" style="font-family: BMHA">서비스를 이용하기 위해서는 로그인해 주세요</p>
    <form class="form" @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="email">이메일</label>
        <input v-model="email" type="email" id="email" placeholder="이메일" />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input v-model="password" type="password" id="password" placeholder="비밀번호" />
      </div>
      <button type="submit" class="submit-btn">로그인</button>
    </form>

    <!-- 모달 컴포넌트 사용 -->
    <Modal :visible="isModalVisible" :content="modalMessage" @update:visible="isModalVisible = $event" />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from "@/layouts/Modal.vue";
import { useRouter } from 'vue-router'; // Vue Router 가져오기

const router = useRouter(); // useRouter 인스턴스 생성
const email = ref('');
const password = ref('');
const isModalVisible = ref(false);  // 모달의 가시성 상태
const modalMessage = ref('');

// 로그인 처리 함수
const handleLogin = async () => {
  const loginData = {
    email: email.value,
    password: password.value,
  };

  console.log(loginData);

  try {
    const response = await fetch('http://localhost:8080/member/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.ok && data.isSuccess) {
      console.log('로그인 성공:', data);

      // 성공 시 토큰을 localStorage에 저장
      const accessToken = data.result.accessToken;
      localStorage.setItem('accessToken', accessToken);

      router.push("/chatroom");


    } else {
      // 로그인 실패 시 메시지를 모달로 표시
      console.error('로그인 실패:', data);
      modalMessage.value = data.message;
      isModalVisible.value = true;

      // 로그인 실패 시 입력 필드 초기화
      email.value = '';
      password.value = '';
    }
  } catch (error) {
    console.error('로그인 요청 중 오류 발생:', error);
    modalMessage.value = '로그인 요청 중 오류가 발생했습니다. 다시 시도해주세요.';
    isModalVisible.value = true;
  }
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
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
}

.submit-btn:hover {
  background-color: #0056cc;
}

/* 모달 스타일 */
.modal {
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
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.modal button {
  background-color: #006ffd;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}

.modal button:hover {
  background-color: #0056cc;
}
</style>
