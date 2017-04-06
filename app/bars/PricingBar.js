define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'app/bars/Bar',
		'app/bars/DummyButton', 'system/Sprites'],
	function(myHelper, Canvas, Vector2, mouse, Bar,
		DummyButton, sprites){

	function PricingBar (parent, tilesManager)
		{
			var size = new Vector2(180,30);
			var position = this.calculatePosition(size, tilesManager);
			Bar.call(this, parent, position, size); // call parent constructor
			this.size = size;
			this.tilesManager = tilesManager;
			this.lineWidth = 1;
			this.clickable = true;
			this.textSize = '14px';
			this.textColor = "#068937";
			this.textPosition = new Vector2 (
				(this.position.x + this.width / 2), (this.position.y + this.height / 2)
			);
		}

	PricingBar.prototype = Object.create(Bar.prototype);

	PricingBar.prototype.calculatePosition = function (size, tilesManager) {
		var position = new Vector2(
			canvas.width - tilesManager.sumBar.width -size.x - 20,
			canvas.height - size.y - 10
		);
		return position;
	};

	PricingBar.prototype.clicked = function () {
		this.app.makeSnapshot = true;
	}

	PricingBar.prototype.update = function (delta) {
		this.position = this.calculatePosition(this.size, this.tilesManager);
		this.textPosition = new Vector2 (
			(this.position.x + this.width / 2), (this.position.y + this.height / 2)
		);		
		this.text = this.app.appDataObj.line('get_pricing');
	}

	PricingBar.prototype.draw = function () {
		if (this.visible)
			{
				Bar.prototype.draw.call(this);
				canvas.drawText(this.text, this.textPosition, undefined, this.textColor, "center", "Verdana", this.textSize, "middle");
			}
    };


	return PricingBar;

});
