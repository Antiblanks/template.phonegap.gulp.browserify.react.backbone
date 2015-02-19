/*************************************
 * Imports
 *************************************/

// Library
var $                               = require("jquery");
var _                               = require("underscore");
var Backbone                        = require("backbone");
Backbone.$                          = $;
var React                           = require("react");

// Utils
var DebugUtil                       = require("utils/debug").Util; 

// Templates
var phoneContactListTemplate        = require("templates/phone-contact-list.tpl");

/*************************************
 * Classes
 *************************************/

var PhoneContactListView = Backbone.View.extend({
    initialize: function (options) {
        DebugUtil.log("PhoneContactListView", "initialized", options);

        var self = this;
        this.collection = options.collection;
        this.selectable = options.selectable;
        this.canSelectOnlyNItems = options.canSelectOnlyNItems;
        this.maxItemsReachedDeselectLast = options.maxItemsReachedDeselectLast;
        this.emptyMessageSelector = options.emptyMessageSelector 
            ? options.emptyMessageSelector 
            : "empty-message-default";
        this.cannotDeselect = options.cannotDeselect;
        this.LIST_ITEM_SELECTED = "onListItemSelected";
        this.LIST_ITEM_DESELECTED = "onListItemDeselected";
        this.LIST_ITEM_CANNOT_DESELECT = "onListItemCannotDeselect";
        this.LIST_ITEM_SELECTION_MAX_REACHED = "onListItemSelectionMaxReached";

        // Listen to events
        this.listenTo(this.collection, "add remove change reset", function() {
            self.render();
        });
    },

    render: function () {
        DebugUtil.log("PhoneContactListView", "render", this.collection);

        var self = this;
        this.$el.html(phoneContactListTemplate({
            emptyMessageSelector: this.emptyMessageSelector,
            collection: this.collection
        }));

        $(document).ready(function(evt) {
            self.$el.find("ul").removeClass("selectable");
            if (self.selectable) {
                self.$el.find("ul").addClass("selectable");
                // Setup contact button
                self.$el.find("a.contact-button").unbind("click");
                self.$el.find("a.contact-button").click(function(evt) {
                    DebugUtil.log("PhoneContactListView", "contactButton.click();", $(this).closest("li").hasClass("selected"));
                    if ($(this).closest("li").hasClass("selected")) {
                        if (self.cannotDeselect) {
                            self.trigger(self.LIST_ITEM_CANNOT_DESELECT, self.getUserObjectFromListItem($(this).closest("li")));
                            return false;
                        }
                        $(this).closest("li").removeClass("selected");
                        self.trigger(self.LIST_ITEM_DESELECTED, self.getUserObjectFromListItem($(this).closest("li")));
                    } else {
                        if (self.canSelectOnlyNItems) {
                            var selectedItems = self.$el.find("ul li.selected");
                            if (selectedItems.length >= self.canSelectOnlyNItems) {
                                if (self.canSelectOnlyNItems == 1 && self.maxItemsReachedDeselectLast) {
                                    $.each(self.$el.find("ul li.selected"), function(itemIndex, itemShown) {
                                        $(itemShown).removeClass("selected");
                                        self.trigger(self.LIST_ITEM_DESELECTED, self.getUserObjectFromListItem($(itemShown)));
                                    });
                                } else {
                                    self.trigger(self.LIST_ITEM_SELECTION_MAX_REACHED, {});
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    return false;
                                }
                            }
                        }
                        $(this).closest("li").addClass("selected");
                        self.trigger(self.LIST_ITEM_SELECTED, self.getUserObjectFromListItem($(this).closest("li")));
                    }
                    evt.stopPropagation();
                    evt.preventDefault();
                    return false;
                });
            }
        });
    },

    getUserObjectFromListItem: function(listItem) {
        var userObject = {
            "cid": $(listItem).attr("data-user-cid"),
            "full_name": $(listItem).attr("data-user-full-name"),
            "first_name": $(listItem).attr("data-user-first-name"),
            "last_name": $(listItem).attr("data-user-last-name"),
            "email": $(listItem).attr("data-user-email"),
            "phone": $(listItem).attr("data-user-phone"),
            "date_of_birth": $(listItem).attr("data-user-date-of-birth")
        };

        if ($(listItem).attr("data-user-id") && String($(listItem).attr("data-user-id")) !== "")
            userObject["id"] = parseInt($(listItem).attr("data-user-id"));

        return userObject;
    },

    setCannotDeselect: function(cannotDeselect) {
        this.cannotDeselect = cannotDeselect;
    },

    selectListItemsByCids: function(cids) {
        DebugUtil.log("PhoneContactListView", "selectListItemsByCids();", cids);
        this.$el.find("li.selected").removeClass("selected");
        var self = this;
        _.each(cids, function(cid) {
            self.$el.find("li[data-user-cid='"+cid+"']").addClass("selected");
        });
    },

    selectListItemByCid: function(cid) {
        DebugUtil.log("PhoneContactListView", "selectListItemByCid();", cid);
        this.$el.find("li[data-user-cid='"+cid+"']").addClass("selected");
    },

    deselectListItemByCid: function(cid) {
        DebugUtil.log("PhoneContactListView", "deselectListItemByCid();", cid);
        this.$el.find("li[data-user-cid='"+cid+"']").removeClass("selected");
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = PhoneContactListView;
