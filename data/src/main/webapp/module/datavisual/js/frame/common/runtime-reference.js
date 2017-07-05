function RuntimeReference(runtime) {
	runtime = runtime || {};

	this.js = runtime.js || [];
	this.css = runtime.css || [];
}

RuntimeReference.prototype.getJS = function() {
	return this.js;
};

RuntimeReference.prototype.getCSS = function(){
	return this.css;
};