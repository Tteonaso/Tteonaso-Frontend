<template>
  <div class="search-page">
    <div class="search-header">
      <input v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
      <button @click="performSearch" class="search-button">검색</button>
      <button @click="navigateToFilter" class="filter-button">Filter</button>
      <button @click="navigateToMap" class="map-button">Map으로 이동</button>
    </div>
    <div class="results-container">
      <ResultItem v-for="item in paginatedResults" :key="item.id" :item="item" />
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ResultItem from '@/components/map/ResultItem.vue';

const router = useRouter();
const route = useRoute();

const searchKeyword = ref(route.query.keyword || "");
const results = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const totalCount = ref(0);

const totalPages = computed(() => {
  return totalCount.value > 0 ? Math.ceil(totalCount.value / itemsPerPage) : 1;
});

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return results.value.slice(start, end);
});

const performSearch = () => {
  searchPlaces(searchKeyword.value, currentPage.value);
};

const apiKey = import.meta.env.VITE_APP_KAKAO_REST_API_KEY;

const searchPlaces = (query, page) => {
  const category = route.query.category || '';
  fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&category_group_code=${category}&page=${page}&size=${itemsPerPage}`, {
    headers: {
      Authorization: `KakaoAK ${apiKey}` // 여기에 본인의 REST API 키를 입력하세요
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.documents && data.documents.length > 0) {
      results.value = data.documents;
      totalCount.value = data.meta.total_count; // 전체 결과 수 설정
    } else {
      results.value = [];
      totalCount.value = 0; // 결과가 없을 때 totalCount를 0으로 설정
      console.error("검색 결과가 없습니다.");
    }
  })
  .catch(error => console.error("Error fetching places:", error));
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    performSearch();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    performSearch();
  }
};

const navigateToFilter = () => {
  router.push({ name: 'FilterMapPage' });
};

const navigateToMap = () => {
  router.push({
    name: 'MapPage',
    query: { town: route.query.town, category: route.query.category, keyword: searchKeyword.value, page: currentPage.value }
  });
};

onMounted(() => {
  if (searchKeyword.value) {
    performSearch();
  }
});
</script>

<style scoped>
.search-page {
  width: 90%;
  margin: 0 auto;
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.search-input {
  width: 60%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-button, .filter-button, .map-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.results-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination span {
  line-height: 40px;
}
</style>
