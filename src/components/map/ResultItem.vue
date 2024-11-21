<template>
  <div class="result-item">
    <div class="icon">
      <i :class="getIconClass(item.category_group_code)"></i>
    </div>
    <div class="details">
      <h3 class="place-name">{{ item.place_name }}</h3>
      <p class="address">{{ item.road_address_name }}</p>
      <p class="phone" v-if="item.phone">{{ item.phone }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  item: Object
});

// 카테고리 그룹 코드에 따라 아이콘 클래스 반환
const getIconClass = (categoryGroupCode) => {
  switch (categoryGroupCode) {
    case 'MT1': // 대형마트
      return 'fas fa-store';
    case 'CS2': // 편의점
      return 'fas fa-store-alt';
    case 'PS3': // 어린이집, 유치원
      return 'fas fa-child';
    case 'SC4': // 학교
      return 'fas fa-school';
    case 'AC5': // 학원
      return 'fas fa-graduation-cap';
    case 'PK6': // 주유소, 충전소
      return 'fas fa-gas-pump';
    case 'SW8': // 지하철역
      return 'fas fa-subway';
    case 'BK9': // 은행
      return 'fas fa-university';
    case 'CT1': // 문화시설
      return 'fas fa-theater-masks';
    case 'AG2': // 중개업소
      return 'fas fa-building';
    case 'PO3': // 공공기관
      return 'fas fa-building-o';
    case 'AT4': // 관광명소
      return 'fas fa-map-signs';
    case 'AD5': // 숙박
      return 'fas fa-bed';
    case 'FD6': // 음식점
      return 'fas fa-utensils';
    case 'CE7': // 카페
      return 'fas fa-coffee';
    case 'HP8': // 병원
      return 'fas fa-hospital';
    case 'PM9': // 약국
      return 'fas fa-pills';
    default:
      return 'fas fa-map-marker-alt'; // 기본 아이콘
  }
};
</script>

<style scoped>
.result-item {
  display: flex;
  align-items: flex-start; /* 아이콘과 텍스트를 위쪽 정렬 */
  padding-left: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 3px;
}

.icon {
  margin-top: 20px;
  margin-right: 20px;
}

.icon i {
  font-size: 24px; /* 아이콘 크기 조정 */
  color: #ccc; /* 아이콘 색상 변경 */
}

.details {
  flex: 1;
  min-height: 130px; /* 고정 높이 설정 */
  max-height: 130px;
  overflow: hidden;
}

.place-name {
  font-family: 'BMD';
  font-size: 20px; /* 폰트 크기 설정 */
  font-weight: bold; /* 폰트 두께 설정 */
}

.address {
  margin: 3px 0;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
  font-family: 'BMHA';
  font-size: 14px;
}

.phone {
  margin: 0;
  font-family: 'BMHA';
  font-size: 12px;
}
</style>