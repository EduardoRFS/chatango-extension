goog.provide("chatango.ui.icons.ItalicsIcon");
goog.require("chatango.ui.icons.SvgToggleIcon");
chatango.ui.icons.ItalicsIcon = function(opt_color, opt_borderColor, opt_domHelper) {
  chatango.ui.icons.SvgToggleIcon.call(this, opt_color, opt_borderColor, opt_domHelper);
};
goog.inherits(chatango.ui.icons.ItalicsIcon, chatango.ui.icons.SvgToggleIcon);
chatango.ui.icons.ItalicsIcon.prototype.draw = function() {
  chatango.ui.icons.ItalicsIcon.superClass_.draw.call(this);
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<text x="50" y="50" font-size="90" font-style="italic" fill="' + this.color_ + '" font-family="serif" text-anchor="middle" dy="0.666ex">i</text></svg>';
  this.element_.innerHTML = svg;
  this.element_.style.marginLeft = ".3em";
  this.element_.style.paddingLeft = "0";
  this.element_.style.boxSizing = "border-box";
};
chatango.ui.icons.ItalicsIcon.prototype.setSize = function(size) {
};
goog.provide("chatango.ui.icons.TextColorIcon");
goog.require("chatango.ui.icons.Icon");
chatango.ui.icons.TextColorIcon = function(opt_color, opt_domHelper, textColor) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.textColor = textColor;
};
goog.inherits(chatango.ui.icons.TextColorIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.TextColorIcon.prototype.draw = function() {
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<text x="50" y="65" text-anchor="middle" font-size="65" fill="' + this.color_ + '">A</text>' + '<rect x="0" y="75" width="100" height="25"  style="fill:' + this.textColor + '"/></svg>';
  this.element_.innerHTML = svg;
};
chatango.ui.icons.TextColorIcon.prototype.setColor = function(color) {
  this.textColor = color;
  this.draw();
};
goog.provide("chatango.ui.YesNoDialog");
goog.require("chatango.ui.ScrollableDialog");
chatango.ui.YesNoDialog = function(question, opt_title) {
  this.question_ = question;
  var lm = chatango.managers.LanguageManager.getInstance();
  if (opt_title) {
    this.title_ = opt_title;
  } else {
    this.title_ = lm.getString("ui", "confirm_title");
  }
  var width = 400;
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  chatango.ui.ScrollableDialog.call(this, width, height, true);
  this.setResizable(false);
};
goog.inherits(chatango.ui.YesNoDialog, chatango.ui.ScrollableDialog);
chatango.ui.YesNoDialog.prototype.createDom = function() {
  chatango.ui.YesNoDialog.superClass_.createDom.call(this);
  goog.style.setStyle(this.getElement(), "visibility", "hidden");
  var content = this.getContentElement();
  this.confirmWrap_ = goog.dom.createDom("div", {"id":"confirm-wrap"});
  goog.dom.appendChild(content, this.confirmWrap_);
  var lm = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.title_);
  this.questionEl_ = goog.dom.createDom("div", {"id":"confirm-question"});
  this.questionEl_.innerHTML = this.question_;
  goog.dom.appendChild(this.confirmWrap_, this.questionEl_);
  this.buttonWrap_ = goog.dom.createDom("div", {"id":"buttons-wrapper"});
  goog.dom.appendChild(this.confirmWrap_, this.buttonWrap_);
  this.confirmButtonWrap_ = goog.dom.createDom("div", {"id":"confirm-button-wrap"});
  goog.style.setInlineBlock(this.confirmButtonWrap_);
  this.confirmButton_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.confirmButton_.setContent(lm.getString("ui", "yes"));
  goog.events.listen(this.confirmButton_, goog.ui.Component.EventType.ACTION, this.confirmButtonClick, false, this);
  this.confirmButton_.render(this.confirmButtonWrap_);
  goog.dom.appendChild(this.buttonWrap_, this.confirmButtonWrap_);
  this.cancelButtonWrap_ = goog.dom.createDom("div", {"id":"cancel-button-wrap"});
  goog.style.setInlineBlock(this.cancelButtonWrap_);
  this.cancelButton_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.cancelButton_.setContent(lm.getString("ui", "no"));
  goog.events.listen(this.cancelButton_, goog.ui.Component.EventType.ACTION, this.cancelButtonClick, false, this);
  this.cancelButton_.render(this.cancelButtonWrap_);
  goog.dom.appendChild(this.buttonWrap_, this.cancelButtonWrap_);
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
  this.showCloseButton(false);
};
chatango.ui.YesNoDialog.prototype.confirmButtonClick = function(e) {
  this.dispatchEvent(chatango.events.EventType.CONFIRM);
  this.disposeInternal();
};
chatango.ui.YesNoDialog.prototype.cancelButtonClick = function(e) {
  this.dispatchEvent(chatango.events.EventType.CANCEL);
  this.disposeInternal();
};
chatango.ui.YesNoDialog.prototype.draw = function() {
  chatango.ui.YesNoDialog.superClass_.draw.call(this);
  var that = this;
  setTimeout(function() {
    that.makeVisible();
  }, 0);
};
chatango.ui.YesNoDialog.prototype.makeVisible = function() {
  goog.style.setStyle(this.getElement(), "visibility", "visible");
};
goog.provide("chatango.ui.icons.BoldIcon");
goog.require("chatango.ui.icons.SvgToggleIcon");
chatango.ui.icons.BoldIcon = function(opt_color, opt_borderColor, opt_domHelper) {
  chatango.ui.icons.SvgToggleIcon.call(this, opt_color, opt_borderColor, opt_domHelper);
};
goog.inherits(chatango.ui.icons.BoldIcon, chatango.ui.icons.SvgToggleIcon);
chatango.ui.icons.BoldIcon.prototype.draw = function() {
  chatango.ui.icons.BoldIcon.superClass_.draw.call(this);
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<text x="50" y="50" font-size="90" font-weight="bold" fill="' + this.color_ + '" text-anchor="middle" dy="0.666ex">B</text></svg>';
  this.element_.innerHTML = svg;
  this.element_.style.marginLeft = ".3em";
  this.element_.style.paddingLeft = "0";
  this.element_.style.boxSizing = "border-box";
};
chatango.ui.icons.BoldIcon.prototype.setSize = function(size) {
};
goog.provide("chatango.ui.icons.UnderlineIcon");
goog.require("chatango.ui.icons.SvgToggleIcon");
chatango.ui.icons.UnderlineIcon = function(opt_color, opt_borderColor, opt_domHelper) {
  chatango.ui.icons.SvgToggleIcon.call(this, opt_color, opt_borderColor, opt_domHelper);
};
goog.inherits(chatango.ui.icons.UnderlineIcon, chatango.ui.icons.SvgToggleIcon);
chatango.ui.icons.UnderlineIcon.prototype.draw = function() {
  chatango.ui.icons.UnderlineIcon.superClass_.draw.call(this);
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<text x="50" y="50" font-size="90" text-decoration="underline" fill="' + this.color_ + '" text-anchor="middle" dy="0.666ex">U</text></svg>';
  this.element_.innerHTML = svg;
  this.element_.style.marginLeft = ".3em";
  this.element_.style.paddingLeft = "0";
  this.element_.style.boxSizing = "border-box";
};
chatango.ui.icons.UnderlineIcon.prototype.setSize = function(size) {
};
goog.provide("chatango.ui.ScrollablePopupMenu");
goog.require("goog.ui.Component.EventType");
goog.require("goog.dom");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.ui.ScrollPane");
goog.require("chatango.managers.Environment");
chatango.ui.ScrollablePopupMenu = function(opt_domHelper, opt_renderer) {
  goog.base(this, opt_domHelper, opt_renderer);
  this.scrollPane_ = new chatango.ui.ScrollPane;
};
goog.inherits(chatango.ui.ScrollablePopupMenu, chatango.ui.PopupMenu);
chatango.ui.ScrollablePopupMenu.prototype.createDom = function() {
  chatango.ui.ScrollablePopupMenu.superClass_.createDom.call(this);
  this.scrollPane_.render(this.element_);
  this.element_ = this.scrollPane_.outer_;
  this.scrollPane_.setElementInternal(this.element_);
  this.contentEl_ = this.element_;
  goog.dom.classlist.add(this.element_, "desktop-scroll-menu");
  if (goog.userAgent.IE) {
    this.scrollPane_.createCssScrollBar();
  } else {
    if (goog.userAgent.WEBKIT) {
      this.scrollPane_.useDefaultScrollBar();
    } else {
      this.scrollPane_.createCssScrollBar();
    }
  }
  this.element_.style.position = "absolute";
  goog.dom.classlist.add(this.element_, "goog-menu");
};
chatango.ui.ScrollablePopupMenu.prototype.draw = function() {
  if (this.scrollPane_.iScroll_) {
    setTimeout(function() {
      this.scrollPane_.iScroll_.refresh();
    }.bind(this), 0);
  }
};
chatango.ui.ScrollablePopupMenu.prototype.getContentElement = function() {
  return this.contentEl_;
};
goog.provide("chatango.ui.icons.SvgArrowIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgArrowIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.SvgArrowIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgArrowIcon.prototype.createDom = function() {
  chatango.ui.icons.SvgArrowIcon.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, "icon-arrow");
};
chatango.ui.icons.SvgArrowIcon.prototype.getArrow = function(width, height) {
  width = width || 15;
  height = height || 15;
  var left = 25 - width / 2, right = 25 + width / 2;
  var top = 50 - height / 2, bottom = 50 + height / 2;
  return'<svg width="30%" height="100%" overflow="hidden" viewBox="0 0 50 100">' + "<defs></defs>" + '<path d="M ' + left + " " + top + " L " + right + " " + top + " L 25 " + bottom + ' Z" fill="' + this.color_ + '">' + "</svg>";
};
goog.provide("chatango.ui.icons.FontSizeIcon");
goog.require("chatango.ui.icons.SvgArrowIcon");
chatango.ui.icons.FontSizeIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgArrowIcon.call(this, opt_color, opt_domHelper);
  this.fontSize_ = "11";
};
goog.inherits(chatango.ui.icons.FontSizeIcon, chatango.ui.icons.SvgArrowIcon);
chatango.ui.icons.FontSizeIcon.prototype.draw = function() {
  var svg = '<svg width="70%" height="100%" overflow="hidden" viewBox="0 0 130 100">' + "<defs></defs>" + '<text x="65" y="50" font-size="110" fill="' + this.color_ + '" text-anchor="middle" dy=".666ex">' + this.fontSize_ + "</text>" + "</svg>";
  svg += this.getArrow(40, 30);
  this.element_.innerHTML = svg;
  this.element_.style.border = "1px solid transparent";
  this.element_.style.boxSizing = "border-box";
};
chatango.ui.icons.FontSizeIcon.prototype.setFontSize = function(size) {
  this.fontSize_ = size;
  this.draw();
};
goog.provide("chatango.ui.icons.BackgroundIcon");
goog.require("chatango.ui.icons.Icon");
chatango.ui.icons.BackgroundIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.BackgroundIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.BackgroundIcon.prototype.draw = function() {
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<text x="0" y="80" font-size="80" fill="' + this.color_ + '">bg</text></svg>';
  this.element_.innerHTML = svg;
};
chatango.ui.icons.BackgroundIcon.prototype.setSize = function(size) {
};
goog.provide("chatango.ui.icons.ToggleStylesIcon");
goog.require("chatango.ui.icons.Icon");
chatango.ui.icons.ToggleStylesIcon = function(isOn, opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.isOn_ = isOn;
};
goog.inherits(chatango.ui.icons.ToggleStylesIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.ToggleStylesIcon.prototype.draw = function() {
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<text x="50" y="50" font-size="120" fill="' + this.color_ + '" text-anchor="middle" dy=".666ex">';
  svg += this.isOn_ ? "&#215;" : "+";
  svg += "</text></svg>";
  this.element_.innerHTML = svg;
  this.element_.style.marginLeft = ".3em";
  this.element_.style.border = "1px solid transparent";
  this.element_.style.boxSizing = "border-box";
};
chatango.ui.icons.ToggleStylesIcon.prototype.setStatus = function(isOn) {
  this.isOn_ = isOn;
  this.draw();
};
goog.provide("chatango.ui.icons.FontFamilyIcon");
goog.require("chatango.ui.icons.SvgArrowIcon");
chatango.ui.icons.FontFamilyIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgArrowIcon.call(this, opt_color, opt_domHelper);
  this.fontFamily_ = "Arial";
};
goog.inherits(chatango.ui.icons.FontFamilyIcon, chatango.ui.icons.SvgArrowIcon);
chatango.ui.icons.FontFamilyIcon.prototype.draw = function() {
  var svg = '<svg width="70%" height="100%" overflow="hidden" viewBox="0 0 130 100">' + "<defs></defs>" + '<text x="65" y="50" font-size="110" fill="' + this.color_ + '" font-family="' + this.fontFamily_ + '" text-anchor="middle" dy=".666ex">T</text>' + "</svg>";
  svg += this.getArrow(40, 30);
  this.element_.innerHTML = svg;
  this.element_.style.border = "1px solid transparent";
  this.element_.style.boxSizing = "border-box";
};
chatango.ui.icons.FontFamilyIcon.prototype.setFontFamily = function(family) {
  this.fontFamily_ = family;
  this.draw();
};
goog.provide("chatango.ui.StyleBar");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.login.LoginResponseEvent");
goog.require("chatango.login.Session");
goog.require("chatango.login.SignupRequestEvent");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.managers.SupportChatangoDialogManager");
goog.require("chatango.managers.TouchHandler");
goog.require("chatango.strings.CommonUIStrings");
goog.require("chatango.ui.ConfirmDialog");
goog.require("chatango.ui.ColorPickerButton");
goog.require("chatango.ui.ScrollablePopupMenu");
goog.require("chatango.ui.YesNoDialog");
goog.require("chatango.ui.icons.BackgroundIcon");
goog.require("chatango.ui.icons.BoldIcon");
goog.require("chatango.ui.icons.FontFamilyIcon");
goog.require("chatango.ui.icons.FontSizeIcon");
goog.require("chatango.ui.icons.ItalicsIcon");
goog.require("chatango.ui.icons.TextColorIcon");
goog.require("chatango.ui.icons.ToggleStylesIcon");
goog.require("chatango.ui.icons.UnderlineIcon");
goog.require("chatango.utils.formatting");
goog.require("goog.module.ModuleManager");
goog.require("goog.ui.Component");
chatango.ui.StyleBar = function(cm, opt_domHelper) {
  this.cm_ = cm;
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.groupInfo_ = this.managers_.getManager(chatango.group.GroupInfo.ManagerType);
  if (!chatango.managers.Environment.getInstance().isMockGroup()) {
    this.connection_ = cm.getConnection();
  } else {
    this.connection_ = null;
  }
  this.session_ = new chatango.login.Session;
  this.userManager_ = chatango.users.UserManager.getInstance();
  goog.ui.Component.call(this, opt_domHelper);
  this.user_ = chatango.users.UserManager.getInstance().currentUser;
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
  goog.events.listen(this.msManager_, chatango.managers.MessageStyleManager.EventType.MSG_STYLES_ALLOWED_CHANGED, this.draw, false, this);
  this.fontFamilyMenu_ = new chatango.ui.ScrollablePopupMenu;
  this.fontFamilyMenu_.render(document.body);
  this.fontSizeMenu_ = new chatango.ui.ScrollablePopupMenu;
  this.fontSizeMenu_.render(document.body);
  goog.events.listen(this.fontFamilyMenu_, goog.ui.Component.EventType.ACTION, this.onFontFamilyChange_, true, this);
  goog.events.listen(this.fontSizeMenu_, goog.ui.Component.EventType.ACTION, this.onFontSizeChange_, true, this);
  var lm = chatango.managers.LanguageManager.getInstance();
  lm.getStringPack("ui", chatango.strings.CommonUIStrings, function() {
  }, this);
};
goog.inherits(chatango.ui.StyleBar, goog.ui.Component);
chatango.ui.StyleBar.prototype.logger = goog.debug.Logger.getLogger("chatango.ui.StyleBar");
chatango.ui.StyleBar.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"id":"style-bar"});
  this.element_.style.visibility = "hidden";
  var uid = this.user_ ? this.user_.getUid() : "";
  var styleManager = chatango.managers.Style.getInstance();
  var iconBorderColor = styleManager.isBorderColorIsSameAsBgColor() ? styleManager.getUserDefinedIconColor() : styleManager.getUDBorderColor();
  var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  var actionEvents = chatango.managers.Environment.getInstance().isDesktop() ? [goog.events.EventType.CLICK] : [goog.events.EventType.TOUCHSTART, goog.events.EventType.TOUCHEND];
  this.toggleStylesIcon_ = new chatango.ui.icons.ToggleStylesIcon(stylesOn, chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.toggleStylesIcon_.render(this.element_);
  goog.events.listen(this.toggleStylesIcon_.getElement(), goog.events.EventType.CLICK, this.onToggleStylesClicked_, undefined, this);
  var fontFamily = this.msManager_.getStyle("fontFamily");
  this.fontFamilyIcon_ = new chatango.ui.icons.FontFamilyIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.fontFamilyIcon_.render(this.element_);
  this.fontFamilyIcon_.setFontFamily(chatango.utils.formatting.getFont(fontFamily));
  goog.events.listen(this.fontFamilyIcon_.getElement(), actionEvents, this.onFontFamilyClicked_, null, this);
  var fontSize = this.msManager_.getStyle("fontSize");
  this.fontSizeIcon_ = new chatango.ui.icons.FontSizeIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.fontSizeIcon_.render(this.element_);
  this.fontSizeIcon_.setFontSize(fontSize);
  goog.events.listen(this.fontSizeIcon_.getElement(), actionEvents, this.onFontSizeClicked_, null, this);
  var bold = this.msManager_.getStyle("bold");
  this.boldIcon_ = new chatango.ui.icons.BoldIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR, iconBorderColor);
  this.boldIcon_.render(this.element_);
  this.boldIcon_.setIsOn(bold);
  goog.events.listen(this.boldIcon_.getElement(), actionEvents, this.onBoldClicked_, null, this);
  var italics = this.msManager_.getStyle("italics");
  this.italicsIcon_ = new chatango.ui.icons.ItalicsIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR, iconBorderColor);
  this.italicsIcon_.render(this.element_);
  this.italicsIcon_.setIsOn(italics);
  goog.events.listen(this.italicsIcon_.getElement(), actionEvents, this.onItalicsClicked_, false, this);
  var underline = this.msManager_.getStyle("underline");
  this.underlineIcon_ = new chatango.ui.icons.UnderlineIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR, iconBorderColor);
  this.underlineIcon_.render(this.element_);
  this.underlineIcon_.setIsOn(underline);
  goog.events.listen(this.underlineIcon_.getElement(), actionEvents, this.onUnderlineClicked_, false, this);
  this.backgroundIcon_ = new chatango.ui.icons.BackgroundIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.backgroundIcon_.render(this.element_);
  goog.events.listen(this.backgroundIcon_.getElement(), actionEvents, this.onBackgroundClicked_, false, this);
  var textColor = this.msManager_.getStyle("textColor") || styleManager.getMsgTextColor().replace("#", "");
  this.textColorIcon_ = new chatango.ui.icons.TextColorIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR, undefined, "#" + textColor);
  this.textColorIcon_.render(this.element_);
  goog.events.listen(this.textColorIcon_.getElement(), actionEvents, this.onTextColorClick_, undefined, this);
  this.draw();
  goog.dom.classes.add(this.element_, "style-bar");
};
chatango.ui.StyleBar.prototype.draw = function() {
  if (this.user_ && this.user_.isPremium() === chatango.managers.PremiumManager.PremiumType.PENDING) {
    goog.events.listenOnce(chatango.managers.PremiumManager.getInstance(), chatango.managers.PremiumManager.EventType.STATUS_LOADED, function(e) {
      this.draw();
    }, false, this);
    return;
  }
  var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  this.toggleStylesIcon_.setStatus(stylesOn);
  var isAnon = !this.user_ || this.user_.isAnon() || this.user_.isTemp();
  this.toggleStylesIcon_.getElement().style.display = !this.msManager_.getEmbedAllowsMessageStyles() || isAnon ? "none" : "";
  this.fontFamilyIcon_.getElement().style.display = !stylesOn || isAnon ? "none" : "";
  this.fontSizeIcon_.getElement().style.display = !stylesOn || isAnon ? "none" : "";
  this.backgroundIcon_.getElement().style.display = !stylesOn || isAnon ? "none" : "";
  this.textColorIcon_.getElement().style.display = !stylesOn || isAnon ? "none" : "";
  this.boldIcon_.setIsOn(this.msManager_.getStyle("bold"));
  this.italicsIcon_.setIsOn(this.msManager_.getStyle("italics"));
  this.underlineIcon_.setIsOn(this.msManager_.getStyle("underline"));
  this.fontSizeIcon_.setFontSize(this.msManager_.getStyle("fontSize"));
  this.fontFamilyIcon_.setFontFamily(chatango.utils.formatting.getFont(this.msManager_.getStyle("fontFamily")));
  this.element_.style.visibility = "";
};
chatango.ui.StyleBar.prototype.getMessageStyleEditorModule_ = function() {
  if (typeof this.messageStyleEditorModule_ === "undefined") {
    this.messageStyleEditorModule_ = new chatango.modules.MessageStyleEditorModule(this.connection_);
    goog.events.listen(this.messageStyleEditorModule_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changedStyle_, undefined, this);
  }
  return this.messageStyleEditorModule_;
};
chatango.ui.StyleBar.prototype.getTextColorModule_ = function() {
  if (typeof this.textColorModule_ === "undefined") {
    this.textColorModule_ = new chatango.modules.TextColorModule(this.connection_);
    goog.events.listen(this.textColorModule_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changedStyle_, undefined, this);
  }
  return this.textColorModule_;
};
chatango.ui.StyleBar.prototype.onFontFamilyClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  var userType = null;
  if (chatango.users.UserManager.getInstance().currentUser) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  }
  if (userType != chatango.users.User.UserType.SELLER) {
    goog.module.ModuleManager.getInstance().execOnLoad("LoginModule", function() {
      this.getLoginModule_().openLoginPopup(null, null, true);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLoginEditor, false, this);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.cm_.login, false, this.cm_);
      goog.events.listen(this.getLoginModule_(), chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.userManager_.signup, false, this.userManager_);
    }, this);
  } else {
    this.fontFamilyMenu_.removeChildren(true);
    var item;
    for (var i = 0;i < chatango.utils.formatting.FONTS_TABLE.length;i++) {
      item = new goog.ui.MenuItem(chatango.utils.formatting.FONTS_TABLE[i], i);
      item.setSelectable(true);
      item.setSelected(this.msManager_.getStyle("fontFamily") == i);
      this.fontFamilyMenu_.addChild(item, true);
    }
    this.fontFamilyMenu_.showAtElement(this.fontFamilyIcon_.getElement(), goog.positioning.Corner.TOP_RIGHT, goog.positioning.Corner.BOTTOM_RIGHT);
    goog.style.setHeight(this.fontFamilyMenu_.getElement(), "");
    this.constrainDialogsToScreen();
  }
};
chatango.ui.StyleBar.prototype.onFontFamilyChange_ = function(e) {
  var indexCode = e.target.getValue();
  this.msManager_.setStyle("fontFamily", indexCode);
  this.fontFamilyIcon_.setFontFamily(chatango.utils.formatting.getFont(indexCode));
  this.changedStyle_();
  this.fontFamilyMenu_.hide();
};
chatango.ui.StyleBar.prototype.onFontSizeClicked_ = function(opt_e) {
  if (opt_e) {
    if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(opt_e)) {
      return;
    }
  }
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var userType = null;
  if (cUser) {
    userType = cUser.getType();
  }
  if (userType != chatango.users.User.UserType.SELLER) {
    goog.module.ModuleManager.getInstance().execOnLoad("LoginModule", function() {
      this.getLoginModule_().openLoginPopup(null, null, true);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLoginEditor, false, this);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.cm_.login, false, this.cm_);
      goog.events.listen(this.getLoginModule_(), chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.userManager_.signup, false, this.userManager_);
    }, this);
  } else {
    if (cUser.isPremium() === chatango.managers.PremiumManager.PremiumType.PENDING) {
      goog.events.listenOnce(chatango.managers.PremiumManager.getInstance(), chatango.managers.PremiumManager.EventType.STATUS_LOADED, function(e) {
        this.onFontSizeClicked_();
      }, false, this);
      return;
    }
    this.fontSizeMenu_.removeChildren(true);
    var item;
    var maxFreeSize = 14;
    var maxSize = this.groupInfo_ && this.groupInfo_.getPaymentsOk() || cUser.isPremiumOrOwner() ? 22 : maxFreeSize;
    for (var i = 9;i <= maxSize;i++) {
      item = new goog.ui.MenuItem(i.toString(), i);
      item.setSelected(this.msManager_.getStyle("fontSize") == i);
      this.fontSizeMenu_.addChild(item, true);
      if (i > maxFreeSize && !cUser.isPremiumOrOwner()) {
        item.setEnabled(false);
        goog.events.listenOnce(item.getElement(), goog.events.EventType.CLICK, function() {
          this.activatePayments_();
          this.fontSizeMenu_.hide();
        }, false, this);
      }
    }
    this.fontSizeMenu_.showAtElement(this.fontSizeIcon_.getElement(), goog.positioning.Corner.TOP_RIGHT, goog.positioning.Corner.BOTTOM_RIGHT);
    goog.style.setHeight(this.fontSizeMenu_.getElement(), "");
    this.constrainDialogsToScreen();
  }
};
chatango.ui.StyleBar.prototype.activatePayments_ = function(e) {
  chatango.managers.SupportChatangoDialogManager.getInstance().openDialog(chatango.managers.PaymentsManager.FlowEntrance.PREMIUM);
  this.constrainDialogsToScreen();
};
chatango.ui.StyleBar.prototype.onFontSizeChange_ = function(e) {
  var fontSize = e.target.getValue();
  this.msManager_.setStyle("fontSize", fontSize);
  this.fontSizeIcon_.setFontSize(fontSize);
  this.changedStyle_();
  this.fontSizeMenu_.hide();
};
chatango.ui.StyleBar.prototype.onBoldClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  var newValue = this.msManager_.toggleStyle("bold");
  this.changedStyle_("bold");
  this.boldIcon_.setIsOn(newValue);
};
chatango.ui.StyleBar.prototype.onItalicsClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  var newValue = this.msManager_.toggleStyle("italics");
  this.changedStyle_("italics");
  this.italicsIcon_.setIsOn(newValue);
};
chatango.ui.StyleBar.prototype.onUnderlineClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  var newValue = this.msManager_.toggleStyle("underline");
  this.changedStyle_("underline");
  this.underlineIcon_.setIsOn(newValue);
};
chatango.ui.StyleBar.prototype.onToggleStylesClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  var value = this.msManager_.toggleStyle(chatango.managers.MessageStyleManager.STYLES_ON, true);
  if (this.toggleStylesDialog_) {
    this.toggleStylesDialog_.dispose();
  }
  var lm = chatango.managers.LanguageManager.getInstance();
  var str = lm.getString("ui", "remember_fs").split("*on|off*").join(value ? "on" : "off");
  this.toggleStylesDialog_ = new chatango.ui.YesNoDialog(str, "Toggle font styles");
  this.toggleStylesDialog_.setVisible(true);
  this.constrainDialogsToScreen();
  goog.events.listen(this.toggleStylesDialog_, [chatango.events.EventType.CONFIRM, chatango.events.EventType.CANCEL], this.onToggleDialog_, false, this);
  this.toggleStylesIcon_.setStatus(value);
  this.fontFamilyIcon_.getElement().style.display = value ? "" : "none";
  this.fontSizeIcon_.getElement().style.display = value ? "" : "none";
  this.backgroundIcon_.getElement().style.display = value ? "" : "none";
  this.textColorIcon_.getElement().style.display = value ? "" : "none";
  this.changedStyle_(chatango.managers.MessageStyleManager.STYLES_ON);
};
chatango.ui.StyleBar.prototype.onToggleDialog_ = function(e) {
  if (e.type === chatango.events.EventType.CONFIRM) {
    this.msManager_.saveStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  }
};
chatango.ui.StyleBar.prototype.onBackgroundClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  var userType = null;
  if (chatango.users.UserManager.getInstance().currentUser) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  }
  if (userType != chatango.users.User.UserType.SELLER) {
    goog.module.ModuleManager.getInstance().execOnLoad("LoginModule", function() {
      this.getLoginModule_().openLoginPopup(null, null, true);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLoginEditor, false, this);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.cm_.login, false, this.cm_);
      goog.events.listen(this.getLoginModule_(), chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.userManager_.signup, false, this.userManager_);
    }, this);
  } else {
    this.openEditorDialog();
  }
};
chatango.ui.StyleBar.prototype.onSuccessfulLoginEditor = function() {
  this.getLoginModule_().closeLoginPopup();
  this.dispatchEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS);
  this.openEditorDialog();
};
chatango.ui.StyleBar.prototype.openEditorDialog = function() {
  if (!this.messageStyleEditorModule_) {
    goog.module.ModuleManager.getInstance().execOnLoad("MessageStyleEditorModule", function() {
      var msgStyleEd = this.getMessageStyleEditorModule_().openMessageStyleEditorDialog();
      goog.events.listen(msgStyleEd, chatango.events.EventType.OPEN_SUPPORT_US, this.activatePayments_, false, this);
    }, this);
  } else {
    var msgStyleEd = this.getMessageStyleEditorModule_().openMessageStyleEditorDialog();
    goog.events.listen(msgStyleEd, chatango.events.EventType.OPEN_SUPPORT_US, this.activatePayments_, false, this);
  }
};
chatango.ui.StyleBar.prototype.onSuccessfulLoginTextColor = function() {
  this.getLoginModule_().closeLoginPopup();
  this.dispatchEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS);
  this.openTextColorPicker();
};
chatango.ui.StyleBar.prototype.openTextColorPicker = function() {
  if (!this.textColorModule_) {
    goog.module.ModuleManager.getInstance().execOnLoad("TextColorModule", function() {
      this.getTextColorModule_().openTextColorDialog();
    }, this);
  } else {
    this.getTextColorModule_().openTextColorDialog();
  }
};
chatango.ui.StyleBar.prototype.onTextColorClick_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  var userType = null;
  if (chatango.users.UserManager.getInstance().currentUser) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  }
  if (userType != chatango.users.User.UserType.SELLER) {
    goog.module.ModuleManager.getInstance().execOnLoad("LoginModule", function() {
      this.getLoginModule_().openLoginPopup(null, null, true);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLoginTextColor, false, this);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.cm_.login, false, this.cm_);
      goog.events.listen(this.getLoginModule_(), chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.userManager_.signup, false, this.userManager_);
    }, this);
  } else {
    this.openTextColorPicker();
  }
};
chatango.ui.StyleBar.prototype.changedStyle_ = function(type) {
  this.user_ = chatango.users.UserManager.getInstance().currentUser;
  if (this.user_) {
    var textColor = this.msManager_.getStyle("textColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
    this.textColorIcon_.setColor("#" + textColor);
  }
  var evt = new goog.events.Event(chatango.events.MessageStyleEvent.EventType.CHANGED);
  if (type) {
    if (type instanceof goog.events.Event && type.data) {
      evt.data = type.data;
    } else {
      evt.data = type;
    }
  }
  this.dispatchEvent(evt);
  this.draw();
};
chatango.ui.StyleBar.prototype.getLoginModule_ = function() {
  if (typeof this.loginModule_ === "undefined") {
    this.loginModule_ = new chatango.modules.LoginModule(this.session_);
  }
  return this.loginModule_;
};
chatango.ui.StyleBar.prototype.closePopUps = function() {
  if (this.textColorModule_) {
    this.textColorModule_.closePopUps();
  }
  if (this.messageStyleEditorModule_) {
    this.messageStyleEditorModule_.closePopUps();
  }
};
chatango.ui.StyleBar.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var dialogs = [this.toggleStylesDialog_], dialog;
  for (var i = 0;i < dialogs.length;i++) {
    dialog = dialogs[i];
    if (dialog && dialog.isVisible()) {
      var new_h = Math.round(stage_h);
      dialog.setMaxHeight(new_h * .98);
      if (!dialog.isFullScreenAndMobileOrSmallEmbed()) {
        this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
        var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
        var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
        dialog.setWidth(width);
      } else {
        dialog.draw();
      }
      chatango.utils.display.constrainToStage(dialog.getElement(), opt_stageRect, true);
      dialog.keepActiveFormElementOnScreen();
    }
  }
  chatango.managers.SupportChatangoDialogManager.getInstance().constrainDialogToScreen(opt_stageRect);
  if (this.textColorModule_) {
    this.textColorModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.messageStyleEditorModule_) {
    this.messageStyleEditorModule_.constrainDialogsToScreen(opt_stageRect);
  }
  setTimeout(goog.bind(this.constrainPopUpMenus, this, opt_stageRect), 0);
};
chatango.ui.StyleBar.prototype.constrainPopUpMenus = function(opt_stageRect) {
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  if (this.fontSizeMenu_.isVisible()) {
    goog.style.setHeight(this.fontSizeMenu_.getElement(), "");
    var sBounds = goog.style.getBounds(this.fontSizeMenu_.getElement());
    var sAvail = stage_h - goog.style.getBounds(this.fontSizeIcon_.getElement()).top;
    var sizeMenuHeight = sBounds.top < 0 || sBounds.height > stage_h - sAvail ? (stage_h - sAvail) * 2 / 3 : "";
    goog.style.setHeight(this.fontSizeMenu_.getElement(), sizeMenuHeight);
    this.fontSizeMenu_.showAtElement(this.fontSizeIcon_.getElement(), goog.positioning.Corner.TOP_RIGHT, goog.positioning.Corner.BOTTOM_RIGHT);
    this.fontSizeMenu_.draw();
  }
  if (this.fontFamilyMenu_.isVisible()) {
    goog.style.setHeight(this.fontFamilyMenu_.getElement(), "");
    var fBounds = goog.style.getBounds(this.fontFamilyMenu_.getElement());
    var fAvail = stage_h - goog.style.getBounds(this.fontFamilyIcon_.getElement()).top;
    var familyMenuHeight = fBounds.top < 0 || fBounds.height > stage_h - fAvail ? (stage_h - fAvail) * 2 / 3 : "";
    goog.style.setHeight(this.fontFamilyMenu_.getElement(), familyMenuHeight);
    this.fontFamilyMenu_.showAtElement(this.fontFamilyIcon_.getElement(), goog.positioning.Corner.TOP_RIGHT, goog.positioning.Corner.BOTTOM_RIGHT);
    this.fontFamilyMenu_.draw();
    chatango.utils.display.constrainToStage(this.fontFamilyMenu_.getElement());
  }
};
goog.provide("chatango.modules.StyleBarModule");
goog.require("chatango.login.LoginResponseEvent");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.ui.StyleBar");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.StyleBarModule = function(container, cm) {
  goog.events.EventTarget.call(this);
  if (chatango.DEBUG) {
    this.logger.info("Creating StyleBarModule");
  }
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.container_ = container;
  this.open_ = false;
  this.cm_ = cm;
};
goog.inherits(chatango.modules.StyleBarModule, goog.events.EventTarget);
chatango.modules.StyleBarModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.StyleBarModule");
chatango.modules.StyleBarModule.prototype.openStyleBar = function() {
  if (!this.styleBar_) {
    this.styleBar_ = new chatango.ui.StyleBar(this.cm_);
    goog.events.listen(this.styleBar_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changed_, undefined, this);
    goog.events.listen(this.styleBar_, chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLogin_, undefined, this);
    this.styleBar_.render(this.container_);
    var keyboard = chatango.managers.Keyboard.getInstance();
    goog.events.listenOnce(keyboard, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED, this.constrainDialogsToScreenWithDelay, undefined, this);
  }
  this.container_.style.display = "inherit";
  this.open_ = true;
};
chatango.modules.StyleBarModule.prototype.closeStyleBar = function() {
  this.container_.style.display = "none";
  this.open_ = false;
};
chatango.modules.StyleBarModule.prototype.toggleStyleBar = function() {
  if (this.open_) {
    this.closeStyleBar();
  } else {
    this.openStyleBar();
  }
};
chatango.modules.StyleBarModule.prototype.drawStyleBar = function() {
  this.styleBar_.changedStyle_();
};
chatango.modules.StyleBarModule.prototype.closePopUps = function() {
  this.styleBar_.closePopUps();
};
chatango.modules.StyleBarModule.prototype.constrainDialogsToScreenWithDelay = function(opt_stageRect) {
  var that = this;
  setTimeout(function() {
    that.constrainDialogsToScreen(opt_stageRect);
  }, 100);
};
chatango.modules.StyleBarModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  this.styleBar_.constrainDialogsToScreen(opt_stageRect);
};
chatango.modules.StyleBarModule.prototype.initCopy = function(pack_id) {
  if (this.styleBar_) {
    this.styleBar_.updateCopy();
  }
};
chatango.modules.StyleBarModule.prototype.changed_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.StyleBarModule.prototype.onSuccessfulLogin_ = function(e) {
  this.dispatchEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS);
};
goog.module.ModuleManager.getInstance().setLoaded("StyleBarModule");

