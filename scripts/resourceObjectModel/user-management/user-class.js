import { BaseClass } from "../../helper/baseClass.js";
import http from "k6/http"
export class UserManagement extends BaseClass {
    constructor({ endpoint, vusId, token }) {
        super({ endpoint, vusId, token })
        this.url = endpoint.concat("/user-management/api/v0")
    }
    getUsers() {
        this.result = http.get(`${this.url}/users`, this.params)
        this.checkResponseStatus(200, "User.getUsers")
    }
    getProfile() {
        this.result = http.get(`${this.url}/users/me/profile`, this.params);
        this.checkResponseStatus(200, "Me.getProfile")
        const user = this.result.json()
        this.setUser({ id: user.id })
    }
}