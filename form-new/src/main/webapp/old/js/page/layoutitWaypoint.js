/**
 * Created by 10177027 on 2015/11/17.
 */
function  LayoutitWaypoint(){
    this.id;
    this.currentObject;
}
LayoutitWaypoint.status = {initStatus:0,saveStatus:1};
LayoutitWaypoint.data= [
    {targetId:"step1",name:"step1",icon:"",status:0,initStatusIcon:"img/waypoint/process.png",saveStatusIcon:"img/waypoint/process-grey.png"},
    {targetId:"step2",name:"step2",icon:"",status:0,initStatusIcon:"img/waypoint/user-grey.png",saveStatusIcon:"img/waypoint/user.png"},
    {targetId:"step3",name:"step3",icon:"",status:0,initStatusIcon:"img/waypoint/user-grey.png",saveStatusIcon:"img/waypoint/user.png"}
]
LayoutitWaypoint.prototype = {
    init:function(object,data) {
        if (!object) {
            console.log("init error:object is not exist!");
            return;
        }

        this.currentObject = object;
        if (data) {
            LayoutitWaypoint.data = data;
            object.html(this._getHtml(data));
        } else {
            object.html(this._getHtml(LayoutitWaypoint.data));
        }

        this._bindWaypoint();
    },
    /**
     * 设计状态下只显示导航树，不绑定waypoint事件
     * @param object
     * @param data
     */
    initWaypointBar:function(object,data) {
        if (!object) {
            console.log("init error:object is not exist!");
            return;
        }

        if (data) {
            object.html(this._getHtml(data));
        } else {
            object.html(this._getHtml(LayoutitWaypoint.data));
        }
    },

    _getHtml:function(data) {
        if(!data){
            return;
        }

        var html = [];
        html.push("<div class='layout-waypoint'><ul>");
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            html.push("<li>");
            html.push("<div class='circle' style='"+this._getBackgroundImageStyle(item)+"'></div>");
            html.push("<div class='title'  targetid='" + item.targetId + "'>" + item.name + "</div>");
            html.push("</li>");
        }

        html.push("</ul></div>")
        return html.join(" ");
    },
    _getBackgroundImageStyle:function(dataItem){
        if(!dataItem){
            return "";
        }

        var iconPath = "";
        if (dataItem.initStatusIcon && dataItem.status === LayoutitWaypoint.status.initStatus) {
            iconPath = dataItem.initStatusIcon;
        } else if (dataItem.saveStatusIcon && dataItem.status === LayoutitWaypoint.status.saveStatus) {
            iconPath = dataItem.saveStatusIcon;
        } else if (dataItem.icon) {
            iconPath = dataItem.icon;
        }
        if(iconPath && iconPath.length >0){
            return "background-image:url("+iconPath+");background-position:center;background-repeat:no-repeat;";
        }

        return "";
    },
    _bindWaypoint:function(){
        $.each(this.currentObject.find(".title"),function(index,item) {
            var targetId = $(item).attr("targetid");
            if (!targetId) {
                return;
            }

            var targetObject = $("#" + targetId);
            if (!targetObject || targetObject.size() === 0) {
                return;
            }

            $(item).height($(targetObject).height());
            $(targetObject).waypoint(function (direction) {
                if (direction == "up") {
                    $(item).height($(targetObject).height());
                } else {
                    $(item).height(32);
                }

                $($(item).prev()).unbind("click").bind("click", function () {
                    var _targetTop = $(targetObject).offset().top;//获取位置
                    $("html,body").animate({scrollTop: _targetTop}, 300);//跳转
                });
            }, {
                offset: index*32
            });
        })
    },
    _getNodeIconStyle:function(targetId,status){
        if(!LayoutitWaypoint.data){
            return;
        }
        var targetItem;
        $.each(LayoutitWaypoint.data,function(index,item) {
            if (item.targetId !== targetId) {
                return;
            }
            targetItem = item;
            return false;
        })

        return this._getBackgroundImageStyle(targetItem);
    },
    _updateDataStatus:function(targetId,status){
        if(!LayoutitWaypoint.data){
            return;
        }
        $.each(LayoutitWaypoint.data,function(index,item) {
            if (item.targetId !== targetId) {
                return;
            }

            item.status = status;
            return false;
        })
    },
    updateNodeStatus:function(targetId,status) {
        var targetTitleObj = $(".layout-waypoint [targetid =" + targetId + "]");
        if (targetTitleObj.size() > 0) {
            this._updateDataStatus(targetId, status);
            var targetStatusObj = $(targetTitleObj.prev());
            var style = this._getNodeIconStyle(targetId, status);
            if (style) {
                $(targetStatusObj).attr("style", style);
            }
        }
    }
}


