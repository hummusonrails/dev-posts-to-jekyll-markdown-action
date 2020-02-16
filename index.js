const { Toolkit } = require('actions-toolkit')
const dotenv = require("dotenv");
dotenv.config();
const fetch = require("node-fetch");

// Create variable to hold DEV Posts
var devPosts;

// Get Latest DEV Posts
var headers = {
  "Content-Type": "application/json",
  "api-key": `${process.env.DEV_API_KEY}`
}
fetch('https://dev.to/api/articles/me?page=1&per_page=6', { method: 'GET', headers: headers})
  .then(res => res.json())
  .then(data => devPosts = data)
  .then(() => console.log(`DEVPOSTS VARIABLE DATA: ${devPosts}`));

// Get date and title of latest blog post
let devPostDate = devPosts[0]['published_at'];
let devPostTitle = devPosts[0]['title'];
console.log(`DATE OF POST: ${devPostDate} AND TITLE OF POST ${devPostTitle}`);

// // Count number of DEV posts
numOfDevPosts = devPosts.length;
console.log(`NUMBER OF DEV POSTS: ${numOfDevPosts}`);

// Run your GitHub Action!
Toolkit.run(async tools => {
    // Print out the context in Actions dashboard
    // console.log(tools.context);

    // Assign owner and repo data to variables
    const owner = tools.context.payload.repository.owner.login;
    const repo = tools.context.payload.repository.name;
    console.log(`THIS IS THE OWNER: ${owner} AND THIS IS THE REPO: ${repo}`);

    // Get contents of _posts folder
    let path = '_posts';
    let posts = (await tools.github.repos.getContents({
      owner,
      repo,
      path
    })).data;
    console.log(`HERE ARE THE POSTS: ${JSON.stringify(posts)}`);

    // Count the number of posts in repo posts folder 

    // Get the date and title of latest blog post in repo

    // Get the path to the last blog post in repo

    // Check to see if the repo posts folder has less posts than ${NUM_OF_POSTS} and count of DEV posts

    // If yes, raise a PR that adds x - ${COUNT OF POSTS IN REPO} num of DEV posts to repo as markdown files

    // If not, do nothing

    // Check to see if the latest DEV post is newer than the latest repo post

    // If yes, raise a PR that deletes the last blog post, 
    // adds a markdown file for the newest DEV post,
    // and increments the post num for the remaining posts by 1
    // (i.e. 2020-02-03-post-3 becomes 2020-02-03-post-4)

    // If not, do nothing


});
