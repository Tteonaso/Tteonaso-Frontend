<template>
  <div class="search-bar">
    <input
      type="text"
      placeholder="검색하기"
      class="search-input"
    />
    <button class="search-button">
      <img
        src="../../assets/images/searchIcon.png"
        alt="검색"
        class="search-icon"
      />
    </button>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* 검색바 컨테이너 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #f9fafc;
  border: 1px solid #ddd;
  border-radius: 24px;
  padding: 8px 16px;
  width: 80%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 검색 입력 필드 */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: transparent;
  padding: 8px;
  font-family: BMHA;
}

/* 검색 버튼 */
.search-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 돋보기 아이콘 */
.search-icon {
  width: 20px;
  height: 20px;
}
</style>
