
    //------------------------[+] input-utils.js [+]-----------------------------------
    /**
    * HTML Input manager
    * The functions manage the payloads (forms to be injected) inputs, thereby adding or updating values.
    */


    //
    // randexp v0.4.3
    // Create random strings that match a given regular expression.
    //
    // Copyright (C) 2016 by Roly Fentanes (https://github.com/fent)
    // MIT License
    // http://github.com/fent/randexp.js/raw/master/LICENSE 
    //
    !function () { var e = "RandExp", t = function () { return function e(t, n, r) { function o(s, i) { if (!n[s]) { if (!t[s]) { var u = "function" == typeof require && require; if (!i && u) return u(s, !0); if (a) return a(s, !0); var p = new Error("Cannot find module '" + s + "'"); throw p.code = "MODULE_NOT_FOUND", p } var h = n[s] = { exports: {} }; t[s][0].call(h.exports, function (e) { var n = t[s][1][e]; return o(n ? n : e) }, h, h.exports, e, t, n, r) } return n[s].exports } for (var a = "function" == typeof require && require, s = 0; s < r.length; s++)o(r[s]); return o }({ 1: [function (e, t, n) { function r(e) { return e + (e >= 97 && 122 >= e ? -32 : e >= 65 && 90 >= e ? 32 : 0) } function o() { return !this.randInt(0, 1) } function a(e) { return e instanceof h ? e.index(this.randInt(0, e.length - 1)) : e[this.randInt(0, e.length - 1)] } function s(e) { if (e.type === p.types.CHAR) return new h(e.value); if (e.type === p.types.RANGE) return new h(e.from, e.to); for (var t = new h, n = 0; n < e.set.length; n++) { var o = s.call(this, e.set[n]); if (t.add(o), this.ignoreCase) for (var a = 0; a < o.length; a++) { var i = o.index(a), u = r(i); i !== u && t.add(u) } } return e.not ? this.defaultRange.clone().subtract(t) : t } function i(e, t) { "number" == typeof t.max && (e.max = t.max), t.defaultRange instanceof h && (e.defaultRange = t.defaultRange), "function" == typeof t.randInt && (e.randInt = t.randInt) } function u(e, t) { var n, i, p, h, c; switch (e.type) { case l.ROOT: case l.GROUP: if (e.followedBy || e.notFollowedBy) return ""; for (e.remember && void 0 === e.groupNumber && (e.groupNumber = t.push(null) - 1), n = e.options ? a.call(this, e.options) : e.stack, i = "", h = 0, c = n.length; c > h; h++)i += u.call(this, n[h], t); return e.remember && (t[e.groupNumber] = i), i; case l.POSITION: return ""; case l.SET: var f = s.call(this, e); return f.length ? String.fromCharCode(a.call(this, f)) : ""; case l.REPETITION: for (p = this.randInt(e.min, e.max === 1 / 0 ? e.min + this.max : e.max), i = "", h = 0; p > h; h++)i += u.call(this, e.value, t); return i; case l.REFERENCE: return t[e.value - 1] || ""; case l.CHAR: var g = this.ignoreCase && o.call(this) ? r(e.value) : e.value; return String.fromCharCode(g) } } var p = e("ret"), h = e("discontinuous-range"), l = p.types, c = t.exports = function (e, t) { if (this.defaultRange = this.defaultRange.clone(), e instanceof RegExp) this.ignoreCase = e.ignoreCase, this.multiline = e.multiline, i(this, e), e = e.source; else { if ("string" != typeof e) throw new Error("Expected a regexp or string"); this.ignoreCase = t && -1 !== t.indexOf("i"), this.multiline = t && -1 !== t.indexOf("m") } this.tokens = p(e) }; c.prototype.max = 100, c.prototype.gen = function () { return u.call(this, this.tokens, []) }, c.randexp = function (e, t) { var n; return void 0 === e._randexp ? (n = new c(e, t), e._randexp = n) : n = e._randexp, i(n, e), n.gen() }, c.sugar = function () { RegExp.prototype.gen = function () { return c.randexp(this) } }, c.prototype.defaultRange = new h(32, 126), c.prototype.randInt = function (e, t) { return e + Math.floor(Math.random() * (1 + t - e)) } }, { "discontinuous-range": 2, ret: 3 }], 2: [function (e, t, n) { function r(e, t) { this.low = e, this.high = t, this.length = 1 + t - e } function o(e, t) { return this instanceof o ? (this.ranges = [], this.length = 0, void 0 !== e && this.add(e, t), void 0) : new o(e, t) } function a(e) { e.length = e.ranges.reduce(function (e, t) { return e + t.length }, 0) } r.prototype.overlaps = function (e) { return !(this.high < e.low || this.low > e.high) }, r.prototype.touches = function (e) { return !(this.high + 1 < e.low || this.low - 1 > e.high) }, r.prototype.add = function (e) { return this.touches(e) && new r(Math.min(this.low, e.low), Math.max(this.high, e.high)) }, r.prototype.subtract = function (e) { return this.overlaps(e) ? e.low <= this.low && e.high >= this.high ? [] : e.low > this.low && e.high < this.high ? [new r(this.low, e.low - 1), new r(e.high + 1, this.high)] : e.low <= this.low ? [new r(e.high + 1, this.high)] : [new r(this.low, e.low - 1)] : !1 }, r.prototype.toString = function () { return this.low == this.high ? this.low.toString() : this.low + "-" + this.high }, r.prototype.clone = function () { return new r(this.low, this.high) }, o.prototype.add = function (e, t) { function n(e) { for (var t = [], n = 0; n < s.ranges.length && !e.touches(s.ranges[n]);)t.push(s.ranges[n].clone()), n++; for (; n < s.ranges.length && e.touches(s.ranges[n]);)e = e.add(s.ranges[n]), n++; for (t.push(e); n < s.ranges.length;)t.push(s.ranges[n].clone()), n++; s.ranges = t, a(s) } var s = this; return e instanceof o ? e.ranges.forEach(n) : e instanceof r ? n(e) : (void 0 === t && (t = e), n(new r(e, t))), this }, o.prototype.subtract = function (e, t) { function n(e) { for (var t = [], n = 0; n < s.ranges.length && !e.overlaps(s.ranges[n]);)t.push(s.ranges[n].clone()), n++; for (; n < s.ranges.length && e.overlaps(s.ranges[n]);)t = t.concat(s.ranges[n].subtract(e)), n++; for (; n < s.ranges.length;)t.push(s.ranges[n].clone()), n++; s.ranges = t, a(s) } var s = this; return e instanceof o ? e.ranges.forEach(n) : e instanceof r ? n(e) : (void 0 === t && (t = e), n(new r(e, t))), this }, o.prototype.index = function (e) { for (var t = 0; t < this.ranges.length && this.ranges[t].length <= e;)e -= this.ranges[t].length, t++; return t >= this.ranges.length ? null : this.ranges[t].low + e }, o.prototype.toString = function () { return "[ " + this.ranges.join(", ") + " ]" }, o.prototype.clone = function () { return new o(this) }, t.exports = o }, {}], 3: [function (e, t, n) { var r = e("./util"), o = e("./types"), a = e("./sets"), s = e("./positions"); t.exports = function (e) { var t, n, i = 0, u = { type: o.ROOT, stack: [] }, p = u, h = u.stack, l = [], c = function (t) { r.error(e, "Nothing to repeat at column " + (t - 1)) }, f = r.strToChars(e); for (t = f.length; t > i;)switch (n = f[i++]) { case "\\": switch (n = f[i++]) { case "b": h.push(s.wordBoundary()); break; case "B": h.push(s.nonWordBoundary()); break; case "w": h.push(a.words()); break; case "W": h.push(a.notWords()); break; case "d": h.push(a.ints()); break; case "D": h.push(a.notInts()); break; case "s": h.push(a.whitespace()); break; case "S": h.push(a.notWhitespace()); break; default: /\d/.test(n) ? h.push({ type: o.REFERENCE, value: parseInt(n, 10) }) : h.push({ type: o.CHAR, value: n.charCodeAt(0) }) }break; case "^": h.push(s.begin()); break; case "$": h.push(s.end()); break; case "[": var g; "^" === f[i] ? (g = !0, i++) : g = !1; var y = r.tokenizeClass(f.slice(i), e); i += y[1], h.push({ type: o.SET, set: y[0], not: g }); break; case ".": h.push(a.anyChar()); break; case "(": var d = { type: o.GROUP, stack: [], remember: !0 }; n = f[i], "?" === n && (n = f[i + 1], i += 2, "=" === n ? d.followedBy = !0 : "!" === n ? d.notFollowedBy = !0 : ":" !== n && r.error(e, "Invalid group, character '" + n + "' after '?' at column " + (i - 1)), d.remember = !1), h.push(d), l.push(p), p = d, h = d.stack; break; case ")": 0 === l.length && r.error(e, "Unmatched ) at column " + (i - 1)), p = l.pop(), h = p.options ? p.options[p.options.length - 1] : p.stack; break; case "|": p.options || (p.options = [p.stack], delete p.stack); var v = []; p.options.push(v), h = v; break; case "{": var R, C, w = /^(\d+)(,(\d+)?)?\}/.exec(f.slice(i)); null !== w ? (R = parseInt(w[1], 10), C = w[2] ? w[3] ? parseInt(w[3], 10) : 1 / 0 : R, i += w[0].length, h.push({ type: o.REPETITION, min: R, max: C, value: h.pop() })) : h.push({ type: o.CHAR, value: 123 }); break; case "?": 0 === h.length && c(i), h.push({ type: o.REPETITION, min: 0, max: 1, value: h.pop() }); break; case "+": 0 === h.length && c(i), h.push({ type: o.REPETITION, min: 1, max: 1 / 0, value: h.pop() }); break; case "*": 0 === h.length && c(i), h.push({ type: o.REPETITION, min: 0, max: 1 / 0, value: h.pop() }); break; default: h.push({ type: o.CHAR, value: n.charCodeAt(0) }) }return 0 !== l.length && r.error(e, "Unterminated group"), u }, t.exports.types = o }, { "./positions": 4, "./sets": 5, "./types": 6, "./util": 7 }], 4: [function (e, t, n) { var r = e("./types"); n.wordBoundary = function () { return { type: r.POSITION, value: "b" } }, n.nonWordBoundary = function () { return { type: r.POSITION, value: "B" } }, n.begin = function () { return { type: r.POSITION, value: "^" } }, n.end = function () { return { type: r.POSITION, value: "$" } } }, { "./types": 6 }], 5: [function (e, t, n) { var r = e("./types"), o = function () { return [{ type: r.RANGE, from: 48, to: 57 }] }, a = function () { return [{ type: r.CHAR, value: 95 }, { type: r.RANGE, from: 97, to: 122 }, { type: r.RANGE, from: 65, to: 90 }].concat(o()) }, s = function () { return [{ type: r.CHAR, value: 9 }, { type: r.CHAR, value: 10 }, { type: r.CHAR, value: 11 }, { type: r.CHAR, value: 12 }, { type: r.CHAR, value: 13 }, { type: r.CHAR, value: 32 }, { type: r.CHAR, value: 160 }, { type: r.CHAR, value: 5760 }, { type: r.CHAR, value: 6158 }, { type: r.CHAR, value: 8192 }, { type: r.CHAR, value: 8193 }, { type: r.CHAR, value: 8194 }, { type: r.CHAR, value: 8195 }, { type: r.CHAR, value: 8196 }, { type: r.CHAR, value: 8197 }, { type: r.CHAR, value: 8198 }, { type: r.CHAR, value: 8199 }, { type: r.CHAR, value: 8200 }, { type: r.CHAR, value: 8201 }, { type: r.CHAR, value: 8202 }, { type: r.CHAR, value: 8232 }, { type: r.CHAR, value: 8233 }, { type: r.CHAR, value: 8239 }, { type: r.CHAR, value: 8287 }, { type: r.CHAR, value: 12288 }, { type: r.CHAR, value: 65279 }] }, i = function () { return [{ type: r.CHAR, value: 10 }, { type: r.CHAR, value: 13 }, { type: r.CHAR, value: 8232 }, { type: r.CHAR, value: 8233 }] }; n.words = function () { return { type: r.SET, set: a(), not: !1 } }, n.notWords = function () { return { type: r.SET, set: a(), not: !0 } }, n.ints = function () { return { type: r.SET, set: o(), not: !1 } }, n.notInts = function () { return { type: r.SET, set: o(), not: !0 } }, n.whitespace = function () { return { type: r.SET, set: s(), not: !1 } }, n.notWhitespace = function () { return { type: r.SET, set: s(), not: !0 } }, n.anyChar = function () { return { type: r.SET, set: i(), not: !0 } } }, { "./types": 6 }], 6: [function (e, t, n) { t.exports = { ROOT: 0, GROUP: 1, POSITION: 2, SET: 3, RANGE: 4, REPETITION: 5, REFERENCE: 6, CHAR: 7 } }, {}], 7: [function (e, t, n) { var r = e("./types"), o = e("./sets"), a = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?", s = { 0: 0, t: 9, n: 10, v: 11, f: 12, r: 13 }; n.strToChars = function (e) { var t = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z\[\\\]\^?])|([0tnvfr]))/g; return e = e.replace(t, function (e, t, n, r, o, i, u, p) { if (n) return e; var h = t ? 8 : r ? parseInt(r, 16) : o ? parseInt(o, 16) : i ? parseInt(i, 8) : u ? a.indexOf(u) : p ? s[p] : void 0, l = String.fromCharCode(h); return /[\[\]{}\^$.|?*+()]/.test(l) && (l = "\\" + l), l }) }, n.tokenizeClass = function (e, t) { for (var a, s, i = [], u = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?(.)/g; null != (a = u.exec(e));)if (a[1]) i.push(o.words()); else if (a[2]) i.push(o.ints()); else if (a[3]) i.push(o.whitespace()); else if (a[4]) i.push(o.notWords()); else if (a[5]) i.push(o.notInts()); else if (a[6]) i.push(o.notWhitespace()); else if (a[7]) i.push({ type: r.RANGE, from: (a[8] || a[9]).charCodeAt(0), to: a[10].charCodeAt(0) }); else { if (!(s = a[12])) return [i, u.lastIndex]; i.push({ type: r.CHAR, value: s.charCodeAt(0) }) } n.error(t, "Unterminated character class") }, n.error = function (e, t) { throw new SyntaxError("Invalid regular expression: /" + e + "/: " + t) } }, { "./sets": 5, "./types": 6 }] }, {}, [1]) }()(1); "function" == typeof define && "object" == typeof define.amd ? define(e, function () { return t }) : "undefined" != typeof window && (window[e] = t) }();



    /**
    * Function that determines whether an input is interesing or not. this relies on the settings inputs.
    * @param    {Object} input    An object that represents an input.
    */
    function checkJuicyInput(input) {
        for (setting of settings.inputs) {
            // the word "password" may appear in the HTML attributes value, name, type and in the innerText; 
            if (new RegExp(setting.regex, "i").test(input.name) || new RegExp(setting.regex, "i").test(input.Type) || new RegExp(setting.regex, "i").test(input.innerText) || (input.Type != "file" && new RegExp(setting.regex, "i").test(input.value))) {
                return true
            }
            if (input.Type == "select-one" && setting.name == "select-one") {
                for (var option of input.options) {
                    if (new RegExp(setting.regex, "i").test(option.value) || new RegExp(setting.regex, "i").test(option.innerText)) {
                        return true
                    }
                }

            }
        }
    }

    /**
    * Function that gets an "input" entry from the configured settings.
    * @param    {String} input      An input that matches any property of any input within the settings.
    * @return   {Object}            The "input" entry in the settings that matches the characteristics of the input passed as the argument.
    */
    function getTheSettingEntryByTheInput(input) {
        for (setting of settings.inputs) {
            if (input.Type != "select-one" && input.Type != "checkbox" && input.Type != "radio") {
                // the word "password" may appear in the HTML attributes value, name, type and in the innerText; 
                if (new RegExp(setting.regex, "i").test(input.name) || new RegExp(setting.regex, "i").test(input.Type) || new RegExp(setting.regex, "i").test(input.innerText) || (input.Type != "file" && new RegExp(setting.regex, "i").test(input.value))) {
                    return setting
                }
            }
        }

    }


    /**
    * Function that gets an "input" entry from the configured settings.
    * @param    {String} name    A string that matches the name of any input within the settings.
    * @return   {Object}         The "input" entry found in the settings.
    */
    function getTheSettingEntryByName(name) {
        for (var i = 0; i < settings.inputs.length; i++) {
            if (settings.inputs[i].name == name) {
                return settings.inputs[i]
            }
        }
        return "no settings detected"
    }


    /**
    * Function that updates the input values with one of the settings.
    * @param    {Object} input    An input element.
    * @return   {Object}          The input element with the updated values using those of the settings.
    */
    function updateUsingTheSettings(input) {

        if (settings) {
            setting = getTheSettingEntryByTheInput(input)
            if (setting)
                return new Input(input.Type, input.name, setting.value)

            for (setting of settings.inputs) {
                if (new RegExp(setting.regex, "i").test(input.name) || input.Type == setting.name) {
                    if (setting.value) {
                        return new Input(input.Type, input.name, setting.value)
                    }
                }
            }
        }
        return input

    }


    /**
    * Input class. It is used to represent the input element.
    * @param    {String} type           The input type.
    * @param    {String} name           The input name.
    * @param    {String} value          The input value.
    * @param    {String} defaultValue   The input default value.
    * @param    {String} pattern        The attribute of the input element.
    * @param    {Boolean} checked       Whether it is checked.
    * @param    {String} innerText      It represents the "rendered" text content of an input.
    */
    function Input(type, name, value, defaultValue, pattern, checked, innerText, fileName, contentType) {
        // 'T'ype because there was a conflict with MongoDB.
        this.Type = type;
        this.name = name;
        this.value = value;
        this.defaultValue = defaultValue;
        this.pattern = pattern
        this.checked = checked
        this.innerText = innerText
        this.fileName = fileName
        this.contentType = contentType

    }

    /**
    * Function that standarizes the Radio input types of the payloads/forms before they are injected..
    * @param    {List} inputs               The list of inputs within a form.
    * @param    {Boolean} allInputsFilled   It determines whether it should force the inputs to be filled with a suitable value or not.
    * @return   {List}                      List of Radio inputs
    */
    function getFinalRadioInputs(inputs, allInputsFilled) {
        // Radio type inputs always have a value
        var checkedInput;
        var settingsPreferedInput;
        var randomValue;
        var defaultValue;
        var modifiedFromWebsite;
        var radioGroups = []

        if (inputs) {
            groupedRadioInputs = inputs.reduce(function (r, a) {
                if (a.Type == "radio") {
                    r[a.name] = r[a.name] || [];
                    r[a.name].push(a);
                }
                return r;
            }, Object.create(null));

            if (groupedRadioInputs) {
                for (const [key, radios] of Object.entries(groupedRadioInputs)) {

                    var radioGroup = []
                    for (input of radios) {
                        if (input.Type == "radio") {

                            if (input.modified) {
                                modifiedFromWebsite = new Input(input.Type, input.name, input.value)
                                break

                            } else if (settings.inputs && new RegExp(getTheSettingEntryByName("radio").regex, "i").test(input.value)) {
                                settingsPreferedInput = new Input(input.Type, input.name, input.value, "", "", true)
                                break

                            } else if (input.checked) {
                                checkedInput = new Input(input.Type, input.name, input.value, undefined, undefined, input.checked)

                            } else {
                                // last in the list
                                randomValue = new Input(input.Type, input.name, input.value, undefined, undefined, input.checked)
                                defaultValue = new Input(input.Type, input.name, input.value, undefined, undefined, input.checked)

                            }
                        }
                    }

                    if (modifiedFromWebsite) {
                        radioGroups.push(modifiedFromWebsite)
                        modifiedFromWebsite = null
                    } else if (settingsPreferedInput) {
                        radioGroups.push(settingsPreferedInput)
                        settingsPreferedInput = null
                    } else if (checkedInput) {
                        radioGroups.push(checkedInput)
                        checkedInput = null
                    } else {
                        if (allInputsFilled && randomValue) {
                            radioGroups.push(randomValue)
                            randomValue = null
                        } else {
                            if (defaultValue) {
                                radioGroups.push(defaultValue)
                                defaultValue = null
                            }
                        }
                    }
                }
            }
        }

        if (radioGroups.length > 0) {
            return radioGroups

        } else {
            return null

        }
    }


    // multiple checkbox? multiple checkbox can be checked
    // &superadmin=on&regularuser=on
    /**
    * Function that standarizes the Checkbox input types of the payloads/forms before they are injected.
    * @param    {List} inputs               The list of inputs within a form.
    * @param    {Boolean} allInputsFilled   It determines whether it should force the inputs to be filled with a suitable value or not.
    * @return   {List}                      List of Checkbox inputs
    */
    function getFinalCheckboxInputs(inputs, allInputsFilled) {
        var checkedInput;
        var settingsPreferedInput;
        var randomValue;
        var defaultValue;
        var modifiedFromWebsite;
        var checkboxes = []

        if (inputs) {
            for (input of inputs) {
                if (input.Type == "checkbox") {

                    if (input.modified) {
                        modifiedFromWebsite = new Input(input.Type, input.name, input.value)

                    } else if (settings.inputs && new RegExp(getTheSettingEntryByName("checkbox").regex, "i").test(input.name)) {
                        settingsPreferedInput = new Input(input.Type, input.name, "on", undefined, undefined, true)

                    } else if (input.checked) {
                        checkedInput = new Input(input.Type, input.name, "on", undefined, undefined, input.checked)

                    } else {
                        // last in the list
                        randomValue = new Input(input.Type, input.name, "on", undefined, undefined, input.checked)
                        if (input.checked) {
                            defaultValue = new Input(input.Type, input.name, "on", undefined, undefined, input.checked)
                        } else {
                            defaultValue = new Input(input.Type, input.name, "off", undefined, undefined, input.checked)
                        }
                    }
                }
            }

            if (modifiedFromWebsite) {
                checkboxes.push(modifiedFromWebsite)
                modifiedFromWebsite = null
            } else if (settingsPreferedInput) {
                checkboxes.push(settingsPreferedInput)
            } else if (checkedInput) {
                checkboxes.push(checkedInput)

            } else {
                if (allInputsFilled && randomValue) {
                    checkboxes.push(randomValue)
                } else {
                    if (defaultValue)
                        checkboxes.push(defaultValue)
                }
            }
        }

        if (checkboxes.length > 0) {
            return checkboxes
        } else {
            return null

        }

    }


    /**
    * Function that standarizes the SelectOne input types of the payloads/forms before they are injected..
    * @param    {List} inputs               The list of inputs within a form.
    * @param    {Boolean} allInputsFilled   It determines whether it should force the inputs to be filled with a suitable value or not.
    * @return   {List}                      List of SelectOne inputs
    */
    function getFinalSelectOneInputs(inputs, allInputsFilled) {
        var selectedInput;
        var settingsPreferedInput;
        var randomValue;
        var selectGroups = [];

        if (debug)
            console.log('{"type":"' + inputs.type + '","name":"' + inputs.name + '","value":"' + JSON.stringify(_options) + '","defaultValue","' + defaultValue + '"}')
        if (inputs) {
            groupedRadioInputs = inputs.reduce(function (r, a) {
                if (a.Type == "select-one") {
                    r[a.name] = r[a.name] || [];
                    r[a.name].push(a);
                }
                return r;
            }, Object.create(null));

            if (groupedRadioInputs) {
                for (const [key, selects] of Object.entries(groupedRadioInputs)) {
                    for (input of selects) {
                        if (input.Type == "select-one") {
                            if (input.modified) {
                                selectGroups.push(new Input(input.Type, input.name, input.value))
                                break
                            }

                            if (input.defaultvalue !== undefined && input.defaultvalue != "") {
                                selectGroups.push(new Input(input.Type, input.name, input.defaultvalue))
                                break
                            }

                            options = JSON.parse(input.value)

                            for (j = 0; j < options.length; j++) {
                                var option = options[j];

                                if (settings.inputs && new RegExp(getTheSettingEntryByName("select-one").regex, "i").test(option.text)) {
                                    settingsPreferedInput = new Input(input.Type, input.name, option.value)
                                    break

                                    // when the default value is not a valid one -> "...choose... one option" or the value is "" it accepts is as long as "inputs can be empty"
                                } else if (option.selected && (!option.text.includes("choose") || option.value != "") && !allInputsFilled) {
                                    selectedInput = new Input(input.Type, input.name, option.value)

                                } else if (!option.text.includes("choose") || option.value != "") {
                                    randomValue = new Input(input.Type, input.name, option.value)
                                }
                            }
                        }
                        if (settingsPreferedInput) {
                            selectGroups.push(settingsPreferedInput)
                            settingsPreferedInput = null
                        } else if (selectedInput) {
                            selectGroups.push(selectedInput)
                            selectedInput = null
                        } else {
                            if (allInputsFilled && randomValue)
                                selectGroups.push(randomValue)

                        }
                    }
                }
            }
        }

        if (selectGroups.length > 0) {
            return selectGroups

        } else {
            return null

        }
    }


    /**
    * Function that validates and updates the inputs of the payloads/forms before they are injected. (excluding the Radio, Checkbox and SelectOne input types)
    * @param    {Object} input              An input of a form.
    * @param    {Boolean} allInputsFilled   It determines whether it should force the inputs to be filled with a suitable value or not.    
    * @return   {Object}                    The input updated.
    */
    function validateInputs(input, allInputsFilled) {
        if (debug)
            console.log('{"Type":"' + input.Type + '","name":"' + input.name + '","value":"' + input.value + '","pattern":"' + input.pattern + '","checked":' + input.checked + ',"defaultvalue":"","modified":false}')

        if (input.modified) {
            if (input.contentType && input.fileName) {
                return new Input(input.Type, input.name, input.value, undefined, undefined, undefined, undefined, input.fileName, input.contentType)
            } else {
                return new Input(input.Type, input.name, input.value)
            }
        }

        input = updateUsingTheSettings(input)

        // when the input has default value, it is then returned.
        if (input.value != "") {
            return new Input(input.Type, input.name, input.value)

            // when the input doesn't have default value and doesn't match our settings, a random value relying on the type and the name is set:
        } else if (allInputsFilled) {
            // the second statement is to avoid return 111222 when the input type is text and the name is phone. the scenario is covered below 
            if (input.Type == "text") {
                return getRandomValue(input)

            } else if (input.Type == "password") {
                return getRandomValue(input)

            } else if (input.Type == "checkbox") {
                return new Input(input.Type, input.name, "off")

            } else if (input.Type == "hidden") { // anti CSRF token generally
                return new Input(input.Type, input.name, input.value)

            } else if (input.Type == "submit") { // ...
                return new Input(input.Type, input.name, input.value)

            } else if (input.Type == "tel") {
                return getRandomValue(input)

            } else if (input.Type == "url") {
                return getRandomValue(input)

            } else if (input.Type == "radio") {
                return getRandomValue(input)

            } else {
                return new Input(input.Type, input.name, "111222")

            }

        } else {
            return new Input(input.Type, input.name, input.value)
        }
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy

    /**
    * Function that sets a random values relying on the type or the name of the input.
    * @param    {Object} input      An input element of a form.
    * @return   {Object}            The input updated.
    */
    function getRandomValue(input) {


        if (new RegExp(/date|fecha/i).test(input.name) || input.Type.includes("date")) {
            return new Input(input.Type, input.name, today)

        } else if (input.pattern == "" && (new RegExp(/mail|correo/i).test(input.name) || input.Type == "email")) {
            return new Input(input.Type, input.name, getTheSettingEntryByName("email").value)

        } else if (input.pattern == "" && (new RegExp(/passw|contra/i).test(input.name) || input.Type == "password")) {
            return new Input(input.Type, input.name, getTheSettingEntryByName("password").value)

        } else if (input.pattern == "" && (new RegExp(/phone|telefono/i).test(input.name) || input.Type == "tel")) {
            return new Input(input.Type, input.name, getTheSettingEntryByName("phone").value)

        } else if (input.pattern == "" && (new RegExp(/url|link|enlace/i).test(input.name) || input.Type == "url")) {
            return new Input(input.Type, input.name, getTheSettingEntryByName("url").value)

        } else if (input.pattern) { // as a last chance it generates a value relying on the pattern when it is present
            return new Input(input.Type, input.name, new RandExp(input.pattern).gen())

        } else {
            return new Input(input.Type, input.name, "111223")

        }
    }


    /**
    * Function in charge of preparing and updating the inputs before injecting the payloads/forms.
    * @param    {String} payload    the form to be injected
    * @return   {String}         Greeting message
    */
    function craftNewForms(inputs, allInputsFilled) {

        var tmpInputs = []

        var radio = getFinalRadioInputs(inputs, allInputsFilled)
        var selectone = getFinalSelectOneInputs(inputs, allInputsFilled)
        var checkbox = getFinalCheckboxInputs(inputs, allInputsFilled)

        if (radio)
            for (inp of radio) {
                tmpInputs.push(inp)
            }

        if (selectone)
            for (inp of selectone) {
                tmpInputs.push(inp)
            }

        if (checkbox)
            for (inp of checkbox) {
                tmpInputs.push(inp)
            }

        for (input of inputs) {
            if (input.Type != "radio" && input.Type != "checkbox" && input.Type != "select-one") {
                tmpInputs.push(validateInputs(input, allInputsFilled))
            }
        }

        newForm = JSON.parse(JSON.stringify(tmpInputs))

        if (debug) {
            console.log("Two attempts of form injection, logging both payloads:")
            console.log(newForm)

        }

        return newForm

    }

    /**
     * Function responsible for detecting the content type and file extension of a given file signature.
     * @param    {Uint8Array} signature    The file signature as a Uint8Array
     * @return   {Object}                  An object containing content type and file extension information
     */
    function getFileContentTypeAndExtension(uint8Array) {
        // Define known file type signatures and their corresponding content types and extensions
        const fileSignatures = [
            // Images
            { signature: [0xFF, 0xD8, 0xFF, 0xE0], contentType: 'image/jpeg', extension: 'jpg' },
            { signature: [0x89, 0x50, 0x4E, 0x47], contentType: 'image/png', extension: 'png' },
            { signature: [0x47, 0x49, 0x46, 0x38], contentType: 'image/gif', extension: 'gif' },
            { signature: [0x42, 0x4D], contentType: 'image/bmp', extension: 'bmp' },
            { signature: [0x25, 0x50, 0x44, 0x46], contentType: 'application/pdf', extension: 'pdf' },
            { signature: [0x89, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], contentType: 'image/png', extension: 'png' },
            { signature: [0x49, 0x49, 0x2A, 0x00], contentType: 'image/tiff', extension: 'tif' },
            { signature: [0x4D, 0x4D, 0x00, 0x2A], contentType: 'image/tiff', extension: 'tif' },

            // Text
            { signature: [0x3C, 0x3F, 0x70, 0x68], contentType: 'application/xml', extension: 'xml' },
            { signature: [0x7B, 0x22, 0x74, 0x61], contentType: 'application/json', extension: 'json' },
            { signature: [0x3C, 0x21, 0x44, 0x4F, 0x43, 0x54, 0x59, 0x50, 0x45, 0x20, 0x68, 0x74, 0x6D, 0x6C], contentType: 'text/html', extension: 'html' },
            { signature: [0x3C, 0x25, 0x40, 0x70, 0x61, 0x67, 0x65], contentType: 'text/html', extension: 'php' },
            { signature: [0x3C, 0x25, 0x40, 0x70, 0x61, 0x67, 0x65], contentType: 'text/html', extension: 'jsp' },

            // Audio and Video
            { signature: [0x52, 0x49, 0x46, 0x46], contentType: 'audio/wav', extension: 'wav' },
            { signature: [0x4D, 0x54, 0x68, 0x64], contentType: 'audio/midi', extension: 'mid' },
            { signature: [0x66, 0x4C, 0x61, 0x43], contentType: 'audio/flac', extension: 'flac' },
            { signature: [0x1A, 0x45, 0xDF, 0xA3], contentType: 'video/webm', extension: 'webm' },
            { signature: [0x66, 0x74, 0x79, 0x70, 0x4D, 0x53, 0x4E, 0x56], contentType: 'video/mp4', extension: 'mp4' },

            // Compressed Formats
            { signature: [0x1F, 0x8B, 0x08], contentType: 'application/gzip', extension: 'gz' },
            { signature: [0x50, 0x4B, 0x03, 0x04], contentType: 'application/zip', extension: 'zip' },

            // Office Documents
            { signature: [0x50, 0x4B, 0x03, 0x04], contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: 'docx' },
            { signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], contentType: 'application/vnd.ms-excel', extension: 'xls' },


            { signature: [0x3C, 0x25, 0x40, 0x70, 0x61, 0x67, 0x65], contentType: 'application/x-httpd-php', extension: 'php' },
            { signature: [0x3C, 0x25, 0x40, 0x70, 0x61, 0x67, 0x65], contentType: 'application/jsp', extension: 'jsp' },
            { signature: [0x3C, 0x25, 0x40, 0x70, 0x61, 0x67, 0x65], contentType: 'application/asp', extension: 'asp' },
            { signature: [0x3C, 0x25, 0x40, 0x70, 0x61, 0x67, 0x65], contentType: 'application/aspx', extension: 'aspx' },
        ];

        const matchingSignature = fileSignatures.find(signatureInfo =>
            signatureInfo.signature.every((byte, index) => byte === uint8Array[index])
        );

        if (matchingSignature) {
            return {
                contentType: matchingSignature.contentType,
                extension: matchingSignature.extension,
            };
        }

        // Default if no matching signature is found
        return {
            contentType: 'application/octet-stream',
            extension: 'bin',
        };
    }



    // -----------------------------------------------------------------------------------------