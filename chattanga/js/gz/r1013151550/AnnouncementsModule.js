goog.provide("chatango.group.settings.CustomPeriodicityDialog");
goog.require("chatango.ui.ScrollableDialog");
chatango.group.settings.CustomPeriodicityDialog = function(minutes) {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.minMinutes_ = 1;
  this.maxMinutes_ = 4 * 60;
  this.minutes_ = minutes;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  chatango.ui.ScrollableDialog.call(this, width, height, true);
  this.setResizable(false);
};
goog.inherits(chatango.group.settings.CustomPeriodicityDialog, chatango.ui.ScrollableDialog);
chatango.group.settings.CustomPeriodicityDialog.prototype.createDom = function() {
  chatango.group.settings.CustomPeriodicityDialog.superClass_.createDom.call(this);
  var lm = chatango.managers.LanguageManager.getInstance();
  this.setTitle(lm.getString("announcements", "periodicity"));
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "edit-dialog");
  goog.dom.append(scrollContent, content);
  var formWrapper = goog.dom.createDom("div", {"style":"overflow:hidden"});
  goog.dom.append(content, formWrapper);
  var params = {"id":"rate-limit-minutes", type:"text", "pattern":"[0-9]*", "name":"rate-limit-minutes", "style":"width:8em; float:left; margin-right:5px;"};
  this.periodicityInput_ = goog.dom.createDom("input", params);
  if (this.minutes_ > 0) {
    this.periodicityInput_.value = this.minutes_;
  }
  goog.dom.append(formWrapper, this.periodicityInput_);
  var label = lm.getString("announcements", "minutes");
  this.minutesLabel_ = goog.dom.createDom("div", {"class":"form-label", "style":"margin-top:0.3em;"}, label);
  goog.dom.append(formWrapper, this.minutesLabel_);
  this.buttonWrap_ = goog.dom.createDom("div", {"id":"buttons-wrapper"});
  goog.dom.append(formWrapper, this.buttonWrap_);
  this.confirmButtonWrap_ = goog.dom.createDom("div", {"id":"confirm-button-wrap"});
  goog.style.setInlineBlock(this.confirmButtonWrap_);
  this.confirmButton_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.confirmButton_.setContent(lm.getString("announcements", "custom_ok_btn"));
  this.confirmButton_.render(this.confirmButtonWrap_);
  goog.events.listen(this.confirmButton_, goog.ui.Component.EventType.ACTION, this.confirmButtonClick, false, this);
  goog.dom.appendChild(this.buttonWrap_, this.confirmButtonWrap_);
  this.errorDiv_ = goog.dom.createDom("div", {"class":"form-error", "style":"padding: 0 .5em 0 .5em; margin-top:0;"});
  goog.dom.appendChild(content, this.errorDiv_);
};
chatango.group.settings.CustomPeriodicityDialog.prototype.close = function() {
  this.listener_ = null;
  this.disposeInternal();
};
chatango.group.settings.CustomPeriodicityDialog.prototype.confirmButtonClick = function(e) {
  if (this.validateInput(this.periodicityInput_.value)) {
    if (this.listener_) {
      var minutes = +this.periodicityInput_.value;
      this.listener_(minutes);
    }
    this.close();
  } else {
    this.listener_(-1);
  }
};
chatango.group.settings.CustomPeriodicityDialog.prototype.onHide = function(e) {
  if (this.listener_) {
    this.listener_(this.minutes_);
  }
};
chatango.group.settings.CustomPeriodicityDialog.prototype.validateInput = function(inputValue) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (inputValue == "") {
    this.errorDiv_.innerHTML = lm.getString("announcements", "error_empty");
    return false;
  }
  if (!inputValue.match(/^\d+$/)) {
    this.errorDiv_.innerHTML = lm.getString("announcements", "error_not_a_num");
    return false;
  }
  var secs = +inputValue;
  if (secs < this.minMinutes_) {
    this.errorDiv_.innerHTML = lm.getString("announcements", "error_too_small");
    return false;
  }
  if (secs > this.maxMinutes_) {
    this.errorDiv_.innerHTML = lm.getString("announcements", "error_too_large");
    return false;
  }
  return true;
};
chatango.group.settings.CustomPeriodicityDialog.prototype.listenOnceForPeriodicity = function(listener) {
  this.listener_ = listener;
};
chatango.group.settings.CustomPeriodicityDialog.prototype.draw = function() {
  chatango.group.settings.CustomPeriodicityDialog.superClass_.draw.call(this);
};
chatango.group.settings.CustomPeriodicityDialog.prototype.makeVisible = function() {
  goog.style.setStyle(this.getElement(), "visibility", "visible");
};
goog.provide("chatango.group.settings.EnableAnnouncementsDialog");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.group.settings.AnnouncementsModel");
goog.require("chatango.group.settings.CustomPeriodicityDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.utils.style");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
goog.require("goog.module.ModuleManager");
goog.require("goog.events.EventType");
goog.require("goog.ui.Component.EventType");
chatango.group.settings.EnableAnnouncementsDialog = function(model, opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(this.viewportManager_.getViewportSizeMonitor().getSize().height * .98);
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, height, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.model_ = model;
  this.setResizable(false);
};
goog.inherits(chatango.group.settings.EnableAnnouncementsDialog, chatango.ui.ScrollableDialog);
chatango.group.settings.EnableAnnouncementsDialog.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.EnableAnnouncementsDialog");
chatango.group.settings.EnableAnnouncementsDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  var warning = goog.dom.createDom("p");
  warning.innerHTML = this.lm_.getString("announcements", "enable_dialog_warning");
  goog.dom.append(content, warning);
  var buttonsWrapper = goog.dom.createDom("div", {"style":"padding-bottom:0.2em"});
  var s = this.lm_.getString("announcements", "enable_dialog_enable");
  var clear = goog.dom.createDom("div", {"style":"clear: both;"});
  var disableButton = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("announcements", "enable_dialog_disable"));
  disableButton.render(buttonsWrapper);
  disableButton.getElement().style["float"] = "right";
  goog.events.listen(disableButton, goog.ui.Component.EventType.ACTION, this.disable_, undefined, this);
  var enableButton = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("announcements", "enable_dialog_enable"));
  enableButton.render(buttonsWrapper);
  enableButton.getElement().style["float"] = "right";
  enableButton.getElement().style.marginRight = "1em";
  goog.dom.append(content, buttonsWrapper);
  goog.events.listen(enableButton, goog.ui.Component.EventType.ACTION, this.enable_, undefined, this);
  this.setTitle(this.lm_.getString("announcements", "enable_dialog_title"));
  this.showFooterContentEl(true);
};
chatango.group.settings.EnableAnnouncementsDialog.prototype.enable_ = function() {
  this.model_.updateAnnouncement(true, this.model_.text, this.model_.periodicity);
  this.onHide();
};
chatango.group.settings.EnableAnnouncementsDialog.prototype.disable_ = function() {
  this.model_.updateAnnouncement(false, this.model_.text, this.model_.periodicity);
  this.onHide();
};
goog.provide("chatango.group.settings.AnnouncementsView");
goog.require("chatango.group.settings.AnnouncementsModel");
goog.require("chatango.group.settings.CustomPeriodicityDialog");
goog.require("chatango.group.settings.EnableAnnouncementsDialog");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.Select");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.display");
goog.require("chatango.utils.style");
goog.require("goog.events.EventType");
goog.require("goog.module.ModuleManager");
goog.require("goog.ui.Button");
goog.require("goog.ui.Component.EventType");
goog.require("goog.ui.FlatMenuButtonRenderer");
goog.require("goog.ui.LinkButtonRenderer");
goog.require("goog.ui.MenuRenderer");
chatango.group.settings.AnnouncementsView = function(model, groupInfo, opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.model_ = model;
  this.periodModified_ = false;
  this.user_ = chatango.users.UserManager.getInstance().currentUser;
  var ownerSid = chatango.users.ModeratorManager.getInstance().getOwner();
  this.owner_ = chatango.users.UserManager.getInstance().getUser(ownerSid);
  this.customPeriodicityDialog_ = null;
  this.customPeriodicityMinutes_ = -1;
  this.setResizable(false);
  this.spawnDialog = typeof this.model_.text !== "undefined";
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
};
goog.inherits(chatango.group.settings.AnnouncementsView, chatango.ui.ScrollableDialog);
chatango.group.settings.AnnouncementsView.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.AnnouncementsView");
chatango.group.settings.AnnouncementsView.prototype.dispose = function() {
  if (typeof this.messageStyleEditorModule_ !== "undefined") {
    this.messageStyleEditorModule_.closePopUps();
  }
  if (typeof this.textColorModule_ !== "undefined") {
    this.textColorModule_.closePopUps();
  }
  chatango.group.settings.AnnouncementsView.superClass_.dispose.call(this);
};
chatango.group.settings.AnnouncementsView.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  if (this.user_.isMediaLoaded()) {
    this.createElements_();
  } else {
    goog.events.listenOnce(this.user_, chatango.users.User.EventType.MEDIA_INFO_LOADED, this.createElements_, undefined, this);
    this.user_.loadMediaInfo(true);
  }
};
chatango.group.settings.AnnouncementsView.prototype.createElements_ = function(e) {
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  this.announcementPreview_ = dom.createDom("div");
  this.announcementWrapper_ = dom.createDom("div", {"class":"msg", "style":"height:5em; overflow-y: auto; border: 1px solid #CCC"});
  this.backgroundBox_ = goog.dom.createDom("div", {"class":"msg-bg"});
  goog.dom.append(this.announcementWrapper_, this.backgroundBox_);
  this.foregroundBox_ = goog.dom.createDom("div", {"class":"msg-fg"});
  goog.dom.append(this.announcementWrapper_, this.foregroundBox_);
  var textColor = this.msManager_.getStyle("textColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.announcementText_ = dom.createDom("div", {"contentEditable":"true", "style":"color:#" + textColor + ";"});
  goog.events.listen(this.announcementText_, "click", this.uncheckEnabled_, undefined, this);
  var nameColor = this.msManager_.getStyle("nameColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.groupNameSpan_ = dom.createDom("span", {"contentEditable":"false", "style":"float:left; color:#" + nameColor + ";"});
  goog.dom.appendChild(this.foregroundBox_, this.groupNameSpan_);
  goog.dom.appendChild(this.foregroundBox_, this.announcementText_);
  goog.dom.appendChild(this.announcementPreview_, this.announcementWrapper_);
  goog.dom.appendChild(content, this.announcementPreview_);
  this.changedStyle_();
  if (chatango.users.UserManager.getInstance().currentUser.isOwner()) {
    var setBackgroundLink = new goog.ui.Button("Set background", goog.ui.LinkButtonRenderer.getInstance());
    setBackgroundLink.addClassName("link-btn");
    setBackgroundLink.render(content);
    setBackgroundLink.getElement().style.marginBottom = ".3em";
    setBackgroundLink.getElement().style.marginTop = ".3em";
    goog.events.listen(setBackgroundLink, goog.ui.Component.EventType.ACTION, this.onBackgroundLink_, undefined, this);
    goog.dom.appendChild(content, goog.dom.createDom("br"));
  }
  this.setTextColor_ = new goog.ui.Button(this.lm_.getString("announcements", "set_text_color"), goog.ui.LinkButtonRenderer.getInstance());
  this.setTextColor_.addClassName("link-btn");
  this.setTextColor_.render(content);
  goog.events.listen(this.setTextColor_, goog.ui.Component.EventType.ACTION, this.onSetTextColorLink_, undefined, this);
  this.periodicitySelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  this.periodicityInMinutes_ = [1, 2, 5, 10, 30];
  if (this.model_.hasAnnouncement && this.periodicityInMinutes_.indexOf(this.model_.periodicity) === -1) {
    this.periodicityInMinutes_.push(this.model_.periodicity);
  }
  this.periodicityWrapper_ = dom.createDom("div", {"class":"sdlg-section", "id":"p-wrapper"});
  this.periodicitySelect_.setEnabled(true);
  var periodicitySelectWrapper = goog.dom.createDom("div", {"id":"p-select-wrapper"});
  this.periodicitySelectLabel_ = goog.dom.createDom("label", {"id":"p-select-label"});
  this.periodicitySpan_ = goog.dom.createDom("span");
  goog.dom.append(this.periodicitySelectLabel_, this.periodicitySpan_);
  var that = this;
  this.periodicityInMinutes_.forEach(function(e) {
    if (Number(e) == 1) {
      that.periodicitySelect_.addItem(new goog.ui.MenuItem("" + e + " minute", e));
    } else {
      that.periodicitySelect_.addItem(new goog.ui.MenuItem("" + e + " minutes", e));
    }
  });
  var customLabel = this.lm_.getString("announcements", "periodicity_custom");
  this.periodicitySelect_.addItem(new goog.ui.MenuItem(customLabel, -1));
  if (this.model_.hasAnnouncement) {
    this.setPeriodicitySelect_(this.model_.periodicity);
  } else {
    this.periodicitySelect_.setSelectedIndex(2);
  }
  goog.events.listen(this.periodicitySelect_, "change", this.periodChanged_, undefined, this);
  this.dropDownWrapper_ = goog.dom.createDom("div", {"style":"display:inline;"});
  goog.dom.append(this.periodicitySelectLabel_, this.dropDownWrapper_);
  this.periodicitySelect_.render(this.dropDownWrapper_);
  this.periodicitySelect_.setFocusablePopupMenu(true);
  this.periodicitySelect_.setScrollOnOverflow(true);
  if (chatango.managers.Environment.getInstance().isMobile()) {
    var el = this.periodicitySelect_.getElement();
    var pos = goog.positioning.Corner.TOP_END;
    var ap = new goog.positioning.AnchoredPosition(el, pos, null);
    this.periodicitySelect_.setMenuPosition(ap);
  }
  goog.dom.append(periodicitySelectWrapper, this.periodicitySelectLabel_);
  goog.dom.appendChild(this.periodicityWrapper_, periodicitySelectWrapper);
  goog.dom.append(content, this.periodicityWrapper_);
  var checks = dom.createDom("div", {"style":"overflow:hidden", "class":"sdlg-section"});
  dom.appendChild(content, checks);
  var pane = dom.createDom("div", {"style":"float:left"});
  this.enabledBox_ = new chatango.ui.Checkbox;
  dom.appendChild(checks, pane);
  this.enabledBox_.render(pane);
  goog.events.listen(this.enabledBox_, "change", this.sendToServer, undefined, this);
  this.messageCountWarning_ = dom.createDom("div");
  dom.appendChild(this.footerContentEl_, this.messageCountWarning_);
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  this.setTitle(this.lm_.getString("announcements", "title"));
  this.enabledBox_.setCaption(this.lm_.getString("announcements", "enabled"));
  if (this.model_.hasAnnouncement) {
    this.enabledBox_.setChecked(this.model_.isEnabled());
    this.groupNameSpan_.innerHTML = this.model_.groupName + ": ";
    this.announcementText_.innerHTML = this.model_.text;
  } else {
    this.enabledBox_.setChecked(false);
    this.groupNameSpan_.innerHTML = this.model_.groupName + ": ";
  }
  this.messageCountWarning_.innerHTML = "*Only posts if there have been more than 5 messages since the last announcement";
  this.periodicitySpan_.innerHTML = this.lm_.getString("announcements", "periodicity_select");
  this.setPeriodicitySelect_(this.model_.periodicity);
  this.updatePeriodicity();
  chatango.utils.display.constrainToStage(this.getElement(), undefined, true);
};
chatango.group.settings.AnnouncementsView.prototype.setPeriodicitySelect_ = function(periodicityInMinutes) {
  var index = this.periodicityInMinutes_.indexOf(periodicityInMinutes);
  if (-1 != index) {
    this.periodicitySelect_.setSelectedIndex(index);
    if (periodicityInMinutes == 1) {
      this.periodicitySelect_.setCaption("" + periodicityInMinutes + " minute");
    } else {
      this.periodicitySelect_.setCaption("" + periodicityInMinutes + " minutes");
    }
  } else {
    if (Number(periodicityInMinutes) == 1) {
      this.periodicitySelect_.addItem(new goog.ui.MenuItem("" + periodicityInMinutes + " minute", periodicityInMinutes), this.periodicityInMinutes_.length);
    } else {
      this.periodicitySelect_.addItemAt(new goog.ui.MenuItem("" + periodicityInMinutes + " minutes", periodicityInMinutes), this.periodicityInMinutes_.length);
    }
    var customIndex = this.periodicityInMinutes_.length;
    this.periodicityInMinutes_.push(Number(periodicityInMinutes));
    this.customPeriodicityInMinutes_ = periodicityInMinutes;
    this.periodicitySelect_.setSelectedIndex(customIndex);
    if (periodicityInMinutes == 1) {
      this.periodicitySelect_.setCaption("" + periodicityInMinutes + " minute");
    } else {
      this.periodicitySelect_.setCaption("" + periodicityInMinutes + " minutes");
    }
  }
};
chatango.group.settings.AnnouncementsView.prototype.closeCustomPeriodicityDialog = function() {
  if (this.customPeriodicityDialog_) {
    this.customPeriodicityDialog_.close();
  }
  this.customPeriodicityDialog_ = null;
};
chatango.group.settings.AnnouncementsView.prototype.onDialogClosed_ = function(e) {
  if (this.customPeriodicityDialog_) {
    this.customPeriodicityDialog_ = null;
  }
};
chatango.group.settings.AnnouncementsView.prototype.onCustomPeriodicity_ = function(e) {
  this.customPeriodicityDialog_ = null;
  if (e != -1) {
    this.customPeriodicityMinutes_ = e;
    this.setPeriodicitySelect_(this.customPeriodicityMinutes_);
    this.updatePeriodicity();
  }
};
chatango.group.settings.AnnouncementsView.prototype.periodChanged_ = function() {
  this.periodModified_ = true;
  var selectedValue = this.periodicitySelect_.getValue();
  if (this.periodicityInMinutes_.indexOf(selectedValue) === -1) {
    if (this.customPeriodicityDialog_) {
      return;
    }
    if (this.model_.hasAnnouncement) {
      this.customPeriodicityDialog_ = new chatango.group.settings.CustomPeriodicityDialog(this.model_.periodicity);
    } else {
      this.customPeriodicityDialog_ = new chatango.group.settings.CustomPeriodicityDialog(5);
    }
    var that = this;
    this.customPeriodicityDialog_.listenOnceForPeriodicity(function(e) {
      that.onCustomPeriodicity_(e);
    });
    goog.events.listenOnce(this.customPeriodicityDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, function(e) {
      that.onDialogClosed_(e);
    });
    this.customPeriodicityDialog_.setVisible(true);
  } else {
    this.setPeriodicitySelect_(selectedValue);
    this.customPeriodicityMinutes_ = -1;
    this.closeCustomPeriodicityDialog();
    this.updatePeriodicity();
  }
};
chatango.group.settings.AnnouncementsView.prototype.getMessageStyleEditorModule_ = function() {
  if (typeof this.messageStyleEditorModule_ === "undefined") {
    this.messageStyleEditorModule_ = new chatango.modules.MessageStyleEditorModule(this.model_.getConnection());
    goog.events.listen(this.messageStyleEditorModule_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changedStyle_, undefined, this);
    goog.events.listen(this.messageStyleEditorModule_, chatango.events.MessageStyleEvent.EventType.CLOSED, this.closedStyle_, undefined, this);
  }
  return this.messageStyleEditorModule_;
};
chatango.group.settings.AnnouncementsView.prototype.getTextColorModule_ = function() {
  if (typeof this.textColorModule_ === "undefined") {
    this.textColorModule_ = new chatango.modules.TextColorModule(this.model_.getConnection());
    goog.events.listen(this.textColorModule_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changedStyle_, undefined, this);
  }
  return this.textColorModule_;
};
chatango.group.settings.AnnouncementsView.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.textColorModule_) {
    this.textColorModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.messageStyleEditorModule_) {
    this.messageStyleEditorModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.customPeriodicityDialog_) {
    chatango.utils.display.constrainToStage(this.customPeriodicityDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.customPeriodicityDialog_.getElement());
  }
};
chatango.group.settings.AnnouncementsView.prototype.onBackgroundLink_ = function() {
  if (!this.messageStyleEditorModule_) {
    goog.module.ModuleManager.getInstance().execOnLoad("MessageStyleEditorModule", function() {
      this.getMessageStyleEditorModule_().openMessageStyleEditorDialog();
      goog.events.listenOnce(this.getMessageStyleEditorModule_(), chatango.events.MessageStyleEvent.EventType.LOADED, function(e) {
        var elements = new Array(this.getElement(), this.getMessageStyleEditorModule_().messageStyleEditor_.getElement());
        chatango.utils.display.tileElements(elements);
      }, undefined, this);
    }, this);
  } else {
    this.getMessageStyleEditorModule_().openMessageStyleEditorDialog();
    goog.events.listenOnce(this.getMessageStyleEditorModule_(), chatango.events.MessageStyleEvent.EventType.LOADED, function(e) {
      var elements = new Array(this.getElement(), this.getMessageStyleEditorModule_().messageStyleEditor_.getElement());
      chatango.utils.display.tileElements(elements);
    }, undefined, this);
  }
};
chatango.group.settings.AnnouncementsView.prototype.onSetTextColorLink_ = function() {
  if (!this.textColorModule_) {
    goog.module.ModuleManager.getInstance().execOnLoad("TextColorModule", function() {
      this.getTextColorModule_().openTextColorDialog();
    }, this);
  } else {
    this.getTextColorModule_().openTextColorDialog();
  }
};
chatango.group.settings.AnnouncementsView.prototype.updatePeriodicity = function() {
  if (!this.model_.hasAnnouncement) {
    this.announcementText_.innerHTML = "Edit periodic group message (sent every " + this.periodicitySelect_.getValue() + " minutes)";
  }
};
chatango.group.settings.AnnouncementsView.prototype.sendToServer = function() {
  if (this.customPeriodicityMinutes_ !== -1) {
    this.model_.updateAnnouncement(this.enabledBox_.getChecked(), this.announcementText_.innerHTML, this.customPeriodicityMinutes_);
  } else {
    this.model_.updateAnnouncement(this.enabledBox_.getChecked(), this.announcementText_.innerHTML, this.periodicitySelect_.getValue());
  }
};
chatango.group.settings.AnnouncementsView.prototype.closedStyle_ = function() {
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CLOSED);
};
chatango.group.settings.AnnouncementsView.prototype.changedStyle_ = function() {
  this.user_ = chatango.users.UserManager.getInstance().currentUser;
  if (this.user_ == this.owner_ && this.msManager_.getStyle("usebackground") === "1") {
    if (!this.owner_.getBgUseImg()) {
      if (goog.dom.classes.has(this.backgroundBox_, "bg-image-" + this.owner_.getUid())) {
        goog.dom.classes.remove(this.backgroundBox_, "bg-image-" + this.owner_.getUid());
      }
    }
    this.owner_.drawBg(this.backgroundBox_);
    this.backgroundBox_.style.backgroundColor = "inherit";
  } else {
    this.backgroundBox_.parentNode.style.backgroundColor = "#FFFFFF";
    if (goog.dom.classes.has(this.backgroundBox_, "bg-image-" + this.owner_.getUid())) {
      goog.dom.classes.remove(this.backgroundBox_, "bg-image-" + this.owner_.getUid());
    }
  }
  var textColor = this.msManager_.getStyle("textColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.announcementText_.style.color = "#" + textColor;
  var nameColor = this.msManager_.getStyle("nameColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.groupNameSpan_.style.color = "#" + nameColor;
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CHANGED);
};
chatango.group.settings.AnnouncementsView.prototype.onHide = function() {
  if (this.enabledBox_.getChecked()) {
    if (this.spawnDialog) {
      this.sendToServer();
    }
  } else {
    if (this.spawnDialog) {
      this.sendToServer();
      var enableDialog = new chatango.group.settings.EnableAnnouncementsDialog(this.model_);
      enableDialog.setVisible(true);
    }
  }
  goog.base(this, "onHide");
};
chatango.group.settings.AnnouncementsView.prototype.uncheckEnabled_ = function() {
  this.enabledBox_.setChecked(false);
  this.spawnDialog = true;
};
goog.provide("chatango.strings.AnnouncementsStrings");
chatango.strings.AnnouncementsStrings.strs = {"set_background":"Set message background", "set_text_color":"Set text color", "title":"Edit auto announcement", "enabled":"Enabled", "disabled":"Disabled", "periodicity":"Periodicity", "periodicity_select":"Post every ", "periodicity_custom":"custom", "custom_ok_btn":"Ok", "error_empty":"Empty", "error_not_a_num":"Not a number", "error_too_small":"Too small", "error_too_large":"Too large", "minutes":"minutes", "enable_dialog_title":"Enable announcement", 
"enable_dialog_warning":"The announcement you have created is currently not enabled, would you like to enable it?", "enable_dialog_enable":"Enable", "enable_dialog_disable":"Disable"};
goog.provide("chatango.modules.AnnouncementsModule");
goog.require("chatango.events.AnnouncementEvent");
goog.require("chatango.group.settings.AnnouncementsModel");
goog.require("chatango.group.settings.AnnouncementsView");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.SettingsModule");
goog.require("chatango.strings.AnnouncementsStrings");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.AnnouncementsModule = function(announcements) {
  goog.events.EventTarget.call(this);
  if (chatango.DEBUG) {
    this.logger.info("Creating AnnouncementsModule");
  }
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("announcements", chatango.strings.AnnouncementsStrings.strs, this.initCopy, this);
  this.announcementModel = announcements;
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  var modEvents = [chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE];
  goog.events.listen(this.mm_, modEvents, this.onFlagsUpdated_, false, this);
};
goog.inherits(chatango.modules.AnnouncementsModule, goog.events.EventTarget);
chatango.modules.AnnouncementsModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.AnnouncementsModule");
chatango.modules.AnnouncementsModule.prototype.onFlagsUpdated_ = function(e) {
  if (this.announcementsDialog_) {
    var currentUser = chatango.users.UserManager.getInstance().currentUser;
    var canEditAnnc = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_GP_ANNC);
    if (!canEditAnnc) {
      this.closePopUps();
    }
  }
};
chatango.modules.AnnouncementsModule.prototype.closePopUps = function() {
  if (this.announcementsDialog_) {
    this.announcementsDialog_.dispose();
  }
};
chatango.modules.AnnouncementsModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.announcementsDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.announcementsDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.announcementsDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.announcementsDialog_.getElement());
    this.announcementsDialog_.constrainDialogsToScreen(opt_stageRect);
  }
};
chatango.modules.AnnouncementsModule.prototype.openAnnouncementsDialog = function() {
  this.closePopUps();
  goog.events.listen(this.announcementModel, chatango.events.AnnouncementEvent.EventType.FIELDS_SET, this.openDialog, undefined, this);
  this.announcementModel.setFields();
};
chatango.modules.AnnouncementsModule.prototype.openDialog = function(e) {
  this.announcementsDialog_ = new chatango.group.settings.AnnouncementsView(this.announcementModel);
  this.announcementsDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.announcementsDialog_.setVisible(true);
  goog.events.listen(this.announcementsDialog_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changed_, undefined, this);
  goog.events.listen(this.announcementsDialog_, chatango.events.MessageStyleEvent.EventType.CLOSED, this.closed_, undefined, this);
  this.constrainDialogsToScreen();
};
chatango.modules.AnnouncementsModule.prototype.initCopy = function(pack_id) {
  if (this.announcementsDialog_) {
    this.announcementsDialog_.updateCopy();
  }
};
chatango.modules.AnnouncementsModule.prototype.changed_ = function(e) {
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CHANGED);
};
chatango.modules.AnnouncementsModule.prototype.closed_ = function(e) {
  this.constrainDialogsToScreen();
};
goog.module.ModuleManager.getInstance().setLoaded("AnnouncementsModule");

