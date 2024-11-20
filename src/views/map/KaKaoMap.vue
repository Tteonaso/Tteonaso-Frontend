<template>
  <div class="container">
    <div ref="mapContainer" class="mapContainer"></div>
    <div class="search-container">
      <input v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
      <button @click="performSearch" class="search-button">검색</button>
      <button @click="navigateToFilter" class="filter-toggle-button">필터</button>
      <button @click="navigateToSearchPage" class="search-page-button">SearchPage로 이동</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const mapContainer = ref(null);
const map = ref(null);
const ps = ref(null);
const markers = ref([]);
const searchKeyword = ref(""); // 검색어를 저장할 ref

// 초기 쿼리 파라미터에서 값 가져오기
const initialTown = ref("");
const initialCategory = ref("");

// 필터 페이지로 이동
const navigateToFilter = () => {
  router.push({ name: 'FilterMapPage' });
};

const navigateToSearchPage = () => {
  router.push({
    name: 'SearchPage',
    query: { town: initialTown.value, category: initialCategory.value, keyword: searchKeyword.value }
  });
};


onMounted(() => {
  // 쿼리 파라미터에서 값 가져오기
  initialTown.value = route.query.town || "";
  initialCategory.value = route.query.category || "";

  if (!mapContainer.value) return;

  const options = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  };

  map.value = new kakao.maps.Map(mapContainer.value, options);
  ps.value = new kakao.maps.services.Places();
});

// 검색 수행
const performSearch = () => {
  const query = `${initialTown.value} ${searchKeyword.value}`;
  searchPlaces(query);
};

// 장소 검색 함수
const searchPlaces = (query) => {
  const category = initialCategory.value;
  const apiKey = import.meta.env.VITE_APP_KAKAO_REST_API_KEY;
  console.log(query);

  // 카카오 REST API 호출
  fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&category_group_code=${category}`, {
    headers: {
      Authorization: `KakaoAK ${apiKey}` // 여기에 본인의 REST API 키를 입력하세요
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log("검색 결과:", data);
    if (data.documents) {
      displayPlaces(data.documents);
    } else {
      console.error("검색 결과가 없습니다.");
    }
  })
  .catch(error => console.error("Error fetching places:", error));
};

// 마커 표시
const displayPlaces = (places) => {
  clearMarkers(); // 기존 마커 삭제
  const bounds = new kakao.maps.LatLngBounds();

  places.forEach((place) => {
    const marker = new kakao.maps.Marker({
      map: map.value,
      position: new kakao.maps.LatLng(place.y, place.x),
    });

    markers.value.push(marker);
    bounds.extend(new kakao.maps.LatLng(place.y, place.x));
  });

  map.value.setBounds(bounds);
};

// 마커 삭제
const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

const testConsole = () => {
  console.log("선택된 동:", initialTown.value);
  console.log("선택된 카테고리:", initialCategory.value);
};
</script>

<style scoped>
@import '@/assets/css/map/map.css';
</style>
