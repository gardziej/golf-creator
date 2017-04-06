define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/GameObjectList'],
	function(myHelper, Canvas, Vector2, mouse, GameObjectList){

	function Placeholders (parent)
		{
			this.app = parent;
			this.grid = [];
		}

    Placeholders.prototype.reset = function () {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].reset();
			}
	};

    Placeholders.prototype.checkMouse = function () {
		var test = false;
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				test = this.grid[i].checkMouse();
				if (test)
					{
						return this.grid[i];
					}
			}
		return test;
	};

	Placeholders.prototype.add = function (obj) {
		this.grid.push(obj);
    };

	Placeholders.prototype.clear = function (obj) {
		this.grid = [];
    };

	Object.defineProperty(Placeholders.prototype, "length",
        {
            get: function () {
                return this.grid.length;
            }
        });

    Placeholders.prototype.update = function (delta) {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].update(delta);
			}
    };

    Placeholders.prototype.draw = function () {
		for (var i = 0, len = this.grid.length; i<len; i++)
			{
				this.grid[i].draw();
			}
    };

	return Placeholders;

});
