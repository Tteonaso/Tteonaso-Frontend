<template>
  <div id="ground">
    <h3 style="font-family: BMHP">지역별 채팅방</h3>
    <ChatRoomList></ChatRoomList>
    <BottomNavigationBar></BottomNavigationBar>
  </div>

</template>

<script setup>
import SearchBar from "@/components/chatroom/SearchBar.vue";
import ChatRoomList from "@/components/chatroom/ChatRoomList.vue";
import BottomNavigationBar from "@/components/BottomNavigationBar.vue";

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
