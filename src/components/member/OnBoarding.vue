<template>
  <div id="ground">
    <img src="../../assets/images/tteonaso.png" id="logo">
    <button class="btn" id="signin">로그인</button>
    <!-- id=signup 버튼 클릭 시 /signup 라우트로 이동 -->
    <button class="btn" id="signup" @click="goToSignUp">회원가입</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Vue Router 가져오기

const router = useRouter(); // useRouter 인스턴스 생성

// 회원가입 페이지로 이동하는 함수
const goToSignUp = () => {
  router.push('/signup'); // '/signup' 라우트로 이동
};
</script>

<style scoped>
#ground {
  display: flex; /* Flexbox 활성화 */
  flex-direction: column; /* 요소들을 세로로 정렬 */
  justify-content: center; /* 수직 가운데 정렬 */
  align-items: center; /* 수평 가운데 정렬 */
  width: 600px;
  height: 100vh; /* 화면 전체 높이 */
  margin: 0 auto; /* 가로 중앙 정렬 */
  background-color: #f5fbff;
}

#logo {
  width: 600px;
  margin-bottom: 20px; /* 로고 아래 마진 추가 */
}

.btn {
  width: 300px; /* 버튼의 고정 가로 길이 */
  height: 50px; /* 버튼의 고정 세로 길이 */
  margin: 10px 0; /* 세로로 적당한 마진 */
  background-color: #006ffd; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색상 */
  border: none; /* 버튼 테두리 제거 */
  border-radius: 8px; /* 버튼 모서리를 부드럽게 */
  font-size: 16px; /* 버튼 텍스트 크기 */
  cursor: pointer; /* 마우스 커서 변경 */
  transition: background-color 0.3s ease; /* 호버 시 배경색 부드럽게 변화 */
}

.btn:hover {
  background-color: #0056cc; /* 버튼 호버 시 색상 변경 */
}
</style>
