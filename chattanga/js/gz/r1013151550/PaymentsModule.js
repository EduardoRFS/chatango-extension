goog.provide("chatango.events.PaymentEvent");
goog.require("goog.events.Event");
chatango.events.PaymentEvent = function(type, opt_target) {
  goog.events.Event.call(this, type, opt_target);
};
goog.inherits(chatango.events.PaymentEvent, goog.events.Event);
chatango.events.PaymentEvent.EventType = {PAYMENT_METHOD_SELECTED:"payment_method_selected", BONUS_SELECTION_DIALOG_REQUEST:"bonus_selection_dialog_request", PREMIUM_PAYMENT_DIALOG_REQUEST:"premium_payment_dialog_request", UNUSED_ACCOUNT_SELECTION_DIALOG_REQUEST:"unused_account_selection_dialog_request", UNUSED_ACCOUNT_PAYMENT_DIALOG_REQUEST:"unused_account_payment_dialog_request", FINALIZE_GIFT_DIALOG_REQUEST:"finalize_gift_dialog_request", PAYPAL_FLOW_REQUEST:"paypal_flow_request", CREDIT_CARD_TRANSACTION_DIALOG_REQUEST:"credit_card_transaction_dialog_request", 
THANK_YOU_DIALOG_REQUEST:"thank_you_dialog_request"};
goog.provide("chatango.ui.ModifiableListController");
goog.require("chatango.managers.LanguageManager");
chatango.ui.ModifiableListController = function(model) {
  goog.events.EventTarget.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.model_ = model;
  this.name_ = null;
  this.remove_ = null;
};
goog.inherits(chatango.ui.ModifiableListController, goog.events.EventTarget);
chatango.ui.ModifiableListController.prototype.getModel = function() {
  return this.model_;
};
chatango.ui.ModifiableListController.prototype.addName = function(name) {
  this.name_ = name;
};
chatango.ui.ModifiableListController.prototype.onBackendResponse = function(e) {
};
chatango.ui.ModifiableListController.prototype.removeName = function(name) {
  this.removed_ = name;
};
chatango.ui.ModifiableListController.prototype.getRemoveName = function() {
  return this.removed_;
};
chatango.ui.ModifiableListController.prototype.onBackendResponseFailed = function(e) {
};
chatango.ui.ModifiableListController.prototype.setErrorMessage = function(msg) {
  this.errorMsg_ = msg;
};
chatango.ui.ModifiableListController.prototype.getErrorMessage = function() {
  return this.errorMsg_;
};
chatango.ui.ModifiableListController.prototype.getCurrentName = function() {
  return this.name_;
};
goog.provide("chatango.ui.ModifiableListDialog");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.ui.ModifiableListController");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.managers.Environment");
goog.require("chatango.events.EventType");
chatango.ui.ModifiableListDialog = function(controller, width, opt_domHelper) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.controller_ = controller;
  this.addingAllowed_ = true;
  this.addButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "add"));
  goog.events.listen(this.controller_, chatango.events.EventType.CONTROLLER_LIST_ADD_CONFIRMED, this.onAddConfirmed, false, this);
  goog.events.listen(this.controller_, chatango.events.EventType.CONTROLLER_ERROR_MESSAGE, this.showErrorPU, false, this);
  goog.events.listen(this.controller_, chatango.events.EventType.DISABLE_ADDING, function(e) {
    this.addingAllowed_ = false;
    this.addButton_.setEnabled(false);
  }, false, this);
  this.nameElementDict_ = Object();
  this.errorPU_ = null;
};
goog.inherits(chatango.ui.ModifiableListDialog, chatango.ui.ScrollableDialog);
chatango.ui.ModifiableListDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var scrollContent = this.getContentElement();
  this.listContentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.listContentEl_, "sdlg-sc");
  goog.dom.classes.add(this.listContentEl_, "content-dialog");
  goog.dom.append(scrollContent, this.listContentEl_);
};
chatango.ui.ModifiableListDialog.prototype.getInputRow = function() {
  if (this.inputRow_) {
    return this.inputRow_;
  }
  this.inputRow_ = goog.dom.createDom("div", {"style":"display: table;"});
  this.inputWrapperEl_ = goog.dom.createDom("div", {"style":"display: table-cell; width: 100%;"});
  goog.dom.append(this.inputRow_, this.inputWrapperEl_);
  var usernameStrId = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize() ? "name" : "username";
  this.input_ = goog.dom.createDom("input", {"id":"login-temp-name", "type":"text", "placeholder":this.lm_.getString("ui", usernameStrId), "style":"width: 100%; box-sizing: border-box;", "autocorrect":"off", "autocapitalize":"off"});
  goog.events.listen(new goog.events.KeyHandler(this.input_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey && this.addingAllowed_ && this.addButton_.isEnabled()) {
      this.onAddButtonClicked();
    }
  }, false, this);
  goog.dom.append(this.inputWrapperEl_, this.input_);
  this.buttonWrapperEl_ = goog.dom.createDom("div", {"style":"display: table-cell; overflow:hidden"});
  goog.dom.append(this.inputRow_, this.buttonWrapperEl_);
  this.addButton_.setEnabled(true);
  this.addButton_.render(this.buttonWrapperEl_);
  goog.events.listen(this.addButton_, goog.ui.Component.EventType.ACTION, this.onAddButtonClicked, false, this);
  return this.inputRow_;
};
chatango.ui.ModifiableListDialog.prototype.onAddButtonClicked = function() {
  var value = this.input_.value.toLowerCase();
  if (value == "") {
    return;
  }
  this.addButton_.setEnabled(false);
  this.controller_.addName(this.input_.value.toLowerCase());
};
chatango.ui.ModifiableListDialog.prototype.getController = function() {
  return this.controller_;
};
chatango.ui.ModifiableListDialog.prototype.createListing = function() {
  return null;
};
chatango.ui.ModifiableListDialog.prototype.showErrorPU = function() {
  this.addButton_.setEnabled(true);
  if (!this.errorPU_) {
    this.errorPU_ = new chatango.ui.ErrorDialog(this.getController().getErrorMessage());
    this.errorPU_.setVisible(true);
    this.errorPU_.setResizable(false);
    goog.events.listen(this.errorPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeErrorPU_, false, this);
  }
};
chatango.ui.ModifiableListDialog.prototype.closeErrorPU_ = function() {
  if (this.errorPU_) {
    this.errorPU_.dispose();
  }
  this.errorPU_ = null;
};
chatango.ui.ModifiableListDialog.prototype.onAddConfirmed = function() {
  this.input_.value = "";
  if (!chatango.managers.Environment.getInstance().isMobile()) {
    this.input_.focus();
  }
  var element = this.createListing();
  this.nameElementDict_[this.getController().getCurrentName()] = element;
  goog.dom.append(this.listContentEl_, element);
  this.scrollPane_.setScrollTop(element.offsetTop);
  this.scrollPane_.draw();
  if (this.addingAllowed_) {
    this.addButton_.setEnabled(true);
  }
};
chatango.ui.ModifiableListDialog.prototype.onRemoveConfirmed = function() {
  var removeName = this.getController().getRemoveName();
  goog.dom.removeNode(this.nameElementDict_[removeName]);
  this.addingAllowed_ = true;
  if (!this.addButton_.isEnabled()) {
    this.addButton_.setEnabled(true);
  }
};
chatango.ui.ModifiableListDialog.prototype.dispose = function() {
  this.closeErrorPU_();
  chatango.ui.ModifiableListDialog.superClass_.dispose.call(this);
};
goog.provide("chatango.payments.GifteeChecker");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.SubDomain");
goog.require("chatango.ui.ModifiableListController");
chatango.payments.GifteeChecker = function(transactionData) {
  chatango.ui.ModifiableListController.call(this, transactionData);
};
goog.inherits(chatango.payments.GifteeChecker, chatango.ui.ModifiableListController);
chatango.payments.GifteeChecker.prototype.addName = function(name) {
  if (this.getModel().containsGiftee(name)) {
    this.setErrorMessage(name + this.lm_.getString("payments", "already_added"));
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
  } else {
    var url = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/checkname";
    var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
    var fd = new FormData;
    fd.append("name", name);
    fd.append("nogroup", "placeholder");
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onBackendResponse, undefined, this);
    goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.onBackendResponseFailed, undefined, this);
    chatango.ui.ModifiableListController.prototype.addName.call(this, name);
    xhr.send(url, "POST", fd);
  }
};
chatango.payments.GifteeChecker.prototype.removeName = function(name) {
  chatango.ui.ModifiableListController.prototype.removeName.call(this, name);
  this.getModel().removeGiftee(name);
};
chatango.payments.GifteeChecker.prototype.onBackendResponse = function(e) {
  var response = e.currentTarget.getResponseText().split("&");
  var answer = Number(response[0].split("=")[1]);
  var name = response[1].split("=")[1];
  if (name == this.getCurrentName()) {
    if (answer) {
      this.getModel().addGiftee(name);
      if (this.getModel().getGifteesAllowed() == 0) {
        this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.DISABLE_ADDING));
      }
      var currentEvent = new chatango.events.Event(chatango.events.EventType.CONTROLLER_LIST_ADD_CONFIRMED);
      this.dispatchEvent(currentEvent);
    } else {
      this.setErrorMessage(this.getCurrentName() + this.lm_.getString("payments", "not_a_user"));
      this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
    }
  }
};
goog.provide("chatango.ui.icons.GiftIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.GiftIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.GiftIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.GiftIcon.prototype.draw = function() {
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + '<polygon fill="#0066CC" points="50.354,97.52 3.212,85.665 3.229,44.714 50.371,56.568 "/>' + '<polygon fill="#0099FF" points="97.505,85.182 50.363,97.539 50.38,56.577 97.522,44.22 "/>' + '<polygon fill="#0066FF" points="50.402,56.568 3.234,44.719 48.145,31.74 97.547,44.219 "/>' + '<polygon fill="#FFFFFF" points="27.001,91.726 18.564,89.597 18.581,48.559 27.018,50.774 "/>' + '<polygon fill="#FFFFFF" points="65.516,36.111 18.583,48.667 27.09,50.833 74.472,38.232 "/>' + 
  '<polygon fill="#FFFFFF" points="80.001,89.809 71.564,92.097 71.581,51.059 80.018,48.857 "/>' + '<polygon fill="#FFFFFF" points="80.167,48.917 31,36.667 22.583,39 71.7,51.104 "/>' + '<path fill="#F7C90D" d="M78.214,37.873c-2.141-2.816-4.553-2.338-9.356-1.388c-1.713,0.34-3.789,0.749-6.444,1.171' + " c2.341-2.89,3.507-6.991,3.621-10.401c0.137-4.104-1.124-7.438-3.459-9.148c-1.587-1.162-3.264-1.747-4.967-1.793" + " c-0.043-0.102-0.077-0.214-0.122-0.312c-1.647-3.604-4.441-5.48-7.861-5.274c-2.993,0.179-4.563,1.978-5.354,3.456" + 
  " c-0.804,1.503-1.159,3.425-1.21,5.56c-1.49-1.876-3.137-3.368-4.848-4.104c-2.606-1.122-5.123-0.467-7.085,1.841" + " c-1.413,1.662-1.993,3.685-1.677,5.851c0.341,2.34,1.788,4.685,3.681,6.847c-1.743,1.159-2.819,3.069-3.058,5.557" + " c-0.01,0.103-0.009,0.202-0.016,0.305c-1.015-0.762-2.112-1.703-3.141-2.587c-3.426-2.942-6.385-5.481-9.001-4.448" + " c-0.859,0.34-1.99,1.207-2.5,3.411c-0.657,2.847-0.149,5.424,1.469,7.455c7.517,9.429,39.56,4.275,43.188,3.657" + " c0.658-0.112,1.195-0.572,1.484-1.19c0.017-0.003,0.033-0.006,0.05-0.008c3.375-0.503,5.89-1,7.911-1.399" + 
  " c4.671-0.923,5.064-0.876,5.652-0.102c0.241,0.316,0.496,0.755,0.417,0.946c-0.294,0.718-1.93,1.479-2.444,1.489" + " c-1.094-0.161-2.104,0.71-2.256,1.945c-0.152,1.236,0.612,2.369,1.707,2.529c0.101,0.015,0.208,0.024,0.32,0.027" + " c1.807,0.061,4.953-1.313,6.168-3.823C79.52,43.035,80.313,40.63,78.214,37.873z M49.661,28.894" + " c0.385-2.285,2.272-5.421,4.633-7.023c0.688,4.293,0.064,9.784-1.121,13.771c-0.806-0.765-1.774-1.522-2.838-2.242" + " c-0.244-0.78-0.479-1.566-0.702-2.351C49.534,30.245,49.558,29.5,49.661,28.894z M48.274,16.884c0.227-0.425,0.573-0.825,1.56-0.884" + 
  " c0.137-0.008,0.279-0.012,0.424-0.007c0.832,0.027,1.778,0.343,2.601,1.618c-2.045,1.201-3.753,3.079-4.997,5.101" + " C47.563,20.181,47.631,18.085,48.274,16.884z M34.005,20.59c0.575-0.677,1.144-0.991,1.799-0.969c0.298,0.01,0.615,0.09,0.958,0.236" + " c2.694,1.159,5.751,5.917,7.468,10.385c-2.161-0.803-4.363-1.287-6.375-1.3c-2.369-2.205-4.181-4.488-4.458-6.38" + " C33.289,21.81,33.47,21.22,34.005,20.59z M42.919,38.296c-3.292,0-6.39-0.187-8.535-0.474c-0.293-0.44-0.399-0.95-0.333-1.637" + " c0.13-1.351,0.667-2.093,1.795-2.481c0.217-0.074,0.465-0.113,0.708-0.157C38.815,35.508,41.173,37.16,42.919,38.296z" + 
  " M19.869,36.838c-0.723-0.907-0.902-1.931-0.583-3.317c0.02-0.085,0.04-0.156,0.057-0.211c1.075,0.257,3.588,2.414,5.134,3.741" + " c1.419,1.218,2.795,2.401,4.124,3.313C24.506,39.763,21.316,38.652,19.869,36.838z M57.957,36.006" + " c-0.004,0.004-0.01,0.006-0.015,0.009c1.185-4.642,1.627-10.243,0.938-14.932c0.501,0.184,1,0.45,1.498,0.815" + ' c1.12,0.819,1.74,2.771,1.659,5.224C61.911,30.908,60.233,34.561,57.957,36.006z"/>' + "</svg>";
};
goog.provide("chatango.payments.FriendsSelectionDialog");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.payments.GifteeChecker");
goog.require("chatango.ui.ModifiableListDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.CloseButton");
goog.require("chatango.ui.icons.GiftIcon");
chatango.payments.FriendsSelectionDialog = function(transactionData, opt_domHelper) {
  transactionData.clearGifteeList();
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  var gifteeChecker = new chatango.payments.GifteeChecker(transactionData);
  chatango.ui.ModifiableListDialog.call(this, gifteeChecker, width, opt_domHelper);
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
};
goog.inherits(chatango.payments.FriendsSelectionDialog, chatango.ui.ModifiableListDialog);
chatango.payments.FriendsSelectionDialog.prototype.createDom = function() {
  chatango.ui.ModifiableListDialog.prototype.createDom.call(this);
  goog.dom.classes.add(this.getElement(), "friends-select");
  var content = this.getHeaderContentElement();
  this.showHeaderContentEl(true);
  this.showHeaderElBorder(true);
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.wrapperEl_ = goog.dom.createDom("div", {"class":"fsl-wrap"});
  var giftIcon = new chatango.ui.icons.GiftIcon;
  giftIcon.renderBefore(this.titleTextEl_);
  if (!chatango.managers.Environment.getInstance().isDesktop()) {
    goog.style.setStyle(giftIcon.getElement(), "vertical-align", "bottom");
  }
  goog.dom.classes.add(giftIcon.getElement(), "sb-icon");
  this.pitchWrapper_ = goog.dom.createDom("div", {"class":"fsl-pitch-wrap"});
  this.pitchTextEl_ = goog.dom.createDom("div", {"class":"fsl-pitch"});
  goog.dom.appendChild(this.pitchWrapper_, this.pitchTextEl_);
  goog.dom.appendChild(this.wrapperEl_, this.pitchWrapper_);
  goog.dom.append(content, this.wrapperEl_);
  var row = this.getInputRow();
  goog.dom.append(content, row);
};
chatango.payments.FriendsSelectionDialog.prototype.createListing = function() {
  var name = this.getController().getCurrentName();
  var gifteeListingEl = goog.dom.createDom("div", {"class":"mld-listing"});
  var gifteeListingNameEl = goog.dom.createDom("span", {"class":"mld-listing-name"}, name);
  var closeEl = goog.dom.createDom("span", {"class":"mld-listing-btn"});
  var closeIcon = new chatango.ui.buttons.CloseButton;
  closeIcon.render(closeEl);
  goog.dom.append(gifteeListingEl, gifteeListingNameEl);
  goog.dom.append(gifteeListingEl, closeEl);
  goog.events.listen(closeEl, goog.events.EventType.CLICK, function(e) {
    this.getController().removeName(name);
    this.onRemoveConfirmed();
  }, false, this);
  return gifteeListingEl;
};
chatango.payments.FriendsSelectionDialog.prototype.setTopText = function(text) {
  this.pitchTextEl_.innerHTML = text;
};
goog.provide("chatango.payments.TransactionData");
chatango.payments.TransactionData = function() {
  this.cost_ = 1.5;
  this.currencyIndex_ = 0;
  this.gifteeList_ = [];
};
chatango.payments.TransactionData.prototype.setCurrencyIndex = function(index) {
  if (this.currencyIndex_ != index) {
    if (this.currencyIsYen()) {
      this.cost_ = this.cost_ / 100;
    }
    this.currencyIndex_ = index;
    if (this.currencyIsYen()) {
      this.cost_ = this.cost_ * 100;
    }
  }
};
chatango.payments.TransactionData.prototype.getCurrencyIndex = function() {
  return this.currencyIndex_;
};
chatango.payments.TransactionData.prototype.getBackendCurrency = function() {
  return chatango.payments.TransactionData.BACKEND_CURRENCY_REPRESENTATION[this.currencyIndex_];
};
chatango.payments.TransactionData.prototype.getCurrencyText = function() {
  return chatango.payments.TransactionData.CURRENCY_SYMBOLS[this.currencyIndex_];
};
chatango.payments.TransactionData.prototype.currencyIsYen = function() {
  return this.currencyIndex_ == 2;
};
chatango.payments.TransactionData.prototype.convertYen_ = function(amount) {
  if (this.currencyIsYen()) {
    return Number(amount) * 100;
  }
  return Number(amount);
};
chatango.payments.TransactionData.prototype.setCost = function(cost) {
  if (typeof cost == "string") {
    this.cost_ = Number(cost);
  } else {
    if (typeof cost == "number") {
      this.cost_ = cost;
    }
  }
};
chatango.payments.TransactionData.prototype.getCost = function() {
  return this.cost_;
};
chatango.payments.TransactionData.prototype.canGiftFriends = function() {
  return this.getCost() >= this.convertYen_(chatango.payments.TransactionData.GIFT_FRIENDS_MINIMUM_COST);
};
chatango.payments.TransactionData.prototype.minimumGiftCostText = function() {
  return this.displayAmount_(this.convertYen_(chatango.payments.TransactionData.GIFT_FRIENDS_MINIMUM_COST));
};
chatango.payments.TransactionData.prototype.getCostText = function(opt_showCurrency) {
  return this.displayAmount_(this.cost_, false, opt_showCurrency);
};
chatango.payments.TransactionData.prototype.displayAmount_ = function(amount, displayInCents, opt_showCurrency) {
  var p;
  if (this.currencyIsYen()) {
    if (amount < 10) {
      p = 1;
    } else {
      if (amount < 100) {
        p = 2;
      } else {
        if (amount < 1E3) {
          p = 3;
        } else {
          if (amount < 1E4) {
            p = 4;
          } else {
            p = 5;
          }
        }
      }
    }
    var currencyText = opt_showCurrency !== false ? this.getCurrencyText() : "";
    return currencyText + Number(amount).toPrecision(p);
  }
  if (displayInCents) {
    var centAmount = amount * 100;
    if (centAmount < 10) {
      return Number(centAmount).toPrecision(1) + chatango.payments.TransactionData.CENTS[this.currencyIndex_].trim();
    } else {
      if (centAmount < 100) {
        return Number(centAmount).toPrecision(2) + chatango.payments.TransactionData.CENTS[this.currencyIndex_].trim();
      } else {
        return Number(centAmount).toPrecision(3) + chatango.payments.TransactionData.CENTS[this.currencyIndex_].trim();
      }
    }
  } else {
    if (amount == 0) {
      p = 3;
    } else {
      if (amount < 1) {
        p = 2;
      } else {
        if (amount < 10) {
          p = 3;
        } else {
          if (amount < 100) {
            p = 4;
          } else {
            p = 5;
          }
        }
      }
    }
  }
  var currencyText = opt_showCurrency !== false ? this.getCurrencyText() : "";
  return currencyText + Number(amount).toPrecision(p);
};
chatango.payments.TransactionData.prototype.getCurrencyDisplays = function() {
  var currencyDisplays = [];
  for (var j = 0;j < chatango.payments.TransactionData.CURRENCY_NAMES.length;j++) {
    currencyDisplays[j] = chatango.payments.TransactionData.CURRENCY_NAMES[j] + chatango.payments.TransactionData.CURRENCY_SYMBOLS[j];
  }
  return currencyDisplays;
};
chatango.payments.TransactionData.prototype.getCurrencyName = function() {
  return chatango.payments.TransactionData.CURRENCY_NAMES[this.currencyIndex_];
};
chatango.payments.TransactionData.prototype.getContributionAmounts = function() {
  if (this.currencyIsYen()) {
    return chatango.payments.TransactionData.CONTRIBUTION_AMOUNTS_YEN;
  }
  return chatango.payments.TransactionData.CONTRIBUTION_AMOUNTS;
};
chatango.payments.TransactionData.prototype.getPaymentMethod = function() {
  return this.paymentMethod_;
};
chatango.payments.TransactionData.prototype.setPaymentMethod = function(method) {
  this.paymentMethod_ = method;
};
chatango.payments.TransactionData.prototype.hasGifteeList = function() {
  return this.gifteeList_.length > 0;
};
chatango.payments.TransactionData.prototype.containsGiftee = function(name) {
  return this.gifteeList_.indexOf(name) != -1;
};
chatango.payments.TransactionData.prototype.addGiftee = function(name) {
  this.gifteeList_.push(name);
};
chatango.payments.TransactionData.prototype.clearGifteeList = function() {
  this.gifteeList_ = [];
};
chatango.payments.TransactionData.prototype.removeGiftee = function(name) {
  var index = this.gifteeList_.indexOf(name);
  if (index != -1) {
    this.gifteeList_.splice(index, 1);
    return true;
  }
  return false;
};
chatango.payments.TransactionData.prototype.isFriendsOnly = function() {
  return 0;
};
chatango.payments.TransactionData.prototype.setRateLimitInfo = function(info) {
  this.rateLimitInfo_ = info;
};
chatango.payments.TransactionData.prototype.getRateLimitInfo = function() {
  return this.rateLimitInfo_;
};
chatango.payments.TransactionData.prototype.getGifteeListString = function() {
  var gifteeRepresentation = "";
  var baseAmount = "";
  for (var i = 0;i < this.gifteeList_.length;i++) {
    var comment = "";
    var gifteeString = this.gifteeList_[i] + ":" + baseAmount + ":" + comment;
    gifteeRepresentation += gifteeString;
    if (i < this.gifteeList_.length - 1) {
      gifteeRepresentation += ";";
    }
  }
  return gifteeRepresentation;
};
chatango.payments.TransactionData.prototype.getTotalGifteesAllowed = function() {
  if (this.currencyIsYen()) {
    return chatango.payments.TransactionData.GIFTEE_COUNTS_YEN[this.cost_];
  } else {
    return chatango.payments.TransactionData.GIFTEE_COUNTS_YEN[Number(this.cost_ * 100)];
  }
};
chatango.payments.TransactionData.prototype.getGifteesAllowed = function() {
  return this.getTotalGifteesAllowed() - this.gifteeList_.length;
};
chatango.payments.TransactionData.prototype.getGifteeCount = function() {
  return this.gifteeList_.length;
};
chatango.payments.TransactionData.prototype.getContributionIndex = function() {
  var costText = this.getCostText();
  if (this.currencyIsYen()) {
    return chatango.payments.TransactionData.CONTRIBUTION_AMOUNTS_YEN.indexOf(costText.substring(1));
  }
  return chatango.payments.TransactionData.CONTRIBUTION_AMOUNTS.indexOf(costText.substring(1));
};
chatango.payments.TransactionData.BACKEND_CURRENCY_REPRESENTATION = ["USD", "GBP", "JPY", "EUR"];
chatango.payments.TransactionData.CENTS = [" \u00a2  ", "p", "", "\u00a2   "];
chatango.payments.TransactionData.GIFTEE_COUNTS_YEN = {300:"2", 500:"4", 1E3:"13", 2E3:"29"};
chatango.payments.TransactionData.CURRENCY_SYMBOLS = ["$", "\u00a3", "\u00a5", "\u20ac"];
chatango.payments.TransactionData.GIFT_FRIENDS_MINIMUM_COST = "3.00";
chatango.payments.TransactionData.CURRENCY_BACKEND_REPRESENTATION = ["us", "gb", "jap", "eu"];
chatango.payments.TransactionData.CURRENCY_NAMES = ["U.S. ", "U.K. ", "JPY ", "EUR "];
chatango.payments.TransactionData.CONTRIBUTION_AMOUNTS = ["0.95", "1.50", "3.00", "5.00", "10.00", "20.00"];
chatango.payments.TransactionData.CONTRIBUTION_AMOUNTS_YEN = ["95", "150", "300", "500", "1000", "2000"];
goog.provide("chatango.payments.GiftSelectionDialog");
goog.require("chatango.payments.FriendsSelectionDialog");
goog.require("chatango.payments.TransactionData");
goog.require("chatango.ui.Select");
chatango.payments.GiftSelectionDialog = function(transactionData, opt_domHelper) {
  this.transactionData_ = transactionData;
  chatango.payments.FriendsSelectionDialog.call(this, transactionData, opt_domHelper);
  var titleStrId = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize() ? "gift" : "give_to_friends";
  this.setTitle(this.lm_.getString("payments", titleStrId));
};
goog.inherits(chatango.payments.GiftSelectionDialog, chatango.payments.FriendsSelectionDialog);
chatango.payments.GiftSelectionDialog.prototype.createDom = function() {
  chatango.payments.GiftSelectionDialog.superClass_.createDom.call(this);
  var footerContent = this.getFooterContentElement();
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  this.buttonsContainer_ = goog.dom.createDom("div", {"class":"gift-btns"});
  this.totalTitleTextEl_ = goog.dom.createDom("div", {"class":"gift-total-title"});
  goog.dom.append(this.buttonsContainer_, this.totalTitleTextEl_);
  this.currencySelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  var currencyDisplays = this.transactionData_.getCurrencyDisplays();
  for (var i = 0;i < currencyDisplays.length;i++) {
    this.currencySelect_.addItem(new goog.ui.MenuItem(currencyDisplays[i], i));
  }
  this.currencySelect_.setValue(this.transactionData_.getCurrencyIndex());
  goog.events.listen(this.currencySelect_, goog.ui.Component.EventType.ACTION, this.onCurrencyChange_, false, this);
  this.currencyWrap_ = goog.dom.createDom("div", {"class":"gift-currency-wrap"});
  this.currencySelect_.render(this.currencyWrap_);
  goog.dom.append(this.buttonsContainer_, this.currencyWrap_);
  this.totalMessageTextEl_ = goog.dom.createDom("div", {"class":"gift-total"});
  goog.dom.append(this.buttonsContainer_, this.totalMessageTextEl_);
  this.continueButtonWrapperEl_ = goog.dom.createDom("div", {"class":"gift-cont-btn"});
  this.continueButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "next"));
  this.continueButton_.setEnabled(false);
  this.continueButton_.render(this.continueButtonWrapperEl_);
  goog.events.listen(this.continueButton_, goog.ui.Component.EventType.ACTION, this.onContinueButtonClicked_, false, this);
  goog.dom.append(this.buttonsContainer_, this.continueButtonWrapperEl_);
  this.bottomMessageTextEl_ = goog.dom.createDom("div", {"class":"gift-bottom-msg"});
  goog.dom.append(footerContent, this.bottomMessageTextEl_);
  goog.dom.append(footerContent, this.buttonsContainer_);
  this.updateCopy();
};
chatango.payments.GiftSelectionDialog.prototype.onContinueButtonClicked_ = function() {
  var type = chatango.events.PaymentEvent.EventType.FINALIZE_GIFT_DIALOG_REQUEST;
  this.dispatchEvent(new chatango.events.PaymentEvent(type));
};
chatango.payments.GiftSelectionDialog.prototype.onCurrencyChange_ = function() {
  var currencyIndex = this.currencySelect_.getValue();
  this.transactionData_.setCurrencyIndex(currencyIndex);
  this.updateFooterText_();
};
chatango.payments.GiftSelectionDialog.prototype.onAddConfirmed = function() {
  chatango.ui.ModifiableListDialog.prototype.onAddConfirmed.call(this);
  this.updateFooterText_();
  this.continueButton_.setEnabled(true);
};
chatango.payments.GiftSelectionDialog.prototype.onRemoveConfirmed = function(opt_name) {
  chatango.ui.ModifiableListDialog.prototype.onRemoveConfirmed.call(this);
  this.updateFooterText_();
  if (!this.transactionData_.hasGifteeList()) {
    this.continueButton_.setEnabled(false);
  }
};
chatango.payments.GiftSelectionDialog.prototype.updateFooterText_ = function() {
  this.totalTitleTextEl_.innerHTML = this.lm_.getString("payments", "total");
  this.totalMessageTextEl_.innerHTML = this.transactionData_.getCostText(false);
  if (this.transactionData_.getCost() == 0) {
    this.bottomMessageTextEl_.innerHTML = "";
  } else {
    var amtStr = this.transactionData_.getCostPerGifteeText() + this.lm_.getString("payments", "per_friend");
    if (!chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize()) {
      amtStr = amtStr + this.lm_.getString("payments", "you_save") + this.transactionData_.getTotalSavingsText();
    }
    this.bottomMessageTextEl_.innerHTML = amtStr;
  }
  this.setHeight();
};
chatango.payments.GiftSelectionDialog.prototype.updateCopy = function() {
  if (chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize()) {
    goog.style.setStyle(this.wrapperEl_, "display", "none");
    goog.style.setStyle(this.headerContentEl_, "padding-top", 0);
    goog.style.setStyle(this.bottomMessageTextEl_, "font-size", ".9em");
    goog.style.setStyle(this.totalTitleTextEl_, "font-size", ".9em");
    goog.style.setStyle(this.totalTitleTextEl_, "margin-top", "0.2em");
    goog.style.setStyle(this.currencyWrap_, "font-size", ".9em");
    goog.style.setStyle(this.currencyWrap_, "margin-top", "0.2em");
    goog.style.setStyle(this.totalMessageTextEl_, "font-size", ".9em");
    goog.style.setStyle(this.totalMessageTextEl_, "margin-top", "0.2em");
  } else {
    goog.style.setStyle(this.wrapperEl_, "display", "block");
    this.setTopText(this.lm_.getString("payments", "give_friends_features"));
  }
  var titleStrId = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize() ? "gift" : "give_to_friends";
  this.setTitle(this.lm_.getString("payments", titleStrId));
  this.updateFooterText_();
};
goog.provide("chatango.payments.GiftTransactionData");
goog.require("chatango.payments.TransactionData");
chatango.payments.GiftTransactionData = function() {
  chatango.payments.TransactionData.call(this);
  this.cost_ = 0;
  this.costPerGiftee_ = 0;
};
goog.inherits(chatango.payments.GiftTransactionData, chatango.payments.TransactionData);
chatango.payments.GiftTransactionData.prototype.addGiftee = function(name) {
  chatango.payments.TransactionData.prototype.addGiftee.call(this, name);
  this.updateGiftCost_();
};
chatango.payments.GiftTransactionData.prototype.isFriendsOnly = function() {
  return 1;
};
chatango.payments.GiftTransactionData.prototype.removeGiftee = function(name) {
  var success = chatango.payments.TransactionData.prototype.removeGiftee.call(this, name);
  this.updateGiftCost_();
  return success;
};
chatango.payments.GiftTransactionData.prototype.updateGiftCost_ = function() {
  var gifteeCount = this.gifteeList_.length;
  if (gifteeCount == 0) {
    this.cost_ = 0;
    this.costPerGiftee_ = 0;
  } else {
    if (gifteeCount >= 11) {
      this.costPerGiftee_ = this.convertYen_(chatango.payments.GiftTransactionData.PER_GIFTEE_MINIMUM_COST);
      this.cost_ = this.costPerGiftee_ * gifteeCount;
    } else {
      var defaultCost = this.convertYen_(chatango.payments.GiftTransactionData.PER_GIFTEE_DEFAULT_COST);
      var discount = this.convertYen_(chatango.payments.GiftTransactionData.PER_GIFTEE_DISCOUNT);
      var savingsPerGiftee = (gifteeCount - 1) * discount;
      this.costPerGiftee_ = defaultCost - savingsPerGiftee;
      this.cost_ = gifteeCount * this.costPerGiftee_;
    }
  }
};
chatango.payments.TransactionData.prototype.setCurrencyIndex = function(index) {
  if (this.currencyIndex_ != index) {
    if (this.currencyIsYen()) {
      this.costPerGiftee_ = this.costPerGiftee_ / 100;
      this.cost_ = this.cost_ / 100;
    }
    this.currencyIndex_ = index;
    if (this.currencyIsYen()) {
      this.costPerGiftee_ = this.costPerGiftee_ * 100;
      this.cost_ = this.cost_ * 100;
    }
  }
};
chatango.payments.GiftTransactionData.prototype.getCostPerGifteeText = function() {
  return this.displayAmount_(this.costPerGiftee_, true);
};
chatango.payments.GiftTransactionData.prototype.getTotalSavingsText = function() {
  var defaultCost = this.convertYen_(chatango.payments.GiftTransactionData.PER_GIFTEE_DEFAULT_COST);
  var savings = this.gifteeList_.length * defaultCost - this.cost_;
  return this.displayAmount_(savings, savings < 1);
};
chatango.payments.GiftTransactionData.PER_GIFTEE_MINIMUM_COST = .65;
chatango.payments.GiftTransactionData.PER_GIFTEE_DEFAULT_COST = .95;
chatango.payments.GiftTransactionData.PER_GIFTEE_DISCOUNT = .03;
goog.provide("chatango.ui.icons.SvgLockIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgLockIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.color_ = opt_color || "#FFCC00";
};
goog.inherits(chatango.ui.icons.SvgLockIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgLockIcon.prototype.draw = function() {
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<g style="display: block;">' + '<path stroke="none" fill="' + this.color_ + '" d="M15.15 99.4 L15.15 50.25 82.6 50.25 82.6 99.4 15.15 99.4"/>' + '<path stroke="none" fill="' + this.color_ + '" d="M56.9 15.4 Q53.9 11.3 48.35 11.3 43 11.3 39.55 15.4 36.4 19.2 36.4 26.4 L36.4 58.6 24.8 58.6 24.8 26.4 Q24.8 13.7 31 6.8 37.1 0 48.35 0 53.55 0 57.65 1.7 62.1 3.45 65.25 6.8 68.3 10.25 70 15 71.75 19.85 71.75 26.4 L71.75 58.6 60.1 58.6 60.1 26.4 Q60.1 19.55 56.9 15.4"/>' + 
  "</g>" + "</svg>";
  goog.dom.classes.add(this.element_, "lock-icon");
};
goog.provide("chatango.payments.CreditCardUtil");
chatango.payments.CreditCardUtil = function() {
  this.cardType_ = null;
};
chatango.payments.CreditCardUtil.prototype.predictType = function(cardNumber) {
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.VISA_PREDICT, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.VISA;
  }
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.MASTERCARD_PREDICT, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.MASTERCARD;
  }
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.AMERICAN_EXPRESS_PREDICT, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.AMERICAN_EXPRESS;
  }
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.DISCOVER_PREDICT, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.DISCOVER;
  }
  return null;
};
chatango.payments.CreditCardUtil.prototype.getCardImageSource = function(cardType) {
  switch(cardType) {
    case chatango.payments.CreditCardUtil.CardType.VISA:
      return chatango.payments.CreditCardUtil.Images.VISA;
    case chatango.payments.CreditCardUtil.CardType.MASTERCARD:
      return chatango.payments.CreditCardUtil.Images.MASTERCARD;
    case chatango.payments.CreditCardUtil.CardType.AMERICAN_EXPRESS:
      return chatango.payments.CreditCardUtil.Images.AMEX;
    case chatango.payments.CreditCardUtil.CardType.DISCOVER:
      return chatango.payments.CreditCardUtil.Images.DISCOVER;
  }
};
chatango.payments.CreditCardUtil.prototype.confirmType = function(cardNumber) {
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.VISA, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.VISA;
  }
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.MASTERCARD, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.MASTERCARD;
  }
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.AMERICAN_EXPRESS, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.AMERICAN_EXPRESS;
  }
  if (this.match_(chatango.payments.CreditCardUtil.RegExps.DISCOVER, cardNumber)) {
    return chatango.payments.CreditCardUtil.CardType.DISCOVER;
  }
  return null;
};
chatango.payments.CreditCardUtil.prototype.match_ = function(cardRegExp, cardNumber) {
  var expression = new RegExp(cardRegExp);
  return expression.test(cardNumber);
};
chatango.payments.CreditCardUtil.RegExps = {"VISA":"^4[0-9]{12}(?:[0-9]{3})?$", "MASTERCARD":"^5[1-5][0-9]{14}$", "AMERICAN_EXPRESS":"^3[47][0-9]{13}$", "DISCOVER":"^6(?:011|5[0-9]{2})[0-9]{12}$", "VISA_PREDICT":"^4[0-9]{0,16}$", "MASTERCARD_PREDICT":"^5$|^5[1-5][0-9]{0,14}$", "AMERICAN_EXPRESS_PREDICT":"^3$|^3[47][0-9]{0,13}$", "DISCOVER_PREDICT":"^6$|^60$|^601$|^6(?:011|5[0-9]{0,2})[0-9]{0,12}$"};
chatango.payments.CreditCardUtil.Images = {"VISA":"/images/creditcards/cc_visa.jpg", "MASTERCARD":"/images/creditcards/cc_mastercard.jpg", "AMEX":"/images/creditcards/cc_amex.jpg", "DISCOVER":"/images/creditcards/cc_discover.jpg", "LOCK":"/images/creditcards/lock.png", "PAYPAL":"https://www.paypalobjects.com/webstatic/en_US/logo/pp_cc_mark_74x46.png"};
chatango.payments.CreditCardUtil.CardType = {VISA:"Visa", MASTERCARD:"MasterCard", AMERICAN_EXPRESS:"Amex", DISCOVER:"Discover"};
goog.provide("chatango.payments.PaymentProcessor");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.settings.servers.SubDomain");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.events.EventTarget");
chatango.payments.PaymentProcessor = function() {
  goog.events.EventTarget.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.dm_ = chatango.managers.DateManager.getInstance();
};
goog.inherits(chatango.payments.PaymentProcessor, goog.events.EventTarget);
chatango.payments.PaymentProcessor.prototype.beginTransaction = function(paymentType, transactionData, opt_firstName, opt_lastName, opt_cvv, opt_cardNumber, opt_cardType, opt_expiration) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var subDomain = chatango.settings.servers.SubDomain.getInstance();
  var url = subDomain.getSecureDomain() + "/submit";
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
  var fd = new FormData;
  switch(paymentType) {
    case chatango.payments.PaymentProcessor.PaymentType.PAY_PAL:
      fd.append("action", "ppexpressset");
      goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onBackendResponse, undefined, this);
      break;
    case chatango.payments.PaymentProcessor.PaymentType.CREDIT_CARD:
    ;
    default:
      fd.append("action", "ppdirect");
      fd.append("token", currentUser.getToken());
      fd.append("first", opt_firstName);
      fd.append("last", opt_lastName);
      fd.append("type", opt_cardType);
      fd.append("exp", opt_expiration);
      fd.append("acct", opt_cardNumber);
      fd.append("cvv2", opt_cvv);
      goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onBackendResponse, undefined, this);
      break;
  }
  fd.append("handle", currentUser.getSid());
  fd.append("device", chatango.managers.Environment.getInstance().getDeviceType());
  fd.append("uas", goog.userAgent.getUserAgentString());
  var groupHandle = currentUser.getSid();
  if (chatango.group.GroupInfo) {
    groupHandle = chatango.managers.ManagerManager.getInstance().getManager(chatango.group.GroupInfo.ManagerType).getGroupHandle();
  }
  fd.append("group", groupHandle);
  fd.append("amt", transactionData.getCost());
  fd.append("currency", transactionData.getBackendCurrency());
  if (transactionData.hasGifteeList()) {
    fd.append("friendsorder", (new Date).getTime());
    fd.append("friendsonly", transactionData.isFriendsOnly());
    fd.append("list", transactionData.getGifteeListString());
  }
  if (transactionData instanceof chatango.payments.UnusedAccountTransactionData) {
    fd.append("accountlist", transactionData.getAccountsString());
  }
  goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.onBackendResponseFailed, undefined, this);
  xhr.send(url, "POST", fd);
};
chatango.payments.PaymentProcessor.prototype.setErrorMessage = function(message) {
  this.error_ = message;
};
chatango.payments.PaymentProcessor.prototype.getErrorMessage = function() {
  return this.error_;
};
chatango.payments.PaymentProcessor.prototype.getRateLimitInfo = function() {
  return this.rateLimitInfo_;
};
chatango.payments.PaymentProcessor.prototype.onBackendResponse = function(e) {
  var response = e.currentTarget.getResponseText().split("=");
  if (response[0] == chatango.payments.PaymentProcessor.SUCCESS) {
    if (response.length > 1) {
      this.rateLimitInfo_ = response[1];
    }
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CREDIT_CARD_TRANSACTION_COMPLETE));
  } else {
    if (response[0] == chatango.payments.PaymentProcessor.REDIRECT) {
      var redirect_url = decodeURIComponent(response[1]);
      this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.PAY_PAL_REDIRECT, null, null, redirect_url));
    } else {
      if (response[0] == chatango.payments.PaymentProcessor.ERRORMSG) {
        this.setErrorMessage(response[1]);
        this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CREDIT_CARD_ERROR));
      } else {
        if (response[0] == chatango.payments.PaymentProcessor.UNUSEDACCOUNT_ERRORS) {
          var accounts_array = response[1].split(":");
          var accountSeen = false;
          var emailSeen = false;
          for (var i = 0;i < accounts_array.length;i++) {
            if (accounts_array[i].indexOf("@") > 0) {
              emailSeen = true;
            } else {
              accountSeen = true;
            }
          }
          var key;
          if (accountSeen && emailSeen) {
            key = "accounts_and_emails_unavailable";
          } else {
            if (accountSeen) {
              key = "accounts_unavailable";
            } else {
              if (emailSeen) {
                key = "emails_unavailable";
              }
            }
          }
          var error_msg = this.lm_.getString("payments", key) + " " + accounts_array.join(", ");
          this.dispatchGenericError(error_msg);
        } else {
          if (response[0] == chatango.payments.PaymentProcessor.UNUSEDACCOUNT_EMAIL_ERRORS) {
            var emails_array = response[1].split(":");
            var error_msg = this.lm_.getString("payments", "emails_unavailable_during_payment");
            var base_domain = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
            error_msg = error_msg.split("*open_link*").join("<a href = 'http://" + base_domain + "/help?help_unused_account_issue' target='_blank'><u>");
            error_msg = error_msg.split("*close_link*").join("</u></a>");
            error_msg = error_msg.split("*accs*").join("<br/>" + emails_array.join(", ") + "<br/>");
            this.setErrorMessage(error_msg);
            this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CREDIT_CARD_TRANSACTION_COMPLETE_ERROR));
          } else {
            if (response[0] == chatango.payments.PaymentProcessor.ERRORS) {
              var error_num = response[1].split(":")[0];
              var error_string_key = "error_" + error_num;
              var error_msg = this.lm_.getString("payments", error_string_key);
              if (error_num.indexOf("203") == 0) {
                var error_data = error_num.split(";");
                error_num = "203";
                error_string_key = "error_" + error_num;
                error_msg = this.lm_.getString("payments", error_string_key);
                error_msg = error_msg.split("*max_payments*").join(error_data[1]);
                error_msg = error_msg.split("*num_days*").join(error_data[2]);
                error_date = new Date(Number(error_data[3]) * 1E3);
                error_msg = error_msg.split("*date*").join(this.dm_.dateToString(error_date, this.lm_.getString("payments", "error_date_format")));
              }
              if (Number(error_num) > 200) {
                this.dispatchGenericError(error_msg);
                return;
              }
              this.setErrorMessage(error_msg);
              this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CREDIT_CARD_ERROR));
            }
          }
        }
      }
    }
  }
};
chatango.payments.PaymentProcessor.prototype.dispatchGenericError = function(error_msg) {
  var base_domain = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  error_msg = error_msg.split("*open_feedback_link*").join("<a href = 'http://" + base_domain + "/help?help_payment'><u>");
  error_msg = error_msg.split("*close_feedback_link*").join("</u></a>");
  error_msg = error_msg.split("*br*").join("<br>");
  error_msg = error_msg.split("*b*").join("<b>");
  error_msg = error_msg.split("*/b*").join("</b>");
  this.setErrorMessage(error_msg);
  this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CREDIT_CARD_ERROR));
};
chatango.payments.PaymentProcessor.prototype.onBackendResponseFailed = function(e) {
  this.dispatchGenericError(this.lm_.getString("payments", "generic_payment_error"));
};
chatango.payments.PaymentProcessor.SUCCESS = "success";
chatango.payments.PaymentProcessor.REDIRECT = "redirect";
chatango.payments.PaymentProcessor.ERRORMSG = "errormsg";
chatango.payments.PaymentProcessor.UNUSEDACCOUNT_ERRORS = "nerror1";
chatango.payments.PaymentProcessor.UNUSEDACCOUNT_EMAIL_ERRORS = "nerror2";
chatango.payments.PaymentProcessor.ERRORS = "errors";
chatango.payments.PaymentProcessor.PaymentType = {"CREDIT_CARD":"creditcard", "PAY_PAL":"paypal"};
goog.provide("chatango.payments.CreditCardTransactionDialog");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.payments.PaymentProcessor");
goog.require("chatango.payments.CreditCardUtil");
goog.require("chatango.ui.icons.SvgLockIcon");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.Select");
chatango.payments.CreditCardTransactionDialog = function(transactionData, opt_domHelper) {
  this.PaymentProcessor_ = new chatango.payments.PaymentProcessor;
  goog.events.listen(this.PaymentProcessor_, chatango.events.EventType.CREDIT_CARD_ERROR, this.showErrorPU, false, this);
  goog.events.listen(this.PaymentProcessor_, chatango.events.EventType.CREDIT_CARD_TRANSACTION_COMPLETE, this.onTransactionComplete, false, this);
  goog.events.listen(this.PaymentProcessor_, chatango.events.EventType.CREDIT_CARD_TRANSACTION_COMPLETE_ERROR, this.onTransactionCompleteError, false, this);
  this.transactionData_ = transactionData;
  this.creditCardUtil_ = new chatango.payments.CreditCardUtil;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("payments", "secure_transaction"));
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
};
goog.inherits(chatango.payments.CreditCardTransactionDialog, chatango.ui.ScrollableDialog);
chatango.payments.CreditCardTransactionDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  var formTable = goog.dom.createDom("div", {"class":"transaction-table"});
  var firstNameRow = goog.dom.createDom("div");
  this.firstNameInputWrapperEl_ = goog.dom.createDom("div");
  this.firstNameInput_ = goog.dom.createDom("input", {"type":"text", "placeholder":this.lm_.getString("payments", "firstname"), "style":"width:90%; max-width:12em;"});
  goog.dom.append(this.firstNameInputWrapperEl_, this.firstNameInput_);
  goog.dom.append(firstNameRow, this.firstNameInputWrapperEl_);
  goog.dom.append(formTable, firstNameRow);
  var lastNameRow = goog.dom.createDom("div");
  this.lastNameInputWrapperEl_ = goog.dom.createDom("div");
  this.lastNameInput_ = goog.dom.createDom("input", {"type":"text", "placeholder":this.lm_.getString("payments", "lastname"), "style":"width:90%; max-width:12em;"});
  goog.dom.append(this.lastNameInputWrapperEl_, this.lastNameInput_);
  goog.dom.append(lastNameRow, this.lastNameInputWrapperEl_);
  goog.dom.append(formTable, lastNameRow);
  var cardRow = goog.dom.createDom("div");
  var numericInputType = chatango.managers.Environment.getInstance().isIOS() ? "tel" : goog.userAgent.GECKO && chatango.managers.Environment.getInstance().isDesktop() ? "text" : "number";
  this.cardNumberInputWrapperEl_ = goog.dom.createDom("div");
  var cardNumPlaceholderStrId = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize() ? "cardnumber_sm" : "cardnumber";
  this.cardNumberInput_ = goog.dom.createDom("input", {"type":numericInputType, "placeholder":this.lm_.getString("payments", cardNumPlaceholderStrId), "style":"width:90%; max-width:12em;"});
  goog.events.listen(this.cardNumberInput_, goog.events.EventType.KEYUP, function(e) {
    var maxChars = 19;
    if (this.cardNumberInput_.value.length > maxChars) {
      this.cardNumberInput_.value = this.cardNumberInput_.value.substring(0, maxChars);
    }
    this.cardNumberInput_.value = this.cardNumberInput_.value.replace(/\D/g, "");
    if (e.keyCode === 88 || e.keyCode === 86 || e.keyCode === 8 || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
      this.cardNumberChanged();
    }
  }, false, this);
  this.cardImageWrapperEl_ = goog.dom.createDom("div", {"class":"transaction-card-img"});
  goog.dom.append(this.cardNumberInputWrapperEl_, this.cardNumberInput_);
  goog.dom.append(this.cardNumberInputWrapperEl_, this.cardImageWrapperEl_);
  goog.dom.append(cardRow, this.cardNumberInputWrapperEl_);
  goog.dom.append(formTable, cardRow);
  this.expiresWrapperEl_ = goog.dom.createDom("div");
  this.expiresTextEl_ = goog.dom.createDom("td", null, this.lm_.getString("payments", "expires"));
  goog.dom.append(this.expiresWrapperEl_, this.expiresTextEl_);
  this.expiresMenuWrapperEl_ = goog.dom.createDom("td", {"style":"width: 100%"});
  var i;
  var expirationMonthCell = goog.dom.createDom("span", {"style":"margin-right: 0.4em; margin-top: 0.4em; display: inline-block;"});
  this.expirationMonthSelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  for (i = 0;i < chatango.payments.CreditCardTransactionDialog.EXPIRATION_MONTHS.length;i++) {
    this.expirationMonthSelect_.addItem(new goog.ui.MenuItem(chatango.payments.CreditCardTransactionDialog.EXPIRATION_MONTHS[i], i));
  }
  this.expirationMonthSelect_.setValue(0);
  this.expirationMonthSelect_.render(expirationMonthCell);
  goog.dom.append(this.expiresMenuWrapperEl_, expirationMonthCell);
  var currentYear = Number((new Date).getFullYear());
  var expirationYearCell = goog.dom.createDom("span", {"style":"margin-top: 0.4em; margin-bottom: 0.4em; display: inline-block;"});
  this.expirationYearSelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  for (i = 0;i < chatango.payments.CreditCardTransactionDialog.EXPIRATION_YEARS_TO_DISPLAY;i++) {
    this.expirationYearSelect_.addItem(new goog.ui.MenuItem((currentYear + i).toString(), i));
  }
  this.expirationYearSelect_.setValue(0);
  this.expirationYearSelect_.render(expirationYearCell);
  goog.dom.append(this.expiresMenuWrapperEl_, expirationYearCell);
  goog.dom.append(this.expiresWrapperEl_, this.expiresMenuWrapperEl_);
  goog.dom.append(formTable, this.expiresWrapperEl_);
  this.cvvWrapperEl_ = goog.dom.createDom("div");
  this.cvvInputWrapperEl_ = goog.dom.createDom("td", {"colspan":"2"});
  this.cvvInput_ = goog.dom.createDom("input", {"type":numericInputType, "size":"4", "min":"1", "max":"9999", "placeholder":this.lm_.getString("payments", "cvvnumber")});
  goog.events.listen(this.cvvInput_, goog.events.EventType.KEYUP, function(e) {
    var maxChars = 4;
    if (this.cvvInput_.value.length > maxChars) {
      this.cvvInput_.value = this.cvvInput_.value.substring(0, maxChars);
    }
    this.cvvInput_.value = this.cvvInput_.value.replace(/\D/g, "");
  }, false, this);
  goog.dom.append(this.cvvInputWrapperEl_, this.cvvInput_);
  this.cvvExplanationEl_ = goog.dom.createDom("div", {"class":"pymt-footnote"});
  var cvvExplanation = this.lm_.getString("payments", "cvv_tooltip");
  cvvExplanation = cvvExplanation.split("*br*").join("<br />").split("*b*").join("<b>").split("*/b*").join("</b>");
  this.cvvExplanationEl_.innerHTML = cvvExplanation;
  var cvvHelper = goog.dom.createDom("span", {"class":"cvv-helper"}, "(?) ");
  var ev = chatango.managers.Environment.getInstance().isDesktop() ? goog.events.EventType.CLICK : goog.events.EventType.TOUCHEND;
  goog.events.listen(cvvHelper, ev, function() {
    goog.style.showElement(this.cvvExplanationEl_, !goog.style.isElementShown(this.cvvExplanationEl_));
  }, false, this);
  goog.dom.append(this.cvvInputWrapperEl_, cvvHelper);
  this.cvvExplanationEl_.style.display = "none";
  goog.dom.append(this.cvvInputWrapperEl_, this.cvvExplanationEl_);
  goog.dom.append(this.cvvWrapperEl_, this.cvvInputWrapperEl_);
  goog.dom.append(formTable, this.cvvWrapperEl_);
  goog.dom.append(content, formTable);
  this.buttonWrapperEl_ = goog.dom.createDom("div", {"class":"cc-dlg-btn-wrap"});
  if (!chatango.managers.ScaleManager.getInstance().isBelowMediumWidth()) {
    this.processingEl_ = goog.dom.createDom("div", {"style":"display: inline-block; vertical-align: middle; padding; margin-right: .3em;"});
    goog.dom.append(this.buttonWrapperEl_, this.processingEl_);
  }
  var lockIcon = new chatango.ui.icons.SvgLockIcon;
  lockIcon.render(this.buttonWrapperEl_);
  lockIcon.getElement().title = this.lm_.getString("payments", "protected_with_ssl");
  this.button_ = new chatango.ui.buttons.Button(this.lm_.getString("payments", "pay") + this.transactionData_.getCostText());
  this.button_.render(this.buttonWrapperEl_);
  goog.events.listen(this.button_, goog.ui.Component.EventType.ACTION, this.proceedWithPay_, false, this);
  if (chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize()) {
    goog.style.setStyle(lockIcon.getElement(), "width", "1.2em");
    goog.style.setStyle(this.button_.getElement(), "margin-right", ".1em");
  }
  goog.dom.append(content, this.buttonWrapperEl_);
};
chatango.payments.CreditCardTransactionDialog.prototype.startProcessingAnim_ = function() {
  if (!this.processingEl_) {
    return;
  }
  this.processingCount_ = 0;
  this.animateProcessing_();
};
chatango.payments.CreditCardTransactionDialog.prototype.animateProcessing_ = function() {
  this.processingCount_++;
  var pos = 4 - this.processingCount_ % 4;
  var str = "Processing....";
  var spanStr = '<span style="color:#FFF;">';
  var index = str.length - pos;
  str = str.substring(0, index) + spanStr + str.substring(index, str.length);
  this.processingEl_.innerHTML = str + "</span>";
  this.processingTimer_ = setTimeout(goog.bind(this.animateProcessing_, this), 400);
};
chatango.payments.CreditCardTransactionDialog.prototype.stopProcessingAnim_ = function() {
  if (!this.processingEl_) {
    return;
  }
  this.processingEl_.innerHTML = "";
  clearTimeout(this.processingTimer_);
};
chatango.payments.CreditCardTransactionDialog.prototype.proceedWithPay_ = function() {
  this.button_.setEnabled(false);
  this.startProcessingAnim_();
  var cardNumber = this.cardNumberInput_.value;
  var cardType = this.creditCardUtil_.confirmType(cardNumber);
  var firstName = this.firstNameInput_.value;
  var lastName = this.lastNameInput_.value;
  var cvv = this.cvvInput_.value;
  if (firstName == "") {
    this.showErrorPU(null, this.lm_.getString("payments", "error_fn"));
  } else {
    if (lastName == "") {
      this.showErrorPU(null, this.lm_.getString("payments", "error_ln"));
    } else {
      if (!cardNumber.match(/^\d*$/) || this.cardNumberInput_.validity && this.cardNumberInput_.validity.badInput) {
        this.showErrorPU(null, this.lm_.getString("payments", "error_cc_num"));
      } else {
        if (cardNumber.length < 13) {
          this.showErrorPU(null, this.lm_.getString("payments", "error_cc"));
        } else {
          if (!cvv.match(/^\d*$/) || this.cvvInput_.validity && this.cvvInput_.validity.badInput) {
            this.showErrorPU(null, this.lm_.getString("payments", "error_cvv_num"));
          } else {
            if (cvv.length < 3 || cvv.length > 4) {
              this.showErrorPU(null, this.lm_.getString("payments", "error_cvv"));
            } else {
              if (cardType == null) {
                this.showErrorPU(null, this.lm_.getString("payments", "card_invalid"));
              } else {
                var expiration = this.expirationMonthSelect_.getSelectedItem().getCaption() + this.expirationYearSelect_.getSelectedItem().getCaption();
                this.PaymentProcessor_.beginTransaction(chatango.payments.PaymentProcessor.PaymentType.CREDIT_CARD, this.transactionData_, firstName, lastName, cvv, cardNumber, cardType, expiration);
              }
            }
          }
        }
      }
    }
  }
};
chatango.payments.CreditCardTransactionDialog.prototype.cardNumberChanged = function() {
  var cardType = this.creditCardUtil_.predictType(this.cardNumberInput_.value);
  goog.dom.removeChildren(this.cardImageWrapperEl_);
  if (cardType) {
    var cardImage = goog.dom.createDom("img", {"src":this.creditCardUtil_.getCardImageSource(cardType)});
    goog.dom.append(this.cardImageWrapperEl_, cardImage);
  }
};
chatango.payments.CreditCardTransactionDialog.prototype.onTransactionComplete = function() {
  this.transactionData_.setRateLimitInfo(this.PaymentProcessor_.getRateLimitInfo());
  var type = chatango.events.PaymentEvent.EventType.THANK_YOU_DIALOG_REQUEST;
  this.dispatchEvent(new chatango.events.PaymentEvent(type));
};
chatango.payments.CreditCardTransactionDialog.prototype.onTransactionCompleteError = function() {
  this.transactionData_.setRateLimitInfo(this.PaymentProcessor_.getRateLimitInfo());
  this.showErrorPU();
  goog.style.setStyle(this.getContentElement(), "visibility", "hidden");
};
chatango.payments.CreditCardTransactionDialog.prototype.showErrorPU = function(e, opt_msg) {
  var errorMsg = opt_msg;
  if (errorMsg == null) {
    errorMsg = this.PaymentProcessor_.getErrorMessage();
  }
  this.button_.setEnabled(true);
  this.stopProcessingAnim_();
  this.closeErrorPU_();
  this.errorPU_ = new chatango.ui.ErrorDialog(errorMsg);
  this.errorPU_.setVisible(true);
  this.errorPU_.setResizable(false);
  goog.events.listen(this.errorPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeErrorPU_, false, this);
};
chatango.payments.CreditCardTransactionDialog.prototype.closeErrorPU_ = function() {
  if (this.errorPU_) {
    this.errorPU_.dispose();
  }
  this.errorPU_ = null;
};
chatango.payments.CreditCardTransactionDialog.EXPIRATION_YEARS_TO_DISPLAY = 10;
chatango.payments.CreditCardTransactionDialog.EXPIRATION_MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
goog.provide("chatango.payments.UnusedAccountTransactionData");
goog.require("chatango.payments.TransactionData");
chatango.payments.UnusedAccountTransactionData = function() {
  chatango.payments.TransactionData.call(this);
  this.cost_ = 0;
  this.accountsToPurchase_ = {};
  this.accountsCount_ = 0;
};
goog.inherits(chatango.payments.UnusedAccountTransactionData, chatango.payments.TransactionData);
chatango.payments.UnusedAccountTransactionData.ACCOUNT_COST_ARRAY = [0, 20, 26, 30, 34, 37, 41, 45, 48, 51, 53, 55, 58, 60, 63, 65];
chatango.payments.UnusedAccountTransactionData.prototype.addUnusedAccount = function(name, opt_email) {
  var email = opt_email ? opt_email : "";
  if (!this.containsUnusedAccount(name)) {
    this.accountsCount_++;
    this.updateCost_();
  }
  this.accountsToPurchase_[name] = email;
};
chatango.payments.UnusedAccountTransactionData.prototype.removeUnusedAccount = function(name) {
  if (!this.containsUnusedAccount(name)) {
    return false;
  }
  delete this.accountsToPurchase_[name];
  this.accountsCount_--;
  this.updateCost_();
  return true;
};
chatango.payments.UnusedAccountTransactionData.prototype.containsUnusedAccount = function(name) {
  return this.accountsToPurchase_[name] !== undefined;
};
chatango.payments.UnusedAccountTransactionData.prototype.containsEmail = function(name, email) {
  var key;
  for (key in this.accountsToPurchase_) {
    if (key != name && this.accountsToPurchase_[key] == email) {
      return true;
    }
  }
  return false;
};
chatango.payments.UnusedAccountTransactionData.prototype.getEmail = function(name) {
  return this.accountsToPurchase_[name];
};
chatango.payments.UnusedAccountTransactionData.prototype.getAccountsAllowed = function() {
  return chatango.payments.UnusedAccountTransactionData.ACCOUNT_COST_ARRAY.length - 1 - this.accountsCount_;
};
chatango.payments.UnusedAccountTransactionData.prototype.getAccountsCount = function() {
  return this.accountsCount_;
};
chatango.payments.UnusedAccountTransactionData.prototype.isValid = function() {
  var key;
  for (key in this.accountsToPurchase_) {
    if (this.accountsToPurchase_[key] == "") {
      return false;
    }
  }
  return this.accountsCount_ > 0;
};
chatango.payments.UnusedAccountTransactionData.prototype.getAccountsString = function() {
  var key;
  var str = "";
  for (key in this.accountsToPurchase_) {
    str += key + ":" + this.accountsToPurchase_[key] + "::;";
  }
  str = str.substr(0, str.length - 1);
  return str;
};
chatango.payments.UnusedAccountTransactionData.prototype.getAccountsListString = function() {
  var key;
  var str = "";
  for (key in this.accountsToPurchase_) {
    str += key + ", ";
  }
  str = str.substr(0, str.length - 2);
  return str;
};
chatango.payments.UnusedAccountTransactionData.prototype.getTotalGifteesAllowed = function() {
  if (this.accountsCount_ == 1) {
    return 29;
  } else {
    if (this.accountsCount_ == 2) {
      return 38;
    } else {
      if (this.accountsCount_ > 2) {
        return 40;
      }
    }
  }
  return 0;
};
chatango.payments.UnusedAccountTransactionData.prototype.updateCost_ = function() {
  this.cost_ = this.convertYen_(chatango.payments.UnusedAccountTransactionData.ACCOUNT_COST_ARRAY[this.accountsCount_]);
};
goog.provide("chatango.payments.PaymentMethodSelector");
goog.require("chatango.events.PaymentEvent");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.payments.CreditCardUtil");
goog.require("goog.ui.Component");
chatango.payments.PaymentMethodSelector = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.method_ = null;
};
goog.inherits(chatango.payments.PaymentMethodSelector, goog.ui.Component);
chatango.payments.PaymentMethodSelector.prototype.createDom = function() {
  var content = goog.dom.createDom("div", {"class":"payment-method-selector"});
  this.cardOptionWrapperEl_ = goog.dom.createDom("div", {"class":"payment-method"});
  this.cardOptionTextEl_ = goog.dom.createDom("div", {"class":"payment-option-text"});
  var cardOptionText = this.lm_.getString("payments", "use_card");
  this.cardOptionTextEl_.innerHTML = cardOptionText;
  goog.dom.append(this.cardOptionWrapperEl_, this.cardOptionTextEl_);
  this.cardImageWrapper_ = goog.dom.createDom("div", {"class":"payment-card-wrapper"});
  this.visaCardImage_ = goog.dom.createDom("img", {"src":chatango.payments.CreditCardUtil.Images.VISA});
  goog.dom.append(this.cardImageWrapper_, this.visaCardImage_);
  this.masterCardImage_ = goog.dom.createDom("img", {"src":chatango.payments.CreditCardUtil.Images.MASTERCARD});
  goog.dom.append(this.cardImageWrapper_, this.masterCardImage_);
  this.amexCardImage_ = goog.dom.createDom("img", {"src":chatango.payments.CreditCardUtil.Images.AMEX});
  goog.dom.append(this.cardImageWrapper_, this.amexCardImage_);
  this.discoverCardImage_ = goog.dom.createDom("img", {"src":chatango.payments.CreditCardUtil.Images.DISCOVER});
  goog.dom.append(this.cardImageWrapper_, this.discoverCardImage_);
  goog.dom.append(this.cardOptionWrapperEl_, this.cardImageWrapper_);
  goog.dom.append(content, this.cardOptionWrapperEl_);
  goog.events.listen(this.cardOptionWrapperEl_, goog.events.EventType.CLICK, this.onCardOptionChosen_, undefined, this);
  this.paypalOptionWrapperEl_ = goog.dom.createDom("div", {"class":"payment-method"});
  this.paypalOptionTextEl_ = goog.dom.createDom("div", {"class":"payment-option-text"});
  var paypalOptionText = this.lm_.getString("payments", "or");
  this.paypalOptionTextEl_.innerHTML = paypalOptionText;
  goog.dom.append(this.paypalOptionWrapperEl_, this.paypalOptionTextEl_);
  this.paypalImageWrapper_ = goog.dom.createDom("div", {"class":"pp-btn-wrapper"});
  this.paypalImage_ = goog.dom.createDom("img", {"src":chatango.payments.CreditCardUtil.Images.PAYPAL});
  goog.dom.append(this.paypalImageWrapper_, this.paypalImage_);
  goog.dom.append(this.paypalOptionWrapperEl_, this.paypalImageWrapper_);
  goog.dom.append(content, this.paypalOptionWrapperEl_);
  goog.events.listen(this.paypalOptionWrapperEl_, goog.events.EventType.CLICK, this.onPayPalOptionChosen_, undefined, this);
  this.setElementInternal(content);
};
chatango.payments.PaymentMethodSelector.prototype.onCardOptionChosen_ = function() {
  this.method_ = chatango.payments.PaymentMethodSelector.PaymentMethod.CARD;
  this.dispatchEvent(new chatango.events.PaymentEvent(chatango.events.PaymentEvent.EventType.PAYMENT_METHOD_SELECTED));
};
chatango.payments.PaymentMethodSelector.prototype.onPayPalOptionChosen_ = function() {
  this.method_ = chatango.payments.PaymentMethodSelector.PaymentMethod.PAYPAL;
  this.dispatchEvent(new chatango.events.PaymentEvent(chatango.events.PaymentEvent.EventType.PAYMENT_METHOD_SELECTED));
};
chatango.payments.PaymentMethodSelector.prototype.getPaymentMethod = function() {
  return this.method_;
};
chatango.payments.PaymentMethodSelector.prototype.updateCopy = function() {
  var cardOptionText = this.lm_.getString("payments", "use_card");
  this.cardOptionTextEl_.innerHTML = cardOptionText;
  var paypalOptionText = this.lm_.getString("payments", "or");
  this.paypalOptionTextEl_.innerHTML = paypalOptionText;
};
chatango.payments.PaymentMethodSelector.PaymentMethod = {CARD:"card", PAYPAL:"paypal"};
goog.provide("chatango.payments.FinalizePaymentDialog");
goog.require("chatango.events.PaymentEvent");
goog.require("chatango.payments.PaymentMethodSelector");
goog.require("chatango.ui.ScrollableDialog");
chatango.payments.FinalizePaymentDialog = function(transactionData, opt_domHelper) {
  this.transactionData_ = transactionData;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
};
goog.inherits(chatango.payments.FinalizePaymentDialog, chatango.ui.ScrollableDialog);
chatango.payments.FinalizePaymentDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  goog.dom.classes.add(this.getElement(), "finalize-dlg");
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  this.wrapperEl_ = goog.dom.createDom("div");
  this.infoEl_ = goog.dom.createDom("span");
  this.addIcon(this.wrapperEl_);
  goog.dom.appendChild(this.wrapperEl_, this.infoEl_);
  goog.dom.append(content, this.wrapperEl_);
  this.selector_ = new chatango.payments.PaymentMethodSelector;
  goog.events.listen(this.selector_, chatango.events.PaymentEvent.EventType.PAYMENT_METHOD_SELECTED, this.onPaymentMethodSelected_, false, this);
  this.selector_.render(content);
  this.updateCopy();
};
chatango.payments.FinalizePaymentDialog.prototype.addIcon = function(content) {
};
chatango.payments.FinalizePaymentDialog.prototype.onPaymentMethodSelected_ = function() {
  var type;
  this.transactionData_.setPaymentMethod(this.selector_.getPaymentMethod());
  if (this.transactionData_.getPaymentMethod() == chatango.payments.PaymentMethodSelector.PaymentMethod.CARD) {
    type = chatango.events.PaymentEvent.EventType.CREDIT_CARD_TRANSACTION_DIALOG_REQUEST;
  } else {
    if (this.transactionData_.getPaymentMethod() == chatango.payments.PaymentMethodSelector.PaymentMethod.PAYPAL) {
      type = chatango.events.PaymentEvent.EventType.PAYPAL_FLOW_REQUEST;
    }
  }
  this.dispatchEvent(new chatango.events.PaymentEvent(type));
};
chatango.payments.FinalizePaymentDialog.prototype.getSelector = function() {
  return this.selector_;
};
chatango.payments.FinalizePaymentDialog.prototype.updateCopy = function() {
};
goog.provide("chatango.payments.FinalizeGiftDialog");
goog.require("chatango.events.PaymentEvent");
goog.require("chatango.payments.FinalizePaymentDialog");
chatango.payments.FinalizeGiftDialog = function(transactionData, opt_domHelper) {
  chatango.payments.FinalizePaymentDialog.call(this, transactionData, opt_domHelper);
  this.setTitle(this.lm_.getString("payments", "give_to_friends"));
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
};
goog.inherits(chatango.payments.FinalizeGiftDialog, chatango.payments.FinalizePaymentDialog);
chatango.payments.FinalizeGiftDialog.prototype.createDom = function() {
  chatango.payments.FinalizePaymentDialog.prototype.createDom.call(this);
};
chatango.payments.FinalizeGiftDialog.prototype.addIcon = function() {
  var giftIcon = new chatango.ui.icons.GiftIcon;
  giftIcon.renderBefore(this.titleTextEl_);
  if (!chatango.managers.Environment.getInstance().isDesktop()) {
    goog.style.setStyle(giftIcon.getElement(), "vertical-align", "bottom");
  }
  goog.dom.classes.add(giftIcon.getElement(), "sb-icon");
};
chatango.payments.FinalizeGiftDialog.prototype.updateCopy = function() {
  var numGiftees = this.transactionData_.getGifteeCount();
  var amountPlaceholder = this.lm_.getString("payments", "amount_placeholder");
  var costPlaceholder = this.lm_.getString("payments", "cost_placeholder");
  var key = numGiftees === 1 ? "friend" : "friends";
  var friends = numGiftees + this.lm_.getString("payments", key);
  this.infoEl_.innerHTML = this.lm_.getString("payments", "gift_status").split(amountPlaceholder).join(friends).split(costPlaceholder).join(this.transactionData_.getCostText());
};
goog.provide("chatango.payments.PremiumPaymentDialog");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.payments.PaymentMethodSelector");
goog.require("chatango.payments.TransactionData");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.Select");
goog.require("chatango.ui.buttons.IconButton");
goog.require("chatango.ui.icons.GiftIcon");
goog.require("goog.ui.Dialog");
goog.require("goog.ui.FlatMenuButtonRenderer");
goog.require("goog.ui.Menu");
goog.require("goog.ui.MenuItem");
goog.require("goog.ui.MenuRenderer");
chatango.payments.PremiumPaymentDialog = function(transactionData, username, opt_domHelper) {
  this.username_ = username;
  this.transactionData_ = transactionData;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("payments", "support_chatango"));
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
};
goog.inherits(chatango.payments.PremiumPaymentDialog, chatango.ui.ScrollableDialog);
chatango.payments.PremiumPaymentDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  goog.dom.classes.add(this.getElement(), "payment-dlg");
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  this.wrapperEl_ = goog.dom.createDom("div", {"style":"margin-bottom: .5em;"});
  var giftIcon = new chatango.ui.icons.GiftIcon;
  giftIcon.renderBefore(this.titleTextEl_);
  if (!chatango.managers.Environment.getInstance().isDesktop()) {
    goog.style.setStyle(giftIcon.getElement(), "vertical-align", "bottom");
  }
  goog.dom.classes.add(giftIcon.getElement(), "sb-icon");
  this.pitchTextEl_ = goog.dom.createDom("span");
  goog.dom.appendChild(this.wrapperEl_, this.pitchTextEl_);
  goog.dom.append(content, this.wrapperEl_);
  var selectRow = goog.dom.createDom("tr");
  var currencyCell = goog.dom.createDom("td");
  goog.style.setStyle(currencyCell, {"padding-right":".3em"});
  this.currencySelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  var currencyDisplays = this.transactionData_.getCurrencyDisplays();
  for (var i = 0;i < currencyDisplays.length;i++) {
    this.currencySelect_.addItem(new goog.ui.MenuItem(currencyDisplays[i], i));
  }
  this.currencySelect_.setValue(this.transactionData_.getCurrencyIndex());
  this.currencySelect_.render(currencyCell);
  goog.dom.append(selectRow, currencyCell);
  goog.events.listen(this.currencySelect_, goog.ui.Component.EventType.ACTION, this.onCurrencyChange_, false, this);
  var costCell = goog.dom.createDom("td");
  this.costSelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  this.createCostSelectOptions_();
  this.costSelect_.setValue(this.transactionData_.getContributionIndex(true));
  this.costSelect_.render(costCell);
  goog.dom.append(selectRow, costCell);
  goog.events.listen(this.costSelect_, goog.ui.Component.EventType.ACTION, this.onCostChange_, false, this);
  goog.dom.append(content, selectRow);
  this.pleaseReadLinkEl_ = goog.dom.createDom("div");
  goog.style.setStyle(this.pleaseReadLinkEl_, {"margin":"0.2em 0", "text-align":"right"});
  this.pleaseReadLink_ = new goog.ui.Button(this.lm_.getString("payments", "please_read"), goog.ui.LinkButtonRenderer.getInstance());
  this.pleaseReadLink_.addClassName("link-btn");
  this.pleaseReadLink_.render(this.pleaseReadLinkEl_);
  goog.events.listen(this.pleaseReadLink_, goog.ui.Component.EventType.ACTION, this.onPleaseReadLinkClicked_, false, this);
  goog.dom.append(content, this.pleaseReadLinkEl_);
  this.selector_ = new chatango.payments.PaymentMethodSelector;
  goog.events.listen(this.selector_, chatango.events.PaymentEvent.EventType.PAYMENT_METHOD_SELECTED, this.onPaymentMethodSelected_, false, this);
  this.selector_.render(content);
  this.donationMessageWrapperEl_ = goog.dom.createDom("div", {"class":"pymt-footnote"});
  this.donationMessageEl_ = goog.dom.createDom("span");
  goog.dom.append(this.donationMessageWrapperEl_, this.donationMessageEl_);
  goog.dom.append(content, this.donationMessageWrapperEl_);
  this.unusedAccountIcon_ = null;
  this.unusedAccountLink_ = null;
  this.unusedAccountLinkEl_ = null;
  this.updateCopy();
};
chatango.payments.PremiumPaymentDialog.prototype.onCostChange_ = function() {
  var costIndex = Number(this.costSelect_.getValue());
  this.transactionData_.setCost(this.costSelect_.getSelectedItem().getCaption());
  this.updateDonationMessage_();
};
chatango.payments.PremiumPaymentDialog.prototype.createCostSelectOptions_ = function(e) {
  var cost = this.costSelect_.getValue();
  var contributionAmounts = this.transactionData_.getContributionAmounts();
  for (var i = 0;i < contributionAmounts.length;i++) {
    if (cost) {
      this.costSelect_.removeItemAt(i);
    }
    var costWrapperEl_ = goog.dom.createDom("div");
    var costText = contributionAmounts[i];
    var costTextEl_ = goog.dom.createDom("span");
    costTextEl_.innerHTML = costText;
    goog.dom.append(costWrapperEl_, costTextEl_);
    if (i > 1) {
      var costGiftIcon = new chatango.ui.icons.GiftIcon;
      costGiftIcon.render(costWrapperEl_);
      goog.dom.classes.add(costGiftIcon.getElement(), "sb-icon gift-icon");
    }
    this.costSelect_.addItemAt(new goog.ui.MenuItem(costWrapperEl_, i));
  }
  this.costSelect_.setValue(cost);
};
chatango.payments.PremiumPaymentDialog.prototype.onCurrencyChange_ = function(e) {
  var currencyIndex = this.currencySelect_.getValue();
  this.transactionData_.setCurrencyIndex(currencyIndex);
  this.createCostSelectOptions_();
  this.transactionData_.setCost(this.costSelect_.getSelectedItem().getCaption());
  this.updateDonationMessage_();
};
chatango.payments.PremiumPaymentDialog.prototype.onPleaseReadLinkClicked_ = function() {
  if (!this.supporterBenefitsPU_) {
    var puDisplayText = this.lm_.getString("payments", "dear_users") + "<br><br>";
    puDisplayText += this.lm_.getString("payments", "costs_more") + "<br>";
    puDisplayText += this.lm_.getString("payments", "contribute") + "<br><br>";
    puDisplayText += this.lm_.getString("payments", "appreciate") + "<br><br>";
    puDisplayText += this.lm_.getString("payments", "support_us_by") + "<br><br>";
    puDisplayText += this.lm_.getString("payments", "please_note") + "<br><br>";
    puDisplayText += this.lm_.getString("payments", "giving") + "<br><br>";
    puDisplayText += this.lm_.getString("payments", "thank_you");
    this.supporterBenefitsPU_ = new chatango.ui.ScrollableTextDialog(puDisplayText);
    this.supporterBenefitsPU_.setTitle(this.lm_.getString("payments", "supporter_benefits"));
    this.supporterBenefitsPU_.setHasTitleCloseButton(true);
    this.supporterBenefitsPU_.setResizable(false);
    this.supporterBenefitsPU_.setVisible(true);
    this.supporterBenefitsPU_.reposition();
    goog.dom.classes.add(this.supporterBenefitsPU_.getContentElement(), "sdlg-sc");
    goog.events.listen(this.supporterBenefitsPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeSupporterBenefitsPU, false, this);
    goog.events.listen(this.supporterBenefitsPU_, chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE, this.onSupporterBenefitsPUHeightChange_, false, this);
  }
};
chatango.payments.PremiumPaymentDialog.prototype.onUnusedAccountLinkClicked = function() {
};
chatango.payments.PremiumPaymentDialog.prototype.onPaymentMethodSelected_ = function(e) {
  var type;
  this.transactionData_.setPaymentMethod(this.selector_.getPaymentMethod());
  if (this.transactionData_.canGiftFriends()) {
    type = chatango.events.PaymentEvent.EventType.BONUS_SELECTION_DIALOG_REQUEST;
  } else {
    if (this.transactionData_.getPaymentMethod() == chatango.payments.PaymentMethodSelector.PaymentMethod.CARD) {
      type = chatango.events.PaymentEvent.EventType.CREDIT_CARD_TRANSACTION_DIALOG_REQUEST;
    } else {
      if (this.transactionData_.getPaymentMethod() == chatango.payments.PaymentMethodSelector.PaymentMethod.PAYPAL) {
        type = chatango.events.PaymentEvent.EventType.PAYPAL_FLOW_REQUEST;
      }
    }
  }
  this.dispatchEvent(new chatango.events.PaymentEvent(type));
};
chatango.payments.PremiumPaymentDialog.prototype.closeSupporterBenefitsPU = function() {
  if (this.supporterBenefitsPU_) {
    goog.events.unlisten(this.supporterBenefitsPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeSupporterBenefitsPU, false, this);
    goog.events.unlisten(this.supporterBenefitsPU_, chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE, this.onSupporterBenefitsPUHeightChange_, false, this);
    this.supporterBenefitsPU_.dispose();
  }
  this.supporterBenefitsPU_ = null;
};
chatango.payments.PremiumPaymentDialog.prototype.onSupporterBenefitsPUHeightChange_ = function(e) {
  this.supporterBenefitsPU_.reposition();
};
chatango.payments.PremiumPaymentDialog.prototype.updateDonationMessage_ = function() {
  var costText = this.transactionData_.minimumGiftCostText() + this.lm_.getString("payments", "or_more");
  var gifteeCount = "";
  if (this.transactionData_.canGiftFriends()) {
    costText = this.transactionData_.getCostText();
    gifteeCount = " <b>" + this.transactionData_.getTotalGifteesAllowed();
  }
  var gifteeCountPlaceholder = this.lm_.getString("payments", "amount_placeholder");
  var costPlaceholder = this.lm_.getString("payments", "cost_placeholder");
  var donationMessage = this.lm_.getString("payments", "donation_status").split(costPlaceholder).join(costText).split(gifteeCountPlaceholder).join(gifteeCount);
  if (gifteeCount != "") {
    donationMessage += "</b>";
  }
  this.donationMessageEl_.innerHTML = donationMessage;
};
chatango.payments.PremiumPaymentDialog.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("payments", "support_chatango"));
  this.pitchTextEl_.innerHTML = "<b>" + this.username_ + "</b>" + this.lm_.getString("payments", "payment_dialog_pitch");
  this.updateDonationMessage_();
  this.selector_.updateCopy();
  this.pleaseReadLink_.setContent(this.lm_.getString("payments", "please_read"));
};
chatango.payments.PremiumPaymentDialog.prototype.dispose = function() {
  this.closeSupporterBenefitsPU();
  chatango.payments.PremiumPaymentDialog.superClass_.dispose.call(this);
};
goog.provide("chatango.strings.PaymentStrings");
chatango.strings.PaymentStrings.strs = {"support_chatango":"Support Chatango", "payment_dialog_pitch":", please support Chatango for one month with one payment of:", "donation_status":"* Donating *cost* lets you gift Supporter privileges to*amount* friends", "or_more":" or more", "amount_placeholder":"*amount*", "friend_placeholder":"*friend*", "cost_placeholder":"*cost*", "please_read":"Please read", "supporter_benefits":"Supporter Benefits", "dear_users":"Dear chatango Users,", "costs_more":"Chatango costs more to run than it makes from ads.", 
"contribute":"If you like chatango please contribute to help us run it and develop new features.", "appreciate":"As a sign of appreciation, Chatango Supporters can distinguish themselves in the group chats with custom message backgrounds (you can upload your own pictures), special moving smileys and larger fonts.  We will be introducing other gifts for Chatango Supporters in the future.", "support_us_by":"You can support us from any country by credit card.  We recommend donating $3-5, but any amount of more than U.S. 95 cents will help Chatango.", 
"please_note":"Please note: <br>-Supporters can still be banned by chat moderators and flagged, just like other users.<br>-You can use the Supporter backgrounds and smileys for a month after your support date.", "giving":"Giving $3 or more allows you to gift Supporter privileges to friends.<br>-$5.00 gift to 4 friends<br> -$10.00 gift to 13 friends<br>-$20.00 gift to 29 friends", "thank_you":"Thank you for your support,<br>Chatango", "use_card":"1. Use a card", "or":"2. Or:", "username":"Username", 
"name":"Name", "bonus":"Bonus", "add":"Add", "you_can_give":"You can gift extended features to up to *amount* friends", "not_a_user":" is not a current Chatango username.", "already_added":" has already been added to the list.", "bonus_only_temporary":"* This bonus is only valid now.  You will not be able to add friends to this transaction later.", "bonus_temp":"Bonus only valid now", "remaining":" remaining", "gift_left":"Gift to *n* more", "give_to_friends":"Gift to friends", "gift":"Gift", "give_friends_features":"Gift friends extended features (and help Chatango)", 
"total":"Total", "per_friend":" per friend", "you_save":" - you save ", "gift_status":"You are gifting extended features to <b> *amount* </b> for a total of *cost*", "friend":" friend", "friends":" friends", "unused_account":" unused account", "unused_accounts":" unused accounts", "secure_transaction":"Secure Transaction", "firstname":"First name", "lastname":"Last name", "cardnumber":"Credit card number", "cardnumber_sm":"Card number", "expires":"Expires: ", "cvvnumber":"CVV", "pay":"Pay ", "card_invalid":"The credit card you entered is not valid, please enter a valid Visa, Master Card, American Express or Discover card", 
"error_fn":"Please enter a first name", "error_ln":"Please enter a last name", "error_cvv":"Please enter a cvv number that is between 3 and 4 digits long", "error_cvv_num":"The CVV input must be numerical", "error_cc":"Please enter a card number that is at least 13 digits long", "error_cc_num":"The credit card number must be numerical", "error_101":"First name is too long", "error_102":"Last name is too long", "error_103":"This card type is not supported", "error_104":"The card number is too long", 
"error_105":"The expiry date is incorrect", "error_106":"The CVV code is incorrect", "error_107":"Please check the amount", "error_108":"This currency is not accepted", "error_114":"User name is too long", "error_115":"Password  is too long", "error_116":"Group name has too many chars", "error_201":"Chatango does not accept payments from this card at this time.*br*You can contact Chatango *open_feedback_link*here*close_feedback_link* about this message.", "error_202":"*b*Chatango appreciates your support. Please try again using the PayPal option*/b*.*br*You see this message because you made a large number of payments within a short period of time with a card that you only recently started using on Chatango. As a precaution, Chatango limited the number of credit card payments you can make to us at this time.*br**br*You can contact Chatango *open_feedback_link*here*close_feedback_link* about this message.", 
"error_203":"Chatango does not accept payments from this card at this time. The maximum of *b**max_payments**/b* payments in *b**num_days**/b* days has been exceeded.  *b*You will be able to use this card on Chatango again on *date**/b*. Chatango applies this initial payment limit to all cards. The limit will be automatically removed after a certain period of time.*br**open_feedback_link*Contact us*close_feedback_link* to request the immediate removal of this limit.", "generic_payment_error":"There has been an error - no money has been charged.*br*You can contact Chatango *open_feedback_link*here*close_feedback_link* about this message.", 
"error_date_format":"ddd mmm d yyyy, g:i a", "thank_you":"Thank you for your support.", "your_payment_success":"Your payment of *amount* was successful.", "as_supporter_you":"As a Chatango supporter you will be able to use extended features for one month.", "as_supporter_you_friend":"As a Chatango supporter you and your *friend|s* will be able to use extended features for one month.", "as_supporter_friend":"Your *friend|s* will be able to use extended features for one month.", "thanks":"Thanks!", 
"rate_limit":"*br**b*Attention: */b*you have made *b**payments_made* out of *max_payments**/b* payments in *num_days* days. *next_pay_day*Please *b*combine several gifts*/b* in a single payment, to reduce the number of payments. Chatango initially limits how often you can pay. The limit is removed in time.", "next_pay_day":"The *b*next day you can pay is *next_pay_day*.*/b*", "protected_with_ssl":"Protected with SSL encryption", "cvv_tooltip":"*b*Visa, MasterCard and Discover:*/b**br*3 digit code on the back of the card*br**b*American Express:*/b**br*4 digits in small print on the front of the card", 
"pay_with_paypal":"Pay with PayPal", "open_paypal":"Open PayPal", "connecting_pp":"Connecting to PayPal", "opening_pp":"Opening a PayPal window. Please check your pop-up blocker. If it doesn't open in five seconds please try this button.", "open_pp":"Open PayPal", "after_pp_success":"Refresh this window after a successful payment.", "buy_account":"Get an orignal account", "buy_account_pitch":"If a user name that you want has already been taken, you may be able to get it if it has not been used for more than 100 days. People donate for original unused accounts to keep Chatango running and to allow us to build new features.", 
"buy_account_pitch_small":"If a user name that you want has already been taken, you may be able to get it if it has not been used for more than 100 days.", "invalid_username":"Chatango accounts must be alphanumeric and at most 20 characters.", "bad_word":" is an inappropriate word.", "bad_part":" contains inappropriate parts.", "name_group":" is a group.", "not_expired":" is not expired.", "concurrently_purchased":" is currently being purchased.", "active_group_owner":" belongs to an active group owner.", 
"add_email":"Add Email", "account_not_in_list":" is not on the list of accounts to purchase.", "email_top":"<b>Real</b> email for this account:", "email_bottom":'Make sure this is a <span style="color:#f00;font-weight:bold;">real email</span> where you will receive your password.', "email_entry":"Email address", "email_invalid":" is not a valid email.", "email_already_added":" has already been added to the list", "email_in_use":" is already in use by another Chatango account", "accounts_unavailable":"Purchase could not be completed because the following accounts have become unavailable:", 
"emails_unavailable":"Purchase could not be completed because the following emails have become unavailable:", "accounts_and_emails_unavailable":"Purchase could not be completed because the following accounts and emails have become unavailable:", "emails_unavailable_during_payment":"Purchase has been completed but the following emails have become unavailable during the payment process: *accs* *open_link*Please contact us to resolve this issue*close_link*", "buy_account_status":"You are getting <b> *amount* </b> and you are gifting extended features to <b> *friend* </b> for a total of *cost*", 
"buy_account_success":"You will be sent an email with the password for <b>*accounts*</b>.", "terms_caption":"I agree to the ", "terms_link":"terms and conditions", "terms_unused":"1. Unused accounts are released for personal use only. Chatango will not support any claims for purchased accounts that have been shared, traded or resold between users.<br>2. The account names and the email assignments that you specify during the purchase are final, they cannot be changed later by Chatango.<br>3. All purchased accounts are subject to Chatango's Terms of Use.<br>4. If you do not log in to your account for more than 100 days, it may get re-assigned to another user.<br>5. Any fraudulent payment activity will result in locking accounts and a ban from Chatango.", 
"terms_error":"You must agree to the terms and conditions before completing this purchase."};
goog.provide("chatango.payments.BonusSelectionDialog");
goog.require("chatango.payments.FriendsSelectionDialog");
goog.require("chatango.ui.buttons.Button");
chatango.payments.BonusSelectionDialog = function(transactionData, opt_domHelper) {
  this.transactionData_ = transactionData;
  chatango.payments.FriendsSelectionDialog.call(this, transactionData, opt_domHelper);
  this.setTitle(this.lm_.getString("payments", "bonus"));
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
};
goog.inherits(chatango.payments.BonusSelectionDialog, chatango.payments.FriendsSelectionDialog);
chatango.payments.BonusSelectionDialog.prototype.createDom = function() {
  chatango.payments.FriendsSelectionDialog.prototype.createDom.call(this);
  this.remainingGifteesTextWrapperEl_ = goog.dom.createDom("span");
  this.remainingGifteesTextEl_ = goog.dom.createDom("div", {"class":"pymt-footnote"});
  this.updateRemainingText();
  goog.dom.append(this.getHeaderContentElement(), this.remainingGifteesTextEl_);
  var footerContent = this.getFooterContentElement();
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  goog.style.setStyle(footerContent, "overflow", "hidden");
  this.bottomMessageTextEl_ = goog.dom.createDom("div", {"class":"pymt-footnote"});
  var bonusStrId = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize() ? "bonus_temp" : "bonus_only_temporary";
  this.bottomMessageTextEl_.innerHTML = this.lm_.getString("payments", bonusStrId);
  goog.dom.append(footerContent, this.bottomMessageTextEl_);
  this.buttonsContainer_ = goog.dom.createDom("div");
  this.backButtonWrapperEl_ = goog.dom.createDom("div", {"style":"float:left;overflow:hidden"});
  this.backButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "back"));
  this.backButton_.setEnabled(true);
  if (!(this.transactionData_ instanceof chatango.payments.UnusedAccountTransactionData)) {
    this.backButton_.render(this.backButtonWrapperEl_);
    goog.style.setStyle(this.backButton_.getElement(), "margin-left", "0");
  }
  goog.events.listen(this.backButton_, goog.ui.Component.EventType.ACTION, this.onBackButtonClicked, false, this);
  goog.dom.append(this.buttonsContainer_, this.backButtonWrapperEl_);
  this.continueButtonWrapperEl_ = goog.dom.createDom("div", {"style":"float:right;overflow:hidden"});
  this.continueButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "next"));
  this.continueButton_.setEnabled(true);
  this.continueButton_.render(this.continueButtonWrapperEl_);
  goog.events.listen(this.continueButton_, goog.ui.Component.EventType.ACTION, this.onContinueButtonClicked, false, this);
  goog.dom.append(this.buttonsContainer_, this.continueButtonWrapperEl_);
  goog.dom.append(footerContent, this.buttonsContainer_);
  this.updateCopy();
};
chatango.payments.BonusSelectionDialog.prototype.onBackButtonClicked = function() {
  var type;
  type = chatango.events.PaymentEvent.EventType.PREMIUM_PAYMENT_DIALOG_REQUEST;
  this.dispatchEvent(new chatango.events.PaymentEvent(type));
};
chatango.payments.BonusSelectionDialog.prototype.onContinueButtonClicked = function() {
  var type;
  if (this.transactionData_ instanceof chatango.payments.UnusedAccountTransactionData) {
    type = chatango.events.PaymentEvent.EventType.UNUSED_ACCOUNT_PAYMENT_DIALOG_REQUEST;
  } else {
    switch(this.transactionData_.getPaymentMethod()) {
      case chatango.payments.PaymentMethodSelector.PaymentMethod.PAYPAL:
        type = chatango.events.PaymentEvent.EventType.PAYPAL_FLOW_REQUEST;
        break;
      case chatango.payments.PaymentMethodSelector.PaymentMethod.CARD:
      ;
      default:
        type = chatango.events.PaymentEvent.EventType.CREDIT_CARD_TRANSACTION_DIALOG_REQUEST;
        break;
    }
  }
  this.dispatchEvent(new chatango.events.PaymentEvent(type));
};
chatango.payments.BonusSelectionDialog.prototype.onAddConfirmed = function() {
  chatango.ui.ModifiableListDialog.prototype.onAddConfirmed.call(this);
  this.updateRemainingText();
};
chatango.payments.BonusSelectionDialog.prototype.onRemoveConfirmed = function(opt_name) {
  chatango.ui.ModifiableListDialog.prototype.onRemoveConfirmed.call(this);
  this.updateRemainingText();
};
chatango.payments.BonusSelectionDialog.prototype.updateRemainingText = function() {
  var giftLeftString;
  if (chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize()) {
    giftLeftString = this.lm_.getString("payments", "gift_left").split("*n*").join(this.transactionData_.getGifteesAllowed());
  } else {
    giftLeftString = this.transactionData_.getGifteesAllowed() + this.lm_.getString("payments", "remaining");
  }
  this.remainingGifteesTextEl_.innerHTML = giftLeftString;
  this.setHeight();
  chatango.utils.display.constrainToStage(this.element_, null, true);
};
chatango.payments.BonusSelectionDialog.prototype.updateCopy = function() {
  if (chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize()) {
    goog.style.setStyle(this.wrapperEl_, "display", "none");
    goog.style.setStyle(this.headerContentEl_, "padding-top", 0);
    goog.style.setStyle(this.headerContentEl_, "padding-bottom", ".2em");
    goog.style.setStyle(this.bottomMessageTextEl_, "padding-top", 0);
    goog.style.setStyle(this.bottomMessageTextEl_, "padding-top", ".2em");
  } else {
    goog.style.setStyle(this.wrapperEl_, "display", "block");
    this.setTopText(this.lm_.getString("payments", "you_can_give").split(this.lm_.getString("payments", "amount_placeholder")).join(this.transactionData_.getTotalGifteesAllowed()));
  }
  this.setHeight();
  chatango.utils.display.constrainToStage(this.element_, null, true);
};
goog.provide("chatango.payments.FinalizeUnusedAccountDialog");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.events.PaymentEvent");
goog.require("chatango.ui.ScrollableTextDialog");
goog.require("chatango.payments.FinalizePaymentDialog");
chatango.payments.FinalizeUnusedAccountDialog = function(transactionData, opt_domHelper) {
  chatango.payments.FinalizePaymentDialog.call(this, transactionData, opt_domHelper);
  this.setTitle(this.lm_.getString("payments", "buy_account"));
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
  this.termsDialog_ = null;
  this.termsErrorDialog_ = null;
};
goog.inherits(chatango.payments.FinalizeUnusedAccountDialog, chatango.payments.FinalizePaymentDialog);
chatango.payments.FinalizeUnusedAccountDialog.prototype.createDom = function() {
  chatango.payments.FinalizePaymentDialog.prototype.createDom.call(this);
};
chatango.payments.FinalizeUnusedAccountDialog.prototype.addIcon = function() {
  var giftIcon = new chatango.ui.icons.GiftIcon;
  giftIcon.renderBefore(this.titleTextEl_);
  if (!chatango.managers.Environment.getInstance().isDesktop()) {
    goog.style.setStyle(giftIcon.getElement(), "vertical-align", "bottom");
  }
  goog.dom.classes.add(giftIcon.getElement(), "sb-icon");
};
chatango.payments.FinalizeUnusedAccountDialog.prototype.updateCopy = function() {
  var numAccounts = this.transactionData_.getAccountsCount();
  var numGiftees = this.transactionData_.getGifteeCount();
  var amountPlaceholder = this.lm_.getString("payments", "amount_placeholder");
  var friendPlaceholder = this.lm_.getString("payments", "friend_placeholder");
  var costPlaceholder = this.lm_.getString("payments", "cost_placeholder");
  var key = numGiftees === 1 ? "friend" : "friends";
  var friends = numGiftees + this.lm_.getString("payments", key);
  var key = numAccounts === 1 ? "unused_account" : "unused_accounts";
  var accounts = numAccounts + this.lm_.getString("payments", key);
  this.infoText_ = goog.dom.createDom("div");
  this.infoText_.innerHTML = this.lm_.getString("payments", "buy_account_status").split(amountPlaceholder).join(accounts).split(friendPlaceholder).join(friends).split(costPlaceholder).join(this.transactionData_.getCostText());
  this.termsWrapper_ = goog.dom.createDom("div");
  goog.style.setStyle(this.termsWrapper_, "margin-top", "0.3em");
  goog.style.setStyle(this.termsWrapper_, "margin-bottom", "0.3em");
  this.termsCB_ = new chatango.ui.Checkbox;
  this.termsCB_.render(this.termsWrapper_);
  goog.style.setStyle(this.termsCB_.getElement(), "float", "left");
  goog.style.setStyle(this.termsCB_.getElement(), "padding-right", "0");
  this.termsText_ = goog.dom.createDom("span", {"style":"vertical-align:middle;"}, this.lm_.getString("payments", "terms_caption"));
  goog.dom.append(this.termsWrapper_, this.termsText_);
  this.termsLink_ = new goog.ui.Button(this.lm_.getString("payments", "terms_link"), goog.ui.LinkButtonRenderer.getInstance());
  this.termsLink_.addClassName("link-btn");
  this.termsLink_.render(this.termsText_);
  goog.dom.append(this.infoEl_, this.infoText_);
  goog.dom.append(this.infoEl_, this.termsWrapper_);
  goog.events.listen(this.termsLink_, goog.ui.Component.EventType.ACTION, this.openTermsDialog_, false, this);
};
chatango.payments.FinalizeUnusedAccountDialog.prototype.openTermsDialog_ = function() {
  this.closeTermsDialog_();
  this.termsDialog_ = new chatango.ui.ScrollableTextDialog(this.lm_.getString("payments", "terms_unused"));
  this.termsDialog_.setHasTitleCloseButton(true);
  this.termsDialog_.setResizable(false);
  this.termsDialog_.setVisible(true);
  goog.events.listen(this.termsDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeTermsDialog_, false, this);
};
chatango.payments.FinalizeUnusedAccountDialog.prototype.closeTermsDialog_ = function() {
  if (this.termsDialog_) {
    goog.events.unlisten(this.termsDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeTermsDialog_, false, this);
    this.termsDialog_.dispose();
    this.termsDialog_ = null;
  }
};
chatango.payments.FinalizeUnusedAccountDialog.prototype.openTermsErrorDialog_ = function() {
  this.closeTermsErrorDialog_();
  this.termsErrorDialog_ = new chatango.ui.ErrorDialog(this.lm_.getString("payments", "terms_error"));
  this.termsErrorDialog_.setHasTitleCloseButton(true);
  this.termsErrorDialog_.setResizable(false);
  this.termsErrorDialog_.setVisible(true);
  goog.events.listen(this.termsErrorDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeTermsErrorDialog_, false, this);
};
chatango.payments.FinalizeUnusedAccountDialog.prototype.closeTermsErrorDialog_ = function() {
  if (this.termsErrorDialog_) {
    goog.events.unlisten(this.termsErrorDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeTermsErrorDialog_, false, this);
    this.termsErrorDialog_.dispose();
    this.termsErrorDialog_ = null;
  }
};
chatango.payments.FinalizeUnusedAccountDialog.prototype.onPaymentMethodSelected_ = function() {
  if (!this.termsCB_.isChecked()) {
    this.openTermsErrorDialog_();
    return;
  }
  goog.base(this, "onPaymentMethodSelected_");
};
goog.provide("chatango.payments.UnusedAccountChecker");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.SubDomain");
goog.require("chatango.ui.ModifiableListController");
chatango.payments.UnusedAccountChecker = function(transactionData) {
  chatango.ui.ModifiableListController.call(this, transactionData);
};
goog.inherits(chatango.payments.UnusedAccountChecker, chatango.ui.ModifiableListController);
chatango.payments.UnusedAccountChecker.EmailPattern = /(?:[0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@(?:[-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}/;
chatango.payments.UnusedAccountChecker.prototype.addName = function(name) {
  if (this.getModel().containsUnusedAccount(name)) {
    this.setErrorMessage(name + this.lm_.getString("payments", "already_added"));
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
  } else {
    var url = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/namecheckeraccsales";
    var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
    var fd = new FormData;
    fd.append("name", name);
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, goog.bind(this.onBackendResponse, this, name), undefined, this);
    goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.onBackendResponseFailed, undefined, this);
    chatango.ui.ModifiableListController.prototype.addName.call(this, name);
    xhr.send(url, "POST", fd);
  }
};
chatango.payments.UnusedAccountChecker.prototype.removeName = function(name) {
  chatango.ui.ModifiableListController.prototype.removeName.call(this, name);
  this.getModel().removeUnusedAccount(name);
};
chatango.payments.UnusedAccountChecker.prototype.onBackendResponse = function(name, e) {
  var response = e.currentTarget.getResponseText().split("&");
  var answer = Number(response[0].split("=")[1]);
  if (response == "error") {
    this.setErrorMessage(this.lm_.getString("payments", "invalid_username"));
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
  } else {
    if (answer == 0) {
      this.getModel().addUnusedAccount(name);
      if (this.getModel().getAccountsAllowed() == 0) {
        this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.DISABLE_ADDING));
      }
      var currentEvent = new chatango.events.Event(chatango.events.EventType.CONTROLLER_LIST_ADD_CONFIRMED);
      this.dispatchEvent(currentEvent);
    } else {
      var errorString = "";
      if (answer & 1) {
        errorString += this.getCurrentName() + this.lm_.getString("payments", "not_a_user") + "<br/>";
      }
      if (answer & 2) {
        errorString += this.getCurrentName() + this.lm_.getString("payments", "name_group") + "<br/>";
      }
      if (answer & 4) {
        errorString += this.getCurrentName() + this.lm_.getString("payments", "bad_word") + "<br/>";
      }
      if (answer & 8) {
        errorString += this.getCurrentName() + this.lm_.getString("payments", "bad_parts") + "<br/>";
      }
      if (answer & 16) {
        errorString += this.getCurrentName() + this.lm_.getString("payments", "not_expired") + "<br/>";
      }
      if (answer & 32) {
        errorString += this.getCurrentName() + this.lm_.getString("payments", "concurrently_purchased") + "<br/>";
      }
      if (answer & 64) {
        errorString += this.getCurrentName() + this.lm_.getString("payments", "active_group_owner") + "<br/>";
      }
      this.setErrorMessage(errorString);
      this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
    }
  }
};
chatango.payments.UnusedAccountChecker.prototype.addEmail = function(name, email) {
  if (!this.getModel().containsUnusedAccount(name)) {
    this.setErrorMessage(name + this.lm_.getString("payments", "account_not_in_list"));
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_EMAIL_ERROR));
  } else {
    if (this.getModel().containsEmail(name, email)) {
      this.setErrorMessage(email + this.lm_.getString("payments", "email_already_added"));
      this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
      this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_EMAIL_ERROR));
    } else {
      if (!chatango.payments.UnusedAccountChecker.EmailPattern.test(email)) {
        this.setErrorMessage(email + this.lm_.getString("payments", "email_invalid"));
        this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
        this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_EMAIL_ERROR));
      } else {
        var url = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/emailcheckaccsales";
        var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
        var fd = new FormData;
        fd.append("email", email);
        goog.events.listen(xhr, goog.net.EventType.SUCCESS, goog.bind(this.onEmailResponse, this, name, email), undefined, this);
        goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.onBackendResponseFailed, undefined, this);
        xhr.send(url, "POST", fd);
      }
    }
  }
};
chatango.payments.UnusedAccountChecker.prototype.removeEmail = function(name) {
};
chatango.payments.UnusedAccountChecker.prototype.onEmailResponse = function(name, email, e) {
  var response = e.currentTarget.getResponseText().split("&");
  var answer = Number(response[0].split("=")[1]);
  if (answer) {
    this.getModel().addUnusedAccount(name, email);
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_LIST_EMAIL_CONFIRMED));
  } else {
    this.setErrorMessage(email + this.lm_.getString("payments", "email_in_use"));
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_ERROR_MESSAGE));
    this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.CONTROLLER_EMAIL_ERROR));
  }
};
goog.provide("chatango.payments.EmailDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.ViewportManager");
chatango.payments.EmailDialog = function(controller, name, email) {
  this.controller_ = controller;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.name_ = name;
  this.email_ = email;
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  var width = 3 * chatango.managers.Style.getInstance().getScale();
  width = Math.min(this.vsm_.getSize().width * .9, width);
  chatango.ui.ScrollableDialog.call(this, width, undefined, true);
};
goog.inherits(chatango.payments.EmailDialog, chatango.ui.ScrollableDialog);
chatango.payments.EmailDialog.prototype.createDom = function() {
  goog.base(this, "createDom");
  var content = this.getContentElement();
  this.contentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.contentEl_, "sdlg-sc");
  goog.dom.classes.add(this.contentEl_, "content-dialog");
  this.topText_ = goog.dom.createDom("div");
  this.topText_.innerHTML = this.lm_.getString("payments", "email_top");
  this.entryWrapperEl_ = goog.dom.createDom("div", {"style":"display: table;"});
  this.inputWrapperEl_ = goog.dom.createDom("div", {"style":"display: table-cell; width: 100%;"});
  goog.dom.append(this.entryWrapperEl_, this.inputWrapperEl_);
  var placeholder = this.email_ == "" ? this.lm_.getString("payments", "email_entry") : "";
  this.input_ = goog.dom.createDom("input", {"id":"email-entry", "type":"email", "placeholder":placeholder, "value":this.email_, "style":"width: 100%; box-sizing: border-box;", "autocorrect":"off", "autocapitalize":"off"});
  goog.dom.append(this.inputWrapperEl_, this.input_);
  this.buttonWrapperEl_ = goog.dom.createDom("div", {"style":"display: table-cell; overflow:hidden"});
  goog.dom.append(this.entryWrapperEl_, this.buttonWrapperEl_);
  this.addButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "add"));
  this.addButton_.setEnabled(true);
  this.addButton_.render(this.buttonWrapperEl_);
  goog.events.listen(this.addButton_, goog.ui.Component.EventType.ACTION, this.onAddButtonClicked_, false, this);
  goog.events.listen(new goog.events.KeyHandler(this.input_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey && this.addButton_.isEnabled()) {
      this.onAddButtonClicked_();
    }
  }, false, this);
  goog.events.listen(this.controller_, chatango.events.EventType.CONTROLLER_EMAIL_ERROR, this.onEmailError_, false, this);
  this.bottomText_ = goog.dom.createDom("div", {"style":"margin-top:0.3em;"});
  this.bottomText_.innerHTML = this.lm_.getString("payments", "email_bottom");
  goog.dom.append(this.contentEl_, this.topText_);
  goog.dom.append(this.contentEl_, this.entryWrapperEl_);
  goog.dom.append(this.contentEl_, this.bottomText_);
  goog.dom.append(content, this.contentEl_);
};
chatango.payments.EmailDialog.prototype.onAddButtonClicked_ = function(e) {
  var value = this.input_.value.toLowerCase();
  if (value == "") {
    return;
  }
  this.addButton_.setEnabled(false);
  this.controller_.addEmail(this.name_, this.input_.value.toLowerCase());
};
chatango.payments.EmailDialog.prototype.onEmailError_ = function(e) {
  this.addButton_.setEnabled(true);
};
chatango.payments.EmailDialog.prototype.focusInput = function() {
  this.input_.focus();
};
chatango.payments.EmailDialog.prototype.disposeInternal = function() {
  if (this.input_) {
    this.input_ = null;
  }
  if (this.addButton_) {
    goog.events.removeAll(this.addButton_);
    this.addButton_.dispose();
    this.addButton_ = null;
  }
  goog.events.unlisten(this.controller_, chatango.events.EventType.CONTROLLER_EMAIL_ERROR, this.onEmailError_, false, this);
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.payments.UnusedAccountSelectionDialog");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.managers.Environment");
goog.require("chatango.payments.UnusedAccountChecker");
goog.require("chatango.payments.EmailDialog");
goog.require("chatango.ui.ModifiableListDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.CloseButton");
chatango.payments.UnusedAccountSelectionDialog = function(transactionData, opt_domHelper) {
  this.transactionData_ = transactionData;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  var unusedAccountChecker = new chatango.payments.UnusedAccountChecker(transactionData);
  this.emailDialog_ = null;
  chatango.ui.ModifiableListDialog.call(this, unusedAccountChecker, width, opt_domHelper);
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
  this.setTitle(this.lm_.getString("payments", "buy_account"));
};
goog.inherits(chatango.payments.UnusedAccountSelectionDialog, chatango.ui.ModifiableListDialog);
chatango.payments.UnusedAccountSelectionDialog.prototype.createDom = function() {
  chatango.ui.ModifiableListDialog.prototype.createDom.call(this);
  goog.dom.classes.add(this.getElement(), "friends-select");
  var content = this.getHeaderContentElement();
  this.showHeaderContentEl(true);
  this.showHeaderElBorder(true);
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.wrapperEl_ = goog.dom.createDom("div", {"class":"fsl-wrap"});
  this.pitchWrapper_ = goog.dom.createDom("div", {"class":"fsl-pitch-wrap"});
  this.pitchTextEl_ = goog.dom.createDom("div", {"class":"fsl-pitch"});
  if (chatango.managers.Environment.getInstance().isMobile()) {
    this.pitchTextEl_.innerHTML = this.lm_.getString("payments", "buy_account_pitch_small");
  } else {
    this.pitchTextEl_.innerHTML = this.lm_.getString("payments", "buy_account_pitch");
  }
  goog.dom.appendChild(this.pitchWrapper_, this.pitchTextEl_);
  goog.dom.appendChild(this.wrapperEl_, this.pitchWrapper_);
  goog.dom.append(content, this.wrapperEl_);
  var row = this.getInputRow();
  goog.dom.append(content, row);
  var footerContent = this.getFooterContentElement();
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  this.buttonsContainer_ = goog.dom.createDom("div", {"class":"gift-btns"});
  this.totalTitleTextEl_ = goog.dom.createDom("div", {"class":"gift-total-title"});
  goog.dom.append(this.buttonsContainer_, this.totalTitleTextEl_);
  this.currencySelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  var currencyDisplays = this.transactionData_.getCurrencyDisplays();
  for (var i = 0;i < currencyDisplays.length;i++) {
    this.currencySelect_.addItem(new goog.ui.MenuItem(currencyDisplays[i], i));
  }
  this.currencySelect_.setValue(this.transactionData_.getCurrencyIndex());
  goog.events.listen(this.currencySelect_, goog.ui.Component.EventType.ACTION, this.onCurrencyChange_, false, this);
  this.currencyWrap_ = goog.dom.createDom("div", {"class":"gift-currency-wrap"});
  this.currencySelect_.render(this.currencyWrap_);
  goog.dom.append(this.buttonsContainer_, this.currencyWrap_);
  this.totalMessageTextEl_ = goog.dom.createDom("div", {"class":"gift-total"});
  goog.dom.append(this.buttonsContainer_, this.totalMessageTextEl_);
  this.continueButtonWrapperEl_ = goog.dom.createDom("div", {"class":"gift-cont-btn"});
  this.continueButton_ = new chatango.ui.buttons.Button(this.lm_.getString("ui", "next"));
  this.continueButton_.setEnabled(false);
  this.continueButton_.render(this.continueButtonWrapperEl_);
  goog.events.listen(this.continueButton_, goog.ui.Component.EventType.ACTION, this.onContinueButtonClicked_, false, this);
  goog.dom.append(this.buttonsContainer_, this.continueButtonWrapperEl_);
  this.bottomMessageTextEl_ = goog.dom.createDom("div", {"class":"gift-bottom-msg"});
  goog.dom.append(footerContent, this.bottomMessageTextEl_);
  goog.dom.append(footerContent, this.buttonsContainer_);
  this.updateFooterText_();
};
chatango.payments.UnusedAccountSelectionDialog.prototype.onAddConfirmed = function() {
  chatango.ui.ModifiableListDialog.prototype.onAddConfirmed.call(this);
  this.tryEnableContinue_();
  this.updateFooterText_();
};
chatango.payments.UnusedAccountSelectionDialog.prototype.onContinueButtonClicked_ = function() {
  var type = chatango.events.PaymentEvent.EventType.BONUS_SELECTION_DIALOG_REQUEST;
  this.dispatchEvent(new chatango.events.PaymentEvent(type));
};
chatango.payments.UnusedAccountSelectionDialog.prototype.onCurrencyChange_ = function() {
  var currencyIndex = this.currencySelect_.getValue();
  this.transactionData_.setCurrencyIndex(currencyIndex);
  this.updateFooterText_();
};
chatango.payments.UnusedAccountSelectionDialog.prototype.updateFooterText_ = function() {
  this.totalTitleTextEl_.innerHTML = this.lm_.getString("payments", "total");
  this.totalMessageTextEl_.innerHTML = this.transactionData_.getCostText(false);
  this.setHeight();
};
chatango.payments.UnusedAccountSelectionDialog.prototype.createListing = function() {
  var name = this.getController().getCurrentName();
  var accountListingEl = goog.dom.createDom("div", {"class":"mld-listing"});
  var accountListingNameEl = goog.dom.createDom("span", {"class":"unusedaccount-listing-name"}, name);
  var accountListingEmailEl = goog.dom.createDom("span", {"class":"unusedaccount-listing-email goog-link-button link-btn"}, this.lm_.getString("payments", "add_email"));
  var closeEl = goog.dom.createDom("span", {"class":"mld-listing-btn"});
  var closeIcon = new chatango.ui.buttons.CloseButton;
  closeIcon.render(closeEl);
  goog.dom.append(accountListingEl, accountListingNameEl);
  goog.dom.append(accountListingEl, accountListingEmailEl);
  goog.dom.append(accountListingEl, closeEl);
  goog.events.listen(accountListingEmailEl, goog.events.EventType.CLICK, goog.bind(this.openEmailDialog_, this, name), false, this);
  goog.events.listen(closeEl, goog.events.EventType.CLICK, function(e) {
    this.getController().removeName(name);
    this.onRemoveConfirmed();
  }, false, this);
  goog.events.listen(this.getController(), chatango.events.EventType.CONTROLLER_LIST_EMAIL_CONFIRMED, function(e) {
    var email = this.transactionData_.getEmail(name);
    if (email == "") {
      email = this.lm_.getString("payments", "add_email");
    }
    accountListingEmailEl.innerHTML = email;
  }, false, this);
  return accountListingEl;
};
chatango.payments.UnusedAccountSelectionDialog.prototype.openEmailDialog_ = function(name) {
  if (this.emailDialog_) {
    this.closeEmailDialog_();
  }
  this.emailDialog_ = new chatango.payments.EmailDialog(this.getController(), name, this.transactionData_.getEmail(name));
  this.emailDialog_.setResizable(false);
  this.emailDialog_.setVisible(true);
  if (!chatango.managers.Environment.getInstance().isIOS()) {
    this.emailDialog_.focusInput();
  }
  goog.events.listen(this.getController(), chatango.events.EventType.CONTROLLER_LIST_EMAIL_CONFIRMED, this.closeEmailDialog_, false, this);
  goog.events.listen(this.emailDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeEmailDialog_, false, this);
};
chatango.payments.UnusedAccountSelectionDialog.prototype.keepActiveFormElementOnScreen = function() {
  if (this.emailDialog_ && chatango.managers.Environment.getInstance().isAndroid()) {
    chatango.utils.display.keepActiveFormElementOnScreen(this.emailDialog_.getElement());
  }
  goog.base(this, "keepActiveFormElementOnScreen");
};
chatango.payments.UnusedAccountSelectionDialog.prototype.closeEmailDialog_ = function() {
  if (!this.emailDialog_) {
    return;
  }
  goog.events.unlisten(this.getController(), chatango.events.EventType.CONTROLLER_LIST_EMAIL_CONFIRMED, this.closeEmailDialog_, false, this);
  goog.events.unlisten(this.emailDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeEmailDialog_, false, this);
  this.emailDialog_.dispose();
  this.emailDialog_ = null;
  this.tryEnableContinue_();
};
chatango.payments.UnusedAccountSelectionDialog.prototype.onRemoveConfirmed = function() {
  this.closeEmailDialog_();
  this.tryEnableContinue_();
  this.updateFooterText_();
  goog.base(this, "onRemoveConfirmed");
};
chatango.payments.UnusedAccountSelectionDialog.prototype.tryEnableContinue_ = function() {
  this.continueButton_.setEnabled(this.transactionData_.isValid());
};
goog.provide("chatango.payments.PayPalDialog");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.payments.PaymentProcessor");
goog.require("chatango.ui.ScrollableDialog");
chatango.payments.PayPalDialog = function(transactionData, opt_domHelper) {
  this.PaymentProcessor_ = new chatango.payments.PaymentProcessor;
  goog.events.listen(this.PaymentProcessor_, chatango.events.EventType.CREDIT_CARD_ERROR, this.showErrorPU, false, this);
  goog.events.listen(this.PaymentProcessor_, chatango.events.EventType.PAY_PAL_REDIRECT, this.onRedirect, false, this);
  this.transactionData_ = transactionData;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("payments", "pay_with_paypal"));
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
  this.initPayment_();
};
goog.inherits(chatango.payments.PayPalDialog, chatango.ui.ScrollableDialog);
chatango.payments.PayPalDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var scrollContent = this.getContentElement();
  this.cont_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.cont_, "sdlg-sc");
  goog.dom.classes.add(this.cont_, "content-dialog");
  goog.dom.append(scrollContent, this.cont_);
  if (this.redirectString_) {
    this.addOpeningMsg_(this.redirectString_);
  } else {
    this.connectingEl_ = goog.dom.createDom("div", {}, this.lm_.getString("payments", "connecting_pp"));
    goog.dom.append(this.cont_, this.connectingEl_);
  }
};
chatango.payments.PayPalDialog.prototype.addOpeningMsg_ = function() {
  if (this.connectingEl_) {
    goog.style.showElement(this.connectingEl_, false);
  }
  this.openingMsgEl_ = goog.dom.createDom("div", {}, this.lm_.getString("payments", "opening_pp"));
  goog.dom.append(this.cont_, this.openingMsgEl_);
  this.button_ = new chatango.ui.buttons.Button(this.lm_.getString("payments", "open_pp"));
  this.button_.render(this.cont_);
  goog.style.setStyle(this.button_.getElement(), "float", "right");
  goog.events.listen(this.button_, goog.ui.Component.EventType.ACTION, this.openPayPal_, false, this);
  this.afterSuccessEl_ = goog.dom.createDom("div", {"class":"pymt-footnote", "style":"clear: both;"}, this.lm_.getString("payments", "after_pp_success"));
  goog.dom.append(this.cont_, this.afterSuccessEl_);
};
chatango.payments.PayPalDialog.prototype.openPayPal_ = function(e) {
  goog.window.popup(this.redirectString_);
};
chatango.payments.PayPalDialog.prototype.initPayment_ = function() {
  this.PaymentProcessor_.beginTransaction(chatango.payments.PaymentProcessor.PaymentType.PAY_PAL, this.transactionData_);
};
chatango.payments.PayPalDialog.prototype.onRedirect = function(e) {
  this.redirectString_ = e.getString();
  if (this.cont_) {
    setTimeout(goog.bind(this.addOpeningMsg_, this), 1E3);
  }
  goog.window.popup(this.redirectString_);
};
chatango.payments.PayPalDialog.prototype.showErrorPU = function(e, opt_msg) {
  if (this.connectingEl_) {
    goog.style.showElement(this.connectingEl_, false);
  }
  var errorMsg = opt_msg;
  if (errorMsg == null) {
    errorMsg = this.PaymentProcessor_.getErrorMessage();
  }
  this.closeErrorPU_();
  this.errorPU_ = new chatango.ui.ErrorDialog(errorMsg);
  this.errorPU_.setVisible(true);
  this.errorPU_.setResizable(false);
  goog.events.listen(this.errorPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeErrorPU_, false, this);
};
chatango.payments.PayPalDialog.prototype.closeErrorPU_ = function() {
  if (this.errorPU_) {
    this.errorPU_.dispose();
  }
  this.errorPU_ = null;
};
goog.provide("chatango.payments.ThankYouDialog");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.ui.ScrollableDialog");
chatango.payments.ThankYouDialog = function(transactionData, opt_domHelper) {
  this.transactionData_ = transactionData;
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.dm_ = chatango.managers.DateManager.getInstance();
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("payments", "thanks"));
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.setResizable(false);
};
goog.inherits(chatango.payments.ThankYouDialog, chatango.ui.ScrollableDialog);
chatango.payments.ThankYouDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  var smileyWrapper = goog.dom.createDom("div", {"class":"ty-smiley-wrap"});
  var smileyWidth = Math.min(130, Math.round(this.width_ * .75));
  var smiley = new chatango.smileys.svg.SmileSmiley(smileyWidth, smileyWidth, smileyWidth, this.managers_);
  smiley.render(smileyWrapper);
  goog.dom.append(content, smileyWrapper);
  var thankYouText = "<b>" + this.lm_.getString("payments", "thank_you") + "</b>";
  var amountText = this.transactionData_.getCurrencyName() + " " + this.transactionData_.getCostText();
  thankYouText = thankYouText + " " + this.lm_.getString("payments", "your_payment_success").split("*amount*").join(amountText);
  var supporterText = "";
  if (this.transactionData_ instanceof chatango.payments.UnusedAccountTransactionData) {
    supporterText = this.lm_.getString("payments", "buy_account_success");
    supporterText = supporterText.split("*accounts*").join(this.transactionData_.getAccountsListString());
    if (this.transactionData_.getGifteeCount() == 1) {
      supporterText += " " + this.lm_.getString("payments", "as_supporter_you_friend");
      supporterText = supporterText.split("*friend|s*").join(this.lm_.getString("payments", "friend"));
    } else {
      if (this.transactionData_.getGifteeCount() > 1) {
        supporterText += " " + this.lm_.getString("payments", "as_supporter_you_friend");
        supporterText = supporterText.split("*friend|s*").join(this.transactionData_.getGifteeCount() + " " + this.lm_.getString("payments", "friends"));
      }
    }
  } else {
    if (this.transactionData_ instanceof chatango.payments.GiftTransactionData) {
      supporterText = this.lm_.getString("payments", "as_supporter_friend");
      if (this.transactionData_.getGifteeCount() == 1) {
        supporterText = supporterText.split("*friend|s*").join(this.lm_.getString("payments", "friend"));
      } else {
        if (this.transactionData_.getGifteeCount() > 1) {
          supporterText = supporterText.split("*friend|s*").join(this.transactionData_.getGifteeCount() + " " + this.lm_.getString("payments", "friends"));
        }
      }
    } else {
      if (this.transactionData_.getGifteeCount() == 0) {
        supporterText = this.lm_.getString("payments", "as_supporter_you");
        supporterText = supporterText.split("*friend|s*").join(this.lm_.getString("payments", "friend"));
      } else {
        if (this.transactionData_.getGifteeCount() == 1) {
          supporterText = this.lm_.getString("payments", "as_supporter_you_friend");
          supporterText = supporterText.split("*friend|s*").join(this.lm_.getString("payments", "friend"));
        } else {
          if (this.transactionData_.getGifteeCount() > 1) {
            supporterText = this.lm_.getString("payments", "as_supporter_you_friend");
            supporterText = supporterText.split("*friend|s*").join(this.transactionData_.getGifteeCount() + " " + this.lm_.getString("payments", "friends"));
          }
        }
      }
    }
  }
  thankYouText = thankYouText + " " + supporterText;
  this.thankYouTextWrapper_ = goog.dom.createDom("span");
  this.thankYouTextEl_ = goog.dom.createDom("div");
  goog.dom.append(this.thankYouTextWrapper_, this.thankYouTextEl_);
  this.thankYouTextEl_.innerHTML = thankYouText;
  goog.dom.append(content, this.thankYouTextWrapper_);
  var rateLimitInfo = this.transactionData_.getRateLimitInfo();
  var numWarnings = 3;
  if (rateLimitInfo) {
    var rateLimitInfoArray = rateLimitInfo.split(":");
    if (Number(rateLimitInfoArray[0]) - numWarnings < Number(rateLimitInfoArray[1])) {
      var payAgainDay = "";
      if (rateLimitInfoArray[3] != "0") {
        var nextPayDate = new Date(Number(rateLimitInfoArray[3]) * 1E3 + 864E5);
        payAgainDay = this.lm_.getString("payments", "next_pay_day").split("*next_pay_day*").join(this.dm_.dateToString(nextPayDate, "mmm d")) + " ";
      }
      var rateLimitWarningText = this.lm_.getString("payments", "rate_limit");
      rateLimitWarningText = rateLimitWarningText.split("*payments_made*").join(rateLimitInfoArray[1]).split("*max_payments*").join(rateLimitInfoArray[0]);
      rateLimitWarningText = rateLimitWarningText.split("*num_days*").join(rateLimitInfoArray[2]).split("*next_pay_day*").join(payAgainDay);
      rateLimitWarningText = rateLimitWarningText.split("*br*").join("<br>").split("*b*").join("<b>").split("*/b*").join("</b>");
      this.rateLimitWarningTextWrapper_ = goog.dom.createDom("span");
      this.rateLimitWarningTextEl_ = goog.dom.createDom("div");
      goog.dom.append(this.rateLimitWarningTextWrapper_, this.rateLimitWarningTextEl_);
      this.rateLimitWarningTextEl_.innerHTML = rateLimitWarningText;
      goog.dom.append(content, this.rateLimitWarningTextWrapper_);
    }
  }
};
goog.provide("chatango.modules.PaymentsModule");
goog.require("chatango.events.PaymentEvent");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.payments.BonusSelectionDialog");
goog.require("chatango.payments.CreditCardTransactionDialog");
goog.require("chatango.payments.FinalizeGiftDialog");
goog.require("chatango.payments.FinalizeUnusedAccountDialog");
goog.require("chatango.payments.GiftSelectionDialog");
goog.require("chatango.payments.GiftTransactionData");
goog.require("chatango.payments.UnusedAccountSelectionDialog");
goog.require("chatango.payments.UnusedAccountTransactionData");
goog.require("chatango.payments.PayPalDialog");
goog.require("chatango.payments.PremiumPaymentDialog");
goog.require("chatango.payments.ThankYouDialog");
goog.require("chatango.payments.TransactionData");
goog.require("chatango.strings.PaymentStrings");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.events");
chatango.modules.PaymentsModule = function() {
  goog.events.EventTarget.call(this);
  if (chatango.DEBUG) {
    console.log("Creating PaymentsModule");
  }
  this.transactionData_ = null;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("payments", chatango.strings.PaymentStrings.strs, this.initCopy, this);
  this.giftSelectionDialog_ = null;
  this.finalizeGiftDialog_ = null;
  this.finalizeUnusedAccountDialog_ = null;
  this.premiumPaymentDialog_ = null;
  this.bonusSelectionDialog_ = null;
  this.unusedAccountSelectionDialog_ = null;
  this.creditCardDialog_ = null;
  this.thankYouDialog_ = null;
};
goog.inherits(chatango.modules.PaymentsModule, goog.events.EventTarget);
chatango.modules.PaymentsModule.prototype.startPaymentFlow = function(flow) {
  if (flow == chatango.managers.PaymentsManager.FlowEntrance.PREMIUM) {
    this.transactionData_ = new chatango.payments.TransactionData;
    this.openPremiumPaymentDialog_();
  } else {
    if (flow == chatango.managers.PaymentsManager.FlowEntrance.GIVE_TO_FRIENDS) {
      this.transactionData_ = new chatango.payments.GiftTransactionData;
      this.openGiftSelectionDialog_();
    } else {
      if (flow == chatango.managers.PaymentsManager.FlowEntrance.UNUSED_ACCOUNT) {
        this.transactionData_ = new chatango.payments.UnusedAccountTransactionData;
        this.openUnusedAccountSelectionDialog_();
      }
    }
  }
};
chatango.modules.PaymentsModule.prototype.openGiftSelectionDialog_ = function() {
  this.giftSelectionDialog_ = new chatango.payments.GiftSelectionDialog(this.transactionData_);
  this.giftSelectionDialog_.setHasTitleCloseButton(true);
  this.giftSelectionDialog_.setVisible(true);
  goog.events.listen(this.giftSelectionDialog_, chatango.events.PaymentEvent.EventType.FINALIZE_GIFT_DIALOG_REQUEST, this.openFinalizeGiftDialog_, false, this);
};
chatango.modules.PaymentsModule.prototype.openFinalizeGiftDialog_ = function() {
  this.finalizeGiftDialog_ = new chatango.payments.FinalizeGiftDialog(this.transactionData_);
  this.finalizeGiftDialog_.setHasTitleCloseButton(true);
  this.finalizeGiftDialog_.setVisible(true);
  goog.events.listen(this.finalizeGiftDialog_, chatango.events.PaymentEvent.EventType.CREDIT_CARD_TRANSACTION_DIALOG_REQUEST, this.openCreditCardTransactionDialog_, false, this);
  goog.events.listen(this.finalizeGiftDialog_, chatango.events.PaymentEvent.EventType.PAYPAL_FLOW_REQUEST, this.startPayPalFlow_, false, this);
  if (this.dialogActive(this.giftSelectionDialog_)) {
    goog.positioning.positionAtAnchor(this.giftSelectionDialog_.getElement(), goog.positioning.Corner.TOP_LEFT, this.finalizeGiftDialog_.getElement(), goog.positioning.Corner.TOP_LEFT);
    this.giftSelectionDialog_.dispose();
  }
};
chatango.modules.PaymentsModule.prototype.openPremiumPaymentDialog_ = function() {
  this.premiumPaymentDialog_ = new chatango.payments.PremiumPaymentDialog(this.transactionData_, chatango.users.UserManager.getInstance().currentUser.getName());
  this.premiumPaymentDialog_.setHasTitleCloseButton(true);
  this.premiumPaymentDialog_.setVisible(true);
  goog.events.listen(this.premiumPaymentDialog_, chatango.events.PaymentEvent.EventType.BONUS_SELECTION_DIALOG_REQUEST, this.openBonusSelectionDialog_, false, this);
  goog.events.listen(this.premiumPaymentDialog_, chatango.events.PaymentEvent.EventType.CREDIT_CARD_TRANSACTION_DIALOG_REQUEST, this.openCreditCardTransactionDialog_, false, this);
  goog.events.listen(this.premiumPaymentDialog_, chatango.events.PaymentEvent.EventType.PAYPAL_FLOW_REQUEST, this.startPayPalFlow_, false, this);
  if (this.dialogActive(this.bonusSelectionDialog_)) {
    goog.positioning.positionAtAnchor(this.bonusSelectionDialog_.getElement(), goog.positioning.Corner.TOP_LEFT, this.premiumPaymentDialog_.getElement(), goog.positioning.Corner.TOP_LEFT);
    this.bonusSelectionDialog_.dispose();
  }
};
chatango.modules.PaymentsModule.prototype.openBonusSelectionDialog_ = function() {
  this.bonusSelectionDialog_ = new chatango.payments.BonusSelectionDialog(this.transactionData_);
  this.bonusSelectionDialog_.setHasTitleCloseButton(true);
  this.bonusSelectionDialog_.setVisible(true);
  goog.events.listen(this.bonusSelectionDialog_, chatango.events.PaymentEvent.EventType.PREMIUM_PAYMENT_DIALOG_REQUEST, this.openPremiumPaymentDialog_, false, this);
  goog.events.listen(this.bonusSelectionDialog_, chatango.events.PaymentEvent.EventType.CREDIT_CARD_TRANSACTION_DIALOG_REQUEST, this.openCreditCardTransactionDialog_, false, this);
  goog.events.listen(this.bonusSelectionDialog_, chatango.events.PaymentEvent.EventType.PAYPAL_FLOW_REQUEST, this.startPayPalFlow_, false, this);
  goog.events.listen(this.bonusSelectionDialog_, chatango.events.PaymentEvent.EventType.UNUSED_ACCOUNT_PAYMENT_DIALOG_REQUEST, this.openFinalizeUnusedAccountDialog_, false, this);
  if (this.dialogActive(this.premiumPaymentDialog_)) {
    goog.positioning.positionAtAnchor(this.premiumPaymentDialog_.getElement(), goog.positioning.Corner.TOP_LEFT, this.bonusSelectionDialog_.getElement(), goog.positioning.Corner.TOP_LEFT);
    this.premiumPaymentDialog_.dispose();
  } else {
    if (this.dialogActive(this.unusedAccountSelectionDialog_)) {
      goog.positioning.positionAtAnchor(this.unusedAccountSelectionDialog_.getElement(), goog.positioning.Corner.TOP_LEFT, this.bonusSelectionDialog_.getElement(), goog.positioning.Corner.TOP_LEFT);
      this.unusedAccountSelectionDialog_.dispose();
    }
  }
  chatango.utils.display.constrainToStage(this.bonusSelectionDialog_.getElement(), null, true);
};
chatango.modules.PaymentsModule.prototype.openUnusedAccountSelectionDialog_ = function() {
  this.unusedAccountSelectionDialog_ = new chatango.payments.UnusedAccountSelectionDialog(this.transactionData_);
  this.unusedAccountSelectionDialog_.setHasTitleCloseButton(true);
  this.unusedAccountSelectionDialog_.setVisible(true);
  goog.events.listen(this.unusedAccountSelectionDialog_, chatango.events.PaymentEvent.EventType.BONUS_SELECTION_DIALOG_REQUEST, this.openBonusSelectionDialog_, false, this);
  chatango.utils.display.constrainToStage(this.unusedAccountSelectionDialog_.getElement(), null, true);
};
chatango.modules.PaymentsModule.prototype.openFinalizeUnusedAccountDialog_ = function() {
  this.finalizeUnusedAccountDialog_ = new chatango.payments.FinalizeUnusedAccountDialog(this.transactionData_);
  this.finalizeUnusedAccountDialog_.setHasTitleCloseButton(true);
  this.finalizeUnusedAccountDialog_.setVisible(true);
  goog.events.listen(this.finalizeUnusedAccountDialog_, chatango.events.PaymentEvent.EventType.CREDIT_CARD_TRANSACTION_DIALOG_REQUEST, this.openCreditCardTransactionDialog_, false, this);
  goog.events.listen(this.finalizeUnusedAccountDialog_, chatango.events.PaymentEvent.EventType.PAYPAL_FLOW_REQUEST, this.startPayPalFlow_, false, this);
  this.replaceActiveDialog_(this.bonusSelectionDialog_.getElement());
};
chatango.modules.PaymentsModule.prototype.openCreditCardTransactionDialog_ = function() {
  this.creditCardDialog_ = new chatango.payments.CreditCardTransactionDialog(this.transactionData_);
  this.creditCardDialog_.setHasTitleCloseButton(true);
  this.creditCardDialog_.setVisible(true);
  goog.events.listen(this.creditCardDialog_, chatango.events.PaymentEvent.EventType.THANK_YOU_DIALOG_REQUEST, this.openThankYouDialog_, false, this);
  this.replaceActiveDialog_(this.creditCardDialog_.getElement());
};
chatango.modules.PaymentsModule.prototype.startPayPalFlow_ = function(e) {
  this.payPalDialog_ = new chatango.payments.PayPalDialog(this.transactionData_);
  this.payPalDialog_.setHasTitleCloseButton(true);
  this.payPalDialog_.setVisible(true);
  this.replaceActiveDialog_(this.payPalDialog_.getElement());
};
chatango.modules.PaymentsModule.prototype.replaceActiveDialog_ = function(el) {
  var previousDialog = null;
  if (this.dialogActive(this.premiumPaymentDialog_)) {
    previousDialog = this.premiumPaymentDialog_;
  } else {
    if (this.dialogActive(this.bonusSelectionDialog_)) {
      previousDialog = this.bonusSelectionDialog_;
    } else {
      if (this.dialogActive(this.finalizeGiftDialog_)) {
        previousDialog = this.finalizeGiftDialog_;
      } else {
        if (this.dialogActive(this.finalizeUnusedAccountDialog_)) {
          previousDialog = this.finalizeUnusedAccountDialog_;
        } else {
          if (this.dialogActive(this.unusedAccountSelectionDialog_)) {
            previousDialog = this.unusedAccountSelectionDialog_;
          }
        }
      }
    }
  }
  if (previousDialog) {
    goog.positioning.positionAtAnchor(previousDialog.getElement(), goog.positioning.Corner.TOP_LEFT, el, goog.positioning.Corner.TOP_LEFT);
    previousDialog.dispose();
  }
};
chatango.modules.PaymentsModule.prototype.openThankYouDialog_ = function() {
  this.thankYouDialog_ = new chatango.payments.ThankYouDialog(this.transactionData_);
  this.thankYouDialog_.setHasTitleCloseButton(true);
  this.thankYouDialog_.setVisible(true);
  if (this.dialogActive(this.creditCardDialog_)) {
    goog.positioning.positionAtAnchor(this.creditCardDialog_.getElement(), goog.positioning.Corner.TOP_LEFT, this.thankYouDialog_.getElement(), goog.positioning.Corner.TOP_LEFT);
    this.creditCardDialog_.dispose();
  }
};
chatango.modules.PaymentsModule.prototype.dialogActive = function(dialog) {
  return dialog && !dialog.isDisposed();
};
chatango.modules.PaymentsModule.prototype.initCopy = function(pack_id) {
  if (this.premiumPaymentDialog_) {
    this.premiumPaymentDialog_.updateCopy();
  }
  if (this.giftSelectionDialog_) {
    this.giftSelectionDialog_.updateCopy();
  }
};
chatango.modules.PaymentsModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var new_h = Math.round(stage_h);
  var dialogs = [this.giftSelectionDialog_, this.finalizeGiftDialog_, this.premiumPaymentDialog_, this.bonusSelectionDialog_, this.unusedAccountSelectionDialog_, this.creditCardDialog_, this.thankYouDialog_];
  var len = dialogs.length;
  var dialog;
  for (var i = 0;i < len;i++) {
    dialog = dialogs[i];
    if (!this.dialogActive(dialog)) {
      continue;
    }
    dialog.setMaxHeight(new_h * .98);
    if (!dialog.isFullScreenAndMobileOrSmallEmbed()) {
      var vm = chatango.managers.ViewportManager.getInstance();
      var vpWidth = vm.getViewportSizeMonitor().getSize().width;
      var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
      dialog.setWidth(width);
    } else {
      dialog.draw();
    }
    chatango.utils.display.constrainToStage(dialog.getElement(), null, true);
    dialog.keepActiveFormElementOnScreen();
  }
};
goog.module.ModuleManager.getInstance().setLoaded("PaymentsModule");

