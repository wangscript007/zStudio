package com.zte.mao.common.response;

import java.io.Serializable;

@SuppressWarnings("serial")
public class CommonResponse implements Serializable {
	public static final byte STATUS_SUCCESS = 1;
	public static final byte STATUS_FAIL = 0;
	public static final String MESSAGE_SUCCESS = "success";
    public static final String MESSAGE_FAIL = "fail";
	
	public static final String MESSAGE_STR = "message";
	public static final String STATUS_STR = "status";
	public static final String MESSAGE_TOKEN = "token";
	
	private byte status = STATUS_SUCCESS;
	private String message = "success";
	
	public CommonResponse() {
	}
	
	public CommonResponse(byte status, String message) {
		this.status = status;
		this.message = message;
	}
	public byte getStatus() {
		return status;
	}
	public void setStatus(byte status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
}
