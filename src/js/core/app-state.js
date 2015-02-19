/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;

// Utils
var DebugUtil               = require("utils/debug").Util;
var DateUtil               	= require("utils/date").Util;

// Models
var UserCollection			= require("collections/user").Collection;
var UserModel 				= require("models/user").Model;

// Events
var UsersContactEvent 		= require("events/users-contact");

// Config
var GlobalConfig 			= require("config/global");

/*************************************
 * Classes
 *************************************/

var AppState = Backbone.Model.extend({
    initialize: function() {
    	var self = this;

    	this.loggedInUserContactCollection = new UserCollection();
		this.loadedLoggedInUserContactCollection = false;
		this.loggedInUserContactByNameCollection = new UserCollection();
		this.loadedLoggedInUserContactByNameCollectionPage = 0;
		this.isRunningInCordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
		this.routeHistory = [];

		if (this.isRunningInCordova) {
			// Load the users friends
	        document.addEventListener("deviceready", function () {
	            self.loadLoggedInUserContactCollection();
	        }, false);
		} else {
			self.loadLoggedInUserContactCollection();
		}
    },

    // Routing

    addRouteHistoryItem: function(routeHistoryItem) {
		this.routeHistory.push(routeHistoryItem);
	},

	getRouteHistory: function() {
		return this.routeHistory;
	},

	getCurrentItemInRouteHistory: function() {
		return this.routeHistory[this.routeHistory.length-1];
	},

	getPreviousItemInRouteHistory: function() {
		return this.routeHistory[this.routeHistory.length-2];
	},

    // Cordova

    getIsRunningInCordova: function() {
    	return this.isRunningInCordova;
    },

    // User
	setLoggedInUsersSession: function(usersSession) {
		DebugUtil.log("AppState", "setLoggedInUsersSession();", usersSession);
		this.loggedInUsersSession = usersSession;
	},

	getLoggedInUsersSession: function() {
		DebugUtil.log("AppState", "getLoggedInUsersSession();", this.loggedInUsersSession); 
		return this.loggedInUsersSession;
	},

	getLoggedInUsersSessionId: function() {
		DebugUtil.log("AppState", "getLoggedInUsersSessionId();", this.loggedInUsersSession); 
		if (!this.loggedInUsersSession)
			return null;
		return this.loggedInUsersSession.get("session_id");
	},

	getLoggedInUser: function() {
		DebugUtil.log("AppState", "getLoggedInUser();", this.loggedInUsersSession); 
		if (!this.loggedInUsersSession)
			return null;
		return this.loggedInUsersSession.get("user");
	},

	getLoggedInUserId: function() {
		DebugUtil.log("AppState", "getLoggedInUserId();", this.loggedInUsersSession); 
		if (!this.loggedInUsersSession || !this.loggedInUsersSession.get("user"))
			return null;
		return this.loggedInUsersSession.get("user").get("id");
	},

	// Contacts by name

	loadLoggedInUserContactCollection: function() {
		DebugUtil.log("AppState", "loadLoggedInUserContactCollection();");
		var self = this;
		if (this.loadedLoggedInUserContactCollection)
			return;

		function onFindContactsSuccess(contacts) {
			DebugUtil.log("AppState", "loadLoggedInUserContactCollection.onFindContactsSuccess();", contacts);
			self.loadedLoggedInUserContactCollection = true;
			var contactUsers = [];
			for (var i=0; i<contacts.length; i++) {
				var contactUser = {};
				var contactDisplayNameParts = contacts[i].displayName.split(" ");
				contactUser["first_name"] = contactDisplayNameParts[0] ? contactDisplayNameParts[0] : "";
				contactDisplayNameParts.shift();
				contactUser["last_name"] = contactDisplayNameParts.length > 0 ? contactDisplayNameParts.join(" ") : "";
				contactUser["full_name"] = contactUser["first_name"] + " " + contactUser["last_name"];
				contactUser["gender"] = "u";
				
				// Add date of birth
				if (contacts[i].birthday) {
					contactUser["date_of_birth"] = DateUtil.getDateTimeStringFromDate(contacts[i].birthday);
				} else {
					contactUser["date_of_birth"] = DateUtil.DEFAULT_DATETIME_STRING;
				}

				// Add email address
				if (contacts[i].emails && contacts[i].emails.length > 0) {
					var contactUserEmail = contacts[i].emails[0].value;
					for (var j=0; j<contacts[i].emails.length; j++) {
						if (contacts[i].emails[j].pref) {
							contactUserEmail = contacts[i].emails[j].value;
							break;
						}
					}
					contactUser["email"] = contactUserEmail;					
				} else {
					contactUser["email"] = null;
				}

				// Add phone numbers
				if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length > 0) {
					var contactUserPhoneNumber = null;
					for (var j=0; j<contacts[i].phoneNumbers.length; j++) {
						// @todo: Support more numbers other than just UK
						var cleanPhoneNumber = contacts[i].phoneNumbers[j].value;
						cleanPhoneNumber = cleanPhoneNumber.replace(/\s/g, "");
						cleanPhoneNumber = cleanPhoneNumber.replace(/\(/g, "");
						cleanPhoneNumber = cleanPhoneNumber.replace(/\)/g, "");
						cleanPhoneNumber = cleanPhoneNumber.replace('+44', "0");
						if (cleanPhoneNumber.indexOf('0044') == 0)
							cleanPhoneNumber = cleanPhoneNumber.replace("0044", "0");
						if (cleanPhoneNumber.indexOf('007') == 0)
							cleanPhoneNumber = cleanPhoneNumber.replace("007", "07");
						if (GlobalConfig.cleanPhoneNumberUKRegEx.test(cleanPhoneNumber)) {
							contactUserPhoneNumber = cleanPhoneNumber;
							contactUserPhoneNumber = contactUserPhoneNumber.replace("07", "00447");
							if (contacts[i].phoneNumbers[j].pref) {
								break;
							}
						}
					}
					contactUser["phone"] = contactUserPhoneNumber;					
				} else {
					contactUser["phone"] = null;
				}

				DebugUtil.log(
					"AppState", 
					"loadLoggedInUserFriendCollection.onFindContactsSuccess(); Adding...", 
					contactUser);

				contactUsers.push(contactUser);
			}
			self.addToLoggedInUserContactCollection(contactUsers);
		};

		function onFindContactsError() {
			self.loggedInUserContactCollection.reset();
			self.loadedLoggedInUserContactCollection = true;
		};

		if (navigator.contacts) {
			navigator.contacts.find(
				["displayName", "emails", "birthday"], onFindContactsSuccess, onFindContactsError, new ContactFindOptions());
		} else {
			onFindContactsSuccess([{
				"displayName": "C Contact",
				"emails": [{
					"type": "email",
					"value": "contact.c.1@antiblanks.com",
					"pref": true
				}],
				"phoneNumbers": [{
					"type": "mobile",
					"value": "+447726105086",
					"pref": false
				},{
					"type": "home",
					"value": "+44 (0) 208 123 123",
					"pref": true
				}],
				"birthday": new Date(1982, 1, 28, 0, 0, 0, 0)
			},{
				"displayName": "D Contact",
				"emails": [{
					"type": "email",
					"value": "contact.d.1@antiblanks.com",
					"pref": true
				}],
				"phoneNumbers": [{
					"type": "mobile",
					"value": "+44 (0) 7726 105 086",
					"pref": true
				},{
					"type": "home",
					"value": "0208123123",
					"pref": true
				}],
				"birthday": new Date(1983, 1, 28, 0, 0, 0, 0)
			},{
				"displayName": "A Contact",
				"emails": [{
					"type": "email",
					"value": "contact.a.1@antiblanks.com",
					"pref": true
				},{
					"type": "email",
					"value": "contact.a.2@antiblanks.com",
					"pref": false
				}],
				"phoneNumbers": [{
					"type": "home",
					"value": "0208123123",
					"pref": true
				}],
				"birthday": new Date(1981, 1, 2, 0, 0, 0, 0)
			},{
				"displayName": "B Contact",
				"emails": [{
					"type": "email",
					"value": "contact.b.1@antiblanks.com",
					"pref": true
				},{
					"type": "email",
					"value": "contact.b.2@antiblanks.com",
					"pref": false
				}],
				"phoneNumbers": [{
					"type": "mobile",
					"value": "07726105086",
					"pref": false
				},{
					"type": "home",
					"value": "0208123123",
					"pref": true
				}],
				"birthday": new Date(1981, 1, 2, 0, 0, 0, 0)
			},{
				"displayName": "E Contact",
				"emails": [{
					"type": "email",
					"value": "contact.e.1@antiblanks.com",
					"pref": true
				}],
				"phoneNumbers": [{
					"type": "mobile",
					"value": "07726105086",
					"pref": true
				},{
					"type": "home",
					"value": "0208123123",
					"pref": false
				}],
				"birthday": new Date(1984, 1, 28, 0, 0, 0, 0)
			},{
				"displayName": "G Contact",
				"emails": [{
					"type": "email",
					"value": "contact.g.1@antiblanks.com",
					"pref": true
				}],
				"phoneNumbers": [],
				"birthday": new Date(1986, 1, 28, 0, 0, 0, 0)
			},{
				"displayName": "H Contact",
				"emails": [{
					"type": "email",
					"value": "contact.h.1@antiblanks.com",
					"pref": true
				}],
				"phoneNumbers": [],
				"birthday": new Date(1987, 1, 28, 0, 0, 0, 0)
			},{
				"displayName": "F Contact",
				"emails": [{
					"type": "email",
					"value": "contact.f.1@antiblanks.com",
					"pref": true
				}],
				"phoneNumbers": [{
					"type": "mobile",
					"value": "+44 (0) 7726 105 086",
					"pref": true
				},{
					"type": "home",
					"value": "0208123123",
					"pref": false
				}],
				"birthday": new Date(1985, 1, 28, 0, 0, 0, 0)
			}]);
		}
	},

	addToLoggedInUserContactCollection: function(users) {
		DebugUtil.log("AppState", "addToLoggedInUserContactCollection();", users);
		this.loggedInUserContactCollection.add(users);
	},

	// Contacts by name

	loadLoggedInUserContactByNameCollectionPage: function(page) {
		DebugUtil.log("AppState", "loadLoggedInUserContactByNameCollectionPage();", page, this.loggedInUserContactByNameCollection);
		var self = this;
		if (page == 1) {
			self.loggedInUserContactByNameCollection.reset();
			self.loadedLoggedInUserContactByNameCollectionPage = 0;
		}
		if (self.loadedLoggedInUserContactByNameCollectionPage >= page) {
			this.trigger(UsersContactEvent.ON_LOADED_CONTACT_BY_NAME_COLLECTION_PAGE, {});
			return;
		}
		var pageItems = 5;
		var skip = (page - 1) * pageItems;
		var take = page * pageItems;
		DebugUtil.log("AppState", "loadLoggedInUserContactByNameCollectionPage();", skip, take);
		if (skip > self.loggedInUserContactCollection.length) {
			this.trigger(UsersContactEvent.ON_LOADED_CONTACT_BY_NAME_COLLECTION_PAGE, {});
			return;
		}
		var tempLoggedInUserContactCollection = self.loggedInUserContactCollection.clone();
		tempLoggedInUserContactCollection.comparator = function(userModel) { 
			return userModel.get("full_name");
		};
		tempLoggedInUserContactCollection.sort();
		var userModelsToAdd = [];
		DebugUtil.log(
			"AppState", 
			"loadLoggedInUserContactByNameCollectionPage();", 
			tempLoggedInUserContactCollection,
			tempLoggedInUserContactCollection.models.slice(skip, take));
		_.each(tempLoggedInUserContactCollection.models.slice(skip, take), function(userModel) {
			userModelsToAdd.push(userModel);
		});
		this.addToLoggedInUserContactByNameCollection(userModelsToAdd);
		DebugUtil.log("AppState", "loadLoggedInUserContactByNameCollectionPage();", userModelsToAdd);
		self.loadedLoggedInUserContactByNameCollectionPage = page;
		this.trigger(UsersContactEvent.ON_LOADED_CONTACT_BY_NAME_COLLECTION_PAGE, {});
	},

	loadNextLoggedInUserContactByNameCollectionPage: function() {
		DebugUtil.log("AppState", "loadNextLoggedInUserContactByNameCollectionPage();");
		var nextPage = this.loadedLoggedInUserContactByNameCollectionPage + 1;
		this.loadLoggedInUserContactByNameCollectionPage(nextPage);
		this.trigger(UsersContactEvent.ON_LOADED_NEXT_CONTACT_BY_NAME_COLLECTION_PAGE, {});
	},

	getLoggedInUserContactByNameCollection: function() {
		DebugUtil.log("AppState", "getLoggedInUserContactByNameCollection();", this.loggedInUserContactByNameCollection);
		return this.loggedInUserContactByNameCollection;
	},

	addToLoggedInUserContactByNameCollection: function(users) {
		DebugUtil.log("AppState", "addToLoggedInUserContactByNameCollection();", users);
		this.loggedInUserContactByNameCollection.add(users);
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.State = new AppState();