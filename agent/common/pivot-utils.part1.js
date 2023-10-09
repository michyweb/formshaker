
var activeModes = []

/**
* Function that retrieves the modified forms from the web panel.
*/
function getModifiedForms() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", endpoint + "/" + sessionID);
        xhr.setRequestHeader("XX-Origin", "Formshaker");
        xhr.timeout = 4000;
        xhr.ontimeout = function () {
            App.notify('timeout', 'Formshaker webpage timeout');
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var contentType = xhr.getResponseHeader("Content-Type");
                if (contentType && contentType.indexOf("application/json") >= 0) {
                    var status = xhr.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        if (activeModes["ajax"])
                            activeModes["ajax"].proxy(xhr.responseText)
                        if (activeModes["iframe"])
                            activeModes["iframe"].proxy(xhr.responseText)

                        App.notify('success', 'Formshaker successfully connected!');
                    }
                }
            }
        }
        xhr.send(null);
    } catch (e) {
        console.warn('connectivity error while connecting to the API - the script will carry on with the standaloneSettings');

    }
}