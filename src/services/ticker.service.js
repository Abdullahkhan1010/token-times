import { getNewsHeadlines } from "./published-news.service";

export async function getTickerItems() {
  try {
    const items = await getNewsHeadlines().flatMap(item => item.headlines).filter((_, index) => index % 2 === 1);
    return items;
  }
  catch (error) {
    console.error("Error fetching ticker items:", error);
  }

}
