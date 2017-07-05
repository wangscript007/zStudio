package com.zte.iui.layoutit.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zte.iui.layoutit.bean.CommonFile;
import com.zte.iui.layoutit.bean.FileContent;
import com.zte.iui.layoutit.bean.FileInfo;
import com.zte.iui.layoutit.bean.ProjectInfo;
import com.zte.iui.layoutit.bean.ReturnDatas;
import com.zte.iui.layoutit.bean.ReturnObjectData;
import com.zte.iui.layoutit.bean.SourceInfo;
import com.zte.iui.layoutit.bean.component.ModalDialogList;
import com.zte.iui.layoutit.bean.vm.OrganizePageVM;
import com.zte.iui.layoutit.common.AnalyzeParameter;
import com.zte.iui.layoutit.common.CommonConst;
import com.zte.iui.layoutit.common.FileOperation;
import com.zte.iui.layoutit.export.ExportService;
import com.zte.iui.layoutit.page.LayoutitFrameHtml;
import com.zte.iui.layoutit.page.LayoutitI18n;
import com.zte.iui.layoutit.page.LayoutitProject;
import com.zte.iui.layoutit.page.LayoutitTemplateService;

/**
 * 表单设计器与服务端交互接口
 * 
 * @author dw、xjl、fzs
 * 
 */
@RequestMapping("/jersey-services/layoutit/")
@Controller
public class FrameController {
	private static Logger logger = Logger.getLogger(FrameController.class.getName());

	@Resource
	private LayoutitProject layoutitProject;
	
	@Resource
	private ExportService exportService;
	
	
	/**
	 * 保存文件,如果该文件不存在,新建;存在则覆盖。
	 * @param CommonFile 文件基本信息 
	 * @return
	 */	
	@RequestMapping(value = "frame/file/save", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas saveFile(@RequestBody String content) {
		AnalyzeParameter analyzeParameter = null;
		ReturnDatas datas;
		try {
			analyzeParameter = new AnalyzeParameter(content.toString());
			FileOperation fileOperation = new FileOperation(analyzeParameter.getValue("filePath"), analyzeParameter.getValue("fileName"));
			fileOperation.writeTxtFile(analyzeParameter.getValue("content"));
			datas = ReturnDatas.getReturnDatas("success", ReturnDatas.SUCCESS);
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("文件新增失败，path：" + analyzeParameter.getValue("fileName"));
			datas = ReturnDatas.getReturnDatas(e.getMessage(), ReturnDatas.FAIL);
		}
		return datas;
	}
	
	/**
	 * 获取自定义js/css文件列表
	 * @param filePath
	 * @return
	 */	
	 @RequestMapping(value = "files/get", method = RequestMethod.GET,produces="application/json")
	 @ResponseBody
	public List<CommonFile> getCommonFiles(@RequestParam("filePath") String filePath) {
		List<CommonFile> commonFiles;
		try {
			FileOperation operation = new FileOperation(filePath);
			commonFiles = operation.getCommonFiles(filePath, true);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			commonFiles = new ArrayList<CommonFile>();
		}
		return commonFiles;
	}
	
	/**
	 * 获取自定义的单个js/css文件
	 * 
	 * @param filename
	 *            文件路径和文件名，其中:被替换为@，/被替换为$。<br />
	 *            例如：D@$code$bcp$src$layoutit3_web$src$lay.html
	 * @return
	 */
	
	
	@RequestMapping(value = "file/get", method = RequestMethod.GET,produces="application/json")
	@ResponseBody
	public ReturnObjectData getCommonFile(@RequestParam("filePath") String filePath,@RequestParam("fileName") String fileName) {
		FileOperation fileOperation = new FileOperation(filePath, fileName);
		int status = ReturnDatas.SUCCESS;
		CommonFile file = fileOperation.getCommonFile(filePath, fileName);
		String message = CommonConst.SUCCESS;
		if(file==null){
			message = CommonConst.ERROR;
			status = ReturnDatas.FAIL;
		}
		return ReturnObjectData.getReturnData(message, file, status);
	}
	/**
	 * 表单设计器初始界面调用该方法返回存储数据
	 * 
	 * @param filename
	 *            文件路径和文件名，其中:被替换为@，/被替换为$。<br />
	 *            例如：D@$code$bcp$src$layoutit3_web$src$lay.html
	 * @return
	 */
	@RequestMapping(value = "frame/html/get/{filename}", method = RequestMethod.GET,produces="application/json")
	@ResponseBody
	public ReturnDatas getFrameHtml(@PathVariable("filename") String filename) {
		LayoutitFrameHtml frameHtml = new LayoutitFrameHtml(filename, layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME));
		return ReturnDatas.getReturnDatas(frameHtml.fetch(), ReturnDatas.SUCCESS);
	}

