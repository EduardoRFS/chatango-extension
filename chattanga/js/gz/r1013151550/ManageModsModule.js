goog.provide("chatango.ui.icons.SvgAdminIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgAdminIcon = function(opt_canEdit, opt_viewBoxValue, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, undefined, opt_domHelper);
  this.viewBoxValue_ = opt_viewBoxValue || "0 0 100 100";
  this.canEditMods_ = opt_canEdit;
};
goog.inherits(chatango.ui.icons.SvgAdminIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgAdminIcon.prototype.draw = function() {
  var color = this.canEditMods_ ? "#FF6600" : "#FFCC00";
  var svgString = '<svg width="100%" height="100%" overflow="hidden" viewBox="' + this.viewBoxValue_ + '">' + "<defs></defs>" + '<g style="display: block;">' + '<path stroke="none" fill="' + color + '" d="M22.45 69.25 L24.75 69.25 24.8 69.2 22.45 69.25 M72.25 69.25 L74.55 69.25 74.6 69.2 72.25 69.25 M75.1 68.3 L100 26 100 100 0 100 0 26.7 24.9 69 50.2 26 75.1 68.3"/>';
  if (this.canEditMods_) {
    svgString = svgString + '<circle  fill="' + color + '"  cx="50" cy="22" r="15"/>';
  }
  svgString = svgString + "</g></svg>";
  this.element_.innerHTML = svgString;
  goog.dom.classes.add(this.element_, "mod-icon");
};
chatango.ui.icons.SvgAdminIcon.prototype.setCanEdit = function(canEdit) {
  this.canEditMods_ = canEdit;
  this.draw();
};
chatango.ui.icons.SvgAdminIcon.prototype.setViewBox = function(viewBoxValue) {
  this.viewBoxValue_ = viewBoxValue;
  if (this.element_) {
    this.draw();
  }
};
goog.provide("chatango.ui.icons.SvgOwnerIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgOwnerIcon = function(opt_color, opt_viewBoxValue, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.viewBoxValue_ = opt_viewBoxValue || "0 0 100 100";
  this.color_ = opt_color || "#663399";
};
goog.inherits(chatango.ui.icons.SvgOwnerIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgOwnerIcon.prototype.draw = function() {
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="' + this.viewBoxValue_ + '">' + "<defs></defs>" + '<g style="display: block;">' + '<path stroke="none" fill="' + this.color_ + '" d="M22.45 69.25 L24.75 69.25 24.8 69.2 22.45 69.25 M72.25 69.25 L74.55 69.25 74.6 69.2 72.25 69.25 M75.1 68.3 L100 26 100 100 0 100 0 26.7 24.9 69 50.2 26 75.1 68.3"/>' + '<circle  fill="' + this.color_ + '"  cx="50" cy="22" r="15"/>' + "</g>" + "</svg>";
  goog.dom.classes.add(this.element_, "mod-icon");
};
chatango.ui.icons.SvgOwnerIcon.prototype.setViewBox = function(viewBoxValue) {
  this.viewBoxValue_ = viewBoxValue;
  if (this.element_) {
    this.draw();
  }
};
goog.provide("chatango.group.moderation.ModeratorSelect");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.ui.icons.SvgAdminIcon");
goog.require("chatango.ui.Select");
chatango.group.moderation.ModeratorSelect = function() {
  chatango.ui.Select.call(this, null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
};
goog.inherits(chatango.group.moderation.ModeratorSelect, chatango.ui.Select);
chatango.group.moderation.ModeratorSelect.ModType = {MOD:"ms_mod", ADMIN:"ms-admin"};
chatango.group.moderation.ModeratorSelect.prototype.createDom = function(e) {
  chatango.group.moderation.ModeratorSelect.superClass_.createDom.call(this);
  this.setEnabled(true);
  var selectMenuModIconWrapEl_ = goog.dom.createDom("div", {"class":"modlisting_icon"});
  var selectMenuModIcon = new chatango.ui.icons.SvgModIcon;
  selectMenuModIcon.render(selectMenuModIconWrapEl_);
  var modMenuItem = goog.dom.createDom("div");
  goog.dom.appendChild(modMenuItem, selectMenuModIconWrapEl_);
  this.modMenuItemCopyEl_ = goog.dom.createDom("span");
  goog.dom.appendChild(modMenuItem, this.modMenuItemCopyEl_);
  this.modItem_ = new goog.ui.MenuItem(modMenuItem, chatango.group.moderation.ModeratorSelect.ModType.MOD);
  this.addItem(this.modItem_);
  var selectMenuAdminIconWrapEl_ = goog.dom.createDom("div", {"class":"modlisting_icon"});
  var selectMenuAdminIcon = new chatango.ui.icons.SvgAdminIcon;
  selectMenuAdminIcon.render(selectMenuAdminIconWrapEl_);
  var adminMenuItem = goog.dom.createDom("div");
  goog.dom.appendChild(adminMenuItem, selectMenuAdminIconWrapEl_);
  this.adminMenuItemCopyEl_ = goog.dom.createDom("span");
  goog.dom.appendChild(adminMenuItem, this.adminMenuItemCopyEl_);
  this.adminItem_ = new goog.ui.MenuItem(adminMenuItem, chatango.group.moderation.ModeratorSelect.ModType.ADMIN);
  this.addItem(this.adminItem_);
  this.setFocusablePopupMenu(true);
  this.setScrollOnOverflow(true);
};
chatango.group.moderation.ModeratorSelect.prototype.updateCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.modMenuItemCopyEl_.innerHTML = lm.getString("manage_mods_module", "moderator");
  this.adminMenuItemCopyEl_.innerHTML = lm.getString("manage_mods_module", "admin");
};
chatango.group.moderation.ModeratorSelect.prototype.selectModType = function(modType) {
  switch(modType) {
    case chatango.group.moderation.ModeratorSelect.ModType.MOD:
      this.getSelectionModel().setSelectedItem(this.modItem_);
      break;
    case chatango.group.moderation.ModeratorSelect.ModType.ADMIN:
      this.getSelectionModel().setSelectedItem(this.adminItem_);
      break;
  }
};
chatango.group.moderation.ModeratorSelect.prototype.disposeInternal = function() {
  if (this.modItem_) {
    this.modItem_.dispose();
    this.modItem_ = null;
  }
  if (this.adminItem_) {
    this.adminItem_.dispose();
    this.adminItem_ = null;
  }
  chatango.group.moderation.ModeratorSelect.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.moderation.EditModDialog");
goog.require("chatango.group.moderation.ModeratorSelect");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.ui.icons.SvgOwnerIcon");
goog.require("chatango.ui.icons.SvgAdminIcon");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.users.ModeratorManager");
goog.require("goog.array");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
goog.require("goog.object");
chatango.group.moderation.EditModDialog.EventType = {"UPDATE":"update"};
chatango.group.moderation.EditModDialog = function(sid, flags, opt_domHelper) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.sid_ = sid;
  this.flags_ = flags;
  this.lastSavedFlags_ = flags;
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  this.backButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "back"));
  this.saveButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "save"));
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper, true);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("manage_mods_module", "edit_permissions").replace("*name*", this.sid_));
  this.setResizable(false);
};
goog.inherits(chatango.group.moderation.EditModDialog, chatango.ui.ScrollableDialog);
chatango.group.moderation.EditModDialog.ModeratorCheckboxes = [{title:"see_mod_actions", flags:chatango.group.moderation.Permissions.Flags.SEE_MOD_ACTIONS}, {title:"see_ips", flags:chatango.group.moderation.Permissions.Flags.SEE_IPS}, {title:"can_broadcast", flags:chatango.group.moderation.Permissions.Flags.CAN_BROADCAST}, {title:"set_banned_cont", desc:"ban_cont_desc", flags:chatango.group.moderation.Permissions.Flags.EDIT_BW}, {title:"set_auto_mod", flags:chatango.group.moderation.Permissions.Flags.EDIT_NLP}, 
{title:"no_sending_limitations", desc:"sending_limitations_desc", flags:chatango.group.moderation.Permissions.Flags.NO_SENDING_LIMITATIONS}, {title:"display_staff_icon", desc:"display_staff_icon_desc", flags:chatango.group.moderation.Permissions.Flags.IS_STAFF}];
chatango.group.moderation.EditModDialog.AdminCheckboxes = [{title:"edit_gp", desc:"edit_gp_desc", flags:chatango.group.moderation.Permissions.Flags.EDIT_GROUP}, {title:"set_gp_annc", flags:chatango.group.moderation.Permissions.Flags.EDIT_GP_ANNC}, {title:"set_chat_rstrct", desc:"set_chat_rstrct_desc", flags:chatango.group.moderation.Permissions.Flags.EDIT_RESTRICTIONS}, {title:"close_group", desc:"close_group_desc", flags:chatango.group.moderation.Permissions.Flags.CLOSE_GROUP}, {title:"add_rem_mods", 
desc:"add_rem_mods_desc", flags:chatango.group.moderation.Permissions.Flags.EDIT_MODS}];
chatango.group.moderation.EditModDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var scrollContent = this.getContentElement();
  goog.dom.removeChildren(scrollContent);
  this.contentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.contentEl_, "sdlg-sc");
  goog.dom.classes.add(this.contentEl_, "content-dialog");
  goog.dom.append(scrollContent, this.contentEl_);
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  this.errorDiv_ = goog.dom.createDom("div", {"class":"edit-mod-error"});
  goog.dom.appendChild(this.footerContentEl_, this.errorDiv_);
  var buttons = goog.dom.createDom("div", {"style":"overflow:hidden;"});
  goog.dom.classes.add(buttons, "fr");
  this.backButton_.render(buttons);
  goog.dom.appendChild(this.footerContentEl_, buttons);
  goog.style.setStyle(this.footerContentEl_, "overflow", "hidden");
  goog.events.listen(this.backButton_, goog.ui.Component.EventType.ACTION, this.onBackClicked_, false, this);
  this.saveButton_.render(buttons);
  goog.dom.appendChild(this.footerContentEl_, buttons);
  goog.style.setStyle(this.footerContentEl_, "overflow", "hidden");
  goog.events.listen(this.saveButton_, goog.ui.Component.EventType.ACTION, this.onSaveClicked_, false, this);
  if (chatango.users.UserManager.getInstance().currentUser.isOwner()) {
    var topSection = goog.dom.createDom("div", {"class":"sdlg-section", "style":"border-bottom:1px solid #CCC; margin-bottom: 1em;"});
    goog.dom.appendChild(this.contentEl_, topSection);
    this.defaultPermissionsEl_ = goog.dom.createDom("div", {"style":"display:inline-block; margin-right:1.5em;"});
    goog.dom.appendChild(topSection, this.defaultPermissionsEl_);
    this.modSelect_ = new chatango.group.moderation.ModeratorSelect;
    this.modSelect_.render(topSection);
    goog.events.listen(this.modSelect_, "change", this.modSelectChanged_, false, this);
  }
  var modTitleWrapEl = goog.dom.createDom("div", {"class":"sdlg-heading"});
  goog.dom.appendChild(this.contentEl_, modTitleWrapEl);
  var modIcon = new chatango.ui.icons.SvgModIcon;
  modIcon.render(modTitleWrapEl);
  goog.dom.classes.add(modIcon.getElement(), "edit-mod-title-icon");
  this.modTitleEl_ = goog.dom.createDom("span");
  goog.dom.appendChild(modTitleWrapEl, this.modTitleEl_);
  this.modCbWrapEl_ = goog.dom.createDom("div", {"class":"sdlg-top-section cb-section", "style":"margin-bottom:1.5em"});
  goog.dom.appendChild(this.contentEl_, this.modCbWrapEl_);
  this.delMsgsEl_ = goog.dom.createDom("div", {"class":"reqd_permission"});
  goog.dom.appendChild(this.modCbWrapEl_, this.delMsgsEl_);
  this.banUsersEl_ = goog.dom.createDom("div", {"class":"reqd_permission"});
  goog.dom.appendChild(this.modCbWrapEl_, this.banUsersEl_);
  this.checkBoxes_ = [];
  var len = chatango.group.moderation.EditModDialog.ModeratorCheckboxes.length;
  var obj;
  for (var i = 0;i < len;i++) {
    obj = chatango.group.moderation.EditModDialog.ModeratorCheckboxes[i];
    this.makeCheckboxItem_(obj, this.modCbWrapEl_);
  }
  if (chatango.users.UserManager.getInstance().currentUser.isOwner()) {
    var adminTitleWrapEl = goog.dom.createDom("div", {"class":"sdlg-heading"});
    goog.dom.appendChild(this.contentEl_, adminTitleWrapEl);
    this.adminIcon_ = new chatango.ui.icons.SvgAdminIcon;
    this.adminIcon_.render(adminTitleWrapEl);
    goog.dom.classes.add(this.adminIcon_.getElement(), "edit-mod-title-icon");
    this.adminTitleEl_ = goog.dom.createDom("span");
    goog.dom.appendChild(adminTitleWrapEl, this.adminTitleEl_);
    this.adminCbWrapEl_ = goog.dom.createDom("div", {"class":"sdlg-top-section cb-section"});
    goog.dom.appendChild(this.contentEl_, this.adminCbWrapEl_);
    var len = chatango.group.moderation.EditModDialog.AdminCheckboxes.length;
    var obj;
    for (var i = 0;i < len;i++) {
      obj = chatango.group.moderation.EditModDialog.AdminCheckboxes[i];
      this.makeCheckboxItem_(obj, this.adminCbWrapEl_);
      if (obj.title == "add_rem_mods") {
        this.addRemModsCheckbox_ = this.checkBoxes_[this.checkBoxes_.length - 1];
      }
    }
  }
  this.updateOwnerUiBasedOnModType_();
  this.warningEl_ = goog.dom.createDom("div", {"class":"sdlg-section fineprint"});
  goog.dom.appendChild(this.contentEl_, this.warningEl_);
};
chatango.group.moderation.EditModDialog.prototype.makeCheckboxItem_ = function(obj, el) {
  var hasFlag = (this.flags_ & obj.flags) > 0;
  var checkbox = new chatango.ui.Checkbox;
  checkbox.render(el);
  checkbox.setChecked(hasFlag);
  var desc = obj.desc;
  var descEl;
  if (desc) {
    descEl = goog.dom.createDom("div", {"class":"mod_cb_desc"});
    goog.dom.appendChild(el, descEl);
  }
  this.checkBoxes_.push([checkbox, obj.title, desc, descEl, obj.flags]);
  goog.events.listen(checkbox, goog.ui.Component.EventType.CHANGE, function(e) {
    this.onFlagChanged_(e, obj.flags);
  }, false, this);
};
chatango.group.moderation.EditModDialog.prototype.enterDocument = function() {
  chatango.group.moderation.EditModDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.moderation.EditModDialog.prototype.updateOwnerUiBasedOnModType_ = function() {
  if (!this.modSelect_) {
    return;
  }
  var isAdmin = this.mm_.flagsHaveAdminPermissions(this.flags_);
  var modType = isAdmin ? chatango.group.moderation.ModeratorSelect.ModType.ADMIN : chatango.group.moderation.ModeratorSelect.ModType.MOD;
  this.modSelect_.selectModType(modType);
  this.adminIcon_.setCanEdit((this.flags_ & chatango.group.moderation.Permissions.Flags.EDIT_MODS) !== 0);
};
chatango.group.moderation.EditModDialog.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("manage_mods_module", "edit_permissions").replace("*name*", this.sid_));
  if (this.defaultPermissionsEl_) {
    this.defaultPermissionsEl_.innerHTML = this.lm_.getString("manage_mods_module", "default_perm");
  }
  if (this.modSelect_) {
    this.modSelect_.updateCopy();
    this.modSelect_.updateCaption();
  }
  if (this.modTitleEl_) {
    this.modTitleEl_.innerHTML = this.lm_.getString("manage_mods_module", "moderator");
  }
  this.delMsgsEl_.innerHTML = this.lm_.getString("manage_mods_module", "del_msgs");
  this.banUsersEl_.innerHTML = this.lm_.getString("manage_mods_module", "ban_unban");
  if (this.adminTitleEl_) {
    this.adminTitleEl_.innerHTML = this.lm_.getString("manage_mods_module", "admin");
  }
  var len = this.checkBoxes_.length;
  var cb;
  for (var i = 0;i < len;i++) {
    cb = this.checkBoxes_[i][0];
    cb.setCaption(this.lm_.getString("manage_mods_module", this.checkBoxes_[i][1]));
    if (this.checkBoxes_[i][3]) {
      this.checkBoxes_[i][3].innerHTML = this.lm_.getString("manage_mods_module", this.checkBoxes_[i][2]);
    }
  }
  this.warningEl_.innerHTML = this.lm_.getString("manage_mods_module", "html5_warning");
  this.updateAddRemoveModsCheckbox_();
};
chatango.group.moderation.EditModDialog.prototype.updateAddRemoveModsCheckbox_ = function() {
  if (this.addRemModsCheckbox_) {
    var numModsWhoCanMakeMods = this.mm_.getNumModsWhoCanMakeMods();
    var maxMods = chatango.users.ModeratorManager.MAX_NUM_OF_MODS_WHO_CAN_MAKE_MODS;
    var modsLeft = Math.max(0, maxMods - numModsWhoCanMakeMods);
    var title = this.lm_.getString("manage_mods_module", this.addRemModsCheckbox_[1]);
    title = title.replace("*left*", modsLeft);
    this.addRemModsCheckbox_[0].setCaption(title);
    var hasAddRemoveFlag = (this.flags_ & this.addRemModsCheckbox_[4]) > 0;
    var cbEnabled = modsLeft > 0 || hasAddRemoveFlag;
    this.addRemModsCheckbox_[0].setEnabled(cbEnabled);
    goog.dom.classes.enable(this.addRemModsCheckbox_[3], "disabled", !cbEnabled);
  }
};
chatango.group.moderation.EditModDialog.prototype.onFlagChanged_ = function(e, flagValue) {
  var setFlag = ~this.flags_ & flagValue;
  var unsetFlag = this.flags_ & flagValue;
  if (setFlag & chatango.group.moderation.Permissions.Flags.EDIT_MODS) {
    this.flags_ |= chatango.group.moderation.Permissions.AllPossibleModFlagsValue;
  }
  if (unsetFlag & chatango.group.moderation.Permissions.AllPossibleModFlagsValue) {
    this.flags_ &= ~chatango.group.moderation.Permissions.Flags.EDIT_MODS;
  }
  if (setFlag & chatango.group.moderation.Permissions.Flags.CLOSE_GROUP) {
    this.flags_ |= chatango.group.moderation.Permissions.Flags.CAN_BROADCAST;
    this.flags_ |= chatango.group.moderation.Permissions.Flags.EDIT_RESTRICTIONS;
  }
  if (unsetFlag & chatango.group.moderation.Permissions.Flags.CAN_BROADCAST) {
    this.flags_ &= ~chatango.group.moderation.Permissions.Flags.CLOSE_GROUP;
  }
  if (unsetFlag & chatango.group.moderation.Permissions.Flags.EDIT_RESTRICTIONS) {
    this.flags_ &= ~chatango.group.moderation.Permissions.Flags.CLOSE_GROUP;
  }
  this.flags_ = (this.flags_ | setFlag) & ~unsetFlag;
  this.updateCheckboxes_();
  this.updateOwnerUiBasedOnModType_();
  this.saveButton_.setAlert(this.flags_ != this.lastSavedFlags_);
};
chatango.group.moderation.EditModDialog.prototype.onBackClicked_ = function(e) {
  this.dispatchEvent(chatango.group.moderation.EditModDialog.EventType.BACK);
};
chatango.group.moderation.EditModDialog.prototype.onTitleCloseClick_ = function(e) {
  this.dispatchEvent(chatango.group.moderation.EditModDialog.EventType.BACK);
  e.stopPropagation();
  e.preventDefault();
};
chatango.group.moderation.EditModDialog.prototype.onSaveClicked_ = function(e) {
  if (this.lastSavedFlags_ == this.flags_) {
    return;
  }
  var evt = new goog.events.Event(chatango.group.moderation.EditModDialog.EventType.SAVE);
  evt.data = {"sid":this.sid_, "flags":this.flags_};
  this.errorDiv_.innerHTML = "";
  this.dispatchEvent(evt);
  this.saveButton_.setAlert(false);
};
chatango.group.moderation.EditModDialog.prototype.onError = function(errorType) {
  switch(errorType) {
    case 2:
    ;
    default:
      this.errorDiv_.innerHTML = this.lm_.getString("manage_mods_module", "bad_edit_err");
      break;
  }
};
chatango.group.moderation.EditModDialog.prototype.modSelectChanged_ = function(e) {
  var modType = this.modSelect_.getValue();
  switch(modType) {
    case chatango.group.moderation.ModeratorSelect.ModType.MOD:
      this.flags_ = chatango.group.moderation.Permissions.DefaultModFlagsValue;
      break;
    case chatango.group.moderation.ModeratorSelect.ModType.ADMIN:
      this.flags_ = chatango.group.moderation.Permissions.DefaultAdminFlagsValue;
      break;
  }
  this.updateCheckboxes_();
  this.saveButton_.setAlert(this.flags_ != this.lastSavedFlags_);
};
chatango.group.moderation.EditModDialog.prototype.modsUpdated = function(e) {
  var oldFlags = this.flags_;
  this.flags_ = this.mm_.getFlags_(this.sid_);
  if (oldFlags != this.flags_) {
    this.updateCheckboxes_();
  }
  this.lastSavedFlags_ = this.flags_;
  this.saveButton_.setAlert(false);
  this.updateAddRemoveModsCheckbox_();
};
chatango.group.moderation.EditModDialog.prototype.userStillAMod = function() {
  return this.mm_.isModerator(this.sid_);
};
chatango.group.moderation.EditModDialog.prototype.stillPermittedToEditThisMod = function() {
  var isAdmin = this.mm_.flagsHaveAdminPermissions(this.mm_.getFlags_(this.sid_));
  return!isAdmin || chatango.users.UserManager.getInstance().currentUser.isOwner();
};
chatango.group.moderation.EditModDialog.prototype.updateCheckboxes_ = function() {
  if (this.checkBoxes_) {
    var len = this.checkBoxes_.length;
    var cb, cbFlag, hasFlag;
    for (var i = 0;i < len;i++) {
      cb = this.checkBoxes_[i][0];
      cbFlag = this.checkBoxes_[i][4];
      hasFlag = (this.flags_ & cbFlag) > 0;
      cb.setChecked(hasFlag);
    }
  }
};
chatango.group.moderation.EditModDialog.EventType = {BACK:"back", SAVE:"save"};
chatango.group.moderation.EditModDialog.prototype.disposeInternal = function(e) {
  if (this.checkBoxes_) {
    var len = this.checkBoxes_.length;
    var cb;
    for (var i = 0;i < len;i++) {
      cb = this.checkBoxes_[i][0];
      cb.dispose();
    }
    this.checkBoxes_ = null;
  }
  chatango.group.moderation.EditModDialog.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.ui.icons.SvgStaffLockIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgStaffLockIcon = function(opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, undefined, opt_domHelper);
};
goog.inherits(chatango.ui.icons.SvgStaffLockIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgStaffLockIcon.prototype.draw = function() {
  if (!chatango.managers.Environment.getInstance().isDesktop() || goog.userAgent.WEBKIT) {
    var svgString = '<svg  xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" overflow="hidden" viewBox="0 0 70 70" preserveAspectRatio="xMinYMin" style="display: block;">' + "<defs></defs>" + '<g style="display: block;">' + '<path d="M20 0 L 50 0  50 30  60 30  60 70  10 70  10 30  20 30 Z M30 10 L 30 30  40 30  40 10 Z" fill="black" stroke="none"></path>' + "</g>" + "</svg>";
    this.element_.innerHTML = svgString;
  } else {
    var dataURI = "data:image/gif;base64,R0lGODlhBwAHAJECAAAAAP///wAAAAAAACH5BAEAAAIALAAAAAAHAAcAAAINjIF2ASHbHppnNmbrLAA7";
    if (!this.imgEl_) {
      this.imgEl_ = goog.dom.createDom("img");
      goog.dom.appendChild(this.element_, this.imgEl_);
    }
    this.imgEl_.src = dataURI;
  }
  goog.dom.classes.add(this.element_, "mod-icon");
};
goog.provide("chatango.group.moderation.ModListItem");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.ui.icons.SvgAdminIcon");
goog.require("chatango.ui.icons.SvgOwnerIcon");
goog.require("chatango.ui.icons.SvgStaffIcon");
goog.require("chatango.ui.icons.SvgStaffLockIcon");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.display");
goog.require("goog.events.EventHandler");
goog.require("goog.math.Size");
goog.require("goog.ui.Button");
goog.require("goog.ui.Component");
chatango.group.moderation.ModListItem = function(name, isOwner, flags) {
  goog.ui.Component.call(this);
  this.name_ = name.toLowerCase();
  this.isOwner_ = isOwner;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.flags_ = flags || 0;
  this.actionEvents_ = chatango.managers.Environment.getInstance().isDesktop() ? [goog.events.EventType.CLICK] : [goog.events.EventType.TOUCHSTART, goog.events.EventType.TOUCHEND];
};
goog.inherits(chatango.group.moderation.ModListItem, goog.ui.Component);
chatango.group.moderation.ModListItem.EventType = {REMOVE:"remove", EDIT:"edit", MAKE_STAFF:"make_staff", REMOVE_STAFF:"un_staff"};
chatango.group.moderation.ModListItem.prototype.createDom = function() {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var canEditMods = (this.flags_ & chatango.group.moderation.Permissions.Flags.EDIT_MODS) !== 0;
  this.modListingEl_ = goog.dom.createDom("div", {"class":"modlisting", "style":"overflow:hidden;"});
  this.iconEl_ = goog.dom.createDom("div", {"class":"modlisting_icon"});
  var staffIconSize = chatango.ui.icons.SvgStaffIcon.getDefaultSize();
  this.staffIconEl_ = goog.dom.createDom("div", {"class":"modlisting_icon staff_icon", "style":"width:" + staffIconSize.width + "px; height:" + staffIconSize.height + "px;"});
  this.staffLockIconEl_ = goog.dom.createDom("div", {"class":"modlisting_icon staff_icon lock", "style":"width:" + staffIconSize.height + "px; height:" + staffIconSize.height + "px;"});
  this.nameEl_ = goog.dom.createDom("div", {"id":"modname", "style":"float:left;"}, this.name_);
  var btnWrap = goog.dom.createDom("div", {"class":"fr"});
  var editLink = new goog.ui.Button(this.lm_.getString("manage_mods_module", "edit"), goog.ui.LinkButtonRenderer.getInstance());
  editLink.addClassName("link-btn");
  editLink.addClassName("edit-btn");
  var removeLink = new goog.ui.Button(this.lm_.getString("manage_mods_module", "remove"), goog.ui.LinkButtonRenderer.getInstance());
  removeLink.addClassName("link-btn");
  goog.dom.append(this.modListingEl_, this.iconEl_);
  goog.dom.append(this.modListingEl_, this.staffIconEl_);
  goog.dom.append(this.modListingEl_, this.staffLockIconEl_);
  goog.dom.append(this.modListingEl_, this.nameEl_);
  var icon;
  var isAdmin = chatango.users.ModeratorManager.getInstance().flagsHaveAdminPermissions(this.flags_);
  var modIsCurrentUser = this.name_ === currentUser.getSid().toLowerCase();
  if (this.isOwner_) {
    var right = goog.dom.createDom("div", {"class":"fr"}, this.lm_.getString("manage_mods_module", "owner"));
    goog.dom.append(this.modListingEl_, right);
    icon = new chatango.ui.icons.SvgOwnerIcon;
  } else {
    if (modIsCurrentUser) {
      icon = isAdmin ? new chatango.ui.icons.SvgAdminIcon(canEditMods) : new chatango.ui.icons.SvgModIcon;
    } else {
      if (!isAdmin || currentUser.isOwner()) {
        editLink.render(btnWrap);
        removeLink.render(btnWrap);
      }
      goog.dom.append(this.modListingEl_, btnWrap);
      var handler = this.getHandler();
      handler.listen(removeLink, goog.ui.Component.EventType.ACTION, this.onRemoveLink_);
      handler.listen(editLink, goog.ui.Component.EventType.ACTION, this.onEditLink_);
      if (isAdmin) {
        icon = new chatango.ui.icons.SvgAdminIcon(canEditMods);
      } else {
        icon = new chatango.ui.icons.SvgModIcon;
      }
    }
  }
  icon.render(this.iconEl_);
  goog.dom.classes.enable(icon.getElement(), "no-action", true);
  var isStaff = chatango.users.ModeratorManager.getInstance().hasPermission(this.name_, chatango.group.moderation.Permissions.Flags.IS_STAFF);
  var currUserCanEditModVisibility = chatango.users.ModeratorManager.getInstance().hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_MODS);
  var currUserCanEditThisModVis = (currUserCanEditModVisibility && !isAdmin || currentUser.isOwner()) && !modIsCurrentUser && !this.isOwner_ && !canEditMods;
  var isOn;
  if (isStaff) {
    isOn = true;
    this.staffIcon_ = new chatango.ui.icons.SvgStaffIcon;
    if (!currUserCanEditThisModVis) {
      var staffLockIcon = new chatango.ui.icons.SvgStaffLockIcon(isOn);
      staffLockIcon.render(this.staffLockIconEl_);
      goog.dom.classes.enable(staffLockIcon.getElement(), "no-action", true);
    }
  } else {
    if (currUserCanEditThisModVis) {
      isOn = false;
    } else {
      isOn = false;
      var staffLockIcon = new chatango.ui.icons.SvgStaffLockIcon;
      staffLockIcon.render(this.staffLockIconEl_);
      goog.dom.classes.enable(staffLockIcon.getElement(), "no-action", true);
    }
    this.staffIcon_ = new chatango.ui.icons.SvgStaffIcon(isOn);
  }
  if (this.staffIcon_) {
    this.staffIcon_.render(this.staffIconEl_);
    if (currUserCanEditThisModVis) {
      goog.events.listen(this.staffIconEl_, this.actionEvents_, this.onStaffDivClicked_, false, this);
    } else {
      goog.events.listen(this.staffIconEl_, this.actionEvents_, this.onStaffDivClickedNoEdit_, false, this);
      goog.dom.classes.enable(this.staffIcon_.getElement(), "no-action", true);
    }
  }
  var iconRolloverCopy = "";
  if (this.isOwner_) {
    iconRolloverCopy = this.lm_.getString("manage_mods_module", "owner_cap");
  } else {
    if (isAdmin) {
      if (canEditMods) {
        iconRolloverCopy = this.lm_.getString("manage_mods_module", "admin_can_edit");
      } else {
        iconRolloverCopy = this.lm_.getString("manage_mods_module", "admin");
      }
    } else {
      iconRolloverCopy = this.lm_.getString("manage_mods_module", "moderator");
    }
  }
  icon.getElement().title = iconRolloverCopy;
  this.setElementInternal(this.modListingEl_);
};
chatango.group.moderation.ModListItem.prototype.onStaffDivClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  goog.events.unlisten(this.staffIconEl_, this.actionEvents_, this.onStaffDivClicked_, false, this);
  var isStaff = chatango.users.ModeratorManager.getInstance().hasPermission(this.name_, chatango.group.moderation.Permissions.Flags.IS_STAFF);
  if (isStaff) {
    this.staffIcon_.setIsOn(false);
    this.dispatchEvent(chatango.group.moderation.ModListItem.EventType.REMOVE_STAFF);
  } else {
    this.staffIcon_.setIsOn(true);
    this.dispatchEvent(chatango.group.moderation.ModListItem.EventType.MAKE_STAFF);
  }
};
chatango.group.moderation.ModListItem.prototype.onStaffDivClickedNoEdit_ = function() {
  goog.module.ModuleManager.getInstance().execOnLoad("WarningDialogModule", this.openStaffToggleWarningDialog_, this);
};
chatango.group.moderation.ModListItem.prototype.openStaffToggleWarningDialog_ = function() {
  var titleKey = "no_perm";
  var descKey = "no_perm_staff";
  var canEditMods = (this.flags_ & chatango.group.moderation.Permissions.Flags.EDIT_MODS) !== 0;
  if (canEditMods) {
    var titleKey = "no_toggle";
    var descKey = "admin_is_staff";
  }
  chatango.modules.WarningDialogModule.getInstance().openWarningDialog(titleKey, descKey, this.staffIconEl_, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT, undefined, "ok");
};
chatango.group.moderation.ModListItem.prototype.getName = function() {
  return this.name_;
};
chatango.group.moderation.ModListItem.prototype.onRemoveLink_ = function(e) {
  this.dispatchEvent(chatango.group.moderation.ModListItem.EventType.REMOVE);
};
chatango.group.moderation.ModListItem.prototype.onEditLink_ = function(e) {
  var evt = new goog.events.Event(chatango.group.moderation.ModListItem.EventType.EDIT);
  evt.data = {"sid":this.name_, "flags":this.flags_};
  this.dispatchEvent(evt);
};
chatango.group.moderation.ModListItem.prototype.disposeInternal = function() {
  if (goog.module.ModuleManager.getInstance().getModuleInfo("WarningDialogModule").isLoaded()) {
    chatango.modules.WarningDialogModule.getInstance().closeWarningDialog();
  }
  goog.events.unlisten(this.staffIconEl_, this.actionEvents_, this.onStaffDivClicked_, false, this);
  goog.events.unlisten(this.staffIconEl_, this.actionEvents_, this.onStaffDivClickedNoEdit_, false, this);
  chatango.group.moderation.ModListItem.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.moderation.ManageModsModel");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
goog.require("goog.events.EventType");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
chatango.group.moderation.ManageModsModel = function(connection) {
  goog.events.EventTarget.call(this);
  this.con_ = connection;
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.mods, this.onResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.addmoderr, this.onResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.removemoderr, this.onResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.updatemoderr, this.onResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.groupflagsupdate, this.onResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.groupflagstoggled, this.onResponse_);
  this.updateModVisibility_();
};
goog.inherits(chatango.group.moderation.ManageModsModel, goog.events.EventTarget);
chatango.group.moderation.ManageModsModel.prototype.onResponse_ = function(e) {
  if (e.type == chatango.networking.GroupConnectionEvent.EventType.mods) {
    this.err_ = 0;
    this.dispatchEvent(chatango.events.EventType.RESPONSE_INFO_READY);
  } else {
    if (e.type == chatango.networking.GroupConnectionEvent.EventType.addmoderr) {
      if (e.data[1] < 2) {
        this.err_ = 1;
      } else {
        if (e.data[1] == 2) {
          this.err_ = 2;
        }
      }
      this.dispatchEvent(chatango.events.EventType.RESPONSE_INFO_READY);
    } else {
      if (e.type == chatango.networking.GroupConnectionEvent.EventType.removemoderr) {
        this.err_ = 3;
        this.dispatchEvent(chatango.events.EventType.RESPONSE_INFO_READY);
      } else {
        if (e.type == chatango.networking.GroupConnectionEvent.EventType.updatemoderr) {
          this.dispatchEvent(chatango.events.EventType.RESPONSE_INFO_READY);
        } else {
          if (e.type == chatango.networking.GroupConnectionEvent.EventType.groupflagsupdate) {
            this.updateModVisibility_();
            this.dispatchEvent(chatango.events.EventType.RESPONSE_INFO_READY);
          } else {
            if (e.type == chatango.networking.GroupConnectionEvent.EventType.groupflagstoggled) {
              if (e.data[3] != 1) {
                this.dispatchEvent(chatango.events.EventType.RESPONSE_INFO_READY);
              }
            }
          }
        }
      }
    }
  }
};
chatango.group.moderation.ManageModsModel.prototype.updateModVisibility_ = function() {
  if (this.con_.flags & chatango.networking.GroupConnection.flags.MODS_CHOOSE_VISIBILITY) {
    this.modVisibility = chatango.group.moderation.Permissions.ModVisibilityOptions.MODS_CHOOSE_VISIBILITY;
  } else {
    if (this.con_.flags & chatango.networking.GroupConnection.flags.SHOW_MOD_ICONS) {
      this.modVisibility = chatango.group.moderation.Permissions.ModVisibilityOptions.SHOW_MOD_ICONS;
    } else {
      this.modVisibility = chatango.group.moderation.Permissions.ModVisibilityOptions.HIDE_MOD_ICONS;
    }
  }
};
chatango.group.moderation.ManageModsModel.prototype.sendRemoveQuery = function(name) {
  this.con_.send("removemod:" + name);
};
chatango.group.moderation.ManageModsModel.prototype.sendAddQuery = function(name, flags) {
  this.con_.send("addmod:" + name + ":" + flags);
};
chatango.group.moderation.ManageModsModel.prototype.sendUpdateQuery = function(name, flags) {
  this.con_.send("updmod:" + name + ":" + flags);
};
chatango.group.moderation.ManageModsModel.prototype.sendModVisUpdateQuery = function(visibility) {
  if (visibility == this.modVisibility) {
    this.dispatchEvent(chatango.events.EventType.RESPONSE_INFO_READY);
    return;
  }
  var set_flags = 0;
  var unset_flags = 0;
  if (this.modVisibility == chatango.group.moderation.Permissions.ModVisibilityOptions.SHOW_MOD_ICONS) {
    unset_flags = chatango.networking.GroupConnection.flags.SHOW_MOD_ICONS;
  } else {
    if (this.modVisibility == chatango.group.moderation.Permissions.ModVisibilityOptions.MODS_CHOOSE_VISIBILITY) {
      unset_flags = chatango.networking.GroupConnection.flags.MODS_CHOOSE_VISIBILITY;
    }
  }
  if (visibility == chatango.group.moderation.Permissions.ModVisibilityOptions.SHOW_MOD_ICONS) {
    set_flags = chatango.networking.GroupConnection.flags.SHOW_MOD_ICONS;
  } else {
    if (visibility == chatango.group.moderation.Permissions.ModVisibilityOptions.MODS_CHOOSE_VISIBILITY) {
      set_flags = chatango.networking.GroupConnection.flags.MODS_CHOOSE_VISIBILITY;
    }
  }
  this.con_.send("updategroupflags:" + set_flags + ":" + unset_flags);
};
goog.provide("chatango.group.moderation.ManageModsView");
goog.require("chatango.group.moderation.ManageModsModel");
goog.require("chatango.group.moderation.ModListItem");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.style");
goog.require("goog.array");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
goog.require("goog.object");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
goog.require("goog.ui.MenuButtonRenderer");
goog.require("goog.ui.FlatMenuButtonRenderer");
chatango.group.moderation.ManageModsView = function(model, opt_domHelper) {
  var vpWidth = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.model_ = model;
  this.handler_ = this.getHandler();
  this.handler_.listen(this.model_, chatango.events.EventType.RESPONSE_INFO_READY, this.manageMods_);
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  this.setTitle(this.lm_.getString("manage_mods_module", "moderators"));
  this.addButton_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("manage_mods_module", "add"));
  this.handler_.listen(this.addButton_, goog.ui.Component.EventType.ACTION, this.addMod_);
  this.setResizable(false);
};
goog.inherits(chatango.group.moderation.ManageModsView, chatango.ui.ScrollableDialog);
chatango.group.moderation.ManageModsView.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  this.showMods();
  var dom = this.getDomHelper();
  this.addModPrompt_ = dom.createDom("div", {"id":"addmod-prompt"});
  this.label_ = dom.createDom("div", {"style":"overflow:hidden; padding-bottom:0.2em"}, this.lm_.getString("manage_mods_module", "add_mod"));
  this.buttonWrapperEl_ = dom.createDom("div", {"style":"float:right;"});
  this.addButton_.render(this.buttonWrapperEl_);
  goog.dom.classes.add(this.addButton_.getElement(), "fr");
  if (chatango.users.UserManager.getInstance().currentUser.isOwner()) {
    this.modSelect_ = new chatango.group.moderation.ModeratorSelect;
    goog.events.listen(this.modSelect_, "change", this.modSelectChanged_, false, this);
  }
  this.addModsWrap_ = goog.dom.createDom("div", {"className":goog.getCssName(this.class_, "subfooter")});
  this.addModInputWrap_ = goog.dom.createDom("div", {"style":"float:left;"});
  this.addModInput_ = dom.createDom("input", {"id":"unban-search", "type":"text", "placeholder":this.lm_.getString("manage_mods_module", "user_name")});
  this.handler_.listen(new goog.events.KeyHandler(this.addModInput_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.addMod_();
    }
  });
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  this.footerPadding(false);
  this.label2 = dom.createDom("div", {"class":"label2"});
  dom.appendChild(this.addModsWrap_, this.label_);
  dom.appendChild(this.addModInputWrap_, this.addModInput_);
  dom.appendChild(this.addModPrompt_, this.addModInputWrap_);
  if (this.modSelect_) {
    this.modSelect_.render(this.addModPrompt_);
  }
  dom.appendChild(this.addModPrompt_, this.buttonWrapperEl_);
  dom.appendChild(this.addModsWrap_, this.addModPrompt_);
  dom.appendChild(this.addModsWrap_, this.label2);
  dom.appendChild(this.footerContentEl_, this.addModsWrap_);
  this.modVisWrap_ = goog.dom.createDom("div", {"className":goog.getCssName(this.class_, "subfooter")});
  goog.dom.classes.add(this.modVisWrap_, "ctopbdr");
  this.modVisLabel_ = goog.dom.createDom("div", {"style":"float:left;"});
  this.modVisSelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  var that = this;
  goog.object.forEach(chatango.group.moderation.Permissions.ModVisibilityOptions, function(value) {
    that.modVisSelect_.addItem(new goog.ui.MenuItem(that.lm_.getString("manage_mods_module", value), value));
  });
  this.modVisSelectWrap_ = dom.createDom("div", {"style":"float:right;"});
  this.modVisSelect_.render(this.modVisSelectWrap_);
  dom.appendChild(this.modVisWrap_, this.modVisLabel_);
  dom.appendChild(this.modVisWrap_, this.modVisSelectWrap_);
  dom.appendChild(this.footerContentEl_, this.modVisWrap_);
  var that = this;
  goog.events.listen(this.modVisSelect_, goog.ui.Component.EventType.ACTION, function() {
    that.onModVisSelectChange_();
  });
  this.updateCopy();
};
chatango.group.moderation.ManageModsView.prototype.enterDocument = function() {
  chatango.group.moderation.ManageModsView.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.moderation.ManageModsView.prototype.showMods = function() {
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  dom.removeChildren(scrollContent);
  this.content = dom.createDom("div");
  var mods = this.mm_.getMods();
  var modSids = goog.object.getKeys(mods);
  var mod = new chatango.group.moderation.ModListItem(this.mm_.getOwner(), true);
  mod.render(this.content);
  modSids.sort();
  this.removeModListItems_();
  this.modListItems_ = [];
  for (var i = 0;i < modSids.length;i++) {
    if (modSids[i] === this.mm_.getOwner()) {
      continue;
    }
    var mod = new chatango.group.moderation.ModListItem(modSids[i], false, mods[modSids[i]]);
    this.modListItems_[i] = mod;
    this.handler_.listen(mod, chatango.group.moderation.ModListItem.EventType.EDIT, this.editListing_);
    this.handler_.listen(mod, chatango.group.moderation.ModListItem.EventType.REMOVE, this.removeListing_);
    this.handler_.listen(mod, chatango.group.moderation.ModListItem.EventType.MAKE_STAFF, this.makeStaffMember_);
    this.handler_.listen(mod, chatango.group.moderation.ModListItem.EventType.REMOVE_STAFF, this.removeStaffMember_);
    mod.render(this.content);
  }
  goog.dom.classes.add(this.content, "sdlg-sc");
  goog.dom.classes.add(this.content, "content-dialog");
  dom.append(scrollContent, this.content);
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
};
chatango.group.moderation.ManageModsView.prototype.removeModListItems_ = function() {
  if (!this.modListItems_) {
    return;
  }
  var len = this.modListItems_.length;
  var modItem;
  for (var i = 0;i < len;i++) {
    modItem = this.modListItems_[i];
    if (!modItem) {
      continue;
    }
    modItem.dispose();
    this.modListItems_[i] = null;
  }
  this.modListItems_ = [];
};
chatango.group.moderation.ManageModsView.prototype.removeListing_ = function(e) {
  this.model_.sendRemoveQuery(e.target.getName());
};
chatango.group.moderation.ManageModsView.prototype.makeStaffMember_ = function(e) {
  var name = e.target.getName().toLowerCase();
  var current_flags = 0;
  if (this.mm_.isModerator(name)) {
    current_flags = this.mm_.getMods()[name];
  }
  var new_flags = current_flags | chatango.group.moderation.Permissions.Flags.IS_STAFF;
  this.model_.sendUpdateQuery(name, new_flags);
};
chatango.group.moderation.ManageModsView.prototype.removeStaffMember_ = function(e) {
  var name = e.target.getName().toLowerCase();
  var current_flags = 0;
  if (this.mm_.isModerator(name)) {
    current_flags = this.mm_.getMods()[name];
  }
  var new_flags = current_flags & ~chatango.group.moderation.Permissions.Flags.IS_STAFF & ~chatango.group.moderation.Permissions.Flags.STAFF_ICON_VISIBLE;
  this.model_.sendUpdateQuery(name, new_flags);
};
chatango.group.moderation.ManageModsView.prototype.onModVisSelectChange_ = function(e) {
  if (this.modVisSelect_.getValue() == this.model_.modVisibility) {
    return;
  }
  this.modVisSelect_.setEnabled(false);
  this.model_.sendModVisUpdateQuery(this.modVisSelect_.getValue());
};
chatango.group.moderation.ManageModsView.prototype.editListing_ = function(e) {
  this.dispatchEvent(e);
};
chatango.group.moderation.ManageModsView.prototype.manageMods_ = function() {
  if (this.model_.err_ == 1) {
    this.label2.className = "form-error";
    goog.dom.setTextContent(this.label2, this.lm_.getString("manage_mods_module", "no_user_err"));
  } else {
    if (this.model_.err_ == 2) {
      this.label2.className = "form-error";
      goog.dom.setTextContent(this.label2, this.lm_.getString("manage_mods_module", "already_mod_err"));
    } else {
      if (this.model_.err_ == 3) {
        this.label2.className = "form-error";
        goog.dom.setTextContent(this.label2, this.lm_.getString("manage_mods_module", "remove_err"));
      } else {
        var currentUser = chatango.users.UserManager.getInstance().currentUser;
        if (currentUser.getUid() == this.added_) {
          this.label2.className = "form-error";
          goog.dom.setTextContent(this.label2, this.lm_.getString("manage_mods_module", "already_mod_err"));
        } else {
          this.label2.className = "label2";
          this.updateCopy();
        }
      }
    }
  }
  this.addButton_.setEnabled(true);
};
chatango.group.moderation.ManageModsView.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("manage_mods_module", "moderators"));
  goog.dom.setTextContent(this.label_, this.lm_.getString("manage_mods_module", "add_mod"));
  this.addButton_.setContent(this.lm_.getString("manage_mods_module", "add"));
  var isSmall = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize();
  if (chatango.managers.Environment.getInstance().isDesktop()) {
    if (isSmall) {
      goog.dom.setTextContent(this.label2, "");
      goog.dom.setTextContent(this.modVisLabel_, this.lm_.getString("manage_mods_module", "mod_visibility_small"));
    } else {
      goog.dom.setTextContent(this.label2, this.lm_.getString("manage_mods_module", "mods_desktop_message"));
      goog.dom.setTextContent(this.modVisLabel_, this.lm_.getString("manage_mods_module", "mod_visibility"));
    }
  } else {
    goog.dom.setTextContent(this.label2, this.lm_.getString("manage_mods_module", "mods_mobile_message"));
    goog.dom.setTextContent(this.modVisLabel_, this.lm_.getString("manage_mods_module", "mod_visibility_small"));
  }
  if (this.modSelect_) {
    this.modSelect_.selectModType(chatango.group.moderation.ModeratorSelect.ModType.MOD);
    this.modSelect_.updateCopy();
    this.modSelect_.updateCaption();
  }
  this.modVisSelect_.setValue(this.model_.modVisibility);
  this.modVisSelect_.setEnabled(true);
  this.showMods();
};
chatango.group.moderation.ManageModsView.prototype.modSelectChanged_ = function(e) {
  this.draw();
};
chatango.group.moderation.ManageModsView.prototype.addMod_ = function(e) {
  this.addButton_.setEnabled(false);
  this.added_ = this.addModInput_.value.toLowerCase();
  var flags = chatango.group.moderation.Permissions.DefaultModFlagsValue;
  if (this.modSelect_) {
    modType = this.modSelect_.getValue();
    switch(modType) {
      case chatango.group.moderation.ModeratorSelect.ModType.MOD:
        flags = chatango.group.moderation.Permissions.DefaultModFlagsValue;
        break;
      case chatango.group.moderation.ModeratorSelect.ModType.ADMIN:
        flags = chatango.group.moderation.Permissions.DefaultAdminFlagsValue;
        break;
    }
  }
  this.model_.sendAddQuery(this.added_, flags);
  this.addModInput_.value = "";
};
chatango.group.moderation.ManageModsView.prototype.draw = function() {
  goog.base(this, "draw");
  var padding = goog.style.getPaddingBox(this.addModsWrap_);
  var modSelectWidth = 0;
  if (this.modSelect_) {
    var modSelectEl = this.modSelect_.getElement();
    modSelectWidth = modSelectEl.offsetWidth + padding.left;
    goog.style.setStyle(modSelectEl, "margin-left", padding.left + "px");
    goog.style.setStyle(modSelectEl, "margin-top", padding.left * .6 + "px");
  }
  var w = goog.style.getSize(this.addModPrompt_).width - goog.style.getSize(this.buttonWrapperEl_).width - padding.left - modSelectWidth;
  if (!isNaN(w)) {
    this.addModInputWrap_.style.width = Math.floor(w - 1) + "px";
    chatango.utils.style.stretchToFill(this.addModInput_);
  }
};
chatango.group.moderation.ManageModsView.prototype.disposeInternal = function() {
  this.removeModListItems_();
  chatango.group.moderation.ManageModsView.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.ManageModsModule");
goog.require("chatango.group.moderation.EditModDialog");
goog.require("chatango.group.moderation.ManageModsModel");
goog.require("chatango.group.moderation.ManageModsView");
goog.require("chatango.group.moderation.ModListItem");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.ModerationModule");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.ManageModsModule = function(connection) {
  chatango.managers.LanguageManager.getInstance().getStringPack("manage_mods_module", chatango.modules.ManageModsModule.strs, this.initCopy, this);
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.connection_ = connection;
  this.manageModsModel_ = new chatango.group.moderation.ManageModsModel(this.connection_);
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  goog.events.listen(this.mm_, chatango.users.ModeratorManager.EventType.MOD_FLAGS_UPDATED, this.onFlagsUpdated_, false, this);
};
chatango.modules.ManageModsModule.prototype.onFlagsUpdated_ = function(e) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var canEditMods = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_MODS);
  if (!canEditMods && this.manageModsDialog_) {
    this.closePopUps();
  }
};
chatango.modules.ManageModsModule.prototype.closePopUps = function() {
  this.closeManageModsDialog_();
  this.closeEditModDialog_();
};
chatango.modules.ManageModsModule.prototype.closeManageModsDialog_ = function() {
  if (this.manageModsDialog_) {
    goog.events.unlisten(this.manageModsDialog_, chatango.group.moderation.ModListItem.EventType.EDIT, this.openEditModDialog_, false, this);
    this.manageModsDialog_.dispose();
    this.manageModsDialog_ = null;
  }
};
chatango.modules.ManageModsModule.prototype.closeEditModDialog_ = function() {
  if (this.editModDialog_) {
    goog.events.unlisten(this.connection_, chatango.networking.GroupConnectionEvent.EventType.mods, this.onModsUpdated_, false, this);
    goog.events.unlisten(this.connection_, chatango.networking.GroupConnectionEvent.EventType.updatemoderr, this.onUpdateModErr_, false, this);
    goog.events.unlisten(this.editModDialog_, chatango.group.moderation.EditModDialog.EventType.BACK, this.onEditBack_, false, this);
    goog.events.unlisten(this.editModDialog_, chatango.group.moderation.EditModDialog.EventType.SAVE, this.onSaveMod_, false, this);
    this.editModDialog_.dispose();
    this.editModDialog_ = null;
  }
};
chatango.modules.ManageModsModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var new_h = Math.round(stage_h * .95);
  if (this.manageModsDialog_) {
    this.manageModsDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.manageModsDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.manageModsDialog_.getElement());
  }
  if (this.editModDialog_) {
    this.editModDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.editModDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.editModDialog_.getElement());
  }
};
chatango.modules.ManageModsModule.prototype.openManageModsDialog = function() {
  this.closeManageModsDialog_();
  this.manageModsDialog_ = new chatango.group.moderation.ManageModsView(this.manageModsModel_);
  this.manageModsDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.manageModsDialog_.setVisible(true);
  goog.events.listen(this.manageModsDialog_, chatango.group.moderation.ModListItem.EventType.EDIT, this.openEditModDialog_, false, this);
};
chatango.modules.ManageModsModule.prototype.openEditModDialog_ = function(e) {
  this.closePopUps();
  this.editModDialog_ = new chatango.group.moderation.EditModDialog(e.data["sid"], e.data["flags"]);
  this.editModDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.editModDialog_.setVisible(true);
  goog.events.listen(this.connection_, chatango.networking.GroupConnectionEvent.EventType.updatemoderr, this.onUpdateModErr_, false, this);
  goog.events.listen(this.connection_, chatango.networking.GroupConnectionEvent.EventType.mods, this.onModsUpdated_, false, this);
  goog.events.listen(this.editModDialog_, chatango.group.moderation.EditModDialog.EventType.BACK, this.onEditBack_, false, this);
  goog.events.listen(this.editModDialog_, chatango.group.moderation.EditModDialog.EventType.SAVE, this.onSaveMod_, false, this);
};
chatango.modules.ManageModsModule.prototype.onEditBack_ = function(e) {
  this.closePopUps();
  this.openManageModsDialog();
};
chatango.modules.ManageModsModule.prototype.onSaveMod_ = function(e) {
  this.manageModsModel_.sendUpdateQuery(e.data["sid"], e.data["flags"]);
};
chatango.modules.ManageModsModule.prototype.onUpdateModErr_ = function(e) {
  var errorType = parseInt(e.data[1], 10);
  if (this.editModDialog_) {
    this.editModDialog_.onError(errorType);
  }
};
chatango.modules.ManageModsModule.prototype.onModsUpdated_ = function(e) {
  if (this.editModDialog_) {
    if (this.editModDialog_.userStillAMod() && this.editModDialog_.stillPermittedToEditThisMod()) {
      this.editModDialog_.modsUpdated(e);
    } else {
      this.closePopUps();
      this.openManageModsDialog();
    }
  }
};
chatango.modules.ManageModsModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("ui") && lm.isPackLoaded("manage_mods_module")) {
    if (this.manageModsDialog_) {
      this.manageModsDialog_.updateCopy();
    }
  }
};
chatango.modules.ManageModsModule.strs = {"moderators":"Moderators", "moderator":"Moderator", "coowner":"Co-owner", "add":"Add", "add_mod":"Add moderator", "user_name":"User name", "mods_desktop_message":"Moderators can ban or delete messages.", "mods_mobile_message":"Swipe a message to moderate.", "no_user_err":"No user by that name - mod cannot be added", "already_mod_err":"Mod is already on list of mods", "bad_edit_err":"Error in editing the moderator.", "remove_err":"Error removing mod", "mod_visibility":"Badge visibility", 
"mod_visibility_small":"Badges", "mod_choice":"Let each mod choose", "show_mods":"Display badges", "hide_mods":"Hide badges", "remove":"remove", "edit":"edit", "owner":"owner", "owner_cap":"Owner", "edit_permissions":"*name*'s permissions", "default_perm":"Default pemissions:", "del_msgs":"Delete messages", "ban_unban":"Ban/unban users", "see_ctr":"Can see People here now, even if off", "see_mod_chan":"Can see mod channel", "see_mod_actions":"Can see mod actions", "see_ips":"Can see IPs", "set_banned_cont":"Can set banned content", 
"ban_cont_desc":"Ban words, images, links and videos", "no_sending_limitations":"Exempt from sending limitations", "sending_limitations_desc":"Can bypass rate/flood limits, auto-moderation, and VPN/proxy restrictions", "display_staff_icon":"Can display staff badge", "display_staff_icon_desc":"Only applies when badge visibility allows", "set_auto_mod":"Can set auto-moderation", "set_gp_annc":"Set group announcement", "edit_gp":"Edit group", "edit_gp_desc":"Change title and owner's message, delete all messages, toggle channels, set counter visibility", 
"set_chat_rstrct":"Set chat restrictions", "set_chat_rstrct_desc":"Allow anons, set rate limit", "add_rem_mods":"Add and remove mods, *left* remaining", "add_rem_mods_desc":"Caution: use with care", "close_group":"Close group input", "close_group_desc":"Toggle broadcast mode, and close group without mods", "can_broadcast":"Can post in broadcast mode", "admin":"Administrator", "admin_can_edit":"Administrator - can add and remove mods.", "html5_warning":"Permissions only work for mods using HTML5."};
goog.module.ModuleManager.getInstance().setLoaded("ManageModsModule");

