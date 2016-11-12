goog.provide("goog.fs.ProgressEvent");
goog.require("goog.events.Event");
goog.fs.ProgressEvent = function(event, target) {
  goog.fs.ProgressEvent.base(this, "constructor", event.type, target);
  this.event_ = event;
};
goog.inherits(goog.fs.ProgressEvent, goog.events.Event);
goog.fs.ProgressEvent.prototype.isLengthComputable = function() {
  return this.event_.lengthComputable;
};
goog.fs.ProgressEvent.prototype.getLoaded = function() {
  return this.event_.loaded;
};
goog.fs.ProgressEvent.prototype.getTotal = function() {
  return this.event_.total;
};
goog.provide("goog.fs.Error");
goog.provide("goog.fs.Error.ErrorCode");
goog.require("goog.debug.Error");
goog.require("goog.object");
goog.require("goog.string");
goog.fs.Error = function(error, action) {
  this.name;
  this.code;
  if (goog.isDef(error.name)) {
    this.name = error.name;
    this.code = goog.fs.Error.getCodeFromName_(error.name);
  } else {
    this.code = error.code;
    this.name = goog.fs.Error.getNameFromCode_(error.code);
  }
  goog.fs.Error.base(this, "constructor", goog.string.subs("%s %s", this.name, action));
};
goog.inherits(goog.fs.Error, goog.debug.Error);
goog.fs.Error.ErrorName = {ABORT:"AbortError", ENCODING:"EncodingError", INVALID_MODIFICATION:"InvalidModificationError", INVALID_STATE:"InvalidStateError", NOT_FOUND:"NotFoundError", NOT_READABLE:"NotReadableError", NO_MODIFICATION_ALLOWED:"NoModificationAllowedError", PATH_EXISTS:"PathExistsError", QUOTA_EXCEEDED:"QuotaExceededError", SECURITY:"SecurityError", SYNTAX:"SyntaxError", TYPE_MISMATCH:"TypeMismatchError"};
goog.fs.Error.ErrorCode = {NOT_FOUND:1, SECURITY:2, ABORT:3, NOT_READABLE:4, ENCODING:5, NO_MODIFICATION_ALLOWED:6, INVALID_STATE:7, SYNTAX:8, INVALID_MODIFICATION:9, QUOTA_EXCEEDED:10, TYPE_MISMATCH:11, PATH_EXISTS:12};
goog.fs.Error.getNameFromCode_ = function(code) {
  var name = goog.object.findKey(goog.fs.Error.NameToCodeMap_, function(c) {
    return code == c;
  });
  if (!goog.isDef(name)) {
    throw new Error("Invalid code: " + code);
  }
  return name;
};
goog.fs.Error.getCodeFromName_ = function(name) {
  return goog.fs.Error.NameToCodeMap_[name];
};
goog.fs.Error.NameToCodeMap_ = goog.object.create(goog.fs.Error.ErrorName.ABORT, goog.fs.Error.ErrorCode.ABORT, goog.fs.Error.ErrorName.ENCODING, goog.fs.Error.ErrorCode.ENCODING, goog.fs.Error.ErrorName.INVALID_MODIFICATION, goog.fs.Error.ErrorCode.INVALID_MODIFICATION, goog.fs.Error.ErrorName.INVALID_STATE, goog.fs.Error.ErrorCode.INVALID_STATE, goog.fs.Error.ErrorName.NOT_FOUND, goog.fs.Error.ErrorCode.NOT_FOUND, goog.fs.Error.ErrorName.NOT_READABLE, goog.fs.Error.ErrorCode.NOT_READABLE, goog.fs.Error.ErrorName.NO_MODIFICATION_ALLOWED, 
goog.fs.Error.ErrorCode.NO_MODIFICATION_ALLOWED, goog.fs.Error.ErrorName.PATH_EXISTS, goog.fs.Error.ErrorCode.PATH_EXISTS, goog.fs.Error.ErrorName.QUOTA_EXCEEDED, goog.fs.Error.ErrorCode.QUOTA_EXCEEDED, goog.fs.Error.ErrorName.SECURITY, goog.fs.Error.ErrorCode.SECURITY, goog.fs.Error.ErrorName.SYNTAX, goog.fs.Error.ErrorCode.SYNTAX, goog.fs.Error.ErrorName.TYPE_MISMATCH, goog.fs.Error.ErrorCode.TYPE_MISMATCH);
goog.provide("goog.fs.FileReader");
goog.provide("goog.fs.FileReader.EventType");
goog.provide("goog.fs.FileReader.ReadyState");
goog.require("goog.async.Deferred");
goog.require("goog.events.EventTarget");
goog.require("goog.fs.Error");
goog.require("goog.fs.ProgressEvent");
goog.fs.FileReader = function() {
  goog.fs.FileReader.base(this, "constructor");
  this.reader_ = new FileReader;
  this.reader_.onloadstart = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onprogress = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onload = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onabort = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onerror = goog.bind(this.dispatchProgressEvent_, this);
  this.reader_.onloadend = goog.bind(this.dispatchProgressEvent_, this);
};
goog.inherits(goog.fs.FileReader, goog.events.EventTarget);
goog.fs.FileReader.ReadyState = {INIT:0, LOADING:1, DONE:2};
goog.fs.FileReader.EventType = {LOAD_START:"loadstart", PROGRESS:"progress", LOAD:"load", ABORT:"abort", ERROR:"error", LOAD_END:"loadend"};
goog.fs.FileReader.prototype.abort = function() {
  try {
    this.reader_.abort();
  } catch (e) {
    throw new goog.fs.Error(e, "aborting read");
  }
};
goog.fs.FileReader.prototype.getReadyState = function() {
  return(this.reader_.readyState);
};
goog.fs.FileReader.prototype.getResult = function() {
  return this.reader_.result;
};
goog.fs.FileReader.prototype.getError = function() {
  return this.reader_.error && new goog.fs.Error(this.reader_.error, "reading file");
};
goog.fs.FileReader.prototype.dispatchProgressEvent_ = function(event) {
  this.dispatchEvent(new goog.fs.ProgressEvent(event, this));
};
goog.fs.FileReader.prototype.disposeInternal = function() {
  goog.fs.FileReader.base(this, "disposeInternal");
  delete this.reader_;
};
goog.fs.FileReader.prototype.readAsBinaryString = function(blob) {
  this.reader_.readAsBinaryString(blob);
};
goog.fs.FileReader.readAsBinaryString = function(blob) {
  var reader = new goog.fs.FileReader;
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsBinaryString(blob);
  return d;
};
goog.fs.FileReader.prototype.readAsArrayBuffer = function(blob) {
  this.reader_.readAsArrayBuffer(blob);
};
goog.fs.FileReader.readAsArrayBuffer = function(blob) {
  var reader = new goog.fs.FileReader;
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsArrayBuffer(blob);
  return d;
};
goog.fs.FileReader.prototype.readAsText = function(blob, opt_encoding) {
  this.reader_.readAsText(blob, opt_encoding);
};
goog.fs.FileReader.readAsText = function(blob, opt_encoding) {
  var reader = new goog.fs.FileReader;
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsText(blob, opt_encoding);
  return d;
};
goog.fs.FileReader.prototype.readAsDataUrl = function(blob) {
  this.reader_.readAsDataURL(blob);
};
goog.fs.FileReader.readAsDataUrl = function(blob) {
  var reader = new goog.fs.FileReader;
  var d = goog.fs.FileReader.createDeferred_(reader);
  reader.readAsDataUrl(blob);
  return d;
};
goog.fs.FileReader.createDeferred_ = function(reader) {
  var deferred = new goog.async.Deferred;
  reader.listen(goog.fs.FileReader.EventType.LOAD_END, goog.partial(function(d, r, e) {
    var result = r.getResult();
    var error = r.getError();
    if (result != null && !error) {
      d.callback(result);
    } else {
      d.errback(error);
    }
    r.dispose();
  }, deferred, reader));
  return deferred;
};
goog.provide("chatango.ui.icons.CircleCrossIconRenderer");
goog.require("chatango.ui.icons.IIconRenderer");
chatango.ui.icons.CircleCrossIconRenderer = function() {
};
goog.addSingletonGetter(chatango.ui.icons.CircleCrossIconRenderer);
chatango.ui.icons.CircleCrossIconRenderer.prototype.draw = function(graphics, opt_color, opt_left, opt_top, opt_width, opt_height) {
  var size = opt_width || graphics.width - 1;
  var h = size;
  var w = size;
  var x = opt_left || 1;
  var y = opt_top || 0;
  var col = opt_color || "#CC0000";
  var fill = new goog.graphics.SolidFill(col, 1);
  var r = w / 2;
  graphics.drawCircle(x + r, y + r, r, null, fill);
  var path = graphics.createPath();
  var size = graphics.width;
  var strokeSize = Math.max(3, size / 10);
  var stroke = new goog.graphics.Stroke(strokeSize, "#FFFFFF");
  var unit;
  unit = size / 10;
  var inset = 2.6;
  path.moveTo(x + size - inset * unit, y + inset * unit);
  path.lineTo(x + inset * unit, y + size - inset * unit);
  path.moveTo(x + inset * unit, y + inset * unit);
  path.lineTo(x + size - inset * unit, y + size - inset * unit);
  graphics.drawPath(path, stroke, null);
};
goog.provide("chatango.ui.icons.CircleCrossIcon");
goog.require("chatango.ui.icons.CircleCrossIconRenderer");
goog.require("chatango.ui.icons.Icon");
goog.require("goog.debug.Console");
goog.require("goog.module.ModuleManager");
chatango.ui.icons.CircleCrossIcon = function(opt_size, opt_color, opt_domHelper) {
  opt_size = opt_size || 26;
  opt_color = opt_color || "#CC0000";
  chatango.ui.icons.Icon.call(this, chatango.ui.icons.CircleCrossIconRenderer.getInstance(), opt_color, opt_size, opt_size, opt_domHelper);
};
goog.inherits(chatango.ui.icons.CircleCrossIcon, chatango.ui.icons.Icon);
goog.provide("chatango.ui.icons.CircleCheckIconRenderer");
goog.require("chatango.ui.icons.IIconRenderer");
chatango.ui.icons.CircleCheckIconRenderer = function() {
};
goog.addSingletonGetter(chatango.ui.icons.CircleCheckIconRenderer);
chatango.ui.icons.CircleCheckIconRenderer.prototype.draw = function(graphics, opt_color, opt_left, opt_top, opt_width, opt_height) {
  var size = opt_width || graphics.width - 1;
  var h = size;
  var w = size;
  var x = opt_left || 1;
  var y = opt_top || 0;
  var col = opt_color || "#99CC33";
  var fill = new goog.graphics.SolidFill(col, 1);
  var r = w / 2;
  graphics.drawCircle(x + r, y + r, r, null, fill);
  var path = graphics.createPath();
  var size = graphics.width;
  var strokeSize = Math.max(3, size / 10);
  var stroke = new goog.graphics.Stroke(strokeSize, "#FFFFFF");
  var unit;
  unit = size / 10;
  path.moveTo(x + size - 2 * unit, y + 2.8 * unit);
  path.lineTo(x + 4 * unit, y + size - 2.5 * unit);
  path.lineTo(x + 2 * unit, y + 5.5 * unit);
  graphics.drawPath(path, stroke, null);
};
goog.provide("chatango.ui.icons.CircleCheckIcon");
goog.require("chatango.ui.icons.CircleCheckIconRenderer");
goog.require("chatango.ui.icons.Icon");
goog.require("goog.debug.Console");
goog.require("goog.module.ModuleManager");
chatango.ui.icons.CircleCheckIcon = function(opt_size, opt_color, opt_domHelper) {
  opt_size = opt_size || 26;
  opt_color = opt_color || "#99CC33";
  chatango.ui.icons.Icon.call(this, chatango.ui.icons.CircleCheckIconRenderer.getInstance(), opt_color, opt_size, opt_size, opt_domHelper);
};
goog.inherits(chatango.ui.icons.CircleCheckIcon, chatango.ui.icons.Icon);
goog.provide("chatango.users.EmailStatusIcon");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.ui.icons.CircleCheckIcon");
goog.require("chatango.ui.icons.CircleCrossIcon");
goog.require("goog.ui.Component");
chatango.users.EmailStatusIcon = function(opt_state) {
  goog.base(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.state_ = opt_state !== undefined ? opt_state : chatango.users.EmailStatusIcon.State.PENDING;
  this.checkIcon_ = new chatango.ui.icons.CircleCheckIcon;
  this.pendingIcon_ = new chatango.ui.icons.CircleCheckIcon(undefined, "#DDDDDD");
  this.crossIcon_ = new chatango.ui.icons.CircleCrossIcon;
};
goog.inherits(chatango.users.EmailStatusIcon, goog.ui.Component);
chatango.users.EmailStatusIcon.State = {INVALID:"invalid", UNVERIFIED:"unverified", VERIFIED:"verified", PENDING:"pending"};
chatango.users.EmailStatusIcon.EventType = {VERIFICATION_REQUEST:"request_verify"};
chatango.users.EmailStatusIcon.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div");
  this.checkIconWrapper_ = goog.dom.createDom("div");
  this.checkIconWrapper_.title = this.lm_.getString("ep_module", "verified_tt");
  this.checkIcon_.render(this.checkIconWrapper_);
  this.pendingIconWrapper_ = goog.dom.createDom("div");
  this.pendingIconWrapper_.title = this.lm_.getString("ep_module", "pending_tt");
  this.pendingIcon_.render(this.pendingIconWrapper_);
  this.crossIconWrapper_ = goog.dom.createDom("div");
  this.crossIconWrapper_.title = this.lm_.getString("ep_module", "invalid_tt");
  this.crossIcon_.render(this.crossIconWrapper_);
  this.verifyLinkButton_ = new goog.ui.Button(this.lm_.getString("ep_module", "verify"), goog.ui.LinkButtonRenderer.getInstance());
  this.verifyLinkButton_.addClassName("link-btn");
  this.verifyLinkWrapper_ = goog.dom.createDom("div");
  this.verifyLinkWrapper_.title = this.lm_.getString("ep_module", "verify_tt");
  this.verifyLinkButton_.render(this.verifyLinkWrapper_);
  goog.events.listen(this.verifyLinkButton_, goog.ui.Component.EventType.ACTION, this.onVerify_, false, this);
  this.draw();
};
chatango.users.EmailStatusIcon.prototype.draw = function() {
  goog.dom.removeChildren(this.getElement());
  switch(this.state_) {
    case chatango.users.EmailStatusIcon.State.VERIFIED:
      goog.dom.append(this.getElement(), this.checkIconWrapper_);
      break;
    case chatango.users.EmailStatusIcon.State.UNVERIFIED:
      goog.dom.append(this.getElement(), this.verifyLinkWrapper_);
      break;
    case chatango.users.EmailStatusIcon.State.INVALID:
      goog.dom.append(this.getElement(), this.crossIconWrapper_);
      break;
    case chatango.users.EmailStatusIcon.State.PENDING:
      goog.dom.append(this.getElement(), this.pendingIconWrapper_);
      break;
  }
};
chatango.users.EmailStatusIcon.prototype.setState = function(state) {
  if (state == this.state_) {
    return;
  }
  this.state_ = state;
  this.draw();
};
chatango.users.EmailStatusIcon.prototype.onVerify_ = function(e) {
  this.dispatchEvent(chatango.users.EmailStatusIcon.EventType.VERIFICATION_REQUEST);
};
chatango.users.EmailStatusIcon.prototype.disposeInternal_ = function() {
  if (this.checkIcon_) {
    this.checkIcon_.dispose();
    this.checkIcon_ = null;
  }
  if (this.crossIcon_) {
    this.crossIcon_.dispose();
    this.crossIcon_ = null;
  }
};
goog.provide("chatango.ui.icons.SvgPencilIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgPencilIcon = function(opt_color, opt_size, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, undefined, opt_domHelper);
  this.color_ = opt_color || "#666666";
  this.setSize(opt_size || 15);
};
goog.inherits(chatango.ui.icons.SvgPencilIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgPencilIcon.prototype.draw = function() {
  var svgString = '<svg width="100%" height="100%" viewBox="0 0 15 15">' + '<path fill="' + this.color_ + '" stroke="none" d="M 13.882794,0.83013722 C 13.415456,0.45905345 12.441597,-0.13933793 11.682848,0.60654201 l -1.535709,1.50964749 2.95858,2.9085943 1.535708,-1.5098163 C 15.62631,2.5468423 14.206854,1.1487393 14.14833,1.0911952 14.134083,1.0743201 14.038521,0.95450674 13.882794,0.83013722 z M 9.0796721,3.165484 1.1378668,10.972754 0,15 4.0965317,13.881349 12.038337,6.0740782 z" />' + "</svg>";
  this.element_.innerHTML = svgString;
};
chatango.ui.icons.SvgPencilIcon.prototype.setSize = function(size) {
  goog.base(this, "setSize", size, size);
};
goog.provide("chatango.users.EditProfileModel");
goog.require("chatango.utils.Encode");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.externalapi.SolveMedia");
goog.require("goog.events.EventTarget");
goog.require("goog.net.cookies");
chatango.users.EditProfileModel = function(opt_pmMode) {
  goog.base(this);
  this.pmMode_ = opt_pmMode ? true : false;
  var baseDomain = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  this.scriptUrl_ = "//" + baseDomain + "/updateprofile";
  this.age_ = "";
  this.sex_ = "";
  this.loc_ = "";
  this.email_ = "";
  this.eline_ = "";
  this.verfied_ = false;
  this.showInDirectory_ = false;
  this.error_ = "";
};
goog.inherits(chatango.users.EditProfileModel, goog.events.EventTarget);
chatango.users.EditProfileModel.EventType = {LOADED:"profile_loaded", LOAD_ERROR:"profile_load_error", UPDATE_ERROR:"profile_update_error", UNAUTHED:"profile_update_unauthed"};
chatango.users.EditProfileModel.prototype.getBaseForm_ = function() {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var fd = new FormData;
  if (!this.pmMode_ && goog.net.cookies.get("un") && goog.net.cookies.get("pw")) {
    fd.append("u", chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("un")));
    fd.append("p", chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("pw")));
    fd.append("auth", "pwd");
  } else {
    if (this.pmMode_ && cUser.getToken()) {
      fd.append("s", cUser.getToken());
      fd.append("auth", "token");
    }
  }
  fd.append("src", "group");
  fd.append("arch", "h5");
  return fd;
};
chatango.users.EditProfileModel.prototype.load = function() {
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(this.scriptUrl_);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onLoadSuccess_, false, this);
  goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.ABORT, goog.net.EventType.TIMEOUT], this.onLoadError_, false, this);
  var fd = this.getBaseForm_();
  xhr.send(this.scriptUrl_, "POST", fd);
};
chatango.users.EditProfileModel.prototype.onLoadSuccess_ = function(e) {
  var text = e.target.getResponseText();
  if (text == "unauthed") {
    this.dispatchEvent(chatango.users.EditProfileModel.EventType.UNAUTHED);
    return;
  }
  this.error_ = "";
  var results = text.split("&");
  if (results.length == 0) {
    this.onLoadError_();
    return;
  }
  for (var i = 0;i < results.length;i++) {
    data = results[i].split("=");
    if (data.length != 2) {
      break;
    }
    if (data[1] == "?") {
      data[1] = "";
    }
    switch(data[0]) {
      case "age":
        this.age_ = data[1];
        break;
      case "sex":
        this.sex_ = data[1];
        break;
      case "loc":
        this.loc_ = data[1];
        break;
      case "eline":
        this.eline_ = decodeURIComponent(data[1]);
        break;
      case "email":
        this.email_ = data[1];
        break;
      case "vrfd":
        this.verified_ = data[1] && data[1] != "0";
        break;
      case "dir":
        this.showInDirectory_ = data[1] == "checked";
        break;
      case "error":
        this.error_ = data[1];
    }
  }
  this.dispatchEvent(chatango.users.EditProfileModel.EventType.LOADED);
};
chatango.users.EditProfileModel.prototype.onLoadError_ = function(e) {
  this.dispatchEvent(chatango.users.EditProfileModel.EventType.LOAD_ERROR);
};
chatango.users.EditProfileModel.prototype.uploadImage = function(file) {
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(this.scriptUrl_, true);
  goog.events.listen(xhr, [goog.net.EventType.SUCCESS, goog.net.EventType.ERROR, goog.net.EventType.ABORT, goog.net.EventType.TIMEOUT, "progress"], this.dispatchEvent, false, this);
  var fd = this.getBaseForm_();
  fd.append("action", "fullpic");
  fd.append("Filedata", file);
  xhr.send(this.scriptUrl_, "POST", fd);
};
chatango.users.EditProfileModel.prototype.getAge = function() {
  return this.age_;
};
chatango.users.EditProfileModel.prototype.getSex = function() {
  return this.sex_;
};
chatango.users.EditProfileModel.prototype.getLocation = function() {
  return this.loc_;
};
chatango.users.EditProfileModel.prototype.getEmail = function() {
  return this.email_;
};
chatango.users.EditProfileModel.prototype.getAbout = function() {
  return this.eline_;
};
chatango.users.EditProfileModel.prototype.getVerified = function() {
  return this.verified_;
};
chatango.users.EditProfileModel.prototype.getShowInDirectory = function() {
  return this.showInDirectory_;
};
chatango.users.EditProfileModel.prototype.getError = function() {
  return this.error_;
};
chatango.users.EditProfileModel.prototype.update = function(age, sex, loc, eline, email, showInDirectory) {
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(this.scriptUrl_);
  var fd = this.getBaseForm_();
  var emailSubmitted = false;
  fd.append("action", "update");
  if (age !== undefined) {
    fd.append("age", age);
  }
  if (sex !== undefined) {
    fd.append("gender", sex);
  }
  if (loc !== undefined) {
    fd.append("location", loc);
  }
  if (eline !== undefined) {
    fd.append("line", eline);
  }
  if (email !== undefined && email != this.email_) {
    fd.append("email", email);
    emailSubmitted = true;
  }
  if (showInDirectory) {
    fd.append("dir", "checked");
  }
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onUpdateSuccess_, false, this);
  goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.ABORT, goog.net.EventType.TIMEOUT], this.onUpdateError_, false, this);
  xhr.send(this.scriptUrl_, "POST", fd);
  if (emailSubmitted) {
    var sm = chatango.externalapi.SolveMedia.getInstance();
    sm.insertSolveMediaTag(email);
  }
};
chatango.users.EditProfileModel.prototype.onUpdateSuccess_ = function(e) {
  this.onLoadSuccess_(e);
};
chatango.users.EditProfileModel.prototype.onUpdateError_ = function(e) {
  this.dispatchEvent(chatango.users.EditProfileModel.EventType.UPDATE_ERROR);
};
chatango.users.EditProfileModel.prototype.disposeInternal_ = function() {
  this.email_ = null;
  this.loc_ = null;
  this.age_ = null;
  this.sex_ = null;
  this.verified_ = null;
  this.eline_ = null;
};
goog.provide("chatango.users.EditProfileDialog");
goog.require("chatango.embed.AppComm");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.ui.icons.SvgPencilIcon");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ProgressBar");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.ScrollableTextDialog");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.users.EditProfileModel");
goog.require("chatango.users.EmailStatusIcon");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.Paths");
goog.require("chatango.utils.style");
goog.require("goog.fs.FileReader");
goog.require("goog.Timer");
goog.require("goog.ui.Button");
goog.require("goog.ui.Component");
goog.require("goog.ui.LinkButtonRenderer");
chatango.users.EditProfileDialog = function(emailOnly, opt_pmMode, opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.setResizable(false);
  this.emailOnly_ = emailOnly || false;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.user_ = chatango.users.UserManager.getInstance().currentUser;
  this.handler = new goog.events.EventHandler(this);
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.uploadProgress_ = 0;
  this.model_ = new chatango.users.EditProfileModel(opt_pmMode);
  this.handler.listen(this.model_, chatango.users.EditProfileModel.EventType.LOADED, this.updateFields_);
  this.handler.listen(this.model_, chatango.users.EditProfileModel.EventType.LOAD_ERROR, this.onLoadError_);
  this.handler.listen(this.model_, chatango.users.EditProfileModel.EventType.UPDATE_ERROR, this.onUpdateError_);
  this.handler.listen(this.model_, chatango.users.EditProfileModel.EventType.UNAUTHED, this.onUnauthed_);
  this.emailIcon_ = new chatango.users.EmailStatusIcon;
  goog.events.listen(this.emailIcon_, chatango.users.EmailStatusIcon.EventType.VERIFICATION_REQUEST, this.onVerifyClick_, false, this);
  this.emailSent_ = false;
  this.timer_ = null;
};
goog.inherits(chatango.users.EditProfileDialog, chatango.ui.ScrollableDialog);
chatango.users.EditProfileDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  this.thumbURL_ = chatango.utils.Paths.getInstance().getUserImagePaths(this.user_.getSid()).thumb;
  var changeEvents = [goog.events.EventType.KEYUP, goog.events.EventType.CHANGE];
  var dom = this.getDomHelper();
  if (!this.emailOnly_) {
    this.thumbWrapper_ = goog.dom.createDom("div", {"style":"cursor:pointer;display:inline-block;line-height:0;vertical-align:bottom;width:67px;height:50px;"});
    this.thumbEl_ = goog.dom.createDom("img", {"style":"width:50px;"});
    this.reloadThumb();
    goog.dom.append(this.thumbWrapper_, this.thumbEl_);
    this.pencil_ = new chatango.ui.icons.SvgPencilIcon;
    this.pencil_.render(this.thumbWrapper_);
    goog.style.setStyle(this.pencil_.getElement(), "margin-left", "2px");
    goog.dom.append(content, this.thumbWrapper_);
    this.handler.listen(this.thumbWrapper_, goog.events.EventType.CLICK, this.onThumbClick_);
    this.aslWrapper_ = goog.dom.createDom("div", {"style":"display:inline-block;text-align:center;"});
    this.ageWrapper_ = goog.dom.createDom("div", {"style":"display:inline-block;margin:0 0.3em;"});
    this.ageTitle_ = goog.dom.createDom("span", {}, "Age");
    this.ageField_ = goog.dom.createDom("input", {"type":"text", "style":"text-align:center;width:2em;"});
    goog.dom.append(this.ageWrapper_, this.ageTitle_);
    dom.appendChild(this.ageWrapper_, dom.createDom("br"));
    goog.dom.append(this.ageWrapper_, this.ageField_);
    this.sexWrapper_ = goog.dom.createDom("div", {"style":"display:inline-block;margin:0 0.3em;"});
    this.sexTitle_ = goog.dom.createDom("span", {}, "Gender");
    this.sexField_ = goog.dom.createDom("input", {"type":"text", "style":"text-align:center;width:1em;"});
    goog.dom.append(this.sexWrapper_, this.sexTitle_);
    dom.appendChild(this.sexWrapper_, dom.createDom("br"));
    goog.dom.append(this.sexWrapper_, this.sexField_);
    this.locWrapper_ = goog.dom.createDom("div", {"style":"display:inline-block;margin:0 0.3em;"});
    this.locTitle_ = goog.dom.createDom("span", {}, "Zip/Country");
    this.locField_ = goog.dom.createDom("input", {"type":"text", "style":"text-align:center;width:5em;"});
    goog.dom.append(this.locWrapper_, this.locTitle_);
    dom.appendChild(this.locWrapper_, dom.createDom("br"));
    goog.dom.append(this.locWrapper_, this.locField_);
    goog.dom.append(this.aslWrapper_, this.ageWrapper_);
    goog.dom.append(this.aslWrapper_, this.sexWrapper_);
    goog.dom.append(this.aslWrapper_, this.locWrapper_);
    goog.dom.append(content, this.aslWrapper_);
    this.handler.listen(this.ageField_, changeEvents, this.onChange_);
    this.handler.listen(this.sexField_, changeEvents, this.onChange_);
    this.handler.listen(this.locField_, changeEvents, this.onChange_);
    this.progressBarWrapper_ = goog.dom.createDom("div", {"style":"height: 2em;"});
    this.progressBar_ = new chatango.ui.ProgressBar;
    this.progressBar_.render(this.progressBarWrapper_);
    goog.dom.appendChild(content, this.progressBarWrapper_);
    goog.style.showElement(this.progressBarWrapper_, false);
    goog.style.showElement(this.progressBar_.getElement(), false);
    this.processingStatusEl_ = goog.dom.createDom("div");
    goog.dom.append(content, this.processingStatusEl_);
    goog.style.showElement(this.processingStatusEl_, false);
    this.fileUpload_ = goog.dom.createDom("input", {"type":"file", "accept":"image/*;capture=camera", "style":"visibility:hidden;width:0px;position:absolute;top:0;"});
    this.handler.listen(this.fileUpload_, "change", this.onFileChange_);
    goog.dom.append(content, this.fileUpload_);
    dom.appendChild(content, dom.createDom("br"));
    dom.appendChild(content, dom.createDom("br"));
    this.aboutMeWrapper_ = goog.dom.createDom("div");
    this.aboutMeTitle_ = goog.dom.createDom("span", {}, "About me:");
    this.aboutMeField_ = goog.dom.createDom("textarea");
    goog.dom.append(this.aboutMeWrapper_, this.aboutMeTitle_);
    goog.dom.append(this.aboutMeWrapper_, goog.dom.createDom("br"));
    goog.dom.append(this.aboutMeWrapper_, this.aboutMeField_);
    goog.dom.append(content, this.aboutMeWrapper_);
    goog.dom.append(content, goog.dom.createDom("br"));
    this.handler.listen(this.aboutMeField_, changeEvents, this.onChange_);
  }
  this.emailWrapper_ = goog.dom.createDom("div");
  this.emailFieldWrapper_ = goog.dom.createDom("div", {"style":"display:inline-block;"});
  this.emailField_ = goog.dom.createDom("input", {"type":"text", "placeholder":this.lm_.getString("ep_module", "email"), "style":"margin-right:0.5em;vertical-align:middle;"});
  goog.dom.append(content, this.emailWrapper_);
  goog.dom.append(this.emailFieldWrapper_, this.emailField_);
  goog.dom.append(this.emailWrapper_, this.emailFieldWrapper_);
  this.emailIconWrapper_ = goog.dom.createDom("div", {"style":"display:inline-block;vertical-align:middle;"});
  this.emailIcon_.render(this.emailIconWrapper_);
  goog.dom.append(this.emailWrapper_, this.emailIconWrapper_);
  dom.appendChild(content, dom.createDom("br"));
  this.handler.listen(this.emailField_, changeEvents, this.onChange_);
  if (!this.emailOnly_) {
    this.meetPeopleCbWrapper_ = goog.dom.createDom("div", {"class":"fl"});
    this.meetPeopleCb_ = new chatango.ui.Checkbox;
    this.meetPeopleCb_.render(this.meetPeopleCbWrapper_);
    this.meetPeopleCb_.setCaption(this.lm_.getString("ep_module", "meet_people"));
    goog.style.setStyle(this.meetPeopleCb_.getElement(), "padding-right", "0.5em");
    goog.dom.append(content, this.meetPeopleCbWrapper_);
    this.meetPeopleHelpButton_ = new goog.ui.Button("(?)", goog.ui.LinkButtonRenderer.getInstance());
    this.meetPeopleHelpButton_.render(content);
    this.meetPeopleHelpButton_.addClassName("link-btn");
    this.meetPeopleHelpButton_.addClassName("fl");
    this.handler.listen(this.meetPeopleCb_, goog.ui.Component.EventType.CHANGE, this.onChange_);
    this.handler.listen(this.meetPeopleHelpButton_, goog.ui.Component.EventType.ACTION, this.onHelp_);
  }
  this.showFooterContentEl(true);
  if (!this.emailOnly_) {
    this.showFooterElBorder(true);
  }
  this.footerWrapper_ = dom.createDom("div", {"style":"overflow:hidden;vertical-align:middle;"});
  goog.dom.append(this.getFooterContentElement(), this.footerWrapper_);
  this.textAreas_ = goog.dom.createDom("div", {"style":"display:table-cell;width:100%;vertical-align:middle;"});
  goog.dom.append(this.footerWrapper_, this.textAreas_);
  this.infoArea_ = goog.dom.createDom("div", {"style":"font-size:80%;"});
  this.timer_ = goog.Timer.callOnce(function() {
    this.infoArea_.innerHTML = this.lm_.getString("ep_module", "loading");
    this.timer_ = null;
  }, 300, this);
  goog.dom.append(this.textAreas_, this.infoArea_);
  this.errorArea_ = goog.dom.createDom("div", {"style":"font-size:80%;color:#FF0000;"});
  goog.dom.append(this.textAreas_, this.errorArea_);
  this.saveBtnWrapper_ = goog.dom.createDom("div", {"style":"display:table-cell;"});
  this.saveBtn_ = new chatango.ui.buttons.Button(this.lm_.getString("ep_module", "save"));
  this.saveBtn_.setAlert(true);
  this.saveBtn_.setEnabled(false);
  this.saveBtn_.render(this.saveBtnWrapper_);
  goog.style.setStyle(this.saveBtn_.getElement(), "margin-top", "0");
  this.handler.listen(this.saveBtn_, goog.ui.Component.EventType.ACTION, this.onSave_);
  goog.dom.append(this.footerWrapper_, this.saveBtnWrapper_);
  this.model_.load();
  this.updateCopy();
};
chatango.users.EditProfileDialog.prototype.draw = function() {
  goog.base(this, "draw");
  if (!this.emailOnly_) {
    var content = this.getContentElement();
    var boxWidth = goog.style.getSize(content).width;
    var boxPadding = goog.style.getPaddingBox(content);
    var w = boxWidth - boxPadding.left - boxPadding.right - goog.style.getSize(this.thumbWrapper_).width;
    this.aslWrapper_.style.width = Math.floor(w - 1) + "px";
    chatango.utils.style.stretchToFill(this.aboutMeField_);
  }
  var w = goog.style.getSize(this.emailWrapper_).width - goog.style.getSize(this.emailIconWrapper_).width;
  this.emailFieldWrapper_.style.width = Math.floor(w - 1) + "px";
  chatango.utils.style.stretchToFill(this.emailField_);
};
chatango.users.EditProfileDialog.prototype.clearTimer_ = function(e) {
  if (this.timer_) {
    goog.Timer.clear(this.timer_);
    this.timer_ = null;
  }
};
chatango.users.EditProfileDialog.prototype.updateFields_ = function(e) {
  this.clearTimer_();
  this.infoArea_.innerHTML = "";
  if (!this.emailOnly_) {
    this.ageField_.value = this.model_.getAge();
    this.sexField_.value = this.model_.getSex();
    this.locField_.value = this.model_.getLocation();
    this.aboutMeField_.value = this.model_.getAbout();
    this.meetPeopleCb_.setEnabled(this.ageField_.value || this.sexField_.value || this.locField_.value || this.model_.getShowInDirectory());
    this.meetPeopleCb_.setChecked(this.model_.getShowInDirectory());
  }
  this.emailField_.value = this.model_.getEmail();
  this.errorArea_.innerHTML = this.model_.getError();
  if (this.model_.getError()) {
    return;
  }
  if (this.emailSent_ && !this.model_.getVerified()) {
    this.infoArea_.innerHTML = this.lm_.getString("ep_module", "email_sent");
  } else {
    this.infoArea_.innerHTML = "";
  }
  var state;
  if (this.model_.getVerified()) {
    state = chatango.users.EmailStatusIcon.State.VERIFIED;
  } else {
    if (this.emailSent_) {
      state = chatango.users.EmailStatusIcon.State.PENDING;
    } else {
      state = chatango.users.EmailStatusIcon.State.UNVERIFIED;
    }
  }
  this.emailIcon_.setState(state);
  this.draw();
};
chatango.users.EditProfileDialog.prototype.onLoadError_ = function(e) {
  this.clearTimer_();
  this.errorArea_.innerHTML = this.lm_.getString("ep_module", "load_error");
};
chatango.users.EditProfileDialog.prototype.onThumbClick_ = function(e) {
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    chatango.embed.AppComm.getInstance().alertEditProfileImage();
  } else {
    this.fileUpload_.click();
  }
};
chatango.users.EditProfileDialog.prototype.onFileChange_ = function(e) {
  var chosenImage_ = e.target.files[0];
  goog.events.listen(this.model_, goog.net.EventType.SUCCESS, this.onUploadSuccess_, undefined, this);
  goog.events.listen(this.model_, "progress", this.onUploadProgress_, undefined, this);
  goog.events.listen(this.model_, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.onUploadError, undefined, this);
  this.model_.uploadImage(e.target.files[0]);
};
chatango.users.EditProfileDialog.prototype.reloadProfile = function(e) {
  this.model_.load();
};
chatango.users.EditProfileDialog.prototype.reloadThumb = function(e) {
  var now = (new Date).getTime();
  this.thumbEl_.src = this.thumbURL_ + "?" + now;
};
chatango.users.EditProfileDialog.prototype.onChange_ = function(e) {
  if (this.disposed_) {
    return;
  }
  this.errorArea_.innerHTML = "";
  this.infoArea_.innerHTML = "";
  var updated = false;
  if (!this.emailOnly_) {
    updated = this.ageField_.value != this.model_.getAge() || this.sexField_.value != this.model_.getSex() || this.locField_.value != this.model_.getLocation() || this.aboutMeField_.value != this.model_.getAbout() || this.meetPeopleCb_.getChecked() != this.model_.getShowInDirectory();
    var cbEnabled = this.ageField_.value || this.model_.getAge() || this.sexField_.value || this.model_.getSex() || this.locField_.value || this.model_.getLocation() || this.aboutMeField_.value || this.model_.getAbout() || this.model_.getShowInDirectory();
    if (this.meetPeopleCb_.isEnabled() && !cbEnabled) {
      this.meetPeopleCb_.setEnabled(false);
      this.meetPeopleCb_.setChecked(false);
    } else {
      if (!this.meetPeopleCb_.isEnabled() && cbEnabled) {
        this.meetPeopleCb_.setEnabled(true);
        this.meetPeopleCb_.setChecked(true);
      }
    }
  }
  var emailUpdated = this.emailField_.value != this.model_.getEmail();
  var emailValid = !emailUpdated || this.checkEmail_();
  var state;
  if (emailUpdated && emailValid || !emailUpdated && this.emailSent_) {
    state = chatango.users.EmailStatusIcon.State.PENDING;
  } else {
    if (!emailUpdated && this.model_.getVerified()) {
      state = chatango.users.EmailStatusIcon.State.VERIFIED;
    } else {
      if (!emailUpdated && !this.emailSent_) {
        state = chatango.users.EmailStatusIcon.State.UNVERIFIED;
      } else {
        state = chatango.users.EmailStatusIcon.State.INVALID;
      }
    }
  }
  this.emailIcon_.setState(state);
  this.draw();
  this.saveBtn_.setEnabled((updated || emailUpdated) && emailValid);
};
chatango.users.EditProfileDialog.prototype.onHelp_ = function(e) {
  if (!this.helpPopup_) {
    this.helpPopup_ = new chatango.ui.ScrollableTextDialog(this.lm_.getString("ep_module", "meet_people_help"));
    this.helpPopup_.setVisible(true);
    this.helpPopup_.setResizable(false);
    goog.events.listenOnce(this.helpPopup_, goog.ui.Dialog.EventType.AFTER_HIDE, function(e) {
      this.helpPopup_.dispose();
      this.helpPopup_ = null;
    }, false, this);
  }
};
chatango.users.EditProfileDialog.prototype.checkEmail_ = function() {
  return/^(?:[0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@(?:[-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$/.test(this.emailField_.value);
};
chatango.users.EditProfileDialog.prototype.onVerifyClick_ = function(e) {
  this.emailSent_ = true;
  var baseDomain = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  var url = "//" + baseDomain + "/sendvalidation";
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
  var fd = new FormData;
  fd.append("e", this.model_.getEmail());
  xhr.send(url, "POST", fd);
  this.infoArea_.innerHTML = this.lm_.getString("ep_module", "email_sent");
  this.emailIcon_.setState(chatango.users.EmailStatusIcon.State.PENDING);
  this.draw();
};
chatango.users.EditProfileDialog.prototype.onSave_ = function(e) {
  this.emailSent_ = this.emailField_.value != this.model_.getEmail();
  if (this.emailOnly_) {
    this.model_.update(undefined, undefined, undefined, undefined, this.emailField_.value);
  } else {
    this.model_.update(this.ageField_.value, this.sexField_.value, this.locField_.value, this.aboutMeField_.value, this.emailField_.value, this.meetPeopleCb_.getChecked());
  }
  this.saveBtn_.setEnabled(false);
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    window["ga"]("send", "event", "Profile", "Edit", "Android app");
  }
};
chatango.users.EditProfileDialog.prototype.onUploadSuccess_ = function(e) {
  this.reloadThumb();
  this.uploadProgress_ = 0;
  goog.style.showElement(this.progressBar_.getElement(), false);
  goog.style.showElement(this.processingStatusEl_, false);
};
chatango.users.EditProfileDialog.prototype.onUploadProgress_ = function(e) {
  this.uploadProgress_ = e.event_.loaded / e.event_.total;
  if (this.uploadProgress_ < 1) {
    goog.style.showElement(this.processingStatusEl_, false);
    goog.style.showElement(this.progressBarWrapper_, true);
    goog.style.showElement(this.progressBar_.getElement(), true);
    this.progressBar_.update(this.uploadProgress_);
  } else {
    goog.style.showElement(this.processingStatusEl_, true);
    goog.style.showElement(this.progressBar_.getElement(), false);
    goog.style.showElement(this.progressBarWrapper_, false);
  }
};
chatango.users.EditProfileDialog.prototype.onUploadError = function(e) {
  this.uploadProgress_ = 0;
  goog.style.showElement(this.processingStatusEl_, false);
  goog.style.showElement(this.progressBar_.getElement(), false);
  goog.style.showElement(this.progressBarWrapper_, false);
};
chatango.users.EditProfileDialog.prototype.onUpdateError_ = function(e) {
  this.onChange_();
  this.errorArea_.innerHtml = this.lm_.getString("ep_module", "update_error");
};
chatango.users.EditProfileDialog.prototype.onUnauthed_ = function(e) {
  this.errorArea_.innerHTML = this.lm_.getString("ep_module", "unauthed");
  this.saveBtn_.setEnabled(false);
};
chatango.users.EditProfileDialog.prototype.onFileRead = function(oFREvent) {
  this.thumbEl_.src = this.oFReader.getResult();
};
chatango.users.EditProfileDialog.prototype.updateCopy = function() {
  if (this.content_) {
    this.content_.updateCopy();
  }
  if (this.emailOnly_) {
    this.setTitle(this.lm_.getString("ep_module", "title_email"));
  } else {
    this.setTitle(this.lm_.getString("ep_module", "title"));
    goog.dom.setTextContent(this.processingStatusEl_, this.lm_.getString("ep_module", "processing"));
  }
};
chatango.users.EditProfileDialog.prototype.setVisible = function(visible) {
  goog.base(this, "setVisible", visible);
  if (visible) {
    this.draw();
  }
};
chatango.users.EditProfileDialog.prototype.disposeInternal = function() {
  if (this.model_) {
    goog.events.removeAll(this.model_);
    this.model_.dispose();
    this.model_ = null;
  }
  if (this.helpPopup_) {
    this.helpPopup_.dispose();
    this.helpPopup_ = null;
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.modules.EditProfileModule");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.users.EditProfileDialog");
goog.require("chatango.utils.display");
goog.require("chatango.utils.style");
goog.require("goog.events.EventHandler");
goog.require("goog.math.Coordinate");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning");
goog.require("goog.positioning.Corner");
chatango.modules.EditProfileModule = function(managers) {
  goog.base(this);
  chatango.managers.LanguageManager.getInstance().getStringPack("ep_module", chatango.modules.EditProfileModule.strs, this.initCopy, this);
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.managers_ = managers;
};
goog.inherits(chatango.modules.EditProfileModule, goog.events.EventTarget);
chatango.modules.EditProfileModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("ui") && lm.isPackLoaded("ep_module")) {
    if (this.EditProfileDialog_) {
      this.EditProfileDialog_.updateCopy();
    }
  }
};
chatango.modules.EditProfileModule.prototype.openEditProfileDialog = function(opt_pmMode, optAnchor, optCorner) {
  this.closeEditProfileDialog();
  this.EditProfileDialog_ = new chatango.users.EditProfileDialog(false, opt_pmMode);
  this.EditProfileDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  if (optAnchor) {
    this.popUpAnchor_ = optAnchor;
    this.popUpCorner_ = optCorner ? optCorner : goog.positioning.Corner.TOP_LEFT;
    goog.events.listenOnce(this.EditProfileDialog_, goog.ui.PopupBase.EventType.SHOW, this.onEditProfileDialogShow_, false, this);
  }
  this.EditProfileDialog_.setVisible(true);
  goog.events.listen(this.EditProfileDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onDialogClosed_, false, this);
};
chatango.modules.EditProfileModule.prototype.openEditEmailDialog = function() {
  this.closeEditProfileDialog();
  this.EditProfileDialog_ = new chatango.users.EditProfileDialog(true);
  this.EditProfileDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.EditProfileDialog_.setVisible(true);
  goog.events.listen(this.EditProfileDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onDialogClosed_, false, this);
};
chatango.modules.EditProfileModule.prototype.reloadProfile = function() {
  if (this.EditProfileDialog_) {
    this.EditProfileDialog_.reloadProfile();
    this.EditProfileDialog_.reloadThumb();
  }
};
chatango.modules.EditProfileModule.prototype.reloadThumb = function() {
  if (this.EditProfileDialog_) {
    this.EditProfileDialog_.reloadThumb();
  }
};
chatango.modules.EditProfileModule.prototype.closeEditProfileDialog = function() {
  if (this.EditProfileDialog_) {
    goog.events.unlisten(this.EditProfileDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onDialogClosed_, false, this);
    this.EditProfileDialog_.dispose();
    this.EditProfileDialog_ = null;
  }
};
chatango.modules.EditProfileModule.prototype.onDialogClosed_ = function(e) {
  goog.events.unlisten(this.EditProfileDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onDialogClosed_, false, this);
  this.EditProfileDialog_ = null;
};
chatango.modules.EditProfileModule.prototype.onFloodWarningDialogShow_ = function(e) {
  goog.positioning.positionAtCoordinate(this.popUpAnchor_, this.EditProfileDialog_.getElement(), this.popUpCorner_);
};
chatango.modules.EditProfileModule.prototype.closePopUps = function() {
};
chatango.modules.EditProfileModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.EditProfileDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.EditProfileDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.EditProfileDialog_.getElement(), opt_stageRect, true);
    this.EditProfileDialog_.keepActiveFormElementOnScreen();
  }
};
chatango.modules.EditProfileModule.strs = {"email":"Email", "email_sent":"Check your email for a verification link.", "loading":"Loading profile data", "load_error":"Error loading profile data", "update_error":"Error updating data, please retry", "processing":"Processing picture", "save":"Save", "title":"Edit profile", "title_email":"Verify email", "verify":"Verify", "verify_tt":"Send verification email", "pending_tt":"Email pending verification", "invalid_tt":"Email invalid", "verified_tt":"Email verified", 
"meet_people":"Show in user directory", "meet_people_help":"Allows other Chatango members to find you. When disabled, only your friends and other users in your group chats can see your profile.", "unauthed":"Invalid credentials. Please log in again."};
goog.module.ModuleManager.getInstance().setLoaded("EditProfileModule");

