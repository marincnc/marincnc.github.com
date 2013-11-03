/*	ALL JS $Revision: 1.20.8.1 $
	Copyright 2007 Adobe Systems Incorporated
*/
/*	REMEDIAL JAVASCRIPT $Revision: 1.4 $
	for more information visit "http://javascript.crockford.com/remedial.html"
	added support for "call" and "apply" methods
	added "isTag" method
*/

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

function isAlien(a) {
   return isObject(a) && typeof a.constructor != 'function';
}
function isArray(a) {
    return isObject(a) && a.constructor == Array;
}
function isBoolean(a) {
    return typeof a == 'boolean';
}
function isEmpty(o) {
    var i, v;
    if (isObject(o)) {
        for (i in o) {
            v = o[i];
            if (isUndefined(v) && isFunction(v)) {
                return false;
            }
        }
    }
    return true;
}
function isFunction(a) {
    return typeof a == 'function';
}
function isNull(a) {
    return typeof a == 'object' && !a;
}
function isNumber(a) {
    return typeof a == 'number' && isFinite(a);
}
function isObject(a) {
    return (a && typeof a == 'object') || isFunction(a);
}
function isString(a) {
    return typeof a == 'string';
}
function isTag(a) {
    return a.nodeType && a.nodeType ==1;
} 
function isUndefined(a) {
    return typeof a == 'undefined';
} 

/* Array Prototyping */
if (!isFunction(Function.apply)) {
	Function.method('apply', function (o, a) {
		var s = [];
		var r, call;
		
		if (!o) { o = window; }
		if (!a) { a = []; }
		
		for (var i = 0; i < a.length; i++) {
			s[i] = "a["+i+"]";
		}
		
		call = "o.__applyTemp__(" + s.join(",") + ");";
		
		o.__applyTemp__ = this;
		r = eval(call);
		o.__applyTemp__ = null;
		return r;
	});
}
if (!isFunction(Array.prototype.pop)) {
    Array.method('pop', function () {
        return this.splice(this.length - 1, 1)[0];
    });
}
if (!isFunction(Array.prototype.push)) {
    Array.method('push', function () {
        this.splice.apply(this,
            [this.length, 0].concat(Array.prototype.slice.apply(arguments)));
        return this.length;
    });
}
if (!isFunction(Array.prototype.shift)) {
    Array.method('shift', function () {
        return this.splice(0, 1)[0];
    });
}
if (!isFunction(Array.prototype.splice)) {
    Array.method('splice', function (s, d) {
        var max = Math.max,
            min = Math.min,
            a = [], // The return value array
            e,  // element
            i = max(arguments.length - 2, 0),   // insert count
            k = 0,
            l = this.length,
            n,  // new length
            v,  // delta
            x;  // shift count

        s = s || 0;
        if (s < 0) {
            s += l;
        }
        s = max(min(s, l), 0);  // start point
        d = max(min(isNumber(d) ? d : l, l - s), 0);    // delete count
        v = i - d;
        n = l + v;
        while (k < d) {
            e = this[s + k];
            if (!isUndefined(e)) {
                a[k] = e;
            }
            k += 1;
        }
        x = l - s - d;
        if (v < 0) {
            k = s + i;
            while (x) {
                this[k] = this[k - v];
                k += 1;
                x -= 1;
            }
            this.length = n;
        } else if (v > 0) {
            k = 1;
            while (x) {
                this[n - k] = this[l - k];
                k += 1;
                x -= 1;
            }
        }
        for (k = 0; k < i; ++k) {
            this[s + k] = arguments[k + 2];
        }
        return a;
    });
}
if (!isFunction(Array.prototype.unshift)) {
    Array.method('unshift', function () {
        this.splice.apply(this,
            [0, 0].concat(Array.prototype.slice.apply(arguments)));
        return this.length;
    });
}
if (!isFunction(Function.call)) {
	Function.method('call', function () {
		var o = arguments[0], s = [];
		
		for (var i=1, len=arguments.length; i<len; i++) {
			s.push("arguments["+i+"]");
		}
		
		o.__method = this;
		r = eval("o.__method("+s.join(",")+")");
		o.__method = null;
		return r;
	});
}
if(!isFunction(Array.copy)) {
	Array.method('copy', function () { return [].concat(this); });
}
if(!isFunction(Array.shuffle)) {
	Array.method('shuffle', function () {
		for(var i = this.length, n, x; 
		i; 
		n = parseInt( Math.random() * i, 0 ), /*create random whole number in array range, parseInt is about twice as fast as Math.floor*/
		x = this[--i], /*save current object and deincrement*/ 
		this[i] = this[n], /*make current object equal to the object at our random index*/ 
		this[n] = x) {} /*make random object equal to current saved object*/
		
		return this.copy(); //return a copy
	});
}
/*  Prototype JavaScript framework, version 1.5.1.1
 *  (c) 2005-2007 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
/*--------------------------------------------------------------------------*/

var Prototype = {
  Version: '1.5.1.1',

  Browser: {
    IE:     !!(window.attachEvent && !window.opera),
    Opera:  !!window.opera,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1
  },

  BrowserFeatures: {
    XPath: !!document.evaluate,
    ElementExtensions: !!window.HTMLElement,
    SpecificElementExtensions:
      (document.createElement('div').__proto__ !==
       document.createElement('form').__proto__)
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction: function() { },
  K: function(x) { return x }
}

var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

var Abstract = new Object();

Object.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}

Object.extend(Object, {
  inspect: function(object) {
    try {
      if (object === undefined) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : object.toString();
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  },

  toJSON: function(object) {
    var type = typeof object;
    switch(type) {
      case 'undefined':
      case 'function':
      case 'unknown': return;
      case 'boolean': return object.toString();
    }
    if (object === null) return 'null';
    if (object.toJSON) return object.toJSON();
    if (object.ownerDocument === document) return;
    var results = [];
    for (var property in object) {
      var value = Object.toJSON(object[property]);
      if (value !== undefined)
        results.push(property.toJSON() + ': ' + value);
    }
    return '{' + results.join(', ') + '}';
  },

  keys: function(object) {
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
  },

  values: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },

  clone: function(object) {
    return Object.extend({}, object);
  }
});

Function.prototype.bind = function() {
  var __method = this, args = $A(arguments), object = args.shift();
  return function() {
    return __method.apply(object, args.concat($A(arguments)));
  }
}

Function.prototype.bindAsEventListener = function(object) {
  var __method = this, args = $A(arguments), object = args.shift();
  return function(event) {
    return __method.apply(object, [event || window.event].concat(args));
  }
}

Object.extend(Number.prototype, {
  toColorPart: function() {
    return this.toPaddedString(2, 16);
  },

  succ: function() {
    return this + 1;
  },

  times: function(iterator) {
    $R(0, this, true).each(iterator);
    return this;
  },

  toPaddedString: function(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  },

  toJSON: function() {
    return isFinite(this) ? this.toString() : 'null';
  }
});

Date.prototype.toJSON = function() {
  return '"' + this.getFullYear() + '-' +
    (this.getMonth() + 1).toPaddedString(2) + '-' +
    this.getDate().toPaddedString(2) + 'T' +
    this.getHours().toPaddedString(2) + ':' +
    this.getMinutes().toPaddedString(2) + ':' +
    this.getSeconds().toPaddedString(2) + '"';
};

var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
  }
}

/*--------------------------------------------------------------------------*/

var PeriodicalExecuter = Class.create();
PeriodicalExecuter.prototype = {
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.callback(this);
      } finally {
        this.currentlyExecuting = false;
      }
    }
  }
}
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, {
  gsub: function(pattern, replacement) {
    var result = '', source = this, match;
    replacement = arguments.callee.prepareReplacement(replacement);

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  },

  sub: function(pattern, replacement, count) {
    replacement = this.gsub.prepareReplacement(replacement);
    count = count === undefined ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  },

  scan: function(pattern, iterator) {
    this.gsub(pattern, iterator);
    return this;
  },

  truncate: function(length, truncation) {
    length = length || 30;
    truncation = truncation === undefined ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : this;
  },

  strip: function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  },

  stripTags: function() {
    return this.replace(/<\/?[^>]+>/gi, '');
  },

  stripScripts: function() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  },

  extractScripts: function() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  },

  evalScripts: function() {
    return this.extractScripts().map(function(script) { return eval(script) });
  },

  escapeHTML: function() {
    var self = arguments.callee;
    self.text.data = this;
    return self.div.innerHTML;
  },

  unescapeHTML: function() {
    var div = document.createElement('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0] ? (div.childNodes.length > 1 ?
      $A(div.childNodes).inject('', function(memo, node) { return memo+node.nodeValue }) :
      div.childNodes[0].nodeValue) : '';
  },

  toQueryParams: function(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return {};

    return match[1].split(separator || '&').inject({}, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (hash[key].constructor != Array) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  },

  toArray: function() {
    return this.split('');
  },

  succ: function() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  },

  times: function(count) {
    var result = '';
    for (var i = 0; i < count; i++) result += this;
    return result;
  },

  camelize: function() {
    var parts = this.split('-'), len = parts.length;
    if (len == 1) return parts[0];

    var camelized = this.charAt(0) == '-'
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
      : parts[0];

    for (var i = 1; i < len; i++)
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

    return camelized;
  },

  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },

  underscore: function() {
    return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();
  },

  dasherize: function() {
    return this.gsub(/_/,'-');
  },

  inspect: function(useDoubleQuotes) {
    var escapedString = this.gsub(/[\x00-\x1f\\]/, function(match) {
      var character = String.specialChar[match[0]];
      return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  },

  toJSON: function() {
    return this.inspect(true);
  },

  unfilterJSON: function(filter) {
    return this.sub(filter || Prototype.JSONFilter, '#{1}');
  },

  isJSON: function() {
    var str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
  },

  evalJSON: function(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  },

  include: function(pattern) {
    return this.indexOf(pattern) > -1;
  },

  startsWith: function(pattern) {
    return this.indexOf(pattern) === 0;
  },

  endsWith: function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
  },

  empty: function() {
    return this == '';
  },

  blank: function() {
    return /^\s*$/.test(this);
  }
});

if (Prototype.Browser.WebKit || Prototype.Browser.IE) Object.extend(String.prototype, {
  escapeHTML: function() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
  unescapeHTML: function() {
    return this.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }
});

String.prototype.gsub.prepareReplacement = function(replacement) {
  if (typeof replacement == 'function') return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
}

String.prototype.parseQuery = String.prototype.toQueryParams;

Object.extend(String.prototype.escapeHTML, {
  div:  document.createElement('div'),
  text: document.createTextNode('')
});

with (String.prototype.escapeHTML) div.appendChild(text);

var Template = Class.create();
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
Template.prototype = {
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern  = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    return this.template.gsub(this.pattern, function(match) {
      var before = match[1];
      if (before == '\\') return match[2];
      return before + String.interpret(object[match[3]]);
    });
  }
}

var $break = {}, $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Enumerable = {
  each: function(iterator) {
    var index = 0;
    try {
      this._each(function(value) {
        iterator(value, index++);
      });
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  },

  eachSlice: function(number, iterator) {
    var index = -number, slices = [], array = this.toArray();
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.map(iterator);
  },

  all: function(iterator) {
    var result = true;
    this.each(function(value, index) {
      result = result && !!(iterator || Prototype.K)(value, index);
      if (!result) throw $break;
    });
    return result;
  },

  any: function(iterator) {
    var result = false;
    this.each(function(value, index) {
      if (result = !!(iterator || Prototype.K)(value, index))
        throw $break;
    });
    return result;
  },

  collect: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      results.push((iterator || Prototype.K)(value, index));
    });
    return results;
  },

  detect: function(iterator) {
    var result;
    this.each(function(value, index) {
      if (iterator(value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  },

  findAll: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      if (iterator(value, index))
        results.push(value);
    });
    return results;
  },

  grep: function(pattern, iterator) {
    var results = [];
    this.each(function(value, index) {
      var stringValue = value.toString();
      if (stringValue.match(pattern))
        results.push((iterator || Prototype.K)(value, index));
    })
    return results;
  },

  include: function(object) {
    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  },

  inGroupsOf: function(number, fillWith) {
    fillWith = fillWith === undefined ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  },

  inject: function(memo, iterator) {
    this.each(function(value, index) {
      memo = iterator(memo, value, index);
    });
    return memo;
  },

  invoke: function(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  },

  max: function(iterator) {
    var result;
    this.each(function(value, index) {
      value = (iterator || Prototype.K)(value, index);
      if (result == undefined || value >= result)
        result = value;
    });
    return result;
  },

  min: function(iterator) {
    var result;
    this.each(function(value, index) {
      value = (iterator || Prototype.K)(value, index);
      if (result == undefined || value < result)
        result = value;
    });
    return result;
  },

  partition: function(iterator) {
    var trues = [], falses = [];
    this.each(function(value, index) {
      ((iterator || Prototype.K)(value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  },

  pluck: function(property) {
    var results = [];
    this.each(function(value, index) {
      results.push(value[property]);
    });
    return results;
  },

  reject: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator(value, index))
        results.push(value);
    });
    return results;
  },

  sortBy: function(iterator) {
    return this.map(function(value, index) {
      return {value: value, criteria: iterator(value, index)};
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  },

  toArray: function() {
    return this.map();
  },

  zip: function() {
    var iterator = Prototype.K, args = $A(arguments);
    if (typeof args.last() == 'function')
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  },

  size: function() {
    return this.toArray().length;
  },

  inspect: function() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }
}

Object.extend(Enumerable, {
  map:     Enumerable.collect,
  find:    Enumerable.detect,
  select:  Enumerable.findAll,
  member:  Enumerable.include,
  entries: Enumerable.toArray
});
var $A = Array.from = function(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  } else {
    var results = [];
    for (var i = 0, length = iterable.length; i < length; i++)
      results.push(iterable[i]);
    return results;
  }
}

if (Prototype.Browser.WebKit) {
  $A = Array.from = function(iterable) {
    if (!iterable) return [];
    if (!(typeof iterable == 'function' && iterable == '[object NodeList]') &&
      iterable.toArray) {
      return iterable.toArray();
    } else {
      var results = [];
      for (var i = 0, length = iterable.length; i < length; i++)
        results.push(iterable[i]);
      return results;
    }
  }
}

