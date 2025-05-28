import { sleep } from "k6";
import { testConfig } from "./config.js";
import { Api } from "./resourceObjectModel/api.js";
import { PostManagement } from "./resourceObjectModel/post-management/PostManagement.js";
import { Rate } from "k6/metrics"
export var options = testConfig.testScenario.bigTest
var envireonment = testConfig.environment.dev
// var api = new Api(envireonment.url)

export let errorRate = new Rate("Failed")

export function setup() {
  console.log(">>>>>>>>>>>>> STARTING <<<<<<<<<<<<<<")
  // api.login();
  // const token = api.getResult().json().token;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzkwOTAwNjUsImlhdCI6MTczOTAwMzY2NSwiaXNzIjoidXNlci1zZXJ2aWNlIiwic3ViIjoiMTE5NzQ3MGEtOTUzZS00YmU5LWI1ZDQtYzQ3NTBhOTc1NWFlIn0.HUkFu15COqpTC-fDz4DWuxWs9GuUEYskWHJbwx_3Z84';
  if (!token) {
    throw new Error("Failed to retrieve token");
  }
  return token
}

export default function (token) {
  if (!token) {
    throw new Error("postManagement is undefined");
  }
  const postManagement = new PostManagement(envireonment.url, token)
  postManagement.getAll()
  errorRate.add(!postManagement.getResult())
  sleep(1)
  postManagement.getFirstItem()
  errorRate.add(!postManagement.getToken())
  sleep(1)
}

export function teardown(data) {
  console.log(">>>>>>>>>>>>> TESTING COMPLETED <<<<<<<<<<<<<<")
}