
import { sleep } from "k6";
import { testConfig } from "./config.js";
import { Rate } from "k6/metrics"
import { Auth } from "./resourceObjectModel/auth/auth.js";
import { UserManagement } from "./resourceObjectModel/user-management/user-management.js";
import { PostManagement } from "./resourceObjectModel/post-management/post-management.js";
import { Feed } from "./resourceObjectModel/feed/feed.js";
export var options = testConfig.testScenario.singleRun
var environment = testConfig.environment.dev

export let errorRate = new Rate("Failed")

export function setup() {
  console.log(">>>>>>>>>>>>> STARTING <<<<<<<<<<<<<<")
}

export default async function () {
  const vusId = __VU;
  const auth = new Auth({ endpoint: environment.url, vusId })
  await auth.signinGuest()
  const token = auth.getToken()

  const userManagement = new UserManagement({ endpoint: environment.url, vusId, token })
  await userManagement.getProfile()
  await userManagement.getUsers()
  // const postManagement = new PostManagement({ endpoint: environment.url, vusId, token })
  const feed = new Feed({ endpoint: environment.url, vusId, token })
  // await postManagement.getPosts()
  // await postManagement.getAudios()
  // await postManagement.getPlaylists({ placement: "vertical" })
  // await postManagement.getPlaylistPosts()
  await feed.getFeeds()
  sleep(1)
}

export function teardown() {

  console.log(">>>>>>>>>>>>> TESTING COMPLETED <<<<<<<<<<<<<<")
}