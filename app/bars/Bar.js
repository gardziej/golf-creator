define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/AppObjectList'],
	function(myHelper, Canvas, Vector2, mouse, AppObjectList){

	function Bar (parent, position, size)
		{
			this.app = parent;
			this.buttons = new AppObjectList(parent);
            this.color = "white";
			this.width = size.x;
			this.height = size.y;
            this.lineColor = "#b3b3b3";
			this.lineWidth = 1;
			this.dragging = false;
			this.draggable = false;
			this.visible = true;
			this.offset = Vector2.zero;
			this.position = new Vector2 (position.x, position.y);
			this.startPosition = new Vector2 (position.x, position.y);
			this.shadow = {
				color : 'rgba(0, 0, 0, 0.5)',
				blur : 5,
				offsetX : 3,
				offsetY : 3
			}
		}

    Bar.prototype.reset = function () {
	};

	Bar.prototype.checkMouse = function () {

		var gridTest = this.buttons.checkMouse();
		if (gridTest) { return gridTest; }

		if (mouse.position.x >= this.position.x &&
			mouse.position.x <= (this.position.x + this.width) &&
			mouse.position.y >= this.position.y &&
			mouse.position.y <= (this.position.y + this.height)
		)
			{
				return this;
			}


		return false;
    };

	Bar.prototype.update = function (delta) {
		this.buttons.update(delta);
	};


    Bar.prototype.draw = function () {
		if (this.visible)
			{
				canvas.drawRectangle(this.position.x, this.position.y, this.width, this.height, this.color, this.lineColor, this.lineWidth, this.shadow);
				this.buttons.draw();
			}
    };

	return Bar;

});
