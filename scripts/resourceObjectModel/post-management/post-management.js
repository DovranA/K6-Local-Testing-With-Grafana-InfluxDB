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
  engage(key) {
    let posts = this.result?.json()?.[key] ?? []
    while (posts.length) {
      this.setPosts(posts.filter((_, index) => index < 8))
      this.url = this.engagementUrl
      this.getTotalViews()
      sleep(60 / 12)
      this.getPostMetric()
      sleep(60 / 6)
      this.postPostMetric()
      posts = posts.filter((_, index) => index > 7)
    }
    this.url = this.postManagementUrl
  }
  async engageAsync(key) {
    let posts = this.result?.json()?.[key] ?? []
    while (posts.length) {
      this.setPosts(posts.filter((_, index) => index < 8))
      this.url = this.engagementUrl
      await this.getTotalViewsAsync()
      sleep(60 / 12)
      await this.getPostMetricAsync()
      sleep(60 / 6)
      await this.postPostMetricAsync()
      posts = posts.filter((_, index) => index > 7)
    }
    this.url = this.postManagementUrl
  }
  getPosts() {
    this.result = http.request("GET", `${this.url}/posts`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPosts")
    // this.engage("nodes")
  }
  getPostsByUserId(user_id) {
    this.result = http.request("GET", `${this.url}/profile/posts?user_id=${user_id}`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPosts")
    // this.engage("nodes")
  }
  async getPostsByUserIdAsync(user_id) {
    this.result = await http.asyncRequest("GET", `${this.url}/profile/posts?user_id=${user_id}`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPostsAsync")
    // this.engage("nodes")
  }
  getTestPosts() {
    this.result = http.request("GET", `${this.url}/test/posts`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPosts")
    // this.engage("nodes")
  }
  async getTestPostsAsync() {
    this.result = await http.asyncRequest("GET", `${this.url}/test/posts?last=12`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPostsAsync")
    // this.engage("nodes")
  }
  async getPostsAsync() {
    this.result = await http.asyncRequest("GET", `${this.url}/posts`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPostsAsync")
    await this.engageAsync("nodes")
  }
  getPlaylists({ placement }) {
    this.result = http.request("GET", `${this.url}/playlists?placement=${placement}`, {}, { headers: { ...this.params.headers, "Accept-Language": "tk" } })
    this.checkResponseStatus(200, "PostManagement.getPlaylists")
    // this.playlists = this.result.json()?.playlists ?? []
    // while (this.playlists.length) {
    //   this.getPlaylistPosts()
    // }
  }
  async getPlaylistsAsync({ placement }) {
    this.result = await http.asyncRequest("GET", `${this.url}/playlists?placement=${placement}`, {}, { headers: { ...this.params.headers, "Accept-Language": "tk" } })
    this.checkResponseStatus(200, "PostManagement.getPlaylistsAsync")
    this.playlists = this.result.json()?.playlists ?? []
    while (this.playlists.length) {
      await this.getPlaylistPostsAsync()
    }
  }

  getPlaylistPosts() {
    const playlist_id = this.playlists?.at(0)?.id
    this.result = http.request("GET", `${this.url}/playlists/${playlist_id}/contents?limit=12&current_page=1`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPlaylistPosts")
    if (this.result)
      this.engage("items")
    this.playlists = this.playlists.filter((_, index) => index > 0)
  }
  async getPlaylistPostsAsync() {
    const playlist_id = this.playlists?.at(0)?.id
    this.result = await http.asyncRequest("GET", `${this.url}/playlists/${playlist_id}/contents?limit=12&current_page=1`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getPlaylistPostsAsync")
    if (this.result)
      await this.engageAsync("items")
    this.playlists = this.playlists.filter((_, index) => index > 0)
  }
  getAudios() {
    this.result = http.request("GET", `${this.url}/audios`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getAudios")
  }
  async getAudiosAsync() {
    this.result = await http.asyncRequest("GET", `${this.url}/audios`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getAudiosAsync")
  }
  getCategories() {
    this.result = http.request("GET", `${this.url}/categories`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getCategories")
  }
  async getCategoriesAsync() {
    this.result = await http.asyncRequest("GET", `${this.url}/categories`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getCategoriesAsync")
  }
  getGenres() {
    this.result = http.request("GET", `${this.url}/genres`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getGenres")
  }
  async getGenresAsync() {
    this.result = await http.asyncRequest("GET", `${this.url}/genres`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getGenresAsync")
  }
  getTags() {
    this.result = http.request("GET", `${this.url}/tags`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getTags")
  }
  async getTagsAsync() {
    this.result = await http.asyncRequest("GET", `${this.url}/tags`, {}, this.params)
    this.checkResponseStatus(200, "PostManagement.getTagsAsync")
  }
}