/**
 * Created by Administrator on 2015/9/28.
 */
function EChartsPie(componentObject) {
    this.componentObject = componentObject;
    this.jsonResult = $.extend({},EChartsPie.DEFAULTS.data);
    this.options = $.extend({}, EChartsPie.DEFAULTS.options);
    this.suffix = getCurrentTime();
    this.showModalBtnId = "btn_modal_"+this.suffix;
    this.id = this.showModalBtnId;
    this.html = '';
}
//options 中 以"_"开头的属性是自定义属性
EChartsPie.DEFAULTS = {
    advanceParamName : "chartsadvance",
    optionsParamName : "chartoption",
    titleParamName : "chartstitle",
    legendParamName : "chartslegend",
    tooltipParamName : "chartstooltip",
    toolboxParamName : "chartstoolbox",
    options : {
        _uri:"js/property/pie.json",
        _dataSource:true,
        title : {
            show: true,
            text: "标题",
            subtext: "副标题",
            x: "left",
            y: "top"
        },
        tooltip : {
            show : true,
            trigger: "item"
        },
        toolbox : {

            show: true,
            orient: "horizontal",
            x: "right",
            y: "top",
            feature : {
                dataView : {
                    show : false
                },
                mark : {
                    show : true
                },
                restore :{
                    show : true
                },
                saveAsImage : {
                    show : true
                },
                dataZoom : {
                    show : false
                },
                magicType : {
                    show : true,
                    title : {
                        pie : '饼图',
                        funnel : '漏斗图'
                    },
                    type: ['pie', 'funnel'],
                }
            }
        },
        legend: {
            show: true,
            orient: "horizontal",
            x: "center",
            y: "top",
            data:['视频广告','直接访问']
        },
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:135, name:'视频广告'}
                ]
            }
        ]
    },
    data : [
        {value:335, name:'直接访问'},
        {value:135, name:'视频广告'}
    ],
    row : {
        legend : "访问来源",
        series : {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
            ],
            _data:[] //存储饼图keys
        }

    }
};


