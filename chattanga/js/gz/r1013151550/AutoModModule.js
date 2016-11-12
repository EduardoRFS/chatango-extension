goog.provide("chatango.strings.AutoModStrings");
chatango.strings.AutoModStrings.strs = {"auto_mod":"Auto-moderation* (beta)", "block_nonsense":"Basic nonsense detection", "block_repititious":"Block repetitious messages**", "block_ngram_nonsense":"Advanced nonsense detection", "auto_mod_explain":'* Auto moderation detects spam messages. It does not apply to the group owner or moderators with "Exempt from sending limitations" permission.', "char_limit":"** This will also limit the maximum message length to 850 bytes.", "ngram_explain":"Only for use with English, Spanish, French, Portuguese, and German groups"};
goog.provide("chatango.group.moderation.EditAutoModView");
goog.require("chatango.group.GroupInfo");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.utils.style");
goog.require("goog.events.EventType");
goog.require("goog.ui.Component.EventType");
chatango.group.moderation.EditAutoModView = function(opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.model_ = chatango.managers.ManagerManager.getInstance().getManager(chatango.group.GroupInfo.ManagerType);
  goog.events.listen(this.model_, chatango.events.EventType.NLP_UPDATED, this.updateCheckboxes_, false, this);
  this.checkBoxes_ = [];
  this.setResizable(false);
};
goog.inherits(chatango.group.moderation.EditAutoModView, chatango.ui.ScrollableDialog);
chatango.group.moderation.EditAutoModView.Checkboxes = [{title:"block_nonsense", flag:chatango.networking.GroupConnection.flags.NLP_SINGLEMSG}, {title:"block_ngram_nonsense", desc:"ngram_explain", flag:chatango.networking.GroupConnection.flags.NLP_NGRAM}, {title:"block_repititious", flag:chatango.networking.GroupConnection.flags.NLP_MSGQUEUE}];
chatango.group.moderation.EditAutoModView.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  this.contentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.contentEl_, "sdlg-sc");
  goog.dom.classes.add(this.contentEl_, "content-dialog");
  goog.dom.append(scrollContent, this.contentEl_);
  this.cbWrapEl_ = goog.dom.createDom("div", {"class":"sdlg-top-section cb-section"});
  goog.dom.appendChild(this.contentEl_, this.cbWrapEl_);
  var len = chatango.group.moderation.EditAutoModView.Checkboxes.length;
  var obj;
  for (var i = 0;i < len;i++) {
    obj = chatango.group.moderation.EditAutoModView.Checkboxes[i];
    this.makeCheckboxItem_(obj, this.cbWrapEl_);
  }
  this.explainEl_ = goog.dom.createDom("div", {"class":"sdlg-section fineprint"});
  goog.dom.appendChild(this.contentEl_, this.explainEl_);
  this.updateSingleMsgNLPCheckboxEnabled_();
  this.updateCopy();
};
chatango.group.moderation.EditAutoModView.prototype.makeCheckboxItem_ = function(obj, el) {
  isChecked = this.checkFlagState_(obj.flag);
  var checkbox = new chatango.ui.Checkbox;
  checkbox.render(el);
  checkbox.setChecked(isChecked);
  var desc = obj.desc;
  if (desc) {
    var descEl;
    descEl = goog.dom.createDom("div", {"class":"mod_cb_desc"});
    goog.dom.appendChild(el, descEl);
  }
  this.checkBoxes_.push({"cb":checkbox, "title":obj.title, "desc":desc, "descEl":descEl, "flagValue":obj.flag});
  goog.events.listen(checkbox, goog.ui.Component.EventType.CHANGE, function(e) {
    this.onCheckboxChange_(e, obj.flag);
  }, false, this);
};
chatango.group.moderation.EditAutoModView.prototype.getCheckBoxByFlag_ = function(flag) {
  var len = this.checkBoxes_.length;
  var cb;
  for (var i = 0;i < len;i++) {
    if (this.checkBoxes_[i]["flagValue"] == flag) {
      cb = this.checkBoxes_[i]["cb"];
      break;
    }
  }
  return cb;
};
chatango.group.moderation.EditAutoModView.prototype.checkFlagState_ = function(flag) {
  var isChecked = false;
  switch(flag) {
    case chatango.networking.GroupConnection.flags.NLP_SINGLEMSG:
      isChecked = this.model_.getNLPSingleMsg();
      break;
    case chatango.networking.GroupConnection.flags.NLP_MSGQUEUE:
      isChecked = this.model_.getNLPMsgQueue();
      break;
    case chatango.networking.GroupConnection.flags.NLP_NGRAM:
      isChecked = this.model_.getNLPNgram();
      break;
  }
  return isChecked;
};
chatango.group.moderation.EditAutoModView.prototype.onCheckboxChange_ = function(e, flagValue) {
  switch(flagValue) {
    case chatango.networking.GroupConnection.flags.NLP_SINGLEMSG:
      this.model_.setNLPSingleMsg(e.currentTarget.isChecked());
      break;
    case chatango.networking.GroupConnection.flags.NLP_MSGQUEUE:
      this.model_.setNLPMsgQueue(e.currentTarget.isChecked());
      if (e.currentTarget.isChecked()) {
        var singleMsgCb = this.getCheckBoxByFlag_(chatango.networking.GroupConnection.flags.NLP_SINGLEMSG);
        singleMsgCb.checked = true;
        singleMsgCb.setEnabled(false);
      }
      break;
    case chatango.networking.GroupConnection.flags.NLP_NGRAM:
      this.model_.setNLPNgram(e.currentTarget.isChecked());
      if (e.currentTarget.isChecked()) {
        var singleMsgCb = this.getCheckBoxByFlag_(chatango.networking.GroupConnection.flags.NLP_SINGLEMSG);
        singleMsgCb.checked = true;
        singleMsgCb.setEnabled(false);
      }
      break;
  }
};
chatango.group.moderation.EditAutoModView.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("auto_mod", "auto_mod"));
  var len = this.checkBoxes_.length;
  var cb;
  for (var i = 0;i < len;i++) {
    cb = this.checkBoxes_[i]["cb"];
    cb.setCaption(this.lm_.getString("auto_mod", this.checkBoxes_[i]["title"]));
    if (this.checkBoxes_[i]["descEl"]) {
      this.checkBoxes_[i]["descEl"].innerHTML = this.lm_.getString("auto_mod", this.checkBoxes_[i]["desc"]);
    }
  }
  this.updateFootnoteCopy();
};
chatango.group.moderation.EditAutoModView.prototype.updateFootnoteCopy = function() {
  var footnoteCopy = this.lm_.getString("auto_mod", "auto_mod_explain");
  if (this.model_.getNLPMsgQueue()) {
    footnoteCopy += "<BR/>" + this.lm_.getString("auto_mod", "char_limit");
  }
  this.explainEl_.innerHTML = footnoteCopy;
};
chatango.group.moderation.EditAutoModView.prototype.updateCheckboxes_ = function() {
  if (this.checkBoxes_) {
    var len = this.checkBoxes_.length;
    var cb, cbFlag, hasFlag;
    for (var i = 0;i < len;i++) {
      cb = this.checkBoxes_[i]["cb"];
      isChecked = this.checkFlagState_(this.checkBoxes_[i]["flagValue"]);
      cb.setChecked(isChecked);
    }
  }
  this.updateSingleMsgNLPCheckboxEnabled_();
  this.updateFootnoteCopy();
};
chatango.group.moderation.EditAutoModView.prototype.updateSingleMsgNLPCheckboxEnabled_ = function() {
  var singleMsgCb = this.getCheckBoxByFlag_(chatango.networking.GroupConnection.flags.NLP_SINGLEMSG);
  if (this.model_.getNLPMsgQueue() || this.model_.getNLPNgram()) {
    singleMsgCb.setChecked(true);
    singleMsgCb.setEnabled(false);
  } else {
    singleMsgCb.setEnabled(true);
  }
};
chatango.group.moderation.EditAutoModView.prototype.disposeInternal = function() {
  if (this.checkBoxes_) {
    var len = this.checkBoxes_.length;
    var cb;
    for (var i = 0;i < len;i++) {
      cb = this.checkBoxes_[i]["cb"];
      cb.dispose();
    }
    this.checkBoxes_ = null;
  }
  if (this.model_) {
    goog.events.unlisten(this.model_, chatango.events.EventType.NLP_UPDATED, this.updateCheckboxes_, false, this);
  }
  this.checkBoxes_ = null;
  chatango.group.moderation.EditAutoModView.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.AutoModModule");
goog.require("chatango.group.moderation.EditAutoModView");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.ModerationModule");
goog.require("chatango.strings.AutoModStrings");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.AutoModModule = function() {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("auto_mod", chatango.strings.AutoModStrings.strs, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  var modEvents = [chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE];
  goog.events.listen(this.mm_, modEvents, this.onFlagsUpdated_, false, this);
};
chatango.modules.AutoModModule.prototype.onFlagsUpdated_ = function(e) {
  if (this.autoModDialog_) {
    var currentUser = chatango.users.UserManager.getInstance().currentUser;
    var canEditNLP = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_NLP);
    if (!canEditNLP) {
      this.closePopUps();
    }
  }
};
chatango.modules.AutoModModule.prototype.closePopUps = function() {
  if (this.autoModDialog_) {
    this.autoModDialog_.dispose();
  }
};
chatango.modules.AutoModModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.autoModDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.autoModDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.autoModDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.autoModDialog_.getElement());
  }
};
chatango.modules.AutoModModule.prototype.openEditAutoModView = function() {
  this.closePopUps();
  this.autoModDialog_ = new chatango.group.moderation.EditAutoModView;
  this.autoModDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.autoModDialog_.setVisible(true);
  this.constrainDialogsToScreen();
};
chatango.modules.AutoModModule.prototype.initCopy = function(pack_id) {
  if (this.lm_.isPackLoaded("ui") && this.lm_.isPackLoaded("auto_mod")) {
    if (this.autoModDialog_) {
      this.autoModDialog_.updateCopy();
    }
  }
};
goog.module.ModuleManager.getInstance().setLoaded("AutoModModule");

