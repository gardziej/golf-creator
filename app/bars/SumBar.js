define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'app/bars/Bar',
		'app/bars/DummyButton', 'system/Sprites', 'system/Rectangle'],
	function(myHelper, Canvas, Vector2, mouse, Bar,
		DummyButton, sprites, Rectangle){

	function SumBar (parent, tilesManager)
		{
			var size = new Vector2(160,30);
			var position = this.calculatePosition(size);
			Bar.call(this, parent, position, size); // call parent constructor
			this.size = size;
			this.tilesManager = tilesManager;
			this.color = "white";
			this.lineWidth = 1;
			this.clickable = false;
			this.sumHeight = 30;
			this.headerHeight = 30;
			this.rowHeight = 50;
			this.margin = 10;
			this.elementsCount = this.tilesManager.elementsCount;
		}

	SumBar.prototype = Object.create(Bar.prototype);

	SumBar.prototype.calculatePosition = function (size) {
		return new Vector2 (canvas.width - size.x - 10,
							canvas.height - size.y - 10
						);
	};

	SumBar.prototype.update = function (delta) {
		if (this.elementsCount != this.tilesManager.elementsCount)
			{
				this.height = this.size.y = this.headerHeight + this.sumHeight + this.rowHeight * this.tilesManager.elementsCount;
				this.position = new Vector2(this.calculatePosition(this.size));
				this.elementsCount = this.tilesManager.elementsCount;
			}
			this.position = this.calculatePosition(this.size);
	};

	SumBar.prototype.drawHeader = function () {
		var textPosition = new Vector2 (
			(this.position.x + this.width / 2), (this.position.y + this.headerHeight / 2)
		);
		canvas.drawText(this.app.appDataObj.line('puzzle_list'), textPosition, undefined, "#333", "center", "Verdana", '14px', "middle");
	}

	SumBar.prototype.drawSum = function () {
		var position = new Vector2(this.position.x, this.position.y + this.height - this.sumHeight);
		var textPosition = new Vector2 (
			(position.x + this.width / 2), (position.y + this.sumHeight / 2)
		);
		canvas.drawRectangle(position.x, position.y, this.width,  this.sumHeight, "#068937", undefined, undefined, false);
		canvas.drawText(this.sumText, textPosition, undefined, "white", "center", "Verdana", '14px', "middle");
	}

	SumBar.prototype.drawRows = function () {
		var position = Vector2.zero;
		position.x = this.position.x;
		var that = this;
		Object.keys(this.tilesManager.elements).forEach(function(id, i) {
			position.y = that.position.y + that.headerHeight + (i * that.rowHeight);
			that.drawRow(position, id, that.tilesManager.elements[id]);
		});
	}

	SumBar.prototype.drawRow = function (position, id, count) {
		var spriteSize = this.rowHeight - this.margin * 2;

		canvas.drawText(count + " x", new Vector2 (position.x + this.margin + spriteSize, position.y + this.margin + spriteSize / 2), undefined, "#333", "right", "Verdana", '14px', "middle");

		canvas.drawImage (sprites.tiles[id],
			new Vector2 (position.x + this.margin * 2 + spriteSize, position.y + this.margin),
			0,
			Vector2.zero,
			new Rectangle(0, 0, spriteSize, spriteSize),
			false);

		var data = this.app.appDataObj.tileData(id);
		var lang_data = data.lang_data[this.app.lang];
		var sum = lang_data.price * count;

		canvas.drawText(sum + ' ' + this.app.currency, new Vector2 (position.x + this.width - this.margin, position.y + this.margin + spriteSize / 2), undefined, "#333", "right", "Verdana", '14px', "middle");
	}

	SumBar.prototype.draw = function () {
		if (this.visible)
			{
				Bar.prototype.draw.call(this);
				if (this.tilesManager.elementsCount) this.drawRows();
				this.drawSum();
				this.drawHeader();
			}
    };

	SumBar.prototype.reset = function () {
	}

	return SumBar;

});
