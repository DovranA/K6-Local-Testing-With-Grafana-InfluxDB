import http from "k6/http";
import { sleep } from "k6";
import { Engagement } from "../engagement/engagement.js";
export class PostManagement extends Engagement {
  constructor({ endpoint, token, vusId }) {
    super({ endpoint, token, vusId });
    this.engagementUrl = this.url
    this.url = endpoint.concat("/post-management/api/v0");
    this.postManagementUrl = this.url
    this.playlists = []
  }
  async engage(key) {
    let posts = this.result?.json()?.[key] ?? []
    while (posts.length) {
      this.setPosts(posts.filter((_, index) => index < 8))
      this.url = this.engagementUrl
      await this.getTotalViews()
      sleep(60 / 12)
      await this.getPostMetric()
      sleep(60 / 6)
      await this.postPostMetric()
      posts = posts.filter((_, index) => index > 7)
    }
    this.url = this.postManagementUrl
  }
  async getPosts() {
    this.result = await http.asyncRequest("GET", `${this.url}/posts`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPosts")
    await this.engage("nodes")
  }
  async getPlaylists({ placement }) {
    this.result = await http.asyncRequest("GET", `${this.url}/playlists?placement=${placement}`, {}, { headers: { ...this.params.headers, "accept-language": "tk" } })
    this.checkResponseStatus(200, "PostManagement.getPlaylists")
    this.playlists = this.result.json()?.playlists ?? []
    while (this.playlists.length) {
      await this.getPlaylistPosts()
    }
  }
  async getPlaylistPosts() {
    const playlist_id = this.playlists?.at(0)?.id
    this.result = await http.asyncRequest("GET", `${this.url}/playlists/${playlist_id}/contents?limit=12&current_page=1`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPlaylistPosts")
    if (this.result)
      await this.engage("items")
    this.playlists = this.playlists.filter((_, index) => index > 0)
  }
  async getAudios() {
    this.result = await http.asyncRequest("GET", `${this.url}/audios`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getAudios")
  }
  async getCategories() {
    this.result = await http.asyncRequest(`${this.url}/categories`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getCategories")
  }
}