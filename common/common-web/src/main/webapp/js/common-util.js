;(function($, window){
    var CommonUtil = function(){};
    //当字符串含有中文时，根据字节长度截取字符串长度
    CommonUtil.prototype.interceptName = function(name,length){
        var bytesCount = 0,
            index = 0,
            interceptName = "";
        for (var k = 0; k < name.length; k++){
            var c = name.charAt(k);
            if(/^[\u0000-\u00ff]$/.test(c)){
                bytesCount += 1;
            }else{
                bytesCount += 2;
            }
            if(bytesCount >= length){
                index = k;
                break;
            }
        }
        if(bytesCount >= length){
            interceptName = name.substring(0,index) +"...";
        }else{
            interceptName = name;
        }
        return interceptName;
    }
    window.commonUtil = new CommonUtil();
})(jQuery, window);