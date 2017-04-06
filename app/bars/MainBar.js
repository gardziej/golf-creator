define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'app/bars/Bar',
		'app/bars/DummyButton', 'system/Sprites'],
	function(myHelper, Canvas, Vector2, mouse, Bar,
		DummyButton, sprites){

	function MainBar (parent, position, size)
		{
			Bar.call(this, parent, position, size); // call parent constructor
			this.color = "#efefef";
			this.lineWidth = 0;
			this.buttonSize = this.calculateButtonSize();
			this.width = this.buttonSize + 20;
			this.calculateSize();
			this.generateButtons();
		}

	MainBar.prototype = Object.create(Bar.prototype);

	MainBar.prototype.calculateButtonSize = function () {
		var size = this.height / this.app.appData.tiles.length - 20;

		return size;
	};

	MainBar.prototype.calculateSize = function () {
		var size = Vector2.zero;
		return size;
	}

	MainBar.prototype.generateButtons = function () {
		var that = this;
		$.each( this.app.appData.tiles, function ( key, val ) {
			that.buttons.add(
				new DummyButton(
					that.app,
					that,
					new Vector2(that.position.x + (that.width - that.buttonSize)/2, that.position.y + 10 + (key * (that.buttonSize + 20) )),
					new Vector2(that.buttonSize, that.buttonSize),
					sprites.tiles[val.id],
					val.id,
					val.bounds)
				);

		});
	}


	return MainBar;

});
