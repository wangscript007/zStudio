package com.zte.iui.layoutit.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ContextLoader;

import com.google.gson.Gson;
import com.zte.iui.layoutit.bean.ProjectInfo;
import com.zte.iui.layoutit.bean.ReturnDatas;
import com.zte.iui.layoutit.bean.ReturnObjectData;
import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.page.LayoutitJSONDataSourceInit;
import com.zte.iui.layoutit.page.LayoutitMSBDataSourceInit;
import com.zte.iui.layoutit.page.LayoutitProject;
import org.apache.log4j.Logger;

/**
 * 表单设计器与服务端交互接口
 * 
 * @author dw、xjl、fzs
 * 
 */
@RequestMapping("/jersey-services/layoutit/")
@Controller
public class ProjectManagerController {
	private static Logger logger = Logger.getLogger(ProjectManagerController.class.getName());

	@Resource
	private LayoutitProject layoutitProject;
	
	@Resource
	private LayoutitMSBDataSourceInit msbDataSourceService;
	
	@Resource
	private LayoutitJSONDataSourceInit bfdDataSourceInitService;
	
	/**
	 * 获取所有工程信息
	 * @return
	 */
	@RequestMapping(value = "frame/projects/info", method = RequestMethod.GET,produces="application/json")
	@ResponseBody
	public List<ProjectInfo> getProjectsInfo() {
		try {
			return layoutitProject.getProjectsInfo();
		} catch (Exception e) {
			logger.error("获取工程信息失败");
			logger.error(e.getMessage(), e);
		}
		return new ArrayList<ProjectInfo>();
	}
	
	/**
	 * 获取工程详情
	 * @param projectName 工程名称
	 * @return
	 */	
	@RequestMapping(value = "frame/projects/get/{projectName}", method = RequestMethod.GET,produces="application/json")
	@ResponseBody
	public ProjectInfo getProject(@PathVariable("projectName") String projectName) {
		try {
			return layoutitProject.getProject(projectName);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("获取工程信息失败" + projectName);
		}
		return new ProjectInfo();
	}
	
