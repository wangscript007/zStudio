package com.zte.mao.common.entity;

import com.zte.mao.common.config.ConfigManage;

public interface CommonConst {
	String PLATFORM_TYPE_DESIGN = "design";
	String PLATFORM_TYPE_MOCK = "mock";
	String PLATFORM_TYPE_RUNTIME = "runtime";
	String COOKIES_MOCK_USER_NAME = "mock_mao_user_token";
	String COOKIES_USER_NAME = ConfigManage.getInstance().getPlatformType() + "_mao_user_token";
	String MOCK_ADDRESS_PORT = "9080";
	String DESIGNER_ADDRESS_PORT = "8080";
	String COOKIES_PLATFORM_TYPE = "platform_type";
	String DATABASE = "database";
	String LOGIN_LOG = "登陆";
	String LOGINOUT_LOG = "退出";
	final int TENANT_TYPE_DEMO = 2;
}
