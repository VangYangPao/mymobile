const BASE_URL = "https://microumbrella.zendesk.com";

export function searchArticles(query) {
  const path = "/api/v2/help_center/articles/search.json";
  const url = `${BASE_URL}${path}?query=${query}&section=115000372494`;
  return fetch(url).then(res => res.json());
}
