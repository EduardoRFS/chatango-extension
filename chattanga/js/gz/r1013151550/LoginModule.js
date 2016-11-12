goog.provide("chatango.login.TemporaryLogin");
goog.require("chatango.login.LoginRequest");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.login.TemporaryLogin = function(opt_domHelper, num) {
  goog.ui.Component.call(this, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.button_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("login_module", "go"));
  this.addChild(this.button_);
  this.order_ = num;
  this.handler_ = this.getHandler();
};
goog.inherits(chatango.login.TemporaryLogin, goog.ui.Component);
chatango.login.TemporaryLogin.prototype.logger = goog.debug.Logger.getLogger("chatango.login.TemporaryLogin");
chatango.login.TemporaryLogin.prototype.createDom = function() {
  var dom = this.getDomHelper();
  this.wrapperEl_;
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.MOBILE) {
    this.wrapperEl_ = dom.createDom("div", {"class":"login-widget mobile"});
  } else {
    this.wrapperEl_ = dom.createDom("div", {"class":"login-widget"});
  }
  this.titleEl_ = dom.createDom("h3", undefined, " ");
  dom.append(this.wrapperEl_, this.titleEl_);
  var row = dom.createDom("div", {"style":"overflow:hidden;"});
  dom.append(this.wrapperEl_, row);
  this.inputWrapperEl_ = dom.createDom("div", {"style":"float:left;overflow:hidden;"});
  dom.append(row, this.inputWrapperEl_);
  this.input_ = dom.createDom("input", {"id":"login-temp-name", "maxlength":"20", "type":"text", "placeholder":this.lm_.getString("login_module", "temp")});
  dom.append(this.inputWrapperEl_, this.input_);
  this.resetPlaceHolder_();
  this.handler_.listen(this.input_, goog.events.EventType.CLICK, this.resetPlaceHolder_);
  this.handler_.listen(new goog.events.KeyHandler(this.input_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.onAction_(e);
    }
  });
  this.buttonWrapperEl_ = dom.createDom("div", {"style":"float:right;overflow:hidden"});
  dom.append(row, this.buttonWrapperEl_);
  this.button_.render(this.buttonWrapperEl_);
  this.setElementInternal(this.wrapperEl_);
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
  this.handler_.listen(this.button_, goog.ui.Component.EventType.ACTION, this.onAction_);
};
chatango.login.TemporaryLogin.prototype.onAction_ = function(e) {
  if (!this.input_.value.match(/^[A-Za-z0-9]+$/)) {
    this.setPlaceHolderRed_("Invalid");
  } else {
    var request = new chatango.login.LoginRequest(this.input_.value);
    var requestEvent = new chatango.login.LoginRequestEvent(request, this);
    var events = [chatango.login.LoginResponseEvent.EventType.SUCCESS, chatango.login.LoginResponseEvent.EventType.ERROR];
    this.handler_.listen(request, events, this.onLoginResponse_);
    this.dispatchEvent(requestEvent);
  }
};
chatango.login.TemporaryLogin.prototype.onLoginResponse_ = function(e) {
  if (e.type == chatango.login.LoginResponseEvent.EventType.SUCCESS) {
    this.dispatchEvent(e);
  } else {
    if (e.type == chatango.login.LoginResponseEvent.EventType.ERROR) {
      if (parseInt(e.getErrorCode()) & 1) {
        this.setPlaceHolderRed_(this.lm_.getString("login_module", "name_banned"));
      } else {
        if (parseInt(e.getErrorCode()) & 8) {
          this.setPlaceHolderRed_(this.lm_.getString("login_module", "spoof_anons"));
        } else {
          this.setPlaceHolderRed_(this.lm_.getString("login_module", "already_exists"));
        }
      }
      this.dispatchEvent(e);
    }
  }
};
chatango.login.TemporaryLogin.prototype.draw = function(opt_viewSize) {
  if (!opt_viewSize) {
    opt_viewSize = chatango.login.LoginDialog.ViewSizeTypes.FULL;
  }
  var title;
  switch(opt_viewSize) {
    case chatango.login.LoginDialog.ViewSizeTypes.MEDIUM:
      title = this.lm_.getString("login_module", "as_temp_name_med").replace("*n*", this.order_);
      break;
    case chatango.login.LoginDialog.ViewSizeTypes.FULL:
    ;
    default:
      title = this.lm_.getString("login_module", "as_temp_name").replace("*n*", this.order_);
      break;
  }
  goog.dom.setTextContent(this.titleEl_, title);
  window.loginWrapper = this.wrapperEl_;
  var totalWidth = this.wrapperEl_.offsetWidth;
  var buttonWidth = this.buttonWrapperEl_.offsetWidth;
  var inputPaddingBox = goog.style.getPaddingBox(this.input_);
  var wrapperMarginBox = goog.style.getMarginBox(this.buttonWrapperEl_);
  var wrapperMargins = wrapperMarginBox.right + wrapperMarginBox.left;
  var inputPadding = inputPaddingBox.right + inputPaddingBox.left;
  var inputButtonGap = goog.style.getMarginBox(this.input_).left;
  var inputBorders = 2;
  var inputWidth = Math.floor(totalWidth - this.input_.offsetLeft - buttonWidth - inputPadding - goog.style.getMarginBox(this.input_).right - goog.style.getPaddingBox(this.wrapperEl_).right - goog.style.getPaddingBox(this.wrapperEl_).left - wrapperMargins - inputBorders);
  this.input_.style.width = inputWidth + "px";
  this.input_.setAttribute("placeholder", this.lm_.getString("login_module", "temp"));
};
chatango.login.TemporaryLogin.prototype.setPlaceHolderRed_ = function(text) {
  this.input_.value = "";
  this.input_.setAttribute("placeholder", text);
  goog.dom.classes.add(this.input_, "placeholder-error");
};
chatango.login.TemporaryLogin.prototype.resetPlaceHolder_ = function() {
  this.input_.setAttribute("placeholder", this.lm_.getString("login_module", "temp"));
  goog.dom.classes.remove(this.input_, "placeholder-error");
};
goog.provide("chatango.login.FullLogin");
goog.require("chatango.login.LoginRequest");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.login.SignupRequest");
goog.require("chatango.login.SignupRequestEvent");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.login.FullLogin = function(opt_domHelper, order, opt_request, opt_titleKey, opt_descKey, opt_showSignUp) {
  goog.ui.Component.call(this, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.request_ = opt_request != null ? opt_request : null;
  this.loginButton_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("login_module", "login"));
  this.addChild(this.loginButton_);
  this.signupButton_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("login_module", "signup"));
  this.addChild(this.signupButton_);
  this.order_ = order;
  this.titleKey_ = opt_titleKey;
  this.descKey_ = opt_descKey;
  this.showSignUpBtn_ = opt_showSignUp != false;
  this.handler_ = this.getHandler();
};
goog.inherits(chatango.login.FullLogin, goog.ui.Component);
chatango.login.FullLogin.prototype.logger = goog.debug.Logger.getLogger("chatango.login.FullLogin");
chatango.login.FullLogin.prototype.viewSize_ = null;
chatango.login.FullLogin.prototype.createDom = function() {
  var dom = this.getDomHelper();
  this.wrapperEl_;
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.MOBILE) {
    this.wrapperEl_ = dom.createDom("div", {"class":"login-widget full-login mobile"});
  } else {
    this.wrapperEl_ = dom.createDom("div", {"class":"login-widget full-login"});
  }
  this.titleEl_;
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.MOBILE) {
    this.titleEl_ = dom.createDom("h3", {"style":"padding-bottom:0em"}, " ");
  } else {
    this.titleEl_ = dom.createDom("h3", undefined, " ");
  }
  dom.append(this.wrapperEl_, this.titleEl_);
  this.messageEl_ = dom.createDom("div", {"id":"full-login-msg"}, " ");
  dom.append(this.wrapperEl_, this.messageEl_);
  var row = dom.createDom("div", {"style":"overflow:hidden;"});
  dom.append(this.wrapperEl_, row);
  this.userInputWrapperEl_ = dom.createDom("div", {"class":"input-wrapper"});
  dom.append(row, this.userInputWrapperEl_);
  this.userInput_ = dom.createDom("input", {"id":"full-username-input", "maxlength":"20", "type":"text", "placeholder":this.lm_.getString("login_module", "user")});
  dom.append(this.userInputWrapperEl_, this.userInput_);
  if (this.request_) {
    this.userInput_.value = this.request_.getName();
  }
  this.handler_.listen(new goog.events.KeyHandler(this.userInput_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.pwdInput_.focus();
    }
  });
  this.passwordInputWrapperEl_ = dom.createDom("div", {"class":"input-wrapper input-wrapper-bottom"});
  dom.append(row, this.passwordInputWrapperEl_);
  this.pwdInput_ = dom.createDom("input", {"id":"full-password-input", "maxlength":"20", "placeholder":this.lm_.getString("login_module", "pwd")});
  dom.append(this.passwordInputWrapperEl_, this.pwdInput_);
  if (this.request_) {
    this.pwdInput_.value = this.request_.getPassword();
  }
  this.handler_.listen(new goog.events.KeyHandler(this.pwdInput_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.onAction_(e);
    }
  });
  this.buttonsWrapperEl_ = dom.createDom("div", {"id":"buttons-wrapper"});
  this.forgotPasswordEl_ = dom.createDom("span", {"class":"link-text"});
  this.handler_.listen(this.forgotPasswordEl_, goog.events.EventType.CLICK, this.onForgotPassword_);
  this.loginButtonWrapperEl_ = dom.createDom("div", {"id":"full-loginbtn-wrapper"});
  dom.append(this.wrapperEl_, this.loginButtonWrapperEl_);
  this.loginButton_.render(this.loginButtonWrapperEl_);
  dom.append(this.buttonsWrapperEl_, this.loginButtonWrapperEl_);
  this.signupButtonWrapper_ = dom.createDom("div", {"id":"full-signupbtn-wrapper"});
  dom.append(this.wrapperEl_, this.signupButtonWrapper_);
  this.signupButton_.render(this.signupButtonWrapper_);
  dom.append(this.buttonsWrapperEl_, this.signupButtonWrapper_);
  dom.append(row, this.buttonsWrapperEl_);
  if (!this.showSignUpBtn_) {
    this.signupButtonWrapper_.style.display = "none";
  }
  this.setElementInternal(this.wrapperEl_);
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
  this.handler_.listen(this.loginButton_, goog.ui.Component.EventType.ACTION, this.onAction_);
  this.handler_.listen(this.signupButton_, goog.ui.Component.EventType.ACTION, this.onSignUpClicked_);
};
chatango.login.FullLogin.prototype.onSignUpClicked_ = function(e) {
  var request = new chatango.login.SignupRequest(this.userInput_.value, this.pwdInput_.value);
  var requestEvent = new chatango.login.SignupRequestEvent(request, this);
  this.dispatchEvent(requestEvent, chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST);
};
chatango.login.FullLogin.prototype.onAction_ = function(e) {
  if (this.userInput_.value == "") {
    this.showInputError_(this.lm_.getString("login_module", "enter_user"));
    return;
  }
  this.userInput_.value = this.userInput_.value.replace(/\s+$/g, "");
  if (!this.userInput_.value.match(/^[A-Za-z0-9]+$/)) {
    this.showInputError_(this.lm_.getString("login_module", "invalid_user"));
  } else {
    if (this.pwdInput_.value == "") {
      this.showInputError_(this.lm_.getString("login_module", "enter_pwd"));
    } else {
      var request = new chatango.login.LoginRequest(this.userInput_.value, this.pwdInput_.value);
      var requestEvent = new chatango.login.LoginRequestEvent(request, this);
      var events = [chatango.login.LoginResponseEvent.EventType.SUCCESS, chatango.login.LoginResponseEvent.EventType.ERROR];
      this.handler_.listen(request, events, this.onLoginResponse_);
      this.dispatchEvent(requestEvent, chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST);
    }
  }
};
chatango.login.FullLogin.prototype.onLoginResponse_ = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("Login Request Result: " + e.type);
  }
  this.showForgotLink(false);
  var showForgot = false;
  switch(e.type) {
    case chatango.login.LoginResponseEvent.EventType.ERROR:
      var failedMsg;
      if (e.getErrorCode() == "2") {
        switch(this.viewSize_) {
          case chatango.login.LoginDialog.ViewSizeTypes.SMALL:
          ;
          case chatango.login.LoginDialog.ViewSizeTypes.MEDIUM:
            failedMsg = this.lm_.getString("login_module", "login_error_short");
            showForgot = true;
            break;
          case chatango.login.LoginDialog.ViewSizeTypes.FULL:
          ;
          default:
            failedMsg = this.lm_.getString("login_module", "login_error");
            showForgot = true;
            break;
        }
      } else {
        failedMsg = this.lm_.getString("login_module", "username_banned");
      }
      goog.dom.setTextContent(this.messageEl_, failedMsg);
      if (showForgot) {
        this.showForgotLink(true);
      }
      this.messageEl_.style.display = "block";
      goog.dom.classes.add(this.messageEl_, "form-error");
      this.dispatchEvent(e);
      break;
    case chatango.login.LoginResponseEvent.EventType.SUCCESS:
      this.dispatchEvent(e);
      break;
  }
};
chatango.login.FullLogin.prototype.showForgotLink = function(bool) {
  goog.dom.removeNode(this.forgotPasswordEl_);
  if (bool) {
    var str = this.lm_.getString("login_module", "forgot_pw");
    str = str.replace("*nbsp*", "&nbsp;");
    this.forgotPasswordEl_.innerHTML = " " + str;
    goog.dom.append(this.messageEl_, this.forgotPasswordEl_);
  }
};
chatango.login.FullLogin.prototype.onForgotPassword_ = function() {
  var bd = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  var url = "http://" + bd + "/forgot";
  goog.window.open(url, {"target":"_blank"});
};
chatango.login.FullLogin.prototype.draw = function(opt_viewSize) {
  var lm = chatango.managers.LanguageManager.getInstance();
  window.loginWrapper = this.wrapperEl_;
  this.loginButton_.setContent(lm.getString("login_module", "login"));
  var orderNum = this.order_;
  var title;
  var desc;
  if (!opt_viewSize) {
    opt_viewSize = chatango.login.LoginDialog.ViewSizeTypes.FULL;
  }
  this.viewSize_ = opt_viewSize;
  switch(this.viewSize_) {
    case chatango.login.LoginDialog.ViewSizeTypes.SMALL:
      if (orderNum > 1) {
        orderNum--;
      }
      title = this.lm_.getString("login_module", "as_member_short").replace("*n*", orderNum);
      this.titleEl_.style.paddingBottom = 0;
      this.titleEl_.style.paddingTop = "0.1em";
      this.userInput_.style.marginTop = "0.2em";
      this.messageEl_.style.display = "none";
      break;
    case chatango.login.LoginDialog.ViewSizeTypes.MEDIUM:
      title = this.lm_.getString("login_module", "as_member_med").replace("*n*", orderNum);
      desc = this.lm_.getString("login_module", "login_info_med");
      break;
    case chatango.login.LoginDialog.ViewSizeTypes.FULL:
    ;
    default:
      title = this.lm_.getString("login_module", "as_member").replace("*n*", orderNum);
      desc = this.lm_.getString("login_module", "login_info");
      break;
  }
  if (orderNum != 1 || this.descKey_ || this.titleKey_) {
    title = this.lm_.getString("login_module", "or") + " " + title;
    if (this.titleKey_) {
      if (this.titleKey_ == "group_closed" && this.viewSize_ != chatango.login.LoginDialog.ViewSizeTypes.FULL) {
        this.titleKey_ = "group_closed_small";
      }
      title = this.lm_.getString("login_module", this.titleKey_);
    }
    if (this.descKey_) {
      desc = this.lm_.getString("login_module", this.descKey_);
    }
    goog.dom.setTextContent(this.titleEl_, title);
    goog.dom.setTextContent(this.messageEl_, desc);
    if (orderNum == 1 && !this.titleKey_) {
      this.titleEl_.style.display = "none";
    }
    if (orderNum == 1 && !this.descKey_) {
      this.messageEl_.style.display = "none";
    }
  } else {
    this.titleEl_.style.display = "none";
    this.messageEl_.style.display = "none";
  }
  this.pwdInput_.type = "password";
  this.userInput_.setAttribute("placeholder", this.lm_.getString("login_module", "user"));
  this.pwdInput_.setAttribute("placeholder", this.lm_.getString("login_module", "pwd"));
};
chatango.login.FullLogin.prototype.showInputError_ = function(errorText) {
  this.showForgotLink(false);
  goog.dom.setTextContent(this.messageEl_, errorText);
  goog.dom.classes.add(this.messageEl_, "form-error");
  this.messageEl_.style.display = "block";
};
goog.provide("chatango.login.AnonymousLogin");
goog.require("chatango.login.LoginRequest");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.login.AnonymousLogin = function(opt_domHelper, num) {
  goog.ui.Component.call(this, opt_domHelper);
  var lm = chatango.managers.LanguageManager.getInstance();
  this.button_ = new chatango.ui.buttons.ChatangoButton(lm.getString("login_module", "go"));
  this.addChild(this.button_);
  this.order_ = num;
  this.handler_ = this.getHandler();
};
goog.inherits(chatango.login.AnonymousLogin, goog.ui.Component);
chatango.login.AnonymousLogin.prototype.logger = goog.debug.Logger.getLogger("chatango.login.AnonymousLogin");
chatango.login.AnonymousLogin.prototype.draw = function(opt_viewSize) {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.button_.setContent(lm.getString("login_module", "go"));
  var anonStr = "";
  if (!opt_viewSize) {
    opt_viewSize = chatango.login.LoginDialog.ViewSizeTypes.FULL;
  }
  switch(opt_viewSize) {
    case chatango.login.LoginDialog.ViewSizeTypes.SMALL:
      anonStr = lm.getString("login_module", "as_anon_short");
      break;
    case chatango.login.LoginDialog.ViewSizeTypes.MEDIUM:
      anonStr = lm.getString("login_module", "as_anon_med");
      break;
    case chatango.login.LoginDialog.ViewSizeTypes.FULL:
    ;
    default:
      anonStr = lm.getString("login_module", "as_anon");
      break;
  }
  goog.dom.setTextContent(this.titleEl_, anonStr);
};
chatango.login.AnonymousLogin.prototype.createDom = function() {
  var dom = this.getDomHelper();
  var lm = chatango.managers.LanguageManager.getInstance();
  this.wrapperEl_;
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.MOBILE) {
    this.wrapperEl_ = dom.createDom("div", {"class":"login-widget  login-widget-anon mobile"});
  } else {
    this.wrapperEl_ = dom.createDom("div", {"class":"login-widget"});
  }
  var title = lm.getString("login_module", "as_anon");
  this.titleEl_ = dom.createDom("h3", null, title);
  this.buttonWrapperEl_ = dom.createDom("div", {"id":"go-anon-btn"});
  this.button_.render(this.buttonWrapperEl_);
  this.button_.setActive(true);
  dom.append(this.wrapperEl_, this.buttonWrapperEl_);
  dom.append(this.wrapperEl_, this.titleEl_);
  this.setElementInternal(this.wrapperEl_);
  this.handler_.listen(this.button_, goog.ui.Component.EventType.ACTION, this.onAction_, false, this);
};
chatango.login.AnonymousLogin.prototype.onAction_ = function(e) {
  var request = new chatango.login.LoginRequest;
  var requestEvent = new chatango.login.LoginRequestEvent(request, this);
  var events = [chatango.login.LoginResponseEvent.EventType.SUCCESS, chatango.login.LoginResponseEvent.EventType.ERROR];
  this.handler_.listen(request, events, this.onLoginResponse_);
  this.dispatchEvent(requestEvent);
};
chatango.login.AnonymousLogin.prototype.onLoginResponse_ = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("Login Request Result: " + e.type);
  }
  if (e.type == chatango.login.LoginResponseEvent.EventType.SUCCESS) {
    this.dispatchEvent(e);
  } else {
    if (e.type == chatango.login.LoginResponseEvent.EventType.ERROR) {
      this.button_.setEnabled(true);
    }
  }
};
goog.provide("chatango.login.LoginDialog");
goog.require("chatango.login.AnonymousLogin");
goog.require("chatango.login.FullLogin");
goog.require("chatango.login.LoginRequest");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.login.Session");
goog.require("chatango.login.SignupRequest");
goog.require("chatango.login.TemporaryLogin");
goog.require("chatango.group.GroupChatRestrictions");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.style");
chatango.login.LoginDialog = function(chatRestrictions, session, opt_request, opt_domHelper) {
  if (chatango.DEBUG) {
    this.logger.info("Creating LoginDialog, scale: " + chatango.managers.Style.getInstance().getScale());
  }
  this.session_ = session;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  var scale = chatango.managers.Style.getInstance().getScale() / 100;
  var unscaledWidth = 300;
  var scaledWidth = unscaledWidth * Math.max(.8, scale);
  var maxScaledWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width * .95;
  var width = Math.round(Math.min(maxScaledWidth, scaledWidth));
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  this.request_ = opt_request != null ? opt_request : null;
  chatango.ui.ScrollableDialog.call(this, width, height, true);
  this.termsCB_ = new chatango.ui.Checkbox;
  this.determineView_(chatRestrictions, opt_domHelper);
  this.handler = this.getHandler();
};
goog.inherits(chatango.login.LoginDialog, chatango.ui.ScrollableDialog);
chatango.login.LoginDialog.prototype.determineView_ = function(chatRestrictions, opt_domHelper) {
  var user = chatango.users.UserManager.getInstance().currentUser;
  var anonsOK = chatRestrictions && chatRestrictions.isOpen() && chatRestrictions.getRestriction() == chatango.group.GroupChatRestrictions.RestrictionState.ANYONE;
  var num = 1;
  if (!user && anonsOK) {
    this.anonymousLogin_ = new chatango.login.AnonymousLogin(opt_domHelper, 1);
    this.addChild(this.anonymousLogin_, false);
    num++;
  }
  if ((!user || user.getType() == chatango.users.User.UserType.ANON) && anonsOK) {
    this.temporaryLogin_ = new chatango.login.TemporaryLogin(opt_domHelper, num);
    this.addChild(this.temporaryLogin_, false);
    num++;
  }
  if (!user || user.getType() == chatango.users.User.UserType.TEMP || user.getType() == chatango.users.User.UserType.ANON) {
    var restrictionMode = chatRestrictions && chatRestrictions.getCurrentUserRestrictionMode ? chatRestrictions.getCurrentUserRestrictionMode() : chatango.group.GroupChatRestrictions.UserRestrictionMode.OPEN;
    var title, desc, showSignUp;
    switch(restrictionMode) {
      case chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST:
        title = "broadcast_mode";
        desc = "broadcast_mode_desc";
        showSignUp = false;
        break;
      case chatango.group.GroupChatRestrictions.UserRestrictionMode.CLOSED:
        title = "group_closed";
        desc = "group_closed_desc";
        showSignUp = false;
        break;
      case chatango.group.GroupChatRestrictions.UserRestrictionMode.OPEN:
      ;
      default:
        break;
    }
    this.fullLogin_ = new chatango.login.FullLogin(opt_domHelper, num, this.request_, title, desc, showSignUp);
    this.addChild(this.fullLogin_, false);
  }
};
chatango.login.LoginDialog.prototype.logger = goog.debug.Logger.getLogger("chatango.login.LoginDialog");
chatango.login.LoginDialog.prototype.createDom = function() {
  chatango.login.LoginDialog.superClass_.createDom.call(this);
  goog.style.setStyle(this.getElement(), "visibility", "hidden");
  var content = this.getContentElement();
  goog.dom.classes.add(content, "login-dialog");
  if (this.anonymousLogin_) {
    this.anonymousLogin_.render(content);
    this.handler.listen(this.anonymousLogin_, chatango.login.LoginResponseEvent.EventType.SUCCESS, function(e) {
      this.dispatchEvent(e);
    });
  }
  if (this.temporaryLogin_) {
    this.temporaryLogin_.render(content);
    this.handler.listen(this.temporaryLogin_, chatango.login.LoginResponseEvent.EventType.SUCCESS, function(e) {
      this.dispatchEvent(e);
    });
    this.handler.listen(this.temporaryLogin_, chatango.login.LoginResponseEvent.EventType.ERROR, function(e) {
      this.setButtonsEnabled(true);
    });
  }
  if (this.fullLogin_) {
    this.fullLogin_.render(content);
    this.handler.listen(this.fullLogin_, chatango.login.LoginResponseEvent.EventType.SUCCESS, function(e) {
      this.dispatchEvent(e);
    });
    this.handler.listen(this.fullLogin_, chatango.login.LoginResponseEvent.EventType.ERROR, function(e) {
      this.setButtonsEnabled(true);
    });
  }
  this.termsSectionEl_ = goog.dom.createDom("div", {"class":"login-widget", "id":"terms-cb", "style":"border-bottom:none;"});
  if (chatango.managers.Environment.getInstance().getDeviceType() == chatango.managers.Environment.DeviceType.MOBILE) {
    this.termsSectionEl_ = goog.dom.createDom("div", {"class":"login-widget mobile", "id":"terms-cb"});
  }
  goog.dom.append(content, this.termsSectionEl_);
  this.termsCB_.render(this.termsSectionEl_);
  this.termsCB_.setChecked(true);
  goog.style.setStyle(this.termsCB_.getElement(), "float", "left");
  goog.style.setStyle(this.termsCB_.getElement(), "padding-right", "0");
  this.termsCaptionEl_ = goog.dom.createDom("span", {"class":"fineprint", "style":"vertical-align:middle; font-size:88%; line-height: 80%;"});
  goog.dom.append(this.termsSectionEl_, this.termsCaptionEl_);
  this.handler.listen(this.termsCB_, goog.ui.Component.EventType.CHANGE, this.onTermsCBChanged_);
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
};
chatango.login.LoginDialog.ViewSizeTypes = {"FULL":"full", "MEDIUM":"med", "SMALL":"sm"};
chatango.login.LoginDialog.prototype.viewSize_ = chatango.login.LoginDialog.ViewSizeTypes.FULL;
chatango.login.LoginDialog.prototype.getViewSize = function() {
  return this.viewSize_;
};
chatango.login.LoginDialog.prototype.draw = function() {
  if (this.anonymousLogin_) {
    this.anonymousLogin_.draw(this.viewSize_);
  }
  if (this.temporaryLogin_) {
    if (this.viewSize_ == chatango.login.LoginDialog.ViewSizeTypes.SMALL && chatango.managers.Environment.getInstance().getDeviceType() != chatango.managers.Environment.DeviceType.MOBILE) {
      this.temporaryLogin_.getElement().style.display = "none";
    } else {
      this.temporaryLogin_.draw(this.viewSize_);
    }
  }
  if (this.fullLogin_) {
    this.fullLogin_.draw(this.viewSize_);
  }
  var termsStr = this.lm_.getString("login_module", "terms_link");
  var bd = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  termsStr = termsStr.split("*a*").join("<a href = 'http://" + bd + "/page?full_terms' target='_blank'>");
  termsStr = termsStr.split("*/a*").join("</a>");
  this.termsCaptionEl_.innerHTML = termsStr;
  var contentHeight = this.getContentElement().offsetHeight;
  var availableHeight = this.getContentElement().parentNode.offsetHeight;
  if (chatango.managers.Environment.getInstance().getDeviceType() != chatango.managers.Environment.DeviceType.DESKTOP) {
  }
  if (contentHeight > availableHeight) {
    if (chatango.managers.Environment.getInstance().getDeviceType() != chatango.managers.Environment.DeviceType.MOBILE) {
      if (this.viewSize_ == chatango.login.LoginDialog.ViewSizeTypes.FULL) {
        this.viewSize_ = chatango.login.LoginDialog.ViewSizeTypes.MEDIUM;
        this.draw();
        return;
      } else {
        if (this.viewSize_ == chatango.login.LoginDialog.ViewSizeTypes.MEDIUM) {
          this.viewSize_ = chatango.login.LoginDialog.ViewSizeTypes.SMALL;
          this.draw();
          return;
        }
      }
    }
  }
  chatango.login.LoginDialog.superClass_.draw.call(this);
  var that = this;
  setTimeout(function() {
    that.postDraw();
  }, 0);
};
chatango.login.LoginDialog.prototype.postDraw = function() {
  if (!this.getElement()) {
    return;
  }
  this.keepActiveElementOnScreen_();
  goog.style.setStyle(this.getElement(), "visibility", "visible");
};
chatango.login.LoginDialog.prototype.setButtonsEnabled = function(enable) {
  if (this.anonymousLogin_) {
    this.anonymousLogin_.button_.setEnabled(enable);
  }
  if (this.temporaryLogin_) {
    this.temporaryLogin_.button_.setEnabled(enable);
  }
  if (this.fullLogin_) {
    this.fullLogin_.loginButton_.setEnabled(enable);
    this.fullLogin_.signupButton_.setEnabled(enable);
  }
};
chatango.login.LoginDialog.prototype.onTermsCBChanged_ = function(e) {
  this.setButtonsEnabled(this.termsCB_.isChecked());
};
chatango.login.LoginDialog.prototype.initCopy = function() {
  this.draw();
  this.setHeight();
};
goog.provide("chatango.login.BackToLoginRequestEvent");
goog.require("chatango.login.SignupRequest");
goog.require("goog.events.Event");
chatango.login.BackToLoginRequestEvent = function(request, opt_target) {
  goog.events.Event.call(this, chatango.login.BackToLoginRequestEvent.EventType.BACK_TO_LOGIN_REQUEST, opt_target);
  this.request_ = request;
};
chatango.login.BackToLoginRequestEvent.EventType = {BACK_TO_LOGIN_REQUEST:"backrequest"};
chatango.login.BackToLoginRequestEvent.prototype.getRequest = function() {
  return this.request_;
};
goog.provide("chatango.login.SignupResponseEvent");
goog.require("goog.events.Event");
chatango.login.SignupResponseEvent = function(type, opt_errorCode, opt_target) {
  goog.events.Event.call(this, type, opt_target);
  this.type_ = type;
  this.errorCode_ = opt_errorCode;
};
chatango.login.SignupResponseEvent.EventType = {SUCCESS:"success", ERROR:"error"};
chatango.login.SignupResponseEvent.prototype.getType = function() {
  return this.type_;
};
chatango.login.SignupResponseEvent.prototype.getErrorCode = function() {
  return this.errorCode_;
};
goog.provide("chatango.login.SignupDialog");
goog.require("chatango.login.BackToLoginRequestEvent");
goog.require("chatango.login.LoginRequest");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.login.LoginResponseEvent");
goog.require("chatango.login.SignupRequest");
goog.require("chatango.login.SignupRequestEvent");
goog.require("chatango.login.SignupResponseEvent");
goog.require("chatango.managers.WaitingAnimation");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.display");
goog.require("chatango.utils.style");
chatango.login.SignupDialog = function(opt_request, opt_domHelper) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var scale = chatango.managers.Style.getInstance().getScale() / 100;
  var unscaledWidth = 300;
  var scaledWidth = unscaledWidth * Math.max(.8, scale);
  var maxScaledWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width * .95;
  var width = Math.round(Math.min(maxScaledWidth, scaledWidth));
  var height = Math.round(this.viewportManager_.getViewportSizeMonitor().getSize().height * .98);
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.setResizable(false);
  this.request_ = opt_request != null ? opt_request : new chatango.login.SignupRequest;
  this.signupButton_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler_ = this.getHandler();
};
goog.inherits(chatango.login.SignupDialog, chatango.ui.ScrollableDialog);
chatango.login.SignupDialog.prototype.logger = goog.debug.Logger.getLogger("chatango.login.SignupDialog");
chatango.login.SignupDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  this.showFooterContentEl(true);
  this.showFooterElBorder(false);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  this.sdlgScEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.sdlgScEl_, "sdlg-sc");
  goog.dom.classes.add(this.sdlgScEl_, "signup-dialog");
  goog.dom.append(scrollContent, this.sdlgScEl_);
  var namePasswordSection = dom.createDom("div", {"class":"sdlg-top-section"});
  goog.dom.appendChild(this.sdlgScEl_, namePasswordSection);
  this.namePasswordHeadEl_ = dom.createDom("h3", {"className":"top_item"});
  goog.dom.appendChild(namePasswordSection, this.namePasswordHeadEl_);
  this.nameErrorEl_ = goog.dom.createDom("div", {"class":"form-error fl"});
  goog.dom.append(namePasswordSection, this.nameErrorEl_);
  this.userInputWrapperEl_ = dom.createDom("div", {"class":"input-wrapper", "style":"width:100%"});
  dom.append(namePasswordSection, this.userInputWrapperEl_);
  this.userInput_ = dom.createDom("input", {"type":"text", "maxlength":"20"});
  dom.append(this.userInputWrapperEl_, this.userInput_);
  this.userInput_.value = this.request_.getName();
  this.handler_.listen(new goog.events.KeyHandler(this.userInput_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.pwdInput_.focus();
    }
  });
  this.pwdErrorEl_ = goog.dom.createDom("div", {"class":"form-error fl"});
  goog.dom.append(namePasswordSection, this.pwdErrorEl_);
  this.passwordInputWrapperEl_ = dom.createDom("div", {"class":"input-wrapper", "style":"width:100%"});
  dom.append(namePasswordSection, this.passwordInputWrapperEl_);
  this.pwdInput_ = dom.createDom("input", {"type":"password", "maxlength":"20"});
  dom.append(this.passwordInputWrapperEl_, this.pwdInput_);
  this.pwdInput_.value = this.request_.getPassword();
  this.handler_.listen(new goog.events.KeyHandler(this.pwdInput_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.pwdConfirmInput_.focus();
    }
  });
  this.passwordConfirmInputWrapperEl_ = dom.createDom("div", {"class":"input-wrapper input-wrapper", "style":"width:100%"});
  dom.append(namePasswordSection, this.passwordConfirmInputWrapperEl_);
  this.pwdConfirmInput_ = dom.createDom("input", {"type":"password", "maxlength":"20"});
  dom.append(this.passwordConfirmInputWrapperEl_, this.pwdConfirmInput_);
  var emailSection = namePasswordSection;
  this.emailErrorEl_ = goog.dom.createDom("div", {"class":"form-error fl"});
  goog.dom.append(emailSection, this.emailErrorEl_);
  this.emailInputWrapperEl_ = dom.createDom("div", {"class":"input-wrapper input-wrapper-bottom", "style":"width:100%"});
  dom.append(emailSection, this.emailInputWrapperEl_);
  this.emailInput_ = dom.createDom("input", {"type":"email", "name":"email", "id":"email"});
  dom.append(this.emailInputWrapperEl_, this.emailInput_);
  this.noSpamEl_ = goog.dom.createDom("span", {"class":"tinyfineprint fl"}, "");
  goog.dom.append(emailSection, this.noSpamEl_);
  var buttons = dom.createDom("div", {"style":"overflow:hidden;"});
  this.signupButton_.render(buttons);
  goog.dom.classes.add(this.signupButton_.getElement(), "fr");
  dom.appendChild(this.footerContentEl_, buttons);
  this.backToLogInEl_ = goog.dom.createDom("a", {"id":"back-login", "class":"fr chatango-btn-content"}, "");
  goog.dom.append(buttons, this.backToLogInEl_);
  var handler = this.getHandler();
  handler.listen(this.signupButton_, goog.ui.Component.EventType.ACTION, this.onSignUp_);
  handler.listen(this.backToLogInEl_, goog.events.EventType.CLICK, this.onBackToLogin_);
  this.updateCopy();
};
chatango.login.SignupDialog.prototype.onSignUp_ = function() {
  if (!this.checkForm_()) {
    return;
  }
  this.request_.setName(this.userInput_.value);
  this.request_.setPassword(this.pwdInput_.value);
  this.request_.setEmail(this.emailInput_.value);
  this.signupButton_.setAlert(false);
  this.signupButton_.setEnabled(false);
  this.startWaitingAnimation_();
  var events = [chatango.login.SignupResponseEvent.EventType.SUCCESS, chatango.login.SignupResponseEvent.EventType.ERROR];
  this.handler_.listen(this.request_, events, this.onSignupResponse_);
  var requestEvent = new chatango.login.SignupRequestEvent(this.request_, this);
  this.dispatchEvent(requestEvent, chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST);
};
chatango.login.SignupDialog.prototype.onBackToLogin_ = function(e) {
  var request = new chatango.login.SignupRequest(this.userInput_.value, this.pwdInput_.value);
  var requestEvent = new chatango.login.BackToLoginRequestEvent(request, this);
  this.dispatchEvent(requestEvent);
};
chatango.login.SignupDialog.prototype.onSignupResponse_ = function(e) {
  this.stopWaitingAnimation_();
  switch(e.type) {
    case chatango.login.SignupResponseEvent.EventType.ERROR:
      var error_msg = e.getErrorCode();
      if (error_msg && error_msg.match(/email/i)) {
        goog.dom.setTextContent(this.emailErrorEl_, error_msg);
        this.emailErrorEl_.style.display = "block";
      } else {
        if (!error_msg) {
          error_msg = this.lm_.getString("login_module", "connection_error");
        }
        goog.dom.setTextContent(this.nameErrorEl_, error_msg);
        this.nameErrorEl_.style.display = "block";
      }
      this.dispatchEvent(chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE);
      this.signupButton_.setEnabled(true);
      break;
    case chatango.login.SignupResponseEvent.EventType.SUCCESS:
      var signup_request = e.currentTarget;
      var login_request = new chatango.login.LoginRequest(signup_request.getName(), signup_request.getPassword());
      var requestEvent = new chatango.login.LoginRequestEvent(login_request, this);
      var events = [chatango.login.LoginResponseEvent.EventType.SUCCESS, chatango.login.LoginResponseEvent.EventType.ERROR];
      this.handler_.listen(login_request, events, this.onLoginResponse_);
      this.dispatchEvent(requestEvent, chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST);
      break;
  }
};
chatango.login.SignupDialog.prototype.onLoginResponse_ = function(e) {
  this.stopWaitingAnimation_();
  switch(e.type) {
    case chatango.login.LoginResponseEvent.EventType.ERROR:
      var failedMsg;
      if (e.getErrorCode() == "2") {
        failedMsg = this.lm_.getString("login_module", "su_login_error");
      } else {
        failedMsg = this.lm_.getString("login_module", "su_login_banned");
      }
      goog.dom.setTextContent(this.nameErrorEl_, failedMsg);
      this.nameErrorEl_.style.display = "block";
      this.dispatchEvent(e);
      this.dispatchEvent(chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE);
      this.signupButton_.setEnabled(true);
      break;
    case chatango.login.LoginResponseEvent.EventType.SUCCESS:
      this.dispatchEvent(e);
      break;
  }
};
chatango.login.SignupDialog.prototype.checkForm_ = function() {
  var error = false;
  this.nameErrorEl_.style.display = "none";
  this.pwdErrorEl_.style.display = "none";
  this.emailErrorEl_.style.display = "none";
  if (this.userInput_.value == "") {
    error = true;
    goog.dom.setTextContent(this.nameErrorEl_, this.lm_.getString("login_module", "enter_user"));
    this.nameErrorEl_.style.display = "block";
    return!error;
  }
  this.userInput_.value = this.userInput_.value.replace(/\s+$/g, "");
  if (!this.userInput_.value.match(/^[A-Za-z0-9]+$/)) {
    error = true;
    goog.dom.setTextContent(this.nameErrorEl_, this.lm_.getString("login_module", "invalid_user"));
    this.nameErrorEl_.style.display = "block";
  } else {
    if (this.pwdInput_.value == "") {
      error = true;
      goog.dom.setTextContent(this.pwdErrorEl_, this.lm_.getString("login_module", "enter_pwd"));
      this.pwdErrorEl_.style.display = "block";
    } else {
      if (this.pwdConfirmInput_.value == "") {
        error = true;
        goog.dom.setTextContent(this.pwdErrorEl_, this.lm_.getString("login_module", "confirm_pwd_err"));
        this.pwdErrorEl_.style.display = "block";
      } else {
        if (this.pwdConfirmInput_.value != this.pwdInput_.value) {
          error = true;
          goog.dom.setTextContent(this.pwdErrorEl_, this.lm_.getString("login_module", "pwd_diff"));
          this.pwdErrorEl_.style.display = "block";
        } else {
          if (this.emailInput_.value == "") {
            error = true;
            goog.dom.setTextContent(this.emailErrorEl_, this.lm_.getString("login_module", "no_email"));
            this.emailErrorEl_.style.display = "block";
          } else {
            if (!this.emailInput_.value.match(/^.+@.+\..+$/)) {
              error = true;
              goog.dom.setTextContent(this.emailErrorEl_, this.lm_.getString("login_module", "invalid_email"));
              this.emailErrorEl_.style.display = "block";
            }
          }
        }
      }
    }
  }
  return!error;
};
chatango.login.SignupDialog.prototype.enterDocument = function() {
  chatango.login.SignupDialog.superClass_.enterDocument.call(this);
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
};
chatango.login.SignupDialog.prototype.updateCopy = function() {
  var pack = "login_module";
  this.setTitle(this.lm_.getString(pack, "signup"));
  goog.dom.setTextContent(this.namePasswordHeadEl_, this.lm_.getString(pack, "choose_name_pwd") + ":");
  this.userInput_.placeholder = this.lm_.getString(pack, "user");
  this.pwdInput_.placeholder = this.lm_.getString(pack, "pwd");
  this.pwdConfirmInput_.placeholder = this.lm_.getString(pack, "confirm_pwd");
  this.signupButton_.setContent(this.lm_.getString(pack, "signup"));
  goog.dom.setTextContent(this.noSpamEl_, this.lm_.getString(pack, "no_spam"));
  this.emailInput_.placeholder = this.lm_.getString(pack, "your_email");
  goog.dom.setTextContent(this.backToLogInEl_, this.lm_.getString(pack, "back_to_login"));
};
chatango.login.SignupDialog.prototype.draw = function() {
  chatango.utils.style.stretchToFill(this.userInput_);
  chatango.utils.style.stretchToFill(this.pwdInput_);
  chatango.utils.style.stretchToFill(this.pwdConfirmInput_);
  chatango.utils.style.stretchToFill(this.emailInput_);
  chatango.login.SignupDialog.superClass_.draw.call(this);
};
chatango.login.SignupDialog.prototype.startWaitingAnimation_ = function() {
  chatango.managers.WaitingAnimation.getInstance().startWaiting("signup_dialog");
};
chatango.login.SignupDialog.prototype.stopWaitingAnimation_ = function() {
  chatango.managers.WaitingAnimation.getInstance().stopWaiting("signup_dialog");
};
chatango.login.SignupDialog.prototype.dispose = function() {
  this.stopWaitingAnimation_();
  var handler = this.getHandler();
  handler.unlisten(this.signupButton_, goog.ui.Component.EventType.ACTION, this.onSignUp_);
  handler.unlisten(this.backToLogInEl_, goog.events.EventType.CLICK, this.onBackToLogin_);
  chatango.login.SignupDialog.superClass_.dispose.call(this);
};
goog.provide("chatango.strings.LoginStrings");
chatango.strings.LoginStrings = {"dialog_title":"Log in", "as_anon":"1. Anonymously (no name)", "as_anon_med":"1. Anon (no name)", "as_anon_short":"1. Anon", "as_temp_name":"*n*. With a temporary name:", "as_temp_name_med":"*n*. Temporary name:", "or":"Or", "as_member":"*n*. As a Chatango member:", "as_member_med":"*n*. As a Chatango user:", "as_member_short":"*n*. User:", "login_info":"Allows others to private message you and see your profile picture", "login_info_med":"Allows others to pm you and see your picture", 
"login_error":"The user name and password do not match. Please check your log in info.", "login_error_short":"The user name and password do not match.", "username_banned":"User name contains a word banned in this group.", "name_banned":"Banned name.", "already_exists":"Already exists.", "spoof_anons":"Reserved for Anons.", "go":"Go", "signup":"Sign up", "temp":"Temporary name", "user":"User name", "pwd":"Password", "login":"Log in", "enter_user":"Please enter a username", "enter_pwd":"Please enter a password", 
"enter_temp":"Please enter a temporary name", "confirm_pwd":"Confirm password", "choose_name_pwd":"Choose a name and password", "enter_email":"Enter your REAL email address", "no_spam":"* Email is used for account recovery. We do not spam.", "your_email":"Your REAL email*", "invalid_user":"Invalid user name. You must use only letters and numbers.", "confirm_pwd_err":"Please confirm your password", "pwd_diff":"Your passwords didn't match", "no_email":"Please enter your email", "invalid_email":"Please check your email address", 
"connection_error":"There was a connection error, please resubmit.", "su_login_error":"Sign up was successful, but there was an error logging in.", "su_login_banned":"Sign up was successful, but this user name contains a word banned in this group.", "terms_link":"By messaging here I agree to Chatango's *a*Terms of Use*/a*", "back_to_login":"Back to log in", "forgot_pw":"Forgot*nbsp*password?", "login_to_use":"Log in to use this feature", "broadcast_mode":"Broadcast mode", "broadcast_mode_desc":"Only the owner and designated moderators may post messages.", 
"group_closed":"Group closed", "group_closed_desc":"Log in as the owner or a moderator to re-open the group."};
goog.provide("chatango.modules.LoginModule");
goog.require("chatango.login.BackToLoginRequestEvent");
goog.require("chatango.login.LoginDialog");
goog.require("chatango.login.LoginRequest");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.login.Session");
goog.require("chatango.login.SignupDialog");
goog.require("chatango.login.SignupRequest");
goog.require("chatango.login.SignupRequestEvent");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.strings.CommonUIStrings");
goog.require("chatango.strings.LoginStrings");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.utils.display");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
goog.require("goog.style");
goog.require("goog.ui.Dialog");
chatango.modules.LoginModule = function(session) {
  goog.events.EventTarget.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("login_module", chatango.strings.LoginStrings, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.session_ = session;
};
goog.inherits(chatango.modules.LoginModule, goog.events.EventTarget);
chatango.modules.LoginModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.LoginModule");
chatango.modules.LoginModule.prototype.openLoginPopup = function(chatRestrictions, opt_request, opt_useLoginToUseFeatureTitle) {
  this.handler = new goog.events.EventHandler(this);
  this.closeLoginPopup();
  this.closeSignupPopup();
  var lm = chatango.managers.LanguageManager.getInstance();
  this.loginDialog_ = new chatango.login.LoginDialog(chatRestrictions, this.session_, opt_request);
  this.titleKey_ = opt_useLoginToUseFeatureTitle ? "login_to_use" : "dialog_title";
  this.loginDialog_.setTitle(lm.getString("login_module", this.titleKey_));
  this.loginDialog_.setVisible(true);
  this.loginDialog_.setHasTitleCloseButton(true);
  this.loginDialog_.getElement().style.position = "absolute";
  this.loginDialog_.setResizable(false);
  this.xclicked = true;
  this.handler.listen(this.loginDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onLoginPopUpClosed);
  this.handler.listen(this.loginDialog_, chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.onLoginRequest_);
  this.handler.listen(this.loginDialog_, chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.onSignupDialogRequest_);
  this.handler.listen(this.loginDialog_, chatango.login.LoginResponseEvent.EventType.SUCCESS, function(e) {
    this.dispatchEvent(e);
    this.xclicked = false;
    this.closeLoginPopup();
  });
  this.handler.listen(this.loginDialog_, chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE, this.onHeightChange_);
};
chatango.modules.LoginModule.prototype.openSignupPopup = function(opt_request) {
  this.handler = new goog.events.EventHandler(this);
  this.closeSignupPopup();
  var lm = chatango.managers.LanguageManager.getInstance();
  this.signupDialog_ = new chatango.login.SignupDialog(opt_request);
  this.signupDialog_.setVisible(true);
  this.signupDialog_.setHasTitleCloseButton(true);
  this.signupDialog_.getElement().style.position = "absolute";
  this.signupDialog_.setResizable(false);
  this.handler.listen(this.signupDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onSignupPopUpClosed);
  this.handler.listen(this.signupDialog_, chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.onSignupRequest_);
  this.handler.listen(this.signupDialog_, chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.onLoginRequest_);
  this.handler.listen(this.signupDialog_, chatango.login.LoginResponseEvent.EventType.SUCCESS, function(e) {
    this.dispatchEvent(e);
    this.xclicked = false;
    this.closeSignupPopup();
  });
  this.handler.listen(this.signupDialog_, chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE, this.onHeightChange_);
  this.handler.listen(this.signupDialog_, chatango.login.BackToLoginRequestEvent.EventType.BACK_TO_LOGIN_REQUEST, this.onBackToLoginRequest_);
};
chatango.modules.LoginModule.prototype.closePopUps = function() {
  this.closeLoginPopup();
  this.closeSignupPopup();
};
chatango.modules.LoginModule.prototype.closeLoginPopup = function() {
  if (this.loginDialog_) {
    this.handler.removeAll();
    goog.dispose(this.loginDialog_);
    this.loginDialog_ = null;
  }
};
chatango.modules.LoginModule.prototype.closeSignupPopup = function() {
  if (this.signupDialog_) {
    this.handler.removeAll();
    goog.dispose(this.signupDialog_);
    this.signupDialog_ = null;
  }
};
chatango.modules.LoginModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var new_h = Math.round(stage_h * .95);
  if (this.loginDialog_) {
    this.loginDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.loginDialog_.getElement(), opt_stageRect, true);
  }
  if (this.signupDialog_) {
    this.signupDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.signupDialog_.getElement(), opt_stageRect, true);
    this.signupDialog_.keepActiveFormElementOnScreen();
  }
  this.ignoreNextHeightChange_ = true;
};
chatango.modules.LoginModule.prototype.onLoginPopUpClosed = function() {
  if (this.xclicked) {
    this.dispatchEvent(chatango.events.EventType.SET_NAME_CLOSED);
  }
  this.handler.removeAll();
  this.loginDialog_ = null;
};
chatango.modules.LoginModule.prototype.onSignupPopUpClosed = function() {
  if (this.xclicked) {
    this.dispatchEvent(chatango.events.EventType.SET_NAME_CLOSED);
  }
  this.handler.removeAll();
  this.signupDialog_ = null;
};
chatango.modules.LoginModule.prototype.onLoginRequest_ = function(e) {
  if (this.loginDialog_) {
    this.loginDialog_.setButtonsEnabled(false);
  }
  var request = e.getRequest();
  this.dispatchEvent(e);
};
chatango.modules.LoginModule.prototype.onSignupDialogRequest_ = function(e) {
  this.loginDialog_.setButtonsEnabled(false);
  var request = e.getRequest();
  this.closeLoginPopup();
  this.openSignupPopup(request);
};
chatango.modules.LoginModule.prototype.onBackToLoginRequest_ = function(e) {
  var request = e.getRequest();
  this.openLoginPopup(false, request);
};
chatango.modules.LoginModule.prototype.onSignupRequest_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.LoginModule.prototype.onHeightChange_ = function(e) {
  if (this.ignoreNextHeightChange_) {
    this.ignoreNextHeightChange_ = false;
    return;
  }
  var el;
  if (this.loginDialog_) {
    el = this.loginDialog_.getElement();
  } else {
    if (this.signupDialog_) {
      el = this.signupDialog_.getElement();
    } else {
      return;
    }
  }
  var height = el.offsetHeight;
  var vpm = chatango.managers.ViewportManager.getInstance();
  var vpHeight = vpm.getViewportSizeMonitor().getSize().height;
  var yPos = Math.max(0, Math.round((vpHeight - height) / 2));
  goog.style.setPosition(el, el.offsetLeft, yPos);
};
chatango.modules.LoginModule.prototype.initCopy = function() {
  if (this.lm_.isPackLoaded("ui") && this.lm_.isPackLoaded("login_module")) {
    if (this.loginDialog_) {
      var lm = chatango.managers.LanguageManager.getInstance();
      this.loginDialog_.setTitle(lm.getString("login_module", this.titleKey_));
      this.loginDialog_.initCopy();
    }
    if (this.signupDialog_) {
      this.signupDialog_.updateCopy();
    }
  }
};
goog.module.ModuleManager.getInstance().setLoaded("LoginModule");

