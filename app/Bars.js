define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/GameObjectList'],
	function(myHelper, Canvas, Vector2, mouse, GameObjectList){

	function Bars (parent)
		{
			this.app = parent;
			this.grid = [];
		}

    Bars.prototype.reset = function () {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].reset();
			}
	};

    Bars.prototype.checkMouse = function () {
		var test = false;
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				test = this.grid[i].checkMouse();
				if (test)
					{
						return test;
					}
			}
		return test;
	};

	Bars.prototype.add = function (obj) {
		this.grid.push(obj);
		return obj;
    };

	Bars.prototype.remove = function (obj) {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				if (this.grid[i] === obj)
					{
						this.grid.splice(i, 1);
					}
			}
    };

	Bars.prototype.hide = function () {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].visible = false;
			}
    };

	Bars.prototype.show = function () {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].visible = true;
			}
	};

    Bars.prototype.update = function (delta) {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].update(delta);
			}
    };

    Bars.prototype.draw = function () {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].draw();
			}
    };

	return Bars;

});