	/**
	 * 获取工程数据源信息
	 * 数据源前缀中如果包含变量，则将数据源替换为实际变量值。
	 * @param projectName
	 * @param type 数据源类型
	 * @return
	 */
	@RequestMapping(value = "frame/project/datasource/get/{projectName}/{type}", method = RequestMethod.GET,produces="application/json")
    @ResponseBody
    public List<SourceInfo> getProjectDataSource(@PathVariable("projectName") String projectName,@PathVariable("type") String type) {
        try {
            return layoutitProject.getProjectFormatedDataSource(projectName,type);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            logger.error("获取工程数据源信息" + projectName);
        }
        return new ArrayList<SourceInfo>();
	}	
	
	
	/**
	 * 更新工程信息
	 * @param content 
	 * @return
	 */
	@RequestMapping(value = "frame/project/update", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas updateProjectInfo(@RequestBody String content) {
		String result;
		int status = ReturnDatas.SUCCESS;
		try {			
			Gson gson = new Gson();
			ProjectInfo projectInfo = gson.fromJson(content, ProjectInfo.class);
			layoutitProject.updateProjectInfo(projectInfo);
			result = "success";
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("更新工程信息失败" + content);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	/**
	 * 添加工程信息
	 * @param content 工程信息
	 * @return
	 */
	
	@RequestMapping(value = "frame/project/add", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas addProjectInfo(@RequestBody String content) {
		String result;
		int status = ReturnDatas.SUCCESS;
		try {			
			Gson gson = new Gson();
			ProjectInfo project = gson.fromJson(content, ProjectInfo.class);
			layoutitProject.addProject(project);
			result = "success";			
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("添加工程失败" + content);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	/**
	 * 删除工程信息
	 * @param projectName 工程名称
	 * @return
	 */
		
	@RequestMapping(value = "frame/project/delete/{projectName}", method = RequestMethod.DELETE,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas deleteProjectsInfo(
			@PathVariable("projectName") String projectName) {
		String result;
		int status = ReturnDatas.SUCCESS;
		try {
			layoutitProject.deleteProject(projectName);
			result = "success";
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("删除工程失败" + projectName);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	/**
	 * 备份工程信息
	 * @param projectName 工程名称
	 * @param fileName 设计文件名称
	 * @return
	 */
		
	@RequestMapping(value = "frame/project/backup/{projectName}/{fileName}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas backupProjects(
			@PathVariable("projectName") String projectName,@PathVariable("fileName") String fileName) {
		String result = "success";
		int status = ReturnDatas.SUCCESS;
		try {
			//备份设计文件
			if(projectName!= null && fileName != null){
				layoutitProject.backup(projectName, fileName);
			}	
			
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("备份工程信息失败" + projectName+"|"+fileName);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	/**
	 * 发布工程
	 * @param projectName 工程名称
	 * @return
	 */

	@RequestMapping(value = "frame/project/publish/{projectName}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas publishProjects(
			@PathVariable("projectName") String projectName) {
		String result = "success";
		int status = ReturnDatas.SUCCESS;
		try {			
			layoutitProject.publishProjects(projectName);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("工程发布失败" + projectName);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	/**
	 * 更新数据源信息
	 * @param projectName 工程名称
	 * @param content 工程信息
	 * @return
	 */
		
	@RequestMapping(value = "frame/project/datasource/update/{projectName}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas updateDataSource(
			@PathVariable("projectName") String projectName,@RequestBody String content) {
		String result = "success";
		int status = ReturnDatas.SUCCESS;
		try {			
			Gson gson = new Gson();
			SourceInfo datasource = gson.fromJson(content, SourceInfo.class);
			layoutitProject.updateDataSource(projectName, datasource);			
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("更新数据源失败：" + projectName + "|" + content);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	/**
	 * 添加数据源信息
	 * @param projectName 工程名称
	 * @param content 工程信息
	 * @return
	 */
	
	@RequestMapping(value = "frame/project/datasource/add/{projectName}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas addDataSource(
			@PathVariable("projectName") String projectName,@RequestBody String content) {
		String result = "success";
		int status = ReturnDatas.SUCCESS;
		try {			
			Gson gson = new Gson();
			SourceInfo datasource = gson.fromJson(content, SourceInfo.class);
			layoutitProject.addDataSource(projectName, datasource);			
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("添加数据源失败：" + projectName + "|" + content);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}

	/**
	 * 删除数据源信息
	 * @param projectName 工程名称
	 * @param dsName 数据源名称
	 * @return
	 */
	
	@RequestMapping(value = "frame/project/datasource/delete/{projectName}/{datasourceName}", method = RequestMethod.DELETE,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas deleteDataSource(
			@PathVariable("projectName") String projectName,
			@PathVariable("datasourceName") String dsName) {
		String result = "success";
		int status = ReturnDatas.SUCCESS;
		try {
			layoutitProject.deleteDataSource(projectName, dsName);			
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("删除数据源失败：" + projectName + "|" + dsName);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	
	/**
	 * 将MSB模型生成为表单设计器可识别的模型
	 * @param fileName 数据源文件名
	 * @param contents MSB文件内容
	 * @return 返回json文件路径
	 */
	@RequestMapping(value = "/frame/MSB2BFDModel/{filename}", method = RequestMethod.POST)
	@ResponseBody
	public ReturnObjectData MSBModel2BFD(
			@PathVariable("filename") String fileName,
			@RequestBody String contents) {
		ReturnObjectData data;
		try {
			/**
			 * 转换并生成新数据源json文件
			 */			
			String filePath = msbDataSourceService.generateJSONFileByMSBData(fileName,
					contents);
			
			/**
			 * 保存转换后的数据源到工程数据源列表
			 */
			bfdDataSourceInitService.addSourceInfo(new File(ContextLoader
					.getCurrentWebApplicationContext().getServletContext()
					.getRealPath("/")
					+ File.separator + filePath));
			/**
			 * 返回新数据源文件相对路径
			 */
			data = ReturnObjectData.getReturnData("", filePath,
					ReturnDatas.SUCCESS);
		} catch (Exception e) {
			data = ReturnObjectData.getReturnData(e.getMessage(), "",
					ReturnDatas.FAIL);
		}

		return data;
	}
	
}
