define(['jquery', 'app/Modal', 'system/Sprites', 'system/Vector2', 'system/Rectangle',
        'system/Keyboard', 'system/Mouse', 'system/Key', 'system/Sounds',
        'system/Canvas', 'app/Grid', 'app/ActionsManager', 'app/actions/Action',
        'app/Bars', 'app/bars/MainBar', 'app/Tiles', 'app/NewTiles', 'app/tiles/Tile', 'app/Placeholders',
        'app/Top', 'app/bars/HelpBar', 'app/bars/ToCartBar'],
    function ($, Modal, sprites, Vector2, Rectangle,
        keyboard, mouse, Key, sounds,
        Canvas, Grid, ActionsManager, Action,
        Bars, MainBar, Tiles, NewTiles, Tile, Placeholders,
        Top, HelpBar, ToCartBar) {

    function DrawPageState(parent) {
        this.app = parent;
        this.initialize();
    }

    DrawPageState.prototype.initialize = function () {

        this.app.gridSize = Math.floor(canvas.width / 20);
        this.app.dummyButtonSize = 50;

        this.app.actionsManager = new ActionsManager();
        var action = new Action (this.app);
		this.app.actionsManager.add(0, action);
		this.app.actionsManager.switchTo(0);

        this.app.grid = new Grid(this.app);

        this.app.top = new Top(this.app);

        this.app.bars = new Bars(this.app);

        this.app.mainBar = new MainBar(
                            this.app,
                            new Vector2(10, 10),
                            new Vector2(70,canvas.height - 20));

        this.app.bars.add(this.app.mainBar);

        this.app.helpBar = new HelpBar(this.app);

        this.app.bars.add(this.app.helpBar);

        this.app.newTiles = new NewTiles(this.app);

        this.app.tiles = new Tiles(this.app);

        this.app.modal = new Modal(this.app);
    };

    DrawPageState.prototype.handleInput = function (delta) {
		if (keyboard.pressed(Key.del))
		{
            var tile = this.app.tiles.selected();
            if (tile)
                {
                    tile.removeTileBar();
                    this.app.store.dispatch({type:"DELETE_TILE", payload: tile});
			        this.app.tiles.remove(tile);
                }
		}

		if (keyboard.pressed(Key.left))
		{
            var tile = this.app.tiles.selected();
            if (tile)
                {
                    tile.rotateLeft();
                    this.app.store.dispatch({type:"CHANGE_TILE_ROTATION", payload: tile});
                }
		}

		if (keyboard.pressed(Key.space) || keyboard.pressed(Key.right))
		{
            var tile = this.app.tiles.selected();
            if (tile)
                {
                    tile.rotateRight();
                    this.app.store.dispatch({type:"CHANGE_TILE_ROTATION", payload: tile});
                }
		}

        if (keyboard.pressed(Key.L))
		{
            if (this.app.lang == 'pl')
                {
                    this.app.lang = 'en';
                }
                else
                {
                    this.app.lang = 'pl';
                }
        }

        if (keyboard.pressed(Key.Z) && keyboard.down(Key.ctrl))
		{
            var state = this.app.store.getState();
            if (state.past.length !== 0)
                {
                    this.app.store.dispatch({type:"UNDO"});
                    this.app.tiles.tilesManager.updateFromHistory();
                }
        }

        if (keyboard.pressed(Key.Y) && keyboard.down(Key.ctrl))
		{
            var state = this.app.store.getState();
            if (state.future.length !== 0)
                {
                    this.app.store.dispatch({type:"REDO"});
                    this.app.tiles.tilesManager.updateFromHistory();
                }
        }

    };

    DrawPageState.prototype.whereIsMouse = function () {
        var inBars = this.app.bars.checkMouse();
        if (inBars) { return inBars; }
        var inTiles = this.app.tiles.checkMouse();
        if (inTiles) { return inTiles; }
        return this.app.grid;
    }

    DrawPageState.prototype.update = function (delta) {
        this.app.mouseIsOver = this.whereIsMouse();
        this.app.grid.update(delta);
        this.app.newTiles.update(delta);
        this.app.tiles.update(delta);
        this.app.top.update(delta);
        this.app.bars.update(delta);
        this.app.actionsManager.update(delta);
    };

    DrawPageState.prototype.draw = function () {

        var uniqid = false;

        if (this.app.goToCart)
            {
                var $form = $(document.createElement('form'));
                $form.attr("action", this.app.appDataObj.line('shop_module_url'));
                $form.attr("method", "POST");
                $form.css("display", "none");

                var that = this;
                Object.keys(this.app.tiles.tilesManager.elements).forEach(function(id, i) {
                    var tileData = this.app.appDataObj.tileData(id);
                    var shop_id = tileData.lang_data[this.app.lang].shop_id;
                    $("<input>")
                        .attr("type", "text")
                        .attr("name", "elements["+ shop_id +"]")
                        .val(that.app.tiles.tilesManager.elements[id])
                        .appendTo($form);
        		});



                $form.appendTo( document.body );
                $form.submit();

                this.app.goToCart = false;
            }

        if (this.app.makeSnapshot)
            {
                var title = this.app.appDataObj.line('get_pricing');
        		var body = '<div id="pobieranie">... '+ this.app.appDataObj.line('creating_pricing') +' ...</div>';
        		this.app.modal.show(title, body);

                $('#appArea').hide();
                this.app.grid.visible = false;
                this.app.bars.hide();
                this.app.tiles.tilesManager.visible = false;
                this.app.top.visible = false;

                var gridSize = this.app.gridSize;
                var startPosition = new Vector2(this.app.grid.startPosition);

                this.app.grid.fit();
            }
		canvas.drawRectangle(0, 0, canvas.width, canvas.height, "white");
        this.app.grid.draw();
        this.app.tiles.draw();
        this.app.top.draw();
        this.app.bars.draw();
        this.app.newTiles.draw();
        this.app.actionsManager.draw();

        if (this.app.makeSnapshot)
            {
                var canvasData = canvas.canvas.toDataURL("image/jpeg");

                var data = {
                    imgData: canvasData,
                    elements: JSON.stringify(this.app.tiles.tilesManager.elements)
                };

                var that = this;
                $.ajax({
                    url: 'canvas/upload?lang=' + this.app.lang,
                    method: "POST",
                    data: data,
                    success:   function(r) {
                        $("#pobieranie").html('<a href="canvas/download/' + r + '" class="btn btn-default">'+ that.app.appDataObj.line('get_pricing') +'</a>');
                    },
                    error: function(xhr,status,error) {
                        $("#pobieranie").html('wystąpił błąd przy tworzeniu wyceny');
                    }
                });

                this.app.makeSnapshot = false;

                this.app.gridSize = gridSize;
        		this.app.grid.startPosition = new Vector2(startPosition);
        		this.app.grid.visible = true;
        		this.app.bars.show();
        		this.app.tiles.tilesManager.visible = true;
        		this.app.top.visible = true;
        		this.app.reset();
            }

    };

    DrawPageState.prototype.reset = function () {
        this.app.grid.reset();
        this.app.newTiles.reset();
        this.app.tiles.reset();
        this.app.bars.reset();
        this.app.actionsManager.reset();
    };

    return DrawPageState;
});
