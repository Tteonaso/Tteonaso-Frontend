<template>
  <div>
    <div ref="mapContainer" class="mapContainer"></div>
    <button @click="goToFilterPage">필터</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const mapContainer = ref(null);
const map = ref(null);
const ps = ref(null);
const currentCenter = ref(null);
const router = useRouter();

const goToFilterPage = () => {
  router.push({ name: 'FilterMapPage' });
};

const props = defineProps({
  category: String,
});

onMounted(() => {
  if (!mapContainer.value) return;

  const options = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  };
  map.value = new kakao.maps.Map(mapContainer.value, options);
  ps.value = new kakao.maps.services.Places();
  currentCenter.value = map.value.getCenter();
});

watch(() => props.category, (newCategory) => {
  if (newCategory) {
    applyFilter(newCategory);
  }
});

const applyFilter = (category) => {
  const center = map.value.getCenter();
  const options = {
    location: center,
    radius: 5000,
    category_group_code: category,
  };

  ps.value.categorySearch(category, (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      displayPlaces(data);
    } else {
      alert("검색 결과가 없습니다.");
    }
  }, options);
};

const reloadPlaces = () => {
  map.value.setCenter(currentCenter.value);
  applyFilter(props.category);
};

const displayPlaces = (places) => {
  const bounds = new kakao.maps.LatLngBounds();

  places.forEach(place => {
    const marker = new kakao.maps.Marker({
      map: map.value,
      position: new kakao.maps.LatLng(place.y, place.x),
    });

    bounds.extend(new kakao.maps.LatLng(place.y, place.x));
  });

  map.value.setBounds(bounds);
};
</script>

<style scoped>
.mapContainer {
  width: 100%;
  height: calc(100vh - 70px);
}
</style>
