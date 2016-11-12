goog.provide("chatango.login.LoginResponseEvent");
goog.require("goog.events.Event");
chatango.login.LoginResponseEvent = function(type, opt_errorCode, opt_target) {
  goog.events.Event.call(this, type, opt_target);
  this.type_ = type;
  this.errorCode_ = opt_errorCode;
};
chatango.login.LoginResponseEvent.EventType = {SUCCESS:"success", ERROR:"error"};
chatango.login.LoginResponseEvent.prototype.getType = function() {
  return this.type_;
};
chatango.login.LoginResponseEvent.prototype.getErrorCode = function() {
  return this.errorCode_;
};
goog.provide("chatango.group.GroupConnectionUI");
goog.require("goog.dom");
goog.require("goog.ui.Component");
goog.require("goog.events");
goog.require("goog.style");
goog.require("goog.dom");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.module.ModuleManager");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.managers.WaitingAnimation");
chatango.group.GroupConnectionUI = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.waitId_ = "group_connecting";
  this.wasConnected_ = false;
  this.numConnectAttempts_ = 0;
  this.displayState_ = null;
  this.active_ = true;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
};
goog.inherits(chatango.group.GroupConnectionUI, goog.ui.Component);
chatango.group.GroupConnectionUI.prototype.connection_ = null;
chatango.group.GroupConnectionUI.state = {connect:"CONNECT", reconnect:"RECONNECT", unable:"UNABLE"};
chatango.group.GroupConnectionUI.prototype.logger = goog.debug.Logger.getLogger("chatango.group.GroupConnectionUI");
chatango.group.GroupConnectionUI.prototype.createDom = function(opt_domHelper) {
  this.element_ = goog.dom.createDom("div", {"id":"CUI"});
  this.coverEl_ = goog.dom.createDom("div", {"id":"CUI_cover", "style":"display:none"});
  goog.dom.appendChild(this.element_, this.coverEl_);
  this.connectUIWrapperEl_ = goog.dom.createDom("div", {"id":"CUI_wrapper"});
  goog.dom.appendChild(this.element_, this.connectUIWrapperEl_);
  this.connectUIEl_ = goog.dom.createDom("div", {"id":"CUI_content"});
  goog.dom.appendChild(this.connectUIWrapperEl_, this.connectUIEl_);
  this.reconnectCopyEl_ = goog.dom.createDom("span", {"id":"CUI_copy"});
  goog.dom.appendChild(this.connectUIEl_, this.reconnectCopyEl_);
  this.reconnectBtnWrapperEl_ = goog.dom.createDom("div", {"id":"CUI_btn_wrapper"});
  goog.dom.appendChild(this.connectUIEl_, this.reconnectBtnWrapperEl_);
  this.connectBtn_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("basic_group", "reconnect"));
  this.connectBtn_.render(this.reconnectBtnWrapperEl_);
  goog.style.setStyle(this.connectBtn_.getElement(), "margin-top", "1em");
  goog.style.setStyle(this.connectBtn_.getElement(), "display", "inline-block");
  goog.events.listen(this.connectBtn_, goog.ui.Component.EventType.ACTION, this.connect, false, this);
  this.domCreated_ = true;
  this.draw_();
};
chatango.group.GroupConnectionUI.prototype.startWaitingAnimation_ = function() {
  if (!this.alreadyWaited_) {
    chatango.managers.WaitingAnimation.getInstance().startWaiting(this.waitId_);
    this.alreadyWaited_ = true;
  } else {
    chatango.managers.WaitingAnimation.getInstance().startWaiting(this.waitId_, null, null, null, null, this.lm_.getString("basic_group", "connecting"));
  }
};
chatango.group.GroupConnectionUI.prototype.setActive = function(bool) {
  this.active_ = bool;
};
chatango.group.GroupConnectionUI.prototype.stopWaitingAnimation_ = function() {
  chatango.managers.WaitingAnimation.getInstance().stopWaiting(this.waitId_);
};
chatango.group.GroupConnectionUI.prototype.connectionFail = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("connectionFail with event: " + (e ? e.type : "undefined"));
    this.logger.info("this.connection_.getStatus(): " + this.connection_.getStatus());
  }
  if (this.active_) {
    this.stopWaitingAnimation_();
    this.displayState_ = null;
    switch(this.numConnectAttempts_) {
      case 0:
        if (!this.wasConnected_) {
          this.displayState_ = chatango.group.GroupConnectionUI.state.connect;
          break;
        }
      ;
      case 1:
      ;
      case 2:
        this.displayState_ = chatango.group.GroupConnectionUI.state.reconnect;
        break;
      case 3:
        this.displayState_ = chatango.group.GroupConnectionUI.state.unable;
        break;
    }
    this.draw_();
  }
};
chatango.group.GroupConnectionUI.prototype.connecting = function(opt_e) {
  if (this.active_) {
    this.startWaitingAnimation_();
    if (this.displayState_ != null) {
      this.displayState_ = null;
      this.draw_();
    }
  }
};
chatango.group.GroupConnectionUI.prototype.announcePortFallBack_ = function(e) {
  if (this.active_) {
    chatango.managers.WaitingAnimation.getInstance().startWaiting(this.waitId_, null, null, null, null, this.lm_.getString("basic_group", "new_port"));
  }
};
chatango.group.GroupConnectionUI.prototype.draw_ = function() {
  if (!this.domCreated_ == true) {
    return;
  }
  switch(this.displayState_) {
    case chatango.group.GroupConnectionUI.state.connect:
      goog.style.setStyle(this.element_, "display", "block");
      goog.style.setStyle(this.coverEl_, "display", "none");
      this.setButtonCopy_(this.lm_.getString("basic_group", "click_to_connect"));
      this.setMessageCopy_("");
      goog.style.setStyle(this.connectBtn_.getElement(), "float", "none");
      break;
    case chatango.group.GroupConnectionUI.state.reconnect:
      goog.style.setStyle(this.element_, "display", "block");
      goog.style.setStyle(this.coverEl_, "display", "block");
      goog.style.setStyle(this.connectBtn_.getElement(), "float", "right");
      this.setButtonCopy_(this.lm_.getString("basic_group", "reconnect"));
      if (this.connection_.getAnonTimedOut()) {
        this.setMessageCopy_(this.lm_.getString("basic_group", "anon_timeout").split("*mins*").join(Math.round(this.connection_.getAnonTimeOutInterval() / 6E4)));
      } else {
        this.setMessageCopy_(this.lm_.getString("basic_group", "cant_connect"));
      }
      break;
    case chatango.group.GroupConnectionUI.state.unable:
      goog.style.setStyle(this.element_, "display", "block");
      goog.style.setStyle(this.coverEl_, "display", "block");
      this.setButtonCopy_("");
      this.setMessageCopy_(this.lm_.getString("basic_group", "cant_connect2"));
      break;
    default:
      goog.style.setStyle(this.element_, "display", "none");
      goog.style.setStyle(this.coverEl_, "display", "none");
  }
};
chatango.group.GroupConnectionUI.prototype.setMessageCopy_ = function(copy) {
  goog.dom.setTextContent(this.reconnectCopyEl_, copy);
  goog.style.setStyle(this.reconnectCopyEl_, "white-space", "nowrap");
  this.width = this.reconnectCopyEl_.offsetWidth;
  goog.style.setStyle(this.reconnectCopyEl_, "white-space", "normal");
};
chatango.group.GroupConnectionUI.prototype.setButtonCopy_ = function(copy) {
  if (copy != "") {
    goog.style.setStyle(this.connectBtn_.getElement(), "display", "inline-block");
    this.connectBtn_.setContent(copy);
  } else {
    goog.style.setStyle(this.connectBtn_.getElement(), "display", "none");
  }
};
chatango.group.GroupConnectionUI.prototype.setConnectionListener = function(con) {
  this.connection_ = con;
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.connectionFail, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.CMD_NOT_SENT, this.connectionFail, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT, this.connectionFail, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.CONNECTED, this.connected, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING, this.connecting, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.CONNECTING, this.connecting, false, this);
  goog.events.listen(this.connection_, chatango.events.EventType.PORT_FALLBACK, this.announcePortFallBack_, false, this);
  var status = this.connection_.getStatus();
  if (chatango.DEBUG) {
    this.logger.info("status: " + status);
  }
  switch(status) {
    case chatango.networking.ConnectionStatusEvent.EventType.CONNECTING:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING:
      this.connecting();
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.CMD_NOT_SENT:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT:
      this.connectionFail();
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.CONNECTED:
      this.connected();
      break;
    default:
      break;
  }
};
chatango.group.GroupConnectionUI.prototype.connected = function(e) {
  this.wasConnected_ = true;
  this.stopWaitingAnimation_();
  if (this.active_) {
    if (this.displayState_ != null) {
      this.displayState_ = null;
      this.draw_();
    }
  }
};
chatango.group.GroupConnectionUI.prototype.connect = function(opt_event) {
  var wasAnonTimedOut = this.connection_.getAnonTimedOut();
  if (wasAnonTimedOut) {
    this.connection_.setSelfKickedOff(false);
  }
  if (chatango.DEBUG) {
    console.log("GroupConnectionUI connect : this.connection_.connect()");
  }
  this.connection_.connect();
  if (!wasAnonTimedOut) {
    this.numConnectAttempts_++;
  }
  this.displayState_ = null;
  this.draw_();
};
chatango.group.GroupConnectionUI.prototype.initCopy = function() {
  this.draw_();
};
chatango.group.GroupConnectionUI.prototype.showInvalidVersionPU = function() {
  if (!this.invalidPU_) {
    if (!goog.module.ModuleManager.getInstance().getModuleInfo("CommonUIModule").isLoaded()) {
      goog.module.ModuleManager.getInstance().execOnLoad("CommonUIModule", this.showInvalidVersionPU, this);
      return;
    }
    this.invalidPU_ = new chatango.ui.ScrollableTextDialog(this.lm_.getString("basic_group", "low_version_msg"), 100);
    this.invalidPU_.setTitle(this.lm_.getString("basic_group", "system_msg"));
    this.invalidPU_.setHasTitleCloseButton(true);
    this.invalidPU_.setResizable(false);
    this.invalidPU_.setVisible(true);
    goog.events.listen(this.invalidPU_, goog.ui.Dialog.EventType.AFTER_HIDE, this.closeVersionPU, false, this);
  }
};
chatango.group.GroupConnectionUI.prototype.closeVersionPU = function() {
  if (this.invalidPU_) {
    goog.events.removeAll(this.invalidPU_);
    this.invalidPU_.dispose();
    this.invalidPU_ = null;
  }
};
goog.provide("chatango.messagedata.GroupMessageData");
goog.require("chatango.group.channels.ChannelController");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.messagedata.GroupMsgFormatter");
goog.require("chatango.messagedata.MessageData");
goog.require("chatango.users.User");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.dom.classes");
chatango.messagedata.GroupMessageData = function(msgString) {
  chatango.messagedata.MessageData.call(this);
  msgString = msgString.split(/\r\n/, 1).toString();
  var arr = msgString.split(":", chatango.messagedata.GroupMessageData.MAX_FIELDS);
  var arr2 = msgString.split(":");
  for (var i = chatango.messagedata.GroupMessageData.TXT_FIELD + 1;i < arr2.length;++i) {
    arr[chatango.messagedata.GroupMessageData.TXT_FIELD] += ":" + arr2[i];
  }
  if (chatango.DEBUG) {
    this.logger.info("Message: " + arr[chatango.messagedata.GroupMessageData.TXT_FIELD]);
  }
  this.messageArray_ = arr;
  this.type_ = chatango.messagedata.MessageData.MessageType.GROUP;
  if (this.getSid() !== "") {
    this.name_ = this.getSid();
    this.userType_ = chatango.users.User.UserType.SELLER;
  } else {
    if (this.getTempName() !== "") {
      this.name_ = this.getTempName().toLowerCase();
      this.userType_ = chatango.users.User.UserType.TEMP;
    } else {
      this.name_ = "anon" + this.getAnonNumber_();
      this.userType_ = chatango.users.User.UserType.ANON;
    }
  }
  this.isInitial_ = this.messageArray_[0] == "i";
  this.TSString_ = this.messageArray_[1];
  this.id_ = this.messageArray_[6];
  this.ip_ = this.messageArray_[7];
  this.flags_ = this.messageArray_[8];
  this.messageHtml_ = this.messageArray_[chatango.messagedata.GroupMessageData.TXT_FIELD];
  var user = chatango.users.UserManager.getInstance().addUser("gmd", this.name_, this.userType_);
  var content = goog.dom.createDom("div");
  var formatter = new chatango.messagedata.GroupMsgFormatter(this, user.isOwner(), content, null, chatango.managers.ManagerManager.getInstance());
  this.isValid_ = formatter.isValidMessage();
  formatter.dispose();
  formatter = null;
  content = null;
  content = goog.dom.createDom("div");
  if (this.isValid_) {
    var noThumbs = true;
    formatter = new chatango.messagedata.GroupMsgFormatter(this, user.isOwner(), content, null, chatango.managers.ManagerManager.getInstance(), noThumbs);
    formatter.processMessage();
    formatter.dispose();
    formatter = null;
  }
  this.messageText_ = goog.dom.getTextContent(content);
};
goog.inherits(chatango.messagedata.GroupMessageData, chatango.messagedata.MessageData);
chatango.messagedata.GroupMessageData.DEFAULT_TSID = "3452";
chatango.messagedata.GroupMessageData.MAX_FIELDS = 11;
chatango.messagedata.GroupMessageData.TXT_FIELD = 10;
chatango.messagedata.GroupMessageData.prototype.logger = goog.debug.Logger.getLogger("chatango.messagedata.GroupMessageData");
chatango.messagedata.GroupMessageData.prototype.getSid = function() {
  return this.messageArray_[2];
};
chatango.messagedata.GroupMessageData.prototype.getTempName = function() {
  return this.messageArray_[3];
};
chatango.messagedata.GroupMessageData.prototype.getName = function() {
  return this.name_;
};
chatango.messagedata.GroupMessageData.prototype.getShortenedCookie_ = function() {
  return this.messageArray_[4];
};
chatango.messagedata.GroupMessageData.prototype.getEncodedCookie = function() {
  return this.messageArray_[5];
};
chatango.messagedata.GroupMessageData.prototype.aid_ = "";
chatango.messagedata.GroupMessageData.prototype.getTsid = function() {
  var matches = this.messageArray_[chatango.messagedata.GroupMessageData.TXT_FIELD].match(/<n\d\d\d\d\/>/);
  if (matches) {
    return matches[0].substring(2, 6);
  }
  return chatango.messagedata.GroupMessageData.DEFAULT_TSID;
};
chatango.messagedata.GroupMessageData.prototype.getAnonNumber_ = function() {
  var ts = this.getTsid();
  var aid = this.getShortenedCookie_();
  if (!aid) {
    return "";
  }
  return chatango.users.User.getAnonNumber(ts, aid);
};
chatango.messagedata.GroupMessageData.prototype.ip_ = "";
chatango.messagedata.GroupMessageData.prototype.getIP = function() {
  return this.ip_;
};
chatango.messagedata.GroupMessageData.prototype.isInitial = function() {
  return this.isInitial_;
};
chatango.messagedata.GroupMessageData.prototype.getMessageHtml = function() {
  return this.messageHtml_;
};
chatango.messagedata.GroupMessageData.prototype.getMessageText = function() {
  return this.messageText_;
};
chatango.messagedata.GroupMessageData.prototype.getTimeStamp = function() {
  return this.TSString_;
};
chatango.messagedata.GroupMessageData.prototype.getChannels = function() {
  return chatango.group.channels.ChannelController.getChannelIds(this.flags_);
};
chatango.messagedata.GroupMessageData.prototype.isValidMessage = function() {
  return this.isValid_;
};
goog.provide("chatango.networking.GroupConnectionEvent");
goog.require("chatango.messagedata.GroupMessageData");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
chatango.networking.GroupConnectionEvent = function(type, data) {
  goog.base(this, type);
  this.type = type;
  this.data = data;
};
goog.inherits(chatango.networking.GroupConnectionEvent, goog.events.Event);
chatango.networking.GroupConnectionEvent.EventType = {};
chatango.networking.GroupConnectionEvent.EventLookup = {};
chatango.networking.GroupConnectionEvent.EventLookup["badbansearchstring"] = chatango.networking.GroupConnectionEvent.EventType.badbansearchstring = goog.events.getUniqueId("badbansearchstring");
chatango.networking.GroupConnectionEvent.EventLookup["bansearchresult"] = chatango.networking.GroupConnectionEvent.EventType.bansearchresult = goog.events.getUniqueId("bansearchresult");
chatango.networking.GroupConnectionEvent.EventLookup["mustlogin"] = chatango.networking.GroupConnectionEvent.EventType.mustlogin = goog.events.getUniqueId("mustlogin");
chatango.networking.GroupConnectionEvent.EventLookup["groupflagsupdate"] = chatango.networking.GroupConnectionEvent.EventType.groupflagsupdate = goog.events.getUniqueId("ge_groupflagsupdate");
chatango.networking.GroupConnectionEvent.EventLookup["groupflagstoggled"] = chatango.networking.GroupConnectionEvent.EventType.groupflagstoggled = goog.events.getUniqueId("ge_groupflagstoggled");
chatango.networking.GroupConnectionEvent.EventLookup["g_participants"] = chatango.networking.GroupConnectionEvent.EventType.g_participants = goog.events.getUniqueId("ge_g_participants");
chatango.networking.GroupConnectionEvent.EventLookup["gparticipants"] = chatango.networking.GroupConnectionEvent.EventType.gparticipants = goog.events.getUniqueId("ge_gparticipants");
chatango.networking.GroupConnectionEvent.EventLookup["blocklist"] = chatango.networking.GroupConnectionEvent.EventType.blocklist = goog.events.getUniqueId("ge_blocklist");
chatango.networking.GroupConnectionEvent.EventLookup["unblocklist"] = chatango.networking.GroupConnectionEvent.EventType.unblocklist = goog.events.getUniqueId("ge_unblocklist");
chatango.networking.GroupConnectionEvent.EventLookup["n"] = chatango.networking.GroupConnectionEvent.EventType.n = goog.events.getUniqueId("ge_n");
chatango.networking.GroupConnectionEvent.EventLookup["inited"] = chatango.networking.GroupConnectionEvent.EventType.inited = goog.events.getUniqueId("ge_inited");
chatango.networking.GroupConnectionEvent.EventLookup["nomore"] = chatango.networking.GroupConnectionEvent.EventType.nomore = goog.events.getUniqueId("ge_nomore");
chatango.networking.GroupConnectionEvent.EventLookup["gotmore"] = chatango.networking.GroupConnectionEvent.EventType.gotmore = goog.events.getUniqueId("ge_gotmore");
chatango.networking.GroupConnectionEvent.EventLookup["aliasok"] = chatango.networking.GroupConnectionEvent.EventType.aliasok = goog.events.getUniqueId("ge_aliasok");
chatango.networking.GroupConnectionEvent.EventLookup["v"] = chatango.networking.GroupConnectionEvent.EventType.v = goog.events.getUniqueId("ge_v");
chatango.networking.GroupConnectionEvent.EventLookup["pwdok"] = chatango.networking.GroupConnectionEvent.EventType.pwdok = goog.events.getUniqueId("ge_pwdok");
chatango.networking.GroupConnectionEvent.EventLookup["badlogin"] = chatango.networking.GroupConnectionEvent.EventType.badlogin = goog.events.getUniqueId("ge_badlogin");
chatango.networking.GroupConnectionEvent.EventLookup["badalias"] = chatango.networking.GroupConnectionEvent.EventType.badalias = goog.events.getUniqueId("ge_badalias");
chatango.networking.GroupConnectionEvent.EventLookup["chatango"] = chatango.networking.GroupConnectionEvent.EventType.chatango = goog.events.getUniqueId("ge_chatango");
chatango.networking.GroupConnectionEvent.EventLookup["u"] = chatango.networking.GroupConnectionEvent.EventType.u = goog.events.getUniqueId("ge_u");
chatango.networking.GroupConnectionEvent.EventLookup["p"] = chatango.networking.GroupConnectionEvent.EventType.p = goog.events.getUniqueId("ge_p");
chatango.networking.GroupConnectionEvent.EventLookup["logoutok"] = chatango.networking.GroupConnectionEvent.EventType.logoutok = goog.events.getUniqueId("ge_logoutok");
chatango.networking.GroupConnectionEvent.EventLookup["bw"] = chatango.networking.GroupConnectionEvent.EventType.bw = goog.events.getUniqueId("ge_bw");
chatango.networking.GroupConnectionEvent.EventLookup["ubw"] = chatango.networking.GroupConnectionEvent.EventType.ubw = goog.events.getUniqueId("ge_ubw");
chatango.networking.GroupConnectionEvent.EventLookup["cbw"] = chatango.networking.GroupConnectionEvent.EventType.cbw = goog.events.getUniqueId("ge_cbw");
chatango.networking.GroupConnectionEvent.EventLookup["deleteall"] = chatango.networking.GroupConnectionEvent.EventType.deleteall = goog.events.getUniqueId("ge_deleteall");
chatango.networking.GroupConnectionEvent.EventLookup["delete"] = chatango.networking.GroupConnectionEvent.EventType.deletemsg = goog.events.getUniqueId("ge_deletemsg");
chatango.networking.GroupConnectionEvent.EventLookup["show_fw"] = chatango.networking.GroupConnectionEvent.EventType.show_fw = goog.events.getUniqueId("ge_show_fw");
chatango.networking.GroupConnectionEvent.EventLookup["show_tb"] = chatango.networking.GroupConnectionEvent.EventType.show_tb = goog.events.getUniqueId("ge_show_tb");
chatango.networking.GroupConnectionEvent.EventLookup["tb"] = chatango.networking.GroupConnectionEvent.EventType.tb = goog.events.getUniqueId("ge_tb");
chatango.networking.GroupConnectionEvent.EventLookup["end_fw"] = chatango.networking.GroupConnectionEvent.EventType.end_fw = goog.events.getUniqueId("ge_end_fw");
chatango.networking.GroupConnectionEvent.EventLookup["show_nlp"] = chatango.networking.GroupConnectionEvent.EventType.show_nlp = goog.events.getUniqueId("ge_show_nlp");
chatango.networking.GroupConnectionEvent.EventLookup["show_nlp_tb"] = chatango.networking.GroupConnectionEvent.EventType.show_nlp_tb = goog.events.getUniqueId("ge_show_nlp_tb");
chatango.networking.GroupConnectionEvent.EventLookup["nlptb"] = chatango.networking.GroupConnectionEvent.EventType.nlptb = goog.events.getUniqueId("ge_nlptb");
chatango.networking.GroupConnectionEvent.EventLookup["end_nlp"] = chatango.networking.GroupConnectionEvent.EventType.end_nlp = goog.events.getUniqueId("ge_end_nlp");
chatango.networking.GroupConnectionEvent.EventLookup["mods"] = chatango.networking.GroupConnectionEvent.EventType.mods = goog.events.getUniqueId("ge_mods");
chatango.networking.GroupConnectionEvent.EventLookup["addmoderr"] = chatango.networking.GroupConnectionEvent.EventType.addmoderr = goog.events.getUniqueId("ge_addmoderr");
chatango.networking.GroupConnectionEvent.EventLookup["removemoderr"] = chatango.networking.GroupConnectionEvent.EventType.removemoderr = goog.events.getUniqueId("ge_removemoderr");
chatango.networking.GroupConnectionEvent.EventLookup["updatemoderr"] = chatango.networking.GroupConnectionEvent.EventType.updatemoderr = goog.events.getUniqueId("ge_updatemoderr");
chatango.networking.GroupConnectionEvent.EventLookup["notifysettings"] = chatango.networking.GroupConnectionEvent.EventType.notifysettings = goog.events.getUniqueId("ge_notifysettings");
chatango.networking.GroupConnectionEvent.EventLookup["setnotifysettings"] = chatango.networking.GroupConnectionEvent.EventType.setnotifysettings = goog.events.getUniqueId("ge_setnotifysettings");
chatango.networking.GroupConnectionEvent.EventLookup["checkemail_notify"] = chatango.networking.GroupConnectionEvent.EventType.checkemail_notify = goog.events.getUniqueId("ge_checkemail_notify");
chatango.networking.GroupConnectionEvent.EventLookup["clearall"] = chatango.networking.GroupConnectionEvent.EventType.clearall = goog.events.getUniqueId("ge_clearall");
chatango.networking.GroupConnectionEvent.EventLookup["i"] = chatango.networking.GroupConnectionEvent.EventType.i = goog.events.getUniqueId("ge_i");
chatango.networking.GroupConnectionEvent.EventLookup["b"] = chatango.networking.GroupConnectionEvent.EventType.b = goog.events.getUniqueId("ge_b");
chatango.networking.GroupConnectionEvent.EventLookup["participant"] = chatango.networking.GroupConnectionEvent.EventType.participant = goog.events.getUniqueId("ge_participant");
chatango.networking.GroupConnectionEvent.EventLookup["blocked"] = chatango.networking.GroupConnectionEvent.EventType.blocked = goog.events.getUniqueId("ge_blocked");
chatango.networking.GroupConnectionEvent.EventLookup["unblocked"] = chatango.networking.GroupConnectionEvent.EventType.unblocked = goog.events.getUniqueId("ge_unblocked");
chatango.networking.GroupConnectionEvent.EventLookup["versioningPU"] = chatango.networking.GroupConnectionEvent.EventType.versioningPU = goog.events.getUniqueId("ge_versioning_pu");
chatango.networking.GroupConnectionEvent.EventLookup["updgroupinfo"] = chatango.networking.GroupConnectionEvent.EventType.updgroupinfo = goog.events.getUniqueId("ge_updgroupinfo");
chatango.networking.GroupConnectionEvent.EventLookup["ratelimitset"] = chatango.networking.GroupConnectionEvent.EventType.ratelimitset = goog.events.getUniqueId("ge_ratelimitset");
chatango.networking.GroupConnectionEvent.EventLookup["getratelimit"] = chatango.networking.GroupConnectionEvent.EventType.getratelimit = goog.events.getUniqueId("ge_getratelimit");
chatango.networking.GroupConnectionEvent.EventLookup["ratelimited"] = chatango.networking.GroupConnectionEvent.EventType.ratelimited = goog.events.getUniqueId("ge_ratelimited");
chatango.networking.GroupConnectionEvent.EventLookup["annc"] = chatango.networking.GroupConnectionEvent.EventType.annc = goog.events.getUniqueId("ge_annc");
chatango.networking.GroupConnectionEvent.EventLookup["getannc"] = chatango.networking.GroupConnectionEvent.EventType.getannc = goog.events.getUniqueId("ge_getannc");
chatango.networking.GroupConnectionEvent.EventLookup["getpremium"] = chatango.networking.GroupConnectionEvent.EventType.getpremium = goog.events.getUniqueId("ge_getpremium");
chatango.networking.GroupConnectionEvent.EventLookup["premium"] = chatango.networking.GroupConnectionEvent.EventType.premium = goog.events.getUniqueId("ge_premium");
chatango.networking.GroupConnectionEvent.EventLookup["modactions"] = chatango.networking.GroupConnectionEvent.EventType.modactions = goog.events.getUniqueId("ge_modactions");
chatango.networking.GroupConnectionEvent.EventLookup["msglexceeded"] = chatango.networking.GroupConnectionEvent.EventType.msglexceeded = goog.events.getUniqueId("ge_msglexceeded");
chatango.networking.GroupConnectionEvent.EventLookup["limitexceeded"] = chatango.networking.GroupConnectionEvent.EventType.limitexceeded = goog.events.getUniqueId("ge_limitexceeded");
chatango.networking.GroupConnectionEvent.EventLookup["climited"] = chatango.networking.GroupConnectionEvent.EventType.commandlimited = goog.events.getUniqueId("ge_climited");
chatango.networking.GroupConnectionEvent.EventLookup["proxybanned"] = chatango.networking.GroupConnectionEvent.EventType.proxybanned = goog.events.getUniqueId("ge_proxybanned");
chatango.networking.GroupConnectionEvent.EventLookup["verificationrequired"] = chatango.networking.GroupConnectionEvent.EventType.emailverificationrequired = goog.events.getUniqueId("ge_verifreqd");
chatango.networking.GroupConnectionEvent.EventLookup["verificationchanged"] = chatango.networking.GroupConnectionEvent.EventType.verificationchanged = goog.events.getUniqueId("ge_verificationchanged");
goog.provide("goog.crypt.Md5");
goog.require("goog.crypt.Hash");
goog.crypt.Md5 = function() {
  goog.crypt.Md5.base(this, "constructor");
  this.blockSize = 512 / 8;
  this.chain_ = new Array(4);
  this.block_ = new Array(this.blockSize);
  this.blockLength_ = 0;
  this.totalLength_ = 0;
  this.reset();
};
goog.inherits(goog.crypt.Md5, goog.crypt.Hash);
goog.crypt.Md5.prototype.reset = function() {
  this.chain_[0] = 1732584193;
  this.chain_[1] = 4023233417;
  this.chain_[2] = 2562383102;
  this.chain_[3] = 271733878;
  this.blockLength_ = 0;
  this.totalLength_ = 0;
};
goog.crypt.Md5.prototype.compress_ = function(buf, opt_offset) {
  if (!opt_offset) {
    opt_offset = 0;
  }
  var X = new Array(16);
  if (goog.isString(buf)) {
    for (var i = 0;i < 16;++i) {
      X[i] = buf.charCodeAt(opt_offset++) | buf.charCodeAt(opt_offset++) << 8 | buf.charCodeAt(opt_offset++) << 16 | buf.charCodeAt(opt_offset++) << 24;
    }
  } else {
    for (var i = 0;i < 16;++i) {
      X[i] = buf[opt_offset++] | buf[opt_offset++] << 8 | buf[opt_offset++] << 16 | buf[opt_offset++] << 24;
    }
  }
  var A = this.chain_[0];
  var B = this.chain_[1];
  var C = this.chain_[2];
  var D = this.chain_[3];
  var sum = 0;
  sum = A + (D ^ B & (C ^ D)) + X[0] + 3614090360 & 4294967295;
  A = B + (sum << 7 & 4294967295 | sum >>> 25);
  sum = D + (C ^ A & (B ^ C)) + X[1] + 3905402710 & 4294967295;
  D = A + (sum << 12 & 4294967295 | sum >>> 20);
  sum = C + (B ^ D & (A ^ B)) + X[2] + 606105819 & 4294967295;
  C = D + (sum << 17 & 4294967295 | sum >>> 15);
  sum = B + (A ^ C & (D ^ A)) + X[3] + 3250441966 & 4294967295;
  B = C + (sum << 22 & 4294967295 | sum >>> 10);
  sum = A + (D ^ B & (C ^ D)) + X[4] + 4118548399 & 4294967295;
  A = B + (sum << 7 & 4294967295 | sum >>> 25);
  sum = D + (C ^ A & (B ^ C)) + X[5] + 1200080426 & 4294967295;
  D = A + (sum << 12 & 4294967295 | sum >>> 20);
  sum = C + (B ^ D & (A ^ B)) + X[6] + 2821735955 & 4294967295;
  C = D + (sum << 17 & 4294967295 | sum >>> 15);
  sum = B + (A ^ C & (D ^ A)) + X[7] + 4249261313 & 4294967295;
  B = C + (sum << 22 & 4294967295 | sum >>> 10);
  sum = A + (D ^ B & (C ^ D)) + X[8] + 1770035416 & 4294967295;
  A = B + (sum << 7 & 4294967295 | sum >>> 25);
  sum = D + (C ^ A & (B ^ C)) + X[9] + 2336552879 & 4294967295;
  D = A + (sum << 12 & 4294967295 | sum >>> 20);
  sum = C + (B ^ D & (A ^ B)) + X[10] + 4294925233 & 4294967295;
  C = D + (sum << 17 & 4294967295 | sum >>> 15);
  sum = B + (A ^ C & (D ^ A)) + X[11] + 2304563134 & 4294967295;
  B = C + (sum << 22 & 4294967295 | sum >>> 10);
  sum = A + (D ^ B & (C ^ D)) + X[12] + 1804603682 & 4294967295;
  A = B + (sum << 7 & 4294967295 | sum >>> 25);
  sum = D + (C ^ A & (B ^ C)) + X[13] + 4254626195 & 4294967295;
  D = A + (sum << 12 & 4294967295 | sum >>> 20);
  sum = C + (B ^ D & (A ^ B)) + X[14] + 2792965006 & 4294967295;
  C = D + (sum << 17 & 4294967295 | sum >>> 15);
  sum = B + (A ^ C & (D ^ A)) + X[15] + 1236535329 & 4294967295;
  B = C + (sum << 22 & 4294967295 | sum >>> 10);
  sum = A + (C ^ D & (B ^ C)) + X[1] + 4129170786 & 4294967295;
  A = B + (sum << 5 & 4294967295 | sum >>> 27);
  sum = D + (B ^ C & (A ^ B)) + X[6] + 3225465664 & 4294967295;
  D = A + (sum << 9 & 4294967295 | sum >>> 23);
  sum = C + (A ^ B & (D ^ A)) + X[11] + 643717713 & 4294967295;
  C = D + (sum << 14 & 4294967295 | sum >>> 18);
  sum = B + (D ^ A & (C ^ D)) + X[0] + 3921069994 & 4294967295;
  B = C + (sum << 20 & 4294967295 | sum >>> 12);
  sum = A + (C ^ D & (B ^ C)) + X[5] + 3593408605 & 4294967295;
  A = B + (sum << 5 & 4294967295 | sum >>> 27);
  sum = D + (B ^ C & (A ^ B)) + X[10] + 38016083 & 4294967295;
  D = A + (sum << 9 & 4294967295 | sum >>> 23);
  sum = C + (A ^ B & (D ^ A)) + X[15] + 3634488961 & 4294967295;
  C = D + (sum << 14 & 4294967295 | sum >>> 18);
  sum = B + (D ^ A & (C ^ D)) + X[4] + 3889429448 & 4294967295;
  B = C + (sum << 20 & 4294967295 | sum >>> 12);
  sum = A + (C ^ D & (B ^ C)) + X[9] + 568446438 & 4294967295;
  A = B + (sum << 5 & 4294967295 | sum >>> 27);
  sum = D + (B ^ C & (A ^ B)) + X[14] + 3275163606 & 4294967295;
  D = A + (sum << 9 & 4294967295 | sum >>> 23);
  sum = C + (A ^ B & (D ^ A)) + X[3] + 4107603335 & 4294967295;
  C = D + (sum << 14 & 4294967295 | sum >>> 18);
  sum = B + (D ^ A & (C ^ D)) + X[8] + 1163531501 & 4294967295;
  B = C + (sum << 20 & 4294967295 | sum >>> 12);
  sum = A + (C ^ D & (B ^ C)) + X[13] + 2850285829 & 4294967295;
  A = B + (sum << 5 & 4294967295 | sum >>> 27);
  sum = D + (B ^ C & (A ^ B)) + X[2] + 4243563512 & 4294967295;
  D = A + (sum << 9 & 4294967295 | sum >>> 23);
  sum = C + (A ^ B & (D ^ A)) + X[7] + 1735328473 & 4294967295;
  C = D + (sum << 14 & 4294967295 | sum >>> 18);
  sum = B + (D ^ A & (C ^ D)) + X[12] + 2368359562 & 4294967295;
  B = C + (sum << 20 & 4294967295 | sum >>> 12);
  sum = A + (B ^ C ^ D) + X[5] + 4294588738 & 4294967295;
  A = B + (sum << 4 & 4294967295 | sum >>> 28);
  sum = D + (A ^ B ^ C) + X[8] + 2272392833 & 4294967295;
  D = A + (sum << 11 & 4294967295 | sum >>> 21);
  sum = C + (D ^ A ^ B) + X[11] + 1839030562 & 4294967295;
  C = D + (sum << 16 & 4294967295 | sum >>> 16);
  sum = B + (C ^ D ^ A) + X[14] + 4259657740 & 4294967295;
  B = C + (sum << 23 & 4294967295 | sum >>> 9);
  sum = A + (B ^ C ^ D) + X[1] + 2763975236 & 4294967295;
  A = B + (sum << 4 & 4294967295 | sum >>> 28);
  sum = D + (A ^ B ^ C) + X[4] + 1272893353 & 4294967295;
  D = A + (sum << 11 & 4294967295 | sum >>> 21);
  sum = C + (D ^ A ^ B) + X[7] + 4139469664 & 4294967295;
  C = D + (sum << 16 & 4294967295 | sum >>> 16);
  sum = B + (C ^ D ^ A) + X[10] + 3200236656 & 4294967295;
  B = C + (sum << 23 & 4294967295 | sum >>> 9);
  sum = A + (B ^ C ^ D) + X[13] + 681279174 & 4294967295;
  A = B + (sum << 4 & 4294967295 | sum >>> 28);
  sum = D + (A ^ B ^ C) + X[0] + 3936430074 & 4294967295;
  D = A + (sum << 11 & 4294967295 | sum >>> 21);
  sum = C + (D ^ A ^ B) + X[3] + 3572445317 & 4294967295;
  C = D + (sum << 16 & 4294967295 | sum >>> 16);
  sum = B + (C ^ D ^ A) + X[6] + 76029189 & 4294967295;
  B = C + (sum << 23 & 4294967295 | sum >>> 9);
  sum = A + (B ^ C ^ D) + X[9] + 3654602809 & 4294967295;
  A = B + (sum << 4 & 4294967295 | sum >>> 28);
  sum = D + (A ^ B ^ C) + X[12] + 3873151461 & 4294967295;
  D = A + (sum << 11 & 4294967295 | sum >>> 21);
  sum = C + (D ^ A ^ B) + X[15] + 530742520 & 4294967295;
  C = D + (sum << 16 & 4294967295 | sum >>> 16);
  sum = B + (C ^ D ^ A) + X[2] + 3299628645 & 4294967295;
  B = C + (sum << 23 & 4294967295 | sum >>> 9);
  sum = A + (C ^ (B | ~D)) + X[0] + 4096336452 & 4294967295;
  A = B + (sum << 6 & 4294967295 | sum >>> 26);
  sum = D + (B ^ (A | ~C)) + X[7] + 1126891415 & 4294967295;
  D = A + (sum << 10 & 4294967295 | sum >>> 22);
  sum = C + (A ^ (D | ~B)) + X[14] + 2878612391 & 4294967295;
  C = D + (sum << 15 & 4294967295 | sum >>> 17);
  sum = B + (D ^ (C | ~A)) + X[5] + 4237533241 & 4294967295;
  B = C + (sum << 21 & 4294967295 | sum >>> 11);
  sum = A + (C ^ (B | ~D)) + X[12] + 1700485571 & 4294967295;
  A = B + (sum << 6 & 4294967295 | sum >>> 26);
  sum = D + (B ^ (A | ~C)) + X[3] + 2399980690 & 4294967295;
  D = A + (sum << 10 & 4294967295 | sum >>> 22);
  sum = C + (A ^ (D | ~B)) + X[10] + 4293915773 & 4294967295;
  C = D + (sum << 15 & 4294967295 | sum >>> 17);
  sum = B + (D ^ (C | ~A)) + X[1] + 2240044497 & 4294967295;
  B = C + (sum << 21 & 4294967295 | sum >>> 11);
  sum = A + (C ^ (B | ~D)) + X[8] + 1873313359 & 4294967295;
  A = B + (sum << 6 & 4294967295 | sum >>> 26);
  sum = D + (B ^ (A | ~C)) + X[15] + 4264355552 & 4294967295;
  D = A + (sum << 10 & 4294967295 | sum >>> 22);
  sum = C + (A ^ (D | ~B)) + X[6] + 2734768916 & 4294967295;
  C = D + (sum << 15 & 4294967295 | sum >>> 17);
  sum = B + (D ^ (C | ~A)) + X[13] + 1309151649 & 4294967295;
  B = C + (sum << 21 & 4294967295 | sum >>> 11);
  sum = A + (C ^ (B | ~D)) + X[4] + 4149444226 & 4294967295;
  A = B + (sum << 6 & 4294967295 | sum >>> 26);
  sum = D + (B ^ (A | ~C)) + X[11] + 3174756917 & 4294967295;
  D = A + (sum << 10 & 4294967295 | sum >>> 22);
  sum = C + (A ^ (D | ~B)) + X[2] + 718787259 & 4294967295;
  C = D + (sum << 15 & 4294967295 | sum >>> 17);
  sum = B + (D ^ (C | ~A)) + X[9] + 3951481745 & 4294967295;
  B = C + (sum << 21 & 4294967295 | sum >>> 11);
  this.chain_[0] = this.chain_[0] + A & 4294967295;
  this.chain_[1] = this.chain_[1] + B & 4294967295;
  this.chain_[2] = this.chain_[2] + C & 4294967295;
  this.chain_[3] = this.chain_[3] + D & 4294967295;
};
goog.crypt.Md5.prototype.update = function(bytes, opt_length) {
  if (!goog.isDef(opt_length)) {
    opt_length = bytes.length;
  }
  var lengthMinusBlock = opt_length - this.blockSize;
  var block = this.block_;
  var blockLength = this.blockLength_;
  var i = 0;
  while (i < opt_length) {
    if (blockLength == 0) {
      while (i <= lengthMinusBlock) {
        this.compress_(bytes, i);
        i += this.blockSize;
      }
    }
    if (goog.isString(bytes)) {
      while (i < opt_length) {
        block[blockLength++] = bytes.charCodeAt(i++);
        if (blockLength == this.blockSize) {
          this.compress_(block);
          blockLength = 0;
          break;
        }
      }
    } else {
      while (i < opt_length) {
        block[blockLength++] = bytes[i++];
        if (blockLength == this.blockSize) {
          this.compress_(block);
          blockLength = 0;
          break;
        }
      }
    }
  }
  this.blockLength_ = blockLength;
  this.totalLength_ += opt_length;
};
goog.crypt.Md5.prototype.digest = function() {
  var pad = new Array((this.blockLength_ < 56 ? this.blockSize : this.blockSize * 2) - this.blockLength_);
  pad[0] = 128;
  for (var i = 1;i < pad.length - 8;++i) {
    pad[i] = 0;
  }
  var totalBits = this.totalLength_ * 8;
  for (var i = pad.length - 8;i < pad.length;++i) {
    pad[i] = totalBits & 255;
    totalBits /= 256;
  }
  this.update(pad);
  var digest = new Array(16);
  var n = 0;
  for (var i = 0;i < 4;++i) {
    for (var j = 0;j < 32;j += 8) {
      digest[n++] = this.chain_[i] >>> j & 255;
    }
  }
  return digest;
};
goog.provide("chatango.settings.servers.TagServer");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("goog.array");
goog.require("goog.crypt.Md5");
goog.require("goog.debug.Logger");
chatango.settings.servers.TagServer = function() {
  this.secure_ = false;
};
goog.addSingletonGetter(chatango.settings.servers.TagServer);
chatango.settings.servers.TagServer.SERVER_PREFIX = "s";
chatango.settings.servers.TagServer.prototype.logger = goog.debug.Logger.getLogger("chatango.settings.servers.TagServer");
chatango.settings.servers.TagServer.prototype.getHost = function(name) {
  var sub = this.getSubdomain(name);
  var base = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getTagserverBaseDomain();
  var host = sub + "." + base;
  return host;
};
chatango.settings.servers.TagServer.prototype.getSubdomain = function(name) {
  if (this.fixedServerNum_) {
    return chatango.settings.servers.TagServer.SERVER_PREFIX + this.fixedServerNum_;
  }
  var md5 = new goog.crypt.Md5;
  md5.update(name);
  hash = goog.array.reduce(md5.digest(), function(r, v) {
    var hex = v.toString(16);
    return hex.length > 1 ? r + hex : r + "0" + hex;
  }, "");
  var exception = window["_chatangoTagserver"]["ex"][hash];
  if (exception) {
    return chatango.settings.servers.TagServer.SERVER_PREFIX + exception;
  }
  var subdomain = chatango.settings.servers.TagServer.SERVER_PREFIX + this.getSNumber_(name);
  return subdomain;
};
chatango.settings.servers.TagServer.prototype.getSNumber_ = function(name) {
  name = name.split("_").join("q");
  name = name.split("-").join("q");
  var len = Math.min(5, name.length);
  var gnum = parseInt(name.substr(0, len), 36);
  var modStr = name.substr(6, Math.min(3, name.length - 5));
  var mod = parseInt(modStr, 36);
  mod = isNaN(mod) || mod <= 1E3 || mod == undefined ? 1E3 : mod;
  var position = gnum % mod / mod;
  var servers = this.getServerMap_();
  var totalWeights = 0;
  var i;
  for (i = 0;i < servers.length;i++) {
    totalWeights += this.getServerWeight_(servers[i][1]);
  }
  var baseNum = 0;
  var normWeights = new Object;
  for (i = 0;i < servers.length;i++) {
    baseNum += this.getServerWeight_(servers[i][1]) / totalWeights;
    normWeights[servers[i][0]] = baseNum;
  }
  for (i = 0;i < servers.length;i++) {
    if (position <= normWeights[servers[i][0]]) {
      sNumber = servers[i][0];
      break;
    }
  }
  return sNumber;
};
chatango.settings.servers.TagServer.prototype.setFixedServerNumber = function(sNum) {
  this.fixedServerNum_ = sNum;
};
chatango.settings.servers.TagServer.prototype.getServerMap_ = function() {
  return window["_chatangoTagserver"]["sm"];
};
chatango.settings.servers.TagServer.prototype.getServerWeight_ = function(serverId) {
  return window["_chatangoTagserver"]["sw"][serverId];
};
chatango.settings.servers.TagServer.prototype.getExceptionalServerNumber = function(name) {
  var md5 = new goog.crypt.Md5;
  md5.update(name);
  hash = goog.array.reduce(md5.digest(), function(r, v) {
    var hex = v.toString(16);
    return hex.length > 1 ? r + hex : r + "0" + hex;
  }, "");
  var exception = window["_chatangoTagserver"]["ex"][hash];
  return Number(exception);
};
chatango.settings.servers.TagServer.prototype.setIsSecure = function(bool) {
  this.secure_ = bool;
};
chatango.settings.servers.TagServer.prototype.getIsSecure = function() {
  return this.secure_;
};
goog.provide("chatango.messagedata.GroupAnnouncementData");
goog.require("chatango.messagedata.GroupMessageData");
goog.require("chatango.messagedata.GroupMsgFormatter");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.User");
goog.require("goog.dom");
goog.require("goog.dom.classes");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
chatango.messagedata.GroupAnnouncementData = function(msgString) {
  chatango.messagedata.MessageData.call(this);
  msgString = msgString.split(/\r\n/, 1).toString();
  var arr = msgString.split(":", chatango.messagedata.GroupAnnouncementData.MAX_FIELDS);
  var arr2 = msgString.split(":");
  for (var i = chatango.messagedata.GroupAnnouncementData.TXT_FIELD + 1;i < arr2.length;++i) {
    arr[chatango.messagedata.GroupAnnouncementData.TXT_FIELD] += ":" + arr2[i];
  }
  this.messageArray_ = arr;
  this.type_ = chatango.messagedata.MessageData.MessageType.ANNC;
  this.flags_ = this.messageArray_[1];
  this.name_ = this.messageArray_[2];
  this.userType_ = chatango.users.User.UserType.SELLER;
  this.messageHtml_ = this.messageArray_[chatango.messagedata.GroupAnnouncementData.TXT_FIELD];
};
goog.inherits(chatango.messagedata.GroupAnnouncementData, chatango.messagedata.GroupMessageData);
chatango.messagedata.GroupAnnouncementData.MAX_FIELDS = 4;
chatango.messagedata.GroupAnnouncementData.TXT_FIELD = 3;
chatango.messagedata.GroupAnnouncementData.prototype.getMessageHtml = function() {
  return this.messageHtml_;
};
chatango.messagedata.GroupAnnouncementData.prototype.isPremium = function() {
  return true;
};
chatango.messagedata.GroupAnnouncementData.prototype.hasBg = function() {
  return!!(this.flags_ & 2);
};
chatango.messagedata.GroupAnnouncementData.prototype.getName = function() {
  return chatango.users.ModeratorManager.getInstance().getOwner();
};
chatango.messagedata.GroupAnnouncementData.prototype.getGroupName = function() {
  return this.name_;
};
chatango.messagedata.GroupAnnouncementData.prototype.logger = goog.debug.Logger.getLogger("chatango.messagedata.GroupAnnouncementData");
goog.provide("chatango.networking.GroupConnection");
goog.require("chatango.managers.ServerTime");
goog.require("chatango.messagedata.GroupMessageData");
goog.require("chatango.managers.Style");
goog.require("chatango.networking.BaseConnection");
goog.require("chatango.messagedata.GroupMessageData");
goog.require("chatango.messagedata.GroupAnnouncementData");
goog.require("chatango.networking.CommonConnectionEvent");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.settings.servers.TagServer");
goog.require("chatango.utils.Encode");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.net.WebSocket");
chatango.networking.GroupConnection = function(handle, session) {
  this.handle_ = handle;
  var bd = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType);
  var protocol = bd.getProtocol().replace(":", "");
  var secure = protocol === "https";
  var ports = secure ? bd.getSecurePorts() : bd.getPorts();
  var server = chatango.settings.servers.TagServer.getInstance().getHost(this.handle_);
  chatango.settings.servers.TagServer.getInstance().setIsSecure(protocol === "https");
  goog.base(this, ports, server, secure);
  this.session_ = session;
  this.numUsers_ = 0;
  this.anonTimeOutTimerId_ = null;
  this.anonTimedOut_ = false;
  goog.events.listen(this, chatango.networking.GroupConnectionEvent.EventType.v, this.onVersion, false, this);
};
goog.inherits(chatango.networking.GroupConnection, chatango.networking.BaseConnection);
chatango.networking.GroupConnection.CURRENT_VERSION = 15;
chatango.networking.GroupConnection.flags = {LIST_TAXONOMY:1, NOANONS:4, NOFLAGGING:8, NOCOUNTER:16, NOIMAGES:32, NOLINKS:64, NOVIDEOS:128, NOSTYLEDTEXT:256, NOLINKSCHATANGO:512, NOBRDCASTMSGWITHBW:1024, RATELIMITREGIMEON:2048, CHANNELSDISABLED:8192, NLP_SINGLEMSG:16384, NLP_MSGQUEUE:32768, BROADCAST_MODE:65536, CLOSED_IF_NO_MODS:131072, IS_CLOSED:262144, SHOW_MOD_ICONS:524288, MODS_CHOOSE_VISIBILITY:1048576, NLP_NGRAM:2097152, NO_PROXIES:4194304, HAS_XML:268435456, UNSAFE:536870912};
chatango.networking.GroupConnection.prototype.anonTimeOutInterval_ = 12E5;
chatango.networking.GroupConnection.prototype.logger = goog.debug.Logger.getLogger("chatango.networking.GroupConnection");
chatango.networking.GroupConnection.prototype.onData = function(event) {
  var arr = event.message.split("\r\n")[0].split(":");
  if (arr[0] != "n") {
    if (chatango.DEBUG) {
      console.log("Group Con. ON DATA: " + event.message);
    }
  } else {
    var ts = (new Date).getTime();
    if (!this.lastNTime_ || ts - this.lastNTime_ > 500) {
      this.lastNTime_ = ts;
    } else {
      return;
    }
  }
  var cmd_type = "group";
  var e_name = chatango.networking.GroupConnectionEvent.EventLookup[arr[0]];
  if (!e_name) {
    e_name = chatango.networking.CommonConnectionEvent.EventLookup[arr[0]];
    cmd_type = "common";
  }
  if (!e_name) {
    if (chatango.DEBUG) {
      if (arr.toString() == "") {
        this.logger.info("PING FROM SERVER");
      } else {
        this.logger.info("Unhandled command:" + arr);
      }
    }
    return;
  }
  if (arr.length == 2 && arr[1] == "") {
    arr = [arr[0]];
  }
  if (e_name == chatango.networking.GroupConnectionEvent.EventType.groupflagsupdate) {
    this.flags = arr[1];
    chatango.users.ModeratorManager.getInstance().changeModVisibility(this.flags);
  }
  if (cmd_type == "group") {
    if (chatango.DEBUG) {
      this.logger.info("dispatch Group ConnectionEvent:" + e_name);
    }
    if (e_name == chatango.networking.GroupConnectionEvent.EventType.i || e_name == chatango.networking.GroupConnectionEvent.EventType.b) {
      var msg = new chatango.messagedata.GroupMessageData(event.message);
      if (msg.isValidMessage()) {
        this.dispatchEvent(new chatango.networking.GroupConnectionEvent(e_name, msg));
      } else {
        if (chatango.DEBUG) {
          this.logger.info("THIS GROUP MESSAGE IS MALFORMATTED - DO NOT CONTINUE");
        }
        return;
      }
    } else {
      if (e_name == chatango.networking.GroupConnectionEvent.EventType.annc) {
        var msg = new chatango.messagedata.GroupAnnouncementData(event.message);
        var formatter = new chatango.messagedata.GroupMsgFormatter(msg);
        var valid = formatter.isValidMessage();
        if (valid) {
          this.dispatchEvent(new chatango.networking.GroupConnectionEvent(e_name, msg));
        } else {
          if (chatango.DEBUG) {
            this.logger.info("THIS GROUP ANNC IS MALFORMATTED - DO NOT CONTINUE");
          }
          return;
        }
      } else {
        this.myevent = new chatango.networking.GroupConnectionEvent(e_name, arr);
        this.dispatchEvent(this.myevent);
      }
    }
  } else {
    if (chatango.DEBUG) {
      this.logger.info("dispatch Common ConnectionEvent:" + e_name);
    }
    this.dispatchEvent(new chatango.networking.CommonConnectionEvent(e_name, arr));
  }
  if (e_name == chatango.networking.GroupConnectionEvent.EventType.n) {
    this.numUsers_ = arr[1];
  }
};
chatango.networking.GroupConnection.prototype.onConnect = function() {
  chatango.networking.GroupConnection.superClass_.onConnect.call(this);
  if (chatango.DEBUG) {
    this.logger.info("GroupConnection.prototype.onConnect now send v");
  }
  this.send("v", "\x00");
};
chatango.networking.GroupConnection.prototype.initHandShake = function() {
  var sessionId = this.session_.getSessionId();
  var username = goog.net.cookies.get("un") || "";
  var password = goog.net.cookies.get("pw") || "";
  if (username != "") {
    var encoder = chatango.utils.Encode.getInstance();
    username = encoder.decode(username);
    password = encoder.decode(password);
  }
  var handshake_array = ["bauth", this.handle_, sessionId, username, password];
  var hs = handshake_array.join(":");
  this.send(hs, "\x00");
};
chatango.networking.GroupConnection.prototype.getFlags = function() {
  return this.flags;
};
chatango.networking.GroupConnection.prototype.clientAuthenticated = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("Client Authenticated");
  }
  this.session_.setSessionId(e.data[2]);
  this.session_.setSessionTsId(e.data[5]);
  var ownerId = e.data[1];
  chatango.users.UserManager.getInstance().addUser(null, ownerId, chatango.users.User.UserType.SELLER);
  chatango.users.ModeratorManager.getInstance().setOwner(ownerId);
  var mods = e.data[7] == "" ? [] : e.data[7].split(";");
  chatango.users.ModeratorManager.getInstance().updateMods(mods);
  if (e.data[3] == "M") {
    chatango.users.UserManager.getInstance().addCurrentUser(null, e.data[4], chatango.users.User.UserType.SELLER);
  } else {
    this.startAnonTimeOutTimer();
  }
  chatango.networking.GroupConnection.superClass_.clientAuthenticated.call(this, e);
  this.flags = e.data[8];
  chatango.users.ModeratorManager.getInstance().changeModVisibility(this.flags);
  this.dispatchEvent(chatango.events.EventType.LOGIN_STATUS_DETERMINED);
  if (chatango.DEBUG) {
    this.logger.info("clientAuthenticated:" + e.data);
  }
  chatango.managers.ServerTime.getInstance().addTimeDelta(Number(e.data[5]));
  if (chatango.DEBUG) {
    this.logger.info("servertime:" + new Date(chatango.managers.ServerTime.getInstance().getServerTime()));
  }
};
chatango.networking.GroupConnection.prototype.onVersion = function(e) {
  var local_version = chatango.networking.GroupConnection.CURRENT_VERSION;
  var lowest_compatable_version = e.data[1];
  var current_server_version = e.data[2];
  if (chatango.DEBUG) {
    this.logger.info("onVersion local_version:" + local_version);
  }
  if (local_version < lowest_compatable_version) {
    var e_name = chatango.networking.GroupConnectionEvent.EventLookup["versioningPU"];
    this.dispatchEvent(new chatango.networking.GroupConnectionEvent(e_name));
    if (chatango.DEBUG) {
      this.logger.info("BELOW LOWEST COMPATABLE VERSION : DISCONNECT");
    }
  } else {
    if (local_version < current_server_version) {
      var e_name = chatango.networking.GroupConnectionEvent.EventLookup["versioningPU"];
      this.dispatchEvent(new chatango.networking.GroupConnectionEvent(e_name));
      if (chatango.DEBUG) {
        this.logger.info("BELOW CURRENT VERSION : DO HANDSHAKE - BUT SHOW WARNING");
      }
      this.initHandShake();
    } else {
      if (chatango.DEBUG) {
        this.logger.info("CURRENT VERSION : PROCEED TO HANDSHAKE ");
      }
      this.initHandShake();
    }
  }
};
chatango.networking.GroupConnection.prototype.startAnonTimeOutTimer = function() {
  this.stopAnonTimeOutTimer();
  if (chatango.DEBUG) {
    console.log("startAnonTimeOutTimer");
  }
  if (chatango.managers.Style.getInstance().isFullSizeGroup()) {
    if (chatango.DEBUG) {
      console.log("Don't start the anon timeout on full size groups");
    }
    return;
  }
  this.anonTimeOutTimerId_ = goog.Timer.callOnce(this.onAnonTimeOut_, this.anonTimeOutInterval_, this);
  this.anonTimedOut_ = false;
};
chatango.networking.GroupConnection.prototype.stopAnonTimeOutTimer = function() {
  if (chatango.DEBUG) {
    console.log("stopAnonTimeOutTimer");
  }
  if (!this.anonTimeOutTimerId_) {
    return;
  }
  goog.Timer.clear(this.anonTimeOutTimerId_);
  this.anonTimeOutTimer_ = null;
};
chatango.networking.GroupConnection.prototype.onAnonTimeOut_ = function(e) {
  if (chatango.DEBUG) {
    console.log("on anon time out!");
  }
  this.anonTimedOut_ = true;
  this.selfKickOff(true);
};
chatango.networking.GroupConnection.prototype.getAnonTimedOut = function() {
  return this.anonTimedOut_;
};
chatango.networking.GroupConnection.prototype.getAnonTimeOutInterval = function() {
  return this.anonTimeOutInterval_;
};
chatango.networking.GroupConnection.prototype.getNumUsers = function() {
  return this.numUsers_;
};
chatango.networking.GroupConnection.prototype.CONNECTION_TYPE = "groupcon";
chatango.networking.GroupConnection.prototype.getConnectionType = function() {
  return chatango.networking.GroupConnection.prototype.CONNECTION_TYPE;
};
goog.provide("chatango.group.settings.AnnouncementsModel");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.string");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.networking.GroupConnection");
chatango.group.settings.AnnouncementsModel = function(connection, handle) {
  goog.events.EventTarget.call(this);
  this.connection_ = connection;
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.connection_, chatango.networking.GroupConnectionEvent.EventType.annc, this.broadcastAnnouncement);
  this.groupName = handle;
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
};
goog.inherits(chatango.group.settings.AnnouncementsModel, goog.events.EventTarget);
chatango.group.settings.AnnouncementsModel.prototype.logger = goog.debug.Logger.getLogger("chatango.group.settings.AnnouncementsModel");
chatango.group.settings.AnnouncementsModel.prototype.getConnection = function(e) {
  return this.connection_;
};
chatango.group.settings.AnnouncementsModel.prototype.broadcastAnnouncement = function(e) {
  this.dispatchEvent(e);
};
chatango.group.settings.AnnouncementsModel.prototype.setFields = function(e) {
  var that = this;
  this.handler_.listenOnce(this.connection_, chatango.networking.GroupConnectionEvent.EventType.getannc, function(e) {
    if (e.data[1] !== "none") {
      that.hasAnnouncement = true;
      that.flags = Number(e.data[1]);
      that.messageCountDelay = e.data[3];
      that.periodicity = Number(e.data[4]) / 60;
      that.text = e.data[5];
    } else {
      that.periodicity = 5;
    }
    this.dispatchEvent(chatango.events.AnnouncementEvent.EventType.FIELDS_SET);
  });
  this.connection_.send("getannouncement");
};
chatango.group.settings.AnnouncementsModel.prototype.isEnabled = function() {
  return Number(this.flags) & 1 === 1;
};
chatango.group.settings.AnnouncementsModel.prototype.updateAnnouncement = function(isEnabled, text, periodicity) {
  var user = chatango.users.UserManager.getInstance().currentUser;
  var flags = 0;
  if (isEnabled && this.msManager_.getStyle("usebackground") === "1") {
    flags = 3;
  } else {
    if (isEnabled) {
      flags = 1;
    }
  }
  var n_prefix = "";
  var f_prefix = "";
  var textColor = this.msManager_.getStyle("textColor");
  if (textColor) {
    f_prefix = "<f x" + chatango.utils.color.compressHex(textColor) + '="">';
  }
  var nameColor = this.msManager_.getStyle("nameColor");
  if (nameColor) {
    n_prefix = "<n" + chatango.utils.color.compressHex(nameColor) + "/>";
  }
  text = n_prefix + f_prefix + (text || "").replace(/<(?:.|\n)*?>/gm, "");
  if (!this.hasAnnouncement || (text !== this.text || flags !== this.flags || periodicity !== this.periodicity)) {
    if (chatango.DEBUG) {
      console.log("Sending announcement");
    }
    this.hasAnnouncement = true;
    this.text = text;
    this.flags = flags;
    this.periodicity = Number(periodicity);
    var command = "updateannouncement:" + this.flags + ":" + this.periodicity * 60 + ":" + this.text;
    this.connection_.send("updateannouncement:" + this.flags + ":" + this.periodicity * 60 + ":" + this.text);
  }
};
goog.provide("chatango.group.participants.ParticipantsCounter");
goog.require("goog.ui.Component");
goog.require("chatango.managers.Style");
chatango.group.participants.ParticipantsCounter = function(opt_color, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  if (opt_color == chatango.ui.icons.Icon.USE_USER_DEFINED_COLOR) {
    opt_color = chatango.managers.Style.getInstance().getUserDefinedIconColor();
    goog.events.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.USER_DEFINED_ICON_COLOR_CHANGED, this.onIconColorUpdate, null, this);
  }
  this.color_ = opt_color || "#000000";
  this.verticallyCenter_ = true;
  this.numberEl_ = goog.dom.createDom("span", {"class":"txt-v-ctr", "style":"color:" + this.color_ + ""});
  this.numberEl_.innerHTML = "&nbsp;&nbsp;";
};
goog.inherits(chatango.group.participants.ParticipantsCounter, goog.ui.Component);
chatango.group.participants.ParticipantsCounter.prototype.createDom = function() {
  chatango.group.participants.ParticipantsCounter.superClass_.createDom.call(this);
  goog.style.setStyle(this.element_, "width", "auto");
  goog.dom.append(this.element_, this.numberEl_);
};
chatango.group.participants.ParticipantsCounter.prototype.setConnectionListener = function(con) {
  this.stopConnectionListener();
  this.con_ = con;
  goog.events.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.n, this.updateCounter, true, this);
  var n = this.con_.getNumUsers();
  this.updateCounter({data:[0, Number(n).toString(16)]});
};
chatango.group.participants.ParticipantsCounter.prototype.stopConnectionListener = function() {
  if (this.con_) {
    goog.events.unlisten(this.con_, chatango.networking.GroupConnectionEvent.EventType.n, this.updateCounter, true, this);
  }
};
chatango.group.participants.ParticipantsCounter.prototype.updateCounter = function(e) {
  numUsers_ = parseInt(e.data[1], 16);
  goog.dom.setTextContent(this.numberEl_, numUsers_);
};
chatango.group.participants.ParticipantsCounter.prototype.modsOnlyView_ = false;
chatango.group.participants.ParticipantsCounter.prototype.setModsOnlyView = function(bool) {
  if (this.modsOnlyView_ != bool) {
    this.modsOnlyView_ = bool;
    this.draw();
  }
};
chatango.group.participants.ParticipantsCounter.prototype.centerVertically = function(bool) {
  this.verticallyCenter_ = bool;
  this.draw();
};
chatango.group.participants.ParticipantsCounter.prototype.draw = function() {
  if (this.modsOnlyView_) {
    goog.style.setStyle(this.numberEl_, "font-style", "italic");
  } else {
    goog.style.setStyle(this.numberEl_, "font-style", "normal");
  }
  goog.style.setStyle(this.numberEl_, "color", this.color_);
  if (this.verticallyCenter_) {
    goog.dom.classes.add(this.numberEl_, "txt-v-ctr");
  } else {
    goog.dom.classes.remove(this.numberEl_, "txt-v-ctr");
  }
};
chatango.group.participants.ParticipantsCounter.prototype.onIconColorUpdate = function(e) {
  this.color_ = chatango.managers.Style.getInstance().getUserDefinedIconColor();
  this.draw();
};
chatango.group.participants.ParticipantsCounter.prototype.visible_ = true;
chatango.group.participants.ParticipantsCounter.prototype.setVisible = function(bool) {
  this.visible_ = bool;
  goog.style.setStyle(this.element_, "display", bool ? "inline-block" : "none");
};
chatango.group.participants.ParticipantsCounter.prototype.isVisible = function() {
  return this.visible_;
};
goog.provide("chatango.group.GroupCover");
goog.require("goog.ui.Component");
goog.require("goog.graphics");
goog.require("goog.ui.Button");
goog.require("goog.events");
goog.require("goog.style");
goog.require("goog.dom");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("chatango.group.participants.ParticipantsCounter");
goog.require("chatango.managers.ViewportManager");
chatango.group.GroupCover = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.peopleHereNowBtn_ = new chatango.group.participants.ParticipantsCounter("#666666");
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
};
goog.inherits(chatango.group.GroupCover, goog.ui.Component);
chatango.group.GroupCover.prototype.logger = goog.debug.Logger.getLogger("chatango.group.GroupCover");
chatango.group.GroupCover.prototype.createDom = function(opt_domHelper) {
  this.element_ = goog.dom.createDom("div", {"id":"groupcover"});
  goog.dom.setProperties(this.element_, {style:"display:none"});
  this.peopleHereNowBtn_.render(this.element_);
  var phnEl = this.peopleHereNowBtn_.getElement();
  goog.dom.classes.add(phnEl, "people-btn");
};
chatango.group.GroupCover.prototype.show = function() {
  this.draw();
  goog.style.setStyle(this.element_, "display", "inline");
  if (this.connection_) {
    this.peopleHereNowBtn_.setConnectionListener(this.connection_);
  }
};
chatango.group.GroupCover.prototype.hide = function() {
  goog.dom.setProperties(this.element_, {style:"display:none"});
  this.peopleHereNowBtn_.stopConnectionListener();
};
chatango.group.GroupCover.prototype.setConnectionListener = function(con) {
  this.connection_ = con;
};
chatango.group.GroupCover.prototype.draw = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (this.peopleHereNowBtn_.getElement()) {
    this.peopleHereNowBtn_.getElement().title = lm.getString("basic_group", "people_here_now");
  }
};
chatango.group.GroupCover.prototype.initCopy = function() {
  this.draw();
};
goog.provide("chatango.group.GroupChatRestrictions");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.net.cookies");
goog.require("goog.string");
goog.require("chatango.events.EventType");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.users.UserManager");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.Encode");
chatango.group.GroupChatRestrictions = function(connection) {
  goog.events.EventTarget.call(this);
  this.con_ = connection;
  this.restrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.ANYONE;
  if (chatango.networking.GroupConnection.flags.BROADCAST_MODE & connection.getFlags()) {
    this.restrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST;
  } else {
    if (chatango.networking.GroupConnection.flags.NOANONS & connection.getFlags()) {
      this.restrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.NOANON;
    }
  }
  this.groupIsOpen_ = !(chatango.networking.GroupConnection.flags.IS_CLOSED & connection.getFlags());
  this.groupWillCloseIfNoMods_ = (chatango.networking.GroupConnection.flags.CLOSED_IF_NO_MODS & connection.getFlags()) != 0;
  this.proxiesBanned_ = (chatango.networking.GroupConnection.flags.NO_PROXIES & connection.getFlags()) != 0;
  this.rateLimitSeconds_ = -1;
  this.isInRateLimitMode_ = this.isRateLimitFlagSet();
  this.handler = new goog.events.EventHandler(this);
  this.handler.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.groupflagsupdate, this.onGroupFlagsUpdate);
  this.handler.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.mustlogin, function() {
    this.dispatchEvent(chatango.events.EventType.MUST_LOGIN);
  });
  this.handler.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.ratelimitset, this.onRateLimitChange);
  goog.events.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.groupflagstoggled, this.onGroupFlagsToggled, false, this);
  if (this.isInRateLimitMode_) {
    this.getRateLimitSeconds();
  } else {
    this.rateLimitSeconds_ = 0;
  }
};
goog.inherits(chatango.group.GroupChatRestrictions, goog.events.EventTarget);
chatango.group.GroupChatRestrictions.EventType = {RESTRICTION_STATE_CHANGED:"gcr_restrict_change", RATE_LIMIT_SET:"gcr_rate_limit_set"};
chatango.group.GroupChatRestrictions.RestrictionState = {ANYONE:"anyone", NOANON:"noanon", BROADCAST:"broadcast-mode"};
chatango.group.GroupChatRestrictions.UserRestrictionMode = {OPEN:"open", BROADCAST:"broadcast", BROADCAST_BLOCKED:"broadcast_blocked", CLOSED:"closed"};
chatango.group.GroupChatRestrictions.restrictionState_ = null;
chatango.group.GroupChatRestrictions.isInRateLimitMode_ = false;
chatango.group.GroupChatRestrictions.rateLimitSeconds_ = -1;
chatango.group.GroupChatRestrictions.prototype.logger = goog.debug.Logger.getLogger("chatango.group.GroupChatRestrictions");
chatango.group.GroupChatRestrictions.prototype.setRestriction = function(newState) {
  var noAnonFlag = chatango.networking.GroupConnection.flags.NOANONS;
  var broadcastModeFlag = chatango.networking.GroupConnection.flags.BROADCAST_MODE;
  var anyoneFlag = 0;
  var currentState = this.restrictionState_;
  var unsetFlag = 0;
  switch(currentState) {
    case chatango.group.GroupChatRestrictions.RestrictionState.NOANON:
      unsetFlag = noAnonFlag;
      break;
    case chatango.group.GroupChatRestrictions.RestrictionState.ANYONE:
      unsetFlag = anyoneFlag;
      break;
    case chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST:
      unsetFlag = broadcastModeFlag;
      break;
  }
  var setFlag = 0;
  switch(newState) {
    case chatango.group.GroupChatRestrictions.RestrictionState.NOANON:
      setFlag = noAnonFlag;
      break;
    case chatango.group.GroupChatRestrictions.RestrictionState.ANYONE:
      setFlag = anyoneFlag;
      break;
    case chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST:
      setFlag = broadcastModeFlag;
      break;
  }
  this.con_.send("updategroupflags:" + setFlag + ":" + unsetFlag);
};
chatango.group.GroupChatRestrictions.prototype.isInRateLimitMode = function() {
  return this.isInRateLimitMode_;
};
chatango.group.GroupChatRestrictions.prototype.isOpen = function() {
  return this.groupIsOpen_;
};
chatango.group.GroupChatRestrictions.prototype.getGroupWillCloseIfNoMods = function() {
  return this.groupWillCloseIfNoMods_;
};
chatango.group.GroupChatRestrictions.prototype.setGroupWillCloseIfNoMods = function(bool) {
  var flag = chatango.networking.GroupConnection.flags.CLOSED_IF_NO_MODS;
  if (bool) {
    this.con_.send("updategroupflags:" + flag + ":0");
  } else {
    this.con_.send("updategroupflags:0:" + flag);
  }
};
chatango.group.GroupChatRestrictions.prototype.getProxiesBanned = function() {
  return this.proxiesBanned_;
};
chatango.group.GroupChatRestrictions.prototype.setProxiesBanned = function(bool) {
  var flag = chatango.networking.GroupConnection.flags.NO_PROXIES;
  if (bool) {
    this.con_.send("updategroupflags:" + flag + ":0");
  } else {
    this.con_.send("updategroupflags:0:" + flag);
  }
};
chatango.group.GroupChatRestrictions.prototype.setRateLimit = function(rateInSeconds) {
  if (rateInSeconds > 0) {
    this.con_.send("setratelimit:" + rateInSeconds);
  } else {
    this.con_.send("setratelimit:0");
  }
  this.isRateLimitMode_ = rateInSeconds > 0;
};
chatango.group.GroupChatRestrictions.prototype.getRateLimitSeconds = function(callback, getSecondsLeft) {
  if (this.rateLimitSeconds_ < 0 || getSecondsLeft) {
    var that = this;
    this.handler.listenOnce(this.con_, chatango.networking.GroupConnectionEvent.EventType.getratelimit, function(e) {
      that.rateLimitSeconds_ = +e.data[1];
      var secondsLeft = +e.data[2];
      if (callback) {
        callback(that.rateLimitSeconds_, secondsLeft);
      }
    });
    this.con_.send("getratelimit");
  } else {
    if (callback) {
      callback(this.rateLimitSeconds_);
    }
  }
};
chatango.group.GroupChatRestrictions.prototype.getRestriction = function() {
  return this.restrictionState_;
};
chatango.group.GroupChatRestrictions.prototype.isRateLimitFlagSet = function() {
  return 0 != (chatango.networking.GroupConnection.flags.RATELIMITREGIMEON & this.con_.getFlags());
};
chatango.group.GroupChatRestrictions.prototype.onGroupFlagsToggled = function(e) {
  errorCode = e && e.data && e.data[3] ? e.data[3] : 1;
  if (errorCode != 1) {
    if (chatango.DEBUG) {
      console.log("User attempted to update group flags and got an error", e.data);
    }
    this.dispatchEvent(chatango.events.EventType.FLAG_UPDATE_ERROR);
  }
};
chatango.group.GroupChatRestrictions.prototype.onGroupFlagsUpdate = function(e) {
  var lastRestrictionState_ = this.restrictionState_;
  if (this.con_.getFlags() & chatango.networking.GroupConnection.flags.NOANONS) {
    this.restrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.NOANON;
  } else {
    if (this.con_.getFlags() & chatango.networking.GroupConnection.flags.BROADCAST_MODE) {
      this.restrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST;
    } else {
      this.restrictionState_ = chatango.group.GroupChatRestrictions.RestrictionState.ANYONE;
    }
  }
  var lastGroupWillCloseIfNoMods = this.groupWillCloseIfNoMods_;
  this.groupWillCloseIfNoMods_ = (this.con_.getFlags() & chatango.networking.GroupConnection.flags.CLOSED_IF_NO_MODS) != 0;
  var lastProxiesBanned = this.proxiesBanned_;
  this.proxiesBanned_ = (this.con_.getFlags() & chatango.networking.GroupConnection.flags.NO_PROXIES) != 0;
  var lastOpenState_ = this.groupIsOpen_;
  this.groupIsOpen_ = !(this.con_.getFlags() & chatango.networking.GroupConnection.flags.IS_CLOSED);
  if (this.restrictionState_ != lastRestrictionState_ || this.groupIsOpen_ != lastOpenState_ || this.groupWillCloseIfNoMods_ != lastGroupWillCloseIfNoMods || this.proxiesBanned_ != lastProxiesBanned) {
    this.dispatchEvent(chatango.events.EventType.CHANGE_LOGIN_DIALOG_SETTING);
    this.dispatchEvent(chatango.group.GroupChatRestrictions.EventType.RESTRICTION_STATE_CHANGED);
  }
};
chatango.group.GroupChatRestrictions.prototype.onRateLimitChange = function(e) {
  if (e.data.length < 2) {
    return;
  }
  var rateInSeconds = +e.data[1];
  this.rateLimitSeconds_ = rateInSeconds;
  this.isInRateLimitMode_ = rateInSeconds > 0;
  this.dispatchEvent(chatango.group.GroupChatRestrictions.EventType.RATE_LIMIT_SET);
};
chatango.group.GroupChatRestrictions.prototype.getCurrentUserRestrictionMode = function() {
  var inBroadcastMode = this.getRestriction() == chatango.group.GroupChatRestrictions.RestrictionState.BROADCAST;
  if (this.isOpen() && !inBroadcastMode) {
    return chatango.group.GroupChatRestrictions.UserRestrictionMode.OPEN;
  }
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var unsignedInUser = !currentUser || !currentUser.isRegistered() || currentUser.isAnon();
  var userMayBroadcast = false;
  if (!unsignedInUser) {
    userMayBroadcast = chatango.users.ModeratorManager.getInstance().hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.CAN_BROADCAST);
  }
  if (inBroadcastMode) {
    if (unsignedInUser || userMayBroadcast) {
      return chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST;
    } else {
      return chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST_BLOCKED;
    }
  }
  if (!this.isOpen()) {
    return chatango.group.GroupChatRestrictions.UserRestrictionMode.CLOSED;
  }
};
goog.provide("chatango.utils.strings");
chatango.utils.strings.lengthInUtf8Bytes = function(str, opt_maxLength) {
  var max = opt_maxLength || 1E6;
  var s = str.length;
  for (var i = str.length - 1;i >= 0;i--) {
    var code = str.charCodeAt(i);
    if (code > 127 && code <= 2047) {
      s++;
    } else {
      if (code > 2047 && code <= 65535) {
        s += 2;
      }
    }
    if (code >= 56320 && code <= 57343) {
      i--;
    }
    if (s >= max) {
      s = max;
      break;
    }
  }
  return s;
};
goog.provide("chatango.ui.icons.SvgResizeIcon");
goog.require("chatango.ui.icons.SvgIcon");
goog.require("goog.positioning.Corner");
chatango.ui.icons.SvgResizeIcon = function(opt_color, opt_cnr_alignment, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.corner_ = opt_cnr_alignment;
};
goog.inherits(chatango.ui.icons.SvgResizeIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgResizeIcon.prototype.draw = function() {
  var path = "";
  switch(this.corner_) {
    case goog.positioning.Corner.BOTTOM_LEFT:
      path = "M 8 71 L 29 92 M 8 50 L 50 92";
      break;
    case goog.positioning.Corner.BOTTOM_RIGHT:
      path = "M 71 92 L 92 71 M 50 92 L 92 50";
      break;
    case goog.positioning.Corner.TOP_RIGHT:
      path = "M 71 8 L 92 29 M 45 8 L 92 55";
      break;
    case goog.positioning.Corner.TOP_LEFT:
    ;
    default:
      path = "M 8 25 L 25 8 M 8 45 L 45 8";
  }
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100" preserveAspectRatio="none" style="display: block;">' + "<defs></defs>" + "<g>" + '<path d="' + path + '" stroke="' + this.color_ + '"  stroke-width="6%" fill="none"></path>' + "</g>" + "</svg>";
};
chatango.ui.icons.SvgResizeIcon.prototype.setVerticalAlign_ = function() {
  return;
};
goog.provide("chatango.group.ResizeDraggerPositionHelper");
goog.require("chatango.ui.icons.SvgResizeIcon");
chatango.group.ResizeDraggerPositionHelper.createDraggerIcon = function(element) {
  var embedType = chatango.managers.Style.getInstance().getEmbedType();
  var isCollapsableGroup = embedType == chatango.group.GroupEmbedTypes.BOX_FIXED || embedType == chatango.group.GroupEmbedTypes.TAB || embedType == chatango.group.GroupEmbedTypes.BUTTON;
  var isCollapsableGroupOnDesktop = chatango.managers.Environment.getInstance().isDesktop() && isCollapsableGroup;
  if (isCollapsableGroupOnDesktop) {
    var pos = chatango.managers.Style.getInstance().getCVPosition();
    var iconCorner;
    var iconAlignX;
    var iconAlignY;
    switch(pos) {
      case "tl":
        iconCorner = goog.positioning.Corner.BOTTOM_RIGHT;
        iconAlignX = "right";
        iconAlignY = "bottom";
        break;
      case "tr":
        iconCorner = goog.positioning.Corner.BOTTOM_LEFT;
        iconAlignX = "left";
        iconAlignY = "bottom";
        break;
      case "bl":
        iconCorner = goog.positioning.Corner.TOP_RIGHT;
        iconAlignX = "right";
        iconAlignY = "top";
        break;
      case "br":
        iconCorner = goog.positioning.Corner.TOP_LEFT;
        iconAlignX = "left";
        iconAlignY = "top";
        break;
    }
    if (iconCorner != undefined) {
      resizeDraggerIcon = new chatango.ui.icons.SvgResizeIcon(chatango.ui.icons.Icon.USE_USER_DEFINED_COLOR, iconCorner);
      resizeDraggerIcon.render(element);
      var draggerIconEl = resizeDraggerIcon.getElement();
      goog.style.setStyle(draggerIconEl, "position", "absolute");
      goog.style.setStyle(draggerIconEl, iconAlignX, 0);
      goog.style.setStyle(draggerIconEl, iconAlignY, 0);
      goog.style.setStyle(draggerIconEl, "pointer-events", "none");
      return draggerIconEl;
    }
  }
  return null;
};
goog.provide("goog.ds.BaseDataNode");
goog.provide("goog.ds.BasicNodeList");
goog.provide("goog.ds.DataNode");
goog.provide("goog.ds.DataNodeList");
goog.provide("goog.ds.EmptyNodeList");
goog.provide("goog.ds.LoadState");
goog.provide("goog.ds.SortedNodeList");
goog.provide("goog.ds.Util");
goog.provide("goog.ds.logger");
goog.require("goog.array");
goog.require("goog.log");
goog.ds.DataNode = function() {
};
goog.ds.DataNode.prototype.get = goog.abstractMethod;
goog.ds.DataNode.prototype.set = goog.abstractMethod;
goog.ds.DataNode.prototype.getChildNodes = goog.abstractMethod;
goog.ds.DataNode.prototype.getChildNode = goog.abstractMethod;
goog.ds.DataNode.prototype.getChildNodeValue = goog.abstractMethod;
goog.ds.DataNode.prototype.setChildNode = goog.abstractMethod;
goog.ds.DataNode.prototype.getDataName = goog.abstractMethod;
goog.ds.DataNode.prototype.setDataName = goog.abstractMethod;
goog.ds.DataNode.prototype.getDataPath = goog.abstractMethod;
goog.ds.DataNode.prototype.load = goog.abstractMethod;
goog.ds.DataNode.prototype.getLoadState = goog.abstractMethod;
goog.ds.DataNode.prototype.isList = goog.abstractMethod;
goog.ds.LoadState = {LOADED:"LOADED", LOADING:"LOADING", FAILED:"FAILED", NOT_LOADED:"NOT_LOADED"};
goog.ds.BaseDataNode = function() {
};
goog.ds.BaseDataNode.prototype.set = goog.abstractMethod;
goog.ds.BaseDataNode.prototype.getChildNodes = function(opt_selector) {
  return new goog.ds.EmptyNodeList;
};
goog.ds.BaseDataNode.prototype.getChildNode = function(name, opt_canCreate) {
  return null;
};
goog.ds.BaseDataNode.prototype.getChildNodeValue = function(name) {
  return null;
};
goog.ds.BaseDataNode.prototype.getDataName = goog.abstractMethod;
goog.ds.BaseDataNode.prototype.getDataPath = function() {
  var parentPath = "";
  var myName = this.getDataName();
  if (this.getParent && this.getParent()) {
    parentPath = this.getParent().getDataPath() + (myName.indexOf(goog.ds.STR_ARRAY_START) != -1 ? "" : goog.ds.STR_PATH_SEPARATOR);
  }
  return parentPath + myName;
};
goog.ds.BaseDataNode.prototype.load = goog.nullFunction;
goog.ds.BaseDataNode.prototype.getLoadState = function() {
  return goog.ds.LoadState.LOADED;
};
goog.ds.BaseDataNode.prototype.getParent = null;
goog.ds.DataNodeList = function() {
};
goog.ds.DataNodeList.prototype.add = goog.abstractMethod;
goog.ds.DataNodeList.prototype.get = goog.abstractMethod;
goog.ds.DataNodeList.prototype.getByIndex = goog.abstractMethod;
goog.ds.DataNodeList.prototype.getCount = goog.abstractMethod;
goog.ds.DataNodeList.prototype.setNode = goog.abstractMethod;
goog.ds.DataNodeList.prototype.removeNode = goog.abstractMethod;
goog.ds.BasicNodeList = function(opt_nodes) {
  this.map_ = {};
  this.list_ = [];
  this.indexMap_ = {};
  if (opt_nodes) {
    for (var i = 0, node;node = opt_nodes[i];i++) {
      this.add(node);
    }
  }
};
goog.ds.BasicNodeList.prototype.add = function(node) {
  this.list_.push(node);
  var dataName = node.getDataName();
  if (dataName) {
    this.map_[dataName] = node;
    this.indexMap_[dataName] = this.list_.length - 1;
  }
};
goog.ds.BasicNodeList.prototype.get = function(key) {
  return this.map_[key] || null;
};
goog.ds.BasicNodeList.prototype.getByIndex = function(index) {
  return this.list_[index] || null;
};
goog.ds.BasicNodeList.prototype.getCount = function() {
  return this.list_.length;
};
goog.ds.BasicNodeList.prototype.setNode = function(name, node) {
  if (node == null) {
    this.removeNode(name);
  } else {
    var existingNode = this.indexMap_[name];
    if (existingNode != null) {
      this.map_[name] = node;
      this.list_[existingNode] = node;
    } else {
      this.add(node);
    }
  }
};
goog.ds.BasicNodeList.prototype.removeNode = function(name) {
  var existingNode = this.indexMap_[name];
  if (existingNode != null) {
    this.list_.splice(existingNode, 1);
    delete this.map_[name];
    delete this.indexMap_[name];
    for (var index in this.indexMap_) {
      if (this.indexMap_[index] > existingNode) {
        this.indexMap_[index]--;
      }
    }
  }
  return existingNode != null;
};
goog.ds.BasicNodeList.prototype.indexOf = function(name) {
  return this.indexMap_[name];
};
goog.ds.EmptyNodeList = function() {
  goog.ds.BasicNodeList.call(this);
};
goog.inherits(goog.ds.EmptyNodeList, goog.ds.BasicNodeList);
goog.ds.EmptyNodeList.prototype.add = function(node) {
  throw Error("Can't add to EmptyNodeList");
};
goog.ds.SortedNodeList = function(compareFn, opt_nodes) {
  this.compareFn_ = compareFn;
  goog.ds.BasicNodeList.call(this, opt_nodes);
};
goog.inherits(goog.ds.SortedNodeList, goog.ds.BasicNodeList);
goog.ds.SortedNodeList.prototype.add = function(node) {
  if (!this.compareFn_) {
    this.append(node);
    return;
  }
  var searchLoc = goog.array.binarySearch(this.list_, node, this.compareFn_);
  if (searchLoc < 0) {
    searchLoc = -(searchLoc + 1);
  }
  for (var index in this.indexMap_) {
    if (this.indexMap_[index] >= searchLoc) {
      this.indexMap_[index]++;
    }
  }
  goog.array.insertAt(this.list_, node, searchLoc);
  var dataName = node.getDataName();
  if (dataName) {
    this.map_[dataName] = node;
    this.indexMap_[dataName] = searchLoc;
  }
};
goog.ds.SortedNodeList.prototype.append = function(node) {
  goog.ds.SortedNodeList.superClass_.add.call(this, node);
};
goog.ds.SortedNodeList.prototype.setNode = function(name, node) {
  if (node == null) {
    this.removeNode(name);
  } else {
    var existingNode = this.indexMap_[name];
    if (existingNode != null) {
      if (this.compareFn_) {
        var compareResult = this.compareFn_(this.list_[existingNode], node);
        if (compareResult == 0) {
          this.map_[name] = node;
          this.list_[existingNode] = node;
        } else {
          this.removeNode(name);
          this.add(node);
        }
      }
    } else {
      this.add(node);
    }
  }
};
goog.ds.STR_ATTRIBUTE_START = "@";
goog.ds.STR_ALL_CHILDREN_SELECTOR = "*";
goog.ds.STR_WILDCARD = "*";
goog.ds.STR_PATH_SEPARATOR = "/";
goog.ds.STR_ARRAY_START = "[";
goog.ds.logger = goog.log.getLogger("goog.ds");
goog.ds.Util.makeReferenceNode = function(node, name) {
  var nodeCreator = function() {
  };
  nodeCreator.prototype = node;
  var newNode = new nodeCreator;
  newNode.getDataName = function() {
    return name;
  };
  return newNode;
};
goog.provide("goog.dom.xml");
goog.require("goog.dom");
goog.require("goog.dom.NodeType");
goog.dom.xml.MAX_XML_SIZE_KB = 2 * 1024;
goog.dom.xml.MAX_ELEMENT_DEPTH = 256;
goog.dom.xml.createDocument = function(opt_rootTagName, opt_namespaceUri) {
  if (opt_namespaceUri && !opt_rootTagName) {
    throw Error("Can't create document with namespace and no root tag");
  }
  if (document.implementation && document.implementation.createDocument) {
    return document.implementation.createDocument(opt_namespaceUri || "", opt_rootTagName || "", null);
  } else {
    if (typeof ActiveXObject != "undefined") {
      var doc = goog.dom.xml.createMsXmlDocument_();
      if (doc) {
        if (opt_rootTagName) {
          doc.appendChild(doc.createNode(goog.dom.NodeType.ELEMENT, opt_rootTagName, opt_namespaceUri || ""));
        }
        return doc;
      }
    }
  }
  throw Error("Your browser does not support creating new documents");
};
goog.dom.xml.loadXml = function(xml) {
  if (typeof DOMParser != "undefined") {
    return(new DOMParser).parseFromString(xml, "application/xml");
  } else {
    if (typeof ActiveXObject != "undefined") {
      var doc = goog.dom.xml.createMsXmlDocument_();
      doc.loadXML(xml);
      return doc;
    }
  }
  throw Error("Your browser does not support loading xml documents");
};
goog.dom.xml.serialize = function(xml) {
  if (typeof XMLSerializer != "undefined") {
    return(new XMLSerializer).serializeToString(xml);
  }
  var text = xml.xml;
  if (text) {
    return text;
  }
  throw Error("Your browser does not support serializing XML documents");
};
goog.dom.xml.selectSingleNode = function(node, path) {
  if (typeof node.selectSingleNode != "undefined") {
    var doc = goog.dom.getOwnerDocument(node);
    if (typeof doc.setProperty != "undefined") {
      doc.setProperty("SelectionLanguage", "XPath");
    }
    return node.selectSingleNode(path);
  } else {
    if (document.implementation.hasFeature("XPath", "3.0")) {
      var doc = goog.dom.getOwnerDocument(node);
      var resolver = doc.createNSResolver(doc.documentElement);
      var result = doc.evaluate(path, node, resolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return result.singleNodeValue;
    }
  }
  return null;
};
goog.dom.xml.selectNodes = function(node, path) {
  if (typeof node.selectNodes != "undefined") {
    var doc = goog.dom.getOwnerDocument(node);
    if (typeof doc.setProperty != "undefined") {
      doc.setProperty("SelectionLanguage", "XPath");
    }
    return node.selectNodes(path);
  } else {
    if (document.implementation.hasFeature("XPath", "3.0")) {
      var doc = goog.dom.getOwnerDocument(node);
      var resolver = doc.createNSResolver(doc.documentElement);
      var nodes = doc.evaluate(path, node, resolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var results = [];
      var count = nodes.snapshotLength;
      for (var i = 0;i < count;i++) {
        results.push(nodes.snapshotItem(i));
      }
      return results;
    } else {
      return[];
    }
  }
};
goog.dom.xml.setAttributes = function(element, attributes) {
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      element.setAttribute(key, attributes[key]);
    }
  }
};
goog.dom.xml.createMsXmlDocument_ = function() {
  var doc = new ActiveXObject("MSXML2.DOMDocument");
  if (doc) {
    doc.resolveExternals = false;
    doc.validateOnParse = false;
    try {
      doc.setProperty("ProhibitDTD", true);
      doc.setProperty("MaxXMLSize", goog.dom.xml.MAX_XML_SIZE_KB);
      doc.setProperty("MaxElementDepth", goog.dom.xml.MAX_ELEMENT_DEPTH);
    } catch (e) {
    }
  }
  return doc;
};
goog.provide("goog.ds.Expr");
goog.require("goog.ds.BasicNodeList");
goog.require("goog.ds.EmptyNodeList");
goog.require("goog.string");
goog.ds.Expr = function(opt_expr) {
  if (opt_expr) {
    this.setSource_(opt_expr);
  }
};
goog.ds.Expr.prototype.setSource_ = function(expr, opt_parts, opt_childExpr, opt_prevExpr) {
  this.src_ = expr;
  if (!opt_childExpr && !opt_prevExpr) {
    if (goog.string.endsWith(expr, goog.ds.Expr.String_.CAN_BE_EMPTY)) {
      this.canBeEmpty_ = true;
      expr = expr.substring(0, expr.length - 1);
    }
    if (goog.string.endsWith(expr, "()")) {
      if (goog.string.endsWith(expr, goog.ds.Expr.String_.NAME_EXPR) || goog.string.endsWith(expr, goog.ds.Expr.String_.COUNT_EXPR) || goog.string.endsWith(expr, goog.ds.Expr.String_.POSITION_EXPR)) {
        var lastPos = expr.lastIndexOf(goog.ds.Expr.String_.SEPARATOR);
        if (lastPos != -1) {
          this.exprFn_ = expr.substring(lastPos + 1);
          expr = expr.substring(0, lastPos);
        } else {
          this.exprFn_ = expr;
          expr = goog.ds.Expr.String_.CURRENT_NODE_EXPR;
        }
        if (this.exprFn_ == goog.ds.Expr.String_.COUNT_EXPR) {
          this.isCount_ = true;
        }
      }
    }
  }
  this.parts_ = opt_parts || expr.split("/");
  this.size_ = this.parts_.length;
  this.last_ = this.parts_[this.size_ - 1];
  this.root_ = this.parts_[0];
  if (this.size_ == 1) {
    this.rootExpr_ = this;
    this.isAbsolute_ = goog.string.startsWith(expr, "$");
  } else {
    this.rootExpr_ = goog.ds.Expr.createInternal_(this.root_, null, this, null);
    this.isAbsolute_ = this.rootExpr_.isAbsolute_;
    this.root_ = this.rootExpr_.root_;
  }
  if (this.size_ == 1 && !this.isAbsolute_) {
    this.isCurrent_ = expr == goog.ds.Expr.String_.CURRENT_NODE_EXPR || expr == goog.ds.Expr.String_.EMPTY_EXPR;
    this.isJustAttribute_ = goog.string.startsWith(expr, goog.ds.Expr.String_.ATTRIBUTE_START);
    this.isAllChildNodes_ = expr == goog.ds.Expr.String_.ALL_CHILD_NODES_EXPR;
    this.isAllAttributes_ = expr == goog.ds.Expr.String_.ALL_ATTRIBUTES_EXPR;
    this.isAllElements_ = expr == goog.ds.Expr.String_.ALL_ELEMENTS_EXPR;
  }
};
goog.ds.Expr.prototype.getSource = function() {
  return this.src_;
};
goog.ds.Expr.prototype.getLast = function() {
  return this.last_;
};
goog.ds.Expr.prototype.getParent = function() {
  if (!this.parentExprSet_) {
    if (this.size_ > 1) {
      this.parentExpr_ = goog.ds.Expr.createInternal_(null, this.parts_.slice(0, this.parts_.length - 1), this, null);
    }
    this.parentExprSet_ = true;
  }
  return this.parentExpr_;
};
goog.ds.Expr.prototype.getNext = function() {
  if (!this.nextExprSet_) {
    if (this.size_ > 1) {
      this.nextExpr_ = goog.ds.Expr.createInternal_(null, this.parts_.slice(1), null, this);
    }
    this.nextExprSet_ = true;
  }
  return this.nextExpr_;
};
goog.ds.Expr.prototype.getValue = function(opt_ds) {
  if (opt_ds == null) {
    opt_ds = goog.ds.DataManager.getInstance();
  } else {
    if (this.isAbsolute_) {
      opt_ds = opt_ds.getDataRoot ? opt_ds.getDataRoot() : goog.ds.DataManager.getInstance();
    }
  }
  if (this.isCount_) {
    var nodes = this.getNodes(opt_ds);
    return nodes.getCount();
  }
  if (this.size_ == 1) {
    return opt_ds.getChildNodeValue(this.root_);
  } else {
    if (this.size_ == 0) {
      return opt_ds.get();
    }
  }
  var nextDs = opt_ds.getChildNode(this.root_);
  if (nextDs == null) {
    return null;
  } else {
    return this.getNext().getValue(nextDs);
  }
};
goog.ds.Expr.prototype.getNodes = function(opt_ds, opt_canCreate) {
  return(this.getNodes_(opt_ds, false, opt_canCreate));
};
goog.ds.Expr.prototype.getNode = function(opt_ds, opt_canCreate) {
  return(this.getNodes_(opt_ds, true, opt_canCreate));
};
goog.ds.Expr.prototype.getNodes_ = function(opt_ds, opt_selectOne, opt_canCreate) {
  if (opt_ds == null) {
    opt_ds = goog.ds.DataManager.getInstance();
  } else {
    if (this.isAbsolute_) {
      opt_ds = opt_ds.getDataRoot ? opt_ds.getDataRoot() : goog.ds.DataManager.getInstance();
    }
  }
  if (this.size_ == 0 && opt_selectOne) {
    return opt_ds;
  } else {
    if (this.size_ == 0 && !opt_selectOne) {
      return new goog.ds.BasicNodeList([opt_ds]);
    } else {
      if (this.size_ == 1) {
        if (opt_selectOne) {
          return opt_ds.getChildNode(this.root_, opt_canCreate);
        } else {
          var possibleListChild = opt_ds.getChildNode(this.root_);
          if (possibleListChild && possibleListChild.isList()) {
            return possibleListChild.getChildNodes();
          } else {
            return opt_ds.getChildNodes(this.root_);
          }
        }
      } else {
        var nextDs = opt_ds.getChildNode(this.root_, opt_canCreate);
        if (nextDs == null && opt_selectOne) {
          return null;
        } else {
          if (nextDs == null && !opt_selectOne) {
            return new goog.ds.EmptyNodeList;
          }
        }
        return this.getNext().getNodes_(nextDs, opt_selectOne, opt_canCreate);
      }
    }
  }
};
goog.ds.Expr.prototype.canBeEmpty_ = false;
goog.ds.Expr.prototype.parts_ = [];
goog.ds.Expr.prototype.size_ = null;
goog.ds.Expr.prototype.root_;
goog.ds.Expr.prototype.last_ = null;
goog.ds.Expr.prototype.isCurrent_ = false;
goog.ds.Expr.prototype.isJustAttribute_ = false;
goog.ds.Expr.prototype.isAllChildNodes_ = false;
goog.ds.Expr.prototype.isAllAttributes_ = false;
goog.ds.Expr.prototype.isAllElements_ = false;
goog.ds.Expr.prototype.exprFn_ = null;
goog.ds.Expr.prototype.parentExpr_ = null;
goog.ds.Expr.prototype.nextExpr_ = null;
goog.ds.Expr.create = function(expr) {
  var result = goog.ds.Expr.cache_[expr];
  if (result == null) {
    result = new goog.ds.Expr(expr);
    goog.ds.Expr.cache_[expr] = result;
  }
  return result;
};
goog.ds.Expr.createInternal_ = function(opt_expr, opt_parts, opt_childExpr, opt_prevExpr) {
  var expr = opt_expr || opt_parts.join("/");
  var result = goog.ds.Expr.cache_[expr];
  if (result == null) {
    result = new goog.ds.Expr;
    result.setSource_(expr, opt_parts, opt_childExpr, opt_prevExpr);
    goog.ds.Expr.cache_[expr] = result;
  }
  return result;
};
goog.ds.Expr.cache_ = {};
goog.ds.Expr.String_ = {SEPARATOR:"/", CURRENT_NODE_EXPR:".", EMPTY_EXPR:"", ATTRIBUTE_START:"@", ALL_CHILD_NODES_EXPR:"*|text()", ALL_ATTRIBUTES_EXPR:"@*", ALL_ELEMENTS_EXPR:"*", NAME_EXPR:"name()", COUNT_EXPR:"count()", POSITION_EXPR:"position()", INDEX_START:"[", INDEX_END:"]", CAN_BE_EMPTY:"?"};
goog.ds.Expr.CURRENT = goog.ds.Expr.create(goog.ds.Expr.String_.CURRENT_NODE_EXPR);
goog.ds.Expr.ALL_CHILD_NODES = goog.ds.Expr.create(goog.ds.Expr.String_.ALL_CHILD_NODES_EXPR);
goog.ds.Expr.ALL_ELEMENTS = goog.ds.Expr.create(goog.ds.Expr.String_.ALL_ELEMENTS_EXPR);
goog.ds.Expr.ALL_ATTRIBUTES = goog.ds.Expr.create(goog.ds.Expr.String_.ALL_ATTRIBUTES_EXPR);
goog.ds.Expr.NAME = goog.ds.Expr.create(goog.ds.Expr.String_.NAME_EXPR);
goog.ds.Expr.COUNT = goog.ds.Expr.create(goog.ds.Expr.String_.COUNT_EXPR);
goog.ds.Expr.POSITION = goog.ds.Expr.create(goog.ds.Expr.String_.POSITION_EXPR);
goog.provide("goog.ds.DataManager");
goog.require("goog.ds.BasicNodeList");
goog.require("goog.ds.DataNode");
goog.require("goog.ds.Expr");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.ds.DataManager = function() {
  this.dataSources_ = new goog.ds.BasicNodeList;
  this.autoloads_ = new goog.structs.Map;
  this.listenerMap_ = {};
  this.listenersByFunction_ = {};
  this.aliases_ = {};
  this.eventCount_ = 0;
  this.indexedListenersByFunction_ = {};
};
goog.ds.DataManager.instance_ = null;
goog.inherits(goog.ds.DataManager, goog.ds.DataNode);
goog.ds.DataManager.getInstance = function() {
  if (!goog.ds.DataManager.instance_) {
    goog.ds.DataManager.instance_ = new goog.ds.DataManager;
  }
  return goog.ds.DataManager.instance_;
};
goog.ds.DataManager.clearInstance = function() {
  goog.ds.DataManager.instance_ = null;
};
goog.ds.DataManager.prototype.addDataSource = function(ds, opt_autoload, opt_name) {
  var autoload = !!opt_autoload;
  var name = opt_name || ds.getDataName();
  if (!goog.string.startsWith(name, "$")) {
    name = "$" + name;
  }
  ds.setDataName(name);
  this.dataSources_.add(ds);
  this.autoloads_.set(name, autoload);
};
goog.ds.DataManager.prototype.aliasDataSource = function(name, dataPath) {
  if (!this.aliasListener_) {
    this.aliasListener_ = goog.bind(this.listenForAlias_, this);
  }
  if (this.aliases_[name]) {
    var oldPath = this.aliases_[name].getSource();
    this.removeListeners(this.aliasListener_, oldPath + "/...", name);
  }
  this.aliases_[name] = goog.ds.Expr.create(dataPath);
  this.addListener(this.aliasListener_, dataPath + "/...", name);
  this.fireDataChange(name);
};
goog.ds.DataManager.prototype.listenForAlias_ = function(dataPath, name) {
  var aliasedExpr = this.aliases_[name];
  if (aliasedExpr) {
    var aliasedPath = aliasedExpr.getSource();
    if (dataPath.indexOf(aliasedPath) == 0) {
      this.fireDataChange(name + dataPath.substring(aliasedPath.length));
    } else {
      this.fireDataChange(name);
    }
  }
};
goog.ds.DataManager.prototype.getDataSource = function(name) {
  if (this.aliases_[name]) {
    return this.aliases_[name].getNode();
  } else {
    return this.dataSources_.get(name);
  }
};
goog.ds.DataManager.prototype.get = function() {
  return this.dataSources_;
};
goog.ds.DataManager.prototype.set = function(value) {
  throw Error("Can't set on DataManager");
};
goog.ds.DataManager.prototype.getChildNodes = function(opt_selector) {
  if (opt_selector) {
    return new goog.ds.BasicNodeList([this.getChildNode((opt_selector))]);
  } else {
    return this.dataSources_;
  }
};
goog.ds.DataManager.prototype.getChildNode = function(name) {
  return this.getDataSource(name);
};
goog.ds.DataManager.prototype.getChildNodeValue = function(name) {
  var ds = this.getDataSource(name);
  return ds ? ds.get() : null;
};
goog.ds.DataManager.prototype.getDataName = function() {
  return "";
};
goog.ds.DataManager.prototype.getDataPath = function() {
  return "";
};
goog.ds.DataManager.prototype.load = function() {
  var len = this.dataSources_.getCount();
  for (var i = 0;i < len;i++) {
    var ds = this.dataSources_.getByIndex(i);
    var autoload = this.autoloads_.get(ds.getDataName());
    if (autoload) {
      ds.load();
    }
  }
};
goog.ds.DataManager.prototype.getLoadState = goog.abstractMethod;
goog.ds.DataManager.prototype.isList = function() {
  return false;
};
goog.ds.DataManager.prototype.getEventCount = function() {
  return this.eventCount_;
};
goog.ds.DataManager.prototype.addListener = function(fn, dataPath, opt_id) {
  var maxAncestors = 0;
  if (goog.string.endsWith(dataPath, "/...")) {
    maxAncestors = 1E3;
    dataPath = dataPath.substring(0, dataPath.length - 4);
  } else {
    if (goog.string.endsWith(dataPath, "/*")) {
      maxAncestors = 1;
      dataPath = dataPath.substring(0, dataPath.length - 2);
    }
  }
  opt_id = opt_id || "";
  var key = dataPath + ":" + opt_id + ":" + goog.getUid(fn);
  var listener = {dataPath:dataPath, id:opt_id, fn:fn};
  var expr = goog.ds.Expr.create(dataPath);
  var fnUid = goog.getUid(fn);
  if (!this.listenersByFunction_[fnUid]) {
    this.listenersByFunction_[fnUid] = {};
  }
  this.listenersByFunction_[fnUid][key] = {listener:listener, items:[]};
  while (expr) {
    var listenerSpec = {listener:listener, maxAncestors:maxAncestors};
    var matchingListeners = this.listenerMap_[expr.getSource()];
    if (matchingListeners == null) {
      matchingListeners = {};
      this.listenerMap_[expr.getSource()] = matchingListeners;
    }
    matchingListeners[key] = listenerSpec;
    maxAncestors = 0;
    expr = expr.getParent();
    this.listenersByFunction_[fnUid][key].items.push({key:key, obj:matchingListeners});
  }
};
goog.ds.DataManager.prototype.addIndexedListener = function(fn, dataPath, opt_id) {
  var firstStarPos = dataPath.indexOf("*");
  if (firstStarPos == -1) {
    this.addListener(fn, dataPath, opt_id);
    return;
  }
  var listenPath = dataPath.substring(0, firstStarPos) + "...";
  var ext = "$";
  if (goog.string.endsWith(dataPath, "/...")) {
    dataPath = dataPath.substring(0, dataPath.length - 4);
    ext = "";
  }
  var regExpPath = goog.string.regExpEscape(dataPath);
  var matchRegExp = regExpPath.replace(/\\\*/g, "([^\\/]+)") + ext;
  var matchRegExpRe = new RegExp(matchRegExp);
  var matcher = function(path, id) {
    var match = matchRegExpRe.exec(path);
    if (match) {
      match.shift();
      fn(path, opt_id, match);
    }
  };
  this.addListener(matcher, listenPath, opt_id);
  var fnUid = goog.getUid(fn);
  if (!this.indexedListenersByFunction_[fnUid]) {
    this.indexedListenersByFunction_[fnUid] = {};
  }
  var key = dataPath + ":" + opt_id;
  this.indexedListenersByFunction_[fnUid][key] = {listener:{dataPath:listenPath, fn:matcher, id:opt_id}};
};
goog.ds.DataManager.prototype.removeIndexedListeners = function(fn, opt_dataPath, opt_id) {
  this.removeListenersByFunction_(this.indexedListenersByFunction_, true, fn, opt_dataPath, opt_id);
};
goog.ds.DataManager.prototype.removeListeners = function(fn, opt_dataPath, opt_id) {
  if (opt_dataPath && goog.string.endsWith(opt_dataPath, "/...")) {
    opt_dataPath = opt_dataPath.substring(0, opt_dataPath.length - 4);
  } else {
    if (opt_dataPath && goog.string.endsWith(opt_dataPath, "/*")) {
      opt_dataPath = opt_dataPath.substring(0, opt_dataPath.length - 2);
    }
  }
  this.removeListenersByFunction_(this.listenersByFunction_, false, fn, opt_dataPath, opt_id);
};
goog.ds.DataManager.prototype.removeListenersByFunction_ = function(listenersByFunction, indexed, fn, opt_dataPath, opt_id) {
  var fnUid = goog.getUid(fn);
  var functionMatches = listenersByFunction[fnUid];
  if (functionMatches != null) {
    for (var key in functionMatches) {
      var functionMatch = functionMatches[key];
      var listener = functionMatch.listener;
      if ((!opt_dataPath || opt_dataPath == listener.dataPath) && (!opt_id || opt_id == listener.id)) {
        if (indexed) {
          this.removeListeners(listener.fn, listener.dataPath, listener.id);
        }
        if (functionMatch.items) {
          for (var i = 0;i < functionMatch.items.length;i++) {
            var item = functionMatch.items[i];
            delete item.obj[item.key];
          }
        }
        delete functionMatches[key];
      }
    }
  }
};
goog.ds.DataManager.prototype.getListenerCount = function() {
  var count = 0;
  goog.object.forEach(this.listenerMap_, function(matchingListeners) {
    count += goog.structs.getCount(matchingListeners);
  });
  return count;
};
goog.ds.DataManager.prototype.runWithoutFiringDataChanges = function(callback) {
  if (this.disableFiring_) {
    throw Error("Can not nest calls to runWithoutFiringDataChanges");
  }
  this.disableFiring_ = true;
  try {
    callback();
  } finally {
    this.disableFiring_ = false;
  }
};
goog.ds.DataManager.prototype.fireDataChange = function(dataPath) {
  if (this.disableFiring_) {
    return;
  }
  var expr = goog.ds.Expr.create(dataPath);
  var ancestorDepth = 0;
  while (expr) {
    var matchingListeners = this.listenerMap_[expr.getSource()];
    if (matchingListeners) {
      for (var id in matchingListeners) {
        var match = matchingListeners[id];
        var listener = match.listener;
        if (ancestorDepth <= match.maxAncestors) {
          listener.fn(dataPath, listener.id);
        }
      }
    }
    ancestorDepth++;
    expr = expr.getParent();
  }
  this.eventCount_++;
};
goog.provide("goog.ds.XmlDataSource");
goog.provide("goog.ds.XmlHttpDataSource");
goog.require("goog.Uri");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.xml");
goog.require("goog.ds.BasicNodeList");
goog.require("goog.ds.DataManager");
goog.require("goog.ds.DataNode");
goog.require("goog.ds.LoadState");
goog.require("goog.ds.logger");
goog.require("goog.net.XhrIo");
goog.require("goog.string");
goog.ds.XmlDataSource = function(node, parent, opt_name) {
  this.parent_ = parent;
  this.dataName_ = opt_name || (node ? node.nodeName : "");
  this.setNode_(node);
};
goog.ds.XmlDataSource.ATTRIBUTE_SELECTOR_ = "@*";
goog.ds.XmlDataSource.prototype.setNode_ = function(node) {
  this.node_ = node;
  if (node != null) {
    switch(node.nodeType) {
      case goog.dom.NodeType.ATTRIBUTE:
      ;
      case goog.dom.NodeType.TEXT:
        this.value_ = node.nodeValue;
        break;
      case goog.dom.NodeType.ELEMENT:
        if (node.childNodes.length == 1 && node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
          this.value_ = node.firstChild.nodeValue;
        }
      ;
    }
  }
};
goog.ds.XmlDataSource.prototype.createChildNodes_ = function() {
  if (this.childNodeList_) {
    return;
  }
  var childNodeList = new goog.ds.BasicNodeList;
  if (this.node_ != null) {
    var childNodes = this.node_.childNodes;
    for (var i = 0, childNode;childNode = childNodes[i];i++) {
      if (childNode.nodeType != goog.dom.NodeType.TEXT || !goog.ds.XmlDataSource.isEmptyTextNodeValue_(childNode.nodeValue)) {
        var newNode = new goog.ds.XmlDataSource(childNode, this, childNode.nodeName);
        childNodeList.add(newNode);
      }
    }
  }
  this.childNodeList_ = childNodeList;
};
goog.ds.XmlDataSource.prototype.createAttributes_ = function() {
  if (this.attributes_) {
    return;
  }
  var attributes = new goog.ds.BasicNodeList;
  if (this.node_ != null && this.node_.attributes != null) {
    var atts = this.node_.attributes;
    for (var i = 0, att;att = atts[i];i++) {
      var newNode = new goog.ds.XmlDataSource(att, this, att.nodeName);
      attributes.add(newNode);
    }
  }
  this.attributes_ = attributes;
};
goog.ds.XmlDataSource.prototype.get = function() {
  this.createChildNodes_();
  return this.value_;
};
goog.ds.XmlDataSource.prototype.set = function(value) {
  throw Error("Can't set on XmlDataSource yet");
};
goog.ds.XmlDataSource.prototype.getChildNodes = function(opt_selector) {
  if (opt_selector && opt_selector == goog.ds.XmlDataSource.ATTRIBUTE_SELECTOR_) {
    this.createAttributes_();
    return this.attributes_;
  } else {
    if (opt_selector == null || opt_selector == goog.ds.STR_ALL_CHILDREN_SELECTOR) {
      this.createChildNodes_();
      return this.childNodeList_;
    } else {
      throw Error("Unsupported selector");
    }
  }
};
goog.ds.XmlDataSource.prototype.getChildNode = function(name) {
  if (goog.string.startsWith(name, goog.ds.STR_ATTRIBUTE_START)) {
    var att = this.node_.getAttributeNode(name.substring(1));
    return att ? new goog.ds.XmlDataSource(att, this) : null;
  } else {
    return(this.getChildNodes().get(name));
  }
};
goog.ds.XmlDataSource.prototype.getChildNodeValue = function(name) {
  if (goog.string.startsWith(name, goog.ds.STR_ATTRIBUTE_START)) {
    var node = this.node_.getAttributeNode(name.substring(1));
    return node ? node.nodeValue : null;
  } else {
    var node = this.getChildNode(name);
    return node ? node.get() : null;
  }
};
goog.ds.XmlDataSource.prototype.getDataName = function() {
  return this.dataName_;
};
goog.ds.XmlDataSource.prototype.setDataName = function(name) {
  this.dataName_ = name;
};
goog.ds.XmlDataSource.prototype.getDataPath = function() {
  var parentPath = "";
  if (this.parent_) {
    parentPath = this.parent_.getDataPath() + (this.dataName_.indexOf(goog.ds.STR_ARRAY_START) != -1 ? "" : goog.ds.STR_PATH_SEPARATOR);
  }
  return parentPath + this.dataName_;
};
goog.ds.XmlDataSource.prototype.load = function() {
};
goog.ds.XmlDataSource.prototype.getLoadState = function() {
  return this.node_ ? goog.ds.LoadState.LOADED : goog.ds.LoadState.NOT_LOADED;
};
goog.ds.XmlDataSource.isEmptyTextNodeValue_ = function(str) {
  return/^[\r\n\t ]*$/.test(str);
};
goog.ds.XmlDataSource.createChildlessDocument_ = function() {
  return goog.dom.xml.createDocument("nothing");
};
goog.ds.XmlHttpDataSource = function(uri, name) {
  goog.ds.XmlDataSource.call(this, null, null, name);
  if (uri) {
    this.uri_ = new goog.Uri(uri);
  } else {
    this.uri_ = null;
  }
};
goog.inherits(goog.ds.XmlHttpDataSource, goog.ds.XmlDataSource);
goog.ds.XmlHttpDataSource.prototype.loadState_ = goog.ds.LoadState.NOT_LOADED;
goog.ds.XmlHttpDataSource.prototype.load = function() {
  if (this.uri_) {
    goog.log.info(goog.ds.logger, "Sending XML request for DataSource " + this.getDataName() + " to " + this.uri_);
    this.loadState_ = goog.ds.LoadState.LOADING;
    goog.net.XhrIo.send(this.uri_, goog.bind(this.complete_, this));
  } else {
    this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();
    this.loadState_ = goog.ds.LoadState.NOT_LOADED;
  }
};
goog.ds.XmlHttpDataSource.prototype.getLoadState = function() {
  return this.loadState_;
};
goog.ds.XmlHttpDataSource.prototype.complete_ = function(e) {
  var xhr = (e.target);
  if (xhr && xhr.isSuccess()) {
    this.success_(xhr);
  } else {
    this.failure_();
  }
};
goog.ds.XmlHttpDataSource.prototype.success_ = function(xhr) {
  goog.log.info(goog.ds.logger, "Got data for DataSource " + this.getDataName());
  var xml = xhr.getResponseXml();
  if (xml && !xml.hasChildNodes() && goog.isObject(xhr.getResponseText())) {
    xml = goog.dom.xml.loadXml(xhr.getResponseText());
  }
  if (!xml || !xml.hasChildNodes()) {
    this.loadState_ = goog.ds.LoadState.FAILED;
    this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();
  } else {
    this.loadState_ = goog.ds.LoadState.LOADED;
    this.node_ = xml.documentElement;
  }
  if (this.getDataName()) {
    goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
  }
};
goog.ds.XmlHttpDataSource.prototype.failure_ = function() {
  goog.log.info(goog.ds.logger, "Data retrieve failed for DataSource " + this.getDataName());
  this.loadState_ = goog.ds.LoadState.FAILED;
  this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();
  if (this.getDataName()) {
    goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
  }
};
goog.provide("chatango.embed.LocalCommParent");
goog.require("chatango.embed.LocalComm");
goog.require("chatango.embed.LocalCommEvent");
goog.require("chatango.managers.Environment");
goog.require("goog.debug.Logger");
chatango.embed.LocalCommParent = function() {
  chatango.embed.LocalComm.call(this);
};
goog.addSingletonGetter(chatango.embed.LocalCommParent);
goog.inherits(chatango.embed.LocalCommParent, chatango.embed.LocalComm);
chatango.embed.LocalCommParent.prototype.logger = goog.debug.Logger.getLogger("chatango.embed.LocalCommParent");
chatango.embed.LocalCommParent.prototype.setUp = function(dest, id, fid, emb) {
  chatango.embed.LocalCommParent.superClass_.setUp.call(this, dest);
  this.cid_ = id;
  this.fid_ = fid;
  this.emb_ = emb;
};
chatango.embed.LocalCommParent.prototype.synRcvd_ = function() {
  if (!this.connected_) {
    var msg = new Object;
    msg["fid"] = this.fid_;
    msg["cid"] = this.cid_;
    msg["height"] = this.emb_.fullHeight;
    msg["width"] = this.emb_.fullWidth;
    msg["loc"] = this.emb_.getEmbedLoc();
    msg["window"] = {"width":window.innerWidth, "height":window.innerHeight};
    msg["handle"] = this.emb_.getLegacyHandle();
    msg["styles"] = this.emb_.getLegacyStyles();
    msg["expandedButton"] = this.emb_.getExpandedButton();
    if (chatango.DEBUG) {
      this.logger.info("syn received, sending cid " + this.cid_ + " to a child");
    }
    this.send("cid", msg);
  }
};
chatango.embed.LocalCommParent.prototype.buttonCollapsedRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("buttoncollapsed"));
};
chatango.embed.LocalCommParent.prototype.ackRcvd_ = function(fid) {
  if (chatango.DEBUG) {
    this.logger.info("ackRcvd for " + fid);
  }
  if (fid != this.fid_) {
    return;
  }
  if (chatango.DEBUG) {
    this.logger.info("connection established for cid " + this.fid_);
  }
  this.connected_ = true;
  this.dispatchEvent(new chatango.embed.LocalCommEvent("connestablished"));
};
chatango.embed.LocalCommParent.prototype.keyboardUpRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("kbup"));
};
chatango.embed.LocalCommParent.prototype.keyboardDownRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("kbdown"));
};
chatango.embed.LocalCommParent.prototype.buttonExpandedRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("buttonexpanded"));
};
chatango.embed.LocalCommParent.prototype.resizeIFrameRcvd_ = function(sz) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("resizeiframe", sz));
};
chatango.embed.LocalComm.prototype.enableResizeDragger_ = function(enable) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("enableresizedragger", enable));
};
chatango.embed.LocalCommParent.prototype.setUserScalableRcvd_ = function(action) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("setuserscalable", action));
};
chatango.embed.LocalCommParent.prototype.viewportTooBigRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("viewporttoobig"));
};
chatango.embed.LocalCommParent.prototype.browserViewRequestRcvd_ = function() {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("browserviewrequest"));
};
chatango.embed.LocalCommParent.prototype.setTitleRcvd_ = function(title) {
  this.dispatchEvent(new chatango.embed.LocalCommEvent("settitle", title));
};
chatango.embed.LocalCommParent.prototype.sendToApp_ = function(data_obj) {
  if (window["android"] !== undefined && window["android"]["sendToApp"] !== undefined) {
    window["android"]["sendToApp"](JSON.stringify(data_obj));
  }
};
goog.provide("chatango.login.LoginRequest");
goog.require("chatango.users.User");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventTarget");
chatango.login.LoginRequest = function(opt_name, opt_password) {
  goog.events.EventTarget.call(this);
  if (typeof opt_name === "undefined") {
    this.type_ = chatango.users.User.UserType.ANON;
  } else {
    if (typeof opt_password === "undefined") {
      this.type_ = chatango.users.User.UserType.TEMP;
      this.name_ = opt_name;
    } else {
      this.type_ = chatango.users.User.UserType.SELLER;
      this.name_ = opt_name;
      this.password_ = opt_password;
    }
  }
};
goog.inherits(chatango.login.LoginRequest, goog.events.EventTarget);
chatango.login.LoginRequest.prototype.logger = goog.debug.Logger.getLogger("chatango.login.LoginRequest");
goog.provide("chatango.login.LoginRequestEvent");
goog.require("chatango.login.LoginRequest");
goog.require("goog.events.Event");
chatango.login.LoginRequestEvent = function(request, opt_target) {
  goog.events.Event.call(this, chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, opt_target);
  this.request_ = request;
};
chatango.login.LoginRequestEvent.EventType = {LOGIN_REQUEST:"loginrequest"};
chatango.login.LoginRequestEvent.prototype.getRequest = function() {
  return this.request_;
};
goog.provide("chatango.events.FileUploadEvent");
goog.require("goog.events.Event");
chatango.events.FileUploadEvent = function() {
  goog.base(this);
};
goog.inherits(chatango.events.FileUploadEvent, goog.events.Event);
chatango.events.FileUploadEvent.EventType = {SUCCESS:"fileuploadsuccess", FAILURE:"fileuploadfailure"};
goog.provide("chatango.ui.icons.SvgToggleIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgToggleIcon = function(opt_color, opt_borderColor, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.setIsOn(false);
  this.borderColor_ = opt_borderColor || this.color_;
};
goog.inherits(chatango.ui.icons.SvgToggleIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgToggleIcon.prototype.createDom = function() {
  chatango.ui.icons.SvgToggleIcon.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, "icon-toggle");
};
chatango.ui.icons.SvgToggleIcon.prototype.isOn_ = false;
chatango.ui.icons.SvgToggleIcon.prototype.setIsOn = function(state) {
  if (this.isOn_ == state) {
    return;
  }
  this.isOn_ = state;
  this.draw();
};
chatango.ui.icons.SvgToggleIcon.prototype.isOn = function() {
  return this.isOn_;
};
chatango.ui.icons.SvgToggleIcon.prototype.toggle = function() {
  this.setIsOn(!this.isOn_);
};
chatango.ui.icons.SvgToggleIcon.prototype.draw = function() {
  if (this.isOn_) {
    goog.style.setStyle(this.element_, "border", "1px solid " + this.borderColor_);
  } else {
    goog.style.setStyle(this.element_, "border", "1px solid rgba(255, 255, 255, 0)");
  }
};
goog.provide("chatango.ui.icons.UploadMediaIcon");
goog.require("chatango.ui.icons.SvgToggleIcon");
chatango.ui.icons.UploadMediaIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.setIsOn(false);
};
goog.inherits(chatango.ui.icons.UploadMediaIcon, chatango.ui.icons.SvgToggleIcon);
chatango.ui.icons.UploadMediaIcon.prototype.draw = function() {
  var crispEdges = ' shape-rendering="crispEdges"';
  var geometricPrecision = ' shape-rendering="geometricPrecision"';
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<g style="display: block;" fill-rule="evenodd">' + '<path fill="' + this.color_ + '" d = "M0,15 L 35 15 45 5 65 5 75 15 100 15 100 90 0 90  Z ' + 'M55,80 a27,27 0 1 1 0.00001 0 Z" stroke="' + this.color_ + '"></path>' + '<path fill="' + this.color_ + '" d = "M55,67 a14,14 0 1 1 0.00001 0 Z" stroke="' + this.color_ + '"></path>';
  svg += "</g></svg>";
  this.element_.innerHTML = svg;
};
goog.provide("chatango.ui.UploadMediaButton");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.Environment");
goog.require("chatango.ui.icons.UploadMediaIcon");
goog.require("chatango.events.FileUploadEvent");
goog.require("chatango.users.UserManager");
goog.require("chatango.login.Session");
goog.require("goog.module.ModuleManager");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.ui.Component");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.module.ModuleManager");
chatango.ui.UploadMediaButton = function(opt_size, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.cameraIcon_ = new chatango.ui.icons.UploadMediaIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.lastUrlUploaded = "";
};
goog.inherits(chatango.ui.UploadMediaButton, goog.ui.Component);
chatango.ui.UploadMediaButton.prototype.logger = goog.debug.Logger.getLogger("chatango.ui.UploadMediaButton");
chatango.ui.UploadMediaButton.prototype.width;
chatango.ui.UploadMediaButton.prototype.height;
chatango.ui.UploadMediaButton.prototype.cameraBtnClicked = function(e) {
  var userType = null;
  if (chatango.users.UserManager.getInstance().currentUser) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  }
  if (this.readyToUpload()) {
    if (chatango.managers.Environment.getInstance().isAndroidApp()) {
      chatango.embed.AppComm.getInstance().alertUpload(this.uploadMediaCallback_, this);
    } else {
      this.fileUpload.click();
    }
  }
};
chatango.ui.UploadMediaButton.prototype.cameraIconClicked = function(e) {
  goog.module.ModuleManager.getInstance().execOnLoad("UploadMediaModule", function() {
    this.getUploadMediaModule_().uploadMedia("img", e.target.files[0]);
  }, this);
};
chatango.ui.UploadMediaButton.prototype.uploadMediaCallback_ = function(num) {
  this.lastUrlAbbreviated = "img" + num;
  this.dispatchEvent(chatango.events.FileUploadEvent.EventType.SUCCESS);
};
chatango.ui.UploadMediaButton.prototype.createDom = function() {
  if (chatango.DEBUG) {
    this.logger.info("Upload Media Button createDom !");
  }
  this.element_ = goog.dom.createDom("div", {"id":"media-upload-wrap", "class":"media-upload-wrap"});
  this.fileUpload = goog.dom.createDom("input", {"type":"file", "accept":"image/*;capture=camera", "style":"display:none;"});
  this.cameraIcon_.render(this.element_);
  goog.dom.append(this.element_, this.fileUpload);
  goog.events.listen(this.cameraIcon_.getElement(), goog.events.EventType.CLICK, this.cameraBtnClicked, undefined, this);
  goog.events.listen(this.fileUpload, "change", this.cameraIconClicked, undefined, this);
};
chatango.ui.UploadMediaButton.prototype.draw = function() {
  this.cameraIcon_.draw();
};
chatango.ui.UploadMediaButton.prototype.getUploadMediaModule_ = function() {
  if (typeof this.uploadMediaModule_ === "undefined") {
    this.uploadMediaModule_ = new chatango.modules.UploadMediaModule;
    goog.events.listen(this.uploadMediaModule_, chatango.events.FileUploadEvent.EventType.SUCCESS, this.fileUploadSuccess, undefined, this);
    goog.events.listen(this.uploadMediaModule_, chatango.events.FileUploadEvent.EventType.FAILURE, this.fileUploadFailure, undefined, this);
  }
  return this.uploadMediaModule_;
};
chatango.ui.UploadMediaButton.prototype.fileUploadSuccess = function(e) {
  this.lastUrlAbbreviated = this.uploadMediaModule_.lastUrlAbbreviated;
  this.dispatchEvent(chatango.events.FileUploadEvent.EventType.SUCCESS);
};
chatango.ui.UploadMediaButton.prototype.fileUploadFailure = function(e) {
  this.dispatchEvent(chatango.events.FileUploadEvent.EventType.FAILURE);
};
chatango.ui.UploadMediaButton.prototype.readyToUpload = function() {
  throw "Must be overridden";
};
chatango.ui.UploadMediaButton.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.uploadMediaModule_) {
    this.uploadMediaModule_.constrainDialogsToScreen(opt_stageRect);
  }
};
goog.provide("chatango.login.SignupRequest");
goog.require("chatango.users.User");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventTarget");
chatango.login.SignupRequest = function(opt_name, opt_password, opt_email) {
  goog.events.EventTarget.call(this);
  this.name_ = opt_name;
  this.password_ = opt_password;
  this.email_ = opt_email;
};
goog.inherits(chatango.login.SignupRequest, goog.events.EventTarget);
chatango.login.SignupRequest.prototype.logger = goog.debug.Logger.getLogger("chatango.login.SignupRequest");
chatango.login.SignupRequest.prototype.getName = function() {
  return this.name_;
};
chatango.login.SignupRequest.prototype.setName = function(n) {
  this.name_ = n;
};
chatango.login.SignupRequest.prototype.getPassword = function() {
  return this.password_;
};
chatango.login.SignupRequest.prototype.setPassword = function(p) {
  this.password_ = p;
};
chatango.login.SignupRequest.prototype.getEmail = function() {
  return this.email_;
};
chatango.login.SignupRequest.prototype.setEmail = function(e) {
  this.email_ = e;
};
goog.provide("chatango.login.SignupRequestEvent");
goog.require("chatango.login.SignupRequest");
goog.require("goog.events.Event");
chatango.login.SignupRequestEvent = function(request, opt_target) {
  goog.events.Event.call(this, chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, opt_target);
  this.request_ = request;
};
chatango.login.SignupRequestEvent.EventType = {SIGNUP_REQUEST:"signuprequest"};
chatango.login.SignupRequestEvent.prototype.getRequest = function() {
  return this.request_;
};
goog.provide("goog.structs.Trie");
goog.require("goog.object");
goog.require("goog.structs");
goog.structs.Trie = function(opt_trie) {
  this.value_ = undefined;
  this.childNodes_ = {};
  if (opt_trie) {
    this.setAll(opt_trie);
  }
};
goog.structs.Trie.prototype.set = function(key, value) {
  this.setOrAdd_(key, value, false);
};
goog.structs.Trie.prototype.add = function(key, value) {
  this.setOrAdd_(key, value, true);
};
goog.structs.Trie.prototype.setOrAdd_ = function(key, value, opt_add) {
  var node = this;
  for (var characterPosition = 0;characterPosition < key.length;characterPosition++) {
    var currentCharacter = key.charAt(characterPosition);
    if (!node.childNodes_[currentCharacter]) {
      node.childNodes_[currentCharacter] = new goog.structs.Trie;
    }
    node = node.childNodes_[currentCharacter];
  }
  if (opt_add && node.value_ !== undefined) {
    throw Error('The collection already contains the key "' + key + '"');
  } else {
    node.value_ = value;
  }
};
goog.structs.Trie.prototype.setAll = function(trie) {
  var keys = goog.structs.getKeys(trie);
  var values = goog.structs.getValues(trie);
  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};
goog.structs.Trie.prototype.getChildNode_ = function(path) {
  var node = this;
  for (var characterPosition = 0;characterPosition < path.length;characterPosition++) {
    var currentCharacter = path.charAt(characterPosition);
    node = node.childNodes_[currentCharacter];
    if (!node) {
      return undefined;
    }
  }
  return node;
};
goog.structs.Trie.prototype.get = function(key) {
  var node = this.getChildNode_(key);
  return node ? node.value_ : undefined;
};
goog.structs.Trie.prototype.getKeyAndPrefixes = function(key, opt_keyStartIndex) {
  var node = this;
  var matches = {};
  var characterPosition = opt_keyStartIndex || 0;
  if (node.value_ !== undefined) {
    matches[characterPosition] = node.value_;
  }
  for (;characterPosition < key.length;characterPosition++) {
    var currentCharacter = key.charAt(characterPosition);
    if (!(currentCharacter in node.childNodes_)) {
      break;
    }
    node = node.childNodes_[currentCharacter];
    if (node.value_ !== undefined) {
      matches[characterPosition] = node.value_;
    }
  }
  return matches;
};
goog.structs.Trie.prototype.getValues = function() {
  var allValues = [];
  this.getValuesInternal_(allValues);
  return allValues;
};
goog.structs.Trie.prototype.getValuesInternal_ = function(allValues) {
  if (this.value_ !== undefined) {
    allValues.push(this.value_);
  }
  for (var childNode in this.childNodes_) {
    this.childNodes_[childNode].getValuesInternal_(allValues);
  }
};
goog.structs.Trie.prototype.getKeys = function(opt_prefix) {
  var allKeys = [];
  if (opt_prefix) {
    var node = this;
    for (var characterPosition = 0;characterPosition < opt_prefix.length;characterPosition++) {
      var currentCharacter = opt_prefix.charAt(characterPosition);
      if (!node.childNodes_[currentCharacter]) {
        return[];
      }
      node = node.childNodes_[currentCharacter];
    }
    node.getKeysInternal_(opt_prefix, allKeys);
  } else {
    this.getKeysInternal_("", allKeys);
  }
  return allKeys;
};
goog.structs.Trie.prototype.getKeysInternal_ = function(keySoFar, allKeys) {
  if (this.value_ !== undefined) {
    allKeys.push(keySoFar);
  }
  for (var childNode in this.childNodes_) {
    this.childNodes_[childNode].getKeysInternal_(keySoFar + childNode, allKeys);
  }
};
goog.structs.Trie.prototype.containsKey = function(key) {
  return this.get(key) !== undefined;
};
goog.structs.Trie.prototype.containsPrefix = function(prefix) {
  if (prefix.length == 0) {
    return!this.isEmpty();
  }
  return!!this.getChildNode_(prefix);
};
goog.structs.Trie.prototype.containsValue = function(value) {
  if (this.value_ === value) {
    return true;
  }
  for (var childNode in this.childNodes_) {
    if (this.childNodes_[childNode].containsValue(value)) {
      return true;
    }
  }
  return false;
};
goog.structs.Trie.prototype.clear = function() {
  this.childNodes_ = {};
  this.value_ = undefined;
};
goog.structs.Trie.prototype.remove = function(key) {
  var node = this;
  var parents = [];
  for (var characterPosition = 0;characterPosition < key.length;characterPosition++) {
    var currentCharacter = key.charAt(characterPosition);
    if (!node.childNodes_[currentCharacter]) {
      throw Error('The collection does not have the key "' + key + '"');
    }
    parents.push([node, currentCharacter]);
    node = node.childNodes_[currentCharacter];
  }
  var oldValue = node.value_;
  delete node.value_;
  while (parents.length > 0) {
    var currentParentAndCharacter = parents.pop();
    var currentParent = currentParentAndCharacter[0];
    var currentCharacter = currentParentAndCharacter[1];
    if (currentParent.childNodes_[currentCharacter].isEmpty()) {
      delete currentParent.childNodes_[currentCharacter];
    } else {
      break;
    }
  }
  return oldValue;
};
goog.structs.Trie.prototype.clone = function() {
  return new goog.structs.Trie(this);
};
goog.structs.Trie.prototype.getCount = function() {
  return goog.structs.getCount(this.getValues());
};
goog.structs.Trie.prototype.isEmpty = function() {
  return this.value_ === undefined && goog.object.isEmpty(this.childNodes_);
};
goog.provide("chatango.networking.EchoConnection");
goog.require("chatango.networking.CommonConnectionEvent");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("goog.Timer");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
goog.require("goog.net.WebSocket");
chatango.networking.EchoConnection = function() {
  if (chatango.DEBUG) {
    this.logger.info("ECHO CONNECTION CONSTRUCTOR");
  }
  goog.base(this);
  this.port_ = 8080;
  this.server_ = "echo.websocket.org";
  var has_ws;
  try {
    has_ws = true;
    this.ws_ = new goog.net.WebSocket(false);
  } catch (e) {
    has_ws = false;
  }
  if (has_ws) {
    goog.events.listen(this.ws_, goog.net.WebSocket.EventType.OPENED, this.onOpen, false, this);
    goog.events.listen(this.ws_, goog.net.WebSocket.EventType.CLOSED, this.onClose, false, this);
    goog.events.listen(this.ws_, goog.net.WebSocket.EventType.ERROR, this.onError, false, this);
    goog.events.listen(this.ws_, goog.net.WebSocket.EventType.MESSAGE, this.dataHandler, false, this);
  }
  goog.events.listen(this, chatango.networking.CommonConnectionEvent.EventType.ok, this.clientAuthenticated, false, this);
};
goog.inherits(chatango.networking.EchoConnection, goog.events.EventTarget);
chatango.networking.EchoConnection.prototype.logger = goog.debug.Logger.getLogger("chatango.networking.EchoConnection");
chatango.networking.EchoConnection.prototype.port_ = null;
chatango.networking.EchoConnection.prototype.server_ = null;
chatango.networking.EchoConnection.prototype.server_prefix_ = null;
chatango.networking.EchoConnection.prototype.ws_ = null;
chatango.networking.EchoConnection.prototype.ping_interval_ = 9E4;
chatango.networking.EchoConnection.prototype.time_out_ = 18E4;
chatango.networking.EchoConnection.prototype.reconnect_interval_ = 15E3;
chatango.networking.EchoConnection.prototype.attempts_ = 0;
chatango.networking.EchoConnection.prototype.got_response_ = false;
chatango.networking.EchoConnection.prototype.client_version_ = "2";
chatango.networking.EchoConnection.prototype.status_ = null;
chatango.networking.EchoConnection.prototype.kicked_off_ = null;
chatango.networking.EchoConnection.prototype.connect = function() {
  if (this.kicked_off_) {
    return;
  }
  var server_url = "ws://" + this.server_;
  if (chatango.DEBUG) {
    this.logger.info("ECHO CONNECTION CONNECT TO: " + server_url);
  }
  this.status_ = chatango.networking.ConnectionStatusEvent.EventType.CONNECTING;
  this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(this.status_));
  try {
    this.ws_.open(server_url);
  } catch (e) {
    if (chatango.DEBUG) {
      this.logger.info("WEB SOCKET OPEN FAILED");
    }
    this.status_ = chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT;
    this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(this.status_));
  }
};
chatango.networking.EchoConnection.prototype.pingServer = function() {
  if (!this.ws_.isOpen()) {
    return;
  }
  this.ws_.send("\r\n");
  if (this.got_response_) {
    this.clearTimeoutInterval();
    this.timeoutTimer_ = goog.Timer.callOnce(this.socketClosed, this.time_out_, this);
  }
  this.pingTimer_ = goog.Timer.callOnce(this.pingServer, this.ping_interval_, this);
};
chatango.networking.EchoConnection.prototype.send = function(data) {
  if (chatango.DEBUG) {
    this.logger.info("CONNECTION SEND this.ws_: " + this.ws_);
  }
  if (goog.isDefAndNotNull(this.ws_)) {
    if (chatango.DEBUG) {
      this.logger.info("CONNECTION SEND: " + data);
    }
    this.ws_.send(data);
  }
};
chatango.networking.EchoConnection.prototype.onConnect = function() {
  if (chatango.DEBUG) {
    this.logger.info("EchoConnection.prototype.onConnect");
  }
  this.status_ = chatango.networking.ConnectionStatusEvent.EventType.SOCKET_CONNECTED;
  goog.events.listen(this, chatango.networking.CommonConnectionEvent.EventType.DENIED, this.denied, false, this);
  this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(this.status_));
  if (chatango.DEBUG) {
    this.logger.info("EchoConnection.prototype.onConnect now send");
  }
  this.send("This should be echoed as a message");
};
chatango.networking.EchoConnection.prototype.onData = function(event) {
  if (chatango.DEBUG) {
    this.logger.info("Group Con. ON DATA: " + event.message);
  }
  this.dispatchEvent(new chatango.networking.GroupConnectionEvent(chatango.networking.GroupConnectionEvent.EventType["i"], ["", event.message]));
};
chatango.networking.EchoConnection.prototype.failedToConnect = function(s) {
  this.status_ = chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED;
  this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT));
  this.attempts_++;
  this.initReconnect();
};
chatango.networking.EchoConnection.prototype.initReconnect = function() {
  if (this.kicked_off_) {
    return;
  }
  this.clearReconnectTimer();
  this.reconnectTimer_ = setTimeout(this.startConnectAnim, this.reconnect_interval_ * Math.random() + 15E3, this);
};
chatango.networking.EchoConnection.prototype.clearReconnectTimer = function() {
  if (goog.isDefAndNotNull(this.reconnectTimer_)) {
    goog.Timer.clear(this.reconnectTimer_);
  }
  this.reconnectTimer_ = null;
};
chatango.networking.EchoConnection.prototype.startConnectAnim = function() {
  this.status_ = chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING;
  this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(this.status_));
  this.clearReconnectTimer();
  this.reconnectTimer_ = setTimeout(connect, 1E3, this);
};
chatango.networking.EchoConnection.prototype.socketClosed = function() {
  this.clearTimeoutInterval();
  this.status_ = chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED;
  this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(this.status_));
  if (!this.kicked_off_) {
    this.initReconnect();
  }
};
chatango.networking.EchoConnection.prototype.clearTimeoutInterval = function() {
  if (goog.isDefAndNotNull(this.timeoutTimer_)) {
    goog.Timer.clear(this.timeoutTimer_);
  }
  this.timeoutTimer_ = null;
  this.got_response_ = false;
};
chatango.networking.EchoConnection.prototype.selfKickOff = function(disconnect) {
  if (chatango.DEBUG) {
    this.logger.info("CONNECTION SELF KICK OFF");
  }
  if (disconnect) {
    this.ws_.close();
  }
  this.kicked_off_ = true;
  this.clearReconnectTimer();
};
chatango.networking.EchoConnection.prototype.getStatus = function() {
  return this.status_;
};
chatango.networking.EchoConnection.prototype.isConnected = function() {
  return this.ws_.isOpen();
};
chatango.networking.EchoConnection.prototype.denied = function(e) {
  this.selfKickOff();
};
chatango.networking.EchoConnection.prototype.onClose = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("CONNECTION Close");
  }
  this.socketClosed();
};
chatango.networking.EchoConnection.prototype.onOpen = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("CONNECTION OPEN");
  }
  this.onConnect();
};
chatango.networking.EchoConnection.prototype.dataHandler = function(e) {
  this.got_response_ = true;
  this.onData(e);
};
chatango.networking.EchoConnection.prototype.onError = function() {
  if (chatango.DEBUG) {
    this.logger.info("CONNECTION ERROR");
  }
};
chatango.networking.EchoConnection.prototype.clientAuthenticated = function(e) {
  this.status_ = chatango.networking.ConnectionStatusEvent.EventType.CONNECTED;
  this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(this.status_));
};
goog.provide("chatango.group.ChatManager");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
goog.require("goog.net.WebSocket");
goog.require("goog.net.WebSocket.MessageEvent");
goog.require("goog.structs.Trie");
goog.require("chatango.messagedata.GroupAnnouncementData");
goog.require("chatango.login.Session");
goog.require("chatango.output.OutputWindow");
goog.require("chatango.networking.EchoConnection");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("chatango.login.LoginResponseEvent");
goog.require("chatango.users.ModeratorManager");
chatango.group.ChatManager = function(output, handle, session) {
  this.output_ = output;
  this.session_ = session;
  this.pendingReload_ = false;
  if (chatango.managers.Environment.getInstance().isMockGroup()) {
    return;
  }
  this.con_ = new chatango.networking.GroupConnection(handle, session);
  this.groupConnectUI_ = new chatango.group.GroupConnectionUI(this.output_);
  this.con_.connect();
  this.handler = new goog.events.EventHandler(this);
  goog.events.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.i, this.onInitialMessage, false, this);
  goog.events.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.b, this.onLiveMessage, false, this);
  goog.events.listen(this.con_, chatango.networking.CommonConnectionEvent.EventType.miu, this.onMiu_, false, this);
  var events = [chatango.networking.GroupConnectionEvent.EventType.clearall, chatango.networking.GroupConnectionEvent.EventType.deletemsg, chatango.networking.GroupConnectionEvent.EventType.deleteall, chatango.networking.GroupConnectionEvent.EventType.annc, chatango.networking.GroupConnectionEvent.EventType.nomore, chatango.networking.GroupConnectionEvent.EventType.gotmore, chatango.networking.CommonConnectionEvent.EventType.ok, chatango.networking.GroupConnectionEvent.EventType.u, chatango.networking.GroupConnectionEvent.EventType.versioningPU, 
  chatango.networking.GroupConnectionEvent.EventType.mods, chatango.networking.GroupConnectionEvent.EventType.blocked, chatango.networking.GroupConnectionEvent.EventType.unblocked, chatango.networking.CommonConnectionEvent.EventType.updateprofile];
  this.handler.listen(this.con_, events, this.onEvent_);
  this.groupConnectUI_.setConnectionListener(this.con_);
  this.sellerTree_ = new goog.structs.Trie;
};
chatango.group.ChatManager.prototype.logger = goog.debug.Logger.getLogger("chatango.group.ChatManager");
chatango.group.ChatManager.prototype.setReloadPending = function(bool) {
  this.pendingReload_ = bool;
};
chatango.group.ChatManager.prototype.addUserToTree_ = function(msg) {
  var user = chatango.users.UserManager.getInstance().addUser("cm_" + msg.getName(), msg.getName(), msg.userType_);
  var uid = user.getName();
  if (uid == "") {
    return;
  }
  var value = this.sellerTree_.get(uid);
  if (!value || value < new Date(1E3 * msg.getTimeStamp())) {
    this.sellerTree_.set(uid.toLowerCase(), [uid, new Date(1E3 * msg.getTimeStamp())]);
  }
};
chatango.group.ChatManager.prototype.getSellerTree = function() {
  return this.sellerTree_;
};
chatango.group.ChatManager.prototype.onLiveMessage = function(event) {
  if (!this.pendingReload_) {
    this.output_.addMessage(event.data);
    this.addUserToTree_(event.data);
  }
};
chatango.group.ChatManager.prototype.onInitialMessage = function(event) {
  this.pendingReload_ = false;
  this.output_.addMessage(event.data, "top");
  this.addUserToTree_(event.data);
};
chatango.group.ChatManager.prototype.onMiu_ = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("User info updated: " + e.data);
  }
  var sid = e.data[1];
  chatango.users.UserManager.getInstance().refreshMedia(sid);
  this.output_.refreshBackgrounds(sid);
};
chatango.group.ChatManager.prototype.onEvent_ = function(e) {
  var msgId;
  var msgCounter;
  var i;
  var mods;
  var mod;
  switch(e.type) {
    case chatango.networking.GroupConnectionEvent.EventType.clearall:
      this.output_.removeAllMessages();
      break;
    case chatango.networking.GroupConnectionEvent.EventType.deletemsg:
      msgId = e.data[1];
      this.output_.removeMessage(msgId);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.deleteall:
      this.output_.removeMessagesByIds(e.data);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.annc:
      var data;
      var vendor = /webkit/i.test(navigator.appVersion) ? "webkit" : /firefox/i.test(navigator.userAgent) ? "Moz" : /trident/i.test(navigator.userAgent) ? "ms" : "opera" in window ? "O" : "";
      var message;
      if (vendor === "Moz") {
        message = e.data;
      } else {
        message = new chatango.messagedata.GroupAnnouncementData(event.data);
      }
      this.output_.addMessage(message);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.nomore:
      this.output_.showNoMessages();
      break;
    case chatango.networking.GroupConnectionEvent.EventType.gotmore:
      this.output_.historyBatchReceived(e.data[1]);
      break;
    case chatango.networking.CommonConnectionEvent.EventType.ok:
      break;
    case chatango.networking.GroupConnectionEvent.EventType.u:
      msgCounter = e.data[1];
      msgId = e.data[2];
      this.output_.updateMessageId(msgCounter, msgId);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.versioningPU:
      this.groupConnectUI_.showInvalidVersionPU();
      break;
    case chatango.networking.GroupConnectionEvent.EventType.mods:
      mods = e.data;
      mods.shift();
      chatango.users.ModeratorManager.getInstance().updateMods(mods);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.blocked:
      this.output_.userBanned(e.data[1], true);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.unblocked:
      this.output_.userBanned(e.data[1], false);
      break;
    case chatango.networking.CommonConnectionEvent.EventType.updateprofile:
      var user = chatango.users.UserManager.getInstance().getUser(e.data[1]);
      if (user) {
        user.reloadThumb();
      }
      break;
  }
};
chatango.group.ChatManager.prototype.login = function(e) {
  this.request = e.getRequest();
  var events = [chatango.networking.GroupConnectionEvent.EventType.pwdok, chatango.networking.GroupConnectionEvent.EventType.badlogin, chatango.networking.GroupConnectionEvent.EventType.aliasok, chatango.networking.GroupConnectionEvent.EventType.badalias];
  if (this.request.type_ == chatango.users.User.UserType.SELLER) {
    this.handler.listen(this.con_, events, this.loginResponseRecieved);
    this.con_.send("blogin:" + this.request.name_ + ":" + this.request.password_);
  } else {
    if (this.request.type_ == chatango.users.User.UserType.TEMP) {
      this.handler.listen(this.con_, events, this.loginResponseRecieved);
      this.con_.send("blogin:" + this.request.name_);
    } else {
      if (this.request.type_ == chatango.users.User.UserType.ANON) {
        var anon_name = "anon" + chatango.users.User.getAnonNumber(this.session_.getSessionTsId(), this.session_.getSessionId());
        chatango.users.UserManager.getInstance().addCurrentUser(null, anon_name, chatango.users.User.UserType.ANON);
        this.request.dispatchEvent(new chatango.login.LoginResponseEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS));
      }
    }
  }
};
chatango.group.ChatManager.prototype.loginResponseRecieved = function(e) {
  if (e.type == chatango.networking.GroupConnectionEvent.EventType.pwdok) {
    chatango.users.UserManager.getInstance().addCurrentUser(null, this.request.name_, chatango.users.User.UserType.SELLER);
    var url = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/setcookies";
    var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
    xhr.setWithCredentials(true);
    xhr.send(url, "POST", "pwd=" + this.request.password_ + "&sid=" + this.request.name_);
    var encoder = chatango.utils.Encode.getInstance();
    goog.net.cookies.set("un", encoder.encode(this.request.name_), 31536E3, "/");
    goog.net.cookies.set("pw", encoder.encode(this.request.password_), 31536E3, "/");
    if (this.request) {
      this.request.dispatchEvent(new chatango.login.LoginResponseEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS));
    }
    this.con_.stopAnonTimeOutTimer();
  } else {
    if (e.type == chatango.networking.GroupConnectionEvent.EventType.badlogin) {
      if (this.request) {
        var error_flag = e.data[1] ? e.data[1] : "2";
        this.request.dispatchEvent(new chatango.login.LoginResponseEvent(chatango.login.LoginResponseEvent.EventType.ERROR, error_flag));
      }
      this.con_.startAnonTimeOutTimer();
    } else {
      if (e.type == chatango.networking.GroupConnectionEvent.EventType.aliasok) {
        chatango.users.UserManager.getInstance().addCurrentUser(null, this.request.name_, chatango.users.User.UserType.TEMP);
        this.request.dispatchEvent(new chatango.login.LoginResponseEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS));
        this.con_.startAnonTimeOutTimer();
      } else {
        if (e.type == chatango.networking.GroupConnectionEvent.EventType.badalias) {
          var error_flag = e.data[1] ? e.data[1] : "2";
          this.request.dispatchEvent(new chatango.login.LoginResponseEvent(chatango.login.LoginResponseEvent.EventType.ERROR, error_flag));
          this.con_.startAnonTimeOutTimer();
        }
      }
    }
  }
  var events = [chatango.networking.GroupConnectionEvent.EventType.pwdok, chatango.networking.GroupConnectionEvent.EventType.badlogin, chatango.networking.GroupConnectionEvent.EventType.aliasok];
  this.handler.unlisten(this.con_, events);
};
chatango.group.ChatManager.prototype.getConnection = function() {
  return this.con_;
};
goog.provide("chatango.ui.GroupUploadMediaButton");
goog.require("chatango.ui.UploadMediaButton");
goog.require("chatango.login.LoginResponseEvent");
goog.require("chatango.login.LoginRequestEvent");
goog.require("chatango.login.SignupRequestEvent");
goog.require("chatango.group.ChatManager");
goog.require("chatango.managers.Environment");
chatango.ui.GroupUploadMediaButton = function(opt_size, opt_domHelper, cm) {
  chatango.ui.UploadMediaButton.call(this, opt_size, opt_domHelper);
  this.cm_ = cm;
  this.userManager_ = chatango.users.UserManager.getInstance();
  this.session_ = new chatango.login.Session;
};
goog.inherits(chatango.ui.GroupUploadMediaButton, chatango.ui.UploadMediaButton);
chatango.ui.GroupUploadMediaButton.prototype.readyToUpload = function() {
  if (chatango.managers.Environment.getInstance().isMockGroup()) {
    return false;
  }
  var userType = null;
  if (chatango.users.UserManager.getInstance().currentUser) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  }
  if (userType != chatango.users.User.UserType.SELLER) {
    goog.module.ModuleManager.getInstance().execOnLoad("LoginModule", function() {
      this.getLoginModule_().openLoginPopup(null, null, true);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLogin_, false, this);
      goog.events.listen(this.getLoginModule_(), chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.cm_.login, false, this.cm_);
      goog.events.listen(this.getLoginModule_(), chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.userManager_.signup, false, this.userManager_);
    }, this);
    return false;
  }
  return true;
};
chatango.ui.GroupUploadMediaButton.prototype.getLoginModule_ = function() {
  if (typeof this.loginModule_ === "undefined") {
    this.loginModule_ = new chatango.modules.LoginModule(this.session_);
  }
  return this.loginModule_;
};
chatango.ui.GroupUploadMediaButton.prototype.onSuccessfulLogin_ = function() {
  this.getLoginModule_().closeLoginPopup();
  this.dispatchEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS);
};
goog.provide("chatango.ui.icons.SvgInputArrow");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgInputArrow = function(orientation, opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.orientation_ = orientation == null ? 0 : orientation;
};
goog.inherits(chatango.ui.icons.SvgInputArrow, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgInputArrow.prototype.createDom = function() {
  chatango.ui.icons.SvgInputArrow.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, "icon-horiz-arrow-align");
};
chatango.ui.icons.SvgInputArrow.prototype.draw = function() {
  var path = "M 50 30 L 50 70 L 70 50 Z";
  if (this.orientation_ === 1) {
    path = "M 50 30 L 50 70 L 30 50 Z";
  }
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100"><defs></defs><path d="' + path + '" fill="' + this.color_ + '"></svg>';
};
chatango.ui.icons.SvgInputArrow.prototype.flip = function() {
  this.orientation_ = 1 - this.orientation_;
  this.draw();
};
goog.provide("chatango.ui.icons.SmileyIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SmileyIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.SmileyIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SmileyIcon.prototype.draw = function() {
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<circle cx="50" cy="50" r="45" style="fill:none;" stroke="' + this.color_ + '" stroke-width="7%"></circle>' + "<g>" + '<ellipse cx="35" cy="43" rx="7.75" ry="16.5" style="fill:' + this.color_ + ';"></ellipse>' + '<ellipse cx="65" cy="43" rx="7.75" ry="16.5" style="fill:' + this.color_ + ';"></ellipse>' + '<path d="M 50 77.44 C 61.4 77.44 72.4 72.8 80.4 64.8 M 50 77.44 C 38.5 77.44 27.5 72.9 19.50 64.81" stroke="' + 
  this.color_ + '" stroke-width="7%" fill="none"></path>' + "</g>" + "</svg>";
};
goog.provide("chatango.managers.TouchHandler");
goog.require("goog.events.EventTarget");
chatango.managers.TouchHandler = function() {
  goog.events.EventTarget.call(this);
  this.lastTouched_ = null;
};
goog.inherits(chatango.managers.TouchHandler, goog.events.EventTarget);
goog.addSingletonGetter(chatango.managers.TouchHandler);
chatango.managers.TouchHandler.prototype.touchCausedClick = function(e) {
  if (e.type == goog.events.EventType.CLICK) {
    return true;
  } else {
    if (e.type == goog.events.EventType.TOUCHSTART) {
      this.lastTouched_ = e.currentTarget;
      return false;
    } else {
      if (e.type == goog.events.EventType.TOUCHEND) {
        if (this.lastTouched_ == e.currentTarget) {
          e.preventDefault();
          return true;
        }
        return false;
      }
    }
  }
};
goog.provide("chatango.ui.icons.ChannelIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.ChannelIcon = function(opt_color, opt_borderColor, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_borderColor, opt_domHelper);
  this.modsBold_ = false;
};
goog.inherits(chatango.ui.icons.ChannelIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.ChannelIcon.prototype.createDom = function() {
  chatango.ui.icons.ChannelIcon.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, "ipt-icon");
};
chatango.ui.icons.ChannelIcon.prototype.draw = function() {
  chatango.ui.icons.ChannelIcon.superClass_.draw.call(this);
  var modsBoldString = this.modsBold_ ? ' style="font-weight:bold;"' : "";
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100" preserveAspectRatio="xMinYMid">' + "<defs></defs>" + '<text x="15" y="90" font-size="100" fill="' + this.color_ + '"' + modsBoldString + ">#</text></svg>";
  this.element_.innerHTML = svg;
};
chatango.ui.icons.ChannelIcon.prototype.setModsBold = function(modsBold) {
  this.modsBold_ = modsBold;
  this.draw();
};
goog.require("goog.events.Event");
goog.provide("chatango.events.MessageStyleEvent");
chatango.events.MessageStyleEvent = function(type, opt_uid) {
  goog.base(this);
};
goog.inherits(chatango.events.MessageStyleEvent, goog.events.Event);
chatango.events.MessageStyleEvent.EventType = {CHANGED:"stylechanged", CLOSED:"styleclosed", LOADED:"loaded", WAIT_MSG:"wait_msg"};
goog.provide("chatango.ui.AutocompleteMenu");
goog.require("goog.ui.Component.EventType");
goog.require("chatango.ui.PopupMenu");
chatango.ui.AutocompleteMenu = function(opt_domHelper, opt_renderer) {
  goog.base(this, opt_domHelper, opt_renderer);
  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION, this.onAction_);
};
goog.inherits(chatango.ui.AutocompleteMenu, chatango.ui.PopupMenu);
chatango.ui.AutocompleteMenu.prototype.createDom = function() {
  chatango.ui.AutocompleteMenu.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, "autocomplete-menu");
};
chatango.ui.AutocompleteMenu.prototype.onAction_ = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.data = this.indexOfChild(e.target);
  this.dispatchEvent(e);
};
goog.provide("chatango.ui.icons.StyleBarIcon");
goog.require("chatango.ui.icons.SvgToggleIcon");
chatango.ui.icons.StyleBarIcon = function(opt_color, opt_borderColor, opt_domHelper) {
  chatango.ui.icons.SvgToggleIcon.call(this, opt_color, opt_borderColor, opt_domHelper);
};
goog.inherits(chatango.ui.icons.StyleBarIcon, chatango.ui.icons.SvgToggleIcon);
chatango.ui.icons.StyleBarIcon.prototype.createDom = function() {
  chatango.ui.icons.StyleBarIcon.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, "ipt-icon");
};
chatango.ui.icons.StyleBarIcon.prototype.draw = function() {
  chatango.ui.icons.StyleBarIcon.superClass_.draw.call(this);
  var svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100" preserveAspectRatio="xMinYMid">' + "<defs></defs>" + '<text x="15" y="80" font-size="100" font-style="italic" text-decoration="underline" fill="' + this.color_ + '">A</text></svg>';
  this.element_.innerHTML = svg;
};
goog.provide("chatango.group.GroupInput");
goog.require("chatango.events.MessageStyleEvent");
goog.require("chatango.group.channels.ChannelController");
goog.require("chatango.group.ChatManager");
goog.require("chatango.group.GroupChatRestrictions");
goog.require("chatango.input.Input");
goog.require("chatango.input.plugins.InsertNode");
goog.require("chatango.login.LoginResponseEvent");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.managers.PremiumManager");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.TouchHandler");
goog.require("chatango.transitions.Cubic");
goog.require("chatango.ui.AutocompleteMenu");
goog.require("chatango.ui.GroupUploadMediaButton");
goog.require("chatango.ui.icons.ChannelIcon");
goog.require("chatango.ui.icons.SmileyIcon");
goog.require("chatango.ui.icons.StyleBarIcon");
goog.require("chatango.ui.icons.SvgInputArrow");
goog.require("chatango.users.UserManager");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.formatting");
goog.require("chatango.utils.userAgent");
goog.require("goog.events");
goog.require("goog.events.KeyHandler");
goog.require("goog.fx.Animation");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
goog.require("goog.ui.MenuItem");
chatango.group.GroupInput = function(cm, managers, opt_domHelper) {
  chatango.input.Input.call(this, undefined, opt_domHelper);
  this.cm_ = cm;
  this.managers_ = managers;
  this.chatRestrictions_ = undefined;
  this.inputEnabled_ = false;
  this.userRestrictionMode_ = chatango.group.GroupChatRestrictions.UserRestrictionMode.OPEN;
  this.atMode_ = false;
  this.chosenAutoIndex_ = null;
  if (!chatango.managers.Environment.getInstance().isMockGroup()) {
    goog.events.listen(this.cm_.getConnection(), chatango.networking.CommonConnectionEvent.EventType.miu, this.onMiu_, false, this);
  }
  this.styleBarContainer_ = null;
  this.lastUseBackground_ = null;
  this.leftInputIconsShowing_ = true;
  this.rightInputIconsShowing_ = true;
  this.iconLeftPos_ = 0;
  this.iconRightPos_ = 0;
  this.arrowIconWidth_ = 0;
  chatango.group.Group.prototype.positionElementsScheduled_ = false;
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
  goog.events.listen(this.msManager_, chatango.managers.MessageStyleManager.EventType.USER_CHANGED, this.onUserChange_, false, this);
  goog.events.listen(this.msManager_, chatango.managers.MessageStyleManager.EventType.MSG_STYLES_ALLOWED_CHANGED, this.styleChanged_, false, this);
  goog.events.listen(chatango.group.channels.ChannelController.getInstance(), chatango.group.channels.ChannelController.EventType.CHANNEL_CHANGE, this.updateCurrentChannel_, false, this);
  goog.events.listen(chatango.group.channels.ChannelController.getInstance(), chatango.events.EventType.ENABLE_CHANNELS_UPDATE, this.updateChannelsEnabled, false, this);
  goog.events.listen(chatango.group.channels.ChannelController.getInstance(), chatango.group.channels.ChannelController.EventType.OPEN_FILTER_DIALOG, this.openChannelsFilter, false, this);
};
goog.inherits(chatango.group.GroupInput, chatango.input.Input);
chatango.group.GroupInput.prototype.createDom = function() {
  goog.base(this, "createDom");
  this.mediaUploadButton_ = new chatango.ui.GroupUploadMediaButton(undefined, undefined, this.cm_);
  this.inputDiv_ = goog.dom.createDom("div", {"class":"msg ubdr"});
  this.inputBackground_ = goog.dom.createDom("div", {"class":"msg-bg"});
  this.inputStripes_ = goog.dom.createDom("div", {"class":"msg-stripes"});
  this.inputForeground_ = goog.dom.createDom("div", {"class":"msg-fg"});
  this.inputForeground_.style.padding = "0em";
  this.inputDiv_.style.borderBottom = "inherit";
  this.inputDiv_.style.border = "1px solid";
  this.inputDiv_.style.boxSizing = "border-box";
  this.inputEl_.style.display = "inline-block";
  this.inputEl_.style.border = "none";
  goog.dom.appendChild(this.inputForeground_, this.inputEl_);
  goog.dom.appendChild(this.inputDiv_, this.inputBackground_);
  goog.dom.appendChild(this.inputDiv_, this.inputForeground_);
  goog.dom.appendChild(this.inputDiv_, this.inputStripes_);
  this.inputClosedDiv_ = goog.dom.createDom("div", {"id":"IPT_CLOSED", "style":"display:none; cursor:pointer;"});
  this.inputWrapper_ = goog.dom.createDom("div", {"id":"IWW", "style":"display:inline-block;"}, [this.inputDiv_, this.inputClosedDiv_]);
  this.progressBarWrapper_ = goog.dom.createDom("div", {"id":"IWPBW"});
  this.vertProgressBarWrapper_ = goog.dom.createDom("div", {"id":"IWPBWV"});
  this.widthOffset = 0;
  var isDesktop = chatango.managers.Environment.getInstance().isDesktop();
  this.vertProgressBarWidth = isDesktop ? 12 : 8;
  this.vertProgressBarWrapper_.style.width = this.vertProgressBarWidth + "px";
  this.vertProgressBarWrapper_.style.display = "none";
  this.inputElementsRow_ = goog.dom.createDom("div", {"id":"IWER2"}, [this.vertProgressBarWrapper_, this.inputWrapper_]);
  this.styleBarContainer_ = goog.dom.createDom("div", {"id":"SBC", "style":"display: none;"});
  var styleManager = chatango.managers.Style.getInstance();
  var iconBorderColor = styleManager.isBorderColorIsSameAsBgColor() ? styleManager.getUserDefinedIconColor() : styleManager.getUDBorderColor();
  this.inputWindow_.appendChild(this.styleBarContainer_);
  this.inputWindow_.appendChild(this.progressBarWrapper_);
  this.leftIconArrow_ = new chatango.ui.icons.SvgInputArrow(0, chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.leftIconArrow_.render(this.inputWindow_);
  goog.dom.classes.add(this.leftIconArrow_.getElement(), "ipt-icon");
  this.mediaUploadButton_.render(this.inputWindow_);
  this.channelIcon_ = new chatango.ui.icons.ChannelIcon(chatango.ui.icons.Icon.USE_USER_DEFINED_COLOR);
  this.channelIcon_.render(this.inputWindow_);
  this.updateChannelsEnabled();
  this.inputWindow_.appendChild(this.inputElementsRow_);
  this.smileyIcon_ = new chatango.ui.icons.SmileyIcon(chatango.ui.icons.Icon.USE_USER_DEFINED_COLOR);
  this.smileyIcon_.render(this.inputWindow_);
  goog.dom.classes.add(this.smileyIcon_.getElement(), "ipt-icon");
  this.styleBarIcon_ = new chatango.ui.icons.StyleBarIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR, iconBorderColor);
  this.styleBarIcon_.render(this.inputWindow_);
  goog.style.setHeight(this.styleBarIcon_.getElement(), "auto");
  this.rightIconArrow_ = new chatango.ui.icons.SvgInputArrow(1, chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.rightIconArrow_.render(this.inputWindow_);
  goog.dom.classes.add(this.rightIconArrow_.getElement(), "ipt-icon");
  this.autocomplete_ = new chatango.ui.AutocompleteMenu;
  this.autocomplete_.setAllowAutoFocus(false);
  this.autocomplete_.render(document.body);
  this.actionEvents_ = chatango.managers.Environment.getInstance().isDesktop() ? [goog.events.EventType.CLICK] : [goog.events.EventType.TOUCHSTART, goog.events.EventType.TOUCHEND];
  this.arrowActions_ = chatango.managers.Environment.getInstance().isIOS() && !goog.userAgent.isVersion(600) ? [goog.events.EventType.CLICK] : this.actionEvents_;
  this.styleBarIconEvents_ = chatango.managers.Environment.getInstance().isIOS() ? [goog.events.EventType.CLICK] : this.actionEvents_;
  if (!chatango.managers.Environment.getInstance().isMockGroup()) {
    goog.events.listen(this.mediaUploadButton_, chatango.events.FileUploadEvent.EventType.SUCCESS, this.uploadSuccessHandler, undefined, this);
    goog.events.listen(this.mediaUploadButton_, chatango.events.FileUploadEvent.EventType.FAILURE, this.uploadErrorHandler, undefined, this);
    goog.events.listen(this.mediaUploadButton_, chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onLoginSuccess, undefined, this);
    goog.events.listen(this.smileyIcon_.getElement(), this.actionEvents_, this.onSmileyIconClicked_, undefined, this);
    goog.events.listen(this.styleBarIcon_.getElement(), this.styleBarIconEvents_, this.onStyleBarIconClicked_, undefined, this);
    goog.events.listen(this.channelIcon_.getElement(), this.actionEvents_, this.openChannelDialog_, undefined, this);
    goog.events.listen(this.inputClosedDiv_, this.actionEvents_, this.onInputClosedDivClicked_, undefined, this);
  }
  goog.events.listen(this.leftIconArrow_.getElement(), this.arrowActions_, this.onLeftArrowClicked_, null, this);
  goog.events.listen(this.rightIconArrow_.getElement(), this.arrowActions_, this.onRightArrowClicked_, null, this);
  goog.events.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.USER_DEFINED_BORDER_COLOR_CHANGED, this.draw, undefined, this);
  goog.events.listen(this.inputEl_, goog.events.EventType.KEYUP, this.onKeyUp_, false, this);
  goog.events.listen(this.inputEl_, goog.events.EventType.KEYDOWN, this.onKeyDown_, false, this);
  goog.events.listen(this.inputEl_, goog.events.EventType.FOCUS, this.onFocus_, true, this);
  goog.events.listen(this.autocomplete_, goog.ui.Component.EventType.ACTION, this.onAutoAction_, false, this);
};
chatango.group.GroupInput.prototype.getProgressBarWrapperEl = function() {
  return this.progressBarWrapper_;
};
chatango.group.GroupInput.prototype.getVerticalProgressBarWrapperEl = function() {
  return this.vertProgressBarWrapper_;
};
chatango.group.GroupInput.prototype.setWidthOffset = function(offset) {
  if (offset) {
    this.widthOffset = offset;
  }
};
chatango.group.GroupInput.prototype.setChatRestrictions = function(chatRestrictions) {
  if (this.chatRestrictions_) {
    goog.events.unlisten(this.chatRestrictions_, chatango.group.GroupChatRestrictions.EventType.RESTRICTION_STATE_CHANGED, this.onChatRestrictionsChange_, false, this);
  }
  this.chatRestrictions_ = chatRestrictions;
  goog.events.listen(this.chatRestrictions_, chatango.group.GroupChatRestrictions.EventType.RESTRICTION_STATE_CHANGED, this.onChatRestrictionsChange_, false, this);
};
chatango.group.GroupInput.prototype.onChatRestrictionsChange_ = function(e) {
  var lastUserRestrictionMode = this.userRestrictionMode_;
  this.updateUserRestrictionMode_();
  if (this.userRestrictionMode_ != lastUserRestrictionMode) {
    this.dispatchEvent(goog.events.EventType.RESIZE);
    if (goog.module.ModuleManager.getInstance().getModuleInfo("WarningDialogModule").isLoaded()) {
      chatango.modules.WarningDialogModule.getInstance().closeWarningDialog();
    }
  }
};
chatango.group.GroupInput.prototype.updateUserRestrictionMode_ = function() {
  if (!this.chatRestrictions_) {
    return;
  }
  this.userRestrictionMode_ = this.chatRestrictions_.getCurrentUserRestrictionMode();
};
chatango.group.GroupInput.prototype.onLoginSuccess = function(e) {
  this.dispatchEvent(chatango.login.LoginResponseEvent.EventType.SUCCESS);
};
chatango.group.GroupInput.prototype.uploadSuccessHandler = function(e) {
  if (chatango.managers.Environment.getInstance().isIOS()) {
    if (this.inputEl_.textContent == "") {
      this.inputEl_.textContent = this.mediaUploadButton_.lastUrlAbbreviated + " ";
    } else {
      this.inputEl_.textContent = this.inputEl_.textContent + " " + this.mediaUploadButton_.lastUrlAbbreviated + " ";
    }
    this.focus();
  } else {
    var node = this.prepareCodeForInsertion_(this.mediaUploadButton_.lastUrlAbbreviated);
    this.inputCEF_.execCommand(chatango.input.plugins.InsertNode.COMMAND, node);
  }
};
chatango.group.GroupInput.prototype.uploadErrorHandler = function(e) {
  if (chatango.DEBUG) {
    console.log("Upload error:", e);
  }
};
chatango.group.GroupInput.prototype.setEnabled = function(enabled) {
  if (typeof enabled === "undefined") {
    enabled = true;
  }
  this.inputEnabled_ = enabled;
  this.inputEl_.disabled = !enabled;
  this.drawInputField_();
};
chatango.group.GroupInput.prototype.drawInputField_ = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  var enabled = this.chatRestrictions_ && this.inputEnabled_;
  this.inputEl_.contentEditable = String(!!enabled);
  goog.style.setStyle(this.inputDiv_, "display", "inline-block");
  goog.style.setStyle(this.inputClosedDiv_, "display", "none");
  var bodyH = document.body.offsetHeight;
  var inputHeightInEm;
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    inputHeightInEm = 2.4;
  } else {
    if (!chatango.managers.ScaleManager.getInstance().isBelowFullFeaturedHeight()) {
      var minEm = chatango.managers.Environment.getInstance().isTouch() ? 2.4 : 2.5;
      var maxLines = 4;
      this.inputEl_.style.height = minEm + "em";
      var minPx = this.inputEl_.offsetHeight;
      var oneEmInPx = minPx / minEm;
      var percent = .08;
      inputHeightInEm = Math.max(minEm, Math.min(minEm + maxLines - 1, bodyH * percent / oneEmInPx));
    } else {
      inputHeightInEm = chatango.managers.Environment.getInstance().isTouch() ? 2.4 : 1.9;
    }
  }
  this.inputEl_.style.height = inputHeightInEm + "em";
  var isNarrowOrMobile = !chatango.managers.Environment.getInstance().isDesktop() || this.inputEl_.offsetWidth < 190;
  switch(this.userRestrictionMode_) {
    case chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST:
      this.setPlaceholderCopy(lm.getString("basic_group", "broadcast_mode"));
      break;
    case chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST_BLOCKED:
      this.setPlaceholderCopy("");
      goog.style.setStyle(this.inputDiv_, "display", "none");
      goog.style.setStyle(this.inputClosedDiv_, "display", "table-cell");
      this.inputClosedDiv_.innerHTML = lm.getString("basic_group", "broadcast_closed");
      break;
    case chatango.group.GroupChatRestrictions.UserRestrictionMode.CLOSED:
      this.setPlaceholderCopy("");
      goog.style.setStyle(this.inputDiv_, "display", "none");
      goog.style.setStyle(this.inputClosedDiv_, "display", "table-cell");
      if (isNarrowOrMobile) {
        this.inputClosedDiv_.innerHTML = lm.getString("basic_group", "mods_only_sm");
      } else {
        this.inputClosedDiv_.innerHTML = lm.getString("basic_group", "mods_only");
      }
      break;
    case chatango.group.GroupChatRestrictions.UserRestrictionMode.OPEN:
    ;
    default:
      if (isNarrowOrMobile) {
        this.setPlaceholderCopy(lm.getString("basic_group", "type_here"));
      } else {
        this.setPlaceholderCopy(lm.getString("basic_group", "type_here_to_send"));
      }
      break;
  }
};
chatango.group.GroupInput.prototype.getHeight = function() {
  return this.element_.clientHeight;
};
chatango.group.GroupInput.prototype.drawScheduled_ = false;
chatango.group.GroupInput.prototype.scheduleDraw = function() {
  if (this.drawScheduled_) {
    return;
  }
  this.drawScheduled_ = true;
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 1);
};
chatango.group.GroupInput.prototype.draw = function() {
  this.drawScheduled_ = false;
  this.updateUserRestrictionMode_();
  this.drawInputField_();
  var userType = null;
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  }
  if (userType != chatango.users.User.UserType.SELLER) {
    this.mediaUploadButton_.getElement().style.opacity = .5;
  } else {
    this.mediaUploadButton_.getElement().style.opacity = 1;
  }
  this.inputDiv_.style.borderColor = chatango.managers.Style.getInstance().getUDBorderColor();
  this.inputEl_.style.padding = chatango.managers.Style.getInstance().getPadding() + "em";
  this.inputEl_.style.paddingLeft = chatango.managers.Style.getInstance().getPadding() * 2 + "em";
  this.inputClosedDiv_.style.color = chatango.managers.Style.getInstance().getUserDefinedIconColor();
  var iconWidth = chatango.managers.Style.getInstance().getIconSize() * 1.1;
  var iconHeight = Number(this.inputEl_.getBoundingClientRect().height.toFixed(3));
  var iconTopMar = 0;
  if (chatango.managers.Style.getInstance().isBorderColorIsSameAsBgColor()) {
    iconTopMar = 1;
  } else {
    iconHeight += 2;
  }
  this.vertProgressBarWrapper_.style.height = iconHeight + "px";
  this.vertProgressBarWrapper_.style.marginTop = iconTopMar + "px";
  this.arrowIconWidth_ = Math.round(iconWidth * 1.15);
  this.leftIconArrow_.setSize(this.arrowIconWidth_, iconHeight);
  this.leftIconArrow_.getElement().style.marginTop = iconTopMar + "px";
  this.leftIconArrow_.draw();
  var cameraIconDiv = this.mediaUploadButton_.getElement().childNodes[0];
  goog.style.setStyle(cameraIconDiv, "width", iconWidth + "px");
  goog.style.setStyle(cameraIconDiv, "height", iconHeight + "px");
  cameraIconDiv.style.marginTop = iconTopMar + "px";
  this.mediaUploadButton_.draw();
  this.styleBarIcon_.setSize(iconWidth, iconHeight);
  this.styleBarIcon_.getElement().style.marginTop = iconTopMar + "px";
  this.styleBarIcon_.draw();
  this.channelIcon_.setSize(iconWidth, iconHeight);
  this.channelIcon_.getElement().style.marginTop = iconTopMar + "px";
  this.channelIcon_.draw();
  this.rightIconArrow_.setSize(this.arrowIconWidth_, iconHeight);
  this.rightIconArrow_.getElement().style.marginTop = iconTopMar + "px";
  this.rightIconArrow_.draw();
  this.smileyIcon_.setSize(iconWidth * 1, iconHeight);
  this.smileyIcon_.getElement().style.marginTop = iconTopMar + "px";
  this.smileyIcon_.draw();
  this.setIconVisibility();
  this.positionElements();
  this.styleBarContainer_.style.display = !this.styleBarIcon_.isOn() || (this.userRestrictionMode_ == chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST_BLOCKED || this.userRestrictionMode_ == chatango.group.GroupChatRestrictions.UserRestrictionMode.CLOSED) ? "none" : "block";
  var totalHeight = Math.max(this.inputEl_.offsetHeight, this.inputClosedDiv_.offsetHeight) + this.styleBarContainer_.offsetHeight + this.progressBarWrapper_.offsetHeight;
  goog.style.setStyle(this.element_, "height", totalHeight + "px");
};
chatango.group.GroupInput.prototype.setIconVisibility = function() {
  var hideAllIcons = this.userRestrictionMode_ == chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST_BLOCKED || this.userRestrictionMode_ == chatango.group.GroupChatRestrictions.UserRestrictionMode.CLOSED;
  var showLeftIcons_ = !hideAllIcons && (this.leftInputIconsShowing_ || !this.leftInputIconsShowing_ && this.leftAnim_);
  goog.style.showElement(this.leftIconArrow_.getElement(), !showLeftIcons_ && !hideAllIcons);
  goog.style.showElement(this.mediaUploadButton_.getElement(), showLeftIcons_);
  goog.style.showElement(this.channelIcon_.getElement(), showLeftIcons_ && chatango.group.channels.ChannelController.getInstance().getChannelsEnabled());
  var showRightIcons_ = !hideAllIcons && (this.rightInputIconsShowing_ || !this.rightInputIconsShowing_ && this.rightAnim_);
  goog.style.showElement(this.rightIconArrow_.getElement(), !showRightIcons_ && !hideAllIcons);
  goog.style.showElement(this.styleBarIcon_.getElement(), showRightIcons_);
};
chatango.group.GroupInput.prototype.schedulePositionElements = function() {
  if (this.positionElementsScheduled_) {
    return;
  }
  this.positionElementsScheduled_ = true;
  setTimeout(goog.bind(this.positionElements, this), 0);
};
chatango.group.GroupInput.prototype.positionElements = function() {
  this.positionElementsScheduled_ = false;
  var left = this.iconLeftPos_;
  var right = this.iconRightPos_;
  var mar = chatango.managers.Style.getInstance().getIconSize() * .3;
  var leftArrowEl = this.leftIconArrow_.getElement();
  goog.style.setStyle(leftArrowEl, "left", -(this.arrowIconWidth_ / 2) + "px");
  if (goog.style.isElementShown(leftArrowEl)) {
    left = 0 + this.arrowIconWidth_ / 2;
  }
  var cameraIconDiv = this.mediaUploadButton_.getElement();
  goog.style.setStyle(cameraIconDiv, "left", left + "px");
  if (goog.style.isElementShown(cameraIconDiv)) {
    var cameraWidth = cameraIconDiv.offsetWidth;
    if (cameraWidth > 0) {
      cameraWidth += mar;
    }
    left = left + cameraWidth;
  }
  var channelIconDiv = this.channelIcon_.getElement();
  goog.style.setStyle(channelIconDiv, "left", left + "px");
  if (goog.style.isElementShown(channelIconDiv)) {
    var channelWidth = channelIconDiv.offsetWidth;
    if (channelWidth > 0) {
      channelWidth += mar;
    }
    left = left + channelWidth;
  }
  var rightArrowEl = this.rightIconArrow_.getElement();
  goog.style.setStyle(rightArrowEl, "right", -(this.arrowIconWidth_ / 2) + "px");
  if (goog.style.isElementShown(rightArrowEl)) {
    right = 0 + this.arrowIconWidth_ / 2;
  }
  var styleBarIconEl = this.styleBarIcon_.getElement();
  goog.style.setStyle(styleBarIconEl, "right", right + "px");
  if (goog.style.isElementShown(styleBarIconEl)) {
    right = right + styleBarIconEl.offsetWidth + mar;
  }
  goog.style.setStyle(this.smileyIcon_.getElement(), "right", right + "px");
  var smileyIconWidth = this.smileyIcon_.getElement().offsetWidth;
  right = right + smileyIconWidth + mar;
  var vertProgBarWidth = goog.style.isElementShown(this.vertProgressBarWrapper_) ? this.vertProgressBarWidth : 0;
  vertProgBarWidth = vertProgBarWidth + this.widthOffset;
  right = right + vertProgBarWidth;
  goog.style.setStyle(this.inputElementsRow_, "left", left + "px");
  var inputWidth = Math.floor(this.inputWindow_.offsetWidth - left - right);
  this.inputEl_.style.width = inputWidth + "px";
  this.inputClosedDiv_.style.width = inputWidth;
  this.progressBarWrapper_.style.paddingLeft = left + this.widthOffset + "px";
  this.progressBarWrapper_.style.width = this.inputDiv_.offsetWidth - 1 + "px";
};
chatango.group.GroupInput.prototype.initCopy = function() {
};
chatango.group.GroupInput.prototype.getSmileyPickerModule_ = function() {
  if (typeof this.smileyPickerModule_ === "undefined") {
    this.smileyPickerModule_ = new chatango.modules.SmileyPickerModule(this.cm_);
    goog.events.listen(this.smileyPickerModule_, chatango.events.EventType.SMILEY_PICKED, this.onSmileyPicked_, false, this);
  }
  return this.smileyPickerModule_;
};
chatango.group.GroupInput.prototype.getChannelPickerModule_ = function() {
  if (typeof this.channelPickerModule_ === "undefined") {
    this.channelPickerModule_ = new chatango.modules.ChannelPickerModule(this.cm_);
  }
  return this.channelPickerModule_;
};
chatango.group.GroupInput.prototype.onSmileyPicked_ = function(e) {
  var node = this.prepareCodeForInsertion_(e.data);
  this.inputCEF_.execCommand(chatango.input.plugins.InsertNode.COMMAND, node);
};
chatango.group.GroupInput.prototype.prepareCodeForInsertion_ = function(code) {
  var charBeforeCaret = this.insertNodePlugin_.getCharBeforeCaret();
  if (charBeforeCaret && !/\s/.exec(charBeforeCaret)) {
    code = " " + code;
  }
  code += "&nbsp;";
  var node = goog.dom.htmlToDocumentFragment(code);
  return node;
};
chatango.group.GroupInput.prototype.getStyleBarModule_ = function() {
  if (typeof this.styleBarModule_ === "undefined") {
    this.styleBarModule_ = new chatango.modules.StyleBarModule(this.styleBarContainer_, this.cm_);
    goog.events.listen(this.styleBarModule_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.styleChanged_, undefined, this);
    goog.events.listen(this.styleBarModule_, chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onLoginSuccess, undefined, this);
  }
  return this.styleBarModule_;
};
chatango.group.GroupInput.prototype.onUserChange_ = function(e) {
  var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  var useBackground = stylesOn ? this.msManager_.getStyle("usebackground") : null;
  if (useBackground === null) {
    useBackground = 0;
  }
  if (useBackground !== this.lastUseBackground_) {
    this.cm_.getConnection().send("msgbg:" + useBackground);
  }
  this.lastUseBackground_ = useBackground;
  this.drawBackgroundHelper();
};
chatango.group.GroupInput.prototype.styleChanged_ = function(e) {
  if (e.data === chatango.managers.MessageStyleManager.STYLES_ON || e.type === chatango.managers.MessageStyleManager.EventType.MSG_STYLES_ALLOWED_CHANGED) {
    if (!this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON)) {
      this.setInputBgStylesToInitialDefaults();
      this.setInputTextStylesToInitialDefaults();
    }
    this.dispatchEvent(goog.events.EventType.RESIZE);
  } else {
    if (e.data === "mse") {
      return;
    }
  }
  this.drawBackgroundHelper();
  this.dispatchEvent(e);
};
chatango.group.GroupInput.prototype.onSmileyIconClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  goog.module.ModuleManager.getInstance().execOnLoad("SmileyPickerModule", function() {
    this.getSmileyPickerModule_().openSmileyPicker();
  }, this);
  if (this.focused()) {
    this.focus();
  }
};
chatango.group.GroupInput.prototype.onInputClosedDivClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  goog.module.ModuleManager.getInstance().execOnLoad("WarningDialogModule", this.openClosedExplanationDialog_, this);
};
chatango.group.GroupInput.prototype.openClosedExplanationDialog_ = function() {
  var titleKey, descKey;
  switch(this.userRestrictionMode_) {
    case chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST:
    ;
    case chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST_BLOCKED:
      titleKey = "broadcast_mode";
      descKey = "only_mods";
      break;
    case chatango.group.GroupChatRestrictions.UserRestrictionMode.CLOSED:
      titleKey = "group_closed";
      descKey = "closed_desc";
      break;
  }
  if (!titleKey) {
    return;
  }
  chatango.modules.WarningDialogModule.getInstance().openWarningDialog(titleKey, descKey, this.inputClosedDiv_, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT, undefined, "ok");
};
chatango.group.GroupInput.prototype.onStyleBarIconClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  goog.module.ModuleManager.getInstance().execOnLoad("StyleBarModule", function() {
    this.getStyleBarModule_().toggleStyleBar();
    this.styleBarIcon_.toggle();
    this.dispatchEvent(goog.events.EventType.RESIZE);
  }, this);
  if (this.focused()) {
    this.focus();
  }
};
chatango.group.GroupInput.prototype.closePopUps = function() {
  if (this.styleBarModule_) {
    this.styleBarModule_.closePopUps();
  }
  if (this.smileyPickerModule_) {
    this.smileyPickerModule_.closePopUps();
  }
  if (this.channelPickerModule_) {
    this.channelPickerModule_.closeChannelPicker();
  }
  this.autocomplete_.hide();
  this.atMode_ = false;
};
chatango.group.GroupInput.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.styleBarModule_) {
    this.styleBarModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.smileyPickerModule_) {
    this.smileyPickerModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.channelPickerModule_) {
    this.channelPickerModule_.constrainDialogsToScreen(opt_stageRect);
  }
  this.mediaUploadButton_.constrainDialogsToScreen(opt_stageRect);
  if (this.autocomplete_.isVisible()) {
    setTimeout(function() {
      this.autocomplete_.showAt(this.getTextPosition_(), goog.style.getPageOffsetTop(this.inputEl_), goog.positioning.Corner.BOTTOM_LEFT);
    }.bind(this), 0);
  }
};
chatango.group.GroupInput.prototype.drawStyleBar = function() {
  if (this.styleBarModule_) {
    this.styleBarModule_.drawStyleBar();
  }
};
chatango.group.GroupInput.prototype.onMiu_ = function(e) {
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (!user) {
    return;
  }
  goog.events.listenOnce(user, chatango.users.User.EventType.MEDIA_INFO_LOADED, function(e) {
    this.update();
  }, false, this);
};
chatango.group.GroupInput.prototype.update = function(opt_username) {
  var userType = null;
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  } else {
    return;
  }
  var username = opt_username ? opt_username : user.getUid();
  if (userType != chatango.users.User.UserType.SELLER) {
    goog.dom.classes.enable(this.inputBackground_, "bg-image-" + username, false);
    this.setInputBgStylesToInitialDefaults();
    this.setInputTextStylesToInitialDefaults();
    this.drawBackgroundHelper();
    return;
  }
  if (user.isMediaLoaded()) {
    this.drawBackgroundHelper();
  } else {
    goog.events.listenOnce(user, chatango.users.User.EventType.MEDIA_INFO_LOADED, this.drawBackgroundHelper, undefined, this);
    user.loadMediaInfo(false);
  }
};
chatango.group.GroupInput.prototype.setInputBgStylesToInitialDefaults = function() {
  this.inputDiv_.style.backgroundColor = "transparent";
  var styleManager = chatango.managers.Style.getInstance();
  var bgColor = styleManager.getInitialEmbedInputBgColor();
  var bgOpacity = styleManager.getInitialEmbedInputBgOpacity();
  styleManager.setInputWindowBgColor(bgColor, bgOpacity);
};
chatango.group.GroupInput.prototype.setInputTextStylesToInitialDefaults = function() {
  var styleManager = chatango.managers.Style.getInstance();
  var textColor = styleManager.getInitialEmbedInputTextColor();
  styleManager.setInputTextColor(textColor);
  this.updatePlaceholderCSS_();
  var fontSize = styleManager.getInitialEmbedInputFontSize();
  this.inputEl_.style.fontSize = chatango.utils.formatting.scaleSize(fontSize) + "%";
  var fontFamily = styleManager.getInitialEmbedInputFontFamily();
  this.inputEl_.style.fontFamily = fontFamily;
  this.inputEl_.style.fontStyle = "";
  this.inputEl_.style.textDecoration = "";
};
chatango.group.GroupInput.prototype.drawBackgroundHelper = function() {
  var user = chatango.users.UserManager.getInstance().currentUser;
  var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  var styleManager = chatango.managers.Style.getInstance();
  var styles = {bold:this.msManager_.getStyle("bold"), italics:this.msManager_.getStyle("italics"), underline:this.msManager_.getStyle("underline"), fontFamily:"0", fontSize:"11"};
  if (user && user.isRegistered()) {
    if (stylesOn) {
      if (this.msManager_.getStyle("usebackground") === "1") {
        if (user.isPremium() === chatango.managers.PremiumManager.PremiumType.PENDING) {
          goog.events.listenOnce(chatango.managers.PremiumManager.getInstance(), chatango.managers.PremiumManager.EventType.STATUS_LOADED, function(e) {
            this.drawBackgroundHelper();
          }, false, this);
          return;
        }
        if (chatango.users.ModeratorManager.getInstance().getOwner() === user.getUid() || user.isPremium()) {
          chatango.managers.Style.getInstance().setInputWindowBgColor("#FFFFFF", 0);
          goog.dom.classes.enable(this.inputBackground_, "bg-image-" + user.getUid(), user.getBgUseImg());
          user.drawBg(this.inputBackground_);
        }
      } else {
        goog.dom.classes.enable(this.inputBackground_, "bg-image-" + user.getUid(), false);
        this.setInputBgStylesToInitialDefaults();
      }
      var textColor = this.msManager_.getStyle("textColor");
      if (textColor) {
        textColor = "#" + textColor;
      } else {
        textColor = styleManager.getInitialEmbedInputTextColor();
      }
      styleManager.setInputTextColor(textColor);
      this.updatePlaceholderCSS_();
      this.inputEl_.style.fontFamily = "";
      this.inputEl_.style.fontSize = "";
      styles.fontFamily = this.msManager_.getStyle("fontFamily") || styles.fontFamily;
      styles.fontSize = this.msManager_.getStyle("fontSize") || styles.fontSize;
      this.inputEl_.style.fontFamily = chatango.utils.formatting.getFont(styles.fontFamily);
      var oldSize = this.inputEl_.style.fontSize;
      this.inputEl_.style.fontSize = chatango.utils.formatting.scaleSize(styles.fontSize) + "%";
      if (oldSize !== this.inputEl_.style.fontSize) {
        this.dispatchEvent(goog.events.EventType.RESIZE);
      }
    } else {
      this.setInputTextStylesToInitialDefaults();
    }
  } else {
    this.setInputTextStylesToInitialDefaults();
  }
  this.inputEl_.style.fontWeight = styles.bold ? "bold" : "";
  this.inputEl_.style.fontStyle = styles.italics ? "italic" : "";
  this.inputEl_.style.textDecoration = styles.underline ? "underline" : "";
};
chatango.group.GroupInput.prototype.openChannelDialog_ = function(opt_e) {
  this.closePopUps();
  if (opt_e && !chatango.managers.TouchHandler.getInstance().touchCausedClick(opt_e)) {
    return;
  }
  goog.module.ModuleManager.getInstance().execOnLoad("ChannelPickerModule", function() {
    this.getChannelPickerModule_().openChannelPicker(this.inputEl_);
  }, this);
  if (this.focused()) {
    this.focus();
  }
};
chatango.group.GroupInput.prototype.updateCurrentChannel_ = function(opt_e) {
  this.updateChannelStripes_();
};
chatango.group.GroupInput.prototype.updateChannelStripes_ = function(opt_e) {
  if (!this.getElement()) {
    return;
  }
  var stripes = [];
  var channels = chatango.group.channels.ChannelController.getChannelIds([chatango.group.channels.ChannelController.getInstance().getCurrentChannel()]);
  var i;
  var len = channels.length;
  for (i = 0;i < len;i++) {
    stripes.push(chatango.group.channels.ChannelController.CHANNEL_COLS[channels[i]]);
  }
  goog.style.setStyle(this.inputStripes_, "background", chatango.utils.cssom.getVerticalStripesCss(stripes));
};
chatango.group.GroupInput.prototype.getChannelFlags = function() {
  return chatango.group.channels.ChannelController.getInstance().getCurrentChannel();
};
chatango.group.GroupInput.prototype.clear = function() {
  this.lastMessageText = "";
  this.inputEl_.textContent = "";
  this.atMode_ = false;
};
chatango.group.GroupInput.prototype.getTextPosition_ = function() {
  var pos = 0;
  var charOffset = this.insertNodePlugin_.getCaretPosition();
  if (this.inputEl_.createTextRange) {
    var range = this.inputEl_.createTextRange();
    range.moveStart("character", charOffset);
    pos = range.getBoundingClientRect().left;
  } else {
    var text = this.inputEl_.textContent.substr(0, charOffset).replace(/ $/, "\u00a0");
    var newStyle = this.inputEl_.getAttribute("style") + " position: absolute; visibility: hidden;";
    var sizer = goog.dom.createDom("span", {"style":newStyle, "class":"ubdr"});
    sizer.innerHTML = text;
    sizer.style.width = "";
    sizer.style.margin = "1px";
    sizer.style.border = "none";
    goog.dom.insertSiblingBefore(sizer, this.inputEl_);
    var width = goog.style.getBorderBoxSize(sizer).width;
    var left = goog.style.getPageOffsetLeft(sizer);
    pos = left + width;
    goog.dom.removeNode(sizer);
  }
  return pos;
};
chatango.group.GroupInput.prototype.doAutocomplete_ = function() {
  var val = this.inputEl_.textContent;
  var sub = val.substr(0, val.length - val.split("").reverse().join("").indexOf("@"));
  val = sub + this.autocomplete_.getChildAt(this.chosenAutoIndex_).getValue();
  this.inputEl_.innerHTML = val + "&nbsp;";
  this.setCaretPosition(this.inputEl_.textContent.length);
  this.autocomplete_.hide();
  this.inputEl_.focus();
};
chatango.group.GroupInput.prototype.addAtReply = function(e) {
  var atName = e.getUsername();
  var quote = e.getQuote();
  var re = chatango.group.GroupMessage.getAtReplyRegEx(atName);
  var inputStr = this.inputEl_.textContent;
  if (re.exec(inputStr)) {
    return;
  }
  var replyString = "";
  if (inputStr != "") {
    var lastCharCode = inputStr.charCodeAt(inputStr.length - 1);
    if (lastCharCode != 160 && lastCharCode != 32) {
      replyString = " ";
    }
  }
  replyString += "@" + atName;
  if (quote) {
    replyString += ": `" + quote + "`";
  }
  this.inputEl_.innerHTML = this.inputEl_.innerHTML + replyString + "&nbsp;";
  this.setCaretPosition(this.inputEl_.textContent.length);
  this.inputEl_.focus();
};
chatango.group.GroupInput.prototype.onAutoAction_ = function(e) {
  this.chosenAutoIndex_ = e.data;
  this.doAutocomplete_();
};
chatango.group.GroupInput.prototype.onKeyDown_ = function(e) {
  if (!this.autocomplete_.isVisible()) {
    return;
  }
  var code = e.keyCode;
  if (code === goog.events.KeyCodes.TAB || code === goog.events.KeyCodes.ENTER) {
    e.preventDefault();
    e.stopPropagation();
    this.doAutocomplete_();
  } else {
    if (code === goog.events.KeyCodes.UP || code === goog.events.KeyCodes.DOWN) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
chatango.group.GroupInput.prototype.onFocus_ = function(e) {
  if (this.userRestrictionMode_ == chatango.group.GroupChatRestrictions.UserRestrictionMode.BROADCAST) {
    var currentUser = chatango.users.UserManager.getInstance().currentUser;
    var unsignedInUser = !currentUser || !currentUser.isRegistered() || currentUser.isAnon();
    var userMayBroadcast = false;
    if (!unsignedInUser) {
      userMayBroadcast = chatango.users.ModeratorManager.getInstance().hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.CAN_BROADCAST);
    }
    if (!userMayBroadcast) {
      this.dispatchEvent(chatango.events.EventType.SET_NAME);
    }
  }
};
chatango.group.GroupInput.prototype.onKeyUp_ = function(e) {
  var code = e.keyCode;
  var ignoredCodes = [16, 17, 18, 91, 92];
  if (ignoredCodes.indexOf(code) > -1) {
    return;
  }
  this.checkIfAnimationRequired_();
  if (this.atMode_ && (code === goog.events.KeyCodes.UP || code === goog.events.KeyCodes.DOWN)) {
    var childCount = this.autocomplete_.getChildCount();
    if (code === goog.events.KeyCodes.UP) {
      this.chosenAutoIndex_ = (this.chosenAutoIndex_ - 1 + childCount) % childCount;
    } else {
      this.chosenAutoIndex_ = (this.chosenAutoIndex_ + 1) % childCount;
    }
    this.autocomplete_.setHighlightedIndex(this.chosenAutoIndex_);
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  var caretPos = this.insertNodePlugin_.getCaretPosition();
  var prevChar = this.inputEl_.textContent[caretPos - 2];
  var curChar = this.inputEl_.textContent[caretPos - 1];
  if ((prevChar == null || prevChar === " ") && curChar === "@") {
    this.atMode_ = true;
  }
  if (this.atMode_) {
    if (!(curChar && curChar.match(/^[a-zA-Z0-9@]$/))) {
      this.atMode_ = false;
      this.autocomplete_.hide();
    } else {
      var lastAt = this.inputEl_.textContent.slice(0, caretPos).lastIndexOf("@");
      if (lastAt === -1) {
        return;
      }
      var evt = new goog.events.Event(chatango.events.EventType.AUTOCOMPLETE);
      evt.data = this.inputEl_.textContent.slice(lastAt + 1, caretPos).toLowerCase();
      this.dispatchEvent(evt);
    }
  }
};
chatango.group.GroupInput.prototype.showAutocomplete = function(list) {
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  var curSid = curUser && curUser.getSid();
  var sorted = list.sort(function(a, b) {
    return b[1] - a[1];
  }).filter(function(pair) {
    return!(curSid && pair[0].toLowerCase() === curSid.toLowerCase());
  });
  this.autocomplete_.hide();
  if (sorted.length === 0) {
    return;
  }
  this.autocomplete_.removeChildren(true);
  var len = Math.min(3, sorted.length), item;
  for (var i = 0;i < len;i++) {
    item = new goog.ui.MenuItem(sorted[i][0], sorted[i][0]);
    this.autocomplete_.addChild(item, true);
  }
  this.autocomplete_.showAt(this.getTextPosition_(), goog.style.getPageOffsetTop(this.inputEl_), goog.positioning.Corner.BOTTOM_LEFT);
  this.chosenAutoIndex_ = 0;
  this.autocomplete_.setHighlightedIndex(this.chosenAutoIndex_);
};
chatango.group.GroupInput.prototype.checkIfAnimationRequired_ = function() {
  if (chatango.managers.Environment.getInstance().isDesktop() && !chatango.managers.ScaleManager.getInstance().isBelowMediumWidth()) {
    if (!this.rightInputIconsShowing_) {
      this.startRightIconAnimation(true);
    }
    if (!this.leftInputIconsShowing_) {
      this.startLeftIconAnimation(true);
    }
    return;
  }
  if (this.inputEl_.textContent.length > 0 && (chatango.managers.Keyboard.getInstance().isRaised() || chatango.managers.Environment.getInstance().isDesktop())) {
    if (this.rightInputIconsShowing_) {
      this.startRightIconAnimation(false);
    }
    if (this.leftInputIconsShowing_) {
      this.startLeftIconAnimation(false);
    }
  } else {
    if (!this.rightInputIconsShowing_) {
      this.startRightIconAnimation(true);
    }
    if (!this.leftInputIconsShowing_) {
      this.startLeftIconAnimation(true);
    }
  }
};
chatango.group.GroupInput.prototype.startRightIconAnimation = function(show) {
  var dur = 100;
  var styleBarIconEl = this.styleBarIcon_.getElement();
  var tarPos = show ? 0 : -styleBarIconEl.offsetWidth + this.arrowIconWidth_ / 2;
  var startPosition = this.iconRightPos_;
  this.removeRightIconAnimation_();
  this.rightAnim_ = new goog.fx.Animation([startPosition, 0], [tarPos, 0], dur, chatango.transitions.Cubic.easeIn);
  goog.events.listen(this.rightAnim_, goog.fx.Animation.EventType.ANIMATE, this.onRightAnimationTick_, false, this);
  goog.events.listen(this.rightAnim_, goog.fx.Animation.EventType.FINISH, this.onRightAnimationFinish_, false, this);
  this.rightAnim_.play();
  this.rightInputIconsShowing_ = show;
  this.setIconVisibility();
};
chatango.group.GroupInput.prototype.onRightAnimationTick_ = function(e) {
  this.iconRightPos_ = e.x;
  this.schedulePositionElements();
};
chatango.group.GroupInput.prototype.onRightAnimationFinish_ = function(e) {
  this.removeRightIconAnimation_();
  this.setIconVisibility();
  this.onRightAnimationTick_(e);
};
chatango.group.GroupInput.prototype.removeRightIconAnimation_ = function(e) {
  if (this.rightAnim_) {
    goog.events.unlisten(this.rightAnim_, goog.fx.Animation.EventType.ANIMATE, this.onRightAnimationTick_, false, this);
    goog.events.unlisten(this.rightAnim_, goog.fx.Animation.EventType.FINISH, this.onRightAnimationFinish_, false, this);
    this.rightAnim_.dispose();
    this.rightAnim_ = null;
  }
};
chatango.group.GroupInput.prototype.startLeftIconAnimation = function(show) {
  var dur = 100;
  var rightMostIconDiv = chatango.group.channels.ChannelController.getInstance().getChannelsEnabled() ? this.channelIcon_.getElement() : this.mediaUploadButton_.getElement();
  var tarPos = show ? 0 : -rightMostIconDiv.offsetLeft - rightMostIconDiv.offsetWidth + this.arrowIconWidth_ / 2;
  var startPosition = this.iconLeftPos_;
  this.removeLeftIconAnimation_();
  this.leftAnim_ = new goog.fx.Animation([startPosition, 0], [tarPos, 0], dur, chatango.transitions.Cubic.easeIn);
  goog.events.listen(this.leftAnim_, goog.fx.Animation.EventType.ANIMATE, this.onLeftAnimationTick_, false, this);
  goog.events.listen(this.leftAnim_, goog.fx.Animation.EventType.FINISH, this.onLeftAnimationFinish_, false, this);
  this.leftAnim_.play();
  this.leftInputIconsShowing_ = show;
  this.setIconVisibility();
};
chatango.group.GroupInput.prototype.onLeftAnimationTick_ = function(e) {
  this.iconLeftPos_ = e.x;
  this.schedulePositionElements();
};
chatango.group.GroupInput.prototype.onLeftAnimationFinish_ = function(e) {
  this.removeLeftIconAnimation_();
  this.setIconVisibility();
  this.onLeftAnimationTick_(e);
};
chatango.group.GroupInput.prototype.removeLeftIconAnimation_ = function(e) {
  if (this.leftAnim_) {
    goog.events.unlisten(this.leftAnim_, goog.fx.Animation.EventType.ANIMATE, this.onLeftAnimationTick_, false, this);
    goog.events.unlisten(this.leftAnim_, goog.fx.Animation.EventType.FINISH, this.onLeftAnimationFinish_, false, this);
    this.leftAnim_.dispose();
    this.leftAnim_ = null;
  }
};
chatango.group.GroupInput.prototype.onLeftArrowClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  this.startLeftIconAnimation(true);
  e.stopPropagation();
};
chatango.group.GroupInput.prototype.onRightArrowClicked_ = function(e) {
  if (!chatango.managers.TouchHandler.getInstance().touchCausedClick(e)) {
    return;
  }
  this.startRightIconAnimation(true);
  e.stopPropagation();
};
chatango.group.GroupInput.prototype.updateChannelsEnabled = function(opt_e) {
  if (this.channelPickerModule_) {
    this.channelPickerModule_.closeChannelPicker();
  }
  var cc = chatango.group.channels.ChannelController.getInstance();
  if (this.channelIcon_ && cc.getChannelsEnabled()) {
    this.channelIcon_.setModsBold(cc.isPermittedToSeeModChannel() && cc.channelsEnabledFlagSet());
  }
  if (this.getElement()) {
    this.updateChannelStripes_();
    this.scheduleDraw();
  }
};
chatango.group.GroupInput.prototype.openChannelsFilter = function(opt_e) {
  goog.module.ModuleManager.getInstance().execOnLoad("ChannelPickerModule", function() {
    this.getChannelPickerModule_().openChannelPicker(this.inputEl_, true);
  }, this);
};
chatango.group.GroupInput.prototype.onDisconnect = function() {
  this.setEnabled(false);
  this.lastUseBackground_ = null;
};
chatango.group.GroupInput.prototype.disposeInternal = function() {
  goog.events.unlisten(this.inputEl_, goog.events.EventType.KEYUP, this.onKeyUp_, false, this);
  goog.events.unlisten(this.inputEl_, goog.events.EventType.KEYDOWN, this.onKeyDown_, false, this);
  this.removeLeftIconAnimation_();
  this.removeRightIconAnimation_();
  goog.events.unlisten(chatango.users.ModeratorManager.getInstance(), chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, this.updateChannelsEnabled, false, this);
  goog.events.unlisten(this.msManager_, chatango.managers.MessageStyleManager.EventType.USER_CHANGED, this.onUserChange_, false, this);
  goog.events.unlisten(this.msManager_, chatango.managers.MessageStyleManager.EventType.MSG_STYLES_ALLOWED_CHANGED, this.styleChanged_, false, this);
  goog.events.unlisten(chatango.group.channels.ChannelController.getInstance(), chatango.group.channels.ChannelController.EventType.CHANNEL_CHANGE, this.updateCurrentChannel_, false, this);
  goog.events.unlisten(chatango.group.channels.ChannelController.getInstance(), chatango.events.EventType.ENABLE_CHANNELS_UPDATE, this.updateChannelsEnabled, false, this);
  goog.events.unlisten(chatango.group.channels.ChannelController.getInstance(), chatango.group.channels.ChannelController.EventType.OPEN_FILTER_DIALOG, this.openChannelsFilter, false, this);
  chatango.group.GroupInput.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.AutoMessenger");
goog.require("goog.dom");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.Timer");
goog.require("goog.events");
goog.require("goog.events.EventTarget");
goog.require("chatango.output.OutputWindow");
goog.require("chatango.messagedata.GroupMessageData");
chatango.group.AutoMessenger = function(output, connection, opt_interval, opt_messages, opt_groupName, opt_randomInterval) {
  this.messages_ = opt_messages;
  this.output_ = output;
  this.connection_ = connection;
  this.lastTick_ = new Date;
  this.ticks_ = 0;
  this.groupName_ = opt_groupName ? opt_groupName : "";
  if (opt_interval) {
    this.interval_ = opt_interval;
  } else {
    this.interval_ = 1E3;
  }
  this.randomInterval_ = opt_randomInterval == true;
  this.startTime_ = (new Date).getTime();
  this.onTick();
};
chatango.group.AutoMessenger.TOTAL_MSGS_TO_SEND = 2E3;
chatango.group.AutoMessenger.prototype.logger = goog.debug.Logger.getLogger("chatango.group.AutoMessenger");
chatango.group.AutoMessenger.prototype.onTick = function() {
  var tm;
  if (this.ticks_ % 50 == 0) {
    this.lastTick_ = new Date;
  }
  this.ticks_ = this.ticks_ + 1;
  var d = new Date;
  var ts = Math.round(d.getTime() / 1E3);
  var mt;
  if (this.messages_) {
    var index = (this.ticks_ - 1) % this.messages_.length;
    var message = this.messages_[index][1];
    var name = this.messages_[index][0];
    mt = "b:" + ts + ":" + name + "::83875698::2pCyx15=::0::" + message;
  } else {
    var rand_num = Math.round(Math.random() * 10);
    var use_smileys_etc = true;
    if (rand_num == 1 && this.ticks_ > 1E3 && use_smileys_etc) {
      mt = "b:1326329258:josh::83875698::2pCyx15=::12::<n03C/><f x1190F='0'>http://www.geeky-gadgets.com/wp-content/uploads/2014/09/Apple-Watch-3.jpg";
    } else {
      if (rand_num == 3 && use_smileys_etc) {
        mt = "b:1326329258:josh::83875698::2pCyx15=::12::<n03C/><f x1190F='0'>cm://";
      } else {
        if (rand_num == 4 && use_smileys_etc) {
          mt = "b:1326329258:josh::83875698::2pCyx15=::12::<n03C/><f x1190F='0'>:)+30?random :) ;) :(";
        } else {
          mt = "b:" + ts + ":a200::83875698::MsgId" + this.ticks_ + "::12::Msg " + this.ticks_ + " " + this.randomText();
        }
      }
    }
  }
  this.connection_.onData({"message":mt});
  if (this.ticks_ % 50 == 0) {
    var tm = new Date;
    var trace_txt = "Last 50: " + (tm.getTime() - this.lastTick_.getTime());
    if (chatango.DEBUG) {
      this.logger.info(trace_txt);
    }
  }
  if (this.ticks_ < chatango.group.AutoMessenger.TOTAL_MSGS_TO_SEND) {
    var self = this;
    var next = this.interval_;
    if (this.randomInterval_) {
      next = Math.max(800, Math.random() * 8E3);
    }
    if (this.timeout_ != null) {
      clearTimeout(this.timeout_);
    }
    this.timeout_ = setTimeout(function() {
      self.onTick();
    }, next);
  }
};
chatango.group.AutoMessenger.prototype.prepopulate = function() {
  if (this.messages_) {
    var d = new Date;
    var ts = Math.round(d.getTime() / 1E3);
    for (var i = 0;i < this.messages_.length;i++) {
      var message = this.messages_[i][1];
      var name = this.messages_[i][0];
      mt = "i:" + ts + ":" + name + "::83875698::2pCyx15=::0::" + message;
      this.output_.addMessage(new chatango.messagedata.GroupMessageData(mt));
    }
  }
};
chatango.group.AutoMessenger.prototype.start = function() {
  this.onTick();
};
chatango.group.AutoMessenger.prototype.stop = function() {
  clearTimeout(this.timeout_);
};
chatango.group.AutoMessenger.prototype.randomText = function() {
  var chars = "abcdefghiklmnopqrstuvwxyz                  ";
  var string_length = Math.random() * 200 + 10;
  var randomstring = "";
  var rnum;
  for (var i = 0;i < string_length;i++) {
    rnum = Math.floor(Math.random() * (chars.length - 1));
    randomstring += chars[rnum];
  }
  return randomstring;
};
chatango.group.AutoMessenger.prototype.dispose = function() {
  this.stop();
  this.messages_ = null;
  this.output_ = null;
  this.lastTick_ = null;
  this.ticks_ = null;
  this.interval_ = null;
  this.startTime_ = null;
};
goog.provide("chatango.group.moderation.ModerationManager");
chatango.group.moderation.ModerationManager = function() {
  this.easyBanIsOn_ = false;
};
goog.addSingletonGetter(chatango.group.moderation.ModerationManager);
chatango.group.moderation.ModerationManager.ManagerType = "ModManager";
chatango.group.moderation.ModerationManager.prototype.getEasyBanIsOn = function() {
  return this.easyBanIsOn_;
};
chatango.group.moderation.ModerationManager.prototype.setEasyBanIsOn = function(easyBanIsOn) {
  this.easyBanIsOn_ = easyBanIsOn;
};
goog.provide("chatango.ui.GroupVolumeControl");
goog.require("chatango.ui.VolumeControl");
goog.require("chatango.ui.icons.SvgSpeakerIcon");
chatango.ui.GroupVolumeControl = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.speakerBtn_ = new chatango.ui.icons.SvgSpeakerIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.appControlled_ = chatango.managers.Environment.getInstance().isAndroidApp() && window["android"] && window["android"]["openSettings"];
};
goog.inherits(chatango.ui.GroupVolumeControl, chatango.ui.VolumeControl);
chatango.ui.GroupVolumeControl.prototype.speakerBtnClicked = function(e) {
  if (this.appControlled_) {
    window["android"]["openSettings"]();
    return;
  }
  goog.module.ModuleManager.getInstance().execOnLoad("SoundDialogModule", function() {
    this.getSoundDialogModule_().openSoundDialog(this.speakerBtn_.getElement());
  }, this);
};
chatango.ui.GroupVolumeControl.prototype.getSoundDialogModule_ = function() {
  if (typeof this.soundDialogModule_ === "undefined") {
    this.soundDialogModule_ = new chatango.modules.SoundDialogModule;
  }
  return this.soundDialogModule_;
};
chatango.ui.GroupVolumeControl.prototype.setState = function(muted, volume, atReplysAubible, mutedWhenHidden) {
  if (this.appControlled_) {
    this.speakerBtn_.setDrawState(chatango.ui.icons.SvgSpeakerIcon.DrawState.ON);
    return;
  }
  if (!muted) {
    this.speakerBtn_.setDrawState(chatango.ui.icons.SvgSpeakerIcon.DrawState.ON);
  } else {
    if (atReplysAubible) {
      this.speakerBtn_.setDrawState(chatango.ui.icons.SvgSpeakerIcon.DrawState.REPLYS_ONLY);
    } else {
      this.speakerBtn_.setDrawState(chatango.ui.icons.SvgSpeakerIcon.DrawState.OFF);
    }
  }
};
goog.provide("chatango.group.GroupFooterMenuEventType");
chatango.group.GroupFooterMenuEventType = {OPEN_SETTINGS:"o_set", OPEN_MODERATION:"o_mod", OPEN_LOGIN:"o_log", OPEN_PM:"o_pm"};
goog.provide("chatango.ui.icons.SvgShareIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgShareIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.SvgShareIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgShareIcon.prototype.draw = function() {
  var dur = 400;
  var begin = 500;
  var rad = 12;
  var defs;
  if (goog.userAgent.IE) {
    defs = '<circle cx="70" cy="20" r="' + rad + '" fill="' + this.color_ + '"/>' + '<circle cx="70" cy="80" r="' + rad + '" fill="' + this.color_ + '"/>' + '<circle cx="30" cy="50" r="' + rad + '" fill="' + this.color_ + '"/>' + '<path d="M 30 50 L 70 20" stroke="' + this.color_ + '" stroke-width="7"/>' + '<path d="M 30 50 L 70 80" stroke="' + this.color_ + '" stroke-width="7"/>';
  } else {
    defs = '<circle cx="30" cy="50" r="' + rad + '" fill="' + this.color_ + '">' + '<animate attributeName="cx" from="30" to="70" dur="' + dur + 'ms" begin="' + begin + 'ms" fill = "freeze"/>' + '<animate attributeName="cy" from="50" to="20" dur="' + dur + 'ms" begin="' + begin + 'ms" fill = "freeze"/>' + "</circle>" + '<circle cx="30" cy="50" r="' + rad + '" fill="' + this.color_ + '">' + '<animate attributeName="cx" from="30" to="70" dur="' + dur + 'ms" begin="' + begin + 'ms" fill = "freeze"/>' + 
    '<animate attributeName="cy" from="50" to="80" dur="' + dur + 'ms" begin="' + begin + 'ms" fill = "freeze"/>' + "</circle>" + '<circle cx="30" cy="50" r="' + rad + '" fill="' + this.color_ + '"/>' + '<path d="M 30 50 L 30 50" stroke="' + this.color_ + '" stroke-width="7">' + '<animate  dur="' + dur + 'ms" begin="' + begin + 'ms" attributeName="d" values="M 30 50 L 30 50; M 30 50 L 70 20;"  fill = "freeze"/>' + "</path>" + '<path d="M 30 50 L 30 50" stroke="' + this.color_ + '" stroke-width="7">' + 
    '<animate  dur="' + dur + 'ms" begin="' + begin + 'ms" attributeName="d" values="M 30 50 L 30 50; M 30 50 L 70 80;"  fill = "freeze"/>' + "</path>";
  }
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<g style="display: block;">' + defs + "</g>" + "</svg>";
};
goog.provide("chatango.ui.icons.SvgModHammerIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgModHammerIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.SvgModHammerIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgModHammerIcon.prototype.draw = function() {
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<g style="display: block;">' + '<path d="M 55.55 42.25 L 99.95 86.7 86.65 100 42.2 55.6 31.15 66.7 ' + "35.55 71.1 31.1 75.55 0 44.45 4.45 40 8.9 44.45 44.45 8.95 39.95 4.45 " + '44.4 0 75.5 31.1 71.05 35.55 66.65 31.15" stroke="none" fill="' + this.color_ + '" fill-opacity="1"></path>' + "</g>" + "</svg>";
};
goog.provide("chatango.ui.icons.SvgStarIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgStarIcon = function(opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.useStarAspectRatio_ = true;
};
goog.inherits(chatango.ui.icons.SvgStarIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgStarIcon.prototype.draw = function() {
  if (this.useStarAspectRatio_) {
    goog.dom.classes.add(this.element_, "icon-star");
  } else {
    goog.dom.classes.remove(this.element_, "icon-star");
  }
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 107 100">' + "<defs></defs>" + '<g style="display: block;">' + '<path fill="' + this.color_ + '" stroke="none" d="M 54 2 L 67 39 107 39 76 63 87 100 54 78 22 100 33 63 2 39 41 39 Z"></path>' + "</g>" + "</svg>";
};
chatango.ui.icons.SvgStarIcon.prototype.setUseStarAspectRatio = function(bool) {
  this.useStarAspectRatio_ = bool;
  if (this.element_) {
    this.draw();
  }
};
goog.provide("chatango.settings.servers.MessageCatcherServer");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.settings.servers.BaseDomain");
chatango.settings.servers.MessageCatcherServer = function() {
};
goog.addSingletonGetter(chatango.settings.servers.MessageCatcherServer);
chatango.settings.servers.MessageCatcherServer.SERVER_PREFIX = "i0";
chatango.settings.servers.MessageCatcherServer.prototype.getHost = function() {
  var host = chatango.settings.servers.MessageCatcherServer.SERVER_PREFIX + "." + chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getMessageCatcherServerBaseDomain();
  return host;
};
goog.provide("chatango.networking.MessageCatcherConnectionEvent");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
chatango.networking.MessageCatcherConnectionEvent = function(type, data) {
  goog.base(this, type);
  this.type = type;
  this.data = data;
};
goog.inherits(chatango.networking.MessageCatcherConnectionEvent, goog.events.Event);
chatango.networking.MessageCatcherConnectionEvent.EventType = {};
chatango.networking.MessageCatcherConnectionEvent.EventLookup = {};
chatango.networking.MessageCatcherConnectionEvent.EventLookup["msgcount"] = chatango.networking.MessageCatcherConnectionEvent.EventType.msgcount = goog.events.getUniqueId("msgcount");
chatango.networking.MessageCatcherConnectionEvent.EventLookup["msg"] = chatango.networking.MessageCatcherConnectionEvent.EventType.msg = goog.events.getUniqueId("msg");
goog.provide("chatango.networking.MessageCatcherConnection");
goog.require("chatango.networking.BaseConnection");
goog.require("chatango.networking.CommonConnectionEvent");
goog.require("chatango.networking.MessageCatcherConnectionEvent");
goog.require("chatango.settings.servers.MessageCatcherServer");
goog.require("chatango.utils.Encode");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.net.WebSocket");
goog.require("goog.net.cookies");
chatango.networking.MessageCatcherConnection = function() {
  var bd = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType);
  var protocol = bd.getProtocol().replace(":", "");
  var secure = protocol === "https";
  var ports = secure ? bd.getMessageCatcherSecurePorts() : bd.getMessageCatcherPorts();
  var server = chatango.settings.servers.MessageCatcherServer.getInstance().getHost();
  goog.base(this, ports, server, secure);
};
goog.inherits(chatango.networking.MessageCatcherConnection, chatango.networking.BaseConnection);
chatango.networking.MessageCatcherConnection.prototype.onData = function(event) {
  var arr = event.message.split("\r\n")[0].split(":");
  if (arr[0] == "OK") {
    if (!this.versionAuthenticated_) {
      this.versionAuthenticated_ = true;
      this.initHandShake();
      return;
    } else {
      arr[0] = "ok";
    }
  }
  var cmd_type = "mc";
  var e_name = chatango.networking.MessageCatcherConnectionEvent.EventLookup[arr[0]];
  if (!e_name) {
    e_name = chatango.networking.CommonConnectionEvent.EventLookup[arr[0]];
    cmd_type = "common";
  }
  if (!e_name) {
    if (chatango.DEBUG) {
      if (arr.toString() == "") {
        console.log("PING FROM Msg Catcher SERVER");
      } else {
        console.log("Unhandled msg catcher command:", arr);
      }
    }
    return;
  }
  if (cmd_type == "mc") {
    if (chatango.DEBUG) {
      this.logger.info("dispatch MessageCatcher ConnectionEvent:" + e_name);
    }
    var mcEvent = new chatango.networking.MessageCatcherConnectionEvent(e_name, arr);
    this.dispatchEvent(mcEvent);
  } else {
    if (chatango.DEBUG) {
      this.logger.info("dispatch MC Common ConnectionEvent:" + e_name);
    }
    this.dispatchEvent(new chatango.networking.CommonConnectionEvent(e_name, arr));
  }
};
chatango.networking.MessageCatcherConnection.prototype.onConnect = function() {
  chatango.networking.MessageCatcherConnection.superClass_.onConnect.call(this);
  if (chatango.DEBUG) {
    console.log("MessageCatcherConnection.prototype.onConnect");
  }
  this.send("version:4:1");
};
chatango.networking.MessageCatcherConnection.prototype.initHandShake = function() {
  var username = goog.net.cookies.get("un") || "";
  var password = goog.net.cookies.get("pw") || "";
  if (username != "") {
    var encoder = chatango.utils.Encode.getInstance();
    username = encoder.decode(username);
    password = encoder.decode(password);
  } else {
    return;
  }
  var handshake_array = ["login", username, password];
  var hs = handshake_array.join(":");
  this.send(hs);
};
chatango.networking.MessageCatcherConnection.prototype.CONNECTION_TYPE = "msgcatcon";
chatango.networking.MessageCatcherConnection.prototype.getConnectionType = function() {
  return chatango.networking.MessageCatcherConnection.prototype.CONNECTION_TYPE;
};
chatango.networking.MessageCatcherConnection.prototype.clientAuthenticated = function(e) {
  chatango.networking.MessageCatcherConnection.superClass_.clientAuthenticated.call(this, e);
};
goog.provide("chatango.utils.color");
goog.require("goog.color");
chatango.utils.color.lightenHex = function(hex, factor) {
  return goog.color.rgbArrayToHex(goog.color.lighten(goog.color.hexToRgb(hex), factor));
};
chatango.utils.color.isDark = function(hex) {
  return Math.round(goog.color.hexToHsl(hex)[2]) == 0;
};
chatango.utils.color.getRandomColor = function() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};
chatango.utils.color.compressHex = function(hex) {
  if (hex.charAt(0) == hex.charAt(1) && hex.charAt(2) == hex.charAt(3) && hex.charAt(4) == hex.charAt(5)) {
    return hex.charAt(0) + hex.charAt(2) + hex.charAt(4);
  }
  return hex;
};
chatango.utils.color.expandHex = function(hex) {
  if (hex.length == 1) {
    return hex + hex + hex + hex + hex + hex;
  } else {
    if (hex.length == 3) {
      return hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    }
  }
  return hex;
};
goog.provide("chatango.ui.icons.SvgLogoIcon");
goog.require("chatango.managers.Environment");
goog.require("chatango.ui.icons.SvgIcon");
goog.require("chatango.utils.color");
chatango.ui.icons.SvgLogoIcon = function(opt_color, opt_textColor, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  if (opt_textColor == chatango.ui.icons.Icon.USE_USER_DEFINED_COLOR) {
    opt_textColor = chatango.managers.Style.getInstance().getBackgroundColor();
    goog.events.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.USER_DEFINED_BG_STYLE_CHANGED, this.onTextColorUpdate, null, this);
  }
  this.textColor_ = opt_textColor || "#FFFFFF";
  this.setIsFull(false);
  this.shortText_ = "C";
  this.longText_ = "Chatango";
};
goog.inherits(chatango.ui.icons.SvgLogoIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgLogoIcon.prototype.createDom = function() {
  chatango.ui.icons.SvgLogoIcon.superClass_.createDom.call(this);
};
chatango.ui.icons.SvgLogoIcon.prototype.setText = function(text, isLong) {
  if (isLong) {
    this.longText_ = text;
  } else {
    this.shortText_ = text;
  }
};
chatango.ui.icons.SvgLogoIcon.prototype.setTextColor = function(color) {
  this.textColor_ = color;
};
chatango.ui.icons.SvgLogoIcon.prototype.isFull_ = false;
chatango.ui.icons.SvgLogoIcon.prototype.setIsFull = function(state) {
  this.isFull_ = state;
  if (!this.element_) {
    return;
  }
  if (this.isFull_) {
    goog.dom.classes.add(this.element_, "icon-full-logo");
    goog.dom.classes.remove(this.element_, "icon-sm-logo");
  } else {
    goog.dom.classes.add(this.element_, "icon-sm-logo");
    goog.dom.classes.remove(this.element_, "icon-full-logo");
  }
  this.draw();
};
chatango.ui.icons.SvgLogoIcon.prototype.isCollapsedView_ = false;
chatango.ui.icons.SvgLogoIcon.prototype.setCollapsedView = function(bool) {
  this.isCollapsedView_ = bool;
  if (!this.element_) {
    return;
  }
  if (bool) {
    this.setIsFull(false);
  } else {
    this.draw();
  }
};
chatango.ui.icons.SvgLogoIcon.prototype.setVerticalAlign_ = function() {
  return;
};
chatango.ui.icons.SvgLogoIcon.prototype.isFull = function() {
  return this.isFull_;
};
chatango.ui.icons.SvgLogoIcon.prototype.onTextColorUpdate = function(e) {
  this.textColor_ = chatango.managers.Style.getInstance().getBackgroundColor();
  this.draw();
};
chatango.ui.icons.SvgLogoIcon.prototype.draw = function() {
  var textColor = this.textColor_;
  if (this.color_ == textColor) {
    textColor = chatango.utils.color.isDark(this.color_) ? "#FFFFFF" : "#000000";
  }
  var crispEdges = ' shape-rendering="crispEdges"';
  var svg;
  if (this.isFull_) {
    svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 240 100">' + "<defs></defs>" + '<g style="display: block;">';
    svg += '<path d="M 0 0 L 240 0 240 74 0 74 0 0 Z" stroke="#ffffff" stroke-width="0" fill="' + this.color_ + '" fill-opacity="1"' + crispEdges + "></path>";
    svg += '<path d="M 42 72 42 100 21 72 Z" stroke="#ffffff" stroke-width="0" fill="' + this.color_ + '" fill-opacity="1"></path>';
    svg += '<text font-family="Helmet, Freesan, Roboto, sans-serif" font-size="45" text-anchor="middle" x="119.5" y="52" stroke="none" fill="' + textColor + '" fill-opacity="1">' + this.longText_ + "</text>";
  } else {
    if (this.isCollapsedView_) {
      svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<g style="display: block;">';
      svg += '<path d="M 0 0 L 100 0 100 68 0 68 0 0 Z" stroke="#ffffff" stroke-width="0" fill="' + this.color_ + '" fill-opacity="1"' + crispEdges + "></path>";
      svg += '<path d="M 42 66 42 100 18 66 Z" stroke="#ffffff" stroke-width="0" fill="' + this.color_ + '" fill-opacity="1"></path>';
    } else {
      svg = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 85 100">' + "<defs></defs>" + '<g style="display: block;">';
      svg += '<path d="M 0 0 L 85 0 85 74 0 74 0 0 Z" stroke="#ffffff" stroke-width="0" fill="' + this.color_ + '" fill-opacity="1"' + crispEdges + "></path>";
      svg += '<path d="M 42 72 42 100 21 72 Z" stroke="#ffffff" stroke-width="0" fill="' + this.color_ + '" fill-opacity="1"></path>';
      svg += '<text font-family="Helmet, Freesan, Roboto, sans-serif" font-size="45" text-anchor="middle" x="40" y="52" stroke="none" fill="' + textColor + '" fill-opacity="1">' + this.shortText_ + "</text>";
    }
  }
  svg += "</g></svg>";
  this.element_.innerHTML = svg;
};
goog.provide("chatango.group.MessageCatcherView");
goog.require("chatango.managers.Style");
goog.require("chatango.ui.icons.SvgLogoIcon");
goog.require("chatango.networking.MessageCatcherConnection");
goog.require("chatango.networking.MessageCatcherConnectionEvent");
goog.require("goog.events");
chatango.group.MessageCatcherView = function(mcMod, embedType) {
  goog.ui.Component.call(this);
  this.mcMod_ = mcMod;
  this.embedType_ = embedType;
  this.logoIcon_ = new chatango.ui.icons.SvgLogoIcon("#fc0", "#000");
  this.count_ = 0;
  this.useAsProxyLogo_ = false;
};
goog.inherits(chatango.group.MessageCatcherView, goog.ui.Component);
chatango.group.MessageCatcherView.prototype.setMessageCatcher = function(mcMod) {
  this.mcMod_ = mcMod;
  this.draw();
  if (!this.mcMod_) {
    return;
  }
  goog.events.listen(this.mcMod_, chatango.networking.MessageCatcherConnectionEvent.EventType.msgcount, this.onMessageCount_, false, this);
  goog.events.listen(this.mcMod_, chatango.networking.MessageCatcherConnectionEvent.EventType.msg, this.onMessage_, false, this);
  goog.events.listen(this.mcMod_, chatango.networking.ConnectionStatusEvent.EventType.CONNECTED, this.onConnect_, false, this);
  goog.events.listen(this.mcMod_, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.onDisconnect_, false, this);
};
chatango.group.MessageCatcherView.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"ftr-mcv ftr_el icon-v-ctr"});
  this.draw();
};
chatango.group.MessageCatcherView.prototype.useAsProxyLogo = function(bool) {
  this.useAsProxyLogo_ = bool;
  if (this.element_) {
    this.draw();
  }
};
chatango.group.MessageCatcherView.prototype.inGroupFooterMenu = function(bool, col) {
  this.inGroupFooterMenu_ = bool;
  if (bool && col != undefined) {
    this.ftrMenuIconColor_ = col;
  }
};
chatango.group.MessageCatcherView.prototype.draw = function() {
  if ((!this.mcMod_ || !this.mcMod_.isConnected()) && !this.useAsProxyLogo_) {
    if (this.logoIcon_.getElement()) {
      goog.style.showElement(this.logoIcon_.getElement(), false);
    }
    return;
  }
  if (this.logoIcon_.getElement()) {
    goog.style.showElement(this.logoIcon_.getElement(), true);
  }
  if (!this.logoIcon_.getElement()) {
    this.logoIcon_.render(this.element_);
    this.logoIcon_.setIsFull(false);
  }
  var styleManager = chatango.managers.Style.getInstance();
  var msg = this.useAsProxyLogo_ && this.count_ == 0 ? "C" : Math.min(50, this.count_);
  this.logoIcon_.setText(msg);
  if (msg == 0) {
    if (this.inGroupFooterMenu_) {
      this.logoIcon_.setColor(this.ftrMenuIconColor_);
    } else {
      this.logoIcon_.setColor(styleManager.getUserDefinedIconColor());
    }
    this.logoIcon_.setTextColor("transparent");
  } else {
    if (msg == "C") {
      this.logoIcon_.setColor(styleManager.getUserDefinedIconColor());
      this.logoIcon_.setTextColor(styleManager.getBackgroundColor());
    } else {
      this.logoIcon_.setColor("#fc0");
      this.logoIcon_.setTextColor("#000");
    }
  }
  this.logoIcon_.draw();
};
chatango.group.MessageCatcherView.prototype.onConnect_ = function(e) {
  this.draw();
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.group.MessageCatcherView.prototype.onDisconnect_ = function(e) {
  this.draw();
};
chatango.group.MessageCatcherView.prototype.onMessageCount_ = function(e) {
  this.count_ = parseInt(e.data[1], 10);
  this.draw();
};
chatango.group.MessageCatcherView.prototype.onMessage_ = function(e) {
  this.count_ += 1;
  this.draw();
};
chatango.group.MessageCatcherView.prototype.disposeInternal = function() {
  if (this.mcMod_) {
    goog.events.unlisten(this.mcMod_, chatango.networking.MessageCatcherConnectionEvent.EventType.msgcount, this.onMessageCount_, false, this);
    goog.events.unlisten(this.mcMod_, chatango.networking.MessageCatcherConnectionEvent.EventType.msg, this.onMessage_, false, this);
  }
};
goog.provide("chatango.group.GroupFooter");
goog.require("goog.debug.Logger");
goog.require("goog.module.ModuleManager");
goog.require("goog.ui.Component");
goog.require("goog.window");
goog.require("goog.positioning.Corner");
goog.require("chatango.embed.AppComm");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.group.participants.ParticipantsCounter");
goog.require("chatango.group.MessageCatcherView");
goog.require("chatango.ui.GroupVolumeControl");
goog.require("chatango.ui.icons.SvgModHammerIcon");
goog.require("chatango.ui.icons.SvgSettingsCogIcon");
goog.require("chatango.ui.icons.SvgStarIcon");
goog.require("chatango.ui.icons.SvgShareIcon");
goog.require("chatango.ui.icons.Icon");
goog.require("chatango.utils.userAgent");
goog.require("chatango.group.GroupFooterMenuEventType");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.Environment");
goog.require("goog.ui.LinkButtonRenderer");
chatango.group.GroupFooter = function(groupInfo, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setNameButton_ = new goog.ui.Button(this.lm_.getString("basic_group", "set_name"), goog.ui.LinkButtonRenderer.getInstance());
  this.volumeControl_ = new chatango.ui.GroupVolumeControl;
  this.addChild(this.volumeControl_, false);
  this.participantsCounter_ = new chatango.group.participants.ParticipantsCounter(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.starIcon_ = new chatango.ui.icons.SvgStarIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.starIcon_.setVerticallyCentered(true);
  this.shareIcon_ = new chatango.ui.icons.SvgShareIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.shareIcon_.setVerticallyCentered(true);
  this.settingsCogIcon_ = new chatango.ui.icons.SvgSettingsCogIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.settingsCogIcon_.setVerticallyCentered(true);
  this.modHammerIcon_ = new chatango.ui.icons.SvgModHammerIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.modHammerIcon_.setVerticallyCentered(true);
  this.groupInfo_ = groupInfo;
  this.mcView_ = new chatango.group.MessageCatcherView;
  goog.events.listen(this.mcView_, chatango.events.EventType.UPDATE, this.mcUpdated, false, this);
  this.useFooterIconMenu_ = false;
  this.groupConnection_ = null;
  this.messageCatcherModule_ = null;
  this.anonsAllowed_ = true;
  goog.events.listen(groupInfo, chatango.events.EventType.SHOW_COUNTER_UPDATE, this.onShowCounterUpdate_, false, this);
};
goog.inherits(chatango.group.GroupFooter, goog.ui.Component);
chatango.group.GroupFooter.prototype.logger = goog.debug.Logger.getLogger("chatango.group.GroupFooter");
chatango.group.GroupFooter.prototype.createDom = function() {
  var styleManager = chatango.managers.Style.getInstance();
  this.element_ = goog.dom.createDom("div", {"id":"FTR"});
  this.leftIconsEl_ = goog.dom.createDom("div", {"id":"FTR_LEFT"});
  this.logoEl_ = goog.dom.createDom("div", {"id":"FTR_LOGO", "class":"icon ftr_el icon-v-ctr"});
  this.logoButton_ = new goog.ui.Button("Chatango", goog.ui.LinkButtonRenderer.getInstance());
  this.logoButton_.addClassName("txt-v-ctr logo-btn");
  goog.dom.appendChild(this.leftIconsEl_, this.logoEl_);
  goog.style.showElement(this.logoEl_, false);
  this.logoButton_.render(this.logoEl_);
  this.mcView_.render(this.leftIconsEl_);
  goog.style.showElement(this.mcView_.getElement(), !chatango.managers.Environment.getInstance().isAndroidApp());
  this.shareIcon_.render(this.leftIconsEl_);
  goog.dom.classes.add(this.shareIcon_.getElement(), "ftr_el");
  if (!chatango.managers.Environment.getInstance().isAndroidApp() || !chatango.embed.AppComm.getInstance().canShareWebView()) {
    this.shareIcon_.setVisible(false);
  }
  goog.dom.appendChild(this.element_, this.leftIconsEl_);
  this.appEl_ = goog.dom.createDom("div", {"class":"icon ftr_el icon-v-ctr", "style":"width:auto;"});
  this.appButton_ = new goog.ui.Button(" ", goog.ui.LinkButtonRenderer.getInstance());
  this.appButton_.addClassName("txt-v-ctr logo-btn");
  goog.dom.appendChild(this.leftIconsEl_, this.appEl_);
  goog.style.showElement(this.appEl_, false);
  this.appButton_.render(this.appEl_);
  this.rightSideWrapperEl_ = goog.dom.createDom("div", {"id":"FTR_RIGHT"});
  goog.dom.appendChild(this.element_, this.rightSideWrapperEl_);
  this.volumeControl_.render(this.rightSideWrapperEl_);
  var elt = this.volumeControl_.getElement();
  goog.style.setInlineBlock(elt);
  goog.dom.classes.add(elt, "icon-v-ctr");
  this.participantsCounter_.render(this.rightSideWrapperEl_);
  elt = this.participantsCounter_.getElement();
  elt.id = "FTR_phn";
  goog.dom.classes.add(elt, "icon-v-ctr");
  this.starIcon_.render(this.rightSideWrapperEl_);
  this.starIcon_.setVisible(false);
  this.modHammerIcon_.render(this.rightSideWrapperEl_);
  elt = this.modHammerIcon_.getElement();
  this.modHammerIcon_.setVisible(false);
  this.modHammerIcon_.getElement().title = this.lm_.getString("basic_group", "moderation");
  this.settingsCogIcon_.render(this.rightSideWrapperEl_);
  elt = this.settingsCogIcon_.getElement();
  this.settingsCogIcon_.setVisible(false);
  this.setNameBtnEl_ = goog.dom.createDom("div", {"id":"LOGIN", "class":"ftr_el icon-v-ctr"});
  goog.dom.appendChild(this.rightSideWrapperEl_, this.setNameBtnEl_);
  this.setNameButton_.render(this.setNameBtnEl_);
  this.setNameButton_.addClassName("txt-v-ctr");
  goog.style.setStyle(this.setNameBtnEl_, "display", "none");
  if (!chatango.managers.Environment.getInstance().isMockGroup()) {
    goog.events.listen(this.modHammerIcon_.getElement(), goog.events.EventType.CLICK, function() {
      this.dispatchEvent(chatango.events.EventType.LOAD_MODERATION_MODULE);
    }, false, this);
    goog.events.listen(this.settingsCogIcon_.getElement(), goog.events.EventType.CLICK, function() {
      this.dispatchEvent(chatango.events.EventType.LOAD_SETTINGS_MODULE);
    }, false, this);
    goog.events.listen(this.setNameButton_.getElement(), goog.events.EventType.CLICK, function() {
      this.dispatchEvent(chatango.events.EventType.SET_NAME);
    }, false, this);
    goog.events.listen(this.logoEl_, goog.events.EventType.CLICK, this.onLogoClicked_, false, this);
    if (this.mcView_.getElement()) {
      goog.events.listen(this.mcView_.getElement(), goog.events.EventType.CLICK, this.onMCVClicked_, false, this);
    }
    goog.events.listen(this.shareIcon_.getElement(), goog.events.EventType.CLICK, this.onShareIconClicked_, false, this);
    goog.events.listen(this.appEl_, goog.events.EventType.CLICK, this.onAppDLClicked_, false, this);
    goog.events.listen(this.participantsCounter_.getElement(), goog.events.EventType.CLICK, this.onParticipantsCounterClicked_, false, this);
  }
  goog.events.listen(styleManager, chatango.managers.Style.EventType.USER_DEFINED_ICON_COLOR_CHANGED, this.onIconColorUpdate, null, this);
  this.onIconColorUpdate();
};
chatango.group.GroupFooter.prototype.setMessageCatcher = function(mcMod) {
  this.messageCatcherModule_ = mcMod;
  this.mcView_.setMessageCatcher(mcMod);
  if (this.ftrIconMenuModule_) {
    this.ftrIconMenuModule_.setMessageCatcher(mcMod);
  }
};
chatango.group.GroupFooter.prototype.setChatRestrictions = function(chatRestrictions) {
  this.chatRestrictions_ = chatRestrictions;
};
chatango.group.GroupFooter.prototype.onIconColorUpdate = function(e) {
  var styleManager = chatango.managers.Style.getInstance();
  var iconColor = styleManager.getUserDefinedIconColor();
  goog.style.setStyle(this.setNameButton_.getElement(), "color", iconColor);
  goog.style.setStyle(this.logoButton_.getElement(), "color", iconColor);
  goog.style.setStyle(this.appButton_.getElement(), "color", iconColor);
};
chatango.group.GroupFooter.prototype.getHeight = function() {
  var top_pad = goog.style.getPaddingBox(this.element_).top;
  return Math.ceil(Math.max(this.rightSideWrapperEl_.offsetHeight + top_pad, this.leftIconsEl_.offsetHeight + top_pad / 2));
};
chatango.group.GroupFooter.prototype.setVolumeControlState = function(muted, volume, atReplysAudible) {
  this.volumeControl_.setState(muted, volume, atReplysAudible);
};
chatango.group.GroupFooter.prototype.initCopy = function() {
  this.draw();
};
chatango.group.GroupFooter.prototype.setConnectionListener = function(con) {
  this.participantsCounter_.setConnectionListener(con);
  this.groupConnection_ = con;
};
chatango.group.GroupFooter.prototype.draw = function() {
  if (this.mcView_ && !this.mcView_.getElement()) {
    this.mcView_.render(this.element_);
  }
  this.starIcon_.setVisible(false);
  this.settingsCogIcon_.setVisible(false);
  this.modHammerIcon_.setVisible(false);
  goog.style.setStyle(this.volumeControl_.getElement(), "float", "none");
  this.participantsCounter_.centerVertically(true);
  this.useFooterIconMenu_ = false;
  var userType = null;
  if (chatango.users.UserManager.getInstance().currentUser) {
    userType = chatango.users.UserManager.getInstance().currentUser.getType();
  }
  var showPHN = this.groupInfo_.getShowCounter();
  switch(userType) {
    case chatango.users.User.UserType.TEMP:
      this.setNameButton_.setContent(this.lm_.getString("basic_group", "signin"));
      break;
    case chatango.users.User.UserType.SELLER:
      var cUser = chatango.users.UserManager.getInstance().currentUser;
      goog.style.showElement(this.mcView_.getElement(), !chatango.managers.Environment.getInstance().isAndroidApp());
      goog.style.setStyle(this.setNameBtnEl_, "display", "none");
      this.settingsCogIcon_.getElement().title = this.lm_.getString("basic_group", "settingslogout") + " " + cUser.getName();
      this.settingsCogIcon_.setVisible(true);
      this.appButton_.setContent(this.lm_.getString("basic_group", "app_dl_full"));
      goog.style.showElement(this.appEl_, chatango.utils.userAgent.isAndroidAppCompatible());
      if (cUser.isOwner()) {
        this.settingsCogIcon_.getElement().title = this.lm_.getString("basic_group", "settings");
        this.modHammerIcon_.setVisible(true);
        showPHN = true;
      } else {
        if (cUser.isModerator()) {
          this.modHammerIcon_.setVisible(true);
          showPHN = true;
        } else {
          if (cUser.getSid() == "chatango") {
            showPHN = true;
          }
        }
      }
      break;
    case null:
    ;
    case chatango.users.User.UserType.ANON:
    ;
    default:
      goog.style.showElement(this.mcView_.getElement(), false);
      goog.style.setStyle(this.setNameBtnEl_, "display", "inline-block");
      if (this.chatRestrictions_ && this.chatRestrictions_.getCurrentUserRestrictionMode() != chatango.group.GroupChatRestrictions.UserRestrictionMode.OPEN) {
        this.setNameButton_.setContent(this.lm_.getString("basic_group", "log_in"));
      } else {
        if (userType == null) {
          this.setNameButton_.setContent(this.lm_.getString("basic_group", "set_name"));
        } else {
          this.setNameButton_.setContent(this.lm_.getString("basic_group", "set_your_name"));
          if (this.needToCompactFooterIcons()) {
            this.setNameButton_.setContent(this.lm_.getString("basic_group", "set_name"));
          }
        }
      }
      this.setNameButton_.setTooltip(this.lm_.getString("basic_group", "login_btn_tooltip"));
      break;
  }
  this.participantsCounter_.setVisible(showPHN);
  var pHNTooltipString = this.lm_.getString("basic_group", "people_here_now");
  if (showPHN && !this.groupInfo_.getShowCounter()) {
    pHNTooltipString += "\n" + this.lm_.getString("basic_group", "only_vis_mods");
    this.participantsCounter_.setModsOnlyView(true);
  } else {
    this.participantsCounter_.setModsOnlyView(false);
  }
  this.participantsCounter_.getElement().title = pHNTooltipString;
  this.mcView_.useAsProxyLogo(false);
  this.mcView_.draw();
  var showLogo = false;
  if (!chatango.managers.Environment.getInstance().isMobile()) {
    showLogo = true;
  }
  if (!chatango.managers.Style.getInstance().isFullSizeGroup()) {
    showLogo = true;
  }
  goog.style.showElement(this.logoEl_, showLogo);
  if (this.needToCompactFooterIcons()) {
    this.setNameButton_.setContent(this.lm_.getString("basic_group", "name"));
  }
  if (this.needToCompactFooterIcons() && showLogo) {
    goog.style.showElement(this.logoEl_, false);
    goog.style.showElement(this.mcView_.getElement(), true);
    this.mcView_.useAsProxyLogo(true);
  }
  if (this.needToCompactFooterIcons()) {
    this.appButton_.setContent(this.lm_.getString("basic_group", "app_dl_small"));
  }
  if (this.needToCompactFooterIcons()) {
    this.appButton_.setContent(this.lm_.getString("basic_group", "app_dl_tiny"));
  }
  if (this.needToCompactFooterIcons()) {
    goog.style.showElement(this.appEl_, false);
  }
  if (this.needToCompactFooterIcons()) {
    this.useFooterIconMenu_ = true;
    this.starIcon_.setVisible(false);
    this.settingsCogIcon_.setVisible(false);
    this.modHammerIcon_.setVisible(false);
    goog.style.setStyle(this.setNameBtnEl_, "display", "none");
    goog.style.setStyle(this.volumeControl_.getElement(), "float", "right");
    this.participantsCounter_.centerVertically(false);
  }
  var rh = this.rightSideWrapperEl_.offsetHeight / 2;
  var topMar = rh + "px";
  goog.style.setStyle(this.leftIconsEl_, "margin-top", topMar);
  goog.style.setStyle(this.rightSideWrapperEl_, "margin-top", topMar);
};
chatango.group.GroupFooter.prototype.onShowCounterUpdate_ = function(e) {
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.group.GroupFooter.prototype.onParticipantsCounterClicked_ = function(e) {
  if (!this.participantsModule_) {
    goog.module.ModuleManager.getInstance().execOnLoad("ParticipantsModule", function() {
      this.getParticipantsModule_().openDialog();
    }, this);
  } else {
    this.getParticipantsModule_().openDialog();
  }
};
chatango.group.GroupFooter.prototype.getParticipantsModule_ = function() {
  if (typeof this.participantsModule_ === "undefined") {
    this.participantsModule_ = new chatango.modules.ParticipantsModule(this.groupConnection_, this.anonsAllowed_);
    goog.events.listen(this.participantsModule_, chatango.events.EventType.PARTICIPANTS_OPEN_PM, function(e) {
      this.dispatchEvent(e);
    }, false, this);
  }
  return this.participantsModule_;
};
chatango.group.GroupFooter.prototype.setAnons = function(anonsAllowed) {
  this.anonsAllowed_ = anonsAllowed;
  if (!this.participantsModule_) {
    return;
  }
  this.participantsModule_.setAnons(anonsAllowed);
};
chatango.group.GroupFooter.prototype.onShareIconClicked_ = function(e) {
  chatango.embed.AppComm.getInstance().shareWebView();
};
chatango.group.GroupFooter.prototype.onMCVClicked_ = function(e) {
  this.draw();
  if (!goog.style.isElementShown(this.logoEl_)) {
    if (this.useFooterIconMenu_) {
      if (!this.ftrIconMenuModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("FtrIconMenuModule", function() {
          this.getFtrIconMenuModule_().installMenu(this.mcView_.getElement(), true);
        }, this);
      } else {
        this.getFtrIconMenuModule_().installMenu(this.mcView_.getElement(), true);
      }
    } else {
      this.dispatchEvent(chatango.events.EventType.FOOTER_OPEN_PM);
    }
  } else {
    this.dispatchEvent(chatango.events.EventType.FOOTER_OPEN_PM);
  }
};
chatango.group.GroupFooter.prototype.onLogoClicked_ = function(e) {
  this.draw();
  if (this.useFooterIconMenu_) {
    if (!this.ftrIconMenuModule_) {
      goog.module.ModuleManager.getInstance().execOnLoad("FtrIconMenuModule", function() {
        this.getFtrIconMenuModule_().installMenu(this.logoEl_, true);
      }, this);
    } else {
      this.getFtrIconMenuModule_().installMenu(this.logoEl_, true);
    }
  } else {
    if (!this.logoMenuModule_) {
      goog.module.ModuleManager.getInstance().execOnLoad("LogoMenuModule", function() {
        this.getLogoMenuModule_().installMenu(this.logoEl_);
      }, this);
    } else {
      this.getLogoMenuModule_().installMenu(this.logoEl_);
    }
  }
};
chatango.group.GroupFooter.prototype.onAppDLClicked_ = function(e) {
  window.top.location = "http://play.google.com/store/apps/details?id=com.chatango.android";
};
chatango.group.GroupFooter.prototype.getFtrIconMenuModule_ = function() {
  if (typeof this.ftrIconMenuModule_ === "undefined") {
    this.ftrIconMenuModule_ = new chatango.modules.FtrIconMenuModule;
    if (this.messageCatcherModule_) {
      this.ftrIconMenuModule_.setMessageCatcher(this.messageCatcherModule_);
    }
    goog.events.listen(this.ftrIconMenuModule_, chatango.group.GroupFooterMenuEventType.OPEN_SETTINGS, function() {
      this.dispatchEvent(chatango.events.EventType.LOAD_SETTINGS_MODULE);
    }, false, this);
    goog.events.listen(this.ftrIconMenuModule_, chatango.group.GroupFooterMenuEventType.OPEN_MODERATION, function() {
      this.dispatchEvent(chatango.events.EventType.LOAD_MODERATION_MODULE);
    }, false, this);
    goog.events.listen(this.ftrIconMenuModule_, chatango.group.GroupFooterMenuEventType.OPEN_LOGIN, function() {
      this.dispatchEvent(chatango.events.EventType.SET_NAME);
    }, false, this);
    goog.events.listen(this.ftrIconMenuModule_, chatango.group.GroupFooterMenuEventType.OPEN_PM, function() {
      this.dispatchEvent(chatango.events.EventType.FOOTER_OPEN_PM);
    }, false, this);
  }
  return this.ftrIconMenuModule_;
};
chatango.group.GroupFooter.prototype.getLogoMenuModule_ = function() {
  if (typeof this.logoMenuModule_ === "undefined") {
    this.logoMenuModule_ = new chatango.modules.LogoMenuModule;
    goog.events.listen(this.logoMenuModule_, chatango.group.GroupLogoMenuEventType.CLONE_GROUP, this.onCloneGroup, false, this);
    goog.events.listen(this.logoMenuModule_, chatango.group.GroupLogoMenuEventType.NEW_GROUP, this.onNewGroup, false, this);
    goog.events.listen(this.logoMenuModule_, chatango.group.GroupLogoMenuEventType.OPEN_PM, function() {
      this.dispatchEvent(chatango.events.EventType.FOOTER_OPEN_PM);
    }, false, this);
  }
  return this.logoMenuModule_;
};
chatango.group.GroupFooter.prototype.getShareMenuModule_ = function() {
  if (typeof this.shareMenuModule_ === "undefined") {
    this.shareMenuModule_ = new chatango.modules.ShareMenuModule;
    goog.events.listen(this.shareMenuModule_, chatango.group.GroupShareMenuEventType.SHARE_TEXT, this.onShareGroupViaText, false, this);
    goog.events.listen(this.shareMenuModule_, chatango.group.GroupShareMenuEventType.SHARE_EMAIL, this.onShareGroupViaEmail, false, this);
    goog.events.listen(this.shareMenuModule_, chatango.group.GroupShareMenuEventType.NEW_GROUP, this.onNewGroup, false, this);
  }
  return this.shareMenuModule_;
};
chatango.group.GroupFooter.prototype.onCloneGroup = function() {
  this.groupInfo_.cloneGroup();
};
chatango.group.GroupFooter.prototype.onNewGroup = function() {
  var bd = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  var url = "http://" + bd + "/creategroup?html5beta&handle=" + this.groupInfo_.getGroupHandle() + "&embed=" + encodeURIComponent(this.groupInfo_.getEmbedLocation());
  goog.window.open(url, {"target":"_blank"});
};
chatango.group.GroupFooter.prototype.onShareGroupViaText = function() {
  if (chatango.DEBUG) {
    console.log("Share group via Text");
  }
};
chatango.group.GroupFooter.prototype.onShareGroupViaEmail = function() {
  if (chatango.DEBUG) {
    console.log("Share group via Email");
  }
};
chatango.group.GroupFooter.prototype.mcUpdated = function(e) {
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.group.GroupFooter.prototype.getSettingsMenuInstallArray = function() {
  if (this.useFooterIconMenu_) {
    return[this.logoEl_, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT];
  } else {
    return[this.settingsCogIcon_.getElement(), goog.positioning.Corner.TOP_RIGHT, goog.positioning.Corner.BOTTOM_RIGHT];
  }
};
chatango.group.GroupFooter.prototype.getModerationMenuInstallArray = function() {
  if (this.useFooterIconMenu_) {
    return[this.logoEl_, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT];
  } else {
    return[this.modHammerIcon_.getElement(), goog.positioning.Corner.TOP_RIGHT, goog.positioning.Corner.BOTTOM_RIGHT];
  }
};
chatango.group.GroupFooter.prototype.needToCompactFooterIcons = function() {
  return!(this.leftIconsEl_.offsetTop == this.rightSideWrapperEl_.offsetTop);
};
chatango.group.GroupFooter.prototype.initButton = function() {
  if (chatango.users.UserManager.getInstance().currentUser && chatango.users.UserManager.getInstance().currentUser.getType() == chatango.users.User.UserType.SELLER) {
    goog.style.setStyle(this.setNameBtnEl_, "display", "none");
  }
};
chatango.group.GroupFooter.prototype.onAuthChange = function() {
  if (this.participantsModule_) {
    this.participantsModule_.onAuthChange();
  }
};
chatango.group.GroupFooter.prototype.closePopups = function() {
  if (this.participantsModule_) {
    this.participantsModule_.closePopups();
  }
};
chatango.group.GroupFooter.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.participantsModule_) {
    this.participantsModule_.constrainDialogsToScreen(opt_stageRect);
  }
};
goog.provide("chatango.embed.CollapsedViewSettings");
chatango.embed.CollapsedViewSettings.DESKTOP_WIDTH_ = 75;
chatango.embed.CollapsedViewSettings.DESKTOP_HEIGHT_ = 21;
goog.provide("chatango.group.EmbedCodeMaker");
chatango.group.EmbedCodeMaker.getCode = function(width, height, isResponsive, handle, styles, opt_arch) {
  var launch_time = "1339008714359";
  var code_version = "002";
  var flags = "000";
  var time_elapsed = String((new Date).getTime() - launch_time);
  time_elapsed = "0000000000000".substring(0, 13 - time_elapsed.length) + time_elapsed;
  var mycid = code_version + flags + time_elapsed;
  var domain = chatango.settings.servers.SubDomain.getInstance().getScDomain();
  if (opt_arch === chatango.settings.Architecture.Type.JS) {
    domain = domain.replace(/https?:/, "");
  }
  var unit = isResponsive ? "%" : "px";
  var w = isResponsive ? "100" : width;
  var h = isResponsive ? "100" : height;
  var code = "<script " + 'id="cid' + mycid + '" ' + 'data-cfasync="false" ' + "async " + 'src="' + domain + '/js/gz/emb.js" ' + 'style="width: ' + w + "" + unit + ";height: " + h + "" + unit + ';"' + ">";
  code += '{"handle":"' + handle + '"';
  if (opt_arch) {
    code += ',"arch":"' + opt_arch + '"';
  }
  code += ',"styles":' + chatango.group.EmbedCodeMaker.getStyles(styles) + "}";
  code += "\x3c/script>";
  return code;
};
chatango.group.EmbedCodeMaker.getStyles = function(styles) {
  var defaults = chatango.group.DefaultStyles.lookup;
  var vars = "";
  var key_array = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "aa", "ab", "ac", "usricon", "pos", "bpos", "cv", "cvfnt", "cvfntsz", "cvfntw", "cvbg", "cvbga", "cvfg", "cvw", "cvh", "dateint", "sbc", "sba", "surl", "allowpm", "cnrs", "ticker", "fwtickm");
  var strings_array = new Array("a", "c", "d", "e", "g", "h", "j", "k", "l", "m", "n", "p", "q", "pos", "bpos", "cvfnt", "cvfntsz", "cvfntw", "cvbg", "cvfg", "sbc", "cnrs");
  var cv_only_styles = new Array("pos", "bpos", "cvfnt", "cvfntsz", "cvfntw", "cvbg", "cvbga", "cvbga", "cvfg", "cvw", "cvh", "ticker");
  for (var i = 0;i <= key_array.length;i++) {
    if (styles[key_array[i]] != defaults[key_array[i]] && styles[key_array[i]] != undefined && (styles["cv"] || !goog.array.contains(cv_only_styles, key_array[i]))) {
      if (vars != "") {
        vars += ",";
      }
      var toAddStr = styles[key_array[i]];
      if (goog.array.contains(strings_array, key_array[i])) {
        toAddStr = '"' + toAddStr + '"';
      }
      vars += '"' + key_array[i] + '":' + toAddStr;
    }
  }
  return "{" + vars + "}";
};
goog.provide("chatango.group.GroupInfo");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.net.cookies");
goog.require("goog.string");
goog.require("chatango.events.EventType");
goog.require("chatango.group.EmbedCodeMaker");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.utils.Encode");
goog.require("chatango.utils.formatting");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.Environment");
chatango.group.GroupInfo = function(connection, handle, embedLoc, title, message, opt_clonegroup) {
  goog.events.EventTarget.call(this);
  this.connection_ = connection;
  this.handle_ = handle;
  this.embedLoc_ = embedLoc;
  this.title_ = title ? title : "";
  this.ownerMessage_ = message ? message : "";
  this.clonegroup_ = opt_clonegroup;
  this.paymentsOk_ = true;
  var len = chatango.group.GroupInfo.NO_PAY_SITES.length;
  var noPayStr;
  var embedLocLC = embedLoc ? embedLoc.toLowerCase() : "";
  var i;
  for (i = 0;i < len;i++) {
    noPayStr = chatango.group.GroupInfo.NO_PAY_SITES[i].toLowerCase();
    if (embedLocLC.indexOf(noPayStr) != -1) {
      this.paymentsOk_ = false;
      break;
    }
  }
  len = chatango.group.GroupInfo.NO_PAY_GROUPS.length;
  for (i = 0;i < len;i++) {
    noPayStr = chatango.group.GroupInfo.NO_PAY_GROUPS[i].toLowerCase();
    if (handle.toLowerCase() == noPayStr) {
      this.paymentsOk_ = false;
      break;
    }
  }
  this.lastShowCounterState_ = false;
  this.lastEnableChannelsState_ = true;
  this.lastAllowLinksState_ = false;
  this.lastAllowVideosState_ = false;
  this.lastAllowImagesState_ = false;
  this.lastAllowStyledState_ = false;
  this.lastNLPSingleState_ = false;
  this.lastNLPMsgQueue_ = false;
  this.lastNLPNgram_ = false;
  this.lastChatangoAllowLinksState_ = true;
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.lastSendMessagesBWState_ = false;
  var events = chatango.networking.GroupConnectionEvent.EventType.updgroupinfo;
  goog.events.listen(connection, events, this.onEvent_, false, this);
  goog.events.listen(connection, chatango.networking.GroupConnectionEvent.EventType.groupflagsupdate, this.groupFlagsUpdated, false, this);
  goog.events.listen(connection, chatango.networking.CommonConnectionEvent.EventType.ok, this.groupFlagsUpdated, false, this);
};
goog.inherits(chatango.group.GroupInfo, goog.events.EventTarget);
chatango.group.GroupInfo.ManagerType = "GROUPINFO";
chatango.group.GroupInfo.NO_PAY_SITES = ["myspace.com"];
chatango.group.GroupInfo.NO_PAY_GROUPS = [];
chatango.group.GroupInfo.DEFAULT_MAX_MSG_BYTES = 2900;
chatango.group.GroupInfo.MAX_MSG_BYTES_WITH_NLP_QUEUE = 850;
chatango.group.GroupInfo.prototype.logger = goog.debug.Logger.getLogger("chatango.group.GroupInfo");
chatango.group.GroupInfo.prototype.refresh = function() {
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.group.GroupInfo.prototype.getGroupHandle = function() {
  return this.handle_;
};
chatango.group.GroupInfo.prototype.getEmbedLocation = function() {
  return this.embedLoc_;
};
chatango.group.GroupInfo.prototype.getGroupURL = function() {
  var bd = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  return "http://" + this.handle_ + "." + bd;
};
chatango.group.GroupInfo.prototype.getGroupTitle = function() {
  return this.title_;
};
chatango.group.GroupInfo.prototype.getOwnerMessage = function() {
  return this.ownerMessage_;
};
chatango.group.GroupInfo.prototype.getFilteredOwnerMessage = function() {
  var okReceived = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED;
  if (!okReceived || this.getChatangoAllowsLinks()) {
    return this.ownerMessage_;
  } else {
    var words = this.ownerMessage_.split(" ");
    var noLinksWords = [];
    var word;
    for (var i = 0;i < words.length;i++) {
      word = words[i];
      if (word.match(chatango.utils.formatting.HREF_REGEX) || word.match(chatango.utils.formatting.TLD_REGEX) || word.match(chatango.utils.formatting.SLASH_REGEX) || word.match(chatango.utils.formatting.LINK_BAN_EVASION)) {
        word = "*";
      }
      noLinksWords.push(word);
    }
    return noLinksWords.join(" ");
  }
};
chatango.group.GroupInfo.prototype.getShowCounter = function() {
  this.lastShowCounterState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NOCOUNTER & this.connection_.getFlags()) == 0;
  return this.lastShowCounterState_;
};
chatango.group.GroupInfo.prototype.setShowCounter = function(show) {
  var flag = chatango.networking.GroupConnection.flags.NOCOUNTER;
  if (show) {
    this.connection_.send("updategroupflags:0:" + flag);
  } else {
    this.connection_.send("updategroupflags:" + flag + ":0");
  }
};
chatango.group.GroupInfo.prototype.getEnableChannels = function() {
  this.lastEnableChannelsState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.CHANNELSDISABLED & this.connection_.getFlags()) === 0;
  return this.lastEnableChannelsState_;
};
chatango.group.GroupInfo.prototype.setEnableChannels = function(channelsOn) {
  var flag = chatango.networking.GroupConnection.flags.CHANNELSDISABLED;
  if (channelsOn) {
    this.connection_.send("updategroupflags:0:" + flag);
  } else {
    this.connection_.send("updategroupflags:" + flag + ":0");
  }
};
chatango.group.GroupInfo.prototype.getAllowLinks = function() {
  this.lastAllowLinksState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NOLINKS & this.connection_.getFlags()) == 0;
  return this.lastAllowLinksState_;
};
chatango.group.GroupInfo.prototype.getChatangoAllowsLinks = function() {
  this.lastChatangoAllowLinksState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NOLINKSCHATANGO & this.connection_.getFlags()) == 0;
  return this.lastChatangoAllowLinksState_;
};
chatango.group.GroupInfo.prototype.setAllowLinks = function(allow) {
  var flag = chatango.networking.GroupConnection.flags.NOLINKS;
  if (allow) {
    this.connection_.send("updategroupflags:0:" + flag);
  } else {
    this.connection_.send("updategroupflags:" + flag + ":0");
  }
};
chatango.group.GroupInfo.prototype.getAllowVideos = function() {
  this.lastAllowVideosState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NOVIDEOS & this.connection_.getFlags()) == 0;
  return this.lastAllowVideosState_;
};
chatango.group.GroupInfo.prototype.setAllowVideos = function(allow) {
  var flag = chatango.networking.GroupConnection.flags.NOVIDEOS;
  if (allow) {
    this.connection_.send("updategroupflags:0:" + flag);
  } else {
    this.connection_.send("updategroupflags:" + flag + ":0");
  }
};
chatango.group.GroupInfo.prototype.getSendMessagesWithBannedWords = function() {
  this.lastSendMessagesBWState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NOBRDCASTMSGWITHBW & this.connection_.getFlags()) == 0;
  return this.lastSendMessagesBWState_;
};
chatango.group.GroupInfo.prototype.setSendMessagesWithBannedWords = function(allow) {
  var flag = chatango.networking.GroupConnection.flags.NOBRDCASTMSGWITHBW;
  if (allow) {
    this.connection_.send("updategroupflags:0:" + flag);
  } else {
    this.connection_.send("updategroupflags:" + flag + ":0");
  }
};
chatango.group.GroupInfo.prototype.getAllowImages = function() {
  this.lastAllowImagesState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NOIMAGES & this.connection_.getFlags()) == 0 && (chatango.networking.GroupConnection.flags.NOLINKSCHATANGO & this.connection_.getFlags()) == 0;
  return this.lastAllowImagesState_;
};
chatango.group.GroupInfo.prototype.setAllowImages = function(allow) {
  var flag = chatango.networking.GroupConnection.flags.NOIMAGES;
  if (allow) {
    this.connection_.send("updategroupflags:0:" + flag);
  } else {
    this.connection_.send("updategroupflags:" + flag + ":0");
  }
};
chatango.group.GroupInfo.prototype.getNLPSingleMsg = function() {
  this.lastNLPSingleState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NLP_SINGLEMSG & this.connection_.getFlags()) > 0;
  return this.lastNLPSingleState_;
};
chatango.group.GroupInfo.prototype.setNLPSingleMsg = function(enable) {
  var flag = chatango.networking.GroupConnection.flags.NLP_SINGLEMSG;
  if (enable) {
    this.connection_.send("updategroupflags:" + flag + ":0");
  } else {
    this.connection_.send("updategroupflags:0:" + flag);
  }
};
chatango.group.GroupInfo.prototype.getNLPMsgQueue = function() {
  this.lastNLPMsgQueue_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NLP_MSGQUEUE & this.connection_.getFlags()) > 0;
  return this.lastNLPMsgQueue_;
};
chatango.group.GroupInfo.prototype.setNLPMsgQueue = function(enable) {
  var flag = chatango.networking.GroupConnection.flags.NLP_MSGQUEUE;
  if (enable) {
    var singleMsgFlag = chatango.networking.GroupConnection.flags.NLP_SINGLEMSG;
    this.connection_.send("updategroupflags:" + (flag | singleMsgFlag) + ":0");
  } else {
    this.connection_.send("updategroupflags:0:" + flag);
  }
};
chatango.group.GroupInfo.prototype.getNLPNgram = function() {
  this.lastNLPNgram_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NLP_NGRAM & this.connection_.getFlags()) > 0;
  return this.lastNLPNgram_;
};
chatango.group.GroupInfo.prototype.setNLPNgram = function(enable) {
  var flag = chatango.networking.GroupConnection.flags.NLP_NGRAM;
  if (enable) {
    var singleMsgFlag = chatango.networking.GroupConnection.flags.NLP_SINGLEMSG;
    this.connection_.send("updategroupflags:" + (flag | singleMsgFlag) + ":0");
  } else {
    this.connection_.send("updategroupflags:0:" + flag);
  }
};
chatango.group.GroupInfo.prototype.getAllowStyledText = function() {
  this.lastAllowStyledState_ = this.connection_.getStatus() == chatango.networking.ConnectionStatusEvent.EventType.CONNECTED && (chatango.networking.GroupConnection.flags.NOSTYLEDTEXT & this.connection_.getFlags()) == 0;
  return this.lastAllowStyledState_;
};
chatango.group.GroupInfo.prototype.setAllowStyledText = function(allow) {
  var flag = chatango.networking.GroupConnection.flags.NOSTYLEDTEXT;
  if (allow) {
    this.connection_.send("updategroupflags:0:" + flag);
  } else {
    this.connection_.send("updategroupflags:" + flag + ":0");
  }
};
chatango.group.GroupInfo.prototype.setBasicGroupInfo = function(name, ownerMessage) {
  if (goog.net.cookies.get("un")) {
    var username = chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("un"));
    var password = chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("pw"));
  }
  query = "";
  query += "erase=" + goog.string.urlEncode("0");
  query += "&l=" + goog.string.urlEncode("1");
  query += "&d=" + goog.string.urlEncode(ownerMessage);
  query += "&n=" + goog.string.urlEncode(name);
  query += "&u=" + goog.string.urlEncode(this.handle_);
  if (goog.net.cookies.get("un")) {
    query += "&lo=" + goog.string.urlEncode(username);
    query += "&p=" + goog.string.urlEncode(password);
  }
  if (chatango.DEBUG) {
    this.logger.info("Group Info Query: " + query);
  }
  var bd = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  if (this.clonegroup_) {
    bd = this.handle_ + "." + bd;
  }
  var url = "//" + bd + "/updategroupprofile";
  var headers = {"Content-type":"application/x-www-form-urlencoded"};
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.updateInfoResponse, false, this);
  goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], function(e) {
  }, false, this);
  xhr.send(url, "POST", query, headers);
};
chatango.group.GroupInfo.prototype.updateInfoResponse = function(e) {
  var xhr = e.currentTarget;
  var t = xhr.getResponseText();
  if (t.match(/cookie-login-error/)) {
    this.dispatchEvent(chatango.events.EventType.BAD_UPDATE_INFO);
  }
};
chatango.group.GroupInfo.prototype.onBasicGroupLoad = function(desc, title) {
  if (desc) {
    this.ownerMessage_ = goog.string.urlDecode(desc);
  }
  if (title) {
    this.title_ = goog.string.urlDecode(title);
  }
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.group.GroupInfo.prototype.setInfo = function(desc, title, handle) {
  this.ownerMessage_ = desc;
  this.title_ = title;
  this.handle_ = handle;
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.group.GroupInfo.prototype.onEvent_ = function(e) {
  switch(e.type) {
    case chatango.networking.GroupConnectionEvent.EventLookup["updgroupinfo"]:
      this.title_ = goog.string.urlDecode(e.data[1]);
      this.ownerMessage_ = goog.string.urlDecode(e.data[2]);
      break;
    case chatango.networking.GroupConnectionEvent.EventLookup["bw"]:
      var banned = e.data[2];
      this.bannedParts_ = banned.split("%2C");
      for (var i = 0;i < this.bannedParts_.length;i++) {
        this.bannedParts_[i] = goog.string.trim(goog.string.urlDecode(this.bannedParts_[i]));
      }
      break;
  }
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.group.GroupInfo.prototype.groupFlagsUpdated = function(e) {
  if (this.lastShowCounterState_ != this.getShowCounter()) {
    this.dispatchEvent(chatango.events.EventType.SHOW_COUNTER_UPDATE);
  }
  if (this.lastEnableChannelsState_ != this.getEnableChannels()) {
    this.dispatchEvent(chatango.events.EventType.ENABLE_CHANNELS_UPDATE);
  }
  if (this.lastAllowLinksState_ != this.getAllowLinks()) {
    this.dispatchEvent(chatango.events.EventType.ALLOW_LINKS_UPDATE);
  }
  if (this.lastAllowImagesState_ != this.getAllowImages()) {
    this.dispatchEvent(chatango.events.EventType.ALLOW_IMAGES_UPDATE);
  }
  if (this.lastAllowVideosState_ != this.getAllowVideos()) {
    this.dispatchEvent(chatango.events.EventType.ALLOW_VIDEOS_UPDATE);
  }
  if (this.lastAllowStyledState_ != this.getAllowStyledText()) {
    this.dispatchEvent(chatango.events.EventType.ALLOW_STYLED_TEXT_UPDATE);
  }
  if (this.lastSendMessagesBWState_ != this.getSendMessagesWithBannedWords()) {
    this.dispatchEvent(chatango.events.EventType.SEND_BW_MESSAGES);
  }
  if (this.lastNLPSingleState_ != this.getNLPSingleMsg() || this.lastNLPMsgQueue_ != this.getNLPMsgQueue() || this.lastNLPNgram_ != this.getNLPNgram()) {
    this.dispatchEvent(chatango.events.EventType.NLP_UPDATED);
  }
  if (this.lastChatangoAllowLinksState_ != this.getChatangoAllowsLinks()) {
    this.dispatchEvent(chatango.events.EventType.UPDATE);
  }
};
chatango.group.GroupInfo.prototype.getGroupFlags = function() {
  return this.connection_.getFlags();
};
chatango.group.GroupInfo.prototype.cloneGroup = function() {
  var bd = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  var originalStyles = chatango.managers.Style.getInstance().getOriginalStyles();
  var styles = chatango.group.EmbedCodeMaker.getStyles(originalStyles).replace(/[\}\{\"]/g, "");
  var origWidth = chatango.managers.Style.getInstance().getOriginalWidth();
  var origHeight = chatango.managers.Style.getInstance().getOriginalHeight();
  var sizeInfo = styles == "" ? "" : ",";
  if (origHeight.indexOf("%") != -1 && !chatango.managers.Style.getInstance().isFullSizeGroup()) {
    sizeInfo += "isresponsive:1";
  } else {
    if (origHeight.indexOf("px") != -1 && origWidth.indexOf("px") != -1) {
      sizeInfo += "sizew:" + origWidth.replace("px", "");
      sizeInfo += ",sizeh:" + origHeight.replace("px", "");
    }
  }
  var url = "http://" + this.handle_ + "." + bd + "/clonegroup?style=" + styles + sizeInfo;
  goog.window.open(url, {"target":"_blank"});
};
chatango.group.GroupInfo.prototype.getPaymentsOk = function() {
  return this.paymentsOk_;
};
chatango.group.GroupInfo.prototype.getMaxMsgLength = function() {
  var max = chatango.group.GroupInfo.DEFAULT_MAX_MSG_BYTES;
  if (this.getNLPMsgQueue()) {
    max = chatango.group.GroupInfo.MAX_MSG_BYTES_WITH_NLP_QUEUE;
  }
  return max;
};
goog.provide("chatango.strings.GroupStrings");
chatango.strings.GroupStrings = {"set_name":"Set name", "set_your_name":"Set your name", "name":"Name", "login_btn_tooltip":"Log in or sign up", "click_to_connect":"Click to connect", "connection_lost":"Connection has been lost", "reconnect":"Reconnect", "connecting":"Connecting", "new_port":"Trying to connect via a new port", "cant_connect":"Unable to connect, please try again in a few minutes.", "cant_connect2":"Unable to connect. Please reload the page.", "chat_closed":"Group chat is closed", 
"remember_setting":"Do you want to remember this setting " + "next time you are here?", "yes":"Yes", "no":"No", "people_here_now":"People here now", "only_vis_mods":"Only visible to mods and owner", "msg_date_format":"ddd mmm d, g:i:sa", "low_version_msg":"Please <b>REFRESH</b> this page to get the latest " + 'Chatango group.<br><font color="#999999">If you have refreshed, ' + "clear your temporary internet files and refresh again.</font>", "system_msg":"Chatango System Message", "type_here_to_send":"Type here to send a message", 
"type_here":"Type here", "signin":"Sign in", "log_in":"Log in", "logout":"Log out", "settings":"Settings", "settingslogout":"Settings: log out", "moderation":"Moderation", "click_to_chat":"Click to chat", "too_small":"This group is too small to use.*br*Please resize it.", "too_small_mobile":"This group is too small to use.*br*Please zoom out.", "click_to_close":"Click to close", "add":"Add", "msg_filtered":"Message filtered by channel", "broadcast_mode":"Broadcast mode", "broadcast_closed":"Broadcast mode", 
"mods_only":"Closed: no moderators", "mods_only_sm":"Closed: no mods", "app_dl_full":"Android App", "app_dl_small":"Android", "app_dl_tiny":"App"};
goog.provide("goog.debug.DivConsole");
goog.require("goog.debug.HtmlFormatter");
goog.require("goog.debug.LogManager");
goog.require("goog.dom.safe");
goog.require("goog.html.SafeHtml");
goog.require("goog.style");
goog.debug.DivConsole = function(element) {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
  this.formatter_ = new goog.debug.HtmlFormatter;
  this.formatter_.showAbsoluteTime = false;
  this.isCapturing_ = false;
  this.element_ = element;
  this.elementOwnerDocument_ = this.element_.ownerDocument || this.element_.document;
  this.installStyles();
};
goog.debug.DivConsole.prototype.installStyles = function() {
  goog.style.installStyles(".dbg-sev{color:#F00}" + ".dbg-w{color:#C40}" + ".dbg-sh{font-weight:bold;color:#000}" + ".dbg-i{color:#444}" + ".dbg-f{color:#999}" + ".dbg-ev{color:#0A0}" + ".dbg-m{color:#990}" + ".logmsg{border-bottom:1px solid #CCC;padding:2px}" + ".logsep{background-color: #8C8;}" + ".logdiv{border:1px solid #CCC;background-color:#FCFCFC;" + "font:medium monospace}", this.element_);
  this.element_.className += " logdiv";
};
goog.debug.DivConsole.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }
  var rootLogger = goog.debug.LogManager.getRoot();
  if (capturing) {
    rootLogger.addHandler(this.publishHandler_);
  } else {
    rootLogger.removeHandler(this.publishHandler_);
    this.logBuffer = "";
  }
  this.isCapturing_ = capturing;
};
goog.debug.DivConsole.prototype.addLogRecord = function(logRecord) {
  if (!logRecord) {
    return;
  }
  var scroll = this.element_.scrollHeight - this.element_.scrollTop - this.element_.clientHeight <= 100;
  var div = this.elementOwnerDocument_.createElement("div");
  div.className = "logmsg";
  goog.dom.safe.setInnerHtml(div, this.formatter_.formatRecordAsHtml(logRecord));
  this.element_.appendChild(div);
  if (scroll) {
    this.element_.scrollTop = this.element_.scrollHeight;
  }
};
goog.debug.DivConsole.prototype.getFormatter = function() {
  return this.formatter_;
};
goog.debug.DivConsole.prototype.setFormatter = function(formatter) {
  this.formatter_ = formatter;
};
goog.debug.DivConsole.prototype.addSeparator = function() {
  var div = this.elementOwnerDocument_.createElement("div");
  div.className = "logmsg logsep";
  this.element_.appendChild(div);
};
goog.debug.DivConsole.prototype.clear = function() {
  if (this.element_) {
    goog.dom.safe.setInnerHtml(this.element_, goog.html.SafeHtml.EMPTY);
  }
};
goog.provide("goog.structs.Queue");
goog.require("goog.array");
goog.structs.Queue = function() {
  this.front_ = [];
  this.back_ = [];
};
goog.structs.Queue.prototype.maybeFlip_ = function() {
  if (goog.array.isEmpty(this.front_)) {
    this.front_ = this.back_;
    this.front_.reverse();
    this.back_ = [];
  }
};
goog.structs.Queue.prototype.enqueue = function(element) {
  this.back_.push(element);
};
goog.structs.Queue.prototype.dequeue = function() {
  this.maybeFlip_();
  return this.front_.pop();
};
goog.structs.Queue.prototype.peek = function() {
  this.maybeFlip_();
  return goog.array.peek(this.front_);
};
goog.structs.Queue.prototype.getCount = function() {
  return this.front_.length + this.back_.length;
};
goog.structs.Queue.prototype.isEmpty = function() {
  return goog.array.isEmpty(this.front_) && goog.array.isEmpty(this.back_);
};
goog.structs.Queue.prototype.clear = function() {
  this.front_ = [];
  this.back_ = [];
};
goog.structs.Queue.prototype.contains = function(obj) {
  return goog.array.contains(this.front_, obj) || goog.array.contains(this.back_, obj);
};
goog.structs.Queue.prototype.remove = function(obj) {
  var index = goog.array.lastIndexOf(this.front_, obj);
  if (index < 0) {
    return goog.array.remove(this.back_, obj);
  }
  goog.array.removeAt(this.front_, index);
  return true;
};
goog.structs.Queue.prototype.getValues = function() {
  var res = [];
  for (var i = this.front_.length - 1;i >= 0;--i) {
    res.push(this.front_[i]);
  }
  var len = this.back_.length;
  for (var i = 0;i < len;++i) {
    res.push(this.back_[i]);
  }
  return res;
};
goog.provide("chatango.output.GroupOutputWindow");
goog.require("chatango.group.channels.ChannelController");
goog.require("chatango.group.GroupMessage");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.managers.ServerTime");
goog.require("chatango.output.OutputMessages");
goog.require("chatango.settings.performance");
goog.require("chatango.users.ModeratorManager");
goog.require("goog.array");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.structs.Queue");
goog.require("goog.style");
goog.require("goog.ui.Component");
goog.require("goog.Timer");
chatango.output.GroupOutputWindow = function(managers, opt_domHelper) {
  chatango.output.OutputWindow.call(this, managers, opt_domHelper);
  this.easybanRolloverArray_ = [];
  this.waitingForMore_ = false;
  this.moreLoaded_ = false;
  this.noMore_ = false;
  this.getMoreRetryTimer_ = null;
  this.unfulfilledGetMoreReqs_ = [];
  this.getMoreRequestId_ = 0;
  this.lastScrollTop_ = Infinity;
  this.messageCache_ = [];
  this.lockBottomThreshold_ = chatango.settings.performance.getLockBottomThreshold();
  this.thresholdBuffer_ = chatango.settings.performance.getBuffer();
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
  this.permIdQueue_ = {};
};
goog.inherits(chatango.output.GroupOutputWindow, chatango.output.OutputWindow);
chatango.output.GroupOutputWindow.prototype.createDom = function() {
  chatango.output.GroupOutputWindow.superClass_.createDom.call(this);
  goog.dom.classes.add(this.outputWindowEl_, "ubdr");
  var relayEvents = [chatango.events.EventType.MOD_DELETE_MESSAGE, chatango.events.EventType.MOD_CONFIRM_DELETE_MESSAGE, chatango.events.EventType.MOD_BAN_USER, chatango.events.EventType.MOD_EASYBAN, chatango.events.EventType.OPEN_PM_EVENT, chatango.events.EventType.REPLY_TO, chatango.events.EventType.YOUTUBE_CLICK];
  goog.events.listen(document, goog.events.EventType.MOUSEUP, this.onMouseUp_, false, this);
  goog.events.listen(this.messages_, goog.events.EventType.SCROLL, this.onScroll_, false, this);
  goog.events.listen(this.messages_, relayEvents, this.onRelayEvent_, false, this);
  goog.events.listen(this.messages_, chatango.events.EventType.MOD_EASYBAN_ROLLOVER, this.onModEasybanRollOver_, false, this);
  goog.events.listen(this.messages_, chatango.events.EventType.MOD_EASYBAN_ROLLOUT, this.onModEasybanRollOut_, false, this);
  goog.events.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.MSG_THUMB_DISPLAY_CHANGED, this.draw, null, this);
  goog.events.listen(chatango.users.ModeratorManager.getInstance(), chatango.users.ModeratorManager.EventType.CURRENT_USER_SEE_IP_FLAG_CHANGE, this.onCurrentUserModSeeIPChange_, false, this);
};
chatango.output.GroupOutputWindow.prototype.initChannels = function() {
  var channelController = chatango.group.channels.ChannelController.getInstance();
  goog.events.listen(channelController, chatango.group.channels.ChannelController.EventType.CHANNEL_FILTER_CHANGE, this.onChannelFilterChange_, false, this);
  goog.events.listen(channelController, chatango.group.channels.ChannelController.EventType.MOD_CHANNEL_VISIBILITY_CHANGE, this.onModChannelVisibilityChange_, false, this);
};
chatango.output.GroupOutputWindow.prototype.sendGetMoreRequest = function() {
  if (this.messageCache_.length > 0) {
    if (chatango.DEBUG) {
      console.log("Loading more messages from cache...");
    }
    for (var i = 0;i < chatango.output.OutputWindow.BATCH_SIZE;i++) {
      if (this.messageCache_.length == 0) {
        break;
      }
      var msg = this.messageCache_.pop();
      if (msg.message) {
        msg.message.dispose();
      }
      this.messageQueue_.push(msg);
    }
    this.moreLoaded_ = true;
    this.waitingForMore_ = false;
    this.processMessageQueue();
  } else {
    if (this.getMoreRetryTimer_ != null) {
      return;
    }
    if (chatango.DEBUG) {
      console.log("Loading more messages from server... getMoreRequestId_: " + this.getMoreRequestId_);
    }
    this.waitingForMore_ = true;
    var e = new goog.events.Event(chatango.events.EventType.LOAD_MORE);
    e.data = {numMessages:chatango.output.OutputWindow.BATCH_SIZE, requestId:this.getMoreRequestId_};
    goog.array.insert(this.unfulfilledGetMoreReqs_, this.getMoreRequestId_);
    this.dispatchEvent(e);
    this.getMoreRequestId_++;
  }
};
chatango.output.GroupOutputWindow.prototype.onMouseUp_ = function(e) {
  if (this.messages_.getScrollTop() === 0) {
  }
};
chatango.output.GroupOutputWindow.prototype.onScroll_ = function(e) {
  var scrollTop = this.messages_.getScrollTop();
  var oldScrollTop = this.lastScrollTop_;
  this.lastScrollTop_ = scrollTop;
  if (scrollTop > oldScrollTop) {
    return;
  }
  if (this.messageCache_.length === 0 && this.noMore_) {
    return;
  }
  var threshold = goog.style.getSize(this.getElement()).height;
  if (!this.waitingForMore_ && scrollTop <= threshold && this.unfulfilledGetMoreReqs_.length <= 1) {
    this.sendGetMoreRequest();
  }
};
chatango.output.GroupOutputWindow.prototype.showNoMessages = function(fromScroll, mobileSafety) {
  this.messages_.showNoMessages(fromScroll, mobileSafety);
  this.noMore_ = true;
  this.waitingForMore_ = false;
  this.moreLoaded_ = false;
};
chatango.output.GroupOutputWindow.prototype.historyBatchReceived = function(reqId) {
  this.waitingForMore_ = false;
  this.moreLoaded_ = true;
  goog.array.remove(this.unfulfilledGetMoreReqs_, parseInt(reqId, 10));
};
chatango.output.GroupOutputWindow.prototype.getGroupMessage = function(messageData, opt_position) {
  var showDate = Number(messageData.getTimeStamp()) - this.lastDatedMessageTime_ > chatango.managers.Style.getInstance().getMsgDateInterval();
  if (showDate) {
    this.lastDatedMessageTime_ = Math.max(this.lastDatedMessageTime_, Number(messageData.getTimeStamp()));
  }
  if (chatango.users.ModeratorManager.getInstance().isCurrentUserAModerator()) {
    if (!this.moderationModuleLoaded_) {
      if (!this.modMsgsArr_) {
        this.modMsgsArr_ = [];
      }
      this.modMsgsArr_.push([messageData, opt_position]);
      if (!this.moderationModuleRequested_) {
        this.dispatchEvent(new goog.events.Event(chatango.events.EventType.REQUEST_MOD_MODULE, this));
        this.moderationModuleRequested_ = true;
      }
      return null;
    } else {
      return new chatango.group.moderation.GroupModMessage(messageData, this.managers_, showDate);
    }
  } else {
    return new chatango.group.GroupMessage(messageData, this.managers_, showDate);
  }
};
chatango.output.GroupOutputWindow.prototype.addMessage = function(message, opt_position) {
  chatango.output.GroupOutputWindow.superClass_.addMessage.call(this, message, opt_position);
  var mid = message.getId();
  if (this.permIdQueue_[mid]) {
    this.updateMessageId(mid, this.permIdQueue_[mid]);
    delete this.permIdQueue_[mid];
  }
};
chatango.output.GroupOutputWindow.prototype.updateMessageId = function(oldId, newId) {
  var msg = this.msgIdMap[oldId];
  if (msg) {
    if (chatango.DEBUG) {
      this.logger.info("Updating message id: " + oldId + "->" + newId);
    }
    msg.setMessageId(newId);
    delete this.msgIdMap[oldId];
    this.msgIdMap[newId] = msg;
  } else {
    this.permIdQueue_[oldId] = newId;
  }
};
chatango.output.GroupOutputWindow.prototype.onModEasybanRollOver_ = function(e) {
  goog.array.insert(this.easybanRolloverArray_, e.target);
  if (!this.easyBanHoverStartedinLockBottomState_) {
    this.easyBanHoverStartedinLockBottomState_ = !this.messages_.isOverflowed() || this.messages_.isAtBottom();
  }
};
chatango.output.GroupOutputWindow.prototype.onModEasybanRollOut_ = function(e) {
  goog.array.remove(this.easybanRolloverArray_, e.target);
};
chatango.output.GroupOutputWindow.prototype.isEasyBanHoverActive = function() {
  if (!chatango.group.moderation.ModerationManager.getInstance().getEasyBanIsOn()) {
    this.easyBanHoverStartedinLockBottomState_ = false;
    return false;
  }
  var i;
  for (i = 0;i < this.easybanRolloverArray_.length;i++) {
    if (this.easybanRolloverArray_[i] == null || this.easybanRolloverArray_[i].isDisposed() || !this.easybanRolloverArray_[i].isEasyBanDivShowing()) {
      this.easybanRolloverArray_.splice(i, 1);
      i--;
      continue;
    }
  }
  var isActivelyHovering = this.easybanRolloverArray_.length > 0;
  return isActivelyHovering;
};
chatango.output.GroupOutputWindow.prototype.lockBottom_ = function() {
  var lockBottom = !this.messages_.isOverflowed() || this.messages_.isAtBottom() && !this.isEasyBanHoverActive();
  if (this.messages_.isAtBottom() && !this.isEasyBanHoverActive() && this.easyBanHoverStartedinLockBottomState_) {
    this.easyBanHoverStartedinLockBottomState_ = false;
    lockBottom = true;
  }
  return lockBottom;
};
chatango.output.GroupOutputWindow.prototype.processMessageQueue = function() {
  if (chatango.DEBUG) {
    console.debug("Processing " + this.messageQueue_.length + " queued messages");
  }
  if (!this.messages_) {
    return;
  }
  var begin = new Date;
  var bottom = this.lockBottom_();
  var position;
  var delta;
  var msg = this.messageQueue_.shift();
  var prevMsg;
  var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  while (msg) {
    if (!stylesOn) {
      msg.message.updateStyles();
    }
    prevMsg = this.messagesArray_.slice(-1)[0];
    switch(msg.position) {
      case "top":
        this.messages_.addChildAt(msg.message, 0, true);
        this.messagesArray_.unshift(msg.message);
        position = 0;
        break;
      case "bottom":
      ;
      default:
        msg.message.setDateMode(this.lastTimestampedMsg_ || prevMsg, prevMsg && prevMsg.isHistory_ ? 5 * 60 : 60);
        this.messages_.addChild(msg.message, true);
        this.messagesArray_.push(msg.message);
        position = goog.style.getSize(this.messages_.bg_).height;
    }
    if (msg.message.dateMode_ !== chatango.output.Message.DateMode.NONE) {
      this.lastTimestampedMsg_ = msg.message;
    }
    if (msg.message.updateChannelVisiblility) {
      msg.message.updateChannelVisiblility();
    }
    if (msg.message.updateModChannelVisibility) {
      msg.message.updateModChannelVisibility();
    }
    delta = goog.style.getSize(msg.message.getElement()).height;
    this.alignMessages(bottom, position, delta, this.moreLoaded_);
    if (chatango.managers.Environment.getInstance().isIOS()) {
      this.iosHack = this.messages_.getContentElement().offsetTop;
      this.iosHack = "iosHack" + this.iosHack;
    }
    if (msg.message.checkReply) {
      msg.message.checkReply();
    }
    msg = this.messageQueue_.shift();
  }
  var numMessages = this.messagesArray_.length;
  if (numMessages >= this.maxMessages_ || numMessages >= this.lockBottomThreshold_ && this.messages_.isAtBottom()) {
    this.removeMessageFromTop(chatango.output.OutputWindow.BATCH_SIZE);
  }
  if (numMessages >= this.maxMessages_ - this.thresholdBuffer_) {
    this.showNoMessages(true, chatango.managers.Environment.getInstance().isMobile());
  } else {
    if (!this.noMore_ || this.messageCache_.length === 0) {
      this.messages_.hideNoMessages();
    }
  }
  this.removeExcessSmileyMessages_();
  this.moreLoaded_ = false;
  this.queueActive_ = false;
  var self = this;
  setTimeout(function() {
    var end = new Date;
    var render = end.getTime() - begin.getTime();
    self.queuePeriod_ = render * .5 + self.queuePeriod_ * .5;
    self.queuePeriod_ = Math.max(self.queuePeriod_, chatango.output.OutputWindow.MIN_QUEUE_MS);
  }, 0);
};
chatango.output.GroupOutputWindow.prototype.userBanned = function(cookie, isBanned) {
  if (!cookie) {
    return;
  }
  var i;
  var len = this.messagesArray_.length;
  var msg;
  var author;
  for (i = Math.max(0, len - 50);i < len;i++) {
    msg = this.messagesArray_[i];
    if (msg instanceof chatango.group.moderation.GroupModMessage) {
      author = msg.getUser();
      if (author && author.getEncodedCookie() == cookie) {
        if (isBanned) {
          msg.userBanned();
        } else {
          msg.userUnbanned();
        }
      }
    }
  }
};
chatango.output.GroupOutputWindow.prototype.removeMessageFromTop = function(count, opt_alignMessages) {
  var bottom = this.lockBottom_();
  if (typeof count === "undefined") {
    count = 1;
  }
  var i;
  var topId;
  var topMsg;
  var heightRemoved = 0;
  for (i = 0;i < count;i++) {
    topMsg = this.messagesArray_.shift();
    if (chatango.DEBUG) {
      console.debug("Removing top message id: " + topMsg.getMessageId());
    }
    heightRemoved += goog.style.getSize(topMsg.getElement()).height;
    this.messages_.removeChild(topMsg, true);
    this.messageCache_.push({message:topMsg, position:"top"});
  }
  var alignMessages = typeof opt_alignMessages !== "undefined" ? opt_alignMessages : true;
  if (alignMessages) {
    this.alignMessages(bottom, 0, -heightRemoved);
  }
  return heightRemoved;
};
chatango.output.GroupOutputWindow.prototype.removeAllMessages = function() {
  var key;
  var msg;
  var bottom = this.lockBottom_();
  var heightRemoved = 0;
  for (key in this.msgIdMap) {
    if (this.msgIdMap.hasOwnProperty(key)) {
      msg = this.msgIdMap[key];
      if (chatango.DEBUG) {
        console.debug("Removing all message id: ", msg.getMessageId());
        console.debug("MSG b4 error ", msg);
        this.myMsg = msg;
      }
      heightRemoved += msg.getElement() ? goog.style.getSize(msg.getElement()).height : 0;
      delete this.msgIdMap[key];
      goog.array.remove(this.messagesArray_, msg);
      var cacheIndex = this.messageCache_.indexOf(msg);
      if (cacheIndex > -1) {
        delete this.messageCache_[cacheIndex];
      }
      if (this.messages_.indexOfChild(msg) > -1) {
        this.messages_.removeChild(msg, true);
      }
      msg.dispose();
    }
  }
  this.alignMessages(bottom, 0, -heightRemoved);
};
chatango.output.GroupOutputWindow.prototype.removeMessage = function(id, opt_alignMessages) {
  var msg = this.msgIdMap[id];
  if (chatango.DEBUG) {
    if (msg) {
      this.logger.info("Removing single message id: " + id);
    } else {
      this.logger.info("Unable to remove single message id: " + id);
    }
  }
  if (!msg) {
    return 0;
  }
  var msgHeight = goog.style.getSize(msg.getElement()).height;
  var bottom = this.lockBottom_();
  this.messages_.removeChild(msg, true);
  delete this.msgIdMap[id];
  goog.array.remove(this.messagesArray_, msg);
  var cacheIndex = this.messageCache_.indexOf(msg);
  if (cacheIndex > -1) {
    delete this.messageCache_[cacheIndex];
  }
  msg.dispose();
  var alignMessages = typeof opt_alignMessages !== "undefined" ? opt_alignMessages : true;
  if (alignMessages) {
    this.alignMessages(bottom, 0, -1 * msgHeight);
  }
  return msgHeight;
};
chatango.output.GroupOutputWindow.prototype.removeMessagesByIds = function(ids) {
  var bottom = this.lockBottom_();
  var heightRemoved = 0;
  for (i = 1;i < ids.length;i++) {
    msgId = ids[i];
    heightRemoved += this.removeMessage(msgId, false);
  }
  this.alignMessages(bottom, 0, -1 * heightRemoved);
};
chatango.output.GroupOutputWindow.prototype.moderationModuleLoaded = function() {
  this.moderationModuleLoaded_ = true;
  if (this.modMsgsArr_) {
    var i;
    var len = this.modMsgsArr_.length;
    for (i = 0;i < len;i++) {
      this.addMessage(this.modMsgsArr_[i][0], this.modMsgsArr_[i][1]);
    }
  }
  this.modMsgsArr_ = null;
};
chatango.output.GroupOutputWindow.prototype.updateStyles = function() {
  goog.array.forEach(this.messagesArray_, function(msg) {
    msg.updateStyles();
  }, this);
  this.draw();
};
chatango.output.GroupOutputWindow.prototype.checkReplies = function() {
  goog.array.forEach(this.messagesArray_, function(msg) {
    if (msg.checkReply) {
      msg.checkReply();
    }
  }, this);
};
chatango.output.GroupOutputWindow.prototype.onChannelFilterChange_ = function(e) {
  goog.array.forEach(this.messagesArray_, function(msg) {
    if (msg.updateChannelVisiblility) {
      msg.updateChannelVisiblility();
    }
  }, this);
  this.draw();
};
chatango.output.GroupOutputWindow.prototype.onModChannelVisibilityChange_ = function(e) {
  goog.array.forEach(this.messagesArray_, function(msg) {
    if (msg.updateModChannelVisibility) {
      msg.updateModChannelVisibility();
    }
  }, this);
  this.draw();
};
chatango.output.GroupOutputWindow.prototype.onCurrentUserModSeeIPChange_ = function(e) {
  goog.array.forEach(this.messagesArray_, function(msg) {
    if (msg.updateIPVisibility) {
      msg.updateIPVisibility();
    }
  }, this);
  this.draw();
};
chatango.output.GroupOutputWindow.prototype.refreshBackgrounds = function(sid) {
  goog.array.forEach(this.messagesArray_, function(msg) {
    if (msg.getUser().getSid() !== sid) {
      return;
    }
    msg.drawBg();
  }, this);
};
chatango.output.GroupOutputWindow.prototype.getMessageQueue = function(opt_num) {
  opt_num = opt_num || 0;
  if (this.messageQueue_.length > 0) {
    return this.messageQueue_.slice(-opt_num);
  }
  return goog.array.map(this.messagesArray_.slice(0, opt_num), function(msg) {
    return{"message":msg, "position":"top"};
  });
};
chatango.output.GroupOutputWindow.prototype.onGetMoreLimited = function(time, reqId) {
  if (this.getMoreRetryTimer_ != null) {
    goog.Timer.clear(this.getMoreRetryTimer_);
  }
  var timeOut = Math.max(time - chatango.managers.ServerTime.getInstance().getServerTime(), 100);
  this.getMoreRetryTimer_ = goog.Timer.callOnce(this.retryGetMore_, timeOut, this);
  this.waitingForMore_ = false;
  this.moreLoaded_ = false;
  this.getMoreRateLimited_ = true;
  reqIdInt = parseInt(reqId, 10);
  goog.array.remove(this.unfulfilledGetMoreReqs_, reqIdInt);
  if (reqIdInt < this.getMoreRequestId_) {
    this.getMoreRequestId_ = reqIdInt;
  }
};
chatango.output.GroupOutputWindow.prototype.retryGetMore_ = function() {
  this.getMoreRetryTimer_ = null;
  this.sendGetMoreRequest();
};
goog.provide("chatango.ui.icons.ConnectionIconRenderer");
goog.require("chatango.managers.Style");
goog.require("chatango.ui.icons.IIconRenderer");
chatango.ui.icons.ConnectionIconRenderer = function() {
};
goog.addSingletonGetter(chatango.ui.icons.ConnectionIconRenderer);
chatango.ui.icons.ConnectionIconRenderer.prototype.draw = function(graphics, opt_color, opt_left, opt_top, opt_width, opt_height) {
  var path = graphics.createPath();
  var size = opt_width || graphics.width;
  var stroke = new goog.graphics.Stroke(size / 25, chatango.managers.Style.getInstance().getUDBorderColor());
  var margin = opt_width ? 0 : Math.round(size * .15);
  var top = opt_top || margin;
  var left = opt_left || margin;
  var radius = size / 2 - margin;
  var fill = new goog.graphics.SolidFill(opt_color || "#66FF33");
  graphics.drawCircle(left + radius, top + radius, radius, stroke, fill);
};
goog.provide("chatango.ui.icons.ConnectionIcon");
goog.require("chatango.ui.icons.ConnectionIconRenderer");
goog.require("chatango.ui.icons.Icon");
goog.require("goog.Timer");
goog.require("goog.color");
chatango.ui.icons.ConnectionIcon = function(opt_width, opt_height, opt_domHelper) {
  var color = chatango.ui.icons.ConnectionIcon.connectStatus.DISCONNECTED;
  chatango.ui.icons.Icon.call(this, chatango.ui.icons.ConnectionIconRenderer.getInstance(), color, opt_width, opt_height, opt_domHelper);
  this.connectingColorRGB_ = goog.color.hexToRgb(chatango.ui.icons.ConnectionIcon.colors.CONNECTING_COLOR);
};
goog.inherits(chatango.ui.icons.ConnectionIcon, chatango.ui.icons.Icon);
chatango.ui.icons.ConnectionIcon.connectStatus = {CONNECTING:"ICN_status_connecting", CONNECTED:"ICN_status_connected", DISCONNECTED:"ICN_status_disconnected"};
chatango.ui.icons.ConnectionIcon.colors = {CONNECTING_COLOR:"#FFCC00", CONNECTED_COLOR:"#7CFC00", DISCONNECTED_COLOR:"#CC0000"};
chatango.ui.icons.ConnectionIcon.prototype.setState = function(currentStatus) {
  this.icon_.clear();
  if (currentStatus == chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTING) {
    this.stopConnectionAnimation_();
    this.startConnectionAnimation_();
  } else {
    if (currentStatus == chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTED) {
      this.stopConnectionAnimation_();
      this.iconRenderer_.draw(this.icon_, chatango.ui.icons.ConnectionIcon.colors.CONNECTED_COLOR);
    } else {
      if (currentStatus == chatango.ui.icons.ConnectionIcon.connectStatus.DISCONNECTED) {
        this.stopConnectionAnimation_();
        this.iconRenderer_.draw(this.icon_, chatango.ui.icons.ConnectionIcon.colors.DISCONNECTED_COLOR);
      }
    }
  }
};
chatango.ui.icons.ConnectionIcon.prototype.startConnectionAnimation_ = function() {
  this.pulseAnimationTimer_ = new goog.Timer(100);
  goog.events.listen(this.pulseAnimationTimer_, goog.Timer.TICK, this.onAnimatePulse_, false, this);
  this.pulseAnimTickCount_ = 0;
  this.pulseAnimationTimer_.start();
};
chatango.ui.icons.ConnectionIcon.prototype.stopConnectionAnimation_ = function() {
  if (this.pulseAnimationTimer_) {
    goog.events.unlisten(this.pulseAnimationTimer_, goog.Timer.TICK, this.onAnimatePulse_, false, this);
    this.pulseAnimationTimer_.dispose();
  }
};
chatango.ui.icons.ConnectionIcon.prototype.onAnimatePulse_ = function() {
  this.pulseAnimTickCount_++;
  this.icon_.clear();
  var steps = 8;
  var alpha = Math.abs(this.pulseAnimTickCount_ % (steps * 2) - steps) / steps;
  var color = goog.color.rgbArrayToHex(goog.color.lighten(this.connectingColorRGB_, alpha));
  this.iconRenderer_.draw(this.icon_, color);
};
goog.provide("goog.positioning.ViewportPosition");
goog.require("goog.math.Coordinate");
goog.require("goog.positioning");
goog.require("goog.positioning.AbstractPosition");
goog.require("goog.positioning.Corner");
goog.require("goog.style");
goog.positioning.ViewportPosition = function(arg1, opt_arg2) {
  this.coordinate = arg1 instanceof goog.math.Coordinate ? arg1 : new goog.math.Coordinate((arg1), opt_arg2);
};
goog.inherits(goog.positioning.ViewportPosition, goog.positioning.AbstractPosition);
goog.positioning.ViewportPosition.prototype.reposition = function(element, popupCorner, opt_margin, opt_preferredSize) {
  goog.positioning.positionAtAnchor(goog.style.getClientViewportElement(element), goog.positioning.Corner.TOP_LEFT, element, popupCorner, this.coordinate, opt_margin, null, opt_preferredSize);
};
goog.provide("goog.positioning.AbsolutePosition");
goog.require("goog.math.Coordinate");
goog.require("goog.positioning");
goog.require("goog.positioning.AbstractPosition");
goog.positioning.AbsolutePosition = function(arg1, opt_arg2) {
  this.coordinate = arg1 instanceof goog.math.Coordinate ? arg1 : new goog.math.Coordinate((arg1), opt_arg2);
};
goog.inherits(goog.positioning.AbsolutePosition, goog.positioning.AbstractPosition);
goog.positioning.AbsolutePosition.prototype.reposition = function(movableElement, movableCorner, opt_margin, opt_preferredSize) {
  goog.positioning.positionAtCoordinate(this.coordinate, movableElement, movableCorner, opt_margin, null, null, opt_preferredSize);
};
goog.provide("goog.ui.Popup");
goog.provide("goog.ui.Popup.AbsolutePosition");
goog.provide("goog.ui.Popup.AnchoredPosition");
goog.provide("goog.ui.Popup.AnchoredViewPortPosition");
goog.provide("goog.ui.Popup.ClientPosition");
goog.provide("goog.ui.Popup.Overflow");
goog.provide("goog.ui.Popup.ViewPortClientPosition");
goog.provide("goog.ui.Popup.ViewPortPosition");
goog.require("goog.math.Box");
goog.require("goog.positioning.AbsolutePosition");
goog.require("goog.positioning.AnchoredPosition");
goog.require("goog.positioning.AnchoredViewportPosition");
goog.require("goog.positioning.ClientPosition");
goog.require("goog.positioning.Corner");
goog.require("goog.positioning.Overflow");
goog.require("goog.positioning.ViewportClientPosition");
goog.require("goog.positioning.ViewportPosition");
goog.require("goog.style");
goog.require("goog.ui.PopupBase");
goog.ui.Popup = function(opt_element, opt_position) {
  this.popupCorner_ = goog.positioning.Corner.TOP_START;
  this.position_ = opt_position || undefined;
  goog.ui.PopupBase.call(this, opt_element);
};
goog.inherits(goog.ui.Popup, goog.ui.PopupBase);
goog.tagUnsealableClass(goog.ui.Popup);
goog.ui.Popup.Overflow = goog.positioning.Overflow;
goog.ui.Popup.prototype.margin_;
goog.ui.Popup.prototype.getPinnedCorner = function() {
  return this.popupCorner_;
};
goog.ui.Popup.prototype.setPinnedCorner = function(corner) {
  this.popupCorner_ = corner;
  if (this.isVisible()) {
    this.reposition();
  }
};
goog.ui.Popup.prototype.getPosition = function() {
  return this.position_ || null;
};
goog.ui.Popup.prototype.setPosition = function(position) {
  this.position_ = position || undefined;
  if (this.isVisible()) {
    this.reposition();
  }
};
goog.ui.Popup.prototype.getMargin = function() {
  return this.margin_ || null;
};
goog.ui.Popup.prototype.setMargin = function(arg1, opt_arg2, opt_arg3, opt_arg4) {
  if (arg1 == null || arg1 instanceof goog.math.Box) {
    this.margin_ = arg1;
  } else {
    this.margin_ = new goog.math.Box(arg1, (opt_arg2), (opt_arg3), (opt_arg4));
  }
  if (this.isVisible()) {
    this.reposition();
  }
};
goog.ui.Popup.prototype.reposition = function() {
  if (!this.position_) {
    return;
  }
  var hideForPositioning = !this.isVisible() && this.getType() != goog.ui.PopupBase.Type.MOVE_OFFSCREEN;
  var el = this.getElement();
  if (hideForPositioning) {
    el.style.visibility = "hidden";
    goog.style.setElementShown(el, true);
  }
  this.position_.reposition(el, this.popupCorner_, this.margin_);
  if (hideForPositioning) {
    goog.style.setElementShown(el, false);
  }
};
goog.ui.Popup.AnchoredPosition = goog.positioning.AnchoredPosition;
goog.ui.Popup.AnchoredViewPortPosition = goog.positioning.AnchoredViewportPosition;
goog.ui.Popup.AbsolutePosition = goog.positioning.AbsolutePosition;
goog.ui.Popup.ViewPortPosition = goog.positioning.ViewportPosition;
goog.ui.Popup.ClientPosition = goog.positioning.ClientPosition;
goog.ui.Popup.ViewPortClientPosition = goog.positioning.ViewportClientPosition;
goog.provide("goog.ui.Tooltip");
goog.provide("goog.ui.Tooltip.CursorTooltipPosition");
goog.provide("goog.ui.Tooltip.ElementTooltipPosition");
goog.provide("goog.ui.Tooltip.State");
goog.require("goog.Timer");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.dom.safe");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.html.legacyconversions");
goog.require("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.require("goog.positioning");
goog.require("goog.positioning.AnchoredPosition");
goog.require("goog.positioning.Corner");
goog.require("goog.positioning.Overflow");
goog.require("goog.positioning.OverflowStatus");
goog.require("goog.positioning.ViewportPosition");
goog.require("goog.structs.Set");
goog.require("goog.style");
goog.require("goog.ui.Popup");
goog.require("goog.ui.PopupBase");
goog.ui.Tooltip = function(opt_el, opt_str, opt_domHelper) {
  this.dom_ = opt_domHelper || (opt_el ? goog.dom.getDomHelper(goog.dom.getElement(opt_el)) : goog.dom.getDomHelper());
  goog.ui.Popup.call(this, this.dom_.createDom("div", {"style":"position:absolute;display:none;"}));
  this.cursorPosition = new goog.math.Coordinate(1, 1);
  this.elements_ = new goog.structs.Set;
  if (opt_el) {
    this.attach(opt_el);
  }
  if (opt_str != null) {
    this.setText(opt_str);
  }
};
goog.inherits(goog.ui.Tooltip, goog.ui.Popup);
goog.tagUnsealableClass(goog.ui.Tooltip);
goog.ui.Tooltip.activeInstances_ = [];
goog.ui.Tooltip.prototype.activeEl_ = null;
goog.ui.Tooltip.prototype.className = goog.getCssName("goog-tooltip");
goog.ui.Tooltip.prototype.showDelayMs_ = 500;
goog.ui.Tooltip.prototype.showTimer;
goog.ui.Tooltip.prototype.hideDelayMs_ = 0;
goog.ui.Tooltip.prototype.hideTimer;
goog.ui.Tooltip.prototype.anchor;
goog.ui.Tooltip.State = {INACTIVE:0, WAITING_TO_SHOW:1, SHOWING:2, WAITING_TO_HIDE:3, UPDATING:4};
goog.ui.Tooltip.Activation = {CURSOR:0, FOCUS:1};
goog.ui.Tooltip.prototype.seenInteraction_;
goog.ui.Tooltip.prototype.requireInteraction_;
goog.ui.Tooltip.prototype.childTooltip_;
goog.ui.Tooltip.prototype.parentTooltip_;
goog.ui.Tooltip.prototype.getDomHelper = function() {
  return this.dom_;
};
goog.ui.Tooltip.prototype.getChildTooltip = function() {
  return this.childTooltip_;
};
goog.ui.Tooltip.prototype.attach = function(el) {
  el = goog.dom.getElement(el);
  this.elements_.add(el);
  goog.events.listen(el, goog.events.EventType.MOUSEOVER, this.handleMouseOver, false, this);
  goog.events.listen(el, goog.events.EventType.MOUSEOUT, this.handleMouseOutAndBlur, false, this);
  goog.events.listen(el, goog.events.EventType.MOUSEMOVE, this.handleMouseMove, false, this);
  goog.events.listen(el, goog.events.EventType.FOCUS, this.handleFocus, false, this);
  goog.events.listen(el, goog.events.EventType.BLUR, this.handleMouseOutAndBlur, false, this);
};
goog.ui.Tooltip.prototype.detach = function(opt_el) {
  if (opt_el) {
    var el = goog.dom.getElement(opt_el);
    this.detachElement_(el);
    this.elements_.remove(el);
  } else {
    var a = this.elements_.getValues();
    for (var el, i = 0;el = a[i];i++) {
      this.detachElement_(el);
    }
    this.elements_.clear();
  }
};
goog.ui.Tooltip.prototype.detachElement_ = function(el) {
  goog.events.unlisten(el, goog.events.EventType.MOUSEOVER, this.handleMouseOver, false, this);
  goog.events.unlisten(el, goog.events.EventType.MOUSEOUT, this.handleMouseOutAndBlur, false, this);
  goog.events.unlisten(el, goog.events.EventType.MOUSEMOVE, this.handleMouseMove, false, this);
  goog.events.unlisten(el, goog.events.EventType.FOCUS, this.handleFocus, false, this);
  goog.events.unlisten(el, goog.events.EventType.BLUR, this.handleMouseOutAndBlur, false, this);
};
goog.ui.Tooltip.prototype.setShowDelayMs = function(delay) {
  this.showDelayMs_ = delay;
};
goog.ui.Tooltip.prototype.getShowDelayMs = function() {
  return this.showDelayMs_;
};
goog.ui.Tooltip.prototype.setHideDelayMs = function(delay) {
  this.hideDelayMs_ = delay;
};
goog.ui.Tooltip.prototype.getHideDelayMs = function() {
  return this.hideDelayMs_;
};
goog.ui.Tooltip.prototype.setText = function(str) {
  goog.dom.setTextContent(this.getElement(), str);
};
goog.ui.Tooltip.prototype.setHtml = function(str) {
  this.setSafeHtml(goog.html.legacyconversions.safeHtmlFromString(str));
};
goog.ui.Tooltip.prototype.setSafeHtml = function(html) {
  var element = this.getElement();
  if (element) {
    goog.dom.safe.setInnerHtml(element, html);
  }
};
goog.ui.Tooltip.prototype.setElement = function(el) {
  var oldElement = this.getElement();
  if (oldElement) {
    goog.dom.removeNode(oldElement);
  }
  goog.ui.Tooltip.superClass_.setElement.call(this, el);
  if (el) {
    var body = this.dom_.getDocument().body;
    body.insertBefore(el, body.lastChild);
  }
};
goog.ui.Tooltip.prototype.getText = function() {
  return goog.dom.getTextContent(this.getElement());
};
goog.ui.Tooltip.prototype.getHtml = function() {
  return this.getElement().innerHTML;
};
goog.ui.Tooltip.prototype.getState = function() {
  return this.showTimer ? this.isVisible() ? goog.ui.Tooltip.State.UPDATING : goog.ui.Tooltip.State.WAITING_TO_SHOW : this.hideTimer ? goog.ui.Tooltip.State.WAITING_TO_HIDE : this.isVisible() ? goog.ui.Tooltip.State.SHOWING : goog.ui.Tooltip.State.INACTIVE;
};
goog.ui.Tooltip.prototype.setRequireInteraction = function(requireInteraction) {
  this.requireInteraction_ = requireInteraction;
};
goog.ui.Tooltip.prototype.isCoordinateInTooltip = function(coord) {
  if (!this.isVisible()) {
    return false;
  }
  var offset = goog.style.getPageOffset(this.getElement());
  var size = goog.style.getSize(this.getElement());
  return offset.x <= coord.x && coord.x <= offset.x + size.width && offset.y <= coord.y && coord.y <= offset.y + size.height;
};
goog.ui.Tooltip.prototype.onBeforeShow = function() {
  if (!goog.ui.PopupBase.prototype.onBeforeShow.call(this)) {
    return false;
  }
  if (this.anchor) {
    for (var tt, i = 0;tt = goog.ui.Tooltip.activeInstances_[i];i++) {
      if (!goog.dom.contains(tt.getElement(), this.anchor)) {
        tt.setVisible(false);
      }
    }
  }
  goog.array.insert(goog.ui.Tooltip.activeInstances_, this);
  var element = this.getElement();
  element.className = this.className;
  this.clearHideTimer();
  goog.events.listen(element, goog.events.EventType.MOUSEOVER, this.handleTooltipMouseOver, false, this);
  goog.events.listen(element, goog.events.EventType.MOUSEOUT, this.handleTooltipMouseOut, false, this);
  this.clearShowTimer();
  return true;
};
goog.ui.Tooltip.prototype.onHide_ = function() {
  goog.array.remove(goog.ui.Tooltip.activeInstances_, this);
  var element = this.getElement();
  for (var tt, i = 0;tt = goog.ui.Tooltip.activeInstances_[i];i++) {
    if (tt.anchor && goog.dom.contains(element, tt.anchor)) {
      tt.setVisible(false);
    }
  }
  if (this.parentTooltip_) {
    this.parentTooltip_.startHideTimer();
  }
  goog.events.unlisten(element, goog.events.EventType.MOUSEOVER, this.handleTooltipMouseOver, false, this);
  goog.events.unlisten(element, goog.events.EventType.MOUSEOUT, this.handleTooltipMouseOut, false, this);
  this.anchor = undefined;
  if (this.getState() == goog.ui.Tooltip.State.INACTIVE) {
    this.seenInteraction_ = false;
  }
  goog.ui.PopupBase.prototype.onHide_.call(this);
};
goog.ui.Tooltip.prototype.maybeShow = function(el, opt_pos) {
  if (this.anchor == el && this.elements_.contains(this.anchor)) {
    if (this.seenInteraction_ || !this.requireInteraction_) {
      this.setVisible(false);
      if (!this.isVisible()) {
        this.positionAndShow_(el, opt_pos);
      }
    } else {
      this.anchor = undefined;
    }
  }
  this.showTimer = undefined;
};
goog.ui.Tooltip.prototype.getElements = function() {
  return this.elements_;
};
goog.ui.Tooltip.prototype.getActiveElement = function() {
  return this.activeEl_;
};
goog.ui.Tooltip.prototype.setActiveElement = function(activeEl) {
  this.activeEl_ = activeEl;
};
goog.ui.Tooltip.prototype.showForElement = function(el, opt_pos) {
  this.attach(el);
  this.activeEl_ = el;
  this.positionAndShow_(el, opt_pos);
};
goog.ui.Tooltip.prototype.positionAndShow_ = function(el, opt_pos) {
  this.anchor = el;
  this.setPosition(opt_pos || this.getPositioningStrategy(goog.ui.Tooltip.Activation.CURSOR));
  this.setVisible(true);
};
goog.ui.Tooltip.prototype.maybeHide = function(el) {
  this.hideTimer = undefined;
  if (el == this.anchor) {
    if ((this.activeEl_ == null || this.activeEl_ != this.getElement() && !this.elements_.contains(this.activeEl_)) && !this.hasActiveChild()) {
      this.setVisible(false);
    }
  }
};
goog.ui.Tooltip.prototype.hasActiveChild = function() {
  return!!(this.childTooltip_ && this.childTooltip_.activeEl_);
};
goog.ui.Tooltip.prototype.saveCursorPosition_ = function(event) {
  var scroll = this.dom_.getDocumentScroll();
  this.cursorPosition.x = event.clientX + scroll.x;
  this.cursorPosition.y = event.clientY + scroll.y;
};
goog.ui.Tooltip.prototype.handleMouseOver = function(event) {
  var el = this.getAnchorFromElement((event.target));
  this.activeEl_ = (el);
  this.clearHideTimer();
  if (el != this.anchor) {
    this.anchor = el;
    this.startShowTimer((el));
    this.checkForParentTooltip_();
    this.saveCursorPosition_(event);
  }
};
goog.ui.Tooltip.prototype.getAnchorFromElement = function(el) {
  try {
    while (el && !this.elements_.contains(el)) {
      el = (el.parentNode);
    }
    return el;
  } catch (e) {
    return null;
  }
};
goog.ui.Tooltip.prototype.handleMouseMove = function(event) {
  this.saveCursorPosition_(event);
  this.seenInteraction_ = true;
};
goog.ui.Tooltip.prototype.handleFocus = function(event) {
  var el = this.getAnchorFromElement((event.target));
  this.activeEl_ = el;
  this.seenInteraction_ = true;
  if (this.anchor != el) {
    this.anchor = el;
    var pos = this.getPositioningStrategy(goog.ui.Tooltip.Activation.FOCUS);
    this.clearHideTimer();
    this.startShowTimer((el), pos);
    this.checkForParentTooltip_();
  }
};
goog.ui.Tooltip.prototype.getPositioningStrategy = function(activationType) {
  if (activationType == goog.ui.Tooltip.Activation.CURSOR) {
    var coord = this.cursorPosition.clone();
    return new goog.ui.Tooltip.CursorTooltipPosition(coord);
  }
  return new goog.ui.Tooltip.ElementTooltipPosition(this.activeEl_);
};
goog.ui.Tooltip.prototype.checkForParentTooltip_ = function() {
  if (this.anchor) {
    for (var tt, i = 0;tt = goog.ui.Tooltip.activeInstances_[i];i++) {
      if (goog.dom.contains(tt.getElement(), this.anchor)) {
        tt.childTooltip_ = this;
        this.parentTooltip_ = tt;
      }
    }
  }
};
goog.ui.Tooltip.prototype.handleMouseOutAndBlur = function(event) {
  var el = this.getAnchorFromElement((event.target));
  var elTo = this.getAnchorFromElement((event.relatedTarget));
  if (el == elTo) {
    return;
  }
  if (el == this.activeEl_) {
    this.activeEl_ = null;
  }
  this.clearShowTimer();
  this.seenInteraction_ = false;
  if (this.isVisible() && (!event.relatedTarget || !goog.dom.contains(this.getElement(), event.relatedTarget))) {
    this.startHideTimer();
  } else {
    this.anchor = undefined;
  }
};
goog.ui.Tooltip.prototype.handleTooltipMouseOver = function(event) {
  var element = this.getElement();
  if (this.activeEl_ != element) {
    this.clearHideTimer();
    this.activeEl_ = element;
  }
};
goog.ui.Tooltip.prototype.handleTooltipMouseOut = function(event) {
  var element = this.getElement();
  if (this.activeEl_ == element && (!event.relatedTarget || !goog.dom.contains(element, event.relatedTarget))) {
    this.activeEl_ = null;
    this.startHideTimer();
  }
};
goog.ui.Tooltip.prototype.startShowTimer = function(el, opt_pos) {
  if (!this.showTimer) {
    this.showTimer = goog.Timer.callOnce(goog.bind(this.maybeShow, this, el, opt_pos), this.showDelayMs_);
  }
};
goog.ui.Tooltip.prototype.clearShowTimer = function() {
  if (this.showTimer) {
    goog.Timer.clear(this.showTimer);
    this.showTimer = undefined;
  }
};
goog.ui.Tooltip.prototype.startHideTimer = function() {
  if (this.getState() == goog.ui.Tooltip.State.SHOWING) {
    this.hideTimer = goog.Timer.callOnce(goog.bind(this.maybeHide, this, this.anchor), this.getHideDelayMs());
  }
};
goog.ui.Tooltip.prototype.clearHideTimer = function() {
  if (this.hideTimer) {
    goog.Timer.clear(this.hideTimer);
    this.hideTimer = undefined;
  }
};
goog.ui.Tooltip.prototype.disposeInternal = function() {
  this.setVisible(false);
  this.clearShowTimer();
  this.detach();
  if (this.getElement()) {
    goog.dom.removeNode(this.getElement());
  }
  this.activeEl_ = null;
  delete this.dom_;
  goog.ui.Tooltip.superClass_.disposeInternal.call(this);
};
goog.ui.Tooltip.CursorTooltipPosition = function(arg1, opt_arg2) {
  goog.positioning.ViewportPosition.call(this, arg1, opt_arg2);
};
goog.inherits(goog.ui.Tooltip.CursorTooltipPosition, goog.positioning.ViewportPosition);
goog.ui.Tooltip.CursorTooltipPosition.prototype.reposition = function(element, popupCorner, opt_margin) {
  var viewportElt = goog.style.getClientViewportElement(element);
  var viewport = goog.style.getVisibleRectForElement(viewportElt);
  var margin = opt_margin ? new goog.math.Box(opt_margin.top + 10, opt_margin.right, opt_margin.bottom, opt_margin.left + 10) : new goog.math.Box(10, 0, 0, 10);
  if (goog.positioning.positionAtCoordinate(this.coordinate, element, goog.positioning.Corner.TOP_START, margin, viewport, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y) & goog.positioning.OverflowStatus.FAILED) {
    goog.positioning.positionAtCoordinate(this.coordinate, element, goog.positioning.Corner.TOP_START, margin, viewport, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.ADJUST_Y);
  }
};
goog.ui.Tooltip.ElementTooltipPosition = function(element) {
  goog.positioning.AnchoredPosition.call(this, element, goog.positioning.Corner.BOTTOM_RIGHT);
};
goog.inherits(goog.ui.Tooltip.ElementTooltipPosition, goog.positioning.AnchoredPosition);
goog.ui.Tooltip.ElementTooltipPosition.prototype.reposition = function(element, popupCorner, opt_margin) {
  var offset = new goog.math.Coordinate(10, 0);
  if (goog.positioning.positionAtAnchor(this.element, this.corner, element, popupCorner, offset, opt_margin, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y) & goog.positioning.OverflowStatus.FAILED) {
    goog.positioning.positionAtAnchor(this.element, goog.positioning.Corner.TOP_RIGHT, element, goog.positioning.Corner.BOTTOM_LEFT, offset, opt_margin, goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.ADJUST_Y);
  }
};
goog.provide("chatango.group.GroupHeader");
goog.require("goog.dom");
goog.require("goog.ui.Component");
goog.require("goog.graphics");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
goog.require("goog.events");
goog.require("goog.module.ModuleLoader");
goog.require("goog.style");
goog.require("goog.ui.Tooltip");
goog.require("chatango.events.EventType");
goog.require("chatango.group.GroupInfo");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.buttons.CloseButton");
goog.require("chatango.ui.buttons.IconButton");
goog.require("chatango.ui.icons.ConnectionIcon");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.networking.BaseConnection");
goog.require("chatango.managers.Style");
goog.require("goog.debug.Logger");
chatango.group.GroupHeader = function(groupInfo, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.groupTitleEl_ = null;
  this.urlEl_ = null;
  this.ownersMessageEl_ = null;
  this.closeBtn_ = null;
  this.controlsEl_ = null;
  this.moreInfoLink_ = null;
  this.titleUrlContainerEl_ = null;
  this.currentConnectionState_ = chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION;
  this.isFullSizeGroupOnMobile_ = chatango.managers.Environment.getInstance().isMobile() && chatango.managers.Style.getInstance().isFullSizeGroup();
  this.isFullSizeGroupOnTablet_ = chatango.managers.Environment.getInstance().isTablet() && chatango.managers.Style.getInstance().isFullSizeGroup();
  var embedType = chatango.managers.Style.getInstance().getEmbedType();
  this.isCollapsableGroup_ = embedType == chatango.group.GroupEmbedTypes.BOX_FIXED || embedType == chatango.group.GroupEmbedTypes.TAB || embedType == chatango.group.GroupEmbedTypes.BUTTON;
  this.isCollapsableGroupOnMobile_ = chatango.managers.Environment.getInstance().isMobile() && this.isCollapsableGroup_;
  this.showTitle_ = chatango.managers.Style.getInstance().titleIsVisible() && !this.isFullSizeGroupOnTablet_;
  this.urlIsVisible_ = chatango.managers.Style.getInstance().urlIsVisible();
  this.showMessage_ = chatango.managers.Style.getInstance().messageIsVisible() && !this.isFullSizeGroupOnTablet_ && !this.isCollapsableGroupOnMobile_;
  this.showCloseButton_ = true;
  this.updateShowCloseButton(null, false);
  this.groupInfo_ = groupInfo;
  var styleManager = chatango.managers.Style.getInstance();
  goog.events.listen(styleManager, chatango.managers.Style.EventType.HEADER_TITLE_VISIBILITY_CHANGED, this.showTitle, false, this);
  goog.events.listen(styleManager, chatango.managers.Style.EventType.HEADER_URL_VISIBILITY_CHANGED, this.showUrl, false, this);
  goog.events.listen(styleManager, chatango.managers.Style.EventType.HEADER_MESSAGE_VISIBILITY_CHANGED, this.showMessage, false, this);
  goog.events.listen(styleManager, chatango.managers.Style.EventType.SHOW_CLOSE_BUTTON_CHANGED, this.updateShowCloseButton, false, this);
  goog.events.listen(groupInfo, chatango.events.EventType.UPDATE, this.onUpdate_, false, this);
  this.width_ = null;
  this.height_ = null;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
};
goog.inherits(chatango.group.GroupHeader, goog.ui.Component);
chatango.group.GroupHeader.fontSize = {TITLE:120, URL:80, OWNERS_MSG:90};
chatango.group.GroupHeader.prototype.logger = goog.debug.Logger.getLogger("chatango.group.GroupHeader");
chatango.group.GroupHeader.EventType = {HIDE_GROUP:goog.events.getUniqueId("hide_group"), DISPLAY_UPDATED:goog.events.getUniqueId("display_updated"), GROUP_REDRAW_NEEDED:goog.events.getUniqueId("header_redraw_needed")};
chatango.group.GroupHeader.ControlTypes = {JUST_CLOSE_ICON:"gh_disp_close", JUST_CONNECTION:"gh_disp_circ"};
chatango.group.GroupHeader.prototype.groupTitleStr_ = "";
chatango.group.GroupHeader.prototype.urlStr_ = "";
chatango.group.GroupHeader.prototype.ownersMessageStr_ = "";
chatango.group.GroupHeader.prototype.createDom = function(opt_domHelper) {
  this.lastScale_ = chatango.managers.Style.getInstance().getScale();
  this.groupTitleEl_ = goog.dom.createDom("a", {"id":"GTL", "target":"_blank"}, "Default title");
  this.controlsEl_ = goog.dom.createDom("span", {"id":"controls"});
  this.urlEl_ = goog.dom.createDom("a", {"id":"UTL", "target":"_blank"});
  this.ownersMessageEl_ = goog.dom.createDom("span", {"id":"MSG"});
  this.ownersMessageEl_.className = "ownmsg";
  goog.style.setStyle(this.ownersMessageEl_, "font-size", chatango.group.GroupHeader.fontSize.OWNERS_MSG + "%");
  this.ownersMessageTextContainer_ = goog.dom.createDom("span", {"id":"MSG_text"}, "Default");
  this.moreInfoLink_ = new goog.ui.Button("more", goog.ui.LinkButtonRenderer.getInstance());
  this.moreInfoLink_.addClassName("link-btn");
  this.element_ = goog.dom.createDom("div", {"id":"HEAD"});
  this.titleUrlContainerEl_ = goog.dom.createDom("div", {"id":"TL_URL_cntnr"});
  if (this.isFullSizeGroupOnMobile_) {
    var defaultConnectIconSize = chatango.managers.Style.getInstance().getIconSize();
    this.connectionIcon_ = new chatango.ui.icons.ConnectionIcon(defaultConnectIconSize / 2, defaultConnectIconSize / 2 + 1);
    this.moreInfoLink_.render(this.controlsEl_);
    this.connectionIcon_.render(this.controlsEl_);
    goog.style.setStyle(this.connectionIcon_.getElement(), "display", "inline-block");
  } else {
    if (this.isFullSizeGroupOnTablet_) {
      this.closeBtn_ = new chatango.ui.buttons.CloseButton(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
      this.closeBtn_.render(this.controlsEl_);
      this.controlsEl_.style.display = "none";
      this.connectionIcon_ = new chatango.ui.icons.ConnectionIcon;
      this.connectionIcon_.render(this.controlsEl_);
    } else {
      var closeBtnSize = null;
      if (this.isCollapsableGroupOnMobile_) {
        closeBtnSize = chatango.managers.Style.getInstance().getIconSize() * 1.2;
      }
      this.closeBtn_ = new chatango.ui.buttons.CloseButton(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR, closeBtnSize);
      this.closeBtn_.render(this.controlsEl_);
      this.connectionIcon_ = new chatango.ui.icons.ConnectionIcon;
      this.connectionIcon_.render(this.controlsEl_);
    }
  }
  if (this.closeBtn_) {
    if (chatango.managers.Environment.getInstance().isTouch()) {
      goog.events.listen(this.closeBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onCloseBtnClicked, true, this);
    } else {
      goog.events.listen(this.closeBtn_, goog.ui.Component.EventType.ACTION, this.onCloseBtnClicked, true, this);
    }
    goog.style.setStyle(this.closeBtn_.getElement(), "display", "none");
    goog.dom.setProperties(this.closeBtn_.getElement(), {"title":this.lm_.getString("basic_group", "click_to_close")});
  }
  goog.dom.appendChild(this.titleUrlContainerEl_, this.groupTitleEl_);
  goog.dom.appendChild(this.titleUrlContainerEl_, this.urlEl_);
  goog.dom.appendChild(this.element_, this.titleUrlContainerEl_);
  goog.dom.appendChild(this.element_, this.controlsEl_);
  if (!this.isFullSizeGroupOnMobile_ && !this.isCollapsableGroupOnMobile_) {
    goog.dom.appendChild(this.ownersMessageEl_, this.ownersMessageTextContainer_);
    this.moreInfoLink_.render(this.ownersMessageEl_);
    goog.dom.appendChild(this.element_, this.ownersMessageEl_);
  }
  goog.events.listen(this.moreInfoLink_, goog.ui.Component.EventType.ACTION, this.moreClicked, true, this);
  goog.events.listen(this.element_, goog.events.EventType.CLICK, this.onHeaderClicked_, false, this);
};
chatango.group.GroupHeader.prototype.setTitle = function(groupName) {
  goog.dom.setTextContent(this.groupTitleEl_, groupName);
  if (this.isFullSizeGroupOnMobile_ || this.isCollapsableGroupOnMobile_) {
    goog.style.setStyle(this.groupTitleEl_, "font-size", String(chatango.group.GroupHeader.fontSize.TITLE) + "%");
    var width = this.getElement().offsetWidth - this.controlsEl_.offsetWidth - 10;
    goog.style.setStyle(this.titleUrlContainerEl_, "width", width + "px");
    goog.style.setStyle(this.groupTitleEl_, "word-break", "normal");
    goog.style.setStyle(this.groupTitleEl_, "white-space", "nowrap");
    var lineHeight = this.groupTitleEl_.offsetHeight;
    goog.style.setStyle(this.groupTitleEl_, "word-break", "break-all");
    goog.style.setStyle(this.groupTitleEl_, "white-space", "normal");
    var totalTitleHeight = this.groupTitleEl_.offsetHeight;
    if (this.showMessage_ && this.ownersMessageStr_ != "" || lineHeight != totalTitleHeight) {
      this.moreInfoLink_.setVisible(true);
      var width = this.getElement().offsetWidth - this.controlsEl_.offsetWidth - 10;
      if (this.isFullSizeGroupOnMobile_) {
        width -= this.moreInfoLink_.getContentElement().offsetWidth;
      }
      goog.style.setStyle(this.titleUrlContainerEl_, "width", width + "px");
      goog.dom.setTextContent(this.groupTitleEl_, groupName + " ... ");
      goog.style.setStyle(this.groupTitleEl_, "word-break", "break-all");
      goog.style.setStyle(this.groupTitleEl_, "white-space", "normal");
      var totalTitleHeight = this.groupTitleEl_.offsetHeight;
      var originalLength = groupName.length;
      var n = originalLength;
      while (lineHeight < totalTitleHeight && n != 0) {
        n--;
        groupName = groupName.substring(0, n);
        goog.dom.setTextContent(this.groupTitleEl_, groupName + " ... ");
        totalTitleHeight = this.groupTitleEl_.offsetHeight;
      }
      if (n == originalLength) {
        goog.dom.setTextContent(this.groupTitleEl_, groupName);
      } else {
        goog.dom.setTextContent(this.groupTitleEl_, groupName + " ... ");
      }
    } else {
      this.moreInfoLink_.setVisible(false);
    }
  } else {
    var maxFont = chatango.group.GroupHeader.fontSize.TITLE;
    var minFont = 10;
    var fontSize = maxFont;
    var width = this.getElement().offsetWidth - this.controlsEl_.offsetWidth - 10;
    goog.style.setStyle(this.groupTitleEl_, "width", width + "px");
    do {
      goog.style.setStyle(this.groupTitleEl_, "font-size", fontSize + "%");
      goog.style.setStyle(this.titleUrlContainerEl_, "width", width + "px");
      if (fontSize == minFont) {
        goog.style.setStyle(this.groupTitleEl_, "word-break", "break-all");
        goog.style.setStyle(this.groupTitleEl_, "white-space", "normal");
      } else {
        goog.style.setStyle(this.groupTitleEl_, "word-break", "normal");
        goog.style.setStyle(this.groupTitleEl_, "white-space", "nowrap");
        var lineHeight = this.groupTitleEl_.offsetHeight;
        goog.style.setStyle(this.groupTitleEl_, "word-break", "break-all");
        goog.style.setStyle(this.groupTitleEl_, "white-space", "normal");
        var groupTitleDivHeight = this.groupTitleEl_.offsetHeight;
      }
      fontSize -= 5;
    } while (lineHeight < groupTitleDivHeight && fontSize != minFont);
  }
};
chatango.group.GroupHeader.prototype.setUrl_ = function(urlText, fontSize, textOnly) {
  if (this.isFullSizeGroupOnTablet_) {
    return;
  }
  if (!textOnly) {
    var url = urlText;
    if (url.substring(0, 4) != "http") {
      url = "http://" + url;
    }
    this.urlEl_.setAttribute("href", url);
  }
  goog.dom.setTextContent(this.urlEl_, urlText);
  goog.style.setStyle(this.urlEl_, "font-size", fontSize + "%");
  goog.style.setStyle(this.urlEl_, "word-break", "normal");
  var lineHeight = this.urlEl_.offsetHeight;
  goog.style.setStyle(this.urlEl_, "word-break", "break-all");
  var urlTotalHeight = this.urlEl_.offsetHeight;
  var headerTotalHeight = this.element_.offsetHeight;
  if (lineHeight < urlTotalHeight) {
    var index = urlText.indexOf("http://");
    if (index == -1) {
      goog.dom.setTextContent(this.urlEl_, "");
    } else {
      this.setUrl_(urlText.substring(7, this.urlStr_.length), fontSize, true);
    }
  }
};
chatango.group.GroupHeader.prototype.draw = function(width, height) {
  if (this.lastScale_ != chatango.managers.Style.getInstance().getScale()) {
    if (this.closeBtn_) {
      this.closeBtn_.reScale();
    }
    if (this.connectionIcon_) {
      this.connectionIcon_.reScale();
    }
    this.lastScale_ = chatango.managers.Style.getInstance().getScale();
  }
  width = width ? width : this.width_;
  height = height ? height : this.height_;
  this.width_ = width;
  this.height_ = height;
  if (!this.isFullSizeGroupOnMobile_) {
    this.groupTitleEl_.setAttribute("href", this.titleUrl_);
  }
  if (this.isFullSizeGroupOnMobile_ || this.isCollapsableGroupOnMobile_) {
    this.setUrl_("");
    this.setTitle(this.groupTitleStr_);
  } else {
    if (width < 180 || height < 220) {
      this.setUrl_("");
      this.setDescription("", 2);
      if (this.showTitle_) {
        this.setTitle(this.groupTitleStr_);
      } else {
        this.setTitle("");
      }
    } else {
      if (this.showMessage_) {
        var prevSib = goog.dom.getPreviousElementSibling(this.ownersMessageEl_);
        if (!this.urlIsVisible_ && !this.showTitle_) {
          goog.style.setStyle(this.ownersMessageEl_, "width", "100%");
          if (prevSib == this.controlsEl_) {
            goog.dom.removeNode(this.controlsEl_);
            goog.dom.insertChildAt(this.ownersMessageEl_, this.controlsEl_, 0);
          }
        } else {
          goog.style.setStyle(this.ownersMessageEl_, "width");
          if (prevSib != this.controlsEl_) {
            goog.dom.removeNode(this.controlsEl_);
            goog.dom.insertSiblingBefore(this.controlsEl_, this.ownersMessageEl_);
          }
        }
        if (width < 300 && height < 350 || width < 180 && height < 400) {
          this.setDescription("", 2);
        } else {
          if (width < 400 && height < 450 || width < 280 && height < 500) {
            this.setDescription(this.ownersMessageStr_, 32);
          } else {
            this.setDescription(this.ownersMessageStr_, 50);
          }
        }
      } else {
        this.setDescription("", 2);
      }
      if (this.showTitle_) {
        this.setTitle(this.groupTitleStr_);
      } else {
        this.setTitle("");
      }
      this.setUrl_(this.urlStr_, chatango.group.GroupHeader.fontSize.URL);
      if (this.urlIsVisible_) {
        this.urlEl_.style.display = "block";
      } else {
        this.urlEl_.style.display = "none";
      }
    }
  }
  if (!this.showMessage_ && !this.showTitle_) {
    this.element_.style.padding = "0";
  } else {
    this.element_.style.padding = "";
  }
};
chatango.group.GroupHeader.prototype.setDescription = function(message, maxHeight, opt_maxLines) {
  goog.dom.setTextContent(this.ownersMessageTextContainer_, message);
  var originalMessageLength = message.length;
  var n = originalMessageLength;
  var targetHeight;
  if (opt_maxLines) {
    goog.style.setStyle(this.ownersMessageTextContainer_, "word-break", "normal");
    goog.style.setStyle(this.ownersMessageTextContainer_, "white-space", "nowrap");
    var lineHeight = this.ownersMessageTextContainer_.offsetHeight;
    targetHeight = lineHeight * opt_maxLines;
  } else {
    targetHeight = maxHeight;
  }
  goog.style.setStyle(this.ownersMessageTextContainer_, "word-break", "break-all");
  goog.style.setStyle(this.ownersMessageTextContainer_, "white-space", "normal");
  this.moreInfoLink_.setVisible(true);
  var ownersMessageHeight = this.ownersMessageEl_.offsetHeight;
  while (targetHeight < ownersMessageHeight && n != 0) {
    n--;
    message = message.substring(0, n);
    goog.dom.setTextContent(this.ownersMessageTextContainer_, message + " ... ");
    ownersMessageHeight = this.ownersMessageEl_.offsetHeight;
  }
  if (originalMessageLength != n) {
    message = message + " ... ";
    this.moreInfoLink_.setVisible(true);
  } else {
    this.moreInfoLink_.setVisible(false);
  }
  goog.dom.setTextContent(this.ownersMessageTextContainer_, message);
};
chatango.group.GroupHeader.prototype.setConnectionListener = function(con) {
  this.connection = con;
  switch(con.getStatus()) {
    case chatango.networking.ConnectionStatusEvent.EventType.CONNECTED:
      if (this.connectionIcon_) {
        this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTED);
      }
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.CMD_NOT_SENT:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED:
      if (this.connectionIcon_) {
        this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.DISCONNECTED);
      }
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.SOCKET_CONNECTED:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.CONNECTING:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING:
      if (this.connectionIcon_) {
        this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTING);
      }
      break;
    default:
    ;
  }
  goog.events.listen(this.connection, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.setConnection, false, this);
  goog.events.listen(this.connection, chatango.networking.ConnectionStatusEvent.EventType.CONNECTED, this.setConnection, false, this);
  goog.events.listen(this.connection, chatango.networking.ConnectionStatusEvent.EventType.CMD_NOT_SENT, this.setConnection, false, this);
  goog.events.listen(this.connection, chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT, this.setConnection, false, this);
  goog.events.listen(this.connection, chatango.networking.ConnectionStatusEvent.EventType.CONNECTING, this.setConnection, false, this);
  goog.events.listen(this.connection, chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING, this.setConnection, false, this);
  goog.events.listen(this.connection, chatango.networking.ConnectionStatusEvent.EventType.SOCKET_CONNECTED, this.setConnection, false, this);
};
chatango.group.GroupHeader.prototype.setControls = function(type) {
  if (chatango.DEBUG) {
    this.logger.info("the type we are switching to " + type + " CURRENT " + this.currentConnectionState_);
  }
  switch(type) {
    case chatango.group.GroupHeader.ControlTypes.JUST_CLOSE_ICON:
      if (this.currentConnectionState_ == chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION) {
        if (this.connectionIcon_) {
          goog.style.setStyle(this.connectionIcon_.getElement(), "display", "none");
        }
        if (this.closeBtn_) {
          if (this.showCloseButton_) {
            goog.style.setStyle(this.closeBtn_.getElement(), "display", "inline");
          } else {
            goog.style.setStyle(this.closeBtn_.getElement(), "display", "none");
          }
        }
      }
      break;
    case chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION:
      if (this.currentConnectionState_ == chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION) {
      } else {
        if (this.currentConnectionState_ == chatango.group.GroupHeader.ControlTypes.JUST_CLOSE_ICON) {
          if (this.closeBtn_) {
            goog.style.setStyle(this.closeBtn_.getElement(), "display", "none");
          }
          if (this.connectionIcon_) {
            goog.style.setStyle(this.connectionIcon_.getElement(), "display", "inline");
          }
        }
      }
      break;
    default:
    ;
  }
  this.currentConnectionState_ = type;
  this.dispatchEvent(chatango.group.GroupHeader.EventType.DISPLAY_UPDATED);
};
chatango.group.GroupHeader.prototype.onGroupDisconnect = function() {
  if (this.connectionIcon_) {
    this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.DISCONNECTED);
  }
  this.setControls(chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION);
  if (this.isFullSizeGroupOnTablet_) {
    this.controlsEl_.style.display = "block";
  }
};
chatango.group.GroupHeader.prototype.setOwnersMessageStr = function(str) {
  this.ownersMessageStr_ = str;
};
chatango.group.GroupHeader.prototype.setGroupTitleStr = function(str) {
  this.groupTitleStr_ = str;
};
chatango.group.GroupHeader.prototype.setUrlStr = function(str) {
  this.urlStr_ = decodeURIComponent(str);
  if (str.indexOf("http://") !== 0) {
    this.titleUrl_ = "http://" + str;
  } else {
    this.titleUrl = str;
  }
};
chatango.group.GroupHeader.prototype.setConnection = function(e) {
  switch(e.type) {
    case chatango.networking.ConnectionStatusEvent.EventType.CONNECTED:
      if (this.connectionIcon_) {
        this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTED);
        if (this.isFullSizeGroupOnTablet_) {
          if (this.controlsEl_.style.display != "none") {
            this.controlsEl_.style.display = "none";
          }
        }
      }
      this.setControls(chatango.group.GroupHeader.ControlTypes.JUST_CLOSE_ICON);
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.CMD_NOT_SENT:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT:
    ;
    case chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED:
      this.onGroupDisconnect();
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.SOCKET_CONNECTED:
      if (this.connectionIcon_) {
        this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTING);
      }
      this.setControls(chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION);
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.CONNECTING:
      if (this.connectionIcon_) {
        this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTING);
      }
      this.setControls(chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION);
      break;
    case chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING:
      if (this.connectionIcon_) {
        this.connectionIcon_.setState(chatango.ui.icons.ConnectionIcon.connectStatus.CONNECTING);
      }
      this.setControls(chatango.group.GroupHeader.ControlTypes.JUST_CONNECTION);
      break;
    default:
    ;
  }
};
chatango.group.GroupHeader.prototype.moreClicked = function() {
  goog.module.ModuleManager.getInstance().execOnLoad("MoreInfoModule", this.moreInfoModuleLoaded, this);
};
chatango.group.GroupHeader.prototype.moreInfoModuleLoaded = function() {
  var toShowString;
  if (this.ownersMessageStr_ != "") {
    toShowString = this.ownersMessageStr_;
  } else {
    toShowString = this.groupTitleStr_;
  }
  chatango.modules.MoreInfoModule.getInstance().openMorePopUp(toShowString, this.element_.offsetHeight / 2 + 5);
};
chatango.group.GroupHeader.prototype.onCloseBtnClicked = function(e) {
  this.dispatchEvent(chatango.group.GroupHeader.EventType.HIDE_GROUP);
  e.preventDefault();
  e.stopPropagation();
};
chatango.group.GroupHeader.prototype.showTitle = function() {
  this.showTitle_ = chatango.managers.Style.getInstance().titleIsVisible();
  this.dispatchEvent(chatango.group.GroupHeader.EventType.GROUP_REDRAW_NEEDED);
};
chatango.group.GroupHeader.prototype.showUrl = function(e) {
  this.urlIsVisible_ = chatango.managers.Style.getInstance().urlIsVisible();
  this.dispatchEvent(chatango.group.GroupHeader.EventType.DISPLAY_UPDATED);
};
chatango.group.GroupHeader.prototype.showMessage = function() {
  this.showMessage_ = chatango.managers.Style.getInstance().messageIsVisible() && !this.isFullSizeGroupOnTablet_ && !this.isCollapsableGroupOnMobile_;
  this.dispatchEvent(chatango.group.GroupHeader.EventType.DISPLAY_UPDATED);
};
chatango.group.GroupHeader.prototype.updateShowCloseButton = function(opt_e, opt_shouldDispatchEvent) {
  this.showCloseButton_ = this.isCollapsableGroup_ || chatango.managers.Style.getInstance().getShowCloseButton() && !chatango.managers.Style.getInstance().isFullSizeGroup();
  if (opt_shouldDispatchEvent || opt_shouldDispatchEvent == null) {
    this.dispatchEvent(chatango.group.GroupHeader.EventType.DISPLAY_UPDATED);
  }
};
chatango.group.GroupHeader.prototype.onUpdate_ = function(e) {
  this.setUrlStr(this.groupInfo_.getGroupURL());
  this.setGroupTitleStr(this.groupInfo_.getGroupTitle());
  this.setOwnersMessageStr(this.groupInfo_.getFilteredOwnerMessage());
  this.draw();
};
chatango.group.GroupHeader.prototype.onHeaderClicked_ = function(e) {
  if (e.target == e.currentTarget) {
    if (this.titleUrl_.substr(0, 8) != "http://.") {
      goog.window.open(this.titleUrl_, {"target":"_blank"});
    }
  }
};
chatango.group.GroupHeader.prototype.disposeInternal = function() {
  if (this.closeBtn_) {
    goog.events.unlisten(this.closeBtn_, goog.ui.Component.EventType.ACTION, this.onCloseBtnClicked, false, this);
  }
  if (this.moreInfoLink_) {
    goog.events.unlisten(this.moreInfoLink_, goog.ui.Component.EventType.ACTION, this.moreClicked, false, this);
  }
  if (this.connection) {
    goog.events.unlisten(this.connection, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.setConnection, false, this);
    goog.events.unlisten(this.connection, chatango.networking.ConnectionStatusEvent.EventType.CONNECTED, this.setConnection, false, this);
    goog.events.unlisten(this.connection, chatango.networking.ConnectionStatusEvent.EventType.CMD_NOT_SENT, this.setConnection, false, this);
    goog.events.unlisten(this.connection, chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT, this.setConnection, false, this);
    goog.events.unlisten(this.connection, chatango.networking.ConnectionStatusEvent.EventType.CONNECTING, this.setConnection, false, this);
    goog.events.unlisten(this.connection, chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING, this.setConnection, false, this);
    goog.events.unlisten(this.connection, chatango.networking.ConnectionStatusEvent.EventType.SOCKET_CONNECTED, this.setConnection, false, this);
  }
  chatango.group.GroupHeader.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.Group");
goog.require("chatango.modules.CommonCoreModule");
goog.require("chatango.group.GroupHeader");
goog.require("chatango.group.GroupInput");
goog.require("chatango.group.GroupEmbedTypes");
goog.require("goog.dom");
goog.require("goog.debug.Console");
goog.require("goog.debug.DivConsole");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.Timer");
goog.require("goog.style");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleLoader");
goog.require("goog.net.cookies");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.Style");
goog.require("chatango.output.GroupOutputWindow");
goog.require("chatango.group.ChatManager");
goog.require("chatango.messagedata.MessageData");
goog.require("chatango.audio.AudioController");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.strings.GroupStrings");
goog.require("chatango.settings.servers.SubDomain");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.Paths");
goog.require("chatango.utils.color");
goog.require("chatango.utils.strings");
goog.require("chatango.group.AutoMessenger");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.networking.XdrIo");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.group.GroupFooter");
goog.require("chatango.group.GroupInfo");
goog.require("chatango.group.ResizeDraggerPositionHelper");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.group.GroupConnectionUI");
goog.require("chatango.login.LoginResponseEvent");
goog.require("chatango.embed.LocalCommEvent");
goog.require("chatango.embed.LocalCommParent");
goog.require("goog.ds.XmlHttpDataSource");
goog.require("goog.Uri");
goog.require("chatango.ui.iscroll");
goog.require("chatango.group.moduleInfo");
goog.require("chatango.group.GroupCover");
goog.require("chatango.login.Session");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.PremiumManager");
goog.require("chatango.managers.ResourceManager");
goog.require("chatango.managers.MessageStyleManager");
goog.require("chatango.group.GroupChatRestrictions");
goog.require("chatango.group.settings.AnnouncementsModel");
goog.require("chatango.utils.Encode");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.require("chatango.config.Config");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.utils.LoadState");
goog.require("chatango.utils.userAgent");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.ui.ScrollPane");
goog.require("chatango.ui.icons.ModIcon");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.group.moderation.ModerationManager");
goog.require("chatango.events.ResizeIframeEvent");
goog.require("chatango.events.EnableResizeDraggerEvent");
goog.require("chatango.events.ToggleUserScalingEvent");
goog.require("chatango.embed.CollapsedViewSettings");
goog.require("chatango.embed.AppComm");
goog.require("chatango.group.DefaultStyles");
goog.require("chatango.events.OpenPmEvent");
chatango.group.Group = function(init_obj) {
  goog.events.EventTarget.call(this);
  this.handler = new goog.events.EventHandler(this);
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.managers_.setManager(chatango.managers.ResourceManager.ManagerType, new chatango.managers.ResourceManager);
  if (init_obj["mockgroup"] || init_obj["styles"]["mockgroup"]) {
    chatango.managers.Environment.getInstance().setMockGroup(init_obj["mockgroup"] == true || init_obj["styles"]["mockgroup"]);
    chatango.managers.Environment.getInstance().setEmbeddableMockGroup(init_obj["styles"]["mockgroup"]);
    if (init_obj["styles"]["useGivenScale"]) {
      chatango.managers.ScaleManager.getInstance().useGivenScale(init_obj["styles"]["useGivenScale"]);
    } else {
      if (init_obj["styles"]["useDesktopScale"]) {
        chatango.managers.ScaleManager.getInstance().forceUseDesktopScale(true);
      }
    }
  }
  this.managers_.setManager(chatango.settings.servers.BaseDomain.ManagerType, new chatango.settings.servers.BaseDomain);
  if (init_obj["styles"]["port"] && init_obj["styles"]["port"] != 0) {
    var ports = String(init_obj["styles"]["port"]).split(".");
    var portsAreNumbers = true;
    for (var i = 0;i < ports.length;i++) {
      if (isNaN(ports[i])) {
        portsAreNumbers = false;
        break;
      }
    }
    if (portsAreNumbers) {
      chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).setPorts(ports);
    }
  }
  if (init_obj["styles"]["server"] && init_obj["styles"]["server"] != 0 && !isNaN(init_obj["styles"]["server"])) {
    chatango.settings.servers.TagServer.getInstance().setFixedServerNumber(init_obj["styles"]["server"]);
  }
  if (init_obj["styles"]["secure"] && init_obj["styles"]["secure"] == 1) {
    chatango.settings.servers.TagServer.getInstance().setIsSecure(true);
  }
  this.session_ = new chatango.login.Session;
  this.managers_.setManager(chatango.login.Session.ManagerType, this.session_);
  this.moderationManager_ = new chatango.group.moderation.ModerationManager.getInstance;
  this.managers_.setManager(chatango.group.moderation.ModerationManager.ManagerType, this.moderationManager_);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("basic_group", chatango.strings.GroupStrings, this.initCopy, this);
  chatango.managers.Style.getInstance().init(init_obj["styles"]);
  chatango.managers.Style.getInstance().setOriginalWidth(init_obj["width"]);
  chatango.managers.Style.getInstance().setOriginalHeight(init_obj["height"]);
  this.handler.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.ALLOW_PM_CHANGED, this.setAllowPm_);
  this.handler.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.USER_DEFINED_FONT_SIZE_CHANGED, this.scheduleDraw);
  this.handler.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.SHOW_HEADER_CHANGED, this.scheduleDraw);
  this.handle_ = init_obj["handle"];
  this.embedLoc_ = init_obj["loc"];
  this.msManager_ = chatango.managers.MessageStyleManager.getInstance();
  this.lastStylesOn_ = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  this.stage_ = goog.dom.getElement("cgroup");
  this.setAllowPm_();
  chatango.managers.Style.getInstance().setWindowSize(init_obj["window"]["width"], init_obj["window"]["height"]);
  this.embedType_ = chatango.group.GroupEmbedTypes.BOX;
  this.expandedSize_ = new goog.math.Size(getSizeInPixels(init_obj["width"]), getSizeInPixels(init_obj["height"]));
  this.originalExpandedSize_ = this.expandedSize_;
  function getSizeInPixels(size) {
    if (!size) {
      return 0;
    }
    return Number(size.split("px").join(""));
  }
  this.isExpanded_ = true;
  if (init_obj["styles"]["cv"] == 1) {
    this.isExpanded_ = false;
    this.embedType_ = chatango.group.GroupEmbedTypes.TAB;
    if (!init_obj["styles"]["pos"] || init_obj["styles"]["pos"] == "none") {
      this.embedType_ = chatango.group.GroupEmbedTypes.BUTTON;
      if (init_obj["expandedButton"] == true) {
        this.isExpanded_ = true;
      }
    }
  } else {
    if (init_obj["styles"]["pos"] && init_obj["styles"]["pos"] != "none") {
      this.isExpanded_ = true;
      this.embedType_ = chatango.group.GroupEmbedTypes.BOX_FIXED;
    }
  }
  chatango.managers.Style.getInstance().setEmbedType(this.embedType_);
  this.rescale();
  this.output_ = new chatango.output.GroupOutputWindow(this.managers_);
  this.handler.listen(this.output_, chatango.events.EventType.MOD_DELETE_MESSAGE, this.onModDeleteMessage_);
  this.handler.listen(this.output_, chatango.events.EventType.MOD_CONFIRM_DELETE_MESSAGE, this.onModConfirmDeleteMessage_);
  this.handler.listen(this.output_, chatango.events.EventType.MOD_BAN_USER, this.onModBanUser_);
  this.handler.listen(this.output_, chatango.events.EventType.MOD_EASYBAN, this.onModEasyban_);
  this.handler.listen(this.output_, chatango.events.EventType.REQUEST_MOD_MODULE, this.onOutputRequestedModMenu_);
  this.handler.listen(this.output_, chatango.events.EventType.OPEN_PM_EVENT, this.onOpenPmEvent_);
  this.handler.listen(this.output_, chatango.events.EventType.REPLY_TO, this.onReplyToEvent_);
  this.handler.listen(this.output_, chatango.events.EventType.LOAD_MORE, this.onLoadMoreMsgs_);
  this.handler.listen(this.output_, chatango.events.EventType.YOUTUBE_CLICK, this.onYoutubeClick_);
  this.cm_ = this.createChatManager();
  (this.createGroupInfo());
  this.managers_.setManager(chatango.group.GroupInfo.ManagerType, this.groupInfo_);
  this.output_.initChannels();
  this.premiumManager_ = chatango.managers.PremiumManager.getInstance();
  this.premiumManager_.setConnection(this.getConnection());
  this.handler.listen(this.getConnection(), chatango.events.EventType.LOGIN_STATUS_DETERMINED, this.onClientAuthenticated_);
  this.handler.listen(this.getConnection(), chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.closePopUps_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.n, this.nUpdated_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.inited, this.inited_);
  this.inited_ = false;
  var floodEvents = [chatango.networking.GroupConnectionEvent.EventType.show_fw, chatango.networking.GroupConnectionEvent.EventType.show_tb, chatango.networking.GroupConnectionEvent.EventType.tb, chatango.networking.GroupConnectionEvent.EventType.end_fw];
  this.handler.listen(this.getConnection(), floodEvents, this.onFloodEvent_);
  var nlpEvents = [chatango.networking.GroupConnectionEvent.EventType.show_nlp, chatango.networking.GroupConnectionEvent.EventType.show_nlp_tb, chatango.networking.GroupConnectionEvent.EventType.nlptb, chatango.networking.GroupConnectionEvent.EventType.end_nlp];
  this.handler.listen(this.getConnection(), nlpEvents, this.onNlpEvent_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.msglexceeded, this.onGenericWarningEvent_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.limitexceeded, this.onGenericWarningEvent_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.ratelimited, this.onRateLimitedEvent_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.ratelimitset, this.onRateLimitChange_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.commandlimited, this.onCommandLimited_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.proxybanned, this.onProxyBanned_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.emailverificationrequired, this.onEmailVerificationRequired_);
  this.handler.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.verificationchanged, function() {
    chatango.users.UserManager.getInstance().currentUser.reloadProfile();
  });
  if (!this.isExpanded_ && this.isCollapsableView_()) {
    this.initCollapsedView();
  }
  this.input_ = new chatango.group.GroupInput(this.cm_, this.managers_);
  this.handler.listen(this.input_, chatango.input.Input.EventType.MESSAGE_INPUT, this.onMessageInput_);
  this.handler.listen(this.input_, chatango.events.EventType.SET_NAME, this.onSetName_);
  this.handler.listen(this.input_, chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLogin_, false);
  this.handler.listen(this.input_, goog.events.EventType.RESIZE, this.draw, false);
  this.handler.listen(this.input_, [chatango.events.MessageStyleEvent.EventType.CHANGED, chatango.managers.MessageStyleManager.EventType.MSG_STYLES_ALLOWED_CHANGED], this.styleChanged_, false);
  this.handler.listen(this.input_, chatango.events.EventType.AUTOCOMPLETE, this.onInputAutocomplete_, false);
  this.createDom();
  chatango.managers.DateManager.getInstance();
  if (chatango.DEBUG) {
    this.logger.info("GROUP constructor: " + this.handle_);
  }
  var auto_msgs = init_obj["styles"]["auto_msg"];
  var auto_msg_speed = init_obj["styles"]["auto_msg_speed"] || 3500;
  if (auto_msgs) {
    var AM = new chatango.group.AutoMessenger(this.output_, this.getConnection(), auto_msg_spee)
  }
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  goog.events.listen(this.vsm_, goog.events.EventType.RESIZE, this.onResize, false, this);
  var viewPortSize = this.vsm_.getSize();
  goog.style.setSize(this.stage_, viewPortSize.width, viewPortSize.height);
  this.userManager_ = chatango.users.UserManager.getInstance();
  this.requestGroupInfo(init_obj["handle"]);
  var connectionEvents = [chatango.networking.ConnectionStatusEvent.EventType.SOCKET_CONNECTED, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED];
  this.handler.listen(this.getConnection(), connectionEvents, this.onConnectionEvent_, false);
  this.handler.listen(chatango.users.ModeratorManager.getInstance(), chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE, this.onCurrentUserModStatusChange, false);
  chatango.users.ModeratorManager.getInstance().setGroupHandle(this.handle_);
  goog.events.listen(chatango.managers.Style.getInstance(), chatango.managers.Style.EventType.CV_SIZE_CHANGED, this.collapsedViewSizeChanged, null, this);
  this.lastFooterHeight_ = 0;
  this.draw();
  if (chatango.managers.Environment.getInstance().isIOS()) {
    this.lastBeat_ = (new Date).getTime();
    this.iosHeartBeat_ = new goog.Timer(1E3);
    goog.events.listen(this.iosHeartBeat_, goog.Timer.TICK, this.onIosHeartBeat_, false, this);
    this.iosHeartBeat_.start();
  }
  this.kb_ = chatango.managers.Keyboard.getInstance();
  goog.events.listen(this.kb_, [chatango.managers.Keyboard.EventType.KEYBOARD_RAISED, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED], this.onKeyboard_, true, this);
};
goog.inherits(chatango.group.Group, goog.events.EventTarget);
chatango.group.Group.prototype.createChatManager = function() {
  return new chatango.group.ChatManager(this.output_, this.handle_, this.session_);
};
chatango.group.Group.prototype.createGroupInfo = function() {
  this.groupInfo_ = new chatango.group.GroupInfo(this.getConnection(), this.handle_, this.embedLoc_);
};
chatango.group.Group.prototype.requestGroupInfo = function(handle) {
  var url = chatango.utils.Paths.getInstance().getBasicGroupPath(handle);
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
  goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, this.onBasicGroupLoad_, false, this);
  xhr.send(url);
};
chatango.group.Group.prototype.initCopy = function() {
  if (this.cm_) {
    this.cm_.groupConnectUI_.initCopy();
  }
  if (this.footer_) {
    this.footer_.initCopy();
  }
  if (this.groupCover_) {
    this.groupCover_.initCopy();
  }
  if (this.input_) {
    this.input_.initCopy();
  }
  if (this.collapsedModule_) {
    this.collapsedModule_.updateCopy();
  }
};
chatango.group.Group.prototype.createDom = function() {
  var that = this;
  this.handler.listenOnce(document, "touchstart", this.onTouchstart_);
  this.contentWrapperEl_ = goog.dom.createDom("div", {"id":"CGW"}, "");
  if (!this.isExpanded_) {
    goog.style.showElement(this.contentWrapperEl_, false);
  }
  this.sbg_ = goog.dom.createDom("div", {"id":"SGBG"});
  this.bg_ = goog.dom.createDom("div", {"id":"GBG"}, this.sbg_, this.contentWrapperEl_);
  goog.dom.appendChild(this.stage_, this.bg_);
  this.header_ = new chatango.group.GroupHeader(this.groupInfo_);
  var urlStr = this.handle_ + "." + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  this.header_.setUrlStr(urlStr);
  this.header_.render(this.contentWrapperEl_);
  goog.events.listen(this.header_, chatango.group.GroupHeader.EventType.HIDE_GROUP, this.onHideGroup, false, this);
  goog.events.listen(this.header_, chatango.group.GroupHeader.EventType.DISPLAY_UPDATED, this.scheduleDraw, false, this);
  this.output_.render(this.contentWrapperEl_);
  this.input_.render(this.contentWrapperEl_);
  this.input_.setEnabled(false);
  this.header_.setConnectionListener(this.getConnection());
  this.footer_ = new chatango.group.GroupFooter(this.groupInfo_);
  this.footer_.setConnectionListener(this.getConnection());
  this.footer_.render(this.contentWrapperEl_);
  goog.events.listen(this.footer_, [chatango.events.EventType.LOAD_SETTINGS_MODULE, chatango.events.EventType.LOAD_MODERATION_MODULE], this.onLoadModuleEvent_, false, this);
  goog.events.listen(this.footer_, chatango.events.EventType.SET_NAME, this.onSetName_, false, this);
  goog.events.listen(this.footer_, chatango.events.EventType.FOOTER_OPEN_PM, this.onFooterOpenPM_, false, this);
  goog.events.listen(this.footer_, chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.onParticipantsOpenPmEvent_, false, this);
  goog.events.listen(this.footer_, chatango.events.EventType.UPDATE, this.scheduleDraw, false, this);
  this.cm_.groupConnectUI_.render(this.stage_);
  this.hidden_ = goog.net.cookies.get("hidden" + this.handle_) == "true";
  if (!this.isExpanded_) {
    goog.style.setStyle(this.bg_, "display", "none");
    this.cm_.groupConnectUI_.setActive(false);
  }
  if (!this.isExpanded_ || this.hidden_) {
    this.enableSound(false);
    chatango.managers.WaitingAnimation.getInstance().stopAllWaitingAnimations();
  }
  this.groupCover_ = new chatango.group.GroupCover;
  this.groupCover_.setConnectionListener(this.getConnection());
  this.groupCover_.render(this.stage_);
  goog.events.listen(this.groupCover_.getElement(), goog.events.EventType.CLICK, this.onCoverClicked, false, this);
  this.handler.listen(this.input_, chatango.input.Input.EventType.FOCUS, this.onInputClicked_);
  this.handler.listen(this.input_, chatango.input.Input.EventType.BLUR, this.onInputBlur_);
};
chatango.group.Group.prototype.logger = goog.debug.Logger.getLogger("chatango.group.Group");
chatango.group.Group.prototype.rescale = function() {
  var redraw = chatango.managers.Style.getInstance().updateScale();
  if (redraw) {
    this.scheduleDraw();
  }
};
chatango.group.Group.prototype.drawScheduled_ = false;
chatango.group.Group.prototype.scheduleDraw = function() {
  if (this.drawScheduled_) {
    return;
  }
  this.drawScheduled_ = true;
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 1);
};
chatango.group.Group.prototype.onCollapsedModLoaded = function() {
  var cvMod = this.getCollapsedModule_();
  if (!cvMod.collapsedViewExists() || !cvMod.getCollapsedView().isInDocument()) {
    cvMod.getCollapsedView().render(this.stage_);
    if (chatango.managers.Environment.getInstance().isTouch()) {
      this.handler.listen(cvMod.getCollapsedView().getContentElement(), goog.events.EventType.TOUCHEND, this.onClickCV);
    } else {
      this.handler.listen(cvMod.getCollapsedView().getContentElement(), goog.events.EventType.CLICK, this.onClickCV);
    }
    this.handler.listen(cvMod.getCollapsedView(), chatango.events.EventType.RESIZE_IFRAME, this.onResizeIFrame_);
    this.handler.listen(cvMod.getCollapsedView(), chatango.events.EventType.REFRESH_MESSAGES, this.onRefreshMessages_);
    cvMod.resizeCollapsedViewToFitContent();
    if (!this.getConnection().isConnected()) {
      cvMod.getCollapsedView().show(false);
    }
    if (this.isExpanded_) {
      cvMod.getCollapsedView().show(false);
    }
  }
};
chatango.group.Group.prototype.onRefreshMessages_ = function(e) {
  var cvMod = this.getCollapsedModule_();
  cvMod.getCollapsedView().createMessageQueueFromLastMessages_(this.output_.getMessageQueue(e.data));
};
chatango.group.Group.prototype.onClickCV = function(e) {
  if (!chatango.managers.Environment.getInstance().isDesktop()) {
    this.openFullGroupPage(null, false);
    return;
  }
  this.expandOnViewDimensionsRcvd_ = true;
  try {
    this.dispatchEvent(chatango.events.EventType.GET_BROWSER_VIEW);
  } catch (e) {
  } finally {
    e.preventDefault();
    e.stopPropagation();
  }
};
chatango.group.Group.prototype.expandGroup = function() {
  if (!this.getConnection().isConnectedOrConnecting()) {
    if (chatango.DEBUG) {
      this.logger.info("Group expandGroup : this.getConnection().connect()");
    }
    this.getConnection().connect();
  }
  this.intendToExpand_ = true;
  this.resizeIframe(this.expandedSize_.width, this.expandedSize_.height);
  if (chatango.managers.Environment.getInstance().isMobile() && chatango.managers.Environment.getInstance().isIOS()) {
    this.dispatchEvent(new chatango.events.ToggleUserScalingEvent(chatango.events.ToggleUserScalingEvent.Action.DISABLE));
  }
};
chatango.group.Group.prototype.collapsedViewSizeChanged = function(e) {
  if (!this.isExpanded_) {
    this.collapseGroup();
  }
};
chatango.group.Group.prototype.collapseGroup = function(opt_e) {
  var collapsedSize = chatango.managers.Style.getInstance().getCVSize();
  goog.style.setStyle(this.bg_, "display", "none");
  goog.style.setSize(this.stage_, collapsedSize.width, collapsedSize.height);
  this.intendToExpand_ = false;
  this.resizeIframe(collapsedSize.width, collapsedSize.height);
  if (this.embedType_ == chatango.group.GroupEmbedTypes.BUTTON) {
    this.getConnection().selfKickOff(true);
    this.dispatchEvent(chatango.events.EventType.BUTTON_COLLAPSED);
    if (opt_e) {
      opt_e.stopPropagation();
      opt_e.preventDefault();
    }
  }
  if (chatango.managers.Environment.getInstance().isMobile()) {
    this.dispatchEvent(new chatango.events.ToggleUserScalingEvent(chatango.events.ToggleUserScalingEvent.Action.RESTORE));
  }
  this.cm_.groupConnectUI_.setActive(false);
  this.closePopUps_();
  this.draw();
};
chatango.group.Group.prototype.resizeIframe = function(width, height) {
  this.intendedIframeSize_ = new goog.math.Size(width, height);
  try {
    this.dispatchEvent(new chatango.events.ResizeIframeEvent(this.intendedIframeSize_));
  } catch (e) {
  }
};
chatango.group.Group.prototype.onResizeIFrame_ = function(e) {
  if (this.isExpanded_) {
    return;
  }
  var size = e.getSize();
  this.resizeIframe(size.width, size.height);
};
chatango.group.Group.prototype.iframeResizeDone = function(data) {
  this.isExpanded_ = this.intendToExpand_ && this.intendedIframeSize_.area() == this.expandedSize_.area();
  if (this.isExpanded_) {
    this.cm_.groupConnectUI_.setActive(true);
    if (this.collapsedModule_) {
      this.getCollapsedModule_().getCollapsedView().show(false);
    }
    goog.style.setSize(this.stage_, this.intendedIframeSize_);
    goog.style.setStyle(this.bg_, "display", "inline-block");
    this.enableSound(true);
    if (chatango.managers.Environment.getInstance().isDesktop() && !chatango.managers.Environment.getInstance().isMockGroup()) {
      if (!this.resizeDragger_) {
        this.resizeDragger_ = chatango.group.ResizeDraggerPositionHelper.createDraggerIcon(this.contentWrapperEl_);
      }
      this.dispatchEvent(new chatango.events.EnableResizeDraggerEvent(true));
    }
  } else {
    this.enableSound(false);
    this.cm_.groupConnectUI_.setActive(false);
    if (chatango.managers.Environment.getInstance().isDesktop()) {
      this.dispatchEvent(new chatango.events.EnableResizeDraggerEvent(false));
    }
  }
  var w = data ? data.width : null;
  var h = data ? data.height : null;
  this.draw(w, h);
};
chatango.group.Group.prototype.iframeResizeOnDragDone = function(sz) {
  this.originalExpandedSize_ = new goog.math.Size(sz["ifW"].replace(/\D/g, ""), sz["ifH"].replace(/\D/g, ""));
  this.draw(sz["ifW"], sz["ifH"]);
};
chatango.group.Group.prototype.inited_ = function(e) {
  this.inited_ = true;
};
chatango.group.Group.prototype.browserViewDimensionsReceived = function(sz) {
  if (chatango.managers.Environment.getInstance().isMobile()) {
    chatango.managers.Style.getInstance().setWindowSize(sz["win_innerWidth"], sz["win_innerHeight"]);
    chatango.managers.Style.getInstance().updateScale(true);
    this.expandedSize_ = new goog.math.Size(sz["win_innerWidth"], sz["win_innerHeight"]);
  } else {
    var w = Math.min(this.originalExpandedSize_.width, sz["win_innerWidth"]);
    var h = Math.min(this.originalExpandedSize_.height, sz["win_innerHeight"]);
    this.expandedSize_ = new goog.math.Size(w, h);
  }
  if (chatango.managers.Environment.getInstance().isIOS() && sz["win_outerWidth"] > sz["doc_clientWidth"]) {
    this.dispatchEvent(chatango.events.EventType.VIEWPORT_TOO_BIG);
  }
  if (this.embedType_ == chatango.group.GroupEmbedTypes.BUTTON) {
    this.getConnection().selfKickOff(true);
    this.dispatchEvent(chatango.events.EventType.BUTTON_EXPANDED);
  }
  if (this.expandOnViewDimensionsRcvd_) {
    this.expandGroup();
  }
};
chatango.group.Group.prototype.onOrientationChange = function(sz) {
  if (!chatango.managers.Environment.getInstance().isIOS()) {
    return;
  }
  if (this.pmMode_ && this.pm_) {
    this.pm_.onOrientationChange(sz);
  }
  if (sz["type"] == "ios_percent_embed") {
    this.draw(sz["width"], sz["height"]);
    return;
  }
  this.adjustSizeToViewport(sz);
};
chatango.group.Group.prototype.onZoomed = function(sz) {
  if (sz["cvWidth"] && sz["cvHeight"]) {
    chatango.managers.Style.getInstance().setCVSize(sz["cvWidth"], sz["cvHeight"], false);
    this.intendedIframeSize_ = new goog.math.Size(sz["cvWidth"], sz["cvHeight"]);
    goog.style.setSize(this.stage_, this.intendedIframeSize_);
  }
  this.scheduleDraw();
  this.adjustSizeToViewport(sz);
};
chatango.group.Group.prototype.onKeyboard_ = function(e) {
  if (e.type == chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED) {
    this.input_.blur();
  }
};
chatango.group.Group.prototype.adjustSizeToViewport = function(sz) {
  if (this.isExpanded_ && chatango.managers.Environment.getInstance().isTablet() && this.isCollapsableView_()) {
    if (sz["win_innerWidth"] < this.expandedSize_.width || sz["win_innerHeight"] < this.expandedSize_.height || this.originalExpandedSize_.width < sz["win_innerWidth"] && this.originalExpandedSize_.width != this.expandedSize_.width || this.originalExpandedSize_.height < sz["win_innerHeight"] && this.originalExpandedSize_.height != this.expandedSize_.height) {
      var w = Math.min(this.originalExpandedSize_.width, sz["win_innerWidth"]);
      var h = Math.min(this.originalExpandedSize_.height, sz["win_innerHeight"]);
      this.expandedSize_ = new goog.math.Size(w, h);
      this.resizeIframe(this.expandedSize_.width, this.expandedSize_.height);
    }
  } else {
    if (chatango.managers.Environment.getInstance().isMobile() && this.isCollapsableView_()) {
      var wSize = new goog.math.Size(sz["win_innerWidth"], sz["win_innerHeight"]);
      if (wSize.area() != chatango.managers.Style.getInstance().getWindowSize().area()) {
        chatango.managers.Style.getInstance().setWindowSize(sz["win_innerWidth"], sz["win_innerHeight"]);
        chatango.managers.Style.getInstance().updateScale(true);
      }
      if (this.isExpanded_) {
        var w = sz["win_innerWidth"];
        var h = sz["win_innerHeight"];
        this.expandedSize_ = new goog.math.Size(w, h);
        this.resizeIframe(this.expandedSize_.width, this.expandedSize_.height);
      }
    }
  }
};
chatango.group.Group.prototype.initCollapsedView = function() {
  if (!this.collapsedModule_) {
    goog.module.ModuleManager.getInstance().execOnLoad("CollapsedViewModule", this.onCollapsedModLoaded, this);
  } else {
    this.onCollapsedModLoaded();
  }
};
chatango.group.Group.prototype.draw = function(opt_width, opt_height) {
  this.drawScheduled_ = false;
  if (this.hidden_) {
    this.groupCover_.show();
  } else {
    if (!this.isExpanded_) {
      if (this.collapsedModule_) {
        this.getCollapsedModule_().drawCollapsedView(this.intendedIframeSize_);
      }
    } else {
      if (this.pmMode_) {
        if (goog.style.isElementShown(this.contentWrapperEl_)) {
          goog.style.showElement(this.contentWrapperEl_, false);
        }
      } else {
        if (!goog.style.isElementShown(this.contentWrapperEl_)) {
          goog.style.showElement(this.contentWrapperEl_, true);
        }
        this.groupCover_.hide();
        this.cm_.groupConnectUI_.draw_();
        this.output_.getElement().style.display = "none";
        var stage_size = goog.style.getSize(this.stage_);
        this.output_.getElement().style.display = "block";
        if (opt_width && opt_height) {
          var w = /(\d+)px/.exec(opt_width)[1];
          var h = /(\d+)px/.exec(opt_height)[1];
          stage_size = new goog.math.Size(w, h);
          if (chatango.DEBUG) {
            this.logger.info("Setting stage size: " + w + " by " + h);
          }
          goog.style.setSize(this.stage_, opt_width, opt_height);
        }
        var padding_in_px = Math.round(Math.min(chatango.utils.display.getEmInPixels(this.contentWrapperEl_) * .3, 20));
        var isFullSizeOnMobile = false;
        var isFullSizeOnTablet = false;
        if (chatango.managers.Style.getInstance().isFullSizeGroup()) {
          isFullSizeOnMobile = chatango.managers.Environment.getInstance().isMobile();
          isFullSizeOnTablet = chatango.managers.Environment.getInstance().isTablet();
        }
        var padding_rule = padding_in_px + "px";
        this.contentWrapperEl_.style.padding = padding_rule;
        var bdr_height = 1;
        var keyboardRaised = chatango.managers.Keyboard.getInstance().isRaised();
        this.footer_.getElement().style.display = keyboardRaised ? "none" : "block";
        if (chatango.utils.userAgent.ANDROID) {
          this.header_.getElement().style.display = keyboardRaised ? "none" : "block";
        }
        var header_height;
        if (chatango.managers.Style.getInstance().getShowHeader() == 1 || this.isCollapsableView_()) {
          goog.style.setStyle(this.header_.getElement(), "display", "block");
          this.header_.draw(stage_size.width, stage_size.height);
          header_height = this.header_.getElement().offsetHeight;
        } else {
          goog.style.setStyle(this.header_.getElement(), "display", "none");
          header_height = 0;
        }
        this.footer_.draw();
        var footer_height = this.footer_.getHeight();
        var vert_padding = padding_in_px * 2;
        this.input_.draw();
        var inputHeight = this.input_.getHeight();
        var outputHeight = stage_size.height - footer_height - vert_padding - bdr_height * 2 - header_height - inputHeight;
        if (this.userCanBeRateLimited_()) {
          this.execOnLoad("RateRestrictionsModule", function() {
            var width = this.vsm_.getSize().width;
            var scaledWidth = chatango.managers.ScaleManager.getInstance().getScale() / 100 * width;
            var vertical = width > 500;
            this.getRateRestrictionsModule_().setProgressBarDirection(vertical);
          });
        }
        this.constrainDialogsToScreen(new goog.math.Rect(0, 0, stage_size.width, stage_size.height));
        if (chatango.DEBUG) {
          this.logger.info("GROUP DRAW");
          this.logger.info("stage_size.width:" + stage_size.width);
          this.logger.info("header_height:" + header_height);
          this.logger.info("footer_height:" + footer_height);
          this.logger.info("vert_padding:" + vert_padding);
          this.logger.info("inputHeight:" + inputHeight);
          this.logger.info("stage_size.height:" + stage_size.height);
          this.logger.info("outputHeight:" + outputHeight);
          this.logger.info("document.documentElement.clientHeight: " + document.documentElement.clientHeight);
        }
        this.lastFooterHeight_ = this.footer_.getElement().offsetHeight;
        this.output_.setHeight(outputHeight);
        this.output_.draw();
        if (chatango.DEBUG) {
          this.logger.info("stage_size:" + stage_size.width + "," + stage_size.height + " portrait=" + (stage_size.width < stage_size.height).toString());
        }
        if (stage_size.width < chatango.group.DefaultStyles.MIN_WIDTH || stage_size.height < chatango.group.DefaultStyles.MIN_HEIGHT && !keyboardRaised) {
          this.enableSound(false);
          this.cm_.groupConnectUI_.setActive(false);
          goog.style.showElement(this.contentWrapperEl_, false);
          this.closePopUps_();
          if (this.tooSmallEl_) {
            goog.dom.removeNode(this.tooSmallEl_);
            this.tooSmallEl_ = null;
          }
          var too_sm_msg = this.lm_.getString("basic_group", "too_small").replace("*br*", "<br/>");
          if (chatango.managers.Environment.getInstance().isMobile() && this.isCollapsableView_()) {
            too_sm_msg = this.lm_.getString("basic_group", "too_small_mobile").replace("*br*", "<br/>");
          }
          var w = stage_size.width;
          var h = stage_size.height - 10;
          var tooSmallInnerEl = goog.dom.createDom("div", {"style":"display:table-cell; vertical-align:middle; text-align:center; width:" + w + "px; height:" + h + "px; color:" + chatango.managers.Style.getInstance().getUserDefinedIconColor() + ";"});
          tooSmallInnerEl.innerHTML = too_sm_msg;
          this.tooSmallEl_ = goog.dom.createDom("div", {"style":"display:table-row; width:" + w + "px; height:" + h + "px;"}, tooSmallInnerEl);
          goog.dom.appendChild(this.bg_, this.tooSmallEl_);
          if (chatango.managers.Environment.getInstance().isMobile() && this.isCollapsableView_()) {
            this.handler.listen(this.tooSmallEl_, goog.events.EventType.TOUCHEND, this.collapseGroup);
          } else {
            if (chatango.managers.Environment.getInstance().isTouch()) {
              this.handler.listen(this.tooSmallEl_, goog.events.EventType.TOUCHSTART, this.openFullGroupPage);
            } else {
              this.handler.listen(this.tooSmallEl_, goog.events.EventType.CLICK, this.openFullGroupPage);
            }
          }
          goog.style.showElement(this.tooSmallEl_, true);
        } else {
          if (this.tooSmallEl_) {
            goog.dom.removeNode(this.tooSmallEl_);
            this.tooSmallEl_ = null;
          }
        }
      }
    }
  }
};
chatango.group.Group.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.loginModule_) {
    this.getLoginModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.settingsModule_) {
    this.getSettingsModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.moderationModule_) {
    this.getModerationModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.videoModule_) {
    this.getVideoModule_().constrainDialogsToScreen(opt_stageRect);
  }
  if (this.rateRestrictionsModule_) {
    this.getRateRestrictionsModule_().constrainDialogsToScreen(opt_stageRect);
  }
  this.input_.constrainDialogsToScreen(opt_stageRect);
  this.footer_.constrainDialogsToScreen(opt_stageRect);
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    user.constrainDialogsToScreen(opt_stageRect);
  }
  chatango.managers.PaymentsManager.getInstance().constrainDialogsToScreen(opt_stageRect);
};
chatango.group.Group.prototype.onResize = function(e) {
  if (!this.isCollapsableView_() && /ipod|iphone/gi.test(navigator.appVersion)) {
    return;
  }
  if (/ipad/gi.test(navigator.appVersion)) {
    return;
  }
  if (chatango.DEBUG) {
    this.logger.info("Group On Resize");
  }
  this.rescale();
  var viewPortSize = this.vsm_.getSize();
  goog.style.setSize(this.stage_, viewPortSize.width, viewPortSize.height);
  if (this.isCollapsableView_() && !chatango.managers.Environment.getInstance().isDesktop()) {
    this.intendedIframeSize_ = viewPortSize;
    chatango.managers.Style.getInstance().setCVSize(viewPortSize.width, viewPortSize.height, false);
  }
  this.draw();
};
chatango.group.Group.prototype.onPageShow = function() {
  if (!this.getConnection().isConnectedOrConnecting()) {
    if (chatango.DEBUG) {
      this.logger.info("Group onPageShow  : this.getConnection().connect()");
    }
    this.lastUseBackground_ = null;
    this.getConnection().connect();
  }
};
chatango.group.Group.prototype.getConnection = function() {
  return this.cm_.getConnection();
};
chatango.group.Group.prototype.getOutputWindow = function() {
  return this.output_;
};
chatango.group.Group.prototype.onHideGroup = function() {
  if (this.embedType_ == chatango.group.GroupEmbedTypes.BOX) {
    this.setHidden(true);
  } else {
    this.collapseGroup();
  }
};
chatango.group.Group.prototype.setHidden = function(bool) {
  this.hidden_ = bool;
  if (!this.hidden_) {
    goog.net.cookies.set("hidden" + this.handle_, "false", 31536E3, "/");
    this.enableSound(true);
  } else {
    goog.net.cookies.set("hidden" + this.handle_, "true", 31536E3, "/");
    this.enableSound(false);
  }
  this.draw();
};
chatango.group.Group.prototype.enableSound = function(audioOnIfUserPermits) {
  chatango.audio.AudioController.getInstance().enableSound(audioOnIfUserPermits);
};
chatango.group.Group.prototype.onCoverClicked = function(e) {
  this.setHidden(false);
};
chatango.group.Group.prototype.onModDeleteMessage_ = function(e) {
  if (!this.moderationModule_) {
    this.messageToDelete = e.target;
    goog.module.ModuleManager.getInstance().execOnLoad("ModerationModule", function() {
      this.getModerationModule_().openDeleteMessageDialog(this.messageToDelete);
      this.messageToDelete = null;
    }, this);
  } else {
    this.getModerationModule_().openDeleteMessageDialog(e.target);
  }
};
chatango.group.Group.prototype.onModConfirmDeleteMessage_ = function(e) {
  if (!this.moderationModule_) {
    return;
  }
  this.getModerationModule_().onModConfirmDeleteMessage(e);
};
chatango.group.Group.prototype.onModBanUser_ = function(e) {
  if (!this.moderationModule_) {
    this.userToBan = e.target.getUser();
    goog.module.ModuleManager.getInstance().execOnLoad("ModerationModule", function() {
      this.getModerationModule_().openBanUserDialog(this.userToBan);
      this.userToBan = null;
    }, this);
  } else {
    this.getModerationModule_().openBanUserDialog(e.target.getUser());
  }
};
chatango.group.Group.prototype.onModEasyban_ = function(e) {
  if (!this.moderationModule_) {
    this.easybanEvent_ = e;
    goog.module.ModuleManager.getInstance().execOnLoad("ModerationModule", function() {
      this.getModerationModule_().easyban(this.easybanEvent_);
      this.easybanEvent_ = null;
    }, this);
  } else {
    this.getModerationModule_().easyban(e);
  }
};
chatango.group.Group.prototype.onBasicGroupLoad_ = function(e) {
  var xhr = e.currentTarget;
  var dom = xhr.getResponseXml();
  var nodeList;
  var mod;
  nodeList = dom.getElementsByTagName("gp");
  if (nodeList.length < 0) {
    if (chatango.DEBUG) {
      this.logger.info("No mod element found");
    }
    return;
  }
  mod = nodeList[0];
  nodeList = mod.getElementsByTagName("desc");
  if (nodeList.length > 0) {
    this.desc = nodeList[0].firstChild.nodeValue;
  }
  nodeList = mod.getElementsByTagName("title");
  if (nodeList && nodeList.length > 0 && nodeList[0].firstChild) {
    this.title = nodeList[0].firstChild.nodeValue;
  }
  this.groupInfo_.onBasicGroupLoad(this.desc, this.title);
  this.draw();
};
chatango.users.User.prototype.onBasicGroupLoadError_ = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("onBasicGroupLoadError_");
  }
};
chatango.group.Group.prototype.onConnectionEvent_ = function(e) {
  if (e.type === chatango.networking.ConnectionStatusEvent.EventType.SOCKET_CONNECTED) {
    this.output_.removeAllMessages();
    this.input_.setEnabled(true);
    if (this.isCollapsableView_() && !this.isExpanded_) {
      if (this.collapsedModule_) {
        var cvMod = this.getCollapsedModule_();
        if (cvMod.collapsedViewExists()) {
          cvMod.getCollapsedView().show(true);
        }
      }
    }
  } else {
    if (e.type === chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED) {
      this.input_.onDisconnect();
      chatango.managers.PremiumManager.getInstance().onDisconnect();
      this.lastUseBackground_ = null;
      this.footer_.closePopups();
      if (this.isCollapsableView_()) {
        var cvMod = this.getCollapsedModule_();
        if (cvMod.collapsedViewExists()) {
          cvMod.getCollapsedView().show(false);
        }
      }
    }
  }
};
chatango.group.Group.prototype.onTouchstart_ = function(e) {
  if (!chatango.managers.Style.getInstance().isFullSizeGroup()) {
    if (chatango.managers.Environment.getInstance().isMobile() && this.embedType_ == chatango.group.GroupEmbedTypes.BOX && !chatango.managers.Style.getInstance().getUseOnMobileEmbed()) {
      this.openFullGroupPage();
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }
};
chatango.group.Group.prototype.openFullGroupPage = function(e, opt_newWindow) {
  var url = "http://" + this.handle_ + "." + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  if (opt_newWindow) {
    goog.window.open(url, {"target":"_blank"});
  } else {
    window.top.location = url;
  }
};
chatango.group.Group.prototype.onMessageInput_ = function(e) {
  if (chatango.DEBUG) {
    this.logger.info("onMessageInput_");
  }
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var isAnon = !currentUser || currentUser.isAnon() || currentUser.isTemp();
  var canSend = currentUser && (!isAnon || this.anonsAllowed_());
  if (canSend) {
    var canBeRateLimited = this.userCanBeRateLimited_();
    if (!this.hasSeenRateLimitMessage_ && canBeRateLimited) {
      this.input_.blur();
      this.pendingMessageEvent_ = e;
      this.showRateLimitDialog();
      this.input_.restoreLastMessageText();
      return;
    }
    if (canBeRateLimited) {
      this.createProgressBarOrShow();
    }
    var message = goog.string.htmlEscape(e.message);
    var n_prefix = "";
    var f_prefix = "";
    message = message.replace(/\n/g, "<br/>");
    if (currentUser.isRegistered()) {
      var baseDomain = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
      var regex = /(^|\s)img([0-9]+)(\s|$)/g;
      var username = currentUser.getSid();
      var first = username[0];
      var second = username[1] ? username[1] : username[0];
      message = message.replace(regex, "$1http://ust." + baseDomain + "/um/" + first + "/" + second + "/" + username + "/img/t_$2.jpg$3");
    }
    var client_msg_id = Math.round(Math.random() * 15E5).toString(36);
    if (currentUser.isAnon()) {
      n_prefix = "<n" + this.session_.getSessionTsId() + "/>";
    }
    if (this.msManager_.getStyle("bold")) {
      message = "<b>" + message + "</b>";
    }
    if (this.msManager_.getStyle("italics")) {
      message = "<i>" + message + "</i>";
    }
    if (this.msManager_.getStyle("underline")) {
      message = "<u>" + message + "</u>";
    }
    var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
    var isAnon = currentUser.isAnon() || currentUser.isTemp();
    if (!isAnon) {
      var textColor = stylesOn ? this.msManager_.getStyle("textColor") : null;
      var fontFamily = stylesOn ? this.msManager_.getStyle("fontFamily") : null;
      var fontSize = stylesOn ? this.msManager_.getStyle("fontSize").toString() : null;
      var fTag = textColor || fontFamily && fontFamily !== "0" || fontSize && fontSize !== "11";
      if (fTag) {
        f_prefix = "<f x";
        if (fontSize && fontSize !== "11") {
          f_prefix += fontSize * 1 < 10 ? "0" + fontSize : fontSize;
        }
        if (textColor) {
          f_prefix += chatango.utils.color.compressHex(textColor);
        }
        f_prefix += '="';
        if (fontFamily && fontFamily !== "0") {
          f_prefix += fontFamily;
        }
        f_prefix += '">';
      }
      var nameColor = this.msManager_.getStyle("nameColor");
      if (nameColor) {
        n_prefix = "<n" + chatango.utils.color.compressHex(nameColor) + "/>";
      }
    }
    var msgString = n_prefix + f_prefix + message;
    var maxLength = this.groupInfo_.getMaxMsgLength();
    var msgLengthInBytes = chatango.utils.strings.lengthInUtf8Bytes(msgString, maxLength + 1);
    if (msgLengthInBytes >= maxLength) {
      var msgWarningType = "msglexceeded_default";
      if (maxLength != chatango.group.GroupInfo.DEFAULT_MAX_MSG_BYTES) {
        msgWarningType = "msglexceeded";
      }
      this.onGenericWarningEvent_(new chatango.networking.GroupConnectionEvent(msgWarningType, [msgWarningType, maxLength]));
      this.input_.restoreLastMessageText();
      return;
    }
    var current_sid = this.userManager_.currentUser.getSid();
    var mod_visibility = chatango.users.ModeratorManager.getInstance().getModVisibility();
    var mod_icon = chatango.users.ModeratorManager.getInstance().getModIcon(current_sid);
    var message_flags = this.input_.getChannelFlags();
    if (mod_visibility == chatango.group.moderation.Permissions.ModVisibilityOptions.SHOW_MOD_ICONS && mod_icon == 0) {
      message_flags |= chatango.messagedata.MessageData.MessageFlags.DEFAULT_ICON;
    } else {
      if (mod_visibility != chatango.group.moderation.Permissions.ModVisibilityOptions.HIDE_MOD_ICONS) {
        if (mod_icon == chatango.group.moderation.Permissions.Flags.STAFF_ICON_VISIBLE) {
          message_flags |= chatango.messagedata.MessageData.MessageFlags.SHOW_STAFF_ICON;
        } else {
          if (mod_icon == chatango.group.moderation.Permissions.Flags.MOD_ICON_VISIBLE) {
            message_flags |= chatango.messagedata.MessageData.MessageFlags.SHOW_MOD_ICON;
          }
        }
      }
    }
    data = ["bm", client_msg_id, message_flags, msgString].join(":");
    this.getConnection().send(data);
    var env = chatango.managers.Environment.getInstance();
    var bd = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
    var embedded = !(new RegExp("^https?://" + this.handle_ + "." + bd + "/$")).test(this.embedLoc_);
    if (embedded) {
      if (env.isDesktop()) {
        window["ga"]("send", "event", "Group", "Message", "Desktop embed");
      } else {
        if (env.isAndroid()) {
          window["ga"]("send", "event", "Group", "Message", "Android embed");
        } else {
          if (env.isIOS()) {
            window["ga"]("send", "event", "Group", "Message", "iOS embed");
          }
        }
      }
    } else {
      if (env.isAndroidApp()) {
        window["ga"]("send", "event", "Group", "Message", "Android app");
      } else {
        if (env.isAndroid()) {
          window["ga"]("send", "event", "Group", "Message", "Android fullsize");
        } else {
          if (env.isIOS()) {
            window["ga"]("send", "event", "Group", "Message", "iOS fullsize");
          } else {
            if (env.isDesktop()) {
              window["ga"]("send", "event", "Group", "Message", "Desktop fullsize");
            }
          }
        }
      }
    }
    if (canBeRateLimited) {
      this.startProgressBarIfNotRunning_();
    }
    this.pendingMessageEvent_ = null;
  } else {
    if (chatango.DEBUG) {
      this.logger.info("Not logged in - call input.blur");
    }
    this.input_.blur();
    this.pendingMessageEvent_ = e;
    this.showLoginDialog();
  }
};
chatango.group.Group.prototype.onClientAuthenticated_ = function(e) {
  this.footer_.initButton();
  this.chatRestrictions_ = new chatango.group.GroupChatRestrictions(this.getConnection());
  this.input_.setChatRestrictions(this.chatRestrictions_);
  this.footer_.setChatRestrictions(this.chatRestrictions_);
  this.footer_.setAnons(this.anonsAllowed_());
  this.announcements_ = new chatango.group.settings.AnnouncementsModel(this.getConnection(), this.handle_);
  this.rateLimitMessageHasBeenShown_ = false;
  this.hasSeenRateLimitMessage_ = goog.net.cookies.get(this.handle_, 0) > 0;
  this.handler.listen(this.chatRestrictions_, chatango.events.EventType.MUST_LOGIN, this.showLoginDialog, false);
  this.handler.listen(this.chatRestrictions_, chatango.events.EventType.CHANGE_LOGIN_DIALOG_SETTING, this.onChangeLoginSetting_, false);
  this.lastModStatus_ = chatango.users.ModeratorManager.getInstance().isCurrentUserAModerator();
  this.msManager_.setUser(this.userManager_.currentUser);
  this.lastStylesOn_ = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  this.scheduleDraw();
  if (typeof this.userManager_.currentUser !== "undefined") {
    goog.events.listenOnce(this.msManager_, chatango.managers.MessageStyleManager.EventType.USER_CHANGED, this.styleChanged_, false, this);
  }
  this.updateMessageCatcher_();
};
chatango.group.Group.prototype.onSetName_ = function(e) {
  this.showLoginDialog();
};
chatango.group.Group.prototype.onLogout_ = function(e) {
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    chatango.embed.AppComm.getInstance().alertLogoutRequest(this.onLogoutReply_, this);
  } else {
    this.onLogoutReply_(true);
  }
};
chatango.group.Group.prototype.onLogoutReply_ = function(logout) {
  if (!logout) {
    return;
  }
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    user.closeEditProfileDialog();
  }
  var username = user.getUid();
  this.handler.listenOnceWithScope(this.getConnection(), chatango.networking.GroupConnectionEvent.EventLookup["logoutok"], function(e) {
    if (chatango.managers.Environment.getInstance().isAndroidApp()) {
      chatango.embed.AppComm.getInstance().alertLogoutOk();
      return;
    }
    var anon_name = "anon" + chatango.users.User.getAnonNumber(this.session_.getSessionTsId(), this.session_.getSessionId());
    chatango.users.UserManager.getInstance().addCurrentUser(null, anon_name, chatango.users.User.UserType.ANON);
    var url = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/signout";
    var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
    var fd = new FormData;
    fd.append("noredirect", "true");
    xhr.setWithCredentials(true);
    xhr.send(url, "POST", fd);
    if (this.cm_.request) {
      var passwd = this.cm_.request.password_
    } else {
      var passwd = chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("pw"))
    }
    this.footer_.onAuthChange();
    this.closePopUps_();
    this.getConnection().startAnonTimeOutTimer();
    this.input_.update(username);
    this.output_.checkReplies();
    this.msManager_.setUser(chatango.users.UserManager.getInstance().currentUser);
    this.lastStylesOn_ = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
    if (this.lastModStatus_) {
      this.onCurrentUserModStatusChange(null);
      goog.events.listenOnce(this.getConnection(), [chatango.networking.GroupConnectionEvent.EventType.nomore, chatango.networking.GroupConnectionEvent.EventType.i], function(e) {
        this.cm_.setReloadPending(false);
      }, false, this);
    }
    this.updateMessageCatcher_();
    this.scheduleDraw();
    this.input_.drawStyleBar();
  });
  this.getConnection().send("blogout\r\n");
  goog.net.cookies.set("un", "", -31536E3, "/");
  goog.net.cookies.set("pw", "", -31536E3, "/");
  goog.net.cookies.set("sessionid", "", -31536E3, "/");
};
chatango.group.Group.prototype.onFooterOpenPM_ = function(e) {
  this.openPm(undefined, undefined, undefined, true);
};
chatango.group.Group.prototype.onLoadModuleEvent_ = function(e) {
  if (!goog.module.ModuleManager.getInstance().getModuleInfo("CommonUIModule").isLoaded()) {
    goog.module.ModuleManager.getInstance().execOnLoad("CommonUIModule", function() {
      this.onLoadModuleEvent_(e);
    }, this);
    return;
  }
  if (e.type === chatango.events.EventType.LOAD_SETTINGS_MODULE) {
    if (!this.settingsModule_) {
      goog.module.ModuleManager.getInstance().execOnLoad("SettingsModule", function() {
        var menuArr = this.footer_.getSettingsMenuInstallArray();
        this.getSettingsModule_().installMenu(menuArr[0], menuArr[1], menuArr[2]);
      }, this);
    } else {
      var menuArr = this.footer_.getSettingsMenuInstallArray();
      this.getSettingsModule_().installMenu(menuArr[0], menuArr[1], menuArr[2]);
    }
    this.input_.draw();
  } else {
    if (e.type === chatango.events.EventType.LOAD_MODERATION_MODULE) {
      if (!this.moderationModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("ModerationModule", function() {
          var menuArr = this.footer_.getModerationMenuInstallArray();
          this.getModerationModule_().installMenu(menuArr[0], menuArr[1], menuArr[2]);
        }, this);
      } else {
        var menuArr = this.footer_.getModerationMenuInstallArray();
        this.getModerationModule_().installMenu(menuArr[0], menuArr[1], menuArr[2]);
      }
    }
  }
};
chatango.group.Group.prototype.nUpdated_ = function(e) {
  if (this.lastFooterHeight_ != this.footer_.getElement().offsetHeight) {
    this.scheduleDraw();
  }
};
chatango.group.Group.prototype.anonsAllowed_ = function() {
  if (!(this.chatRestrictions_ && this.chatRestrictions_.getRestriction)) {
    return false;
  }
  return this.chatRestrictions_.getRestriction() != chatango.group.GroupChatRestrictions.RestrictionState.NOANON;
};
chatango.group.Group.prototype.closePopUps_ = function(e) {
  if (this.loginModule_) {
    this.getLoginModule_().closePopUps();
  }
  if (this.settingsModule_) {
    this.getSettingsModule_().closePopUps();
  }
  if (this.moderationModule_) {
    this.getModerationModule_().closePopUps();
  }
  if (this.rateRestrictionsModule_) {
    this.getRateRestrictionsModule_().closePopUps();
  }
  this.input_.closePopUps();
};
chatango.group.Group.prototype.showLoginDialog = function() {
  goog.module.ModuleManager.getInstance().execOnLoad("LoginModule", function() {
    this.input_.setEnabled(false);
    if (chatango.DEBUG) {
      this.logger.info("Login Module Loaded");
    }
    this.getLoginModule_().openLoginPopup(this.chatRestrictions_);
    this.input_.blur();
    this.handler.listen(this.getLoginModule_(), chatango.login.LoginResponseEvent.EventType.SUCCESS, this.onSuccessfulLogin_, false);
    this.handler.listenWithScope(this.getLoginModule_(), chatango.login.LoginRequestEvent.EventType.LOGIN_REQUEST, this.cm_.login, false, this.cm_);
    this.handler.listenWithScope(this.getLoginModule_(), chatango.login.SignupRequestEvent.EventType.SIGNUP_REQUEST, this.userManager_.signup, false, this.userManager_);
    this.handler.listenWithScope(this.getLoginModule_(), chatango.events.EventType.SET_NAME_CLOSED, function() {
      this.setEnabled(true);
    }, false, this.input_);
  }, this);
};
chatango.group.Group.prototype.showRateLimitDialog = function() {
  this.execOnLoad("RateRestrictionsModule", function() {
    this.rateLimitMessageHasBeenShown_ = true;
    if (chatango.DEBUG) {
      this.logger.info("RateRestrictionsModule Loaded");
    }
    var that = this;
    this.chatRestrictions_.getRateLimitSeconds(function(rateInSeconds, secondsLeft) {
      var shouldShow = !this.rateLimitMessageHasBeenShown_;
      that.getRateRestrictionsModule_().createProgressBar(that.input_, 0, false);
      that.getRateRestrictionsModule_().setProgressBarSeconds(rateInSeconds);
      if (that.hasSeenRateLimitMessage_) {
        that.getRateRestrictionsModule_().openRateLimitedDialog(secondsLeft, this.input_);
        that.getRateRestrictionsModule_().startProgressBarIfNotRunning(rateInSeconds - secondsLeft);
      } else {
        that.input_.setEnabled(false);
        var callback = function(shouldSendMessage) {
          that.input_.setEnabled(true);
          if (shouldSendMessage) {
            that.input_.clear();
            that.sendPendingMessageEventIfExists_();
          } else {
            that.input_.restoreLastMessageText();
          }
        };
        that.getRateRestrictionsModule_().openRateLimitedDialog(rateInSeconds, that.input_, true, callback);
        that.hasSeenRateLimitMessage_ = true;
        if (goog.net.cookies.isEnabled()) {
          goog.net.cookies.set(that.handle_, rateInSeconds, 31536E3, "/");
        }
      }
    }, true);
  });
};
chatango.group.Group.prototype.createProgressBarOrShow = function() {
  this.execOnLoad("RateRestrictionsModule", function() {
    var that = this;
    var hasProgressBar = this.getRateRestrictionsModule_().hasProgressBar();
    var isHidden = this.getRateRestrictionsModule_().isProgressBarHidden();
    if (!hasProgressBar || isHidden) {
      this.chatRestrictions_.getRateLimitSeconds(function(rateInSeconds, secondsLeft) {
        if (!hasProgressBar) {
          that.getRateRestrictionsModule_().createProgressBar(that.input_, 0);
        }
        that.getRateRestrictionsModule_().setProgressBarSeconds(rateInSeconds);
        that.getRateRestrictionsModule_().startProgressBarIfNotRunning(rateInSeconds - secondsLeft);
        that.draw();
      }, true);
    }
  });
};
chatango.group.Group.prototype.startProgressBarIfNotRunning_ = function() {
  this.execOnLoad("RateRestrictionsModule", function() {
    var that = this;
    if (!that.getRateRestrictionsModule_().isProgressBarRunning()) {
      this.chatRestrictions_.getRateLimitSeconds(function(rateInSeconds, secondsLeft) {
        that.getRateRestrictionsModule_().setProgressBarSeconds(rateInSeconds);
        that.getRateRestrictionsModule_().startProgressBarIfNotRunning(rateInSeconds - secondsLeft);
      }, true);
    } else {
      this.chatRestrictions_.getRateLimitSeconds(function(rateInSeconds) {
        that.getRateRestrictionsModule_().startProgressBarIfNotRunning(0);
      });
    }
  });
};
chatango.group.Group.prototype.sendPendingMessageEventIfExists_ = function() {
  if (this.pendingMessageEvent_) {
    this.onMessageInput_(this.pendingMessageEvent_);
  }
};
chatango.group.Group.prototype.onChangeLoginSetting_ = function(e) {
  this.footer_.setAnons(this.anonsAllowed_());
};
chatango.group.Group.prototype.onSuccessfulLogin_ = function() {
  this.input_.setEnabled(true);
  this.footer_.draw();
  this.footer_.onAuthChange();
  this.input_.closePopUps();
  this.input_.draw();
  var pm = chatango.managers.PremiumManager.getInstance();
  pm.updatePremium(this.userManager_.currentUser);
  goog.events.listenOnce(this.msManager_, chatango.managers.MessageStyleManager.EventType.USER_CHANGED, function(e) {
    var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
    var useBackground = stylesOn ? this.msManager_.getStyle("usebackground") : null;
    if (useBackground === null) {
      useBackground = 0;
    }
    if (useBackground !== this.lastUseBackground_) {
      this.getConnection().send("msgbg:" + useBackground);
    }
    this.lastUseBackground_ = useBackground;
    this.input_.update();
    this.input_.drawStyleBar();
    this.output_.checkReplies();
    if (this.lastModStatus_ != chatango.users.ModeratorManager.getInstance().isCurrentUserAModerator()) {
      this.onCurrentUserModStatusChange(null);
      goog.events.listenOnce(this.getConnection(), [chatango.networking.GroupConnectionEvent.EventType.nomore, chatango.networking.GroupConnectionEvent.EventType.i], function(e) {
        this.cm_.setReloadPending(false);
        this.sendPendingMessageEventIfExists_();
      }, false, this);
    } else {
      this.sendPendingMessageEventIfExists_();
    }
    this.updateMessageCatcher_();
    this.scheduleDraw();
  }, false, this);
  this.msManager_.setUser(this.userManager_.currentUser);
};
chatango.group.Group.prototype.updateMessageCatcher_ = function() {
  var currentUser = this.userManager_ ? this.userManager_.currentUser : null;
  if (currentUser && currentUser.isRegistered() && chatango.managers.Style.getInstance().pmAllowed() && !chatango.managers.Environment.getInstance().isAndroidApp()) {
    if (!this.messageCatcherModule_) {
      goog.module.ModuleManager.getInstance().execOnLoad("MessageCatcherModule", this.onMessageCatcherModLoaded, this);
    } else {
      this.onMessageCatcherModLoaded();
    }
  } else {
    if (this.messageCatcherModule_) {
      this.onMessageCatcherModLoaded();
    }
  }
};
chatango.group.Group.prototype.onMessageCatcherModLoaded = function() {
  var mcMod = this.getMessageCatcherModule_();
  var currentUser = this.userManager_.currentUser;
  if (currentUser && currentUser.isRegistered() && chatango.managers.Style.getInstance().pmAllowed()) {
    mcMod.connect(currentUser);
    this.handler.listen(mcMod, chatango.events.EventType.OPEN_PM_EVENT, this.onOpenPmReplyEvent_);
    this.footer_.setMessageCatcher(mcMod);
  } else {
    mcMod.disconnect();
    this.footer_.setMessageCatcher(null);
  }
};
chatango.group.Group.prototype.getLoginModule_ = function() {
  if (typeof this.loginModule_ === "undefined") {
    this.loginModule_ = new chatango.modules.LoginModule(this.session_);
  }
  return this.loginModule_;
};
chatango.group.Group.prototype.getSettingsModule_ = function() {
  if (typeof this.settingsModule_ === "undefined") {
    this.settingsModule_ = new chatango.modules.SettingsModule(this.getConnection(), this.groupInfo_, this.chatRestrictions_, this.managers_, this.announcements_);
    this.handler.listen(this.settingsModule_, chatango.events.EventType.LOGOUT, this.onLogout_);
    this.handler.listen(this.settingsModule_, chatango.events.EventType.EDIT_PROFILE, this.openEditProfile_);
    this.handler.listen(this.settingsModule_, chatango.events.MessageStyleEvent.EventType.CHANGED, this.styleChanged_);
  }
  return this.settingsModule_;
};
chatango.group.Group.prototype.getCollapsedModule_ = function() {
  if (typeof this.collapsedModule_ === "undefined") {
    var lastMessages = null;
    if (chatango.managers.Style.getInstance().tickerEnabled) {
      lastMessages = this.output_.getMessageQueue();
    }
    this.collapsedModule_ = new chatango.modules.CollapsedViewModule(this.getConnection(), this.groupInfo_, this.inited_, lastMessages);
  }
  return this.collapsedModule_;
};
chatango.group.Group.prototype.getMessageCatcherModule_ = function() {
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    return null;
  }
  if (typeof this.messageCatcherModule_ === "undefined") {
    this.messageCatcherModule_ = new chatango.modules.MessageCatcherModule;
  }
  return this.messageCatcherModule_;
};
chatango.group.Group.prototype.onCurrentUserModStatusChange = function(e) {
  this.scheduleDraw();
  if (this.moderationModule_) {
    this.getModerationModule_().closePopUps();
  }
  this.lastModStatus_ = chatango.users.ModeratorManager.getInstance().isCurrentUserAModerator();
  this.cm_.setReloadPending(true);
  this.getOutputWindow().removeAllMessages();
  this.getConnection().send("reload_init_batch");
  if (this.userCanBeRateLimited_()) {
  } else {
    this.execOnLoad("RateRestrictionsModule", function() {
      this.getRateRestrictionsModule_().stopAndHideProgressBar();
      this.getRateRestrictionsModule_().closePopUps();
    });
  }
};
chatango.group.Group.prototype.onFloodEvent_ = function(e) {
  switch(e.type) {
    case chatango.networking.GroupConnectionEvent.EventType.show_tb:
    ;
    case chatango.networking.GroupConnectionEvent.EventType.tb:
      this.input_.restoreLastMessageText();
  }
  this.floodWarning_ = e.data;
  this.execOnLoad("RateRestrictionsModule", function() {
    this.getRateRestrictionsModule_().openFloodWarningDialog(this.floodWarning_, this.input_);
  });
};
chatango.group.Group.prototype.onNlpEvent_ = function(e) {
  this.nlpWarning_ = e.data;
  this.execOnLoad("RateRestrictionsModule", function() {
    this.getRateRestrictionsModule_().openNlpWarningDialog(this.nlpWarning_, this.input_);
  });
};
chatango.group.Group.prototype.onGenericWarningEvent_ = function(e) {
  this.genericWarning_ = e.data;
  this.execOnLoad("RateRestrictionsModule", function() {
    this.getRateRestrictionsModule_().openGenericWarningDialog(this.genericWarning_, this.input_);
  });
};
chatango.group.Group.prototype.onOutputRequestedModMenu_ = function() {
  if (!this.moderationModule_) {
    goog.module.ModuleManager.getInstance().execOnLoad("ModerationModule", this.getModerationModule_, this);
  } else {
    this.output_.moderationModuleLoaded();
  }
};
chatango.group.Group.prototype.getModerationModule_ = function() {
  if (typeof this.moderationModule_ === "undefined") {
    this.moderationModule_ = new chatango.modules.ModerationModule(this.getConnection(), this.getOutputWindow());
    this.output_.moderationModuleLoaded();
  }
  return this.moderationModule_;
};
chatango.group.Group.prototype.getRateRestrictionsModule_ = function() {
  if (typeof this.rateRestrictionsModule_ === "undefined") {
    this.rateRestrictionsModule_ = new chatango.modules.RateRestrictionsModule;
    this.handler.listen(this.rateRestrictionsModule_, chatango.events.EventType.EDIT_EMAIL, this.openEditEmail_);
  }
  return this.rateRestrictionsModule_;
};
chatango.group.Group.prototype.getPmModule_ = function() {
  if (typeof this.pmModule_ === "undefined") {
    this.pmModule_ = new chatango.modules.PmModule;
  }
  return this.pmModule_;
};
chatango.group.Group.prototype.getVideoModule_ = function() {
  if (typeof this.videoModule_ === "undefined") {
    this.videoModule_ = new chatango.modules.VideoModule;
  }
  return this.videoModule_;
};
chatango.group.Group.prototype.execOnLoad = function(module, fn) {
  goog.module.ModuleManager.getInstance().execOnLoad(module, fn, this);
};
chatango.group.Group.prototype.isCollapsableView_ = function() {
  var collapsable = false;
  if (this.embedType_ == chatango.group.GroupEmbedTypes.TAB || this.embedType_ == chatango.group.GroupEmbedTypes.BUTTON || this.embedType_ == chatango.group.GroupEmbedTypes.BOX_FIXED) {
    collapsable = true;
  }
  return collapsable;
};
chatango.group.Group.prototype.onIosHeartBeat_ = function(e) {
  var now = (new Date).getTime();
  if (now - this.lastBeat_ > 3E3) {
    this.onPageShow();
  }
  this.lastBeat_ = now;
};
chatango.group.Group.prototype.openEditProfile_ = function(e) {
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    user.openEditProfileDialog();
  }
};
chatango.group.Group.prototype.openEditEmail_ = function(e) {
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    user.openEditEmailDialog();
  }
};
chatango.group.Group.prototype.userCanBeRateLimited_ = function() {
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    if (user.isOwner()) {
      return false;
    }
    if (user.isModerator() && chatango.users.ModeratorManager.getInstance().hasPermission(user.getSid(), chatango.group.moderation.Permissions.Flags.NO_SENDING_LIMITATIONS)) {
      return false;
    }
    return this.chatRestrictions_.isInRateLimitMode();
  }
  return false;
};
chatango.group.Group.prototype.onInputClicked_ = function(e) {
  var isMobile = chatango.managers.Environment.getInstance().isMobile();
  var isTablet = chatango.managers.Environment.getInstance().isTablet();
  if ((isMobile || isTablet) && chatango.managers.Style.getInstance().isFullSizeGroup()) {
    var that = this;
    setTimeout(function() {
      that.draw();
    }, 0);
    that.output_.setLockBottom(true);
  }
};
chatango.group.Group.prototype.onRateLimitedEvent_ = function(e) {
  var secondsLeft = +e.data[1];
  if (secondsLeft >= 0) {
    this.input_.restoreLastMessageText();
    this.execOnLoad("RateRestrictionsModule", function() {
      this.getRateRestrictionsModule_().updateProgressBar(secondsLeft);
      this.getRateRestrictionsModule_().openRateLimitedDialog(secondsLeft, this.input_);
    });
  }
};
chatango.group.Group.prototype.onRateLimitChange_ = function(e) {
  var rateInSeconds = +e.data[1];
  if (rateInSeconds > 0) {
    this.execOnLoad("RateRestrictionsModule", function() {
      this.getRateRestrictionsModule_().closeModeSwitchDialog();
      this.getRateRestrictionsModule_().setProgressBarSeconds(rateInSeconds);
      if (this.getRateRestrictionsModule_().isProgressBarRunning()) {
        var that = this;
        this.chatRestrictions_.getRateLimitSeconds(function(rateInSeconds, secondsLeft) {
          var offset = rateInSeconds - secondsLeft;
          that.getRateRestrictionsModule_().updateProgressBarIfRunning(rateInSeconds, offset);
          that.getRateRestrictionsModule_().updateRateLimitedDialog(secondsLeft);
        }, true);
      }
    });
    this.hasSeenRateLimitMessage_ = false;
  } else {
    this.execOnLoad("RateRestrictionsModule", function() {
      this.getRateRestrictionsModule_().stopAndHideProgressBar();
      var user = chatango.users.UserManager.getInstance().currentUser;
      if (!user || !user.isOwner()) {
        this.getRateRestrictionsModule_().closePopUps();
        this.getRateRestrictionsModule_().openModeSwitchDialog(this.input_);
      }
    });
  }
};
chatango.group.Group.prototype.onCommandLimited_ = function(e) {
  var command = e.data[2];
  if (command == "get_more") {
    this.output_.onGetMoreLimited(e.data[1], e.data[4]);
  }
};
chatango.group.Group.prototype.openProxyBannedDialog_ = function() {
  this.execOnLoad("WarningDialogModule", function() {
    chatango.modules.WarningDialogModule.getInstance().openWarningDialog("proxy_ban_title", "proxy_ban_desc", this.input_.getElement(), goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT, undefined, "ok");
  }, this);
};
chatango.group.Group.prototype.onProxyBanned_ = function(e) {
  var km = chatango.managers.Keyboard.getInstance();
  if (km.isRaised()) {
    this.input_.blur();
    goog.events.listenOnce(km, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED, this.openProxyBannedDialog_, false, this);
  } else {
    this.openProxyBannedDialog_();
  }
};
chatango.group.Group.prototype.onEmailVerificationRequired_ = function(e) {
  this.execOnLoad("RateRestrictionsModule", function() {
    if (chatango.DEBUG) {
      this.logger.info("RateRestrictionsModule Loaded");
    }
    this.getRateRestrictionsModule_().openEmailVerifRequiredDialog(this.input_, false);
    this.input_.restoreLastMessageText();
    this.input_.blur();
  });
};
chatango.group.Group.prototype.setAllowPm_ = function(opt_e) {
  goog.dom.classes.enable(this.stage_, "no-pm", !chatango.managers.Style.getInstance().pmAllowed());
  this.updateMessageCatcher_();
};
chatango.group.Group.prototype.onInputBlur_ = function(e) {
  var isMobile = chatango.managers.Environment.getInstance().isMobile();
  var isTablet = chatango.managers.Environment.getInstance().isTablet();
  if ((isMobile || isTablet) && chatango.managers.Style.getInstance().isFullSizeGroup()) {
    var that = this;
    setTimeout(function() {
      that.draw();
    }, 0);
  }
};
chatango.group.Group.prototype.onInputAutocomplete_ = function(e) {
  var tree = this.cm_.getSellerTree();
  var keys = goog.array.map(tree.getKeys(e.data), function(key) {
    return tree.get(key);
  }, this);
  this.input_.showAutocomplete(keys);
};
chatango.group.Group.prototype.styleChanged_ = function(e) {
  var user = this.userManager_.currentUser;
  var stylesOn = this.msManager_.getStyle(chatango.managers.MessageStyleManager.STYLES_ON);
  var useBackground = stylesOn && user ? this.msManager_.getStyle("usebackground") : null;
  if (useBackground === null) {
    useBackground = 0;
  }
  if (useBackground !== this.lastUseBackground_) {
    this.getConnection().send("msgbg:" + useBackground);
  }
  this.lastUseBackground_ = useBackground;
  this.input_.update();
  if (this.lastStylesOn_ !== stylesOn) {
    this.output_.updateStyles();
    this.lastStylesOn_ = stylesOn;
  }
};
chatango.group.Group.prototype.onLoadMoreMsgs_ = function(e) {
  this.getConnection().send("get_more:" + e.data.numMessages + ":" + e.data.requestId);
};
chatango.group.Group.prototype.onReplyToEvent_ = function(e) {
  this.input_.addAtReply(e);
};
chatango.group.Group.prototype.onOpenPmEvent_ = function(e) {
  this.openPm(e.getUid(), e.getUserType());
};
chatango.group.Group.prototype.onOpenPmReplyEvent_ = function(e) {
  this.openPm(e.getUid(), e.getUserType(), true);
};
chatango.group.Group.prototype.onParticipantsOpenPmEvent_ = function(e) {
  var isDesktop = chatango.managers.Environment.getInstance().isDesktop();
  if (isDesktop) {
    var url = "http://" + e.data + "." + g.g.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
    window.top.location.href = url;
  } else {
    this.openPm(e.data, "S");
  }
};
chatango.group.Group.prototype.onYoutubeClick_ = function(e) {
  if (!this.videoModule_) {
    this.youtubeVideo = e.target.videoId();
    this.startTime = e.target.startTime();
    goog.module.ModuleManager.getInstance().execOnLoad("VideoModule", function() {
      this.getVideoModule_().openVideoPopup(this.youtubeVideo, this.startTime);
      this.youtubeVideo = null;
      this.startTime = null;
    }, this);
  } else {
    this.getVideoModule_().openVideoPopup(e.target.videoId(), e.target.startTime());
  }
};
chatango.group.Group.prototype.openChatsTo_ = [];
chatango.group.Group.prototype.openPm = function(opt_userId, opt_userType, opt_Reply, opt_toList) {
  var isDesktop = chatango.managers.Environment.getInstance().isDesktop();
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  if (!currentUser || currentUser.getType() == chatango.users.User.UserType.ANON) {
    return;
  }
  if (isDesktop) {
    currentUser.openProfilePage();
  } else {
    if (opt_userId) {
      var openChatObj = {"uid":opt_userId, "userType":opt_userType};
      if (opt_Reply) {
        openChatObj["reply"] = true;
      }
      this.openChatsTo_.push(openChatObj);
    }
    goog.module.ModuleManager.getInstance().execOnLoad("PmModule", function() {
      this.pmModuleLoaded_(opt_toList);
    }, this);
  }
};
chatango.group.Group.prototype.openPmChat = function(sid) {
  if (this.pmMode_ && this.pm_) {
    this.pm_.openPmChat(sid);
  } else {
    this.openPm(sid, chatango.users.User.UserType.SELLER);
  }
};
chatango.group.Group.prototype.pmModuleLoaded_ = function(toList) {
  var pmModule = this.getPmModule_();
  goog.events.listenOnce(pmModule, chatango.events.EventType.PM_OPENED, this.onPmOpened_, false, this);
  pmModule.openPm(this.openChatsTo_, toList, this.getMessageCatcherModule_());
  this.openChatsTo_ = [];
};
chatango.group.Group.prototype.onPmOpened_ = function(e) {
  this.pm_ = this.getPmModule_().getPm();
  this.pm_.setGroupHandle(this.handle_);
  goog.events.listen(this.pm_, chatango.events.EventType.CLOSE, this.onPmClose_, false, this);
  this.pm_.render(this.stage_);
  this.pmMode_ = true;
  chatango.audio.AudioController.getInstance().setPmMode(true);
  this.scheduleDraw();
};
chatango.group.Group.prototype.onPmClose_ = function(e) {
  var mcMod = this.getMessageCatcherModule_();
  var currentUser = this.userManager_.currentUser;
  goog.events.unlisten(this.pm_, chatango.events.EventType.CLOSE, this.onPmClose_, false, this);
  if (mcMod) {
    goog.events.listenOnce(mcMod, chatango.networking.ConnectionStatusEvent.EventType.CONNECTED, this.removePm_, false, this);
    mcMod.connect(currentUser);
  } else {
    this.removePm_();
  }
};
chatango.group.Group.prototype.removePm_ = function() {
  this.getPmModule_().destroyPm();
  this.pmMode_ = false;
  chatango.audio.AudioController.getInstance().setPmMode(false);
  if (this.pm_) {
    this.pm_.dispose();
  }
  this.pm_ = null;
  this.scheduleDraw();
};
if (goog.module.ModuleManager.getInstance().getModuleInfo("GroupModule")) {
  goog.module.ModuleManager.getInstance().setLoaded("Group");
}
;
