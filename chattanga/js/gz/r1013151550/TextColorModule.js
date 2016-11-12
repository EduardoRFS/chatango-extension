goog.provide("chatango.strings.TxtColPickerStrings");
chatango.strings.TxtColPickerStrings.strs = {"change_txt_col":"Change text color", "change_txt_col_sm":"Text color", "reset_def":"Reset to default", "text_color":"Text color"};
goog.provide("chatango.messagestyles.TextColorDialog");
goog.require("chatango.strings.TxtColPickerStrings");
goog.require("chatango.managers.MessageStyleManager");
chatango.messagestyles.TextColorDialog = function(connection) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  var autoSize = true;
  this.user_ = chatango.users.UserManager.getInstance().currentUser;
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setResizable(false);
};
goog.inherits(chatango.messagestyles.TextColorDialog, chatango.ui.ScrollableDialog);
chatango.messagestyles.TextColorDialog.prototype.logger = goog.debug.Logger.getLogger("chatango.messagestyles.TextColorDialog");
chatango.messagestyles.TextColorDialog.prototype.dispose = function() {
  chatango.messagestyles.TextColorDialog.superClass_.dispose.call(this);
};
chatango.messagestyles.TextColorDialog.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  this.textColorPickerButton_.constrainDialogsToScreen(opt_stageRect);
};
chatango.messagestyles.TextColorDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  var textColorWrapper = goog.dom.createDom("div", {"style":"min-height: 3em; padding-bottom:.3em;"});
  this.textColorLabelEl_ = goog.dom.createDom("span", {"style":"float: left; padding-right: .5em;"});
  goog.dom.append(textColorWrapper, this.textColorLabelEl_);
  var textColor = this.msManager_.getStyle("textColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.textColorPickerButton_ = new chatango.ui.ColorPickerButton(textColor);
  this.textColorPickerButton_.render(textColorWrapper);
  goog.events.listen(this.textColorPickerButton_, chatango.ui.ColorPickerButton.EventType.COLOR_CHANGE, this.onChange, undefined, this);
  goog.dom.append(content, textColorWrapper);
  this.resetLinkEl_ = goog.dom.createDom("a");
  goog.events.listen(this.resetLinkEl_, goog.events.EventType.CLICK, this.onReset_, false, this);
  goog.dom.append(content, this.resetLinkEl_);
  this.updateCopy();
};
chatango.messagestyles.TextColorDialog.prototype.updateCopy = function() {
  var isSmall = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize();
  var titleStrKey = isSmall ? "change_txt_col_sm" : "change_txt_col";
  this.setTitle(this.lm_.getString("txt_col_pkr", titleStrKey));
  this.resetLinkEl_.innerHTML = this.lm_.getString("txt_col_pkr", "reset_def");
  this.textColorLabelEl_.innerHTML = this.lm_.getString("txt_col_pkr", "text_color");
};
chatango.messagestyles.TextColorDialog.prototype.onReset_ = function() {
  this.textColorPickerButton_.setColor(chatango.managers.Style.getInstance().getMsgTextColor().replace("#", ""));
  this.msManager_.setStyle("textColor", "");
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CHANGED);
};
chatango.messagestyles.TextColorDialog.prototype.onChange = function(e) {
  this.msManager_.setStyle("textColor", this.textColorPickerButton_.getColor());
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CHANGED);
};
goog.provide("chatango.modules.TextColorModule");
goog.require("chatango.strings.TxtColPickerStrings");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.messagestyles.TextColorDialog");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.TextColorModule = function(connection) {
  goog.events.EventTarget.call(this);
  if (chatango.DEBUG) {
    this.logger.info("Creating TextColorModule");
  }
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("txt_col_pkr", chatango.strings.TxtColPickerStrings.strs, this.initCopy, this);
  this.connection_ = connection;
};
goog.inherits(chatango.modules.TextColorModule, goog.events.EventTarget);
chatango.modules.TextColorModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.TextColorModule");
chatango.modules.TextColorModule.prototype.closePopUps = function() {
  if (this.textColor_) {
    this.textColor_.dispose();
  }
};
chatango.modules.TextColorModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.textColor_.isVisible()) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
    this.textColor_.setMaxHeight(new_h);
    var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
    var width = Math.min(vpWidth * .9, 2.5 * chatango.managers.Style.getInstance().getScale());
    this.textColor_.setWidth(width);
    chatango.utils.display.constrainToStage(this.textColor_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.textColor_.getElement());
    this.textColor_.constrainDialogsToScreen(opt_stageRect);
    var keyboard = chatango.managers.Keyboard.getInstance();
    goog.events.listenOnce(keyboard, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED, this.constrainDialogsToScreenWithDelay, undefined, this);
  }
};
chatango.modules.TextColorModule.prototype.openTextColorDialog = function() {
  this.closePopUps();
  this.textColor_ = new chatango.messagestyles.TextColorDialog(this.connection_);
  this.textColor_.setVisible(true);
  goog.events.listen(this.textColor_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changed_, undefined, this);
  this.constrainDialogsToScreen();
};
chatango.modules.TextColorModule.prototype.constrainDialogsToScreenWithDelay = function(opt_stageRect) {
  var that = this;
  setTimeout(function() {
    that.constrainDialogsToScreen(opt_stageRect);
  }, 100);
};
chatango.modules.TextColorModule.prototype.initCopy = function(pack_id) {
  if (this.textColor_) {
    this.textColor_.updateCopy();
  }
};
chatango.modules.TextColorModule.prototype.changed_ = function(e) {
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CHANGED);
};
goog.module.ModuleManager.getInstance().setLoaded("TextColorModule");

