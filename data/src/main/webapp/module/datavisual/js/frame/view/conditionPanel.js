
(function($, win){
    var ConditionPanel = function () {
    };

    ConditionPanel.prototype = {
        _getPanelHtml : function(ctrlItem){
            var panelHtml = [];
            var dataType = ctrlItem.field.dataType;
            var conditionType = ctrlItem.ctrlItemType;
            //having筛选时拼接聚合方式
            if(conditionType == "having" && dataType != "string" ){
                panelHtml.push('<span>聚合方式：</span> ');
                panelHtml.push('<input name="input_radio1490082511981" id="input_radio1490082511981_0" type="radio" value="sum">');
                panelHtml.push('<span class="pr10">求和</span>');
                panelHtml.push('<input name="input_radio1490082511981" id="input_radio1490082511981_1" type="radio" value="avg">');
                panelHtml.push('<span class="pr10">平均值</span>');
                panelHtml.push('<input name="input_radio1490082511981" id="input_radio1490082511981_2" type="radio" value="count">');
                panelHtml.push('<span class="pr10">计数</span>');
                panelHtml.push('<hr>');
            }

            if(this._checkDataTypeIsNumber(dataType)){
                panelHtml.push( '<select id="c_select" style="padding:5px 0;margin-left: 20px">');
                panelHtml.push('<option value="between">区间</option>');
                panelHtml.push('<option value="<">小于</option>');
                panelHtml.push('<option value=">">大于</option>');
                panelHtml.push('<option value="=">等于</option>');
                panelHtml.push('</select>   ');

                panelHtml.push('<div id="between_div" style="display:inline-block;margin-left: 15px"> ');
                panelHtml.push('   <input type="text" id="minValue" placeholder="请输入开始值" style="width:100px ;text-align: center"> ');
                panelHtml.push('  ~  ');
                panelHtml.push('<input type="text" id="maxValue" placeholder="请输入结束值" style="width:100px;text-align: center">');
                panelHtml.push('</div>');

                panelHtml.push('<div id="equal_div" style="display:none;margin-left:60px"> ');
                panelHtml.push('   <input type="text" id="equalValue" placeholder="请输入数值" style="width:120px;text-align: center "> ')
                panelHtml.push('</div>');

                panelHtml.push('<br><br><br>');

                panelHtml.push('');

                panelHtml.push('');
                panelHtml.push('');
                panelHtml.push('');

            }else if (dataType == "string"){
                panelHtml.push( '<select id="str_select" style="padding:5px 0;margin-left: 20px">');
                panelHtml.push('<option value="=">等于</option>');
                panelHtml.push('<option value="!=">不等于</option>');
                panelHtml.push('<option value="like">模糊查询</option>');
                panelHtml.push('</select>   ');

                panelHtml.push('<div id="str_div" style="display:inline-block;margin-left:60px"> ');
                panelHtml.push('   <input type="text" id="strValue" placeholder="请输入值" style="width:120px;text-align: center "> ')
                panelHtml.push('</div>');
                panelHtml.push('<br><br><br>');

            }else{
                //默认类型
            }
            panelHtml.push('<div class="col-md-6 col-xs-6 col-sm-6 col-lg-6"> ');
            panelHtml.push('<button class="btn btn-default" id="remove_btn">移除</button>');

            panelHtml.push('</div>');
            panelHtml.push('<div class="col-md-3 col-xs-3 col-sm-3 col-lg-3"> ');
            panelHtml.push('<button class="btn btn-default" id="reset_btn">重置</button>');

            panelHtml.push('</div>');
            panelHtml.push('<div class="col-md-3 col-xs-3 col-sm-3 col-lg-3"> ');
            panelHtml.push('<button class="btn btn-default" id="ok_btn">确认</button>');

            panelHtml.push('</div>');
            return panelHtml.join("");
        },

        _checkDataTypeIsNumber : function(dataType){
            return dataType == "int" || dataType == "decimal" || dataType == "float" || dataType == "bigint" || dataType == "double";
        },

        showPanel : function(el,ctrlItem){
            var that = this;
            var d_width = 360;
            var d_height = 140;
            if(ctrlItem.ctrlItemType == "having" && ctrlItem.field.dataType!="string"){
                d_height = 200;
            }
            
            var d = dialog({
                content: that._getPanelHtml(ctrlItem) ,
                quickClose: true, // 点击空白处快速关闭

                //API 初始化面板 赋值
                onshow : function(){
                        var dataType = ctrlItem.field.dataType;
                        if(that._checkDataTypeIsNumber(dataType)) {
						var compareType = ctrlItem.operation.compare || "between";
                            var aggrType = ctrlItem.operation.aggr;

                            if(ctrlItem.operation.condition == "having"){
                                if(aggrType){
                                    $(":radio[name=input_radio1490082511981][value="+aggrType+"] ").attr("checked",true);
                                }else{
                                    $(":radio[name=input_radio1490082511981][value=sum]").attr("checked",true);
                                }
                            }
                            
							var $c_select = $("#c_select");
                            $c_select.val(compareType);
                            
                            if(compareType.split(" ")[0] == "between") {
								//比较符为between and 时，转换为两个条件 < > 进行查询
								$("#minValue").val(compareType.split(" ")[1]);
								$("#maxValue").val(ctrlItem.operation["value"]);
								$("#c_select").val("between");
							}else{
								if($c_select.val() == "<"){
									$("#minValue").attr("disabled",true).val("");
									$("#maxValue").val(ctrlItem.operation["value"]);
								}else if($c_select.val() == ">" ){
									$("#maxValue").attr("disabled",true).val("");
									$("#minValue").val(ctrlItem.operation["value"]);
								}else if($c_select.val() == "="){
									$("#between_div").css("display","none");
									$("#equal_div").css("display","inline-block");
									$("#equalValue").val(ctrlItem.operation["value"]);
								}
							}
							
					}else if(dataType == "string"){
					var compareType = ctrlItem.operation.compare || "="
                            $("#str_select").val(compareType);
                            $("#strValue").val(ctrlItem.operation["value"]);
                        }
						},
                padding:2
            }).width(d_width).height(d_height);

            //API  移除dialog时将输入条件保存到ctrlItem
            d.addEventListener('beforeremove',function(){
                var $tmpdom = $(":radio[name=input_radio1490082511981]:checked ");
                var aggrType = $tmpdom.val();
                if (aggrType) {
                    ctrlItem.operation.aggr = aggrType;
                }

                var dataType = ctrlItem.field.dataType;
                if(that._checkDataTypeIsNumber(dataType)){
                    var $minValue = $("#minValue");
                    var $maxValue = $("#maxValue");
                    var $equalValue = $("#equalValue");
                    if(isNaN($minValue.val()) || isNaN($maxValue.val()) || isNaN($equalValue.val())){
                        alert("请输入数值！");
                        return false;
                    }
                    var $c_select = $("#c_select");
                    if($c_select.val() == "between"){
                        ctrlItem.operation.compare = "between " + $minValue.val()+ " and ";
                        ctrlItem.operation.value = $maxValue.val();
                    }else {
                        ctrlItem.operation.compare = $c_select.val();
                        if($c_select.val() == "<") {
                            ctrlItem.operation.value = $maxValue.val();
                        }else if($c_select.val() == ">"){
                            ctrlItem.operation.value = $minValue.val();
                        }else if($c_select.val() == "="){
                            ctrlItem.operation.value = $equalValue.val();
                        }
                    }
                }else if(dataType == "string"){
                    var $strValue = $("#strValue");
                    var $str_select = $("#str_select");
                    ctrlItem.operation.compare = $str_select.val();
                    if(ctrlItem.operation.compare == "=" || ctrlItem.operation.compare =="!="){
                        ctrlItem.operation.value = $strValue.val();
                    }else if(ctrlItem.operation.compare == "like")
                        ctrlItem.operation.value ="%"+$strValue.val()+"%";
                }
            });

            d.show(el);

            //条件面板内部控制下拉框js
            $("#c_select").change(function() {
                if($(this).val() == "<"){
                    $("#between_div").css("display","inline-block");
                    $("#equal_div").css("display","none");
                    $("#minValue").attr("disabled",true).val("");
                    $("#maxValue").attr("disabled",false);
                }else if($(this).val() == ">"){
                    $("#between_div").css("display","inline-block");
                    $("#equal_div").css("display","none");
                    $("#minValue").attr("disabled",false);
                    $("#maxValue").attr("disabled",true).val("");
                }else if($(this).val() == "between"){
                    $("#between_div").css("display","inline-block");
                    $("#equal_div").css("display","none");
                    $("#minValue").attr("disabled",false);
                    $("#maxValue").attr("disabled",false);
                }else if($(this).val() == "="){
                    //$("#minValue").val("")
                    $("#between_div").css("display","none");
                    $("#equal_div").css("display","inline-block");

                }
            });


            $("#remove_btn").click(function(){
                // 从界面中移除对应的dom元素
                datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemRemoved(ctrlItem);
                ctrlItem.getDom().remove();

                d.close().remove();

                //重绘
                datavisual.pluginManager.redrawActiveComponentWrapper();
            });

            $("#ok_btn").click(function(){
                //验证输入条件 todo
                //通过调用移除dialog操作保存输入内容
                d.close().remove();
				
                //触发图表重绘
                datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                datavisual.pluginManager.redrawActiveComponentWrapper();
                
            });

            $("#reset_btn").click(function(){
                $("#minValue").val("").attr("disabled",false);
                $("#maxValue").val("").attr("disabled",false);
                $("#equalValue").val("");
                $("#c_select").val("between");

                $("#between_div").css("display","inline-block");
                $("#equal_div").css("display","none");
                $("#str_select").val("=");
                $("#strValue").val("");
            });
        }
    };


    win.ConditionPanel = new ConditionPanel();
})(jQuery, window);