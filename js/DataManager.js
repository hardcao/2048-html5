window.localData = {
	gameData :{},
    
    setItem: function (id, val) {
    	return this._data[id] = String(val);
  	},

  	removeItem: function(id) {
  		return delete this.gameData[id];
  	},

  	getItem : function(id) {
  		return this.gameData[id];
  	},

  	clearData: function() {
  		return this.gameData = {};
  	},
};

function DataManager () {
	this.bestScoreKey = "bestScoreKey";
	this.bestStateKey = "bestStateKey";
	var supported = this.localStorageSupported();
	this.storage = supported ? window.localStorage: window.localData;

}

DataManager.prototype.localStorageSupported = function () {
	var testKey = "testKey";
	var storage = window.localStorage;
	try {
		storage.setItem(testKey, "1");
		storage.removeItem(testKey);
		return true;
	} catch (error) {
		return false;
	}
}

DataManager.prototype.getBestScore = function() {
	return this.storage.getItem(this.bestScoreKey) || 0;
}

DataManager.prototype.setBestScore = function (score) {
	return this.storage.setItem(this.bestScoreKey, score);
}

DataManager.prototype.setGameState = function (gameState) {
	return this.storage.setItem(this.bestStateKey, gameState);
}

DataManager.prototype.getGameState = function () {
	return this.storage.setItem(this.bestStateKey) || 0;
}

DataManager.prototype.clearGameState = function () {
	return this.storage.removeItem(this.bestStateKey);
}