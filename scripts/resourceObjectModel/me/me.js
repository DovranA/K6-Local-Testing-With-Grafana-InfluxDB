import { BaseClass } from "../../helper/baseClass";

export class Me extends BaseClass {
    constructor({ endpoint, vusId }) {
        super({ endpoint, vusId });
        this.url = this.url.concat("feed/api/v0/user-posts");
    }
    getProfile() {
        this.result = http.get(`${this.url}`, this.params);
        this.checkResponseStatus(200, "Me.getProfile")
        const user = this.result.json()
        this.setUser({ id: user.id })
    }
}