<template>
  <div class="filter-container">
    <div class="filter-header">
      <button @click="clearAll" class="header-button">Clear All</button>
      <h1>Filter</h1>
      <button @click="applyFilter" class="header-button">필터 적용</button>
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
          <option v-for="town in towns" :key="town.id" :value="town.id">
            {{ town.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="filter-section">
      <h2>카테고리</h2>
      <div class="custom-select">
        <select v-model="selectedCategory">
          <option value="" disabled selected>카테고리를 선택하세요</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="apply-filter-button" @click="applyFilter">
      필터 적용
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

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
  { id: "1", name: "카페" },
  { id: "2", name: "음식점" },
]);

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
};

const fetchDistricts = () => {
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
      if (data.response.body.items.item) {
        districts.value = data.response.body.items.item.map(item => ({
          id: item.code,
          name: item.name
        }));
      } else {
        districts.value = [];
        console.error("No district data found.");
      }
    })
    .catch(error => console.error("Error fetching districts:", error));
};

</script>

<style scoped>
@import '@/assets/css/map/filter.css';
</style>
