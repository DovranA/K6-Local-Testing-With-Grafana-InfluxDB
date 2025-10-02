import http from "k6/http";
import { check, sleep } from "k6";
import { BaseClass } from "../../helper/baseClass.js";
import { Counter } from "k6/metrics";
export const errors = new Counter("errors");
export class FeedManagement extends BaseClass {
  constructor(endpoint, token, vusId, userId) {
    super(endpoint, vusId, token);
    this.engagementUrl = this.url.concat("engagement/api/v0/user/engages");
    this.url = this.url.concat("feed/api/v0/user-posts");
    this.token = token;
    this.userId = userId;
  }

  getAll() {
    this.result = http.get(`${this.url}?limit=10`, this.params);
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
    this.checkResponseStatus(200);
    this.getPostMetrics()
    sleep(16)
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
    const duplicates = this.findDuplicateIds(this.result.json())
    if (duplicates.length) {
      console.log("🚀 ~ FeedManagement ~ postPostMetrics ~ duplicates:", duplicates, " ", this.userId)
    }
    const engageList = this.result.json()?.map((i, index) => {
      const { post_id, author_id, author_full_name, author_avatar_url } = i;
      const date = new Date();
      const viewed_at_set = date.setMinutes(date.getMinutes() + index);
      const viewed_at = new Date(viewed_at_set).toISOString()
      const view_percentage = Math.floor(Math.random() * 100);
      const bookmarked = Math.floor(Math.random() * 100) > 50
      const liked = Math.floor(Math.random() * 100) > 50
      const reposted = Math.floor(Math.random() * 100) > 50
      return {
        post_id,
        author_id,
        author_full_name,
        author_avatar_url,
        bookmarked,
        liked,
        viewed_at,
        view_percentage: view_percentage === 0 ? 5 : view_percentage,
        reposted
      };
    }) ?? [];

    const params = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    };

    const res2 = http.post(`${this.engagementUrl}/write`, JSON.stringify({ engages: engageList }), params);
    if (res2.status !== 201) {
      console.log(res2.json())
    }

    if (res2.json()?.detail?.[0].msg === "already viewed post") {
      console.log(res2.json())
    }
    check(res2, {
      "success write engagement ": (r) => {
        const ok = r.status === 201
        return ok
      },
    });
    this.checkResponseStatus();
  }
  findDuplicateIds(arr) {
    const idCount = new Map();
    arr.forEach(item => {
      idCount.set(item.post_id, (idCount.get(item.post_id) || 0) + 1);
    });
    const duplicates = Array.from(idCount.entries())
      .filter(([_, count]) => count > 1)
      .map(([post_id]) => post_id);
    return duplicates;
  }
}