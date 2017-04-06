define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse',
		'system/Rectangle', 'app/bars/Button', 'app/tiles/Tile', 'system/Sprites'],
	function(myHelper, Canvas, Vector2, mouse,
		Rectangle, Button, Tile, sprites){

	function DummyButton (app, bar, position, size, sprite, clickAction, bounds)
		{
			Button.call(this, app, bar, position, size, sprite, clickAction);
			this.bounds = bounds;
		}

	DummyButton.prototype = Object.create(Button.prototype);


    DummyButton.prototype.clicked = function () {
		var tile = new Tile(this.app, this.app.newTiles, new Vector2(Infinity,Infinity), sprites.tiles[this.clickAction], this.clickAction, this.bounds);
		tile.dragging = true;
		tile.position.x = mouse.position.x - .5 * this.app.gridSize;
		tile.position.y = mouse.position.y - .5 * this.app.gridSize;
		tile.offset.x = .5 * this.app.gridSize;
		tile.offset.y = .5 * this.app.gridSize;
		tile.rotation = 0;
		tile.origin = Vector2.zero;

		this.app.newTiles.add(tile);

	};


    DummyButton.prototype.draw = function () {
		canvas.drawImage (this.sprite,
			this.position,
			this.rotation,
			this.origin,
			new Rectangle(0, 0, this.height, this.width),
			this.shadow);
    };

	return DummyButton;

});
