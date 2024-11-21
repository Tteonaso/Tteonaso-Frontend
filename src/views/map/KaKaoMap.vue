<template>
  <div class="container">
    <div class="search-container">
      <input 
        v-model="searchKeyword" 
        placeholder="검색어를 입력하세요" 
        class="search-input"
        @keyup.enter="performSearch"
      />
      <button @click="performSearch" class="search-button">
        <i class="fas fa-search"></i>
      </button>
      <button @click="navigateToFilter" class="filter-toggle-button">
        <i class="fas fa-filter"></i>
      </button>
      <button @click="navigateToSearchPage" class="search-page-button">
        <i class="fas fa-list-alt"></i>
      </button>
    </div>
    <div ref="mapContainer" class="mapContainer"></div>
    <div v-if="totalCount > 0" class="pagination">
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        이전
      </button>
      <button 
        v-for="page in pagination.pages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
        class="page-number"
      >
        {{ page }}
      </button>
      <button 
        @click="goToPage(currentPage + 1)" 
        :disabled="currentPage >= pagination.totalPages"
        class="pagination-button"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const mapContainer = ref(null);
const map = ref(null);
const ps = ref(null);
const markers = ref([]);
const searchKeyword = ref(route.query.keyword || "");
const initialTown = ref(route.query.town || "");
const initialCategory = ref(route.query.category || "");
const currentPage = ref(parseInt(route.query.page) || 1);
const totalCount = ref(0);
const itemsPerPage = 10; // 10개씩 출력
const infowindow = ref(null);

const pagination = computed(() => {
  const totalPages = Math.ceil(totalCount.value / itemsPerPage);
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);
  return {
    totalPages: Math.min(totalPages, 5),
    pages,
  };
});

// URL 변경 감지
watch(
  () => route.query,
  (newQuery) => {
    currentPage.value = Math.min(parseInt(newQuery.page) || 1, 5); // 5페이지로 고정
    searchKeyword.value = newQuery.keyword || "";
    performSearch();
  }
);

const navigateToFilter = () => {
  router.push({ name: 'FilterMapPage' });
};

const navigateToSearchPage = () => {
  router.push({
    name: 'SearchPage',
    query: { 
      town: initialTown.value, 
      category: initialCategory.value, 
      keyword: searchKeyword.value,
      page: currentPage.value.toString()
    }
  });
};

const constructSearchQuery = () => {
  let query = '';
  if (initialTown.value) {
    query += initialTown.value;
  }
  if (searchKeyword.value) {
    query += query ? ` ${searchKeyword.value}` : searchKeyword.value;
  }
  return query.trim() || initialTown.value || '서울';
};

const performSearch = async () => {
  const query = constructSearchQuery();
  await searchPlaces(query, currentPage.value);
};

const goToPage = async (page) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  currentPage.value = page;
  const query = constructSearchQuery();
  await searchPlaces(query, page);
};

const searchPlaces = async (query, page = 1) => {
  const category = initialCategory.value;
  const apiKey = import.meta.env.VITE_APP_KAKAO_REST_API_KEY;
  
  let searchUrl = 'https://dapi.kakao.com/v2/local/search/keyword.json?';
  const params = new URLSearchParams();
  
  params.append('query', query);
  if (category) {
    params.append('category_group_code', category);
  }
  
  params.append('size', itemsPerPage.toString());
  params.append('page', page.toString()); // 페이지 추가

  try {
    const response = await fetch(searchUrl + params.toString(), {
      headers: {
        Authorization: `KakaoAK ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("검색 결과:", data);

    if (data.documents && data.documents.length > 0) {
      displayPlaces(data.documents);
      totalCount.value = Math.min(data.meta.total_count, 675);
      updateQueryParams(searchKeyword.value, category, page);
    } else {
      console.error("검색 결과가 없습니다.");
      clearMarkers();
      totalCount.value = 0;
    }
  } catch (error) {
    console.error("Error fetching places:", error);
    clearMarkers();
    totalCount.value = 0;
  }
};

const updateQueryParams = (query, category, page) => {
  router.push({
    query: {
      ...route.query,
      keyword: query || undefined,
      category: category || undefined,
      town: initialTown.value || undefined,
      page: page.toString()
    }
  });
};

// displayPlaces 함수 수정
const displayPlaces = (places) => {
  clearMarkers();
  const bounds = new kakao.maps.LatLngBounds();

  places.forEach((place) => {
    const marker = new kakao.maps.Marker({
      map: map.value,
      position: new kakao.maps.LatLng(place.y, place.x),
    });

    markers.value.push(marker);
    bounds.extend(new kakao.maps.LatLng(place.y, place.x));

    // 마커에 클릭 이벤트 추가
    kakao.maps.event.addListener(marker, 'click', () => {
      // 이미 열린 인포윈도우가 있다면 닫기
      if (infowindow.value) {
        infowindow.value.close();
      }

      // 정보창 내용 구성
      const content = `
        <div style="width: 200px; background: white; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); overflow: hidden;">
          <div style="background: #e3f2fd; padding: 8px 12px; position: relative;">
            <h3 style="margin: 0; font-size: 13px; color: #1976d2; font-weight: 500; padding-right: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${place.place_name}</h3>
            <button onclick="closeInfoWindow()" style="position: absolute; top: 50%; right: 8px; transform: translateY(-50%); background: none; border: none; color: #64b5f6; font-size: 18px; cursor: pointer; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">×</button>
          </div>
          <div style="padding: 8px 12px;">
            ${place.category_name ? 
              `<div style="font-size: 11px; color: #666; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">${place.category_name}</div>` : ''}
            ${place.road_address_name ? 
              `<div style="font-size: 11px; color: #333; margin: 4px 0;">
                <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='%23666' width='8' height='8'%3E%3Cpath d='M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z'/%3E%3C/svg%3E" style="vertical-align: middle; margin-right: 4px;">
                <span style="vertical-align: middle;">${place.road_address_name}</span>
              </div>` : ''}
            ${place.phone ? 
              `<div style="font-size: 11px; color: #2196f3; margin: 4px 0;">
                <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%232196f3' width='8' height='8'%3E%3Cpath d='M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z'/%3E%3C/svg%3E" style="vertical-align: middle; margin-right: 4px;">
                <span style="vertical-align: middle;">☎ ${place.phone}</span>
              </div>` : ''}
            ${place.place_url ? 
              `<a href="${place.place_url}" target="_blank" style="display: inline-block; margin-top: 6px; padding: 4px 8px; background: #2196f3; color: white; text-decoration: none; border-radius: 3px; font-size: 11px;">상세보기</a>` : ''}
          </div>
        </div>
      `;

      infowindow.value.setContent(content);
      infowindow.value.open(map.value, marker);
    });

    // 지도 클릭 시 인포윈도우 닫기
    kakao.maps.event.addListener(map.value, 'click', () => {
      infowindow.value.close();
    });
  });

  map.value.setBounds(bounds);
};

// 인포윈도우 닫기 함수 (전역에서 접근 가능하도록)
window.closeInfoWindow = () => {
  if (infowindow.value) {
    infowindow.value.close();
  }
};

const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

onMounted(() => {
  if (!mapContainer.value) return;

  const options = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  };

  map.value = new kakao.maps.Map(mapContainer.value, options);
  ps.value = new kakao.maps.services.Places();
  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 });

  const query = constructSearchQuery();
  if (query) {
    searchPlaces(query, currentPage.value);
  }
});
</script>

<style scoped>
@import '@/assets/css/map/map.css';
</style>