import { BaseClass } from "../../helper/baseClass.js";
import http from "k6/http"
export class Engagement extends BaseClass {
    constructor({ endpoint, vusId, token }) {
        super({ endpoint, vusId, token })
        this.url = endpoint.concat("/engagement/api/v0")
        this.posts = []
    }
    setPosts(posts) {
        if (Array.isArray(posts))
            this.posts = posts ?? []
    }

    async getPostMetric() {
        const body = { post_id: this.posts?.map(i => i?.id) ?? [] }
        this.result = await http.asyncRequest("POST", `${this.url}/user/engages/read`, this.toJson(body), this.params);
        this.checkResponseStatus(200, "Engagement.getPostMetric");
    }
    async getTotalViews() {
        const body = { post_id: this.posts?.map(i => i?.id) ?? [] }
        this.result = await http.asyncRequest("POST", `${this.url}/user/engages/total-views`, this.toJson(body), this.params);
        this.checkResponseStatus(200, "Engagement.getTotalViews");
    }
    async postPostMetric() {
        const body = {
            engages: this.posts?.map((i, index) => {
                const { id: post_id1, post_id: post_id2, author_id, author_full_name, author_avatar_url } = i;
                let post_id
                if (post_id1) {
                    post_id = post_id1
                }
                if (post_id2) {
                    post_id = post_id2
                }
                const date = new Date();
                const viewed_at_set = date.setMinutes(date.getMinutes() + index);
                const viewed_at = new Date(viewed_at_set).toISOString()
                const view_percentage = Math.floor(Math.random() * 100);
                const bookmarked = Math.floor(Math.random() * 100) > 50
                const liked = Math.floor(Math.random() * 100) > 50
                const reposted = false
                return {
                    post_id,
                    author_id,
                    author_full_name,
                    author_avatar_url,
                    bookmarked,
                    liked,
                    viewed_at,
                    view_percentage: view_percentage === 0 ? 5 : view_percentage,
                    reposted
                };
            }) ?? []
        }
        this.result = await http.asyncRequest("POST", `${this.url}/user/engages/write`, this.toJson(body), this.params);
        this.checkResponseStatus(201, "Engagement.postPostMetric")
    }
}