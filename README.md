
![DVWA](https://github.com/michyweb/formshaker/blob/main/agent/images/logo1.jpg?raw=true)

# Formshaker

**Formshaker is a tool created to enhance the capabilities of an attacker while exploiting XSS vulnerabilities.**

Formshaker is a JS lib that runs in browsers and acts as a proxy, establishing a bridge between websites functionality and attackers. Its purpose is to maximize the attacker capabilities when exploiting XSS. Formshaker is a project that we initiated in 2018. It consists of a web application and a JS agent. The JS agent operates in two modes: C&C dependent and standalone. From a technical standpoint, the tool’s purpose is to crawl a website, collect its HTML forms, and provide an attacker with visibility into the forms available on the website where the JS agent is active. This allows the attacker, through the C&C, to view, modify, and submit the forms via the JS agent within the context of the victim’s session. On the other hand, the standalone version of the tool is self-contained. It includes all the necessary information within the JS code to populate form inputs and make decisions to automatically submit forms with preconfigured data. It’s important to note that this mode operates independently and does not interact with the C&C. An intriguing scenario occurs when you, as an attacker, inject the JS agent into the victim’s browser, particularly if that person possesses admin privileges. In such a case, the JS agent would identify the user creation form, fill its inputs with predetermined values (such as the attacker’s email and password), and proceed to create a user.



**Formshaker does not work with SPA (Single-page based websites) as those made with React.js and Vue.js**


## Demo:

Here's an example of Formshaker in action:
![DVWA](https://github.com/michyweb/formshaker/blob/main/agent/images/demo-dvwa.gif?raw=true)

On the left is the vulnerable web, in this case DVWA and on the right the Formshaker control panel. These are the steps that were followed in the demo:
* Run a listener on the TCP 5001.
* I inject the JS Formshaker library into a section vulnerable to Reflected XSS.
* Formshaker invisibly starts spidering the entire website looking for forms and sending them to the control panel.
* From the control panel I select the form vulnerable to command injection and set the payload for the reverse shell, finally I inject that form.
* The JS Formshaker library gets the updated form and submited it.
* The listener receives the connection from the reverse shell.

In summary, the demo shows how through an XSS injection it is possible to control the website forms, in addition, an RCE is exploited in the web portal by injecting a form that, when submited, it executes a reverse shell. As you can see, this is achieved by updating the inputs of a form from the Formshaker control panel and subsequently submitting it.

## Presented in:
- Hacktivity - 05 Oct 2023: https://hacktivity.com/events/formshaker/ 

## Special thanks to: 
- Pablo Alvarez Fernando for the logo and images
- Leonardo Dutra for the original code of the crawler
- Creativetimofficial for the dashboard template (https://github.com/creativetimofficial/argon-dashboard)

## Disclaimer:

All information and software available on this site are for educational purposes only. Use these at your own discretion, the site owners cannot be held responsible for any damages caused. The views expressed on this site are our own and do not necessarily reflect those of our employers.
Usage of all tools on this site for attacking targets without prior mutual consent is illegal. It is the end user’s responsibility to obey all applicable local, state and federal laws. We assume no liability and are not responsible for any misuse or damage caused by this site.