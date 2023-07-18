// ==MiruExtension==
// @name         好看的10号
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @icon         https://xdtv2.xyz/template/xdtv/static/favicon.ico
// @package      top.xiaoyg1.www
// @type         bangumi
// @webSite      https://www.xiaoyg1.top/
// ==/MiruExtension==

export default class extends Extension {
    constructor() {
        super("https://www.xiaoyg1.top/")
    }

    async search(kw, page) {
        const res = await this.request(`/index.php/vod/search/page/${page}/wd/${kw}.html`)

        const ul = res.match(/class="content-list([\s\S]+?)<\/ul>/)[1]
        const lis = ul.match(/class="content-item"([\s\S]+?)<\/li>/g)
        const bangumi = []
        lis.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            const cover = e.match(/data-original="(.+?)"/)[1]
            let update = ""
            try {
                update = e.match(/\b\d{4}-\d{2}-\d{2}\b/)[0];
            } catch (error) {
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

        const ranges = [
            63, 62, 64,
            65,
            66,
            67,
            75,
            76,
            91,
            92,
            93,
            94,
            95,
            96,
            97,
            98,
            82,
            83,
            84,
            85,
            86,
            88,
            89,
            87,
            48,
            49,
            50,
            51,
            52,
            53,
            77,
            78,
            69,
            70,
            71,
            72,
            73,
            74,
            79,
        ];

        function getRandomNumberInRange(start, end) {
            return Math.floor(Math.random() * (end - start + 1)) + start;
        }

        function getRandomNumberFromRanges() {
            const randomNumber = getRandomNumberInRange(0, ranges.length - 1);
            return ranges[randomNumber];
        }

        const res = await this.request(`/index.php/vod/type/id/${getRandomNumberFromRanges()}.html`)

        const ul = res.match(/class="content-list([\s\S]+?)<\/ul>/)[1]
        const lis = ul.match(/class="content-item"([\s\S]+?)<\/li>/g)
        const bangumi = []
        lis.forEach(e => {
            const title = e.match(/title="(.+?)"/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            const cover = e.match(/data-original="(.+?)"/)[1]
            let update = ""
            try {
                update = e.match(/\b\d{4}-\d{2}-\d{2}\b/)[0];
            } catch (error) {
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

        const res = res1.replace(/\n/g, '')
        const cover = res.match(/data-original="(.+?)" data-prefix/)[1]
        const title = res.match(/title>(.+?)</)[1].split('详情介绍')[0]
        const desc = title;

        const modifiedUrl = url.match(/\/id\/(\d+)./)[1];
        const episodes = [
            {
                'title': '国内地址',
                'urls': [
                    {
                        'name': '小哥,进来看看妹妹吧',
                        'url': `/index.php/vod/play/id/${modifiedUrl}/sid/1/nid/1.html`
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
        const m3u8 = res.match(/"url":"(.+?)","url_next"/)[1].replace(/\\\//g, '/')
        return {
            type: "hls",
            url: m3u8
        }
    }

}
