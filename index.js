const { Toolkit } = require('actions-toolkit')
const dotenv = require("dotenv");
dotenv.config();
const fetch = require("node-fetch");
const devurl = "https://dev.to/api/articles/me"

// Create variable to hold DEV Posts
let devPosts = [];

// Get Latest DEV Posts
let headers = {
  "Content-Type": "application/json",
  "api-key": `${process.env.DEV_API_KEY}`
}
let query = {
  "page": "1",
  "per_page": "6"
}
const getData = async devurl => {
  try {
    const response = await fetch(devurl, { method: 'GET', headers: headers, body: query});
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
};
devPosts = getData(url);
console.log(devPosts);

// Run your GitHub Action!
Toolkit.run(async tools => {
    // Print out the context in Actions dashboard
    console.log(tools.context);

    // Assign data to variables
    const owner = tools.context.payload.repository.owner.login;
    const repo = tools.context.payload.repository.name;

    console.log(`THIS IS THE OWNER: ${owner} AND THIS IS THE REPO: ${repo}`);
});
