<template>
  <div class="flex justify-between items-center">
    <table>
      <tr>
        <!-- logo:Y -->
        <td class="pl-1">
          <router-link
            :to="{ name: 'NewsRender', params: { fetchType: 'top' } }"
          >
            <img
              src="https://news.ycombinator.com/y18.svg"
              width="20px"
              height="20px"
              style="border: 1px white solid; display: block"
            />
          </router-link>
        </td>
        <!-- left-nav -->
        <td class="headline">
          <router-link
            :to="{ name: 'NewsRender', params: { fetchType: 'top' } }"
            id="title"
            @click="selected('Hackers News', 'top')"
            class="cursor-pointer"
          >
            Hackers News
          </router-link>
          <span v-for="(item, index) in navData" :key="index">
            <router-link
              :to="{
                name: 'NewsRender',
                params: { fetchType: fetchTypes[item.name] },
              }"
              class="nav"
              @click="selected(item.name, fetchTypes[item.name])"
              :class="{ 'text-white': selectedName === item.name }"
            >
              {{ item.name }}
            </router-link>
            <span class="separator" v-if="index < navData.length - 1"> | </span>
          </span>
          <span class="separator"> | </span>
          <router-link
            :to="{ name: 'NewsRender', params: { fetchType: 'submit' } }"
            class="nav"
            @click="selected('submit', 'submit')"
            :class="{ 'text-white': selectedName === 'submit' }"
          >
            submit
          </router-link>
        </td>
      </tr>
    </table>
    <!-- right-nav -->
    <router-link to="/login" class="nav pr-2">login</router-link>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { headerNavData } from "../dataConfig";

interface TableData {
  name: string;
  path: string;
}

export default defineComponent({
  name: "HeaderNav",
  setup() {
    const navData = ref<TableData[]>(headerNavData);
    const selectedName = ref<string | null>(null);
    const currentFetchType = ref<string>("top");

    const fetchTypes: Record<string, string> = {
      "Hackers News": "top",
      new: "new",
      past: "past",
      comments: "newcomments",
      ask: "ask",
      show: "show",
      jobs: "job",
      submit: "submit",
    };
    const selected = (name: string, fetchType: string) => {
      selectedName.value = name;
      currentFetchType.value = fetchType;
    };

    return {
      navData,
      selectedName,
      currentFetchType,
      selected,
      fetchTypes,
    };
  },
});
</script>

<style lang="scss" scoped>
div {
  background-color: #f76700;
  width: 85%;
  margin: 0 auto;
  font-size: 13.4px;
  table {
    font-family: Verdana, Geneva, sans-serif;
    padding: 2px;
    .headline {
      line-height: 16px;
      height: 20px;
      #title {
        font-weight: 700;
        padding-left: 4px;
        padding-right: 10px;
        width: 70%;
      }
      .nav {
        font-weight: 400;
        cursor: pointer;
        &.text-white {
          color: white;
        }
      }
      .separator {
        color: black;
        font-weight: 400;
      }
    }
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
