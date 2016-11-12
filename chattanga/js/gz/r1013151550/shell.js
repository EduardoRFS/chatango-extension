var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.define("goog.DEBUG", true);
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.define("goog.DISALLOW_TEST_ONLY_CODE", COMPILED && !goog.DEBUG);
goog.provide = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return name in goog.loadedModules_ ? goog.loadedModules_[name] : goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};
goog.module.declareTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareTestMethods must be called from " + "within a goog.module");
  }
  goog.moduleLoaderState_.declareTestMethods = true;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {"goog.module":true};
}
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for (var part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console["error"](msg);
  }
};
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return null;
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    goog.logToConsole_(errorMessage);
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.define("goog.LOAD_MODULE_USING_EVAL", true);
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG);
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
if (goog.DEPENDENCIES_ENABLED) {
  goog.included_ = {};
  goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for (var i = scripts.length - 1;i >= 0;--i) {
      var script = (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.IS_OLD_IE_ = !goog.global.atob && goog.global.document && goog.global.document.all;
  goog.importModule_ = function(src) {
    var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';
    if (goog.importScript_("", bootstrap)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.queuedModules_ = [];
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
    } else {
      return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");";
    }
  };
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0;i < count;i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && goog.dependencies_.pathIsModule[path]) {
      var abspath = goog.basePath + path;
      return abspath in goog.dependencies_.deferred;
    }
    return false;
  };
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && path in goog.dependencies_.requires) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };
  goog.loadModule = function(moduleDef) {
    var previousState = goog.moduleLoaderState_;
    try {
      goog.moduleLoaderState_ = {moduleName:undefined, declareTestMethods:false};
      var exports;
      if (goog.isFunction(moduleDef)) {
        exports = moduleDef.call(goog.global, {});
      } else {
        if (goog.isString(moduleDef)) {
          exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
        } else {
          throw Error("Invalid module definition");
        }
      }
      var moduleName = goog.moduleLoaderState_.moduleName;
      if (!goog.isString(moduleName) || !moduleName) {
        throw Error('Invalid module name "' + moduleName + '"');
      }
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        goog.constructNamespace_(moduleName, exports);
      } else {
        if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
          Object.seal(exports);
        }
      }
      goog.loadedModules_[moduleName] = exports;
      if (goog.moduleLoaderState_.declareTestMethods) {
        for (var entry in exports) {
          if (entry.indexOf("test", 0) === 0 || entry == "tearDown" || entry == "setUp" || entry == "setUpPage" || entry == "tearDownPage") {
            goog.global[entry] = exports[entry];
          }
        }
      }
    } finally {
      goog.moduleLoaderState_ = previousState;
    }
  };
  goog.loadModuleFromSource_ = function(source) {
    var exports = {};
    eval(arguments[0]);
    return exports;
  };
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (doc.readyState == "complete") {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      var isOldIE = goog.IS_OLD_IE_;
      if (opt_sourceText === undefined) {
        if (!isOldIE) {
          doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>");
        }
      } else {
        doc.write('<script type="text/javascript">' + opt_sourceText + "</" + "script>");
      }
      return true;
    } else {
      return false;
    }
  };
  goog.lastNonModuleScriptIndex_ = 0;
  goog.onScriptLoad_ = function(script, scriptIndex) {
    if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    var loadingModule = false;
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      if (path) {
        if (!deps.pathIsModule[path]) {
          goog.importScript_(goog.basePath + path);
        } else {
          loadingModule = true;
          goog.importModule_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error("Undefined script input");
      }
    }
    goog.moduleLoaderState_ = moduleState;
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.normalizePath_ = function(path) {
  var components = path.split("/");
  var i = 0;
  while (i < components.length) {
    if (components[i] == ".") {
      components.splice(i, 1);
    } else {
      if (i && components[i] == ".." && components[i - 1] && components[i - 1] != "..") {
        components.splice(--i, 2);
      } else {
        i++;
      }
    }
  }
  return components.join("/");
};
goog.retrieveAndExecModule_ = function(src) {
  if (!COMPILED) {
    var originalPath = src;
    src = goog.normalizePath_(src);
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    var scriptText = null;
    var xhr = new goog.global["XMLHttpRequest"];
    xhr.onload = function() {
      scriptText = this.responseText;
    };
    xhr.open("get", src, false);
    xhr.send();
    scriptText = xhr.responseText;
    if (scriptText != null) {
      var execModuleScript = goog.wrapModule_(src, scriptText);
      var isOldIE = goog.IS_OLD_IE_;
      if (isOldIE) {
        goog.dependencies_.deferred[originalPath] = execModuleScript;
        goog.queuedModules_.push(originalPath);
      } else {
        importScript(src, execModuleScript);
      }
    } else {
      throw new Error("load of " + src + "failed");
    }
  }
};
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call((value));
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return!!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if ("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return(fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if (typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for (var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  if (opt_modifier) {
    return className + "-" + rename(opt_modifier);
  } else {
    return rename(className);
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = new Array(arguments.length - 2);
    for (var i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  var args = new Array(arguments.length - 2);
  for (var i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
if (!COMPILED) {
  goog.global["COMPILED"] = COMPILED;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor;
  var statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
  return cls;
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    var wrappedCtr = function() {
      var instance = ctr.apply(this, arguments) || this;
      instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
      if (this.constructor === wrappedCtr) {
        Object.seal(instance);
      }
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.provide("goog.dom.NodeType");
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = (new Error).stack;
    if (stack) {
      this.stack = stack;
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg);
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", false);
goog.define("goog.string.FORCE_NON_DOM_HTML_UNESCAPING", false);
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0;
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  var splitParts = str.split("%s");
  var returnString = "";
  var subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length && splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(str) {
  return/^[\s\xa0]*$/.test(str);
};
goog.string.isEmptyString = function(str) {
  return str.length == 0;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
  return str.trim();
} : function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if (test1 < test2) {
    return-1;
  } else {
    if (test1 == test2) {
      return 0;
    } else {
      return 1;
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return-1;
  }
  if (!str2) {
    return 1;
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for (var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }
  return str1 < str2 ? -1 : 1;
};
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;");
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    if (str.indexOf("&") != -1) {
      str = str.replace(goog.string.AMP_RE_, "&amp;");
    }
    if (str.indexOf("<") != -1) {
      str = str.replace(goog.string.LT_RE_, "&lt;");
    }
    if (str.indexOf(">") != -1) {
      str = str.replace(goog.string.GT_RE_, "&gt;");
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, "&quot;");
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;");
    }
    if (str.indexOf("\x00") != -1) {
      str = str.replace(goog.string.NULL_RE_, "&#0;");
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  }
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, "&")) {
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, "&")) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div;
  if (opt_document) {
    div = opt_document.createElement("div");
  } else {
    div = goog.global.document.createElement("div");
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    if (!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if (entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + "...";
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  } else {
    var sb = ['"'];
    for (var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
    }
    sb.push('"');
    return sb.join("");
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    if (cc < 256) {
      rv = "\\x";
      if (cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u";
      if (cc < 4096) {
        rv += "0";
      }
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for (var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (order == 0);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return-1;
  } else {
    if (left > right) {
      return 1;
    }
  }
  return 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmptyOrWhitespace(str)) {
    return NaN;
  }
  return num;
};
goog.string.isLowerCamelCase = function(str) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return/^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  if (isFinite(value)) {
    value = String(value);
  }
  if (goog.isString(value)) {
    return/^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }
  return NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  var parts = str.split(separator);
  var returnVal = [];
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }
  return returnVal;
};
goog.string.editDistance = function(a, b) {
  var v0 = [];
  var v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var i = 0;i < b.length + 1;i++) {
    v0[i] = i;
  }
  for (var i = 0;i < a.length;i++) {
    v1[0] = i + 1;
    for (var j = 0;j < b.length;j++) {
      var cost = a[i] != b[j];
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (var j = 0;j < v0.length;j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.dom.NodeType");
goog.require("goog.string");
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG);
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs;
  } else {
    if (defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs;
    }
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || "unknown type name";
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);
    } else {
      return value === null ? "null" : typeof value;
    }
  }
};
goog.provide("goog.events.EventId");
goog.events.EventId = function(eventId) {
  this.id = eventId;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
goog.provide("goog.events.Listenable");
goog.provide("goog.events.ListenableKey");
goog.require("goog.events.EventId");
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (Math.random() * 1E6 | 0);
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = true;
};
goog.events.Listenable.isImplementedBy = function(obj) {
  return!!(obj && obj[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
};
goog.events.Listenable.prototype.listen;
goog.events.Listenable.prototype.listenOnce;
goog.events.Listenable.prototype.unlisten;
goog.events.Listenable.prototype.unlistenByKey;
goog.events.Listenable.prototype.dispatchEvent;
goog.events.Listenable.prototype.removeAllListeners;
goog.events.Listenable.prototype.getParentEventTarget;
goog.events.Listenable.prototype.fireListeners;
goog.events.Listenable.prototype.getListeners;
goog.events.Listenable.prototype.getListener;
goog.events.Listenable.prototype.hasListener;
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return++goog.events.ListenableKey.counter_;
};
goog.events.ListenableKey.prototype.src;
goog.events.ListenableKey.prototype.type;
goog.events.ListenableKey.prototype.listener;
goog.events.ListenableKey.prototype.capture;
goog.events.ListenableKey.prototype.handler;
goog.events.ListenableKey.prototype.key;
goog.provide("goog.events.Listener");
goog.require("goog.events.ListenableKey");
goog.events.Listener = function(listener, proxy, src, type, capture, opt_handler) {
  if (goog.events.Listener.ENABLE_MONITORING) {
    this.creationStack = (new Error).stack;
  }
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.key = goog.events.ListenableKey.reserveKey();
  this.callOnce = false;
  this.removed = false;
};
goog.define("goog.events.Listener.ENABLE_MONITORING", false);
goog.events.Listener.prototype.creationStack;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = true;
  this.listener = null;
  this.proxy = null;
  this.src = null;
  this.handler = null;
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return true;
    }
  }
  return false;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false;
    }
  }
  return true;
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for (var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if (rv = key in obj) {
    delete obj[key];
  }
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  if (key in obj) {
    return obj[key];
  }
  return opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.setWithReturnValueIfNotSet = function(obj, key, f) {
  if (key in obj) {
    return obj[key];
  }
  var val = f();
  obj[key] = val;
  return val;
};
goog.object.equals = function(a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return false;
    }
  }
  for (var k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
};
goog.object.clone = function(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for (var key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for (var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for (var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  var rv = {};
  for (var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
  return result;
};
goog.object.isImmutableView = function(obj) {
  return!!Object.isFrozen && Object.isFrozen(obj);
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE);
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", false);
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.indexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.lastIndexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i >= 0;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;--i) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      if (f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr);
    }
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  var params = [];
  for (var i = 1, l = arguments.length;i < l;i++) {
    params.push(arguments[i]);
  }
  if (opt_obj) {
    params[0] = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduce.apply(arr, params);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true;
    }
  }
  return false;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false;
    }
  }
  return true;
};
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call(opt_obj, element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;i >= 0;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    if (f.call(opt_obj, val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0;
      var len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (var j = 0;j < len2;j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if (arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start);
  } else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
  }
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;
  var defaultHashFn = function(item) {
    return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
  };
  var hashFn = opt_hashFn || defaultHashFn;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while (left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = compareFn(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  goog.array.sort(arr, stableCompareFn);
  for (var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value;
  }
};
goog.array.sortByKey = function(arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for (var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for (var i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for (var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.inverseDefaultCompare = function(a, b) {
  return-goog.array.defaultCompare(a, b);
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  var buckets = {};
  for (var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }
  if (step * (end - start) < 0) {
    return[];
  }
  if (step > 0) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (var i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  var array = [];
  for (var i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  var CHUNK_SIZE = 8192;
  var result = [];
  for (var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      for (var c = 0;c < element.length;c += CHUNK_SIZE) {
        var chunk = goog.array.slice(element, c, c + CHUNK_SIZE);
        var recurseResult = goog.array.flatten.apply(null, chunk);
        for (var r = 0;r < recurseResult.length;r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if (array.length) {
    n %= array.length;
    if (n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n));
    } else {
      if (n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n));
      }
    }
  }
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return[];
  }
  var result = [];
  for (var i = 0;true;i++) {
    var value = [];
    for (var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if (i >= arr.length) {
        return result;
      }
      value.push(arr[i]);
    }
    result.push(value);
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for (var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.array.copyByIndex = function(arr, index_arr) {
  var result = [];
  goog.array.forEach(index_arr, function(index) {
    result.push(arr[index]);
  });
  return result;
};
goog.provide("goog.events.ListenerMap");
goog.require("goog.array");
goog.require("goog.events.Listener");
goog.require("goog.object");
goog.events.ListenerMap = function(src) {
  this.src = src;
  this.listeners = {};
  this.typeCount_ = 0;
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_;
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
  var count = 0;
  for (var type in this.listeners) {
    count += this.listeners[type].length;
  }
  return count;
};
goog.events.ListenerMap.prototype.add = function(type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  var listenerArray = this.listeners[typeStr];
  if (!listenerArray) {
    listenerArray = this.listeners[typeStr] = [];
    this.typeCount_++;
  }
  var listenerObj;
  var index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    listenerObj = listenerArray[index];
    if (!callOnce) {
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = new goog.events.Listener(listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope);
    listenerObj.callOnce = callOnce;
    listenerArray.push(listenerObj);
  }
  return listenerObj;
};
goog.events.ListenerMap.prototype.remove = function(type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  if (!(typeStr in this.listeners)) {
    return false;
  }
  var listenerArray = this.listeners[typeStr];
  var index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    var listenerObj = listenerArray[index];
    listenerObj.markAsRemoved();
    goog.array.removeAt(listenerArray, index);
    if (listenerArray.length == 0) {
      delete this.listeners[typeStr];
      this.typeCount_--;
    }
    return true;
  }
  return false;
};
goog.events.ListenerMap.prototype.removeByKey = function(listener) {
  var type = listener.type;
  if (!(type in this.listeners)) {
    return false;
  }
  var removed = goog.array.remove(this.listeners[type], listener);
  if (removed) {
    listener.markAsRemoved();
    if (this.listeners[type].length == 0) {
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return removed;
};
goog.events.ListenerMap.prototype.removeAll = function(opt_type) {
  var typeStr = opt_type && opt_type.toString();
  var count = 0;
  for (var type in this.listeners) {
    if (!typeStr || type == typeStr) {
      var listenerArray = this.listeners[type];
      for (var i = 0;i < listenerArray.length;i++) {
        ++count;
        listenerArray[i].markAsRemoved();
      }
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return count;
};
goog.events.ListenerMap.prototype.getListeners = function(type, capture) {
  var listenerArray = this.listeners[type.toString()];
  var rv = [];
  if (listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      var listenerObj = listenerArray[i];
      if (listenerObj.capture == capture) {
        rv.push(listenerObj);
      }
    }
  }
  return rv;
};
goog.events.ListenerMap.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()];
  var i = -1;
  if (listenerArray) {
    i = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, capture, opt_listenerScope);
  }
  return i > -1 ? listenerArray[i] : null;
};
goog.events.ListenerMap.prototype.hasListener = function(opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type);
  var typeStr = hasType ? opt_type.toString() : "";
  var hasCapture = goog.isDef(opt_capture);
  return goog.object.some(this.listeners, function(listenerArray, type) {
    for (var i = 0;i < listenerArray.length;++i) {
      if ((!hasType || listenerArray[i].type == typeStr) && (!hasCapture || listenerArray[i].capture == opt_capture)) {
        return true;
      }
    }
    return false;
  });
};
goog.events.ListenerMap.findListenerIndex_ = function(listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0;i < listenerArray.length;++i) {
    var listenerObj = listenerArray[i];
    if (!listenerObj.removed && listenerObj.listener == listener && listenerObj.capture == !!opt_useCapture && listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return-1;
};
goog.provide("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(userAgent, str);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(userAgent, str);
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  var versionRegExp = new RegExp("(\\w[\\w ]+)" + "/" + "([^\\s]+)" + "\\s*" + "(?:\\((.*?)\\))?", "g");
  var data = [];
  var match;
  while (match = versionRegExp.exec(userAgent)) {
    data.push([match[1], match[2], match[3] || undefined]);
  }
  return data;
};
goog.provide("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPod");
};
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
};
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent("Macintosh");
};
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent("Linux");
};
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent("Windows");
};
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrOS");
};
goog.labs.userAgent.platform.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  var version = "", re;
  if (goog.labs.userAgent.platform.isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/;
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = "0.0";
    }
  } else {
    if (goog.labs.userAgent.platform.isIos()) {
      re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
      var match = re.exec(userAgentString);
      version = match && match[1].replace(/_/g, ".");
    } else {
      if (goog.labs.userAgent.platform.isMacintosh()) {
        re = /Mac OS X ([0-9_.]+)/;
        var match = re.exec(userAgentString);
        version = match ? match[1].replace(/_/g, ".") : "10";
      } else {
        if (goog.labs.userAgent.platform.isAndroid()) {
          re = /Android\s+([^\);]+)(\)|;)/;
          var match = re.exec(userAgentString);
          version = match && match[1];
        } else {
          if (goog.labs.userAgent.platform.isChromeOS()) {
            re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
            var match = re.exec(userAgentString);
            version = match && match[1];
          }
        }
      }
    }
  }
  return version || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version) >= 0;
};
goog.provide("goog.labs.userAgent.browser");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.object");
goog.require("goog.string");
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
};
goog.labs.userAgent.browser.matchCoast_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Coast");
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
  return(goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return(goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchOpera_();
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
  var versionMap = {};
  goog.array.forEach(versionTuples, function(tuple) {
    var key = tuple[0];
    var value = tuple[1];
    versionMap[key] = value;
  });
  var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap);
  function lookUpValueWithKeys(keys) {
    var key = goog.array.find(keys, versionMapHasKey);
    return versionMap[key] || "";
  }
  if (goog.labs.userAgent.browser.isOpera()) {
    return lookUpValueWithKeys(["Version", "Opera", "OPR"]);
  }
  if (goog.labs.userAgent.browser.isChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS"]);
  }
  var tuple = versionTuples[2];
  return tuple && tuple[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version) >= 0;
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "";
  var msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == "7.0") {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
            break;
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};
goog.provide("goog.labs.userAgent.engine");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit");
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident();
};
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
    var engineTuple = tuples[1];
    if (engineTuple) {
      if (engineTuple[0] == "Gecko") {
        return goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox");
      }
      return engineTuple[1];
    }
    var browserTuple = tuples[0];
    var info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version) >= 0;
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair && pair[1] || "";
};
goog.provide("goog.userAgent");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.engine");
goog.require("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.define("goog.userAgent.ASSUME_IE", false);
goog.define("goog.userAgent.ASSUME_GECKO", false);
goog.define("goog.userAgent.ASSUME_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_MOBILE_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_OPERA", false);
goog.define("goog.userAgent.ASSUME_ANY_VERSION", false);
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global["navigator"] || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.define("goog.userAgent.ASSUME_MAC", false);
goog.define("goog.userAgent.ASSUME_WINDOWS", false);
goog.define("goog.userAgent.ASSUME_LINUX", false);
goog.define("goog.userAgent.ASSUME_X11", false);
goog.define("goog.userAgent.ASSUME_ANDROID", false);
goog.define("goog.userAgent.ASSUME_IPHONE", false);
goog.define("goog.userAgent.ASSUME_IPAD", false);
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_ = function() {
  return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.isX11_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return!!navigator && goog.string.contains(navigator["appVersion"] || "", "X11");
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if (goog.userAgent.OPERA && goog.global["opera"]) {
    var operaVersion = goog.global["opera"].version;
    return goog.isFunction(operaVersion) ? operaVersion() : operaVersion;
  }
  if (goog.userAgent.GECKO) {
    re = /rv\:([^\);]+)(\)|;)/;
  } else {
    if (goog.userAgent.IE) {
      re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/;
    } else {
      if (goog.userAgent.WEBKIT) {
        re = /WebKit\/(\S+)/;
      }
    }
  }
  if (re) {
    var arr = re.exec(goog.userAgent.getUserAgentString());
    version = arr ? arr[1] : "";
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global["document"];
  return doc ? doc["documentMode"] : undefined;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0);
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var doc = goog.global["document"];
  if (!doc || !goog.userAgent.IE) {
    return undefined;
  }
  var mode = goog.userAgent.getDocumentMode_();
  return mode || (doc["compatMode"] == "CSS1Compat" ? parseInt(goog.userAgent.VERSION, 10) : 5);
}();
goog.provide("goog.events.BrowserFeature");
goog.require("goog.userAgent");
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global["document"] && document.documentElement && "ontouchstart" in document.documentElement) || !!(goog.global["navigator"] && 
goog.global["navigator"]["msMaxTouchPoints"])};
goog.provide("goog.debug.EntryPointMonitor");
goog.provide("goog.debug.entryPointRegistry");
goog.require("goog.asserts");
goog.debug.EntryPointMonitor = function() {
};
goog.debug.EntryPointMonitor.prototype.wrap;
goog.debug.EntryPointMonitor.prototype.unwrap;
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = false;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    var monitors = goog.debug.entryPointRegistry.monitors_;
    for (var i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = true;
  var transformer = goog.bind(monitor.wrap, monitor);
  for (var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  var transformer = goog.bind(monitor.unwrap, monitor);
  for (var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  monitors.length--;
};
goog.provide("goog.events.EventType");
goog.require("goog.userAgent");
goog.events.getVendorPrefixedName_ = function(eventName) {
  return goog.userAgent.WEBKIT ? "webkit" + eventName : goog.userAgent.OPERA ? "o" + eventName.toLowerCase() : eventName.toLowerCase();
};
goog.events.EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTSTART:"selectstart", WHEEL:"wheel", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", 
CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", 
ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), 
ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", 
MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXT:"text", 
TEXTINPUT:"textInput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", 
DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument", DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified"};
goog.provide("goog.disposable.IDisposable");
goog.disposable.IDisposable = function() {
};
goog.disposable.IDisposable.prototype.dispose = goog.abstractMethod;
goog.disposable.IDisposable.prototype.isDisposed = goog.abstractMethod;
goog.provide("goog.Disposable");
goog.provide("goog.dispose");
goog.provide("goog.disposeAll");
goog.require("goog.disposable.IDisposable");
goog.Disposable = function() {
  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {
      this.creationStack = (new Error).stack;
    }
    goog.Disposable.instances_[goog.getUid(this)] = this;
  }
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.define("goog.Disposable.MONITORING_MODE", 0);
goog.define("goog.Disposable.INCLUDE_STACK_ON_CREATION", true);
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [];
  for (var id in goog.Disposable.instances_) {
    if (goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)]);
    }
  }
  return ret;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = false;
goog.Disposable.prototype.onDisposeCallbacks_;
goog.Disposable.prototype.creationStack;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
      var uid = goog.getUid(this);
      if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw Error(this + " did not call the goog.Disposable base " + "constructor or was disposed of after a clearUndisposedObjects " + "call");
      }
      delete goog.Disposable.instances_[uid];
    }
  }
};
goog.Disposable.prototype.registerDisposable = function(disposable) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));
};
goog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {
  if (this.disposed_) {
    callback.call(opt_scope);
    return;
  }
  if (!this.onDisposeCallbacks_) {
    this.onDisposeCallbacks_ = [];
  }
  this.onDisposeCallbacks_.push(goog.isDef(opt_scope) ? goog.bind(callback, opt_scope) : callback);
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    while (this.onDisposeCallbacks_.length) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(obj) {
  if (obj && typeof obj.isDisposed == "function") {
    return obj.isDisposed();
  }
  return false;
};
goog.dispose = function(obj) {
  if (obj && typeof obj.dispose == "function") {
    obj.dispose();
  }
};
goog.disposeAll = function(var_args) {
  for (var i = 0, len = arguments.length;i < len;++i) {
    var disposable = arguments[i];
    if (goog.isArrayLike(disposable)) {
      goog.disposeAll.apply(null, disposable);
    } else {
      goog.dispose(disposable);
    }
  }
};
goog.provide("goog.events.Event");
goog.provide("goog.events.EventLike");
goog.require("goog.Disposable");
goog.require("goog.events.EventId");
goog.events.EventLike;
goog.events.Event = function(type, opt_target) {
  this.type = type instanceof goog.events.EventId ? String(type) : type;
  this.target = opt_target;
  this.currentTarget = this.target;
  this.propagationStopped_ = false;
  this.defaultPrevented = false;
  this.returnValue_ = true;
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = true;
  this.returnValue_ = false;
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation();
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault();
};
goog.provide("goog.reflect");
goog.reflect.object = function(type, object) {
  return object;
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    goog.reflect.sinkValue(obj[prop]);
    return true;
  } catch (e) {
  }
  return false;
};
goog.provide("goog.events.BrowserEvent");
goog.provide("goog.events.BrowserEvent.MouseButton");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.reflect");
goog.require("goog.userAgent");
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  goog.events.BrowserEvent.base(this, "constructor", opt_e ? opt_e.type : "");
  this.target = null;
  this.currentTarget = null;
  this.relatedTarget = null;
  this.offsetX = 0;
  this.offsetY = 0;
  this.clientX = 0;
  this.clientY = 0;
  this.screenX = 0;
  this.screenY = 0;
  this.button = 0;
  this.keyCode = 0;
  this.charCode = 0;
  this.ctrlKey = false;
  this.altKey = false;
  this.shiftKey = false;
  this.metaKey = false;
  this.state = null;
  this.platformModifierKey = false;
  this.event_ = null;
  if (opt_e) {
    this.init(opt_e, opt_currentTarget);
  }
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  var relevantTouch = null;
  if (type == goog.events.EventType.TOUCHSTART || type == goog.events.EventType.TOUCHMOVE) {
    relevantTouch = e.targetTouches[0];
  } else {
    if (type == goog.events.EventType.TOUCHEND || type == goog.events.EventType.TOUCHCANCEL) {
      relevantTouch = e.changedTouches[0];
    }
  }
  this.target = goog.isNull(relevantTouch) ? (e.target) || e.srcElement : relevantTouch.target;
  this.currentTarget = (opt_currentTarget);
  var relatedTarget = (e.relatedTarget);
  if (relatedTarget) {
    if (goog.userAgent.GECKO) {
      if (!goog.reflect.canAccessProperty(relatedTarget, "nodeName")) {
        relatedTarget = null;
      }
    }
  } else {
    if (type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement;
    } else {
      if (type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement;
      }
    }
  }
  this.relatedTarget = relatedTarget;
  if (!goog.isNull(relevantTouch)) {
    this.clientX = relevantTouch.clientX !== undefined ? relevantTouch.clientX : relevantTouch.pageX;
    this.clientY = relevantTouch.clientY !== undefined ? relevantTouch.clientY : relevantTouch.pageY;
    this.screenX = relevantTouch.screenX || 0;
    this.screenY = relevantTouch.screenY || 0;
  } else {
    this.offsetX = goog.userAgent.WEBKIT || e.offsetX !== undefined ? e.offsetX : e.layerX;
    this.offsetY = goog.userAgent.WEBKIT || e.offsetY !== undefined ? e.offsetY : e.layerY;
    this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
    this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
    this.screenX = e.screenX || 0;
    this.screenY = e.screenY || 0;
  }
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  if (e.defaultPrevented) {
    this.preventDefault();
  }
};
goog.events.BrowserEvent.prototype.isButton = function(button) {
  if (!goog.events.BrowserFeature.HAS_W3C_BUTTON) {
    if (this.type == "click") {
      return button == goog.events.BrowserEvent.MouseButton.LEFT;
    } else {
      return!!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[button]);
    }
  } else {
    return this.event_.button == button;
  }
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if (this.event_.stopPropagation) {
    this.event_.stopPropagation();
  } else {
    this.event_.cancelBubble = true;
  }
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if (!be.preventDefault) {
    be.returnValue = false;
    if (goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        var VK_F1 = 112;
        var VK_F12 = 123;
        if (be.ctrlKey || be.keyCode >= VK_F1 && be.keyCode <= VK_F12) {
          be.keyCode = -1;
        }
      } catch (ex) {
      }
    }
  } else {
    be.preventDefault();
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_;
};
goog.provide("goog.events");
goog.provide("goog.events.CaptureSimulationMode");
goog.provide("goog.events.Key");
goog.provide("goog.events.ListenableType");
goog.require("goog.asserts");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Listenable");
goog.require("goog.events.ListenerMap");
goog.forwardDeclare("goog.debug.ErrorHandler");
goog.forwardDeclare("goog.events.EventWrapper");
goog.events.Key;
goog.events.ListenableType;
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (Math.random() * 1E6 | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.define("goog.events.CAPTURE_SIMULATION_MODE", 2);
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listen((type), listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_((src), (type), listener, false, opt_capt, opt_handler);
  }
};
goog.events.listen_ = function(src, type, listener, callOnce, opt_capt, opt_handler) {
  if (!type) {
    throw Error("Invalid event type");
  }
  var capture = !!opt_capt;
  if (capture && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      goog.asserts.fail("Can not register capture listener in IE8-.");
      return null;
    } else {
      if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
        return null;
      }
    }
  }
  var listenerMap = goog.events.getListenerMap_(src);
  if (!listenerMap) {
    src[goog.events.LISTENER_MAP_PROP_] = listenerMap = new goog.events.ListenerMap(src);
  }
  var listenerObj = listenerMap.add(type, listener, callOnce, opt_capt, opt_handler);
  if (listenerObj.proxy) {
    return listenerObj;
  }
  var proxy = goog.events.getProxy();
  listenerObj.proxy = proxy;
  proxy.src = src;
  proxy.listener = listenerObj;
  if (src.addEventListener) {
    src.addEventListener(type.toString(), proxy, capture);
  } else {
    src.attachEvent(goog.events.getOnString_(type.toString()), proxy);
  }
  goog.events.listenerCountEstimate_++;
  return listenerObj;
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_;
  var f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.listener, eventObject);
  } : function(eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.listener, eventObject);
    if (!v) {
      return v;
    }
  };
  return f;
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listenOnce((type), listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_((src), (type), listener, true, opt_capt, opt_handler);
  }
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten((type), listener, opt_capt, opt_handler);
  }
  if (!src) {
    return false;
  }
  var capture = !!opt_capt;
  var listenerMap = goog.events.getListenerMap_((src));
  if (listenerMap) {
    var listenerObj = listenerMap.getListener((type), listener, capture, opt_handler);
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj);
    }
  }
  return false;
};
goog.events.unlistenByKey = function(key) {
  if (goog.isNumber(key)) {
    return false;
  }
  var listener = (key);
  if (!listener || listener.removed) {
    return false;
  }
  var src = listener.src;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener);
  }
  var type = listener.type;
  var proxy = listener.proxy;
  if (src.removeEventListener) {
    src.removeEventListener(type, proxy, listener.capture);
  } else {
    if (src.detachEvent) {
      src.detachEvent(goog.events.getOnString_(type), proxy);
    }
  }
  goog.events.listenerCountEstimate_--;
  var listenerMap = goog.events.getListenerMap_((src));
  if (listenerMap) {
    listenerMap.removeByKey(listener);
    if (listenerMap.getTypeCount() == 0) {
      listenerMap.src = null;
      src[goog.events.LISTENER_MAP_PROP_] = null;
    }
  } else {
    listener.markAsRemoved();
  }
  return true;
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
};
goog.events.removeAll = function(obj, opt_type) {
  if (!obj) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.removeAllListeners(opt_type);
  }
  var listenerMap = goog.events.getListenerMap_((obj));
  if (!listenerMap) {
    return 0;
  }
  var count = 0;
  var typeStr = opt_type && opt_type.toString();
  for (var type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      var listeners = listenerMap.listeners[type].concat();
      for (var i = 0;i < listeners.length;++i) {
        if (goog.events.unlistenByKey(listeners[i])) {
          ++count;
        }
      }
    }
  }
  return count;
};
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  } else {
    if (!obj) {
      return[];
    }
    var listenerMap = goog.events.getListenerMap_((obj));
    return listenerMap ? listenerMap.getListeners(type, capture) : [];
  }
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  type = (type);
  listener = goog.events.wrapListener(listener);
  var capture = !!opt_capt;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }
  if (!src) {
    return null;
  }
  var listenerMap = goog.events.getListenerMap_((src));
  if (listenerMap) {
    return listenerMap.getListener(type, listener, capture, opt_handler);
  }
  return null;
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }
  var listenerMap = goog.events.getListenerMap_((obj));
  return!!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
};
goog.events.expose = function(e) {
  var str = [];
  for (var key in e) {
    if (e[key] && e[key].id) {
      str.push(key + " = " + e[key] + " (" + e[key].id + ")");
    } else {
      str.push(key + " = " + e[key]);
    }
  }
  return str.join("\n");
};
goog.events.getOnString_ = function(type) {
  if (type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type];
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type;
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.fireListeners(type, capture, eventObject);
  }
  return goog.events.fireListeners_(obj, type, capture, eventObject);
};
goog.events.fireListeners_ = function(obj, type, capture, eventObject) {
  var retval = true;
  var listenerMap = goog.events.getListenerMap_((obj));
  if (listenerMap) {
    var listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      listenerArray = listenerArray.concat();
      for (var i = 0;i < listenerArray.length;i++) {
        var listener = listenerArray[i];
        if (listener && listener.capture == capture && !listener.removed) {
          var result = goog.events.fireListener(listener, eventObject);
          retval = retval && result !== false;
        }
      }
    }
  }
  return retval;
};
goog.events.fireListener = function(listener, eventObject) {
  var listenerFn = listener.listener;
  var listenerHandler = listener.handler || listener.src;
  if (listener.callOnce) {
    goog.events.unlistenByKey(listener);
  }
  return listenerFn.call(listenerHandler, eventObject);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(src, e) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(src), "Can not use goog.events.dispatchEvent with " + "non-goog.events.Listenable instance.");
  return src.dispatchEvent(e);
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_);
};
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  if (listener.removed) {
    return true;
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || (goog.getObjectByName("window.event"));
    var evt = new goog.events.BrowserEvent(ieEvent, this);
    var retval = true;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(ieEvent)) {
        goog.events.markIeEvent_(ieEvent);
        var ancestors = [];
        for (var parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent);
        }
        var type = listener.type;
        for (var i = ancestors.length - 1;!evt.propagationStopped_ && i >= 0;i--) {
          evt.currentTarget = ancestors[i];
          var result = goog.events.fireListeners_(ancestors[i], type, true, evt);
          retval = retval && result;
        }
        for (var i = 0;!evt.propagationStopped_ && i < ancestors.length;i++) {
          evt.currentTarget = ancestors[i];
          var result = goog.events.fireListeners_(ancestors[i], type, false, evt);
          retval = retval && result;
        }
      }
    } else {
      retval = goog.events.fireListener(listener, evt);
    }
    return retval;
  }
  return goog.events.fireListener(listener, new goog.events.BrowserEvent(opt_evt, this));
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = false;
  if (e.keyCode == 0) {
    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = true;
    }
  }
  if (useReturnValue || (e.returnValue) == undefined) {
    e.returnValue = true;
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != undefined;
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_];
  return listenerMap instanceof goog.events.ListenerMap ? listenerMap : null;
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (Math.random() * 1E9 >>> 0);
goog.events.wrapListener = function(listener) {
  goog.asserts.assert(listener, "Listener can not be null.");
  if (goog.isFunction(listener)) {
    return listener;
  }
  goog.asserts.assert(listener.handleEvent, "An object listener must have handleEvent method.");
  if (!listener[goog.events.LISTENER_WRAPPER_PROP_]) {
    listener[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
      return listener.handleEvent(e);
    };
  }
  return listener[goog.events.LISTENER_WRAPPER_PROP_];
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_);
});
goog.provide("goog.math.Size");
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height;
};
goog.math.Size.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.width == b.width && a.height == b.height;
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
};
if (goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")";
  };
}
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height);
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height);
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height;
};
goog.math.Size.prototype.perimeter = function() {
  return(this.width + this.height) * 2;
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height;
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area();
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height;
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Size.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.width *= sx;
  this.height *= sy;
  return this;
};
goog.math.Size.prototype.scaleToCover = function(target) {
  var s = this.aspectRatio() <= target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s);
};
goog.math.Size.prototype.scaleToFit = function(target) {
  var s = this.aspectRatio() > target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s);
};
goog.provide("goog.dom.TagName");
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.provide("goog.fs.url");
goog.fs.url.createObjectUrl = function(blob) {
  return goog.fs.url.getUrlObject_().createObjectURL(blob);
};
goog.fs.url.revokeObjectUrl = function(url) {
  goog.fs.url.getUrlObject_().revokeObjectURL(url);
};
goog.fs.url.UrlObject_;
goog.fs.url.getUrlObject_ = function() {
  var urlObject = goog.fs.url.findUrlObject_();
  if (urlObject != null) {
    return urlObject;
  } else {
    throw Error("This browser doesn't seem to support blob URLs");
  }
};
goog.fs.url.findUrlObject_ = function() {
  if (goog.isDef(goog.global.URL) && goog.isDef(goog.global.URL.createObjectURL)) {
    return(goog.global.URL);
  } else {
    if (goog.isDef(goog.global.webkitURL) && goog.isDef(goog.global.webkitURL.createObjectURL)) {
      return(goog.global.webkitURL);
    } else {
      if (goog.isDef(goog.global.createObjectURL)) {
        return(goog.global);
      } else {
        return null;
      }
    }
  }
};
goog.fs.url.browserSupportsObjectUrls = function() {
  return goog.fs.url.findUrlObject_() != null;
};
goog.provide("goog.string.TypedString");
goog.string.TypedString = function() {
};
goog.string.TypedString.prototype.implementsGoogStringTypedString;
goog.string.TypedString.prototype.getTypedStringValue;
goog.provide("goog.string.Const");
goog.require("goog.asserts");
goog.require("goog.string.TypedString");
goog.string.Const = function() {
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "";
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_;
};
goog.string.Const.prototype.implementsGoogStringTypedString = true;
goog.string.Const.prototype.getTypedStringValue = function() {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
};
goog.string.Const.prototype.toString = function() {
  return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}";
};
goog.string.Const.unwrap = function(stringConst) {
  if (stringConst instanceof goog.string.Const && stringConst.constructor === goog.string.Const && stringConst.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_) {
    return stringConst.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  } else {
    goog.asserts.fail("expected object of type Const, got '" + stringConst + "'");
    return "type_error:Const";
  }
};
goog.string.Const.from = function(s) {
  return goog.string.Const.create__googStringSecurityPrivate_(s);
};
goog.string.Const.TYPE_MARKER_ = {};
goog.string.Const.create__googStringSecurityPrivate_ = function(s) {
  var stringConst = new goog.string.Const;
  stringConst.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = s;
  return stringConst;
};
goog.provide("goog.i18n.bidi");
goog.provide("goog.i18n.bidi.Dir");
goog.provide("goog.i18n.bidi.DirectionalString");
goog.provide("goog.i18n.bidi.Format");
goog.define("goog.i18n.bidi.FORCE_RTL", false);
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || (goog.LOCALE.substring(0, 2).toLowerCase() == "ar" || goog.LOCALE.substring(0, 2).toLowerCase() == "fa" || goog.LOCALE.substring(0, 2).toLowerCase() == "he" || goog.LOCALE.substring(0, 2).toLowerCase() == "iw" || goog.LOCALE.substring(0, 2).toLowerCase() == "ps" || goog.LOCALE.substring(0, 2).toLowerCase() == "sd" || goog.LOCALE.substring(0, 2).toLowerCase() == "ug" || goog.LOCALE.substring(0, 2).toLowerCase() == "ur" || goog.LOCALE.substring(0, 
2).toLowerCase() == "yi") && (goog.LOCALE.length == 2 || goog.LOCALE.substring(2, 3) == "-" || goog.LOCALE.substring(2, 3) == "_") || goog.LOCALE.length >= 3 && goog.LOCALE.substring(0, 3).toLowerCase() == "ckb" && (goog.LOCALE.length == 3 || goog.LOCALE.substring(3, 4) == "-" || goog.LOCALE.substring(3, 4) == "_");
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {LTR:1, RTL:-1, NEUTRAL:0};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(givenDir, opt_noNeutral) {
  if (typeof givenDir == "number") {
    return givenDir > 0 ? goog.i18n.bidi.Dir.LTR : givenDir < 0 ? goog.i18n.bidi.Dir.RTL : opt_noNeutral ? null : goog.i18n.bidi.Dir.NEUTRAL;
  } else {
    if (givenDir == null) {
      return null;
    } else {
      return givenDir ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
    }
  }
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff" + "\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(str, opt_isStripNeeded) {
  return opt_isStripNeeded ? str.replace(goog.i18n.bidi.htmlSkipReg_, "") : str;
};
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(str) {
  return goog.i18n.bidi.rtlRe_.test(str);
};
goog.i18n.bidi.isLtrChar = function(str) {
  return goog.i18n.bidi.ltrRe_.test(str);
};
goog.i18n.bidi.isNeutralChar = function(str) {
  return!goog.i18n.bidi.isLtrChar(str) && !goog.i18n.bidi.isRtlChar(str);
};
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(str, opt_isHtml) {
  str = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml);
  return goog.i18n.bidi.isRequiredLtrRe_.test(str) || !goog.i18n.bidi.hasAnyLtr(str) && !goog.i18n.bidi.hasAnyRtl(str);
};
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = new RegExp("^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|" + ".*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))" + "(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i");
goog.i18n.bidi.isRtlLanguage = function(lang) {
  return goog.i18n.bidi.rtlLocalesRe_.test(lang);
};
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInHtml = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ? goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  if (useRtl) {
    return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>");
  }
  return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>");
};
goog.i18n.bidi.guardBracketInText = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ? goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  var mark = useRtl ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return s.replace(goog.i18n.bidi.bracketGuardTextRe_, mark + "$&" + mark);
};
goog.i18n.bidi.enforceRtlInHtml = function(html) {
  if (html.charAt(0) == "<") {
    return html.replace(/<\w+/, "$& dir=rtl");
  }
  return "\n<span dir=rtl>" + html + "</span>";
};
goog.i18n.bidi.enforceRtlInText = function(text) {
  return goog.i18n.bidi.Format.RLE + text + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.enforceLtrInHtml = function(html) {
  if (html.charAt(0) == "<") {
    return html.replace(/<\w+/, "$& dir=ltr");
  }
  return "\n<span dir=ltr>" + html + "</span>";
};
goog.i18n.bidi.enforceLtrInText = function(text) {
  return goog.i18n.bidi.Format.LRE + text + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(cssStr) {
  return cssStr.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT);
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(str) {
  return str.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3");
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /\d/;
goog.i18n.bidi.rtlDetectionThreshold_ = .4;
goog.i18n.bidi.estimateDirection = function(str, opt_isHtml) {
  var rtlCount = 0;
  var totalCount = 0;
  var hasWeaklyLtr = false;
  var tokens = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml).split(goog.i18n.bidi.wordSeparatorRe_);
  for (var i = 0;i < tokens.length;i++) {
    var token = tokens[i];
    if (goog.i18n.bidi.startsWithRtl(token)) {
      rtlCount++;
      totalCount++;
    } else {
      if (goog.i18n.bidi.isRequiredLtrRe_.test(token)) {
        hasWeaklyLtr = true;
      } else {
        if (goog.i18n.bidi.hasAnyLtr(token)) {
          totalCount++;
        } else {
          if (goog.i18n.bidi.hasNumeralsRe_.test(token)) {
            hasWeaklyLtr = true;
          }
        }
      }
    }
  }
  return totalCount == 0 ? hasWeaklyLtr ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : rtlCount / totalCount > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.detectRtlDirectionality = function(str, opt_isHtml) {
  return goog.i18n.bidi.estimateDirection(str, opt_isHtml) == goog.i18n.bidi.Dir.RTL;
};
goog.i18n.bidi.setElementDirAndAlign = function(element, dir) {
  if (element) {
    dir = goog.i18n.bidi.toDir(dir);
    if (dir) {
      element.style.textAlign = dir == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
      element.dir = dir == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr";
    }
  }
};
goog.i18n.bidi.DirectionalString = function() {
};
goog.i18n.bidi.DirectionalString.prototype.implementsGoogI18nBidiDirectionalString;
goog.i18n.bidi.DirectionalString.prototype.getDirection;
goog.provide("goog.html.SafeUrl");
goog.require("goog.asserts");
goog.require("goog.fs.url");
goog.require("goog.i18n.bidi.Dir");
goog.require("goog.i18n.bidi.DirectionalString");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeUrl = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = true;
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = true;
goog.html.SafeUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
if (goog.DEBUG) {
  goog.html.SafeUrl.prototype.toString = function() {
    return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
  };
}
goog.html.SafeUrl.unwrap = function(safeUrl) {
  if (safeUrl instanceof goog.html.SafeUrl && safeUrl.constructor === goog.html.SafeUrl && safeUrl.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeUrl, got '" + safeUrl + "'");
    return "type_error:SafeUrl";
  }
};
goog.html.SafeUrl.fromConstant = function(url) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(url));
};
goog.html.SAFE_BLOB_TYPE_PATTERN_ = /^image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)$/i;
goog.html.SafeUrl.fromBlob = function(blob) {
  var url = goog.html.SAFE_BLOB_TYPE_PATTERN_.test(blob.type) ? goog.fs.url.createObjectUrl(blob) : goog.html.SafeUrl.INNOCUOUS_STRING;
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i;
goog.html.SafeUrl.sanitize = function(url) {
  if (url instanceof goog.html.SafeUrl) {
    return url;
  } else {
    if (url.implementsGoogStringTypedString) {
      url = url.getTypedStringValue();
    } else {
      url = String(url);
    }
  }
  if (!goog.html.SAFE_URL_PATTERN_.test(url)) {
    url = goog.html.SafeUrl.INNOCUOUS_STRING;
  } else {
    url = goog.html.SafeUrl.normalize_(url);
  }
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.SafeUrl.normalize_ = function(url) {
  try {
    var normalized = encodeURI(url);
  } catch (e) {
    return goog.html.SafeUrl.INNOCUOUS_STRING;
  }
  return normalized.replace(goog.html.SafeUrl.NORMALIZE_MATCHER_, function(match) {
    return goog.html.SafeUrl.NORMALIZE_REPLACER_MAP_[match];
  });
};
goog.html.SafeUrl.NORMALIZE_MATCHER_ = /[()']|%5B|%5D|%25/g;
goog.html.SafeUrl.NORMALIZE_REPLACER_MAP_ = {"'":"%27", "(":"%28", ")":"%29", "%5B":"[", "%5D":"]", "%25":"%"};
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function(url) {
  var safeUrl = new goog.html.SafeUrl;
  safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = url;
  return safeUrl;
};
goog.provide("goog.dom.tags");
goog.require("goog.object");
goog.dom.tags.VOID_TAGS_ = goog.object.createSet(("area,base,br,col,command," + "embed,hr,img,input,keygen,link,meta,param,source,track,wbr").split(","));
goog.dom.tags.isVoidTag = function(tagName) {
  return goog.dom.tags.VOID_TAGS_[tagName] === true;
};
goog.provide("goog.html.SafeStyle");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeStyle = function() {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
  this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = true;
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyle.fromConstant = function(style) {
  var styleString = goog.string.Const.unwrap(style);
  if (styleString.length === 0) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(styleString);
  goog.asserts.assert(goog.string.endsWith(styleString, ";"), "Last character of style string is not ';': " + styleString);
  goog.asserts.assert(goog.string.contains(styleString, ":"), "Style string must contain at least one ':', to " + 'specify a "name: value" pair: ' + styleString);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(styleString);
};
goog.html.SafeStyle.checkStyle_ = function(style) {
  goog.asserts.assert(!/[<>]/.test(style), "Forbidden characters in style string: " + style);
};
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeStyle.prototype.toString = function() {
    return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}";
  };
}
goog.html.SafeStyle.unwrap = function(safeStyle) {
  if (safeStyle instanceof goog.html.SafeStyle && safeStyle.constructor === goog.html.SafeStyle && safeStyle.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeStyle, got '" + safeStyle + "'");
    return "type_error:SafeStyle";
  }
};
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function(style) {
  return(new goog.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(style);
};
goog.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(style) {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = style;
  return this;
};
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
goog.html.SafeStyle.PropertyMap;
goog.html.SafeStyle.create = function(map) {
  var style = "";
  for (var name in map) {
    if (!/^[-_a-zA-Z0-9]+$/.test(name)) {
      throw Error("Name allows only [-_a-zA-Z0-9], got: " + name);
    }
    var value = map[name];
    if (value == null) {
      continue;
    }
    if (value instanceof goog.string.Const) {
      value = goog.string.Const.unwrap(value);
      goog.asserts.assert(!/[{;}]/.test(value), "Value does not allow [{;}].");
    } else {
      if (!goog.html.SafeStyle.VALUE_RE_.test(value)) {
        goog.asserts.fail("String value allows only [-,.\"'%_!# a-zA-Z0-9], got: " + value);
        value = goog.html.SafeStyle.INNOCUOUS_STRING;
      } else {
        if (!goog.html.SafeStyle.hasBalancedQuotes_(value)) {
          goog.asserts.fail("String value requires balanced quotes, got: " + value);
          value = goog.html.SafeStyle.INNOCUOUS_STRING;
        }
      }
    }
    style += name + ":" + value + ";";
  }
  if (!style) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(style);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.html.SafeStyle.hasBalancedQuotes_ = function(value) {
  var outsideSingle = true;
  var outsideDouble = true;
  for (var i = 0;i < value.length;i++) {
    var c = value.charAt(i);
    if (c == "'" && outsideDouble) {
      outsideSingle = !outsideSingle;
    } else {
      if (c == '"' && outsideSingle) {
        outsideDouble = !outsideDouble;
      }
    }
  }
  return outsideSingle && outsideDouble;
};
goog.html.SafeStyle.VALUE_RE_ = /^[-,."'%_!# a-zA-Z0-9]+$/;
goog.html.SafeStyle.concat = function(var_args) {
  var style = "";
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      style += goog.html.SafeStyle.unwrap(argument);
    }
  };
  goog.array.forEach(arguments, addArgument);
  if (!style) {
    return goog.html.SafeStyle.EMPTY;
  }
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.provide("goog.html.TrustedResourceUrl");
goog.require("goog.asserts");
goog.require("goog.i18n.bidi.Dir");
goog.require("goog.i18n.bidi.DirectionalString");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.TrustedResourceUrl = function() {
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
  this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = true;
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = true;
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
if (goog.DEBUG) {
  goog.html.TrustedResourceUrl.prototype.toString = function() {
    return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}";
  };
}
goog.html.TrustedResourceUrl.unwrap = function(trustedResourceUrl) {
  if (trustedResourceUrl instanceof goog.html.TrustedResourceUrl && trustedResourceUrl.constructor === goog.html.TrustedResourceUrl && trustedResourceUrl.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return trustedResourceUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + trustedResourceUrl + "'");
    return "type_error:TrustedResourceUrl";
  }
};
goog.html.TrustedResourceUrl.fromConstant = function(url) {
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(url));
};
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(url) {
  var trustedResourceUrl = new goog.html.TrustedResourceUrl;
  trustedResourceUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = url;
  return trustedResourceUrl;
};
goog.provide("goog.html.SafeStyleSheet");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeStyleSheet = function() {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
  this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = true;
goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyleSheet.concat = function(var_args) {
  var result = "";
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      result += goog.html.SafeStyleSheet.unwrap(argument);
    }
  };
  goog.array.forEach(arguments, addArgument);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(result);
};
goog.html.SafeStyleSheet.fromConstant = function(styleSheet) {
  var styleSheetString = goog.string.Const.unwrap(styleSheet);
  if (styleSheetString.length === 0) {
    return goog.html.SafeStyleSheet.EMPTY;
  }
  goog.asserts.assert(!goog.string.contains(styleSheetString, "<"), "Forbidden '<' character in style sheet string: " + styleSheetString);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheetString);
};
goog.html.SafeStyleSheet.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeStyleSheet.prototype.toString = function() {
    return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}";
  };
}
goog.html.SafeStyleSheet.unwrap = function(safeStyleSheet) {
  if (safeStyleSheet instanceof goog.html.SafeStyleSheet && safeStyleSheet.constructor === goog.html.SafeStyleSheet && safeStyleSheet.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeStyleSheet.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeStyleSheet, got '" + safeStyleSheet + "'");
    return "type_error:SafeStyleSheet";
  }
};
goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function(styleSheet) {
  return(new goog.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(styleSheet);
};
goog.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(styleSheet) {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = styleSheet;
  return this;
};
goog.html.SafeStyleSheet.EMPTY = goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");
goog.provide("goog.html.SafeHtml");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom.tags");
goog.require("goog.html.SafeStyle");
goog.require("goog.html.SafeStyleSheet");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.TrustedResourceUrl");
goog.require("goog.i18n.bidi.Dir");
goog.require("goog.i18n.bidi.DirectionalString");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeHtml = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  this.dir_ = null;
};
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = true;
goog.html.SafeHtml.prototype.getDirection = function() {
  return this.dir_;
};
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = true;
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeHtml.prototype.toString = function() {
    return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
  };
}
goog.html.SafeHtml.unwrap = function(safeHtml) {
  if (safeHtml instanceof goog.html.SafeHtml && safeHtml.constructor === goog.html.SafeHtml && safeHtml.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeHtml.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeHtml, got '" + safeHtml + "'");
    return "type_error:SafeHtml";
  }
};
goog.html.SafeHtml.TextOrHtml_;
goog.html.SafeHtml.htmlEscape = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var dir = null;
  if (textOrHtml.implementsGoogI18nBidiDirectionalString) {
    dir = textOrHtml.getDirection();
  }
  var textAsString;
  if (textOrHtml.implementsGoogStringTypedString) {
    textAsString = textOrHtml.getTypedStringValue();
  } else {
    textAsString = String(textOrHtml);
  }
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.htmlEscape(textAsString), dir);
};
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var html = goog.html.SafeHtml.htmlEscape(textOrHtml);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(html)), html.getDirection());
};
goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var html = goog.html.SafeHtml.htmlEscape(textOrHtml);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.whitespaceEscape(goog.html.SafeHtml.unwrap(html)), html.getDirection());
};
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
goog.html.SafeHtml.URL_ATTRIBUTES_ = goog.object.createSet("action", "cite", "data", "formaction", "href", "manifest", "poster", "src");
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = goog.object.createSet("embed", "iframe", "link", "object", "script", "style", "template");
goog.html.SafeHtml.AttributeValue_;
goog.html.SafeHtml.create = function(tagName, opt_attributes, opt_content) {
  if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(tagName)) {
    throw Error("Invalid tag name <" + tagName + ">.");
  }
  if (tagName.toLowerCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
    throw Error("Tag name <" + tagName + "> is not allowed for SafeHtml.");
  }
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(tagName, opt_attributes, opt_content);
};
goog.html.SafeHtml.createIframe = function(opt_src, opt_srcdoc, opt_attributes, opt_content) {
  var fixedAttributes = {};
  fixedAttributes["src"] = opt_src || null;
  fixedAttributes["srcdoc"] = opt_srcdoc || null;
  var defaultAttributes = {"sandbox":""};
  var attributes = goog.html.SafeHtml.combineAttributes(fixedAttributes, defaultAttributes, opt_attributes);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", attributes, opt_content);
};
goog.html.SafeHtml.createStyle = function(styleSheet, opt_attributes) {
  var fixedAttributes = {"type":"text/css"};
  var defaultAttributes = {};
  var attributes = goog.html.SafeHtml.combineAttributes(fixedAttributes, defaultAttributes, opt_attributes);
  var content = "";
  styleSheet = goog.array.concat(styleSheet);
  for (var i = 0;i < styleSheet.length;i++) {
    content += goog.html.SafeStyleSheet.unwrap(styleSheet[i]);
  }
  var htmlContent = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(content, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", attributes, htmlContent);
};
goog.html.SafeHtml.getAttrNameAndValue_ = function(tagName, name, value) {
  if (value instanceof goog.string.Const) {
    value = goog.string.Const.unwrap(value);
  } else {
    if (name.toLowerCase() == "style") {
      value = goog.html.SafeHtml.getStyleValue_(value);
    } else {
      if (/^on/i.test(name)) {
        throw Error('Attribute "' + name + '" requires goog.string.Const value, "' + value + '" given.');
      } else {
        if (name.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) {
          if (value instanceof goog.html.TrustedResourceUrl) {
            value = goog.html.TrustedResourceUrl.unwrap(value);
          } else {
            if (value instanceof goog.html.SafeUrl) {
              value = goog.html.SafeUrl.unwrap(value);
            } else {
              throw Error('Attribute "' + name + '" on tag "' + tagName + '" requires goog.html.SafeUrl or goog.string.Const value, "' + value + '" given.');
            }
          }
        }
      }
    }
  }
  if (value.implementsGoogStringTypedString) {
    value = value.getTypedStringValue();
  }
  goog.asserts.assert(goog.isString(value) || goog.isNumber(value), "String or number value expected, got " + typeof value + " with value: " + value);
  return name + '="' + goog.string.htmlEscape(String(value)) + '"';
};
goog.html.SafeHtml.getStyleValue_ = function(value) {
  if (!goog.isObject(value)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map ' + "of style properties, " + typeof value + " given: " + value);
  }
  if (!(value instanceof goog.html.SafeStyle)) {
    value = goog.html.SafeStyle.create(value);
  }
  return goog.html.SafeStyle.unwrap(value);
};
goog.html.SafeHtml.createWithDir = function(dir, tagName, opt_attributes, opt_content) {
  var html = goog.html.SafeHtml.create(tagName, opt_attributes, opt_content);
  html.dir_ = dir;
  return html;
};
goog.html.SafeHtml.concat = function(var_args) {
  var dir = goog.i18n.bidi.Dir.NEUTRAL;
  var content = "";
  var addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      var html = goog.html.SafeHtml.htmlEscape(argument);
      content += goog.html.SafeHtml.unwrap(html);
      var htmlDir = html.getDirection();
      if (dir == goog.i18n.bidi.Dir.NEUTRAL) {
        dir = htmlDir;
      } else {
        if (htmlDir != goog.i18n.bidi.Dir.NEUTRAL && dir != htmlDir) {
          dir = null;
        }
      }
    }
  };
  goog.array.forEach(arguments, addArgument);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(content, dir);
};
goog.html.SafeHtml.concatWithDir = function(dir, var_args) {
  var html = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
  html.dir_ = dir;
  return html;
};
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function(html, dir) {
  return(new goog.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(html, dir);
};
goog.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(html, dir) {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = html;
  this.dir_ = dir;
  return this;
};
goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function(tagName, opt_attributes, opt_content) {
  var dir = null;
  var result = "<" + tagName;
  if (opt_attributes) {
    for (var name in opt_attributes) {
      if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(name)) {
        throw Error('Invalid attribute name "' + name + '".');
      }
      var value = opt_attributes[name];
      if (!goog.isDefAndNotNull(value)) {
        continue;
      }
      result += " " + goog.html.SafeHtml.getAttrNameAndValue_(tagName, name, value);
    }
  }
  var content = opt_content;
  if (!goog.isDef(content)) {
    content = [];
  } else {
    if (!goog.isArray(content)) {
      content = [content];
    }
  }
  if (goog.dom.tags.isVoidTag(tagName.toLowerCase())) {
    goog.asserts.assert(!content.length, "Void tag <" + tagName + "> does not allow content.");
    result += ">";
  } else {
    var html = goog.html.SafeHtml.concat(content);
    result += ">" + goog.html.SafeHtml.unwrap(html) + "</" + tagName + ">";
    dir = html.getDirection();
  }
  var dirAttribute = opt_attributes && opt_attributes["dir"];
  if (dirAttribute) {
    if (/^(ltr|rtl|auto)$/i.test(dirAttribute)) {
      dir = goog.i18n.bidi.Dir.NEUTRAL;
    } else {
      dir = null;
    }
  }
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(result, dir);
};
goog.html.SafeHtml.combineAttributes = function(fixedAttributes, defaultAttributes, opt_attributes) {
  var combinedAttributes = {};
  var name;
  for (name in fixedAttributes) {
    goog.asserts.assert(name.toLowerCase() == name, "Must be lower case");
    combinedAttributes[name] = fixedAttributes[name];
  }
  for (name in defaultAttributes) {
    goog.asserts.assert(name.toLowerCase() == name, "Must be lower case");
    combinedAttributes[name] = defaultAttributes[name];
  }
  for (name in opt_attributes) {
    var nameLower = name.toLowerCase();
    if (nameLower in fixedAttributes) {
      throw Error('Cannot override "' + nameLower + '" attribute, got "' + name + '" with value "' + opt_attributes[name] + '"');
    }
    if (nameLower in defaultAttributes) {
      delete combinedAttributes[nameLower];
    }
    combinedAttributes[name] = opt_attributes[name];
  }
  return combinedAttributes;
};
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", goog.i18n.bidi.Dir.NEUTRAL);
goog.provide("goog.dom.safe");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeUrl");
goog.dom.safe.setInnerHtml = function(elem, html) {
  elem.innerHTML = goog.html.SafeHtml.unwrap(html);
};
goog.dom.safe.setOuterHtml = function(elem, html) {
  elem.outerHTML = goog.html.SafeHtml.unwrap(html);
};
goog.dom.safe.documentWrite = function(doc, html) {
  doc.write(goog.html.SafeHtml.unwrap(html));
};
goog.dom.safe.setAnchorHref = function(anchor, url) {
  var safeUrl;
  if (url instanceof goog.html.SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = goog.html.SafeUrl.sanitize(url);
  }
  anchor.href = goog.html.SafeUrl.unwrap(safeUrl);
};
goog.dom.safe.setLocationHref = function(loc, url) {
  var safeUrl;
  if (url instanceof goog.html.SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = goog.html.SafeUrl.sanitize(url);
  }
  loc.href = goog.html.SafeUrl.unwrap(safeUrl);
};
goog.provide("goog.dom.BrowserFeature");
goog.require("goog.userAgent");
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE, LEGACY_IE_RANGES:goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)};
goog.provide("goog.math");
goog.require("goog.array");
goog.require("goog.asserts");
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1E-6);
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
};
goog.math.standardAngleInRadians = function(angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
  return angleRadians * 180 / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  if (d > 180) {
    d = d - 360;
  } else {
    if (d <= -180) {
      d = 360 + d;
    }
  }
  return d;
};
goog.math.sign = function(x) {
  return x == 0 ? 0 : x < 0 ? -1 : 1;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function(a, b) {
    return a == b;
  };
  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1];
  };
  var length1 = array1.length;
  var length2 = array2.length;
  var arr = [];
  for (var i = 0;i < length1 + 1;i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  }
  var result = [];
  var i = length1, j = length2;
  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
  }
  return result;
};
goog.math.sum = function(var_args) {
  return(goog.array.reduce(arguments, function(sum, value) {
    return sum + value;
  }, 0));
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
  var sampleSize = arguments.length;
  if (sampleSize < 2) {
    return 0;
  }
  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
  return variance;
};
goog.math.standardDeviation = function(var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
  return isFinite(num) && num % 1 == 0;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.log10Floor = function(num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat("1e" + x) > num);
  }
  return num == 0 ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2E-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2E-15));
};
goog.provide("goog.math.Coordinate");
goog.require("goog.math");
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0;
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};
if (goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
  };
}
goog.math.Coordinate.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.x == b.x && a.y == b.y;
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy;
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
goog.math.Coordinate.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.x += tx.x;
    this.y += tx.y;
  } else {
    this.x += tx;
    if (goog.isNumber(opt_ty)) {
      this.y += opt_ty;
    }
  }
  return this;
};
goog.math.Coordinate.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.x *= sx;
  this.y *= sy;
  return this;
};
goog.math.Coordinate.prototype.rotateRadians = function(radians, opt_center) {
  var center = opt_center || new goog.math.Coordinate(0, 0);
  var x = this.x;
  var y = this.y;
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  this.x = (x - center.x) * cos - (y - center.y) * sin + center.x;
  this.y = (x - center.x) * sin + (y - center.y) * cos + center.y;
};
goog.math.Coordinate.prototype.rotateDegrees = function(degrees, opt_center) {
  this.rotateRadians(goog.math.toRadians(degrees), opt_center);
};
goog.provide("goog.dom");
goog.provide("goog.dom.Appendable");
goog.provide("goog.dom.DomHelper");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom.BrowserFeature");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.require("goog.dom.safe");
goog.require("goog.html.SafeHtml");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.string.Unicode");
goog.require("goog.userAgent");
goog.define("goog.dom.ASSUME_QUIRKS_MODE", false);
goog.define("goog.dom.ASSUME_STANDARDS_MODE", false);
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper);
};
goog.dom.defaultDomHelper_;
goog.dom.getDocument = function() {
  return document;
};
goog.dom.getElement = function(element) {
  return goog.dom.getElementHelper_(document, element);
};
goog.dom.getElementHelper_ = function(doc, element) {
  return goog.isString(element) ? doc.getElementById(element) : element;
};
goog.dom.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(document, id);
};
goog.dom.getRequiredElementHelper_ = function(doc, id) {
  goog.asserts.assertString(id);
  var element = goog.dom.getElementHelper_(doc, id);
  element = goog.asserts.assertElement(element, "No element found with id: " + id);
  return element;
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el);
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  if (goog.dom.canUseQuerySelector_(parent)) {
    return parent.querySelectorAll("." + className);
  }
  return goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el);
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if (parent.getElementsByClassName) {
    retVal = parent.getElementsByClassName(className)[0];
  } else {
    if (goog.dom.canUseQuerySelector_(parent)) {
      retVal = parent.querySelector("." + className);
    } else {
      retVal = goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)[0];
    }
  }
  return retVal || null;
};
goog.dom.getRequiredElementByClass = function(className, opt_root) {
  var retValue = goog.dom.getElementByClass(className, opt_root);
  return goog.asserts.assert(retValue, "No element found with className: " + className);
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return!!(parent.querySelectorAll && parent.querySelector);
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tagName = opt_tag && opt_tag != "*" ? opt_tag.toUpperCase() : "";
  if (goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? "." + opt_class : "");
    return parent.querySelectorAll(query);
  }
  if (opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if (tagName) {
      var arrayLike = {};
      var len = 0;
      for (var i = 0, el;el = els[i];i++) {
        if (tagName == el.nodeName) {
          arrayLike[len++] = el;
        }
      }
      arrayLike.length = len;
      return arrayLike;
    } else {
      return els;
    }
  }
  var els = parent.getElementsByTagName(tagName || "*");
  if (opt_class) {
    var arrayLike = {};
    var len = 0;
    for (var i = 0, el;el = els[i];i++) {
      var className = el.className;
      if (typeof className.split == "function" && goog.array.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el;
      }
    }
    arrayLike.length = len;
    return arrayLike;
  } else {
    return els;
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if (key == "style") {
      element.style.cssText = val;
    } else {
      if (key == "class") {
        element.className = val;
      } else {
        if (key == "for") {
          element.htmlFor = val;
        } else {
          if (key in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
            element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val);
          } else {
            if (goog.string.startsWith(key, "aria-") || goog.string.startsWith(key, "data-")) {
              element.setAttribute(key, val);
            } else {
              element[key] = val;
            }
          }
        }
      }
    }
  });
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {"cellpadding":"cellPadding", "cellspacing":"cellSpacing", "colspan":"colSpan", "frameborder":"frameBorder", "height":"height", "maxlength":"maxLength", "role":"role", "rowspan":"rowSpan", "type":"type", "usemap":"useMap", "valign":"vAlign", "width":"width"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window);
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document;
  var el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight);
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document;
  var height = 0;
  if (doc) {
    var body = doc.body;
    var docEl = doc.documentElement;
    if (!(docEl && body)) {
      return 0;
    }
    var vh = goog.dom.getViewportSize_(win).height;
    if (goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight;
    } else {
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if (docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight;
      }
      if (sh > vh) {
        height = sh > oh ? sh : oh;
      } else {
        height = sh < oh ? sh : oh;
      }
    }
  }
  return height;
};
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll();
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc);
  var win = goog.dom.getWindow_(doc);
  if (goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && win.pageYOffset != el.scrollTop) {
    return new goog.math.Coordinate(el.scrollLeft, el.scrollTop);
  }
  return new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop);
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  if (!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc)) {
    return doc.documentElement;
  }
  return doc.body || doc.documentElement;
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window;
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView;
};
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments);
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0];
  var attributes = args[1];
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    if (attributes.name) {
      tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"');
    }
    if (attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      delete clone["type"];
      attributes = clone;
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("");
  }
  var element = doc.createElement(tagName);
  if (attributes) {
    if (goog.isString(attributes)) {
      element.className = attributes;
    } else {
      if (goog.isArray(attributes)) {
        element.className = attributes.join(" ");
      } else {
        goog.dom.setProperties(element, attributes);
      }
    }
  }
  if (args.length > 2) {
    goog.dom.append_(doc, element, args, 2);
  }
  return element;
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    if (child) {
      parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child);
    }
  }
  for (var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    if (goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg)) {
      goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.toArray(arg) : arg, childHandler);
    } else {
      childHandler(arg);
    }
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return document.createElement(name);
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(String(content));
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  var table = (doc.createElement(goog.dom.TagName.TABLE));
  var tbody = table.appendChild(doc.createElement(goog.dom.TagName.TBODY));
  for (var i = 0;i < rows;i++) {
    var tr = doc.createElement(goog.dom.TagName.TR);
    for (var j = 0;j < columns;j++) {
      var td = doc.createElement(goog.dom.TagName.TD);
      if (fillWithNbsp) {
        goog.dom.setTextContent(td, goog.string.Unicode.NBSP);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  return table;
};
goog.dom.safeHtmlToNode = function(html) {
  return goog.dom.safeHtmlToNode_(document, html);
};
goog.dom.safeHtmlToNode_ = function(doc, html) {
  var tempDiv = doc.createElement("div");
  if (goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    goog.dom.safe.setInnerHtml(tempDiv, goog.html.SafeHtml.concat(goog.html.SafeHtml.create("br"), html));
    tempDiv.removeChild(tempDiv.firstChild);
  } else {
    goog.dom.safe.setInnerHtml(tempDiv, html);
  }
  return goog.dom.childrenToNode_(doc, tempDiv);
};
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString);
};
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement("div");
  if (goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    tempDiv.innerHTML = "<br>" + htmlString;
    tempDiv.removeChild(tempDiv.firstChild);
  } else {
    tempDiv.innerHTML = htmlString;
  }
  return goog.dom.childrenToNode_(doc, tempDiv);
};
goog.dom.childrenToNode_ = function(doc, tempDiv) {
  if (tempDiv.childNodes.length == 1) {
    return tempDiv.removeChild(tempDiv.firstChild);
  } else {
    var fragment = doc.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    return fragment;
  }
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
};
goog.dom.isCss1CompatMode_ = function(doc) {
  if (goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE;
  }
  return doc.compatMode == "CSS1Compat";
};
goog.dom.canHaveChildren = function(node) {
  if (node.nodeType != goog.dom.NodeType.ELEMENT) {
    return false;
  }
  switch(node.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return false;
  }
  return true;
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child);
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1);
};
goog.dom.removeChildren = function(node) {
  var child;
  while (child = node.firstChild) {
    node.removeChild(child);
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode);
  }
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  if (refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
  }
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null);
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (element.removeNode) {
      return(element.removeNode(false));
    } else {
      while (child = element.firstChild) {
        parent.insertBefore(child, element);
      }
      return(goog.dom.removeNode(element));
    }
  }
};
goog.dom.getChildren = function(element) {
  if (goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && element.children != undefined) {
    return element.children;
  }
  return goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT;
  });
};
goog.dom.getFirstElementChild = function(node) {
  if (node.firstElementChild != undefined) {
    return(node).firstElementChild;
  }
  return goog.dom.getNextElementNode_(node.firstChild, true);
};
goog.dom.getLastElementChild = function(node) {
  if (node.lastElementChild != undefined) {
    return(node).lastElementChild;
  }
  return goog.dom.getNextElementNode_(node.lastChild, false);
};
goog.dom.getNextElementSibling = function(node) {
  if (node.nextElementSibling != undefined) {
    return(node).nextElementSibling;
  }
  return goog.dom.getNextElementNode_(node.nextSibling, true);
};
goog.dom.getPreviousElementSibling = function(node) {
  if (node.previousElementSibling != undefined) {
    return(node).previousElementSibling;
  }
  return goog.dom.getNextElementNode_(node.previousSibling, false);
};
goog.dom.getNextElementNode_ = function(node, forward) {
  while (node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling;
  }
  return(node);
};
goog.dom.getNextNode = function(node) {
  if (!node) {
    return null;
  }
  if (node.firstChild) {
    return node.firstChild;
  }
  while (node && !node.nextSibling) {
    node = node.parentNode;
  }
  return node ? node.nextSibling : null;
};
goog.dom.getPreviousNode = function(node) {
  if (!node) {
    return null;
  }
  if (!node.previousSibling) {
    return node.parentNode;
  }
  node = node.previousSibling;
  while (node && node.lastChild) {
    node = node.lastChild;
  }
  return node;
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0;
};
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT;
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj["window"] == obj;
};
goog.dom.getParentElement = function(element) {
  var parent;
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    var isIe9 = goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10");
    if (!(isIe9 && goog.global["SVGElement"] && element instanceof goog.global["SVGElement"])) {
      parent = element.parentElement;
      if (parent) {
        return parent;
      }
    }
  }
  parent = element.parentNode;
  return goog.dom.isElement(parent) ? (parent) : null;
};
goog.dom.contains = function(parent, descendant) {
  if (parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant);
  }
  if (typeof parent.compareDocumentPosition != "undefined") {
    return parent == descendant || Boolean(parent.compareDocumentPosition(descendant) & 16);
  }
  while (descendant && parent != descendant) {
    descendant = descendant.parentNode;
  }
  return descendant == parent;
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if (node1 == node2) {
    return 0;
  }
  if (node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1;
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if (node1.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1;
    }
    if (node2.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }
  if ("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT;
    var isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if (isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex;
    } else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;
      if (parent1 == parent2) {
        return goog.dom.compareSiblingOrder_(node1, node2);
      }
      if (!isElement1 && goog.dom.contains(parent1, node2)) {
        return-1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2);
      }
      if (!isElement2 && goog.dom.contains(parent2, node1)) {
        return goog.dom.compareParentsDescendantNodeIe_(node2, node1);
      }
      return(isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex);
    }
  }
  var doc = goog.dom.getOwnerDocument(node1);
  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);
  return range1.compareBoundaryPoints(goog.global["Range"].START_TO_END, range2);
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if (parent == node) {
    return-1;
  }
  var sibling = node;
  while (sibling.parentNode != parent) {
    sibling = sibling.parentNode;
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode);
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  var s = node2;
  while (s = s.previousSibling) {
    if (s == node1) {
      return-1;
    }
  }
  return 1;
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if (!count) {
    return null;
  } else {
    if (count == 1) {
      return arguments[0];
    }
  }
  var paths = [];
  var minLength = Infinity;
  for (i = 0;i < count;i++) {
    var ancestors = [];
    var node = arguments[i];
    while (node) {
      ancestors.unshift(node);
      node = node.parentNode;
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length);
  }
  var output = null;
  for (i = 0;i < minLength;i++) {
    var first = paths[0][i];
    for (var j = 1;j < count;j++) {
      if (first != paths[j][i]) {
        return output;
      }
    }
    output = first;
  }
  return output;
};
goog.dom.getOwnerDocument = function(node) {
  goog.asserts.assert(node, "Node cannot be null or undefined.");
  return(node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document);
};
goog.dom.getFrameContentDocument = function(frame) {
  var doc = frame.contentDocument || frame.contentWindow.document;
  return doc;
};
goog.dom.getFrameContentWindow = function(frame) {
  return frame.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(frame));
};
goog.dom.setTextContent = function(node, text) {
  goog.asserts.assert(node != null, "goog.dom.setTextContent expects a non-null value for node");
  if ("textContent" in node) {
    node.textContent = text;
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      node.data = text;
    } else {
      if (node.firstChild && node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        while (node.lastChild != node.firstChild) {
          node.removeChild(node.lastChild);
        }
        node.firstChild.data = text;
      } else {
        goog.dom.removeChildren(node);
        var doc = goog.dom.getOwnerDocument(node);
        node.appendChild(doc.createTextNode(String(text)));
      }
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  if ("outerHTML" in element) {
    return element.outerHTML;
  } else {
    var doc = goog.dom.getOwnerDocument(element);
    var div = doc.createElement("div");
    div.appendChild(element.cloneNode(true));
    return div.innerHTML;
  }
};
goog.dom.findNode = function(root, p) {
  var rv = [];
  var found = goog.dom.findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined;
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, false);
  return rv;
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if (root != null) {
    var child = root.firstChild;
    while (child) {
      if (p(child)) {
        rv.push(child);
        if (findOne) {
          return true;
        }
      }
      if (goog.dom.findNodes_(child, p, rv, findOne)) {
        return true;
      }
      child = child.nextSibling;
    }
  }
  return false;
};
goog.dom.TAGS_TO_IGNORE_ = {"SCRIPT":1, "STYLE":1, "HEAD":1, "IFRAME":1, "OBJECT":1};
goog.dom.PREDEFINED_TAG_VALUES_ = {"IMG":" ", "BR":"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  return goog.dom.hasSpecifiedTabIndex_(element) && goog.dom.isTabIndexFocusable_(element);
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  if (enable) {
    element.tabIndex = 0;
  } else {
    element.tabIndex = -1;
    element.removeAttribute("tabIndex");
  }
};
goog.dom.isFocusable = function(element) {
  var focusable;
  if (goog.dom.nativelySupportsFocus_(element)) {
    focusable = !element.disabled && (!goog.dom.hasSpecifiedTabIndex_(element) || goog.dom.isTabIndexFocusable_(element));
  } else {
    focusable = goog.dom.isFocusableTabIndex(element);
  }
  return focusable && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(element) : focusable;
};
goog.dom.hasSpecifiedTabIndex_ = function(element) {
  var attrNode = element.getAttributeNode("tabindex");
  return goog.isDefAndNotNull(attrNode) && attrNode.specified;
};
goog.dom.isTabIndexFocusable_ = function(element) {
  var index = element.tabIndex;
  return goog.isNumber(index) && index >= 0 && index < 32768;
};
goog.dom.nativelySupportsFocus_ = function(element) {
  return element.tagName == goog.dom.TagName.A || element.tagName == goog.dom.TagName.INPUT || element.tagName == goog.dom.TagName.TEXTAREA || element.tagName == goog.dom.TagName.SELECT || element.tagName == goog.dom.TagName.BUTTON;
};
goog.dom.hasNonZeroBoundingRect_ = function(element) {
  var rect = goog.isFunction(element["getBoundingClientRect"]) ? element.getBoundingClientRect() : {"height":element.offsetHeight, "width":element.offsetWidth};
  return goog.isDefAndNotNull(rect) && rect.height > 0 && rect.width > 0;
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText);
  } else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, true);
    textContent = buf.join("");
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  if (!goog.dom.BrowserFeature.CAN_USE_INNER_TEXT) {
    textContent = textContent.replace(/ +/g, " ");
  }
  if (textContent != " ") {
    textContent = textContent.replace(/^\s*/, "");
  }
  return textContent;
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, false);
  return buf.join("");
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if (node.nodeName in goog.dom.TAGS_TO_IGNORE_) {
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      if (normalizeWhitespace) {
        buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ""));
      } else {
        buf.push(node.nodeValue);
      }
    } else {
      if (node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName]);
      } else {
        var child = node.firstChild;
        while (child) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace);
          child = child.nextSibling;
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length;
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body;
  var buf = [];
  while (node && node != root) {
    var cur = node;
    while (cur = cur.previousSibling) {
      buf.unshift(goog.dom.getTextContent(cur));
    }
    node = node.parentNode;
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length;
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur = null;
  while (stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if (cur.nodeName in goog.dom.TAGS_TO_IGNORE_) {
    } else {
      if (cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        pos += text.length;
      } else {
        if (cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length;
        } else {
          for (var i = cur.childNodes.length - 1;i >= 0;i--) {
            stack.push(cur.childNodes[i]);
          }
        }
      }
    }
  }
  if (goog.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur;
  }
  return cur;
};
goog.dom.isNodeList = function(val) {
  if (val && typeof val.length == "number") {
    if (goog.isObject(val)) {
      return typeof val.item == "function" || typeof val.item == "string";
    } else {
      if (goog.isFunction(val)) {
        return typeof val.item == "function";
      }
    }
  }
  return false;
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class, opt_maxSearchSteps) {
  if (!opt_tag && !opt_class) {
    return null;
  }
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return(goog.dom.getAncestor(element, function(node) {
    return(!tagName || node.nodeName == tagName) && (!opt_class || goog.isString(node.className) && goog.array.contains(node.className.split(/\s+/), opt_class));
  }, true, opt_maxSearchSteps));
};
goog.dom.getAncestorByClass = function(element, className, opt_maxSearchSteps) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, className, opt_maxSearchSteps);
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if (!opt_includeNode) {
    element = element.parentNode;
  }
  var ignoreSearchSteps = opt_maxSearchSteps == null;
  var steps = 0;
  while (element && (ignoreSearchSteps || steps <= opt_maxSearchSteps)) {
    if (matcher(element)) {
      return element;
    }
    element = element.parentNode;
    steps++;
  }
  return null;
};
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement;
  } catch (e) {
  }
  return null;
};
goog.dom.getPixelRatio = function() {
  var win = goog.dom.getWindow();
  var isFirefoxMobile = goog.userAgent.GECKO && goog.userAgent.MOBILE;
  if (goog.isDef(win.devicePixelRatio) && !isFirefoxMobile) {
    return win.devicePixelRatio;
  } else {
    if (win.matchMedia) {
      return goog.dom.matchesPixelRatio_(.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1;
    }
  }
  return 1;
};
goog.dom.matchesPixelRatio_ = function(pixelRatio) {
  var win = goog.dom.getWindow();
  var query = "(-webkit-min-device-pixel-ratio: " + pixelRatio + ")," + "(min--moz-device-pixel-ratio: " + pixelRatio + ")," + "(min-resolution: " + pixelRatio + "dppx)";
  return win.matchMedia(query).matches ? pixelRatio : 0;
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document;
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document;
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  return goog.dom.getElementHelper_(this.document_, element);
};
goog.dom.DomHelper.prototype.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(this.document_, id);
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el);
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc);
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc);
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(className, opt_root) {
  var root = opt_root || this.document_;
  return goog.dom.getRequiredElementByClass(className, root);
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow());
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
};
goog.dom.Appendable;
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments);
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name);
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(String(content));
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.DomHelper.prototype.safeHtmlToNode = function(html) {
  return goog.dom.safeHtmlToNode_(this.document_, html);
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString);
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
};
goog.dom.DomHelper.prototype.getActiveElement = function(opt_doc) {
  return goog.dom.getActiveElement(opt_doc || this.document_);
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.provide("goog.events.EventTarget");
goog.require("goog.Disposable");
goog.require("goog.asserts");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.Listenable");
goog.require("goog.events.ListenerMap");
goog.require("goog.object");
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
};
goog.events.EventTarget.prototype.setParentEventTarget = function(parent) {
  this.parentEventTarget_ = parent;
};
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  this.assertInitialized_();
  var ancestorsTree, ancestor = this.getParentEventTarget();
  if (ancestor) {
    ancestorsTree = [];
    var ancestorCount = 1;
    for (;ancestor;ancestor = ancestor.getParentEventTarget()) {
      ancestorsTree.push(ancestor);
      goog.asserts.assert(++ancestorCount < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, e, ancestorsTree);
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
goog.events.EventTarget.prototype.listen = function(type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(type), listener, false, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.listenOnce = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(String(type), listener, true, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlisten = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(String(type), listener, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlistenByKey = function(key) {
  return this.eventTargetListeners_.removeByKey(key);
};
goog.events.EventTarget.prototype.removeAllListeners = function(opt_type) {
  if (!this.eventTargetListeners_) {
    return 0;
  }
  return this.eventTargetListeners_.removeAll(opt_type);
};
goog.events.EventTarget.prototype.fireListeners = function(type, capture, eventObject) {
  var listenerArray = this.eventTargetListeners_.listeners[String(type)];
  if (!listenerArray) {
    return true;
  }
  listenerArray = listenerArray.concat();
  var rv = true;
  for (var i = 0;i < listenerArray.length;++i) {
    var listener = listenerArray[i];
    if (listener && !listener.removed && listener.capture == capture) {
      var listenerFn = listener.listener;
      var listenerHandler = listener.handler || listener.src;
      if (listener.callOnce) {
        this.unlistenByKey(listener);
      }
      rv = listenerFn.call(listenerHandler, eventObject) !== false && rv;
    }
  }
  return rv && eventObject.returnValue_ != false;
};
goog.events.EventTarget.prototype.getListeners = function(type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture);
};
goog.events.EventTarget.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(String(type), listener, capture, opt_listenerScope);
};
goog.events.EventTarget.prototype.hasListener = function(opt_type, opt_capture) {
  var id = goog.isDef(opt_type) ? String(opt_type) : undefined;
  return this.eventTargetListeners_.hasListener(id, opt_capture);
};
goog.events.EventTarget.prototype.setTargetForTesting = function(target) {
  this.actualEventTarget_ = target;
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass " + "(goog.events.EventTarget) constructor?");
};
goog.events.EventTarget.dispatchEventInternal_ = function(target, e, opt_ancestorsTree) {
  var type = e.type || (e);
  if (goog.isString(e)) {
    e = new goog.events.Event(e, target);
  } else {
    if (!(e instanceof goog.events.Event)) {
      var oldEvent = e;
      e = new goog.events.Event(type, target);
      goog.object.extend(e, oldEvent);
    } else {
      e.target = e.target || target;
    }
  }
  var rv = true, currentTarget;
  if (opt_ancestorsTree) {
    for (var i = opt_ancestorsTree.length - 1;!e.propagationStopped_ && i >= 0;i--) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, true, e) && rv;
    }
  }
  if (!e.propagationStopped_) {
    currentTarget = e.currentTarget = target;
    rv = currentTarget.fireListeners(type, true, e) && rv;
    if (!e.propagationStopped_) {
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }
  if (opt_ancestorsTree) {
    for (i = 0;!e.propagationStopped_ && i < opt_ancestorsTree.length;i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }
  return rv;
};
goog.provide("goog.dom.ViewportSizeMonitor");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.math.Size");
goog.dom.ViewportSizeMonitor = function(opt_window) {
  goog.events.EventTarget.call(this);
  this.window_ = opt_window || window;
  this.listenerKey_ = goog.events.listen(this.window_, goog.events.EventType.RESIZE, this.handleResize_, false, this);
  this.size_ = goog.dom.getViewportSize(this.window_);
};
goog.inherits(goog.dom.ViewportSizeMonitor, goog.events.EventTarget);
goog.dom.ViewportSizeMonitor.getInstanceForWindow = function(opt_window) {
  var currentWindow = opt_window || window;
  var uid = goog.getUid(currentWindow);
  return goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid] = goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid] || new goog.dom.ViewportSizeMonitor(currentWindow);
};
goog.dom.ViewportSizeMonitor.removeInstanceForWindow = function(opt_window) {
  var uid = goog.getUid(opt_window || window);
  goog.dispose(goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid]);
  delete goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid];
};
goog.dom.ViewportSizeMonitor.windowInstanceMap_ = {};
goog.dom.ViewportSizeMonitor.prototype.listenerKey_ = null;
goog.dom.ViewportSizeMonitor.prototype.window_ = null;
goog.dom.ViewportSizeMonitor.prototype.size_ = null;
goog.dom.ViewportSizeMonitor.prototype.getSize = function() {
  return this.size_ ? this.size_.clone() : null;
};
goog.dom.ViewportSizeMonitor.prototype.disposeInternal = function() {
  goog.dom.ViewportSizeMonitor.superClass_.disposeInternal.call(this);
  if (this.listenerKey_) {
    goog.events.unlistenByKey(this.listenerKey_);
    this.listenerKey_ = null;
  }
  this.window_ = null;
  this.size_ = null;
};
goog.dom.ViewportSizeMonitor.prototype.handleResize_ = function(event) {
  var size = goog.dom.getViewportSize(this.window_);
  if (!goog.math.Size.equals(size, this.size_)) {
    this.size_ = size;
    this.dispatchEvent(goog.events.EventType.RESIZE);
  }
};
goog.provide("chatango.managers.Environment");
goog.provide("chatango.managers.Environment.DeviceType");
goog.require("goog.userAgent");
chatango.managers.Environment = function() {
  var uas = goog.userAgent.getUserAgentString().toLowerCase();
  if (uas.indexOf("mobile") != -1 && uas.indexOf("kindle") == -1 && uas.indexOf("ipad") == -1) {
    this.device_type_ = chatango.managers.Environment.DeviceType.MOBILE;
  } else {
    if (uas.indexOf("android") != -1 || uas.indexOf("ipad") != -1 || uas.indexOf("silk") != -1) {
      this.device_type_ = chatango.managers.Environment.DeviceType.TABLET;
    } else {
      this.device_type_ = chatango.managers.Environment.DeviceType.DESKTOP;
    }
  }
  this.androidApp_ = uas.indexOf("android") != -1 && uas.indexOf("version") != -1;
};
goog.addSingletonGetter(chatango.managers.Environment);
chatango.managers.Environment.DeviceType = {MOBILE:"mobile", TABLET:"tablet", DESKTOP:"desktop"};
chatango.managers.Environment.prototype.device_type_ = "desktop";
chatango.managers.Environment.prototype.getDeviceType = function() {
  return this.device_type_;
};
chatango.managers.Environment.prototype.isDesktop = function() {
  return this.device_type_ == chatango.managers.Environment.DeviceType.DESKTOP;
};
chatango.managers.Environment.prototype.isMobile = function() {
  return this.device_type_ == chatango.managers.Environment.DeviceType.MOBILE;
};
chatango.managers.Environment.prototype.isTablet = function() {
  return this.device_type_ == chatango.managers.Environment.DeviceType.TABLET;
};
chatango.managers.Environment.prototype.isTouch = function() {
  return this.device_type_ == chatango.managers.Environment.DeviceType.MOBILE || this.device_type_ == chatango.managers.Environment.DeviceType.TABLET;
};
chatango.managers.Environment.prototype.isSmallTablet = function() {
  var uas = goog.userAgent.getUserAgentString().toLowerCase();
  return uas.match(/(?:nexus 7|kindle fire|silk)/) != null;
};
chatango.managers.Environment.prototype.isIOS = function() {
  return goog.userAgent.getUserAgentString().match(/(iPad|iPhone|iPod)/i) ? true : false;
};
chatango.managers.Environment.prototype.isAndroid = function() {
  return goog.userAgent.getUserAgentString().match(/(Android)/i) ? true : false;
};
chatango.managers.Environment.prototype.isMockGroup_ = false;
chatango.managers.Environment.prototype.isMockGroup = function() {
  return this.isMockGroup_;
};
chatango.managers.Environment.prototype.setMockGroup = function(bool) {
  this.isMockGroup_ = bool;
};
chatango.managers.Environment.prototype.isEmbeddableMockGroup_ = false;
chatango.managers.Environment.prototype.isEmbeddableMockGroup = function() {
  return this.isEmbeddableMockGroup_;
};
chatango.managers.Environment.prototype.setEmbeddableMockGroup = function(bool) {
  this.isEmbeddableMockGroup_ = bool;
};
chatango.managers.Environment.prototype.getiOSMajorVersion = function() {
  var versionRe = /OS\s(\d*)?_/i;
  var result = versionRe.exec(goog.userAgent.getUserAgentString());
  if (!result) {
    return-1;
  }
  return Number(result[1]);
};
chatango.managers.Environment.prototype.isAndroidApp = function() {
  return this.androidApp_;
};
goog.provide("chatango.managers.ViewportManager");
goog.require("goog.dom.ViewportSizeMonitor");
chatango.managers.ViewportManager = function() {
  this.vsm_ = new goog.dom.ViewportSizeMonitor;
};
goog.addSingletonGetter(chatango.managers.ViewportManager);
chatango.managers.ViewportManager.prototype.getViewportSizeMonitor = function() {
  return this.vsm_;
};
goog.provide("chatango.managers.Keyboard");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.ViewportManager");
goog.require("goog.dom.ViewportSizeMonitor");
goog.require("goog.events.EventTarget");
chatango.managers.Keyboard = function() {
  goog.events.EventTarget.call(this);
  this.keyboardUp_ = false;
};
goog.inherits(chatango.managers.Keyboard, goog.events.EventTarget);
goog.addSingletonGetter(chatango.managers.Keyboard);
chatango.managers.Keyboard.EventType = {KEYBOARD_RAISED:"keyboardraised", KEYBOARD_LOWERED:"keyboardlowered"};
chatango.managers.Keyboard.prototype.setRaised = function(raised) {
  if (raised !== this.keyboardUp_) {
    this.keyboardUp_ = raised;
    if (raised) {
      this.dispatchEvent(chatango.managers.Keyboard.EventType.KEYBOARD_RAISED);
    } else {
      this.dispatchEvent(chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED);
    }
  }
};
chatango.managers.Keyboard.prototype.isRaised = function() {
  return this.keyboardUp_;
};
goog.require("goog.events.Event");
goog.provide("chatango.events.ToggleUserScalingEvent");
chatango.events.ToggleUserScalingEvent = function(action) {
  this.action_ = action;
  goog.events.Event.call(this, chatango.events.EventType.SET_USER_SCALING);
};
goog.inherits(chatango.events.ToggleUserScalingEvent, goog.events.Event);
chatango.events.ToggleUserScalingEvent.Action = {DISABLE:"d", RESTORE:"r"};
chatango.events.ToggleUserScalingEvent.prototype.getAction = function() {
  return this.action_;
};
goog.provide("chatango.group.GroupEmbedTypes");
chatango.group.GroupEmbedTypes = {TAB:"TAB", BOX_FIXED:"BOX_FIXED", BUTTON:"BUTTON", BOX:"BOX"};
goog.provide("goog.json");
goog.provide("goog.json.Replacer");
goog.provide("goog.json.Reviver");
goog.provide("goog.json.Serializer");
goog.define("goog.json.USE_NATIVE_JSON", false);
goog.json.isValid = function(s) {
  if (/^\s*$/.test(s)) {
    return false;
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g;
  var simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g;
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  var o = String(s);
  if (goog.json.isValid(o)) {
    try {
      return(eval("(" + o + ")"));
    } catch (ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  return(eval("(" + s + ")"));
};
goog.json.Replacer;
goog.json.Reviver;
goog.json.serialize = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["stringify"]) : function(object, opt_replacer) {
  return(new goog.json.Serializer(opt_replacer)).serialize(object);
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer;
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(object, sb) {
  switch(typeof object) {
    case "string":
      this.serializeString_((object), sb);
      break;
    case "number":
      this.serializeNumber_((object), sb);
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if (object == null) {
        sb.push("null");
        break;
      }
      if (goog.isArray(object)) {
        this.serializeArray((object), sb);
        break;
      }
      this.serializeObject_((object), sb);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);;
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if (c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c];
    }
    var cc = c.charCodeAt(0);
    var rv = "\\u";
    if (cc < 16) {
      rv += "000";
    } else {
      if (cc < 256) {
        rv += "00";
      } else {
        if (cc < 4096) {
          rv += "0";
        }
      }
    }
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16);
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : "null");
};
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  var sep = "";
  for (var i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "";
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      if (typeof value != "function") {
        sb.push(sep);
        this.serializeString_(key, sb);
        sb.push(":");
        this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb);
        sep = ",";
      }
    }
  }
  sb.push("}");
};
goog.provide("goog.html.SafeScript");
goog.require("goog.asserts");
goog.require("goog.string.Const");
goog.require("goog.string.TypedString");
goog.html.SafeScript = function() {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
  this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeScript.prototype.implementsGoogStringTypedString = true;
goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeScript.fromConstant = function(script) {
  var scriptString = goog.string.Const.unwrap(script);
  if (scriptString.length === 0) {
    return goog.html.SafeScript.EMPTY;
  }
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(scriptString);
};
goog.html.SafeScript.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeScriptWrappedValue_;
};
if (goog.DEBUG) {
  goog.html.SafeScript.prototype.toString = function() {
    return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}";
  };
}
goog.html.SafeScript.unwrap = function(safeScript) {
  if (safeScript instanceof goog.html.SafeScript && safeScript.constructor === goog.html.SafeScript && safeScript.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeScript.privateDoNotAccessOrElseSafeScriptWrappedValue_;
  } else {
    goog.asserts.fail("expected object of type SafeScript, got '" + safeScript + "'");
    return "type_error:SafeScript";
  }
};
goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function(script) {
  return(new goog.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(script);
};
goog.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(script) {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = script;
  return this;
};
goog.html.SafeScript.EMPTY = goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");
goog.provide("goog.html.uncheckedconversions");
goog.require("goog.asserts");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeScript");
goog.require("goog.html.SafeStyle");
goog.require("goog.html.SafeStyleSheet");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.TrustedResourceUrl");
goog.require("goog.string");
goog.require("goog.string.Const");
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(justification, html, opt_dir) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(html, opt_dir || null);
};
goog.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function(justification, script) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmpty(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(script);
};
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(justification, style) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function(justification, styleSheet) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheet);
};
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(justification, url) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(justification, url) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.provide("goog.structs.Collection");
goog.structs.Collection = function() {
};
goog.structs.Collection.prototype.add;
goog.structs.Collection.prototype.remove;
goog.structs.Collection.prototype.contains;
goog.structs.Collection.prototype.getCount;
goog.provide("goog.structs");
goog.require("goog.array");
goog.require("goog.object");
goog.structs.getCount = function(col) {
  if (typeof col.getCount == "function") {
    return col.getCount();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return col.length;
  }
  return goog.object.getCount(col);
};
goog.structs.getValues = function(col) {
  if (typeof col.getValues == "function") {
    return col.getValues();
  }
  if (goog.isString(col)) {
    return col.split("");
  }
  if (goog.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0;i < l;i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog.object.getValues(col);
};
goog.structs.getKeys = function(col) {
  if (typeof col.getKeys == "function") {
    return col.getKeys();
  }
  if (typeof col.getValues == "function") {
    return undefined;
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0;i < l;i++) {
      rv.push(i);
    }
    return rv;
  }
  return goog.object.getKeys(col);
};
goog.structs.contains = function(col, val) {
  if (typeof col.contains == "function") {
    return col.contains(val);
  }
  if (typeof col.containsValue == "function") {
    return col.containsValue(val);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains((col), val);
  }
  return goog.object.containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
  if (typeof col.isEmpty == "function") {
    return col.isEmpty();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty((col));
  }
  return goog.object.isEmpty(col);
};
goog.structs.clear = function(col) {
  if (typeof col.clear == "function") {
    col.clear();
  } else {
    if (goog.isArrayLike(col)) {
      goog.array.clear((col));
    } else {
      goog.object.clear(col);
    }
  }
};
goog.structs.forEach = function(col, f, opt_obj) {
  if (typeof col.forEach == "function") {
    col.forEach(f, opt_obj);
  } else {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach((col), f, opt_obj);
    } else {
      var keys = goog.structs.getKeys(col);
      var values = goog.structs.getValues(col);
      var l = values.length;
      for (var i = 0;i < l;i++) {
        f.call(opt_obj, values[i], keys && keys[i], col);
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if (typeof col.filter == "function") {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter((col), f, opt_obj);
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      if (f.call(opt_obj, values[i], keys[i], col)) {
        rv[keys[i]] = values[i];
      }
    }
  } else {
    rv = [];
    for (var i = 0;i < l;i++) {
      if (f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i]);
      }
    }
  }
  return rv;
};
goog.structs.map = function(col, f, opt_obj) {
  if (typeof col.map == "function") {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map((col), f, opt_obj);
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col);
    }
  } else {
    rv = [];
    for (var i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], undefined, col);
    }
  }
  return rv;
};
goog.structs.some = function(col, f, opt_obj) {
  if (typeof col.some == "function") {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some((col), f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true;
    }
  }
  return false;
};
goog.structs.every = function(col, f, opt_obj) {
  if (typeof col.every == "function") {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every((col), f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false;
    }
  }
  return true;
};
goog.provide("goog.functions");
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = goog.functions.constant(false);
goog.functions.TRUE = goog.functions.constant(true);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  };
};
goog.functions.fail = function(err) {
  return function() {
    throw err;
  };
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
  };
};
goog.functions.nth = function(n) {
  return function() {
    return arguments[n];
  };
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.equalTo = function(value, opt_useLooseComparison) {
  return function(other) {
    return opt_useLooseComparison ? value == other : value === other;
  };
};
goog.functions.compose = function(fn, var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    if (length) {
      result = functions[length - 1].apply(this, arguments);
    }
    for (var i = length - 2;i >= 0;i--) {
      result = functions[i].call(this, result);
    }
    return result;
  };
};
goog.functions.sequence = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    for (var i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
  };
};
goog.functions.and = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (!functions[i].apply(this, arguments)) {
        return false;
      }
    }
    return true;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (functions[i].apply(this, arguments)) {
        return true;
      }
    }
    return false;
  };
};
goog.functions.not = function(f) {
  return function() {
    return!f.apply(this, arguments);
  };
};
goog.functions.create = function(constructor, var_args) {
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp;
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
};
goog.define("goog.functions.CACHE_RETURN_VALUE", true);
goog.functions.cacheReturnValue = function(fn) {
  var called = false;
  var value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    if (!called) {
      value = fn();
      called = true;
    }
    return value;
  };
};
goog.provide("goog.iter");
goog.provide("goog.iter.Iterable");
goog.provide("goog.iter.Iterator");
goog.provide("goog.iter.StopIteration");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.functions");
goog.require("goog.math");
goog.iter.Iterable;
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global["StopIteration"] : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this;
};
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if (typeof iterable.__iterator__ == "function") {
    return iterable.__iterator__(false);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
      while (true) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if (!(i in iterable)) {
          i++;
          continue;
        }
        return iterable[i++];
      }
    };
    return newIter;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach((iterable), f, opt_obj);
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable);
    try {
      while (true) {
        f.call(opt_obj, iterable.next(), undefined, iterable);
      }
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (f.call(opt_obj, val, undefined, iterator)) {
        return val;
      }
    }
  };
  return newIter;
};
goog.iter.filterFalse = function(iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj);
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if (arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop;
  }
  if (step == 0) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
  };
  return newIter;
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
};
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, undefined, iterator);
  };
  return newIter;
};
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while (true) {
      if (f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false;
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while (true) {
      if (!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true;
};
goog.iter.chain = function(var_args) {
  return goog.iter.chainFromIterable(arguments);
};
goog.iter.chainFromIterable = function(iterable) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  var current = null;
  iter.next = function() {
    while (true) {
      if (current == null) {
        var it = iterator.next();
        current = goog.iter.toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
  };
  return iter;
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var dropping = true;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue;
      } else {
        dropping = false;
      }
      return val;
    }
  };
  return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var val = iterator.next();
    if (f.call(opt_obj, val, undefined, iterator)) {
      return val;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.toArray = function(iterable) {
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray((iterable));
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val);
  });
  return array;
};
goog.iter.equals = function(iterable1, iterable2, opt_equalsFn) {
  var fillValue = {};
  var pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2);
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  return goog.iter.every(pairs, function(pair) {
    return equalsFn(pair[0], pair[1]);
  });
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next();
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue;
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return!arr.length;
  });
  if (someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var iter = new goog.iter.Iterator;
  var arrays = arguments;
  var indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if (indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      });
      for (var i = indicies.length - 1;i >= 0;i--) {
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }
        if (i == 0) {
          indicies = null;
          break;
        }
        indicies[i] = 0;
      }
      return retVal;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable);
  var cache = [];
  var cacheIndex = 0;
  var iter = new goog.iter.Iterator;
  var useCache = false;
  iter.next = function() {
    var returnElement = null;
    if (!useCache) {
      try {
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement;
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = true;
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement;
  };
  return iter;
};
goog.iter.count = function(opt_start, opt_step) {
  var counter = opt_start || 0;
  var step = goog.isDef(opt_step) ? opt_step : 1;
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
  };
  return iter;
};
goog.iter.repeat = function(value) {
  var iter = new goog.iter.Iterator;
  iter.next = goog.functions.constant(value);
  return iter;
};
goog.iter.accumulate = function(iterable) {
  var iterator = goog.iter.toIterator(iterable);
  var total = 0;
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    total += iterator.next();
    return total;
  };
  return iter;
};
goog.iter.zip = function(var_args) {
  var args = arguments;
  var iter = new goog.iter.Iterator;
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var arr = goog.array.map(iterators, function(it) {
        return it.next();
      });
      return arr;
    };
  }
  return iter;
};
goog.iter.zipLongest = function(fillValue, var_args) {
  var args = goog.array.slice(arguments, 1);
  var iter = new goog.iter.Iterator;
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var iteratorsHaveValues = false;
      var arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next();
          iteratorsHaveValues = true;
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });
      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration;
      }
      return arr;
    };
  }
  return iter;
};
goog.iter.compress = function(iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors);
  return goog.iter.filter(iterable, function() {
    return!!selectorIterator.next();
  });
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
  this.iterator = goog.iter.toIterator(iterable);
  this.keyFunc = opt_keyFunc || goog.functions.identity;
  this.targetKey;
  this.currentKey;
  this.currentValue;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  while (this.currentKey == this.targetKey) {
    this.currentValue = this.iterator.next();
    this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return[this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
  var arr = [];
  while (this.currentKey == targetKey) {
    arr.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return arr;
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
};
goog.iter.starMap = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  iter.next = function() {
    var args = goog.iter.toArray(iterator.next());
    return f.apply(opt_obj, goog.array.concat(args, undefined, iterator));
  };
  return iter;
};
goog.iter.tee = function(iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable);
  var num = goog.isNumber(opt_num) ? opt_num : 2;
  var buffers = goog.array.map(goog.array.range(num), function() {
    return[];
  });
  var addNextIteratorValueToBuffers = function() {
    var val = iterator.next();
    goog.array.forEach(buffers, function(buffer) {
      buffer.push(val);
    });
  };
  var createIterator = function(buffer) {
    var iter = new goog.iter.Iterator;
    iter.next = function() {
      if (goog.array.isEmpty(buffer)) {
        addNextIteratorValueToBuffers();
      }
      goog.asserts.assert(!goog.array.isEmpty(buffer));
      return buffer.shift();
    };
    return iter;
  };
  return goog.array.map(buffers, createIterator);
};
goog.iter.enumerate = function(iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable);
};
goog.iter.limit = function(iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && limitSize >= 0);
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator;
  var remaining = limitSize;
  iter.next = function() {
    if (remaining-- > 0) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && count >= 0);
  var iterator = goog.iter.toIterator(iterable);
  while (count-- > 0) {
    goog.iter.nextOrValue(iterator, null);
  }
  return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && start >= 0);
  var iterator = goog.iter.consume(iterable, start);
  if (goog.isNumber(opt_end)) {
    goog.asserts.assert(goog.math.isInt((opt_end)) && opt_end >= start);
    iterator = goog.iter.limit(iterator, opt_end - start);
  }
  return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable);
  var length = goog.isNumber(opt_length) ? opt_length : elements.length;
  var sets = goog.array.repeat(elements, length);
  var product = goog.iter.product.apply(undefined, sets);
  return goog.iter.filter(product, function(arr) {
    return!goog.iter.hasDuplicates_(arr);
  });
};
goog.iter.combinations = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.iter.range(elements.length);
  var indexIterator = goog.iter.permutations(indexes, length);
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });
  var iter = new goog.iter.Iterator;
  function getIndexFromElements(index) {
    return elements[index];
  }
  iter.next = function() {
    return goog.array.map((sortedIndexIterator.next()), getIndexFromElements);
  };
  return iter;
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.array.range(elements.length);
  var sets = goog.array.repeat(indexes, length);
  var indexIterator = goog.iter.product.apply(undefined, sets);
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });
  var iter = new goog.iter.Iterator;
  function getIndexFromElements(index) {
    return elements[index];
  }
  iter.next = function() {
    return goog.array.map((sortedIndexIterator.next()), getIndexFromElements);
  };
  return iter;
};
goog.provide("goog.structs.Map");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.object");
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.count_ = 0;
  this.version_ = 0;
  var argLength = arguments.length;
  if (argLength > 1) {
    if (argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else {
    if (opt_map) {
      this.addAll((opt_map));
    }
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  var rv = [];
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key]);
  }
  return rv;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return(this.keys_.concat());
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key);
};
goog.structs.Map.prototype.containsValue = function(val) {
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true;
    }
  }
  return false;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return true;
  }
  if (this.count_ != otherMap.getCount()) {
    return false;
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var key, i = 0;key = this.keys_[i];i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return false;
    }
  }
  return true;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0;
};
goog.structs.Map.prototype.remove = function(key) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;
    if (this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_();
    }
    return true;
  }
  return false;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
  if (this.count_ != this.keys_.length) {
    var seen = {};
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key;
        seen[key] = 1;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key];
  }
  return opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
  if (!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++;
    this.keys_.push(key);
    this.version_++;
  }
  this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if (map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues();
  } else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map);
  }
  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
  var keys = this.getKeys();
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var value = this.get(key);
    f.call(opt_obj, value, key, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  var transposed = new goog.structs.Map;
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    var value = this.map_[key];
    transposed.set(value, key);
  }
  return transposed;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var obj = {};
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key];
  }
  return obj;
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true);
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false);
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0;
  var keys = this.keys_;
  var map = this.map_;
  var version = this.version_;
  var selfObj = this;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while (true) {
      if (version != selfObj.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if (i >= keys.length) {
        throw goog.iter.StopIteration;
      }
      var key = keys[i++];
      return opt_keys ? key : map[key];
    }
  };
  return newIter;
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
goog.provide("goog.structs.Set");
goog.require("goog.structs");
goog.require("goog.structs.Collection");
goog.require("goog.structs.Map");
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  if (opt_values) {
    this.addAll(opt_values);
  }
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  if (type == "object" && val || type == "function") {
    return "o" + goog.getUid((val));
  } else {
    return type.substr(0, 1) + val;
  }
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element);
};
goog.structs.Set.prototype.addAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    this.add(values[i]);
  }
};
goog.structs.Set.prototype.removeAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0;i < l;i++) {
    this.remove(values[i]);
  }
};
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.containsAll = function(col) {
  return goog.structs.every(col, this.contains, this);
};
goog.structs.Set.prototype.intersection = function(col) {
  var result = new goog.structs.Set;
  var values = goog.structs.getValues(col);
  for (var i = 0;i < values.length;i++) {
    var value = values[i];
    if (this.contains(value)) {
      result.add(value);
    }
  }
  return result;
};
goog.structs.Set.prototype.difference = function(col) {
  var result = this.clone();
  result.removeAll(col);
  return result;
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col);
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if (this.getCount() > colCount) {
    return false;
  }
  if (!(col instanceof goog.structs.Set) && colCount > 5) {
    col = new goog.structs.Set(col);
  }
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value);
  });
};
goog.structs.Set.prototype.__iterator__ = function(opt_keys) {
  return this.map_.__iterator__(false);
};
goog.provide("goog.debug");
goog.require("goog.array");
goog.require("goog.html.SafeHtml");
goog.require("goog.html.SafeUrl");
goog.require("goog.html.uncheckedconversions");
goog.require("goog.string.Const");
goog.require("goog.structs.Set");
goog.require("goog.userAgent");
goog.define("goog.debug.LOGGING_ENABLED", goog.DEBUG);
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global;
  var oldErrorHandler = target.onerror;
  var retVal = !!opt_cancel;
  if (goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3")) {
    retVal = !retVal;
  }
  target.onerror = function(message, url, line, opt_col, opt_error) {
    if (oldErrorHandler) {
      oldErrorHandler(message, url, line, opt_col, opt_error);
    }
    logFunc({message:message, fileName:url, line:line, col:opt_col, error:opt_error});
    return retVal;
  };
};
goog.debug.expose = function(obj, opt_showFn) {
  if (typeof obj == "undefined") {
    return "undefined";
  }
  if (obj == null) {
    return "NULL";
  }
  var str = [];
  for (var x in obj) {
    if (!opt_showFn && goog.isFunction(obj[x])) {
      continue;
    }
    var s = x + " = ";
    try {
      s += obj[x];
    } catch (e) {
      s += "*** " + e + " ***";
    }
    str.push(s);
  }
  return str.join("\n");
};
goog.debug.deepExpose = function(obj, opt_showFn) {
  var str = [];
  var helper = function(obj, space, parentSeen) {
    var nestspace = space + "  ";
    var seen = new goog.structs.Set(parentSeen);
    var indentMultiline = function(str) {
      return str.replace(/\n/g, "\n" + space);
    };
    try {
      if (!goog.isDef(obj)) {
        str.push("undefined");
      } else {
        if (goog.isNull(obj)) {
          str.push("NULL");
        } else {
          if (goog.isString(obj)) {
            str.push('"' + indentMultiline(obj) + '"');
          } else {
            if (goog.isFunction(obj)) {
              str.push(indentMultiline(String(obj)));
            } else {
              if (goog.isObject(obj)) {
                if (seen.contains(obj)) {
                  str.push("*** reference loop detected ***");
                } else {
                  seen.add(obj);
                  str.push("{");
                  for (var x in obj) {
                    if (!opt_showFn && goog.isFunction(obj[x])) {
                      continue;
                    }
                    str.push("\n");
                    str.push(nestspace);
                    str.push(x + " = ");
                    helper(obj[x], nestspace, seen);
                  }
                  str.push("\n" + space + "}");
                }
              } else {
                str.push(obj);
              }
            }
          }
        }
      }
    } catch (e) {
      str.push("*** " + e + " ***");
    }
  };
  helper(obj, "", new goog.structs.Set);
  return str.join("");
};
goog.debug.exposeArray = function(arr) {
  var str = [];
  for (var i = 0;i < arr.length;i++) {
    if (goog.isArray(arr[i])) {
      str.push(goog.debug.exposeArray(arr[i]));
    } else {
      str.push(arr[i]);
    }
  }
  return "[ " + str.join(", ") + " ]";
};
goog.debug.exposeException = function(err, opt_fn) {
  var html = goog.debug.exposeExceptionAsHtml(err, opt_fn);
  return goog.html.SafeHtml.unwrap(html);
};
goog.debug.exposeExceptionAsHtml = function(err, opt_fn) {
  try {
    var e = goog.debug.normalizeErrorObject(err);
    var viewSourceUrl = goog.debug.createViewSourceUrl_(e.fileName);
    var error = goog.html.SafeHtml.concat(goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Message: " + e.message + "\nUrl: "), goog.html.SafeHtml.create("a", {href:viewSourceUrl, target:"_new"}, e.fileName), goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + e.stack + "-> " + "[end]\n\nJS stack traversal:\n" + goog.debug.getStacktrace(opt_fn) + "-> "));
    return error;
  } catch (e2) {
    return goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Exception trying to expose exception! You win, we lose. " + e2);
  }
};
goog.debug.createViewSourceUrl_ = function(opt_fileName) {
  if (!goog.isDefAndNotNull(opt_fileName)) {
    opt_fileName = "";
  }
  if (!/^https?:\/\//i.test(opt_fileName)) {
    return goog.html.SafeUrl.fromConstant(goog.string.Const.from("sanitizedviewsrc"));
  }
  var sanitizedFileName = goog.html.SafeUrl.sanitize(opt_fileName);
  return goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("view-source scheme plus HTTP/HTTPS URL"), "view-source:" + goog.html.SafeUrl.unwrap(sanitizedFileName));
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  if (goog.isString(err)) {
    return{"message":err, "name":"Unknown error", "lineNumber":"Not available", "fileName":href, "stack":"Not available"};
  }
  var lineNumber, fileName;
  var threwError = false;
  try {
    lineNumber = err.lineNumber || err.line || "Not available";
  } catch (e) {
    lineNumber = "Not available";
    threwError = true;
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || goog.global["$googDebugFname"] || href;
  } catch (e) {
    fileName = "Not available";
    threwError = true;
  }
  if (threwError || !err.lineNumber || !err.fileName || !err.stack || !err.message || !err.name) {
    return{"message":err.message || "Not available", "name":err.name || "UnknownError", "lineNumber":lineNumber, "fileName":fileName, "stack":err.stack || "Not available"};
  }
  return err;
};
goog.debug.enhanceError = function(err, opt_message) {
  var error;
  if (typeof err == "string") {
    error = Error(err);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, goog.debug.enhanceError);
    }
  } else {
    error = err;
  }
  if (!error.stack) {
    error.stack = goog.debug.getStacktrace(goog.debug.enhanceError);
  }
  if (opt_message) {
    var x = 0;
    while (error["message" + x]) {
      ++x;
    }
    error["message" + x] = String(opt_message);
  }
  return error;
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  if (goog.STRICT_MODE_COMPATIBLE) {
    var stack = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (stack) {
      return stack;
    }
  }
  var sb = [];
  var fn = arguments.callee.caller;
  var depth = 0;
  while (fn && (!opt_depth || depth < opt_depth)) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller;
    } catch (e) {
      sb.push("[exception trying to get caller]\n");
      break;
    }
    depth++;
    if (depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break;
    }
  }
  if (opt_depth && depth >= opt_depth) {
    sb.push("[...reached max depth limit...]");
  } else {
    sb.push("[end]");
  }
  return sb.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(fn) {
  var tempErr = new Error;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(tempErr, fn);
    return String(tempErr.stack);
  } else {
    try {
      throw tempErr;
    } catch (e) {
      tempErr = e;
    }
    var stack = tempErr.stack;
    if (stack) {
      return String(stack);
    }
  }
  return null;
};
goog.debug.getStacktrace = function(opt_fn) {
  var stack;
  if (goog.STRICT_MODE_COMPATIBLE) {
    var contextFn = opt_fn || goog.debug.getStacktrace;
    stack = goog.debug.getNativeStackTrace_(contextFn);
  }
  if (!stack) {
    stack = goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, []);
  }
  return stack;
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if (goog.array.contains(visited, fn)) {
    sb.push("[...circular reference...]");
  } else {
    if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + "(");
      var args = fn.arguments;
      for (var i = 0;args && i < args.length;i++) {
        if (i > 0) {
          sb.push(", ");
        }
        var argDesc;
        var arg = args[i];
        switch(typeof arg) {
          case "object":
            argDesc = arg ? "object" : "null";
            break;
          case "string":
            argDesc = arg;
            break;
          case "number":
            argDesc = String(arg);
            break;
          case "boolean":
            argDesc = arg ? "true" : "false";
            break;
          case "function":
            argDesc = goog.debug.getFunctionName(arg);
            argDesc = argDesc ? argDesc : "[fn]";
            break;
          case "undefined":
          ;
          default:
            argDesc = typeof arg;
            break;
        }
        if (argDesc.length > 40) {
          argDesc = argDesc.substr(0, 40) + "...";
        }
        sb.push(argDesc);
      }
      visited.push(fn);
      sb.push(")\n");
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited));
      } catch (e) {
        sb.push("[exception trying to get caller]\n");
      }
    } else {
      if (fn) {
        sb.push("[...long stack...]");
      } else {
        sb.push("[end]");
      }
    }
  }
  return sb.join("");
};
goog.debug.setFunctionResolver = function(resolver) {
  goog.debug.fnNameResolver_ = resolver;
};
goog.debug.getFunctionName = function(fn) {
  if (goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn];
  }
  if (goog.debug.fnNameResolver_) {
    var name = goog.debug.fnNameResolver_(fn);
    if (name) {
      goog.debug.fnNameCache_[fn] = name;
      return name;
    }
  }
  var functionSource = String(fn);
  if (!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource);
    if (matches) {
      var method = matches[1];
      goog.debug.fnNameCache_[functionSource] = method;
    } else {
      goog.debug.fnNameCache_[functionSource] = "[Anonymous]";
    }
  }
  return goog.debug.fnNameCache_[functionSource];
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.fnNameCache_ = {};
goog.debug.fnNameResolver_;
goog.provide("goog.debug.LogRecord");
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
};
goog.debug.LogRecord.prototype.time_;
goog.debug.LogRecord.prototype.level_;
goog.debug.LogRecord.prototype.msg_;
goog.debug.LogRecord.prototype.loggerName_;
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.define("goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS", true);
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  if (goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS) {
    this.sequenceNumber_ = typeof opt_sequenceNumber == "number" ? opt_sequenceNumber : goog.debug.LogRecord.nextSequenceNumber_++;
  }
  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_;
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
};
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception;
};
goog.debug.LogRecord.prototype.setLoggerName = function(loggerName) {
  this.loggerName_ = loggerName;
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level;
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
};
goog.debug.LogRecord.prototype.setMessage = function(msg) {
  this.msg_ = msg;
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
};
goog.debug.LogRecord.prototype.setMillis = function(time) {
  this.time_ = time;
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_;
};
goog.provide("goog.debug.LogBuffer");
goog.require("goog.asserts");
goog.require("goog.debug.LogRecord");
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining " + "goog.debug.LogBuffer.CAPACITY.");
  this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
  if (!goog.debug.LogBuffer.instance_) {
    goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer;
  }
  return goog.debug.LogBuffer.instance_;
};
goog.define("goog.debug.LogBuffer.CAPACITY", 0);
goog.debug.LogBuffer.prototype.buffer_;
goog.debug.LogBuffer.prototype.curIndex_;
goog.debug.LogBuffer.prototype.isFull_;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if (this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret;
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return goog.debug.LogBuffer.CAPACITY > 0;
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = new Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = false;
};
goog.debug.LogBuffer.prototype.forEachRecord = function(func) {
  var buffer = this.buffer_;
  if (!buffer[0]) {
    return;
  }
  var curIndex = this.curIndex_;
  var i = this.isFull_ ? curIndex : -1;
  do {
    i = (i + 1) % goog.debug.LogBuffer.CAPACITY;
    func((buffer[i]));
  } while (i != curIndex);
};
goog.provide("goog.debug.LogManager");
goog.provide("goog.debug.Loggable");
goog.provide("goog.debug.Logger");
goog.provide("goog.debug.Logger.Level");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug");
goog.require("goog.debug.LogBuffer");
goog.require("goog.debug.LogRecord");
goog.debug.Loggable;
goog.debug.Logger = function(name) {
  this.name_ = name;
  this.parent_ = null;
  this.level_ = null;
  this.children_ = null;
  this.handlers_ = null;
};
goog.debug.Logger.ROOT_LOGGER_NAME = "";
goog.define("goog.debug.Logger.ENABLE_HIERARCHY", true);
if (!goog.debug.Logger.ENABLE_HIERARCHY) {
  goog.debug.Logger.rootHandlers_ = [];
  goog.debug.Logger.rootLevel_;
}
goog.debug.Logger.Level = function(name, value) {
  this.name = name;
  this.value = value;
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for (var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level;
    goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level;
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_();
  }
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_();
  }
  if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value];
  }
  for (var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
};
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name);
};
goog.debug.Logger.logToProfilers = function(msg) {
  if (goog.global["console"]) {
    if (goog.global["console"]["timeStamp"]) {
      goog.global["console"]["timeStamp"](msg);
    } else {
      if (goog.global["console"]["markTimeline"]) {
        goog.global["console"]["markTimeline"](msg);
      }
    }
  }
  if (goog.global["msWriteProfilerMark"]) {
    goog.global["msWriteProfilerMark"](msg);
  }
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};
goog.debug.Logger.prototype.addHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      if (!this.handlers_) {
        this.handlers_ = [];
      }
      this.handlers_.push(handler);
    } else {
      goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
      goog.debug.Logger.rootHandlers_.push(handler);
    }
  }
};
goog.debug.Logger.prototype.removeHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return!!handlers && goog.array.remove(handlers, handler);
  } else {
    return false;
  }
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
  if (!this.children_) {
    this.children_ = {};
  }
  return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(level) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      this.level_ = level;
    } else {
      goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
      goog.debug.Logger.rootLevel_ = level;
    }
  }
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF;
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail("Root logger has no level set.");
  return null;
};
goog.debug.Logger.prototype.isLoggable = function(level) {
  return goog.debug.LOGGING_ENABLED && level.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(level)) {
    if (goog.isFunction(msg)) {
      msg = msg();
    }
    this.doLogRecord_(this.getLogRecord(level, msg, opt_exception));
  }
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception) {
  if (goog.debug.LogBuffer.isBufferingEnabled()) {
    var logRecord = goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_)
  } else {
    logRecord = new goog.debug.LogRecord(level, String(msg), this.name_);
  }
  if (opt_exception) {
    logRecord.setException(opt_exception);
  }
  return logRecord;
};
goog.debug.Logger.prototype.shout = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SHOUT, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINE, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.finer = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINER, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.finest = function(msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINEST, msg, opt_exception);
  }
};
goog.debug.Logger.prototype.logRecord = function(logRecord) {
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(logRecord.getLevel())) {
    this.doLogRecord_(logRecord);
  }
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  goog.debug.Logger.logToProfilers("log:" + logRecord.getMessage());
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var target = this;
    while (target) {
      target.callPublish_(logRecord);
      target = target.getParent();
    }
  } else {
    for (var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if (this.handlers_) {
    for (var i = 0, handler;handler = this.handlers_[i];i++) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent;
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  if (!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(goog.debug.Logger.ROOT_LOGGER_NAME);
    goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] = goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG);
  }
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return(goog.debug.LogManager.rootLogger_);
};
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  var ret = goog.debug.LogManager.loggers_[name];
  return ret || goog.debug.LogManager.createLogger_(name);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot();
    logger.severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")");
  };
};
goog.debug.LogManager.createLogger_ = function(name) {
  var logger = new goog.debug.Logger(name);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf(".");
    var parentName = name.substr(0, lastDotIndex);
    var leafName = name.substr(lastDotIndex + 1);
    var parentLogger = goog.debug.LogManager.getLogger(parentName);
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger);
  }
  goog.debug.LogManager.loggers_[name] = logger;
  return logger;
};
goog.provide("chatango.embed.LocalComm");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventTarget");
goog.require("goog.json.Serializer");
chatango.embed.LocalComm = function() {
  goog.events.EventTarget.call(this);
  this.dest_ = null;
  this.cid_ = null;
  this.connected_ = false;
  this.targetOrigin_ = "*";
  this.Commands = {"syn":this.synRcvd_, "cid":this.cidRcvd_, "ack":this.ackRcvd_, "pageshow":this.pageshowRcvd_, "keyboardup":this.keyboardUpRcvd_, "keyboarddown":this.keyboardDownRcvd_, "iframeresize":this.resizeIFrameRcvd_, "setuserscalable":this.setUserScalableRcvd_, "viewporttoobig":this.viewportTooBigRcvd_, "browserviewrequest":this.browserViewRequestRcvd_, "browserviewresponse":this.browserViewResponseRcvd_, "buttonexpanded":this.buttonExpandedRcvd_, "buttoncollapsed":this.buttonCollapsedRcvd_, 
  "resizedone":this.resizeDoneRcvd_, "resizeondrag":this.resizeOnDrag_, "orientation_change":this.orientationChangeRcvd_, "zoomed":this.zoomedRcvd_, "settitle":this.setTitleRcvd_, "inittitle":this.initTitleRcvd_, "enableresizedragger":this.enableResizeDragger_, "sendtoapp":this.sendToApp_, "androidcallback":this.androidCallback_, "openpm":this.openPm_};
};
goog.addSingletonGetter(chatango.embed.LocalComm);
goog.inherits(chatango.embed.LocalComm, goog.events.EventTarget);
chatango.embed.LocalComm.prototype.logger = goog.debug.Logger.getLogger("chatango.embed.LocalComm");
chatango.embed.LocalComm.prototype.setUp = function(dest, opt_id, opt_emb) {
  this.dest_ = dest;
  goog.events.listen(window, "message", this.onMsg_, false, this);
};
chatango.embed.LocalComm.prototype.send = function(command, opt_obj) {
  if (!(command in this.Commands)) {
    throw "Sending illegal command " + command;
  }
  var send_obj = new Object;
  send_obj["chatango_cmd"] = command;
  if (this.connected_) {
    send_obj["fid"] = this.fid_;
  }
  if (opt_obj) {
    send_obj["payload"] = opt_obj;
  }
  var send_str = goog.json.serialize(send_obj);
  this.dest_.postMessage(send_str, this.targetOrigin_);
};
chatango.embed.LocalComm.prototype.onMsg_ = function(e) {
  e = e.getBrowserEvent();
  if (!e.data) {
    return;
  }
  if (chatango.DEBUG) {
    this.logger.info("onMsg_ " + e.data);
  }
  var rcv_obj;
  try {
    rcv_obj = goog.json.parse(e.data);
  } catch (err) {
    if (chatango.DEBUG) {
      console.log("Chatango: unexpected msg:" + e.data);
    }
    return;
  }
  if (this.connected_) {
    var fid = rcv_obj["fid"];
    if (this.fid_ != fid) {
      return;
    }
  }
  var command = rcv_obj["chatango_cmd"];
  if (!command) {
    return;
  }
  var opt_arg = rcv_obj["payload"] ? [rcv_obj["payload"]] : [];
  this.Commands[command].apply(this, opt_arg);
};
chatango.embed.LocalComm.prototype.getConnected = function() {
  return this.connected_;
};
chatango.embed.LocalComm.prototype.disconnect = function(e) {
  this.connected_ = false;
};
chatango.embed.LocalComm.prototype.resizeDoneRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.buttonCollapsedRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.buttonExpandedRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.enableResizeDragger_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.resizeOnDrag_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.iframeResizeRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.setUserScalableRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.viewportTooBigRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.browserViewResponseRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.browserViewRequestRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.synRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.cidRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.pageshowRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.ackRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.keyboardUpRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.keyboardDownRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.orientationChangeRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.zoomedRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.setTitleRcvd_ = goog.abstractMethod;
chatango.embed.LocalComm.prototype.initTitleRcvd_ = goog.abstractMethod;
goog.provide("goog.debug.RelativeTimeProvider");
goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now();
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(timeStamp) {
  this.relativeTimeStart_ = timeStamp;
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now());
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_;
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_;
};
goog.provide("goog.debug.Formatter");
goog.provide("goog.debug.HtmlFormatter");
goog.provide("goog.debug.TextFormatter");
goog.require("goog.debug");
goog.require("goog.debug.Logger");
goog.require("goog.debug.RelativeTimeProvider");
goog.require("goog.html.SafeHtml");
goog.debug.Formatter = function(opt_prefix) {
  this.prefix_ = opt_prefix || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance();
};
goog.debug.Formatter.prototype.appendNewline = true;
goog.debug.Formatter.prototype.showAbsoluteTime = true;
goog.debug.Formatter.prototype.showRelativeTime = true;
goog.debug.Formatter.prototype.showLoggerName = true;
goog.debug.Formatter.prototype.showExceptionText = false;
goog.debug.Formatter.prototype.showSeverityLevel = false;
goog.debug.Formatter.prototype.formatRecord = goog.abstractMethod;
goog.debug.Formatter.prototype.formatRecordAsHtml = goog.abstractMethod;
goog.debug.Formatter.prototype.setStartTimeProvider = function(provider) {
  this.startTimeProvider_ = provider;
};
goog.debug.Formatter.prototype.getStartTimeProvider = function() {
  return this.startTimeProvider_;
};
goog.debug.Formatter.prototype.resetRelativeTimeStart = function() {
  this.startTimeProvider_.reset();
};
goog.debug.Formatter.getDateTimeStamp_ = function(logRecord) {
  var time = new Date(logRecord.getMillis());
  return goog.debug.Formatter.getTwoDigitString_(time.getFullYear() - 2E3) + goog.debug.Formatter.getTwoDigitString_(time.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(time.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(time.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(time.getMilliseconds() / 10));
};
goog.debug.Formatter.getTwoDigitString_ = function(n) {
  if (n < 10) {
    return "0" + n;
  }
  return String(n);
};
goog.debug.Formatter.getRelativeTime_ = function(logRecord, relativeTimeStart) {
  var ms = logRecord.getMillis() - relativeTimeStart;
  var sec = ms / 1E3;
  var str = sec.toFixed(3);
  var spacesToPrepend = 0;
  if (sec < 1) {
    spacesToPrepend = 2;
  } else {
    while (sec < 100) {
      spacesToPrepend++;
      sec *= 10;
    }
  }
  while (spacesToPrepend-- > 0) {
    str = " " + str;
  }
  return str;
};
goog.debug.HtmlFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = true;
goog.debug.HtmlFormatter.prototype.formatRecord = function(logRecord) {
  if (!logRecord) {
    return "";
  }
  return this.formatRecordAsHtml(logRecord).getTypedStringValue();
};
goog.debug.HtmlFormatter.prototype.formatRecordAsHtml = function(logRecord) {
  if (!logRecord) {
    return goog.html.SafeHtml.EMPTY;
  }
  var className;
  switch(logRecord.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      className = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      className = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      className = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      className = "dbg-i";
      break;
    case goog.debug.Logger.Level.FINE.value:
    ;
    default:
      className = "dbg-f";
      break;
  }
  var sb = [];
  sb.push(this.prefix_, " ");
  if (this.showAbsoluteTime) {
    sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  }
  if (this.showRelativeTime) {
    sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  }
  if (this.showLoggerName) {
    sb.push("[", logRecord.getLoggerName(), "] ");
  }
  if (this.showSeverityLevel) {
    sb.push("[", logRecord.getLevel().name, "] ");
  }
  var fullPrefixHtml = goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(sb.join(""));
  var exceptionHtml = goog.html.SafeHtml.EMPTY;
  if (this.showExceptionText && logRecord.getException()) {
    exceptionHtml = goog.html.SafeHtml.concat(goog.html.SafeHtml.create("br"), goog.debug.exposeExceptionAsHtml(logRecord.getException()));
  }
  var logRecordHtml = goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(logRecord.getMessage());
  var recordAndExceptionHtml = goog.html.SafeHtml.create("span", {"class":className}, goog.html.SafeHtml.concat(logRecordHtml, exceptionHtml));
  var html;
  if (this.appendNewline) {
    html = goog.html.SafeHtml.concat(fullPrefixHtml, recordAndExceptionHtml, goog.html.SafeHtml.create("br"));
  } else {
    html = goog.html.SafeHtml.concat(fullPrefixHtml, recordAndExceptionHtml);
  }
  return html;
};
goog.debug.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(logRecord) {
  var sb = [];
  sb.push(this.prefix_, " ");
  if (this.showAbsoluteTime) {
    sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  }
  if (this.showRelativeTime) {
    sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  }
  if (this.showLoggerName) {
    sb.push("[", logRecord.getLoggerName(), "] ");
  }
  if (this.showSeverityLevel) {
    sb.push("[", logRecord.getLevel().name, "] ");
  }
  sb.push(logRecord.getMessage());
  if (this.showExceptionText) {
    var exception = logRecord.getException();
    if (exception) {
      var exceptionText = exception instanceof Error ? exception.message : exception.toString();
      sb.push("\n", exceptionText);
    }
  }
  if (this.appendNewline) {
    sb.push("\n");
  }
  return sb.join("");
};
goog.debug.TextFormatter.prototype.formatRecordAsHtml = function(logRecord) {
  return goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(goog.debug.TextFormatter.prototype.formatRecord(logRecord));
};
goog.provide("goog.debug.Console");
goog.require("goog.debug.LogManager");
goog.require("goog.debug.Logger");
goog.require("goog.debug.TextFormatter");
goog.debug.Console = function() {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
  this.formatter_ = new goog.debug.TextFormatter;
  this.formatter_.showAbsoluteTime = false;
  this.formatter_.showExceptionText = false;
  this.formatter_.appendNewline = false;
  this.isCapturing_ = false;
  this.logBuffer_ = "";
  this.filteredLoggers_ = {};
};
goog.debug.Console.prototype.getFormatter = function() {
  return this.formatter_;
};
goog.debug.Console.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }
  var rootLogger = goog.debug.LogManager.getRoot();
  if (capturing) {
    rootLogger.addHandler(this.publishHandler_);
  } else {
    rootLogger.removeHandler(this.publishHandler_);
    this.logBuffer = "";
  }
  this.isCapturing_ = capturing;
};
goog.debug.Console.prototype.addLogRecord = function(logRecord) {
  if (this.filteredLoggers_[logRecord.getLoggerName()]) {
    return;
  }
  var record = this.formatter_.formatRecord(logRecord);
  var console = goog.debug.Console.console_;
  if (console) {
    switch(logRecord.getLevel()) {
      case goog.debug.Logger.Level.SHOUT:
        goog.debug.Console.logToConsole_(console, "info", record);
        break;
      case goog.debug.Logger.Level.SEVERE:
        goog.debug.Console.logToConsole_(console, "error", record);
        break;
      case goog.debug.Logger.Level.WARNING:
        goog.debug.Console.logToConsole_(console, "warn", record);
        break;
      default:
        goog.debug.Console.logToConsole_(console, "debug", record);
        break;
    }
  } else {
    this.logBuffer_ += record;
  }
};
goog.debug.Console.prototype.addFilter = function(loggerName) {
  this.filteredLoggers_[loggerName] = true;
};
goog.debug.Console.prototype.removeFilter = function(loggerName) {
  delete this.filteredLoggers_[loggerName];
};
goog.debug.Console.instance = null;
goog.debug.Console.console_ = goog.global["console"];
goog.debug.Console.setConsole = function(console) {
  goog.debug.Console.console_ = console;
};
goog.debug.Console.autoInstall = function() {
  if (!goog.debug.Console.instance) {
    goog.debug.Console.instance = new goog.debug.Console;
  }
  if (goog.global.location && goog.global.location.href.indexOf("Debug=true") != -1) {
    goog.debug.Console.instance.setCapturing(true);
  }
};
goog.debug.Console.show = function() {
  alert(goog.debug.Console.instance.logBuffer_);
};
goog.debug.Console.logToConsole_ = function(console, fnName, record) {
  if (console[fnName]) {
    console[fnName](record);
  } else {
    console.log(record);
  }
};
goog.provide("chatango.embed.LocalCommEvent");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
chatango.embed.LocalCommEvent = function(type, data) {
  goog.base(this, type);
  this.type = type;
  this.data = data;
};
goog.inherits(chatango.embed.LocalCommEvent, goog.events.Event);
goog.provide("chatango.embed.LocalCommChild");
goog.require("chatango.embed.LocalComm");
goog.require("chatango.embed.LocalCommEvent");
goog.require("goog.debug.Logger");
chatango.embed.LocalCommChild = function() {
  chatango.embed.LocalComm.call(this);
};
goog.addSingletonGetter(chatango.embed.LocalCommChild);
goog.inherits(chatango.embed.LocalCommChild, chatango.embed.LocalComm);
chatango.embed.LocalCommChild.prototype.logger = goog.debug.Logger.getLogger("chatango.embed.LocalCommChild");
chatango.embed.LocalCommChild.prototype.setUp = function(dest, opt_id, opt_emb) {
  chatango.embed.LocalCommChild.superClass_.setUp.call(this, dest);
  if (chatango.DEBUG) {
    this.logger.info("sending syn");
  }
  this.send("syn");
};
chatango.embed.LocalCommChild.prototype.resizeDoneRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("resizedone"));
};
chatango.embed.LocalCommChild.prototype.resizeOnDrag_ = function(sz) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("resizeondrag", sz));
};
chatango.embed.LocalCommChild.prototype.keyboardDownRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("kbdown"));
};
chatango.embed.LocalCommChild.prototype.cidRcvd_ = function(init_obj) {
  if (this.connected_) {
    return;
  }
  if (chatango.DEBUG) {
    this.logger.info("connection established for cid " + init_obj["cid"]);
  }
  this.dispatchEvent(new chatango.embed.LocalCommEvent("cid", init_obj));
  this.cid_ = init_obj["cid"];
  this.fid_ = init_obj["fid"];
  this.connected_ = true;
  this.send("ack", init_obj["fid"]);
};
chatango.embed.LocalCommChild.prototype.browserViewResponseRcvd_ = function(sz) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("browserviewresponse", sz));
};
chatango.embed.LocalCommChild.prototype.pageshowRcvd_ = function() {
  if (chatango.DEBUG) {
    this.logger.info("pagewhow");
  }
  this.dispatchEvent(new chatango.embed.LocalCommEvent("pageshow"));
};
chatango.embed.LocalCommChild.prototype.orientationChangeRcvd_ = function(sz) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("orientation_change", sz));
};
chatango.embed.LocalCommChild.prototype.zoomedRcvd_ = function(sz) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("zoomed", sz));
};
chatango.embed.LocalCommChild.prototype.initTitleRcvd_ = function(title) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("inittitle", title));
};
chatango.embed.LocalCommChild.prototype.androidCallback_ = function(data) {
  if (Array.isArray(data) && data.length == 2) {
    chatango.embed.AppComm.getInstance().callback(data[0], data[1]);
  }
};
chatango.embed.LocalCommChild.prototype.openPm_ = function(sid) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("openpm", sid));
};
goog.provide("chatango.utils.userAgent");
goog.require("goog.string");
goog.require("goog.userAgent");
chatango.utils.userAgent.ANDROID = !!goog.userAgent.getUserAgentString().match(/\bAndroid\b/);
chatango.utils.userAgent.isAndroidVersion = function(version) {
  var matches = goog.userAgent.getUserAgentString().match(/\bAndroid\s+(\S+);/);
  if (!matches || matches.length < 2) {
    return false;
  }
  return goog.string.compareVersions(matches[1], version) >= 0;
};
chatango.utils.userAgent.isMobileChrome = function() {
  var matches = goog.userAgent.getUserAgentString().match(/chrome\/(\d*)..*mobile/i);
  if (!matches || matches.length < 2) {
    return false;
  }
};
chatango.utils.userAgent.isMobileChromeRelease = function(version) {
  var matches = goog.userAgent.getUserAgentString().match(/chrome\/(\d*)..*mobile/i);
  if (!matches || matches.length < 2) {
    return false;
  }
  return goog.string.compareVersions(matches[1], version) >= 0;
};
chatango.utils.userAgent.IOS = !!goog.userAgent.getUserAgentString().match(/\b(iOS|iPhone|iPad|iPod)\b/);
chatango.utils.userAgent.isAndroidAppCompatible = function() {
  var ua = goog.userAgent.getUserAgentString();
  var androidVersion = ua.match(/android ([0-9](?:\.[0-9])+)/i);
  var inWebview = /android/i.test(ua) && /version/i.test(ua);
  if (!inWebview && androidVersion != null && androidVersion.length == 2) {
    var version = androidVersion[1].split(".");
    if (version.length > 1 && (version[0] > 4 || version[0] == 4 && version[1] >= 4)) {
      return true;
    }
  }
  return false;
};
goog.provide("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.math.Box = function(top, right, bottom, left) {
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.left = left;
};
goog.math.Box.boundingBox = function(var_args) {
  var box = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x);
  for (var i = 1;i < arguments.length;i++) {
    var coord = arguments[i];
    box.top = Math.min(box.top, coord.y);
    box.right = Math.max(box.right, coord.x);
    box.bottom = Math.max(box.bottom, coord.y);
    box.left = Math.min(box.left, coord.x);
  }
  return box;
};
goog.math.Box.prototype.getWidth = function() {
  return this.right - this.left;
};
goog.math.Box.prototype.getHeight = function() {
  return this.bottom - this.top;
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left);
};
if (goog.DEBUG) {
  goog.math.Box.prototype.toString = function() {
    return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)";
  };
}
goog.math.Box.prototype.contains = function(other) {
  return goog.math.Box.contains(this, other);
};
goog.math.Box.prototype.expand = function(top, opt_right, opt_bottom, opt_left) {
  if (goog.isObject(top)) {
    this.top -= top.top;
    this.right += top.right;
    this.bottom += top.bottom;
    this.left -= top.left;
  } else {
    this.top -= top;
    this.right += opt_right;
    this.bottom += opt_bottom;
    this.left -= opt_left;
  }
  return this;
};
goog.math.Box.prototype.expandToInclude = function(box) {
  this.left = Math.min(this.left, box.left);
  this.top = Math.min(this.top, box.top);
  this.right = Math.max(this.right, box.right);
  this.bottom = Math.max(this.bottom, box.bottom);
};
goog.math.Box.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left;
};
goog.math.Box.contains = function(box, other) {
  if (!box || !other) {
    return false;
  }
  if (other instanceof goog.math.Box) {
    return other.left >= box.left && other.right <= box.right && other.top >= box.top && other.bottom <= box.bottom;
  }
  return other.x >= box.left && other.x <= box.right && other.y >= box.top && other.y <= box.bottom;
};
goog.math.Box.relativePositionX = function(box, coord) {
  if (coord.x < box.left) {
    return coord.x - box.left;
  } else {
    if (coord.x > box.right) {
      return coord.x - box.right;
    }
  }
  return 0;
};
goog.math.Box.relativePositionY = function(box, coord) {
  if (coord.y < box.top) {
    return coord.y - box.top;
  } else {
    if (coord.y > box.bottom) {
      return coord.y - box.bottom;
    }
  }
  return 0;
};
goog.math.Box.distance = function(box, coord) {
  var x = goog.math.Box.relativePositionX(box, coord);
  var y = goog.math.Box.relativePositionY(box, coord);
  return Math.sqrt(x * x + y * y);
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
};
goog.math.Box.intersectsWithPadding = function(a, b, padding) {
  return a.left <= b.right + padding && b.left <= a.right + padding && a.top <= b.bottom + padding && b.top <= a.bottom + padding;
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this;
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this;
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this;
};
goog.math.Box.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.right += tx.x;
    this.top += tx.y;
    this.bottom += tx.y;
  } else {
    this.left += tx;
    this.right += tx;
    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
      this.bottom += opt_ty;
    }
  }
  return this;
};
goog.math.Box.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.right *= sx;
  this.top *= sy;
  this.bottom *= sy;
  return this;
};
goog.provide("goog.math.Rect");
goog.require("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.math.Rect = function(x, y, w, h) {
  this.left = x;
  this.top = y;
  this.width = w;
  this.height = h;
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height);
};
goog.math.Rect.prototype.toBox = function() {
  var right = this.left + this.width;
  var bottom = this.top + this.height;
  return new goog.math.Box(this.top, right, bottom, this.left);
};
goog.math.Rect.createFromBox = function(box) {
  return new goog.math.Rect(box.left, box.top, box.right - box.left, box.bottom - box.top);
};
if (goog.DEBUG) {
  goog.math.Rect.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)";
  };
}
goog.math.Rect.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height;
};
goog.math.Rect.prototype.intersection = function(rect) {
  var x0 = Math.max(this.left, rect.left);
  var x1 = Math.min(this.left + this.width, rect.left + rect.width);
  if (x0 <= x1) {
    var y0 = Math.max(this.top, rect.top);
    var y1 = Math.min(this.top + this.height, rect.top + rect.height);
    if (y0 <= y1) {
      this.left = x0;
      this.top = y0;
      this.width = x1 - x0;
      this.height = y1 - y0;
      return true;
    }
  }
  return false;
};
goog.math.Rect.intersection = function(a, b) {
  var x0 = Math.max(a.left, b.left);
  var x1 = Math.min(a.left + a.width, b.left + b.width);
  if (x0 <= x1) {
    var y0 = Math.max(a.top, b.top);
    var y1 = Math.min(a.top + a.height, b.top + b.height);
    if (y0 <= y1) {
      return new goog.math.Rect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  return null;
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height;
};
goog.math.Rect.prototype.intersects = function(rect) {
  return goog.math.Rect.intersects(this, rect);
};
goog.math.Rect.difference = function(a, b) {
  var intersection = goog.math.Rect.intersection(a, b);
  if (!intersection || !intersection.height || !intersection.width) {
    return[a.clone()];
  }
  var result = [];
  var top = a.top;
  var height = a.height;
  var ar = a.left + a.width;
  var ab = a.top + a.height;
  var br = b.left + b.width;
  var bb = b.top + b.height;
  if (b.top > a.top) {
    result.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    top = b.top;
    height -= b.top - a.top;
  }
  if (bb < ab) {
    result.push(new goog.math.Rect(a.left, bb, a.width, ab - bb));
    height = bb - top;
  }
  if (b.left > a.left) {
    result.push(new goog.math.Rect(a.left, top, b.left - a.left, height));
  }
  if (br < ar) {
    result.push(new goog.math.Rect(br, top, ar - br, height));
  }
  return result;
};
goog.math.Rect.prototype.difference = function(rect) {
  return goog.math.Rect.difference(this, rect);
};
goog.math.Rect.prototype.boundingRect = function(rect) {
  var right = Math.max(this.left + this.width, rect.left + rect.width);
  var bottom = Math.max(this.top + this.height, rect.top + rect.height);
  this.left = Math.min(this.left, rect.left);
  this.top = Math.min(this.top, rect.top);
  this.width = right - this.left;
  this.height = bottom - this.top;
};
goog.math.Rect.boundingRect = function(a, b) {
  if (!a || !b) {
    return null;
  }
  var clone = a.clone();
  clone.boundingRect(b);
  return clone;
};
goog.math.Rect.prototype.contains = function(another) {
  if (another instanceof goog.math.Rect) {
    return this.left <= another.left && this.left + this.width >= another.left + another.width && this.top <= another.top && this.top + this.height >= another.top + another.height;
  } else {
    return another.x >= this.left && another.x <= this.left + this.width && another.y >= this.top && another.y <= this.top + this.height;
  }
};
goog.math.Rect.prototype.squaredDistance = function(point) {
  var dx = point.x < this.left ? this.left - point.x : Math.max(point.x - (this.left + this.width), 0);
  var dy = point.y < this.top ? this.top - point.y : Math.max(point.y - (this.top + this.height), 0);
  return dx * dx + dy * dy;
};
goog.math.Rect.prototype.distance = function(point) {
  return Math.sqrt(this.squaredDistance(point));
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top);
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2);
};
goog.math.Rect.prototype.getBottomRight = function() {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height);
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Rect.prototype.translate = function(tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.top += tx.y;
  } else {
    this.left += tx;
    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
    }
  }
  return this;
};
goog.math.Rect.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.width *= sx;
  this.top *= sy;
  this.height *= sy;
  return this;
};
goog.provide("goog.dom.vendor");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.dom.vendor.getVendorJsPrefix = function() {
  if (goog.userAgent.WEBKIT) {
    return "Webkit";
  } else {
    if (goog.userAgent.GECKO) {
      return "Moz";
    } else {
      if (goog.userAgent.IE) {
        return "ms";
      } else {
        if (goog.userAgent.OPERA) {
          return "O";
        }
      }
    }
  }
  return null;
};
goog.dom.vendor.getVendorPrefix = function() {
  if (goog.userAgent.WEBKIT) {
    return "-webkit";
  } else {
    if (goog.userAgent.GECKO) {
      return "-moz";
    } else {
      if (goog.userAgent.IE) {
        return "-ms";
      } else {
        if (goog.userAgent.OPERA) {
          return "-o";
        }
      }
    }
  }
  return null;
};
goog.dom.vendor.getPrefixedPropertyName = function(propertyName, opt_object) {
  if (opt_object && propertyName in opt_object) {
    return propertyName;
  }
  var prefix = goog.dom.vendor.getVendorJsPrefix();
  if (prefix) {
    prefix = prefix.toLowerCase();
    var prefixedPropertyName = prefix + goog.string.toTitleCase(propertyName);
    return!goog.isDef(opt_object) || prefixedPropertyName in opt_object ? prefixedPropertyName : null;
  }
  return null;
};
goog.dom.vendor.getPrefixedEventType = function(eventType) {
  var prefix = goog.dom.vendor.getVendorJsPrefix() || "";
  return(prefix + eventType).toLowerCase();
};
goog.provide("goog.style");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.vendor");
goog.require("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Rect");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.style.setStyle = function(element, style, opt_value) {
  if (goog.isString(style)) {
    goog.style.setStyle_(element, opt_value, style);
  } else {
    for (var key in style) {
      goog.style.setStyle_(element, style[key], key);
    }
  }
};
goog.style.setStyle_ = function(element, value, style) {
  var propertyName = goog.style.getVendorJsStyleName_(element, style);
  if (propertyName) {
    element.style[propertyName] = value;
  }
};
goog.style.styleNameCache_ = {};
goog.style.getVendorJsStyleName_ = function(element, style) {
  var propertyName = goog.style.styleNameCache_[style];
  if (!propertyName) {
    var camelStyle = goog.string.toCamelCase(style);
    propertyName = camelStyle;
    if (element.style[camelStyle] === undefined) {
      var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(camelStyle);
      if (element.style[prefixedStyle] !== undefined) {
        propertyName = prefixedStyle;
      }
    }
    goog.style.styleNameCache_[style] = propertyName;
  }
  return propertyName;
};
goog.style.getVendorStyleName_ = function(element, style) {
  var camelStyle = goog.string.toCamelCase(style);
  if (element.style[camelStyle] === undefined) {
    var prefixedStyle = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(camelStyle);
    if (element.style[prefixedStyle] !== undefined) {
      return goog.dom.vendor.getVendorPrefix() + "-" + style;
    }
  }
  return style;
};
goog.style.getStyle = function(element, property) {
  var styleValue = element.style[goog.string.toCamelCase(property)];
  if (typeof styleValue !== "undefined") {
    return styleValue;
  }
  return element.style[goog.style.getVendorJsStyleName_(element, property)] || "";
};
goog.style.getComputedStyle = function(element, property) {
  var doc = goog.dom.getOwnerDocument(element);
  if (doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if (styles) {
      return styles[property] || styles.getPropertyValue(property) || "";
    }
  }
  return "";
};
goog.style.getCascadedStyle = function(element, style) {
  return element.currentStyle ? element.currentStyle[style] : null;
};
goog.style.getStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) || goog.style.getCascadedStyle(element, style) || element.style && element.style[style];
};
goog.style.getComputedBoxSizing = function(element) {
  return goog.style.getStyle_(element, "boxSizing") || goog.style.getStyle_(element, "MozBoxSizing") || goog.style.getStyle_(element, "WebkitBoxSizing") || null;
};
goog.style.getComputedPosition = function(element) {
  return goog.style.getStyle_(element, "position");
};
goog.style.getBackgroundColor = function(element) {
  return goog.style.getStyle_(element, "backgroundColor");
};
goog.style.getComputedOverflowX = function(element) {
  return goog.style.getStyle_(element, "overflowX");
};
goog.style.getComputedOverflowY = function(element) {
  return goog.style.getStyle_(element, "overflowY");
};
goog.style.getComputedZIndex = function(element) {
  return goog.style.getStyle_(element, "zIndex");
};
goog.style.getComputedTextAlign = function(element) {
  return goog.style.getStyle_(element, "textAlign");
};
goog.style.getComputedCursor = function(element) {
  return goog.style.getStyle_(element, "cursor");
};
goog.style.getComputedTransform = function(element) {
  var property = goog.style.getVendorStyleName_(element, "transform");
  return goog.style.getStyle_(element, property) || goog.style.getStyle_(element, "transform");
};
goog.style.setPosition = function(el, arg1, opt_arg2) {
  var x, y;
  if (arg1 instanceof goog.math.Coordinate) {
    x = arg1.x;
    y = arg1.y;
  } else {
    x = arg1;
    y = opt_arg2;
  }
  el.style.left = goog.style.getPixelStyleValue_((x), false);
  el.style.top = goog.style.getPixelStyleValue_((y), false);
};
goog.style.getPosition = function(element) {
  return new goog.math.Coordinate(element.offsetLeft, element.offsetTop);
};
goog.style.getClientViewportElement = function(opt_node) {
  var doc;
  if (opt_node) {
    doc = goog.dom.getOwnerDocument(opt_node);
  } else {
    doc = goog.dom.getDocument();
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9) && !goog.dom.getDomHelper(doc).isCss1CompatMode()) {
    return doc.body;
  }
  return doc.documentElement;
};
goog.style.getViewportPageOffset = function(doc) {
  var body = doc.body;
  var documentElement = doc.documentElement;
  var scrollLeft = body.scrollLeft || documentElement.scrollLeft;
  var scrollTop = body.scrollTop || documentElement.scrollTop;
  return new goog.math.Coordinate(scrollLeft, scrollTop);
};
goog.style.getBoundingClientRect_ = function(el) {
  var rect;
  try {
    rect = el.getBoundingClientRect();
  } catch (e) {
    return{"left":0, "top":0, "right":0, "bottom":0};
  }
  if (goog.userAgent.IE && el.ownerDocument.body) {
    var doc = el.ownerDocument;
    rect.left -= doc.documentElement.clientLeft + doc.body.clientLeft;
    rect.top -= doc.documentElement.clientTop + doc.body.clientTop;
  }
  return(rect);
};
goog.style.getOffsetParent = function(element) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return element.offsetParent;
  }
  var doc = goog.dom.getOwnerDocument(element);
  var positionStyle = goog.style.getStyle_(element, "position");
  var skipStatic = positionStyle == "fixed" || positionStyle == "absolute";
  for (var parent = element.parentNode;parent && parent != doc;parent = parent.parentNode) {
    if (parent.nodeType == goog.dom.NodeType.DOCUMENT_FRAGMENT && parent.host) {
      parent = parent.host;
    }
    positionStyle = goog.style.getStyle_((parent), "position");
    skipStatic = skipStatic && positionStyle == "static" && parent != doc.documentElement && parent != doc.body;
    if (!skipStatic && (parent.scrollWidth > parent.clientWidth || parent.scrollHeight > parent.clientHeight || positionStyle == "fixed" || positionStyle == "absolute" || positionStyle == "relative")) {
      return(parent);
    }
  }
  return null;
};
goog.style.getVisibleRectForElement = function(element) {
  var visibleRect = new goog.math.Box(0, Infinity, Infinity, 0);
  var dom = goog.dom.getDomHelper(element);
  var body = dom.getDocument().body;
  var documentElement = dom.getDocument().documentElement;
  var scrollEl = dom.getDocumentScrollElement();
  for (var el = element;el = goog.style.getOffsetParent(el);) {
    if ((!goog.userAgent.IE || el.clientWidth != 0) && (!goog.userAgent.WEBKIT || el.clientHeight != 0 || el != body) && (el != body && el != documentElement && goog.style.getStyle_(el, "overflow") != "visible")) {
      var pos = goog.style.getPageOffset(el);
      var client = goog.style.getClientLeftTop(el);
      pos.x += client.x;
      pos.y += client.y;
      visibleRect.top = Math.max(visibleRect.top, pos.y);
      visibleRect.right = Math.min(visibleRect.right, pos.x + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom, pos.y + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.x);
    }
  }
  var scrollX = scrollEl.scrollLeft, scrollY = scrollEl.scrollTop;
  visibleRect.left = Math.max(visibleRect.left, scrollX);
  visibleRect.top = Math.max(visibleRect.top, scrollY);
  var winSize = dom.getViewportSize();
  visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
  visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
  return visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null;
};
goog.style.getContainerOffsetToScrollInto = function(element, container, opt_center) {
  var elementPos = goog.style.getPageOffset(element);
  var containerPos = goog.style.getPageOffset(container);
  var containerBorder = goog.style.getBorderBox(container);
  var relX = elementPos.x - containerPos.x - containerBorder.left;
  var relY = elementPos.y - containerPos.y - containerBorder.top;
  var spaceX = container.clientWidth - element.offsetWidth;
  var spaceY = container.clientHeight - element.offsetHeight;
  var scrollLeft = container.scrollLeft;
  var scrollTop = container.scrollTop;
  if (container == goog.dom.getDocument().body || container == goog.dom.getDocument().documentElement) {
    scrollLeft = containerPos.x + containerBorder.left;
    scrollTop = containerPos.y + containerBorder.top;
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(10)) {
      scrollLeft += containerBorder.left;
      scrollTop += containerBorder.top;
    }
  }
  if (opt_center) {
    scrollLeft += relX - spaceX / 2;
    scrollTop += relY - spaceY / 2;
  } else {
    scrollLeft += Math.min(relX, Math.max(relX - spaceX, 0));
    scrollTop += Math.min(relY, Math.max(relY - spaceY, 0));
  }
  return new goog.math.Coordinate(scrollLeft, scrollTop);
};
goog.style.scrollIntoContainerView = function(element, container, opt_center) {
  var offset = goog.style.getContainerOffsetToScrollInto(element, container, opt_center);
  container.scrollLeft = offset.x;
  container.scrollTop = offset.y;
};
goog.style.getClientLeftTop = function(el) {
  return new goog.math.Coordinate(el.clientLeft, el.clientTop);
};
goog.style.getPageOffset = function(el) {
  var doc = goog.dom.getOwnerDocument(el);
  goog.asserts.assertObject(el, "Parameter is required");
  var pos = new goog.math.Coordinate(0, 0);
  var viewportElement = goog.style.getClientViewportElement(doc);
  if (el == viewportElement) {
    return pos;
  }
  var box = goog.style.getBoundingClientRect_(el);
  var scrollCoord = goog.dom.getDomHelper(doc).getDocumentScroll();
  pos.x = box.left + scrollCoord.x;
  pos.y = box.top + scrollCoord.y;
  return pos;
};
goog.style.getPageOffsetLeft = function(el) {
  return goog.style.getPageOffset(el).x;
};
goog.style.getPageOffsetTop = function(el) {
  return goog.style.getPageOffset(el).y;
};
goog.style.getFramedPageOffset = function(el, relativeWin) {
  var position = new goog.math.Coordinate(0, 0);
  var currentWin = goog.dom.getWindow(goog.dom.getOwnerDocument(el));
  var currentEl = el;
  do {
    var offset = currentWin == relativeWin ? goog.style.getPageOffset(currentEl) : goog.style.getClientPositionForElement_(goog.asserts.assert(currentEl));
    position.x += offset.x;
    position.y += offset.y;
  } while (currentWin && currentWin != relativeWin && currentWin != currentWin.parent && (currentEl = currentWin.frameElement) && (currentWin = currentWin.parent));
  return position;
};
goog.style.translateRectForAnotherFrame = function(rect, origBase, newBase) {
  if (origBase.getDocument() != newBase.getDocument()) {
    var body = origBase.getDocument().body;
    var pos = goog.style.getFramedPageOffset(body, newBase.getWindow());
    pos = goog.math.Coordinate.difference(pos, goog.style.getPageOffset(body));
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9) && !origBase.isCss1CompatMode()) {
      pos = goog.math.Coordinate.difference(pos, origBase.getDocumentScroll());
    }
    rect.left += pos.x;
    rect.top += pos.y;
  }
};
goog.style.getRelativePosition = function(a, b) {
  var ap = goog.style.getClientPosition(a);
  var bp = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(ap.x - bp.x, ap.y - bp.y);
};
goog.style.getClientPositionForElement_ = function(el) {
  var box = goog.style.getBoundingClientRect_(el);
  return new goog.math.Coordinate(box.left, box.top);
};
goog.style.getClientPosition = function(el) {
  goog.asserts.assert(el);
  if (el.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_((el));
  } else {
    var isAbstractedEvent = goog.isFunction(el.getBrowserEvent);
    var be = (el);
    var targetEvent = el;
    if (el.targetTouches && el.targetTouches.length) {
      targetEvent = el.targetTouches[0];
    } else {
      if (isAbstractedEvent && be.getBrowserEvent().targetTouches && be.getBrowserEvent().targetTouches.length) {
        targetEvent = be.getBrowserEvent().targetTouches[0];
      }
    }
    return new goog.math.Coordinate(targetEvent.clientX, targetEvent.clientY);
  }
};
goog.style.setPageOffset = function(el, x, opt_y) {
  var cur = goog.style.getPageOffset(el);
  if (x instanceof goog.math.Coordinate) {
    opt_y = x.y;
    x = x.x;
  }
  var dx = x - cur.x;
  var dy = opt_y - cur.y;
  goog.style.setPosition(el, el.offsetLeft + dx, el.offsetTop + dy);
};
goog.style.setSize = function(element, w, opt_h) {
  var h;
  if (w instanceof goog.math.Size) {
    h = w.height;
    w = w.width;
  } else {
    if (opt_h == undefined) {
      throw Error("missing height argument");
    }
    h = opt_h;
  }
  goog.style.setWidth(element, (w));
  goog.style.setHeight(element, (h));
};
goog.style.getPixelStyleValue_ = function(value, round) {
  if (typeof value == "number") {
    value = (round ? Math.round(value) : value) + "px";
  }
  return value;
};
goog.style.setHeight = function(element, height) {
  element.style.height = goog.style.getPixelStyleValue_(height, true);
};
goog.style.setWidth = function(element, width) {
  element.style.width = goog.style.getPixelStyleValue_(width, true);
};
goog.style.getSize = function(element) {
  return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, (element));
};
goog.style.evaluateWithTemporaryDisplay_ = function(fn, element) {
  if (goog.style.getStyle_(element, "display") != "none") {
    return fn(element);
  }
  var style = element.style;
  var originalDisplay = style.display;
  var originalVisibility = style.visibility;
  var originalPosition = style.position;
  style.visibility = "hidden";
  style.position = "absolute";
  style.display = "inline";
  var retVal = fn(element);
  style.display = originalDisplay;
  style.position = originalPosition;
  style.visibility = originalVisibility;
  return retVal;
};
goog.style.getSizeWithDisplay_ = function(element) {
  var offsetWidth = element.offsetWidth;
  var offsetHeight = element.offsetHeight;
  var webkitOffsetsZero = goog.userAgent.WEBKIT && !offsetWidth && !offsetHeight;
  if ((!goog.isDef(offsetWidth) || webkitOffsetsZero) && element.getBoundingClientRect) {
    var clientRect = goog.style.getBoundingClientRect_(element);
    return new goog.math.Size(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
  }
  return new goog.math.Size(offsetWidth, offsetHeight);
};
goog.style.getTransformedSize = function(element) {
  if (!element.getBoundingClientRect) {
    return null;
  }
  var clientRect = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, element);
  return new goog.math.Size(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
};
goog.style.getBounds = function(element) {
  var o = goog.style.getPageOffset(element);
  var s = goog.style.getSize(element);
  return new goog.math.Rect(o.x, o.y, s.width, s.height);
};
goog.style.toCamelCase = function(selector) {
  return goog.string.toCamelCase(String(selector));
};
goog.style.toSelectorCase = function(selector) {
  return goog.string.toSelectorCase(selector);
};
goog.style.getOpacity = function(el) {
  var style = el.style;
  var result = "";
  if ("opacity" in style) {
    result = style.opacity;
  } else {
    if ("MozOpacity" in style) {
      result = style.MozOpacity;
    } else {
      if ("filter" in style) {
        var match = style.filter.match(/alpha\(opacity=([\d.]+)\)/);
        if (match) {
          result = String(match[1] / 100);
        }
      }
    }
  }
  return result == "" ? result : Number(result);
};
goog.style.setOpacity = function(el, alpha) {
  var style = el.style;
  if ("opacity" in style) {
    style.opacity = alpha;
  } else {
    if ("MozOpacity" in style) {
      style.MozOpacity = alpha;
    } else {
      if ("filter" in style) {
        if (alpha === "") {
          style.filter = "";
        } else {
          style.filter = "alpha(opacity=" + alpha * 100 + ")";
        }
      }
    }
  }
};
goog.style.setTransparentBackgroundImage = function(el, src) {
  var style = el.style;
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8")) {
    style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(" + 'src="' + src + '", sizingMethod="crop")';
  } else {
    style.backgroundImage = "url(" + src + ")";
    style.backgroundPosition = "top left";
    style.backgroundRepeat = "no-repeat";
  }
};
goog.style.clearTransparentBackgroundImage = function(el) {
  var style = el.style;
  if ("filter" in style) {
    style.filter = "";
  } else {
    style.backgroundImage = "none";
  }
};
goog.style.showElement = function(el, display) {
  goog.style.setElementShown(el, display);
};
goog.style.setElementShown = function(el, isShown) {
  el.style.display = isShown ? "" : "none";
};
goog.style.isElementShown = function(el) {
  return el.style.display != "none";
};
goog.style.installStyles = function(stylesString, opt_node) {
  var dh = goog.dom.getDomHelper(opt_node);
  var styleSheet = null;
  var doc = dh.getDocument();
  if (goog.userAgent.IE && doc.createStyleSheet) {
    styleSheet = doc.createStyleSheet();
    goog.style.setStyles(styleSheet, stylesString);
  } else {
    var head = dh.getElementsByTagNameAndClass("head")[0];
    if (!head) {
      var body = dh.getElementsByTagNameAndClass("body")[0];
      head = dh.createDom("head");
      body.parentNode.insertBefore(head, body);
    }
    styleSheet = dh.createDom("style");
    goog.style.setStyles(styleSheet, stylesString);
    dh.appendChild(head, styleSheet);
  }
  return styleSheet;
};
goog.style.uninstallStyles = function(styleSheet) {
  var node = styleSheet.ownerNode || styleSheet.owningElement || (styleSheet);
  goog.dom.removeNode(node);
};
goog.style.setStyles = function(element, stylesString) {
  if (goog.userAgent.IE && goog.isDef(element.cssText)) {
    element.cssText = stylesString;
  } else {
    element.innerHTML = stylesString;
  }
};
goog.style.setPreWrap = function(el) {
  var style = el.style;
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8")) {
    style.whiteSpace = "pre";
    style.wordWrap = "break-word";
  } else {
    if (goog.userAgent.GECKO) {
      style.whiteSpace = "-moz-pre-wrap";
    } else {
      style.whiteSpace = "pre-wrap";
    }
  }
};
goog.style.setInlineBlock = function(el) {
  var style = el.style;
  style.position = "relative";
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8")) {
    style.zoom = "1";
    style.display = "inline";
  } else {
    style.display = "inline-block";
  }
};
goog.style.isRightToLeft = function(el) {
  return "rtl" == goog.style.getStyle_(el, "direction");
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(el) {
  if (goog.style.unselectableStyle_) {
    return el.style[goog.style.unselectableStyle_].toLowerCase() == "none";
  } else {
    if (goog.userAgent.IE || goog.userAgent.OPERA) {
      return el.getAttribute("unselectable") == "on";
    }
  }
  return false;
};
goog.style.setUnselectable = function(el, unselectable, opt_noRecurse) {
  var descendants = !opt_noRecurse ? el.getElementsByTagName("*") : null;
  var name = goog.style.unselectableStyle_;
  if (name) {
    var value = unselectable ? "none" : "";
    el.style[name] = value;
    if (descendants) {
      for (var i = 0, descendant;descendant = descendants[i];i++) {
        descendant.style[name] = value;
      }
    }
  } else {
    if (goog.userAgent.IE || goog.userAgent.OPERA) {
      var value = unselectable ? "on" : "";
      el.setAttribute("unselectable", value);
      if (descendants) {
        for (var i = 0, descendant;descendant = descendants[i];i++) {
          descendant.setAttribute("unselectable", value);
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(element) {
  return new goog.math.Size(element.offsetWidth, element.offsetHeight);
};
goog.style.setBorderBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("10") && (!isCss1CompatMode || !goog.userAgent.isVersionOrHigher("8"))) {
    var style = element.style;
    if (isCss1CompatMode) {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right;
      style.pixelHeight = size.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom;
    } else {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    }
  } else {
    goog.style.setBoxSizingSize_(element, size, "border-box");
  }
};
goog.style.getContentBoxSize = function(element) {
  var doc = goog.dom.getOwnerDocument(element);
  var ieCurrentStyle = goog.userAgent.IE && element.currentStyle;
  if (ieCurrentStyle && goog.dom.getDomHelper(doc).isCss1CompatMode() && ieCurrentStyle.width != "auto" && ieCurrentStyle.height != "auto" && !ieCurrentStyle.boxSizing) {
    var width = goog.style.getIePixelValue_(element, ieCurrentStyle.width, "width", "pixelWidth");
    var height = goog.style.getIePixelValue_(element, ieCurrentStyle.height, "height", "pixelHeight");
    return new goog.math.Size(width, height);
  } else {
    var borderBoxSize = goog.style.getBorderBoxSize(element);
    var paddingBox = goog.style.getPaddingBox(element);
    var borderBox = goog.style.getBorderBox(element);
    return new goog.math.Size(borderBoxSize.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right, borderBoxSize.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom);
  }
};
goog.style.setContentBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("10") && (!isCss1CompatMode || !goog.userAgent.isVersionOrHigher("8"))) {
    var style = element.style;
    if (isCss1CompatMode) {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height;
    } else {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width + borderBox.left + paddingBox.left + paddingBox.right + borderBox.right;
      style.pixelHeight = size.height + borderBox.top + paddingBox.top + paddingBox.bottom + borderBox.bottom;
    }
  } else {
    goog.style.setBoxSizingSize_(element, size, "content-box");
  }
};
goog.style.setBoxSizingSize_ = function(element, size, boxSizing) {
  var style = element.style;
  if (goog.userAgent.GECKO) {
    style.MozBoxSizing = boxSizing;
  } else {
    if (goog.userAgent.WEBKIT) {
      style.WebkitBoxSizing = boxSizing;
    } else {
      style.boxSizing = boxSizing;
    }
  }
  style.width = Math.max(size.width, 0) + "px";
  style.height = Math.max(size.height, 0) + "px";
};
goog.style.getIePixelValue_ = function(element, value, name, pixelName) {
  if (/^\d+px?$/.test(value)) {
    return parseInt(value, 10);
  } else {
    var oldStyleValue = element.style[name];
    var oldRuntimeValue = element.runtimeStyle[name];
    element.runtimeStyle[name] = element.currentStyle[name];
    element.style[name] = value;
    var pixelValue = element.style[pixelName];
    element.style[name] = oldStyleValue;
    element.runtimeStyle[name] = oldRuntimeValue;
    return pixelValue;
  }
};
goog.style.getIePixelDistance_ = function(element, propName) {
  var value = goog.style.getCascadedStyle(element, propName);
  return value ? goog.style.getIePixelValue_(element, value, "left", "pixelLeft") : 0;
};
goog.style.getBox_ = function(element, stylePrefix) {
  if (goog.userAgent.IE) {
    var left = goog.style.getIePixelDistance_(element, stylePrefix + "Left");
    var right = goog.style.getIePixelDistance_(element, stylePrefix + "Right");
    var top = goog.style.getIePixelDistance_(element, stylePrefix + "Top");
    var bottom = goog.style.getIePixelDistance_(element, stylePrefix + "Bottom");
    return new goog.math.Box(top, right, bottom, left);
  } else {
    var left = (goog.style.getComputedStyle(element, stylePrefix + "Left"));
    var right = (goog.style.getComputedStyle(element, stylePrefix + "Right"));
    var top = (goog.style.getComputedStyle(element, stylePrefix + "Top"));
    var bottom = (goog.style.getComputedStyle(element, stylePrefix + "Bottom"));
    return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left));
  }
};
goog.style.getPaddingBox = function(element) {
  return goog.style.getBox_(element, "padding");
};
goog.style.getMarginBox = function(element) {
  return goog.style.getBox_(element, "margin");
};
goog.style.ieBorderWidthKeywords_ = {"thin":2, "medium":4, "thick":6};
goog.style.getIePixelBorder_ = function(element, prop) {
  if (goog.style.getCascadedStyle(element, prop + "Style") == "none") {
    return 0;
  }
  var width = goog.style.getCascadedStyle(element, prop + "Width");
  if (width in goog.style.ieBorderWidthKeywords_) {
    return goog.style.ieBorderWidthKeywords_[width];
  }
  return goog.style.getIePixelValue_(element, width, "left", "pixelLeft");
};
goog.style.getBorderBox = function(element) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    var left = goog.style.getIePixelBorder_(element, "borderLeft");
    var right = goog.style.getIePixelBorder_(element, "borderRight");
    var top = goog.style.getIePixelBorder_(element, "borderTop");
    var bottom = goog.style.getIePixelBorder_(element, "borderBottom");
    return new goog.math.Box(top, right, bottom, left);
  } else {
    var left = (goog.style.getComputedStyle(element, "borderLeftWidth"));
    var right = (goog.style.getComputedStyle(element, "borderRightWidth"));
    var top = (goog.style.getComputedStyle(element, "borderTopWidth"));
    var bottom = (goog.style.getComputedStyle(element, "borderBottomWidth"));
    return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left));
  }
};
goog.style.getFontFamily = function(el) {
  var doc = goog.dom.getOwnerDocument(el);
  var font = "";
  if (doc.body.createTextRange && goog.dom.contains(doc, el)) {
    var range = doc.body.createTextRange();
    range.moveToElementText(el);
    try {
      font = range.queryCommandValue("FontName");
    } catch (e) {
      font = "";
    }
  }
  if (!font) {
    font = goog.style.getStyle_(el, "fontFamily");
  }
  var fontsArray = font.split(",");
  if (fontsArray.length > 1) {
    font = fontsArray[0];
  }
  return goog.string.stripQuotes(font, "\"'");
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(value) {
  var units = value.match(goog.style.lengthUnitRegex_);
  return units && units[0] || null;
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {"cm":1, "in":1, "mm":1, "pc":1, "pt":1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {"em":1, "ex":1};
goog.style.getFontSize = function(el) {
  var fontSize = goog.style.getStyle_(el, "fontSize");
  var sizeUnits = goog.style.getLengthUnits(fontSize);
  if (fontSize && "px" == sizeUnits) {
    return parseInt(fontSize, 10);
  }
  if (goog.userAgent.IE) {
    if (sizeUnits in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(el, fontSize, "left", "pixelLeft");
    } else {
      if (el.parentNode && el.parentNode.nodeType == goog.dom.NodeType.ELEMENT && sizeUnits in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
        var parentElement = (el.parentNode);
        var parentSize = goog.style.getStyle_(parentElement, "fontSize");
        return goog.style.getIePixelValue_(parentElement, fontSize == parentSize ? "1em" : fontSize, "left", "pixelLeft");
      }
    }
  }
  var sizeElement = goog.dom.createDom("span", {"style":"visibility:hidden;position:absolute;" + "line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(el, sizeElement);
  fontSize = sizeElement.offsetHeight;
  goog.dom.removeNode(sizeElement);
  return fontSize;
};
goog.style.parseStyleAttribute = function(value) {
  var result = {};
  goog.array.forEach(value.split(/\s*;\s*/), function(pair) {
    var keyValue = pair.split(/\s*:\s*/);
    if (keyValue.length == 2) {
      result[goog.string.toCamelCase(keyValue[0].toLowerCase())] = keyValue[1];
    }
  });
  return result;
};
goog.style.toStyleAttribute = function(obj) {
  var buffer = [];
  goog.object.forEach(obj, function(value, key) {
    buffer.push(goog.string.toSelectorCase(key), ":", value, ";");
  });
  return buffer.join("");
};
goog.style.setFloat = function(el, value) {
  el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = value;
};
goog.style.getFloat = function(el) {
  return el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || "";
};
goog.style.getScrollbarWidth = function(opt_className) {
  var outerDiv = goog.dom.createElement("div");
  if (opt_className) {
    outerDiv.className = opt_className;
  }
  outerDiv.style.cssText = "overflow:auto;" + "position:absolute;top:0;width:100px;height:100px";
  var innerDiv = goog.dom.createElement("div");
  goog.style.setSize(innerDiv, "200px", "200px");
  outerDiv.appendChild(innerDiv);
  goog.dom.appendChild(goog.dom.getDocument().body, outerDiv);
  var width = outerDiv.offsetWidth - outerDiv.clientWidth;
  goog.dom.removeNode(outerDiv);
  return width;
};
goog.style.MATRIX_TRANSLATION_REGEX_ = new RegExp("matrix\\([0-9\\.\\-]+, [0-9\\.\\-]+, " + "[0-9\\.\\-]+, [0-9\\.\\-]+, " + "([0-9\\.\\-]+)p?x?, ([0-9\\.\\-]+)p?x?\\)");
goog.style.getCssTranslation = function(element) {
  var transform = goog.style.getComputedTransform(element);
  if (!transform) {
    return new goog.math.Coordinate(0, 0);
  }
  var matches = transform.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  if (!matches) {
    return new goog.math.Coordinate(0, 0);
  }
  return new goog.math.Coordinate(parseFloat(matches[1]), parseFloat(matches[2]));
};
goog.provide("chatango.utils.cssom");
goog.require("goog.dom");
goog.require("goog.math");
chatango.utils.cssom.MAIN_STYLE_SHEET = null;
chatango.utils.cssom.createNewStyleSheet = function() {
  var head = goog.dom.getElementsByTagNameAndClass("head")[0];
  var style = goog.dom.createDom("style", {"type":"text/css"});
  if (!goog.userAgent.IE) {
    goog.dom.append(style, goog.dom.createTextNode(""));
  }
  goog.dom.append(head, style);
  var linkCount = 0;
  var nodeList = goog.dom.getChildren(goog.dom.getChildren(document)[0]);
  var i;
  for (i = 0;i < nodeList.length;i++) {
    if (nodeList[i].nodeName.toLowerCase() == "link") {
      linkCount++;
    }
  }
  return document.styleSheets[document.styleSheets.length - 1 - linkCount];
};
chatango.utils.cssom.addCssRule = function(stylesheet, rule) {
  stylesheet.insertRule(rule, stylesheet.cssRules.length);
};
chatango.utils.cssom.getOpacityValues = function(opacity, opt_defaultValue) {
  opt_defaultValue = opt_defaultValue == null ? 100 : opt_defaultValue;
  if (isNaN(opt_defaultValue)) {
    opt_defaultValue = 100;
  }
  if (opacity == null) {
    opacity = opt_defaultValue;
  }
  if (isNaN(opacity)) {
    opacity = opt_defaultValue;
  }
  opacity = Math.round(goog.math.clamp(opacity, 0, 100));
  return[opacity / 100, opacity];
};
chatango.utils.cssom.getValidHex = function(col, opt_defaultValue) {
  try {
    col = goog.color.parse(col).hex;
  } catch (e) {
    try {
      col = goog.color.parse(opt_defaultValue).hex;
    } catch (ee) {
      col = "#FFFFFF";
    }
  }
  return col;
};
chatango.utils.cssom.getMainStyleSheet = function() {
  if (!chatango.utils.cssom.MAIN_STYLE_SHEET) {
    chatango.utils.cssom.MAIN_STYLE_SHEET = chatango.utils.cssom.createNewStyleSheet();
  }
  return chatango.utils.cssom.MAIN_STYLE_SHEET;
};
chatango.utils.cssom.setCssRule = function(newRule, opt_oldRule, opt_styleSheet) {
  var ss = opt_styleSheet ? opt_styleSheet : chatango.utils.cssom.getMainStyleSheet();
  var rules;
  var ind;
  if (opt_oldRule) {
    ind = goog.cssom.getCssRuleIndexInParentStyleSheet(opt_oldRule, ss);
    goog.cssom.replaceCssRule(opt_oldRule, newRule, ss, ind);
    rules = goog.cssom.getCssRulesFromStyleSheet(ss);
  } else {
    goog.cssom.addCssRule(ss, newRule);
    rules = goog.cssom.getCssRulesFromStyleSheet(ss);
    ind = rules.length - 1;
  }
  return rules[ind];
};
chatango.utils.cssom.getVerticalStripesCss = function(stripesArr) {
  var value;
  var len = stripesArr.length;
  if (len == 0) {
    value = "none";
  } else {
    if (len == 1) {
      value = stripesArr[0];
      if (stripesArr[0] == "mod") {
        value = chatango.utils.cssom.getModStripesCss();
      }
    } else {
      value = "linear-gradient(90deg";
      var stripeWidth = Math.round(1E3 / len) / 10;
      var xStop = 0;
      var i;
      var isModMsg = false;
      var col;
      for (i = 0;i < len;i++) {
        col = stripesArr[i];
        if (col == "mod") {
          isModMsg = true;
          col = "transparent";
        }
        value = value + ", " + col + " " + xStop + "%";
        xStop += stripeWidth;
        xStop = Math.min(100, xStop);
        value = value + ", " + col + " " + xStop + "%";
      }
      value = value + ")";
      if (isModMsg) {
        value = value + ", " + chatango.utils.cssom.getModStripesCss();
      }
    }
  }
  return value;
};
chatango.utils.cssom.getModStripesCss = function() {
  var mc1 = "#333";
  var mc2 = "#777";
  return "linear-gradient(-45deg, " + mc1 + " 20%, " + mc2 + " 20%, " + mc2 + " 40%, " + mc1 + " 40%, " + mc1 + " 60%, " + mc2 + " 60%, " + mc2 + " 80%, " + mc1 + " 80%)";
};
goog.provide("chatango.managers.ScaleManager");
goog.require("chatango.group.GroupEmbedTypes");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Environment.DeviceType");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.utils.cssom");
goog.require("chatango.utils.userAgent");
goog.require("goog.style");
chatango.managers.ScaleManager = function() {
  goog.events.EventTarget.call(this);
  this.isStandAlonePm_ = false;
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
};
goog.inherits(chatango.managers.ScaleManager, goog.events.EventTarget);
goog.addSingletonGetter(chatango.managers.ScaleManager);
chatango.managers.ScaleManager.MIN_FULL_FEATURE_WIDTH = 180;
chatango.managers.ScaleManager.MIN_FULL_FEATURE_HEIGHT = 240;
chatango.managers.ScaleManager.MEDIUM_WIDTH = 250;
chatango.managers.ScaleManager.prototype.scale_ = 100;
chatango.managers.ScaleManager.prototype.useFixedScale_ = false;
chatango.managers.ScaleManager.prototype.useGivenScale_ = -1;
chatango.managers.ScaleManager.prototype.forceUseDesktopScale_ = false;
chatango.managers.ScaleManager.prototype.getScale = function() {
  return this.scale_;
};
chatango.managers.ScaleManager.prototype.setWindowSize = function(width, height) {
  this.windowWidth_ = width;
  this.windowHeight_ = height;
};
chatango.managers.ScaleManager.prototype.getWindowSize = function() {
  return new goog.math.Size(this.windowWidth_, this.windowHeight_);
};
chatango.managers.ScaleManager.prototype.getOrientation = function() {
  var stage_size = this.vsm_.getSize();
  var width = stage_size.width;
  var height = stage_size.height;
  this.orientation_ = width > height ? "l" : "p";
  return this.orientation_;
};
chatango.managers.ScaleManager.prototype.embedType_ = chatango.group.GroupEmbedTypes.BOX;
chatango.managers.ScaleManager.prototype.setEmbedType = function(embedType) {
  this.embedType_ = embedType;
};
chatango.managers.ScaleManager.prototype.getEmbedType = function() {
  return this.embedType_;
};
chatango.managers.ScaleManager.prototype.updateScale = function(opt_forceUpdate, opt_isFullSizeGroup, opt_setWindowSizeStageSize) {
  var redraw = false;
  var isFullSize = opt_isFullSizeGroup ? true : this.isStandAlonePm_;
  var device_type = chatango.managers.Environment.getInstance().getDeviceType();
  var divisor;
  var stage_size = this.vsm_.getSize();
  var width = stage_size.width;
  var height = stage_size.height;
  var area = width * height;
  var sqrt = Math.sqrt(area);
  if (opt_setWindowSizeStageSize) {
    this.setWindowSize(width, height);
  }
  var parentWindowArea = this.windowWidth_ * this.windowHeight_;
  var parentSqrt = Math.sqrt(parentWindowArea);
  var orientation;
  if (this.lastWidth_ == width) {
    orientation = this.orientation_;
  } else {
    orientation = width > height ? "l" : "p";
  }
  this.lastWidth_ = width;
  this.lastHeight_ = height;
  if (orientation == this.orientation_ && !opt_forceUpdate) {
    return;
  }
  this.orientation_ = orientation;
  var mobileScale = 120;
  var smallTabletScale = 125;
  var tabletScale = 130;
  var desktopScale = 80;
  switch(device_type) {
    case chatango.managers.Environment.DeviceType.MOBILE:
      if (isFullSize || this.embedType_ != chatango.group.GroupEmbedTypes.BOX) {
        if (this.useFixedScale_) {
          this.scale_ = mobileScale;
        } else {
          divisor = this.orientation_ == "l" && !isFullSize ? 5 : 4;
          this.scale_ = Math.round(parentSqrt / divisor / 10) * 10;
        }
      } else {
        this.scale_ = desktopScale;
      }
      break;
    case chatango.managers.Environment.DeviceType.TABLET:
      if (isFullSize) {
        if (this.useFixedScale_) {
          this.scale_ = chatango.managers.Environment.getInstance().isSmallTablet() ? smallTabletScale : tabletScale;
        } else {
          divisor = chatango.managers.Environment.getInstance().isSmallTablet() ? 6 : 8;
          this.scale_ = Math.round(parentSqrt / divisor / 10) * 10;
        }
      } else {
        this.scale_ = desktopScale;
      }
      break;
    case chatango.managers.Environment.DeviceType.DESKTOP:
    ;
    default:
      this.scale_ = desktopScale;
  }
  if (this.forceUseDesktopScale_ || chatango.managers.Environment.getInstance().isMockGroup() && !chatango.managers.Environment.getInstance().isEmbeddableMockGroup()) {
    this.scale_ = desktopScale;
    this.useFixedScale_ = false;
  }
  if (this.useGivenScale_ != -1) {
    this.scale_ = this.useGivenScale_;
  }
  goog.style.setStyle(goog.dom.getDocument().body, "fontSize", this.scale_ + "%");
};
chatango.managers.ScaleManager.prototype.setStandAlonePm = function(bool) {
  this.isStandAlonePm_ = bool;
};
chatango.managers.ScaleManager.prototype.useFixedScale = function(bool) {
  this.useFixedScale_ = bool;
};
chatango.managers.ScaleManager.prototype.forceUseDesktopScale = function(bool) {
  this.forceUseDesktopScale_ = bool;
};
chatango.managers.ScaleManager.prototype.useGivenScale = function(scale) {
  this.useGivenScale_ = scale;
};
chatango.managers.ScaleManager.prototype.isBelowFullFeaturedSize = function() {
  var w = this.vsm_.getSize().width;
  var h = this.vsm_.getSize().height;
  return w < chatango.managers.ScaleManager.MIN_FULL_FEATURE_WIDTH || h < chatango.managers.ScaleManager.MIN_FULL_FEATURE_HEIGHT;
};
chatango.managers.ScaleManager.prototype.isBelowFullFeaturedWidth = function() {
  var w = this.vsm_.getSize().width;
  return w < chatango.managers.ScaleManager.MIN_FULL_FEATURE_WIDTH;
};
chatango.managers.ScaleManager.prototype.isBelowFullFeaturedHeight = function() {
  var h = this.vsm_.getSize().height;
  return h < chatango.managers.ScaleManager.MIN_FULL_FEATURE_HEIGHT;
};
chatango.managers.ScaleManager.prototype.isBelowMediumWidth = function() {
  var w = this.vsm_.getSize().width;
  return w < chatango.managers.ScaleManager.MEDIUM_WIDTH;
};
goog.provide("chatango.utils.formatting");
chatango.utils.formatting.YOUTUBE_HREF_GRP_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
chatango.utils.formatting.YOUTUBE_HREF_GRP_REGEX_GREEDY = new RegExp(chatango.utils.formatting.YOUTUBE_HREF_GRP_REGEX.toString().slice(1, -1), "g");
chatango.utils.formatting.YOUTUBE_HREF_PM_REGEX = /vid:\/\/yt:([^"&?\/ ]{11})/;
chatango.utils.formatting.IMG_HREF_REGEX = /((https?:\/\/)?[^ ]+\.(?:jpg|jpeg|png|bmp|gif))/;
chatango.utils.formatting.IMG_HREF_REGEX_GREEDY = /((https?:\/\/)?[^ ]+\.(?:jpg|jpeg|png|bmp|gif))/g;
chatango.utils.formatting.HREF_REGEX = /^((?:https?:\/\/|www\.)[^ ]+)/;
chatango.utils.formatting.TLD_REGEX = /(?:\.(?:com|org|net|ru|de|es|to|ar|mx|ly|sh|nz)|^(?:com|org|net|ru|de|es|ar|mx|ly|sh|nz)$)/i;
chatango.utils.formatting.SLASH_REGEX = /\//;
chatango.utils.formatting.LINK_BAN_EVASION = /(?:\.(?:c0m|0rg|n3t)|^(?:c0m|0rg|n3t)$)|(?:\W(dot|slash))/i;
chatango.utils.formatting.LINK_BAN_EVASION_GLOBAL_SPELLED = /(?:\sdot\s.+slash\s)|(?:dot\w+slash\w+slash)/i;
chatango.utils.formatting.LINK_BAN_EVASION_GLOBAL = /(?:\.(?:com|org|net|ru|de|es|to|ar|mx|ly|sh|nz)\/.*\w+)/i;
chatango.utils.formatting.WWW_REGEX = /^www\.[^ ]+/;
chatango.utils.formatting.AMAZON_REGEX = /amazon\.com/;
chatango.utils.formatting.TAG_REGEX = /tag=/;
chatango.utils.formatting.GET_REGEX = /\?/;
chatango.utils.formatting.CM_MSG_TOK = /cm:\/\//;
chatango.utils.formatting.PM_SMILEY_REGEX = /sm:\/\//;
chatango.utils.formatting.makeRegExpGlobal = function(re) {
  return new RegExp(re.source, "g");
};
chatango.utils.formatting.FONTS_TABLE = ["Arial", "Comic", "Georgia", "Handwriting", "Impact", "Palatino", "Papyrus", "Times", "Typewriter"];
chatango.utils.formatting.FONTS_HASH = {"Arial":"Arial, sans-serif", "Comic":"'Comic Sans', 'Comic Sans MS', sans-serif", "Georgia":"Georgia, serif", "Handwriting":"'Lucida Handwriting', Zapfino, Chalkduster, cursive", "Impact":"Impact, sans-serif", "Palatino":"Palatino, serif", "Papyrus":"Papyrus, cursive", "Times":"Times, serif", "Typewriter":"Typewriter, 'Courier New', monospace"};
chatango.utils.formatting.getFont = function(indexCode) {
  var font = "sans-serif";
  indexCode = String(indexCode);
  if (indexCode.length > 0 && indexCode.match(/\d+/) && indexCode > -1 && indexCode < chatango.utils.formatting.FONTS_TABLE.length) {
    font = chatango.utils.formatting.FONTS_TABLE[indexCode];
    font = chatango.utils.formatting.FONTS_HASH[font];
  } else {
    indexCode = String(indexCode);
    if (indexCode && indexCode.match(/[\s\w]+/)) {
      font = "'" + indexCode + "', sans-serif";
    }
  }
  return font;
};
chatango.utils.formatting.FONT_SCALE_FACTOR = 100 / 11;
chatango.utils.formatting.FONT_MAX_PCT = 200;
chatango.utils.formatting.scaleSize = function(size) {
  var psize = size * chatango.utils.formatting.FONT_SCALE_FACTOR;
  if (psize > chatango.utils.formatting.FONT_MAX_PCT) {
    psize = chatango.utils.formatting.FONT_MAX_PCT;
  }
  return Math.round(psize);
};
goog.provide("goog.cssom");
goog.provide("goog.cssom.CssRuleType");
goog.require("goog.array");
goog.require("goog.dom");
goog.cssom.CssRuleType = {STYLE:1, IMPORT:3, MEDIA:4, FONT_FACE:5, PAGE:6, NAMESPACE:7};
goog.cssom.getAllCssText = function(opt_styleSheet) {
  var styleSheet = opt_styleSheet || document.styleSheets;
  return(goog.cssom.getAllCss_(styleSheet, true));
};
goog.cssom.getAllCssStyleRules = function(opt_styleSheet) {
  var styleSheet = opt_styleSheet || document.styleSheets;
  return(goog.cssom.getAllCss_(styleSheet, false));
};
goog.cssom.getCssRulesFromStyleSheet = function(styleSheet) {
  var cssRuleList = null;
  try {
    cssRuleList = styleSheet.cssRules || styleSheet.rules;
  } catch (e) {
    if (e.code == 15) {
      e.styleSheet = styleSheet;
      throw e;
    }
  }
  return cssRuleList;
};
goog.cssom.getAllCssStyleSheets = function(opt_styleSheet, opt_includeDisabled) {
  var styleSheetsOutput = [];
  var styleSheet = opt_styleSheet || document.styleSheets;
  var includeDisabled = goog.isDef(opt_includeDisabled) ? opt_includeDisabled : false;
  if (styleSheet.imports && styleSheet.imports.length) {
    for (var i = 0, n = styleSheet.imports.length;i < n;i++) {
      goog.array.extend(styleSheetsOutput, goog.cssom.getAllCssStyleSheets(styleSheet.imports[i]));
    }
  } else {
    if (styleSheet.length) {
      for (var i = 0, n = styleSheet.length;i < n;i++) {
        goog.array.extend(styleSheetsOutput, goog.cssom.getAllCssStyleSheets(styleSheet[i]));
      }
    } else {
      var cssRuleList = goog.cssom.getCssRulesFromStyleSheet((styleSheet));
      if (cssRuleList && cssRuleList.length) {
        for (var i = 0, n = cssRuleList.length, cssRule;i < n;i++) {
          cssRule = cssRuleList[i];
          if (cssRule.styleSheet) {
            goog.array.extend(styleSheetsOutput, goog.cssom.getAllCssStyleSheets(cssRule.styleSheet));
          }
        }
      }
    }
  }
  if ((styleSheet.type || styleSheet.rules || styleSheet.cssRules) && (!styleSheet.disabled || includeDisabled)) {
    styleSheetsOutput.push(styleSheet);
  }
  return styleSheetsOutput;
};
goog.cssom.getCssTextFromCssRule = function(cssRule) {
  var cssText = "";
  if (cssRule.cssText) {
    cssText = cssRule.cssText;
  } else {
    if (cssRule.style && cssRule.style.cssText && cssRule.selectorText) {
      var styleCssText = cssRule.style.cssText.replace(/\s*-closure-parent-stylesheet:\s*\[object\];?\s*/gi, "").replace(/\s*-closure-rule-index:\s*[\d]+;?\s*/gi, "");
      var thisCssText = cssRule.selectorText + " { " + styleCssText + " }";
      cssText = thisCssText;
    }
  }
  return cssText;
};
goog.cssom.getCssRuleIndexInParentStyleSheet = function(cssRule, opt_parentStyleSheet) {
  if (cssRule.style && cssRule.style["-closure-rule-index"]) {
    return cssRule.style["-closure-rule-index"];
  }
  var parentStyleSheet = opt_parentStyleSheet || goog.cssom.getParentStyleSheet(cssRule);
  if (!parentStyleSheet) {
    throw Error("Cannot find a parentStyleSheet.");
  }
  var cssRuleList = goog.cssom.getCssRulesFromStyleSheet(parentStyleSheet);
  if (cssRuleList && cssRuleList.length) {
    for (var i = 0, n = cssRuleList.length, thisCssRule;i < n;i++) {
      thisCssRule = cssRuleList[i];
      if (thisCssRule == cssRule) {
        return i;
      }
    }
  }
  return-1;
};
goog.cssom.getParentStyleSheet = function(cssRule) {
  return cssRule.parentStyleSheet || cssRule.style && cssRule.style["-closure-parent-stylesheet"];
};
goog.cssom.replaceCssRule = function(cssRule, cssText, opt_parentStyleSheet, opt_index) {
  var parentStyleSheet = opt_parentStyleSheet || goog.cssom.getParentStyleSheet(cssRule);
  if (parentStyleSheet) {
    var index = opt_index >= 0 ? opt_index : goog.cssom.getCssRuleIndexInParentStyleSheet(cssRule, parentStyleSheet);
    if (index >= 0) {
      goog.cssom.removeCssRule(parentStyleSheet, index);
      goog.cssom.addCssRule(parentStyleSheet, cssText, index);
    } else {
      throw Error("Cannot proceed without the index of the cssRule.");
    }
  } else {
    throw Error("Cannot proceed without the parentStyleSheet.");
  }
};
goog.cssom.addCssRule = function(cssStyleSheet, cssText, opt_index) {
  var index = opt_index;
  if (index < 0 || index == undefined) {
    var rules = goog.cssom.getCssRulesFromStyleSheet(cssStyleSheet);
    index = rules.length;
  }
  if (cssStyleSheet.insertRule) {
    cssStyleSheet.insertRule(cssText, index);
  } else {
    var matches = /^([^\{]+)\{([^\{]+)\}/.exec(cssText);
    if (matches.length == 3) {
      var selector = matches[1];
      var style = matches[2];
      cssStyleSheet.addRule(selector, style, index);
    } else {
      throw Error("Your CSSRule appears to be ill-formatted.");
    }
  }
};
goog.cssom.removeCssRule = function(cssStyleSheet, index) {
  if (cssStyleSheet.deleteRule) {
    cssStyleSheet.deleteRule(index);
  } else {
    cssStyleSheet.removeRule(index);
  }
};
goog.cssom.addCssText = function(cssText, opt_domHelper) {
  var document = opt_domHelper ? opt_domHelper.getDocument() : goog.dom.getDocument();
  var cssNode = document.createElement("style");
  cssNode.type = "text/css";
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(cssNode);
  if (cssNode.styleSheet) {
    cssNode.styleSheet.cssText = cssText;
  } else {
    var cssTextNode = document.createTextNode(cssText);
    cssNode.appendChild(cssTextNode);
  }
  return cssNode;
};
goog.cssom.getFileNameFromStyleSheet = function(styleSheet) {
  var href = styleSheet.href;
  if (!href) {
    return null;
  }
  var matches = /([^\/\?]+)[^\/]*$/.exec(href);
  var filename = matches[1];
  return filename;
};
goog.cssom.getAllCss_ = function(styleSheet, isTextOutput) {
  var cssOut = [];
  var styleSheets = goog.cssom.getAllCssStyleSheets(styleSheet);
  for (var i = 0;styleSheet = styleSheets[i];i++) {
    var cssRuleList = goog.cssom.getCssRulesFromStyleSheet(styleSheet);
    if (cssRuleList && cssRuleList.length) {
      if (!isTextOutput) {
        var ruleIndex = 0
      }
      for (var j = 0, n = cssRuleList.length, cssRule;j < n;j++) {
        cssRule = cssRuleList[j];
        if (isTextOutput && !cssRule.href) {
          var res = goog.cssom.getCssTextFromCssRule(cssRule);
          cssOut.push(res);
        } else {
          if (!cssRule.href) {
            if (cssRule.style) {
              if (!cssRule.parentStyleSheet) {
                cssRule.style["-closure-parent-stylesheet"] = styleSheet;
              }
              cssRule.style["-closure-rule-index"] = ruleIndex;
            }
            cssOut.push(cssRule);
          }
        }
        if (!isTextOutput) {
          ruleIndex++;
        }
      }
    }
  }
  return isTextOutput ? cssOut.join(" ") : cssOut;
};
goog.provide("chatango.group.DefaultStyles");
chatango.group.DefaultStyles = {a:"FFFFFF", b:0, c:"666666", d:"666666", e:"FFFFFF", f:100, g:"000000", h:"FFFFFF", i:100, j:"000000", k:"999999", l:"CCCCCC", m:"DADADA", n:"000000", o:100, p:"11", q:"FFFFFF", r:0, s:0, t:1, u:0, v:1, w:1, aa:0, ab:1, ac:0, usricon:1, pos:"none", bpos:"br", cv:0, cvfnt:"sans-serif", cvfntsz:"13px", cvfntw:"normal", cvbg:"666666", cvbga:100, cvfg:"FFFFFF", cvw:65, cvh:20, dateint:60, sbc:"BBBBBB", sba:100, surl:1, allowpm:1, ticker:0, debug:0, cnrs:0, port:0, server:0, 
useonm:0, showhdr:1, showx:1, fwtickm:0};
chatango.group.DefaultStyles.lookup = {"a":chatango.group.DefaultStyles.a, "b":chatango.group.DefaultStyles.b, "c":chatango.group.DefaultStyles.c, "d":chatango.group.DefaultStyles.d, "e":chatango.group.DefaultStyles.e, "f":chatango.group.DefaultStyles.f, "g":chatango.group.DefaultStyles.g, "h":chatango.group.DefaultStyles.h, "i":chatango.group.DefaultStyles.i, "j":chatango.group.DefaultStyles.j, "k":chatango.group.DefaultStyles.k, "l":chatango.group.DefaultStyles.l, "n":chatango.group.DefaultStyles.n, 
"m":chatango.group.DefaultStyles.m, "o":chatango.group.DefaultStyles.o, "p":chatango.group.DefaultStyles.p, "q":chatango.group.DefaultStyles.q, "r":chatango.group.DefaultStyles.r, "s":chatango.group.DefaultStyles.s, "t":chatango.group.DefaultStyles.t, "u":chatango.group.DefaultStyles.u, "v":chatango.group.DefaultStyles.v, "w":chatango.group.DefaultStyles.w, "aa":chatango.group.DefaultStyles.aa, "ab":chatango.group.DefaultStyles.ab, "ac":chatango.group.DefaultStyles.ac, "usricon":chatango.group.DefaultStyles.usricon, 
"pos":chatango.group.DefaultStyles.pos, "bpos":chatango.group.DefaultStyles.bpos, "cv":chatango.group.DefaultStyles.cv, "cvfnt":chatango.group.DefaultStyles.cvfnt, "cvfntsz":chatango.group.DefaultStyles.cvfntsz, "cvfntw":chatango.group.DefaultStyles.cvfntw, "cvbg":chatango.group.DefaultStyles.cvbg, "cvbga":chatango.group.DefaultStyles.cvbga, "cvfg":chatango.group.DefaultStyles.cvfg, "cvw":chatango.group.DefaultStyles.cvw, "cvh":chatango.group.DefaultStyles.cvh, "dateint":chatango.group.DefaultStyles.dateint, 
"sbc":chatango.group.DefaultStyles.sbc, "sba":chatango.group.DefaultStyles.sba, "surl":chatango.group.DefaultStyles.surl, "allowpm":chatango.group.DefaultStyles.allowpm, "ticker":chatango.group.DefaultStyles.ticker, "debug":chatango.group.DefaultStyles.debug, "cnrs":chatango.group.DefaultStyles.cnrs, "port":chatango.group.DefaultStyles.port, "server":chatango.group.DefaultStyles.server, "secure":chatango.group.DefaultStyles.secure, "useonm":chatango.group.DefaultStyles.useonm, "showhdr":chatango.group.DefaultStyles.showhdr, 
"showx":chatango.group.DefaultStyles.showx, "fwtickm":chatango.group.DefaultStyles.fwtickm};
chatango.group.DefaultStyles.names = {"a":"bg_color", "b":"bg_opacity", "c":"title_icon_color", "d":"info_color", "e":"msg_bg_color", "f":"msg_bg_opacity", "g":"msg_text_color", "h":"input_bg_color", "i":"input_bg_opacity", "j":"input_text_color", "k":"date_color", "l":"border_color", "m":"button_color", "n":"button_text_color", "o":"button_opacity", "p":"button_fnt_size", "q":"main_border_color", "r":"main_border_opacity", "s":"rounded_corners", "t":"sound", "u":"show_style_bar", "v":"show_title", 
"w":"show_owners_msg", "aa":"show_videos", "ab":"show_font_styles", "ac":"full_size", "usricon":"show_usricon", "pos":"position", "bpos":"button_position", "cv":"cv", "cvfnt":"cv_font", "cvfntsz":"cv_font_size", "cvfntw":"cv_font_weight", "cvbg":"cv_bg_color", "cvbga":"cv_bg_opacity", "cvfg":"cv_text_color", "cvw":"cv_width", "cvh":"cv_height", "dateint":"date_interval", "sbc":"sb_color", "sba":"sb_alpha", "surl":"show_url", "allowpm":"allow_pm", "ticker":"ticker", "debug":"debug", "cnrs":"cnrs", 
"port":"port", "server":"server", "secure":"secure", "useonm":"use_on_mobile_embed", "showhdr":"showhdr", "showx":"showx", "fwtickm":"full_w_ticker_on_mobile"};
chatango.group.DefaultStyles.MIN_WIDTH = 120;
chatango.group.DefaultStyles.MIN_HEIGHT = 200;
chatango.group.DefaultStyles.MIN_FLASH_WIDTH = 200;
chatango.group.DefaultStyles.MIN_FLASH_HEIGHT = 290;
chatango.group.DefaultStyles.MIN_CV_WIDTH = 18;
chatango.group.DefaultStyles.MIN_CV_TICKER_WIDTH = 100;
chatango.group.DefaultStyles.MIN_CV_HEIGHT = 18;
chatango.group.DefaultStyles.MIN_MSG_FONT_SIZE = 9;
chatango.group.DefaultStyles.MAX_MSG_FONT_SIZE = 18;
goog.provide("chatango.managers.Style");
goog.require("chatango.group.DefaultStyles");
goog.require("chatango.group.GroupEmbedTypes");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Environment.DeviceType");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.utils.cssom");
goog.require("chatango.utils.formatting");
goog.require("chatango.utils.userAgent");
goog.require("goog.array");
goog.require("goog.cssom");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.events.EventTarget");
goog.require("goog.userAgent");
chatango.managers.Style = function() {
  goog.events.EventTarget.call(this);
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  this.scaleManager_ = chatango.managers.ScaleManager.getInstance();
  this.originalStyles_ = {};
  this.originalWidth_ = "";
  this.originalHeight_ = "";
};
goog.inherits(chatango.managers.Style, goog.events.EventTarget);
goog.addSingletonGetter(chatango.managers.Style);
chatango.managers.Style.prototype.logger = goog.debug.Logger.getLogger("chatango.managers.Style");
chatango.managers.Style.EventType = {USER_DEFINED_ICON_COLOR_CHANGED:goog.events.getUniqueId("ud_icon_col_chgd"), USER_DEFINED_BUTTON_STYLE_CHANGED:goog.events.getUniqueId("ud_btn_style_chgd"), USER_DEFINED_SB_STYLE_CHANGED:goog.events.getUniqueId("ud_sb_style_chgd"), USER_DEFINED_BG_STYLE_CHANGED:goog.events.getUniqueId("ud_bg_style_chgd"), USER_DEFINED_CV_BG_STYLE_CHANGED:goog.events.getUniqueId("ud_cv_bg_style_chgd"), USER_DEFINED_CV_FG_COLOR_CHANGED:goog.events.getUniqueId("ud_cv_fg_style_chgd"), 
USER_DEFINED_BORDER_COLOR_CHANGED:goog.events.getUniqueId("ud_bdr_col_chgd"), USER_DEFINED_FONT_SIZE_CHANGED:goog.events.getUniqueId("ud_font_size_chgd"), USER_DEFINED_INPUT_TXT_COLOR_CHANGED:goog.events.getUniqueId("ud_ipt_txt_col_chgd"), MSG_THUMB_DISPLAY_CHANGED:goog.events.getUniqueId("msg_thb_chgd"), CV_SIZE_CHANGED:goog.events.getUniqueId("cv_sz_chgd"), HEADER_TITLE_VISIBILITY_CHANGED:goog.events.getUniqueId("title_vis_chgd"), HEADER_URL_VISIBILITY_CHANGED:goog.events.getUniqueId("url_vis_chgd"), 
HEADER_MESSAGE_VISIBILITY_CHANGED:goog.events.getUniqueId("message_vis_chgd"), ALLOW_PM_CHANGED:goog.events.getUniqueId("allow_pm_chgd"), RND_CNR_CHANGED:goog.events.getUniqueId("rc_chgd"), SHOW_HEADER_CHANGED:goog.events.getUniqueId("s_hdr_chgd"), SHOW_CLOSE_BUTTON_CHANGED:goog.events.getUniqueId("s_x_chgd")};
chatango.managers.Style.chatangoStyles = {alertColor:"#FFCC00", disabledColor:"#F0F0F0", disabledTextColor:"#BBBBBB"};
chatango.managers.Style.prototype.getPadding = function() {
  var pad = .3;
  if (chatango.managers.Environment.getInstance().getDeviceType() != chatango.managers.Environment.DeviceType.DESKTOP) {
    pad = .5;
  }
  return pad;
};
chatango.managers.Style.prototype.init = function(userDefinedStyles) {
  var ss = chatango.utils.cssom.getMainStyleSheet();
  this.originalStyles_ = userDefinedStyles;
  this.setFullSizeGroup(userDefinedStyles["ac"]);
  if (this.isFullSizeGroup() && chatango.managers.Environment.getInstance().isAndroid()) {
    this.scaleManager_.useFixedScale(true);
  }
  this.setBackgroundColor(userDefinedStyles["a"]);
  this.setBackgroundOpacity(userDefinedStyles["b"]);
  this.setTitleColor(userDefinedStyles["c"]);
  this.setUserDefinedIconColor(userDefinedStyles["c"]);
  this.setOwnersMsgColor(userDefinedStyles["d"]);
  this.setUrlColor(userDefinedStyles["d"]);
  this.setOutputWindowBgColor(userDefinedStyles["e"]);
  this.setOutputWindowBgOpacity(userDefinedStyles["f"]);
  this.setMsgTextColor(userDefinedStyles["g"]);
  this.setInputWindowBgColor(userDefinedStyles["h"], userDefinedStyles["i"]);
  this.initialEmbedInputBgColor_ = this.getInputWindowBgColor();
  this.initialEmbedInputBgOpacity_ = this.getInputWindowBgOpacity();
  this.setInputTextColor(userDefinedStyles["j"]);
  this.initialEmbedInputTextColor_ = this.getInputTextColor();
  this.setMsgDateTextColor(userDefinedStyles["k"]);
  this.setUDBorderColor(userDefinedStyles["l"]);
  this.setUDButtonFillColor(userDefinedStyles["m"]);
  this.setUDButtonTextColor(userDefinedStyles["n"]);
  this.setUDButtonFillOpacity(userDefinedStyles["o"]);
  this.setUDFontSize(userDefinedStyles["p"]);
  this.initialEmbedFontSize_ = this.setUDFontSize();
  this.initialEmbedFontFamily_ = chatango.utils.formatting.getFont(0);
  this.setMainBorder(userDefinedStyles["q"], userDefinedStyles["r"]);
  this.setSoundEmbedState(userDefinedStyles["t"]);
  this.showStyleBar(userDefinedStyles["u"]);
  this.showTitle(userDefinedStyles["v"]);
  this.showOwnersMessage(userDefinedStyles["w"]);
  this.setDisplayMessageStyles(userDefinedStyles["ab"]);
  this.setDisplayUserThumbsSetting(userDefinedStyles["usricon"]);
  this.setCVPosition(userDefinedStyles["pos"]);
  this.setCVFont(userDefinedStyles["cvfnt"], userDefinedStyles["cvfntsz"], userDefinedStyles["cvfntw"]);
  this.setCVBackgroundColor(userDefinedStyles["cvbg"]);
  this.setCVBackgroundOpacity(userDefinedStyles["cvbga"]);
  this.setCVForegroundColor(userDefinedStyles["cvfg"]);
  this.setCVSize(userDefinedStyles["cvw"], userDefinedStyles["cvh"], false);
  this.setMsgDateInterval(userDefinedStyles["dateint"]);
  this.setUDScrollbarColor(userDefinedStyles["sbc"]);
  this.setUDScrollbarOpacity(userDefinedStyles["sba"]);
  this.showUrl(userDefinedStyles["surl"]);
  this.setAllowPm(userDefinedStyles["allowpm"]);
  this.setTickerEnabled(userDefinedStyles["ticker"]);
  this.setRoundedCorners(userDefinedStyles["cnrs"]);
  this.setUseOnMobileEmbed(userDefinedStyles["useonm"]);
  this.setShowHeader(userDefinedStyles["showhdr"]);
  this.setShowCloseButton(userDefinedStyles["showx"]);
  var pad = this.getPadding();
  var rule = "#CGW {padding: " + pad + "em;}";
  goog.cssom.addCssRule(ss, rule);
  rule = "#FTR {padding-top: " + pad + "em;}";
  goog.cssom.addCssRule(ss, rule);
  rule = "#FTR {padding-top: " + pad + "em;}";
  goog.cssom.addCssRule(ss, rule);
  rule = "#HEAD {padding-bottom: " + pad + "em;}";
  goog.cssom.addCssRule(ss, rule);
  rule = "#IW {padding-top: " + pad + "em;}";
  goog.cssom.addCssRule(ss, rule);
  rule = "#IW textarea, #IW input {padding: " + pad + "em;}";
  goog.cssom.addCssRule(ss, rule);
  rule = ".msg-fg, .msg-easyban, .msg-touchmod {padding:" + pad + "em}";
  goog.cssom.addCssRule(ss, rule);
  rule = ".msg-bg { border-left: " + pad + "em solid transparent }";
  goog.cssom.addCssRule(ss, rule);
  var msgLeftPad = pad * 2;
  rule = ".msg-fg {padding-left:" + msgLeftPad + "em}";
  goog.cssom.addCssRule(ss, rule);
  rule = ".msg-stripes {width:" + pad * 1.2 + "em}";
  goog.cssom.addCssRule(ss, rule);
  rule = ".msg-mod-div-easyban, .msg-touchmod {margin-right:" + pad * 2 + "em; right:" + pad + "em;}";
  goog.cssom.addCssRule(ss, rule);
  var v_btn_padding = .4;
  var h_btn_padding = .4;
  var h_loginout_btn_padding = .3;
  var v_loginout_btn_padding = .3;
  if (chatango.managers.Environment.getInstance().getDeviceType() != chatango.managers.Environment.DeviceType.DESKTOP) {
    v_btn_padding = .7;
    h_btn_padding = .6;
    h_loginout_btn_padding = .6;
    v_loginout_btn_padding = .4;
  }
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.MOBILE || chatango.managers.Environment.getInstance().isAndroid()) {
    v_btn_padding = .75;
  }
  rule = ".goog-custom-button-inner-box { " + "padding: " + v_btn_padding + "em " + h_btn_padding + "em;}";
  goog.cssom.addCssRule(ss, rule);
  rule = ".chatango-btn-content { " + "padding: " + v_btn_padding + "em " + h_btn_padding + "em;}";
  goog.cssom.addCssRule(ss, rule);
};
chatango.managers.Style.prototype.update = function(userDefinedStyles) {
  if (this.getBackgroundColor() != userDefinedStyles["a"]) {
    this.setBackgroundColor(userDefinedStyles["a"]);
  }
  if (this.getBackgroundOpacity() != userDefinedStyles["b"]) {
    this.setBackgroundOpacity(userDefinedStyles["b"]);
  }
  if (this.getTitleColor() != userDefinedStyles["c"]) {
    this.setTitleColor(userDefinedStyles["c"]);
  }
  if (this.getUserDefinedIconColor() != userDefinedStyles["c"]) {
    this.setUserDefinedIconColor(userDefinedStyles["c"]);
  }
  if (this.getOwnersMsgColor() != userDefinedStyles["d"]) {
    this.setOwnersMsgColor(userDefinedStyles["d"]);
  }
  if (this.getUrlColor() != userDefinedStyles["d"]) {
    this.setUrlColor(userDefinedStyles["d"]);
  }
  if (this.getOutputWindowBgColor() != userDefinedStyles["e"]) {
    this.setOutputWindowBgColor(userDefinedStyles["e"]);
  }
  if (this.getOutputWindowBgOpacity() != userDefinedStyles["f"]) {
    this.setOutputWindowBgOpacity(userDefinedStyles["f"]);
  }
  if (this.getMsgTextColor() != userDefinedStyles["g"]) {
    this.setMsgTextColor(userDefinedStyles["g"]);
  }
  if (this.getInputWindowBgColor() != userDefinedStyles["h"] || this.getInputWindowBgOpacity() != userDefinedStyles["i"]) {
    this.setInputWindowBgColor(userDefinedStyles["h"], userDefinedStyles["i"]);
  }
  if (this.getInputTextColor() != userDefinedStyles["j"]) {
    this.setInputTextColor(userDefinedStyles["j"]);
  }
  if (this.getMsgDateTextColor() != userDefinedStyles["k"]) {
    this.setMsgDateTextColor(userDefinedStyles["k"]);
  }
  if (this.getUDBorderColor() != userDefinedStyles["l"]) {
    this.setUDBorderColor(userDefinedStyles["l"]);
  }
  if (this.getUDButtonFillColor() != userDefinedStyles["m"]) {
    this.setUDButtonFillColor(userDefinedStyles["m"]);
  }
  if (this.getUDButtonTextColor() != userDefinedStyles["n"]) {
    this.setUDButtonTextColor(userDefinedStyles["n"]);
  }
  if (this.getUDButtonFillOpacity() != userDefinedStyles["o"]) {
    this.setUDButtonFillOpacity(userDefinedStyles["o"]);
  }
  if (this.getUDFontSize() != userDefinedStyles["p"]) {
    this.setUDFontSize(userDefinedStyles["p"]);
  }
  if (this.getMainBorderColor() != userDefinedStyles["q"]) {
    this.setMainBorder(userDefinedStyles["q"], userDefinedStyles["r"]);
  }
  if (this.getMainBorderOpacity() != userDefinedStyles["r"]) {
    this.setMainBorder(userDefinedStyles["q"], userDefinedStyles["r"]);
  }
  if (this.getSoundEmbedState() != userDefinedStyles["t"]) {
    this.setSoundEmbedState(userDefinedStyles["t"]);
  }
  if (this.isStyleBarShown() != userDefinedStyles["u"]) {
    this.showStyleBar(userDefinedStyles["u"]);
  }
  if (this.titleIsVisible() != userDefinedStyles["v"]) {
    this.showTitle(userDefinedStyles["v"]);
  }
  if (this.messageIsVisible() != userDefinedStyles["w"]) {
    this.showOwnersMessage(userDefinedStyles["w"]);
  }
  if (this.isFullSizeGroup() != userDefinedStyles["ac"]) {
    this.setFullSizeGroup(userDefinedStyles["ac"]);
  }
  if (this.displayMessageStyles_ != userDefinedStyles["ab"]) {
    this.setDisplayMessageStyles(userDefinedStyles["ab"]);
  }
  if (this.getThumbScale() != userDefinedStyles["usricon"]) {
    this.setDisplayUserThumbsSetting(userDefinedStyles["usricon"]);
  }
  if (this.getCVPosition() != userDefinedStyles["pos"]) {
    this.setCVPosition(userDefinedStyles["pos"]);
  }
  if (this.getCVFontFamily() != userDefinedStyles["cvfnt"] || this.getCVFontSize() != userDefinedStyles["cvfntsz"] || this.getCVFontWeight() != userDefinedStyles["cvfntw"]) {
    this.setCVFont(userDefinedStyles["cvfnt"], userDefinedStyles["cvfntsz"], userDefinedStyles["cvfntw"]);
  }
  if (this.getCVBackgroundColor() != userDefinedStyles["cvbg"]) {
    this.setCVBackgroundColor(userDefinedStyles["cvbg"]);
  }
  if (this.getCVBackgroundOpacity() != userDefinedStyles["cvbga"]) {
    this.setCVBackgroundOpacity(userDefinedStyles["cvbga"]);
  }
  if (this.getCVForegroundColor() != userDefinedStyles["cvh"]) {
    this.setCVForegroundColor(userDefinedStyles["cvfg"]);
  }
  if (this.getCVSize().width != userDefinedStyles["cvw"] || this.getCVSize().height != userDefinedStyles["cvh"]) {
    this.setCVSize(userDefinedStyles["cvw"], userDefinedStyles["cvh"], false);
  }
  if (this.getMsgDateInterval() != userDefinedStyles["dateint"]) {
    this.setMsgDateInterval(userDefinedStyles["dateint"]);
  }
  if (this.getUDScrollbarColor() != userDefinedStyles["sbc"]) {
    this.setUDScrollbarColor(userDefinedStyles["sbc"]);
  }
  if (this.getUDScrollbarOpacity() != userDefinedStyles["sba"]) {
    this.setUDScrollbarOpacity(userDefinedStyles["sba"]);
  }
  if (this.urlIsVisible() != userDefinedStyles["surl"]) {
    this.showUrl(userDefinedStyles["surl"]);
  }
  if (this.allowPm_ != userDefinedStyles["allowpm"]) {
    this.setAllowPm(userDefinedStyles["allowpm"]);
  }
  if (this.tickerEnabled_ != userDefinedStyles["ticker"]) {
    this.setTickerEnabled(userDefinedStyles["ticker"]);
  }
  if (this.roundedCorners_ != userDefinedStyles["cnrs"]) {
    this.setRoundedCorners(userDefinedStyles["cnrs"]);
  }
  if (this.useOnMobileEmbed_ != userDefinedStyles["useonm"]) {
    this.setUseOnMobileEmbed(userDefinedStyles["useonm"]);
  }
  if (this.getShowHeader() != userDefinedStyles["showhdr"]) {
    this.setShowHeader(userDefinedStyles["showhdr"]);
  }
  if (this.getShowCloseButton() != userDefinedStyles["showx"]) {
    this.setShowCloseButton(userDefinedStyles["showx"]);
  }
  if (this.getFullWidthTickerOnMobile() != userDefinedStyles["fwtickm"]) {
    this.setFullWidthTickerOnMobile(userDefinedStyles["fwtickm"]);
  }
};
chatango.managers.Style.prototype.embedType_ = chatango.group.GroupEmbedTypes.BOX;
chatango.managers.Style.prototype.getScale = function() {
  return this.scaleManager_.getScale();
};
chatango.managers.Style.prototype.getIconSize = function() {
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.DESKTOP) {
    return 15;
  }
  return Math.max(Math.round(25 * this.scaleManager_.getScale() / 100), 11);
};
chatango.managers.Style.prototype.getIconSizeEm = function() {
  return Math.round(this.getIconSize() * 76.66) / 1E3;
};
chatango.managers.Style.prototype.thumbnailSize_ = null;
chatango.managers.Style.prototype.getThumbnailSize = function() {
  if (!this.thumbnailSize_) {
    if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.DESKTOP) {
      this.thumbnailSize_ = 40;
    }
    this.thumbnailSize_ = Math.round(40 * this.scaleManager_.getScale() / 100);
  }
  return this.thumbnailSize_;
};
chatango.managers.Style.prototype.getDefaultDialogBoxWidth = function() {
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.DESKTOP) {
    return 200;
  }
  return Math.round(200 * this.scaleManager_.getScale() / 100);
};
chatango.managers.Style.prototype.setWindowSize = function(width, height) {
  this.scaleManager_.setWindowSize(width, height);
};
chatango.managers.Style.prototype.getWindowSize = function() {
  return this.scaleManager_.getWindowSize();
};
chatango.managers.Style.prototype.setEmbedType = function(embedType) {
  this.embedType_ = embedType;
  this.scaleManager_.setEmbedType(embedType);
};
chatango.managers.Style.prototype.getEmbedType = function() {
  return this.embedType_;
};
chatango.managers.Style.prototype.updateScale = function(opt_forceUpdate) {
  var redraw = this.scaleManager_.updateScale(opt_forceUpdate, this.isFullSizeGroup());
  this.updateMessageFontSizeRule_();
  return redraw;
};
chatango.managers.Style.prototype.backgroundColorRule_ = null;
chatango.managers.Style.prototype.backgroundColor_ = null;
chatango.managers.Style.prototype.setBackgroundColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.a);
  var rule = "#SGBG {  background-color: " + col + ";}";
  this.backgroundColorRule_ = chatango.utils.cssom.setCssRule(rule, this.backgroundColorRule_);
  this.backgroundColor_ = col;
  if (chatango.DEBUG) {
    this.logger.info("chatango.group.DefaultStyles.a: " + chatango.group.DefaultStyles.a);
    this.logger.info("rule " + rule);
    this.logger.info("this.backgroundColor_ " + this.backgroundColor_);
  }
  this.adjustFooterPadding_();
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_BG_STYLE_CHANGED);
};
chatango.managers.Style.prototype.getBackgroundColor = function() {
  return this.backgroundColor_ || chatango.group.DefaultStyles.a;
};
chatango.managers.Style.prototype.backgroundOpacityRule_ = null;
chatango.managers.Style.prototype.backgroundOpacity_ = null;
chatango.managers.Style.prototype.getBackgroundOpacity = function() {
  return this.backgroundOpacity_ || chatango.group.DefaultStyles.b;
};
chatango.managers.Style.prototype.setBackgroundOpacity = function(opacity) {
  opacity_arr = chatango.utils.cssom.getOpacityValues(opacity, chatango.group.DefaultStyles.b);
  var rule = "#SGBG {  opacity: " + opacity_arr[0] + "; filter: alpha(opacity=" + opacity_arr[1] + ");}";
  this.backgroundOpacityRule_ = chatango.utils.cssom.setCssRule(rule, this.backgroundOpacityRule_);
  this.backgroundOpacity_ = opacity_arr[1];
  if (chatango.DEBUG) {
    this.logger.info("opacity rule " + rule);
    this.logger.info("this.backgroundOpacity_ " + this.backgroundOpacity_);
  }
  this.adjustFooterPadding_();
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_BG_STYLE_CHANGED);
};
chatango.managers.Style.prototype.titleColorRule_ = null;
chatango.managers.Style.prototype.setTitleColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.c);
  this.titleColor_ = col;
  var rule = "#GTL { color: " + col + ";}";
  this.titleColorRule_ = chatango.utils.cssom.setCssRule(rule, this.titleColorRule_);
};
chatango.managers.Style.prototype.getTitleColor = function() {
  return this.titleColor_ || chatango.group.DefaultStyles.c;
};
chatango.managers.Style.prototype.ownersMsgColorRule_ = null;
chatango.managers.Style.prototype.setOwnersMsgColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.d);
  this.ownersMsgColor_ = col;
  var rule = ".ownmsg { color: " + col + ";}";
  this.ownersMsgColorRule_ = chatango.utils.cssom.setCssRule(rule, this.ownersMsgColorRule_);
};
chatango.managers.Style.prototype.getOwnersMsgColor = function() {
  return this.ownsersMsgColor_ || chatango.group.DefaultStyles.d;
};
chatango.managers.Style.prototype.urlColorRule_ = null;
chatango.managers.Style.prototype.setUrlColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.d);
  var rule = "#UTL { color: " + col + ";}";
  this.urlColor_ = col;
  this.urlColorRule_ = chatango.utils.cssom.setCssRule(rule, this.urlColorRule_);
};
chatango.managers.Style.prototype.getUrlColor = function() {
  return this.urlColor_ || chatango.group.DefaultStyles.d;
};
chatango.managers.Style.prototype.userDefinedIconColor_ = null;
chatango.managers.Style.prototype.setUserDefinedIconColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.c);
  this.userDefinedIconColor_ = col;
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_ICON_COLOR_CHANGED);
};
chatango.managers.Style.prototype.getUserDefinedIconColor = function() {
  return chatango.utils.cssom.getValidHex(this.userDefinedIconColor_, chatango.group.DefaultStyles.c);
};
chatango.managers.Style.prototype.outputWindowBgColorRule_ = null;
chatango.managers.Style.prototype.outputWindowBgColor_ = null;
chatango.managers.Style.prototype.setOutputWindowBgColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.e);
  var rule = "#OWBG { background-color: " + col + ";}";
  this.outputWindowBgColorRule_ = chatango.utils.cssom.setCssRule(rule, this.outputWindowBgColorRule_);
  this.outputWindowBgColor_ = col;
};
chatango.managers.Style.prototype.getOutputWindowBgColor = function() {
  return chatango.utils.cssom.getValidHex(this.outputWindowBgColor_, chatango.group.DefaultStyles.e);
};
chatango.managers.Style.prototype.outputWindowBgOpacityRule_ = null;
chatango.managers.Style.prototype.outputWindowBgOpacity_ = null;
chatango.managers.Style.prototype.setOutputWindowBgOpacity = function(opacity) {
  opacity_arr = chatango.utils.cssom.getOpacityValues(opacity, chatango.group.DefaultStyles.f);
  var rule = "#OWBG {opacity: " + opacity_arr[0] + "; filter: alpha(opacity=" + opacity_arr[1] + ");}";
  this.outputWindowBgOpacityRule_ = chatango.utils.cssom.setCssRule(rule, this.outputWindowBgOpacityRule_);
  this.outputWindowBgOpacity_ = opacity_arr[1];
};
chatango.managers.Style.prototype.getOutputWindowBgOpacity = function() {
  return this.outputWindowBgOpacity_ == null ? chatango.group.DefaultStyles.f : this.outputWindowBgOpacity_;
};
chatango.managers.Style.prototype.msgTextColorRule_ = null;
chatango.managers.Style.prototype.setMsgTextColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.g);
  var rule = ".msg-fg {color: " + col + ";}";
  this.msgTextColor_ = col;
  this.msgTextColorRule_ = chatango.utils.cssom.setCssRule(rule, this.msgTextColorRule_);
};
chatango.managers.Style.prototype.getMsgTextColor = function() {
  return this.msgTextColor_ || chatango.group.DefaultStyles.g;
};
chatango.managers.Style.prototype.setInputWindowBgColor = function(col, opacity) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.h);
  this.inputWindowBgColor_ = col;
  var rgb = goog.color.hexToRgb(col);
  var opacity_arr = chatango.utils.cssom.getOpacityValues(opacity, chatango.group.DefaultStyles.i);
  this.inputWindowBgOpacity_ = Math.round(opacity_arr[0] * 100);
  var rule = "#IW #input-field { background-color:rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + opacity_arr[0] + ");}";
  this.inputWindowBgColorRule_ = chatango.utils.cssom.setCssRule(rule, this.inputWindowBgColorRule_);
};
chatango.managers.Style.prototype.getInputWindowBgColor = function() {
  return this.inputWindowBgColor_ || chatango.group.DefaultStyles.h;
};
chatango.managers.Style.prototype.getInputWindowBgOpacity = function() {
  var o = this.inputWindowBgOpacity_;
  if (o == undefined || o == null) {
    o = chatango.group.DefaultStyles.i;
  }
  return o;
};
chatango.managers.Style.prototype.getInitialEmbedInputBgColor = function() {
  return this.initialEmbedInputBgColor_ || chatango.group.DefaultStyles.h;
};
chatango.managers.Style.prototype.getInitialEmbedInputBgOpacity = function() {
  var o = this.initialEmbedInputBgOpacity_;
  if (o == undefined || o == null) {
    o = chatango.group.DefaultStyles.i;
  }
  return o;
};
chatango.managers.Style.prototype.getInitialEmbedInputTextColor = function() {
  return this.initialEmbedInputTextColor_ || chatango.group.DefaultStyles.j;
};
chatango.managers.Style.prototype.getInitialEmbedInputFontSize = function() {
  return this.initialEmbedInputFontSize_ || chatango.group.DefaultStyles.p;
};
chatango.managers.Style.prototype.getInitialEmbedInputFontFamily = function() {
  return this.initialEmbedInputFontFamily_ || chatango.utils.formatting.getFont(0);
};
chatango.managers.Style.prototype.setInputTextColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.j);
  this.inputTextColor_ = col;
  var rule = "#IWW #input-field {color: " + col + ";}";
  this.inputTextColorRule_ = chatango.utils.cssom.setCssRule(rule, this.inputTextColorRule_);
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_INPUT_TXT_COLOR_CHANGED);
};
chatango.managers.Style.prototype.getInputTextColor = function() {
  return this.inputTextColor_ || chatango.group.DefaultStyles.j;
};
chatango.managers.Style.prototype.msgDateTextColorRule_ = null;
chatango.managers.Style.prototype.msgDateIpColorRule_ = null;
chatango.managers.Style.prototype.msgDateTextColor_ = null;
chatango.managers.Style.prototype.setMsgDateTextColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.k);
  var rule = "p.msg-date {color: " + col + ";}";
  this.msgDateTextColor_ = col;
  this.msgDateTextColorRule_ = chatango.utils.cssom.setCssRule(rule, this.msgDateTextColorRule_);
  rule = ".msg-mod-div .msg-ip {color: " + col + ";}";
  this.msgIpTextColor_ = col;
  this.msgIpTextColorRule_ = chatango.utils.cssom.setCssRule(rule, this.msgIpTextColorRule_);
};
chatango.managers.Style.prototype.getMsgDateTextColor = function() {
  return this.msgDateTextColor_;
};
chatango.managers.Style.prototype.uDBorderColor_ = null;
chatango.managers.Style.prototype.uDBorderColorRule_ = null;
chatango.managers.Style.prototype.uDMsgBorderColorRule_ = null;
chatango.managers.Style.prototype.setUDBorderColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.l);
  var rule = "*[class|='ubdr'] {border:1px solid " + col + ";}";
  this.uDBorderColorRule_ = chatango.utils.cssom.setCssRule(rule, this.uDBorderColorRule_);
  rule = ".msg {border-bottom:1px solid " + col + ";}";
  this.uDMsgBorderColorRule_ = chatango.utils.cssom.setCssRule(rule, this.uDMsgBorderColorRule_);
  this.uDBorderColor_ = col;
  this.adjustFooterPadding_();
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_BORDER_COLOR_CHANGED);
};
chatango.managers.Style.prototype.getUDBorderColor = function() {
  return chatango.utils.cssom.getValidHex(this.uDBorderColor_, chatango.group.DefaultStyles.l);
};
chatango.managers.Style.prototype.uDButtonFillColor_ = null;
chatango.managers.Style.prototype.setUDButtonFillColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.m);
  this.uDButtonFillColor_ = col;
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_BUTTON_STYLE_CHANGED);
};
chatango.managers.Style.prototype.getUDButtonFillColor = function() {
  return chatango.utils.cssom.getValidHex(this.uDButtonFillColor_, chatango.group.DefaultStyles.m);
};
chatango.managers.Style.prototype.uDButtonTextColor_ = null;
chatango.managers.Style.prototype.setUDButtonTextColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.n);
  this.uDButtonTextColor_ = col;
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_BUTTON_STYLE_CHANGED);
};
chatango.managers.Style.prototype.getUDButtonTextColor = function() {
  return chatango.utils.cssom.getValidHex(this.uDButtonTextColor_, chatango.group.DefaultStyles.n);
};
chatango.managers.Style.prototype.uDButtonFillOpacity_ = null;
chatango.managers.Style.prototype.setUDButtonFillOpacity = function(opacity) {
  this.uDButtonFillOpacity_ = chatango.utils.cssom.getOpacityValues(opacity, chatango.group.DefaultStyles.o)[1];
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_BUTTON_STYLE_CHANGED);
};
chatango.managers.Style.prototype.getUDButtonFillOpacity = function() {
  return this.uDButtonFillOpacity_ == null ? chatango.group.DefaultStyles.o : this.uDButtonFillOpacity_;
};
chatango.managers.Style.prototype.uDFontSize_ = null;
chatango.managers.Style.prototype.setUDFontSize = function(size) {
  if (isNaN(size)) {
    return;
  }
  this.uDFontSize_ = goog.math.clamp(size, chatango.group.DefaultStyles.MIN_MSG_FONT_SIZE, chatango.group.DefaultStyles.MAX_MSG_FONT_SIZE);
  this.updateMessageFontSizeRule_();
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_FONT_SIZE_CHANGED);
};
chatango.managers.Style.prototype.getUDFontSize = function() {
  return this.uDFontSize_;
};
chatango.managers.Style.prototype.messageFontSizeRule_ = null;
chatango.managers.Style.prototype.inputFontSizeRule_ = null;
chatango.managers.Style.prototype.updateMessageFontSizeRule_ = function() {
  var udfs = this.getUDFontSize();
  var fs_ratio = udfs ? udfs / chatango.group.DefaultStyles.p : 1;
  var font_size = Math.round(fs_ratio * 100);
  var rule = ".message-window {font-size: " + font_size + "%;}";
  this.messageFontSizeRule_ = chatango.utils.cssom.setCssRule(rule, this.messageFontSizeRule_);
  var rule = "#IW {font-size: " + font_size + "%;}";
  this.inputFontSizeRule_ = chatango.utils.cssom.setCssRule(rule, this.inputFontSizeRule_);
};
chatango.managers.Style.prototype.mainBorderRule_ = null;
chatango.managers.Style.prototype.setMainBorder = function(col, opacity) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.q);
  this.mainBorderColor_ = col;
  var bdr_size = "1px";
  this.mainBorderOpacity_ = opacity;
  if (opacity == 0 || opacity == "0" || !opacity) {
    bdr_size = "0";
    this.mainBorderOpacity_ = "0";
  }
  var rule = "#SGBG {border:" + bdr_size + " solid " + col + ";}";
  this.mainBorderRule_ = chatango.utils.cssom.setCssRule(rule, this.mainBorderRule_);
};
chatango.managers.Style.prototype.getMainBorderColor = function() {
  return this.mainBorderColor_ || chatango.group.DefaultStyles.q;
};
chatango.managers.Style.prototype.getMainBorderOpacity = function() {
  return this.mainBorderOpacity_ || chatango.group.DefaultStyles.r;
};
chatango.managers.Style.prototype.setSoundEmbedState = function(defaultState) {
  if (typeof defaultState === "undefined" || defaultState == "1") {
    this.soundEnabled_ = true;
  } else {
    this.soundEnabled_ = false;
  }
};
chatango.managers.Style.prototype.getSoundEmbedState = function() {
  return this.soundEnabled_;
};
chatango.managers.Style.prototype.showTitle_ = null;
chatango.managers.Style.prototype.showTitle = function(visible) {
  this.showTitle_ = visible;
  this.dispatchEvent(chatango.managers.Style.EventType.HEADER_TITLE_VISIBILITY_CHANGED);
};
chatango.managers.Style.prototype.titleIsVisible = function() {
  return(this.showTitle_ == null ? chatango.group.DefaultStyles.v : this.showTitle_) == 1;
};
chatango.managers.Style.prototype.showUrl_ = null;
chatango.managers.Style.prototype.showUrl = function(visible) {
  this.showUrl_ = visible;
  this.dispatchEvent(chatango.managers.Style.EventType.HEADER_URL_VISIBILITY_CHANGED);
};
chatango.managers.Style.prototype.urlIsVisible = function() {
  return(this.showUrl_ == null ? chatango.group.DefaultStyles.surl : this.showUrl_) == 1;
};
chatango.managers.Style.prototype.allowPm_ = null;
chatango.managers.Style.prototype.setAllowPm = function(allow) {
  if (this.allowPm_ != allow) {
    this.allowPm_ = allow;
    this.dispatchEvent(chatango.managers.Style.EventType.ALLOW_PM_CHANGED);
  }
};
chatango.managers.Style.prototype.pmAllowed = function() {
  return(this.allowPm_ == null ? chatango.group.DefaultStyles.allowpm : this.allowPm_) == 1;
};
chatango.managers.Style.prototype.setTickerEnabled = function(enabled) {
  if (this.tickerEnabled_ !== enabled) {
    this.tickerEnabled_ = enabled;
  }
};
chatango.managers.Style.prototype.tickerEnabled = function() {
  return(this.tickerEnabled == null ? chatango.group.DefaultStyles.ticker : this.tickerEnabled_) == 1;
};
chatango.managers.Style.prototype.useOnMobileEmbed_ = null;
chatango.managers.Style.prototype.setUseOnMobileEmbed = function(allow) {
  if (this.useOnMobileEmbed_ != allow) {
    this.useOnMobileEmbed_ = allow;
  }
};
chatango.managers.Style.prototype.getUseOnMobileEmbed = function() {
  return(this.useOnMobileEmbed_ == null ? chatango.group.DefaultStyles.useonm : this.useOnMobileEmbed_) == 1;
};
chatango.managers.Style.prototype.showOwnersMsg_ = null;
chatango.managers.Style.prototype.showOwnersMessage = function(visible) {
  this.showOwnersMsg_ = visible;
  this.dispatchEvent(chatango.managers.Style.EventType.HEADER_MESSAGE_VISIBILITY_CHANGED);
};
chatango.managers.Style.prototype.messageIsVisible = function() {
  return(this.showOwnersMsg_ == null ? chatango.group.DefaultStyles.w : this.showOwnersMsg_) == 1;
};
chatango.managers.Style.prototype.showStyleBar = function(visible) {
  this.showStyleBar_ = visible;
};
chatango.managers.Style.prototype.isStyleBarShown = function() {
  return(this.showStyleBar_ == null ? chatango.group.DefaultStyles.u : this.showStyleBar_) == 1;
};
chatango.managers.Style.prototype.displayMessageStyles_ = null;
chatango.managers.Style.prototype.setDisplayMessageStyles = function(displayMessageStyles) {
  if (this.displayMessageStyles_ != displayMessageStyles) {
    this.displayMessageStyles_ = displayMessageStyles;
    chatango.managers.MessageStyleManager.getInstance().setEmbedAllowsMessageStyles(this.displayMessageStyles_ == 1);
  }
};
chatango.managers.Style.prototype.getDisplayMessageStyles = function() {
  var displayMessageStylesNum = this.displayMessageStyles_ == null ? chatango.group.DefaultStyles.ab : this.displayMessageStyles_;
  return displayMessageStylesNum == 1;
};
chatango.managers.Style.prototype.fullSizeGroup_ = null;
chatango.managers.Style.prototype.setFullSizeGroup = function(fullsize) {
  this.fullSizeGroup_ = fullsize;
};
chatango.managers.Style.prototype.isFullSizeGroup = function() {
  var fullSizeGroupNum = this.fullSizeGroup_ == null ? chatango.group.DefaultStyles.ac : this.fullSizeGroup_;
  return fullSizeGroupNum == 1;
};
chatango.managers.Style.prototype.userThumbRule_ = null;
chatango.managers.Style.prototype.setDisplayUserThumbsSetting = function(thumbScale) {
  thumbScale = thumbScale != undefined && thumbScale != null ? thumbScale : chatango.group.DefaultStyles.usricon;
  var pad = this.getPadding();
  var rule = ".msg .user-thumb {margin: 0 " + pad + "em " + pad + "em 0;";
  if (thumbScale == 0) {
    rule += " display:none;";
  } else {
    var size = Math.round(thumbScale * 3125) / 1E3;
    rule += " display:block;";
    rule += " width:" + size + "em;";
    rule += " height:" + size + "em;";
  }
  rule += "}";
  this.usrThumbScale_ = thumbScale;
  this.userThumbRule_ = chatango.utils.cssom.setCssRule(rule, this.userThumbRule_);
  this.dispatchEvent(chatango.managers.Style.EventType.MSG_THUMB_DISPLAY_CHANGED);
};
chatango.managers.Style.prototype.getThumbScale = function() {
  if (this.usrThumbScale_ || this.usrThumbScale_ == 0) {
    return this.usrThumbScale_;
  } else {
    if (chatango.groupDefaultStyles != undefined) {
      return chatango.groupDefaultStyles.usricon;
    } else {
      return 1;
    }
  }
};
chatango.managers.Style.prototype.setCVPosition = function(pos) {
  this.cvPos_ = pos;
};
chatango.managers.Style.prototype.getCVPosition = function() {
  return this.cvPos_;
};
chatango.managers.Style.prototype.cvFontRule_ = null;
chatango.managers.Style.prototype.setCVFont = function(family, size, weight) {
  family = family ? family : chatango.group.DefaultStyles.cvfnt;
  this.cvFontFamily_ = family;
  size = size ? size : chatango.group.DefaultStyles.cvfntsz;
  this.cvFontSize_ = size;
  weight = weight ? weight : chatango.group.DefaultStyles.cvfntw;
  this.cvFontWeight = weight;
  var rule = "#CV_NUM, #CV_WRAPPER {font-size: " + size + "; font-family: " + family + "; font-weight: " + weight + "}";
  this.cvFontRule_ = chatango.utils.cssom.setCssRule(rule, this.cvFontRule_);
};
chatango.managers.Style.prototype.getCVFontFamily = function() {
  return this.cvFontFamily_ || chatango.group.DefaultStyles.cvfnt;
};
chatango.managers.Style.prototype.getCVFontSize = function() {
  return this.cvFontSize_ || chatango.group.DefaultStyles.cvfntsz;
};
chatango.managers.Style.prototype.getCVFontWeight = function() {
  return this.cvFontWeight_ || chatango.group.DefaultStyles.cvfntw;
};
chatango.managers.Style.prototype.cvBackgroundColor_ = null;
chatango.managers.Style.prototype.setCVBackgroundColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.cvbg);
  this.cvBackgroundColor_ = col;
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_CV_BG_STYLE_CHANGED);
};
chatango.managers.Style.prototype.getCVBackgroundColor = function() {
  return this.cvBackgroundColor_ || chatango.group.DefaultStyles.cvbg;
};
chatango.managers.Style.prototype.cvBackgroundOpacity_ = null;
chatango.managers.Style.prototype.getCVBackgroundOpacity = function() {
  if (this.cvBackgroundOpacity_ || this.cvBackgroundOpacity_ == 0) {
    return this.cvBackgroundOpacity_;
  } else {
    return chatango.group.DefaultStyles.cvbga;
  }
};
chatango.managers.Style.prototype.setCVBackgroundOpacity = function(opacity) {
  opacity_arr = chatango.utils.cssom.getOpacityValues(opacity, chatango.group.DefaultStyles.cvbga);
  this.cvBackgroundOpacity_ = opacity_arr[1];
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_CV_BG_STYLE_CHANGED);
};
chatango.managers.Style.prototype.cvForegroundColor_ = null;
chatango.managers.Style.prototype.setCVForegroundColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.cvfg);
  this.cvForegroundColor_ = col;
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_CV_FG_COLOR_CHANGED);
};
chatango.managers.Style.prototype.getCVForegroundColor = function() {
  return this.cvForegroundColor_ || chatango.group.DefaultStyles.cvfg;
};
chatango.managers.Style.prototype.cvSize_ = null;
chatango.managers.Style.prototype.setCVSize = function(width, height, opt_resizeNow) {
  width = width && !isNaN(width) ? width : chatango.group.DefaultStyles.cvw;
  height = height && !isNaN(height) ? height : chatango.group.DefaultStyles.cvh;
  this.cvSize_ = new goog.math.Size(width, height);
  if (opt_resizeNow == null || opt_resizeNow) {
    this.dispatchEvent(chatango.managers.Style.EventType.CV_SIZE_CHANGED);
  }
};
chatango.managers.Style.prototype.getCVSize = function() {
  return this.cvSize_;
};
chatango.managers.Style.prototype.messageDateInterval_ = 0;
chatango.managers.Style.prototype.setMsgDateInterval = function(seconds) {
  this.messageDateInterval_ = !seconds && seconds != 0 ? chatango.group.DefaultStyles.dateint : seconds;
};
chatango.managers.Style.prototype.getMsgDateInterval = function() {
  return this.messageDateInterval_;
};
chatango.managers.Style.prototype.uDScrollbarColor_ = null;
chatango.managers.Style.prototype.setUDScrollbarColor = function(col) {
  col = chatango.utils.cssom.getValidHex(col, chatango.group.DefaultStyles.sbc);
  this.uDScrollbarColor_ = col;
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_SB_STYLE_CHANGED);
};
chatango.managers.Style.prototype.getUDScrollbarColor = function() {
  return chatango.utils.cssom.getValidHex(this.uDScrollbarColor_, chatango.group.DefaultStyles.sbc);
};
chatango.managers.Style.prototype.uDScrollbarOpacity_ = null;
chatango.managers.Style.prototype.setUDScrollbarOpacity = function(opacity) {
  this.uDScrollbarOpacity_ = chatango.utils.cssom.getOpacityValues(opacity, chatango.group.DefaultStyles.sba)[1];
  this.dispatchEvent(chatango.managers.Style.EventType.USER_DEFINED_SB_STYLE_CHANGED);
};
chatango.managers.Style.prototype.getUDScrollbarOpacity = function() {
  return this.uDScrollbarOpacity_ == null ? chatango.group.DefaultStyles.sba : this.uDScrollbarOpacity_;
};
chatango.managers.Style.prototype.roundedCornersRule_ = null;
chatango.managers.Style.prototype.roundedCorners_ = null;
chatango.managers.Style.prototype.setRoundedCorners = function(value) {
  this.roundedCorners_ = value;
  var em = Number(value);
  if (isNaN(em)) {
    return;
  }
  em = Math.round(em * 100) / 100;
  var rule = "#OW, #GBG, #SGBG, #IW #input-field, #IWW .msg, .user-thumb, .pb_fg, .pb_bg, #IW .sb-btn, .ipt-icon {border-radius:" + em + "em;}";
  this.roundedCornersRule_ = chatango.utils.cssom.setCssRule(rule, this.roundedCornersRule_);
  this.dispatchEvent(chatango.managers.Style.EventType.RND_CNR_CHANGED);
};
chatango.managers.Style.prototype.getRoundedCorners = function() {
  return this.roundedCorners_ == null ? chatango.group.DefaultStyles.cnrs : this.roundedCorners_;
};
chatango.managers.Style.prototype.setShowHeader = function(value) {
  this.showHeader_ = value;
  this.dispatchEvent(chatango.managers.Style.EventType.SHOW_HEADER_CHANGED);
};
chatango.managers.Style.prototype.getShowHeader = function() {
  return this.showHeader_ == null ? chatango.group.DefaultStyles.showhdr : this.showHeader_;
};
chatango.managers.Style.prototype.setShowCloseButton = function(value) {
  this.showCloseButton_ = value;
  this.dispatchEvent(chatango.managers.Style.EventType.SHOW_CLOSE_BUTTON_CHANGED);
};
chatango.managers.Style.prototype.getShowCloseButton = function() {
  return this.showCloseButton_ == null ? chatango.group.DefaultStyles.showx : this.showCloseButton_;
};
chatango.managers.Style.prototype.setFullWidthTickerOnMobile = function(value) {
  this.fullWidthTickerOnMobile_ = value;
};
chatango.managers.Style.prototype.getFullWidthTickerOnMobile = function() {
  return this.fullWidthTickerOnMobile_ == null ? chatango.group.DefaultStyles.fwtickm : this.fullWidthTickerOnMobile_;
};
chatango.managers.Style.prototype.footerHPaddingRule_ = null;
chatango.managers.Style.prototype.adjustFooterPadding_ = function() {
  var rule = "#FTR {padding-left:0;padding-right:0}";
  if (this.isBorderColorIsSameAsBgColor()) {
    rule = "#FTR {padding-left:1px;padding-right:1px}";
  }
  this.footerHPaddingRule_ = chatango.utils.cssom.setCssRule(rule, this.footerHPaddingRule_);
};
chatango.managers.Style.prototype.getOriginalStyles = function() {
  return this.originalStyles_;
};
chatango.managers.Style.prototype.setOriginalWidth = function(w) {
  this.originalWidth_ = w;
};
chatango.managers.Style.prototype.getOriginalWidth = function() {
  return this.originalWidth_;
};
chatango.managers.Style.prototype.setOriginalHeight = function(h) {
  this.originalHeight_ = h;
};
chatango.managers.Style.prototype.getOriginalHeight = function() {
  return this.originalHeight_;
};
chatango.managers.Style.prototype.isBorderColorIsSameAsBgColor = function() {
  return this.getUDBorderColor() == this.getBackgroundColor() && this.getBackgroundOpacity() > 75;
};
goog.provide("chatango.settings.version.RevisionNumber");
chatango.settings.version.RevisionNumber = function() {
  this.latestR_ = chatango.settings.version.RevisionNumber.MODULES_DATE;
};
goog.addSingletonGetter(chatango.settings.version.RevisionNumber);
chatango.settings.version.RevisionNumber.MODULES_DATE = "1013151550";
chatango.settings.version.RevisionNumber.prototype.getModulesRevision = function() {
  return "r" + this.latestR_;
};
chatango.settings.version.RevisionNumber.prototype.setModulesRevision = function(rNumber) {
  this.latestR_ = rNumber;
};
goog.provide("chatango.group.moduleInfo");
goog.require("chatango.settings.version.RevisionNumber");
chatango.group.moduleInfo.MODULE_INFO = {"shell":[], "CommonCoreModule":["shell"], "Group":["CommonCoreModule"], "CommonUIModule":["CommonCoreModule"], "PmModule":["CommonCoreModule"], "SmileyPickerModule":["CommonUIModule", "CommonCoreModule"], "PaymentsModule":["CommonUIModule", "CommonCoreModule"], "PmExtrasModule":["CommonUIModule", "PmModule"], "CollapsedViewModule":["Group"], "ChatangoMediaModule":["CommonUIModule", "Group"], "MoreInfoModule":["CommonUIModule", "Group"], "VideoModule":["CommonUIModule", 
"Group"], "LoginModule":["CommonUIModule", "Group"], "SettingsModule":["CommonUIModule", "Group"], "ModerationModule":["CommonUIModule", "Group"], "RateRestrictionsModule":["CommonUIModule", "Group"], "FtrIconMenuModule":["CommonUIModule", "Group"], "LogoMenuModule":["CommonUIModule", "Group"], "ShareMenuModule":["CommonUIModule", "Group"], "EditProfileModule":["CommonUIModule"], "MessageCatcherModule":["CommonUIModule", "Group"], "UploadMediaModule":["CommonUIModule", "Group"], "MessageStyleEditorModule":["CommonUIModule", 
"Group"], "StyleBarModule":["CommonUIModule", "Group"], "TextColorModule":["CommonUIModule", "Group"], "ParticipantsModule":["CommonUIModule", "Group"], "ChannelPickerModule":["CommonUIModule", "Group"], "SoundDialogModule":["CommonUIModule", "Group"], "WarningDialogModule":["CommonUIModule", "Group"], "BannedUsersModule":["ModerationModule"], "ManageModsModule":["ModerationModule"], "ModActionsModule":["ModerationModule"], "AutoModModule":["ModerationModule"], "ChooseModIconModule":["ModerationModule"], 
"EditGroupModule":["SettingsModule"], "ChatRestrictionsModule":["SettingsModule"], "ContentControlModule":["SettingsModule"], "AnnouncementsModule":["SettingsModule"], "SupportChatangoModule":["SettingsModule"], "MockGroupModule":["CollapsedViewModule"]};
chatango.group.moduleInfo.modulePrefix_ = "../../../js/gz/" + chatango.settings.version.RevisionNumber.getInstance().getModulesRevision();
chatango.group.moduleInfo.MODULE_URIS = {"shell":["Shell.js"], "CommonCoreModule":[chatango.group.moduleInfo.modulePrefix_ + "/CommonCoreModule.js"], "Group":[chatango.group.moduleInfo.modulePrefix_ + "/Group.js"], "PmModule":[chatango.group.moduleInfo.modulePrefix_ + "/PmModule.js"], "CollapsedViewModule":[chatango.group.moduleInfo.modulePrefix_ + "/CollapsedViewModule.js"], "LoginModule":[chatango.group.moduleInfo.modulePrefix_ + "/LoginModule.js"], "ChatangoMediaModule":[chatango.group.moduleInfo.modulePrefix_ + 
"/ChatangoMediaModule.js"], "MoreInfoModule":[chatango.group.moduleInfo.modulePrefix_ + "/MoreInfoModule.js"], "VideoModule":[chatango.group.moduleInfo.modulePrefix_ + "/VideoModule.js"], "CommonUIModule":[chatango.group.moduleInfo.modulePrefix_ + "/CommonUIModule.js"], "SettingsModule":[chatango.group.moduleInfo.modulePrefix_ + "/SettingsModule.js"], "ModerationModule":[chatango.group.moduleInfo.modulePrefix_ + "/ModerationModule.js"], "RateRestrictionsModule":[chatango.group.moduleInfo.modulePrefix_ + 
"/RateRestrictionsModule.js"], "BannedUsersModule":[chatango.group.moduleInfo.modulePrefix_ + "/BannedUsersModule.js"], "ManageModsModule":[chatango.group.moduleInfo.modulePrefix_ + "/ManageModsModule.js"], "ModActionsModule":[chatango.group.moduleInfo.modulePrefix_ + "/ModActionsModule.js"], "EditGroupModule":[chatango.group.moduleInfo.modulePrefix_ + "/EditGroupModule.js"], "ChatRestrictionsModule":[chatango.group.moduleInfo.modulePrefix_ + "/ChatRestrictionsModule.js"], "ContentControlModule":[chatango.group.moduleInfo.modulePrefix_ + 
"/ContentControlModule.js"], "AnnouncementsModule":[chatango.group.moduleInfo.modulePrefix_ + "/AnnouncementsModule.js"], "SupportChatangoModule":[chatango.group.moduleInfo.modulePrefix_ + "/SupportChatangoModule.js"], "MockGroupModule":[chatango.group.moduleInfo.modulePrefix_ + "/MockGroupModule.js"], "FtrIconMenuModule":[chatango.group.moduleInfo.modulePrefix_ + "/FtrIconMenuModule.js"], "LogoMenuModule":[chatango.group.moduleInfo.modulePrefix_ + "/LogoMenuModule.js"], "ShareMenuModule":[chatango.group.moduleInfo.modulePrefix_ + 
"/ShareMenuModule.js"], "EditProfileModule":[chatango.group.moduleInfo.modulePrefix_ + "/EditProfileModule.js"], "MessageCatcherModule":[chatango.group.moduleInfo.modulePrefix_ + "/MessageCatcherModule.js"], "UploadMediaModule":[chatango.group.moduleInfo.modulePrefix_ + "/UploadMediaModule.js"], "MessageStyleEditorModule":[chatango.group.moduleInfo.modulePrefix_ + "/MessageStyleEditorModule.js"], "StyleBarModule":[chatango.group.moduleInfo.modulePrefix_ + "/StyleBarModule.js"], "TextColorModule":[chatango.group.moduleInfo.modulePrefix_ + 
"/TextColorModule.js"], "PmExtrasModule":[chatango.group.moduleInfo.modulePrefix_ + "/PmExtrasModule.js"], "ParticipantsModule":[chatango.group.moduleInfo.modulePrefix_ + "/ParticipantsModule.js"], "SmileyPickerModule":[chatango.group.moduleInfo.modulePrefix_ + "/SmileyPickerModule.js"], "PaymentsModule":[chatango.group.moduleInfo.modulePrefix_ + "/PaymentsModule.js"], "ChannelPickerModule":[chatango.group.moduleInfo.modulePrefix_ + "/ChannelPickerModule.js"], "SoundDialogModule":[chatango.group.moduleInfo.modulePrefix_ + 
"/SoundDialogModule.js"], "AutoModModule":[chatango.group.moduleInfo.modulePrefix_ + "/AutoModModule.js"], "ChooseModIconModule":[chatango.group.moduleInfo.modulePrefix_ + "/ChooseModIconModule.js"], "WarningDialogModule":[chatango.group.moduleInfo.modulePrefix_ + "/WarningDialogModule.js"]};
goog.require("goog.events.Event");
goog.require("goog.math.Size");
goog.provide("chatango.events.ResizeIframeEvent");
chatango.events.ResizeIframeEvent = function(size) {
  this.size_ = size;
  goog.events.Event.call(this, chatango.events.EventType.RESIZE_IFRAME);
};
goog.inherits(chatango.events.ResizeIframeEvent, goog.events.Event);
chatango.events.ResizeIframeEvent.prototype.getSize = function() {
  return this.size_;
};
goog.provide("chatango.events.EventType");
chatango.events.EventType = {SET_NAME:"setname", LOGOUT:"logout", EDIT_EMAIL:"edit_email", EDIT_PROFILE:"edit_profile", LOGIN_STATUS_DETERMINED:"status_determined", SET_NAME_CLOSED:"setname_closed", UPDATE:"update", LOAD_SETTINGS_MODULE:"loadsettingsmod", CHANGE_LOGIN_DIALOG_SETTING:"changldlgsetting", MUST_LOGIN:"must_login", LOAD_MODERATION_MODULE:"loadmoderationmod", RESPONSE_INFO_READY:"responseready", UNBAN_SUCCESSFUL:"unbansuccessful", SHOW_COUNTER_UPDATE:"showcounterupdate", ENABLE_CHANNELS_UPDATE:"enablechansupdate", 
ALLOW_LINKS_UPDATE:"allowlinksupdate", ALLOW_VIDEOS_UPDATE:"allowvideosupdate", ALLOW_IMAGES_UPDATE:"allowimagesupdate", ALLOW_STYLED_TEXT_UPDATE:"allowstyledtextupdate", SEND_BW_MESSAGES:"send_bw_messages", MOD_DELETE_MESSAGE:"mod_delete_message", MOD_CONFIRM_DELETE_MESSAGE:"mod_confirm_delete_message", MOD_DELETE_ALL_MESSAGES_BY_USER:"mod_del_all_msgs_by_user", MOD_CONFIRM_DELETE_ALL_MESSAGES_BY_USER:"mod_confirm_del_all_msgs_by_user", MOD_BAN_USER:"mod_ban_user", MOD_CONFIRM_BAN_USER:"mod_confirm_ban_user", 
MOD_EASYBAN:"mod_easyban", MOD_EASYBAN_ROLLOVER:"mod_easyban_rollover", MOD_EASYBAN_ROLLOUT:"mod_easyban_rollout", REQUEST_MOD_MODULE:"request_mod_module", RESIZE_IFRAME:"resize_iframe", GET_BROWSER_VIEW:"get_browser_view", BUTTON_EXPANDED:"button_expanded", BUTTON_COLLAPSED:"button_collapsed", BANLIST_READY:"banlistready", BANLIST_ADDITION_READY:"banlistadditionready", CONFIRM:"confirm", CANCEL:"cancel", COLOR_SELECT:"color_select", SET_USER_SCALING:"set_usr_scale", VIEWPORT_TOO_BIG:"viewport2big", 
BAD_UPDATE_INFO:"bad_update_info", OPEN_PM_EVENT:"open_pm", PM_OPENED:"pm_opened", FOOTER_OPEN_PM:"footer_open_pm", PARTICIPANTS_OPEN_PM:"participants_open_pm", PARTICIPANTS_CLOSE:"participants_close", CLOSE:"close", BACK:"back", PM_TO_OR_FROM_USER:"pmtofromuser", BLOCK_USER:"blockuser", ADD_FRIEND:"addfriend", CHANGE_DISPLAY:"change_display", PM_SETTINGS_CHANGE_VIEW:"pm_settings_view", PM_SETTINGS_LOGOUT:"pm_settings_logout", PM_SETTINGS_BLOCKLIST:"pm_settings_blocklist", PM_SETTINGS_EDIT_PROFILE:"pm_settings_edit_profile", 
REMOVE_PROFILE:"remove_profile", RESET_UNREAD:"reset_unread", OPEN_CONN_DIALOG:"open_conn_dialog", CLOSE_CONN_DIALOG:"close_conn_dialog", LOAD_MORE:"load_more", REPLY_TO:"replyto", AUTOCOMPLETE:"autocomplete", TITLE_CHANGE:"titlechange", REFRESH_MESSAGES:"refresh_msgs", CONTROLLER_LIST_ADD_CONFIRMED:"controller_list_add_confirmed", CONTROLLER_ERROR_MESSAGE:"controller_error_message", CONTROLLER_LIST_EMAIL_CONFIRMED:"controller_list_email_confirmed", CONTROLLER_EMAIL_ERROR:"controller_email_error", 
DISABLE_ADDING:"disable_add_button", CREDIT_CARD_ERROR:"credit_card_error", CREDIT_CARD_TRANSACTION_COMPLETE:"credit_card_transaction_complete", CREDIT_CARD_TRANSACTION_COMPLETE_ERROR:"credit_card_transaction_complete_error", SMILEY_PICKED:"smiley_picked", PAY_PAL_REDIRECT:"ppredirect", OPEN_SUPPORT_US:"open_support_us", OPEN_CHAN_DIALOG:"open_chan_dialog", USER_CHANGED:"user_changed", NLP_UPDATED:"nlpupdated", FLAG_UPDATE_ERROR:"flag_update_err", YOUTUBE_CLICK:"youtube_click", ENABLE_RESIZE_DRAGGER:"enable_resize_dragger", 
PORT_FALLBACK:"port_fallback", OPEN_STRANGERS_FILTER:"open_strangers_filter"};
goog.provide("goog.promise.Resolver");
goog.promise.Resolver = function() {
};
goog.promise.Resolver.prototype.promise;
goog.promise.Resolver.prototype.resolve;
goog.promise.Resolver.prototype.reject;
goog.provide("goog.async.FreeList");
goog.async.FreeList = goog.defineClass(null, {constructor:function(create, reset, limit) {
  this.limit_ = limit;
  this.create_ = create;
  this.reset_ = reset;
  this.occupants_ = 0;
  this.head_ = null;
}, get:function() {
  var item;
  if (this.occupants_ > 0) {
    this.occupants_--;
    item = this.head_;
    this.head_ = item.next;
    item.next = null;
  } else {
    item = this.create_();
  }
  return item;
}, put:function(item) {
  this.reset_(item);
  if (this.occupants_ < this.limit_) {
    this.occupants_++;
    item.next = this.head_;
    this.head_ = item;
  }
}, occupants:function() {
  return this.occupants_;
}});
goog.provide("goog.async.WorkItem");
goog.provide("goog.async.WorkQueue");
goog.require("goog.asserts");
goog.require("goog.async.FreeList");
goog.async.WorkQueue = function() {
  this.workHead_ = null;
  this.workTail_ = null;
};
goog.define("goog.async.WorkQueue.DEFAULT_MAX_UNUSED", 100);
goog.async.WorkQueue.freelist_ = new goog.async.FreeList(function() {
  return new goog.async.WorkItem;
}, function(item) {
  item.reset();
}, goog.async.WorkQueue.DEFAULT_MAX_UNUSED);
goog.async.WorkQueue.prototype.add = function(fn, scope) {
  var item = this.getUnusedItem_();
  item.set(fn, scope);
  if (this.workTail_) {
    this.workTail_.next = item;
    this.workTail_ = item;
  } else {
    goog.asserts.assert(!this.workHead_);
    this.workHead_ = item;
    this.workTail_ = item;
  }
};
goog.async.WorkQueue.prototype.remove = function() {
  var item = null;
  if (this.workHead_) {
    item = this.workHead_;
    this.workHead_ = this.workHead_.next;
    if (!this.workHead_) {
      this.workTail_ = null;
    }
    item.next = null;
  }
  return item;
};
goog.async.WorkQueue.prototype.returnUnused = function(item) {
  goog.async.WorkQueue.freelist_.put(item);
};
goog.async.WorkQueue.prototype.getUnusedItem_ = function() {
  return goog.async.WorkQueue.freelist_.get();
};
goog.async.WorkItem = function() {
  this.fn = null;
  this.scope = null;
  this.next = null;
};
goog.async.WorkItem.prototype.set = function(fn, scope) {
  this.fn = fn;
  this.scope = scope;
  this.next = null;
};
goog.async.WorkItem.prototype.reset = function() {
  this.fn = null;
  this.scope = null;
  this.next = null;
};
goog.provide("goog.testing.watchers");
goog.testing.watchers.resetWatchers_ = [];
goog.testing.watchers.signalClockReset = function() {
  var watchers = goog.testing.watchers.resetWatchers_;
  for (var i = 0;i < watchers.length;i++) {
    goog.testing.watchers.resetWatchers_[i]();
  }
};
goog.testing.watchers.watchClockReset = function(fn) {
  goog.testing.watchers.resetWatchers_.push(fn);
};
goog.provide("goog.async.nextTick");
goog.provide("goog.async.throwException");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.functions");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.engine");
goog.async.throwException = function(exception) {
  goog.global.setTimeout(function() {
    throw exception;
  }, 0);
};
goog.async.nextTick = function(callback, opt_context, opt_useSetImmediate) {
  var cb = callback;
  if (opt_context) {
    cb = goog.bind(callback, opt_context);
  }
  cb = goog.async.nextTick.wrapCallback_(cb);
  if (goog.isFunction(goog.global.setImmediate) && (opt_useSetImmediate || !goog.global.Window || !goog.global.Window.prototype || goog.global.Window.prototype.setImmediate != goog.global.setImmediate)) {
    goog.global.setImmediate(cb);
    return;
  }
  if (!goog.async.nextTick.setImmediate_) {
    goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_();
  }
  goog.async.nextTick.setImmediate_(cb);
};
goog.async.nextTick.setImmediate_;
goog.async.nextTick.getSetImmediateEmulator_ = function() {
  var Channel = goog.global["MessageChannel"];
  if (typeof Channel === "undefined" && typeof window !== "undefined" && window.postMessage && window.addEventListener && !goog.labs.userAgent.engine.isPresto()) {
    Channel = function() {
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "";
      document.documentElement.appendChild(iframe);
      var win = iframe.contentWindow;
      var doc = win.document;
      doc.open();
      doc.write("");
      doc.close();
      var message = "callImmediate" + Math.random();
      var origin = win.location.protocol == "file:" ? "*" : win.location.protocol + "//" + win.location.host;
      var onmessage = goog.bind(function(e) {
        if (origin != "*" && e.origin != origin || e.data != message) {
          return;
        }
        this["port1"].onmessage();
      }, this);
      win.addEventListener("message", onmessage, false);
      this["port1"] = {};
      this["port2"] = {postMessage:function() {
        win.postMessage(message, origin);
      }};
    };
  }
  if (typeof Channel !== "undefined" && !goog.labs.userAgent.browser.isIE()) {
    var channel = new Channel;
    var head = {};
    var tail = head;
    channel["port1"].onmessage = function() {
      if (goog.isDef(head.next)) {
        head = head.next;
        var cb = head.cb;
        head.cb = null;
        cb();
      }
    };
    return function(cb) {
      tail.next = {cb:cb};
      tail = tail.next;
      channel["port2"].postMessage(0);
    };
  }
  if (typeof document !== "undefined" && "onreadystatechange" in document.createElement("script")) {
    return function(cb) {
      var script = document.createElement("script");
      script.onreadystatechange = function() {
        script.onreadystatechange = null;
        script.parentNode.removeChild(script);
        script = null;
        cb();
        cb = null;
      };
      document.documentElement.appendChild(script);
    };
  }
  return function(cb) {
    goog.global.setTimeout(cb, 0);
  };
};
goog.async.nextTick.wrapCallback_ = goog.functions.identity;
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.async.nextTick.wrapCallback_ = transformer;
});
goog.provide("goog.async.run");
goog.require("goog.async.WorkQueue");
goog.require("goog.async.nextTick");
goog.require("goog.async.throwException");
goog.require("goog.testing.watchers");
goog.async.run = function(callback, opt_context) {
  if (!goog.async.run.schedule_) {
    goog.async.run.initializeRunner_();
  }
  if (!goog.async.run.workQueueScheduled_) {
    goog.async.run.schedule_();
    goog.async.run.workQueueScheduled_ = true;
  }
  goog.async.run.workQueue_.add(callback, opt_context);
};
goog.async.run.initializeRunner_ = function() {
  if (goog.global.Promise && goog.global.Promise.resolve) {
    var promise = goog.global.Promise.resolve();
    goog.async.run.schedule_ = function() {
      promise.then(goog.async.run.processWorkQueue);
    };
  } else {
    goog.async.run.schedule_ = function() {
      goog.async.nextTick(goog.async.run.processWorkQueue);
    };
  }
};
goog.async.run.forceNextTick = function() {
  goog.async.run.schedule_ = function() {
    goog.async.nextTick(goog.async.run.processWorkQueue);
  };
};
goog.async.run.schedule_;
goog.async.run.workQueueScheduled_ = false;
goog.async.run.workQueue_ = new goog.async.WorkQueue;
if (goog.DEBUG) {
  goog.async.run.resetQueue_ = function() {
    goog.async.run.workQueueScheduled_ = false;
    goog.async.run.workQueue_ = new goog.async.WorkQueue;
  };
  goog.testing.watchers.watchClockReset(goog.async.run.resetQueue_);
}
goog.async.run.processWorkQueue = function() {
  var item = null;
  while (item = goog.async.run.workQueue_.remove()) {
    try {
      item.fn.call(item.scope);
    } catch (e) {
      goog.async.throwException(e);
    }
    goog.async.run.workQueue_.returnUnused(item);
  }
  goog.async.run.workQueueScheduled_ = false;
};
goog.provide("goog.Thenable");
goog.Thenable = function() {
};
goog.Thenable.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
};
goog.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
goog.Thenable.addImplementation = function(ctor) {
  goog.exportProperty(ctor.prototype, "then", ctor.prototype.then);
  if (COMPILED) {
    ctor.prototype[goog.Thenable.IMPLEMENTED_BY_PROP] = true;
  } else {
    ctor.prototype.$goog_Thenable = true;
  }
};
goog.Thenable.isImplementedBy = function(object) {
  if (!object) {
    return false;
  }
  try {
    if (COMPILED) {
      return!!object[goog.Thenable.IMPLEMENTED_BY_PROP];
    }
    return!!object.$goog_Thenable;
  } catch (e) {
    return false;
  }
};
goog.provide("goog.Promise");
goog.require("goog.Thenable");
goog.require("goog.asserts");
goog.require("goog.async.run");
goog.require("goog.async.throwException");
goog.require("goog.debug.Error");
goog.require("goog.promise.Resolver");
goog.Promise = function(resolver, opt_context) {
  this.state_ = goog.Promise.State_.PENDING;
  this.result_ = undefined;
  this.parent_ = null;
  this.callbackEntries_ = null;
  this.executing_ = false;
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    this.unhandledRejectionId_ = 0;
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      this.hadUnhandledRejection_ = false;
    }
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.stack_ = [];
    this.addStackTrace_(new Error("created"));
    this.currentStep_ = 0;
  }
  if (resolver == goog.Promise.RESOLVE_FAST_PATH_) {
    this.resolve_(goog.Promise.State_.FULFILLED, opt_context);
  } else {
    try {
      var self = this;
      resolver.call(opt_context, function(value) {
        self.resolve_(goog.Promise.State_.FULFILLED, value);
      }, function(reason) {
        if (goog.DEBUG && !(reason instanceof goog.Promise.CancellationError)) {
          try {
            if (reason instanceof Error) {
              throw reason;
            } else {
              throw new Error("Promise rejected.");
            }
          } catch (e) {
          }
        }
        self.resolve_(goog.Promise.State_.REJECTED, reason);
      });
    } catch (e) {
      this.resolve_(goog.Promise.State_.REJECTED, e);
    }
  }
};
goog.define("goog.Promise.LONG_STACK_TRACES", false);
goog.define("goog.Promise.UNHANDLED_REJECTION_DELAY", 0);
goog.Promise.State_ = {PENDING:0, BLOCKED:1, FULFILLED:2, REJECTED:3};
goog.Promise.CallbackEntry_;
goog.Promise.RESOLVE_FAST_PATH_ = function() {
};
goog.Promise.resolve = function(opt_value) {
  return new goog.Promise(goog.Promise.RESOLVE_FAST_PATH_, opt_value);
};
goog.Promise.reject = function(opt_reason) {
  return new goog.Promise(function(resolve, reject) {
    reject(opt_reason);
  });
};
goog.Promise.race = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    if (!promises.length) {
      resolve(undefined);
    }
    for (var i = 0, promise;promise = promises[i];i++) {
      promise.then(resolve, reject);
    }
  });
};
goog.Promise.all = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toFulfill = promises.length;
    var values = [];
    if (!toFulfill) {
      resolve(values);
      return;
    }
    var onFulfill = function(index, value) {
      toFulfill--;
      values[index] = value;
      if (toFulfill == 0) {
        resolve(values);
      }
    };
    var onReject = function(reason) {
      reject(reason);
    };
    for (var i = 0, promise;promise = promises[i];i++) {
      promise.then(goog.partial(onFulfill, i), onReject);
    }
  });
};
goog.Promise.firstFulfilled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toReject = promises.length;
    var reasons = [];
    if (!toReject) {
      resolve(undefined);
      return;
    }
    var onFulfill = function(value) {
      resolve(value);
    };
    var onReject = function(index, reason) {
      toReject--;
      reasons[index] = reason;
      if (toReject == 0) {
        reject(reasons);
      }
    };
    for (var i = 0, promise;promise = promises[i];i++) {
      promise.then(onFulfill, goog.partial(onReject, i));
    }
  });
};
goog.Promise.withResolver = function() {
  var resolve, reject;
  var promise = new goog.Promise(function(rs, rj) {
    resolve = rs;
    reject = rj;
  });
  return new goog.Promise.Resolver_(promise, resolve, reject);
};
goog.Promise.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context " + "as the second argument instead of the third?");
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("then"));
  }
  return this.addChildPromise_(goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null, goog.isFunction(opt_onRejected) ? opt_onRejected : null, opt_context);
};
goog.Thenable.addImplementation(goog.Promise);
goog.Promise.prototype.thenAlways = function(onResolved, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("thenAlways"));
  }
  var callback = function() {
    try {
      onResolved.call(opt_context);
    } catch (err) {
      goog.Promise.handleRejection_.call(null, err);
    }
  };
  this.addCallbackEntry_({child:null, onRejected:callback, onFulfilled:callback});
  return this;
};
goog.Promise.prototype.thenCatch = function(onRejected, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("thenCatch"));
  }
  return this.addChildPromise_(null, onRejected, opt_context);
};
goog.Promise.prototype.cancel = function(opt_message) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    goog.async.run(function() {
      var err = new goog.Promise.CancellationError(opt_message);
      this.cancelInternal_(err);
    }, this);
  }
};
goog.Promise.prototype.cancelInternal_ = function(err) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    if (this.parent_) {
      this.parent_.cancelChild_(this, err);
      this.parent_ = null;
    } else {
      this.resolve_(goog.Promise.State_.REJECTED, err);
    }
  }
};
goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
  if (!this.callbackEntries_) {
    return;
  }
  var childCount = 0;
  var childIndex = -1;
  for (var i = 0, entry;entry = this.callbackEntries_[i];i++) {
    var child = entry.child;
    if (child) {
      childCount++;
      if (child == childPromise) {
        childIndex = i;
      }
      if (childIndex >= 0 && childCount > 1) {
        break;
      }
    }
  }
  if (childIndex >= 0) {
    if (this.state_ == goog.Promise.State_.PENDING && childCount == 1) {
      this.cancelInternal_(err);
    } else {
      var callbackEntry = this.callbackEntries_.splice(childIndex, 1)[0];
      this.executeCallback_(callbackEntry, goog.Promise.State_.REJECTED, err);
    }
  }
};
goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
  if ((!this.callbackEntries_ || !this.callbackEntries_.length) && (this.state_ == goog.Promise.State_.FULFILLED || this.state_ == goog.Promise.State_.REJECTED)) {
    this.scheduleCallbacks_();
  }
  if (!this.callbackEntries_) {
    this.callbackEntries_ = [];
  }
  this.callbackEntries_.push(callbackEntry);
};
goog.Promise.prototype.addChildPromise_ = function(onFulfilled, onRejected, opt_context) {
  var callbackEntry = {child:null, onFulfilled:null, onRejected:null};
  callbackEntry.child = new goog.Promise(function(resolve, reject) {
    callbackEntry.onFulfilled = onFulfilled ? function(value) {
      try {
        var result = onFulfilled.call(opt_context, value);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    } : resolve;
    callbackEntry.onRejected = onRejected ? function(reason) {
      try {
        var result = onRejected.call(opt_context, reason);
        if (!goog.isDef(result) && reason instanceof goog.Promise.CancellationError) {
          reject(reason);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    } : reject;
  });
  callbackEntry.child.parent_ = this;
  this.addCallbackEntry_((callbackEntry));
  return callbackEntry.child;
};
goog.Promise.prototype.unblockAndFulfill_ = function(value) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.FULFILLED, value);
};
goog.Promise.prototype.unblockAndReject_ = function(reason) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.REJECTED, reason);
};
goog.Promise.prototype.resolve_ = function(state, x) {
  if (this.state_ != goog.Promise.State_.PENDING) {
    return;
  }
  if (this == x) {
    state = goog.Promise.State_.REJECTED;
    x = new TypeError("Promise cannot resolve to itself");
  } else {
    if (goog.Thenable.isImplementedBy(x)) {
      x = (x);
      this.state_ = goog.Promise.State_.BLOCKED;
      x.then(this.unblockAndFulfill_, this.unblockAndReject_, this);
      return;
    } else {
      if (goog.isObject(x)) {
        try {
          var then = x["then"];
          if (goog.isFunction(then)) {
            this.tryThen_(x, then);
            return;
          }
        } catch (e) {
          state = goog.Promise.State_.REJECTED;
          x = e;
        }
      }
    }
  }
  this.result_ = x;
  this.state_ = state;
  this.parent_ = null;
  this.scheduleCallbacks_();
  if (state == goog.Promise.State_.REJECTED && !(x instanceof goog.Promise.CancellationError)) {
    goog.Promise.addUnhandledRejection_(this, x);
  }
};
goog.Promise.prototype.tryThen_ = function(thenable, then) {
  this.state_ = goog.Promise.State_.BLOCKED;
  var promise = this;
  var called = false;
  var resolve = function(value) {
    if (!called) {
      called = true;
      promise.unblockAndFulfill_(value);
    }
  };
  var reject = function(reason) {
    if (!called) {
      called = true;
      promise.unblockAndReject_(reason);
    }
  };
  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
};
goog.Promise.prototype.scheduleCallbacks_ = function() {
  if (!this.executing_) {
    this.executing_ = true;
    goog.async.run(this.executeCallbacks_, this);
  }
};
goog.Promise.prototype.executeCallbacks_ = function() {
  while (this.callbackEntries_ && this.callbackEntries_.length) {
    var entries = this.callbackEntries_;
    this.callbackEntries_ = null;
    for (var i = 0;i < entries.length;i++) {
      if (goog.Promise.LONG_STACK_TRACES) {
        this.currentStep_++;
      }
      this.executeCallback_(entries[i], this.state_, this.result_);
    }
  }
  this.executing_ = false;
};
goog.Promise.prototype.executeCallback_ = function(callbackEntry, state, result) {
  if (callbackEntry.child) {
    callbackEntry.child.parent_ = null;
  }
  if (state == goog.Promise.State_.FULFILLED) {
    callbackEntry.onFulfilled(result);
  } else {
    if (callbackEntry.child) {
      this.removeUnhandledRejection_();
    }
    callbackEntry.onRejected(result);
  }
};
goog.Promise.prototype.addStackTrace_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && goog.isString(err.stack)) {
    var trace = err.stack.split("\n", 4)[3];
    var message = err.message;
    message += Array(11 - message.length).join(" ");
    this.stack_.push(message + trace);
  }
};
goog.Promise.prototype.appendLongStack_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && err && goog.isString(err.stack) && this.stack_.length) {
    var longTrace = ["Promise trace:"];
    for (var promise = this;promise;promise = promise.parent_) {
      for (var i = this.currentStep_;i >= 0;i--) {
        longTrace.push(promise.stack_[i]);
      }
      longTrace.push("Value: " + "[" + (promise.state_ == goog.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] " + "<" + String(promise.result_) + ">");
    }
    err.stack += "\n\n" + longTrace.join("\n");
  }
};
goog.Promise.prototype.removeUnhandledRejection_ = function() {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    for (var p = this;p && p.unhandledRejectionId_;p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_);
      p.unhandledRejectionId_ = 0;
    }
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      for (var p = this;p && p.hadUnhandledRejection_;p = p.parent_) {
        p.hadUnhandledRejection_ = false;
      }
    }
  }
};
goog.Promise.addUnhandledRejection_ = function(promise, reason) {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    promise.unhandledRejectionId_ = goog.global.setTimeout(function() {
      promise.appendLongStack_(reason);
      goog.Promise.handleRejection_.call(null, reason);
    }, goog.Promise.UNHANDLED_REJECTION_DELAY);
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      promise.hadUnhandledRejection_ = true;
      goog.async.run(function() {
        if (promise.hadUnhandledRejection_) {
          promise.appendLongStack_(reason);
          goog.Promise.handleRejection_.call(null, reason);
        }
      });
    }
  }
};
goog.Promise.handleRejection_ = goog.async.throwException;
goog.Promise.setUnhandledRejectionHandler = function(handler) {
  goog.Promise.handleRejection_ = handler;
};
goog.Promise.CancellationError = function(opt_message) {
  goog.Promise.CancellationError.base(this, "constructor", opt_message);
};
goog.inherits(goog.Promise.CancellationError, goog.debug.Error);
goog.Promise.CancellationError.prototype.name = "cancel";
goog.Promise.Resolver_ = function(promise, resolve, reject) {
  this.promise = promise;
  this.resolve = resolve;
  this.reject = reject;
};
goog.provide("goog.Timer");
goog.require("goog.Promise");
goog.require("goog.events.EventTarget");
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now();
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.INVALID_TIMEOUT_ID_ = -1;
goog.Timer.prototype.enabled = false;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = .8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_;
};
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  if (this.timer_ && this.enabled) {
    this.stop();
    this.start();
  } else {
    if (this.timer_) {
      this.stop();
    }
  }
};
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    var elapsed = goog.now() - this.last_;
    if (elapsed > 0 && elapsed < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed);
      return;
    }
    if (this.timer_) {
      this.timerObject_.clearTimeout(this.timer_);
      this.timer_ = null;
    }
    this.dispatchTick();
    if (this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
      this.last_ = goog.now();
    }
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK);
};
goog.Timer.prototype.start = function() {
  this.enabled = true;
  if (!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
    this.last_ = goog.now();
  }
};
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  if (this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null;
  }
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if (goog.isFunction(listener)) {
    if (opt_handler) {
      listener = goog.bind(listener, opt_handler);
    }
  } else {
    if (listener && typeof listener.handleEvent == "function") {
      listener = goog.bind(listener.handleEvent, listener);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  if (opt_delay > goog.Timer.MAX_TIMEOUT_) {
    return goog.Timer.INVALID_TIMEOUT_ID_;
  } else {
    return goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0);
  }
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId);
};
goog.Timer.promise = function(delay, opt_result) {
  var timerKey = null;
  return(new goog.Promise(function(resolve, reject) {
    timerKey = goog.Timer.callOnce(function() {
      resolve(opt_result);
    }, delay);
    if (timerKey == goog.Timer.INVALID_TIMEOUT_ID_) {
      reject(new Error("Failed to schedule timer."));
    }
  })).thenCatch(function(error) {
    goog.Timer.clear(timerKey);
    throw error;
  });
};
goog.provide("chatango.managers.TitleManager");
goog.require("chatango.events.EventType");
goog.require("goog.Timer");
goog.require("goog.events");
chatango.managers.TitleManager = function() {
  goog.events.EventTarget.call(this);
  this.initTitle_ = null;
  this.tempTitle_ = null;
  this.curTitle_ = null;
  this.timer_ = new goog.Timer(1E3);
  goog.events.listen(this.timer_, goog.Timer.TICK, this.onTick_, false, this);
};
goog.inherits(chatango.managers.TitleManager, goog.events.EventTarget);
goog.addSingletonGetter(chatango.managers.TitleManager);
chatango.managers.TitleManager.prototype.setTitle = function(title) {
  this.curTitle_ = title;
  var evt = new goog.events.Event(chatango.events.EventType.TITLE_CHANGE);
  evt.data = title;
  this.dispatchEvent(evt);
};
chatango.managers.TitleManager.prototype.initTitle = function(title) {
  this.initTitle_ = title;
};
chatango.managers.TitleManager.prototype.startFlashing = function(newTitle) {
  this.tempTitle_ = newTitle;
  if (!this.timer_.enabled) {
    this.timer_.start();
  }
  goog.events.listen(window, goog.events.EventType.FOCUS, this.stopFlashing, false, this);
};
chatango.managers.TitleManager.prototype.stopFlashing = function() {
  this.setTitle(this.initTitle_);
  this.tempTitle_ = null;
  this.timer_.stop();
};
chatango.managers.TitleManager.prototype.onTick_ = function(e) {
  if (this.curTitle_ === this.initTitle_) {
    this.setTitle(this.tempTitle_);
  } else {
    this.setTitle(this.initTitle_);
  }
};
goog.provide("goog.events.EventHandler");
goog.require("goog.Disposable");
goog.require("goog.events");
goog.require("goog.object");
goog.forwardDeclare("goog.events.EventWrapper");
goog.events.EventHandler = function(opt_scope) {
  goog.Disposable.call(this);
  this.handler_ = opt_scope;
  this.keys_ = {};
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(src, type, opt_fn, opt_capture) {
  return this.listen_(src, type, opt_fn, opt_capture);
};
goog.events.EventHandler.prototype.listenWithScope = function(src, type, fn, capture, scope) {
  return this.listen_(src, type, fn, capture, scope);
};
goog.events.EventHandler.prototype.listen_ = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (!goog.isArray(type)) {
    if (type) {
      goog.events.EventHandler.typeArray_[0] = type.toString();
    }
    type = goog.events.EventHandler.typeArray_;
  }
  for (var i = 0;i < type.length;i++) {
    var listenerObj = goog.events.listen(src, type[i], opt_fn || this.handleEvent, opt_capture || false, opt_scope || this.handler_ || this);
    if (!listenerObj) {
      return this;
    }
    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
  }
  return this;
};
goog.events.EventHandler.prototype.listenOnce = function(src, type, opt_fn, opt_capture) {
  return this.listenOnce_(src, type, opt_fn, opt_capture);
};
goog.events.EventHandler.prototype.listenOnceWithScope = function(src, type, fn, capture, scope) {
  return this.listenOnce_(src, type, fn, capture, scope);
};
goog.events.EventHandler.prototype.listenOnce_ = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      this.listenOnce_(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listenerObj = goog.events.listenOnce(src, type, opt_fn || this.handleEvent, opt_capture, opt_scope || this.handler_ || this);
    if (!listenerObj) {
      return this;
    }
    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
  }
  return this;
};
goog.events.EventHandler.prototype.listenWithWrapper = function(src, wrapper, listener, opt_capt) {
  return this.listenWithWrapper_(src, wrapper, listener, opt_capt);
};
goog.events.EventHandler.prototype.listenWithWrapperAndScope = function(src, wrapper, listener, capture, scope) {
  return this.listenWithWrapper_(src, wrapper, listener, capture, scope);
};
goog.events.EventHandler.prototype.listenWithWrapper_ = function(src, wrapper, listener, opt_capt, opt_scope) {
  wrapper.listen(src, listener, opt_capt, opt_scope || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.getListenerCount = function() {
  var count = 0;
  for (var key in this.keys_) {
    if (Object.prototype.hasOwnProperty.call(this.keys_, key)) {
      count++;
    }
  }
  return count;
};
goog.events.EventHandler.prototype.unlisten = function(src, type, opt_fn, opt_capture, opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      this.unlisten(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listener = goog.events.getListener(src, type, opt_fn || this.handleEvent, opt_capture, opt_scope || this.handler_ || this);
    if (listener) {
      goog.events.unlistenByKey(listener);
      delete this.keys_[listener.key];
    }
  }
  return this;
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_scope) {
  wrapper.unlisten(src, listener, opt_capt, opt_scope || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.removeAll = function() {
  goog.object.forEach(this.keys_, goog.events.unlistenByKey);
  this.keys_ = {};
};
goog.events.EventHandler.prototype.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll();
};
goog.events.EventHandler.prototype.handleEvent = function(e) {
  throw Error("EventHandler.handleEvent not implemented");
};
goog.provide("goog.ui.IdGenerator");
goog.ui.IdGenerator = function() {
};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return ":" + (this.nextId_++).toString(36);
};
goog.provide("goog.ui.Component");
goog.provide("goog.ui.Component.Error");
goog.provide("goog.ui.Component.EventType");
goog.provide("goog.ui.Component.State");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.NodeType");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.object");
goog.require("goog.style");
goog.require("goog.ui.IdGenerator");
goog.ui.Component = function(opt_domHelper) {
  goog.events.EventTarget.call(this);
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();
  this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_;
  this.id_ = null;
  this.inDocument_ = false;
  this.element_ = null;
  this.googUiComponentHandler_ = void 0;
  this.model_ = null;
  this.parent_ = null;
  this.children_ = null;
  this.childIndex_ = null;
  this.wasDecorated_ = false;
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.define("goog.ui.Component.ALLOW_DETACHED_DECORATION", false);
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.define("goog.ui.Component.DEFAULT_BIDI_DIR", 0);
goog.ui.Component.defaultRightToLeft_ = goog.ui.Component.DEFAULT_BIDI_DIR == 1 ? false : goog.ui.Component.DEFAULT_BIDI_DIR == -1 ? true : null;
goog.ui.Component.EventType = {BEFORE_SHOW:"beforeshow", SHOW:"show", HIDE:"hide", DISABLE:"disable", ENABLE:"enable", HIGHLIGHT:"highlight", UNHIGHLIGHT:"unhighlight", ACTIVATE:"activate", DEACTIVATE:"deactivate", SELECT:"select", UNSELECT:"unselect", CHECK:"check", UNCHECK:"uncheck", FOCUS:"focus", BLUR:"blur", OPEN:"open", CLOSE:"close", ENTER:"enter", LEAVE:"leave", ACTION:"action", CHANGE:"change"};
goog.ui.Component.Error = {NOT_SUPPORTED:"Method not supported", DECORATE_INVALID:"Invalid element to decorate", ALREADY_RENDERED:"Component already rendered", PARENT_UNABLE_TO_BE_SET:"Unable to set parent component", CHILD_INDEX_OUT_OF_BOUNDS:"Child component index out of bounds", NOT_OUR_CHILD:"Child is not in parent component", NOT_IN_DOCUMENT:"Operation not supported while component is not in document", STATE_INVALID:"Invalid component state"};
goog.ui.Component.State = {ALL:255, DISABLED:1, HOVER:2, ACTIVE:4, SELECTED:8, CHECKED:16, FOCUSED:32, OPENED:64};
goog.ui.Component.getStateTransitionEvent = function(state, isEntering) {
  switch(state) {
    case goog.ui.Component.State.DISABLED:
      return isEntering ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
    case goog.ui.Component.State.HOVER:
      return isEntering ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
    case goog.ui.Component.State.ACTIVE:
      return isEntering ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
    case goog.ui.Component.State.SELECTED:
      return isEntering ? goog.ui.Component.EventType.SELECT : goog.ui.Component.EventType.UNSELECT;
    case goog.ui.Component.State.CHECKED:
      return isEntering ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
    case goog.ui.Component.State.FOCUSED:
      return isEntering ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
    case goog.ui.Component.State.OPENED:
      return isEntering ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE;
    default:
    ;
  }
  throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(rightToLeft) {
  goog.ui.Component.defaultRightToLeft_ = rightToLeft;
};
goog.ui.Component.prototype.getId = function() {
  return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId());
};
goog.ui.Component.prototype.setId = function(id) {
  if (this.parent_ && this.parent_.childIndex_) {
    goog.object.remove(this.parent_.childIndex_, this.id_);
    goog.object.add(this.parent_.childIndex_, id, this);
  }
  this.id_ = id;
};
goog.ui.Component.prototype.getElement = function() {
  return this.element_;
};
goog.ui.Component.prototype.getElementStrict = function() {
  var el = this.element_;
  goog.asserts.assert(el, "Can not call getElementStrict before rendering/decorating.");
  return el;
};
goog.ui.Component.prototype.setElementInternal = function(element) {
  this.element_ = element;
};
goog.ui.Component.prototype.getElementsByClass = function(className) {
  return this.element_ ? this.dom_.getElementsByClass(className, this.element_) : [];
};
goog.ui.Component.prototype.getElementByClass = function(className) {
  return this.element_ ? this.dom_.getElementByClass(className, this.element_) : null;
};
goog.ui.Component.prototype.getRequiredElementByClass = function(className) {
  var el = this.getElementByClass(className);
  goog.asserts.assert(el, "Expected element in component with class: %s", className);
  return el;
};
goog.ui.Component.prototype.getHandler = function() {
  var self = (this);
  if (!self.googUiComponentHandler_) {
    self.googUiComponentHandler_ = new goog.events.EventHandler(self);
  }
  return self.googUiComponentHandler_;
};
goog.ui.Component.prototype.setParent = function(parent) {
  if (this == parent) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  if (parent && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != parent) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  this.parent_ = parent;
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent);
};
goog.ui.Component.prototype.getParent = function() {
  return this.parent_;
};
goog.ui.Component.prototype.setParentEventTarget = function(parent) {
  if (this.parent_ && this.parent_ != parent) {
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent);
};
goog.ui.Component.prototype.getDomHelper = function() {
  return this.dom_;
};
goog.ui.Component.prototype.isInDocument = function() {
  return this.inDocument_;
};
goog.ui.Component.prototype.createDom = function() {
  this.element_ = this.dom_.createElement("div");
};
goog.ui.Component.prototype.render = function(opt_parentElement) {
  this.render_(opt_parentElement);
};
goog.ui.Component.prototype.renderBefore = function(sibling) {
  this.render_((sibling.parentNode), sibling);
};
goog.ui.Component.prototype.render_ = function(opt_parentElement, opt_beforeNode) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (!this.element_) {
    this.createDom();
  }
  if (opt_parentElement) {
    opt_parentElement.insertBefore(this.element_, opt_beforeNode || null);
  } else {
    this.dom_.getDocument().body.appendChild(this.element_);
  }
  if (!this.parent_ || this.parent_.isInDocument()) {
    this.enterDocument();
  }
};
goog.ui.Component.prototype.decorate = function(element) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  } else {
    if (element && this.canDecorate(element)) {
      this.wasDecorated_ = true;
      var doc = goog.dom.getOwnerDocument(element);
      if (!this.dom_ || this.dom_.getDocument() != doc) {
        this.dom_ = goog.dom.getDomHelper(element);
      }
      this.decorateInternal(element);
      if (!goog.ui.Component.ALLOW_DETACHED_DECORATION || goog.dom.contains(doc, element)) {
        this.enterDocument();
      }
    } else {
      throw Error(goog.ui.Component.Error.DECORATE_INVALID);
    }
  }
};
goog.ui.Component.prototype.canDecorate = function(element) {
  return true;
};
goog.ui.Component.prototype.wasDecorated = function() {
  return this.wasDecorated_;
};
goog.ui.Component.prototype.decorateInternal = function(element) {
  this.element_ = element;
};
goog.ui.Component.prototype.enterDocument = function() {
  this.inDocument_ = true;
  this.forEachChild(function(child) {
    if (!child.isInDocument() && child.getElement()) {
      child.enterDocument();
    }
  });
};
goog.ui.Component.prototype.exitDocument = function() {
  this.forEachChild(function(child) {
    if (child.isInDocument()) {
      child.exitDocument();
    }
  });
  if (this.googUiComponentHandler_) {
    this.googUiComponentHandler_.removeAll();
  }
  this.inDocument_ = false;
};
goog.ui.Component.prototype.disposeInternal = function() {
  if (this.inDocument_) {
    this.exitDocument();
  }
  if (this.googUiComponentHandler_) {
    this.googUiComponentHandler_.dispose();
    delete this.googUiComponentHandler_;
  }
  this.forEachChild(function(child) {
    child.dispose();
  });
  if (!this.wasDecorated_ && this.element_) {
    goog.dom.removeNode(this.element_);
  }
  this.children_ = null;
  this.childIndex_ = null;
  this.element_ = null;
  this.model_ = null;
  this.parent_ = null;
  goog.ui.Component.superClass_.disposeInternal.call(this);
};
goog.ui.Component.prototype.makeId = function(idFragment) {
  return this.getId() + "." + idFragment;
};
goog.ui.Component.prototype.makeIds = function(object) {
  var ids = {};
  for (var key in object) {
    ids[key] = this.makeId(object[key]);
  }
  return ids;
};
goog.ui.Component.prototype.getModel = function() {
  return this.model_;
};
goog.ui.Component.prototype.setModel = function(obj) {
  this.model_ = obj;
};
goog.ui.Component.prototype.getFragmentFromId = function(id) {
  return id.substring(this.getId().length + 1);
};
goog.ui.Component.prototype.getElementByFragment = function(idFragment) {
  if (!this.inDocument_) {
    throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
  }
  return this.dom_.getElement(this.makeId(idFragment));
};
goog.ui.Component.prototype.addChild = function(child, opt_render) {
  this.addChildAt(child, this.getChildCount(), opt_render);
};
goog.ui.Component.prototype.addChildAt = function(child, index, opt_render) {
  goog.asserts.assert(!!child, "Provided element must not be null.");
  if (child.inDocument_ && (opt_render || !this.inDocument_)) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (index < 0 || index > this.getChildCount()) {
    throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
  }
  if (!this.childIndex_ || !this.children_) {
    this.childIndex_ = {};
    this.children_ = [];
  }
  if (child.getParent() == this) {
    goog.object.set(this.childIndex_, child.getId(), child);
    goog.array.remove(this.children_, child);
  } else {
    goog.object.add(this.childIndex_, child.getId(), child);
  }
  child.setParent(this);
  goog.array.insertAt(this.children_, child, index);
  if (child.inDocument_ && this.inDocument_ && child.getParent() == this) {
    var contentElement = this.getContentElement();
    var insertBeforeElement = contentElement.childNodes[index] || null;
    if (insertBeforeElement != child.getElement()) {
      contentElement.insertBefore(child.getElement(), insertBeforeElement);
    }
  } else {
    if (opt_render) {
      if (!this.element_) {
        this.createDom();
      }
      var sibling = this.getChildAt(index + 1);
      child.render_(this.getContentElement(), sibling ? sibling.element_ : null);
    } else {
      if (this.inDocument_ && !child.inDocument_ && child.element_ && child.element_.parentNode && child.element_.parentNode.nodeType == goog.dom.NodeType.ELEMENT) {
        child.enterDocument();
      }
    }
  }
};
goog.ui.Component.prototype.getContentElement = function() {
  return this.element_;
};
goog.ui.Component.prototype.isRightToLeft = function() {
  if (this.rightToLeft_ == null) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body);
  }
  return(this.rightToLeft_);
};
goog.ui.Component.prototype.setRightToLeft = function(rightToLeft) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.rightToLeft_ = rightToLeft;
};
goog.ui.Component.prototype.hasChildren = function() {
  return!!this.children_ && this.children_.length != 0;
};
goog.ui.Component.prototype.getChildCount = function() {
  return this.children_ ? this.children_.length : 0;
};
goog.ui.Component.prototype.getChildIds = function() {
  var ids = [];
  this.forEachChild(function(child) {
    ids.push(child.getId());
  });
  return ids;
};
goog.ui.Component.prototype.getChild = function(id) {
  return this.childIndex_ && id ? (goog.object.get(this.childIndex_, id)) || null : null;
};
goog.ui.Component.prototype.getChildAt = function(index) {
  return this.children_ ? this.children_[index] || null : null;
};
goog.ui.Component.prototype.forEachChild = function(f, opt_obj) {
  if (this.children_) {
    goog.array.forEach(this.children_, f, opt_obj);
  }
};
goog.ui.Component.prototype.indexOfChild = function(child) {
  return this.children_ && child ? goog.array.indexOf(this.children_, child) : -1;
};
goog.ui.Component.prototype.removeChild = function(child, opt_unrender) {
  if (child) {
    var id = goog.isString(child) ? child : child.getId();
    child = this.getChild(id);
    if (id && child) {
      goog.object.remove(this.childIndex_, id);
      goog.array.remove(this.children_, child);
      if (opt_unrender) {
        child.exitDocument();
        if (child.element_) {
          goog.dom.removeNode(child.element_);
        }
      }
      child.setParent(null);
    }
  }
  if (!child) {
    throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
  }
  return(child);
};
goog.ui.Component.prototype.removeChildAt = function(index, opt_unrender) {
  return this.removeChild(this.getChildAt(index), opt_unrender);
};
goog.ui.Component.prototype.removeChildren = function(opt_unrender) {
  var removedChildren = [];
  while (this.hasChildren()) {
    removedChildren.push(this.removeChildAt(0, opt_unrender));
  }
  return removedChildren;
};
goog.provide("goog.a11y.aria.AutoCompleteValues");
goog.provide("goog.a11y.aria.CheckedValues");
goog.provide("goog.a11y.aria.DropEffectValues");
goog.provide("goog.a11y.aria.ExpandedValues");
goog.provide("goog.a11y.aria.GrabbedValues");
goog.provide("goog.a11y.aria.InvalidValues");
goog.provide("goog.a11y.aria.LivePriority");
goog.provide("goog.a11y.aria.OrientationValues");
goog.provide("goog.a11y.aria.PressedValues");
goog.provide("goog.a11y.aria.RelevantValues");
goog.provide("goog.a11y.aria.SelectedValues");
goog.provide("goog.a11y.aria.SortValues");
goog.provide("goog.a11y.aria.State");
goog.a11y.aria.State = {ACTIVEDESCENDANT:"activedescendant", ATOMIC:"atomic", AUTOCOMPLETE:"autocomplete", BUSY:"busy", CHECKED:"checked", CONTROLS:"controls", DESCRIBEDBY:"describedby", DISABLED:"disabled", DROPEFFECT:"dropeffect", EXPANDED:"expanded", FLOWTO:"flowto", GRABBED:"grabbed", HASPOPUP:"haspopup", HIDDEN:"hidden", INVALID:"invalid", LABEL:"label", LABELLEDBY:"labelledby", LEVEL:"level", LIVE:"live", MULTILINE:"multiline", MULTISELECTABLE:"multiselectable", ORIENTATION:"orientation", OWNS:"owns", 
POSINSET:"posinset", PRESSED:"pressed", READONLY:"readonly", RELEVANT:"relevant", REQUIRED:"required", SELECTED:"selected", SETSIZE:"setsize", SORT:"sort", VALUEMAX:"valuemax", VALUEMIN:"valuemin", VALUENOW:"valuenow", VALUETEXT:"valuetext"};
goog.a11y.aria.AutoCompleteValues = {INLINE:"inline", LIST:"list", BOTH:"both", NONE:"none"};
goog.a11y.aria.DropEffectValues = {COPY:"copy", MOVE:"move", LINK:"link", EXECUTE:"execute", POPUP:"popup", NONE:"none"};
goog.a11y.aria.LivePriority = {OFF:"off", POLITE:"polite", ASSERTIVE:"assertive"};
goog.a11y.aria.OrientationValues = {VERTICAL:"vertical", HORIZONTAL:"horizontal"};
goog.a11y.aria.RelevantValues = {ADDITIONS:"additions", REMOVALS:"removals", TEXT:"text", ALL:"all"};
goog.a11y.aria.SortValues = {ASCENDING:"ascending", DESCENDING:"descending", NONE:"none", OTHER:"other"};
goog.a11y.aria.CheckedValues = {TRUE:"true", FALSE:"false", MIXED:"mixed", UNDEFINED:"undefined"};
goog.a11y.aria.ExpandedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.a11y.aria.GrabbedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.a11y.aria.InvalidValues = {FALSE:"false", TRUE:"true", GRAMMAR:"grammar", SPELLING:"spelling"};
goog.a11y.aria.PressedValues = {TRUE:"true", FALSE:"false", MIXED:"mixed", UNDEFINED:"undefined"};
goog.a11y.aria.SelectedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.provide("goog.a11y.aria.datatables");
goog.require("goog.a11y.aria.State");
goog.require("goog.object");
goog.a11y.aria.DefaultStateValueMap_;
goog.a11y.aria.datatables.getDefaultValuesMap = function() {
  if (!goog.a11y.aria.DefaultStateValueMap_) {
    goog.a11y.aria.DefaultStateValueMap_ = goog.object.create(goog.a11y.aria.State.ATOMIC, false, goog.a11y.aria.State.AUTOCOMPLETE, "none", goog.a11y.aria.State.DROPEFFECT, "none", goog.a11y.aria.State.HASPOPUP, false, goog.a11y.aria.State.LIVE, "off", goog.a11y.aria.State.MULTILINE, false, goog.a11y.aria.State.MULTISELECTABLE, false, goog.a11y.aria.State.ORIENTATION, "vertical", goog.a11y.aria.State.READONLY, false, goog.a11y.aria.State.RELEVANT, "additions text", goog.a11y.aria.State.REQUIRED, 
    false, goog.a11y.aria.State.SORT, "none", goog.a11y.aria.State.BUSY, false, goog.a11y.aria.State.DISABLED, false, goog.a11y.aria.State.HIDDEN, false, goog.a11y.aria.State.INVALID, "false");
  }
  return goog.a11y.aria.DefaultStateValueMap_;
};
goog.provide("goog.a11y.aria.Role");
goog.a11y.aria.Role = {ALERT:"alert", ALERTDIALOG:"alertdialog", APPLICATION:"application", ARTICLE:"article", BANNER:"banner", BUTTON:"button", CHECKBOX:"checkbox", COLUMNHEADER:"columnheader", COMBOBOX:"combobox", COMPLEMENTARY:"complementary", CONTENTINFO:"contentinfo", DEFINITION:"definition", DIALOG:"dialog", DIRECTORY:"directory", DOCUMENT:"document", FORM:"form", GRID:"grid", GRIDCELL:"gridcell", GROUP:"group", HEADING:"heading", IMG:"img", LINK:"link", LIST:"list", LISTBOX:"listbox", LISTITEM:"listitem", 
LOG:"log", MAIN:"main", MARQUEE:"marquee", MATH:"math", MENU:"menu", MENUBAR:"menubar", MENU_ITEM:"menuitem", MENU_ITEM_CHECKBOX:"menuitemcheckbox", MENU_ITEM_RADIO:"menuitemradio", NAVIGATION:"navigation", NOTE:"note", OPTION:"option", PRESENTATION:"presentation", PROGRESSBAR:"progressbar", RADIO:"radio", RADIOGROUP:"radiogroup", REGION:"region", ROW:"row", ROWGROUP:"rowgroup", ROWHEADER:"rowheader", SCROLLBAR:"scrollbar", SEARCH:"search", SEPARATOR:"separator", SLIDER:"slider", SPINBUTTON:"spinbutton", 
STATUS:"status", TAB:"tab", TAB_LIST:"tablist", TAB_PANEL:"tabpanel", TEXTBOX:"textbox", TIMER:"timer", TOOLBAR:"toolbar", TOOLTIP:"tooltip", TREE:"tree", TREEGRID:"treegrid", TREEITEM:"treeitem"};
goog.provide("goog.a11y.aria");
goog.require("goog.a11y.aria.Role");
goog.require("goog.a11y.aria.State");
goog.require("goog.a11y.aria.datatables");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.object");
goog.require("goog.string");
goog.a11y.aria.ARIA_PREFIX_ = "aria-";
goog.a11y.aria.ROLE_ATTRIBUTE_ = "role";
goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_ = [goog.dom.TagName.A, goog.dom.TagName.AREA, goog.dom.TagName.BUTTON, goog.dom.TagName.HEAD, goog.dom.TagName.INPUT, goog.dom.TagName.LINK, goog.dom.TagName.MENU, goog.dom.TagName.META, goog.dom.TagName.OPTGROUP, goog.dom.TagName.OPTION, goog.dom.TagName.PROGRESS, goog.dom.TagName.STYLE, goog.dom.TagName.SELECT, goog.dom.TagName.SOURCE, goog.dom.TagName.TEXTAREA, goog.dom.TagName.TITLE, goog.dom.TagName.TRACK];
goog.a11y.aria.setRole = function(element, roleName) {
  if (!roleName) {
    goog.a11y.aria.removeRole(element);
  } else {
    if (goog.asserts.ENABLE_ASSERTS) {
      goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.Role, roleName), "No such ARIA role " + roleName);
    }
    element.setAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_, roleName);
  }
};
goog.a11y.aria.getRole = function(element) {
  var role = element.getAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_);
  return(role) || null;
};
goog.a11y.aria.removeRole = function(element) {
  element.removeAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_);
};
goog.a11y.aria.setState = function(element, stateName, value) {
  if (goog.isArray(value)) {
    value = value.join(" ");
  }
  var attrStateName = goog.a11y.aria.getAriaAttributeName_(stateName);
  if (value === "" || value == undefined) {
    var defaultValueMap = goog.a11y.aria.datatables.getDefaultValuesMap();
    if (stateName in defaultValueMap) {
      element.setAttribute(attrStateName, defaultValueMap[stateName]);
    } else {
      element.removeAttribute(attrStateName);
    }
  } else {
    element.setAttribute(attrStateName, value);
  }
};
goog.a11y.aria.toggleState = function(el, attr) {
  var val = goog.a11y.aria.getState(el, attr);
  if (!goog.string.isEmptyOrWhitespace(goog.string.makeSafe(val)) && !(val == "true" || val == "false")) {
    goog.a11y.aria.removeState(el, (attr));
    return;
  }
  goog.a11y.aria.setState(el, attr, val == "true" ? "false" : "true");
};
goog.a11y.aria.removeState = function(element, stateName) {
  element.removeAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
};
goog.a11y.aria.getState = function(element, stateName) {
  var attr = (element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName)));
  var isNullOrUndefined = attr == null || attr == undefined;
  return isNullOrUndefined ? "" : String(attr);
};
goog.a11y.aria.getActiveDescendant = function(element) {
  var id = goog.a11y.aria.getState(element, goog.a11y.aria.State.ACTIVEDESCENDANT);
  return goog.dom.getOwnerDocument(element).getElementById(id);
};
goog.a11y.aria.setActiveDescendant = function(element, activeElement) {
  var id = "";
  if (activeElement) {
    id = activeElement.id;
    goog.asserts.assert(id, "The active element should have an id.");
  }
  goog.a11y.aria.setState(element, goog.a11y.aria.State.ACTIVEDESCENDANT, id);
};
goog.a11y.aria.getLabel = function(element) {
  return goog.a11y.aria.getState(element, goog.a11y.aria.State.LABEL);
};
goog.a11y.aria.setLabel = function(element, label) {
  goog.a11y.aria.setState(element, goog.a11y.aria.State.LABEL, label);
};
goog.a11y.aria.assertRoleIsSetInternalUtil = function(element, allowedRoles) {
  if (goog.array.contains(goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_, element.tagName)) {
    return;
  }
  var elementRole = (goog.a11y.aria.getRole(element));
  goog.asserts.assert(elementRole != null, "The element ARIA role cannot be null.");
  goog.asserts.assert(goog.array.contains(allowedRoles, elementRole), "Non existing or incorrect role set for element." + 'The role set is "' + elementRole + '". The role should be any of "' + allowedRoles + '". Check the ARIA specification for more details ' + "http://www.w3.org/TR/wai-aria/roles.");
};
goog.a11y.aria.getStateBoolean = function(element, stateName) {
  var attr = (element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName)));
  goog.asserts.assert(goog.isBoolean(attr) || attr == null || attr == "true" || attr == "false");
  if (attr == null) {
    return attr;
  }
  return goog.isBoolean(attr) ? attr : attr == "true";
};
goog.a11y.aria.getStateNumber = function(element, stateName) {
  var attr = (element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName)));
  goog.asserts.assert((attr == null || !isNaN(Number(attr))) && !goog.isBoolean(attr));
  return attr == null ? null : Number(attr);
};
goog.a11y.aria.getStateString = function(element, stateName) {
  var attr = element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
  goog.asserts.assert((attr == null || goog.isString(attr)) && isNaN(Number(attr)) && attr != "true" && attr != "false");
  return attr == null ? null : attr;
};
goog.a11y.aria.getStringArrayStateInternalUtil = function(element, stateName) {
  var attrValue = element.getAttribute(goog.a11y.aria.getAriaAttributeName_(stateName));
  return goog.a11y.aria.splitStringOnWhitespace_(attrValue);
};
goog.a11y.aria.splitStringOnWhitespace_ = function(stringValue) {
  return stringValue ? stringValue.split(/\s+/) : [];
};
goog.a11y.aria.getAriaAttributeName_ = function(ariaName) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.assert(ariaName, "ARIA attribute cannot be empty.");
    goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.State, ariaName), "No such ARIA attribute " + ariaName);
  }
  return goog.a11y.aria.ARIA_PREFIX_ + ariaName;
};
goog.provide("goog.dom.classlist");
goog.require("goog.array");
goog.define("goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST", false);
goog.dom.classlist.get = function(element) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList;
  }
  var className = element.className;
  return goog.isString(className) && className.match(/\S+/g) || [];
};
goog.dom.classlist.set = function(element, className) {
  element.className = className;
};
goog.dom.classlist.contains = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList.contains(className);
  }
  return goog.array.contains(goog.dom.classlist.get(element), className);
};
goog.dom.classlist.add = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.add(className);
    return;
  }
  if (!goog.dom.classlist.contains(element, className)) {
    element.className += element.className.length > 0 ? " " + className : className;
  }
};
goog.dom.classlist.addAll = function(element, classesToAdd) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    goog.array.forEach(classesToAdd, function(className) {
      goog.dom.classlist.add(element, className);
    });
    return;
  }
  var classMap = {};
  goog.array.forEach(goog.dom.classlist.get(element), function(className) {
    classMap[className] = true;
  });
  goog.array.forEach(classesToAdd, function(className) {
    classMap[className] = true;
  });
  element.className = "";
  for (var className in classMap) {
    element.className += element.className.length > 0 ? " " + className : className;
  }
};
goog.dom.classlist.remove = function(element, className) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.remove(className);
    return;
  }
  if (goog.dom.classlist.contains(element, className)) {
    element.className = goog.array.filter(goog.dom.classlist.get(element), function(c) {
      return c != className;
    }).join(" ");
  }
};
goog.dom.classlist.removeAll = function(element, classesToRemove) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    goog.array.forEach(classesToRemove, function(className) {
      goog.dom.classlist.remove(element, className);
    });
    return;
  }
  element.className = goog.array.filter(goog.dom.classlist.get(element), function(className) {
    return!goog.array.contains(classesToRemove, className);
  }).join(" ");
};
goog.dom.classlist.enable = function(element, className, enabled) {
  if (enabled) {
    goog.dom.classlist.add(element, className);
  } else {
    goog.dom.classlist.remove(element, className);
  }
};
goog.dom.classlist.enableAll = function(element, classesToEnable, enabled) {
  var f = enabled ? goog.dom.classlist.addAll : goog.dom.classlist.removeAll;
  f(element, classesToEnable);
};
goog.dom.classlist.swap = function(element, fromClass, toClass) {
  if (goog.dom.classlist.contains(element, fromClass)) {
    goog.dom.classlist.remove(element, fromClass);
    goog.dom.classlist.add(element, toClass);
    return true;
  }
  return false;
};
goog.dom.classlist.toggle = function(element, className) {
  var add = !goog.dom.classlist.contains(element, className);
  goog.dom.classlist.enable(element, className, add);
  return add;
};
goog.dom.classlist.addRemove = function(element, classToRemove, classToAdd) {
  goog.dom.classlist.remove(element, classToRemove);
  goog.dom.classlist.add(element, classToAdd);
};
goog.provide("goog.ui.ControlRenderer");
goog.require("goog.a11y.aria");
goog.require("goog.a11y.aria.Role");
goog.require("goog.a11y.aria.State");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.classlist");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.style");
goog.require("goog.ui.Component");
goog.require("goog.userAgent");
goog.ui.ControlRenderer = function() {
};
goog.addSingletonGetter(goog.ui.ControlRenderer);
goog.tagUnsealableClass(goog.ui.ControlRenderer);
goog.ui.ControlRenderer.getCustomRenderer = function(ctor, cssClassName) {
  var renderer = new ctor;
  renderer.getCssClass = function() {
    return cssClassName;
  };
  return renderer;
};
goog.ui.ControlRenderer.CSS_CLASS = goog.getCssName("goog-control");
goog.ui.ControlRenderer.IE6_CLASS_COMBINATIONS = [];
goog.ui.ControlRenderer.ariaAttributeMap_;
goog.ui.ControlRenderer.TOGGLE_ARIA_STATE_MAP_ = goog.object.create(goog.a11y.aria.Role.BUTTON, goog.a11y.aria.State.PRESSED, goog.a11y.aria.Role.CHECKBOX, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.MENU_ITEM, goog.a11y.aria.State.SELECTED, goog.a11y.aria.Role.MENU_ITEM_CHECKBOX, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.MENU_ITEM_RADIO, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.RADIO, goog.a11y.aria.State.CHECKED, goog.a11y.aria.Role.TAB, goog.a11y.aria.State.SELECTED, goog.a11y.aria.Role.TREEITEM, 
goog.a11y.aria.State.SELECTED);
goog.ui.ControlRenderer.prototype.getAriaRole = function() {
  return undefined;
};
goog.ui.ControlRenderer.prototype.createDom = function(control) {
  var element = control.getDomHelper().createDom("div", this.getClassNames(control).join(" "), control.getContent());
  return element;
};
goog.ui.ControlRenderer.prototype.getContentElement = function(element) {
  return element;
};
goog.ui.ControlRenderer.prototype.enableClassName = function(control, className, enable) {
  var element = (control.getElement ? control.getElement() : control);
  if (element) {
    var classNames = [className];
    if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7")) {
      classNames = this.getAppliedCombinedClassNames_(goog.dom.classlist.get(element), className);
      classNames.push(className);
    }
    goog.dom.classlist.enableAll(element, classNames, enable);
  }
};
goog.ui.ControlRenderer.prototype.enableExtraClassName = function(control, className, enable) {
  this.enableClassName(control, className, enable);
};
goog.ui.ControlRenderer.prototype.canDecorate = function(element) {
  return true;
};
goog.ui.ControlRenderer.prototype.decorate = function(control, element) {
  if (element.id) {
    control.setId(element.id);
  }
  var contentElem = this.getContentElement(element);
  if (contentElem && contentElem.firstChild) {
    control.setContentInternal(contentElem.firstChild.nextSibling ? goog.array.clone(contentElem.childNodes) : contentElem.firstChild);
  } else {
    control.setContentInternal(null);
  }
  var state = 0;
  var rendererClassName = this.getCssClass();
  var structuralClassName = this.getStructuralCssClass();
  var hasRendererClassName = false;
  var hasStructuralClassName = false;
  var hasCombinedClassName = false;
  var classNames = goog.array.toArray(goog.dom.classlist.get(element));
  goog.array.forEach(classNames, function(className) {
    if (!hasRendererClassName && className == rendererClassName) {
      hasRendererClassName = true;
      if (structuralClassName == rendererClassName) {
        hasStructuralClassName = true;
      }
    } else {
      if (!hasStructuralClassName && className == structuralClassName) {
        hasStructuralClassName = true;
      } else {
        state |= this.getStateFromClass(className);
      }
    }
    if (this.getStateFromClass(className) == goog.ui.Component.State.DISABLED) {
      goog.asserts.assertElement(contentElem);
      if (goog.dom.isFocusableTabIndex(contentElem)) {
        goog.dom.setFocusableTabIndex(contentElem, false);
      }
    }
  }, this);
  control.setStateInternal(state);
  if (!hasRendererClassName) {
    classNames.push(rendererClassName);
    if (structuralClassName == rendererClassName) {
      hasStructuralClassName = true;
    }
  }
  if (!hasStructuralClassName) {
    classNames.push(structuralClassName);
  }
  var extraClassNames = control.getExtraClassNames();
  if (extraClassNames) {
    classNames.push.apply(classNames, extraClassNames);
  }
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7")) {
    var combinedClasses = this.getAppliedCombinedClassNames_(classNames);
    if (combinedClasses.length > 0) {
      classNames.push.apply(classNames, combinedClasses);
      hasCombinedClassName = true;
    }
  }
  if (!hasRendererClassName || !hasStructuralClassName || extraClassNames || hasCombinedClassName) {
    goog.dom.classlist.set(element, classNames.join(" "));
  }
  return element;
};
goog.ui.ControlRenderer.prototype.initializeDom = function(control) {
  if (control.isRightToLeft()) {
    this.setRightToLeft(control.getElement(), true);
  }
  if (control.isEnabled()) {
    this.setFocusable(control, control.isVisible());
  }
};
goog.ui.ControlRenderer.prototype.setAriaRole = function(element, opt_preferredRole) {
  var ariaRole = opt_preferredRole || this.getAriaRole();
  if (ariaRole) {
    goog.asserts.assert(element, "The element passed as a first parameter cannot be null.");
    var currentRole = goog.a11y.aria.getRole(element);
    if (ariaRole == currentRole) {
      return;
    }
    goog.a11y.aria.setRole(element, ariaRole);
  }
};
goog.ui.ControlRenderer.prototype.setAriaStates = function(control, element) {
  goog.asserts.assert(control);
  goog.asserts.assert(element);
  var ariaLabel = control.getAriaLabel();
  if (goog.isDefAndNotNull(ariaLabel)) {
    this.setAriaLabel(element, ariaLabel);
  }
  if (!control.isVisible()) {
    goog.a11y.aria.setState(element, goog.a11y.aria.State.HIDDEN, !control.isVisible());
  }
  if (!control.isEnabled()) {
    this.updateAriaState(element, goog.ui.Component.State.DISABLED, !control.isEnabled());
  }
  if (control.isSupportedState(goog.ui.Component.State.SELECTED)) {
    this.updateAriaState(element, goog.ui.Component.State.SELECTED, control.isSelected());
  }
  if (control.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(element, goog.ui.Component.State.CHECKED, control.isChecked());
  }
  if (control.isSupportedState(goog.ui.Component.State.OPENED)) {
    this.updateAriaState(element, goog.ui.Component.State.OPENED, control.isOpen());
  }
};
goog.ui.ControlRenderer.prototype.setAriaLabel = function(element, ariaLabel) {
  goog.a11y.aria.setLabel(element, ariaLabel);
};
goog.ui.ControlRenderer.prototype.setAllowTextSelection = function(element, allow) {
  goog.style.setUnselectable(element, !allow, !goog.userAgent.IE && !goog.userAgent.OPERA);
};
goog.ui.ControlRenderer.prototype.setRightToLeft = function(element, rightToLeft) {
  this.enableClassName(element, goog.getCssName(this.getStructuralCssClass(), "rtl"), rightToLeft);
};
goog.ui.ControlRenderer.prototype.isFocusable = function(control) {
  var keyTarget;
  if (control.isSupportedState(goog.ui.Component.State.FOCUSED) && (keyTarget = control.getKeyEventTarget())) {
    return goog.dom.isFocusableTabIndex(keyTarget);
  }
  return false;
};
goog.ui.ControlRenderer.prototype.setFocusable = function(control, focusable) {
  var keyTarget;
  if (control.isSupportedState(goog.ui.Component.State.FOCUSED) && (keyTarget = control.getKeyEventTarget())) {
    if (!focusable && control.isFocused()) {
      try {
        keyTarget.blur();
      } catch (e) {
      }
      if (control.isFocused()) {
        control.handleBlur(null);
      }
    }
    if (goog.dom.isFocusableTabIndex(keyTarget) != focusable) {
      goog.dom.setFocusableTabIndex(keyTarget, focusable);
    }
  }
};
goog.ui.ControlRenderer.prototype.setVisible = function(element, visible) {
  goog.style.setElementShown(element, visible);
  if (element) {
    goog.a11y.aria.setState(element, goog.a11y.aria.State.HIDDEN, !visible);
  }
};
goog.ui.ControlRenderer.prototype.setState = function(control, state, enable) {
  var element = control.getElement();
  if (element) {
    var className = this.getClassForState(state);
    if (className) {
      this.enableClassName(control, className, enable);
    }
    this.updateAriaState(element, state, enable);
  }
};
goog.ui.ControlRenderer.prototype.updateAriaState = function(element, state, enable) {
  if (!goog.ui.ControlRenderer.ariaAttributeMap_) {
    goog.ui.ControlRenderer.ariaAttributeMap_ = goog.object.create(goog.ui.Component.State.DISABLED, goog.a11y.aria.State.DISABLED, goog.ui.Component.State.SELECTED, goog.a11y.aria.State.SELECTED, goog.ui.Component.State.CHECKED, goog.a11y.aria.State.CHECKED, goog.ui.Component.State.OPENED, goog.a11y.aria.State.EXPANDED);
  }
  goog.asserts.assert(element, "The element passed as a first parameter cannot be null.");
  var ariaAttr = goog.ui.ControlRenderer.getAriaStateForAriaRole_(element, goog.ui.ControlRenderer.ariaAttributeMap_[state]);
  if (ariaAttr) {
    goog.a11y.aria.setState(element, ariaAttr, enable);
  }
};
goog.ui.ControlRenderer.getAriaStateForAriaRole_ = function(element, attr) {
  var role = goog.a11y.aria.getRole(element);
  if (!role) {
    return attr;
  }
  role = (role);
  var matchAttr = goog.ui.ControlRenderer.TOGGLE_ARIA_STATE_MAP_[role] || attr;
  return goog.ui.ControlRenderer.isAriaState_(attr) ? matchAttr : attr;
};
goog.ui.ControlRenderer.isAriaState_ = function(attr) {
  return attr == goog.a11y.aria.State.CHECKED || attr == goog.a11y.aria.State.SELECTED;
};
goog.ui.ControlRenderer.prototype.setContent = function(element, content) {
  var contentElem = this.getContentElement(element);
  if (contentElem) {
    goog.dom.removeChildren(contentElem);
    if (content) {
      if (goog.isString(content)) {
        goog.dom.setTextContent(contentElem, content);
      } else {
        var childHandler = function(child) {
          if (child) {
            var doc = goog.dom.getOwnerDocument(contentElem);
            contentElem.appendChild(goog.isString(child) ? doc.createTextNode(child) : child);
          }
        };
        if (goog.isArray(content)) {
          goog.array.forEach(content, childHandler);
        } else {
          if (goog.isArrayLike(content) && !("nodeType" in content)) {
            goog.array.forEach(goog.array.clone((content)), childHandler);
          } else {
            childHandler(content);
          }
        }
      }
    }
  }
};
goog.ui.ControlRenderer.prototype.getKeyEventTarget = function(control) {
  return control.getElement();
};
goog.ui.ControlRenderer.prototype.getCssClass = function() {
  return goog.ui.ControlRenderer.CSS_CLASS;
};
goog.ui.ControlRenderer.prototype.getIe6ClassCombinations = function() {
  return[];
};
goog.ui.ControlRenderer.prototype.getStructuralCssClass = function() {
  return this.getCssClass();
};
goog.ui.ControlRenderer.prototype.getClassNames = function(control) {
  var cssClass = this.getCssClass();
  var classNames = [cssClass];
  var structuralCssClass = this.getStructuralCssClass();
  if (structuralCssClass != cssClass) {
    classNames.push(structuralCssClass);
  }
  var classNamesForState = this.getClassNamesForState(control.getState());
  classNames.push.apply(classNames, classNamesForState);
  var extraClassNames = control.getExtraClassNames();
  if (extraClassNames) {
    classNames.push.apply(classNames, extraClassNames);
  }
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7")) {
    classNames.push.apply(classNames, this.getAppliedCombinedClassNames_(classNames));
  }
  return classNames;
};
goog.ui.ControlRenderer.prototype.getAppliedCombinedClassNames_ = function(classes, opt_includedClass) {
  var toAdd = [];
  if (opt_includedClass) {
    classes = classes.concat([opt_includedClass]);
  }
  goog.array.forEach(this.getIe6ClassCombinations(), function(combo) {
    if (goog.array.every(combo, goog.partial(goog.array.contains, classes)) && (!opt_includedClass || goog.array.contains(combo, opt_includedClass))) {
      toAdd.push(combo.join("_"));
    }
  });
  return toAdd;
};
goog.ui.ControlRenderer.prototype.getClassNamesForState = function(state) {
  var classNames = [];
  while (state) {
    var mask = state & -state;
    classNames.push(this.getClassForState((mask)));
    state &= ~mask;
  }
  return classNames;
};
goog.ui.ControlRenderer.prototype.getClassForState = function(state) {
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }
  return this.classByState_[state];
};
goog.ui.ControlRenderer.prototype.getStateFromClass = function(className) {
  if (!this.stateByClass_) {
    this.createStateByClassMap_();
  }
  var state = parseInt(this.stateByClass_[className], 10);
  return(isNaN(state) ? 0 : state);
};
goog.ui.ControlRenderer.prototype.createClassByStateMap_ = function() {
  var baseClass = this.getStructuralCssClass();
  var isValidClassName = !goog.string.contains(goog.string.normalizeWhitespace(baseClass), " ");
  goog.asserts.assert(isValidClassName, "ControlRenderer has an invalid css class: '" + baseClass + "'");
  this.classByState_ = goog.object.create(goog.ui.Component.State.DISABLED, goog.getCssName(baseClass, "disabled"), goog.ui.Component.State.HOVER, goog.getCssName(baseClass, "hover"), goog.ui.Component.State.ACTIVE, goog.getCssName(baseClass, "active"), goog.ui.Component.State.SELECTED, goog.getCssName(baseClass, "selected"), goog.ui.Component.State.CHECKED, goog.getCssName(baseClass, "checked"), goog.ui.Component.State.FOCUSED, goog.getCssName(baseClass, "focused"), goog.ui.Component.State.OPENED, 
  goog.getCssName(baseClass, "open"));
};
goog.ui.ControlRenderer.prototype.createStateByClassMap_ = function() {
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }
  this.stateByClass_ = goog.object.transpose(this.classByState_);
};
goog.provide("goog.ui.registry");
goog.require("goog.asserts");
goog.require("goog.dom.classlist");
goog.ui.registry.getDefaultRenderer = function(componentCtor) {
  var key;
  var rendererCtor;
  while (componentCtor) {
    key = goog.getUid(componentCtor);
    if (rendererCtor = goog.ui.registry.defaultRenderers_[key]) {
      break;
    }
    componentCtor = componentCtor.superClass_ ? componentCtor.superClass_.constructor : null;
  }
  if (rendererCtor) {
    return goog.isFunction(rendererCtor.getInstance) ? rendererCtor.getInstance() : new rendererCtor;
  }
  return null;
};
goog.ui.registry.setDefaultRenderer = function(componentCtor, rendererCtor) {
  if (!goog.isFunction(componentCtor)) {
    throw Error("Invalid component class " + componentCtor);
  }
  if (!goog.isFunction(rendererCtor)) {
    throw Error("Invalid renderer class " + rendererCtor);
  }
  var key = goog.getUid(componentCtor);
  goog.ui.registry.defaultRenderers_[key] = rendererCtor;
};
goog.ui.registry.getDecoratorByClassName = function(className) {
  return className in goog.ui.registry.decoratorFunctions_ ? goog.ui.registry.decoratorFunctions_[className]() : null;
};
goog.ui.registry.setDecoratorByClassName = function(className, decoratorFn) {
  if (!className) {
    throw Error("Invalid class name " + className);
  }
  if (!goog.isFunction(decoratorFn)) {
    throw Error("Invalid decorator function " + decoratorFn);
  }
  goog.ui.registry.decoratorFunctions_[className] = decoratorFn;
};
goog.ui.registry.getDecorator = function(element) {
  var decorator;
  goog.asserts.assert(element);
  var classNames = goog.dom.classlist.get(element);
  for (var i = 0, len = classNames.length;i < len;i++) {
    if (decorator = goog.ui.registry.getDecoratorByClassName(classNames[i])) {
      return decorator;
    }
  }
  return null;
};
goog.ui.registry.reset = function() {
  goog.ui.registry.defaultRenderers_ = {};
  goog.ui.registry.decoratorFunctions_ = {};
};
goog.ui.registry.defaultRenderers_ = {};
goog.ui.registry.decoratorFunctions_ = {};
goog.provide("goog.ui.decorate");
goog.require("goog.ui.registry");
goog.ui.decorate = function(element) {
  var decorator = goog.ui.registry.getDecorator(element);
  if (decorator) {
    decorator.decorate(element);
  }
  return decorator;
};
goog.provide("goog.ui.ControlContent");
goog.ui.ControlContent;
goog.provide("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.events.KeyCodes = {WIN_KEY_FF_LINUX:0, MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, FF_SEMICOLON:59, FF_EQUALS:61, FF_DASH:173, QUESTION_MARK:63, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, 
L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, META:91, WIN_KEY_RIGHT:92, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SCROLL_LOCK:145, FIRST_MEDIA_KEY:166, 
LAST_MEDIA_KEY:183, SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, TILDE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, MAC_WK_CMD_LEFT:91, MAC_WK_CMD_RIGHT:93, WIN_IME:229, VK_NONAME:252, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(e) {
  if (e.altKey && !e.ctrlKey || e.metaKey || e.keyCode >= goog.events.KeyCodes.F1 && e.keyCode <= goog.events.KeyCodes.F12) {
    return false;
  }
  switch(e.keyCode) {
    case goog.events.KeyCodes.ALT:
    ;
    case goog.events.KeyCodes.CAPS_LOCK:
    ;
    case goog.events.KeyCodes.CONTEXT_MENU:
    ;
    case goog.events.KeyCodes.CTRL:
    ;
    case goog.events.KeyCodes.DOWN:
    ;
    case goog.events.KeyCodes.END:
    ;
    case goog.events.KeyCodes.ESC:
    ;
    case goog.events.KeyCodes.HOME:
    ;
    case goog.events.KeyCodes.INSERT:
    ;
    case goog.events.KeyCodes.LEFT:
    ;
    case goog.events.KeyCodes.MAC_FF_META:
    ;
    case goog.events.KeyCodes.META:
    ;
    case goog.events.KeyCodes.NUMLOCK:
    ;
    case goog.events.KeyCodes.NUM_CENTER:
    ;
    case goog.events.KeyCodes.PAGE_DOWN:
    ;
    case goog.events.KeyCodes.PAGE_UP:
    ;
    case goog.events.KeyCodes.PAUSE:
    ;
    case goog.events.KeyCodes.PHANTOM:
    ;
    case goog.events.KeyCodes.PRINT_SCREEN:
    ;
    case goog.events.KeyCodes.RIGHT:
    ;
    case goog.events.KeyCodes.SCROLL_LOCK:
    ;
    case goog.events.KeyCodes.SHIFT:
    ;
    case goog.events.KeyCodes.UP:
    ;
    case goog.events.KeyCodes.VK_NONAME:
    ;
    case goog.events.KeyCodes.WIN_KEY:
    ;
    case goog.events.KeyCodes.WIN_KEY_RIGHT:
      return false;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return!goog.userAgent.GECKO;
    default:
      return e.keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || e.keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY;
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(keyCode, opt_heldKeyCode, opt_shiftKey, opt_ctrlKey, opt_altKey) {
  if (!goog.userAgent.IE && !(goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525"))) {
    return true;
  }
  if (goog.userAgent.MAC && opt_altKey) {
    return goog.events.KeyCodes.isCharacterKey(keyCode);
  }
  if (opt_altKey && !opt_ctrlKey) {
    return false;
  }
  if (goog.isNumber(opt_heldKeyCode)) {
    opt_heldKeyCode = goog.events.KeyCodes.normalizeKeyCode(opt_heldKeyCode);
  }
  if (!opt_shiftKey && (opt_heldKeyCode == goog.events.KeyCodes.CTRL || opt_heldKeyCode == goog.events.KeyCodes.ALT || goog.userAgent.MAC && opt_heldKeyCode == goog.events.KeyCodes.META)) {
    return false;
  }
  if (goog.userAgent.WEBKIT && opt_ctrlKey && opt_shiftKey) {
    switch(keyCode) {
      case goog.events.KeyCodes.BACKSLASH:
      ;
      case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
      ;
      case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      ;
      case goog.events.KeyCodes.TILDE:
      ;
      case goog.events.KeyCodes.SEMICOLON:
      ;
      case goog.events.KeyCodes.DASH:
      ;
      case goog.events.KeyCodes.EQUALS:
      ;
      case goog.events.KeyCodes.COMMA:
      ;
      case goog.events.KeyCodes.PERIOD:
      ;
      case goog.events.KeyCodes.SLASH:
      ;
      case goog.events.KeyCodes.APOSTROPHE:
      ;
      case goog.events.KeyCodes.SINGLE_QUOTE:
        return false;
    }
  }
  if (goog.userAgent.IE && opt_ctrlKey && opt_heldKeyCode == keyCode) {
    return false;
  }
  switch(keyCode) {
    case goog.events.KeyCodes.ENTER:
      return true;
    case goog.events.KeyCodes.ESC:
      return!goog.userAgent.WEBKIT;
  }
  return goog.events.KeyCodes.isCharacterKey(keyCode);
};
goog.events.KeyCodes.isCharacterKey = function(keyCode) {
  if (keyCode >= goog.events.KeyCodes.ZERO && keyCode <= goog.events.KeyCodes.NINE) {
    return true;
  }
  if (keyCode >= goog.events.KeyCodes.NUM_ZERO && keyCode <= goog.events.KeyCodes.NUM_MULTIPLY) {
    return true;
  }
  if (keyCode >= goog.events.KeyCodes.A && keyCode <= goog.events.KeyCodes.Z) {
    return true;
  }
  if (goog.userAgent.WEBKIT && keyCode == 0) {
    return true;
  }
  switch(keyCode) {
    case goog.events.KeyCodes.SPACE:
    ;
    case goog.events.KeyCodes.QUESTION_MARK:
    ;
    case goog.events.KeyCodes.NUM_PLUS:
    ;
    case goog.events.KeyCodes.NUM_MINUS:
    ;
    case goog.events.KeyCodes.NUM_PERIOD:
    ;
    case goog.events.KeyCodes.NUM_DIVISION:
    ;
    case goog.events.KeyCodes.SEMICOLON:
    ;
    case goog.events.KeyCodes.FF_SEMICOLON:
    ;
    case goog.events.KeyCodes.DASH:
    ;
    case goog.events.KeyCodes.EQUALS:
    ;
    case goog.events.KeyCodes.FF_EQUALS:
    ;
    case goog.events.KeyCodes.COMMA:
    ;
    case goog.events.KeyCodes.PERIOD:
    ;
    case goog.events.KeyCodes.SLASH:
    ;
    case goog.events.KeyCodes.APOSTROPHE:
    ;
    case goog.events.KeyCodes.SINGLE_QUOTE:
    ;
    case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
    ;
    case goog.events.KeyCodes.BACKSLASH:
    ;
    case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      return true;
    default:
      return false;
  }
};
goog.events.KeyCodes.normalizeKeyCode = function(keyCode) {
  if (goog.userAgent.GECKO) {
    return goog.events.KeyCodes.normalizeGeckoKeyCode(keyCode);
  } else {
    if (goog.userAgent.MAC && goog.userAgent.WEBKIT) {
      return goog.events.KeyCodes.normalizeMacWebKitKeyCode(keyCode);
    } else {
      return keyCode;
    }
  }
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(keyCode) {
  switch(keyCode) {
    case goog.events.KeyCodes.FF_EQUALS:
      return goog.events.KeyCodes.EQUALS;
    case goog.events.KeyCodes.FF_SEMICOLON:
      return goog.events.KeyCodes.SEMICOLON;
    case goog.events.KeyCodes.FF_DASH:
      return goog.events.KeyCodes.DASH;
    case goog.events.KeyCodes.MAC_FF_META:
      return goog.events.KeyCodes.META;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return goog.events.KeyCodes.WIN_KEY;
    default:
      return keyCode;
  }
};
goog.events.KeyCodes.normalizeMacWebKitKeyCode = function(keyCode) {
  switch(keyCode) {
    case goog.events.KeyCodes.MAC_WK_CMD_RIGHT:
      return goog.events.KeyCodes.META;
    default:
      return keyCode;
  }
};
goog.provide("goog.events.KeyEvent");
goog.provide("goog.events.KeyHandler");
goog.provide("goog.events.KeyHandler.EventType");
goog.require("goog.events");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.events.KeyHandler = function(opt_element, opt_capture) {
  goog.events.EventTarget.call(this);
  if (opt_element) {
    this.attach(opt_element, opt_capture);
  }
};
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);
goog.events.KeyHandler.prototype.element_ = null;
goog.events.KeyHandler.prototype.keyPressKey_ = null;
goog.events.KeyHandler.prototype.keyDownKey_ = null;
goog.events.KeyHandler.prototype.keyUpKey_ = null;
goog.events.KeyHandler.prototype.lastKey_ = -1;
goog.events.KeyHandler.prototype.keyCode_ = -1;
goog.events.KeyHandler.prototype.altKey_ = false;
goog.events.KeyHandler.EventType = {KEY:"key"};
goog.events.KeyHandler.safariKey_ = {3:goog.events.KeyCodes.ENTER, 12:goog.events.KeyCodes.NUMLOCK, 63232:goog.events.KeyCodes.UP, 63233:goog.events.KeyCodes.DOWN, 63234:goog.events.KeyCodes.LEFT, 63235:goog.events.KeyCodes.RIGHT, 63236:goog.events.KeyCodes.F1, 63237:goog.events.KeyCodes.F2, 63238:goog.events.KeyCodes.F3, 63239:goog.events.KeyCodes.F4, 63240:goog.events.KeyCodes.F5, 63241:goog.events.KeyCodes.F6, 63242:goog.events.KeyCodes.F7, 63243:goog.events.KeyCodes.F8, 63244:goog.events.KeyCodes.F9, 
63245:goog.events.KeyCodes.F10, 63246:goog.events.KeyCodes.F11, 63247:goog.events.KeyCodes.F12, 63248:goog.events.KeyCodes.PRINT_SCREEN, 63272:goog.events.KeyCodes.DELETE, 63273:goog.events.KeyCodes.HOME, 63275:goog.events.KeyCodes.END, 63276:goog.events.KeyCodes.PAGE_UP, 63277:goog.events.KeyCodes.PAGE_DOWN, 63289:goog.events.KeyCodes.NUMLOCK, 63302:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.keyIdentifier_ = {"Up":goog.events.KeyCodes.UP, "Down":goog.events.KeyCodes.DOWN, "Left":goog.events.KeyCodes.LEFT, "Right":goog.events.KeyCodes.RIGHT, "Enter":goog.events.KeyCodes.ENTER, "F1":goog.events.KeyCodes.F1, "F2":goog.events.KeyCodes.F2, "F3":goog.events.KeyCodes.F3, "F4":goog.events.KeyCodes.F4, "F5":goog.events.KeyCodes.F5, "F6":goog.events.KeyCodes.F6, "F7":goog.events.KeyCodes.F7, "F8":goog.events.KeyCodes.F8, "F9":goog.events.KeyCodes.F9, "F10":goog.events.KeyCodes.F10, 
"F11":goog.events.KeyCodes.F11, "F12":goog.events.KeyCodes.F12, "U+007F":goog.events.KeyCodes.DELETE, "Home":goog.events.KeyCodes.HOME, "End":goog.events.KeyCodes.END, "PageUp":goog.events.KeyCodes.PAGE_UP, "PageDown":goog.events.KeyCodes.PAGE_DOWN, "Insert":goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525");
goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = goog.userAgent.MAC && goog.userAgent.GECKO;
goog.events.KeyHandler.prototype.handleKeyDown_ = function(e) {
  if (goog.userAgent.WEBKIT) {
    if (this.lastKey_ == goog.events.KeyCodes.CTRL && !e.ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !e.altKey || goog.userAgent.MAC && this.lastKey_ == goog.events.KeyCodes.META && !e.metaKey) {
      this.lastKey_ = -1;
      this.keyCode_ = -1;
    }
  }
  if (this.lastKey_ == -1) {
    if (e.ctrlKey && e.keyCode != goog.events.KeyCodes.CTRL) {
      this.lastKey_ = goog.events.KeyCodes.CTRL;
    } else {
      if (e.altKey && e.keyCode != goog.events.KeyCodes.ALT) {
        this.lastKey_ = goog.events.KeyCodes.ALT;
      } else {
        if (e.metaKey && e.keyCode != goog.events.KeyCodes.META) {
          this.lastKey_ = goog.events.KeyCodes.META;
        }
      }
    }
  }
  if (goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(e.keyCode, this.lastKey_, e.shiftKey, e.ctrlKey, e.altKey)) {
    this.handleEvent(e);
  } else {
    this.keyCode_ = goog.events.KeyCodes.normalizeKeyCode(e.keyCode);
    if (goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
      this.altKey_ = e.altKey;
    }
  }
};
goog.events.KeyHandler.prototype.resetState = function() {
  this.lastKey_ = -1;
  this.keyCode_ = -1;
};
goog.events.KeyHandler.prototype.handleKeyup_ = function(e) {
  this.resetState();
  this.altKey_ = e.altKey;
};
goog.events.KeyHandler.prototype.handleEvent = function(e) {
  var be = e.getBrowserEvent();
  var keyCode, charCode;
  var altKey = be.altKey;
  if (goog.userAgent.IE && e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = keyCode != goog.events.KeyCodes.ENTER && keyCode != goog.events.KeyCodes.ESC ? be.keyCode : 0;
  } else {
    if (goog.userAgent.WEBKIT && e.type == goog.events.EventType.KEYPRESS) {
      keyCode = this.keyCode_;
      charCode = be.charCode >= 0 && be.charCode < 63232 && goog.events.KeyCodes.isCharacterKey(keyCode) ? be.charCode : 0;
    } else {
      if (goog.userAgent.OPERA) {
        keyCode = this.keyCode_;
        charCode = goog.events.KeyCodes.isCharacterKey(keyCode) ? be.keyCode : 0;
      } else {
        keyCode = be.keyCode || this.keyCode_;
        charCode = be.charCode || 0;
        if (goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
          altKey = this.altKey_;
        }
        if (goog.userAgent.MAC && charCode == goog.events.KeyCodes.QUESTION_MARK && keyCode == goog.events.KeyCodes.WIN_KEY) {
          keyCode = goog.events.KeyCodes.SLASH;
        }
      }
    }
  }
  keyCode = goog.events.KeyCodes.normalizeKeyCode(keyCode);
  var key = keyCode;
  var keyIdentifier = be.keyIdentifier;
  if (keyCode) {
    if (keyCode >= 63232 && keyCode in goog.events.KeyHandler.safariKey_) {
      key = goog.events.KeyHandler.safariKey_[keyCode];
    } else {
      if (keyCode == 25 && e.shiftKey) {
        key = 9;
      }
    }
  } else {
    if (keyIdentifier && keyIdentifier in goog.events.KeyHandler.keyIdentifier_) {
      key = goog.events.KeyHandler.keyIdentifier_[keyIdentifier];
    }
  }
  var repeat = key == this.lastKey_;
  this.lastKey_ = key;
  var event = new goog.events.KeyEvent(key, charCode, repeat, be);
  event.altKey = altKey;
  this.dispatchEvent(event);
};
goog.events.KeyHandler.prototype.getElement = function() {
  return this.element_;
};
goog.events.KeyHandler.prototype.attach = function(element, opt_capture) {
  if (this.keyUpKey_) {
    this.detach();
  }
  this.element_ = element;
  this.keyPressKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYPRESS, this, opt_capture);
  this.keyDownKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, opt_capture, this);
  this.keyUpKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYUP, this.handleKeyup_, opt_capture, this);
};
goog.events.KeyHandler.prototype.detach = function() {
  if (this.keyPressKey_) {
    goog.events.unlistenByKey(this.keyPressKey_);
    goog.events.unlistenByKey(this.keyDownKey_);
    goog.events.unlistenByKey(this.keyUpKey_);
    this.keyPressKey_ = null;
    this.keyDownKey_ = null;
    this.keyUpKey_ = null;
  }
  this.element_ = null;
  this.lastKey_ = -1;
  this.keyCode_ = -1;
};
goog.events.KeyHandler.prototype.disposeInternal = function() {
  goog.events.KeyHandler.superClass_.disposeInternal.call(this);
  this.detach();
};
goog.events.KeyEvent = function(keyCode, charCode, repeat, browserEvent) {
  goog.events.BrowserEvent.call(this, browserEvent);
  this.type = goog.events.KeyHandler.EventType.KEY;
  this.keyCode = keyCode;
  this.charCode = charCode;
  this.repeat = repeat;
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
goog.provide("goog.ui.Control");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.events.KeyHandler");
goog.require("goog.string");
goog.require("goog.ui.Component");
goog.require("goog.ui.ControlContent");
goog.require("goog.ui.ControlRenderer");
goog.require("goog.ui.decorate");
goog.require("goog.ui.registry");
goog.require("goog.userAgent");
goog.ui.Control = function(opt_content, opt_renderer, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.renderer_ = opt_renderer || goog.ui.registry.getDefaultRenderer(this.constructor);
  this.setContentInternal(goog.isDef(opt_content) ? opt_content : null);
  this.ariaLabel_ = null;
};
goog.inherits(goog.ui.Control, goog.ui.Component);
goog.tagUnsealableClass(goog.ui.Control);
goog.ui.Control.registerDecorator = goog.ui.registry.setDecoratorByClassName;
goog.ui.Control.getDecorator = (goog.ui.registry.getDecorator);
goog.ui.Control.decorate = (goog.ui.decorate);
goog.ui.Control.prototype.renderer_;
goog.ui.Control.prototype.content_ = null;
goog.ui.Control.prototype.state_ = 0;
goog.ui.Control.prototype.supportedStates_ = goog.ui.Component.State.DISABLED | goog.ui.Component.State.HOVER | goog.ui.Component.State.ACTIVE | goog.ui.Component.State.FOCUSED;
goog.ui.Control.prototype.autoStates_ = goog.ui.Component.State.ALL;
goog.ui.Control.prototype.statesWithTransitionEvents_ = 0;
goog.ui.Control.prototype.visible_ = true;
goog.ui.Control.prototype.keyHandler_;
goog.ui.Control.prototype.extraClassNames_ = null;
goog.ui.Control.prototype.handleMouseEvents_ = true;
goog.ui.Control.prototype.allowTextSelection_ = false;
goog.ui.Control.prototype.preferredAriaRole_ = null;
goog.ui.Control.prototype.isHandleMouseEvents = function() {
  return this.handleMouseEvents_;
};
goog.ui.Control.prototype.setHandleMouseEvents = function(enable) {
  if (this.isInDocument() && enable != this.handleMouseEvents_) {
    this.enableMouseEventHandling_(enable);
  }
  this.handleMouseEvents_ = enable;
};
goog.ui.Control.prototype.getKeyEventTarget = function() {
  return this.renderer_.getKeyEventTarget(this);
};
goog.ui.Control.prototype.getKeyHandler = function() {
  return this.keyHandler_ || (this.keyHandler_ = new goog.events.KeyHandler);
};
goog.ui.Control.prototype.getRenderer = function() {
  return this.renderer_;
};
goog.ui.Control.prototype.setRenderer = function(renderer) {
  if (this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (this.getElement()) {
    this.setElementInternal(null);
  }
  this.renderer_ = renderer;
};
goog.ui.Control.prototype.getExtraClassNames = function() {
  return this.extraClassNames_;
};
goog.ui.Control.prototype.addClassName = function(className) {
  if (className) {
    if (this.extraClassNames_) {
      if (!goog.array.contains(this.extraClassNames_, className)) {
        this.extraClassNames_.push(className);
      }
    } else {
      this.extraClassNames_ = [className];
    }
    this.renderer_.enableExtraClassName(this, className, true);
  }
};
goog.ui.Control.prototype.removeClassName = function(className) {
  if (className && this.extraClassNames_ && goog.array.remove(this.extraClassNames_, className)) {
    if (this.extraClassNames_.length == 0) {
      this.extraClassNames_ = null;
    }
    this.renderer_.enableExtraClassName(this, className, false);
  }
};
goog.ui.Control.prototype.enableClassName = function(className, enable) {
  if (enable) {
    this.addClassName(className);
  } else {
    this.removeClassName(className);
  }
};
goog.ui.Control.prototype.createDom = function() {
  var element = this.renderer_.createDom(this);
  this.setElementInternal(element);
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  if (!this.isAllowTextSelection()) {
    this.renderer_.setAllowTextSelection(element, false);
  }
  if (!this.isVisible()) {
    this.renderer_.setVisible(element, false);
  }
};
goog.ui.Control.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_;
};
goog.ui.Control.prototype.setPreferredAriaRole = function(role) {
  this.preferredAriaRole_ = role;
};
goog.ui.Control.prototype.getAriaLabel = function() {
  return this.ariaLabel_;
};
goog.ui.Control.prototype.setAriaLabel = function(label) {
  this.ariaLabel_ = label;
  var element = this.getElement();
  if (element) {
    this.renderer_.setAriaLabel(element, label);
  }
};
goog.ui.Control.prototype.getContentElement = function() {
  return this.renderer_.getContentElement(this.getElement());
};
goog.ui.Control.prototype.canDecorate = function(element) {
  return this.renderer_.canDecorate(element);
};
goog.ui.Control.prototype.decorateInternal = function(element) {
  element = this.renderer_.decorate(this, element);
  this.setElementInternal(element);
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  if (!this.isAllowTextSelection()) {
    this.renderer_.setAllowTextSelection(element, false);
  }
  this.visible_ = element.style.display != "none";
};
goog.ui.Control.prototype.enterDocument = function() {
  goog.ui.Control.superClass_.enterDocument.call(this);
  this.renderer_.setAriaStates(this, this.getElementStrict());
  this.renderer_.initializeDom(this);
  if (this.supportedStates_ & ~goog.ui.Component.State.DISABLED) {
    if (this.isHandleMouseEvents()) {
      this.enableMouseEventHandling_(true);
    }
    if (this.isSupportedState(goog.ui.Component.State.FOCUSED)) {
      var keyTarget = this.getKeyEventTarget();
      if (keyTarget) {
        var keyHandler = this.getKeyHandler();
        keyHandler.attach(keyTarget);
        this.getHandler().listen(keyHandler, goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent).listen(keyTarget, goog.events.EventType.FOCUS, this.handleFocus).listen(keyTarget, goog.events.EventType.BLUR, this.handleBlur);
      }
    }
  }
};
goog.ui.Control.prototype.enableMouseEventHandling_ = function(enable) {
  var handler = this.getHandler();
  var element = this.getElement();
  if (enable) {
    handler.listen(element, goog.events.EventType.MOUSEOVER, this.handleMouseOver).listen(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).listen(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).listen(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if (this.handleContextMenu != goog.nullFunction) {
      handler.listen(element, goog.events.EventType.CONTEXTMENU, this.handleContextMenu);
    }
    if (goog.userAgent.IE) {
      handler.listen(element, goog.events.EventType.DBLCLICK, this.handleDblClick);
    }
  } else {
    handler.unlisten(element, goog.events.EventType.MOUSEOVER, this.handleMouseOver).unlisten(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).unlisten(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).unlisten(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if (this.handleContextMenu != goog.nullFunction) {
      handler.unlisten(element, goog.events.EventType.CONTEXTMENU, this.handleContextMenu);
    }
    if (goog.userAgent.IE) {
      handler.unlisten(element, goog.events.EventType.DBLCLICK, this.handleDblClick);
    }
  }
};
goog.ui.Control.prototype.exitDocument = function() {
  goog.ui.Control.superClass_.exitDocument.call(this);
  if (this.keyHandler_) {
    this.keyHandler_.detach();
  }
  if (this.isVisible() && this.isEnabled()) {
    this.renderer_.setFocusable(this, false);
  }
};
goog.ui.Control.prototype.disposeInternal = function() {
  goog.ui.Control.superClass_.disposeInternal.call(this);
  if (this.keyHandler_) {
    this.keyHandler_.dispose();
    delete this.keyHandler_;
  }
  delete this.renderer_;
  this.content_ = null;
  this.extraClassNames_ = null;
};
goog.ui.Control.prototype.getContent = function() {
  return this.content_;
};
goog.ui.Control.prototype.setContent = function(content) {
  this.renderer_.setContent(this.getElement(), content);
  this.setContentInternal(content);
};
goog.ui.Control.prototype.setContentInternal = function(content) {
  this.content_ = content;
};
goog.ui.Control.prototype.getCaption = function() {
  var content = this.getContent();
  if (!content) {
    return "";
  }
  var caption = goog.isString(content) ? content : goog.isArray(content) ? goog.array.map(content, goog.dom.getRawTextContent).join("") : goog.dom.getTextContent((content));
  return goog.string.collapseBreakingSpaces(caption);
};
goog.ui.Control.prototype.setCaption = function(caption) {
  this.setContent(caption);
};
goog.ui.Control.prototype.setRightToLeft = function(rightToLeft) {
  goog.ui.Control.superClass_.setRightToLeft.call(this, rightToLeft);
  var element = this.getElement();
  if (element) {
    this.renderer_.setRightToLeft(element, rightToLeft);
  }
};
goog.ui.Control.prototype.isAllowTextSelection = function() {
  return this.allowTextSelection_;
};
goog.ui.Control.prototype.setAllowTextSelection = function(allow) {
  this.allowTextSelection_ = allow;
  var element = this.getElement();
  if (element) {
    this.renderer_.setAllowTextSelection(element, allow);
  }
};
goog.ui.Control.prototype.isVisible = function() {
  return this.visible_;
};
goog.ui.Control.prototype.setVisible = function(visible, opt_force) {
  if (opt_force || this.visible_ != visible && this.dispatchEvent(visible ? goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE)) {
    var element = this.getElement();
    if (element) {
      this.renderer_.setVisible(element, visible);
    }
    if (this.isEnabled()) {
      this.renderer_.setFocusable(this, visible);
    }
    this.visible_ = visible;
    return true;
  }
  return false;
};
goog.ui.Control.prototype.isEnabled = function() {
  return!this.hasState(goog.ui.Component.State.DISABLED);
};
goog.ui.Control.prototype.isParentDisabled_ = function() {
  var parent = this.getParent();
  return!!parent && typeof parent.isEnabled == "function" && !parent.isEnabled();
};
goog.ui.Control.prototype.setEnabled = function(enable) {
  if (!this.isParentDisabled_() && this.isTransitionAllowed(goog.ui.Component.State.DISABLED, !enable)) {
    if (!enable) {
      this.setActive(false);
      this.setHighlighted(false);
    }
    if (this.isVisible()) {
      this.renderer_.setFocusable(this, enable);
    }
    this.setState(goog.ui.Component.State.DISABLED, !enable, true);
  }
};
goog.ui.Control.prototype.isHighlighted = function() {
  return this.hasState(goog.ui.Component.State.HOVER);
};
goog.ui.Control.prototype.setHighlighted = function(highlight) {
  if (this.isTransitionAllowed(goog.ui.Component.State.HOVER, highlight)) {
    this.setState(goog.ui.Component.State.HOVER, highlight);
  }
};
goog.ui.Control.prototype.isActive = function() {
  return this.hasState(goog.ui.Component.State.ACTIVE);
};
goog.ui.Control.prototype.setActive = function(active) {
  if (this.isTransitionAllowed(goog.ui.Component.State.ACTIVE, active)) {
    this.setState(goog.ui.Component.State.ACTIVE, active);
  }
};
goog.ui.Control.prototype.isSelected = function() {
  return this.hasState(goog.ui.Component.State.SELECTED);
};
goog.ui.Control.prototype.setSelected = function(select) {
  if (this.isTransitionAllowed(goog.ui.Component.State.SELECTED, select)) {
    this.setState(goog.ui.Component.State.SELECTED, select);
  }
};
goog.ui.Control.prototype.isChecked = function() {
  return this.hasState(goog.ui.Component.State.CHECKED);
};
goog.ui.Control.prototype.setChecked = function(check) {
  if (this.isTransitionAllowed(goog.ui.Component.State.CHECKED, check)) {
    this.setState(goog.ui.Component.State.CHECKED, check);
  }
};
goog.ui.Control.prototype.isFocused = function() {
  return this.hasState(goog.ui.Component.State.FOCUSED);
};
goog.ui.Control.prototype.setFocused = function(focused) {
  if (this.isTransitionAllowed(goog.ui.Component.State.FOCUSED, focused)) {
    this.setState(goog.ui.Component.State.FOCUSED, focused);
  }
};
goog.ui.Control.prototype.isOpen = function() {
  return this.hasState(goog.ui.Component.State.OPENED);
};
goog.ui.Control.prototype.setOpen = function(open) {
  if (this.isTransitionAllowed(goog.ui.Component.State.OPENED, open)) {
    this.setState(goog.ui.Component.State.OPENED, open);
  }
};
goog.ui.Control.prototype.getState = function() {
  return this.state_;
};
goog.ui.Control.prototype.hasState = function(state) {
  return!!(this.state_ & state);
};
goog.ui.Control.prototype.setState = function(state, enable, opt_calledFrom) {
  if (!opt_calledFrom && state == goog.ui.Component.State.DISABLED) {
    this.setEnabled(!enable);
    return;
  }
  if (this.isSupportedState(state) && enable != this.hasState(state)) {
    this.renderer_.setState(this, state, enable);
    this.state_ = enable ? this.state_ | state : this.state_ & ~state;
  }
};
goog.ui.Control.prototype.setStateInternal = function(state) {
  this.state_ = state;
};
goog.ui.Control.prototype.isSupportedState = function(state) {
  return!!(this.supportedStates_ & state);
};
goog.ui.Control.prototype.setSupportedState = function(state, support) {
  if (this.isInDocument() && this.hasState(state) && !support) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (!support && this.hasState(state)) {
    this.setState(state, false);
  }
  this.supportedStates_ = support ? this.supportedStates_ | state : this.supportedStates_ & ~state;
};
goog.ui.Control.prototype.isAutoState = function(state) {
  return!!(this.autoStates_ & state) && this.isSupportedState(state);
};
goog.ui.Control.prototype.setAutoStates = function(states, enable) {
  this.autoStates_ = enable ? this.autoStates_ | states : this.autoStates_ & ~states;
};
goog.ui.Control.prototype.isDispatchTransitionEvents = function(state) {
  return!!(this.statesWithTransitionEvents_ & state) && this.isSupportedState(state);
};
goog.ui.Control.prototype.setDispatchTransitionEvents = function(states, enable) {
  this.statesWithTransitionEvents_ = enable ? this.statesWithTransitionEvents_ | states : this.statesWithTransitionEvents_ & ~states;
};
goog.ui.Control.prototype.isTransitionAllowed = function(state, enable) {
  return this.isSupportedState(state) && this.hasState(state) != enable && (!(this.statesWithTransitionEvents_ & state) || this.dispatchEvent(goog.ui.Component.getStateTransitionEvent(state, enable))) && !this.isDisposed();
};
goog.ui.Control.prototype.handleMouseOver = function(e) {
  if (!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.ENTER) && this.isEnabled() && this.isAutoState(goog.ui.Component.State.HOVER)) {
    this.setHighlighted(true);
  }
};
goog.ui.Control.prototype.handleMouseOut = function(e) {
  if (!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.LEAVE)) {
    if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false);
    }
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(false);
    }
  }
};
goog.ui.Control.prototype.handleContextMenu = goog.nullFunction;
goog.ui.Control.isMouseEventWithinElement_ = function(e, elem) {
  return!!e.relatedTarget && goog.dom.contains(elem, e.relatedTarget);
};
goog.ui.Control.prototype.handleMouseDown = function(e) {
  if (this.isEnabled()) {
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }
    if (e.isMouseActionButton()) {
      if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
        this.setActive(true);
      }
      if (this.renderer_.isFocusable(this)) {
        this.getKeyEventTarget().focus();
      }
    }
  }
  if (!this.isAllowTextSelection() && e.isMouseActionButton()) {
    e.preventDefault();
  }
};
goog.ui.Control.prototype.handleMouseUp = function(e) {
  if (this.isEnabled()) {
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }
    if (this.isActive() && this.performActionInternal(e) && this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false);
    }
  }
};
goog.ui.Control.prototype.handleDblClick = function(e) {
  if (this.isEnabled()) {
    this.performActionInternal(e);
  }
};
goog.ui.Control.prototype.performActionInternal = function(e) {
  if (this.isAutoState(goog.ui.Component.State.CHECKED)) {
    this.setChecked(!this.isChecked());
  }
  if (this.isAutoState(goog.ui.Component.State.SELECTED)) {
    this.setSelected(true);
  }
  if (this.isAutoState(goog.ui.Component.State.OPENED)) {
    this.setOpen(!this.isOpen());
  }
  var actionEvent = new goog.events.Event(goog.ui.Component.EventType.ACTION, this);
  if (e) {
    actionEvent.altKey = e.altKey;
    actionEvent.ctrlKey = e.ctrlKey;
    actionEvent.metaKey = e.metaKey;
    actionEvent.shiftKey = e.shiftKey;
    actionEvent.platformModifierKey = e.platformModifierKey;
  }
  return this.dispatchEvent(actionEvent);
};
goog.ui.Control.prototype.handleFocus = function(e) {
  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(true);
  }
};
goog.ui.Control.prototype.handleBlur = function(e) {
  if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
    this.setActive(false);
  }
  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(false);
  }
};
goog.ui.Control.prototype.handleKeyEvent = function(e) {
  if (this.isVisible() && this.isEnabled() && this.handleKeyEventInternal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  return false;
};
goog.ui.Control.prototype.handleKeyEventInternal = function(e) {
  return e.keyCode == goog.events.KeyCodes.ENTER && this.performActionInternal(e);
};
goog.ui.registry.setDefaultRenderer(goog.ui.Control, goog.ui.ControlRenderer);
goog.ui.registry.setDecoratorByClassName(goog.ui.ControlRenderer.CSS_CLASS, function() {
  return new goog.ui.Control(null);
});
goog.provide("chatango.goog.Overrides");
goog.require("goog.cssom");
goog.require("goog.events.BrowserEvent");
goog.require("goog.ui.Control");
goog.require("goog.userAgent");
chatango.goog.Overrides = function() {
};
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  goog.events.Event.call(this, type);
  var relevantTouch;
  if (type == goog.events.EventType.TOUCHSTART || type == goog.events.EventType.TOUCHMOVE) {
    relevantTouch = e.targetTouches[0];
  } else {
    if (type == goog.events.EventType.TOUCHEND || type == goog.events.EventType.TOUCHCANCEL) {
      relevantTouch = e.changedTouches[0];
    }
  }
  if (!!relevantTouch) {
    this.target = relevantTouch.target;
  } else {
    this.target = (e.target) || e.srcElement;
  }
  this.currentTarget = (opt_currentTarget);
  var relatedTarget = (e.relatedTarget);
  if (relatedTarget) {
    if (goog.userAgent.GECKO) {
      if (!goog.reflect.canAccessProperty(relatedTarget, "nodeName")) {
        relatedTarget = null;
      }
    }
  } else {
    if (type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement;
    } else {
      if (type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement;
      }
    }
  }
  this.relatedTarget = relatedTarget;
  if (!!relevantTouch) {
    this.clientX = relevantTouch.clientX;
    this.clientY = relevantTouch.clientY;
    this.screenX = relevantTouch.screenX;
    this.screenY = relevantTouch.screenY;
  } else {
    this.offsetX = goog.userAgent.WEBKIT || e.offsetX !== undefined ? e.offsetX : e.layerX;
    this.offsetY = goog.userAgent.WEBKIT || e.offsetY !== undefined ? e.offsetY : e.layerY;
    this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
    this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
    this.screenX = e.screenX || 0;
    this.screenY = e.screenY || 0;
  }
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  if (e.defaultPrevented) {
    this.preventDefault();
  }
  delete this.propagationStopped_;
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = false;
  goog.userAgent.detectedIe_ = false;
  goog.userAgent.detectedWebkit_ = false;
  goog.userAgent.detectedMobile_ = false;
  goog.userAgent.detectedGecko_ = false;
  var ua;
  if (!goog.userAgent.BROWSER_KNOWN_ && (ua = goog.userAgent.getUserAgentString())) {
    var navigator = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = ua.indexOf("Opera") == 0;
    var re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && (ua.indexOf("MSIE") != -1 || re.exec(ua) != null);
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && ua.indexOf("WebKit") != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && ua.indexOf("Mobile") != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && navigator.product == "Gecko";
    goog.userAgent.IE = goog.userAgent.detectedIe_;
    if (goog.userAgent.IE) {
      goog.userAgent.GECKO = false;
    }
  }
};
goog.cssom.addCssRule = function(cssStyleSheet, cssText, opt_index) {
  var index = opt_index;
  if (index < 0 || index == undefined) {
    var rules = cssStyleSheet.rules || cssStyleSheet.cssRules;
    index = rules.length;
  }
  if (cssStyleSheet.insertRule && !goog.userAgent.IE) {
    cssStyleSheet.insertRule(cssText, index);
  } else {
    var matches = /^([^\{]+)\{([^\{]+)\}/.exec(cssText);
    if (matches.length == 3) {
      var selector = matches[1];
      var style = matches[2];
      cssStyleSheet.addRule(selector, style, index);
    } else {
      throw Error("Your CSSRule appears to be ill-formatted.");
    }
  }
};
goog.cssom.removeCssRule = function(cssStyleSheet, index) {
  if (cssStyleSheet.deleteRule && !goog.userAgent.IE) {
    cssStyleSheet.deleteRule(index);
  } else {
    cssStyleSheet.removeRule(index);
  }
};
goog.provide("goog.uri.utils");
goog.provide("goog.uri.utils.ComponentIndex");
goog.provide("goog.uri.utils.QueryArray");
goog.provide("goog.uri.utils.QueryValue");
goog.provide("goog.uri.utils.StandardQueryParam");
goog.require("goog.asserts");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = "";
  if (opt_scheme) {
    out += opt_scheme + ":";
  }
  if (opt_domain) {
    out += "//";
    if (opt_userInfo) {
      out += opt_userInfo + "@";
    }
    out += opt_domain;
    if (opt_port) {
      out += ":" + opt_port;
    }
  }
  if (opt_path) {
    out += opt_path;
  }
  if (opt_queryData) {
    out += "?" + opt_queryData;
  }
  if (opt_fragment) {
    out += "#" + opt_fragment;
  }
  return out;
};
goog.uri.utils.splitRe_ = new RegExp("^" + "(?:" + "([^:/?#.]+)" + ":)?" + "(?://" + "(?:([^/?#]*)@)?" + "([^/#?]*?)" + "(?::([0-9]+))?" + "(?=[/#?]|$)" + ")?" + "([^?#]+)?" + "(?:\\?([^#]*))?" + "(?:#(.*))?" + "$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(uri) {
  goog.uri.utils.phishingProtection_();
  return(uri.match(goog.uri.utils.splitRe_));
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
  if (goog.uri.utils.needsPhishingProtection_) {
    goog.uri.utils.needsPhishingProtection_ = false;
    var location = goog.global["location"];
    if (location) {
      var href = location["href"];
      if (href) {
        var domain = goog.uri.utils.getDomain(href);
        if (domain && domain != location["hostname"]) {
          goog.uri.utils.needsPhishingProtection_ = true;
          throw Error();
        }
      }
    }
  }
};
goog.uri.utils.decodeIfPossible_ = function(uri, opt_preserveReserved) {
  if (!uri) {
    return uri;
  }
  return opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri);
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null;
};
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri);
};
goog.uri.utils.getEffectiveScheme = function(uri) {
  var scheme = goog.uri.utils.getScheme(uri);
  if (!scheme && self.location) {
    var protocol = self.location.protocol;
    scheme = protocol.substr(0, protocol.length - 1);
  }
  return scheme ? scheme.toLowerCase() : "";
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri);
};
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri));
};
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri);
};
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri), true);
};
goog.uri.utils.getPort = function(uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null;
};
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri);
};
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri), true);
};
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri);
};
goog.uri.utils.getFragmentEncoded = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1);
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "");
};
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri));
};
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.removeFragment = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex);
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1);
  var pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  if (goog.DEBUG && (uri.indexOf("#") >= 0 || uri.indexOf("?") >= 0)) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not " + "supported: [" + uri + "]");
  }
};
goog.uri.utils.QueryValue;
goog.uri.utils.QueryArray;
goog.uri.utils.parseQueryData = function(encodedQuery, callback) {
  var pairs = encodedQuery.split("&");
  for (var i = 0;i < pairs.length;i++) {
    var indexOfEquals = pairs[i].indexOf("=");
    var name = null;
    var value = null;
    if (indexOfEquals >= 0) {
      name = pairs[i].substring(0, indexOfEquals);
      value = pairs[i].substring(indexOfEquals + 1);
    } else {
      name = pairs[i];
    }
    callback(name, value ? goog.string.urlDecode(value) : "");
  }
};
goog.uri.utils.appendQueryData_ = function(buffer) {
  if (buffer[1]) {
    var baseUri = (buffer[0]);
    var hashIndex = baseUri.indexOf("#");
    if (hashIndex >= 0) {
      buffer.push(baseUri.substr(hashIndex));
      buffer[0] = baseUri = baseUri.substr(0, hashIndex);
    }
    var questionIndex = baseUri.indexOf("?");
    if (questionIndex < 0) {
      buffer[1] = "?";
    } else {
      if (questionIndex == baseUri.length - 1) {
        buffer[1] = undefined;
      }
    }
  }
  return buffer.join("");
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if (goog.isArray(value)) {
    goog.asserts.assertArray(value);
    for (var j = 0;j < value.length;j++) {
      goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs);
    }
  } else {
    if (value != null) {
      pairs.push("&", key, value === "" ? "" : "=", goog.string.urlEncode(value));
    }
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  for (var i = opt_startIndex || 0;i < keysAndValues.length;i += 2) {
    goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for (var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1));
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map));
};
goog.uri.utils.appendParam = function(uri, key, opt_value) {
  var paramArr = [uri, "&", key];
  if (goog.isDefAndNotNull(opt_value)) {
    paramArr.push("=", goog.string.urlEncode(opt_value));
  }
  return goog.uri.utils.appendQueryData_(paramArr);
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
  var index = startIndex;
  var keyLength = keyEncoded.length;
  while ((index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex) {
    var precedingChar = uri.charCodeAt(index - 1);
    if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }
  return-1;
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_)) >= 0;
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
  if (foundIndex < 0) {
    return null;
  } else {
    var endPosition = uri.indexOf("&", foundIndex);
    if (endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex));
  }
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var result = [];
  while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    position = uri.indexOf("&", foundIndex);
    if (position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)));
  }
  return result;
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var buffer = [];
  while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    buffer.push(uri.substring(position, foundIndex));
    position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex);
  }
  buffer.push(uri.substr(position));
  return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1");
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value);
};
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
  if (goog.string.endsWith(baseUri, "/")) {
    baseUri = baseUri.substr(0, baseUri.length - 1);
  }
  if (goog.string.startsWith(path, "/")) {
    path = path.substr(1);
  }
  return goog.string.buildString(baseUri, "/", path);
};
goog.uri.utils.setPath = function(uri, path) {
  if (!goog.string.startsWith(path, "/")) {
    path = "/" + path;
  }
  var parts = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(parts[goog.uri.utils.ComponentIndex.SCHEME], parts[goog.uri.utils.ComponentIndex.USER_INFO], parts[goog.uri.utils.ComponentIndex.DOMAIN], parts[goog.uri.utils.ComponentIndex.PORT], path, parts[goog.uri.utils.ComponentIndex.QUERY_DATA], parts[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
};
goog.provide("goog.Uri");
goog.provide("goog.Uri.QueryData");
goog.require("goog.array");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.require("goog.uri.utils.ComponentIndex");
goog.require("goog.uri.utils.StandardQueryParam");
goog.Uri = function(opt_uri, opt_ignoreCase) {
  var m;
  if (opt_uri instanceof goog.Uri) {
    this.ignoreCase_ = goog.isDef(opt_ignoreCase) ? opt_ignoreCase : opt_uri.getIgnoreCase();
    this.setScheme(opt_uri.getScheme());
    this.setUserInfo(opt_uri.getUserInfo());
    this.setDomain(opt_uri.getDomain());
    this.setPort(opt_uri.getPort());
    this.setPath(opt_uri.getPath());
    this.setQueryData(opt_uri.getQueryData().clone());
    this.setFragment(opt_uri.getFragment());
  } else {
    if (opt_uri && (m = goog.uri.utils.split(String(opt_uri)))) {
      this.ignoreCase_ = !!opt_ignoreCase;
      this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || "", true);
      this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", true);
      this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", true);
      this.setPort(m[goog.uri.utils.ComponentIndex.PORT]);
      this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", true);
      this.setQueryData(m[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", true);
      this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", true);
    } else {
      this.ignoreCase_ = !!opt_ignoreCase;
      this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_);
    }
  }
};
goog.Uri.preserveParameterTypesCompatibilityFlag = false;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.queryData_;
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = false;
goog.Uri.prototype.ignoreCase_ = false;
goog.Uri.prototype.toString = function() {
  var out = [];
  var scheme = this.getScheme();
  if (scheme) {
    out.push(goog.Uri.encodeSpecialChars_(scheme, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), ":");
  }
  var domain = this.getDomain();
  if (domain) {
    out.push("//");
    var userInfo = this.getUserInfo();
    if (userInfo) {
      out.push(goog.Uri.encodeSpecialChars_(userInfo, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), "@");
    }
    out.push(goog.Uri.removeDoubleEncoding_(goog.string.urlEncode(domain)));
    var port = this.getPort();
    if (port != null) {
      out.push(":", String(port));
    }
  }
  var path = this.getPath();
  if (path) {
    if (this.hasDomain() && path.charAt(0) != "/") {
      out.push("/");
    }
    out.push(goog.Uri.encodeSpecialChars_(path, path.charAt(0) == "/" ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_, true));
  }
  var query = this.getEncodedQuery();
  if (query) {
    out.push("?", query);
  }
  var fragment = this.getFragment();
  if (fragment) {
    out.push("#", goog.Uri.encodeSpecialChars_(fragment, goog.Uri.reDisallowedInFragment_));
  }
  return out.join("");
};
goog.Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone();
  var overridden = relativeUri.hasScheme();
  if (overridden) {
    absoluteUri.setScheme(relativeUri.getScheme());
  } else {
    overridden = relativeUri.hasUserInfo();
  }
  if (overridden) {
    absoluteUri.setUserInfo(relativeUri.getUserInfo());
  } else {
    overridden = relativeUri.hasDomain();
  }
  if (overridden) {
    absoluteUri.setDomain(relativeUri.getDomain());
  } else {
    overridden = relativeUri.hasPort();
  }
  var path = relativeUri.getPath();
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
  } else {
    overridden = relativeUri.hasPath();
    if (overridden) {
      if (path.charAt(0) != "/") {
        if (this.hasDomain() && !this.hasPath()) {
          path = "/" + path;
        } else {
          var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          if (lastSlashIndex != -1) {
            path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path;
          }
        }
      }
      path = goog.Uri.removeDotSegments(path);
    }
  }
  if (overridden) {
    absoluteUri.setPath(path);
  } else {
    overridden = relativeUri.hasQuery();
  }
  if (overridden) {
    absoluteUri.setQueryData(relativeUri.getDecodedQuery());
  } else {
    overridden = relativeUri.hasFragment();
  }
  if (overridden) {
    absoluteUri.setFragment(relativeUri.getFragment());
  }
  return absoluteUri;
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this);
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_;
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme, true) : newScheme;
  if (this.scheme_) {
    this.scheme_ = this.scheme_.replace(/:$/, "");
  }
  return this;
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_;
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this;
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_;
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_;
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain, true) : newDomain;
  return this;
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_;
};
goog.Uri.prototype.getPort = function() {
  return this.port_;
};
goog.Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  if (newPort) {
    newPort = Number(newPort);
    if (isNaN(newPort) || newPort < 0) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort;
  } else {
    this.port_ = null;
  }
  return this;
};
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null;
};
goog.Uri.prototype.getPath = function() {
  return this.path_;
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath, true) : newPath;
  return this;
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_;
};
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== "";
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  if (queryData instanceof goog.Uri.QueryData) {
    this.queryData_ = queryData;
    this.queryData_.setIgnoreCase(this.ignoreCase_);
  } else {
    if (!opt_decode) {
      queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_);
    }
    this.queryData_ = new goog.Uri.QueryData(queryData, null, this.ignoreCase_);
  }
  return this;
};
goog.Uri.prototype.setQuery = function(newQuery, opt_decode) {
  return this.setQueryData(newQuery, opt_decode);
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString();
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString();
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_;
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery();
};
goog.Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  this.queryData_.set(key, value);
  return this;
};
goog.Uri.prototype.setParameterValues = function(key, values) {
  this.enforceReadOnly();
  if (!goog.isArray(values)) {
    values = [String(values)];
  }
  this.queryData_.setValues(key, values);
  return this;
};
goog.Uri.prototype.getParameterValues = function(name) {
  return this.queryData_.getValues(name);
};
goog.Uri.prototype.getParameterValue = function(paramName) {
  return(this.queryData_.get(paramName));
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_;
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this;
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_;
};
goog.Uri.prototype.hasSameDomainAs = function(uri2) {
  return(!this.hasDomain() && !uri2.hasDomain() || this.getDomain() == uri2.getDomain()) && (!this.hasPort() && !uri2.hasPort() || this.getPort() == uri2.getPort());
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this;
};
goog.Uri.prototype.removeParameter = function(key) {
  this.enforceReadOnly();
  this.queryData_.remove(key);
  return this;
};
goog.Uri.prototype.setReadOnly = function(isReadOnly) {
  this.isReadOnly_ = isReadOnly;
  return this;
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_;
};
goog.Uri.prototype.enforceReadOnly = function() {
  if (this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  if (this.queryData_) {
    this.queryData_.setIgnoreCase(ignoreCase);
  }
  return this;
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_;
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase);
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new goog.Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri;
};
goog.Uri.resolve = function(base, rel) {
  if (!(base instanceof goog.Uri)) {
    base = goog.Uri.parse(base);
  }
  if (!(rel instanceof goog.Uri)) {
    rel = goog.Uri.parse(rel);
  }
  return base.resolve(rel);
};
goog.Uri.removeDotSegments = function(path) {
  if (path == ".." || path == ".") {
    return "";
  } else {
    if (!goog.string.contains(path, "./") && !goog.string.contains(path, "/.")) {
      return path;
    } else {
      var leadingSlash = goog.string.startsWith(path, "/");
      var segments = path.split("/");
      var out = [];
      for (var pos = 0;pos < segments.length;) {
        var segment = segments[pos++];
        if (segment == ".") {
          if (leadingSlash && pos == segments.length) {
            out.push("");
          }
        } else {
          if (segment == "..") {
            if (out.length > 1 || out.length == 1 && out[0] != "") {
              out.pop();
            }
            if (leadingSlash && pos == segments.length) {
              out.push("");
            }
          } else {
            out.push(segment);
            leadingSlash = true;
          }
        }
      }
      return out.join("/");
    }
  }
};
goog.Uri.decodeOrEmpty_ = function(val, opt_preserveReserved) {
  if (!val) {
    return "";
  }
  return opt_preserveReserved ? decodeURI(val) : decodeURIComponent(val);
};
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra, opt_removeDoubleEncoding) {
  if (goog.isString(unescapedPart)) {
    var encoded = encodeURI(unescapedPart).replace(extra, goog.Uri.encodeChar_);
    if (opt_removeDoubleEncoding) {
      encoded = goog.Uri.removeDoubleEncoding_(encoded);
    }
    return encoded;
  }
  return null;
};
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16);
};
goog.Uri.removeDoubleEncoding_ = function(doubleEncodedString) {
  return doubleEncodedString.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = goog.uri.utils.split(uri1String);
  var pieces2 = goog.uri.utils.split(uri2String);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
  this.encodedQuery_ = opt_query || null;
  this.ignoreCase_ = !!opt_ignoreCase;
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if (!this.keyMap_) {
    this.keyMap_ = new goog.structs.Map;
    this.count_ = 0;
    if (this.encodedQuery_) {
      var self = this;
      goog.uri.utils.parseQueryData(this.encodedQuery_, function(name, value) {
        self.add(goog.string.urlDecode(name), value);
      });
    }
  }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if (typeof keys == "undefined") {
    throw Error("Keys are undefined");
  }
  var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase);
  var values = goog.structs.getValues(map);
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var value = values[i];
    if (!goog.isArray(value)) {
      queryData.add(key, value);
    } else {
      queryData.setValues(key, value);
    }
  }
  return queryData;
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
  if (keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase);
  for (var i = 0;i < keys.length;i++) {
    queryData.add(keys[i], values[i]);
  }
  return queryData;
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_;
};
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  var values = this.keyMap_.get(key);
  if (!values) {
    this.keyMap_.set(key, values = []);
  }
  values.push(value);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  if (this.keyMap_.containsKey(key)) {
    this.invalidateCache_();
    this.count_ -= this.keyMap_.get(key).length;
    return this.keyMap_.remove(key);
  }
  return false;
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0;
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0;
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key);
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return goog.array.contains(vals, value);
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  var vals = (this.keyMap_.getValues());
  var keys = this.keyMap_.getKeys();
  var rv = [];
  for (var i = 0;i < keys.length;i++) {
    var val = vals[i];
    for (var j = 0;j < val.length;j++) {
      rv.push(keys[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv = [];
  if (goog.isString(opt_key)) {
    if (this.containsKey(opt_key)) {
      rv = goog.array.concat(rv, this.keyMap_.get(this.getKeyName_(opt_key)));
    }
  } else {
    var values = this.keyMap_.getValues();
    for (var i = 0;i < values.length;i++) {
      rv = goog.array.concat(rv, values[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if (this.containsKey(key)) {
    this.count_ -= this.keyMap_.get(key).length;
  }
  this.keyMap_.set(key, [value]);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  var values = key ? this.getValues(key) : [];
  if (goog.Uri.preserveParameterTypesCompatibilityFlag) {
    return values.length > 0 ? values[0] : opt_default;
  } else {
    return values.length > 0 ? String(values[0]) : opt_default;
  }
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.remove(key);
  if (values.length > 0) {
    this.invalidateCache_();
    this.keyMap_.set(this.getKeyName_(key), goog.array.clone(values));
    this.count_ += values.length;
  }
};
goog.Uri.QueryData.prototype.toString = function() {
  if (this.encodedQuery_) {
    return this.encodedQuery_;
  }
  if (!this.keyMap_) {
    return "";
  }
  var sb = [];
  var keys = this.keyMap_.getKeys();
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var encodedKey = goog.string.urlEncode(key);
    var val = this.getValues(key);
    for (var j = 0;j < val.length;j++) {
      var param = encodedKey;
      if (val[j] !== "") {
        param += "=" + goog.string.urlEncode(val[j]);
      }
      sb.push(param);
    }
  }
  return this.encodedQuery_ = sb.join("&");
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  return goog.Uri.decodeOrEmpty_(this.toString());
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null;
};
goog.Uri.QueryData.prototype.filterKeys = function(keys) {
  this.ensureKeyMapInitialized_();
  this.keyMap_.forEach(function(value, key) {
    if (!goog.array.contains(keys, key)) {
      this.remove(key);
    }
  }, this);
  return this;
};
goog.Uri.QueryData.prototype.clone = function() {
  var rv = new goog.Uri.QueryData;
  rv.encodedQuery_ = this.encodedQuery_;
  if (this.keyMap_) {
    rv.keyMap_ = this.keyMap_.clone();
    rv.count_ = this.count_;
  }
  return rv;
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  if (this.ignoreCase_) {
    keyName = keyName.toLowerCase();
  }
  return keyName;
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  var resetKeys = ignoreCase && !this.ignoreCase_;
  if (resetKeys) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    this.keyMap_.forEach(function(value, key) {
      var lowerCase = key.toLowerCase();
      if (key != lowerCase) {
        this.remove(key);
        this.setValues(lowerCase, value);
      }
    }, this);
  }
  this.ignoreCase_ = ignoreCase;
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
  for (var i = 0;i < arguments.length;i++) {
    var data = arguments[i];
    goog.structs.forEach(data, function(value, key) {
      this.add(key, value);
    }, this);
  }
};
goog.provide("chatango.settings.Architecture");
goog.require("chatango.utils.userAgent");
goog.require("goog.Uri");
goog.require("goog.userAgent");
chatango.settings.Architecture = function() {
};
goog.addSingletonGetter(chatango.settings.Architecture);
chatango.settings.Architecture.Type = {"FLASH":"flash", "JS_ONLY":"jsonly", "JS":"js", "LINK_ANDROID_CHROME":"linkandroidchrome", "LINK_ANDROID_FF":"linkandroidff", "LINK_DESKTOP_CHROME":"linkdesktopchrome", "BLANK":"blank"};
chatango.settings.Architecture.default_ = chatango.settings.Architecture.Type.FLASH;
chatango.settings.Architecture.JS_REQD = "jsr";
chatango.settings.Architecture.IS_CV = "is_cv";
chatango.settings.Architecture.prototype.config_ = [{"type":chatango.settings.Architecture.Type.BLANK, "rules":[[{"styles":chatango.settings.Architecture.JS_REQD}, {"platform":"IE", "platform":"NOT_IEMOBILE", "lessThan":10}], [{"styles":chatango.settings.Architecture.JS_REQD}, {"platform":"OPERA"}, {"features":["NOWEBSOCKET"]}], [{"styles":chatango.settings.Architecture.JS_REQD}, {"platform":"GECKO"}, {"features":["NOWEBSOCKET"]}], [{"styles":chatango.settings.Architecture.JS_REQD}, {"platform":"ANDROID"}, 
{"features":["NOWEBSOCKET"]}], [{"styles":chatango.settings.Architecture.JS_REQD}, {"features":["NOWEBSOCKET"]}]]}, {"type":chatango.settings.Architecture.Type.JS_ONLY, "rules":[[{"styles":chatango.settings.Architecture.JS_REQD}]]}, {"type":chatango.settings.Architecture.Type.FLASH, "rules":[{"param":"flash"}, [{"param":"js"}, {"platform":"IE", "platform":"NOT_IEMOBILE", "lessThan":10}, {"features":["FLASH"]}]]}, {"type":chatango.settings.Architecture.Type.LINK_ANDROID_CHROME, "rules":[[{"platform":"ANDROID", 
"atLeast":4}, {"features":["NOWEBSOCKET"]}]]}, {"type":chatango.settings.Architecture.Type.LINK_ANDROID_FF, "rules":[{"param":"js", "platform":"ANDROID", "lessThan":4, "features":["NOWEBSOCKET"]}, {"platform":"ANDROID", "lessThan":4, "features":["NOFLASH"], "platform":["NOT_GECKO"]}]}, {"type":chatango.settings.Architecture.Type.LINK_DESKTOP_CHROME, "rules":[[{"param":"js"}, {"platform":"IE", "platform":"NOT_IEMOBILE", "lessThan":10}, {"features":["NOFLASH"]}], [{"param":"js"}, {"platform":"OPERA"}, 
{"features":["NOWEBSOCKET"]}], [{"param":"js"}, {"platform":"GECKO"}, {"features":["NOWEBSOCKET"]}]]}, {"type":chatango.settings.Architecture.Type.JS, "rules":[{"param":"js"}, {"platform":"IOS"}, {"platform":"IEMOBILE"}, [{"platform":"MOBILE"}, {"platform":"CHROME"}], [{"platform":"ANDROID", "features":["WEBSOCKET"]}, {"platform":"CHROME"}], [{"platform":"ANDROID", "features":["WEBSOCKET"]}, {"platform":"GECKO"}]]}];
chatango.settings.Architecture.prototype.logger = goog.debug.Logger.getLogger("chatango.settings.Architecture");
chatango.settings.Architecture.prototype.getArchitecture = function(opt_preferredArch, opt_styles) {
  var typeIndex;
  var type;
  var rules;
  var ruleIndex;
  var rule;
  var i;
  var ruleMatches;
  this.preferredArch_ = opt_preferredArch === chatango.settings.Architecture.Type.JS ? chatango.settings.Architecture.Type.JS : null;
  this.styles_ = opt_styles ? opt_styles : {};
  for (typeIndex = 0;typeIndex < this.config_.length;typeIndex++) {
    type = this.config_[typeIndex].type;
    rules = this.config_[typeIndex].rules;
    for (ruleIndex = 0;ruleIndex < rules.length;ruleIndex++) {
      rule = rules[ruleIndex];
      if (chatango.DEBUG) {
        this.logger.info("Testing rule: " + goog.json.serialize(rule));
      }
      if (typeof rule.length !== "undefined") {
        ruleMatches = true;
        for (i = 0;i < rule.length;i++) {
          if (!this.ruleMatches_(rule[i])) {
            ruleMatches = false;
            break;
          }
        }
        if (ruleMatches) {
          if (chatango.DEBUG) {
            this.logger.info("Rule matches: " + type);
          }
          return type;
        }
      } else {
        if (this.ruleMatches_(rule)) {
          if (chatango.DEBUG) {
            this.logger.info("Rule matches");
          }
          return type;
        }
      }
    }
  }
  if (chatango.DEBUG) {
    this.logger.info("Using default architecture");
  }
  return chatango.settings.Architecture.default_;
};
chatango.settings.Architecture.prototype.getFlashVersion = function() {
  try {
    if (navigator.userAgent.indexOf("MSIE") != -1) {
      var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      return flash.GetVariable("$version");
    } else {
      return navigator.plugins["Shockwave Flash"].description;
    }
  } catch (e) {
    return null;
  }
};
chatango.settings.Architecture.prototype.ruleMatches_ = function(rule) {
  if (chatango.DEBUG) {
    this.logger.info("Checking rule: " + goog.json.serialize(rule));
  }
  var key, i;
  var userAgent = goog.userAgent.getUserAgentString();
  var uri = new goog.Uri(window.location.href);
  if (chatango.DEBUG) {
    this.logger.info("Checking rule platform");
  }
  if (typeof rule["platform"] != "undefined") {
    if (rule["platform"] == "IE") {
      if (!goog.userAgent.IE) {
        return false;
      }
    } else {
      if (rule["platform"] == "IEMOBILE") {
        if (!/(iemobile)/i.test(userAgent)) {
          return false;
        }
      } else {
        if (rule["platform"] == "NOT_IEMOBILE") {
          if (/(iemobile)/i.test(userAgent)) {
            return false;
          }
        } else {
          if (rule["platform"] == "GECKO") {
            if (!goog.userAgent.GECKO) {
              return false;
            }
          } else {
            if (rule["platform"] == "NOT_GECKO") {
              if (goog.userAgent.GECKO) {
                return false;
              }
            } else {
              if (rule["platform"] == "WEBKIT") {
                if (!goog.userAgent.WEBKIT) {
                  return false;
                }
              } else {
                if (rule["platform"] == "CHROME") {
                  if (!userAgent.match(/\bChrome\b/)) {
                    return false;
                  }
                } else {
                  if (rule["platform"] == "LINUX") {
                    if (!goog.userAgent.LINUX) {
                      return false;
                    }
                  } else {
                    if (rule["platform"] == "MAC") {
                      if (!goog.userAgent.MAC) {
                        return false;
                      }
                    } else {
                      if (rule["platform"] == "MOBILE") {
                        if (!goog.userAgent.MOBILE) {
                          return false;
                        }
                      } else {
                        if (rule["platform"] == "OPERA") {
                          if (!goog.userAgent.OPERA) {
                            return false;
                          }
                        } else {
                          if (rule["platform"] == "SAFARI") {
                            if (!goog.userAgent.SAFARI) {
                              return false;
                            }
                          } else {
                            if (rule["platform"] == "WINDOWS") {
                              if (!goog.userAgent.WINDOWS) {
                                return false;
                              }
                            } else {
                              if (rule["platform"] == "X11") {
                                if (!goog.userAgent.X11) {
                                  return false;
                                }
                              } else {
                                if (rule["platform"] == "IOS") {
                                  if (!userAgent || !userAgent.match(/\b(iOS|iPod|iPad|iPhone)\b/)) {
                                    return false;
                                  }
                                } else {
                                  if (rule["platform"] == "ANDROID") {
                                    if (!userAgent || !chatango.utils.userAgent.ANDROID) {
                                      return false;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (chatango.DEBUG) {
    this.logger.info("Checking rule version");
  }
  if (rule["platform"] == "ANDROID") {
    if (typeof rule["lessThan"] != "undefined") {
      if (chatango.utils.userAgent.isAndroidVersion(rule["lessThan"])) {
        return false;
      }
    }
    if (typeof rule["atLeast"] != "undefined") {
      if (!chatango.utils.userAgent.isAndroidVersion(rule["atLeast"])) {
        return false;
      }
    }
  } else {
    if (typeof rule["lessThan"] != "undefined") {
      if (goog.userAgent.isVersion(rule["lessThan"])) {
        return false;
      }
    }
    if (typeof rule["atLeast"] != "undefined") {
      if (!goog.userAgent.isVersion(rule["atLeast"])) {
        return false;
      }
    }
  }
  if (chatango.DEBUG) {
    this.logger.info("Checking rule features");
  }
  if (typeof rule["features"] != "undefined") {
    for (i = 0;i < rule["features"].length;i++) {
      if (rule["features"][i] == "WEBSOCKET") {
        if (typeof window["WebSocket"] == "undefined") {
          return false;
        }
      }
      if (rule["features"][i] == "NOWEBSOCKET") {
        var androidFalsePositive = false;
        if (chatango.utils.userAgent.ANDROID && !/(chrome|opera|firefox)/i.test(userAgent)) {
          androidFalsePositive = true;
        }
        if (typeof window["WebSocket"] != "undefined" && !androidFalsePositive) {
          return false;
        }
      }
      if (rule["features"][i] == "FLASH") {
        if (!this.getFlashVersion()) {
          return false;
        }
      }
      if (rule["features"][i] == "NOFLASH") {
        if (this.getFlashVersion()) {
          return false;
        }
      }
    }
  }
  if (chatango.DEBUG) {
    this.logger.info("Checking rule parameters");
  }
  if (typeof rule["param"] !== "undefined") {
    if (chatango.DEBUG) {
      this.logger.info('uri.getParameterValue(rule["param"]): ' + uri.getParameterValue(rule["param"]));
      this.logger.info('typeof uri.getParameterValue(rule["param"]): ' + typeof uri.getParameterValue(rule["param"]));
    }
    if (typeof uri.getParameterValue(rule["param"]) === "undefined") {
      if (!this.preferredArch_ || this.preferredArch_ != rule["param"]) {
        return false;
      }
    }
  }
  if (chatango.DEBUG) {
    this.logger.info("Checking rule parameters");
  }
  if (typeof rule["styles"] !== "undefined") {
    if (!this.styles_) {
      return false;
    } else {
      switch(rule["styles"]) {
        case chatango.settings.Architecture.JS_REQD:
          if ((!this.styles_["cv"] || this.styles_["cv"] == 0) && (!this.styles_["pos"] || this.styles_["pos"] == "none") && !this.styles_["mockgroup"]) {
            return false;
          }
          break;
        case chatango.settings.Architecture.IS_CV:
          if ((!this.styles_["cv"] || this.styles_["cv"] == 0) && (!this.styles_["pos"] || this.styles_["pos"] == "none")) {
            return false;
          }
          break;
      }
    }
  }
  if (chatango.DEBUG) {
    this.logger.info("Rule matches");
  }
  return true;
};
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
goog.provide("goog.async.Deferred");
goog.provide("goog.async.Deferred.AlreadyCalledError");
goog.provide("goog.async.Deferred.CanceledError");
goog.require("goog.Promise");
goog.require("goog.Thenable");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug.Error");
goog.async.Deferred = function(opt_onCancelFunction, opt_defaultScope) {
  this.sequence_ = [];
  this.onCancelFunction_ = opt_onCancelFunction;
  this.defaultScope_ = opt_defaultScope || null;
  this.fired_ = false;
  this.hadError_ = false;
  this.result_ = undefined;
  this.blocked_ = false;
  this.blocking_ = false;
  this.silentlyCanceled_ = false;
  this.unhandledErrorId_ = 0;
  this.parent_ = null;
  this.branches_ = 0;
  if (goog.async.Deferred.LONG_STACK_TRACES) {
    this.constructorStack_ = null;
    if (Error.captureStackTrace) {
      var target = {stack:""};
      Error.captureStackTrace(target, goog.async.Deferred);
      if (typeof target.stack == "string") {
        this.constructorStack_ = target.stack.replace(/^[^\n]*\n/, "");
      }
    }
  }
};
goog.define("goog.async.Deferred.STRICT_ERRORS", false);
goog.define("goog.async.Deferred.LONG_STACK_TRACES", false);
goog.async.Deferred.prototype.cancel = function(opt_deepCancel) {
  if (!this.hasFired()) {
    if (this.parent_) {
      var parent = this.parent_;
      delete this.parent_;
      if (opt_deepCancel) {
        parent.cancel(opt_deepCancel);
      } else {
        parent.branchCancel_();
      }
    }
    if (this.onCancelFunction_) {
      this.onCancelFunction_.call(this.defaultScope_, this);
    } else {
      this.silentlyCanceled_ = true;
    }
    if (!this.hasFired()) {
      this.errback(new goog.async.Deferred.CanceledError(this));
    }
  } else {
    if (this.result_ instanceof goog.async.Deferred) {
      this.result_.cancel();
    }
  }
};
goog.async.Deferred.prototype.branchCancel_ = function() {
  this.branches_--;
  if (this.branches_ <= 0) {
    this.cancel();
  }
};
goog.async.Deferred.prototype.continue_ = function(isSuccess, res) {
  this.blocked_ = false;
  this.updateResult_(isSuccess, res);
};
goog.async.Deferred.prototype.updateResult_ = function(isSuccess, res) {
  this.fired_ = true;
  this.result_ = res;
  this.hadError_ = !isSuccess;
  this.fire_();
};
goog.async.Deferred.prototype.check_ = function() {
  if (this.hasFired()) {
    if (!this.silentlyCanceled_) {
      throw new goog.async.Deferred.AlreadyCalledError(this);
    }
    this.silentlyCanceled_ = false;
  }
};
goog.async.Deferred.prototype.callback = function(opt_result) {
  this.check_();
  this.assertNotDeferred_(opt_result);
  this.updateResult_(true, opt_result);
};
goog.async.Deferred.prototype.errback = function(opt_result) {
  this.check_();
  this.assertNotDeferred_(opt_result);
  this.makeStackTraceLong_(opt_result);
  this.updateResult_(false, opt_result);
};
goog.async.Deferred.prototype.makeStackTraceLong_ = function(error) {
  if (!goog.async.Deferred.LONG_STACK_TRACES) {
    return;
  }
  if (this.constructorStack_ && goog.isObject(error) && error.stack && /^[^\n]+(\n   [^\n]+)+/.test(error.stack)) {
    error.stack = error.stack + "\nDEFERRED OPERATION:\n" + this.constructorStack_;
  }
};
goog.async.Deferred.prototype.assertNotDeferred_ = function(obj) {
  goog.asserts.assert(!(obj instanceof goog.async.Deferred), "An execution sequence may not be initiated with a blocking Deferred.");
};
goog.async.Deferred.prototype.addCallback = function(cb, opt_scope) {
  return this.addCallbacks(cb, null, opt_scope);
};
goog.async.Deferred.prototype.addErrback = function(eb, opt_scope) {
  return this.addCallbacks(null, eb, opt_scope);
};
goog.async.Deferred.prototype.addBoth = function(f, opt_scope) {
  return this.addCallbacks(f, f, opt_scope);
};
goog.async.Deferred.prototype.addFinally = function(f, opt_scope) {
  return this.addCallbacks(f, function(err) {
    var result = f.call(this, err);
    if (!goog.isDef(result)) {
      throw err;
    }
    return result;
  }, opt_scope);
};
goog.async.Deferred.prototype.addCallbacks = function(cb, eb, opt_scope) {
  goog.asserts.assert(!this.blocking_, "Blocking Deferreds can not be re-used");
  this.sequence_.push([cb, eb, opt_scope]);
  if (this.hasFired()) {
    this.fire_();
  }
  return this;
};
goog.async.Deferred.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
  var resolve, reject;
  var promise = new goog.Promise(function(res, rej) {
    resolve = res;
    reject = rej;
  });
  this.addCallbacks(resolve, function(reason) {
    if (reason instanceof goog.async.Deferred.CanceledError) {
      promise.cancel();
    } else {
      reject(reason);
    }
  });
  return promise.then(opt_onFulfilled, opt_onRejected, opt_context);
};
goog.Thenable.addImplementation(goog.async.Deferred);
goog.async.Deferred.prototype.chainDeferred = function(otherDeferred) {
  this.addCallbacks(otherDeferred.callback, otherDeferred.errback, otherDeferred);
  return this;
};
goog.async.Deferred.prototype.awaitDeferred = function(otherDeferred) {
  if (!(otherDeferred instanceof goog.async.Deferred)) {
    return this.addCallback(function() {
      return otherDeferred;
    });
  }
  return this.addCallback(goog.bind(otherDeferred.branch, otherDeferred));
};
goog.async.Deferred.prototype.branch = function(opt_propagateCancel) {
  var d = new goog.async.Deferred;
  this.chainDeferred(d);
  if (opt_propagateCancel) {
    d.parent_ = this;
    this.branches_++;
  }
  return d;
};
goog.async.Deferred.prototype.hasFired = function() {
  return this.fired_;
};
goog.async.Deferred.prototype.isError = function(res) {
  return res instanceof Error;
};
goog.async.Deferred.prototype.hasErrback_ = function() {
  return goog.array.some(this.sequence_, function(sequenceRow) {
    return goog.isFunction(sequenceRow[1]);
  });
};
goog.async.Deferred.prototype.fire_ = function() {
  if (this.unhandledErrorId_ && this.hasFired() && this.hasErrback_()) {
    goog.async.Deferred.unscheduleError_(this.unhandledErrorId_);
    this.unhandledErrorId_ = 0;
  }
  if (this.parent_) {
    this.parent_.branches_--;
    delete this.parent_;
  }
  var res = this.result_;
  var unhandledException = false;
  var isNewlyBlocked = false;
  while (this.sequence_.length && !this.blocked_) {
    var sequenceEntry = this.sequence_.shift();
    var callback = sequenceEntry[0];
    var errback = sequenceEntry[1];
    var scope = sequenceEntry[2];
    var f = this.hadError_ ? errback : callback;
    if (f) {
      try {
        var ret = f.call(scope || this.defaultScope_, res);
        if (goog.isDef(ret)) {
          this.hadError_ = this.hadError_ && (ret == res || this.isError(ret));
          this.result_ = res = ret;
        }
        if (goog.Thenable.isImplementedBy(res)) {
          isNewlyBlocked = true;
          this.blocked_ = true;
        }
      } catch (ex) {
        res = ex;
        this.hadError_ = true;
        this.makeStackTraceLong_(res);
        if (!this.hasErrback_()) {
          unhandledException = true;
        }
      }
    }
  }
  this.result_ = res;
  if (isNewlyBlocked) {
    var onCallback = goog.bind(this.continue_, this, true);
    var onErrback = goog.bind(this.continue_, this, false);
    if (res instanceof goog.async.Deferred) {
      res.addCallbacks(onCallback, onErrback);
      res.blocking_ = true;
    } else {
      res.then(onCallback, onErrback);
    }
  } else {
    if (goog.async.Deferred.STRICT_ERRORS && this.isError(res) && !(res instanceof goog.async.Deferred.CanceledError)) {
      this.hadError_ = true;
      unhandledException = true;
    }
  }
  if (unhandledException) {
    this.unhandledErrorId_ = goog.async.Deferred.scheduleError_(res);
  }
};
goog.async.Deferred.succeed = function(opt_result) {
  var d = new goog.async.Deferred;
  d.callback(opt_result);
  return d;
};
goog.async.Deferred.fromPromise = function(promise) {
  var d = new goog.async.Deferred;
  d.callback();
  d.addCallback(function() {
    return promise;
  });
  return d;
};
goog.async.Deferred.fail = function(res) {
  var d = new goog.async.Deferred;
  d.errback(res);
  return d;
};
goog.async.Deferred.canceled = function() {
  var d = new goog.async.Deferred;
  d.cancel();
  return d;
};
goog.async.Deferred.when = function(value, callback, opt_scope) {
  if (value instanceof goog.async.Deferred) {
    return value.branch(true).addCallback(callback, opt_scope);
  } else {
    return goog.async.Deferred.succeed(value).addCallback(callback, opt_scope);
  }
};
goog.async.Deferred.AlreadyCalledError = function(deferred) {
  goog.debug.Error.call(this);
  this.deferred = deferred;
};
goog.inherits(goog.async.Deferred.AlreadyCalledError, goog.debug.Error);
goog.async.Deferred.AlreadyCalledError.prototype.message = "Deferred has already fired";
goog.async.Deferred.AlreadyCalledError.prototype.name = "AlreadyCalledError";
goog.async.Deferred.CanceledError = function(deferred) {
  goog.debug.Error.call(this);
  this.deferred = deferred;
};
goog.inherits(goog.async.Deferred.CanceledError, goog.debug.Error);
goog.async.Deferred.CanceledError.prototype.message = "Deferred was canceled";
goog.async.Deferred.CanceledError.prototype.name = "CanceledError";
goog.async.Deferred.Error_ = function(error) {
  this.id_ = goog.global.setTimeout(goog.bind(this.throwError, this), 0);
  this.error_ = error;
};
goog.async.Deferred.Error_.prototype.throwError = function() {
  goog.asserts.assert(goog.async.Deferred.errorMap_[this.id_], "Cannot throw an error that is not scheduled.");
  delete goog.async.Deferred.errorMap_[this.id_];
  throw this.error_;
};
goog.async.Deferred.Error_.prototype.resetTimer = function() {
  goog.global.clearTimeout(this.id_);
};
goog.async.Deferred.errorMap_ = {};
goog.async.Deferred.scheduleError_ = function(error) {
  var deferredError = new goog.async.Deferred.Error_(error);
  goog.async.Deferred.errorMap_[deferredError.id_] = deferredError;
  return deferredError.id_;
};
goog.async.Deferred.unscheduleError_ = function(id) {
  var error = goog.async.Deferred.errorMap_[id];
  if (error) {
    error.resetTimer();
    delete goog.async.Deferred.errorMap_[id];
  }
};
goog.async.Deferred.assertNoErrors = function() {
  var map = goog.async.Deferred.errorMap_;
  for (var key in map) {
    var error = map[key];
    error.resetTimer();
    error.throwError();
  }
};
goog.provide("goog.net.jsloader");
goog.provide("goog.net.jsloader.Error");
goog.provide("goog.net.jsloader.ErrorCode");
goog.provide("goog.net.jsloader.Options");
goog.require("goog.array");
goog.require("goog.async.Deferred");
goog.require("goog.debug.Error");
goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.net.jsloader.GLOBAL_VERIFY_OBJS_ = "closure_verification";
goog.net.jsloader.DEFAULT_TIMEOUT = 5E3;
goog.net.jsloader.Options;
goog.net.jsloader.scriptsToLoad_ = [];
goog.net.jsloader.loadMany = function(uris, opt_options) {
  if (!uris.length) {
    return;
  }
  var isAnotherModuleLoading = goog.net.jsloader.scriptsToLoad_.length;
  goog.array.extend(goog.net.jsloader.scriptsToLoad_, uris);
  if (isAnotherModuleLoading) {
    return;
  }
  uris = goog.net.jsloader.scriptsToLoad_;
  var popAndLoadNextScript = function() {
    var uri = uris.shift();
    var deferred = goog.net.jsloader.load(uri, opt_options);
    if (uris.length) {
      deferred.addBoth(popAndLoadNextScript);
    }
  };
  popAndLoadNextScript();
};
goog.net.jsloader.load = function(uri, opt_options) {
  var options = opt_options || {};
  var doc = options.document || document;
  var script = goog.dom.createElement(goog.dom.TagName.SCRIPT);
  var request = {script_:script, timeout_:undefined};
  var deferred = new goog.async.Deferred(goog.net.jsloader.cancel_, request);
  var timeout = null;
  var timeoutDuration = goog.isDefAndNotNull(options.timeout) ? options.timeout : goog.net.jsloader.DEFAULT_TIMEOUT;
  if (timeoutDuration > 0) {
    timeout = window.setTimeout(function() {
      goog.net.jsloader.cleanup_(script, true);
      deferred.errback(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.TIMEOUT, "Timeout reached for loading script " + uri));
    }, timeoutDuration);
    request.timeout_ = timeout;
  }
  script.onload = script.onreadystatechange = function() {
    if (!script.readyState || script.readyState == "loaded" || script.readyState == "complete") {
      var removeScriptNode = options.cleanupWhenDone || false;
      goog.net.jsloader.cleanup_(script, removeScriptNode, timeout);
      deferred.callback(null);
    }
  };
  script.onerror = function() {
    goog.net.jsloader.cleanup_(script, true, timeout);
    deferred.errback(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.LOAD_ERROR, "Error while loading script " + uri));
  };
  goog.dom.setProperties(script, {"type":"text/javascript", "charset":"UTF-8", "src":uri});
  var scriptParent = goog.net.jsloader.getScriptParentElement_(doc);
  scriptParent.appendChild(script);
  return deferred;
};
goog.net.jsloader.loadAndVerify = function(uri, verificationObjName, options) {
  if (!goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_]) {
    goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_] = {};
  }
  var verifyObjs = goog.global[goog.net.jsloader.GLOBAL_VERIFY_OBJS_];
  if (goog.isDef(verifyObjs[verificationObjName])) {
    return goog.async.Deferred.fail(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.VERIFY_OBJECT_ALREADY_EXISTS, "Verification object " + verificationObjName + " already defined."));
  }
  var sendDeferred = goog.net.jsloader.load(uri, options);
  var deferred = new goog.async.Deferred(goog.bind(sendDeferred.cancel, sendDeferred));
  sendDeferred.addCallback(function() {
    var result = verifyObjs[verificationObjName];
    if (goog.isDef(result)) {
      deferred.callback(result);
      delete verifyObjs[verificationObjName];
    } else {
      deferred.errback(new goog.net.jsloader.Error(goog.net.jsloader.ErrorCode.VERIFY_ERROR, "Script " + uri + " loaded, but verification object " + verificationObjName + " was not defined."));
    }
  });
  sendDeferred.addErrback(function(error) {
    if (goog.isDef(verifyObjs[verificationObjName])) {
      delete verifyObjs[verificationObjName];
    }
    deferred.errback(error);
  });
  return deferred;
};
goog.net.jsloader.getScriptParentElement_ = function(doc) {
  var headElements = doc.getElementsByTagName(goog.dom.TagName.HEAD);
  if (!headElements || goog.array.isEmpty(headElements)) {
    return doc.documentElement;
  } else {
    return headElements[0];
  }
};
goog.net.jsloader.cancel_ = function() {
  var request = this;
  if (request && request.script_) {
    var scriptNode = request.script_;
    if (scriptNode && scriptNode.tagName == "SCRIPT") {
      goog.net.jsloader.cleanup_(scriptNode, true, request.timeout_);
    }
  }
};
goog.net.jsloader.cleanup_ = function(scriptNode, removeScriptNode, opt_timeout) {
  if (goog.isDefAndNotNull(opt_timeout)) {
    goog.global.clearTimeout(opt_timeout);
  }
  scriptNode.onload = goog.nullFunction;
  scriptNode.onerror = goog.nullFunction;
  scriptNode.onreadystatechange = goog.nullFunction;
  if (removeScriptNode) {
    window.setTimeout(function() {
      goog.dom.removeNode(scriptNode);
    }, 0);
  }
};
goog.net.jsloader.ErrorCode = {LOAD_ERROR:0, TIMEOUT:1, VERIFY_ERROR:2, VERIFY_OBJECT_ALREADY_EXISTS:3};
goog.net.jsloader.Error = function(code, opt_message) {
  var msg = "Jsloader error (code #" + code + ")";
  if (opt_message) {
    msg += ": " + opt_message;
  }
  goog.net.jsloader.Error.base(this, "constructor", msg);
  this.code = code;
};
goog.inherits(goog.net.jsloader.Error, goog.debug.Error);
goog.provide("goog.module");
goog.module = goog.module || {};
goog.provide("goog.module.AbstractModuleLoader");
goog.require("goog.module");
goog.module.AbstractModuleLoader = function() {
};
goog.module.AbstractModuleLoader.prototype.loadModules = function(ids, moduleInfoMap, opt_successFn, opt_errorFn, opt_timeoutFn, opt_forceReload) {
};
goog.module.AbstractModuleLoader.prototype.prefetchModule = function(id, moduleInfo) {
};
goog.provide("goog.net.EventType");
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress"};
goog.provide("goog.log");
goog.provide("goog.log.Level");
goog.provide("goog.log.LogRecord");
goog.provide("goog.log.Logger");
goog.require("goog.debug");
goog.require("goog.debug.LogManager");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger");
goog.define("goog.log.ENABLED", goog.debug.LOGGING_ENABLED);
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME;
goog.log.Logger = goog.debug.Logger;
goog.log.Level = goog.debug.Logger.Level;
goog.log.LogRecord = goog.debug.LogRecord;
goog.log.getLogger = function(name, opt_level) {
  if (goog.log.ENABLED) {
    var logger = goog.debug.LogManager.getLogger(name);
    if (opt_level && logger) {
      logger.setLevel(opt_level);
    }
    return logger;
  } else {
    return null;
  }
};
goog.log.addHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    logger.addHandler(handler);
  }
};
goog.log.removeHandler = function(logger, handler) {
  if (goog.log.ENABLED && logger) {
    return logger.removeHandler(handler);
  } else {
    return false;
  }
};
goog.log.log = function(logger, level, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.log(level, msg, opt_exception);
  }
};
goog.log.error = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.severe(msg, opt_exception);
  }
};
goog.log.warning = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.warning(msg, opt_exception);
  }
};
goog.log.info = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.info(msg, opt_exception);
  }
};
goog.log.fine = function(logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.fine(msg, opt_exception);
  }
};
goog.provide("goog.net.BulkLoaderHelper");
goog.require("goog.Disposable");
goog.require("goog.log");
goog.net.BulkLoaderHelper = function(uris) {
  goog.Disposable.call(this);
  this.uris_ = uris;
  this.responseTexts_ = [];
};
goog.inherits(goog.net.BulkLoaderHelper, goog.Disposable);
goog.net.BulkLoaderHelper.prototype.getUri = function(id) {
  return this.uris_[id];
};
goog.net.BulkLoaderHelper.prototype.getUris = function() {
  return this.uris_;
};
goog.net.BulkLoaderHelper.prototype.getResponseTexts = function() {
  return this.responseTexts_;
};
goog.net.BulkLoaderHelper.prototype.setResponseText = function(id, responseText) {
  this.responseTexts_[id] = responseText;
};
goog.net.BulkLoaderHelper.prototype.isLoadComplete = function() {
  var responseTexts = this.responseTexts_;
  if (responseTexts.length == this.uris_.length) {
    for (var i = 0;i < responseTexts.length;i++) {
      if (!goog.isDefAndNotNull(responseTexts[i])) {
        return false;
      }
    }
    return true;
  }
  return false;
};
goog.net.BulkLoaderHelper.prototype.disposeInternal = function() {
  goog.net.BulkLoaderHelper.superClass_.disposeInternal.call(this);
  this.uris_ = null;
  this.responseTexts_ = null;
};
goog.provide("goog.net.ErrorCode");
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(errorCode) {
  switch(errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return "No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return "Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return "File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return "Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return "Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return "An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return "Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return "Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return "Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
};
goog.provide("goog.net.HttpStatus");
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, PRECONDITION_REQUIRED:428, TOO_MANY_REQUESTS:429, REQUEST_HEADER_FIELDS_TOO_LARGE:431, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, NETWORK_AUTHENTICATION_REQUIRED:511, QUIRK_IE_NO_CONTENT:1223};
goog.net.HttpStatus.isSuccess = function(status) {
  switch(status) {
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.CREATED:
    ;
    case goog.net.HttpStatus.ACCEPTED:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.PARTIAL_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
    ;
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return true;
    default:
      return false;
  }
};
goog.provide("goog.net.XhrLike");
goog.net.XhrLike = function() {
};
goog.net.XhrLike.OrNative;
goog.net.XhrLike.prototype.onreadystatechange;
goog.net.XhrLike.prototype.responseText;
goog.net.XhrLike.prototype.responseXML;
goog.net.XhrLike.prototype.readyState;
goog.net.XhrLike.prototype.status;
goog.net.XhrLike.prototype.statusText;
goog.net.XhrLike.prototype.open = function(method, url, opt_async, opt_user, opt_password) {
};
goog.net.XhrLike.prototype.send = function(opt_data) {
};
goog.net.XhrLike.prototype.abort = function() {
};
goog.net.XhrLike.prototype.setRequestHeader = function(header, value) {
};
goog.net.XhrLike.prototype.getResponseHeader = function(header) {
};
goog.net.XhrLike.prototype.getAllResponseHeaders = function() {
};
goog.provide("goog.net.XmlHttpFactory");
goog.require("goog.net.XhrLike");
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.createInstance = goog.abstractMethod;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions());
};
goog.net.XmlHttpFactory.prototype.internalGetOptions = goog.abstractMethod;
goog.provide("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XhrLike");
goog.require("goog.net.XmlHttpFactory");
goog.net.WrapperXmlHttpFactory = function(xhrFactory, optionsFactory) {
  goog.net.XmlHttpFactory.call(this);
  this.xhrFactory_ = xhrFactory;
  this.optionsFactory_ = optionsFactory;
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_();
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_();
};
goog.provide("goog.net.DefaultXmlHttpFactory");
goog.provide("goog.net.XmlHttp");
goog.provide("goog.net.XmlHttp.OptionType");
goog.provide("goog.net.XmlHttp.ReadyState");
goog.provide("goog.net.XmlHttpDefines");
goog.require("goog.asserts");
goog.require("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XmlHttpFactory");
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance();
};
goog.define("goog.net.XmlHttp.ASSUME_NATIVE_XHR", false);
goog.net.XmlHttpDefines = {};
goog.define("goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR", false);
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions();
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.factory_;
goog.net.XmlHttp.setFactory = function(factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(goog.asserts.assert(factory), goog.asserts.assert(optionsFactory)));
};
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory;
};
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this);
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var progId = this.getProgId_();
  if (progId) {
    return new ActiveXObject(progId);
  } else {
    return new XMLHttpRequest;
  }
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var progId = this.getProgId_();
  var options = {};
  if (progId) {
    options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = true;
    options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = true;
  }
  return options;
};
goog.net.DefaultXmlHttpFactory.prototype.ieProgId_;
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if (goog.net.XmlHttp.ASSUME_NATIVE_XHR || goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR) {
    return "";
  }
  if (!this.ieProgId_ && typeof XMLHttpRequest == "undefined" && typeof ActiveXObject != "undefined") {
    var ACTIVE_X_IDENTS = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    for (var i = 0;i < ACTIVE_X_IDENTS.length;i++) {
      var candidate = ACTIVE_X_IDENTS[i];
      try {
        new ActiveXObject(candidate);
        this.ieProgId_ = candidate;
        return candidate;
      } catch (e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled," + " or MSXML might not be installed");
  }
  return(this.ieProgId_);
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
goog.provide("goog.net.XhrIo");
goog.provide("goog.net.XhrIo.ResponseType");
goog.require("goog.Timer");
goog.require("goog.array");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.events.EventTarget");
goog.require("goog.json");
goog.require("goog.log");
goog.require("goog.net.ErrorCode");
goog.require("goog.net.EventType");
goog.require("goog.net.HttpStatus");
goog.require("goog.net.XmlHttp");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.require("goog.userAgent");
goog.forwardDeclare("goog.Uri");
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.net.XhrIo.base(this, "constructor");
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
  this.active_ = false;
  this.xhr_ = null;
  this.xhrOptions_ = null;
  this.lastUri_ = "";
  this.lastMethod_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastError_ = "";
  this.errorDispatched_ = false;
  this.inSend_ = false;
  this.inOpen_ = false;
  this.inAbort_ = false;
  this.timeoutInterval_ = 0;
  this.timeoutId_ = null;
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
  this.withCredentials_ = false;
  this.useXhr2Timeout_ = false;
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.log.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.XHR2_TIMEOUT_ = "timeout";
goog.net.XhrIo.XHR2_ON_TIMEOUT_ = "ontimeout";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval, opt_withCredentials) {
  var x = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(x);
  if (opt_callback) {
    x.listen(goog.net.EventType.COMPLETE, opt_callback);
  }
  x.listenOnce(goog.net.EventType.READY, x.cleanupSend_);
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }
  if (opt_withCredentials) {
    x.setWithCredentials(opt_withCredentials);
  }
  x.send(url, opt_method, opt_content, opt_headers);
  return x;
};
goog.net.XhrIo.cleanup = function() {
  var instances = goog.net.XhrIo.sendInstances_;
  while (instances.length) {
    instances.pop().dispose();
  }
};
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
};
goog.net.XhrIo.prototype.cleanupSend_ = function() {
  this.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, this);
};
goog.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
};
goog.net.XhrIo.prototype.setResponseType = function(type) {
  this.responseType_ = type;
};
goog.net.XhrIo.prototype.getResponseType = function() {
  return this.responseType_;
};
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials;
};
goog.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_;
};
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  if (this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.lastUri_ + "; newUri=" + url);
  }
  var method = opt_method ? opt_method.toUpperCase() : "GET";
  this.lastUri_ = url;
  this.lastError_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = false;
  this.active_ = true;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  try {
    goog.log.fine(this.logger_, this.formatMsg_("Opening Xhr"));
    this.inOpen_ = true;
    this.xhr_.open(method, String(url), true);
    this.inOpen_ = false;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Error opening Xhr: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return;
  }
  var content = opt_content || "";
  var headers = this.headers.clone();
  if (opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      headers.set(key, value);
    });
  }
  var contentTypeKey = goog.array.find(headers.getKeys(), goog.net.XhrIo.isContentTypeHeader_);
  var contentIsFormData = goog.global["FormData"] && content instanceof goog.global["FormData"];
  if (goog.array.contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, method) && !contentTypeKey && !contentIsFormData) {
    headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE);
  }
  headers.forEach(function(value, key) {
    this.xhr_.setRequestHeader(key, value);
  }, this);
  if (this.responseType_) {
    this.xhr_.responseType = this.responseType_;
  }
  if (goog.object.containsKey(this.xhr_, "withCredentials")) {
    this.xhr_.withCredentials = this.withCredentials_;
  }
  try {
    this.cleanUpTimeoutTimer_();
    if (this.timeoutInterval_ > 0) {
      this.useXhr2Timeout_ = goog.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_);
      goog.log.fine(this.logger_, this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete, xhr2 " + this.useXhr2Timeout_));
      if (this.useXhr2Timeout_) {
        this.xhr_[goog.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_;
        this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = goog.bind(this.timeout_, this);
      } else {
        this.timeoutId_ = goog.Timer.callOnce(this.timeout_, this.timeoutInterval_, this);
      }
    }
    goog.log.fine(this.logger_, this.formatMsg_("Sending request"));
    this.inSend_ = true;
    this.xhr_.send(content);
    this.inSend_ = false;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Send error: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
  }
};
goog.net.XhrIo.shouldUseXhr2Timeout_ = function(xhr) {
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher(9) && goog.isNumber(xhr[goog.net.XhrIo.XHR2_TIMEOUT_]) && goog.isDef(xhr[goog.net.XhrIo.XHR2_ON_TIMEOUT_]);
};
goog.net.XhrIo.isContentTypeHeader_ = function(header) {
  return goog.string.caseInsensitiveEquals(goog.net.XhrIo.CONTENT_TYPE_HEADER, header);
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
};
goog.net.XhrIo.prototype.timeout_ = function() {
  if (typeof goog == "undefined") {
  } else {
    if (this.xhr_) {
      this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting";
      this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
      goog.log.fine(this.logger_, this.formatMsg_(this.lastError_));
      this.dispatchEvent(goog.net.EventType.TIMEOUT);
      this.abort(goog.net.ErrorCode.TIMEOUT);
    }
  }
};
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = false;
  if (this.xhr_) {
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
  }
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_();
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  if (!this.errorDispatched_) {
    this.errorDispatched_ = true;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR);
  }
};
goog.net.XhrIo.prototype.abort = function(opt_failureCode) {
  if (this.xhr_ && this.active_) {
    goog.log.fine(this.logger_, this.formatMsg_("Aborting"));
    this.active_ = false;
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.cleanUpXhr_();
  }
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  if (this.xhr_) {
    if (this.active_) {
      this.active_ = false;
      this.inAbort_ = true;
      this.xhr_.abort();
      this.inAbort_ = false;
    }
    this.cleanUpXhr_(true);
  }
  goog.net.XhrIo.base(this, "disposeInternal");
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (this.isDisposed()) {
    return;
  }
  if (!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    this.onReadyStateChangeEntryPoint_();
  } else {
    this.onReadyStateChangeHelper_();
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if (!this.active_) {
    return;
  }
  if (typeof goog == "undefined") {
  } else {
    if (this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && this.getStatus() == 2) {
      goog.log.fine(this.logger_, this.formatMsg_("Local request error detected and ignored"));
    } else {
      if (this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.callOnce(this.onReadyStateChange_, 0, this);
        return;
      }
      this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);
      if (this.isComplete()) {
        goog.log.fine(this.logger_, this.formatMsg_("Request complete"));
        this.active_ = false;
        try {
          if (this.isSuccess()) {
            this.dispatchEvent(goog.net.EventType.COMPLETE);
            this.dispatchEvent(goog.net.EventType.SUCCESS);
          } else {
            this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
            this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]";
            this.dispatchErrors_();
          }
        } finally {
          this.cleanUpXhr_();
        }
      }
    }
  }
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if (this.xhr_) {
    this.cleanUpTimeoutTimer_();
    var xhr = this.xhr_;
    var clearedOnReadyStateChange = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhr_ = null;
    this.xhrOptions_ = null;
    if (!opt_fromDispose) {
      this.dispatchEvent(goog.net.EventType.READY);
    }
    try {
      xhr.onreadystatechange = clearedOnReadyStateChange;
    } catch (e) {
      goog.log.error(this.logger_, "Problem encountered resetting onreadystatechange: " + e.message);
    }
  }
};
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function() {
  if (this.xhr_ && this.useXhr2Timeout_) {
    this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = null;
  }
  if (goog.isNumber(this.timeoutId_)) {
    goog.Timer.clear(this.timeoutId_);
    this.timeoutId_ = null;
  }
};
goog.net.XhrIo.prototype.isActive = function() {
  return!!this.xhr_;
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};
goog.net.XhrIo.prototype.isSuccess = function() {
  var status = this.getStatus();
  return goog.net.HttpStatus.isSuccess(status) || status === 0 && !this.isLastUriEffectiveSchemeHttp_();
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var scheme = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(scheme);
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? (this.xhr_.readyState) : goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1;
  } catch (e) {
    return-1;
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : "";
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get status: " + e.message);
    return "";
  }
};
goog.net.XhrIo.prototype.getLastUri = function() {
  return String(this.lastUri_);
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : "";
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get responseText: " + e.message);
    return "";
  }
};
goog.net.XhrIo.prototype.getResponseBody = function() {
  try {
    if (this.xhr_ && "responseBody" in this.xhr_) {
      return this.xhr_["responseBody"];
    }
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get responseBody: " + e.message);
  }
  return null;
};
goog.net.XhrIo.prototype.getResponseXml = function() {
  try {
    return this.xhr_ ? this.xhr_.responseXML : null;
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get responseXML: " + e.message);
    return null;
  }
};
goog.net.XhrIo.prototype.getResponseJson = function(opt_xssiPrefix) {
  if (!this.xhr_) {
    return undefined;
  }
  var responseText = this.xhr_.responseText;
  if (opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length);
  }
  return goog.json.parse(responseText);
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    if (!this.xhr_) {
      return null;
    }
    if ("response" in this.xhr_) {
      return this.xhr_.response;
    }
    switch(this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      ;
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if ("mozResponseArrayBuffer" in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer;
        }
      ;
    }
    goog.log.error(this.logger_, "Response type " + this.responseType_ + " is not " + "supported on this browser");
    return null;
  } catch (e) {
    goog.log.fine(this.logger_, "Can not get response: " + e.message);
    return null;
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(key) : undefined;
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : "";
};
goog.net.XhrIo.prototype.getResponseHeaders = function() {
  var headersObject = {};
  var headersArray = this.getAllResponseHeaders().split("\r\n");
  for (var i = 0;i < headersArray.length;i++) {
    if (goog.string.isEmptyOrWhitespace(headersArray[i])) {
      continue;
    }
    var keyValue = goog.string.splitLimit(headersArray[i], ": ", 2);
    if (headersObject[keyValue[0]]) {
      headersObject[keyValue[0]] += ", " + keyValue[1];
    } else {
      headersObject[keyValue[0]] = keyValue[1];
    }
  }
  return headersObject;
};
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
};
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_);
};
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]";
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
});
goog.provide("goog.net.BulkLoader");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.log");
goog.require("goog.net.BulkLoaderHelper");
goog.require("goog.net.EventType");
goog.require("goog.net.XhrIo");
goog.net.BulkLoader = function(uris) {
  goog.events.EventTarget.call(this);
  this.helper_ = new goog.net.BulkLoaderHelper(uris);
  this.eventHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(goog.net.BulkLoader, goog.events.EventTarget);
goog.net.BulkLoader.prototype.logger_ = goog.log.getLogger("goog.net.BulkLoader");
goog.net.BulkLoader.prototype.getResponseTexts = function() {
  return this.helper_.getResponseTexts();
};
goog.net.BulkLoader.prototype.getRequestUris = function() {
  return this.helper_.getUris();
};
goog.net.BulkLoader.prototype.load = function() {
  var eventHandler = this.eventHandler_;
  var uris = this.helper_.getUris();
  goog.log.info(this.logger_, "Starting load of code with " + uris.length + " uris.");
  for (var i = 0;i < uris.length;i++) {
    var xhrIo = new goog.net.XhrIo;
    eventHandler.listen(xhrIo, goog.net.EventType.COMPLETE, goog.bind(this.handleEvent_, this, i));
    xhrIo.send(uris[i]);
  }
};
goog.net.BulkLoader.prototype.handleEvent_ = function(id, e) {
  goog.log.info(this.logger_, 'Received event "' + e.type + '" for id ' + id + " with uri " + this.helper_.getUri(id));
  var xhrIo = (e.target);
  if (xhrIo.isSuccess()) {
    this.handleSuccess_(id, xhrIo);
  } else {
    this.handleError_(id, xhrIo);
  }
};
goog.net.BulkLoader.prototype.handleSuccess_ = function(id, xhrIo) {
  this.helper_.setResponseText(id, xhrIo.getResponseText());
  if (this.helper_.isLoadComplete()) {
    this.finishLoad_();
  }
  xhrIo.dispose();
};
goog.net.BulkLoader.prototype.handleError_ = function(id, xhrIo) {
  this.dispatchEvent(goog.net.EventType.ERROR);
  xhrIo.dispose();
};
goog.net.BulkLoader.prototype.finishLoad_ = function() {
  goog.log.info(this.logger_, "All uris loaded.");
  this.dispatchEvent(goog.net.EventType.SUCCESS);
};
goog.net.BulkLoader.prototype.disposeInternal = function() {
  goog.net.BulkLoader.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.eventHandler_ = null;
  this.helper_.dispose();
  this.helper_ = null;
};
goog.provide("goog.userAgent.product");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.platform");
goog.require("goog.userAgent");
goog.define("goog.userAgent.product.ASSUME_FIREFOX", false);
goog.define("goog.userAgent.product.ASSUME_IPHONE", false);
goog.define("goog.userAgent.product.ASSUME_IPAD", false);
goog.define("goog.userAgent.product.ASSUME_ANDROID", false);
goog.define("goog.userAgent.product.ASSUME_CHROME", false);
goog.define("goog.userAgent.product.ASSUME_SAFARI", false);
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.labs.userAgent.browser.isFirefox();
goog.userAgent.product.isIphoneOrIpod_ = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpod();
};
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.isIphoneOrIpod_();
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.labs.userAgent.browser.isAndroidBrowser();
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.labs.userAgent.browser.isChrome();
goog.userAgent.product.isSafariDesktop_ = function() {
  return goog.labs.userAgent.browser.isSafari() && !goog.labs.userAgent.platform.isIos();
};
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.isSafariDesktop_();
goog.provide("goog.module.ModuleLoader");
goog.require("goog.Timer");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.log");
goog.require("goog.module.AbstractModuleLoader");
goog.require("goog.net.BulkLoader");
goog.require("goog.net.EventType");
goog.require("goog.net.jsloader");
goog.require("goog.userAgent");
goog.require("goog.userAgent.product");
goog.module.ModuleLoader = function() {
  goog.module.ModuleLoader.base(this, "constructor");
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.loadingModulesStatus_ = {};
};
goog.inherits(goog.module.ModuleLoader, goog.events.EventTarget);
goog.module.ModuleLoader.prototype.logger = goog.log.getLogger("goog.module.ModuleLoader");
goog.module.ModuleLoader.prototype.debugMode_ = false;
goog.module.ModuleLoader.prototype.sourceUrlInjection_ = false;
goog.module.ModuleLoader.supportsSourceUrlStackTraces = function() {
  return goog.userAgent.product.CHROME;
};
goog.module.ModuleLoader.supportsSourceUrlDebugger = function() {
  return goog.userAgent.product.CHROME || goog.userAgent.GECKO;
};
goog.module.ModuleLoader.prototype.getDebugMode = function() {
  return this.debugMode_;
};
goog.module.ModuleLoader.prototype.setDebugMode = function(debugMode) {
  this.debugMode_ = debugMode;
};
goog.module.ModuleLoader.prototype.setSourceUrlInjection = function(enabled) {
  this.sourceUrlInjection_ = enabled;
};
goog.module.ModuleLoader.prototype.usingSourceUrlInjection_ = function() {
  return this.sourceUrlInjection_ || this.getDebugMode() && goog.module.ModuleLoader.supportsSourceUrlStackTraces();
};
goog.module.ModuleLoader.prototype.loadModules = function(ids, moduleInfoMap, opt_successFn, opt_errorFn, opt_timeoutFn, opt_forceReload) {
  var loadStatus = this.loadingModulesStatus_[ids] || new goog.module.ModuleLoader.LoadStatus;
  loadStatus.loadRequested = true;
  loadStatus.successFn = opt_successFn || null;
  loadStatus.errorFn = opt_errorFn || null;
  if (!this.loadingModulesStatus_[ids]) {
    this.loadingModulesStatus_[ids] = loadStatus;
    this.downloadModules_(ids, moduleInfoMap);
  } else {
    if (goog.isDefAndNotNull(loadStatus.responseTexts)) {
      this.evaluateCode_(ids);
    }
  }
};
goog.module.ModuleLoader.prototype.evaluateCode_ = function(moduleIds) {
  this.dispatchEvent(new goog.module.ModuleLoader.Event(goog.module.ModuleLoader.EventType.REQUEST_SUCCESS, moduleIds));
  goog.log.info(this.logger, "evaluateCode ids:" + moduleIds);
  var success = true;
  var loadStatus = this.loadingModulesStatus_[moduleIds];
  var uris = loadStatus.requestUris;
  var texts = loadStatus.responseTexts;
  try {
    if (this.usingSourceUrlInjection_()) {
      for (var i = 0;i < uris.length;i++) {
        var uri = uris[i];
        goog.globalEval(texts[i] + " //@ sourceURL=" + uri);
      }
    } else {
      goog.globalEval(texts.join("\n"));
    }
  } catch (e) {
    success = false;
    goog.log.warning(this.logger, "Loaded incomplete code for module(s): " + moduleIds, e);
  }
  this.dispatchEvent(new goog.module.ModuleLoader.Event(goog.module.ModuleLoader.EventType.EVALUATE_CODE, moduleIds));
  if (!success) {
    this.handleErrorHelper_(moduleIds, loadStatus.errorFn, null);
  } else {
    if (loadStatus.successFn) {
      loadStatus.successFn();
    }
  }
  delete this.loadingModulesStatus_[moduleIds];
};
goog.module.ModuleLoader.prototype.handleSuccess_ = function(bulkLoader, moduleIds) {
  goog.log.info(this.logger, "Code loaded for module(s): " + moduleIds);
  var loadStatus = this.loadingModulesStatus_[moduleIds];
  loadStatus.responseTexts = bulkLoader.getResponseTexts();
  if (loadStatus.loadRequested) {
    this.evaluateCode_(moduleIds);
  }
  goog.Timer.callOnce(bulkLoader.dispose, 5, bulkLoader);
};
goog.module.ModuleLoader.prototype.prefetchModule = function(id, moduleInfo) {
  if (this.getDebugMode()) {
    return;
  }
  var loadStatus = this.loadingModulesStatus_[[id]];
  if (loadStatus) {
    return;
  }
  var moduleInfoMap = {};
  moduleInfoMap[id] = moduleInfo;
  this.loadingModulesStatus_[[id]] = new goog.module.ModuleLoader.LoadStatus;
  this.downloadModules_([id], moduleInfoMap);
};
goog.module.ModuleLoader.prototype.downloadModules_ = function(ids, moduleInfoMap) {
  var uris = [];
  for (var i = 0;i < ids.length;i++) {
    goog.array.extend(uris, moduleInfoMap[ids[i]].getUris());
  }
  goog.log.info(this.logger, "downloadModules ids:" + ids + " uris:" + uris);
  if (this.getDebugMode() && !this.usingSourceUrlInjection_()) {
    goog.net.jsloader.loadMany(uris);
  } else {
    var loadStatus = this.loadingModulesStatus_[ids];
    loadStatus.requestUris = uris;
    var bulkLoader = new goog.net.BulkLoader(uris);
    var eventHandler = this.eventHandler_;
    eventHandler.listen(bulkLoader, goog.net.EventType.SUCCESS, goog.bind(this.handleSuccess_, this, bulkLoader, ids));
    eventHandler.listen(bulkLoader, goog.net.EventType.ERROR, goog.bind(this.handleError_, this, bulkLoader, ids));
    bulkLoader.load();
  }
};
goog.module.ModuleLoader.prototype.handleError_ = function(bulkLoader, moduleIds, status) {
  var loadStatus = this.loadingModulesStatus_[moduleIds];
  if (loadStatus) {
    delete this.loadingModulesStatus_[moduleIds];
    this.handleErrorHelper_(moduleIds, loadStatus.errorFn, status);
  }
  goog.Timer.callOnce(bulkLoader.dispose, 5, bulkLoader);
};
goog.module.ModuleLoader.prototype.handleErrorHelper_ = function(moduleIds, errorFn, status) {
  this.dispatchEvent(new goog.module.ModuleLoader.Event(goog.module.ModuleLoader.EventType.REQUEST_ERROR, moduleIds));
  goog.log.warning(this.logger, "Request failed for module(s): " + moduleIds);
  if (errorFn) {
    errorFn(status);
  }
};
goog.module.ModuleLoader.prototype.disposeInternal = function() {
  goog.module.ModuleLoader.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.eventHandler_ = null;
};
goog.module.ModuleLoader.EventType = {EVALUATE_CODE:goog.events.getUniqueId("evaluateCode"), REQUEST_SUCCESS:goog.events.getUniqueId("requestSuccess"), REQUEST_ERROR:goog.events.getUniqueId("requestError")};
goog.module.ModuleLoader.Event = function(type, moduleIds) {
  goog.module.ModuleLoader.Event.base(this, "constructor", type);
  this.moduleIds = moduleIds;
};
goog.inherits(goog.module.ModuleLoader.Event, goog.events.Event);
goog.module.ModuleLoader.LoadStatus = function() {
  this.requestUris = null;
  this.responseTexts = null;
  this.loadRequested = false;
  this.successFn = null;
  this.errorFn = null;
};
goog.provide("goog.net.Cookies");
goog.provide("goog.net.cookies");
goog.net.Cookies = function(context) {
  this.document_ = context;
};
goog.net.Cookies.MAX_COOKIE_LENGTH = 3950;
goog.net.Cookies.SPLIT_RE_ = /\s*;\s*/;
goog.net.Cookies.prototype.isEnabled = function() {
  return navigator.cookieEnabled;
};
goog.net.Cookies.prototype.isValidName = function(name) {
  return!/[;=\s]/.test(name);
};
goog.net.Cookies.prototype.isValidValue = function(value) {
  return!/[;\r\n]/.test(value);
};
goog.net.Cookies.prototype.set = function(name, value, opt_maxAge, opt_path, opt_domain, opt_secure) {
  if (!this.isValidName(name)) {
    throw Error('Invalid cookie name "' + name + '"');
  }
  if (!this.isValidValue(value)) {
    throw Error('Invalid cookie value "' + value + '"');
  }
  if (!goog.isDef(opt_maxAge)) {
    opt_maxAge = -1;
  }
  var domainStr = opt_domain ? ";domain=" + opt_domain : "";
  var pathStr = opt_path ? ";path=" + opt_path : "";
  var secureStr = opt_secure ? ";secure" : "";
  var expiresStr;
  if (opt_maxAge < 0) {
    expiresStr = "";
  } else {
    if (opt_maxAge == 0) {
      var pastDate = new Date(1970, 1, 1);
      expiresStr = ";expires=" + pastDate.toUTCString();
    } else {
      var futureDate = new Date(goog.now() + opt_maxAge * 1E3);
      expiresStr = ";expires=" + futureDate.toUTCString();
    }
  }
  this.setCookie_(name + "=" + value + domainStr + pathStr + expiresStr + secureStr);
};
goog.net.Cookies.prototype.get = function(name, opt_default) {
  var nameEq = name + "=";
  var parts = this.getParts_();
  for (var i = 0, part;part = parts[i];i++) {
    if (part.lastIndexOf(nameEq, 0) == 0) {
      return part.substr(nameEq.length);
    }
    if (part == name) {
      return "";
    }
  }
  return opt_default;
};
goog.net.Cookies.prototype.remove = function(name, opt_path, opt_domain) {
  var rv = this.containsKey(name);
  this.set(name, "", 0, opt_path, opt_domain);
  return rv;
};
goog.net.Cookies.prototype.getKeys = function() {
  return this.getKeyValues_().keys;
};
goog.net.Cookies.prototype.getValues = function() {
  return this.getKeyValues_().values;
};
goog.net.Cookies.prototype.isEmpty = function() {
  return!this.getCookie_();
};
goog.net.Cookies.prototype.getCount = function() {
  var cookie = this.getCookie_();
  if (!cookie) {
    return 0;
  }
  return this.getParts_().length;
};
goog.net.Cookies.prototype.containsKey = function(key) {
  return goog.isDef(this.get(key));
};
goog.net.Cookies.prototype.containsValue = function(value) {
  var values = this.getKeyValues_().values;
  for (var i = 0;i < values.length;i++) {
    if (values[i] == value) {
      return true;
    }
  }
  return false;
};
goog.net.Cookies.prototype.clear = function() {
  var keys = this.getKeyValues_().keys;
  for (var i = keys.length - 1;i >= 0;i--) {
    this.remove(keys[i]);
  }
};
goog.net.Cookies.prototype.setCookie_ = function(s) {
  this.document_.cookie = s;
};
goog.net.Cookies.prototype.getCookie_ = function() {
  return this.document_.cookie;
};
goog.net.Cookies.prototype.getParts_ = function() {
  return(this.getCookie_() || "").split(goog.net.Cookies.SPLIT_RE_);
};
goog.net.Cookies.prototype.getKeyValues_ = function() {
  var parts = this.getParts_();
  var keys = [], values = [], index, part;
  for (var i = 0;part = parts[i];i++) {
    index = part.indexOf("=");
    if (index == -1) {
      keys.push("");
      values.push(part);
    } else {
      keys.push(part.substring(0, index));
      values.push(part.substring(index + 1));
    }
  }
  return{keys:keys, values:values};
};
goog.net.cookies = new goog.net.Cookies(document);
goog.net.cookies.MAX_COOKIE_LENGTH = goog.net.Cookies.MAX_COOKIE_LENGTH;
goog.provide("chatango.embed.AppComm");
chatango.embed.AppComm = function() {
  this.lc_ = chatango.embed.LocalCommChild.getInstance();
  this.callbacks_ = {};
  this.callbackId_ = 0;
};
goog.addSingletonGetter(chatango.embed.AppComm);
chatango.embed.AppComm.prototype.alertMessage = function(from, message) {
  this.send_({"type":"message", "data":{"from":from, "message":message}});
};
chatango.embed.AppComm.prototype.alertReply = function(from, message) {
  this.send_({"type":"reply", "data":{"from":from, "message":message}});
};
chatango.embed.AppComm.prototype.alertSound = function(url, stream) {
  this.send_({"type":"sound", "src":url, "stream":stream});
};
chatango.embed.AppComm.prototype.alertDisconnect = function() {
  this.send_({"type":"disconnect"});
};
chatango.embed.AppComm.prototype.alertLogoutRequest = function(callback, scope) {
  this.send_({"type":"logout"}, callback, scope);
};
chatango.embed.AppComm.prototype.alertLogoutOk = function() {
  this.send_({"type":"logoutok"});
};
chatango.embed.AppComm.prototype.alertUpload = function(callback, scope) {
  this.send_({"type":"upload"}, callback, scope);
};
chatango.embed.AppComm.prototype.alertEditProfileImage = function() {
  this.send_({"type":"edit_profile_image"});
};
chatango.embed.AppComm.prototype.alertBgUpload = function(callback, scope) {
  this.send_({"type":"upload_bg"}, callback, scope);
};
chatango.embed.AppComm.prototype.send_ = function(obj, opt_callback, opt_scope) {
  if (opt_callback !== undefined && opt_scope !== undefined) {
    this.callbacks_[++this.callbackId_] = [opt_callback, opt_scope];
    obj["callback"] = this.callbackId_;
  }
  this.lc_.send("sendtoapp", obj);
};
chatango.embed.AppComm.prototype.callback = function(id, arg) {
  var callback = this.callbacks_[id];
  callback[0].call(callback[1], arg);
  delete this.callbacks_[id];
};
chatango.embed.AppComm.prototype.canExecCommand_ = function(command) {
  if (!window["android"] || !window["android"][command]) {
    return false;
  }
  return true;
};
chatango.embed.AppComm.prototype.execCommand_ = function(command) {
  window["android"][command]();
};
chatango.embed.AppComm.prototype.canShareWebView = function() {
  return this.canExecCommand_("shareWebView");
};
chatango.embed.AppComm.prototype.shareWebView = function() {
  this.execCommand_("shareWebView");
};
goog.require("goog.events.Event");
goog.provide("chatango.events.EnableResizeDraggerEvent");
chatango.events.EnableResizeDraggerEvent = function(bool) {
  this.enabled_ = bool;
  goog.events.Event.call(this, chatango.events.EventType.ENABLE_RESIZE_DRAGGER);
};
goog.inherits(chatango.events.EnableResizeDraggerEvent, goog.events.Event);
chatango.events.EnableResizeDraggerEvent.prototype.getEnabled = function() {
  return this.enabled_;
};
goog.provide("goog.module.BaseModule");
goog.require("goog.Disposable");
goog.require("goog.module");
goog.module.BaseModule = function() {
  goog.Disposable.call(this);
};
goog.inherits(goog.module.BaseModule, goog.Disposable);
goog.module.BaseModule.prototype.initialize = function(context) {
};
goog.provide("goog.debug.errorHandlerWeakDep");
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(fn, opt_tracers) {
  return fn;
}};
goog.provide("goog.module.ModuleLoadCallback");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.debug.errorHandlerWeakDep");
goog.require("goog.module");
goog.module.ModuleLoadCallback = function(fn, opt_handler) {
  this.fn_ = fn;
  this.handler_ = opt_handler;
};
goog.module.ModuleLoadCallback.prototype.execute = function(context) {
  if (this.fn_) {
    this.fn_.call(this.handler_ || null, context);
    this.handler_ = null;
    this.fn_ = null;
  }
};
goog.module.ModuleLoadCallback.prototype.abort = function() {
  this.fn_ = null;
  this.handler_ = null;
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.module.ModuleLoadCallback.prototype.execute = transformer(goog.module.ModuleLoadCallback.prototype.execute);
});
goog.provide("goog.module.ModuleInfo");
goog.require("goog.Disposable");
goog.require("goog.async.throwException");
goog.require("goog.functions");
goog.require("goog.module");
goog.require("goog.module.BaseModule");
goog.require("goog.module.ModuleLoadCallback");
goog.module.ModuleInfo = function(deps, id) {
  goog.Disposable.call(this);
  this.deps_ = deps;
  this.id_ = id;
  this.onloadCallbacks_ = [];
  this.onErrorCallbacks_ = [];
  this.earlyOnloadCallbacks_ = [];
};
goog.inherits(goog.module.ModuleInfo, goog.Disposable);
goog.module.ModuleInfo.prototype.uris_ = null;
goog.module.ModuleInfo.prototype.moduleConstructor_ = goog.module.BaseModule;
goog.module.ModuleInfo.prototype.module_ = null;
goog.module.ModuleInfo.prototype.getDependencies = function() {
  return this.deps_;
};
goog.module.ModuleInfo.prototype.getId = function() {
  return this.id_;
};
goog.module.ModuleInfo.prototype.setUris = function(uris) {
  this.uris_ = uris;
};
goog.module.ModuleInfo.prototype.getUris = function() {
  return this.uris_;
};
goog.module.ModuleInfo.prototype.setModuleConstructor = function(constructor) {
  if (this.moduleConstructor_ === goog.module.BaseModule) {
    this.moduleConstructor_ = constructor;
  } else {
    throw Error("Cannot set module constructor more than once.");
  }
};
goog.module.ModuleInfo.prototype.registerEarlyCallback = function(fn, opt_handler) {
  return this.registerCallback_(this.earlyOnloadCallbacks_, fn, opt_handler);
};
goog.module.ModuleInfo.prototype.registerCallback = function(fn, opt_handler) {
  return this.registerCallback_(this.onloadCallbacks_, fn, opt_handler);
};
goog.module.ModuleInfo.prototype.registerErrback = function(fn, opt_handler) {
  return this.registerCallback_(this.onErrorCallbacks_, fn, opt_handler);
};
goog.module.ModuleInfo.prototype.registerCallback_ = function(callbacks, fn, opt_handler) {
  var callback = new goog.module.ModuleLoadCallback(fn, opt_handler);
  callbacks.push(callback);
  return callback;
};
goog.module.ModuleInfo.prototype.isLoaded = function() {
  return!!this.module_;
};
goog.module.ModuleInfo.prototype.getModule = function() {
  return this.module_;
};
goog.module.ModuleInfo.prototype.onLoad = function(contextProvider) {
  var module = new this.moduleConstructor_;
  module.initialize(contextProvider());
  this.module_ = module;
  var errors = !!this.callCallbacks_(this.earlyOnloadCallbacks_, contextProvider());
  errors = errors || !!this.callCallbacks_(this.onloadCallbacks_, contextProvider());
  if (!errors) {
    this.onErrorCallbacks_.length = 0;
  }
  return errors;
};
goog.module.ModuleInfo.prototype.onError = function(cause) {
  var result = this.callCallbacks_(this.onErrorCallbacks_, cause);
  if (result) {
    window.setTimeout(goog.functions.error("Module errback failures: " + result), 0);
  }
  this.earlyOnloadCallbacks_.length = 0;
  this.onloadCallbacks_.length = 0;
};
goog.module.ModuleInfo.prototype.callCallbacks_ = function(callbacks, context) {
  var errors = [];
  for (var i = 0;i < callbacks.length;i++) {
    try {
      callbacks[i].execute(context);
    } catch (e) {
      goog.async.throwException(e);
      errors.push(e);
    }
  }
  callbacks.length = 0;
  return errors.length ? errors : null;
};
goog.module.ModuleInfo.prototype.disposeInternal = function() {
  goog.module.ModuleInfo.superClass_.disposeInternal.call(this);
  goog.dispose(this.module_);
};
goog.provide("goog.structs.SimplePool");
goog.require("goog.Disposable");
goog.structs.SimplePool = function(initialCount, maxCount) {
  goog.Disposable.call(this);
  this.createObjectFn_ = null;
  this.disposeObjectFn_ = null;
  this.maxCount_ = maxCount;
  this.freeQueue_ = [];
  this.createInitial_(initialCount);
};
goog.inherits(goog.structs.SimplePool, goog.Disposable);
goog.structs.SimplePool.prototype.setCreateObjectFn = function(createObjectFn) {
  this.createObjectFn_ = createObjectFn;
};
goog.structs.SimplePool.prototype.setDisposeObjectFn = function(disposeObjectFn) {
  this.disposeObjectFn_ = disposeObjectFn;
};
goog.structs.SimplePool.prototype.getObject = function() {
  if (this.freeQueue_.length) {
    return this.freeQueue_.pop();
  }
  return this.createObject();
};
goog.structs.SimplePool.prototype.releaseObject = function(obj) {
  if (this.freeQueue_.length < this.maxCount_) {
    this.freeQueue_.push(obj);
  } else {
    this.disposeObject(obj);
  }
};
goog.structs.SimplePool.prototype.createInitial_ = function(initialCount) {
  if (initialCount > this.maxCount_) {
    throw Error("[goog.structs.SimplePool] Initial cannot be greater than max");
  }
  for (var i = 0;i < initialCount;i++) {
    this.freeQueue_.push(this.createObject());
  }
};
goog.structs.SimplePool.prototype.createObject = function() {
  if (this.createObjectFn_) {
    return this.createObjectFn_();
  } else {
    return{};
  }
};
goog.structs.SimplePool.prototype.disposeObject = function(obj) {
  if (this.disposeObjectFn_) {
    this.disposeObjectFn_(obj);
  } else {
    if (goog.isObject(obj)) {
      if (goog.isFunction(obj.dispose)) {
        obj.dispose();
      } else {
        for (var i in obj) {
          delete obj[i];
        }
      }
    }
  }
};
goog.structs.SimplePool.prototype.disposeInternal = function() {
  goog.structs.SimplePool.superClass_.disposeInternal.call(this);
  var freeQueue = this.freeQueue_;
  while (freeQueue.length) {
    this.disposeObject(freeQueue.pop());
  }
  delete this.freeQueue_;
};
goog.provide("goog.debug.Trace");
goog.require("goog.array");
goog.require("goog.debug.Logger");
goog.require("goog.iter");
goog.require("goog.log");
goog.require("goog.structs.Map");
goog.require("goog.structs.SimplePool");
goog.debug.Trace_ = function() {
  this.events_ = [];
  this.outstandingEvents_ = new goog.structs.Map;
  this.startTime_ = 0;
  this.tracerOverheadStart_ = 0;
  this.tracerOverheadEnd_ = 0;
  this.tracerOverheadComment_ = 0;
  this.stats_ = new goog.structs.Map;
  this.tracerCount_ = 0;
  this.commentCount_ = 0;
  this.nextId_ = 1;
  this.eventPool_ = new goog.structs.SimplePool(0, 4E3);
  this.eventPool_.createObject = function() {
    return new goog.debug.Trace_.Event_;
  };
  this.statPool_ = new goog.structs.SimplePool(0, 50);
  this.statPool_.createObject = function() {
    return new goog.debug.Trace_.Stat_;
  };
  var that = this;
  this.idPool_ = new goog.structs.SimplePool(0, 2E3);
  this.idPool_.createObject = function() {
    return String(that.nextId_++);
  };
  this.idPool_.disposeObject = function(obj) {
  };
  this.defaultThreshold_ = 3;
};
goog.debug.Trace_.prototype.logger_ = goog.log.getLogger("goog.debug.Trace");
goog.debug.Trace_.prototype.MAX_TRACE_SIZE = 1E3;
goog.debug.Trace_.EventType = {START:0, STOP:1, COMMENT:2};
goog.debug.Trace_.Stat_ = function() {
  this.count = 0;
  this.time = 0;
  this.varAlloc = 0;
};
goog.debug.Trace_.Stat_.prototype.type;
goog.debug.Trace_.Stat_.prototype.toString = function() {
  var sb = [];
  sb.push(this.type, " ", this.count, " (", Math.round(this.time * 10) / 10, " ms)");
  if (this.varAlloc) {
    sb.push(" [VarAlloc = ", this.varAlloc, "]");
  }
  return sb.join("");
};
goog.debug.Trace_.Event_ = function() {
};
goog.debug.Trace_.Event_.prototype.type;
goog.debug.Trace_.Event_.prototype.toTraceString = function(startTime, prevTime, indent) {
  var sb = [];
  if (prevTime == -1) {
    sb.push("    ");
  } else {
    sb.push(goog.debug.Trace_.longToPaddedString_(this.eventTime - prevTime));
  }
  sb.push(" ", goog.debug.Trace_.formatTime_(this.eventTime - startTime));
  if (this.eventType == goog.debug.Trace_.EventType.START) {
    sb.push(" Start        ");
  } else {
    if (this.eventType == goog.debug.Trace_.EventType.STOP) {
      sb.push(" Done ");
      var delta = this.stopTime - this.startTime;
      sb.push(goog.debug.Trace_.longToPaddedString_(delta), " ms ");
    } else {
      sb.push(" Comment      ");
    }
  }
  sb.push(indent, this);
  if (this.totalVarAlloc > 0) {
    sb.push("[VarAlloc ", this.totalVarAlloc, "] ");
  }
  return sb.join("");
};
goog.debug.Trace_.Event_.prototype.toString = function() {
  if (this.type == null) {
    return this.comment;
  } else {
    return "[" + this.type + "] " + this.comment;
  }
};
goog.debug.Trace_.prototype.setStartTime = function(startTime) {
  this.startTime_ = startTime;
};
goog.debug.Trace_.prototype.initCurrentTrace = function(defaultThreshold) {
  this.reset(defaultThreshold);
};
goog.debug.Trace_.prototype.clearCurrentTrace = function() {
  this.reset(0);
};
goog.debug.Trace_.prototype.reset = function(defaultThreshold) {
  this.defaultThreshold_ = defaultThreshold;
  for (var i = 0;i < this.events_.length;i++) {
    var id = (this.eventPool_).id;
    if (id) {
      this.idPool_.releaseObject(id);
    }
    this.eventPool_.releaseObject(this.events_[i]);
  }
  this.events_.length = 0;
  this.outstandingEvents_.clear();
  this.startTime_ = goog.debug.Trace_.now();
  this.tracerOverheadStart_ = 0;
  this.tracerOverheadEnd_ = 0;
  this.tracerOverheadComment_ = 0;
  this.tracerCount_ = 0;
  this.commentCount_ = 0;
  var keys = this.stats_.getKeys();
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var stat = this.stats_.get(key);
    stat.count = 0;
    stat.time = 0;
    stat.varAlloc = 0;
    this.statPool_.releaseObject((stat));
  }
  this.stats_.clear();
};
goog.debug.Trace_.prototype.startTracer = function(comment, opt_type) {
  var tracerStartTime = goog.debug.Trace_.now();
  var varAlloc = this.getTotalVarAlloc();
  var outstandingEventCount = this.outstandingEvents_.getCount();
  if (this.events_.length + outstandingEventCount > this.MAX_TRACE_SIZE) {
    goog.log.warning(this.logger_, "Giant thread trace. Clearing to avoid memory leak.");
    if (this.events_.length > this.MAX_TRACE_SIZE / 2) {
      for (var i = 0;i < this.events_.length;i++) {
        var event = this.events_[i];
        if (event.id) {
          this.idPool_.releaseObject(event.id);
        }
        this.eventPool_.releaseObject(event);
      }
      this.events_.length = 0;
    }
    if (outstandingEventCount > this.MAX_TRACE_SIZE / 2) {
      this.outstandingEvents_.clear();
    }
  }
  goog.debug.Logger.logToProfilers("Start : " + comment);
  var event = (this.eventPool_.getObject());
  event.totalVarAlloc = varAlloc;
  event.eventType = goog.debug.Trace_.EventType.START;
  event.id = Number(this.idPool_.getObject());
  event.comment = comment;
  event.type = opt_type;
  this.events_.push(event);
  this.outstandingEvents_.set(String(event.id), event);
  this.tracerCount_++;
  var now = goog.debug.Trace_.now();
  event.startTime = event.eventTime = now;
  this.tracerOverheadStart_ += now - tracerStartTime;
  return event.id;
};
goog.debug.Trace_.prototype.stopTracer = function(id, opt_silenceThreshold) {
  var now = goog.debug.Trace_.now();
  var silenceThreshold;
  if (opt_silenceThreshold === 0) {
    silenceThreshold = 0;
  } else {
    if (opt_silenceThreshold) {
      silenceThreshold = opt_silenceThreshold;
    } else {
      silenceThreshold = this.defaultThreshold_;
    }
  }
  var startEvent = this.outstandingEvents_.get(String(id));
  if (startEvent == null) {
    return null;
  }
  this.outstandingEvents_.remove(String(id));
  var stopEvent;
  var elapsed = now - startEvent.startTime;
  if (elapsed < silenceThreshold) {
    var count = this.events_.length;
    for (var i = count - 1;i >= 0;i--) {
      var nextEvent = this.events_[i];
      if (nextEvent == startEvent) {
        this.events_.splice(i, 1);
        this.idPool_.releaseObject(startEvent.id);
        this.eventPool_.releaseObject((startEvent));
        break;
      }
    }
  } else {
    stopEvent = (this.eventPool_.getObject());
    stopEvent.eventType = goog.debug.Trace_.EventType.STOP;
    stopEvent.startTime = startEvent.startTime;
    stopEvent.comment = startEvent.comment;
    stopEvent.type = startEvent.type;
    stopEvent.stopTime = stopEvent.eventTime = now;
    this.events_.push(stopEvent);
  }
  var type = startEvent.type;
  var stat = null;
  if (type) {
    stat = this.getStat_(type);
    stat.count++;
    stat.time += elapsed;
  }
  if (stopEvent) {
    goog.debug.Logger.logToProfilers("Stop : " + stopEvent.comment);
    stopEvent.totalVarAlloc = this.getTotalVarAlloc();
    if (stat) {
      stat.varAlloc += stopEvent.totalVarAlloc - startEvent.totalVarAlloc;
    }
  }
  var tracerFinishTime = goog.debug.Trace_.now();
  this.tracerOverheadEnd_ += tracerFinishTime - now;
  return elapsed;
};
goog.debug.Trace_.prototype.setGcTracer = function(gcTracer) {
  this.gcTracer_ = gcTracer;
};
goog.debug.Trace_.prototype.getTotalVarAlloc = function() {
  var gcTracer = this.gcTracer_;
  if (gcTracer && gcTracer["isTracing"]()) {
    return gcTracer["totalVarAlloc"];
  }
  return-1;
};
goog.debug.Trace_.prototype.addComment = function(comment, opt_type, opt_timeStamp) {
  var now = goog.debug.Trace_.now();
  var timeStamp = opt_timeStamp ? opt_timeStamp : now;
  var eventComment = (this.eventPool_.getObject());
  eventComment.eventType = goog.debug.Trace_.EventType.COMMENT;
  eventComment.eventTime = timeStamp;
  eventComment.type = opt_type;
  eventComment.comment = comment;
  eventComment.totalVarAlloc = this.getTotalVarAlloc();
  this.commentCount_++;
  if (opt_timeStamp) {
    var numEvents = this.events_.length;
    for (var i = 0;i < numEvents;i++) {
      var event = this.events_[i];
      var eventTime = event.eventTime;
      if (eventTime > timeStamp) {
        goog.array.insertAt(this.events_, eventComment, i);
        break;
      }
    }
    if (i == numEvents) {
      this.events_.push(eventComment);
    }
  } else {
    this.events_.push(eventComment);
  }
  var type = eventComment.type;
  if (type) {
    var stat = this.getStat_(type);
    stat.count++;
  }
  this.tracerOverheadComment_ += goog.debug.Trace_.now() - now;
};
goog.debug.Trace_.prototype.getStat_ = function(type) {
  var stat = this.stats_.get(type);
  if (!stat) {
    stat = (this.statPool_.getObject());
    stat.type = type;
    this.stats_.set(type, stat);
  }
  return(stat);
};
goog.debug.Trace_.prototype.getFormattedTrace = function() {
  return this.toString();
};
goog.debug.Trace_.prototype.toString = function() {
  var sb = [];
  var etime = -1;
  var indent = [];
  for (var i = 0;i < this.events_.length;i++) {
    var e = this.events_[i];
    if (e.eventType == goog.debug.Trace_.EventType.STOP) {
      indent.pop();
    }
    sb.push(" ", e.toTraceString(this.startTime_, etime, indent.join("")));
    etime = e.eventTime;
    sb.push("\n");
    if (e.eventType == goog.debug.Trace_.EventType.START) {
      indent.push("|  ");
    }
  }
  if (this.outstandingEvents_.getCount() != 0) {
    var now = goog.debug.Trace_.now();
    sb.push(" Unstopped timers:\n");
    goog.iter.forEach(this.outstandingEvents_, function(startEvent) {
      sb.push("  ", startEvent, " (", now - startEvent.startTime, " ms, started at ", goog.debug.Trace_.formatTime_(startEvent.startTime), ")\n");
    });
  }
  var statKeys = this.stats_.getKeys();
  for (var i = 0;i < statKeys.length;i++) {
    var stat = this.stats_.get(statKeys[i]);
    if (stat.count > 1) {
      sb.push(" TOTAL ", stat, "\n");
    }
  }
  sb.push("Total tracers created ", this.tracerCount_, "\n", "Total comments created ", this.commentCount_, "\n", "Overhead start: ", this.tracerOverheadStart_, " ms\n", "Overhead end: ", this.tracerOverheadEnd_, " ms\n", "Overhead comment: ", this.tracerOverheadComment_, " ms\n");
  return sb.join("");
};
goog.debug.Trace_.longToPaddedString_ = function(v) {
  v = Math.round(v);
  var space = "";
  if (v < 1E3) {
    space = " ";
  }
  if (v < 100) {
    space = "  ";
  }
  if (v < 10) {
    space = "   ";
  }
  return space + v;
};
goog.debug.Trace_.formatTime_ = function(time) {
  time = Math.round(time);
  var sec = time / 1E3 % 60;
  var ms = time % 1E3;
  return String(100 + sec).substring(1, 3) + "." + String(1E3 + ms).substring(1, 4);
};
goog.debug.Trace_.now = function() {
  return goog.now();
};
goog.debug.Trace = new goog.debug.Trace_;
goog.provide("goog.module.ModuleManager");
goog.provide("goog.module.ModuleManager.CallbackType");
goog.provide("goog.module.ModuleManager.FailureType");
goog.require("goog.Disposable");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.async.Deferred");
goog.require("goog.debug.Trace");
goog.require("goog.dispose");
goog.require("goog.log");
goog.require("goog.module");
goog.require("goog.module.ModuleInfo");
goog.require("goog.module.ModuleLoadCallback");
goog.require("goog.object");
goog.module.ModuleManager = function() {
  goog.module.ModuleManager.base(this, "constructor");
  this.moduleInfoMap_ = {};
  this.loadingModuleIds_ = [];
  this.requestedLoadingModuleIds_ = [];
  this.requestedModuleIds_ = [];
  this.requestedModuleIdsQueue_ = [];
  this.userInitiatedLoadingModuleIds_ = [];
  this.callbackMap_ = {};
  this.baseModuleInfo_ = new goog.module.ModuleInfo([], "");
  this.currentlyLoadingModule_ = this.baseModuleInfo_;
  this.lastInitialModuleId_ = null;
  this.initialModulesLoaded_ = new goog.async.Deferred;
  this.logger_ = goog.log.getLogger("goog.module.ModuleManager");
  this.batchModeEnabled_ = false;
  this.concurrentLoadingEnabled_ = false;
  this.loader_ = null;
  this.loadTracer_ = null;
  this.consecutiveFailures_ = 0;
  this.lastActive_ = false;
  this.userLastActive_ = false;
  this.moduleContext_ = null;
};
goog.inherits(goog.module.ModuleManager, goog.Disposable);
goog.addSingletonGetter(goog.module.ModuleManager);
goog.module.ModuleManager.CallbackType = {ERROR:"error", IDLE:"idle", ACTIVE:"active", USER_IDLE:"userIdle", USER_ACTIVE:"userActive"};
goog.module.ModuleManager.CORRUPT_RESPONSE_STATUS_CODE = 8001;
goog.module.ModuleManager.prototype.setBatchModeEnabled = function(enabled) {
  this.batchModeEnabled_ = enabled;
};
goog.module.ModuleManager.prototype.setConcurrentLoadingEnabled = function(enabled) {
  this.concurrentLoadingEnabled_ = enabled;
};
goog.module.ModuleManager.prototype.setAllModuleInfo = function(infoMap) {
  for (var id in infoMap) {
    this.moduleInfoMap_[id] = new goog.module.ModuleInfo(infoMap[id], id);
  }
  if (!this.initialModulesLoaded_.hasFired()) {
    this.initialModulesLoaded_.callback();
  }
  this.maybeFinishBaseLoad_();
};
goog.module.ModuleManager.prototype.setAllModuleInfoString = function(opt_info, opt_loadingModuleIds) {
  if (!goog.isString(opt_info)) {
    return;
  }
  var modules = opt_info.split("/");
  var moduleIds = [];
  for (var i = 0;i < modules.length;i++) {
    var parts = modules[i].split(":");
    var id = parts[0];
    var deps;
    if (parts[1]) {
      deps = parts[1].split(",");
      for (var j = 0;j < deps.length;j++) {
        var index = parseInt(deps[j], 36);
        goog.asserts.assert(moduleIds[index], "No module @ %s, dep of %s @ %s", index, id, i);
        deps[j] = moduleIds[index];
      }
    } else {
      deps = [];
    }
    moduleIds.push(id);
    this.moduleInfoMap_[id] = new goog.module.ModuleInfo(deps, id);
  }
  if (opt_loadingModuleIds && opt_loadingModuleIds.length) {
    goog.array.extend(this.loadingModuleIds_, opt_loadingModuleIds);
    this.lastInitialModuleId_ = (goog.array.peek(opt_loadingModuleIds));
  } else {
    if (!this.initialModulesLoaded_.hasFired()) {
      this.initialModulesLoaded_.callback();
    }
  }
  this.maybeFinishBaseLoad_();
};
goog.module.ModuleManager.prototype.getModuleInfo = function(id) {
  return this.moduleInfoMap_[id];
};
goog.module.ModuleManager.prototype.setModuleUris = function(moduleUriMap) {
  for (var id in moduleUriMap) {
    this.moduleInfoMap_[id].setUris(moduleUriMap[id]);
  }
};
goog.module.ModuleManager.prototype.getLoader = function() {
  return this.loader_;
};
goog.module.ModuleManager.prototype.setLoader = function(loader) {
  this.loader_ = loader;
};
goog.module.ModuleManager.prototype.getModuleContext = function() {
  return this.moduleContext_;
};
goog.module.ModuleManager.prototype.setModuleContext = function(context) {
  this.moduleContext_ = context;
  this.maybeFinishBaseLoad_();
};
goog.module.ModuleManager.prototype.isActive = function() {
  return this.loadingModuleIds_.length > 0;
};
goog.module.ModuleManager.prototype.isUserActive = function() {
  return this.userInitiatedLoadingModuleIds_.length > 0;
};
goog.module.ModuleManager.prototype.dispatchActiveIdleChangeIfNeeded_ = function() {
  var lastActive = this.lastActive_;
  var active = this.isActive();
  if (active != lastActive) {
    this.executeCallbacks_(active ? goog.module.ModuleManager.CallbackType.ACTIVE : goog.module.ModuleManager.CallbackType.IDLE);
    this.lastActive_ = active;
  }
  var userLastActive = this.userLastActive_;
  var userActive = this.isUserActive();
  if (userActive != userLastActive) {
    this.executeCallbacks_(userActive ? goog.module.ModuleManager.CallbackType.USER_ACTIVE : goog.module.ModuleManager.CallbackType.USER_IDLE);
    this.userLastActive_ = userActive;
  }
};
goog.module.ModuleManager.prototype.preloadModule = function(id, opt_timeout) {
  var d = new goog.async.Deferred;
  window.setTimeout(goog.bind(this.addLoadModule_, this, id, d), opt_timeout || 0);
  return d;
};
goog.module.ModuleManager.prototype.prefetchModule = function(id) {
  var moduleInfo = this.getModuleInfo(id);
  if (moduleInfo.isLoaded() || this.isModuleLoading(id)) {
    throw Error("Module load already requested: " + id);
  } else {
    if (this.batchModeEnabled_) {
      throw Error("Modules prefetching is not supported in batch mode");
    } else {
      var idWithDeps = this.getNotYetLoadedTransitiveDepIds_(id);
      for (var i = 0;i < idWithDeps.length;i++) {
        this.loader_.prefetchModule(idWithDeps[i], this.moduleInfoMap_[idWithDeps[i]]);
      }
    }
  }
};
goog.module.ModuleManager.prototype.addLoadModule_ = function(id, d) {
  var moduleInfo = this.getModuleInfo(id);
  if (moduleInfo.isLoaded()) {
    d.callback(this.moduleContext_);
    return;
  }
  this.registerModuleLoadCallbacks_(id, moduleInfo, false, d);
  if (!this.isModuleLoading(id)) {
    this.loadModulesOrEnqueue_([id]);
  }
};
goog.module.ModuleManager.prototype.loadModulesOrEnqueueIfNotLoadedOrLoading_ = function(ids, opt_userInitiated) {
  var uniqueIds = [];
  goog.array.removeDuplicates(ids, uniqueIds);
  var idsToLoad = [];
  var deferredMap = {};
  for (var i = 0;i < uniqueIds.length;i++) {
    var id = uniqueIds[i];
    var moduleInfo = this.getModuleInfo(id);
    if (!moduleInfo) {
      throw new Error("Unknown module: " + id);
    }
    var d = new goog.async.Deferred;
    deferredMap[id] = d;
    if (moduleInfo.isLoaded()) {
      d.callback(this.moduleContext_);
    } else {
      this.registerModuleLoadCallbacks_(id, moduleInfo, !!opt_userInitiated, d);
      if (!this.isModuleLoading(id)) {
        idsToLoad.push(id);
      }
    }
  }
  if (idsToLoad.length > 0) {
    this.loadModulesOrEnqueue_(idsToLoad);
  }
  return deferredMap;
};
goog.module.ModuleManager.prototype.registerModuleLoadCallbacks_ = function(id, moduleInfo, userInitiated, d) {
  moduleInfo.registerCallback(d.callback, d);
  moduleInfo.registerErrback(function(err) {
    d.errback(Error(err));
  });
  if (this.isModuleLoading(id)) {
    if (userInitiated) {
      goog.log.info(this.logger_, "User initiated module already loading: " + id);
      this.addUserInitiatedLoadingModule_(id);
      this.dispatchActiveIdleChangeIfNeeded_();
    }
  } else {
    if (userInitiated) {
      goog.log.info(this.logger_, "User initiated module load: " + id);
      this.addUserInitiatedLoadingModule_(id);
    } else {
      goog.log.info(this.logger_, "Initiating module load: " + id);
    }
  }
};
goog.module.ModuleManager.prototype.loadModulesOrEnqueue_ = function(ids) {
  if (this.concurrentLoadingEnabled_) {
    this.initialModulesLoaded_.addCallback(goog.bind(this.loadModules_, this, ids));
  } else {
    if (goog.array.isEmpty(this.loadingModuleIds_)) {
      this.loadModules_(ids);
    } else {
      this.requestedModuleIdsQueue_.push(ids);
      this.dispatchActiveIdleChangeIfNeeded_();
    }
  }
};
goog.module.ModuleManager.prototype.getBackOff_ = function() {
  return Math.pow(this.consecutiveFailures_, 2) * 5E3;
};
goog.module.ModuleManager.prototype.loadModules_ = function(ids, opt_isRetry, opt_forceReload) {
  if (!opt_isRetry) {
    this.consecutiveFailures_ = 0;
  }
  var idsToLoadImmediately = this.processModulesForLoad_(ids);
  goog.log.info(this.logger_, "Loading module(s): " + idsToLoadImmediately);
  this.loadingModuleIds_ = idsToLoadImmediately;
  if (this.batchModeEnabled_) {
    this.requestedLoadingModuleIds_ = ids;
  } else {
    this.requestedLoadingModuleIds_ = goog.array.clone(idsToLoadImmediately);
  }
  this.dispatchActiveIdleChangeIfNeeded_();
  if (goog.array.isEmpty(idsToLoadImmediately)) {
    return;
  }
  this.requestedModuleIds_.push.apply(this.requestedModuleIds_, idsToLoadImmediately);
  var loadFn = goog.bind(this.loader_.loadModules, this.loader_, goog.array.clone(idsToLoadImmediately), this.moduleInfoMap_, null, goog.bind(this.handleLoadError_, this, this.requestedLoadingModuleIds_, idsToLoadImmediately), goog.bind(this.handleLoadTimeout_, this), !!opt_forceReload);
  var delay = this.getBackOff_();
  if (delay) {
    window.setTimeout(loadFn, delay);
  } else {
    loadFn();
  }
};
goog.module.ModuleManager.prototype.processModulesForLoad_ = function(ids) {
  for (var i = 0;i < ids.length;i++) {
    var moduleInfo = this.moduleInfoMap_[ids[i]];
    if (moduleInfo.isLoaded()) {
      throw Error("Module already loaded: " + ids[i]);
    }
  }
  var idsWithDeps = [];
  for (var i = 0;i < ids.length;i++) {
    idsWithDeps = idsWithDeps.concat(this.getNotYetLoadedTransitiveDepIds_(ids[i]));
  }
  goog.array.removeDuplicates(idsWithDeps);
  if (!this.batchModeEnabled_ && idsWithDeps.length > 1) {
    var idToLoad = idsWithDeps.shift();
    goog.log.info(this.logger_, "Must load " + idToLoad + " module before " + ids);
    var queuedModules = goog.array.map(idsWithDeps, function(id) {
      return[id];
    });
    this.requestedModuleIdsQueue_ = queuedModules.concat(this.requestedModuleIdsQueue_);
    return[idToLoad];
  } else {
    return idsWithDeps;
  }
};
goog.module.ModuleManager.prototype.getNotYetLoadedTransitiveDepIds_ = function(id) {
  var ids = [];
  if (!goog.array.contains(this.requestedModuleIds_, id)) {
    ids.push(id);
  }
  var depIds = goog.array.clone(this.getModuleInfo(id).getDependencies());
  while (depIds.length) {
    var depId = depIds.pop();
    if (!this.getModuleInfo(depId).isLoaded() && !goog.array.contains(this.requestedModuleIds_, depId)) {
      ids.unshift(depId);
      Array.prototype.unshift.apply(depIds, this.getModuleInfo(depId).getDependencies());
    }
  }
  goog.array.removeDuplicates(ids);
  return ids;
};
goog.module.ModuleManager.prototype.maybeFinishBaseLoad_ = function() {
  if (this.currentlyLoadingModule_ == this.baseModuleInfo_) {
    this.currentlyLoadingModule_ = null;
    var error = this.baseModuleInfo_.onLoad(goog.bind(this.getModuleContext, this));
    if (error) {
      this.dispatchModuleLoadFailed_(goog.module.ModuleManager.FailureType.INIT_ERROR);
    }
    this.dispatchActiveIdleChangeIfNeeded_();
  }
};
goog.module.ModuleManager.prototype.setLoaded = function(id) {
  if (this.isDisposed()) {
    goog.log.warning(this.logger_, "Module loaded after module manager was disposed: " + id);
    return;
  }
  goog.log.info(this.logger_, "Module loaded: " + id);
  var error = this.moduleInfoMap_[id].onLoad(goog.bind(this.getModuleContext, this));
  if (error) {
    this.dispatchModuleLoadFailed_(goog.module.ModuleManager.FailureType.INIT_ERROR);
  }
  goog.array.remove(this.userInitiatedLoadingModuleIds_, id);
  goog.array.remove(this.loadingModuleIds_, id);
  if (goog.array.isEmpty(this.loadingModuleIds_)) {
    this.loadNextModules_();
  }
  if (this.lastInitialModuleId_ && id == this.lastInitialModuleId_) {
    if (!this.initialModulesLoaded_.hasFired()) {
      this.initialModulesLoaded_.callback();
    }
  }
  this.dispatchActiveIdleChangeIfNeeded_();
};
goog.module.ModuleManager.prototype.isModuleLoading = function(id) {
  if (goog.array.contains(this.loadingModuleIds_, id)) {
    return true;
  }
  for (var i = 0;i < this.requestedModuleIdsQueue_.length;i++) {
    if (goog.array.contains(this.requestedModuleIdsQueue_[i], id)) {
      return true;
    }
  }
  return false;
};
goog.module.ModuleManager.prototype.execOnLoad = function(moduleId, fn, opt_handler, opt_noLoad, opt_userInitiated, opt_preferSynchronous) {
  var moduleInfo = this.moduleInfoMap_[moduleId];
  var callbackWrapper;
  if (moduleInfo.isLoaded()) {
    goog.log.info(this.logger_, moduleId + " module already loaded");
    callbackWrapper = new goog.module.ModuleLoadCallback(fn, opt_handler);
    if (opt_preferSynchronous) {
      callbackWrapper.execute(this.moduleContext_);
    } else {
      window.setTimeout(goog.bind(callbackWrapper.execute, callbackWrapper), 0);
    }
  } else {
    if (this.isModuleLoading(moduleId)) {
      goog.log.info(this.logger_, moduleId + " module already loading");
      callbackWrapper = moduleInfo.registerCallback(fn, opt_handler);
      if (opt_userInitiated) {
        goog.log.info(this.logger_, "User initiated module already loading: " + moduleId);
        this.addUserInitiatedLoadingModule_(moduleId);
        this.dispatchActiveIdleChangeIfNeeded_();
      }
    } else {
      goog.log.info(this.logger_, "Registering callback for module: " + moduleId);
      callbackWrapper = moduleInfo.registerCallback(fn, opt_handler);
      if (!opt_noLoad) {
        if (opt_userInitiated) {
          goog.log.info(this.logger_, "User initiated module load: " + moduleId);
          this.addUserInitiatedLoadingModule_(moduleId);
        }
        goog.log.info(this.logger_, "Initiating module load: " + moduleId);
        this.loadModulesOrEnqueue_([moduleId]);
      }
    }
  }
  return callbackWrapper;
};
goog.module.ModuleManager.prototype.load = function(moduleId, opt_userInitiated) {
  return this.loadModulesOrEnqueueIfNotLoadedOrLoading_([moduleId], opt_userInitiated)[moduleId];
};
goog.module.ModuleManager.prototype.loadMultiple = function(moduleIds, opt_userInitiated) {
  return this.loadModulesOrEnqueueIfNotLoadedOrLoading_(moduleIds, opt_userInitiated);
};
goog.module.ModuleManager.prototype.addUserInitiatedLoadingModule_ = function(id) {
  if (!goog.array.contains(this.userInitiatedLoadingModuleIds_, id)) {
    this.userInitiatedLoadingModuleIds_.push(id);
  }
};
goog.module.ModuleManager.prototype.beforeLoadModuleCode = function(id) {
  this.loadTracer_ = goog.debug.Trace.startTracer("Module Load: " + id, "Module Load");
  if (this.currentlyLoadingModule_) {
    goog.log.error(this.logger_, 'beforeLoadModuleCode called with module "' + id + '" while module "' + this.currentlyLoadingModule_.getId() + '" is loading');
  }
  this.currentlyLoadingModule_ = this.getModuleInfo(id);
};
goog.module.ModuleManager.prototype.afterLoadModuleCode = function(id) {
  if (!this.currentlyLoadingModule_ || id != this.currentlyLoadingModule_.getId()) {
    goog.log.error(this.logger_, 'afterLoadModuleCode called with module "' + id + '" while loading module "' + (this.currentlyLoadingModule_ && this.currentlyLoadingModule_.getId()) + '"');
  }
  this.currentlyLoadingModule_ = null;
  goog.debug.Trace.stopTracer(this.loadTracer_);
};
goog.module.ModuleManager.prototype.registerInitializationCallback = function(fn, opt_handler) {
  if (!this.currentlyLoadingModule_) {
    goog.log.error(this.logger_, "No module is currently loading");
  } else {
    this.currentlyLoadingModule_.registerEarlyCallback(fn, opt_handler);
  }
};
goog.module.ModuleManager.prototype.registerLateInitializationCallback = function(fn, opt_handler) {
  if (!this.currentlyLoadingModule_) {
    goog.log.error(this.logger_, "No module is currently loading");
  } else {
    this.currentlyLoadingModule_.registerCallback(fn, opt_handler);
  }
};
goog.module.ModuleManager.prototype.setModuleConstructor = function(fn) {
  if (!this.currentlyLoadingModule_) {
    goog.log.error(this.logger_, "No module is currently loading");
    return;
  }
  this.currentlyLoadingModule_.setModuleConstructor(fn);
};
goog.module.ModuleManager.FailureType = {UNAUTHORIZED:0, CONSECUTIVE_FAILURES:1, TIMEOUT:2, OLD_CODE_GONE:3, INIT_ERROR:4};
goog.module.ModuleManager.prototype.handleLoadError_ = function(requestedLoadingModuleIds, requestedModuleIdsWithDeps, status) {
  this.consecutiveFailures_++;
  this.requestedLoadingModuleIds_ = requestedLoadingModuleIds;
  goog.array.forEach(requestedModuleIdsWithDeps, goog.partial(goog.array.remove, this.requestedModuleIds_), this);
  if (status == 401) {
    goog.log.info(this.logger_, "Module loading unauthorized");
    this.dispatchModuleLoadFailed_(goog.module.ModuleManager.FailureType.UNAUTHORIZED);
    this.requestedModuleIdsQueue_.length = 0;
  } else {
    if (status == 410) {
      this.requeueBatchOrDispatchFailure_(goog.module.ModuleManager.FailureType.OLD_CODE_GONE);
      this.loadNextModules_();
    } else {
      if (this.consecutiveFailures_ >= 3) {
        goog.log.info(this.logger_, "Aborting after failure to load: " + this.loadingModuleIds_);
        this.requeueBatchOrDispatchFailure_(goog.module.ModuleManager.FailureType.CONSECUTIVE_FAILURES);
        this.loadNextModules_();
      } else {
        goog.log.info(this.logger_, "Retrying after failure to load: " + this.loadingModuleIds_);
        var forceReload = status == goog.module.ModuleManager.CORRUPT_RESPONSE_STATUS_CODE;
        this.loadModules_(this.requestedLoadingModuleIds_, true, forceReload);
      }
    }
  }
};
goog.module.ModuleManager.prototype.handleLoadTimeout_ = function() {
  goog.log.info(this.logger_, "Aborting after timeout: " + this.loadingModuleIds_);
  this.requeueBatchOrDispatchFailure_(goog.module.ModuleManager.FailureType.TIMEOUT);
  this.loadNextModules_();
};
goog.module.ModuleManager.prototype.requeueBatchOrDispatchFailure_ = function(cause) {
  if (this.requestedLoadingModuleIds_.length > 1) {
    var queuedModules = goog.array.map(this.requestedLoadingModuleIds_, function(id) {
      return[id];
    });
    this.requestedModuleIdsQueue_ = queuedModules.concat(this.requestedModuleIdsQueue_);
  } else {
    this.dispatchModuleLoadFailed_(cause);
  }
};
goog.module.ModuleManager.prototype.dispatchModuleLoadFailed_ = function(cause) {
  var failedIds = this.requestedLoadingModuleIds_;
  this.loadingModuleIds_.length = 0;
  var idsToCancel = [];
  for (var i = 0;i < this.requestedModuleIdsQueue_.length;i++) {
    var dependentModules = goog.array.filter(this.requestedModuleIdsQueue_[i], function(requestedId) {
      var requestedDeps = this.getNotYetLoadedTransitiveDepIds_(requestedId);
      return goog.array.some(failedIds, function(id) {
        return goog.array.contains(requestedDeps, id);
      });
    }, this);
    goog.array.extend(idsToCancel, dependentModules);
  }
  for (var i = 0;i < failedIds.length;i++) {
    goog.array.insert(idsToCancel, failedIds[i]);
  }
  for (var i = 0;i < idsToCancel.length;i++) {
    for (var j = 0;j < this.requestedModuleIdsQueue_.length;j++) {
      goog.array.remove(this.requestedModuleIdsQueue_[j], idsToCancel[i]);
    }
    goog.array.remove(this.userInitiatedLoadingModuleIds_, idsToCancel[i]);
  }
  var errorCallbacks = this.callbackMap_[goog.module.ModuleManager.CallbackType.ERROR];
  if (errorCallbacks) {
    for (var i = 0;i < errorCallbacks.length;i++) {
      var callback = errorCallbacks[i];
      for (var j = 0;j < idsToCancel.length;j++) {
        callback(goog.module.ModuleManager.CallbackType.ERROR, idsToCancel[j], cause);
      }
    }
  }
  for (var i = 0;i < failedIds.length;i++) {
    if (this.moduleInfoMap_[failedIds[i]]) {
      this.moduleInfoMap_[failedIds[i]].onError(cause);
    }
  }
  this.requestedLoadingModuleIds_.length = 0;
  this.dispatchActiveIdleChangeIfNeeded_();
};
goog.module.ModuleManager.prototype.loadNextModules_ = function() {
  while (this.requestedModuleIdsQueue_.length) {
    var nextIds = goog.array.filter(this.requestedModuleIdsQueue_.shift(), function(id) {
      return!this.getModuleInfo(id).isLoaded();
    }, this);
    if (nextIds.length > 0) {
      this.loadModules_(nextIds);
      return;
    }
  }
  this.dispatchActiveIdleChangeIfNeeded_();
};
goog.module.ModuleManager.prototype.registerCallback = function(types, fn) {
  if (!goog.isArray(types)) {
    types = [types];
  }
  for (var i = 0;i < types.length;i++) {
    this.registerCallback_(types[i], fn);
  }
};
goog.module.ModuleManager.prototype.registerCallback_ = function(type, fn) {
  var callbackMap = this.callbackMap_;
  if (!callbackMap[type]) {
    callbackMap[type] = [];
  }
  callbackMap[type].push(fn);
};
goog.module.ModuleManager.prototype.executeCallbacks_ = function(type) {
  var callbacks = this.callbackMap_[type];
  for (var i = 0;callbacks && i < callbacks.length;i++) {
    callbacks[i](type);
  }
};
goog.module.ModuleManager.prototype.disposeInternal = function() {
  goog.module.ModuleManager.base(this, "disposeInternal");
  goog.disposeAll(goog.object.getValues(this.moduleInfoMap_), this.baseModuleInfo_);
  this.moduleInfoMap_ = null;
  this.loadingModuleIds_ = null;
  this.requestedLoadingModuleIds_ = null;
  this.userInitiatedLoadingModuleIds_ = null;
  this.requestedModuleIdsQueue_ = null;
  this.callbackMap_ = null;
};
goog.provide("chatango.embed.Shell");
goog.require("chatango.embed.AppComm");
goog.require("chatango.embed.LocalCommChild");
goog.require("chatango.events.EventType");
goog.require("chatango.events.ResizeIframeEvent");
goog.require("chatango.events.EnableResizeDraggerEvent");
goog.require("chatango.events.ToggleUserScalingEvent");
goog.require("chatango.goog.Overrides");
goog.require("chatango.group.GroupEmbedTypes");
goog.require("chatango.group.moduleInfo");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.TitleManager");
goog.require("chatango.settings.Architecture");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.net.cookies");
goog.require("goog.module.ModuleLoader");
goog.require("goog.module.ModuleManager");
chatango.embed.Shell = function() {
  goog.events.EventTarget.call(this);
  this.console_;
  if (goog.DEBUG) {
    this.console_ = new goog.debug.Console;
    this.console_.setCapturing(true);
    var divConsole = false;
    if (divConsole) {
      this.debugDiv_ = goog.dom.createDom("div", {"id":"debug-console"});
      this.debugDiv_.style.position = "absolute";
      this.debugDiv_.style.top = "0";
      goog.dom.append(document.body, this.debugDiv_);
      this.divConsole_ = new goog.debug.DivConsole(this.debugDiv_);
      this.divConsole_.setCapturing(true);
    }
    goog.debug.Logger.getLogger("goog").setLevel(goog.debug.Logger.Level.OFF);
    goog.debug.Logger.getLogger("chatango.group.Group").setLevel(goog.debug.Logger.Level.ALL);
    goog.debug.Logger.getLogger("chatango.networking").setLevel(goog.debug.Logger.Level.ALL);
  }
  var module_loader = new goog.module.ModuleLoader;
  goog.module.ModuleManager.getInstance().setLoader(module_loader);
  goog.module.ModuleManager.getInstance().setAllModuleInfo(chatango.group.moduleInfo.MODULE_INFO);
  goog.module.ModuleManager.getInstance().setModuleUris(chatango.group.moduleInfo.MODULE_URIS);
  goog.module.ModuleManager.getInstance().setLoaded("shell");
  this.handler = new goog.events.EventHandler(this);
  var kb = chatango.managers.Keyboard.getInstance();
  var kbEvents = [chatango.managers.Keyboard.EventType.KEYBOARD_RAISED, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED];
  goog.events.listen(kb, kbEvents, this.onKeyboardEvent_, false, this);
  goog.events.listen(document, goog.events.EventType.TOUCHEND, function(e) {
    window.focus();
  }, false, this);
  goog.events.listen(chatango.managers.TitleManager.getInstance(), chatango.events.EventType.TITLE_CHANGE, this.onTitleSet_, false, this);
};
goog.inherits(chatango.embed.Shell, goog.events.EventTarget);
chatango.embed.Shell.prototype.startLocalComm = function(data) {
  this.lc_ = chatango.embed.LocalCommChild.getInstance();
  goog.events.listen(this.lc_, "cid", this.onCid_, false, this);
  goog.events.listen(this.lc_, "pageshow", this.onPageShow_, false, this);
  goog.events.listen(this.lc_, "browserviewresponse", this.onViewSizeResponse_, false, this);
  goog.events.listen(this.lc_, "resizedone", this.onResizeDoneResponse_, false, this);
  goog.events.listen(this.lc_, "orientation_change", this.onOrientationChange_, false, this);
  goog.events.listen(this.lc_, "zoomed", this.onZoomed_, false, this);
  goog.events.listen(this.lc_, "inittitle", this.onInitTitle_, false, this);
  goog.events.listen(this.lc_, "resizeondrag", this.onResizeOnDrag_, false, this);
  goog.events.listen(this.lc_, "kbdown", this.onKeyboardDown_, false, this);
  goog.events.listen(this.lc_, "openpm", this.onOpenPmEvent_, false, this);
  this.lc_.setUp(parent);
};
chatango.embed.Shell.prototype.setupAnalytics = function(ga) {
  ga("create", "UA-7965405-2", "auto");
};
chatango.embed.Shell.prototype.performAnalytics = function(ga) {
  var SAMPLING_RATE = .01;
  if (Math.round(Math.random() / SAMPLING_RATE) != 0) {
    return;
  }
  if (!this.groupData_) {
    goog.events.listen(this.lc_, "cid", function() {
      this.setAnalyticsDimensions_(ga);
    }, false, this);
  } else {
    this.setAnalyticsDimensions_(ga);
  }
};
chatango.embed.Shell.prototype.setAnalyticsDimensions_ = function() {
  var styleManager = chatango.managers.Style.getInstance();
  var embType = "";
  if (styleManager.getEmbedType() === chatango.group.GroupEmbedTypes.TAB) {
    embType = "tab";
  } else {
    if (styleManager.getEmbedType() === chatango.group.GroupEmbedTypes.BUTTON) {
      embType = "button";
    } else {
      embType = "box";
    }
  }
  if (embType !== "box" && this.groupData_["styles"]["ticker"]) {
    embType += "_ticker";
  }
  var loc = this.groupData_["loc"];
  try {
    loc = loc.split("/")[2].replace("www.", "");
  } catch (e) {
  }
  var dims = {"dimension1":this.groupData_["handle"], "dimension2":loc, "dimension3":embType, "dimension4":this.groupData_["loc"]};
  ga("send", "pageview", dims);
};
chatango.embed.Shell.prototype.onResizeDoneResponse_ = function(e) {
  this.g.iframeResizeDone(e.data);
};
chatango.embed.Shell.prototype.onResizeOnDrag_ = function(e) {
  this.g.iframeResizeOnDragDone(e.data);
};
chatango.embed.Shell.prototype.onViewSizeResponse_ = function(e) {
  this.g.browserViewDimensionsReceived(e.data);
};
chatango.embed.Shell.prototype.logger = goog.debug.Logger.getLogger("chatango.embed.Shell");
chatango.embed.Shell.prototype.onCid_ = function(e) {
  chatango.DEBUG = chatango.DEBUG || e.data["styles"] && e.data["styles"]["debug"] == 1 && console;
  if (chatango.DEBUG) {
    this.logger.info("cid received from the embed " + e.data["cid"]);
    this.logger.info("loc received from the embed " + e.data["loc"]);
  }
  if (e.data["styles"] && e.data["styles"]["pm"] && e.data["styles"]["pm"] == 1) {
    var pm = goog.module.ModuleManager.getInstance().getModuleInfo("PmModule");
    if (pm && pm.isLoaded()) {
      this.openPm_(e.data);
    } else {
      this.pmData_ = e.data;
      goog.module.ModuleManager.getInstance().execOnLoad("PmModule", this.openPm_, this);
    }
  } else {
    var gm = goog.module.ModuleManager.getInstance().getModuleInfo("Group");
    this.groupData_ = e.data;
    if (gm && gm.isLoaded()) {
      this.openGroup_(e.data);
    } else {
      goog.module.ModuleManager.getInstance().execOnLoad("Group", this.openGroup_, this);
    }
  }
};
chatango.embed.Shell.prototype.openGroup_ = function(data) {
  if (!data || data == undefined) {
    data = this.groupData_;
  }
  if (data["styles"] && data["styles"]["mockgroup"]) {
    this.g = new chatango.group.configurator.MockGroup(data);
  } else {
    this.g = new chatango.group.Group(data);
  }
  goog.events.listen(this.g, chatango.events.EventType.BUTTON_EXPANDED, this.onButtonExpanded_, false, this);
  goog.events.listen(this.g, chatango.events.EventType.GET_BROWSER_VIEW, this.onGetBrowserView_, false, this);
  goog.events.listen(this.g, chatango.events.EventType.RESIZE_IFRAME, this.onResizeIFrame_, false, this);
  goog.events.listen(this.g, chatango.events.EventType.BUTTON_COLLAPSED, this.onButtonCollapsed_, false, this);
  goog.events.listen(this.g, chatango.events.EventType.SET_USER_SCALING, this.onSetUserScaling_, false, this);
  goog.events.listen(this.g, chatango.events.EventType.VIEWPORT_TOO_BIG, this.onViewportTooBig_, false, this);
  goog.events.listen(this.g, chatango.events.EventType.ENABLE_RESIZE_DRAGGER, this.onEnableResizeDragger_, false, this);
};
chatango.embed.Shell.prototype.openPm_ = function(data) {
  if (!data || data == undefined) {
    data = this.pmData_;
  }
  var pmOpenKey = "pm_open";
  if (goog.net.cookies.containsKey(pmOpenKey)) {
    data["styles"][pmOpenKey] = goog.net.cookies.get(pmOpenKey);
    goog.net.cookies.remove(pmOpenKey);
  }
  this.pmMod_ = new chatango.modules.PmModule(data);
  goog.events.listen(this.pmMod_, chatango.events.EventType.VIEWPORT_TOO_BIG, this.onViewportTooBig_, false, this);
};
chatango.embed.Shell.prototype.onButtonExpanded_ = function(e) {
  this.lc_.send("buttonexpanded");
};
chatango.embed.Shell.prototype.onGetBrowserView_ = function(e) {
  this.lc_.send("browserviewrequest");
};
chatango.embed.Shell.prototype.onButtonCollapsed_ = function(e) {
  this.lc_.send("buttoncollapsed");
};
chatango.embed.Shell.prototype.onResizeIFrame_ = function(e) {
  var size = e.getSize();
  this.lc_.send("iframeresize", {"width":size.width, "height":size.height});
};
chatango.embed.Shell.prototype.onEnableResizeDragger_ = function(e) {
  var enable = e.getEnabled();
  this.lc_.send("enableresizedragger", {"enable":enable});
};
chatango.embed.Shell.prototype.setGroupLoaded = function() {
  goog.module.ModuleManager.getInstance().setLoaded("CommonCoreModule");
  goog.module.ModuleManager.getInstance().setLoaded("Group");
};
chatango.embed.Shell.prototype.setPmLoaded = function() {
  goog.module.ModuleManager.getInstance().setLoaded("CommonCoreModule");
  goog.module.ModuleManager.getInstance().setLoaded("PmModule");
};
chatango.embed.Shell.prototype.setMockGroupLoaded = function() {
  goog.module.ModuleManager.getInstance().setLoaded("CommonCoreModule");
  goog.module.ModuleManager.getInstance().setLoaded("CollapsedViewModule");
  goog.module.ModuleManager.getInstance().setLoaded("MockGroupModule");
};
chatango.embed.Shell.prototype.onOrientationChange_ = function(e) {
  if (this.g) {
    this.g.onOrientationChange(e.data);
  }
  if (this.pmMod_ && this.pmMod_.getPm()) {
    this.pmMod_.getPm().onOrientationChange(e.data);
  }
};
chatango.embed.Shell.prototype.onPageShow_ = function(e) {
  if (this.g) {
    this.g.onPageShow();
  }
  if (this.pmMod_ && this.pmMod_.getPm()) {
    this.pmMod_.getPm().onPageShow();
  }
};
chatango.embed.Shell.prototype.onZoomed_ = function(e) {
  if (!this.g) {
    return;
  }
  this.g.onZoomed(e.data);
};
chatango.embed.Shell.prototype.onKeyboardEvent_ = function(e) {
  if (e.type === chatango.managers.Keyboard.EventType.KEYBOARD_RAISED) {
    if (this.lc_) {
      this.lc_.send("keyboardup");
    }
  } else {
    if (e.type === chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED) {
      if (this.lc_) {
        this.lc_.send("keyboarddown");
      }
    }
  }
};
chatango.embed.Shell.prototype.onSetUserScaling_ = function(e) {
  var action = e.getAction();
  switch(action) {
    case chatango.events.ToggleUserScalingEvent.Action.DISABLE:
      this.lc_.send("setuserscalable", "disable");
      break;
    case chatango.events.ToggleUserScalingEvent.Action.RESTORE:
      this.lc_.send("setuserscalable", "restore");
      break;
  }
};
chatango.embed.Shell.prototype.onViewportTooBig_ = function(e) {
  this.lc_.send("viewporttoobig");
};
chatango.embed.Shell.prototype.onTitleSet_ = function(e) {
  this.lc_.send("settitle", e.data);
};
chatango.embed.Shell.prototype.onInitTitle_ = function(e) {
  chatango.managers.TitleManager.getInstance().initTitle(e.data);
};
chatango.embed.Shell.prototype.onKeyboardDown_ = function(e) {
  chatango.managers.Keyboard.getInstance().setRaised(false);
};
chatango.embed.Shell.prototype.onOpenPmEvent_ = function(e) {
  if (this.g) {
    this.g.openPmChat(e.data);
  } else {
    if (this.pmMod_ && this.pmMod_.getPm()) {
      this.pmMod_.getPm().openPmChat(e.data);
    }
  }
};
chatango.embed.Shell.prototype.setDebug = function(bool) {
  chatango.DEBUG = bool && goog.DEBUG && console;
  if (bool && !goog.DEBUG && console) {
    console.log("chatango.DEBUG not set because goog.DEBUG not true");
  }
};
goog.exportSymbol("chatango.embed.Shell", chatango.embed.Shell);
goog.exportProperty(chatango.embed.Shell.prototype, "startLocalComm", chatango.embed.Shell.prototype.startLocalComm);
goog.exportProperty(chatango.embed.Shell.prototype, "setGroupLoaded", chatango.embed.Shell.prototype.setGroupLoaded);
goog.exportProperty(chatango.embed.Shell.prototype, "setPmLoaded", chatango.embed.Shell.prototype.setPmLoaded);
goog.exportProperty(chatango.embed.Shell.prototype, "setMockGroupLoaded", chatango.embed.Shell.prototype.setMockGroupLoaded);
goog.exportProperty(chatango.embed.Shell.prototype, "setDebug", chatango.embed.Shell.prototype.setDebug);
goog.exportProperty(chatango.embed.Shell.prototype, "setupAnalytics", chatango.embed.Shell.prototype.setupAnalytics);
goog.exportProperty(chatango.embed.Shell.prototype, "performAnalytics", chatango.embed.Shell.prototype.performAnalytics);

