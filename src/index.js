const https = require("https");
const { URL } = require("url");
const fs = require("fs").promises;
const parser = require("fast-xml-parser");
const core = require("@actions/core");
const TwitterLite = require("twitter-lite");
// const { createCanvas, loadImage, registerFont } = require("canvas");

const TARGET_PATH = __dirname + "/../tmp/header.png";

// mandatory input parameters
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;
const BLOG_RSS = core.getInput("BLOG_RSS");

// optional input parameters
const MAX_TEXT_LENGTH = Number.parseInt(core.getInput("MAX_TEXT_LENGTH") || "40");
const BLOG_POSTS_AMOUNT = Number.parseInt(core.getInput("BLOG_POSTS_AMOUNT") || "3");
const DRAW_BLOGTITLES_X = Number.parseInt(core.getInput("DRAW_BLOGTITLES_X") || "835");
const DRAW_BLOGTITLES_Y = Number.parseInt(core.getInput("DRAW_BLOGTITLES_Y") || "150");
const DRAW_BLOGTITLES_LINEHEIGHT = Number.parseInt(core.getInput("DRAW_BLOGTITLES_LINEHEIGHT") || "55");
const DRAW_BACKGROUNDCOLOR = core.getInput("DRAW_BACKGROUNDCOLOR") || "#00252d";
const DRAW_TEXTS =
  core.getInput("DRAW_TEXTS") ||
  `[
	["h1", "Hey, I'm Simon", 125, 100],
	["h1", "My latest blog posts", 835, 70],
	["h1", "Follow   and say hi!", 545, 390],
	["p", "I tweet about webperf, javascript,", 125, 177],
  ["p", "my learnings and books.", 125, 212]
]`;
const DRAW_IMAGES =
  core.getInput("DRAW_IMAGES") ||
  `[
	["./assets/images/underscore.png", 310, 145],
	["./assets/images/bullets.png", 725, 132],
	["./assets/images/curl.png", 505, 350]
]`;

requestLatestBlogPosts(BLOG_RSS)
  .then((latestPosts) => drawHeader(latestPosts))
  .then((targetPath) => uploadHeader(targetPath))
  .catch((err) => core.setFailed(err));

/**
 * edits the header template with the latest posts and saves it back locally.
 */
async function drawHeader(posts, targetPath = TARGET_PATH) {
  // dynamic impo
  const { default: Jimp } = await import("Jimp");
  const image = new Jimp(1500, 500, DRAW_BACKGROUNDCOLOR);
  const h1 = await Jimp.loadFont(__dirname + "/../assets/fonts/IBMPlexSans-Bold.ttf.fnt"); // 50px
  const p = await Jimp.loadFont(__dirname + "/../assets/fonts/Lato-Regular.ttf.fnt"); // 32px

  // TEXT: print text onto image
  JSON.parse(DRAW_TEXTS).forEach((item) => {
    const [fontType, text, x, y] = item;
    const font = fontType === "h1" ? h1 : p;
    image.print(font, x, y, text);
  });

  // BLOG TITLES: print post titles onto image
  posts.forEach((post, i) => {
    const title = post.length > MAX_TEXT_LENGTH ? post.slice(0, MAX_TEXT_LENGTH).trim() + "..." : post;
    image.print(p, DRAW_BLOGTITLES_X, DRAW_BLOGTITLES_Y + DRAW_BLOGTITLES_LINEHEIGHT * i, title);
  });

  // IMAGES: draw images onto image
  const promises = JSON.parse(DRAW_IMAGES).map(async (line) => {
    const [src, x, y] = line;
    const img = await Jimp.read(src.startsWith("./") ? `${__dirname}/../${src.slice(1)}` : src);
    image.composite(img, x, y);
  });
  await Promise.all(promises);

  image.write(targetPath);
  return targetPath;
}

/**
 * request the title of the latest blog posts of a supported RSS feed.
 */
async function requestLatestBlogPosts(rssUrl, latest = BLOG_POSTS_AMOUNT) {
  if (!rssUrl) {
    throw "no valid BLOG_RSS";
  }
  const { host, pathname: path } = new URL(rssUrl);
  const result = await new Promise((resolve, reject) => {
    https
      .request({ host, path }, (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => resolve(parser.parse(data)));
        response.on("error", (err) => reject(err));
      })
      .end();
  });
  return result.rss.channel.item.slice(0, latest).map((item) => item.title);
}

/**
 * upload locally generated image via Twitter API.
 */
async function uploadHeader(targetPath) {
  const client = new TwitterLite({
    consumer_key: TWITTER_API_KEY,
    consumer_secret: TWITTER_API_SECRET,
    access_token_key: TWITTER_ACCESS_TOKEN,
    access_token_secret: TWITTER_ACCESS_SECRET,
  });
  const data = await fs.readFile(targetPath);
  const banner = Buffer.from(data).toString("base64");
  return client.post("account/update_profile_banner", { banner });
}
