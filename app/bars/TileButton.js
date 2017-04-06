define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Rectangle', 'app/bars/Button'],
	function(myHelper, Canvas, Vector2, Rectangle, Button){

	function TileButton (app, bar, position, size, sprite, clickAction)
		{
			Button.call(this, app, bar, position, size, sprite, clickAction);
		}

	TileButton.prototype = Object.create(Button.prototype);


    TileButton.prototype.clicked = function () {
		switch (this.clickAction) {
			case 'rotateLeft':
				this.bar.tile.rotateLeft();
				this.app.store.dispatch({type:"CHANGE_TILE_ROTATION", payload: this.bar.tile});
				break;
			case 'rotateRight':
				this.bar.tile.rotateRight();
				this.app.store.dispatch({type:"CHANGE_TILE_ROTATION", payload: this.bar.tile});
				break;
			case 'info':
				this.bar.tile.showInfo();
				break;
			case 'delete':
				this.app.store.dispatch({type:"DELETE_TILE", payload: this.bar.tile});
				this.app.tiles.remove(this.bar.tile);
				break;
		}
	};

	return TileButton;

});
