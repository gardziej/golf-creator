define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'app/tiles/Tile'],
	function(myHelper, Canvas, Vector2, mouse, Tile){

	function Action (app)
		{
			this.app = app;
			this.offset = Vector2.zero;
			this.mouseIsDragging = false;
			this.isDragged = false;
		}

	Action.prototype.onSwith = function () {

	};

    Action.prototype.mouseClick = function () {

		if (mouse.left.pressed)
			{
				if (typeof this.app.mouseIsOver.clicked == 'function')
					{

						this.app.mouseIsOver.clicked();
					}
			}

		if (mouse.left.down)
			{
				this.app.tiles.unselect(this.isDragged, this.app.mouseIsOver);
			}
	};

    Action.prototype.wheelMouse = function () {
        var oldGridSize = this.app.gridSize;
        if (this.app.mouseWheel !== mouse.wheel)
            {
                if (this.app.mouseWheel > mouse.wheel)
                    {
                        this.app.gridSize++;
                    }
                    else if (this.app.gridSize > 5)
                    {
                        this.app.gridSize--;
                    }

                this.app.grid.startPosition.x = mouse.position.x - this.app.gridSize * ((mouse.position.x - this.app.grid.startPosition.x) / oldGridSize);
                this.app.grid.startPosition.y = mouse.position.y - this.app.gridSize * ((mouse.position.y - this.app.grid.startPosition.y) / oldGridSize);

                this.app.reset();
                this.app.mouseWheel = mouse.wheel;
            }
    }

    Action.prototype.mouseDrag = function () {

		if (mouse.left.down && !this.mouseIsDragging)
			{
				this.mouseIsDragging = true;
				if (this.app.mouseIsOver.draggable)
					{
						canvas.setCursor('grabbing');
						this.app.mouseIsOver.dragging = true;
						this.isDragged = this.app.mouseIsOver;
					}
			}
		else if (!mouse.left.down)
			{
				this.mouseIsDragging = false;
				if (typeof this.isDragged.dragging !== 'undefined') this.isDragged.dragging = false;

				if (this.app.mouseIsOver.clickable)
					{
						canvas.setCursor('pointer');
					}
					else
					{
						canvas.setCursor('default');
					}

				if (this.app.newTiles.count > 0)
					{
						var tile = this.app.newTiles.last();
						this.app.newTiles.remove(tile);
						tile.parent = this.app.tiles;
						tile.dragging = false;
						if (this.app.mouseIsOver === this.app.grid)
							{
								this.app.tiles.add(tile);
								this.app.store.dispatch({type:"ADD_TILE", payload: tile});
							}
					}

			}

		if(!this.app.grid.dragging)
			{
				this.offset.x = mouse.position.x - this.app.grid.startPosition.x;
				this.offset.y = mouse.position.y - this.app.grid.startPosition.y;
			}
		else
			{
				this.app.grid.startPosition.x = mouse.position.x - this.offset.x;
				this.app.grid.startPosition.y = mouse.position.y - this.offset.y;
			}

	};

    Action.prototype.update = function (delta) {
		this.mouseClick();
		this.wheelMouse();
		this.mouseDrag();

		// if (this.app.tiles.tilesManager.size.y > Math.floor(canvas.height * 0.80) ||
		// 	this.app.tiles.tilesManager.size.x > Math.floor(canvas.width * 0.80))
		// {
		// 	this.app.grid.centerGrid();
		// 	this.app.gridSize -= .5;
		// 	this.app.reset();
		// }
    };

    Action.prototype.draw = function () {
    };

    Action.prototype.reset = function () {
		canvas.setCursor('default');
    };

	return Action;

});
