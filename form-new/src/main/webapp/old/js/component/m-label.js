;
(function ($, win) {
    win.labelFontWeight = function (e,component){
        if(e.type==="change"){
            var compid = $(component).attr("compid");
            var value = $(e.target).val();
            var obj = document.getElementById(compid);
            if(value == 'true'){
                $(obj).css("font-weight","bold");
            }else{
                $(obj).css("font-weight","normal");
            }

        }
        $(component).attr("labelfontweight",value);
    }
    win.labelFontSize = function(e,component){
        if(e.type==="change"){
            var compid = $(component).attr("compid");
            var value = $(e.target).val();
            $("#" + compid).css("font-size",parseFloat(value , 10));
        }
        $(component).attr("lablefontsize",value);
    }
})(jQuery, window);