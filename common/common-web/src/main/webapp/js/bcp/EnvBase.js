/**
 * Created by 10041503 on 15-8-19.
 */

/**
 * 类定义
 * @constructor
 */
function EnvBase() {
    this.ip = null;

	this.ictPort = null;
    this.webPort = null;
    this.ormPort = null;
    this.formPort = null;
    this.formPath = "/bpm/userforms";
    this.formDesignerPort = null;
    this.formDesignerDir = "..$webapps$cos$formfiles$";
	//当前登录用户信息
	this.currentUserPath = "/bpm/mao/login/currentuser";
	this.urlPrefix = "/bpm";
	this.bpmPrefix = "/bpe";
	this.ormPrefix = "/bpm";
}

EnvBase.prototype.getUrlPrefix = function () {
    return this.urlPrefix;
}

EnvBase.prototype.getBpmPrefix = function() {
	return this.bpmPrefix;
}

EnvBase.prototype.getOrmPrefix = function() {
	return this.ormPrefix;
}

/**
 * 获取服务端IP
 */
EnvBase.prototype.getIp = function () {
    if (this.ip == null) {
        this.ip = window.location.hostname;
        //this.webPort = window.location.port;
    }
    return this.ip;
}

EnvBase.prototype.getIctPort = function () {
    if (this.ictPort == null) {
        this.ictPort = window.location.port;
    }
    return this.ictPort;
}

EnvBase.prototype.getWebPort = function () {
    if (this.webPort == null) {
        this.webPort = window.location.port;
    }
    return this.webPort;
}

EnvBase.prototype.getFormPort = function () {
    if (this.formPort == null) {
        this.formPort = window.location.port;
    }
    return this.formPort;
}

EnvBase.prototype.getFormPath = function () {
    return this.formPath;
}

EnvBase.prototype.getOrmPort = function () {
    if (this.ormPort == null) {
        this.ormPort = window.location.port;
    }
    return this.ormPort;
}

EnvBase.prototype.getFormDesignerDir = function () {
    return this.formDesignerDir;
}

EnvBase.prototype.getFormDesignerPort = function () {
    if (this.formDesignerPort == null) {
        this.formDesignerPort = window.location.port;
    }
    return this.formDesignerPort;
}
/**
*加载当前登录用户信息
*/
EnvBase.prototype.currentUserInfo = (function(that,$){
	var user = {};	
	var url = "http://"+that.getIp();
	if(that.getIctPort() != ""){
		url += ":"+that.getIctPort();
	}
	url += that.currentUserPath;
	//+":"+that.getIctPort()+that.currentUserPath;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {		
           if(data && data.status === 1){
			  user = data.data;			  
		   }else{
			  console.log("get login user error:"+data); 			  
			  return;
		   }
        },
        error: function (XMLHttpRequest,  textStatus, errorThrown) {
            console.log(textStatus+"|"+errorThrown);
        }
    });
	return user;
})(new EnvBase(),jQuery)
/**
	获取登录用户ID
*/
EnvBase.prototype.getCurrentUserId = function(){
	return this.currentUserInfo.userid;
}
/**
	获取登录用户名称
*/
EnvBase.prototype.getCurrentUserName = function(){
	return this.currentUserInfo.username;
}
/**
	获取登录用户密码
*/
EnvBase.prototype.getCurrentUserPassword = function(){
	return this.currentUserInfo.password;
}
/**
	获取登录租户ID
*/
EnvBase.prototype.getCurrentTenantId = function(){
	return this.currentUserInfo.tenantId;
}

var envBase = new EnvBase();

