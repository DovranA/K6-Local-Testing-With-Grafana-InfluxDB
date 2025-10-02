import { check } from "k6";
import { Rate } from "k6/metrics";

export const errorRate = new Rate("errors");
export class BaseClass {
  constructor({ endpoint, vusId, token }) {
    this.url = endpoint.concat("/");
    this.vusId = vusId
    this.result = null;
    this.token = token;
    this.params = null
    this.user = null
    this.params = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    };
  }
  setToken(token) {
    this.token = token;
    this.params = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    };
  }
  getToken() {
    return this.token
  }
  setUser({ id }) {
    this.user = { id }
  }
  getUser() {
    return this.user
  }
  checkResponseStatus(expectedStatus = 200, location = "default") {
    if (this.result.status !== expectedStatus) {
      let body;
      try {
        body = this.result.json();
      } catch (e) {
        body = this.result.body;
      }
      console.error(`${this.result.request.method} ${this.url}  failed with HTTP code ${this.result.status} location ${location} ${body}`);
      errorRate.add(1, {
        status: String(this.result.status),
        location: location,
      })
    }
    check(this.result, {
      [`${location} status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    })
  }
  toJson(params) {
    return JSON.stringify(params)
  }
}
