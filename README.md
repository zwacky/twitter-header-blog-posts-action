# Twitter header blog posts action

Automatically update your Twitter header with your latest blog posts—along with arbitrary text and images.

![twitter-header-uploader-v1](https://user-images.githubusercontent.com/1093032/143890106-3bd64985-c962-49f1-8dbf-014a53971fae.png)

# How to use

1. Go to a GitHub repository of yours (e.g. github.com/{username}/{username})
2. Create a folder named `.github` and create a `workflows` folder inside it if it doesn't exist
3. Create a new file named `twitter-header-blog-posts-workflow.yml` with the following content:

```yml
name: Update Twitter header with latest blog posts
on:
  # Run workflow automatically
  schedule:
    # This will make it run once a day (18:00)
    - cron: "0 18 * * *"
  # Run workflow manually (without waiting for the cron to be called), through the Github Actions Workflow page directly
  workflow_dispatch:
jobs:
  udpate-twitter-blog-posts:
    name: Update Twitter header with latest blog posts
    runs-on: ubuntu-latest
    steps:
      - uses: zwacky/twitter-header-blog-posts-action@main
        with:
          # replace this with your blog RSS url (see further below for supported blog platforms)
          BLOG_RSS: "https://dev.to/feed/zwacky"
          DRAW_TEXTS: '[["h1", "Hey, I''m Simon", 125, 100], ["h1", "My latest blog posts", 835, 70], ["h1", "Follow   and say hi!", 545, 390], ["p", "I tweet about webperf, javascript,", 125, 177], ["p", "my learnings and books.", 125, 212]]'
        env:
          # ⚠️ don't check in your API credentials ⚠️
          # see further below how to setup GitHub secrets so nobody except you can see them
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_SECRET: ${{ secrets.TWITTER_ACCESS_SECRET }}
```

4. Get your Twitter credentials by creating a Twitter App (follow [these steps](#setup-twitter-app))
5. Save your Twitter credentials as secrets in your repository from bullet point 1 (follow [these steps](#setup-twitter-credentials-as-repo-secrets))
6. Replace the above `BLOG_RSS` with your blog RSS url (check Inputs.BLOG_RSS for supported blog platforms)
7. Replace the above `DRAW_TEXTS` with your name and description. Mind escaping single quotes `'` with `''`.
8. Commit and wait for it to run automatically or you can also trigger it manually to see the result instantly. To trigger the workflow manually check out [this blog post](https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/) by GitHub.

# Inputs

Here are all the inputs you can change in your `twitter-header-blog-posts-workflow.yml` file under `steps[*].with`:

| Option | Default Value | Description | Required |
|--------|--------|--------|--------|
| BLOG_RSS | "" | Your blog RSS url.<br><br>Supported blog platforms with example:<br><br><ul><li>Dev.to: https://dev.to/feed/zwacky</li><li>Medium: https://medium.com/feed/@zwacky</li><li>https://zwacky.hashnode.dev/rss.xml</li></ul> | Yes |
| MAX_TEXT_LENGTH | "40" | Max length of blog post title before it gets cut off with an ellipsis (...) | No |
| BLOG_POSTS_AMOUNT | "3" | How many latest blog post titles are drawn | No |
| DRAW_BLOGTITLES_X | "835" | X coordinate where blog post titles are drawn | No |
| DRAW_BLOGTITLES_Y | "150" | Y coordinate where blog post titles are drawn | No |
| DRAW_BLOGTITLES_LINEHEIGHT | "55" | Height in pixel for each blog post title | No |
| DRAW_BACKGROUNDCOLOR | "#00252d" | Background color of banner | No |
| DRAW_TEXTS | "[<br>&nbsp;&nbsp;["h1", "Hey, I'm Simon", 125, 100],<br>&nbsp;&nbsp;["h1", "My latest blog posts", 835, 70],<br>&nbsp;&nbsp;["h1", "Follow   and say hi!", 545, 390],<br>&nbsp;&nbsp;["p", "I tweet about webperf, javascript,", 125, 177],<br>&nbsp;&nbsp;["p", "my learnings and books.", 125, 212]<br>]" | Text elements that are drawn onto the banner. Needs to be a valid JSON.<br><br>Format: `[ [ font_type, text, x, y ], ... ]`<br><br><ul><li>`font_type`: "h1" for heading, "p" for paragraph</li><li>`text`: Any text</li><li>`x`: X coordinate on banner</li><li>`y`: Y coordinate on banner</li></ul> | No |
| DRAW_IMAGES | "[<br>&nbsp;&nbsp;["./assets/images/underscore.png", 310, 145],<br>&nbsp;&nbsp;["./assets/images/bullets.png", 725, 132],<br>&nbsp;&nbsp;["./assets/images/curl.png", 505, 350]<br>]" | Image elements that are drawn onto the banner. Needs to be a valid JSON.<br><br>Format: `[ [ source, x, y ], ... ]`<br><br><ul><li>`source`: Source of any image. Sources starting with "./" point so [GitHub Action repo's /dist folder](https://github.com/zwacky/twitter-header-blog-posts-action/tree/main/dist)</li><li>`x`: Y coordinate on banner</li><li>`y`: Y coordinate on banner</li></ul> | No |

# Twitter API credentials

## Setup Twitter App

In order to update your own Twitter header, we need to create a Twitter app. We need the following credentials:
- API_KEY
- API_SECRET
- ACCESS_TOKEN
- ACCESS_SECRET

Follow these steps to obtain the above credentials:

1. Go to developer.twitter.com > [Create new Twitter App](https://developer.twitter.com/en/portal/apps/new)
2. Copy **API Key and Secret**
3. Go to the newly created Twitter App's **Settings**
4. change App permission from `Read` to `Read and write`
5. Go to **Keys and tokens** > **Authenticated Tokens** > **Generate Access Token and Secret**

## Setup Twitter credentials as repo secrets

1. Go to a GitHub repository of yours (e.g. github.com/{username}/{username})
2. Go to **Settings** > **Secrets**
3. **New repository secret** for all 4 Twitter app credentials
