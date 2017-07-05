function AdvanceMultiChartComponent1(componentObject, advancePanelObject) {
    this.componentObject = componentObject;
    this.optionsPanelObject = advancePanelObject;
    this.jsonResult = "";

}
var jsonResultMap = new Map();
AdvanceMultiChartComponent1.prototype = {
    constructor: AdvanceMultiChartComponent,
    loadPanel: function(){
        this.init();
    },
    init: function () {
        //this.checkHasImg();
        this.initPanel();
//        this.initData();
        this.initEvent();
    },
    initPanel: function () {
        this.idxDataSource = "options_data_source_" + getCurrentTime();
        this.idDSType = "options_data_DSType_"+getCurrentTime();
        this.idCountPerLine = "option_count_per_line_"+getCurrentTime();
        this.idImgCount = "option_img_count_" + getCurrentTime();
        this.idXAxisType = "options_x_type_" + getCurrentTime();
        this.idXAxisData = "options_x_data_" + getCurrentTime();
        this.idYAxisType = "options_y_type_" + getCurrentTime();
        this.idLegendName = "options_legend_name_" + getCurrentTime();

        var countPerLineHtml = '',
            imgCountHtml = '',
            dataSourceHtml = '',
            legendHtml = '',
            legendPlaceHolder = '降雨量,蒸发量',
            imgConnectHtml = '',
            xAxisTypeHtml = '',
            xAxisDataInput = '',
            xAxisDataSelect = '';

        var commonProperty = this.getCommonProperty();

        countPerLineHtml = '<select style="display : inline;width:30%;" class="form-control" id="'+this.idCountPerLine+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>';

        imgCountHtml = '<input type="text" id="' + this.idImgCount + '" style="display : inline;width:20%;" class="form-textbox form-textbox-text col-md-12" value="1"/>';

        dataSourceHtml = this._getDataSource(this.idxDataSource,this.idDSType);

        legendHtml = '<input type="text" id="' + this.idLegendName + '" placeholder="' + legendPlaceHolder + '" class="form-textbox form-textbox-text col-md-12" value="'+commonProperty.legendName+'"/>';

        var opt = {type:'radio',name:'',id: this.idXAxisType,options:[{text: 'category',value:'category'},{text: 'value',value:'value'},{text: 'time',value:'time'}]};
        if(commonProperty.xType == "category"){
            opt.options[0].checked = "checked";
        }else if(commonProperty.xType == "value"){
            opt.options[1].checked = "checked";
        }else{
            opt.options[2].checked = "checked";
        }
        xAxisTypeHtml = this.getRadioGroup(opt);

        xAxisDataInput = '<input type="text" class="form-control" id="'+this.idXAxisData+'_input" value="'+commonProperty.xData+'"/>';
        xAxisDataSelect = '<select style="display : inline;width:100%;" class="form-control" id="'+this.idXAxisData+'_select" name ="'+this.idXAxisData+'"></select>';

        this.$panel = $(this._getPanelHtml(countPerLineHtml,
                                            imgCountHtml,
                                            dataSourceHtml,
                                            legendHtml,
                                            xAxisTypeHtml,
                                            xAxisDataInput,
                                            xAxisDataSelect));

        this.$APIAddress = this.$panel.find("input[id*='options_data_source_']");
        this.$legendName = this.$panel.find("input[id*='options_legend_name_']");
        this.$xType = this.$panel.find("input[name*='options_x_type_']");
        this.$xDataInput = this.$panel.find("input[id*='options_x_data_']");
        this.$xDataSelect = this.$panel.find("select[id*='options_x_data_']");
        this.$viewChartBtn = this.$panel.find("button.viewChartBtn");
        this.$dsType = this.$panel.find("input[id*='options_data_DSType_']");
        this.$imgCountPerLine = this.$panel.find("select[id*='option_count_per_line_']");
        this.$imgCount = this.$panel.find("input[id*='option_img_count_']");

        if(commonProperty.xAxisURL != ""){
            this.xAxisDataBlur(commonProperty);
        };
        if(this.jsonResult != ""){
            this.$xDataInput.hide();
            this.$xDataSelect.show().empty();
            for(var key in this.jsonResult){
                this.$xDataSelect.append('<option value="'+key+'">'+key+'</option>');
            }
        }else{
            this.$xDataInput.show();
            this.$xDataSelect.hide();
        };

        this.optionsPanelObject.empty();
        this.optionsPanelObject.append(this.$panel);

        //通过调用legendBlur方法，根据commonProperty的值来设置显示动态series面板
        this.legendBlur(commonProperty);

        //设置属性的默认值
        this._echoDefaultProperty(commonProperty);
    },
    initEvent: function(){
        var that = this;
        var commonProperty = that.getCommonProperty();

        this.$imgCountPerLine.off("click").on("click", function (event) {
            var value = that.$imgCountPerLine.find("option:selected").val();
            var imgCount = that.$imgCount.val();
            commonProperty.imgPerLine = value;
            that.reSetDivRatio(imgCount,value);
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$imgCount.off("blur").on("blur",function(event){
            var imgCount = this.value;
            //--判断，不能比 this.$imgCountPerLine的值小。
            var imgPreLine = that.$imgCountPerLine.find("option:selected").val();
            if(commonProperty.imgCount != imgCount){
                //值改变时才触发以下操作
                commonProperty.imgCount = imgCount;
                that.reSetDivRatio(imgCount,imgPreLine);
                that._generateDynamicValue(commonProperty);
                if(commonProperty.legendName.length > 0){
                    that.legendBlur(commonProperty);
                }
            }
            //that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$APIAddress.off("blur").on("blur",function(event){
            commonProperty.xAxisURL = this.value;
            that._generateDynamicValue(commonProperty);
            that.xAxisDataBlur(commonProperty);
            //that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$dsType.off("click").on("click",function(event){
            commonProperty.dsType = this.checked;
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$legendName.off("blue").on("blur",function(event){
            if(commonProperty.legendName != this.value){
                //值改变时才触发以下操作
                commonProperty.legendName = this.value;
                that.legendBlur(commonProperty);
                that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
            }
        });

        this.$xType.off("click").on("click",function(event){
            commonProperty.xType = $("input[name*='options_x_type_']:checked").val();
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$xDataInput.off("click").on("click",function(event){
            commonProperty.xData = this.find("option:selected").value;
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$xDataSelect.off("blur").on("blur", function(event){
            commonProperty.xData = this.value;
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$viewChartBtn.off("click").on("click",function(event){
            that.onBtnApplyClick(commonProperty);
        });

    },
    reSetDivRatio: function(imgCount,imgPreLine){
        var ratio = 12/imgPreLine;
        var html="";
        var tempCount = 0;
        for(var j=0;j<Math.ceil(imgCount/imgPreLine);j++){
            for(var i=0;i<imgPreLine;i++){
                tempCount += 1;
                if(tempCount <= imgCount){
                    html += "<div class='col-md-"+ratio+
                        " col-xs-"+ratio+
                        " col-sm-"+ratio+
                        " col-lg-"+ratio+" column ui-sortable showImg_"+j+"_"+i+"'  style='height: 400px;' _echarts_instance_=''></div>";
                }
            }
        }
        //调整对象布局比例
        this.componentObject.html(html);
        //重新绑定sortable事件
        sortableComponent();
        this.showForkCharts(imgCount,imgPreLine);
    },
    /* 拖进“多图联动”控件后，显示一个虚拟图表，以方便布局调整*/
    showForkCharts: function(imgCount,imgPerLine){
        var option = {tooltip:{trigger:'axis'},legend:{data:['蒸发量','降水量']},toolbox:{show:true,feature:{mark:{show:true},dataView:{show:true,readOnly:false},magicType:{show:true,type:['line','bar']},restore:{show:true},saveAsImage:{show:true}}},calculable:true,xAxis:[{type:'category',data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']}],yAxis:[{type:'value',splitArea:{show:true}}],series:[{name:'蒸发量',type:'bar',data:[2.0,4.9,7.0,23.2,25.6,76.7,135.6,162.2,32.6,20.0,6.4,3.3]},{name:'降水量',type:'bar',data:[2.6,5.9,9.0,26.4,28.7,70.7,175.6,182.2,48.7,18.8,6.0,2.3]}]};
        for(var j=0;j<Math.ceil(imgCount/imgPerLine);j++){
            for(var i=0;i<imgPerLine;i++){
                var myChart = echarts.init(this.componentObject.find(".showImg_"+j+"_"+i)[0]);
                myChart.setOption(option);
            }
        }
    },
    /* 点击“应用”按钮后，按用户设置生成图表 */
    showApplyCharts: function(commonProperty){
        var imgCount = commonProperty.imgCount;
        var option = {};
        var imgMap = [];
        for(var i=0;i<imgCount;i++){
            option = this._generateViewedOption(i,commonProperty);

            var imgLine = Math.ceil((i+1)/commonProperty.imgPerLine)-1;
            var imgColumn = i%commonProperty.imgPerLine;
            var myChart = echarts.init(this.componentObject.find(".showImg_"+imgLine+"_"+imgColumn)[0]);
            myChart.setOption(option);
            imgMap.push(myChart);
        }
        //设置关联
        for(var i=0;i<imgMap.length;i++){
            var tempImgMap = imgMap[i];
            var tempConnectMap = [];
            for(var j= 0;j<imgMap.length;j++){
                if(j!=i){
                    tempConnectMap.push(imgMap[j]);
                }
            }
            tempImgMap.connect(tempConnectMap);
        }
    },
    xAxisDataBlur: function(commonProperty){
        //根据数据源调用接口：
        var that = this;
        //that.$xDataInput.show();
        var url = $("input[id*='options_data_source_']").val();
        if(url!= null && url.length > 0){
            $.ajax({
                url: url,
                type : 'get',
                dataType : 'json',
                cache : false,
                async : false,
                contentType : 'application/json',
                success : function(json){
                    that.$xDataSelect.empty().show();
                    that.$xDataInput.hide();
                    that.jsonResult = json;
                    for(var key in json){
                        var option = $('<option value="'+key+'">'+key+'</option>');
                        that.$xDataSelect.append(option);
                    }
                    that.$xDataSelect.val(commonProperty.xData);
                    jsonResultMap.put(url,json);
                },
                error:function (XMLHttpRequest, textStatus, errorThrown){
                    that.jsonResult = "";
                    console.log("In dataSourceBlur : 数据接口调用错误，请输入正确的地址");
                    that.$xDataInput.show().val(commonProperty.xData);
                    that.$xDataSelect.hide();
                }
            });
        }
    },
    /* 图例 blur事件。  * */
    legendBlur:function(commonProperty){
        var that = this;
        if(commonProperty.legendName.length > 0){
            //生成动态属性面板
            var html = this._generateDynamicPanel(commonProperty);

            $('#divseries').empty();
            $('#divseries').append(html);
            var url = $("input[id*='options_data_source_']").val();
            if(url != null && url.length>0){
                that.xAxisDataBlur(commonProperty); //保证有jsonResult
            }

            $("input[id*='option_series_data_url_']").off("blur").on("blur",function(event){
                //数据系列的接口值改变时
                var id = event.currentTarget.id;
                var idLength = event.currentTarget.id.length;
                var i = id.substr(idLength-1,idLength);
                if(commonProperty.series[i].yAxisURL != this.value){
                    //如果输入的地址改变，再处理
                    that._seriesDataURLBlur(i,this.value);
                }
            });

            for(var i=0;i<commonProperty.series.length;i++){
                var seriesProperty = commonProperty.series[i];
                var inputData = this.$panel.find("input[id*='options_series_data_"+i+"']");
                var selectData = this.$panel.find("select[id*='options_series_data_"+i+"']");

                var yUrl = seriesProperty.yAxisURL;
                var yData = seriesProperty.yData;

                if(jsonResultMap.get(yUrl) != undefined){
                    selectData.show().empty();
                    inputData.hide();
                    for(var key in jsonResultMap.get(yUrl)){
                        selectData.append('<option value="'+key+'">'+key+'</option>');
                    }
                    selectData.val(yData);
                }else{
                    selectData.hide();
                    inputData.show();
                    inputData.val(yData);
                }
                //回写动态数据接口的值
                that.$panel.find("input[id*='option_series_data_url_"+i+"']").val(yUrl);
            }

            //设置attr: chartslegend的值
            var legendOption = JSON.parse(decodeURIComponent(that.componentObject.attr("chartslegend")));
            legendOption.legendName = that.$panel.find("input[id*='options_legend_name_']").val();
            that.componentObject.attr("chartslegend",encodeURIComponent(JSON.stringify(legendOption)));
        }
    },
    onBtnApplyClick: function(commonProperty){
        //1. 保存commonProperty --主要是存动态属性的值
        this._setDynamicProperty(commonProperty);
        //2. 显示预览图表效果
        this.showApplyCharts(commonProperty);
        //3. 生成attr：chartoption
        this._setChartOption(commonProperty);
    },
    getCommonProperty: function(){
        var rtn = "";
        var defaultCommonProperty = this.componentObject.attr("commonAdvance");
        if(defaultCommonProperty != null){
            rtn = $.parseJSON(decodeURIComponent(defaultCommonProperty))
        }else{
            rtn = this.getDefaultCommonProperty();
        }
        return rtn;
    },
    getDefaultCommonProperty: function(){
        var defaultCommonProperty = {};
        defaultCommonProperty.imgPerLine = "1";
        defaultCommonProperty.imgCount = "1";
        defaultCommonProperty.xAxisURL = "";
        defaultCommonProperty.dsType = false;
        defaultCommonProperty.legendName = "";
        defaultCommonProperty.xType = "category";
        defaultCommonProperty.xData = "";
        //生成series动态属性
        this._generateDynamicValue(defaultCommonProperty);

        this.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(defaultCommonProperty)));
        return defaultCommonProperty;
    },
    getRadioGroup: function(option){
        var html = [];
        html.push('<div class="col-lg-12">');//是否显示标题：&nbsp;&nbsp;')
        html.push(option.name);
        //html.push("：&nbsp;&nbsp;");
        for(var i=0; i< option.options.length; i++){
            html.push('<input name="');
            html.push(option.id);
            html.push('" id="');
            html.push(option.id);
            html.push('_');
            html.push(i);
            html.push('" type="');
            html.push(option.type);
            html.push('" value="');
            html.push(option.options[i]["value"]);
            html.push('"');
            if(option.options[i]["onclick"] != null){
                html.push(' onclick="');
                html.push(option.options[i]["onclick"]);
                html.push('"');
            }
            if(option.options[i]["checked"] != null){
                html.push(' checked="checked">');
            }else{
                html.push('>');
            }
            html.push('<span>');
            html.push(option.options[i]["text"]);
            html.push('&nbsp;&nbsp;</span>');
        }
        html.push("</div>");
        return html.join("");
    },
    _getDataSource: function(idxDataSource,idDSType){
        var dataSource=[];
        dataSource.push('<table>');
        dataSource.push("<tr>");
        dataSource.push("<td><input type='text' class='form-textbox form-textbox-text col-md-12' style='margin-right:5px;' id='"+idxDataSource+"' placeholder='URL' /></td>");
        dataSource.push("<td><input type='checkbox' id='"+idDSType+"' style='cursor:pointer;'/>自定义URL</td>");
        dataSource.push("</tr>");
        dataSource.push("</table>");
        return dataSource.join("");
    },
    /*
     * 生成panel的HTML代码
     * */
    _getPanelHtml: function(countPerLineHtml,
                            imgCountHtml,
                            dataSourceHtml,
                            legendHtml,
                            xAxisTypeHtml,
                            xAxisDataInput,
                            xAxisDataSelect){

        var panel = [
            '<table class="table table-bordered">',
                '<thead>',
                    '<tr style="background-color:#E0ECFF">',
                        '<th colspan="2">公共属性设置</th>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                    '<tr>',
                        '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                        '<label class="control-label" style="margin-bottom: 0px!important;">图表布局</label>',
                        '</td>',
                        '<td style="vertical-align:middle;padding: 4px!important;">每行显示&nbsp;&nbsp;',
                        countPerLineHtml,
                        '&nbsp;&nbsp;个图表</td>',
                    ' </tr>',
                    '<tr>',
                        ' <td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                            ' <label class="control-label" style="margin-bottom: 0px!important;">图表数量</label>',
                        '</td>',
                            '<td style="vertical-align:middle;padding: 4px!important;">共有&nbsp;&nbsp;',
                            imgCountHtml,
                            '&nbsp;&nbsp;个联动图表 ',
                        '</td>',
                    '</tr>',
                    ' <tr>',
                        ' <td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                            ' <label class="control-label" style="margin-bottom: 0px!important;">数据接口</label>',
                        ' </td>',
                        ' <td style="vertical-align:middle;padding: 4px!important;">',
                            dataSourceHtml,
                        '</td>',
                    ' </tr>',
                    '<tr>',
                        '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                            '<label class="control-label" style="margin-bottom: 0px!important;">图例名称</label>',
                        '</td>',
                        '<td style="vertical-align:middle;padding: 4px!important;">',
                            legendHtml,
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                            '<label class="control-label" style="margin-bottom: 0px!important;">X轴</label>',
                        '</td>',
                        '<td style="vertical-align:middle;padding: 4px!important;">',
                            xAxisTypeHtml,
                            xAxisDataInput,
                            xAxisDataSelect,
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;" colspan="2">',
                            '<div id="divseries"></div>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td colspan="2" style="text-align: center">',
                            '<button class="btn btn-success viewChartBtn">' ,
                            '<span class="glyphicon glyphicon-ok">应用</span>' ,
                        '</button>' ,
                        '</td>',
                    '</tr>',
                '</tbody>',
            ' </table>'
        ].join("");
        return panel;
    },
    /*
     * 回写属性的默认值
     * */
    _echoDefaultProperty: function(commonProperty){
        var that = this;
        //公共属性的值
        that.$APIAddress.val(commonProperty.xAxisURL);
        that.$legendName.val(commonProperty.legendName);
        if(that.jsonResult===""){
            that.$xDataInput.val(commonProperty.xData);
        }else{
            that.$xDataSelect.val(commonProperty.xData);
        }
        if(commonProperty.dsType){
            that.$dsType.attr("checked","checked");
        }
        that.$imgCountPerLine.val(commonProperty.imgPerLine);
        that.$imgCount.val(commonProperty.imgCount);

        that._echoDynamicProperty(commonProperty);

    },
    _echoDynamicProperty: function(commonProperty){
        //动态属性的值
        var that = this;
        for(var i=0;i<commonProperty.imgCount;i++){
            var seriesProperty = commonProperty.series[i];
            that.$panel.find("input[id*='option_series_data_url_"+i+"']").val(seriesProperty.yAxisURL);
            if(seriesProperty.dsType){
                that.$panel.find("input[id*='option_series_data_dsType_"+i+"']").attr("checked","checked");
            }
            that.$panel.find("select[id*='option_series_legend_"+i+"']").val(seriesProperty.legendName);
            that.$panel.find("input[id*='options_series_data_"+i+"']").val(seriesProperty.yData);
            that.$panel.find("select[id*='options_series_data_"+i+"']").val(seriesProperty.yData);
        }
    },
    _generateDynamicPanel: function(commonProperty){
        var legendSeries = commonProperty.legendName.split(",");
        var html = "";
        var that = this;
        for(var i=0; i<commonProperty.imgCount; i++){
            var series_type = '',
                series_smooth = '',
                series_data_url = '',
                series_legend_select = '',
                series_data_input = '',
                series_data_select = '';

            var idSeriesType = "options_series_type_" + i,
                idSeriesSmooth = "options_series_smooth_" + i,
                idSeriesDataUrl = "option_series_data_url_" + i,
                idDSType = "option_series_data_dsType_" + i,
                idLegendSelect = "option_series_legend_"+ i,
                idSeriesData = "options_series_data_" + i;

            //样式
            var opt = {type:'radio',name:'',id: idSeriesType,options:[{text: '柱状图',value:'bar'},{text: '折线图',value:'line'}]};
            if(commonProperty.series[i].type == "bar"){
                opt.options[0].checked = "checked";
            }else{
                opt.options[1].checked = "checked";
            }
            series_type = getRadioGroup(opt);

            //平滑
            opt = {type:'radio',name:'',id: idSeriesSmooth,options:[{text: '是',value:'true'},{text: '否',value:'false'}]};
            if(commonProperty.series[i].smooth){
                opt.options[0].checked = "checked";
            }else{
                opt.options[1].checked = "checked";
            }
            series_smooth = getRadioGroup(opt);

            //数据接口
            series_data_url = this._getDataSource(idSeriesDataUrl,idDSType);

            //图例select
            series_legend_select = '<select style="display : inline;width:100%;" class="form-control" id="' +idLegendSelect + '">';
            for(var j=0;j<legendSeries.length;j++){
                series_legend_select += ('<option value = "'+legendSeries[j]+'">'+legendSeries[j]+'</option>');
            }
            series_legend_select += "</select>";

            //数据select / input
            series_data_select = '<select style="display : inline;width:100%;" class="form-control" id="' +idSeriesData + '_select"></select>';
            series_data_input = '<input type="text" class="form-control" id="'+idSeriesData+'_input" value="'+commonProperty.series[i].data+'"/>';

            html = html + that._generateDynamicDiv(i,series_type,series_smooth,series_data_url,series_legend_select,series_data_input,series_data_select);
        }
        return html;
    },
    _generateDynamicDiv: function(i,series_type,series_smooth,series_data_url,series_legend_select,series_data_input,series_data_select){
        var divHtml = ['<table class="table table-bordered">',
            '<thead>',
            '<tr style="background-color:#E0ECFF">',
            '<th colspan="2">',
            '图表',i+1,'属性设置',
            '</th>',
            '</tr>',
            '</thead>',
            '<tbody>',
            '<tr>',
            '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">样式</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;">',
            series_type,
            '</td>',
            ' </tr>',
            '<tr>',
            '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">平滑</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;">',
            series_smooth,
            '</td>',
            ' </tr>',
            '<tr>',
            '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">数据接口</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;">',
            series_data_url,
            '</td>',
            ' </tr>',
            '<tr>',
            '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">图例</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;">',
            series_legend_select,
            '</td>',
            ' </tr>',
            '<tr>',
            '<td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
            '<label class="control-label" style="margin-bottom: 0px!important;">数据</label>',
            '</td>',
            '<td style="vertical-align:middle;padding: 4px!important;">',
            series_data_input,
            series_data_select,
            '</td>',
            ' </tr>',
            '</tbody>',
            '</table>'
        ].join("");
        /*
         * '<tr>',
         '<td rowspan="5" width="15%" style="vertical-align:middle">',
         i,
         '</td>',
         '<td>',
         series_type,
         '</td>',
         '</tr>',
         '<tr>',
         '<td>',
         series_smooth,
         '</td>',
         '</tr>',
         '<tr>',
         '<td>',
         series_data_url,
         '</td>',
         '</tr>',
         '<tr>',
         '<td>',
         series_legend_select,
         '</td>',
         '</tr>',
         '<tr>',
         '<td>',
         series_data_input,
         series_data_select,
         '</td>',
         '</tr>',
         * */
        return divHtml;
    },
    _generateDynamicValue: function(commonProperty){
        commonProperty.series = [];
        var imgPerLine = commonProperty.imgPerLine;
        var imgCount = commonProperty.imgCount;
        for(var i=0; i<imgCount; i++){
            var seriesProperty = {};
            seriesProperty.legendName = commonProperty.legendName;
            seriesProperty.type = "bar";
            seriesProperty.smooth = true;
            seriesProperty.yAxisURL = commonProperty.xAxisURL;
            seriesProperty.dsType = commonProperty.dsType;
            seriesProperty.yData = "";
            commonProperty.series.push(seriesProperty);
        }
        this.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
    },
    /*点击“预览”按钮时，把动态属性保存到 attr : "commonAdvance"中*/
    _setDynamicProperty: function(commonProperty){
        /*
         * var idSeriesType = "options_series_type_" + i;  //input
         var idSeriesSmooth = "options_series_smooth_" + i;  //input
         var idSeriesDataUrl = "option_series_data_url_" + i; //input
         var idDSType = "option_series_data_dsType_" + i;  //input checkbox
         var idLegendSelect = "option_series_legend_"+i; //select
         var idSeriesData = "options_series_data_" + i;  //input & select
         */
        var that = this;
        for(var i=0;i<commonProperty.imgCount;i++){
            var seriesProperty = commonProperty.series[i];
            seriesProperty.legendName = that.$panel.find("select[id='option_series_legend_"+i+"']").val();
            seriesProperty.type = that.$panel.find("input[name='options_series_type_"+i+"']:checked").val();
            if(that.$panel.find("input[name='options_series_smooth_"+i+"']:checked").val() == "true"){
                seriesProperty.smooth = true;
            }else{
                seriesProperty.smooth = false;
            }
//            seriesProperty.smooth = that.$panel.find("input[name='options_series_smooth_"+i+"']:checked").val();
            seriesProperty.yAxisURL = that.$panel.find("input[id='option_series_data_url_"+i+"']").val();
            seriesProperty.dsType = that.$panel.find("input[id='option_series_data_dsType_"+i+"']").is(":checked");
            if(that.jsonResult == ""){
                seriesProperty.yData = that.$panel.find("input[id='options_series_data_"+i+"_input']").val();
            }else{
                seriesProperty.yData = that.$panel.find("select[id='options_series_data_"+i+"_select']").find("option:selected").val();
            }
        }
        this.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
    },
    _generateViewedOption: function(i,commonProperty){
        var option = {};
        // 1. 生成通用属性的option
        option = this._getCommonViewedOption(i,commonProperty);

        //2. 生成series[i]的option
        option = this._getSeriesIOption(option,i,commonProperty);
        return option;
    },
    /* 生成通用属性的option*/
    _getCommonViewedOption: function(i,commonProperty){
        var option = {};

        var titleOption = JSON.parse(decodeURIComponent(this.componentObject.attr("chartstitle")));

        var legendOption = JSON.parse(decodeURIComponent(this.componentObject.attr("chartslegend")));

        var toolTipOption = JSON.parse(decodeURIComponent(this.componentObject.attr("chartstooltip")));

        var toolBoxOption = JSON.parse(decodeURIComponent(this.componentObject.attr("chartstoolbox")));

        option = {
            tooltip: {
                show: toolTipOption.isShow
            },
            legend: {
                show: legendOption.isShow
            },
            toolbox: {
                show: toolBoxOption.isShow
            },
            calculable: true,
            xAxis: [
                {
                    type: commonProperty.xType,
                    data: eval("this.jsonResult."+commonProperty.xData)
                }
            ],
            yAxis: [
                {
                    type: "value",
                    splitArea: {
                        show: true
                    }}
            ],
            series: [

            ]};
        if(i === 0){
            option.title = {};
            option.title.show = titleOption.isShow;
            if(titleOption.isShow === "true"){
                // "isShow":"true","title":"标题","subtitle":"副标题","x":"left","y":"top"}
                option.title.text = titleOption.title;
                option.title.subtext = titleOption.subtitle;
                option.title.x = titleOption.x;
                option.title.y = titleOption.y;
            }
        }

        if(option.tooltip.show == "true"){
            //"{"isShow":"true","trigger":"item"}"
            option.tooltip.showDelay = 0;
            //option.tooltip.trigger =  toolTipOption.trigger;
            option.tooltip.trigger = "axis";
            option.tooltip.formatter = function (params) {
                var res = params[0].name;
                res += '<br/>' + params[0].seriesName;
                res += ' : ' + params[0].value;
                return res;
            }
        }
        if(option.legend.show == "true"){
            //"{"isShow":"true","orient":"horizontal","x":"center","y":"top","legendName":"a,b"}"
            if(i===0){
                option.legend.x = legendOption.x;
                option.legend.y = legendOption.y;
                option.legend.orient = legendOption.orient;
            }else{
                option.legend.y = -30;
            }
            option.legend.data = legendOption.legendName.split(",");
        }

        if(option.toolbox.show == "true"){
            //"{"isShow":"true","orient":"horizontal","x":"right","y":"top","mark":"true","zoom":"false","dataview":"false","switch":"true","restore":"true","save":"true"}"
            if(i===0){
                option.toolbox.x = toolBoxOption.x;
                option.toolbox.y = toolBoxOption.y;
                option.toolbox.orient = toolBoxOption.orient;
            }else{
                option.toolbox.y = -30;
            }
            option.toolbox.feature = {};
            option.toolbox.feature.mark={}
            var selectedToolBox = [];
            $("input:checkbox[name*='options_toolbox_toolbox_']:checked").each(function(){
                selectedToolBox.push($(this).val());
            })
            option.toolbox.feature.mark.show = (selectedToolBox.indexOf("mark")>-1);
            option.toolbox.feature.dataZoom={}
            option.toolbox.feature.dataZoom.show = (selectedToolBox.indexOf("datazoom")>-1);
            if(i>0){
                option.toolbox.feature.dataView={}
                //option.toolbox.feature.dataView.show = (selectedToolBox.indexOf("dataview")>-1);
                option.toolbox.feature.dataView.show = true;
                option.toolbox.feature.dataView.readOnly = false;
            }
            option.toolbox.feature.magicType={}
            option.toolbox.feature.magicType.show = (selectedToolBox.indexOf("magictype")>-1);
            option.toolbox.feature.magicType.type = ['line', 'bar'];
            option.toolbox.feature.restore={}
            option.toolbox.feature.restore.show = (selectedToolBox.indexOf("restore")>-1);
            option.toolbox.feature.saveAsImage={}
            option.toolbox.feature.saveAsImage.show = (selectedToolBox.indexOf("saveasimage")>-1);
        }
        if(i>0){
            option.legend.y = -30;
            option.toolbox.y = -30;
            option.yAxis.splitNumber = 3;
        }
        return option;
    },
    /* 生成series[i]的option*/
    _getSeriesIOption: function(option,i,commonProperty){
        var seriesProperty = commonProperty.series[i];
        var seriesHtml = '';
        var legendName = commonProperty.legendName.split(","); //a,b
        var yData = "";
        if(jsonResultMap.get(seriesProperty.yAxisURL) != undefined){
            yData = eval("jsonResultMap.get(seriesProperty.yAxisURL)."+seriesProperty.yData);
        }else{

        }
        for(var j=0; j<commonProperty.imgCount; j++ ){
            if(legendName[j] == seriesProperty.legendName){
                seriesHtml = [
                    '{',
                    'name: "',
                    seriesProperty.legendName,
                    '",',
                    'type: "',
                    seriesProperty.type,
                    '",',
                    'data:[',
                    yData,
                    '],smooth:"',
                    seriesProperty.smooth,
                    '"}'
                ].join("");
                option.series.push(eval('(' + seriesHtml + ')'));
            }else{
                if(i===0){
                    seriesHtml = [
                        '{',
                        'name: "',
                        legendName[j],
                        '",type:"',
                        'scatter',
                        '",',
                        'data: []}'
                    ].join("");
                    option.series.push(eval('(' + seriesHtml + ')'));
                }
            }
        }
        return option;
    },
    _setChartOption: function(commonProperty){
        var rtnOption = {};
        rtnOption.type = "multi";
        rtnOption.imgCount = commonProperty.imgCount;
        rtnOption.imgPerLine = commonProperty.imgPerLine;
        rtnOption.imgOption = [];
        var that = this;
        for(var i=0; i<commonProperty.series.length;i++){
            var option = that._generateViewedOption(i,commonProperty);
            option.xAxis[0].data = commonProperty.xData;
            option.xAxis[0].xAxisURL = commonProperty.xAxisURL;
            option.series[0].data = commonProperty.series[i].yData;
            option.series[0].yAxisURL = commonProperty.series[i].yAxisURL;
            rtnOption.imgOption.push(option);
        }
        this.componentObject.attr("chartoption",encodeURIComponent(JSON.stringify(rtnOption)));
    },
/*数据系列的接口值改变时//*/
    _seriesDataURLBlur: function(i,url){
        var that = this;
        var seriesDataSelect = $("select[id*='options_series_data_"+i+"_select']");
        var seriesDataInput = $("input[id*='options_series_data_"+i+"_input']");
        $.ajax({
            url: url,
            type : 'get',
            dataType : 'json',
            cache : false,
            async : false,
            contentType : 'application/json',
            success : function(json){
                seriesDataSelect.empty().show();
                seriesDataInput.hide();
                for(var key in json){
                    var option = $('<option value="'+key+'">'+key+'</option>');
                    seriesDataSelect.append(option);
                }
                jsonResultMap.put(url,json);
            },
            error:function (XMLHttpRequest, textStatus, errorThrown){
                seriesDataInput.show();
                seriesDataSelect.hide();
            }
        });
    }

}



function AdvanceMultiChartComponent(componentObject) {
    this.componentObject = componentObject;
    this.jsonResult = $.extend({},AdvanceMultiChartComponent.DEFAULTS.data);
    this.options = $.extend({}, AdvanceMultiChartComponent.DEFAULTS.options);
    this.suffix = getCurrentTime();
    this.showModalBtnId = "btn_modal_"+this.suffix;
    this.id = this.showModalBtnId;
    this.html = '';
}
//options 中 以"_"开头的属性是自定义属性
AdvanceMultiChartComponent.DEFAULTS = {
    optionsParamName : "chartoption",
    titleParamName : "chartstitle",
    legendParamName : "chartslegend",
    tooltipParamName : "chartstooltip",
    toolboxParamName : "chartstoolbox",
    options : {
        _uri:"js/property/bar.json",
        _dataSource:true,
        _xAxis : "x1",
        _legend: {
            data:[]
        },
        imgCount : 1,
        imgPerLine : 1,
        _type:"multi",
        option : [
            {
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
                                line : '折线图切换',
                                bar : '柱形图切换',
                                stack : '堆积',
                                tiled : '平铺'
                            },
                            type : ['line', 'bar', 'stack', 'tiled']
                        }
                    }
                },
                legend: {
                    show: true,
                    orient: "horizontal",
                    x: "center",
                    y: "top",
                    data:[]
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
                        name: '',
                        type: 'bar',
                        smooth:true,
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        _jsonResult : {
                            "y1": [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                        },
                        _uri:'js/property/bar.json',
                        _yAxis:"y1"
                    }
                ]
            }
        ],

    },
    data : {
        "y1" : [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        "x1" : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    },
    row : {
        legend : "",
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


AdvanceMultiChartComponent.prototype = {
    constructor: AdvanceMultiChartComponent,
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
            optionsProperty = this._getParameter(AdvanceMultiChartComponent.DEFAULTS.optionsParamName);


        if(typeof optionsProperty != "undefined"){
            $.extend(this.options,JSON.parse(decodeURIComponent(optionsProperty)));
        }
        this._setOptions();

        if(this.options._uri){
            this._getAjaxData(this.options._uri,true,function(json){
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
    _getAjaxData:function(url,async,successCallback){
        $.ajax({
            url: url,
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
            that = this,
            legend = this._getParameter(AdvanceMultiChartComponent.DEFAULTS.legendParamName),
            tooltip = this._getParameter(AdvanceMultiChartComponent.DEFAULTS.tooltipParamName),
            title = this._getParameter(AdvanceMultiChartComponent.DEFAULTS.titleParamName),
            toolbox = this._getParameter(AdvanceMultiChartComponent.DEFAULTS.toolboxParamName);

        if(typeof legend != "undefined"){

            this._setMultiOption("legend",this._filterParams("legend",JSON.parse(decodeURIComponent(legend))));
        }

        if(typeof tooltip != "undefined"){
            this._setMultiOption("tooltip",this._filterParams("tooltip",JSON.parse(decodeURIComponent(tooltip))));
        }

        if(typeof title != "undefined"){
            this._setMultiOption("title",this._filterParams("title",JSON.parse(decodeURIComponent(title))));
        }

        if(typeof toolbox != "undefined"){
            this._setMultiOption("toolbox",this._filterParams("toolbox",JSON.parse(decodeURIComponent(toolbox))));
        }

        this.options.option.forEach(function(option,index){
            if(index!=0){
                var serie = option.series[0];
                that.options.option[0].series.splice(index,0,{
                    name:serie.name,
                    type:serie.type,
                    data:[]
                })
            }
        });
    },
    _setMultiOption : function(name,extend){
        this.options.option.forEach(function(item,index){
            if(index==0){
                $.extend(item[name],extend);
            }else{
                if(name=="legend" || name=="toolbox"){
                    extend.y = -30;
                }
                if(name=="title"){
                    delete item.title;
                }else{
                    $.extend(item[name],extend);
                }
            }

        })
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
            params.feature = $.extend({},AdvanceMultiChartComponent.DEFAULTS.options.option[0].toolbox.feature);
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
        this.$rowNumber = this.$advanceModal.find("select.rowNumber");
        this.$xAxis = this.$advanceModal.find("select.xAxis");
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
                '<tbody>',
                    '<tr>',
                        '<td>',
                            '<label class="control-label">数据接口</label>',
                        '</td>',
                        '<td>',
                            this._getDataSourceHtml(),
                        '</td>',
                    '<tr>',
                        '<td>',
                            '<label class="control-label">图表布局</label>',
                        '</td>',
                        '<td>',
                            '每行显示&nbsp;&nbsp;<select style="display: inline;width:20%" class="form-control rowNumber">',
                                this._getSelectOptionsHtml([
                                    {name:1,value:1},
                                    {name:2,value:2},
                                    {name:3,value:3},
                                    {name:4,value:4}
                                ],this.options.imgPerLine),
                            '</select>&nbsp;&nbsp;个图表',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td>',
                            '<label class="control-label">X轴</label>',
                        '</td>',
                        '<td>',
                            '<select class="form-control xAxis">',this._getAxisOptions(this.jsonResult,this.options._xAxis),'</select>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td>',
                            '<label class="control-label">图列</label>',
                        '</td>',
                        '<td class="legends">',
                            this._getLegendsHtml(this.options.option),
                        '</td>',
                    '</tr>',
                '</tbody>',
            '</table>'
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
    _getLegendsHtml : function(options){
        var html = [],
            that = this;
        options.forEach(function(option,index){
            html.push(that._getLegendHtml(index,option));
        })
        return html.join("");
    },
    _getLegendHtml : function(index,option){
        var suffix = index,
            serie = option.series[0];
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
            '<td>数据接口</td>',
            '<td>',
            '<input type="text" class="form-control yUri" style="margin-right:5px;"  placeholder="URI" value="',serie._uri,'"/>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td>Y轴</td>',
            '<td>',
            '<select class="form-control yAxis">',this._getAxisOptions(serie._jsonResult,serie._yAxis),'</select>',
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
    _getAxisOptions : function(options,selectOption){
        var html = [];
        html.push('<option value="">--请选择--</option>');
        for(var key in options){
            var selected = (key==selectOption.toString())?" selected ":"";
            html.push('<option value="'+key+'" '+selected+'>'+key+'</option>');
        }
        return html.join("");
    },
    _getSelectOptionsHtml : function(options,selected){
        var html = [];
        options.forEach(function(item,index){
            var select = (!$.isArray(selected)? (item.name==selected.toString()) : $.inArray(item.name,selected)!=-1)?" selected ":"";
            html.push('<option value="'+item.value+'" '+select+'>'+item.name+'</option>');
        });

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

        this.$dsType.off("click").on("click",function(event){
            that._setDsTypeProperty(event);
        });

        this.$rowNumber.off("change").on("change",function(e){
            var $this = $(this),
                value = $this.find("option:selected").val();
            that.advance.imgPerLine = parseInt(value);
        });

        this.$xAxis.off("change").on("change",function(e){
            var $this = $(this),
                value = $this.find("option:selected").val();
            that.options._xAxis = value;
        });



        this.$confirmBtn.off("click").on("click",function(){
            that._onClickApply();
        });

        this.$advanceModal.on("click","button.addLegend",function(e){
            var $this = $(this),
                $legend = $this.parents("div.legends"),
                index = parseInt($legend.data("index")),
                nextIndex = index+ 1;

            that._insertRow({
                index:nextIndex,
                row:that.options.option[index]
            });

            that._resetView();


        }).on("click","button.deleteLegend",function(e){
            var $this = $(this),
                $parents = $this.parents("div.legends"),
                index = parseInt($parents.data("index")),
                legends = that.options.option;

            if(legends.length>1){
                that._deleteRow(index);
                that._resetView();
            }
        }).on('change',"input.seriesName",function(e){
            var $this = $(this),
                value = $this.val(),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index");


            that._updateLegend(index,value);



        }).on('click','input.seriesType',function(e){
            var $this = $(this),
                value = $this.val(),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index");


                that.options.option[index].series[0].type = value;


        }).on("blur",'input.yUri',function(e){
            var $this = $(this),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index"),
                url = $this.val();
            if(url != that.options._uri){
                that._getAjaxData(url,false,function(json){
                    that.options.option[index].series[0]._uri = url;
                    that.options.option[index].series[0]._jsonResult = json;
                    $legend.find("select.yAxis").empty().append(that._getAxisOptions(json,""));
                })
            }else{
                that.options.option[index].series[0]._uri = url;
                that.options.option[index].series[0]._jsonResult = that.jsonResult;
                $legend.find("select.yAxis").empty().append(that._getAxisOptions(that.jsonResult,""));
            }

        }).on("change",'select.yAxis',function(e){
            var $this = $(this),
                value = $this.find("option:selected").val(),
                $legend = $this.parents("div.legends"),
                index = $legend.data("index");

                that.options.option[index].series[0]._yAxis = value;
                that.options.option[index].series[0].data = that.options.option[index].series[0]._jsonResult[value];

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

        this._insertOption(index,row);
        this.options.imgCount = this.options.option.length;

    },
    _deleteRow : function(index){
        this._deleteOption(index);
        this.options.imgCount = this.options.option.length;
    },
    _insertOption : function(index,option){
        var _option = $.extend(true,{},option || AdvanceMultiChartComponent.DEFAULTS.options.option[0]);
        this.options.option.splice(index,0,_option);
        this._insertLegend(index,option.series[0].name);
    },
    _deleteOption : function(index){
        this.options.option.splice(index,1);
        this._deleteLegend(index);
    },
    _insertLegend : function(index,legend){
        this.options._legend.data.splice(index,0,legend);
    },
    _updateLegend : function(index,legend){
        var legendData = this.options._legend.data;
        legendData.splice(index,1,legend);

        this.options.option.forEach(function(item,index){
            item.legend.data = legendData;
        });

        this.options.option[index].series[0].name = legend;
    },

    _deleteLegend : function(index){
        this.options._legend.data.splice(index,1);
    },

    _resetView : function(){
        var that = this;
        this.$legends.empty();
        this.$legends.append(that._getLegendsHtml(that.options.option));
    },
    _onClickApply: function () {
        var that = this;
        this._setOptions();
        if(this._validate()){
            this._setParameter(AdvanceMultiChartComponent.DEFAULTS.optionsParamName,encodeURIComponent(JSON.stringify(that.options)));
            this._hideModal();
            this._resetLayout();
            this._initECharts();
        }

    },
    _resetLayout : function(){
        var rowNumber = this.options.imgPerLine,
            col = Math.ceil(12/rowNumber),
            height = 400,
            optionsLength = this.options.imgCount,
            lineNumber = Math.ceil(optionsLength/rowNumber),
            html = [];

            for(var i = 0;i<lineNumber;i++){
                html.push('<div class="row">');
                    for(var j = 0;j<rowNumber;j++){
                        html.push('<div style="height:'+height+'px" class="col-md-'+col+' column ui-sortable showImg"  _echarts_instance_=""></div>');
                    }
                html.push("</div>");
            }
        this.componentObject.empty().append(html.join(""));
        //重新绑定jQuery.sortable
        sortableComponent();
    },
    _initECharts : function(){
        var that = this,
           jsonResult = {},
                imgCount = that.options.imgCount,
                $multiChart = that.componentObject.find("div.showImg"),
                imgMap = [];

            jsonResult =  this._getAjaxResult(that.options._uri);

            for(var i=0;i<imgCount;i++){
                var option = that.options.option[i];
                option.xAxis[0].data = jsonResult[that.options._xAxis] || [];
                var yAxisUrl = option.series[0]._uri;
                jsonResult =  this._getAjaxResult(yAxisUrl);

                option.series[0].data = jsonResult[option.series[0]._yAxis] || [];
                option.tooltip.formatter = function (params) {
                    var res = params[0].name;
                    res += '<br/>' + params[0].seriesName;
                    res += ' : ' + params[0].value;
                    return res;
                }

                var myChart = echarts.init($multiChart[i]);
                myChart.setOption(option);
                imgMap.push(myChart);
            }
            //设置关联
            for(var i=0;i<imgMap.length;i++){
                var tempImgMap = imgMap[i];
                var tempConnectMap = [];
                for(var j= 0;j<imgMap.length;j++){
                    if(j!=i){
                        tempConnectMap.push(imgMap[j]);
                    }
                }
                tempImgMap.connect(tempConnectMap);
            }

    },
    _getAjaxResult : function(url){
        var jsonResult = {};
        $.ajax({
            url: url,
            type : 'get',
            dataType : 'json',
            cache : false,
            async : false,
            contentType : 'application/json; charset=UTF-8',
            success : function(json){
                jsonResult = json;
            },
            error:function (XMLHttpRequest, textStatus, errorThrown){
                console.log("In startProcess : \n error:"+textStatus+"|errorThrown:"+errorThrown);
            }
        }) ;
        return jsonResult;
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
            $selectAxis = this.$advanceModal.find("select.xAxis");

        if(url){
            this._getAjaxData(that.options._uri,false,function(json){
                that.jsonResult = json;
                $selectAxis.empty();
                $selectAxis.append(that._getAxisOptions(that.jsonResult,""));
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