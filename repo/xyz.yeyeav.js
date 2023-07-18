// ==MiruExtension==
// @name         好看的5号
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @icon         https://xdtv2.xyz/template/xdtv/static/favicon.ico
// @package      xyz.yeyeav
// @type         bangumi
// @webSite      https://yeyeav.xyz/
// ==/MiruExtension==

export default class extends Extension {
    constructor() {
        super("https://yeyeav.xyz/")
    }

    async search(kw, page) {
        const res = await this.request(`/index.php/vod/search/page/${page}/wd/${kw}.html`)

        const res1 = res.replace(/\n/g, '');
        const lis = res1.match(/class="i_list layui-col-sm3">([\s\S]+?)<\/li>/g)
        const bangumi = []

        lis.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            const cover = e.match(/lay-src="(.+?)"/)[1]
            let update = ""
            try{
                update = e.match(/\b\d{2}-\d{2}\b/)[0];
            }catch (error) {
                update = ""
            }
            bangumi.push({
                title,
                url,
                cover,
                update
            })
        })

        return bangumi
    }
    async latest() {
        const res = await this.request("/index.php/vod/type/id/131.html")

        const res1 = res.replace(/\n/g, '');
        const lis = res1.match(/class="i_list layui-col-sm3 ">([\s\S]+?)<\/li>/g)
        const bangumi = []

        lis.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            const cover = e.match(/lay-src="(.+?)"/)[1]
            let update = ""
            try{
                update = e.match(/\b\d{2}-\d{2}\b/)[0];
            }catch (error) {
                update = ""
            }
            bangumi.push({
                title,
                url,
                cover,
                update
            })
        })

        return bangumi
    }

    async detail(url) {
        const res1 = await this.request(url)

        const res = res1.replace(/\n/g, '');
        const cover = res.match(/layui-col-md3 detail_img"><img src="(.+?)"/)[1]
        const title = res.match(/class="tjuqing">(.+?)</)[1]
        const desc = title;
        const watchUrlTitleStr = res.match(/layui-tab-title([\s\S]+?)<\/ul>/g)[0]
        const watchUrlTitle = watchUrlTitleStr.match(/<li([\s\S]+?)<\/li>/g)
        const watchUrlGroupsStr = res.match(/detaail_url layui-tab-item([\s\S]+?)<\/div>/g)
        const episodes = []
        let i = 0
        watchUrlGroupsStr.forEach(e => {
            const episode = []
            let lis = e.match(/><span>([\s\S]+?)<\/a>/g)
            lis.forEach(e => {
                const match = e.match(/<a href="(.+?)">(.+?)<\/a>/)
                episode.push({
                    url: match[1],
                    name: match[2],
                })
            })
            const title = watchUrlTitle[i++].match(/>(.+?)</)[1]
            episodes.push({
                title: title,
                urls: episode
            })
        })

        return {
            episodes,
            desc,
            cover,
            title
        }
    }

    async watch(url) {
        const res = await this.request(url)
        const m3u8 = res.match(/"url":"(.+?)","url_next"/)[1].replace(/\\\//g, '/')
        return {
            type: "hls",
            url: m3u8
        }
    }

}