Object.extend(Array.prototype, Enumerable);

if (!Array.prototype._reverse)
  Array.prototype._reverse = Array.prototype.reverse;

Object.extend(Array.prototype, {
  _each: function(iterator) {
    for (var i = 0, length = this.length; i < length; i++)
      iterator(this[i]);
  },

  clear: function() {
    this.length = 0;
    return this;
  },

  first: function() {
    return this[0];
  },

  last: function() {
    return this[this.length - 1];
  },

  compact: function() {
    return this.select(function(value) {
      return value != null;
    });
  },

  flatten: function() {
    return this.inject([], function(array, value) {
      return array.concat(value && value.constructor == Array ?
        value.flatten() : [value]);
    });
  },

  without: function() {
    var values = $A(arguments);
    return this.select(function(value) {
      return !values.include(value);
    });
  },

  indexOf: function(object) {
    for (var i = 0, length = this.length; i < length; i++)
      if (this[i] == object) return i;
    return -1;
  },

  reverse: function(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  },

  reduce: function() {
    return this.length > 1 ? this : this[0];
  },

  uniq: function(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  },

  clone: function() {
    return [].concat(this);
  },

  size: function() {
    return this.length;
  },

  inspect: function() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  },

  toJSON: function() {
    var results = [];
    this.each(function(object) {
      var value = Object.toJSON(object);
      if (value !== undefined) results.push(value);
    });
    return '[' + results.join(', ') + ']';
  }
});

Array.prototype.toArray = Array.prototype.clone;

function $w(string) {
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

if (Prototype.Browser.Opera){
  Array.prototype.concat = function() {
    var array = [];
    for (var i = 0, length = this.length; i < length; i++) array.push(this[i]);
    for (var i = 0, length = arguments.length; i < length; i++) {
      if (arguments[i].constructor == Array) {
        for (var j = 0, arrayLength = arguments[i].length; j < arrayLength; j++)
          array.push(arguments[i][j]);
      } else {
        array.push(arguments[i]);
      }
    }
    return array;
  }
}
var Hash = function(object) {
  if (object instanceof Hash) this.merge(object);
  else Object.extend(this, object || {});
};

Object.extend(Hash, {
  toQueryString: function(obj) {
    var parts = [];
    parts.add = arguments.callee.addPair;

    this.prototype._each.call(obj, function(pair) {
      if (!pair.key) return;
      var value = pair.value;

      if (value && typeof value == 'object') {
        if (value.constructor == Array) value.each(function(value) {
          parts.add(pair.key, value);
        });
        return;
      }
      parts.add(pair.key, value);
    });

    return parts.join('&');
  },

  toJSON: function(object) {
    var results = [];
    this.prototype._each.call(object, function(pair) {
      var value = Object.toJSON(pair.value);
      if (value !== undefined) results.push(pair.key.toJSON() + ': ' + value);
    });
    return '{' + results.join(', ') + '}';
  }
});

Hash.toQueryString.addPair = function(key, value, prefix) {
  key = encodeURIComponent(key);
  if (value === undefined) this.push(key);
  else this.push(key + '=' + (value == null ? '' : encodeURIComponent(value)));
}

Object.extend(Hash.prototype, Enumerable);
Object.extend(Hash.prototype, {
  _each: function(iterator) {
    for (var key in this) {
      var value = this[key];
      if (value && value == Hash.prototype[key]) continue;

      var pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  },

  keys: function() {
    return this.pluck('key');
  },

  values: function() {
    return this.pluck('value');
  },

  merge: function(hash) {
    return $H(hash).inject(this, function(mergedHash, pair) {
      mergedHash[pair.key] = pair.value;
      return mergedHash;
    });
  },

  remove: function() {
    var result;
    for(var i = 0, length = arguments.length; i < length; i++) {
      var value = this[arguments[i]];
      if (value !== undefined){
        if (result === undefined) result = value;
        else {
          if (result.constructor != Array) result = [result];
          result.push(value)
        }
      }
      delete this[arguments[i]];
    }
    return result;
  },

  toQueryString: function() {
    return Hash.toQueryString(this);
  },

  inspect: function() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  },

  toJSON: function() {
    return Hash.toJSON(this);
  }
});

function $H(object) {
  if (object instanceof Hash) return object;
  return new Hash(object);
};

// Safari iterates over shadowed properties
if (function() {
  var i = 0, Test = function(value) { this.key = value };
  Test.prototype.key = 'foo';
  for (var property in new Test('bar')) i++;
  return i > 1;
}()) Hash.prototype._each = function(iterator) {
  var cache = [];
  for (var key in this) {
    var value = this[key];
    if ((value && value == Hash.prototype[key]) || cache.include(key)) continue;
    cache.push(key);
    var pair = [key, value];
    pair.key = key;
    pair.value = value;
    iterator(pair);
  }
};
ObjectRange = Class.create();
Object.extend(ObjectRange.prototype, Enumerable);
Object.extend(ObjectRange.prototype, {
  initialize: function(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  },

  _each: function(iterator) {
    var value = this.start;
    while (this.include(value)) {
      iterator(value);
      value = value.succ();
    }
  },

  include: function(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
});

var $R = function(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
}

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (typeof responder[callback] == 'function') {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) {}
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate: function() {
    Ajax.activeRequestCount++;
  },
  onComplete: function() {
    Ajax.activeRequestCount--;
  }
});

Ajax.Base = function() {};
Ajax.Base.prototype = {
  setOptions: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   ''
    }
    Object.extend(this.options, options || {});

    this.options.method = this.options.method.toLowerCase();
    if (typeof this.options.parameters == 'string')
      this.options.parameters = this.options.parameters.toQueryParams();
  }
}

Ajax.Request = Class.create();
Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Request.prototype = Object.extend(new Ajax.Base(), {
  _complete: false,

  initialize: function(url, options) {
    this.transport = Ajax.getTransport();
    this.setOptions(options);
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.clone(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      // simulate other verbs over post
      params['_method'] = this.method;
      this.method = 'post';
    }

    this.parameters = params;

    if (params = Hash.toQueryString(params)) {
      // when GET, append parameters to URL
      if (this.method == 'get')
        this.url += (this.url.include('?') ? '&' : '?') + params;
      else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
        params += '&_=';
    }

    try {
      if (this.options.onCreate) this.options.onCreate(this.transport);
      Ajax.Responders.dispatch('onCreate', this, this.transport);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous)
        setTimeout(function() { this.respondToReadyState(1) }.bind(this), 10);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    // user-defined headers
    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (typeof extras.push == 'function')
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    return !this.transport.status
        || (this.transport.status >= 200 && this.transport.status < 300);
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState];
    var transport = this.transport, json = this.evalJSON();

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + this.transport.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(transport, json);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = this.getHeader('Content-type');
      if (contentType && contentType.strip().
        match(/^(text|application)\/(x-)?(java|ecma)script(;.*)?$/i))
          this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(transport, json);
      Ajax.Responders.dispatch('on' + state, this, transport, json);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      // avoid memory leak in MSIE: clean up
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name);
    } catch (e) { return null }
  },

  evalJSON: function() {
    try {
      var json = this.getHeader('X-JSON');
      return json ? json.evalJSON() : null;
    } catch (e) { return null }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Updater = Class.create();

Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
  initialize: function(container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    }

    this.transport = Ajax.getTransport();
    this.setOptions(options);

    var onComplete = this.options.onComplete || Prototype.emptyFunction;
    this.options.onComplete = (function(transport, param) {
      this.updateContent();
      onComplete(transport, param);
    }).bind(this);

    this.request(url);
  },

  updateContent: function() {
    var receiver = this.container[this.success() ? 'success' : 'failure'];
    var response = this.transport.responseText;

    if (!this.options.evalScripts) response = response.stripScripts();

    if (receiver = $(receiver)) {
      if (this.options.insertion)
        new this.options.insertion(receiver, response);
      else
        receiver.update(response);
    }

    if (this.success()) {
      if (this.onComplete)
        setTimeout(this.onComplete.bind(this), 10);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create();
Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base(), {
  initialize: function(container, url, options) {
    this.setOptions(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = {};
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(request) {
    if (this.options.decay) {
      this.decay = (request.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = request.responseText;
    }
    this.timer = setTimeout(this.onTimerEvent.bind(this),
      this.decay * this.frequency * 1000);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});
function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (typeof element == 'string')
    element = document.getElementById(element);
  return Element.extend(element);
}

if (Prototype.BrowserFeatures.XPath) {
  document._getElementsByXPath = function(expression, parentElement) {
    var results = [];
    var query = document.evaluate(expression, $(parentElement) || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0, length = query.snapshotLength; i < length; i++)
      results.push(query.snapshotItem(i));
    return results;
  };

  document.getElementsByClassName = function(className, parentElement) {
    var q = ".//*[contains(concat(' ', @class, ' '), ' " + className + " ')]";
    return document._getElementsByXPath(q, parentElement);
  }

} else document.getElementsByClassName = function(className, parentElement) {
  var children = ($(parentElement) || document.body).getElementsByTagName('*');
  var elements = [], child, pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
  for (var i = 0, length = children.length; i < length; i++) {
    child = children[i];
    var elementClassName = child.className;
    if (elementClassName.length == 0) continue;
    if (elementClassName == className || elementClassName.match(pattern))
      elements.push(Element.extend(child));
  }
  return elements;
};

/*--------------------------------------------------------------------------*/

if (!window.Element) var Element = {};

Element.extend = function(element) {
  var F = Prototype.BrowserFeatures;
  if (!element || !element.tagName || element.nodeType == 3 ||
   element._extended || F.SpecificElementExtensions || element == window)
    return element;

  var methods = {}, tagName = element.tagName, cache = Element.extend.cache,
   T = Element.Methods.ByTag;

  // extend methods for all tags (Safari doesn't need this)
  if (!F.ElementExtensions) {
    Object.extend(methods, Element.Methods),
    Object.extend(methods, Element.Methods.Simulated);
  }

  // extend methods for specific tags
  if (T[tagName]) Object.extend(methods, T[tagName]);

  for (var property in methods) {
    var value = methods[property];
    if (typeof value == 'function' && !(property in element))
      element[property] = cache.findOrStore(value);
  }

  element._extended = Prototype.emptyFunction;
  return element;
};

Element.extend.cache = {
  findOrStore: function(value) {
    return this[value] = this[value] || function() {
      return value.apply(null, [this].concat($A(arguments)));
    }
  }
};

Element.Methods = {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function(element) {
    element = $(element);
    Element[Element.visible(element) ? 'hide' : 'show'](element);
    return element;
  },

  hide: function(element) {
    $(element).style.display = 'none';
    return element;
  },

  show: function(element) {
    $(element).style.display = '';
    return element;
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  },

  update: function(element, html) {
    html = typeof html == 'undefined' ? '' : html.toString();
    $(element).innerHTML = html.stripScripts();
    setTimeout(function() {html.evalScripts()}, 10);
    return element;
  },

  replace: function(element, html) {
    element = $(element);
    html = typeof html == 'undefined' ? '' : html.toString();
    if (element.outerHTML) {
      element.outerHTML = html.stripScripts();
    } else {
      var range = element.ownerDocument.createRange();
      range.selectNodeContents(element);
      element.parentNode.replaceChild(
        range.createContextualFragment(html.stripScripts()), element);
    }
    setTimeout(function() {html.evalScripts()}, 10);
    return element;
  },

  inspect: function(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    $H({'id': 'id', 'className': 'class'}).each(function(pair) {
      var property = pair.first(), attribute = pair.last();
      var value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    });
    return result + '>';
  },

  recursivelyCollect: function(element, property) {
    element = $(element);
    var elements = [];
    while (element = element[property])
      if (element.nodeType == 1)
        elements.push(Element.extend(element));
    return elements;
  },

  ancestors: function(element) {
    return $(element).recursivelyCollect('parentNode');
  },

  descendants: function(element) {
    return $A($(element).getElementsByTagName('*')).each(Element.extend);
  },

  firstDescendant: function(element) {
    element = $(element).firstChild;
    while (element && element.nodeType != 1) element = element.nextSibling;
    return $(element);
  },

  immediateDescendants: function(element) {
    if (!(element = $(element).firstChild)) return [];
    while (element && element.nodeType != 1) element = element.nextSibling;
    if (element) return [element].concat($(element).nextSiblings());
    return [];
  },

  previousSiblings: function(element) {
    return $(element).recursivelyCollect('previousSibling');
  },

  nextSiblings: function(element) {
    return $(element).recursivelyCollect('nextSibling');
  },

  siblings: function(element) {
    element = $(element);
    return element.previousSiblings().reverse().concat(element.nextSiblings());
  },

  match: function(element, selector) {
    if (typeof selector == 'string')
      selector = new Selector(selector);
    return selector.match($(element));
  },

  up: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(element.parentNode);
    var ancestors = element.ancestors();
    return expression ? Selector.findElement(ancestors, expression, index) :
      ancestors[index || 0];
  },

  down: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return element.firstDescendant();
    var descendants = element.descendants();
    return expression ? Selector.findElement(descendants, expression, index) :
      descendants[index || 0];
  },

  previous: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(element));
    var previousSiblings = element.previousSiblings();
    return expression ? Selector.findElement(previousSiblings, expression, index) :
      previousSiblings[index || 0];
  },

  next: function(element, expression, index) {
    element = $(element);
    if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(element));
    var nextSiblings = element.nextSiblings();
    return expression ? Selector.findElement(nextSiblings, expression, index) :
      nextSiblings[index || 0];
  },

  getElementsBySelector: function() {
    var args = $A(arguments), element = $(args.shift());
    return Selector.findChildElements(element, args);
  },

  getElementsByClassName: function(element, className) {
    return document.getElementsByClassName(className, element);
  },

  readAttribute: function(element, name) {
    element = $(element);
    if (Prototype.Browser.IE) {
      if (!element.attributes) return null;
      var t = Element._attributeTranslations;
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name])  name = t.names[name];
      var attribute = element.attributes[name];
      return attribute ? attribute.nodeValue : null;
    }
    return element.getAttribute(name);
  },

  getHeight: function(element) {
    return $(element).getDimensions().height;
  },

  getWidth: function(element) {
    return $(element).getDimensions().width;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    var elementClassName = element.className;
    if (elementClassName.length == 0) return false;
    if (elementClassName == className ||
        elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
      return true;
    return false;
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element).add(className);
    return element;
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element).remove(className);
    return element;
  },

  toggleClassName: function(element, className) {
    if (!(element = $(element))) return;
    Element.classNames(element)[element.hasClassName(className) ? 'remove' : 'add'](className);
    return element;
  },

  observe: function() {
    Event.observe.apply(Event, arguments);
    return $A(arguments).first();
  },

  stopObserving: function() {
    Event.stopObserving.apply(Event, arguments);
    return $A(arguments).first();
  },

  // removes whitespace-only text node children
  cleanWhitespace: function(element) {
    element = $(element);
    var node = element.firstChild;
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  },

  empty: function(element) {
    return $(element).innerHTML.blank();
  },

  descendantOf: function(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    while (element = element.parentNode)
      if (element == ancestor) return true;
    return false;
  },

  scrollTo: function(element) {
    element = $(element);
    var pos = Position.cumulativeOffset(element);
    window.scrollTo(pos[0], pos[1]);
    return element;
  },

  getStyle: function(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
    var value = element.style[style];
    if (!value) {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
  },

  getOpacity: function(element) {
    return $(element).getStyle('opacity');
  },

  setStyle: function(element, styles, camelized) {
    element = $(element);
    var elementStyle = element.style;

    for (var property in styles)
      if (property == 'opacity') element.setOpacity(styles[property])
      else
        elementStyle[(property == 'float' || property == 'cssFloat') ?
          (elementStyle.styleFloat === undefined ? 'cssFloat' : 'styleFloat') :
          (camelized ? property : property.camelize())] = styles[property];

    return element;
  },

  setOpacity: function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1 || value === '') ? '' :
      (value < 0.00001) ? 0 : value;
    return element;
  },

  getDimensions: function(element) {
    element = $(element);
    var display = $(element).getStyle('display');
    if (display != 'none' && display != null) // Safari bug
      return {width: element.offsetWidth, height: element.offsetHeight};

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      // Opera returns the offset relative to the positioning context, when an
      // element is position relative but top and left have not been defined
      if (window.opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
    return element;
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
    return element;
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return element;
    element._overflow = element.style.overflow || 'auto';
    if ((Element.getStyle(element, 'overflow') || 'visible') != 'hidden')
      element.style.overflow = 'hidden';
    return element;
  },

  undoClipping: function(element) {
    element = $(element);
    if (!element._overflow) return element;
    element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
    element._overflow = null;
    return element;
  }
};

