goog.provide("chatango.group.moderation.ChooseModIconDialog");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.ui.icons.SvgStaffIcon");
goog.require("chatango.ui.Select");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.utils.style");
goog.require("goog.events.EventType");
goog.require("goog.ui.Component.EventType");
chatango.group.moderation.ChooseModIconDialog = function() {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .3);
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, undefined);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.model_ = chatango.users.ModeratorManager.getInstance();
  this.setResizable(false);
};
goog.inherits(chatango.group.moderation.ChooseModIconDialog, chatango.ui.ScrollableDialog);
chatango.group.moderation.ChooseModIconDialog.ModIconOptions = {NO_ICON:0, MOD_ICON:chatango.group.moderation.Permissions.Flags.MOD_ICON_VISIBLE, STAFF_ICON:chatango.group.moderation.Permissions.Flags.STAFF_ICON_VISIBLE};
chatango.group.moderation.ChooseModIconDialog.EventType = {MOD_ICON_CHANGE:"mod_icon_change"};
chatango.group.moderation.ChooseModIconDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  this.setTitle(this.lm_.getString("choose_mod_icon_module", "choose_mod_icon"));
  var scrollContent = this.getContentElement();
  this.contentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.contentEl_, "sdlg-sc");
  goog.dom.classes.add(this.contentEl_, "content-dialog");
  this.textEl_ = goog.dom.createDom("div", {}, this.lm_.getString("choose_mod_icon_module", "dialog_text"));
  var staffIconSize = chatango.ui.icons.SvgStaffIcon.getDefaultSize();
  this.currentModIconWrap_ = goog.dom.createDom("div", {"class":"curr-mod-icon-wrap", "style":"min-width:" + staffIconSize.width + "px;"});
  this.modViewIcon_ = new chatango.ui.icons.SvgModIcon;
  this.modViewIconWrap_ = goog.dom.createDom("div", {"class":"mod-icon-wrap", "style":"width:" + staffIconSize.width + "px; height:" + staffIconSize.width + "px;"});
  this.modViewIconWrap_.style.display = "none";
  this.modViewIcon_.render(this.modViewIconWrap_);
  this.staffViewIcon_ = new chatango.ui.icons.SvgStaffIcon;
  this.staffViewIconWrap_ = goog.dom.createDom("div", {"class":"mod-icon-wrap staff_icon", "style":"width:" + staffIconSize.width + "px; height:" + staffIconSize.height + "px;"});
  this.staffViewIcon_.render(this.staffViewIconWrap_);
  this.staffViewIconWrap_.style.display = "none";
  this.iconSelectWrap_ = goog.dom.createDom("div", {"style":"margin-top: 1em; display:inline-block"});
  this.iconSelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  this.noItem_ = goog.dom.createDom("div");
  this.noItemText_ = goog.dom.createDom("span", {}, this.lm_.getString("choose_mod_icon_module", "no_icon"));
  this.noItemIconWrap_ = goog.dom.createDom("div", {"class":"mod-icon-wrap", "style":"width:" + staffIconSize.width + "px; height:" + staffIconSize.width + "px;"});
  goog.dom.appendChild(this.noItem_, this.noItemIconWrap_);
  goog.dom.appendChild(this.noItem_, this.noItemText_);
  this.modItem_ = goog.dom.createDom("div");
  this.modItemText_ = goog.dom.createDom("span", {}, this.lm_.getString("choose_mod_icon_module", "mod_icon"));
  this.modItemIcon_ = new chatango.ui.icons.SvgModIcon;
  this.modItemIconWrap_ = goog.dom.createDom("div", {"class":"mod-icon-wrap", "style":"width:" + staffIconSize.width + "px; height:" + staffIconSize.width + "px;"});
  this.modItemIcon_.render(this.modItemIconWrap_);
  goog.dom.appendChild(this.modItem_, this.modItemIconWrap_);
  goog.dom.appendChild(this.modItem_, this.modItemText_);
  this.staffItem_ = goog.dom.createDom("div");
  this.staffItemText_ = goog.dom.createDom("span", {}, this.lm_.getString("choose_mod_icon_module", "staff_icon"));
  this.staffItemIcon_ = new chatango.ui.icons.SvgStaffIcon;
  this.staffItemIconWrap_ = goog.dom.createDom("div", {"class":"mod-icon-wrap staff_icon", "style":"width:" + staffIconSize.width + "px; height:" + staffIconSize.height + "px;"});
  this.staffItemIcon_.render(this.staffItemIconWrap_);
  goog.dom.appendChild(this.staffItem_, this.staffItemIconWrap_);
  goog.dom.appendChild(this.staffItem_, this.staffItemText_);
  if (this.model_.getModVisibility() != chatango.group.moderation.Permissions.ModVisibilityOptions.SHOW_MOD_ICONS) {
    this.iconSelect_.addItem(new goog.ui.MenuItem(this.noItem_, chatango.group.moderation.ChooseModIconDialog.ModIconOptions.NO_ICON));
  }
  this.iconSelect_.addItem(new goog.ui.MenuItem(this.modItem_, chatango.group.moderation.ChooseModIconDialog.ModIconOptions.MOD_ICON));
  this.iconSelect_.addItem(new goog.ui.MenuItem(this.staffItem_, chatango.group.moderation.ChooseModIconDialog.ModIconOptions.STAFF_ICON));
  this.iconSelect_.render(this.iconSelectWrap_);
  this.iconSelect_.setSelectedIndex(0);
  goog.dom.appendChild(this.contentEl_, this.textEl_);
  goog.dom.appendChild(this.contentEl_, this.currentModIconWrap_);
  goog.dom.appendChild(this.currentModIconWrap_, this.modViewIconWrap_);
  goog.dom.appendChild(this.currentModIconWrap_, this.staffViewIconWrap_);
  goog.dom.appendChild(this.contentEl_, this.iconSelectWrap_);
  goog.dom.appendChild(scrollContent, this.contentEl_);
  goog.events.listen(this.iconSelect_, goog.ui.Component.EventType.ACTION, this.onModIconSelect_, false, this);
  this.updateCopy();
};
chatango.group.moderation.ChooseModIconDialog.prototype.getModIconSetting = function() {
  return this.iconSelect_.getValue();
};
chatango.group.moderation.ChooseModIconDialog.prototype.onModIconSelect_ = function(e) {
  var sid = chatango.users.UserManager.getInstance().currentUser.getSid();
  if (this.model_.getModIcon(sid) == this.iconSelect_.getValue()) {
    return;
  }
  if (!this.model_.isOwner(sid)) {
    this.iconSelect_.setEnabled(false);
  }
  this.dispatchEvent(chatango.group.moderation.ChooseModIconDialog.EventType.MOD_ICON_CHANGE);
};
chatango.group.moderation.ChooseModIconDialog.prototype.updateCopy = function() {
  var icon_value = this.model_.getModIcon(chatango.users.UserManager.getInstance().currentUser.getSid());
  if (icon_value == chatango.group.moderation.ChooseModIconDialog.ModIconOptions.NO_ICON && this.model_.getModVisibility() == chatango.group.moderation.Permissions.ModVisibilityOptions.SHOW_MOD_ICONS) {
    icon_value = chatango.group.moderation.ChooseModIconDialog.ModIconOptions.MOD_ICON;
  }
  this.iconSelect_.setValue(icon_value);
  this.iconSelect_.setEnabled(true);
  this.modViewIconWrap_.style.display = "none";
  this.staffViewIconWrap_.style.display = "none";
  if (icon_value == chatango.group.moderation.ChooseModIconDialog.ModIconOptions.STAFF_ICON) {
    this.staffViewIconWrap_.style.display = "inline-block";
  } else {
    if (icon_value == chatango.group.moderation.ChooseModIconDialog.ModIconOptions.MOD_ICON) {
      this.modViewIconWrap_.style.display = "inline-block";
    }
  }
};
chatango.group.moderation.ChooseModIconDialog.prototype.disposeInternal = function() {
  if (this.iconSelect_) {
    goog.events.unlisten(this.iconSelect_, goog.ui.Component.EventType.ACTION, this.onModIconSelect_, false, this);
    this.iconSelect_.dispose();
    this.iconSelect_ = null;
    this.modViewIcon_.dispose();
    this.modViewIcon_ = null;
    this.staffViewIcon_.dispose();
    this.staffViewIcon = null;
  }
  chatango.group.moderation.ChooseModIconDialog.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.ChooseModIconModule");
goog.require("chatango.group.moderation.ChooseModIconDialog");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
goog.require("goog.net.cookies");
chatango.modules.ChooseModIconModule = function(connection) {
  chatango.managers.LanguageManager.getInstance().getStringPack("choose_mod_icon_module", chatango.modules.ChooseModIconModule.strs, this.initCopy, this);
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.connection_ = connection;
  this.ChooseModIconDialog_ = null;
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  goog.events.listen(this.mm_, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, this.onFlagsUpdated_, false, this);
  goog.events.listen(this.mm_, chatango.users.ModeratorManager.EventType.MOD_VISIBILITY_CHANGE, this.onVisibilityChange_, false, this);
};
chatango.modules.ChooseModIconModule.prototype.onFlagsUpdated_ = function(e) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var isStaff = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.IS_STAFF);
  if (!isStaff && this.ChooseModIconDialog_) {
    this.closePopUps();
  } else {
    if (this.ChooseModIconDialog_) {
      this.ChooseModIconDialog_.updateCopy();
    }
  }
};
chatango.modules.ChooseModIconModule.prototype.onVisibilityChange_ = function(e) {
  var visibility = this.mm_.getModVisibility();
  if (this.mm_.getModVisibility() != chatango.group.moderation.Permissions.ModVisibilityOptions.MODS_CHOOSE_VISIBILITY && this.ChooseModIconDialog_) {
    this.closePopUps();
  }
};
chatango.modules.ChooseModIconModule.prototype.closePopUps = function() {
  this.closeChooseModIconDialog_();
};
chatango.modules.ChooseModIconModule.prototype.closeChooseModIconDialog_ = function() {
  if (this.ChooseModIconDialog_) {
    goog.events.unlisten(this.ChooseModIconDialog_, chatango.group.moderation.ChooseModIconDialog.EventType.MOD_ICON_CHANGE, this.setModIcon_, false, this);
    this.ChooseModIconDialog_.dispose();
    this.ChooseModIconDialog_ = null;
  }
};
chatango.modules.ChooseModIconModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var new_h = Math.round(stage_h * .95);
  if (this.ChooseModIconDialog_) {
    this.ChooseModIconDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.ChooseModIconDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.ChooseModIconDialog_.getElement());
  }
};
chatango.modules.ChooseModIconModule.prototype.openChooseModIconDialog = function() {
  this.closeChooseModIconDialog_();
  this.ChooseModIconDialog_ = new chatango.group.moderation.ChooseModIconDialog;
  this.ChooseModIconDialog_.setFullScreenOnMobileAndSmallEmbeds(false);
  this.ChooseModIconDialog_.setVisible(true);
  goog.events.listen(this.ChooseModIconDialog_, chatango.group.moderation.ChooseModIconDialog.EventType.MOD_ICON_CHANGE, this.setModIcon_, false, this);
};
chatango.modules.ChooseModIconModule.prototype.setModIcon_ = function(e) {
  this.setModIcon(e.target.getModIconSetting());
};
chatango.modules.ChooseModIconModule.prototype.setModIcon = function(e) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  if (this.mm_.isOwner(currentUser.getSid())) {
    goog.net.cookies.set(this.mm_.getGroupHandle() + "_icon_setting", e, 31536E3, "/");
    this.mm_.dispatchEvent(chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE);
  } else {
    this.connection_.send("setmodicon:" + e);
  }
};
chatango.modules.ChooseModIconModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("ui") && lm.isPackLoaded("choose_mod_icon_module")) {
    if (this.ChooseModIconDialog_) {
      this.ChooseModIconDialog_.updateCopy();
    }
  }
};
chatango.modules.ChooseModIconModule.strs = {"choose_mod_icon":"Choose Moderator Badge", "dialog_text":"Badge to show on your messages", "no_icon":"No badge", "mod_icon":"Mod badge", "staff_icon":"Staff badge"};
goog.module.ModuleManager.getInstance().setLoaded("ChooseModIconModule");

