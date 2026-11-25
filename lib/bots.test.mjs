import assert from "node:assert/strict";
import test from "node:test";

import { refuseBots } from "../netlify/lib/bots.ts";

const status = (agent) => refuseBots(new Request("https://x/it/movies/1", { headers: agent === null ? {} : { "user-agent": agent } }))?.status;

test("crawlers, AI agents, scripts and empty agents are refused", () => {
  for (const agent of [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Mozilla/5.0 (compatible; bingbot/2.0)", "GoogleOther",
    "Mozilla/5.0 AppleWebKit/537.36 (compatible; GPTBot/1.2)", "Mozilla/5.0 (compatible; ChatGPT-User/1.0)", "CCBot/2.0", "ClaudeBot/1.0", "PerplexityBot/1.0",
    "meta-externalagent/1.1", "Mozilla/5.0 (compatible; Bytespider)", "Mozilla/5.0 (compatible; AhrefsBot/7.0)", "Amazonbot/0.1", "Applebot/0.1",
    "Scrapy/2.11", "python-requests/2.31", "curl/8.4", "Go-http-client/1.1", "node-fetch/1.0", "axios/1.6",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/130.0", "", null,
  ]) assert.equal(status(agent), 403, String(agent));
});

test("people and link previews pass", () => {
  for (const agent of [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0",
    "Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 GSA/300.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/130.0 Safari/537.36 Edg/130.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) AppleWebKit/605.1.15 Mobile/15E148 Instagram 300.0",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)", "Twitterbot/1.0", "WhatsApp/2.23.20.0", "TelegramBot (like TwitterBot)", "Slackbot-LinkExpanding 1.0", "LinkedInBot/1.0", "Mozilla/5.0 (compatible; Discordbot/2.0)",
  ]) assert.equal(status(agent), undefined, agent);
});
