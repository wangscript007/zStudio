;
(function ($, win) {
    win.setLayoutStyle = function(e,component){
        if(e.type==="change"){
            var compid = $(component).attr("compid");
            var value = $(e.target).val();
            var removeVal = $(component).attr("layoutstyle");
            if(value != ""){
                $('div[compid='+compid+']').parent().parent().addClass(value);
            }
            if(value == "" || value != removeVal){
                $('div[compid='+compid+']').parent().parent().removeClass(removeVal);
            }
        }

        $(component).attr("layoutstyle",value);
    }
})(jQuery, window);