<template>
  <div>
    <table>
      <tr>
        <td class="headline">
          <span v-for="(item, index) in navData" :key="index">
            <router-link
              :to="item.path"
              class="nav cursor-pointer"
              @click="selected(item.name)"
              :class="{ 'text-gray-400': selectedItems.includes(item.name) }"
            >
              {{ item.name }}
            </router-link>
            <span class="separator"> | </span>
          </span>
          <router-link
            to="/contact"
            class="nav"
            @click="selected('contact')"
            :class="{ 'text-gray-400': selectedItems.includes('contact') }"
          >
            contact
          </router-link>
        </td>
      </tr>
    </table>
    <form method="get" action="//hn.algolia.com/">
      <span class="search pr-1">Search: </span>
      <input type="text" name="q" size="17" class="input" />
    </form>
  </div>
</template>

<script lang="ts">
import { footerNavData } from "../dataConfig";
import { ref, onMounted } from "vue";

interface TableData {
  name: string;
  path: string;
}

export default {
  name: "FooterNav",
  components: {},
  setup() {
    const navData = ref<TableData[]>(footerNavData);
    const selectedItems = ref<string[]>([]);

    const loadSelectedItems = () => {
      const storedItems = sessionStorage.getItem("selectedItems");
      if (storedItems) {
        selectedItems.value = JSON.parse(storedItems);
      }
    };

    const saveSelectedItems = () => {
      sessionStorage.setItem(
        "selectedItems",
        JSON.stringify(selectedItems.value)
      );
    };

    const selected = (name: string) => {
      if (!selectedItems.value.includes(name)) {
        selectedItems.value.push(name);
        saveSelectedItems();
      }
    };

    onMounted(() => {
      loadSelectedItems();
    });

    return {
      navData,
      selectedItems,
      selected,
    };
  },
};
</script>

<style lang="scss" scoped>
$font-size-small: 10.7px;
$font-size-large: 13.4px;
$font-family: Verdana, Geneva, sans-serif;
$color-gray: gray;
$color-black: black;
div {
  background-color: #f6f6ef;
  width: 85%;
  margin: 0 auto;
  text-align: center;
  table {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 9px;
    .headline {
      font-family: $font-family;
      font-size: $font-size-small;
      font-weight: 700;
      .nav {
        font-weight: 400;
        font-size: $font-size-small;
        &.text-gray-400 {
          color: $color-gray;
        }
      }
      .separator {
        color: $color-black;
        font-weight: 400;
        font-size: $font-size-small;
      }
    }
  }
  form {
    padding-bottom: 10px;
    .search {
      font-size: $font-size-large;
    }
  }
  .input {
    width: 130px;
    outline: 1px solid $color-black;
    height: 18px;
  }
}

@media (max-width: 1000px) {
  div {
    width: 90%;
    margin: 0 auto;
  }
}
@media (max-width: 750px) {
  div {
    width: 100%;
    margin: 0 auto;
  }
}
</style>
