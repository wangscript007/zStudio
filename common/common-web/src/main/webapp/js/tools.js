/**
 * Created by Administrator on 2015/12/3.
 */

;(function($,exports){

    var Constant = {
            TOKEN : "mao_user_token"
        },
        App = {
            setToken : function(token){
                $.cookie(Constant.TOKEN,token,{
                    path:"/"
                });
            },
            getToken : function(){
                return $.cookie(Constant.TOKEN);
            },

            initValidate : function(form,options,success){
                $('#'+form).bootstrapValidator(options).on("success.form.bv",success);
            },

            validate : function(form){
                //$("#"+form).data('bootstrapValidator').validate();
                $("#"+form).bootstrapValidator("validate");
            },

            isValid : function(form){
                return $("#"+form).data('bootstrapValidator').isValid();
            },
            resetValid : function(form){
                $('#'+form).data('bootstrapValidator').resetForm();
            },
            getAlert : function(){
                return $(".alert");
            },
            getUrlParam: function(name, search) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = search.match(reg);
                if(search.indexOf("?") > -1) {
                    r = search.substring(1).match(reg);
                }
                if (r != null) {
                    return unescape(r[2]);
                }
                return null; //返回参数值
            }
        };


    exports.App = App;
})(jQuery,window)

