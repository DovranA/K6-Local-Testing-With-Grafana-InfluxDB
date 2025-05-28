import http from "k6/http";
import { check } from "k6";
import { BaseClass } from "../../helper/baseClass.js";

export class Auth extends BaseClass {
  constructor(endpoint, token) {
    super(endpoint);
    this.url = this.url.concat("/public/user-management/api/v0/signin-guest");
    this.token = token;
  }

  getToken() {
    this.result = http.get(this.url);
    check(this.result, {
      "status was 200": (r) => r.status === 200
    });

    this.checkResponseStatus();
  }

}