Object.extend(Element.Methods, {
  childOf: Element.Methods.descendantOf,
  childElements: Element.Methods.immediateDescendants
});

if (Prototype.Browser.Opera) {
  Element.Methods._getStyle = Element.Methods.getStyle;
  Element.Methods.getStyle = function(element, style) {
    switch(style) {
      case 'left':
      case 'top':
      case 'right':
      case 'bottom':
        if (Element._getStyle(element, 'position') == 'static') return null;
      default: return Element._getStyle(element, style);
    }
  };
}
else if (Prototype.Browser.IE) {
  Element.Methods.getStyle = function(element, style) {
    element = $(element);
    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
    var value = element.style[style];
    if (!value && element.currentStyle) value = element.currentStyle[style];

    if (style == 'opacity') {
      if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
        if (value[1]) return parseFloat(value[1]) / 100;
      return 1.0;
    }

    if (value == 'auto') {
      if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
        return element['offset'+style.capitalize()] + 'px';
      return null;
    }
    return value;
  };

  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    var filter = element.getStyle('filter'), style = element.style;
    if (value == 1 || value === '') {
      style.filter = filter.replace(/alpha\([^\)]*\)/gi,'');
      return element;
    } else if (value < 0.00001) value = 0;
    style.filter = filter.replace(/alpha\([^\)]*\)/gi, '') +
      'alpha(opacity=' + (value * 100) + ')';
    return element;
  };

  // IE is missing .innerHTML support for TABLE-related elements
  Element.Methods.update = function(element, html) {
    element = $(element);
    html = typeof html == 'undefined' ? '' : html.toString();
    var tagName = element.tagName.toUpperCase();
    if (['THEAD','TBODY','TR','TD'].include(tagName)) {
      var div = document.createElement('div');
      switch (tagName) {
        case 'THEAD':
        case 'TBODY':
          div.innerHTML = '<table><tbody>' +  html.stripScripts() + '</tbody></table>';
          depth = 2;
          break;
        case 'TR':
          div.innerHTML = '<table><tbody><tr>' +  html.stripScripts() + '</tr></tbody></table>';
          depth = 3;
          break;
        case 'TD':
          div.innerHTML = '<table><tbody><tr><td>' +  html.stripScripts() + '</td></tr></tbody></table>';
          depth = 4;
      }
      $A(element.childNodes).each(function(node) { element.removeChild(node) });
      depth.times(function() { div = div.firstChild });
      $A(div.childNodes).each(function(node) { element.appendChild(node) });
    } else {
      element.innerHTML = html.stripScripts();
    }
    setTimeout(function() { html.evalScripts() }, 10);
    return element;
  }
}
else if (Prototype.Browser.Gecko) {
  Element.Methods.setOpacity = function(element, value) {
    element = $(element);
    element.style.opacity = (value == 1) ? 0.999999 :
      (value === '') ? '' : (value < 0.00001) ? 0 : value;
    return element;
  };
}

Element._attributeTranslations = {
  names: {
    colspan:   "colSpan",
    rowspan:   "rowSpan",
    valign:    "vAlign",
    datetime:  "dateTime",
    accesskey: "accessKey",
    tabindex:  "tabIndex",
    enctype:   "encType",
    maxlength: "maxLength",
    readonly:  "readOnly",
    longdesc:  "longDesc"
  },
  values: {
    _getAttr: function(element, attribute) {
      return element.getAttribute(attribute, 2);
    },
    _flag: function(element, attribute) {
      return $(element).hasAttribute(attribute) ? attribute : null;
    },
    style: function(element) {
      return element.style.cssText.toLowerCase();
    },
    title: function(element) {
      var node = element.getAttributeNode('title');
      return node.specified ? node.nodeValue : null;
    }
  }
};

(function() {
  Object.extend(this, {
    href: this._getAttr,
    src:  this._getAttr,
    type: this._getAttr,
    disabled: this._flag,
    checked:  this._flag,
    readonly: this._flag,
    multiple: this._flag
  });
}).call(Element._attributeTranslations.values);

Element.Methods.Simulated = {
  hasAttribute: function(element, attribute) {
    var t = Element._attributeTranslations, node;
    attribute = t.names[attribute] || attribute;
    node = $(element).getAttributeNode(attribute);
    return node && node.specified;
  }
};

Element.Methods.ByTag = {};

Object.extend(Element, Element.Methods);

if (!Prototype.BrowserFeatures.ElementExtensions &&
 document.createElement('div').__proto__) {
  window.HTMLElement = {};
  window.HTMLElement.prototype = document.createElement('div').__proto__;
  Prototype.BrowserFeatures.ElementExtensions = true;
}

Element.hasAttribute = function(element, attribute) {
  if (element.hasAttribute) return element.hasAttribute(attribute);
  return Element.Methods.Simulated.hasAttribute(element, attribute);
};

Element.addMethods = function(methods) {
  var F = Prototype.BrowserFeatures, T = Element.Methods.ByTag;

  if (!methods) {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods)
    });
  }

  if (arguments.length == 2) {
    var tagName = methods;
    methods = arguments[1];
  }

  if (!tagName) Object.extend(Element.Methods, methods || {});
  else {
    if (tagName.constructor == Array) tagName.each(extend);
    else extend(tagName);
  }

  function extend(tagName) {
    tagName = tagName.toUpperCase();
    if (!Element.Methods.ByTag[tagName])
      Element.Methods.ByTag[tagName] = {};
    Object.extend(Element.Methods.ByTag[tagName], methods);
  }

  function copy(methods, destination, onlyIfAbsent) {
    onlyIfAbsent = onlyIfAbsent || false;
    var cache = Element.extend.cache;
    for (var property in methods) {
      var value = methods[property];
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = cache.findOrStore(value);
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    window[klass] = {};
    window[klass].prototype = document.createElement(tagName).__proto__;
    return window[klass];
  }

  if (F.ElementExtensions) {
    copy(Element.Methods, HTMLElement.prototype);
    copy(Element.Methods.Simulated, HTMLElement.prototype, true);
  }

  if (F.SpecificElementExtensions) {
    for (var tag in Element.Methods.ByTag) {
      var klass = findDOMClass(tag);
      if (typeof klass == "undefined") continue;
      copy(T[tag], klass.prototype);
    }
  }

  Object.extend(Element, Element.Methods);
  delete Element.ByTag;
};

var Toggle = { display: Element.toggle };

/*--------------------------------------------------------------------------*/

Abstract.Insertion = function(adjacency) {
  this.adjacency = adjacency;
}

Abstract.Insertion.prototype = {
  initialize: function(element, content) {
    this.element = $(element);
    this.content = content.stripScripts();

    if (this.adjacency && this.element.insertAdjacentHTML) {
      try {
        this.element.insertAdjacentHTML(this.adjacency, this.content);
      } catch (e) {
        var tagName = this.element.tagName.toUpperCase();
        if (['TBODY', 'TR'].include(tagName)) {
          this.insertContent(this.contentFromAnonymousTable());
        } else {
          throw e;
        }
      }
    } else {
      this.range = this.element.ownerDocument.createRange();
      if (this.initializeRange) this.initializeRange();
      this.insertContent([this.range.createContextualFragment(this.content)]);
    }

    setTimeout(function() {content.evalScripts()}, 10);
  },

  contentFromAnonymousTable: function() {
    var div = document.createElement('div');
    div.innerHTML = '<table><tbody>' + this.content + '</tbody></table>';
    return $A(div.childNodes[0].childNodes[0].childNodes);
  }
}

var Insertion = new Object();

Insertion.Before = Class.create();
Insertion.Before.prototype = Object.extend(new Abstract.Insertion('beforeBegin'), {
  initializeRange: function() {
    this.range.setStartBefore(this.element);
  },

  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.parentNode.insertBefore(fragment, this.element);
    }).bind(this));
  }
});

Insertion.Top = Class.create();
Insertion.Top.prototype = Object.extend(new Abstract.Insertion('afterBegin'), {
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(true);
  },

  insertContent: function(fragments) {
    fragments.reverse(false).each((function(fragment) {
      this.element.insertBefore(fragment, this.element.firstChild);
    }).bind(this));
  }
});

Insertion.Bottom = Class.create();
Insertion.Bottom.prototype = Object.extend(new Abstract.Insertion('beforeEnd'), {
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(this.element);
  },

  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.appendChild(fragment);
    }).bind(this));
  }
});

Insertion.After = Class.create();
Insertion.After.prototype = Object.extend(new Abstract.Insertion('afterEnd'), {
  initializeRange: function() {
    this.range.setStartAfter(this.element);
  },

  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.parentNode.insertBefore(fragment,
        this.element.nextSibling);
    }).bind(this));
  }
});

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);
/* Portions of the Selector class are derived from Jack Slocum’s DomQuery,
 * part of YUI-Ext version 0.40, distributed under the terms of an MIT-style
 * license.  Please see http://www.yui-ext.com/ for more information. */

var Selector = Class.create();

