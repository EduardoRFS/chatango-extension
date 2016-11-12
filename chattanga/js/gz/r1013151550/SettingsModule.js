goog.provide("chatango.group.settings.EventType");
chatango.group.settings.EventType = {LOG_OUT:"logout", CONTENT_CONTROLS:"contentControls", EDIT_GROUP:"editGroup", EDIT_PROFILE:"editProfile", EDIT_ANNOUNCEMENT:"editAnnouncement", CHAT_RESTRICTIONS:"chatRestrictions", SUPPORT_CHATANGO:"supportChatango"};
goog.provide("chatango.group.settings.SettingsMenu");
goog.require("chatango.events.EventType");
goog.require("chatango.group.settings.EventType");
goog.require("chatango.group.GroupInfo");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("goog.dom.classlist");
goog.require("goog.ui.Component.EventType");
goog.require("goog.ui.MenuItem");
chatango.group.settings.SettingsMenu = function(opt_domHelper, opt_renderer) {
  goog.base(this, opt_domHelper, opt_renderer);
  this.setToggleMode(true);
  this.allItems_ = [this.logOutItem_ = new goog.ui.MenuItem(" "), this.contentControlsItem_ = new goog.ui.MenuItem(" "), this.chatRestrictionsItem_ = new goog.ui.MenuItem(" "), this.editGroupItem_ = new goog.ui.MenuItem(" "), this.editProfileItem_ = new goog.ui.MenuItem(" "), this.editAnnouncementItem_ = new goog.ui.MenuItem(" "), this.supportChatangoItem_ = new goog.ui.MenuItem(" ")];
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  this.groupInfo_ = chatango.managers.ManagerManager.getInstance().getManager(chatango.group.GroupInfo.ManagerType);
  goog.events.listen(this.mm_, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, this.updateItems, false, this);
  this.updateItems();
};
goog.inherits(chatango.group.settings.SettingsMenu, chatango.ui.PopupMenu);
chatango.group.settings.SettingsMenu.EVENTS = [chatango.events.EventType.LOGOUT, chatango.group.settings.EventType.CONTENT_CONTROLS, chatango.group.settings.EventType.EDIT_GROUP, chatango.group.settings.EventType.EDIT_ANNOUNCEMENT, chatango.group.settings.EventType.CHAT_RESTRICTIONS, chatango.group.settings.EventType.SUPPORT_CHATANGO, chatango.events.EventType.EDIT_PROFILE];
chatango.group.settings.SettingsMenu.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.SettingsMenu");
chatango.group.settings.SettingsMenu.prototype.initCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  this.logOutItem_.setCaption(lm.getString("owner_module", "log_out"));
  this.logOutItem_.getElement().title = lm.getString("owner_module", "log_out_tt").replace(/\*name\*/g, cUser.getName());
  this.editProfileItem_.setCaption(lm.getString("owner_module", "edit_profile"));
  this.editProfileItem_.getElement().title = lm.getString("owner_module", "edit_profile_tt").replace(/\*br\*/g, "\n");
  if (this.canDonate_) {
    this.supportChatangoItem_.setCaption(lm.getString("owner_module", "support_chatango"));
    this.supportChatangoItem_.getElement().title = lm.getString("owner_module", "support_chatango_tt").replace(/\*br\*/g, "\n");
  }
  if (this.canBanContent_) {
    this.contentControlsItem_.setCaption(lm.getString("owner_module", "banned_content"));
    this.contentControlsItem_.getElement().title = lm.getString("owner_module", "banned_content_tt").replace(/\*br\*/g, "\n");
  }
  if (this.canRestrictChat_) {
    this.chatRestrictionsItem_.setCaption(lm.getString("owner_module", "chat_restrictions"));
    this.chatRestrictionsItem_.getElement().title = lm.getString("owner_module", "chat_restrictions_tt").replace(/\*br\*/g, "\n");
  }
  if (this.canEditAnnc_) {
    var viewSize = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor().getSize();
    if (viewSize.width <= chatango.managers.ScaleManager.MIN_FULL_FEATURE_WIDTH) {
      this.editAnnouncementItem_.setCaption(lm.getString("owner_module", "announcement_sm"));
    } else {
      this.editAnnouncementItem_.setCaption(lm.getString("owner_module", "announcement"));
    }
    this.editAnnouncementItem_.getElement().title = lm.getString("owner_module", "announcement_tt").replace(/\*br\*/g, "\n");
  }
  if (this.canEditGroup_) {
    this.editGroupItem_.setCaption(lm.getString("owner_module", "edit_group"));
    this.editGroupItem_.getElement().title = lm.getString("owner_module", "edit_group_tt").replace(/\*br\*/g, "\n");
  }
};
chatango.group.settings.SettingsMenu.prototype.onAction_ = function(e) {
  this.hide();
  if (e.target === this.logOutItem_) {
    this.dispatchEvent(chatango.events.EventType.LOGOUT);
  } else {
    if (e.target === this.contentControlsItem_) {
      this.dispatchEvent(chatango.group.settings.EventType.CONTENT_CONTROLS);
    } else {
      if (e.target === this.editGroupItem_) {
        this.dispatchEvent(chatango.group.settings.EventType.EDIT_GROUP);
      } else {
        if (e.target === this.chatRestrictionsItem_) {
          this.dispatchEvent(chatango.group.settings.EventType.CHAT_RESTRICTIONS);
        } else {
          if (e.target === this.editProfileItem_) {
            this.dispatchEvent(chatango.events.EventType.EDIT_PROFILE);
          } else {
            if (e.target === this.editAnnouncementItem_) {
              this.dispatchEvent(chatango.group.settings.EventType.EDIT_ANNOUNCEMENT);
            } else {
              if (e.target === this.supportChatangoItem_) {
                this.dispatchEvent(chatango.group.settings.EventType.SUPPORT_CHATANGO);
              }
            }
          }
        }
      }
    }
  }
};
chatango.group.settings.SettingsMenu.prototype.updateItems = function() {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var sid = cUser.getSid();
  this.canBanContent_ = this.mm_.hasPermission(sid, chatango.group.moderation.Permissions.Flags.EDIT_BW);
  this.canRestrictChat_ = this.mm_.hasPermission(sid, chatango.group.moderation.Permissions.Flags.EDIT_RESTRICTIONS);
  this.canEditAnnc_ = this.mm_.hasPermission(sid, chatango.group.moderation.Permissions.Flags.EDIT_GP_ANNC);
  this.canEditGroup_ = this.mm_.hasPermission(sid, chatango.group.moderation.Permissions.Flags.EDIT_GROUP);
  this.canDonate_ = this.groupInfo_ && this.groupInfo_.getPaymentsOk();
  var itemIdsToShow = {};
  itemIdsToShow[this.logOutItem_.getId()] = true;
  itemIdsToShow[this.editProfileItem_.getId()] = true;
  itemIdsToShow[this.supportChatangoItem_.getId()] = this.canDonate_;
  itemIdsToShow[this.editGroupItem_.getId()] = this.canEditGroup_;
  itemIdsToShow[this.editAnnouncementItem_.getId()] = this.canEditAnnc_;
  itemIdsToShow[this.contentControlsItem_.getId()] = this.canBanContent_;
  itemIdsToShow[this.chatRestrictionsItem_.getId()] = this.canRestrictChat_;
  var i;
  var len = this.allItems_.length;
  var id;
  this.removeChildren(true);
  for (i = 0;i < len;i++) {
    id = this.allItems_[i].getId();
    if (itemIdsToShow[id]) {
      if (!this.getChild(id)) {
        this.addChild(this.allItems_[i], true);
      }
    } else {
      if (this.getChild(id)) {
        this.removeChild(this.allItems_[i], true);
      }
    }
  }
  this.initCopy();
};
goog.provide("chatango.group.settings.ContentModel");
goog.require("chatango.networking.GroupConnection");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.string");
chatango.group.settings.ContentModel = function(connection) {
  goog.events.EventTarget.call(this);
  this.bannedParts_ = [];
  this.bannedWords_ = [];
  this.exampleBannedParts_ = ["fuck", "pussy", "cunt", "nigger", "penis", "dick", "mastur", "sperm", "slut", "vagin", "whore", "horny", "porn", "clit", "cocksuck", "tits", "twat", "boob", "anus", "fisting", "fellatio", "nilingus", "futa", "pedo", "bitch", "wetback", "whitepower", "queer", "dildo", "dyke", "erec", "kinky", "wank", "uana", "eroin", "weed", "crack", "meth", "cocain", "acid", "shroom", "dope", "desu", "nipp", "bdsm", "kike", "niglet", "beaner", "gook", "phag", "gangbang", "milf", "virginity", 
  "3some", "jerk", "sadist", "panty", "panties", "mistress", "piss", "nudi", "pervert", "semen", "penis", "erection", "heroine", "cocaine", "raep", "deepthroat", "daddy", "voyeur", "weiner", "tranny", "shemale", "furry", "bukak", "nymph", "submissive", "cuck", "orgy", "fetish", "bondage", "preteen", "fart", "maso", "fornicat", "domina", "bestiality", "fairy", "redtube", "xtube", "orgasm", "ejacu", "goyim", "sado", "mazo", "upskirt", "xvid", "tube8", "xhamster", "jizz", "lube", "blowjob", "yaoi", 
  "femdom", "femboy", "skid", "boner", "testic"];
  this.exampleBannedWords_ = ["fag", "cum", "goy", "jiz", "ass", "fuc", "lick", "gag", "cyber", "xxx", "kkk", "fuk", "homo", "cock", "rape", "balls", "anal", "suck", "lust", "coon", "dong"];
  this.connection_ = connection;
  this.handler_ = new goog.events.EventHandler(this);
  var events = [chatango.networking.GroupConnectionEvent.EventType.bw, chatango.networking.GroupConnectionEvent.EventType.ubw];
  this.handler_.listen(this.connection_, events, this.onEvent_);
};
goog.inherits(chatango.group.settings.ContentModel, goog.events.EventTarget);
chatango.group.settings.ContentModel.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.ContentModel");
chatango.group.settings.ContentModel.prototype.refresh = function() {
  var command = "getbannedwords";
  this.connection_.send(command);
};
chatango.group.settings.ContentModel.prototype.getBannedWordParts = function() {
  return this.bannedParts_;
};
chatango.group.settings.ContentModel.prototype.getExampleBannedWordParts = function() {
  return this.exampleBannedParts_;
};
chatango.group.settings.ContentModel.prototype.getExampleBannedWords = function() {
  return this.exampleBannedWords_;
};
chatango.group.settings.ContentModel.prototype.setBannedWords = function(parts, words) {
  var command = "\x00setbannedwords:" + goog.string.urlEncode(parts.join(",")) + ":" + goog.string.urlEncode(words.join(","));
  if (chatango.DEBUG) {
    this.logger.info("Setting banned words: " + command);
  }
  this.connection_.send(command);
};
chatango.group.settings.ContentModel.prototype.getBannedWholeWords = function() {
  return this.bannedWords_;
};
chatango.group.settings.ContentModel.prototype.onEvent_ = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("ContentModel received event: " + e.type);
  }
  switch(e.type) {
    case chatango.networking.GroupConnectionEvent.EventType.bw:
      var banned = e.data[1];
      this.bannedParts_ = banned.split("%2C");
      for (var i = 0;i < this.bannedParts_.length;i++) {
        this.bannedParts_[i] = goog.string.urlDecode(this.bannedParts_[i]);
      }
      banned = e.data[2];
      this.bannedWords_ = banned.split("%2C");
      for (var i = 0;i < this.bannedWords_.length;i++) {
        this.bannedWords_[i] = goog.string.urlDecode(this.bannedWords_[i]);
      }
      this.dispatchEvent(chatango.events.EventType.UPDATE);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.ubw:
      this.refresh();
      break;
  }
};
goog.provide("chatango.group.settings.CustomRateLimitDialog");
goog.require("chatango.ui.ScrollableDialog");
chatango.group.settings.CustomRateLimitDialog = function(seconds) {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.minSeconds_ = 5;
  this.maxSeconds_ = 5E4;
  this.seconds_ = seconds;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  chatango.ui.ScrollableDialog.call(this, width, height, true);
  this.setResizable(false);
};
goog.inherits(chatango.group.settings.CustomRateLimitDialog, chatango.ui.ScrollableDialog);
chatango.group.settings.CustomRateLimitDialog.prototype.createDom = function() {
  chatango.group.settings.CustomRateLimitDialog.superClass_.createDom.call(this);
  var lm = chatango.managers.LanguageManager.getInstance();
  this.setTitle(lm.getString("c_restrict_mod", "rate_limit"));
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "edit-dialog");
  goog.dom.append(scrollContent, content);
  var formWrapper = goog.dom.createDom("div", {"style":"overflow:hidden"});
  goog.dom.append(content, formWrapper);
  var params = {"id":"rate-limit-seconds", type:"text", "pattern":"[0-9]*", "name":"rate-limit-seconds", "style":"width:8em; float:left; margin-right:5px;"};
  this.rateLimitInput_ = goog.dom.createDom("input", params);
  if (this.seconds_ > 0) {
    this.rateLimitInput_.value = this.seconds_;
  }
  goog.dom.append(formWrapper, this.rateLimitInput_);
  var label = lm.getString("c_restrict_mod", "rate_limit_secs_lbl");
  this.secondsLabel_ = goog.dom.createDom("div", {"class":"form-label", "style":"margin-top:0.3em;"}, label);
  goog.dom.append(formWrapper, this.secondsLabel_);
  this.buttonWrap_ = goog.dom.createDom("div", {"id":"buttons-wrapper"});
  goog.dom.append(formWrapper, this.buttonWrap_);
  this.confirmButtonWrap_ = goog.dom.createDom("div", {"id":"confirm-button-wrap"});
  goog.style.setInlineBlock(this.confirmButtonWrap_);
  this.confirmButton_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.confirmButton_.setContent(lm.getString("c_restrict_mod", "custom_rl_ok_btn"));
  this.confirmButton_.render(this.confirmButtonWrap_);
  goog.events.listen(this.confirmButton_, goog.ui.Component.EventType.ACTION, this.confirmButtonClick, false, this);
  goog.dom.appendChild(this.buttonWrap_, this.confirmButtonWrap_);
  this.errorDiv_ = goog.dom.createDom("div", {"class":"form-error", "style":"padding: 0 .5em 0 .5em; margin-top:0;"});
  goog.dom.appendChild(content, this.errorDiv_);
};
chatango.group.settings.CustomRateLimitDialog.prototype.close = function() {
  this.listener_ = null;
  this.disposeInternal();
};
chatango.group.settings.CustomRateLimitDialog.prototype.confirmButtonClick = function(e) {
  if (this.validateInput(this.rateLimitInput_.value)) {
    if (this.listener_) {
      var seconds = +this.rateLimitInput_.value;
      this.listener_(seconds);
    }
    this.close();
  }
};
chatango.group.settings.CustomRateLimitDialog.prototype.validateInput = function(inputValue) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (inputValue == "") {
    this.errorDiv_.innerHTML = lm.getString("c_restrict_mod", "rl_error_empty");
    return false;
  }
  if (!inputValue.match(/^\d+$/)) {
    this.errorDiv_.innerHTML = lm.getString("c_restrict_mod", "rl_error_not_a_num");
    return false;
  }
  var secs = +inputValue;
  if (secs < this.minSeconds_) {
    this.errorDiv_.innerHTML = lm.getString("c_restrict_mod", "rl_error_too_small");
    return false;
  }
  if (secs > this.maxSeconds_) {
    this.errorDiv_.innerHTML = lm.getString("c_restrict_mod", "rl_error_too_large");
    return false;
  }
  return true;
};
chatango.group.settings.CustomRateLimitDialog.prototype.listenOnceForRateLimit = function(listener) {
  this.listener_ = listener;
};
chatango.group.settings.CustomRateLimitDialog.prototype.draw = function() {
  chatango.group.settings.CustomRateLimitDialog.superClass_.draw.call(this);
};
chatango.group.settings.CustomRateLimitDialog.prototype.makeVisible = function() {
  goog.style.setStyle(this.getElement(), "visibility", "visible");
};
goog.provide("chatango.group.settings.ChatRestrictions");
goog.require("chatango.group.GroupChatRestrictions");
goog.require("chatango.group.settings.ContentModel");
goog.require("chatango.group.settings.CustomRateLimitDialog");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.Select");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
goog.require("goog.events.EventType");
goog.require("goog.ui.Button");
goog.require("goog.ui.Component.EventType");
goog.require("goog.ui.FlatMenuButtonRenderer");
goog.require("goog.ui.LinkButtonRenderer");
goog.require("goog.ui.MenuRenderer");
chatango.group.settings.ChatRestrictions = function(model, opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.rateLimitSelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  this.ratesInSeconds_ = [5, 15, 30, 60, 120, 300];
  this.customRateLimitSeconds_ = -1;
  this.customRateLimitDialog_ = null;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.model_ = model;
  goog.events.listen(this.model_, chatango.group.GroupChatRestrictions.EventType.RESTRICTION_STATE_CHANGED, this.restrictionStateChanged_, false, this);
  goog.events.listen(this.model_, chatango.group.GroupChatRestrictions.EventType.RATE_LIMIT_SET, this.updateRateLimit_, false, this);
  goog.events.listen(this.model_, chatango.events.EventType.FLAG_UPDATE_ERROR, this.onFlagUpdateError_, false, this);
  goog.events.listen(chatango.users.ModeratorManager.getInstance(), chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, this.onCurrentUserModPermissionChange_, false, this);
  this.localRestrictionState_ = this.model_.getRestriction();
  this.localGroupWillCloseIfNoMods_ = this.model_.getGroupWillCloseIfNoMods();
  this.localProxiesBanned_ = this.model_.getProxiesBanned();
  this.setResizable(false);
};
goog.inherits(chatango.group.settings.ChatRestrictions, chatango.ui.ScrollableDialog);
chatango.group.settings.ChatRestrictions.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.ChatRestrictions");
chatango.group.settings.ChatRestrictions.prototype.dispose = function() {
  this.closeCustomRateLimitDialog();
  if (this.rateLimitSelect_) {
    this.rateLimitSelect_.dispose();
  }
  chatango.group.settings.ChatRestrictions.superClass_.dispose.call(this);
};
chatango.group.settings.ChatRestrictions.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  goog.dom.append(scrollContent, content);
  var handler = this.getHandler();
  this.warningEl_ = dom.createDom("div", {"class":"sdlg-top-section", "id":"warning", "style":"display:none"});
  goog.dom.appendChild(content, this.warningEl_);
  this.anyoneWrapperEl = dom.createDom("div", {"class":"sdlg-top-section", "id":"anyone-wrapper"});
  this.anyoneRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"restrictions", "id":"anyone"});
  this.anyoneLabelEl_ = goog.dom.createDom("label", {"for":"anyone", "style":"font-weight:bold;", "onclick":"", "class":"radio-label"});
  this.anyoneDescEl_ = dom.createDom("div", {"id":"anyonedesc", "style":"margin-left:1.5em;", "class":"radio-desc"}, " ");
  goog.dom.appendChild(this.anyoneWrapperEl, this.anyoneRadioEl);
  goog.dom.appendChild(this.anyoneWrapperEl, this.anyoneLabelEl_);
  goog.dom.appendChild(this.anyoneWrapperEl, this.anyoneDescEl_);
  this.noAnonsWrapperEl = dom.createDom("div", {"class":"sdlg-section"});
  this.noAnonsRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"restrictions", "id":"noanons"});
  this.noAnonsLabelEl_ = goog.dom.createDom("label", {"for":"noanons", "style":"font-weight:bold;", "onclick":"", "class":"radio-label"});
  this.noAnonsDescEl_ = dom.createDom("div", {"id":"nonedesc", "style":"margin-left:1.5em;", "class":"radio-desc"}, " ");
  goog.dom.appendChild(this.noAnonsWrapperEl, this.noAnonsRadioEl);
  goog.dom.appendChild(this.noAnonsWrapperEl, this.noAnonsLabelEl_);
  goog.dom.appendChild(this.noAnonsWrapperEl, this.noAnonsDescEl_);
  this.broadcastModeWrapperEl = dom.createDom("div", {"class":"sdlg-section"});
  this.broadcastModeRadioEl = goog.dom.createDom("input", {"type":"radio", "name":"restrictions", "id":"broadcastMode"});
  this.broadcastModeLabelEl_ = goog.dom.createDom("label", {"for":"broadcastMode", "style":"font-weight:bold;", "onclick":"", "class":"radio-label"});
  this.broadcastModeDescEl_ = dom.createDom("div", {"id":"nonedesc", "style":"margin-left:1.5em;", "class":"radio-desc"}, " ");
  goog.dom.appendChild(this.broadcastModeWrapperEl, this.broadcastModeRadioEl);
  goog.dom.appendChild(this.broadcastModeWrapperEl, this.broadcastModeLabelEl_);
  goog.dom.appendChild(this.broadcastModeWrapperEl, this.broadcastModeDescEl_);
  handler.listen(this.anyoneWrapperEl, goog.events.EventType.CLICK, this.onAnyone);
  goog.dom.appendChild(content, this.anyoneWrapperEl);
  handler.listen(this.noAnonsWrapperEl, goog.events.EventType.CLICK, this.onNoanon);
  goog.dom.appendChild(content, this.noAnonsWrapperEl);
  handler.listen(this.broadcastModeWrapperEl, goog.events.EventType.CLICK, this.onBroadcastMode);
  goog.dom.appendChild(content, this.broadcastModeWrapperEl);
  goog.dom.appendChild(content, goog.dom.createDom("hr"));
  this.closedSansModsWrapper_ = dom.createDom("div", {"class":"sdlg-section", "id":"closed-wrapper"});
  this.closedSansModsCB_ = new chatango.ui.Checkbox;
  this.closedSansModsCB_.render(this.closedSansModsWrapper_);
  goog.style.setStyle(this.closedSansModsCB_.getElement(), "font-weight", "bold");
  this.closedSansModsDescEl_ = goog.dom.createDom("div", {"class":"cb-desc", "style":"margin-left:1.5em;"});
  goog.dom.appendChild(this.closedSansModsWrapper_, this.closedSansModsDescEl_);
  goog.events.listen(this.closedSansModsCB_, goog.ui.Component.EventType.CHANGE, this.onClosedSansModsCBChanged_, false, this);
  goog.dom.append(content, this.closedSansModsWrapper_);
  goog.dom.appendChild(content, goog.dom.createDom("hr"));
  var isInRateLimitMode = this.model_.isInRateLimitMode();
  this.floodControlWrapper_ = dom.createDom("div", {"class":"sdlg-section", "id":"fc-wrapper"});
  this.floodControlRadio_ = goog.dom.createDom("input", {"type":"radio", "name":"ratecontrol", "id":"floodcontrol"});
  this.floodControlLabel_ = goog.dom.createDom("label", {"for":"floodcontrol", "style":"font-weight:bold;", "onclick":"", "class":"radio-label"});
  this.floodControlDesc_ = dom.createDom("div", {"id":"floodcontroldesc", "style":"margin-left:1.5em;", "class":"radio-desc"}, " ");
  goog.dom.appendChild(this.floodControlWrapper_, this.floodControlRadio_);
  goog.dom.appendChild(this.floodControlWrapper_, this.floodControlLabel_);
  goog.dom.appendChild(this.floodControlWrapper_, this.floodControlDesc_);
  goog.dom.append(content, this.floodControlWrapper_);
  handler.listen(this.floodControlWrapper_, goog.events.EventType.CLICK, this.onFloodControl);
  this.rateLimitWrapper_ = dom.createDom("div", {"class":"sdlg-section", "id":"rl-wrapper"});
  var rateLimitRadioWrapper = dom.createDom("div", {"id":"rl-radio-wrapper"});
  this.rateLimitRadio_ = goog.dom.createDom("input", {"type":"radio", "name":"ratecontrol", "id":"ratelimitcontrol"});
  this.rateLimitLabel_ = goog.dom.createDom("label", {"for":"ratelimitcontrol", "style":"font-weight:bold;", "onclick":"", "class":"radio-label"});
  goog.dom.append(rateLimitRadioWrapper, this.rateLimitRadio_);
  goog.dom.appendChild(rateLimitRadioWrapper, this.rateLimitLabel_);
  goog.dom.appendChild(this.rateLimitWrapper_, rateLimitRadioWrapper);
  this.rateLimitSelect_.setEnabled(true);
  var rateLimitSelectWrapper = goog.dom.createDom("div", {"id":"rl-select-wrapper", "style":"margin-left:1.5em;"});
  this.rateLimitSelectLabel_ = goog.dom.createDom("label", {"id":"rl-select-label", "class":"select-label"});
  this.rateLimitSpan_ = goog.dom.createDom("span");
  goog.dom.append(this.rateLimitSelectLabel_, this.rateLimitSpan_);
  var that = this;
  this.ratesInSeconds_.forEach(function(e) {
    that.rateLimitSelect_.addItem(new goog.ui.MenuItem("" + e + " seconds", e));
  });
  var customLabel = this.lm_.getString("c_restrict_mod", "rate_limit_custom");
  this.rateLimitSelect_.addItem(new goog.ui.MenuItem(customLabel, -1));
  this.rateLimitSelect_.setSelectedIndex(2);
  this.dropDownWrapper_ = goog.dom.createDom("div", {"style":"display:inline;"});
  goog.dom.append(this.rateLimitSelectLabel_, this.dropDownWrapper_);
  this.rateLimitSelect_.render(this.dropDownWrapper_);
  this.rateLimitSelect_.setFocusablePopupMenu(true);
  this.rateLimitSelect_.setScrollOnOverflow(true);
  if (chatango.managers.Environment.getInstance().isMobile()) {
    var el = this.rateLimitSelect_.getElement();
    var pos = goog.positioning.Corner.TOP_END;
    var ap = new goog.positioning.AnchoredPosition(el, pos, null);
    this.rateLimitSelect_.setMenuPosition(ap);
  }
  goog.dom.append(rateLimitSelectWrapper, this.rateLimitSelectLabel_);
  goog.dom.appendChild(this.rateLimitWrapper_, rateLimitSelectWrapper);
  goog.dom.append(content, this.rateLimitWrapper_);
  handler.listen(rateLimitRadioWrapper, goog.events.EventType.CLICK, this.onRateLimit);
  this.updateRateLimit_();
  var that = this;
  goog.events.listen(this.rateLimitSelect_, goog.ui.Component.EventType.ACTION, function(e) {
    that.onRateLimitSelectChange(e);
  });
  goog.events.listen(this.rateLimitSelect_, goog.ui.Component.EventType.SHOW, function(e) {
    var bounds = goog.style.getBounds(goog.dom.getDocument().body);
    bounds.width = bounds.height * 1.1;
  });
  goog.dom.appendChild(content, goog.dom.createDom("hr"));
  this.banProxiesWrapper_ = dom.createDom("div", {"class":"sdlg-section", "id":"proxies-wrapper"});
  this.banProxiesCB_ = new chatango.ui.Checkbox;
  this.banProxiesCB_.render(this.banProxiesWrapper_);
  goog.style.setStyle(this.banProxiesCB_.getElement(), "font-weight", "bold");
  this.banProxiesDescWrapper_ = goog.dom.createDom("div", {"class":"cb-desc", "style":"margin-left:1.5em;"});
  this.banProxiesDescEl_ = goog.dom.createDom("div");
  goog.dom.appendChild(this.banProxiesDescWrapper_, this.banProxiesDescEl_);
  goog.dom.appendChild(this.banProxiesWrapper_, this.banProxiesDescWrapper_);
  goog.events.listen(this.banProxiesCB_, goog.ui.Component.EventType.CHANGE, this.onBanProxiesCBChanged_, false, this);
  goog.dom.append(content, this.banProxiesWrapper_);
  this.footnote_ = goog.dom.createDom("div");
  var footnote = goog.dom.createDom("div", {"class":"fineprint", "style":"font-size:80%;"}, [this.footnote_]);
  goog.dom.append(content, footnote);
  this.updateCopy();
  this.updateUI_();
};
chatango.group.settings.ChatRestrictions.prototype.onAnyone = function(e) {
  if (this.anyoneRadioEl.disabled) {
    return;
  }
  if (this.model_.getRestriction() != chatango.group.GroupChatRestrictions.RestrictionState.ANYONE) {
    this.localRestrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.ANYONE;
    this.updateUI_(true);
    this.model_.setRestriction(chatango.group.GroupChatRestrictions.RestrictionState.ANYONE);
  }
  e.preventDefault();
};
chatango.group.settings.ChatRestrictions.prototype.onNoanon = function(e) {
  if (this.noAnonsRadioEl.disabled) {
    return;
  }
  if (this.model_.getRestriction() != chatango.group.GroupChatRestrictions.RestrictionState.NOANON) {
    this.localRestrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.NOANON;
    this.updateUI_(true);
    this.model_.setRestriction(chatango.group.GroupChatRestrictions.RestrictionState.NOANON);
  }
  e.preventDefault();
};
chatango.group.settings.ChatRestrictions.prototype.onBroadcastMode = function(e) {
  if (this.broadcastModeRadioEl.disabled) {
    return;
  }
  if (this.model_.getRestriction() != chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST) {
    this.localRestrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST;
    this.updateUI_(true);
    this.model_.setRestriction(chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST);
  }
  e.preventDefault();
};
chatango.group.settings.ChatRestrictions.prototype.onClosedSansModsCBChanged_ = function(e) {
  this.localGroupWillCloseIfNoMods_ = this.closedSansModsCB_.isChecked();
  this.updateUI_(true);
  this.model_.setGroupWillCloseIfNoMods(this.closedSansModsCB_.isChecked());
};
chatango.group.settings.ChatRestrictions.prototype.onBanProxiesCBChanged_ = function(e) {
  this.localProxiesBanned_ = this.banProxiesCB_.isChecked();
  this.updateUI_(true);
  this.model_.setProxiesBanned(this.banProxiesCB_.isChecked());
};
chatango.group.settings.ChatRestrictions.prototype.onFloodControl = function(e) {
  if (this.floodControlRadio_.disabled) {
    return;
  }
  if (!this.floodControlRadio_.checked) {
    this.closeCustomRateLimitDialog();
    this.floodControlRadio_.checked = true;
    this.rateLimitSelect_.setEnabled(false);
    this.model_.setRateLimit(0);
    goog.dom.classes.add(this.dropDownWrapper_, "disabled-text");
  }
  e.preventDefault();
};
chatango.group.settings.ChatRestrictions.prototype.onRateLimit = function(e) {
  if (this.rateLimitRadio_.disabled) {
    return;
  }
  if (!this.rateLimitRadio_.checked) {
    var rateInSeconds = this.rateLimitSelect_.getValue();
    if (rateInSeconds < 0) {
      rateInSeconds = this.customRateLimitSeconds_;
    }
    this.setRateLimit_(rateInSeconds);
    this.rateLimitRadio_.checked = true;
    this.rateLimitSelect_.setEnabled(true);
    goog.dom.classes.remove(this.dropDownWrapper_, "disabled-text");
  }
  this.rateLimitRadio_.checked = true;
  e.preventDefault();
};
chatango.group.settings.ChatRestrictions.prototype.onRateLimitSelectChange = function(e) {
  var selectedValue = this.rateLimitSelect_.getValue();
  if (selectedValue < 0) {
    if (this.customRateLimitDialog_) {
      return;
    }
    this.customRateLimitDialog_ = new chatango.group.settings.CustomRateLimitDialog(this.customRateLimitSeconds_);
    var that = this;
    this.customRateLimitDialog_.listenOnceForRateLimit(function(e) {
      that.onCustomRateLimit_(e);
    });
    goog.events.listenOnce(this.customRateLimitDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, function(e) {
      that.onDialogClosed_(e);
    });
    this.customRateLimitDialog_.setVisible(true);
    if (-1 != this.customRateLimitSeconds_) {
      this.rateLimitSelect_.setCaption("" + this.customRateLimitSeconds_ + " seconds");
    }
  } else {
    var that = this;
    this.model_.getRateLimitSeconds(function(rateInSeconds) {
      if (rateInSeconds != selectedValue) {
        that.setRateLimit_(selectedValue);
      }
    });
    this.customRateLimitSeconds_ = -1;
    this.closeCustomRateLimitDialog();
  }
};
chatango.group.settings.ChatRestrictions.prototype.setRateLimitSelect_ = function(rateInSeconds) {
  var index = this.ratesInSeconds_.indexOf(rateInSeconds);
  if (-1 != index) {
    this.rateLimitSelect_.setSelectedIndex(index);
  } else {
    this.customRateLimitSeconds_ = rateInSeconds;
    var customIndex = this.rateLimitSelect_.getItemCount() - 1;
    var customItem = this.rateLimitSelect_.getItemAt(customIndex);
    this.rateLimitSelect_.setSelectedIndex(customIndex);
    this.rateLimitSelect_.setCaption("" + rateInSeconds + " seconds");
  }
};
chatango.group.settings.ChatRestrictions.prototype.closeCustomRateLimitDialog = function() {
  if (this.customRateLimitDialog_) {
    this.customRateLimitDialog_.close();
  }
  this.customRateLimitDialog_ = null;
};
chatango.group.settings.ChatRestrictions.prototype.onDialogClosed_ = function(e) {
  if (this.customRateLimitDialog_) {
    this.customRateLimitDialog_ = null;
    this.getAndSetRateLimitSelect_();
  }
};
chatango.group.settings.ChatRestrictions.prototype.restrictionStateChanged_ = function(e) {
  this.localGroupWillCloseIfNoMods_ = this.model_.getGroupWillCloseIfNoMods();
  this.localRestrictionState_ = this.model_.getRestriction();
  this.updateUI_();
};
chatango.group.settings.ChatRestrictions.prototype.onFlagUpdateError_ = function(e) {
  this.updateUI_();
};
chatango.group.settings.ChatRestrictions.prototype.onCurrentUserModPermissionChange_ = function(e) {
  this.updateUI_();
};
chatango.group.settings.ChatRestrictions.prototype.updateUI_ = function(opt_updateFromLocalState) {
  var state = opt_updateFromLocalState ? this.localRestrictionState_ : this.model_.getRestriction();
  var groupWillCloseIfNoMods = opt_updateFromLocalState ? this.localGroupWillCloseIfNoMods_ : this.model_.getGroupWillCloseIfNoMods();
  var proxiesBanned = opt_updateFromLocalState ? this.localProxiesBanned_ : this.model_.getProxiesBanned();
  this.anyoneRadioEl.checked = state == chatango.group.GroupChatRestrictions.RestrictionState.ANYONE;
  this.noAnonsRadioEl.checked = state == chatango.group.GroupChatRestrictions.RestrictionState.NOANON;
  this.broadcastModeRadioEl.checked = state == chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST;
  this.closedSansModsCB_.setChecked(groupWillCloseIfNoMods);
  this.banProxiesCB_.setChecked(proxiesBanned);
  var inBroadcastMode = state == chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST;
  var hasPermissionToCloseGroup = chatango.users.ModeratorManager.getInstance().hasPermission(chatango.users.UserManager.getInstance().currentUser.getSid(), chatango.group.moderation.Permissions.Flags.CLOSE_GROUP);
  var closedSansModsCBEnabled = !inBroadcastMode && hasPermissionToCloseGroup;
  this.closedSansModsCB_.setEnabled(closedSansModsCBEnabled);
  goog.dom.classes.enable(this.closedSansModsDescEl_, "disabled", !closedSansModsCBEnabled);
  if (!closedSansModsCBEnabled) {
    if (inBroadcastMode) {
      this.closedSansModsCB_.setChecked(true);
    }
  }
  this.broadcastModeRadioEl.disabled = !hasPermissionToCloseGroup;
  goog.dom.classes.enable(this.broadcastModeLabelEl_, "disabled", !hasPermissionToCloseGroup);
  goog.dom.classes.enable(this.broadcastModeDescEl_, "disabled", !hasPermissionToCloseGroup);
  this.anyoneRadioEl.disabled = inBroadcastMode && !hasPermissionToCloseGroup;
  goog.dom.classes.enable(this.anyoneLabelEl_, "disabled", inBroadcastMode && !hasPermissionToCloseGroup);
  goog.dom.classes.enable(this.anyoneDescEl_, "disabled", inBroadcastMode && !hasPermissionToCloseGroup);
  this.noAnonsRadioEl.disabled = inBroadcastMode && !hasPermissionToCloseGroup;
  goog.dom.classes.enable(this.noAnonsLabelEl_, "disabled", inBroadcastMode && !hasPermissionToCloseGroup);
  goog.dom.classes.enable(this.noAnonsDescEl_, "disabled", inBroadcastMode && !hasPermissionToCloseGroup);
  if (inBroadcastMode && !hasPermissionToCloseGroup) {
    goog.style.setStyle(this.warningEl_, "display", "block");
  } else {
    goog.style.setStyle(this.warningEl_, "display", "none");
  }
};
chatango.group.settings.ChatRestrictions.prototype.updateRateLimit_ = function(opt_e) {
  var isInRateLimitMode = this.model_.isInRateLimitMode();
  this.floodControlRadio_.checked = !isInRateLimitMode;
  this.rateLimitRadio_.checked = isInRateLimitMode;
  this.rateLimitSelect_.setEnabled(isInRateLimitMode);
  goog.dom.classes.enable(this.dropDownWrapper_, "disabled-text", isInRateLimitMode);
  if (isInRateLimitMode) {
    this.model_.getRateLimitSeconds(goog.bind(function(rateInSeconds) {
      this.setRateLimitSelect_(rateInSeconds);
    }, this));
  }
};
chatango.group.settings.ChatRestrictions.prototype.onCustomRateLimit_ = function(rateInSeconds) {
  this.setRateLimit_(rateInSeconds);
  this.setRateLimitSelect_(rateInSeconds);
  this.customRateLimitDialog_ = null;
};
chatango.group.settings.ChatRestrictions.prototype.getAndSetRateLimitSelect_ = function() {
  var that = this;
  this.model_.getRateLimitSeconds(function(rateInSeconds) {
    that.setRateLimitSelect_(rateInSeconds);
  });
};
chatango.group.settings.ChatRestrictions.prototype.setRateLimit_ = function(rateInSeconds) {
  if (rateInSeconds > 0) {
    this.model_.setRateLimit(rateInSeconds);
  } else {
    if (chatango.DEBUG) {
      console.log("unexpected rateInSeconds value: " + rateInSeconds);
    }
  }
};
chatango.group.settings.ChatRestrictions.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("c_restrict_mod", "chat_restrictions"));
  this.anyoneLabelEl_.innerHTML = this.lm_.getString("c_restrict_mod", "anyone");
  this.noAnonsLabelEl_.innerHTML = this.lm_.getString("c_restrict_mod", "no_anons");
  this.anyoneDescEl_.innerHTML = this.lm_.getString("c_restrict_mod", "anyone_post");
  this.noAnonsDescEl_.innerHTML = this.lm_.getString("c_restrict_mod", "users_post");
  this.broadcastModeLabelEl_.innerHTML = this.lm_.getString("c_restrict_mod", "broadcast_mode");
  this.broadcastModeDescEl_.innerHTML = this.lm_.getString("c_restrict_mod", "only_owner_and_mods");
  this.closedSansModsCB_.setCaption(this.lm_.getString("c_restrict_mod", "closed_no_mods"));
  this.closedSansModsDescEl_.innerHTML = this.lm_.getString("c_restrict_mod", "if_no_mods");
  this.floodControlLabel_.innerHTML = this.lm_.getString("c_restrict_mod", "flood_control");
  this.floodControlDesc_.innerHTML = this.lm_.getString("c_restrict_mod", "flood_control_desc");
  this.rateLimitLabel_.innerHTML = this.lm_.getString("c_restrict_mod", "rate_limit");
  this.rateLimitSpan_.innerHTML = this.lm_.getString("c_restrict_mod", "rate_limit_select");
  this.warningEl_.innerHTML = this.lm_.getString("c_restrict_mod", "all_disabled_warning");
  this.banProxiesCB_.setCaption(this.lm_.getString("c_restrict_mod", "ban_proxies"));
  this.banProxiesDescEl_.innerHTML = this.lm_.getString("c_restrict_mod", "ban_proxies_desc");
  this.footnote_.innerHTML = this.lm_.getString("c_restrict_mod", "ban_proxies_ftn");
};
chatango.group.settings.ChatRestrictions.prototype.disposeInternal = function() {
  goog.events.unlisten(this.model_, chatango.group.GroupChatRestrictions.EventType.RATE_LIMIT_SET, this.updateRateLimit_, false, this);
  goog.events.unlisten(this.model_, chatango.group.GroupChatRestrictions.EventType.RESTRICTION_STATE_CHANGED, this.restrictionStateChanged_, false, this);
  goog.events.unlisten(this.model_, chatango.events.EventType.FLAG_UPDATE_ERROR, this.onFlagUpdateError_, false, this);
  goog.events.unlisten(chatango.users.ModeratorManager.getInstance(), chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, this.onCurrentUserModPermissionChange_, false, this);
  chatango.group.settings.ChatRestrictions.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.SettingsModule");
goog.require("chatango.events.EventType");
goog.require("chatango.group.settings.ChatRestrictions");
goog.require("chatango.group.settings.SettingsMenu");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.utils.display");
goog.require("chatango.utils.style");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
chatango.modules.SettingsModule = function(connection, groupInfo, chatRestrictions, managers, announcements) {
  goog.base(this);
  chatango.managers.LanguageManager.getInstance().getStringPack("owner_module", chatango.modules.SettingsModule.strs, this.initCopy, this);
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.connection_ = connection;
  this.groupInfo_ = groupInfo;
  this.chatRestrictions_ = chatRestrictions;
  this.managers_ = managers;
  this.announcements_ = announcements;
  this.menu_ = new chatango.group.settings.SettingsMenu;
  this.menu_.render(document.body);
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.menu_, chatango.group.settings.SettingsMenu.EVENTS, this.onMenuEvent_);
};
goog.inherits(chatango.modules.SettingsModule, goog.events.EventTarget);
chatango.modules.SettingsModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.SettingsModule");
chatango.modules.SettingsModule.prototype.installMenu = function(element, elementCorner, menuCorner) {
  this.menu_.updateItems();
  this.menu_.showAtElement(element, elementCorner, menuCorner);
};
chatango.modules.SettingsModule.prototype.getEditGroupModule_ = function() {
  if (typeof this.editGroupModule_ === "undefined") {
    this.editGroupModule_ = new chatango.modules.EditGroupModule(this.connection_, this.groupInfo_);
  }
  return this.editGroupModule_;
};
chatango.modules.SettingsModule.prototype.getChatRestrictionsModule_ = function() {
  if (typeof this.chatRestrictionsModule_ === "undefined") {
    this.chatRestrictionsModule_ = new chatango.modules.ChatRestrictionsModule(this.chatRestrictions_);
  }
  return this.chatRestrictionsModule_;
};
chatango.modules.SettingsModule.prototype.getContentControlModule_ = function() {
  if (typeof this.contentControlModule_ === "undefined") {
    this.contentControlModule_ = new chatango.modules.ContentControlModule(this.connection_, this.groupInfo_, this.managers_);
  }
  return this.contentControlModule_;
};
chatango.modules.SettingsModule.prototype.getAnnouncementsModule_ = function() {
  if (typeof this.announcementsModule_ === "undefined") {
    this.announcementsModule_ = new chatango.modules.AnnouncementsModule(this.announcements_);
    goog.events.listen(this.announcementsModule_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.changedStyle_, undefined, this);
  }
  return this.announcementsModule_;
};
chatango.modules.SettingsModule.prototype.getSupportChatangoModule_ = function() {
  if (typeof this.supportChatangoModule_ === "undefined") {
    this.supportChatangoModule_ = new chatango.modules.SupportChatangoModule;
  }
  return this.supportChatangoModule_;
};
chatango.modules.SettingsModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("ui") && lm.isPackLoaded("owner_module")) {
    if (this.menu_) {
      this.menu_.initCopy();
    }
  }
};
chatango.modules.SettingsModule.prototype.onMenuEvent_ = function(e) {
  if (e.type === chatango.group.settings.EventType.LOG_OUT) {
    this.dispatchEvent(chatango.events.EventType.LOGOUT);
  } else {
    if (e.type === chatango.group.settings.EventType.CONTENT_CONTROLS) {
      if (!this.contentControlModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("ContentControlModule", function() {
          this.getContentControlModule_().openContentControlDialog();
        }, this);
      } else {
        this.getContentControlModule_().openContentControlDialog();
      }
    } else {
      if (e.type === chatango.group.settings.EventType.EDIT_ANNOUNCEMENT) {
        if (!this.announcementsModule_) {
          goog.module.ModuleManager.getInstance().execOnLoad("AnnouncementsModule", function() {
            this.getAnnouncementsModule_().openAnnouncementsDialog();
          }, this);
        } else {
          this.getAnnouncementsModule_().openAnnouncementsDialog();
        }
      } else {
        if (e.type === chatango.group.settings.EventType.EDIT_GROUP) {
          if (!this.editGroupModule_) {
            goog.module.ModuleManager.getInstance().execOnLoad("EditGroupModule", function() {
              this.getEditGroupModule_().openEditGroupDialog();
            }, this);
          } else {
            this.getEditGroupModule_().openEditGroupDialog();
          }
        } else {
          if (e.type === chatango.events.EventType.EDIT_PROFILE) {
            this.dispatchEvent(e);
          } else {
            if (e.type === chatango.group.settings.EventType.CHAT_RESTRICTIONS) {
              if (!this.chatRestrictionsModule_) {
                goog.module.ModuleManager.getInstance().execOnLoad("ChatRestrictionsModule", function() {
                  this.getChatRestrictionsModule_().openChatRestrictionsDialog();
                }, this);
              } else {
                this.getChatRestrictionsModule_().openChatRestrictionsDialog();
              }
            } else {
              if (e.type === chatango.group.settings.EventType.SUPPORT_CHATANGO) {
                if (!this.supportChatangoModule_) {
                  goog.module.ModuleManager.getInstance().execOnLoad("SupportChatangoModule", function() {
                    this.getSupportChatangoModule_().openSupportChatangoDialog();
                  }, this);
                } else {
                  this.getSupportChatangoModule_().openSupportChatangoDialog();
                }
              }
            }
          }
        }
      }
    }
  }
};
chatango.modules.SettingsModule.prototype.closePopUps = function() {
  if (this.contentControlModule_) {
    this.getContentControlModule_().closePopUps();
  }
  if (this.chatRestrictionsModule_) {
    this.getChatRestrictionsModule_().closePopUps();
  }
  if (this.editGroupModule_) {
    this.getEditGroupModule_().closePopUps();
  }
  if (this.announcementsModule_) {
    this.getAnnouncementsModule_().closePopUps();
  }
  if (this.supportChatangoModule_) {
    this.getSupportChatangoModule_().closePopUps();
  }
};
chatango.modules.SettingsModule.prototype.changedStyle_ = function(e) {
  this.dispatchEvent(chatango.events.MessageStyleEvent.EventType.CHANGED);
};
chatango.modules.SettingsModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.contentControlModule_) {
    this.getContentControlModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.chatRestrictionsModule_) {
    this.getChatRestrictionsModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.editGroupModule_) {
    this.getEditGroupModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.announcementsModule_) {
    this.getAnnouncementsModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.supportChatangoModule_) {
    this.getSupportChatangoModule_().constrainDialogsToScreen(opt_stageRect);
  }
};
chatango.modules.SettingsModule.strs = {"log_out":"Log out", "log_out_tt":"Log out *name*", "settings":"Settings", "edit_group":"Edit group", "edit_group_tt":"Title*br*Owner's message*br*Toggle counter*br*Delete all messages", "edit_profile":"Edit profile", "edit_profile_tt":"Picture", "support_chatango":"Extended features", "support_chatango_tt":"Message customizations\r\nOriginal accounts", "banned_content":"Banned content", "banned_content_tt":"Ban words*br*Disable links*br*Disable videos*br*Disable images", 
"chat_restrictions":"Chat restrictions", "chat_restrictions_tt":"No anons\r\nRate limits", "announcement":"Auto announcement", "announcement_sm":"Auto anncmnt.", "announcement_tt":"Edit the auto periodic announcements"};
goog.module.ModuleManager.getInstance().setLoaded("SettingsModule");

