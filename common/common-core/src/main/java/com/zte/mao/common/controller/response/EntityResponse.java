package com.zte.mao.common.controller.response;

import com.zte.mao.common.response.CommonResponse;

public class EntityResponse extends CommonResponse {
	private static final long serialVersionUID = 1L;
	private Object userEntity;
	
	public EntityResponse(byte status, String message, Object userEntity) {
		super(status, message);
		this.userEntity = userEntity;
	}

	public Object getUserEntity() {
		return userEntity;
	}

	public void setUserEntity(Object userEntity) {
		this.userEntity = userEntity;
	}
	
}
