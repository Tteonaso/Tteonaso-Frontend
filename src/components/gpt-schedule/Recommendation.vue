<template>
  <div class="container">
    <div class="recommendation-container">
      <div v-if="isLoading" class="loading-container">
        <img src="@/assets/images/loading.gif" alt="Loading..." class="loading-gif" />
        <p class="loading-message">추천 일정을 계획하고 있습니다..</p>
        <p class="loading-message">잠시만 기다려주세요.</p>
      </div>
      <div v-else-if="isValid">
        <h2>추천 여행지</h2>
        <ul>
          <li v-for="place in travelRecommendations" :key="place.placeName">
            <strong>{{ place.placeName }}</strong>: {{ place.description }} ({{ place.recommendationReason }})
          </li>
        </ul>
        <h2>제안된 일정</h2>
        <ul>
          <li v-for="(itinerary, index) in suggestedItinerary" :key="index">{{ itinerary }}</li>
        </ul>
        <h2>추가 팁</h2>
        <ul>
          <li v-for="(tip, index) in additionalTips" :key="index">{{ tip }}</li>
        </ul>
      </div>
      <div v-else>
        <p>추천 정보를 가져오는 데 실패했습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSurveyStore } from '@/store/survey';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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
  width: 600px; /* 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 20px; /* 패딩 추가 */
  font-family: "NanumG"; /* 폰트 설정 */
}

.loading-container {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: center; /* 중앙 정렬 */
  justify-content: center; /* 중앙 정렬 */
  height: 100%; /* 부모 높이에 맞춤 */
  margin-top: 30%; /* 위쪽 마진 30% 설정 */
}

.loading-gif {
  display: block;
  margin: 0 auto; /* 중앙 정렬 */
  width: 300px; /* GIF 너비 조정 */
  height: auto; /* 높이는 자동으로 조정 */
}

.loading-message {
  margin-top: 10px; /* 메시지와 GIF 간의 여백 */
  text-align: center; /* 텍스트 중앙 정렬 */
  font-family: "BMD";
  font-size: 20px;
  color: #28a745;
}

h2 {
  color: #28a745; /* 제목 색상 */
}

ul {
  list-style-type: none; /* 기본 리스트 스타일 제거 */
  padding: 0;
}

li {
  margin: 10px 0; /* 리스트 항목 간의 여백 */
}
</style>