<template>
  <div class="comment" :id="'comment-' + comment.id">
    <div class="title">
      <span><i class="fi fi-sr-caret-up translate-y-0.5 arrow"></i></span>
      <span>{{ comment.by }}</span>
      <span>{{ formatTimeAgo(comment.time ?? 0) }} |</span>
      <span
        v-show="rootComment"
        @click="scrollToElement(rootComment)"
        class="link"
      >
        root
      </span>
      <span
        v-show="parentComment"
        @click="scrollToElement(parentComment)"
        class="link"
      >
        parent |</span
      >
      <span @click="goToNextSibling" class="link"> next </span>
      <span @click="toggleVisibility" class="link">
        <template v-if="isVisible"> [-] </template>
        <template v-else-if="kidComments.length > 0">
          [{{ kidComments.length }}
          {{ kidComments.length !== 1 ? "more" : "" }}]
        </template>
        <template v-else> [0 more] </template>
      </span>
    </div>
    <div class="content" v-show="isVisible">
      <template
        v-for="(paragraph, pIndex) in formatParagraphs(comment.text)"
        :key="pIndex"
      >
        <p class="paragraph" v-html="decodeHtmlEntity(paragraph)"></p>
      </template>
    </div>
    <div class="reply" v-show="isVisible">reply</div>
    <div
      v-show="isVisible && (kidComments.length > 0 || !hasLoadedKids)"
      class="comments"
    >
      <CommentItem
        v-for="(kid, index) in kidComments"
        :key="index"
        :comment="kid"
      />
      <div v-if="!hasLoadedKids && kidComments.length === 0">Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType, watchEffect } from "vue";
import { fetchItems, Item } from "../api/fetch";

export default defineComponent({
  name: "CommentItem",
  props: {
    comment: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  setup(props) {
    const kidComments = ref<Item[]>([]);
    const isVisible = ref(true);
    const hasLoadedKids = ref(false);
    const rootComment = ref<HTMLElement | null>(null);
    const parentComment = ref<HTMLElement | null>(null);
    const nextSiblingComment = ref<HTMLElement | null>(null);

    const loadKidsComments = async () => {
      if (props.comment.kids && props.comment.kids.length > 0) {
        try {
          const fetchedItems = await fetchItems(props.comment.kids);
          kidComments.value = fetchedItems;
          hasLoadedKids.value = true;
        } catch (error) {
          console.error("Error fetching kid comments:", error);
        }
      }
    };

    const decodeHtmlEntity = (input: string | undefined | null): string => {
      if (!input) return "";
      const doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent ?? "";
    };

    const formatTimeAgo = (timestamp: number): string => {
      const now = Math.floor(Date.now() / 1000);
      const diff = now - timestamp;
      if (diff < 60) {
        return `${diff} seconds ago`;
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} minutes ago`;
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hours ago`;
      } else {
        const days = Math.floor(diff / 86400);
        return `${days} days ago`;
      }
    };

    const formatParagraphs = (text: string | undefined | null): string[] => {
      if (!text) return [];
      return text
        .split(/<\/?p>/)
        .filter((paragraph) => paragraph.trim() !== "")
        .map((paragraph) => paragraph.trim());
    };

    const toggleVisibility = () => {
      if (!isVisible.value && !hasLoadedKids.value) {
        loadKidsComments();
      }
      isVisible.value = !isVisible.value;
    };

    const scrollToElement = (element: HTMLElement | null) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const offset = window.innerHeight / 2;
        window.scrollTo({
          top: rect.top + window.scrollY - offset,
          behavior: "smooth",
        });
      }
    };

    const findRootComment = (comment: Item): HTMLElement | null => {
      const rootElement = document.getElementById(`comment-${comment.id}`);
      if (rootElement) {
        let root = rootElement;
        while (
          root.parentElement &&
          !root.parentElement.id.startsWith("comment-")
        ) {
          root = root.parentElement;
        }
        return root;
      }
      return null;
    };

    const findParentComment = (comment: Item): HTMLElement | null => {
      const parent = document.getElementById(`comment-${comment.parent}`);
      return parent;
    };

    // 寻找当前评论项的下一个根评论
    const findNextSiblingComment = (comment: Item): HTMLElement | null => {
      const currentElement = document.getElementById(`comment-${comment.id}`);
      if (currentElement) {
        let sibling = currentElement.nextElementSibling;
        while (sibling) {
          if (sibling.id && sibling.id.startsWith("comment-")) {
            return sibling as HTMLElement;
          }
          sibling = sibling.nextElementSibling;
        }
      }
      return null;
    };

    const goToNextSibling = () => {
      const nextRootComment = findNextSiblingComment(props.comment);
      if (nextRootComment) {
        scrollToElement(nextRootComment);
      }
    };

    onMounted(() => {
      loadKidsComments();
    });

    watchEffect(() => {
      rootComment.value = findRootComment(props.comment);
      parentComment.value = findParentComment(props.comment);
      nextSiblingComment.value = findNextSiblingComment(props.comment);
    });

    return {
      kidComments,
      isVisible,
      hasLoadedKids,
      decodeHtmlEntity,
      formatTimeAgo,
      formatParagraphs,
      toggleVisibility,
      goToNextSibling,
      scrollToElement,
      rootComment,
      parentComment,
      nextSiblingComment,
    };
  },
});
</script>

<style lang="scss" scoped>
.comment {
  margin-top: 10px;

  .title {
    font-size: 10.6px;
    color: #828282;

    .link {
      cursor: pointer;
    }
  }

  .content {
    font-size: 12px;
    padding-left: 12px;
    padding-top: 2px;
    line-height: 1.3;

    .paragraph {
      margin-bottom: 0.3em;
    }
  }

  .reply {
    font-size: 12px;
    padding-left: 11.7px;
    text-decoration: underline;
    cursor: pointer;
  }

  .comments {
    margin-top: 10px;
    padding-left: 20px;
  }
}
</style>
