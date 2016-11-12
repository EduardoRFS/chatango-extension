goog.provide("chatango.strings.SoundDialogStrings");
chatango.strings.SoundDialogStrings = {"play_sounds":"Play sounds:", "every":"On every message", "replys_only":"Only on @ replies", "never":"Never", "mute_when_hidden":"Mute when page is hidden"};
goog.provide("chatango.ui.SoundDialog");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.positioning");
goog.require("chatango.events.EventType");
goog.require("chatango.audio.AudioController");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.display");
chatango.ui.SoundDialog = function(speakerEl) {
  this.speakerEl_ = speakerEl;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var tarWmultiplier = chatango.managers.Environment.getInstance().isAndroid() ? 2.65 : 2;
  var width = Math.min(vpWidth * .9, Math.round(tarWmultiplier * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true);
  this.setResizable(false);
};
goog.inherits(chatango.ui.SoundDialog, chatango.ui.ScrollableDialog);
chatango.ui.SoundDialog.prototype.createDom = function() {
  chatango.ui.SoundDialog.superClass_.createDom.call(this);
  this.showHeaderContentEl(false);
  this.showHeaderElBorder(false);
  this.showTitleBarBg(false);
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "edit-dialog");
  goog.dom.append(scrollContent, content);
  this.playAllWrapperEl = goog.dom.createDom("div", {"class":"sdlg-top-section", "id":"playAll-wrapper"});
  this.playAllRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"restrictions", "id":"playAll"});
  this.playAllLabelEl = goog.dom.createDom("label", {"for":"playAll", "onclick":""});
  goog.dom.appendChild(this.playAllWrapperEl, this.playAllRadioEl);
  goog.dom.appendChild(this.playAllWrapperEl, this.playAllLabelEl);
  goog.dom.appendChild(content, this.playAllWrapperEl);
  this.playMineWrapperEl = goog.dom.createDom("div", {"class":"sdlg-top-section", "id":"playMine-wrapper"});
  this.playMineRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"restrictions", "id":"playMine"});
  this.playMineLabelEl = goog.dom.createDom("label", {"for":"playMine", "onclick":""});
  goog.dom.appendChild(this.playMineWrapperEl, this.playMineRadioEl);
  goog.dom.appendChild(this.playMineWrapperEl, this.playMineLabelEl);
  goog.dom.appendChild(content, this.playMineWrapperEl);
  this.playNoneWrapperEl = goog.dom.createDom("div", {"class":"sdlg-top-section", "id":"playNone-wrapper"});
  this.playNoneRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"restrictions", "id":"playNone"});
  this.playNoneLabelEl = goog.dom.createDom("label", {"for":"playNone", "onclick":""});
  goog.dom.appendChild(this.playNoneWrapperEl, this.playNoneRadioEl);
  goog.dom.appendChild(this.playNoneWrapperEl, this.playNoneLabelEl);
  goog.dom.appendChild(content, this.playNoneWrapperEl);
  if (chatango.managers.Environment.getInstance().isAndroid()) {
    this.mutedWhenHiddenCheckBox_ = new chatango.ui.Checkbox;
    this.mutedWhenHiddenCheckBox_.render(content);
    goog.events.listen(this.mutedWhenHiddenCheckBox_, "change", this.onMutedWhenHiddenCheckBoxClicked, undefined, this);
  }
  goog.events.listen(this.playAllRadioEl, goog.events.EventType.CLICK, this.onPlayAll, false, this);
  goog.events.listen(this.playMineRadioEl, goog.events.EventType.CLICK, this.onPlayMine, false, this);
  goog.events.listen(this.playNoneRadioEl, goog.events.EventType.CLICK, this.onPlayNone, false, this);
  this.okButton_ = new chatango.ui.buttons.Button(chatango.managers.LanguageManager.getInstance().getString("ui", "ok"));
  this.okButton_.render(content);
  this.okButton_.getElement().style.cssFloat = "right";
  goog.events.listen(this.okButton_, goog.ui.Component.EventType.ACTION, this.onOkButtonClick, false, this);
  this.updateCopy();
  chatango.audio.AudioController.getInstance().registerView(this);
};
chatango.ui.SoundDialog.prototype.onOkButtonClick = function(e) {
  this.dispose();
};
chatango.ui.SoundDialog.prototype.setState = function(muted, volume, atReplysAubible, mutedWhenHidden) {
  this.playAllRadioEl.checked = false;
  this.playMineRadioEl.checked = false;
  this.playNoneRadioEl.checked = false;
  if (!muted) {
    this.playAllRadioEl.checked = true;
  } else {
    if (atReplysAubible) {
      this.playMineRadioEl.checked = true;
    } else {
      this.playNoneRadioEl.checked = true;
    }
  }
  if (this.mutedWhenHiddenCheckBox_) {
    this.mutedWhenHiddenCheckBox_.setChecked(mutedWhenHidden || this.playNoneRadioEl.checked);
    this.mutedWhenHiddenCheckBox_.setEnabled(!this.playNoneRadioEl.checked);
  }
};
chatango.ui.SoundDialog.prototype.onPlayAll = function(e) {
  this.dispatchEvent(chatango.audio.AudioController.EventType.UNMUTE);
};
chatango.ui.SoundDialog.prototype.onPlayMine = function(e) {
  this.dispatchEvent(chatango.audio.AudioController.EventType.REPLYS_ONLY);
};
chatango.ui.SoundDialog.prototype.onPlayNone = function(e) {
  this.dispatchEvent(chatango.audio.AudioController.EventType.MUTE_ALL);
};
chatango.ui.SoundDialog.prototype.onMutedWhenHiddenCheckBoxClicked = function(e) {
  if (this.mutedWhenHiddenCheckBox_.isChecked()) {
    this.dispatchEvent(chatango.audio.AudioController.EventType.MUTE_WHEN_HIDDEN);
  } else {
    this.dispatchEvent(chatango.audio.AudioController.EventType.MAY_PLAY_WHEN_HIDDEN);
  }
};
chatango.ui.SoundDialog.prototype.updateCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.setTitle(lm.getString("sound", "play_sounds"));
  this.playAllLabelEl.innerHTML = lm.getString("sound", "every");
  this.playMineLabelEl.innerHTML = lm.getString("sound", "replys_only");
  this.playNoneLabelEl.innerHTML = lm.getString("sound", "never");
  if (this.mutedWhenHiddenCheckBox_) {
    this.mutedWhenHiddenCheckBox_.setCaption(lm.getString("sound", "mute_when_hidden"));
  }
  this.okButton_.setContent(lm.getString("ui", "ok"));
};
chatango.ui.SoundDialog.prototype.reposition = function() {
  var offset = new goog.math.Coordinate(0, -20);
  goog.positioning.positionAtAnchor(this.speakerEl_, goog.positioning.Corner.TOP_RIGHT, this.getElement(), goog.positioning.Corner.BOTTOM_RIGHT, offset);
  setTimeout(function() {
    var stageRect = goog.style.getBounds(goog.dom.getDocument().body);
    var mar = Math.round(stageRect.width * .05);
    stageRect.width = stageRect.width - mar;
    stageRect.left = stageRect.left + mar;
    chatango.utils.display.constrainToStage(this.getElement(), stageRect);
  }.bind(this), 1);
};
chatango.ui.SoundDialog.prototype.disposeInternal = function() {
  chatango.audio.AudioController.getInstance().unRegisterView(this);
  chatango.ui.SoundDialog.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.SoundDialogModule");
goog.require("chatango.audio.AudioController");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.ui.SoundDialog");
goog.require("chatango.strings.SoundDialogStrings");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.SoundDialogModule = function() {
  goog.events.EventTarget.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("sound", chatango.strings.SoundDialogStrings, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
};
goog.inherits(chatango.modules.SoundDialogModule, goog.events.EventTarget);
chatango.modules.SoundDialogModule.prototype.openSoundDialog = function(speakerEl) {
  this.closeSoundDialog();
  this.SoundDialog_ = new chatango.ui.SoundDialog(speakerEl);
  this.SoundDialog_.setVisible(true);
};
chatango.modules.SoundDialogModule.prototype.closeSoundDialog = function() {
  if (this.SoundDialog_) {
    this.SoundDialog_.dispose();
    this.SoundDialog_ = null;
  }
};
chatango.modules.SoundDialogModule.prototype.relayEvent_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.SoundDialogModule.prototype.closePopUps = function() {
  this.closeSoundDialog();
};
chatango.modules.SoundDialogModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (!this.SoundDialog_) {
    return;
  }
  this.SoundDialog_.constrainDialogsToScreen(opt_stageRect);
};
chatango.modules.SoundDialogModule.prototype.initCopy = function(pack_id) {
  if (this.SoundDialog_) {
    this.SoundDialog_.updateCopy();
  }
};
goog.module.ModuleManager.getInstance().setLoaded("SoundDialogModule");

