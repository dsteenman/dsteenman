const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});
const emoji = require('markdown-it-emoji');
const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

const feedUrl = "https://dannys.cloud/feed";
const websiteUrl = "https://dannys.cloud";
const twitterUrl = "https://www.twitter.com/dannysteenman";
const linkedInUrl = "https://www.linkedin.com/in/dannysteenman";
const devToUrl = "https://dev.to/dsteenman";
const blogPostLimit = 5;
const badgeHeight = "25";

md.use(emoji);

(async () => {
  let blogPosts = "";
  try {
    blogPosts = await loadBlogPosts();
  } catch (e) {
    console.error(`Failed to load blog posts from ${websiteUrl}`, e);
  }

  const twitterImage = `[<img src="https://github.com/dsteenman/dsteenman/blob/main/tweet.png" width="600">](${twitterUrl})`;
  const twitterBadge = `[<img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" height=${badgeHeight}>](${twitterUrl})`;
  const linkedInBadge = `[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" height=${badgeHeight}>](${linkedInUrl})`;
  const devToBadge = `[<img src="https://img.shields.io/badge/DEV.TO-%230A0A0A.svg?&style=for-the-badge&logo=dev-dot-to&logoColor=white" height=${badgeHeight}>](${devToUrl})`;


  text = `Hi, I'm Danny an AWS Cloud Consultant specialised in building high availability environments, using automation and continuous deployment.\n\n${twitterBadge} ${linkedInBadge} ${devToBadge}\n\n[:globe_with_meridians: Check out my website](${websiteUrl})\n\n# Latest Blog Posts\n${blogPosts}\n# Last Tweet\n${twitterImage}`;

  const result = md.render(text);

  fs.writeFile("README.md", result, function (err) {
    if (err) return console.log(err);
    console.log(`${result} > README.md`);
  });
})();

async function loadBlogPosts() {
  const feed = await parser.parseURL(feedUrl);

  let links = "";

  feed.items.slice(0, blogPostLimit).forEach((item) => {
    links += `<li><a href=${item.link}>${item.title}</a></li>`;
  });

  return `
  <ul>
    ${links}
  </ul>\n
  [:arrow_right: More blog posts](${websiteUrl})
  `;
}
