define(['system/myHelper', 'system/Canvas', 'system/Vector2'],
	function(myHelper, Canvas, Vector2){

	function Grid (parent)
		{
			this.app = parent;
			this.dragged = false;
			this.draggable = true;
            this.mineLineColor = "#aaa";
			this.lineColor = "#ccc";
			this.line5Color = "#aaa";
			this.mineLineWidth = 2;
			this.lineWidth = 1;
			this.visible = true;
			this.startPosition = Vector2.zero;
			this.size = new Vector2 (canvas.width, canvas.height);
			this.arrowSize = 5;
			this.startPosition.x = Math.floor(this.size.x / 6);
			this.startPosition.y = Math.floor(this.size.y * 0.75);
			this.reset();
			this.mouseIsOver = false;
			this.moveSpeed = 5;
			this.step = 50;
		}

	Grid.prototype.reset = function (delta) {
		this.gridSize = this.app.gridSize;
		this.size = new Vector2 (canvas.width, canvas.height);
	};

	Grid.prototype.fit = function () {
		var d = Vector2.zero;
		d.x = this.app.tiles.tilesManager.size.x / canvas.width;
		d.y = this.app.tiles.tilesManager.size.y / canvas.height;

		if (d.x > d.y)
		{
			this.app.gridSize = Math.floor((canvas.width * 0.60) / (this.app.tiles.tilesManager.size.x / this.app.gridSize));
		}
		else
		{
			this.app.gridSize = Math.floor((canvas.height * 0.50) / (this.app.tiles.tilesManager.size.y / this.app.gridSize));
		}

		this.app.reset();

		if (Math.round(this.app.tiles.tilesManager.center.x) > Math.round(canvas.width / 2))
		{
			this.app.grid.startPosition.x -= Math.round(this.app.tiles.tilesManager.center.x) - Math.round(canvas.width / 2);
		}
		else if (Math.round(this.app.tiles.tilesManager.center.x) < Math.round(canvas.width / 2))
		{
			this.app.grid.startPosition.x += (canvas.width / 2) - this.app.tiles.tilesManager.center.x;
		}

		if (Math.round(this.app.tiles.tilesManager.center.y) > Math.round(canvas.height / 2))
		{
			this.app.grid.startPosition.y -= Math.round(this.app.tiles.tilesManager.center.y) - Math.round(canvas.height / 2);
		}
		else if (Math.round(this.app.tiles.tilesManager.center.y) < Math.round(canvas.height / 2))
		{
			this.app.grid.startPosition.y += Math.abs(Math.round(canvas.height / 2) - Math.round(this.app.tiles.tilesManager.center.y));
		}

		this.app.reset();
	}

	Grid.prototype.centerGrid = function () {

		if (Math.round(this.app.tiles.tilesManager.center.x) > Math.round(canvas.width / 2))
			{
				this.app.grid.startPosition.x -= this.moveSpeed;
			}
			else if (Math.round(this.app.tiles.tilesManager.center.x) < Math.round(canvas.width / 2))
			{
				this.app.grid.startPosition.x  += this.moveSpeed;
			}

		if (Math.round(this.app.tiles.tilesManager.center.y) > Math.round(canvas.height / 2))
			{
				this.app.grid.startPosition.y -= this.moveSpeed;
			}
			else if (Math.round(this.app.tiles.tilesManager.center.y) < Math.round(canvas.height / 2))
			{
				this.app.grid.startPosition.y += this.moveSpeed;
			}
	};

	Grid.prototype.drawMine = function () {
        canvas.ctx.save();
		canvas.ctx.strokeStyle = this.mineLineColor;
		canvas.ctx.lineWidth = this.mineLineWidth;

        canvas.ctx.beginPath();
        canvas.ctx.moveTo(this.startPosition.x, 0);
        canvas.ctx.lineTo(this.startPosition.x, this.size.y);

        canvas.ctx.moveTo(0, this.startPosition.y);
        canvas.ctx.lineTo(this.size.x, this.startPosition.y);
        canvas.ctx.stroke();
        canvas.ctx.closePath();

        canvas.ctx.restore();
	}

	Grid.prototype.drawGrid = function () {
		var tempX, tempY, k;
        canvas.ctx.save();
		canvas.ctx.strokeStyle = this.lineColor;
		canvas.ctx.lineWidth = this.lineWidth;

		var x = this.startPosition.x;
		var y = this.startPosition.y;

		tempX = x;
		k = 0;
		while (tempX > 0)
			{
				canvas.ctx.beginPath();
				if (k % 2 === 0)
					{
						canvas.ctx.strokeStyle = this.line5Color;
						if (k !== 0) canvas.drawText(-1 * k * this.step +'cm', new Vector2(tempX+5, y+10), Vector2.zero, this.line5Color, "left", "Verdana", "10px");
					}
					else
					{
						canvas.ctx.strokeStyle = this.lineColor;
					}
				canvas.ctx.moveTo(tempX, 0);
				canvas.ctx.lineTo(tempX, this.size.y);
				tempX -= this.gridSize;
				k++;
		        canvas.ctx.stroke();
		        canvas.ctx.closePath();
			}

		tempX = x;
		k = 0;
		while (tempX <= canvas.width)
			{
				canvas.ctx.beginPath();
				if (k % 2 === 0)
					{
						canvas.ctx.strokeStyle = this.line5Color;
						if (k !== 0) canvas.drawText(k* this.step+'cm', new Vector2(tempX+5, y+10), Vector2.zero, this.line5Color, "left", "Verdana", "10px");
					}
					else
					{
						canvas.ctx.strokeStyle = this.lineColor;
					}
				canvas.ctx.moveTo(tempX, 0);
				canvas.ctx.lineTo(tempX, this.size.y);
				tempX += this.gridSize;
				k++;
		        canvas.ctx.stroke();
		        canvas.ctx.closePath();
			}

		tempY = y;
		k = 0;
		while (tempY > 0)
			{
				canvas.ctx.beginPath();
				if (k % 2 === 0)
					{
						canvas.ctx.strokeStyle = this.line5Color;
						if (k !== 0) canvas.drawText(k*this.step+'cm', new Vector2(x+5, tempY+10), Vector2.zero, this.line5Color, "left", "Verdana", "10px");
					}
					else
					{
						canvas.ctx.strokeStyle = this.lineColor;
					}
				canvas.ctx.moveTo(0, tempY);
				canvas.ctx.lineTo(this.size.x, tempY);
				tempY -= this.gridSize;
				k++;
		        canvas.ctx.stroke();
		        canvas.ctx.closePath();
			}

		tempY = y;
		k = 0;
		while (tempY <= canvas.height)
			{
				canvas.ctx.beginPath();
				if (k % 2 === 0)
					{
						canvas.ctx.strokeStyle = this.line5Color;
						canvas.drawText(-1 * k * this.step + "cm", new Vector2(x+5, tempY+10), Vector2.zero, this.line5Color, "left", "Verdana", "10px");
					}
					else
					{
						canvas.ctx.strokeStyle = this.lineColor;
					}
				canvas.ctx.moveTo(0, tempY);
				canvas.ctx.lineTo(this.size.x, tempY);
				tempY += this.gridSize;
				k++;
		        canvas.ctx.stroke();
		        canvas.ctx.closePath();
			}



        canvas.ctx.restore();
	};

	Grid.prototype.drawArrows = function () {
		var tempX, tempY;
        canvas.ctx.save();
		canvas.ctx.fillStyle = this.mineLineColor;
		canvas.ctx.lineWidth = this.lineWidth;

		var x = this.startPosition.x;
		var y = this.startPosition.y;

		canvas.ctx.beginPath();
		tempX = x;
		tempY = 0;
		canvas.ctx.moveTo(tempX, tempY);
		canvas.ctx.lineTo(tempX - this.arrowSize, tempY + this.arrowSize *2);
		canvas.ctx.lineTo(tempX + this.arrowSize, tempY + this.arrowSize *2);
        canvas.ctx.fill();
        canvas.ctx.closePath();

		canvas.drawText("Y", new Vector2(tempX-30, tempY+10), Vector2.zero, this.mineLineColor, "left", "Verdana", "20px", "top");


		canvas.ctx.beginPath();
		tempX = this.size.x;
		tempY = y;
		canvas.ctx.moveTo(tempX, tempY);
		canvas.ctx.lineTo(tempX - this.arrowSize *2, tempY - this.arrowSize);
		canvas.ctx.lineTo(tempX - this.arrowSize *2, tempY + this.arrowSize);
        canvas.ctx.fill();
        canvas.ctx.closePath();

		canvas.drawText("X", new Vector2(tempX-30, tempY-20), Vector2.zero, this.mineLineColor, "left", "Verdana", "20px", "right");


        canvas.ctx.restore();
	};
	Grid.prototype.update = function (delta) {
	};


    Grid.prototype.draw = function () {
		if (this.visible)
			{
				this.drawGrid();
				this.drawMine();
				this.drawArrows();
			}
    };

	return Grid;

});
