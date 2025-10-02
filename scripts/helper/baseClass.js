import { check } from "k6";
import { Counter } from "k6/metrics";

export const errors = new Counter("status");
export class BaseClass {
  constructor({ endpoint, vusId }) {
    this.url = endpoint.concat("/");
    this.vusId = vusId
    this.result = null;
    this.token = null;
    this.params = null
    this.user = null
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
    this.user.id = id
  }
  getUser() {
    return this.user
  }
  checkResponseStatus(expectedStatus = 200, location = "default") {
    if (this.result.status !== expectedStatus) {
      console.error(`GET ${this.url}  failed with HTTP code ${this.result.status} location ${location} ${this.result.json()}`);
      errors.add(1, {
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
