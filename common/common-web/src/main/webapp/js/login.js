/**
 * 解决session失效后，iframe中出现子页面的情况
 */
function ready() {
    if (top.location != self.location) {
        top.location = self.location;
    }
}

window.onload = ready;


;
(function ($, global) {
    function initLoading() {
        var modalDialog = '<div id="loading" class="modal fade" >';
        modalDialog += '<div class="modal-dialog" style="margin-top:' + $(window).height() / 3 + 'px;width:50%;">';
        modalDialog += '<div class="modal-content">';
        modalDialog += '<div class="modal-body">';
        modalDialog += '<div class="text-center"><i class="fa fa-spin fa-spinner" ></i> 后台正在初始化项目信息，请稍等...</div>';
        modalDialog += '</div>';
        modalDialog += '</div>';
        modalDialog += '</div>';
        modalDialog += '</div>';

        $("body").append(modalDialog);
    }

    function showLoading() {
        $('#loading').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        })
    }

    function hideLoading() {
        $("#loading").modal("hide");
    }

    var App = global.App,
        pageType = App.getUrlParam('page', location.search),
		reigsterSuccessFlag = false;

    function checkUserName(value) {
        var url = 'mao/uap/register/check/' + value,
            status = 1;
        $.ajax({
            type: "GET",
            url: url,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            async: false,
            success: function (data, textStatus) {
                status = data.status;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
        return status === 1;
    }

    var registerInit = function () {
        var registerForm = 'registerForm';
        $('#' + registerForm).bootstrapValidator({
            fields: {
                userName1: {
                    validators: {
                        notEmpty: {
                            message: "项目名称不能为空"
                        },
                        stringLength: {
                            min: 2,
                            max: 20,
                            message: "项目名称长度: 2-20"
                        },
                        regexp: {
                            regexp: /^[^_][A-Za-z]*[a-z0-9_]*[_\u4e00-\u9fa5]*$/,
                            message: '2-20个字符，建议使用英文字母、数字和符号.-_。为了避免被垃圾邮件抓取，请勿使用邮件地址作为用户名'
                        },
                        callback: {
                            message: '项目名称已存在',
                            callback: function (value, validator) {
                                if (value && value.trim().length >= 2) {
                                    return checkUserName(value);
                                }
                                return true;
                            }
                        }
                    }
                },
                password1: {
                    validators: {
                        notEmpty: {
                            message: "密码不能为空"
                        }
                    }
                },
                confirmPassword1: {
                    validators: {
                        notEmpty: {
                            message: "密码不能为空"
                        },
                        identical: {
                            field: "password1",
                            message: "两次密码不一致"
                        }
                    }
                }
            }
        });
		
        $('.register').off('click').on('click', function (e) {
            e.preventDefault();
            App.validate(registerForm);
            if (App.isValid(registerForm)) {
                if ($("#password1").val() !== $('#confirmPassword1').val()) {
                    bootbox.alert('两次输入的密码不一样. ');
                    return;
                }
                var params = {};
                params.username = $('#userName1').val();
                params.password = global.ict_framework_func1($('#confirmPassword1').val());
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: true,
                    url: "mao/uap/register",
                    data: JSON.stringify(params),
                    beforeSend: function () {
                        initLoading();
                        showLoading();
                    },
                    complete: function () {
                        hideLoading();
                    },
                    success: function (data) {
                        if (data.status == 0) {
                            bootbox.alert("注册失败, " + data.message);
                        } else {
                            reigsterSuccessFlag = true;
                            bootbox.setDefaults("locale", "zh_CN");
                            bootbox.alert('注册成功，\n请用"admin"用户,选择"' + params.username + '"项目登录系统。', function () {
                                window.location.href = "user-page.html";
                            });
                        }
                    }
                });
            }
            else {
                $('.login .chi').css('padding-top', '30px');
            }
        });
    }

    function keyEvent() {
        $(document).keydown(function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                if (pageType === 'reg') {
                    if(reigsterSuccessFlag){
                        window.location.href = "user-page.html";
                    }
                    $(".register").trigger("click");
                }
                else {
                    $("button.submit").trigger("click");
                }
            }
        });
    }

    function getUrlParam(name, search) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = search.match(reg);
        if (search.indexOf("?") > -1) {
            r = search.substring(1).match(reg);
        }
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    function loginInit() {
        var loginForm = "loginForm";
        $('#' + loginForm).bootstrapValidator({
            fields: {
                userName: {
                    validators: {
                        notEmpty: {
                            message: "用户名不能为空"
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: "密码不能为空"
                        }
                    }
                }
            }
        });

        $("button.submit").click(function (e) {
            //e.preventDefault();
            App.validate(loginForm);
            if (App.isValid(loginForm)) {
                var projectSelectVal = $('#projectSelect').val(),
					userName = $("#userName").val() + "@" + projectSelectVal,
                    passWord = global.ict_framework_func1($("#password").val());
				if(projectSelectVal == "请选择项目名称"){
					$("#error_prompt").html(projectSelectVal);
					return;
				}
                $.ajax({
                    type: "POST",
                    url: "mao/uap/login",
                    data: JSON.stringify(
                        {
                            name: userName,
                            password: passWord
                        }
                    ),
                    dataType: "json",
                    contentType: 'application/json; charset=UTF-8',
                    async: false,
                    success: function (result, textStatus) {
                        if (result.status === 1) {
                            var locateUrl = getUrlParam("location", global.location.search);
                            if (!locateUrl) {
                                locateUrl = 'index.html';
                            }
                            global.location.href = locateUrl;
                        } else {
                            $("#error_prompt").html(result.message);
							
                        }
                    },
                    error: function (result, textStatus) {
                        bootbox.alert("网络异常")
                    }
                });
            }
            App.resetValid(loginForm);
            e.stopPropagation();
        });
    }
	

    function pageInit() {
        if (pageType === 'reg') {
            $("#registerForm").css('display', '');
            $("#loginForm").css('display', 'none');
            $('#tip').empty().append('<a href="user-page.html?page=log" style="color:white;">已有账号登录</a>');
            if ($base_url == "workbench") {
                $("title").html("项目注册-快手云 设计平台");
            } else if ($base_url == "server") {
                $("title").html("项目注册-快手云 在线运行平台");
            }

        }
        else if (pageType === 'log') {
            $("#registerForm").css('display', 'none');
            $("#loginForm").css('display', '');
            $('#tip').empty().append('<a href="user-page.html?page=reg" style="color:white;">项目注册</a>');
            if ($base_url == "workbench") {
                $("title").html("项目登录-快手云 设计平台");
            } else if ($base_url == "server") {
                $("title").html("项目登录-快手云 在线运行平台");
            }
        }
        else {
            global.location.href = 'user-page.html?page=log';
        }
    }
	
	function inputInit(){
		$("#userName,#password").focus(function(){
			$("#error_prompt").html("");
		});
		$("#projectSelect").change(function(){
			$("#error_prompt").html("");
			$("button.submit").prop("disabled",false);
		});
	
	}

    $(function () {
        if (global.location.pathname.indexOf('user-page.html') > -1) {
                pageInit();
                registerInit();
            }
            keyEvent();
            loginInit();
			inputInit();
    });

})(jQuery, window);



