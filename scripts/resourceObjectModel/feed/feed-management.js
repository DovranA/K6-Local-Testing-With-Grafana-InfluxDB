import http from "k6/http";
import { check, sleep } from "k6";
import { BaseClass } from "../../helper/baseClass.js";
import { Counter } from "k6/metrics";
export const errors = new Counter("errors");
export class FeedManagement extends BaseClass {
  constructor(endpoint, token, vusId) {
    super(endpoint, vusId);
    this.engagementUrl = this.url.concat("engagement/api/v0/user/engages");
    this.url = this.url.concat("feed/api/v0/user-posts");
    // this.userId = userId
    this.token = token;
  }

  getAll() {
    const params = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
    this.result = http.get(`${this.url}?limit=8`, params);
    // console.log(`${this.url}?limit=8`, this.result.json().length)
    check(this.result, {
      "status was 200": (r) => r.status === 200,
      "feed not empty": (r) => {
        const ok = r.json().length > 0
        if (!ok) {
          errors.add(1)
        }
        return ok
      }
    });
    this.checkResponseStatus();
    this.getPostMetrics()
    sleep((1 * 60) / 5)
    this.postPostMetrics()
  }
  getPostMetrics() {
    const idList = this.result.json().map((node) => node.post_id)
    const params = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    };
    const body = { post_id: idList }
    const res1 = http.post(`${this.engagementUrl}/read`, JSON.stringify(body), params);
    check(res1, {
      "success read engagement": (r) => r.status === 200,
    });
    this.checkResponseStatus();

  }
  postPostMetrics() {
    const isBookmarked = Math.random() < 0.5;
    const isLiked = Math.random() < 0.5;
    const percentage = Math.floor(Math.random() * 100);

    const engageList = this.result.json()?.map((post) => ({ post_id: post.post_id, author_id: post.author_id, author_full_name: post.author_full_name, author_avatar_url: post.author_avatar_url, bookmarked: isBookmarked, liked: isLiked, viewed_at: new Date().toISOString(), view_percentage: percentage })) ?? [];
    const params = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    };
    const res2 = http.post(`${this.engagementUrl}/write`, JSON.stringify({ engages: engageList }), params);
    check(res2, {
      "success write engagement ": (r) => r.status === 201,
      // "success write": (r) => r.json().user_id === this.userId
    });
    // console.log(res2.json())
    this.checkResponseStatus();
  }
}