function addClick(){
    showModalDialog("dialog1475028659569", "新建类型", "add_package_type.html?operator=add");
};

function modifyClick(){
    var ids = getTableSelectData("table_base1471930724131");
    var cons = [];
    if(ids.length < 1){
        bootbox.alert("请选择数据");
    }else if(ids.length > 1){
        bootbox.alert("请选择一条数据修改");
    }else{
        showModalDialog("dialog1475028659569", "修改类型", "add_package_type.html?operator=edit&id="+ids[0]['ID']);
    }

};

function delClick(){
    var ids = getTableSelectData("table_base1471930724131");
    var cons = [];
    if(ids.length < 1){
        bootbox.alert("请选择数据");
    }else{
        $.each(ids, function(e,v){
            var con = new QueryCondition();
            con.setCName('id').setCompare('=').setValue(v['ID']);
            cons.push(con);
        });
        deleteRemoteTableData('table_base1471930724131', generateCondition(cons,'or'));
    }
};

function viewModelsClick(){
    bootbox.alert("暂未实现");
};

function searchClick(){
    var conditions = new Array();
    var typeName = $('#input_text1475044273821').val();
    if (typeName != null && typeName.length > 0) {
        var conditionName = new QueryCondition();
        conditionName.setCName('TYPENAME');
        conditionName.setCompare('like');
        conditionName.setValue('%' + typeName + '%');
        conditions.push(conditionName);
    }

    var creator = $('#input_text1471932156273').val();
    if(creator != null && creator.length> 0){
        var conCreator = new QueryCondition();
        conCreator.setCName('CREATOR');
        conCreator.setCompare('like');
        conCreator.setValue('%' + creator + '%');
        conditions.push(conCreator);
    }

    var time = $('#input_datetime1471932473169').val();
    if(time != null && time.length> 0){
        var conTimeEnd = new QueryCondition();
        conTimeEnd.setCName('CREATETIME');
        conTimeEnd.setCompare('<');
        conTimeEnd.setValue(time + " 23:59:59");
        conditions.push(conTimeEnd);

       /* var conTimeStart = new QueryCondition();
        conTimeStart.setCName('CREATETIME');
        conTimeStart.setCompare('>');
        conTimeStart.setValue(time + " 00:00:01");
        conditions.push(conTimeStart);*/
    }
    queryRemoteTable('table_base1471930724131', conditions);
    /*if(conditions.length > 0){
        queryRemoteTable('table_base1471930724131', conditions);
    }else{
        $("#table_base1471930724131").bootstrapTable().bootstrapTable('refresh');
    }*/
};

function vm1474531931934SuccessCallBack(obj){
    hideModalDialog('dialog1475028659569');
    $("#table_base1471930724131").bootstrapTable().bootstrapTable('refresh');
}