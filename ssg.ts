import { marked } from "marked"
import { Glob } from "bun"
import path from "path"

const glob = new Glob("**/*.md");

for await (const file of glob.scan(".")) {
    const filename: string = file.split("/").pop();
    const outoutpath: string = path.join(path.dirname(file), "index.html")
    const md: string = await readfile(file)
    const html: string = md2html(md,filename)
    await writefile(html,outoutpath)
}

async function readfile (filepath) {
    const file = Bun.file(filepath)
    return await file.text()
}

function md2html (md,filename) {
    const name = removeExtension(filename)
    const html = marked.parse(md)
    const template = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="https://page.owasikohu.com/lib/css/header.css">
    <link rel="stylesheet" href="https://page.owasikohu.com/lib/css/footer.css">
    <link rel="stylesheet" href="https://page.owasikohu.com/lib/css/style.css">
    <link rel="stylesheet" href="https://page.owasikohu.com/lib/css/github.css">
    <link rel="shortcut icon" href="https://page.owasikohu.com/favicon.ico" type="image/x-icon">
    <title>owasikohu.com - ${name}</title>
    </head>
    <body>
    <header id="header"><div class="header-inner"><a class="header-logo" href="https://page.owasikohu.com/"><img src="https://page.owasikohu.com/lib/img/logo.png" width="200" height="50"></a><div class="header-site-menu"><nav class="site-menu"><ul class="menu-group"><li class="menu-item"><a href="https://page.owasikohu.com/profile">/profile</a></li><li class="menu-item"><a href="https://page.owasikohu.com/blog">/blog</a></li><li class="menu-item"><a href="https://page.owasikohu.com/projects">/projects</a></li><li class="menu-item"><a href="https://page.owasikohu.com/webring">/webring</a></li><li class="menu-item"><a href="https://page.owasikohu.com/misc">/misc</a></li></ul></nav></div></div><hr></header>
    ${html}
    <footer id="footer"><hr><span id="copyright">Copyright (C) 2024 owasikohu. Some rights reserved.</span></footer>
    </body>
    </html>
    `
    return template
}

async function writefile (html,outoutpath) {
    await Bun.write(outoutpath, html)
}

function removeExtension(fileName) {
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
}
