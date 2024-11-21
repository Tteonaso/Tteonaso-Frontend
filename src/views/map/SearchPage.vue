<template>
  <div class="container"> <!-- 바깥 div에 container 클래스 추가 -->
    <div class="search-page">
      <div class="search-header">
        <input v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
        <button @click="performSearch" class="search-button">
          <i class="fas fa-search"></i> 
        </button>
        <button @click="navigateToFilter" class="filter-button">
          <i class="fas fa-filter"></i>
        </button>
        <button @click="navigateToMap" class="map-button">
          <i class="fas fa-map"></i>
        </button>
      </div>

      <div v-if="isLoading" class="loading-indicator">
        검색중...
      </div>

      <div v-else class="results-container">
        <ResultItem 
          v-for="item in results" 
          :key="item.id" 
          :item="item" 
        />
      </div>

      <div v-if="!isLoading && results.length === 0" class="no-results">
        검색 결과가 없습니다.
      </div>
      
      <div class="pagination" v-if="pagination">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          이전
        </button>

        <!-- 페이지 번호들 -->
        <button 
          v-for="page in Array.from({ length: Math.min(pagination.totalPages, maxPages) }, (_, i) => i + 1)" 
          :key="page"
          @click="goToPage(page)"
          :class="{ active: page === currentPage }"
          class="page-number"
        >
          {{ page }}
        </button>

        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === pagination.totalPages"
          class="pagination-button"
        >
          다음
        </button>
      </div>
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
const currentPage = ref(parseInt(route.query.page) || 1);
const totalCount = ref(0);
const isLoading = ref(false);
const itemsPerPage = 10;
const maxPages = 5;

const pagination = computed(() => {
  const totalPages = Math.min(Math.ceil(totalCount.value / itemsPerPage), maxPages);
  return {
    totalPages, // totalPages를 반환
    currentPage: currentPage.value,
  };
});

const searchPlaces = async (query, page) => {
  if (!query) return;

  isLoading.value = true;
  const category = route.query.category || '';
  const town = route.query.town || '';
  const searchQuery = town ? `${town} ${query}` : query;

  const requestUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchQuery)}&category_group_code=${category}&page=${page}&size=${itemsPerPage}`;
  console.log('Request URL:', requestUrl);

  try {
    const response = await fetch(requestUrl,
      {
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_REST_API_KEY}`
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (data.documents && data.documents.length > 0) {
      results.value = data.documents; // 현재 페이지의 결과 저장
      totalCount.value = data.meta.total_count; // 전체 결과 수 저장
      updateQueryParams(page); // URL 파라미터 업데이트
    } else {
      results.value = [];
      totalCount.value = 0;
    }
  } catch (error) {
    console.error("Error fetching places:", error);
    results.value = [];
    totalCount.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const goToPage = async (page) => {
  try {
    if (page < 1 || page > maxPages) return; // 페이지 범위 체크
    currentPage.value = page; // 현재 페이지 업데이트
    await searchPlaces(searchKeyword.value, page); // 해당 페이지 데이터 요청
  } catch (error) {
    console.error("Error in goToPage:", error);
  }
};

// 검색 수행 시에도 새로운 요청
const performSearch = async () => {
  currentPage.value = 1; // 검색 시 첫 페이지로 초기화
  await searchPlaces(searchKeyword.value, currentPage.value); // 첫 페이지 데이터 요청
};

onMounted(() => {
  if (searchKeyword.value) {
    searchPlaces(searchKeyword.value, currentPage.value); // 초기 데이터 요청
  }
});

// Map 버튼 활성화 상태 유지
const navigateToMap = async () => {
  try {
    await router.push({
      name: 'MapPage',
      query: {
        keyword: searchKeyword.value || undefined,
        category: route.query.category || undefined,
        town: route.query.town || undefined,
        page: currentPage.value.toString() // 현재 페이지 정보 추가
      }
    });
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

// Filter 이동 함수 수정
const navigateToFilter = async () => {
  try {
    await router.push({
      name: 'FilterMapPage',
      query: {
        keyword: searchKeyword.value,
        category: route.query.category || '',
        town: route.query.town || ''
      }
    });
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

// URL 파라미터 업데이트 함수 수정
const updateQueryParams = async (page) => {
  try {
    await router.push({
      query: {
        ...route.query,
        page: page.toString(),
        keyword: searchKeyword.value
      }
    });
  } catch (error) {
    console.error('Query update error:', error);
  }
};
</script>

<style scoped>
@import '@/assets/css/map/search.css';
</style>