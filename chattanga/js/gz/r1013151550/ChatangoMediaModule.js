goog.provide("chatango.media.mediaPlayerPopup");
goog.require("chatango.ui.ScrollableDialog");
chatango.media.mediaPlayerPopup = function(sid, opt_width, opt_height, opt_defaultValue, opt_class, opt_useIframeForIE, opt_domHelper) {
  this.sid_ = sid;
  var auto_size = true;
  chatango.ui.ScrollableDialog.call(this, opt_width, opt_height, auto_size, opt_defaultValue, opt_class, opt_useIframeForIE, opt_domHelper);
  this.setContent("Sorry, Chatango does not support media playback in this device yet");
  this.showTitleBarBg(false);
};
goog.inherits(chatango.media.mediaPlayerPopup, chatango.ui.ScrollableDialog);
chatango.media.mediaPlayerPopup.prototype.getSid = function() {
  return this.sid_;
};
chatango.media.mediaPlayerPopup.prototype.disposeInternal = function() {
  chatango.media.mediaPlayerPopup.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.media.ChatangoMediaModule");
goog.require("chatango.media.mediaPlayerPopup");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.module.ModuleManager");
goog.require("goog.style");
goog.require("goog.ui.Dialog");
chatango.media.ChatangoMediaModule = function() {
  if (chatango.DEBUG) {
    this.logger.info("Chatango Media Module CONSTRUCTOR");
  }
  this.playerPopups_ = {};
};
goog.addSingletonGetter(chatango.media.ChatangoMediaModule);
chatango.media.ChatangoMediaModule.prototype.logger = goog.debug.Logger.getLogger("chatango.media.ChatangoMediaModule");
chatango.media.ChatangoMediaModule.prototype.openPlayerPopup = function(sid) {
  if (this.playerPopups_[sid]) {
    this.closePlayerPopup(sid);
  }
  var pu = new chatango.media.mediaPlayerPopup(" ", 200, 150);
  pu.setVisible(true);
  pu.setHasTitleCloseButton(true);
  pu.getElement().style.position = "absolute";
  pu.setResizable(false);
  this.playerPopups_[sid] = pu;
  goog.events.listen(this.playerPopups_[sid], goog.ui.Dialog.EventType.AFTER_HIDE, this.onPlayerPopUpClosed, false, this);
};
chatango.media.ChatangoMediaModule.prototype.closePlayerPopup = function(sid) {
  if (chatango.DEBUG) {
    this.logger.info("close pu: " + this.playerPopups_[sid]);
  }
  if (this.playerPopups_[sid]) {
    goog.events.removeAll(this.playerPopups_[sid]);
    this.playerPopups_[sid].dispose();
    delete this.playerPopups_[sid];
  }
};
chatango.media.ChatangoMediaModule.prototype.onPlayerPopUpClosed = function(e) {
  this.closePlayerPopup(e.target.getSid());
};
goog.module.ModuleManager.getInstance().setLoaded("ChatangoMediaModule");

