
    //------------------------[+] form-utils.js [+]-----------------------------------

    /**
    * Form class.
    * @param    {String} action                 
    * @param    {String} method                 
    * @param    {String} enctype                
    * @param    {String} outerHTML              
    * @param    {String} origin                 
    * @param    {Integer} formNumberInPage      
    */
    function Form(action, method, enctype, outerHTML, origin, formNumberInPage) {
        this.origin = origin
        this.action = action;
        this.method = method;
        this.outerHTML = outerHTML;
        this.enctype = enctype;
        this.inputs = [];
        this.queryForm = "";
        this.identifier = "";
        this.base64link = "";
        this.sessionID = "";
        this.executionID = "";
        this.time = "";
        this.juicy = false;
        this.blacklisted = false;
        this.mode = mode

        this.updateAction = function (action) {
            hash = action.split('#')[1];
            this.action = this.origin + '#' + hash
        }

        this.formNumberInPage = formNumberInPage
        this.setInputs = function (input) {
            this.inputs.push(input)
        }

        hashCode = function (s) {
            return s.split("").reduce(function (a, b) {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a
            }, 0);
        }

        this.setJuiciness = function (juicy) {
            this.juicy = juicy
        }

        this.setBlackListedForm = function (blacklisted) {
            this.blacklisted = blacklisted
        }

        this.setId = function (form) {
            parameters = ""
            form.inputs.forEach(function (element) {
                parameters = parameters.concat(element.name);
            });
            this.identifier = hashCode(parameters + form.action + form.method).toString() + this.sessionID;
        }

        this.setQuery = function (form) {
            queryForm = ""
            form.inputs.forEach(function (element) {
                if (element.type != "checkbox" && element.type != "submit")
                    queryForm = queryForm.concat(element.name + "=" + element.value + "&");
            });
            this.queryForm = queryForm
        }

        this.setBase64Link = function () {
            this.base64link = "data:text/html;base64," + btoa(unescape(encodeURIComponent("<center>" + this.outerHTML + "</center>")))

        }

        this.setSessionID = function (sessionID) {
            this.sessionID = sessionID

        }

        this.setExecutionID = function (executionID) {
            this.executionID = executionID

        }

        this.setTime = function () {
            var a = new Date();
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            this.time = encodeURIComponent(date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec);

        }

        this.getFormAsJson = function () {
            return JSON.stringify(this);
        }
    }

    var forms = [];
    debug2 = forms;

    /**
    * Function that parses the available forms in a web page.
    * @param    {String} html       Source code of the visited page.
    * @param    {String} origin     The URL where the form was found.
    */
    function getForms(html, origin) {
        forms_dict = []
        inputs_dict = []
        id = 0
        parsedDocument = new DOMParser().parseFromString(html, "text/html");

        for (form of parsedDocument.forms) {
            formNumberInPage = id
            inputs_dict.push([])
            forms_dict.push(form)
            var inputs = form.elements;
            for (i = 0; i < inputs.length; i++) {
                inputs_dict[id].push(inputs[i])
            }
            setFormObjects(id, inputs_dict, forms_dict, origin, formNumberInPage)
            id++
        }

    }

    function findRawAction(texts) {
        for (var i = 0; i < texts.length; i++) {
            if (texts[i].nodeName == "action" && texts[i].nodeValue) {
                return texts[i].nodeValue;
            }
        }
        return null;
    }


    /**
     * Function that creates the Form objects
     * @param    {Integer} id                    To track the form and its inputs.
     * @param    {List} inputs_dict              List of objects, these objects correspond to the inputs of a form.
     * @param    {List} forms_dict               List of objects, these objects correspond to the each form.
     * @param    {String} origin                 The URL where the form was found.
     * @param    {Integer} formNumberInPage      The number of the form in the page (there might be several forms in the same page).
     */
    function setFormObjects(id, inputs_dict, forms_dict, origin, formNumberInPage) {

        var i = 0;
        var form_tmp = forms_dict[id]
        var inputs_tmp = inputs_dict[id]

        // form_tmp.action returns the referer value rather than an empty value when the action is =""
        var actionRaw = findRawAction(form_tmp.attributes);
        var action = form_tmp.action
        if (!actionRaw) {
            action = origin
        }

        var form = new Form(action, form_tmp.method, form_tmp.enctype, form_tmp.outerHTML, origin, formNumberInPage)

        if (action.includes('#')) {
            form.updateAction(action)
        }

        if (settings.blacklist) {
            var regex = new RegExp(settings.blacklist.join("|"), "i");
            // If any words from the blacklist appear on the form, then the Form is marked as blacklisted and therefore won't be submitted. this measure prevails over the Forms marked as juicy.
            if (regex.test(form_tmp.outerHTML))
                form.setBlackListedForm(true)

        }

        var juicyForm = false;

        for (j = 0; j < inputs_tmp.length; j++) {
            var input = inputs_tmp[j];

            if (input.name) {
                if (checkJuicyInput(input))
                    juicyForm = true;

                if (input.type == "select-one") {
                    var options = [];
                    var defaultValue = "";
                    for (var option of input.options) {
                        if (option.selected)
                            defaultValue = option.value
                        options.push({ "value": option.value, "text": option.text, "selected": option.selected })
                    }
                    form.setInputs(new Input(input.type, input.name, JSON.stringify(options), defaultValue, undefined, undefined, input.innerText))

                } else if (input.type == "checkbox" || input.type == "radio") {

                    form.setInputs(new Input(input.type, input.name, input.value, undefined, undefined, input.checked, input.innerText))
                } else {
                    form.setInputs(new Input(input.type, input.name, input.value, undefined, undefined, undefined, input.innerText))
                }
            }
            i++;
        };
        form.setJuiciness(juicyForm)
        form.setSessionID(sessionID)
        form.setId(form);
        form.setQuery(form);
        form.setBase64Link();
        form.setExecutionID(executionID)
        form.setTime()

        if (!containsObject(form, forms)) {

            if (settings.injectasitgoes && !form.blacklisted) {
                if (debug) {
                    console.log("debug: This form will be autosubmited")
                    console.log("[" + form.getFormAsJson() + "]")
                }
                CreateTwoPayloadsFromOne_and_InjectThem(form)
            }
            if (!settings.injectasitgoes) {
                sendForms(form.getFormAsJson())
            }
            forms.push(form);
        }

    }


    function containsObject(form, forms) {
        var found = false;
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].identifier == form.identifier) {

                found = true;
                return found
            }
        }
    }



    // -----------------------------------------------------------------------------------------