
    //------------------------[+] spider-utils.js [+]-----------------------------------

    /*
    *       URL Redundancy validation
    */
    arrLengths = []
    arrPosition = []
    /**
    * Function that parses the query parameters.
    * @param    {String} _url   A URL including query parameters.
    * @return   {List}          list of the query params.
    */
    function getParamNames(_url) {
        var qParams = [];
        if (_url.search) _url.search.substr(1).split`&`.forEach(item => { let [k, v] = item.split`=`; (qParams.push(k) || "") })
        qParams.sort()
        _qParams = qParams.join("")
        return _qParams
    }

    params = []
    redundantURLs = []
    /**
    * Function that checks if the URL is redundant. It's a custom algorithem that doesn't work pretty well.
    * @param    {String} newurl    A URL.
    */
    function URLRedundancyValidation(newurl) {
        _url = new URL(newurl)
        pathname = (_url.pathname.endsWith("/")) ? _url.pathname : _url.pathname + "/";
        queryParams = ""
        if (_url.search != "") {
            queryParams = getParamNames(_url)
        }
        pathquerylen = pathname.length + queryParams.length

        if (matches.length > 0) {
            samelength = false
            for (x in arrLengths) {
                // Several URLs have already been added to the array; if one of them matches the length of the one being tested, then it is checked if it's a pathid...
                if (arrLengths[x] == pathquerylen) {
                    samelength = true

                    // if it contains parameters...
                    if (_url.search != "" && !params.includes(pathname + "?" + queryParams)) {
                        _queryParams = getParamNames(new URL(matches[x]));

                        /*  _queryParams = querystring parameters of a URL with the same length as the one being tested right now.
                            queryParams = querystring parameters of the URL being tested right now.
                            If there's a match from an added URL that has the same parameters, we end the test.
                        */
                        if (_queryParams == queryParams) {
                            redundantURLs.push(newurl)
                            params.push(pathname + "?" + queryParams)
                            return;
                        }
                    }
                }
            }

            if (samelength) {
                arrypathname = pathname.split("/")
                foundinknownpositions = false;
                if (arrPosition.length > 0) {
                    path_id = false
                    for (y in arrPosition) {
                        path = arrypathname[arrPosition[y]]
                        if (path != null && path != "" && isThereAnIDInThePath(path)) {
                            console.log("1) path id: " + path)
                            redundantURLs.push(newurl)
                            foundinknownpositions = true
                            path_id = true
                            break;
                        }
                    }
                }
                if (foundinknownpositions == false) {
                    path_id = false
                    for (y in arrypathname) {
                        path = arrypathname[y]
                        if (path != null && path != "" && isThereAnIDInThePath(path)) {
                            console.log("2) path id: " + path)
                            redundantURLs.push(newurl)
                            path_id = true
                            break;
                        }
                    }
                    if (!path_id)
                        matches.push(newurl)
                }
            } else {
                arrLengths.push(pathquerylen)
                matches.push(newurl)
            }

        } else {
            arrLengths.push(pathquerylen)
            matches.push(newurl)
        }
    }


    /**
    * Function that checks if the URL includes a identifier to avoid visiting similar URLs.
    * @param    {String} path    the path of a URL.
    * @return   {Boolean}         Greeting message
    */
    function isThereAnIDInThePath(path) {

        pathlength = path.length
        pathnumbers = path.replace(/\D/g, '');
        if (pathnumbers !== "") {
            path_count_of_numbers = pathnumbers.length
            // If it doesn't have at least two numbers, it's not an ID, or it'll be a crappy ID
            if (path_count_of_numbers > 2) {

                // Password cracking speed 1 million per second, A-Z 0-9, 8 digits = 32.65 days. 9 digits = 3.22 years
                if (pathlength >= 8) {

                    // if the length of numbers is greater than a third of the length of that directory's name, it is then considered that the path is an ID
                    if (path_count_of_numbers >= path_count_of_numbers / 3) {
                        // The indices of the position where the path ID was found are added to an array.
                        if (!arrPosition.includes(y))
                            arrPosition.push(y)

                        return true;
                    }
                }
            }
        }
    }

    // ----------------------------------------------------------------------------------------
