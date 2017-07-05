/**
 * get请求，服务端使用@Context UriInfo接收参数
 */
function getUriData() {
    $.ajax({
            async: true,
            cache: false,
            type: 'GET',
            dataType:"json",
            data:{sql:"select a, b from tb", array: ["a","b"], obj:{a:1, b:2}},
            url: "/designer/jersey-services/test/frame/html/get/uri/abc",
            success: function (data) {
                console.log(data);
            },
            error:function (XMLHttpRequest, textStatus, errorThrown){
                console.log(errorThrown);
            }
        }
    );


}


/**
 * post接口发送json格式数据，服务端使用formdata接收，服务端实现方法：com.zte.iui.layoutit.service.LayoutitRestTest.testFormdata
 */
function postFormdata() {
    $.ajax({
            async: true,
            cache: false,
            type: 'POST',
            dataType: "json",
            data: {name: 'test'},
            //contentType :'application/json; charset=UTF-8',
            url: "/designer/jersey-services/test/frame/formdata/",
            success: function (data) {
                console.log(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("请求服务[" + ajaxParameter.url + "]错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
            }
        }
    );
}

/**
 * post接口发送json格式数据，服务端使用httprequest接收，服务端实现方法：com.zte.iui.layoutit.service.LayoutitRestTest.testFormdataRequest
 */
function postFormdataRequest() {
    $.ajax({
            async: true,
            cache: false,
            type: 'POST',
            //dataType: "json",
            data: {name: 'test'},
            contentType :'application/x-www-form-urlencoded',
            url: "/designer/jersey-services/test/frame/formdatarequest/",
            success: function (data) {
                console.log(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }
    );
}

/**
 * 服务端接收对象，未通过
 */
function postFormobject() {
    $.ajax({
            async: true,
            cache: false,
            type: 'POST',
            dataType: "json",
            data: {user:{id:'id',name:'name'}},
            contentType :'application/x-www-form-urlencoded; charset=UTF-8',
            url: "/designer/jersey-services/test/frame/formobject/",
            success: function (data) {
                console.log(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }
    );
}

