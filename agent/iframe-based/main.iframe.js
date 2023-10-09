

    // ---------------------------------------------------- [+] main.iframe.js [+]------------------------------------------------

    var timers = [];
    var tmp = [];
    var threads;

    var limit = { JSLIB_LIMIT_OF_VISITED_URLS };
    var TIME_OUT = 20000
    var MAX_THREADS = 6;

    function initThread(j) {
        createThread(j)
    }

    function init(data) {
        settings = data
        threads = new Proxy(tmp, arrayChangeHandler);
        for (j = 0; j < MAX_THREADS; j++)
            initThread(j)

        seeds = []
        if (settings.seeds) {
            for (seed of settings.seeds) {
                seeds.push(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + seed)
            }
        }
        seeds.push(location.href.split('#')[0])

        pushLinks(seeds);
    }

    return { init: init, proxy: ProxyPayloads }

}
