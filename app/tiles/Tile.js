define(['jquery', 'system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse',
		'system/Sprites', 'system/Rectangle', 'app/Placeholders', 'app/Placeholder', 'app/bars/TileBar',
		'app/tiles/TileBounds'],
		function($, myHelper, Canvas, Vector2, mouse,
			sprites, Rectangle, Placeholders, Placeholder, TileBar, TileBounds){

	function Tile (app, parent, cordsPosition, sprite, id, bounds, index)
		{
			this.app = app;
			this.parent = parent;
			this.id = id;
			this.boundsString = bounds;
			this.bounds = new TileBounds(app, this, bounds);
			if (typeof index === "undefined")
				{
					this.index = Tile.index;
					Tile.index++;
				}
				else
				{
					this.index = index;
				}
			this.position = Vector2.zero;
			this.sprite = sprite;
			this.width = this.app.grid.gridSize;
			this.height = this.app.grid.gridSize;
			this.dragging = false;
			this.draggable = true;
			this.clickable = true;
			this.selected = false;
			this.rotationState = 0;
			this.rotation = 0;
			this.origin = Vector2.zero;
			this.offset = Vector2.zero;
			this.cords = cordsPosition;
			this.fromCordsWhenStartDragging = new Vector2(this.cords);
			this.fromPositionWhenStartDragging = Vector2.zero;
			this.setPostitionFromCords(cordsPosition);
	        this.startPlaceholder = false;
	        this.endPlaceholder = false;
			this.tileBar = false;
			this.tileBarGridSize = 100;
			this.shadow = false;
			this.shadowOn = {
				color : 'rgba(0, 0, 0, 0.7)',
				blur : 5,
				offsetX : 3,
				offsetY : 3
			}
			this.setRotationAndOrigin(myHelper.getRandomInt(0,3));

		}

	Tile.index = 1;



	Tile.prototype.rotateRight = function () {
		this.rotationState = ++this.rotationState % 4;
		this.setRotationAndOrigin(this.rotationState);
		this.bounds.rotateRight();
	}

	Tile.prototype.rotateLeft = function () {
		this.rotationState = --this.rotationState;
		if (this.rotationState < 0) this.rotationState = 3;
		this.setRotationAndOrigin(this.rotationState);
		this.bounds.rotateLeft();
	}

	Tile.prototype.showInfo = function () {
		var data = this.app.appDataObj.tileData(this.id);
		var lang = this.app.lang;
		var lang_data = data.lang_data[lang];
		var title = lang_data.title + ' ('+ lang_data.price +'zł)';
		var body = '<p style="text-align: center;"><img style="max-width: 100%" src="'+ this.app.appData.path.photos + data.photo +'"></p>';
		body += lang_data.description;
		this.app.modal.show(title, body);
	}

	Tile.prototype.setRotationAndOrigin = function (rotationState) {
		switch (rotationState) {
			case 0:
				this.rotation = 0;
				this.origin = Vector2.zero;
				break;
			case 1:
				this.rotation = Math.PI/180 * 90;
				this.origin = new Vector2(0, this.app.grid.gridSize);
				break;
			case 2:
				this.rotation = Math.PI/180 * 180;
				this.origin = new Vector2(this.app.grid.gridSize, this.app.grid.gridSize);
				break;
			case 3:
				this.rotation = Math.PI/180 * 270;
				this.origin = new Vector2(this.app.grid.gridSize, 0);
				break;
			default:

		}
	}

	Tile.prototype.setPostitionFromCords = function (cordsPosition) {
		this.position.x = this.app.grid.startPosition.x + (cordsPosition.x) * this.app.grid.gridSize;
		this.position.y = this.app.grid.startPosition.y - (cordsPosition.y+1) * this.app.grid.gridSize;
		this.setPosition(this.position);
		return this.position;
    };

	Tile.prototype.calculateGridPosition = function (position) {
		var cords = Vector2.zero;
		cords.x = Math.round((position.x - this.app.grid.startPosition.x) / this.app.grid.gridSize);
		cords.y = Math.round(-1 * (position.y - this.app.grid.startPosition.y) / this.app.grid.gridSize -1);
		cords.x = myHelper.clearNegativeZero(cords.x);
		cords.y = myHelper.clearNegativeZero(cords.y);
		return cords;
	};

	Tile.prototype.setPosition = function (position) {
		this.position.x = position.x;
		this.position.y = position.y;
		this.cords = this.calculateGridPosition(this.position);
		return this.position;
    };

	Tile.prototype.checkMouse = function () {
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

	Tile.prototype.unselect = function () {
		this.selected = false;
    };

	Tile.prototype.select = function () {
		this.selected = true;
    };

	Tile.prototype.reset = function () {

	};

	Tile.prototype.update = function (delta) {
		this.width = this.app.grid.gridSize;
		this.height = this.app.grid.gridSize;

		this.setRotationAndOrigin(this.rotationState);

		var position = Vector2.zero;

		if(!this.dragging)
		{
			if (this.endPlaceholder)
				{
					this.setPostitionFromCords(new Vector2(this.endPlaceholder.cords));
					this.endPlaceholder = false;
					if (!this.selected) this.shadow = false;
					if(isFinite(this.fromCordsWhenStartDragging.x) && !this.cords.equals(this.fromCordsWhenStartDragging))
						{
							this.app.store.dispatch({type:"CHANGE_TILE_CORDS", payload: this});
						}
				}
			if (this.startPlaceholder) this.startPlaceholder = false;

			this.fromCordsWhenStartDragging = new Vector2(this.cords);
			this.offset.x = mouse.position.x - this.position.x;
			this.offset.y = mouse.position.y - this.position.y;
			this.setPostitionFromCords(this.cords);
			this.fromPositionWhenStartDragging = new Vector2(this.position);
		}

		if(this.dragging)
			{
				position.x = mouse.position.x - this.offset.x;
				position.y = mouse.position.y - this.offset.y;

				this.shadow = Object.create(this.shadowOn);

				if (!this.startPlaceholder)
					{
						this.startPlaceholder = new Placeholder(
							this.app,
							new Vector2(this.fromCordsWhenStartDragging),
							'#b3b3b3'
						);

						if (this !== this.app.tiles.last())
							{
								this.app.tiles.moveToEnd(this);
							}

					}

				var newPosition = this.calculateGridPosition(position);
				if (!this.endPlaceholder)
					{
						this.endPlaceholder = new Placeholder(this.app, new Vector2(newPosition), 'lightblue');
					}
				if (this.endPlaceholder)
					{
						var testCords = this.app.tiles.findInCords(new Vector2(newPosition));
						if (!testCords)
							{
								this.endPlaceholder.setPostitionFromCords(new Vector2(newPosition));
							}
					}

				this.setPosition(position);

				if (myHelper.distanceBetweenPoints(this.fromPositionWhenStartDragging, position) < 3)
					{
						this.select();
						if (!this.tileBar) this.createTileBar();
					}
					else
					{
						this.unselect();
						if (this.tileBar) this.removeTileBar();
					}
			}

		if (this.tileBar && !this.selected) this.removeTileBar();
		if (!this.selected && !this.dragging) this.shadow = false;

		if (typeof this.startPlaceholder.update == 'function') this.startPlaceholder.update(delta);
		if (typeof this.endPlaceholder.update == 'function') this.endPlaceholder.update(delta);

		if (this.tileBar)
			{
				this.tileBar.position = this.calculateTileBarPosition();
				this.tileBar.size = this.calculateTileBarSize();
				this.tileBar.update(delta);
			}


	};

    Tile.prototype.removeTileBar = function () {
		this.app.bars.remove(this.tileBar);
		this.tileBar = false;
	}

    Tile.prototype.calculateTileBarSize = function () {
		var size = new Vector2(this.tileBarGridSize * 2, this.tileBarGridSize / 2);
		return size;
	}

    Tile.prototype.calculateTileBarPosition = function () {
		var position = Vector2.zero;
		position.x = this.position.x + this.app.gridSize /2 - this.tileBarGridSize;
		if (this.position.y <= this.app.gridSize)
			{
				position.y = this.position.y + this.tileBarGridSize * 1.25;
			}
			else
			{
				position.y = this.position.y - this.tileBarGridSize * .75;
			}

		return position;
	}

    Tile.prototype.createTileBar = function () {

		var position = this.calculateTileBarPosition();
		var size = this.calculateTileBarSize();

		this.tileBar = new TileBar(this.app, this, position, size);
		this.app.bars.add(this.tileBar);
	}


    Tile.prototype.draw = function () {

		if (this.parent === this.app.tiles || this.app.mouseIsOver === this.app.grid)
			{
				if (typeof this.startPlaceholder.draw == 'function') this.startPlaceholder.draw();
				if (typeof this.endPlaceholder.draw == 'function') this.endPlaceholder.draw();
			}

		canvas.drawImage (this.sprite,
			this.position,
			this.rotation,
			this.origin,
			new Rectangle(0, 0, this.app.grid.gridSize, this.app.grid.gridSize),
			this.shadow);

	//	var pos = "[" + this.cords.x + ", " + this.cords.y + "]";
	//	canvas.drawText(pos, new Vector2(this.position.x + 5, this.position.y + 5), Vector2.zero, "white", "left", "Verdana", "14px");
    };

	return Tile;

});
