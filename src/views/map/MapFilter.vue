<template>
  <div class="filter-container">
    <div class="filter-header">
      <button @click="clearAll" class="header-button">Clear All</button>
      <h1>Filter</h1>
      <button @click="cancelFilter" class="header-button">필터 취소</button>
    </div>
    <div class="filter-section">
      <h2>지역</h2>
      <div class="custom-select">
        <select v-model="selectedCity" @change="fetchDistricts">
          <option value="" disabled selected>시/도를 선택하세요</option>
          <option v-for="city in cities" :key="city.id" :value="city.name">
            {{ city.name }}
          </option>
        </select>
        <select v-model="selectedDistrict" @change="fetchTowns" :disabled="!selectedCity">
          <option value="" disabled selected>구/군을 선택하세요</option>
          <option v-for="district in districts" :key="district.id" :value="district.id">
            {{ district.name }}
          </option>
        </select>
        <select v-model="selectedTown" :disabled="!selectedDistrict">
          <option value="" disabled selected>동을 선택하세요</option>
          <option v-for="town in towns" :key="town.id" :value="town.name">
            {{ town.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="filter-section">
      <h2>카테고리</h2>
      <div class="category-buttons">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="{'active': selectedCategory === category.id}"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <div class="apply-filter-button" @click="applyFilter">
      필터 적용
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["apply"]);
const router = useRouter();

const selectedCity = ref("");
const selectedDistrict = ref("");
const selectedTown = ref("");
const selectedCategory = ref("");

const cities = ref([
  { id: "1", name: "서울특별시" },
  { id: "2", name: "인천광역시" },
  { id: "3", name: "대전광역시" },
  { id: "4", name: "대구광역시" },
  { id: "5", name: "광주광역시" },
  { id: "6", name: "부산광역시" },
  { id: "7", name: "울산광역시" },
  { id: "8", name: "세종특별자치시" },
  { id: "31", name: "경기도" },
  { id: "32", name: "강원도" },
  { id: "33", name: "충청북도" },
  { id: "34", name: "충청남도" },
  { id: "35", name: "전라북도" },
  { id: "36", name: "전라남도" },
  { id: "37", name: "경상북도" },
  { id: "38", name: "경상남도" },
  { id: "39", name: "제주특별자치도" }
]);

const districts = ref([]);
const towns = ref([]);

const categories = ref([
  { id: "MT1", name: "대형마트" },
  { id: "CS2", name: "편의점" },
  { id: "PS3", name: "어린이집, 유치원" },
  { id: "SC4", name: "학교" },
  { id: "AC5", name: "학원" },
  { id: "PK6", name: "주유소, 충전소" },
  { id: "SW8", name: "지하철역" },
  { id: "BK9", name: "은행" },
  { id: "CT1", name: "문화시설" },
  { id: "AG2", name: "공공기관" },
  { id: "PO3", name: "대형마트" },
  { id: "AT4", name: "관광명소" },
  { id: "AD5", name: "숙박" },
  { id: "FD6", name: "음식점" },
  { id: "CE7", name: "카페" },
  { id: "HP8", name: "병원" },
  { id: "PM9", name: "약국" },
]);

const selectCategory = (categoryId) => {
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = ""; // 동일한 카테고리 클릭 시 선택 취소
  } else {
    selectedCategory.value = categoryId; // 새 카테고리 선택
  }

};

const clearAll = () => {
  selectedCity.value = "";
  selectedDistrict.value = "";
  selectedTown.value = "";
  selectedCategory.value = "";
};

const applyFilter = () => {
  console.log('선택된 시/도:', selectedCity.value);
  console.log('선택된 구/군:', selectedDistrict.value);
  console.log('선택된 동:', selectedTown.value);
  console.log('선택된 카테고리:', selectedCategory.value);

  // 선택된 필터 데이터를 부모 컴포넌트로 전달
  emit("apply", {
    selectedTown: selectedTown.value,
    category: selectedCategory.value
  });

  router.push({
    name: 'MapPage',
    query: { town: selectedTown.value, category: selectedCategory.value }
  });
};

const cancelFilter = () => {
  // 현재 쿼리 파라미터를 그대로 사용하여 MapPage로 이동
  router.push({
    name: 'MapPage',
    query: { town: selectedTown.value, category: selectedCategory.value }
  });
};

const fetchDistricts = () => {
  // 시/도 변경 시 구/군 및 동 초기화
  selectedDistrict.value = "";
  selectedTown.value = "";
  districts.value = [];
  towns.value = [];

  const selectedCityId = cities.value.find(city => city.name === selectedCity.value)?.id;
  if (!selectedCityId) {
    console.error("City not found for selected city name:", selectedCity.value);
    return;
  }

  const url = `http://localhost:8080/map/address/sido?sidoName=${selectedCity.value}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // JSON으로 직접 파싱
    })
    .then(data => {
      console.log("API 응답:", data); // 응답 본문 출력
      if (data.result && data.result.gugunNames) {
        districts.value = data.result.gugunNames.map((name, index) => ({
          id: index.toString(), // 인덱스를 id로 사용
          name: name
        }));
      } else {
        districts.value = [];
        console.error("No district data found.");
      }
    })
    .catch(error => console.error("Error fetching districts:", error));
};

const fetchTowns = () => {
  // 구/군 변경 시 동 초기화
  selectedTown.value = "";
  towns.value = [];

  const selectedDistrictName = districts.value.find(district => district.id === selectedDistrict.value)?.name;
  if (!selectedDistrictName) {
    console.error("District not found for selected district ID:", selectedDistrict.value);
    return;
  }

  const url = `http://localhost:8080/map/address/gugun?gugunName=${encodeURIComponent(selectedDistrictName)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // JSON으로 직접 파싱
    })
    .then(data => {
      console.log("API 응답:", data); // 응답 본문 출력
      if (data.result && data.result.dongNames) {
        towns.value = data.result.dongNames.map((name, index) => ({
          id: index.toString(), // 인덱스를 id로 사용
          name: name
        }));
      } else {
        towns.value = [];
        console.error("No town data found.");
      }
    })
    .catch(error => console.error("Error fetching towns:", error));
};
</script>

<style scoped>
@import '@/assets/css/map/filter.css';
</style>