Selector.prototype = {
  initialize: function(expression) {
    this.expression = expression.strip();
    this.compileMatcher();
  },

  compileMatcher: function() {
    // Selectors with namespaced attributes can't use the XPath version
    if (Prototype.BrowserFeatures.XPath && !(/\[[\w-]*?:/).test(this.expression))
      return this.compileXPathMatcher();

    var e = this.expression, ps = Selector.patterns, h = Selector.handlers,
        c = Selector.criteria, le, p, m;

    if (Selector._cache[e]) {
      this.matcher = Selector._cache[e]; return;
    }
    this.matcher = ["this.matcher = function(root) {",
                    "var r = root, h = Selector.handlers, c = false, n;"];

    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        p = ps[i];
        if (m = e.match(p)) {
          this.matcher.push(typeof c[i] == 'function' ? c[i](m) :
    	      new Template(c[i]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.matcher.push("return h.unique(n);\n}");
    eval(this.matcher.join('\n'));
    Selector._cache[this.expression] = this.matcher;
  },

  compileXPathMatcher: function() {
    var e = this.expression, ps = Selector.patterns,
        x = Selector.xpath, le,  m;

    if (Selector._cache[e]) {
      this.xpath = Selector._cache[e]; return;
    }

    this.matcher = ['.//*'];
    while (e && le != e && (/\S/).test(e)) {
      le = e;
      for (var i in ps) {
        if (m = e.match(ps[i])) {
          this.matcher.push(typeof x[i] == 'function' ? x[i](m) :
            new Template(x[i]).evaluate(m));
          e = e.replace(m[0], '');
          break;
        }
      }
    }

    this.xpath = this.matcher.join('');
    Selector._cache[this.expression] = this.xpath;
  },

  findElements: function(root) {
    root = root || document;
    if (this.xpath) return document._getElementsByXPath(this.xpath, root);
    return this.matcher(root);
  },

  match: function(element) {
    return this.findElements(document).include(element);
  },

  toString: function() {
    return this.expression;
  },

  inspect: function() {
    return "#<Selector:" + this.expression.inspect() + ">";
  }
};

Object.extend(Selector, {
  _cache: {},

  xpath: {
    descendant:   "//*",
    child:        "/*",
    adjacent:     "/following-sibling::*[1]",
    laterSibling: '/following-sibling::*',
    tagName:      function(m) {
      if (m[1] == '*') return '';
      return "[local-name()='" + m[1].toLowerCase() +
             "' or local-name()='" + m[1].toUpperCase() + "']";
    },
    className:    "[contains(concat(' ', @class, ' '), ' #{1} ')]",
    id:           "[@id='#{1}']",
    attrPresence: "[@#{1}]",
    attr: function(m) {
      m[3] = m[5] || m[6];
      return new Template(Selector.xpath.operators[m[2]]).evaluate(m);
    },
    pseudo: function(m) {
      var h = Selector.xpath.pseudos[m[1]];
      if (!h) return '';
      if (typeof h === 'function') return h(m);
      return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);
    },
    operators: {
      '=':  "[@#{1}='#{3}']",
      '!=': "[@#{1}!='#{3}']",
      '^=': "[starts-with(@#{1}, '#{3}')]",
      '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
      '*=': "[contains(@#{1}, '#{3}')]",
      '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
      '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
    },
    pseudos: {
      'first-child': '[not(preceding-sibling::*)]',
      'last-child':  '[not(following-sibling::*)]',
      'only-child':  '[not(preceding-sibling::* or following-sibling::*)]',
      'empty':       "[count(*) = 0 and (count(text()) = 0 or translate(text(), ' \t\r\n', '') = '')]",
      'checked':     "[@checked]",
      'disabled':    "[@disabled]",
      'enabled':     "[not(@disabled)]",
      'not': function(m) {
        var e = m[6], p = Selector.patterns,
            x = Selector.xpath, le, m, v;

        var exclusion = [];
        while (e && le != e && (/\S/).test(e)) {
          le = e;
          for (var i in p) {
            if (m = e.match(p[i])) {
              v = typeof x[i] == 'function' ? x[i](m) : new Template(x[i]).evaluate(m);
              exclusion.push("(" + v.substring(1, v.length - 1) + ")");
              e = e.replace(m[0], '');
              break;
            }
          }
        }
        return "[not(" + exclusion.join(" and ") + ")]";
      },
      'nth-child':      function(m) {
        return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", m);
      },
      'nth-last-child': function(m) {
        return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", m);
      },
      'nth-of-type':    function(m) {
        return Selector.xpath.pseudos.nth("position() ", m);
      },
      'nth-last-of-type': function(m) {
        return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", m);
      },
      'first-of-type':  function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-of-type'](m);
      },
      'last-of-type':   function(m) {
        m[6] = "1"; return Selector.xpath.pseudos['nth-last-of-type'](m);
      },
      'only-of-type':   function(m) {
        var p = Selector.xpath.pseudos; return p['first-of-type'](m) + p['last-of-type'](m);
      },
      nth: function(fragment, m) {
        var mm, formula = m[6], predicate;
        if (formula == 'even') formula = '2n+0';
        if (formula == 'odd')  formula = '2n+1';
        if (mm = formula.match(/^(\d+)$/)) // digit only
          return '[' + fragment + "= " + mm[1] + ']';
        if (mm = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
          if (mm[1] == "-") mm[1] = -1;
          var a = mm[1] ? Number(mm[1]) : 1;
          var b = mm[2] ? Number(mm[2]) : 0;
          predicate = "[((#{fragment} - #{b}) mod #{a} = 0) and " +
          "((#{fragment} - #{b}) div #{a} >= 0)]";
          return new Template(predicate).evaluate({
            fragment: fragment, a: a, b: b });
        }
      }
    }
  },

  criteria: {
    tagName:      'n = h.tagName(n, r, "#{1}", c);   c = false;',
    className:    'n = h.className(n, r, "#{1}", c); c = false;',
    id:           'n = h.id(n, r, "#{1}", c);        c = false;',
    attrPresence: 'n = h.attrPresence(n, r, "#{1}"); c = false;',
    attr: function(m) {
      m[3] = (m[5] || m[6]);
      return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}"); c = false;').evaluate(m);
    },
    pseudo:       function(m) {
      if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
      return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);
    },
    descendant:   'c = "descendant";',
    child:        'c = "child";',
    adjacent:     'c = "adjacent";',
    laterSibling: 'c = "laterSibling";'
  },

  patterns: {
    // combinators must be listed first
    // (and descendant needs to be last combinator)
    laterSibling: /^\s*~\s*/,
    child:        /^\s*>\s*/,
    adjacent:     /^\s*\+\s*/,
    descendant:   /^\s/,

    // selectors follow
    tagName:      /^\s*(\*|[\w\-]+)(\b|$)?/,
    id:           /^#([\w\-\*]+)(\b|$)/,
    className:    /^\.([\w\-\*]+)(\b|$)/,
    pseudo:       /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|\s|(?=:))/,
    attrPresence: /^\[([\w]+)\]/,
    attr:         /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\]]*?)\4|([^'"][^\]]*?)))?\]/
  },

  handlers: {
    // UTILITY FUNCTIONS
    // joins two collections
    concat: function(a, b) {
      for (var i = 0, node; node = b[i]; i++)
        a.push(node);
      return a;
    },

    // marks an array of nodes for counting
    mark: function(nodes) {
      for (var i = 0, node; node = nodes[i]; i++)
        node._counted = true;
      return nodes;
    },

    unmark: function(nodes) {
      for (var i = 0, node; node = nodes[i]; i++)
        node._counted = undefined;
      return nodes;
    },

    // mark each child node with its position (for nth calls)
    // "ofType" flag indicates whether we're indexing for nth-of-type
    // rather than nth-child
    index: function(parentNode, reverse, ofType) {
      parentNode._counted = true;
      if (reverse) {
        for (var nodes = parentNode.childNodes, i = nodes.length - 1, j = 1; i >= 0; i--) {
          node = nodes[i];
          if (node.nodeType == 1 && (!ofType || node._counted)) node.nodeIndex = j++;
        }
      } else {
        for (var i = 0, j = 1, nodes = parentNode.childNodes; node = nodes[i]; i++)
          if (node.nodeType == 1 && (!ofType || node._counted)) node.nodeIndex = j++;
      }
    },

    // filters out duplicates and extends all nodes
    unique: function(nodes) {
      if (nodes.length == 0) return nodes;
      var results = [], n;
      for (var i = 0, l = nodes.length; i < l; i++)
        if (!(n = nodes[i])._counted) {
          n._counted = true;
          results.push(Element.extend(n));
        }
      return Selector.handlers.unmark(results);
    },

    // COMBINATOR FUNCTIONS
    descendant: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, node.getElementsByTagName('*'));
      return results;
    },

    child: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        for (var j = 0, children = [], child; child = node.childNodes[j]; j++)
          if (child.nodeType == 1 && child.tagName != '!') results.push(child);
      }
      return results;
    },

    adjacent: function(nodes) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        var next = this.nextElementSibling(node);
        if (next) results.push(next);
      }
      return results;
    },

    laterSibling: function(nodes) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        h.concat(results, Element.nextSiblings(node));
      return results;
    },

    nextElementSibling: function(node) {
      while (node = node.nextSibling)
	      if (node.nodeType == 1) return node;
      return null;
    },

    previousElementSibling: function(node) {
      while (node = node.previousSibling)
        if (node.nodeType == 1) return node;
      return null;
    },

    // TOKEN FUNCTIONS
    tagName: function(nodes, root, tagName, combinator) {
      tagName = tagName.toUpperCase();
      var results = [], h = Selector.handlers;
      if (nodes) {
        if (combinator) {
          // fastlane for ordinary descendant combinators
          if (combinator == "descendant") {
            for (var i = 0, node; node = nodes[i]; i++)
              h.concat(results, node.getElementsByTagName(tagName));
            return results;
          } else nodes = this[combinator](nodes);
          if (tagName == "*") return nodes;
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.tagName.toUpperCase() == tagName) results.push(node);
        return results;
      } else return root.getElementsByTagName(tagName);
    },

    id: function(nodes, root, id, combinator) {
      var targetNode = $(id), h = Selector.handlers;
      if (!nodes && root == document) return targetNode ? [targetNode] : [];
      if (nodes) {
        if (combinator) {
          if (combinator == 'child') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (targetNode.parentNode == node) return [targetNode];
          } else if (combinator == 'descendant') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Element.descendantOf(targetNode, node)) return [targetNode];
          } else if (combinator == 'adjacent') {
            for (var i = 0, node; node = nodes[i]; i++)
              if (Selector.handlers.previousElementSibling(targetNode) == node)
                return [targetNode];
          } else nodes = h[combinator](nodes);
        }
        for (var i = 0, node; node = nodes[i]; i++)
          if (node == targetNode) return [targetNode];
        return [];
      }
      return (targetNode && Element.descendantOf(targetNode, root)) ? [targetNode] : [];
    },

    className: function(nodes, root, className, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      return Selector.handlers.byClassName(nodes, root, className);
    },

    byClassName: function(nodes, root, className) {
      if (!nodes) nodes = Selector.handlers.descendant([root]);
      var needle = ' ' + className + ' ';
      for (var i = 0, results = [], node, nodeClassName; node = nodes[i]; i++) {
        nodeClassName = node.className;
        if (nodeClassName.length == 0) continue;
        if (nodeClassName == className || (' ' + nodeClassName + ' ').include(needle))
          results.push(node);
      }
      return results;
    },

    attrPresence: function(nodes, root, attr) {
      var results = [];
      for (var i = 0, node; node = nodes[i]; i++)
        if (Element.hasAttribute(node, attr)) results.push(node);
      return results;
    },

    attr: function(nodes, root, attr, value, operator) {
      if (!nodes) nodes = root.getElementsByTagName("*");
      var handler = Selector.operators[operator], results = [];
      for (var i = 0, node; node = nodes[i]; i++) {
        var nodeValue = Element.readAttribute(node, attr);
        if (nodeValue === null) continue;
        if (handler(nodeValue, value)) results.push(node);
      }
      return results;
    },

    pseudo: function(nodes, name, value, root, combinator) {
      if (nodes && combinator) nodes = this[combinator](nodes);
      if (!nodes) nodes = root.getElementsByTagName("*");
      return Selector.pseudos[name](nodes, value, root);
    }
  },

  pseudos: {
    'first-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.previousElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'last-child': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        if (Selector.handlers.nextElementSibling(node)) continue;
          results.push(node);
      }
      return results;
    },
    'only-child': function(nodes, value, root) {
      var h = Selector.handlers;
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!h.previousElementSibling(node) && !h.nextElementSibling(node))
          results.push(node);
      return results;
    },
    'nth-child':        function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root);
    },
    'nth-last-child':   function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true);
    },
    'nth-of-type':      function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, false, true);
    },
    'nth-last-of-type': function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, formula, root, true, true);
    },
    'first-of-type':    function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, false, true);
    },
    'last-of-type':     function(nodes, formula, root) {
      return Selector.pseudos.nth(nodes, "1", root, true, true);
    },
    'only-of-type':     function(nodes, formula, root) {
      var p = Selector.pseudos;
      return p['last-of-type'](p['first-of-type'](nodes, formula, root), formula, root);
    },

    // handles the an+b logic
    getIndices: function(a, b, total) {
      if (a == 0) return b > 0 ? [b] : [];
      return $R(1, total).inject([], function(memo, i) {
        if (0 == (i - b) % a && (i - b) / a >= 0) memo.push(i);
        return memo;
      });
    },

    // handles nth(-last)-child, nth(-last)-of-type, and (first|last)-of-type
    nth: function(nodes, formula, root, reverse, ofType) {
      if (nodes.length == 0) return [];
      if (formula == 'even') formula = '2n+0';
      if (formula == 'odd')  formula = '2n+1';
      var h = Selector.handlers, results = [], indexed = [], m;
      h.mark(nodes);
      for (var i = 0, node; node = nodes[i]; i++) {
        if (!node.parentNode._counted) {
          h.index(node.parentNode, reverse, ofType);
          indexed.push(node.parentNode);
        }
      }
      if (formula.match(/^\d+$/)) { // just a number
        formula = Number(formula);
        for (var i = 0, node; node = nodes[i]; i++)
          if (node.nodeIndex == formula) results.push(node);
      } else if (m = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) { // an+b
        if (m[1] == "-") m[1] = -1;
        var a = m[1] ? Number(m[1]) : 1;
        var b = m[2] ? Number(m[2]) : 0;
        var indices = Selector.pseudos.getIndices(a, b, nodes.length);
        for (var i = 0, node, l = indices.length; node = nodes[i]; i++) {
          for (var j = 0; j < l; j++)
            if (node.nodeIndex == indices[j]) results.push(node);
        }
      }
      h.unmark(nodes);
      h.unmark(indexed);
      return results;
    },

    'empty': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++) {
        // IE treats comments as element nodes
        if (node.tagName == '!' || (node.firstChild && !node.innerHTML.match(/^\s*$/))) continue;
        results.push(node);
      }
      return results;
    },

    'not': function(nodes, selector, root) {
      var h = Selector.handlers, selectorType, m;
      var exclusions = new Selector(selector).findElements(root);
      h.mark(exclusions);
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node._counted) results.push(node);
      h.unmark(exclusions);
      return results;
    },

    'enabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (!node.disabled) results.push(node);
      return results;
    },

    'disabled': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.disabled) results.push(node);
      return results;
    },

    'checked': function(nodes, value, root) {
      for (var i = 0, results = [], node; node = nodes[i]; i++)
        if (node.checked) results.push(node);
      return results;
    }
  },

  operators: {
    '=':  function(nv, v) { return nv == v; },
    '!=': function(nv, v) { return nv != v; },
    '^=': function(nv, v) { return nv.startsWith(v); },
    '$=': function(nv, v) { return nv.endsWith(v); },
    '*=': function(nv, v) { return nv.include(v); },
    '~=': function(nv, v) { return (' ' + nv + ' ').include(' ' + v + ' '); },
    '|=': function(nv, v) { return ('-' + nv.toUpperCase() + '-').include('-' + v.toUpperCase() + '-'); }
  },

  matchElements: function(elements, expression) {
    var matches = new Selector(expression).findElements(), h = Selector.handlers;
    h.mark(matches);
    for (var i = 0, results = [], element; element = elements[i]; i++)
      if (element._counted) results.push(element);
    h.unmark(matches);
    return results;
  },

  findElement: function(elements, expression, index) {
    if (typeof expression == 'number') {
      index = expression; expression = false;
    }
    return Selector.matchElements(elements, expression || '*')[index || 0];
  },

  findChildElements: function(element, expressions) {
    var exprs = expressions.join(','), expressions = [];
    exprs.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function(m) {
      expressions.push(m[1].strip());
    });
    var results = [], h = Selector.handlers;
    for (var i = 0, l = expressions.length, selector; i < l; i++) {
      selector = new Selector(expressions[i].strip());
      h.concat(results, selector.findElements(element));
    }
    return (l > 1) ? h.unique(results) : results;
  }
});

