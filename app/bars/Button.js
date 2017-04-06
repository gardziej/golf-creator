define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/Rectangle'],
	function(myHelper, Canvas, Vector2, mouse, Rectangle){

	function Button (app, bar, position, size, sprite, clickAction)
		{
			this.app = app;
			this.bar = bar;
			this.sprite = sprite;
			this.rotation = 0;
			this.origin = Vector2.zero;
			this.width = size.x;
			this.height = size.y;
			this.draggable = false;
			this.clickable = true;
			this.position = new Vector2 (position.x, position.y);
			this.shadow = false;
			this.clickAction = clickAction;
			this.visible = true;
		}

    Button.prototype.clicked = function () {
	};

    Button.prototype.reset = function () {
	};

	Button.prototype.checkMouse = function () {

		if (mouse.position.x >= this.position.x &&
			mouse.position.x <= (this.position.x + this.width) &&
			mouse.position.y >= this.position.y &&
			mouse.position.y <= (this.position.y + this.height)
		)
			{
				return true;
			}
			else
			{
				return false;
			}
    };

	Button.prototype.update = function (delta) {

	};


    Button.prototype.draw = function () {
		if (this.visible)
			{
				canvas.drawImage (this.sprite,
					this.position,
					this.rotation,
					this.origin,
					new Rectangle(0, 0, this.height, this.width),
					this.shadow);
			}
    };

	return Button;

});
