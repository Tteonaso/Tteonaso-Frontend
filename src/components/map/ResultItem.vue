<template>
  <div class="result-item">
    <img :src="item.image_url || 'placeholder.png'" alt="이미지" class="result-image" />
    <div class="result-info">
      <h3>{{ item.place_name }}</h3>
      <p>{{ item.category_name }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['item']);
</script>

<style scoped>
.result-item {
  width: 45%;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.result-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.result-info {
  flex: 1;
}
</style>
