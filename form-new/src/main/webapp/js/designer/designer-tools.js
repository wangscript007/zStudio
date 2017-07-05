(function($, global) {
	
	/**
	 * 自定义Map对象
	 */
	function Map() {
		this.container = new Object();
	}

	Map.prototype = {
			put : function(key, value) {
				this.container[key] = value;
			},
			get : function(key) {
				return this.container[key];
			},
			keySet : function() {
				var keyset = new Array();
				var count = 0;
				for ( var key in this.container) {
					// 跳过object的extend函数
					if (key == 'extend') {
						continue;
					}
					keyset[count] = key;
					count++;
				}
				return keyset;
			},
			size : function() {
				var count = 0;
				for ( var key in this.container) {
					// 跳过object的extend函数
					if (key == 'extend') {
						continue;
					}
					count++;
				}
				return count;
			},
			remove : function(key) {
				delete this.container[key];
			},
			toString : function() {
				var str = "";
				for ( var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
					str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
				}
				return str;
			}
	};
	//暴露对象到window，供其他应用使用
	global.Map = Map;

	var DesignerTools = function() {
		//this.fetchDataUrl = 'designer/fecth/alldata';
		this.fetchDataUrl = 'designer/load';
		this.PRODUCT_KSY = 'ksy';
	};
	
	
	
	DesignerTools.prototype = {
			/**
			 获取当前时间
			 */
			getCurrentTime : function() {
				return new Date().getTime();
			},
			
			/**
			 * 根据参数名获取url参数
			 * @param name 参数名
			 * @param search url所有参数
			 * 如果是调用showModalDialog("dialog1", "新增表单","chenbo-form.html?operator=add")打开页面，需要获取该url中参数，search使用pageParams（该对象为框架定义的全局变量）
			 * 如果是在本页面获取参数，使用window.location.search。
			 * @returns 参数值，如果为空则返回null。
			 */
			getUrlParam : function(name, search) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
				r = search.match(reg);
				if (search.indexOf("?") > -1) {
					r = search.substring(1).match(reg);
				}
				if (r != null) {
					return decodeURIComponent(r[2]);
				}
				return "";
			},
			/**
			 * 深度克隆
			 * @param 被克隆对象
			 * @return 新对象
			 */
			deepClone : function(obj) {
				var result, oClass = isClass(obj);
				//确定result的类型
				if (oClass === "Object") {
					result = {};
				} else if (oClass === "Array") {
					result = [];
				} else {
					return obj;
				}
				for (key in obj) {
					var copy = obj[key];
					if (isClass(copy) == "Object") {
						result[key] = arguments.callee(copy);//递归调用
					} else if (isClass(copy) == "Array") {
						result[key] = arguments.callee(copy);
					} else {
						result[key] = obj[key];
					}
				}
				return result;
			},
			/**
			 * 格式化时间，返回格式yyyy-mm-dd hh24:mm:mi
			 * @param time 需要格式化的时间
			 * @returns {String}
			 */
			formatTime : function(time) {
				var now = new Date(time), year = now.getFullYear(), month = now
						.getMonth() + 1, day = now.getDate(), hh = now.getHours(), mm = now
						.getMinutes(), mi = now.getSeconds();

				var clock = year + "-";
				month < 10 ? clock += "0" : clock += '';
				clock += month + "-";
				day < 10 ? clock += "0" : clock += '';
				clock += day + " ";
				hh < 10 ? clock += "0" : clock += '';
				clock += hh + ":";
				mm < 10 ? clock += "0" : clock += '';
				clock += mm + ":";
				mi < 10 ? clock += "0" : clock += '';
				clock += mi;
				return clock;
			},
			getCompClassName : function (compName) {
				var names = compName.split('-'),
				className =  '';
				
				$.each(names, function(index, item) {
					className = className + item[0].toUpperCase() + item.substring(1, item.length);
				});
		        return className;
		    }
	};

	global._tools = new DesignerTools();
})(jQuery, window);