function $$() {
  return Selector.findChildElements(document, $A(arguments));
}
var Form = {
  reset: function(form) {
    $(form).reset();
    return form;
  },

  serializeElements: function(elements, getHash) {
    var data = elements.inject({}, function(result, element) {
      if (!element.disabled && element.name) {
        var key = element.name, value = $(element).getValue();
        if (value != null) {
         	if (key in result) {
            if (result[key].constructor != Array) result[key] = [result[key]];
            result[key].push(value);
          }
          else result[key] = value;
        }
      }
      return result;
    });

    return getHash ? data : Hash.toQueryString(data);
  }
};

Form.Methods = {
  serialize: function(form, getHash) {
    return Form.serializeElements(Form.getElements(form), getHash);
  },

  getElements: function(form) {
    return $A($(form).getElementsByTagName('*')).inject([],
      function(elements, child) {
        if (Form.Element.Serializers[child.tagName.toLowerCase()])
          elements.push(Element.extend(child));
        return elements;
      }
    );
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    return $(form).getElements().find(function(element) {
      return element.type != 'hidden' && !element.disabled &&
        ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    form.findFirstElement().activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || {});

    var params = options.parameters;
    options.parameters = form.serialize(true);

    if (params) {
      if (typeof params == 'string') params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;

    return new Ajax.Request(form.readAttribute('action'), options);
  }
}

/*--------------------------------------------------------------------------*/

Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
}

Form.Element.Methods = {
  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = {};
        pair[element.name] = value;
        return Hash.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
        !['button', 'reset', 'submit'].include(element.type)))
        element.select();
    } catch (e) {}
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.blur();
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
}

/*--------------------------------------------------------------------------*/

var Field = Form.Element;
var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = {
  input: function(element) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element);
      default:
        return Form.Element.Serializers.textarea(element);
    }
  },

  inputSelector: function(element) {
    return element.checked ? element.value : null;
  },

  textarea: function(element) {
    return element.value;
  },

  select: function(element) {
    return this[element.type == 'select-one' ?
      'selectOne' : 'selectMany'](element);
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(this.optionValue(opt));
    }
    return values;
  },

  optionValue: function(opt) {
    // extend element because hasAttribute may not be native
    return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
  }
}

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = function() {}
Abstract.TimedObserver.prototype = {
  initialize: function(element, frequency, callback) {
    this.frequency = frequency;
    this.element   = $(element);
    this.callback  = callback;

    this.lastValue = this.getValue();
    this.registerCallback();
  },

  registerCallback: function() {
    setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  onTimerEvent: function() {
    var value = this.getValue();
    var changed = ('string' == typeof this.lastValue && 'string' == typeof value
      ? this.lastValue != value : String(this.lastValue) != String(value));
    if (changed) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
}

Form.Element.Observer = Class.create();
Form.Element.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create();
Form.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = function() {}
Abstract.EventObserver.prototype = {
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback.bind(this));
  },

  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
}

Form.Element.EventObserver = Class.create();
Form.Element.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create();
Form.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
if (!window.Event) {
  var Event = new Object();
}

Object.extend(Event, {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,
  KEY_HOME:     36,
  KEY_END:      35,
  KEY_PAGEUP:   33,
  KEY_PAGEDOWN: 34,

  element: function(event) {
    return $(event.target || event.srcElement);
  },

  isLeftClick: function(event) {
    return (((event.which) && (event.which == 1)) ||
            ((event.button) && (event.button == 1)));
  },

  pointerX: function(event) {
    return event.pageX || (event.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft));
  },

  pointerY: function(event) {
    return event.pageY || (event.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop));
  },

  stop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  },

  // find the first node with the given tagName, starting from the
  // node the event was triggered on; traverses the DOM upwards
  findElement: function(event, tagName) {
    var element = Event.element(event);
    while (element.parentNode && (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
    return element;
  },

  observers: false,

  _observeAndCache: function(element, name, observer, useCapture) {
    if (!this.observers) this.observers = [];
    if (element.addEventListener) {
      this.observers.push([element, name, observer, useCapture]);
      element.addEventListener(name, observer, useCapture);
    } else if (element.attachEvent) {
      this.observers.push([element, name, observer, useCapture]);
      element.attachEvent('on' + name, observer);
    }
  },

  unloadCache: function() {
    if (!Event.observers) return;
    for (var i = 0, length = Event.observers.length; i < length; i++) {
      Event.stopObserving.apply(this, Event.observers[i]);
      Event.observers[i][0] = null;
    }
    Event.observers = false;
  },

  observe: function(element, name, observer, useCapture) {
    element = $(element);
    useCapture = useCapture || false;

    if (name == 'keypress' &&
      (Prototype.Browser.WebKit || element.attachEvent))
      name = 'keydown';

    Event._observeAndCache(element, name, observer, useCapture);
  },

  stopObserving: function(element, name, observer, useCapture) {
    element = $(element);
    useCapture = useCapture || false;

    if (name == 'keypress' &&
        (Prototype.Browser.WebKit || element.attachEvent))
      name = 'keydown';

    if (element.removeEventListener) {
      element.removeEventListener(name, observer, useCapture);
    } else if (element.detachEvent) {
      try {
        element.detachEvent('on' + name, observer);
      } catch (e) {}
    }
  }
});

/* prevent memory leaks in IE */
if (Prototype.Browser.IE)
  Event.observe(window, 'unload', Event.unloadCache, false);
var Position = {
  // set to true if needed, warning: firefox performance problems
  // NOT neeeded for page scrolling, only if draggable contained in
  // scrollable elements
  includeScrollOffsets: false,

  // must be called before calling withinIncludingScrolloffset, every time the
  // page is scrolled
  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  realOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return [valueL, valueT];
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return [valueL, valueT];
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if(element.tagName=='BODY') break;
        var p = Element.getStyle(element, 'position');
        if (p == 'relative' || p == 'absolute') break;
      }
    } while (element);
    return [valueL, valueT];
  },

  offsetParent: function(element) {
    if (element.offsetParent) return element.offsetParent;
    if (element == document.body) return element;

    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return element;

    return document.body;
  },

  // caches x/y coordinate pair to use with overlap
  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = this.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = this.realOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = this.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  // within must be called directly before
  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },

  page: function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      // Safari fix
      if (element.offsetParent == document.body)
        if (Element.getStyle(element,'position')=='absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (!window.opera || element.tagName=='BODY') {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);

    return [valueL, valueT];
  },

  clone: function(source, target) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || {})

    // find page position of source
    source = $(source);
    var p = Position.page(source);

    // find coordinate system to use
    target = $(target);
    var delta = [0, 0];
    var parent = null;
    // delta [0,0] will do fine with position: fixed elements,
    // position:absolute needs offsetParent deltas
    if (Element.getStyle(target,'position') == 'absolute') {
      parent = Position.offsetParent(target);
      delta = Position.page(parent);
    }

    // correct by body offsets (fixes Safari)
    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    // set position
    if(options.setLeft)   target.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if(options.setTop)    target.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if(options.setWidth)  target.style.width = source.offsetWidth + 'px';
    if(options.setHeight) target.style.height = source.offsetHeight + 'px';
  },

  absolutize: function(element) {
    element = $(element);
    if (element.style.position == 'absolute') return;
    Position.prepare();

    var offsets = Position.positionedOffset(element);
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = element.clientWidth;
    var height  = element.clientHeight;

    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.width  = width + 'px';
    element.style.height = height + 'px';
  },

  relativize: function(element) {
    element = $(element);
    if (element.style.position == 'relative') return;
    Position.prepare();

    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
    var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
  }
}

// Safari returns margins on body which is incorrect if the child is absolutely
// positioned.  For performance reasons, redefine Position.cumulativeOffset for
// KHTML/WebKit only.
if (Prototype.Browser.WebKit) {
  Position.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return [valueL, valueT];
  }
}

Element.addMethods();

/*
    json.js
    2006-10-05

    This file adds these methods to JavaScript:

        object.toJSONString()

            This method produces a JSON text from an object. The
            object must not contain any cyclical references.

        array.toJSONString()

            This method produces a JSON text from an array. The
            array must not contain any cyclical references.

        string.parseJSON()

            This method parses a JSON text to produce an object or
            array. It will return false if there is an error.

    It is expected that these methods will formally become part of the
    JavaScript Programming Language in the Fourth Edition of the
    ECMAScript standard.

(function () {
    var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        s = {
            array: function (x) {
                var a = ['['], b, f, i, l = x.length, v;
                for (i = 0; i < l; i += 1) {
                    v = x[i];
                    f = s[typeof v];
                    if (f) {
                        v = f(v);
                        if (typeof v == 'string') {
                            if (b) {
                                a[a.length] = ',';
                            }
                            a[a.length] = v;
                            b = true;
                        }
                    }
                }
                a[a.length] = ']';
                return a.join('');
            },
            'boolean': function (x) {
                return String(x);
            },
            'null': function (x) {
                return "null";
            },
            number: function (x) {
                return isFinite(x) ? String(x) : 'null';
            },
            object: function (x) {
                if (x) {
                    if (x instanceof Array) {
                        return s.array(x);
                    }
                    var a = ['{'], b, f, i, v;
                    for (i in x) {
                        v = x[i];
                        f = s[typeof v];
                        if (f) {
                            v = f(v);
                            if (typeof v == 'string') {
                                if (b) {
                                    a[a.length] = ',';
                                }
                                a.push(s.string(i), ':', v);
                                b = true;
                            }
                        }
                    }
                    a[a.length] = '}';
                    return a.join('');
                }
                return 'null';
            },
            string: function (x) {
                if (/["\\\x00-\x1f]/.test(x)) {
                    x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return '\\u00' +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    });
                }
                return '"' + x + '"';
            }
        };

    Object.prototype.toJSONString = function () {
        return s.object(this);
    };

    Array.prototype.toJSONString = function () {
        return s.array(this);
    };
})();
*/
String.prototype.parseJSON = function () {
    try {
        return (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(this)) &&
            eval('(' + this + ')');
    } catch (e) {
        return false;
    }
};

/*////////////////////////////////////////////////////////////////

GLOBAL $Revision: 1.42.8.1 $
Copyright 2006 Adobe Systems Incorporated

TOC:
Namespace
Open Window
Select Form Action
Math
Check Cache
Content Template
Cookie
Load Queue

////////////////////////////////////////////////////////////////*/

/*@cc_on; @*/

/*////////////////////////////////////////////////////////////////	

Function: Open Window
Simple Popup Window

Parameters:
uri - string
width - number (of pixels)
height - number (of pixels)
options - string
name - string

////////////////////////////////////////////////////////////////*/
function OpenWindow( url, width, height, opt , name ) {
	window.open( url, (name || "OutsideWindow"), "width="+(width || 714)+",height="+(height || 536)+","+(opt ||  "scrollbars=yes,menubar=yes,toolbar=yes,location=yes,status=yes,resizable=yes")).focus();
}

/*////////////////////////////////////////////////////////////////	

Function: Select Form Action
Simple processing of form dropdown options

Parameters:
formID - ID of form to be processed
dropdownID - ID of <select> tag to be processed

////////////////////////////////////////////////////////////////*/
function selectFormAction (formID,dropdownID) { 
	var selectedLink = document[formID][dropdownID].options[document[formID][dropdownID].selectedIndex].value;
	if (selectedLink != '#') {
		window.location=document[formID][dropdownID].options[document[formID][dropdownID].selectedIndex].value;
	} else if (selectedLink == '#') {
		document[formID][dropdownID].selectedIndex = 0;
	}
}

/*////////////////////////////////////////////////////////////////	

Function: checkCache
adds a fake query to prompt IE to re-check it's cache 

Parameters:
path - uri as string

Returns:
uri string with query parameter

////////////////////////////////////////////////////////////////*/
function checkCache(path) {
	return path+"?"+adobe.Math.Randomize.toId()+"=1";
}

/*////////////////////////////////////////////////////////////////

Function: registerOnReady
Execute a specified callback when the root document is ready.

Parameters:
func - function object reference

////////////////////////////////////////////////////////////////*/
function registerOnReady () {
	Event.onDOMReady.apply(Event, $A(arguments));
}

/*////////////////////////////////////////////////////////////////

Function: registerOnLoad
Execute a specified callback when the root document is loaded.

Parameters:
func - function object reference

////////////////////////////////////////////////////////////////*/
var registerOnLoadFunc = (
registerOnLoad = function(func) {
	$A(arguments).each(function (arg) {
		if(isFunction(arg)) {
			Event.observe( window, 'load', arg);
		}
		return;
	});
});

