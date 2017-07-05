var ToolBarOptionsProp = function (currentCoponent) {
    this.currentCoponent = $(currentCoponent);
    this.registerEvent();
}


ToolBarOptionsProp.prototype = {
    getHtml: function () {
        var options = JSON.parse(decodeURIComponent(this.currentCoponent.attr('data-options'))),
            html = [],
            that = this;
        html.push('<ul id="toolbar-ul" style="list-style: none; padding: 0; margin: 0;">');

        $.each(options, function (index, item) {
            html.push(['<li><input type="text" placeholder="uri" value="'+item.uri+'" class="form-textbox form-textbox-text col-md-5 toolbar-input-uri">',
                '<input type="text" placeholder="标题" value="'+item.title+'" class="form-textbox form-textbox-text col-md-3 toolbar-input-title">',
                '<button type="button" id="toolbar-icon-'+index+'" style="margin-left:2px; margin-right:2px;" data-icon="'+item.icon+'"  class="btn btn-info btn-xs toolbar-btn-icon col-md-1"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>',
                '<button type="button" style="margin-right:2px;" class="btn btn-info btn-xs toolbar-btn-row-add col-md-1"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>',
                '<button type="button" class="btn btn-info btn-xs toolbar-btn-row-remove col-md-1"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>',
                '</li>'].join(' '));
        });
        html.push('</ul>');
        return html.join(' ');
    },

    operator: function () {
        var tools = [],
            html = [];
        $.each($("#toolbar-ul li"), function (index, item) {
            var $this = $(item),
                uri = $this.find('.toolbar-input-uri').val() ? $this.find('.toolbar-input-uri').val() : '#',
                title = $this.find('.toolbar-input-title').val() ? $this.find('.toolbar-input-title').val() : '无标题',
                icon = $this.find('.toolbar-btn-icon').attr('data-icon') ? $this.find('.toolbar-btn-icon').attr('data-icon') : 'icon icon-home',
                tool = {uri:uri, title: title, icon: icon};
            tools.push(tool);
        });
        $.each(tools, function(index, item) {
            html.push(['<a class="tab-item external" href="'+item.uri+'">',
            '    <span class="'+item.icon+'"></span>',
            '    <span class="tab-label">'+item.title+'</span>',
            '    </a>'].join(' '));
        });
        this.currentCoponent.find('.bar-tab').empty().append(html.join(' '));
        this.currentCoponent.attr('data-options', encodeURIComponent(JSON.stringify(tools)));
    },

    registerEvent: function () {
        var that = this,
            clickTimes = 10;
        $('.properties .form-panel-body').on('click', '.toolbar-btn-row-add', function () {
            clickTimes++;
            var liLength = $("#toolbar-ul").find('li').length;
            if(liLength >= 5) {
                alert('工具栏最多支持5个选项.');
                return;
            }
            $("#toolbar-ul").append(['<li><input type="text" placeholder="uri" value="#" class="form-textbox form-textbox-text col-md-5 toolbar-input-uri">',
                '<input type="text" placeholder="标题" value="无标题" class="form-textbox form-textbox-text col-md-3 toolbar-input-title">',
                '<button type="button" id="toolbar-icon-'+clickTimes+'" style="margin-left:2px; margin-right:2px;" data-icon="icon icon-home" class="btn btn-info btn-xs toolbar-btn-icon col-md-1"><span class="glyphicon glyphicon-search" aria-hidden="true"> </span></button>',
                '<button type="button" style="margin-right:2px;" class="btn btn-info btn-xs toolbar-btn-row-add col-md-1"><span class="glyphicon glyphicon-plus" aria-hidden="true"> </span></button>',
                '<button type="button" class="btn btn-info btn-xs toolbar-btn-row-remove col-md-1"><span class="glyphicon glyphicon-minus" aria-hidden="true"> </span></button>',
                '</li>'].join(' '));
            that.operator();
        })
        .on('click', '.toolbar-btn-row-remove', function () {
            var liLength = $("#toolbar-ul").find('li').length;
            if(liLength <= 1) {
                alert('工具栏至少需要一个选项.');
                return;
            }
            $(this).parent().remove();
            that.operator();
        })
        .on('blur', '.toolbar-input-uri,.toolbar-input-title', function () {
        that.operator();
        })
        .on('click', '.toolbar-btn-icon', function () {
            var $this = $(this);
            $("#iconModal").css("z-index", 10000);
            showModalDialog("toolbarModal", "工具栏图标选择", "html/sui-icon.html?btn-id=" + $this.attr("id"));
        });
    }

}

var ToolbarActiveProp = function (currentCoponent) {
    this.currentCoponent = $(currentCoponent);
    this.registerEvent();
}


ToolbarActiveProp.prototype = {
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
