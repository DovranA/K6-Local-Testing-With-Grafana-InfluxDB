import http from "k6/http";
import { check, sleep } from "k6";
import { BaseClass } from "../helper/baseClass.js";
const tokens = {};
const userIds = {}
export class Api extends BaseClass {
  constructor(endpoint, vusId) {
    super(endpoint, vusId);
    this.authUrl = this.url.concat("public/user-management/api/v0");
    this.profileUrl = this.url.concat("/user-management/api/v0/users/me/profile")
  }
  login() {
    if (!tokens[this.vusId]) {
      const payload = JSON.stringify({})
      const params = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      this.result = http.post(`${this.authUrl}/signin-guest`, payload, params);
      check(this.result, {
        "login status was 200": (r) => r.status === 200
      });
      if (this.result.status === 200) {
        const token = this.result.json().token;
        this.setToken(token);
        tokens[this.vusId] = token;
        console.log("Token received:", token);
      } else {
        console.error(`Login failed with status ${this.result.status}`);
      }
    }
    this.setToken(tokens[this.vusId]);
  }
  addInterest() {
    if (!userIds[this.vusId]) {
      const params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`
        }
      };
      const body = {
        "tags": {
          "tmbiz": 1
        }
      }
      this.result = http.patch(`${this.authUrl}/users/interests`, JSON.stringify(body), params);
      console.log(this.result.json())
      check(this.result, {
        "profile status was 200": (r) => r.status === 200
      });
      sleep(5)
    }
  }
  profile() {
    if (!userIds[this.vusId]) {
      const params = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`
        }
      };
      this.result = http.get(this.profileUrl, params);
      check(this.result, {
        "profile status was 200": (r) => r.status === 200
      });
      if (this.result.status === 200) {
        const userId = this.result.json().id;
        this.setUserId(userId);
        userIds[this.vusId] = userId;
        console.log("userId received:", userId);
      } else {
        console.error(`Login failed with status ${this.result.status}`);
      }
    }
    this.setUserId(userIds[this.vusId]);
  }
}
