/*************************************
 * Imports
 *************************************/

// Library
var $                           = require("jquery");
var _                           = require("underscore");
var Backbone                    = require("backbone");
Backbone.$                      = $;
var React                       = require("react");

// Views
var AbstractPage                    = require("views/abstract-page").View;
var PhoneContactListView            = require("views/phone-contact-list").View;

// Templates
var homePageTemplate            = require("templates/home/home-page.tpl");

// Utils
var DebugUtil                   = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var HomePageView = AbstractPage.extend({
    initialize: function () {
        DebugUtil.log("HomePageView", "initialized");
        AbstractPage.prototype.initialize.apply(this, arguments);
        this.REQUEST_NEXT_CONTACTS_PAGE = "onRequestNextContactsPage";
        this.phoneContactListView = null;
    },

    remove: function () {
        DebugUtil.log("HomePageView", "remove");
        if (this.phoneContactListView)
            this.phoneContactListView.remove();
        AbstractPage.prototype.remove.apply(this, arguments);
    },

    render: function () {
        DebugUtil.log("HomePageView", "render", this.$el, homePageTemplate({
            message: "Hello world!"
        }));

        var self = this;
        
        this.$el.html(homePageTemplate({
            message: "Hello world!"
        }));

        $(document).ready(function() {
            DebugUtil.log("HomePageView", "render");

            self.phoneContactListView = new PhoneContactListView({
                el: $("#phone-contact-list"),
                emptyMessageSelector: "empty-message-default",
                collection: self.state.getLoggedInUserContactByNameCollection()
            });
            self.phoneContactListView.render();
        });
        
        AbstractPage.prototype.render.apply(this, arguments);
    },

    // Event handlers

    onPageContentScroll: function() {
        DebugUtil.log("HomePageView", "onPageContentScroll();");
        var self = this;
        var scrollWindow = self.$el.find(".page-content");
        var scrollContent = self.$el.find(".page-content-gutter");
        if (scrollWindow.scrollTop() + scrollWindow.outerHeight() >= scrollContent.outerHeight()) {
            if (!self.requestingNextContactsPage) {
                self.trigger(self.REQUEST_NEXT_CONTACTS_PAGE, {});
                self.requestingNextContactsPage = true;
            }
        }
    },

    onLoadedContactByNameCollectionPage: function(data) {
        DebugUtil.log("HomePageView", "onLoadedContactByNameCollectionPage();", data);
        this.requestingNextContactsPage = false;
    },
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = HomePageView;
