require(['jquery', 'lodash', 'redux', 'app/App', 'system/Canvas', 'system/Vector2'],
function ($, _, redux, App, Canvas, Vector2) {

	if (typeof Object.assign != 'function') {
	   Object.assign = function(target, varArgs) {
	'use strict';
	if (target == null) {
	  throw new TypeError('Cannot convert undefined or null to object');
	}

	var to = Object(target);

	for (var index = 1; index < arguments.length; index++) {
	  var nextSource = arguments[index];

	  if (nextSource != null) { // Skip over if undefined or null
	    for (var nextKey in nextSource) {
	      if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
	        to[nextKey] = nextSource[nextKey];
	        }
	       }
	     }
	   }
	   return to;
	  };
	 }

	$(document).ready(function(){

		var requestAnimationFrame = (function () {
			return  window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();

	canvas = new Canvas('canvas', 'appArea', true);

	var reducer = function (state, action) {

		switch (action.type) {

// ADD_TILE
			case "ADD_TILE":
				var oldPresent = _.cloneDeep(state.present);
				var past = state.past.concat();
				past.push(oldPresent);

				var newTileData = {
					id: action.payload.id,
					index: action.payload.index,
					cords: new Vector2(action.payload.cords),
					boundsString: action.payload.boundsString,
					rotationState: action.payload.rotationState
				}


				return {
					past: past,
					present: state.present.concat(newTileData),
					future: []
				}

// DELETE_TILE
			case "DELETE_TILE":
				var oldPresent = _.cloneDeep(state.present);
				var past = state.past.concat();
				past.push(oldPresent);

				var index = action.payload.index;
				var id = null;
				state = state.present.concat();
				state.forEach(function(el, i){
					if (el.index === index)
						{
							id = i;
						}
				});
				state.splice(id, 1);

				return {
					past: past,
					present: state,
					future: []
				}

// CHANGE_TILE_ROTATION
			case "CHANGE_TILE_ROTATION":
				var oldPresent = _.cloneDeep(state.present);
				var past = state.past.concat();
				past.push(oldPresent);

				var index = action.payload.index;
				var rotationState = action.payload.rotationState;
				var id = null;
				var present = state.present.concat();
				present.forEach(function(el, i){
					if (el.index === index)
						{
							id = i;
						}
				});
				var changedTile = Object.assign({}, present[id]);
				changedTile.rotationState = rotationState;
				present.splice(id, 1, changedTile);

				return {
					past: past,
					present: present,
					future: []
				}

// CHANGE_TILE_CORDS
			case "CHANGE_TILE_CORDS":
				var oldPresent = _.cloneDeep(state.present);
				var past = state.past.concat();
				past.push(oldPresent);

				var index = action.payload.index;
				var cords = new Vector2(action.payload.cords);
				var id = null;
				var present = state.present.concat();
				present.forEach(function(el, i){
					if (el.index === index)
						{
							id = i;
						}
				});
				var changedTile = Object.assign({}, present[id]);
				changedTile.cords = cords;
				present.splice(id, 1, changedTile);

				return {
					past: past,
					present: present,
					future: []
				}

// UNDO
			case 'UNDO':

				if (state.past.length === 0) {
					return state;
				}

	            var previous = state.past[state.past.length - 1];
	            var newPast = state.past.slice(0, state.past.length - 1);
				var present = _.cloneDeep(state.present);
	            return {
	            	past: newPast,
	            	present: previous,
	            	future: [present].concat(state.future)
	            }

// REDO
			case 'REDO':

				if (state.future.length === 0) {
					return state;
				}

				var past = _.cloneDeep(state.past);
				past.push(state.present);
				var next = state.future[0];
		        var newFuture = _.cloneDeep(state.future);
		        newFuture = newFuture.slice(1);
		        return {
		        	past: past,
		        	present: next,
		        	future: newFuture
		        }

// default
			default:
				return state;

		}
	}

	var store = redux.createStore(reducer, {
		past: [],
		present: [],
		future: []
	});

	// store.subscribe( function() {
	//
	// 	console.log('xxxxxxxxx-xxxxxxxxxxx-xxxxxxxxxx');
	// 	console.log('past');
	// 	for (var i = 0; i < store.getState().past.length; i++) {
	// 		console.table(store.getState().past[i]);
	// 	}
	//
	// 	console.log('-----------------------------------');
	//
	// 	console.log('present');
	// 	console.table(store.getState().present);
 //  		}
	// )

    var stats = new xStats();
    document.body.appendChild(stats.element);

  	app = new App(store);

	});

});
