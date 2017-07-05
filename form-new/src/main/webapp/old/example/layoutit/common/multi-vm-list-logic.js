function formatUrlParams(){
    var params = {};
    
    var tableAreaSelectData = getTableSelectData("table_base1475890591243");
    if(tableAreaSelectData.length == 0){
        bootbox.alert("请选择要查看详情的数据行！");
        return false;
    }
    
    params["asset_area"] =[];
    params["asset_area"].push({"cname":"ID","compare":"=","value":tableAreaSelectData[0]["ID"]});
    params["asset_area"].push({"cname":"NAME","compare":"=","value":tableAreaSelectData[0]["NAME"]});
    
    
    var tableAsetSelectData = getTableSelectData("table_base1475890644611");
    if(tableAsetSelectData.length == 0){
        bootbox.alert("请选择要查看详情的数据行！");
        return false;
    }
    
    params["asset_inst_base"] = [];
    params["asset_inst_base"].push({"cname":"ID","compare":"=","value":tableAsetSelectData[0]["ID"]});
    params["asset_inst_base"].push({"cname":"NAME","compare":"=","value":tableAsetSelectData[0]["NAME"]});
  
    return params;
}

function showDetail(){
    var params = formatUrlParams();
    if(params){
       var url = "multi-vm-detail.html?operator=view&bfd_page_params_detail="+encodeURIComponent(JSON.stringify(params));
       window.location.href = url;  
    }
}