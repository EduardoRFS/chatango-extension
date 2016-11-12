goog.provide("chatango.ui.ChannelPickerButton");
goog.require("chatango.group.channels.ChannelModel");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.utils.cssom");
goog.require("goog.ui.Component");
chatango.ui.ChannelPickerButton = function(channelId) {
  goog.ui.Component.call(this);
  this.channelId_ = channelId;
  this.selected_ = false;
  this.enabled_ = true;
  this.filterMode_ = false;
};
goog.inherits(chatango.ui.ChannelPickerButton, goog.ui.Component);
chatango.ui.ChannelPickerButton.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"chan-btn"});
  goog.style.setStyle(this.element_, "background-color", "#FFFFFF");
  this.bg_ = goog.dom.createDom("div", {"class":"chan-btn-bg"});
  goog.dom.append(this.element_, this.bg_);
  if (this.channelId_ === 0) {
    goog.dom.append(this.bg_, this.getCloseSVG_());
    goog.style.setStyle(this.bg_, "background-color", "#FFFFFF");
  } else {
    if (chatango.group.channels.ChannelModel.CHANNEL_FLAGS[this.channelId_] == chatango.group.channels.ChannelModel.MOD_CHANNEL_FLAG) {
      var modIcon = new chatango.ui.icons.SvgModIcon(null, "-20 -20 140 140");
      modIcon.setSize(100, 100, "%");
      modIcon.render(this.bg_);
      this.modBtn_ = this.bg_;
      goog.style.setStyle(this.bg_, "background-image", chatango.utils.cssom.getModStripesCss());
      goog.style.setStyle(this.bg_, "border", "none");
    } else {
      goog.style.setStyle(this.bg_, "background-color", chatango.group.channels.ChannelController.CHANNEL_COLS[this.channelId_]);
    }
  }
  this.tickWrap_ = goog.dom.createDom("div", {"class":"tick-wrap", "style":"width:36%; height:36%; position:absolute; right: 7%; top:7%"});
  goog.dom.append(this.bg_, this.tickWrap_);
  goog.dom.append(this.tickWrap_, this.getTickSVG_());
  goog.events.listen(this.element_, goog.events.EventType.CLICK, this.onClick, false, this);
  this.draw();
};
chatango.ui.ChannelPickerButton.prototype.draw = function() {
  if (!this.filterMode_) {
    goog.style.showElement(this.tickWrap_, false);
    if (this.channelId_ !== 0) {
      goog.dom.classes.enable(this.bg_, "faded", true);
    }
    if (this.selected_) {
      if (this.channelId_ === 0) {
        goog.style.setStyle(this.element_, "border", ".2em solid #666");
      } else {
        if (chatango.group.channels.ChannelModel.CHANNEL_FLAGS[this.channelId_] == chatango.group.channels.ChannelModel.MOD_CHANNEL_FLAG) {
          goog.dom.classes.enable(this.bg_, "faded", false);
        } else {
          var borderSize = chatango.managers.Environment.getInstance().isMobile() ? ".7em" : ".5em";
          var color = chatango.group.channels.ChannelController.CHANNEL_COLS[this.channelId_];
          goog.style.setStyle(this.element_, "border-left", borderSize + " solid " + color);
        }
      }
    } else {
      if (this.channelId_ === 0) {
        goog.style.setStyle(this.element_, "border", "1px solid #CCC");
      } else {
        goog.style.setStyle(this.element_, "border-left", "none");
      }
    }
  } else {
    goog.dom.classes.enable(this.bg_, "faded", !this.enabled_);
    goog.style.showElement(this.tickWrap_, this.enabled_);
  }
};
chatango.ui.ChannelPickerButton.prototype.getCloseSVG_ = function() {
  var svg = chatango.utils.svg.createSvg({"viewBox":"0 0 40 40", "width":"100%", "height":"100%"});
  var strokeWidth = "3%";
  var line = chatango.utils.svg.createSvgElement("path", {"d":"M 5 5 L 35 35", "stroke":"#AAA", "fill":"none", "stroke-width":strokeWidth});
  goog.dom.appendChild(svg, line);
  line = chatango.utils.svg.createSvgElement("path", {"d":"M 35 5 L 5 35", "stroke":"#AAA", "fill":"none", "stroke-width":strokeWidth});
  goog.dom.appendChild(svg, line);
  return svg;
};
chatango.ui.ChannelPickerButton.prototype.getTickSVG_ = function() {
  var svg = chatango.utils.svg.createSvg({"viewBox":"0 0 100 100", "width":"100%", "height":"100%"});
  goog.style.setStyle(svg, "vertical-align", "top");
  var circle = chatango.utils.svg.createSvgElement("circle", {"cx":"50", "cy":"50", "r":"49", "style":"fill:#444"});
  goog.dom.appendChild(svg, circle);
  var strokeWidth = "15%";
  var line = chatango.utils.svg.createSvgElement("path", {"d":"M 25 55 L 42 75 L 80 32", "stroke":"#FFF", "stroke-linecap":"butt", "stroke-linejoin":"miter", "fill":"none", "stroke-width":strokeWidth});
  goog.dom.appendChild(svg, line);
  return svg;
};
chatango.ui.ChannelPickerButton.prototype.onClick = function(e) {
  this.dispatchEvent(e);
};
chatango.ui.ChannelPickerButton.prototype.setSelected = function(selected) {
  this.selected_ = selected;
  this.draw();
};
chatango.ui.ChannelPickerButton.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  this.draw();
};
chatango.ui.ChannelPickerButton.prototype.setFilterMode = function(bool) {
  this.filterMode_ = bool;
  this.draw();
};
chatango.ui.ChannelPickerButton.prototype.getChannelId = function() {
  return this.channelId_;
};
goog.provide("chatango.ui.ChannelPickerDialog");
goog.require("goog.array");
goog.require("goog.events");
goog.require("chatango.events.EventType");
goog.require("chatango.group.channels.ChannelController");
goog.require("chatango.managers.ManagerManager");
goog.require("chatango.ui.ChannelPickerButton");
goog.require("chatango.ui.icons.SvgModIcon");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.users.ModeratorManager");
goog.require("chatango.utils.svg");
chatango.ui.ChannelPickerDialog = function(inputEl, opt_openFilterView) {
  this.inputEl_ = inputEl;
  this.channelButtons_ = [];
  this.viewMode_ = opt_openFilterView ? chatango.ui.ChannelPickerDialog.ViewMode.FILTER_VIEW : chatango.ui.ChannelPickerDialog.ViewMode.SET_VIEW;
  chatango.ui.ScrollableDialog.call(this, undefined, undefined, true);
  this.setResizable(false);
  goog.events.listen(chatango.group.channels.ChannelController.getInstance(), chatango.group.channels.ChannelController.Events, this.onChannelModelChange, false, this);
};
goog.inherits(chatango.ui.ChannelPickerDialog, chatango.ui.ScrollableDialog);
chatango.ui.ChannelPickerDialog.ViewMode = {SET_VIEW:"cpd_set_v", FILTER_VIEW:"cpd_filter_v"};
chatango.ui.ChannelPickerDialog.prototype.createDom = function() {
  chatango.ui.ChannelPickerDialog.superClass_.createDom.call(this);
  this.showHeaderContentEl(false);
  this.showHeaderElBorder(false);
  this.showTitleBarBg(false);
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "edit-dialog");
  goog.dom.append(scrollContent, content);
  this.warningEl_ = goog.dom.createDom("div", {"class":"sdlg-section warning fineprint"});
  goog.dom.append(content, this.warningEl_);
  goog.style.showElement(this.warningEl_, false);
  this.pickerWrap_ = goog.dom.createDom("div", {"class":"channel-picker"});
  this.buttonsWrap_ = goog.dom.createDom("div", {"class":"channel-picker-btns"});
  var buttonsRow = goog.dom.createDom("div", {"class":"channel-picker-row"});
  var btn;
  var len = chatango.group.channels.ChannelModel.CHANNEL_FLAGS.length;
  var managers = chatango.managers.ManagerManager.getInstance();
  var cc = chatango.group.channels.ChannelController.getInstance();
  var isPermittedMod = cc.isPermittedToSeeModChannel();
  var channelsEnabledFlagSet = cc.channelsEnabledFlagSet();
  var showModChannelOnly_ = isPermittedMod && !channelsEnabledFlagSet;
  var isModBtn;
  for (var i = 0;i < len;i++) {
    isModBtn = false;
    if (chatango.group.channels.ChannelController.UNUSED_CHANNELS[i]) {
      continue;
    }
    if (chatango.group.channels.ChannelModel.CHANNEL_FLAGS[i] == chatango.group.channels.ChannelModel.MOD_CHANNEL_FLAG) {
      if (!isPermittedMod) {
        btn = null;
        continue;
      }
      isModBtn = true;
    } else {
      if (i !== 0) {
        if (showModChannelOnly_) {
          btn = null;
          continue;
        }
      }
    }
    btn = new chatango.ui.ChannelPickerButton(i);
    if (isModBtn) {
      this.modBtn_ = btn;
    }
    this.channelButtons_[i] = btn;
    btn.render(buttonsRow);
    goog.events.listen(btn, goog.events.EventType.CLICK, this.onChannelClick_, false, this);
    if ((i + 1) % 2 == 0) {
      goog.dom.append(this.buttonsWrap_, buttonsRow);
      buttonsRow = goog.dom.createDom("div", {"class":"channel-picker-row"});
    }
  }
  if (buttonsRow.children.length > 0) {
    goog.dom.append(this.buttonsWrap_, buttonsRow);
  }
  goog.dom.append(content, this.pickerWrap_);
  goog.dom.append(this.pickerWrap_, this.buttonsWrap_);
  var toggleWrap = goog.dom.createDom("div", {"class":"sdlg-section"});
  goog.dom.append(content, toggleWrap);
  this.toggleLink_ = goog.dom.createDom("a");
  goog.dom.append(toggleWrap, this.toggleLink_);
  goog.events.listen(this.toggleLink_, goog.events.EventType.CLICK, this.onToggleLinkClick_, false, this);
  this.updateButtons_();
  this.updateCopy();
  chatango.group.channels.ChannelController.getInstance().registerView(this);
};
chatango.ui.ChannelPickerDialog.prototype.updateCopy = function() {
  var lm = chatango.managers.LanguageManager.getInstance();
  var cc = chatango.group.channels.ChannelController.getInstance();
  var filterApplied = cc.getBlockedChannels() != 0 || cc.isChannelBlocked(0);
  switch(this.viewMode_) {
    case chatango.ui.ChannelPickerDialog.ViewMode.SET_VIEW:
      this.setTitle(lm.getString("channel", "my_channel"));
      if (filterApplied) {
        this.toggleLink_.innerHTML = lm.getString("channel", "filter_applied");
      } else {
        this.toggleLink_.innerHTML = lm.getString("channel", "filter_channels");
      }
      break;
    case chatango.ui.ChannelPickerDialog.ViewMode.FILTER_VIEW:
      if (filterApplied) {
        this.setTitle(lm.getString("channel", "filter_applied"));
      } else {
        this.setTitle(lm.getString("channel", "filter"));
      }
      this.toggleLink_.innerHTML = lm.getString("channel", "set_your_channel");
      break;
  }
  if (this.modBtn_) {
    this.modBtn_.getElement().title = lm.getString("channel", "mods_only");
  }
  this.warningEl_.innerHTML = lm.getString("channel", "can-not-filter").split("*BR*").join("<BR/>");
};
chatango.ui.ChannelPickerDialog.prototype.onChannelClick_ = function(e) {
  var btn = e.currentTarget;
  var chosenFlag = chatango.group.channels.ChannelModel.CHANNEL_FLAGS[btn.getChannelId()];
  var ev;
  goog.style.showElement(this.warningEl_, false);
  switch(this.viewMode_) {
    case chatango.ui.ChannelPickerDialog.ViewMode.SET_VIEW:
      ev = new chatango.events.Event(chatango.group.channels.ChannelController.EventType.CHANNEL_SET);
      break;
    case chatango.ui.ChannelPickerDialog.ViewMode.FILTER_VIEW:
      if (chatango.group.channels.ChannelController.getInstance().isChannelBlocked(chosenFlag)) {
        ev = new chatango.events.Event(chatango.group.channels.ChannelController.EventType.REMOVE_BLOCKED_CHANNEL);
      } else {
        if (chatango.group.channels.ChannelController.getInstance().getCurrentChannel() == chosenFlag) {
          goog.style.showElement(this.warningEl_, true);
          return;
        }
        ev = new chatango.events.Event(chatango.group.channels.ChannelController.EventType.ADD_BLOCKED_CHANNEL);
      }
      break;
  }
  ev.setData(chosenFlag);
  this.dispatchEvent(ev);
};
chatango.ui.ChannelPickerDialog.prototype.onToggleLinkClick_ = function(e) {
  switch(this.viewMode_) {
    case chatango.ui.ChannelPickerDialog.ViewMode.SET_VIEW:
      this.viewMode_ = chatango.ui.ChannelPickerDialog.ViewMode.FILTER_VIEW;
      break;
    case chatango.ui.ChannelPickerDialog.ViewMode.FILTER_VIEW:
      this.viewMode_ = chatango.ui.ChannelPickerDialog.ViewMode.SET_VIEW;
      break;
  }
  this.updateButtons_();
  this.updateCopy();
};
chatango.ui.ChannelPickerDialog.prototype.updateButtons_ = function(e) {
  var currentChannel = chatango.group.channels.ChannelController.getInstance().getCurrentChannel();
  var blockedChannels = chatango.group.channels.ChannelController.getInstance().getBlockedChannels();
  var len = this.channelButtons_.length;
  var btn;
  var selected, enabled;
  for (var i = 0;i < len;i++) {
    btn = this.channelButtons_[i];
    if (btn == undefined) {
      continue;
    }
    selected = !!(chatango.group.channels.ChannelModel.CHANNEL_FLAGS[i] & currentChannel) || i == 0 && currentChannel == 0;
    enabled = !chatango.group.channels.ChannelController.getInstance().isChannelBlocked(chatango.group.channels.ChannelModel.CHANNEL_FLAGS[i]);
    btn.setSelected(selected);
    btn.setEnabled(enabled);
    btn.setFilterMode(this.viewMode_ == chatango.ui.ChannelPickerDialog.ViewMode.FILTER_VIEW);
  }
};
chatango.ui.ChannelPickerDialog.prototype.reposition = function() {
  var offset = new goog.math.Coordinate(0, -20);
  goog.positioning.positionAtAnchor(this.inputEl_, goog.positioning.Corner.TOP_LEFT, this.getElement(), goog.positioning.Corner.BOTTOM_LEFT, offset);
};
chatango.ui.ChannelPickerDialog.prototype.onChannelModelChange = function(e) {
  switch(e.type) {
    case chatango.group.channels.ChannelController.EventType.CHANNEL_CHANGE:
      this.updateButtons_();
      this.updateCopy();
      break;
    case chatango.group.channels.ChannelController.EventType.CHANNEL_FILTER_CHANGE:
      this.updateButtons_();
      this.updateCopy();
      break;
  }
};
chatango.ui.ChannelPickerDialog.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.getElement()) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var vm = chatango.managers.ViewportManager.getInstance();
    var vpWidth = vm.getViewportSizeMonitor().getSize().width;
    var stage_w = opt_stageRect ? opt_stageRect.width : vpWidth;
    var new_h = Math.round(stage_h);
    this.setMaxHeight(new_h * .95);
    chatango.utils.display.constrainToStage(this.getElement(), opt_stageRect, true);
  }
};
chatango.ui.ChannelPickerDialog.prototype.disposeInternal = function() {
  if (this.modBtn_) {
    this.modBtn_.dispose();
  }
  this.modBtn_ = null;
  if (this.toggleLink_) {
    goog.events.unlisten(this.toggleLink_, goog.events.EventType.CLICK, this.onToggleLinkClick_, false, this);
    this.toggleLink_ = null;
  }
  goog.events.unlisten(chatango.group.channels.ChannelController.getInstance(), chatango.group.channels.ChannelController.Events, this.onChannelModelChange, false, this);
  chatango.ui.ChannelPickerDialog.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.strings.ChannelStrings");
chatango.strings.ChannelStrings = {"set_your_channel":"Set your channel", "my_channel":"My channel", "filter_channels":"Filter channels", "filter":"Filter", "mods_only":"Mods only channel", "can-not-filter":"You can't filter your*BR*current channel", "filter_applied":"Filter applied"};
goog.provide("chatango.modules.ChannelPickerModule");
goog.require("chatango.managers.LanguageManager");
goog.require("chatango.ui.ChannelPickerDialog");
goog.require("chatango.strings.ChannelStrings");
goog.require("chatango.utils.display");
goog.require("goog.debug.Logger");
goog.require("goog.events.EventHandler");
goog.require("goog.module.ModuleManager");
chatango.modules.ChannelPickerModule = function() {
  goog.events.EventTarget.call(this);
  if (chatango.DEBUG) {
    this.logger.info("Creating ChannelPickerModule");
  }
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.lm_.getStringPack("channel", chatango.strings.ChannelStrings, this.initCopy, this);
};
goog.inherits(chatango.modules.ChannelPickerModule, goog.events.EventTarget);
chatango.modules.ChannelPickerModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.ChannelPickerModule");
chatango.modules.ChannelPickerModule.prototype.openChannelPicker = function(inputEl, opt_openFilterView) {
  this.closeChannelPicker();
  this.ChannelPicker_ = new chatango.ui.ChannelPickerDialog(inputEl, opt_openFilterView);
  this.ChannelPicker_.setVisible(true);
  this.constrainDialogsToScreen();
};
chatango.modules.ChannelPickerModule.prototype.closeChannelPicker = function() {
  if (this.ChannelPicker_) {
    this.ChannelPicker_.dispose();
    this.ChannelPicker_ = null;
  }
};
chatango.modules.ChannelPickerModule.prototype.relayEvent_ = function(e) {
  this.dispatchEvent(e);
};
chatango.modules.ChannelPickerModule.prototype.closePopUps = function() {
  this.closeChannelPicker();
};
chatango.modules.ChannelPickerModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (!this.ChannelPicker_) {
    return;
  }
  this.ChannelPicker_.constrainDialogsToScreen(opt_stageRect);
};
chatango.modules.ChannelPickerModule.prototype.initCopy = function(pack_id) {
  if (this.ChannelPicker_) {
    this.ChannelPicker_.updateCopy();
  }
};
goog.module.ModuleManager.getInstance().setLoaded("ChannelPickerModule");

