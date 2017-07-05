var TabToolBarOptionsProp = function (currentCoponent) {
    this.currentCoponent = $(currentCoponent);
	this.ulId = "toolbar-ul"+new Date().getTime();
	this.registerEvent();
}


TabToolBarOptionsProp.prototype = {
    getHtml: function () {
        var options = JSON.parse(decodeURIComponent(this.currentCoponent.attr('data-tools-options'))),
            html = [];
        html.push('<ul id="'+this.ulId+'" style="list-style: none; padding: 0; margin: 0;">');

        if(options[0]) {
            $.each(options, function (index, item) {
                html.push(['<li style="display: -webkit-inline-box">',
                    '<input type="text" placeholder="标题" value="' + item.title + '" class="form-textbox form-textbox-text col-xs-3 toolbar-input-title">',
                    '<input type="text" placeholder="函数名" value="' + item.func + '" class="form-textbox form-textbox-text col-xs-4 toolbar-input-function">',
                    '<button type="button" id="toolbar-icon-' + index + '" data-icon="' + item.icon + '"  class="btn btn-default btn-xs toolbar-btn-icon tab-prop-toolbar col-xs-1"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>',
                    '<button type="button" class="btn btn-default btn-xs toolbar-btn-row-add tab-prop-toolbar col-xs-1"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>',
                    '<button type="button" class="btn btn-default btn-xs toolbar-btn-row-remove tab-prop-toolbar col-xs-1"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>',
                    '</li>'].join(' '));
            });
        }
        else {
            html.push('<li style="display: -webkit-inline-box"><button type="button" id="btn-add-first" style="margin-right:2px;" class="btn btn-default btn-sm toolbar-btn-row-add col-md-12"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> 新增</button></li>');
        }
        html.push('</ul>');
        return html.join(' ');
    },
    operator: function () {
        var tools = [],
            html = [];
        $.each($("#"+this.ulId+" li"), function (index, item) {
            $this = $(item);
            if(!$this.find('.toolbar-input-title').val()) {
                return true;
            }
            var func = $this.find('.toolbar-input-function').val() ? $this.find('.toolbar-input-function').val() : '',
                title = $this.find('.toolbar-input-title').val() ? $this.find('.toolbar-input-title').val() : '无标题',
                icon = $this.find('.toolbar-btn-icon').attr('data-icon') ? $this.find('.toolbar-btn-icon').attr('data-icon') : '',
                tool = {func:func, title: title, icon: icon};
            tools.push(tool);
        });

        //更新样式
        this.currentCoponent.attr('data-tools-options', encodeURIComponent(JSON.stringify(tools)));
        this.currentCoponent.find('div[class="tab-toolbar btn-group"]').remove();
        if(this.currentCoponent.attr('data-tabdirection') === 'top') {
            //构造html代码
            $.each(tools, function (index, item) {
                var id = "btn" + getCurrentTime() + index;
                var temp = '<button id="' + id + '" class="btn btn-info btn-sm tab-button" data-function="' + encodeURIComponent(item.func) + '">';
                if (item.icon) {
                    temp += '<span class="' + item.icon + '"></span> ';
                }
                temp += item.title + '</button>';
                html.push(temp);
            });

            this.currentCoponent.append($('<div class="tab-toolbar btn-group"></div>').append(html.join(' ')));
        }
        else {
            tools.length > 0 ? bootbox.alert('选项卡方向为上方才支持工具栏。') : '';
        }
    },
	bindEvent: function() {
		var that = this;
		var dataTime = new Date().getTime();
		$("#"+that.ulId).append(['<li style="display: -webkit-inline-box">',
		'<input type="text" id="toolbar-input-title-' + dataTime + '" placeholder="标题" value="标题" class="form-textbox form-textbox-text col-xs-3 toolbar-input-title">',
		'<input type="text" id="toolbar-input-function-' + dataTime + '" placeholder="函数" value="" class="form-textbox form-textbox-text col-xs-4 toolbar-input-function">',
		'<button type="button" id="toolbar-icon-' + dataTime + '" style="margin-left:2px; margin-right:2px;" data-icon="" class="btn btn-default btn-xs toolbar-btn-icon tab-prop-toolbar col-xs-1"><span class="glyphicon glyphicon-search" aria-hidden="true"> </span></button>',
		'<button type="button" id="btn-add-' + dataTime + '" style="margin-right:2px;" class="btn btn-default btn-xs toolbar-btn-row-add tab-prop-toolbar col-xs-1"><span class="glyphicon glyphicon-plus" aria-hidden="true"> </span></button>',
		'<button type="button" id="btn-remove-' + dataTime + '" class="btn btn-default btn-xs toolbar-btn-row-remove tab-prop-toolbar col-xs-1"><span class="glyphicon glyphicon-minus" aria-hidden="true"> </span></button>',
		'</li>'].join(' '));
		$('#btn-add-' + dataTime).click(function(){
			that.bindEvent();
			that.operator();
		});
		$('#btn-remove-' + dataTime).click(function(){
			$(this).parent().remove();
			var liLength = $("#"+that.ulId).find('li').length;
                if (liLength == 0) {
                    $("#"+that.ulId).append('<li style="display: -webkit-inline-box"><button type="button" id="btn-add-first" style="margin-right:2px;" class="btn btn-default btn-xs toolbar-btn-row-add col-md-12"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> 新增</button></li>');
                }
                that.operator();
		});
		$('#toolbar-input-title-' + dataTime).on('blur',function(){
			that.operator();
		});
		$('#toolbar-input-function-' + dataTime).on('blur',function(){
			that.operator();
		});
		$('#toolbar-icon-' + dataTime).click(function(){
			var $this = $(this);
                $("#iconModal").css("z-index", 10000);
                showModalDialog("iconModal", "工具栏图标选择", "html/icon.html?type=tab-toolbar-icon&id=" + $this.attr("id"));
		});
	},
    registerEvent: function () {
		var that = this;
		$('.properties .form-panel-body').hover(function(){
			var id = $("#compid").val();
			that.currentCoponent = $('div[compid='+id+']');
			if (that && $('#btn-add-first').length > 0) {
				$('#btn-add-first').click(function() {
					that.bindEvent();
					$(this).parent().remove();
					that.operator();
					
				});
			}else{
				$.each($('.properties .form-panel-body').find('.toolbar-btn-row-add'),function(index, item){
					$this = $(item);
					$this.unbind("click");
					$this.click(function(){
						that.bindEvent();
						that.operator();
					})
				});
				$.each($('.properties .form-panel-body').find('.toolbar-btn-row-remove'),function(index, item){
					$this = $(item);
					$this.unbind("click");
					$this.click(function(){
						console.log($(this));
						$(this).parent().remove();
						var liLength = $("#"+that.ulId).find('li').length;
							if (liLength == 0) {
								$("#"+that.ulId).append('<li style="display: -webkit-inline-box"><button type="button" id="btn-add-first" style="margin-right:2px;" class="btn btn-default btn-xs toolbar-btn-row-add col-md-12"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> 新增</button></li>');
							}
							that.operator();
					})
				});
				$.each($('.properties .form-panel-body').find('.toolbar-input-function'),function(index, item){
					$this = $(item);
					$this.unbind("blur");
					$this.blur(function(){
						that.operator();
					})
				});
				$.each($('.properties .form-panel-body').find('.toolbar-input-title'),function(index, item){
					$this = $(item);
					$this.unbind("blur");
					$this.blur(function(){
						that.operator();
					})
				});
				$.each($('.properties .form-panel-body').find('.toolbar-btn-icon'),function(index, item){
					$this = $(item);
					$this.unbind("click");
					$this.click(function(){
						var $this = $(this);
						$("#iconModal").css("z-index", 10000);
						showModalDialog("iconModal", "工具栏图标选择", "html/icon.html?type=tab-toolbar-icon&id=" + $this.attr("id"));
					})
				});
			}
        },function(){  
        });  
		
		
    }

}

