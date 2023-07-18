// ==MiruExtension==
// @name         全本小说
// @version      v0.0.1
// @author       zj
// @lang         zh-cn
// @license      MIT
// @package      io.quanben.www
// @type         fikushon
// @webSite      https://www.quanben.io/
// @nsfw         true
// ==/MiruExtension==

export default class Biquge extends Extension {
    async latest() {
        const res = await this.request("/c/xuanhuan.html")
        const liList = res.match(/<div class="row">([\s\S]+?)<\/div>/g)
        const manga = []
        liList.forEach(element => {
            const url = element.match(/a href="(.+?)"/)[1]
            const title = element.match(/itemprop="name">(.+?)<\/span>/)[1]
            const cover = 'https:' + element.match(/img src="(.+?)"/)[1]
            manga.push({
                title,
                url,
                cover
            })
        });
        return manga
    }

    async search(kw, page) {
        const res = await this.request(`/index.php?c=book&a=search&keywords=${kw}`)
        const liList = res.data.match(/<div class="row">([\s\S]+?)<\/div>/g)
        const manga = []
        liList.forEach(element => {
            const url = element.match(/a href="(.+?)"/)[1]
            const title = element.match(/itemprop="name">(.+?)<\/span>/)[1]
            const cover = element.match(/img src="(.+?)"/)[1]
            manga.push({
                title,
                url,
                cover,
                update: '完结全本'
            })
        });
        return manga
    }

    async detail(url) {
        const res = await this.request(`${url}list.html`)
        const title = res.match(/itemprop="name">(.+?)<\/span>/)[1]
        const cover = res.match(/<img src="(.+?)"/)[1]
        const pContent = res.match(/itemprop="description">([\s\S]+?)<\/div>/)[1]
        const desc = pContent.match(/<p>([\s\S]+?)<\/p>/)[1];

        // console.log(episodes)
        // console.log(res)

        const bookMatch = res.match(/<a href="javascript:void\(0\)" onclick="load_more\('(.+?)'\)">\[展开完整列表\]<\/a>/);
        const book = bookMatch[1];
        // console.log(book)

        const callback = res.match(/var callback='([^']+)'/)[1];
        // console.log(callback)

        function base64(_str) {
            var staticchars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN";
            var encodechars = "";
            for (var i = 0; i < _str.length; i++) {
                var num0 = staticchars.indexOf(_str[i]);
                if (num0 == -1) {
                    var code = _str[i]
                } else {
                    var code = staticchars[(num0 + 3) % 62]
                }
                var num1 = parseInt(Math.random() * 62, 10);
                var num2 = parseInt(Math.random() * 62, 10);
                encodechars += staticchars[num1] + code + staticchars[num2]
            }
            return encodechars
        }

        // console.log(base64(callback))

        // console.log(title)
        // console.log(cover)
        // console.log(desc)

        const resN = await this.request(`/index.php?c=book&a=list.jsonp&callback=${callback}&book_id=${book}&b=${base64(callback)}`, {
            headers: {
                "miru-referer": `https://www.quanben.io${url}list.html`
            }
        })

        // const episodesN = [];
        // if (jsonpCallback) {
        //     const jsonData = JSON.parse(jsonpCallback[1]);
        //     // console.log(jsonData);
        //     // 处理提取的JSON对象，例如获取书籍的ID和内容
        //     const bookId = jsonData.id;
        //     const bookContent = jsonData.content;
        //     const books = bookContent.match(/<li itemprop="itemListElement">(.*?)<\/li>/g);
        //     books.forEach((e) =>{
        //         const episode = e.match(/href="(.+?)" itemprop="url"><span itemprop="name">([\s\S]+?)<\/span><\/a>/);
        //         episodesN.push({
        //             name: episode[2],
        //             url: episode[1]
        //         })
        //     })
        // }

        const ul = res.match(/class="list3" itemscope="itemscope"[\s\S]+?<\/ul>/g);
        const episodes = [];
        let index = 0;
        ul.forEach(e => {
            const li = e.match(/<li itemprop="itemListElement">([\s\S]+?)<\/li>/g);
            li.forEach(e => {
                const episode = e.match(/<a href="(.+?)" itemprop="url"><span itemprop="name">([\s\S]+?)<\/span><\/a>/);
                episodes.push({
                    name: episode[2],
                    url: episode[1]
                })
            })
            index = index + 1;
            if (index == 1){
                // 提取JSON对象
                const jsonpCallback = resN.match(/d4ebc81\((.*?)\)/);
                if (jsonpCallback) {
                    const jsonData = JSON.parse(jsonpCallback[1]);
                    // console.log(jsonData);
                    // 处理提取的JSON对象，例如获取书籍的ID和内容
                    // const bookId = jsonData.id;
                    const bookContent = jsonData.content;
                    const books = bookContent.match(/<li itemprop="itemListElement">(.*?)<\/li>/g);
                    books.forEach((e) =>{
                        const episode = e.match(/href="(.+?)" itemprop="url"><span itemprop="name">([\s\S]+?)<\/span><\/a>/);
                        episodes.push({
                            name: episode[2],
                            url: episode[1]
                        })
                    })
                }
                // console.log("撤回hi")
            }

        })

        // console.log(episodes)

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
        const title = res.match(/<h1 class="headline" itemprop="headline">(.+?)<\/h1>/)[1]
        const contents = res.match(/<div id="content">([\s\S]+?)<\/div>/g)[0].match(/<p>(.*?)<\/p>/g);
        let content = []
        contents.forEach((e) => {
            content.push(e.match(/<p>(.+?)<\/p>/)[1])
        })
        return {
            content,
            title,
        }
    }

}
