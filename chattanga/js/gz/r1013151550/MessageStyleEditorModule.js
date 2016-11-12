goog.provide("chatango.messagestyles.MessageStyleEditorModel");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.string");
goog.require("chatango.events.EventType");
goog.require("chatango.networking.GroupConnection");
chatango.messagestyles.MessageStyleEditorModel = function(connection) {
  goog.events.EventTarget.call(this);
  this.connection_ = connection;
  this.handler_ = new goog.events.EventHandler(this);
  this.setFields();
};
goog.inherits(chatango.messagestyles.MessageStyleEditorModel, goog.events.EventTarget);
chatango.messagestyles.MessageStyleEditorModel.prototype.logger = goog.debug.Logger.getLogger("chatango.messagestyles.MessageStyleEditorModel");
goog.provide("chatango.group.configurator.ChangeEvent");
chatango.group.configurator.ChangeEvent = function(type, opt_func, opt_value, opt_target) {
  goog.events.Event.call(this, type, opt_target);
  if (opt_func) {
    this.func_ = opt_func;
  }
  if (opt_value != null || opt_value != undefined) {
    this.value_ = opt_value;
  }
};
chatango.group.configurator.ChangeEvent.EventType = {CHANGE_EVENT:"change_event"};
chatango.group.configurator.ChangeEvent.prototype.getFunc = function() {
  return this.func_;
};
chatango.group.configurator.ChangeEvent.prototype.getValue = function() {
  return this.value_;
};
goog.provide("chatango.group.configurator.AlignmentPanel");
goog.require("chatango.group.configurator.ChangeEvent");
goog.require("goog.ui.Component");
chatango.group.configurator.AlignmentPanel = function(name, alignment, attribute) {
  goog.ui.Component.call(this);
  this.name_ = name;
  this.alignment_ = alignment;
  this.attribute_ = attribute;
};
goog.inherits(chatango.group.configurator.AlignmentPanel, goog.ui.Component);
chatango.group.configurator.AlignmentPanel.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"panel-wrap"});
  this.title_ = goog.dom.createDom("div", {"class":"toggle-title"});
  this.inputsWrap_ = goog.dom.createDom("div", {});
  this.alignmentBox_ = goog.dom.createDom("div", {"id":"alignment-box"});
  this.topLeft_ = goog.dom.createDom("div", {"id":"tl", "class":"align-corner"});
  this.topRight_ = goog.dom.createDom("div", {"id":"tr", "class":"align-corner"});
  this.bottomRight_ = goog.dom.createDom("div", {"id":"br", "class":"align-corner"});
  this.bottomLeft_ = goog.dom.createDom("div", {"id":"bl", "class":"align-corner"});
  this.topLeftDesc_ = goog.dom.createDom("div", {"class":"align-desc"});
  this.topRightDesc_ = goog.dom.createDom("div", {"class":"align-desc"});
  this.bottomRightDesc_ = goog.dom.createDom("div", {"class":"align-desc"});
  this.bottomLeftDesc_ = goog.dom.createDom("div", {"class":"align-desc"});
  goog.style.setInlineBlock(this.alignmentBox_);
  goog.dom.appendChild(this.element_, this.title_);
  goog.dom.appendChild(this.alignmentBox_, this.topLeft_);
  goog.dom.appendChild(this.alignmentBox_, this.topRight_);
  goog.dom.appendChild(this.alignmentBox_, this.bottomRight_);
  goog.dom.appendChild(this.alignmentBox_, this.bottomLeft_);
  goog.dom.appendChild(this.inputsWrap_, this.alignmentBox_);
  goog.dom.appendChild(this.inputsWrap_, this.topLeftDesc_);
  goog.dom.appendChild(this.inputsWrap_, this.bottomLeftDesc_);
  goog.dom.appendChild(this.inputsWrap_, this.topRightDesc_);
  goog.dom.appendChild(this.inputsWrap_, this.bottomRightDesc_);
  goog.dom.appendChild(this.element_, this.inputsWrap_);
  goog.events.listen(this.topLeft_, goog.events.EventType.CLICK, this.respondToInput, false, this);
  goog.events.listen(this.topRight_, goog.events.EventType.CLICK, this.respondToInput, false, this);
  goog.events.listen(this.bottomRight_, goog.events.EventType.CLICK, this.respondToInput, false, this);
  goog.events.listen(this.bottomLeft_, goog.events.EventType.CLICK, this.respondToInput, false, this);
  this.updateCopy();
  this.draw();
};
chatango.group.configurator.AlignmentPanel.prototype.draw = function() {
  if (this.alignment_ == "tl") {
    goog.style.setStyle(this.topLeftDesc_, "display", "inline-block");
    goog.style.setStyle(this.topLeft_, "background-color", "#707070");
  } else {
    goog.style.setStyle(this.topLeftDesc_, "display", "none");
    goog.style.setStyle(this.topLeft_, "background-color", "#CCCCCC");
  }
  if (this.alignment_ == "tr") {
    goog.style.setStyle(this.topRightDesc_, "display", "inline-block");
    goog.style.setStyle(this.topRight_, "background-color", "#707070");
  } else {
    goog.style.setStyle(this.topRightDesc_, "display", "none");
    goog.style.setStyle(this.topRight_, "background-color", "#CCCCCC");
  }
  if (this.alignment_ == "br") {
    goog.style.setStyle(this.bottomRightDesc_, "display", "inline-block");
    goog.style.setStyle(this.bottomRight_, "background-color", "#707070");
  } else {
    goog.style.setStyle(this.bottomRightDesc_, "display", "none");
    goog.style.setStyle(this.bottomRight_, "background-color", "#CCCCCC");
  }
  if (this.alignment_ == "bl") {
    goog.style.setStyle(this.bottomLeftDesc_, "display", "inline-block");
    goog.style.setStyle(this.bottomLeft_, "background-color", "#707070");
  } else {
    goog.style.setStyle(this.bottomLeftDesc_, "display", "none");
    goog.style.setStyle(this.bottomLeft_, "background-color", "#CCCCCC");
  }
};
chatango.group.configurator.AlignmentPanel.prototype.respondToInput = function(e) {
  var target = e.target.id;
  this.alignment_ = target;
  this.dispatchEvent(new chatango.group.configurator.ChangeEvent("change_event", this.attribute_, [this.alignment_]), chatango.group.configurator.ChangeEvent.EventType.CHANGE_EVENT);
  this.draw();
};
chatango.group.configurator.AlignmentPanel.prototype.setName = function(name) {
  this.name_ = name;
  this.updateCopy();
};
chatango.group.configurator.AlignmentPanel.prototype.setAttribute = function(attribute) {
  this.attribute_ = attribute;
};
chatango.group.configurator.AlignmentPanel.prototype.setCurrentValue = function(val) {
  this.alignment_ = val;
  this.draw();
};
chatango.group.configurator.AlignmentPanel.prototype.updateCopy = function() {
  if (!this.element_) {
    return;
  }
  var lm = chatango.managers.LanguageManager.getInstance();
  this.title_.innerHTML = lm.getString("group_configurator", "alignment_title").replace("*type*", this.name_);
  this.topLeftDesc_.innerHTML = lm.getString("group_configurator", "top_left");
  this.topRightDesc_.innerHTML = lm.getString("group_configurator", "top_right");
  this.bottomRightDesc_.innerHTML = lm.getString("group_configurator", "bottom_right");
  this.bottomLeftDesc_.innerHTML = lm.getString("group_configurator", "bottom_left");
};
goog.provide("chatango.messagestyles.MessageStyleEditor");
goog.require("chatango.ui.Checkbox");
goog.require("goog.ui.Select");
goog.require("chatango.utils.Encode");
goog.require("chatango.events.MessageStyleEvent");
goog.require("chatango.embed.AppComm");
goog.require("chatango.managers.ServerTime");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.messagestyles.MessageStyleEditorModel");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.managers.PremiumManager");
goog.require("chatango.managers.SupportChatangoDialogManager");
goog.require("goog.ui.Component.EventType");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.group.configurator.ChangeEvent");
goog.require("chatango.ui.OpacityPicker");
goog.require("chatango.ui.ProgressBar");
goog.require("chatango.group.configurator.AlignmentPanel");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.utils.style");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
goog.require("goog.events.EventType");
goog.require("goog.ui.Component.EventType");
goog.require("chatango.networking.GroupConnectionEvent");
chatango.messagestyles.MessageStyleEditor = function(connection, groupInfo, opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.groupInfo_ = this.managers_.getManager(chatango.group.GroupInfo.ManagerType);
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .7, 3.6 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  var autoSize = true;
  this.user_ = chatango.users.UserManager.getInstance().currentUser;
  this.handler_ = new goog.events.EventHandler(this);
  this.canUseFeatures_ = false;
  this.canSeeFeatures_ = false;
  this.lastSave_ = null;
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.premiumManager_ = chatango.managers.PremiumManager.getInstance();
  this.connection_ = connection;
  this.setResizable(false);
};
goog.inherits(chatango.messagestyles.MessageStyleEditor, chatango.ui.ScrollableDialog);
chatango.messagestyles.MessageStyleEditor.MIN_MSG_BG_UPDATE_INRVL = 3;
chatango.messagestyles.MessageStyleEditor.prototype.logger = goog.debug.Logger.getLogger("chatango.messagestyles.MessageStyleEditor");
chatango.messagestyles.MessageStyleEditor.prototype.dispose = function() {
  chatango.messagestyles.MessageStyleEditor.superClass_.dispose.call(this);
};
chatango.messagestyles.MessageStyleEditor.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  this.handler_.listenOnce(this.premiumManager_, chatango.managers.PremiumManager.EventType.STATUS_LOADED, function(e) {
    this.canUseFeatures_ = this.premiumManager_.getStatus(this.user_) >= 200 || this.user_.isOwner();
    this.canSeeFeatures_ = this.canUseFeatures_ || this.user_.isRegistered() && (!this.groupInfo_ || this.groupInfo_.getPaymentsOk());
    if (this.user_.isMediaLoaded()) {
      this.createElements_();
    } else {
      this.handler_.listenOnce(this.user_, chatango.users.User.EventType.MEDIA_INFO_LOADED, this.createElements_);
      this.user_.loadMediaInfo(true);
    }
  });
  this.premiumManager_.getStatus(this.user_, true);
};
chatango.messagestyles.MessageStyleEditor.prototype.createElements_ = function(e) {
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  this.clone_ = goog.object.clone(this.user_);
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  this.setTitle(this.lm_.getString("message_style_editor", "title"));
  var previewWrapper = goog.dom.createDom("div");
  this.previewBox_ = goog.dom.createDom("div", {"class":"msg", "style":"height: 3em; margin-bottom: 1em; border-bottom: none; border: 1px solid black;"});
  this.backgroundBox_ = goog.dom.createDom("div", {"class":"msg-bg"});
  goog.dom.append(this.previewBox_, this.backgroundBox_);
  goog.dom.append(previewWrapper, this.previewBox_);
  this.foregroundBox_ = goog.dom.createDom("div", {"class":"msg-fg"});
  goog.dom.append(this.previewBox_, this.foregroundBox_);
  var nameColor = this.msManager_.getStyle("nameColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.usernameSpan = goog.dom.createDom("span", {"style":"color:#" + nameColor + ";"});
  this.usernameSpan.innerHTML = this.user_.getSid();
  goog.dom.append(this.foregroundBox_, this.usernameSpan);
  var colonSpan = goog.dom.createDom("span");
  colonSpan.innerHTML = " : ";
  goog.dom.append(this.foregroundBox_, colonSpan);
  var textColor = this.msManager_.getStyle("textColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.sampleMessageSpan = goog.dom.createDom("span", {"style":"color:#" + textColor + ";"});
  this.sampleMessageSpan.innerHTML = "Sample message text";
  goog.dom.append(this.foregroundBox_, this.sampleMessageSpan);
  goog.dom.append(content, previewWrapper);
  var nameColorWrapper = goog.dom.createDom("div", {"class":"form-el-wrap"});
  var nameColorLabel = goog.dom.createDom("span", {"style":"float: left; padding-right: 2em;"});
  nameColorLabel.innerHTML = this.lm_.getString("message_style_editor", "name_color");
  goog.dom.append(nameColorWrapper, nameColorLabel);
  this.nameColorPickerButton_ = new chatango.ui.ColorPickerButton(nameColor);
  this.nameColorPickerButton_.render(nameColorWrapper);
  this.nameColorPickerButton_.getElement().style.cssFloat = "right";
  goog.dom.append(content, nameColorWrapper);
  goog.events.listen(this.nameColorPickerButton_, chatango.ui.ColorPickerButton.EventType.COLOR_CHANGE, this.onNameColor_, undefined, this);
  if (this.canSeeFeatures_) {
    var bgColorWrapper = goog.dom.createDom("div", {"class":"form-el-wrap"});
    var bgColorLabel = goog.dom.createDom("span", {"style":"float: left; padding-right: 2em;"});
    bgColorLabel.innerHTML = this.lm_.getString("message_style_editor", "bg_color");
    goog.dom.append(bgColorWrapper, bgColorLabel);
    this.bgColorPickerButton = new chatango.ui.ColorPickerButton(this.user_.getBgColor());
    this.bgColorPickerButton.render(bgColorWrapper);
    this.bgColorPickerButton.getElement().style.cssFloat = "right";
    goog.dom.append(content, bgColorWrapper);
    if (this.canUseFeatures_) {
      goog.events.listen(this.bgColorPickerButton, chatango.ui.ColorPickerButton.EventType.COLOR_CHANGE, this.onBgColor_, undefined, this);
    } else {
      this.bgColorPickerButton.setEnabled(false);
      goog.events.listen(this.bgColorPickerButton.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    }
    var backgroundOpacityWrapper = goog.dom.createDom("div", {"class":"form-el-wrap", "style":"padding-bottom:.8em"});
    var backgroundOpacityLabel = goog.dom.createDom("span", {"style":"float: left; padding-right: 2em;"});
    backgroundOpacityLabel.innerHTML = this.lm_.getString("message_style_editor", "bg_transparency");
    goog.dom.append(backgroundOpacityWrapper, backgroundOpacityLabel);
    this.bgOpacityPicker_ = new chatango.ui.OpacityPicker("background_opacity_picker", this.user_.getBgAlpha(), this.user_.getBgColor());
    this.bgOpacityPicker_.render(backgroundOpacityWrapper);
    this.bgOpacityPicker_.getElement().style.cssFloat = "right";
    goog.dom.append(content, backgroundOpacityWrapper);
    if (this.canUseFeatures_) {
      goog.events.listen(this.bgOpacityPicker_, chatango.ui.OpacityPicker.EventType.OPACITY_CHANGE, this.onBgOpacity, undefined, this);
    } else {
      this.bgOpacityPicker_.setEnabled(false);
      goog.events.listen(this.bgOpacityPicker_.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    }
    this.imageButtons = goog.dom.createDom("div", {"class":"form-el-wrap image-btns"});
    this.uploadFile_ = goog.dom.createDom("input", {"type":"file", "accept":"image/*;capture=camera", "style":"display:none;"});
    goog.dom.append(this.imageButtons, this.uploadFile_);
    goog.events.listen(this.uploadFile_, "change", this.uploadedFile, undefined, this);
    this.uploadButton_ = new chatango.ui.buttons.Button(this.lm_.getString("message_style_editor", "upload"));
    var uploadWrapper = goog.dom.createDom("div", {"class":"image-btn-cell"});
    this.uploadButton_.render(uploadWrapper);
    goog.dom.append(this.imageButtons, uploadWrapper);
    if (this.canUseFeatures_) {
      goog.events.listen(this.uploadButton_, goog.ui.Component.EventType.ACTION, this.uploadClicked_, undefined, this);
    } else {
      this.uploadButton_.setEnabled(false);
      goog.events.listen(this.uploadButton_.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    }
    this.clearButton_ = new chatango.ui.buttons.Button(this.lm_.getString("message_style_editor", "clear"));
    var clearWrapper = goog.dom.createDom("div", {"class":"image-btn-cell"});
    this.clearButton_.render(clearWrapper);
    goog.dom.append(this.imageButtons, clearWrapper);
    goog.events.listen(this.clearButton_.getElement(), goog.events.EventType.CLICK, this.clearClicked_, undefined, this);
    goog.dom.append(content, this.imageButtons);
    this.progressBar_ = new chatango.ui.ProgressBar;
    this.checkboxWrapper = goog.dom.createDom("div", {"class":"form-el-wrap", "style":"padding-bottom:.5em;"});
    this.tileImageBox_ = new chatango.ui.Checkbox;
    this.tileImageBox_.render(this.checkboxWrapper);
    goog.dom.append(content, this.checkboxWrapper);
    this.tileImageBox_.setChecked(this.user_.getBgTile());
    this.tileImageBox_.setCaption(this.lm_.getString("message_style_editor", "tile_image"));
    goog.events.listen(this.tileImageBox_, "change", this.tileClicked_, undefined, this);
    this.alignImageWrapper = goog.dom.createDom("div", {"class":"form-el-wrap"});
    var alignImageLabel = goog.dom.createDom("span", {"style":"float: left; padding-right: 3em;"});
    alignImageLabel.innerHTML = this.lm_.getString("message_style_editor", "align_image");
    goog.dom.append(this.alignImageWrapper, alignImageLabel);
    this.alignImage_ = new chatango.group.configurator.AlignmentPanel("Tab", this.user_.bgAlign_, "setPos");
    this.alignImage_.render(this.alignImageWrapper);
    this.alignImage_.getElement().style.cssFloat = "right";
    goog.dom.append(content, this.alignImageWrapper);
    goog.events.listen(this.alignImage_, chatango.group.configurator.ChangeEvent.EventType.CHANGE_EVENT, this.alignClicked_, undefined, this);
    this.imageOpacityWrapper = goog.dom.createDom("div", {"class":"form-el-wrap", "style":"padding-bottom:.8em"});
    var imageOpacityLabel = goog.dom.createDom("span", {"style":"float: left; padding-right: 3em;"});
    imageOpacityLabel.innerHTML = this.lm_.getString("message_style_editor", "img_transparency");
    goog.dom.append(this.imageOpacityWrapper, imageOpacityLabel);
    this.imageOpacityPicker_ = new chatango.ui.OpacityPicker("image_opacity_picker", this.user_.bgImgAlpha_);
    this.imageOpacityPicker_.render(this.imageOpacityWrapper);
    this.imageOpacityPicker_.getElement().style.cssFloat = "right";
    goog.dom.append(content, this.imageOpacityWrapper);
    goog.events.listen(this.imageOpacityPicker_, chatango.ui.OpacityPicker.EventType.OPACITY_CHANGE, this.onImgOpacity, undefined, this);
    var useImage = this.msManager_.getStyle("usebackground");
    this.useImageBox_ = new chatango.ui.Checkbox;
    this.useImageBox_.render(content);
    this.useImageBox_.setChecked(useImage === "1");
    this.useImageBox_.setCaption(this.lm_.getString("message_style_editor", "use_image"));
    if (this.canUseFeatures_) {
      goog.events.listen(this.useImageBox_, "change", this.useImageClicked_, undefined, this);
    } else {
      this.useImageBox_.setEnabled(false);
      goog.events.listen(this.useImageBox_.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    }
    this.determineVisibility();
  }
  this.drawPreviewBox_();
  this.waitDiv_ = goog.dom.createDom("div", {"style":"overflow:hidden; padding-bottom:0.2em"});
  goog.dom.append(this.footerContentEl_, this.waitDiv_);
  var saveButtonWrapper = goog.dom.createDom("div", {"style":"overflow:hidden; padding-bottom:0.2em"});
  this.saveButton_ = new chatango.ui.buttons.Button(this.lm_.getString("message_style_editor", "save"));
  this.saveButton_.render(saveButtonWrapper);
  this.saveButton_.getElement().style.cssFloat = "right";
  goog.dom.append(this.footerContentEl_, saveButtonWrapper);
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  goog.events.listen(this.saveButton_, goog.ui.Component.EventType.ACTION, this.onSave_, undefined, this);
  this.scrollPane_.draw();
  if (chatango.managers.Environment.getInstance().isIOS()) {
    var stage_h = this.viewportManager_.getViewportSizeMonitor().getSize().height;
    var stage_w = goog.style.getBounds(goog.dom.getDocument().body).width;
    var rect = new goog.math.Rect(0, 0, stage_w, stage_h);
    var new_h = Math.round(stage_h);
  } else {
    var stage_h = goog.style.getBounds(goog.dom.getDocument().body).height;
    var stage_w = goog.style.getBounds(goog.dom.getDocument().body).width;
    var rect = new goog.math.Rect(0, 0, stage_w, stage_h);
    var new_h = Math.round(stage_h);
  }
  var heightConstraint = chatango.managers.Environment.getInstance().isMobile() ? 1 : .85;
  this.setMaxHeight(new_h * heightConstraint);
  chatango.utils.display.constrainToStage(this.getElement(), rect, true);
  this.keepActiveFormElementOnScreen();
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.LOADED);
};
chatango.messagestyles.MessageStyleEditor.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.nameColorPickerButton_) {
    this.nameColorPickerButton_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.bgColorPickerButton) {
    this.bgColorPickerButton.constrainDialogsToScreen(opt_stageRect);
  }
  chatango.managers.SupportChatangoDialogManager.getInstance().constrainDialogToScreen(opt_stageRect);
};
chatango.messagestyles.MessageStyleEditor.prototype.onSave_ = function(e) {
  if (chatango.DEBUG) {
    console.log("MessageStyleEditor onSave_");
  }
  var interval = chatango.messagestyles.MessageStyleEditor.MIN_MSG_BG_UPDATE_INRVL;
  if (this.lastSave_ && (new Date).getTime() - this.lastSave_ < interval * 1E3) {
    var s = Math.ceil(interval - ((new Date).getTime() - this.lastSave_) / 1E3);
    var plural = s > 1 ? "s" : "";
    this.waitDiv_.innerHTML = "You are changing your background too quickly. Please wait " + s + " second" + plural + " and try again.";
    this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.WAIT_MSG);
    return;
  }
  this.waitDiv_.innerHTML = "";
  this.saveButton_.setContent("Saving");
  this.saveButton_.setAlert(false);
  this.saveButton_.setEnabled(false);
  this.msManager_.setStyle("nameColor", this.nameColorPickerButton_.getColor());
  if (this.canUseFeatures_) {
    var baseDomain = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
    var uploadUrl = "//" + baseDomain + "/updatemsgbg";
    var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(uploadUrl, true);
    var fd = new FormData;
    var username = goog.net.cookies.get("un") || "";
    var password = goog.net.cookies.get("pw") || "";
    if (username != "") {
      var encoder = chatango.utils.Encode.getInstance();
      username = encoder.decode(username);
      password = encoder.decode(password);
    } else {
      return;
    }
    fd.append("lo", username);
    fd.append("p", password);
    var hasRec = this.user_.getBgRecTimestamp() ? this.user_.getBgRecTimestamp() : 0;
    fd.append("hasrec", hasRec);
    if (this.tileImageBox_.isChecked()) {
      fd.append("tile", 1);
    } else {
      fd.append("tile", 0);
    }
    if (this.clone_.getBgUseImg()) {
      fd.append("useimg", 1);
    } else {
      fd.append("useimg", 0);
    }
    fd.append("ialp", this.imageOpacityPicker_.getOpacity());
    fd.append("bgc", this.bgColorPickerButton.getColor());
    fd.append("bgalp", this.bgOpacityPicker_.getOpacity());
    fd.append("align", this.alignImage_.alignment_);
    fd.append("isvid", this.user_.getBgIsVid() ? 1 : 0);
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.success_, undefined, this);
    xhr.send(uploadUrl, "POST", fd);
    var bin = "";
    if (this.useImageBox_.isChecked()) {
      bin = "1";
    } else {
      bin = "0";
    }
    this.msManager_.setStyle("usebackground", bin);
    this.connection_.send("msgbg:" + bin);
  } else {
    this.success_();
  }
};
chatango.messagestyles.MessageStyleEditor.prototype.success_ = function(e) {
  this.lastSave_ = (new Date).getTime();
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "saved"));
  this.saveButton_.setEnabled(true);
  this.handler_.listenOnce(this.user_, chatango.users.User.EventType.MEDIA_INFO_LOADED, function(e) {
    var evt = new goog.events.Event(chatango.events.MessageStyleEvent.EventType.CHANGED);
    evt.data = "mse";
    this.dispatchEvent(evt);
  });
  this.user_.loadMediaInfo(true);
  this.connection_.send("miu");
};
chatango.messagestyles.MessageStyleEditor.prototype.uploadClicked_ = function(e) {
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    this.clone_.setBgUseImg(true);
    chatango.embed.AppComm.getInstance().alertBgUpload(this.uploadSuccess_, this);
  } else {
    this.uploadFile_.click();
  }
};
chatango.messagestyles.MessageStyleEditor.prototype.uploadedFile = function(e) {
  if (this.uploadFile_.value === "") {
    return;
  }
  this.uploadMediaDialog_ = new chatango.ui.UploadMediaDialog;
  this.uploadMediaDialog_.setVisible(true);
  this.clone_.setBgUseImg(true);
  var baseDomain = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  var uploadUrl = "//" + baseDomain + "/updatemsgbg";
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(uploadUrl, true);
  var fd = new FormData;
  var username = goog.net.cookies.get("un") || "";
  var password = goog.net.cookies.get("pw") || "";
  if (username != "") {
    var encoder = chatango.utils.Encode.getInstance();
    username = encoder.decode(username);
    password = encoder.decode(password);
  } else {
    return;
  }
  fd.append("lo", username);
  fd.append("p", password);
  fd.append("Filedata", e.target.files[0]);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.uploadSuccess_, undefined, this);
  goog.events.listen(xhr, goog.net.EventType.ERROR, this.uploadError_, undefined, this);
  goog.events.listen(xhr, "progress", this.updateProgress_, undefined, this);
  xhr.send(uploadUrl, "POST", fd);
};
chatango.messagestyles.MessageStyleEditor.prototype.uploadSuccess_ = function(e) {
  if (this.canUseFeatures_) {
    this.useImageBox_.setChecked(true);
  }
  this.clone_.setBgColor("FFFFFF");
  this.bgColorPickerButton.setColor("FFFFFF");
  this.bgOpacityPicker_.setColor("FFFFFF");
  this.onSave_();
  if (this.uploadMediaDialog_ !== undefined) {
    this.uploadMediaDialog_.setVisible(false);
  }
  this.determineVisibility();
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.uploadError_ = function(e) {
  this.uploadMediaDialog_.setVisible(false);
};
chatango.messagestyles.MessageStyleEditor.prototype.drawPreviewBox_ = function() {
  var nameColor = this.nameColorPickerButton_.getColor() || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.usernameSpan.style.color = "#" + nameColor;
  var textColor = this.msManager_.getStyle("textColor") || chatango.managers.Style.getInstance().getMsgTextColor().replace("#", "");
  this.sampleMessageSpan.style.color = "#" + textColor;
  if (this.canUseFeatures_ && this.useImageBox_.isChecked()) {
    this.clone_.cssBgHelper_(this.backgroundBox_);
    if (this.msManager_.getStyle("usebackground") === "0" || !this.clone_.getBgUseImg()) {
      if (goog.dom.classes.has(this.backgroundBox_, "bg-image-" + this.user_.getUid())) {
        goog.dom.classes.remove(this.backgroundBox_, "bg-image-" + this.user_.getUid());
      }
    }
  } else {
    if (this.canUseFeatures_) {
      this.backgroundBox_.parentNode.style.backgroundColor = "#FFFFFF";
    }
    if (this.msManager_.getStyle("usebackground") === "0" || !this.clone_.getBgUseImg()) {
      if (goog.dom.classes.has(this.backgroundBox_, "bg-image-" + this.user_.getUid())) {
        goog.dom.classes.remove(this.backgroundBox_, "bg-image-" + this.user_.getUid());
      }
    }
  }
};
chatango.messagestyles.MessageStyleEditor.prototype.onNameColor_ = function(e) {
  this.usernameSpan.style.color = "#" + this.nameColorPickerButton_.getColor();
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.saveButton_.setAlert(true);
  if (this.canUseFeatures_) {
    this.useImageBox_.setChecked(true);
  }
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.onBgColor_ = function(e) {
  this.saveButton_.setAlert(true);
  this.clone_.setBgColor(this.bgColorPickerButton.getColor());
  this.bgOpacityPicker_.setColor(this.bgColorPickerButton.getColor());
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.useImageBox_.setChecked(true);
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.onBgOpacity = function(e) {
  this.saveButton_.setAlert(true);
  this.clone_.setBgAlpha(this.bgOpacityPicker_.getOpacity());
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.useImageBox_.setChecked(true);
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.clearClicked_ = function(e) {
  this.saveButton_.setAlert(true);
  this.clone_.setBgUseImg(false);
  this.uploadFile_.value = "";
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.determineVisibility();
  this.useImageBox_.setChecked(true);
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.tileClicked_ = function(e) {
  this.saveButton_.setAlert(true);
  this.clone_.setBgTile(this.tileImageBox_.isChecked());
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.useImageBox_.setChecked(true);
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.useImageClicked_ = function(e) {
  this.saveButton_.setAlert(true);
  var bin = "";
  if (this.useImageBox_.isChecked()) {
    bin = "1";
  } else {
    bin = "0";
  }
  this.msManager_.setStyle("usebackground", bin);
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.alignClicked_ = function(e) {
  this.clone_.setBgAlign(this.alignImage_.alignment_);
  this.saveButton_.setAlert(true);
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.useImageBox_.setChecked(true);
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.onImgOpacity = function(e) {
  this.clone_.setBgImgAlpha(this.imageOpacityPicker_.getOpacity());
  this.saveButton_.setAlert(true);
  this.saveButton_.setContent(this.lm_.getString("message_style_editor", "save"));
  this.useImageBox_.setChecked(true);
  this.drawPreviewBox_();
};
chatango.messagestyles.MessageStyleEditor.prototype.determineVisibility = function() {
  var value = this.clone_.bgUseImg_ ? "" : "none";
  this.imageOpacityWrapper.style.display = value;
  if (this.clone_.bgUseImg_) {
    this.imageOpacityPicker_.draw();
  }
  this.alignImageWrapper.style.display = value;
  this.clearButton_.getElement().style.display = value;
  this.checkboxWrapper.style.display = value;
  this.scrollPane_.draw();
};
chatango.messagestyles.MessageStyleEditor.prototype.openSupportChatangoDialog_ = function(e) {
  chatango.managers.SupportChatangoDialogManager.getInstance().openDialog(chatango.managers.PaymentsManager.FlowEntrance.PREMIUM, this);
  this.constrainDialogsToScreen();
};
chatango.messagestyles.MessageStyleEditor.prototype.updateProgress_ = function(e) {
  this.uploadMediaDialog_.updateProgress(e);
};
chatango.messagestyles.MessageStyleEditor.prototype.onHide = function(e) {
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CLOSED);
  goog.base(this, "onHide");
};
chatango.messagestyles.MessageStyleEditor.prototype.disposeInternal = function() {
  if (this.bgColorPickerButton) {
    goog.events.unlisten(this.bgColorPickerButton, chatango.ui.ColorPickerButton.EventType.COLOR_CHANGE, this.onBgColor_, undefined, this);
    goog.events.unlisten(this.bgColorPickerButton.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    this.bgColorPickerButton.dispose();
    this.bgColorPickerButton = null;
  }
  if (this.bgOpacityPicker_) {
    goog.events.unlisten(this.bgOpacityPicker_, chatango.ui.OpacityPicker.EventType.OPACITY_CHANGE, this.onBgOpacity, undefined, this);
    goog.events.unlisten(this.bgOpacityPicker_.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    this.bgOpacityPicker_.dispose();
    this.bgOpacityPicker_ = null;
  }
  if (this.uploadButton_) {
    goog.events.unlisten(this.uploadButton_, goog.ui.Component.EventType.ACTION, this.uploadClicked_, undefined, this);
    goog.events.unlisten(this.uploadButton_.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    this.uploadButton_.dispose();
    this.uploadButton_ = null;
  }
  if (this.useImageBox_) {
    goog.events.unlisten(this.useImageBox_, "change", this.useImageClicked_, undefined, this);
    goog.events.unlisten(this.useImageBox_.getElement(), goog.events.EventType.CLICK, this.openSupportChatangoDialog_, undefined, this);
    this.useImageBox_.dispose();
    this.useImageBox_ = null;
  }
  chatango.messagestyles.MessageStyleEditor.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.strings.MessageStyleEditorStrings");
chatango.strings.MessageStyleEditorStrings.strs = {"title":"Message style editor", "upload":"Upload image", "clear":"Clear image", "tile_image":"Tile image", "use_image":"Use this background", "name_color":"Name color", "bg_color":"Bg color", "bg_transparency":"Bg transparency", "img_transparency":"Image transparency", "align_image":"Align image", "save":"Save", "saved":"Saved"};
goog.provide("chatango.modules.MessageStyleEditorModule");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.messagestyles.MessageStyleEditor");
goog.require("chatango.messagestyles.MessageStyleEditorModel");
goog.require("chatango.strings.MessageStyleEditorStrings");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.MessageStyleEditorModule = function(connection) {
  goog.events.EventTarget.call(this);
  if (chatango.DEBUG) {
    this.logger.info("Creating MessageStyleEditorModule");
  }
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("message_style_editor", chatango.strings.MessageStyleEditorStrings.strs, this.initCopy, this);
  this.connection_ = connection;
};
goog.inherits(chatango.modules.MessageStyleEditorModule, goog.events.EventTarget);
chatango.modules.MessageStyleEditorModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.MessageStyleEditorModule");
chatango.modules.MessageStyleEditorModule.prototype.closePopUps = function() {
  if (this.messageStyleEditor_) {
    this.messageStyleEditor_.dispose();
  }
};
chatango.modules.MessageStyleEditorModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.messageStyleEditor_.isVisible()) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h);
    this.messageStyleEditor_.setMaxHeight(new_h * .98);
    if (!this.messageStyleEditor_.isFullScreenAndMobileOrSmallEmbed()) {
      this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
      this.managers_ = chatango.managers.ManagerManager.getInstance();
      var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
      var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
      this.messageStyleEditor_.setWidth(width);
    } else {
      this.messageStyleEditor_.draw();
    }
    chatango.utils.display.constrainToStage(this.messageStyleEditor_.getElement(), opt_stageRect, true);
    this.messageStyleEditor_.keepActiveFormElementOnScreen();
    this.messageStyleEditor_.constrainDialogsToScreen(opt_stageRect);
  }
};
chatango.modules.MessageStyleEditorModule.prototype.openMessageStyleEditorDialog = function() {
  this.closePopUps();
  this.messageStyleEditor_ = new chatango.messagestyles.MessageStyleEditor(this.connection_);
  this.messageStyleEditor_.setVisible(true);
  goog.events.listen(this.messageStyleEditor_, chatango.events.MessageStyleEvent.EventType.WAIT_MSG, this.constrainDialogsToScreenWithDelay, undefined, this);
  goog.events.listen(this.messageStyleEditor_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changed_, undefined, this);
  goog.events.listen(this.messageStyleEditor_, chatango.events.MessageStyleEvent.EventType.LOADED, this.loaded_, undefined, this);
  goog.events.listen(this.messageStyleEditor_, chatango.events.MessageStyleEvent.EventType.CLOSED, this.closed_, undefined, this);
  var keyboard = chatango.managers.Keyboard.getInstance();
  goog.events.listenOnce(keyboard, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED, this.constrainDialogsToScreenWithDelay, undefined, this);
  this.constrainDialogsToScreen();
  return this.messageStyleEditor_;
};
chatango.modules.MessageStyleEditorModule.prototype.initCopy = function(pack_id) {
  if (this.messageStyleEditor_) {
    this.messageStyleEditor_.updateCopy();
  }
};
chatango.modules.MessageStyleEditorModule.prototype.constrainDialogsToScreenWithDelay = function(opt_stageRect) {
  setTimeout(function() {
    this.constrainDialogsToScreen(opt_stageRect);
  }.bind(this), 100);
};
chatango.modules.MessageStyleEditorModule.prototype.changed_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.MessageStyleEditorModule.prototype.closed_ = function(e) {
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CLOSED);
};
chatango.modules.MessageStyleEditorModule.prototype.loaded_ = function(e) {
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.LOADED);
};
goog.module.ModuleManager.getInstance().setLoaded("MessageStyleEditorModule");

