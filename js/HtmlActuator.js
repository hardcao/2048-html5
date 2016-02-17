function HtmlActuator() {
	this.tileContainer = document.querySelector(".tile-container");
	this.scoreContainer = document.querySelector(".score-container");
	this.bestScoreContainer =  document.querySelector(".best-container");
	this.messageContainer = document.querySelector(".game-message");

	this.score = 0;
}

HtmlActuator.prototype.clearContainer = function(container) {
	while(container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

HtmlActuator.prototype.normalizePosition = function(position) {
	return {x:position.x + 1, y:position.y + 1};
};

HtmlActuator.prototype.positionClass = function(position) {
	position = this.normalizePosition(position);
	return "tile-position-" + position.x + "-" + position.y; 
};

HtmlActuator.prototype.applyClasses = function(element, classes) {
	element.setAttribute("class", classes.join(" ")); 
};

HtmlActuator.prototype.addTile = function(tile) {
	var self = this;

	var wrapper = document.createElement("div");
	var inner = document.createElement("div");
	var position = tile.previousPosition || {x:tile.x,y:tile.y};

	var positionClass = this.positionClass(position);
	var classes = ["tile", "tile-"+tile.value,positionClass];

	if(tile.value > 2048) classes.push("tile-super");

	this.applyClasses(wrapper, classes);

	inner.classList.add("tile-inner");
	inner.textContent = tile.value;
	if(tile.previousPosition) {
		window.requestAnimationFrame(function(){
			classes[2] = self.positionClass({ x: tile.x, y: tile.y });
			this.applyClasses(wrapper, classes);
		})
	} else if(tile.mergedFrom) {
		classes.push("tile-merged");
		this.applyClasses(wrapper, classes);
		tile.mergedFrom.forEach(function(merged) {
		 	self.add(merged);
		});
	} else {
		classes.push("tile-new");
		this.applyClasses(wrapper, classes);
	}

	wrapper.appendChild(inner);
	self.tileContainer.appendChild(wrapper);

};

HtmlActuator.prototype.updateScore = function(score) {
	this.clearContainer(this.scoreContainer);
	var dScore = score - this.score;
	this.score = score;
	if(dScore > 0) {
		var addScore = document.createElement("div");
		addScore.classList.add("score-addition");
		addition.textContent = "+" + dScore;
		this.scoreContainer.appendChild(addScore);
	}
};

HtmlActuator.prototype.updateBestScore = function(bestScore) {
	this.bestScoreContainer.textContent = bestScore;
};

HtmlActuator.prototype.sendMessage = function(won) {
	var type = won ? "game-won" : "game-over";
	var content = won ? "win":"game over";
	this.messageContainer.classList.add(type);
	this.messageContainer.textContent = content;
};

HtmlActuator.prototype.clearMessage = function(won) {
	this.messageContainer.classList.remove("game-won");
	this.messageContainer.classList.remove("game-over");
};

HtmlActuator.prototype.actuate = function (grid, gameData) {
	var self = this;
	window.requestAnimationFrame(function(){
		self.clearContainer(self.tileContainer);
		grid.cell.forEach(function(columns) {
			columns.forEach(function(cell) {
				if(cell) {
					self.addTile(cell);
				}
			});
		});

	self.updateScore(gameData.score);
	self.updateBestScore(gameData.bestScore);
	if(gameData.terminated) {
		if(gameData.over) {
			self.sendMessage(false);
		} else if(gameData.won) {
			self.sendMessage(true);
		}
	}
	});
};