requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app",
      "jquery": "jquery-1.10.1.min",
      "bootstrap" :"bootstrap",
      "cookie" :"jquery.cookie",
      "socketio" : "/socket.io/socket.io",
			"tubular" : "jquery.tubular.1.0",
			"WOW" : "wow.min", 
			"countdown" : "jquery.countdown.min",
			"bootstrapValidator" : "bootstrapValidator.min",
			"Ladda" : "ladda.min",
			"retina" : "retina.min"

    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
			"countdown": {
            deps: ["jquery"]
        },
			"tubular": {
            deps: ["jquery"]
        },
        "cookie": {
          deps:["jquery"]
        }
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);