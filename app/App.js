define(['app/AppData', 'system/myHelper', 'system/GameStateManager', 'system/Canvas', 'system/Sprites', 'system/Sounds',
		'system/Vector2', 'system/Keyboard', 'system/Mouse', 'system/Key', 'system/Rectangle',
		'app/states/DrawPageState'],
	function(AppData, myHelper, GameStateManager, Canvas, sprites, sounds,
		Vector2, keyboard, mouse, Key, Rectangle,
		DrawPageState){

	function App (store)
		{
			this.store = store;
			this.appDataObj = new AppData(this);
			this.appData = this.appDataObj.get();
			this.spritesStillLoading = 0;
			this.totalSprites = 0;
			this.loadSprites();
			this.loadSounds();
			this.assetLoadingLoop();
			this.ID = {};
			this.source = null;
			this.canvas = canvas;
			this.mouseWheel = mouse.wheel;
			this.makeSnapshot = false;
			this.goToCart = false;
			this.online = true;
		}

	App.prototype.loadSprites = function () {

		sprites.top						= this.prepareSprite('rjs/assets/sprites/top.png');

		sprites.tilebarIcon = {};
		sprites.tilebarIcon.rotateLeft	= this.prepareSprite('rjs/assets/sprites/tilebar/rotateLeft.png');
		sprites.tilebarIcon.rotateRight	= this.prepareSprite('rjs/assets/sprites/tilebar/rotateRight.png');
		sprites.tilebarIcon.remove		= this.prepareSprite('rjs/assets/sprites/tilebar/delete.png');
		sprites.tilebarIcon.info		= this.prepareSprite('rjs/assets/sprites/tilebar/info.png');

		sprites.tiles = {};
		var that = this;
		$.each( this.appData.tiles, function ( key, val ) {
			sprites.tiles[val.id] = that.prepareSprite('tiles/' + val.icon);
		});

	};

	App.prototype.loadSounds = function () {
	};

	App.prototype.prepareSprite = function (imageName) {
		var pathSplit = imageName.split('/');
		var fileName = pathSplit[pathSplit.length - 1];
		var fileSplit = fileName.split("/")[0].split(".")[0].split("@");
		var colRow = fileSplit[fileSplit.length - 1].split("x");
		var sheetRows = 1;
		var sheetColumns = parseInt(colRow[0]);
		if (isNaN(sheetColumns)) sheetColumns = 1;
	    if (colRow.length === 2) sheetRows = parseInt(colRow[1]);

		return {
			img : this.loadSprite(imageName),
			cols : sheetColumns,
			rows : sheetRows
		};
	};

	App.prototype.loadSprite = function (imageName) {
		var image = new Image();
		image.src = imageName;
		this.spritesStillLoading += 1;
		this.totalSprites += 1;
		image.onload = function () {
			this.spritesStillLoading -= 1;
		}.bind(this);
		return image;
	};

	App.prototype.assetLoadingLoop = function () {
		canvas.clear();
		canvas.drawText(this.appDataObj.line('loading') + ' ' + Math.round((this.totalSprites - this.spritesStillLoading) /
		this.totalSprites * 100) + "%", new Vector2(250,250));
		if (this.spritesStillLoading > 0)
			requestAnimationFrame(this.assetLoadingLoop.bind(this));
		else {
			canvas.clear();
			this.initialize();
		}
	};

	App.prototype.initialize = function () {

		this.appStateManager = new GameStateManager();
		this.appStateManager.add('app_draw_page', new DrawPageState(this), true);
		this.appStateManager.switchTo('app_draw_page').reset();

		window.onresize = this.reset.bind(this);

		requestAnimationFrame(this.mainLoop.bind(this));
		};


	App.prototype.reset = function () {
		this.canvas.resize();
		this.appStateManager.reset();
	};

	App.prototype.handleInput = function (type) {
	};

	App.prototype.mainLoop = function () {

		var delta = 1 / 60;
		canvas.clear();
		this.appDataObj.update(delta);
		this.appStateManager.handleInput(delta);
		this.appStateManager.update(delta);
		this.appStateManager.draw();
		keyboard.reset();
		mouse.reset();

		var	that = this;
		requestAnimationFrame(that.mainLoop.bind(that));

	};



	return App;

});
