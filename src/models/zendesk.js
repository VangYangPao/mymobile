const BASE_URL = "https://microumbrella.zendesk.com";

export function searchArticles(query) {
  const path = "/api/v2/help_center/articles/search.json";
  const url = `${BASE_URL}${path}?query=${query}`;
  return fetch(url).then(res => res.json());
}
