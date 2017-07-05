;(function($, win) {

	var ProductList = $.fn.commonList.Constructor;

	/**
	 * 数据展示
	 * @type {{formatDetailUrl: {}, formatProductList: {}}}
	 */
	ProductList.DATA_VIEW = {
		/**
		 * 产品详情格式化
		 */
		formatDetailUrlMethod: {},
		/**
		 * 用户自定义产品列表展示
		 */
		customProductListMethod: {}
	}

	ProductList.PAGINATION = {
		/**
		 * 是否分页
		 */
		isPaging: true,
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
	 * 默认数据列
	 * @type {{}}
	 */
	ProductList.DEFAULT_COLUMNS = {
		/**
		 * 产品ID
		 */
		PRODUCT_ID: "",
		/**
		 * 产品图片url
		 */
		PRODUCT_IMG_URL: "",
		/**
		 * 产品详情url
		 */
		PRODUCT_DETAIL_URL: "",
		/**
		 * 产品名称
		 */
		PRODUCT_TITLE: "",
		/**
		 * 产品价格
		 */
		PRODUCT_PRICE: "",
		/**
		 * 产品提示信息
		 */
		PRODUCT_ALT: "",
		/**
		 * 供应商
		 */
		PRODUCT_SUPPLIER: ""
	}

	ProductList.prototype.product_list_columns = {};

	/**
	 * 重载数据列表参数初始化方法
	 * @param options
	 */
	ProductList.prototype.initOptions = function (options) {
		var params = JSON.parse(decodeURIComponent(this.$el.attr("data-params") || '{}'));
		this.default = $.extend(true, params, options || {});
		/**
		 * 数据列定义
		 */
		this.product_list_columns = $.extend(ProductList.DEFAULT_COLUMNS, this.default.columns || {});
		/**
		 * 分页配置
		 */
		this.pagination = $.extend(ProductList.PAGINATION, this.default.pagination || {});
		/**
		 * ajax 请求参数
		 */
		this.ajaxParams = $.extend(ProductList.AJAXPARAMS, this.default.ajaxParams || {});
		/**
		 * 数据展示
		 */
		this.dataView = $.extend(ProductList.DATA_VIEW, this.default.dataView || {});

		this.ajaxParams.url = getOperatorURL(this.ajaxParams.dsName, this.ajaxParams.tableName);

		this.columns = this.getColumns();
	}

	/**
	 * 格式化数据行
	 * @param dataRow
	 * @returns {*}
	 */
	ProductList.prototype.formatRow = function (dataRow) {
		if (!$.isEmptyObject(this.dataView.customProductListMethod)) {
			return applyFunc(this.dataView.customProductListMethod, [dataRow]);
		} else {
			return this.defaultFormatRow(dataRow);
		}
	}
	/**
	 * 默认数据行格式化
	 * @param dataRow
	 * @returns {string}
	 */
	ProductList.prototype.defaultFormatRow = function(dataRow) {
		var dataRowsHtml = [],url;

		if (!$.isEmptyObject(this.dataView.formatDetailUrlMethod)) {
			url = applyFunc(this.dataView.formatDetailUrlMethod, [dataRow]);
		}
		dataRowsHtml.push('<li class="new-mu_l2">');
		dataRowsHtml.push('<a style="text-decoration:none" href="' + url + '" class="new-mu_l2a">');
		dataRowsHtml.push('<span class="new-mu_tmb">');
		dataRowsHtml.push('<img src="' + dataRow[this.product_list_columns.PRODUCT_IMG_URL] + '" width="100" height="100"  alt=""/>');
		dataRowsHtml.push('</span>');
		dataRowsHtml.push('<span class="new-mu_l2cw">');

		var title = dataRow[this.product_list_columns.PRODUCT_TITLE];
		if (title && title.length > 20) {
			title = title.substring(0, 20) + " ...";
		}
		dataRowsHtml.push('<strong class="new-mu_l2h">' + title + '</strong>');

		dataRowsHtml.push('<span class="new-mu_l2h new-mu_l2h-v1"><span class="new-txt-rd2"></span></span>');

		dataRowsHtml.push('<span class="new-mu_l2c new-p-re">');
		dataRowsHtml.push('<strong class="new-txt-rd2">&yen;' + dataRow[this.product_list_columns.PRODUCT_PRICE] + '</strong>');
		dataRowsHtml.push('</span>');

		var supplier = "-";
		if (dataRow[this.product_list_columns.PRODUCT_SUPPLIER]) {
			supplier = dataRow[this.product_list_columns.PRODUCT_SUPPLIER];
		}
		dataRowsHtml.push('<span class="new-mu_l2h new-mu_l2h-v1">' + supplier + '</span>');

		dataRowsHtml.push('</span>');
		dataRowsHtml.push('</a>');
		dataRowsHtml.push("</li>");

		return dataRowsHtml.join(" ");
	}

	/**
	 * 获取数据列
	 */
	ProductList.prototype.getColumns = function () {
		var columns = [];
		$.each(this.product_list_columns, function (index, item) {
			if (item) {
				columns.push(item);
			}
		})

		if (this.default.extendColumns && this.default.extendColumns.length > 0) {
			$.each(this.default.extendColumns, function (index, item) {
				if (item && $.inArray(item, columns) === -1) {
					columns.push(item);
				}
			})
		}

		return columns;
	}

	var allowedMethods = ["refresh"];

	$.fn.productList = function (option) {
		var value,
			args = Array.prototype.slice.call(arguments, 1);

		this.each(function () {
			var $this = $(this),
				data = $this.data('product.list'),
				options = $.extend({}, ProductList.DEFAULT, $this.data(),
					typeof option === 'object' && option);

			if (!data) {
				$this.data('product.list', (data = new ProductList(this, options)));
			}

			if (typeof option === 'string') {
				if ($.inArray(option, allowedMethods) < 0) {
					throw new Error("Unknown method: " + option);
				}

				if (!data) {
					return;
				}

				value = data[option].apply(data, args);

				if (option === 'destroy') {
					$this.removeData('product.list');
				}
			}
		});

		return typeof value === 'undefined' ? this : value;
	}

	var productListMap = new Map();
	$.productListCleanData = function () {
		$(".demo").find("[type=product_list]").each(function (index, item) {
			var dsname, uri;
			var datasourceInfo = new ComponentDataFieldsManage(item);
			if (datasourceInfo.isSetDataSourceInfo()) {
				dsname = datasourceInfo.getDataSourceName()
				uri = datasourceInfo.getUri();
			}

			var params = JSON.parse(decodeURIComponent($(item).attr("data-params") || '{}'));
			params.ajaxParams = {};
			params.ajaxParams.dsName = dsname;
			params.ajaxParams.tableName = uri;
			params.extendColumns = JSON.parse(decodeURIComponent($(item).attr("data-columns") || '{}')).columns;
			$(item).attr("data-params", encodeURIComponent(JSON.stringify(params)));

			productListMap.put($(item).attr("compid"), $(item).children());
			$(item).empty();
		})
	}

	$.productListRestoreData = function () {
		$(".demo").find("[type=product_list]").each(function (index, item) {
			var id = $(item).attr("compid");
			$(item).empty();
			$(item).append(productListMap.get(id));
			productListMap.remove(id);
		})
	}

	$(function () {
		if(!win.isDesignerMode) {
			$("[type=product_list]").productList();
		}
	});

})(jQuery, window);