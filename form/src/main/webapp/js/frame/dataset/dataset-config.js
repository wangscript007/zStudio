function datasetConfig(){
    this.componentType = "";
    this.compId = "";
    this.configInfoId = "";
	this.configDetailInfo = "";
    this.currentObject = {};
    this.datasetConfigInfo =
        {
            datasource:"",
            dataset:"",
            key:"",
            value:"",
            nodeName:"",
            nodeId:"",
            nodePid:"",
            nodeTitle:"",
            columns:[]
        };
}
datasetConfig.datafields = null;
datasetConfig.prototype={
    init:function(){
        this.getParams();
        this.setVisibility();
        this.loadData();
    },
    getParams:function(){
        var params = window.location.href;
        this.compId = getUrlParam("compId",params);
        this.configInfoId = getUrlParam("configInfoId",params);
        this.currentObject = $("[compid="+this.compId+"]",window.parent.document.body);
        this.componentType = $(this.currentObject).attr("type");
        var configInfo = $(this.currentObject).attr("datasetconfig");
        if(configInfo){
            this.datasetConfigInfo = $.parseJSON(decodeURIComponent(configInfo));
        }
    },
    loadData:function(){
        this.loadDataSource(this.datasetConfigInfo.datasource);
        this.loadDatasetInfo(this.datasetConfigInfo.datasource,
                            this.datasetConfigInfo.dataset);
        switch (this.componentType){
            case "tree":
                this.loadTreeDataFields(
                    this.datasetConfigInfo.datasource,
                    this.datasetConfigInfo.dataset,
                    this.datasetConfigInfo.nodeName,
                    this.datasetConfigInfo.nodeId,
                    this.datasetConfigInfo.nodePid,
                    this.datasetConfigInfo.nodeTitle
                );
                break;
            case "select_dynamic":
            case "input_radio":
                this.loadOptionDataFields(
                    this.datasetConfigInfo.datasource,
                    this.datasetConfigInfo.dataset,
                    this.datasetConfigInfo.key,
                    this.datasetConfigInfo.value
                );
                break;
            case "table_base":
                this.loadTableDataFields(
                    this.datasetConfigInfo.datasource,
                    this.datasetConfigInfo.dataset
                );
                break;
        }
    },
    setVisibility:function(){
        switch (this.componentType){
            case "tree":
                $("#treeDatasetConfig").show();
                $("#tableDatasetConfig").hide();
                $("#optionComponentConfig").hide();
                break;
            case "select_dynamic":
            case "input_radio":
                $("#treeDatasetConfig").hide();
                $("#tableDatasetConfig").hide();
                $("#optionComponentConfig").show();
                break;
            case "table_base":
                $("#treeDatasetConfig").hide();
                $("#tableDatasetConfig").show();
                $("#optionComponentConfig").hide();
                break;
        }
    },
    getCurrentComponentPrefix:function(){
        var type ="";
        switch (this.componentType){
            case "tree":
               type = "tree";
                break;
            case "select_dynamic":
            case "input_radio":
                type = "option";
                break;
            case "table_base":
                type = "table";
                break;
        }
        return type;
    },
    loadDataSource:function(selectedDatasource){
        var dataSources = parent.window.dataSourceDictionary;
        var datasourceOptions = [];
        datasourceOptions.push("<option value=''><--请选择数据源--></option>");
        $.each(dataSources.keySet(),function(index,item){
            datasourceOptions.push("<option value=\""+item+"\">"+item+"</option>");
        })
        var currentDatasource = this.getCurrentComponentPrefix()+"DatasetSource";
        $("#"+currentDatasource).empty().append(datasourceOptions).val(selectedDatasource);
    },
    loadDatasetInfo : function(selectedDatasource,selectedDataset){
        var currentDataset = this.getCurrentComponentPrefix()+"DatasetNames";
        var datasetLoadCallback = function(tables){
            var options = [];
            options.push("<option value=''><--请选择数据集--></option>");
            $.each(tables,function(index,item){
                options.push("<option value = "+item+">"+item+"</option>");
            })
            $("#"+currentDataset).empty().append(options).val(selectedDataset);
        }
        window.parent.queryDatasetNames(selectedDatasource,datasetLoadCallback);
    },
    loadOptionDataFields:function(selectedDatasource,selectedDataset,key,value){
        var datasetFieldsCallback = function(data){
            var fields = [];
            $.each(data,function(index,item){
                fields.push("<option value=\""+item.columnName+"\">"+item.columnName+"</option>");
            })
            $("#optionDatasetkey").empty().append(fields).val(key);
            $("#optionDatasetValue").empty().append(fields).val(value);
            datasetConfig.datafields = data;
        }
        window.parent.queryDatasetFields(selectedDatasource,selectedDataset,datasetFieldsCallback);
    },
    loadTreeDataFields:function(selectedDatasource,selectedDataset,nodeName,nodeId,nodePid,nodeTitle){
        var datasetFieldsCallback = function(data){
            var fields = [];
            $.each(data,function(index,item){
                fields.push("<option value=\""+item.columnName+"\">"+item.columnName+"</option>");
            })
            $("#treeDatasetNodeName").empty().append(fields).val(nodeName);
            $("#treeDatasetNodeId").empty().append(fields).val(nodeId);
            $("#treeDatasetNodePid").empty().append(fields).val(nodePid);
            $("#treeDatasetNodeTitle").empty().append(fields).val(nodeTitle);
            datasetConfig.datafields = data;
        }
        window.parent.queryDatasetFields(selectedDatasource,selectedDataset,datasetFieldsCallback);
    },
    loadTableDataFields:function(selectedDatasource,selectedDataset){
        var fields = [];
        var datasetFieldsCallback = function(data){
            $.each(data,function(index,item){
                fields.push("<p>"+item.columnName+"</p>");
            })
            $("#tableDatasetFields").html(fields.join(" "));
            datasetConfig.datafields = data;
        }
        window.parent.queryDatasetFields(selectedDatasource,selectedDataset,datasetFieldsCallback);
    },
    setOptionDatasetConfigInfo:function(){
        this.datasetConfigInfo = {
            datasource:$("#optionDatasetSource").val(),
            dataset:$("#optionDatasetNames").val(),
            key:$("#optionDatasetkey").val(),
            value:$("#optionDatasetValue").val()
        };
		this.configDetailInfo="<p>数据源:"+this.datasetConfigInfo.datasource+"</p>"+
						"<p>数据集:"+this.datasetConfigInfo.dataset+"</p>"+
						"<p>选项名称:"+this.datasetConfigInfo.key+"</p>"+
						"<p>选项值:"+this.datasetConfigInfo.value+"</p>";
    },
    setTreeDatasetConfigInfo:function(){
        this.datasetConfigInfo = {
            datasource:$("#treeDatasetSource").val(),
            dataset:$("#treeDatasetNames").val(),
            nodeName:$("#treeDatasetNodeName").val(),
            nodeId:$("#treeDatasetNodeId").val(),
            nodePid:$("#treeDatasetNodePid").val(),
            nodeTitle:$("#treeDatasetNodeTitle").val()
        };
		
		this.configDetailInfo="<p>数据源:"+this.datasetConfigInfo.datasource+"</p>"+
						"<p>数据集:"+this.datasetConfigInfo.dataset+"</p>";	
						
		var configInfo = this.datasetConfigInfo;					
		$("#"+this.configInfoId,parent.window.document).parents().find("table input").each(function(){			
			var id = $(this).attr("id");			
			if(id == "treenodename"){
				$(this).val(configInfo.nodeName);
			}else if(id == "treenodeid"){
				$(this).val(configInfo.nodeId);
			}else if(id == "treeparentnodeid"){
				$(this).val(configInfo.nodePid);
			}else if(id == "treenodetitle"){
				$(this).val(configInfo.nodeTitle);
			}
		});
		$(this.currentObject).attr("treenodename",configInfo.nodeName)
							.attr("treenodeid",configInfo.nodeId)
							.attr("treeparentnodeid",configInfo.nodePid)
							.attr("treenodetitle",configInfo.nodeTitle);	
    },
    setTableDatasetConfigInfo:function(){
        this.datasetConfigInfo = {
            datasource:$("#tableDatasetSource").val(),
            dataset:$("#tableDatasetNames").val()
        };
		this.configDetailInfo="<p>数据源:"+this.datasetConfigInfo.datasource+"</p>"+
						"<p>数据集:"+this.datasetConfigInfo.dataset+"</p>";
    },
    submit:function(){
        switch (this.componentType){
            case "tree":
                this.setTreeDatasetConfigInfo();
                break;
            case "select_dynamic":
            case "input_radio":
                this.setOptionDatasetConfigInfo();				
                break;
            case "table_base":
                this.setTableDatasetConfigInfo();				
                break;
        }
        this.datasetConfigInfo.columns = datasetConfig.datafields;
		$("#"+this.configInfoId,window.parent.document.body).html(this.configDetailInfo);
		this.currentObject.attr("datasetconfig",encodeURIComponent(JSON.stringify(this.datasetConfigInfo)));
    }
}

