package com.zte.iui.layoutit.bean;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class FileInfo implements Comparable<FileInfo> {
	public enum FileType {
		PAGE, COMPONENT
	}

	private String fileName = "fileName";
	private String filePath = "path";
	private String modifyTime = "";
	private String fullInfo = "";
	private String projectName = "";
	private String componentName = "";
	private String fileType = "";

	public FileInfo(String fileName, String filePath, String modifyTime) {
		super();
		this.fileName = fileName;
		this.filePath = filePath;
		this.modifyTime = modifyTime;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	// public String getCreateTime() {
	// return createTime;
	// }
	//
	// public void setCreateTime( String createTime ) {
	// this.createTime = createTime;
	// }

	public String getFullInfo() {
		return fullInfo;
	}

	public void setFullInfo(String fullInfo) {
		this.fullInfo = fullInfo;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	/**
	 * @return the projectName
	 */
	public String getProjectName() {
		return projectName;
	}

	/**
	 * @param projectName
	 *            the projectName to set
	 */
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	/**
	 * 获取组件名称
	 * 
	 * @return
	 */
	public String getComponentName() {
		return componentName;
	}

	/**
	 * 设置组件名称
	 * 
	 * @param componentName
	 */
	public void setComponentName(String componentName) {
		this.componentName = componentName;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	@Override
	public int compareTo(FileInfo file) {
		if (this.getFileType().equals(FileType.PAGE.toString())) {			
			return -1;
		}
		return 1;
	}
	
	@Override
	public boolean equals(Object  file) { 
		if (this.getFileType().equals(FileType.PAGE.toString())) {			
			return true;
		}
		return false;
	}

	// public boolean isUse() {
	// return isUse;
	// }
	//
	// public void setUse( boolean isUse ) {
	// this.isUse = isUse;
	// }

}
