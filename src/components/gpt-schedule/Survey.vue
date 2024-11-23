<template>
  <div class="container">
    <div class="survey-container">
      <h1>
        <i :class="getIcon(currentQuestion)"></i>
      </h1>

      <div class="progress-bar-container">
        <div 
          class="progress-bar-segment" 
          v-for="(segment, index) in questions.length" 
          :key="index" 
          :class="{ active: index <= currentQuestion }"
        ></div>
      </div>
      <Question 
        v-if="currentQuestion < questions.length" 
        :question="questions[currentQuestion]" 
        :onSelect="handleSelect"
        :selectedAnswers="selectedAnswers[currentQuestion] || []"
        class="question-margin"
      />
      <div class="button-container" v-if="currentQuestion < questions.length">
        <button 
          v-for="option in questions[currentQuestion].options" 
          :key="option.name"
          class="option-button" 
          :class="{ selected: selectedAnswers[currentQuestion]?.includes(option.name) }"
          @click="handleSelect(option.name)"
        >
          {{ option.description }}
        </button>
      </div>
      <div class="navigation-buttons">
        <button 
          v-if="currentQuestion < questions.length - 1" 
          class="next-button" 
          @click="goToNextQuestion"
        >
          다음
        </button>
        <button 
          v-if="currentQuestion === questions.length - 1" 
          class="next-button" 
          @click="finishSurvey"
        >
          완료
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSurveyStore } from '@/store/survey';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Question from './Question.vue';
import axios from 'axios';

const router = useRouter();
const questions = ref([]);
const currentQuestion = ref(0);
const selectedAnswers = ref([]);

