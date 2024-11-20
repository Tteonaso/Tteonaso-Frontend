<template>
  <div id="ground">
    <ChatRoomList></ChatRoomList>
  </div>

</template>

<script setup>
import ChatRoomList from "@/components/chatroom/ChatRoomList.vue";
</script>

<style scoped>
/* 전체 페이지 중앙 정렬 */
#ground {
  width: 600px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9fafc;
}
</style>
