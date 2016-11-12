goog.provide("chatango.modules.ChatRestrictionsModule");
goog.require("chatango.group.settings.ChatRestrictions");
goog.require("chatango.group.GroupChatRestrictions");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.SettingsModule");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.ChatRestrictionsModule = function(chatRestrictions) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("c_restrict_mod", chatango.modules.ChatRestrictionsModule.strs, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.chatRestrictions_ = chatRestrictions;
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  var modEvents = [chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE];
  goog.events.listen(this.mm_, modEvents, this.onFlagsUpdated_, false, this);
};
chatango.modules.ChatRestrictionsModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.ChatRestrictionsModule");
chatango.modules.ChatRestrictionsModule.prototype.onFlagsUpdated_ = function(e) {
  if (this.chatRestrictionsDialog_) {
    var currentUser = chatango.users.UserManager.getInstance().currentUser;
    var canEditRestrictions = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_RESTRICTIONS);
    if (!canEditRestrictions) {
      this.closePopUps();
    }
  }
};
chatango.modules.ChatRestrictionsModule.prototype.closePopUps = function() {
  if (this.chatRestrictionsDialog_) {
    this.chatRestrictionsDialog_.dispose();
  }
};
chatango.modules.ChatRestrictionsModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.chatRestrictionsDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.chatRestrictionsDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.chatRestrictionsDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.chatRestrictionsDialog_.getElement());
  }
};
chatango.modules.ChatRestrictionsModule.prototype.openChatRestrictionsDialog = function() {
  this.closePopUps();
  this.chatRestrictionsDialog_ = new chatango.group.settings.ChatRestrictions(this.chatRestrictions_);
  this.chatRestrictionsDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
  this.chatRestrictionsDialog_.setVisible(true);
  this.constrainDialogsToScreen();
};
chatango.modules.ChatRestrictionsModule.prototype.initCopy = function(pack_id) {
  if (this.lm_.isPackLoaded("ui") && this.lm_.isPackLoaded("c_restrict_mod")) {
    if (this.chatRestrictionsDialog_) {
      this.chatRestrictionsDialog_.updateCopy();
    }
  }
};
chatango.modules.ChatRestrictionsModule.strs = {"chat_restrictions":"Chat restrictions", "anyone":"Anyone", "no_anons":"No anons", "anyone_post":"Anyone can post", "users_post":"Only verified* Chatango users can post", "flood_control":"Flood controlled", "flood_control_desc":"Automatically limits rapid posting", "rate_limit":"Slow mode*", "rate_limit_select":"Restrict users to one post per ", "rate_limit_fn2":"Does not affect the default * settings", "rate_limit_fn2_fc":"flood control", "rate_limit_secs_lbl":"seconds", 
"rate_limit_custom":"custom", "custom_rl_ok_btn":"Ok", "rl_error_empty":"Must enter a value", "rl_error_not_a_num":"Value must be a number between 5 and 50000", "rl_error_too_small":"Value is too small must be between 5 and 50000", "rl_error_too_large":"Value is too large must be between 5 and 50000", "broadcast_mode":"Broadcast mode", "only_owner_and_mods":"Only the owner and designated moderators can post", "closed_no_mods":"Closed without moderators", "if_no_mods":"If there are no moderators in the group, no one can post", 
"ban_proxies":"Ban proxies and VPNs*", "ban_proxies_desc":"Prevents messaging from a proxy or VPN service", "ban_proxies_ftn":'*Does not apply to the group owner or moderators with "Exempt from sending limitations" permission.', "all_disabled_warning":"The group is in broadcast mode and you do not have permission to change it."};
goog.module.ModuleManager.getInstance().setLoaded("ChatRestrictionsModule");

