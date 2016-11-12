goog.provide("chatango.group.VideoPlayerView");
goog.require("chatango.ui.ScrollableDialog");
goog.require("goog.fx.Dragger");
goog.require("goog.events");
chatango.group.VideoPlayerView = function(id, startTime, width, opt_domHelper) {
  this.videoID_ = id;
  this.startTime_ = startTime;
  var autoSize = true;
  chatango.ui.ScrollableDialog.call(this, width, undefined, autoSize, undefined, undefined, undefined, opt_domHelper);
  this.setHasTitleCloseButton(true);
  this.setResizable(true, "#FFFFFF");
};
goog.inherits(chatango.group.VideoPlayerView, chatango.ui.ScrollableDialog);
chatango.group.VideoPlayerView.prototype.createDom = function() {
  chatango.ui.ScrollableDialog.prototype.createDom.call(this);
  var dom = this.getDomHelper();
  var scrollContent = this.getContentElement();
  var videoWrapper = goog.dom.createDom("div", {"class":"videowrapper"});
  var src = "//www.youtube.com/embed/" + this.videoID_ + "?wmode=opaque&autoplay=1&modestbranding=1&rel=0&showinfo=1";
  if (this.startTime_) {
    src += "&start=" + this.startTime_;
  }
  this.iframe_ = goog.dom.createDom("iframe", {"src":src, "frameborder":"0", "allowfullscreen":"true", "wmode":"opaque"});
  this.videoOverlay_ = goog.dom.createDom("div", {"class":"vidoverlay", "style":"pointer-events: none;"});
  goog.dom.appendChild(videoWrapper, this.iframe_);
  goog.dom.appendChild(videoWrapper, this.videoOverlay_);
  goog.dom.appendChild(scrollContent, videoWrapper);
  this.getTitleCloseElement().className = "youtube-title-close";
};
chatango.group.VideoPlayerView.prototype.enterDocument = function() {
  goog.base(this, "enterDocument");
  goog.events.listen(this.getResizeDragger(), goog.fx.Dragger.EventType.START, this.enableOverlay_, false, this);
  goog.events.listen(this.dragger_, goog.fx.Dragger.EventType.START, this.enableOverlay_, false, this);
  goog.events.listen(this.getResizeDragger(), goog.fx.Dragger.EventType.END, this.disableOverlay_, false, this);
  goog.events.listen(this.dragger_, goog.fx.Dragger.EventType.END, this.disableOverlay_, false, this);
};
chatango.group.VideoPlayerView.prototype.disableOverlay_ = function(e) {
  this.videoOverlay_.style["pointer-events"] = "none";
};
chatango.group.VideoPlayerView.prototype.enableOverlay_ = function(e) {
  this.videoOverlay_.style["pointer-events"] = "auto";
};
chatango.group.VideoPlayerView.prototype.setHidden = function() {
  this.getElement().style["visibility"] = "hidden";
};
chatango.group.VideoPlayerView.prototype.setUnhidden = function() {
  this.getElement().style["visibility"] = "visible";
};
chatango.group.VideoPlayerView.prototype.disposeInternal = function() {
  this.videoOverlay_ = null;
  if (this.getResizeDragger()) {
    goog.events.unlisten(this.getResizeDragger(), goog.fx.Dragger.EventType.START, this.enableOverlay_, false, this);
    goog.events.unlisten(this.getResizeDragger(), goog.fx.Dragger.EventType.END, this.disableOverlay_, false, this);
  }
  if (this.iframe_) {
    this.iframe_.src = null;
    this.iframe_ = null;
  }
  chatango.group.VideoPlayerView.superClass_.disposeInternal.call(this);
};
goog.provide("chatango.modules.VideoModule");
goog.require("chatango.group.VideoPlayerView");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.managers.Environment");
goog.require("chatango.managers.Style");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.module.ModuleManager");
goog.require("goog.style");
chatango.modules.VideoModule = function() {
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
};
chatango.modules.VideoModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.VideoModule");
chatango.modules.VideoModule.prototype.openVideoPopup = function(id, startTime) {
  this.closeVideoPopup();
  if (chatango.DEBUG) {
    this.logger.info("Video Module openVideoPopup");
  }
  var width = Math.min(Math.round(this.vsm_.getSize().width * .98), 420);
  this.video_popup_ = new chatango.group.VideoPlayerView(id, startTime, width);
  this.video_popup_.setVisible(true);
  this.constrainDialogsToScreen();
  goog.events.listen(this.video_popup_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onVideoPopUpClosed, false, this);
};
chatango.modules.VideoModule.prototype.closeVideoPopup = function() {
  if (this.video_popup_) {
    goog.events.removeAll(this.video_popup_);
    this.video_popup_.dispose();
    this.video_popup_ = null;
  }
};
chatango.modules.VideoModule.prototype.onVideoPopUpClosed = function() {
  goog.events.unlisten(this.video_popup_, goog.ui.Dialog.EventType.AFTER_HIDE, this.onVideoPopUpClosed);
  goog.events.unlisten(this.vsm_, goog.events.EventType.RESIZE, this.onResize_, false, this);
  this.video_popup_ = null;
};
chatango.modules.VideoModule.prototype.constrainDialogsToScreen = function(opt_stageRect) {
  if (this.video_popup_) {
    if (opt_stageRect) {
      currWidth = opt_stageRect.width;
      currHeight = opt_stageRect.height;
    } else {
      currWidth = this.vsm_.getSize().width;
      currHeight = this.vsm_.getSize().height;
    }
    var dialogSize = goog.style.getSize(this.video_popup_.getElement());
    var width = Math.min(Math.round(currWidth * .98), 420);
    var headerHeight = goog.style.getSize(this.video_popup_.getHeaderContentElement()).height;
    var maxHeight = Math.round(currHeight * .8);
    var maxWidth = Math.round((maxHeight - headerHeight) * 16 / 9);
    width = Math.min(width, maxWidth);
    this.video_popup_.setWidth(width);
    dialogSize = goog.style.getSize(this.video_popup_.getElement());
    if (chatango.managers.Style.getInstance().isFullSizeGroup() && !chatango.managers.Environment.getInstance().isMobile()) {
      var left_pos = Math.round((currWidth - width) / 2);
      var top_pos = Math.round((currHeight - (width * 9 / 16 + headerHeight)) / 3);
    } else {
      var left_pos = Math.max(currWidth - 5 - dialogSize.width, Math.round(.01 * currWidth));
      var top_pos = 5;
    }
    goog.style.setPosition(this.video_popup_.getElement(), left_pos, top_pos);
  }
};
chatango.modules.VideoModule.prototype.hideDialog = function() {
  if (this.video_popup_) {
    this.video_popup_.setHidden();
  }
};
chatango.modules.VideoModule.prototype.showDialog = function() {
  if (this.video_popup_) {
    this.video_popup_.setUnhidden();
  }
};
chatango.modules.VideoModule.prototype.video_popup_ = null;
goog.module.ModuleManager.getInstance().setLoaded("VideoModule");

