
import { sleep } from "k6";
import { testConfig } from "./config.js";
import { Rate } from "k6/metrics"
import { Api } from "./resourceObjectModel/api.js";
import { FeedManagement } from "./resourceObjectModel/feed/feed-management.js";
import { Auth } from "./resourceObjectModel/auth/auth.js";
import { Me } from "./resourceObjectModel/me/me.js";
export var options = testConfig.testScenario.singleRun
var environment = testConfig.environment.dev

export let errorRate = new Rate("Failed")

export function setup() {
  console.log(">>>>>>>>>>>>> STARTING <<<<<<<<<<<<<<")
}

export default function () {
  const vusId = __VU;
  const auth = new Auth({ endpoint: environment.url, vusId })
  auth.signin()
  const me = new Me()
  // var api = new Api(environment.url, vuId)
  // api.login()
  // api.addInterest()
  // api.profile()
  // const userId = api.getUserId()
  // if (!userId) {
  //   throw new Error("feedManagement is undefined: userId");
  // }
  // const token = api.getToken()
  // if (!token) {
  //   throw new Error("feedManagement is undefined: token");
  // }
  // const feedManagement = new FeedManagement(environment.url, token, vuId, userId)
  // feedManagement.getAll()
  // errorRate.add(!feedManagement.getResult())
  sleep(1)
}

export function teardown() {

  console.log(">>>>>>>>>>>>> TESTING COMPLETED <<<<<<<<<<<<<<")
}