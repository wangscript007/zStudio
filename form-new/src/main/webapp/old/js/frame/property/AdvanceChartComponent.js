//imgBar,imgLine "设置"属性通用

function ChartsConfigProperty(componentObject) {
    this.componentObject = componentObject;
    this.jsonResult = $.extend({},ChartsConfigProperty.DEFAULTS.data);
    this.options = $.extend({}, ChartsConfigProperty.DEFAULTS.options);
    this.suffix = getCurrentTime();
    this.showModalBtnId = "btn_modal_"+this.suffix;
    this.id = this.showModalBtnId;
    this.html = '';
}
//options 中 以"_"开头的属性是自定义属性
ChartsConfigProperty.DEFAULTS = {
    advanceParamName : "chartsadvance",
    optionsParamName : "chartoption",
    titleParamName : "chartstitle",
    legendParamName : "chartslegend",
    tooltipParamName : "chartstooltip",
    toolboxParamName : "chartstoolbox",
    options : {
        _uri:"js/property/bar.json",//自定义_uri属性
        _dataSource:true,//自定义_dataSource属性
        title : {  //标题
            show: true,
            text: "标题",
            subtext: "副标题",
            x: "left",
            y: "top"
        },
        tooltip : {//工具栏提示
            show : true,
            trigger: "item"
        },
        toolbox : {//工具栏

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
                        line : '折线图切换',
                        bar : '柱形图切换',
                        stack : '堆积',
                        tiled : '平铺'
                    },
                    type : ['line', 'bar', 'stack', 'tiled']
                }
            }
        },
        legend: { //图列
            show: true,
            orient: "horizontal",
            x: "center",
            y: "top",
            data:['蒸发量']
        },
        xAxis : [
            {
                type : 'category',
                data : [
                    '1','2','3','4','5',
                    {
                        value:'6',
                        textStyle: {
                            color: 'red',
                            fontSize: 30,
                            fontStyle: 'normal',
                            fontWeight: 'bold'
                        }
                    },
                    '7','8','9','10','11','12'
                ]
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: '蒸发量',
                type: 'bar',
                smooth:true,
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                _xAxis:"x1",
                _yAxis:"y1"
            }
        ]
    },
    data : {
        "y1" : [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        "x1" : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    },
    row : {
        legend : "",
        xAxis : {
            type : "category",
            data : []
        },
        yAxis : {
            type : "value"
        },
        series : {
            name:"",
            type:"bar",
            data:[],
            smooth:true,
            _xAxis:"",
            _yAxis:""
        }

    }
};


