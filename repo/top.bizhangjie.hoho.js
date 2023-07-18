// ==MiruExtension==
// @name         海外华人在线影视视频平台 - HOHO TV
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @icon         https://ihoho.tv/favicon.ico
// @package      top.bizhangjie.hoho
// @type         bangumi
// @webSite      http://47.115.229.58:5000
// ==/MiruExtension==


export default class extends Extension {
    constructor() {
        super("http://47.115.229.58:5000")
    }

    async search(kw, page) {
        const res = await this.request(`/search?page=${page}&wd=${kw}`);
        return res;
    }

    async latest() {
        const res = await this.request('/index');
        return res;
    }

    async detail(url) {
        const res = await this.request(`/detail?url=${url}`);
        return res;
    }

    async watch(url) {
        const res = await this.request(`/watch?url=${url}`);
        return res;
    }

    async checkUpdate(url) {
        const res = await this.request(url)
        return res.match(/<span class="hl-text-conch">(.+?)<\/span>/)[1]
    }

}
