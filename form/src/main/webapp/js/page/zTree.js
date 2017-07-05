function zTree(){
	this.tree;//当前树对象
	this.nodeName = "name";//树节点名称
	this.nodeTitle = "name";//树节点提示信息
	this.nodeID = "id";//树节点ID
	this.parentNodeID = "pId";//树父节点ID
	this.treeDataUrl;//数据源
	this.callback={};//事件定义
	this.check={};	
	
	this.zNodes =[
		{id:1, pId:0, name:"节点1", open:true},
		{id:101, pId:1, name:"节点1-1", file:"core/standardData"},
		{id:2, pId:0, name:"节点2", open:false},
		{id:201, pId:2, name:"节点2-1", file:"excheck/checkbox"},
		{id:206, pId:2, name:"节点2-2", file:"excheck/checkbox_nocheck"}			
	];
		
	this.setting = {};	
}

/**
	* 参数设置
*/
zTree.prototype.setTreeSetting=function(){
	this.setting = {
		check:this.check,
		view: {
			dblClickExpand: false,
			showLine: true,
			selectedMulti: false
		},
		data: {
			key:{
					children: "children",
					name: this.nodeName,
					title: this.nodeTitle			
				},
			simpleData: {
				enable:true,
				idKey: this.nodeID,
				pIdKey: this.parentNodeID,
				rootPId: ""
			}
		},
		callback:this.callback
	};		
}

/**
	* 勾选类型
	* @param chkstyle:(radio:单选;checkbox:复选;"":空)
*/
zTree.prototype.setChkStyle=function(chkstyle){
	if(chkstyle != undefined){
		if(chkstyle == "radio"){
			this.check={enable: true,chkStyle: "radio",radioType:"all"};	
		}
		else if(chkstyle == "checkbox"){
			this.check={enable: true};	
		}
		else{
			this.check={};		
		}					
	}		
}

/**
	* 设计阶段，从组件属性获取树节点信息。
	* @param compid:组件ID
*/
zTree.prototype.initTree=function(compid) {
	this.tree = $("#" + compid);
	this.nodeName = "name";
	this.nodeTitle = "name";
	this.nodeID = "id";
	this.parentNodeID = "pId";
	//解析sysdata.json和processdata.json文件得到数据项的数据，并且赋值给zNodes初始化树
	if(typeof(designFormGrolbalObject) != 'undefined'){
		if(designFormGrolbalObject.process.id === null){
			$("#dataproject").css("display","none");
		}else{
			//解析dataTree.json文件得到数据项的数据，并且赋值给zNodes初始化树
			if(this.tree.hasClass("dataTree")){
				var sysdata = [];
				var processdata = [];
				$.ajax({
					type:"get",
					url:"json-extension/bcp/sysdata.json",
					async:false,
					success:function(data){
						sysdata = data;

					}
				});
				$.ajax({
					type:"get",
					url:'json-extension/bcp/'+designFormGrolbalObject.process.id+'data.json',
					async:false,
					success:function(data){
						processdata = data;

					}
				});
				this.zNodes = sysdata.concat(processdata);

			}
		}
	}
	this.setTreeSetting();
	this.loadTreeDataCallBack(this.tree, this.setting, this.zNodes);
	//判断是否为数据项树，是的话绑定代码片段
	if(this.tree.hasClass("dataTree")){sysDataTree();}
}





/**
	* 输出页面加载时使用此方法，从属性API接口获取树节点信息。
	* @param compid:组件ID
*/
zTree.prototype.initTreeFromAPI=function(compid, dsname) {
	var treeStyle = "";
	var attrs = attributeAPI.getAttributesByID(compid);
	for (var i in attrs) {
		var item = attrs[i];
		if (item.name == "treenodename") {
			this.nodeName = item.value;
		}
		else if (item.name == "treenodeid") {
			this.nodeID = item.value;
		}
		else if (item.name == "treeparentnodeid") {
			this.parentNodeID = item.value;
		}
		else if (item.name == "treenodetitle") {
			this.nodeTitle = item.value;
		}
		else if (item.name == "treedataurl") {
			this.treeDataUrl = decodeURIComponent(item.value);
			this.treeDataUrl = generatorURL(dsname, this.treeDataUrl, $("#" + compid));
		}
		else if (item.name == "datasetconfig") {
			var datasetconfig = decodeURIComponent(item.value);
			if (datasetconfig == "undefined") {
				continue;
			}
			datasetconfig = $.parseJSON(decodeURIComponent(item.value));
			if (datasetconfig) {
				var columns = [];
				columns.push(datasetconfig.nodeName);
				columns.push(datasetconfig.nodeId);
				columns.push(datasetconfig.nodePid);
				columns.push(datasetconfig.nodeTitle);
				this.treeDataUrl = getDatasetQueryURL(datasetconfig.datasource,
					datasetconfig.dataset,
					columns,
					undefined,
					false
				);
			}
		}
		else if (item.name == "chkstyle") {
			this.setChkStyle(item.value);
		}
		else if (item.name === "treestyle") {
			treeStyle = item.value;
		}
	}
	this.setTreeSetting();

	this.tree = $("#" + compid);
	if (this.nodeID && this.parentNodeID && this.nodeName && this.treeDataUrl) {
		if (treeStyle && treeStyle === "areatree") {
			this.initAreaTree(compid, this.treeDataUrl);
		} else {
			this.loadTreeData(this.loadTreeDataCallBack);
		}
	}
	else {
		this.loadTreeDataCallBack(this.tree, this.setting, this.zNodes);
	}
}

