$(document).ready(function(){
	//$(".glyphicon-class").hide();
	$(".bs-glyphicons li").click(function(){				
		$(".selectedIcon").removeClass("selectedIcon");
		$(this).addClass("selectedIcon");
	});
	
	$("#saveIconStyle").click(function(){
		saveIconStyle();				
	});

	$("#saveToolbarIconStyle").click(function () {
		saveToolbarIconStyle();
	});



});
		
function GetQueryString(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
   var r = pageParams.substr(0).match(reg);
   if (r!=null) return (r[2]); return null;
}

function saveIconStyle() {
	debugger;
	var selectedIcon=$(".selectedIcon").find(".glyphicon:first");
	var iconStyle="";
	if(selectedIcon !=undefined){
		iconStyle=selectedIcon.attr("class");				
	}
	var parentContainerID=GetQueryString("id"),
		type = GetQueryString('type');
	if(type && type === 'tab-toolbar-icon') {
		$("#" + parentContainerID).attr('data-icon', iconStyle);
		$("#"+parentContainerID).parent().find('.toolbar-input-function').trigger('blur');
	}
	else {
		$("#" + parentContainerID).val(iconStyle);
		$("#" + parentContainerID).trigger("blur");
	}
}

function saveToolbarIconStyle() {
	var selectedIcon=$(".selectedIcon").find("i");
	var iconStyle="";
	if(selectedIcon !=undefined){
		iconStyle=selectedIcon.attr("class");
	}
	var btnid = GetQueryString("btn-id");
	$("#"+btnid).attr("data-icon", iconStyle);
	$("#"+btnid).parent().find('.toolbar-input-uri').trigger('blur');
}