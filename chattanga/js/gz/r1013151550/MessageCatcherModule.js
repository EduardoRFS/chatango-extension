goog.provide("chatango.strings.MessageCatcherStrings");
chatango.strings.MessageCatcherStrings = {"disable_pm":"Disable PM", "private_msg":"Private message:"};
goog.provide("chatango.modules.MessageCatcherModule");
goog.require("chatango.events.MessageAlertEvent");
goog.require("chatango.events.OpenPmEvent");
goog.require("chatango.managers.Environment");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.networking.MessageCatcherConnection");
goog.require("chatango.networking.MessageCatcherConnectionEvent");
goog.require("chatango.strings.MessageCatcherStrings");
goog.require("chatango.ui.MsgAlert");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.events");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
chatango.modules.MessageCatcherModule = function() {
  goog.events.EventTarget.call(this);
  var lm = chatango.managers.LanguageManager.getInstance();
  lm.getStringPack("msgcatcher", chatango.strings.MessageCatcherStrings, this.initCopy, this);
  lm.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.ignoredUsers_ = {};
};
goog.inherits(chatango.modules.MessageCatcherModule, goog.events.EventTarget);
chatango.modules.MessageCatcherModule.prototype.initCopy = function(pack_id) {
};
chatango.modules.MessageCatcherModule.prototype.connect = function(user) {
  this.mcConnection_ = new chatango.networking.MessageCatcherConnection;
  goog.events.listen(this.mcConnection_, chatango.networking.MessageCatcherConnectionEvent.EventType.msgcount, this.onMessageCount, false, this);
  goog.events.listen(this.mcConnection_, chatango.networking.MessageCatcherConnectionEvent.EventType.msg, this.onMessage, false, this);
  goog.events.listen(this.mcConnection_, chatango.networking.ConnectionStatusEvent.EventType.CONNECTED, this.onConnect_, false, this);
  goog.events.listen(this.mcConnection_, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.onDisconnect_, false, this);
  this.mcConnection_.connect();
};
chatango.modules.MessageCatcherModule.prototype.disconnect = function() {
  if (this.mcConnection_) {
    goog.events.unlisten(this.mcConnection_, chatango.networking.MessageCatcherConnectionEvent.EventType.msgcount, this.onMessageCount, false, this);
    goog.events.unlisten(this.mcConnection_, chatango.networking.MessageCatcherConnectionEvent.EventType.msg, this.onMessage, false, this);
    this.mcConnection_.selfKickOff(true);
    this.mcConnection_.dispose();
    this.mcConnection_ = null;
  }
};
chatango.modules.MessageCatcherModule.prototype.onMessageCount = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.MessageCatcherModule.prototype.onConnect_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.MessageCatcherModule.prototype.onDisconnect_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.MessageCatcherModule.prototype.isConnected = function() {
  if (!this.mcConnection_) {
    return false;
  }
  return this.mcConnection_.isConnected();
};
chatango.modules.MessageCatcherModule.prototype.onMessage = function(e) {
  this.dispatchEvent(e);
  var uid = uidToPotentiallyIgnore = e.data[1];
  var displayHandle = e.data[2];
  var userType = displayHandle == "" ? chatango.users.User.UserType.ANON : chatango.users.User.UserType.SELLER;
  if (userType == chatango.users.User.UserType.ANON) {
    uidToPotentiallyIgnore = chatango.events.MessageAlertEvent.ANON;
  }
  if (this.ignoredUsers_[uidToPotentiallyIgnore] == true) {
    return;
  }
  var alertDialog = new chatango.ui.MsgAlert(uid, userType, e.data[4]);
  alertDialog.display();
  goog.events.listen(alertDialog, chatango.ui.TopAlertDialog.EventType.ANIM_OUT_COMPLETE, this.onAlertClosed_, false, this);
  goog.events.listen(alertDialog, chatango.events.MessageAlertEvent.EventType.IGNORE, this.onIgnore_, false, this);
  goog.events.listen(alertDialog, chatango.events.MessageAlertEvent.EventType.REPLY, this.onReply_, false, this);
  goog.events.listen(alertDialog, chatango.events.MessageAlertEvent.EventType.DISABLE, this.onDisable_, false, this);
};
chatango.modules.MessageCatcherModule.prototype.onAlertClosed_ = function(e) {
  var alertDialog = e.target;
  if (!alertDialog) {
    return;
  }
  this.unsetAlertListeners_(alertDialog);
  alertDialog.dispose();
  alertDialog = null;
};
chatango.modules.MessageCatcherModule.prototype.unsetAlertListeners_ = function(alertDialog) {
  goog.events.unlisten(alertDialog, chatango.ui.TopAlertDialog.EventType.ANIM_OUT_COMPLETE, this.onAlertClosed_, false, this);
  goog.events.unlisten(alertDialog, chatango.events.MessageAlertEvent.EventType.IGNORE, this.onIgnore_, false, this);
  goog.events.unlisten(alertDialog, chatango.events.MessageAlertEvent.EventType.REPLY, this.onReply_, false, this);
  goog.events.unlisten(alertDialog, chatango.events.MessageAlertEvent.EventType.DISABLE, this.onDisable_, false, this);
};
chatango.modules.MessageCatcherModule.prototype.onIgnore_ = function(e) {
  var uid = e.getUid();
  if (uid) {
    this.ignoredUsers_[uid] = true;
  }
  this.onAlertClosed_(e);
};
chatango.modules.MessageCatcherModule.prototype.onReply_ = function(e) {
  this.dispatchEvent(new chatango.events.OpenPmEvent(e.getUid(), e.getUserType()));
  this.onAlertClosed_(e);
};
chatango.modules.MessageCatcherModule.prototype.onDisable_ = function(e) {
  this.disconnect();
  this.onAlertClosed_(e);
};
goog.module.ModuleManager.getInstance().setLoaded("MessageCatcherModule");