/**
	* 加载树节点数据
	* @param callback:回调函数
*/
zTree.prototype.loadTreeData=function(callback) {
	var treeObj = this.tree;
	var treeSetting = this.setting;

	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: this.treeDataUrl,
		//data:this.treeParams,             
		success: function (data) {
			var result;
			if (data.data != undefined) {
				if (typeof data.data == "string") {
					result = JSON.parse(data.data);
				}
				else {
					result = data.data;
				}
			}
			else if (data.rows != undefined) {
				result = data.rows;
			}
			if (result == undefined) {
				console.log("加载树数据失败，无法获取到满足要求的数据。");
			}

			var treeId = $(treeObj).attr("id");
			if (typeof(eval("window." + treeId + "SuccessCallBack")) !== "undefined") {
				result = applyFunc(treeId + "SuccessCallBack", [data]);
			}

			callback(treeObj, treeSetting, result);
		}
	});
}

/**
	* 加载树节点数据
	* @param tree:树对象实例
	* @param setting:zTree 配置
	* @param zNodes:节点数据 
*/
zTree.prototype.loadTreeDataCallBack=function(tree,setting,zNodes){
	var zTree=$.fn.zTree.init(tree, setting, zNodes);
	zTree.expandAll(true);
	
	setZtreeToTreeMap($(tree).attr("id"),zTree);	
}
/**
	通过节点ID获取节点
*/
zTree.prototype.getNodeByTId = function(nodeId){
	var treeNode;
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		treeNode=zTree.getNodeByTId(nodeId);
	}
	
	return 	treeNode;
}
/**
	获取选中节点	
*/
zTree.prototype.getSelectedTreeNode = function(){
	var treeNodes;
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		treeNodes=zTree.getSelectedNodes();
	}
	return treeNodes;
}
/**
	选择数节点
*/
zTree.prototype.selectNode = function(treeNode){
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		zTree.selectNode(treeNode);
	}	
}

zTree.prototype.getNodeByParam = function(key,value,parentNode){
	var treeNode;
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		treeNode=zTree.getNodeByParam(key, value, parentNode);
	}
	
	return treeNode;	
}
/**
	禁用\启用节点
*/
zTree.prototype.setChkDisabled = function(treeNode,flag){
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		zTree.setChkDisabled(treeNode,flag);
	}	
}
/**
	向指定节点添加子节点
*/
zTree.prototype.addNodes = function(parentNode,newNodes){
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		zTree.addNodes(parentNode,newNodes);
	}	
}
/**
	删除指定节点子节点
*/
zTree.prototype.removeChildNodes = function(parentNode){
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		zTree.removeChildNodes(parentNode);
	}	
}
/**
 * 根据过滤器获取节点信息
 * @param  filter
 * @param flag:true 获取节点集合，false:获取单个节点
 */
zTree.prototype.getNodesByFilter = function(filter,flag){
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		return zTree.getNodesByFilter(filter,flag);
	}
}

zTree.prototype.hideNodes = function(nodes){
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree != undefined){
		zTree.hideNodes(nodes);
	}
}
/**
 * 展开树节点
 * @param flag
 */
zTree.prototype.expandAll = function(flag){
	var treeId = $(this.tree).attr("id");
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree){
		zTree.expandAll(flag);
	}
}
zTree.prototype.refreshTreeEvent= function(treeId,callback){
	var zTree = $.fn.zTree.getZTreeObj(treeId);
	if(zTree) {
		var setting = zTree.setting;
		var nodes = zTree.getNodes();
		setting.callback = callback;
		if(callback && callback.beforeNodesBind){
			this.formatTreeNode(nodes,callback.beforeNodesBind);
		}
		$.fn.zTree.init($("#"+treeId), setting, nodes);
		zTree.expandAll(true);
	}
}
/**
 * 格式化树节点
 * @param treeNodes
 * @param callback
 */