$(document).ready(function(){
    var config = new datasetConfig();
        config.init();

    var datasourceId = config.getCurrentComponentPrefix()+"DatasetSource";
    $("#"+datasourceId).change(function(){        
        config.loadDatasetInfo($(this).val(),"");
		$("select").each(function(){
			if($(this).attr("id") == datasourceId){
				return;
			}
			$(this).empty();
		});
    })

    var datasetNameId = config.getCurrentComponentPrefix()+"DatasetNames";
    $("#"+datasetNameId).change(function(){
		$("select").each(function(){
			if($(this).attr("id") == datasourceId 
				|| $(this).attr("id") == datasetNameId){
				return;
			}
			$(this).empty();
		});	
			
		var datasource = $("#"+datasourceId).val();
        var dataset =$(this).val();
        switch (config.componentType){
            case "tree":               
                config.loadTreeDataFields(datasource,dataset);                
                break;
            case "select_dynamic":
            case "input_radio":              
                config.loadOptionDataFields(datasource,dataset);                
                break;
            case "table_base":               
                config.loadTableDataFields(datasource,dataset);
                break;
        }
    })
	$("#datasetconfig",window.parent.document.body).one("click",function(){
        config.submit();
        $(config.currentObject).trigger("click");
		window.parent.hideModalDialog("datasetConfigDialog");
	});
})