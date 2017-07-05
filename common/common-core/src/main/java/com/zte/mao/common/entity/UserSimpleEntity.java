package com.zte.mao.common.entity;

public class UserSimpleEntity {
	private long tenantId = 0;
	private String loginName;
	private String email;
	private String mobile;
	private boolean isDemo;

	public UserSimpleEntity(long tenantId, String loginName, String email, String mobile, boolean isDemo) {
		this.tenantId = tenantId;
		this.loginName = loginName;
		this.email = email;
		this.mobile = mobile;
		this.isDemo = isDemo;
	}
	
	public long getTenantId() {
		return tenantId;
	}
	public void setTenantId(long tenantId) {
		this.tenantId = tenantId;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public boolean isDemo() {
		return isDemo;
	}
	public void setDemo(boolean isDemo) {
		this.isDemo = isDemo;
	}
}
