goog.provide("chatango.group.GroupLogoMenuEventType");
chatango.group.GroupLogoMenuEventType = {CLONE_GROUP:"c_grp", NEW_GROUP:"n_grp", OPEN_PM:"open_pm"};
goog.provide("chatango.group.GroupLogoMenu");
goog.require("chatango.ui.PopupMenu");
goog.require("goog.ui.MenuItem");
goog.require("goog.ui.Component.EventType");
goog.require("chatango.users.UserManager");
goog.require("chatango.group.GroupLogoMenuEventType");
chatango.group.GroupLogoMenu = function(opt_domHelper, opt_renderer) {
  goog.base(this, opt_domHelper, opt_renderer);
  this.allItems_ = [this.logOutItem_ = new goog.ui.MenuItem(" "), this.cloneGroupItem_ = new goog.ui.MenuItem(" "), this.newGroupItem_ = new goog.ui.MenuItem(" "), this.pmItem_ = new goog.ui.MenuItem(" ")];
  this.updateItems();
  this.initCopy();
};
goog.inherits(chatango.group.GroupLogoMenu, chatango.ui.PopupMenu);
chatango.group.GroupLogoMenu.EVENTS = [chatango.group.GroupLogoMenuEventType.CLONE_GROUP, chatango.group.GroupLogoMenuEventType.NEW_GROUP, chatango.group.GroupLogoMenuEventType.OPEN_PM];
chatango.group.GroupLogoMenu.prototype.initCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  this.cloneGroupItem_.setCaption(lm.getString("logomenu_module", "clone_group"));
  this.newGroupItem_.setCaption(lm.getString("logomenu_module", "new_group"));
  this.pmItem_.setCaption(lm.getString("logomenu_module", "open_pm"));
};
chatango.group.GroupLogoMenu.prototype.onAction_ = function(e) {
  this.hide();
  if (e.target === this.cloneGroupItem_) {
    this.dispatchEvent(chatango.group.GroupLogoMenuEventType.CLONE_GROUP);
  } else {
    if (e.target === this.newGroupItem_) {
      this.dispatchEvent(chatango.group.GroupLogoMenuEventType.NEW_GROUP);
    } else {
      if (e.target === this.pmItem_) {
        this.dispatchEvent(chatango.group.GroupLogoMenuEventType.OPEN_PM);
      }
    }
  }
};
chatango.group.GroupLogoMenu.prototype.updateItems = function() {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var itemIdsToShow = {};
  if (cUser) {
    if (cUser.isRegistered()) {
      itemIdsToShow[this.pmItem_.getId()] = true;
    }
    if (cUser.isModerator()) {
      itemIdsToShow[this.cloneGroupItem_.getId()] = true;
    }
  }
  itemIdsToShow[this.newGroupItem_.getId()] = true;
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
goog.provide("chatango.modules.LogoMenuModule");
goog.require("chatango.events.EventType");
goog.require("chatango.group.GroupLogoMenu");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
chatango.modules.LogoMenuModule = function() {
  goog.base(this);
  this.menu_ = new chatango.group.GroupLogoMenu;
  this.menu_.render(document.body);
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.menu_, chatango.group.GroupLogoMenu.EVENTS, this.onMenuEvent_);
  chatango.managers.LanguageManager.getInstance().getStringPack("logomenu_module", chatango.modules.LogoMenuModule.strs, this.initCopy, this);
};
goog.inherits(chatango.modules.LogoMenuModule, goog.events.EventTarget);
chatango.modules.LogoMenuModule.prototype.installMenu = function(element) {
  this.menu_.updateItems();
  this.menu_.showAtElement(element, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT);
};
chatango.modules.LogoMenuModule.prototype.onMenuEvent_ = function(e) {
  switch(e.type) {
    case chatango.group.GroupLogoMenuEventType.CLONE_GROUP:
      this.dispatchEvent(chatango.group.GroupLogoMenuEventType.CLONE_GROUP);
      break;
    case chatango.group.GroupLogoMenuEventType.NEW_GROUP:
      this.dispatchEvent(chatango.group.GroupLogoMenuEventType.NEW_GROUP);
      break;
    case chatango.group.GroupLogoMenuEventType.OPEN_PM:
      this.dispatchEvent(chatango.group.GroupLogoMenuEventType.OPEN_PM);
      break;
  }
  e.stopPropagation();
};
chatango.modules.LogoMenuModule.prototype.initCopy = function(pack_id) {
  var lm = chatango.managers.LanguageManager.getInstance();
  if (lm.isPackLoaded("logomenu_module")) {
    if (this.menu_) {
      this.menu_.initCopy();
    }
  }
};
chatango.modules.LogoMenuModule.strs = {"clone_group":"Get code for this group", "new_group":"Get your own", "open_pm":"Private messaging"};
goog.module.ModuleManager.getInstance().setLoaded("LogoMenuModule");

