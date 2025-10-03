import http from "k6/http";
import { BaseClass } from "../../helper/baseClass.js";
import { uuidv4 } from "../../helper/uuid-generator.js";
import { sleep } from "k6";
const tokens = {};
const userList = [
  {
    password: "12345678",
    phone: "+99363361498"
  },
  {
    password: "12345678",
    phone: "+99362620629"
  }
]
export class Auth extends BaseClass {
  constructor({ endpoint, vusId }) {
    super({ endpoint, vusId });
    this.url = endpoint.concat("/public/user-management/api/v0");
    this.publicUrl = this.url
    this.userManagement = endpoint.concat("/user-management/api/v0")
  }
  signin() {
    if (!tokens[this.vusId]) {
      const user = userList[Math.floor(Math.random() * userList.length)]
      user.device_id = uuidv4()
      this.result = http.request("POST", `${this.url}/signin`, this.toJson(user), { headers: { Accept: "application/json", "Content-Type": "application/json", } })
      const token = this.result.json().access_token;
      this.setToken(token);
      tokens[this.vusId] = token;
      this.checkResponseStatus(200, "Auth.signin")
    }
    this.setToken(tokens[this.vusId]);
  }
  async signinAsync() {
    if (!tokens[this.vusId]) {
      const user = userList[Math.floor(Math.random() * userList.length)]
      user.device_id = uuidv4()
      this.result = await http.asyncRequest("POST", `${this.url}/signin`, this.toJson(user), { headers: { Accept: "application/json", "Content-Type": "application/json", } })
      const token = this.result.json().access_token;
      this.setToken(token);
      tokens[this.vusId] = token;
      this.checkResponseStatus(200, "Auth.signin")
    }
    this.setToken(tokens[this.vusId]);
  }
  signinGuest() {
    if (!tokens[this.vusId]) {
      this.result = http.request("POST", `${this.url}/signin-guest`, {}, { headers: { Accept: "application/json", "Content-Type": "application/json", } })
      const token = this.result.json().access_token;
      this.setToken(token);
      tokens[this.vusId] = token;
      this.checkResponseStatus(200, "Auth.signinGuest")
      this.addInterestAsync()
    }
    this.setToken(tokens[this.vusId]);
  }
  async signinGuestAsync() {
    if (!tokens[this.vusId]) {
      this.result = await http.asyncRequest("POST", `${this.url}/signin-guest`, {}, { headers: { Accept: "application/json", "Content-Type": "application/json", } })
      const token = this.result.json().access_token;
      this.setToken(token);
      tokens[this.vusId] = token;
      this.checkResponseStatus(200, "Auth.signinGuest")
      await this.addInterestAsync()
    }
    this.setToken(tokens[this.vusId]);
  }
  addInterest() {
    this.url = this.userManagement
    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens[this.vusId]}`
      }
    };
    const list = ["sport", "aksesuar", "konkurs", "hojalykharytlar"]
    const rand = this.generateTwoDifferentRandoms(0, 3)
    const rand1 = Number(rand[0])
    const rand2 = Number(rand[1])
    const tags = new Set()
    tags.add(list[rand1])
    tags[list[rand1]] = 1
    tags.add(list[rand2])
    tags[list[rand2]] = 1
    const body = {
      "tags": tags
    }
    this.result = http.request("PATCH", `${this.userManagement}/users/interests`, this.toJson(body), params);
    this.checkResponseStatus(200, "Auth.addInterest")
    sleep(5)
    this.url = this.publicUrl
  }
  async addInterestAsync() {
    this.url = this.userManagement
    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens[this.vusId]}`
      }
    };
    const list = ["sport", "aksesuar", "konkurs", "hojalykharytlar"]
    const rand = this.generateTwoDifferentRandoms(0, 3)
    const rand1 = Number(rand[0])
    const rand2 = Number(rand[1])
    const tags = new Set()
    tags.add(list[rand1])
    tags[list[rand1]] = 1
    tags.add(list[rand2])
    tags[list[rand2]] = 1
    const body = {
      "tags": tags
    }
    this.result = await http.asyncRequest("PATCH", `${this.userManagement}/users/interests`, this.toJson(body), params);
    this.checkResponseStatus(200, "Auth.addInterest")
    sleep(5)
    this.url = this.publicUrl
  }
  generateTwoDifferentRandoms(min, max) {

    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2;

    do {
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (num1 === num2);

    return [num1, num2];
  }
}