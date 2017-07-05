package com.zte.iui.layoutit.page;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.zte.iui.layoutit.bean.FileInfo;
import com.zte.iui.layoutit.bean.FormDesignerProject;
import com.zte.iui.layoutit.bean.ProjectInfo;
import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.common.CommonConst;
import com.zte.iui.layoutit.common.CommonUtility;
import com.zte.iui.layoutit.common.FileOperation;
import com.zte.iui.layoutit.common.JaxbReadXml;

@Service
public class LayoutitProject {
	
	public static final String DEFAULT_PROJECT_NAME = "default";
	
	private FormDesignerProject formProjects;
	
	private boolean isCopyDesignerFile = false;
	
	public LayoutitProject() throws Exception{
		 formProjects = JaxbReadXml.getFormDesignerProject();
	}
	
	/**
	 * 更新工程信息
	 * @param content
	 * @throws Exception 
	 */	
	public void updateProjectInfo(ProjectInfo project) throws Exception{
		//加载旧工程配置				
		ProjectInfo oldProject = formProjects.getProjectByName(project.getProjectName());
		String oldLocalPath = oldProject.getLocalPath();
		String oldCommonjsPath = oldProject.getCommonjsPath();
		String oldCommoncssPath = oldProject.getCommoncssPath();
		String oldPublishPath = oldProject.getPublishPath();		
		
		//工程信息变化后，更改工程设计文件信息
		updateProjectFrameFiles(project,oldLocalPath);		
		
		//如果工程下用户自定义js路径变化，复制原路径下的文件到新路径中。
		copyProjectCommonJS(project,oldCommonjsPath);
		
		//如果工程下用户自定义css路径变化，复制原路径下的文件到新路径中。
		copyProjectCommonCSS(project,oldCommoncssPath);
		
		//发布路径变化后，发布一次工程到新路径
		if(!oldPublishPath.equalsIgnoreCase(project.getPublishPath())){
			publishProjects(project.getProjectName());
		}
		
		//更新工程配置信息
		formProjects.updateProjects(project);
		JaxbReadXml.writeXML(formProjects);
	}
	
	/**
	 * 工程信息变化后，更改工程设计文件信息
	 * @param project 新工程信息
	 * @param oldProject 更改前的工程信息
	 * @throws Exception
	 */
	private void updateProjectFrameFiles(ProjectInfo project,String oldProjectLocalPath) throws Exception{
		if(project.getLocalPath().equalsIgnoreCase(oldProjectLocalPath)){
			return;
		}
		
		//工程路径变更后，复制原路径下的文件到新路径下。
		formProjects.updateProjects(project);
		JaxbReadXml.writeXML(formProjects);	
		 
		FileOperation.copyDirectiory(oldProjectLocalPath, project.getLocalPath());
		
		//重新更新框架文件
		FileOperation frame = new FileOperation(CommonConst.FRAME_FILE_PATH);
		List<FileInfo> files =frame.fetchFrameFileInfo(project);
		for(FileInfo file : files){
			if(file.getProjectName().equalsIgnoreCase(project.getProjectName())) {
				String filePath = file.getFilePath();
				if(!filePath.endsWith("/")){
					filePath+="/";
				}
				//如果设计文件中不包含原工程的路径，不做处理。
				if(!filePath.contains(oldProjectLocalPath)){
					continue;
				}
				
				//设计文件中如果包含原工程路径，重新计算框架文件路径，并生成在新工程路径下的文件。				
				filePath = filePath.replace(oldProjectLocalPath,"").replace("/", "$");
				if(!filePath.isEmpty() && !filePath.endsWith("$")){
					filePath += "$";
				}
				
				String newFileFullName = project.getLocalPath().replaceAll(":","@").replace("/","$");
				newFileFullName += filePath	+file.getFileName()+"&pname="+project.getProjectName();
				
				LayoutitFrameHtml html = new LayoutitFrameHtml(file.getFullInfo(), this.getProject(DEFAULT_PROJECT_NAME));					
				html.rename(newFileFullName, this.getProject(DEFAULT_PROJECT_NAME));
			}
		}
	}
	
	/**
	 * 如果工程下用户自定义js路径变化，复制原路径下的文件到新路径中。
	 * @param project
	 * @param oldProject
	 * @throws IOException 
	 */
	private void copyProjectCommonJS(ProjectInfo project,String oldProjectCommonjsPath) throws IOException{
		//如果工程下用户自定义js路径变化，复制原路径下的文件到新路径中。
		if(project.getCommonjsPath().equalsIgnoreCase(oldProjectCommonjsPath)){
			return ;
		}
		String sourcePath = project.getLocalPath()+File.separator+oldProjectCommonjsPath;
		String targetPath = project.getLocalPath()+File.separator+project.getCommonjsPath();
		FileOperation.copyDirectiory(sourcePath, targetPath);
	}
	
