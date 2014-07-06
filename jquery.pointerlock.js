// This code was adapted from https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock
// Note: at the time of writing, only Mozilla and WebKit support Pointer Lock.

if (!document.addEventListener) {
	document.addEventListener = function () {};
}
(function () {
var extendjQuery = function ($) {
$.fn.pointerLock = function (_params) {
	var params = $.extend({
		requireAlt: false,
		on: 'mousedown',
		until: 'mouseup',
		fullscreenElement: undefined,
		movement: undefined,
	}, _params);
	var mouseMoveListener = function(e) {
		if (!mouseMoveListener.getMovementFromEvent) {
			if (undefined !== e.originalEvent.movementX) {
				mouseMoveListener.getMovementFromEvent = function (e) {return {x: e.originalEvent.movementX, y: e.originalEvent.movementY};};
			} else if (undefined !== e.originalEvent.mozMovementX) {
				mouseMoveListener.getMovementFromEvent = function (e) {return {x: e.originalEvent.mozMovementX, y: e.originalEvent.mozMovementY};};
			} else if (undefined !== e.originalEvent.webkitMovementX) {
				mouseMoveListener.getMovementFromEvent = function (e) {return {x: e.originalEvent.webkitMovementX, y: e.originalEvent.webkitMovementY};};
			} else {
				mouseMoveListener.getMovementFromEvent = function (e) {
					if (mouseMoveListener.getMovementFromEvent.ePrevious) {
						movementX = e.originalEvent.screenX - mouseMoveListener.getMovementFromEvent.ePrevious.screenX;
						movementY = e.originalEvent.screenY - mouseMoveListener.getMovementFromEvent.ePrevious.screenY;
					} else {
						movementX = 0;
						movementY = 0;
					}
					mouseMoveListener.getMovementFromEvent.ePrevious = e.originalEvent;
					return {x: movementX, y: movementY};
				};
			}
		}
		var movement = mouseMoveListener.getMovementFromEvent(e);
		params.movement(movement.x, movement.y);
	};
	function fullscreenChange() {
		if (document.webkitFullscreenElement === params.fullscreenElement ||
			document.mozFullscreenElement === params.fullscreenElement ||
			document.mozFullScreenElement === params.fullscreenElement) { // Older API upper case 'S'.
			// Element is fullscreen, now we can request pointer lock
			this.requestPointerLock();
		}
	};
    if (params.fullscreenElement) {
		params.fullscreenElement.requestFullscreen = params.fullscreenElement.requestFullscreen    ||
			params.fullscreenElement.mozRequestFullscreen ||
			params.fullscreenElement.mozRequestFullScreen || // Older API upper case 'S'.
			params.fullscreenElement.webkitRequestFullscreen;
	}
	this.each(function () {
		var elem = this;
		var $elem = $(elem);
	    elem.requestPointerLock = elem.requestPointerLock ||
			elem.mozRequestPointerLock ||
			elem.webkitRequestPointerLock || function () {};
		$elem.on(params.on, function (e) {
			$(document.body).addClass('unselectable');
			var pointerLockChange = function () {
				if (document.mozPointerLockElement === this ||
					document.webkitPointerLockElement === this) {
					// console.log("Pointer Lock was successful.");
				} else {
					// console.log("Pointer Lock was lost.");
				}
			};
			$(document).one(params.until, function () {
				$(document).unbind("mousemove", mouseMoveListener);
				if (mouseMoveListener.getMovementFromEvent) {
					delete mouseMoveListener.getMovementFromEvent.ePrevious;
				}
				$(document.body).removeClass('unselectable');
				$.each(['pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockchange'], function (i,pointerlockEventName) {
					$(document).unbind(pointerlockEventName, pointerLockChange);
				});
				document.exitPointerLock();
			});
			$(document).on("mousemove", mouseMoveListener);
			$.each(['pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockchange'], function (i,pointerlockEventName) {
				$(document).on(pointerlockEventName, $.proxy(pointerLockChange, elem));
			});
		    if (params.fullscreenElement) {
				params.fullscreenElement.requestFullscreen();
			} else {
				if (!params.requireAlt || e.altKey) {
					elem.requestPointerLock();
				}
			}
		});
		$.each(['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange'], function (i,fullscreenChangeEventName) {
			document.addEventListener(fullscreenChangeEventName, $.proxy(fullscreenChange, elem), false);
		});
	});
};
};
if (window.jQuery) {
	extendjQuery(jQuery);
} else if (window.require) {
	console.error("jQuery not defined, attempting to load it through AMD require");
	require(["jquery"], function (jQuery) {
		extendjQuery(jQuery);
		console.log("extended jQuery with jquery.pointerlock through AMD");
	});
} else {
	console.error("jQuery not defined; jquery.pointerlock has nothing to extend");
}
}());

document.exitPointerLock = document.exitPointerLock  ||
	document.mozExitPointerLock ||
	document.webkitExitPointerLock || function () {};

function pointerLockError() {
  console.log("Error while locking pointer.");
}

document.addEventListener('pointerlockerror', pointerLockError, false);
document.addEventListener('mozpointerlockerror', pointerLockError, false);
document.addEventListener('webkitpointerlockerror', pointerLockError, false);