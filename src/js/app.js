/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var React                   = require("react");

// Events
var AppEvent                = require("events/app");
var PageEvent               = require("events/page");
var LoginEvent              = require("events/login");
var WindowEvent             = require("events/window");
var UsersContactEvent       = require("events/users-contact");

// Managers
var TooltipsManager         = require("managers/tooltips-manager").Manager;
var PagesManager            = require("managers/pages-manager").Manager;

// Controllers
var AppController           = require("controllers/app").Controller;
var HomeController          = require("controllers/home").Controller;
var LoginController         = require("controllers/login").Controller;
var MenuController          = require("controllers/menu").Controller;
var UserController          = require("controllers/user").Controller;
var SettingsController      = require("controllers/settings").Controller;
var PagesController         = require("controllers/pages").Controller;

// Models
var UserModel               = require("models/user").Model;
var UsersSessionModel       = require("models/users-session").Model;

// Utils
var DebugUtil               = require("utils/debug").Util;
var FacebookUtil            = require("utils/facebook").Util;
var ButtonsUtil             = require("utils/buttons").Util;

// Types
var PageTransitionType      = require("managers/types/page-transition");

// State
var AppState                = require("core/app-state").State;

// Config
var GlobalConfig            = require("config/global");

// Gateway
var UsersSessionGateway     = require("gateway/users-session-gateway").Gateway;
var UsersSettingsGateway    = require("gateway/users-settings-gateway").Gateway;

/*************************************
 * Classes
 *************************************/

/**
 * @class Application
 * Main application class
 */
