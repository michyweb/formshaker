
    //------------------------[+] link-utils.js [+]-----------------------------------

    /**
    * Function that prevents visiting or adding unwanted links.
    * @param    {String} pathname   Path property of an URL, including filename.
    * @return   {Boolean}           ... 
    */
    function urlValidation(pathname) {
        return !((/\.(gif|jpg|jpeg|tiff|png|woff|woff2|pdf|js)$/i).test(pathname)) && !((/logout/i).test(pathname))

    }

    /**
    * Function that parses the DOM of a visited page in order to harvest the 'a' HTML elements. (Links)
    * @param    {String} html    HTML source code
    * @return   {List}         the links found.
    */
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
                                URLRedundancyValidation(url)
                            }
                        }
                    }
                }
            }
        };
        return matches;
    }

    // -------------------------------------------------------------------------------------