EChartsPie.prototype = {
    constructor: EChartsPie,
    //获取基础属性html
    getHtml: function () {
        this._init();
        return this.html;
    },
    //注册事件
    setProperty : function(event,currentPropertyID){
        if(event.type == "click"){
            if(currentPropertyID == this.showModalBtnId){

                this._initModal();

                this._appendModal();

                this._initEvents();

                this._showModal();
            }
        }
    },
    _init: function () {
        this._initData();
        this._initHtml();
    },
    _initData: function(){
        var that = this,
            advanceProperty = this._getParameter(EChartsPie.DEFAULTS.optionsParamName);

        if(typeof advanceProperty != "undefined"){
            $.extend(this.options,JSON.parse(decodeURIComponent(advanceProperty)));
        }
        this._setOptions();

        if(this.options._uri){
            this._getAjaxData(true,function(json){
                that.jsonResult = json;
            })
        }

    },
    _initHtml : function(){
        this.html = [
            '<div class="zte-panel">',
            '<button class="btn btn-primary" type="button" id="',this.showModalBtnId,'">数据设置</button>',
            '</div>'
        ].join("");
    },
    _getAjaxData:function(async,successCallback){
        $.ajax({
            url: this.options._uri,
            type : 'get',
            dataType : 'json',
            cache : false,
            async : async,
            contentType : 'application/json; charset=UTF-8',
            success : successCallback,
            error:function (XMLHttpRequest, textStatus, errorThrown){
                console.error(errorThrown);
            }
        });
    },
    _clear : function(){
        this.$advanceModal.remove();
    },
    _setParameter : function(name,param){
        this.componentObject.attr(name,param);
    },
    _getParameter : function(name){
        return this.componentObject.attr(name);
    },
    _setOptions : function(){
        var

            legend = this._getParameter(EChartsPie.DEFAULTS.legendParamName),
            tooltip = this._getParameter(EChartsPie.DEFAULTS.tooltipParamName),
            title = this._getParameter(EChartsPie.DEFAULTS.titleParamName),
            toolbox = this._getParameter(EChartsPie.DEFAULTS.toolboxParamName);

        if(typeof legend != "undefined"){
            $.extend(this.options.legend,this._filterParams("legend",JSON.parse(decodeURIComponent(legend))));
        }

        if(typeof tooltip != "undefined"){
            $.extend(this.options.tooltip,this._filterParams("tooltip",JSON.parse(decodeURIComponent(tooltip))));
        }

        if(typeof title != "undefined"){
            $.extend(this.options.title,this._filterParams("title",JSON.parse(decodeURIComponent(title))));
        }

        if(typeof toolbox != "undefined"){
            $.extend(this.options.toolbox,this._filterParams("toolbox",JSON.parse(decodeURIComponent(toolbox))));
        }
    },
    _getOptions : function(){
        return this.options;
    },
    /**
     * 兼容旧版本中show参数为"isShow","true" or "false" 转换为 true or false
     * @param params
     * @private
     */
    _filterParams : function(name,params){
        for(var param in params){

            if(params[param]==="true"){
                params[param] = true;
            }else if(params[param]==="false"){
                params[param] = false;
            }

            if(param=="isShow"){
                params["show"] = params["isShow"];
                delete params.isShow;
            }

            if(param=="title"){
                params["text"] = params["title"];
                delete params.title;
            }

            if(param=="subtitle"){
                params["subtext"] = params["subtitle"];
                delete params.subtitle;
            }
        }

        if(name=="toolbox"){
            params.feature = $.extend({},EChartsPie.DEFAULTS.options.toolbox.feature);
            params.feature.dataView.show = params.dataview;
            delete params.dataview;
            params.feature.dataZoom.show = params.zoom;
            delete params.zoom;
            params.feature.mark.show = params.mark;
            delete params.mark;
            params.feature.restore.show = params.restore;
            delete params.restore;
            params.feature.magicType.show = params.switch;
            delete params.switch;
            params.feature.saveAsImage.show = params.save;
            delete params.save;
        }

        return params;
    },
    _initModal : function(){
        this.$advanceModal = $(this._getModalHtml());

        this.$showAdvanceModalBtn = $("#"+this.showModalBtnId);
        this.$APIAddress = this.$advanceModal.find("input.uri");
        this.$dsType = this.$advanceModal.find('input[name="dataSource"]');
        this.$legends = this.$advanceModal.find("td.legends");


        this.$confirmBtn = this.$advanceModal.find("button.confirm");
    },
    _appendModal : function(){
        $("body").append(this.$advanceModal);
    },
    _showModal : function(){
        this.$advanceModal.modal({
            backdrop: "static",
            show: true
        });
    },
    _hideModal : function(){
        this.$advanceModal.modal('hide');
    },
    _getModalHtml : function(){
        return [
            '<div  class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
            '<div class="modal-dialog modal-sm">',
            '<div class="modal-content">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>',
            '<h4 class="modal-title">高级设置</h4>',
            '</div>',
            '<div class="modal-body">',
            '<div class="container-fluid">',
            '<div class="row">',
            '<div class="col-md-12">',
            this._getModalBodyTableHtml(),
            '</div>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="modal-footer">',
            '<button type="button" class="btn btn-primary confirm">确定</button>',
            '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
        ].join("");
    },
    _getModalBodyTableHtml : function(){
        return [
            '<table class="table table-bordered">',
            '<thead>',
            '<tr style="background-color:#E0ECFF">',
            '<th>属性</th>',
            '<th>值</th>',
            '</tr>',
            '</thead>',
            '<tbody>',
            '<tr>',
            '<td class="col-md-2" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">数据接口</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;">',
            this._getDataSourceHtml(),
            '</td>',
            '</tr>',
            '<tr>',
            '<td class="col-md-2" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">图例</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;" class="legends">',
            this._getLegendsHtml(this.options.series),
            ' </td>',
            '</tr>',
            '</tbody>',
            ' </table>'
        ].join("");
    },
    _getDataSourceHtml : function(){
        return [
            '<div class="row">',
            '<div class="col-md-6"><input type="text" class="form-textbox form-textbox-text col-md-12 uri" style="margin-right:5px;"  placeholder="URI" value="',this.options._uri,'"/></div>',
            //'<div class="col-md-6"><input type="checkbox" class="dataSource" style="cursor:pointer;"', this._getIsOrmProperty(),'/>自定义URL</div>',
            '<div class="col-md-6"><input type="checkbox" name="dataSource" style="cursor:pointer;"', this.options._dataSource?"checked":"",'/>自定义URL</div>',
            '</div>'
        ].join("");
    },
    _getRadioInlineHtml : function(radios,checkOption){
        var html = [];
        radios.options.forEach(function(radio){
            var checked = (radio.value == checkOption.toString())?" checked ":"";
            html.push('<div class="radio-inline">');
            html.push('<input type="radio" class="'+radios.class+'" name="'+radios.name+'" '+checked+' value="'+radio.value+'"/>'+radio.text);
            html.push('</div>');

        })
        return html.join("");
    },
    _getLegendsHtml : function(series){
        var html = [],
            that = this;
        series.forEach(function(serie,index){
            html.push(that._getLegendHtml(index,serie));
        })
        return html.join("");
    },
    _getLegendHtml : function(index,serie){
        var suffix = index;
        return [
            '<div class="row legends" data-index = "',index,'">',
            '<div class="col-md-9">',
            '<table class="table table-bordered">',
            '<tr>',
            '<td>名称</td>',
            '<td><input type="text" class="form-control seriesName" value="',serie.name,'" /></td>',
            '</tr>',
            '<tr>',
            '<td>坐标</td>',
            '<td>',
                '<div class="form-horizontal">',
                    '<div class="form-group">',
                        '<label class="col-md-3 control-label">X轴</label>',
                        '<div class="col-md-9">',
                            '<input type="text" class="form-control centerX" value="',serie.center[0],'" />',
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<label class="col-md-3 control-label">Y轴</label>',
                        '<div class="col-md-9">',
                            '<input type="text" class="form-control centerY" value="',serie.center[1],'" />',
                        '</div>',
                    '</div>',
                '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>半径</td>',
            '<td>',
                '<input type="text" class="form-control seriesRadius" value="',serie.radius,'" />',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>数据</td>',
            '<td>',
            '<select class="form-control seriesData" multiple="multiple">',this._getSelect2Options(serie._data),'</select>',
            '</td>',
            '</tr>',
            ,'</table>',
            ,'</div>',
            '<div class="col-md-3">',
            '<div class="btn-group" style="top: 100px">',
            '<button type="button" class="btn btn-success addLegend"><span class="glyphicon glyphicon-plus"></span></button>',
            '<button type="button" class="btn btn-danger deleteLegend"><span class="glyphicon glyphicon-minus"></span></button>',
            ,'</div>',
            ,'</div>',
            '</div>'
        ].join("");
    },
    _getSelect2Options : function(selectOption){
        var html = [],
            selectOption = selectOption || [];
        this.jsonResult.forEach(function(data,index){
            var selected = ($.inArray(data.name,selectOption)!=-1)?" selected ":"";
            html.push('<option value="'+data.name+'" '+selected+'>'+data.name+'</option>');
        })
        return html.join("");
    },
    _initEvents : function(){

        var that = this;

        this.$advanceModal.find("select.seriesData").select2();

        this.$APIAddress.off("blur").on("blur", function () {
            var $this = $(this),
                value = $this.val();

            that.options._uri = value;

            that._dataSourceBlur();

        });
        //
        this.$confirmBtn.off("click").on("click",function(){
            that._onClickApply();
        });
        this.$dsType.off("click").on("click",function(event){
            that._setDsTypeProperty(event);
        });

        this.$advanceModal.on("click","button.addLegend",function(e){
            var $this = $(this),
                $legend = $this.parents("div.legends"),
                index = parseInt($legend.data("index")),
                nextIndex = index+ 1;

            that._insertRow({
                index:nextIndex,
                row:EChartsPie.DEFAULTS.row
            });

            that._resetView();


        }).on("click","button.deleteLegend",function(e){
            var $this = $(this),
                $parents = $this.parents("div.legends"),
                index = parseInt($parents.data("index")),
                legends = that.options.legend.data;

            if(legends.length>1){
                that._deleteRow(index);
                that._resetView();
            }
        }).on('change',"input.seriesName,input.centerX,input.centerY,input.seriesRadius",function(e){
            var $this = $(this),
                value = $this.val(),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index");

            if($this.hasClass("seriesName")){
                that.options.series[index].name = value;
            }else if($this.hasClass("centerX")){
                that.options.series[index].center.splice(0,1,value);
            }else if($this.hasClass("centerY")){
                that.options.series[index].center.splice(1,1,value);
            }else if($this.hasClass("seriesRadius")){
                that.options.series[index].radius = value;
            }



        }).on("change",'select.seriesData',function(e){
            var $this = $(this),
                value = $this.val() || [],
                $legend = $this.parents("div.legends"),
                legnedData = [],
                index = $legend.data("index");

                that.options.series[index].data = that._map(that.jsonResult,function(data){
                   var result = data.filter(function(item,index){
                                                return $.inArray(item.name,value) != -1;
                                            });
                    return result;
                });
                that.options.series[index]._data = value;

                //value.forEach(function(item,index){
                //    if($.inArray(item,that.options.legend.data)==-1){
                //        that.options.legend.data.push(item);
                //    }
                //});

                that.options.series.forEach(function(item,index){
                   legnedData = legnedData.concat(item._data);
                });
                that.options.legend.data = $.unique(legnedData);
        });
        this.$advanceModal.off("hidden.bs.modal").on("hidden.bs.modal", function (e) {
            that._clear();
        });
    },

    _insertRow : function(params){
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        var
            index = params.index,
            row = params.row;

        this._insertLegend(index,row.legend);

        this._insertSeries(index,row.series);

    },
    _deleteRow : function(index){
        this._deleteLegend(index);
        this._deleteSeries(index);
    },
    _insertLegend : function(index,legend){
        this.options.legend.data.splice(index,0,legend);
    },
    _deleteLegend : function(index){
        this.options.legend.data.splice(index,1);
    },
    _insertSeries : function(index,series){
        this.options.series.splice(index,0,series);
    },
    _deleteSeries : function(index){
        this.options.series.splice(index,1);
    },

    _resetView : function(){
        var that = this;
        this.$legends.empty();
        this.$legends.append(that._getLegendsHtml(that.options.series));
        this.$advanceModal.find("select.seriesData").select2();
    },
    _onClickApply: function () {
        var that = this;
        this._setOptions();
        if(this._validate()){

            var myChart = echarts.init(that.componentObject.find('.showImg')[0]);
            myChart.setOption(that.options);
            this._setParameter(EChartsPie.DEFAULTS.optionsParamName,encodeURIComponent(JSON.stringify(that.options)));
            this._hideModal();
        }

    },
    _validate : function(){
        var that = this,
            $seriesName = this.$advanceModal.find("input.seriesName"),
            $xAxis = this.$advanceModal.find("select.xAxis"),
            $yAxis = this.$advanceModal.find("select.yAxis"),
            flag = true;

        $seriesName.each(function(){
            var $this = $(this),
                value = $this.val();

            if(!$.trim(value)){
                flag = false;
                return false;
            }
        });
        if(!flag){
            bootbox.alert("图列名称不能为空!");
            return flag;
        }

        $xAxis.each(function(){
            var $this = $(this),
                value = $this.find("option:selected").val();

            if(!$.trim(value)){
                flag = false;
                return false;
            }
        });
        if(!flag){
            bootbox.alert("X轴不能为空!");
            return flag;
        }
        $yAxis.each(function(){
            var $this = $(this),
                value = $this.find("option:selected").val();

            if(!$.trim(value)){
                flag = false;
                return false;
            }
        });
        if(!flag){
            bootbox.alert("Y轴不能为空!");
            return flag;
        }

        return flag;
    },
    _dataSourceBlur: function(){
        //根据数据源调用接口：
        var that = this,
            url = this.options._uri;

        if(url){
            this._getAjaxData(false,function(json){
                that.jsonResult = json;
                that._initSelect2();
            });
        }
    },
    _initSelect2 : function(){
        var $select2 = this.$advanceModal.find("select.seriesData");
        $select2.empty().append(this._getSelect2Options()).select2();
    },
    _map : function(data,fn){
       return fn(data);
    },
    _setDsTypeProperty: function(event){
        if(event.type == "click"){
            var isormds = "true";
            if(event.target.checked){
                isormds = "false";
            }
            this.componentObject.attr("isormds",isormds);
        }
    },
    _getIsOrmProperty: function(){
        var isormds = this.componentObject.attr("isormds");
        if(isormds == undefined || isormds == "true"){
            this.componentObject.attr("isormds","true");
            //$("#"+$(componentObject).attr("compid")).attr("isormds","true");
            return "";
        }else{
            return "checked = true ";
        }
    }
}


