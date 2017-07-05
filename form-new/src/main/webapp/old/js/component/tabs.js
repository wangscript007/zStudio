/**
 * Created by 10089289 on 2016/8/10.
 */
;(function($, win) {
    win.tabClickEvent = function () {
        $('.demo').on('click', 'ul.nav li', function () {
            var $this = $(this),
                parentLis = $(this).parent().find('li');
            parentLis.removeClass('active');
            $this.addClass('active');

            tabCompVisiable($this);
        })
    }

    win.tabCompVisiable = function($clickli) {
        $clickli.parent().parent().parent().find('.tab-content').children('.lyrow ').css('display','none');
        var targetid = $clickli.find('a').attr('href');
        $(targetid).parent().parent().css('display','block');
        layoutResize($clickli.parents('.column:first'));
    }


    win.initTabComponent = function(componentObject, targetId) {
        var $componentObject = $(componentObject),
            $div = $("#" + targetId);

        // 如果div不存在则添加div
        if(!$div[0]) {
            var divHtml = ['<div class="lyrow ui-draggable" style="display: block;">',
                '	<a href="#close" class="remove label label-danger showRemove">',
                '		<i class="glyphicon-remove glyphicon">',
                '		</i>',
                '	</a>',
                '	<div class="preview">',
                '		12/自定义',
                '	</div>',
                '	<div class="view form-component_active">',
                '		<div type="layout" ratio="12" compid="'+targetId+'" compname="'+targetId+'" layoutstyle="" id="'+targetId+'">',
                '			<div class="row clearfix">',
                '				<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column ui-sortable" style="padding-bottom: 5px;">',
                '					',
                '				</div>',
                '			</div>',
                '		</div>',
                '	</div>',
                '</div>'].join(' ');
            $componentObject.find(".tab-content").append(divHtml);
            sortableComponent();
            //dragComponent();
        }
    }

    win.updateTabCloseOption = function (component) {
        var $component = $(component),
            close = $component.attr('data-close') === 'true' ? true : false,
            option = JSON.parse(decodeURIComponent($component.attr('options'))),
            nav_tabs = $component.find("ul.nav");

        //清空选项卡
        nav_tabs.find('li').remove();

        $.each(option, function (index, item) {
            var values = [];
            values.push('<li ' + (index == 0 ? 'class="active"' : '') + '>');
            if(close) {
                values.push('<span class="tab-close"><i class="glyphicon-remove glyphicon"></i></span>');
            }
            values.push('<a href="#' + item.targetid + '" i18nkey="'+ item.title +'"  data-toggle="tab">' + item.title + '</a></li>');
            nav_tabs.append(values.join(' '));
        });
        tabCompVisiable($(component).find('.nav li.active'));
    }

    win.updateTabDirection = function (component) {
        var $component = $(component),
            direction = $component.attr('data-tabdirection'),
            option = JSON.parse(decodeURIComponent($component.attr('options'))),
            nav_tabs = $component.find("ul.nav"),
            firstChild = $($component.children()[0]);

        //top选项卡调整
        if(firstChild.hasClass('content')) {
            firstChild.removeClass('content p25').addClass('tab-block');
            firstChild.append(firstChild.find('ul').removeClass('panel-tabs-border panel-tabs panel-tabs-left').addClass('tabs-'+direction));
            firstChild.find('ul li[class="tab-toolbar"]').remove();
            firstChild.find('.panel-heading').remove();
            firstChild.append(firstChild.find('.tab-content').removeClass('pn br-n'));
            firstChild.find('.panel-body').remove();
        }
        //左右选项卡调整
        else {
            if(direction === 'top') {
                firstChild.removeClass('tab-block').addClass('content p25');
                var header = $('<div class="panel-heading"></div>'),
                    body = $('<div class="panel-body br-t"></div>');
                header.append(firstChild.find('ul').removeClass('tabs-left tabs-right').addClass('panel-tabs-border panel-tabs panel-tabs-left'));
                body.append(firstChild.find('.tab-content').addClass('pn br-n'));
                firstChild.append(header).append(body);
                firstChild.children('ul .tab-content').remove();
            }
            else {
                firstChild.find('ul').removeClass('tabs-left tabs-right').addClass('tabs-' + direction);
            }
        }
        var toolbar = new TabToolBarOptionsProp(component);
        toolbar.operator();
        toolbar = null;

        firstChild.find('ul li').removeClass('active');
        firstChild.find('ul li:first').addClass('active');
        tabCompVisiable($(component).find('.nav li.active'));

    }

    $(function () {
        $.each($('.container div[type="tab"]'), function(index, item) {
            var eventStr = $(this).attr("componentevent");
            if(eventStr !== undefined && eventStr.length > 0) {
                var events = JSON.parse(decodeURIComponent(eventStr)).events,
                    eventCodes = [];

                if (events === undefined) {
                    events = [];
                }
                $.each(events, function (index1, item1) {
                    eventCodes.push(item1.substring(item1.indexOf('value=') + 6));
                });
                $(item).find("li").on('click', function () {
                    $.each(eventCodes, function (index, item) {
                        eval(item);
                    })
                });
            }

            //工具栏按钮事件注册
            $.each($(item).find('button.tab-button'), function (index1, item1) {
                var func = $(item1).data('function');
                if(func) {
                    $(item1).on('click', function () {
                        eval(decodeURIComponent(func));
                    })
                }
            });

            $.each($(item).find('li > span.tab-close'), function (index1, item1) {
                $(item1).on('click', function () {
                    bootbox.confirm("确认要删除选项卡吗？", function(result){
                        if(result){
                            var link = $(item1).siblings()[0];
                            if(link) {
                                var divid = $(link).attr('href');
                                var reference = $(item1).parent().siblings().map(function() {
                                    var child = $(this).children('a');
                                    if(child[0]) {
                                        if ($(child).attr('href') === divid) {
                                            return true;
                                        }
                                    }
                                });

                                if(!reference[0]) {
                                    $(divid).remove();
                                }
                            }
                            $(item1).parent().remove();
                        }
                    });
                })
            });

            // 初始化显示第一个tab页
            $(".container .nav>li[class!='tab-toolbar']").removeClass('active');
            $(".container .nav>li[class!='tab-toolbar']:first>a").tab('show');

        });
    });


})(jQuery, window);