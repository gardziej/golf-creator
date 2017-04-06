define(['system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse'],
	function(myHelper, Canvas, Vector2, mouse){

	function ActionsManager (parent, app)
		{
			this.parent = parent;
			this.app = app;
			this.actions = {};
	        this.currentAction = null;
			this.lastActionId = 0;
			this.currentActionId = 0;
		}

    ActionsManager.prototype.add = function (id, action) {
        this.actions[id] = {action : action};
    };

    ActionsManager.prototype.switchTo = function (id) {
        if (typeof this.actions[id] !== "undefined")
			{
	        	this.currentAction = this.actions[id].action;
				if (this.currentActionId !== id)
					{
						this.actions[this.lastActionId].action.reset();
						this.lastActionId = this.currentActionId;
					}
				this.currentActionId = id;
				this.currentAction.onSwith();
				return this;
			}
    };

    ActionsManager.prototype.update = function (delta) {
        if (this.currentAction !== null)
			{
				this.currentAction.update(delta);
			}
    };

    ActionsManager.prototype.draw = function () {
        if (this.currentAction !== null)
			{
				this.currentAction.draw();
			}
    };

    ActionsManager.prototype.reset = function () {
        if (this.currentAction !== null)
			{
				this.currentAction.reset();
			}
    };

	return ActionsManager;

});
