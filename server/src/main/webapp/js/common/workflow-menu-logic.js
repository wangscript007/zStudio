var tableId = "table_base_local1469513386965";
var dialog1 = "dialog1469583514100";
var dialog2 = "dialog1469586135901";
var dialog3 = "dialog1469600245005";

var data7 = {NAME:"<span class='glyphicon glyphicon-random'></span>发起流程",KEY:"Workspace_MyUnfinishedWorkItem",
             PARENT_KEY:"流程中心",URL:"#",ORDER:"2"};
var data8 = {NAME:"<span class='glyphicon glyphicon-share-alt'></span>我的流程",KEY:"Workspace_MyInstance",
             PARENT_KEY:"流程中心",URL:"#",ORDER:"2"};
var data0 = {NAME:"<span class='glyphicon glyphicon-search'></span>流程查询",KEY:"Query",
             PARENT_KEY:"流程中心",URL:"#",ORDER:"1"};
var data1 = {NAME:"&nbsp;&nbsp;<span class='glyphicon glyphicon-leaf'></span>查询任务",KEY:"Workspace_OperatorWorkItem",
             PARENT_KEY:"Query",URL:"/cos/jump-page/processinstance.html",ORDER:"11"};
var data2 = {NAME:"&nbsp;&nbsp;<span class='glyphicon glyphicon-info-sign'></span>查询流程实例",KEY:"Query_Instance",
             PARENT_KEY:"Query",URL:"/cos/jump-page/approval_todo.html",ORDER:"12"};
var data3 = {NAME:"<span class='glyphicon glyphicon-calendar'></span>流程监控",KEY:"Monitor",
             PARENT_KEY:"流程中心",URL:"#",ORDER:"2"};
var data4 = {NAME:"&nbsp;&nbsp;<span class='glyphicon glyphicon-compressed'></span>进行中的任务",KEY:"Monitor_UnfinishedWorkItem",
             PARENT_KEY:"Monitor",URL:"/cos/zl-startProcess.html?type=0",ORDER:"21"};
var data5 = {NAME:"&nbsp;&nbsp;<span class='glyphicon glyphicon-briefcase'></span>进行中的流程",KEY:"Monitor_UnfinishedInstance",
             PARENT_KEY:"Monitor",URL:"/cos/zl-startProcess.html?type=1",ORDER:"22"};
var data6 = {NAME:"&nbsp;&nbsp;<span class='glyphicon glyphicon-dashboard'></span>超时的任务",
             KEY:"Monitor_ElapsedWorkItem",PARENT_KEY:"Monitor",URL:"/cos/zl-startProcess.html?type=2",ORDER:"23"};


var dataArray = [];
dataArray.push(data7);
dataArray.push(data8);
dataArray.push(data0);
dataArray.push(data1);
dataArray.push(data2);
dataArray.push(data3);
dataArray.push(data4);
dataArray.push(data5);
dataArray.push(data6);
 
function addRootMenu(){
    showModalDialog(dialog1, "新增菜单","workflow-menu-add.html?operator=add");
}

function addMenu(parentKey){
    debugger;
    showModalDialog(dialog2, "新增子菜单","workflow-menu-add.html?operator=add&parentKey=" + parentKey);
}

function editMenu(params){
    debugger;
    showModalDialog(dialog2, "编辑菜单","workflow-menu-add.html?operator=edit&" + params);
}
//function roleAuthorization(name){
//    showModalDialog(dialog3, "编辑权限","workflow-privilege.html?operator=edit&name=" + name);
//}

function moveUpRecord(){
    debugger;
    var rows = getTableSelectData(tableId);
    var index = rows[0].$id;
	if(rows.length == 0) {
		bootbox.alert("请选择一条数据");
		return;
	}
	if(index == 0){
	    return ;
	}
	swapRecord(dataArray,index,index - 1);
	initTestData();
}

function moveDownRecord(){
    debugger;
    var rows = getTableSelectData(tableId);
    var index = rows[0].$id;
	if(rows.length == 0) {
		bootbox.alert("请选择一条数据");
		return;
	}
	if(index == dataArray.length -1){
	    return ;
	}
	swapRecord(dataArray,index,index + 1);
	initTestData();
}

function swapRecord(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
};

function initTestData(){
    var rows = [];
    //rows.push(data0);
    //rows.push(data1);
    //rows.push(data2);
    //rows.push(data3);
    //rows.push(data4);
    //rows.push(data5);
    //rows.push(data6);
    for(var i =0;i<dataArray.length;i++){
        rows.push(dataArray[i]);
    }
    $('#' + tableId).bootstrapTable('removeAll');
    addRowtoLocalTable(tableId,rows);
}
function getCurrentName(value,row){
    if(row.PARENT_KEY != ""){
        return value;
    }
    return value;
}
function getDisplayName(name){
    return name.substring(name.lastIndexOf(">")+1);
}
function getOperatorBar(value,row){
    debugger;
    var params ="NAME=" + getDisplayName(row.NAME) + "&KEY="+ row.KEY + "&PARENT_KEY="
               + row.PARENT_KEY + "&URL="+ row.URL + "&ORDER=" + row.ORDER;
               
    var htmlStr = "<a href=\"javascript:editMenu('" + params + "')\" style='text-decoration:none' >编辑</a>";
    
    if(row.URL == "#"){
        htmlStr +="       <a href=\"javascript:addMenu('" + row.KEY + "')\" style='text-decoration:none' >添加子菜单</a>";
    }
    //htmlStr +="       <a href=\"javascript:roleAuthorization('" + getDisplayName(row.NAME) + "')\" style='text-decoration:none' >编辑权限</a>";
    
    return htmlStr;
}

$(document).ready(function(){
   initTestData();
});
