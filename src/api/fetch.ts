import axios from "./axios";

// 数据缓存类型定义
type Cache<T> = Map<string, T>;

// Item 接口定义，根据实际数据结构调整
export interface Item {
  id: number;
  title: string;
  by: string;
  score: number;
  url: string;
  descendants?: number;
  time?: number;
  parent?: number;
  text?: string;
  type?: string;
  kids?: number[];
  visibleIndex?: number; 
  hidden?: boolean;

}

// User 接口定义，根据实际数据结构调整
interface User {
  id: string;
}

async function fetch<T>(childPath: string, cache?: Cache<T>): Promise<T> {
  if (cache && cache.has(childPath)) {
    return Promise.resolve(cache.get(childPath)!);
  } else {
    try {
      console.log(`Fetching /api/${childPath}`); // 请求之前的日志
      const response = await axios.get(`/${childPath}.json?print=pretty`); // 使用 Axios 发送请求，包含查询参数
      console.log("Response data:", response.data); // 响应数据的日志
      const data: T = response.data;
      cache?.set(childPath, data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error); // 错误日志
      throw new Error("No data available");
    }
  }
}

// 根据类型获取 ID 数组
export function fetchIdsByType(
  type: string,
  cache?: Cache<number[]>
): Promise<number[]> {
  return fetch<number[]>(`${type}stories`, cache);
}

// 根据 ID 获取单个 Item
export function fetchItem(id: number, cache?: Cache<Item>): Promise<Item> {
  return fetch<Item>(`item/${id}`, cache);
}

// 根据 ID 数组获取多个 Item
export function fetchItems(
  ids: number[],
  cache?: Cache<Item>
): Promise<Item[]> {
  return Promise.all(ids.map((id) => fetchItem(id, cache)));
}

// 根据 ID 获取单个 User
export function fetchUser(id: string, cache?: Cache<User>): Promise<User> {
  return fetch<User>(`user/${id}`, cache);
}

// 根据类型获取列表数据（首先获取 ID 数组，然后获取多个 Item）
export async function fetchListData(
  type: string,
  start: number,
  end: number,
  cache?: Cache<number[]> & Cache<Item>
): Promise<Item[]> {
  try {
    const ids = await fetchIdsByType(type, cache);
    const slicedIds = ids.slice(start, end);
    const fetchedItems = await fetchItems(slicedIds, cache);
    
    // 对获取到的数据进行排序，保持原有顺序
    const sortedItems = fetchedItems.sort((a, b) => {
      return slicedIds.indexOf(a.id) - slicedIds.indexOf(b.id);
    });

    return sortedItems;
  } catch (error) {
    console.error("Failed to fetch list data:", error);
    throw error;
  }
}
