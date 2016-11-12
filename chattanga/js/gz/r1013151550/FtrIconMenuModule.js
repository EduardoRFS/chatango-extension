goog.provide("chatango.group.GroupFooterMenu");
goog.require("chatango.ui.PopupMenu");
goog.require("goog.ui.MenuItem");
goog.require("goog.ui.Component.EventType");
goog.require("chatango.users.UserManager");
goog.require("chatango.group.GroupFooterMenuEventType");
goog.require("chatango.group.MessageCatcherView");
goog.require("chatango.ui.icons.SvgStarIcon");
goog.require("chatango.ui.icons.SvgSettingsCogIcon");
goog.require("chatango.ui.icons.SvgModHammerIcon");
goog.require("chatango.managers.LanguageManager");
goog.require("goog.module.ModuleManager");
chatango.group.GroupFooterMenu = function() {
  goog.base(this);
  var iconColor = "#666666";
  this.starIcon_ = new chatango.ui.icons.SvgStarIcon(iconColor);
  this.starIcon_.setUseStarAspectRatio(false);
  var starDiv = goog.dom.createDom("div");
  this.starIcon_.render(starDiv);
  this.settingsCogIcon_ = new chatango.ui.icons.SvgSettingsCogIcon(iconColor);
  var settingsDiv = goog.dom.createDom("div");
  this.settingsCogIcon_.render(settingsDiv);
  this.modHammerIcon_ = new chatango.ui.icons.SvgModHammerIcon(iconColor);
  var modDiv = goog.dom.createDom("div");
  this.modHammerIcon_.render(modDiv);
  this.mcView_ = new chatango.group.MessageCatcherView;
  this.mcView_.inGroupFooterMenu(true, iconColor);
  var mcvDiv = goog.dom.createDom("div");
  this.mcView_.render(mcvDiv);
  var lm = chatango.managers.LanguageManager.getInstance();
  this.allItems_ = [this.setNameItem_ = new goog.ui.MenuItem(lm.getString("basic_group", "set_name")), this.starItem_ = new goog.ui.MenuItem(starDiv), this.settingsItem_ = new goog.ui.MenuItem(settingsDiv), this.moderationItem_ = new goog.ui.MenuItem(modDiv), this.mcvItem_ = new goog.ui.MenuItem(mcvDiv)];
  var i;
  var len = this.allItems_.length;
  for (i = 0;i < len;i++) {
    this.allItems_[i].addClassName("goog-inline-block");
    this.allItems_[i].addClassName("icon-menu-item");
  }
  this.updateItems(true);
};
goog.inherits(chatango.group.GroupFooterMenu, chatango.ui.PopupMenu);
chatango.group.GroupFooterMenu.prototype.logger = goog.debug.Logger.getLogger("chatango.group.GroupFooterMenu");
chatango.group.GroupFooterMenu.EVENTS = [chatango.group.GroupFooterMenuEventType.OPEN_SETTINGS, chatango.group.GroupFooterMenuEventType.OPEN_MODERATION, chatango.group.GroupFooterMenuEventType.OPEN_LOGIN, chatango.group.GroupFooterMenuEventType.OPEN_PM];
chatango.group.GroupFooterMenu.prototype.setMessageCatcher = function(mcMod) {
  if (this.mcView_) {
    this.mcView_.setMessageCatcher(mcMod);
  }
};
chatango.group.GroupFooterMenu.prototype.onAction_ = function(e) {
  this.hide();
  if (e.target === this.settingsItem_) {
    this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_SETTINGS);
  } else {
    if (e.target === this.moderationItem_) {
      this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_MODERATION);
    } else {
      if (e.target === this.setNameItem_) {
        this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_LOGIN);
      } else {
        if (e.target === this.mcvItem_) {
          this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_PM);
        }
      }
    }
  }
};
chatango.group.GroupFooterMenu.prototype.updateItems = function(mcv) {
  var cUser = chatango.users.UserManager.getInstance().currentUser;
  var itemIdsToShow = {};
  if (cUser && cUser.getType() && cUser.getType() == chatango.users.User.UserType.SELLER) {
    if (mcv) {
      itemIdsToShow[this.mcvItem_.getId()] = true;
    }
    itemIdsToShow[this.settingsItem_.getId()] = true;
    if (cUser.isModerator()) {
      itemIdsToShow[this.moderationItem_.getId()] = true;
    }
  } else {
    itemIdsToShow[this.setNameItem_.getId()] = true;
  }
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
goog.provide("chatango.modules.FtrIconMenuModule");
goog.require("chatango.events.EventType");
goog.require("chatango.group.GroupFooterMenu");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.modules.CommonUIModule");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning.Corner");
chatango.modules.FtrIconMenuModule = function() {
  goog.base(this);
  this.menu_ = new chatango.group.GroupFooterMenu;
  this.menu_.render(document.body);
  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.menu_, chatango.group.GroupFooterMenu.EVENTS, this.onMenuEvent_);
};
goog.inherits(chatango.modules.FtrIconMenuModule, goog.events.EventTarget);
chatango.modules.FtrIconMenuModule.prototype.installMenu = function(element, mcv) {
  this.menu_.updateItems(mcv);
  this.menu_.showAtElement(element, goog.positioning.Corner.TOP_LEFT, goog.positioning.Corner.BOTTOM_LEFT);
};
chatango.modules.FtrIconMenuModule.prototype.onMenuEvent_ = function(e) {
  switch(e.type) {
    case chatango.group.GroupFooterMenuEventType.OPEN_SETTINGS:
      this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_SETTINGS);
      break;
    case chatango.group.GroupFooterMenuEventType.OPEN_MODERATION:
      this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_MODERATION);
      break;
    case chatango.group.GroupFooterMenuEventType.OPEN_LOGIN:
      this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_LOGIN);
      break;
    case chatango.group.GroupFooterMenuEventType.OPEN_PM:
      this.dispatchEvent(chatango.group.GroupFooterMenuEventType.OPEN_PM);
      break;
  }
  e.stopPropagation();
};
chatango.modules.FtrIconMenuModule.prototype.setMessageCatcher = function(mcMod) {
  if (this.menu_) {
    this.menu_.setMessageCatcher(mcMod);
  }
};
goog.module.ModuleManager.getInstance().setLoaded("FtrIconMenuModule");

