import http from "k6/http";
import { check, sleep } from "k6";
import { BaseClass } from "../../helper/baseClass.js";
const pageInfo = {}
export class PostManagement extends BaseClass {
  constructor(endpoint, token, vusId) {
    super(endpoint, vusId);
    this.engagementUrl = this.url.concat("engagement/api/v0/user/engages");
    this.url = this.url.concat("post-management/api/v0/posts");
    this.token = token;
  }

  getAll() {
    const params = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
    console.log(`${this.url}?first=8${pageInfo[this.vusId] && pageInfo[this.vusId].has_next_page ? `&after=${pageInfo[this.vusId].end_cursor}` : ""}`)
    this.result = http.get(`${this.url}?first=8${pageInfo[this.vusId] && pageInfo[this.vusId].has_next_page ? `&after=${pageInfo[this.vusId].end_cursor}` : ""}`, params);
    check(this.result, {
      "status was 200": (r) => r.status === 200
    });
    pageInfo[this.vusId] = this.result.json().page_info
    this.checkResponseStatus();
    this.getPostMetrics()
    sleep(2 * 60)
    this.postPostMetrics()
  }
  getPostMetrics() {
    const idList = this.result.json().nodes.map((node) => node.id)
    const params = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
    const body = { post_id: idList }
    const res = http.post(`${this.engagementUrl}/read`, body, params);
    check(res, {
      "status was 200": (r) => r.status === 200
    });
    this.checkResponseStatus();
  }
  postPostMetrics() {
    const isBookmarked = Math.random() < 0.5;
    const isLiked = Math.random() < 0.5;
    const percentage = Math.floor(Math.random() * 100);
    const engageList = this.result.json().nodes.map((post) => ({ post_id: post.id, author_id: post.author_id, bookmarked: isBookmarked, liked: isLiked, viewed_at: new Date().toISOString(), view_percentage: percentage }));
    const params = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
    const body = { engages: engageList }
    const res = http.post(`${this.engagementUrl}/write`, body, params);
    check(res, {
      "status was 200": (r) => r.status === 200,
      "status was 201": (r) => r.status === 201,
      "success write": (r) => r.json().user_id === this.userId
    });
    this.checkResponseStatus();
  }
}