package com.zte.iui.layoutit.bean;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CommonFile extends FileInfo implements Serializable{
	
	private static final long serialVersionUID = 1L;
	//文件内容
	private String content;
	
	public CommonFile(String fileName, String filePath, String modifyTime) {
		super(fileName, filePath, modifyTime);
	}


	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	


}