zTree.prototype.formatTreeNode = function(treeNodes,callback){
	if(!treeNodes){
		return;
	}
	var that = this;
	$.each(treeNodes,function(index,node){
		callback(node);
		if(node.children){
			that.formatTreeNode(node.children,callback);
		}
	})
}

/**
 * 区域树加载
 * @param treeId
 * @param areaDataUrl
 */
zTree.prototype.initAreaTree = function(treeId,areaDataUrl){
	var parameter = {
		setting: this.setting,
		dataParams: {
			url: areaDataUrl
		}
	};

	var areaTree = new LayoutitAreaTree(treeId,parameter);
		areaTree.init();
}


/**
	*存放树对象实例
*/
var sysTreeMap=new Map();


/**
	* 根据对象树ID获取选中节点
	* @param treeID:树节点ID
*/
function getSelectedTreeNode(treeID){
	var treeNodes;
	var zTree = $.fn.zTree.getZTreeObj(treeID);
	if(zTree != undefined){
		treeNodes=zTree.getCheckedNodes();
	}
	return treeNodes;
}


/**
	*将zTree实例存放到map对象中
	*@param treeID:树ID
	*@param zTreeObj:zTree实例
*/
function setZtreeToTreeMap(treeID,zTreeObj){
	//sysTreeMap.put(treeID,zTreeObj);
}
/**
获取选中节点示例代码	
function testGetSelectedNode(){
	var selectedNodes=getSelectedTreeNode("tree3");
	$.each(selectedNodes,function(index,item){
	      alert(item.NodeID+"--"+item.Remark);
	})
}

*/

/**
 * 用户自定义节点图标
 * @param treeNodes
 */
function ztreeNodeFormatForOrg(node){
	if(node.dimensionType === 1){
		node.icon = "img/ztree/org.gif";
	}else{
		node.icon = "img/ztree/project.gif";
	}
}




/**
 * 区域组件树
 * @param treeId
 * @param optionParam
 * @constructor
 */
function LayoutitAreaTree(treeId,optionParam){
	this.options = {
		setting: {
			check: {},
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			data: {
				key: {
					children: "children",
					name: "name",
					title: "name"
				},
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: ""
				}
			},
			callback: {}
		},
		dataParams: {
			url: ""
		}
	};

	$.extend(true,this.options,optionParam);
	this.treeObj = $("#"+treeId);
}

/**
 * 加载区域基础数据
 */
LayoutitAreaTree.AREAS = (function($) {
	var baseData = [],
		src = $("script[src *=bootstrap-chinese-region-areas]:first").attr("src");
	if(!src){
		return;
	}
	
	$.ajax({
		type: 'GET',
		dataType: 'JSON',
		async: false,
		url: src,
		success: function (data) {
			for (var i = 0; i < data.length; i++) {
				baseData.push({id: data[i].id, name: data[i].cname, level: data[i].level, pId: data[i].upid});
			}
		}
	});

	return baseData;
})(jQuery)


LayoutitAreaTree.prototype = {
	init: function () {
		var zTree = $.fn.zTree.init(this.treeObj, this.options.setting, this.getAreaTreeNodes());
		zTree.expandAll(true);
	},
	loadSelectedArea: function () {
		var resultData;
		$.ajax({
			type: 'GET',
			dataType: 'JSON',
			async: false,
			url: this.options.dataParams.url,
			success: function (data) {
				if (data && data.status === 1) {
					resultData = data.rows;
				}
			}
		});

		return resultData;
	},
	getAreaData: function (areamap) {
		var areas = [];
		if (LayoutitAreaTree.AREAS && areamap) {
			$.each(LayoutitAreaTree.AREAS, function (index, item) {
				if (areamap.get(item.id)) {
					areas.push(item);
				}
			})
		}

		return areas;
	},
	getAreaTreeNodes: function () {
		var zNodes = [],
			selectedArea = this.loadSelectedArea();
		if (selectedArea && selectedArea.length > 0) {
			var areaMap = new Map();
			var that = this;
			$.each(selectedArea, function (index, item) {
				var areaId = that.getAreaId(item);
				if (!areaId) {
					return;
				}

				areaMap.put(areaId, item);

				var minProvinceId = parseInt(areaId.substring(0, 2) + "0100"),
					minCityId = parseInt(areaId.substring(0, 4) + "01"),
					cityId = areaId.substring(0, 4) + "00",
					provinceId = areaId.substring(0, 2) + "0000";

				if (areaId >= minCityId) {
					areaMap.put(cityId, cityId);
					areaMap.put(provinceId, provinceId);
				} else if (areaId >= minProvinceId) {
					areaMap.put(provinceId, provinceId);
				}
			})

			zNodes = this.getAreaData(areaMap);
		}

		return zNodes;
	},
	getAreaId: function (selectedArea) {
		var areaId;
		if (!selectedArea) {
			return areaId;
		}

		for (var index in selectedArea) {
			areaId = selectedArea[index]
			break;
		}

		return areaId;
	}
}


