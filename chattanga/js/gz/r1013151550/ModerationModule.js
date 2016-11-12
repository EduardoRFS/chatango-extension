goog.provide("chatango.ui.icons.BanIconRenderer");
goog.require("chatango.ui.icons.IIconRenderer");
chatango.ui.icons.BanIconRenderer = function() {
};
goog.addSingletonGetter(chatango.ui.icons.BanIconRenderer);
chatango.ui.icons.BanIconRenderer.prototype.draw = function(graphics, opt_color, opt_left, opt_top, opt_width, opt_height) {
  graphics.clear();
  var path = graphics.createPath();
  var size = opt_width || graphics.width;
  var strokeWidth = /firefox/i.test(navigator.userAgent) && opt_color != "#FFFFFF" ? .5 : 1;
  var stroke = new goog.graphics.Stroke(strokeWidth, opt_color || "#000000");
  var margin = opt_width ? 0 : Math.round(size * .25);
  var top = opt_top || 0;
  var left = opt_left || 0;
  path.moveTo(left + margin, top + margin);
  path.lineTo(left + size - margin, top + size - margin);
  var rad = Math.SQRT2 * (size - margin * 2) / 2;
  if (/chrome/i.test(navigator.userAgent)) {
    rad = Math.floor(rad);
  }
  var pathEl = graphics.drawPath(path, stroke, null);
  var circleEl = graphics.drawCircle(size / 2, size / 2, rad, stroke, null);
};
goog.provide("chatango.ui.buttons.BanButton");
goog.require("chatango.ui.buttons.IconButton");
goog.require("chatango.ui.icons.BanIconRenderer");
chatango.ui.buttons.BanButton = function(opt_color, opt_size) {
  chatango.ui.buttons.IconButton.call(this, chatango.ui.icons.BanIconRenderer.getInstance(), opt_color, opt_size, opt_size, "#FFFFFF");
  this.addClassName("ban-button");
  this.addClassName("transp");
};
goog.inherits(chatango.ui.buttons.BanButton, chatango.ui.buttons.IconButton);
chatango.ui.buttons.BanButton.prototype.setBanned = function() {
  this.unbannedIconColor_ = this.iconColor_;
  var c = chatango.utils.color.lightenHex(this.iconColor_, .75);
  this.setIconColor(c);
  this.setRollOverColor("#AAAAAA");
  this.enableClassName("ban-button", false);
  this.enableClassName("banned-button", true);
};
chatango.ui.buttons.BanButton.prototype.setUnbanned = function() {
  this.setIconColor(this.unbannedIconColor_);
  this.setRollOverColor("#FFFFFF");
  this.enableClassName("ban-button", true);
  this.enableClassName("banned-button", false);
};
goog.provide("chatango.ui.icons.EasyBanIconRenderer");
goog.require("chatango.ui.icons.IIconRenderer");
chatango.ui.icons.EasyBanIconRenderer = function() {
};
goog.addSingletonGetter(chatango.ui.icons.EasyBanIconRenderer);
chatango.ui.icons.EasyBanIconRenderer.prototype.draw = function(graphics, opt_color, opt_left, opt_top, opt_width, opt_height) {
  graphics.clear();
  var path = graphics.createPath();
  var size = opt_width || graphics.width;
  var strokeWidth = 2;
  var stroke = new goog.graphics.Stroke(strokeWidth, opt_color || "#FFFFFF");
  var margin = opt_width ? 0 : Math.round(size * .25);
  var top = opt_top || 0;
  var left = opt_left || 0;
  path.moveTo(left + margin, top + margin);
  path.lineTo(left + size - margin, top + size - margin);
  path.moveTo(left + size - margin, top + margin);
  path.lineTo(left + margin, top + size - margin);
  path.close();
  var rad = Math.SQRT2 * (size - margin * 2) / 2;
  if (/chrome/i.test(navigator.userAgent)) {
    rad = Math.floor(rad);
  }
  var pathEl = graphics.drawPath(path, stroke, null);
  var circleEl = graphics.drawCircle(size / 2, size / 2, rad, stroke, null);
};
goog.provide("chatango.ui.icons.DeleteIconRenderer");
goog.require("chatango.ui.icons.IIconRenderer");
chatango.ui.icons.DeleteIconRenderer = function() {
};
goog.addSingletonGetter(chatango.ui.icons.DeleteIconRenderer);
chatango.ui.icons.DeleteIconRenderer.prototype.draw = function(graphics, opt_color, opt_left, opt_top, opt_width, opt_height) {
  graphics.clear();
  var path = graphics.createPath();
  var size = opt_width || graphics.width;
  var strokeWidth = /firefox/i.test(navigator.userAgent) && opt_color != "#FFFFFF" ? .5 : 1;
  var stroke = new goog.graphics.Stroke(strokeWidth, opt_color || "#000000");
  var margin = opt_width ? 0 : Math.round(size * .25);
  var top = opt_top || 0;
  var left = opt_left || 0;
  path.moveTo(left + margin, top + margin);
  path.lineTo(left + size - margin, top + size - margin);
  path.moveTo(left + size - margin, top + margin);
  path.lineTo(left + margin, top + size - margin);
  var pathEl = graphics.drawPath(path, stroke, null);
};
goog.provide("chatango.ui.buttons.DeleteButton");
goog.require("chatango.ui.buttons.IconButton");
goog.require("chatango.ui.icons.DeleteIconRenderer");
chatango.ui.buttons.DeleteButton = function(opt_color, opt_size) {
  chatango.ui.buttons.IconButton.call(this, chatango.ui.icons.DeleteIconRenderer.getInstance(), opt_color, opt_size, opt_size, "#FFFFFF");
  this.addClassName("delete-button");
  this.addClassName("transp");
};
goog.inherits(chatango.ui.buttons.DeleteButton, chatango.ui.buttons.IconButton);
goog.require("goog.events.Event");
goog.provide("chatango.events.ModDeleteMessageEvent");
chatango.events.ModDeleteMessageEvent = function(message) {
  goog.events.Event.call(this, chatango.events.EventType.MOD_DELETE_MESSAGE, message);
};
goog.inherits(chatango.events.ModDeleteMessageEvent, goog.events.Event);
goog.provide("chatango.group.moderation.GroupModMessage");
goog.require("chatango.config.Config");
goog.require("chatango.events.ModDeleteMessageEvent");
goog.require("chatango.group.MessageModifiedEvent");
goog.require("chatango.managers.DateManager");
goog.require("chatango.managers.DateManagerEvent");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.managers.Style");
goog.require("chatango.ui.Thumbnail");
goog.require("chatango.ui.Youtube");
goog.require("chatango.ui.buttons.BanButton");
goog.require("chatango.ui.buttons.DeleteButton");
goog.require("chatango.ui.icons.EasyBanIconRenderer");
goog.require("chatango.ui.icons.Icon");
goog.require("chatango.ui.Swipe");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.Paths");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.ui.Component");
chatango.group.moderation.GroupModMessage.REFERRER_ID = null;
chatango.group.moderation.GroupModMessage = function(message, managers, opt_showDate, opt_domHelper) {
  chatango.group.GroupMessage.call(this, message, managers, opt_showDate, opt_domHelper);
  if (chatango.users.ModeratorManager.getInstance().isCurrentUserAModerator()) {
    this.user_.setEncodedCookie(this.messageData_.getEncodedCookie());
    this.user_.setIP(this.messageData_.getIP());
  }
};
goog.inherits(chatango.group.moderation.GroupModMessage, chatango.group.GroupMessage);
chatango.group.moderation.GroupModMessage.prototype.logger = goog.debug.Logger.getLogger("chatango.group.moderation.GroupModMessage");
chatango.group.moderation.GroupModMessage.prototype.createDom = function() {
  chatango.group.moderation.GroupModMessage.superClass_.createDom.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.easybanDiv_ = null;
  var authorIsMod = this.user_.isModerator();
  var authorIsAdmin = this.user_.isAdmin();
  var authorIsOwner = this.user_.isOwner();
  var currUser = chatango.users.UserManager.getInstance().currentUser;
  var userIsMod = currUser.isModerator();
  var userIsAdmin = currUser.isAdmin();
  var userIsOwner = currUser.isOwner();
  var canDelete = userIsOwner ? true : userIsAdmin && !(authorIsOwner || authorIsAdmin) ? true : userIsMod && !(authorIsOwner || authorIsAdmin || authorIsMod) ? true : false;
  if (chatango.users.ModeratorManager.getInstance().isCurrentUserAModerator()) {
    var modEl = goog.dom.createDom("div", {"class":"msg-mod-div"});
    this.ipEl_ = goog.dom.createDom("div", {"class":"msg-ip"});
    goog.dom.append(modEl, this.ipEl_);
    var icon_color = chatango.managers.Style.getInstance().getMsgDateTextColor();
    var isDesktop = chatango.managers.Environment.getInstance().isDesktop();
    if (isDesktop) {
      if (!authorIsMod) {
        this.banBtn_ = new chatango.ui.buttons.BanButton(icon_color);
        this.banBtn_.render(modEl);
        this.banBtn_.setTooltip(this.lm_.getString("moderation_module", "mod_ban_user"));
        goog.events.listen(this.banBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
      }
      if (canDelete) {
        this.deleteBtn_ = new chatango.ui.buttons.DeleteButton(icon_color);
        this.deleteBtn_.render(modEl);
        if (this.messageData_.isInitial() || this.deleteBtnEnabled_) {
          this.enableDeleteBtn_();
        } else {
          goog.style.setStyle(this.deleteBtn_.getElement(), "visibility", "hidden");
        }
      }
      if (!authorIsMod) {
        this.easybanDiv_ = goog.dom.createDom("div", {"class":"msg-easyban"});
        this.easybanBgEl_ = goog.dom.createDom("div", {"class":"msg-easyban-bg"});
        goog.dom.append(this.easybanDiv_, this.easybanBgEl_);
        goog.events.listen(this.easybanBgEl_, goog.events.EventType.CLICK, this.onEasyBanClick, false, this);
        this.easybanModEl_ = goog.dom.createDom("div", {"class":"msg-mod-div msg-mod-div-easyban"});
        goog.dom.append(this.easybanDiv_, this.easybanModEl_);
        this.easybanIpEl_ = goog.dom.createDom("div", {"class":"msg-ip-easyban"});
        goog.dom.append(this.easybanModEl_, this.easybanIpEl_);
        goog.events.listen(this.easybanIpEl_, goog.events.EventType.CLICK, this.onEasyBanClick, false, this);
        this.easybanBanBtn_ = new chatango.ui.buttons.BanButton("#FFFFFF");
        this.easybanBanBtn_.render(this.easybanModEl_);
        this.easybanBanBtn_.setTooltip(this.lm_.getString("moderation_module", "mod_ban_user"));
        goog.events.listen(this.easybanBanBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
        this.easybanDeleteBtn_ = new chatango.ui.buttons.DeleteButton("#FFFFFF");
        this.easybanDeleteBtn_.render(this.easybanModEl_);
        if (!this.messageData_.isInitial()) {
          goog.style.setStyle(this.easybanDeleteBtn_.getElement(), "visibility", "hidden");
        } else {
          this.enableDeleteBtn_();
        }
        this.easybanIconTextWrapper_ = goog.dom.createDom("div", {"class":"msg-easyban-wrap"});
        goog.dom.append(this.easybanDiv_, this.easybanIconTextWrapper_);
        goog.events.listen(this.easybanIconTextWrapper_, goog.events.EventType.CLICK, this.onEasyBanClick, false, this);
        this.easybanIconEl_ = goog.dom.createDom("div", {"class":"msg-easyban-icon"});
        var sz = Math.round(chatango.managers.Style.getInstance().getIconSize() * 1.5);
        var easybanIcon = new chatango.ui.icons.Icon(chatango.ui.icons.EasyBanIconRenderer.getInstance(), "#FFFFFF", sz, sz);
        easybanIcon.render(this.easybanIconEl_);
        goog.dom.append(this.easybanIconTextWrapper_, this.easybanIconEl_);
        this.easybanTextEl_ = goog.dom.createDom("div", {"class":"msg-easyban-text"});
        goog.dom.append(this.easybanIconTextWrapper_, this.easybanTextEl_);
      }
    } else {
      this.touchModDiv_ = goog.dom.createDom("div", {"class":"msg-touchmod"});
      this.touchModBgEl_ = goog.dom.createDom("div", {"class":"msg-touchmod-bg"});
      goog.dom.append(this.touchModDiv_, this.touchModBgEl_);
      this.touchModIPWrapperEl_ = goog.dom.createDom("div", {"class":"msg-mod-div msg-mod-div-easyban"});
      goog.dom.append(this.touchModDiv_, this.touchModIPWrapperEl_);
      this.easybanIpEl_ = goog.dom.createDom("div", {"class":"msg-ip-easyban"});
      goog.dom.append(this.touchModIPWrapperEl_, this.easybanIpEl_);
      this.touchModStandardCtrls_ = goog.dom.createDom("div", {"class":"msg-touch-stnd-ctrls"});
      if (!authorIsMod) {
        this.touchModBanBtn_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("moderation_module", "mod_ban_user"));
        this.touchModBanBtn_.setFillColor("#FF0000");
        this.touchModBanBtn_.setTextColor("#FFFFFF");
        this.touchModBanBtnWrapperEl_ = goog.dom.createDom("div", {"class":"btn-wrap"});
        this.touchModBanBtn_.render(this.touchModBanBtnWrapperEl_);
        goog.dom.append(this.touchModStandardCtrls_, this.touchModBanBtnWrapperEl_);
        goog.dom.append(this.touchModDiv_, this.touchModStandardCtrls_);
        goog.events.listen(this.touchModBanBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchModBanUser_, true, this);
      }
      if (canDelete) {
        this.touchModDeleteBtn_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("moderation_module", "mod_delete_msg"));
        this.touchModDeleteBtn_.setFillColor("#FF0000");
        this.touchModDeleteBtn_.setTextColor("#FFFFFF");
        this.touchModDeleteBtnWrapperEl_ = goog.dom.createDom("div", {"class":"btn-wrap", "style":"padding-left:0.5em"});
        this.touchModDeleteBtn_.render(this.touchModDeleteBtnWrapperEl_);
        goog.dom.append(this.touchModStandardCtrls_, this.touchModDeleteBtnWrapperEl_);
        goog.dom.append(this.touchModDiv_, this.touchModStandardCtrls_);
      } else {
        this.cannotBanModEl_ = goog.dom.createDom("div", {"class":"msg-touch-cant-ban-mod", "style":"color:#FFF"}, this.lm_.getString("moderation_module", "cannot_ban"));
        goog.dom.append(this.touchModDiv_, this.cannotBanModEl_);
      }
      if (this.deleteBtnEnabled_ || this.messageData_.isInitial()) {
        this.enableDeleteBtn_();
      } else {
        if (this.touchModDeleteBtn_) {
          goog.style.setStyle(this.touchModDeleteBtn_.getElement(), "visibility", "hidden");
        }
      }
      goog.style.showElement(this.touchModStandardCtrls_, false);
      if (!authorIsMod) {
        this.touchModEasybanCtrls_ = goog.dom.createDom("div", {"class":"msg-touch-easyban-ctrls"});
        this.touchModEasybanBtn_ = new chatango.ui.buttons.ChatangoButton(this.lm_.getString("moderation_module", "easyban_str"));
        this.touchModEasybanBtn_.setFillColor("#FF0000");
        this.touchModEasybanBtn_.setTextColor("#FFFFFF");
        this.touchModEasybanBtnWrapperEl_ = goog.dom.createDom("div", {"class":"btn-wrap"});
        this.touchModEasybanBtn_.render(this.touchModEasybanBtnWrapperEl_);
        goog.dom.append(this.touchModEasybanCtrls_, this.touchModEasybanBtnWrapperEl_);
        goog.dom.append(this.touchModDiv_, this.touchModEasybanCtrls_);
        goog.events.listen(this.touchModEasybanBtn_.getElement(), goog.events.EventType.TOUCHSTART, this.onTouchStartModEasybanUser_, true, this);
        goog.style.showElement(this.touchModEasybanCtrls_, false);
      } else {
        this.cannotEasyBanModEl_ = goog.dom.createDom("div", {"class":"msg-touch-cant-ban-mod", "style":"color:#FFF"}, this.lm_.getString("moderation_module", "cannot_ban"));
        goog.dom.append(this.touchModDiv_, this.cannotEasyBanModEl_);
      }
    }
    goog.dom.insertSiblingBefore(modEl, this.date_);
  }
  if (this.easybanDiv_) {
    goog.events.listen(this.fg_, goog.events.EventType.MOUSEOVER, this.onEasyBanMouseOver, false, this);
    goog.dom.append(this.container_, this.easybanDiv_);
    goog.style.showElement(this.easybanDiv_, false);
  }
  if (this.touchModDiv_) {
    goog.dom.append(this.container_, this.touchModDiv_);
    this.swipe_ = new chatango.ui.Swipe(this.fg_, this.touchModDiv_);
    goog.events.listen(this.swipe_, chatango.ui.Swipe.EventType.TOUCH_START, this.onSwipeTouchDown_, false, this);
    goog.events.listen(this.swipe_, chatango.ui.Swipe.EventType.ANIM_OUT, this.onSwipeAnimOut_, false, this);
    goog.events.listen(this.swipe_, chatango.ui.Swipe.EventType.DOC_TOUCH_END, this.onSwipeDocTouchEnd_, false, this);
  }
  this.updateIPVisibility();
};
chatango.group.moderation.GroupModMessage.prototype.enableDeleteBtn_ = function() {
  this.deleteBtnEnabled_ = true;
  if (this.deleteBtn_) {
    this.deleteBtn_.setTooltip(this.lm_.getString("moderation_module", "mod_delete_msg"));
    goog.events.listen(this.deleteBtn_.getElement(), goog.events.EventType.CLICK, this.onModDeleteMessage, false, this);
    goog.style.setStyle(this.deleteBtn_.getElement(), "visibility", "visible");
    if (!this.easybanDeleteBtn_) {
      return 1;
    }
    this.easybanDeleteBtn_.setTooltip(this.lm_.getString("moderation_module", "mod_delete_msg"));
    goog.events.listen(this.easybanDeleteBtn_.getElement(), goog.events.EventType.CLICK, this.onModDeleteMessage, false, this);
    goog.style.setStyle(this.easybanDeleteBtn_.getElement(), "visibility", "visible");
  }
  if (this.touchModDeleteBtn_) {
    goog.style.setStyle(this.touchModDeleteBtn_.getElement(), "visibility", "visible");
    goog.events.listen(this.touchModDeleteBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchModDeleteMsg_, true, this);
  }
  return 1;
};
chatango.group.moderation.GroupModMessage.prototype.userBanned = function() {
  this.isBanned_ = true;
  if (this.touchModBanBtn_) {
    this.touchModBanBtn_.setEnabled(false);
    this.touchModBanBtn_.setCaption(this.lm_.getString("moderation_module", "user_banned"));
    if (this.touchModBanBtn_) {
      goog.events.unlisten(this.touchModBanBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchModBanUser_, true, this);
    }
  }
  if (this.banBtn_) {
    this.banBtn_.setTooltip(this.lm_.getString("moderation_module", "user_banned"));
    this.banBtn_.setBanned();
    goog.events.unlisten(this.banBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
  }
  if (this.easybanBanBtn_) {
    this.easybanBanBtn_.setTooltip(this.lm_.getString("moderation_module", "user_banned"));
    this.easybanBanBtn_.setBanned();
    this.easybanBanBtn_.setIconColor("#666666");
    this.easybanBanBtn_.setRollOverColor("#AAAAAA");
    goog.events.unlisten(this.easybanBanBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
  }
};
chatango.group.moderation.GroupModMessage.prototype.userUnbanned = function() {
  this.isBanned_ = false;
  if (this.touchModBanBtn_) {
    this.touchModBanBtn_.setEnabled(true);
    this.touchModBanBtn_.setCaption(this.lm_.getString("moderation_module", "mod_ban_user"));
    goog.events.listen(this.touchModBanBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchModBanUser_, true, this);
  }
  if (this.banBtn_) {
    this.banBtn_.setTooltip(this.lm_.getString("moderation_module", "mod_ban_user"));
    this.banBtn_.setUnbanned();
    goog.events.listen(this.banBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
  }
  if (this.easybanBanBtn_) {
    this.easybanBanBtn_.setTooltip(this.lm_.getString("moderation_module", "mod_ban_user"));
    this.easybanBanBtn_.setUnbanned();
    this.easybanBanBtn_.setIconColor("#FFFFFF");
    this.easybanBanBtn_.setRollOverColor("#FFFFFF");
    goog.events.listen(this.easybanBanBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
  }
};
chatango.group.moderation.GroupModMessage.prototype.onModDeleteMessage = function(e) {
  this.dispatchEvent(new chatango.events.ModDeleteMessageEvent(this));
};
chatango.group.moderation.GroupModMessage.prototype.onModBanUser = function(e) {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_BAN_USER, this));
};
chatango.group.moderation.GroupModMessage.prototype.onEasyBanClick = function(e) {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_EASYBAN, this));
};
chatango.group.moderation.GroupModMessage.prototype.isEasyBanDivShowing = function() {
  return goog.style.isElementShown(this.easybanDiv_);
};
chatango.group.moderation.GroupModMessage.prototype.onEasyBanMouseOver = function(e) {
  var mm = chatango.group.moderation.ModerationManager.getInstance();
  if (mm.getEasyBanIsOn()) {
    goog.events.listen(goog.dom.getDocument(), goog.events.EventType.MOUSEMOVE, this.onEasyBanMouseMove, false, this);
    goog.dom.setTextContent(this.easybanTextEl_, this.lm_.getString("moderation_module", "easyban_str"));
    goog.style.showElement(this.easybanDiv_, true);
    var h = goog.style.getSize(this.easybanModEl_).height;
    goog.style.setStyle(this.easybanIconTextWrapper_, "top", Math.round(h * 1.5) + "px");
    this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_EASYBAN_ROLLOVER, this));
  }
};
chatango.group.moderation.GroupModMessage.prototype.onEasyBanMouseMove = function(e) {
  var mY = e.clientY;
  var divTop = goog.style.getPageOffset(this.easybanDiv_).y;
  var divBottom = divTop + goog.style.getSize(this.easybanDiv_).height;
  if (mY < divTop || mY > divBottom) {
    this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_EASYBAN_ROLLOUT, this));
    goog.style.showElement(this.easybanDiv_, false);
    goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.MOUSEMOVE, this.onEasyBanMouseMove, false, this);
  }
};
chatango.group.moderation.GroupModMessage.prototype.onSwipeTouchDown_ = function(e) {
  var mm = chatango.group.moderation.ModerationManager.getInstance();
  if (mm.getEasyBanIsOn()) {
    if (this.touchModEasybanCtrls_) {
      goog.style.showElement(this.touchModEasybanCtrls_, true);
    }
    if (this.touchModStandardCtrls_) {
      goog.style.showElement(this.touchModStandardCtrls_, false);
    }
    if (this.touchModEasybanBtn_) {
      this.touchModEasybanBtn_.setContent(this.lm_.getString("moderation_module", "easyban_str"));
    }
    if (this.cannotEasyBanModEl_) {
      goog.style.showElement(this.cannotEasyBanModEl_, true);
    }
    if (this.cannotBanModEl_) {
      goog.style.showElement(this.cannotBanModEl_, false);
    }
  } else {
    if (this.touchModEasybanCtrls_) {
      goog.style.showElement(this.touchModEasybanCtrls_, false);
    }
    if (this.touchModStandardCtrls_) {
      goog.style.showElement(this.touchModStandardCtrls_, true);
    }
    if (this.cannotEasyBanModEl_) {
      goog.style.showElement(this.cannotEasyBanModEl_, false);
    }
    if (this.cannotBanModEl_) {
      goog.style.showElement(this.cannotBanModEl_, true);
    }
    if (this.touchModBanBtn_) {
      if (this.isBanned_) {
        this.touchModBanBtn_.setContent(this.lm_.getString("moderation_module", "user_banned"));
      } else {
        this.touchModBanBtn_.setContent(this.lm_.getString("moderation_module", "mod_ban_user"));
      }
    }
    if (this.touchModDeleteBtn_) {
      this.touchModDeleteBtn_.setContent(this.lm_.getString("moderation_module", "mod_delete_msg"));
    }
  }
  this.dispatchEvent(e);
};
chatango.group.moderation.GroupModMessage.prototype.onSwipeAnimOut_ = function(e) {
  this.dispatchEvent(e);
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_EASYBAN_ROLLOUT, this));
};
chatango.group.moderation.GroupModMessage.prototype.onSwipeDocTouchEnd_ = function(e) {
  this.dispatchEvent(e);
};
chatango.group.moderation.GroupModMessage.prototype.onTouchStartWhenModDivIsShowing_ = function(e) {
  var mY = e.clientY;
  var divTop = goog.style.getPageOffset(this.fg_).y;
  var fgSize = goog.style.getSize(this.fg_);
  var divBottom = divTop + fgSize.height;
  if (mY < divTop || mY > divBottom) {
    this.animOutModTouchDiv_();
  }
};
chatango.group.moderation.GroupModMessage.prototype.onTouchModBanUser_ = function(e) {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_BAN_USER, this));
};
chatango.group.moderation.GroupModMessage.prototype.onTouchModDeleteMsg_ = function(e) {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_CONFIRM_DELETE_MESSAGE, this));
};
chatango.group.moderation.GroupModMessage.prototype.onTouchStartModEasybanUser_ = function(e) {
  this.easybanTouchStartX_ = e.clientX;
  goog.events.listen(this.touchModEasybanBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchEndModEasybanUser_, true, this);
};
chatango.group.moderation.GroupModMessage.prototype.onTouchEndModEasybanUser_ = function(e) {
  goog.events.unlisten(this.touchModEasybanBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchEndModEasybanUser_, true, this);
  if (Math.abs(this.easybanTouchStartX_ - e.clientX) < 15) {
    this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_EASYBAN, this));
  } else {
  }
};
chatango.group.moderation.GroupModMessage.prototype.updateIPVisibility = function() {
  var canSeeIp = chatango.users.ModeratorManager.getInstance().hasPermission(chatango.users.UserManager.getInstance().currentUser.getSid(), chatango.group.moderation.Permissions.Flags.SEE_IPS);
  var ip = canSeeIp ? this.messageData_.getIP() : "";
  if (this.ipEl_) {
    this.ipEl_.innerHTML = ip;
  }
  if (this.easybanIpEl_) {
    this.easybanIpEl_.innerHTML = ip;
  }
};
chatango.group.moderation.GroupModMessage.prototype.disposeInternal = function() {
  goog.events.unlisten(goog.dom.getDocument(), goog.events.EventType.MOUSEMOVE, this.onEasyBanMouseMove, false, this);
  if (this.swipe_) {
    goog.events.unlisten(this.swipe_, chatango.ui.Swipe.EventType.TOUCH_START, this.onSwipeTouchDown_, false, this);
    goog.events.unlisten(this.swipe_, chatango.ui.Swipe.EventType.ANIM_OUT, this.onSwipeAnimOut_, false, this);
    goog.events.unlisten(this.swipe_, chatango.ui.Swipe.EventType.DOC_TOUCH_END, this.onSwipeDocTouchEnd_, false, this);
    this.swipe_.dispose();
    this.swipe_ = null;
  }
  if (this.easybanIconTextWrapper_) {
    goog.events.unlisten(this.easybanIconTextWrapper_, goog.events.EventType.CLICK, this.onEasyBanClick, false, this);
  }
  if (this.easybanIpEl_) {
    goog.events.unlisten(this.easybanIpEl_, goog.events.EventType.CLICK, this.onEasyBanClick, false, this);
  }
  if (this.banBtn_) {
    goog.events.unlisten(this.banBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
  }
  if (this.easybanBgEl_) {
    goog.events.unlisten(this.easybanBgEl_, goog.events.EventType.CLICK, this.onEasyBanClick, false, this);
  }
  if (this.fg_) {
    goog.events.unlisten(this.fg_, goog.events.EventType.MOUSEOVER, this.onEasyBanMouseOver, false, this);
  }
  if (this.deleteBtn_) {
    goog.events.unlisten(this.deleteBtn_.getElement(), goog.events.EventType.CLICK, this.onModDeleteMessage, false, this);
  }
  if (this.easybanDeleteBtn_) {
    goog.events.unlisten(this.easybanDeleteBtn_.getElement(), goog.events.EventType.CLICK, this.onModDeleteMessage, false, this);
  }
  if (this.easybanBanBtn_) {
    goog.events.unlisten(this.easybanBanBtn_.getElement(), goog.events.EventType.CLICK, this.onModBanUser, true, this);
  }
  if (this.touchModBanBtn_) {
    goog.events.unlisten(this.touchModBanBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchModBanUser_, true, this);
  }
  if (this.touchModDeleteBtn_) {
    goog.events.unlisten(this.touchModDeleteBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchModDeleteMsg_, true, this);
  }
  if (this.touchModEasybanBtn_) {
    goog.events.unlisten(this.touchModEasybanBtn_.getElement(), goog.events.EventType.TOUCHSTART, this.onTouchStartModEasybanUser_, true, this);
  }
  if (this.touchModEasybanBtn_) {
    goog.events.unlisten(this.touchModEasybanBtn_.getElement(), goog.events.EventType.TOUCHEND, this.onTouchEndModEasybanUser_, true, this);
  }
  if (this.easybanDiv_) {
    goog.style.showElement(this.easybanDiv_, false);
  }
  chatango.group.moderation.GroupModMessage.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.moderation.deleteAllMessagesByUserDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.users.User");
goog.require("chatango.utils.style");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
chatango.group.moderation.deleteAllMessagesByUserDialog = function(user) {
  this.user_ = user;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("moderation_module", "msg_del"));
  this.handler = this.getHandler();
};
goog.inherits(chatango.group.moderation.deleteAllMessagesByUserDialog, chatango.ui.ScrollableDialog);
chatango.group.moderation.deleteAllMessagesByUserDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.confirmationTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.confirmationTextEl);
  this.noBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.noBtn_, goog.ui.Component.EventType.ACTION, this.onNoButtonClicked);
  this.noBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.noBtn_.render(this.noBtnWrapperEl_);
  dom.appendChild(content, this.noBtnWrapperEl_);
  this.deleteBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.deleteBtn_, goog.ui.Component.EventType.ACTION, this.onDeleteButtonClicked);
  this.deleteBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.deleteBtn_.render(this.deleteBtnWrapperEl_);
  dom.appendChild(content, this.deleteBtnWrapperEl_);
};
chatango.group.moderation.deleteAllMessagesByUserDialog.prototype.enterDocument = function() {
  chatango.group.moderation.deleteAllMessagesByUserDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.moderation.deleteAllMessagesByUserDialog.prototype.onDeleteButtonClicked = function() {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_DELETE_ALL_MESSAGES_BY_USER, this.user_));
};
chatango.group.moderation.deleteAllMessagesByUserDialog.prototype.onNoButtonClicked = function() {
  this.setVisible(false);
};
chatango.group.moderation.deleteAllMessagesByUserDialog.prototype.updateCopy = function() {
  this.deleteBtn_.setContent(this.lm_.getString("moderation_module", "yes_delete_all"));
  this.noBtn_.setContent(goog.dom.htmlToDocumentFragment("&nbsp;" + this.lm_.getString("ui", "no") + "&nbsp;"));
  var username;
  if (this.user_.isAnon()) {
    username = this.lm_.getString("moderation_module", "this_person");
  } else {
    username = this.user_.getName();
  }
  var copy = this.lm_.getString("moderation_module", "del_all_conf").split("*user*").join(username);
  this.confirmationTextEl.innerHTML = copy;
};
goog.provide("chatango.group.moderation.confirmDeleteAllMessagesByUserDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.users.User");
goog.require("chatango.utils.style");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
chatango.group.moderation.confirmDeleteAllMessagesByUserDialog = function(user) {
  this.user_ = user;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("moderation_module", "are_you_sure"));
  this.handler = this.getHandler();
};
goog.inherits(chatango.group.moderation.confirmDeleteAllMessagesByUserDialog, chatango.ui.ScrollableDialog);
chatango.group.moderation.confirmDeleteAllMessagesByUserDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.confirmationTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.confirmationTextEl);
  this.noBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.noBtn_, goog.ui.Component.EventType.ACTION, this.onNoButtonClicked);
  this.noBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.noBtn_.render(this.noBtnWrapperEl_);
  dom.appendChild(content, this.noBtnWrapperEl_);
  this.yesBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.yesBtn_, goog.ui.Component.EventType.ACTION, this.onYesButtonClicked);
  this.yesBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.yesBtn_.render(this.yesBtnWrapperEl_);
  dom.appendChild(content, this.yesBtnWrapperEl_);
};
chatango.group.moderation.confirmDeleteAllMessagesByUserDialog.prototype.enterDocument = function() {
  chatango.group.moderation.confirmDeleteAllMessagesByUserDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.moderation.confirmDeleteAllMessagesByUserDialog.prototype.onYesButtonClicked = function() {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_CONFIRM_DELETE_ALL_MESSAGES_BY_USER, this.user_));
};
chatango.group.moderation.confirmDeleteAllMessagesByUserDialog.prototype.onNoButtonClicked = function() {
  this.setVisible(false);
};
chatango.group.moderation.confirmDeleteAllMessagesByUserDialog.prototype.updateCopy = function() {
  this.yesBtn_.setContent(this.lm_.getString("ui", "yes"));
  this.noBtn_.setContent(goog.dom.htmlToDocumentFragment("&nbsp;" + this.lm_.getString("ui", "no") + "&nbsp;"));
  var username;
  if (this.user_.isAnon()) {
    username = this.lm_.getString("moderation_module", "this_person");
  } else {
    username = this.user_.getName();
  }
  var copy = this.lm_.getString("moderation_module", "del_all_msgs").split("*user*").join(username);
  copy = copy.split("*b*").join("<b>").split("*/b*").join("</b>");
  this.confirmationTextEl.innerHTML = copy;
};
goog.provide("chatango.group.moderation.EventType");
chatango.group.moderation.EventType = {UNBAN_USERS:"unbanusers", MANAGE_MODS:"managemods", VIEW_MOD_ACTIONS:"modactions", AUTO_MOD:"automod", SHOW_MOD_ICON:"showicon", HIDE_MOD_ICON:"hideicon", CHOOSE_MOD_ICON:"chooseicon"};
goog.provide("chatango.group.moderation.ModerationMenu");
goog.require("chatango.group.moderation.EventType");
goog.require("chatango.group.moderation.ModerationManager");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.users.UserManager");
goog.require("goog.ui.Component.EventType");
goog.require("goog.ui.MenuItem");
chatango.group.moderation.ModerationMenu = function(opt_domHelper, opt_renderer) {
  goog.base(this, opt_domHelper, opt_renderer);
  this.setToggleMode(true);
  this.unbanUsersItem_ = new goog.ui.MenuItem(" ");
  this.easyBanItem_ = new goog.ui.MenuItem(" ");
  this.modIconItem_ = new goog.ui.MenuItem(" ");
  this.modActionsItem_ = new goog.ui.MenuItem(" ");
  this.addRemoveModItem_ = new goog.ui.MenuItem(" ");
  this.autoModItem_ = new goog.ui.MenuItem(" ");
  this.addChild(this.unbanUsersItem_, true);
  this.addChild(this.easyBanItem_, true);
  this.addChild(this.modActionsItem_, true);
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.initCopy();
  goog.events.listen(this.mm_, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, this.update, false, this);
  goog.events.listen(this.mm_, chatango.users.ModeratorManager.EventType.MOD_VISIBILITY_CHANGE, this.update, false, this);
};
goog.inherits(chatango.group.moderation.ModerationMenu, chatango.ui.PopupMenu);
chatango.group.moderation.ModerationMenu.EVENTS = [chatango.group.moderation.EventType.UNBAN_USERS, chatango.group.moderation.EventType.MANAGE_MODS, chatango.group.moderation.EventType.VIEW_MOD_ACTIONS, chatango.group.moderation.EventType.AUTO_MOD, chatango.group.moderation.EventType.SHOW_MOD_ICON, chatango.group.moderation.EventType.HIDE_MOD_ICON, chatango.group.moderation.EventType.CHOOSE_MOD_ICON];
chatango.group.moderation.ModerationMenu.prototype.logger = goog.debug.Logger.getLogger("chatango.group.moderation.ModerationMenu");
chatango.group.moderation.ModerationMenu.prototype.initCopy = function() {
  var viewSize = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor().getSize();
  var isNarrow = viewSize.width <= chatango.managers.ScaleManager.MIN_FULL_FEATURE_WIDTH;
  var narrow = isNarrow ? "_short" : "";
  this.unbanUsersItem_.setCaption(this.lm_.getString("moderation_module", "unban_users" + narrow));
  this.unbanUsersItem_.getElement().title = this.lm_.getString("moderation_module", "unban_users_tt").replace(/\*br\*/g, "\n");
  var easyBanManager = chatango.group.moderation.ModerationManager.getInstance();
  this.easyBanItem_.setCaption(easyBanManager.getEasyBanIsOn() ? this.lm_.getString("moderation_module", "turn_easyban_off" + narrow) : this.lm_.getString("moderation_module", "turn_easyban_on" + narrow));
  this.modActionsItem_.setCaption(this.lm_.getString("moderation_module", "view_mod_actions" + narrow));
  this.addRemoveModItem_.setCaption(this.lm_.getString("moderation_module", "manage_mods" + narrow));
  this.autoModItem_.setCaption(this.lm_.getString("moderation_module", "auto_mod" + narrow));
};
chatango.group.moderation.ModerationMenu.prototype.onAction_ = function(e) {
  this.hide();
  if (e.target === this.unbanUsersItem_) {
    this.dispatchEvent(chatango.group.moderation.EventType.UNBAN_USERS);
  } else {
    if (e.target === this.easyBanItem_) {
      var mm = chatango.group.moderation.ModerationManager.getInstance();
      mm.setEasyBanIsOn(!mm.getEasyBanIsOn());
      this.initCopy();
    } else {
      if (e.target === this.modActionsItem_) {
        this.dispatchEvent(chatango.group.moderation.EventType.VIEW_MOD_ACTIONS);
      } else {
        if (e.target === this.addRemoveModItem_) {
          this.dispatchEvent(chatango.group.moderation.EventType.MANAGE_MODS);
        } else {
          if (e.target === this.autoModItem_) {
            this.dispatchEvent(chatango.group.moderation.EventType.AUTO_MOD);
          } else {
            if (e.target == this.modIconItem_) {
              var currentUser = chatango.users.UserManager.getInstance().currentUser;
              if (this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.IS_STAFF)) {
                this.dispatchEvent(chatango.group.moderation.EventType.CHOOSE_MOD_ICON);
              } else {
                if (this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.MOD_ICON_VISIBLE)) {
                  this.dispatchEvent(chatango.group.moderation.EventType.HIDE_MOD_ICON);
                } else {
                  this.dispatchEvent(chatango.group.moderation.EventType.SHOW_MOD_ICON);
                }
              }
            }
          }
        }
      }
    }
  }
};
chatango.group.moderation.ModerationMenu.prototype.update = function(e) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var canEditMods = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_MODS);
  var canViewLog = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.SEE_MOD_ACTIONS);
  var canSetNLP = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_NLP);
  var modVisibility = this.mm_.getModVisibility();
  var canChooseIcon = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.IS_STAFF);
  var iconDisplayed = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.MOD_ICON_VISIBLE) || this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.STAFF_ICON_VISIBLE);
  if (canEditMods) {
    if (!this.getChild(this.addRemoveModItem_.getId())) {
      this.addChild(this.addRemoveModItem_, true);
    }
  } else {
    if (this.getChild(this.addRemoveModItem_.getId())) {
      this.removeChild(this.addRemoveModItem_, true);
    }
  }
  if (canViewLog) {
    if (!this.getChild(this.modActionsItem_.getId())) {
      this.addChild(this.modActionsItem_, true);
    }
  } else {
    if (this.getChild(this.modActionsItem_.getId())) {
      this.removeChild(this.modActionsItem_, true);
    }
  }
  if (canSetNLP) {
    if (!this.getChild(this.autoModItem_.getId())) {
      this.addChild(this.autoModItem_, true);
    }
  } else {
    if (this.getChild(this.autoModItem_.getId())) {
      this.removeChild(this.autoModItem_, true);
    }
  }
  if (modVisibility == chatango.group.moderation.Permissions.ModVisibilityOptions.HIDE_MOD_ICONS) {
    if (this.getChild(this.modIconItem_.getId())) {
      this.removeChild(this.modIconItem_, true);
    }
  } else {
    if (modVisibility == chatango.group.moderation.Permissions.ModVisibilityOptions.SHOW_MOD_ICONS) {
      if (this.getChild(this.modIconItem_.getId()) && !canChooseIcon) {
        this.removeChild(this.modIconItem_, true);
      } else {
        if (canChooseIcon) {
          if (!this.getChild(this.modIconItem_.getId())) {
            this.addChildAt(this.modIconItem_, 2, true);
          }
          this.modIconItem_.setCaption(this.lm_.getString("moderation_module", "choose_mod_icon"));
        }
      }
    } else {
      if (modVisibility == chatango.group.moderation.Permissions.ModVisibilityOptions.MODS_CHOOSE_VISIBILITY) {
        if (!this.getChild(this.modIconItem_.getId())) {
          this.addChildAt(this.modIconItem_, 2, true);
        }
        var iconString;
        if (canChooseIcon) {
          iconString = this.lm_.getString("moderation_module", "choose_mod_icon");
        } else {
          if (iconDisplayed) {
            iconString = this.lm_.getString("moderation_module", "hide_mod_icon");
          } else {
            iconString = this.lm_.getString("moderation_module", "show_mod_icon");
          }
        }
        this.modIconItem_.setCaption(iconString);
      }
    }
  }
};
chatango.group.moderation.ModerationMenu.prototype.disposeInternal = function() {
  goog.events.unlisten(this.mm_, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, this.update, false, this);
  chatango.group.moderation.ModerationMenu.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.group.moderation.banUserDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.users.User");
goog.require("chatango.utils.style");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
chatango.group.moderation.banUserDialog = function(user) {
  this.user_ = user;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("moderation_module", "ban_user"));
  this.handler = this.getHandler();
};
goog.inherits(chatango.group.moderation.banUserDialog, chatango.ui.ScrollableDialog);
chatango.group.moderation.banUserDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.confirmationTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.confirmationTextEl);
  this.noBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.noBtn_, goog.ui.Component.EventType.ACTION, this.onCancelButtonClicked);
  this.cancelBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.noBtn_.render(this.cancelBtnWrapperEl_);
  dom.appendChild(content, this.cancelBtnWrapperEl_);
  this.banBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.banBtn_, goog.ui.Component.EventType.ACTION, this.onBanButtonClicked);
  this.deleteBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.banBtn_.render(this.deleteBtnWrapperEl_);
  dom.appendChild(content, this.deleteBtnWrapperEl_);
};
chatango.group.moderation.banUserDialog.prototype.enterDocument = function() {
  chatango.group.moderation.banUserDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.moderation.banUserDialog.prototype.onBanButtonClicked = function() {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_CONFIRM_BAN_USER, this.user_));
};
chatango.group.moderation.banUserDialog.prototype.onCancelButtonClicked = function() {
  this.setVisible(false);
};
chatango.group.moderation.banUserDialog.prototype.updateCopy = function() {
  this.banBtn_.setContent(this.lm_.getString("moderation_module", "yes_ban"));
  this.noBtn_.setContent(this.lm_.getString("ui", "no"));
  var name;
  if (this.user_.isAnon() || this.user_.isTemp()) {
    name = this.lm_.getString("moderation_module", "this_user");
  } else {
    name = this.user_.getName();
  }
  var copy = this.lm_.getString("moderation_module", "do_you_ban_user").split("*user*").join(name);
  copy = copy.split("*b*").join("<b>").split("*/b*").join("</b>");
  this.confirmationTextEl.innerHTML = copy;
};
goog.provide("chatango.group.moderation.deleteMessageDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.style");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
chatango.group.moderation.deleteMessageDialog = function(message) {
  this.message_ = message;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.setTitle(this.lm_.getString("moderation_module", "del_msg"));
  this.handler = this.getHandler();
};
goog.inherits(chatango.group.moderation.deleteMessageDialog, chatango.ui.ScrollableDialog);
chatango.group.moderation.deleteMessageDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.confirmationTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.confirmationTextEl);
  this.cancelBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.cancelBtn_, goog.ui.Component.EventType.ACTION, this.onCancelButtonClicked);
  this.cancelBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.cancelBtn_.render(this.cancelBtnWrapperEl_);
  dom.appendChild(content, this.cancelBtnWrapperEl_);
  this.deleteBtn_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.handler.listen(this.deleteBtn_, goog.ui.Component.EventType.ACTION, this.onDeleteButtonClicked);
  this.deleteBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.deleteBtn_.render(this.deleteBtnWrapperEl_);
  dom.appendChild(content, this.deleteBtnWrapperEl_);
};
chatango.group.moderation.deleteMessageDialog.prototype.enterDocument = function() {
  chatango.group.moderation.deleteMessageDialog.superClass_.enterDocument.call(this);
  this.updateCopy();
};
chatango.group.moderation.deleteMessageDialog.prototype.onDeleteButtonClicked = function() {
  this.dispatchEvent(new goog.events.Event(chatango.events.EventType.MOD_CONFIRM_DELETE_MESSAGE, this.message_));
};
chatango.group.moderation.deleteMessageDialog.prototype.onCancelButtonClicked = function() {
  this.setVisible(false);
};
chatango.group.moderation.deleteMessageDialog.prototype.updateCopy = function() {
  this.deleteBtn_.setContent(this.lm_.getString("moderation_module", "yes_delete"));
  this.cancelBtn_.setContent(this.lm_.getString("ui", "cancel"));
  this.confirmationTextEl.innerHTML = this.lm_.getString("moderation_module", "del_conf");
};
goog.provide("chatango.modules.ModerationModule");
goog.require("chatango.group.moderation.GroupModMessage");
goog.require("chatango.group.moderation.ModerationMenu");
goog.require("chatango.group.moderation.Permissions");
goog.require("chatango.group.moderation.banUserDialog");
goog.require("chatango.group.moderation.confirmDeleteAllMessagesByUserDialog");
goog.require("chatango.group.moderation.deleteAllMessagesByUserDialog");
goog.require("chatango.group.moderation.deleteMessageDialog");
goog.require("chatango.ui.icons.SvgStaffIcon");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.networking.GroupConnection");
goog.require("chatango.users.ModeratorManager");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
chatango.modules.ModerationModule = function(connection, output) {
  goog.events.EventTarget.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("moderation_module", chatango.modules.ModerationModule.strs, this.initCopy, this);
  this.lm_.getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
  this.connection_ = connection;
  this.output_ = output;
  this.menu_ = new chatango.group.moderation.ModerationMenu;
  this.menu_.render(document.body);
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.menu_, chatango.group.moderation.ModerationMenu.EVENTS, this.onMenuEvent_);
  this.mm_ = chatango.users.ModeratorManager.getInstance();
  var modEvents = [chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_FLAGS_CHANGE, chatango.users.ModeratorManager.EventType.CURRENT_USER_MOD_STATUS_CHANGE];
  goog.events.listen(this.mm_, modEvents, this.onFlagsUpdated_, false, this);
};
goog.inherits(chatango.modules.ModerationModule, goog.events.EventTarget);
chatango.modules.ModerationModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.ModerationModule");
chatango.modules.ModerationModule.prototype.installMenu = function(element, elementCorner, menuCorner) {
  this.menu_.update();
  this.menu_.showAtElement(element, elementCorner, menuCorner);
};
chatango.modules.ModerationModule.prototype.getBannedUsersModule_ = function() {
  if (typeof this.bannedUsersModule_ === "undefined") {
    this.bannedUsersModule_ = new chatango.modules.BannedUsersModule(this.connection_);
  }
  return this.bannedUsersModule_;
};
chatango.modules.ModerationModule.prototype.getManageModsModule_ = function() {
  if (typeof this.manageModsModule_ === "undefined") {
    this.manageModsModule_ = new chatango.modules.ManageModsModule(this.connection_);
  }
  return this.manageModsModule_;
};
chatango.modules.ModerationModule.prototype.getModActionsModule_ = function() {
  if (typeof this.modActionsModule_ === "undefined") {
    this.modActionsModule_ = new chatango.modules.ModActionsModule(this.connection_);
  }
  return this.modActionsModule_;
};
chatango.modules.ModerationModule.prototype.getAutoModModule_ = function() {
  if (typeof this.autoModModule_ === "undefined") {
    this.autoModModule_ = new chatango.modules.AutoModModule;
  }
  return this.autoModModule_;
};
chatango.modules.ModerationModule.prototype.getChooseModIconModule_ = function() {
  if (typeof this.chooseModIconModule_ === "undefined") {
    this.chooseModIconModule_ = new chatango.modules.ChooseModIconModule(this.connection_);
  }
  return this.chooseModIconModule_;
};
chatango.modules.ModerationModule.prototype.onFlagsUpdated_ = function(e) {
  var currentUser = chatango.users.UserManager.getInstance().currentUser;
  var isMod = chatango.users.UserManager.getInstance().currentUser.isModerator();
  if (!isMod) {
    this.closePopUps();
  } else {
    var canEditMods = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_MODS);
    if (!canEditMods) {
      if (this.manageModsModule_) {
        this.manageModsModule_.closePopUps();
      }
    }
    var canEditNLP = this.mm_.hasPermission(currentUser.getSid(), chatango.group.moderation.Permissions.Flags.EDIT_NLP);
    if (!canEditNLP) {
      if (this.autoModModule_) {
        this.autoModModule_.closePopUps();
      }
    }
  }
};
chatango.modules.ModerationModule.prototype.closePopUps = function() {
  if (this.bannedUsersModule_) {
    this.bannedUsersModule_.closePopUps();
  }
  if (this.manageModsModule_) {
    this.manageModsModule_.closePopUps();
  }
  if (this.autoModModule_) {
    this.autoModModule_.closePopUps();
  }
  if (this.modActionsModule_) {
    this.modActionsModule_.closePopUps();
  }
  if (this.chooseModIconModule_) {
    this.chooseModIconModule_.closePopUps();
  }
  this.closeDeleteMessageDialog();
  this.closeDeleteAllMessagesByUserDialog();
  this.closeConfirmDeleteAllMessagesByUserDialog();
};
chatango.modules.ModerationModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.bannedUsersModule_) {
    this.bannedUsersModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.deleteMessageDialog_) {
    chatango.utils.display.constrainToStage(this.deleteMessageDialog_.getElement(), opt_stageRect, true);
  }
  if (this.manageModsModule_) {
    this.manageModsModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.modActionsModule_) {
    this.modActionsModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.autoModModule_) {
    this.autoModModule_.constrainDialogsToScreen(opt_stageRect);
  }
  if (this.chooseModIconModule_) {
    this.chooseModIconModule_.constrainDialogsToScreen(opt_stageRect);
  }
};
chatango.modules.ModerationModule.prototype.initCopy = function() {
  if (!this.lm_.isPackLoaded("moderation_module")) {
    return;
  }
  if (this.menu_) {
    this.menu_.initCopy();
  }
  if (!this.lm_.isPackLoaded("ui") || !this.lm_.isPackLoaded("moderation_module")) {
    return;
  }
  if (this.deleteMessageDialog_) {
    this.deleteMessageDialog_.updateCopy();
  }
};
chatango.modules.ModerationModule.prototype.onMenuEvent_ = function(e) {
  switch(e.type) {
    case chatango.group.moderation.EventType.UNBAN_USERS:
      if (!this.bannedUsersModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("BannedUsersModule", function() {
          this.getBannedUsersModule_().openUnbanUsersDialog();
        }, this);
      } else {
        this.getBannedUsersModule_().openUnbanUsersDialog();
      }
      break;
    case chatango.group.moderation.EventType.MANAGE_MODS:
      if (!this.manageModsModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("ManageModsModule", function() {
          this.getManageModsModule_().openManageModsDialog();
        }, this);
      } else {
        this.getManageModsModule_().openManageModsDialog();
      }
      break;
    case chatango.group.moderation.EventType.VIEW_MOD_ACTIONS:
      if (!this.modActionsModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("ModActionsModule", function() {
          this.getModActionsModule_().openModActionsDialog();
        }, this);
      } else {
        this.getModActionsModule_().openModActionsDialog();
      }
      break;
    case chatango.group.moderation.EventType.AUTO_MOD:
      if (!this.autoModModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("AutoModModule", function() {
          this.getAutoModModule_().openEditAutoModView();
        }, this);
      } else {
        this.getAutoModModule_().openEditAutoModView();
      }
      break;
    case chatango.group.moderation.EventType.CHOOSE_MOD_ICON:
      if (!this.chooseModIconModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("ChooseModIconModule", function() {
          this.getChooseModIconModule_().openChooseModIconDialog();
        }, this);
      } else {
        this.getChooseModIconModule_().openChooseModIconDialog();
      }
      break;
    case chatango.group.moderation.EventType.SHOW_MOD_ICON:
      if (!this.chooseModIconModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("ChooseModIconModule", function() {
          this.getChooseModIconModule_().setModIcon(chatango.group.moderation.Permissions.Flags.MOD_ICON_VISIBLE);
        }, this);
      } else {
        this.getChooseModIconModule_().setModIcon(chatango.group.moderation.Permissions.Flags.MOD_ICON_VISIBLE);
      }
      break;
    case chatango.group.moderation.EventType.HIDE_MOD_ICON:
      if (!this.chooseModIconModule_) {
        goog.module.ModuleManager.getInstance().execOnLoad("ChooseModIconModule", function() {
          this.getChooseModIconModule_().setModIcon(0);
        }, this);
      } else {
        this.getChooseModIconModule_().setModIcon(0);
      }
      break;
  }
};
chatango.modules.ModerationModule.prototype.openBanUserDialog = function(user) {
  this.closeBanUserDialog();
  this.banUserDialog_ = new chatango.group.moderation.banUserDialog(user);
  this.banUserDialog_.setVisible(true);
  this.handler_.listen(this.banUserDialog_, chatango.events.EventType.MOD_CONFIRM_BAN_USER, this.onModConfirmBanUser_);
};
chatango.modules.ModerationModule.prototype.closeBanUserDialog = function() {
  if (this.banUserDialog_) {
    this.handler_.unlisten(this.banUserDialog_, chatango.events.EventType.MOD_CONFIRM_BAN_USER, this.onModConfirmBanUser_);
    this.banUserDialog_.dispose();
    this.banUserDialog_ = null;
  }
};
chatango.modules.ModerationModule.prototype.openDeleteMessageDialog = function(message) {
  this.closeDeleteMessageDialog();
  this.deleteMessageDialog_ = new chatango.group.moderation.deleteMessageDialog(message);
  this.deleteMessageDialog_.setVisible(true);
  this.handler_.listen(this.deleteMessageDialog_, chatango.events.EventType.MOD_CONFIRM_DELETE_MESSAGE, this.onModConfirmDeleteMessage);
};
chatango.modules.ModerationModule.prototype.closeDeleteMessageDialog = function() {
  if (this.deleteMessageDialog_) {
    this.handler_.unlisten(this.deleteMessageDialog_, chatango.events.EventType.MOD_CONFIRM_DELETE_MESSAGE, this.onModConfirmDeleteMessage);
    this.deleteMessageDialog_.dispose();
    this.deleteMessageDialog_ = null;
  }
};
chatango.modules.ModerationModule.prototype.openDeleteAllMessagesByUserDialog = function(user) {
  this.closeDeleteAllMessagesByUserDialog();
  this.deleteAllMessageByUserDialog_ = new chatango.group.moderation.deleteAllMessagesByUserDialog(user);
  this.deleteAllMessageByUserDialog_.setVisible(true);
  this.handler_.listen(this.deleteAllMessageByUserDialog_, chatango.events.EventType.MOD_DELETE_ALL_MESSAGES_BY_USER, this.onModDeleteAllMessagesByUser_);
};
chatango.modules.ModerationModule.prototype.closeDeleteAllMessagesByUserDialog = function() {
  if (this.deleteAllMessageByUserDialog_) {
    this.handler_.unlisten(this.deleteAllMessageByUserDialog_, chatango.events.EventType.MOD_DELETE_ALL_MESSAGES_BY_USER, this.onModDeleteAllMessagesByUser_);
    this.deleteAllMessageByUserDialog_.dispose();
    this.deleteAllMessageByUserDialog_ = null;
  }
};
chatango.modules.ModerationModule.prototype.openConfirmDeleteAllMessagesByUserDialog = function(user) {
  this.closeConfirmDeleteAllMessagesByUserDialog();
  this.confirmDeleteAllMessageByUserDialog_ = new chatango.group.moderation.confirmDeleteAllMessagesByUserDialog(user);
  this.confirmDeleteAllMessageByUserDialog_.setVisible(true);
  this.handler_.listen(this.confirmDeleteAllMessageByUserDialog_, chatango.events.EventType.MOD_CONFIRM_DELETE_ALL_MESSAGES_BY_USER, this.onModConfirmDeleteAllMessagesByUser_);
};
chatango.modules.ModerationModule.prototype.closeConfirmDeleteAllMessagesByUserDialog = function() {
  if (this.confirmDeleteAllMessageByUserDialog_) {
    this.handler_.unlisten(this.confirmDeleteAllMessageByUserDialog_, chatango.events.EventType.MOD_CONFIRM_DELETE_ALL_MESSAGES_BY_USER, this.onModConfirmDeleteAllMessagesByUser_);
    this.confirmDeleteAllMessageByUserDialog_.dispose();
    this.confirmDeleteAllMessageByUserDialog_ = null;
  }
};
chatango.modules.ModerationModule.prototype.onModConfirmDeleteMessage = function(e) {
  var user = e.target.getUser();
  this.closeDeleteMessageDialog();
  this.connection_.send("delmsg:" + e.target.getMessageId());
  this.output_.removeMessage(e.target.getMessageId());
  this.openDeleteAllMessagesByUserDialog(user);
};
chatango.modules.ModerationModule.prototype.onModDeleteAllMessagesByUser_ = function(e) {
  this.closeDeleteAllMessagesByUserDialog();
  this.openConfirmDeleteAllMessagesByUserDialog(e.target);
};
chatango.modules.ModerationModule.prototype.easyban = function(e) {
  var user = e.target.getUser();
  this.banUser_(user);
  this.deleteAllMessagesByUser_(user);
  this.output_.removeMessage(e.target.getMessageId());
};
chatango.modules.ModerationModule.prototype.onModConfirmDeleteAllMessagesByUser_ = function(e) {
  this.deleteAllMessagesByUser_(e.target);
  this.closeConfirmDeleteAllMessagesByUserDialog();
};
chatango.modules.ModerationModule.prototype.deleteAllMessagesByUser_ = function(user) {
  var cmd;
  var id = user.getEncodedCookie();
  var ip = user.getIP();
  if (user.isAnon() || user.isTemp()) {
    cmd = "delallmsg:" + id + ":" + ip + ":";
  } else {
    var handle = user.getSid();
    cmd = "delallmsg:" + id + ":" + ip + ":" + handle + "";
  }
  this.connection_.send(cmd);
};
chatango.modules.ModerationModule.prototype.onModConfirmBanUser_ = function(e) {
  this.closeBanUserDialog();
  this.banUser_(e.target);
};
chatango.modules.ModerationModule.prototype.banUser_ = function(user) {
  if (!user) {
    return;
  }
  var id = user.getEncodedCookie();
  var ip = user.getIP();
  var cmd;
  if (user.isAnon() || user.isTemp()) {
    cmd = "block:" + id + ":" + ip + ":";
  } else {
    cmd = "block:" + id + ":" + ip + ":" + user.getSid();
  }
  this.connection_.send(cmd);
};
chatango.modules.ModerationModule.strs = {"unban_users":"Unban users", "unban_users_tt":"Search bans*br*Unban users", "del_msg":"Delete message?", "del_conf":"Are you sure you want to delete this message?", "yes_delete":"Yes, delete", "msg_del":"Message deleted", "del_all_conf":"Do you want to delete all messages by *user*?", "this_person":"this person", "yes_delete_all":"Yes, delete all", "are_you_sure":"Are you sure?", "del_all_msgs":"Do you want to *b*delete all*/b* *user*'s messages?", "ban_user":"Ban user?", 
"this_user":"this user", "do_you_ban_user":"Do you want to *b*ban *user*?*/b*", "yes_ban":"Yes, ban", "turn_easyban_off":"Turn easy ban off", "turn_easyban_on":"Turn easy ban on", "mod_delete_msg":"Delete message", "mod_ban_user":"Ban user", "easyban_str":"Ban user and delete posts", "manage_mods":"Manage moderators", "cannot_ban":"Moderator: can not ban", "user_banned":"User is banned", "unban_users_short":"Unban users", "manage_mods_short":"Manage mods", "auto_mod":"Auto-moderation", "auto_mod_short":"Auto-mod", 
"turn_easyban_off_short":"Easy ban off", "turn_easyban_on_short":"Easy ban on", "view_mod_actions":"View mod actions log", "view_mod_actions_short":"Mod actions", "show_mod_icon":"Show mod badge", "hide_mod_icon":"Hide mod badge", "choose_mod_icon":"Choose badge"};
goog.module.ModuleManager.getInstance().setLoaded("ModerationModule");

