import http from "k6/http";
import { sleep } from "k6";
import { Engagement } from "../engagement/engagement.js";
export class PostManagement extends Engagement {
  constructor({ endpoint, token, vusId }) {
    super({ endpoint, token, vusId });
    this.engagementUrl = this.url
    this.url = endpoint.concat("/post-management/api/v0");
    this.postManagementUrl = this.url
  }
  getPosts() {
    this.url = this.postManagementUrl
    this.result = http.get(`${this.url}/posts`, this.params)
    this.checkResponseStatus(200, "PostManagement.getPosts")
    let posts = this.result?.json().nodes ?? []
    while (posts.length) {
      console.log(posts.length)
      this.setPosts(posts.filter((_, index) => index < 8))
      this.url = this.engagementUrl
      this.getPostMetric()
      sleep(60 / 6)
      this.postPostMetric()
      posts = posts.filter((_, index) => index > 7)
    }

  }
}