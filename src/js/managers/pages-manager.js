/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var React                   = require("react");
var HammerJs                = require("hammerjs");

// Types
var PageTransitionType      = require("managers/types/page-transition");

// Utils
var DebugUtil               = require("utils/debug").Util;

// Events
var PageEvent               = require("events/page");

/*************************************
 * Classes
 *************************************/

var PagesManager = Backbone.View.extend({
    el: $("#page-container"),

    initialize: function(options) {
        DebugUtil.log("PagesManager", "initialized");

        var self = this;

        this.currentPage = null;
        this.previousPage = null;
        this.previousPagePath = null;
        this.isFirstPageLoad = false;

        this.transitionType = options.transitionType
            ? options.transitionType : PageTransitionType.HORIZONTAL;

        $(document).ready(function(evt) {
            var hammer = new HammerJs($("#page-container")[0], {});

            hammer.on('swipeleft', function(evt) {
                DebugUtil.log("PagesManager", "swipeleft", evt);
                if (self.currentPage) {
                    self.currentPage.handleHammerSwipeLeft(evt);
                    self.currentPage.handleHammerSwipeLeftOrRight(evt);
                } 
                return true;
            });

            hammer.on('swiperight', function(evt) {
                DebugUtil.log("PagesManager", "swiperight", evt);
                if (self.currentPage) {
                    self.currentPage.handleHammerSwipeRight(evt);
                    self.currentPage.handleHammerSwipeLeftOrRight(evt);
                } 
                return true;
            });
        });
    },
    
    getLayoutType: function() {
        switch (Utils.viewMode.getViewMode()) {
            case Utils.viewMode.MOBILE:
                return "mobile";
            case Utils.viewMode.TABLET:
                return "tablet";
        }
        return "desktop";
    },

    updatePageHistoryState: function() {
        DebugUtil.log("PagesManager", "updatePageHistoryState");

        var currentPagePath = Backbone.history.getFragment().split("?")[0];

        this.transitionType = PageTransitionType.HORIZONTAL;
        this.isFirstPageLoad = this.previousPagePath === null;
        this.previousPagePath = currentPagePath;

        DebugUtil.log("PagesManager", "updatePageHistoryState", currentPagePath, this.previousPagePath);
    },

    renderPage: function(pageView) {
        DebugUtil.log("PagesManager", "renderPage", pageView);

        if (this.$el.length == 0)
            this.$el = $("#page-container");

        DebugUtil.log("PagesManager", "renderPage", pageView, this.$el, this.$el.find(".page-in"));
        
        var self = this;

        if (this.currentPage) {
            $(this.currentPage).unbind(PageEvent.ON_PAGE_READY);
        }

        $(pageView).bind(PageEvent.ON_PAGE_READY, function(data) {
            $(pageView).unbind(PageEvent.ON_PAGE_READY);
            if (self.currentPage) 
                self.currentPage.transitionOut(self.transitionType, self.backDetected);
            pageView.transitionIn(self.isFirstPageLoad, self.transitionType, self.backDetected, function() {
                self.setBackDetected(false);
            });
            self.currentPage = pageView;
            self.trigger(PageEvent.ON_PAGE_READY, data);
        });

        if (this.$el.find(".page-in").length == 0)
            this.$el.append('<div class="page-in page-in-out"></div>');

        if (this.currentPage) {
            var elOut = this.$el.find(".page-in");
            elOut.removeClass("page-in").addClass("page-out").show();
            elOut.before('<div class="page-in page-in-out"></div>');
            this.currentPage.$el = elOut;
        }

        var elIn = this.$el.find(".page-in");
        pageView.$el = elIn;
        pageView.setPageManager(this);
        pageView.prepareForTransitionIn(this.isFirstPageLoad, this.transitionType, this.backDetected);
        pageView.renderWhenReady();

        return true;
    },

    setBackDetected: function(backDetected) {
        DebugUtil.log("PagesManager", "setBackDetected", backDetected);
        this.backDetected = backDetected;
    },

    getBackDetected: function() {
        return this.backDetected;
    },

    getCurrentPage: function() {
        return this.currentPage;
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Manager = PagesManager;