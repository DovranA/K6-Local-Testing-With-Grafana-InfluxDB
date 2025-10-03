import { BaseClass } from "../../helper/baseClass.js";
import http from "k6/http"
export class UserManagement extends BaseClass {
    constructor({ endpoint, vusId, token }) {
        super({ endpoint, vusId, token })
        this.url = endpoint.concat("/user-management/api/v0")
    }
    async getUsers() {
        this.result = await http.asyncRequest("GET", `${this.url}/users`, {}, this.params)
        this.checkResponseStatus(200, "User.getUsers")
    }
    async getProfile() {
        this.result = await http.asyncRequest("GET", `${this.url}/users/me/profile`, {}, this.params);
        this.checkResponseStatus(200, "Me.getProfile")
        const user = this.result.json()
        this.setUser({ id: user.id })
    }
}