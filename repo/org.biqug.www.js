// ==MiruExtension==
// @name         笔趣阁漫画
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @package      org.biqug.www
// @type         manga
// @icon         https://www.biqug.org/template/pc/default/images/favicon.ico
// @webSite      https://www.biqug.org/
// ==/MiruExtension==

export default class Qiximh extends Extension {
    async latest() {
        const res = await this.request("/index.php/custom/week")
        const divList = res.match(/<div class="top-list__box-item">([\s\S]+?)<\/div>/g)
        const manga = []
        divList.forEach(e => {
            const url = e.match(/<a class="cover" href="(.+?)"/)[1]
            const title = e.match(/alt="(.+?)"/)[1]
            const cover = e.match(/data-original="(.+?)"/)[1]
            let update
            try {
                update = e.match(/<p class="comic-update">(.+?)</)[1] + e.match(/<span class="hl">(.+?)<\/span>/)[1]
            }catch (error){
                update = '未知'
            }
            manga.push({
                title: title,
                cover,
                update,
                url: url
            })
        });
        return manga
    }

    async search(kw, page) {
        const res = await this.request(`/index.php/search/${kw}/${page}`)
        let divlist
        const manga = []
        try {
            divlist = res.match(/<div class="common-comic-item">([\s\S]+?)<p class="comic-count">/g)
            divlist.forEach(element => {
                console.log(element);
                const title_url = element.match(/<p class="comic__title"><a href="(.+?)" target="_blank">(.+?)<\/a><\/p>/)
                const cover = element.match(/data-original="(.+?)"/)[1]
                let update
                try {
                    update = update = element.match(/<p class="comic-update">(.+?)</)[1] + element.match(/target="_blank">(.+?)</)[1]
                } catch (error) {
                    update = ""
                }
                console.log(update);
                manga.push({
                    title: title_url[2],
                    cover,
                    update,
                    url: title_url[1]
                })
            });
        } catch (error) {
            return []
        }
        return manga
    }

    async detail(url) {
        const res = await this.request(`${url}`)
        const title = res.match(/<p class="comic-title j-comic-title">(.+?)<\/p>/)[1]
        const cover = res.match(/<div class="de-info__cover"><img class="lazy" src="(.+?)"/)[1]
        const desc = res.match(/<p class="intro-total">(.+?)<\/p>/)[1]
        const ul = res.match(/<ul class="chapter__list-box clearfix">([\s\S]+?)<\/ul>/)[1]
        const li = ul.match(/<li(.+?)>([\s\S]+?)<\/li>/g)
        const episodes = []
        li.forEach(e => {
            const episode = e.match(/href="(.+?)">([\s\S]+?)<\/a>/)
            episodes.push({
                name: episode[2],
                url: episode[1]
            })
        })
        return {
            title,
            cover,
            desc,
            episodes: [{
                title: "目录",
                urls: episodes
            }]
        }

    }

    async watch(url) {
        const res = await this.request(`${url}`)
        const img = res.match(/data-original="(.+?)"/g)
        const images = []
        img.forEach(e => {
            images.push(e.match(/data-original="(.+?)"/)[1])
        })
        return {
            urls: images
        }

    }

}
