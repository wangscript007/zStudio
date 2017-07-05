/**
 * 数据集管理接口
 * */
function datasetAPI() {
    this.dataset = {sql:"",datasetName:"",columns:""};
}
/**
 * 设置数据集对象
 * @param dataset
 */
datasetAPI.prototype.setDataset=function(dataset){
    this.dataset = dataset;
}
/**
 * 获取数据集
 * @returns {{sql: string, datasetName: string}|*}
 */
datasetAPI.prototype.getDataset = function(){
    return this.dataset;
}
/**
 * 添加数据集
 * @param callback 回调函数
 * */
datasetAPI.prototype.add = function(callback){
    this.submit(callback,"/api/add/dataset");
}
/**
 * 更新数据集
 * @param callback 回调函数
 */
datasetAPI.prototype.update = function(callback){
    this.submit(callback,"/api/update/dataset/"+this.dataset.datasetName);
}
/**
 * 删除数据集
 * @param callback 回调函数
 */
datasetAPI.prototype.delete = function(callback){
    this.submit(callback,"/api/delete/dataset");
}
/**
 *
 * @param callback 回调函数
 * @param url 提交到服务端的url
 */
datasetAPI.prototype.submit = function(callback,url){
    var  param = new AjaxParameter();
    param.async = true;
    param.callBack = function(data){
        if(data){
            callback(data);
        }else{
            console.log("错误：服务端返回值为空！提交参数："+param.data);
        }
    }
    param.data = JSON.stringify(this.dataset);
    param.url =url;
    dsTool.saveData(param);
}
 /**
 * 设置数据列
 * 接口首先验证sql是否合法,如果合法则设置数据列返回“success”，不合法返回错误信息。
 * @param sql
 * @returns {*}
 */
datasetAPI.prototype.setSQLColumns = function(sql){
    var result = {};
    var  param = new AjaxParameter();
    param.async = false;
    param.url = "jersey-services/layoutit/frame/dataset/sql/"+sql;
    param.callBack = function(data){
        if(data){
             result = data;
        }else{
            console.log("错误：服务端返回值为空！提交参数："+param.data);
        }
    }
    dsTool.getData(param);

    if(result.status){
        this.dataset.columns = result.data.join(" ");
        return "success";
    }else{
        return result.message;
    }
}
/**
 * 查询数据集列表
 * */
datasetAPI.prototype.getDatasetList = function(callback){
    var  param = new AjaxParameter();
    param.async = true;
    param.url = "/metadata/datasets";
    param.callBack = function(data){
        if(data){
            callback(data);
        }else{
            console.log("错误：服务端返回值为空！提交参数："+param.data);
        }
    }
    dsTool.getData(param);
}


/*sql 编辑器*/
var datasetSqlEditor;
/*数据集操作：add:添加；update:更新;*/
var datasetOperation;
/*数据集操作 api*/
var datasetAPI = new datasetAPI();

/**
 * 数据集添加与修改
 * */
function datasetSubmit(){
    var dataset={};
    dataset.datasetName = $("#input_text_datasetName").val();
    dataset.sql = datasetSqlEditor.getValue();
    datasetAPI.setDataset(dataset);
    var setSQLColumnsResult = datasetAPI.setSQLColumns(dataset.sql);
    if(setSQLColumnsResult != "success"){
        bootbox.alert(setSQLColumnsResult);
        return;
    }
    var callback = function(data){
        if(data.result =="success" ){
            bootbox.alert("数据集提交成功！");
            datasetOperation = "update";
        }else{
            bootbox.alert("数据集提交失败！");
        }
    }
    if(datasetOperation == "add"){
        datasetAPI.add(callback);
    }else if(datasetOperation == "update"){
        datasetAPI.update(callback);
    }
}
/*
* 数据集表格数据绑定
* */
function bindDatasetTableData(){
    var callback = function(data){
        $('#table_base_local_datasets').bootstrapTable('removeAll');
        if(data != undefined){
            addRowtoLocalTable("table_base_local_datasets",data);
        }
    }
    datasetAPI.getDatasetList();
}
/**
 * 设置数据集组件编辑状态
 */
function setDatasetComponentStatus(){
    if(datasetOperation == "update"){
        $("#input_text_datasetName").attr("disabled","disabled");
    }else{
        $("#input_text_datasetName").removeAttr("disabled");
    }
}
/**
 * 加载数据集数据源信息
 */
function loadDatasetDatasource(){
    var pname = getUrlParam("pname",window.location.href);
    var param=new AjaxParameter();
    param.url= getContextPath() + "/jersey-services/layoutit/frame/projects/info/";
    param.callBack=function(data) {
        if(data){
            var options = [];
            $.each(data,function(index,projectItem){
                if(projectItem.name != pname){
                    return;
                }
                $.each(projectItem.sourceItem, function (index, dsItem) {
                    options.push("<option value=" + dsItem.name + ">" + dsItem.displayName + "</option>");
                })
            })
            $("#select_dynamic_datasource").empty();
            $("#select_dynamic_datasource").append(options);
        }
    }
    dsTool.getData(param);
}

$(document).ready(function(){
    var table = bootstrapTable('table_base_local_datasets', adjustTableParam('table_base_local_datasets','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"100","pageList":[50,100,200],"height":500,"clickToSelect":true,"search":false,"showColumns":false,"showRefresh":false,"sidePagination":"client","sortable":true,"idField":"$id","columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"dataset","title":"数据集名称","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":50}]}));
    controlTableToolbar('table_base_local_datasets');
    $('#table_base_local_datasets').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base_local_datasets')
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base_local_datasets')
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base_local_datasets')
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base_local_datasets')
    });
    controlTableToolbar();

    //sql 编辑器初始化
    datasetSqlEditor = ace.edit("sqlEditor");
    datasetSqlEditor.setTheme("ace/theme/iplastic");
    datasetSqlEditor.getSession().setMode("ace/mode/sql");
    //绑定数据集
    //bindDatasetTableData();

    //绑定数据源
    loadDatasetDatasource();

    dataset_operation = "update";
    $("#button_submit").click(function(){
        datasetSubmit();
        setDatasetComponentStatus();
    })

    $("#button_new").click(function(){
        dataset_operation = "add";
    })

    $('#layoutdataset').bootstrapValidator({
        fields:{
            input_text_datasetName:{
                validators: {
                    notEmpty: {
                        message: '该字段必填且不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '该字段只能是字母、整数和下划线'
                    }
                }
            }
        }
    });

});










