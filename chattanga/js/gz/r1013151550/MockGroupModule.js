goog.provide("chatango.group.configurator.MockGroup");
goog.require("chatango.group.Group");
goog.require("chatango.networking.ConnectionStatusEvent");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.group.GroupConnectionUI");
goog.require("chatango.messagedata.GroupMessageData");
goog.require("chatango.users.UserManager");
goog.require("chatango.users.User");
chatango.group.configurator.MockGroup = function(init_obj) {
  this.init_obj_ = init_obj;
  this.isEmbeddableMockGroup_ = this.init_obj_["styles"] && this.init_obj_["styles"]["mockgroup"];
  this.mgSettings_ = this.init_obj_["mgsettings"] ? this.init_obj_["mgsettings"] : {};
  chatango.group.Group.call(this, this.init_obj_);
  goog.events.dispatchEvent(this.getConnection(), chatango.networking.ConnectionStatusEvent.EventType.CONNECTED);
  goog.events.dispatchEvent(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.inited);
  goog.events.listen(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.b, function(e) {
    this.output_.addMessage(new chatango.messagedata.GroupMessageData(e.data.messageArray_.join(":")));
  }, false, this);
  goog.events.unlisten(this.vsm_, goog.events.EventType.RESIZE, this.onResize, false, this);
  this.handler.unlisten(this.input_, chatango.events.EventType.SET_NAME, this.onSetName_);
  this.input_.setEnabled(true);
  goog.dom.classes.enable(this.contentWrapperEl_, "mockgroup", true);
  this.username_ = "";
  this.footer_.setVolumeControlState(!init_obj["styles"]["t"]);
  this.header_.groupTitleEl_.onclick = function(event) {
    return false;
  };
  this.header_.urlEl_.onclick = function(event) {
    return false;
  };
  this.footer_.logoEl_.onclick = function(event) {
    return false;
  };
  goog.events.unlisten(this.footer_.volumeControl_.speakerBtn_.getElement(), goog.events.EventType.CLICK, this.footer_.volumeControl_.speakerBtnClicked, false, this.footer_.volumeControl_);
  if (!this.isEmbeddableMockGroup_) {
    goog.events.listen(this, chatango.events.EventType.GET_BROWSER_VIEW, function() {
      var event = document.createEvent("Event");
      event.initEvent("cvclick", true, true);
      document.dispatchEvent(event);
    }, false, this);
    goog.events.listen(this, chatango.events.EventType.RESIZE_IFRAME, function(e) {
      var event = document.createEvent("Event");
      event.initEvent("resizer", true, true);
      document.dispatchEvent(event);
    }, false, this);
    goog.events.listen(this.groupInfo_, chatango.events.EventType.BAD_UPDATE_INFO, this.tellConfigNotLoggedIn, false, this);
    this.configurator_ = init_obj["configurator"];
  } else {
    this.setEmbeddableMockgroupContent_();
  }
};
goog.inherits(chatango.group.configurator.MockGroup, chatango.group.Group);
chatango.group.configurator.MockGroup.prototype.createChatManager = function() {
  if (!this.mockGroupChatManager_) {
    var a = new goog.events.EventTarget;
    a.groupConnectUI_ = new chatango.group.GroupConnectionUI(this.output_);
    this.mockGroupChatManager_ = a;
  }
  return this.mockGroupChatManager_;
};
chatango.group.configurator.MockGroup.prototype.getConnection = function() {
  if (!this.mockGroupConnection_) {
    var a = new goog.events.EventTarget;
    a.getStatus = function() {
      return chatango.networking.ConnectionStatusEvent.EventType.CONNECTED;
    };
    a.getFlags = function() {
      return chatango.networking.GroupConnection.flags;
    };
    a.base_n = this.mgSettings_ && this.mgSettings_["baseN"] ? this.mgSettings_["baseN"] : 130;
    a.getNumUsers = function() {
      return this.base_n.toString();
    };
    a.isConnected = function() {
      return true;
    };
    a.isConnectedOrConnecting = function() {
      return true;
    };
    a.selfKickOff = function() {
    };
    a.send = function() {
    };
    a.onData = function(event) {
      var evt = new chatango.networking.GroupConnectionEvent(chatango.networking.GroupConnectionEvent.EventType.b, new chatango.messagedata.GroupMessageData(event.message));
      this.dispatchEvent(evt);
    };
    this.mockGroupConnection_ = a;
    this.fluctuatePeopleCounter(true);
  }
  return this.mockGroupConnection_;
};
chatango.group.configurator.MockGroup.prototype.onCollapsedModLoaded = function() {
  chatango.group.configurator.MockGroup.superClass_.onCollapsedModLoaded.call(this);
  var cvMod = this.getCollapsedModule_();
  cvMod.getCollapsedView().onInited_();
};
chatango.group.configurator.MockGroup.prototype.fluctuatePeopleCounter = function(bool) {
  if (!bool) {
    return;
  }
  var t = Math.round((new Date).getTime() / 1E3);
  var base = this.mockGroupConnection_.base_n;
  var sm_period = 10;
  var big_period = 50;
  var big_amp = 25;
  var sm_amp = 5;
  var s = t % big_period;
  var sm_s = t % sm_period;
  var n = base + Math.round(big_amp * Math.sin(Math.PI * 2 * (s / big_period))) + Math.round(sm_amp * Math.sin(Math.PI * 2 * (sm_s / sm_period)));
  var hex = n.toString(16);
  this.mockGroupConnection_.dispatchEvent(new chatango.networking.GroupConnectionEvent(chatango.networking.GroupConnectionEvent.EventType.n, [chatango.networking.GroupConnectionEvent.EventType.n, hex]));
  var that = this;
  var next = t % 3 + 1 * 600;
  setTimeout(function() {
    that.fluctuatePeopleCounter(true);
  }, next);
};
chatango.group.configurator.MockGroup.prototype.requestGroupInfo = function(handle) {
};
chatango.group.configurator.MockGroup.prototype.createGroupInfo = function() {
  this.groupInfo_ = new chatango.group.GroupInfo(this.getConnection(), this.handle_, undefined, undefined, undefined, this.init_obj_["clonegroup"]);
};
chatango.group.configurator.MockGroup.prototype.onHideGroup = function() {
  if (this.embedType_ == chatango.group.GroupEmbedTypes.BOX) {
  } else {
    this.collapseGroup();
  }
};
chatango.group.configurator.MockGroup.prototype.setHidden = function(bool) {
};
chatango.group.configurator.MockGroup.prototype.onMessageInput_ = function(e) {
  var message = goog.string.htmlEscape(e.message);
  var n_prefix = "";
  message = message.replace(/\n/g, "<br/>");
  this.sendMessage(message);
};
chatango.group.configurator.MockGroup.prototype.openFullGroupPage = function() {
};
chatango.group.configurator.MockGroup.prototype.changeStyles = function(styles_object) {
  styles_object["cvfnt"] = styles_object["cvfnt"].replace(/\\/g, "");
  var oldTicker = chatango.managers.Style.getInstance().tickerEnabled();
  chatango.managers.Style.getInstance().update(styles_object);
  if (this.collapsedModule_ && chatango.managers.Style.getInstance().tickerEnabled() !== oldTicker) {
    this.collapsedModule_.clearCollapsedView();
    this.onCollapsedModLoaded();
    this.setEmbeddableMockgroupContent_();
    this.prepopulate();
  }
  this.output_.updateStyles();
};
chatango.group.configurator.MockGroup.prototype.changeSound = function(state) {
  this.footer_.setVolumeControlState(!state, state);
};
chatango.group.configurator.MockGroup.prototype.changeSize = function(width, height) {
  this.expandedSize_ = new goog.math.Size(width, height);
  this.intendedIframeSize_ = new goog.math.Size(width, height);
  this.intendToExpand_ = true;
  this.iframeResizeDone();
};
chatango.group.configurator.MockGroup.prototype.changeCvSize = function(width, height) {
  var style = chatango.managers.Style.getInstance();
  style.setCVSize(width, height);
};
chatango.group.configurator.MockGroup.prototype.resizeDone = function() {
  this.iframeResizeDone();
};
chatango.group.configurator.MockGroup.prototype.collapse = function() {
  this.collapseGroup();
};
chatango.group.configurator.MockGroup.prototype.setInfo = function(desc, title, handle, set_on_server) {
  this.groupInfo_.setInfo(desc, title, handle);
  if (set_on_server) {
    this.groupInfo_.setBasicGroupInfo(title, desc);
  }
};
chatango.group.configurator.MockGroup.prototype.tellConfigNotLoggedIn = function() {
  this.callOnConfigurator("notLoggedIn", []);
};
chatango.group.configurator.MockGroup.prototype.sendMessage = function(message) {
  if (this.messageCount_) {
    this.messageCount_ = this.messageCount_ + 1;
  } else {
    this.messageCount_ = 1;
  }
  var d = new Date;
  var ts = Math.round(d.getTime() / 1E3);
  if (this.username_) {
    var user = this.username_
  } else {
    var user = "_Zeus"
  }
  var messageString = "i:" + ts + ":" + user + ":mock-own-msg:83875698::MsgId" + this.messageCount_ + "::0::" + message;
  this.output_.addMessage(new chatango.messagedata.GroupMessageData(messageString));
};
chatango.group.configurator.MockGroup.prototype.sendMessages = function(messages, opt_postingInterval, opt_randomInterval) {
  goog.events.dispatchEvent(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.inited);
  var postInt = opt_postingInterval ? opt_postingInterval : 5E3;
  if (this.autoMessages_) {
    this.autoMessages_.dispose();
    this.autoMessages_ = null;
  }
  this.autoMessages_ = new chatango.group.AutoMessenger(this.output_, this.getConnection(), postInt, messages, this.handle_, opt_randomInterval);
};
chatango.group.configurator.MockGroup.prototype.prepopulate = function() {
  if (this.autoMessages_) {
    goog.events.dispatchEvent(this.getConnection(), chatango.networking.GroupConnectionEvent.EventType.inited);
    this.autoMessages_.prepopulate();
  }
};
chatango.group.configurator.MockGroup.prototype.startMessages = function() {
  if (this.autoMessages_) {
    this.autoMessages_.start();
  }
};
chatango.group.configurator.MockGroup.prototype.stopMessages = function() {
  if (this.autoMessages_) {
    this.autoMessages_.stop();
  }
};
chatango.group.configurator.MockGroup.prototype.counterFit = function() {
  return this.getCollapsedModule_().getCollapsedView().canCounterFit();
};
chatango.group.configurator.MockGroup.prototype.headerShow = function() {
  return{"title":this.header_.groupTitleEl_.innerHTML != "", "owner":this.header_.ownersMessageTextContainer_.innerHTML != "", "url":this.header_.urlEl_.innerHTML != ""};
};
chatango.group.configurator.MockGroup.prototype.setUsername = function(user) {
  this.username_ = user;
};
chatango.group.configurator.MockGroup.prototype.callOnConfigurator = function(func, args) {
  return this.configurator_[func](args[0], args[1], args[2], args[3], args[4]);
};
chatango.group.configurator.MockGroup.prototype.setEmbeddableMockgroupContent_ = function() {
  var title = "Example group";
  var ownersMsg = "Example message from the owner";
  var handle = "example";
  var messages = [["_Athena", "Chatango is a live group conversation you can easily embed into your pages."], ["_Artemis", "You and your site&#39;s visitors can all talk with each other in real-time."], ["_Poseidon", "Ideal for news, live video, community, gaming, and hobby sites."], ["_Zeus", "You can monitor and moderate the group from any device, from anywhere."], ["_Artemis", "Embed as a small Button, a sticky Tab or a larger Box."], ["_Atlas", "The group has sophisticated content controls: intelligent word banning, rate limits, and moderation."], 
  ["_Apollo", "Optional anonymity, controlled by the group owner."], ["_Prometheus", "It is highly scalable and customizable."], ["_Zeus", "Works on iOS and Android."]];
  if (this.init_obj_["styles"]["mgmsgs"]) {
    messages = this.init_obj_["styles"]["mgmsgs"];
  }
  var messageInt = 5E3;
  if (this.init_obj_["styles"]["mgmsgint"]) {
    messageInt = this.init_obj_["styles"]["mgmsgint"];
  }
  if (this.init_obj_["styles"]["mgtitle"]) {
    title = this.init_obj_["styles"]["mgtitle"];
  }
  if (this.init_obj_["styles"]["mgownermsg"]) {
    ownersMsg = this.init_obj_["styles"]["mgownermsg"];
  }
  if (this.init_obj_["styles"]["mghandle"]) {
    handle = this.init_obj_["styles"]["mghandle"];
  }
  this.setInfo(ownersMsg, title, handle, false);
  this.sendMessages(messages, messageInt);
};
goog.exportSymbol("chatango.group.configurator.MockGroup", chatango.group.configurator.MockGroup);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "changeStyles", chatango.group.configurator.MockGroup.prototype.changeStyles);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "changeSize", chatango.group.configurator.MockGroup.prototype.changeSize);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "changeCvSize", chatango.group.configurator.MockGroup.prototype.changeCvSize);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "resizeDone", chatango.group.configurator.MockGroup.prototype.resizeDone);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "setInfo", chatango.group.configurator.MockGroup.prototype.setInfo);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "changeSound", chatango.group.configurator.MockGroup.prototype.changeSound);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "sendMessage", chatango.group.configurator.MockGroup.prototype.sendMessage);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "sendMessages", chatango.group.configurator.MockGroup.prototype.sendMessages);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "stopMessages", chatango.group.configurator.MockGroup.prototype.stopMessages);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "startMessages", chatango.group.configurator.MockGroup.prototype.startMessages);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "prepopulate", chatango.group.configurator.MockGroup.prototype.prepopulate);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "counterFit", chatango.group.configurator.MockGroup.prototype.counterFit);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "headerShow", chatango.group.configurator.MockGroup.prototype.headerShow);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "setUsername", chatango.group.configurator.MockGroup.prototype.setUsername);
goog.exportProperty(chatango.group.configurator.MockGroup.prototype, "collapse", chatango.group.configurator.MockGroup.prototype.collapse);
goog.provide("chatango.modules.MockGroupModule");
goog.require("chatango.group.configurator.MockGroup");
goog.require("chatango.modules.CollapsedViewModule");
goog.require("goog.module.ModuleManager");
chatango.modules.MockGroupModule = function() {
  var a = chatango.group.configurator.MockGroup;
};
goog.addSingletonGetter(chatango.modules.MockGroupModule);

