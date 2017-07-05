package com.zte.ums.bcp.orm.framework.request.entry;

public class RequestFileRecord {
	private String dbName;
	private String collectionName;
	private String fileId;
	private String fileType;
	private String fileName;

	/**
	 * 数据库名
	 * 
	 * @return
	 */
	public String getDbName() {
		return dbName;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	/**
	 * 获取表名
	 * 
	 * @return
	 */
	public String getCollectionName() {
		return collectionName;
	}

	public void setCollectionName(String collectionName) {
		this.collectionName = collectionName;
	}
	
	/**
	 * 文件唯一ID
	 * @return
	 */
	public String getFileId() {
		return fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}
	
	/**
	 * 文件类型
	 * @return
	 */
	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
	
	/**
	 * 文件名称
	 * @return
	 */
	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
}
