// ==MiruExtension==
// @name         好看的3号
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @icon         https://xdtv2.xyz/template/xdtv/static/favicon.ico
// @package      buzz.xnvn1
// @type         bangumi
// @webSite      https://xnvn1.buzz/
// ==/MiruExtension==

export default class extends Extension {
    constructor() {
        super("https://xnvn1.buzz/")
    }

    async search(kw, page) {
        const res = await this.request(`/hunt/${kw}/h/${page}`)

        const divs = res.match(/class="tup">([\s\S]+?)<\/div>/g)
        const bangumi = []
        divs.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            const cover = e.match(/src="(.+?)"/)[1]
            let update = ""
            try{
                const regex = /(\d{4}-\d{2}-\d{2})/;
                update = e.match(regex)[1];
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
        const res = await this.request("/sort/id/304.html")

        const divs = res.match(/class="tup">([\s\S]+?)<\/div>/g)
        const bangumi = []
        divs.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            const cover = e.match(/src="(.+?)"/)[1]
            let update = ""
            try{
                const regex = /(\d{4}-\d{2}-\d{2})/;
                update = e.match(regex)[1];
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
        const res = await this.request(url)

        const cover = res.match(/height="300px" src="(.+?)"/)[1]
        const title = res.match(/name="description" content="(.+?)-主演:"/)[1]
        const desc = title;
        const modifiedUrl = res.match(/<button class="button"><a href="(.+?)"/)[1]
        const episodes = [
            {
                'title': '国内地址',
                'urls': [
                    {
                        'name': '小哥,进来看看妹妹吧',
                        'url': modifiedUrl
                    }
                ]
            }];

        return {
            episodes,
            desc,
            cover,
            title
        }
    }

    async watch(url) {
        const res = await this.request(url)
        const m3u8 = res.match(/playUrl = '(.+?)'/)[1];
        return {
            type: "hls",
            url: m3u8
        }
    }

    async checkUpdate(url) {
        const res = await this.request(url)
        return res.match(/<span class="hl-text-conch">(.+?)<\/span>/)[1]
    }

}