	/**
	 * 添加框架文件
	 * @param filename 框架文件全名
	 * @return
	 * @throws Exception
	 */	
	@RequestMapping(value = "frame/html/add/{filename}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas addFrameHtml(@PathVariable("filename") String filename)
			throws Exception {
		LayoutitFrameHtml frameHtml = new LayoutitFrameHtml(filename, layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME));
		ReturnDatas datas;
		try {
			frameHtml.add();
			datas = ReturnDatas.getReturnDatas("success", ReturnDatas.SUCCESS);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("框架代码保添加失败，path：" + filename);
			datas = ReturnDatas.getReturnDatas("fail", ReturnDatas.FAIL);
		}
		return datas;
	}
	
	/**
	 * 验证文件是否存在
	 * @param filename
	 * @return
	 * @throws Exception
	 */
		
	@RequestMapping(value = "frame/html/validate/{filename}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas isFrameFileExists(@PathVariable("filename") String filename)
			throws Exception {
		LayoutitFrameHtml frameHtml = new LayoutitFrameHtml(filename, layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME));
		String result;
		int status = ReturnDatas.SUCCESS;
		try {
			if (!frameHtml.isExists()) {
				result = "success";
			} else {
				result = "error:存在同名设计文件！";
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("框架代码保添加失败，path：" + filename);
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	
	
	/**
	 * 框架文件重命名
	 * @param oldfilefullname 原文件名
	 * @param newfilefullname 新文件名
	 * @return
	 * @throws Exception
	 */	
		
	@RequestMapping(value = "frame/html/update/{oldfilefullname}/{newfilefullname}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas updateFrameFile(@PathVariable("oldfilefullname") String oldfilefullname,
			@PathVariable("newfilefullname") String newfilefullname) throws Exception {
		LayoutitFrameHtml frameHtml = new LayoutitFrameHtml(oldfilefullname, layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME));
		String result = "fail";
		int status = ReturnDatas.SUCCESS;
		try {
			if (frameHtml.rename(newfilefullname, layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME))) {
				result = "success";
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("框架代码重命名失败，oldfilefullname：" + oldfilefullname+"| newfilefullname"+newfilefullname);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}
	

	/**
	 * 删除框架文件
	 * @param filename 文件名
	 * @return
	 */	
	@RequestMapping(value = "frame/html/delete/{filename}", method = RequestMethod.DELETE,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas deleteFrameHtml(@PathVariable("filename") String filename) {
		LayoutitFrameHtml frameHtml = new LayoutitFrameHtml(filename, layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME));
		String result = "fail";
		int status = ReturnDatas.SUCCESS;
		try {
			//删除设计文件前，先备份一次。<2015-8-24>
			String targetDirPath = CommonConst.FRAME_FILE_BACKUP_PATH;	
			DateFormat  df = new SimpleDateFormat("yyyy_MM_dd_hh_mm_ss");
			String filePrefix = df.format(new Date());
			frameHtml.backupFrameFile(targetDirPath, filePrefix);
			frameHtml.delete();
			result = "success";	
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("框架代码删除失败，path：" + filename);
			status = ReturnDatas.FAIL;
			result = e.getMessage();
		}
		return ReturnDatas.getReturnDatas(result, status);
	}

	/**
	 * 保存设计文件，并生成页面文件
	 * @param filename 文件名
	 * @param content 文件内容
	 * @return
	 */
	
	@RequestMapping(value = "frame/html/save/{filename}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas save(@PathVariable("filename") String filename,
			@RequestBody String content, HttpServletRequest request) {
		LayoutitFrameHtml frameHtml = new LayoutitFrameHtml(filename, layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME));
		AnalyzeParameter analyzeParameter = null;
		try {
			analyzeParameter = new AnalyzeParameter(content.toString());
			frameHtml.update(analyzeParameter.getValue("frameContent"));
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("框架代码保存失败，path：" + filename);
		}
		if (analyzeParameter == null) {
			return ReturnDatas.getReturnDatas("fail", ReturnDatas.FAIL);
		}
		FileContent fileContent = new FileContent(filename);
		fileContent.setMeta(analyzeParameter.getValue("meta"))
				.setTitle(analyzeParameter.getValue("title"))
				.setCssImports(analyzeParameter.getValues("css"))
				.setJsImports(analyzeParameter.getValues("js"))
				.setBody(analyzeParameter.getValue("body"))
				.setSelfJsImports(analyzeParameter.getValues("selfjs"))
				.setSelfCssImports(analyzeParameter.getValues("selfcss"))
				.appendJsCode(analyzeParameter.getValue("jscode"));
		try {
			OrganizePageVM pageVM = new OrganizePageVM(
					analyzeParameter.getValues("pageVM"),analyzeParameter.getValues("selfi18n"));
			fileContent.appendJsCode(pageVM.getJSCode());
			fileContent.setPieceString(analyzeParameter.getValue("pieces"));
			fileContent.setDmid(analyzeParameter.getValue("dmid"));
			fileContent.setFieldMap(pageVM.getFields());

			ModalDialogList modalDialogList = new ModalDialogList(
					analyzeParameter.getValues("modaldialog"));

			fileContent.appendJsCode(modalDialogList.getJsCode());
			if(analyzeParameter.getValue("jsdoccode").equalsIgnoreCase("$(document).ready(function(){\n\n})")){
				fileContent.generateFile(request);
			}else{
				fileContent.appendJsCode(analyzeParameter.getValue("jsdoccode"));
				fileContent.generateFile(request);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("生成代码失败，path：" + filename);
			return ReturnDatas.getReturnDatas(e.getMessage(), ReturnDatas.FAIL);
		}
		return ReturnDatas.getReturnDatas("success", ReturnDatas.FAIL);
	}

	/**
	 * 生成空的html文件
	 * @param filename
	 * @return
	 */	
	@RequestMapping(value = "frame/html/save/empty/{filename}", method = RequestMethod.POST,consumes="application/json",produces="application/json")
	@ResponseBody
	public ReturnDatas saveEmptyFile(@PathVariable("filename") String filename, HttpServletRequest request) {
		FileContent fileContent = new FileContent(filename);
		try {
			fileContent.generateEmptyFile(request);
			fileContent.generateEmptyJs(request);
			return ReturnDatas.getReturnDatas("success", ReturnDatas.SUCCESS);
		}
		catch(Exception e) {
			logger.error(e.getMessage(), e);
		}
		return ReturnDatas.getReturnDatas("fail", ReturnDatas.FAIL);
	}
	
	
	/**
	 * 获取框架保存的文件，供界面打开新的设计文件使用
	 * @return
	 */	
	@RequestMapping(value = "frame/files/info", method = RequestMethod.GET,produces="application/json")
	@ResponseBody
	public Map<String, Object> getFrameFileInfo() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("total", 0);
		map.put("rows", new ArrayList<FileInfo>());
		try {
			FileOperation operation = new FileOperation(
					CommonConst.FRAME_FILE_PATH);
			List<FileInfo> fileInfo = operation.fetchFrameFileInfo(layoutitProject.getProject(LayoutitProject.DEFAULT_PROJECT_NAME));
			map.put("total", fileInfo.size());
			map.put("rows", fileInfo);
			
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		return map;
	}
	
	/**
	 * 根据设计文件名称获取数据源信息
	 * @param filename 设计文件名
	 * @return
	 */
	@RequestMapping(value = "frame/datasource/info/{filename}", method = RequestMethod.GET,produces="application/json")
	@ResponseBody
	public List<SourceInfo> getDataSourceInfo(
			@PathVariable("filename") String filename) {
		try {
			FileContent content = new FileContent(filename);
			ProjectInfo projectInfo = content.getProjectInfo();
			return projectInfo.getSourceList();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("获取文件数据源失败，文件：" + filename);
		}

		return new ArrayList<SourceInfo>();
	}
	
	
	
	/**
	 * 获取模板信息
	 *  
	 * @return
	 */
		
	@RequestMapping(value = "frame/templates/info", method = RequestMethod.GET,produces="application/json")
	@ResponseBody
	public ReturnObjectData getLayoutitTemplates() {		
		ReturnObjectData data;
		try {
			LayoutitTemplateService templates =new LayoutitTemplateService();
			data = ReturnObjectData.getReturnData("", templates.getLayoutitTemplates(), ReturnDatas.SUCCESS);
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
			data = ReturnObjectData.getReturnData(e.getMessage(), "", ReturnDatas.FAIL);
		}
		
		return data;		 
	}
	/**
	 * 获取国际化文件的key
	 * 
	 */
	@RequestMapping(value = "frame/file/i18n/get", method = RequestMethod.GET,produces="application/json")
    @ResponseBody
	public List<String> getI18nkey(@RequestParam("path") String path){
		LayoutitI18n layoutitI18n = new LayoutitI18n();
		List<String> i18nkeyList;
		try {
			i18nkeyList = layoutitI18n.getPropertiesKey(path);
			return i18nkeyList;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("删除数据源失败：");
		}
		 return new ArrayList<String>();
	}
	
	@SuppressWarnings({ "rawtypes"})
	@RequestMapping(value = "/frame/export", method = RequestMethod.POST)
	@ResponseBody
    public Map<String, String> export(HttpServletRequest request, HttpServletResponse response, @RequestBody Map data) throws Exception {
		String path = exportService.export(data.get("name").toString(), 
				Boolean.parseBoolean(data.get("isFrameFile").toString()), 
				Boolean.parseBoolean(data.get("isWar").toString()), 
				Boolean.parseBoolean(data.get("isContainOrm").toString()),
				Boolean.parseBoolean(data.get("isDockerImages").toString()));
		Map<String, String> map = new HashMap<String, String>();
		map.put("path", path);
		return map;
	}
	
	
	
}
