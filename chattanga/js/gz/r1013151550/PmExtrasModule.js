goog.provide("chatango.modules.PmExtrasModule");
goog.require("chatango.events.EventType");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.ui.MsgAlert");
goog.require("chatango.ui.PopupMenu");
goog.require("goog.events");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
goog.require("goog.ui.Component");
goog.require("goog.ui.MenuItem");
chatango.modules.PmExtrasModule = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  lm.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  lm.getStringPack("pm", chatango.strings.PmStrings, this.initCopy, this);
  this.blockMenu_ = new chatango.ui.PopupMenu;
  this.blockMenu_.render(document.body);
  this.settingsMenu_ = new chatango.ui.PopupMenu;
  this.settingsMenu_.setToggleMode(true);
  this.settingsMenu_.render(document.body);
  goog.events.listen(this.blockMenu_, goog.ui.Component.EventType.ACTION, this.onBlockMenu_, true, this);
  goog.events.listen(this.settingsMenu_, goog.ui.Component.EventType.ACTION, this.onSettingsMenu_, true, this);
};
goog.addSingletonGetter(chatango.modules.PmExtrasModule);
chatango.modules.PmExtrasModule.prototype.openAlertDialog = function(user, messageData, isFriend) {
  var alertDialog = new chatango.ui.MsgAlert(user.getUid(), user.getType(), messageData.getPlainText(), true, isFriend);
  alertDialog.display();
  return alertDialog;
};
chatango.modules.PmExtrasModule.prototype.openSettingsDialog = function(element, inLists) {
  this.settingsMenu_.removeChildren(true);
  this.settingsMenu_.addChild(new goog.ui.MenuItem("Edit profile", chatango.events.EventType.PM_SETTINGS_EDIT_PROFILE), true);
  this.settingsMenu_.addChild(new goog.ui.MenuItem("Blocked users", chatango.events.EventType.PM_SETTINGS_BLOCKLIST), true);
  if (inLists) {
    this.settingsMenu_.addChild(new goog.ui.MenuItem("Change view options", chatango.events.EventType.PM_SETTINGS_CHANGE_VIEW), true);
  }
  this.settingsMenu_.addChild(new goog.ui.MenuItem("Log out", chatango.events.EventType.PM_SETTINGS_LOGOUT), true);
  this.settingsMenu_.showAtElement(element, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_RIGHT);
  return this.settingsMenu_;
};
chatango.modules.PmExtrasModule.prototype.openBlockDialog = function(element, user, isBlocked) {
  var lm = chatango.managers.LanguageManager.getInstance();
  var key = isBlocked ? "unblock_user" : "block_user";
  var linkString = lm.getString("pm", key).replace("*user*", user.getName());
  this.blockMenu_.removeChildren(true);
  this.blockMenu_.addChild(new goog.ui.MenuItem(linkString), true);
  this.blockMenu_.showAtElement(element, goog.positioning.Corner.BOTTOM_LEFT, goog.positioning.Corner.TOP_RIGHT);
  return this.blockMenu_;
};
chatango.modules.PmExtrasModule.prototype.onBlockMenu_ = function(e) {
  this.blockMenu_.hide();
  this.blockMenu_.dispatchEvent(chatango.events.EventType.BLOCK_USER);
};
chatango.modules.PmExtrasModule.prototype.onSettingsMenu_ = function(e) {
  this.settingsMenu_.hide();
  this.settingsMenu_.dispatchEvent(e.target.getValue());
};
chatango.modules.PmExtrasModule.prototype.initCopy = function(pack_id) {
};
goog.module.ModuleManager.getInstance().setLoaded("PmExtrasModule");