var TabToolbarActiveProp = function (currentCoponent) {
    this.currentCoponent = $(currentCoponent);
    this.registerEvent();
}


TabToolbarActiveProp.prototype = {
    getHtml: function () {
        var option = '',
            html = [],
            that = this;
        if(this.currentCoponent.attr('data-active')) {
            option = JSON.parse(decodeURIComponent(this.currentCoponent.attr('data-active')));
        }
        html.push('<select class="form-textbox form-combo col-md-12" id="toobar-active-select">');
        html.push('<option value="无">无</option>');
        $.each(this.currentCoponent.find('a'), function (index, item) {
            var text = $(item).find('.tab-label').text().trim(),
                select = '';
            if(text === option) {
                select = selected;
            }
            html.push('<option value="'+text+'" '+select+'>'+text+'</option>');
        });
        html.push('</select>');
        return html.join(' ');
    },

    registerEvent: function () {
        var that = this;
        $('.properties .form-panel-body').on('change', '#toobar-active-select', function () {
            var $this = $(this),
                $as = that.currentCoponent.find('a');
            $as.removeClass('active');
            $.each($as, function (index, item) {
                var $item = $(item);
                if($item.find('.tab-label').text() === $this.val()) {
                    $item.addClass('active');
                }
            });
        });
    }

}
