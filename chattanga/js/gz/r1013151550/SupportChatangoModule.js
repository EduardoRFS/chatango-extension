goog.provide("chatango.group.settings.SupportDialog");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.DateManager");
goog.require("chatango.users.UserManager");
goog.require("chatango.managers.Style");
goog.require("chatango.ui.buttons.Button");
goog.require("goog.ui.Component.EventType");
chatango.group.settings.SupportDialog = function(premium_status, expiration) {
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.premium_ = premium_status;
  this.expiration_ = expiration ? expiration : 0;
  chatango.ui.ScrollableDialog.call(this, undefined, undefined, true);
  this.setFullScreenOnMobileAndSmallEmbeds(false);
  this.setResizable(false);
};
goog.inherits(chatango.group.settings.SupportDialog, chatango.ui.ScrollableDialog);
chatango.group.settings.SupportDialog.EventType = {SUPPORT_CHATANGO:"support_chatango", SUPPORT_GIFT_FRIENDS:"support_gift_friends", SUPPORT_BUY_ACCOUNT:"support_buy_account"};
chatango.group.settings.SupportDialog.prototype.createDom = function() {
  goog.base(this, "createDom");
  this.text_ = goog.dom.createDom("div");
  var donateWrap = goog.dom.createDom("div");
  goog.style.setStyle(donateWrap, "margin-top", "0.3em");
  goog.style.setStyle(donateWrap, "margin-bottom", "0.3em");
  this.donateButton_ = new goog.ui.Button(" ", goog.ui.LinkButtonRenderer.getInstance());
  this.donateButton_.addClassName("link-btn");
  goog.events.listen(this.donateButton_, goog.ui.Component.EventType.ACTION, this.donate_, false, this);
  this.donateButton_.render(donateWrap);
  var accountWrap = goog.dom.createDom("div");
  goog.style.setStyle(accountWrap, "margin-top", "0.3em");
  goog.style.setStyle(accountWrap, "margin-bottom", "0.3em");
  this.buyAccountButton_ = new goog.ui.Button(" ", goog.ui.LinkButtonRenderer.getInstance());
  this.buyAccountButton_.addClassName("link-btn");
  goog.events.listen(this.buyAccountButton_, goog.ui.Component.EventType.ACTION, this.buyAccount_, false, this);
  this.buyAccountButton_.render(accountWrap);
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  goog.dom.append(content, this.text_);
  goog.dom.append(content, donateWrap);
  goog.dom.append(content, accountWrap);
  this.updateCopy();
};
chatango.group.settings.SupportDialog.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("support_chatango", "title"));
  this.buyAccountButton_.setContent(this.lm_.getString("support_chatango", "buy_account"));
  var pitchText = "";
  var donateText = "";
  var isOwner = chatango.users.UserManager.getInstance().currentUser.isOwner();
  switch(this.premium_) {
    case chatango.managers.PremiumManager.PremiumCode.PAYER:
      pitchText = this.lm_.getString("support_chatango", "pitch_payer");
      donateText = this.lm_.getString("support_chatango", "gift_friends");
      break;
    case chatango.managers.PremiumManager.PremiumCode.GIFTEE:
      pitchText = this.lm_.getString("support_chatango", "pitch_giftee");
      donateText = this.lm_.getString("support_chatango", "gift_friends");
      break;
    case chatango.managers.PremiumManager.PremiumCode.EXPIRED_PAYER:
      pitchText = this.lm_.getString("support_chatango", "pitch_expired_payer");
      donateText = this.lm_.getString("support_chatango", "donate");
      break;
    case chatango.managers.PremiumManager.PremiumCode.EXPIRED_GIFTEE:
      pitchText = this.lm_.getString("support_chatango", "pitch_expired_giftee");
      donateText = this.lm_.getString("support_chatango", "donate");
      break;
    default:
      pitchText = this.lm_.getString("support_chatango", "pitch");
      donateText = this.lm_.getString("support_chatango", "donate");
  }
  if (this.expiration_) {
    pitchText = pitchText.split("*date*").join(chatango.managers.DateManager.getInstance().dateToString(this.expiration_, this.lm_.getString("support_chatango", "date_format")));
  }
  this.donateButton_.setContent(donateText);
  this.text_.innerHTML = pitchText;
};
chatango.group.settings.SupportDialog.prototype.donate_ = function() {
  var type;
  switch(this.premium_) {
    case chatango.managers.PremiumManager.PremiumCode.PAYER:
    ;
    case chatango.managers.PremiumManager.PremiumCode.GIFTEE:
      type = chatango.group.settings.SupportDialog.EventType.SUPPORT_GIFT_FRIENDS;
      break;
    default:
      type = chatango.group.settings.SupportDialog.EventType.SUPPORT_CHATANGO;
  }
  this.dispatchEvent(type);
};
chatango.group.settings.SupportDialog.prototype.buyAccount_ = function() {
  this.dispatchEvent(chatango.group.settings.SupportDialog.EventType.SUPPORT_BUY_ACCOUNT);
};
chatango.group.settings.SupportDialog.prototype.disposeInternal = function() {
  if (this.donateButton_) {
    goog.events.unlisten(this.donateButton_, goog.ui.Component.EventType.ACTION, this.donate_, false, this);
    this.donateButton_.dispose();
    this.donateButton_ = null;
  }
  if (this.buyAccountButton_) {
    goog.events.unlisten(this.buyAccountButton_, goog.ui.Component.EventType.ACTION, this.buyAccount_, false, this);
    this.buyAccountButton_.dispose();
    this.buyAccountButton_ = null;
  }
  if (this.giftIcon_) {
    this.giftIcon_.dispose();
    this.giftIcon = null;
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.modules.SupportChatangoModule");
goog.require("chatango.group.settings.SupportDialog");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.PaymentsManager");
goog.require("chatango.managers.PaymentsManager");
goog.require("chatango.users.UserManager");
goog.require("goog.module.ModuleManager");
chatango.modules.SupportChatangoModule = function() {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("support_chatango", chatango.modules.SupportChatangoModule.strs, this.initCopy, this);
  this.paymentsManager_ = chatango.managers.PaymentsManager.getInstance();
  this.premiumManager_ = chatango.managers.PremiumManager.getInstance();
  this.dialog_ = null;
};
chatango.modules.SupportChatangoModule.prototype.closePopUps = function() {
  if (this.dialog_) {
    goog.events.removeAll(this.dialog_);
    this.dialog_.dispose();
    this.dialog_ = null;
  }
};
chatango.modules.SupportChatangoModule.prototype.openSupportChatangoDialog = function() {
  var user = chatango.users.UserManager.getInstance().currentUser;
  this.premiumManager_.getStatus(user, true);
  goog.events.listenOnce(this.premiumManager_, chatango.managers.PremiumManager.EventType.STATUS_LOADED, function(e) {
    var premium_status = this.premiumManager_.getStatus(user);
    var expiration = this.premiumManager_.getExpDate(user);
    this.openSupportChatangoDialog_(premium_status, expiration);
  }, false, this);
};
chatango.modules.SupportChatangoModule.prototype.openSupportChatangoDialog_ = function(premium_status, expiration) {
  this.closePopUps();
  this.dialog_ = new chatango.group.settings.SupportDialog(premium_status, expiration);
  this.dialog_.setVisible(true);
  this.constrainDialogsToScreen();
  goog.events.listen(this.dialog_, chatango.group.settings.SupportDialog.EventType.SUPPORT_CHATANGO, this.donate_, false, this);
  goog.events.listen(this.dialog_, chatango.group.settings.SupportDialog.EventType.SUPPORT_GIFT_FRIENDS, this.giftFriends_, false, this);
  goog.events.listen(this.dialog_, chatango.group.settings.SupportDialog.EventType.SUPPORT_BUY_ACCOUNT, this.buyAccount_, false, this);
  goog.events.listen(this.dialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closePopUps, false, this);
};
chatango.modules.SupportChatangoModule.prototype.donate_ = function(e) {
  this.closePopUps();
  this.paymentsManager_.startPaymentFlow(chatango.managers.PaymentsManager.FlowEntrance.PREMIUM);
  e.stopPropagation();
};
chatango.modules.SupportChatangoModule.prototype.giftFriends_ = function(e) {
  this.closePopUps();
  this.paymentsManager_.startPaymentFlow(chatango.managers.PaymentsManager.FlowEntrance.GIVE_TO_FRIENDS);
  e.stopPropagation();
};
chatango.modules.SupportChatangoModule.prototype.buyAccount_ = function(e) {
  this.closePopUps();
  this.paymentsManager_.startPaymentFlow(chatango.managers.PaymentsManager.FlowEntrance.UNUSED_ACCOUNT);
  e.stopPropagation();
};
chatango.modules.SupportChatangoModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.dialog_ && this.dialog_.isVisible()) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h);
    this.dialog_.setMaxHeight(new_h * .98);
    this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
    var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
    var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
    this.dialog_.setWidth(width);
    chatango.utils.display.constrainToStage(this.dialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.dialog_.getElement());
  }
};
chatango.modules.SupportChatangoModule.prototype.initCopy = function() {
  if (this.lm_.isPackLoaded("support_chatango") && this.dialog_) {
    this.dialog_.updateCopy();
  }
};
chatango.modules.SupportChatangoModule.strs = {"title":"Extended features", "pitch":"Purchase fonts and message backgrounds, gift them to friends, or get an original account name.<br/>Chatango's development is made possible primarily through user contributions. Please consider one of these options:<br/>", "pitch_payer":"Thank you for supporting Chatango. Your extended features expire on *date*. Please consider supporting us again to keep Chatango running, growing and getting new features", "pitch_expired_payer":"Thank you for supporting Chatango previously. Please consider supporting us again.", 
"pitch_giftee":"You have access to extended features that expires on *date*. Please consider supporting us by gifting extended features to a friend or purchasing an original account.", "pitch_expired_giftee":"Chatango costs more to run than it makes off ads alone. To keep it running, growing and getting new features, please support us now!", "date_format":"mmm, d, yyyy", "buy_account":"Purchase an original account", "gift_friends":"Gift features to friends", "donate":"Get extended features"};
goog.module.ModuleManager.getInstance().setLoaded("SupportChatangoModule");

