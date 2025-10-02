import http from "k6/http";
import { BaseClass } from "../../helper/baseClass.js";
import { uuidv4 } from "../../helper/uuid-generator.js";
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
    this.url = this.url.concat("/public/user-management/api/v0/signin");
  }
  signin() {
    if (!tokens[this.vusId]) {
      const user = userList[Math.floor(Math.random() * userList.length)]
      user.device_id = uuidv4()
      this.result = http.post(this.url, this.toJson(user), { headers: { Accept: "application/json", "Content-Type": "application/json", } })
      const token = this.result.json().access_token;
      this.setToken(token);
      tokens[this.vusId] = token;
      this.checkResponseStatus(200, "Auth.signin")
    }
    this.setToken(tokens[this.vusId]);
  }

}