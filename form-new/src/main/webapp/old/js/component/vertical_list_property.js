;
(function($,win) {
	var VerticalListProperty = function(){
	}

	VerticalListProperty.prototype.getColor = function(e, component){
		if(e.type==="change"){
			 $(component).attr("vertical-list-color",$(e.target).val());
			 var $comp = $($(component).children()[1]);
			 $comp.removeClass();
			 $comp.addClass("jquery-accordion-menu clearfix " + $(e.target).val());
	 }
	}
	VerticalListProperty.prototype.layoutProportion = function(e, component){
		if(e.type==="focusout"){
			 var obj = $(e.target);
			 var firstDiv = $(component.children()[0]).find(".clearfix:first");
			if(obj.val() != ""){
				var  valueArray = obj.val().split(",");
				debugger;
				if(parseInt(valueArray[0])+parseInt(valueArray[1]) == 12 && valueArray.length == 2){
					$($(firstDiv).children()[0]).removeClass();
					$($(firstDiv).children()[0]).addClass('col-md-'+valueArray[0]+' col-xs-'+valueArray[0]+' col-sm-'+valueArray[0]+' col-lg-'+valueArray[0]+' column ui-sortable');
					$($(firstDiv).children()[1]).removeClass();
					$($(firstDiv).children()[1]).addClass('col-md-'+valueArray[1]+' col-xs-'+valueArray[1]+' col-sm-'+valueArray[1]+' col-lg-'+valueArray[1]+' column ui-sortable');
					
					return true;
				}else{
					bootbox.alert("布局器分隔比例配置错误！分隔比例为0-12之间的数值，分隔比例之和大于0小于12，比例值之间以逗号分隔且为两格布局；如：6,6。");
					return
				}
				
			}
	 }
	 return false;
	}
	VerticalListProperty.prototype.staticValue = function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);			
			var options = obj.val().trim().split("\n");
			if(options!=''){
				$(component.find("ul:first")[0]).empty();//当输入选项有值时才清空按钮值
				debugger;
				$(component).attr("vertical-list-value",encodeURIComponent(options.join('\n')));
				var html = [];
				var name = obj.parents("table").find("#compname").val();
				var id = obj.parents("table").find("#compid").val();
				if(name.trim()==""){
					bootbox.alert("名称不能为空");
				}
				
				for(var i in options)
				{
					var kv = options[i];
					html.push('<li><a href="javascript:;"');
					html.push('id="'+id+'_'+i+'"');
					html.push('>' + kv + '</a></li>');
				}
				$(component.find("ul:first")[0]).append(html.join(" "));
			}
				

			return true;
		}
		return false;
	}
	VerticalListProperty.prototype.verticalListHeight = function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var firstDiv = component.children()[1];
			if(obj.val() != ""){
				$(component).attr("vertical-list-height",obj.val());
				$(firstDiv).css({'height':obj.val()+"px",'overflow':'auto'});
			}else{
				$(component).removeAttr('vertical-list-height');
				$(firstDiv).css({'height':'auto','overflow':'visible'});
			}
			
			return true;
		}
		return false;
	}

	var VerticalListAlignProperty = function(componentObject){
    	this.idLeft = "component_align_left_" + getCurrentTime();
        this.idRight = "component_align_right_" + getCurrentTime();
        this.idCenter = "component_align_center_" + getCurrentTime();
        this.idJustify = "component_align_justify" + getCurrentTime();

        this.idLeftSpan = this.idLeft + "_span";
        this.idRightSpan = this.idRight + "_span";
        this.idCenterSpan = this.idCenter + "_span";

        this.id = this.idLeft + "," + this.idRight + "," + this.idCenter + "," + this.idJustify + ","
            + this.idLeftSpan + "," + this.idRightSpan + "," + this.idCenterSpan;

        this.getHtml = function () {
            var html = [];
            html.push("<div class=\"btn-group\">");
            html.push("<button id=\"" + this.idLeft + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"verticallist-align-left\"><span class=\"glyphicon glyphicon-align-left\" aria-hidden=\"true\" id=\"" + this.idLeftSpan + "\"></span></button>");
            html.push("<button id=\"" + this.idCenter + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"verticallist-align-center\"><span class=\"glyphicon glyphicon-align-center\" aria-hidden=\"true\" id=\"" + this.idCenterSpan + "\"></span></button>");
            html.push("<button id=\"" + this.idRight + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"verticallist-align-right\"><span class=\"glyphicon glyphicon-align-right\" aria-hidden=\"true\" id=\"" + this.idRightSpan + "\"></span></button>");
            html.push("</div>");

            return html.join(" ");
        }

        this.setProperty = function (event, currentPropertyID) {
            if (event.type == "click") {
                debugger;
                currentPropertyID = currentPropertyID.replace("_span", "");
                var selectStyle = $("#" + currentPropertyID).attr("aria-label");
                $(componentObject).attr("alignstyle", encodeURIComponent(selectStyle));
                $($(componentObject).children()[1]).css('text-align',selectStyle.split("-")[2]);
            }
        }
        this.getProperty = function () {
            var data = decodeURIComponent($(componentObject).attr("alignstyle"));
            if (data != "undefined") {
                return data;
            }
            else {
                return "verticallist-align-left";
            }
        }
	}



	var VerticalListHeader = function (componentObject) {
        this.componentObject = componentObject;
        this.registerEvent();
    }

    VerticalListHeader.prototype = {
        /**
         * 组件属性配置
         * */
        getHtml: function () {
            return '<input type="checkbox" class="chk-verticallist-heading-visible mt12" ' + this._getProperty() + '>';
        },


        /**
         * 设置组件属性
         * */
        registerEvent: function () {
        	debugger;
            var $that = this;
            $('.properties .form-panel-body').off("change", ".chk-verticallist-heading-visible")
                .on('change', '.chk-verticallist-heading-visible', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if ($(this).prop("checked")) {
                        $that.componentObject.attr("verticallist-heading", "checked");
                        /*$that.componentObject.find("div:first").removeAttr("style");
                        $that.componentObject.find("hr:first").removeAttr("style");*/
                        $that.componentObject.find("div:first").slideToggle("fast",function(){return});
                        $that.componentObject.find("hr:first").slideToggle("fast",function(){return});
                    } else {
                        $that.componentObject.attr("verticallist-heading", "unchecked");
                        /*$that.componentObject.find("div:first").css("display","none");
                        $that.componentObject.find("hr:first").css("display","none");*/
                        $that.componentObject.find("div:first").slideToggle("fast",function(){return});
                        $that.componentObject.find("hr:first").slideToggle("fast",function(){return});
                    }
                })
        },


        /**
         * 获取组件属性
         * */
        _getProperty: function () {
            var heading = this.componentObject.attr("verticallist-heading");
            if (!heading) {
                heading = "checked";
                this.componentObject.attr("verticallist-heading", "checked");
            }

            return heading;
        }
    }  
	win.verticalListProperty = new VerticalListProperty();
	win.DesignerPropDefine.verticalListHeader = VerticalListHeader;
	win.DesignerPropDefine.verticalListAlignProperty = VerticalListAlignProperty;
})(jQuery,window);