/*////////////////////////////////////////////////////////////////	

Class: adobe

Properties:
srcPath - string

////////////////////////////////////////////////////////////////*/
var adobe = (function() {
	var _scriptsSoFar,
	_libraryPath;
	
	var singl3ton = function() {
		_libraryPath = this.getMyPath();
		this.srcPath = _libraryPath;
	};
	singl3ton.prototype = {
/*////////////////////////////////////////////////////////////////	

Method: getMyPath

Returned Value:
The uri of this file

////////////////////////////////////////////////////////////////*/
		getMyPath: function() {
			var myPath = (_scriptsSoFar = document.getElementsByTagName("script"))[_scriptsSoFar.length - 1].getAttribute("src");
			return myPath.slice(0, myPath.lastIndexOf("/") + 1); 
		},
/*////////////////////////////////////////////////////////////////	

Method: setLibraryPath

Function: 
Specify the root path for dynamically loaded assets

Usage:
>	adobe.setLibraryPath("outside.app.com/lib/");
>	adobe.setLibraryPath(adobe.getMyPath() + "../../lib/");

Parameters:
myPath - String

Returned Value:
None

See also:
<Loader>

////////////////////////////////////////////////////////////////*/
		setLibraryPath: function(myPath) {
			 _libraryPath = myPath || this.getMyPath();
			 this.srcPath = _libraryPath; // backward compatible public property
		},
/*////////////////////////////////////////////////////////////////	

Method: getLibraryPath

Function: 
Get the root path for dynamically loaded assets

Returned Value:
String

////////////////////////////////////////////////////////////////*/
		getLibraryPath: function(myPath) {
			 return _libraryPath;
		},
/*////////////////////////////////////////////////////////////////	

Method: getLibraryPath

Function: 
Append ".compressed" to end of all dynamically loaded assets

Returned Value:
None

////////////////////////////////////////////////////////////////*/
		doJsCompress: function() {
			this.jscompress = 1;
			this.jscompress_path="compressed";
		}
	};
	
	return new singl3ton();
	
})();

adobe.hostEnv = (function() {
	var ua = new String(navigator.userAgent.toLowerCase()), //using new to speed up the many method calls below
		appV = parseInt(navigator.appVersion, 0),
		isSafari = ua.indexOf('safari') != -1,
		kitV = 0;
		
	if(isSafari) {
		var wk = 'applewebkit/',
			kitpos = ua.indexOf(wk);
		
		if(kitpos > -1) {
			var kit = ua.substring(kitpos+wk.length);
			kit = kit.substring(0,kit.indexOf(" "));
			kitV = parseInt(kit, 0);
		}
	}

	if(ua.indexOf('opera/7') != -1 || ua.indexOf('opera 7') != -1) { appV = 7; }
	
	var env = {
		"name":		window.location.hostname,
		"isSecure":	window.location.protocal == "https:",
		"appN":		navigator.appName.toLowerCase(),
		"appV":		appV,
		"ua":		ua, 
		"plt":		navigator.platform.toLowerCase(),
		"lang":		(navigator.language || navigator.userLanguage).substring(0,2),
		"ax":		typeof window.ActiveXObject != "undefined",
		"ieV":		(function() {
				/*@
					@if (@_jscript_version >= 5 && @_jscript_version < 5.5) { return 5; } @end;
					@if (@_jscript_version >= 5.5 && @_jscript_version < 5.6) { return 5.5; } @end;
					@if (@_jscript_version >= 5.6 && @_jscript_version < 5.7) { return 6; } @end;
					@if (@_jscript_version >= 5.7 && @_jscript_version < 5.8) { return 7; } @end;
				@*/
					return 0;
				})(),
		"isSafari": isSafari,
		"kitV":		kitV
	};
	
	return env;
})();

(((com={}).adobe = {}).www = {
	"is": true,
	isSecure: adobe.hostEnv.isSecure
});

adobe.util = adobe.util || {};

/*////////////////////////////////////////////////////////////////	

ON DOM READY
@author www.vivabit.com
temporary home for bug fix #63221

////////////////////////////////////////////////////////////////*/
Object.extend(Event, {
	 _domReady : function() {
		 if (arguments.callee.done) { return; }
		 arguments.callee.done = true;
		 
		 if (this._timer) { clearInterval(this._timer); }
		 this._readyCallbacks.each(function(f) { f(); });
		 this._readyCallbacks = null;
	},
	onDOMReady : function(f) {
		if (!this._readyCallbacks) {
			var domReady = this._domReady.bind(this);
     		if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", domReady, false);
			}
			/*@if (@_win32)
					document.write("<script id=__ie_onload defer src=//:><\/script>");
					document.getElementById("__ie_onload").onreadystatechange = function() {
						if (this.readyState == "complete") { 
							domReady();
						}
					}
				@end; @*/
			
			if (/WebKit/i.test(navigator.userAgent)) { 
				this._timer = setInterval(function() {
            		if (/loaded|complete/.test(document.readyState)) { domReady(); } }, 10);}
			
			Event.observe(window, 'load', domReady);
			Event._readyCallbacks =  [];
		}
		Event._readyCallbacks.push(f);
	}
});
/*////////////////////////////////////////////////////////////////

@author btapley

Class: Cookie

*/
adobe.Cookie = {
/*////////////////////////////////////////////////////////////////
	
	Method: set
	
	Parameters:
	name - string
	value - string
	duration - number (of days)
	path - string
	domain - string
	secure - boolean
		
////////////////////////////////////////////////////////////////*/
	set: function(name, value, duration, path, domain, secure){
		var cookie = [];
		cookie.push(name+"="+escape(value));
		if(duration) {
			var date = new Date();
			date.setTime(date.getTime() + (duration*86400000));
			cookie.push("expires=" + date.toGMTString());
		}
		if(path) {
			cookie.push("path=" + path || "/");	
		}
		if(domain) {
			cookie.push("domain=" + domain);
		}
		if(secure) {
			cookie.push("secure");
		}
		document.cookie = cookie.join(";");
	},
/*////////////////////////////////////////////////////////////////
	
	Method: get
	
	Parameters:
	name - string
		
////////////////////////////////////////////////////////////////*/
	get: function(name){
		var result, test, rexp = new RegExp(name + "=(.*)");
		document.cookie.split(";").detect(function(cookie){
			if((test = cookie.match(rexp))) {
				result = unescape(decodeURI(test[1]));
			} 
			return test;
		});
		return result;
	},
/*////////////////////////////////////////////////////////////////

	Method: remove
	
	Parameters:
	name - string
	
////////////////////////////////////////////////////////////////*/
	remove: function(name){
		this.set(name, '', -1);
	}
};


