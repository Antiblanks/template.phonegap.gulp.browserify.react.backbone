/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");

/*************************************
 * Classes
 *************************************/

var UploadUtil = function() {
	return {
		/**
		 * photoUploader
		 * @selectPhotoButtonSelector Select photo button selector
		 * @uploadPhotoButtonSelector Upload photo button selector
		 * @previewImageSelector Preview image tag selector
		 * @uploadURI URI to upload script
		 */
		photoUploader: function(selectPhotoButtonSelector, uploadPhotoButtonSelector, previewImageSelector, uploadURI) {
			var pictureSource;
		    var destinationType;

		    document.addEventListener("deviceready", onDeviceReady, false);

		    function onDeviceReady() {
		    	console.log("UploadUtil.photoUploader(); Device ready");
		    	if (!navigator.camera)
		    		return;
		        pictureSource = navigator.camera.PictureSourceType;
		        destinationType = navigator.camera.DestinationType;
		    }

		    function getPhoto(sourceType) {
		    	console.log("UploadUtil.photoUploader(); Get photo");
				navigator.camera.getPicture(onGetPhotoSuccess, onGetPhotoFailed, { 
					quality: 50,
					destinationType: destinationType.FILE_URI,
					sourceType: sourceType 
				});
		    }

		    function uploadPhoto() {
		        var imageURI = $(previewImageSelector).attr("src");
		        if (!imageURI) {
		            return;
		        }

		        var options = new FileUploadOptions();
		        	options.fileKey = "file";
		        	options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		        	options.mimeType = "image/jpeg";

		        var fileTransfer = new FileTransfer();
		        fileTransfer.upload(
		        	imageURI, encodeURI(uploadURI), onUploadSuccess, onUploadFailed, options);
		    }

		    function onGetPhotoSuccess(imageURI) {
		    	console.log("UploadUtil.photoUploader(); Get photo success");
		        var previewImageElement = $(previewImageSelector);
		        $(previewImageElement).css("display", "block");
		        $(previewImageElement).attr("src", imageURI);
		    }

		    function onGetPhotoFailed(message) {
		      	console.log("UploadUtil.photoUploader(); Get photo failed: " + message);
		    }

		    function onUploadSuccess(response) {
		        console.log(
		        	"UploadUtil.photoUploader(); Upload success: " + 
		        	response.responseCode, 
		        	response.response, 
		        	response.bytesSent);
		        uploadPhoto();
		    }

		    function onUploadFailed(error) {
		        console.log(
		        	"UploadUtil.photoUploader(); Upload error: " + 
		        	error.code, 
		        	error.source, 
		        	error.target);
		    }

		    $(selectPhotoButtonSelector).unbind("click");
		    $(selectPhotoButtonSelector).click(function(evt) {
		    	console.log("UploadUtil.photoUploader(); Select photo clicked");
		    	getPhoto(pictureSource.PHOTOLIBRARY);
		    	evt.stopPropagation();
		    	evt.preventDefault();
		    	return false;
		    });
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

exports.Util = new UploadUtil();
