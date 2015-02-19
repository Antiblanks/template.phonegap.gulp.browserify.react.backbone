/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var WebserviceUtil = function(apiKey, username, password) {
	return {
		getWebserviceRequestAuthorizationHeader: function(sessionId) {
			if (!sessionId)
				sessionId = password;
			return "TRUEREST username="+username+"&password="+sessionId+"&apikey="+apiKey;
		},

		getWebserviceMessageFromResponse: function(response) {
			if (response && response["meta"] && response["meta"]["feedback"]) {
				for (var i=0; i<response["meta"]["feedback"].length; i++) {
					var feedback = response["meta"]["feedback"][i];
					if (feedback.level == "info" && feedback.message)
						return feedback.message;
				}
			}
			return "";
		}
	};
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = WebserviceUtil;