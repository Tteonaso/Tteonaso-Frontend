<template>
  <div id="ground">
    <h1 class="title">회원 가입</h1>
    <p class="description">계정을 만들어 떠나쏘 서비스를 이용할 수 있어요</p>
    <form class="form">
      <div class="input-group">
        <label for="name">이름</label>
        <input type="text" id="name" placeholder="이름" />
      </div>
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" id="email" placeholder="이메일" />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" placeholder="비밀번호" />
      </div>
      <div class="input-group">
        <label for="confirm-password">비밀번호 확인</label>
        <input type="password" id="confirm-password" placeholder="비밀번호 확인" />
      </div>
      <div class="input-group">
        <label for="age">나이</label>
        <input type="number" id="age" placeholder="나이" />
      </div>
      <div class="input-group">
        <label for="phone">전화번호</label>
        <input type="tel" id="phone" placeholder="전화번호" />
      </div>
      <div class="input-group">
        <label>성별</label>
        <div class="gender-group">
          <button type="button" class="gender-btn">여성</button>
          <button type="button" class="gender-btn">남성</button>
        </div>
      </div>
      <button type="submit" class="submit-btn">회원가입</button>
    </form>
  </div>
</template>

<script setup>
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
}

/* 설명 텍스트 */
.description {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
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
}

.input-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
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
</style>
