requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app",
      "jquery": "jquery-1.10.1.min",
      "bootstrap" :"bootstrap",
      "cookie" :"jquery.cookie",
      "socketio" : "/socket.io/socket.io",
	  "validate" : ""

    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "cookie": {
          deps:["jquery"]
        }
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);