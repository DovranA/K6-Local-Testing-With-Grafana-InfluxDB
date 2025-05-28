

export class BaseClass {
  constructor(endpoint, vusId) {
    this.url = endpoint.concat("/");
    this.vusId = vusId
    this.result = null;
    this.token = null;
    this.userId = null;
  }
  setUserId(userId) {
    this.userId = userId
  }
  setToken(token) {
    this.token = token;
  }
  getToken() {
    return this.token
  }
  getUserId() {
    return this.userId
  }
  checkResponseStatus(expectedStatus = 200) {
    if (this.result.status !== expectedStatus) {
      console.error(`GET ${this.url} failed with HTTP code ${this.result.status} ${this.result.json()}`);
    }
  }
  getResult() {
    return this.result;
  }
}
