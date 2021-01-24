# Convert DEV Posts to Jekyll Markdown Post GitHub Action

This action does the following:

* Search for a DEV contributor's latest blog posts using the DEV API
* Check to see if the newest DEV post is newer than the latest post in the Jekyll repository
* If the DEV post is newer than the newest repository post, raise a pull request in the repository with the DEV post converted to Jekyll markdown.


## Installation

To use this action in your Jekyll blog post repository, you need to do the following:

* Add a `.github/workflows` folder to your repository
* Create a `dev-to-jekyll.yml` file in the folder
* Add the following inside the file:

```
name: Convert DEV Posts to Jekyll Markdown
on:
 schedule:
     # At midnight twice a week on Monday and Thursday
    - cron:  '0 0 * * 1,4'
jobs:
  dev-to-jekyll:
    runs-on: ubuntu-latest
    steps:
    - name: dev-to-jekyll
      uses: bencgreenberg/dev-posts-to-jekyll-markdown-action@main
    env:
      GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
      DEV_API_KEY: "${{ secrets.DEV_API_KEY }}"
      NUM_OF_POSTS: "${{ secrets.NUM_OF_POSTS }}"
```

* Add the following [secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) to your repository:
    * `DEV_API_KEY` *(Your API key from DEV.to)*
    * `REPO_OWNER` *(The owner of the repository, i.e. "jane")*
    * `REPO` *(Your repository name, i.e. "sample-repository")*
* Every Monday and Thursday at midnight this action will run. If there are any new DEV posts during that time, the action will create the relevant pull requests for you to review.

## Contributing

We welcome contributions! Please follow the [GitHub flow](https://guides.github.com/introduction/flow/) when introducing changes. If it recommended to open an Issue first, so it can be discussed and collaborated on before you start working on what you plan.

## LICENSE

This project is under the [MIT License](LICENSE.txt).

