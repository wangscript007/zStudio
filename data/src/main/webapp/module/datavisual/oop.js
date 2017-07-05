window.datavisual = window.datavisual || {};

window.datavisual.extend = function (child, parent) {
	var f = function () {};
	f.prototype = parent.prototype;
	child.prototype = new f();
	child.prototype.constructor = child;
	child.uber = parent.prototype;
};