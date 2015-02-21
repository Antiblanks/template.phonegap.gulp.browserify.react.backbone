/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var React                   = require("react");
var JQueryVelocity          = require("libs/jquery/velocity/velocity");
var JQuerySimpleModal       = require("libs/jquery/jquery.simplemodal.js");

// Types
var PageTransitionType      = require("managers/types/page-transition");

// Utils
var DebugUtil               = require("utils/debug").Util;
var EasingUtil              = require("utils/easing").Util;
var ButtonsUtil             = require("utils/buttons").Util;
var DateUtil                = require("utils/date").Util;

// Events
var PageEvent               = require("events/page");

// Models
var HeaderModel             = require("models/header").Model;
var FooterModel             = require("models/footer").Model;

// View
var HeaderView              = require("views/header").View;
var FooterView              = require("views/footer").View;
var FormItemView            = require("views/form-item").View;

/*************************************
 * Classes
 *************************************/

var AbstractPageView = Backbone.View.extend({
    initialize: function (options) {
        DebugUtil.log("AbstractPageView: initialize");
        var self = this;
        this.isPageVisited = false;
        this.isPageReady = false;
        this.pageReadyTimer = null;
        this.pageManager = null;
        this.state = options.state;
        this.headerView = null;
        this.footerView = null;
        this.currentSectionNumber = null;
        this.currentModalSectionNumber = null;
        this.showMessageTimer = null;
        this.PAGE_TRANSITION_DURATION_FADE = 500;
        this.PAGE_TRANSITION_DURATION_VERTICAL = 300;
        this.PAGE_TRANSITION_DURATION_HORIZONTAL = 300;
    },

    render: function () {
        DebugUtil.log("AbstractPageView: render();");
        var self = this;
        $(document).ready(function () {
            DebugUtil.log("AbstractPageView: render();", self.$el.find("#header").length, self.$el.find("#footer").length);
            var uniqueId = Math.floor(Math.random()*1000)+1000;

            // Render header
            $("#header").html("");
            $("#header").hide();
            if (self.$el.find(".page-content").attr("data-show-header") == "true") {
                var headerDiv = $("<div id='header-content-"+uniqueId+"'></div>");
                $("#header").append(headerDiv);
                self.headerModel = new HeaderModel({
                    "id": uniqueId
                });
                self.headerView = new HeaderView({
                    el: $("#header").find("#header-content-"+uniqueId),
                    model: self.headerModel
                });
                self.headerView.render();
                $("#header").show();
                if (self.$el.find(".page-content").attr("data-show-header-menu-button") == "true") {
                    self.headerView.showOpenHeaderMenuButton();
                } else {
                    self.headerView.hideOpenHeaderMenuButton();
                }
            }

            // Render footer
            $("#footer").html("");
            $("#footer").hide();
            if (self.$el.find(".page-content").attr("data-show-footer") == "true") {
                var footerDiv = $("<div id='footer-content-"+uniqueId+"'></div>");
                $("#footer").append(footerDiv);
                self.footerModel = new FooterModel({
                    "id": uniqueId
                });
                self.footerView = new FooterView({
                    el: $("#footer").find("#footer-content-"+uniqueId),
                    model: self.footerModel
                });
                self.footerView.render();
                $("#footer").show();   
            }

            // Enable page buttons
            ButtonsUtil.enablePageButtons(self.pageManager, self.$el.find(".page-content"));
        });
    },

    // Page loading logic

    renderWhenReady: function() {
        DebugUtil.log("AbstractPageView: renderWhenReady();",
            this.$el.find(".page-content").attr("data-show-header"), 
            this.$el.find(".page-content").attr("data-show-footer"));

        var self = this;
        // @todo: Add logic here to ready page and then render when ready
        // @note: If there is nothing to ready then call render & ready immediately
        this.render();
        this.pageReady();
    },

    pageReady: function() {
        DebugUtil.log("AbstractPageView: pageReady();");
        if (!this.isPageReady)
            $(this).trigger(PageEvent.ON_PAGE_READY, this);
        this.isPageReady = true;
    },

    getIsPageReady: function() {
        return this.isPageReady;
    },

    // Transition logic

    prepareForTransitionIn: function(isFirstPageLoad, transitionType, transitionBack) {
        DebugUtil.log("AbstractPageView: prepareForTransitionIn();", isFirstPageLoad, transitionType, transitionBack);
        switch (transitionType) {
            case PageTransitionType.FADE:
                this.prepareForTransitionInFade(isFirstPageLoad, transitionBack);
                break;
            case PageTransitionType.HORIZONTAL:
                this.prepareForTransitionInHorizontal(isFirstPageLoad, transitionBack);
                break;
            default:
                this.prepareForTransitionInVertical(isFirstPageLoad, transitionBack);
                break;
        }
    },

    transitionIn: function (isFirstPageLoad, transitionType, transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionIn();", isFirstPageLoad, transitionType, transitionBack, callback);
        this.transitionInStart();
        switch (transitionType) {
            case PageTransitionType.FADE:
                this.transitionInFade(isFirstPageLoad, transitionBack, callback);
                break;
            case PageTransitionType.HORIZONTAL:
                this.transitionInHorizontal(isFirstPageLoad, transitionBack, callback);
                break;
            default:
                this.transitionInVertical(isFirstPageLoad, transitionBack, callback);
                break;
        }
    },

    /**
     * transitionOutComplete();
     * Called upon page transition out start
     */
    transitionInStart: function() {
        DebugUtil.log("AbstractPageView: transitionInStart();");
        this.$el.find(".page-footer-buttons").hide();
    },

    /**
     * transitionInComplete();
     * Called when page transition in has completed
     */
    transitionInComplete: function() {
        DebugUtil.log("AbstractPageView: transitionInComplete();");
        var self = this;
        this.$el.find(".page-footer-buttons").show();
    },

    transitionOut: function (transitionType, transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionOut();", transitionType, transitionBack, callback);
        this.transitionOutStart();
        switch (transitionType) {
            case PageTransitionType.FADE:
                this.transitionOutFade(transitionBack, callback);
                break;
            case PageTransitionType.HORIZONTAL:
                this.transitionOutHorizontal(transitionBack, callback);
                break;
            default:
                this.transitionOutVertical(transitionBack, callback);
                break;
        }
    },

    /**
     * transitionOutComplete();
     * Called upon page transition out start
     */
    transitionOutStart: function() {
        DebugUtil.log("AbstractPageView: transitionOutStart();");
        this.$el.find(".page-footer-buttons").hide();
    },

    /**
     * transitionOutComplete();
     * Called when page transition out has completed
     * This is called just before the page is disposed of and can be used to destroy any page elements if required
     */
    transitionOutComplete: function() {
        DebugUtil.log("AbstractPageView: transitionOutComplete();");
        
        // Disable header
        if (this.headerView != null) {
            this.headerView.unbind();
            this.headerView.remove();
        }

        // Disable footer
        if (this.footerView != null) {
            this.footerView.unbind();
            this.footerView.remove();
        }

        // Disable page buttons
        ButtonsUtil.disablePageButtons(this.$el.find(".page-content"));

        // Clear timers
        window.clearTimeout(this.pageReadyTimer);
    },

    // Transition: PageTransitionType.HORIZONTAL

    prepareForTransitionInHorizontal: function(isFirstPageLoad, transitionBack) {
        DebugUtil.log("AbstractPageView: prepareForTransitionInHorizontal();", isFirstPageLoad, transitionBack);
        var self = this;
        var startPosLeft = transitionBack
            ? 0 - this.$el.width()
            : 0 + this.$el.width();
        if (isFirstPageLoad)
            startPosLeft = 0;
        this.$el.css({
            left: startPosLeft
        });
    },

    transitionInHorizontal: function (isFirstPageLoad, transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionInHorizontal();", isFirstPageLoad, transitionBack, callback);
        var self = this;
        this.prepareForTransitionInHorizontal(isFirstPageLoad, transitionBack);
        DebugUtil.log(
            "AbstractPageView: transitionInHorizontal(); animating from, to, duration, easing", 
            this.$el, this.$el.css("left"), 0, this.PAGE_TRANSITION_DURATION_HORIZONTAL, EasingUtil.getEasing("easeOutQuad"));
        this.$el.animate({
            left: 0
        }, {
            duration: this.PAGE_TRANSITION_DURATION_HORIZONTAL,
            easing: EasingUtil.getEasing("easeOutQuad"),
            done: function () {
                if (callback && typeof callback == "function")
                    callback();
                self.transitionInComplete();
            }
        });
    },

    transitionOutHorizontal: function (transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionOutHorizontal();", transitionBack, callback);
        var self = this;
        var endPosLeft = transitionBack
            ? 0 + this.$el.width()
            : 0 - this.$el.width();
        this.$el.css({
            left: 0
        });
        this.$el.animate({
            left: endPosLeft
        }, {
            duration: this.PAGE_TRANSITION_DURATION_HORIZONTAL,
            easing: EasingUtil.getEasing("easeOutQuad"),
            done: function () {
                if (callback && typeof callback == "function")
                    callback();
                self.transitionOutComplete();
                self.remove();
                self.unbind();
            }
        });
    },

    // Transition: PageTransitionType.VERTICAL

    prepareForTransitionInVertical: function(isFirstPageLoad, transitionBack) {
        DebugUtil.log("AbstractPageView: prepareForTransitionInVertical();", isFirstPageLoad, transitionBack);
        var self = this;
        var startPosTop = transitionBack
                ? 0 - this.$el.height()
                : 0 + this.$el.height();
        if (isFirstPageLoad)
            startPosTop = 0;
        this.$el.css({
            top: startPosTop
        });
    },

    transitionInVertical: function (isFirstPageLoad, transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionInVertical();", isFirstPageLoad, transitionBack, callback);
        var self = this;
        this.prepareForTransitionInVertical(isFirstPageLoad, transitionBack);
        this.$el.animate({
            top: 0
        }, {
            duration: this.PAGE_TRANSITION_DURATION_VERTICAL,
            easing: EasingUtil.getEasing("easeOutQuad"),
            done: function () {
                if (callback && typeof callback == "function")
                    callback();
                self.transitionInComplete();
            }
        });
    },

    transitionOutVertical: function (transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionOutVertical();", transitionBack, callback);
        var self = this;
        var endPosTop = transitionBack
                ? this.$el.height()
                : -this.$el.height();
        this.$el.animate({
            top: endPosTop
        }, {
            duration: this.PAGE_TRANSITION_DURATION_VERTICAL,
            easing: EasingUtil.getEasing("easeOutQuad"),
            done: function () {
                if (callback && typeof callback == "function")
                    callback();
                self.transitionOutComplete();
                self.remove();
                self.unbind();
            }
        });
    },

    // Transition: PageTransitionType.FADE

    prepareForTransitionInFade: function(isFirstPageLoad, transitionBack) {
        DebugUtil.log("AbstractPageView: prepareForTransitionInFade();", isFirstPageLoad, transitionBack);
        this.$el.css({opacity: 1});
    },

    transitionInFade: function (isFirstPageLoad, transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionInFade();", isFirstPageLoad, transitionBack, callback);
        this.prepareForTransitionInFade();
        if (callback && typeof callback == "function")
            callback();
        this.transitionInComplete();
    },

    transitionOutFade: function (transitionBack, callback) {
        DebugUtil.log("AbstractPageView: transitionOutFade();", transitionBack, callback);
        var self = this;
        this.$el.animate({
            opacity: 0
        }, {
            duration: this.PAGE_TRANSITION_DURATION_FADE,
            easing: EasingUtil.getEasing("easeOutQuad"),
            done: function () {
                if (callback && typeof callback == "function")
                    callback();
                self.transitionOutComplete();
                self.remove();
                self.unbind();
            }
        });
    },

    // Hammer handling

    handleHammerSwipeLeftOrRight: function(evt) {
        DebugUtil.log("AbstractPageView: handleHammerSwipeLeftOrRight();");
    },

    handleHammerSwipeLeft: function(evt) {
        DebugUtil.log("AbstractPageView: handleHammerSwipeLeft();");
    },

    handleHammerSwipeRight: function(evt) {
        DebugUtil.log("AbstractPageView: handleHammerSwipeRight();");
    },

    // Page manager reference

    setPageManager: function(pageManager) {
        this.pageManager = pageManager;
    },

    // Multiple sections 

    showSection: function(sectionNumber) {
        DebugUtil.log(
            "AbstractPageView", 
            "showSection", 
            sectionNumber,
            this.$el.find("a.previous-button"),
            this.$el.find("a.next-button"),
            this.$el.find("a.save-button"));

        var self = this;

        var sectionElement = this.$el.find(".page-section[data-section-number='"+sectionNumber+"']");
        if (sectionElement.length == 0)
            return;

        if (sectionElement.hasClass("section-first")) {
            self.$el.find("a.cancel-button").show();
            self.$el.find("a.previous-button").hide();
            self.$el.find("a.next-button").show();
            self.$el.find("a.save-button").hide();
        }

        if (!sectionElement.hasClass("section-first") && !sectionElement.hasClass("section-last")) {
            self.$el.find("a.cancel-button").hide();
            self.$el.find("a.previous-button").show();
            self.$el.find("a.next-button").show();
            self.$el.find("a.save-button").hide();
        }

        if (sectionElement.hasClass("section-last")) {
            self.$el.find("a.cancel-button").hide();
            self.$el.find("a.previous-button").show();
            self.$el.find("a.next-button").hide();
            self.$el.find("a.save-button").show();
        }

        self.$el.find("a.next-button").unbind("click");
        self.$el.find("a.next-button").click(function(evt) {
            DebugUtil.log("AbstractPageView", "nextButton.click();", sectionNumber);
            var nextSectionElement = self.$el.find(".page-section[data-section-number='"+Number(sectionNumber+1)+"']");
            if (nextSectionElement.length != 0) {
                self.showSection(Number(sectionNumber+1));
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        self.$el.find("a.previous-button").unbind("click");
        self.$el.find("a.previous-button").click(function(evt) {
            DebugUtil.log("AbstractPageView", "previousButton.click();", sectionNumber);
            var prevSectionElement = self.$el.find(".page-section[data-section-number='"+Number(sectionNumber-1)+"']");
            if (prevSectionElement.length != 0) {
                self.showSection(Number(sectionNumber-1));
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        if (this.currentSectionNumber) {
            this.$el.find(".page-section").hide();
            var transitionBack = sectionNumber < this.currentSectionNumber;
            // Hide current section
            var currentSectionElement = self.$el.find(".page-section[data-section-number='"+this.currentSectionNumber+"']");
            var hideEndPosLeft = transitionBack
                ? 0 + this.$el.width()
                : 0 - this.$el.width();
            currentSectionElement.show();
            currentSectionElement.css({
                left: 0
            });
            currentSectionElement.stop();
            currentSectionElement.animate({
                left: hideEndPosLeft
            }, {
                duration: this.PAGE_TRANSITION_DURATION_HORIZONTAL,
                easing: EasingUtil.getEasing("easeOutQuad")
            });
            // Show new section
            var showStartPosLeft = transitionBack
                ? 0 - this.$el.width()
                : 0 + this.$el.width();
            sectionElement.show();
            sectionElement.stop();
            sectionElement.css({
                left: showStartPosLeft
            });
            sectionElement.animate({
                left: 0
            }, {
                duration: this.PAGE_TRANSITION_DURATION_HORIZONTAL,
                easing: EasingUtil.getEasing("easeOutQuad")
            });
        } else {
            this.$el.find(".page-section").hide();
            sectionElement.show();
        }

        this.currentSectionNumber = sectionNumber;
    },

    // Message handling

    showMessage: function(messageContainerSelector, messageSelector, message, closeDelay) {
        DebugUtil.log("AbstractPageView", "showValidationError", messageContainerSelector, messageSelector, message);
        var messageContainer = $(messageContainerSelector);
        if (messageContainer.length == 0)
            return false;
        messageContainer.find("span").hide();
        messageContainer.find("span."+messageSelector).show();
        messageContainer.find("span."+messageSelector+" span").show();
        if (message)
            messageContainer.find("span."+messageSelector).text(message);
        messageContainer.removeClass("closed").addClass("open");
        if (isNaN(closeDelay))
            closeDelay = 3000;
        if (this.showMessageTimer)
            window.clearTimeout(this.showMessageTimer);
        this.showMessageTimer = window.setTimeout(function() {
            messageContainer.removeClass("open").addClass("closed");
        }, closeDelay);
        return true;
    },

    // Modal

    closeModal: function() {
        $.modal.close();
    },

    // Modal multiple sections 

    closeMultipleSectionModal: function() {
        this.currentModalSectionNumber = null;
        this.closeModal();
    },

    showModalSection: function(modalElement, sectionNumber) {
        DebugUtil.log(
            "AbstractPageView", 
            "showModalSection", 
            sectionNumber,
            modalElement.find("a.previous-button"),
            modalElement.find("a.next-button"),
            modalElement.find("a.done-button"));

        var self = this;

        var sectionElement = modalElement.find(".modal-section[data-section-number='"+sectionNumber+"']");
        if (sectionElement.length == 0)
            return;

        DebugUtil.log("AbstractPageView", "showModalSection", sectionElement);

        if (sectionElement.hasClass("section-first")) {
            modalElement.find("a.cancel-button").show();
            modalElement.find("a.previous-button").hide();
            modalElement.find("a.next-button").show();
            modalElement.find("a.done-button").hide();
        }

        if (!sectionElement.hasClass("section-first") && !sectionElement.hasClass("section-last")) {
            modalElement.find("a.cancel-button").hide();
            modalElement.find("a.previous-button").show();
            modalElement.find("a.next-button").show();
            modalElement.find("a.done-button").hide();
        }

        if (sectionElement.hasClass("section-last")) {
            modalElement.find("a.cancel-button").hide();
            modalElement.find("a.previous-button").show();
            modalElement.find("a.next-button").hide();
            modalElement.find("a.done-button").show();
        }

        modalElement.find("a.next-button").unbind("click");
        modalElement.find("a.next-button").click(function(evt) {
            DebugUtil.log("AbstractPageView", "nextButton.click();", sectionNumber);
            var nextSectionElement = modalElement.find(".modal-section[data-section-number='"+Number(sectionNumber+1)+"']");
            if (nextSectionElement.length != 0) {
                self.showModalSection(modalElement, Number(sectionNumber+1));
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        modalElement.find("a.previous-button").unbind("click");
        modalElement.find("a.previous-button").click(function(evt) {
            DebugUtil.log("AbstractPageView", "previousButton.click();", sectionNumber);
            var prevSectionElement = modalElement.find(".modal-section[data-section-number='"+Number(sectionNumber-1)+"']");
            if (prevSectionElement.length != 0) {
                self.showModalSection(modalElement, Number(sectionNumber-1));
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        if (this.currentModalSectionNumber) {
            modalElement.find(".modal-section").hide();
            // Hide current section
            var currentSectionElement = modalElement.find(".modal-section[data-section-number='"+this.currentModalSectionNumber+"']");
            currentSectionElement.show();
            currentSectionElement.css({"opacity": 1});
            currentSectionElement.stop();
            currentSectionElement.animate({
                opacity: 0
            }, {
                duration: 0.5,
                easing: EasingUtil.getEasing("easeOutQuad"),
                done: function() {
                    currentSectionElement.hide();
                }
            });
            // Show new section
            sectionElement.show();
            sectionElement.css({"opacity": 0});
            sectionElement.stop();
            sectionElement.animate({
                opacity: 1
            }, {
                duration: 0.5,
                easing: EasingUtil.getEasing("easeOutQuad")
            });
        } else {
            modalElement.find(".modal-section").hide();
            sectionElement.show();
            sectionElement.css({"opacity": 1});
        }

        this.currentModalSectionNumber = sectionNumber;
    },

    // Modal: Delete gift group confirmation

    openDeleteGiftGroupConfirmationModal: function(deleteCallback) {
        var self = this;
        $(".delete-gift-group-confirmation-modal").modal();

        // Setup close button
        $(".delete-gift-group-confirmation-modal").find(".close-button").unbind("click");
        $(".delete-gift-group-confirmation-modal").find(".close-button").click(function(evt) {
            self.closeDeleteGiftGroupConfirmationModal();
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        // Setup confirm button
        $(".delete-gift-group-confirmation-modal").find(".confirm-button").unbind("click");
        $(".delete-gift-group-confirmation-modal").find(".confirm-button").click(function(evt) {
            self.closeDeleteGiftGroupConfirmationModal();
            if (typeof deleteCallback === "function")
                deleteCallback();
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
    },

    closeDeleteGiftGroupConfirmationModal: function() {
        this.closeModal();
    },

    // Modal: Add friend birthday

    openAddFriendBirthdayModal: function(addFriendBirthdayObject, addFriendBirthdayCallback) {
        DebugUtil.log("AbstractPageView", "openAddFriendBirthdayModal();", addFriendBirthdayObject);

        if (!addFriendBirthdayObject || 
            !addFriendBirthdayObject["friend_first_name"] ||
            !addFriendBirthdayObject["friend_user_id"]) {
            return;
        }

        var friendBirthdayFormItem = new FormItemView({
            el: $(".add-friend-birthday-modal .form-item-friend-date-of-birth")
        });

        var self = this;
        $(".add-friend-birthday-modal").modal();
        $(".add-friend-birthday-modal").find(".friend-first-name").text(addFriendBirthdayObject["friend_first_name"]);

        // Setup close button
        $(".add-friend-birthday-modal").find(".close-button").unbind("click");
        $(".add-friend-birthday-modal").find(".close-button").click(function(evt) {
            self.closeAddFriendBirthdayModal();
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        // Setup save button
        $(".add-friend-birthday-modal").find(".save-button").unbind("click");
        $(".add-friend-birthday-modal").find(".save-button").click(function(evt) {
            DebugUtil.log("AbstractPageView", "addFriendBirthdayModal.saveButtonClick();", friendBirthdayFormItem.getValue());
            if (!String(friendBirthdayFormItem.getValue()).match(DateUtil.DATE_REGEX_DDMMYYYY)) {
                friendBirthdayFormItem.showFormItemError();
                return false;
            }
            addFriendBirthdayObject["friend_date_of_birth"] = DateUtil.getDateTimeStringFromUKBirthdayString(
                friendBirthdayFormItem.getValue())
            self.closeAddFriendBirthdayModal();
            self.openAddFriendBirthdayConfirmationModal(addFriendBirthdayObject, addFriendBirthdayCallback);
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
    },

    closeAddFriendBirthdayModal: function() {
        $(".add-friend-birthday-modal").find(".close-button").unbind("click");
        $(".add-friend-birthday-modal").find(".save-button").unbind("click");
        this.closeModal();
    },

    openAddFriendBirthdayConfirmationModal: function(addFriendBirthdayObject, addFriendBirthdayCallback) {
        DebugUtil.log("AbstractPageView", "openAddFriendBirthdayConfirmationModal();", addFriendBirthdayObject);

        if (!addFriendBirthdayObject || 
            !addFriendBirthdayObject["friend_first_name"] ||
            !addFriendBirthdayObject["friend_user_id"]) {
            return;
        }

        var self = this;
        $(".add-friend-birthday-confirmation-modal").modal();
        $(".add-friend-birthday-confirmation-modal").find(".friend-first-name").text(addFriendBirthdayObject["friend_first_name"]);
        var friendDateOfBirth = DateUtil.getHumanDateStringFromDateTimeString(
            addFriendBirthdayObject["friend_date_of_birth"]);
        $(".add-friend-birthday-confirmation-modal").find(".friend-date-of-birth").text(friendDateOfBirth);

        // Setup close button
        $(".add-friend-birthday-confirmation-modal").find(".close-button").unbind("click");
        $(".add-friend-birthday-confirmation-modal").find(".close-button").click(function(evt) {
            self.closeAddFriendBirthdayConfirmationModal();
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });

        // Setup save button
        $(".add-friend-birthday-confirmation-modal").find(".save-button").unbind("click");
        $(".add-friend-birthday-confirmation-modal").find(".save-button").click(function(evt) {
            DebugUtil.log("AbstractPageView", "addFriendBirthdayConfirmationModal.saveButtonClick();", addFriendBirthdayObject);
            if (typeof addFriendBirthdayCallback == "function")
                addFriendBirthdayCallback(addFriendBirthdayObject);
            self.closeAddFriendBirthdayConfirmationModal();
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
    },

    closeAddFriendBirthdayConfirmationModal: function() {
        $(".add-friend-birthday-confirmation-modal").find(".close-button").unbind("click");
        $(".add-friend-birthday-confirmation-modal").find(".save-button").unbind("click");
        this.closeModal();
    },

    // Help hints

    showHelpHints: function() {
        var self = this;
        this.$el.find(".help-hint").show();
        this.$el.find(".help-hint").stop();
        this.$el.find(".help-hint").css({"opacity": 0});
        this.$el.find(".help-hint").animate({"opacity": 1}, {"duration": 0.5});
        this.$el.find(".help-hint").unbind("click");
        this.$el.find(".help-hint").click(function(evt) {
            self.hideHelpHints($(this));
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        });
    },

    hideHelpHints: function(hintOrHints) {
        if (hintOrHints.length == 0)
            return;
        var self = this;
        hintOrHints.unbind("click");
        hintOrHints.show();
        hintOrHints.stop();
        hintOrHints.animate({
            opacity: 0
        }, {
            duration: 0.5,
            done: function() {
                hintOrHints.hide();
            }
        });
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = AbstractPageView;