var Application = Backbone.Router.extend({ 
    controllers: {},

    initialize: function() {
        DebugUtil.log("Application", "initialized");

        var self = this;

        this.tooltipsManager = new TooltipsManager({
            el: $("body")
        });

        this.pagesManager = new PagesManager({
            transitionType: PageTransitionType.HORIZONTAL
        });
        this.listenTo(this.pagesManager, PageEvent.ON_PAGE_READY, this.onPageReady);

        // Initiate the gateways

        global.UsersSessionGateway = new UsersSessionGateway(AppState);
        global.UsersSettingsGateway = new UsersSettingsGateway(AppState);

        // Home Controller

        this.controllers.homeController = new HomeController({
            router: this,
            pagesManager: this.pagesManager,
            state: AppState
        });
        this.listenTo(this.controllers.homeController, AppEvent.ON_BEFORE_ROUTE, this.onBeforeRoute);
        this.listenTo(this.controllers.homeController, AppEvent.ON_AFTER_ROUTE, this.onAfterRoute);

        // Menu Controller

        this.controllers.menuController = new MenuController({
            router: this,
            pagesManager: this.pagesManager,
            state: AppState
        });
        this.listenTo(this.controllers.menuController, AppEvent.ON_BEFORE_ROUTE, this.onBeforeRoute);
        this.listenTo(this.controllers.menuController, AppEvent.ON_AFTER_ROUTE, this.onAfterRoute);
        this.listenTo(this.controllers.menuController, LoginEvent.ON_LOGOUT_SUCCESS, this.onLogoutSucces);

        // Login Controller

        this.controllers.loginController = new LoginController({
            router: this,
            pagesManager: this.pagesManager,
            state: AppState
        });
        this.listenTo(this.controllers.loginController, AppEvent.ON_BEFORE_ROUTE, this.onBeforeRoute);
        this.listenTo(this.controllers.loginController, AppEvent.ON_AFTER_ROUTE, this.onAfterRoute);
        this.listenTo(this.controllers.loginController, LoginEvent.ON_LOGIN_SUCCESS, this.onLoginSucces);

        // User Controller

        this.controllers.userController = new UserController({
            router: this,
            pagesManager: this.pagesManager,
            state: AppState
        });
        this.listenTo(this.controllers.userController, AppEvent.ON_BEFORE_ROUTE, this.onBeforeRoute);
        this.listenTo(this.controllers.userController, AppEvent.ON_AFTER_ROUTE, this.onAfterRoute);

        // Settings Controller

        this.controllers.settingsController = new SettingsController({
            router: this,
            pagesManager: this.pagesManager,
            state: AppState
        });
        this.listenTo(this.controllers.settingsController, AppEvent.ON_BEFORE_ROUTE, this.onBeforeRoute);
        this.listenTo(this.controllers.settingsController, AppEvent.ON_AFTER_ROUTE, this.onAfterRoute);

        // Pages Controller

        this.controllers.pagesController = new PagesController({
            router: this,
            pagesManager: this.pagesManager,
            state: AppState
        });
        this.listenTo(this.controllers.pagesController, AppEvent.ON_BEFORE_ROUTE, this.onBeforeRoute);
        this.listenTo(this.controllers.pagesController, AppEvent.ON_AFTER_ROUTE, this.onAfterRoute);

        // Model events

        this.listenTo(AppState, UsersContactEvent.ON_LOADED_CONTACT_BY_NAME_COLLECTION_PAGE, function(data) {
            self.updatePage(UsersContactEvent.ON_LOADED_CONTACT_BY_NAME_COLLECTION_PAGE, data);
        });

        this.listenTo(AppState, UsersContactEvent.ON_LOADED_NEXT_CONTACT_BY_NAME_COLLECTION_PAGE, function(data) {
            self.updatePage(UsersContactEvent.ON_LOADED_NEXT_CONTACT_BY_NAME_COLLECTION_PAGE, data);
        });

        // Button events
        $(ButtonsUtil).unbind(ButtonsUtil.REQUEST_HISTORY_GO_BACK);
        $(ButtonsUtil).bind(ButtonsUtil.REQUEST_HISTORY_GO_BACK, function(data) {
            window.history.back();
        });

        // Routing events
        this.listenTo(this, 'route', function (name, args) {
            DebugUtil.log("AppController", "onRouteChange();", name, args, Backbone.history.fragment);
            AppState.addRouteHistoryItem({
                "name": name,
                "args": args,
                "fragment": Backbone.history.fragment,
                "pageFragment": Backbone.history.fragment.split("?")[0]
            });
        });

        // Misc events
        $(window).scroll(function(evt) {
            self.updatePage(WindowEvent.ON_WINDOW_SCROLL, evt);
        });

        // Initiate the global Facebook library
        var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
        var baseURL = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + context;
        global.FacebookUtil = new FacebookUtil(
            baseURL + "/facebook/oauthcallback.html", 
            baseURL + "/facebook/logoutcallback.html");
        global.FacebookUtil.init({
            appId: GlobalConfig.facebookAppId
        });

        // Start the app
        Backbone.history.start();
    },

    isAppReady: function() {
        var isReadyCount = 0;
        var controllersTotal = 0;
        for (var controller in this.controllers) {
            if (this.controllers[controller].isControllerReady())
                isReadyCount++;
            controllersTotal++;
        }
        DebugUtil.log("Application", "isAppReady", isReadyCount, controllersTotal, AppState.isAppStateReady());
        return (isReadyCount >= controllersTotal && AppState.isAppStateReady());
    },

    // Navigation

    navigateToPage: function(path, scrollToTop, trigger) {
        DebugUtil.log("Application", "navigateToPage();", path, trigger);
        if (path === null || path === undefined)
            return false;
        if (trigger === null || trigger === undefined)
            trigger = true;
        this.navigate(path, {trigger: trigger});
        if (scrollToTop)
            window.scrollTo(0,0);
        return true;
    },

    // Tooltips functionality

    showTooltip: function(tooltipData) {
        DebugUtil.log("Application", "showTooltip", tooltipData);
        this.tooltipsManager.showTooltip(tooltipData);
    },

    hideTooltip: function(tooltipData) {
        DebugUtil.log("Application", "hideTooltip", tooltipData);
        this.tooltipsManager.hideTooltip(tooltipData.tooltipId);
    },

    // Shared functionality

    onPageReady: function() {
        DebugUtil.log("Application", "onPageReady");
        // @todo: Add on page ready logic here...
    },

    onBeforeRoute: function(evt) {
        DebugUtil.log("Application", "onBeforeRoute");
        // @todo: Add on before route logic here...
    },

    onAfterRoute: function(evt) {
        DebugUtil.log("Application", "onAfterRoute");
        // @todo: Add on after route logic here...
    },

    updateControllers: function(eventType, data) {
        DebugUtil.log("Application", "updateControllers", eventType, data);
        if (!eventType)
            return;
        for (var i in this.controllers) {
            if (this.controllers[i][eventType] && typeof this.controllers[i][eventType] == "function")
                this.controllers[i][eventType](data);
        }
    },

    updatePage: function(eventType, data) {
        DebugUtil.log("Application", "updatePage", eventType, data, this.pagesManager.getCurrentPage());
        if (!eventType)
            return;
        var currentPage = this.pagesManager.getCurrentPage();
        if (currentPage && currentPage[eventType] && typeof currentPage[eventType] == "function")
            currentPage[eventType](data);
    },

    // Login functionality

    onLoginSucces: function(usersSession) {
        DebugUtil.log("Application", "onLoginSucces");
        AppState.setLoggedInUsersSession(new UsersSessionModel(usersSession));
    },

    onLogoutSucces: function() {
        DebugUtil.log("Application", "onLogoutSucces");
        AppState.setLoggedInUsersSession(null);
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.App = Application;