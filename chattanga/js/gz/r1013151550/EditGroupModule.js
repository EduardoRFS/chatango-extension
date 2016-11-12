goog.provide("chatango.group.settings.EditView");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.settings.Architecture");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.display");
goog.require("chatango.utils.style");
chatango.group.settings.EditView = function(model, opt_domHelper) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.setResizable(false);
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setTitle(this.lm_.getString("edit_group_module", "edit_group"));
  this.counterBox_ = new chatango.ui.Checkbox;
  this.channelsBox_ = new chatango.ui.Checkbox;
  this.saveButton_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("ui", "save"));
  this.model_ = model;
  goog.events.listen(chatango.managers.Keyboard.getInstance(), [chatango.managers.Keyboard.EventType.KEYBOARD_RAISED, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED], this.onKeyboard_, false, this);
};
goog.inherits(chatango.group.settings.EditView, chatango.ui.ScrollableDialog);
chatango.group.settings.EditView.EventType = {SAVE:"save", DELETE_ALL:"delete_all"};
chatango.group.settings.EditView.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.EditView");
chatango.group.settings.EditView.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "edit-dialog");
  goog.dom.append(scrollContent, content);
  var name = goog.dom.createDom("div", {"style":"overflow:hidden"});
  goog.dom.append(content, name);
  this.nameLabel_ = goog.dom.createDom("div", {"class":"form-label"}, this.lm_.getString("edit_group_module", "group_name") + ":");
  goog.dom.append(name, this.nameLabel_);
  this.nameInputWrap_ = goog.dom.createDom("div", {"style":"float:right; overflow:hidden;"});
  goog.dom.append(name, this.nameInputWrap_);
  this.nameInput_ = goog.dom.createDom("input", {"type":"text"});
  goog.dom.append(this.nameInputWrap_, this.nameInput_);
  var message = goog.dom.createDom("div", {"class":"sdlg-top-section"});
  goog.dom.append(content, message);
  var messageLabel = goog.dom.createDom("h4", undefined, this.lm_.getString("edit_group_module", "owners_msg"));
  goog.dom.append(message, messageLabel);
  this.messageWrap_ = goog.dom.createDom("div");
  goog.dom.append(message, this.messageWrap_);
  this.messageInput_ = goog.dom.createDom("textarea", {"style":"margin:0;"});
  goog.dom.append(this.messageWrap_, this.messageInput_);
  var footnoteText = goog.dom.createDom("div", undefined, this.lm_.getString("edit_group_module", "shows_when") + " ");
  var url = this.model_.getGroupURL() + "/clonegroup";
  this.resizeLink_ = goog.dom.createDom("a", {"href":url});
  var showLink = chatango.settings.Architecture.getInstance().getFlashVersion();
  if (!showLink) {
    goog.style.showElement(this.resizeLink_, false);
  }
  goog.dom.append(footnoteText, this.resizeLink_);
  var footnote = goog.dom.createDom("div", {"class":"fineprint"}, [footnoteText]);
  goog.dom.append(message, footnote);
  var counter = goog.dom.createDom("div", {"class":"sdlg-section"});
  goog.dom.append(content, counter);
  this.counterBox_.render(counter);
  this.counterBox_.setCaption(this.lm_.getString("edit_group_module", "show_counter"));
  var channels = goog.dom.createDom("div", {"class":"sdlg-section"});
  goog.dom.append(content, channels);
  this.channelsBox_.render(channels);
  this.channelsBox_.setCaption(this.lm_.getString("edit_group_module", "enable_channels"));
  var clearAll = goog.dom.createDom("div", {"class":"sdlg-section"});
  goog.dom.append(content, clearAll);
  this.clearLink_ = goog.dom.createDom("a", undefined, this.lm_.getString("edit_group_module", "delete_all_now"));
  goog.dom.append(clearAll, this.clearLink_);
  var buttons = dom.createDom("div", {"style":"overflow:hidden;"});
  this.saveButton_.render(buttons);
  goog.dom.classes.add(this.saveButton_.getElement(), "fr");
  dom.appendChild(this.footerContentEl_, buttons);
  var handler = this.getHandler();
  handler.listen(this.model_, [chatango.events.EventType.UPDATE, chatango.events.EventType.SHOW_COUNTER_UPDATE, chatango.events.EventType.ENABLE_CHANNELS_UPDATE], this.updateView_);
  handler.listen(this.saveButton_, goog.ui.Component.EventType.ACTION, this.onSave_);
  handler.listen(this.messageInput_, [goog.events.EventType.KEYUP, goog.events.EventType.CHANGE], this.onChange_);
  handler.listen(this.nameInput_, [goog.events.EventType.KEYUP, goog.events.EventType.CHANGE], this.onChange_);
  handler.listen(this.counterBox_, goog.ui.Component.EventType.CHANGE, this.onCounterBoxChanged_);
  handler.listen(this.channelsBox_, goog.ui.Component.EventType.CHANGE, this.onChannelsBoxChanged_);
  handler.listen(this.clearLink_, goog.events.EventType.CLICK, this.onClearLinkClicked_);
  this.updateCopy();
  this.updateView_();
};
chatango.group.settings.EditView.prototype.onKeyboard_ = function(e) {
  var viewSize = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor().getSize();
  var new_h = Math.round(viewSize.height * .95);
  this.setMaxHeight(new_h);
  this.setHeight(new_h);
  if (chatango.managers.Environment.getInstance().isAndroid()) {
    goog.Timer.callOnce(this.repositionAndDraw_, 0, this);
  } else {
    this.repositionAndDraw_();
  }
};
chatango.group.settings.EditView.prototype.repositionAndDraw_ = function() {
  this.reposition();
  this.draw();
  this.keepActiveElementOnScreen_();
};
chatango.group.settings.EditView.prototype.onCounterBoxChanged_ = function(e) {
  this.model_.setShowCounter(this.counterBox_.isChecked());
};
chatango.group.settings.EditView.prototype.onChannelsBoxChanged_ = function(e) {
  this.model_.setEnableChannels(this.channelsBox_.isChecked());
};
chatango.group.settings.EditView.prototype.setVisible = function(isVisible) {
  goog.base(this, "setVisible", isVisible);
  if (isVisible) {
    this.draw();
  }
};
chatango.group.settings.EditView.prototype.updateView_ = function() {
  this.nameInput_.value = this.model_.getGroupTitle();
  this.messageInput_.value = this.model_.getOwnerMessage();
  this.counterBox_.setChecked(this.model_.getShowCounter());
  this.channelsBox_.setChecked(this.model_.getEnableChannels());
  this.draw();
};
chatango.group.settings.EditView.prototype.onChange_ = function() {
  var isOriginal = this.nameInput_.value == this.model_.getGroupTitle() && this.messageInput_.value == this.model_.getOwnerMessage();
  this.saveButton_.setAlert(!isOriginal);
};
chatango.group.settings.EditView.prototype.getOwnersMessage = function() {
  return this.messageInput_.value;
};
chatango.group.settings.EditView.prototype.getTitle = function() {
  return this.nameInput_.value;
};
chatango.group.settings.EditView.prototype.onSave_ = function() {
  this.dispatchEvent(chatango.group.settings.EditView.EventType.SAVE);
  this.saveButton_.setAlert(false);
};
chatango.group.settings.EditView.prototype.onClearLinkClicked_ = function() {
  var vms = this.viewportManager_.getViewportSizeMonitor().getSize();
  if (!this.deleteAllMsgsConfimationDialog_) {
    var w = vms.width;
    w = Math.min(w * .8, Math.round(2.8 * chatango.managers.Style.getInstance().getScale()));
    this.deleteAllMsgsConfimationDialog_ = new chatango.ui.ScrollableDialog(w, undefined, true);
    this.deleteAllMsgsConfimationDialog_.showTitleBarBg(false);
    this.deleteAllMsgsConfimationDialog_.setResizable(false);
    var msg = this.lm_.getString("edit_group_module", "are_you_sure");
    this.deleteAllMsgsConfimationDialog_.setContent(msg, true);
    var bs = new chatango.ui.ButtonSet;
    bs.addButton({caption:this.lm_.getString("ui", "cancel"), key:"cancel"}, false, true);
    bs.addButton({caption:this.lm_.getString("edit_group_module", "yes_delete"), key:"delall"});
    this.deleteAllMsgsConfimationDialog_.setButtonSet(bs);
  }
  goog.events.unlisten(this.deleteAllMsgsConfimationDialog_, goog.ui.Dialog.EventType.SELECT, this.deleteAllMsgsConfimationDialogClicked, false, this);
  goog.events.listen(this.deleteAllMsgsConfimationDialog_, goog.ui.Dialog.EventType.SELECT, this.deleteAllMsgsConfimationDialogClicked, false, this);
  this.deleteAllMsgsConfimationDialog_.setVisible(true);
  var el = this.deleteAllMsgsConfimationDialog_.getDialogElement();
  var linkPosition = goog.style.getClientPosition(this.clearLink_);
  var dialogSize = goog.style.getContentBoxSize(el);
  var x = linkPosition.x + 25;
  var y = Math.round(linkPosition.y - dialogSize.height - 25);
  goog.style.setPosition(el, x, y);
  chatango.utils.display.constrainPosition(el, new goog.math.Rect(0, 0, vms.width, vms.height));
};
chatango.group.settings.EditView.prototype.deleteAllMsgsConfimationDialogClicked = function(e) {
  switch(e.key) {
    case "delall":
      this.deleteAllMessages();
      break;
  }
  if (this.deleteAllMsgsConfimationDialog_) {
    this.deleteAllMsgsConfimationDialog_.dispose();
    this.deleteAllMsgsConfimationDialog_ = null;
  }
};
chatango.group.settings.EditView.prototype.deleteAllMessages = function() {
  this.dispatchEvent(chatango.group.settings.EditView.EventType.DELETE_ALL);
};
chatango.group.settings.EditView.prototype.updateCopy = function() {
  goog.dom.setTextContent(this.resizeLink_, this.lm_.getString("edit_group_module", "change_size"));
};
chatango.group.settings.EditView.prototype.draw = function() {
  var w = goog.style.getSize(this.nameLabel_.parentNode).width - goog.style.getSize(this.nameLabel_).width;
  this.nameInputWrap_.style.width = Math.floor(w - 2) + "px";
  chatango.utils.style.stretchToFill(this.nameInput_);
  chatango.utils.style.stretchToFill(this.messageInput_);
  chatango.group.settings.EditView.superClass_.draw.call(this);
};
chatango.group.settings.EditView.prototype.dispose = function() {
  chatango.group.settings.EditView.superClass_.dispose.call(this);
  if (this.deleteAllMsgsConfimationDialog_) {
    this.deleteAllMsgsConfimationDialog_.dispose();
    this.deleteAllMsgsConfimationDialog_ = null;
  }
  goog.events.unlisten(chatango.managers.Keyboard.getInstance(), [chatango.managers.Keyboard.EventType.KEYBOARD_RAISED, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED], this.onKeyboard_, false, this);
};
goog.provide("chatango.group.settings.EditController");
goog.require("chatango.group.GroupInfo");
goog.require("chatango.group.settings.EditView");
goog.require("chatango.group.settings.AnnouncementsModel");
goog.require("goog.events.EventHandler");
chatango.group.settings.EditController = function(connection, groupInfo) {
  this.connection_ = connection;
  this.model_ = groupInfo;
  this.view_ = new chatango.group.settings.EditView(this.model_);
  this.handler_ = new goog.events.EventHandler(this);
  this.announcementsModel_ = new chatango.group.settings.AnnouncementsModel(connection);
};
chatango.group.settings.EditController.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.EditController");
chatango.group.settings.EditController.prototype.show = function() {
  this.hide();
  this.view_ = new chatango.group.settings.EditView(this.model_);
  this.handler_.listen(this.model_, chatango.events.EventType.UPDATE, this.onUpdate_);
  this.handler_.listen(this.view_, chatango.group.settings.EditView.EventType.SAVE, this.onSave_);
  this.handler_.listen(this.view_, chatango.group.settings.EditView.EventType.DELETE_ALL, this.onDeleteAllMessages_);
  this.model_.refresh();
};
chatango.group.settings.EditController.prototype.hide = function() {
  if (this.view_) {
    this.view_.dispose();
    goog.dispose(this.view_);
    this.view_ = null;
  }
};
chatango.group.settings.EditController.prototype.getViewElement = function() {
  if (this.view_) {
    return this.view_.getElement();
  } else {
    return null;
  }
};
chatango.group.settings.EditController.prototype.getView = function() {
  if (this.view_) {
    return this.view_;
  } else {
    return null;
  }
};
chatango.group.settings.EditController.prototype.onUpdate_ = function(e) {
  this.view_.setVisible(true);
};
chatango.group.settings.EditController.prototype.onSave_ = function(e) {
  if (this.model_.getGroupTitle() == this.view_.getTitle() && this.model_.getOwnerMessage() == this.view_.getOwnersMessage()) {
    return;
  }
  this.model_.setBasicGroupInfo(this.view_.getTitle(), this.view_.getOwnersMessage());
};
chatango.group.settings.EditController.prototype.onDeleteAllMessages_ = function(e) {
  this.connection_.send("clearall");
  this.handler_.listen(this.announcementsModel_, chatango.events.AnnouncementEvent.EventType.FIELDS_SET, this.onFieldsSet_);
  this.announcementsModel_.setFields();
};
chatango.group.settings.EditController.prototype.onFieldsSet_ = function(e) {
  this.announcementsModel_.updateAnnouncement(false, this.announcementsModel_.text, this.announcementsModel_.periodicity);
};
chatango.group.settings.EditController.prototype.updateCopy = function(e) {
  this.view_.updateCopy();
};
goog.provide("chatango.modules.EditGroupModule");
goog.require("chatango.group.settings.EditController");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.SettingsModule");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.EditGroupModule = function(connection, groupInfo) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("edit_group_module", chatango.modules.EditGroupModule.strs, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.connection_ = connection;
  this.groupInfo_ = groupInfo;
  this.editController_ = new chatango.group.settings.EditController(connection, groupInfo);
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  var modEvents = [chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE];
  goog.events.listen(this.mm_, modEvents, this.onFlagsUpdated_, false, this);
};
chatango.modules.EditGroupModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.EditGroupModule");
chatango.modules.EditGroupModule.prototype.onFlagsUpdated_ = function(e) {
  if (this.editController_) {
    var currentUser = chatango.users.UserManager.getInstance().currentUser;
    var canEditGroup = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_GROUP);
    if (!canEditGroup) {
      this.closePopUps();
    }
  }
};
chatango.modules.EditGroupModule.prototype.closePopUps = function() {
  if (this.editController_) {
    this.editController_.hide();
  }
};
chatango.modules.EditGroupModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.editController_ && this.editController_.getViewElement()) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.editController_.getView().setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.editController_.getViewElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.editController_.getViewElement());
  }
};
chatango.modules.EditGroupModule.prototype.openEditGroupDialog = function() {
  this.editController_.show();
};
chatango.modules.EditGroupModule.prototype.initCopy = function(pack_id) {
  if (this.lm_.isPackLoaded("ui") && this.lm_.isPackLoaded("edit_group_module")) {
    if (this.editController_) {
      this.editController_.updateCopy();
    }
  }
};
chatango.modules.EditGroupModule.strs = {"change_size":"Change size", "edit_group":"Edit group", "owners_msg":"Owner's Message:*", "show_counter":"Show counter", "enable_channels":"Enable channels", "delete_all_now":"Delete all messages now", "group_name":"Group name", "shows_when":"*Shows when group is more than 300px wide or 400px tall.", "are_you_sure":"Are you sure that you want to delete all messages from this group?", "yes_delete":"Yes, delete all"};
goog.module.ModuleManager.getInstance().setLoaded("EditGroupModule");

