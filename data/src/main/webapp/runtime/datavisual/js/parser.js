 var zdata = {};

(function($, zdata) {
	zdata.parser = {
		// TODO 待重构
		plugins: ['zdata_bar','zdata_radar','zdata_pie','zdata_line','zdata_scatter_map',
			'zdata_parallel','zdata_scatter','zdata_map','zdata_funnel','zdata_gauge','zdata_table_detail'],

		parse: function(context) {
			for(var i = 0; i < zdata.parser.plugins.length; i++) {
				var name = zdata.parser.plugins[i];
				var r = $('.' + name, context);
				
				if (r.length) {
					r.each(function() {
						var options = zdata.parser.parseOptions($(this));
						$(this)[name](options);
					});
				}
			}
		},

		parseOptions: function(target) {
			var t = $(target);
			var options = {};
			
			var s = $.trim(t.attr('data-zdata-option'));
			if (s) {
				if (s.substring(0, 1) != '{') {
					s = '{' + s + '}';
				}
				options = (new Function('return ' + s))();
			}
			return options;
		}
	};
})(jQuery, zdata);

$(document).ready(function(){
	zdata.parser.parse();
});


