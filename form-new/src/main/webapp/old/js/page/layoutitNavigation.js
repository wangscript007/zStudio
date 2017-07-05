/**
 * Created by 10177027 on 2015/11/17.
 */
function  LayoutitNavigation(){
    this.id;
    this.currentObject;
}

LayoutitNavigation.STATUS ={
    RED: "red",
    BLUE: "blue",
    GRAY: "gray",
    GREEN: "green"
};

LayoutitNavigation.STATUS_STYLE ={
    RED: "btn btn-danger",
    BLUE: "btn btn-primary",
    GRAY: "btn btn-default active",
    GREEN: "btn btn-success"
};

LayoutitNavigation.data= [
    {targetId:"step1",name:"step1",status:"red"},
    {targetId:"step2",name:"step2",status:"red"},
    {targetId:"step3",name:"step3",status:"red"}
]
LayoutitNavigation.prototype = {
    init:function(object,data) {
        if (!object) {
            console.log("init error:object is not exist!");
            return;
        }

        this.currentObject = object;
        if (data) {
            LayoutitNavigation.data = data;
            object.html(this._getHtml(data));
        } else {
            object.html(this._getHtml(LayoutitNavigation.data));
        }

        this._bindWaypoint();
    },
    /**
     * 设计状态下只显示导航树，不绑定waypoint事件
     * @param object
     * @param data
     */
    initNavigationBar:function(object,data) {
        if (!object) {
            console.log("init error:object is not exist!");
            return;
        }

        if (data) {
            object.html(this._getHtml(data));
        } else {
            object.html(this._getHtml(LayoutitNavigation.data));
        }
    },

    _getHtml:function(data) {
        if (!data) {
            return;
        }

        var html = [];
        html.push("<div class='layout-navigation'><ul>");
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            html.push("<li><div class='tab'>");
            var text = item.name;
            if(text.length > 4){
                text = text.substr(0,4)+"..";
            }
            html.push("<button style='width:80px' title=\""+item.name+"\" type=\"button\" targetid=\""+item.targetId+"\" class=\"" + this._getBackgroundImageStyle(item.status) + "\">" + text + "</button>");
            html.push("</div></li>");
        }
        html.push("</ul></div>")
        return html.join(" ");
    },
    _getBackgroundImageStyle:function(status) {
        if (!status) {
            return LayoutitNavigation.STATUS_STYLE.RED;
        }

        var style = LayoutitNavigation.STATUS_STYLE[status.toLocaleUpperCase()];
        if(!style){
            style = LayoutitNavigation.STATUS_STYLE.RED;
        }

        return style;
    },
    _bindWaypoint:function(){
        var that = this;
        var navigationBtn = this.currentObject.find("[type=button]");
        var total = navigationBtn.length;
        $.each(navigationBtn,function(index,item) {
            /**
             * 设置导航区域按钮之间的高度
             */
            if (index < total - 1) {
                $(item).parent().height(80);
            }

            var targetId = $(item).attr("targetid");
            if (!targetId) {
                return;
            }

            var targetObject = $("#" + targetId);
            if (!targetObject || targetObject.size() === 0) {
                return;
            }

            $(item).unbind("click").bind("click", function () {
                //$(".navigation_select").removeClass("navigation_select");
                //$(targetObject).addClass("navigation_select");
                var _targetTop = $(targetObject).offset().top;//获取位置
                $("html,body").animate({scrollTop: _targetTop}, 300);//跳转
            });

            $(targetObject).waypoint(function (direction) {
                if (direction == "up") {
                    that._updateNodeStatus(targetId, that.getNodeStatus(targetId), true);
                } else {
                    that.setNodeStatusToGray(targetId);
                }
            }, {
                offset: -1
            });
        })
    },
    _updateDataStatus:function(targetId,status){
        if(!LayoutitNavigation.data){
            return;
        }
        $.each(LayoutitNavigation.data,function(index,item) {
            if (item.targetId !== targetId) {
                return;
            }

            item.status = status;
            return false;
        })
    },
    /**
     * 组件隐藏时设置导航按钮为灰色，此时不更新节点数据状态。
     * @param targetId
     * @param status
     */
    setNodeStatusToGray:function(targetId) {
        this._updateNodeStatus(targetId,LayoutitNavigation.STATUS.GRAY,false);
    },
    /**
     * 保存成功后设置节点状态为绿色
     * @param targetId
     * @param status
     */
    setNodeStatusToGreen:function(targetId) {
         this._updateNodeStatus(targetId,LayoutitNavigation.STATUS.GREEN,true);
    },
    /**
     * 编辑区域内容变化后，更新节点按钮状态为蓝色
     * @param targetId
     * @param status
     */
    setNodeStatusToBlue:function(targetId) {
        this._updateNodeStatus(targetId,LayoutitNavigation.STATUS.BLUE,true);
    },
    _updateNodeStatus:function(targetId,status,updateDataStatus) {
        var targetObj = $(".layout-navigation [targetid =" + targetId + "]");
        if (targetObj.size() > 0) {
            if(updateDataStatus){
                this._updateDataStatus(targetId, status);
            }

            var style = this._getBackgroundImageStyle(status);
            if (style) {
                $(targetObj).attr("class", style);
            }
        }
    },
    getNodeStatus:function(targetId){
        var status = "";
        if(!LayoutitNavigation.data){
            return status;
        }

        $.each(LayoutitNavigation.data,function(index,item) {
            if (item.targetId !== targetId) {
                return;
            }

            status = item.status;
            return false;
        })

        return status;
    },
    /**
     * 绑定目标区域内容改变事件
     */
    initChangeEvent:function() {
        var that = this;
        var navigationBtn = this.currentObject.find("[type=button]");
        $.each(navigationBtn, function (index, item) {
            var contentId = $(item).attr("targetid");
            $("#" + contentId).on("change", "select,input", function () {
                that.setNodeStatusToBlue(contentId);
            })
        });
    }
}


