const { Toolkit } = require("actions-toolkit");
const nock = require("nock");
const axios = require("axios");
jest.mock("axios");

process.env.GITHUB_WORKFLOW = "test";
process.env.GITHUB_ACTION = "dev-to-jekyll";
process.env.GITHUB_ACTOR = "test_actor";
process.env.GITHUB_REPOSITORY = "benhayehudi/sample_site";
process.env.GITHUB_EVENT_NAME = "opened";
process.env.GITHUB_EVENT_PATH = __dirname + "/fixtures/push-to-branch.json";
process.env.GITHUB_WORKSPACE = "/tmp";
process.env.GITHUB_SHA = "abc123";
process.env.DEV_API_KEY = "def123";

// Config variables for the action
process.env.GH_ADMIN_TOKEN = "this-will-not-work-as-a-token";
process.env.PR_TARGET_ORG = "demo";
process.env.PR_TARGET_REPO = "sample_site";
process.env.PR_TARGET_BRANCH = "master";
process.env.PR_BRANCH_NAME = "dev_to_jekyll";
process.env.PR_TITLE = "Automated Dev to Jekyll PR Test";

let owner = process.env.PR_TARGET_ORG;
let repo = process.env.PR_TARGET_REPO;
let target_branch = process.env.PR_TARGET_BRANCH;
let pr_branch_name = process.env.PR_BRANCH_NAME;
let pr_title = process.env.PR_TITLE;

let devData = [
  {
    "type_of": "string",
    "id": 0,
    "title": "string",
    "description": "string",
    "cover_image": "string",
    "published": true,
    "published_at": "2020-02-20T06:50:06Z",
    "tag_list": [
      "string"
    ],
    "slug": "string",
    "path": "string",
    "url": "string",
    "canonical_url": "string",
    "comments_count": 0,
    "positive_reactions_count": 0,
    "page_views_count": 0,
    "published_timestamp": "2020-02-20T06:50:06Z",
    "user": {
      "name": "string",
      "username": "string",
      "twitter_username": "string",
      "github_username": "string",
      "website_url": "string",
      "profile_image": "string",
      "profile_image_90": "string"
    },
    "organization": {
      "name": "string",
      "username": "string",
      "slug": "string",
      "profile_image": "string",
      "profile_image_90": "string"
    },
    "flare_tag": {
      "name": "string",
      "bg_color_hex": "string",
      "text_color_hex": "string"
    }
  }
]

describe("DEV to Jekyll Markdown Automated PRs", () => {
  let tools;

  // Mock Toolkit.run to define `action` so we can call it
  Toolkit.run = jest.fn(actionFn => {
    action = actionFn;
  });

  // Load up our entrypoint file
  require(".");

  beforeEach(() => {
    tools = new Toolkit();

    tools.log.debug = jest.fn();
    tools.log.info = jest.fn();
    tools.log.pending = jest.fn();
    tools.log.complete = jest.fn();
    tools.log.success = jest.fn();
    tools.log.warn = jest.fn();

    tools.exit.success = jest.fn();
    tools.exit.failure = jest.fn();
  });

  it("new branch, new PR", async () => {
    mockGetData();
    axios.get.mockResolvedValue({ data: devData });
    var devPosts = devData;
    console.log(`HERE IT IS: ${JSON.stringify(devPosts)}`)

    mockTargetBranchAlreadyExistsOnParent(false);
    mockCreateTargetBranch();
    mockGetParentBranch();
    mockCommit("sha-of-current-master-in-parent");
    mockPulls(false);
    mockCreatePull();
    await action(tools);
    expect(tools.log.success).toHaveBeenCalledWith("PR created");
    expect(tools.exit.success).toHaveBeenCalledWith("Processing complete");
  });

  it("existing branch, new PR", async () => {
    mockGetData();
    axios.get.mockResolvedValue({ data: devData });
    var devPosts = devData;
 
    mockTargetBranchAlreadyExistsOnParent(true);
    mockCompareCommits(1);
    mockGetParentBranch();
    mockCommit("sha-of-current-master-in-parent");
    mockUpdateTargetBranch();
    mockPulls(false);
    mockCreatePull();
    await action(tools);
    expect(tools.log.success).toHaveBeenCalledWith("PR created");
    expect(tools.exit.success).toHaveBeenCalledWith("Processing complete");
  });
});

function mockGetData() {
  var headers = {
    "Content-Type": "application/json",
    "api-key": `${process.env.DEV_API_KEY}`
  };
  axios({
    method: 'get',
    url: 'https://dev.to/api/articles/me?page=1&per_page=6',
    headers: headers
  });
  axios.mockReturnValue(() =>
    Promise.resolve({
      data: devData
    })
  );            
}

function mockGetParentBranch() {
  nock("https://api.github.com")
    .get(`/repos/${owner}/${repo}/branches/${target_branch}`)
    .reply(200, {
      commit: { sha: "sha-of-current-master-in-parent" }
    });
}

function mockCompareCommits(requiredCommits) {
  requiredCommits = requiredCommits || 1;
  let commits = [{ sha: "sha-of-submodule-commit" }];

  for (let i = 1; i < requiredCommits; i++) {
    commits.push({
      sha: `sha-of-additional-content-that-prevents-force-push-${i}`
    });
  }

  nock("https://api.github.com")
    .get(`/repos/${owner}/${repo}/compare/${target_branch}...${pr_branch_name}`)
    .reply(200, {
      commits
    });
}

function mockCommit(parent_commit) {
  nock("https://api.github.com")
    .post(`/repos/${owner}/${repo}/git/commits`, {
      message: "Automated DEV to Jekyll Markdown test",
      tree: "sha-of-new-tree-in-parent",
      parents: [parent_commit]
    })
    .reply(200, {
      sha: "sha-of-commit-in-parent"
    });
}

function mockTargetBranchAlreadyExistsOnParent(exists) {
  let response = [];
  if (exists) {
    response.push({ branch: "dev_to_jekyll" });
  }

  nock("https://api.github.com")
    .get(`/repos/${owner}/${repo}/git/refs/heads/${pr_branch_name}`)
    .reply(200, response);
}

function mockCreateTargetBranch() {
  nock("https://api.github.com")
    .post(`/repos/${owner}/${repo}/git/refs`, {
      force: true,
      ref: `refs/heads/${pr_branch_name}`,
      sha: "sha-of-commit-in-parent"
    })
    .reply(200, {
      sha: "sha-of-new-tree-in-parent"
    });
}

function mockUpdateTargetBranch() {
  nock("https://api.github.com")
    .patch(`/repos/${owner}/${repo}/git/refs/heads/${pr_branch_name}`, {
      force: true,
      sha: "sha-of-commit-in-parent"
    })
    .reply(200, {
      sha: "sha-of-new-tree-in-parent"
    });
}

function mockPulls(exists) {
  let response = [];
  if (exists) {
    response.push({ number: "1989" });
  }

  nock("https://api.github.com")
    .get(`/repos/${owner}/${repo}/pulls?head=dev_to_jekyll%3Automated-Dev-to-Jekyll-PR-Test`)
    .reply(200, response);
}

function mockCreatePull() {
  nock("https://api.github.com")
    .post(`/repos/${owner}/${repo}/pulls`, {
      title: pr_title,
      head: pr_branch_name,
      base: target_branch
    })
    .reply(200, { number: "1989" });
}
