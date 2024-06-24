<template>
  <div class="news-container" v-if="user">
    <table class="user-info">
      <tbody>
        <tr>
          <td class="label">User:</td>
          <td class="value">{{ user.id }}</td>
        </tr>
        <tr>
          <td class="label">Created:</td>
          <td class="value text-gray-950">{{ formatTimeAgo(user.created) }}</td>
        </tr>
        <tr>
          <td class="label">Karma:</td>
          <td class="value">{{ user.karma }}</td>
        </tr>
        <tr v-if="user.about">
          <td class="label">About:</td>
          <td class="value" v-html="decodeHtmlEntity(user.about)"></td>
        </tr>
        <tr>
          <td></td>
          <td colspan="2" class="submissions-link">
            <router-link
              :to="{ name: 'NewsUser', params: { ids: user.submitted } }"
            >
              submissions
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>Loading...</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { userFetch } from "../../api/fetch-item";
import { useRoute } from "vue-router";

interface User {
  id: string;
  karma: number;
  created: number;
  about?: string;
  submitted?: number[];
}

export default defineComponent({
  name: "HackerUser",
  setup() {
    const route = useRoute();
    const userId = route.params.userId as string;
    const user = ref<User | null>(null);

    const decodeHtmlEntity = (input: string | undefined | null): string => {
      if (!input) return "";
      const doc = new DOMParser().parseFromString(input, "text/html");
      let decodedText = doc.documentElement.textContent ?? "";

      // Detect and convert URLs to clickable links
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      decodedText = decodedText.replace(
        urlPattern,
        '<a href="$1" class="custom-link" target="_blank">$1</a>'
      );

      return decodedText;
    };

    const formatTimeAgo = (timestamp: number): string => {
      const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    };

    const loadUser = async () => {
      try {
        console.log("Fetching user with ID:", userId);
        const fetchedUser = await userFetch<User>(`${userId}`);
        user.value = fetchedUser;
        console.log("Fetched user:", user.value);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    onMounted(() => {
      loadUser();
    });

    return {
      user,
      formatTimeAgo,
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
  color: gray;
}

.user-info {
  width: 100%;
  border-collapse: collapse;
}
.user-info td,
.user-info th {
  vertical-align: top; /* 设置单元格内容顶部对齐 */
}
.label {
  width: 60px; /* 调整 label 列的宽度 */
  text-align: left;
}

.value {
  text-align: left;
}

.submissions-link a {
  text-decoration: underline;
  color: rgb(21, 21, 29);
}
</style>
