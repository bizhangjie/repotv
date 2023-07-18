// ==MiruExtension==
// @name         皮皮虾说
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @package      com.ppxxs.www
// @type         fikushon
// @webSite      https://www.ppxxs.com/
// @nsfw         true
// ==/MiruExtension==

export default class PiPiXia extends Extension {

    async latest() {
        const res = await this.request("/index.php/art/type/id/23.html")

        const div = res.match(/class="list-group">([\s\S]+?)<\/div>/)[1]
        const as = div.match(/<a([\s\S]+?)<\/a>/g)
        const manga = []
        as.forEach(e => {
            const info = e.match(/href="(.+?)" class="list-group-item">(.+?)<span style="float: right">(.+?)<\/span>/)
            const title = info[2]
            const url = info[1]
            const cover = ''
            const update = info[3]
            manga.push({
                title,
                url,
                cover,
                update: update
            })
        })

        return manga
    }

    async search(kw, page) {
        const res = await this.request(`/index.php/art/search/page/${page}/wd/${kw}.html`)

        const div = res.match(/class="list-group">([\s\S]+?)<\/div>/)[1]
        const as = div.match(/<a([\s\S]+?)<\/a>/g)
        const manga = []
        as.forEach(e => {
            const info = e.match(/href="(.+?)" class="list-group-item">(.+?)<span style="float: right">(.+?)<\/span>/)
            const title = info[2]
            const url = info[1]
            const cover = ''
            const update = info[3]
            manga.push({
                title,
                url,
                cover,
                update: update
            })
        })

        return manga
    }

    async detail(url) {
        const res = await this.request(`${url}`)

        const title = res.match(/title>(.+?)-/)[1]
        const cover = '';
        const desc = title;

        return {
            title,
            cover,
            desc,
            episodes: [{
                title: "目录",
                urls: [
                    {
                        name: '哥哥进这里',
                        url: url
                    }
                ]
            }]
        }
    }

    async watch(url) {
        const res1 = await this.request(`${url}`)

        const res = res1.replace(/\n/g, '');
        const title = res.match(/title>(.+?)-/)[1]
        const contents = res.match(/panel-body">(.+?)<\/div>/)[1].match(/<\/h4><p><p>(.+?)<\/p><\/p>/)[1].split("<br/>")
        let content = []
        contents.forEach((e) => {
            content.push(e)
        })

        return {
            content,
            title,
        }
    }

}
