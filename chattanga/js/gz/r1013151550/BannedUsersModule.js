goog.provide("chatango.group.moderation.BanListSearchResult");
goog.require("chatango.managers.DateManager");
chatango.group.moderation.BanListSearchResult = function(data) {
  this.resultType_ = chatango.group.moderation.BanListSearchResult.ResultType.RESULT_OK;
  if (data[1] == 1) {
    this.resultType_ = chatango.group.moderation.BanListSearchResult.ResultType.ERROR_TOO_LONG;
  } else {
    if (data[1] == 2) {
      this.resultType_ = chatango.group.moderation.BanListSearchResult.ResultType.ERROR_INVALID_USERNAME;
    } else {
      if (data[1] == 4) {
        this.resultType_ = chatango.group.moderation.BanListSearchResult.ResultType.ERROR_INVALID_IP;
      } else {
        if (data.length == 3) {
          this.resultType_ = chatango.group.moderation.BanListSearchResult.ResultType.RESULT_EMPTY;
        } else {
          this.resultType_ = chatango.group.moderation.BanListSearchResult.ResultType.RESULT_OK;
          this.alsoContains_ = data[1].split(";");
          this.sid_ = data[2];
          if (this.sid_ == "") {
            this.sid_ = "Anon";
          }
          this.ip_ = data[3];
          this.cookie_ = data[4];
          this.mod_ = data[5];
          this.dm_ = chatango.managers.DateManager.getInstance();
          var dateArr = data[6].split(" ")[0];
          var d = new Date(dateArr.split("-")[0], dateArr.split("-")[1] - 1, dateArr.split("-")[2], data[6].split(" ")[1], data[7], data[8], 0);
          var s = this.dm_.dateToString(d, "ddd mmm d, yyyy, g:i:sa");
          this.date_ = s;
        }
      }
    }
  }
};
chatango.group.moderation.BanListSearchResult.prototype.getResultType = function() {
  return this.resultType_;
};
chatango.group.moderation.BanListSearchResult.prototype.getAlsoContains = function() {
  return this.alsoContains_;
};
chatango.group.moderation.BanListSearchResult.prototype.getSid = function() {
  return this.sid_;
};
chatango.group.moderation.BanListSearchResult.prototype.getIp = function() {
  return this.ip_;
};
chatango.group.moderation.BanListSearchResult.prototype.getCookie = function() {
  return this.cookie_;
};
chatango.group.moderation.BanListSearchResult.prototype.getMod = function() {
  return this.mod_;
};
chatango.group.moderation.BanListSearchResult.prototype.getDate = function() {
  return this.date_;
};
chatango.group.moderation.BanListSearchResult.ResultType = {"ERROR_TOO_LONG":"toolong", "ERROR_INVALID_USERNAME":"invaliduser", "ERROR_INVALID_IP":"invalidip", "RESULT_EMPTY":"empty", "RESULT_OK":"ok"};
goog.provide("chatango.group.moderation.BanListItemData");
goog.require("chatango.managers.DateManager");
chatango.group.moderation.BanListItemData = function(name, cookie, ip, time, mod, id) {
  this.name_ = "";
  if (name) {
    this.name_ = name;
  } else {
    this.name_ = "Anon";
  }
  this.id_ = id;
  this.ts_ = time;
  this.dm_ = chatango.managers.DateManager.getInstance();
  if (time) {
    this.time_ = this.dm_.dateToString(new Date(new Number(time) * 1E3), "ddd mmm d, yyyy, g:i:sa");
  }
  this.ip_ = ip;
  this.mod_ = mod;
  this.cookie_ = cookie;
};
chatango.group.moderation.BanListItemData.prototype.getName = function() {
  return this.name_;
};
chatango.group.moderation.BanListItemData.prototype.getId = function() {
  return this.id_;
};
chatango.group.moderation.BanListItemData.prototype.getTimestamp = function() {
  return this.ts_;
};
chatango.group.moderation.BanListItemData.prototype.getTime = function() {
  return this.time_;
};
chatango.group.moderation.BanListItemData.prototype.getIp = function() {
  return this.ip_;
};
chatango.group.moderation.BanListItemData.prototype.getMod = function() {
  return this.mod_;
};
chatango.group.moderation.BanListItemData.prototype.getCookie = function() {
  return this.cookie_;
};
goog.provide("chatango.events.BanListRemoveItemsEvent");
goog.require("goog.events.Event");
chatango.events.BanListRemoveItemsEvent = function(idArray, fromThisInstance) {
  goog.events.Event.call(this, chatango.events.BanListRemoveItemsEvent.type.UNBAN_SUCCESSFUL);
  this.array_ = idArray;
  this.fromInstance_ = fromThisInstance;
};
goog.inherits(chatango.events.BanListRemoveItemsEvent, goog.events.Event);
chatango.events.BanListRemoveItemsEvent.prototype.isFromInstance = function() {
  return this.fromInstance_;
};
chatango.events.BanListRemoveItemsEvent.prototype.getIdArray = function() {
  return this.array_;
};
chatango.events.BanListRemoveItemsEvent.type = {"UNBAN_SUCCESSFUL":"unbansuccessful"};
goog.provide("chatango.events.BanListSearchResultEvent");
goog.require("chatango.group.moderation.BanListSearchResult");
goog.require("goog.events.Event");
chatango.events.BanListSearchResultEvent = function(searchResult) {
  goog.events.Event.call(this, chatango.events.EventType.RESPONSE_INFO_READY);
  this.searchResult_ = searchResult;
};
goog.inherits(chatango.events.BanListSearchResultEvent, goog.events.Event);
chatango.events.BanListSearchResultEvent.prototype.getSearchResult = function() {
  return this.searchResult_;
};
goog.provide("chatango.events.BanListUpdateEvent");
goog.require("goog.events.Event");
chatango.events.BanListUpdateEvent = function(type, index, endIndex) {
  goog.events.Event.call(this, type);
  this.index_ = index;
  this.endIndex_ = endIndex;
};
goog.inherits(chatango.events.BanListUpdateEvent, goog.events.Event);
chatango.events.BanListUpdateEvent.prototype.getStartIndex = function() {
  return this.index_;
};
chatango.events.BanListUpdateEvent.prototype.getEndIndex = function() {
  return this.endIndex_;
};
chatango.events.BanListUpdateEvent.type = {"BANLIST_READY":"banlistready", "ADDITIONAL_BANS_READY":"additionalbansready", "BLOCK_BAN_READY":"blockready"};
goog.provide("chatango.group.moderation.BannedUsersModel");
goog.require("chatango.events.BanListRemoveItemsEvent");
goog.require("chatango.events.BanListSearchResultEvent");
goog.require("chatango.events.BanListUpdateEvent");
goog.require("chatango.group.moderation.BanListItemData");
goog.require("chatango.group.moderation.BanListSearchResult");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
goog.require("goog.events.EventType");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
chatango.group.moderation.BannedUsersModel = function(connection) {
  goog.events.EventTarget.call(this);
  this.con_ = connection;
  this.banListArray_ = [];
  this.lastBanId_ = -1;
  this.unbansFromThisInstance_ = [];
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.blocklist, this.banListResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.blocked, this.onBanResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.unblocked, this.onUnBanResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.badbansearchstring, this.onSearchQueryResponse_);
  this.handler_.listen(this.con_, chatango.networking.GroupConnectionEvent.EventType.bansearchresult, this.onSearchQueryResponse_);
  this.initialNumBansToDisplay_ = 50;
  this.showAnons_ = true;
};
goog.inherits(chatango.group.moderation.BannedUsersModel, goog.events.EventTarget);
chatango.group.moderation.BannedUsersModel.prototype.logger = goog.debug.Logger.getLogger("chatango.group.moderation.BannedUsersModel");
chatango.group.moderation.BannedUsersModel.prototype.sendSearchQuery = function(name) {
  this.con_.send("searchban:" + name);
};
chatango.group.moderation.BannedUsersModel.prototype.getShowAnons = function() {
  return this.showAnons_;
};
chatango.group.moderation.BannedUsersModel.prototype.setShowAnons = function(showAnons) {
  this.showAnons_ = showAnons;
};
chatango.group.moderation.BannedUsersModel.prototype.sendBanListQuery = function(opt_num) {
  var timestamp;
  var requestCount;
  if (opt_num) {
    this.additionalQuery_ = true;
    timestamp = this.banListArray_[this.banListArray_.length - 1].getTimestamp();
    requestCount = opt_num;
  } else {
    this.additionalQuery_ = false;
    timestamp = Math.round((new Date).getTime() / 1E3);
    requestCount = this.initialNumBansToDisplay_;
  }
  var anonStr;
  if (this.showAnons_) {
    anonStr = ":anons:1";
  } else {
    anonStr = ":anons:0";
  }
  this.con_.send("blocklist:block:" + timestamp + ":next:" + requestCount + anonStr);
};
chatango.group.moderation.BannedUsersModel.prototype.banListResponse_ = function(e) {
  var bansArr = e.data.join(":").replace("blocklist:", "").split(";");
  if (!this.additionalQuery_) {
    this.banListArray_ = [];
  }
  if (bansArr[0] == "blocklist") {
    if (!this.additionalQuery_) {
      this.dispatchEvent(new chatango.events.BanListUpdateEvent(chatango.events.BanListUpdateEvent.type.BANLIST_READY, 0, 0));
    }
    return;
  }
  var banInfoArr;
  var i;
  var len = bansArr.length;
  var newBansStartIndex = this.banListArray_.length;
  for (i = 0;i < len;i++) {
    this.lastBanId_++;
    banInfoArr = bansArr[i].split(":");
    this.banListArray_.push(new chatango.group.moderation.BanListItemData(banInfoArr[2], banInfoArr[0], banInfoArr[1], banInfoArr[3], banInfoArr[4], this.lastBanId_));
  }
  var newBansEndIndex = this.banListArray_.length;
  if (this.additionalQuery_) {
    this.dispatchEvent(new chatango.events.BanListUpdateEvent(chatango.events.BanListUpdateEvent.type.ADDITIONAL_BANS_READY, newBansStartIndex, newBansEndIndex));
  } else {
    this.dispatchEvent(new chatango.events.BanListUpdateEvent(chatango.events.BanListUpdateEvent.type.BANLIST_READY, 0, newBansEndIndex));
  }
};
chatango.group.moderation.BannedUsersModel.prototype.onSearchQueryResponse_ = function(e) {
  var result = new chatango.group.moderation.BanListSearchResult(e.data);
  this.dispatchEvent(new chatango.events.BanListSearchResultEvent(result));
};
chatango.group.moderation.BannedUsersModel.prototype.unban = function(data) {
  this.unbansFromThisInstance_.push(data);
  this.con_.send("removeblock:" + data.getCookie() + ":" + data.getIp());
};
chatango.group.moderation.BannedUsersModel.prototype.onBanResponse_ = function(e) {
  var banInfoArr = e.data;
  if (!this.showAnons_ && banInfoArr[3] == "") {
    return;
  }
  this.lastBanId_++;
  this.banListArray_.unshift(new chatango.group.moderation.BanListItemData(banInfoArr[3], banInfoArr[1], banInfoArr[2], banInfoArr[5], banInfoArr[4], this.lastBanId_));
  this.dispatchEvent(new chatango.events.BanListUpdateEvent(chatango.events.BanListUpdateEvent.type.BLOCK_BAN_READY, 0, 1));
};
chatango.group.moderation.BannedUsersModel.prototype.onUnBanResponse_ = function(e) {
  var arr = e.data.join(":").replace("unblocked:", "").split(";");
  var unbanFromInstance = false;
  var idArray = [];
  for (i = 0;i < arr.length;i++) {
    var temp = arr[i].split(":");
    var cookie = temp[0];
    var ip = temp[1];
    var sid = temp[2];
    for (j = 0;j < this.unbansFromThisInstance_.length;j++) {
      if (this.unbansFromThisInstance_[j].getIp() == ip && this.unbansFromThisInstance_[j].getCookie() == cookie || sid && sid == this.unbansFromThisInstance_[j].getName()) {
        this.unbansFromThisInstance_.splice(j, 1);
        unbanFromInstance = true;
        j--;
      }
    }
    for (h = 0;h < this.banListArray_.length;h++) {
      if (cookie == this.banListArray_[h].getCookie() && ip == this.banListArray_[h].getIp() || sid && sid == this.banListArray_[h].getName()) {
        idArray.push(this.banListArray_[h].getId());
        this.banListArray_.splice(h, 1);
        h--;
      }
    }
  }
  if (idArray.length != 0) {
    this.dispatchEvent(new chatango.events.BanListRemoveItemsEvent(idArray, unbanFromInstance));
  }
};
chatango.group.moderation.BannedUsersModel.prototype.getBanListArray = function() {
  return this.banListArray_;
};
goog.provide("chatango.group.moderation.BanListItem");
goog.require("goog.ui.Button");
goog.require("goog.ui.Component");
goog.require("goog.ui.LinkButtonRenderer");
chatango.group.moderation.BanListItem = function(data) {
  goog.ui.Component.call(this);
  this.data_ = data;
  this.lm_ = chatango.managers.LanguageManager.getInstance();
};
goog.inherits(chatango.group.moderation.BanListItem, goog.ui.Component);
chatango.group.moderation.BanListItem.EventType = {REMOVE:"remove"};
chatango.group.moderation.BanListItem.prototype.createDom = function() {
  var unbanLink = new goog.ui.Button(this.lm_.getString("banned_users_module", "unban"), goog.ui.LinkButtonRenderer.getInstance());
  unbanLink.addClassName("link-btn");
  var handler = this.getHandler();
  handler.listen(unbanLink, goog.ui.Component.EventType.ACTION, this.onLink_);
  this.unbanLinkEl_ = goog.dom.createDom("span", {"style":"float:right;position:relative;"});
  unbanLink.render(this.unbanLinkEl_);
  var name = this.data_.getName();
  if (name != "Anon") {
    name = "<b>" + name + "<b>";
  }
  this.banListingEl_ = goog.dom.createDom("div", {"class":"ctopbdr", "style":"overflow:hidden;"});
  this.banListingEl_.innerHTML = name + "<br>";
  var ip = chatango.users.ModeratorManager.getInstance().getCensoredIP(this.data_.getIp());
  this.banListingEl_.innerHTML += this.lm_.getString("banned_users_module", "ip") + ip + "<br>";
  this.banListingEl_.innerHTML += this.lm_.getString("banned_users_module", "banned") + this.data_.getTime() + "<br>";
  this.banListingEl_.innerHTML += "By: " + this.data_.getMod() + "<br>";
  goog.dom.classes.add(this.banListingEl_, "sdlg-sc");
  goog.dom.insertChildAt(this.banListingEl_, this.unbanLinkEl_, 0);
  this.setElementInternal(this.banListingEl_);
};
chatango.group.moderation.BanListItem.prototype.getData = function() {
  return this.data_;
};
chatango.group.moderation.BanListItem.prototype.onLink_ = function(e) {
  this.dispatchEvent(chatango.group.moderation.BanListItem.EventType.REMOVE);
};
goog.provide("chatango.group.moderation.BannedUsersView");
goog.require("chatango.events.BanListRemoveItemsEvent");
goog.require("chatango.events.BanListSearchResultEvent");
goog.require("chatango.events.BanListUpdateEvent");
goog.require("chatango.group.moderation.BanListItem");
goog.require("chatango.group.moderation.BanListItemData");
goog.require("chatango.managers.Environment");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
goog.require("goog.style");
goog.require("goog.ui.Button");
goog.require("goog.ui.LinkButtonRenderer");
chatango.group.moderation.BannedUsersView = function(model, opt_domHelper) {
  var vpWidth = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, opt_domHelper);
  this.model_ = model;
  this.banListItemObject_ = {};
  this.firstBanItemElement_;
  this.handler = this.getHandler();
  this.handler.listen(this.model_, chatango.events.EventType.RESPONSE_INFO_READY, this.updateSearchResult);
  this.handler.listen(this.model_, chatango.events.BanListUpdateEvent.type.ADDITIONAL_BANS_READY, this.populateBanList);
  this.handler.listen(this.model_, chatango.events.BanListUpdateEvent.type.BLOCK_BAN_READY, this.populateBanList);
  this.handler.listen(this.model_, chatango.events.BanListUpdateEvent.type.BANLIST_READY, this.populateBanList);
  this.handler.listen(this.model_, chatango.events.BanListRemoveItemsEvent.type.UNBAN_SUCCESSFUL, this.removeBans);
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("banned_users_module", "banned_users"));
  this.setResizable(false);
};
goog.inherits(chatango.group.moderation.BannedUsersView, chatango.ui.ScrollableDialog);
chatango.group.moderation.BannedUsersView.prototype.logger = goog.debug.Logger.getLogger("chatango.group.moderation.BannedUsersView");
chatango.group.moderation.BannedUsersView.prototype.onShowAnonsBoxChanged_ = function() {
  goog.dom.removeNode(this.searchResultContainerEl_);
  this.model_.setShowAnons(this.anonBox_.isChecked());
  this.model_.sendBanListQuery();
  this.anonBox_.setEnabled(false);
};
chatango.group.moderation.BannedUsersView.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  this.unbanLink_ = new goog.ui.Button(this.lm_.getString("banned_users_module", "unban"), goog.ui.LinkButtonRenderer.getInstance());
  this.unbanLink_.addClassName("link-btn");
  this.handler.listen(this.unbanLink_, goog.ui.Component.EventType.ACTION, this.fromLinkUnban);
  var dom = this.getDomHelper();
  var content = this.headerContentEl_;
  this.showHeaderContentEl(true);
  this.showHeaderElBorder(true);
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.searchInputWrap_ = goog.dom.createDom("div", {"style":"float:left;"});
  this.searchInput_ = dom.createDom("input", {"id":"unban-search", "type":"text", "placeholder":this.lm_.getString("banned_users_module", "usr_name_ip")});
  goog.dom.append(this.searchInputWrap_, this.searchInput_);
  this.handler.listen(new goog.events.KeyHandler(this.searchInput_), "key", function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      this.onSearchButtonClicked();
    }
  });
  this.button_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("banned_users_module", "search"));
  this.handler.listen(this.button_, goog.ui.Component.EventType.ACTION, this.onSearchButtonClicked);
  this.buttonWrapperEl_ = dom.createDom("div", {"style":"float:right;"});
  this.button_.render(this.buttonWrapperEl_);
  this.searchPrompt_ = dom.createDom("div", {"id":"search-prompt"});
  dom.appendChild(this.searchPrompt_, this.searchInputWrap_);
  dom.appendChild(this.searchPrompt_, this.buttonWrapperEl_);
  dom.appendChild(content, this.searchPrompt_);
  this.searchResultContainerEl_ = dom.createDom("div");
  goog.dom.classes.add(this.searchResultContainerEl_, "unban-widget");
  this.searchResultContainerEl_.innerHTML = "";
  this.firstRender_ = true;
  this.anonBox_ = new chatango.ui.Checkbox;
  this.handler.listen(this.anonBox_, goog.ui.Component.EventType.CHANGE, this.onShowAnonsBoxChanged_);
  this.anonCheckBox = goog.dom.createDom("div", {"class":"sdlg-section"});
  goog.dom.append(content, this.anonCheckBox);
  this.anonBox_.render(this.anonCheckBox);
  this.anonBox_.setCaption("Show Anons");
  this.anonBox_.setChecked(this.model_.getShowAnons());
  this.showBanLinkEl_ = dom.createDom("div", {"style":"float:left;padding:.5em"});
  this.showBanLink_ = new goog.ui.Button("Show Ban List", goog.ui.LinkButtonRenderer.getInstance());
  this.showBanLink_.addClassName("link-btn");
  this.handler.listen(this.showBanLink_, goog.ui.Component.EventType.ACTION, this.showBans);
  this.showBanLink_.render(this.showBanLinkEl_);
  goog.dom.insertSiblingAfter(this.showBanLinkEl_, this.headerContentEl_);
  goog.style.setStyle(this.showBanLinkEl_, "display", "none");
  this.showBanLink_.setVisible(false);
  this.model_.sendBanListQuery();
};
chatango.group.moderation.BannedUsersView.prototype.showBans = function() {
  goog.dom.removeNode(this.searchResultContainerEl_);
  goog.style.setStyle(this.anonCheckBox, "display", "block");
  this.showBanLink_.setVisible(false);
  goog.style.setStyle(this.showBanLinkEl_, "display", "none");
  goog.style.setStyle(this.banListContainerEl_, "display", "block");
};
chatango.group.moderation.BannedUsersView.prototype.onScroll_ = function() {
  if (!this.waitingForMoreRequestedBans_) {
    if (this.scrollPane_.atBottom()) {
      this.waitingForMoreRequestedBans_ = true;
      this.model_.sendBanListQuery(chatango.group.moderation.BannedUsersView.NUM_ADDITIONAL_BANS_TO_REQUEST);
    }
  }
};
chatango.group.moderation.BannedUsersView.prototype.enterDocument = function() {
  chatango.group.moderation.BannedUsersView.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.moderation.BannedUsersView.prototype.onSearchButtonClicked = function() {
  this.button_.setEnabled(false);
  this.query_ = this.searchInput_.value;
  this.model_.sendSearchQuery(this.searchInput_.value);
  var dom = this.getDomHelper();
  this.searchInfo_ = dom.createDom("span");
  dom.removeNode(this.searchResultContainerEl_);
  this.searchResultContainerEl_.innerHTML = "";
  this.searchInfo_.innerHTML = this.lm_.getString("banned_users_module", "searching");
  dom.appendChild(this.searchResultContainerEl_, this.searchInfo_);
  goog.dom.insertSiblingAfter(this.searchResultContainerEl_, this.anonCheckBox);
  goog.style.setStyle(this.banListContainerEl_, "display", "none");
  goog.style.setStyle(this.anonCheckBox, "display", "none");
  var padding = goog.style.getPaddingBox(this.headerContentEl_);
  goog.style.setStyle(this.showBanLinkEl_, "display", "block");
  goog.style.setStyle(this.showBanLinkEl_, "padding", padding.top + "px");
  this.showBanLink_.setVisible(true);
};
chatango.group.moderation.BannedUsersView.prototype.updateUnbanUI = function(e) {
  var dom = this.getDomHelper();
  this.searchInfo_ = dom.createDom("span");
  dom.removeNode(this.searchResultContainerEl_);
  this.searchResultContainerEl_.innerHTML = "";
  this.searchInfo_.innerHTML = this.lm_.getString("banned_users_module", "unban_success");
  dom.appendChild(this.searchResultContainerEl_, this.searchInfo_);
  goog.style.setStyle(this.anonCheckBox, "display", "block");
  goog.style.setStyle(this.banListContainerEl_, "display", "block");
  goog.dom.insertSiblingBefore(this.searchResultContainerEl_, this.anonCheckBox);
  goog.style.setStyle(this.showBanLinkEl_, "display", "none");
  this.showBanLink_.setVisible(false);
};
chatango.group.moderation.BannedUsersView.prototype.removeBans = function(e) {
  var idArray = e.getIdArray();
  var i;
  var currentScrollPos = this.scrollPane_.getScrollTop();
  var newScrollPos = currentScrollPos;
  for (i = 0;i < idArray.length;i++) {
    if (this.banListItemObject_[idArray[i]].getContentElement() == this.firstBanItemElement_) {
      this.firstBanItemElement_ = goog.dom.getNextElementSibling(this.banListItemObject_[idArray[i]].getContentElement());
      if (this.firstBanItemElement_) {
        goog.dom.setProperties(this.firstBanItemElement_, {"class":"sdlg-sc"});
      }
    }
    if (this.banListItemObject_[idArray[i]].banListingEl_.offsetTop < currentScrollPos) {
      newScrollPos -= this.banListItemObject_[idArray[i]].banListingEl_.offsetHeight;
    }
    this.banListItemObject_[idArray[i]].dispose();
  }
  this.scrollPane_.setScrollTop(newScrollPos);
  if (e.isFromInstance()) {
    this.updateUnbanUI();
  }
};
chatango.group.moderation.BannedUsersView.prototype.fromListUnban = function(e) {
  goog.dom.removeNode(this.searchResultContainerEl_);
  this.model_.unban(e.target.getData());
};
chatango.group.moderation.BannedUsersView.prototype.fromLinkUnban = function(e) {
  goog.dom.removeNode(this.searchResultContainerEl_);
  this.model_.unban(new chatango.group.moderation.BanListItemData(null, this.currentSearchResult_.getCookie(), this.currentSearchResult_.getIp(), null, null));
};
chatango.group.moderation.BannedUsersView.prototype.populateBanList = function(e) {
  var dom = this.getDomHelper();
  if (this.firstRender_ || e.type == chatango.events.BanListUpdateEvent.type.BANLIST_READY) {
    var scrollContent = this.getContentElement();
    dom.removeChildren(scrollContent);
    this.banListContainerEl_ = dom.createDom("div");
    this.banListContainerEl_.innerHTML = "";
    goog.dom.classes.add(this.banListContainerEl_, "content-dialog");
  }
  var bansArray = this.model_.getBanListArray();
  var banItem;
  var i = 0;
  for (i = e.getStartIndex();i < e.getEndIndex();i++) {
    var banItem = new chatango.group.moderation.BanListItem(bansArray[i]);
    this.handler.listen(banItem, chatango.group.moderation.BanListItem.EventType.REMOVE, this.fromListUnban);
    if (e.type != chatango.events.BanListUpdateEvent.type.BLOCK_BAN_READY) {
      banItem.render(this.banListContainerEl_);
    } else {
      if (this.firstBanItemElement_) {
        banItem.renderBefore(this.firstBanItemElement_);
      } else {
        banItem.render(this.banListContainerEl_);
      }
    }
    this.banListItemObject_[banItem.getData().getId()] = banItem;
    if (i == 0) {
      dom.setProperties(banItem.getContentElement(), {"class":"sdlg-sc"});
      if (this.firstBanItemElement_) {
        dom.setProperties(this.firstBanItemElement_, {"class":"ctopbdr sdlg-sc"});
      }
      this.firstBanItemElement_ = banItem.getContentElement();
    }
  }
  if (this.firstRender_ || e.type == chatango.events.BanListUpdateEvent.type.BANLIST_READY) {
    dom.append(scrollContent, this.banListContainerEl_);
    this.scrollPane_.setScrollTop(0);
  }
  setTimeout(goog.bind(function() {
    this.draw();
    this.anonBox_.setEnabled(true);
    this.waitingForMoreRequestedBans_ = false;
    if (this.firstRender_) {
      this.reposition();
      this.firstRender_ = false;
    }
    goog.events.listen(this.scrollPane_, goog.events.EventType.SCROLL, this.onScroll_, false, this);
  }, this), 0);
};
chatango.group.moderation.BannedUsersView.prototype.updateSearchResult = function(e) {
  this.button_.setEnabled(true);
  var dom = this.getDomHelper();
  this.searchInfo_ = dom.createDom("span");
  dom.removeNode(this.searchResultContainerEl_);
  this.searchResultContainerEl_.innerHTML = "";
  var result = e.getSearchResult();
  this.currentSearchResult_ = result;
  if (result.getResultType() == chatango.group.moderation.BanListSearchResult.ResultType.RESULT_OK) {
    var ipRE = new RegExp("^\\d+\\.\\d+\\.\\d+\\.\\d+$");
    var isIP = ipRE.test(this.query_);
    var autobanListEmpty = result.getAlsoContains()[0] == "";
    if (!this.unbanLinkEl_) {
      this.unbanLinkEl_ = dom.createDom("span", {"style":"float:right;position:relative;"});
      this.unbanLink_.render(this.unbanLinkEl_);
    }
    this.unbanLink_.setVisible(true);
    this.searchInfo_.innerHTML = "";
    if (isIP) {
      if (result.getIp() != this.query_) {
        this.searchInfo_.innerHTML = this.lm_.getString("banned_users_module", "original_ban") + "<br>";
      }
    } else {
      if (result.getSid() != this.query_) {
        this.searchInfo_.innerHTML = this.lm_.getString("banned_users_module", "original_ban") + " ";
      }
    }
    if (!isIP) {
      this.searchInfo_.innerHTML += "<b>" + result.getSid() + "</b> <br>";
    }
    var displayIP = chatango.users.ModeratorManager.getInstance().getCensoredIP(result.getIp());
    this.searchInfo_.innerHTML += this.lm_.getString("banned_users_module", "ip") + displayIP + "<br>";
    this.searchInfo_.innerHTML += this.lm_.getString("banned_users_module", "banned") + result.getDate() + "<br>";
    this.searchInfo_.innerHTML += "By: " + result.getMod() + "<br>";
    if (!autobanListEmpty || isIP) {
      if (!autobanListEmpty || result.getSid() != "Anon") {
        this.searchInfo_.innerHTML += this.lm_.getString("banned_users_module", "ban_contains") + " ";
      }
      if (isIP && result.getSid() != "Anon") {
        this.searchInfo_.innerHTML += result.getSid();
        if (!autobanListEmpty) {
          this.searchInfo_.innerHTML += ", ";
        }
      }
      var alsoContains = result.getAlsoContains();
      for (i = 0;i < alsoContains.length;i++) {
        if (alsoContains[i] == this.query_) {
          alsoContains[i] = "<b>" + alsoContains[i] + "</b>";
        }
      }
      this.searchInfo_.innerHTML += alsoContains.join(", ");
    }
    dom.appendChild(this.searchResultContainerEl_, this.unbanLinkEl_);
  } else {
    this.unbanLink_.setVisible(false);
    var error_msg;
    switch(result.getResultType()) {
      case chatango.group.moderation.BanListSearchResult.ResultType.ERROR_TOO_LONG:
        error_msg = this.lm_.getString("banned_users_module", "too_long");
        break;
      case chatango.group.moderation.BanListSearchResult.ResultType.ERROR_INVALID_USERNAME:
        error_msg = this.lm_.getString("banned_users_module", "not_valid_usr");
        break;
      case chatango.group.moderation.BanListSearchResult.ResultType.ERROR_INVALID_IP:
        error_msg = this.lm_.getString("banned_users_module", "not_valid_ip");
        break;
      case chatango.group.moderation.BanListSearchResult.ResultType.RESULT_EMPTY:
        error_msg = this.lm_.getString("banned_users_module", "no_ban");
        break;
    }
    this.searchInfo_.innerHTML = error_msg;
  }
  dom.appendChild(this.searchResultContainerEl_, this.searchInfo_);
  dom.appendChild(this.headerContentEl_, this.searchResultContainerEl_);
};
chatango.group.moderation.BannedUsersView.prototype.draw = function() {
  goog.base(this, "draw");
  var padding = goog.style.getPaddingBox(this.headerContentEl_);
  var w = goog.style.getSize(this.searchPrompt_).width - goog.style.getSize(this.buttonWrapperEl_).width - padding.left;
  if (!isNaN(w)) {
    this.searchInputWrap_.style.width = Math.floor(w - 1) + "px";
    chatango.utils.style.stretchToFill(this.searchInput_);
  }
};
chatango.group.moderation.BannedUsersView.prototype.updateCopy = function() {
  this.button_.setContent(this.lm_.getString("banned_users_module", "search"));
  this.unbanLink_.setContent(this.lm_.getString("banned_users_module", "unban"));
  setTimeout(goog.bind(function() {
    this.draw();
  }, this), 0);
};
chatango.group.moderation.BannedUsersView.prototype.disposeInternal = function() {
  if (this.scrollPane_) {
    goog.events.unlisten(this.scrollPane_, goog.events.EventType.SCROLL, this.onScroll_, false, this);
  }
  chatango.group.moderation.BannedUsersView.superClass_.disposeInternal.call(this);
};
chatango.group.moderation.BannedUsersView.NUM_ADDITIONAL_BANS_TO_REQUEST = 20;
goog.provide("chatango.modules.BannedUsersModule");
goog.require("chatango.group.moderation.BannedUsersModel");
goog.require("chatango.group.moderation.BannedUsersView");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.modules.ModerationModule");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.BannedUsersModule = function(connection) {
  chatango.managers.LanguageManager.getInstance().getStringPack("banned_users_module", chatango.modules.BannedUsersModule.strs, this.initCopy, this);
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.connection_ = connection;
  this.bannedUsersModel_ = new chatango.group.moderation.BannedUsersModel(this.connection_);
};
chatango.modules.BannedUsersModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.BannedUsersModule");
chatango.modules.BannedUsersModule.prototype.closePopUps = function() {
  if (this.bannedUsersDialog_) {
    this.bannedUsersDialog_.dispose();
    this.bannedUsersDialog_ = null;
  }
};
chatango.modules.BannedUsersModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.bannedUsersDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    this.bannedUsersDialog_.setMaxHeight(new_h);
    chatango.utils.display.constrainToStage(this.bannedUsersDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.bannedUsersDialog_.getElement());
  }
};
chatango.modules.BannedUsersModule.prototype.openUnbanUsersDialog = function() {
  if (this.bannedUsersDialog_) {
    this.closePopUps();
  }
  this.bannedUsersDialog_ = new chatango.group.moderation.BannedUsersView(this.bannedUsersModel_);
  this.bannedUsersDialog_.setVisible(true);
};
chatango.modules.BannedUsersModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("ui") && lm.isPackLoaded("banned_users_module")) {
    if (this.bannedUsersDialog_) {
      this.bannedUsersDialog_.updateCopy();
    }
  }
};
chatango.modules.BannedUsersModule.strs = {"banned_users":"Banned users", "unban":"Unban", "usr_name_ip":"User name or IP", "search":"Search", "ip":"IP: ", "banned":"Banned: ", "ban_contains":"This ban contains:", "unban_success":"Unban successful", "original_ban":"Original ban:", "too_long":"Search query is too long", "not_valid_usr":"Not a valid username", "not_valid_ip":"Not a valid IP", "no_ban":"No ban found", "searching":"Searching..."};
goog.module.ModuleManager.getInstance().setLoaded("BannedUsersModule");

