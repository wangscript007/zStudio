/**
 * Created by 10177027 on 2016/4/13.
 * 扩展表格分页区域显示信息，支持用户自定义html显示
 */
!function($) {
    'use strict';

    /**
     * 用户自定义html属性
     */
    $.extend($.fn.bootstrapTable.defaults, {
        paginationHTML: '',
        totalRowsField: 'total'
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initPagination = BootstrapTable.prototype.initPagination;

    /**
     * 重写分页初始化方法
     */
    BootstrapTable.prototype.initPagination = function () {
        _initPagination.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.paginationHTML) {
            this.$pagination.children(":first").removeClass("pull-left").addClass("pull-right");
            this.$pagination.prepend("<div class='pull-left pagination-detail'><span class='pagination-info'>" + escape2Html(decodeURIComponent(this.options.paginationHTML)) + "</span></div>");
        }
    }

    /**
     * 重写数据加载方法，根据配置的数据列字段获取总记录数。
     * @param data
     */
    BootstrapTable.prototype.load = function (data) {
        var fixedScroll = false;

        // #431: support pagination
        if (this.options.sidePagination === 'server') {
            this.options.totalRows = data[this.options.totalRowsField];

            fixedScroll = data.fixedScroll;
            data = data[this.options.dataField];
        } else if (!$.isArray(data)) { // support fixedScroll
            fixedScroll = data.fixedScroll;
            data = data.data;
        }

        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody(fixedScroll);
    };

}(jQuery)