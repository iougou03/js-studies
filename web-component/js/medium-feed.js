// @ts-check
async function fetchMediumFeed(username) {
  let mediumUrl = `https://medium.com/feed/@${username}`;
  return (
    await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${mediumUrl}`)
  ).json();
}

export async function getRssFeed(username = "mariusbongarts11", maxArticles) {
  const { feed, items, status } = await fetchMediumFeed(username);

  const articles = items
    .filter((item) => item.thumbnail)
    .slice(0, maxArticles)
    .map((item) => {
      return {
        ...item,
        userLink: feed.link,
      };
    });

  if (!feed || status !== "ok") {
    throw new Error("Pass a valid medium username.");
  }

  return { feed, articles };
}