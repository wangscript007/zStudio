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
		if (this.getFileType() == FileType.PAGE.toString()) {			
			return -1;
		}
		return 1;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((componentName == null) ? 0 : componentName.hashCode());
		result = prime * result + ((fileName == null) ? 0 : fileName.hashCode());
		result = prime * result + ((filePath == null) ? 0 : filePath.hashCode());
		result = prime * result + ((fileType == null) ? 0 : fileType.hashCode());
		result = prime * result + ((fullInfo == null) ? 0 : fullInfo.hashCode());
		result = prime * result + ((modifyTime == null) ? 0 : modifyTime.hashCode());
		result = prime * result + ((projectName == null) ? 0 : projectName.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		FileInfo other = (FileInfo) obj;
		if (componentName == null) {
			if (other.componentName != null)
				return false;
		} else if (!componentName.equals(other.componentName))
			return false;
		if (fileName == null) {
			if (other.fileName != null)
				return false;
		} else if (!fileName.equals(other.fileName))
			return false;
		if (filePath == null) {
			if (other.filePath != null)
				return false;
		} else if (!filePath.equals(other.filePath))
			return false;
		if (fileType == null) {
			if (other.fileType != null)
				return false;
		} else if (!fileType.equals(other.fileType))
			return false;
		if (fullInfo == null) {
			if (other.fullInfo != null)
				return false;
		} else if (!fullInfo.equals(other.fullInfo))
			return false;
		if (modifyTime == null) {
			if (other.modifyTime != null)
				return false;
		} else if (!modifyTime.equals(other.modifyTime))
			return false;
		if (projectName == null) {
			if (other.projectName != null)
				return false;
		} else if (!projectName.equals(other.projectName))
			return false;
		return true;
	}
}
