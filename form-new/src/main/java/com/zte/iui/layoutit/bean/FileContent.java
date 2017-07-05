package com.zte.iui.layoutit.bean;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.JAXBException;

import org.apache.log4j.Logger;

import com.zte.iui.layoutit.common.CommonConst;
import com.zte.iui.layoutit.common.FileOperation;
import com.zte.iui.layoutit.common.JaxbReadXml;
import com.zte.iui.layoutit.common.JsonUtils;

public class FileContent {
	private static Logger logger = Logger.getLogger(FileContent.class.getName());
	private String fileName;
	private String directory;
	private String meta;
	private String title;
	private String[] cssImports;
	private String[] selfCssImports;
	private String[] jsImports;
	private String[] selfJsImports;
	private String body;
	private String jsCode = "";
	private String pagePath;
	private String projectName;
	private String projectPath;
	private ProjectInfo projectInfo;
	private Map<String, List<Field>> fieldMap;
	private String pieceString;
	private String dmid;
	private String importJs = "";
	private String importCss = "";

	
	
	


	public String getDmid() {
		return dmid;
	}

	public void setDmid(String dmid) {
		this.dmid = dmid;
	}

	public String getPieceString() {
		return pieceString;
	}

	public void setPieceString(String pieceString) {
		this.pieceString = pieceString;
	}

	public void setFieldMap(Map<String, List<Field>> fieldMap) {
		this.fieldMap = fieldMap;
	}

