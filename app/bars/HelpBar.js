define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'app/bars/Bar',
		'app/bars/DummyButton', 'app/bars/HelpButton', 'system/Sprites'],
	function(myHelper, Canvas, Vector2, mouse, Bar,
		DummyButton, HelpButton, sprites){

	function HelpBar (parent, position, size)
		{
			var size = new Vector2(120,30);
			var position = this.calculatePosition(parent, size);
			Bar.call(this, parent, position, size); // call parent constructor
			this.app = app;
			this.size = size;
			this.color = "yellow";
			this.lineWidth = 1;
			this.clickable = true;
			this.textSize = '14px';
			this.textColor = "black";

			this.buttonUndo = new HelpButton(
								this.app,
								this,
								new Vector2(position.x - size.y *1.2, position.y + size.y *.5),
								new Vector2(size.y, size.y),
								sprites.tilebarIcon.rotateLeft,
								'undo');
			this.buttons.add(this.buttonUndo);

			this.buttonRedo = new HelpButton(
								this.app,
								this,
								new Vector2(position.x + size.x + size.y *.2, position.y + size.y *.5),
								new Vector2(this.height, this.height),
								sprites.tilebarIcon.rotateRight,
								'redo');

			this.buttons.add(this.buttonRedo);

		}

	HelpBar.prototype = Object.create(Bar.prototype);

	HelpBar.prototype.calculatePosition = function (app, size) {
		var position = Vector2.zero;
		var top = app.top;
		if (typeof top !== undefined)
			{
				position.x = (canvas.width - size.x) / 2;
				position.y = top.height - 10;
			}
		return position;
	};

	HelpBar.prototype.clicked = function () {
		var title = this.app.appDataObj.line('creator_help');
		var body = '<div id="instrukcja">... '+ this.app.appDataObj.line('loading') +' ...</div>';
		this.app.modal.show(title, body);
		$("#instrukcja").load('Instrukcja?lang=' + this.app.lang);
	}

	HelpBar.prototype.update = function (delta) {
		this.position = this.calculatePosition(this.app, this.size);
		this.textPosition = new Vector2 (
			(this.position.x + this.width / 2), (this.position.y + this.height / 2)
		);
		this.text = this.app.appDataObj.line('creator_help');
		this.buttonUndo.position = new Vector2(this.position.x - this.size.y *1.2, this.position.y + this.size.y *.5);
		this.buttonRedo.position = new Vector2(this.position.x + this.size.x + this.size.y *.2, this.position.y + this.size.y *.5);

		var state = this.app.store.getState();
		state.past.length !== 0 ? this.buttonUndo.visible = true : this.buttonUndo.visible = false;
		state.future.length !== 0 ? this.buttonRedo.visible = true : this.buttonRedo.visible = false;

	}

	HelpBar.prototype.draw = function () {

		if (this.visible)
			{
				Bar.prototype.draw.call(this);
				canvas.drawText(this.text, this.textPosition, undefined, this.textColor, "center", "Verdana", this.textSize, "middle");
			}
    };


	return HelpBar;

});
