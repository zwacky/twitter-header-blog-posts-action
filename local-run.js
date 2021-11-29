const process = require("process");

// load local.env for Twitter credentials
require("dotenv").config();

const exampleEnvFile = `# do not check the actual values to git!
TWITTER_API_KEY="{API_KEY}"
TWITTER_API_SECRET="{API_SECRET}"
TWITTER_ACCESS_TOKEN="{ACCESS_TOKEN}"
TWITTER_ACCESS_SECRET="{ACCESS_SECRET"`;

if (
  !process.env.TWITTER_API_KEY ||
  !process.env.TWITTER_API_SECRET ||
  !process.env.TWITTER_ACCESS_TOKEN ||
  !process.env.TWITTER_ACCESS_SECRET
) {
  console.error(`[local-run] please check that your .env looks like this:\n\n${exampleEnvFile}`);
  return;
}
// supported blog RSS feeds
// - dev: "https://dev.to/feed/zwacky"
// - medium: "https://medium.com/feed/@zwacky"
// - hashnode: "https://zwacky.hashnode.dev/rss.xml"
process.env.INPUT_BLOG_RSS = "https://dev.to/feed/zwacky";
process.env.DRAW_IMAGES = `[
	["./assets/underscore.png", 310, 145],
	["./assets/bullets.png", 725, 132],
	["./assets/curl.ppng", 505, 350]
]`;

require("./src/index.js");
