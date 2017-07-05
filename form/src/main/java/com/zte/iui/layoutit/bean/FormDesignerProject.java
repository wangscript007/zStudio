package com.zte.iui.layoutit.bean;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "root")
@XmlAccessorType(XmlAccessType.FIELD)
public class FormDesignerProject {

	@XmlAttribute(name = "frameFilePath")
	private String frameFilePath = null;

	@XmlAttribute(name = "isCsvFile")
	private String isCsvFile = null;

	@XmlElement(name = "project")
	private List<ProjectInfo> projectList = null;

	/**
	 * @return the projectList
	 */
	public List<ProjectInfo> getProjectList() {
		return projectList;
	}

	/**
	 * @param projectList
	 *            the projectList to set
	 */
	public void setProjectList(List<ProjectInfo> projectList) {
		this.projectList = projectList;
	}

	/**
	 * 获取项目信息
	 * */
	public ProjectInfo getProjectByName(String projectName) {
		ProjectInfo project = null;
		for (ProjectInfo p : this.projectList) {
			if (p.getProjectName().equalsIgnoreCase(projectName)) {
				project = p;
			}
		}

		return project;
	}

	public String getFrameFilePath() {
		return frameFilePath;
	}

	public void setFrameFilePath(String frameFilePath) {
		this.frameFilePath = frameFilePath;
	}

	/**
	 * 更新工程信息
	 * @param project 工程信息
	 * @return
	 * @throws Exception 
	 */
	public void updateProjects(ProjectInfo project) throws Exception {
		if (project == null || this.projectList == null) {
			throw new Exception("工程信息为空！");
		}

		boolean hasProject = false;
		for (ProjectInfo item : this.projectList) {
			if (item.getProjectName()
					.equalsIgnoreCase(project.getProjectName())) {
				item.setLocalPath(project.getLocalPath());
				item.setPreviewPort(project.getPreviewPort());
				item.setPreviewPrefix(project.getPreviewPrefix());
				item.setPublishPath(project.getPublishPath());
				item.setCommonjsPath(project.getCommonjsPath());
				item.setCommoncssPath(project.getCommoncssPath());
				item.setIsI18n(project.getIsI18n());
				hasProject = true;
				break;
			}
		}

		if (!hasProject) {
			throw new Exception("工程信息不存在！");
		}
		
	}

	/**
	 * 添加工程信息
	 * @param project
	 * @throws Exception
	 */
	public void addProject(ProjectInfo project) throws Exception {
		if (project == null) {
			throw new Exception("工程信息为空！");
		}

		if (this.projectList == null) {
			this.projectList = new ArrayList<ProjectInfo>();
		}

		boolean hasProject = false;
		for (ProjectInfo item : this.projectList) {
			if (item.getProjectName()
					.equalsIgnoreCase(project.getProjectName())) {
				hasProject = true;
				break;
			}
		}

		if (hasProject) {
			throw new Exception("工程添加失败，存在同名工程信息！");			
		}
		
		this.projectList.add(project);		
	}

	/**
	 * 删除工程信息
	 * @param project
	 * @throws Exception 
	 */
	public void deleteProject(ProjectInfo project) throws Exception {
		if (project == null || this.projectList == null) {
			throw new Exception("工程删除失败，工程信息为空！");	
		}

		this.projectList.remove(project);
	}

	/**
	 * 更新数据源信息
	 * @param projectName 工程名
	 * @param datasource 数据源信息
	 * @throws Exception 
	 */
	public void updateDataSource(String projectName, SourceInfo datasource) throws Exception {
		ProjectInfo project = this.getProjectByName(projectName);
		if (project == null) {
			throw new Exception("工程信息不存在！");
		}

		List<SourceInfo> sourceList = project.getSourceList();
		if (sourceList == null) {
			throw new Exception("数据源信息不存在！");
		}

		boolean hasSourceInfo = false;
		for (SourceInfo item : sourceList) {
			if (item.getSourceName().equalsIgnoreCase(datasource.getSourceName())
					&& item.getType().equalsIgnoreCase(datasource.getType())) {
				item.setDisplayName(datasource.getDisplayName());
				item.setIp(datasource.getIp());
				item.setPort(datasource.getPort());
				item.setUriPrefix(datasource.getUriPrefix());

				hasSourceInfo = true;
				break;
			}
		}

		if (!hasSourceInfo) {
			throw new Exception("待更新的数据源信息不存在！");			
		} 
		
		project.setSourceList(sourceList);
	}
	/**
	 * 判断数据源是否存在
	 * @param projectName
	 * @param datasource
	 * @return
	 * @throws Exception
	 */
	public boolean isDataSourceExist(String projectName, SourceInfo datasource) throws Exception {
		ProjectInfo project = this.getProjectByName(projectName);
		if (project == null) {
			throw new Exception("工程信息为空！");
		}

		List<SourceInfo> sourceList = project.getSourceList();
		if (sourceList == null) {
			sourceList = new ArrayList<SourceInfo>();
		}

		boolean hasSourceInfo = false;
		for (SourceInfo item : sourceList) {
			if (item.getSourceName().equalsIgnoreCase(datasource.getSourceName()) 
					&& item.getType().equalsIgnoreCase(datasource.getType())) {
				hasSourceInfo = true;
				break;
			}
		}

		return hasSourceInfo;
	}

	/**
	 * 新增数据源
	 * @param projectName 工程名
	 * @param datasource 数据源信息
	 * @throws Exception
	 */
	public void addDataSource(String projectName, SourceInfo datasource) throws Exception {
		ProjectInfo project = this.getProjectByName(projectName);
		if (project == null) {
			throw new Exception("工程信息为空！");
		}

		List<SourceInfo> sourceList = project.getSourceList();
		if (sourceList == null) {
			sourceList = new ArrayList<SourceInfo>();
		}

		boolean hasSourceInfo = false;
		for (SourceInfo item : sourceList) {
			if (item.getSourceName().equalsIgnoreCase(datasource.getSourceName())
					&& item.getType().equalsIgnoreCase(datasource.getType())) {
				hasSourceInfo = true;
				break;
			}
		}

		if (hasSourceInfo) {
			throw new Exception("数据源添加失败，存在同名数据源信息！");
		}
		
		sourceList.add(datasource);
		project.setSourceList(sourceList);
	}

	/**
	 *  删除数据源
	 * @param projectName 工程名
	 * @param dsName 数据源名
	 * @throws Exception
	 */
	public void deleteDataSource(String projectName, String dsName) throws Exception {
		ProjectInfo project = this.getProjectByName(projectName);
		if (project == null) {
			throw new Exception("工程信息为空！");
		}

		List<SourceInfo> sourceList = project.getSourceList();
		if (sourceList == null) {
			throw new Exception("工程数据源信息为空！");
		}

		SourceInfo sourceInfo = null;
		for (SourceInfo item : sourceList) {
			if (item.getSourceName().equalsIgnoreCase(dsName)) {
				sourceInfo = item;
				break;
			}
		}

		if (sourceInfo == null) {
			throw new Exception("工程数据源信息删除失败，未找到相关数据源信息！");
		}
		
		sourceList.remove(sourceInfo);
	}

	/**
	 * @return the isCsvFile
	 */
	public String getIsCsvFile() {
		return isCsvFile;
	}

	/**
	 * @param isCsvFile
	 *            the isCsvFile to set
	 */
	public void setIsCsvFile(String isCsvFile) {
		this.isCsvFile = isCsvFile;
	}
}
