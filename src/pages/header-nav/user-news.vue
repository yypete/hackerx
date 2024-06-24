<template>
  <div class="news-container">
    <div
      v-for="(item, visibleIndex) in visibleItems"
      :key="item.id"
      class="item"
    >
      <div class="title">
        <div class="index">{{ visibleIndex + 1 + start }}.</div>
        <div class="title-content">
          <i class="fi fi-sr-caret-up translate-y-0.5 arrow"></i>
          <span class="item-title">
            <a v-if="item.title" :href="item.url">{{ item.title }}</a>
            <span v-else class="text-red-500"
              >"The message had been deleted"</span
            >
          </span>
          <span class="item-url" v-if="item.url">
            ({{ extractDomain(item.url) }})
          </span>
        </div>
      </div>
      <div class="details pl-3">
        <span class="score" v-if="!(type === 'job')">
          {{ item.score ? item.score + " points by" : "By" }}
        </span>
        <router-link :to="{ name: 'HackerUser', params: { userId: item.by } }">
          <span
            class="by px-1 cursor-pointer hover:underline"
            v-if="!(type === 'job')"
          >
            {{ item.by }}
          </span>
        </router-link>
        <router-link
          :to="{ name: 'NewsComments', params: { itemId: item.id } }"
        >
          <span class="time cursor-pointer hover:underline">
            {{ formatTimeAgo(item.time ?? 0) }}
          </span>
        </router-link>
        <span v-if="!(type === 'job')" class="separator">|</span>
        <a v-if="!(type === 'job')" @click="hideItem(visibleIndex)">hide</a>
        <span v-if="!(type === 'job')" class="separator">|</span>
        <router-link
          :to="{ name: 'NewsComments', params: { itemId: item.id } }"
          class="comments cursor-pointer hover:underline"
        >
          <span
            class="comments cursor-pointer hover:underline"
            v-if="!(item.descendants === 0)"
          >
            {{ item.descendants }} comments
          </span>
          <span v-show="item.descendants === 0">discuss</span>
        </router-link>
      </div>
    </div>
    <div class="pt-2 text-gray-500">
      <span
        class="pl-11 cursor-pointer"
        :class="{ 'cursor-not-allowed text-gray-300': !hasMoreItems }"
        @click="hasMoreItems ? loadMore() : null"
      >
        More
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { fetchItems, Item } from "../../api/fetch-item";
import { formatTimeAgo } from "../../utils/format-time";
import { extractDomain } from "../../utils/extract-url";

interface ExtendedItem extends Item {
  hidden: boolean;
}

export default defineComponent({
  name: "NewsUser",
  props: {
    ids: {
      type: Array as () => number[],
      required: true,
    },
  },
  setup(props) {
    const items = ref<ExtendedItem[]>([]);
    const type = ref<string>("");
    const page = ref<number>(0);
    const hasMoreItems = ref<boolean>(true);

    const loadItems = async () => {
      try {
        let fetchedItems: Item[] = [];
        let start = 0;
        const increment = 30;

        while (fetchedItems.length < 30) {
          const end = start + increment;
          const itemsBatch: Item[] = await fetchItems(props.ids, start, end);
          // 过滤出 title 存在的项
          const validItems = itemsBatch.filter((item) => item.title);
          fetchedItems = fetchedItems.concat(validItems);
          // 更新 start 以获取更多项
          start = end;
          // 如果没有更多的项可以获取，跳出循环
          if (itemsBatch.length < increment) {
            break;
          }
        }
        // 确保只保留 30 个有效项
        const limitedItems = fetchedItems.slice(0, 30);
        items.value = limitedItems.map((item) => ({
          ...item,
          hidden: false,
          by: item.by || "peter",
        }));
        page.value = 1; // Initialize page number to 1
        hasMoreItems.value = limitedItems.length === 30;
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    const loadMore = async () => {
      try {
        const start = page.value * 30;
        const end = start + 30;
        const fetchedItems: Item[] = await fetchItems(props.ids, start, end);
        // 过滤出 title 存在的项
        const validItems = fetchedItems.filter((item) => item.title);
        items.value = items.value.concat(
          validItems.map((item) => ({
            ...item,
            hidden: false,
            by: item.by || "peter", // Set default value for item.by
          }))
        );
        page.value++; // Update page number
        hasMoreItems.value = validItems.length === 30;
      } catch (error) {
        console.error("Error fetching more stories:", error);
      }
    };

    // Watch for changes in props.ids and reload data
    watch(
      () => props.ids,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          loadItems();
        }
      }
    );

    const hideItem = (index: number): void => {
      items.value[index].hidden = true;
    };

    const visibleItems = computed(() =>
      items.value.filter((item) => !item.hidden).slice(0, 30)
    );

    onMounted(() => {
      loadItems();
    });

    return {
      items,
      formatTimeAgo,
      hideItem,
      visibleItems,
      extractDomain,
      type,
      loadMore,
      start: computed(() => (page.value - 1) * 30),
      hasMoreItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.news-container {
  width: 85%;
  margin: 0 auto;
  padding: 8px;
  background-color: #f6f6ef;
  border-bottom: 2px solid #f76700;
  font-size: 10pt;
  display: flex;
  flex-direction: column;
  .item {
    margin-bottom: 2px;
    .arrow {
      padding-left: 2px;
    }

    .title {
      display: flex;
      align-items: center;
    }

    .index {
      width: 22px;
      color: #828282;
      text-align: right;
    }

    .title-content {
      display: flex;
      align-items: center;
    }

    .item-title {
      margin-left: 5px;
    }

    .item-url {
      margin-left: 5px;
      color: #828282;
    }

    .details {
      margin-left: 30px;
      display: flex;
      align-items: center;
      color: #828282;
      font-size: 7pt;
    }

    .details .separator {
      margin: 0 5px;
    }

    a {
      cursor: pointer;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  }

  .cursor-not-allowed {
    cursor: not-allowed;
  }
}

@media (max-width: 1000px) {
  .news-container {
    width: 90%;
  }
}

@media (max-width: 750px) {
  .news-container {
    width: 100%;
  }
}
</style>
