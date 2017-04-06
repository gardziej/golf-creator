requirejs.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	waitSeconds: 60,
	shim : {
           "bootstrap" : { "deps" :['jquery', 'tether'] }
       },

    paths: {
        'jquery'			: 'lib/jquery-3.1.1.min',
        'lodash'			: 'lib/lodash',
        'redux'				: 'lib/redux.min',
		'tether'			: 'lib/bootstrap/js/tether.min',
		'pathfinding' 		: 'lib/pathfinding/pathfinding-browser.min',
		"bootstrap" 		: 'lib/bootstrap/js/bootstrap.min',
		'elements' 			: '../ajax/data'
    }
});



 requirejs(['main']);
