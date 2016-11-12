goog.provide("chatango.ui.icons.SvgHorizArrowIcon");
goog.require("chatango.ui.icons.SvgIcon");
chatango.ui.icons.SvgHorizArrowIcon = function(orientation, opt_color, opt_domHelper) {
  chatango.ui.icons.SvgIcon.call(this, opt_color, opt_domHelper);
  this.orientation_ = orientation == null ? 0 : orientation;
};
goog.inherits(chatango.ui.icons.SvgHorizArrowIcon, chatango.ui.icons.SvgIcon);
chatango.ui.icons.SvgHorizArrowIcon.prototype.createDom = function() {
  chatango.ui.icons.SvgHorizArrowIcon.superClass_.createDom.call(this);
  goog.dom.classes.add(this.element_, "icon-horiz-arrow");
};
chatango.ui.icons.SvgHorizArrowIcon.prototype.draw = function() {
  var path = "M 5 80 L 25 50 L 5 20 Z";
  if (this.orientation_ === 1) {
    path = "M 25 80 L 5 50 L 25 20 Z";
  }
  this.element_.innerHTML = '<svg height="100%" viewBox="0 0 30 100"><defs></defs><path d="' + path + '" fill="' + this.color_ + '"></svg>';
};
chatango.ui.icons.SvgHorizArrowIcon.prototype.flip = function() {
  this.orientation_ = 1 - this.orientation_;
  this.draw();
};
goog.provide("goog.fx.easing");
goog.fx.easing.easeIn = function(t) {
  return goog.fx.easing.easeInInternal_(t, 3);
};
goog.fx.easing.easeInInternal_ = function(t, exp) {
  return Math.pow(t, exp);
};
goog.fx.easing.easeOut = function(t) {
  return goog.fx.easing.easeOutInternal_(t, 3);
};
goog.fx.easing.easeOutInternal_ = function(t, exp) {
  return 1 - goog.fx.easing.easeInInternal_(1 - t, exp);
};
goog.fx.easing.easeOutLong = function(t) {
  return goog.fx.easing.easeOutInternal_(t, 4);
};
goog.fx.easing.inAndOut = function(t) {
  return 3 * t * t - 2 * t * t * t;
};
goog.provide("goog.fx");
goog.require("goog.asserts");
goog.require("goog.fx.Animation");
goog.require("goog.fx.Animation.EventType");
goog.require("goog.fx.Animation.State");
goog.require("goog.fx.AnimationEvent");
goog.require("goog.fx.Transition.EventType");
goog.require("goog.fx.easing");
goog.provide("chatango.group.CollapsedViewComponent");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.managers.Style");
goog.require("chatango.networking.GroupConnectionEvent");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.ui.icons.SvgHorizArrowIcon");
goog.require("chatango.ui.icons.SvgLogoIcon");
goog.require("chatango.users.User");
goog.require("chatango.users.UserManager");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.fx");
goog.require("goog.ui.Button");
goog.require("goog.ui.Component");
goog.require("goog.ui.LinkButtonRenderer");
chatango.group.CollapsedViewComponent = function(con, groupInfo, alreadyInited, opt_lastMessages) {
  goog.ui.Component.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.scale_ = 100;
  var embedType = chatango.managers.Style.getInstance().getEmbedType();
  this.iconSize_ = embedType === chatango.group.GroupEmbedTypes.BUTTON ? 13 : 18;
  this.con_ = con;
  this.numUsers_ = this.con_.getNumUsers();
  this.initedAtTimeOfConstruction_ = alreadyInited == true;
  goog.events.listen(con, [chatango.networking.GroupConnectionEvent.EventType.deletemsg, chatango.networking.GroupConnectionEvent.EventType.deleteall, chatango.networking.GroupConnectionEvent.EventType.clearall], this.msgsDeleted_, false, this);
  goog.events.listen(con, chatango.networking.GroupConnectionEvent.EventType.n, this.updateCounter, false, this);
  if (chatango.managers.Style.getInstance().tickerEnabled()) {
    goog.events.listen(con, chatango.networking.GroupConnectionEvent.EventType.inited, this.onInited_, false, this);
    goog.events.listen(con, [chatango.networking.GroupConnectionEvent.EventType.i, chatango.networking.GroupConnectionEvent.EventType.b], this.onMessage_, false, this);
  }
  this.groupInfo_ = groupInfo;
  this.handle_ = this.groupInfo_.getGroupHandle();
  this.chatIcon_ = new chatango.ui.icons.SvgLogoIcon(chatango.managers.Style.getInstance().getCVForegroundColor());
  this.chatIcon_.setCollapsedView(true);
  this.tickerHidden_ = goog.net.cookies.get("cvhidden" + this.handle_) === "true";
  this.tickerToggleIcon_ = new chatango.ui.icons.SvgHorizArrowIcon(~~this.tickerHidden_, chatango.managers.Style.getInstance().getCVForegroundColor());
  this.messagePointer_ = null;
  this.messageQueue_ = [];
  if (opt_lastMessages && opt_lastMessages.length > 0) {
    this.createMessageQueueFromLastMessages_(opt_lastMessages);
  }
  this.newMessage_ = false;
  this.tickerStarted_ = false;
};
goog.inherits(chatango.group.CollapsedViewComponent, goog.ui.Component);
chatango.group.CollapsedViewComponent.prototype.getFontSize = function() {
  var node = this.cvWrapper_.cloneNode();
  node.innerHTML = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  node.style.position = "absolute";
  node.style.display = "block";
  node.style.visibility = "hidden";
  node.style.height = "auto";
  node.style.width = "auto";
  document.body.appendChild(node);
  var height = node.clientHeight;
  var width = node.clientWidth / node.innerHTML.length;
  document.body.removeChild(node);
  return{"height":height, "width":width};
};
chatango.group.CollapsedViewComponent.prototype.getPositioning = function(pos) {
  switch(pos) {
    case "br":
      return "bottom: 0; right: 0;";
    case "bl":
      return "bottom: 0; left: 0;";
    case "tr":
      return "top: 0; right: 0;";
    case "tl":
      return "top: 0; left: 0;";
    default:
      return;
  }
};
chatango.group.CollapsedViewComponent.prototype.createDom = function() {
  var styleManager = chatango.managers.Style.getInstance();
  var cvSize = styleManager.getCVSize();
  var embedType = chatango.managers.Style.getInstance().getEmbedType();
  var positioning = this.getPositioning(styleManager.getCVPosition());
  this.collapsedViewEl_ = goog.dom.createDom("div", {"id":"CV", "style":positioning});
  goog.style.setStyle(this.collapsedViewEl_, {"position":"absolute", "cursor":"pointer", "overflow":"hidden", "height":cvSize.height + "px", "width":cvSize.width + "px"});
  this.bgEl_ = goog.dom.createDom("div", {"id":"CV_BG", "style":"position:absolute; height:100%; width:100%"});
  goog.events.listen(styleManager, chatango.managers.Style.EventType.USER_DEFINED_CV_BG_STYLE_CHANGED, this.updateBgStyle, null, this);
  this.updateBgStyle();
  this.cvWrapper_ = goog.dom.createDom("div", {"id":"CV_WRAPPER"});
  var fontSize = this.getFontSize();
  this.fontHeight_ = fontSize.height;
  this.fontWidth_ = fontSize.width;
  if (styleManager.tickerEnabled()) {
    this.tickerToggleEl_ = goog.dom.createDom("div", {"id":"CV_TICKER_TOGGLE", "class":"cv-cell", "title":"Click to toggle ticker"});
    this.tickerToggleIcon_.render(this.tickerToggleEl_);
    goog.style.showElement(this.tickerToggleEl_, false);
    goog.dom.appendChild(this.cvWrapper_, this.tickerToggleEl_);
    goog.events.listen(this.tickerToggleEl_, [goog.events.EventType.CLICK, goog.events.EventType.TOUCHEND], this.toggleTicker_, false, this);
    this.tickerWrapperEl_ = goog.dom.createDom("div", {"id":"CV_TICKER_WRAPPER", "class":"cv-cell"});
    this.tickerEl_ = goog.dom.createDom("div", {"id":"CV_TICKER"});
    goog.style.showElement(this.tickerWrapperEl_, embedType === chatango.group.GroupEmbedTypes.BUTTON || !this.tickerHidden_);
    goog.dom.appendChild(this.tickerWrapperEl_, this.tickerEl_);
    goog.dom.appendChild(this.cvWrapper_, this.tickerWrapperEl_);
    this.counterEl_ = goog.dom.createDom("div", {"id":"CV_NUM", "class":"cv-cell"}, this.numUsers_);
    goog.style.showElement(this.counterEl_, false);
    goog.dom.appendChild(this.cvWrapper_, this.counterEl_);
    this.chatIconWrapper_ = goog.dom.createDom("div", {"id":"CV_ICON", "class":"cv-cell"});
    goog.style.showElement(this.chatIconWrapper_, embedType === chatango.group.GroupEmbedTypes.BUTTON);
    this.chatIcon_.render(this.chatIconWrapper_);
    goog.dom.classes.add(this.chatIcon_.getElement(), "cv-icon");
    goog.dom.appendChild(this.cvWrapper_, this.chatIconWrapper_);
  } else {
    var wrapperCell = goog.dom.createDom("div", {"id":"CV_CELL_WRAP", "class":"cv-cell"});
    this.counterEl_ = goog.dom.createDom("div", {"id":"CV_NUM", style:"display: inline-block; vertical-align: middle"}, this.numUsers_);
    goog.style.showElement(this.counterEl_, false);
    goog.dom.appendChild(wrapperCell, this.counterEl_);
    this.chatIconWrapper_ = goog.dom.createDom("div", {"id":"CV_ICON", style:"display: inline-block; vertical-align: middle"});
    this.chatIcon_.render(this.chatIconWrapper_);
    goog.dom.classes.add(this.chatIcon_.getElement(), "cv-icon");
    goog.dom.appendChild(wrapperCell, this.chatIconWrapper_);
    goog.dom.appendChild(this.cvWrapper_, wrapperCell);
  }
  goog.events.listen(styleManager, chatango.managers.Style.EventType.USER_DEFINED_CV_FG_COLOR_CHANGED, this.updateForegroundColor_, null, this);
  this.updateForegroundColor_();
  goog.dom.appendChild(this.collapsedViewEl_, this.bgEl_);
  goog.dom.appendChild(this.collapsedViewEl_, this.cvWrapper_);
  this.setElementInternal(this.collapsedViewEl_);
  this.updateCopy();
  if (this.initedAtTimeOfConstruction_) {
    this.onInited_();
  } else {
    this.draw();
  }
};
chatango.group.CollapsedViewComponent.MAX_TICKER_MSGS = 5;
chatango.group.CollapsedViewComponent.SCROLL_SPEED = 70;
chatango.group.CollapsedViewComponent.prototype.onInited_ = function(e) {
  if (!this.element_ || this.inited_ || !chatango.managers.Style.getInstance().tickerEnabled()) {
    return;
  }
  this.inited_ = true;
  this.draw();
  this.startTicker();
};
chatango.group.CollapsedViewComponent.prototype.onMessage_ = function(e) {
  var msgText = e.data.getMessageText();
  if (msgText.replace(/\s/g, "") === "") {
    return;
  }
  var sid = e.data.getName();
  if (chatango.managers.Environment.getInstance().isMockGroup()) {
    sid = sid.replace(/^\_/, "");
  }
  var oldPtr = this.messagePointer_;
  this.newMessage_ = true;
  if (e.type === chatango.networking.GroupConnectionEvent.EventType.i) {
    if (this.messageQueue_.length < chatango.group.CollapsedViewComponent.MAX_TICKER_MSGS) {
      this.messageQueue_.push([sid, msgText]);
    }
    this.messagePointer_ = this.messageQueue_.length - 1;
  } else {
    this.messageQueue_.unshift([sid, msgText]);
    if (this.messageQueue_.length > chatango.group.CollapsedViewComponent.MAX_TICKER_MSGS) {
      this.messageQueue_.pop();
    }
    this.messagePointer_ = 0;
    var entering = goog.dom.getElementByClass("ticker-entry", this.tickerEl_);
    var scrolling = goog.dom.getElementByClass("ticker-scroll", this.tickerEl_);
    if (scrolling) {
      var left = scrolling.offsetLeft.toString();
      this.setTransitionDuration(scrolling, "");
      goog.events.unlisten(scrolling, goog.events.EventType.TRANSITIONEND, this.onTransitionEnd_, false, this);
      goog.events.listenOnce(scrolling, goog.events.EventType.TRANSITIONEND, this.onTransitionEnd_, false, this);
      goog.dom.classlist.swap(scrolling, "ticker-scroll", "ticker-exit");
      scrolling.style.left = left + "px";
      this.addMessage_();
    } else {
      if (entering) {
        goog.events.unlisten(entering, goog.events.EventType.TRANSITIONEND, this.onTransitionEnd_, false, this);
        goog.events.listenOnce(entering, goog.events.EventType.TRANSITIONEND, function() {
          goog.events.listenOnce(entering, goog.events.EventType.TRANSITIONEND, this.onTransitionEnd_, false, this);
          goog.dom.classlist.swap(entering, "ticker-entry", "ticker-exit");
          this.addMessage_();
        }, false, this);
      } else {
        if (this.tickerEl_ && this.tickerEl_.children.length === 0) {
          this.addMessage_();
        }
      }
    }
  }
};
chatango.group.CollapsedViewComponent.prototype.setTransitionDuration = function(el, value) {
  el.style.transitionDuration = value;
  if (el.style.webkitTransitionDuration) {
    el.style.webkitTransitionDuration = value;
  }
};
chatango.group.CollapsedViewComponent.prototype.startTickerId_;
chatango.group.CollapsedViewComponent.prototype.clearTicker = function() {
  if (this.startTickerId_) {
    clearTimeout(this.startTickerId_);
  }
  if (!this.tickerEl_) {
    return;
  }
  goog.array.forEach(this.tickerEl_.children, function(el) {
    goog.events.unlisten(el, goog.events.EventType.TRANSITIONEND, this.onTransitionEnd_, false, this);
  }, this);
  goog.dom.removeChildren(this.tickerEl_);
};
chatango.group.CollapsedViewComponent.prototype.startTicker = function() {
  this.clearTicker();
  this.newMessage_ = true;
  this.startTickerId_ = setTimeout(goog.bind(function() {
    this.tickerStarted_ = true;
    this.messagePointer_ = Math.max(this.messageQueue_.length - 1, 0);
    this.addMessage_();
  }, this), 0);
};
chatango.group.CollapsedViewComponent.prototype.stopTicker = function() {
  this.clearTicker();
  this.messagePointer_ = this.messageQueue_.length - 1;
  this.tickerStarted_ = false;
};
chatango.group.CollapsedViewComponent.prototype.formatMsg = function(data, isNew) {
  var el = goog.dom.createDom("div", {"class":"ticker-msg"});
  if (isNew) {
    goog.dom.classlist.add(el, "ticker-before");
  } else {
    goog.dom.classlist.add(el, "ticker-before-old");
  }
  el.appendChild(goog.dom.createDom("span", {"class":"ticker-msg-uid"}, data[0]));
  el.appendChild(goog.dom.createDom("span", {}, data[1]));
  var height = this.fontHeight_ + "px";
  return el;
};
chatango.group.CollapsedViewComponent.prototype.addMessage_ = function() {
  if (!goog.style.isElementShown(this.collapsedViewEl_) || !this.tickerEl_ || this.tickerEl_.children.length > 1 || this.tickerHidden_ || !chatango.managers.Style.getInstance().tickerEnabled() || !this.tickerStarted_ || this.messageQueue_.length === 0) {
    return;
  }
  var el = this.formatMsg(this.messageQueue_[this.messagePointer_], this.newMessage_);
  goog.events.listenOnce(el, goog.events.EventType.TRANSITIONEND, this.onTransitionEnd_, false, this);
  goog.dom.appendChild(this.tickerEl_, el);
  this.tempTopValue_ = el.offsetTop;
  this.tempTopValue_ = "anti-compression" + this.tempTopValue_;
  var newMsg = this.newMessage_;
  setTimeout(goog.bind(function() {
    if (newMsg) {
      goog.dom.classlist.swap(el, "ticker-before", "ticker-entry");
    } else {
      var w = this.tickerEl_.offsetWidth + el.offsetWidth;
      var dur = w / this.getScrollSpeed_() + "s";
      this.setTransitionDuration(el, dur);
      el.style.left = "-" + el.offsetWidth + "px";
      goog.dom.classlist.swap(el, "ticker-before-old", "ticker-scroll");
    }
  }, this), 0);
  this.newMessage_ = false;
};
chatango.group.CollapsedViewComponent.prototype.onTransitionEnd_ = function(e) {
  var el = e.target;
  if (goog.dom.classlist.contains(el, "ticker-entry")) {
    goog.events.listenOnce(el, goog.events.EventType.TRANSITIONEND, this.onTransitionEnd_, false, this);
    if (!this.newMessage_) {
      var dur = el.offsetWidth / this.getScrollSpeed_() + "s";
      this.setTransitionDuration(el, dur);
      el.style.left = "-" + el.offsetWidth + "px";
      goog.dom.classlist.swap(el, "ticker-entry", "ticker-scroll");
    } else {
      goog.dom.classlist.swap(el, "ticker-entry", "ticker-exit");
      this.addMessage_();
    }
  } else {
    if (goog.dom.classlist.contains(el, "ticker-scroll")) {
      goog.dom.removeNode(el);
      this.messagePointer_ = (this.messagePointer_ - 1 + this.messageQueue_.length) % this.messageQueue_.length;
      if (this.tickerEl_.children.length === 0) {
        this.addMessage_();
      }
    } else {
      if (goog.dom.classlist.contains(el, "ticker-exit")) {
        goog.dom.removeNode(el);
        if (this.messagePointer_ !== 0) {
          this.messagePointer_ = (this.messagePointer_ - 1 + this.messageQueue_.length) % this.messageQueue_.length;
        }
        if (this.tickerEl_.children.length === 0) {
          this.addMessage_();
        }
      }
    }
  }
};
chatango.group.CollapsedViewComponent.prototype.updateBgStyle = function(opt_e) {
  goog.style.setStyle(this.bgEl_, "background-color", chatango.managers.Style.getInstance().getCVBackgroundColor());
  goog.style.setStyle(this.bgEl_, "opacity", chatango.managers.Style.getInstance().getCVBackgroundOpacity() / 100);
};
chatango.group.CollapsedViewComponent.prototype.updateForegroundColor_ = function(opt_e) {
  goog.style.setStyle(this.counterEl_, "color", chatango.managers.Style.getInstance().getCVForegroundColor());
  if (this.tickerEl_) {
    goog.style.setStyle(this.tickerEl_, "color", chatango.managers.Style.getInstance().getCVForegroundColor());
  }
  if (this.tickerToggleEl_) {
    this.tickerToggleIcon_.setColor(chatango.managers.Style.getInstance().getCVForegroundColor());
  }
  this.chatIcon_.setColor(chatango.managers.Style.getInstance().getCVForegroundColor());
};
chatango.group.CollapsedViewComponent.prototype.updateCounter = function(e) {
  this.numUsers_ = parseInt(e.data[1], 16);
  if (this.counterEl_) {
    goog.dom.setTextContent(this.counterEl_, this.numUsers_);
    this.draw();
  }
};
chatango.group.CollapsedViewComponent.prototype.draw = function() {
  if (!this.isInDocument()) {
    return;
  }
  var styleManager = chatango.managers.Style.getInstance();
  var embedType = styleManager.getEmbedType();
  var showCounter = this.getShowCounter();
  var counterDisplay = styleManager.tickerEnabled() ? "table-cell" : "inline-block";
  if (showCounter) {
    showCounter = this.canCounterFit();
    if (this.counterEl_.innerHTML === "") {
      this.numUsers_ = this.con_.getNumUsers();
      goog.dom.setTextContent(this.counterEl_, this.numUsers_);
    }
  }
  if (showCounter && !this.groupInfo_.getShowCounter()) {
    goog.style.setStyle(this.counterEl_, "font-style", "italic");
  } else {
    goog.style.setStyle(this.counterEl_, "font-style", "");
  }
  this.fontHeight_ = this.getFontSize().height;
  goog.style.showElement(this.counterEl_, showCounter);
  if (showCounter) {
    goog.style.setStyle(this.counterEl_, "display", counterDisplay);
    goog.style.setStyle(this.counterEl_, "line-height", this.fontHeight_ + "px");
  }
  goog.style.setStyle(this.counterEl_, {"padding-top":"", "padding-bottom":""});
  goog.style.setStyle(this.chatIconWrapper_, {"padding":"", "margin":""});
  var iconSize = this.fontHeight_;
  var cvSize = chatango.managers.Style.getInstance().getCVSize();
  var minDim = Math.min(cvSize.width, cvSize.height);
  var newCounterPadding = this.counterEl_.offsetHeight > minDim ? "0" : "";
  goog.style.setStyle(this.counterEl_, {"padding-top":newCounterPadding, "padding-bottom":newCounterPadding});
  var iconEl = this.chatIcon_.getElement();
  var attr = styleManager.tickerEnabled() ? "padding-top" : "margin-top";
  var padding = styleManager.tickerEnabled() ? .6 : .36;
  if (minDim < iconSize * (1 + padding)) {
    iconSize = minDim - 5;
    if (showCounter) {
      goog.style.setStyle(this.chatIconWrapper_, {"padding-top":"0", "margin-top":"0", "padding-bottom":"0", "margin-bottom":"0"});
    } else {
      goog.style.setStyle(this.chatIconWrapper_, {"padding":"0", "margin":"0"});
    }
  } else {
    goog.style.setStyle(this.chatIconWrapper_, {"padding":"", "margin":""});
    goog.style.setStyle(this.chatIconWrapper_, attr, padding + "em");
  }
  goog.style.setSize(iconEl, iconSize, iconSize);
  if (this.tickerEl_) {
    if (embedType === chatango.group.GroupEmbedTypes.BUTTON) {
      if (this.tickerHidden_) {
        goog.dom.insertSiblingAfter(this.tickerToggleEl_, this.tickerWrapperEl_);
      } else {
        goog.dom.insertSiblingBefore(this.tickerToggleEl_, this.tickerWrapperEl_);
      }
      goog.style.setStyle(this.tickerWrapperEl_, "visibility", this.tickerHidden_ ? "hidden" : "");
    } else {
      goog.style.showElement(this.tickerWrapperEl_, !this.tickerHidden_);
    }
    setTimeout(goog.bind(function() {
      if (!this.isInDocument()) {
        return;
      }
      goog.style.showElement(this.tickerToggleEl_, true);
      var minCounterWidth = this.getMinCounterWidth_();
      var margin = Math.min(Math.max(1 / 3 * iconSize, 2), 10);
      var height = this.fontHeight_ + "px";
      this.tickerEl_.style.height = height;
      this.tickerWrapperEl_.style.paddingRight = margin + "px";
      var elWidth = this.tickerHidden_ && embedType !== chatango.group.GroupEmbedTypes.BUTTON ? this.tickerToggleIcon_.getElement().offsetWidth + minCounterWidth : cvSize.width;
      this.element_.style.width = elWidth + "px";
    }, this), 0);
  }
};
chatango.group.CollapsedViewComponent.prototype.updateCopy = function() {
  goog.dom.setProperties(this.collapsedViewEl_, {"title":this.lm_.getString("basic_group", "click_to_chat")});
};
chatango.group.CollapsedViewComponent.prototype.getShowCounter = function() {
  var showCounter = this.groupInfo_.getShowCounter();
  var userType = null;
  var curUser = chatango.users.UserManager.getInstance().currentUser;
  if (curUser) {
    userType = curUser.getType();
  }
  if (userType == chatango.users.User.UserType.SELLER) {
    if (curUser.isOwner() || curUser.isModerator() || curUser.getSid() == "chatango") {
      showCounter = true;
    }
  }
  return showCounter;
};
chatango.group.CollapsedViewComponent.prototype.getMinCounterWidth_ = function() {
  var chars = this.counterEl_.innerHTML.length;
  var counterMargins = goog.style.getPaddingBox(this.counterEl_);
  var minCounterWidth = chars * this.fontWidth_ + counterMargins.left + counterMargins.right;
  return minCounterWidth;
};
chatango.group.CollapsedViewComponent.prototype.canCounterFit = function() {
  if (!this.counterEl_ || !this.chatIcon_) {
    return false;
  }
  var minCounterWidth = this.getMinCounterWidth_();
  var iconWidth = goog.style.getBounds(this.chatIcon_.getElement()).width;
  var iconMargins = goog.style.getPaddingBox(this.chatIconWrapper_);
  iconWidth += iconMargins.left + iconMargins.right;
  var minWidth = minCounterWidth + iconWidth;
  var cvSize = chatango.managers.Style.getInstance().getCVSize();
  var canCounterFit = cvSize.width >= minWidth;
  return canCounterFit;
};
chatango.group.CollapsedViewComponent.prototype.scheduleStartTickerId_;
chatango.group.CollapsedViewComponent.prototype.setSize = function(opt_size) {
  if (!this.collapsedViewEl_) {
    return;
  }
  if (opt_size != undefined) {
    if (!this.lastSize_ || opt_size != this.lastSize_) {
      goog.style.setSize(this.collapsedViewEl_, opt_size);
    }
  }
  this.draw();
  if (!this.tickerHidden_ && this.lastSize_ && opt_size != this.lastSize_) {
    if (this.scheduleStartTickerId_) {
      clearTimeout(this.scheduleStartTickerId_);
    }
    this.scheduleStartTickerId_ = setTimeout(goog.bind(this.startTicker, this), 150);
  }
  if (opt_size != undefined) {
    this.lastSize_ = opt_size;
  }
};
chatango.group.CollapsedViewComponent.prototype.resizeToFitContent = function() {
  this.dispatchEvent(new chatango.events.ResizeIframeEvent(chatango.managers.Style.getInstance().getCVSize()));
};
chatango.group.CollapsedViewComponent.prototype.show = function(show) {
  if (!this.collapsedViewEl_) {
    return;
  }
  show = !!(show || show == undefined);
  if (show === goog.style.isElementShown(this.collapsedViewEl_)) {
    return;
  }
  this.clearTicker();
  var tickerActive = chatango.managers.Style.getInstance().tickerEnabled() && !this.tickerHidden_;
  if (show) {
    goog.style.setStyle(this.collapsedViewEl_, "display", "block");
    if (this.inited_ && tickerActive) {
      this.draw();
      setTimeout(goog.bind(this.startTicker, this), 0);
    }
  } else {
    goog.style.setStyle(this.collapsedViewEl_, "display", "none");
    if (tickerActive) {
      this.stopTicker();
    }
  }
};
chatango.group.CollapsedViewComponent.prototype.createMessageQueueFromLastMessages_ = function(msgArray) {
  this.messageQueue_.length = 0;
  var msg = msgArray.shift();
  while (msg) {
    var msgText = msg.message.messageData_.getMessageText();
    if (msgText.replace(/\s/g, "") === "") {
      msg = msgArray.shift();
      continue;
    }
    var sid = msg.message.messageData_.getName();
    if (chatango.managers.Environment.getInstance().isMockGroup()) {
      sid = sid.replace(/^\_/, "");
    }
    switch(msg.position) {
      case "bottom":
        this.messageQueue_.unshift([sid, msgText]);
        break;
      case "top":
      ;
      default:
        this.messageQueue_.push([sid, msgText]);
    }
    msg = msgArray.shift();
  }
  if (this.messageQueue_.length > chatango.group.CollapsedViewComponent.MAX_TICKER_MSGS) {
    this.messageQueue_ = this.messageQueue_.slice(0, chatango.group.CollapsedViewComponent.MAX_TICKER_MSGS);
  }
  this.messagePointer_ = this.messageQueue_.length - 1;
};
chatango.group.CollapsedViewComponent.prototype.toggleTicker_ = function(e) {
  if (chatango.managers.Environment.getInstance().isMockGroup()) {
    return;
  }
  this.tickerToggleIcon_.flip();
  this.tickerHidden_ = !this.tickerHidden_;
  goog.net.cookies.set("cvhidden" + this.handle_, this.tickerHidden_.toString(), 31536E3, "/");
  this.draw();
  if (this.tickerHidden_) {
    this.stopTicker();
  } else {
    setTimeout(goog.bind(this.startTicker, this), 0);
  }
  e.stopPropagation();
  e.preventDefault();
};
chatango.group.CollapsedViewComponent.prototype.getScrollSpeed_ = function() {
  var speed = Math.round(chatango.group.CollapsedViewComponent.SCROLL_SPEED * this.element_.offsetWidth / 250);
  return speed;
};
chatango.group.CollapsedViewComponent.prototype.msgsDeleted_ = function(e) {
  var evt = new goog.events.Event(chatango.events.EventType.REFRESH_MESSAGES);
  evt.data = chatango.group.CollapsedViewComponent.MAX_TICKER_MSGS;
  this.dispatchEvent(evt);
};
goog.provide("chatango.modules.CollapsedViewModule");
goog.require("chatango.group.CollapsedViewComponent");
goog.require("goog.module.ModuleManager");
chatango.modules.CollapsedViewModule = function(connection, groupInfo, opt_alreadyInited, opt_InitialMessages) {
  this.connection_ = connection;
  this.groupInfo_ = groupInfo;
  this.alreadyInited_ = opt_alreadyInited == true;
  this.initialMessages_ = opt_InitialMessages;
};
chatango.modules.CollapsedViewModule.prototype.getCollapsedView = function() {
  if (!this.collapsed) {
    this.collapsed = new chatango.group.CollapsedViewComponent(this.connection_, this.groupInfo_, this.alreadyInited_, this.initialMessages_);
  }
  return this.collapsed;
};
chatango.modules.CollapsedViewModule.prototype.resizeCollapsedViewToFitContent = function() {
  if (this.collapsed) {
    this.collapsed.resizeToFitContent();
  }
};
chatango.modules.CollapsedViewModule.prototype.drawCollapsedView = function(opt_size) {
  if (this.collapsed) {
    this.collapsed.setSize(opt_size);
    if (this.connection_.isConnected()) {
      this.collapsed.show(true);
    }
  }
};
chatango.modules.CollapsedViewModule.prototype.getCvSize = function() {
  if (this.collapsed) {
    return this.collapsed.getCvSize();
  } else {
    return null;
  }
};
chatango.modules.CollapsedViewModule.prototype.clearCollapsedView = function() {
  this.collapsed.dispose();
  this.collapsed = null;
};
chatango.modules.CollapsedViewModule.prototype.updateCopy = function() {
  if (this.collapsed) {
    this.collapsed.updateCopy();
  }
};
chatango.modules.CollapsedViewModule.prototype.collapsedViewExists = function() {
  return this.collapsed != null;
};
if (goog.module.ModuleManager.getInstance().getModuleInfo("CollapsedViewModule")) {
  goog.module.ModuleManager.getInstance().setLoaded("CollapsedViewModule");
}
;
