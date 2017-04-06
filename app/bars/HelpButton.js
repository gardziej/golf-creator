define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Rectangle', 'app/bars/Button'],
	function(myHelper, Canvas, Vector2, Rectangle, Button){

	function HelpButton (app, bar, position, size, sprite, clickAction)
		{
			Button.call(this, app, bar, position, size, sprite, clickAction);
		}

	HelpButton.prototype = Object.create(Button.prototype);


    HelpButton.prototype.clicked = function () {
		switch (this.clickAction) {
			case 'undo':
				var state = this.app.store.getState();
	            if (state.past.length !== 0)
	                {
	                    this.app.store.dispatch({type:"UNDO"});
	                    this.app.tiles.tilesManager.updateFromHistory();
	                }
				break;
			case 'redo':
				var state = this.app.store.getState();
	            if (state.future.length !== 0)
	                {
	                    this.app.store.dispatch({type:"REDO"});
	                    this.app.tiles.tilesManager.updateFromHistory();
	                }
				break;
		}
	};

	return HelpButton;

});
