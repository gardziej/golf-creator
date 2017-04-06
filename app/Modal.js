define(['jquery', 'bootstrap', 'system/myHelper', 'system/Canvas', 'system/Vector2', 'system/Mouse', 'system/GameObjectList'],
	function($, bootstrap, myHelper, Canvas, Vector2, mouse, GameObjectList){

	function Modal (app)
		{
			this.app = app;
			this.title = $('#appModalTitle').html();
			this.body = $('#appModalBody').html();
			var that = this;
			$('#appModal').on('hidden.bs.modal', function (e) {
				that.app.online = true;
				$('#appArea').show();
			})

		}

	Modal.prototype.setTitle = function (title) {
		this.title = title;
	}

	Modal.prototype.setBody = function (body) {
		this.body = body;
	}

	Modal.prototype.show = function (title, body) {
		this.setTitle(title);
		this.setBody(body);
		$('#appModalTitle').html(this.title);
		$('#appModalBody').html(this.body);
		$('#appArea').hide();
		this.app.online = false;
		$('.modal-close').html(this.app.appDataObj.line('close'));
		$('#appModal').modal('show');
	};


	return Modal;

});
