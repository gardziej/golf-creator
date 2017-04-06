define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'app/bars/Bar',
		'app/bars/TileButton', 'system/Sprites'],
	function(myHelper, Canvas, Vector2, mouse, Bar,
		TileButton, sprites){

	function TileBar (parent, tile, position, size)
		{
			Bar.call(this, parent, position, size); // call parent constructor
			this.color = "#efefef";
			this.lineWidth = 0;
			this.tile = tile;

			this.buttonsList = {
				rotateLeft: new TileButton(
								this.app,
								this,
								new Vector2(this.position),
								new Vector2(this.height, this.height),
								sprites.tilebarIcon.rotateLeft,
								'rotateLeft'),
				info:		new TileButton(
								this.app,
								this,
								new Vector2(this.position.x + this.height, this.position.y),
								new Vector2(this.height, this.height),
								sprites.tilebarIcon.info,
								'info'),
				delete :  	new TileButton(
								this.app,
								this,
								new Vector2(this.position.x + this.height * 2, this.position.y),
								new Vector2(this.height, this.height),
								sprites.tilebarIcon.remove,
								'delete'),
				rotateRight: new TileButton(
								this.app,
								this,
								new Vector2(this.position.x + this.height * 3, this.position.y),
								new Vector2(this.height, this.height),
								sprites.tilebarIcon.rotateRight,
								'rotateRight')
			};

			this.buttons.add(this.buttonsList.rotateLeft);
			this.buttons.add(this.buttonsList.info);
			this.buttons.add(this.buttonsList.delete);
			this.buttons.add(this.buttonsList.rotateRight);

		}

	TileBar.prototype = Object.create(Bar.prototype);

	TileBar.prototype.update = function (delta) {
		this.buttonsList.rotateLeft.position = new Vector2(this.position);
		this.buttonsList.info.position = new Vector2(this.position.x + this.height, this.position.y);
		this.buttonsList.delete.position = new Vector2(this.position.x + this.height * 2, this.position.y);
		this.buttonsList.rotateRight.position = new Vector2(this.position.x + this.height * 3, this.position.y);
	};

	return TileBar;

});
