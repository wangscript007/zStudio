/**
 * Created by 10041503 on 15-8-19.
 */

/**
 * 类定义
 * @constructor
 */
function MaoEnvBase() {
    this.ip = null;

	//当前登录用户信息
	this.currentUserPath = "mao/login/currentuser";
    this.user;
    //this.processUrls = null;
}

MaoEnvBase.prototype.getUrlPrefix = function () {
    return this.urlPrefix;
}

/**
 * 获取服务端IP
 */
MaoEnvBase.prototype.getIp = function () {
    if (this.ip == null) {
        this.ip = window.location.hostname;
        //this.webPort = window.location.port;
    }
    return this.ip;
}
/**
*加载当前登录用户信息
*/
MaoEnvBase.prototype.currentUserInfo = function() {
    var that = this;
    $.ajax({
        url: that.currentUserPath,
        type: 'GET',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {		
           if(data && data.status === 1){
               that.user = data.data;
		   }else{
			  console.error("get login user error:" + data);
			  return;
		   }
        },
        error: function (XMLHttpRequest,  textStatus, errorThrown) {
            console.error(textStatus+"|"+errorThrown);
        }
    });
}

function splitObj(data) {
    var url = data.split(",");
    return {ip: url[0], port: url[1]};
}

/**
	获取登录用户ID
*/
MaoEnvBase.prototype.getCurrentUserId = function(){
    if(this.user == undefined) {
        this.currentUserInfo();
    }
	return this.user.userid;
}

/**
	获取登录用户ID
*/
MaoEnvBase.prototype.getCurrentUser = function(){
    if(this.user == undefined) {
        this.currentUserInfo();
    }
	return this.user;
}
/**
	获取登录用户名称
*/
MaoEnvBase.prototype.getCurrentUserName = function(){
    if(this.user == undefined) {
        this.currentUserInfo();
    }
	return this.user.username;
}
/**
	获取登录用户密码
*/
MaoEnvBase.prototype.getCurrentUserPassword = function(){
    if(this.user == undefined) {
        this.currentUserInfo();
    }
	return this.user.password;
}
/**
	获取登录租户ID
*/
MaoEnvBase.prototype.getCurrentTenantId = function(){
    if(this.user == undefined) {
        this.currentUserInfo();
    }
	return this.user.tenantId;
}

/**
	获取登录租户是否为DEMO租户
*/
MaoEnvBase.prototype.isCurrentDemoTenant = function(){
    if(this.user == undefined) {
        this.currentUserInfo();
    }
	return this.user.isDemo;
}

MaoEnvBase.prototype.getOrmPort = function () {
    if (this.ormPort == null) {
        this.ormPort = window.location.port;
    }
    return this.ormPort;
}

var maoEnvBase = new MaoEnvBase();

