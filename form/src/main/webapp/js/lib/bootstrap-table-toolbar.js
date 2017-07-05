/**
 * @author: aperez <aperez@datadec.es>
 * @version: v2.0.0
 *
 * @update Dennis Hernández <http://djhvscf.github.io/Blog>
 */

!function($) {
    'use strict';
    var sprintf = function(str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function() {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var calculateObjectValue = function (self, name, args, defaultValue) {
        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                name = window;
                $.each(names, function (i, f) {
                    name = name[f];
                });
            } else {
                name = window[name];
            }
        }
        if (typeof name === 'object') {
            return name;
        }
        if (typeof name === 'function') {
            return name.apply(self, args);
        }
        return defaultValue;
    };

    var showCustomSearch = function(customHtml,searchTitle,that){
        if (!$("#avdSearchModal_"+that.options.idTable).hasClass("modal")) {
            var vModal = "<div id=\"avdSearchModal_"+that.options.idTable+"\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\">";
            vModal += "<div class=\"modal-dialog modal-xs\">";
            vModal += " <div class=\"modal-content\">";
            vModal += "  <div class=\"modal-header\">";
            vModal += "   <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" >&times;</button>";
            vModal += sprintf("   <h4 class=\"modal-title\">%s</h4>", searchTitle);
            vModal += "  </div>";
            vModal += "  <div class=\"modal-body modal-body-custom\">";
            vModal += customHtml||"";
            vModal += "  </div>";
            vModal += "  <div class=\"modal-footer\">";
            vModal += "     <button type=\"button\" id=\"btnCloseAvd_"+that.options.idTable+"\" class=\"btn btn-default\">关闭</button>";
            vModal += "     <button type=\"button\" id=\"btnSearchAvd_"+that.options.idTable+"\" class=\"btn btn-primary\">确认</button>";
            vModal += "  </div>";

            vModal += "  </div>";
            vModal += " </div>";
            vModal += "</div>";

            $("body").append($(vModal));

            $("#avdSearchModal_"+that.options.idTable).modal();

            $("#btnCloseAvd_"+that.options.idTable).click(function() {
                $("#avdSearchModal_"+that.options.idTable).modal('hide');
            });

            $("#btnSearchAvd_"+that.options.idTable).click(function() {
                 var funcName = that.options.idTable+"_searchEvent";
                if(typeof window[funcName] === "function"){
                    window[funcName].apply(that);
                    $("#avdSearchModal_"+that.options.idTable).modal('hide');
                }
            })

        }else{
            $("#avdSearchModal_"+that.options.idTable).modal();
        }
    }

    var showAvdSearch = function(pColumns, searchTitle, searchText, that) {
        if (!$("#avdSearchModal_"+that.options.idTable).hasClass("modal")) {
            var vModal = "<div id=\"avdSearchModal_"+that.options.idTable+"\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\">";
            vModal += "<div class=\"modal-dialog modal-xs\">";
            vModal += " <div class=\"modal-content\">";
            vModal += "  <div class=\"modal-header\">";
            vModal += "   <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" >&times;</button>";
            vModal += sprintf("   <h4 class=\"modal-title\">%s</h4>", searchTitle);
            vModal += "  </div>";
            vModal += "  <div class=\"modal-body modal-body-custom\">";
            vModal += "   <div class=\"container-fluid\" id=\"avdSearchModalContent_"+that.options.idTable+"\" style=\"padding-right: 0px;padding-left: 0px;\" >";
            vModal += "   </div>";
            vModal += "  </div>";
            vModal += "  <div class=\"modal-footer\">";
            vModal += "     <button type=\"button\" id=\"btnCloseAvd_"+that.options.idTable+"\" class=\"btn btn-default\">关闭</button>";
            vModal += "     <button type=\"button\" id=\"btnSearchAvd_"+that.options.idTable+"\" class=\"btn btn-primary\">确认</button>";
            vModal += "  </div>";

            vModal += "  </div>";
            vModal += " </div>";
            vModal += "</div>";

            $("body").append($(vModal));

            var vFormAvd = createFormAvd(pColumns, searchText, that),
                timeoutId = 0;;

            $('#avdSearchModalContent_'+that.options.idTable).append(vFormAvd.join(''));

            $("#btnCloseAvd_"+that.options.idTable).click(function() {
                $("#avdSearchModal_"+that.options.idTable).modal('hide');
            });

            $("#btnSearchAvd_"+that.options.idTable).click(function() {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    that.onColumnAdvancedSearch();
                }, that.options.searchTimeOut);
                $("#avdSearchModal_"+that.options.idTable).modal('hide');
            });

            $("#avdSearchModal_"+that.options.idTable).modal();
        } else {
            $("#avdSearchModal_"+that.options.idTable).modal();
        }
    };

    var createFormAvd = function(pColumns, searchText, that) {
        var htmlForm = [];
        htmlForm.push(sprintf('<form class="form-horizontal" id="%s" action="%s" >', that.options.idForm+"_"+that.options.idTable, that.options.actionForm));
        for (var i in pColumns) {
            var vObjCol = pColumns[i];
            if (!vObjCol.checkbox && vObjCol.visible && vObjCol.searchable) {
                htmlForm.push('<div class="form-group">');
                htmlForm.push(sprintf('<label class="col-sm-4 control-label">%s</label>', vObjCol.title));
                htmlForm.push('<div class="col-sm-6">');
                htmlForm.push(sprintf('<input type="text" class="form-control input-md" name="%s" placeholder="%s" data-compare="%s" id="%s">', vObjCol.field,vObjCol["searchcondition"]["condition"]+" "+vObjCol.title,vObjCol["searchcondition"]["condition"], vObjCol.field));
                htmlForm.push('</div>');
                htmlForm.push('</div>');
            }
        }

        htmlForm.push('</form>');

        return htmlForm;
    };

    $.extend($.fn.bootstrapTable.defaults, {
        advancedSearch: false,
        idForm: 'advancedSearch',
        actionForm: '',
        firstLoaded:false,
        defaultcondition:[],//默认条件
        initGenerateConditions:{},//组合过后的初始条件
        initConditions:[],//初始条件，数组
        searchcondition:[],//查询条件
        idTable: undefined,
        onColumnAdvancedSearch: function (field, text) {
            return false;
        }
    });

    $.extend($.fn.bootstrapTable.defaults.icons, {
        advancedSearchIcon: 'glyphicon-chevron-down'
    });

    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'column-advanced-search.bs.table': 'onColumnAdvancedSearch'
    });

    $.extend($.fn.bootstrapTable.locales, {
        formatAdvancedSearch: function() {
            return '高级查询';
        },
        formatAdvancedCloseButton: function() {
            return "关闭";
        }
    });

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initToolbar = BootstrapTable.prototype.initToolbar,
        _initServer = BootstrapTable.prototype.initServer,
        _initSearch = BootstrapTable.prototype.initSearch,
        _load = BootstrapTable.prototype.load;


    BootstrapTable.prototype.initToolbar = function() {
        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        //if (!this.options.search) {
        //    return;
        //}

        //1.用户自定义高级查询需要实现方法名为this.options.idTable+"_search"的函数,该函数返回自定义html
        //example:function table_base1456298888277_search(){
        //      return '<div></div>';
        // }
        //2.用户自定义查询按钮事件实现，定义方法名this.options.idTable+"_searchEvent"的函数
        //example:function table_base1456298888277_searchEvent(){
        //      console.log('yes');
        // }

        var that = this,
            html = [],
            funcName = that.options.idTable+"_search";

        if(typeof window[funcName] === "function"){

            var searchHtml = window[funcName].apply(this) || "";
            html.push(sprintf('<div class="columns columns-%s btn-group pull-%s" role="group">', this.options.buttonsAlign, this.options.buttonsAlign));
            html.push(sprintf('<button class="btn btn-default%s' + '" type="button" name="advancedSearch" title="%s">', that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize, that.options.formatAdvancedSearch()));
            html.push(sprintf('<i class="%s %s"></i>', that.options.iconsPrefix, that.options.icons.advancedSearchIcon))
            html.push('</button></div>');

            that.$toolbar.prepend(html.join(''));
            that.$toolbar.find('button[name="advancedSearch"]')
                .off('click').on('click', function() {
                    showCustomSearch(searchHtml,that.options.formatAdvancedSearch(),that);
                })
        }else if (this.options.advancedSearch) {
            html.push(sprintf('<div class="columns columns-%s btn-group pull-%s" role="group">', this.options.buttonsAlign, this.options.buttonsAlign));
            html.push(sprintf('<button class="btn btn-default%s' + '" type="button" name="advancedSearch" title="%s">', that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize, that.options.formatAdvancedSearch()));
            html.push(sprintf('<i class="%s %s"></i>', that.options.iconsPrefix, that.options.icons.advancedSearchIcon))
            html.push('</button></div>');

            that.$toolbar.prepend(html.join(''));

            that.$toolbar.find('button[name="advancedSearch"]')
                .off('click').on('click', function() {
                    //showAvdSearch(that.columns, that.options.formatAdvancedSearch(), that.options.formatAdvancedCloseButton(), that);
                    var columns = that.options.columns[0];
                    var searchcolumns = [];
                    $.each(columns,function(index,item){
                        if(typeof item["searchcondition"] != "undefined" && item["searchcondition"]["checked"]){
                            searchcolumns.push(item);
                        }

                    })
                    searchcolumns = searchcolumns.length==0?columns:searchcolumns;
                    showAvdSearch(searchcolumns, that.options.formatAdvancedSearch(), that.options.formatAdvancedCloseButton(), that);
                });
        }



    };

    BootstrapTable.prototype.load = function(data) {
        _load.apply(this, Array.prototype.slice.apply(arguments));

        if (typeof this.options.idTable === 'undefined') {
            return;
        } else {
            if (!this.options.firstLoaded) {

                //console.log(this.options.idTable+":"+this.options.firstLoaded);
                var param = JSON.parse(decodeURIComponent(getQueryString(this.options.url, "param"))),
                    height;

                this.options.initGenerateConditions =  {};
                /**
                if(!param || typeof param.condition === "undefined"){
                    this.options.initGenerateConditions =  {};
                }else{
                    this.options.initGenerateConditions =  deepClone(param.condition);
                }*/
                
                if(this.options.height){
                    height = parseInt(this.options.height);
                    height += 10;
                    $("#" + this.options.idTable).bootstrapTable("resetView",{height: height});
                }else{
                    if( window.frameElement){
                        var pFrame = window.frameElement,
                            $parents = $("#" + this.options.idTable).parents("div[type='layout']"),
                            $siblingsHeight = 0;
                        if($parents.length<3){
                            $parents.each(function(index,parent){
                                var $siblings = $(parent);
                                $siblings.each(function(index,item){
                                    var $this = $(item);
                                    $siblingsHeight += $this.height();
                                })
                            })

                            height = pFrame.offsetHeight - $siblingsHeight - 20;

                            $("#" + this.options.idTable).bootstrapTable("resetView",{height: height});
                        }

                    }

                }
                this.options.firstLoaded = true;
            }
        }
    };

    BootstrapTable.prototype.initSearch = function () {
        _initSearch.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.search) {
            return;
        }


        var that = this,
            search = this.$toolbar.find("div.search>input").val();

        this.data = this.data.filter(function(item,index){
            var flag = false;

            for(var key in item){
                var fval = search.toLowerCase();
                var value = item[key];

                if ((typeof value === 'string' || typeof value === 'number') && (value + '').toLowerCase().indexOf(fval) !== -1) {
                    flag = true;
                }
            }
            return flag;
        });
    };

    BootstrapTable.prototype.initServer = function (silent, query) {
        //if(this.options.sidePagination === "server"){
        //    var param = JSON.parse(decodeURIComponent(getQueryString(this.options.url, "param")));
        //    var http = this.options.url.substring(0, this.options.url.indexOf("?"));
        //    var oldCondition = this.options.initGenerateConditions;
        //
        //    if (!oldCondition) {
        //        oldCondition = {};
        //    }
        //    //防止翻页时条件出现重复添加的情况
        //    if(this.pageFrom ==1){
        //        param.condition = appendtoCondition( oldCondition,param.condition);
        //    }
        //
        //    this.options.url = http + "?param=" + encodeURIComponent(JSON.stringify(param));
        //}

        _initServer.apply(this, Array.prototype.slice.apply(arguments));
    }
    BootstrapTable.prototype.onColumnAdvancedSearch = function () {
        //console.log("onColumnAdvancedSearch");
        var that = this;
        var conditions = [];
        if ($.isEmptyObject(that.filterColumnsPartial)) {
            that.filterColumnsPartial = {};
        }
        $("#"+that.options.idForm+"_"+that.options.idTable).find("input").each(function(){
            var text = $.trim($(this).val());
            var $field = $(this).attr("id");
            var compare = $(this).data("compare");
            if (text) {
                var condition = new QueryCondition();
                condition.setCName($field);

                if(compare=="like"){
                    condition.setValue('%'+text+'%');
                }else{
                    condition.setValue(text);
                }
                condition.setCompare(compare);
                that.filterColumnsPartial[$field] = condition;
            } else {
                delete that.filterColumnsPartial[$field];
            }
        });

        $.each(that.filterColumnsPartial,function(key,value){
            conditions.push(value);
        })

        var param = JSON.parse(decodeURIComponent(getQueryString(this.options.url, "param")));
        var http = this.options.url.substring(0, this.options.url.indexOf("?"));
        if(conditions.length>0){
            param.condition = appendtoCondition(this.options.initGenerateConditions,generateCondition(conditions,"and"));
        }else{
            param.condition =  this.options.initGenerateConditions;
        }
        this.options.url = http + "?param=" + encodeURIComponent(JSON.stringify(param));
        //queryRemoteTable(that.options.idTable, conditions);
        refreshTable(that.options.idTable,this.options);

    };
}(jQuery);
