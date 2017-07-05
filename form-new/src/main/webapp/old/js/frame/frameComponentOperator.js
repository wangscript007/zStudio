/**
 * 表格组件在生成源码前清理无用代码和生成源码后的恢复所见即所得代码。
 * @constructor
 */
function TableComponent(){
    var children = new Map();
    this.sourceCodeOperatorBefore = function(container) {
        $.each(container.find("div[type='table_base'],div[type='table_base_local']"), function(index, value) {
            var tableid = $(value).attr("compid");
            var toobarhtml = $(value).attr("toobarhtml");
            children.put(tableid, $(value).children());
            var table = '<table id="'+tableid+'"></table>';
            $(value).empty();
            if(toobarhtml != undefined && toobarhtml.length > 0) {
                $(value).append(decodeURI(toobarhtml),"","");
            }
            $(value).append(table);
        });
    }
    this.sourceCodeOperatorAfter = function(container) {
        $.each(container.find("div[type='table_base'],div[type='table_base_local']"), function(index, value) {
            var id = $(value).attr("compid");
            $(value).empty();
            $(value).append(children.get(id));
            children.remove(id);
        });
    }
}


/**
 * 上传组件在生成源码前清理无用代码和生成源码后的恢复所见即所得代码。
 * @constructor
 */
function FileUploadComponent(){
    var children = new Map();
    this.sourceCodeOperatorBefore = function(container) {
        $.each(container.find("div[type=input_fileinput]"), function(index, value) {
            var fileid = $(value).attr("compid");
            var url=$(value).attr("fileuploadurl");
            var ext=$(value).attr("allowedFileExtensions");
            var field=$(value).attr("field");

            if(url==undefined)
                url="";
            if(ext==undefined)
                ext="";			
			if(field == undefined)
				field=$(value).attr("compname");

            children.put(fileid, $(value).children());
            var file="<input id=\""+fileid+"\" fileuploadurl=\""+url
                +"\" allowedFileExtensions=\""
                +ext+"\" type=\"file\" name=\"file\" class=\"file\" data-show-preview=\"false\" />"
                +"<input id=\""+fileid+"_serverPath\" type=\"text\" style=\"display:none\" ms-duplex-string=\""+field+"\"/>";
            $(value).empty();
            $(value).append(file);
        });
    }
    this.sourceCodeOperatorAfter = function(container) {
        $.each(container.find("div[type=input_fileinput]"), function(index, value) {
            var id = $(value).attr("compid");
            $(value).empty();
            $(value).append(children.get(id));
            children.remove(id);
        });
    }
}

/**
 * 树组件在生成源码前清理无用代码和生成源码后的恢复所见即所得代码。
 * @constructor
 */
function TreeComponent() {
    var children = new Map();
    this.sourceCodeOperatorBefore = function(container) {
        $.each(container.find("div[type='tree']"), function(index, value) {
            var id = $(value).attr("compid");
            var name = $(value).attr("compname");
            children.put(id, $(value).children());
            var tree = '<ul class="ztree" id="'+id+'" name="'+name+'"></ul>';
            $(value).empty();
            $(value).append(tree);
        });
    }

    this.sourceCodeOperatorAfter = function(container) {
        $.each(container.find("div[type='tree']"), function(index, value) {
            var id = $(value).attr("compid");
            $(value).empty();
            $(value).append(children.get(id));
            children.remove(id);
        });
    }

}

function MultipleSelectComponent() {
    this.sourceCodeOperatorBefore = function(container) {
        $.each(container.find("select[multiple]"), function(index, value) {
            $(this).select2("destroy").attr("multiple","multiple");
        });
    }

    this.sourceCodeOperatorAfter = function(container) {
        $.each(container.find("select[multiple]"), function(index, value) {
            $(this).select2();
        });
    }

}

