function InputManager() {
	this.events = {},
	if (window.navigator.msPointerEnabled) {
		this.eventTouchstart = "MSPointerDown";
		this.eventTouchmove = "MSPointerMove";
		this.eventTouchend = "MSPointerUp";
	} else {
		this.eventTouchstart = "TouchStart";
		this.eventTouchmove = "touchmove";
		this.eventTouchend = "touchend";
	}
	this.listen();
}

InputManager.protetype.on = function(event, callback) {
	if(!this.events[event]) {
		this.events[event] = [];
	}
	this.events[event].push(callback);
};

InputManager.protetype.emit = function(event, data) {
	var callbacks = this.events[event];
	if(callbacks) {
		callbacks.foreach(function(callback) {
			callback(data);
		});
	}
};

InputManager.protetype.bindButtonPress = function(selector, fn) {
	var button = document.querySelector(selector);
	button.addEventListener("click", fn);
	button.addEventListener(this.eventTouchend, fn.bind(this));
};


InputManager.protetype.keepPlaying = function(event) {
	event.preventDefault();
	this.emit("keepPlaying");
};

InputManager.protetype.keepPlaying = function(event) {
	event.preventDefault();
	this.emit("restart");
};

InputManager.protetype.listen = function() {
	var self = this;

	var map = {
		38: 0, // Up
    	39: 1, // Right
    	40: 2, // Down
    	37: 3, // Left
    	75: 0, // Vim up
    	76: 1, // Vim right
    	74: 2, // Vim down
    	72: 3, // Vim left
    	87: 0, // W
    	68: 1, // D
    	83: 2, // S
    	65: 3  // A
	};

	document.addEventListener("keydown", function(event){
		var modifier = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
        var mapped = this.map[event.which];
        if(!modifier) {
        	if(mapped !== undefined) {
        		event.preventDefault();
        		self.emit("move", mapped);
        	}
        }

        if(!modifier && event.which == 82) {
        	event.preventDefault();
  			this.emit("restart");
        }
	});

this.bindButtonPress(".retry-button", this.restart);
this.bindButtonPress(".restart-button", this.restart);
this.bindButtonPress(".keep-playing-button", this.keepPlaying);

var touchStartClientX,touchStartClientY;
var gameContainer = document.getElementsByClassName("game-container")[0];

gameContainer.addEventListener(this.eventTouchstart, function(event) {
	if((!window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches > 1) {
		return;
	}
	if(window.navigator.msPointerEnabled) {
		touchStartClientX = event.pageX;
		touchStartClientY = event.pageY
	} else {
		touchStartClientX = event.touches[0].clientX;
      	touchStartClientY = event.touches[0].clientY;
	}
	event.preventDefault();
});


gameContainer.addEventListener(this.eventTouchend, function(event) {
	if((!window.navigator.msPointerEnabled && event.touches.length > 0) || event.targetTouches > 0) {
		return;
	}

	var touchEndClientX,touchEndClientY;
	if(window.navigator.msPointerEnabled) {
		touchEndClientX = event.pageX;
		touchEndClientY = event.pageY
	} else {
		touchEndClientX = event.touches[0].clientX;
      	touchEndClientY = event.touches[0].clientY;
	}
	event.preventDefault();

	var dx = touchEndClientX - this.touchStartClientX;
	var dy = touchEndClientY - this.touchStartClientY;

	var absDx = Math.abs(dx);
	var absDy = Math.abs(dy);

	if(Math.max(absDx, absDy) > 10) {
		self.emit("move", absDx > absDy ? (dx > 0 ? 1:3):(dy > 0 ? 2 : 0));
	}
});

gameContainer.addEventListener(this.eventTouchmove, function(event) {
	event.preventDefault();
}
};



