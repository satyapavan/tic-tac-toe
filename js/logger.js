var logger = {};
var isLogging = false;

// this does not yet work for multiple parameters. its a TODO
logger.log = function(data) {
	if(isLogging) {
		console.log(data);	
	}
}