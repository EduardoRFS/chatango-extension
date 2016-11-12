goog.provide("chatango.pm.PmHeader");
goog.require("chatango.ui.buttons.CloseButton");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.PmHeader = function() {
  goog.base(this);
  this.handler = new goog.events.EventHandler(this);
  this.previousType_ = chatango.pm.PmHeader.PreviousType.URL;
  this.previousAction_ = null;
  this.closeBtn_ = new chatango.ui.buttons.CloseButton("#FFFFFF");
  goog.events.listen(this.closeBtn_, goog.ui.Component.EventType.ACTION, this.onCloseBtnClicked, true, this);
};
goog.inherits(chatango.pm.PmHeader, goog.ui.Component);
chatango.pm.PmHeader.PreviousType = {FUNCTION:"prev_func", URL:"prev_url"};
chatango.pm.PmHeader.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"id":"HEADER"});
  this.buttonWrapEl_ = goog.dom.createDom("div", {"id":"header-btn-wrap"});
  this.backArrow_ = new chatango.ui.icons.SvgBackArrowIcon;
  this.backArrow_.render(this.buttonWrapEl_);
  this.backArrow_.setColor("#FFFFFF");
  this.backArrow_.setIsChunky(true);
  this.backButtonEl_ = goog.dom.createDom("div", {"id":"header-button"});
  this.handler.listen(this.buttonWrapEl_, goog.events.EventType.CLICK, this.onClick_, false, this);
  goog.dom.appendChild(this.buttonWrapEl_, this.backButtonEl_);
  goog.dom.appendChild(this.element_, this.buttonWrapEl_);
  this.contentEl_ = goog.dom.createDom("div", {"id":"header-content"});
  goog.dom.appendChild(this.element_, this.contentEl_);
  this.closeBtn_.render(this.element_);
};
chatango.pm.PmHeader.prototype.getHeight = function() {
  return this.element_ ? this.element_.offsetHeight : 0;
};
chatango.pm.PmHeader.prototype.setContent = function(content) {
  this.contentEl_.innerHTML = "<span>" + content + "</span>";
};
chatango.pm.PmHeader.prototype.setPreviousPage = function(content, url) {
  this.previousType_ = chatango.pm.PmHeader.PreviousType.URL;
  this.backButtonEl_.innerHTML = "<span>" + content + "</span>";
  this.previousAction_ = url;
};
chatango.pm.PmHeader.prototype.setPreviousCallback = function(content, fn) {
  this.previousType_ = chatango.pm.PmHeader.PreviousType.FUNCTION;
  this.backButtonEl_.innerHTML = "<span>" + content + "</span>";
  this.previousAction_ = fn;
};
chatango.pm.PmHeader.prototype.onClick_ = function(e) {
  if (this.previousType_ === chatango.pm.PmHeader.PreviousType.URL) {
    window.top.location.href = this.previousAction_;
  } else {
    this.previousAction_();
  }
};
chatango.pm.PmHeader.prototype.onCloseBtnClicked = function() {
  this.dispatchEvent(chatango.events.EventType.CLOSE);
};
chatango.pm.PmHeader.prototype.disposeInternal = function() {
  if (this.closeBtn_) {
    goog.events.unlisten(this.closeBtn_, goog.ui.Component.EventType.ACTION, this.onCloseBtnClicked, false, this);
    this.closeBtn_.dispose();
    this.closeBtn_ = null;
  }
  if (this.backArrow_) {
    this.backArrow_.dispose();
    this.backArrow_ = null;
  }
  this.handler.unlisten(this.buttonWrapEl_, goog.events.EventType.CLICK, this.onClick_, false, this);
};
goog.provide("chatango.networking.PmConnectionEvent");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
chatango.networking.PmConnectionEvent = function(type, data) {
  goog.base(this, type);
  this.type = type;
  this.data = data;
};
goog.inherits(chatango.networking.PmConnectionEvent, goog.events.Event);
chatango.networking.PmConnectionEvent.EventType = {};
chatango.networking.PmConnectionEvent.EventLookup = {};
chatango.networking.PmConnectionEvent.EventLookup["OK"] = chatango.networking.PmConnectionEvent.EventType.OK = goog.events.getUniqueId("pmOK");
chatango.networking.PmConnectionEvent.EventLookup["seller_name"] = chatango.networking.PmConnectionEvent.EventType.seller_name = goog.events.getUniqueId("seller_name");
chatango.networking.PmConnectionEvent.EventLookup["kickingoff"] = chatango.networking.PmConnectionEvent.EventType.kickingoff = goog.events.getUniqueId("kickingoff");
chatango.networking.PmConnectionEvent.EventLookup["msg"] = chatango.networking.PmConnectionEvent.EventType.msg = goog.events.getUniqueId("msg");
chatango.networking.PmConnectionEvent.EventLookup["msgoff"] = chatango.networking.PmConnectionEvent.EventType.msgoff = goog.events.getUniqueId("msgoff");
chatango.networking.PmConnectionEvent.EventLookup["connect"] = chatango.networking.PmConnectionEvent.EventType.connect = goog.events.getUniqueId("connect");
chatango.networking.PmConnectionEvent.EventLookup["track"] = chatango.networking.PmConnectionEvent.EventType.track = goog.events.getUniqueId("track");
chatango.networking.PmConnectionEvent.EventLookup["time"] = chatango.networking.PmConnectionEvent.EventType.time = goog.events.getUniqueId("time");
chatango.networking.PmConnectionEvent.EventLookup["status"] = chatango.networking.PmConnectionEvent.EventType.status = goog.events.getUniqueId("status");
chatango.networking.PmConnectionEvent.EventLookup["reload_profile"] = chatango.networking.PmConnectionEvent.EventType.reload_profile = goog.events.getUniqueId("reload_profile");
chatango.networking.PmConnectionEvent.EventLookup["wl"] = chatango.networking.PmConnectionEvent.EventType.wl = goog.events.getUniqueId("wl");
chatango.networking.PmConnectionEvent.EventLookup["wlonline"] = chatango.networking.PmConnectionEvent.EventType.wlonline = goog.events.getUniqueId("wlonline");
chatango.networking.PmConnectionEvent.EventLookup["wloffline"] = chatango.networking.PmConnectionEvent.EventType.wloffline = goog.events.getUniqueId("wloffline");
chatango.networking.PmConnectionEvent.EventLookup["wlapp"] = chatango.networking.PmConnectionEvent.EventType.wlapp = goog.events.getUniqueId("wlapp");
chatango.networking.PmConnectionEvent.EventLookup["wladd"] = chatango.networking.PmConnectionEvent.EventType.wladd = goog.events.getUniqueId("wladd");
chatango.networking.PmConnectionEvent.EventLookup["wldelete"] = chatango.networking.PmConnectionEvent.EventType.wldelete = goog.events.getUniqueId("wldelete");
chatango.networking.PmConnectionEvent.EventLookup["idleupdate"] = chatango.networking.PmConnectionEvent.EventType.idleupdate = goog.events.getUniqueId("idleupdate");
chatango.networking.PmConnectionEvent.EventLookup["presence"] = chatango.networking.PmConnectionEvent.EventType.presence = goog.events.getUniqueId("presence");
chatango.networking.PmConnectionEvent.EventLookup["block_list"] = chatango.networking.PmConnectionEvent.EventType.block_list = goog.events.getUniqueId("block_list");
chatango.networking.PmConnectionEvent.EventLookup["unblocked"] = chatango.networking.PmConnectionEvent.EventType.unblocked = goog.events.getUniqueId("unblocked");
chatango.networking.PmConnectionEvent.EventLookup["settings"] = chatango.networking.PmConnectionEvent.EventType.settings = goog.events.getUniqueId("settings");
chatango.networking.PmConnectionEvent.EventLookup["show_fw"] = chatango.networking.PmConnectionEvent.EventType.show_fw = goog.events.getUniqueId("show_fw");
chatango.networking.PmConnectionEvent.EventLookup["show_offline_limit"] = chatango.networking.PmConnectionEvent.EventType.show_offline_limit = goog.events.getUniqueId("show_offline_limit");
chatango.networking.PmConnectionEvent.EventLookup["toofast"] = chatango.networking.PmConnectionEvent.EventType.toofast = goog.events.getUniqueId("toofast");
chatango.networking.PmConnectionEvent.EventLookup["firstlogin"] = chatango.networking.PmConnectionEvent.EventType.firstlogin = goog.events.getUniqueId("firstlogin");
chatango.networking.PmConnectionEvent.EventLookup["lowversion"] = chatango.networking.PmConnectionEvent.EventType.lowversion = goog.events.getUniqueId("lowversion");
goog.provide("chatango.pm.lists.UserList");
goog.require("chatango.events.Event");
goog.require("chatango.events.EventType");
goog.require("chatango.users.UserManager");
goog.require("goog.array");
goog.require("goog.events.EventTarget");
chatango.pm.lists.UserList = function(pmChatManager) {
  goog.base(this);
  this.pmChatManager_ = pmChatManager;
  this.referrerPrefix_ = "user_list";
  this.pmConnection_ = this.pmChatManager_.getConnection();
  this.lastUpdateTime_ = 0;
  this.minUpdateInterval_ = 200;
  this.list_ = {};
  this.length_ = 0;
  this.statuses_ = {};
  this.historyManager_ = new chatango.pm.PmHistoryManager;
  this.sort_ = chatango.pm.lists.UserList.sortModes.NAME;
  this.cSid_ = chatango.users.UserManager.getInstance().currentUser.getSid();
  goog.events.listen(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.idleupdate, this.onIdleUpdate_, false, this);
};
goog.inherits(chatango.pm.lists.UserList, goog.events.EventTarget);
chatango.pm.lists.UserList.sortModes = {NAME:"name", ACTIVITY:"last_active"};
chatango.pm.lists.UserList.prototype.setSort = function(sortMode) {
  this.sort_ = sortMode;
};
chatango.pm.lists.UserList.prototype.getNumUnreadPmMessages = function() {
  var result = 0;
  for (var userID in this.list_) {
    if (this.list_.hasOwnProperty(userID) && userID.charAt(0) != "*") {
      result += this.list_[userID].getNumUnreadPmMessages();
    }
  }
  return result;
};
chatango.pm.lists.UserList.prototype.unreadSort_ = function(uid1, uid2) {
  var u1 = this.list_[uid1];
  var u2 = this.list_[uid2];
  var ur1 = u1.getNumUnreadPmMessages();
  var ur2 = u2.getNumUnreadPmMessages();
  if (ur1 > 0 && ur2 == 0) {
    return-1;
  }
  if (ur2 > 0 && ur1 == 0) {
    return 1;
  }
  return 0;
};
chatango.pm.lists.UserList.prototype.activitySortInternal_ = function(u1, u2) {
  var activeDifference = u1.getLastActive() - u2.getLastActive();
  var u1OnlineNotIdle = u1.isOnline() && !u1.isIdle();
  var u2OnlineNotIdle = u2.isOnline() && !u2.isIdle();
  if (u1OnlineNotIdle && u2OnlineNotIdle) {
    return-activeDifference;
  } else {
    if (u1OnlineNotIdle) {
      return-1;
    } else {
      if (u2OnlineNotIdle) {
        return 1;
      }
    }
  }
  var u1App = u1.isAppOnline();
  var u2App = u2.isAppOnline();
  if (u1App && u2App) {
    return-activeDifference;
  } else {
    if (u1App) {
      return-1;
    } else {
      if (u2App) {
        return 1;
      }
    }
  }
  var u1Idle = u1.isOnline() && u1.isIdle();
  var u2Idle = u2.isOnline() && u2.isIdle();
  if (u1Idle && u2Idle) {
    return-activeDifference;
  } else {
    if (u1Idle) {
      return-1;
    } else {
      if (u2Idle) {
        return 1;
      }
    }
  }
  return-activeDifference;
};
chatango.pm.lists.UserList.prototype.activitySort_ = function(uid1, uid2) {
  var u1 = this.list_[uid1];
  var u2 = this.list_[uid2];
  return this.activitySortInternal_(u1, u2);
};
chatango.pm.lists.UserList.prototype.getList = function(opt_sortMode) {
  var list = [];
  for (var userID in this.list_) {
    if (this.list_.hasOwnProperty(userID)) {
      list.push(userID);
    }
  }
  if (opt_sortMode) {
    switch(opt_sortMode) {
      case chatango.pm.lists.UserList.sortModes.NAME:
        list.sort();
        break;
      case chatango.pm.lists.UserList.sortModes.ACTIVITY:
        goog.array.stableSort(list, this.activitySort_.bind(this));
        break;
      default:
        break;
    }
  }
  goog.array.stableSort(list, this.unreadSort_.bind(this));
  return list;
};
chatango.pm.lists.UserList.prototype.length = function() {
  return this.length_;
};
chatango.pm.lists.UserList.prototype.getUser = function(userID) {
  return this.list_[userID];
};
chatango.pm.lists.UserList.prototype.isUserOnline = function(userID) {
  return this.list_[userID].isOnline() || false;
};
chatango.pm.lists.UserList.prototype.isUserAppOnline = function(userID) {
  return this.list_[userID].isAppOnline() || false;
};
chatango.pm.lists.UserList.prototype.setUserStatus = function(userID, isOnline, isAppOnline, lastActive, force) {
  if (this.list_[userID] && (this.list_[userID].isOnline() !== isOnline || this.list_[userID].isAppOnline() !== isAppOnline || force)) {
    this.list_[userID].setOnline(isOnline);
    this.list_[userID].setAppOnline(isAppOnline);
    if (lastActive) {
      this.list_[userID].setLastActive(lastActive);
    }
    this.dispatchUpdateEvent();
    return true;
  }
  return false;
};
chatango.pm.lists.UserList.prototype.removeUser = function(userID) {
  delete this.list_[userID];
  this.length_--;
  this.dispatchUpdateEvent();
};
chatango.pm.lists.UserList.prototype.onIdleUpdate_ = function(e) {
  var uid = e.data[1], status = e.data[2];
  if (this.list_.hasOwnProperty(uid)) {
    var s = status === "0";
    this.list_[uid].setIdle(s);
    this.list_[uid].setLastActive((new Date).getTime());
    this.dispatchUpdateEvent();
  }
};
chatango.pm.lists.UserList.prototype.addUser_ = function(userID, opt_noUpdate) {
  var userType = userID.charAt(0) == "*" ? chatango.users.User.UserType.ANON : chatango.users.User.UserType.SELLER;
  var user = chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + userID, userID, userType);
  user.setNumUnreadPmMessages(this.historyManager_.getUnread([this.cSid_, userID]));
  this.list_[userID] = user;
  this.length_++;
  if (!opt_noUpdate) {
    this.dispatchUpdateEvent();
  }
};
chatango.pm.lists.UserList.prototype.addUser = function(userID) {
  this.addUser_(userID);
};
chatango.pm.lists.UserList.prototype.containsUser = function(userID) {
  return!!this.list_[userID];
};
chatango.pm.lists.UserList.prototype.resetUnread = function(userID) {
  if (this.list_.hasOwnProperty(userID)) {
    this.list_[userID].setNumUnreadPmMessages(0);
  }
  this.historyManager_.readAll([this.cSid_, userID]);
  this.dispatchUpdateEvent();
};
chatango.pm.lists.UserList.prototype.dispatchUpdateEvent = function() {
  var now = (new Date).getTime();
  if (now - this.lastUpdateTime_ > this.minUpdateInterval_) {
    this.dispatchUpdateEvent_();
  } else {
    if (!this.dispatchUpdatePending_) {
      this.dispatchUpdatePending_ = true;
      var that = this;
      setTimeout(function() {
        that.dispatchUpdateEvent_();
      }, this.minUpdateInterval_);
    }
  }
};
chatango.pm.lists.UserList.prototype.dispatchUpdateEvent_ = function() {
  this.lastUpdateTime_ = (new Date).getTime();
  this.dispatchUpdatePending_ = false;
  this.dispatchEvent(chatango.events.EventType.UPDATE);
};
chatango.pm.lists.UserList.prototype.disposeInternal = function() {
  this.pmChatManager_.dispose();
  this.pmChatManager_ = null;
  this.pmConnection_.dispose();
  this.pmConnection_ = null;
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.lists.FriendsList");
goog.require("chatango.networking.PmConnectionEvent");
goog.require("chatango.pm.lists.UserList");
goog.require("chatango.users.UserManager");
chatango.pm.lists.FriendsList = function(pmChatManager) {
  goog.base(this, pmChatManager);
  goog.events.listenOnce(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.OK, this.onEvent_, false, this);
  this.referrerPrefix_ = "friends_list";
  this.leftoverData_ = [];
  this.events_ = [chatango.networking.PmConnectionEvent.EventType.wl, chatango.networking.PmConnectionEvent.EventType.wladd, chatango.networking.PmConnectionEvent.EventType.wldelete];
  goog.events.listen(this.pmConnection_, this.events_, this.onEvent_, false, this);
  this.list_ = [];
  this.visibleFriends_ = 0;
  this.indApp_ = 0;
  this.indIdle_ = 0;
  this.indOff_ = 0;
};
goog.inherits(chatango.pm.lists.FriendsList, chatango.pm.lists.UserList);
chatango.pm.lists.FriendsList.INITIAL_FRIENDS = 32;
chatango.pm.lists.FriendsList.MORE_FRIENDS = 20;
chatango.pm.lists.FriendsList.prototype.onEvent_ = function(e) {
  switch(e.type) {
    case chatango.networking.PmConnectionEvent.EventType.OK:
      this.pmConnection_.send("wl");
      break;
    case chatango.networking.PmConnectionEvent.EventType.wl:
      this.loadUsers_(e.data);
      break;
    case chatango.networking.PmConnectionEvent.EventType.wladd:
      var isOnline = e.data[2] === "on";
      var isAppOnline = e.data[2] === "app";
      var lastActive = isOnline ? ((new Date).getTime() - e.data[3] * 60 * 1E3) / 1E3 : e.data[3];
      var isIdle = isOnline ? parseInt(e.data[3], 10) > 0 : false;
      this.addUser_(e.data[1], isOnline, isAppOnline, lastActive, isIdle, false, true);
      break;
    case chatango.networking.PmConnectionEvent.EventType.wldelete:
      this.removeUser(e.data[1]);
      break;
    default:
      if (chatango.DEBUG) {
        console.log("FriendsList event not handled: " + e.type);
      }
      break;
  }
  this.dispatchUpdateEvent();
};
chatango.pm.lists.FriendsList.prototype.sortList_ = function() {
  if (this.sort_ === chatango.pm.lists.UserList.sortModes.NAME) {
    goog.array.sort(this.list_, this.nameSort_.bind(this));
  } else {
    goog.array.sort(this.list_, this.activitySort_.bind(this));
    var user;
    this.indApp_ = 0;
    this.indIdle_ = 0;
    this.indOff_ = 0;
    for (var i = 0;i < this.length_;i++) {
      user = this.list_[i];
      if (user.isOnline()) {
        if (!user.isIdle()) {
          this.indApp_ += 1;
          this.indIdle_ += 1;
        }
        this.indOff_ += 1;
      } else {
        if (user.isAppOnline()) {
          this.indIdle_ += 1;
          this.indOff_ += 1;
        } else {
          break;
        }
      }
    }
  }
};
chatango.pm.lists.FriendsList.prototype.correctBoundaries_ = function() {
  this.indApp_ = Math.max(Math.min(this.indApp_, this.length_), 0);
  this.indIdle_ = Math.max(Math.min(this.indIdle_, this.length_), 0);
  this.indOff_ = Math.max(Math.min(this.indOff_, this.length_), 0);
};
chatango.pm.lists.FriendsList.prototype.setSort = function(sortMode) {
  chatango.pm.lists.FriendsList.superClass_.setSort.call(this, sortMode);
  if (this.length_ === 0) {
    return;
  }
  this.sortList_();
};
chatango.pm.lists.FriendsList.prototype.nameSort_ = function(u1, u2) {
  return goog.array.defaultCompare(u1.getUid(), u2.getUid());
};
chatango.pm.lists.FriendsList.prototype.activitySort_ = function(u1, u2) {
  return this.activitySortInternal_(u1, u2);
};
chatango.pm.lists.FriendsList.prototype.loadUsers_ = function(data) {
  var totalLoaded = 0;
  if (data[0] == "wl") {
    data.splice(0, 1);
  }
  if (data.length === 0 || data[0] === "") {
    return false;
  }
  var chunk, uid, lastLogout, idleTime, lastActive, status, idleMinutes;
  while (data.length > 0) {
    var chunk = data.splice(0, 4);
    var uid = chunk[0];
    var lastLogout = parseInt(chunk[1], 10);
    var status = chunk[2];
    var isOnline = status === "on";
    var isAppOnline = status === "app";
    idleMinutes = parseInt(chunk[3], 10);
    idleTime = ((new Date).getTime() - idleMinutes * 60 * 1E3) / 1E3;
    lastActive = status === "on" ? idleTime : lastLogout;
    this.addUser_(uid, isOnline, isAppOnline, lastActive, idleMinutes > 0, true);
  }
  this.sortList_();
  this.visibleFriends_ = Math.min(chatango.pm.lists.FriendsList.INITIAL_FRIENDS, this.length_);
  this.pmChatManager_.dispatchEvent(chatango.networking.PmConnectionEvent.EventType.wl);
  this.dispatchUpdateEvent();
  return true;
};
chatango.pm.lists.FriendsList.prototype.getList = function() {
  var list = [];
  for (var i = 0;i < this.visibleFriends_;i++) {
    list.push(this.list_[i].getUid());
  }
  return list;
};
chatango.pm.lists.FriendsList.prototype.fetchUser_ = function(userID) {
  var userType = userID.charAt(0) == "*" ? chatango.users.User.UserType.ANON : chatango.users.User.UserType.SELLER;
  return chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + userID, userID, userType);
};
chatango.pm.lists.FriendsList.prototype.loadMoreUsers = function() {
  if (this.visibleFriends_ >= this.length_) {
    return;
  }
  this.visibleFriends_ += chatango.pm.lists.FriendsList.MORE_FRIENDS;
  this.visibleFriends_ = Math.min(this.length_, this.visibleFriends_);
  this.dispatchUpdateEvent();
};
chatango.pm.lists.FriendsList.prototype.addUser_ = function(userID, online, appOnline, lastActive, isIdle, opt_noUpdate, opt_addVisible) {
  var user = this.fetchUser_(userID);
  user.setNumUnreadPmMessages(this.historyManager_.getUnread([this.cSid_, userID]));
  this.pmChatManager_.addFriend(userID);
  user.setOnline(online);
  user.setAppOnline(appOnline);
  user.setLastActive(lastActive * 1E3);
  user.setIdle(isIdle);
  if (!this.containsUser(userID)) {
    this.list_.push(user);
    this.length_++;
    if (opt_addVisible) {
      this.visibleFriends_++;
    }
  }
  if (!opt_noUpdate) {
    this.sortList_();
    this.dispatchUpdateEvent();
  }
};
chatango.pm.lists.FriendsList.prototype.removeUser = function(userID) {
  var user = this.fetchUser_(userID);
  if (user.isOnline()) {
    if (!user.isIdle()) {
      this.indApp_--;
      this.indIdle_--;
    }
    this.indOff_--;
  } else {
    if (user.isAppOnline()) {
      this.indIdle_--;
      this.indOff--;
    }
  }
  this.correctBoundaries_();
  if (this.getList().indexOf(userID) > -1) {
    this.visibleFriends_--;
  }
  goog.array.remove(this.list_, user);
  this.length_--;
  this.dispatchUpdateEvent();
  this.pmChatManager_.removeFriend(userID);
};
chatango.pm.lists.FriendsList.prototype.addUser = function(userID) {
  this.pmConnection_.send("wladd:" + userID);
};
chatango.pm.lists.FriendsList.prototype.getUser = function(userID) {
  return this.fetchUser_(userID);
};
chatango.pm.lists.FriendsList.prototype.isUserOnline = function(userID) {
  return this.fetchUser_(userID).isOnline() || false;
};
chatango.pm.lists.FriendsList.prototype.isUserAppOnline = function(userID) {
  return this.fetchUser_(userID).isAppOnline() || false;
};
chatango.pm.lists.FriendsList.prototype.shiftUser_ = function(user) {
  if (this.sort_ !== chatango.pm.lists.UserList.sortModes.ACTIVITY) {
    return;
  }
  var isOnline = user.isOnline(), notIdle = !user.isIdle(), isAppOnline = user.isAppOnline(), index = this.list_.indexOf(user), u = goog.array.splice(this.list_, index, 1)[0];
  if (isOnline) {
    if (notIdle) {
      if (index >= this.indApp_) {
        this.indApp_++;
        if (index >= this.indIdle_) {
          this.indIdle_++;
          if (index >= this.indOff_) {
            this.indOff_++;
          }
        }
      }
      goog.array.insertAt(this.list_, u, 0);
    } else {
      this.indApp_--;
      this.indIdle_--;
      this.correctBoundaries_();
      goog.array.insertAt(this.list_, u, this.indIdle_);
    }
  } else {
    if (isAppOnline) {
      if (index < this.indApp_) {
        this.indApp_--;
      }
      if (index >= this.indIdle_) {
        this.indIdle_++;
        if (index >= this.indOff_) {
          this.indOff_++;
        }
      }
      this.correctBoundaries_();
      goog.array.insertAt(this.list_, u, this.indApp_);
    } else {
      if (index < this.indOff_) {
        this.indOff_--;
        if (index < this.indIdle_) {
          this.indIdle_--;
          if (index < this.indApp_) {
            this.indApp_--;
          }
        }
      }
      this.correctBoundaries_();
      goog.array.insertAt(this.list_, u, this.indOff_);
    }
  }
};
chatango.pm.lists.FriendsList.prototype.onIdleUpdate_ = function(e) {
  var uid = e.data[1], status = e.data[2];
  if (this.containsUser(uid)) {
    var s = status === "0";
    var user = this.fetchUser_(uid);
    user.setIdle(s);
    user.setLastActive((new Date).getTime());
    this.shiftUser_(user);
    this.dispatchUpdateEvent();
  }
};
chatango.pm.lists.FriendsList.prototype.setUserStatus = function(userID, isOnline, isAppOnline, lastActive, force) {
  var user = this.fetchUser_(userID);
  if (user && (user.isOnline() !== isOnline || user.isAppOnline() !== isAppOnline || force)) {
    user.setOnline(isOnline);
    user.setAppOnline(isAppOnline);
    if (lastActive) {
      user.setLastActive(lastActive);
    }
    this.shiftUser_(user);
    this.dispatchUpdateEvent();
    return true;
  }
  return false;
};
chatango.pm.lists.FriendsList.prototype.resetUnread = function(userID) {
  if (this.containsUser(userID)) {
    this.fetchUser_(userID).setNumUnreadPmMessages(0);
  }
  this.historyManager_.readAll([this.cSid_, userID]);
  this.dispatchUpdateEvent();
};
chatango.pm.lists.FriendsList.prototype.containsUser = function(userID) {
  var user = this.fetchUser_(userID);
  return this.list_.indexOf(user) > -1;
};
chatango.pm.lists.FriendsList.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.ui.icons.SvgStatusIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgStatusIcon = function(opt_appOnline, opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.percent_ = 100;
  this.border_ = 6;
  this.useIdle_ = !opt_appOnline;
};
goog.inherits(chatango.ui.icons.SvgStatusIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgStatusIcon.prototype.getIdlePath_ = function(border, radius, width, height) {
  var angle = this.percent_ / 100 * (2 * Math.PI);
  var start = ["M", width / 2, border];
  var arc = [];
  var x = width / 2 + radius * Math.sin(angle);
  var y = height / 2 - radius * Math.cos(angle);
  if (this.percent_ < 50) {
    arc = ["A", radius, radius, 0, 0, 1, x, y];
  } else {
    if (this.percent_ < 100) {
      arc = ["A", radius, radius, 0, 0, 1, width / 2, height - border, "A", radius, radius, 0, 0, 1, x, y];
    } else {
      arc = ["A", radius, radius, 0, 0, 1, width / 2, height - border, "A", radius, radius, 0, 0, 1, width / 2, border];
    }
  }
  var goBack = ["L", width / 2, height / 2];
  path = start;
  path.push.apply(path, arc);
  path.push.apply(path, goBack);
  return path.join(" ");
};
chatango.ui.icons.SvgStatusIcon.prototype.draw = function() {
  if (this.useIdle_) {
    var radius = (100 - 2 * this.border_) / 2, width = 100, height = 100;
    this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<g style="display: block;">' + '<circle fill="#6F0" stroke="#AAA" stroke-width="' + this.border_ + '" stroke-location="outside" cx="50" cy="50" r="' + radius + '" />' + '<path fill="#AAA" d="' + this.getIdlePath_(this.border_, radius, width, height) + '" />' + "</g>" + "</svg>";
  } else {
    this.element_.innerHTML = '<svg width="100%" height="100%" viewBox="0 0 15 15">' + '<path fill="#55ADF4" d="M 4 0 C 3.5 0 3 0.5 3 1 L 3 14 C 3 14.5 3.5 15 4 15 L 11 15 C 11.5 15 12 14.5 12 14 L 12 1 C 12 0.5 11.5 0 11 0 L 4 0 z M 4 2 L 11 2 L 11 12 L 4 12 L 4 2 z M 6 13 L 9 13 L 9 14 L 6 14 L 6 13 z " />' + "</svg>";
  }
};
chatango.ui.icons.SvgStatusIcon.prototype.setIdlePercentage = function(percent) {
  this.useIdle_ = true;
  this.percent_ = percent;
  this.draw();
};
chatango.ui.icons.SvgStatusIcon.prototype.setOnline = function() {
  this.setIdlePercentage(0);
};
chatango.ui.icons.SvgStatusIcon.prototype.setOffline = function() {
  this.setIdlePercentage(100);
};
chatango.ui.icons.SvgStatusIcon.prototype.setAppOnline = function() {
  this.useIdle_ = false;
  this.draw();
};
goog.provide("chatango.users.BaseProfile");
goog.require("chatango.utils.sanitize");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.users.BaseProfile = function(user) {
  goog.ui.Component.call(this);
  this.handler = new goog.events.EventHandler(this);
  this.user_ = user;
  this.handler.listen(this.user_, chatango.users.User.EventType.BASIC_PROFILE_LOADED, this.onProfileLoaded_);
  this.handler.listen(this.user_, chatango.users.User.EventType.PROFILE_CSS_LOADED, this.onProfileCssLoaded_);
};
goog.inherits(chatango.users.BaseProfile, goog.ui.Component);
chatango.users.BaseProfile.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"user-profile"});
  this.contentWrapperEl_ = goog.dom.createDom("div", {"class":"bp-cwrap"});
  goog.dom.append(this.element_, this.contentWrapperEl_);
  var infoWrap = goog.dom.createDom("div", {"class":"user-wrap"});
  goog.dom.append(this.contentWrapperEl_, infoWrap);
  this.thumbEl_ = goog.dom.createDom("div", {"class":"user-thumb"});
  goog.dom.append(infoWrap, this.thumbEl_);
  this.infoEl_ = goog.dom.createDom("div", {"class":"user-info"});
  goog.dom.append(infoWrap, this.infoEl_);
  this.aboutEl_ = goog.dom.createDom("div", {"class":"user-about"});
  goog.dom.append(infoWrap, this.aboutEl_);
  this.activityEl_ = goog.dom.createDom("div", {"class":"user-activity"});
  goog.dom.append(this.contentWrapperEl_, this.activityEl_);
  this.aslEl_ = goog.dom.createDom("div", {"class":"user-asl"});
  goog.dom.append(this.infoEl_, this.aslEl_);
  this.statusEl_ = goog.dom.createDom("div", {"class":"user-status"});
  goog.dom.append(this.infoEl_, this.statusEl_);
  this.user_.drawThumb(this.thumbEl_);
  if (this.user_.getType() == chatango.users.User.UserType.SELLER) {
    this.user_.loadProfile();
  } else {
    this.onProfileLoaded_(null);
  }
};
chatango.users.BaseProfile.prototype.getUser = function() {
  return this.user_;
};
chatango.users.BaseProfile.prototype.onProfileLoaded_ = function(e) {
};
chatango.users.BaseProfile.prototype.onProfileCssLoaded_ = function(e) {
};
chatango.users.BaseProfile.prototype.disposeInternal = function() {
  chatango.users.BaseProfile.superClass_.disposeInternal.call(this);
  this.handler.dispose();
};
goog.provide("chatango.pm.lists.ListProfile");
goog.require("chatango.ui.Swipe");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.ui.icons.SvgStatusIcon");
goog.require("chatango.users.BaseProfile");
goog.require("chatango.users.User");
goog.require("goog.dom");
goog.require("goog.dom.classes");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.lists.ListProfile = function(user) {
  goog.base(this, user);
  this.numUnreadMessages_ = user.getNumUnreadPmMessages();
  this.displayStyle_ = chatango.pm.lists.ListProfile.displayStyle.MINIMAL;
  this.statusIcon_ = new chatango.ui.icons.SvgStatusIcon(this.user_.isAppOnline());
  this.isDesktop_ = chatango.managers.Environment.getInstance().isDesktop();
  this.buttonsEnabled_ = true;
  this.thirdButton_ = false;
  this.lastUserProfileHtml_ = null;
  var closeBtnSize = 15;
  var closeBtnColor = "#000";
  this.closeBtn_ = new chatango.ui.buttons.CloseButton(closeBtnColor, closeBtnSize);
  goog.events.listen(this.closeBtn_, goog.ui.Component.EventType.ACTION, this.onCloseBtnClicked, true, this);
  this.touchCancelBtn_ = new chatango.ui.buttons.Button("Cancel");
  this.touchCancelBtn_.setImportant(true);
  this.touchDeleteBtn_ = new chatango.ui.buttons.Button("");
  this.touchDeleteBtn_.setImportant(true);
  this.touchDeleteAllBtn_ = new chatango.ui.buttons.Button("");
  this.touchDeleteAllBtn_.setImportant(true);
  goog.events.listen(this.user_, chatango.users.User.EventType.NUM_UNREAD_PM_MSGS_CHANGED, this.updateUnreadMessagesStrip_, false, this);
  goog.events.listen(this.user_, chatango.users.User.EventType.ONLINE_STATUS_CHANGED, this.updateActivity, false, this);
};
goog.inherits(chatango.pm.lists.ListProfile, chatango.users.BaseProfile);
chatango.pm.lists.ListProfile.displayStyle = {FULL:2, PLAIN:1, MINIMAL:0};
chatango.pm.lists.ListProfile.prototype.setDisplayStyle = function(style) {
  if (style !== this.displayStyle_) {
    this.displayStyle_ = style;
    this.updateCopy();
  }
};
chatango.pm.lists.ListProfile.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"user-profile"});
  this.contentWrapperEl_ = goog.dom.createDom("div", {"class":"bp-cwrap"});
  this.thumbEl_ = goog.dom.createDom("div", {"class":"user-thumb"});
  goog.dom.append(this.contentWrapperEl_, this.thumbEl_);
  var statusWrap = goog.dom.createDom("div", {"class":"user-status-wrap"});
  this.statusEl_ = goog.dom.createDom("div", {"class":"user-status"});
  this.activityEl_ = goog.dom.createDom("span", {"class":"user-activity"});
  goog.dom.append(statusWrap, this.statusEl_);
  goog.dom.append(statusWrap, this.activityEl_);
  goog.dom.append(this.contentWrapperEl_, statusWrap);
  this.infoEl_ = goog.dom.createDom("div", {"class":"user-info"});
  var usernameEl = goog.dom.createDom("span", {"class":"user-name"}, this.user_.getName());
  this.aslEl_ = goog.dom.createDom("span", {"class":"user-asl"});
  goog.dom.append(this.infoEl_, usernameEl);
  goog.dom.append(this.infoEl_, this.aslEl_);
  goog.dom.append(this.contentWrapperEl_, this.infoEl_);
  this.aboutEl_ = goog.dom.createDom("div", {"class":"user-about"});
  goog.dom.append(this.contentWrapperEl_, this.aboutEl_);
  goog.dom.append(this.element_, this.contentWrapperEl_);
  this.user_.drawThumb(this.thumbEl_, true);
  if (this.user_.getType() == chatango.users.User.UserType.SELLER) {
    this.user_.loadProfile(undefined, true);
  } else {
    this.onProfileLoaded_(null);
  }
  this.statusIcon_.render(this.statusEl_);
  this.updateCopy();
  this.updateUnreadMessagesStrip_();
  this.actionEvents_ = chatango.managers.Environment.getInstance().isDesktop() ? [goog.events.EventType.CLICK] : [goog.events.EventType.TOUCHSTART, goog.events.EventType.TOUCHEND];
  goog.events.listen(this.contentWrapperEl_, this.actionEvents_, this.onProfileClicked_, true, this);
  if (this.buttonsEnabled_) {
    if (this.isDesktop_) {
      goog.dom.classes.add(this.element_, "desktop");
    } else {
      this.swipeDiv_ = goog.dom.createDom("div", {"class":"list-del"});
      this.swipeDivBg_ = goog.dom.createDom("div", {"class":"swipe-bg"});
      goog.dom.append(this.swipeDiv_, this.swipeDivBg_);
      goog.dom.append(this.element_, this.swipeDiv_);
      this.swipe_ = new chatango.ui.Swipe(this.contentWrapperEl_, this.swipeDiv_);
      goog.events.listen(this.swipe_, chatango.ui.Swipe.EventType.SHOW_SWIPE_EL, this.onShowSwipeEl_, false, this);
    }
  }
};
chatango.pm.lists.ListProfile.prototype.onShowSwipeEl_ = function(e) {
  if (this.thirdButton_ && !this.touchDeleteAllBtn_.getElement()) {
    this.touchDeleteAllBtn_.render(this.swipeDiv_);
    goog.events.listen(this.touchDeleteAllBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onDeleteAllBtnClicked, true, this);
  }
  if (!this.touchDeleteBtn_.getElement()) {
    this.touchDeleteBtn_.render(this.swipeDiv_);
    goog.events.listen(this.touchDeleteBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onCloseBtnClicked, true, this);
  }
  if (!this.touchCancelBtn_.getElement()) {
    this.touchCancelBtn_.render(this.swipeDiv_);
    goog.events.listen(this.touchCancelBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onCancel_, true, this);
  }
  var btnHeight = this.touchDeleteBtn_.getElement().offsetHeight;
  var swipeBgHeight = this.swipeDiv_.offsetHeight;
  var topMar = Math.round((swipeBgHeight - btnHeight) / 2);
  this.touchDeleteBtn_.getElement().style.marginTop = topMar + "px";
  this.touchCancelBtn_.getElement().style.marginTop = topMar + "px";
  if (this.thirdButton_) {
    this.touchDeleteAllBtn_.getElement().style.marginTop = topMar + "px";
  }
};
chatango.pm.lists.ListProfile.prototype.onProfileLoaded_ = function(e) {
  goog.base(this, "onProfileLoaded_");
  this.updateCopy();
  if (this.user_.getType() == chatango.users.User.UserType.SELLER && this.user_.premiumExpiration_) {
    this.user_.loadProfileCss();
  } else {
    this.onProfileCssLoaded_(null);
  }
};
chatango.pm.lists.ListProfile.prototype.onProfileCssLoaded_ = function(e) {
  chatango.pm.lists.ListProfile.superClass_.onProfileCssLoaded_.call(this);
  this.updateCopy();
};
chatango.pm.lists.ListProfile.prototype.onProfileClicked_ = function(e) {
  if (e.type == goog.events.EventType.TOUCHSTART) {
    this.lastTouchX_ = e.clientX;
    this.lastTouchY_ = e.clientY;
    return;
  } else {
    if (e.type == goog.events.EventType.TOUCHEND) {
      var diffX = Math.abs(e.clientX - this.lastTouchX_);
      var diffY = Math.abs(e.clientY - this.lastTouchY_);
      var swipeThreshold = 15;
      var scrollThreshold = 10;
      if (diffX > swipeThreshold || diffY > scrollThreshold) {
        return;
      }
    }
  }
  if (e.target.offsetParent !== this.statusEl_) {
    if (chatango.managers.Environment.getInstance().isAndroidApp() && e.target.parentNode === this.thumbEl_) {
      if (!this.user_.openAppProfile()) {
        this.dispatchAction_();
      }
    } else {
      this.dispatchAction_();
    }
  }
};
chatango.pm.lists.ListProfile.prototype.dispatchAction_ = function() {
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};
chatango.pm.lists.ListProfile.prototype.updateUnreadMessagesStrip_ = function() {
  this.numUnreadMessages_ = this.user_.getNumUnreadPmMessages();
  goog.dom.classes.enable(this.getElement(), "unread", this.numUnreadMessages_ > 0);
};
chatango.pm.lists.ListProfile.prototype.getActivityDiff = function() {
  return this.user_.getLastActive() > 0 ? ((new Date).getTime() - this.user_.getLastActive()) / 1E3 : 0;
};
chatango.pm.lists.ListProfile.prototype.updateActivity = function() {
  var lastActive = this.user_.getLastActive();
  if (this.statusEl_ && this.statusIcon_.getElement()) {
    if (this.user_.isOnline()) {
      if (!this.user_.isIdle()) {
        this.statusIcon_.setOnline();
      } else {
        var ms = (new Date).getTime() - lastActive;
        var percent = ms < 1 * 60 * 1E3 ? 0 : Math.min(Math.max(.08, ms / (2 * 60 * 60 * 1E3)), .92);
        this.statusIcon_.setIdlePercentage(percent * 100);
      }
    } else {
      if (this.user_.isAppOnline()) {
        this.statusIcon_.setAppOnline();
      } else {
        this.statusIcon_.setOffline();
      }
    }
  }
};
chatango.pm.lists.ListProfile.prototype.updateCopy = function() {
  if (!this.element_) {
    return;
  }
  var aslStr = "";
  if (this.user_.isBasicProfileLoaded()) {
    var aslString = this.user_.getAslString();
    if (aslString != "") {
      aslStr += ", " + aslString;
    }
    this.updateActivity();
    if (this.displayStyle_ > chatango.pm.lists.ListProfile.displayStyle.MINIMAL) {
      var userProfileHtml = this.user_.getProfileHtml();
      if (userProfileHtml !== this.lastUserProfileHtml_) {
        this.aboutEl_.innerHTML = chatango.utils.sanitize.sanitize(userProfileHtml);
        this.lastUserProfileHtml_ = userProfileHtml;
      }
      goog.dom.classes.remove(this.element_, "minimal");
      if (this.displayStyle_ > chatango.pm.lists.ListProfile.displayStyle.PLAIN && this.user_.premiumExpiration_) {
        this.user_.drawProfileBg(this.element_);
      } else {
        this.user_.removeProfileBg(this.element_);
      }
      this.touchDeleteBtn_.setIsMinimalHeight(false);
      this.touchDeleteAllBtn_.setIsMinimalHeight(false);
      this.touchCancelBtn_.setIsMinimalHeight(false);
    } else {
      this.aboutEl_.innerHTML = "";
      this.lastUserProfileHtml_ = "";
      this.user_.removeProfileBg(this.element_);
      goog.dom.classes.add(this.element_, "minimal");
      this.touchDeleteBtn_.setIsMinimalHeight(true);
      this.touchDeleteAllBtn_.setIsMinimalHeight(false);
      this.touchCancelBtn_.setIsMinimalHeight(true);
    }
    if (this.isDesktop_ && this.infoEl_ && this.buttonsEnabled_ && !this.closeBtn_.getElement()) {
      this.closeBtn_.render(this.statusEl_);
    }
  }
  this.aslEl_.innerHTML = aslStr;
};
chatango.pm.lists.ListProfile.prototype.onCloseBtnClicked = function(e) {
  if (this.swipe_) {
    this.swipe_.close();
  }
  e.preventDefault();
  e.stopPropagation();
};
chatango.pm.lists.ListProfile.prototype.onDeleteAllBtnClicked = function(e) {
  if (this.swipe_) {
    this.swipe_.close();
  }
  e.preventDefault();
  e.stopPropagation();
};
chatango.pm.lists.ListProfile.prototype.onCancel_ = function(e) {
  this.swipe_.close();
};
chatango.pm.lists.ListProfile.prototype.disposeInternal = function() {
  if (this.swipe_) {
    this.swipe_.dispose();
    this.swipe_ = null;
  }
  if (this.closeBtn_) {
    goog.events.unlisten(this.closeBtn_, goog.ui.Component.EventType.ACTION, this.onCloseBtnClicked, false, this);
    this.closeBtn_.dispose();
    this.closeBtn_ = null;
  }
  if (this.touchDeleteBtn_) {
    if (this.touchDeleteBtn_.getElement()) {
      goog.events.unlisten(this.touchDeleteBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onCloseBtnClicked, true, this);
    }
    this.touchDeleteBtn_.dispose();
    this.touchDeleteBtn_ = null;
  }
  if (this.touchDeleteAllBtn_) {
    if (this.touchDeleteAllBtn_.getElement()) {
      goog.events.unlisten(this.touchDeleteAllBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onDeleteAllBtnClicked, true, this);
    }
    this.touchDeleteAllBtn_.dispose();
    this.touchDeleteAllBtn_ = null;
  }
  if (this.touchCancelBtn_) {
    if (this.touchCancelBtn_.getElement()) {
      goog.events.unlisten(this.touchCancelBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onCancel_, true, this);
    }
    this.touchCancelBtn_.dispose();
    this.touchCancelBtn_ = null;
  }
  goog.events.unlisten(this.contentWrapperEl_, goog.events.EventType.CLICK, this.onProfileClicked_, false, this);
  goog.events.unlisten(this.user_, chatango.users.User.EventType.NUM_UNREAD_PM_MSGS_CHANGED, this.updateUnreadMessagesStrip_, false, this);
  goog.events.unlisten(this.user_, chatango.users.User.EventType.ONLINE_STATUS_CHANGED, this.updateActivity, false, this);
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.strings.PmStrings");
chatango.strings.PmStrings = {"recent":"Recent", "friends":"Friends", "strangers":"Members", "chat_with":"Chat with:", "add_friend":"Add a friend:", "chat_with_placeholder":"Chatango name or email", "not_exist":"*name* does not exist or is a group", "no_user":"There is no Chatango account with the email *email*", "add_self":"You cannot chat with yourself or add yourself as a friend", "no_spaces":"The Chatango user name or email can not contain spaces", "all_convs":"All conversations", "new":"new", 
"type_below":"Type below to start a chat with *name**idle*.", "idle":"(idle\u00a0for\u00a0*time*)", "is_offline":"*name* is offline. You can send an offline message below.", "is_online":"*name* is online.", "is_idle":"*name* has been idle for *time*", "is_app_online":"*name* is on mobile.", "type_here_long":"Type a private message to *user*", "type_here_short":"PM to *user*", "block_user":"Block *user*", "unblock_user":"Unblock *user*", "msg_date_format_long":"m/d/yy g:i:s A", "msg_date_format_short":"g:i:s A", 
"idle_time_format":"g:i", "display_full":"Full", "display_plain":"Plain", "display_minimal":"Minimal", "sort_name":"Name", "recent_sort_activity":"Last Msg", "friends_sort_activity":"Last On", "recent_empty_list":"You have no recent conversations.", "friends_empty_list":"You have no friends here yet. Add a friend below.", "strangers_empty_list":"", "del_friend":"Delete", "del_conv":"Delete", "del_stranger":"Ban", "del_stranger_ip":"Ban IP", "unban_stranger":"Unban", "hide_stranger_confirmed":"Confirm ban", 
"click_to_connect":"Click to connect", "connection_lost":"Connection has been lost", "reconnect":"Reconnect", "cant_connect":"Unable to connect, please try again in a few minutes.", "cant_connect2":"Unable to connect. Please reload the page.", "header_home_link":"Home", "add":"Add", "empty_block_list":"Your block list is empty.", "block_list_use_desktop":"You can manage the blocklist in the desktop view.", "strangers_search_title":"Search", "strangers_search_placeholder":"Search Chatango", "strangers_search_gender":"Gender", 
"strangers_search_male_caption":"M", "strangers_search_female_caption":"F", "strangers_search_age":"Age", "strangers_search_distance":"Distance", "strangers_search_units":"mi", "strangers_search_country_prefix":"In ", "strangers_search_add_loc":"Add your location for geographic search", "strangers_search_online":"Online", "strangers_search_banned":"Banned", "strangers_search_save":"Search", "filter_default":"Search", "filter_male":"M", "filter_female":"F", "filter_both":"M/F", "filter_neither":"None", 
"filter_missing_country":"Country", "filter_online":"Online", "filter_banned":"Ban", "strangers_list_overload":"Chatango is currently overloaded. Meet people is only available to premium members at this time.", "strangers_list_no_results":"No online members were found matching your search", "strangers_list_no_more":"No more results", "strangers_list_nsfw":"Chatango mobile app does not allow searching for NSFW content."};
goog.provide("chatango.pm.lists.UserListView");
goog.require("chatango.events.Event");
goog.require("chatango.events.EventType");
goog.require("chatango.events.OpenPmEvent");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.pm.lists.ListProfile");
goog.require("chatango.pm.lists.UserList");
goog.require("chatango.strings.PmStrings");
goog.require("chatango.ui.ScrollPane");
goog.require("chatango.ui.Select");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.ui.Component.EventType");
chatango.pm.lists.UserListView = function(userList) {
  goog.base(this, null, true);
  this.currentUser_ = chatango.users.UserManager.getInstance().currentUser;
  this.userList_ = userList;
  this.renderedProfiles_ = {};
  this.referrerPrefix_ = "user_list_view";
  this.displayStyle_ = chatango.pm.lists.ListProfile.displayStyle.FULL;
  this.displaySelect_ = null;
  this.sortingSelect_ = null;
  this.selectedSort_ = chatango.pm.lists.UserList.sortModes.ACTIVITY;
  this.sortingEnabled_ = true;
  this.viewModes_ = null;
  this.emptyList_ = null;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  chatango.managers.LanguageManager.getInstance().getStringPack("pm", chatango.strings.PmStrings, function() {
  }, this);
  goog.events.listen(this.userList_, chatango.events.EventType.UPDATE, this.updateList, false, this);
};
goog.inherits(chatango.pm.lists.UserListView, chatango.ui.ScrollPane);
goog.ui.MenuButton.prototype.handleMouseDown = function(e) {
  goog.ui.MenuButton.superClass_.handleMouseDown.call(this, e);
  if (this.isActive()) {
    this.setOpen(!this.isOpen(), e);
    if (this.menu_) {
      this.menu_.setMouseButtonPressed(this.isOpen());
    }
  }
};
goog.ui.MenuItem.prototype.handleMouseDown = function(e) {
  goog.base(this, "handleMouseDown", e);
};
chatango.pm.lists.UserListView.prototype.setDisplayStyle = function(style) {
  this.displayStyle_ = style;
  localStorage.setItem(this.currentUser_.getSid() + "_view_" + this.referrerPrefix_.split("_")[0], this.displayStyle_);
};
chatango.pm.lists.UserListView.prototype.setSortMethod = function(mode) {
  this.selectedSort_ = mode;
  this.userList_.setSort(mode);
  localStorage.setItem(this.currentUser_.getSid() + "_sort_" + this.referrerPrefix_.split("_")[0], this.selectedSort_);
};
chatango.pm.lists.UserListView.prototype.getDefaults_ = function() {
  var view = localStorage.getItem(this.currentUser_.getSid() + "_view_" + this.referrerPrefix_.split("_")[0]);
  var sort = localStorage.getItem(this.currentUser_.getSid() + "_sort_" + this.referrerPrefix_.split("_")[0]);
  if (view !== null) {
    this.displayStyle_ = view;
  }
  if (sort !== null) {
    this.selectedSort_ = sort;
  }
  this.userList_.setSort(this.selectedSort_);
};
chatango.pm.lists.UserListView.prototype.updateTopMargin = function(parentElement) {
  if (!this.viewModes_.parentElement) {
    goog.dom.appendChild(parentElement, this.viewModes_);
  }
  var viewHeight = 1 * goog.dom.classes.has(this.viewModes_, "slidOut") * this.viewModes_.offsetHeight;
  this.outer_.style.marginTop = viewHeight + "px";
  return viewHeight;
};
chatango.pm.lists.UserListView.prototype.createDom = function() {
  goog.base(this, "createDom");
  this.getDefaults_();
  goog.dom.classes.add(this.getContentElement(), "pm-user-list");
  var dom = this.getDomHelper();
  this.emptyList_ = dom.createDom("div", {"class":"empty-list"});
  this.emptyList_.innerHTML = this.lm_.getString("pm", this.referrerPrefix_.split("_")[0] + "_empty_list");
  goog.style.showElement(this.emptyList_, true);
  dom.append(this.getContentElement(), this.emptyList_);
  this.viewModes_ = dom.createDom("div", {"class":"view-modes"});
  dom.insertSiblingBefore(this.viewModes_, this.outer_);
  var viewTable = dom.createDom("table");
  var headerRow = dom.createDom("tr");
  if (this.sortingEnabled_) {
    dom.append(headerRow, dom.createDom("th", {}, ["View"]));
    dom.append(headerRow, dom.createDom("th", {}, ["Sort by"]));
  } else {
    dom.append(headerRow, dom.createDom("th", {"style":"width:100%;"}, ["View"]));
  }
  var closeCell = dom.createDom("th", {"class":"view-close", "rowspan":"2"});
  this.viewCloseBtn_ = new chatango.ui.buttons.CloseButton;
  this.viewCloseBtn_.render(closeCell);
  dom.append(headerRow, closeCell);
  dom.append(viewTable, headerRow);
  var selectRow = dom.createDom("tr");
  var displayCell = dom.createDom("td");
  this.displaySelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
  this.displaySelect_.addItem(new goog.ui.MenuItem(this.lm_.getString("pm", "display_full"), chatango.pm.lists.ListProfile.displayStyle.FULL));
  this.displaySelect_.addItem(new goog.ui.MenuItem(this.lm_.getString("pm", "display_plain"), chatango.pm.lists.ListProfile.displayStyle.PLAIN));
  this.displaySelect_.addItem(new goog.ui.MenuItem(this.lm_.getString("pm", "display_minimal"), chatango.pm.lists.ListProfile.displayStyle.MINIMAL));
  this.displaySelect_.setValue(this.displayStyle_);
  this.displaySelect_.render(displayCell);
  dom.append(selectRow, displayCell);
  goog.events.listen(this.displaySelect_, goog.ui.Component.EventType.ACTION, this.processDisplayChange_, false, this);
  if (this.sortingEnabled_) {
    var sortingCell = dom.createDom("td");
    this.sortingSelect_ = new chatango.ui.Select(null, new goog.ui.Menu(null, goog.ui.MenuRenderer.getInstance()), goog.ui.FlatMenuButtonRenderer.getInstance());
    this.sortingSelect_.addItem(new goog.ui.MenuItem(this.lm_.getString("pm", "sort_name"), chatango.pm.lists.UserList.sortModes.NAME));
    var activityName = this.lm_.getString("pm", this.referrerPrefix_.split("_")[0] + "_sort_activity");
    this.sortingSelect_.addItem(new goog.ui.MenuItem(activityName, chatango.pm.lists.UserList.sortModes.ACTIVITY));
    this.sortingSelect_.setValue(this.selectedSort_);
    this.sortingSelect_.render(sortingCell);
    dom.append(selectRow, sortingCell);
    goog.events.listen(this.sortingSelect_, goog.ui.Component.EventType.ACTION, this.processSortChange_, false, this);
  }
  dom.append(viewTable, selectRow);
  dom.append(this.viewModes_, viewTable);
  goog.events.listen(this.viewCloseBtn_, goog.ui.Component.EventType.ACTION, this.closeViewModes_, false, this);
  this.updateList();
};
chatango.pm.lists.UserListView.prototype.closeViewModes_ = function(e) {
  goog.dom.classes.remove(this.viewModes_, "slidOut");
  this.dispatchEvent(chatango.events.EventType.CHANGE_DISPLAY);
};
chatango.pm.lists.UserListView.prototype.updateList = function(opt_e) {
  var list = this.userList_.getList(this.selectedSort_);
  var i = 0;
  var len = list.length;
  var user, userID;
  var userType;
  var profile;
  goog.style.showElement(this.emptyList_, len === 0);
  for (i = 0;i < len;i++) {
    userID = list[i];
    user = this.userList_.getUser(userID);
    if (!this.renderedProfiles_[userID]) {
      profile = this.makeProfile_(user);
      profile.setDisplayStyle(this.displayStyle_);
      goog.events.listen(profile, goog.ui.Component.EventType.ACTION, this.onProfileAction, false, this);
      goog.events.listen(profile, chatango.events.EventType.REMOVE_PROFILE, this.onRemoveProfile, false, this);
      this.renderedProfiles_[userID] = profile;
      this.addChildAt(profile, i, true);
    } else {
      profile = this.renderedProfiles_[userID];
      profile.setDisplayStyle(this.displayStyle_);
      if (this.userList_.isUserOnline(userID) !== profile.getUser().isOnline()) {
        profile.getUser().setOnline(this.userList_.isUserOnline(userID));
        profile.updateCopy();
      }
      if (this.userList_.isUserAppOnline(userID) !== profile.getUser().isAppOnline()) {
        profile.getUser().setAppOnline(this.userList_.isUserAppOnline(userID));
        profile.updateCopy();
      }
      if (this.getChildAt(i) != profile) {
        this.removeChild(profile, true);
        this.addChildAt(profile, i, true);
      }
    }
  }
  if (this.children_) {
    while (this.children_.length > i) {
      profile = this.getChildAt(i);
      if (!profile.user_) {
        break;
      }
      this.removeProfile(profile);
    }
  }
  this.draw();
};
chatango.pm.lists.UserListView.prototype.onRemoveProfile = function(e) {
};
chatango.pm.lists.UserListView.prototype.removeProfile = function(profile) {
  var uid = profile.getUser().getUid();
  this.renderedProfiles_[uid] = null;
  delete this.renderedProfiles_[uid];
  this.removeChildAt(this.children_.indexOf(profile), true);
  goog.events.unlisten(profile, goog.ui.Component.EventType.ACTION, this.onProfileAction, false, this);
  profile.dispose();
  profile = null;
};
chatango.pm.lists.UserListView.prototype.makeProfile_ = function(user) {
  return new chatango.pm.lists.ListProfile(user);
};
chatango.pm.lists.UserListView.prototype.onProfileAction = function(e) {
  var user = e.target.getUser();
  this.dispatchEvent(new chatango.events.OpenPmEvent(user.getUid(), user.getType()));
};
chatango.pm.lists.UserListView.prototype.processDisplayChange_ = function(e) {
  var select = e.target;
  this.setDisplayStyle(select.getValue());
  this.updateList();
  this.dispatchEvent(chatango.events.EventType.CHANGE_DISPLAY);
};
chatango.pm.lists.UserListView.prototype.processSortChange_ = function(e) {
  var select = e.target;
  this.setSortMethod(select.getValue());
  this.updateList();
  this.dispatchEvent(chatango.events.EventType.CHANGE_DISPLAY);
};
chatango.pm.lists.UserListView.prototype.smallestTimeChunk_ = function(diff) {
  var arr = [~~(diff / 60 / 60 / 24 / 365)], i = 0, n = 0;
  arr.push(~~(diff / 60 / 60 / 24 - 365 * arr[0]));
  arr.push(~~(diff / 60 / 60 - 24 * (arr[1] + 365 * arr[0])));
  arr.push(~~(diff / 60 - 60 * (arr[2] + 24 * (arr[1] + 365 * arr[0]))));
  arr.push(~~(diff - 60 * (arr[3] + 60 * (arr[2] + 24 * (arr[1] + 365 * arr[0])))));
  while (i < arr.length && n < 2) {
    if (arr[i] > 0) {
      n++;
    }
    i++;
  }
  switch(i) {
    case 5:
      return 1;
    case 4:
      return 60;
    case 3:
      return 60 * 60;
    case 2:
      return 60 * 60 * 24;
    case 1:
      return 60 * 60 * 24 * 365;
    default:
      return 1;
  }
};
chatango.pm.lists.UserListView.prototype.isVisible_ = function(profile) {
  var thisTop = profile.getElement().offsetTop, scrollTop = this.getScrollTop(), offset = this.outer_.offsetHeight;
  if (thisTop === 0 && scrollTop === 0 && offset === 0) {
    return false;
  }
  return scrollTop <= thisTop && thisTop <= scrollTop + offset;
};
chatango.pm.lists.UserListView.prototype.updateActivity = function(numTicks) {
  var profile, diff, arr;
  for (uid in this.renderedProfiles_) {
    if (this.renderedProfiles_.hasOwnProperty(uid)) {
      profile = this.renderedProfiles_[uid];
      diff = profile.getActivityDiff();
      if (diff > 0 && numTicks % this.smallestTimeChunk_(diff) == 0 && this.isVisible_(profile)) {
        profile.updateActivity();
      }
    }
  }
};
chatango.pm.lists.UserListView.prototype.disposeInternal = function() {
  this.userList_.dispose();
  this.userList_ = null;
  for (uid in this.renderedProfiles_) {
    if (this.renderedProfiles_.hasOwnProperty(uid)) {
      this.renderedProfiles_[uid].dispose();
      this.renderedProfiles_[uid] = null;
    }
  }
  goog.events.unlisten(this.viewCloseBtn_, goog.events.EventType.CLICK, this.closeViewModes_, false, this);
  if (this.viewCloseBtn_) {
    this.viewCloseBtn_.dispose();
    this.viewCloseBtn_ = null;
  }
  goog.base(this, "disposeInternal");
};
goog.provide("goog.style.transition");
goog.provide("goog.style.transition.Css3Property");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom.safe");
goog.require("goog.dom.vendor");
goog.require("goog.functions");
goog.require("goog.html.SafeHtml");
goog.require("goog.style");
goog.require("goog.userAgent");
goog.style.transition.Css3Property;
goog.style.transition.set = function(element, properties) {
  if (!goog.isArray(properties)) {
    properties = [properties];
  }
  goog.asserts.assert(properties.length > 0, "At least one Css3Property should be specified.");
  var values = goog.array.map(properties, function(p) {
    if (goog.isString(p)) {
      return p;
    } else {
      goog.asserts.assertObject(p, "Expected css3 property to be an object.");
      var propString = p.property + " " + p.duration + "s " + p.timing + " " + p.delay + "s";
      goog.asserts.assert(p.property && goog.isNumber(p.duration) && p.timing && goog.isNumber(p.delay), "Unexpected css3 property value: %s", propString);
      return propString;
    }
  });
  goog.style.transition.setPropertyValue_(element, values.join(","));
};
goog.style.transition.removeAll = function(element) {
  goog.style.transition.setPropertyValue_(element, "");
};
goog.style.transition.isSupported = goog.functions.cacheReturnValue(function() {
  if (goog.userAgent.IE) {
    return goog.userAgent.isVersionOrHigher("10.0");
  }
  var el = document.createElement("div");
  var transition = "opacity 1s linear";
  var vendorPrefix = goog.dom.vendor.getVendorPrefix();
  var style = {"transition":transition};
  if (vendorPrefix) {
    style[vendorPrefix + "-transition"] = transition;
  }
  goog.dom.safe.setInnerHtml(el, goog.html.SafeHtml.create("div", {"style":style}));
  var testElement = (el.firstChild);
  goog.asserts.assert(testElement.nodeType == Node.ELEMENT_NODE);
  return goog.style.getStyle(testElement, "transition") != "";
});
goog.style.transition.setPropertyValue_ = function(element, transitionValue) {
  goog.style.setStyle(element, "transition", transitionValue);
};
goog.provide("chatango.pm.lists.FriendProfile");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.Environment");
goog.require("chatango.pm.lists.ListProfile");
goog.require("chatango.transitions.Cubic");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.ui.buttons.CloseButton");
goog.require("goog.events.EventHandler");
goog.require("goog.fx.Animation");
goog.require("goog.style");
goog.require("goog.style.transition");
chatango.pm.lists.FriendProfile = function(user, pmConnection) {
  goog.base(this, user);
  this.pmConnection_ = pmConnection;
  this.dm_ = chatango.managers.DateManager.getInstance();
};
goog.inherits(chatango.pm.lists.FriendProfile, chatango.pm.lists.ListProfile);
chatango.pm.lists.FriendProfile.prototype.updateActivity = function() {
  goog.base(this, "updateActivity");
  var lastActive = this.user_.getLastActive();
  if (this.activityEl_) {
    if (lastActive > 0) {
      var activeStr = this.dm_.diffToString(new Date(lastActive), new Date, 0);
      if (this.user_.isOnline() && this.user_.isIdle()) {
        activeStr = "Idle&nbsp;" + activeStr;
      } else {
        if (this.user_.isAppOnline()) {
          activeStr = "";
        } else {
          if (!this.user_.isOnline()) {
            activeStr = "Last&nbsp;on&nbsp;" + activeStr;
          } else {
            activeStr = "";
          }
        }
      }
      this.activityEl_.innerHTML = activeStr;
    }
  }
};
chatango.pm.lists.FriendProfile.prototype.updateCopy = function() {
  goog.base(this, "updateCopy");
  if (!this.isDesktop_) {
    var lm = chatango.managers.LanguageManager.getInstance();
    this.touchDeleteBtn_.setContent(lm.getString("pm", "del_friend"));
  }
  if (this.user_.isBasicProfileLoaded()) {
    if (!this.isDesktop_ && this.touchWrapperEl_) {
      if (!this.touchDeleteBtn_.getElement()) {
        this.touchDeleteBtn_.render(this.swipeDiv_);
      } else {
      }
    }
  }
};
chatango.pm.lists.FriendProfile.prototype.dispatchAction_ = function() {
  goog.base(this, "dispatchAction_");
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    window["ga"]("send", "event", "PM", "Friend click");
  }
};
chatango.pm.lists.FriendProfile.prototype.onCloseBtnClicked = function(e) {
  chatango.pm.lists.FriendProfile.superClass_.onCloseBtnClicked.call(this, e);
  this.pmConnection_.send("wldelete:" + this.user_.getSid());
};
chatango.pm.lists.FriendProfile.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.lists.FriendsListView");
goog.require("chatango.pm.lists.FriendProfile");
goog.require("chatango.pm.lists.UserListView");
chatango.pm.lists.FriendsListView = function(friendsList) {
  goog.base(this, friendsList);
  this.referrerPrefix_ = "friends_list_view";
  this.handler = this.getHandler();
  this.waitingForMoreFriends_ = false;
};
goog.inherits(chatango.pm.lists.FriendsListView, chatango.pm.lists.UserListView);
chatango.pm.lists.FriendsListView.prototype.makeProfile_ = function(user) {
  return new chatango.pm.lists.FriendProfile(user, this.userList_.pmConnection_);
};
chatango.pm.lists.FriendsListView.prototype.createDom = function() {
  goog.base(this, "createDom");
  goog.events.listen(this.outer_, "scroll", this.onScroll_, false, this);
};
chatango.pm.lists.FriendsListView.prototype.onScroll_ = function(e) {
  if (!this.waitingForMoreFriends_) {
    if (this.getScrollTop() + this.outer_.offsetHeight >= this.outer_.scrollHeight) {
      this.waitingForMoreFriends_ = true;
      this.userList_.loadMoreUsers();
    }
  }
};
chatango.pm.lists.FriendsListView.prototype.updateList = function() {
  goog.base(this, "updateList");
  if (this.waitingForMoreFriends_) {
    this.waitingForMoreFriends_ = false;
  }
};
chatango.pm.lists.FriendsListView.prototype.disposeInternal = function() {
  if (this.outer_) {
    goog.events.unlisten(this.outer_, "scroll", this.onScroll_);
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.lists.StrangerProfile");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.pm.lists.ListProfile");
goog.require("goog.net.cookies");
chatango.pm.lists.StrangerProfile = function(user, bannedView) {
  goog.base(this, user);
  var mod = goog.net.cookies.get("pmm") === "true";
  this.bannedView_ = bannedView;
  this.buttonsEnabled_ = mod;
  this.thirdButton_ = mod;
};
goog.inherits(chatango.pm.lists.StrangerProfile, chatango.pm.lists.ListProfile);
chatango.pm.lists.StrangerProfile.prototype.dispatchAction_ = function() {
  goog.base(this, "dispatchAction_");
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    window["ga"]("send", "event", "PM", "Stranger click");
  }
};
chatango.pm.lists.StrangerProfile.prototype.updateCopy = function() {
  goog.base(this, "updateCopy");
  var lm = chatango.managers.LanguageManager.getInstance();
  if (!this.isDesktop_) {
    if (this.bannedView_) {
      this.touchDeleteBtn_.setContent(lm.getString("pm", "unban_stranger"));
      this.touchDeleteAllBtn_.setContent(lm.getString("pm", "hide_stranger_confirmed"));
    } else {
      this.touchDeleteBtn_.setContent(lm.getString("pm", "del_stranger"));
      this.touchDeleteAllBtn_.setContent(lm.getString("pm", "del_stranger_ip"));
    }
  }
};
chatango.pm.lists.StrangerProfile.prototype.onCloseBtnClicked = function(e) {
  goog.base(this, "onCloseBtnClicked", e);
  if (this.bannedView_) {
    this.moderate_("unbn");
  } else {
    this.moderate_("rmv1");
  }
};
chatango.pm.lists.StrangerProfile.prototype.onDeleteAllBtnClicked = function(e) {
  goog.base(this, "onDeleteAllBtnClicked", e);
  if (this.bannedView_) {
    this.moderate_("hide");
  } else {
    this.moderate_("rmip");
  }
};
chatango.pm.lists.StrangerProfile.prototype.moderate_ = function(action) {
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    if (window["android"] && window["android"]["moderateStrangers"]) {
      window["android"]["moderateStrangers"](this.user_.getSid().toLowerCase(), action);
    }
    this.element_.style.opacity = "0.5";
  }
};
goog.provide("chatango.pm.lists.StrangersListView");
goog.require("chatango.pm.lists.StrangerProfile");
goog.require("chatango.pm.lists.UserListView");
chatango.pm.lists.StrangersListView = function(friendsList) {
  goog.base(this, friendsList);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.referrerPrefix_ = "strangers_list_view";
  this.sortingEnabled_ = false;
  this.lastScroll_ = 0;
  this.refreshThreshold_ = 50;
  this.canScroll_ = true;
};
goog.inherits(chatango.pm.lists.StrangersListView, chatango.pm.lists.UserListView);
chatango.pm.lists.StrangersListView.prototype.makeProfile_ = function(user) {
  return new chatango.pm.lists.StrangerProfile(user, this.userList_.filterParams_.getBannedChecked());
};
chatango.pm.lists.StrangersListView.prototype.createDom = function() {
  goog.base(this, "createDom");
  this.infoArea_ = goog.dom.createDom("div", {"style":"padding:0.6em;font-size:0.8em;"});
  goog.events.listen(this.outer_, "scroll", this.onScroll_, false, this);
};
chatango.pm.lists.StrangersListView.prototype.onScroll_ = function(e) {
  if (this.getScrollTop() < -this.refreshThreshold_ && this.lastScroll_ - this.getScrollTop() > this.refreshThreshold_) {
    this.userList_.refresh();
  } else {
    if (this.canScroll_) {
      if (this.getScrollTop() + this.outer_.offsetHeight >= this.outer_.scrollHeight) {
        this.userList_.getMore();
        this.canScroll_ = false;
      }
    }
  }
  this.lastScroll_ = this.getScrollTop();
};
chatango.pm.lists.StrangersListView.prototype.updateList = function() {
  goog.base(this, "updateList");
  goog.style.showElement(this.emptyList_, false);
  var addInfo = false;
  switch(this.userList_.getState()) {
    case chatango.pm.lists.StrangersList.States.OVERLOADED:
      this.infoArea_.innerHTML = this.lm_.getString("pm", "strangers_list_overload");
      addInfo = true;
      break;
    case chatango.pm.lists.StrangersList.States.NO_RESULTS:
      this.infoArea_.innerHTML = this.lm_.getString("pm", "strangers_list_no_results");
      addInfo = true;
      break;
    case chatango.pm.lists.StrangersList.States.NO_MORE_RESULTS:
      this.infoArea_.innerHTML = this.lm_.getString("pm", "strangers_list_no_more");
      addInfo = true;
      break;
    case chatango.pm.lists.StrangersList.States.BANNED_CONTENT:
      this.infoArea_.innerHTML = this.lm_.getString("pm", "strangers_list_nsfw");
      addInfo = true;
      break;
  }
  if (addInfo) {
    goog.dom.append(this.getContentElement(), this.infoArea_);
    this.canScroll_ = false;
  } else {
    goog.dom.removeNode(this.infoArea_);
    this.canScroll_ = true;
  }
  this.draw();
};
chatango.pm.lists.StrangersListView.prototype.disposeInternal = function() {
  if (this.outer_) {
    goog.events.unlisten(this.outer_, "scroll", this.onScroll_);
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.messagedata.SystemMessageData");
goog.require("chatango.messagedata.MessageData");
chatango.messagedata.SystemMessageData = function(msgType, msgHtml) {
  chatango.messagedata.MessageData.call(this);
  this.type_ = chatango.messagedata.MessageData.MessageType.SYSTEM;
  this.systemMessageType_ = msgType;
  this.messageHtml_ = msgHtml;
  this.msgDate_ = new Date;
};
goog.inherits(chatango.messagedata.SystemMessageData, chatango.messagedata.MessageData);
chatango.messagedata.SystemMessageData.MessageType = {ON_OFF:"sys-on-off", INFO:"sys-info", WARNING:"sys-warn", ANNOUNCE:"sys-annc"};
chatango.messagedata.SystemMessageData.prototype.getDate = function() {
  return this.msgDate_;
};
chatango.messagedata.SystemMessageData.prototype.getSystemMessageType = function() {
  return this.systemMessageType_;
};
goog.provide("chatango.pm.SystemMessage");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.DateManagerEvent");
goog.require("chatango.messagedata.SystemMessageData");
goog.require("chatango.output.Message");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
chatango.pm.SystemMessage = function(msgData) {
  chatango.output.Message.call(this);
  this.msgData_ = msgData;
  this.msgDate_ = msgData.getDate();
  this.dm_ = chatango.managers.DateManager.getInstance();
};
goog.inherits(chatango.pm.SystemMessage, chatango.output.Message);
chatango.pm.SystemMessage.Style = {STRIP_COL:"#0084EF", SYS_ON_OFF_TXT_COL:"#666666", SYS_ON_OFF_BG_COL:"#FFFFFF", SYS_BASIC_COL:"#000000", SYS_WARNING_TXT_COL:"#FFFFFF", SYS_WARNING_BG_COL:"#FF0000", SYS_ANNOUNCE_TXT_COL:"#FFFFFF", SYS_ANNOUNCE_BG_COL:"#0084EF", SYS_BLOCK_COL:"#DD0000", SYS_INFO_TXT_COL:"#0084EF", SYS_INFO_TXT_COL:"#FFFFFF", SYS_CHATANGO_COL:"#0084EF"};
chatango.pm.SystemMessage.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"sys-msg " + this.msgData_.getSystemMessageType()});
  var lm = chatango.managers.LanguageManager.getInstance();
  var date_format = "msg_date_format_" + (this.dateMode_ === chatango.output.Message.DateMode.TIMEONLY ? "short" : "long");
  var date = this.dm_.dateToString(this.msgDate_, lm.getString("pm", date_format));
  this.msgWrap_ = goog.dom.createDom("div", {"class":"msg-wrap"});
  this.msgContent_ = goog.dom.createDom("div", {"class":"msg-content"});
  this.date_ = goog.dom.createDom("span", {"class":"msg-date"}, date);
  goog.dom.append(this.msgWrap_, this.date_);
  goog.dom.append(this.msgWrap_, this.msgContent_);
  goog.dom.append(this.element_, this.msgWrap_);
  this.updateCopy();
};
chatango.pm.SystemMessage.prototype.getMessageId = function() {
  return "";
};
chatango.pm.SystemMessage.prototype.updateCopy = function() {
  this.msgContent_.innerHTML = this.msgData_.getMessageHtml();
};
chatango.pm.SystemMessage.prototype.disposeInternal = function() {
  chatango.pm.SystemMessage.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.messagedata.PrivateMsgFormatter");
goog.require("chatango.login.Session");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Style");
goog.require("chatango.media.MediaButton");
goog.require("chatango.messagedata.BaseMsgFormatter");
goog.require("chatango.smileys.SmileyManager");
goog.require("chatango.ui.Thumbnail");
goog.require("chatango.ui.Youtube");
goog.require("chatango.ui.icons.VideoPlayIcon");
goog.require("goog.events");
goog.require("goog.string");
chatango.messagedata.PrivateMsgFormatter = function(messageData, authorIsOwner, parentDom, parentComponent, managers) {
  goog.base(this, messageData, authorIsOwner, parentDom, parentComponent, managers);
  this.messageHtml_ = this.messageHtml_.replace(/<\/g>/g, "");
  this.messageHtml_ = this.messageHtml_.replace(/\u2593/, "<strike>").replace(/\u2592/, "</strike>");
  this.parserBlockAllowed_ = true;
};
goog.inherits(chatango.messagedata.PrivateMsgFormatter, chatango.messagedata.BaseMsgFormatter);
chatango.messagedata.PrivateMsgFormatter.TAG_WHITELIST = ["m", "p", "u", "b", "i", "br", "strike", "g"];
chatango.messagedata.PrivateMsgFormatter.MAX_IMAGES = 3;
chatango.messagedata.PrivateMsgFormatter.prototype.parseTag_ = function() {
  var type = chatango.messagedata.BaseMsgFormatter.TagType.OPENING;
  var name = "";
  this.parserAdvance_(1);
  var c = this.getChar_();
  if (c == "/") {
    type = chatango.messagedata.BaseMsgFormatter.TagType.CLOSING;
    this.parserAdvance_(1);
    c = this.getChar_();
  }
  name = this.parseTagName_();
  attributes = this.parseTagAttributes_();
  if (!attributes) {
    return false;
  }
  c = this.getChar_();
  if (c == "/") {
    if (type == chatango.messagedata.BaseMsgFormatter.TagType.CLOSING) {
      if (chatango.DEBUG) {
        this.logger.info("Parse error at: " + this.messageHtml_.substring(this.parserPosition_));
      }
      return false;
    }
    type = chatango.messagedata.BaseMsgFormatter.TagType.SELF_CLOSING;
    this.parserAdvance_(1);
    c = this.getChar_();
  }
  if (c != ">") {
    if (chatango.DEBUG) {
      this.logger.info("Parse error at: " + this.messageHtml_.substring(this.parserPosition_));
    }
    return false;
  }
  this.parserAdvance_(1);
  if (name == "P") {
    if (type == chatango.messagedata.BaseMsgFormatter.TagType.OPENING) {
      if (!this.parserBlockAllowed_) {
        if (chatango.DEBUG) {
          console.log("Parse error: p tag not allowed here");
        }
        return false;
      } else {
        this.parserBlockAllowed_ = false;
      }
    }
    if (type == chatango.messagedata.BaseMsgFormatter.TagType.CLOSING) {
      this.parserBlockAllowed_ = true;
    }
  }
  if (name.toLowerCase() == "g" && type == chatango.messagedata.BaseMsgFormatter.TagType.OPENING) {
    if (this.inFTag_) {
      var top = this.parserStack_[this.parserStack_.length - 1];
      if (top.name.toLowerCase() != "g") {
        if (chatango.DEBUG) {
          this.logger.info("Nested g tag encountered when previous g tag is not on top of tag stack.");
        }
        return false;
      }
      this.parserStack_.pop();
    } else {
      this.inFTag_ = true;
    }
  }
  if (!goog.array.contains(chatango.messagedata.PrivateMsgFormatter.TAG_WHITELIST, name.toLowerCase())) {
    if (chatango.DEBUG) {
      this.logger.info("tag " + name + " not in whitelist");
    }
    return true;
  }
  node = {"children":[], "name":name, "attributes":attributes};
  node.name = name;
  node.attributes = attributes;
  if (name === "i" && attributes !== {}) {
    if (this.isYoutubeLink(attributes["s"])) {
      node.name = "ct:youtube";
    } else {
      if (this.isSmiley(attributes["s"])) {
        node.name = "ct:smiley";
      } else {
        if (this.isImageLink(attributes["s"])) {
          node.name = "ct:image";
        }
      }
    }
    node.attributes = {src:attributes["s"], height:attributes["h"], width:attributes["w"]};
  }
  var top = this.parserStack_[this.parserStack_.length - 1];
  if (type == chatango.messagedata.BaseMsgFormatter.TagType.OPENING) {
    top.children.push(node);
    this.parserStack_.push(node);
  } else {
    if (type == chatango.messagedata.BaseMsgFormatter.TagType.CLOSING) {
      if (name != top.name && top.name.toLowerCase() == "g") {
        this.parserStack_.pop();
        this.inFTag_ = false;
        top = this.parserStack_[this.parserStack_.length - 1];
      }
      if (name != top.name) {
        if (chatango.DEBUG) {
          this.logger.info('Found "' + name + '", expected "' + top.name + '"');
        }
        return false;
      }
      this.parserStack_.pop();
    } else {
      if (type == chatango.messagedata.BaseMsgFormatter.TagType.SELF_CLOSING) {
        top.children.push(node);
      }
    }
  }
  return true;
};
chatango.messagedata.PrivateMsgFormatter.prototype.isYoutubeLink = function(token) {
  return token.match(chatango.utils.formatting.YOUTUBE_HREF_PM_REGEX);
};
chatango.messagedata.PrivateMsgFormatter.prototype.isSmiley = function(token) {
  var maxSmileys = chatango.managers.Environment.getInstance().isDesktop() ? chatango.smileys.SmileyManager.MAX_SMILEYS_PER_MSG : chatango.smileys.SmileyManager.MAX_SMILEYS_PER_MSG_TOUCH;
  if (this.numSmileysInMsg_ >= maxSmileys) {
    return false;
  }
  var is_smiley = token.match(chatango.utils.formatting.PM_SMILEY_REGEX);
  if (!is_smiley) {
    return false;
  }
  if (this.messageData_.isPremium()) {
    is_smiley = token.match(chatango.smileys.SmileyManager.getInstance().allPmSmileysRegExp);
  } else {
    is_smiley = token.match(chatango.smileys.SmileyManager.getInstance().basicPmSmileysRegExp);
  }
  if (is_smiley) {
    this.numSmileysInMsg_++;
  }
  if (is_smiley) {
    return true;
  } else {
    return false;
  }
};
chatango.messagedata.PrivateMsgFormatter.prototype.processNode_ = function(node) {
  var elt;
  var component;
  if (!node.name) {
    return;
  }
  node.name = node.name.toLowerCase();
  if (node.name == "p") {
    elt = goog.dom.createDom("p");
    this.appendDom_(elt);
    node.element = elt;
  } else {
    if (node.name == "m") {
      elt = goog.dom.createDom("span");
      this.appendDom_(elt);
      node.element = elt;
    } else {
      if (node.name == "u") {
        elt = goog.dom.createDom("u");
        this.appendDom_(elt);
        node.element = elt;
      } else {
        if (node.name == "b") {
          elt = goog.dom.createDom("b");
          this.appendDom_(elt);
          node.element = elt;
        } else {
          if (node.name == "i") {
            elt = goog.dom.createDom("i");
            this.appendDom_(elt);
            node.element = elt;
          } else {
            if (node.name == "strike") {
              elt = goog.dom.createDom("span", {"style":"text-decoration: line-through"});
              this.appendDom_(elt);
              node.element = elt;
            } else {
              if (node.name == "br") {
                elt = goog.dom.createDom("br");
                this.appendDom_(elt);
                node.element = elt;
              } else {
                if (node.name == "g") {
                  this.processGTag_(node);
                } else {
                  if (node.name == "ct:text") {
                    this.appendDom_(node.value);
                  } else {
                    if (node.name == "ct:image") {
                      this.processImageLink(node);
                    } else {
                      if (node.name == "ct:youtube") {
                        this.processYoutubeLink(node);
                      } else {
                        if (node.name == "ct:link") {
                          this.processLink(node);
                        } else {
                          if (node.name == "ct:cm") {
                            this.processCMMessage(node);
                          } else {
                            if (node.name == "ct:smiley") {
                              this.processSmiley(node);
                            } else {
                              if (node.name == "ct:link_fragment") {
                                this.processLinkFragment(node);
                              } else {
                                if (chatango.DEBUG) {
                                  this.logger.info("Unrecognized tag name: " + node.name);
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  node.created = true;
};
chatango.messagedata.PrivateMsgFormatter.prototype.processGTag_ = function(node) {
  var elt;
  var name, pos, size, hex, fontIndex, format;
  var style = "";
  for (name in node.attributes) {
    if (node.attributes.hasOwnProperty(name)) {
      var format = name.match(/x(\d+)?s((?:[0-9a-f])(?:[0-9a-f]{2,5})?)?/i);
      if (!format) {
        continue;
      }
      size = format[1] ? parseInt(format[1], 10) : 11;
      if (size > 14 && !(this.authorIsOwner_ || this.isPremium_)) {
        continue;
      }
      hex = format[2] || "0";
      if (hex.length == 1) {
        hex = hex + hex + hex;
      }
      style = "";
      this.currentFontSize_ = chatango.utils.formatting.scaleSize(size);
      style += "font-size:" + this.currentFontSize_ + "%;";
      style += "color:#" + hex + ";";
      fontIndex = node.attributes[name];
      if (fontIndex && fontIndex.length > 0) {
        style += "font-family:" + this.getFont(fontIndex);
      }
    }
  }
  elt = goog.dom.createDom("span", {"style":style});
  node.element = elt;
  this.appendDom_(elt);
};
chatango.messagedata.PrivateMsgFormatter.prototype.processImageLink = function(node) {
  goog.base(this, "processImageLink", node);
  var src = node.attributes ? node.attributes.src : node.value;
  if (!this.checkURI(src)) {
    node.element = goog.dom.createTextNode(src);
    this.appendDom_(node.element);
    return;
  }
  if (this.messageData_.getUserType() != chatango.users.User.UserType.SELLER) {
    this.processLink(src);
    return;
  }
  this.imageLinks_ += 1;
  if (this.imageLinks_ > chatango.messagedata.PrivateMsgFormatter.MAX_IMAGES) {
    this.processLink(src);
    return;
  }
  var scale = chatango.managers.Style.getInstance().getScale();
  var w = Math.round(133 * scale / 100);
  var h = Math.round(100 * scale / 100);
  var thumb = new chatango.ui.Thumbnail(src, w, h, this.managers_);
  node.element = thumb.getElement();
  this.appendComponent_(thumb);
};
chatango.messagedata.PrivateMsgFormatter.prototype.processYoutubeLink = function(node) {
  var rawMsg = node.attributes.src;
  var videoid = rawMsg.match(chatango.utils.formatting.YOUTUBE_HREF_PM_REGEX);
  var component = new chatango.ui.Youtube(videoid[1], "http://youtube.com/watch?v=" + videoid[1], this.managers_, true);
  node.element = component.getElement();
  this.appendComponent_(component);
};
chatango.messagedata.PrivateMsgFormatter.prototype.processLink = function(node) {
  var elt;
  var uri = node.value;
  if (uri.match(chatango.utils.formatting.WWW_REGEX)) {
    uri = "http://" + uri;
  }
  if (uri.match(chatango.utils.formatting.AMAZON_REGEX)) {
    if (uri.match(chatango.utils.formatting.TAG_REGEX)) {
    } else {
      if (uri.match(chatango.utils.formatting.GET_REGEX)) {
        uri = uri + "&tag=chatangocom-20";
      } else {
        uri = uri + "/?tag=chatangocom-20";
      }
    }
  }
  if (node.value.length < 256) {
    elt = goog.dom.createDom("a", {"href":uri, "target":"_blank"}, node.value);
  } else {
    elt = goog.dom.createDom("span", {}, node.value);
  }
  node.element = elt;
  this.appendDom_(elt);
};
chatango.messagedata.PrivateMsgFormatter.prototype.processSmiley = function(node) {
  var smileyManager = chatango.smileys.SmileyManager.getInstance();
  var smileyCode = smileyManager.getCodeFromPmToken(node.attributes.src, this.messageData_.isPremium() || this.authorIsOwner_);
  var w = node.attributes["width"];
  var h = node.attributes["height"];
  if (!w || !h) {
    return;
  }
  var sm_obj = smileyManager.allSmileyInfo[smileyCode];
  var baseW = sm_obj["w"] != undefined ? sm_obj["w"] : 1;
  if (w == "NaN" || h == "NaN") {
    var defaultSize = chatango.smileys.SmileyManager.DEFAULT_PM_SMILEY_SIZE;
    var baseH = sm_obj["h"] != undefined ? sm_obj["h"] : 1;
    w = defaultSize * baseW;
    h = defaultSize * baseH;
  }
  var scale = chatango.managers.ScaleManager.getInstance().getScale() / 100 * 1.2;
  var info = null;
  var sz = w / baseW;
  sz = sz * scale;
  var smiley = chatango.smileys.SmileyManager.getInstance().makeSmiley(smileyCode, sz, this.managers_, info);
  this.appendComponent_(smiley);
};
goog.provide("chatango.settings.servers.PmServer");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.settings.servers.BaseDomain");
chatango.settings.servers.PmServer = function() {
};
goog.addSingletonGetter(chatango.settings.servers.PmServer);
chatango.settings.servers.PmServer.SERVER_PREFIX = "c1";
chatango.settings.servers.PmServer.prototype.getHost = function() {
  var host = chatango.settings.servers.PmServer.SERVER_PREFIX + "." + chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getPmServerBaseDomain();
  return host;
};
goog.provide("chatango.messagedata.PrivateMessageData");
goog.require("chatango.messagedata.MessageData");
goog.require("chatango.messagedata.PrivateMsgFormatter");
goog.require("chatango.smileys.SmileyManager");
goog.require("chatango.users.User");
goog.require("goog.dom");
goog.require("goog.dom.classes");
chatango.messagedata.PrivateMessageData = function(msgString, isHistory) {
  chatango.messagedata.MessageData.call(this);
  this.type_ = !isHistory ? chatango.messagedata.MessageData.MessageType.PRIVATE : chatango.messagedata.MessageData.MessageType.PRIVATE_HISTORY;
  msgString = msgString.split(/\r\n/, 1).toString();
  var arr = msgString.split(":", chatango.messagedata.PrivateMessageData.MAX_FIELDS);
  var arr2 = msgString.split(":");
  for (var i = chatango.messagedata.PrivateMessageData.TXT_FIELD + 1;i < arr2.length;++i) {
    arr[chatango.messagedata.PrivateMessageData.TXT_FIELD] += ":" + arr2[i];
  }
  this.messageArray_ = arr;
  var m1 = this.messageArray_[1];
  var m2 = this.messageArray_[2];
  this.uid_;
  this.flashCookie_;
  this.chatId_ = m1;
  this.isOnline_ = this.messageArray_[0] == "msg";
  if (m1.charAt(0) != "*") {
    this.userType_ = chatango.users.User.UserType.SELLER;
    this.uid_ = m2;
    this.flashCookie_ = null;
  } else {
    this.userType_ = chatango.users.User.UserType.ANON;
    this.uid_ = m1;
    this.flashCookie_ = m2;
  }
  this.TSString_ = this.messageArray_[4];
  this.flags_ = Number(this.messageArray_[5]);
  this.messageHtml_ = this.messageArray_[chatango.messagedata.PrivateMessageData.TXT_FIELD];
  var text = this.messageHtml_;
  text = text.replace(/<i s="vid:\/\/yt:([^ ]*)"[^>]*\/>/g, "https://www.youtube.com/watch?v=$1");
  text = text.replace(/<i s="sm:\/\/([^ ]*)"[^>]*\/>/g, function(match, p1, offset, string) {
    return chatango.smileys.SmileyManager.getInstance().getCodeFromPmToken("sm://" + p1);
  });
  text = text.replace(/<i s="([^ ]*)"[^>]*\/>/g, "$1");
  text = text.replace(/<[^>]*>/g, "");
  text = text.replace(/\u2593 \u2592/g, "");
  text = text.replace(/\u2593|\u2592|\u2593 \u2592/g, "");
  this.plainText_ = text;
};
goog.inherits(chatango.messagedata.PrivateMessageData, chatango.messagedata.MessageData);
chatango.messagedata.PrivateMessageData.MAX_FIELDS = 7;
chatango.messagedata.PrivateMessageData.TXT_FIELD = 6;
chatango.messagedata.PrivateMessageData.prototype.getUid = function() {
  return this.uid_;
};
chatango.messagedata.PrivateMessageData.prototype.getFlashCookie = function() {
  return this.flashCookie_;
};
chatango.messagedata.PrivateMessageData.prototype.getChatId = function() {
  return this.chatId_;
};
chatango.messagedata.PrivateMessageData.prototype.getName = function() {
  return this.uid_;
};
chatango.messagedata.PrivateMessageData.prototype.getMsgHtml = function() {
  return this.messageHtml_;
};
chatango.messagedata.PrivateMessageData.prototype.getPlainText = function() {
  return this.plainText_;
};
chatango.messagedata.PrivateMessageData.prototype.getMsgString = function() {
  return this.messageArray_.join(":");
};
chatango.messagedata.PrivateMessageData.prototype.isOnlineMessage = function() {
  return this.isOnline_;
};
goog.provide("chatango.networking.PmConnection");
goog.require("chatango.login.Session");
goog.require("chatango.messagedata.PrivateMessageData");
goog.require("chatango.messagedata.PrivateMsgFormatter");
goog.require("chatango.networking.BaseConnection");
goog.require("chatango.networking.CommonConnectionEvent");
goog.require("chatango.networking.PmConnectionEvent");
goog.require("chatango.settings.servers.PmServer");
goog.require("chatango.utils.Encode");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.net.WebSocket");
goog.require("goog.net.cookies");
chatango.networking.PmConnection = function(session) {
  this.session_ = session;
  var bd = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType);
  var protocol = bd.getProtocol().replace(":", "");
  var secure = protocol === "https";
  var ports = secure ? bd.getPmSecurePorts() : bd.getPmPorts();
  var server = chatango.settings.servers.PmServer.getInstance().getHost();
  goog.base(this, ports, server, secure);
  goog.events.listen(this, chatango.networking.PmConnectionEvent.EventType.OK, this.clientAuthenticated, false, this);
};
goog.inherits(chatango.networking.PmConnection, chatango.networking.BaseConnection);
chatango.networking.PmConnection.CLIENT_VERSION = "2";
chatango.networking.PmConnection.prototype.onData = function(event) {
  var arr = event.message.split("\r\n")[0].split(":");
  var cmd_type = "pm";
  var e_name = chatango.networking.PmConnectionEvent.EventLookup[arr[0]];
  if (!e_name) {
    e_name = chatango.networking.CommonConnectionEvent.EventLookup[arr[0]];
    cmd_type = "common";
  }
  if (!e_name) {
    if (chatango.DEBUG) {
      if (arr.toString() == "") {
        console.log("PING FROM PM SERVER");
      } else {
        console.log("Unhandled PM command:" + arr);
      }
    }
    return;
  }
  if (cmd_type == "pm") {
    if (chatango.DEBUG) {
      this.logger.info("dispatch Pm ConnectionEvent:" + e_name);
    }
    if (e_name == chatango.networking.PmConnectionEvent.EventType.msg || e_name == chatango.networking.PmConnectionEvent.EventType.msgoff) {
      var msgData = new chatango.messagedata.PrivateMessageData(event.message);
      var formatter = new chatango.messagedata.PrivateMsgFormatter(msgData);
      var valid = formatter.isValidMessage();
      if (valid) {
        this.dispatchEvent(new chatango.networking.PmConnectionEvent(e_name, msgData));
      } else {
        if (chatango.DEBUG) {
          console.log("Malformatted PM message");
        }
        return;
      }
    } else {
      var pmEvent = new chatango.networking.PmConnectionEvent(e_name, arr);
      this.dispatchEvent(pmEvent);
    }
  } else {
    if (chatango.DEBUG) {
      this.logger.info("dispatch Common ConnectionEvent:" + e_name);
    }
    this.dispatchEvent(new chatango.networking.CommonConnectionEvent(e_name, arr));
  }
};
chatango.networking.PmConnection.prototype.onConnect = function() {
  chatango.networking.PmConnection.superClass_.onConnect.call(this);
  if (chatango.DEBUG) {
    console.log("PmConnection.prototype.onConnect");
  }
  this.initHandShake();
};
chatango.networking.PmConnection.prototype.initHandShake = function() {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var token = cUser.getToken();
  var sessionId = this.session_.getSessionId();
  var clientVersion = chatango.networking.PmConnection.CLIENT_VERSION;
  var handshake_array = ["tlogin", token, clientVersion];
  if (sessionId && sessionId != "") {
    handshake_array.push(sessionId);
  }
  var hs = handshake_array.join(":");
  this.send(hs, "\x00");
};
chatango.networking.PmConnection.prototype.denied = function(e) {
  this.dispatchEvent(new chatango.networking.ConnectionStatusEvent(chatango.networking.CommonConnectionEvent.EventType.DENIED_RELAY));
};
chatango.networking.PmConnection.prototype.clientAuthenticated = function(e) {
  if (chatango.DEBUG) {
    console.log("PmConnection clientAuthenticated");
  }
  goog.base(this, "clientAuthenticated", e);
};
chatango.networking.PmConnection.prototype.CONNECTION_TYPE = "pmcon";
chatango.networking.PmConnection.prototype.getConnectionType = function() {
  return chatango.networking.PmConnection.prototype.CONNECTION_TYPE;
};
chatango.networking.PmConnection.prototype.disposeInternal = function() {
  goog.events.unlisten(this, chatango.networking.PmConnectionEvent.EventType.OK, this.clientAuthenticated, false, this);
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.PmSettings");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.networking.PmConnection");
goog.require("chatango.networking.PmConnectionEvent");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.users.UserManager");
goog.require("goog.events.EventTarget");
goog.require("goog.net.EventType");
goog.require("goog.net.cookies");
chatango.pm.PmSettings = function() {
  goog.events.EventTarget.call(this);
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  this.firstLoad_ = true;
};
goog.inherits(chatango.pm.PmSettings, goog.events.EventTarget);
chatango.pm.PmSettings.prototype.SAVE_HISTORY = "save_pm_history";
chatango.pm.PmSettings.prototype.serverSettingsLoaded_ = false;
chatango.pm.PmSettings.prototype.httpSettingsLoaded_ = false;
chatango.pm.PmSettings.prototype.noHttpSettingsAvailable_ = false;
chatango.pm.PmSettings.prototype.disableIdleTime_ = false;
chatango.pm.PmSettings.prototype.emailOfflineMsg_ = false;
chatango.pm.PmSettings.prototype.allowAnon_ = false;
chatango.pm.PmSettings.prototype.raiseWindow_ = false;
chatango.pm.PmSettings.prototype.pmConnection_ = null;
chatango.pm.PmSettings.showDirState = {ON:"on", OFF:"off", DISABLED:"disabled"};
chatango.pm.PmSettings.prototype.showDir_ = chatango.pm.PmSettings.showDirState.OFF;
chatango.pm.PmSettings.prototype.setPmConnection = function(pmConnection) {
  this.pmConnection_ = pmConnection;
  goog.events.listen(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.settings, this.onServerSettings_, false, this);
  goog.events.listen(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.reload_profile, this.userProfileUpdated_, false, this);
  this.getServerSettings();
  this.getAndSetHttpSettings();
};
chatango.pm.PmSettings.prototype.getAndSetHttpSettings = function(opt_UpdateVars) {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var token = cUser.getToken();
  var query = "auth=token&s=" + token;
  if (opt_UpdateVars) {
    for (var i in opt_UpdateVars) {
      query += "&" + i + "=" + opt_UpdateVars[i];
    }
  }
  var bd = this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  var url = "//" + bd + "/flashset?nocache=" + Math.round(Math.random() * 1E5);
  var headers = {"Content-type":"application/x-www-form-urlencoded"};
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onHttpSettingsLoaded_, false, this);
  goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.httpSettingsError_, false, this);
  xhr.send(url, "POST", query, headers);
};
chatango.pm.PmSettings.prototype.getServerSettings = function() {
  if (!this.pmConnection_) {
    return;
  }
  this.pmConnection_.send("settings");
};
chatango.pm.PmSettings.prototype.getLoaded = function() {
  return this.httpSettingsLoaded_ && this.serverSettingsLoaded_;
};
chatango.pm.PmSettings.prototype.getDisableIdleTime = function() {
  return this.disableIdleTime_;
};
chatango.pm.PmSettings.prototype.setDisableIdleTime = function(value) {
  if (value == this.disableIdleTime_) {
    return;
  }
  this.disableIdleTime_ = value;
  var cmd = "setsettings:disable_idle_time:" + (this.disableIdleTime_ ? "on" : "off");
  this.pmConnection_.send(cmd);
};
chatango.pm.PmSettings.prototype.getEmailOfflineMsg = function() {
  return this.emailOfflineMsg_;
};
chatango.pm.PmSettings.prototype.setEmailOfflineMsg = function(value) {
  if (value == this.emailOfflineMsg_) {
    return;
  }
  this.emailOfflineMsg_ = value;
  var cmd = "setsettings:email_offline_msg:" + (this.emailOfflineMsg_ ? "on" : "off");
  this.pmConnection_.send(cmd);
};
chatango.pm.PmSettings.prototype.getAllowAnon = function() {
  return this.allowAnon_;
};
chatango.pm.PmSettings.prototype.setAllowAnon = function(value) {
  if (value == this.allowAnon_) {
    return;
  }
  this.allowAnon_ = value;
  var cmd = "setsettings:allow_anon:" + (this.allowAnon_ ? "on" : "off");
  this.pmConnection_.send(cmd);
};
chatango.pm.PmSettings.prototype.getShowDir = function() {
  return this.showDir_ == chatango.pm.PmSettings.showDirState.ON;
};
chatango.pm.PmSettings.prototype.setShowDir = function(bool) {
  var value = bool ? chatango.pm.PmSettings.showDirState.ON : chatango.pm.PmSettings.showDirState.OFF;
  if (value == this.showDir_) {
    return;
  }
  if (!this.firstLoad_) {
    this.getAndSetHttpSettings({o:value});
  }
  this.showDir_ = value;
  this.firstLoad_ = false;
};
chatango.pm.PmSettings.prototype.getShowDirDisabled = function() {
  return this.showDir_ == chatango.pm.PmSettings.showDirState.DISABLED;
};
chatango.pm.PmSettings.prototype.getSaveHistory = function() {
  if (!goog.net.cookies.isEnabled()) {
    return false;
  }
  return goog.net.cookies.get(chatango.pm.PmSettings.prototype.SAVE_HISTORY);
};
chatango.pm.PmSettings.prototype.setSaveHistory = function(bool) {
  if (!goog.net.cookies.isEnabled()) {
    return;
  }
  var value = bool ? 1 : 0;
  goog.net.cookies.set(chatango.pm.PmSettings.prototype.SAVE_HISTORY, value, 31536E3, "/");
};
chatango.pm.PmSettings.prototype.getNoHttpSettingsAvailable = function() {
  return this.noHttpSettingsAvailable_;
};
chatango.pm.PmSettings.prototype.onServerSettings_ = function(e) {
  if (chatango.DEBUG) {
    console.log("PmSettings onServerSettings_:", e);
  }
  var arr = e.data;
  arr.shift();
  var settingFunctionName = "";
  for (var i = 0;i < arr.length;i += 2) {
    switch(arr[i]) {
      case "disable_idle_time":
        this.setDisableIdleTime(arr[i + 1] == "on");
        break;
      case "allow_anon":
        this.setAllowAnon(arr[i + 1] == "on");
        break;
      case "email_offline_msg":
        this.setEmailOfflineMsg(arr[i + 1] == "on");
        break;
      case "raise_window":
        this.raiseWindow_ = arr[i + 1] == "on";
        break;
    }
  }
  this.serverSettingsLoaded_ = true;
  this.settingsLoaded_();
};
chatango.pm.PmSettings.prototype.onHttpSettingsLoaded_ = function(e) {
  if (chatango.DEBUG) {
    console.log("PmSettings httpSettingsLoaded:", e);
  }
  var s = unescape(e.currentTarget.getResponseText());
  try {
    var settings = s.split("s=")[1].split(":");
  } catch (err) {
    throw err;
  }
  var i;
  for (i = 0;i < settings.length;i += 2) {
    switch(settings[i]) {
      case "show_dir":
        if (settings[i + 1] == "disable") {
          this.showDir_ = chatango.pm.PmSettings.showDirState.DISABLED;
        } else {
          this.setShowDir(settings[i + 1] == "on");
        }
        break;
      default:
        break;
    }
  }
  this.httpSettingsLoaded_ = true;
  this.settingsLoaded_();
  this.removeXhrListeners(e.currentTarget);
};
chatango.pm.PmSettings.prototype.httpSettingsError_ = function(e) {
  if (chatango.DEBUG) {
    console.log("PmSettings httpSettingsError", e);
  }
  this.removeXhrListeners(e.currentTarget);
};
chatango.pm.PmSettings.prototype.removeXhrListeners = function(xhr) {
  goog.events.unlisten(xhr, goog.net.EventType.SUCCESS, this.onHttpSettingsLoaded_, false, this);
  goog.events.unlisten(xhr, [goog.net.EventType.ERROR, goog.net.EventType.TIMEOUT, goog.net.EventType.ABORT], this.httpSettingsError_, false, this);
};
chatango.pm.PmSettings.prototype.userProfileUpdated_ = function(e) {
  if (chatango.DEBUG) {
    console.log("PmSettings userProfileUpdated_", e);
  }
};
chatango.pm.PmSettings.prototype.settingsLoaded_ = function() {
  if (!this.serverSettingsLoaded_ || !this.httpSettingsLoaded_) {
    return;
  }
};
chatango.pm.PmSettings.prototype.dispose = function() {
  goog.events.unlisten(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.settings, this.onServerSettings_, false, this);
  goog.events.unlisten(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.reload_profile, this.userProfileUpdated_, false, this);
  if (this.pmConnection_) {
    this.pmConnection_.dispose();
  }
  this.pmConnection_ = null;
};
goog.provide("chatango.pm.IdleTimeManager");
goog.require("chatango.networking.PmConnection");
goog.require("goog.events");
chatango.pm.IdleTimeManager = function() {
  this.events_ = [goog.events.EventType.KEYDOWN, goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEMOVE];
  goog.events.listen(document.body, this.events_, this.onUserAction, false, this);
};
chatango.pm.IdleTimeManager.IDLE_INTERVAL = 60 * 1E3;
chatango.pm.IdleTimeManager.prototype.userIsActive_ = true;
chatango.pm.IdleTimeManager.prototype.pmConnection_ = null;
chatango.pm.IdleTimeManager.prototype.setPmConnection = function(pmConnection) {
  this.pmConnection_ = pmConnection;
};
chatango.pm.IdleTimeManager.prototype.idleTimerId_ = -1;
chatango.pm.IdleTimeManager.prototype.restartIdleTimer_ = function() {
  if (this.idleTimerId_ != -1) {
    goog.Timer.clear(this.idleTimerId_);
  }
  this.idleTimerId_ = goog.Timer.callOnce(this.onUserIdle, chatango.pm.IdleTimeManager.IDLE_INTERVAL, this);
};
chatango.pm.IdleTimeManager.prototype.onUserAction = function(opt_e) {
  if (!this.userIsActive_) {
    this.userIsActive_ = true;
    if (this.pmConnection_) {
      this.pmConnection_.send("idle:1");
    }
  }
  this.restartIdleTimer_();
};
chatango.pm.IdleTimeManager.prototype.onUserIdle = function(e) {
  this.userIsActive_ = false;
  if (this.pmConnection_) {
    this.pmConnection_.send("idle:0");
  }
};
chatango.pm.IdleTimeManager.prototype.dispose = function() {
  goog.events.unlisten(document.body, this.events_, this.onUserAction, false, this);
  if (this.idleTimerId_ != -1) {
    goog.Timer.clear(this.idleTimerId_);
  }
};
goog.provide("chatango.pm.PmConnectionUI");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.strings.PmStrings");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.module.ModuleManager");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.PmConnectionUI = function(opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.wasConnected_ = false;
  this.numConnectAttempts_ = 0;
  this.displayState_ = null;
  this.active_ = true;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
};
goog.inherits(chatango.pm.PmConnectionUI, goog.ui.Component);
chatango.pm.PmConnectionUI.prototype.connection_ = null;
chatango.pm.PmConnectionUI.state = {connect:"CONNECT", reconnect:"RECONNECT", unable:"UNABLE"};
chatango.pm.PmConnectionUI.prototype.logger = goog.debug.Logger.getLogger("chatango.pm.PmConnectionUI");
chatango.pm.PmConnectionUI.prototype.createDom = function(opt_domHelper) {
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
  this.connectBtn_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("pm", "reconnect"));
  this.connectBtn_.render(this.reconnectBtnWrapperEl_);
  goog.style.setStyle(this.connectBtn_.getElement(), "margin-top", "1em");
  goog.style.setStyle(this.connectBtn_.getElement(), "display", "inline-block");
  goog.events.listen(this.connectBtn_, goog.ui.Component.EventType.ACTION, this.connect, false, this);
  this.domCreated_ = true;
  this.draw_();
};
chatango.pm.PmConnectionUI.prototype.startWaitingAnimation_ = function() {
  chatango.managers.WaitingAnimation.getInstance().startWaiting("pm_connecting");
};
chatango.pm.PmConnectionUI.prototype.setActive = function(bool) {
  this.active_ = bool;
};
chatango.pm.PmConnectionUI.prototype.stopWaitingAnimation_ = function() {
  chatango.managers.WaitingAnimation.getInstance().stopWaiting("pm_connecting");
};
chatango.pm.PmConnectionUI.prototype.connectionFail = function(e) {
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
          this.displayState_ = chatango.pm.PmConnectionUI.state.connect;
          break;
        }
      ;
      case 1:
      ;
      case 2:
        this.displayState_ = chatango.pm.PmConnectionUI.state.reconnect;
        break;
      case 3:
        this.displayState_ = chatango.pm.PmConnectionUI.state.unable;
        break;
    }
    this.draw_();
  }
};
chatango.pm.PmConnectionUI.prototype.connecting = function(opt_e) {
  if (this.active_) {
    this.startWaitingAnimation_();
    if (this.displayState_ != null) {
      this.displayState_ = null;
      this.draw_();
    }
  }
};
chatango.pm.PmConnectionUI.prototype.draw_ = function() {
  if (!this.domCreated_ == true) {
    return;
  }
  switch(this.displayState_) {
    case chatango.pm.PmConnectionUI.state.connect:
      goog.style.setStyle(this.element_, "display", "block");
      goog.style.setStyle(this.coverEl_, "display", "none");
      this.setButtonCopy_(this.lm_.getString("pm", "click_to_connect"));
      this.setMessageCopy_("");
      goog.style.setStyle(this.connectBtn_.getElement(), "float", "none");
      break;
    case chatango.pm.PmConnectionUI.state.reconnect:
      goog.style.setStyle(this.element_, "display", "block");
      goog.style.setStyle(this.coverEl_, "display", "block");
      goog.style.setStyle(this.connectBtn_.getElement(), "float", "right");
      this.setButtonCopy_(this.lm_.getString("pm", "reconnect"));
      this.setMessageCopy_(this.lm_.getString("pm", "cant_connect"));
      break;
    case chatango.pm.PmConnectionUI.state.unable:
      goog.style.setStyle(this.element_, "display", "block");
      goog.style.setStyle(this.coverEl_, "display", "block");
      this.setButtonCopy_("");
      this.setMessageCopy_(this.lm_.getString("pm", "cant_connect2"));
      break;
    default:
      goog.style.setStyle(this.element_, "display", "none");
      goog.style.setStyle(this.coverEl_, "display", "none");
  }
};
chatango.pm.PmConnectionUI.prototype.setMessageCopy_ = function(copy) {
  goog.dom.setTextContent(this.reconnectCopyEl_, copy);
  goog.style.setStyle(this.reconnectCopyEl_, "white-space", "nowrap");
  this.width = this.reconnectCopyEl_.offsetWidth;
  goog.style.setStyle(this.reconnectCopyEl_, "white-space", "normal");
};
chatango.pm.PmConnectionUI.prototype.setButtonCopy_ = function(copy) {
  if (copy != "") {
    goog.style.setStyle(this.connectBtn_.getElement(), "display", "inline-block");
    this.connectBtn_.setContent(copy);
  } else {
    goog.style.setStyle(this.connectBtn_.getElement(), "display", "none");
  }
};
chatango.pm.PmConnectionUI.prototype.setConnectionListener = function(con) {
  this.connection_ = con;
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.connectionFail, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.CMD_NOT_SENT, this.connectionFail, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.FAILED_TO_CONNECT, this.connectionFail, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.CONNECTED, this.connected, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.PRECONNECTING, this.connecting, false, this);
  goog.events.listen(this.connection_, chatango.networking.ConnectionStatusEvent.EventType.CONNECTING, this.connecting, false, this);
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
chatango.pm.PmConnectionUI.prototype.connected = function(e) {
  this.wasConnected_ = true;
  if (this.active_) {
    this.stopWaitingAnimation_();
    if (this.displayState_ != null) {
      this.displayState_ = null;
      this.draw_();
    }
  }
};
chatango.pm.PmConnectionUI.prototype.connect = function(opt_event) {
  this.connection_.connect();
  this.numConnectAttempts_++;
  this.displayState_ = null;
  this.draw_();
};
goog.provide("chatango.pm.PmMessage");
goog.require("chatango.audio.AudioController");
goog.require("chatango.config.Config");
goog.require("chatango.events.OpenPmEvent");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.DateManagerEvent");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.Style");
goog.require("chatango.messagedata.PrivateMsgFormatter");
goog.require("chatango.output.Message");
goog.require("chatango.ui.Thumbnail");
goog.require("chatango.ui.Youtube");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.Paths");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.fx.Animation");
goog.require("goog.ui.Component");
chatango.pm.PmMessage.REFERRER_ID = null;
chatango.pm.PmMessage = function(message, managers, opt_showDate, isHistory) {
  chatango.output.Message.call(this);
  this.messageData_ = message;
  this.msgDate_ = this.messageData_.getDate();
  this.managers_ = managers;
  this.showDate_ = opt_showDate != null && opt_showDate != undefined ? opt_showDate : false;
  this.isHistory_ = isHistory != null && isHistory != undefined ? isHistory : false;
  this.dm_ = chatango.managers.DateManager.getInstance();
  var userReferrerId = chatango.pm.PmMessage.REFERRER_ID;
  this.messageAuthor_ = chatango.users.UserManager.getInstance().addUser(userReferrerId, this.messageData_.getUid(), this.messageData_.getUserType(), undefined, true);
  this.handler = new goog.events.EventHandler(this);
  this.thumbEvents_ = [chatango.ui.Thumbnail.EventType.THUMBNAIL_LOADED, chatango.ui.Youtube.EventType.THUMBNAIL_LOADED];
  this.handler.listen(this, this.thumbEvents_, this.onThumbnailLoaded_);
};
goog.inherits(chatango.pm.PmMessage, chatango.output.Message);
chatango.pm.PmMessage.prototype.createDom = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  var str = "";
  var date_format = "msg_date_format_" + (this.dateMode_ === chatango.output.Message.DateMode.TIMEONLY ? "short" : "long");
  if (this.showDate_) {
    if (this.dm_.stringLoaded) {
      str = this.dm_.dateToString(this.msgDate_, lm.getString("pm", date_format));
    } else {
      this.dm_.addEventListener(chatango.managers.DateManagerEvent.EventType.DATE_STRS_LOADED, this.renderDate, false, this);
    }
  }
  this.date_ = goog.dom.createDom("span", {"class":"msg-date"}, str);
  if (this.dateMode_ === chatango.output.Message.DateMode.NONE) {
    goog.style.showElement(this.date_, false);
  }
  var styledTextAllowed = true;
  var username;
  switch(this.messageAuthor_.getType()) {
    case chatango.users.User.UserType.ANON:
    ;
    case chatango.users.User.UserType.TEMP:
      username = goog.dom.createDom("span", {"class":"c_username"}, this.messageAuthor_.getName());
      break;
    case chatango.users.User.UserType.SELLER:
      var nm = this.messageData_.getName();
      if (nm.indexOf("_") != -1) {
        nm = nm.split("_").join("");
      }
      username = goog.dom.createDom("span", {"class":"c_username"}, nm);
      this.handler.listen(username, "click", this.onThumbnailClick_);
      var color = this.messageData_.getUsernameColor();
      if (color && styledTextAllowed) {
        username.style.color = color;
      }
      break;
  }
  var beforeMsg = goog.dom.createDom("span", {"class":"msg-before"}, [username, this.date_]);
  var content = goog.dom.createDom("div");
  var formatter = new chatango.messagedata.PrivateMsgFormatter(this.messageData_, this.messageAuthor_.isOwner(), content, this, this.managers_);
  formatter.processMessage();
  var paragraphs = goog.dom.getElementsByTagNameAndClass("p", undefined, content);
  if (paragraphs.length > 0) {
    goog.dom.insertChildAt(paragraphs[0], beforeMsg, 0);
  }
  this.bg_ = goog.dom.createDom("div", {"class":"msg-bg"});
  this.fg_ = goog.dom.createDom("div", {"class":"msg-fg"});
  if (this.messageAuthor_.getType() == chatango.users.User.UserType.SELLER) {
    goog.dom.append(this.fg_, this.photo_);
  }
  goog.dom.append(this.fg_, content);
  var className = "msg";
  if (this.isHistory_) {
    className += " history-msg";
  } else {
    if (!this.messageData_.isOnlineMessage()) {
      className += " off-msg";
    }
  }
  this.container_ = goog.dom.createDom("div", {"class":className}, [this.bg_, this.fg_]);
  if (styledTextAllowed && this.hasBg_()) {
    this.messageAuthor_.drawBg(this.bg_);
  }
  this.setElementInternal(this.container_);
};
chatango.pm.PmMessage.prototype.onBgResize_ = function(e) {
  if (this.hasBg_()) {
    this.messageAuthor_.drawBg(this.bg_);
  }
};
chatango.pm.PmMessage.prototype.hasBg_ = function() {
  var hasBg = this.messageAuthor_.isRegistered() && this.messageData_.hasBg() && (this.messageData_.isPremium() || this.messageAuthor_.isOwner());
  return hasBg;
};
chatango.pm.PmMessage.prototype.messageData_ = null;
chatango.pm.PmMessage.prototype.setMessageId = function(id) {
  this.messageData_.setId(id);
};
chatango.pm.PmMessage.prototype.getUser = function() {
  return this.messageAuthor_;
};
chatango.pm.PmMessage.prototype.renderDate = function(event) {
  var lm = chatango.managers.LanguageManager.getInstance();
  var date_format = "msg_date_format_" + (this.dateMode_ === chatango.output.Message.DateMode.TIMEONLY) ? "short" : "long";
  var s = this.dm_.dateToString(this.msgDate_, lm.getString("pm", date_format));
  goog.dom.setTextContent(this.date_, s);
};
chatango.pm.PmMessage.prototype.disposeInternal = function() {
  chatango.pm.PmMessage.superClass_.disposeInternal.call(this);
  var child;
  while (this.getChildCount() > 0) {
    child = this.removeChildAt(0, true);
    goog.dispose(child);
  }
  child = null;
  goog.dispose(this.handler);
};
goog.provide("chatango.output.PmOutputWindow");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.messagedata.SystemMessageData");
goog.require("chatango.output.OutputWindow");
goog.require("chatango.pm.PmMessage");
goog.require("chatango.pm.SystemMessage");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.output.PmOutputWindow = function() {
  var managers = chatango.managers.ManagerManager.getInstance();
  chatango.output.OutputWindow.call(this, managers);
};
goog.inherits(chatango.output.PmOutputWindow, chatango.output.OutputWindow);
chatango.output.PmOutputWindow.prototype.getSystemMessage = function(messageData, opt_position) {
  return new chatango.pm.SystemMessage(messageData);
};
chatango.output.PmOutputWindow.prototype.getPrivateMessage = function(messageData, opt_position, isHistory) {
  return new chatango.pm.PmMessage(messageData, this.managers_, true, isHistory);
};
chatango.output.PmOutputWindow.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.ui.icons.SvgBlockIcon");
goog.require("chatango.ui.icons.SvgIcon");
goog.require("goog.ui.Component");
goog.require("goog.dom.classes");
chatango.ui.icons.SvgBlockIcon = function(opt_color, opt_domHelper) {
  goog.base(this, opt_color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.SvgBlockIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgBlockIcon.prototype.createDom = function() {
  goog.base(this, "createDom");
  goog.dom.classes.add(this.element_, "block-icon");
  goog.style.setStyle(this.element_, "top", null);
};
chatango.ui.icons.SvgBlockIcon.prototype.draw = function() {
  this.element_.innerHTML = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 100 100">' + "<defs></defs>" + '<g style="display: block;">' + '<circle cx="50" cy="50" r="43" fill="none" stroke="' + this.color_ + '" stroke-width="12px"/>' + '<rect x="6" y="45" width="90" height="12" fill="' + this.color_ + '" transform="rotate(-45 50 50)" />' + "</g>" + "</svg>";
  goog.events.listen(this.element_, goog.events.EventType.CLICK, this.onClick_, false, this);
};
chatango.ui.icons.SvgBlockIcon.prototype.onClick_ = function(e) {
  this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};
goog.provide("chatango.ui.buttons.PmBlockButton");
goog.require("chatango.ui.buttons.FlatButtonRenderer");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.ui.icons.SvgBlockIcon");
chatango.ui.buttons.PmBlockButton = function(opt_renderer, opt_domHelper) {
  goog.ui.Button.call(this, null, opt_renderer || chatango.ui.buttons.FlatButtonRenderer.getInstance(), opt_domHelper);
  this.setImportant(true);
};
goog.inherits(chatango.ui.buttons.PmBlockButton, chatango.ui.buttons.Button);
chatango.ui.buttons.PmBlockButton.prototype.createDom = function() {
  chatango.ui.buttons.PmBlockButton.superClass_.createDom.call(this);
  this.blockIcon_ = new chatango.ui.icons.SvgBlockIcon("#FFF");
  this.blockIcon_.render(this.getContentElement());
};
goog.provide("chatango.pm.PmChatViewHeader");
goog.require("chatango.events.EventType");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.ui.buttons.PmBlockButton");
goog.require("chatango.ui.ScrollPane");
goog.require("chatango.users.BaseProfile");
goog.require("chatango.users.User");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.PmChatViewHeader = function(user, isBlocked, isFriend, initiated) {
  chatango.users.BaseProfile.call(this, user, true);
  this.blocked_ = isBlocked;
  this.friend_ = isFriend;
  this.isInitiator_ = initiated;
  this.lastUserProfileHtml_ = null;
  this.blockBtn_ = new chatango.ui.buttons.PmBlockButton;
  goog.events.listen(this.blockBtn_, goog.ui.Component.EventType.ACTION, this.onBlockBtnClicked, true, this);
  this.addFriendBtn_ = new chatango.ui.buttons.Button(" ");
  goog.events.listen(this.addFriendBtn_, goog.ui.Component.EventType.ACTION, this.onFriendBtnClicked, true, this);
};
goog.inherits(chatango.pm.PmChatViewHeader, chatango.users.BaseProfile);
chatango.pm.PmChatViewHeader.prototype.createDom = function() {
  goog.base(this, "createDom");
  this.actionEvents_ = chatango.managers.Environment.getInstance().isDesktop() ? [goog.events.EventType.CLICK] : [goog.events.EventType.TOUCHSTART, goog.events.EventType.TOUCHEND];
  goog.events.listen(this.thumbEl_, this.actionEvents_, this.onThumbClicked_, false, this);
  this.scrollPane_ = new chatango.ui.ScrollPane(null, true);
  this.scrollPane_.render(this.element_);
  this.btnWrap_ = goog.dom.createDom("div", {"class":"add-block-wrap"});
  goog.dom.insertChildAt(this.contentWrapperEl_, this.btnWrap_, 0);
  this.addFriendBtn_.render(this.btnWrap_);
  this.blockBtn_.render(this.btnWrap_);
  this.draw();
};
chatango.pm.PmChatViewHeader.prototype.onProfileLoaded_ = function(e) {
  goog.base(this, "onProfileLoaded_");
  this.draw();
};
chatango.pm.PmChatViewHeader.prototype.onThumbClicked_ = function(e) {
  if (!chatango.managers.Environment.getInstance().isAndroidApp()) {
    return;
  }
  if (e.type == goog.events.EventType.TOUCHSTART) {
    this.lastTouchX_ = e.clientX;
    this.lastTouchY_ = e.clientY;
    return;
  } else {
    if (e.type == goog.events.EventType.TOUCHEND) {
      var diffX = Math.abs(e.clientX - this.lastTouchX_);
      var diffY = Math.abs(e.clientY - this.lastTouchY_);
      var swipeThreshold = 15;
      var scrollThreshold = 10;
      if (diffX > swipeThreshold || diffY > scrollThreshold) {
        return;
      }
    }
  }
  this.user_.openAppProfile();
};
chatango.pm.PmChatViewHeader.prototype.draw = function() {
  if (!this.element_) {
    return;
  }
  if (!this.friend_) {
    goog.style.setInlineBlock(this.addFriendBtn_.getElement());
  } else {
    goog.style.showElement(this.addFriendBtn_.getElement(), false);
  }
  if (!this.friend_ && this.isInitiator_) {
    goog.style.setInlineBlock(this.blockBtn_.getElement());
  } else {
    goog.style.showElement(this.blockBtn_.getElement(), false);
  }
  this.updateCopy();
  if (goog.style.getSize(this.contentWrapperEl_).height > goog.style.getSize(this.element_).height) {
    goog.style.showElement(this.scrollPane_.getElement(), true);
    goog.dom.append(this.scrollPane_.getContentElement(), this.contentWrapperEl_);
    this.scrollPane_.setHeight(goog.style.getSize(this.element_).height - 1);
    this.scrollPane_.draw();
  } else {
    goog.style.showElement(this.scrollPane_.getElement(), false);
    goog.dom.insertChildAt(this.element_, this.contentWrapperEl_, 0);
  }
};
chatango.pm.PmChatViewHeader.prototype.updateCopy = function() {
  if (!this.element_) {
    return;
  }
  var lm = chatango.managers.LanguageManager.getInstance();
  this.addFriendBtn_.setContent(lm.getString("pm", "add"));
  var aslStr = "<b>" + this.user_.getName() + "</b>";
  if (this.user_.isBasicProfileLoaded()) {
    var aslString = this.user_.getAslString();
    if (aslString != "") {
      aslStr += ", " + aslString;
    }
    var userProfileHtml = this.user_.getProfileHtml();
    if (userProfileHtml !== this.lastUserProfileHtml_) {
      this.aboutEl_.innerHTML = chatango.utils.sanitize.sanitize(userProfileHtml);
      this.lastUserProfileHtml_ = userProfileHtml;
    }
    if (this.user_.premiumExpiration_) {
      this.user_.drawProfileBg(this.element_);
    }
  }
  this.aslEl_.innerHTML = aslStr;
};
chatango.pm.PmChatViewHeader.prototype.onBlockBtnClicked = function(e) {
  goog.module.ModuleManager.getInstance().execOnLoad("PmExtrasModule", function() {
    var blockDialog = this.getPmExtrasModule_().openBlockDialog(this.blockBtn_.getElement(), this.user_, this.blocked_);
    goog.events.listen(blockDialog, chatango.events.EventType.BLOCK_USER, this.onBlock_, false, this);
  }, this);
};
chatango.pm.PmChatViewHeader.prototype.onFriendBtnClicked = function(e) {
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    if (this.isInitiator_) {
      window["ga"]("send", "event", "PM", "Recipient added friend");
    } else {
      window["ga"]("send", "event", "PM", "Initiator added friend");
    }
  }
  var e = new goog.events.Event(chatango.events.EventType.ADD_FRIEND);
  this.updateStatus(this.blocked_, true);
  this.dispatchEvent(e, this);
};
chatango.pm.PmChatViewHeader.prototype.onBlock_ = function(e) {
  e.target.handleBlur();
  this.updateStatus(!this.blocked_, this.friend_);
  e.data = this.blocked_;
  this.dispatchEvent(e, this);
};
chatango.pm.PmChatViewHeader.prototype.updateStatus = function(isBlocked, isFriend) {
  this.blocked_ = isBlocked;
  this.friend_ = isFriend;
  this.draw();
};
chatango.pm.PmChatViewHeader.prototype.getPmExtrasModule_ = function() {
  if (typeof this.pmExtrasModule_ === "undefined") {
    this.pmExtrasModule_ = new chatango.modules.PmExtrasModule;
  }
  return this.pmExtrasModule_;
};
chatango.pm.PmChatViewHeader.prototype.disposeInternal = function() {
  if (this.addFriendBtn_) {
    goog.events.unlisten(this.addFriendBtn_, goog.ui.Component.EventType.ACTION, this.onFriendBtnClicked, true, this);
    this.addFriendBtn_.dispose();
    this.addFriendBtn_ = null;
  }
  if (this.blockBtn_) {
    goog.events.unlisten(this.blockBtn_, goog.ui.Component.EventType.ACTION, this.onBlockBtnClicked, true, this);
    this.blockBtn_.dispose();
    this.blockBtn_ = null;
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.PmChatViewInput");
goog.require("chatango.input.Input");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.PmChatViewInput = function(userName) {
  chatango.input.Input.call(this, "input_" + userName);
  this.userName_ = userName;
};
goog.inherits(chatango.pm.PmChatViewInput, chatango.input.Input);
chatango.pm.PmChatViewInput.prototype.updateCopy = function() {
};
chatango.pm.PmChatViewInput.prototype.createDom = function() {
  chatango.pm.PmChatViewInput.superClass_.createDom.call(this);
  goog.dom.classes.add(this.inputEl_, "bb");
  goog.dom.classes.remove(this.inputEl_, "ubdr");
  this.updatePlaceholderCSS_();
};
chatango.pm.PmChatViewInput.prototype.setEnabled = function(enabled) {
  if (typeof enabled === "undefined") {
    enabled = true;
  }
  if (enabled) {
    this.inputEl_.disabled = false;
    var lm = chatango.managers.LanguageManager.getInstance();
    var emInPx = chatango.managers.ScaleManager.getInstance().getScale() / 100 * 16;
    var isWide = this.inputEl_.offsetWidth > 30 * emInPx;
    if (isWide) {
      this.setPlaceholderCopy(lm.getString("pm", "type_here_long").split("*user*").join(this.userName_));
    } else {
      this.setPlaceholderCopy(lm.getString("pm", "type_here_short").split("*user*").join(this.userName_));
    }
  } else {
    this.inputEl_.disabled = true;
    this.setPlaceholderCopy("");
  }
};
chatango.pm.PmChatViewInput.prototype.setHeight = function(cssHeightValue) {
  this.inputEl_.style.height = cssHeightValue;
};
goog.provide("chatango.pm.PmChatView");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.messagedata.SystemMessageData");
goog.require("chatango.output.PmOutputWindow");
goog.require("chatango.pm.PmChatViewHeader");
goog.require("chatango.pm.PmChatViewInput");
goog.require("chatango.users.User");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.PmChatView = function(user, isBlocked, isFriend, initiated) {
  goog.ui.Component.call(this);
  this.otherUser_ = user;
  this.handler = new goog.events.EventHandler(this);
  this.header_ = new chatango.pm.PmChatViewHeader(this.otherUser_, isBlocked, isFriend, initiated);
  this.output_ = new chatango.output.PmOutputWindow;
  this.input_ = new chatango.pm.PmChatViewInput(this.otherUser_.getName());
  goog.events.listen(this.input_, [chatango.input.Input.EventType.MESSAGE_INPUT, chatango.input.Input.EventType.FOCUS], this.relayEvent, false, this);
  goog.events.listen(this.header_, [chatango.events.EventType.BLOCK_USER, chatango.events.EventType.ADD_FRIEND], this.relayEvent, false, this);
  this.targetHeight_ = 50;
};
goog.inherits(chatango.pm.PmChatView, goog.ui.Component);
chatango.pm.PmChatView.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"pm-chat"});
  this.header_.render(this.element_);
  this.output_.render(this.element_);
  this.input_.render(this.element_);
  this.input_.setEnabled(true);
  this.updateCopy();
};
chatango.pm.PmChatView.prototype.setHeight = function(h) {
  this.targetHeight_ = h;
  this.draw();
};
chatango.pm.PmChatView.prototype.draw = function() {
  var isMobile = chatango.managers.Environment.getInstance().isMobile();
  var isTablet = chatango.managers.Environment.getInstance().isTablet();
  var isDesktop = chatango.managers.Environment.getInstance().isDesktop();
  if (chatango.managers.Keyboard.getInstance().isRaised() && (isMobile || isTablet)) {
    this.output_.setLockBottom(true);
    goog.style.showElement(this.header_.getElement(), false);
  } else {
    this.output_.alignMessages();
    goog.style.showElement(this.header_.getElement(), true);
  }
  this.element_.style.height = this.targetHeight_ + "px";
  var headerHeight = this.header_.getElement().offsetHeight;
  if (isDesktop) {
    var inputH = Math.max(30, Math.min(200, Math.round((this.targetHeight_ - headerHeight) * .28)));
    this.input_.setHeight(inputH + "px");
  }
  var totalOffset = headerHeight + this.input_.getElement().offsetHeight;
  this.output_.setHeight(this.targetHeight_ - totalOffset);
};
chatango.pm.PmChatView.prototype.addMessage = function(msgData) {
  this.output_.addMessage(msgData);
};
chatango.pm.PmChatView.prototype.updateCopy = function() {
};
chatango.pm.PmChatView.prototype.updatePosted = function(isBlocked, isFriend) {
  this.header_.updateStatus(isBlocked, isFriend);
};
chatango.pm.PmChatView.prototype.relayEvent = function(e) {
  this.dispatchEvent(e);
};
chatango.pm.PmChatView.prototype.blurInput = function() {
  this.input_.blur();
};
chatango.pm.PmChatView.prototype.disposeInternal = function() {
  this.otherUser_ = null;
  if (this.header_) {
    this.header_.dispose();
  }
  this.header_ = null;
  if (this.output_) {
    this.output_.dispose();
  }
  this.output_ = null;
  goog.events.unlisten(this.input_, chatango.input.Input.EventType.MESSAGE_INPUT, this.relayEvent, false, this);
  if (this.input_) {
    this.input_.dispose();
  }
  this.input_ = null;
  goog.base(this, "disposeInternal");
  this.handler.dispose();
};
goog.provide("chatango.pm.PmHistoryManager");
goog.require("chatango.users.UserManager");
chatango.pm.PmHistoryManager = function() {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  this.lsKey_ = cUser.getSid().toLowerCase() + "_history";
  this.sortFn_ = function(a, b) {
    return a.localeCompare(b);
  };
};
chatango.pm.PmHistoryManager.MAX_STORED_MSGS = 50;
chatango.pm.PmHistoryManager.prototype.setItem = function(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};
chatango.pm.PmHistoryManager.prototype.getItem = function(key) {
  var value = localStorage.getItem(key);
  return value && JSON.parse(value);
};
chatango.pm.PmHistoryManager.prototype.updateHistory = function(participants, msgData, opt_unread) {
  var userHistory = this.getHistory(participants);
  userHistory.push({"data":msgData, "unread":opt_unread ? true : false});
  if (userHistory.length > chatango.pm.PmHistoryManager.MAX_STORED_MSGS) {
    userHistory.splice(0, 1);
  }
  this.setHistory(participants, userHistory);
};
chatango.pm.PmHistoryManager.prototype.getHistory = function(participants) {
  var participantsKey = participants.sort(this.sortFn_).join("_");
  var userHistory = this.getItem(this.lsKey_ + "-" + participantsKey);
  if (userHistory) {
    for (var i = 0;i < userHistory.length;i++) {
      if (typeof userHistory[i] !== "object") {
        userHistory[i] = {"data":userHistory[i], "unread":false};
      }
    }
    return userHistory || [];
  } else {
    return[];
  }
};
chatango.pm.PmHistoryManager.prototype.setHistory = function(participants, history) {
  var pKey = participants.sort(this.sortFn_).join("_");
  this.setItem(this.lsKey_ + "-" + pKey, history);
};
chatango.pm.PmHistoryManager.prototype.getUnread = function(participants) {
  var history = this.getHistory(participants);
  var unread = 0;
  for (var i = 0;i < history.length;i++) {
    if (history[i]["unread"]) {
      unread++;
    }
  }
  return unread;
};
chatango.pm.PmHistoryManager.prototype.readAll = function(participants) {
  var oldHistory = this.getHistory(participants);
  var newHistory = [];
  for (var i = 0;i < oldHistory.length;i++) {
    newHistory.push({"data":oldHistory[i].data, "unread":false});
  }
  this.setHistory(participants, newHistory);
};
goog.provide("chatango.pm.PmChat");
goog.require("chatango.events.EventType");
goog.require("chatango.input.Input.MessageInputEvent");
goog.require("chatango.managers.Environment");
goog.require("chatango.messagedata.PrivateMessageData");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.networking.PmConnection");
goog.require("chatango.pm.PmChatView");
goog.require("chatango.pm.PmHistoryManager");
goog.require("chatango.pm.PmMessage");
goog.require("chatango.pm.SystemMessage");
goog.require("chatango.smileys.SmileyManager");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.formatting");
goog.require("goog.events");
goog.require("goog.string");
chatango.pm.PmChat = function(chatId, user, targetUsers, pmConnection, opt_fromUrl, opt_renderMessages, initiator) {
  goog.events.EventTarget.call(this);
  this.fromUrl_ = opt_fromUrl;
  this.chatId_ = chatId;
  this.user_ = user;
  this.otherUser_ = targetUsers[0];
  this.participants_ = [this.user_, targetUsers[0]];
  this.initiator = initiator;
  this.pmConnection_ = pmConnection;
  this.isFriend_ = false;
  this.isBlocked_ = false;
  this.renderMessages_ = opt_renderMessages ? opt_renderMessages : true;
  this.unrenderedMessages_ = [];
  this.chatView_ = new chatango.pm.PmChatView(this.otherUser_, this.isBlocked_, this.isFriend_, this.initiator == this.otherUser_);
  this.historyManager_ = null;
  this.getName_ = function(u) {
    if (u.isAnon()) {
      return "";
    }
    return u.getSid();
  };
  goog.events.listen(this.chatView_, chatango.input.Input.EventType.MESSAGE_INPUT, this.onInputMessage_, false, this);
  goog.events.listen(this.chatView_, chatango.events.EventType.BLOCK_USER, this.onBlockUser_, false, this);
  goog.events.listen(this.chatView_, chatango.events.EventType.ADD_FRIEND, this.onAddFriend_, false, this);
  if (!this.otherUser_.isAnon()) {
    this.historyManager_ = new chatango.pm.PmHistoryManager;
    this.getHistoryMessages();
  }
};
goog.inherits(chatango.pm.PmChat, goog.events.EventTarget);
chatango.pm.PmChat.MAX_MSG_LENGTH = 9E3;
chatango.pm.PmChat.prototype.setFriend = function(isFriend) {
  this.isFriend_ = isFriend;
  this.chatView_.updatePosted(this.isBlocked_, this.isFriend_);
};
chatango.pm.PmChat.prototype.setBlocked = function(isBlocked) {
  this.isBlocked_ = isBlocked;
  this.chatView_.updatePosted(this.isBlocked_, this.isFriend_);
};
chatango.pm.PmChat.prototype.addSystemMessage = function(sysMsgData) {
  if (!this.chatView_.isInDocument()) {
    this.renderMessages_ = false;
  }
  if (this.renderMessages_) {
    this.chatView_.addMessage(sysMsgData);
  } else {
    this.unrenderedMessages_.push(sysMsgData);
  }
};
chatango.pm.PmChat.prototype.addPrivateMessage = function(msgData) {
  if (!this.chatView_.isInDocument()) {
    this.renderMessages_ = false;
  }
  if (this.renderMessages_) {
    this.chatView_.addMessage(msgData);
  } else {
    this.unrenderedMessages_.push(msgData);
  }
};
chatango.pm.PmChat.prototype.getHistoryMessages = function() {
  var participantNames = this.participants_.map(this.getName_);
  var chatHistory = this.historyManager_.getHistory(participantNames);
  var pmData, historyLen = chatHistory.length;
  for (var i = 0;i < historyLen;i++) {
    var msg = chatHistory[i];
    try {
      pmData = new chatango.messagedata.PrivateMessageData(msg["data"], !msg["unread"]);
      this.chatView_.addMessage(pmData);
    } catch (e) {
    }
  }
};
chatango.pm.PmChat.prototype.getChatView = function() {
  return this.chatView_;
};
chatango.pm.PmChat.prototype.getOtherUser = function() {
  return this.otherUser_;
};
chatango.pm.PmChat.prototype.renderStoredMessages = function() {
  if (!this.chatView_.isInDocument()) {
    this.renderMessages_ = false;
    return;
  }
  this.renderMessages_ = true;
  var msg = null;
  while (this.unrenderedMessages_.length > 0) {
    msg = this.unrenderedMessages_.shift();
    this.chatView_.addMessage(msg);
  }
};
chatango.pm.PmChat.prototype.onInputMessage_ = function(e) {
  this.sendMessage(e.message);
};
chatango.pm.PmChat.prototype.formatForSending_ = function(msgStr) {
  var imgRegex = chatango.utils.formatting.IMG_HREF_REGEX_GREEDY;
  var ytRegex = chatango.utils.formatting.YOUTUBE_HREF_GRP_REGEX_GREEDY;
  msgStr = msgStr.replace(imgRegex, function(match) {
    return'<i s="' + match + '" />';
  });
  msgStr = msgStr.replace(ytRegex, function(match, p1) {
    return'<i s="vid://yt:' + p1 + '" w="126" h="93"/>';
  });
  var smileyManager = chatango.smileys.SmileyManager.getInstance();
  var smileyRegEx;
  if (this.user_.isProbablyPremium()) {
    smileyRegEx = smileyManager.allSmileysRegExpGreedy;
  } else {
    smileyRegEx = smileyManager.basicSmileysRegExpGreedy;
  }
  var smileySize = chatango.smileys.SmileyManager.DEFAULT_PM_SMILEY_SIZE;
  var smileyPmCode, w, h, smileyInfo;
  msgStr = msgStr.replace(smileyRegEx, function(match, p1) {
    smileyInfo = smileyManager.allSmileyInfo[p1];
    smileyPmCode = smileyInfo["pm"];
    var baseW = smileyInfo["w"] != undefined ? smileyInfo["w"] : 1;
    var baseH = smileyInfo["h"] != undefined ? smileyInfo["h"] : 1;
    w = Math.round(smileySize * baseW * 100) / 100;
    h = Math.round(smileySize * baseH * 100) / 100;
    return'<i s="sm://' + smileyPmCode + '" w="' + w + '" h="' + h + '"/>';
  });
  return'<m v="1">' + msgStr + "</m>";
};
chatango.pm.PmChat.prototype.sendMessage = function(msgStr) {
  if (this.otherUser_.getSid() == "chatango") {
    if (chatango.DEBUG) {
      console.log("TODO: send system msg - no messages to Chatango");
    }
    return;
  }
  if (!this.pmConnection_.isConnected() || this.pmConnection_.getStatus() != chatango.networking.ConnectionStatusEvent.EventType.CONNECTED) {
    this.dispatchEvent(chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED);
    return;
  }
  this.otherUser_.setLastInteracted((new Date).getTime());
  var serverTime = chatango.managers.ServerTime.getInstance().getServerTime() / 1E3;
  var useBg = false;
  var message = goog.string.htmlEscape(msgStr);
  var n_prefix = "";
  if (/\n/.test(message)) {
    message = message.replace(/\n/g, "</P><P>");
    message = "<P>" + message + "</P>";
  }
  if (message.length > chatango.pm.PmChat.MAX_MSG_LENGTH) {
    if (chatango.DEBUG) {
      console.log("Inputted Message is too long: TODO bring up warning pop up");
    }
    return;
  }
  message = this.formatForSending_(message);
  var data = ["msg", this.chatId_, n_prefix + message].join(":");
  this.pmConnection_.send(data);
  var flags = 0;
  var localMsgString = ["msg", this.user_.getSid(), this.user_.getSid(), "unknown", serverTime, flags, n_prefix + '<m v="1">' + message + "</m>"].join(":");
  var md = new chatango.messagedata.PrivateMessageData(localMsgString);
  this.addPrivateMessage(md);
  if (this.historyManager_) {
    this.historyManager_.updateHistory(this.participants_.map(this.getName_), localMsgString);
  }
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    window["ga"]("send", "event", "PM", "Message", "Android App");
  }
  if (chatango.managers.Environment.getInstance().isIOS()) {
    window["ga"]("send", "event", "PM", "Message", "iOS");
  }
  if (chatango.managers.Environment.getInstance().isAndroid()) {
  }
};
chatango.pm.PmChat.prototype.receiveMessage = function(msgData, visible) {
  if (this.historyManager_) {
    this.historyManager_.updateHistory(this.participants_.map(this.getName_), msgData.getMsgString(), !visible);
  }
};
chatango.pm.PmChat.prototype.onBlockUser_ = function(e) {
  var sid = this.otherUser_.getSid();
  var userType = this.otherUser_.getType();
  if (e.data === true) {
    this.pmConnection_.send("block:" + sid + ":" + sid + ":" + userType);
  } else {
    this.pmConnection_.send("unblock:" + sid + ":" + sid + ":" + userType);
  }
};
chatango.pm.PmChat.prototype.onAddFriend_ = function(e) {
  var sid = this.otherUser_.getSid();
  this.pmConnection_.send("wladd:" + sid);
};
chatango.pm.PmChat.prototype.dispose = function() {
  this.fromUrl_ = null;
  this.chatId_ = null;
  this.user_ = null;
  this.otherUser_ = null;
  this.participants_.length = 0;
  this.participants_ = null;
  this.pmConnection_ = null;
  this.unrenderedMessages_ = null;
  goog.events.listen(this.chatView_, chatango.input.Input.EventType.MESSAGE_INPUT, this.onInputMessage_, false, this);
  if (this.chatView_) {
    this.chatView_.dispose();
  }
};
goog.provide("chatango.pm.PmChatManager");
goog.require("chatango.embed.AppComm");
goog.require("chatango.events.Event");
goog.require("chatango.events.EventType");
goog.require("chatango.login.Session");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.ServerTime");
goog.require("chatango.messagedata.PrivateMessageData");
goog.require("chatango.messagedata.SystemMessageData");
goog.require("chatango.networking.CommonConnectionEvent");
goog.require("chatango.networking.PmConnection");
goog.require("chatango.networking.PmConnectionEvent");
goog.require("chatango.pm.IdleTimeManager");
goog.require("chatango.pm.PmChat");
goog.require("chatango.pm.PmConnectionUI");
goog.require("chatango.pm.PmSettings");
goog.require("chatango.pm.SystemMessage");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.async.Delay");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
goog.require("goog.net.WebSocket");
goog.require("goog.net.WebSocket.MessageEvent");
chatango.pm.PmChatManager = function(session, pmSettings, context) {
  goog.events.EventTarget.call(this);
  this.pmContext_ = context;
  this.session_ = session;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.dm_ = chatango.managers.DateManager.getInstance();
  this.bd_ = new chatango.settings.servers.BaseDomain;
  this.pmConnectUI_ = new chatango.pm.PmConnectionUI;
  this.pmConnection_ = new chatango.networking.PmConnection(this.session_);
  this.pmConnectUI_.setConnectionListener(this.pmConnection_);
  this.pmSettings_ = pmSettings;
  this.currentChats_ = {};
  this.friends_ = [];
  this.connectingTimer_ = null;
  this.events_ = [chatango.networking.PmConnectionEvent.EventType.OK, chatango.networking.PmConnectionEvent.EventType.seller_name, chatango.networking.PmConnectionEvent.EventType.kickingoff, chatango.networking.PmConnectionEvent.EventType.msg, chatango.networking.PmConnectionEvent.EventType.msgoff, chatango.networking.PmConnectionEvent.EventType.connect, chatango.networking.PmConnectionEvent.EventType.track, chatango.networking.PmConnectionEvent.EventType.time, chatango.networking.PmConnectionEvent.EventType.reload_profile, 
  chatango.networking.PmConnectionEvent.EventType.block_list, chatango.networking.PmConnectionEvent.EventType.unblocked, chatango.networking.PmConnectionEvent.EventType.settings, chatango.networking.PmConnectionEvent.EventType.show_fw, chatango.networking.PmConnectionEvent.EventType.show_offline_limit, chatango.networking.PmConnectionEvent.EventType.toofast, chatango.networking.PmConnectionEvent.EventType.firstlogin, chatango.networking.PmConnectionEvent.EventType.lowversion];
  goog.events.listen(this.pmConnection_, this.events_, this.onEvent_, false, this);
};
goog.inherits(chatango.pm.PmChatManager, goog.events.EventTarget);
chatango.pm.PmChatManager.REFERRER_PREFIX = "chat_";
chatango.pm.PmChatManager.EventType = {CONNECT_FAIL:"confail", CONNECT_SUCCESS:"consuccess", SWITCH_TO_CHAT:"switchtochat", NEW_ONLINE_MESSAGE:"new_online_msg"};
chatango.pm.PmChatManager.status = {ONLINE:"online", APP_ONLINE:"app", OFFLINE:"offline"};
chatango.pm.PmChatManager.prototype.addFriend = function(uid) {
  if (this.friends_.indexOf(uid) > -1) {
    return;
  }
  this.friends_.push(uid);
  if (this.currentChats_[uid]) {
    this.currentChats_[uid].setFriend(true);
  }
};
chatango.pm.PmChatManager.prototype.removeFriend = function(uid) {
  this.friends_.splice(this.friends_.indexOf(uid), 1);
  if (this.currentChats_[uid]) {
    this.currentChats_[uid].setFriend(false);
  }
};
chatango.pm.PmChatManager.prototype.onEvent_ = function(e) {
  switch(e.type) {
    case chatango.networking.PmConnectionEvent.EventType.seller_name:
      this.session_.setSessionId(e.data[2]);
      break;
    case chatango.networking.PmConnectionEvent.EventType.msg:
    ;
    case chatango.networking.PmConnectionEvent.EventType.msgoff:
      this.onMessage(e);
      break;
    case chatango.networking.PmConnectionEvent.EventType.time:
      chatango.managers.ServerTime.getInstance().addTimeDelta(Number(e.data[1]));
      break;
    case chatango.networking.PmConnectionEvent.EventType.OK:
      this.onLoginOK_();
      break;
    case chatango.networking.PmConnectionEvent.EventType.connect:
      this.onConnectToUser_(e);
      this.pmConnection_.send("getblock");
      break;
    case chatango.networking.PmConnectionEvent.EventType.kickingoff:
      if (chatango.managers.Environment.getInstance().isAndroidApp()) {
        chatango.embed.AppComm.getInstance().alertDisconnect();
      } else {
        var url = "http://" + chatango.users.UserManager.getInstance().currentUser.getSid() + "." + this.bd_.getBaseDomain() + "/disconnected";
        window.top.location.href = url;
      }
      break;
    case chatango.networking.PmConnectionEvent.EventType.block_list:
      this.onBlockList_(e);
      break;
    case chatango.networking.PmConnectionEvent.EventType.unblocked:
      this.onUnblock_(e);
      break;
    case chatango.networking.PmConnectionEvent.EventType.track:
      this.onTrackUser_(e);
      this.pmConnection_.send("getblock");
      break;
    case chatango.networking.PmConnectionEvent.EventType.reload_profile:
      chatango.users.UserManager.getInstance().getUser(e.data[1]).loadProfile(true);
      break;
    default:
      if (chatango.DEBUG) {
        console.log("PMChatManager unhandled PM chat command: " + e.type);
      }
    ;
  }
};
chatango.pm.PmChatManager.prototype.onBlockList_ = function(e) {
  var users = e.data.slice(1);
  for (uid in this.currentChats_) {
    if (this.currentChats_.hasOwnProperty(uid)) {
      this.currentChats_[uid].setBlocked(users.indexOf(uid) > -1);
    }
  }
};
chatango.pm.PmChatManager.prototype.onUnblock_ = function(e) {
  var user = e.data.slice(1)[0];
  if (this.currentChats_.hasOwnProperty(uid)) {
    this.currentChats_[uid].setBlocked(false);
  }
};
chatango.pm.PmChatManager.prototype.connectToUser = function(usernameOrEmail, opt_checkAge) {
  if (chatango.users.UserManager.getInstance().currentUser.getName() == usernameOrEmail) {
    var ev = new chatango.events.Event(chatango.pm.PmChatManager.EventType.CONNECT_FAIL);
    ev.setString(chatango.users.UserManager.getInstance().currentUser.getName());
    this.dispatchEvent(ev);
    return;
  }
  this.pmConnection_.send("connect:" + usernameOrEmail);
  if (!this.connectingTimer_) {
    this.connectingTimer_ = new goog.async.Delay(this.openConnectingDialog_, 2E3, this);
    this.connectingTimer_.start();
  }
};
chatango.pm.PmChatManager.prototype.openConnectingDialog_ = function(e) {
  this.dispatchEvent(chatango.events.EventType.OPEN_CONN_DIALOG);
};
chatango.pm.PmChatManager.prototype.onTrackUser_ = function(e) {
  var arr = e.data;
  if (arr[3] == "nouser" || arr[3] == "invalid") {
    return;
  }
  var sid = arr[1];
  var idleMinutes = Number(arr[2]);
  var status = arr[3];
  if (status != chatango.pm.PmChatManager.status.OFFLINE && status != chatango.pm.PmChatManager.status.ONLINE && status != chatango.pm.PmChatManager.status.APP_ONLINE) {
    return;
  }
  var chatId = sid;
  var targetUser = chatango.users.UserManager.getInstance().addUser(chatango.pm.PmChatManager.REFERRER_PREFIX + chatId, sid, chatango.users.User.UserType.SELLER);
  if (!targetUser) {
    return;
  }
  targetUser.setOnline(status == chatango.pm.PmChatManager.status.ONLINE);
  targetUser.setAppOnline(status == chatango.pm.PmChatManager.status.APP_ONLINE);
  if (status == chatango.pm.PmChatManager.status.ONLINE) {
    targetUser.setLastActive((new Date).getTime() - idleMinutes * 60 * 1E3);
    targetUser.setIdle(idleMinutes > 0);
  }
  var ev = new goog.events.Event(chatango.networking.PmConnectionEvent.EventType.status);
  ev.data = arr;
  this.pmConnection_.dispatchEvent(ev);
};
chatango.pm.PmChatManager.prototype.onConnectToUser_ = function(e) {
  var arr = e.data;
  this.dispatchEvent(chatango.events.EventType.CLOSE_CONN_DIALOG);
  if (this.connectingTimer_) {
    this.connectingTimer_.stop();
    this.connectingTimer_.dispose();
  }
  this.connectingTimer_ = null;
  if ((arr[3] == "nouser" || arr[3] == "invalid") && !this.currentChats_[arr[1]]) {
    var ev = new chatango.events.Event(chatango.pm.PmChatManager.EventType.CONNECT_FAIL);
    ev.setString(arr[1]);
    this.dispatchEvent(ev);
    return;
  }
  var sid = arr[1];
  if (sid[0] == "*") {
    var ev = new chatango.events.Event(chatango.pm.PmChatManager.EventType.SWITCH_TO_CHAT);
    ev.setData(this.currentChats_[sid]);
    this.dispatchEvent(ev);
    return;
  }
  var t = Number(arr[2]);
  var status = arr[3];
  if (status != chatango.pm.PmChatManager.status.OFFLINE && status != chatango.pm.PmChatManager.status.ONLINE && status != chatango.pm.PmChatManager.status.APP_ONLINE) {
    return;
  }
  var ev = new chatango.events.Event(chatango.pm.PmChatManager.EventType.CONNECT_SUCCESS);
  ev.setString(sid);
  this.dispatchEvent(ev);
  var chatId = sid;
  var targetUser = chatango.users.UserManager.getInstance().addUser(chatango.pm.PmChatManager.REFERRER_PREFIX + chatId, sid, chatango.users.User.UserType.SELLER);
  if (!targetUser) {
    return;
  }
  var chat = this.currentChats_[chatId];
  targetUser.setOnline(status == chatango.pm.PmChatManager.status.ONLINE);
  targetUser.setAppOnline(status == chatango.pm.PmChatManager.status.APP_ONLINE);
  var timeStr = "";
  var strongCol = chatango.pm.SystemMessage.Style.SYS_CHATANGO_COL;
  var msgCol = chatango.pm.SystemMessage.Style.SYS_ON_OFF_TXT_COL;
  var nmStr = "<font color='" + strongCol + "'><b>" + targetUser.getName() + "</b></font>";
  var sysMsg = "";
  var isActive = false;
  if (targetUser.isOnline()) {
    if (Number(arr[2]) > 0) {
      var ms = parseInt(arr[2], 10) * 1E3 * 60;
      var curDate = new Date;
      var oldDate = new Date(curDate.getTime() - ms);
      timeStr = this.dm_.diffToString(oldDate, curDate, 2);
      timeStr = "<font color='#" + strongCol + "'>" + timeStr + "</font>";
    } else {
      isActive = true;
    }
  }
  if (chat) {
    if (targetUser.isOnline()) {
      if (isActive) {
        sysMsg = this.lm_.getString("pm", "is_online");
      } else {
        sysMsg = this.lm_.getString("pm", "is_idle").split("*time*").join(timeStr);
      }
    } else {
      if (targetUser.isAppOnline()) {
        sysMsg = this.lm_.getString("pm", "is_app_online");
      } else {
        sysMsg = this.lm_.getString("pm", "is_offline");
      }
    }
    sysMsg = sysMsg.split("*name*").join(nmStr);
    if (chatango.DEBUG) {
      console.log("A tab to this chat is already open: " + sysMsg);
    }
  } else {
    if (chatango.DEBUG) {
      console.log("Create a new chat to this user: " + sid);
    }
    if (targetUser.isOnline()) {
      sysMsg = this.lm_.getString("pm", "type_below");
      var idleStr = "";
      if (!isActive) {
        idleStr = " " + this.lm_.getString("pm", "idle").split("*time*").join(timeStr);
      }
      sysMsg = sysMsg.split("*idle*").join(idleStr);
    } else {
      if (targetUser.isAppOnline()) {
        sysMsg = this.lm_.getString("pm", "is_app_online");
      } else {
        sysMsg = this.lm_.getString("pm", "is_offline");
      }
    }
    sysMsg = sysMsg.split("*name*").join(nmStr);
    chat = this.startChat(chatId, targetUser);
  }
  sysMsg = "<font color='" + msgCol + "'>" + sysMsg + "</font>";
  var msgType = chatango.messagedata.SystemMessageData.MessageType.ON_OFF;
  var sysMsgData = new chatango.messagedata.SystemMessageData(msgType, sysMsg);
  chat.addSystemMessage(sysMsgData);
  var ev = new chatango.events.Event(chatango.pm.PmChatManager.EventType.SWITCH_TO_CHAT);
  ev.setData(chat);
  this.dispatchEvent(ev);
};
chatango.pm.PmChatManager.prototype.switchToExistingChat = function(chatId) {
  var chat = this.currentChats_[chatId];
  if (!chat) {
    return;
  }
  var ev = new chatango.events.Event(chatango.pm.PmChatManager.EventType.SWITCH_TO_CHAT);
  ev.setData(chat);
  this.dispatchEvent(ev);
};
chatango.pm.PmChatManager.prototype.startChat = function(chatId, targetUser, opt_fromUrl, opt_selectTab, opt_renderMessages) {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  if (targetUser.getType() == chatango.users.User.UserType.ANON) {
    return;
  }
  targetUser.setLastInteracted((new Date).getTime());
  var targetUsers = [targetUser];
  var chat = this.getChat(chatId, cUser, targetUsers, opt_fromUrl, opt_renderMessages, cUser);
  goog.events.listen(chat, chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.handleChatConnection_, false, this);
  this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.PM_TO_OR_FROM_USER, null, null, chatId));
  return chat;
};
chatango.pm.PmChatManager.prototype.handleChatConnection_ = function(e) {
  if (e.type == chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED) {
    this.pmConnectUI_.setActive(true);
    this.pmConnectUI_.connectionFail();
  }
};
chatango.pm.PmChatManager.prototype.getChat = function(chatId, cUser, targetUsers, opt_fromUrl, opt_renderMessages, initiator) {
  var chat = this.currentChats_[chatId];
  if (chat != null) {
    return chat;
  }
  chat = new chatango.pm.PmChat(chatId, cUser, targetUsers, this.pmConnection_, opt_fromUrl, opt_renderMessages, initiator);
  if (this.friends_.indexOf(targetUsers[0].getSid()) > -1) {
    chat.setFriend(true);
  }
  this.currentChats_[chatId] = chat;
  return chat;
};
chatango.pm.PmChatManager.prototype.onLoginOK_ = function() {
  this.pmSettings_.setPmConnection(this.pmConnection_);
  (this.removeIdleTimeManager());
  this.idleTimeManager_ = new chatango.pm.IdleTimeManager;
  this.idleTimeManager_.setPmConnection(this.pmConnection_);
};
chatango.pm.PmChatManager.prototype.removeIdleTimeManager = function() {
  if (!this.idleTimeManager_) {
    return;
  }
  this.idleTimeManager_.dispose();
  this.idleTimeManager_ = null;
};
chatango.pm.PmChatManager.prototype.onMessage = function(e) {
  var messageData = e.data;
  var chatId = messageData.getChatId();
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var targetUser = chatango.users.UserManager.getInstance().addUser(chatango.pm.PmChatManager.REFERRER_PREFIX + chatId, chatId, messageData.getUserType(), undefined, true);
  var targetUsers = [targetUser];
  var opt_fromUrl = null;
  var opt_renderMessages = null;
  var chat = this.getChat(chatId, cUser, targetUsers, opt_fromUrl, opt_renderMessages, targetUser);
  chat.addPrivateMessage(messageData);
  if (!messageData.isOnlineMessage()) {
    chat.receiveMessage(messageData);
    targetUser.setNumUnreadPmMessages(targetUser.getNumUnreadPmMessages() + 1);
  } else {
    this.dispatchEvent(new chatango.events.Event(chatango.pm.PmChatManager.EventType.NEW_ONLINE_MESSAGE, chat, messageData, chatId));
  }
  this.dispatchEvent(new chatango.events.Event(chatango.events.EventType.PM_TO_OR_FROM_USER, null, null, chatId));
};
chatango.pm.PmChatManager.prototype.getConnection = function() {
  return this.pmConnection_;
};
chatango.pm.PmChatManager.prototype.getStrangersManager = function() {
  if (this.strangersManager_) {
    return this.strangersManager_;
  }
  this.strangersManager_ = new chatango.pm.StrangersManager;
  return this.strangersManager_;
};
chatango.pm.PmChatManager.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.strangersManager_) {
    this.strangersManager_.constrainDialogsToScreen(opt_stageRect);
  }
};
chatango.pm.PmChatManager.prototype.disposeInternal = function() {
  goog.events.unlisten(this.pmConnection_, this.events_, this.onEvent_, false, this);
  this.removeIdleTimeManager();
  if (this.currentChats_) {
    var c;
    for (c in this.currentChats_) {
      goog.events.listen(this.currentChats_[c], chatango.networking.ConnectionStatusEvent.EventType.DISCONNECTED, this.handleChatConnection_, false, this);
      this.currentChats_[c].dispose();
    }
  }
  this.currentChats_ = null;
  if (this.connectingTimer_) {
    this.connectingTimer_.dispose();
  }
  this.connectingTimer_ = null;
  if (this.pmSettings_) {
    this.pmSettings_.dispose();
  }
  this.pmSettings_ = null;
  if (this.pmConnectUI_) {
    this.pmConnectUI_.dispose();
  }
  this.pmConnectUI_ = null;
  if (this.pmConnection_) {
    this.pmConnection_.dispose();
  }
  this.pmConnection_ = null;
  if (this.strangersManager_) {
    this.strangersManager_.dispose();
  }
  this.strangersManager_ = null;
  chatango.pm.PmChatManager.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.pm.lists.RecentProfile");
goog.require("chatango.managers.DateManager");
goog.require("chatango.pm.lists.ListProfile");
goog.require("chatango.ui.buttons.CloseButton");
chatango.pm.lists.RecentProfile = function(user, pmConnection) {
  goog.base(this, user);
  this.dm_ = chatango.managers.DateManager.getInstance();
};
goog.inherits(chatango.pm.lists.RecentProfile, chatango.pm.lists.ListProfile);
chatango.pm.lists.RecentProfile.prototype.getActivityDiff = function() {
  return this.user_.getLastInteracted() > 0 ? ((new Date).getTime() - this.user_.getLastInteracted()) / 1E3 : 0;
};
chatango.pm.lists.RecentProfile.prototype.updateActivity = function() {
  goog.base(this, "updateActivity");
  var lastInteracted = this.user_.getLastInteracted(), lastStr = "";
  if (this.activityEl_ && lastInteracted > 0) {
    lastStr = this.dm_.diffToString(new Date(lastInteracted), new Date, 0);
    this.activityEl_.innerHTML = "Last&nbsp;msg&nbsp;" + lastStr;
  }
};
chatango.pm.lists.RecentProfile.prototype.onCloseBtnClicked = function(e) {
  chatango.pm.lists.RecentProfile.superClass_.onCloseBtnClicked.call(this, e);
  var ev = new goog.events.Event(chatango.events.EventType.REMOVE_PROFILE);
  ev.data = this.user_.getSid();
  this.dispatchEvent(ev);
};
chatango.pm.lists.RecentProfile.prototype.updateCopy = function() {
  goog.base(this, "updateCopy");
  if (!this.isDesktop_) {
    var lm = chatango.managers.LanguageManager.getInstance();
    this.touchDeleteBtn_.setContent(lm.getString("pm", "del_conv"));
  }
};
chatango.pm.lists.RecentProfile.prototype.dispatchAction_ = function() {
  goog.base(this, "dispatchAction_");
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    window["ga"]("send", "event", "PM", "Recent click");
  }
};
goog.provide("chatango.pm.lists.RecentListView");
goog.require("chatango.pm.lists.RecentProfile");
goog.require("chatango.pm.lists.UserListView");
chatango.pm.lists.RecentListView = function(recentChatList) {
  goog.base(this, recentChatList);
  this.referrerPrefix_ = "recent_list_view";
};
goog.inherits(chatango.pm.lists.RecentListView, chatango.pm.lists.UserListView);
chatango.pm.lists.RecentListView.prototype.makeProfile_ = function(user) {
  return new chatango.pm.lists.RecentProfile(user);
};
chatango.pm.lists.RecentListView.prototype.onRemoveProfile = function(e) {
  var userID = e.data;
  this.userList_.removeUser(userID);
  this.updateList();
};
goog.provide("chatango.pm.PmLayoutType");
chatango.pm.PmLayoutType = {SINGLE_COL:"single", DOUBLE_COL:"double"};
goog.provide("chatango.utils.countries");
chatango.utils.countries.COUNTRY_CODES = {"afghanistan":"AFG", "albania":"ALB", "algeria":"DZA", "american samoa":"ASM", "andorra":"AND", "angola":"AGO", "anguilla":"AIA", "antarctica":"ATA", "antigua":"ATG", "argentina":"ARG", "armenia":"ARM", "aruba":"ABW", "australia":"AUS", "austria":"AUT", "azerbaijan":"AZE", "bahamas":"BHS", "bahrain":"BHR", "bangladesh":"BGD", "barbados":"BRB", "belarus":"BLR", "belgium":"BEL", "belize":"BLZ", "benin":"BEN", "bermuda":"BMU", "bhutan":"BTN", "bolivia":"BOL", 
"bosnia":"BIH", "botswana":"BWA", "bouvet island":"BVT", "brazil":"BRA", "british indian ocean territory":"IOT", "british virgin islands":"VGB", "brunei":"BRN", "bulgaria":"BGR", "burkina faso":"BFA", "burundi":"BDI", "cambodia":"KHM", "cameroon":"CMR", "canada":"CAN", "cape verde":"CPV", "cayman islands":"CYM", "central african republic":"CAF", "chad":"TCD", "chile":"CHL", "china":"CHN", "christmas island":"CXR", "cocos (keeling) islands":"CCK", "colombia":"COL", "comoros":"COM", "cook islands":"COK", 
"costa rica":"CRI", "croatia":"HRV", "cuba":"CUB", "curacao":"CUW", "cyprus":"CYP", "czech republic":"CZE", "democratic republic of the congo":"COD", "zaire":"COD", "denmark":"DNK", "djibouti":"DJI", "dominica":"DMA", "dominican republic":"DOM", "east timor":"TLS", "ecuador":"ECU", "egypt":"EGY", "el salvador":"SLV", "equatorial guinea":"GNQ", "eritrea":"ERI", "estonia":"EST", "ethiopia":"ETH", "falkland islands":"FLK", "faroe islands":"FRO", "fiji":"FJI", "finland":"FIN", "france":"FRA", "french guiana":"GUF", 
"french polynesia":"PYF", "gabon":"GAB", "gambia":"GMB", "georgia":"GEO", "germany":"DEU", "ghana":"GHA", "gibraltar":"GIB", "greece":"GRC", "greenland":"GRL", "grenada":"GRD", "guadeloupe":"GLP", "guam":"GUM", "guatemala":"GTM", "guernsey":"GGY", "guinea":"GIN", "guinea-bissau":"GNB", "guyana":"GUY", "haiti":"HTI", "honduras":"HND", "hong kong":"HKG", "hungary":"HUN", "iceland":"ISL", "india":"IND", "indonesia":"IDN", "iran":"IRN", "iraq":"IRQ", "ireland":"IRL", "isle of man":"IMN", "israel":"ISR", 
"italy":"ITA", "ivory coast":"CIV", "cote d'ivoire":"CIV", "jamaica":"JAM", "japan":"JPN", "jersey":"JEY", "jordan":"JOR", "kazakhstan":"KAZ", "kenya":"KEN", "kiribati":"KIR", "kosovo":"XKX", "kuwait":"KWT", "kyrgyzstan":"KGZ", "laos":"LAO", "latvia":"LVA", "lebanon":"LBN", "lesotho":"LSO", "liberia":"LBR", "libya":"LBY", "liechtenstein":"LIE", "lithuania":"LTU", "luxembourg":"LUX", "macau":"MAC", "macedonia":"MKD", "madagascar":"MDG", "malawi":"MWI", "malaysia":"MYS", "maldives":"MDV", "mali":"MLI", 
"malta":"MLT", "marshall islands":"MHL", "mauritania":"MRT", "mauritius":"MUS", "martinique":"MTQ", "mayotte":"MYT", "mexico":"MEX", "micronesia":"FSM", "moldova":"MDA", "monaco":"MCO", "mongolia":"MNG", "montenegro":"MNE", "montserrat":"MSR", "morocco":"MAR", "mozambique":"MOZ", "myanmar":"MMR", "namibia":"NAM", "nauru":"NRU", "nepal":"NPL", "netherlands":"NLD", "netherlands antilles":"ANT", "new caledonia":"NCL", "new zealand":"NZL", "nicaragua":"NIC", "niger":"NER", "nigeria":"NGA", "niue":"NIU", 
"north korea":"PRK", "northern mariana islands":"MNP", "norway":"NOR", "oman":"OMN", "pakistan":"PAK", "palau":"PLW", "palestine":"PSE", "panama":"PAN", "papua new guinea":"PNG", "paraguay":"PRY", "peru":"PER", "philippines":"PHL", "pitcairn":"PCN", "poland":"POL", "portugal":"PRT", "puerto rico":"PRI", "qatar":"QAT", "republic of the congo":"COG", "congo":"COG", "reunion":"REU", "romania":"ROU", "russia":"RUS", "rwanda":"RWA", "saint barthelemy":"BLM", "saint helena":"SHN", "saint kitts and nevis":"KNA", 
"saint lucia":"LCA", "saint martin":"MAF", "saint pierre and miquelon":"SPM", "saint vincent and the grenadines":"VCT", "samoa":"WSM", "san marino":"SMR", "sao tome and principe":"STP", "saudi arabia":"SAU", "senegal":"SEN", "serbia":"SRB", "seychelles":"SYC", "sierra leone":"SLE", "singapore":"SGP", "sint maarten":"SXM", "slovakia":"SVK", "slovenia":"SVN", "solomon islands":"SLB", "somalia":"SOM", "south africa":"ZAF", "south korea":"KOR", "korea":"KOR", "south sudan":"SSD", "spain":"ESP", "sri lanka":"LKA", 
"sudan":"SDN", "suriname":"SUR", "svalbard and jan mayen":"SJM", "swaziland":"SWZ", "sweden":"SWE", "switzerland":"CHE", "syria":"SYR", "taiwan":"TWN", "tajikistan":"TJK", "tanzania":"TZA", "thailand":"THA", "togo":"TGO", "tokelau":"TKL", "tonga":"TON", "trinidad and tobago":"TTO", "tunisia":"TUN", "turkey":"TUR", "turkmenistan":"TKM", "turks and caicos islands":"TCA", "tuvalu":"TUV", "u.s. virgin islands":"VIR", "uganda":"UGA", "ukraine":"UKR", "united arab emirates":"ARE", "united kingdom":"GBR", 
"united states":"USA", "uruguay":"URY", "uzbekistan":"UZB", "vanuatu":"VUT", "vatican":"VAT", "venezuela":"VEN", "vietnam":"VNM", "wallis and futuna":"WLF", "western sahara":"ESH", "yemen":"YEM", "zambia":"ZMB", "zimbabwe":"ZWE"};
goog.provide("chatango.pm.StartChatUi");
goog.require("chatango.events.EventType");
goog.require("chatango.events.OpenPmEvent");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.utils.countries");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.positioning");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.StartChatUi = function() {
  goog.ui.Component.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
};
goog.inherits(chatango.pm.StartChatUi, goog.ui.Component);
chatango.pm.StartChatUi.TabMode = {FRIENDS:"friends_tab", RECENT:"recent_tab", STRANGERS:"strangers_tab"};
chatango.pm.StartChatUi.prototype.lastUserName_ = "";
chatango.pm.StartChatUi.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"id":"SCUI"});
  this.table_ = goog.dom.createDom("div", {"id":"SCUIT"});
  goog.dom.appendChild(this.element_, this.table_);
  this.chatWithEl_ = goog.dom.createDom("div", {"id":"SCUICW"});
  goog.dom.appendChild(this.table_, this.chatWithEl_);
  this.inputWrapperEl_ = goog.dom.createDom("div", {"id":"SCUIIW"});
  goog.dom.appendChild(this.table_, this.inputWrapperEl_);
  this.inputEl_ = goog.dom.createDom("input", {"type":"text", "class":"std_input"});
  goog.dom.appendChild(this.inputWrapperEl_, this.inputEl_);
  this.keyHandler = new goog.events.KeyHandler(this.inputEl_);
  goog.events.listen(this.keyHandler, "key", this.onKey_, false, this);
  this.filterEl_ = goog.dom.createDom("div", {"id":"SCUIMP", "style":"display:none;"});
  goog.dom.appendChild(this.table_, this.filterEl_);
  goog.events.listen(this.filterEl_, goog.events.EventType.CLICK, this.openFilterDialog_, false, this);
  if (chatango.managers.Environment.getInstance().isMobile() || chatango.managers.Environment.getInstance().isTablet()) {
    goog.events.listen(this.inputEl_, goog.events.EventType.BLUR, function(e) {
      chatango.managers.Keyboard.getInstance().setRaised(false);
    }, false, this);
    goog.events.listen(this.inputEl_, goog.events.EventType.FOCUS, function(e) {
      chatango.managers.Keyboard.getInstance().setRaised(true);
    }, false, this);
  }
  this.updateCopy();
};
chatango.pm.StartChatUi.prototype.updateCopy = function(curTab) {
  var label = curTab === chatango.pm.StartChatUi.TabMode.FRIENDS ? "add_friend" : "chat_with";
  this.chatWithEl_.innerHTML = this.lm_.getString("pm", label).split(" ").join("&nbsp;");
  this.inputEl_.placeholder = this.lm_.getString("pm", "chat_with_placeholder");
  if (curTab == chatango.pm.StartChatUi.TabMode.STRANGERS) {
    this.chatWithEl_.style.display = "none";
    this.inputWrapperEl_.style.display = "none";
    this.filterEl_.style.display = "";
    this.styleFilter_();
  } else {
    this.chatWithEl_.style.display = "";
    this.inputWrapperEl_.style.display = "";
    this.filterEl_.style.display = "none";
  }
};
chatango.pm.StartChatUi.prototype.onKey_ = function(e) {
  var userName;
  if (e.keyCode == 13 && !e.shiftKey) {
    userName = this.inputEl_.value;
    userName = userName.trim();
    if (userName.replace(/[\n\s]*/gi, "") == "") {
      e.preventDefault();
      return;
    }
    if (userName.match(/\s/) != null) {
      this.showWarningDialog(this.lm_.getString("pm", "no_spaces"));
      return;
    }
    this.inputEl_.value = "";
    this.dispatchEvent(new chatango.events.OpenPmEvent(userName));
    this.lastUserName_ = userName;
    e.preventDefault();
  }
};
chatango.pm.StartChatUi.prototype.openFilterDialog_ = function(e) {
  this.dispatchEvent(chatango.events.EventType.OPEN_STRANGERS_FILTER);
};
chatango.pm.StartChatUi.prototype.updateFilter = function(params) {
  goog.dom.removeChildren(this.filterEl_);
  goog.dom.append(this.filterEl_, goog.dom.createDom("div", {}, params.getSearchTerm() || this.lm_.getString("pm", "filter_default")));
  var min = params.getMinAge();
  var max = params.getMaxAge();
  var ageText = min == max ? min : min + "-" + max;
  goog.dom.append(this.filterEl_, goog.dom.createDom("div", {}, ageText));
  var genderText;
  if (params.getMaleChecked() && params.getFemaleChecked()) {
    genderText = this.lm_.getString("pm", "filter_both");
  } else {
    if (params.getMaleChecked()) {
      genderText = this.lm_.getString("pm", "filter_male");
    } else {
      if (params.getFemaleChecked()) {
        genderText = this.lm_.getString("pm", "filter_female");
      } else {
        genderText = this.lm_.getString("pm", "filter_neither");
      }
    }
  }
  goog.dom.append(this.filterEl_, goog.dom.createDom("div", {}, genderText));
  var distanceText;
  if (params.getInCountry()) {
    var country = chatango.users.UserManager.getInstance().currentUser.getLocation() || "";
    distanceText = chatango.utils.countries.COUNTRY_CODES[country.toLowerCase()];
    if (distanceText === undefined) {
      distanceText = this.lm_.getString("pm", "filter_missing_country");
    }
  } else {
    if (params.getDistance() && params.getDistance() != Infinity) {
      distanceText = params.getDistance() + " " + this.lm_.getString("pm", "strangers_search_units");
    }
  }
  if (distanceText) {
    goog.dom.append(this.filterEl_, goog.dom.createDom("div", {}, distanceText));
  }
  if (params.getOnlineChecked()) {
    goog.dom.append(this.filterEl_, goog.dom.createDom("div", {}, this.lm_.getString("pm", "filter_online")));
  }
  if (params.getBannedChecked()) {
    goog.dom.append(this.filterEl_, goog.dom.createDom("div", {}, this.lm_.getString("pm", "filter_banned")));
  }
  this.styleFilter_();
};
chatango.pm.StartChatUi.prototype.styleFilter_ = function() {
  if (!this.filterEl_.hasChildNodes()) {
    return;
  }
  goog.dom.classes.add(this.filterEl_.firstChild, "mp-first");
  goog.dom.classes.add(this.filterEl_.lastChild, "mp-last");
  var width = this.element_.offsetWidth;
  var first = this.filterEl_.firstChild;
  goog.dom.removeNode(first);
  var nodes = goog.dom.getChildren(this.filterEl_);
  for (var i = 0;i < nodes.length;i++) {
    width -= nodes[i].offsetWidth;
  }
  width -= goog.style.getPaddingBox(this.filterEl_.lastChild).left;
  first.style.maxWidth = Math.round(width - 2) + "px";
  goog.dom.insertChildAt(this.filterEl_, first, 0);
};
chatango.pm.StartChatUi.prototype.connectFailed = function(userNameOrEmail) {
  if (this.inputEl_.value == "") {
    this.inputEl_.value = userNameOrEmail;
  }
  var warning = "";
  var currentUserName = chatango.users.UserManager.getInstance().currentUser.getName();
  if (userNameOrEmail.indexOf("@") != -1) {
    warning = this.lm_.getString("pm", "no_user").split("*email*").join(userNameOrEmail);
  } else {
    if (currentUserName == userNameOrEmail) {
      warning = this.lm_.getString("pm", "add_self");
    } else {
      warning = this.lm_.getString("pm", "not_exist").split("*name*").join(userNameOrEmail);
    }
  }
  this.showWarningDialog(warning);
};
chatango.pm.StartChatUi.prototype.showWarningDialog = function(opt_warning) {
  if (opt_warning) {
    this.lastWarning_ = opt_warning;
  }
  if (!goog.module.ModuleManager.getInstance().getModuleInfo("CommonUIModule").isLoaded()) {
    if (!opt_warning) {
      return;
    }
    goog.module.ModuleManager.getInstance().execOnLoad("CommonUIModule", this.showWarningDialog, this);
    return;
  }
  if (this.warningDialog_) {
    this.warningDialog_.dispose();
  }
  this.warningDialog_ = new chatango.ui.WarningDialog(this.lastWarning_);
  goog.events.listenOnce(this.warningDialog_, goog.ui.PopupBase.EventType.SHOW, this.onWarningDialogShow_, false, this);
  this.warningDialog_.setVisible(true);
};
chatango.pm.StartChatUi.prototype.onWarningDialogShow_ = function() {
  var offset = new goog.math.Coordinate(0, -5);
  goog.positioning.positionAtAnchor(this.inputEl_, goog.positioning.Corner.TOP_LEFT, this.warningDialog_.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
  this.warningDialog_.getElement().style.display = "none";
  var bodyRect = goog.style.getBounds(goog.dom.getDocument().body);
  bodyRect.width = bodyRect.width - 5;
  this.warningDialog_.getElement().style.display = "block";
  chatango.utils.display.constrainToStage(this.warningDialog_.getElement(), bodyRect);
  var that = this;
  setTimeout(function() {
    that.warningDialog_.dispose();
  }, 4E3);
};
chatango.pm.StartChatUi.prototype.openConnDialog = function() {
  this.showWarningDialog("Connecting...");
};
chatango.pm.StartChatUi.prototype.closeConnDialog = function() {
  if (this.warningDialog_) {
    this.warningDialog_.dispose();
  }
};
chatango.pm.StartChatUi.prototype.disposeInternal = function() {
  if (this.warningDialog_) {
    this.warningDialog_.dispose();
  }
  goog.events.unlisten(this.keyHandler, "key", this.onKey_, false, this);
  goog.events.unlisten(this.filterEl_, goog.events.EventType.CLICK, this.openFilterDialog_, false, this);
  this.keyHandler = null;
  chatango.pm.StartChatUi.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.pm.PmView");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.networking.PmConnection");
goog.require("chatango.pm.PmChatManager");
goog.require("chatango.pm.PmLayoutType");
goog.require("chatango.utils.userAgent");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.PmView = function(pmChatManager, pmLayoutType) {
  goog.ui.Component.call(this);
  this.handler = new goog.events.EventHandler(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.pmChatManager_ = pmChatManager;
  this.pmConnection_ = this.pmChatManager_.getConnection();
  this.pmLayoutType_ = pmLayoutType;
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
};
goog.inherits(chatango.pm.PmView, goog.ui.Component);
chatango.pm.PmView.prototype.addAndroidDownloadLink = function(element) {
  if (chatango.utils.userAgent.isAndroidAppCompatible()) {
    var appDl = goog.dom.createDom("span", {"style":"float:right;padding-right:0.3em;color:#0084ef;"}, "Android App");
    goog.events.listen(appDl, "click", function() {
      window.parent.location = "http://play.google.com/store/apps/details?id=com.chatango.android";
    }, false, this);
    goog.dom.append(element, appDl);
  }
};
chatango.pm.PmView.prototype.disposeInternal = function() {
  this.pmChatManager_ = null;
  this.pmConnection_ = null;
  this.handler.dispose();
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.Lists");
goog.require("chatango.events.EventType");
goog.require("chatango.events.OpenPmEvent");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.networking.PmConnection");
goog.require("chatango.networking.PmConnectionEvent");
goog.require("chatango.pm.PmChatManager");
goog.require("chatango.pm.PmLayoutType");
goog.require("chatango.pm.PmView");
goog.require("chatango.pm.StartChatUi");
goog.require("chatango.pm.lists.FriendsListView");
goog.require("chatango.pm.lists.RecentListView");
goog.require("chatango.pm.lists.StrangersListView");
goog.require("goog.Timer");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.Lists = function(pmChatManager, pmLayoutType, recentChatList, friendsList, strangersList, pmHeader, pmNavHeader, stage) {
  chatango.pm.PmView.call(this, pmChatManager, pmLayoutType);
  this.stage_ = stage;
  this.startChatUi_ = new chatango.pm.StartChatUi;
  this.recentChatList_ = recentChatList;
  this.friendsList_ = friendsList;
  this.strangersList_ = strangersList;
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  this.curTabKey_ = cUser.getSid().toLowerCase() + "_curTab";
  this.curTab_ = localStorage.getItem(this.curTabKey_) || chatango.pm.StartChatUi.TabMode.RECENT;
  this.timer_ = new goog.Timer(1E3);
  this.numTicks_ = 0;
  this.pmHeader_ = pmHeader;
  this.pmNavHeader_ = pmNavHeader;
  this.unreadMessages = 0;
  goog.events.listen(this.timer_, goog.Timer.TICK, this.onTick_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.pm.PmChatManager.EventType.CONNECT_SUCCESS, this.onConnectSuccess_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.events.EventType.OPEN_CONN_DIALOG, this.openConnDialog_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.events.EventType.CLOSE_CONN_DIALOG, this.closeConnDialog_, false, this);
};
goog.inherits(chatango.pm.Lists, chatango.pm.PmView);
chatango.pm.Lists.prototype.openConnDialog_ = function(e) {
  this.startChatUi_.openConnDialog();
};
chatango.pm.Lists.prototype.closeConnDialog_ = function(e) {
  this.startChatUi_.closeConnDialog();
};
chatango.pm.Lists.prototype.resetUnread = function(user) {
  this.unreadMessages -= user.getNumUnreadPmMessages();
  this.recentChatList_.resetUnread(user.getName());
  this.friendsList_.resetUnread(user.getName());
};
chatango.pm.Lists.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"id":"LISTS"});
  this.listsWrapper_ = goog.dom.createDom("div", {"id":"LISTS_WRAP"});
  goog.dom.append(this.element_, this.listsWrapper_);
  this.topLoadingAnimation_ = goog.dom.createDom("div", {"class":"loading", "style":"top:0px;"});
  this.bottomLoadingAnimation_ = goog.dom.createDom("div", {"class":"loading", "style":"bottom:0px;"});
  goog.dom.append(this.listsWrapper_, this.topLoadingAnimation_);
  goog.dom.append(this.listsWrapper_, this.bottomLoadingAnimation_);
  this.friendsPane_ = new chatango.pm.lists.FriendsListView(this.friendsList_);
  this.recentPane_ = new chatango.pm.lists.RecentListView(this.recentChatList_);
  this.strangersPane_ = new chatango.pm.lists.StrangersListView(this.strangersList_);
  this.friendsPane_.render(this.listsWrapper_);
  this.recentPane_.render(this.listsWrapper_);
  this.strangersPane_.render(this.listsWrapper_);
  this.footerEl_ = goog.dom.createDom("div", {"id":"LISTS_FTR"});
  goog.dom.append(this.element_, this.footerEl_);
  this.startChatUi_.render(this.footerEl_);
  goog.events.listen(this.startChatUi_, chatango.events.EventType.OPEN_STRANGERS_FILTER, this.openStrangersFilter_, false, this);
  goog.events.listen(this.pmChatManager_.getStrangersManager(), chatango.pm.StrangersManager.EventType.LOADING_TOP_START, this.startTopLoading_, false, this);
  goog.events.listen(this.pmChatManager_.getStrangersManager(), chatango.pm.StrangersManager.EventType.LOADING_BOTTOM_START, this.startBottomLoading_, false, this);
  goog.events.listen(this.pmChatManager_.getStrangersManager(), chatango.pm.StrangersManager.EventType.LOADING_STOP, this.stopLoading_, false, this);
  goog.events.listen(this.pmChatManager_.getStrangersManager(), chatango.pm.StrangersManager.EventType.PERFORM_SEARCH, function(e) {
    this.startChatUi_.updateFilter(e.getObject());
  }, false, this);
  goog.events.listen(this.startChatUi_, chatango.events.EventType.OPEN_PM_EVENT, this.onStartChatRequest_, false, this);
  goog.events.listen(this.recentPane_, chatango.events.EventType.OPEN_PM_EVENT, this.onStartChatRequest_, false, this);
  goog.events.listen(this.friendsPane_, chatango.events.EventType.OPEN_PM_EVENT, this.onStartChatRequest_, false, this);
  goog.events.listen(this.strangersPane_, chatango.events.EventType.OPEN_PM_EVENT, this.onStartChatRequest_, false, this);
  goog.events.listen(this.friendsPane_, chatango.events.EventType.CHANGE_DISPLAY, this.draw, false, this);
  goog.events.listen(this.recentPane_, chatango.events.EventType.CHANGE_DISPLAY, this.draw, false, this);
  goog.events.listen(this.strangersPane_, chatango.events.EventType.CHANGE_DISPLAY, this.draw, false, this);
  this.updateCopy();
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
};
chatango.pm.Lists.prototype.openStrangersFilter_ = function(e) {
  this.pmChatManager_.getStrangersManager().openStrangersFilter();
};
chatango.pm.Lists.prototype.changeTab = function(tabMode, draw) {
  switch(tabMode) {
    case chatango.pm.StartChatUi.TabMode.RECENT:
      this.recentPane_.getElement().style.display = "block";
      this.friendsPane_.getElement().style.display = "none";
      this.strangersPane_.getElement().style.display = "none";
      goog.dom.classes.remove(this.friendsPane_.viewModes_, "slidOut");
      goog.dom.classes.remove(this.strangersPane_.viewModes_, "slidOut");
      this.hideLoaders_();
      if (draw) {
        this.recentPane_.draw();
      }
      this.curTab_ = chatango.pm.StartChatUi.TabMode.RECENT;
      break;
    case chatango.pm.StartChatUi.TabMode.FRIENDS:
      this.friendsPane_.getElement().style.display = "block";
      this.recentPane_.getElement().style.display = "none";
      this.strangersPane_.getElement().style.display = "none";
      goog.dom.classes.remove(this.recentPane_.viewModes_, "slidOut");
      goog.dom.classes.remove(this.strangersPane_.viewModes_, "slidOut");
      this.hideLoaders_();
      if (draw) {
        this.friendsPane_.draw();
      }
      this.curTab_ = chatango.pm.StartChatUi.TabMode.FRIENDS;
      break;
    case chatango.pm.StartChatUi.TabMode.STRANGERS:
    ;
    default:
      this.strangersPane_.getElement().style.display = "block";
      this.recentPane_.getElement().style.display = "none";
      this.friendsPane_.getElement().style.display = "none";
      goog.dom.classes.remove(this.recentPane_.viewModes_, "slidOut");
      goog.dom.classes.remove(this.friendsPane_.viewModes_, "slidOut");
      this.showLoaders_();
      if (draw) {
        this.strangersPane_.draw();
      }
      this.curTab_ = chatango.pm.StartChatUi.TabMode.STRANGERS;
      this.pmChatManager_.getStrangersManager().initStrangers();
      break;
  }
  if (draw) {
    this.draw();
    this.startChatUi_.updateCopy(this.curTab_);
  }
};
chatango.pm.Lists.prototype.draw = function(keyboardUp) {
  var friendsViewsHeight = this.friendsPane_.updateTopMargin(this.element_);
  var recentViewsHeight = this.recentPane_.updateTopMargin(this.element_);
  var strangersViewsHeight = this.strangersPane_.updateTopMargin(this.element_);
  this.listsWrapper_.style.display = "none";
  var stageHeight = this.stage_.offsetHeight;
  var totalOffset = this.footerEl_.offsetHeight + this.pmHeader_.getHeight() + this.pmNavHeader_.getHeight();
  var contentHeight = stageHeight - totalOffset;
  this.friendsPane_.setHeight(contentHeight - friendsViewsHeight);
  this.recentPane_.setHeight(contentHeight - recentViewsHeight);
  this.strangersPane_.setHeight(contentHeight - strangersViewsHeight);
  var that = this;
  this.listsWrapper_.style.display = "block";
  this.refreshScroll();
  this.timer_.start();
};
chatango.pm.Lists.prototype.refreshScroll = function() {
  this.friendsPane_.draw();
  this.recentPane_.draw();
  this.strangersPane_.draw();
};
chatango.pm.Lists.prototype.updateCopy = function() {
  this.startChatUi_.updateCopy(this.curTab_);
};
chatango.pm.Lists.prototype.onConnectSuccess_ = function(e) {
  var usernameOrEmail = e.getString();
  this.startChatUi_.inputEl_.blur();
  if (this.curTab_ === chatango.pm.StartChatUi.TabMode.FRIENDS && !this.friendsList_.containsUser(usernameOrEmail)) {
    this.friendsList_.addUser(usernameOrEmail);
  }
  if (!this.recentChatList_.containsUser(usernameOrEmail)) {
    this.recentChatList_.addUser(usernameOrEmail);
  }
};
chatango.pm.Lists.prototype.connectFailed = function(userNameOrEmail) {
  this.startChatUi_.connectFailed(userNameOrEmail);
};
chatango.pm.Lists.prototype.onStartChatRequest_ = function(e) {
  if (e.target === this.startChatUi_) {
    if (chatango.managers.Environment.getInstance().isAndroidApp()) {
      if (this.curTab_ == chatango.pm.StartChatUi.TabMode.FRIENDS) {
        window["ga"]("send", "event", "PM", "Typed friend added");
      } else {
        if (this.curTab_ == chatango.pm.StartChatUi.TabMode.RECENT) {
          window["ga"]("send", "event", "PM", "Typed chat initiated");
        }
      }
    }
  }
  var usernameOrEmail = e.getUid();
  this.pmChatManager_.connectToUser(usernameOrEmail);
};
chatango.pm.Lists.prototype.onTick_ = function(e) {
  this.friendsPane_.updateActivity(this.numTicks_);
  this.recentPane_.updateActivity(this.numTicks_);
  this.numTicks_++;
};
chatango.pm.Lists.prototype.startTopLoading_ = function() {
  goog.dom.classes.remove(this.bottomLoadingAnimation_, "running");
  goog.dom.classes.add(this.topLoadingAnimation_, "running");
};
chatango.pm.Lists.prototype.startBottomLoading_ = function() {
  goog.dom.classes.remove(this.topLoadingAnimation_, "running");
  goog.dom.classes.add(this.bottomLoadingAnimation_, "running");
};
chatango.pm.Lists.prototype.stopLoading_ = function() {
  goog.dom.classes.remove(this.topLoadingAnimation_, "running");
  goog.dom.classes.remove(this.bottomLoadingAnimation_, "running");
};
chatango.pm.Lists.prototype.showLoaders_ = function() {
  this.topLoadingAnimation_.style.display = "";
  this.bottomLoadingAnimation_.style.display = "";
};
chatango.pm.Lists.prototype.hideLoaders_ = function() {
  this.topLoadingAnimation_.style.display = "none";
  this.bottomLoadingAnimation_.style.display = "none";
};
chatango.pm.Lists.prototype.disposeInternal = function() {
  goog.events.unlisten(this.startChatUi_, chatango.events.EventType.OPEN_PM_EVENT, this.onStartChatRequest_, false, this);
  goog.events.unlisten(this.pmChatManager_, chatango.pm.PmChatManager.EventType.CONNECT_SUCCESS, this.onConnectSuccess_, false, this);
  goog.events.unlisten(this.pmChatManager_.getStrangersManager(), chatango.pm.StrangersManager.EventType.LOADING_TOP_START, this.startTopLoading_, false, this);
  goog.events.unlisten(this.pmChatManager_.getStrangersManager(), chatango.pm.StrangersManager.EventType.LOADING_BOTTOM_START, this.startBottomLoading_, false, this);
  goog.events.unlisten(this.pmChatManager_.getStrangersManager(), chatango.pm.StrangersManager.EventType.LOADING_STOP, this.stopLoading_, false, this);
  if (this.startChatUi_) {
    this.startChatUi_.dispose();
  }
  if (this.recentChatList_) {
    this.recentChatList_.dispose();
  }
  if (this.friendsList_) {
    this.friendsList_.dispose();
  }
  if (this.friendsPane_) {
    this.friendsPane_.dispose();
  }
  if (this.recentPane_) {
    this.recentPane_.dispose();
  }
  if (this.strangersPane_) {
    this.strangersPane_.dispose();
  }
  if (this.timer_) {
    this.timer_.dispose();
    goog.events.unlisten(this.timer_, goog.Timer.TICK, this.onTick_, false, this);
  }
  this.startChatUi_ = null;
  this.recentChatList_ = null;
  this.friendsList_ = null;
  this.recentPane_ = null;
  this.friendsPane_ = null;
  this.strangersPane_ = null;
  this.timer_ = null;
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.ui.RangeSelector");
goog.require("chatango.ui.icons.SvgUpArrowIcon");
goog.require("goog.fx.Dragger");
goog.require("goog.math.Rect");
goog.require("goog.Timer");
goog.require("goog.ui.Component");
chatango.ui.RangeSelector = function(range_min, range_max, title, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.min_ = range_min || 0;
  this.max_ = Math.max(range_max || 10, this.min_);
  this.lower_ = this.min_;
  this.upper_ = this.max_;
  this.offset_ = 2;
  this.title_ = title;
};
goog.inherits(chatango.ui.RangeSelector, goog.ui.Component);
chatango.ui.RangeSelector.prototype.createDom = function() {
  goog.base(this, "createDom");
  goog.style.setStyle(this.getElement(), "height", "3em");
  goog.style.setStyle(this.getElement(), "position", "relative");
  this.line_ = goog.dom.createDom("div", {"style":"border-bottom: 2px solid #CCCCCC;height:50%"});
  goog.dom.append(this.getElement(), this.line_);
  this.titleWrap_ = goog.dom.createDom("div", {"class":"fl"});
  this.rangeWrap_ = goog.dom.createDom("div", {"class":"fr"});
  goog.dom.append(this.line_, this.titleWrap_);
  goog.dom.append(this.line_, this.rangeWrap_);
  this.upperArrowWrap_ = goog.dom.createDom("div", {"class":"dragger-wrap", "style":"height:100%;"});
  this.lowerArrowWrap_ = goog.dom.createDom("div", {"class":"dragger-wrap", "style":"height:100%;"});
  this.upperSpacer_ = goog.dom.createDom("div", {"style":"height:50%;"});
  this.lowerSpacer_ = goog.dom.createDom("div", {"style":"height:50%;"});
  goog.dom.append(this.upperArrowWrap_, this.upperSpacer_);
  goog.dom.append(this.lowerArrowWrap_, this.lowerSpacer_);
  this.upperArrow_ = new chatango.ui.icons.SvgUpArrowIcon("#666666");
  this.lowerArrow_ = new chatango.ui.icons.SvgUpArrowIcon("#666666");
  this.upperDragger_ = new goog.fx.Dragger(this.upperArrowWrap_);
  this.lowerDragger_ = new goog.fx.Dragger(this.lowerArrowWrap_);
  this.upperArrow_.render(this.upperArrowWrap_);
  goog.dom.classes.add(this.upperArrow_.getElement(), "ui-up-arrow");
  this.lowerArrow_.render(this.lowerArrowWrap_);
  goog.dom.classes.add(this.lowerArrow_.getElement(), "ui-up-arrow");
  goog.dom.append(this.getElement(), this.upperArrowWrap_);
  goog.dom.append(this.getElement(), this.lowerArrowWrap_);
  goog.events.listen(this.upperDragger_, goog.fx.Dragger.EventType.DRAG, this.dragUpper_, false, this);
  goog.events.listen(this.lowerDragger_, goog.fx.Dragger.EventType.DRAG, this.dragLower_, false, this);
  goog.events.listen(this.upperDragger_, goog.fx.Dragger.EventType.START, this.dragStart_, false, this);
  goog.events.listen(this.lowerDragger_, goog.fx.Dragger.EventType.START, this.dragStart_, false, this);
  goog.events.listen(this.upperDragger_, goog.fx.Dragger.EventType.END, this.dragEnd_, false, this);
  goog.events.listen(this.lowerDragger_, goog.fx.Dragger.EventType.END, this.dragEnd_, false, this);
  goog.Timer.callOnce(this.draw, 0, this);
};
chatango.ui.RangeSelector.prototype.draw = function() {
  if (!this.isInDocument()) {
    return;
  }
  this.lineWidth_ = this.line_.offsetWidth - 2 * this.offset_;
  this.arrowWidth_ = this.upperArrowWrap_.offsetWidth;
  var limits = new goog.math.Rect(Math.round(-this.arrowWidth_ / 2 + this.offset_), 1, this.lineWidth_, 0);
  this.upperDragger_.setLimits(limits);
  this.lowerDragger_.setLimits(limits);
  this.positionDraggers_();
  this.updateCopy();
};
chatango.ui.RangeSelector.prototype.updateCopy = function() {
  this.titleWrap_.innerHTML = this.title_ || "";
  this.rangeWrap_.innerHTML = this.lower_ != this.upper_ ? this.lower_ + " - " + this.upper_ : this.lower_;
};
chatango.ui.RangeSelector.prototype.positionDraggers_ = function() {
  var range = this.max_ - this.min_;
  if (range > 0) {
    goog.style.setStyle(this.lowerArrowWrap_, "left", this.offset_ + (this.lower_ - this.min_) * this.lineWidth_ / range - this.arrowWidth_ / 2 + "px");
    goog.style.setStyle(this.upperArrowWrap_, "left", this.offset_ + (this.upper_ - this.min_) * this.lineWidth_ / range - this.arrowWidth_ / 2 + "px");
  } else {
    goog.style.setStyle(this.lowerArrowWrap_, "left", this.offset_ - this.arrowWidth_ / 2 + "px");
    goog.style.setStyle(this.upperArrowWrap_, "left", this.offset_ + this.lineWidth_ - this.arrowWidth_ / 2 + "px");
  }
};
chatango.ui.RangeSelector.prototype.setTitle = function(title) {
  this.title_ = title;
  this.updateCopy();
};
chatango.ui.RangeSelector.prototype.setMax = function(range_max) {
  this.max_ = Math.max(range_max, this.min_);
  this.upper_ = Math.min(this.upper_, this.max_);
  this.draw();
};
chatango.ui.RangeSelector.prototype.setUpper = function(upper) {
  this.upper_ = Math.max(Math.min(Math.max(upper, this.lower_), this.max_), this.min_);
  this.draw();
};
chatango.ui.RangeSelector.prototype.setMin = function(range_min) {
  this.min_ = Math.min(range_min, this.max_);
  this.lower_ = Math.max(this.lower_, this.min_);
  this.draw();
};
chatango.ui.RangeSelector.prototype.setLower = function(lower) {
  this.lower_ = Math.min(Math.max(Math.min(lower, this.upper_), this.min_), this.max_);
  this.draw();
};
chatango.ui.RangeSelector.prototype.getRange = function() {
  return[this.lower_, this.upper_];
};
chatango.ui.RangeSelector.prototype.dragStart_ = function(e) {
  this.overlapped_ = this.lower_ == this.upper_;
};
chatango.ui.RangeSelector.prototype.dragEnd_ = function(e) {
  this.overlapped_ = false;
};
chatango.ui.RangeSelector.prototype.dragUpper_ = function(e) {
  var newUpper = Math.round((Number(goog.style.getStyle(this.upperArrowWrap_, "left").split("px")[0]) + this.arrowWidth_ / 2 - this.offset_) * (this.max_ - this.min_) / this.lineWidth_) + this.min_;
  if (this.overlapped_) {
    if (newUpper != this.upper_) {
      this.overlapped_ = false;
    }
    if (newUpper < this.lower_) {
      this.upperDragger_.endDrag(e, true);
      this.lowerDragger_.startDrag(e);
      return;
    }
  }
  this.upper_ = Math.min(Math.max(this.lower_, newUpper), this.max_);
  this.positionDraggers_();
  this.updateCopy();
};
chatango.ui.RangeSelector.prototype.dragLower_ = function(e) {
  var newLower = Math.round((Number(goog.style.getStyle(this.lowerArrowWrap_, "left").split("px")[0]) + this.arrowWidth_ / 2 - this.offset_) * (this.max_ - this.min_) / this.lineWidth_) + this.min_;
  if (this.overlapped_) {
    if (newLower != this.lower_) {
      this.overlapped_ = false;
    }
    if (newLower > this.upper_) {
      this.lowerDragger_.endDrag(e, true);
      this.upperDragger_.startDrag(e);
      return;
    }
  }
  this.lower_ = Math.max(Math.min(this.upper_, newLower), this.min_);
  this.positionDraggers_();
  this.updateCopy();
};
chatango.ui.RangeSelector.prototype.disposeInternal = function() {
  if (this.upperArrow_) {
    this.upperArrow_.dispose();
    this.upperArrow_ = null;
  }
  if (this.lowerArrow_) {
    this.lowerArrow_.dispose();
    this.lowerArrow_ = null;
  }
  if (this.upperDragger_) {
    this.upperDragger_.dispose();
    goog.events.unlisten(this.upperDragger_, goog.fx.Dragger.EventType.DRAG, this.dragUpper_, false, this);
    goog.events.unlisten(this.upperDragger_, goog.fx.Dragger.EventType.START, this.dragStart_, false, this);
    goog.events.unlisten(this.upperDragger_, goog.fx.Dragger.EventType.END, this.dragEnd_, false, this);
    this.upperDragger_ = null;
  }
  if (this.lowerDragger_) {
    this.lowerDragger_.dispose();
    goog.events.unlisten(this.lowerDragger_, goog.fx.Dragger.EventType.DRAG, this.dragLower_, false, this);
    goog.events.unlisten(this.lowerDragger_, goog.fx.Dragger.EventType.START, this.dragStart_, false, this);
    goog.events.unlisten(this.lowerDragger_, goog.fx.Dragger.EventType.END, this.dragEnd_, false, this);
    this.lowerDragger_ = null;
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.ui.SlidingSelector");
goog.require("chatango.ui.icons.SvgUpArrowIcon");
goog.require("goog.fx.Dragger");
goog.require("goog.math.Rect");
goog.require("goog.Timer");
goog.require("goog.ui.Component");
chatango.ui.SlidingSelector = function(values, title, units, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.values_ = goog.isArray(values) ? values : [];
  this.selected_ = 0;
  this.offset_ = 2;
  this.title_ = title;
  this.units_ = units ? " " + units : "";
};
goog.inherits(chatango.ui.SlidingSelector, goog.ui.Component);
chatango.ui.SlidingSelector.prototype.createDom = function() {
  goog.base(this, "createDom");
  goog.style.setStyle(this.getElement(), "height", "3em");
  goog.style.setStyle(this.getElement(), "position", "relative");
  this.line_ = goog.dom.createDom("div", {"style":"border-bottom: 2px solid #CCCCCC;height:50%"});
  goog.dom.append(this.getElement(), this.line_);
  this.titleWrap_ = goog.dom.createDom("div", {"class":"fl"});
  this.rangeWrap_ = goog.dom.createDom("div", {"class":"fr"});
  goog.dom.append(this.line_, this.titleWrap_);
  goog.dom.append(this.line_, this.rangeWrap_);
  this.arrowWrap_ = goog.dom.createDom("div", {"class":"dragger-wrap", "style":"height:100%;"});
  this.spacer_ = goog.dom.createDom("div", {"style":"height:50%;"});
  goog.dom.append(this.arrowWrap_, this.spacer_);
  this.arrow_ = new chatango.ui.icons.SvgUpArrowIcon("#666666");
  this.dragger_ = new goog.fx.Dragger(this.arrowWrap_);
  this.arrow_.render(this.arrowWrap_);
  goog.dom.classes.add(this.arrow_.getElement(), "ui-up-arrow");
  goog.dom.append(this.getElement(), this.arrowWrap_);
  goog.events.listen(this.dragger_, goog.fx.Dragger.EventType.DRAG, this.drag_, false, this);
  goog.events.listen(this.getElement(), goog.events.EventType.MOUSEDOWN, this.onClick_, false, this);
  goog.Timer.callOnce(this.draw, 0, this);
};
chatango.ui.SlidingSelector.prototype.draw = function() {
  if (!this.isInDocument()) {
    return;
  }
  this.lineWidth_ = this.line_.offsetWidth - 2 * this.offset_;
  this.arrowWidth_ = this.arrowWrap_.offsetWidth;
  var limits = new goog.math.Rect(Math.round(-this.arrowWidth_ / 2 + this.offset_), 1, this.lineWidth_, 0);
  this.dragger_.setLimits(limits);
  this.positionDragger_();
  this.updateCopy();
};
chatango.ui.SlidingSelector.prototype.updateCopy = function() {
  this.titleWrap_.innerHTML = this.title_ || "";
  if (this.selected_ > this.values_.length || this.selected_ < 0) {
    this.rangeWrap_.innerHTML = "";
  } else {
    if (this.values_[this.selected_] == Infinity) {
      this.rangeWrap_.innerHTML = "Unlimited";
    } else {
      this.rangeWrap_.innerHTML = this.values_[this.selected_] + this.units_;
    }
  }
};
chatango.ui.SlidingSelector.prototype.positionDragger_ = function() {
  if (this.values_.length < 2) {
    goog.style.setStyle(this.arrowWrap_, "left", this.offset_ + this.lineWidth_ / 2 - this.arrowWidth_ / 2 + "px");
  } else {
    goog.style.setStyle(this.arrowWrap_, "left", this.offset_ + this.selected_ * this.lineWidth_ / (this.values_.length - 1) - this.arrowWidth_ / 2 + "px");
  }
};
chatango.ui.SlidingSelector.prototype.setTitle = function(title) {
  this.title_ = title;
  this.updateCopy();
};
chatango.ui.SlidingSelector.prototype.setValues = function(values) {
  this.values_ = goog.isArray(values) ? values : [];
  this.selected_ = this.selected_ < this.values_.length ? this.selected_ : this.values_.length;
  this.updateCopy();
};
chatango.ui.SlidingSelector.prototype.getSelectedValue = function() {
  return this.selected_ < this.values_.length ? this.values_[this.selected_] : undefined;
};
chatango.ui.SlidingSelector.prototype.getSelectedIndex = function() {
  return this.selected_ < this.values_.length ? this.selected_ : undefined;
};
chatango.ui.SlidingSelector.prototype.setSelectedValue = function(value) {
  this.setSelectedIndex(this.values_.indexOf(value));
};
chatango.ui.SlidingSelector.prototype.setSelectedIndex = function(index) {
  if (index < 0) {
    this.selected_ = 0;
  } else {
    if (index > this.values_.length) {
      this.selected_ = Math.max(this.values_.length - 1, 0);
    } else {
      this.selected_ = index;
    }
  }
};
chatango.ui.SlidingSelector.prototype.setUnits = function(units) {
  this.units_ = units ? " " + units : "";
  this.updateCopy();
};
chatango.ui.SlidingSelector.prototype.drag_ = function(e) {
  if (this.values_.length < 2) {
    this.selected_ = 0;
  } else {
    var position = Number(goog.style.getStyle(this.arrowWrap_, "left").split("px")[0]) + this.arrowWidth_ / 2 - this.offset_;
    this.selected_ = Math.floor((this.values_.length - 1) * position / this.lineWidth_ + .5);
  }
  this.positionDragger_();
  this.updateCopy();
};
chatango.ui.SlidingSelector.prototype.onClick_ = function(e) {
  return;
};
chatango.ui.SlidingSelector.prototype.disposeInternal = function() {
  if (this.arrow_) {
    this.arrow_.dispose();
    this.arrow_ = null;
  }
  if (this.dragger_) {
    this.dragger_.dispose();
    goog.events.unlisten(this.dragger_, goog.fx.Dragger.EventType.DRAG, this.drag_, false, this);
    goog.events.unlisten(this.getElement(), goog.events.EventType.MOUSEDOWN, this.onClick_, false, this);
    this.dragger_ = null;
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.StrangersSearch");
goog.require("chatango.users.UserManager");
chatango.pm.StrangersSearch = function(search, male, female, minAge, maxAge, distance, inCountry, online, banned) {
  this.searchTerm_ = search || null;
  this.maleChecked_ = male !== undefined ? !!male : true;
  this.femaleChecked_ = female !== undefined ? !!female : true;
  this.minAge_ = minAge || 13;
  this.maxAge_ = maxAge || 99;
  this.online_ = online !== undefined ? !!online : true;
  this.banned_ = banned !== undefined ? !!banned : false;
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  if (cUser && cUser.hasCoordinates()) {
    this.distance_ = distance || Infinity;
    this.inCountry_ = false;
  } else {
    if (cUser && cUser.getLocation()) {
      this.distance_ = null;
      this.inCountry_ = inCountry !== undefined ? !!inCountry : false;
    } else {
      this.distance_ = null;
      this.inCountry_ = false;
    }
  }
};
chatango.pm.StrangersSearch.getStorageKey = function() {
  return chatango.users.UserManager.getInstance().currentUser.getSid() + "_strangers_search";
};
chatango.pm.StrangersSearch.getFromStorage = function() {
  var saved = localStorage.getItem(chatango.pm.StrangersSearch.getStorageKey());
  if (!saved) {
    return new chatango.pm.StrangersSearch;
  }
  var data = JSON.parse(saved);
  return new chatango.pm.StrangersSearch(data["s"], data["m"], data["f"], data["min"], data["max"], data["d"], data["c"], data["o"], data["b"]);
};
chatango.pm.StrangersSearch.prototype.store = function() {
  var obj = {};
  obj["s"] = this.searchTerm_;
  obj["m"] = this.maleChecked_;
  obj["f"] = this.femaleChecked_;
  obj["min"] = this.minAge_;
  obj["max"] = this.maxAge_;
  obj["d"] = this.distance_;
  obj["c"] = this.inCountry_;
  obj["o"] = this.online_;
  obj["b"] = this.banned_;
  localStorage.setItem(chatango.pm.StrangersSearch.getStorageKey(), JSON.stringify(obj));
};
chatango.pm.StrangersSearch.prototype.getSearchTerm = function() {
  return this.searchTerm_;
};
chatango.pm.StrangersSearch.prototype.getMaleChecked = function() {
  return this.maleChecked_;
};
chatango.pm.StrangersSearch.prototype.getFemaleChecked = function() {
  return this.femaleChecked_;
};
chatango.pm.StrangersSearch.prototype.getMinAge = function() {
  return this.minAge_;
};
chatango.pm.StrangersSearch.prototype.getMaxAge = function() {
  return this.maxAge_;
};
chatango.pm.StrangersSearch.prototype.getDistance = function() {
  return this.distance_;
};
chatango.pm.StrangersSearch.prototype.getInCountry = function() {
  return this.inCountry_;
};
chatango.pm.StrangersSearch.prototype.getOnlineChecked = function() {
  return this.online_;
};
chatango.pm.StrangersSearch.prototype.getBannedChecked = function() {
  return this.banned_;
};
goog.provide("chatango.pm.StrangersSearchView");
goog.require("chatango.events.Event");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.pm.StrangersSearch");
goog.require("chatango.ui.buttons.Button");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.RangeSelector");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.SlidingSelector");
goog.require("chatango.utils.style");
goog.require("goog.dom.classes");
goog.require("goog.events.KeyHandler");
goog.require("goog.style");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
chatango.pm.StrangersSearchView = function(filterParams) {
  var vpWidth = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
  goog.base(this, width, undefined, true);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.filterParams_ = filterParams || new chatango.pm.StrangersSearch;
  this.setResizable(false);
  this.cUser_ = chatango.users.UserManager.getInstance().currentUser;
  if (this.cUser_.hasCoordinates()) {
    this.locationMode_ = chatango.pm.StrangersSearchView.LocationMode.DISTANCE;
  } else {
    if (this.cUser_.getLocation()) {
      this.locationMode_ = chatango.pm.StrangersSearchView.LocationMode.COUNTRY;
    } else {
      this.locationMode_ = chatango.pm.StrangersSearchView.LocationMode.NONE;
    }
  }
  var age = this.cUser_.getAge();
  if (goog.net.cookies.get("pmm") === "true") {
    this.ageMode_ = chatango.pm.StrangersSearchView.AgeMode.MODERATOR;
  } else {
    if (!age) {
      this.ageMode_ = chatango.pm.StrangersSearchView.AgeMode.TEEN;
    } else {
      if (age < 17) {
        this.ageMode_ = chatango.pm.StrangersSearchView.AgeMode.MINOR;
      } else {
        if (age > 16 && age < 20) {
          this.ageMode_ = chatango.pm.StrangersSearchView.AgeMode.TEEN;
        } else {
          this.ageMode_ = chatango.pm.StrangersSearchView.AgeMode.ADULT;
        }
      }
    }
  }
};
goog.inherits(chatango.pm.StrangersSearchView, chatango.ui.ScrollableDialog);
chatango.pm.StrangersSearchView.EventType = {APPLY_FILTER:"apply_filter"};
chatango.pm.StrangersSearchView.LocationMode = {DISTANCE:"distance", COUNTRY:"country", NONE:"none"};
chatango.pm.StrangersSearchView.AgeMode = {MODERATOR:"pmm", MINOR:"minor", TEEN:"teen", ADULT:"adult"};
chatango.pm.StrangersSearchView.prototype.createDom = function() {
  goog.base(this, "createDom");
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  this.searchWrap_ = goog.dom.createDom("div");
  this.search_ = goog.dom.createDom("input", {"type":"text"});
  this.search_.value = this.filterParams_.getSearchTerm();
  goog.dom.append(this.searchWrap_, this.search_);
  goog.dom.append(content, this.searchWrap_);
  this.keyHandler_ = new goog.events.KeyHandler(this.inputEl_);
  goog.events.listen(this.keyHandler_, goog.events.KeyHandler.EventType.KEY, this.onKey_, false, this);
  goog.dom.append(content, goog.dom.createDom("br"));
  this.genderWrap_ = goog.dom.createDom("div", {"style":"overflow:hidden;"});
  this.genderLabel_ = goog.dom.createDom("div", {"style":"padding-right:0.8em;", "class":"fl"});
  goog.dom.append(this.genderWrap_, this.genderLabel_);
  this.mCB_ = new chatango.ui.Checkbox;
  this.fCB_ = new chatango.ui.Checkbox;
  this.mCB_.render(this.genderWrap_);
  this.fCB_.render(this.genderWrap_);
  this.mCB_.setChecked(this.filterParams_.getMaleChecked());
  this.fCB_.setChecked(this.filterParams_.getFemaleChecked());
  goog.dom.append(content, this.genderWrap_);
  goog.dom.classes.add(this.mCB_.getElement(), "fl");
  goog.dom.classes.add(this.fCB_.getElement(), "fl");
  goog.dom.append(content, goog.dom.createDom("br"));
  var minAge, maxAge;
  switch(this.ageMode_) {
    case chatango.pm.StrangersSearchView.AgeMode.MINOR:
      minAge = 13;
      maxAge = 19;
      break;
    case chatango.pm.StrangersSearchView.AgeMode.TEEN:
      minAge = 13;
      maxAge = 99;
      break;
    case chatango.pm.StrangersSearchView.AgeMode.MODERATOR:
      minAge = 13;
      maxAge = 99;
      break;
    case chatango.pm.StrangersSearchView.AgeMode.ADULT:
    ;
    default:
      minAge = 17;
      maxAge = 99;
      break;
  }
  this.ageRange_ = new chatango.ui.RangeSelector(minAge, maxAge);
  this.ageRange_.setLower(this.filterParams_.getMinAge());
  this.ageRange_.setUpper(this.filterParams_.getMaxAge());
  this.ageRange_.render(content);
  if (this.locationMode_ == chatango.pm.StrangersSearchView.LocationMode.DISTANCE) {
    this.distance_ = new chatango.ui.SlidingSelector([5, 10, 25, 50, 100, 1E3, Infinity]);
    this.distance_.setSelectedValue(this.filterParams_.getDistance());
    this.distance_.render(content);
  } else {
    if (this.locationMode_ == chatango.pm.StrangersSearchView.LocationMode.COUNTRY) {
      this.countryCB_ = new chatango.ui.Checkbox;
      this.countryCB_.render(content);
      this.countryCB_.setChecked(this.filterParams_.getInCountry());
      goog.dom.append(content, goog.dom.createDom("br"));
    } else {
      this.addLocation_ = new goog.ui.Button("", goog.ui.LinkButtonRenderer.getInstance());
      this.addLocation_.addClassName("link-btn");
      this.addLocation_.render(content);
      goog.events.listen(this.addLocation_, goog.ui.Component.EventType.ACTION, function() {
        chatango.users.UserManager.getInstance().currentUser.openEditProfileDialog();
        this.setVisible(false);
      }, false, this);
      goog.dom.append(content, goog.dom.createDom("br"));
    }
  }
  this.onlineCB_ = new chatango.ui.Checkbox;
  this.onlineCB_.render(content);
  this.onlineCB_.setChecked(this.filterParams_.getOnlineChecked());
  goog.dom.classes.add(this.onlineCB_.getElement(), "fl");
  if (goog.net.cookies.get("pmm") === "true") {
    this.bannedCB_ = new chatango.ui.Checkbox;
    this.bannedCB_.render(content);
    this.bannedCB_.setChecked(this.filterParams_.getBannedChecked());
    goog.dom.classes.add(this.bannedCB_.getElement(), "fl");
  }
  this.showFooterContentEl(true);
  this.showFooterElBorder(true);
  goog.style.setStyle(this.getFooterContentElement(), "overflow", "hidden");
  this.saveBtn_ = new chatango.ui.buttons.Button;
  this.saveBtn_.setAlert(true);
  this.saveBtn_.render(this.getFooterContentElement());
  goog.dom.classes.add(this.saveBtn_.getElement(), "fr");
  goog.style.setStyle(this.saveBtn_.getElement(), "margin-top", "0");
  goog.events.listen(this.saveBtn_, goog.ui.Component.EventType.ACTION, this.onSave_, false, this);
  this.updateCopy();
  goog.Timer.callOnce(this.draw, 0, this);
};
chatango.pm.StrangersSearchView.prototype.draw = function() {
  goog.base(this, "draw");
  chatango.utils.style.stretchToFill(this.search_);
};
chatango.pm.StrangersSearchView.prototype.onKey_ = function(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
    this.onSave_();
  }
};
chatango.pm.StrangersSearchView.prototype.onSave_ = function(e) {
  var range = this.ageRange_.getRange();
  var distance, inCountry, bannedView;
  switch(this.locationMode_) {
    case chatango.pm.StrangersSearchView.LocationMode.DISTANCE:
      distance = this.distance_.getSelectedValue();
      break;
    case chatango.pm.StrangersSearchView.LocationMode.COUNTRY:
      inCountry = this.countryCB_.getChecked();
      break;
  }
  if (this.bannedCB_) {
    bannedView = this.bannedCB_.getChecked();
  } else {
    bannedView = false;
  }
  this.dispatchEvent(new chatango.events.Event(chatango.pm.StrangersSearchView.EventType.APPLY_FILTER, null, new chatango.pm.StrangersSearch(this.search_.value, this.mCB_.getChecked(), this.fCB_.getChecked(), range[0], range[1], distance, inCountry, this.onlineCB_.getChecked(), bannedView)));
};
chatango.pm.StrangersSearchView.prototype.updateCopy = function() {
  this.setTitle(this.lm_.getString("pm", "strangers_search_title"));
  this.search_.placeholder = this.lm_.getString("pm", "strangers_search_placeholder");
  this.genderLabel_.innerHTML = this.lm_.getString("pm", "strangers_search_gender");
  this.mCB_.setCaption(this.lm_.getString("pm", "strangers_search_male_caption"));
  this.fCB_.setCaption(this.lm_.getString("pm", "strangers_search_female_caption"));
  this.ageRange_.setTitle(this.lm_.getString("pm", "strangers_search_age"));
  if (this.distance_) {
    this.distance_.setTitle(this.lm_.getString("pm", "strangers_search_distance"));
    this.distance_.setUnits(this.lm_.getString("pm", "strangers_search_units"));
  }
  if (this.countryCB_) {
    this.countryCB_.setCaption(this.lm_.getString("pm", "strangers_search_country_prefix") + this.cUser_.getLocation());
  }
  if (this.addLocation_) {
    this.addLocation_.setCaption(this.lm_.getString("pm", "strangers_search_add_loc"));
  }
  this.onlineCB_.setCaption(this.lm_.getString("pm", "strangers_search_online"));
  if (this.bannedCB_) {
    this.bannedCB_.setCaption(this.lm_.getString("pm", "strangers_search_banned"));
  }
  this.saveBtn_.setContent(this.lm_.getString("pm", "strangers_search_save"));
};
chatango.pm.StrangersSearchView.prototype.disposeInternal = function() {
  if (this.keyHandler_) {
    goog.events.unlisten(this.keyHandler_, goog.events.KeyHandler.EventType.KEY, this.onKey_, false, this);
    this.keyHandler_.dispose();
    this.keyHandler_ = null;
  }
  if (this.mCB_) {
    this.mCB_.dispose();
    this.mCB_ = null;
  }
  if (this.fCB_) {
    this.fCB_.dispose();
    this.fCB_ = null;
  }
  if (this.ageRange_) {
    this.ageRange_.dispose();
    this.ageRange = null;
  }
  if (this.distance_) {
    this.distance_.dispose();
    this.distance_ = null;
  }
  if (this.countryCB_) {
    this.countryCB_.dispose();
    this.countryCB_ = null;
  }
  if (this.addLocation_) {
    goog.events.unlisten(this.addLocation_, goog.ui.Component.EventType.ACTION, function() {
      chatango.users.UserManager.getInstance().currentUser.openEditProfileDialog();
      this.setVisible(false);
    }, false, this);
    this.addLocation_.dispose();
    this.addLocation = null;
  }
  if (this.saveBtn_) {
    goog.events.unlisten(this.saveBtn_, goog.ui.Component.EventType.ACTION, this.onSave_, false, this);
    this.saveBtn_.dispose();
    this.saveBtn_ = null;
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.StrangersManager");
goog.require("chatango.events.Event");
goog.require("chatango.pm.StrangersSearchView");
goog.require("chatango.users.UserManager");
goog.require("goog.events.EventTarget");
chatango.pm.StrangersManager = function() {
  goog.base(this);
  this.filterDialog_ = null;
  this.filterParams_ = null;
  this.inited_ = false;
};
goog.inherits(chatango.pm.StrangersManager, goog.events.EventTarget);
chatango.pm.StrangersManager.EventType = {PERFORM_SEARCH:"perform_search", LOADING_TOP_START:"loading_top_start", LOADING_BOTTOM_START:"loading_bottom_start", LOADING_STOP:"loading_stop"};
chatango.pm.StrangersManager.prototype.initStrangers = function() {
  if (this.inited_) {
    return;
  }
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  if (cUser.isBasicProfileLoaded()) {
    this.filterParams_ = chatango.pm.StrangersSearch.getFromStorage();
    this.getStrangers();
    this.inited_ = true;
  } else {
    goog.events.listenOnce(cUser, chatango.users.User.EventType.BASIC_PROFILE_LOADED, function() {
      this.filterParams_ = chatango.pm.StrangersSearch.getFromStorage();
      this.getStrangers();
      this.inited_ = true;
    }, false, this);
  }
  this.startTopLoadingAnimation();
};
chatango.pm.StrangersManager.prototype.getStrangers = function() {
  this.dispatchEvent(new chatango.events.Event(chatango.pm.StrangersManager.EventType.PERFORM_SEARCH, null, this.filterParams_));
};
chatango.pm.StrangersManager.prototype.openStrangersFilter = function() {
  this.closeStrangersFilter();
  this.filterDialog_ = new chatango.pm.StrangersSearchView(this.filterParams_);
  this.filterDialog_.setVisible(true);
  goog.events.listen(this.filterDialog_, chatango.pm.StrangersSearchView.EventType.APPLY_FILTER, this.applyFilter_, false, this);
};
chatango.pm.StrangersManager.prototype.closeStrangersFilter = function() {
  if (this.filterDialog_) {
    goog.events.unlisten(this.filterDialog_, chatango.pm.StrangersSearchView.EventType.APPLY_FILTER, this.applyFilter_, false, this);
    this.filterDialog_.dispose();
  }
  this.filterDialog_ = null;
};
chatango.pm.StrangersManager.prototype.applyFilter_ = function(e) {
  this.filterParams_ = e.getObject() || new chatango.pm.StrangersSearch;
  this.filterParams_.store();
  this.closeStrangersFilter();
  this.getStrangers();
};
chatango.pm.StrangersManager.prototype.startTopLoadingAnimation = function() {
  this.dispatchEvent(chatango.pm.StrangersManager.EventType.LOADING_TOP_START);
};
chatango.pm.StrangersManager.prototype.startBottomLoadingAnimation = function() {
  this.dispatchEvent(chatango.pm.StrangersManager.EventType.LOADING_BOTTOM_START);
};
chatango.pm.StrangersManager.prototype.stopLoadingAnimation = function() {
  this.dispatchEvent(chatango.pm.StrangersManager.EventType.LOADING_STOP);
};
chatango.pm.StrangersManager.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.filterDialog_ && this.filterDialog_.isVisible()) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h);
    this.filterDialog_.setMaxHeight(new_h * .95);
    this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
    var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
    var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
    this.filterDialog_.setWidth(width);
    chatango.utils.display.constrainToStage(this.filterDialog_.getElement(), opt_stageRect, true);
    this.filterDialog_.keepActiveFormElementOnScreen();
  }
};
chatango.pm.StrangersManager.prototype.disposeInternal = function() {
  this.closeStrangersFilter();
  this.filterDialog_ = null;
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.lists.StrangersList");
goog.require("chatango.pm.lists.UserList");
goog.require("chatango.pm.StrangersManager");
goog.require("chatango.users.UserManager");
chatango.pm.lists.StrangersList = function(pmChatManager) {
  goog.base(this, pmChatManager);
  this.referrerPrefix_ = "strangers_list";
  this.list_ = [];
  this.strangersManager_ = pmChatManager.getStrangersManager();
  this.serverInited_ = false;
  goog.events.listenOnce(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.OK, this.onOK_, false, this);
  goog.events.listen(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.presence, this.onPresence_, false, this);
  this.filterParams_ = null;
  goog.events.listen(this.strangersManager_, chatango.pm.StrangersManager.EventType.PERFORM_SEARCH, this.getStrangers, false, this);
  var baseDomain = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
  this.scriptUrl_ = "//" + baseDomain + "/flashdir";
  this.nextRequestStart_ = 0;
  this.lastRequestAmount_ = 0;
  this.clearOnReply_ = false;
  this.state_ = chatango.pm.lists.StrangersList.States.UNINITED;
  this.xhr_ = null;
};
goog.inherits(chatango.pm.lists.StrangersList, chatango.pm.lists.UserList);
chatango.pm.lists.StrangersList.States = {NO_RESULTS:"no_results", NO_MORE_RESULTS:"no_more_results", OVERLOAD:"overload", BANNED_CONTENT:"banned_content", LOADING:"loading", MORE_AVAILABLE:"more_available", UNINITED:"uninited"};
chatango.pm.lists.StrangersList.prototype.constructBaseForm = function() {
  var fd = new FormData;
  if (this.filterParams_.getBannedChecked() && window["android"] !== undefined && window["android"]["getS"] !== undefined) {
    fd.append("mode", "inverted");
    fd.append("sr", window["android"]["getS"]());
  }
  var sex;
  if (this.filterParams_.getMaleChecked() && this.filterParams_.getFemaleChecked()) {
    sex = "B";
  } else {
    if (this.filterParams_.getMaleChecked()) {
      sex = "M";
    } else {
      if (this.filterParams_.getFemaleChecked()) {
        sex = "F";
      } else {
        sex = "N";
      }
    }
  }
  var distance = this.filterParams_.getDistance();
  if (distance == Infinity) {
    distance = 9999;
  }
  var term = this.filterParams_.getSearchTerm();
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var lat = cUser.getLatitude();
  var lon = cUser.getLongitude();
  var inCountry = this.filterParams_.getInCountry();
  var country = cUser.getLocation();
  fd.append("ami", this.filterParams_.getMinAge());
  fd.append("ama", this.filterParams_.getMaxAge());
  fd.append("s", sex);
  if (term) {
    fd.append("ss", term);
  }
  if (distance && !inCountry) {
    fd.append("r", distance);
  }
  if (inCountry && country) {
    fd.append("c", country);
  }
  if (lat && lon) {
    fd.append("la", lon);
    fd.append("lo", lat);
  }
  if (this.filterParams_.getOnlineChecked()) {
    fd.append("o", "1");
  }
  fd.append("h5", "1");
  return fd;
};
chatango.pm.lists.StrangersList.prototype.getStrangers = function(e) {
  this.clearList();
  this.filterParams_ = e.getObject();
  var fd = this.constructBaseForm();
  fd.append("f", 0);
  fd.append("t", 20);
  this.nextRequestStart_ = 20;
  this.lastRequestAmount_ = 20;
  this.clearOnReply_ = false;
  this.sendRequest_(fd);
  this.strangersManager_.startTopLoadingAnimation();
  window["ga"]("send", "event", "PM", "Load strangers");
};
chatango.pm.lists.StrangersList.prototype.getMore = function() {
  if (this.xhr_) {
    return;
  }
  if (this.noResults_ || this.noMoreResults_) {
    return;
  }
  var fd = this.constructBaseForm();
  fd.append("f", this.nextRequestStart_);
  this.nextRequestStart_ += 15;
  fd.append("t", this.nextRequestStart_);
  this.lastRequestAmount_ = 15;
  this.clearOnReply_ = false;
  this.sendRequest_(fd);
  this.strangersManager_.startBottomLoadingAnimation();
  window["ga"]("send", "event", "PM", "Get more strangers");
};
chatango.pm.lists.StrangersList.prototype.refresh = function() {
  var fd = this.constructBaseForm();
  fd.append("f", 0);
  fd.append("t", 20);
  this.nextRequestStart_ = 20;
  this.lastRequestAmount_ = 20;
  this.clearOnReply_ = true;
  this.sendRequest_(fd);
  this.strangersManager_.startTopLoadingAnimation();
  window["ga"]("send", "event", "PM", "Refresh strangers");
};
chatango.pm.lists.StrangersList.prototype.sendRequest_ = function(form) {
  this.state_ = chatango.pm.lists.StrangersList.States.LOADING;
  var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(this.scriptUrl_);
  xhr.setWithCredentials(true);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, this.onRequestSuccess_, false, this);
  goog.events.listen(xhr, [goog.net.EventType.ERROR, goog.net.EventType.ABORT, goog.net.EventType.TIMEOUT], this.onRequestError_, false, this);
  xhr.send(this.scriptUrl_, "POST", form);
  this.xhr_ = xhr;
};
chatango.pm.lists.StrangersList.prototype.onRequestSuccess_ = function(e) {
  if (e.target !== this.xhr_) {
    return;
  }
  if (this.clearOnReply_) {
    this.list_ = [];
  }
  var reply = e.target.getResponseText();
  this.clearXhr_();
  if (reply == "overload") {
    this.state_ = chatango.pm.lists.StrangersList.States.OVERLOAD;
    this.dispatchUpdateEvent();
    this.strangersManager_.stopLoadingAnimation();
    return;
  } else {
    if (reply == "unsafe") {
      this.state_ = chatango.pm.lists.StrangersList.States.BANNED_CONTENT;
      this.dispatchUpdateEvent();
      this.strangersManager_.stopLoadingAnimation();
      return;
    }
  }
  var args = reply.split("=");
  if (args.length != 2 || args[0] != "h") {
    if (this.nextRequestStart_ > 20) {
      this.state_ = chatango.pm.lists.StrangersList.States.NO_MORE_RESULTS;
    } else {
      this.state_ = chatango.pm.lists.StrangersList.States.NO_RESULTS;
    }
    this.dispatchUpdateEvent();
    this.strangersManager_.stopLoadingAnimation();
    return;
  }
  var users = args[1].split(":");
  var usersToRequest = [];
  if (users.length < this.lastRequestAmount_) {
    this.state_ = chatango.pm.lists.StrangersList.States.NO_MORE_RESULTS;
  } else {
    this.state_ = chatango.pm.lists.StrangersList.States.MORE_AVAILABLE;
  }
  for (var i = 0;i < users.length;i++) {
    var data = users[i].split(";");
    usersToRequest.push(data[0]);
    this.addUser(data[0]);
    this.setUserStatus(data[0], data[1] === "1");
  }
  if (this.serverInited_) {
    this.pmConnection_.send("getpresence:" + usersToRequest.join(";"));
  }
  this.dispatchUpdateEvent();
  this.strangersManager_.stopLoadingAnimation();
};
chatango.pm.lists.StrangersList.prototype.onRequestError_ = function() {
  this.xhr_ = null;
  this.state_ = chatango.pm.lists.StrangersList.States.MORE_AVAILABLE;
  this.strangersManager_.stopLoadingAnimation();
};
chatango.pm.lists.StrangersList.prototype.getNumUnreadPmMessages = function() {
  return 0;
};
chatango.pm.lists.StrangersList.prototype.onOK_ = function() {
  this.serverInited_ = true;
};
chatango.pm.lists.StrangersList.prototype.onPresence_ = function(e) {
  var data = e.data;
  if (data.length == 0 || data[0] != "presence") {
    return;
  }
  data.splice(0, 1);
  if (data.length == 0 || data.length % 3 != 0) {
    return;
  }
  for (var i = 0;i < data.length;i = i + 3) {
    var user = this.getUser(data[i]);
    if (!user) {
      break;
    }
    var idleMinutes = Number(data[i + 1]);
    var status = data[i + 2];
    user.setFullStatus(status == chatango.pm.PmChatManager.status.ONLINE, status == chatango.pm.PmChatManager.status.APP_ONLINE, idleMinutes > 0, (new Date).getTime() - idleMinutes * 60 * 1E3);
  }
  this.dispatchUpdateEvent();
};
chatango.pm.lists.StrangersList.prototype.getList = function(opt_sortMode) {
  var list = [];
  for (var i = 0;i < this.list_.length;i++) {
    list.push(this.list_[i].getUid());
  }
  return list;
};
chatango.pm.lists.StrangersList.prototype.addUser = function(userID) {
  if (this.containsUser(userID)) {
    return;
  }
  this.list_.push(this.getUser(userID));
};
chatango.pm.lists.StrangersList.prototype.containsUser = function(userID) {
  return this.list_.indexOf(this.getUser(userID)) > -1;
};
chatango.pm.lists.StrangersList.prototype.removeUser = function(userID) {
  if (!this.containsUser(userID)) {
    return;
  }
  var user = this.getUser(userID);
  goog.array.remove(this.list_, user);
  this.length--;
};
chatango.pm.lists.StrangersList.prototype.resetUnread = function() {
  return;
};
chatango.pm.lists.StrangersList.prototype.clearList = function() {
  this.nextRequestStart_ = 0;
  this.lastRequestAmount_ = 0;
  this.noResults_ = false;
  this.noMoreResults_ = false;
  this.list_ = [];
  this.dispatchUpdateEvent();
};
chatango.pm.lists.StrangersList.prototype.clearXhr_ = function() {
  if (this.xhr_) {
    this.xhr_.dispose();
    this.xhr_ = null;
  }
};
chatango.pm.lists.StrangersList.prototype.getUser = function(userID) {
  return chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + userID, userID, chatango.users.User.UserType.SELLER);
};
chatango.pm.lists.StrangersList.prototype.isUserOnline = function(userID) {
  if (!this.containsUser(userID)) {
    return false;
  }
  return this.getUser(userID).isOnline();
};
chatango.pm.lists.StrangersList.prototype.isUserAppOnline = function(userID) {
  if (!this.containsUser(userID)) {
    return false;
  }
  return this.getUser(userID).isAppOnline();
};
chatango.pm.lists.StrangersList.prototype.setUserStatus = function(userID, isOnline, isAppOnline, lastActive, force) {
  if (!this.containsUser(userID)) {
    return false;
  }
  var user = this.getUser(userID);
  if (user.isOnline() === isOnline && (isAppOnline === undefined || user.isAppOnline() == isAppOnline) && !force) {
    return false;
  }
  user.setOnline(isOnline);
  if (isAppOnline !== undefined) {
    user.setAppOnline(isAppOnline);
  }
  if (lastActive !== undefined) {
    user.setLastActive(lastActive);
  }
  this.dispatchUpdateEvent();
  return true;
};
chatango.pm.lists.StrangersList.prototype.getState = function() {
  return this.state_;
};
chatango.pm.lists.StrangersList.prototype.onIdleUpdate_ = function(e) {
  return;
};
chatango.pm.lists.StrangersList.prototype.disposeInternal = function() {
  goog.events.unlisten(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.presence, this.onPresence_, false, this);
  goog.events.unlisten(this.strangersManager_, chatango.pm.StrangersManager.EventType.PERFORM_SEARCH, this.getStrangers, false, this);
  this.clearXhr_();
  this.list_ = null;
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.lists.RecentChatList");
goog.require("chatango.events.Event");
goog.require("chatango.pm.PmHistoryManager");
goog.require("chatango.pm.lists.UserList");
goog.require("chatango.users.UserManager");
chatango.pm.lists.RecentChatList = function(pmChatManager) {
  goog.base(this, pmChatManager);
  goog.events.listen(this.pmChatManager_, chatango.events.EventType.PM_TO_OR_FROM_USER, this.onEvent_, false, this);
  goog.events.listenOnce(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.OK, this.onLoginOK_, false, this);
  this.lsKey_ = this.cSid_.toLowerCase() + "_recent";
  var recArr = localStorage.getItem(this.lsKey_) || "";
  var recList = recArr ? recArr.split(",") : [], len = recList.length;
  for (var i = 0;i < len;i++) {
    this.addUser(recList[i]);
  }
  this.loggedIn_ = false;
};
goog.inherits(chatango.pm.lists.RecentChatList, chatango.pm.lists.UserList);
chatango.pm.lists.RecentChatList.MAX_USERS = 32;
chatango.pm.lists.RecentChatList.prototype.onLoginOK_ = function(e) {
  for (userID in this.list_) {
    if (this.list_.hasOwnProperty(userID)) {
      this.pmChatManager_.pmConnection_.send("track:" + userID);
    }
  }
  this.loggedIn_ = true;
};
chatango.pm.lists.RecentChatList.prototype.activitySort_ = function(uid1, uid2) {
  var u1 = this.list_[uid1];
  var u2 = this.list_[uid2];
  return u2.getLastInteracted() - u1.getLastInteracted();
};
chatango.pm.lists.RecentChatList.prototype.onEvent_ = function(e) {
  this.addUser(e.getString());
  this.dispatchUpdateEvent();
};
chatango.pm.lists.RecentChatList.prototype.removeUser = function(userID) {
  goog.base(this, "removeUser", userID);
  this.pmChatManager_.pmConnection_.send("disconnect:" + userID);
  this.save();
};
chatango.pm.lists.RecentChatList.prototype.addUser_ = function(userID) {
  if (this.loggedIn_ && !this.list_.hasOwnProperty(userID)) {
    this.pmChatManager_.pmConnection_.send("track:" + userID);
  }
  goog.base(this, "addUser_", userID);
  var history = this.historyManager_.getHistory([this.cSid_, userID]);
  if (history.length > 0) {
    try {
      var lastMsg = parseFloat(history[history.length - 1].data.split(":")[4], 10);
      this.list_[userID].setLastInteracted(lastMsg * 1E3);
    } catch (e) {
    }
  }
};
chatango.pm.lists.RecentChatList.prototype.addUser = function(userID) {
  goog.base(this, "addUser", userID);
  this.save();
};
chatango.pm.lists.RecentChatList.prototype.save = function() {
  var listToSave = this.getList();
  var noAnons = function(sid) {
    return sid[0] != "*";
  };
  localStorage.setItem(this.lsKey_, listToSave.filter(noAnons).join(","));
};
chatango.pm.lists.RecentChatList.prototype.disposeInternal = function() {
  goog.events.unlisten(this.pmChatManager_, chatango.events.EventType.PM_TO_OR_FROM_USER, this.onEvent_, false, this);
  this.save();
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.ui.icons.SvgBackArrowIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgBackArrowIcon = function(opt_color, opt_domHelper) {
  var color = opt_color || "#0084ef";
  this.isChunky_ = false;
  chatango.ui.icons.SvgIcon.call(this, color, opt_domHelper);
};
goog.inherits(chatango.ui.icons.SvgBackArrowIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgBackArrowIcon.prototype.createDom = function() {
  chatango.ui.icons.SvgBackArrowIcon.superClass_.createDom.call(this);
  goog.dom.classes.enable(this.element_, "back-arrow", true);
  goog.dom.classes.enable(this.element_, "back-arrow-chunky", this.isChunky_);
};
chatango.ui.icons.SvgBackArrowIcon.prototype.setIsChunky = function(bool) {
  this.isChunky_ = bool;
  if (this.element_) {
    goog.dom.classes.enable(this.element_, "back-arrow-chunky", bool);
    this.draw();
  }
};
chatango.ui.icons.SvgBackArrowIcon.prototype.draw = function() {
  var stroke_width = this.isChunky_ ? 14 : 10;
  var svgStr = '<svg width="100%" height="100%" overflow="hidden" viewBox="0 0 55 100" preserveAspectRatio="xMinYMin" style="display: block;">' + "<defs></defs>" + "<g>" + '<path d="M 50 5 L 5 50 50 95" stroke="' + this.color_ + '" stroke-width="' + stroke_width + '" stroke-line-join="miter" fill="none"></path>' + "</g>" + "</svg>";
  this.element_.innerHTML = svgStr;
};
chatango.ui.icons.SvgBackArrowIcon.prototype.setVerticalAlign_ = function() {
  return;
};
goog.provide("chatango.pm.Chats");
goog.require("chatango.events.Event");
goog.require("chatango.input.Input");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.messagedata.SystemMessageData");
goog.require("chatango.networking.PmConnection");
goog.require("chatango.networking.PmConnectionEvent");
goog.require("chatango.pm.PmChat");
goog.require("chatango.pm.PmChatManager");
goog.require("chatango.pm.PmLayoutType");
goog.require("chatango.pm.PmView");
goog.require("chatango.pm.SystemMessage");
goog.require("chatango.ui.icons.SvgBackArrowIcon");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.pm.Chats = function(pmChatManager, pmLayoutType, pmHeader, pmNavHeader, stage) {
  chatango.pm.PmView.call(this, pmChatManager, pmLayoutType);
  this.stage_ = stage;
  this.renderedChats_ = [];
  this.maxChats_ = 1;
  this.chatCols_ = 1;
  this.pmHeader_ = pmHeader;
  this.pmNavHeader_ = pmNavHeader;
  this.unreadMessages = 0;
  goog.events.listen(this.pmChatManager_, chatango.pm.PmChatManager.EventType.SWITCH_TO_CHAT, this.onConnectSuccess_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.networking.PmConnectionEvent.EventType.status, this.onStatusChange_, false, this);
};
goog.inherits(chatango.pm.Chats, chatango.pm.PmView);
chatango.pm.Chats.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"id":"CHATS"});
  this.chatsWrapper_ = goog.dom.createDom("div", {"id":"CHATS_WRAP"});
  goog.dom.append(this.element_, this.chatsWrapper_);
  this.footerEl_ = goog.dom.createDom("div", {"id":"CHATS_FTR"});
  goog.dom.append(this.element_, this.footerEl_);
  this.updateCopy();
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
};
chatango.pm.Chats.prototype.draw = function(keyboardUp) {
  this.chatsWrapper_.style.display = "none";
  var stageHeight = this.stage_.offsetHeight;
  var totalOffset = this.footerEl_.offsetHeight + this.pmHeader_.getHeight() + this.pmNavHeader_.getHeight();
  var contentHeight = stageHeight - totalOffset;
  this.chatsWrapper_.style.height = contentHeight + "px";
  this.chatsWrapper_.style.display = "block";
  var i;
  var len = this.renderedChats_.length;
  var h = Math.floor(contentHeight / len);
  var last_h = h + contentHeight - h * len;
  for (i = 0;i < len;i++) {
    var hh = i + 1 < len ? h : last_h;
    this.renderedChats_[i].getChatView().setHeight(hh);
  }
};
chatango.pm.Chats.prototype.blurInput = function() {
  var len = this.renderedChats_.length, i;
  for (i = 0;i < len;i++) {
    if (this.renderedChats_[i].getChatView().isInDocument()) {
      this.renderedChats_[i].getChatView().blurInput();
      break;
    }
  }
};
chatango.pm.Chats.prototype.onNavClicked_ = function(e) {
  if (chatango.DEBUG) {
    console.log("Chats.prototype.onNavClicked_");
  }
  this.dispatchEvent(chatango.events.EventType.BACK);
};
chatango.pm.Chats.prototype.onConnectSuccess_ = function(e) {
  if (chatango.DEBUG) {
    console.log("chatango.pm.Chats onConnectSuccess_");
  }
  var chat = e.getData();
  this.renderChat(chat);
};
chatango.pm.Chats.prototype.onStatusChange_ = function(e) {
  var userID = e.data[1];
  var isOnline = e.data[3] === chatango.pm.PmChatManager.status.ONLINE;
  var isAppOnline = e.data[3] === chatango.pm.PmChatManager.status.APP_ONLINE;
  var chat;
  var strongCol = chatango.pm.SystemMessage.Style.SYS_CHATANGO_COL;
  var msgCol = chatango.pm.SystemMessage.Style.SYS_ON_OFF_TXT_COL;
  var nmStr = "<font color='" + strongCol + "'><b>" + userID + "</b></font>";
  var sysMsgData = "";
  for (var i = 0;i < this.renderedChats_.length;i++) {
    chat = this.renderedChats_[i];
    if (chat.getOtherUser().getName() !== userID || !chat.getChatView().isInDocument()) {
      continue;
    }
    if (chat.getOtherUser().isOnline() === isOnline && chat.getOtherUser().isAppOnline === isAppOnline) {
      continue;
    }
    var statusText = isOnline ? "online" : isAppOnline ? "on mobile" : "offline";
    sysMsgData = "<font color='" + msgCol + "'>" + nmStr + " is now " + statusText + ".</font>";
    chat.addSystemMessage(new chatango.messagedata.SystemMessageData(chatango.messagedata.SystemMessageData.MessageType.ON_OFF, sysMsgData));
  }
};
chatango.pm.Chats.prototype.renderChat = function(chat) {
  if (chatango.DEBUG) {
    console.log("chatango.pm.Chats renderChat");
  }
  var ev = new goog.events.Event(chatango.events.EventType.RESET_UNREAD);
  ev.data = chat.getOtherUser();
  this.dispatchEvent(ev);
  this.unreadMessages = 0;
  this.updateCopy();
  if (chat.getChatView().isInDocument()) {
    return;
  } else {
    if (this.renderedChats_.length + 1 > this.maxChats_) {
      var oldChatView = this.renderedChats_.shift().getChatView();
      oldChatView.exitDocument();
      if (oldChatView.element_) {
        goog.dom.removeNode(oldChatView.element_);
      }
      oldChatView.setParent(null);
    }
    chat.getChatView().render(this.chatsWrapper_);
    this.renderedChats_.push(chat);
    goog.events.listen(chat.getChatView(), chatango.input.Input.EventType.FOCUS, this.delayedDraw_, false, this);
    chat.renderStoredMessages();
    this.draw();
  }
};
chatango.pm.Chats.prototype.getMaxChats = function() {
  return this.maxChats_;
};
chatango.pm.Chats.prototype.delayedDraw_ = function(e) {
  this.draw();
};
chatango.pm.Chats.prototype.updateCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (this.navigationText_) {
    this.navigationText_.innerHTML = lm.getString("pm", "all_convs");
    if (this.unreadMessages > 0) {
      this.navigationText_.innerHTML += ' <span style="color: #888">(' + this.unreadMessages + " new)</span>";
    }
  }
  if (this.navPlaceholder_) {
    this.navPlaceholder_.innerHTML = "&nbsp;";
  }
};
chatango.pm.Chats.prototype.disposeInternal = function() {
  goog.events.unlisten(this.pmChatManager_, chatango.pm.PmChatManager.EventType.SWITCH_TO_CHAT, this.onConnectSuccess_, false, this);
  for (var i = 0;i < this.renderedChats_.length;i++) {
    chat = this.renderedChats_[i];
    goog.events.unlisten(chat, chatango.input.Input.EventType.FOCUS, this.delayedDraw_, false, this);
  }
  this.renderedChats_.length = 0;
  this.renderedChats_ = null;
  chatango.pm.Chats.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.pm.PmContextType");
chatango.pm.PmContextType = {STAND_ALONE:"sa", IN_GROUP:"ig"};
goog.provide("goog.ui.TabRenderer");
goog.require("goog.a11y.aria.Role");
goog.require("goog.ui.Component");
goog.require("goog.ui.ControlRenderer");
goog.ui.TabRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(goog.ui.TabRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.TabRenderer);
goog.ui.TabRenderer.CSS_CLASS = goog.getCssName("goog-tab");
goog.ui.TabRenderer.prototype.getCssClass = function() {
  return goog.ui.TabRenderer.CSS_CLASS;
};
goog.ui.TabRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.TAB;
};
goog.ui.TabRenderer.prototype.createDom = function(tab) {
  var element = goog.ui.TabRenderer.superClass_.createDom.call(this, tab);
  var tooltip = tab.getTooltip();
  if (tooltip) {
    this.setTooltip(element, tooltip);
  }
  return element;
};
goog.ui.TabRenderer.prototype.decorate = function(tab, element) {
  element = goog.ui.TabRenderer.superClass_.decorate.call(this, tab, element);
  var tooltip = this.getTooltip(element);
  if (tooltip) {
    tab.setTooltipInternal(tooltip);
  }
  if (tab.isSelected()) {
    var tabBar = tab.getParent();
    if (tabBar && goog.isFunction(tabBar.setSelectedTab)) {
      tab.setState(goog.ui.Component.State.SELECTED, false);
      tabBar.setSelectedTab(tab);
    }
  }
  return element;
};
goog.ui.TabRenderer.prototype.getTooltip = function(element) {
  return element.title || "";
};
goog.ui.TabRenderer.prototype.setTooltip = function(element, tooltip) {
  if (element) {
    element.title = tooltip || "";
  }
};
goog.provide("goog.ui.Tab");
goog.require("goog.ui.Component");
goog.require("goog.ui.Control");
goog.require("goog.ui.TabRenderer");
goog.require("goog.ui.registry");
goog.ui.Tab = function(content, opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, content, opt_renderer || goog.ui.TabRenderer.getInstance(), opt_domHelper);
  this.setSupportedState(goog.ui.Component.State.SELECTED, true);
  this.setDispatchTransitionEvents(goog.ui.Component.State.DISABLED | goog.ui.Component.State.SELECTED, true);
};
goog.inherits(goog.ui.Tab, goog.ui.Control);
goog.tagUnsealableClass(goog.ui.Tab);
goog.ui.Tab.prototype.tooltip_;
goog.ui.Tab.prototype.getTooltip = function() {
  return this.tooltip_;
};
goog.ui.Tab.prototype.setTooltip = function(tooltip) {
  this.getRenderer().setTooltip(this.getElement(), tooltip);
  this.setTooltipInternal(tooltip);
};
goog.ui.Tab.prototype.setTooltipInternal = function(tooltip) {
  this.tooltip_ = tooltip;
};
goog.ui.registry.setDecoratorByClassName(goog.ui.TabRenderer.CSS_CLASS, function() {
  return new goog.ui.Tab(null);
});
goog.provide("goog.ui.TabBarRenderer");
goog.require("goog.a11y.aria.Role");
goog.require("goog.object");
goog.require("goog.ui.ContainerRenderer");
goog.ui.TabBarRenderer = function() {
  goog.ui.ContainerRenderer.call(this, goog.a11y.aria.Role.TAB_LIST);
};
goog.inherits(goog.ui.TabBarRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(goog.ui.TabBarRenderer);
goog.tagUnsealableClass(goog.ui.TabBarRenderer);
goog.ui.TabBarRenderer.CSS_CLASS = goog.getCssName("goog-tab-bar");
goog.ui.TabBarRenderer.prototype.getCssClass = function() {
  return goog.ui.TabBarRenderer.CSS_CLASS;
};
goog.ui.TabBarRenderer.prototype.setStateFromClassName = function(tabBar, className, baseClass) {
  if (!this.locationByClass_) {
    this.createLocationByClassMap_();
  }
  var location = this.locationByClass_[className];
  if (location) {
    tabBar.setLocation(location);
  } else {
    goog.ui.TabBarRenderer.superClass_.setStateFromClassName.call(this, tabBar, className, baseClass);
  }
};
goog.ui.TabBarRenderer.prototype.getClassNames = function(tabBar) {
  var classNames = goog.ui.TabBarRenderer.superClass_.getClassNames.call(this, tabBar);
  if (!this.classByLocation_) {
    this.createClassByLocationMap_();
  }
  classNames.push(this.classByLocation_[tabBar.getLocation()]);
  return classNames;
};
goog.ui.TabBarRenderer.prototype.createClassByLocationMap_ = function() {
  var baseClass = this.getCssClass();
  this.classByLocation_ = goog.object.create(goog.ui.TabBar.Location.TOP, goog.getCssName(baseClass, "top"), goog.ui.TabBar.Location.BOTTOM, goog.getCssName(baseClass, "bottom"), goog.ui.TabBar.Location.START, goog.getCssName(baseClass, "start"), goog.ui.TabBar.Location.END, goog.getCssName(baseClass, "end"));
};
goog.ui.TabBarRenderer.prototype.createLocationByClassMap_ = function() {
  if (!this.classByLocation_) {
    this.createClassByLocationMap_();
  }
  this.locationByClass_ = goog.object.transpose(this.classByLocation_);
};
goog.provide("goog.ui.TabBar");
goog.provide("goog.ui.TabBar.Location");
goog.require("goog.ui.Component.EventType");
goog.require("goog.ui.Container");
goog.require("goog.ui.Container.Orientation");
goog.require("goog.ui.Tab");
goog.require("goog.ui.TabBarRenderer");
goog.require("goog.ui.registry");
goog.ui.TabBar = function(opt_location, opt_renderer, opt_domHelper) {
  this.setLocation(opt_location || goog.ui.TabBar.Location.TOP);
  goog.ui.Container.call(this, this.getOrientation(), opt_renderer || goog.ui.TabBarRenderer.getInstance(), opt_domHelper);
  this.listenToTabEvents_();
};
goog.inherits(goog.ui.TabBar, goog.ui.Container);
goog.tagUnsealableClass(goog.ui.TabBar);
goog.ui.TabBar.Location = {TOP:"top", BOTTOM:"bottom", START:"start", END:"end"};
goog.ui.TabBar.prototype.location_;
goog.ui.TabBar.prototype.autoSelectTabs_ = true;
goog.ui.TabBar.prototype.selectedTab_ = null;
goog.ui.TabBar.prototype.enterDocument = function() {
  goog.ui.TabBar.superClass_.enterDocument.call(this);
  this.listenToTabEvents_();
};
goog.ui.TabBar.prototype.disposeInternal = function() {
  goog.ui.TabBar.superClass_.disposeInternal.call(this);
  this.selectedTab_ = null;
};
goog.ui.TabBar.prototype.removeChild = function(tab, opt_unrender) {
  this.deselectIfSelected((tab));
  return goog.ui.TabBar.superClass_.removeChild.call(this, tab, opt_unrender);
};
goog.ui.TabBar.prototype.getLocation = function() {
  return this.location_;
};
goog.ui.TabBar.prototype.setLocation = function(location) {
  this.setOrientation(goog.ui.TabBar.getOrientationFromLocation(location));
  this.location_ = location;
};
goog.ui.TabBar.prototype.isAutoSelectTabs = function() {
  return this.autoSelectTabs_;
};
goog.ui.TabBar.prototype.setAutoSelectTabs = function(enable) {
  this.autoSelectTabs_ = enable;
};
goog.ui.TabBar.prototype.setHighlightedIndexFromKeyEvent = function(index) {
  goog.ui.TabBar.superClass_.setHighlightedIndexFromKeyEvent.call(this, index);
  if (this.autoSelectTabs_) {
    this.setSelectedTabIndex(index);
  }
};
goog.ui.TabBar.prototype.getSelectedTab = function() {
  return this.selectedTab_;
};
goog.ui.TabBar.prototype.setSelectedTab = function(tab) {
  if (tab) {
    tab.setSelected(true);
  } else {
    if (this.getSelectedTab()) {
      this.getSelectedTab().setSelected(false);
    }
  }
};
goog.ui.TabBar.prototype.getSelectedTabIndex = function() {
  return this.indexOfChild(this.getSelectedTab());
};
goog.ui.TabBar.prototype.setSelectedTabIndex = function(index) {
  this.setSelectedTab((this.getChildAt(index)));
};
goog.ui.TabBar.prototype.deselectIfSelected = function(tab) {
  if (tab && tab == this.getSelectedTab()) {
    var index = this.indexOfChild(tab);
    for (var i = index - 1;tab = (this.getChildAt(i));i--) {
      if (this.isSelectableTab(tab)) {
        this.setSelectedTab(tab);
        return;
      }
    }
    for (var j = index + 1;tab = (this.getChildAt(j));j++) {
      if (this.isSelectableTab(tab)) {
        this.setSelectedTab(tab);
        return;
      }
    }
    this.setSelectedTab(null);
  }
};
goog.ui.TabBar.prototype.isSelectableTab = function(tab) {
  return tab.isVisible() && tab.isEnabled();
};
goog.ui.TabBar.prototype.handleTabSelect = function(e) {
  if (this.selectedTab_ && this.selectedTab_ != e.target) {
    this.selectedTab_.setSelected(false);
  }
  this.selectedTab_ = (e.target);
};
goog.ui.TabBar.prototype.handleTabUnselect = function(e) {
  if (e.target == this.selectedTab_) {
    this.selectedTab_ = null;
  }
};
goog.ui.TabBar.prototype.handleTabDisable = function(e) {
  this.deselectIfSelected((e.target));
};
goog.ui.TabBar.prototype.handleTabHide = function(e) {
  this.deselectIfSelected((e.target));
};
goog.ui.TabBar.prototype.handleFocus = function(e) {
  if (!this.getHighlighted()) {
    this.setHighlighted(this.getSelectedTab() || (this.getChildAt(0)));
  }
};
goog.ui.TabBar.prototype.listenToTabEvents_ = function() {
  this.getHandler().listen(this, goog.ui.Component.EventType.SELECT, this.handleTabSelect).listen(this, goog.ui.Component.EventType.UNSELECT, this.handleTabUnselect).listen(this, goog.ui.Component.EventType.DISABLE, this.handleTabDisable).listen(this, goog.ui.Component.EventType.HIDE, this.handleTabHide);
};
goog.ui.TabBar.getOrientationFromLocation = function(location) {
  return location == goog.ui.TabBar.Location.START || location == goog.ui.TabBar.Location.END ? goog.ui.Container.Orientation.VERTICAL : goog.ui.Container.Orientation.HORIZONTAL;
};
goog.ui.registry.setDecoratorByClassName(goog.ui.TabBarRenderer.CSS_CLASS, function() {
  return new goog.ui.TabBar;
});
goog.provide("chatango.ui.TabBar");
goog.require("goog.ui.TabBar");
chatango.ui.TabBar = function(opt_location, opt_renderer, opt_domHelper) {
  goog.ui.TabBar.call(this, opt_location, opt_renderer, opt_domHelper);
};
goog.inherits(chatango.ui.TabBar, goog.ui.TabBar);
chatango.ui.TabBar.prototype.createDom = function(opt_domHelper) {
  goog.ui.TabBar.prototype.createDom.call(this, opt_domHelper);
  this.tabSelectorEl_ = goog.dom.createDom("div", {"class":"tab_selector"});
  goog.dom.appendChild(this.element_, this.tabSelectorEl_);
};
chatango.ui.TabBar.prototype.handleTabSelect = function(e) {
  goog.ui.TabBar.prototype.handleTabSelect.call(this, e);
  this.updateSelector();
};
chatango.ui.TabBar.prototype.setSelectedTab = function(tab) {
  goog.ui.TabBar.prototype.setSelectedTab.call(this, tab);
  this.updateSelector();
};
chatango.ui.TabBar.prototype.enterDocument = function() {
  chatango.ui.TabBar.superClass_.enterDocument.call(this);
  this.updateSelector();
};
chatango.ui.TabBar.prototype.updateSelector = function() {
  if (!this.selectedTab_ || !this.selectedTab_.getElement()) {
    return;
  }
  this.tabSelectorEl_.style.left = this.selectedTab_.getElement().offsetLeft + "px";
  this.tabSelectorEl_.style.width = this.selectedTab_.getElement().offsetWidth + "px";
};
goog.provide("chatango.pm.PmNavHeader");
goog.require("chatango.managers.Environment");
goog.require("chatango.pm.PmChatManager");
goog.require("chatango.pm.PmView");
goog.require("chatango.pm.StartChatUi");
goog.require("chatango.ui.TabBar");
goog.require("goog.ui.Tab");
chatango.pm.PmNavHeader = function(pmChatManager, pmLayoutType) {
  goog.base(this, pmChatManager, pmLayoutType);
  this.unreadMessages = 0;
  this.recentUnread_ = false;
  this.friendsUnread_ = false;
};
goog.inherits(chatango.pm.PmNavHeader, chatango.pm.PmView);
chatango.pm.PmNavHeader.Modes = {LISTS:"lists", CHATS:"chats"};
chatango.pm.PmNavHeader.EventType = {CHANGE_TAB:"change_tab"};
chatango.pm.PmNavHeader.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"id":"NAV_HDR"});
  this.tabBarWrapper_ = goog.dom.createDom("div", {"id":"NAV_TABS"});
  goog.dom.append(this.element_, this.tabBarWrapper_);
  this.tabs_ = new chatango.ui.TabBar;
  this.friendsTab_ = new goog.ui.Tab("");
  this.recentTab_ = new goog.ui.Tab("");
  this.strangersTab_ = new goog.ui.Tab("");
  this.tabs_.render(this.tabBarWrapper_);
  this.tabs_.addChild(this.recentTab_, true);
  this.tabs_.addChild(this.friendsTab_, true);
  goog.events.listen(this.friendsTab_, goog.ui.Component.EventType.ACTION, this.onTabClicked_, undefined, this);
  goog.events.listen(this.recentTab_, goog.ui.Component.EventType.ACTION, this.onTabClicked_, undefined, this);
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    this.tabs_.addChild(this.strangersTab_, true);
    goog.events.listen(this.strangersTab_, goog.ui.Component.EventType.ACTION, this.onTabClicked_, undefined, this);
  }
  if (this.pmLayoutType_ == chatango.pm.PmLayoutType.SINGLE_COL) {
    this.backBarWrapper_ = goog.dom.createDom("div", {"id":"NAV_BACK"});
    this.navigation_ = goog.dom.createDom("div", {"id":"NAV_BACK_BTN", "class":"link-text"});
    goog.dom.append(this.backBarWrapper_, this.navigation_);
    this.backArrow_ = new chatango.ui.icons.SvgBackArrowIcon;
    this.backArrow_.render(this.navigation_);
    this.navigationText_ = goog.dom.createDom("span");
    goog.dom.append(this.navigation_, this.navigationText_);
    this.navAlertText_ = goog.dom.createDom("span", {"id":"NAV_ALERT"});
    goog.dom.append(this.navigation_, this.navAlertText_);
    goog.events.listen(this.navigation_, goog.events.EventType.CLICK, this.onNavClicked_, false, this);
    goog.dom.append(this.element_, this.backBarWrapper_);
    this.backBarWrapper_.style.display = "none";
  }
  this.addAndroidDownloadLink(this.tabs_.getElement());
  this.updateCopy();
};
chatango.pm.PmNavHeader.prototype.updateCopy = function() {
  this.friendsTab_.setContent(this.lm_.getString("pm", "friends"));
  this.recentTab_.setContent(this.lm_.getString("pm", "recent"));
  this.strangersTab_.setContent(this.lm_.getString("pm", "strangers"));
  goog.dom.classes.enable(this.friendsTab_.getElement(), "unread", this.friendsUnread_);
  goog.dom.classes.enable(this.recentTab_.getElement(), "unread", this.recentUnread_);
  if (this.navigationText_) {
    this.navigationText_.innerHTML = this.lm_.getString("pm", "all_convs");
    if (this.unreadMessages > 0) {
      this.navigationText_.innerHTML += ' <span style="color: #888">(' + this.unreadMessages + " new)</span>";
    }
  }
  var that = this;
  setTimeout(function() {
    that.tabs_.updateSelector();
  }, 0);
};
chatango.pm.PmNavHeader.prototype.onTabClicked_ = function(e) {
  var mode;
  switch(e.target) {
    case this.friendsTab_:
      mode = chatango.pm.StartChatUi.TabMode.FRIENDS;
      break;
    case this.recentTab_:
      mode = chatango.pm.StartChatUi.TabMode.RECENT;
      break;
    case this.strangersTab_:
    ;
    default:
      mode = chatango.pm.StartChatUi.TabMode.STRANGERS;
      break;
  }
  this.dispatchEvent(new chatango.events.Event(chatango.pm.PmNavHeader.EventType.CHANGE_TAB, mode));
};
chatango.pm.PmNavHeader.prototype.onNavClicked_ = function(e) {
  this.dispatchEvent(chatango.events.EventType.BACK);
};
chatango.pm.PmNavHeader.prototype.changeTab = function(tab) {
  if (tab == chatango.pm.StartChatUi.TabMode.RECENT) {
    this.tabs_.setSelectedTab(this.recentTab_);
  } else {
    if (tab == chatango.pm.StartChatUi.TabMode.FRIENDS) {
      this.tabs_.setSelectedTab(this.friendsTab_);
    } else {
      if (tab == chatango.pm.StartChatUi.TabMode.STRANGERS) {
        this.tabs_.setSelectedTab(this.strangersTab_);
      }
    }
  }
  this.tabs_.updateSelector();
};
chatango.pm.PmNavHeader.prototype.setUnreadTabs = function(recentTab, friendsTab) {
  this.recentUnread_ = recentTab;
  this.friendsUnread_ = friendsTab;
};
chatango.pm.PmNavHeader.prototype.switchMode = function(mode) {
  if (this.pmLayoutType_ != chatango.pm.PmLayoutType.SINGLE_COL) {
    return;
  }
  if (mode == chatango.pm.PmNavHeader.Modes.LISTS) {
    this.backBarWrapper_.style.display = "none";
    this.tabBarWrapper_.style.display = "";
  } else {
    if (mode == chatango.pm.PmNavHeader.Modes.CHATS) {
      this.tabBarWrapper_.style.display = "none";
      this.backBarWrapper_.style.display = "";
    }
  }
};
chatango.pm.PmNavHeader.prototype.getHeight = function() {
  return this.element_ ? this.element_.offsetHeight : 0;
};
chatango.pm.PmNavHeader.prototype.disposeInternal = function() {
  if (this.friendsTab_) {
    goog.events.unlisten(this.friendsTab_, goog.ui.Component.EventType.ACTION, this.onTabClicked_, undefined, this);
    this.friendsTab_.dispose();
    this.friendsTab_ = null;
  }
  if (this.recentTab_) {
    goog.events.unlisten(this.recentTab_, goog.ui.Component.EventType.ACTION, this.onTabClicked_, undefined, this);
    this.recentTab_.dispose();
    this.recentTab_ = null;
  }
  if (this.strangersTab_) {
    goog.events.unlisten(this.strangersTab_, goog.ui.Component.EventType.ACTION, this.onTabClicked_, undefined, this);
    this.strangersTab_.dispose();
    this.strangersTab_ = null;
  }
  if (this.tabs_) {
    this.tabs_.dispose();
    this.tabs_ = null;
  }
  if (this.backArrow_) {
    this.backArrow_.dispose();
    this.backArrow_ = null;
  }
  if (this.navigation_) {
    goog.events.unlisten(this.navigation_, goog.events.EventType.CLICK, this.onNavClicked_, false, this);
  }
  goog.base(this, "disposeInternal");
};
goog.provide("chatango.pm.Pm");
goog.require("chatango.audio.AudioController");
goog.require("chatango.embed.AppComm");
goog.require("chatango.login.Session");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.networking.PmConnection");
goog.require("chatango.networking.PmConnectionEvent");
goog.require("chatango.pm.Chats");
goog.require("chatango.pm.Lists");
goog.require("chatango.pm.PmChatManager");
goog.require("chatango.pm.PmConnectionUI");
goog.require("chatango.pm.PmContextType");
goog.require("chatango.pm.PmHeader");
goog.require("chatango.pm.PmLayoutType");
goog.require("chatango.pm.PmNavHeader");
goog.require("chatango.pm.PmSettings");
goog.require("chatango.pm.StartChatUi");
goog.require("chatango.pm.lists.FriendsList");
goog.require("chatango.pm.lists.RecentChatList");
goog.require("chatango.pm.lists.StrangersList");
goog.require("chatango.settings.servers.BaseDomain");
goog.require("chatango.strings.PmStrings");
goog.require("chatango.users.UserManager");
goog.require("goog.events");
goog.require("goog.math.Size");
goog.require("goog.module.ModuleManager");
goog.require("goog.ui.Component");
goog.require("goog.window");
chatango.pm.Pm = function(session, opt_LayoutType, opt_context, opt_chatsToOpen, stage, opt_toList, opt_mcMod) {
  goog.ui.Component.call(this);
  this.mcMod_ = opt_mcMod;
  this.stage_ = stage;
  this.session_ = session;
  this.scaleManager_ = chatango.managers.ScaleManager.getInstance();
  this.scaleManager_.setWindowSize(document.body.clientWidth, document.body.clientHeight);
  this.pmSettings_ = new chatango.pm.PmSettings;
  chatango.managers.LanguageManager.getInstance().getStringPack("pm", chatango.strings.PmStrings, function() {
  }, this);
  this.context_ = opt_context ? opt_context : chatango.pm.PmContextType.STAND_ALONE;
  if (this.context_ == chatango.pm.PmContextType.STAND_ALONE) {
    this.scaleManager_.setStandAlonePm(true);
    if (chatango.managers.Environment.getInstance().isAndroid()) {
      this.scaleManager_.useFixedScale(true);
    }
  }
  this.scaleManager_.updateScale();
  this.groupHandle_ = null;
  this.pmChatManager_ = new chatango.pm.PmChatManager(this.session_, this.pmSettings_, this.context_);
  this.pmConnection_ = this.pmChatManager_.getConnection();
  this.layoutType_ = opt_LayoutType ? opt_LayoutType : chatango.managers.Environment.getInstance().isMobile() ? chatango.pm.PmLayoutType.SINGLE_COL : chatango.pm.PmLayoutType.DOUBLE_COL;
  this.RecentChatList_ = new chatango.pm.lists.RecentChatList(this.pmChatManager_);
  this.FriendsList_ = new chatango.pm.lists.FriendsList(this.pmChatManager_);
  this.StrangersList_ = new chatango.pm.lists.StrangersList(this.pmChatManager_);
  this.header_ = new chatango.pm.PmHeader;
  this.bd_ = new chatango.settings.servers.BaseDomain;
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  var viewPortSize = this.vsm_.getSize();
  if (this.stage_) {
    goog.style.setSize(this.stage_, window.innerWidth, window.innerHeight);
  }
  if (chatango.DEBUG) {
    console.log("Viewport Size: ", viewPortSize.width, viewPortSize.height);
    console.log("Client Size: ", document.body.clientWidth, document.body.clientHeight);
    console.log("Offset Size: ", document.body.offsetWidth, document.body.offsetHeight);
    console.log("Window Top Size: ", window.innerWidth, window.innerHeight);
  }
  this.curTabKey_ = chatango.users.UserManager.getInstance().currentUser.getSid().toLowerCase() + "_curTab";
  this.curTab_ = chatango.pm.StartChatUi.TabMode.STRANGERS;
  this.navHeader_ = new chatango.pm.PmNavHeader(this.pmChatManager_, this.layoutType_);
  this.lists_ = new chatango.pm.Lists(this.pmChatManager_, this.layoutType_, this.RecentChatList_, this.FriendsList_, this.StrangersList_, this.header_, this.navHeader_, this.stage_);
  this.chats_ = new chatango.pm.Chats(this.pmChatManager_, this.layoutType_, this.header_, this.navHeader_, this.stage_);
  this.focusedView_ = this.context_ === chatango.pm.PmContextType.IN_GROUP && !opt_toList ? this.chats_ : this.lists_;
  this.lastSize_ = this.vsm_.getSize();
  this.chatsToOpen_ = opt_toList ? null : opt_chatsToOpen;
  this.settingsCogIcon_ = new chatango.ui.icons.SvgSettingsCogIcon(chatango.ui.buttons.IconButton.USE_USER_DEFINED_COLOR);
  this.volumeControl_ = new chatango.ui.VolumeControl;
  this.statusEvents_ = [chatango.networking.PmConnectionEvent.EventType.status, chatango.networking.PmConnectionEvent.EventType.wlonline, chatango.networking.PmConnectionEvent.EventType.wloffline, chatango.networking.PmConnectionEvent.EventType.wlapp];
  goog.events.listen(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.OK, this.onLoginOK_, false, this);
  goog.events.listen(this.pmConnection_, this.statusEvents_, this.onStatusChange_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.pm.PmChatManager.EventType.wl, this.onFriendsListLoaded_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.pm.PmChatManager.EventType.CONNECT_FAIL, this.onConnectFail_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.pm.PmChatManager.EventType.SWITCH_TO_CHAT, this.onConnectSuccess_, false, this);
  goog.events.listen(this.pmChatManager_, chatango.pm.PmChatManager.EventType.NEW_ONLINE_MESSAGE, this.onNewOnlineMessage_, false, this);
  goog.events.listen(this.header_, chatango.events.EventType.CLOSE, this.onClose_, false, this);
  goog.events.listen(this.navHeader_, chatango.pm.PmNavHeader.EventType.CHANGE_TAB, this.onChangeTab_, false, this);
  goog.events.listen(this.chats_, chatango.events.EventType.CLOSE, this.onClose_, false, this);
  goog.events.listen(this.navHeader_, chatango.events.EventType.BACK, this.onBackToLists_, false, this);
  goog.events.listen(this.chats_, chatango.events.EventType.RESET_UNREAD, this.onResetUnread_, false, this);
  goog.events.listen(this.vsm_, goog.events.EventType.RESIZE, this.onResize, false, this);
};
goog.inherits(chatango.pm.Pm, goog.ui.Component);
chatango.pm.Pm.prototype.getConnection = function() {
  return this.pmConnection_;
};
chatango.pm.Pm.prototype.setGroupHandle = function(h) {
  this.groupHandle_ = h;
};
chatango.pm.Pm.prototype.onPageShow = function() {
  if (!this.pmConnection_.isConnectedOrConnecting()) {
    this.pmConnection_.connect();
  }
};
chatango.pm.Pm.prototype.toggleViews_ = function() {
  var isMobile = chatango.managers.Environment.getInstance().isMobile();
  if (this.layoutType_ == chatango.pm.PmLayoutType.SINGLE_COL) {
    if (this.focusedView_ == this.lists_) {
      goog.style.showElement(this.lists_.getElement(), true);
      goog.style.showElement(this.chats_.getElement(), false);
      if (isMobile) {
        this.settingsCogIcon_.exitDocument();
        this.settingsCogIcon_.render(this.lists_.footerEl_);
        this.volumeControl_.exitDocument();
        this.volumeControl_.render(this.lists_.footerEl_);
      }
    } else {
      goog.style.showElement(this.lists_.getElement(), false);
      goog.style.showElement(this.chats_.getElement(), true);
      if (isMobile) {
        this.settingsCogIcon_.exitDocument();
        this.settingsCogIcon_.render(this.chats_.footerEl_);
        this.volumeControl_.exitDocument();
        this.volumeControl_.render(this.chats_.footerEl_);
      }
    }
  }
};
chatango.pm.Pm.prototype.createDom = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.element_ = goog.dom.createDom("div", {"id":"PM"});
  if (this.layoutType_ == chatango.pm.PmLayoutType.DOUBLE_COL) {
    goog.dom.classes.add(this.element_, "double_col");
  }
  this.header_.render(this.element_);
  var mode = "PM";
  this.header_.setContent(mode + ": <b>" + chatango.users.UserManager.getInstance().currentUser.getName() + "</b>");
  if (this.context_ === chatango.pm.PmContextType.STAND_ALONE) {
    this.header_.setPreviousPage(lm.getString("pm", "header_home_link"), "http://" + this.bd_.getBaseDomain());
  } else {
    this.header_.setPreviousCallback(this.groupHandle_, this.onClose_.bind(this));
  }
  this.pmChatManager_.pmConnectUI_.render(this.stage_);
  this.navHeader_.render(this.element_);
  this.lists_.render(this.element_);
  this.chats_.render(this.element_);
  this.initializeTab_();
  goog.events.listen(this.settingsCogIcon_, chatango.events.EventType.LOAD_SETTINGS_MODULE, this.loadSettings_, false, this);
  if (chatango.managers.Environment.getInstance().isMobile()) {
    this.volumeControl_.render(this.lists_.footerEl_);
    this.settingsCogIcon_.render(this.lists_.footerEl_);
  } else {
    this.volumeControl_.render(this.chats_.footerEl_);
    this.settingsCogIcon_.render(this.chats_.footerEl_);
  }
  this.lists_.volumeControl_ = this.volumeControl_;
  this.chats_.volumeControl_ = this.volumeControl_;
  this.lists_.settingsCogIcon_ = this.settingsCogIcon_;
  this.chats_.settingsCogIcon_ = this.settingsCogIcon_;
  goog.events.listen(this.settingsCogIcon_.getElement(), goog.events.EventType.CLICK, function() {
    this.settingsCogIcon_.dispatchEvent(chatango.events.EventType.LOAD_SETTINGS_MODULE);
  }, false, this);
  this.draw();
  this.kb_ = chatango.managers.Keyboard.getInstance();
  goog.events.listen(this.kb_, [chatango.managers.Keyboard.EventType.KEYBOARD_RAISED, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED], this.onKeyboard_, true, this);
};
chatango.pm.Pm.prototype.loadSettings_ = function(e) {
  goog.module.ModuleManager.getInstance().execOnLoad("PmExtrasModule", function() {
    var settingsDialog = this.getPmExtrasModule_().openSettingsDialog(this.settingsCogIcon_.getElement(), this.focusedView_ == this.lists_);
    goog.events.listen(settingsDialog, [chatango.events.EventType.PM_SETTINGS_EDIT_PROFILE, chatango.events.EventType.PM_SETTINGS_BLOCKLIST, chatango.events.EventType.PM_SETTINGS_CHANGE_VIEW, chatango.events.EventType.PM_SETTINGS_LOGOUT], this.processSettings_, false, this);
  }, this);
};
chatango.pm.Pm.prototype.removeSettingsDialogListeners_ = function(settingsDialog) {
  goog.events.unlisten(settingsDialog, [chatango.events.EventType.PM_SETTINGS_EDIT_PROFILE, chatango.events.EventType.PM_SETTINGS_BLOCKLIST, chatango.events.EventType.PM_SETTINGS_CHANGE_VIEW, chatango.events.EventType.PM_SETTINGS_LOGOUT], this.processSettings_, false, this);
};
chatango.pm.Pm.prototype.processSettings_ = function(e) {
  var lm = chatango.managers.LanguageManager.getInstance();
  switch(e.type) {
    case chatango.events.EventType.PM_SETTINGS_BLOCKLIST:
      var msg = lm.getString("pm", "empty_block_list");
      if (chatango.managers.Environment.getInstance().isMobile()) {
        msg = lm.getString("pm", "block_list_use_desktop");
      }
      this.blockListStub = new chatango.ui.ScrollableTextDialog(msg);
      this.blockListStub.setResizable(false);
      this.blockListStub.setVisible(true);
      this.blockListStub.draw();
      break;
    case chatango.events.EventType.PM_SETTINGS_EDIT_PROFILE:
      var cUser = chatango.users.UserManager.getInstance().currentUser;
      if (cUser) {
        cUser.openEditProfileDialog(true);
      }
      break;
    case chatango.events.EventType.PM_SETTINGS_CHANGE_VIEW:
      var tabBar = this.navHeader_.tabs_.getElement();
      var top = tabBar.offsetHeight + tabBar.offsetTop;
      if (this.focusedView_ === this.lists_) {
        if (this.lists_.curTab_ === chatango.pm.StartChatUi.TabMode.RECENT) {
          goog.dom.classes.toggle(this.lists_.recentPane_.viewModes_, "slidOut");
          this.lists_.recentPane_.viewModes_.style.top = top + "px";
        } else {
          if (this.lists_.curTab_ == chatango.pm.StartChatUi.TabMode.FRIENDS) {
            goog.dom.classes.toggle(this.lists_.friendsPane_.viewModes_, "slidOut");
            this.lists_.friendsPane_.viewModes_.style.top = top + "px";
          } else {
            goog.dom.classes.toggle(this.lists_.strangersPane_.viewModes_, "slidOut");
            this.lists_.strangersPane_.viewModes_.style.top = top + "px";
          }
        }
        this.draw();
      }
      break;
    case chatango.events.EventType.PM_SETTINGS_LOGOUT:
      goog.net.cookies.set("un", "", -31536E3, "/");
      goog.net.cookies.set("pw", "", -31536E3, "/");
      goog.net.cookies.set("sessionid", "", -31536E3, "/");
      window.top.location.href = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/signout";
      break;
    default:
      break;
  }
  e.target.handleBlur();
};
chatango.pm.Pm.prototype.getPmExtrasModule_ = function() {
  if (typeof this.pmExtrasModule_ === "undefined") {
    this.pmExtrasModule_ = new chatango.modules.PmExtrasModule;
  }
  return this.pmExtrasModule_;
};
chatango.pm.Pm.prototype.onEnterDocument = function() {
  this.draw();
};
chatango.pm.Pm.prototype.draw = function(keyboardUp) {
  this.toggleViews_();
  this.pmChatManager_.pmConnectUI_.draw_();
  this.updateNavHeader_();
  this.lists_.draw(keyboardUp);
  this.chats_.draw(keyboardUp);
  this.drawScheduled_ = false;
  var stage_size = goog.style.getSize(this.stage_);
  this.constrainDialogsToScreen(new goog.math.Rect(0, 0, stage_size.width, stage_size.height));
};
chatango.pm.Pm.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  var user = chatango.users.UserManager.getInstance().currentUser;
  if (user) {
    user.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.blockListStub) {
    chatango.utils.display.constrainToStage(this.blockListStub.getElement(), opt_stageRect, true);
  }
  this.pmChatManager_.constrainDialogsToScreen(opt_stageRect);
};
chatango.pm.Pm.prototype.onLoginOK_ = function(e) {
  if (this.context_ == chatango.pm.PmContextType.IN_GROUP && this.mcMod_) {
    this.mcMod_.disconnect();
  }
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  cUser.loadProfile();
  if (this.chatsToOpen_ && this.chatsToOpen_.length > 0) {
    var len = Math.min(this.chats_.getMaxChats(), this.chatsToOpen_.length);
    var uid;
    var userType;
    var targetUser;
    for (var i = 0;i < len;i++) {
      uid = this.chatsToOpen_[i]["uid"];
      if (this.chatsToOpen_[i]["reply"]) {
        userType = this.chatsToOpen_[i]["userType"];
        targetUser = chatango.users.UserManager.getInstance().addUser(chatango.pm.PmChatManager.REFERRER_PREFIX + uid, uid, userType);
        var chat = this.pmChatManager_.getChat(uid, cUser, [targetUser], null, true);
        this.chats_.renderChat(chat);
      } else {
        this.pmChatManager_.connectToUser(uid);
      }
    }
    this.focusedView_ = this.chats_;
    this.draw();
  }
  this.chatsToOpen_ = [];
};
chatango.pm.Pm.prototype.onConnectFail_ = function(e) {
  var userNameOrEmail = e.getString();
  this.lists_.connectFailed(userNameOrEmail);
};
chatango.pm.Pm.prototype.onConnectSuccess_ = function(e) {
  if (this.layoutType_ == chatango.pm.PmLayoutType.SINGLE_COL) {
    if (this.focusedView_ != this.chats_) {
      this.focusedView_ = this.chats_;
      this.draw();
    }
  }
};
chatango.pm.Pm.prototype.onFriendsListLoaded_ = function(e) {
  this.initializeTab_();
  this.draw();
};
chatango.pm.Pm.prototype.updateCopy = function() {
  if (this.lists_) {
    this.lists_.updateCopy();
  }
  if (this.chats_) {
    this.chats_.updateCopy();
  }
};
chatango.pm.Pm.prototype.initializeTab_ = function() {
  if (!localStorage.getItem(this.curTabKey_)) {
    if (this.RecentChatList_.length() === 0 && this.FriendsList_.length() > 0) {
      this.curTab_ = chatango.pm.StartChatUi.TabMode.FRIENDS;
    } else {
      if (this.RecentChatList_.length() > 0) {
        this.curTab_ = chatango.pm.StartChatUi.TabMode.RECENT;
      } else {
        this.curTab_ = chatango.pm.StartChatUi.TabMode.STRANGERS;
      }
    }
  } else {
    this.curTab_ = localStorage.getItem(this.curTabKey_);
  }
  if (this.curTab_ == chatango.pm.StartChatUi.TabMode.STRANGERS && !chatango.managers.Environment.getInstance().isAndroidApp()) {
    this.curTab_ = chatango.pm.StartChatUi.TabMode.RECENT;
  }
  this.lists_.changeTab(this.curTab_);
  this.navHeader_.changeTab(this.curTab_);
};
chatango.pm.Pm.prototype.onChangeTab_ = function(e) {
  this.curTab_ = e.getData();
  localStorage.setItem(this.curTabKey_, this.curTab_);
  this.lists_.changeTab(this.curTab_, true);
};
chatango.pm.Pm.prototype.onResize = function(e) {
  var lastSize = this.vsm_.getSize();
  if (chatango.DEBUG) {
    console.log("Pm onResize w: " + lastSize.width + ", h: " + lastSize.height);
  }
  if (this.lastSize_ == lastSize) {
    if (chatango.DEBUG) {
      console.log("Same as last size, return");
    }
    return;
  }
  if (!chatango.managers.Environment.getInstance().isIOS()) {
    goog.style.setSize(this.stage_, lastSize.width, lastSize.height);
    this.scaleManager_.setWindowSize(lastSize.width, lastSize.height);
  }
  this.lastSize_ = lastSize;
  var ts = (new Date).getTime();
  if (!this.lastResizeTime_ || ts - this.lastResizeTime_ > 100) {
    this.lastResizeTime_ = ts;
    this.draw();
  } else {
    if (this.drawScheduled_) {
      return;
    }
    this.drawScheduled_ = true;
    var that = this;
    setTimeout(function() {
      that.draw();
    }, 10);
    return;
  }
};
chatango.pm.Pm.prototype.onOrientationChange = function(data) {
  var width = parseInt(data.width.replace("px", ""), 10);
  var height = parseInt(data.height.replace("px", ""), 10);
  if (chatango.DEBUG) {
    console.log("pm onOrientationChange: ", data.width, data.height);
  }
  goog.style.setSize(this.stage_, data.width, data.height);
  this.scaleManager_.setWindowSize(data.width, data.height);
  this.draw();
};
chatango.pm.Pm.prototype.onClose_ = function(e) {
  this.pmChatManager_.pmConnectUI_.setActive(false);
  if (this.context_ == chatango.pm.PmContextType.IN_GROUP) {
    this.dispatchEvent(chatango.events.EventType.CLOSE);
  } else {
    this.pmConnection_.selfKickOff(true);
    var bd = chatango.managers.ManagerManager.getInstance().getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain();
    goog.window.open("http://" + bd, {"target":"_parent"});
  }
};
chatango.pm.Pm.prototype.onNewOnlineMessage_ = function(e) {
  var chat = e.getData();
  var messageData = e.getObject();
  var chatId = e.getString();
  var visiblyRendered = true;
  if (!chat.getChatView().isInDocument() || this.layoutType_ == chatango.pm.PmLayoutType.SINGLE_COL && this.focusedView_ != this.chats_) {
    visiblyRendered = false;
  }
  chat.receiveMessage(messageData, visiblyRendered);
  if (chatango.managers.Environment.getInstance().isAndroidApp()) {
    chatango.embed.AppComm.getInstance().alertMessage(messageData.getName(), messageData.getPlainText());
  }
  if (!visiblyRendered) {
    var user = chat.getOtherUser();
    var isFriend = !!this.lists_.friendsList_.list_[user.getName()];
    goog.module.ModuleManager.getInstance().execOnLoad("PmExtrasModule", function() {
      var alertDialog = this.getPmExtrasModule_().openAlertDialog(user, messageData, isFriend);
      goog.events.listen(alertDialog, chatango.ui.TopAlertDialog.EventType.ANIM_OUT_COMPLETE, this.onAlertClosed_, false, this);
      goog.events.listen(alertDialog, chatango.events.MessageAlertEvent.EventType.IGNORE, this.onIgnore_, false, this);
      goog.events.listen(alertDialog, chatango.events.MessageAlertEvent.EventType.REPLY, this.onReply_, false, this);
      goog.events.listen(alertDialog, chatango.events.MessageAlertEvent.EventType.BLOCK, this.onBlock_, false, this);
    }, this);
    user.setLastInteracted((new Date).getTime());
    user.setNumUnreadPmMessages(user.getNumUnreadPmMessages() + 1);
    this.navHeader_.unreadMessages++;
    this.updateNavHeader_();
    this.lists_.unreadMessages++;
    this.lists_.updateCopy();
    this.chats_.unreadMessages++;
    this.chats_.updateCopy();
  }
  chatango.audio.AudioController.getInstance().playUrl(chatango.audio.AudioController.AlertType.MESSAGE_RECEIVED, chatango.audio.AudioController.Streams.PM_STREAM);
};
chatango.pm.Pm.prototype.removeAlertDialogListeners_ = function(alertDialog) {
  goog.events.unlisten(alertDialog, chatango.ui.TopAlertDialog.EventType.ANIM_OUT_COMPLETE, this.onAlertClosed_, false, this);
  goog.events.unlisten(alertDialog, chatango.events.MessageAlertEvent.EventType.IGNORE, this.onIgnore_, false, this);
  goog.events.unlisten(alertDialog, chatango.events.MessageAlertEvent.EventType.REPLY, this.onReply_, false, this);
  goog.events.unlisten(alertDialog, chatango.events.MessageAlertEvent.EventType.BLOCK, this.onBlock_, false, this);
};
chatango.pm.Pm.prototype.onIgnore_ = function(e) {
  this.onAlertClosed_(e);
};
chatango.pm.Pm.prototype.onReply_ = function(e) {
  var uid = e.getUid();
  if (uid) {
    this.pmChatManager_.switchToExistingChat(uid);
  }
  this.onAlertClosed_(e);
};
chatango.pm.Pm.prototype.onBlock_ = function(e) {
  var sid = e.getUid();
  var userType = e.getUserType();
  this.pmConnection_.send("block:" + sid + ":" + sid + ":" + userType);
  this.onAlertClosed_(e);
};
chatango.pm.Pm.prototype.onAlertClosed_ = function(e) {
  var alertDialog = e.target;
  if (!alertDialog) {
    return;
  }
  this.removeAlertDialogListeners_(alertDialog);
  alertDialog.dispose();
  alertDialog = null;
};
chatango.pm.Pm.prototype.getPmExtrasModule_ = function() {
  if (typeof this.pmExtrasModule_ === "undefined") {
    this.pmExtrasModule_ = new chatango.modules.PmExtrasModule;
  }
  return this.pmExtrasModule_;
};
chatango.pm.Pm.prototype.onBackToLists_ = function(e) {
  if (this.layoutType_ == chatango.pm.PmLayoutType.SINGLE_COL) {
    if (this.focusedView_ != this.lists_) {
      this.focusedView_ = this.lists_;
      this.draw();
      this.lists_.refreshScroll();
      this.lists_.updateCopy();
    }
  }
};
chatango.pm.Pm.prototype.updateNavHeader_ = function() {
  if (this.focusedView_ == this.lists_) {
    this.navHeader_.switchMode(chatango.pm.PmNavHeader.Modes.LISTS);
  } else {
    if (this.focusedView_ == this.chats_) {
      this.navHeader_.switchMode(chatango.pm.PmNavHeader.Modes.CHATS);
    }
  }
  this.navHeader_.setUnreadTabs(this.RecentChatList_.getNumUnreadPmMessages(), this.FriendsList_.getNumUnreadPmMessages());
  this.navHeader_.updateCopy();
};
chatango.pm.Pm.prototype.onStatusChange_ = function(e) {
  var userID, isOnline, isAppOnline, lastActive;
  switch(e.type) {
    case chatango.networking.PmConnectionEvent.EventType.status:
      userID = e.data[1];
      lastActive = e.data[2] * 1E3;
      isOnline = e.data[3] === chatango.pm.PmChatManager.status.ONLINE;
      isAppOnline = e.data[3] === chatango.pm.PmChatManager.status.APP_ONLINE;
      this.pmChatManager_.dispatchEvent(e);
      break;
    case chatango.networking.PmConnectionEvent.EventType.wlonline:
      userID = e.data[1];
      lastActive = e.data[2] * 1E3;
      isOnline = true;
      isAppOnline = false;
      break;
    case chatango.networking.PmConnectionEvent.EventType.wlapp:
      userID = e.data[1];
      lastActive = e.data[2] * 1E3;
      isOnline = false;
      isAppOnline = true;
      break;
    case chatango.networking.PmConnectionEvent.EventType.wloffline:
      userID = e.data[1];
      lastActive = e.data[2] * 1E3;
      isOnline = false;
      isAppOnline = false;
      break;
    default:
      break;
  }
  var statusChanged;
  if (this.RecentChatList_.containsUser(userID)) {
    statusChanged = this.RecentChatList_.setUserStatus(userID, isOnline, isAppOnline, lastActive);
    this.RecentChatList_.dispatchUpdateEvent();
  }
  if (this.FriendsList_.containsUser(userID)) {
    this.FriendsList_.setUserStatus(userID, isOnline, isAppOnline, lastActive, statusChanged);
    this.FriendsList_.dispatchUpdateEvent();
  }
};
chatango.pm.Pm.prototype.onResetUnread_ = function(e) {
  this.lists_.resetUnread(e.data);
  this.lists_.updateCopy();
  this.chats_.unreadMessages = 0;
  this.chats_.updateCopy();
  this.navHeader_.unreadMessages = 0;
  this.updateNavHeader_();
  this.navHeader_.updateCopy();
};
chatango.pm.Pm.prototype.onKeyboard_ = function(e) {
  switch(e.type) {
    case chatango.managers.Keyboard.EventType.KEYBOARD_RAISED:
      this.setKeyBoardIsRaised_(true);
      break;
    case chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED:
      this.setKeyBoardIsRaised_(false);
      this.lists_.startChatUi_.inputEl_.blur();
      this.chats_.blurInput();
      break;
    default:
      break;
  }
};
chatango.pm.Pm.prototype.setKeyBoardIsRaised_ = function(bool) {
  var isLandscapeIos = chatango.managers.Environment.getInstance().isIOS() && this.scaleManager_.getOrientation() == "l";
  goog.dom.classes.enable(this.element_, "kb-up", bool && !isLandscapeIos);
  this.draw(bool);
};
chatango.pm.Pm.prototype.openPmChat = function(sid) {
  this.pmChatManager_.connectToUser(sid);
};
chatango.pm.Pm.prototype.disposeInternal = function() {
  this.focusedView_ = null;
  if (this.pmChatManager_.pmConnectUI_) {
    this.pmChatManager_.pmConnectUI_.dispose();
  }
  if (this.pmConnection_) {
    goog.events.unlisten(this.pmConnection_, chatango.networking.PmConnectionEvent.EventType.OK, this.onLoginOK_, false, this);
    this.pmConnection_.dispose();
  }
  if (this.pmChatManager_) {
    goog.events.unlisten(this.pmChatManager_, chatango.pm.PmChatManager.EventType.wl, this.onFriendsListLoaded_, false, this);
    goog.events.unlisten(this.pmChatManager_, chatango.pm.PmChatManager.EventType.CONNECT_FAIL, this.onConnectFail_, false, this);
    goog.events.unlisten(this.pmChatManager_, chatango.pm.PmChatManager.EventType.SWITCH_TO_CHAT, this.onConnectSuccess_, false, this);
    goog.events.unlisten(this.pmChatManager_, chatango.pm.PmChatManager.EventType.NEW_ONLINE_MESSAGE, this.onNewOnlineMessage_, false, this);
    this.pmChatManager_.dispose();
  }
  if (this.lists_) {
    this.lists_.dispose();
  }
  if (this.navHeader_) {
    goog.events.unlisten(this.navHeader_, chatango.pm.PmNavHeader.EventType.CHANGE_TAB, this.onChangeTab_, false, this);
    goog.events.unlisten(this.navHeader_, chatango.events.EventType.BACK, this.onBackToLists_, false, this);
    this.navHeader_.dispose();
  }
  if (this.chats_) {
    goog.events.unlisten(this.chats_, chatango.events.EventType.CLOSE, this.onClose_, false, this);
    this.chats_.dispose();
  }
  if (this.header_) {
    this.header_.dispose();
  }
  if (this.RecentChatList_) {
    this.RecentChatList_.dispose();
  }
  if (this.FriendsList_) {
    this.FriendsList_.dispose();
  }
  if (this.StrangersList_) {
    this.StrangersList_.dispose();
  }
  if (this.pmSettings_) {
    this.pmSettings_.dispose();
  }
  goog.events.unlisten(this.vsm_, goog.events.EventType.RESIZE, this.onResize, false, this);
  goog.events.unlisten(this.kb_, [chatango.managers.Keyboard.EventType.KEYBOARD_RAISED, chatango.managers.Keyboard.EventType.KEYBOARD_LOWERED], this.onKeyboard_, true, this);
  this.vsm_ = null;
  this.kb_ = null;
  this.chats_ = null;
  this.lists_ = null;
  this.RecentChatList_ = null;
  this.FriendsList_ = null;
  this.StrangersList_ = null;
  this.pmChatManager_ = null;
  this.pmConnection_ = null;
  this.pmSettings_ = null;
  this.header_ = null;
  this.mcMod_ = null;
  goog.base(this, "disposeInternal");
  if (chatango.DEBUG) {
    console.log("pm disposed!");
  }
};
goog.provide("chatango.modules.PmModule");
goog.require("chatango.events.EventType");
goog.require("chatango.login.Session");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.ResourceManager");
goog.require("chatango.modules.CommonCoreModule");
goog.require("chatango.networking.RequestFactory");
goog.require("chatango.pm.Pm");
goog.require("chatango.pm.PmContextType");
goog.require("chatango.pm.PmLayoutType");
goog.require("chatango.settings.servers.SubDomain");
goog.require("chatango.strings.PmStrings");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.Encode");
goog.require("goog.array");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
goog.require("goog.net.cookies");
chatango.modules.PmModule = function(initData) {
  if (chatango.DEBUG) {
    console.log("PmModule constructor", initData);
  }
  goog.events.EventTarget.call(this);
  this.managers_ = chatango.managers.ManagerManager.getInstance();
  if (!this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType)) {
    this.managers_.setManager(chatango.settings.servers.BaseDomain.ManagerType, new chatango.settings.servers.BaseDomain);
  }
  if (!this.managers_.getManager(chatango.login.Session.ManagerType)) {
    this.managers_.setManager(chatango.login.Session.ManagerType, new chatango.login.Session);
  }
  if (!this.managers_.getManager(chatango.managers.ResourceManager.ManagerType)) {
    this.managers_.setManager(chatango.managers.ResourceManager.ManagerType, new chatango.managers.ResourceManager);
  }
  this.session_ = this.managers_.getManager(chatango.login.Session.ManagerType);
  this.layoutMode_ = null;
  this.context_ = null;
  this.stage_ = null;
  this.chatsToOpen_ = null;
  if (initData && initData["styles"] && initData["styles"]["pm"]) {
    if (chatango.DEBUG) {
      console.log("This is an embedded PM on the sellers page");
    }
    this.context_ = chatango.pm.PmContextType.STAND_ALONE;
    this.stage_ = document.getElementById("cpm");
    var loc = initData["loc"];
    if (loc) {
      if (loc.indexOf("?") != -1) {
        var qStrArr = loc.split("?")[1].split("&");
        if (goog.array.contains(qStrArr, "m")) {
          if (chatango.DEBUG) {
            console.log("This has an m for mobile in the query string");
          }
          this.layoutMode_ = chatango.pm.PmLayoutType.SINGLE_COL;
        }
      }
    }
    this.pm_ = null;
    var name = initData["styles"]["sellerid"];
    if (initData["styles"]["pm_open"]) {
      this.chatsToOpen_ = [{"uid":initData["styles"]["pm_open"]}];
    }
    if (!name) {
      return;
    }
    chatango.users.UserManager.getInstance().addCurrentUser(null, name, chatango.users.User.UserType.SELLER);
    var token = initData["styles"]["s"];
    if (!token) {
      return;
    }
    chatango.users.UserManager.getInstance().currentUser.setToken(token);
    this.openPm();
    this.pm_.render(document.getElementById("cpm"));
  } else {
    if (chatango.DEBUG) {
      console.log("This is a PM loaded into a group");
    }
    this.context_ = chatango.pm.PmContextType.IN_GROUP;
    this.stage_ = document.getElementById("cgroup");
  }
  this.wasDenied_ = false;
  chatango.managers.LanguageManager.getInstance().getStringPack("pm", chatango.strings.PmStrings, this.initCopy, this);
};
goog.inherits(chatango.modules.PmModule, goog.events.EventTarget);
chatango.modules.PmModule.prototype.initCopy = function(pack_id) {
  if (this.pm_) {
    this.pm_.updateCopy();
  }
};
chatango.modules.PmModule.prototype.openPm = function(opt_chatsToOpen, opt_toList, opt_mcMod) {
  if (chatango.DEBUG) {
    console.log("PmModule openPm");
    console.log("opt_chatsToOpen: ", opt_chatsToOpen);
  }
  if (opt_chatsToOpen) {
    this.chatsToOpen_ = opt_chatsToOpen;
  }
  if (!this.checkToken(true)) {
    return;
  }
  if (opt_toList == null && !(this.chatsToOpen_ && this.chatsToOpen_.length > 0)) {
    opt_toList = true;
  }
  if (!this.pm_) {
    this.pm_ = new chatango.pm.Pm(this.session_, this.layoutMode_, this.context_, this.chatsToOpen_, this.stage_, opt_toList, opt_mcMod);
  }
  goog.events.listen(this.pm_.getConnection(), chatango.networking.CommonConnectionEvent.EventType.DENIED_RELAY, this.onConnectionDenied_, false, this);
  if (!this.pm_.getConnection().isConnectedOrConnecting()) {
    this.pm_.getConnection().connect();
  }
  this.dispatchEvent(chatango.events.EventType.PM_OPENED);
};
chatango.modules.PmModule.prototype.destroyPm = function() {
  if (!this.pm_) {
    return;
  }
  this.pm_.onClose_();
  this.pm_.exitDocument();
  if (this.pm_.element_) {
    goog.dom.removeNode(this.pm_.element_);
  }
  goog.events.unlisten(this.pm_.getConnection(), chatango.networking.CommonConnectionEvent.EventType.DENIED_RELAY, this.onConnectionDenied_, false, this);
  this.pm_.setParent(null);
  this.pm_.dispose();
  this.pm_ = null;
};
chatango.modules.PmModule.prototype.onConnectionDenied_ = function(e) {
  if (this.wasDenied_) {
    if (this.context_ === chatango.pm.PmContextType.IN_GROUP) {
      this.destroyPm();
    } else {
      this.deniedRedirect_();
    }
    return;
  }
  if (this.context_ === chatango.pm.PmContextType.IN_GROUP) {
    var cUser = chatango.users.UserManager.getInstance().currentUser;
    cUser.setToken(null);
    var url = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/setcookies";
    var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
    xhr.setWithCredentials(true);
    var password = chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("pw"));
    xhr.send(url, "POST", "pwd=" + password + "&sid=" + cUser.getSid());
    goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, this.onTokenCookieSet_, false, this);
  } else {
    this.deniedRedirect_();
  }
  this.wasDenied_ = true;
};
chatango.modules.PmModule.prototype.deniedRedirect_ = function() {
  var url = "http://" + chatango.users.UserManager.getInstance().currentUser.getSid() + "." + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain() + "/disconnected";
  goog.window.open(url, {"target":"_parent"});
};
chatango.modules.PmModule.prototype.checkToken = function(forceCheck) {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var token = cUser.getToken();
  var cookieToken = goog.net.cookies.get("auth." + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain());
  var needsNewToken = !token || token === "";
  if (this.context_ === chatango.pm.PmContextType.IN_GROUP) {
    needsNewToken = needsNewToken || token !== cookieToken;
  }
  if (needsNewToken) {
    if (chatango.DEBUG) {
      console.log("no token - go get it: " + "auth." + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain());
    }
    token = goog.net.cookies.get("auth." + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain());
    if (chatango.DEBUG) {
      console.log("token: " + token);
    }
    var cookiedId = goog.net.cookies.get("id." + this.managers_.getManager(chatango.settings.servers.BaseDomain.ManagerType).getBaseDomain());
    if (!cookiedId || cookiedId.toLowerCase() != cUser.getUid()) {
      token = null;
      if (chatango.DEBUG) {
        console.log("The id associated with the cookied auth token is a different user from the current user!");
      }
    }
    if (!token) {
      if (forceCheck) {
        var url = chatango.settings.servers.SubDomain.getInstance().getScriptsStDomain() + "/setcookies";
        var xhr = chatango.networking.RequestFactory.getInstance().makeRequest(url);
        xhr.setWithCredentials(true);
        var password = chatango.utils.Encode.getInstance().decode(goog.net.cookies.get("pw"));
        xhr.send(url, "POST", "pwd=" + password + "&sid=" + cUser.getSid());
        goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, this.onTokenCookieSet_, false, this);
      }
      return false;
    }
    cUser.setToken(token);
    return true;
  }
  return true;
};
chatango.modules.PmModule.prototype.onTokenCookieSet_ = function() {
  if (!this.checkToken(false)) {
    return;
  }
  this.openPm();
};
chatango.modules.PmModule.prototype.getPm = function() {
  return this.pm_;
};
if (goog.module.ModuleManager.getInstance().getModuleInfo("PmModule")) {
  goog.module.ModuleManager.getInstance().setLoaded("PmModule");
}
;
