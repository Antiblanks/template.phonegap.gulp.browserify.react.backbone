/*************************************
 * Imports
 *************************************/

// Utils
var OsUtil = require("utils/os");

/*************************************
 * Classes
 *************************************/

var VideoUtil = function(osUtil) {
	return {
		getRenderInterval: function() {
			function getRenderIntervalFromFramesPerSecond(framesPerSecond) {
				return 2 * Math.floor(framesPerSecond / 2);
			}
	        if (osUtil.is32BitWindowsOS())
	            return getRenderIntervalFromFramesPerSecond(8);
	        return getRenderIntervalFromFramesPerSecond(24);
	    },

	    canPlayVideoTypes: function() {
	    	var response = {};
	    	var videoElement = document.createElement("video");
			if (videoElement.canPlayType) {
			    response.mpeg4 = "" !== videoElement.canPlayType('video/mp4; codecs="mp4v.20.8"');
			    response.h264 = "" !== (
			    	videoElement.canPlayType('video/mp4; codecs="avc1.42E01E"') || 
			    	videoElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));
				response.ogg = "" !== videoElement.canPlayType('video/ogg; codecs="theora"');
				response.webm = "" !== videoElement.canPlayType('video/webm; codecs="vp8, vorbis"');
			}
			return response;
	    },

	    canPlayAtLeastOneVideoType: function() {
	    	var canPlayVideoTypes = this.canPlayVideoTypes();
	    	return canPlayVideoTypes.mpeg4 || canPlayVideoTypes.h264 || canPlayVideoTypes.ogg || canPlayVideoTypes.webm;
	    },

	    getBackgroundVideoFile: function(fileName) {
	    	var canPlayVideoTypes = this.canPlayVideoTypes();
	    	var uniqueId = Math.round(Math.random()*100000);
	    	if (canPlayVideoTypes.mpeg4 || canPlayVideoTypes.h264)
	    		return fileName + ".mp4?id=" + uniqueId;
	    	if (canPlayVideoTypes.webm)
	    		return fileName + ".webm?id=" + uniqueId;
	    	if (canPlayVideoTypes.ogg)
	    		return fileName + ".ogv?id=" + uniqueId;
	    	return null;
	    },

	    getBackgroundVideoFileFormat: function() {
	    	var canPlayVideoTypes = this.canPlayVideoTypes();
	    	if (canPlayVideoTypes.mpeg4 || canPlayVideoTypes.h264)
	    		return "video/mp4";
	    	if (canPlayVideoTypes.webm)
	    		return "video/webm";
	    	if (canPlayVideoTypes.ogg)
	    		return "video/ogg";
	    	return null;
	    },

	    /**
	     * videoFrameConverter();
	     * Class to handle converting video frames onto a canvas
	     */
	    videoFrameConverter: function(video, canvas, renderPoster, interval) {
	        var frameConverter = this;

	        frameConverter.ON_READY = "onFrameConverterReady";
	        frameConverter.ON_PLAY_START = "onFrameConverterPlayStart";

	        frameConverter.isReady = false;
	        frameConverter.playPending = false;
	        frameConverter.playing = false;
	        frameConverter.canPlayThrough = false;

	        var uniqueId = Math.round(Math.random()*100000);
	        video.id = "videoElement" + uniqueId;
	        canvas.id = "canvasElement" + uniqueId;

	        var viewport = canvas.getContext("2d");
	        var canvasWidth = canvas.width;
	        var canvasHeight = canvas.height;

	        var frameBuffer = document.createElement("canvas");
	        frameBuffer.id = "frameBufferCanvas" + uniqueId;
	        frameBuffer.width = canvasWidth;
	        frameBuffer.height = canvasHeight;
	        var frameBufferContext = frameBuffer.getContext("2d");

	        var blurFilter = new BlurFilter();
	        var lastRenderedVideoFrameImageData = null;
	        var renderVideoTimer = null;
	        var playVideoTimer = null;
	        var isReadyTimer = null;

	        var frameRenderCounter = 0;
	        var frameRenderEmptyCounter = 0;

	        // Private functionality

	        function renderVideoFrameImageDataToCanvas(imageData) {
	            if (!imageData)
	                return false;
	            var imageIsEmpty = true;
	            var maxEmptyCounter = 0;
	            while (imageIsEmpty) {
	            	imageIsEmpty = 
	            		imageData.data[maxEmptyCounter] == 0 || 
	            		imageData.data[maxEmptyCounter] == 255;
	            	maxEmptyCounter++;
	            	if (maxEmptyCounter >= 20) {
	            		break;
	            	}
	            }
	            if (imageIsEmpty) {
	            	frameRenderEmptyCounter++;
	            	return false;
	            }
	            viewport.putImageData(imageData, 0, 0);
	            lastRenderedVideoFrameImageData = imageData;
	            return true;
	        };

	        function renderVideoFrame() {
	            frameBufferContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvasWidth, canvasHeight);
	            var imageData = frameBufferContext.getImageData(0, 0, canvasWidth, canvasHeight);
	            blurFilter.filter(imageData, {amount: 2});
	            return renderVideoFrameImageDataToCanvas(imageData);
	        };

	        function renderVideoPoster() {
	        	var poster = $(video).attr("poster");
	        	if (!poster || String(poster) === "")
	        		return false;
	        	var posterImage = new Image();
	        	posterImage.src = poster;
	            frameBufferContext.drawImage(posterImage, 0, 0, posterImage.width, posterImage.height, 0, 0, canvasWidth, canvasHeight);
	            var imageData = frameBufferContext.getImageData(0, 0, canvasWidth, canvasHeight);
	            return renderVideoFrameImageDataToCanvas(imageData);
	        };

	        function renderVideo() {
	        	// @note: Make sure that the player doesn't get stuck trying to render a dead video
	        	if (frameRenderEmptyCounter > 500)
	        		return false;
	            if (video.paused || video.ended) {
	                return renderVideoFrameImageDataToCanvas(lastRenderedVideoFrameImageData);
	            }
	            renderVideoFrame();
	            window.clearTimeout(renderVideoTimer);
	            renderVideoTimer = setTimeout(function () {
	                renderVideo();
	            }, interval);
	            frameRenderCounter++;
	            return true;
	        };

	        function ready() {
	        	$(frameConverter).trigger(frameConverter.ON_READY, {});
	        	frameConverter.isReady = true;
	        };

	        function onCanPlayThrough() {
	        	frameConverter.canPlayThrough = true;
	        	if (frameConverter.playPending) {
	        		frameConverter.play();
	        	}
	        };

	        frameConverter.renderVideo = function(newVideo, newCanvas) {
	            video = newVideo;
	            canvas = newCanvas;
	            viewport = newCanvas.getContext("2d");
	            renderVideo();
	        };

	        frameConverter.renderVideoPoster = function() {
	        	renderVideoPoster();
	        };

	        // Public functionality

	        frameConverter.play = function(delayInMs) {
	        	frameRenderCounter = 0;
	        	frameRenderEmptyCounter = 0;
	        	window.clearTimeout(playVideoTimer);
	        	if (!isNaN(delayInMs) && delayInMs > 0) {
	        		frameConverter.playPending = true;
	        		playVideoTimer = window.setTimeout(function() {
	        			video.play();
	        			$(frameConverter).trigger(frameConverter.ON_PLAY_START, {});
	        			frameConverter.playing = true;
	        			frameConverter.playPending = false;
	        		}, delayInMs);
	        	} else {
	        		video.play();
	        		$(frameConverter).trigger(frameConverter.ON_PLAY_START, {});
	        		frameConverter.playing = true;
	        		frameConverter.playPending = false;
	        	}
	        };

	        frameConverter.playWhenReady = function() {
	        	frameConverter.playPending = true;
	        	frameConverter.playing = false;
	        	window.clearTimeout(playVideoTimer);
	        	video.addEventListener("canplaythrough", onCanPlayThrough);
	        };

	        frameConverter.pause = function() {
	        	video.pause();
	        	frameConverter.playing = false;
	        	frameConverter.playPending = false;
	        };

	        frameConverter.destroy = function() {
	            video.removeEventListener("canplaythrough", onCanPlayThrough);
	            video.removeEventListener("play", renderVideo);
	            video.pause();
	            $(video).find("source").remove();
	            $(video).prop("src", "");
	            video.load();
	            $(video).remove();
	            window.clearTimeout(renderVideoTimer);
	            window.clearTimeout(playVideoTimer);
	            window.clearTimeout(isReadyTimer);
	            frameConverter.playing = false;
	        	frameConverter.playPending = false;
	        	frameConverter.canPlayThrough = false;
	        };
	        
	        video.addEventListener("play", renderVideo, false);

	        if (renderPoster)
	        	renderVideoPoster();

	        isReadyTimer = window.setTimeout(function() {
	        	ready();
	        }, 50);

	        return frameConverter;
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

exports.Util = new VideoUtil(OsUtil);
