package com.zte.iui.layoutit.bean;

public class ReturnObjectData {

	private String message;
	
	private int status = ReturnDatas.SUCCESS;
	
	private Object data;

	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}
	
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public static ReturnObjectData getReturnData(String message,Object data, int status){
		ReturnObjectData returnData = new ReturnObjectData();
		returnData.setMessage(message);
		returnData.setData(data);
		returnData.setStatus(status);
		return returnData;
	}

}
