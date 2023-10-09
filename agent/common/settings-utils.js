
    // ------------------------- settings-utils.js ---------------------------

    var standaloneSettings = { ENDPOINT_SETTINGS }

    /**
     * Function that fetches the settings from the web panel.
     * @param    {Call} callback   Function to be called.
     */
    function getRemoteSettings(callback) {

        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', baseURL + "/api/patterns/client");
            xhr.setRequestHeader("XX-Origin", "Formshaker");
            xhr.timeout = 3000;
            xhr.ontimeout = function () {
                App.notify('timeout', 'Formshaker webpage timeout');
                callback(standaloneSettings);
            };
            xhr.onerror = function () {
                console.warn('request_error');
                callback(standaloneSettings);
            };
            xhr.onload = function () {
                if (xhr.readyState !== 4) {
                    callback(standaloneSettings);
                }

                if (xhr.readyState == XMLHttpRequest.DONE && xhr.responseText) {

                    console.log('success! Formshaker settings obtained');
                    callback(JSON.parse(xhr.responseText));
                }
                else {
                    console.warn('request_error');
                    callback(standaloneSettings);
                }
            };


            xhr.send(null);
        } catch (e) {
            callback(standaloneSettings);
        }
    }

    var settings;

