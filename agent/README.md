# Dev Notes

## Description:

The scope of Formshaker is determined by the context of the affected user and by the functionality of the web page where the injected library runs. Formshaker takes advantage of running in the user's context and the visibility of the functionalities offered by the target website. Since the JS library is running on the victim's browser, it can retrieve the anti-CSRF tokens to submit the forms and bypass those form protected against CSRF attacks. These features make Formshaker a very useful tool when exploiting XSS vulnerabilities.
It can be highlighted the two main tasks that Formshaker performs simultaneously:
* Webscraping, crawling, form harvesting and form submmition.
* A loop asking for new forms to be injected.

Currently for the crawling, form harvesting, and form injection process there are two modes available:
* Iframe mode.
* AJAX mode.

The discovery process with AJAX mode accomplishes with the same-origin policy (SOP) imposed by the browser. In both modes, the js agent runs on the same origin and operate under the security context of the affected user. Thus, Formshaker has the ability to make HTTP calls and access the HTTP responses of different parts on the same website.
On the other hand, the discovering process through Iframes is slower and heavier and yet it is useful where authentication is performed through basic authentication or in those cases where the forms rendering is dynamic.
Depending on the circunstances and characteristics of the target webpage, one mode could be more suitable than the other. We haven't looked into the feasibility of automating the process that determines which mode is more appropiate during the execution, however both modes works simultaneously by default.

## Process, step to step:

1. Create a session ID to identify the user and a execution ID to keep track of the executions.
1. Mutex test: Avoid running two formshaker instance.
2. Settings retrieval (loop): two possible alternatives; it reaches the remote endpoint, so it has internet connectivity, and therefore, it uses the remote settings. Alternatively, it times out, so it uses the hardcoded settings.
3. [to be done]: Any form discovered over the spidering process will be marked as juicy and automatically injected, then...*1. there is a switch to enable this behavior by default.
4. Fetch modified forms (loop): this is another repetitive task that keeps running in the background to retrieve the forms that has been marked to be injected from the formshaker dashboard.
    * When the Formshaker API dispatches a form, this immediately passes the form to the injection form functionality which will set up a request and send it.
    * *1 Each time a form is marked to be "injected", FormShaker will send two forms (requests). The emptied inputs' values and the default ones will remain in the first request. The second form will have all the parameters (input's values) filled with an alternative value. This is done by using an algorithm that sets the most suitable values according to the input's characteristics and the settings configured.
5. The spidering process is carried out using two alternative methods; the chosen method could be more suitable depending on the website characteristics.
    * This process includes some validations to avoid visiting two similar URLs, it is a custom algorithm, and therefore, you should expect some inconsistencies.
    * Any harvested forms are sent to the formshaker web app.
    * The spidering process ends when the number of pages has reached the limit or there aren't anymore links to visit.

Finally, it is worth mentioning that you can debug the URLs and forms found at the end of the spidering execution. Run the library and once finished type this: debug1()

## Build:

The folder 'common' contains scripts used by both modes:
* form-utils.js
* spider-utils.js
* input-utils.js
* link-utils.js
* pivot-utils.js
* prefix-main.js
* sufix-main.js

The folder 'ajax-based' contains exclusive functionalities for this mode:
* link-utils.ajax.js
* main.ajax.js
* pivot-utils.ajax.js

The folder 'iframe-based' contains exclusive functionalities for this mode:
* core.iframe.js
* link-utils.iframe.js
* main.iframe.js
* pivot-utils.iframe.js

The folder 'unit-tests' includes unit tests on "each" component.

To build the JS library you have to run one of the two scripts, depending on the chosen mode:

```
./combinejs-iframe-based.sh
./combinejs-ajax-based.sh
```

Additionally, you can obfuscate the code by using https://github.com/javascript-obfuscator/javascript-obfuscator:
```
 npx javascript-obfuscator malicious.ajax.min.js --output test.js
```


## Extra:

Speed tests outcome:
* 10 iframes / 40 link limit = Execution time: 15:04:10.885
* 6 iframes / 40 link limit = Execution time: 15:06:56.062

https://developers.google.com/web/tools/chrome-devtools/network/reference?utm_source=devtools#timing-explanation
**There are already six TCP connections open for this origin, which is the limit. Applies to HTTP/1.0 and HTTP/1.1 only.**

![Waterfall](https://github.com/gofillo/formshaker-jslib/blob/main/images/Waterfall.jpg?raw=true)