/*////////////////////////////////////////////////////////////////

@author btapley

Class: StateManager

Properties:
ns - namespace string

////////////////////////////////////////////////////////////////*/
adobe.StateManager = (function() {
	var loadedUri;
	var loadedCookies = {};
	var cookiesDays = {};
	var cookies = adobe.Cookie;
	
	function getUri() {
		return loadedUri || (loadedUri = window.location.search.toQueryParams());	
	}
	
	function getUriId(id) {
		return getUri()[id];	
	}
	
	function getSaveDays(ns) {
		return cookiesDays[ns] || 0;
	}
	
	function setSaveDays(ns, days) {
		cookiesDays[ns] = days;
		return;
	}
	
	function getSave(ns) {
		return loadedCookies[ns] || (loadedCookies[ns] = (cookies.get(ns) || "").toQueryParams());
	}
	
	function clearSave(ns, id) {
		var save = getSave(ns);
		delete save[id];
		var val = $H(save).toQueryString();				
		return val ? cookies.set(ns, val, getSaveDays(ns)) : cookies.remove(ns);
	}
	
	function setSave(ns, id, val) {
		var itemsToSave;
		
		if(val instanceof Array) { //since Array is also an Object, order is important here
			itemsToSave = (val).join(",");
		} else if(typeof val == 'object') {
			itemsToSave = $H(val).inject([], function(arr, state) {
				var value = state.value || 0;  //use numbers instead of booleans if present
				if(value && typeof value == 'boolean') {
					value = 1; //use numbers instead of booleans if present
				}
				arr.push(state.key + ":" + value);
				return arr;
			}).join(",");
		} else if(typeof val == 'string') {
			itemsToSave = val;
		} else if(typeof val == 'boolean') {
			itemsToSave = val ? "1" : "0";
		} else if(typeof val == 'number' && isFinite(val)) {
			itemsToSave = val.toString();
		}
		
		if(!itemsToSave) { return clearSave(ns, id); }
		
		getSave(ns)[id] = itemsToSave;
				
		cookies.set(ns, $H(getSave(ns)).toQueryString(), getSaveDays(ns));
		return;
	}
	
	var c0nstruct0r = function(nam3spac3, days2save) {
		this.ns = nam3spac3;
		setSaveDays(nam3spac3, days2save || 0);
		return this;
	};
	
	c0nstruct0r.prototype = {
/*////////////////////////////////////////////////////////////////

		Method: setCookieParam
		
		Parameters:
		id - string
		state - object, array, boolean, number, string
		
////////////////////////////////////////////////////////////////*/		
		setCookieParam: function(id, state) {
			setSave(this.ns, id, state); //lazy loader and assignment
			return;
		},
/*////////////////////////////////////////////////////////////////

		Method: getCookieParam
		
		Parameters:
		id - string
		
		Returns:
		object, array, boolean, number, string
		
////////////////////////////////////////////////////////////////*/		
		getCookieParam: function(id) {
			return getSave(this.ns)[id];
		},
/*////////////////////////////////////////////////////////////////
		
		Method: removeCookieParam
		
		Parameters:
		id - string
		
		Returns:
		Nothing
		
////////////////////////////////////////////////////////////////*/
		removeCookieParam: function(id) {
			return clearSave(this.ns, id);
		},
/*////////////////////////////////////////////////////////////////
		
		Method: getQueryParam
		
		Parameters:
		id - string
		
		Returns:
		object, array, boolean, number, string
		
////////////////////////////////////////////////////////////////*/
		getQueryParam: function(id) {
			return (id) ? getUriId(id) : getUri();
		}
	};
	return c0nstruct0r;
})();
/*////////////////////////////////////////////////////////////////		

@author btapley

Class: Console

A Simple logging module that wraps the native browser implementations of a 'console' and also provides a custom DOM version for browsers without a native implementation.

////////////////////////////////////////////////////////////////*/
adobe.Console = (function() {
	
	var face = "",
	log_renderer = false;
	
	var display = (function() { //Safari likes to crash if window.console.log is not called directly so
		if((face = window.console)) {
			log_renderer = true;
			return function(msg) {
				msg = msg.toString();
				window.console.log(msg);
			};
		
		} else if((face = window.opera)) {
			log_renderer = true;
			return window.opera.postError;
		
		} else {
			face = {};
			var lineNumber = 0,
				overflowmode = false;
			
			var messageBlock = document.createElement("DIV");
			var consoleBlock = messageBlock.cloneNode(false);
			
			messageBlock.style.borderTop = "1px solid #CCCCCC";
			messageBlock.style.padding = "1px 10px";
			messageBlock.style.backgroundColor = "#FFFFFF";
									
			consoleBlock.style.font = "10px/14px courier, monospace";
			consoleBlock.style.position = "absolute";
			consoleBlock.style.left = "0";
			consoleBlock.style.bottom = "0";
			consoleBlock.style.width = "100%";
			consoleBlock.style.zIndex = "1000";
			
			function setOverflowMode() {
				overflowmode = true;
				consoleBlock.style.overflowY = "auto";
				consoleBlock.style.height = "140px";
			}

			function attachLog() {
				if(lineNumber > 10) { setOverflowMode(); }				
				window.document.body.appendChild(consoleBlock);
				Event.stopObserving(window, "load", attachLog);
			}
			
			
			
			return function(value) {
				if(!log_renderer) {
					Event.observe(window, "load", attachLog);
					log_renderer = true;
				}
				lineNumber++;
				if(!overflowmode && lineNumber > 10) { setOverflowMode(); }
				var out = messageBlock.cloneNode(false);
				out.appendChild(document.createTextNode(lineNumber.toString() +" "+ value));
				return consoleBlock.appendChild(out);
			};
		}
	})();
	
	var time = face.time;
	var timeEnd = face.timeEnd;
	
	if(!face.time) {
		var timers = {};
		function _time (id) {
			timers[id] = new Date().getTime();
			return;
		}
		
		function _timeEnd (id) {
			var end = new Date().getTime();
			var start = timers[id];
			return display(id + ": " + (end - start - offset) + "ms");
		}
		
		time = _time;
		timeEnd = _timeEnd;
		
		var offset = new Date().getTime();
		var test = {time: new Date().getTime()};
		offset = test.time - offset;
		
	}

	return {
/*////////////////////////////////////////////////////////////////

		Method: log
		Print a value
		
		Returns: Nothing

////////////////////////////////////////////////////////////////*/
		"log":		display,
/*////////////////////////////////////////////////////////////////

		Method: time
		
		Parameters:
		timerId - string
		
////////////////////////////////////////////////////////////////*/
		"time":		time,
/*////////////////////////////////////////////////////////////////
			
		Method: timeEnd
			
		Parameters:
		timerId - string
			
////////////////////////////////////////////////////////////////*/
		"timeEnd":	timeEnd
	};
})();
/*
ELEMENT
@author btapley

Class: Element
*/
adobe.Element = (function() {
	
	function createElem(doc, name, attributes) {
		var element = doc.createElement(name);
		if(attributes) {
			setAttrs(element, attributes);
		}
		return element;
	}
	
	function getOwnerDoc(element) {
		return element.ownerDocument || element.document;
	}
	
	//ATTRIBUTE CROSS BROWSER FIXES
	var fixNames = {};
	
	var testDiv = window.document.createElement("div");
	
	if(typeof testDiv.attributes["class"] != "undefined") { //IE variance, fragile?
		fixNames["class"] = "className";
		fixNames["for"] = "htmlFor";
	}
	
	var reqCssText = (function () { //use CSS text if needed for getting the style attribute 
			var s = testDiv.getAttribute("style");
			return isObject(s) && (typeof s.cssText != "undefined");
	})();
	
	testDiv = ''; //this is garbage now
	
	//Attribute Handling
	
	var STYLE_NVPAIRS_PATTERN = /[#\w][\w\s\(\)\-,]+/g;
	
	function createSpaceDelimitedPattern(s) { 
		return new RegExp("(^|\\s)" + s + "(\\s|$)");
	}
	
	function createLiteralObjectKeyPattern(s) { 
		return new RegExp("(^|\\s)" + s + "(\\s|:|$)");
	}
	
	function getAttr(el, attribute) {
		var name = fixNames[attribute] || attribute,
			empty = "";
		
		if(!el.getAttribute) {return empty;}
		
		var s = el.getAttribute(name);
		
		if(name != "style") {
			return s || empty;
		} 
		
		//Cross Browser Style Support
		if(isString(s) || isNull(s)) {
			return s || empty;
		} else if(isObject(s)) {
			return s.cssText || empty;
		}
		return empty;
	}
	
	function setAttrs(element, attributes) {
		for(var attr in attributes) {
			setAttr(element, attr, attributes[attr]);
		}
	}
	
	function setAttr(element, attribute, value) {
		var name = fixNames[attribute] || attribute;
		if(!value) {
			element.removeAttribute(name);
		} else if (name=="style" && reqCssText) {
			element.getAttribute("style").cssText = value;
		} else {
			element.setAttribute(name, value);
		}
	}

	function hasAttr(element, attribute, property) {
		var s = getAttr(element, attribute);
		
		if(!s) { return false; }
		
		if(!property) { 
			return (s) ? true : false;
		}
		
		if(attribute == "style") {
			return createLiteralObjectKeyPattern(property).test(s);
		}
		
		return createSpaceDelimitedPattern(property).test(s);
	}
	
	function getAttrParam(element, attribute, options) { //options: marker, keyname, delimiter
		var s = getAttr(element, attribute),
			r=""; //result
		
		
		if(options) { //do special marker parsing
			var m = options.marker,
			k = createSpaceDelimitedPattern(options.keyname),
			d = options.delimiter || " ", //space delimited attributes are default
			sm;
			
			var marked = s.split(m), //split on marker	
			l = marked.length; //create length index
			
			if(m && l<2) { //did a split happen?
				
				return r; //result undefined	//should this just return the default array or hash?
			}	
			
			if(k) { //have keyname, return an array of attributes after this marker, stop if we encounter another marker
				r = [];
				do {
					i = marked[l-1];
					if(i.search(k) !== 0) { continue; }
					sm = i.split(d); //split on delimiter
					if(!sm[sm.length-1]) { sm.pop(); } //clean up trailing whitespace
					sm.shift(); //remove keyname
					r = r.concat(sm); //flatten array and add to result
				
				} while(--l);
			
			} else { //no keyname, return hash of all marker matches
				r = {};
				do {
					i = marked[l-1];
					if(!i) { continue; }
					sm = i.split(d); //split on delimiter
					if(!sm[sm.length-1]) { sm.pop(); } //clean up trailing whitespace			
					var name = sm.shift(); //remove and save name
					var hi = r[name]; //find hash id
					r[name] = (hi) ? hi.concat(sm) : sm; //set result to new property, if exists flatten array and add result 
				
				} while(--l);
				
			}
							
		} else if(attribute == "style") { //create a hash
						
			var pairs = s.match(STYLE_NVPAIRS_PATTERN);
				
			r = {};
			
			for(var i = 0, n; i < pairs.length; i++) {
				var v = pairs[i];
				if(i%2 === 0) { //key
					n = v;
				} else { //value
					r[n] = v;
				}
			}
			
		} else { //list values
			r = s.split(d);
			if(!r[r.length-1]) { r.pop(); }//clean up trailing whitespace
		}
		
		return r;
	}
	
	function removeAttrParam (element, attribute, parameter) {
		var m = createSpaceDelimitedPattern(parameter);
			
		return setAttr(element, attribute, getAttr(element, attribute).replace(m, function(s,$1,$2) {
			if(!$1) { return ""; }
			if(!$2) { return ""; }
			return " ";
		}));
	}
	
	function setAttrParam(element, attribute, parameter) {
		if(hasAttr(element, attribute, parameter)) { return; }
		var attr = getAttr(element, attribute);
		return setAttr(element, attribute, attr + ((attr) ? " " : "") + parameter);		
	}

	var singl3ton = {
/*
		Method: create
		
		Parameters:
		name - string
		attributes - object as hash
*/
		create: function(name, attributes) {
			return createElem(window.document, name, attributes);
		},
		/*
			Method: createRemote
			
			Parameters:
			doc - Document object reference
			name - string
			attributes - object as hash
		*/
		createRemote: function(doc, name, attributes) {
			return createElem(doc, name, attributes);
		},
		/*
			Method: getOwnerDocument
			
			Parameters:
			element - Node reference
		*/
		getOwnerDocument: getOwnerDoc,
		/*
			Method: setAttributes
			
			Parameters:
			element - Node reference
			attributes - object as hash
			
		*/
		setAttributes: setAttrs,
/*
		Method: getAttribute
		
		Parameters:
		element - Node reference
		attribute - string
*/
		getAttribute: getAttr,
/*
		Method: hasAttribute
		
		Parameters:
		element - Node reference
		attribute - string
		parameter (optional) - string
*/
		hasAttribute: hasAttr,
/*
		Method: replaceAttributeParam
		
		Parameters:
		element - Node reference
		attribute - string
		currentValue - string
		replacement - string
*/
		replaceAttributeParam: function(element, attribute, currentvalue, replacement) {
			removeAttrParam(element, attribute, currentvalue);
			return setAttrParam(element, attribute, replacement);
		},
/*
		Method: setAttributeParam
		
		Parameters:
		element - Node reference
		attribute - string
		parameter - string
*/
		setAttributeParam: setAttrParam,
/*
		Method: removeAttributeParam
		
		Parameters:
		element - Node reference
		attribute - string
		parameter - string
*/
		removeAttributeParam: removeAttrParam,
/*
		Method: getAttributeParams
		
		Parameters:
		element - Node reference
		attribute - string
		options - marker, keyname, delimiter
*/
		getAttributeParams: getAttrParam,
/*
		Method: getElementsByClassName
		
		Parameters:
		root - Node reference
		tag - string
		classname - string
*/
		getElementsByClassName: function(root, tag, css) {
			root = root || document;
			var result = [], 
				tags, 
				a11 = root.all;
			
			if(!tag || tag == "*") {
				tags = a11 || root.getElementsByTagName(tag) || [];
			} else if(!!root.getElementsByTagName) {
				tags = root.getElementsByTagName(tag);
			} else if(a11) {
				tags = a11.tags(tag);
			} else {
				return result;	
			}
			
			var i = tags.length-1, t;
			
			if(i < 0) { return result; }
			
			do {
				t = tags[i];
				if(hasAttr(t, "class", css)) {
					result.push(t);							   
				}
			} while (i--);
			
			return result;
		},
/*
		Method: resolveId
		
		Parameters:
		element - Noode reference
*/
		resolveId: function(element) {
			if(!element) { return; }
			var id = element.id;
			if(!id) {
				id = element.uniqueID;
				if(!id) {
					var doc = getOwnerDoc(element);
					var mthd = adobe.Math.Randomize.toId;
					id = mthd();
					while(doc.getElementById(id)) { 
						id = mthd();
					}
				}
				return (element.id = id);
			}
			return id;
		},
/*
		Method: insertAbove
		
		Parameters:
		node - Node reference
		insertion -  Node reference
*/
		insertAbove: function(node, insertion) {
			return node.parentNode.insertBefore(insertion, node);
		},
/*
		Method: insertBelow
		
		Parameters:
		node - Node reference
		insertion -  Node reference
*/
		insertBelow: function (node, insertion) {
			return node.parentNode.insertBefore(insertion, node.nextSibling);
		}
	};
	
/*		OUTSIDE
		@author btapley
		http://webdev.macromedia.com/wiki/index.php/Outside
		
		Class: Outside
		
		Properties:
		insideElement - current innermost element
		outsideElement - current Outermost element
		
		Usage:
>		var myOutside = adobe.Element.Outside(elementReference);
>		myOutside.setOutside(1, {"class": "myFirstOutsideStyle"});
>		myOutside.setOutside(2, {"class": "mySecondOutsideStyle"});
> 		myOutside.render();
		
*/
	singl3ton.Outside = function(element, outsides) {
		this.insideElement = 
		this.outsideElement = 
		$(element) || createElem(document, "div");
		
		this.outsideElements = outsides || [];
	};
	
	singl3ton.Outside.prototype = {
		removeOutside: function(){
			this.outsideElements.clear();
			return this.render();
		},
		setOutside: function(index, attributes) {
			index--;
			var outside = (this.outsideElements[index] = this.outsideElements[index] || createElem(document, "div"));
			setAttrs(outside, attributes);
			return;
		},
		render: function() {		
			var outsideSum = this.outsideElements.length-1,
				currentElement = this.outsideElement || this.insideElement,
				newElement = this.outsideElements[outsideSum] || this.insideElement,
				renderElements = [];
			if(outsideSum >= 0) {
				do {
					if(!this.outsideElements[outsideSum]) { continue; }
					renderElements.push("(this.outsideElements["+outsideSum+"])");
				} while(outsideSum--);
				
				renderElements.push("(this.insideElement.cloneNode(true))");
				eval(renderElements.join(".appendChild"));
				renderElements.clear(); //make garbage
			}
			if(currentElement.parentNode) {
				currentElement.parentNode.replaceChild(newElement, currentElement);
			}
			return (this.outsideElement = newElement);
		}
	
	};

	return singl3ton;
})();
/*////////////////////////////////////////////////////////////////

@author btapley

Class: ContentTemplate

Properties:
code - string

Usage:
>	var myTemplate = adobe.ContentTemplate("<p>#NAME#<\/p>");
>	myTemplate.injectData({NAME: "Rocky"});

////////////////////////////////////////////////////////////////*/

adobe.ContentTemplate = (function() {
	var C0nstruct0r = function(code) {
		this.code = new String(escape(code) || "");
	};
	
	C0nstruct0r.prototype = {
/*////////////////////////////////////////////////////////////////

		Method: injectData
		
		Parameters:
		hash - object as hash
		token (optional) - string (default is '#')
		
////////////////////////////////////////////////////////////////*/
		injectData:function(hash, token) {
			token = escape(token || "#");
			var result = $H(hash).collect(function(i) {
				return "(/"+token+i.key+token+"/g,'"+escape(i.value)+"')";
			});
			result.unshift("this.code");
			return unescape(eval(result.join(".replace")));
		}
	};
	
	return C0nstruct0r;
})();
/*////////////////////////////////////////////////////////////////	

@author btapley

Class: Math

////////////////////////////////////////////////////////////////*/

adobe.Math = {};

/*////////////////////////////////////////////////////////////////	

@author btapley

Class: Randomize

////////////////////////////////////////////////////////////////*/
adobe.Math.Randomize = (function() {
	var rand = Math.random;
	var alphabet = new String("abcdefghijklmnopqrstuvwxyz");
	
	function numRng(n1,n2) {
		var lo = Math.min(n1, n2), hi = Math.max(n1, n2);
		return ( parseInt( rand() * hi, 0 )%( hi-lo+1 ) )+lo;
	}
	
	function alpha() {
		var i = numRng( 0, alphabet.length-1);
		return alphabet.charAt(i);
	}
	
	function digit(maxnumber) {
		return parseInt( rand()*( Math.pow( 10, maxnumber || 1 ) ), 0 );
	}
	
	return {
/*////////////////////////////////////////////////////////////////

		Method: toDigitLimit
		
		Parameters:
		maxnumber - maximum number of digits
		
////////////////////////////////////////////////////////////////*/
		toDigitLimit: digit,
/*////////////////////////////////////////////////////////////////

		Method: inNumberRange
		
		Parameters:
		n1 - number
		n2 - number
		
		Returns:
		Number between n1 and n2 parameters

////////////////////////////////////////////////////////////////*/
		inNumberRange: numRng,
/*////////////////////////////////////////////////////////////////
		
		Method: toAlpha
		
		Returns:
		letter as string
		
////////////////////////////////////////////////////////////////*/
		toAlpha: alpha,
/*////////////////////////////////////////////////////////////////
		
		Method: inAlphaRange
		
		Parameters:
		a1 - letter as string
		a2 - letter as string
		
		Returns:
		letter between a1 and a2 parameters as a string
		
////////////////////////////////////////////////////////////////*/
		inAlphaRange: function(a1, a2) {
			var i = numRng( alphabet.indexOf(a1), alphabet.indexOf(a2) );
			return alphabet.charAt(i);
		},
/*////////////////////////////////////////////////////////////////
		
		Method: inAlphaRange
		
		Parameters:
		a1 - letter as string
		a2 - letter as string
		
		Returns:
		Alphanumeric string
		
////////////////////////////////////////////////////////////////*/
		toId: function(num) {
			return alpha()+digit( num || 3 );
		}
	};
})();
/*	ASSET LOADER $Revision: 1.28 $
	Work in progress
	@author btapley
*/

/*	
	Class: Loader 
	Load assets into the document, prevent overlapping assets form being written more than once.
	
	Example:
>	adobe.Loader.requireAsset("/path/to/my/file.js");
>	adobe.Loader.requireAsset("_/library_path/to/my/file.css");
>	adobe.Loader.requireAsset("/path/to/my/file_print.css", { media: "print" });
*/

adobe.Loader = (function() {	
	var ATTR_TOKEN = "#ATTR#",
		STATUS_NONE = 0,
		STATUS_DONE = 1,
		STATUS_ERROR = 2,
		SRC_PATH_TRIG = "_/",
		PATH_CAPTURE = /(^.+\.)(\w+)(\?[^$]*$|$)/,
		SCRIPT_TAG = "<script #ATTR#><\/script>",
		LINK_TAG = "<link #ATTR# \/>",
		jscompress = !!adobe.jscompress,
		compress_path = adobe.jscompress_path,
		renderStatus = {},
		assets = {
			JS: [ SCRIPT_TAG, "src", {
				type:"text/javascript"
			}],
			CSS: [ LINK_TAG, "href", {
				type:"text/css",
				rel:"stylesheet"
			}]
		},
		renderAsset = function(path, user_attributes) {	
			var explode = path.match(PATH_CAPTURE), //break apart the path argument
				ext = explode[2], //file extension
				q = explode[3]; //query
			
			if(!ext) { return; } //didn't find a suitable file extension?
				
			var type = ext.toUpperCase(), //declare file type
				data = assets[type]; //declare data point
				
			if(!data) { return; } //is asset type defined in here?
				
			/* compression hack here. Still implementing server compression */
			if(type == "JS" && jscompress) {
				path = explode[1] + compress_path + "." + ext + q;
			}
				
			var out = {},
				attrs = [],
				attrN = "",
				code = data[0],
				pathAtt = data[1],
				reqAtt = data[2];
				
			for(attrN in reqAtt) { //copy required attributes 
				out[attrN] = reqAtt[attrN];
			}
			
			out[pathAtt] = path; //set path attribute
			
			if(user_attributes) { //copy user-defined attributes
				for(attrN in user_attributes) {
					out[attrN] = user_attributes[attrN];
				}
			}
			
			for(attrN in out) { //create attribute text eg. name="value"
				attrV = out[attrN];				
				attrs.push((attrV) ? (attrN + '="' + attrV + '"') : attrN);
			}
			
			return code.replace(ATTR_TOKEN, attrs.join(" "));
		};
	
	return {
		/*
			Function: requireAsset
			
			Parameters:
			path - location string (Paths beginning with "_/" will be relative to the library location)
			user_attributes - object instance (optional)
			
			Returns:
			Integer indicating render status (0=None, 1=Done, 2=Error)
		*/
		
		requireAsset : function(path, user_attributes) {
			if(!path) { return STATUS_NONE; } //insurance from bad calls
			
			if(path.indexOf(SRC_PATH_TRIG) === 0) { //did we request a library relative path?
				path = path.replace(SRC_PATH_TRIG, adobe.srcPath); //replace the trigger with the path
			}
			
			var currentStatus = (renderStatus[path] || STATUS_NONE); //declare status?
			
			if(currentStatus > STATUS_NONE) { return currentStatus; } //this path was already written, terminally failed, or in progress?
								
			var txt = renderAsset(path, user_attributes);
			
			if(!txt) { 
				return (renderStatus[path] = STATUS_ERROR);
			} else {
				renderStatus[path] = currentStatus = STATUS_DONE; //new request, log it before writing to prevent recursion
			}
			
			document.write(txt);
			
			return currentStatus;
		}
	};
})();
/*	IE SUBSTITUTION CSS
*/

if(adobe.hostEnv.ieV == 6) { //rememdy IE 6 broken background image cache
	try { 
		document.execCommand("BackgroundImageCache", false, true); 
	} catch(err) {}
}

adobe.SelectFix = (function() {
	var Construct0r = function() { };
	Construct0r.prototype = {
		doFix: function() {
			for(var i = 0, n; (n = document.getElementsByTagName("select")[i]); i++) {
				n.style.visibility = "hidden";
			}
		},
		undoFix: function() {
			for(var i = 0, n; (n = document.getElementsByTagName("select")[i]); i++) {
				n.style.visibility = "visible";
			}
		}
	};
	return new Construct0r();
})();
/*
	Class: htc
	Utility functions to support Microsoft's HTC technology
*/
adobe.htc = (function() {
	var htcRegistry = {};
	
	function htcGetArgs(str) {
		return str.split(",");
	}
	function htcGetProps(str) {
		return str.split(" ");
	}
	
	function normalize_obj_arg (obj) {
		if(!obj) {
			return [];
		} else if(isArray(obj)) { 
			return obj; 
		} else if(isTag(obj)) {
			return [obj]	
		} else {
			return [];
		}
	}
	
	function $getFirstChild (node,name) {
		var result = [];
		if(!node) { return result; }
		if(name) { 
			result.push(node.children.tags(name)[0]);
		} else {
			for(var n, i = 0; (n = node.children[i]); i++) {
				if(n.nodeType == 1) {
					result.push(n)
					break;
				}
			}
		}
		return result;
	}
	
	function $getDirectChild (node,name) {
		var r = (name) ? node.children.tags(name) : node.children;
		var result = [];
		for(var i=0; i < r.length; i++) {
			result.push(r[i]);	
		}
		return result;
	}
	
	function $addStyleToNode(el,args) {
		args = htcGetArgs(args); //styles, runtime		
		var styleObject = (args[1]) ? "runtimeStyle" : "style";
		var pairs = htcGetProps(args[0]);
		for(var i=0; i < pairs.length; i++) {
			el[styleObject][pairs[i]] = pairs[++i];
		}
	}
	
	function $next (node,name) {
		var result = [],
		next = node.nextSibling;
		if(name && next.nodeName == name) {
			result.push(next);
		} else if(next) {
			result.push(next);
		}
		return result;
	}
	
	var Construct0r = function() { }
	Construct0r.prototype={
/*-----------------------------------------------------------------------------------
			
		Method: bind2
		
		Parse and Execute a method string, then register the id
		
		Parameters:
		id - element ID
		method_str - string to parse and execute using special syntax
			
-----------------------------------------------------------------------------------*/
		bind2: function(id, method_str) {
			if(!htcRegistry[id]) {
				this.exe(id, method_str.substring(1,method_str.length-1));
				htcRegistry[id] = 1;
			}
		},
/*-----------------------------------------------------------------------------------
			
		Method: exe
		
		Break apart the method str
		
		Usage:
>		$getFirstChild >$addClassToNode[p1-first-child]
		
		"$" - refer to a method
		">" - pass the result into the next method
		"[" - open arguments for method
		"," - separate arguments
		"]" - close arguments
		
		Parameters:
		id - element ID
		method_str - string to parse and execute using special syntax
			
-----------------------------------------------------------------------------------*/
		exe: function(id, method_str) {
			var _i = document.getElementById(id),
				excs = method_str.split("$");
				excs.shift();
			
			for(var i=0; i < excs.length; i++) {
				var exc = excs[i];
				
				var z, c, a="";
				
				//arguments
				z = exc.indexOf("[");
				if(z > -1) {
					c = exc.indexOf("]");
					a = exc.substring(z+1,c);
				} else {
					z = exc.indexOf(" ");
				}
				
				var excName = exc.substring(0, z);
				var f = this[excName];
				if(!f) continue;
				
				var _o = f(_i, a);
				
				//pass thru
				if(exc.charAt(exc.length-1) == ">") {
					_i = _o; //set input to output
				}
			}
		},
/*-----------------------------------------------------------------------------------
			
		Method: addClassToNode
		
		Usage:
>		$addClassToNode[myClassName]
			
-----------------------------------------------------------------------------------*/
		addClassToNode: function(el,style){
			var e = normalize_obj_arg(el);
			var i = e.length-1;
			
			if(i<0) { 
				return e;
			}
			
			do {
				adobe.Element.setAttributeParam(e[i], "class", style);	
			} while (i--);
			
			return e;
		},
/*-----------------------------------------------------------------------------------
			
		Method: addStyleToNode
		
		Usage:
>		$addStyleToNode[fontWeight bold backgroundColor red]
>		$addStyleToNode[fontWeight bold backgroundColor red,runtime]
					
-----------------------------------------------------------------------------------*/
		addStyleToNode: function(el,args){
			var e = normalize_obj_arg(el);
			var i = e.length-1;
			
			if(i<0) { 
				return e;
			}
			
			do {
				$addStyleToNode(e[i], args);
			} while (i--);
			
			return e;
		},
/*-----------------------------------------------------------------------------------
			
		Method: getAdjacent
		
		Usage:
>		$getAdjacent
			
-----------------------------------------------------------------------------------*/
		getAdjacent: function(nodelist) {
			return $A(nodelist).findAll(function(node) {
				return node.previousSibling;
			});
		},
/*-----------------------------------------------------------------------------------
			
		Method: getDirectChild
		
		Usage:
>		$getDirectChild
>		$getDirectChild[UL]
			
-----------------------------------------------------------------------------------*/
		getDirectChild: function(node,name) {
			var e = normalize_obj_arg(node);
			var _i, _o = []; //input and output
					
			for(var i=0, l = e.length; i < l; i++) {
				_i = $getDirectChild(e[i], name); //recursive method defined above
				if(!!_i.length) { _o = _o.concat(_i); }
			}
			
			return _o;
		},
/*-----------------------------------------------------------------------------------
			
		Method: getFirstChild
		
		Usage:
>		$getFirstChild
>		$getFirstChild[UL]
			
-----------------------------------------------------------------------------------*/
		getFirstChild: function(node, name) {
			var e = normalize_obj_arg(node);
			var _i, _o = []; //input and output
					
			for(var i=0, l = e.length; i < l; i++) {
				_i = $getFirstChild(e[i], name); //recursive method defined above
				if(!!_i.length) { _o = _o.concat(_i); }
			}
			
			return _o;
		},
/*-----------------------------------------------------------------------------------
			
		Method: getLastChild
		
		Usage:
>		$getLastChild
>		$getLastChild[UL]
			
-----------------------------------------------------------------------------------*/
		getLastChild: function(node, name){
			if(name) { 
				var c = node.children.tags(name);
				return c[c.length];
			}
			for(var n, i = node.children.length-1; (n = node.children[i]); i--) {
				if(n.nodeType == 1) {
					return n;
				}
			}
			return;
		},
/*-----------------------------------------------------------------------------------
			
		Method: next
		
		Usage:
>		$next
>		$next[UL]
			
-----------------------------------------------------------------------------------*/
		next: function(node, name) {
			var e = normalize_obj_arg(node);
			var _i, _o = []; //input and output
					
			for(var i=0, l = e.length; i < l; i++) {
				_i = $next(e[i], name); //recursive method defined above
				if(!!_i.length) { _o = _o.concat(_i); }
			}
			
			return _o;
		},
/*-----------------------------------------------------------------------------------
			
		Method: addTextToNode
		
		Usage:
>		$addTextToNode[ /]
>		$addTextToNode[ /,after]
>		$addTextToNode[ /,after,fontWeight normal]
			
-----------------------------------------------------------------------------------*/
		addTextToNode: function(n,a) {
			var e = normalize_obj_arg(n),
			args = htcGetArgs(a); //content,position,style
			
			
			for(var i=0; i<e.length;i++) {
				addText(e[i]);	
			}
			
			
			function addText(node) {
				var insert, 
				text = document.createTextNode(args[0].toString()),
				style = args[2];
				
				if(style) {
					insert = document.createElement('span');
					$addStyleToNode(insert, style+',runtime');
					insert.appendChild(text);
				} else {
					insert = text;
				}
				switch(args[1]) {
					case "before": node.insertBefore(insert, node.firstChild); break;
					case "after": node.appendChild(insert); break;
				}		
			}
			
			return e;
			
		}
	};

	return new Construct0r();
})();
/*	
	Module initialization via Dreamwmeaver template propeties
	@author btapley
	$Id: Dwt.js,v 1.5.8.1 2007/11/20 22:08:30 baumeister Exp $
*/
/*
	Class: Dwt
	
	Example:
>	adobe.Dwt.require("dropdown","pod","fma");
*/
adobe.Dwt = (function() {	
	
	var render = adobe.Loader.requireAsset,
		var_props = {};
	
	var Dwt = {
		/*
			Method: require
			Require assets and initializations for specified modules
			
			Returned Value:
			None
			
			Parameters:
			Any number of symbolic arguments
			* accordion
			* carousel
			* drawer
			* dropdown
			* fma
			* form
			* map
			* pod
			* sifr
			* swf
			* tab
			* table
			* tree
			* user
			* wysiwyg
		*/
		require:function() {
			for(var i = 0; i < arguments.length; i++) {
				switch(arguments[i]) {
					case "accordion":
						render("/lib/yui/extensions/accordion/accordion.js");
						render("/lib/yui/extensions/accordion/accordion.css");
						break;
					case "carousel":
						render("/lib/yui/extensions/carousel/carousel.js");
						render("/lib/yui/extensions/carousel/carousel.css");
						break;
					case "drawer":
						render("_/module/drawer.js");
						break;
					case "dropdown": 
						render("_/module/dropdown/dropdown.css");
						if(adobe.hostEnv.ieV && adobe.hostEnv.ieV < 7) {
							Event.observe(window, "load", function() {
								var dropdowns = adobe.Element.getElementsByClassName(document.body, "*", "d-dropdown");
								var i = dropdowns.length-1;
								if(i < 0) {return;}
								do{
									Event.observe(dropdowns[i], "mouseover", adobe.SelectFix.doFix);
									Event.observe(dropdowns[i], "mouseout", adobe.SelectFix.undoFix);
								} while(i--);
							});
						}
						break;
					case "fma": 
						render("_/module/Fma.js"); 
						break;
					case "form": 
						render("_/remedy/button-value.js");
						render("_/module/InputTitleOverlay.js");
						break;
					case "map": 
						render("_/module/map.css");
						break;
					/*
					case "pod": 
						render("_/module/pod.js");
						Event.onDOMReady(function() {
							adobe.Pod.renderDomSubscribers();				  
						});
						break;
					*/
					case "peek":
						render("_/module/PeekPane.js");
						Event.observe(window, "load", function() {
							init_PeekPanes();      
						});
						break;
					case "rel": 
						render("_/Rel.js");
						break;
					case "sifr":
						render("_/sIFR2.0.2/sifr.js");
						render("_/sIFR2.0.2/sIFR-print.css", { media:"print" });
						break;
					case "swf":
						render("_/swfobject.js");
						render("_/swfobject.addon.js");
						break;
					case "tab": 
						render("_/module/tabnav.js");
						Event.onDOMReady(function() {
							adobe.tabs.renderDomSubscribers();			  
						});
						break;
					case "table": 
						render("_/module/table.js");
						Event.onDOMReady(function() {
							adobe.Element.Table.stripe$$('.stripe', 1, 0.92);			  
						});
						break;
					case "tooltip":
						render("_/module/tooltip.js");
						Event.observe(window, "load", function() {
							init_Tooltips();      
						});
						break;
					case "tree": 
						render("_/module/treenav.js");
						Event.onDOMReady(function() {
							adobe.gui.tree.renderDomSubscribers();			  
						});
						break;
					case "user": 
						render("_/module/InputTitleOverlay.js");
						break;
					case "wysiwyg": 
						render("_/module/wysiwyg.js");
						break;
				}
			}
		},
		/*
			Method: setProperty
			Make a custom property available to other scripts
			
			Returned Value:
			None
		*/
		setProperty: function(name, value) {
			var_props[name] = value;
		}
	};
	/*
		Method: getProperty
		Get a user-defined property or native property
		
		Returned Value:
		Property value string or empty string
	*/
	Dwt.getProperty = function(name) {
		return var_props[name] || Dwt[name] || "";
	};
	
	return Dwt;
})();