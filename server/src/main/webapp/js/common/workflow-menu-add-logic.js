function initFormData(){
    debugger;
    var operator = getUrlParam("operator",pageParams);
    if(operator == "add"){
        var parentKey = getUrlParam("parentKey",pageParams);
        $("#input_text1469584377250").val(parentKey);  
    }else{
        var name = getUrlParam("NAME",pageParams);
        var key = getUrlParam("KEY",pageParams);
        var parentKey = getUrlParam("PARENT_KEY",pageParams);
        var url = getUrlParam("URL",pageParams);
        var order = getUrlParam("ORDER",pageParams);  
        
        $("#input_text1469584255512").val(name);  
        $("#input_text1469584344625").val(key);  
        $("#input_text1469584377250").val(parentKey);  
        $("#input_text1469584431673").val(order);  
        $("#textarea1469584462932").val(url);  
    }
}

$(document).ready(function(){
   $("#button1469753395326").click(function(){
       debugger;
       showModalDialog("dialog1469778004764", "选择图标","icon.html");
       
   });
   initFormData();
});
