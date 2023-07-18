const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

async function main() {
    const extensions = await readRepoExtensions();
    const jsonContent = JSON.stringify(extensions, null, " ");
    await writeFile("index.json", jsonContent);

    let readmeContent = `
# Miru-Repo

Miru 扩展仓库 | [Miru App Download](https://github.com/bizhangjie/repo) |

## 仓库列表
|  名称   | 包名 | 版本 | 查看 |
|  ----   | ---- | --- | ---  |
`;

    for (const extension of extensions) {
        const url = `[查看](https://github.com/bizhangjie/repo/blob/main/repo/${extension.url})`;
        readmeContent += `| ${extension.name} | ${extension.package} | ${extension.version} | ${url} |\n`;
    }

    await writeFile("README.md", readmeContent);
}

async function readRepoExtensions() {
    const dirEntries = await readDir("repo");
    console.log("目录条目列表:", dirEntries); // 添加此行输出
    const extensions = [];

    for (const dirEntry of dirEntries) {
        console.log(dirEntry)
        try {
            if (!dirEntry || typeof dirEntry !== "string") {
                console.log("错误: 无效的目录条目名称", dirEntry);
                continue;
            }

            const filePath = path.join("repo", dirEntry);
            const fileContent = await readFile(filePath, 'utf-8');
            const regex = /MiruExtension([\s\S]+?)\/MiruExtension/;
            const data = fileContent.match(regex);
            // data.forEach(e => {
            //     console.log(e)
            // })

            if (!data) {
                console.log("错误: 非扩展内容");
                continue;
            }

            const lines = data[0].split("\n");
            console.log(lines)
            const extension = {};

            for (const line of lines) {
                if (line.slice(0, 4) === "// @") {
                    console.log(line)
                    const startIndex = line.indexOf('@');
                    const endIndex = line.indexOf(' ', startIndex + 1);
                    const key = line.slice(startIndex + 1, endIndex).trim();
                    const value = line.slice(endIndex + 1).trim();
                    extension[key] = value.trim();
                }
            }

            extension.url = dirEntry;
            extensions.push(extension);
        } catch (error) {
            console.log("错误:", error);
            continue;
        }
    }

    return extensions;
}

main().catch((error) => {
    console.error("错误:", error);
    process.exit(1);
});
