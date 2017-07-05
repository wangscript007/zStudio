var treeId1 = "tree1469774263937";
var treeId2 = "tree1469774279512";
var flag1 = true;
var flag2 = true;
function initTestData(){
    var name = getUrlParam("name",pageParams);  
    $("#input_text1469599434499").val(name);
    $("#input_text1469761240024").attr("readonly","readonly");
    $("#input_text1469761331820").attr("readonly","readonly");
}
function showTreeData(index){
    if(index == 1){
        initZtreeData(treeId1);
        if(flag1){
           $("#layout1469774249280").show(); 
           flag1 = false;
        }else{
           $("#layout1469774249280").hide(); 
           flag1 = true;
        }
    }else{
        initZtreeData(treeId2);
        if(flag2){
           $("#layout1469774271900").show(); 
           flag2 = false;
        }else{
           $("#layout1469774271900").hide(); 
           flag2 = true;
        }
    }
}

function initZtreeData(treeId){
    debugger;
    var data =[
        { id:1, pId:0, name:"部门", open:false},
        { id:11, pId:1, name:"部门1", open:true},
        { id:111, pId:1, name:"部门2"},
        { id:2, pId:0, name:"项目"},
        { id:12, pId:2, name:"项目1", open:true}
    ];
    var setting = {  
		        data: {
		        	simpleData: {enable: true, idKey: "id", pIdKey: "pId"},
		    		key: {title: "name",name: "name"}
		    	},
		        check: {enable: true,chkStyle: "checkbox"}
		    };
    $.fn.zTree.init($('#' + treeId), setting, data);
}

$(document).ready(function(){
   initTestData();
});