// 질문을 서버에서 받아오는 함수
const fetchQuestions = async () => {
  try {
    const destinationsResponse = await axios.get('http://localhost:8080/api/destinations');
    const travelDurationsResponse = await axios.get('http://localhost:8080/api/travel-durations');
    const companionsResponse = await axios.get('http://localhost:8080/api/companions');
    const travelStylesResponse = await axios.get('http://localhost:8080/api/travel-styles');
    const schedulePreferencesResponse = await axios.get('http://localhost:8080/api/schedule-preferences');

    // 질문 배열 구성
    questions.value = [
      {
        title: '여행가고 싶은 도시는?',
        description: '도시 1곳을 선택해주세요',
        options: destinationsResponse.data.result.map(dest => ({ name: dest.name, description: dest.description })),
        multiple: false, // 단일 선택
        icon: 'fas fa-plane-departure' // 아이콘 추가
      },
      {
        title: '여행 기간은?',
        description: '여행 기간을 선택해주세요',
        options: travelDurationsResponse.data.result.map(duration => ({ name: duration.name, description: duration.description })),
        multiple: false, // 단일 선택
        icon: 'fas fa-calendar-alt' // 아이콘 추가
      },
      {
        title: '동행자는?',
        description: '동행자를 선택해주세요',
        options: companionsResponse.data.result.map(companion => ({ name: companion.name, description: companion.description })),
        multiple: false, // 단일 선택
        icon: 'fas fa-user-friends' // 아이콘 추가
      },
      {
        title: '여행 스타일은?',
        description: '여행 스타일을 선택해주세요 (복수 선택 가능)',
        options: travelStylesResponse.data.result.map(style => ({ name: style.name, description: style.description })),
        multiple: true, // 여러 선택 가능
        icon: 'fas fa-suitcase' // 아이콘 추가
      },
      {
        title: '일정 선호도는?',
        description: '선호 일정을 선택해주세요',
        options: schedulePreferencesResponse.data.result.map(pref => ({ name: pref.name, description: pref.description })),
        multiple: false, // 단일 선택
        icon: 'fas fa-clock' // 아이콘 추가
      }
    ];
    
    // selectedAnswers 초기화
    selectedAnswers.value = Array(questions.value.length).fill([]).map(() => []);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

// 현재 질문에 맞는 아이콘을 반환하는 함수
const getIcon = (index) => {
  return questions.value[index]?.icon || 'fas fa-question'; // 기본 아이콘 설정
};

// 선택 처리 함수
const handleSelect = (optionName) => {
  if (questions.value[currentQuestion.value].multiple) {
    const index = selectedAnswers.value[currentQuestion.value]?.indexOf(optionName);
    if (index === -1) {
      selectedAnswers.value[currentQuestion.value].push(optionName);
    } else {
      selectedAnswers.value[currentQuestion.value].splice(index, 1);
    }
  } else {
    selectedAnswers.value[currentQuestion.value] = [optionName];
  }
};

// 답변 확인 함수
const checkAnswers = () => {
  if (selectedAnswers.value[currentQuestion.value].length === 0) {
    alert('해당 질문에 답변해 주세요.'); // 선택되지 않았을 경우 경고
    return false;
  }
  return true;
};

// 다음 질문으로 이동
const goToNextQuestion = () => {
  if (checkAnswers()) {
    currentQuestion.value++;
  }
};

const finishSurvey = () => {
  const surveyStore = useSurveyStore();

  // 요청 데이터 구성
  const requestData = {
    departureCity: selectedAnswers.value[0][0] || '',
    travelDuration: selectedAnswers.value[1][0] || '',
    companions: selectedAnswers.value[2][0] || '',
    travelStyles: Array.from(selectedAnswers.value[3] || []),
    schedulePreference: selectedAnswers.value[4][0] || ''
  };

  // 마지막 질문 체크
  if (selectedAnswers.value[4].length === 0) { // 5번째 질문이 체크되지 않았을 경우
    alert('일정 선호도를 선택해 주세요.'); // 경고 메시지
    return; // 함수 종료
  }

  // Store에 데이터 저장
  surveyStore.setRequestData(requestData);

  // 추천 페이지로 이동
  router.push({ name: 'Recommendation' }).catch(err => {
    console.error('Error navigating to Recommendation:', err);
  });
};

onMounted(fetchQuestions);
</script>

<style scoped>
.container {
  width: 600px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
}

.survey-container {
  flex: 1; /* 남은 공간을 차지하도록 설정 */
  margin-top: 5%; /* 제목과 질문 사이의 마진을 절반으로 줄임 */
  margin-bottom: 10%;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: space-between; /* 공간을 균등하게 분배 */
}

.question-margin {
  margin-top: 20px; /* 여백 조정 */
  font-family: "NanumG";
}

.progress-bar-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 0; /* 상하 여백 */
  width: 100%; /* 부모 너비에 맞춤 */
  height: 20px; /* Progress Bar 높이 */
}

.progress-bar-segment {
  flex: 1; /* 각 segment 동일한 크기 */
  margin: 0 2px; /* 각 segment 간 간격 */
  background-color: #e0e0e0; /* 기본 회색 */
  border-radius: 5px;
  transition: background-color 0.3s; /* 색상 변경 애니메이션 */
}

.progress-bar-segment.active {
  background-color: #28a745; /* 활성화된 연두색 */
}

.button-container {
  display: flex;
  flex-wrap: wrap; /* 버튼을 여러 줄로 감싸기 */
  justify-content: center; /* 중앙 정렬 */
  margin-top: 30px; /* 버튼과 질문 사이의 여백을 절반으로 줄임 */
}

.option-button {
  flex: 1 1 30%; /* 버튼을 한 줄에 3개씩 배치 (너비 조정) */
  margin: 5px; /* 버튼 간의 여백 */
  padding: 15px; /* 패딩을 늘려서 버튼 크기 통일 */
  border: none;
  border-radius: 8px;
  background-color: #d4edda; /* 연한 배경색 */
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.option-button.selected {
  background-color: #0056b3; /* 선택된 버튼 색상 */
  color: white; /* 선택된 버튼 텍스트 색상 */
}

.option-button:hover {
  background-color: #c3e6cb; /* 호버 시 색상 변경 */
}

.navigation-buttons {
  margin-top: auto; /* 버튼을 맨 아래로 이동 */
}

.next-button {
  width: 100%; /* 버튼을 전체 너비로 설정 */
  padding: 15px;
  border: none;
  border-radius: 8px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.next-button:hover {
  background-color: #218838;
}
</style>