	/**
	 * 如果工程下用户自定义js路径变化，复制原路径下的文件到新路径中。
	 * @param project
	 * @param oldProject
	 * @throws IOException 
	 */
	private void copyProjectCommonCSS(ProjectInfo project,String oldProjectCommoncssPath) throws IOException{
		//如果工程下用户自定义js路径变化，复制原路径下的文件到新路径中。
		if(project.getCommoncssPath().equalsIgnoreCase(oldProjectCommoncssPath)){
			return ;
		}
		String sourcePath = project.getLocalPath()+File.separator+oldProjectCommoncssPath;
		String targetPath = project.getLocalPath()+File.separator+project.getCommoncssPath();
		FileOperation.copyDirectiory(sourcePath, targetPath);
	}
	
	/**
	 * 备份工程下当前文件的设计文件和源码文件
	 * @param projectName
	 * @param fileFullName
	 * @throws Exception 
	 */
	public void backup(String projectName,String fileFullName) throws Exception{
		if(fileFullName.isEmpty() || projectName.isEmpty()){
			return;
		}
		
		ProjectInfo currentProject = formProjects.getProjectByName(projectName);
		if(currentProject == null){
			return;
		}
		
		DateFormat  df = new SimpleDateFormat("yyyy_MM_dd_hh_mm_ss");
		String backupDirSuffix = df.format(new Date());		
		LayoutitFrameHtml frameHtml = new LayoutitFrameHtml(fileFullName, this.getProject(DEFAULT_PROJECT_NAME));
		
		//备份框架设计文件
		String frameFileTargetPath = CommonConst.FRAME_FILE_BACKUP_PATH;			
		frameHtml.backupFrameFile(frameFileTargetPath,backupDirSuffix);
		//备份源文件
		frameHtml.backupSourceFileInSameDir(backupDirSuffix);		 
	}
	/**
	 * 获取工程配置信息
	 * @param projectName
	 * @return
	 */
	public ProjectInfo getProject(String projectName){
		return formProjects.getProjectByName(projectName);
	}
	
	/**
	 * 获取工程数据源信息
	 * 数据源前缀中如果包含变量，则会转换成具体的值
	 * @param projectName
	 * @return
	 */
	public List<SourceInfo> getProjectFormatedDataSource(String projectName,String type){
        return formProjects.getProjectByName(projectName).getFormatedDataSource(type);
    }
    
	
	/**
	 * 获取所有工程配置信息
	 * @return
	 */
	public List<ProjectInfo> getProjectsInfo(){
		return formProjects.getProjectList();
	}
	
	
	
	/**
	 * 添加工程配置
	 * @param project
	 * @throws Exception 
	 */
	public void addProject(ProjectInfo project) throws Exception{		
		formProjects.addProject(project);
		JaxbReadXml.writeXML(formProjects);				
	}
	
	/**
	 * 删除工程
	 * @param projectName 工程名称
	 * @throws Exception 
	 */
	public void deleteProject(String projectName) throws Exception{
		ProjectInfo project = formProjects.getProjectByName(projectName);
		//删除配置信息
		formProjects.deleteProject(project);
		JaxbReadXml.writeXML(formProjects);	
	}
	
	/**
	 * 发布工程
	 * @param projectName 工程名
	 * @throws IOException
	 */	 
	public void publishProjects(String projectName) throws IOException{
		ProjectInfo project = formProjects.getProjectByName(projectName);
		if (project != null) {			
			String localPath = project.getLocalPath();
			String publishPath =project.getPublishPath();
			if(!localPath.equalsIgnoreCase(publishPath)){
				FileOperation.copyDirectiory(localPath, publishPath);
			}
			
			//拷贝js和css目录到publish目录下
			if(!isCopyDesignerFile) {
				String designerPath = CommonUtility.getDesignerPath();
				FileOperation.copyDirectiory(designerPath + "/css", publishPath + "/css");
				FileOperation.copyDirectiory(designerPath + "/js", publishPath + "/js");
				FileOperation.copyDirectiory(designerPath + "/runtime", publishPath + "/runtime");
				isCopyDesignerFile = true;
			}
		}
	}
	
	/**
	 * 更新数据源信息
	 * @param projectName 工程名
	 * @param datasource 数据源信息
	 * @throws Exception 
	 */
	public void updateDataSource(String projectName, SourceInfo datasource) throws Exception{
		formProjects.updateDataSource(projectName, datasource);
		JaxbReadXml.writeXML(formProjects);
	}
	
	/**
	 * 添加数据源配置信息
	 * @param projectName 工程名
	 * @param datasource 数据源信息
	 * @throws Exception 
	 */
	public void addDataSource(String projectName,SourceInfo datasource) throws Exception{	
		formProjects.addDataSource(projectName, datasource);
		JaxbReadXml.writeXML(formProjects);
	}
	
	/**
	 * 删除数据源配置信息
	 * @param projectName 工程名
	 * @param dsName 数据源名称
	 * @throws Exception
	 */
	public void deleteDataSource(String projectName,String dsName) throws Exception{
		formProjects.deleteDataSource(projectName, dsName);
		JaxbReadXml.writeXML(formProjects);
	}
	
	public boolean isDataSourceExist(String projectName,SourceInfo datasource) throws Exception{	
		return formProjects.isDataSourceExist(projectName, datasource);		
	}
}