/*
 *根据流程数据项传过来控件类型进行控件的绑定的代码片段
 */
/*var chooseComponent = function(node){
	var htmlBits = "";
	var compStyle = node.companentType;
	var divAttr = 'fieldtype='+node.colSty+' editable="%7B%22add%22%3A%22checked%22%2C%22view%22%3A%22%22%2C%22modify%22%3A%22checked%22%7D" field='+node.column+' defaultvalue='+node.defaultVal;
	var compAttr = 'ms-duplex-string="'+node.column+'"';
	var checkboxAttr = 'name="sports" type="checkbox" ms-duplex-number="'+node.column+'_form_compute"';
	htmlBits += '<div class="box box-element ui-draggable" style="display: block;">';
	htmlBits += '<a href="#close" class="remove label label-danger"><i class="glyphicon-remove glyphicon"></i></a>';
	htmlBits += '<div class="preview">'+node.compStyle+'</div><div class="view draggableHandle">';
	if(compStyle == '文本框'){
		htmlBits += '<div type="input_text" '+divAttr+' ><input type="text" class="form-control" '+compAttr+'></div></div></div>';
	}else if(compStyle == '文本域'){
		htmlBits += '<div type="textarea" '+divAttr+'><textarea class="form-control" rows="2" '+compAttr+'></textarea></div></div></div>';
	}else if(compStyle == '下拉框'){
		htmlBits += '<div type="select_dynamic" init="true" '+divAttr+'>';
		htmlBits += '<select style="display : inline;width:100%;" class="form-control" '+compAttr+'><option>下拉框选项1</option><option>下拉框选项2</option></select></div></div></div>';
	}else if(compStyle == '单选框'){
		htmlBits += '<div type="input_radio" init="true" class="form-control" '+divAttr+'>';
		htmlBits += '<input name="fruit" type="radio" value="1" '+compAttr+'/>选项1<input name="fruit" type="radio" value="2" '+compAttr+'/>选项2</div></div></div>';
	}else if(compStyle == '多选框'){
		htmlBits += '<div type="checkbox" init="true" class="form-control" '+divAttr+'>';
		htmlBits += '<input '+checkboxAttr+' value="football" /><span>选项1</span>';
		htmlBits += '<input '+checkboxAttr+' value="basketball" /><span>选项2</span><input '+checkboxAttr+' value="baseball" /><span>选项3</span></div></div></div>';
	}else if(compStyle == '日期'){
		htmlBits += '<div type="input_datetime" vcontent="date%3A%7Bformat%3A%20'+'\''+'YYYY-MM-DD%20h%3Am%3As'+'\''+'%7D" datetimeformat="YYYY-MM-DD%20HH%3Amm%3Ass" vtype="datetime" '+divAttr+'>';
		htmlBits += '<input class="form-control form_time" placeholder="YYYY-MM-DD HH:mm:ss" datetimeformat="YYYY-MM-DD%20HH%3Amm%3Ass" vcontent="date%3A%7Bformat%3A%20'+'\''+'YYYY-MM-DD%20h%3Am%3As'+'\''+'%7D" vtype="datetime" type="text" '+compAttr+'></div></div></div>';
	}else if(compStyle == '上传'){
		htmlBits += '<div type="input_fileinput" fieldtype='+node.colSty+' field='+node.column+' init="true">';
		htmlBits += '<input type="file" class="file"  data-show-preview="false" /></div></div></div>';
	}
	return htmlBits;

}*/

/*
 *遍历数据项节点绑定拖拽的代码片段
 */
