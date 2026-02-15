window.onresize = () => {
    if (document.body.clientWidth < 500)
        document.querySelector(".menu").className = document.querySelector(".menu").className.replace("vertical", "horizontal");
    else
        document.querySelector(".menu").className = document.querySelector(".menu").className.replace("horizontal", "vertical");
}
window.onresize();

function homeItem(title, url, description) {
    return Object.assign(document.createElement("div"), {
        innerHTML: `<div class="content"><a class="header" href="${url}">${title}</a><div class="description">${description}</div></div>`,
        className: "item"
    });
}

function postItem(id, image, name, date, description) {
    return Object.assign(document.createElement("div"), {
        innerHTML: `
            <img class="ui tiny image" src="${image}">
            <div class="content">
                <a class="header" href="/blog.html?id=${id}">${name}</a>
                <div class="meta"><small>${date}</small></div>
                <div class="description"><p>${description}</p></div>
            </div>`,
        className: "item"
    });
}

if (location.pathname == "/" || location.pathname.startsWith("/index")) {
    let latestRepos = document.querySelector("#latestRepos");
    let latestGists = document.querySelector("#latestGists");
    let latestPosts = document.querySelector("#latestPosts");

    (async () => await fetch('https://api.github.com/users/y2k04/repos?sort=pushed&per_page=5').then(r => r.json()).then(repos =>
        repos.forEach(repo => latestRepos.appendChild(homeItem(repo.name, repo.html_url, repo.description)))
    ))();

    (async () => await fetch('https://api.github.com/users/y2k04/gists?per_page=5').then(r => r.json()).then(gists =>
        gists.forEach(gist => latestGists.appendChild(homeItem(Object.keys(gist.files)[0], gist.html_url, gist.description)))
    ))();

    (async () => await fetch('/assets/blog/data.json').then(r => r.json()).then(data => 
        data.posts.slice(-5).forEach(post => latestPosts.appendChild(homeItem(`${post.name}<em>&nbsp;&nbsp;<small>${post.date}</small></em>`, `/blog?id=${data.posts.indexOf(post)}`, post.description))
    )))();
}
else if (location.pathname.startsWith("/blog")) {
    const id = new URLSearchParams(document.location.search).get("id");
    (async () => await fetch('/assets/blog/data.json').then(r => r.json()).then(data => {
        if (data.posts[id] != null) {
            const post = data.posts[id];
            document.querySelector(".blog .ui.segment").innerHTML = `
                <img class="ui centered medium image" src="${post.image}">
                <h2 class="ui centered header">${post.name}</h2><span class="ui centered sub header">${post.date}</span>
                <div><br><br>${post.content.join('<br>')}</div>
            `;
        } else {
            window.history.replaceState('', '', location.pathname);
            document.querySelector(".blog .ui.segment").innerHTML = `<h3>Posts</h3><div id="posts" class="ui relaxed divided items"></div>${document.querySelector(".blog .ui.segment").innerHTML}`;
            data.posts.reverse().forEach(post => document.querySelector("#posts").appendChild(postItem(data.posts.indexOf(post), post.image, post.name, post.date, post.description)));
            document.querySelector(".loader").classList.remove("active");
        }
    }))();
}