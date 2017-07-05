/**
 *	提供模式对话框接口，
 *	@example showModalDialog("dialogid") 无标题静态对话框，对话框内容在页面中已定义。
 *  showModalDialog("dialogid",title) 有标题静态对话框，对话框内容在页面中已定义。
 *  showModalDialog("dialogid",title, uri) 有标题动态对话框，对话框内容由传入的url确定。
 *	@param id 	    对话框id
 *	@param title    对话框标题
 *  @param url    对话框url，url为父页面的相对路径
 *
 */
function showModalDialog(params){
    var id,
        uri,
        length = arguments.length;
    if(!params){
        throw new Error('输入参数不能为空');
    }
    if(length>3){
        throw new Error('只能输入1-3个参数');
    }

    id = arguments[0];

    if(id.charAt(0)!=="#"){
        id = '#'+id;
    }
    if(length==3){
        uri = arguments[2];
        var testHttpURL = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
			testRelativePath = /^(\.\.\/)*([\w-]+\/?)*[\w-]+.html([\?\s\S]*)?$/;
	
		 
        if(uri.indexOf("?")>-1){
            setPageParams(uri.slice(uri.indexOf("?")+1));
        }

        $(id).find(".modal-title").text(arguments[1]);
		
		if(testHttpURL.test(uri)){
			$(id).find('.modal-body').dialogLoad(uri);
		}else if(testRelativePath.test(uri)){
			var sourceOrigin = location.origin;
			
			var sourcePath = location.pathname;  
			var pathRegx = /[\w-]+\//ig;
			var pathResult = sourcePath.match(pathRegx);
			
				
			var relativeRegex = /\.\.\//ig;  
			var relativeResult = uri.match(relativeRegex);
			for(var i in relativeResult){
				pathResult.pop();
			}
				
			
			uri = sourceOrigin+"/"+pathResult.join("")+uri.replace(relativeRegex,"");
			$(id).find('.modal-body').dialogLoad(uri);
			
		}else{
			alert("传入的uri的格式有误。");
            return;
		}

    }else if(length==2){
        $(id).find(".modal-title").text(arguments[1]);
    }


    var $dialog = $(id).find(".modal-dialog");
    if(!$dialog.data("ly-params")){
        $dialog.css("width","1080px");
        $dialog.children('.modal-content').children('.modal-body').css("min-height","600px").css("overflow","auto");
    }else{
        var params = $dialog.data("ly-params");
        $dialog.css("width",params.compwidth);
        $dialog.children('.modal-content').children('.modal-body').css("min-height",params.compheight).css("overflow","auto");
        $dialog.removeAttr("data-ly-params");
    }

    $(id).modal({
        backdrop: 'static',
        show:true,
		keyboard:false
    }).on("hidden.bs.modal",function(){
        $(id).find(".modal-body").empty();
        pageParams = undefined;
    });

}


/**
 * 自定义手动关闭对话框
 * @author freedom
 * @param id 对话框id
 */
function hideModalDialog(id){
    if(id){
        $('#'+id).modal('hide');
    }
}

function clearDiaologHtml(html,url){
    var csses = [],
        jses = [],
        relativePathRegex = /\.\.\//ig,
        pathRegx = /\/[\w.]+/ig;
    var filename = function(fileUrl){
        return fileUrl.replace(relativePathRegex,"");
    }

    var reconstruction = function(jquery,attr){
        var href =  jquery.attr(attr);
        var results =  href.match(relativePathRegex);
        var http = url.match(/http:\/\/[^/]+\//ig);
        if(http == null) {
            http = [];
        }
        var params = url.match(/\?[\s\S]*/ig);
        var relativePath = "";
        if(http) {
            if (params == null) {
                relativePath = url.replace(http[0], "");
            } else {
                relativePath = url.replace(http[0], "").replace(params[0], "");
            }
        }

        var relativeArr = relativePath.match(/[\w-]+\//ig);
        if(relativeArr == null) {
            relativeArr = [];
        }
        for(var result in results){
            relativeArr.pop();
            href = href.replace("../","");
        }
        jquery.attr(attr,http.join("")+relativeArr.join("")+href);
    }



    $("script").each(function(){
        var script = $(this);
        if(script.attr("src")){
            jses.push(filename(script.attr("src")));
        }
    });

    $("head>link").each(function(){
        var css = $(this);
        if(css.attr("href")){

            csses.push(filename(css.attr("href")));
        }
    });

    html.find("link").each(function(){
        var $link = $(this);
        if(jQuery.inArray( filename($link.attr("href")), csses )!=-1){
            $link.remove();
        }else{
            reconstruction($link,"href");
        }
    });

    html.find("script").each(function(){
        var $script = $(this);
        if(jQuery.inArray(filename($script.attr("src")), jses )!=-1){
            if($script.attr("src").indexOf("layoutitPageLoad") == -1) {
                $script.remove();
            }else{
                reconstruction($script,"src");
            }
        }else{
            reconstruction($script,"src");
        }
    });


    return html;
}


/**
 *	自定义对话框远程加载页面
 *
 *	@author  freedom
 *	@wiki  http://api.jquery.com/load/
 *	@example dialogLoad(url),dialogLoad("test.php", { "choices[]": [ "Jon", "Susan" ] })
 *	@param url
 *	@param params
 *	@param callback
 *
 */
jQuery.fn.dialogLoad = function( url, params, callback ) {

    if ( typeof url !== "string" && _load ) {
        return _load.apply( this, arguments );
    }

    var selector, response, type,
        self = this,
        off = url.indexOf(" ");

    if ( off >= 0 ) {
        selector = url.slice( off, url.length );
        url = url.slice( 0, off );
    }

    // If it's a function
    if ( jQuery.isFunction( params ) ) {

        // We assume that it's the callback
        callback = params;
        params = undefined;

        // Otherwise, build a param string
    } else if ( params && typeof params === "object" ) {
        type = "POST";
    }

    // If we have elements to modify, make the request
    if ( self.length > 0 ) {
        jQuery.ajax({
            url: url,

            // if "type" variable is undefined, then "GET" method will be used
            type: type,
            dataType: "html",
            data: params
        }).done(function( responseText ) {

                // Save response for use in complete callback
                response = arguments;
                if(selector){
                    self.html(jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ));
                }else{

                    var parseHtmlTrue = jQuery('<div>').append( jQuery.parseHTML( responseText,true ) );
                    parseHtmlTrue.find("div.container").each(function(){
                        $(this).removeClass("container");
                    });
                    /* 				var sumbitBtn = parseHtmlTrue.find('button[ms-click="submit"]');
                     var viewModel = parseHtmlTrue.find('div[ms-controller]').attr("ms-controller");

                     sumbitBtn.removeAttr("ms-click").click(function(){
                     //eval(viewModel+".submit()");
                     evalFunc(viewModel+".submit()");
                     });

                     self.parent().find(".modal-footer").append(sumbitBtn); */
                    try {
                        self.html(clearDiaologHtml(parseHtmlTrue,url));
						self.removeClass('bfd-body-background');
                    }
                    catch(err) {
                        console.error(err);
                    }
                }

            }).complete( callback && function( jqXHR, status ) {
                self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
            });
    }

    return this;
};

