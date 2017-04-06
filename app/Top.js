define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/AppObjectList',
		'system/Sprites', 'system/Rectangle'],
	function(myHelper, Canvas, Vector2, mouse, AppObjectList,
		sprites, Rectangle){

	function Top (parent)
		{
			this.app = parent;
			this.position = Vector2.zero;
			this.size = Vector2.zero;
			this.prop = new Vector2(1500,137);
			this.width = this.size.x = canvas.width * 0.67;
			this.height = this.size.y = this.width * this.prop.y / this.prop.x;
            this.lineColor = "#b3b3b3";
			this.lineWidth = 1;
			this.dragging = false;
			this.draggable = false;
			this.visible = true;
			this.textColor = '#202020';
			this.textSize = "42px";
			this.sprite = sprites.top;
			this.rotation = 0;
			this.origin = Vector2.zero;
			this.shadow = {
				color : 'rgba(0, 0, 0, 0.5)',
				blur : 5,
				offsetX : 3,
				offsetY : 3
			}
		}

	Top.prototype.update = function (delta) {
		this.text = this.app.appDataObj.line('creator_title');
		this.width = canvas.width * 0.67;
		this.textSize = Math.floor(this.width / 20) + "px";
		this.height = this.width * this.size.y / this.size.x;
		this.position.y = 0;
		this.position.x = (canvas.width - this.width) / 2;
		this.textPosition = new Vector2 (this.position.x + this.width/2, this.position.y + this.height/2);
	};


    Top.prototype.draw = function () {
		if (this.visible)
			{
				canvas.drawImage (this.sprite,
					this.position,
					this.rotation,
					this.origin,
					new Rectangle(0, 0, this.width, this.height),
					this.shadow);
				canvas.drawText(this.text, this.textPosition, undefined, this.textColor, "center", "Work Sans", this.textSize, "middle");
			}
    };

	return Top;

});
