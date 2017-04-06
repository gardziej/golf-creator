define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/AppObjectList',
		'app/TilesManager'],
	function(myHelper, Canvas, Vector2, mouse, AppObjectList,
		TilesManager){

	function Tiles (parent)
		{
			AppObjectList.call(this, parent);
			this.app = parent;
			this.grid = [];
			this.tilesManager = new TilesManager(this.app, this);
		}

	Tiles.prototype = Object.create(AppObjectList.prototype);

	Tiles.prototype.findInCords = function (cords) {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				if (!this.grid[i].dragging && this.grid[i].cords.equals(cords))
					{
						return this.grid[i];
					}
			}
		return false;
    };

	Tiles.prototype.remove = function (obj) {
		for (var i = 0, len = this.grid.length; i<len; i++)
		{
			if (obj === this.grid[i])
				{
					this.grid[i].removeTileBar();
					this.grid.splice(i, 1);
					obj.parent = null;
					delete (obj);
					return;
				}
		};
	};

	Tiles.prototype.selected = function () {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				if (this.grid[i].selected) return this.grid[i];
			}
		return false;
	}

	Tiles.prototype.unselect = function (exception, mouseIsOver) {
		var skip = false;
		if (typeof exception !== 'undefined')
			{
				skip = exception;
			}
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				if (this.grid[i] !== skip) this.grid[i].unselect();
			}
    };


	Tiles.prototype.reset = function () {
		this.update(this);
	}

	Tiles.prototype.update = function (delta) {
		AppObjectList.prototype.update.call(this, delta);
		this.tilesManager.update(this);
	}

	Tiles.prototype.draw = function () {
		AppObjectList.prototype.draw.call(this);
		this.tilesManager.draw();
	}

	return Tiles;

});
