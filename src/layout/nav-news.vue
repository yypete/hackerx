<template>
  <div>
    <headerNavVue />
    <router-view/>
    <footerNavVue />
  </div>
</template>

<script lang="ts">
import footerNavVue from "../components/footer-nav.vue";
import headerNavVue from "../components/header-nav.vue";
export default {
  name: "NewsNewest",
  components: {
    footerNavVue,
    headerNavVue,
  },
};
</script>

<style></style>
