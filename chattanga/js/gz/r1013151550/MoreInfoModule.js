goog.provide("chatango.modules.MoreInfoModule");
goog.require("chatango.managers.Style");
goog.require("chatango.managers.ViewportManager");
goog.require("chatango.ui.ScrollableTextDialog");
goog.require("chatango.ui.buttons.ChatangoButton");
goog.require("chatango.utils.sanitize");
goog.require("goog.debug.Console");
goog.require("goog.debug.LogRecord");
goog.require("goog.debug.Logger.Level");
goog.require("goog.events");
goog.require("goog.module.ModuleManager");
goog.require("goog.net.cookies");
goog.require("goog.style");
chatango.modules.MoreInfoModule = function() {
};
goog.addSingletonGetter(chatango.modules.MoreInfoModule);
chatango.modules.MoreInfoModule.prototype.logger = goog.debug.Logger.getLogger("chatango.modules.MoreInfoModule");
chatango.modules.MoreInfoModule.prototype.openMorePopUp = function(ownersMsg, ypos) {
  var text = chatango.utils.sanitize.sanitize(ownersMsg, true);
  this.vsm_ = chatango.managers.ViewportManager.getInstance().getViewportSizeMonitor();
  if (!this.moreInfoPopup) {
    this.moreInfoPopup = new chatango.ui.ScrollableTextDialog(text, this.vsm_.getSize().height - ypos - 50, true);
    this.moreInfoPopup.setResizable(false);
    this.moreInfoPopup.setVisible(true);
    this.moreInfoPopup.showTitleBarBg(false);
    this.moreInfoPopup.setVerticalPosition(ypos);
    goog.events.listen(this.moreInfoPopup, goog.ui.Dialog.EventType.AFTER_HIDE, this.closePopup, false, this);
  }
};
chatango.modules.MoreInfoModule.prototype.closePopup = function() {
  if (this.moreInfoPopup) {
    goog.events.removeAll(this.moreInfoPopup);
    this.moreInfoPopup.dispose();
    this.moreInfoPopup = null;
  }
};
goog.module.ModuleManager.getInstance().setLoaded("MoreInfoModule");

