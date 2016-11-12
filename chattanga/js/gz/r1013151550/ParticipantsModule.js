goog.provide("chatango.group.participants.ParticipantsProfile");
goog.require("chatango.events.EventType");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.Environment");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.users.User");
goog.require("goog.dom");
goog.require("goog.dom.classes");
goog.require("goog.events");
goog.require("goog.style");
goog.require("goog.ui.Component");
chatango.group.participants.ParticipantsProfile = function(sellerId, timeCreated, sessionCount) {
  goog.ui.Component.call(this);
  this.sid_ = sellerId;
  this.created_ = timeCreated;
  this.sessionCount_ = sessionCount;
  this.dm_ = chatango.managers.DateManager.getInstance();
  this.lastPercent_ = null;
};
goog.inherits(chatango.group.participants.ParticipantsProfile, goog.ui.Component);
chatango.group.participants.ParticipantsProfile.prototype.createDom = function() {
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  var canSeeMods = curUser && curUser.isModerator();
  var user = chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + this.sid_, this.sid_, "S");
  this.element_ = goog.dom.createDom("div", {"class":"participants-profile", "data-sid":this.sid_});
  this.uidEl_ = goog.dom.createDom("div", {"class":"participants-uid"});
  this.uidSpan_ = goog.dom.createDom("span");
  this.uidSpan_.innerHTML = this.sid_;
  if (this.sessionCount_ > 1) {
    this.uidSpan_.innerHTML += " (" + this.sessionCount_ + ")";
  }
  goog.dom.append(this.uidEl_, this.uidSpan_);
  if (canSeeMods && user.isModerator()) {
    this.createModIcon_();
  }
  goog.dom.append(this.element_, this.uidEl_);
  this.timeWrap_ = goog.dom.createDom("div", {"class":"participants-time-wrap"});
  this.timeEl_ = goog.dom.createDom("div", {"class":"participants-time"});
  this.timeStr_ = this.dm_.diffToString(this.created_, new Date, 0, true);
  this.timeEl_.innerHTML = this.timeStr_;
  goog.dom.append(this.timeWrap_, this.timeEl_);
  this.timeBar_ = goog.dom.createDom("div", {"class":"participants-time-bar"});
  this.timeBar_.innerHTML = "&nbsp;";
  goog.dom.append(this.timeWrap_, this.timeBar_);
  this.drawBar(new Date - this.created_);
  goog.dom.append(this.element_, this.timeWrap_);
  goog.events.listen(this.uidSpan_, goog.events.EventType.CLICK, this.onNameClick_, false, this);
  if (chatango.managers.Environment.getInstance().isMobile()) {
    goog.events.listen(this.timeWrap_, goog.events.EventType.TOUCHSTART, this.toggleTime_, false, this);
  } else {
    goog.events.listen(this.timeWrap_, goog.events.EventType.MOUSEOVER, this.showTime_, false, this);
    goog.events.listen(this.timeWrap_, goog.events.EventType.MOUSEOUT, this.hideTime_, false, this);
  }
};
chatango.group.participants.ParticipantsProfile.prototype.toggleTime_ = function(e) {
  var curOpacity = this.timeEl_.style.opacity;
  this.timeEl_.style.opacity = 1 - curOpacity;
};
chatango.group.participants.ParticipantsProfile.prototype.showTime_ = function(e) {
  this.timeEl_.style.opacity = "1";
};
chatango.group.participants.ParticipantsProfile.prototype.hideTime_ = function(e) {
  this.timeEl_.style.opacity = "0";
};
chatango.group.participants.ParticipantsProfile.prototype.drawBar = function(time) {
  time /= 60 * 60 * 1E3;
  var percent = 0;
  if (time < 12) {
    percent = 10 + 15 / 4 * time;
  } else {
    percent = 10 + 90 / (1 + Math.exp(2 - time / 6));
  }
  if (this.lastPercent_ === null || Math.abs(percent - this.lastPercent_) > 1) {
    this.lastPercent_ = percent;
    this.timeBar_.style.width = percent + "%";
  }
};
chatango.group.participants.ParticipantsProfile.prototype.tick = function() {
  var newStr = this.dm_.diffToString(this.created_, new Date, 0, true);
  if (this.timeStr_ !== newStr) {
    if (this.timeEl_.style.opacity == 1) {
      this.timeEl_.innerHTML = newStr;
    }
    this.timeStr_ = newStr;
    this.drawBar(new Date - this.created_);
  }
};
chatango.group.participants.ParticipantsProfile.prototype.createModIcon_ = function() {
  if (this.modIcon_) {
    if (this.modIcon_.getElement()) {
      goog.events.unlisten(this.modIcon_.getElement(), goog.events.EventType.CLICK, this.onNameClick_, false, this);
    }
    this.modIcon_.dispose();
    this.modIcon_ = null;
  }
  this.modIcon_ = new chatango.ui.icons.SvgModIcon;
  this.modIcon_.renderBefore(this.uidSpan_);
  goog.events.listen(this.modIcon_.getElement(), goog.events.EventType.CLICK, this.onNameClick_, false, this);
};
chatango.group.participants.ParticipantsProfile.prototype.draw = function() {
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  var canSeeMods = curUser && curUser.isModerator();
  this.uidSpan_.innerHTML = this.sid_;
  if (this.sessionCount_ > 1) {
    this.uidSpan_.innerHTML += " (" + this.sessionCount_ + ")";
  }
  var user = chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + this.sid_, this.sid_, "S");
  if (canSeeMods && user.isModerator()) {
    this.createModIcon_();
  }
  this.tick();
};
chatango.group.participants.ParticipantsProfile.prototype.onNameClick_ = function(e) {
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  if (curUser && this.sid_ === curUser.getSid()) {
    return;
  }
  var evt = new goog.events.Event(chatango.events.EventType.PARTICIPANTS_OPEN_PM);
  evt.data = this.sid_;
  this.dispatchEvent(evt);
};
chatango.group.participants.ParticipantsProfile.prototype.isModerator = function() {
  var user = chatango.users.UserManager.getInstance().addUser("phn_profile" + this.sid_, this.sid_, "S");
  return user.isModerator();
};
chatango.group.participants.ParticipantsProfile.prototype.setSessionCount = function(num) {
  this.sessionCount_ = num;
};
chatango.group.participants.ParticipantsProfile.prototype.setTimeCreated = function(time) {
  this.created_ = time;
};
chatango.group.participants.ParticipantsProfile.prototype.getTimeCreated = function() {
  return this.created_;
};
chatango.group.participants.ParticipantsProfile.prototype.disposeInternal = function() {
  if (this.timeWrap_) {
    if (chatango.managers.Environment.getInstance().isMobile()) {
      goog.events.unlisten(this.timeWrap_, goog.events.EventType.TOUCHSTART, this.toggleTime_, false, this);
    } else {
      goog.events.unlisten(this.timeWrap_, goog.events.EventType.MOUSEOVER, this.showTime_, false, this);
      goog.events.unlisten(this.timeWrap_, goog.events.EventType.MOUSEOUT, this.hideTime_, false, this);
    }
  }
  if (this.uidSpan_) {
    goog.events.unlisten(this.uidSpan_, goog.events.EventType.CLICK, this.onNameClick_, false, this);
  }
  chatango.group.participants.ParticipantsProfile.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.participants.ParticipantsView");
goog.require("chatango.events.EventType");
goog.require("chatango.group.participants.ParticipantsProfile");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.managers.WaitingAnimation");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.users.UserManager");
goog.require("goog.Timer");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.object");
goog.require("goog.style");
chatango.group.participants.ParticipantsView = function(controller, anonsAllowed, opt_domHelper) {
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.sm_ = chatango.managers.ScaleManager.getInstance();
  this.profiles_ = {};
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var sz = this.viewportManager_.getViewportSizeMonitor().getSize();
  var vpWidth = sz.width;
  var vpHeight = sz.height;
  var width = Math.min(vpWidth * .9, Math.round(4 * chatango.managers.Style.getInstance().getScale()));
  var height = Math.round(goog.dom.getDocument().body.offsetHeight * .98);
  chatango.ui.ScrollableDialog.call(this, width, height, true, undefined, undefined, undefined, opt_domHelper);
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  var isDesktop = chatango.managers.Environment.getInstance().isDesktop();
  if (!isDesktop || this.sm_.isBelowFullFeaturedSize()) {
    this.setResizable(false);
  }
  this.timer_ = new goog.Timer(1E3);
  goog.events.listen(this.timer_, goog.Timer.TICK, this.onTick_, false, this);
  this.sort_ = chatango.group.participants.ParticipantsView.SortType.NAME;
  this.anonsAllowed_ = anonsAllowed;
  this.controller_ = controller;
};
goog.inherits(chatango.group.participants.ParticipantsView, chatango.ui.ScrollableDialog);
chatango.group.participants.ParticipantsView.SortType = {NAME:"name", TIME:"time"};
chatango.group.participants.ParticipantsView.prototype.canSeeMods_ = function() {
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  return curUser && curUser.isModerator();
};
chatango.group.participants.ParticipantsView.prototype.createDom = function() {
  chatango.group.participants.ParticipantsView.superClass_.createDom.call(this);
  this.setFullScreenOnMobileAndSmallEmbeds(true);
  var scrollContent = this.getContentElement();
  var canSeeMods = this.canSeeMods_();
  this.listContentEl_ = goog.dom.createDom("div");
  goog.dom.classes.add(this.listContentEl_, "sdlg-sc");
  goog.dom.classes.add(this.listContentEl_, "content-dialog");
  goog.dom.classes.add(this.listContentEl_, "participants-list");
  goog.dom.classes.enable(this.listContentEl_, "participants-mods", canSeeMods);
  goog.dom.append(scrollContent, this.listContentEl_);
  goog.dom.classes.add(this.element_, "participants-dlg");
  this.filterWrap_ = goog.dom.createDom("div", {"class":"participants-filter"});
  this.modOption_ = goog.dom.createDom("span", {"class":"participants-option"});
  if (canSeeMods) {
    this.modFilterButton_ = new chatango.ui.Checkbox;
    goog.events.listen(this.modFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.modFilterButton_.render(this.modOption_);
    this.modFilterButton_.setCaption(this.formatLabel_("mods", true));
    this.modFilterButton_.setChecked(true);
    goog.dom.append(this.filterWrap_, this.modOption_);
  }
  this.userOption_ = goog.dom.createDom("span", {"class":"participants-option"});
  if (canSeeMods) {
    this.userFilterButton_ = new chatango.ui.Checkbox;
    goog.events.listen(this.userFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.userFilterButton_.render(this.userOption_);
    this.userFilterButton_.setChecked(true);
    this.userFilterButton_.setCaption(this.formatLabel_("sellers", true));
  } else {
    this.userOption_.innerHTML = this.formatLabel_("sellers");
  }
  goog.dom.append(this.filterWrap_, this.userOption_);
  this.anonOption_ = goog.dom.createDom("span", {"class":"participants-option"});
  if (canSeeMods) {
    this.anonOption_.innerHTML = '<div><span class="chatango-checkbox-caption">' + this.formatLabel_("anons") + "</span></div>";
  } else {
    this.anonOption_.innerHTML = this.formatLabel_("anons");
  }
  goog.dom.append(this.filterWrap_, this.anonOption_);
  goog.dom.append(this.headerContentEl_, this.filterWrap_);
  if (!this.sm_.isBelowFullFeaturedSize()) {
    var sortWrap = goog.dom.createDom("div", {"class":"participants-filter"});
    var sortBy = goog.dom.createDom("span", {"class":"participants-sort-title"});
    sortBy.innerHTML = this.lm_.getString("participants", "sort_label");
    goog.dom.append(sortWrap, sortBy);
    var sortButtonsWrap = goog.dom.createDom("span", {"style":"display: table-cell"});
    this.nameSortWrap_ = goog.dom.createDom("span", {"class":"participants-option"});
    this.nameSortButton_ = goog.dom.createDom("input", {"type":"radio", "name":"sort", "id":"name-sort"});
    var nameSortLabel = goog.dom.createDom("label", {"for":"name-sort"});
    nameSortLabel.innerHTML = this.lm_.getString("participants", "sort_name");
    goog.dom.append(this.nameSortWrap_, this.nameSortButton_);
    goog.dom.append(this.nameSortWrap_, nameSortLabel);
    this.timeSortWrap_ = goog.dom.createDom("span", {"class":"participants-option"});
    this.timeSortButton_ = goog.dom.createDom("input", {"type":"radio", "name":"sort", "id":"time-sort"});
    var timeSortLabel = goog.dom.createDom("label", {"for":"time-sort"});
    timeSortLabel.innerHTML = this.lm_.getString("participants", "sort_time");
    goog.dom.append(this.timeSortWrap_, this.timeSortButton_);
    goog.dom.append(this.timeSortWrap_, timeSortLabel);
    goog.dom.append(sortButtonsWrap, this.nameSortWrap_);
    goog.dom.append(sortButtonsWrap, this.timeSortWrap_);
    goog.dom.append(sortWrap, sortButtonsWrap);
    if (this.sort_ === chatango.group.participants.ParticipantsView.SortType.NAME) {
      this.nameSortButton_.checked = true;
    } else {
      this.timeSortButton_.checked = true;
    }
    goog.events.listen(this.nameSortWrap_, goog.events.EventType.CLICK, this.onSortChange_, false, this);
    goog.events.listen(this.timeSortWrap_, goog.events.EventType.CLICK, this.onSortChange_, false, this);
    goog.dom.append(this.headerContentEl_, sortWrap);
  }
  this.showHeaderContentEl(true);
};
chatango.group.participants.ParticipantsView.prototype.draw = function() {
  chatango.group.participants.ParticipantsView.superClass_.draw.call(this);
  this.updateCounter();
};
chatango.group.participants.ParticipantsView.prototype.updateCounter = function() {
  var canSeeMods = this.canSeeMods_();
  if (canSeeMods) {
    if (this.userFilterButton_) {
      this.userFilterButton_.setCaption(this.formatLabel_("sellers", true));
    }
    if (this.modFilterButton_) {
      this.modFilterButton_.setCaption(this.formatLabel_("mods", true));
    }
    this.anonOption_.innerHTML = '<div><span class="chatango-checkbox-caption">' + this.formatLabel_("anons") + "</span></div>";
  } else {
    this.anonOption_.innerHTML = this.formatLabel_("anons");
    this.userOption_.innerHTML = this.formatLabel_("sellers");
  }
};
chatango.group.participants.ParticipantsView.prototype.addUser = function(sellerId, timeCreated, sessionCount) {
  this.profiles_[sellerId] = new chatango.group.participants.ParticipantsProfile(sellerId, timeCreated, sessionCount);
  var i, curName, compareFn;
  if (this.sort_ === chatango.group.participants.ParticipantsView.SortType.NAME) {
    compareFn = function(name) {
      return sellerId.localeCompare(name) < 0;
    };
  } else {
    compareFn = function(name) {
      return this.profiles_[name].getTimeCreated() - timeCreated < 0;
    };
  }
  compareFn = compareFn.bind(this);
  var len = this.listContentEl_.childNodes.length;
  for (i = 0;i < len;i++) {
    curName = this.listContentEl_.childNodes[i].getAttribute("data-sid");
    if (compareFn(curName)) {
      break;
    }
  }
  if (i >= this.listContentEl_.childNodes.length) {
    this.profiles_[sellerId].render(this.listContentEl_);
  } else {
    this.profiles_[sellerId].renderBefore(this.listContentEl_.childNodes[i]);
  }
  var show = this.isUserVisible_(this.profiles_[sellerId].isModerator());
  goog.style.showElement(this.profiles_[sellerId].getElement(), show);
  goog.events.listen(this.profiles_[sellerId], chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.relayEvent_, false, this);
};
chatango.group.participants.ParticipantsView.prototype.updateUser = function(sellerId, timeCreated, sessionCount) {
  if (!this.profiles_[sellerId]) {
    return;
  }
  this.profiles_[sellerId].setTimeCreated(timeCreated);
  this.profiles_[sellerId].setSessionCount(sessionCount);
  this.profiles_[sellerId].draw();
};
chatango.group.participants.ParticipantsView.prototype.removeUser = function(sellerId) {
  if (!this.profiles_[sellerId]) {
    return;
  }
  goog.events.unlisten(this.profiles_[sellerId], chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.relayEvent_, false, this);
  this.profiles_[sellerId].dispose();
  delete this.profiles_[sellerId];
};
chatango.group.participants.ParticipantsView.prototype.getSortedList_ = function() {
  var list = this.controller_.getList();
  var sortFn;
  if (this.sort_ === chatango.group.participants.ParticipantsView.SortType.NAME) {
    sortFn = function(a, b) {
      return a[0].localeCompare(b[0]);
    };
  } else {
    sortFn = function(a, b) {
      return-(a[1] - b[1]);
    };
  }
  return list.sort(sortFn);
};
chatango.group.participants.ParticipantsView.prototype.initialize = function() {
  chatango.managers.WaitingAnimation.getInstance().stopWaiting("participants_list");
  goog.array.forEach(this.getSortedList_(), function(user) {
    this.profiles_[user[0]] = new chatango.group.participants.ParticipantsProfile(user[0], user[1], user[2]);
    this.profiles_[user[0]].render(this.listContentEl_);
    goog.events.listen(this.profiles_[user[0]], chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.relayEvent_, false, this);
  }, this);
  this.updateCounter();
  var isMobile = chatango.managers.Environment.getInstance().isMobile();
  var isIOS = chatango.managers.Environment.getInstance().isIOS();
  var stage_w = goog.style.getBounds(goog.dom.getDocument().body).width;
  var stage_h = isIOS ? this.viewportManager_.getViewportSizeMonitor().getSize().height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var rect = new goog.math.Rect(0, 0, stage_w, stage_h);
  var new_h = Math.round(stage_h);
  var heightConstraint = isMobile ? 1 : .85;
  this.setMaxHeight(new_h * heightConstraint);
  chatango.utils.display.constrainToStage(this.getElement(), rect, true);
  chatango.utils.display.keepActiveFormElementOnScreen(this.getElement());
  this.constrainDialogsToScreen();
  this.timer_.start();
};
chatango.group.participants.ParticipantsView.prototype.isUserVisible_ = function(isMod) {
  if (!this.canSeeMods_()) {
    return true;
  }
  var showUsers = this.userFilterButton_.isChecked();
  var showMods = this.modFilterButton_.isChecked();
  var show = true;
  if (!showMods && !showUsers) {
    show = false;
  }
  if (!showMods && isMod) {
    show = false;
  }
  if (!showUsers && showMods && !isMod) {
    show = false;
  }
  return show;
};
chatango.group.participants.ParticipantsView.prototype.onFilterCheck_ = function(e) {
  goog.object.forEach(this.profiles_, function(profile, sellerId) {
    var show = this.isUserVisible_(profile.isModerator());
    goog.style.showElement(profile.getElement(), show);
  }, this);
};
chatango.group.participants.ParticipantsView.prototype.onSortChange_ = function(e) {
  if (e.currentTarget === this.timeSortWrap_) {
    this.sort_ = chatango.group.participants.ParticipantsView.SortType.TIME;
    this.timeSortButton_.checked = true;
    this.nameSortButton_.checked = false;
  } else {
    this.sort_ = chatango.group.participants.ParticipantsView.SortType.NAME;
    this.timeSortButton_.checked = false;
    this.nameSortButton_.checked = true;
  }
  goog.dom.removeChildren(this.listContentEl_);
  goog.array.forEach(this.getSortedList_(), function(user) {
    if (this.profiles_[user[0]]) {
      this.profiles_[user[0]].exitDocument();
      this.profiles_[user[0]].render(this.listContentEl_);
    }
  }, this);
};
chatango.group.participants.ParticipantsView.prototype.onTick_ = function(e) {
  goog.object.forEach(this.profiles_, function(profile, sellerId) {
    profile.tick();
  }, this);
};
chatango.group.participants.ParticipantsView.prototype.formatLabel_ = function(userType, asNode) {
  var counter = this.controller_.getCounter();
  var value = counter[userType];
  if (userType === "sellers" && this.canSeeMods_()) {
    value -= counter["mods"];
  }
  var key = "filter_" + userType;
  if (this.sm_.isBelowFullFeaturedSize()) {
    key += "_short";
  }
  var str = this.lm_.getString("participants", key) + " (" + value + ")";
  var title = this.lm_.getString("participants", "filter_" + userType + "_title");
  if (userType === "anons" && !this.anonsAllowed_) {
    str = '<span style="font-style: italic">' + str + "</span>";
  }
  if (asNode) {
    return goog.dom.createDom("span", {"title":title}, str);
  } else {
    return'<span title="' + title + '">' + str + "</span>";
  }
};
chatango.group.participants.ParticipantsView.prototype.setAnons = function(anonsAllowed) {
  this.anonsAllowed_ = anonsAllowed;
  if (this.canSeeMods_()) {
    this.anonOption_.innerHTML = '<div><span class="chatango-checkbox-caption">' + this.formatLabel_("anons") + "</span></div>";
  } else {
    this.anonOption_.innerHTML = this.formatLabel_("anons");
  }
};
chatango.group.participants.ParticipantsView.prototype.drawFilters_ = function() {
  var canSeeMods = this.canSeeMods_();
  goog.dom.classes.enable(this.listContentEl_, "participants-mods", canSeeMods);
  if (this.userFilterButton_) {
    goog.events.unlisten(this.userFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.userFilterButton_.dispose();
    this.userFilterButton_ = null;
  }
  if (this.modFilterButton_) {
    goog.events.unlisten(this.modFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.modFilterButton_.dispose();
    this.modFilterButton_ = null;
  }
  if (canSeeMods) {
    this.anonOption_.innerHTML = '<div><span class="chatango-checkbox-caption">' + this.formatLabel_("anons") + "</span></div>";
    this.modOption_.innerHTML = "";
    this.userOption_.innerHTML = "";
    this.modFilterButton_ = new chatango.ui.Checkbox;
    goog.events.listen(this.modFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.modFilterButton_.render(this.modOption_);
    this.modFilterButton_.setCaption(this.formatLabel_("mods", true));
    this.modFilterButton_.setChecked(true);
    this.userFilterButton_ = new chatango.ui.Checkbox;
    goog.events.listen(this.userFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.userFilterButton_.render(this.userOption_);
    this.userFilterButton_.setCaption(this.formatLabel_("sellers", true));
    this.userFilterButton_.setChecked(true);
    if (!this.modOption_.parentNode) {
      goog.dom.insertSiblingBefore(this.modOption_, this.userOption_);
    }
  } else {
    goog.dom.removeNode(this.modOption_);
    this.anonOption_.innerHTML = this.formatLabel_("anons");
    this.userOption_.innerHTML = this.formatLabel_("sellers");
  }
};
chatango.group.participants.ParticipantsView.prototype.onAuthChange = function(mods) {
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  goog.array.forEach(goog.dom.getElementsByClass("mod-icon"), goog.dom.removeNode);
  goog.array.forEach(mods, function(sid) {
    this.profiles_[sid].draw();
  }, this);
  this.drawFilters_();
  this.onFilterCheck_();
};
chatango.group.participants.ParticipantsView.prototype.relayEvent_ = function(e) {
  this.dispatchEvent(e);
};
chatango.group.participants.ParticipantsView.prototype.enterDocument = function() {
  chatango.group.participants.ParticipantsView.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.participants.ParticipantsView.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (!this.element_) {
    return;
  }
  var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
  var new_h = Math.round(stage_h);
  this.setMaxHeight(new_h * .98);
  if (!this.isFullScreenAndMobileOrSmallEmbed()) {
    this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
    var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
    var width = Math.min(vpWidth * .9, 3.6 * chatango.managers.Style.getInstance().getScale());
    this.setWidth(width);
  } else {
    this.draw();
  }
  chatango.utils.display.constrainToStage(this.element_, opt_stageRect, true);
  chatango.utils.display.keepActiveFormElementOnScreen(this.element_);
};
chatango.group.participants.ParticipantsView.prototype.updateCopy = function() {
  var key = "dialog_title";
  if (this.sm_.isBelowFullFeaturedSize()) {
    key += "_short";
  }
  this.setTitle(this.lm_.getString("participants", key));
};
chatango.group.participants.ParticipantsView.prototype.onTitleCloseClick_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  this.controller_.onClose();
};
chatango.group.participants.ParticipantsView.prototype.disposeInternal = function() {
  if (this.nameSortButton_) {
    goog.events.unlisten(this.nameSortWrap_, goog.events.EventType.CLICK, this.onSortChange_, false, this);
  }
  if (this.timeSortButton_) {
    goog.events.unlisten(this.timeSortWrap_, goog.events.EventType.CLICK, this.onSortChange_, false, this);
  }
  if (this.modFilterButton_) {
    goog.events.unlisten(this.modFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.modFilterButton_.dispose();
    this.modFilterButton_ = null;
  }
  if (this.userFilterButton_) {
    goog.events.unlisten(this.userFilterButton_, goog.ui.Component.EventType.CHANGE, this.onFilterCheck_, false, this);
    this.userFilterButton_.dispose();
    this.userFilterButton_ = null;
  }
  if (this.timer_) {
    this.timer_.stop();
    goog.events.unlisten(this.timer_, goog.Timer.TICK, this.onTick_, false, this);
    this.timer_.dispose();
    this.timer_ = null;
  }
  for (var sid in this.profiles_) {
    if (this.profiles_.hasOwnProperty(sid)) {
      this.profiles_[sid].dispose();
      delete this.profiles_[sid];
    }
  }
  chatango.group.participants.ParticipantsView.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.participants.ParticipantsModel");
goog.require("chatango.users.UserManager");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.object");
chatango.group.participants.ParticipantsModel = function(controller) {
  goog.base(this);
  this.referrerPrefix_ = "phn_list";
  this.counter_ = {"anons":0, "sellers":0, "mods":0};
  this.sellers_ = {};
  this.sessions_ = {};
  this.mods_ = {};
  this.controller_ = controller;
};
goog.inherits(chatango.group.participants.ParticipantsModel, goog.events.EventTarget);
chatango.group.participants.ParticipantsModel.prototype.addUser = function(sellerId, data, opt_afterLoad) {
  var userType = sellerId === "None" ? chatango.users.User.UserType.ANON : chatango.users.User.UserType.SELLER;
  var user = chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + sellerId, sellerId, userType);
  if (sellerId !== "None") {
    if (this.sellers_[sellerId]) {
      this.sellers_[sellerId].push(data);
      var mostRecentCreated = goog.array.reduce(this.sellers_[sellerId], function(prev, cur) {
        return Math.max(prev, cur.timeCreated);
      }, 0);
      mostRecentCreated = new Date(mostRecentCreated * 1E3);
      if (opt_afterLoad) {
        this.controller_.updateView("update", [sellerId, mostRecentCreated, this.sellers_[sellerId].length]);
      }
    } else {
      this.counter_["sellers"]++;
      if (user.isModerator()) {
        this.counter_["mods"]++;
        this.mods_[sellerId] = true;
      }
      this.sellers_[sellerId] = [data];
      if (opt_afterLoad) {
        this.controller_.updateView("add", [sellerId, new Date(data.timeCreated * 1E3), 1]);
      }
    }
    this.sessions_[data.sessionId] = sellerId;
  } else {
    this.sessions_[data.sessionId] = null;
    this.counter_["anons"]++;
    if (opt_afterLoad) {
      this.controller_.updateView("anon");
    }
  }
};
chatango.group.participants.ParticipantsModel.prototype.onModsUpdated = function() {
  goog.object.forEach(this.mods_, this.checkStillMod_, this);
  var groupMods = chatango.users.ModeratorManager.getInstance().getMods();
  goog.object.forEach(groupMods, this.checkForNewMod_, this);
};
chatango.group.participants.ParticipantsModel.prototype.checkStillMod_ = function(bool, sid) {
  if (bool) {
    if (!chatango.users.ModeratorManager.getInstance().isModerator(sid)) {
      this.counter_["mods"]--;
      this.mods_[sid] = false;
      delete this.mods_[sid];
    }
  }
};
chatango.group.participants.ParticipantsModel.prototype.checkForNewMod_ = function(flags, sid) {
  if (this.sellers_[sid]) {
    if (!this.mods_[sid]) {
      this.counter_["mods"]++;
      this.mods_[sid] = true;
    }
  }
};
chatango.group.participants.ParticipantsModel.prototype.updateUser = function(sellerId, data, online) {
  var mostRecentCreated;
  if (online) {
    var user = chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + sellerId, sellerId, "S");
    if (this.sellers_[sellerId]) {
      this.sellers_[sellerId].push(data);
      mostRecentCreated = goog.array.reduce(this.sellers_[sellerId], function(prev, cur) {
        return Math.max(prev, cur.timeCreated);
      }, 0);
      mostRecentCreated = new Date(mostRecentCreated * 1E3);
      this.counter_["anons"]--;
      this.controller_.updateView("update", [sellerId, mostRecentCreated, this.sellers_[sellerId].length]);
    } else {
      this.counter_["sellers"]++;
      if (user.isModerator()) {
        this.counter_["mods"]++;
        this.mods_[sellerId] = true;
      }
      this.sellers_[sellerId] = [data];
      this.counter_["anons"]--;
      this.controller_.updateView("add", [sellerId, new Date(data.timeCreated * 1E3), 1]);
    }
    this.sessions_[data.sessionId] = sellerId;
  } else {
    for (var i = 0;i < this.sellers_[sellerId].length;i++) {
      if (this.sellers_[sellerId][i].sessionId === data.sessionId) {
        goog.array.removeAt(this.sellers_[sellerId], i);
        break;
      }
    }
    if (this.sellers_[sellerId].length === 0) {
      this.counter_["sellers"]--;
      if (this.mods_[sellerId]) {
        delete this.mods_[sellerId];
        this.counter_["mods"]--;
      }
      delete this.sellers_[sellerId];
      this.counter_["anons"]++;
      this.controller_.updateView("remove", [sellerId]);
    } else {
      mostRecentCreated = goog.array.reduce(this.sellers_[sellerId], function(prev, cur) {
        return Math.max(prev, cur.timeCreated);
      }, 0);
      mostRecentCreated = new Date(mostRecentCreated * 1E3);
      this.counter_["anons"]++;
      this.controller_.updateView("update", [sellerId, mostRecentCreated, this.sellers_[sellerId].length]);
    }
    this.sessions_[data.sessionId] = null;
  }
};
chatango.group.participants.ParticipantsModel.prototype.removeUser = function(sellerId, data) {
  var userType = sellerId === "None" ? chatango.users.User.UserType.ANON : chatango.users.User.UserType.SELLER;
  var user = chatango.users.UserManager.getInstance().addUser(this.referrerPrefix_ + sellerId, sellerId, userType);
  if (sellerId === "None") {
    this.counter_["anons"]--;
    delete this.sessions_[data.sessionId];
    this.controller_.updateView("anon");
  } else {
    for (var i = 0;i < this.sellers_[sellerId].length;i++) {
      if (this.sellers_[sellerId][i].sessionId === data.sessionId) {
        goog.array.removeAt(this.sellers_[sellerId], i);
        break;
      }
    }
    if (this.sellers_[sellerId].length === 0) {
      this.counter_["sellers"]--;
      if (this.mods_[sellerId]) {
        delete this.mods_[sellerId];
        this.counter_["mods"]--;
      }
      delete this.sellers_[sellerId];
      this.controller_.updateView("remove", [sellerId]);
    } else {
      var mostRecentCreated = goog.array.reduce(this.sellers_[sellerId], function(prev, cur) {
        return Math.max(prev, cur.timeCreated);
      }, 0);
      mostRecentCreated = new Date(mostRecentCreated * 1E3);
      this.controller_.updateView("update", [sellerId, mostRecentCreated, this.sellers_[sellerId].length]);
    }
  }
};
chatango.group.participants.ParticipantsModel.prototype.getSessionSeller = function(sessionId) {
  return this.sessions_[sessionId];
};
chatango.group.participants.ParticipantsModel.prototype.getList = function() {
  var result = [];
  goog.object.forEach(this.sellers_, function(sellerData, sellerId) {
    var mostRecentCreated = goog.array.reduce(sellerData, function(prev, cur) {
      return Math.max(prev, cur.timeCreated);
    }, 0);
    mostRecentCreated = new Date(mostRecentCreated * 1E3);
    result.push([sellerId, mostRecentCreated, sellerData.length]);
  }, this);
  return result;
};
chatango.group.participants.ParticipantsModel.prototype.getCounter = function() {
  return this.counter_;
};
chatango.group.participants.ParticipantsModel.prototype.setAnons = function(numAnons) {
  this.counter_["anons"] = numAnons;
};
chatango.group.participants.ParticipantsModel.prototype.getModerators = function() {
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  if (curUser && curUser.isModerator()) {
    return Object.keys(this.mods_);
  } else {
    return[];
  }
};
goog.provide("chatango.group.participants.ParticipantsController");
goog.require("chatango.group.participants.ParticipantsModel");
goog.require("chatango.group.participants.ParticipantsView");
goog.require("chatango.managers.WaitingAnimation");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.users.UserManager");
goog.require("goog.array");
goog.require("goog.events");
chatango.group.participants.ParticipantsController = function(connection, anonsAllowed) {
  goog.events.EventTarget.call(this);
  this.connection_ = connection;
  this.um_ = chatango.users.UserManager.getInstance();
  connection.send("gparticipants");
  this.view_ = new chatango.group.participants.ParticipantsView(this, anonsAllowed);
  this.model_ = new chatango.group.participants.ParticipantsModel(this);
  this.events_ = [chatango.networking.GroupConnectionEvent.EventType.gparticipants, chatango.networking.GroupConnectionEvent.EventType.participant];
  this.listLoaded_ = false;
  chatango.managers.WaitingAnimation.getInstance().startWaiting("participants_list", 50);
  this.view_.setVisible(true);
  goog.events.listen(this.connection_, this.events_, this.onEvent_, false, this);
  goog.events.listen(this.view_, chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.relayEvent_, false, this);
  goog.events.listen(chatango.users.ModeratorManager.getInstance(), chatango.users.ModeratorManager.EventType.MOD_FLAGS_UPDATED, this.onModsUpdated_, false, this);
};
goog.inherits(chatango.group.participants.ParticipantsController, goog.events.EventTarget);
chatango.group.participants.ParticipantsController.ParticipantStatus = {ONLINE:"1", OFFLINE:"0", AUTH_CHANGE:"2"};
chatango.group.participants.ParticipantsController.prototype.onEvent_ = function(e) {
  switch(e.type) {
    case chatango.networking.GroupConnectionEvent.EventType.gparticipants:
      this.onParticipants_(e);
      break;
    case chatango.networking.GroupConnectionEvent.EventType.participant:
      this.onParticipant_(e);
      break;
    default:
      if (chatango.DEBUG) {
        console.log("ParticipantsController event not handled:", e.type);
      }
      break;
  }
};
chatango.group.participants.ParticipantsController.prototype.onParticipants_ = function(e) {
  if (this.listLoaded_) {
    return;
  }
  var list = e.data.length > 2 ? e.data.slice(2).join(":").split(";") : [];
  var numAnons = parseInt(e.data[1], 10);
  this.model_.setAnons(numAnons);
  goog.array.forEach(list, function(u) {
    var user = u.split(":");
    var sessionId = user[0], sellerId = user[3];
    if (sellerId !== "None") {
      sellerId = this.um_.addUser(sellerId, sellerId, "S").getSid();
    }
    this.model_.addUser(sellerId, {sessionId:sessionId, timeCreated:user[1], cookie:user[2], alias:user[4], ip:user[5]});
  }, this);
  this.onListLoaded_();
};
chatango.group.participants.ParticipantsController.prototype.onListLoaded_ = function() {
  this.view_.initialize();
  this.listLoaded_ = true;
};
chatango.group.participants.ParticipantsController.prototype.getList = function() {
  return this.model_.getList();
};
chatango.group.participants.ParticipantsController.prototype.getCounter = function() {
  return this.model_.getCounter();
};
chatango.group.participants.ParticipantsController.prototype.onParticipant_ = function(e) {
  if (!this.listLoaded_) {
    return;
  }
  var user = e.data.slice(1);
  var status = user.shift();
  if (user[2] !== "None") {
    user[2] = this.um_.addUser(user[2], user[2], "S").getSid();
  }
  switch(status) {
    case chatango.group.participants.ParticipantsController.ParticipantStatus.ONLINE:
      this.participantOnline_(user);
      break;
    case chatango.group.participants.ParticipantsController.ParticipantStatus.OFFLINE:
      this.participantOffline_(user);
      break;
    case chatango.group.participants.ParticipantsController.ParticipantStatus.AUTH_CHANGE:
      this.participantChange_(user);
      break;
    default:
      if (chatango.DEBUG) {
        console.log("Invalid participant status:", status);
      }
    ;
  }
};
chatango.group.participants.ParticipantsController.prototype.participantOnline_ = function(user) {
  var sellerId = user[2];
  var userData = {sessionId:user[0], timeCreated:user[5], cookie:user[1], alias:user[3], ip:user[4]};
  this.model_.addUser(sellerId, userData, this.listLoaded_);
};
chatango.group.participants.ParticipantsController.prototype.participantOffline_ = function(user) {
  var sellerId = user[2];
  var userData = {sessionId:user[0], timeCreated:user[5], cookie:user[1], alias:user[3], ip:user[4]};
  this.model_.removeUser(sellerId, userData);
};
chatango.group.participants.ParticipantsController.prototype.participantChange_ = function(user) {
  var sessionId = user[0], sellerId = user[2];
  var userData = {sessionId:user[0], timeCreated:user[5], cookie:user[1], alias:user[3], ip:user[4]};
  var online = sellerId !== "None";
  if (!online) {
    sellerId = this.model_.getSessionSeller(sessionId);
  }
  if (!online && !sellerId && user[3]) {
    return;
  }
  this.model_.updateUser(sellerId, userData, online);
};
chatango.group.participants.ParticipantsController.prototype.updateView = function(type, data) {
  if (!this.listLoaded_) {
    return;
  }
  switch(type) {
    case "add":
      this.view_.addUser(data[0], data[1], data[2]);
      this.view_.draw();
      break;
    case "update":
      this.view_.updateUser(data[0], data[1], data[2]);
      this.view_.updateCounter();
      break;
    case "remove":
      this.view_.removeUser(data[0]);
      this.view_.draw();
      break;
    case "anon":
      this.view_.updateCounter();
      break;
    default:
      break;
  }
};
chatango.group.participants.ParticipantsController.prototype.setAnons = function(anonsAllowed) {
  this.view_.setAnons(anonsAllowed);
};
chatango.group.participants.ParticipantsController.prototype.onModsUpdated_ = function(e) {
  this.model_.onModsUpdated();
  this.view_.onAuthChange(this.model_.getModerators());
};
chatango.group.participants.ParticipantsController.prototype.onAuthChange = function() {
  this.view_.onAuthChange(this.model_.getModerators());
};
chatango.group.participants.ParticipantsController.prototype.relayEvent_ = function(e) {
  this.dispatchEvent(e);
};
chatango.group.participants.ParticipantsController.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  this.view_.constrainDialogsToScreen(opt_stageRect);
};
chatango.group.participants.ParticipantsController.prototype.onClose = function(e) {
  this.connection_.send("gparticipants:stop");
  this.dispatchEvent(chatango.events.EventType.PARTICIPANTS_CLOSE);
};
chatango.group.participants.ParticipantsController.prototype.disposeInternal = function() {
  goog.events.unlisten(this.connection_, this.events_, this.onEvent_, false, this);
  goog.events.unlisten(chatango.users.ModeratorManager.getInstance(), chatango.users.ModeratorManager.EventType.MOD_FLAGS_UPDATED, this.onModsUpdated_, false, this);
  if (this.view_) {
    goog.events.unlisten(this.view_, chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.relayEvent_, false, this);
    this.view_.dispose();
    this.view_ = null;
  }
  if (this.model_) {
    this.model_.dispose();
    this.model_ = null;
  }
  chatango.group.participants.ParticipantsController.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.ParticipantsModule");
goog.require("chatango.events.EventType");
goog.require("chatango.group.participants.ParticipantsController");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
chatango.modules.ParticipantsModule = function(connection, anonsAllowed) {
  goog.base(this);
  this.connection_ = connection;
  this.handler_ = new goog.events.EventHandler(this);
  this.participantsDialog_ = null;
  this.anonsAllowed_ = anonsAllowed;
  chatango.managers.LanguageManager.getInstance().getStringPack("participants", chatango.modules.ParticipantsModule.strs, this.initCopy, this);
};
goog.inherits(chatango.modules.ParticipantsModule, goog.events.EventTarget);
chatango.modules.ParticipantsModule.prototype.closePopups = function() {
  if (this.participantsDialog_) {
    goog.events.unlisten(this.participantsDialog_, chatango.events.EventType.PARTICIPANTS_CLOSE, this.closePopups, false, this);
    goog.events.unlisten(this.participantsDialog_, chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.openPm_, false, this);
    this.participantsDialog_.dispose();
    this.participantsDialog_ = null;
  }
};
chatango.modules.ParticipantsModule.prototype.openDialog = function() {
  if (this.participantsDialog_) {
    this.closePopups();
  }
  this.participantsDialog_ = new chatango.group.participants.ParticipantsController(this.connection_, this.anonsAllowed_);
  goog.events.listen(this.participantsDialog_, chatango.events.EventType.PARTICIPANTS_OPEN_PM, this.openPm_, false, this);
  goog.events.listen(this.participantsDialog_, chatango.events.EventType.PARTICIPANTS_CLOSE, this.closePopups, false, this);
};
chatango.modules.ParticipantsModule.prototype.openPm_ = function(e) {
  this.closePopups();
  this.dispatchEvent(e);
};
chatango.modules.ParticipantsModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("participants")) {
    if (this.menu_) {
      this.menu_.initCopy();
    }
  }
};
chatango.modules.ParticipantsModule.prototype.onAuthChange = function() {
  if (this.participantsDialog_) {
    this.participantsDialog_.onAuthChange();
  }
};
chatango.modules.ParticipantsModule.prototype.setAnons = function(anonsAllowed) {
  this.anonsAllowed_ = anonsAllowed;
  if (this.participantsDialog_) {
    this.participantsDialog_.setAnons(anonsAllowed);
  }
};
chatango.modules.ParticipantsModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.participantsDialog_) {
    this.participantsDialog_.constrainDialogsToScreen(opt_stageRect);
  }
};
chatango.modules.ParticipantsModule.strs = {"dialog_title":"People here now", "dialog_title_short":"Participants", "sort_name":"Name", "sort_time":"Time", "sort_label":"Sort", "filter_sellers":"Users", "filter_mods":"Mods", "filter_anons":"Anons", "filter_sellers_short":"U", "filter_mods_short":"M", "filter_anons_short":"A", "filter_sellers_title":"Unique users", "filter_mods_title":"Moderators", "filter_anons_title":"Anonymous users"};
goog.module.ModuleManager.getInstance().setLoaded("ParticipantsModule");

