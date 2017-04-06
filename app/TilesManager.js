define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'app/bars/SumBar',
 		'app/bars/PricingBar', 'app/bars/ToCartBar', 'app/tiles/Tile', 'system/Sprites'],
	function(myHelper, Canvas, Vector2, mouse, SumBar,
		PricingBar, ToCartBar, Tile, sprites){

	function TilesManager (parent, tiles)
		{
			this.app = parent;
			this.tiles = tiles;
			this.tilesGrid = tiles.grid;
			this.bound = {
				n: Infinity, e: -Infinity, s: -Infinity, w: Infinity
			};
			this.elements = {};
			this.elementsCount = 0;
			this.sum = 0;
            this.visible = true;
			this.lineColor = this.fillStyle = "navy";
			this.lineWidth = 2;
			this.arrowSize = 10;
			this.gridSize = Vector2.zero;
			this.center = Vector2.zero;
			this.size = Vector2.zero;
			this.sumBar = new SumBar(this.app, this);
			this.app.bars.add(this.sumBar);
			this.pricingBar = new PricingBar(this.app, this);
            this.app.bars.add(this.pricingBar);
			this.toCartBar = new ToCartBar(this.app, this);
			this.app.bars.add(this.toCartBar);
            this.errors = [];
		}


	TilesManager.prototype.updateFromHistory = function () {
        this.tiles.clear();
        var state = this.app.store.getState();

        for (var i = 0, len = state.present.length; i<len; i++)
			{
                var tile = new Tile(this.app, this.app.tiles, new Vector2(state.present[i].cords), sprites.tiles[state.present[i].id], state.present[i].id, state.present[i].boundsString, state.present[i].index);
                tile.rotationState = state.present[i].rotationState;
                tile.setRotationAndOrigin(state.present[i].rotationState);
                tile.bounds.setRotation(state.present[i].rotationState);
                this.tiles.add(tile);
            }

    };


	TilesManager.prototype.update = function () {
		var tile = false;
		var sum = 0;
		var bound = {
			n: Infinity, e: -Infinity, s: -Infinity, w: Infinity
		};
        var tileBound = {
			n: 0, e: 0, s: 0, w: 0
		};
		var elements = {};
		var elementsCount = 0;
        var consistentMat = true;
        this.errors = [];

		for (var i = 0, len = this.tilesGrid.length; i<len; i++)
			{
				tile = this.tilesGrid[i];
				var data = this.app.appDataObj.tileData(tile.id);
                var lang_data = data.lang_data[this.app.lang];

				sum = sum + parseFloat(lang_data.price);

				if (typeof elements[tile.id] !== "undefined")
					{
						elements[tile.id]++;
					}
					else
					{
						elements[tile.id] = 1;
						elementsCount++;
					}

				if (!tile.dragging)
					{
                        if (len > 1 && !this.checkConsistents(tile)) consistentMat = false;

						bound.n = tile.position.y < bound.n ? tile.position.y : bound.n;
    					bound.e = (tile.position.x + tile.width) > bound.e ? (tile.position.x + tile.width) : bound.e;
						bound.s = (tile.position.y + tile.height) > bound.s ? (tile.position.y + tile.height) : bound.s;
						bound.w = tile.position.x < bound.w ? tile.position.x : bound.w;
					}
			}

        for (var i = 0, len = this.tilesGrid.length; i<len; i++)
    		{
                tile = this.tilesGrid[i];


                if (tile.bounds.check(0) && tile.position.y == bound.n)
                    {
                        tileBound.n = 1;
                    }
                if (tile.bounds.check(1) && (tile.position.x + tile.width) == bound.e)
                    {
                        tileBound.e = 1;
                    }
                if (tile.bounds.check(2) && (tile.position.y + tile.height) == bound.s)
                    {
                        tileBound.s = 1;
                    }
                if (tile.bounds.check(3) && tile.position.x == bound.w)
                    {
                        tileBound.w = 1;
                    }
            }

		this.bound = { n: bound.n, e: bound.e, s: bound.s, w: bound.w };
		this.center = new Vector2(
			Math.round((bound.e - bound.w)/2 + bound.w),
			Math.round((bound.s - bound.n)/2 + bound.n)
		);

		this.size = new Vector2(bound.e - bound.w, bound.s - bound.n);
		this.gridSize = new Vector2(
			Math.round((bound.e - bound.w)/this.app.gridSize * 47),
			Math.round((bound.s - bound.n)/this.app.gridSize * 47)
		);

        if (tileBound.n) this.gridSize.y += 1;
        if (tileBound.e) this.gridSize.x += 1;
        if (tileBound.s) this.gridSize.y += 1;
        if (tileBound.w) this.gridSize.x += 1;

		this.sum = sum;
		this.elements = elements;
		this.elementsCount = elementsCount;

		if (this.visible && this.sum > 0)
		{
			this.sumBar.sumText = this.app.appDataObj.line('mat_price') + " " + this.sum + " " + this.app.currency;
			this.sumBar.visible = true;
			this.pricingBar.visible = true;
			this.toCartBar.visible = true;
		}
		else
		{
			this.sumBar.visible = false;
			this.pricingBar.visible = false;
            this.toCartBar.visible = false;
		}

    };

	TilesManager.prototype.checkConsistents = function (tile) {
        var x = tile.cords.x;
        var y = tile.cords.y;
        var tileOnRight = this.tiles.findInCords(new Vector2(x+1, y  ));
        var tileOnBottom = this.tiles.findInCords(new Vector2(x,   y+1));

        if (tileOnRight)
            {
                var check = this.checkBoundsBetween('H', tile.bounds.bounds, tileOnRight.bounds.bounds);
                //if (check.center || check.topOrLeft || check.bottomOrRight) { this.errors.push(new Vector2(tile.position.x+tile.width,tile.position.y+tile.height/2)); }
                if (check.center) { this.errors.push(new Vector2(tile.position.x+tile.width,tile.position.y+tile.height/2)); }
                // if (check.topOrLeft) { this.errors.push(new Vector2(tile.position.x+tile.width,tile.position.y)); }
                // if (check.bottomOrRight) { this.errors.push(new Vector2(tile.position.x+tile.width,tile.position.y+tile.height)); }

            }

        if (tileOnBottom)
            {
                var check = this.checkBoundsBetween('V', tile.bounds.bounds, tileOnBottom.bounds.bounds);
                //if (check.center || check.topOrLeft || check.bottomOrRight) { this.errors.push(new Vector2(tile.position.x+tile.width/2,tile.position.y)); }
                if (check.center) { this.errors.push(new Vector2(tile.position.x+tile.width/2,tile.position.y)); }
                // if (check.topOrLeft) { this.errors.push(new Vector2(tile.position.x,tile.position.y)); }
                // if (check.bottomOrRight) { this.errors.push(new Vector2(tile.position.x+tile.width,tile.position.y)); }

            }

        return false;
    };

	TilesManager.prototype.checkBoundsBetween = function (pos, t1, t2) {
        var error = {topOrLeft: 0, bottomOrRight: 0, center: 0};
        if (pos == 'H')
            {
                if (t1[1] == 1 || t2[3] == 1) error.center = 1;
                if (t1[0] != t2[0]) error.topOrLeft = 1;
                if (t1[2] != t2[2]) error.bottomOrRight = 1;
            }
        else if (pos == 'V')
            {
                if (t1[0] == 1 || t2[2] == 1) error.center = 1;
                if (t1[3] != t2[3]) error.topOrLeft = 1;
                if (t1[1] != t2[1]) error.bottomOrRight = 1;
            }
        return error;
    }

	TilesManager.prototype.draw = function () {
		if (isFinite(this.bound.e) && isFinite(this.bound.w) && isFinite(this.bound.s) && isFinite(this.bound.n))
			{

                var fontSize = Math.floor(this.app.gridSize / 7);
                if (fontSize < 20) fontSize = 20;
                fontSize = fontSize + "px";

				canvas.ctx.save();

				// horizontal line
				canvas.ctx.strokeStyle = this.lineColor;
				canvas.ctx.fillStyle = this.fillStyle;
				canvas.ctx.lineWidth = this.lineWidth;
				canvas.ctx.beginPath();
				canvas.ctx.moveTo(this.bound.w, this.bound.s + this.app.gridSize/4);
				canvas.ctx.lineTo(this.bound.e, this.bound.s + this.app.gridSize/4);
		        canvas.ctx.stroke();
		        canvas.ctx.closePath();

				// horizontal dimensions
				canvas.drawText(this.gridSize.x +'cm', new Vector2((this.bound.e - this.bound.w)/2 + this.bound.w, this.bound.s + this.app.gridSize/4 + 15), Vector2.zero, this.lineColor, "center", "Verdana", fontSize, "top");

				// left arrow
				canvas.ctx.beginPath();
				canvas.ctx.moveTo(this.bound.w, this.bound.s + this.app.gridSize/4);
				canvas.ctx.lineTo(this.bound.w + this.arrowSize, this.bound.s + this.app.gridSize/4 - this.arrowSize);
				canvas.ctx.lineTo(this.bound.w + this.arrowSize, this.bound.s + this.app.gridSize/4 + this.arrowSize);
		        canvas.ctx.fill();
		        canvas.ctx.closePath();

				// right arrow
				canvas.ctx.beginPath();
				canvas.ctx.moveTo(this.bound.e, this.bound.s + this.app.gridSize/4);
				canvas.ctx.lineTo(this.bound.e - this.arrowSize, this.bound.s + this.app.gridSize/4 - this.arrowSize);
				canvas.ctx.lineTo(this.bound.e - this.arrowSize, this.bound.s + this.app.gridSize/4 + this.arrowSize);
				canvas.ctx.fill();
				canvas.ctx.closePath();

				// vertical line
				canvas.ctx.beginPath();
				canvas.ctx.moveTo(this.bound.w - this.app.gridSize/4, this.bound.n);
				canvas.ctx.lineTo(this.bound.w - this.app.gridSize/4, this.bound.s);
		        canvas.ctx.stroke();
		        canvas.ctx.closePath();

				// vertical dimensions
				canvas.ctx.save();
				canvas.ctx.translate(this.bound.w - this.app.gridSize/4 + 10, (this.bound.s - this.bound.n)/2 + this.bound.n);
				canvas.ctx.rotate(-Math.PI / 2);
				canvas.drawText(this.gridSize.y +'cm', new Vector2(0,-20), Vector2.zero, this.lineColor, "center", "Verdana", fontSize, "bottom");
				canvas.ctx.restore();

				//top arrow
				canvas.ctx.beginPath();
				canvas.ctx.moveTo(this.bound.w - this.app.gridSize/4, this.bound.n);
				canvas.ctx.lineTo(this.bound.w - this.app.gridSize/4 - this.arrowSize, this.bound.n + this.arrowSize);
				canvas.ctx.lineTo(this.bound.w - this.app.gridSize/4 + this.arrowSize, this.bound.n + this.arrowSize);
				canvas.ctx.fill();
		        canvas.ctx.closePath();

				//bottom arrow
				canvas.ctx.beginPath();
				canvas.ctx.moveTo(this.bound.w - this.app.gridSize/4, this.bound.s);
				canvas.ctx.lineTo(this.bound.w - this.app.gridSize/4 - this.arrowSize, this.bound.s - this.arrowSize);
				canvas.ctx.lineTo(this.bound.w - this.app.gridSize/4 + this.arrowSize, this.bound.s - this.arrowSize);
				canvas.ctx.fill();
		        canvas.ctx.closePath();

		        for (var i = 0, len = this.errors.length; i<len; i++)
                {
                    canvas.drawCircle(this.errors[i], this.app.gridSize/10, "red", "red", 1);
                }
				canvas.ctx.restore();
			}

        if (this.errors.length > 0)
            {
                var alertPosition = new Vector2(canvas.width/2, canvas.height/5);
                alertPosition.y = this.app.helpBar.position.y + this.app.helpBar.height * 2;
                canvas.drawText(this.app.appDataObj.line('elements_match_warning'), alertPosition, Vector2.zero, "red", "center", "Verdana", "14px", "middle");
            }

	}

	return TilesManager;

});
