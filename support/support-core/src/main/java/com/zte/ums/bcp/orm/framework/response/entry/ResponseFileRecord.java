package com.zte.ums.bcp.orm.framework.response.entry;

import java.io.InputStream;

public class ResponseFileRecord {
	private InputStream inputStream;
	private String fileName;
	private String fileType;

	/**
	 * 获取文件流
	 * 
	 * @return
	 */
	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}
	
	/**
	 * 获取文件名
	 * @return
	 */
	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	
	/**
	 * 获取文件类型
	 * @return
	 */
	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
}
