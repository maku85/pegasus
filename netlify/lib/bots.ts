// Link previews: they open one page, when somebody shares it
const LINK_PREVIEW =
  /facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|skypeuripreview|redditbot|pinterestbot/i;

// Crawlers, scrapers, AI agents and scripts. "Cubot" is a phone brand
const BOT =
  /(?<!cu)bot\b|bot\/|crawl|spider|slurp|scrap|archiver|externalagent|gpt|claude|anthropic|perplexity|cohere|googleother|google-|lighthouse|headless|phantomjs|puppeteer|playwright|selenium|python|curl|wget|libwww|httpclient|go-http|java\/|okhttp|axios|node-fetch|undici|php\/|ruby|perl/i;

export function isUnwantedBot(userAgent: string | null) {
  if (!userAgent) return true;
  return BOT.test(userAgent) && !LINK_PREVIEW.test(userAgent);
}

// For Netlify edge functions: returning nothing lets the request continue
export function refuseBots(request: Request) {
  if (isUnwantedBot(request.headers.get("user-agent"))) {
    return new Response("Automated access is not allowed here.", {
      status: 403,
    });
  }
}
