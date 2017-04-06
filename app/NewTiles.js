define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/AppObjectList'],
	function(myHelper, Canvas, Vector2, mouse, AppObjectList){

	function NewTiles (parent)
		{
			AppObjectList.call(this, parent);
			this.app = parent;
			this.grid = [];
		}

	NewTiles.prototype = Object.create(AppObjectList.prototype);

	NewTiles.prototype.findInCords = function (cords) {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				if (!this.grid[i].dragging && this.grid[i].cords.equals(cords))
					{
						return this.grid[i];
					}
			}
		return false;
    };

	NewTiles.prototype.unselect = function (exception, mouseIsOver) {
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

	return NewTiles;

});
