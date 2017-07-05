function ChartsConnConfigProperty(componentObject, advancePanelObject) {
    this.componentObject = componentObject;
    this.advancePanelObject = advancePanelObject;
    this.jsonResult = "";
}

ChartsConnConfigProperty.prototype = {
    constructor: ChartsConnConfigProperty,
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

        countPerLineHtml = '<select style="display : inline;width:30%;" class="form-control" id="'+this.idCountPerLine+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>';

        imgCountHtml = '<input type="text" id="' + this.idImgCount + '" style="display : inline;width:20%;" class="form-textbox form-textbox-text col-md-12" value="1"/>';

        var advanceProperty = {"APIAddress":"","legendName":"","xType":"category","xData":"","yType":"value","series":[]};

        var dataSource=[];
        dataSource.push('<table>');
        dataSource.push("<tr><td>")
        dataSource.push("<input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" style='margin-right:5px;' id=\""+this.idxDataSource+"\" placeholder=\"URL\" value=\""+advanceProperty.APIAddress+"\" />");
        dataSource.push("</td><td>");
        dataSource.push("<input type=\"checkbox\" id=\""+this.idDSType+"\" style='cursor:pointer;'/>自定义URL")
        dataSource.push("</td></tr>")
        dataSource.push("</table>");
        dataSourceHtml = dataSource.join("");

        legendHtml = '<input type="text" id="' + this.idLegendName + '" placeholder="' + legendPlaceHolder + '" class="form-textbox form-textbox-text col-md-12" value="'+advanceProperty.legendName+'"/>';

        var opt = {type:'radio',name:'',id: this.idXAxisType,options:[{text: 'category',value:'category'},{text: 'value',value:'value'},{text: 'time',value:'time'}]};
        if(advanceProperty.xType == "category"){
            opt.options[0].checked = "checked";
        }else if(advanceProperty.xType == "value"){
            opt.options[1].checked = "checked";
        }else{
            opt.options[2].checked = "checked";
        }
        xAxisTypeHtml = this.getRadioGroup(opt);

        xAxisDataInput = '<input type="text" class="form-control" id="'+this.idXAxisData+'_input" value="'+advanceProperty.xData+'"/>';
        xAxisDataSelect = '<select style="display : inline;width:100%;" class="form-control" id="'+this.idXAxisData+'_select" name ="'+this.idXAxisData+'"></select>';

        opt = {type:'radio',name:'',id: this.idYAxisType,options:[{text: 'category',value:'category'},{text: 'value',value:'value'},{text: 'time',value:'time'}]};
        if(advanceProperty.yType == "category"){
            opt.options[0].checked = "checked";
        }else if(advanceProperty.yType == "value"){
            opt.options[1].checked = "checked";
        }else{
            opt.options[2].checked = "checked";
        }
        yAxisTypeHtml = this.getRadioGroup(opt);

        this.$panel = $([
            '<table class="table table-bordered">',
                ' <thead>',
                    '<tr style="background-color:#E0ECFF">',
                        '<th colspan="2">公共属性设置</th>',
                    '</tr>',
                ' </thead>',
                '<tbody>',
                    ' <tr>',
                    ' <td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                    ' <label class="control-label" style="margin-bottom: 0px!important;">图表布局</label>',
                    ' </td>',
                    ' <td style="vertical-align:middle;padding: 4px!important;">每行显示&nbsp;&nbsp;',
                    countPerLineHtml,
                    '&nbsp;&nbsp;个图表</td>',
                    ' </tr>',
                    '<tr>',
                    ' <td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                    ' <label class="control-label" style="margin-bottom: 0px!important;">图表数量</label>',
                    '</td>',
                    '<td style="vertical-align:middle;padding: 4px!important;">共有&nbsp;&nbsp;',
                    imgCountHtml,
                    '&nbsp;&nbsp;个联动图表 </td>',
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
                        ' <td class="col-md-3" style="vertical-align:middle;padding: 4px!important;">',
                        ' <label class="control-label" style="margin-bottom: 0px!important;">图例名称</label>',
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
                        '<td colspan="2" style="text-align: center">',
                        '<button class="btn btn-success viewChartBtn">' ,
                        '<span class="glyphicon glyphicon-search">预览</span>' ,
                        '</button>' ,
                        '</td>',
                    '</tr>',
                '</tbody>',
            ' </table>'
        ].join(''));

        this.$APIAddress = this.$panel.find("input[id*='options_data_source_']");
        this.$legendName = this.$panel.find("input[id*='options_legend_name_']");
        this.$xType = this.$panel.find("input[name*='options_x_type_']");
        this.$xDataInput = this.$panel.find("input[id*='options_x_data_']");
        this.$xDataSelect = this.$panel.find("select[id*='options_x_data_']");
        this.$yType = this.$panel.find("input[name*='options_y_type_']");
        this.$viewChartBtn = this.$panel.find("button.viewChartBtn");
        this.$dsType = this.$panel.find("input[id*='options_data_DSType_']");
        this.$imgCountPerLine = this.$panel.find("select[id*='option_count_per_line_']");
        this.$imgCount = this.$panel.find("input[id*='option_img_count_']");

        if(this.jsonResult != ""){
            this.$xDataInput.hide();
            this.$xDataSelect.show().empty();
            for(var key in this.jsonResult){
                this.$xDataSelect.append('<option value="'+key+'">'+key+'</option>');
            }
            this.$xDataSelect.val(advanceProperty.xData);
        }else{
            this.$xDataInput.show();
            this.$xDataSelect.hide();
        }

        this.advancePanelObject.empty();
        this.advancePanelObject.append(this.$panel);

        //根据advanceProperty的值来设置显示动态series面板
//        this.showDynamicPanel(event);
//        this.bindDynamicEvent();
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
            commonProperty.imgCount = imgCount;
            that.reSetDivRatio(imgCount,imgPreLine);
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$APIAddress.off("blur").on("blur",function(event){
            that.xAxisDataBlur();
            commonProperty.xAxisURL = this.value;
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$dsType.off("click").on("click",function(event){
            commonProperty.dsType = this.checked;
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
        });

        this.$legendName.off("blue").on("blur",function(event){
            commonProperty.legendName = this.value;
            that.componentObject.attr("commonAdvance",encodeURIComponent(JSON.stringify(commonProperty)));
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
                        " col-lg-"+ratio+" column ui-sortable'><div class='showImg_"+j+"_"+i+"' style='height: 400px;' _echarts_instance_=''/></div></div>";
                }
            }
        }
        //调整对象布局比例
        this.componentObject.html(html);
        //重新绑定sortable事件
        sortableComponent();
        this.showForkCharts(imgCount,imgPreLine);
    },
    showForkCharts: function(imgCount,imgPreLine){
        var option = {tooltip:{trigger:'axis'},legend:{data:['蒸发量','降水量']},toolbox:{show:true,feature:{mark:{show:true},dataView:{show:true,readOnly:false},magicType:{show:true,type:['line','bar']},restore:{show:true},saveAsImage:{show:true}}},calculable:true,xAxis:[{type:'category',data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']}],yAxis:[{type:'value',splitArea:{show:true}}],series:[{name:'蒸发量',type:'bar',data:[2.0,4.9,7.0,23.2,25.6,76.7,135.6,162.2,32.6,20.0,6.4,3.3]},{name:'降水量',type:'bar',data:[2.6,5.9,9.0,26.4,28.7,70.7,175.6,182.2,48.7,18.8,6.0,2.3]}]};
        if(tagType ==="imgLine"){
            option.series[0].type = "line";
            option.series[1].type = "line";
        }
        for(var j=0;j<Math.ceil(imgCount/imgPreLine);j++){
            for(var i=0;i<imgPreLine;i++){
                var myChart = echarts.init(this.componentObject.find(".showImg_"+j+"_"+i)[0]);
                myChart.setOption(option);
            }
        }
    },
    xAxisDataBlur: function(){
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
                },
                error:function (XMLHttpRequest, textStatus, errorThrown){
                    that.jsonResult = "";
                    console.log("In dataSourceBlur : 数据接口调用错误，请输入正确的地址");
                    that.$xDataInput.show();
                    that.$xDataSelect.hide();
                }
            });
        }
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
    setCommonProperty: function(event){
        var that = this;
        var commonProperty = that.getCommonProperty();

    },
    getDefaultCommonProperty: function(){
        var defaultCommonProperty = {};
        defaultCommonProperty.imgPerLine = "1";
        defaultCommonProperty.imgCount = "1";
        defaultCommonProperty.xAxisURL = "";
        defaultCommonProperty.dsType = "false";
        defaultCommonProperty.legendName = "";
        defaultCommonProperty.xType = "category";
        defaultCommonProperty.xData = "";

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
    }
}