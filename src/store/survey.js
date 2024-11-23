// src/stores/surveyStore.js
import { defineStore } from 'pinia';

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    requestData: null // 데이터를 저장할 상태
  }),
  actions: {
    setRequestData(data) {
      this.requestData = data;
    }
  }
});
