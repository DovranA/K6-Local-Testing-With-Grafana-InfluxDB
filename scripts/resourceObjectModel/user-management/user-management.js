import { BaseClass } from "../../helper/baseClass.js";
import http from "k6/http"
export class UserManagement extends BaseClass {
    constructor({ endpoint, vusId, token }) {
        super({ endpoint, vusId, token })
        this.url = endpoint.concat("/user-management/api/v0")
    }
    async getUsersAsync() {
        this.result = await http.asyncRequest("GET", `${this.url}/users`, {}, this.params)
        this.checkResponseStatus(200, "User.getUsers")
    }
    getUsers() {
        this.result = http.request("GET", `${this.url}/users`, {}, this.params)
        this.checkResponseStatus(200, "User.getUsers")
    }
    getProfile() {
        this.result = http.request("GET", `${this.url}/users/me/profile`, {}, this.params);
        this.checkResponseStatus(200, "Me.getProfile")
        if (this.result.headers["Content-Type"]?.includes("application/json")) {
            const user = this.result.json();
            this.setUser({ id: user?.id });
        } else {
            console.error("Non-JSON response:", this.result.body);
        }
    }
    async getProfileAsync() {
        this.result = await http.asyncRequest("GET", `${this.url}/users/me/profile`, {}, this.params);
        this.checkResponseStatus(200, "Me.getProfile")
        if (this.result.headers["Content-Type"]?.includes("application/json")) {
            const user = this.result.json();
            this.setUser({ id: user?.id });
        } else {
            console.error("Non-JSON response:", this.result.body);
        }
    }
}