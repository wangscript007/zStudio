	
function getSource() {
    $("#dataSource").empty();
    var rows = ServerMultiTableDataSourceInfo.getServerInfo();
    if (rows.length > 0) {
        var options = [];
		if(rows.length == 1){
			options.push("<option value="+rows[0].sourceName+">"+rows[0].displayName+"</option>")
		}else{
			options.push("<option value=''><--请选择--></option>");
			$.each(rows, function (index, item) {
				var sourceName = item.sourceName;
				var displayName = item.displayName;
				var option = "<option value=" + sourceName + ">" + displayName + "</option>";
				options.push(option)
			});
		}
        $("#dataSource").append(options);
    }

}


$(document).ready(function () {
    getSource();
	var $dataSource = $("#dataSource");
	var selectedValue = $dataSource.val();
	if(selectedValue != ""){
		var options = [];
		var multiTable = ServerMultiTableDataSourceInfo.getMultiTableNames(selectedValue);
		if (multiTable.length > 0) {
            $.each(multiTable, function (index, item) {
                options.push("<option value =" + item + ">" + item + "</option>");
            });
            $("#multiRelation").append(options);
        }
	}else{
    $dataSource.change(function () {
        $("#multiRelation").empty();
		$("#multitable_wizard").empty();
		var selectValue = $(this).val();
        var options = [];
		options.push("<option value=''><--请选择--></option>")
        var multiTable = ServerMultiTableDataSourceInfo.getMultiTableNames(selectValue);
		console.log(multiTable);
        if (multiTable.length > 0) {
            $.each(multiTable, function (index, item) {
                options.push("<option value =" + item + ">" + item + "</option>");
            });
            $("#multiRelation").append(options);
        }
    });
}
    $("#multiRelation").change(function(){
		$("#multitable_wizard").empty();
        var multival = $(this).val();
        var dataSource =$("#dataSource").val();
        if(multival != undefined){
            var tableModel = ServerMultiTableDataSourceInfo.getMultiTableModel(dataSource, multival);
            if (tableModel != undefined) {
                var relationModelTemplate = FormViewTemplatesManager.getSelectedTemplate();
                relationModelTemplate.initTemplate(tableModel,dataSource);

                var mainTable = tableModel.tableName;
                var mainRows = [];
                if (mainTable != null) {
                    var slaveTables = tableModel.slaveTables;
                    $("#multitable_wizard").append("<div class=\"panel panel-default\"><div class=\"panel-heading\">" +
                        "主表 <span style=\"margin-left:20px;\">表名："+ mainTable +"</span></div><table class=\"table table-bordered\" id=" + mainTable + ">" +
                        "</table></div>");
                    if(tableModel.fields.length > 0){
                        $.each(tableModel.fields,function(index, item){
                            mainRows.push({field:item.column_name,data_type:item.data_type});
				
                            console.log(mainRows);
                        });
                        if(mainRows.length > 0){
                            $("#"+mainTable).bootstrapTable({columns:[{field:'field',title:'字段名'},{field:'data_type',title:'类型'}],data:mainRows});
                            console.log($("#"+mainTable));
                        }
                    }
                    if (slaveTables.length > 0) {
                        $.each(slaveTables, function (index, item) {
                            var slaveName = item.tableName;
                            var relation = item.relationType;
                            var slaveRows = [];
                            $("#multitable_wizard").append("<div class=\"panel panel-default\"><div class=\"panel-heading\">" +
                                "从表 <span style=\"margin-left:20px;margin-right:20px\">表名："+ slaveName + "</span> 关系：" + relation +"</div><table class=\"table table-bordered\" id=" + slaveName + ">" +
                                "</table></div>")
                            if(item.fields.length > 0){
                                $.each(item.fields,function(index,item){
                                    slaveRows.push({field:item.column_name,data_type:item.data_type});
                                });
                                if(slaveRows.length > 0){
                                    $("#"+slaveName).bootstrapTable({columns:[{field:'field',title:'字段名'},{field:'data_type',title:'类型'}],data:slaveRows});
                                }
                            }
                        });
                    }
                }
            }
        }
    });
});