	public FileContent(String fileName) {
		try {
			loadProjectInfo();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
		setPath(fileName);	
	}

	public String getTitle() {
		return title;
	}

	public FileContent setTitle(String title) {
		this.title = title;
		return this;
	}

	public FileContent setSelfJsImports(String[] selfJsImports) {
		this.selfJsImports = selfJsImports;
		return this;
	}

	public FileContent setSelfCssImports(String[] selfCssImports) {
		this.selfCssImports = selfCssImports;
		return this;
	}

	public String getMeta() {
		return meta;
	}

	public FileContent setMeta(String meta) {
		this.meta = meta;
		return this;
	}

	public String[] getCssImports() {
		return cssImports;
	}

	public FileContent setCssImports(String[] cssImports) {
		this.cssImports = cssImports;
		return this;
	}

	public String[] getJsImports() {
		return jsImports;
	}

	public FileContent setJsImports(String[] jsImports) {
		this.jsImports = jsImports;
		return this;
	}

	public String getBody() {
		return body;
	}

	public FileContent setBody(String body) {
		this.body = body;
		return this;
	}

	public String getJsCode() {
		return jsCode;
	}

	public FileContent appendJsCode(String jsCode) {
		this.jsCode = this.jsCode + jsCode + "\n";
		return this;
	}

	private void generateHtmlFile(HttpServletRequest request) throws Exception {
		FileOperation operation = new FileOperation(directory, fileName
				+ CommonConst.GENERATOR_HTML_SUFFIX);
		StringBuffer buffer = new StringBuffer();

		String pageRelativePath = getPageRelativePath();

		// buffer.append( "<!DOCTYPE html>\n")
		buffer.append("<!DOCTYPE html>\n<html lang=\"zh-CN\">\n").append("<head>\n")
				.append("    <title>" + title + "</title>").append("\n")
				.append(meta).append("\n");
		for (String css : cssImports) {
			buffer.append("    <link href=\"" + pageRelativePath + css + "\" rel=\"stylesheet\">\n");
		}
		for(String css: selfCssImports) {
			if(dmid != null  && !dmid.equals("")){
				importCss += css + ",";
			}
			buffer.append("    <link href=\"" + css + "\" rel=\"stylesheet\">\n");
		}
		for (String js : jsImports) {
			buffer.append("    <script type=\"text/javascript\" src=\"" + pageRelativePath + js + "\"></script>\n");
		}
		buffer.append("    <script type=\"text/javascript\" src=\"" + pageRelativePath + this.projectName+"_common.js" + "\"></script>\n");
		//用户引用的自定义js
		for(String js : selfJsImports) {
			if(dmid != null  && !dmid.equals("")){
				importJs += js + ",";
			}
			buffer.append("    <script type=\"text/javascript\" src=\"" + js + "\"></script>\n");
		}
		buffer.append("    <script type=\"text/javascript\" src=\"" + fileName + CommonConst.GENERATOR_JS_SUFFIX + "\"></script>\n");
		
		
		buffer.append("</head> \n<body>\n").append(body).append("\n")
				.append("</body>\n</html>");
		operation.writeTxtFile(buffer.toString());
		
	}

	private void setPath(String filePath) {
		String path = filePath.replaceAll("\\@", ":").replaceAll("\\$", "/");		
		int index = path.lastIndexOf("/");
		if(filePath.indexOf("version=") > -1) {
			if(index > -1) {
				this.directory = projectInfo.getLocalPath() + path.substring(0, index + 1);
				String name = path.substring(index + 1);
				this.fileName = name.substring(0, name.indexOf("."));
			}
			else {
				this.directory = projectInfo.getLocalPath();
				this.fileName = path.substring(0, path.indexOf("."));
			}
		}
		else {
			this.directory = path.substring(0, index + 1);
			String name = path.substring(index + 1);
			this.fileName = name.substring(0, name.indexOf("."));
		}
		
		this.pagePath = path;
		if(path.indexOf("pname=") > -1){
			this.projectName = path.substring(path.indexOf("pname=")+6);
			if(this.projectName.contains("&")){
				this.projectName = this.projectName.substring(0,this.projectName.indexOf("&"));
			}		
		}
		else{
			this.projectName="default";
		}
	}
	
	private void loadProjectInfo() throws Exception {
		FormDesignerProject formProjects= JaxbReadXml.getFormDesignerProject();
		String pname=this.projectName;
		if(pname == null || pname.isEmpty()){
			pname="default";
		}
		
		this.setProjectInfo(formProjects.getProjectByName(pname));
		String tomcatPath = System.getProperty("catalina.home");
		this.projectPath = this.getProjectInfo().getLocalPath();
		if(!this.projectInfo.validateDataSource()){
			throw new Exception("数据源name不能为空，在工程内必须唯一存在，不能重复！");
		}		
	}	

	private void generateJsFile() throws Exception {
		FileOperation operation = new FileOperation(directory, fileName
				+ CommonConst.GENERATOR_JS_SUFFIX);
		operation.writeTxtFile(jsCode);
	}
	
	private void generateCommonJsFile() throws Exception {
		FileOperation operation = new FileOperation(this.projectPath, this.projectName+"_common"
				+ CommonConst.GENERATOR_JS_SUFFIX);
		operation.writeTxtFile(this.getProjectInfo().getProjectDataSourceJSCode());
		
	}

	private String getPageRelativePath() throws JAXBException {		
		String relativePath = "";
		if(pagePath.indexOf("version=") > -1) {
			String[] paths = pagePath.split("/");
			int pathLevel = paths.length -1;
			for(int i=pathLevel; i>0; i--) {
				relativePath += "../";
			}
		}
		else {
			if(this.projectPath != null){
				int projectPathIndex = this.pagePath.indexOf(this.projectPath);
				if (projectPathIndex > -1) {
					String pagePath = this.pagePath.replace(this.projectPath, "");
					String[] dir = pagePath.split("/");
					if (dir.length > 0) {
						for (int i = 0; i < dir.length - 1; i++) {
							relativePath += "../";
						}
					}
				}
			}
		}

		return relativePath;
	}	

	public void generateFile(HttpServletRequest request) throws Exception {
		generateJsFile();
		generateHtmlFile(request);
		generateCommonJsFile();
		if(dmid == null || dmid.equals("")){
			generateCsvFile();
		}else{
			generateJsonFile();
		}
		
	}
	
	/**
	 * 应BCP要求，需要生成空的html文件。
	 */
	public void generateEmptyFile(HttpServletRequest request) {
		FileOperation operation = new FileOperation(directory, fileName
				+ CommonConst.GENERATOR_HTML_SUFFIX);
		try {
			operation.writeTxtFile("");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	/**
	 * 应BCP要求，需要生成空的js文件。
	 */
	public void generateEmptyJs(HttpServletRequest request) {
		FileOperation operation = new FileOperation(directory, fileName
				+ CommonConst.GENERATOR_JS_SUFFIX);
		try {
			operation.writeTxtFile("");
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	
	private void generateCsvFile() throws Exception {
		if(fieldMap != null && fieldMap.size() > 0 && CommonConst.IS_CSV_FILE) {
 
			FileOperation operation = new FileOperation(directory, fileName
					+ CommonConst.GENERATOR_CSV_SUFFIX);
			StringBuffer buffer = new StringBuffer();
			String[] keys = fieldMap.keySet().toArray(new String[0]);
			for(String key : keys) {
				List<Field> fields = fieldMap.get(key);
				String[] split = key.split("##");
				for(Field item : fields) {
					//dsname,tablename, field
					buffer.append(split[0]).append(",").append(split[1]).append(",").append(item.getId()).append("\n");
					
				}
			}
			
			operation.writeTxtFile(buffer.toString());
		}
	}
	
	/**
	 * 生成json文件(不用生成csv文件)
	 */
	private void generateJsonFile() throws Exception {
		if(fieldMap != null && fieldMap.size() > 0 && CommonConst.IS_CSV_FILE) {
 
			FileOperation operation = new FileOperation(directory, fileName
					+ CommonConst.GENERATOR_JSON_SUFFIX);
			StringBuilder buffer = new StringBuilder();
			buffer.append("{");
			buffer.append("\"column\":[");
			String[] keys = fieldMap.keySet().toArray(new String[0]);
			for(int j=0;j<keys.length;j++) {
				List<Field> fields = fieldMap.get(keys[j]);
				String[] split = keys[j].split("##");
				List<StringBuilder> tmp = new ArrayList<StringBuilder>();
				for(int i=0;i<fields.size();i++){
					StringBuilder bufferfiles = new StringBuilder();
					bufferfiles.append("\"").append(split[0]).append(",").append(split[1]).append(",").append(fields.get(i).getId()).append("\"");
					tmp.add(bufferfiles);
				}
				for(int i=0;i<tmp.size();i++){
					if (i != 0) {
						buffer.append(",");
					}
					buffer.append(tmp.get(i));
				}
				if(j != keys.length-1){
					buffer.append(",");
				}
			}
			buffer.append("],");
			buffer.append("\"block\":[");
			buffer.append(pieceString);
			buffer.append("],");
			buffer.append("\"importJs\":");
			buffer.append("\"");
			buffer.append(importJs);
			buffer.append("\",");
			buffer.append("\"importCss\":");
			buffer.append("\"");
			buffer.append(importCss);
			buffer.append("\"");
			buffer.append("}");
			operation.writeTxtFile(JsonUtils.jsonFormat(buffer.toString()));
		}
	}
	/**
	 * @return the projectInfo
	 */
	public ProjectInfo getProjectInfo() {
		return projectInfo;
	}

	/**
	 * @param projectInfo the projectInfo to set
	 */
	public void setProjectInfo(ProjectInfo projectInfo) {
		this.projectInfo = projectInfo;
	}	

}
