goog.provide("chatango.group.GroupShareMenuEventType");
chatango.group.GroupShareMenuEventType = {SHARE_TEXT:"s_sms", SHARE_EMAIL:"s_email", NEW_GROUP:"n_grp"};
goog.provide("chatango.group.GroupShareMenu");
goog.require("goog.ui.MenuItem");
goog.require("goog.ui.Component.EventType");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.users.UserManager");
goog.require("chatango.utils.userAgent");
goog.require("chatango.group.GroupShareMenuEventType");
chatango.group.GroupShareMenu = function(opt_domHelper, opt_renderer) {
  goog.base(this, opt_domHelper, opt_renderer);
  this.allItems_ = [this.shareTextItem_ = new goog.ui.MenuItem(" "), this.shareEmailItem_ = new goog.ui.MenuItem(" "), this.newGroupItem_ = new goog.ui.MenuItem(" ")];
  this.updateItems();
  this.initCopy();
};
goog.inherits(chatango.group.GroupShareMenu, chatango.ui.PopupMenu);
chatango.group.GroupShareMenu.EVENTS = [chatango.group.GroupShareMenuEventType.SHARE_TEXT, chatango.group.GroupShareMenuEventType.SHARE_EMAIL, chatango.group.GroupShareMenuEventType.NEW_GROUP];
chatango.group.GroupShareMenu.prototype.initCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  this.shareTextItem_.setCaption(lm.getString("sharemenu", "share_text"));
  this.shareEmailItem_.setCaption(lm.getString("sharemenu", "share_email"));
  this.newGroupItem_.setCaption(lm.getString("sharemenu", "start_new"));
};
chatango.group.GroupShareMenu.prototype.onAction_ = function(e) {
  this.hide();
  if (e.target === this.shareTextItem_) {
    this.dispatchEvent(chatango.group.GroupShareMenuEventType.SHARE_TEXT);
  } else {
    if (e.target === this.shareEmailItem_) {
      this.dispatchEvent(chatango.group.GroupShareMenuEventType.SHARE_EMAIL);
    } else {
      if (e.target === this.newGroupItem_) {
        this.dispatchEvent(chatango.group.GroupShareMenuEventType.NEW_GROUP);
      }
    }
  }
};
chatango.group.GroupShareMenu.prototype.updateItems = function() {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var itemIdsToShow = {};
  if (cUser) {
    if (cUser.isRegistered()) {
      itemIdsToShow[this.newGroupItem_.getId()] = true;
    }
  }
  if (chatango.utils.userAgent.IOS) {
    itemIdsToShow[this.shareTextItem_.getId()] = true;
  }
  itemIdsToShow[this.shareEmailItem_.getId()] = true;
  var i;
  var len = this.allItems_.length;
  var id;
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
};
goog.provide("chatango.strings.ShareMenuStrings");
chatango.strings.ShareMenuStrings = {"share_text":"Share via text", "share_email":"Share via email", "start_new":"Start new group"};
goog.provide("chatango.modules.ShareMenuModule");
goog.require("chatango.events.EventType");
goog.require("chatango.group.GroupShareMenu");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("chatango.strings.ShareMenuStrings");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
chatango.modules.ShareMenuModule = function() {
  goog.base(this);
  this.menu_ = new chatango.group.GroupShareMenu;
  this.menu_.render(document.body);
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.menu_, chatango.group.GroupShareMenu.EVENTS, this.onMenuEvent_);
  chatango.managers.LanguageManager.getInstance().getStringPack("sharemenu", chatango.strings.ShareMenuStrings, this.initCopy, this);
};
goog.inherits(chatango.modules.ShareMenuModule, goog.events.EventTarget);
chatango.modules.ShareMenuModule.prototype.installMenu = function(element) {
  this.menu_.updateItems();
  this.menu_.showAtElement(element, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT);
};
chatango.modules.ShareMenuModule.prototype.onMenuEvent_ = function(e) {
  this.dispatchEvent(e.type);
  e.stopPropagation();
};
chatango.modules.ShareMenuModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("sharemenu")) {
    if (this.menu_) {
      this.menu_.initCopy();
    }
  }
};
goog.module.ModuleManager.getInstance().setLoaded("ShareMenuModule");

