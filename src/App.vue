<template>
  <div>
    <navNewsVue />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import navNewsVue from "./layout/nav-news.vue";

export default defineComponent({
  name: "App",
  components: {
    navNewsVue,
  },
});
</script>

<style scoped>
/* 这里可以添加组件的局部样式 */
</style>