/*function nodeDrag(nodes) {
	for (var i = 0, len = nodes.length; i < len; i++) {
		var treeNodes = nodes[i];
		if (treeNodes.isParent && treeNodes.children != null && treeNodes.children.length > 0) {
			var name = $("#" + treeNodes.tId + '_a').text();
			nodeDrag(treeNodes.children);
		} else {
			var $li = $($.fn.zTree.getZTreeObj("ztree").getNodeByTId("#" + treeNodes.tId));
			var node = {};
			node['name'] = $li.attr('name');
			node['column'] = $li.attr('column');
			node['colType'] = $li.attr('colType');
			node['defaultVal'] = $li.attr('defaultVal');
			var htmlStr = '<div class="lyrow restoremark" node="node" style="display: inline-block;"><a href="#close" class="remove label label-danger"><i class="glyphicon-remove glyphicon"></i> ';
			htmlStr += '</a><div class="preview dataTreeClass">';
			htmlStr += '<span  class="button ico_docu"></span>'+node.name+'</div><div class="view"><div type="layout" ratio="4,8"><div class="row clearfix"><div class="col-md-4 col-xs-4 col-sm-4 col-lg-4 column" style="padding-bottom: 21px;">';
			htmlStr += '<div class="box box-element ui-draggable" style="display: block;"><a href="#close" class="remove label label-danger showRemove"><i class="glyphicon-remove glyphicon"></i></a><div class="preview">标签</div>';
			if($li.attr("pId") == "systemdata"){
				node['title'] = $li.attr('title');
				htmlStr += '<div class="view draggableHandle form-component_active"><div type="label"  lablefontsize="16" labelfontweight="false" labelfontcolor="" class="layout-align-right"><label class="control-label">'+node.name+'</label></div></div></div></div>';
				htmlStr += '<div class="col-md-8 col-xs-8 col-sm-8 col-lg-8 column" style="padding-bottom: 21px;"><div class="box box-element ui-draggable" style="display: block;"><a href="#close" class="remove label label-danger showRemove"><i class="glyphicon-remove glyphicon"></i></a>';
				htmlStr += '<div class="preview">标签</div><div class="view draggableHandle form-component_active"><div type="label" field='+node.column+' lablefontsize="16" labelfontweight="false" labelfontcolor="" class="layout-align-right"><label class="control-label" ms-text="'+node.column+'">'+node.column+'</label></div>';
				htmlStr += '</div></div></div></div></div></div></div>';
				$("#" + treeNodes.tId + '_a').parent().append(htmlStr);
			}else{
				node['companentType'] = $li.attr('companentType');
				var htmlBits = chooseComponent(node);
				htmlStr += '<div class="view draggableHandle form-component_active"><div type="label" lablefontsize="16" labelfontweight="false" labelfontcolor="" class="layout-align-right"><label class="control-label" >'+node.name+'</label></div></div></div></div>';
				htmlStr += '<div class="col-md-8 col-xs-8 col-sm-8 col-lg-8 column" style="padding-bottom: 5px;">'+htmlBits+'</div></div></div></div></div>';
				$("#" + treeNodes.tId + '_a').parent().append(htmlStr);
			}
			$("#" + treeNodes.tId + '_a').remove();
		}

	}

};*/
/**
 * 组件拖动
 */
function dragComponent() {
	$(".form-layout-west .lyrow").draggable({
		connectToSortable: ".demo",
		helper: "clone",
		cursor: "move",
		cursorAt: {left: 5, top: 30 },
		start: function (e, t) {
			isDraggableFlag = true;
		},
		drag: function (e, t) {
			t.helper.width(100);
		},
		stop: function (e, t) {
			$('#container_data').find('.restoremark').each(function(){$(this).css('display','block')});
			sortableComponent();
		}
	});

	$(".form-layout-west .box").draggable({
		connectToSortable: ".column",
		helper: "clone",
		cursor: "move",
		cursorAt: {left: 5, top: 30 },
		drag: function (e, t) {
			t.helper.width(100);
		}
	});

	$(".form-layout-west .box-hide").draggable({
		connectToSortable: ".footer-bg",
		helper: "clone",
		cursor: "move",
		cursorAt: {left: 5, top: 30 },
		drag: function (e, t) {
			t.helper.width(100)
		},
		stop: function (e, t) {
			$(".footer-bg").sortable({
				opacity: .35,
				connectWith: ".footer-bg",
				change: function (event, ui) {
					console.log("change:" + ui.item);
				},
				sort: function (event, ui) {
					console.log("sort:" + ui.item);
				},
				stop: function (event, ui) {
					initModalDialog(ui);
				}
			})
		}
	});
}



/*
var dragObj='';
function sysDataTree(){
	var treeObj = $.fn.zTree.getZTreeObj("ztree");
	var nodes = treeObj.getNodes();
	nodeDrag(nodes);
	dragComponent();
}*/
