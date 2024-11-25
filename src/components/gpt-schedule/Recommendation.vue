<template>
  <div class="container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-container">
        <img src="@/assets/images/loading.gif" alt="Loading..." class="loading-gif" />
        <p class="loading-message">추천 일정을 계획하고 있습니다..</p>
        <p class="loading-message">잠시만 기다려주세요.</p>
      </div>
    </div>
    
    <div v-else>
      <div class="recommendation-header">
        <h1 class="main-title">AI 여행 일정 계획 결과</h1>
        <p class="subtitle">당신의 여행을 위한 맞춤형 추천 일정입니다.</p>
      </div>

      <div class="recommendation-container">
        <div v-if="isValid">
          <h2>추천 여행지</h2>
          <div class="recommendation-list">
            <div v-for="place in travelRecommendations" :key="place.placeName" class="recommendation-card">
              <div class="text-container">
                <div class="place-name">{{ place.placeName }}</div>
                <div class="place-info">{{ place.description }}</div>
                <div class="recommendation-reason">{{ place.recommendationReason }}</div>
              </div>
            </div>
          </div>
          <br/>

          <h2>제안된 일정</h2>
          <div class="itinerary-list">
            <div v-for="(itinerary, index) in suggestedItinerary" :key="index" class="itinerary-card">
              <div class="itinerary-text">{{ itinerary }}</div>
            </div>
          </div>
          <br/>

          <h2>추가 팁</h2>
          <div class="tips-list">
            <div v-for="(tip, index) in additionalTips" :key="index" class="tip-card">
              <div class="tip-text">{{ tip }}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>추천 정보를 가져오는 데 실패했습니다.</p>
        </div>
      </div>
    </div>
    
    <BottomNavigationBar v-if="!isLoading" />
  </div>
</template>

<script setup>
import { useSurveyStore } from '@/store/survey';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import BottomNavigationBar from "@/components/BottomNavigationBar.vue";

const surveyStore = useSurveyStore();
const router = useRouter();

const travelRecommendations = ref([]);
const suggestedItinerary = ref([]);
const additionalTips = ref([]);
const isValid = ref(false); // 초기값 false로 설정
const isLoading = ref(true); // 로딩 상태 초기화

onMounted(() => {
  const requestData = surveyStore.requestData; // Store에서 requestData 가져오기

  if (!requestData) {
    alert('추천 정보를 가져오는 데 실패했습니다. 설문 페이지로 돌아갑니다.');
    router.push({ name: 'Survey' });
    return;
  }

  // 서버 요청 로직 추가
  axios.post('http://localhost:8080/api/recommend', requestData)
    .then(response => {
      const data = response.data.result;
      travelRecommendations.value = data.travelRecommendations || [];
      suggestedItinerary.value = data.suggestedItinerary || [];
      additionalTips.value = data.additionalTips || [];

      // 유효성 검사
      isValid.value = travelRecommendations.value.length > 0 && suggestedItinerary.value.length > 0 && additionalTips.value.length > 0;
    })
    .catch(error => {
      console.error('추천 정보를 가져오는 데 실패했습니다:', error);
      alert('추천 정보를 가져오는 데 실패했습니다. 설문 페이지로 돌아갑니다.');
      router.push({ name: 'Survey' });
    })
    .finally(() => {
      isLoading.value = false; // 로딩 종료
    });
});
</script>

<style scoped>
.container {
  width: 90%; /* 너비를 90%로 설정하여 반응형 디자인 적용 */
  max-width: 600px; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 20px; /* 패딩 추가 */
  font-family: "NanumB"; /* 폰트 설정 변경 */
  background-color: #f9f9f9; /* 배경색 추가 */
  border-radius: 10px; /* 모서리 둥글게 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  height: 100vh; /* 전체 높이를 설정하여 맨 아래까지 확장 */
  overflow-y: auto; /* 세로 스크롤 가능 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
}

.container::-webkit-scrollbar {
  display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
}

.loading-overlay {
  position: fixed; /* 고정 위치 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8); /* 반투명 배경 */
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  z-index: 1000; /* 다른 요소 위에 표시 */
}

.recommendation-header {
  text-align: center; /* 중앙 정렬 */
  margin-bottom: 40px; /* 아래쪽 여백 */
}

.main-title {
  font-size: 32px; /* 제목 크기 */
  font-weight: bold; /* 두껍게 */
  color: #5c93f9; /* 제목 색상 */
}

.subtitle {
  font-size: 18px; /* 부제목 크기 */
  color: #b0b0b0; /* 부제목 색상 */
}

.recommendation-list, .itinerary-list, .tips-list {
  margin-top: 20px; /* 상단 여백 */
}

.tips-list {
  margin-bottom: 100px;
}

.recommendation-card, .itinerary-card, .tip-card {
  background-color: #ffffff; /* 카드 배경색 */
  border: 1px solid #e0e0e0; /* 카드 테두리 */
  border-radius: 8px; /* 카드 모서리 둥글게 */
  padding: 15px; /* 카드 내부 여백 */
  margin-bottom: 15px; /* 카드 간의 여백 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition: transform 0.2s; /* 호버 효과를 위한 트랜지션 */
}

.recommendation-card:hover, .itinerary-card:hover, .tip-card:hover {
  transform: translateY(-5px); /* 호버 시 카드 위로 이동 */
}

.place-name {
  font-size: 20px; /* 장소 이름 폰트 크기 */
  font-weight: bold; /* 두껍게 */
  color: #333; /* 텍스트 색상 */
}

.place-info {
  font-size: 14px; /* 장소 정보 폰트 크기 */
  color: gray; /* 텍스트 색상 */
}

.recommendation-reason {
  font-size: 12px; /* 추천 이유 폰트 크기 */
  color: #555; /* 텍스트 색상 */
}

.itinerary-text, .tip-text {
  font-size: 14px; /* 일정 및 팁 텍스트 폰트 크기 */
  color: #333; /* 텍스트 색상 */
}

h2 {
  color: #5c93f9; /* 제목 색상 */
  margin-top: 30px; /* 상단 여백 */
  font-size: 24px; /* 제목 크기 */
  border-bottom: 2px solid #5c93f9; /* 하단 테두리 추가 */
  padding-bottom: 5px; /* 하단 여백 */
}

@media (max-width: 600px) {
  .main-title {
    font-size: 24px; /* 작은 화면에서 제목 크기 조정 */
  }

  .subtitle {
    font-size: 14px; /* 작은 화면에서 부제목 크기 조정 */
  }

  .recommendation-card, .itinerary-card, .tip-card {
    padding: 10px; /* 작은 화면에서 카드 내부 여백 조정 */
  }
}
</style>