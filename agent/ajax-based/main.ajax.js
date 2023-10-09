
    // ---------------------------------------------------- [+] main.ajax.js [+]------------------------------------------------

    var limit = { JSLIB_LIMIT_OF_VISITED_URLS }; // limite de links encontrados

    function run() {

        if (success < limit && !stopped) visitLink(getUnvisitedURI());
        else {
            stopped = true;
            //showLinks();
            limit = (success / limit >> 0) * limit + limit;

            if (activeModes["iframe"]) {
                getRemoteSettings(data => activeModes["iframe"].init(data));
            }
        }
        console.log("fin run")
    }


    function init(data) {

        settings = data
        getForms(document.body.outerHTML, location.href);

        seeds = []
        if (settings.seeds) {
            for (seed of settings.seeds) {
                seeds.push(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + seed)
            }
        }
        seeds.push(location.href.split('#')[0])

        pushLinks(seeds);

        stopped = false;
        console.log('RUNNING...\nUse getstatus() and showLinks()');
        executionTime = Date.now();
        run();
    }



    //getModifiedForms();
    //setInterval(function(){ getModifiedForms(); }, 3000);

    //getRemoteSettings(data => init(data));

    /*
    // HAY QUE CAMBIARLO PARA CUANDO EL HTML ESTÉ LISTO LLAME A getForms
    setTimeout(function(){ getForms(document.body.outerHTML, location.href);pushLinks([location.href]); }, 3000);


    setTimeout(start, 4000); // 2 seg de aguardo pelo import
    setInterval(function(){ getModifiedForms(); }, 3000);
    */

    //'limit:'+limit;
    return { init: init, proxy: ProxyPayloads }

}


