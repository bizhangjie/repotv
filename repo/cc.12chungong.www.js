// ==MiruExtension==
// @name         好看的6号
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @icon         https://xdtv2.xyz/template/xdtv/static/favicon.ico
// @package      cc.12chungong.www
// @type         bangumi
// @webSite      https://www.12chungong.cc/
// ==/MiruExtension==

export default class extends Extension {
    constructor() {
        super("https://www.12chungong.cc/")
    }

    async search(kw, page) {
        const res = await this.request(`/index.php/vodsearch/${kw}----------${[page]}---.html`)

        const res1 = res.replace(/\n/g, '')
        const divs = res1.match(/class="item">([\s\S]+?)<\/div>/g)
        const bangumi = []
        divs.forEach(e => {
            try{
                const title = e.match(/title="(.+?)"/)[1]
                const url = e.match(/href="(.+?)"/)[1]
                const cover = e.match(/src="(.+?)"/)[1]
                const regex = /(\d{2}-\d{2}-\d{2})/;
                const update = e.match(regex)[1];
                bangumi.push({
                    title,
                    url,
                    cover,
                    update
                })
            }catch (error) {

            }
        })

        return bangumi
    }
    async latest() {
        const res = await this.request("/index.php/vodtype/160.html")

        const res1 = res.replace(/\n/g, '')
        const divs = res1.match(/class="item">([\s\S]+?)<\/div>/g)
        const bangumi = []
        divs.forEach(e => {
            try{
                const title = e.match(/title="(.+?)"/)[1]
                const url = e.match(/href="(.+?)"/)[1]
                const cover = e.match(/src="(.+?)"/)[1]
                const regex = /(\d{2}-\d{2}-\d{2})/;
                const update = e.match(regex)[1];
                bangumi.push({
                    title,
                    url,
                    cover,
                    update
                })
            }catch (error) {

            }
        })

        return bangumi
    }

    async detail(url) {
        const res = await this.request(url)

        const res1 = res.replace(/\n/g, '')
        const cover = ''
        const title = res1.match(/h1>(.+?)<\/h1>/)[1]
        const desc = title;
        const modifiedUrl = url
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
            title
        }
    }

    async watch(url) {
        const res = await this.request(url)

        const res1= res.replace(/\n/g, '')
        const encodedString = res1.match(/,"url":"(.+?)","url_next/)[1].replace('O0O0O','')
        const decodedString = atob(encodedString)

        return {
            type: "hls",
            url: decodedString
        }
    }

}
