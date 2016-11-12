goog.provide("chatango.ui.WarningDialog");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.utils.style");
chatango.ui.WarningDialog = function(warning, opt_title) {
  this.warning_ = warning;
  this.titleStr_ = opt_title;
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 2.8 * chatango.managers.Style.getInstance().getScale());
  chatango.ui.ScrollableDialog.call(this, width, undefined, true, undefined, undefined, undefined, undefined);
  this.setResizable(false);
  this.handler = this.getHandler();
  this.showOkBtn_ = false;
  this.okBtnCopy_ = " ";
};
goog.inherits(chatango.ui.WarningDialog, chatango.ui.ScrollableDialog);
chatango.ui.WarningDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "-dialog");
  this.warningTextEl = goog.dom.createDom("div");
  dom.appendChild(content, this.warningTextEl);
  this.warningTextEl.innerHTML = this.warning_;
  this.okBtn_ = new chatango.ui.buttons.ChatangoButton(this.okBtnCopy_);
  this.handler.listen(this.okBtn_, goog.ui.Component.EventType.ACTION, this.onOKButtonClicked);
  this.okBtnWrapperEl_ = dom.createDom("div", {"class":"btn-wrap"});
  this.okBtn_.render(this.okBtnWrapperEl_);
  dom.appendChild(content, this.okBtnWrapperEl_);
  this.showOkBtn(this.showOkBtn_);
  if (this.titleStr_) {
    this.setTitle(this.titleStr_);
  } else {
    this.showTitleBarBg(false);
  }
};
chatango.ui.WarningDialog.prototype.setBodyCopy = function(copy) {
  this.warning_ = copy;
  if (this.warningTextEl) {
    this.warningTextEl.innerHTML = this.warning_;
  }
};
chatango.ui.WarningDialog.prototype.setOkBtnCopy = function(copy) {
  this.okBtnCopy_ = copy;
  if (this.okBtn_) {
    this.okBtn_.setContent(copy);
  }
};
chatango.ui.WarningDialog.prototype.showOkBtn = function(bool) {
  this.showOkBtn_ = bool;
  if (this.okBtnWrapperEl_) {
    this.okBtnWrapperEl_.style.display = bool ? "block" : "none";
  }
};
chatango.ui.WarningDialog.prototype.onOKButtonClicked = function() {
  this.setVisible(false);
};
goog.provide("chatango.ui.TopAlertDialog");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.transitions.Cubic");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.icons.ResizeIcon");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.fx.Animation");
goog.require("goog.fx.Dragger");
goog.require("goog.math.Rect");
goog.require("goog.style");
goog.require("goog.ui.Component.Error");
goog.require("goog.ui.Dialog");
goog.require("goog.userAgent");
chatango.ui.TopAlertDialog = function(opt_width, opt_height) {
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  if (!opt_width) {
    opt_width = this.vsm_.getSize().width - 2;
  }
  if (!opt_height) {
    var width = this.vsm_.getSize().width;
    var height = this.vsm_.getSize().height;
    var scale = width > height ? .4 : .2;
    opt_height = Math.round(height * scale);
  }
  chatango.ui.ScrollableDialog.call(this, opt_width, opt_height, true);
  this.setResizable(false);
};
goog.inherits(chatango.ui.TopAlertDialog, chatango.ui.ScrollableDialog);
chatango.ui.TopAlertDialog.prototype.logger = goog.debug.Logger.getLogger("chatango.ui.TopAlertDialog");
chatango.ui.TopAlertDialog.EventType = {ANIM_OUT_COMPLETE:"anim_out_complete"};
chatango.ui.TopAlertDialog.defaults = {ANIM_IN_DUR:300, SHOW_DUR:5E3, ANIM_OUT_DUR:200};
chatango.ui.TopAlertDialog.prototype.animInDur_ = chatango.ui.TopAlertDialog.defaults.ANIM_IN_DUR;
chatango.ui.TopAlertDialog.prototype.animOutDur_ = chatango.ui.TopAlertDialog.defaults.ANIM_OUT_DUR;
chatango.ui.TopAlertDialog.prototype.showDur_ = chatango.ui.TopAlertDialog.defaults.SHOW_DUR;
chatango.ui.TopAlertDialog.prototype.display = function(opt_animInDur, opt_showDur, opt_animOutDur) {
  this.animInDur_ = opt_animInDur !== undefined && opt_animInDur !== null ? opt_animInDur : chatango.ui.TopAlertDialog.defaults.ANIM_IN_DUR;
  this.showDur_ = opt_showDur !== undefined && opt_showDur !== null ? opt_showDur : chatango.ui.TopAlertDialog.defaults.SHOW_DUR;
  this.animOutDur_ = opt_animOutDur !== undefined && opt_animOutDur !== null ? opt_animOutDur : chatango.ui.TopAlertDialog.defaults.ANIM_OUT_DUR;
  this.animateIn();
};
chatango.ui.TopAlertDialog.prototype.animateIn = function() {
  if (this.isInDocument) {
    this.animateIn_();
  } else {
    this.animateInOnEnterDoc_ = true;
  }
};
chatango.ui.TopAlertDialog.prototype.animateIn_ = function() {
  this.destroyAnimations();
  this.setVisible(true);
  var el = this.getElement();
  var currentSize = goog.style.getSize(el);
  this.setVerticalPosition(-currentSize.height);
  var startPosition = goog.style.getPosition(el);
  var endY = 0;
  this.animIn_ = new goog.fx.Animation([startPosition.x, startPosition.y], [startPosition.x, endY], this.animInDur_, chatango.transitions.Cubic.easeIn);
  goog.events.listen(this.animIn_, goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
  goog.events.listen(this.animIn_, goog.fx.Animation.EventType.FINISH, this.onAnimInFinish_, false, this);
  this.animIn_.play();
};
chatango.ui.TopAlertDialog.prototype.animateOut_ = function() {
  this.destroyAnimations();
  var el = this.getElement();
  var currentSize = goog.style.getSize(el);
  var startPosition = goog.style.getPosition(el);
  var endY = -currentSize.height;
  this.animOut_ = new goog.fx.Animation([startPosition.x, startPosition.y], [startPosition.x, endY], this.animOutDur_, chatango.transitions.Cubic.easeIn);
  goog.events.listen(this.animOut_, goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
  goog.events.listen(this.animOut_, goog.fx.Animation.EventType.FINISH, this.onAnimOutFinish_, false, this);
  this.animOut_.play();
};
chatango.ui.TopAlertDialog.prototype.destroyAnimations = function() {
  if (this.animIn_) {
    goog.events.unlisten(this.animIn_, goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
    goog.events.unlisten(this.animIn_, goog.fx.Animation.EventType.FINISH, this.onAnimInFinish_, false, this);
    this.animIn_.stop();
    this.animIn_.dispose();
    this.animIn_ = null;
  }
  if (this.animOut_) {
    goog.events.unlisten(this.animOut_, goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
    goog.events.unlisten(this.animOut_, goog.fx.Animation.EventType.FINISH, this.onAnimOutFinish_, false, this);
    this.animOut_.stop();
    this.animOut_.dispose();
    this.animOut_ = null;
  }
  clearTimeout(this.animOutTimer_);
};
chatango.ui.TopAlertDialog.prototype.onAnimate_ = function(e) {
  this.setVerticalPosition(e.y);
};
chatango.ui.TopAlertDialog.prototype.onAnimInFinish_ = function(e) {
  this.setVerticalPosition(e.y);
  if (this.showDur_ != -1) {
    var self = this;
    this.animOutTimer_ = setTimeout(function() {
      self.animateOut_();
    }, this.showDur_, this);
    var el = this.getElement();
    goog.events.listen(el, goog.events.EventType.MOUSEOVER, this.onMouseOver_, false, this);
  }
};
chatango.ui.TopAlertDialog.prototype.onMouseOver_ = function(e) {
  clearTimeout(this.animOutTimer_);
  var el = this.getElement();
  goog.events.listen(el, goog.events.EventType.MOUSEOUT, this.onMouseOut_, false, this);
};
chatango.ui.TopAlertDialog.prototype.onMouseOut_ = function(e) {
  clearTimeout(this.animOutTimer_);
  var el = this.getElement();
  goog.events.unlisten(el, goog.events.EventType.MOUSEOUT, this.onMouseOut_, false, this);
  if (this.showDur_ != -1) {
    var self = this;
    this.animOutTimer_ = setTimeout(function() {
      self.animateOut_();
    }, this.showDur_, this);
  }
};
chatango.ui.TopAlertDialog.prototype.onAnimOutFinish_ = function(e) {
  this.setVerticalPosition(e.y);
  this.destroyAnimations();
  this.dispatchEvent(new goog.events.Event(chatango.ui.TopAlertDialog.EventType.ANIM_OUT_COMPLETE, this));
};
chatango.ui.TopAlertDialog.prototype.enterDocument = function() {
  goog.base(this, "enterDocument");
  if (this.animateInOnEnterDoc_) {
    this.animateIn_();
  }
};
chatango.ui.TopAlertDialog.prototype.setVerticalPosition = function(ypos) {
  goog.style.setPosition(this.getElement(), this.getElement().offsetLeft, ypos);
};
chatango.ui.TopAlertDialog.prototype.disposeInternal = function() {
  this.destroyAnimations();
  var el = this.getElement();
  if (el) {
    goog.events.unlisten(el, goog.events.EventType.MOUSEOUT, this.onMouseOut_, false, this);
  }
  chatango.ui.TopAlertDialog.superClass_.disposeInternal.call(this);
};
chatango.ui.TopAlertDialog.prototype.show_ = function() {
  if (!this.dispatchEvent(goog.ui.PopupBase.EventType.BEFORE_SHOW)) {
    return;
  }
  this.resizeBackground_();
  this.getHandler().listen(this.getDomHelper().getWindow(), goog.events.EventType.RESIZE, this.resizeBackground_);
  this.showPopupElement_(true);
  this.visible_ = true;
  this.onShow();
};
goog.provide("chatango.ui.ScrollableTextDialog");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.ScrollableDialog");
goog.require("chatango.ui.icons.ResizeIcon");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.dom.classes");
goog.require("goog.style");
chatango.ui.ScrollableTextDialog = function(text, opt_height, opt_plainText, opt_width) {
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  if (!opt_width) {
    var minWidth = 3.5 * chatango.managers.Style.getInstance().getScale();
    opt_width = Math.min(this.vsm_.getSize().width * .9, minWidth);
  }
  if (!opt_height) {
    opt_height = Math.round(this.vsm_.getSize().height * .8);
  }
  chatango.ui.ScrollableDialog.call(this, opt_width, opt_height, true);
  this.setContent(text, opt_plainText);
};
goog.inherits(chatango.ui.ScrollableTextDialog, chatango.ui.ScrollableDialog);
chatango.ui.ScrollableTextDialog.prototype.setVerticalPosition = function(ypos) {
  goog.style.setPosition(this.getElement(), this.getElement().offsetLeft, ypos);
};
chatango.ui.ScrollableTextDialog.prototype.createDom = function() {
  chatango.ui.ScrollableTextDialog.superClass_.createDom.call(this);
  goog.dom.classes.add(this.getContentElement(), "sdlg-sc");
};
chatango.ui.ScrollableTextDialog.prototype.logger = goog.debug.Logger.getLogger("chatango.ui.ScrollableTextDialog");
goog.require("goog.events.Event");
goog.provide("chatango.events.AnnouncementEvent");
chatango.events.AnnouncementEvent = function(type, opt_uid) {
  goog.base(this);
};
goog.inherits(chatango.events.AnnouncementEvent, goog.events.Event);
chatango.events.AnnouncementEvent.EventType = {FIELDS_SET:"fieldsset"};
goog.provide("goog.dom.NodeIterator");
goog.require("goog.dom.TagIterator");
goog.dom.NodeIterator = function(opt_node, opt_reversed, opt_unconstrained, opt_depth) {
  goog.dom.TagIterator.call(this, opt_node, opt_reversed, opt_unconstrained, null, opt_depth);
};
goog.inherits(goog.dom.NodeIterator, goog.dom.TagIterator);
goog.dom.NodeIterator.prototype.next = function() {
  do {
    goog.dom.NodeIterator.superClass_.next.call(this);
  } while (this.isEndTag());
  return this.node;
};
goog.provide("goog.ui.PaletteRenderer");
goog.require("goog.a11y.aria");
goog.require("goog.a11y.aria.Role");
goog.require("goog.a11y.aria.State");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.dom");
goog.require("goog.dom.NodeIterator");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.require("goog.dom.classlist");
goog.require("goog.iter");
goog.require("goog.style");
goog.require("goog.ui.ControlRenderer");
goog.require("goog.userAgent");
goog.ui.PaletteRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(goog.ui.PaletteRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.PaletteRenderer);
goog.ui.PaletteRenderer.cellId_ = 0;
goog.ui.PaletteRenderer.CSS_CLASS = goog.getCssName("goog-palette");
goog.ui.PaletteRenderer.prototype.createDom = function(palette) {
  var classNames = this.getClassNames(palette);
  var element = palette.getDomHelper().createDom(goog.dom.TagName.DIV, classNames ? classNames.join(" ") : null, this.createGrid((palette.getContent()), palette.getSize(), palette.getDomHelper()));
  goog.a11y.aria.setRole(element, goog.a11y.aria.Role.GRID);
  return element;
};
goog.ui.PaletteRenderer.prototype.createGrid = function(items, size, dom) {
  var rows = [];
  for (var row = 0, index = 0;row < size.height;row++) {
    var cells = [];
    for (var column = 0;column < size.width;column++) {
      var item = items && items[index++];
      cells.push(this.createCell(item, dom));
    }
    rows.push(this.createRow(cells, dom));
  }
  return this.createTable(rows, dom);
};
goog.ui.PaletteRenderer.prototype.createTable = function(rows, dom) {
  var table = dom.createDom(goog.dom.TagName.TABLE, goog.getCssName(this.getCssClass(), "table"), dom.createDom(goog.dom.TagName.TBODY, goog.getCssName(this.getCssClass(), "body"), rows));
  table.cellSpacing = 0;
  table.cellPadding = 0;
  return table;
};
goog.ui.PaletteRenderer.prototype.createRow = function(cells, dom) {
  var row = dom.createDom(goog.dom.TagName.TR, goog.getCssName(this.getCssClass(), "row"), cells);
  goog.a11y.aria.setRole(row, goog.a11y.aria.Role.ROW);
  return row;
};
goog.ui.PaletteRenderer.prototype.createCell = function(node, dom) {
  var cell = dom.createDom(goog.dom.TagName.TD, {"class":goog.getCssName(this.getCssClass(), "cell"), "id":goog.getCssName(this.getCssClass(), "cell-") + goog.ui.PaletteRenderer.cellId_++}, node);
  goog.a11y.aria.setRole(cell, goog.a11y.aria.Role.GRIDCELL);
  goog.a11y.aria.setState(cell, goog.a11y.aria.State.SELECTED, false);
  if (!goog.dom.getTextContent(cell) && !goog.a11y.aria.getLabel(cell)) {
    var ariaLabelForCell = this.findAriaLabelForCell_(cell);
    if (ariaLabelForCell) {
      goog.a11y.aria.setLabel(cell, ariaLabelForCell);
    }
  }
  return cell;
};
goog.ui.PaletteRenderer.prototype.findAriaLabelForCell_ = function(cell) {
  var iter = new goog.dom.NodeIterator(cell);
  var label = "";
  var node;
  while (!label && (node = goog.iter.nextOrValue(iter, null))) {
    if (node.nodeType == goog.dom.NodeType.ELEMENT) {
      label = goog.a11y.aria.getLabel((node)) || node.title;
    }
  }
  return label;
};
goog.ui.PaletteRenderer.prototype.canDecorate = function(element) {
  return false;
};
goog.ui.PaletteRenderer.prototype.decorate = function(palette, element) {
  return null;
};
goog.ui.PaletteRenderer.prototype.setContent = function(element, content) {
  var items = (content);
  if (element) {
    var tbody = goog.dom.getElementsByTagNameAndClass(goog.dom.TagName.TBODY, goog.getCssName(this.getCssClass(), "body"), element)[0];
    if (tbody) {
      var index = 0;
      goog.array.forEach(tbody.rows, function(row) {
        goog.array.forEach(row.cells, function(cell) {
          goog.dom.removeChildren(cell);
          if (items) {
            var item = items[index++];
            if (item) {
              goog.dom.appendChild(cell, item);
            }
          }
        });
      });
      if (index < items.length) {
        var cells = [];
        var dom = goog.dom.getDomHelper(element);
        var width = tbody.rows[0].cells.length;
        while (index < items.length) {
          var item = items[index++];
          cells.push(this.createCell(item, dom));
          if (cells.length == width) {
            var row = this.createRow(cells, dom);
            goog.dom.appendChild(tbody, row);
            cells.length = 0;
          }
        }
        if (cells.length > 0) {
          while (cells.length < width) {
            cells.push(this.createCell("", dom));
          }
          var row = this.createRow(cells, dom);
          goog.dom.appendChild(tbody, row);
        }
      }
    }
    goog.style.setUnselectable(element, true, goog.userAgent.GECKO);
  }
};
goog.ui.PaletteRenderer.prototype.getContainingItem = function(palette, node) {
  var root = palette.getElement();
  while (node && node.nodeType == goog.dom.NodeType.ELEMENT && node != root) {
    if (node.tagName == goog.dom.TagName.TD && goog.dom.classlist.contains((node), goog.getCssName(this.getCssClass(), "cell"))) {
      return node.firstChild;
    }
    node = node.parentNode;
  }
  return null;
};
goog.ui.PaletteRenderer.prototype.highlightCell = function(palette, node, highlight) {
  if (node) {
    var cell = this.getCellForItem(node);
    goog.asserts.assert(cell);
    goog.dom.classlist.enable(cell, goog.getCssName(this.getCssClass(), "cell-hover"), highlight);
    if (highlight) {
      goog.a11y.aria.setState(palette.getElementStrict(), goog.a11y.aria.State.ACTIVEDESCENDANT, cell.id);
    } else {
      if (cell.id == goog.a11y.aria.getState(palette.getElementStrict(), goog.a11y.aria.State.ACTIVEDESCENDANT)) {
        goog.a11y.aria.removeState(palette.getElementStrict(), goog.a11y.aria.State.ACTIVEDESCENDANT);
      }
    }
  }
};
goog.ui.PaletteRenderer.prototype.getCellForItem = function(node) {
  return(node ? node.parentNode : null);
};
goog.ui.PaletteRenderer.prototype.selectCell = function(palette, node, select) {
  if (node) {
    var cell = (node.parentNode);
    goog.dom.classlist.enable(cell, goog.getCssName(this.getCssClass(), "cell-selected"), select);
    goog.a11y.aria.setState(cell, goog.a11y.aria.State.SELECTED, select);
  }
};
goog.ui.PaletteRenderer.prototype.getCssClass = function() {
  return goog.ui.PaletteRenderer.CSS_CLASS;
};
goog.provide("goog.ui.Palette");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.math.Size");
goog.require("goog.ui.Component");
goog.require("goog.ui.Control");
goog.require("goog.ui.PaletteRenderer");
goog.require("goog.ui.SelectionModel");
goog.ui.Palette = function(items, opt_renderer, opt_domHelper) {
  goog.ui.Palette.base(this, "constructor", items, opt_renderer || goog.ui.PaletteRenderer.getInstance(), opt_domHelper);
  this.setAutoStates(goog.ui.Component.State.CHECKED | goog.ui.Component.State.SELECTED | goog.ui.Component.State.OPENED, false);
  this.currentCellControl_ = new goog.ui.Palette.CurrentCell_;
  this.currentCellControl_.setParentEventTarget(this);
  this.lastHighlightedIndex_ = -1;
};
goog.inherits(goog.ui.Palette, goog.ui.Control);
goog.tagUnsealableClass(goog.ui.Palette);
goog.ui.Palette.EventType = {AFTER_HIGHLIGHT:goog.events.getUniqueId("afterhighlight")};
goog.ui.Palette.prototype.size_ = null;
goog.ui.Palette.prototype.highlightedIndex_ = -1;
goog.ui.Palette.prototype.selectionModel_ = null;
goog.ui.Palette.prototype.disposeInternal = function() {
  goog.ui.Palette.superClass_.disposeInternal.call(this);
  if (this.selectionModel_) {
    this.selectionModel_.dispose();
    this.selectionModel_ = null;
  }
  this.size_ = null;
  this.currentCellControl_.dispose();
};
goog.ui.Palette.prototype.setContentInternal = function(content) {
  var items = (content);
  goog.ui.Palette.superClass_.setContentInternal.call(this, items);
  this.adjustSize_();
  if (this.selectionModel_) {
    this.selectionModel_.clear();
    this.selectionModel_.addItems(items);
  } else {
    this.selectionModel_ = new goog.ui.SelectionModel(items);
    this.selectionModel_.setSelectionHandler(goog.bind(this.selectItem_, this));
    this.getHandler().listen(this.selectionModel_, goog.events.EventType.SELECT, this.handleSelectionChange);
  }
  this.highlightedIndex_ = -1;
};
goog.ui.Palette.prototype.getCaption = function() {
  return "";
};
goog.ui.Palette.prototype.setCaption = function(caption) {
};
goog.ui.Palette.prototype.handleMouseOver = function(e) {
  goog.ui.Palette.superClass_.handleMouseOver.call(this, e);
  var item = this.getRenderer().getContainingItem(this, e.target);
  if (item && e.relatedTarget && goog.dom.contains(item, e.relatedTarget)) {
    return;
  }
  if (item != this.getHighlightedItem()) {
    this.setHighlightedItem(item);
  }
};
goog.ui.Palette.prototype.handleMouseDown = function(e) {
  goog.ui.Palette.superClass_.handleMouseDown.call(this, e);
  if (this.isActive()) {
    var item = this.getRenderer().getContainingItem(this, e.target);
    if (item != this.getHighlightedItem()) {
      this.setHighlightedItem(item);
    }
  }
};
goog.ui.Palette.prototype.performActionInternal = function(e) {
  var item = this.getHighlightedItem();
  if (item) {
    this.setSelectedItem(item);
    return goog.ui.Palette.base(this, "performActionInternal", e);
  }
  return false;
};
goog.ui.Palette.prototype.handleKeyEvent = function(e) {
  var items = this.getContent();
  var numItems = items ? items.length : 0;
  var numColumns = this.size_.width;
  if (numItems == 0 || !this.isEnabled()) {
    return false;
  }
  if (e.keyCode == goog.events.KeyCodes.ENTER || e.keyCode == goog.events.KeyCodes.SPACE) {
    return this.performActionInternal(e);
  }
  if (e.keyCode == goog.events.KeyCodes.HOME) {
    this.setHighlightedIndex(0);
    return true;
  } else {
    if (e.keyCode == goog.events.KeyCodes.END) {
      this.setHighlightedIndex(numItems - 1);
      return true;
    }
  }
  var highlightedIndex = this.highlightedIndex_ < 0 ? this.getSelectedIndex() : this.highlightedIndex_;
  switch(e.keyCode) {
    case goog.events.KeyCodes.LEFT:
      if (highlightedIndex == -1 || highlightedIndex == 0) {
        highlightedIndex = numItems;
      }
      this.setHighlightedIndex(highlightedIndex - 1);
      e.preventDefault();
      return true;
      break;
    case goog.events.KeyCodes.RIGHT:
      if (highlightedIndex == numItems - 1) {
        highlightedIndex = -1;
      }
      this.setHighlightedIndex(highlightedIndex + 1);
      e.preventDefault();
      return true;
      break;
    case goog.events.KeyCodes.UP:
      if (highlightedIndex == -1) {
        highlightedIndex = numItems + numColumns - 1;
      }
      if (highlightedIndex >= numColumns) {
        this.setHighlightedIndex(highlightedIndex - numColumns);
        e.preventDefault();
        return true;
      }
      break;
    case goog.events.KeyCodes.DOWN:
      if (highlightedIndex == -1) {
        highlightedIndex = -numColumns;
      }
      if (highlightedIndex < numItems - numColumns) {
        this.setHighlightedIndex(highlightedIndex + numColumns);
        e.preventDefault();
        return true;
      }
      break;
  }
  return false;
};
goog.ui.Palette.prototype.handleSelectionChange = function(e) {
};
goog.ui.Palette.prototype.getSize = function() {
  return this.size_;
};
goog.ui.Palette.prototype.setSize = function(size, opt_rows) {
  if (this.getElement()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.size_ = goog.isNumber(size) ? new goog.math.Size(size, (opt_rows)) : size;
  this.adjustSize_();
};
goog.ui.Palette.prototype.getHighlightedIndex = function() {
  return this.highlightedIndex_;
};
goog.ui.Palette.prototype.getHighlightedItem = function() {
  var items = this.getContent();
  return items && items[this.highlightedIndex_];
};
goog.ui.Palette.prototype.getHighlightedCellElement_ = function() {
  return this.getRenderer().getCellForItem(this.getHighlightedItem());
};
goog.ui.Palette.prototype.setHighlightedIndex = function(index) {
  if (index != this.highlightedIndex_) {
    this.highlightIndex_(this.highlightedIndex_, false);
    this.lastHighlightedIndex_ = this.highlightedIndex_;
    this.highlightedIndex_ = index;
    this.highlightIndex_(index, true);
    this.dispatchEvent(goog.ui.Palette.EventType.AFTER_HIGHLIGHT);
  }
};
goog.ui.Palette.prototype.setHighlightedItem = function(item) {
  var items = (this.getContent());
  this.setHighlightedIndex(items ? goog.array.indexOf(items, item) : -1);
};
goog.ui.Palette.prototype.getSelectedIndex = function() {
  return this.selectionModel_ ? this.selectionModel_.getSelectedIndex() : -1;
};
goog.ui.Palette.prototype.getSelectedItem = function() {
  return this.selectionModel_ ? (this.selectionModel_.getSelectedItem()) : null;
};
goog.ui.Palette.prototype.setSelectedIndex = function(index) {
  if (this.selectionModel_) {
    this.selectionModel_.setSelectedIndex(index);
  }
};
goog.ui.Palette.prototype.setSelectedItem = function(item) {
  if (this.selectionModel_) {
    this.selectionModel_.setSelectedItem(item);
  }
};
goog.ui.Palette.prototype.highlightIndex_ = function(index, highlight) {
  if (this.getElement()) {
    var items = this.getContent();
    if (items && index >= 0 && index < items.length) {
      var cellEl = this.getHighlightedCellElement_();
      if (this.currentCellControl_.getElement() != cellEl) {
        this.currentCellControl_.setElementInternal(cellEl);
      }
      if (this.currentCellControl_.tryHighlight(highlight)) {
        this.getRenderer().highlightCell(this, items[index], highlight);
      }
    }
  }
};
goog.ui.Palette.prototype.setHighlighted = function(highlight) {
  if (highlight && this.highlightedIndex_ == -1) {
    this.setHighlightedIndex(this.lastHighlightedIndex_ > -1 ? this.lastHighlightedIndex_ : 0);
  } else {
    if (!highlight) {
      this.setHighlightedIndex(-1);
    }
  }
  goog.ui.Palette.base(this, "setHighlighted", highlight);
};
goog.ui.Palette.prototype.selectItem_ = function(item, select) {
  if (this.getElement()) {
    this.getRenderer().selectCell(this, item, select);
  }
};
goog.ui.Palette.prototype.adjustSize_ = function() {
  var items = this.getContent();
  if (items) {
    if (this.size_ && this.size_.width) {
      var minRows = Math.ceil(items.length / this.size_.width);
      if (!goog.isNumber(this.size_.height) || this.size_.height < minRows) {
        this.size_.height = minRows;
      }
    } else {
      var length = Math.ceil(Math.sqrt(items.length));
      this.size_ = new goog.math.Size(length, length);
    }
  } else {
    this.size_ = new goog.math.Size(0, 0);
  }
};
goog.ui.Palette.CurrentCell_ = function() {
  goog.ui.Palette.CurrentCell_.base(this, "constructor", null);
  this.setDispatchTransitionEvents(goog.ui.Component.State.HOVER, true);
};
goog.inherits(goog.ui.Palette.CurrentCell_, goog.ui.Control);
goog.ui.Palette.CurrentCell_.prototype.tryHighlight = function(highlight) {
  this.setHighlighted(highlight);
  return this.isHighlighted() == highlight;
};
goog.provide("goog.ui.ColorPalette");
goog.require("goog.array");
goog.require("goog.color");
goog.require("goog.style");
goog.require("goog.ui.Palette");
goog.require("goog.ui.PaletteRenderer");
goog.ui.ColorPalette = function(opt_colors, opt_renderer, opt_domHelper) {
  this.colors_ = opt_colors || [];
  goog.ui.Palette.call(this, null, opt_renderer || goog.ui.PaletteRenderer.getInstance(), opt_domHelper);
  this.setColors(this.colors_);
};
goog.inherits(goog.ui.ColorPalette, goog.ui.Palette);
goog.tagUnsealableClass(goog.ui.ColorPalette);
goog.ui.ColorPalette.prototype.normalizedColors_ = null;
goog.ui.ColorPalette.prototype.labels_ = null;
goog.ui.ColorPalette.prototype.getColors = function() {
  return this.colors_;
};
goog.ui.ColorPalette.prototype.setColors = function(colors, opt_labels) {
  this.colors_ = colors;
  this.labels_ = opt_labels || null;
  this.normalizedColors_ = null;
  this.setContent(this.createColorNodes());
};
goog.ui.ColorPalette.prototype.getSelectedColor = function() {
  var selectedItem = (this.getSelectedItem());
  if (selectedItem) {
    var color = goog.style.getStyle(selectedItem, "background-color");
    return goog.ui.ColorPalette.parseColor_(color);
  } else {
    return null;
  }
};
goog.ui.ColorPalette.prototype.setSelectedColor = function(color) {
  var hexColor = goog.ui.ColorPalette.parseColor_(color);
  if (!this.normalizedColors_) {
    this.normalizedColors_ = goog.array.map(this.colors_, function(color) {
      return goog.ui.ColorPalette.parseColor_(color);
    });
  }
  this.setSelectedIndex(hexColor ? goog.array.indexOf(this.normalizedColors_, hexColor) : -1);
};
goog.ui.ColorPalette.prototype.createColorNodes = function() {
  return goog.array.map(this.colors_, function(color, index) {
    var swatch = this.getDomHelper().createDom("div", {"class":goog.getCssName(this.getRenderer().getCssClass(), "colorswatch"), "style":"background-color:" + color});
    if (this.labels_ && this.labels_[index]) {
      swatch.title = this.labels_[index];
    } else {
      swatch.title = color.charAt(0) == "#" ? "RGB (" + goog.color.hexToRgb(color).join(", ") + ")" : color;
    }
    return swatch;
  }, this);
};
goog.ui.ColorPalette.parseColor_ = function(color) {
  if (color) {
    try {
      return goog.color.parse(color).hex;
    } catch (ex) {
    }
  }
  return null;
};
goog.provide("chatango.events.ColorSelectEvent");
goog.require("goog.events.Event");
chatango.events.ColorSelectEvent = function(data) {
  goog.base(this, chatango.events.EventType.COLOR_SELECT);
  this.data_ = data;
};
goog.inherits(chatango.events.ColorSelectEvent, goog.events.Event);
goog.provide("chatango.ui.ColorPickerDialog");
goog.require("chatango.events.ColorSelectEvent");
goog.require("chatango.events.EventType");
goog.require("chatango.ui.ScrollableDialog");
goog.require("goog.ui.ColorPalette");
chatango.ui.ColorPickerDialog = function(color, opt_title) {
  this.color_ = color;
  chatango.ui.ScrollableDialog.call(this, undefined, undefined, true);
  this.setResizable(false);
  if (opt_title) {
    this.setTitle(opt_title);
  }
};
goog.inherits(chatango.ui.ColorPickerDialog, chatango.ui.ScrollableDialog);
chatango.ui.ColorPickerDialog.prototype.createDom = function() {
  chatango.ui.ColorPickerDialog.superClass_.createDom.call(this);
  this.showHeaderContentEl(false);
  this.showHeaderElBorder(false);
  this.showTitleBarBg(false);
  goog.style.setStyle(this.getElement(), "visibility", "hidden");
  var scrollContent = this.getContentElement();
  var content = goog.dom.createDom("div");
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "edit-dialog");
  goog.dom.append(scrollContent, content);
  this.mainColors_ = new goog.ui.ColorPalette(chatango.ui.ColorPickerDialog.MAIN_COLORS);
  this.mainColors_.setSize(9, 6);
  this.mainColors_.render(content);
  this.greys_ = new goog.ui.ColorPalette(chatango.ui.ColorPickerDialog.GREYS);
  this.greys_.setSize(9, 1);
  this.greys_.render(content);
  this.lastUsedDesc_ = goog.dom.createDom("div", {"id":"last-used-desc"});
  this.lastUsedWrap_ = goog.dom.createDom("div", {"class":"last-used-wrap"});
  this.lastUsedColors_ = new goog.ui.ColorPalette;
  this.lastUsedColors_.setSize(9, 1);
  goog.dom.appendChild(content, this.lastUsedDesc_);
  goog.dom.appendChild(content, this.lastUsedWrap_);
  this.lastUsedColors_.render(content);
  this.customWrap_ = goog.dom.createDom("div", {"id":"custom-color-wrap"});
  this.customDesc_ = goog.dom.createDom("div", {"id":"custom-color-desc"});
  this.customInput_ = goog.dom.createDom("input", {"type":"text", "id":"custom-input", "class":"col-input"});
  goog.dom.appendChild(this.customWrap_, this.customDesc_);
  goog.dom.appendChild(this.customWrap_, this.customInput_);
  goog.dom.appendChild(content, this.customWrap_);
  this.footerWrap_ = goog.dom.createDom("div", {"class":"color-dialog-footer"});
  this.displayBox_ = goog.dom.createDom("div", {"class":"color-display-box"});
  this.okButtonWrap_ = goog.dom.createDom("div", {"class":"btn-wrap"});
  this.okButton_ = new chatango.ui.buttons.ChatangoButton(" ");
  this.okButton_.render(this.okButtonWrap_);
  goog.style.setInlineBlock(this.okButtonWrap_);
  goog.style.setStyle(this.okButtonWrap_, "margin-top", "0");
  goog.dom.appendChild(this.footerWrap_, this.displayBox_);
  goog.dom.appendChild(this.footerWrap_, this.okButtonWrap_);
  goog.dom.appendChild(content, this.footerWrap_);
  goog.events.listen(this.greys_, goog.ui.Component.EventType.ACTION, this.colorSelect, false, this);
  goog.events.listen(this.mainColors_, goog.ui.Component.EventType.ACTION, this.colorSelect, false, this);
  goog.events.listen(this.lastUsedColors_, goog.ui.Component.EventType.ACTION, this.colorSelect, false, this);
  goog.events.listen(this.okButton_, goog.ui.Component.EventType.ACTION, this.okButtonClick, false, this);
  var keyHandler = new goog.events.KeyHandler(this.customInput_);
  goog.events.listen(keyHandler, goog.events.KeyHandler.EventType.KEY, this.hexPrevention, false, this);
  goog.events.listen(this.customInput_, goog.events.EventType.INPUT, this.hexResponse, false, this);
  this.updateCopy();
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 0);
};
chatango.ui.ColorPickerDialog.prototype.draw = function() {
  chatango.ui.ColorPickerDialog.superClass_.draw.call(this);
  this.lastUsedColors_.setColors(goog.net.cookies.get("chatango-last-used-colors").split(","));
  goog.style.setStyle(this.displayBox_, "background-color", "#" + this.color_);
  this.customInput_.value = this.color_.toUpperCase();
  var that = this;
  this.makeVisible();
};
chatango.ui.ColorPickerDialog.prototype.makeVisible = function() {
  goog.style.setStyle(this.getElement(), "visibility", "visible");
};
chatango.ui.ColorPickerDialog.prototype.colorSelect = function(e) {
  this.color_ = e.target.getSelectedColor().substr(1, 7);
  this.updateLastUsed(this.color_);
  this.dispatchEvent(new chatango.events.ColorSelectEvent(this.color_));
  this.greys_.setSelectedIndex(-1);
  this.mainColors_.setSelectedIndex(-1);
  this.lastUsedColors_.setSelectedIndex(-1);
  this.draw();
};
chatango.ui.ColorPickerDialog.prototype.okButtonClick = function(e) {
  this.updateLastUsed(this.color_);
  this.dispatchEvent(new chatango.events.ColorSelectEvent(this.color_));
  this.disposeInternal();
};
chatango.ui.ColorPickerDialog.prototype.updateLastUsed = function(color) {
  if (!goog.net.cookies.get("chatango-last-used-colors")) {
    goog.net.cookies.set("chatango-last-used-colors", "#" + color);
  } else {
    var lastColors = goog.net.cookies.get("chatango-last-used-colors").split(",");
    if (!goog.array.contains(lastColors, "#" + color)) {
      lastColors.unshift("#" + color);
      lastColors = lastColors.slice(0, 9);
      goog.net.cookies.set("chatango-last-used-colors", lastColors.join(","));
    }
  }
};
chatango.ui.ColorPickerDialog.prototype.hexPrevention = function(e) {
  var character = String.fromCharCode(e.charCode);
  var reg = /^[^a-fA-F0-9]+$/;
  if (e.charCode != 0 && reg.test(character)) {
    e.preventDefault();
  }
};
chatango.ui.ColorPickerDialog.prototype.hexResponse = function(e) {
  if (this.customInput_.value.match(/[^a-fA-F0-9]/) || this.customInput_.value.length > 6) {
    this.customInput_.value = this.customInput_.value.replace(/[^a-fA-F0-9]/, "").substring(0, 6);
  }
  if (this.customInput_.value.length == 6) {
    var color = "#" + this.customInput_.value;
    var event = {};
    event.target = {};
    event.target.getSelectedColor = function() {
      return color;
    };
    this.colorSelect(event);
  }
};
chatango.ui.ColorPickerDialog.GREYS = ["#000000", "#202020", "#404040", "#606060", "#808080", "#A0A0A0", "#C0C0C0", "#E0E0E0", "#ffffff"];
chatango.ui.ColorPickerDialog.COLORS = ["#ff0000", "#cc6600", "#ffbb00", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#ff00ff"];
chatango.ui.ColorPickerDialog.MAIN_COLORS = ["#ffcccc", "#ffcc99", "#ffff99", "#ffffcc", "#99ff99", "#99ffff", "#ccffff", "#ccccff", "#ffccff", "#ff6666", "#ff9966", "#ffff66", "#ffff33", "#66ff99", "#33ffff", "#66ffff", "#9999ff", "#ff99ff", "#ff0000", "#ff9900", "#ffcc66", "#ffff00", "#33ff33", "#66cccc", "#33ccff", "#6666cc", "#cc66cc", "#cc0000", "#ff6600", "#ffcc33", "#ffcc00", "#33cc00", "#00cccc", "#3366ff", "#6633ff", "#cc33cc", "#990000", "#cc6600", "#cc9933", "#999900", "#009900", "#339999", 
"#3333ff", "#6600cc", "#993399", "#660000", "#993300", "#996633", "#666600", "#006600", "#336666", "#000099", "#333399", "#663366", "#330000", "#663300", "#663333", "#333300", "#003300", "#003333", "#000066", "#330099", "#330033"];
chatango.ui.ColorPickerDialog.prototype.updateCopy = function() {
  if (!this.getContentElement()) {
    return;
  }
  var lm = chatango.managers.LanguageManager.getInstance();
  this.okButton_.setContent(lm.getString("ui", "ok"));
  this.lastUsedDesc_.innerHTML = lm.getString("ui", "last_used");
  this.customDesc_.innerHTML = lm.getString("ui", "custom");
};
goog.provide("chatango.ui.OpacityPicker");
goog.require("chatango.ui.icons.SvgUpArrowIcon");
goog.require("goog.fx.Dragger");
goog.require("goog.ui.Component");
goog.require("goog.userAgent");
chatango.ui.OpacityPicker = function(name, opt_opacity, opt_color) {
  goog.ui.Component.call(this);
  this.name_ = name;
  if (opt_opacity || opt_opacity == 0) {
    this.opacity_ = opt_opacity;
  } else {
    this.opacity_ = 100;
  }
  if (opt_color) {
    this.color_ = opt_color;
  } else {
    this.color_ = "FFFFFF";
  }
  this.fgRule_ = ".opac_pkr_fg-" + this.name_ + " { background-image: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%); }";
  this.fgRule_ = chatango.utils.cssom.setCssRule(this.fgRule_, null, this.getMainStyleSheet());
};
goog.inherits(chatango.ui.OpacityPicker, goog.ui.Component);
chatango.ui.OpacityPicker.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"opac_pkr_wrap"});
  this.bg_ = goog.dom.createDom("div", {"class":"opac_pkr_bg"});
  this.fg_ = goog.dom.createDom("div", {"class":"pointer opac_pkr_fg opac_pkr_fg-" + this.name_});
  goog.events.listen(this.fg_, goog.events.EventType.MOUSEDOWN, this.respondToInput, false, this);
  goog.events.listen(this.fg_, goog.events.EventType.TOUCHSTART, this.respondToInput, false, this);
  this.draggableArrow_ = goog.dom.createDom("div", {"class":"dragger-wrap"});
  this.arrowPlaceholder_ = goog.dom.createDom("div", {"class":"placeholder"});
  this.arrow_ = new chatango.ui.icons.SvgUpArrowIcon("#666666");
  this.dragger_ = new goog.fx.Dragger(this.draggableArrow_, null, null);
  goog.dom.appendChild(this.draggableArrow_, this.arrowPlaceholder_);
  this.arrow_.render(this.draggableArrow_);
  goog.dom.classes.add(this.arrow_.getElement(), "ui-up-arrow");
  goog.dom.appendChild(this.element_, this.draggableArrow_);
  goog.dom.appendChild(this.element_, this.bg_);
  goog.dom.appendChild(this.element_, this.fg_);
  if (goog.userAgent.IE) {
    this.arrow_.getElement().style.top = "calc(-0.55em + 1px)";
  }
  var that = this;
  setTimeout(function() {
    that.draw();
  }, 1);
};
chatango.ui.OpacityPicker.prototype.draw = function() {
  var rgb = goog.color.hexToRgb("#" + this.color_);
  var newRule = ".opac_pkr_fg-" + this.name_ + " { background-image: -webkit-linear-gradient(left, rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0) 0%, rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",1) 100%);" + "background: -moz-linear-gradient(left, rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0) 0%, rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",1) 100%); " + "background: -ms-linear-gradient(left, rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0) 0%, rgba(" + rgb[0] + "," + rgb[1] + 
  "," + rgb[2] + ",1) 100%); }";
  this.fgRule_ = chatango.utils.cssom.setCssRule(newRule, this.fgRule_, this.getMainStyleSheet());
  setTimeout(function() {
    this.setupDragger();
  }.bind(this), 0);
};
chatango.ui.OpacityPicker.prototype.setupDragger = function() {
  goog.events.unlisten(this.dragger_, goog.fx.Dragger.EventType.DRAG, this.drag, false, this);
  this.draggableArrow_.style.left = Math.round(this.opacity_ * this.bg_.offsetWidth / 100 - this.draggableArrow_.offsetWidth / 2) + "px";
  var topLimit = 1;
  var leftLimit = Math.round(0 - this.draggableArrow_.offsetWidth / 2 + 1);
  var width = this.element_.offsetWidth;
  var height = 0;
  this.dragger_.setLimits(new goog.math.Rect(leftLimit, topLimit, width, height));
  goog.events.listen(this.dragger_, goog.fx.Dragger.EventType.DRAG, this.drag, false, this);
};
chatango.ui.OpacityPicker.prototype.drag = function(e) {
  var percent = Math.round((this.draggableArrow_.offsetLeft + this.draggableArrow_.offsetWidth / 2) / this.bg_.offsetWidth * 100);
  this.opacity_ = percent;
  if (percent < 2) {
    this.opacity_ = 0;
  } else {
    if (percent > 98) {
      this.opacity_ = 100;
    }
  }
  this.dispatchEvent(chatango.ui.OpacityPicker.EventType.OPACITY_CHANGE);
};
chatango.ui.OpacityPicker.prototype.respondToInput = function(e) {
  var x = e.type === goog.events.EventType.TOUCHSTART ? e.clientX - e.target.offsetParent.offsetLeft : e.offsetX;
  this.draggableArrow_.style.left = x + "px";
  this.dragger_.startDrag(e);
  this.drag();
};
chatango.ui.OpacityPicker.prototype.setOpacity = function(val) {
  if (this.opacity_ != val) {
    this.opacity_ = val;
    this.draw();
    this.dispatchEvent(chatango.ui.OpacityPicker.EventType.OPACITY_CHANGE);
  }
};
chatango.ui.OpacityPicker.prototype.getOpacity = function() {
  return this.opacity_;
};
chatango.ui.OpacityPicker.prototype.setColor = function(color) {
  this.color_ = color;
  this.draw();
};
chatango.ui.OpacityPicker.prototype.getColor = function() {
  return this.color_;
};
chatango.ui.OpacityPicker.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  goog.dom.classes.enable(this.element_, "disabled", !enabled);
};
chatango.ui.OpacityPicker.prototype.getMainStyleSheet = function() {
  if (!this.mainStyleSheet_) {
    this.mainStyleSheet_ = chatango.utils.cssom.createNewStyleSheet();
  }
  return this.mainStyleSheet_;
};
chatango.ui.OpacityPicker.EventType = {OPACITY_CHANGE:goog.events.getUniqueId("opacity_change")};
goog.provide("chatango.ui.ColorPickerButton");
goog.require("chatango.ui.ColorPickerDialog");
goog.require("chatango.ui.OpacityPicker");
goog.require("goog.ui.Component");
chatango.ui.ColorPickerButton = function(color, opt_opacity_picker, opt_title) {
  goog.ui.Component.call(this);
  this.color_ = color;
  if (opt_opacity_picker) {
    this.opacityPicker_ = opt_opacity_picker;
    this.opacity_ = this.opacityPicker_.getOpacity();
    this.haveOpacity_ = true;
  } else {
    this.opacity_ = 100;
    this.haveOpacity_ = false;
  }
  this.updateLastUsed(this.color_);
  this.title_ = opt_title;
  this.enabled_ = true;
};
goog.inherits(chatango.ui.ColorPickerButton, goog.ui.Component);
chatango.ui.ColorPickerButton.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"color_pkr_wrap"});
  this.colorDisplayWrap_ = goog.dom.createDom("div", {"class":"color-display-wrap"});
  this.colorDisplayBg_ = goog.dom.createDom("div", {"class":"color-display-bg"});
  this.colorDisplay_ = goog.dom.createDom("div", {"class":"color-display pointer"});
  this.hexBox_ = goog.dom.createDom("input", {"type":"text", "class":"hex-box"});
  this.colorButton_ = goog.dom.createDom("div", {"class":"color-button d-arrow pointer"});
  goog.style.setInlineBlock(this.colorDisplayWrap_);
  goog.style.setInlineBlock(this.hexBox_);
  goog.style.setInlineBlock(this.colorButton_);
  goog.dom.appendChild(this.colorDisplayWrap_, this.colorDisplayBg_);
  goog.dom.appendChild(this.colorDisplayWrap_, this.colorDisplay_);
  goog.dom.appendChild(this.element_, this.colorDisplayWrap_);
  goog.dom.appendChild(this.element_, this.hexBox_);
  goog.dom.appendChild(this.element_, this.colorButton_);
  var keyHandler = new goog.events.KeyHandler(this.hexBox_);
  goog.events.listen(keyHandler, goog.events.KeyHandler.EventType.KEY, this.hexPrevention, false, this);
  goog.events.listen(this.hexBox_, goog.events.EventType.INPUT, this.hexResponse, false, this);
  goog.events.listen(this.hexBox_, goog.events.EventType.BLUR, this.leaveHexBox, false, this);
  var actionEvent = chatango.utils.userAgent.ANDROID || chatango.utils.userAgent.IOS ? goog.events.EventType.TOUCHEND : goog.events.EventType.CLICK;
  goog.events.listen(this.colorDisplayWrap_, actionEvent, this.toggleColorPicker, false, this);
  goog.events.listen(this.colorButton_, actionEvent, this.toggleColorPicker, false, this);
  if (this.haveOpacity_) {
    goog.events.listen(this.opacityPicker_, chatango.ui.OpacityPicker.EventType.OPACITY_CHANGE, function() {
      this.opacity_ = this.opacityPicker_.getOpacity();
      this.draw();
    }, false, this);
  }
  this.updateCopy();
  this.draw();
};
chatango.ui.ColorPickerButton.prototype.draw = function() {
  this.hexBox_.value = this.color_.toUpperCase();
  goog.style.setStyle(this.colorDisplay_, "background-color", "#" + this.color_);
  goog.style.setOpacity(this.colorDisplay_, this.opacity_ / 100);
  if (this.haveOpacity_) {
    this.opacityPicker_.setOpacity(this.opacity_);
    this.opacityPicker_.setColor(this.color_);
  }
};
chatango.ui.ColorPickerButton.prototype.hexPrevention = function(e) {
  var character = String.fromCharCode(e.charCode);
  var reg = /^[^a-fA-F0-9]+$/;
  if (e.charCode != 0 && reg.test(character)) {
    e.preventDefault();
  }
};
chatango.ui.ColorPickerButton.prototype.hexResponse = function(e) {
  if (!this.enabled_) {
    return;
  }
  if (this.hexBox_.value.match(/[^a-fA-F0-9]/) || this.hexBox_.value.length > 6) {
    this.hexBox_.value = this.hexBox_.value.replace(/[^a-fA-F0-9]/, "").substring(0, 6);
  }
  if (this.hexBox_.value.length == 6) {
    this.setColor(this.hexBox_.value);
    this.updateLastUsed(this.color_);
    this.dispatchEvent(chatango.ui.ColorPickerButton.EventType.COLOR_CHANGE);
  }
};
chatango.ui.ColorPickerButton.prototype.leaveHexBox = function(e) {
  if (this.hexBox_.value.length == 3) {
    var c = this.hexBox_.value;
    var hexColor = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    this.hexBox_.value = hexColor;
    this.hexResponse();
  }
};
chatango.ui.ColorPickerButton.prototype.toggleColorPicker = function(e) {
  if (!this.colorPickerDialogOpen_) {
    if (!this.enabled_) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    this.colorPickerDialogOpen_ = true;
    this.colorPickerDialog_ = new chatango.ui.ColorPickerDialog(this.color_, this.title_);
    this.dispatchEvent(chatango.ui.ColorPickerButton.EventType.COLOR_DIALOG_OPENED);
    this.colorPickerDialog_.setVisible(true);
    goog.events.listen(this.colorPickerDialog_, chatango.events.EventType.COLOR_SELECT, function(e) {
      this.setColor(e.data_);
      this.dispatchEvent(chatango.ui.ColorPickerButton.EventType.COLOR_CHANGE);
    }, false, this);
    goog.events.listen(this.colorPickerDialog_, goog.ui.Dialog.EventType.AFTER_HIDE, function() {
      this.colorPickerDialogOpen_ = false;
    }, false, this);
    goog.events.listenOnce(this.colorPickerDialog_, goog.ui.PopupBase.EventType.SHOW, this.onColorPickerOpen, false, this);
  } else {
    this.colorPickerDialog_.dispose();
  }
};
chatango.ui.ColorPickerButton.prototype.onColorPickerOpen = function(e) {
  var vsm = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  var viewSize = vsm.getSize();
  var topVal = 0;
  var offsetElem = this.colorButton_.offsetParent;
  while (offsetElem != document.body) {
    topVal = topVal + offsetElem.offsetTop;
    offsetElem = offsetElem.offsetParent;
  }
  var moveVal = viewSize.height + document.body.scrollTop - topVal - this.colorPickerDialog_.getElement().offsetHeight - 10;
  if (moveVal <= 0) {
    var offset = new goog.math.Coordinate(-5, moveVal)
  } else {
    var offset = new goog.math.Coordinate(-5, 0)
  }
  goog.positioning.positionAtAnchor(this.colorButton_, goog.positioning.Corner.TOP_RIGHT, this.colorPickerDialog_.getElement(), goog.positioning.Corner.TOP_LEFT, offset);
  var body = document.body;
  var viewRect = new goog.math.Rect(body.scrollLeft, body.scrollTop, body.scrollLeft + viewSize.width, body.scrollTop + viewSize.height);
  this.constrainDialogsToScreen(viewRect);
};
chatango.ui.ColorPickerButton.prototype.setColor = function(color) {
  this.color_ = color;
  this.draw();
};
chatango.ui.ColorPickerButton.prototype.getColor = function(color) {
  return this.color_;
};
chatango.ui.ColorPickerButton.prototype.setOpacity = function(opacity) {
  this.opacity_ = opacity;
  this.draw();
};
chatango.ui.ColorPickerButton.prototype.updateLastUsed = function(color) {
  if (!goog.net.cookies.get("chatango-last-used-colors")) {
    goog.net.cookies.set("chatango-last-used-colors", "#" + color);
  } else {
    var lastColors = goog.net.cookies.get("chatango-last-used-colors").split(",");
    if (!goog.array.contains(lastColors, "#" + color)) {
      lastColors.unshift("#" + color);
      lastColors = lastColors.slice(0, 9);
      goog.net.cookies.set("chatango-last-used-colors", lastColors.join(","));
    }
  }
};
chatango.ui.ColorPickerButton.prototype.closeDialog = function() {
  if (this.colorPickerDialogOpen_) {
    this.colorPickerDialog_.dispose();
  }
};
chatango.ui.ColorPickerButton.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.colorPickerDialog_) {
    var stage_h = opt_stageRect ? opt_stageRect.height : goog.style.getBounds(goog.dom.getDocument().body).height;
    var new_h = Math.round(stage_h * .95);
    chatango.utils.display.constrainToStage(this.colorPickerDialog_.getElement(), opt_stageRect, true);
    chatango.utils.display.keepActiveFormElementOnScreen(this.colorPickerDialog_.getElement());
  }
};
chatango.ui.ColorPickerButton.prototype.setTitle = function(title) {
  this.title_ = title;
};
chatango.ui.ColorPickerButton.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  goog.dom.classes.enable(this.element_, "disabled", !enabled);
  this.hexBox_.disabled = !enabled;
};
chatango.ui.ColorPickerButton.prototype.disposeInternal = function() {
  this.closeDialog();
};
chatango.ui.ColorPickerButton.prototype.updateCopy = function() {
  if (!this.element_) {
    return;
  }
};
chatango.ui.ColorPickerButton.EventType = {COLOR_CHANGE:goog.events.getUniqueId("color_change"), COLOR_DIALOG_OPENED:goog.events.getUniqueId("color_dialog_opened")};
goog.provide("chatango.ui.UploadMediaDialog");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.ScrollableDialog");
chatango.ui.UploadMediaDialog = function(opt_domHelper) {
  this.viewportManager_ = chatango.managers.ViewportManager.getInstance();
  var vpWidth = this.viewportManager_.getViewportSizeMonitor().getSize().width;
  var width = Math.min(vpWidth * .9, 3.5 * chatango.managers.Style.getInstance().getScale());
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.setResizable(false);
};
goog.inherits(chatango.ui.UploadMediaDialog, chatango.ui.ScrollableDialog);
chatango.ui.UploadMediaDialog.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var content = this.getContentElement();
  goog.dom.classes.add(content, "sdlg-sc");
  goog.dom.classes.add(content, "content-dialog");
  this.progressBarWrapper_ = goog.dom.createDom("div", {"style":"height: 2em;"});
  this.progressBar_ = new chatango.ui.ProgressBar;
  this.progressBar_.render(this.progressBarWrapper_);
  goog.dom.appendChild(content, this.progressBarWrapper_);
  goog.style.showElement(this.progressBar_.getElement(), false);
  this.updateCopy();
};
chatango.ui.UploadMediaDialog.prototype.updateCopy = function() {
  this.setTitle("Uploading media");
};
chatango.ui.UploadMediaDialog.prototype.error = function() {
  this.setTitle("Error uploading media");
};
chatango.ui.UploadMediaDialog.prototype.updateProgress = function(e) {
  this.uploadProgress_ = e.event_.loaded / e.event_.total;
  if (this.uploadProgress_ < 1) {
    goog.style.showElement(this.progressBar_.getElement(), true);
    this.progressBar_.update(this.uploadProgress_);
  } else {
  }
};
goog.provide("chatango.ui.ErrorDialog");
goog.require("chatango.ui.ScrollableTextDialog");
chatango.ui.ErrorDialog = function(error_message) {
  this.error_message_ = error_message;
  chatango.ui.ScrollableTextDialog.call(this, error_message, undefined, true, undefined);
  var lm = chatango.managers.LanguageManager.getInstance();
  this.setTitle(lm.getString("ui", "error"));
  var titleEl = this.getTitleElement();
  goog.dom.classes.add(titleEl, "err-dlg");
};
goog.inherits(chatango.ui.ErrorDialog, chatango.ui.ScrollableTextDialog);
chatango.ui.ErrorDialog.prototype.enterDocument = function() {
  goog.base(this, "enterDocument");
  this.closeIcon_.setIconColor("#FFFFFF");
};
goog.provide("chatango.ui.ProgressBar");
goog.require("goog.ui.Component");
chatango.ui.ProgressBar = function(opt_direction) {
  goog.ui.Component.call(this);
  this.direction_ = opt_direction ? opt_direction : chatango.ui.ProgressBar.direction.HORIZONTAL;
  this.progress_ = 0;
};
goog.inherits(chatango.ui.ProgressBar, goog.ui.Component);
chatango.ui.ProgressBar.direction = {HORIZONTAL:0, VERTICAL:1};
chatango.ui.ProgressBar.prototype.createDom = function() {
  this.element_ = goog.dom.createDom("div", {"class":"pb_bg"});
  this.fg_ = goog.dom.createDom("div", {"class":"pb_fg"});
  goog.dom.appendChild(this.element_, this.fg_);
  this.update();
};
chatango.ui.ProgressBar.prototype.update = function(opt_progress) {
  if (opt_progress !== undefined) {
    this.progress_ = opt_progress;
  }
  if (chatango.ui.ProgressBar.direction.HORIZONTAL == this.direction_) {
    var total_width = this.element_.offsetWidth;
    goog.style.setStyle(this.fg_, "width", this.progress_ * 100 + "%");
  } else {
    var total_height = this.element_.offsetHeight;
    goog.style.setStyle(this.fg_, "height", this.progress_ * 100 + "%");
  }
};
goog.require("goog.events.Event");
goog.provide("chatango.events.MessageAlertEvent");
chatango.events.MessageAlertEvent = function(type, opt_uid, opt_userType) {
  this.uid_ = opt_uid;
  this.userType_ = opt_userType;
  goog.events.Event.call(this, type);
};
goog.inherits(chatango.events.MessageAlertEvent, goog.events.Event);
chatango.events.MessageAlertEvent.ANON = "anon";
chatango.events.MessageAlertEvent.EventType = {DISABLE:"dpm", IGNORE:"i", REPLY:"r", BLOCK:"blk"};
chatango.events.MessageAlertEvent.prototype.getUid = function() {
  return this.uid_;
};
chatango.events.MessageAlertEvent.prototype.getUserType = function() {
  return this.userType_;
};
goog.provide("chatango.ui.MsgAlert");
goog.require("chatango.events.MessageAlertEvent");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.ScaleManager");
goog.require("chatango.managers.Keyboard");
goog.require("chatango.ui.TopAlertDialog");
goog.require("chatango.utils.Paths");
goog.require("goog.array");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.ui.LinkButtonRenderer");
chatango.ui.MsgAlert = function(userId, userType, message, opt_isPm, isFriend) {
  chatango.ui.TopAlertDialog.call(this);
  this.lm_ = chatango.managers.LanguageManager.getInstance();
  this.message_ = message;
  this.isPm_ = opt_isPm ? true : false;
  this.isFriend_ = isFriend;
  this.uid_ = userId;
  this.userType_ = userType;
  this.userDisplayName_ = this.userType_ == chatango.users.User.UserType.ANON ? this.lm_.getString("ui", "anon") : this.uid_;
  if (this.userType_ == chatango.users.User.UserType.SELLER) {
    this.user_ = chatango.users.UserManager.getInstance().addUser(null, this.uid_, this.userType_);
  }
};
goog.inherits(chatango.ui.MsgAlert, chatango.ui.TopAlertDialog);
chatango.ui.MsgAlert.prototype.uid_ = null;
chatango.ui.MsgAlert.prototype.user_ = null;
chatango.ui.MsgAlert.prototype.userDisplayName_ = "";
chatango.ui.MsgAlert.prototype.userType_ = null;
chatango.ui.MsgAlert.prototype.createDom = function() {
  chatango.ui.MsgAlert.superClass_.createDom.call(this);
  var scaleManager = chatango.managers.ScaleManager.getInstance();
  var isSmall = scaleManager.isBelowFullFeaturedSize();
  var dom = this.getDomHelper();
  var handler = this.getHandler();
  this.linkButtonsWrapEl_ = goog.dom.createDom("div", {"class":"fr"});
  var maxLen;
  if (isSmall) {
    maxLen = 40;
    if (scaleManager.getOrientation() == "l") {
      var msg = this.userDisplayName_ + ": " + this.message_;
      var shortMsg = msg.length > maxLen ? msg.substr(0, maxLen) + "&hellip;" : msg;
      this.titleTextEl_.innerHTML = shortMsg;
      goog.style.setStyle(this.titleTextEl_, "font-size", scaleManager.getScale() * .75 + "%");
      goog.style.setStyle(this.linkButtonsWrapEl_, "font-size", scaleManager.getScale() * .75 + "%");
      if (this.isPm_) {
        goog.dom.insertSiblingAfter(this.linkButtonsWrapEl_, this.titleTextEl_);
      }
    } else {
      var shortMsg = this.message_.length > maxLen ? this.message_.substr(0, maxLen) + "&hellip;" : this.message_;
      var alertText = this.userDisplayName_ + ": " + shortMsg;
      this.titleTextEl_.innerHTML = alertText;
      goog.style.setStyle(this.titleTextEl_, "font-size", scaleManager.getScale() + "%");
      if (this.isPm_) {
        goog.dom.append(this.getContentElement(), this.linkButtonsWrapEl_);
      }
    }
  } else {
    var content = this.getContentElement();
    goog.dom.classes.add(content, "sdlg-sc");
    goog.dom.classes.add(content, "-dialog");
    var maxLen = 140;
    var truncatedMsg = this.message_.length > maxLen ? this.message_.substr(0, maxLen) + "&hellip;" : this.message_;
    if (!this.isPm_) {
      var titleText = this.lm_.getString("msgcatcher", "private_msg");
      this.titleTextEl_.innerHTML = titleText;
      goog.style.setStyle(this.titleTextEl_, "font-size", scaleManager.getScale() + "%");
    }
    this.messageWrapEl_ = goog.dom.createDom("div", {"style":"cursor:pointer; overflow:hidden;"});
    dom.appendChild(content, this.messageWrapEl_);
    if (this.userType_ == chatango.users.User.UserType.SELLER) {
      var thumbScale = chatango.managers.Style.getInstance().getThumbScale();
      if (thumbScale > 0) {
        var size = Math.round(thumbScale * 3125) / 1E3;
        size = size * .75;
        var thumbURL = chatango.utils.Paths.getInstance().getUserImagePaths(this.user_.getSid()).thumb;
        this.thumbEl_ = goog.dom.createDom("img", {"src":thumbURL, "style":"float:left;margin-right:.3em;margin-bottom:.3em;width:" + size + "em;height:" + size + "em;"});
        goog.dom.append(this.messageWrapEl_, this.thumbEl_);
      }
    }
    this.messageEl_ = goog.dom.createDom("div");
    this.messageEl_.innerHTML = "<strong>" + this.userDisplayName_ + ":</strong> " + truncatedMsg;
    goog.dom.append(this.messageWrapEl_, this.messageEl_);
    goog.dom.append(content, this.linkButtonsWrapEl_);
    this.replyButton_ = new goog.ui.Button(this.lm_.getString("ui", "reply"), goog.ui.LinkButtonRenderer.getInstance());
    this.replyButton_.render(this.linkButtonsWrapEl_);
    var pipe = goog.dom.createDom("span", {"style":"margin:0 .4em"}, "|");
    goog.dom.append(this.linkButtonsWrapEl_, pipe);
    var ignoreCopy;
    if (this.isPm_) {
      ignoreCopy = this.lm_.getString("ui", "ignore");
    } else {
      if (this.userType_ == chatango.users.User.UserType.SELLER) {
        ignoreCopy = this.lm_.getString("ui", "ignore_user").split("*username*").join(this.userDisplayName_);
      } else {
        ignoreCopy = this.lm_.getString("ui", "ignore_user").split("*username*").join(this.lm_.getString("ui", "anons"));
      }
    }
    this.ignoreButton_ = new goog.ui.Button(ignoreCopy, goog.ui.LinkButtonRenderer.getInstance());
    this.ignoreButton_.render(this.linkButtonsWrapEl_);
    if (!this.isPm_) {
      goog.dom.append(this.linkButtonsWrapEl_, goog.dom.createDom("span", {"style":"margin:0 .4em"}, "|"));
      this.disableButton_ = new goog.ui.Button(this.lm_.getString("msgcatcher", "disable_pm"), goog.ui.LinkButtonRenderer.getInstance());
      this.disableButton_.render(this.linkButtonsWrapEl_);
    }
    handler.listen(this.ignoreButton_, goog.ui.Component.EventType.ACTION, this.onIgnore_);
    if (this.disableButton_) {
      handler.listen(this.disableButton_, goog.ui.Component.EventType.ACTION, this.onDisable_);
    }
    handler.listen(this.replyButton_, goog.ui.Component.EventType.ACTION, this.onReply_);
    handler.listen(this.messageWrapEl_, goog.events.EventType.CLICK, this.onReply_);
  }
  if (this.isPm_ && !this.isFriend_) {
    var blockStr = this.lm_.getString("pm", "block_user");
    blockStr = isSmall && scaleManager.getOrientation() == "l" ? blockStr.replace(" *user*", "") : blockStr.split("*user*").join(this.userDisplayName_);
    if (!isSmall) {
      pipe = goog.dom.createDom("span", {"style":"margin:0 .4em"}, "|");
      goog.dom.append(this.linkButtonsWrapEl_, pipe);
    }
    this.blockButton_ = new goog.ui.Button(blockStr, goog.ui.LinkButtonRenderer.getInstance());
    this.blockButton_.render(this.linkButtonsWrapEl_);
    handler.listen(this.blockButton_, goog.ui.Component.EventType.ACTION, this.onBlock_);
  }
  handler.listen(this.titleTextEl_, goog.events.EventType.CLICK, this.onReply_);
  goog.style.setStyle(this.titleTextEl_, "cursor", "pointer");
};
chatango.ui.MsgAlert.prototype.onReply_ = function(e) {
  this.dispatchEvent(new chatango.events.MessageAlertEvent(chatango.events.MessageAlertEvent.EventType.REPLY, this.uid_, this.userType_));
};
chatango.ui.MsgAlert.prototype.onIgnore_ = function(e) {
  this.dispatchEvent(new chatango.events.MessageAlertEvent(chatango.events.MessageAlertEvent.EventType.IGNORE, this.uid_, this.userType_));
};
chatango.ui.MsgAlert.prototype.onDisable_ = function(e) {
  this.dispatchEvent(new chatango.events.MessageAlertEvent(chatango.events.MessageAlertEvent.EventType.DISABLE));
};
chatango.ui.MsgAlert.prototype.onBlock_ = function(e) {
  this.dispatchEvent(new chatango.events.MessageAlertEvent(chatango.events.MessageAlertEvent.EventType.BLOCK, this.uid_, this.userType_));
};
chatango.ui.MsgAlert.prototype.animateIn_ = function() {
  this.destroyAnimations();
  this.setVisible(true);
  var el = this.getElement();
  var currentSize = goog.style.getSize(el);
  this.setVerticalPosition(-currentSize.height);
  var startPosition = goog.style.getPosition(el);
  var kb = chatango.managers.Keyboard.getInstance();
  var endY = 0;
  if (kb.isRaised() && chatango.managers.Environment.getInstance().isIOS()) {
    var el;
    if (this.isPm_) {
      var listInputs = goog.array.filter(goog.dom.getElementsByTagNameAndClass("input", "std_input"), goog.style.getVisibleRectForElement);
      var chatInputs = goog.array.filter(goog.dom.getElementsByTagNameAndClass("input", "bb"), goog.style.getVisibleRectForElement);
      el = chatInputs.length > 0 ? chatInputs[0] : listInputs[0];
    } else {
      el = goog.dom.getElementsByTagNameAndClass("input", "ubdr")[0];
    }
    endY = goog.style.getClientPosition(el).y - currentSize.height;
  }
  this.animIn_ = new goog.fx.Animation([startPosition.x, startPosition.y], [startPosition.x, endY], this.animInDur_, chatango.transitions.Cubic.easeIn);
  goog.events.listen(this.animIn_, goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
  goog.events.listen(this.animIn_, goog.fx.Animation.EventType.FINISH, this.onAnimInFinish_, false, this);
  this.animIn_.play();
};
goog.provide("chatango.strings.CommonUIStrings");
chatango.strings.CommonUIStrings = {"save":"Save", "saving":"Saving", "saved":"Saved", "ok":"OK", "no":"No", "yes":"Yes", "error":"Error", "confirm_title":"Are you sure?", "confirm":"Confirm", "cancel":"Cancel", "last_used":"Last used:", "custom":"Custom:", "ignore":"Ignore", "ignore_user":"Ignore *username*", "anon":"Anon", "anons":"anons", "reply":"Reply", "remember_fs":"User font styles are *on|off*. Do you want to remember this setting?", "add":"Add", "back":"Back", "continue":"Continue", "next":"Next", 
"username":"User name", "name":"Name", "support_pitch":"Chatango costs more to run than it makes from ads. To keep it running, growing and getting new features, please support us now!", "support_chatango":"Support Chatango", "close":"Close"};
goog.provide("chatango.modules.CommonUIModule");
goog.require("chatango.events.AnnouncementEvent");
goog.require("chatango.strings.CommonUIStrings");
goog.require("chatango.ui.Checkbox");
goog.require("chatango.ui.ColorPickerButton");
goog.require("chatango.ui.ErrorDialog");
goog.require("chatango.ui.MsgAlert");
goog.require("chatango.ui.PopupMenu");
goog.require("chatango.ui.ProgressBar");
goog.require("chatango.ui.ScrollableTextDialog");
goog.require("chatango.ui.Select");
goog.require("chatango.ui.Swipe");
goog.require("chatango.ui.TopAlertDialog");
goog.require("chatango.ui.UploadMediaDialog");
goog.require("chatango.ui.WarningDialog");
goog.require("chatango.utils.style");
goog.require("goog.module.ModuleManager");
goog.require("goog.positioning");
chatango.modules.CommonUIModule = function() {
  chatango.managers.LanguageManager.getInstance().getStringPack("ui", chatango.strings.CommonUIStrings, this.initCopy, this);
};
goog.addSingletonGetter(chatango.modules.CommonUIModule);
chatango.modules.CommonUIModule.prototype.initCopy = function(pack_id) {
};
goog.module.ModuleManager.getInstance().setLoaded("CommonUIModule");

