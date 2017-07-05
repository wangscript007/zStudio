/**
 * Created by 10177027 on 2016/3/18.
 */
var layout={};
    layout.marginLeft=191;//body 初使右边距
    layout.marginRight=300;//body 初始右边距
    layout.eastWidth=300;//右侧布局器默认宽度
    layout.westWidth=180;//左侧布局器宽度
    layout.eastSplitLeft=0;
    layout.isResize=false;

//显示左侧布局面板
function showWestLayout()  {
    $("body").removeClass("devpreview sourcepreview");
    $("body").css("margin-left",layout.marginLeft);
    $(".form-layout-west").show();
    $(".form-layout-expand-west").css("left",layout.marginLeft-10);
}
//隐藏左侧布局面板
function hideWestLayout()
{
    $(".form-layout-expand-west").css("left",0);
    $("body").css("margin-left",10);
    $(".form-layout-west").hide();
}
////隐藏右侧布局面板
//function hideEastLayout()
//{
//    var eastLayout=$(".form-layout-east");
//    $("body").css("margin-right",10);
//    eastLayout.hide();
//    var left=$(window).width()-10;
//    $(".form-layout-expand-east").css("left",left);
//}
////显示右侧布局面板
//function showEastLayout()
//{
//    var eastLayout=$(".form-layout-east");
//    $("body").removeClass("devpreview sourcepreview");
//    $("body").css("margin-right",layout.marginRight);
//    eastLayout.show();
//    var left=parseInt(eastLayout.css("left"))-10;
//    $(".form-layout-expand-east").css("left",left);
//}
//accordion 展开与收缩
//function showAccortion(parentPanel){
//    var icon = parentPanel.parent().find("a.form-accordion-collapse");
//    if(parentPanel.is(":hidden")){
//        parentPanel.show();
//        $(icon).removeClass("form-accordion-expand");
//    }
//    else{
//        parentPanel.hide();
//        $(icon).addClass("form-accordion-expand");
//    }
//}

function removeMenuClasses() {
    $("#menu-layoutit li button").removeClass("active")
}


$(window).resize(function() {
    //$("body").css("min-height", $(window).height() - 90);
    //$(".demo").css("min-height", $(window).height() - 180);
    //if(!layout.isResize) {
    //    var layoutEast=$(".form-layout-east");
    //    layoutEast.css("left",$("body").outerWidth()+$(".form-layout-west").outerWidth()+20);
    //    layout.eastSplitLeft=$("body").outerWidth()+$(".form-layout-west").outerWidth()+10;
    //    $(".form-layout-expand-east").css("left",layout.eastSplitLeft);
    //}
});



$(document).ready(function() {
    ////显示组件面板
    $(".form-layout-expand-west").click(function () {
        var westLayout = $(".form-layout-west");
        if (westLayout.is(":hidden")) {
            showWestLayout();
        }
        else {
            hideWestLayout();
        }
    });

    //隐藏//显示配置面板
    //$(".form-layout-expand-east").click(function () {
    //    var eastLayout = $(".form-layout-east");
    //    if (eastLayout.is(":hidden")) {
    //        showEastLayout();
    //    }
    //    else {
    //        hideEastLayout();
    //    }
    //});



    //左侧菜单栏布局拖动效果
    $(".form-layout-west").resizable({
        handles: "e",
        animateDuration: "fast",
        maxWidth: 340,
        minWidth: 180
        //ghost:true
    }).resize(function (event, ui) {
        layout.marginLeft = layout.marginLeft + (ui.size.width - layout.westWidth);
        $("body").css("margin-left", layout.marginLeft);
        layout.westWidth = ui.size.width;
        $(".form-layout-expand-west").css("left", layout.marginLeft-10);
    });

    //var layoutEast = $(".form-layout-east");
    //var width = $("body").outerWidth() + $(".form-layout-west").outerWidth();
    //layoutEast.css("left", width + 22);
    //layout.eastSplitLeft = width + 12;
    //$(".form-layout-expand-east").css("left", layout.eastSplitLeft);
    //
    ////右侧配置面板拖动效果
    //$(layoutEast).resizable(
    //    {
    //        handles: "w",
    //        maxWidth: 450,
    //        minWidth: 200,
    //        start: function (event, ui) {
    //            layout.isResize = true;
    //        },
    //        stop: function (event, ui) {
    //            layout.isResize = false;
    //        }
    //        //ghost:true
    //    }).resize(function (event, ui) {
    //        //layout.marginRight = layout.marginRight + (ui.size.width - layout.eastWidth) + 15;
    //        $("body").css("margin-right", ui.size.width-20);
    //        //layout.eastSplitLeft = layout.eastSplitLeft + (layout.eastWidth - ui.size.width - 20);
    //        $(".form-layout-east").css("left", $("body").outerWidth()+$('.form-layout-west').outerWidth() + 20);
    //        //layout.eastWidth = ui.size.width;
    //    });

    //子面板展开与隐藏
    //$(".form-accordion-collapse").click(function () {
    //    var panel = $(this).parent().parent().parent().find(".form-panel-body");
    //    showAccortion(panel);
    //});
    //
    //$(".form-panel-title.form-panel-with-icon").click(function () {
    //    var panel = $(this).parent().parent().find(".form-panel-body");
    //    showAccortion(panel);
    //});

});
