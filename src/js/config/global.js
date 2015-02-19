var websiteUri = ""; // @todo: Add related website URL here (website will process returns from third parties and open application)
var webServiceBaseUri = ""; // @todo: Add web service URI here
var webServiceSecureBaseUri = ""; // @todo: Add secure web service URI here, SHOULD be https://, if no secure web service required use webServiceBaseUri

module.exports = {
	// Website config
	websiteUri: 						websiteUri,
						
	// Web service config
	webServiceBaseUri: 					webServiceBaseUri,
	webServiceSecureBaseUri: 			webServiceSecureBaseUri,
	webServiceApiKey: 					"", // @todo: Add API key here
	webServiceClientUsername: 			"", // @todo: Add web service client username here
	webServiceClientPassword: 			"", // @todo: Add web service client password here

	// Dummy config
	byPassLoginAsDummyUser1: 			true,
	byPassLoginAsDummyUser2: 			false,

	// Content status config
	// @note: These status values must match web service status values
	statusNone: 			0,
	statusDeleted: 			100,
	statusPending: 			200,
	statusSuspended: 		300,
	statusActive: 			700,
	statusInactive: 		800,

	// Facebook config
	facebookAppId: 						"123451234512345", // @todo: Add Facebook App ID here

	// Phone numbers config
	phoneNumberUKRegEx: 				/^((00|\+)44|0)7\d{9}$/,
	cleanPhoneNumberUKRegEx: 			/07\d{9}/
};