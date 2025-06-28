
import { sleep } from "k6";
import { testConfig } from "./config.js";
import { Rate } from "k6/metrics"
import { Api } from "./resourceObjectModel/api.js";
import { FeedManagement } from "./resourceObjectModel/feed/feed-management.js";
export var options = testConfig.testScenario.singleRun
var environment = testConfig.environment.dev


export let errorRate = new Rate("Failed")

export function setup() {
  console.log(">>>>>>>>>>>>> STARTING <<<<<<<<<<<<<<")
}

export default function () {
  const vuId = __VU;
  var api = new Api(environment.url, vuId)

  api.login()
  api.addInterest()
  // api.profile()
  const token = api.getToken()
  if (!token) {
    throw new Error("feedManagement is undefined: token");
  }
  const feedManagement = new FeedManagement(environment.url, token, vuId)
  feedManagement.getAll()
  errorRate.add(!feedManagement.getResult())
  sleep(1)
}

export function teardown() {

  console.log(">>>>>>>>>>>>> TESTING COMPLETED <<<<<<<<<<<<<<")
}