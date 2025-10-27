function changeOnSize() {
    if (document.body.clientWidth < 500)
        document.querySelector(".menu").className = document.querySelector(".menu").className.replace("vertical", "horizontal");
    else
        document.querySelector(".menu").className = document.querySelector(".menu").className.replace("horizontal", "vertical");
}

window.onresize = changeOnSize;
changeOnSize();

if (location.pathname == "/" || location.pathname.startsWith("/index")) {
    (async () => await fetch('https://api.github.com/users/y2k04/repos?sort=pushed').then(r => r.json()).then(repos => {
        for (var i = 0; i < 5; i++) {
            var el = document.createElement("div");
            el.innerHTML = `<div class="content"><a class="header" href="${repos[i].html_url}">${repos[i].name}</a><div class="description">${repos[i].description}</div></div>`;
            el.className = "item";
            document.getElementById("latestRepos").appendChild(el);
        }
    }))();

    (async () => await fetch('https://api.github.com/users/y2k04/gists?per_page=5').then(r => r.json()).then(gists => {
        for (var i = 0; i < 5; i++) {
            var el = document.createElement("div");
            el.innerHTML = `<div class="content"><a class="header" href="${gists[i].url}">${Object.keys(gists[i].files)[0]}</a><div class="description">${gists[i].description}</div></div>`;
            el.className = "item";
            document.getElementById("latestGists").appendChild(el);
        }
    }))();
}