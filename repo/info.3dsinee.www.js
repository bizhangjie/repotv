// ==MiruExtension==
// @name         好看的12号
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @icon         https://xdtv2.xyz/template/xdtv/static/favicon.ico
// @package      info.3dsinee.www
// @type         bangumi
// @webSite      https://www.3dsinee.info/
// ==/MiruExtension==

// 解析文章信息
function parseArticles(articles) {
    const bangumi = [];
    articles.forEach(e => {
        try {
            const title = e.match(/alt="(.+?)"/)[1];
            const url = e.match(/href="(.+?)"/)[1];
            const cover = e.match(/src="(.+?)"/)[1];
            let update = "";
            try {
                update = e.match(/class="is-hd">(.+?)</)[1];
            } catch (error) {
                update = "精品";
            }
            bangumi.push({
                title,
                url,
                cover,
                update
            });
        } catch (error) {
        }
    });
    return bangumi;
}

export default class extends Extension {
    constructor() {
        super("https://www.3dsinee.info/");
    }

    async search(kw, page) {
        const res = await this.request(`/index.php/vodsearch/${kw}----------${page}---.html`);
        const res1 = res.data.replace(/\n/g, '');
        const articles = res1.match(/class="item"><a([\s\S]+?)<\/a>/g);
        const bangumi = parseArticles(articles);
        return bangumi;
    }

    async latest() {
        // 分类id
        const ranges = [ /*...填入分类id...*/];
        // 随机抽选id填入
        const res = await this.request(`/index.php/vodtype/${getRandomNumberFromRanges()}.html`);
        const res1 = res.data.replace(/\n/g, '');
        const articles = res1.match(/class="item"><a([\s\S]+?)<\/a>/g);
        const bangumi = parseArticles(articles);
        return bangumi;
    }

    async detail(url) {
        const res = await this.request(url);
        const cover = '';
        const title = res.match(/name="description" content="(.+?)"/)[1];
        const desc = title;
        const modifiedUrl = url;
        const episodes = [
            {
                'title': '国内地址',
                'urls': [
                    {
                        'name': '小哥,进来看看妹妹吧',
                        'url': modifiedUrl
                    }
                ]
            }
        ];
        return {
            episodes,
            desc,
            cover,
            title
        };
    }

    // 以下通用两种，一种未加密，一种使用的base64加密，其他用的js加密目前没有解决，期待后续有时间解决
    async watch(url) {
        const res = await this.request(url);
        const m3u8 = this.get_M3U8(res);
        return {
            type: "hls",
            url: m3u8
        };
    }

    get_M3U8(data) {
        // 模版一获取m3u8播放地址
        const m3u8 = data.match(/"url":"(.+?)","url_next/)[1];
        if (m3u8.includes('http')) {
            // 包含http，即为真实播放地址
            return m3u8.replace(/\\\//g, '/');
        }
        if (m3u8.includes('O0O0O')) {
            // 先去除O0O0O
            const encode = m3u8.replace('O0O0O', '');
            // 使用js原生的atob的base64解密
            const decode = atob(encode);
            return decode;
        }
        if (!m3u8) {
            // 使用的加密js
            return m3u8;
        }
        return "抱歉未能获取";
    }
}
