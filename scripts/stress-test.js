
import { sleep } from "k6";
import { testConfig } from "./config.js";
import { Rate } from "k6/metrics"
import { Auth } from "./resourceObjectModel/auth/auth.js";
import { UserManagement } from "./resourceObjectModel/user-management/user-management.js";
import { Feed } from "./resourceObjectModel/feed/feed.js";
import { PostManagement } from "./resourceObjectModel/post-management/post-management.js";
export var options = testConfig.testScenario.someTest
var environment = testConfig.environment.dev

export let errorRate = new Rate("Failed")

export function setup() {
  console.log(">>>>>>>>>>>>> STARTING <<<<<<<<<<<<<<")
}

export default async function () {
  const vusId = __VU;
  const auth = new Auth({ endpoint: environment.url, vusId })
  auth.signinGuest()
  const token = auth.getToken()
  // const userManagement = new UserManagement({ endpoint: environment.url, vusId, token })
  // userManagement.getProfile()
  // userManagement.getUsers()
  const postManagement = new PostManagement({ endpoint: environment.url, vusId, token })
  // postManagement.getTags()
  // await postManagement.getTestPostsAsync()
  postManagement.getTestPosts()
  // postManagement.getPostsByUserId("9706cd38-db9a-49a5-966f-1b417479fae2")
  // postManagement.getPlaylists({ placement: "vertical" })
  // await postManagement.getGenresAsync()
  // const feed = new Feed({ endpoint: environment.url, vusId, token })
  // await postManagement.getPosts()
  // await postManagement.getAudios()
  // await postManagement.getPlaylists({ placement: "vertical" })
  // await postManagement.getPlaylistPosts()
  // feed.getFeeds()
  sleep(1)
}

export function teardown() {

  console.log(">>>>>>>>>>>>> TESTING COMPLETED <<<<<<<<<<<<<<")
}