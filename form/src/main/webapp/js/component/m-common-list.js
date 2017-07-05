;(function($) {
	var CommonList = function (el, options) {
		this.$el = $(el);
		this.dataRows = [];
		this.columns = [];
		this.pagination;
		this.ajaxParams;
		this.formatRow;
		this.initOptions(options);
		this.init();
	}


	/**
	 * 产品列表分页信息
	 * @type {{totalRows: number, pageNumber: number, pageSize: number, pageList: number[],
	 * paginationHAlign: string, paginationVAlign: string, paginationDetailHAlign: string,
	 * paginationPreText: string, paginationNextText: string}}
	 */
	CommonList.PAGINATION = {
		/**
		 * 是否分页
		 */
		isPaging:true,
		/**
		 * server side need to set
		 */
		totalRows: 0,
		/**
		 * 总页数
		 */
		totalPages: 0,
		/**
		 * 当前页
		 */
		pageNumber: 1,
		/**
		 * 页大小
		 */
		pageSize: 10,
		/**
		 * 每页显示记录数
		 */
		pageList: [10, 25, 50, 100]
	}

	/**
	 * ajax 请求参数
	 * @type {{}}
	 */
	CommonList.AJAXPARAMS = {
		url: undefined,
		dataAdapter: function (data,columns) {
			var dataRows = [], totalRows = 0;
			if (data && data.status === 1) {
				dataRows = data.rows;
				totalRows = data.total;
			}
			return {rows: dataRows, total: totalRows};
		},

		formatParams: function (columns, pagesize, currentpage) {
			var queryColumns = new Array();
			$.each(columns, function (index, item) {
				queryColumns.push({cname: item});
			})
			var param = {columns: queryColumns};
			return "param=" + encodeURIComponent(JSON.stringify(param)) + "&limit=" + pagesize + "&offset=" + currentpage;
		}
	}


	CommonList.prototype = {
		initOptions: function (options) {
			var params = JSON.parse(decodeURIComponent(this.$el.attr("data-params") || '{}'));
			this.default = $.extend(true, (this.default || {}), params, options || {});
			/**
			 * 数据列定义
			 */
			this.columns = this.default.columns;
			/**
			 * 分页配置
			 */
			this.pagination = $.extend(CommonList.PAGINATION, this.default.pagination || {});
			/**
			 * ajax 请求参数
			 */
			this.ajaxParams = $.extend(CommonList.AJAXPARAMS, this.default.ajaxParams || {});
			this.formatRow = this.default.formatRow;
		},

		init: function () {
			this._loadData();
			this._initContainer();
			this._initDataView();
			if (this.pagination.isPaging) {
				this._initPagination();
				this._initEvent();
			}
		},
		/**
		 * 加载数据
		 */
		_loadData: function () {
			var that = this;
			var params = this.ajaxParams.formatParams(this.columns,
				this.getPageSize(),
				(this.getPageNumber() - 1) * this.getPageSize());
			$.ajax({
				async: false,
				cache: false,
				type: "GET",
				dataType: "json",
				data: params,
				contentType: "application/json",
				url: this.ajaxParams.url,
				success: function (data) {
					var datas = that.ajaxParams.dataAdapter(data,that.columns);
					that.setData(datas.rows, datas.total);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求服务[" + this.url + "]错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
				},
			});
		},
		/**
		 * 初始化列表数据
		 * @param datas
		 */
		setData:function(datas, total) {
			this.dataRows = datas;
			this.pagination.totalRows = total;
			this.pagination.totalPages = Math.ceil(total / this.pagination.pageSize);
		},

		/**
		 * 初始化产品列表容器
		 */
		_initContainer: function () {
			this.$el.empty().append(
				'<div class="new-goods-lst" />' +
				'<div class="new-paging" />'
			);
		},

		/**
		 * 初始化dataview
		 */
		_initDataView: function () {
			var dataRowsHtml = [], that = this;
			dataRowsHtml.push('<ul>');
			var startIndex = 0, endIndex = that.pagination.pageSize-1;
			if (this.dataRows.length > that.pagination.pageSize) {
				startIndex = (that.pagination.pageNumber - 1) * that.pagination.pageSize;
				endIndex = that.pagination.pageNumber * that.pagination.pageSize - 1;
			}

			$.each(this.dataRows, function (index, item) {
				if (index < startIndex || index > endIndex) {
					return;
				}
				dataRowsHtml.push(that.formatRow(item));
			})
			dataRowsHtml.push("</ul>");
			this.$el.find('.new-goods-lst').empty().append(dataRowsHtml.join("\n"));
		},

		/**
		 * 获取每页大小
		 */
		getPageSize:function(){
			return this.pagination.pageSize;
		},
		/**
		 * 获取当前页
		 */
		getPageNumber:function() {
			return this.pagination.pageNumber;
		},

		/**
		 * 初始化分页信息
		 */
		_initPagination: function () {
			var html = [];

			html.push('<div class="new-tbl-type">');
			html.push('<div class="new-tbl-cell">');
			html.push('<span class="new-a-prve"><span>上一页</span></span>');
			html.push('</div>')

			html.push('<div class="new-tbl-cell new-p-re">');

			html.push('<div class="new-a-page">');
			html.push('<span class="new-open">1/5</span>');
			html.push('</div>');

			html.push('<select class="new-select"/>');
			html.push('</div>');
			html.push('<div class="new-tbl-cell">');
			html.push('<a class="new-a-next" href="javascript:void(0)"><span>下一页</span></a>');
			html.push('</div>');

			this.$el.find(".new-paging").empty().append(html.join(" "));
			this.updatePagination();
		},
		_initEvent: function () {
			var that = this;

			this.$el.on("click", ".new-a-prve", function () {
				that.onPagePre(this);
			})

			this.$el.on("click", ".new-a-next", function () {
				that.onPageNext(this);
			})

			this.$el.find(".new-select").change(function () {
				that.onPageChange(this);
			})
		},
		/**
		 * 分页事件
		 */
		onPageChange: function (e) {
			this.pagination.pageNumber = parseInt($(e).val());
			this.refresh();
		},
		/**
		 * 上一页
		 * @param event
		 */
		onPagePre: function (event) {
			if ((this.pagination.pageNumber - 1) > 0) {
				this.pagination.pageNumber--;
				this.refresh();
			}
		},
		/**
		 * 下一页
		 * @param event
		 */
		onPageNext: function (event) {
			if ((this.pagination.pageNumber + 1) <= this.pagination.totalPages) {
				this.pagination.pageNumber++;
				this.refresh();
			}
		},
		refresh: function (options) {
			if(options !== undefined) {
				this.initOptions(options);
			}
			this._loadData();
			this._initDataView();
			if (this.pagination.isPaging) {
				this.updatePagination();
			}
		},
		updatePagination: function () {
			this.$el.find(".new-a-prve").parent().html('<a class="new-a-prve" href="javascript:void(0)"><span>上一页</span></a>');
			if (this.pagination.pageNumber === 1) {
				this.$el.find(".new-a-prve").parent().html('<a class="new-a-prve" style="text-decoration: none; color: #aeaeae;"><span>上一页</span></a>');
			}

			this.$el.find(".new-a-next").parent().html('<a class="new-a-next" href="javascript:void(0)"><span>下一页</span></a>');
			if (this.pagination.pageNumber === this.pagination.totalPages) {
				this.$el.find(".new-a-next").parent().html('<a class="new-a-next" style="text-decoration: none; color: #aeaeae;"><span>下一页</span></a>');
			}

			var options = [], totalPages = this.pagination.totalPages;
			for (var i = 0; i < totalPages; i++) {
				var selected = "";
				if (this.pagination.pageNumber === i + 1) {
					selected = " selected";
				}
				options.push('<option value=' + (i + 1) + selected + '>' + (i + 1) + '/' + totalPages + '</option>');
			}
			this.$el.find(".new-select").empty().append(options);

			this.$el.find(".new-open").parent().html(
				'<span class="new-open">' + this.pagination.pageNumber + "/" + this.pagination.totalPages + '</span>');
		},
		trigger: function (name) {
			var args = Array.prototype.slice.call(arguments, 1);
			this.$el.trigger($.Event(name), args);
		}
	}

	var allowedMethods = ["refresh"];

	$.fn.commonList = function (option) {
		var value,
			args = Array.prototype.slice.call(arguments, 1);

		this.each(function () {
			var $this = $(this),
				data = $this.data('common.list'),
				options = $.extend({}, CommonList.DEFAULT, $this.data(),
					typeof option === 'object' && option);

			if (typeof option === 'string') {
				if ($.inArray(option, allowedMethods) < 0) {
					throw new Error("Unknown method: " + option);
				}

				if (!data) {
					return;
				}

				value = data[option].apply(data, args);

				if (option === 'destroy') {
					$this.removeData('common.list');
				}
			}

			if (!data) {
				$this.data('common.list', (data = new CommonList(this, options)));
			}
		});

		return typeof value === 'undefined' ? this : value;
	}

	$.fn.commonList.Constructor = CommonList;

})(jQuery);