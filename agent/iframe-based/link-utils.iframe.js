
    // -------------------------------------------------------------[+] link-utils.iframe.js [+]----------------------------/

    var linkHolder = {}; // objeto usado como hash de links
    var visitedDomains = [];
    var success = found = executionTime = 0;
    var currentDomain = null;
    var stopped = false;
    var test = "";


    function getExecutionTime() {
        return new Date(Date.now() - executionTime).toISOString().match(/([^T]*)Z$/)[1];
    }

    function toLink(href) {
        return '<a href="' + href + '" target="_blank">' + href + '</a>';
    }

    function getstatus() {
        var visited = [];
        var unsupported = [];
        var broken = []
        var unvisited = [];
        var timeout = [];
        var redirected = [];

        for (var link in linkHolder) {
            switch (linkHolder[link].status) {
                case '_':
                    type = unvisited;
                    break;
                case 'V':
                    type = visited;
                    break;
                case 'U':
                    type = unsupported;
                    break;
                case 'X':
                    type = broken;
                    break;
                case 'T':
                    type = timeout;
                    break;
                case 'R':
                    type = redirected;
                    break;
            }
            type.push(linkHolder[link].status + ' ' + toLink(link) + '<span>&nbsp;' + toLink(linkHolder[link].origin) + '</span>');
        }

        console.log([
            'Execution time: ' + getExecutionTime(),
            found + ' found',
            unvisited.length + ' unvisited',
            visited.length + ' visited',
            timeout.length + ' timeout',
            redirected.length + ' redirected',
            broken.length + ' broken',
            unsupported.length + ' unsupported'
        ].join('\n'));

        return {
            unsupported: unsupported,
            broken: broken,
            visited: visited,
            unvisited: unvisited,
            redirected: redirected,
            timeout: timeout
        };
    }

    function showLinks() {

        var encodedForms = JSON.stringify(forms).replace(/[\u00A0-\u9999<>\&]/g, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
        var data = getstatus();
        var br = '<br/>';
        var logInfo = [

            'Execution time: ' + getExecutionTime(),
            found + ' found',
            data.unvisited.length + ' unvisited',
            data.visited.length + ' visited',
            data.timeout.length + ' timeout',
            data.redirected.length + ' redirected',
            data.broken.length + ' broken',
            data.unsupported.length + ' unsupported',
            br,

            '### unsupported: ' + data.unsupported.length,
            data.unsupported.sort().join(br),
            br,

            '### BROKEN: ' + data.broken.length,
            data.broken.sort().join(br),
            br,

            '### REDIRECTED: ' + data.redirected.length,
            data.redirected.sort().join(br),
            br,

            '### timeout: ' + data.timeout.length,
            data.timeout.sort().join(br),
            br,

            '### REDUNDANT: ' + redundantURLs.length,
            redundantURLs.sort().join(br),
            br,

            '### VISITED: ' + data.visited.length,
            data.visited.sort().join(br),
            br,

            '### UNVISITED: ' + data.unvisited.length,
            data.unvisited.sort().join(br),

            br + br + '### FORMS: ' + forms.length,
            br + encodedForms + br

        ];

        var popup = open(null, '_blank');
        if (popup) {
            popup.document.write(
                '<head><style>a {color: #555;text-decoration: none;} span a {color: #bbb;}</style></head>' +
                '<body>' +
                '<div style="white-space:nowrap;font-size: 12px; font-family: Consolas,\'Lucida Console\',\'DejaVu Sans Mono\',monospace;">' +
                logInfo.join(br) +
                '</pre></div></body>'
            );
        }
    }

    function getLocationInfo(uri) {
        var a = document.createElement('a');
        a.href = uri;
        return a;
    }


    function getUnvisitedURI() {

        for (var i = 0, l = visitedDomains.length, visitedDomain; i < l; ++i) {
            visitedDomain = visitedDomains[i];
            for (var link in linkHolder) {

                if (~link.indexOf(visitedDomain) && linkHolder[link].status === '_' && linkHolder[link].dispatched != true) {
                    return link;
                }
            }
        }

        if (currentDomain) {
            for (var link in linkHolder) {

                if (~link.indexOf(currentDomain) && linkHolder[link].status === '_' && linkHolder[link].dispatched != true)
                    return link;
            }
            visitedDomains.push(currentDomain);
        }

        for (var link in linkHolder) {
            if (linkHolder[link].status === '_' && linkHolder[link].dispatched != true) {

                currentDomain = getLocationInfo(link).hostname;
                return link;
            }
        }

        return null;
    }

    function LinkInfo(origin) { this.origin = origin; };
    LinkInfo.prototype = {
        status: '_',
        origin: '',
        dispatched: false
    };

    function pushLinks(links, origin) {
        if (links) {
            var i = links.length;
            var link;
            while (i--) {

                if (linkHolder[links[i]]) continue;
                if (origin === undefined)
                    linkHolder[links[i]] = new LinkInfo(links[i]);
                else
                    linkHolder[links[i]] = new LinkInfo(origin);
                ++found;
            }
        }
    }

    var matches = []
    function getLinks(html, origin) {
        var tmp = []
        parsedDocument = new DOMParser().parseFromString(html, "text/html");
        a_elemnts = parsedDocument.querySelectorAll("a")
        for (a_elemnt of a_elemnts) {
            url = a_elemnt.href
            if (url) {
                pathname = new URL(url).pathname;
                if (urlValidation(pathname)) {
                    originHost = new URL(origin).host;
                    newURLHost = new URL(url).host;
                    if (originHost == newURLHost) {
                        hash = new URL(url).hash;
                        if (hash.length == 0) {
                            if (!matches.includes(url)) {
                                test_rewriteURL(url)
                            }
                        }
                    }
                }
            }
        };
        return matches;
    }


    // -----------------------------------------------------------------------------------------