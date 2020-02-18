const { Toolkit } = require('actions-toolkit')
const dotenv = require("dotenv");
dotenv.config();
const axios = require('axios').default;

Toolkit.run(async tools => {

  // Print out the context in Actions dashboard
  // console.log(tools.context);

  // Assign owner and repo data to variables
  const owner = tools.context.payload.repository.owner.login;
  const repo = tools.context.payload.repository.name;
  console.log(`THIS IS THE OWNER: ${owner} AND THIS IS THE REPO: ${repo}`);

  // Get Latest DEV Posts

  // Create DEV variables
  var devPosts; // All posts
  var devPostDate; // Date of most recently published DEV post
  var devPostTitle; // Title of most recently published DEV post
  var numOfDevPosts; // Count of DEV posts
  var headers = {
    "Content-Type": "application/json",
    "api-key": `${process.env.DEV_API_KEY}`
  }
  const getData = () => {
    return axios({
      method: 'get',
      url: 'https://dev.to/api/articles/me?page=1&per_page=6',
      headers: headers
    })
  };
  // Assign DEV data
  devPosts = (await getData()).data;
  devPostDate = devPosts[0]['published_at']; // ex. 2020-02-12T12:45:27.741Z
  devPostTitle = devPosts[0]['title'];
  // Count number of DEV posts
  numOfDevPosts = devPosts.length;

  // Repository _posts folder data

  // Get contents of _posts folder

  // Create variables
  var path = '_posts';
  var posts; // All posts in repo
  var postsCount; // Count of posts in repo
  var postTitle; // Latest repo post title
  var postDate; // Latest repo post date

  posts = (await tools.github.repos.getContents({
    owner,
    repo,
    path
  })).data;

  // Count the number of posts in repo posts folder 
  postsCount = posts.length;

  // Get the date and title of latest blog post in repo
  postTitle = posts[0].slice(11).split('.')[0].split('-').join(' ');
  postDate = posts[0].slice(0.10);

  console.log(`${postTitle} AND ${postDate}`);

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
