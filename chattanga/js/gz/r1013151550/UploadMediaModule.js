goog.provide("chatango.modules.UploadMediaModule");
goog.require("chatango.events.FileUploadEvent");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.ui.UploadMediaDialog");
goog.require("chatango.utils.display");
goog.require("goog.events");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
chatango.modules.UploadMediaModule = function() {
  goog.events.EventTarget.call(this);
  this.managers_ = chatango.managers.ManagerManager.getInstance();
};
goog.inherits(chatango.modules.UploadMediaModule, goog.events.EventTarget);
chatango.modules.UploadMediaModule.prototype.uploadMedia = function(media_type, media) {
  this.uploadMediaDialog_ = new chatango.ui.UploadMediaDialog;
  this.uploadMediaDialog_.setVisible(true);
  if (goog.net.cookies.get("un")) {
    var username = chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("un"));
    var password = chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("pw"));
  }
  var baseDomain = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  this.uploadUrl = "//" + baseDomain + "/uploadimg";
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(this.uploadUrl, true);
  var fd = new FormData;
  fd.append("u", username);
  fd.append("p", password);
  fd.append("filedata", media);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onUploadSuccess, undefined, this);
  goog.events.listen(xhr, "progress", this.onUploadProgress, undefined, this);
  goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.onUploadError, undefined, this);
  xhr.send(this.uploadUrl, "POST", fd);
};
chatango.modules.UploadMediaModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.uploadMediaDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h);
    this.uploadMediaDialog_.setMaxHeight(new_h * .95);
    this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
    this.managers_ = chatango.managers.ManagerManager.getInstance();
    chatango.utils.display.constrainToStage(this.uploadMediaDialog_.getElement(), opt_stageRect, true);
    var icon_size = chatango.managers.Style.getInstance().getIconSize();
  }
};
chatango.modules.UploadMediaModule.prototype.onUploadSuccess = function(e) {
  var xhr = e.target;
  if (xhr.getResponseText().split(":")[0] === "error") {
    return this.onUploadError();
  }
  var baseDomain = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  this.lastUrlAbbreviated = "img" + xhr.getResponseText().split(":")[1];
  this.dispatchEvent(chatango.events.FileUploadEvent.EventType.SUCCESS);
  this.uploadMediaDialog_.dispose();
};
chatango.modules.UploadMediaModule.prototype.onUploadProgress = function(e) {
  this.uploadMediaDialog_.updateProgress(e);
};
chatango.modules.UploadMediaModule.prototype.onUploadError = function(e) {
  this.dispatchEvent(chatango.events.FileUploadEvent.EventType.FAILURE);
  this.uploadMediaDialog_.error();
  this.uploadMediaDialog_.dispose();
};
chatango.modules.UploadMediaModule.prototype.getLastUrlUploaded = function() {
  return this.lastUrlUploaded;
};
goog.module.ModuleManager.getInstance().setLoaded("UploadMediaModule");

