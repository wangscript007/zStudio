/**
 * Created by Administrator on 2016/2/2.
 */
;(function($) {
    $.fn.bootstrapValidator.validators.id = $.extend($.fn.bootstrapValidator.validators.id || {}, {
        _cn: function(value) {
            value = value.trim();
            if (!/^\d{15}$/.test(value) && !/^\d{17}[\dXx]{1}$/.test(value)) {
                return false;
            }

            /**
             * 一代身份证,二代身份证
             * @param g
             * @returns {boolean}
             */
            function validateFirIdCard(idCard){
                var f = 0;
                var result;
                var provinceCode={
                    11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙",
                    21:"辽宁",22:"吉林",23:"黑龙",
                    31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
                    41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",
                    50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
                    61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",
                    71:"台湾",
                    81:"香港",82:"澳门",91:"国外"
                };
                if(idCard.length==15){
                    result = idCardUpdate(idCard);
                }else{
                    result = idCard;
                }

                if(!/^\d{17}(\d|x)$/i.test(result)){
                    return false
                }
                result = result.replace(/x$/i,"a");

                if(provinceCode[parseInt(result.substr(0,2))]==null){
                    return false
                }
                var dateStr = result.substr(6,4)+"-"+Number(result.substr(10,2))+"-"+Number(result.substr(12,2));
                var date = new Date(dateStr.replace(/-/g,"/"));

                if(dateStr!=(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())){
                    return false
                }
                for(var b = 17;b >= 0;b--){
                    f += (Math.pow(2,b)%11)*parseInt(result.charAt(17-b),11)
                }
                if(f%11!=1){
                    return false;
                }
                return true;
            }

            /**
             * 二代身份证
             * @param idCard
             * @returns {boolean}
             */
            function validateSecIdCard(idCard){
                var f=0;
                var result = idCard;
                var provinceCode={
                    11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙",
                    21:"辽宁",22:"吉林",23:"黑龙",
                    31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
                    41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",
                    50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
                    61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",
                    71:"台湾",
                    81:"香港",82:"澳门",
                    91:"国外"
                };
                if(!/^\d{17}(\d|x)$/i.test(result)){
                    return false
                }
                result = result.replace(/x$/i,"a");
                if(provinceCode[parseInt(result.substr(0,2))]==null){
                    return false
                }
                var dateStr = result.substr(6,4)+"-"+Number(result.substr(10,2))+"-"+Number(result.substr(12,2));
                var date = new Date(dateStr.replace(/-/g,"/"));
                if(dateStr!=(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())){
                    return false
                }
                for(var b=17;b>=0;b--){
                    f += (Math.pow(2,b)%11) * parseInt(result.charAt(17-b),11)
                }
                if(f%11!=1){
                    return false
                }
                return true
            }

            function idCardUpdate(idCard){
                var result;
                var fir_regex=/^(\d){15}$/;
                if(fir_regex.test(idCard)){
                    var e=0;
                    //加权因子
                    var weight = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
                    //校验码
                    var checkCode = new Array("1","0","X","9","8","7","6","5","4","3","2");

                    idCard = idCard.substr(0,6)+"19"+idCard.substr(6,idCard.length-6);

                    for(var c=0;c<idCard.length;c++){
                        e += parseInt(idCard.substr(c,1)) * weight[c]
                    }

                    idCard += checkCode[e%11];
                    result = idCard;
                }else{
                    result="#";
                }
                return result;
            }


            if(!validateFirIdCard(value)){
                return false;
            }

            return true;
        }
    });
}(window.jQuery))