var queryColumns = '["id", "import_time","import_userName", "process_packageName"]';
var PACKAGE_TABLE_NAME = 'bcp_re_import_process';

/**
 * 判断应用是否已存在应用
 */
function deployApplication() {
    var fileInputVal = $("#file_app_zip").val();
    var appFileName = importAppZipFile();

    if (fileInputVal) {
        var filePath = fileInputVal.split('\\');
        var zipFileName = filePath[filePath.length - 1];

        //判断是否已存在当前同名的应用
        var packageName = {'cname': 'process_packageName', 'compare': '=', 'value': appFileName};
        var userName = {'cname': 'import_userName', 'compare': '=', 'value': maoEnvBase.getCurrentUserName()};
        var packageData = maoOrmBase.query(PACKAGE_TABLE_NAME, queryColumns, generateCondition([packageName, userName], "and"));
        if (packageData.rows.length > 0) {
            bootbox.confirm("系统中存在同名的文件，继续导入会覆盖之前已导入的数据，确定覆盖吗？", function (result) {
                if (result) {
                    deployApplicationPackage(zipFileName, appFileName);
                } else {
                    //删除上传zip应用文件
                    deleteAppZipFile(zipFileName);
                }
            });
        } else {
            deployApplicationPackage(zipFileName, appFileName);
        }
    } else {
        tipBox.showMessage('请选择应用压缩包。','info');
    }
}

/**
 * 上传应用zip文件并返回应用名称
 * @returns {*}
 */
function importAppZipFile() {
    var appFileName = '';
    var formData = new FormData($("#uploadDataApplFile")[0]);
    $.ajax({
        url : "/server/import/application/zip/file",
        type : 'POST',
        async: false,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success : function(data) {
            var jsonData = JSON.parse(data);
            if (jsonData.status == 1) {
                appFileName = jsonData.message;
            } else {
                console.log(jsonData.message);
                tipBox.showMessage('导入应用文件失败。原因：' + jsonData.message, 'error');
            }
        }
    });
    return appFileName;
}

function deleteAppZipFile(zipFileName) {
    $.ajax({
        url : '/server/delete/application/zip/file?zipFileName=' + zipFileName,
        type : 'POST',
        async: false,
        data: '',
        cache: false,
        contentType: false,
        processData: false,
        success : function(data) {
            var jsonData = JSON.parse(data);
            if (jsonData.status == 1) {
                console.log("删除应用zip包成功。");
            } else {
                console.log(jsonData.message);
            }
        }
    });
}

/**
 * 部署应用
 */
function deployApplicationPackage(zipFileName, appFileName) {
    $.ajax({
        url : "/server/import/application/package?zipFileName=" + zipFileName + "&appFileName=" + appFileName,
        type : 'POST',
        async: false,
        data: '',
        cache: false,
        contentType: false,
        processData: false,
        success : function(data) {
            var jsonData = JSON.parse(data);
            if (jsonData.status == 1) {
                //刷新页面，显示提示信息
                init_application_list();
                tipBox.showMessage('导入应用成功。','info');
            } else {
                console.log(jsonData.message);
                tipBox.showMessage('导入应用失败。原因：' + jsonData.message, 'error');
            }
        }
    });
}

function init_application_table_list() {
    var table_base_application = $("#table_base_local1470275538711");
    table_base_application.bootstrapTable("removeAll");

    var data;
    var orders = [];
    var order = {'field':'import_time', 'order':'desc'};
    orders.push(order);

    data = maoOrmBase.query(PACKAGE_TABLE_NAME, queryColumns, {}, true, orders);

    table_base_application.bootstrapTable("appendData", data.rows);
    if(data.rows.length){
        table_base_application.bootstrapTable('check', 0);
    }
}

function init_application_list() {
    var menuDataManage = parent.menuDataManage;
    menuDataManage.initData();
    menuDataManage.initRootMenu();
    parent.$("#BCP_BPM_SETTING").click();
}

function importApplication() {
    var layoutDiv = $("#layout1471941926884");
    var isShow = layoutDiv.attr('value');
    if (isShow == 'true') {
        layoutDiv.show();
        layoutDiv.attr('value', 'false');
    } else {
        layoutDiv.hide();
        layoutDiv.attr('value', 'true');
    }
}

/**
 * 删除应用
 */
function deleteApplication() {
    var rows = getTableSelectData("table_base_local1470275538711");
    if(rows === undefined || rows.length === 0) {
        tipBox.showMessage('请选择应用记录。','info');
        return;
    }

    deleteApplicationPackage(rows);
}

/**
 * 删除应用调用后台逻辑
 * @param rows
 */
function deleteApplicationPackage(rows) {
    var message = '是否删除应用？';
    var appFileName = rows[0]['process_packageName'];
    var appId = rows[0]['id'];

    bootbox.confirm(message, function (result) {
        if(result) {
            $.ajax({
                type:"GET",
                url:'delete/application?appId=' + encodeURIComponent(appId) + '&appFileName=' + encodeURIComponent(appFileName),
                async: false,
                success:function(data){
                    var dataJson = JSON.parse(data);
                    if(dataJson.status == 1) {
                        tipBox.showMessage('删除应用成功。','info');
                        init_application_list();
                    } else {
                        tipBox.showMessage('删除应用失败，原因：' + dataJson.message,'error');
                        console.log(dataJson.message);
                    }
                }
            });
        }
    });
}

/**
 * 显示应用详情
 */
function appDetailView() {
    var rows = getTableSelectData("table_base_local1470275538711");
    if(rows === undefined || rows.length === 0) {
        tipBox.showMessage('请选择应用记录。', 'info');
        return;
    }

    showModalDialog('dialog1470276493252', '应用页面', 'process_package_detail_view.html?operator=edit&packageId=' + rows[0]['id']);
}

var UiShowService = function () {
};

UiShowService.prototype = {
    searchProcessInfo: function () {
        var processPackageName = $("#input_text1477965453864").val();
        var conditions = [];
        var condition = {};

        if (processPackageName != "") {
            condition = {'cname': 'process_packageName', 'compare': 'like', 'value': '%' + processPackageName + "%"};
            conditions.push(condition);
        }

        var orders = [];
        var order = {'field':'import_time', 'order':'desc'};
        orders.push(order);
        var table_base_application = $("#table_base_local1470275538711");
        table_base_application.bootstrapTable("removeAll");
        var data = maoOrmBase.query(PACKAGE_TABLE_NAME, queryColumns, generateCondition(conditions, 'and'), true, orders);
        table_base_application.bootstrapTable("appendData", data.rows);
    }
};

var uiShowService = new UiShowService();

$(document).ready(function businessChange() {

    $("#layout1471941926884").hide();
    $("#upload_file_app").click(function() {
        deployApplication();
    });
    $("#trash_file_app").click(function() {
       $("#file_app_zip").val('');
    });
    $("#button1470276200107").click(function () {
        uiShowService.searchProcessInfo();
    });

    init_application_table_list();
});
