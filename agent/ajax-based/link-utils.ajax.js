
// ------------------------------------[+] link-utils.ajax.js [+]---------------------


var linkHolder = {}; // objeto usado como hash de links
var SCPReferenciado = [];
var visitedDomains = [];
var success = found = executionTime = 0;
var currentDomain = null;
var stopped = false;
var test = "";


function getLocationInfo(uri) {
    var a = document.createElement('a');
    a.href = uri;
    return a;
}


function getUnvisitedURI() {
    for (var i = 0, l = visitedDomains.length, visitedDomain; i < l; ++i) {
        visitedDomain = visitedDomains[i];
        for (var link in linkHolder) {

            if (~link.indexOf(visitedDomain) && linkHolder[link].status === '_') {
                return link;
            }
        }
    }

    if (currentDomain) {
        for (var link in linkHolder) {

            if (~link.indexOf(currentDomain) && linkHolder[link].status === '_') return link;
        }
        visitedDomains.push(currentDomain);
    }

    for (var link in linkHolder) {
        if (linkHolder[link].status === '_') {

            currentDomain = getLocationInfo(link).hostname;
            return link;
        }
    }

    return null;
}


function LinkInfo(origin) { this.origin = origin; };
LinkInfo.prototype = {
    status: '_',
    origin: ''
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


function getExecutionTime() {
    return new Date(Date.now() - executionTime).toISOString().match(/([^T]*)Z$/)[1];
}


function toLink(href) {
    return '<a href="' + href + '" target="_blank">' + href + '</a>';
}


function getstatus() {

    var visited = [];
    var broken = [];
    var unvisited = [];
    var redirected = [];

    for (var link in linkHolder) {
        switch (linkHolder[link].status) {
            case '_':
                type = unvisited;
                break;
            case 'V':
                type = visited;
                break;
            case 'X':
                type = broken;
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
        redirected.length + ' redirected',
        broken.length + ' broken'
    ].join('\n'));

    return {
        broken: broken,
        visited: visited,
        unvisited: unvisited,
        redirected: redirected
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
        data.redirected.length + ' redirected',
        data.broken.length + ' broken',
        br,

        '### BROKEN: ' + data.broken.length,
        data.broken.sort().join(br),
        br,

        '### REDIRECTED: ' + data.redirected.length,
        data.redirected.sort().join(br),
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
    else {
        //alert('Popup bloqueado.')
    }
}


function visitLink(link) {
    if (link) {
        xhr = new XMLHttpRequest();
        xhr.timeout = 4000;
        xhr.open('GET', link);
        xhr.setRequestHeader("XX-Origin", "Formshaker-crawling");
        xhr.ontimeout = function () {
            console.log('Failed from timeout ' + link);
            linkHolder[link].status = 'X';
            run()
        };
        // before xhr.onreadystatechange
        xhr.onload = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var contentType = xhr.getResponseHeader("Content-Type");
                if (contentType && contentType.indexOf("text/html") >= 0) {
                    var status = xhr.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        if (link == xhr.responseURL) {
                            // The request has been completed successfully
                            data = xhr.responseText;
                            ++success;
                            linkHolder[link].status = 'V';
                            if (typeof data === 'string') getForms(data, link); pushLinks(getLinks(data, link), link);
                        } else {
                            linkHolder[link].status = 'R';
                        }
                        run();
                    } else {
                        linkHolder[link].status = 'X';
                        run()
                    }

                }
            }
        }

        xhr.send();

    }
    else console.log('FINISHED (no more links to crawl)');

}
    //------------------------------------------------------------------------------------------------------