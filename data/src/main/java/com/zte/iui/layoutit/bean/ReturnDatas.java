package com.zte.iui.layoutit.bean;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ReturnDatas {
	
	public final static int SUCCESS = 1;
	public final static int FAIL = 0;

	//提示信息
	private String data = "";
	//1表示成功、0表示失败
	private int status = 1; 

	public String getData() {
		return data;
	}

	public ReturnDatas setData(String data) {
		this.data = data;
		return this;
	}

	public ReturnDatas setStatus(int status) {
		this.status = status;
		return this;
	}

	public int getStatus() {
		return status;
	}

	public static ReturnDatas getReturnDatas(String data, int status) {
		ReturnDatas datas = new ReturnDatas();
		datas.setData(data).setStatus(status);
		return datas;
	}

}