ChartsConfigProperty.prototype = {
    constructor: ChartsConfigProperty,
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
            advanceProperty = this._getParameter(ChartsConfigProperty.DEFAULTS.optionsParamName);

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
            '<button class="btn btn-default" type="button" id="',this.showModalBtnId,'">数据设置</button>',
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

            legend = this._getParameter(ChartsConfigProperty.DEFAULTS.legendParamName),
            tooltip = this._getParameter(ChartsConfigProperty.DEFAULTS.tooltipParamName),
            title = this._getParameter(ChartsConfigProperty.DEFAULTS.titleParamName),
            toolbox = this._getParameter(ChartsConfigProperty.DEFAULTS.toolboxParamName);

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
            params.feature = $.extend({},ChartsConfigProperty.DEFAULTS.options.toolbox.feature);
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
                '<div class="col-md-6"><input type="text" class="form-control col-md-12 uri" style="margin-right:5px;"  placeholder="URI" value="',this.options._uri,'"/></div>',
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
            '<td>类型</td>',
            '<td>',
            this._getRadioInlineHtml({
                name:"seriesType"+suffix,
                class:"seriesType",
                options:[
                    {
                        text:"柱状图",
                        value:"bar"
                    },
                    {
                        text:"折线图",
                        value:"line"
                    }
                ]
            },serie.type),
            '</td>',
            '</tr>',
            '<tr>',
            '<td>平滑</td>',
            '<td>',
            this._getRadioInlineHtml({
                name:"seriesSmooth"+suffix,
                class:"seriesSmooth",
                options:[
                    {
                        text:"是",
                        value:"true"
                    },
                    {
                        text:"否",
                        value:"false"
                    }
                ]
            },serie.smooth),
            '</td>',
            '</tr>',
            '<tr>',
            '<td>X轴</td>',
            '<td>',
            '<select class="form-control xAxis">',this._getAxisOptions(serie._xAxis),'</select>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>Y轴</td>',
            '<td>',
            '<select class="form-control yAxis">',this._getAxisOptions(serie._yAxis),'</select>',
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
    _getAxisOptions : function(selectOption){
        var html = [];
        html.push('<option value="">--请选择--</option>');
        for(var key in this.jsonResult){
            var selected = (key==selectOption.toString())?" selected ":"";
            html.push('<option value="'+key+'" '+selected+'>'+key+'</option>');
        }
        return html.join("");
    },
    _initEvents : function(){

        var that = this;

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
                    row:ChartsConfigProperty.DEFAULTS.row
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
        }).on('change',"input.seriesName",function(e){
            var $this = $(this),
                value = $this.val(),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index");

                that.options.legend.data[index] = value;
                that.options.series[index].name = value;


        }).on('click','input.seriesType,input.seriesSmooth',function(e){
            var $this = $(this),
                value = $this.val(),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index");

            if($this.hasClass("seriesType")){
                that.options.series[index].type = value;
            }else if($this.hasClass("seriesSmooth")){
                that.options.series[index].smooth = value;
            }

        }).on("change",'select.xAxis,select.yAxis',function(e){
            var $this = $(this),
                value = $this.find("option:selected").val(),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index");

            if($this.hasClass("xAxis")){
                that.options.series[index]._xAxis = value;
                that.options.xAxis[index].data = that.jsonResult[value];
            }else if($this.hasClass("yAxis")){
                that.options.series[index]._yAxis = value;
                that.options.series[index].data = that.jsonResult[value];
            }
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

        this._insertXAxis(index,row.xAxis);

        this._insertYAxis(index,row.yAxis);

        this._insertSeries(index,row.series);

    },
    _deleteRow : function(index){
        this._deleteLegend(index);
        this._deleteXAxis(index);
        this._deleteYAxis(index);
        this._deleteSeries(index);
    },
    _insertLegend : function(index,legend){
        this.options.legend.data.splice(index,0,legend);
    },
    _deleteLegend : function(index){
        this.options.legend.data.splice(index,1);
    },
    _insertXAxis : function(index,xAxis){
        this.options.xAxis.splice(index,0,xAxis);
    },
    _deleteXAxis : function(index){
        this.options.xAxis.splice(index,1);
    },
    _insertYAxis : function(index,yAxis){
        this.options.yAxis.splice(index,0,yAxis);
    },
    _deleteYAxis : function(index){
        this.options.yAxis.splice(index,1);
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
    },
    _onClickApply: function () {
        var that = this;
        this._setOptions();
        if(this._validate()){

            var myChart = echarts.init(that.componentObject.find('.showImg')[0]);
            myChart.setOption(that.options);
            this._setParameter(ChartsConfigProperty.DEFAULTS.optionsParamName,encodeURIComponent(JSON.stringify(that.options)));
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
            url = this.options._uri,
            $selectAxis = this.$advanceModal.find("select.xAxis,select.yAxis");

        if(url){
            this._getAjaxData(false,function(json){
                that.jsonResult = json;
                $selectAxis.empty();
                $selectAxis.append(that._getAxisOptions(""));
            });
        }
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

BMapConfigProperty.DEFAULTS  = {
    optionsParamName : "chartoption",
    options : {
        _type:"map",
        overlays : [
            {
                url:"",
                tooltip : {
                    show : true
                },
                label : {
                    show : true
                },
                track : {
                    show : false
                }
            }
        ]
    },
}

function BMapConfigProperty(componentObject){
    this.componentObject = componentObject;
    this.options = $.extend(true,{},BMapConfigProperty.DEFAULTS.options);
    this.id = this.showModalBtnId = "btn_modal_"+getCurrentTime();

}

BMapConfigProperty.prototype = {
    constructor : BMapConfigProperty,
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
                //
                this._appendModal();
                //
                this._initEvents();
                //
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
            optionsProperty = this._getParameter(ChartsConfigProperty.DEFAULTS.optionsParamName);

        if(typeof optionsProperty != "undefined"){
            $.extend(true,this.options,JSON.parse(decodeURIComponent(optionsProperty)));
        }


    },
    _initHtml : function(){
        this.html = [
            '<div class="zte-panel">',
            '<button class="btn btn-primary" type="button" id="',this.showModalBtnId,'">数据设置</button>',
            '</div>'
        ].join("");
    },
    _initModal : function(){
        this.$advanceModal = $(this._getModalHtml());

        this.$confirmBtn = this.$advanceModal.find("button.confirm");
    },
    _initEvents : function(){

        var that = this;


        this.$confirmBtn.off("click").on("click",function(){
            that._onClickApply();
        });

        this.$advanceModal.off("hidden.bs.modal").on("hidden.bs.modal", function (e) {
            that._clear();
        });

        this.$advanceModal.on('change','input.tooltipShow,input.labelShow,input.trackShow',function(e){
            var $this = $(this),
                $overlay = $this.parents("div.overlay"),
                target = "tooltip",
                index = $overlay.data("index");

                if($this.hasClass("tooltipShow")){
                    target = "tooltip";
                }else if($this.hasClass("labelShow")){
                    target = "label";
                }else if($this.hasClass("trackShow")){
                    target = "track";
                }

                if($this.is(':checked')){
                    that.options.overlays[index][target].show = true;
                }else{
                    that.options.overlays[index][target].show = false;
                }
        }).on('blur','input.overlayUrl',function(e){
            var $this = $(this),
                value = $this.val(),
                $overlay = $this.parents("div.overlay"),
                index = $overlay.data("index");

                that.options.overlays[index].url = value;
        });
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
    _onClickApply : function(){
        this._setParameter(BMapConfigProperty.DEFAULTS.optionsParamName,encodeURIComponent(JSON.stringify(this.options)));
        this._hideModal();
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
            //'<tr>',
            //'<td class="col-md-2" style="vertical-align:middle;padding: 4px!important;">',
            //'<label class="control-label" style="margin-bottom: 0px!important;">数据接口</label>',
            //'</td>',
            //'<td style="vertical-align:middle;padding: 4px!important;">',
            //this._getDataSourceHtml(),
            //'</td>',
            //'</tr>',
            '<tr>',
            '<td class="col-md-2" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">覆盖物</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;" class="overlays">',
            this._getOverlaysHtml(),
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
    _getOverlaysHtml : function(){
        var that = this,
            html = [];
        this.options.overlays.forEach(function(overlay,index){
            html.push(that._getOverlayHtml(index,overlay));
        });
        return html.join("");
    },
    _getOverlayHtml : function(index,overlay){
        var suffix = index;
        return [
            '<div class="row overlay" data-index = "',index,'">',
            '<div class="col-md-9">',
            '<table class="table table-bordered">',
            '<tr>',
            '<td>数据接口</td>',
            '<td><input type="text" class="form-control overlayUrl" value="',overlay.url,'" /></td>',
            '</tr>',
            '<tr>',
            '<td>提示框</td>',
            '<td>',
            this._getSingleCheckboxHtml("tooltipShow",overlay.tooltip.show),
            '</td>',
            '</tr>',
            '<tr>',
            '<td>文本标签</td>',
            '<td>',
            this._getSingleCheckboxHtml("labelShow",overlay.label.show),
            '</td>',
            '</tr>',
            '<tr>',
            '<td>支持轨迹</td>',
            '<td>',
            this._getSingleCheckboxHtml("trackShow",overlay.track.show),
            '</td>',
            '</tr>',
            ,'</table>',
            ,'</div>',
            //'<div class="col-md-3">',
            //'<div class="btn-group" style="top: 100px">',
            //'<button type="button" class="btn btn-success addLegend"><span class="glyphicon glyphicon-plus"></span></button>',
            //'<button type="button" class="btn btn-danger deleteLegend"><span class="glyphicon glyphicon-minus"></span></button>',
            //,'</div>',
            //,'</div>',
            '</div>'
        ].join("");
    },
    _getSingleCheckboxHtml : function(cls,checked){
        return [
            '<input type="checkbox" class="form-control ',cls,'" name="',cls+getCurrentTime(),'" value="',checked || 'false','" ',checked?'checked':'',' />'
        ].join("");
    },
    _setParameter : function(name,param){
        this.componentObject.attr(name,param);
    },
    _getParameter : function(name){
        return this.componentObject.attr(name);
    },
    _clear : function(){
        this.$advanceModal.remove();
    },
}