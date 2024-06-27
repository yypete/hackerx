<template>
  <div v-if="item" class="news-container">
    <div class="item" v-show="!item.hidden">
      <div class="title">
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
      <div class="details">
        <span class="score" v-if="item.score">{{ item.score }} points by</span>
        <span class="by px-1 cursor-pointer hover:underline">
          {{ item.by }}
        </span>
        <span class="time cursor-pointer hover:underline">
          {{ formatTimeAgo(item.time ?? 0) }}
        </span>
        <span v-if="!(item.type === 'job')" class="separator">|</span>
        <a v-if="!(item.type === 'job')" @click="hideItem">hide</a>
        <span v-if="!(item.type === 'job')" class="separator">|</span>
        <router-link
          :to="{ name: 'NewsComments', params: { itemId: item.id } }"
          class="comment-count cursor-pointer hover:underline"
        >
          <span
            class="comment-count cursor-pointer hover:underline"
            v-if="item.descendants && item.descendants > 0"
          >
            {{ item.descendants }} comments
          </span>
          <span class="comment-count cursor-pointer hover:underline" v-else>
            discuss
          </span>
        </router-link>
      </div>
    </div>
    <div class="input">
      <textarea class="text" rows="8" cols="80" wrap="virtual"></textarea>
      <button class="add-comment">add comment</button>
    </div>
    <div class="comments">
      <CommentItem
        v-for="(kid, index) in kidItems"
        :key="index"
        :comment="kid"
      />
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchItem, Item, fetchItems } from "@/api/fetch-item";
import CommentItem from "@/components/item-comment.vue";
import { extractDomain } from "@/utils/extract-url";
import { decodeHtmlEntity } from "@/utils/decode-html-entity";
import { formatTimeAgo } from "@/utils/format-time";
import { formatParagraphs } from "@/utils/format-paragraphs";

export default defineComponent({
  name: "NewsComments",
  components: {
    CommentItem,
  },
  setup() {
    const route = useRoute();
    const itemId = route.params.itemId as string;
    const item = ref<Item | null>(null);
    const type = ref<string | null>(null);
    const kidItems = ref<Item[]>([]);

    const loadItem = async () => {
      try {
        console.log("Fetching item with ID:", itemId);
        const fetchedItem = await fetchItem(Number(itemId));
        item.value = fetchedItem;
        console.log("Fetched item:", item.value);
        loadKidsItem();
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    const loadKidsItem = async () => {
      try {
        if (item.value && item.value.kids) {
          console.log("Fetching kids items for item:", item.value);
          const kidIds = item.value.kids;
          // 设置开始和结束索引
          const start = 0;
          const end = kidIds.length;
          // 获取子项的数据
          const fetchedItems = await fetchItems(kidIds, start, end);

          kidItems.value = fetchedItems;
          console.log("Fetched kid items:", kidItems.value);
        }
      } catch (error) {
        console.error("Error fetching kid items:", error);
      }
    };

    const hideItem = () => {
      if (item.value) {
        item.value.hidden = true;
      }
    };

    onMounted(() => {
      loadItem();
      type.value = route.query.type as string | null;
    });

    return {
      item,
      formatTimeAgo,
      extractDomain,
      type,
      kidItems,
      hideItem,
      formatParagraphs,
      decodeHtmlEntity,
    };
  },
});
</script>

<style lang="scss" scoped>
.news-container {
  width: 85%;
  margin: 0 auto;
  padding: 15px;
  background-color: #f6f6ef;
  border-bottom: 2px solid #f76700;
  font-size: 13.4px;
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
      margin-left: 21px;
      display: flex;
      align-items: center;
      color: #828282;
      font-size: 9.4px;
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

  .input {
    display: flex;
    flex-direction: column;

    .text {
      border: 1px solid rgb(92, 89, 89);
      padding: 10px;
      margin: 15px;
      height: 120px;
      width: 580px;
    }

    .add-comment {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgb(80, 77, 77);
      background-color: #efefef;
      color: black;
      cursor: pointer;
      font-size: 13px;
      width: 100px;
      height: 20px;
      margin-left: 14px;
    }
  }
  .comments {
    margin-top: 40px;
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
