import http from "k6/http";
import { check, sleep } from "k6";
import { Engagement } from "../engagement/engagement.js";
import { Counter } from "k6/metrics";
export const errors = new Counter("feed");
export class Feed extends Engagement {
  constructor({ endpoint, token, vusId }) {
    super({ endpoint, token, vusId });
    this.engagementUrl = this.url
    this.url = endpoint.concat("/feed/api/v0");
    this.feedUrl = this.url
    this.playlists = []
    this.circle = 0
  }
  async engage() {

    let posts = []

    if (this.result && this.result.body && this.result.body.length > 0) {
      try {
        posts = this.result.json()
      } catch (err) {
        console.error("Ошибка парсинга JSON:", err.message)
        posts = []
      }
    }
    while (posts.length) {
      this.setPosts(posts.filter((_, index) => index < 8))
      this.url = this.engagementUrl
      await this.getPostMetric()
      sleep(60 / 6)
      await this.postPostMetric()
      posts = posts.filter((_, index) => index > 7)
    }
    this.url = this.feedUrl
    this.circle++
  }
  async getFeeds() {
    this.result = await http.asyncRequest("GET", `${this.url}/user-posts?limit=1`, {}, this.params)
    this.checkResponseStatus(200, "Feed.getFeeds")
    check(this.result, {
      "Feed.getFeeds.isNotEmpty": (r) => {
        const ok = r.json().length > 0
        if (!ok) {
          errors.add(1)
        }
        return ok
      }
    })
    await this.engage()
  }
}