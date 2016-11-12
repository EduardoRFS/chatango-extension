goog.provide("chatango.strings.WarningDialogStrings");
chatango.strings.WarningDialogStrings = {"ok":"OK", "broadcast_mode":"Broadcast mode", "group_closed":"Group currently closed", "only_mods":"A group administrator has set this group so that only the owner and designated moderators can post.", "closed_desc":'A group administrator turned on "Closed without moderators" mode. The group will automatically re-open when at least one moderator is present.', "no_perm":"No permission", "no_perm_staff":"You don't have permission to edit an administrator.", 
"no_toggle":"Can not toggle", "admin_is_staff":"Administrators that can add and remove mods are always staff.", "proxy_ban_title":"Proxies banned", "proxy_ban_desc":"We have detected that you are connecting through a proxy. Administrators of this group have disabled messaging through proxies."};
goog.provide("chatango.modules.WarningDialogModule");
goog.require("chatango.strings.WarningDialogStrings");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.utils.display");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.WarningDialogModule = function() {
  this.anchorEl_ = null;
  this.anchorCnr_ = null;
  this.dialogCnr_ = null;
  this.titleKey_ = undefined;
  this.bodyKey_ = undefined;
  this.okBtnKey_ = undefined;
  this.alignOffset_ = null;
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  chatango.managers.LanguageManager.getInstance().getStringPack("warnings", chatango.strings.WarningDialogStrings, this.initCopy, this);
};
goog.addSingletonGetter(chatango.modules.WarningDialogModule);
chatango.modules.WarningDialogModule.prototype.closePopUps = function() {
  this.closeWarningDialog();
};
chatango.modules.WarningDialogModule.prototype.constrainDialogsToScreen = function() {
  if (this.warningDialog_) {
    chatango.utils.display.constrainToStage(this.warningDialog_.getElement());
    chatango.utils.display.keepActiveFormElementOnScreen(this.warningDialog_.getElement());
  }
};
chatango.modules.WarningDialogModule.prototype.openWarningDialog = function(titleKey, bodyKey, anchorEl, anchorCnr, dialogCnr, opt_alignOffset, opt_okBtnKey) {
  this.closeWarningDialog();
  this.warningDialog_ = new chatango.ui.WarningDialog("");
  goog.events.listenOnce(this.warningDialog_, goog.ui.PopupBase.EventType.SHOW, this.onWarningDialogShow_, false, this);
  this.anchorEl_ = anchorEl;
  this.anchorCnr_ = anchorCnr;
  this.dialogCnr_ = dialogCnr;
  this.alignOffset_ = opt_alignOffset ? opt_alignOffset : new goog.math.Coordinate(20, -20);
  this.bodyKey_ = bodyKey;
  this.titleKey_ = titleKey;
  this.okBtnKey_ = opt_okBtnKey;
  this.initCopy();
  this.warningDialog_.setVisible(true);
};
chatango.modules.WarningDialogModule.prototype.onWarningDialogShow_ = function(e) {
  goog.positioning.positionAtAnchor(this.anchorEl_, this.anchorCnr_, this.warningDialog_.getElement(), this.dialogCnr_, this.alignOffset_);
  chatango.utils.display.constrainToStage(this.warningDialog_.getElement());
};
chatango.modules.WarningDialogModule.prototype.closeWarningDialog = function() {
  if (this.warningDialog_) {
    this.warningDialog_.dispose();
  }
  this.warningDialog_ = null;
};
chatango.modules.WarningDialogModule.prototype.initCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("ui") && lm.isPackLoaded("warnings")) {
    if (this.warningDialog_) {
      if (this.bodyKey_) {
        var bodyCopy = lm.getString("warnings", this.bodyKey_);
        this.warningDialog_.setBodyCopy(bodyCopy);
      }
      if (this.titleKey_) {
        var titleCopy = lm.getString("warnings", this.titleKey_);
        this.warningDialog_.setTitle(titleCopy);
      }
      if (this.okBtnKey_) {
        var okBtnCopy = lm.getString("warnings", this.okBtnKey_);
        this.warningDialog_.setOkBtnCopy(okBtnCopy);
        this.warningDialog_.showOkBtn(true);
      } else {
        this.warningDialog_.showOkBtn(false);
      }
      chatango.utils.display.constrainToStage(this.warningDialog_.getElement());
    }
  }
};
goog.module.ModuleManager.getInstance().setLoaded("WarningDialogModule");

