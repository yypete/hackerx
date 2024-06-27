<template>
  <div class="news-container">
    <div
      v-for="(item, visibleIndex) in visibleItems"
      :key="item.id"
      class="item"
      v-show="!item.hidden"
    >
      <div class="title">
        <div class="index">{{ visibleIndex + 1 + start }}.</div>
        <div class="title-content">
          <i class="fi fi-sr-caret-up translate-y-0.5 arrow"></i>
          <span class="item-title">
            <a :href="item.url">{{ item.title }}</a>
          </span>
          <span class="item-url" v-if="item.url">
            ({{ extractDomain(item.url) }})
          </span>
        </div>
      </div>
      <div class="details pl-3">
        <span class="score" v-if="!(type === 'job')">
          {{ item.score }} points by
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
      <span class="pl-11 cursor-pointer" @click="loadMore">More</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { fetchListData, Item } from "@/api/fetch-item";
import { formatTimeAgo } from "@/utils/format-time";
import { extractDomain } from "@/utils/extract-url";
interface ExtendedItem extends Item {
  hidden: boolean;
}

export default defineComponent({
  name: "NewsRender",
  props: {
    fetchType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const items = ref<ExtendedItem[]>([]);
    const type = ref<string>(props.fetchType);
    const page = ref<number>(0); // 使用 page 作为页数，从0开始
    const loadItems = async () => {
      try {
        const fetchedItems: Item[] = await fetchListData(
          props.fetchType,
          0,
          30
        );
        items.value = fetchedItems.map((item) => ({ ...item, hidden: false }));
        page.value = 1; // 初始化页数为1
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    const start = computed(() => (page.value - 1) * 30);
    const loadMore = async () => {
      try {
        const start = page.value * 30;
        const fetchedItems: Item[] = await fetchListData(
          props.fetchType,
          start,
          start + 30
        );
        items.value = fetchedItems.map((item) => ({ ...item, hidden: false })); // 覆盖现有数据
        page.value++; // 更新页数
      } catch (error) {
        console.error("Error fetching more stories:", error);
      }
    };
    // 监听 fetchType 变化，重新加载数据
    watch(
      () => props.fetchType,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          type.value = newVal;
          loadItems();
        }
      }
    );

    const hideItem = (index: number): void => {
      items.value[index].hidden = true;
    };

    const visibleItems = computed(() =>
      items.value.filter((item) => !item.hidden)
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
      start,
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
