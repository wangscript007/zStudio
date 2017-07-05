var PackageProcessLogic = function(){};

PackageProcessLogic.prototype = {
    pathArray:[],
    exportClick:function(param){
        var paramArr = $(param).attr('param').split("||");
        var packageId = paramArr[0];
        var packageName = paramArr[1];
        var that = this;
        var exportResult = true;
        var message = "";
        var url = "/workbench/export/package/"+packageId;
        $.ajax({
            type: 'GET',
            dataType: 'json',
            async: false,
            url: url,
            contentType: 'application/json; charset=UTF-8',
            success: function (data) {
                if(data.status != 1){
                    exportResult = false;
                    message = data.message;
                }else{
                    var path = encodeURIComponent(packageName+".zip");
                    that.pathArray.push(path);
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                errorCallback(textStatus, errorThrown, v);
            }
        });
        this._download();
        if(exportResult && this.downResult){
            tipBox.showMessage('导出业务应用包成功。','info');
        }else{
            var messageArray = message.split("##");
            tipBox.showMessage(messageArray[0]+"导出业务应用包失败。",'error');
            console.log(messageArray[1]);
        }
    },
    mockClick: function(param){
        //从设计平台 导出
        var paramArr = $(param).attr('param').split("||");
        var packageId = paramArr[0];
        var packageName = paramArr[1];
        if(paramArr[2] + paramArr[3] + paramArr[4] < 1){
            tipBox.showMessage('没有设计页面，请先设计页面再进行在线测试。','error');
            return;
        }
	    var exportUrl = '/workbench/transfer/package?packageId='+packageId +'&packageName='+ packageName;
        $.ajax({
            type: 'GET',
            dataType: 'json',
            async: false,
            url: exportUrl,
            contentType: 'application/json; charset=UTF-8',
            success: function (data) {
                if(data.status == 1){
                    openOnlineTestPlatform(packageName);
                }else{
                    console.log("online test error：" + data.message);
                    tipBox.showMessage("在线测试错误，原因：" + data.message, 'error');
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                errorCallback(textStatus, errorThrown, v);
            }
        });
    },
    removePackage: function(){
        //删除业务包
        bootbox.confirm(('确定要删除吗?'),function(result){
            if(result){
                $.ajax({
                    type: 'DELETE',
                    dataType: 'json',
                    async: false,
                    url: urlAndHttpMethod.url,
                    contentType: 'application/json; charset=UTF-8',
                    success: function (data) {
                        cardTypeUl.initUl();
                        tipBox.showMessage('删除成功。','info');
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                        errorCallback(textStatus, errorThrown, v);
                    }
                });
            }
        })
    },
    _download: function(){
        var that=this;
        if(this.pathArray && this.pathArray.length > 0 && this.pathArray !== "undefined")
        {
            //判断url是否有效
            var url = "/workbench/ZipFile/"+maoEnvBase.getCurrentTenantId()+"/" +decodeURIComponent(this.pathArray.pop());
            $.ajax({
                type: "GET",
                cache: false,
                async: false,
                url: url,
                data: "",
                success: function() {
                    $("body").append("<iframe src='"+url+"' style='display:none'></iframe>");
                    //setTimeout(that.download, 1);
                    that.downResult = true;
                },
                error: function() {
                    that.downResult = false;
                }
            });

        }
    }
};

var packageProcessLogic = new PackageProcessLogic();