function TabComponent(){
    this.sourceCodeOperator = function(container) {
        $.each(container.find("div[type='tab']"), function(index, item) {
            var nav_tabs =  $(item).find("ul.nav")[0];
            var tab_content =  $(item).find("div.tab-content")[0];

            $.each($(nav_tabs).find("li>a"),function(i,m){
                var $a = $(m);
                var targetId = $a.attr("href");
                //role="tabpanel" class="tab-pane active"
                var target = container.find(targetId);
                if(!$.isEmptyObject(target)){
                    //默认选中第一个tab
                    if(i==0){
                        $(m).parent().addClass("active");
                        target.addClass("active");
                    }
                    else {
                        $(m).parent().removeClass("active");
                        target.removeClass("active");
                    }
                    $(tab_content).append(target.attr("role","tabpanel").addClass("tab-pane").prop("outerHTML"));
                    target.remove();
                }
            })
        });

        return container.prop("outerHTML");
    }
}
function CollapseComponent(){

    this.sourceCodeOperator = function(container) {
        $.each(container.find("div[type='collapse']"), function(index, item) {
            var panels =  $(item).find("div.panel");

            $.each(panels,function(i,m){
                var $panel = $(m);
                var $panel_heading = $panel.find("div.panel-heading");
                var targetId = $panel_heading.find("h4>a").attr("href");
                var target = container.find(targetId);
                if(!$.isEmptyObject(target)){
                    //默认选中第一个tab
                    if(i==0){
                        target.addClass("in");
                    }
                    $panel.append(target.attr("role","tabpanel").addClass("panel-collapse collapse").prop("outerHTML"))
                    target.remove();
                }
            })
        });

        return container.prop("outerHTML");
    }
}

/**
 * 图形组件在生成源码前清理无用代码和生成源码后的恢复所见即所得代码。
 * @constructor
 */
function ChartsComponent(){
    var children = new Map();
    this.sourceCodeOperatorBefore = function(container) {
        $.each(container.find("div[type='imgBar'],div[type='imgPie'],div[type='imgLine'],div[type='imgConnect'],div[type='imgMap']"), function(index, value) {
            var imgId = $(value).attr("compid");
            children.put(imgId, $(value).children());
            var commonAdvance = $(value).attr("chartoption")?JSON.parse(decodeURIComponent($(value).attr("chartoption"))):undefined;
            var img = '';
            if(commonAdvance && commonAdvance.imgCount){
             //   imgConnect 的属性 attr: commonadvance
                var imgCount = commonAdvance.imgCount;
                var imgPerLine = commonAdvance.imgPerLine;
                var ratio = 12/imgPerLine;
                var tempCount = 0;
                img = '<div id="'+imgId+'">';
                for(var j=0;j<Math.ceil(imgCount/imgPerLine);j++){
                    for(var i=0;i<imgPerLine;i++){
                        tempCount += 1;
                        if(tempCount <= imgCount){
                            img += "<div class='col-md-"+ratio+
                                " col-xs-"+ratio+
                                " col-sm-"+ratio+
                                " col-lg-"+ratio+" column ui-sortable showImg'  style='height: 400px;'></div>";
                        }
                    }
                }
                img +="</div>";
            }else{
                img = '<div class="showImg" style="height: 400px" id="'+imgId+'"></div>';
            }
            $(value).empty();
            $(value).append(img);
        });
    }
    this.sourceCodeOperatorAfter = function(container) {
        $.each(container.find("div[type='imgBar'],div[type='imgPie'],div[type='imgLine'],div[type='imgConnect'],div[type='imgMap']"), function(index, value) {
            var id = $(value).attr("compid");
            $(value).empty();
            $(value).append(children.get(id));
            children.remove(id);
        });
    }
}

/**
 * 区域选择组件
 * @constructor
 */
function ChineseRegionComponent() {
    var children = new Map();
    this.sourceCodeOperatorBefore = function(container) {
        $.each(container.find("div[type='chinese-region']"), function(index, value) {
            var id = $(value).attr("compid");
            var name = $(value).attr("compname");
            children.put(id, $(value).children().clone());

            $(value).find(".tab-pane").html("");
        });
    }

    this.sourceCodeOperatorAfter = function(container) {
        $.each(container.find("div[type='chinese-region']"), function(index, value) {
            var id = $(value).attr("compid");
            $(value).empty().append(children.get(id));
            children.remove(id);
        });
    }

}
/**
 * 图片上传组件
 * @constructor
 */
function ImageComponent() {
    this.sourceCodeOperator = function(container) {
        $.each(container.find('div[type="image"]'), function(index, item) {
           var $this = $(this),
               _$this = $this.clone(),
               imgId = $this.attr("compid"),
               zoomIn = $this.attr("zoomin");

            if(zoomIn=="true"){
                var $img = _$this.find("img").attr("id",imgId),
                    src = $img.attr("src"),
                    $a = $('<a class="fancybox" href='+src+' title="">');
                $this.empty();
                $this.append($a.append($img));
            }

        });

        return container.prop("outerHTML");
        //return container;
    }

}