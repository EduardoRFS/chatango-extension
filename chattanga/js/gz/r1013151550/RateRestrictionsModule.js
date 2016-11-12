goog.provide("chatango.group.raterestrictions.BaseWarningDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
chatango.group.raterestrictions.BaseWarningDialog = function(warning, input) {
  this.warning_ = warning;
  this.input_ = input;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.handler = this.getHandler();
};
goog.inherits(chatango.group.raterestrictions.BaseWarningDialog, chatango.ui.ScrollableDialog);
chatango.group.raterestrictions.BaseWarningDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.warningTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.warningTextEl);
  this.okBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.okBtn_, goog.ui.Component.EventType.ACTION, this.onOKButtonClicked);
  this.okBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.okBtn_.render(this.okBtnWrapperEl_);
  dom.appendChild(content, this.okBtnWrapperEl_);
};
chatango.group.raterestrictions.BaseWarningDialog.prototype.enterDocument = function() {
  chatango.group.raterestrictions.BaseWarningDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.raterestrictions.BaseWarningDialog.prototype.onOKButtonClicked = function() {
  this.setVisible(false);
};
chatango.group.raterestrictions.BaseWarningDialog.prototype.updateCopy = function() {
};
goog.provide("chatango.group.raterestrictions.FloodWarningDialog");
goog.require("chatango.group.raterestrictions.BaseWarningDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
chatango.group.raterestrictions.FloodWarningDialog = function(warning, input) {
  chatango.group.raterestrictions.BaseWarningDialog.call(this, warning, input);
};
goog.inherits(chatango.group.raterestrictions.FloodWarningDialog, chatango.group.raterestrictions.BaseWarningDialog);
chatango.group.raterestrictions.FloodWarningDialog.prototype.focus = function() {
  if (this.warning_[0] == "show_fw") {
    goog.base(this, "focus");
  } else {
    this.input_.focus();
  }
};
chatango.group.raterestrictions.FloodWarningDialog.prototype.createDom = function() {
  chatango.group.raterestrictions.FloodWarningDialog.superClass_.createDom.call(this);
  this.updateCopy();
};
chatango.group.raterestrictions.FloodWarningDialog.prototype.updateCopy = function() {
  var rrm = "rate_restrictions_module";
  var title_str = "";
  var body_str = "";
  var time_str;
  var mins_str = this.lm_.getString(rrm, "minutes");
  switch(this.warning_[0]) {
    case "show_fw":
      title_str = this.lm_.getString(rrm, "slow_down");
      body_str = this.lm_.getString(rrm, "please_wait");
      break;
    case "end_fw":
      title_str = this.lm_.getString(rrm, "warning_ended");
      body_str = this.lm_.getString(rrm, "warning_over");
      break;
    case "show_tb":
    ;
    case "tb":
      if (this.warning_[0] == "show_tb") {
        title_str = this.lm_.getString(rrm, "been_restricted");
        body_str = this.lm_.getString(rrm, "restricted_for") + " " + this.lm_.getString(rrm, "flood_restricted_for");
      } else {
        title_str = this.lm_.getString(rrm, "still_restricted");
        body_str = this.lm_.getString(rrm, "still_restricted_for") + " " + this.lm_.getString(rrm, "flood_restricted_for");
      }
      time_str = String(Math.ceil(Number(this.warning_[1]) / 60));
      if (time_str == "1") {
        mins_str = this.lm_.getString(rrm, "minute");
      }
      body_str = body_str.split("*time*").join(time_str);
      body_str = body_str.split("*minute*").join(mins_str);
      break;
  }
  this.setTitle(title_str);
  this.warningTextEl.innerHTML = body_str;
  this.okBtn_.setContent(this.lm_.getString("ui", "ok"));
};
goog.provide("chatango.group.raterestrictions.EmailVerifRequiredDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.utils.style");
goog.require("chatango.ui.buttons.ChatangoButton");
chatango.group.raterestrictions.EmailVerifRequiredDialog = function(input, callback) {
  this.input_ = input;
  this.callback_ = callback || null;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.handler = this.getHandler();
};
goog.inherits(chatango.group.raterestrictions.EmailVerifRequiredDialog, chatango.ui.ScrollableDialog);
chatango.group.raterestrictions.EmailVerifRequiredDialog.EventType = {VERIFY_EMAIL:"vrfy"};
chatango.group.raterestrictions.EmailVerifRequiredDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.warningTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.warningTextEl);
  this.okBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.okBtn_, goog.ui.Component.EventType.ACTION, this.onOKButtonClicked);
  this.okBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.okBtn_.render(this.okBtnWrapperEl_);
  dom.appendChild(content, this.okBtnWrapperEl_);
  this.verifyBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.verifyBtn_, goog.ui.Component.EventType.ACTION, this.onVerifyButtonClicked);
  this.verifyBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.verifyBtn_.render(this.verifyBtnWrapperEl_);
  dom.appendChild(content, this.verifyBtnWrapperEl_);
  this.updateCopy();
};
chatango.group.raterestrictions.EmailVerifRequiredDialog.prototype.enterDocument = function() {
  chatango.group.raterestrictions.EmailVerifRequiredDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.raterestrictions.EmailVerifRequiredDialog.prototype.focus = function() {
  if (this.isInitialWarning_) {
    goog.base(this, "focus");
  } else {
    this.input_.focus();
  }
};
chatango.group.raterestrictions.EmailVerifRequiredDialog.prototype.onOKButtonClicked = function() {
  this.setVisible(false);
  this.input_.focus();
};
chatango.group.raterestrictions.EmailVerifRequiredDialog.prototype.onVerifyButtonClicked = function() {
  this.dispatchEvent(chatango.group.raterestrictions.EmailVerifRequiredDialog.EventType.VERIFY_EMAIL);
  this.setVisible(false);
};
chatango.group.raterestrictions.EmailVerifRequiredDialog.prototype.dispose = function() {
  if (this.callback_) {
    this.callback_(true);
  }
  this.callback_ = null;
  chatango.group.raterestrictions.EmailVerifRequiredDialog.superClass_.dispose.call(this);
};
chatango.group.raterestrictions.EmailVerifRequiredDialog.prototype.updateCopy = function() {
  var rrm = "rate_restrictions_module";
  var warning = this.lm_.getString(rrm, "ve_warning");
  this.setTitle(this.lm_.getString(rrm, "ve_title"));
  this.warningTextEl.innerHTML = warning;
  this.okBtn_.setContent(this.lm_.getString(rrm, "ve_ok_btn"));
  this.warningTextEl.innerHTML = warning;
  this.verifyBtn_.setContent(this.lm_.getString(rrm, "ve_vrfy_btn"));
};
goog.provide("chatango.group.raterestrictions.GenericWarningDialog");
goog.require("chatango.group.raterestrictions.BaseWarningDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
chatango.group.raterestrictions.GenericWarningDialog = function(warning, input) {
  chatango.group.raterestrictions.BaseWarningDialog.call(this, warning, input);
};
goog.inherits(chatango.group.raterestrictions.GenericWarningDialog, chatango.group.raterestrictions.BaseWarningDialog);
chatango.group.raterestrictions.GenericWarningDialog.WarningType = {MSG_TO_LONG:chatango.networking.GroupConnectionEvent.EventType.msglexceeded};
chatango.group.raterestrictions.GenericWarningDialog.prototype.createDom = function() {
  chatango.group.raterestrictions.GenericWarningDialog.superClass_.createDom.call(this);
  this.finePrintEl_ = goog.dom.createDom("div", {"style":"padding:.8em 0;"});
  goog.dom.insertSiblingAfter(this.finePrintEl_, this.warningTextEl);
  goog.dom.classes.add(this.finePrintEl_, "sdlg-content");
  goog.dom.classes.add(this.finePrintEl_, "fineprint");
  this.updateCopy();
};
chatango.group.raterestrictions.GenericWarningDialog.prototype.focus = function() {
  this.input_.focus();
};
chatango.group.raterestrictions.GenericWarningDialog.prototype.updateCopy = function() {
  var rrm = "rate_restrictions_module";
  var title_str = "";
  var body_str = "";
  var time_str;
  var fineprintStr = "";
  var serverCommand = this.warning_[0];
  switch(serverCommand) {
    case "msglexceeded":
      title_str = this.lm_.getString(rrm, "msg_too_long_title");
      body_str = this.lm_.getString(rrm, "msg_too_long_body").split("*bytes*").join(this.warning_[1]);
      break;
    case "msglexceeded_default":
      title_str = this.lm_.getString(rrm, "msg_too_long_title");
      body_str = this.lm_.getString(rrm, "msg_too_long_default_body").split("*bytes*").join(this.warning_[1]);
      break;
    case "limitexceeded":
      title_str = this.lm_.getString(rrm, "too_many_connections");
      body_str = this.lm_.getString(rrm, "too_many_connections_from_ip").split("*bytes*").join(this.warning_[1]);
      break;
  }
  this.setTitle(title_str);
  this.warningTextEl.innerHTML = body_str;
  this.finePrintEl_.innerHTML = fineprintStr;
  this.okBtn_.setContent(this.lm_.getString("ui", "ok"));
};
goog.provide("chatango.group.raterestrictions.NlpWarningDialog");
goog.require("chatango.group.raterestrictions.BaseWarningDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
chatango.group.raterestrictions.NlpWarningDialog = function(warning, input) {
  chatango.group.raterestrictions.BaseWarningDialog.call(this, warning, input);
};
goog.inherits(chatango.group.raterestrictions.NlpWarningDialog, chatango.group.raterestrictions.BaseWarningDialog);
chatango.group.raterestrictions.NlpWarningDialog.NLP_TYPE = {LONGEST_REPEATING_SINGLE_MSG:1, LONGEST_REPEATING_MSG_IN_QUEUE:2, CHAR_VARIETY:4, MESSAGES_TOO_SHORT:8, NGRAM_GIBBERISH:16};
chatango.group.raterestrictions.NlpWarningDialog.prototype.createDom = function() {
  chatango.group.raterestrictions.NlpWarningDialog.superClass_.createDom.call(this);
  this.finePrintEl_ = goog.dom.createDom("div", {"style":"padding:.8em 0;"});
  goog.dom.insertSiblingAfter(this.finePrintEl_, this.warningTextEl);
  goog.dom.classes.add(this.finePrintEl_, "sdlg-content");
  goog.dom.classes.add(this.finePrintEl_, "fineprint");
  this.updateCopy();
};
chatango.group.raterestrictions.NlpWarningDialog.prototype.focus = function() {
  if (this.warning_[0] == "show_nlp") {
    goog.base(this, "focus");
  } else {
    this.input_.focus();
  }
};
chatango.group.raterestrictions.NlpWarningDialog.prototype.updateCopy = function() {
  var rrm = "rate_restrictions_module";
  var title_str = "";
  var body_str = "";
  var time_str;
  var fineprintStr = "";
  var mins_str = this.lm_.getString(rrm, "minutes");
  var serverCommand = this.warning_[0];
  var NLPTypeFlag = this.warning_[1];
  switch(serverCommand) {
    case "show_nlp":
      if (chatango.group.raterestrictions.NlpWarningDialog.NLP_TYPE.LONGEST_REPEATING_MSG_IN_QUEUE & NLPTypeFlag) {
        title_str = this.lm_.getString(rrm, "spam_warning_title");
        body_str = this.lm_.getString(rrm, "spam_warning");
      } else {
        if (chatango.group.raterestrictions.NlpWarningDialog.NLP_TYPE.MESSAGES_TOO_SHORT & NLPTypeFlag) {
          title_str = this.lm_.getString(rrm, "short_warning_title");
          body_str = this.lm_.getString(rrm, "short_warning");
        } else {
          title_str = this.lm_.getString(rrm, "nonsense_warning_title");
          body_str = this.lm_.getString(rrm, "nonsense_warning");
        }
      }
      fineprintStr = this.lm_.getString(rrm, "auto_mod_enabled");
      break;
    case "end_nlp":
      title_str = this.lm_.getString(rrm, "warning_ended");
      body_str = this.lm_.getString(rrm, "warning_over");
      break;
    case "show_nlp_tb":
    ;
    case "nlptb":
      if (serverCommand == "show_nlp_tb") {
        title_str = this.lm_.getString(rrm, "been_restricted");
        body_str = this.lm_.getString(rrm, "restricted_for");
        if (chatango.group.raterestrictions.NlpWarningDialog.NLP_TYPE.LONGEST_REPEATING_MSG_IN_QUEUE & NLPTypeFlag) {
          body_str += " " + this.lm_.getString(rrm, "spam_restricted_for");
        } else {
          if (chatango.group.raterestrictions.NlpWarningDialog.NLP_TYPE.MESSAGES_TOO_SHORT & NLPTypeFlag) {
            body_str += " " + this.lm_.getString(rrm, "short_restricted_for");
          } else {
            body_str += " " + this.lm_.getString(rrm, "nonsense_restricted_for");
          }
        }
      } else {
        title_str = this.lm_.getString(rrm, "still_restricted");
        body_str = this.lm_.getString(rrm, "still_restricted_for") + " " + this.lm_.getString(rrm, "spam_restricted_for");
      }
      var timeIndex = serverCommand == "show_nlp_tb" ? 2 : 1;
      time_str = String(Math.ceil(Number(this.warning_[timeIndex]) / 60));
      if (time_str == "1") {
        mins_str = this.lm_.getString(rrm, "minute");
      }
      body_str = body_str.split("*time*").join(time_str);
      body_str = body_str.split("*minute*").join(mins_str);
      break;
  }
  this.setTitle(title_str);
  this.warningTextEl.innerHTML = body_str;
  this.finePrintEl_.innerHTML = fineprintStr;
  this.okBtn_.setContent(this.lm_.getString("ui", "ok"));
};
goog.provide("chatango.group.raterestrictions.ModeSwitchDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.utils.style");
goog.require("chatango.ui.buttons.ChatangoButton");
chatango.group.raterestrictions.ModeSwitchDialog = function() {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.handler = this.getHandler();
};
goog.inherits(chatango.group.raterestrictions.ModeSwitchDialog, chatango.ui.ScrollableDialog);
chatango.group.raterestrictions.ModeSwitchDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.warningTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.warningTextEl);
  this.okBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.okBtn_, goog.ui.Component.EventType.ACTION, this.onOKButtonClicked);
  this.okBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.okBtn_.render(this.okBtnWrapperEl_);
  dom.appendChild(content, this.okBtnWrapperEl_);
  this.updateCopy();
};
chatango.group.raterestrictions.ModeSwitchDialog.prototype.onOKButtonClicked = function() {
  this.setVisible(false);
};
chatango.group.raterestrictions.ModeSwitchDialog.prototype.updateCopy = function() {
  var rrm = "rate_restrictions_module";
  this.warningTextEl.innerHTML = this.lm_.getString(rrm, "mode_change");
  this.okBtn_.setContent(this.lm_.getString("ui", "ok"));
};
goog.provide("chatango.group.raterestrictions.RateLimitedPBController");
goog.require("chatango.group.GroupInput");
goog.require("chatango.modules.CommonUIModule");
chatango.group.raterestrictions.RateLimitedPBController = function(groupInput, initialProgress, show) {
  this.groupInput_ = groupInput;
  this.wrapperEl_ = groupInput.getProgressBarWrapperEl();
  this.verticalWrapperEl_ = groupInput.getVerticalProgressBarWrapperEl();
  this.seconds_ = 0;
  this.currentProgressBar_ = null;
  this.progressBar_ = new chatango.ui.ProgressBar(chatango.ui.ProgressBar.direction.HORIZONTAL);
  this.progressBar_.render(this.wrapperEl_);
  var progress = initialProgress || 0;
  this.progressBar_.update(progress);
  this.vertProgressBar_ = new chatango.ui.ProgressBar(chatango.ui.ProgressBar.direction.VERTICAL);
  this.vertProgressBar_.render(this.verticalWrapperEl_);
  this.vertProgressBar_.update(progress);
  this.isHidden_ = false;
  var sm = chatango.managers.Style.getInstance();
  var bgcolor = goog.color.parse(sm.getBackgroundColor());
  var fgcolor = goog.color.parse(sm.getUserDefinedIconColor());
  var defaultBg = goog.color.parse(chatango.group.DefaultStyles.a);
  var defaultIcon = goog.color.parse(chatango.group.DefaultStyles.c);
  if (bgcolor.hex == defaultBg.hex && fgcolor.hex == defaultIcon.hex) {
    fgcolor = goog.color.parse("#fc0");
  }
  var white = goog.color.parse("#ffffff");
  var iwc = goog.color.parse(sm.getInputWindowBgColor());
  if (white.hex == iwc.hex && white.hex == fgcolor.hex) {
    fgcolor = goog.color.parse("#ccc");
  }
  if (sm.getUDBorderColor() == sm.getBackgroundColor() && sm.getBackgroundOpacity() > 75) {
    this.wrapperEl_.style.padding = "0 1px 0 1px";
    var input = this.groupInput_.getInput();
    input.style.borderTop = "0px";
    input.style.borderRight = "0px";
    input.style.borderBottom = "0px";
    this.groupInput_.setWidthOffset(1);
  }
  var barHeight = "0.4em";
  var bg = this.progressBar_.getContentElement();
  bg.style.height = barHeight;
  goog.style.setStyle(bg, "background-color", bgcolor.hex);
  var fg = this.progressBar_.getElementByClass("pb_fg");
  fg.style.height = barHeight;
  goog.style.setStyle(fg, "background-color", fgcolor.hex);
  bg = this.vertProgressBar_.getContentElement();
  goog.style.setStyle(bg, "background-color", fgcolor.hex);
  fg = this.vertProgressBar_.getElementByClass("pb_fg");
  goog.style.setStyle(fg, "background-color", bgcolor.hex);
  this.isRunning_ = false;
  this.tickRate_ = 40;
  this.timer_ = new goog.Timer(this.tickRate_);
  var that = this;
  goog.events.listen(this.timer_, goog.Timer.TICK, function() {
    that.onTick_();
  });
  this.vsm_ = new goog.dom.ViewportSizeMonitor;
  var width = this.vsm_.getSize().width;
  var scaledWidth = chatango.managers.ScaleManager.getInstance().getScale() / 100 * width;
  this.vertical_ = width > 500;
  if (this.vertical_) {
    this.currentProgressBar_ = this.vertProgressBar_;
  } else {
    this.currentProgressBar_ = this.progressBar_;
  }
  this.hide();
  if (show) {
    this.show();
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.setSeconds = function(seconds) {
  var prevSeconds = this.seconds_;
  this.seconds_ = seconds || this.seconds_;
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.getMaxSeconds = function() {
  return this.seconds_;
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.currentMilliseconds = function() {
  return(new Date).getTime();
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.start = function(offsetInSeconds) {
  this.stop();
  if (this.timer_) {
    if (this.vertical_) {
      this.showVertical_();
    }
    this.currentTime_ = this.currentMilliseconds();
    var secondsLeft = offsetInSeconds < this.seconds_ ? this.seconds_ - offsetInSeconds : this.seconds_;
    this.endTime_ = secondsLeft * 1E3 + this.currentTime_;
    this.update_();
    this.timer_.start();
    this.isRunning_ = true;
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.onTick_ = function() {
  this.currentTime_ = this.currentMilliseconds();
  this.update_();
  if (this.currentTime_ >= this.endTime_) {
    this.stop();
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.update_ = function() {
  var secondsLeft = Math.max(0, this.endTime_ - this.currentTime_) / 1E3;
  var p = (this.seconds_ - secondsLeft) / this.seconds_;
  if (this.vertical_) {
    this.currentProgressBar_.update(Math.min(p, 1));
  } else {
    this.currentProgressBar_.update(Math.max(1 - p, 0));
  }
  if (this.currentTime_ >= this.endTime_) {
    this.stop();
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.update = function(secondsLeft) {
  if (this.isRunning_) {
    this.currentTime_ = this.currentMilliseconds();
    this.endTime_ = this.currentTime_ + secondsLeft * 1E3;
    this.update_();
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.setDirection = function(showVertical) {
  if (this.isHidden_) {
    return;
  }
  if (this.vertical_ == showVertical) {
    return;
  }
  this.vertical_ = showVertical;
  this.hide();
  if (showVertical) {
    this.currentProgressBar_ = this.vertProgressBar_;
  } else {
    this.currentProgressBar_ = this.progressBar_;
    if (this.groupInput_) {
      this.groupInput_.draw();
    }
  }
  this.show();
  this.update_();
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.stop = function() {
  if (this.isRunning_) {
    this.isRunning_ = false;
    if (this.timer_) {
      this.timer_.stop();
    }
    if (this.vertical_) {
      this.hideVertical_();
    }
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.isRunning = function() {
  return this.isRunning_;
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.hide = function() {
  if (this.wrapperEl_) {
    this.wrapperEl_.style.display = "none";
  }
  if (this.verticalWrapperEl_) {
    this.verticalWrapperEl_.style.display = "none";
  }
  this.isHidden_ = true;
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.isHidden = function() {
  return this.isHidden_;
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.show = function() {
  if (this.wrapperEl_ && !this.vertical_) {
    this.wrapperEl_.style.display = "block";
  } else {
    this.showVertical_();
  }
  this.isHidden_ = false;
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.showVertical_ = function() {
  if (this.verticalWrapperEl_ && this.vertical_) {
    this.verticalWrapperEl_.style.display = "inline-block";
    if (this.groupInput_) {
      this.groupInput_.draw();
    }
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.hideVertical_ = function() {
  if (this.verticalWrapperEl_ && this.vertical_) {
    this.verticalWrapperEl_.style.display = "none";
    if (this.groupInput_) {
      this.groupInput_.draw();
    }
  }
};
chatango.group.raterestrictions.RateLimitedPBController.prototype.dispose = function() {
  if (this.timer_) {
    this.timer_.dispose();
  }
};
goog.provide("chatango.group.raterestrictions.RateLimitedDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.utils.style");
goog.require("chatango.ui.buttons.ChatangoButton");
chatango.group.raterestrictions.RateLimitedDialog = function(seconds, input, isInitialWarning, callback) {
  this.seconds_ = seconds;
  this.input_ = input;
  this.isInitialWarning_ = isInitialWarning || false;
  this.callback_ = callback || null;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.handler = this.getHandler();
  if (!this.isInitialWarning_) {
    this.timer_ = new goog.Timer(1E3);
    var that = this;
    goog.events.listen(this.timer_, goog.Timer.TICK, function() {
      that.onTick_();
    });
  }
};
goog.inherits(chatango.group.raterestrictions.RateLimitedDialog, chatango.ui.ScrollableDialog);
chatango.group.raterestrictions.RateLimitedDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.warningTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.warningTextEl);
  this.okBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.okBtn_, goog.ui.Component.EventType.ACTION, this.onOKButtonClicked);
  this.okBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.okBtn_.render(this.okBtnWrapperEl_);
  dom.appendChild(content, this.okBtnWrapperEl_);
  if (this.isInitialWarning_) {
    this.editBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
    this.handler.listen(this.editBtn_, goog.ui.Component.EventType.ACTION, this.onEditButtonClicked);
    this.editBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
    this.editBtn_.render(this.editBtnWrapperEl_);
    dom.appendChild(content, this.editBtnWrapperEl_);
  } else {
    this.timer_.start();
  }
  this.updateCopy();
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.enterDocument = function() {
  chatango.group.raterestrictions.RateLimitedDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.focus = function() {
  if (this.isInitialWarning_) {
    goog.base(this, "focus");
  } else {
    this.input_.focus();
  }
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.onOKButtonClicked = function() {
  if (this.isInitialWarning_ && this.callback_) {
    this.callback_(true);
    this.callback_ = null;
  }
  this.setVisible(false);
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.onEditButtonClicked = function() {
  if (this.isInitialWarning_ && this.callback_) {
    this.callback_(false);
    this.callback_ = null;
  }
  if (this.isInitialWarning_) {
    this.input_.focus();
  }
  this.setVisible(false);
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.dispose = function() {
  if (this.timer_) {
    this.timer_.stop();
  }
  if (this.isInitialWarning_ && this.callback_) {
    this.callback_(true);
  }
  this.callback_ = null;
  chatango.group.raterestrictions.RateLimitedDialog.superClass_.dispose.call(this);
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.onTick_ = function() {
  this.seconds_--;
  if (this.seconds_ > 0) {
    this.updateSecondsLeft_();
  } else {
    this.dispose();
  }
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.updateSecondsLeft_ = function() {
  var rrm = "rate_restrictions_module";
  var warning = this.lm_.getString(rrm, "rl_warning_status") + String(this.seconds_) + " " + this.lm_.getString(rrm, "seconds");
  this.warningTextEl.innerHTML = warning;
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.update = function(secondsLeft) {
  this.seconds_ = secondsLeft;
  this.updateSecondsLeft_();
};
chatango.group.raterestrictions.RateLimitedDialog.prototype.updateCopy = function() {
  var rrm = "rate_restrictions_module";
  if (this.isInitialWarning_) {
    this.setTitle(this.lm_.getString(rrm, "rl_title"));
    var warning = this.lm_.getString(rrm, "rl_warning") + String(this.seconds_) + " " + this.lm_.getString(rrm, "seconds");
    this.warningTextEl.innerHTML = warning;
    this.okBtn_.setContent(this.lm_.getString(rrm, "send"));
    this.editBtn_.setContent(this.lm_.getString(rrm, "edit_message"));
  } else {
    var warning = this.lm_.getString(rrm, "rl_warning_status") + String(this.seconds_) + " " + this.lm_.getString(rrm, "seconds");
    this.warningTextEl.innerHTML = warning;
    this.okBtn_.setContent(this.lm_.getString("ui", "ok"));
  }
};
goog.provide("chatango.modules.RateRestrictionsModule");
goog.require("chatango.group.GroupInput");
goog.require("chatango.group.raterestrictions.FloodWarningDialog");
goog.require("chatango.group.raterestrictions.GenericWarningDialog");
goog.require("chatango.group.raterestrictions.ModeSwitchDialog");
goog.require("chatango.group.raterestrictions.NlpWarningDialog");
goog.require("chatango.group.raterestrictions.EmailVerifRequiredDialog");
goog.require("chatango.group.raterestrictions.RateLimitedDialog");
goog.require("chatango.group.raterestrictions.RateLimitedPBController");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.RateRestrictionsModule = function() {
  goog.base(this);
  this.progressBarController_ = null;
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  chatango.managers.LanguageManager.getInstance().getStringPack("rate_restrictions_module", chatango.modules.RateRestrictionsModule.strs, this.initCopy, this);
};
goog.inherits(chatango.modules.RateRestrictionsModule, goog.events.EventTarget);
chatango.modules.RateRestrictionsModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.RateRestrictionsModule");
chatango.modules.RateRestrictionsModule.prototype.closePopUps = function() {
  this.closeFloodWarningDialog();
  this.closeNlpWarningDialog();
  this.closeGenericWarningDialog();
  this.closeRateLimitedDialog();
  this.closeModeSwitchDialog();
};
chatango.modules.RateRestrictionsModule.prototype.constrainDialogsToScreen = function() {
  if (this.floodWarningDialog_) {
    chatango.utils.display.constrainToStage(this.floodWarningDialog_.getElement());
    chatango.utils.display.keepActiveFormElementOnScreen(this.floodWarningDialog_.getElement());
  }
  if (this.nlpWarningDialog_) {
    chatango.utils.display.constrainToStage(this.nlpWarningDialog_.getElement());
    chatango.utils.display.keepActiveFormElementOnScreen(this.nlpWarningDialog_.getElement());
  }
  if (this.genericWarningDialog_) {
    chatango.utils.display.constrainToStage(this.genericWarningDialog_.getElement());
    chatango.utils.display.keepActiveFormElementOnScreen(this.genericWarningDialog_.getElement());
  }
  if (this.emailVerifRequiredDialog_) {
    chatango.utils.display.constrainToStage(this.emailVerifRequiredDialog_.getElement());
    chatango.utils.display.keepActiveFormElementOnScreen(this.emailVerifRequiredDialog_.getElement());
  }
};
chatango.modules.RateRestrictionsModule.prototype.openFloodWarningDialog = function(warning, input) {
  this.closeFloodWarningDialog(warning);
  this.floodWarningDialog_ = new chatango.group.raterestrictions.FloodWarningDialog(warning, input);
  this.input_ = input;
  goog.events.listenOnce(this.floodWarningDialog_, goog.ui.PopupBase.EventType.SHOW, this.onFloodWarningDialogShow_, false, this);
  this.floodWarningDialog_.setVisible(true);
};
chatango.modules.RateRestrictionsModule.prototype.onFloodWarningDialogShow_ = function(e) {
  var offset = new goog.math.Coordinate(20, -20);
  goog.positioning.positionAtAnchor(this.input_.getElement(), goog.positioning.Corner.TOP_LEFT, this.floodWarningDialog_.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
  chatango.utils.display.constrainToStage(this.floodWarningDialog_.getElement());
};
chatango.modules.RateRestrictionsModule.prototype.closeFloodWarningDialog = function() {
  if (this.floodWarningDialog_) {
    this.floodWarningDialog_.dispose();
  }
};
chatango.modules.RateRestrictionsModule.prototype.openNlpWarningDialog = function(warning, input) {
  this.closeNlpWarningDialog(warning);
  this.nlpWarningDialog_ = new chatango.group.raterestrictions.NlpWarningDialog(warning, input);
  this.input_ = input;
  goog.events.listenOnce(this.nlpWarningDialog_, goog.ui.PopupBase.EventType.SHOW, this.onNlpWarningDialogShow_, false, this);
  this.nlpWarningDialog_.setVisible(true);
};
chatango.modules.RateRestrictionsModule.prototype.onNlpWarningDialogShow_ = function(e) {
  var offset = new goog.math.Coordinate(20, -20);
  goog.positioning.positionAtAnchor(this.input_.getElement(), goog.positioning.Corner.TOP_LEFT, this.nlpWarningDialog_.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
  chatango.utils.display.constrainToStage(this.nlpWarningDialog_.getElement());
};
chatango.modules.RateRestrictionsModule.prototype.closeNlpWarningDialog = function() {
  if (this.nlpWarningDialog_) {
    this.nlpWarningDialog_.dispose();
  }
};
chatango.modules.RateRestrictionsModule.prototype.openGenericWarningDialog = function(warning, input) {
  this.closeGenericWarningDialog(warning);
  this.genericWarningDialog_ = new chatango.group.raterestrictions.GenericWarningDialog(warning, input);
  this.input_ = input;
  goog.events.listenOnce(this.genericWarningDialog_, goog.ui.PopupBase.EventType.SHOW, this.onGenericWarningDialogShow_, false, this);
  this.genericWarningDialog_.setVisible(true);
};
chatango.modules.RateRestrictionsModule.prototype.openEmailVerifRequiredDialog = function(input, afterSignup) {
  this.closeEmailVerifRequiredDialog();
  this.emailVerifRequiredDialog_ = new chatango.group.raterestrictions.EmailVerifRequiredDialog(input, afterSignup);
  this.input_ = input;
  goog.events.listenOnce(this.emailVerifRequiredDialog_, goog.ui.PopupBase.EventType.SHOW, this.onEmailVerifRequiredDialogShow_, false, this);
  goog.events.listen(this.emailVerifRequiredDialog_, chatango.group.raterestrictions.EmailVerifRequiredDialog.EventType.VERIFY_EMAIL, this.onEmailVerifyClicked_, false, this);
  this.emailVerifRequiredDialog_.setVisible(true);
};
chatango.modules.RateRestrictionsModule.prototype.onGenericWarningDialogShow_ = function(e) {
  var offset = new goog.math.Coordinate(20, -20);
  goog.positioning.positionAtAnchor(this.input_.getElement(), goog.positioning.Corner.TOP_LEFT, this.genericWarningDialog_.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
  chatango.utils.display.constrainToStage(this.genericWarningDialog_.getElement());
};
chatango.modules.RateRestrictionsModule.prototype.onEmailVerifRequiredDialogShow_ = function(e) {
  var offset = new goog.math.Coordinate(20, -20);
  goog.positioning.positionAtAnchor(this.input_.getElement(), goog.positioning.Corner.TOP_LEFT, this.emailVerifRequiredDialog_.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
  chatango.utils.display.constrainToStage(this.emailVerifRequiredDialog_.getElement());
};
chatango.modules.RateRestrictionsModule.prototype.onEmailVerifyClicked_ = function(e) {
  this.dispatchEvent(chatango.events.EventType.EDIT_EMAIL);
};
chatango.modules.RateRestrictionsModule.prototype.closeGenericWarningDialog = function() {
  if (this.genericWarningDialog_) {
    this.genericWarningDialog_.dispose();
  }
};
chatango.modules.RateRestrictionsModule.prototype.closeEmailVerifRequiredDialog = function() {
  if (this.emailVerifRequiredDialog_) {
    this.emailVerifRequiredDialog_.dispose();
  }
};
chatango.modules.RateRestrictionsModule.prototype.openRateLimitedDialog = function(seconds, input, isInitialWarning, callback) {
  this.closeRateLimitedDialog();
  this.rateLimitedDialog_ = new chatango.group.raterestrictions.RateLimitedDialog(seconds, input, isInitialWarning, callback);
  this.input_ = input;
  goog.events.listenOnce(this.rateLimitedDialog_, goog.ui.PopupBase.EventType.SHOW, this.onRateLimitedDialogShow_, false, this);
  this.rateLimitedDialog_.setVisible(true);
};
chatango.modules.RateRestrictionsModule.prototype.onRateLimitedDialogShow_ = function(e) {
  var offset = new goog.math.Coordinate(20, -20);
  goog.positioning.positionAtAnchor(this.input_.getElement(), goog.positioning.Corner.TOP_LEFT, this.rateLimitedDialog_.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
  var bounds = goog.style.getBounds(goog.dom.getDocument().body);
  bounds.width = bounds.width * .93;
  chatango.utils.display.constrainToStage(this.rateLimitedDialog_.getElement(), bounds, false);
  chatango.utils.display.keepActiveFormElementOnScreen(this.rateLimitedDialog_.getElement());
};
chatango.modules.RateRestrictionsModule.prototype.closeRateLimitedDialog = function() {
  if (this.rateLimitedDialog_) {
    this.rateLimitedDialog_.dispose();
    this.rateLimitedDialog_ = null;
  }
};
chatango.modules.RateRestrictionsModule.prototype.updateRateLimitedDialog = function(secondsLeft) {
  if (this.rateLimitedDialog_) {
    this.rateLimitedDialog_.update(secondsLeft);
  }
};
chatango.modules.RateRestrictionsModule.prototype.openModeSwitchDialog = function(input) {
  this.closeModeSwitchDialog();
  this.modeSwitchDialog_ = new chatango.group.raterestrictions.ModeSwitchDialog;
  this.input_ = input;
  goog.events.listenOnce(this.modeSwitchDialog_, goog.ui.PopupBase.EventType.SHOW, this.onModeSwitchDialogShow_, false, this);
  this.modeSwitchDialog_.setVisible(true);
};
chatango.modules.RateRestrictionsModule.prototype.onModeSwitchDialogShow_ = function(e) {
  var offset = new goog.math.Coordinate(20, -20);
  goog.positioning.positionAtAnchor(this.input_.getElement(), goog.positioning.Corner.TOP_LEFT, this.modeSwitchDialog_.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
};
chatango.modules.RateRestrictionsModule.prototype.closeModeSwitchDialog = function() {
  if (this.modeSwitchDialog_) {
    this.modeSwitchDialog_.dispose();
  }
};
chatango.modules.RateRestrictionsModule.prototype.createProgressBar = function(groupInput, initialProgress, show) {
  if (this.progressBarController_) {
    return;
  }
  show = show ? true : false;
  this.progressBarController_ = new chatango.group.raterestrictions.RateLimitedPBController(groupInput, initialProgress, show);
};
chatango.modules.RateRestrictionsModule.prototype.hasProgressBar = function() {
  if (this.progressBarController_) {
    return true;
  }
  return false;
};
chatango.modules.RateRestrictionsModule.prototype.setProgressBarSeconds = function(seconds) {
  if (this.progressBarController_) {
    this.progressBarController_.setSeconds(seconds);
  }
};
chatango.modules.RateRestrictionsModule.prototype.startProgressBar = function(seconds) {
  if (this.progressBarController_) {
    this.progressBarController_.start();
  }
};
chatango.modules.RateRestrictionsModule.prototype.startProgressBarIfNotRunning = function(seconds) {
  if (this.progressBarController_ && !this.progressBarController_.isRunning()) {
    this.progressBarController_.show();
    this.progressBarController_.start(seconds);
  }
};
chatango.modules.RateRestrictionsModule.prototype.updateProgressBarIfRunning = function(rateInSeconds, offsetSeconds) {
  if (this.progressBarController_) {
    this.progressBarController_.setSeconds(rateInSeconds);
    if (this.progressBarController_.isRunning()) {
      this.progressBarController_.start(offsetSeconds);
    }
  }
};
chatango.modules.RateRestrictionsModule.prototype.isProgressBarRunning = function() {
  if (this.progressBarController_) {
    return this.progressBarController_.isRunning();
  }
  return false;
};
chatango.modules.RateRestrictionsModule.prototype.isProgressBarHidden = function() {
  if (this.progressBarController_) {
    return this.progressBarController_.isHidden();
  }
  return true;
};
chatango.modules.RateRestrictionsModule.prototype.stopProgressBar = function() {
  if (this.progressBarController_) {
    this.progressBarController_.stop();
  }
};
chatango.modules.RateRestrictionsModule.prototype.stopAndHideProgressBar = function() {
  if (this.progressBarController_) {
    this.progressBarController_.stop();
    this.progressBarController_.hide();
  }
};
chatango.modules.RateRestrictionsModule.prototype.setProgressBarDirection = function(vertical) {
  if (this.progressBarController_) {
    this.progressBarController_.setDirection(vertical);
  }
};
chatango.modules.RateRestrictionsModule.prototype.updateProgressBar = function(secondsLeft) {
  if (this.progressBarController_) {
    this.progressBarController_.update(secondsLeft);
  }
};
chatango.modules.RateRestrictionsModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("ui") && lm.isPackLoaded("rate_restrictions_module")) {
    if (this.floodWarningDialog_) {
      this.floodWarningDialog_.updateCopy();
    }
    if (this.nlpWarningDialog_) {
      this.nlpWarningDialog_.updateCopy();
    }
    if (this.genericWarningDialog_) {
      this.genericWarningDialog_.updateCopy();
    }
  }
};
chatango.modules.RateRestrictionsModule.strs = {"slow_down":"Please slow down", "please_wait":"Please wait a few seconds before sending, to avoid having your ability to send messages restricted", "warning_ended":"Warning ended", "warning_over":"The warning period is over", "been_restricted":"You have been restricted", "restricted_for":"You have been restricted from sending messages for *time* *minute*", "minute":"minute", "minutes":"minutes", "still_restricted":"You are still restricted", "still_restricted_for":"You are still restricted from sending messages for *time* *minute*", 
"rl_title":"Slow Mode", "rl_warning":"You can post once every ", "rl_warning_status":"You can post again in ", "seconds":"seconds", "send":"Send", "edit_message":"Edit Message", "mode_change":"Slow Mode has been turned off", "nonsense_warning_title":"Warning", "nonsense_warning":"This message does not appear to make sense. Please try to write more meaningful messages or you may be restricted*", "nonsense_restricted_for":"for posting messages that appear meaningless", "spam_warning_title":"Spam warning", 
"spam_warning":"This message seems to be repetitious. Please do not spam the group or you may be restricted*", "spam_restricted_for":"for spamming the group", "short_warning_title":"Spam warning", "short_warning":"Your messages don't seem to contain much information. Please try to write more meaningful messages or you may be restricted*", "short_restricted_for":"for spamming the group", "flood_restricted_for":"for flooding the group", "auto_mod_enabled":"*Auto-moderation has been enabled by moderators", 
"msg_too_long_title":"Message was too long", "msg_too_long_body":"A group administrator has restricted the maximum message length to *bytes* bytes.", "msg_too_long_default_body":"This message exceeds the maximum length of *bytes* bytes.", "too_many_connections":"Too many connections", "too_many_connections_from_ip":"You have too many connections from this IP. Please close some other Chatango chats, and refresh to connect.", "ve_vrfy_btn":"Verify Email", "ve_ok_btn":"Ok", "ve_title":"Email Verification", 
"ve_warning":"The Administrators of this group require email verification to message"};
goog.module.ModuleManager.getInstance().setLoaded("RateRestrictionsModule");

