define(['text!elements'], function(jsonData){


	function AppData (parent)
		{
			this.app = parent;
			this.data = JSON.parse(jsonData);
			this.app.lang = this.data.lang_page;
		}

    AppData.prototype.tileData = function (tileId) {
		for (var i = 0, len = this.data.tiles.length; i<len; i++)
			{
				if (tileId === this.data.tiles[i].id)
					return this.data.tiles[i];
			}
	};

    AppData.prototype.update = function (delta) {
		if (this.app.lang == 'pl')
			{
				this.app.currency = "zł";
			}
			else
			{
				this.app.currency = "\u20AC";
			}
	}

    AppData.prototype.get = function () {
		return this.data;
	};


    AppData.prototype.line = function (line) {
		if (typeof this.data.cfg[line][this.app.lang] !== "undefined")
			return this.data.cfg[line][this.app.lang];
		return '';
	};


	return AppData;

	});
