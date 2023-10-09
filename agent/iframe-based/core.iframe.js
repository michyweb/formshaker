


    function Thread(id, status) {
        this.id = id;
        this.status = typeof status !== 'undefined' ? status : "stopped";
        this.timeout = "";
    }

    var debug = false;

    test = ""
    function visitLink(link, id) {
        if (id == "All Threads Busy")
            return

        if (debug)
            console.log("link: " + link + " - id: " + id)

        if (link) {
            pathname = new URL(link).pathname;
            if (urlValidation(pathname)) {
                var ifrm = document.getElementById(id)
                threads[id].status = "running"
                linkHolder[nextLink].dispatched = true
                ifrm.src = link

                if (debug)
                    ifrm.style = "width:500px;height:400px"
                else
                    ifrm.style = "width:0;height:0;border:0; border:none;"

                // Trigger the timeout 
                threads[id].timeout = setTimeout(function () {
                    ifrm.src = "";

                    if (debug)
                        console.log('Failed from timeout ' + link);

                    if (threads != null)
                        threads[id].status = "timeout"
                    linkHolder[link].status = 'T';

                    ifrm.remove()
                    clearInterval(threads[id].timeout)

                }, TIME_OUT);

                doc = ifrm.contentDocument || ifrm.contentWindow.document
                var contentType = doc.contentType || doc.mimeType;
                var func = function () {
                    if (contentType.indexOf("text/html") >= 0) {
                        ++success;

                        if (link == ifrm.contentWindow.location.href.split('#')[0]) {
                            linkHolder[link].status = 'V';
                        } else {
                            linkHolder[link].status = 'R';
                        }

                        doc = ifrm.contentDocument || ifrm.contentWindow.document
                        data = doc.body.outerHTML

                        if (typeof data === 'string') {
                            if (!doesThePageExist(data))
                                linkHolder[link].status = 'X';

                            // TRIGGER PROXY AND SET CODE
                            threads[id].status = "stopped"
                            threads[id] = threads[id]
                            if (debug)
                                console.log("thread:" + id)
                            getForms(data, link);
                            pushLinks(getLinks(data, link), link);
                        }
                    } else {
                        linkHolder[link].status = 'U';
                    }

                    ifrm.remove()
                    clearInterval(threads[id].timeout)
                };

                if (ifrm.addEventListener)
                    ifrm.addEventListener('load', func, true);
                else if (ifrm.attachEvent)
                    ifrm.attachEvent('onload', func);
            }
        }
        else console.log('FINISHED (no more links to crawl)');
    }


    function doesThePageExist(sourceCode) {
        var ocurrences = sourceCode.match(/404|not found/g);
        if (ocurrences)
            return false
        else
            return true
    }


    function createThread(id) {
        ifrmCheck = document.getElementById(id)
        if (ifrmCheck == null) {
            var ifrm = document.createElement("iframe");
            ifrm.setAttribute("id", id);
            document.body.appendChild(ifrm);
            threads[id] = new Thread(id, "stopped")

        }
    }

    function deleteIframes() {
        for (var i = 0; i < MAX_THREADS; i++) {
            ifrmCheck = document.getElementById(i)
            ifrmCheck.remove()
        }
    }

    /**
    * Function that returns the iframe IDs of any iframe with the status "stopped".
    * @return   {Integer}         Iframe ID.
    */
    function getAvalilableThreads() {
        for (var i = 0; i < MAX_THREADS; i++) {
            if (threads[i].status == "stopped") {
                createThread(i);
                return i;
            } else {
                if (debug)
                    console.log(threads[i].id + " -> " + threads[i].status)
            }
        }
        return "All Threads Busy";
    }

    // after 5 attemps to obtain another lin
    attempts_to_nextlink = 0;
    /**
    * This intervienes in any change affecting the iframe elements, and it triggers the next URL to visit.
    */
    var arrayChangeHandler = {
        get: function (target, property) {
            return target[property];
        },
        set: function (target, property, value, receiver) {
            status = value.status
            id = value.id
            timers.push(setInterval(function () {
                if (debug)
                    console.log(threads)
                nextLink = getUnvisitedURI()

                if (attempts_to_nextlink > MAX_THREADS - 1) {
                    setTimeout(function () {
                        stopped = true;
                        limit = (success / limit >> 0) * limit + limit;
                        for (x = 0; x < timers.length; x++)
                            clearInterval(timers[x])

                        if (debug)
                            console.log("FIN")
                        arrayChangeHandler = null
                        tmp = null

                    }, 2000)
                }

                if (!nextLink) {
                    attempts_to_nextlink++
                } else {
                    attempts_to_nextlink = 0
                    if (success < limit && !stopped) {
                        ThreadId = getAvalilableThreads()
                        if (ThreadId == "All Threads Busy") {
                            if (debug)
                                console.log("All Threads Busy")
                        }

                        visitLink(nextLink, ThreadId);
                    }
                    else {
                        stopped = true;
                        limit = (success / limit >> 0) * limit + limit;

                        for (x = 0; x < timers.length; x++)
                            clearInterval(timers[x])

                        if (debug)
                            console.log("FIN")
                        arrayChangeHandler = null
                        tmp = null

                    }
                    if (debug)
                        console.log("fin run")
                }
            }, 3000));
            target[property] = value;
            // returning true means accepting the changes
            return true;
        }
    };


    // -----------------------------------------------------------------------------------------