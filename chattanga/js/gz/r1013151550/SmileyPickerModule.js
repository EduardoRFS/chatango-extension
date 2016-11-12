goog.provide("chatango.smileys.SmileyPicker");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.PaymentsManager");
goog.require("chatango.managers.PremiumManager");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.SupportChatangoDialogManager");
goog.require("chatango.ui.ScrollableDialog");
goog.require("goog.ui.Button");
chatango.smileys.SmileyPicker = function(cm, opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.clickEvents_ = chatango.managers.Environment.getInstance().isDesktop() ? goog.events.EventType.CLICK : goog.events.EventType.TOUCHEND;
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.groupInfo_ = this.managers_.getManager(chatango.group.GroupInfo.ManagerType);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.dm_ = chatango.managers.DateManager.getInstance();
  this.pm_ = chatango.managers.PremiumManager.getInstance();
  this.scaleManager_ = chatango.managers.ScaleManager.getInstance();
  this.premium_ = false;
  this.userPremiumStatus_ = null;
  this.smileysArr_ = [];
  this.smileyInfoArr_ = [];
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
};
goog.inherits(chatango.smileys.SmileyPicker, chatango.ui.ScrollableDialog);
chatango.smileys.SmileyPicker.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var scrollContent = this.getContentElement();
  this.contentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.contentEl_, "sdlg-sc");
  goog.dom.classes.add(this.contentEl_, "content-dialog");
  goog.dom.append(scrollContent, this.contentEl_);
  this.setUpBasicSmileys_();
  this.pitchWrapperEl_ = goog.dom.createDom("div", {"id":"PREM_PIT"});
  this.pitchEl_ = goog.dom.createDom("span");
  goog.dom.appendChild(this.pitchWrapperEl_, this.pitchEl_);
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  goog.events.listenOnce(this.pm_, chatango.managers.PremiumManager.EventType.STATUS_LOADED, function(e) {
    if (!this.smileysArr_) {
      this.smileysArr_ = [];
    }
    var currentUser = chatango.users.UserManager.getInstance().currentUser;
    this.userPremiumStatus_ = this.pm_.getStatus(currentUser);
    this.premium_ = this.userPremiumStatus_ >= 200;
    this.expirationDate_ = this.pm_.getExpDate(currentUser);
    if (this.premium_ || currentUser.isOwner()) {
      this.setUpPremiumElements_(this.contentEl_, this.expirationDate_ != null);
    } else {
      if (this.groupInfo_ && this.groupInfo_.getPaymentsOk()) {
        this.setUpNonPremiumElements_(this.contentEl_, this.expirationDate_ != null);
      }
    }
    this.updateCopy();
    this.constrainDialogsToScreen();
  }, false, this);
  this.pm_.getStatus(this.user_, true);
};
chatango.smileys.SmileyPicker.prototype.setUpBasicSmileys_ = function() {
  this.basicSmileysEl_ = goog.dom.createDom("div", {id:"BasicSmileys"});
  goog.dom.append(this.contentEl_, this.basicSmileysEl_);
  var basicSmileyArr = chatango.smileys.SmileyManager.getInstance().getBasicSmileyArray();
  this.addSmileys_(basicSmileyArr, this.basicSmileysEl_);
};
chatango.smileys.SmileyPicker.prototype.setUpPremiumSmileys_ = function() {
  this.premiumSmileysEl_ = goog.dom.createDom("div", {id:"PremiumSmileys"});
  goog.dom.append(this.contentEl_, this.premiumSmileysEl_);
  var premiumSmileyArr = chatango.smileys.SmileyManager.getInstance().getPremiumSmileyArray();
  this.addSmileys_(premiumSmileyArr, this.premiumSmileysEl_);
};
chatango.smileys.SmileyPicker.prototype.addSmileys_ = function(arr, el) {
  var len = arr.length;
  var smiley;
  var size = 21;
  if (!chatango.managers.Environment.getInstance().isDesktop()) {
    size = Math.max(Math.round(28 * chatango.managers.ScaleManager.getInstance().getScale() / 100), 11);
  }
  var wrap;
  var wrapWidth = Math.round(size * 1.3);
  var wrapHeight = Math.round(size * 1.35);
  var xOffset;
  var y, top;
  for (var i = 0;i < len;i++) {
    wrap = goog.dom.createDom("div", {"className":"sm-pick-wrap", "title":arr[i]["code"], "style":"width:" + wrapWidth + "px; height:" + wrapHeight + "px; vertical-align:top;"});
    if (arr[i]["r"] == "SmileSmiley" && arr[i]["pm"] != "smile") {
      continue;
    }
    smiley = chatango.smileys.SmileyManager.getInstance().makeSmiley(arr[i]["code"], size, this.managers_, arr[i]["info"] + ":picker");
    goog.dom.append(el, wrap);
    smiley.render(wrap);
    goog.events.listen(smiley.getElement(), this.clickEvents_, this.onSmileyClick_, false, this);
    smiley.getElement().style.padding = "0";
    if (arr[i]["x"]) {
      smiley.getElement().style.left = arr[i]["x"] * size + "px";
    }
    if (arr[i]["h"] || arr[i]["y"]) {
      top = 1 + size * chatango.smileys.Smiley.Y_OFFSET;
      if (arr[i]["y"]) {
        y = arr[i]["y"] ? arr[i]["y"] : 0;
        top = top + y * size;
      }
      top = Math.floor(top);
      smiley.getElement().style.top = top + "px";
    }
    this.smileyInfoArr_.push(arr[i]);
    this.smileysArr_.push(smiley);
  }
};
chatango.smileys.SmileyPicker.prototype.setUpPremiumElements_ = function(content, hasExpirationDate) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  if (currentUser.isOwner() && !this.premium_) {
    this.supportLink_ = new goog.ui.Button(this.linkText_, goog.ui.LinkButtonRenderer.getInstance());
    this.supportLink_.addClassName("link-btn");
    this.supportLinkEl_ = goog.dom.createDom("span");
    this.supportLink_.render(this.supportLinkEl_);
    goog.events.listen(this.supportLink_, goog.ui.Component.EventType.ACTION, this.onSupportLinkClicked_, false, this);
    goog.dom.appendChild(this.pitchWrapperEl_, this.supportLinkEl_);
  } else {
    this.giveExtrasLink_ = new goog.ui.Button(this.lm_.getString("smileyPicker", "give_to_friends"), goog.ui.LinkButtonRenderer.getInstance());
    this.giveExtrasLink_.addClassName("link-btn");
    this.giveExtrasLinkEl_ = goog.dom.createDom("div");
    this.giveExtrasLink_.render(this.giveExtrasLinkEl_);
    goog.events.listen(this.giveExtrasLink_, goog.ui.Component.EventType.ACTION, this.onGiveExtrasLinkClicked_, false, this);
    goog.dom.appendChild(this.pitchWrapperEl_, this.giveExtrasLinkEl_);
  }
  if (hasExpirationDate) {
    this.dateEl_ = goog.dom.createDom("span");
    goog.dom.appendChild(this.pitchWrapperEl_, this.dateEl_);
  }
  goog.dom.append(content, this.pitchWrapperEl_);
  this.setUpPremiumSmileys_();
};
chatango.smileys.SmileyPicker.prototype.setUpNonPremiumElements_ = function(content, hasExpirationDate) {
  this.supportLink_ = new goog.ui.Button(this.linkText_, goog.ui.LinkButtonRenderer.getInstance());
  this.supportLink_.addClassName("link-btn");
  this.supportLinkEl_ = goog.dom.createDom("span");
  this.supportLink_.render(this.supportLinkEl_);
  goog.events.listen(this.supportLink_, goog.ui.Component.EventType.ACTION, this.onSupportLinkClicked_, false, this);
  goog.dom.appendChild(this.pitchWrapperEl_, this.supportLinkEl_);
  if (hasExpirationDate) {
    this.dateEl_ = goog.dom.createDom("span");
    goog.dom.appendChild(this.pitchWrapperEl_, this.dateEl_);
  }
  goog.dom.append(content, this.pitchWrapperEl_);
  this.setUpPremiumSmileys_();
};
chatango.smileys.SmileyPicker.prototype.enterDocument = function() {
  chatango.smileys.SmileyPicker.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.smileys.SmileyPicker.prototype.onGetUnusedAccountLinkClicked_ = function() {
  chatango.managers.PaymentsManager.getInstance().startPaymentFlow(chatango.managers.PaymentsManager.FlowEntrance.UNUSED_ACCOUNT);
};
chatango.smileys.SmileyPicker.prototype.onGiveExtrasLinkClicked_ = function() {
  chatango.managers.PaymentsManager.getInstance().startPaymentFlow(chatango.managers.PaymentsManager.FlowEntrance.GIVE_TO_FRIENDS);
  this.dispose();
};
chatango.smileys.SmileyPicker.prototype.onSupportLinkClicked_ = function() {
  chatango.managers.PaymentsManager.getInstance().startPaymentFlow(chatango.managers.PaymentsManager.FlowEntrance.PREMIUM);
  this.dispose();
};
chatango.smileys.SmileyPicker.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("smileyPicker", "smiley_picker"));
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  switch(this.userPremiumStatus_) {
    case chatango.managers.PremiumManager.PremiumCode.PAYER:
      this.pitchText_ = this.lm_.getString("smileyPicker", "premium_status");
      break;
    case chatango.managers.PremiumManager.PremiumCode.GIFTEE:
      this.pitchText_ = this.lm_.getString("smileyPicker", "premium_giftee_status");
      break;
    case chatango.managers.PremiumManager.PremiumCode.NEVER_BEEN_PREMIUM:
      if (currentUser.isOwner()) {
        this.pitchText_ = this.lm_.getString("smileyPicker", "chatango_pitch_nonprem_owner");
        this.linkText_ = this.lm_.getString("smileyPicker", "support_link_nonprem_owner");
      } else {
        this.pitchText_ = this.lm_.getString("smileyPicker", "chatango_pitch_nonpremium");
        this.linkText_ = this.lm_.getString("smileyPicker", "support_link_nonpremium");
      }
      break;
    case chatango.managers.PremiumManager.PremiumCode.EXPIRED_PAYER:
      if (currentUser.isOwner()) {
        this.pitchText_ = this.lm_.getString("smileyPicker", "chatango_pitch_nonprem_owner");
        this.linkText_ = this.lm_.getString("smileyPicker", "support_link_nonprem_owner");
      } else {
        this.pitchText_ = this.lm_.getString("smileyPicker", "chatango_pitch_expired_premium");
        this.linkText_ = this.lm_.getString("smileyPicker", "support_link_expired_premium");
      }
      break;
    case chatango.managers.PremiumManager.PremiumCode.EXPIRED_GIFTEE:
      if (currentUser.isOwner()) {
        this.pitchText_ = this.lm_.getString("smileyPicker", "chatango_pitch_nonprem_owner");
        this.linkText_ = this.lm_.getString("smileyPicker", "support_link_nonprem_owner");
      } else {
        this.pitchText_ = this.lm_.getString("smileyPicker", "chatango_pitch_expired_premium_giftee");
        this.linkText_ = this.lm_.getString("smileyPicker", "support_link_expired_premium_giftee");
      }
      break;
  }
  if (this.pitchText_) {
    if (this.premium_) {
      this.pitchEl_.innerHTML = this.pitchText_ + this.dm_.dateToString(this.expirationDate_, this.lm_.getString("smileyPicker", "expiration_date_format_premium")) + ".";
    } else {
      this.pitchEl_.innerHTML = this.pitchText_;
      if (this.expirationDate_) {
        this.dateEl_.innerHTML = this.lm_.getString("smileyPicker", "expired") + this.dm_.dateToString(this.expirationDate_, this.lm_.getString("smileyPicker", "expiration_date_format")) + ".";
      }
    }
  }
  if (this.supportLink_) {
    this.supportLink_.setContent(this.linkText_);
  }
  if (this.giveExtrasLink_) {
    this.giveExtrasLink_.setContent(this.lm_.getString("smileyPicker", "give_to_friends"));
  }
  if (this.getUnusedAccountLink_) {
    this.getUnusedAccountLink_.setContent(this.lm_.getString("smileyPicker", "get_unused_acc"));
  }
};
chatango.smileys.SmileyPicker.prototype.draw = function() {
  goog.base(this, "draw");
};
chatango.smileys.SmileyPicker.prototype.onSmileyClick_ = function(e) {
  var code;
  var isPremSmiley = false;
  for (var i = 0;i < this.smileysArr_.length;i++) {
    if (this.smileysArr_[i].getElement() === e.currentTarget) {
      code = this.smileyInfoArr_[i]["code"];
      if (this.smileyInfoArr_[i]["info"]) {
        code += "?" + this.smileyInfoArr_[i]["info"];
      }
      isPremSmiley = this.smileyInfoArr_[i]["p"] != "b";
      break;
    }
  }
  if (!isPremSmiley || this.premium_ || chatango.users.UserManager.getInstance().currentUser.isOwner()) {
    var evt = new goog.events.Event(chatango.events.EventType.SMILEY_PICKED);
    evt.data = code;
    this.dispatchEvent(evt);
  } else {
    this.openSupportChatangoDialog_(e);
  }
  if (this.isFullScreenAndMobileOrSmallEmbed()) {
    this.onTitleCloseClick_(e);
  }
};
chatango.smileys.SmileyPicker.prototype.openSupportChatangoDialog_ = function(e) {
  chatango.managers.SupportChatangoDialogManager.getInstance().openDialog(chatango.managers.PaymentsManager.FlowEntrance.PREMIUM, this);
  this.constrainDialogsToScreen();
};
chatango.smileys.SmileyPicker.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.getElement()) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var vm = chatango.managers.ViewportManager.getInstance();
    var vpWidth = vm.getViewportSizeMonitor().getSize().width;
    var stage_w = opt_stageRect ? opt_stageRect.width : vpWidth;
    var new_h = Math.round(stage_h);
    if (!this.isFullScreenAndMobileOrSmallEmbed()) {
      this.setMaxHeight(new_h * .75);
      var width = Math.min(stage_w * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
      this.setWidth(width);
    } else {
      this.setMaxHeight(new_h);
      this.setWidth(stage_w);
      this.draw();
    }
    chatango.utils.display.constrainToStage(this.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.getElement());
  }
  chatango.managers.PaymentsManager.getInstance().constrainDialogsToScreen(opt_stageRect);
  chatango.managers.SupportChatangoDialogManager.getInstance().constrainDialogToScreen(opt_stageRect);
};
chatango.smileys.SmileyPicker.prototype.disposeInternal = function() {
  var len = this.smileysArr_.length;
  var smiley;
  for (var i = 0;i < len;i++) {
    smiley = this.smileysArr_[i];
    goog.events.unlisten(smiley.getElement(), this.clickEvents_, this.onSmileyClick_, false, this);
    smiley.dispose();
    smiley = null;
  }
  this.smileysArr_ = null;
  chatango.smileys.SmileyPicker.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.strings.SmileyPickerStrings");
chatango.strings.SmileyPickerStrings.strs = {"smiley_picker":"Smileys", "chatango_pitch_nonpremium":"Chatango costs more to run than it makes from ads. To keep it running, growing and getting new features, ", "support_link_nonpremium":"please support us now!", "chatango_pitch_nonprem_owner":"Thank you for creating this group. You can use the extra smileys below.", "support_link_nonprem_owner":"Please consider supporting Chatango.", "chatango_pitch_expired_premium":"Thank you for supporting Chatango. ", 
"support_link_expired_premium":"Please support us again.", "chatango_pitch_expired_premium_giftee":"Your gift has expired. ", "support_link_expired_premium_giftee":"Please support us and give to your friends.", "premium_status":"Thank you for supporting Chatango.  You can use the extra smileys below until ", "premium_giftee_status":"Someone gave you extended features and extra smileys.  You can use these until ", "give_to_friends":"Give extras to friends!", "expiration_date_format_premium":"mmm d, yyyy", 
"expiration_date_format":"ddd mmm d yyyy, g:i a", "expired":" Expired: ", "get_unused_acc":"Get an unused account"};
goog.provide("chatango.modules.SmileyPickerModule");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.smileys.SmileyPicker");
goog.require("chatango.strings.SmileyPickerStrings");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.SmileyPickerModule = function(cm) {
  goog.events.EventTarget.call(this);
  this.cm_ = cm;
  if (chatango.DEBUG) {
    this.logger.info("Creating SmileyPickerModule");
  }
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("smileyPicker", chatango.strings.SmileyPickerStrings.strs, this.initCopy, this);
};
goog.inherits(chatango.modules.SmileyPickerModule, goog.events.EventTarget);
chatango.modules.SmileyPickerModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.SmileyPickerModule");
chatango.modules.SmileyPickerModule.prototype.openSmileyPicker = function() {
  this.closeSmileyPicker();
  this.smileyPicker_ = new chatango.smileys.SmileyPicker(this.cm_);
  this.smileyPicker_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.smileyPicker_.setVisible(true);
  goog.events.listen(this.smileyPicker_, chatango.events.EventType.SMILEY_PICKED, this.relayEvent_, false, this);
};
chatango.modules.SmileyPickerModule.prototype.closeSmileyPicker = function() {
  if (this.smileyPicker_) {
    goog.events.unlisten(this.smileyPicker_, chatango.events.EventType.SMILEY_PICKED, this.relayEvent_, false, this);
    this.smileyPicker_.dispose();
    this.smileyPicker_ = null;
  }
};
chatango.modules.SmileyPickerModule.prototype.relayEvent_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.SmileyPickerModule.prototype.closePopUps = function() {
  this.closeSmileyPicker();
};
chatango.modules.SmileyPickerModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (!this.smileyPicker_) {
    return;
  }
  this.smileyPicker_.constrainDialogsToScreen(opt_stageRect);
};
chatango.modules.SmileyPickerModule.prototype.initCopy = function(pack_id) {
  if (this.smileyPicker_) {
    this.smileyPicker_.updateCopy();
  }
};
goog.module.ModuleManager.getInstance().setLoaded("SmileyPickerModule");

