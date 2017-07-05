function showChart(chartId,chartOption){
    var _chartOption = deepClone(chartOption);
    if(!chartId || !_chartOption){
        return;
    }
    var myChart = null;
    //"type":"multi","imgCount":"2","imgPerLine":"1",
    var storedOption = _chartOption;
    if(storedOption._type != undefined && storedOption._type === "multi"){
        //多图联动
        myChart = _showMultiChart(chartId,_chartOption);
    }else if(storedOption._type === "map"){
        myChart = _showBMapChart(chartId,_chartOption);
    }else{
        //单图
        myChart = _showSingleChart(chartId,_chartOption);
    }
    setChartToMap(chartId,myChart);
}

function _showSingleChart(chartId,storedOption){
    var myChart = echarts.init($("#"+chartId)[0]);
    var option = storedOption.option || storedOption;
    var xData = option.xAxis ? option.xAxis[0].data : "";
    var seriesLength = option.series.length;
    var seriesData = [];
    for(var i=0; i<seriesLength; i++){
        seriesData.push(option.series[i].data);
    }
    var isDataValid = true;

    $.ajax({
        url: option.url || option._uri,
        type : 'get',
        dataType : 'json',
        cache : false,
        async : false,
        contentType : 'application/json',
        success : function(json){

            if(json){
                var
                    series = option.series,
                    xAxis = option.xAxis;

                if(xAxis){
                    series.forEach(function(item,index){
                        var serie = series[index],
                            x = serie._xAxis,//储存xAxis 适用于直角系图，与echarts属性无关
                            y = serie._yAxis;//储存yAxi
                        serie.data = json[y] || [];
                        xAxis[index].data = json[x] || [];

                    })
                }else{
                    series.forEach(function(item,index){
                        var serie = series[index],
                            _data = serie._data || [],//_data存储饼图keys
                            data = json.filter(function(item){
                                return $.inArray(item.name,_data) != -1;
                            });
                        serie.data = data;

                    })
                }



                //for(var i = 0;i<series.length;i++){
                //    var fields = series[i].fields,
                //        sData = [];
                //
                //    sData = json.filter(function(n) {
                //        return fields.indexOf(n.name)!=-1;
                //    });
                //    series[i].data = sData;
                //}

                isDataValid = true;
            }else{
                isDataValid = false;
            }

            if(isDataValid){
                myChart.setOption(option);
            }else{
                bootbox.alert("指定的X轴数据或数据系列的数据无法正确读取，请检查！")
            }
        },
        error:function (XMLHttpRequest, textStatus, errorThrown){
            console.log("In startProcess : \n error:"+textStatus+"|errorThrown:"+errorThrown);
            bootbox.alert("接口调用错误！\n将为您显示默认示例图表。");
            option = {title:{text:"示例图表"},tooltip:{trigger:'axis'},legend:{data:['蒸发量','降水量']},toolbox:{show:true,feature:{mark:{show:true},dataView:{show:true,readOnly:false},magicType:{show:true,type:['line','bar']},restore:{show:true},saveAsImage:{show:true}}},calculable:true,xAxis:[{type:'category',data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']}],yAxis:[{type:'value',splitArea:{show:true}}],series:[{name:'蒸发量',type:'bar',data:[2.0,4.9,7.0,23.2,25.6,76.7,135.6,162.2,32.6,20.0,6.4,3.3]},{name:'降水量',type:'bar',data:[2.6,5.9,9.0,26.4,28.7,70.7,175.6,182.2,48.7,18.8,6.0,2.3]}]};
            myChart.setOption(option);
        }
    }) ;

    return myChart;
};
function _showMultiChart(chartId,storedOption){
    var jsonResult = {},
        imgCount = storedOption.imgCount,
        imgPerLine = storedOption.imgPerLine,
        $multiChart = $("#"+chartId).find("div.showImg"),
        imgMap = [];

        jsonResult =  _getAjaxResult(storedOption._uri);

    for(var i=0;i<imgCount;i++){
        var option = storedOption.option[i];
        option.xAxis[0].data = jsonResult[storedOption._xAxis] || [];
        var yAxisUrl = option.series[0]._uri;
        jsonResult =  _getAjaxResult(yAxisUrl);

        option.series[0].data = jsonResult[option.series[0]._yAxis] || [];
        option.tooltip.formatter = function (params) {
            //console.log(params);
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
    return imgMap;
};
function _showBMapChart(chartId,storedOption){
    // 百度地图API功能
    var map = new BMap.Map(chartId);
    var point = new BMap.Point(116.331398,39.897445);
    map.centerAndZoom(point,12);

    var infoWindowOpts = {
        width : 250,     // 信息窗口宽度
        height: 80,     // 信息窗口高度
        title : "信息窗口"  // 信息窗口标题
    };

    // 编写自定义函数,创建标注
    function addMarker(options,data){
        point = new BMap.Point(data[0],data[1]);
        var  marker = new BMap.Marker(point);

        map.addOverlay(marker);              // 将标注添加到地图中
        if(options.label.show){
            var label = new BMap.Label(data[2],{offset:new BMap.Size(20,-10)});
            marker.setLabel(label);
        }
        if(options.tooltip.show){
            addClickHandler(data[3],marker);
        }

    }

    function addClickHandler(content,marker){
        marker.addEventListener("mouseover",function(e){
                openInfo(content,e)}
        );
    }
    function openInfo(content,e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,infoWindowOpts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }


    var myCity = new BMap.LocalCity();
    myCity.get(function(result){

        point = new BMap.Point(result.center.lng,result.center.lat);
        map.centerAndZoom(point,12);

        storedOption.overlays.forEach(function(overlay,index){
            var datas =  _getAjaxResult(overlay.url),
                length = datas.length;
            if(length<3){
                return;
            }
            if(!overlay.track.show){
                datas.forEach(function(data,index){
                    addMarker(overlay,data);
                });
            }else{

                var startP = new BMap.Point(datas[0][0],datas[0][1]);    //起点
                var endP = new BMap.Point(datas[length-1][0],datas[length-1][1]);    //终点


                //添加起标志
                //添加终标志
                var startIcon = new BMap.Icon("http://api.map.baidu.com/img/dest_markers.png",new BMap.Size(28, 32),  {     offset: new BMap.Size(10, 25),  imageOffset: new BMap.Size(0, 0)  });
                var endIcon = new BMap.Icon("http://api.map.baidu.com/img/dest_markers.png",new BMap.Size(28, 32),  {     offset: new BMap.Size(-150, -205),  imageOffset: new BMap.Size(0, -34)  });

                var marker = new BMap.Marker(startP, {icon: startIcon});  // 创建标注
                var marker2 = new BMap.Marker(endP, {icon: endIcon});  // 创建标注
                map.addOverlay(marker);              // 将标注添加到地图中
                map.addOverlay(marker2);
                marker.setAnimation(BMAP_ANIMATION_DROP ); //跳动的动画
                marker2.setAnimation(BMAP_ANIMATION_DROP ); //跳动的动画

                var points = [];

                datas.forEach(function(data,index){
                    points.push(new BMap.Point(data[0],data[1]));
                });

                var polyline = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
                map.addOverlay(polyline);
                polyline.enableEditing();
            }

        })


    });


};
function _getAjaxResult(xAxisUrl){
    var jsonResult = {};
    $.ajax({
        url: xAxisUrl,
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
}

/**
 * 更新ECharts图表数据
 * @param chart    echarts对象                     required
 * @param method 方法名称   load/append  required
 * @param series 系列数据   [[seriesIdx,data,isHeaddataGrow,additionData],[seriesIdx,data]]
 * @example updateEChartSeriesData("id","load",[  //饼图重载数据
 *                     {
 *                          seriesIdx:0,
 *                          data:[
 *                              {value:335, name:'直接访问'},
 *                              {value:310, name:'邮件营销'},
 *                              {value:234, name:'联盟广告'},
 *                              {value:135, name:'视频广告'},
 *                              {value:1548, name:'搜索引擎'}
 *                           ]
 *                      }
 *                  ])
 * @example updateEChartSeriesData("id","load",[  //折线图、柱状图重载数据
 *                     {
 *                          seriesIdx:0,
 *                          data:[
 *                              335,120,300,546,213,145,2215,212,125,212,122,35
 *                           ]
 *                      }
 *                  ])
 * @example updateEChartSeriesData("id","append",[     //饼图添加数据
 *                      {
 *                          seriesIdx:0,
 *                          data:{name: '随机数据2',value:Math.round(Math.random()*1000)},
 *                          additionData:'随机数据2'
 *                      }
 *                  ])
 * @example updateEChartSeriesData("id","append",[     //折线图、柱状图添加数据
 *                      {
 *                          seriesIdx:0,
 *                          data:25,
 *                          additionData:'2015-08-26'
 *                      }
 *                  ])
 */
function updateEChartSeriesData(chartId,method,series){

    if(!method){
        console.error("请输入方法名称load/append!");
        return;
    }

    if(!(series instanceof Array)){
        console.error("请输入合法的数组参数");
        return;
    }

    var chart = getChartFromMap(chartId);

    if(!chart){
        console.error("初始化echarts失败");
        return;
    }



    if(method === "append"){
        var _series = [];
        for(var i= 0,len=series.length;i<len;i++){
            _series.push(
                [
                    series[i].seriesIdx,
                    series[i].data,
                    true,
                    true,
                    series[i].additionData
                ]
            )
        }
        chart.addData(_series);
    }else if(method === "load"){
        var oldSeries = chart.getSeries();

        for(var i= 0,len=series.length;i<len;i++){
            for(var j = 0,_len=oldSeries.length;j<_len;j++){
                if(series[i]["seriesIdx"]===j){
                    oldSeries[j].data = series[i]["data"];
                }
            }
        }

        chart.setSeries(oldSeries);

    }

}