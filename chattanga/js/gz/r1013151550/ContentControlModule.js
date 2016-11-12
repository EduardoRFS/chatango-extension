goog.provide("chatango.group.settings.Content");
goog.require("chatango.group.settings.ContentModel");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
goog.require("goog.array");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
chatango.group.settings.Content = function(model, groupInfo, managers, opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.linksBox_ = new chatango.ui.Checkbox;
  this.imagesBox_ = new chatango.ui.Checkbox;
  this.videosBox_ = new chatango.ui.Checkbox;
  this.styledBox_ = new chatango.ui.Checkbox;
  var lm = chatango.managers.LanguageManager.getInstance();
  this.saveButton_ = new chatango.ui.buttons.ChatangoButton(lm.getString("ui", "save"));
  this.model_ = model;
  this.managers_ = managers;
  this.groupInfo_ = groupInfo;
  this.setResizable(false);
  this.backupWordPartContent_ = "";
  this.backupWordsContent_ = "";
};
goog.inherits(chatango.group.settings.Content, chatango.ui.ScrollableDialog);
chatango.group.settings.Content.EventType = {SAVE:"save"};
chatango.group.settings.Content.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.Content");
chatango.group.settings.Content.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  var wordPart = dom.createDom("div", {"class":"sdlg-top-section"});
  goog.dom.appendChild(content, wordPart);
  this.wordPartHead = dom.createDom("h3", {"className":"top_item"});
  goog.dom.appendChild(wordPart, this.wordPartHead);
  var wordInfo = dom.createDom("div", {"id":"wordinfo"});
  goog.dom.appendChild(wordPart, wordInfo);
  var wordPartTable = dom.createDom("div", {"style":"float:left;"});
  goog.dom.appendChild(wordInfo, wordPartTable);
  this.wordPartExample = dom.createDom("div", {"style":"float:left;padding-left:0.5em"});
  goog.dom.appendChild(wordPartTable, this.wordPartExample);
  this.wordPartShown = dom.createDom("div", {"style":"float:left;padding-left:0.5em"});
  goog.dom.appendChild(wordPartTable, this.wordPartShown);
  this.wordPartDisplay = dom.createDom("div", {"style":"float:left;padding-left:0.5em"});
  goog.dom.appendChild(wordPartTable, this.wordPartDisplay);
  var wordPartLink = new goog.ui.Button("(?)", goog.ui.LinkButtonRenderer.getInstance());
  wordPartLink.addClassName("link-btn");
  wordPartLink.addClassName("fr");
  wordPartLink.render(wordInfo);
  goog.style.setStyle(wordPartLink.getElement(), "padding-top", "16px");
  var props = {"rows":"5", "style":"overflow:hidden;"};
  this.wordPartInput_ = dom.createDom("textarea", props);
  goog.dom.appendChild(wordPart, this.wordPartInput_);
  this.wholeWord = dom.createDom("div", {"class":"sdlg-section"});
  goog.dom.appendChild(content, this.wholeWord);
  this.wholeWordHead = dom.createDom("h3");
  goog.dom.appendChild(this.wholeWord, this.wholeWordHead);
  var wholeInfo = dom.createDom("div");
  goog.dom.appendChild(this.wholeWord, wholeInfo);
  var wholeWordTable = dom.createDom("div", {"style":"float:left;"});
  goog.dom.appendChild(wholeInfo, wholeWordTable);
  this.wholeWordExample = dom.createDom("div", {"style":"float:left;padding-left:0.5em"});
  goog.dom.appendChild(wholeWordTable, this.wholeWordExample);
  this.wholeWordShown = dom.createDom("div", {"style":"float:left;padding-left:0.5em"});
  goog.dom.appendChild(wholeWordTable, this.wholeWordShown);
  this.wholeWordDisplay = dom.createDom("div", {"style":"float:left;padding-left:0.5em"});
  goog.dom.appendChild(wholeWordTable, this.wholeWordDisplay);
  var wholeWordLink = new goog.ui.Button("(?)", goog.ui.LinkButtonRenderer.getInstance());
  wholeWordLink.addClassName("link-btn");
  wholeWordLink.addClassName("fr");
  wholeWordLink.render(wholeInfo);
  goog.style.setStyle(wholeWordLink.getElement(), "padding-top", "16px");
  var props = {"rows":"3", "style":"overflow:hidden;"};
  this.wholeWordInput_ = dom.createDom("textarea", props);
  goog.dom.appendChild(this.wholeWord, this.wholeWordInput_);
  var lm = chatango.managers.LanguageManager.getInstance();
  this.exampleBanWordsLink_ = goog.dom.createDom("a", undefined, lm.getString("content_mod", "example_bw_link"));
  this.undoExampleBanWordsLink_ = goog.dom.createDom("a", undefined, lm.getString("content_mod", "undo_example_bw_link"));
  goog.dom.append(this.wholeWord, this.exampleBanWordsLink_);
  this.sendWrapperEl = dom.createDom("div", {"class":"sdlg-section"});
  this.sendHeaderEl = dom.createDom("span");
  goog.dom.appendChild(this.sendWrapperEl, this.sendHeaderEl);
  var sendRadioWrapperEl = dom.createDom("div", {"class":"rad-wrap"});
  this.sendRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"sendMessage", "id":"send"});
  this.sendLabelEl = goog.dom.createDom("label", {"for":"send", "onclick":""});
  goog.dom.appendChild(sendRadioWrapperEl, this.sendRadioEl);
  goog.dom.appendChild(sendRadioWrapperEl, this.sendLabelEl);
  goog.dom.appendChild(this.sendWrapperEl, sendRadioWrapperEl);
  var noSendRadioWrapperEl = dom.createDom("div", {"class":"rad-wrap"});
  this.noSendRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"sendMessage", "id":"noSend"});
  this.noSendLabelEl = goog.dom.createDom("label", {"for":"noSend", "onclick":""});
  goog.dom.appendChild(noSendRadioWrapperEl, this.noSendRadioEl);
  goog.dom.appendChild(noSendRadioWrapperEl, this.noSendLabelEl);
  goog.dom.appendChild(this.sendWrapperEl, noSendRadioWrapperEl);
  dom.appendChild(content, this.sendWrapperEl);
  var checks = dom.createDom("div", {"style":"overflow:hidden", "class":"sdlg-section"});
  dom.appendChild(content, checks);
  var pane = dom.createDom("div", {"style":"float:left"});
  dom.appendChild(checks, pane);
  this.linksBox_.render(pane);
  this.imagesBox_.render(pane);
  goog.style.setStyle(this.imagesBox_.getElement(), "padding-top", ".3em");
  pane = dom.createDom("div", {"style":"float:left"});
  dom.appendChild(checks, pane);
  this.videosBox_.render(pane);
  this.styledBox_.render(pane);
  goog.style.setStyle(this.styledBox_.getElement(), "display", "none");
  goog.style.setStyle(this.styledBox_.getElement(), "padding-top", ".3em");
  var buttons = dom.createDom("div", {"style":"overflow:hidden; padding-bottom:0.2em"});
  this.saveButton_.render(buttons);
  goog.dom.classes.add(this.saveButton_.getElement(), "fr");
  dom.appendChild(this.footerContentEl_, buttons);
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  var handler = this.getHandler();
  handler.listen(this.model_, chatango.events.EventType.UPDATE, this.updateView_);
  handler.listen(this.groupInfo_, chatango.events.EventType.ALLOW_LINKS_UPDATE, this.updateCheckboxes_);
  handler.listen(this.groupInfo_, chatango.events.EventType.ALLOW_IMAGES_UPDATE, this.updateCheckboxes_);
  handler.listen(this.groupInfo_, chatango.events.EventType.ALLOW_VIDEOS_UPDATE, this.updateCheckboxes_);
  handler.listen(this.groupInfo_, chatango.events.EventType.ALLOW_STYLED_TEXT_UPDATE, this.updateCheckboxes_);
  handler.listen(this.groupInfo_, chatango.events.EventType.SEND_BW_MESSAGES, this.updateCheckboxes_);
  handler.listen(this.sendRadioEl, goog.events.EventType.CLICK, this.onSendRadioToggled);
  handler.listen(this.noSendRadioEl, goog.events.EventType.CLICK, this.onSendRadioToggled);
  handler.listen(this.exampleBanWordsLink_, goog.events.EventType.CLICK, this.onExampleBanWordsLinkClicked_);
  handler.listen(this.undoExampleBanWordsLink_, goog.events.EventType.CLICK, this.onUndoExampleBanWordsLinkClicked_);
  goog.events.listen(this.wordPartInput_, goog.events.EventType.KEYDOWN, this.onChange_, false, this);
  goog.events.listen(this.wholeWordInput_, goog.events.EventType.KEYDOWN, this.onChange_, false, this);
  handler.listen(this.saveButton_, goog.ui.Component.EventType.ACTION, this.onSave_);
  handler.listen(wholeWordLink, goog.ui.Component.EventType.ACTION, this.onLink_);
  handler.listen(wordPartLink, goog.ui.Component.EventType.ACTION, this.onLink_);
  handler.listen(this.linksBox_, goog.ui.Component.EventType.CHANGE, this.onLinksBoxChanged_);
  handler.listen(this.videosBox_, goog.ui.Component.EventType.CHANGE, this.onVideosBoxChanged_);
  handler.listen(this.imagesBox_, goog.ui.Component.EventType.CHANGE, this.onImagesBoxChanged_);
  handler.listen(this.styledBox_, goog.ui.Component.EventType.CHANGE, this.onStyledBoxChanged_);
  this.updateCopy();
  this.updateView_();
  this.updateCheckboxes_();
};
chatango.group.settings.Content.prototype.updateCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.setTitle(lm.getString("owner_module", "banned_content"));
  goog.dom.setTextContent(this.wordPartHead, lm.getString("content_mod", "word_parts"));
  this.wordPartExample.innerHTML = "<em>" + lm.getString("content_mod", "subword") + "<br/>" + lm.getString("content_mod", "subword") + "</em>" + lm.getString("content_mod", "word_dif");
  this.wordPartShown.innerHTML = "&#x2192;<br/>&#x2192;";
  this.wordPartDisplay.innerHTML = "*<br/>" + "*" + lm.getString("content_mod", "word_dif");
  goog.dom.setTextContent(this.wholeWordHead, lm.getString("content_mod", "whole_words"));
  this.wholeWordExample.innerHTML = "<em>" + lm.getString("content_mod", "subword") + "<br/>" + lm.getString("content_mod", "subword") + "</em>" + lm.getString("content_mod", "word_dif");
  this.wholeWordShown.innerHTML = "&#x2192;<br/>&#x2192;";
  this.wholeWordDisplay.innerHTML = "*<br/>" + lm.getString("content_mod", "fullword");
  this.linksBox_.setCaption(lm.getString("content_mod", "allow_links"));
  this.imagesBox_.setCaption(lm.getString("content_mod", "allow_images"));
  this.videosBox_.setCaption(lm.getString("content_mod", "allow_videos"));
  this.styledBox_.setCaption(lm.getString("content_mod", "allow_styled_txt"));
  this.sendHeaderEl.innerHTML = lm.getString("content_mod", "send_header");
  this.sendLabelEl.innerHTML = lm.getString("content_mod", "send");
  this.noSendLabelEl.innerHTML = lm.getString("content_mod", "no_send");
  this.wholeWordInput_.placeholder = lm.getString("content_mod", "comma_sep");
  this.wordPartInput_.placeholder = lm.getString("content_mod", "comma_sep");
  this.saveButton_.setContent(lm.getString("ui", "save"));
};
chatango.group.settings.Content.prototype.setVisible = function(isVisible) {
  goog.base(this, "setVisible", isVisible);
  if (isVisible) {
    this.draw();
  }
};
chatango.group.settings.Content.prototype.updateView_ = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.lastSavedWordParts = this.model_.getBannedWordParts().join(",");
  this.lastSavedWholeWords = this.model_.getBannedWholeWords().join(",");
  this.wordPartInput_.value = this.lastSavedWordParts;
  this.wholeWordInput_.value = this.lastSavedWholeWords;
  this.saveButton_.setContent(lm.getString("ui", "saved"));
  this.saveButton_.setAlert(false);
  this.saveButton_.setEnabled(true);
  this.wordPartInput_.disabled = "";
  this.wholeWordInput_.disabled = "";
  this.draw();
};
chatango.group.settings.Content.prototype.updateCheckboxes_ = function() {
  this.linksBox_.setChecked(this.groupInfo_.getAllowLinks());
  this.imagesBox_.setChecked(this.groupInfo_.getAllowImages());
  this.videosBox_.setChecked(this.groupInfo_.getAllowVideos());
  this.styledBox_.setChecked(this.groupInfo_.getAllowStyledText());
  this.sendRadioEl.checked = this.groupInfo_.getSendMessagesWithBannedWords();
  this.noSendRadioEl.checked = !this.groupInfo_.getSendMessagesWithBannedWords();
};
chatango.group.settings.Content.prototype.onChange_ = function(e) {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.saveButton_.setEnabled(true);
  this.saveButton_.setContent(lm.getString("ui", "save"));
  this.saveButton_.setAlert(true);
};
chatango.group.settings.Content.prototype.onSendRadioToggled = function(e) {
  this.groupInfo_.setSendMessagesWithBannedWords(this.sendRadioEl.checked);
};
chatango.group.settings.Content.prototype.onLink_ = function() {
  if (!this.bannedWordsInfoPU_) {
    var lm = chatango.managers.LanguageManager.getInstance();
    var dispStr = "";
    dispStr += "<h3>" + lm.getString("content_mod", "bw_wp_head") + "</h3>" + lm.getString("content_mod", "bw_wp_content") + "<br>" + lm.getString("content_mod", "bw_wp_example") + "<br><br>";
    dispStr += "<h3>" + lm.getString("content_mod", "bw_ww_head") + "</h3>" + lm.getString("content_mod", "bw_ww_content") + "<br>" + lm.getString("content_mod", "bw_ww_example") + "<br><br>";
    dispStr += "<h3>" + lm.getString("content_mod", "bw_bw_head") + "</h3>" + lm.getString("content_mod", "bw_bw_content") + "<br>" + lm.getString("content_mod", "bw_bw_example").replace("*br*", "<br>").replace("*br*", "<br>") + "<br>";
    var url = "http://" + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain() + "/help?help_group_chat#ban_words";
    dispStr += "<a href = '" + url + "' target='_blank'>" + lm.getString("content_mod", "help_link") + "</a>";
    this.bannedWordsInfoPU_ = new chatango.ui.ScrollableTextDialog(dispStr);
    this.bannedWordsInfoPU_.setTitle(lm.getString("content_mod", "bw_pu_title"));
    this.bannedWordsInfoPU_.setHasTitleCloseButton(true);
    this.bannedWordsInfoPU_.setResizable(false);
    this.bannedWordsInfoPU_.setVisible(true);
    this.bannedWordsInfoPU_.reposition();
    goog.dom.classes.add(this.bannedWordsInfoPU_.getContentElement(), "sdlg-sc");
    goog.events.listen(this.bannedWordsInfoPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeBWInfoPU, false, this);
    goog.events.listen(this.bannedWordsInfoPU_, chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE, this.onBWIndoPUHeightChange_, false, this);
  }
};
chatango.group.settings.Content.prototype.onExampleBanWordsLinkClicked_ = function(e) {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.saveButton_.setEnabled(true);
  this.saveButton_.setContent(lm.getString("ui", "save"));
  this.saveButton_.setAlert(true);
  goog.dom.removeNode(this.exampleBanWordsLink_);
  goog.dom.append(this.wholeWord, this.undoExampleBanWordsLink_);
  this.backupWordPartContent_ = this.wordPartInput_.value;
  this.backupWordsContent_ = this.wholeWordInput_.value;
  var mergedPartsStr = this.model_.getExampleBannedWordParts().join(",") + "," + this.backupWordPartContent_;
  var mergedWordsStr = this.model_.getExampleBannedWords().join(",") + "," + this.backupWordsContent_;
  var mergedBW = this.processWords_(mergedWordsStr, mergedPartsStr);
  this.wordPartInput_.value = mergedBW.parts;
  this.wholeWordInput_.value = mergedBW.words;
  if (mergedBW.showWarning) {
    this.shortWordPartsWarning_(mergedBW.shortWords);
  }
};
chatango.group.settings.Content.prototype.onUndoExampleBanWordsLinkClicked_ = function(e) {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.saveButton_.setContent(lm.getString("ui", "saved"));
  this.saveButton_.setAlert(false);
  this.saveButton_.setEnabled(true);
  goog.dom.removeNode(this.undoExampleBanWordsLink_);
  goog.dom.append(this.wholeWord, this.exampleBanWordsLink_);
  this.wordPartInput_.value = this.backupWordPartContent_;
  this.wholeWordInput_.value = this.backupWordsContent_;
};
chatango.group.settings.Content.prototype.onLinksBoxChanged_ = function(e) {
  this.groupInfo_.setAllowLinks(this.linksBox_.isChecked());
};
chatango.group.settings.Content.prototype.onImagesBoxChanged_ = function(e) {
  this.groupInfo_.setAllowImages(this.imagesBox_.isChecked());
};
chatango.group.settings.Content.prototype.onVideosBoxChanged_ = function(e) {
  this.groupInfo_.setAllowVideos(this.videosBox_.isChecked());
};
chatango.group.settings.Content.prototype.onStyledBoxChanged_ = function(e) {
  this.groupInfo_.setAllowStyledText(this.styledBox_.isChecked());
};
chatango.group.settings.Content.prototype.closeBWInfoPU = function() {
  if (this.bannedWordsInfoPU_) {
    goog.events.unlisten(this.bannedWordsInfoPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeBWInfoPU, false, this);
    goog.events.unlisten(this.bannedWordsInfoPU_, chatango.ui.ScrollableDialog.EventType.HEIGHT_CHANGE, this.onBWIndoPUHeightChange_, false, this);
    this.bannedWordsInfoPU_.dispose();
  }
  this.bannedWordsInfoPU_ = null;
};
chatango.group.settings.Content.prototype.onBWIndoPUHeightChange_ = function(e) {
  this.bannedWordsInfoPU_.reposition();
};
chatango.group.settings.Content.prototype.onSave_ = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.backupWordPartContent_ = "";
  this.backupWordsContent_ = "";
  goog.dom.removeNode(this.undoExampleBanWordsLink_);
  goog.dom.append(this.wholeWord, this.exampleBanWordsLink_);
  this.saveButton_.setContent(lm.getString("ui", "saving"));
  this.saveButton_.setAlert(false);
  this.saveButton_.setEnabled(false);
  this.wordPartInput_.disabled = "disabled";
  this.wholeWordInput_.disabled = "disabled";
  var bw = this.processWords_(this.wholeWordInput_.value, this.wordPartInput_.value);
  this.model_.setBannedWords(bw.parts, bw.words);
  this.dispatchEvent(chatango.group.settings.Content.EventType.SAVE);
  if (bw.showWarning) {
    this.shortWordPartsWarning_(bw.shortWords);
  }
};
chatango.group.settings.Content.prototype.processWords_ = function(inWordsStr, inPartsStr) {
  var newLineRe = /(\r\n|\r|\n)/g;
  inPartsStr = inPartsStr.replace(newLineRe, ",");
  inWordsStr = inWordsStr.replace(newLineRe, ",");
  var parts = inPartsStr.split(",");
  var words = inWordsStr.split(",");
  var i;
  var showWarning = false;
  var shortWords = [];
  for (i = 0;i < parts.length;i++) {
    parts[i] = goog.string.trim(parts[i]);
    if (parts[i].length < 4) {
      var shortWord = parts.splice(i, 1)[0];
      shortWords.push(shortWord);
      i--;
      if (shortWord != "") {
        showWarning = true;
      }
    }
  }
  goog.array.removeDuplicates(shortWords);
  goog.array.removeDuplicates(parts);
  console.log(words);
  var inParts;
  for (i = 0;i < words.length;i++) {
    words[i] = goog.string.trim(words[i]);
    inParts = goog.array.indexOf(parts, words[i]) != -1;
    if (inParts || words[i].length == 0) {
      words.splice(i, 1);
      i--;
    }
  }
  console.log(words);
  goog.array.removeDuplicates(words);
  goog.array.remove(words, "");
  goog.array.remove(parts, "");
  goog.array.remove(shortWords, "");
  var out = new Object;
  out.words = words.sort();
  out.parts = parts.sort();
  out.shortWords = shortWords.sort();
  out.showWarning = showWarning;
  return out;
};
chatango.group.settings.Content.prototype.shortWordPartsWarning_ = function(shortWords) {
  var vms = this.viewportManager_.getViewportSizeMonitor().getSize();
  this.disposeWarningDialog_();
  var w = vms.width;
  w = Math.min(w * .8, Math.round(2.8 * chatango.managers.Style.getInstance().getScale()));
  this.warningDialog_ = new chatango.ui.ScrollableDialog(w, undefined, true);
  this.warningDialog_.showTitleBarBg(false);
  this.warningDialog_.setResizable(false);
  var bs = new chatango.ui.ButtonSet;
  bs.addButton({caption:lm.getString("ui", "ok"), key:"cancel"}, false, true);
  this.warningDialog_.setButtonSet(bs);
  var msg = lm.getString("content_mod", "length_warning");
  var shortWordsString = "<strong>" + shortWords + "</strong>";
  if (shortWords.length > 1) {
    msg = lm.getString("content_mod", "length_warning_plural");
    var lastWord = shortWords.pop();
    shortWordsString = "<strong>" + shortWords.join("</strong>, <strong>") + "</strong> " + lm.getString("content_mod", "and") + " <strong>" + lastWord + "</strong>";
  }
  msg = msg.replace("*b*", "<span class='warning'>");
  msg = msg.replace("*/b*", "</span>");
  msg = msg.replace("*shortwords*", shortWordsString);
  this.warningDialog_.setContent(msg, true);
  this.warningDialog_.setVisible(true);
  var el = this.warningDialog_.getDialogElement();
  var btnEl = this.saveButton_.getElement();
  var buttonPosition = goog.style.getClientPosition(btnEl);
  var buttonSize = goog.style.getContentBoxSize(btnEl);
  var dialogSize = goog.style.getContentBoxSize(el);
  var x = buttonPosition.x + buttonSize.width - dialogSize.width;
  var y = Math.round(buttonPosition.y - dialogSize.height - 25);
  goog.style.setPosition(el, x, y);
  chatango.utils.display.constrainPosition(el, new goog.math.Rect(0, 0, vms.width, vms.height));
};
chatango.group.settings.Content.prototype.draw = function() {
  goog.base(this, "draw");
  if (this.wordPartInput_ && this.wholeWordInput_) {
    this.wordPartInput_.style.margin = "0.2em 0";
    this.wholeWordInput_.style.margin = "0.2em 0";
    chatango.utils.style.stretchToFill(this.wordPartInput_);
    chatango.utils.style.stretchToFill(this.wholeWordInput_);
  }
};
chatango.group.settings.Content.prototype.disposeWarningDialog_ = function() {
  if (this.warningDialog_) {
    this.warningDialog_.dispose();
    this.warningDialog_ = null;
  }
};
chatango.group.settings.Content.prototype.disposeInternal = function() {
  this.closeBWInfoPU();
  this.disposeWarningDialog_();
  chatango.group.settings.Content.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.ContentControlModule");
goog.require("chatango.group.settings.Content");
goog.require("chatango.group.settings.ContentModel");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.SettingsModule");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.ContentControlModule = function(connection, groupInfo, managers) {
  this.handler_ = new goog.events.EventHandler(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.groupInfo_ = groupInfo;
  this.managers_ = managers;
  this.lm_.getStringPack("owner_module", chatango.modules.SettingsModule.strs, this.initCopy, this);
  this.lm_.getStringPack("content_mod", chatango.modules.ContentControlModule.strs, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.contentModel_ = new chatango.group.settings.ContentModel(connection);
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  var modEvents = [chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE];
  goog.events.listen(this.mm_, modEvents, this.onFlagsUpdated_, false, this);
};
chatango.modules.ContentControlModule.prototype.onFlagsUpdated_ = function(e) {
  if (this.contentDialog_) {
    var currentUser = chatango.users.UserManager.getInstance().currentUser;
    var canEditBannedContent = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_BW);
    if (!canEditBannedContent) {
      this.closePopUps();
    }
  }
};
chatango.modules.ContentControlModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.ContentControlModule");
chatango.modules.ContentControlModule.prototype.closePopUps = function() {
  this.closeContentPU();
};
chatango.modules.ContentControlModule.prototype.closeContentPU = function() {
  if (this.contentDialog_) {
    this.contentDialog_.dispose();
    this.contentDialog_ = null;
  }
};
chatango.modules.ContentControlModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.contentDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.contentDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.contentDialog_.getElement(), opt_stageRect, true);
    this.contentDialog_.keepActiveFormElementOnScreen();
  }
};
chatango.modules.ContentControlModule.prototype.openContentControlDialog = function() {
  this.closeContentPU();
  this.handler_.listenOnce(this.contentModel_, chatango.events.EventType.UPDATE, this.onUpdate_);
  this.contentModel_.refresh();
};
chatango.modules.ContentControlModule.prototype.onUpdate_ = function(e) {
  this.contentDialog_ = new chatango.group.settings.Content(this.contentModel_, this.groupInfo_, this.managers_);
  this.contentDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.contentDialog_.setVisible(true);
  goog.events.listen(this.contentDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeContentPU, false, this);
};
chatango.modules.ContentControlModule.prototype.initCopy = function(pack_id) {
  if (this.lm_.isPackLoaded("ui") && this.lm_.isPackLoaded("content_mod") && this.lm_.isPackLoaded("owner_module")) {
    if (this.contentDialog_) {
      this.contentDialog_.updateCopy();
    }
  }
};
chatango.modules.ContentControlModule.strs = {"word_parts":"Censor word parts", "subword":"shit", "fullword":"shithole", "word_dif":"hole", "whole_words":"Censor exact words", "bw_pu_title":"Banned words examples", "bw_bw_head":"Both censored words lists", "bw_bw_content":"Common attempts to bypass banned words will still be caught", "bw_bw_example":'E.g. if the word "naughty" is on the list, then the words "nAughty nauggghty nau9hty n.aught.y" will be all shown as * *br* ', "bw_wp_head":"Censor word parts", 
"bw_wp_content":"These will be starred even when they are a part of another word. This is the most powerful method", "bw_wp_example":'E.g. if "shit" is banned, "shithole" will appear as "*hole"', "bw_ww_head":"Censor exact words", "bw_ww_content":"These will be starred only if the entire word matches", "bw_ww_example":'E.g. if "ass" is banned then "ass" will appear as *, but "pass" will still appear as "pass"', "help_link":"See Chatango help for more information", "allow_videos":"Allow videos", "allow_images":"Allow images", 
"allow_styled_txt":"Allow styled text", "allow_links":"Allow links", "comma_sep":"Comma separated list of words", "length_warning":"*b*Warning:*/b* The word part: *shortwords*, is less than four characters long, it has been deleted. You may ban it as an entire word.", "length_warning_plural":"*b*Warning:*/b* The word parts: *shortwords*, are less than four characters long, they have been deleted. You may ban them as entire words.", "and":"and", "send_header":"Send censored messages:", "send":"To everybody", 
"no_send":"Only to author", "example_bw_link":"Example ban words", "undo_example_bw_link":"Undo example ban words"};
goog.module.ModuleManager.getInstance().setLoaded("ContentControlModule");

