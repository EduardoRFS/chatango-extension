goog.provide("chatango.group.moderation.ModActionData");
chatango.group.moderation.ModActionData = function(actionId, actionType, actionDoer, sellerIP, actionTarget, timeLogged, actionInfo) {
  this.actionId = actionId;
  this.actionType = actionType;
  this.actionDoer = actionDoer;
  this.sellerIP = sellerIP;
  this.actionTarget = actionTarget;
  this.timeLogged = timeLogged;
  this.actionInfo = actionInfo;
};
goog.provide("chatango.group.moderation.ModActionsModel");
goog.require("chatango.group.moderation.ModActionData");
chatango.group.moderation.ModActionsModel = function() {
  goog.events.EventTarget.call(this);
  this.actions_ = [];
  this.mostRecentActionId_ = -1;
  this.oldestActionId_ = -1;
};
goog.inherits(chatango.group.moderation.ModActionsModel, goog.events.EventTarget);
chatango.group.moderation.ModActionsModel.prototype.addAction = function(action) {
  var index;
  var actionId = Number(action.actionId);
  if (actionId > this.mostRecentActionId_) {
    this.actions_.unshift(action);
    this.mostRecentActionId_ = actionId;
    index = 0;
  } else {
    index = this.actions_.push(action) - 1;
  }
  if (actionId < this.oldestActionId_ || this.oldestActionId_ == -1) {
    this.oldestActionId_ = actionId;
  }
  return index;
};
chatango.group.moderation.ModActionsModel.prototype.getActionAtIndice = function(i) {
  return this.actions_[i];
};
chatango.group.moderation.ModActionsModel.prototype.getActions = function(startInd, endInd) {
  if (this.actions_[startInd] && this.actions_[endInd]) {
    if (startInd > endInd) {
      var actions = this.actions_.slice(endInd, startInd + 1);
      return actions;
    }
    return this.actions_.slice(startInd, endInd + 1);
  }
  return[];
};
chatango.group.moderation.ModActionsModel.prototype.getMostRecentActionId = function() {
  return Number(this.mostRecentActionId_);
};
chatango.group.moderation.ModActionsModel.prototype.getOldestActionId = function() {
  return Number(this.oldestActionId_);
};
chatango.group.moderation.ModActionsModel.prototype.reset = function() {
  this.actions_.length = 0;
  this.actions_ = [];
  this.mostRecentActionId_ = -1;
  this.oldestActionId_ = -1;
};
goog.provide("chatango.group.moderation.ModActionsController");
goog.require("chatango.group.moderation.ModActionsModel");
goog.require("chatango.group.moderation.ModActionData");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.json");
goog.require("goog.object");
chatango.group.moderation.ModActionsController = function(connection) {
  goog.events.EventTarget.call(this);
  this.um_ = chatango.users.UserManager.getInstance();
  this.connection_ = connection;
  this.model_ = new chatango.group.moderation.ModActionsModel;
  this.requestPending_ = false;
  this.hasLoaded_ = false;
  this.lastBatchStartInd_ = -1;
  this.lastBatchEndInd_ = -1;
};
goog.inherits(chatango.group.moderation.ModActionsController, goog.events.EventTarget);
chatango.group.moderation.ModActionsController.Direction = {PREV:"prev", NEXT:"next"};
chatango.group.moderation.ModActionsController.prototype.initLoad = function() {
  this.model_.reset();
  this.hasLoaded_ = false;
  this.loadActions();
};
chatango.group.moderation.ModActionsController.prototype.getMoreFromBottom = function() {
  if (!this.hasLoaded_) {
    return;
  }
  if (this.noMoreAtBottom_) {
    return;
  }
  if (this.model_.getOldestActionId() == 1) {
    this.noMoreAtBottom_ = true;
    return;
  }
  this.lastRequestDir_ = chatango.group.moderation.ModActionsController.Direction.PREV;
  this.loadActions(this.model_.getOldestActionId() - 1, this.lastRequestDir_);
};
chatango.group.moderation.ModActionsController.prototype.getMoreFromTop = function() {
  if (!this.hasLoaded_) {
    return;
  }
  this.lastRequestDir_ = chatango.group.moderation.ModActionsController.Direction.NEXT;
  this.loadActions(this.model_.getMostRecentActionId() + 1, this.lastRequestDir_);
};
chatango.group.moderation.ModActionsController.prototype.loadActions = function(opt_startId, opt_direction, opt_limit) {
  if (this.requestPending_) {
    return false;
  }
  var startId = opt_startId ? opt_startId : 0;
  var direction = opt_direction ? opt_direction : chatango.group.moderation.ModActionsController.Direction.PREV;
  var limit = 50;
  goog.events.listenOnce(this.connection_, chatango.networking.GroupConnectionEvent.EventType.modactions, this.onActionsLoaded_, false, this);
  this.requestPending_ = true;
  this.connection_.send("getmodactions:" + direction + ":" + startId + ":" + limit);
  return true;
};
chatango.group.moderation.ModActionsController.prototype.onActionsLoaded_ = function(e) {
  var actions = e.data.slice(1).join(":").split(";");
  if (actions[0] === "") {
    actions = [];
  }
  var i, action, a, data, aJSON, ind;
  var len = actions.length;
  for (i = 0;i < len;i++) {
    a = actions[i];
    action = new chatango.group.moderation.ModActionData;
    data = a.split(",");
    action.actionId = data[0];
    action.actionType = data[1];
    action.sellerId = data[2];
    action.sellerIP = data[3];
    action.targetSid = data[4] === "None" ? null : data[4];
    action.timeLogged = new Date(parseInt(data[5], 10) * 1E3);
    aJSON = data.slice(6).join(",");
    action.actionInfo = aJSON === "" ? null : goog.json.parse(aJSON);
    action.actionDoer = this.um_.addUser("mod_actions", action.sellerId, chatango.users.User.UserType.SELLER);
    action.actionTarget = action.targetSid ? this.um_.addUser("mod_actions", action.targetSid, chatango.users.User.UserType.SELLER) : null;
    ind = this.model_.addAction(action);
    if (i == 0) {
      this.lastBatchStartInd_ = ind;
    } else {
      if (ind == 0) {
        this.lastBatchStartInd_++;
      }
    }
  }
  if (len == 0 && this.lastRequestDir_ == chatango.group.moderation.ModActionsController.Direction.PREV) {
    this.noMoreAtBottom_ = true;
  }
  this.lastBatchEndInd_ = ind;
  this.dispatchEvent(chatango.group.moderation.ModActionsController.EventType.ACTIONS_LOADED);
  this.requestPending_ = false;
  this.hasLoaded_ = true;
};
chatango.group.moderation.ModActionsController.prototype.getLastBatch = function() {
  return this.model_.getActions(this.lastBatchStartInd_, this.lastBatchEndInd_);
};
chatango.group.moderation.ModActionsController.prototype.getLastBatchDirection = function() {
  return this.lastBatchStartInd_ < this.lastBatchEndInd_ ? chatango.group.moderation.ModActionsController.Direction.PREV : chatango.group.moderation.ModActionsController.Direction.NEXT;
};
chatango.group.moderation.ModActionsController.EventType = {ACTIONS_LOADED:"loaded"};
chatango.group.moderation.ModActionsController.prototype.hasLoaded = function() {
  return this.hasLoaded_;
};
chatango.group.moderation.ModActionsController.ActionTypes = {ADD_MOD:"amod", ADD_ADMIN:"aadm", REMOVE_MOD:"rmod", REMOVE_ADMIN:"radm", EDIT_MOD:"emod", EDIT_RL:"chrl", EDIT_ANONS:"anon", EDIT_BROADCAST:"brdc", EDIT_CLOSED_IF_NO_MODS:"cinm", AUTO_CLOSED:"acls", AUTO_OPENED:"aopn", SHOW_MOD_ICONS:"shwi", HIDE_MOD_ICONS:"hidi", MODS_CHOOSE_ICONS:"chsi", EDIT_BW:"chbw", BAN_USER:"aban", UNBAN_USER:"rban", EDIT_NLP:"enlp", EDIT_CHANS:"chan", EDIT_COUNTER:"cntr", EDIT_ANNC:"annc", EDIT_GRP:"egrp", EDIT_PRXY:"prxy"};
goog.provide("chatango.strings.ModActionsLogStrings");
chatango.strings.ModActionsLogStrings.strs = {"mod_actions_title":"Moderator Actions Log", "mod_actions_title_sm":"Moderator Log", "action_desc_amod":"*name**ip* made *target* a moderator", "action_desc_aadm":"*name**ip* made *target* an administrator", "action_desc_rmod":"*name**ip* removed *target* as a moderator", "action_desc_radm":"*name**ip* removed *target* as an administrator", "action_desc_emod":"*name**ip* ", "added_perm":"gave *target* permission to: *added*", "and":"and", "removed_perm":"removed *target*'s permission to: *removed*", 
"action_desc_chrl":"*name**ip* changed rate limit to *rl*", "action_desc_anon":"*name**ip* *didallow* anons in the group", "action_desc_prxy":"*name**ip* *didallow* messaging from proxies and VPNs in the group", "action_desc_brdc":"*name**ip* *didenable* broadcast mode", "action_desc_cinm":"*name**ip* *didenable* closed without moderators mode", "action_desc_acls":"Group auto-closed since no moderators were online", "action_desc_aopn":"Group re-opened upon moderator login", "action_desc_chan":"*name**ip* *didenable* channels in the group", 
"action_desc_cntr":"*name**ip* *didenable* the counter in the group", "action_desc_chbw":"*name**ip* changed banned words", "action_desc_enlp":"*name**ip* changed auto-moderation to ", "action_desc_annc":"*name**ip* *didenable* auto-announcement", "action_desc_egrp":"*name**ip* edited group", "action_desc_shwi":"*name**ip* forced moderators to show a badge", "action_desc_hidi":"*name**ip* hid all moderator badges", "action_desc_chsi":"*name**ip* let moderators choose their own badge visibility", 
"enable_annc":" every *n* seconds: *msg*", "perm_edit_mods":"add, remove and edit mods", "perm_edit_mod_visibility":"edit mod visibility", "perm_edit_bw":"edit banned content", "perm_edit_restrictions":"edit chat restrictions", "perm_edit_group":"edit group", "perm_see_counter":"see counter", "perm_see_mod_channel":"see mod channel", "perm_see_mod_actions":"see mod actions log", "perm_can_broadcast":"send messages in broadcast mode", "perm_edit_nlp":"edit auto-moderation", "perm_edit_gp_annc":"edit group announcement", 
"perm_no_sending_limitations":"bypass message sending limitations", "perm_see_ips":"see IPs", "perm_is_staff":"display staff badge", "perm_close_group":"close group input", "flood_cont":"flood controlled", "slow_mode":"slow mode restricted to *time* *secs*", "second":"second", "seconds":"seconds", "disallowed":"disallowed", "allowed":"allowed", "enabled":"enabled", "disabled":"disabled", "nlp_single_msg":"nonsense messages (basic)", "nlp_msg_queue":"repetitious messages", "nlp_ngram":"nonsense messages (advanced)", 
"allow":"allow", "block":"block"};
goog.provide("chatango.group.moderation.ModActionsDialog");
goog.require("chatango.group.moderation.ModActionData");
goog.require("chatango.group.moderation.ModActionsController");
goog.require("chatango.managers.DateManager");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.object");
chatango.group.moderation.ModActionsDialog = function(controller, opt_domHelper) {
  this.controller_ = controller;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.dm_ = chatango.managers.DateManager.getInstance();
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var width = Math.min(vpWidth * .9, Math.round(6 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper, undefined);
  this.setResizable(false);
  goog.events.listen(this.controller_, chatango.group.moderation.ModActionsController.EventType.ACTIONS_LOADED, this.actionsLoaded, false, this);
};
goog.inherits(chatango.group.moderation.ModActionsDialog, chatango.ui.ScrollableDialog);
chatango.group.moderation.ModActionsDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var scrollContent = this.getContentElement();
  goog.dom.removeChildren(scrollContent);
  this.contentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.contentEl_, "sdlg-sc");
  goog.dom.classes.add(this.contentEl_, "content-dialog");
  goog.dom.append(scrollContent, this.contentEl_);
  this.logTable_ = goog.dom.createDom("table", {"id":"ACTIONS_LOG"});
  goog.dom.append(this.contentEl_, this.logTable_);
  if (this.controller_.hasLoaded()) {
    this.actionsLoaded();
  }
  this.updateCopy();
};
chatango.group.moderation.ModActionsDialog.prototype.actionsLoaded = function(e) {
  this.setVisible(true);
  var log = this.controller_.getLastBatch();
  var direction = this.controller_.getLastBatchDirection();
  var createActionEl = function(action) {
    var row = goog.dom.createDom("tr");
    var dateCell = goog.dom.createDom("td", {"class":"date-cell"});
    dateCell.innerHTML = this.dm_.dateToString(action.timeLogged, "mm/dd/yy<br>g:i:s A");
    goog.dom.append(row, dateCell);
    var infoCell = goog.dom.createDom("td", {"class":"action-cell"});
    infoCell.innerHTML = this.formatLogEntry_(action);
    goog.dom.append(row, infoCell);
    if (direction == chatango.group.moderation.ModActionsController.Direction.PREV) {
      goog.dom.append(this.logTable_, row);
    } else {
      goog.dom.insertChildAt(this.logTable_, row, 0);
    }
  };
  if (direction == chatango.group.moderation.ModActionsController.Direction.PREV) {
    goog.array.forEach(log, createActionEl, this);
  } else {
    goog.array.forEachRight(log, createActionEl, this);
  }
  var el = this.getElement();
  var elDisplayStyle = el.style.display;
  el.style.display = "none";
  bodyRect = goog.style.getBounds(goog.dom.getDocument().body);
  goog.style.setStyle(el, "display", elDisplayStyle);
  bodyRect.height = bodyRect.height * .98;
  chatango.utils.display.constrainToStage(el, bodyRect);
  this.scrollPane_.draw();
};
chatango.group.moderation.ModActionsDialog.prototype.onScroll_ = function(e) {
  if (this.scrollPane_.atTop()) {
    this.controller_.getMoreFromTop();
  } else {
    if (this.scrollPane_.atBottom()) {
      this.controller_.getMoreFromBottom();
    }
  }
};
chatango.group.moderation.ModActionsDialog.prototype.enterDocument = function() {
  chatango.group.moderation.ModActionsDialog.superClass_.enterDocument.call(this);
  goog.events.listen(this.scrollPane_, goog.events.EventType.SCROLL, this.onScroll_, false, this);
  this.updateCopy();
};
chatango.group.moderation.ModActionsDialog.prototype.updateCopy = function() {
  var isSmall = chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedSize();
  var titleCopyKey = isSmall ? "mod_actions_title_sm" : "mod_actions_title";
  this.setTitle(this.lm_.getString("mod_actions", titleCopyKey));
};
chatango.group.moderation.ModActionsDialog.prototype.formatLogEntry_ = function(entry) {
  var msg = this.lm_.getString("mod_actions", "action_desc_" + entry.actionType);
  switch(entry.actionType) {
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_MOD:
      var removedPerms = [];
      var addedPerms = [];
      var inOld, inNew, str;
      goog.object.forEach(chatango.group.moderation.Permissions.Flags, function(value, key) {
        inOld = value & entry.actionInfo[0];
        inNew = value & entry.actionInfo[1];
        if (inNew != inOld) {
          str = this.lm_.getString("mod_actions", "perm_" + chatango.group.moderation.Permissions.FlagStrings["fs" + value].toLowerCase());
          if (chatango.DEBUG) {
            if (value == chatango.group.moderation.Permissions.Flags.MOD_ICON_VISIBLE || value == chatango.group.moderation.Permissions.Flags.STAFF_ICON_VISIBLE) {
              console.log("ModActionsDialog formatLogEntry_: ", entry);
              console.log(chatango.group.moderation.Permissions.FlagStrings["fs" + value].toLowerCase() + (inNew ? " was added" : " was removed"));
            }
          }
          if (str) {
            if (inNew) {
              addedPerms.push(str);
            } else {
              removedPerms.push(str);
            }
          }
        }
      }, this);
      if (addedPerms.length > 0) {
        msg = msg + this.lm_.getString("mod_actions", "added_perm").replace("*added*", addedPerms.join(", ")) + "<BR/>";
      }
      if (addedPerms.length > 0 && removedPerms.length > 0) {
        msg = msg + " " + this.lm_.getString("mod_actions", "and") + " ";
      }
      if (removedPerms.length > 0) {
        msg = msg + this.lm_.getString("mod_actions", "removed_perm").replace("*removed*", removedPerms.join(", "));
      }
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_ANONS:
      msg = msg.replace("*didallow*", entry.actionInfo ? this.lm_.getString("mod_actions", "allowed") : this.lm_.getString("mod_actions", "disallowed"));
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_PRXY:
      msg = msg.replace("*didallow*", entry.actionInfo ? this.lm_.getString("mod_actions", "allowed") : this.lm_.getString("mod_actions", "disallowed"));
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_BROADCAST:
      msg = msg.replace("*didenable*", entry.actionInfo ? this.lm_.getString("mod_actions", "enabled") : this.lm_.getString("mod_actions", "disabled"));
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_CLOSED_IF_NO_MODS:
      msg = msg.replace("*didenable*", entry.actionInfo ? this.lm_.getString("mod_actions", "enabled") : this.lm_.getString("mod_actions", "disabled"));
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_CHANS:
      msg = msg.replace("*didenable*", entry.actionInfo ? this.lm_.getString("mod_actions", "enabled") : this.lm_.getString("mod_actions", "disabled"));
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_COUNTER:
      msg = msg.replace("*didenable*", entry.actionInfo ? this.lm_.getString("mod_actions", "enabled") : this.lm_.getString("mod_actions", "disabled"));
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_RL:
      if (entry.actionInfo === 0) {
        msg = msg.replace("*rl*", this.lm_.getString("mod_actions", "flood_cont"));
      } else {
        msg = msg.replace("*rl*", this.lm_.getString("mod_actions", "slow_mode").replace("*time*", entry.actionInfo));
        if (entry.actionInfo == 1) {
          msg = msg.replace("*secs*", this.lm_.getString("mod_actions", "second"));
        } else {
          msg = msg.replace("*secs*", this.lm_.getString("mod_actions", "seconds"));
        }
      }
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_ANNC:
      msg = msg.replace("*didenable*", entry.actionInfo[0] > 0 ? this.lm_.getString("mod_actions", "enabled") : this.lm_.getString("mod_actions", "disabled"));
      if (entry.actionInfo[0] > 0) {
        annc = decodeURIComponent(entry.actionInfo[2]).replace(/<[nf][^>]*>/g, "");
        annc = annc.replace(/<|>/g, function(c) {
          return c == "<" ? "&lt;" : "&gt;";
        });
        msg = msg + this.lm_.getString("mod_actions", "enable_annc");
        msg = msg.replace("*n*", entry.actionInfo[1]);
        msg = msg.replace("*msg*", annc);
      }
      break;
    case chatango.group.moderation.ModActionsController.ActionTypes.EDIT_NLP:
      var stringKeys = {"nlp_msg_queue":chatango.networking.GroupConnection.flags.NLP_MSGQUEUE, "nlp_single_msg":chatango.networking.GroupConnection.flags.NLP_SINGLEMSG, "nlp_ngram":chatango.networking.GroupConnection.flags.NLP_NGRAM};
      var set = [];
      var unset = [];
      goog.object.forEach(stringKeys, function(value, key) {
        inOld = value & entry.actionInfo[0];
        inNew = value & entry.actionInfo[1];
        if (inNew != inOld) {
          str = this.lm_.getString("mod_actions", key);
          if (str) {
            if (inNew) {
              set.push(str);
            } else {
              unset.push(str);
            }
          }
        }
      }, this);
      if (set.length > 0) {
        msg = msg + " " + this.lm_.getString("mod_actions", "allow") + " " + set.join(" " + this.lm_.getString("mod_actions", "and") + " ");
      }
      if (set.length > 0 && unset.length > 0) {
        msg = msg + " " + this.lm_.getString("mod_actions", "and") + " ";
      } else {
        if (set.length > 0) {
          msg = msg + ".";
        }
      }
      if (unset.length > 0) {
        msg = msg + " " + this.lm_.getString("mod_actions", "block") + " " + unset.join(" " + this.lm_.getString("mod_actions", "and") + " ") + ".";
      }
      break;
    default:
      break;
  }
  msg = msg.replace("*name*", '<span class="doer-name">' + entry.actionDoer.getName() + "</span>");
  var canSeeIP = chatango.users.ModeratorManager.getInstance().hasPermission(chatango.users.UserManager.getInstance().currentUser.getSid(), chatango.group.moderation.Permissions.Flags.SEE_IPS);
  var ip = canSeeIP ? " (" + entry.sellerIP + ")" : "";
  msg = msg.replace("*ip*", ip);
  msg = msg.replace(/\*target\*/g, entry.actionTarget ? '<span class="tar-name">' + entry.actionTarget.getName() + "</span>" : "");
  return msg;
};
chatango.group.moderation.ModActionsDialog.prototype.disposeInternal = function() {
  goog.events.unlisten(this.controller_, chatango.group.moderation.ModActionsController.EventType.ACTIONS_LOADED, this.actionsLoaded, false, this);
  if (this.scrollPane_) {
    goog.events.unlisten(this.scrollPane_, goog.events.EventType.SCROLL, this.onScroll_, false, this);
  }
  this.controller_ = null;
  chatango.group.moderation.ModActionsDialog.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.ModActionsModule");
goog.require("chatango.group.moderation.ModActionsController");
goog.require("chatango.group.moderation.ModActionsDialog");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.ModerationModule");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.strings.ModActionsLogStrings");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.ModActionsModule = function(connection) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("mod_actions", chatango.strings.ModActionsLogStrings.strs, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.connection_ = connection;
  this.controller_ = new chatango.group.moderation.ModActionsController(this.connection_);
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  var modEvents = [chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE];
  goog.events.listen(this.mm_, modEvents, this.onFlagsUpdated_, false, this);
};
chatango.modules.ModActionsModule.prototype.onFlagsUpdated_ = function(e) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var canViewLog = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.SEE_MOD_ACTIONS);
  if (!canViewLog && this.modActionsDialog_) {
    this.closePopUps();
  }
};
chatango.modules.ModActionsModule.prototype.closePopUps = function() {
  if (this.modActionsDialog_) {
    this.modActionsDialog_.dispose();
  }
};
chatango.modules.ModActionsModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var new_h = Math.round(stage_h * .95);
  if (this.modActionsDialog_) {
    this.modActionsDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.modActionsDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.modActionsDialog_.getElement());
  }
};
chatango.modules.ModActionsModule.prototype.openModActionsDialog = function() {
  this.closePopUps();
  this.controller_.initLoad();
  this.modActionsDialog_ = new chatango.group.moderation.ModActionsDialog(this.controller_);
  this.modActionsDialog_.setFullScreenOnMobileAndSmallEmbeds(true);
};
chatango.modules.ModActionsModule.prototype.initCopy = function(pack_id) {
  if (this.modActionsDialog_) {
    this.modActionsDialog_.updateCopy();
  }
};
goog.module.ModuleManager.getInstance().setLoaded("ModActionsModule");

