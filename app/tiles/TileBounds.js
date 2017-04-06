define([],
		function(){

	function TileBounds (app, parent, pattern)
		{
			this.app = app;
			this.parent = parent;
			this.bounds = this.prepareBounds(pattern);
		}

	TileBounds.prototype.prepareBounds = function (pattern) {
		var b = [];
		var p = pattern.split('');

		for (var i = 0, len = p.length; i<len; i++)
			{
				if (p[i] == 'G')
					{
						b.push(0);
					}
				else if (p[i] == 'B')
					{
						b.push(1);
					}
			}
		return b;
	}

	TileBounds.prototype.check = function (dir) {
		if (dir == 'T' || dir == 'N') dir = 0;
		if (dir == 'R' || dir == 'E') dir = 1;
		if (dir == 'B' || dir == 'S') dir = 2;
		if (dir == 'L' || dir == 'W') dir = 3;
		return this.bounds[dir];
	}


	TileBounds.prototype.setRotation = function (rotationState) {
		switch (rotationState) {
			case 1:
				this.rotateRight();
				break;
			case 2:
				this.rotateRight();
				this.rotateRight();
				break;
			case 3:
				this.rotateLeft();
				break;
		}
	}

	TileBounds.prototype.rotateRight = function () {
		this.bounds.unshift(this.bounds.pop());
	}

	TileBounds.prototype.rotateLeft = function () {
		this.bounds.push(this.bounds.shift());
	}

	return TileBounds;

});
