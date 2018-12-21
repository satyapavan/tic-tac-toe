logger = function(){};

// this is still public :-( This is not what i am looking for.
// I do not want this to be accessable from outside world
var isLogging = true;	

// interface for toggling the logs without directly accessing the isLogging
logger.enableLogging = function() {
	logger.log("Entering into enableLogging");
	isLogging = true;
}

logger.disableLogging = function() {
	logger.log("Entering into disableLogging");
	isLogging = false;
}

// this does not yet work for multiple parameters. its a TODO
logger.log = function() {
	if(isLogging) {
		for (var i = 0; i < arguments.length; i++) {
 		 	console.log(arguments[i]);	
 		 }
	}
}