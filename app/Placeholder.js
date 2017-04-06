define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse'],
	function(myHelper, Canvas, Vector2, mouse){

	function Placeholder (parent, cordsPosition, color)
		{
			this.app = parent;
			this.position = Vector2.zero;
			this.color = typeof color !== 'undefined' ? color : "#b3b3b3";
			this.width = this.app.grid.gridSize;
			this.height = this.app.grid.gridSize;
            this.lineColor = "#b3b3b3";
			this.lineWidth = 1;
			this.cords = cordsPosition;
			this.setPostitionFromCords(cordsPosition);
		}

	Placeholder.prototype.setPostitionFromCords = function (cordsPosition) {
		this.position.x = this.app.grid.startPosition.x + (cordsPosition.x) * this.app.grid.gridSize;
		this.position.y = this.app.grid.startPosition.y - (cordsPosition.y+1) * this.app.grid.gridSize;
		this.setPosition(this.position);
		return this.position;
    };

	Placeholder.prototype.calculateGridPosition = function (position) {
		var cords = Vector2.zero;
		cords.x = Math.round((position.x - this.app.grid.startPosition.x) / this.app.grid.gridSize);
		cords.y = Math.round(-1 * (position.y - this.app.grid.startPosition.y) / this.app.grid.gridSize -1);
		cords.x = myHelper.clearNegativeZero(cords.x);
		cords.y = myHelper.clearNegativeZero(cords.y);
		return cords;
	};

	Placeholder.prototype.setPosition = function (position) {
		this.position.x = position.x;
		this.position.y = position.y;
		this.cords = this.calculateGridPosition(this.position);
		return this.position;
    };

    Placeholder.prototype.reset = function () {

	};

	Placeholder.prototype.checkMouse = function () {
		return false;
    };

	Placeholder.prototype.update = function (delta) {
		this.width = this.app.grid.gridSize;
		this.height = this.app.grid.gridSize;
		this.setPostitionFromCords(this.cords);
	};


    Placeholder.prototype.draw = function () {
		canvas.drawRectangle(this.position.x, this.position.y, this.width, this.height, this.color);
    };

	return Placeholder;

});
