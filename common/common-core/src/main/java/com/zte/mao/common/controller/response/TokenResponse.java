package com.zte.mao.common.controller.response;

import com.zte.mao.common.response.CommonResponse;

public class TokenResponse extends CommonResponse {
	private static final long serialVersionUID = 1L;
	private String token;
	
	public TokenResponse(byte status, String message, String token) {
		super(status, message);
		this.token = token;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
